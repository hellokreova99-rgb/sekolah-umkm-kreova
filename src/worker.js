// Sekolah UMKM Kreova — server sekolah virtual v3 (Cloudflare Worker + Durable Object)
// Fitur: murid saling lihat & sapa, absen harian, Dinding Angkatan Pertama, voting Kotak Usulan,
// kartu murid dengan akun IG, link undangan, Pasar Sekolah (lapak lengkap + halaman lapak sendiri,
// harus disetujui admin), laporan lapak, halaman admin.
import { DurableObject } from "cloudflare:workers";

// HARUS sama urutannya dengan FRASA di public/game.js
const FRASA = ["Halo, semua!", "Salam kenal!", "Jualan apa, kak?", "Semangat jualan!", "Ayo ke Kotak Usulan!", "Mantap!", "Terima kasih!", "Sampai ketemu di kelas!", "Hadir, Bu Naya!"];
const KATEGORI = ["Fashion", "Makanan & Minuman", "Kecantikan", "Kerajinan", "Rumah Tangga", "Jasa", "Produk Digital", "Lainnya"];
const JUMLAH_PILIHAN = 5;
// Putaran voting Kotak Usulan. Ganti teks ini untuk memulai putaran baru (hasil putaran lama tetap tersimpan).
// Putaran 1 (vote:2026-11-23) dimenangkan "Untung bocor" -> Kelas 01.
const VOTE_PUTARAN = "putaran-2";
const MAKS_ONLINE = 150;
const DINDING_MAKS = 1000;   // murid ke-1 s.d. ke-1000 = Angkatan Pertama
const LAPAK_PILIHAN = 3;     // jumlah lapak yang dipajang di peta Pasar Sekolah
const SYARAT_UNDANGAN = 3;   // undangan sah untuk membuka lahan lapak
const ABSEN_SAH = 2;         // teman yang diundang dihitung sah setelah absen di 2 hari berbeda
const ANTRIAN_MAKS = 200;
const LAPORAN_MAKS = 300;
const FOTO_MAKS = 3;
const FOTO_BYTE_MAKS = 220 * 1024;
// Link toko online hanya boleh ke situs ini (dan subdomainnya)
const DOMAIN_TOKO = ["shopee.co.id", "shp.ee", "tokopedia.com", "tokopedia.link", "tiktok.com", "lynk.id", "instagram.com", "facebook.com", "fb.com", "lazada.co.id", "blibli.com", "bukalapak.com"];
// Kata yang disensor (huruf kecil). Tambah sendiri bila perlu.
const KATA_TERLARANG = ["anjing", "bangsat", "babi", "kontol", "memek", "ngentot", "goblok", "tolol", "bajingan", "asu", "jancok", "kampret", "judi", "slot", "togel"];
const W = 1080, H = 2880;

function sensor(s) { for (const k of KATA_TERLARANG) s = s.replace(new RegExp("\\b" + k + "\\b", "gi"), "***"); return s; }
function bersihkan(teks, maks) {
  let s = String(teks ?? "").replace(/[<>\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u206f]/g, "").replace(/\s+/g, " ").trim().slice(0, maks);
  s = sensor(s);
  // Cegah tautan & nomor HP di teks publik (anti-spam/penipuan). Link & WA punya kolom sendiri.
  s = s.replace(/(https?:\/\/|www\.)\S+/gi, "").replace(/\b\S+\.(com|id|co|net|org|link|ly|me|shop|store)\b/gi, "").replace(/(\+?62|0)8[\d\s-]{7,}/g, "");
  return s.replace(/\s+/g, " ").trim();
}
function bersihkanIG(v) {
  let s = String(v ?? "").trim().toLowerCase();
  const m = s.match(/instagram\.com\/([a-z0-9._]+)/); if (m) s = m[1];
  s = s.replace(/^@+/, "").replace(/[^a-z0-9._]/g, "").slice(0, 30);
  return /^[a-z0-9._]{2,30}$/.test(s) ? s : "";
}
function bersihkanWA(v) {
  let s = String(v ?? "").replace(/[^\d+]/g, "");
  if (s.startsWith("+")) s = s.slice(1);
  if (s.startsWith("0")) s = "62" + s.slice(1);
  if (s.startsWith("8")) s = "62" + s;
  return /^628\d{7,12}$/.test(s) ? s : "";
}
function bersihkanLink(v) {
  let s = String(v ?? "").trim(); if (!s) return "";
  if (!/^https?:\/\//i.test(s)) s = "https://" + s;
  let u; try { u = new URL(s); } catch (e) { return null; }
  if (u.protocol !== "https:" && u.protocol !== "http:") return null;
  const host = u.hostname.toLowerCase();
  if (!DOMAIN_TOKO.some(d => host === d || host.endsWith("." + d))) return null;
  u.protocol = "https:"; u.username = ""; u.password = "";
  const hasil = u.toString(); return hasil.length <= 300 ? hasil : null;
}
function bersihkanLook(l) {
  const n = (v, maks) => { v = Number(v); return Number.isInteger(v) && v >= 0 && v < maks ? v : 0; };
  l = l && typeof l === "object" ? l : {};
  return { k: n(l.k, 3), b: n(l.b, 6), r: n(l.r, 3), h: n(l.h, 6) };
}
function koordinat(x, y) {
  x = Math.round(Number(x)); y = Math.round(Number(y));
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return { x: Math.min(Math.max(x, 0), W), y: Math.min(Math.max(y, 0), H) };
}
function idAcak(n = 10) { const c = "abcdefghijkmnpqrstuvwxyz23456789"; let s = ""; for (let i = 0; i < n; i++) s += c[Math.floor(Math.random() * c.length)]; return s; }
function slugDari(usaha) { const s = String(usaha).toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 28) || "lapak"; return s + "-" + idAcak(3); }
function esc(s) { return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
// Tanggal & minggu menurut WIB (UTC+7)
function hariIni(ms = Date.now()) { return new Date(ms + 7 * 3600e3).toISOString().slice(0, 10); }
function kemarin(ms = Date.now()) { return hariIni(ms - 86400e3); }
function json(data, status = 200) { return new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } }); }
function samaAman(a, b) { a = String(a || ""); b = String(b || ""); if (!a || a.length !== b.length) return false; let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0; }
function fotoDariDataURL(d) {
  const m = /^data:image\/jpeg;base64,([A-Za-z0-9+/=]+)$/.exec(String(d || "")); if (!m) return null;
  let bin; try { bin = atob(m[1]); } catch (e) { return null; }
  if (bin.length < 200 || bin.length > FOTO_BYTE_MAKS) return null;
  const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  if (u[0] !== 0xFF || u[1] !== 0xD8) return null;
  return u.buffer;
}

export class Sekolah extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair("ping", "pong"));
    this.batas = new Map();
    this.ctx.blockConcurrencyWhile(async () => {
      const d = await this.ctx.storage.get(["total", "dinding", "lapak", "antrian", "laporan"]);
      this.total = d.get("total") || 0;
      this.dinding = d.get("dinding") || [];
      this.lapak = d.get("lapak") || [];
      this.antrian = d.get("antrian") || [];
      this.laporan = d.get("laporan") || [];
      // Migrasi: lapak lama (sebelum v3) = Lapak Perintis, dapat alamat halaman sendiri
      let ubah = false;
      for (const l of this.lapak) if (!l.slug) { l.slug = slugDari(l.usaha); l.perintis = true; l.v = 3; ubah = true; }
      if (ubah) await this.ctx.storage.put("lapak", this.lapak);
    });
  }

  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/admin/api/")) return this.admin(request, url);
    if (url.pathname.startsWith("/lapak/")) return this.halamanLapak(url);
    if (url.pathname.startsWith("/foto/")) return this.foto(url);
    if (url.pathname === "/api/lapak" && request.method === "POST") return this.ajukanLapak(request);
    if (url.pathname === "/api/lapor" && request.method === "POST") return this.lapor(request);
    if (request.headers.get("Upgrade") !== "websocket") return new Response("Butuh WebSocket", { status: 426 });
    const [klien, server] = Object.values(new WebSocketPair());
    this.ctx.acceptWebSocket(server);
    if (this.terdaftar().length >= MAKS_ONLINE) {
      server.send(JSON.stringify({ t: "penuh" }));
      server.close(1013, "penuh");
    } else {
      server.serializeAttachment({ id: idAcak(), masuk: false });
    }
    return new Response(null, { status: 101, webSocket: klien });
  }

  terdaftar() { return this.ctx.getWebSockets().filter(ws => { const a = ws.deserializeAttachment(); return a && a.masuk; }); }
  kirim(ws, pesan) { try { ws.send(JSON.stringify(pesan)); } catch (e) {} }
  kirimKe(uid, pesan) { for (const ws of this.terdaftar()) { const a = ws.deserializeAttachment(); if (a.uid === uid) this.kirim(ws, pesan); } }
  siarkan(pesan, kecuali) { const teks = JSON.stringify(pesan); for (const ws of this.terdaftar()) if (ws !== kecuali) { try { ws.send(teks); } catch (e) {} } }
  dataPublik(a) { return { id: a.id, nama: a.nama, jualan: a.jualan, look: a.look, x: a.x, y: a.y, beruntun: a.beruntun || 0 }; }
  lapakDari(uid) { return this.lapak.find(l => l.uid === uid) || null; }
  ringkasLapak(l) { return { usaha: l.usaha, kategori: l.kategori, slug: l.slug, perintis: !!l.perintis, deskripsi: (l.deskripsi || "").slice(0, 90), foto: (l.produk || []).map(p => p.foto).filter(Boolean)[0] || null, wa: l.izinWA && l.wa ? true : false, link: !!l.link }; }
  nilaiLengkap(l) { return (l.pin ? 1000 : 0) + (l.produk || []).filter(p => p.foto).length * 10 + (l.deskripsi ? 5 : 0) + ((l.izinWA && l.wa) || l.link ? 5 : 0); }
  lapakPublik() {
    const urut = this.lapak.map((l, i) => ({ l, i })).sort((a, b) => (this.nilaiLengkap(b.l) - this.nilaiLengkap(a.l)) || (a.i - b.i));
    return { pilihan: urut.slice(0, LAPAK_PILIHAN).map(x => this.ringkasLapak(x.l)), semua: this.lapak.map(l => this.ringkasLapak(l)), syarat: SYARAT_UNDANGAN };
  }
  async hasilVote(minggu) { return (await this.ctx.storage.get("vote:" + minggu)) || new Array(JUMLAH_PILIHAN).fill(0); }
  bolehLapak(uid, p) { return !!this.lapakDari(uid) || ((p.undangan && p.undangan.sah) || 0) >= SYARAT_UNDANGAN; }
  statusSaya(uid, p) {
    const h = hariIni(); const l = this.lapakDari(uid); const q = this.antrian.find(x => x.uid === uid);
    let lapak = null;
    const isiDari = x => ({ usaha: x.usaha, kategori: x.kategori, deskripsi: x.deskripsi || "", produk: x.produk || [], wa: x.wa || "", izinWA: !!x.izinWA, link: x.link || "", legal: x.legal || "" });
    if (q) lapak = { status: "menunggu", usaha: q.usaha, kategori: q.kategori, slug: l ? l.slug : null, tampil: !!l, perintis: !!(l && l.perintis), isi: isiDari(q) };
    else if (l) lapak = { status: "tampil", usaha: l.usaha, kategori: l.kategori, slug: l.slug, perintis: !!l.perintis, isi: isiDari(l) };
    else if (p.lapak && (p.lapak.status === "ditolak" || p.lapak.status === "dihapus")) lapak = { status: p.lapak.status, usaha: p.lapak.usaha, kategori: p.lapak.kategori, alasan: p.lapak.alasan || "" };
    return {
      no: p.no, ig: p.ig || "", kode: p.kode || "",
      absen: { beruntun: p.absen ? (p.absen.akhir === h || p.absen.akhir === kemarin() ? p.absen.beruntun : 0) : 0, jumlah: p.absen ? p.absen.jumlah : 0, sudahHariIni: !!(p.absen && p.absen.akhir === h) },
      vote: p.vote && p.vote.minggu === VOTE_PUTARAN ? p.vote.n : null,
      undangan: { masuk: (p.undangan && p.undangan.masuk) || 0, sah: (p.undangan && p.undangan.sah) || 0, syarat: SYARAT_UNDANGAN },
      bolehLapak: this.bolehLapak(uid, p),
      lapak
    };
  }
  // Pastikan murid punya kode undangan sendiri
  async pastikanKode(uid, p) {
    if (p.kode) return false;
    for (let i = 0; i < 6; i++) { const k = idAcak(6); if (!(await this.ctx.storage.get("kode:" + k))) { p.kode = k; await this.ctx.storage.put("kode:" + k, uid); return true; } }
    return false;
  }
  // Teman yang diundang jadi sah setelah absen di ABSEN_SAH hari berbeda
  async cekUndanganSah(uid, p) {
    if (!p.diundang || p.undanganSah || !p.absen || p.absen.jumlah < ABSEN_SAH) return;
    p.undanganSah = true;
    const pengundang = await this.ctx.storage.get("u:" + p.diundang);
    if (!pengundang) return;
    pengundang.undangan = pengundang.undangan || { masuk: 0, sah: 0 };
    pengundang.undangan.sah += 1;
    await this.ctx.storage.put("u:" + p.diundang, pengundang);
    this.kirimKe(p.diundang, { t: "status", saya: this.statusSaya(p.diundang, pengundang) });
    this.kirimKe(p.diundang, { t: "galat", teks: "Undanganmu sah: " + p.nama + " sudah absen " + ABSEN_SAH + " hari!" });
  }

  async webSocketMessage(ws, pesan) {
    if (typeof pesan !== "string" || pesan.length > 2000) return;
    let m; try { m = JSON.parse(pesan); } catch (e) { return; }
    if (!m || typeof m !== "object") return;
    const a = ws.deserializeAttachment() || {};
    const kini = Date.now();

    if (m.t === "masuk") {
      if (a.masuk || !a.id) return;
      const uid = String(m.uid || "").replace(/[^a-z0-9]/g, "").slice(0, 32);
      if (uid.length < 8) return this.kirim(ws, { t: "galat", teks: "Identitas perangkat tidak valid. Muat ulang halaman." });
      const nama = bersihkan(m.nama, 16) || "Murid";
      const jualan = bersihkan(m.jualan, 24);
      const look = bersihkanLook(m.look);
      const ig = bersihkanIG(m.ig);
      const pos = koordinat(m.x, m.y) || { x: 300, y: 2470 };
      let p = await this.ctx.storage.get("u:" + uid);
      if (!p && m.baru !== true) { this.kirim(ws, { t: "reset" }); return; }
      if (!p) {
        this.total += 1;
        p = { nama, jualan, look, ig, no: this.total, tglDaftar: hariIni(), absen: null, vote: null, lapak: null, undangan: { masuk: 0, sah: 0 } };
        // Daftar lewat link undangan teman
        const ref = String(m.ajak || "").replace(/[^a-z0-9]/g, "").slice(0, 8);
        if (ref) {
          const uidPengundang = await this.ctx.storage.get("kode:" + ref);
          if (uidPengundang && uidPengundang !== uid) {
            const pg = await this.ctx.storage.get("u:" + uidPengundang);
            if (pg) {
              p.diundang = uidPengundang;
              pg.undangan = pg.undangan || { masuk: 0, sah: 0 }; pg.undangan.masuk += 1;
              await this.ctx.storage.put("u:" + uidPengundang, pg);
              this.kirimKe(uidPengundang, { t: "status", saya: this.statusSaya(uidPengundang, pg) });
            }
          }
        }
        await this.pastikanKode(uid, p);
        if (p.no <= DINDING_MAKS) this.dinding.push({ no: p.no, nama });
        await this.ctx.storage.put({ ["u:" + uid]: p, total: this.total, dinding: this.dinding });
      } else {
        let ubah = await this.pastikanKode(uid, p);
        if (p.nama !== nama || p.jualan !== jualan || JSON.stringify(p.look) !== JSON.stringify(look) || (ig && p.ig !== ig)) {
          await this.gantiNama(uid, p, nama);
          p.jualan = jualan; p.look = look; if (ig) p.ig = ig; ubah = true;
        }
        if (ubah) await this.ctx.storage.put("u:" + uid, p);
      }
      const st = this.statusSaya(uid, p);
      Object.assign(a, { masuk: true, uid, nama: p.nama, jualan: p.jualan, look: p.look, x: pos.x, y: pos.y, beruntun: st.absen.beruntun, tGerak: 0, tObrol: 0, tAksi: 0 });
      ws.serializeAttachment(a);
      const semua = this.terdaftar();
      const minggu = VOTE_PUTARAN;
      this.kirim(ws, {
        t: "selamat", id: a.id, nama: p.nama, online: semua.length, total: this.total,
        murid: semua.map(s => this.dataPublik(s.deserializeAttachment())),
        saya: st,
        dunia: { dinding: { total: Math.min(this.total, DINDING_MAKS), terbaru: this.dinding.slice(-30).reverse() }, lapak: this.lapakPublik(), vote: { minggu, hasil: await this.hasilVote(minggu) } }
      });
      this.siarkan({ t: "masuk", p: this.dataPublik(a) }, ws);
      this.siarkan({ t: "jumlah", online: semua.length, total: this.total });
      return;
    }
    if (!a.masuk) return;

    if (m.t === "gerak") {
      if (kini - a.tGerak < 150) return;
      const pos = koordinat(m.x, m.y); if (!pos) return;
      a.x = pos.x; a.y = pos.y; a.tGerak = kini; ws.serializeAttachment(a);
      this.siarkan({ t: "gerak", id: a.id, x: a.x, y: a.y }, ws);
      return;
    }
    if (m.t === "ngobrol") {
      if (kini - a.tObrol < 1200) return;
      const i = Number(m.i); let teks = null;
      if (Number.isInteger(i) && i >= 0 && i < FRASA.length) teks = FRASA[i];
      else if (i === 100) { const t = this.terdaftar().map(s => s.deserializeAttachment()).find(s => s.id === m.ke); teks = "Halo, " + (t ? t.nama : "kak") + "!"; }
      if (!teks) return;
      a.tObrol = kini; ws.serializeAttachment(a);
      this.siarkan({ t: "ngobrol", id: a.id, teks });
      return;
    }
    // aksi yang menyentuh penyimpanan: batasi 1 per 0,8 detik
    if (kini - (a.tAksi || 0) < 800) return this.kirim(ws, { t: "galat", teks: "Pelan-pelan, coba lagi sebentar." });
    a.tAksi = kini; ws.serializeAttachment(a);
    const kunci = "u:" + a.uid;

    if (m.t === "ubah") {
      const p = await this.ctx.storage.get(kunci); if (!p) return;
      const nama = bersihkan(m.nama, 16) || p.nama;
      await this.gantiNama(a.uid, p, nama);
      p.jualan = bersihkan(m.jualan, 24); p.look = bersihkanLook(m.look);
      const ig = bersihkanIG(m.ig); if (ig) p.ig = ig;
      await this.ctx.storage.put(kunci, p);
      a.nama = p.nama; a.jualan = p.jualan; a.look = p.look; ws.serializeAttachment(a);
      this.siarkan({ t: "ubah", p: this.dataPublik(a) });
      this.kirim(ws, { t: "status", saya: this.statusSaya(a.uid, p) });
    } else if (m.t === "absen") {
      const p = await this.ctx.storage.get(kunci); if (!p) return;
      const h = hariIni();
      if (p.absen && p.absen.akhir === h) return this.kirim(ws, { t: "absen", baru: false, beruntun: p.absen.beruntun, jumlah: p.absen.jumlah });
      const beruntun = p.absen && p.absen.akhir === kemarin() ? p.absen.beruntun + 1 : 1;
      p.absen = { akhir: h, beruntun, jumlah: (p.absen ? p.absen.jumlah : 0) + 1 };
      await this.cekUndanganSah(a.uid, p);
      await this.ctx.storage.put(kunci, p);
      a.beruntun = beruntun; ws.serializeAttachment(a);
      this.kirim(ws, { t: "absen", baru: true, beruntun, jumlah: p.absen.jumlah });
      this.siarkan({ t: "ngobrol", id: a.id, teks: beruntun > 1 ? "Hadir! Hari ke-" + beruntun + " beruntun" : "Hadir!" });
      this.siarkan({ t: "ubah", p: this.dataPublik(a) });
    } else if (m.t === "pilih") {
      const n = Number(m.n); if (!Number.isInteger(n) || n < 1 || n > JUMLAH_PILIHAN) return;
      const p = await this.ctx.storage.get(kunci); if (!p) return;
      const minggu = VOTE_PUTARAN; const hasil = await this.hasilVote(minggu);
      if (p.vote && p.vote.minggu === minggu) { if (p.vote.n === n) return this.kirim(ws, { t: "vote", minggu, hasil, pilihan: n }); hasil[p.vote.n - 1] = Math.max(0, hasil[p.vote.n - 1] - 1); }
      hasil[n - 1] += 1; p.vote = { minggu, n };
      await this.ctx.storage.put({ ["vote:" + minggu]: hasil, [kunci]: p });
      this.kirim(ws, { t: "vote", minggu, hasil, pilihan: n });
      this.siarkan({ t: "vote", minggu, hasil }, ws);
    } else if (m.t === "cari") {
      const q = bersihkan(m.q, 16).toLowerCase(); if (q.length < 2) return this.kirim(ws, { t: "hasilCari", q, hasil: [] });
      this.kirim(ws, { t: "hasilCari", q, hasil: this.dinding.filter(d => d.nama.toLowerCase().includes(q)).slice(0, 12) });
    } else if (m.t === "dinding") {
      const hal = Math.max(0, Math.floor(Number(m.hal) || 0)), per = 60;
      const urut = this.dinding.slice().reverse();
      this.kirim(ws, { t: "dinding", hal, total: urut.length, isi: urut.slice(hal * per, hal * per + per) });
    }
  }

  // Pengajuan / perubahan lapak lewat HTTP (bisa membawa foto)
  async ajukanLapak(request) {
    const panjang = Number(request.headers.get("content-length") || 0);
    if (panjang > 1200000) return json({ galat: "Foto terlalu besar. Coba foto lain." }, 413);
    let b; try { b = await request.json(); } catch (e) { return json({ galat: "Data tidak valid." }, 400); }
    const uid = String(b.uid || "").replace(/[^a-z0-9]/g, "").slice(0, 32);
    const p = uid.length >= 8 ? await this.ctx.storage.get("u:" + uid) : null;
    if (!p) return json({ galat: "Kartu murid tidak ditemukan. Muat ulang halaman." }, 403);
    const kini = Date.now(); if (kini - (this.batas.get("lapak:" + uid) || 0) < 8000) return json({ galat: "Tunggu sebentar sebelum mengirim lagi." }, 429);
    this.batas.set("lapak:" + uid, kini);
    if (!this.bolehLapak(uid, p)) return json({ galat: "Lahan lapakmu belum terbuka. Ajak " + SYARAT_UNDANGAN + " teman daftar lewat link undanganmu dulu." }, 403);
    const ig = bersihkanIG(b.ig) || p.ig || "";
    if (!ig) return json({ galat: "Isi akun IG-mu dulu di kartu murid." }, 400);
    const usaha = bersihkan(b.usaha, 24);
    const kategori = KATEGORI.includes(b.kategori) ? b.kategori : null;
    const deskripsi = bersihkan(b.deskripsi, 160);
    if (usaha.length < 3 || !kategori) return json({ galat: "Isi nama toko (min. 3 huruf) dan pilih kategori." }, 400);
    if (deskripsi.length < 10) return json({ galat: "Ceritakan jualanmu di deskripsi (min. 10 huruf)." }, 400);
    const izinWA = b.izinWA === true;
    const wa = izinWA ? bersihkanWA(b.wa) : "";
    if (izinWA && !wa) return json({ galat: "Nomor WA belum benar. Contoh: 0812xxxxxxx" }, 400);
    const link = bersihkanLink(b.link);
    if (link === null) return json({ galat: "Link toko hanya boleh dari Shopee, Tokopedia, TikTok, Lynk, Instagram, Facebook, Lazada, Blibli, atau Bukalapak." }, 400);
    if (!wa && !link) return json({ galat: "Isi minimal satu cara pesan: nomor WA (dengan izin tampil) atau link toko online." }, 400);
    const legal = bersihkan(b.legal, 40);
    if (b.setuju !== true) return json({ galat: "Centang persetujuan aturan lapak dulu." }, 400);
    // Produk + foto
    const lama = this.lapakDari(uid); const qLama = this.antrian.find(x => x.uid === uid);
    const fotoBoleh = new Set([...(lama ? lama.produk || [] : []), ...(qLama ? qLama.produk || [] : [])].map(x => x.foto).filter(Boolean));
    const produk = []; const fotoBaru = {};
    for (const x of (Array.isArray(b.produk) ? b.produk : []).slice(0, FOTO_MAKS)) {
      const nama = bersihkan(x && x.nama, 32); const harga = bersihkan(x && x.harga, 20);
      let foto = null;
      if (x && typeof x.foto === "string" && x.foto.startsWith("data:")) {
        const buf = fotoDariDataURL(x.foto); if (!buf) return json({ galat: "Ada foto yang tidak bisa dipakai. Pakai foto JPG/PNG biasa." }, 400);
        foto = idAcak(12); fotoBaru["f:" + foto] = buf;
      } else if (x && typeof x.foto === "string" && fotoBoleh.has(x.foto)) foto = x.foto;
      if (nama || foto) produk.push({ nama, harga, foto });
    }
    if (!produk.length) return json({ galat: "Tambahkan minimal 1 produk (nama atau foto)." }, 400);
    this.antrian = this.antrian.filter(x => x.uid !== uid);
    if (this.antrian.length >= ANTRIAN_MAKS) return json({ galat: "Antrean lapak sedang penuh. Coba lagi besok." }, 503);
    if (ig !== p.ig) p.ig = ig;
    const item = { uid, nama: p.nama, ig, usaha, kategori, deskripsi, produk, wa, izinWA, link, legal, tgl: hariIni(), v: 3, undanganSah: (p.undangan && p.undangan.sah) || 0, perintis: !!(lama && lama.perintis), edit: !!lama };
    this.antrian.push(item);
    p.lapak = { status: "menunggu", usaha, kategori };
    // Hapus foto antrean lama yang tidak dipakai lagi (foto lapak yang sedang tampil tetap disimpan)
    const dipakai = new Set([...produk.map(x => x.foto), ...(lama ? (lama.produk || []).map(x => x.foto) : [])].filter(Boolean));
    const buang = qLama ? (qLama.produk || []).map(x => x.foto).filter(f => f && !dipakai.has(f)).map(f => "f:" + f) : [];
    await this.ctx.storage.put({ ...fotoBaru, antrian: this.antrian, ["u:" + uid]: p });
    if (buang.length) await this.ctx.storage.delete(buang);
    const st = this.statusSaya(uid, p);
    this.kirimKe(uid, { t: "status", saya: st });
    return json({ ok: true, saya: st });
  }

  async foto(url) {
    const id = url.pathname.slice(6).replace(/\.jpg$/, "").replace(/[^a-z0-9]/g, "");
    const buf = id ? await this.ctx.storage.get("f:" + id) : null;
    if (!buf) return new Response("Foto tidak ada", { status: 404 });
    return new Response(buf, { headers: { "content-type": "image/jpeg", "cache-control": "public, max-age=604800, immutable" } });
  }

  async lapor(request) {
    let b; try { b = await request.json(); } catch (e) { return json({ galat: "Data tidak valid." }, 400); }
    const slug = String(b.slug || "").replace(/[^a-z0-9-]/g, "").slice(0, 40);
    const l = this.lapak.find(x => x.slug === slug); if (!l) return json({ galat: "Lapak tidak ditemukan." }, 404);
    const ALASAN = ["Penipuan", "Produk terlarang atau berbahaya", "Memakai foto/akun orang lain", "Isi tidak pantas", "Lainnya"];
    const alasan = ALASAN.includes(b.alasan) ? b.alasan : "Lainnya";
    const catatan = bersihkan(b.catatan, 200);
    const ip = request.headers.get("cf-connecting-ip") || "?";
    const kunciBatas = "lapor:" + ip + ":" + slug; const kini = Date.now();
    if (kini - (this.batas.get(kunciBatas) || 0) < 3600e3) return json({ ok: true, ulang: true });
    this.batas.set(kunciBatas, kini);
    this.laporan.unshift({ id: idAcak(8), slug, usaha: l.usaha, alasan, catatan, tgl: hariIni() });
    this.laporan = this.laporan.slice(0, LAPORAN_MAKS);
    await this.ctx.storage.put("laporan", this.laporan);
    return json({ ok: true });
  }

  async halamanLapak(url) {
    const slug = url.pathname.slice(7).replace(/\/$/, "").replace(/[^a-z0-9-]/g, "");
    const l = this.lapak.find(x => x.slug === slug);
    if (!l) return new Response(halamanTidakAda(), { status: 404, headers: { "content-type": "text/html; charset=utf-8" } });
    const kunci = "lihat:" + slug; const n = ((await this.ctx.storage.get(kunci)) || 0) + 1;
    this.ctx.storage.put(kunci, n);
    const pemilik = await this.ctx.storage.get("u:" + l.uid);
    return new Response(halamanLapakHTML(l, url.origin, pemilik && pemilik.kode), { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
  }

  // Ganti nama di profil & di Dinding/Pasar (dinding memakai nama terbaru)
  async gantiNama(uid, p, nama) {
    if (p.nama === nama) return;
    p.nama = nama;
    const d = this.dinding.find(x => x.no === p.no); if (d) d.nama = nama;
    for (const l of this.lapak) if (l.uid === uid) l.nama = nama;
    for (const l of this.antrian) if (l.uid === uid) l.nama = nama;
    await this.ctx.storage.put({ dinding: this.dinding, lapak: this.lapak, antrian: this.antrian });
  }

  async admin(request, url) {
    const kunciAdmin = this.env.ADMIN_KEY;
    if (!kunciAdmin) return json({ galat: "ADMIN_KEY belum diatur di Cloudflare (Settings → Variables and Secrets)." }, 503);
    const kunci = request.headers.get("x-admin-key") || "";
    if (!samaAman(kunci, kunciAdmin)) return json({ galat: "Kunci admin salah." }, 401);
    if (url.pathname === "/admin/api/data" && request.method === "GET") {
      const lihat = {}; for (const l of this.lapak) lihat[l.slug] = (await this.ctx.storage.get("lihat:" + l.slug)) || 0;
      return json({ total: this.total, online: this.terdaftar().length, antrian: this.antrian, lapak: this.lapak.map(l => ({ ...l, dilihat: lihat[l.slug] })), laporan: this.laporan, minggu: VOTE_PUTARAN, vote: await this.hasilVote(VOTE_PUTARAN), pilihan: this.lapakPublik().pilihan.map(x => x.slug), syarat: SYARAT_UNDANGAN });
    }
    if (url.pathname === "/admin/api/aksi" && request.method === "POST") {
      let b; try { b = await request.json(); } catch (e) { return json({ galat: "Data tidak valid." }, 400); }
      const uid = String(b.uid || ""); const aksi = b.aksi;
      const p = uid ? await this.ctx.storage.get("u:" + uid) : null;
      const hapusFoto = [];
      if (aksi === "setuju" || aksi === "tolak") {
        const item = this.antrian.find(x => x.uid === uid); if (!item) return json({ galat: "Lapak tidak ada di antrean." }, 404);
        this.antrian = this.antrian.filter(x => x.uid !== uid);
        const lama = this.lapakDari(uid);
        if (aksi === "setuju") {
          const baru = { uid, nama: item.nama, ig: item.ig || (p && p.ig) || "", usaha: item.usaha, kategori: item.kategori, deskripsi: item.deskripsi || "", produk: item.produk || [], wa: item.wa || "", izinWA: !!item.izinWA, link: item.link || "", legal: item.legal || "", tgl: hariIni(), v: 3,
            slug: lama ? lama.slug : slugDari(item.usaha), perintis: lama ? !!lama.perintis : false, pin: lama ? !!lama.pin : false };
          const tetap = new Set(baru.produk.map(x => x.foto).filter(Boolean));
          if (lama) for (const x of lama.produk || []) if (x.foto && !tetap.has(x.foto)) hapusFoto.push("f:" + x.foto);
          if (lama) this.lapak = this.lapak.map(x => x.uid === uid ? baru : x); else this.lapak.unshift(baru);
          if (p) p.lapak = { status: "tampil", usaha: baru.usaha, kategori: baru.kategori };
        } else {
          const tetap = new Set((lama ? lama.produk || [] : []).map(x => x.foto).filter(Boolean));
          for (const x of item.produk || []) if (x.foto && !tetap.has(x.foto)) hapusFoto.push("f:" + x.foto);
          if (p) p.lapak = lama ? { status: "tampil", usaha: lama.usaha, kategori: lama.kategori } : { status: "ditolak", usaha: item.usaha, kategori: item.kategori, alasan: bersihkan(b.alasan, 120) };
        }
      } else if (aksi === "pin") {
        const l = this.lapakDari(uid); if (!l) return json({ galat: "Lapak tidak ada." }, 404);
        if (!l.pin && this.lapak.filter(x => x.pin).length >= LAPAK_PILIHAN) return json({ galat: "Maksimal " + LAPAK_PILIHAN + " lapak pilihan. Lepas salah satu dulu." }, 400);
        l.pin = !l.pin;
      } else if (aksi === "laporanSelesai") {
        this.laporan = this.laporan.filter(x => x.id !== b.id);
        await this.ctx.storage.put("laporan", this.laporan);
        return json({ ok: true });
      } else if (aksi === "resetSemua") {
        if (b.konfirmasi !== "HAPUS SEMUA") return json({ galat: "Ketik HAPUS SEMUA untuk konfirmasi." }, 400);
        await this.ctx.storage.deleteAll();
        this.total = 0; this.dinding = []; this.lapak = []; this.antrian = []; this.laporan = [];
        for (const ws of this.ctx.getWebSockets()) { this.kirim(ws, { t: "reset" }); try { ws.close(4000, "reset"); } catch (e) {} }
        return json({ ok: true, reset: true });
      } else if (aksi === "hapus") {
        const l = this.lapakDari(uid);
        if (l) for (const x of l.produk || []) if (x.foto) hapusFoto.push("f:" + x.foto);
        this.lapak = this.lapak.filter(x => x.uid !== uid);
        if (p) p.lapak = { status: "dihapus", usaha: l ? l.usaha : "", kategori: l ? l.kategori : "", alasan: bersihkan(b.alasan, 120) };
      } else return json({ galat: "Aksi tidak dikenal." }, 400);
      const tulis = { antrian: this.antrian, lapak: this.lapak }; if (p) tulis["u:" + uid] = p;
      await this.ctx.storage.put(tulis);
      if (hapusFoto.length) await this.ctx.storage.delete(hapusFoto);
      this.siarkan({ t: "pasar", lapak: this.lapakPublik() });
      if (p) this.kirimKe(uid, { t: "status", saya: this.statusSaya(uid, p), info: aksi });
      return json({ ok: true });
    }
    return json({ galat: "Tidak ditemukan." }, 404);
  }

  async webSocketClose(ws) { this.keluar(ws); }
  async webSocketError(ws) { this.keluar(ws); }
  keluar(ws) {
    const a = ws.deserializeAttachment();
    try { ws.close(1000, "selesai"); } catch (e) {}
    if (!a || !a.masuk) return;
    a.masuk = false; try { ws.serializeAttachment(a); } catch (e) {}
    const sisa = this.terdaftar().filter(s => s !== ws);
    for (const s of sisa) { this.kirim(s, { t: "keluar", id: a.id }); this.kirim(s, { t: "jumlah", online: sisa.length, total: this.total }); }
  }
}

/* ================= Halaman lapak (bisa dibagikan) ================= */
const GAYA_HALAMAN = `*{box-sizing:border-box}body{margin:0;font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:#FFF8EC;color:#1A2147}
main{max-width:520px;margin:0 auto;padding:0 0 40px}.atas{background:#14204F;color:#fff;padding:18px 18px 22px;border-radius:0 0 22px 22px}
.sekolah{display:flex;align-items:center;gap:10px;font-weight:800;font-size:12.5px;letter-spacing:.08em;color:#F5C518;text-decoration:none}.sekolah img{width:30px;height:36px}
h1{font-size:28px;line-height:1.15;margin:14px 0 6px}.kat{display:inline-block;background:#F5C518;color:#14204F;font-weight:800;font-size:12.5px;padding:4px 10px;border-radius:999px;margin-right:6px}
.lenc{display:inline-block;background:#fff;color:#14204F;font-weight:800;font-size:12.5px;padding:4px 10px;border-radius:999px}
.isi{padding:18px}.desk{font-size:16px;line-height:1.55;margin:0 0 16px}
.produk{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;margin-bottom:18px}
.kartu{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 3px 0 rgba(12,21,56,.08)}.kartu img{width:100%;aspect-ratio:1;object-fit:cover;display:block;background:#E8EEFB}
.kartu div{padding:10px 12px}.kartu b{display:block;font-size:14.5px;color:#14204F}.kartu span{font-size:14px;font-weight:800;color:#C99E0A}
.tombol{display:flex;align-items:center;justify-content:center;gap:8px;min-height:52px;border-radius:14px;font-weight:800;font-size:16px;text-decoration:none;margin-top:10px;padding:0 16px;border:0;width:100%;cursor:pointer;font-family:inherit}
.wa{background:#1FA855;color:#fff;box-shadow:0 4px 0 #157A3D}.toko{background:#14204F;color:#fff;box-shadow:0 4px 0 #0C1538}.kuning{background:#F5C518;color:#14204F;box-shadow:0 4px 0 #C99E0A}
.info{font-size:13.5px;color:#5A6487;line-height:1.5;margin:16px 0 0}.ajak{background:#14204F;color:#fff;border-radius:18px;padding:18px;margin:22px 0 0}
.ajak b{color:#F5C518}.ajak p{margin:6px 0 4px;font-size:14.5px;line-height:1.5}
details{margin-top:18px;font-size:14px}summary{cursor:pointer;font-weight:700;color:#5A6487}select,textarea{width:100%;font:inherit;font-size:16px;border:2px solid #D6DAEA;border-radius:12px;padding:10px;margin-top:8px;background:#fff}
.lapor{background:#fff;color:#B3261E;border:2px solid #B3261E}`;
function halamanLapakHTML(l, origin, kodePemilik) {
  const fotoUtama = (l.produk || []).map(p => p.foto).find(Boolean);
  const judul = l.usaha + " · Lapak murid Sekolah UMKM Kreova";
  const teksWA = "Halo " + l.usaha + ", saya lihat lapak kakak di Sekolah UMKM Kreova. Mau tanya-tanya produknya.";
  const ajak = origin + "/" + (kodePemilik ? "?ajak=" + encodeURIComponent(kodePemilik) : "");
  const produk = (l.produk || []).map(p => '<div class="kartu">' + (p.foto ? '<img src="/foto/' + esc(p.foto) + '.jpg" alt="' + esc(p.nama || l.usaha) + '" loading="lazy">' : "") + "<div><b>" + esc(p.nama || "Produk") + "</b>" + (p.harga ? "<span>" + esc(p.harga) + "</span>" : "") + "</div></div>").join("");
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#14204F">
<title>${esc(judul)}</title><meta name="description" content="${esc(l.deskripsi || l.usaha)}">
<meta property="og:title" content="${esc(judul)}"><meta property="og:description" content="${esc(l.deskripsi || "")}"><meta property="og:type" content="website">${fotoUtama ? `<meta property="og:image" content="${esc(origin)}/foto/${esc(fotoUtama)}.jpg">` : ""}
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&display=swap"><style>${GAYA_HALAMAN}</style></head><body><main>
<div class="atas"><a class="sekolah" href="${esc(ajak)}"><img src="/lambang.svg" alt="">LAPAK MURID · SEKOLAH UMKM KREOVA</a>
<h1>${esc(l.usaha)}</h1><span class="kat">${esc(l.kategori)}</span>${l.perintis ? '<span class="lenc">★ Lapak Perintis</span>' : ""}</div>
<div class="isi"><p class="desk">${esc(l.deskripsi || "")}</p>${produk ? '<div class="produk">' + produk + "</div>" : ""}
${l.izinWA && l.wa ? `<a class="tombol wa" href="https://wa.me/${esc(l.wa)}?text=${encodeURIComponent(teksWA)}" target="_blank" rel="noopener">Pesan via WhatsApp</a>` : ""}
${l.link ? `<a class="tombol toko" href="${esc(l.link)}" target="_blank" rel="noopener nofollow">Lihat toko online</a>` : ""}
${l.ig ? `<a class="tombol kuning" href="https://www.instagram.com/${esc(l.ig)}/" target="_blank" rel="noopener nofollow">Instagram @${esc(l.ig)}</a>` : ""}
${l.legal ? `<p class="info"><b>Izin/registrasi (diisi penjual):</b> ${esc(l.legal)}</p>` : ""}
<p class="info">Transaksi langsung antara pembeli dan penjual. Sekolah UMKM Kreova tidak ikut menerima pembayaran dan tidak menjamin pengiriman. Lapak ini sudah dicek pengurus sekolah sebelum tampil.</p>
<div class="ajak"><b>Punya usaha juga?</b><p>Belajar jualan gratis di Sekolah UMKM Kreova, tanpa SPP. Murid bisa punya lapak seperti ini.</p><a class="tombol kuning" href="${esc(ajak)}">Daftar jadi murid (gratis)</a></div>
<details><summary>Laporkan lapak ini</summary><form id="lapor"><select name="alasan"><option>Penipuan</option><option>Produk terlarang atau berbahaya</option><option>Memakai foto/akun orang lain</option><option>Isi tidak pantas</option><option>Lainnya</option></select>
<textarea name="catatan" maxlength="200" rows="3" placeholder="Ceritakan singkat (opsional)"></textarea><button class="tombol lapor" type="submit">Kirim laporan</button><p class="info" id="hasil" role="status"></p></form></details>
</div></main><script>document.getElementById('lapor').addEventListener('submit',function(e){e.preventDefault();var f=e.target,h=document.getElementById('hasil');f.querySelector('button').disabled=true;
fetch('/api/lapor',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({slug:${JSON.stringify(l.slug)},alasan:f.alasan.value,catatan:f.catatan.value})}).then(function(r){return r.json()}).then(function(d){h.textContent=d.ok?'Terima kasih. Laporanmu akan dicek pengurus sekolah.':(d.galat||'Gagal mengirim.')}).catch(function(){h.textContent='Gagal mengirim. Coba lagi.';f.querySelector('button').disabled=false})});</script></body></html>`;
}
function halamanTidakAda() {
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Lapak tidak ditemukan</title><style>${GAYA_HALAMAN}</style></head><body><main><div class="atas"><a class="sekolah" href="/"><img src="/lambang.svg" alt="">SEKOLAH UMKM KREOVA</a><h1>Lapak tidak ditemukan</h1></div><div class="isi"><p class="desk">Lapak ini mungkin sudah ditutup atau alamatnya salah.</p><a class="tombol kuning" href="/">Ke Sekolah UMKM Kreova</a></div></main></body></html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/seller-tools" || url.pathname === "/seller-tools/") return Response.redirect(url.origin + "/Seller-Tools-Sekolah-UMKM-Kreova-v1.3.html", 302);
    if (url.pathname === "/ws" || url.pathname.startsWith("/admin/api/") || url.pathname.startsWith("/lapak/") || url.pathname.startsWith("/foto/") || url.pathname.startsWith("/api/")) {
      const stub = env.SEKOLAH.get(env.SEKOLAH.idFromName("sekolah-utama"));
      return stub.fetch(request);
    }
    return env.ASSETS.fetch(request);
  },
};
