// Sekolah UMKM Kreova — server sekolah virtual v2 (Cloudflare Worker + Durable Object)
// Fitur: murid saling lihat & sapa, absen harian, Dinding Angkatan Pertama, voting Kotak Usulan,
// Pasar Murid (lapak harus disetujui admin), halaman admin.
import { DurableObject } from "cloudflare:workers";

// HARUS sama urutannya dengan FRASA di public/index.html
const FRASA = ["Halo, semua!", "Salam kenal!", "Jualan apa, kak?", "Semangat jualan!", "Ayo ke Kotak Usulan!", "Mantap!", "Terima kasih!", "Sampai ketemu di kelas!", "Hadir, Bu Naya!"];
const KATEGORI = ["Fashion", "Makanan & Minuman", "Kecantikan", "Kerajinan", "Rumah Tangga", "Jasa", "Produk Digital", "Lainnya"];
const JUMLAH_PILIHAN = 5;
// Putaran voting Kotak Usulan. Ganti teks ini untuk memulai putaran baru (hasil putaran lama tetap tersimpan).
// Putaran 1 (vote:2026-11-23) dimenangkan "Untung bocor" -> Kelas 01.
const VOTE_PUTARAN = "putaran-2";
const MAKS_ONLINE = 150;
const DINDING_MAKS = 1000;   // murid ke-1 s.d. ke-1000 = Angkatan Pertama
const LAPAK_TAMPIL = 12;     // jumlah lapak di peta Pasar Murid
const ANTRIAN_MAKS = 200;
// Kata yang disensor (huruf kecil). Tambah sendiri bila perlu.
const KATA_TERLARANG = ["anjing", "bangsat", "babi", "kontol", "memek", "ngentot", "goblok", "tolol", "bajingan", "asu", "jancok", "kampret", "judi", "slot", "togel"];
const W = 1080, H = 2880;

function bersihkan(teks, maks) {
  let s = String(teks ?? "").replace(/[<>\u0000-\u001f\u007f-\u009f​-‏‪-‮⁠-⁯]/g, "").replace(/\s+/g, " ").trim().slice(0, maks);
  for (const k of KATA_TERLARANG) s = s.replace(new RegExp(k, "gi"), "***");
  // Cegah tautan & nomor HP di teks publik (anti-spam/penipuan)
  s = s.replace(/(https?:\/\/|www\.)\S+/gi, "").replace(/\b\S+\.(com|id|co|net|org|link|ly|me|shop|store)\b/gi, "").replace(/(\+?62|0)8[\d\s-]{7,}/g, "");
  return s.replace(/\s+/g, " ").trim();
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
function idAcak() { const c = "abcdefghijkmnpqrstuvwxyz23456789"; let s = ""; for (let i = 0; i < 10; i++) s += c[Math.floor(Math.random() * c.length)]; return s; }
// Tanggal & minggu menurut WIB (UTC+7)
function hariIni(ms = Date.now()) { return new Date(ms + 7 * 3600e3).toISOString().slice(0, 10); }
function kemarin(ms = Date.now()) { return hariIni(ms - 86400e3); }
function mingguIni(ms = Date.now()) {
  const d = new Date(ms + 7 * 3600e3); const hari = (d.getUTCDay() + 6) % 7; // 0 = Senin
  return new Date(d.getTime() - hari * 86400e3).toISOString().slice(0, 10);
}
function json(data, status = 200) { return new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } }); }
function samaAman(a, b) { a = String(a || ""); b = String(b || ""); if (!a || a.length !== b.length) return false; let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0; }

export class Sekolah extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair("ping", "pong"));
    this.ctx.blockConcurrencyWhile(async () => {
      const d = await this.ctx.storage.get(["total", "dinding", "lapak", "antrian"]);
      this.total = d.get("total") || 0;
      this.dinding = d.get("dinding") || [];
      this.lapak = d.get("lapak") || [];
      this.antrian = d.get("antrian") || [];
    });
  }

  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/admin/api/")) return this.admin(request, url);
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
  siarkan(pesan, kecuali) { const teks = JSON.stringify(pesan); for (const ws of this.terdaftar()) if (ws !== kecuali) { try { ws.send(teks); } catch (e) {} } }
  dataPublik(a) { return { id: a.id, nama: a.nama, jualan: a.jualan, look: a.look, x: a.x, y: a.y, beruntun: a.beruntun || 0 }; }
  lapakPublik() { return this.lapak.slice(0, LAPAK_TAMPIL).map(l => ({ nama: l.nama, usaha: l.usaha, kategori: l.kategori })); }
  async hasilVote(minggu) { return (await this.ctx.storage.get("vote:" + minggu)) || new Array(JUMLAH_PILIHAN).fill(0); }
  statusSaya(p) {
    const h = hariIni();
    return {
      no: p.no, absen: { beruntun: p.absen ? (p.absen.akhir === h || p.absen.akhir === kemarin() ? p.absen.beruntun : 0) : 0, jumlah: p.absen ? p.absen.jumlah : 0, sudahHariIni: !!(p.absen && p.absen.akhir === h) },
      vote: p.vote && p.vote.minggu === VOTE_PUTARAN ? p.vote.n : null,
      lapak: p.lapak ? { status: p.lapak.status, usaha: p.lapak.usaha, kategori: p.lapak.kategori } : null
    };
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
      const pos = koordinat(m.x, m.y) || { x: 300, y: 2470 };
      let p = await this.ctx.storage.get("u:" + uid);
      if (!p && m.baru !== true) { this.kirim(ws, { t: "reset" }); return; }
      if (!p) {
        this.total += 1;
        p = { nama, jualan, look, no: this.total, tglDaftar: hariIni(), absen: null, vote: null, lapak: null };
        if (p.no <= DINDING_MAKS) this.dinding.push({ no: p.no, nama });
        await this.ctx.storage.put({ ["u:" + uid]: p, total: this.total, dinding: this.dinding });
      } else if (p.nama !== nama || p.jualan !== jualan || JSON.stringify(p.look) !== JSON.stringify(look)) {
        await this.gantiNama(uid, p, nama);
        p.jualan = jualan; p.look = look;
        await this.ctx.storage.put("u:" + uid, p);
      }
      const st = this.statusSaya(p);
      Object.assign(a, { masuk: true, uid, nama: p.nama, jualan, look, x: pos.x, y: pos.y, beruntun: st.absen.beruntun, tGerak: 0, tObrol: 0, tAksi: 0 });
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
      await this.ctx.storage.put(kunci, p);
      a.nama = p.nama; a.jualan = p.jualan; a.look = p.look; ws.serializeAttachment(a);
      this.siarkan({ t: "ubah", p: this.dataPublik(a) });
    } else if (m.t === "absen") {
      const p = await this.ctx.storage.get(kunci); if (!p) return;
      const h = hariIni();
      if (p.absen && p.absen.akhir === h) return this.kirim(ws, { t: "absen", baru: false, beruntun: p.absen.beruntun, jumlah: p.absen.jumlah });
      const beruntun = p.absen && p.absen.akhir === kemarin() ? p.absen.beruntun + 1 : 1;
      p.absen = { akhir: h, beruntun, jumlah: (p.absen ? p.absen.jumlah : 0) + 1 };
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
    } else if (m.t === "lapak") {
      const usaha = bersihkan(m.usaha, 22); const kategori = KATEGORI.includes(m.kategori) ? m.kategori : null;
      if (usaha.length < 3 || !kategori) return this.kirim(ws, { t: "galat", teks: "Isi nama usaha (min. 3 huruf) dan pilih kategori." });
      const p = await this.ctx.storage.get(kunci); if (!p) return;
      this.antrian = this.antrian.filter(x => x.uid !== a.uid);
      if (this.antrian.length >= ANTRIAN_MAKS) return this.kirim(ws, { t: "galat", teks: "Antrean lapak sedang penuh. Coba lagi besok." });
      this.antrian.push({ uid: a.uid, nama: p.nama, usaha, kategori, tgl: hariIni() });
      p.lapak = { status: "menunggu", usaha, kategori };
      await this.ctx.storage.put({ antrian: this.antrian, [kunci]: p });
      this.kirim(ws, { t: "lapakSaya", lapak: p.lapak });
    } else if (m.t === "cari") {
      const q = bersihkan(m.q, 16).toLowerCase(); if (q.length < 2) return this.kirim(ws, { t: "hasilCari", q, hasil: [] });
      this.kirim(ws, { t: "hasilCari", q, hasil: this.dinding.filter(d => d.nama.toLowerCase().includes(q)).slice(0, 12) });
    } else if (m.t === "dinding") {
      const hal = Math.max(0, Math.floor(Number(m.hal) || 0)), per = 60;
      const urut = this.dinding.slice().reverse();
      this.kirim(ws, { t: "dinding", hal, total: urut.length, isi: urut.slice(hal * per, hal * per + per) });
    }
  }

  // Ganti nama di profil & di Dinding/Pasar (dinding memakai nama terbaru)
  async gantiNama(uid, p, nama) {
    if (p.nama === nama) return;
    p.nama = nama;
    const d = this.dinding.find(x => x.no === p.no); if (d) d.nama = nama;
    let ubahLapak = false;
    for (const l of this.lapak) if (l.uid === uid) { l.nama = nama; ubahLapak = true; }
    for (const l of this.antrian) if (l.uid === uid) l.nama = nama;
    await this.ctx.storage.put({ dinding: this.dinding, lapak: this.lapak, antrian: this.antrian });
    if (ubahLapak) this.siarkan({ t: "pasar", lapak: this.lapakPublik() });
  }

  async admin(request, url) {
    const kunciAdmin = this.env.ADMIN_KEY;
    if (!kunciAdmin) return json({ galat: "ADMIN_KEY belum diatur di Cloudflare (Settings → Variables and Secrets)." }, 503);
    const kunci = request.headers.get("x-admin-key") || "";
    if (!samaAman(kunci, kunciAdmin)) return json({ galat: "Kunci admin salah." }, 401);
    if (url.pathname === "/admin/api/data" && request.method === "GET") {
      return json({ total: this.total, online: this.terdaftar().length, antrian: this.antrian, lapak: this.lapak, minggu: VOTE_PUTARAN, vote: await this.hasilVote(VOTE_PUTARAN) });
    }
    if (url.pathname === "/admin/api/aksi" && request.method === "POST") {
      let b; try { b = await request.json(); } catch (e) { return json({ galat: "Data tidak valid." }, 400); }
      const uid = String(b.uid || ""); const aksi = b.aksi;
      const p = await this.ctx.storage.get("u:" + uid);
      if (aksi === "setuju" || aksi === "tolak") {
        const item = this.antrian.find(x => x.uid === uid); if (!item) return json({ galat: "Lapak tidak ada di antrean." }, 404);
        this.antrian = this.antrian.filter(x => x.uid !== uid);
        if (aksi === "setuju") { this.lapak = this.lapak.filter(x => x.uid !== uid); this.lapak.unshift({ uid, nama: item.nama, usaha: item.usaha, kategori: item.kategori, tgl: hariIni() }); }
        if (p) p.lapak = { status: aksi === "setuju" ? "tampil" : "ditolak", usaha: item.usaha, kategori: item.kategori };
      } else if (aksi === "resetSemua") {
        if (b.konfirmasi !== "HAPUS SEMUA") return json({ galat: "Ketik HAPUS SEMUA untuk konfirmasi." }, 400);
        await this.ctx.storage.deleteAll();
        this.total = 0; this.dinding = []; this.lapak = []; this.antrian = [];
        for (const ws of this.ctx.getWebSockets()) { this.kirim(ws, { t: "reset" }); try { ws.close(4000, "reset"); } catch (e) {} }
        return json({ ok: true, reset: true });
      } else if (aksi === "hapus") {
        this.lapak = this.lapak.filter(x => x.uid !== uid);
        if (p && p.lapak) p.lapak.status = "dihapus";
      } else return json({ galat: "Aksi tidak dikenal." }, 400);
      const tulis = { antrian: this.antrian, lapak: this.lapak }; if (p) tulis["u:" + uid] = p;
      await this.ctx.storage.put(tulis);
      this.siarkan({ t: "pasar", lapak: this.lapakPublik() });
      for (const ws of this.terdaftar()) { const a = ws.deserializeAttachment(); if (a.uid === uid && p) this.kirim(ws, { t: "lapakSaya", lapak: p.lapak }); }
      return json({ ok: true, antrian: this.antrian, lapak: this.lapak });
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

/* Seller Tools: diambil dari file ZIP produk di Lynk, disajikan sebagai halaman web (bisa dibuka di HP). Ganti URL ini kalau file di Lynk diunggah ulang. */
const ST_ZIP = "https://lynk.id/products/26-11-2026/file_1795634631966_1380692.zip";
async function htmlDariZip(buf) {
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength), dec = new TextDecoder();
  let off = 0;
  while (off + 30 <= buf.length && dv.getUint32(off, true) === 0x04034b50) {
    const metode = dv.getUint16(off + 8, true), ukuran = dv.getUint32(off + 18, true);
    const pNama = dv.getUint16(off + 26, true), pEkstra = dv.getUint16(off + 28, true);
    const nama = dec.decode(buf.subarray(off + 30, off + 30 + pNama));
    const awal = off + 30 + pNama + pEkstra, data = buf.subarray(awal, awal + ukuran);
    if (nama.endsWith(".html")) {
      if (metode === 0) return dec.decode(data);
      const s = new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
      return dec.decode(await new Response(s).arrayBuffer());
    }
    off = awal + ukuran;
  }
  return null;
}
function rapikanST(h) {
  return h.replace(/data:image\/png;base64,[A-Za-z0-9+\/=]+/, "/lambang.svg")
    .replace('<meta name="theme-color" content="#001850">', '<meta name="theme-color" content="#14204F">\n<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-title" content="Seller Tools">\n<link rel="apple-touch-icon" href="/lambang.svg">')
    .replace('Buka file ini dengan Google Chrome (Android) atau Safari (iPhone). Jika kamu menerima link, buka link lalu pilih menu browser → "Tambahkan ke layar utama" agar terasa seperti aplikasi.', 'Buka link Seller Tools dari Koperasi Sekolah di Chrome (Android) atau Safari (iPhone). Lalu pilih menu browser → "Tambahkan ke layar utama" supaya muncul seperti aplikasi. Data tetap tersimpan di HP-mu sendiri.');
}
async function sellerTools() {
  const z = await fetch(ST_ZIP, { cf: { cacheTtl: 86400, cacheEverything: true } });
  const gagal = () => new Response("Seller Tools sedang tidak bisa dimuat. Coba muat ulang sebentar lagi.", { status: 502, headers: { "content-type": "text/plain; charset=utf-8" } });
  if (!z.ok) return gagal();
  const html = await htmlDariZip(new Uint8Array(await z.arrayBuffer()));
  if (!html) return gagal();
  return new Response(rapikanST(html), { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=3600" } });
}


export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/seller-tools" || url.pathname === "/seller-tools/") return sellerTools();
    if (url.pathname === "/ws" || url.pathname.startsWith("/admin/api/")) {
      const stub = env.SEKOLAH.get(env.SEKOLAH.idFromName("sekolah-utama"));
      return stub.fetch(request);
    }
    return env.ASSETS.fetch(request);
  },
};
