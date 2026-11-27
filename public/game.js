document.getElementById('map').innerHTML = buatPeta();

/* =========================================================
   PENGATURAN SEKOLAH — ubah bagian ini untuk memperbarui situs
   ========================================================= */
var SEKOLAH = {
  targetMurid: 1000,
  hadiahTarget: 'Angkatan pertama lengkap',
  link: {
    instagram: 'https://www.instagram.com/hey.kreova/',
        tiktok: 'https://www.tiktok.com/@hey.kreova',
    grupFB: '',        // link Grup FB "Sekolah UMKM Kreova"
    episodeTerbaru: 'https://www.instagram.com/reel/DgMMINgz3hk/' // link video episode terbaru
  },
  pengumuman: [
    { tanggal: '27 Nov 2026', judul: 'Untuk 8 murid perintis', isi: 'Lapakmu sudah punya halaman sendiri, tapi isinya masih kosong. Buka Pasar Sekolah, tambahkan foto asli, deskripsi, dan nomor WA atau link toko. Lapak yang lengkap dipajang di depan dan bisa tampil di video Bu Naya.' },
    { tanggal: '27 Nov 2026', judul: 'Pasar Sekolah: lapak punya halaman sendiri', isi: 'Setiap lapak murid sekarang punya link sendiri berisi produk, foto asli, deskripsi, dan tombol pesan via WhatsApp atau toko online. Pasang link-nya di bio! Lahan lapak baru dibuka dengan mengajak 3 teman daftar lewat link undanganmu.' },
    { tanggal: '26 Nov 2026', judul: 'Koperasi Sekolah dibuka', isi: 'Buku paket pendamping pelajaran dan Seller Tools (gratis untuk murid) sudah ada di Koperasi, tepat di sebelah kanan gerbang. Kelas tetap gratis.' },
    { tanggal: '26 Nov 2026', judul: 'Hasil vote: Untung Bocor menang', isi: '8 dari 12 suara memilih Untung bocor. Kelas 01 "Untung Bocor" resmi dibuka. Kotak Usulan putaran 2 sudah dibuka: pilih kelas berikutnya.' },
    { tanggal: '24 Nov 2026', judul: 'Penerimaan murid baru dibuka', isi: 'Daftar jadi murid, absen setiap hari, dan pilih pelajaran pertama di Kotak Usulan.' },
    { tanggal: 'Setiap hari', judul: 'Absen', isi: 'Tekan tombol Absen. Absen beruntun terlihat di kartumu.' },
    { tanggal: 'Setiap putaran', judul: 'Kotak Usulan', isi: 'Pilihan terbanyak di setiap putaran jadi kelas berikutnya.' }
  ],
  // status: 'segera' (terkunci) | 'buka'
  kelas: [
    { no:'01', judul:'Untung Bocor', status:'buka', masalah:'Jualan laku, tapi uangnya entah ke mana: uang usaha campur uang dapur, harga cuma dihitung dari bahan, dan pengeluaran kecil tidak pernah dicatat.', episode:'https://www.instagram.com/reel/DgMMINgz3hk/', pr:'Tulis di komentar video Kelas 01: satu pengeluaran usaha yang paling sering lupa kamu catat. Tantangan 7 hari: pisahkan uang usaha ke satu kantong khusus.',
      ringkas:['Lubang 1: uang usaha dan uang dapur satu dompet, jadi laba dan modal tidak kelihatan.','Lubang 2: harga hanya dari bahan. Kemasan, admin marketplace, ongkir, dan iklan ikut menggerus untung.','Bukan karena malas: otak kita suka mencampur kantong uang dan menghindari catatan saat sepi. Butuh sistem, bukan niat.','Tambalan pertama: pisahkan kantong. Satu untuk usaha, satu untuk pribadi.'] },
    { no:'02', judul:'Seni Balas Chat', status:'segera', masalah:'Pembeli tanya harga lalu menghilang: balasan kaku, panik saat ditawar, follow-up yang terdengar menagih.', episode:'', pr:'' },
    { no:'03', judul:'Harga Tanpa Banting', status:'segera', masalah:'Saat sepi, refleksnya banting harga. Laba habis, pembeli hanya datang saat diskon.', episode:'', pr:'' },
    { no:'04', judul:'Bikin Pembeli Balik Lagi', status:'segera', masalah:'Pembeli hanya sekali beli. Tidak ada catatan pelanggan dan tawaran pembelian kedua.', episode:'', pr:'' },
    { no:'05', judul:'Jualan Pakai Sistem', status:'segera', masalah:'Semua dikerjakan sendiri tanpa SOP, sampai kelelahan dan bisnis sulit tumbuh.', episode:'', pr:'' },
    { no:'06', judul:'Mulai dari Nol', status:'segera', masalah:'Usulan Bu Indah dari Surabaya: bingung mau jualan apa dan bagaimana cara memulai usaha. Kelas ini untuk yang benar-benar mulai dari nol.', episode:'', pr:'' }
  ],
  koperasi: {
    buka: true,
    toko: 'https://lynk.id/heykreova',
    catatanHarga: 'Harga murid angkatan pertama berlaku sampai 31 Des 2026.',
    // urutan = urutan tampil. harga 0 = gratis. nanti = harga mulai 1 Jan 2027
    rak: [
      { nama:'Seller Tools', jenis:'Alat praktik · pendamping Kelas 01', harga:0, isi:'Hitung laba per pesanan, batas aman iklan, stok, dan catatan keuangan. Jalan di HP tanpa install.', link:'https://lynk.id/heykreova/o8p1re9gk1n3', cover:'https://cdn.lynkid.my.id/products/26-11-2026/1795681210975_9279730.webp' },
      { nama:'Paket Chat Jualan (Jilid 1 + 2)', jenis:'Buku paket · pendamping Kelas 02', harga:29000, nanti:39000, isi:'Membaca pembeli + 30 script balasan chat. Lebih hemat Rp9.000.', link:'https://lynk.id/heykreova/z6pz2krloq7m', cover:'https://cdn.lynkid.my.id/products/26-11-2026/1795680987349_7065181.webp' },
      { nama:'Jilid 1 · Membaca Pembeli', jenis:'Buku paket · Mapel Chat Jualan', harga:19000, nanti:25000, isi:'5 keraguan pembeli dan arti 10 kalimat chat yang paling sering masuk.', link:'https://lynk.id/heykreova/zvn65nr514ke', cover:'https://cdn.lynkid.my.id/products/26-11-2026/1795679922400_1419918.webp' },
      { nama:'Jilid 2 · Script Balasan', jenis:'Buku paket · Mapel Chat Jualan', harga:19000, nanti:25000, isi:'30 balasan chat siap salin untuk 6 situasi, lengkap dengan alasannya.', link:'https://lynk.id/heykreova/v98wdkdm2ml7', cover:'https://cdn.lynkid.my.id/products/26-11-2026/1795679867525_6823774.webp' },
      { nama:'Bisnis Fashion Online', jenis:'Buku paket · Edisi Reseller', harga:39000, nanti:49000, isi:'10 bab dari pilih produk, hitung HPP, sampai rencana aksi 30 hari.', link:'https://lynk.id/heykreova/dxon45kk6qdp', cover:'https://cdn.lynkid.my.id/products/26-11-2026/1795680146870_2265031.webp' }
    ]
  },
  kasKelas: { buka:false, gambarQRIS:'' },
  server: '' // kosongkan: otomatis memakai server di alamat situs yang sama (/ws)
};
/* HARUS sama dengan server (src/worker.js) */
var FRASA = ['Halo, semua!','Salam kenal!','Jualan apa, kak?','Semangat jualan!','Ayo ke Kotak Usulan!','Mantap!','Terima kasih!','Sampai ketemu di kelas!','Hadir, Bu Naya!'];
var KATEGORI = ['Fashion','Makanan & Minuman','Kecantikan','Kerajinan','Rumah Tangga','Jasa','Produk Digital','Lainnya'];
/* Putaran 2: pilihan ke-n = Kelas 0(n+1). HARUS sama jumlahnya dengan JUMLAH_PILIHAN di server. */
var PILIHAN = ['Chat di-ghosting','Perang harga','Pembeli nggak balik','Capek ngurus sendiri','Mulai dari nol'];
var PUTARAN = 2;
var SAPAAN = ['Halo, murid-murid UMKM!','Kelas 01 Untung Bocor sudah dibuka!','Koperasi sudah buka. Seller Tools gratis untuk murid!','Lapak di Pasar Sekolah sekarang punya link sendiri!','Ajak 3 teman daftar, lahan lapakmu terbuka.','Sudah absen hari ini?','Kurikulumnya kalian yang susun.','Mampir ke Kotak Usulan, ya!','Cari namamu di Dinding Angkatan!','Sampai ketemu di kelas!'];
var KEPALA_NAYA = '<img src="/naya-kepala.svg" alt="">';

/* ================= Avatar ================= */
var KULIT = ['#F2C9A8','#D9A67E','#A8724F'];
var BAJU = ['#F5C518','#E4572E','#2E86DE','#27AE60','#8E44AD','#F78FB3'];
var RAMBUT = ['Rambut pendek','Rambut panjang','Berhijab'];
function avatarSVG(l) {
  l = l || {}; var k = KULIT[l.k] || KULIT[0], b = BAJU[l.b] || BAJU[0], h = BAJU[l.h] || BAJU[2], r = l.r | 0;
  var s = '<svg class="tubuh" viewBox="0 0 64 96" aria-hidden="true"><ellipse cx="32" cy="93" rx="20" ry="4" fill="#000" opacity=".18"/>';
  if (r === 1) s += '<path d="M14 22 Q13 2 32 3 Q51 2 50 22 L52 50 Q32 56 12 50 Z" fill="#2B1A14"/>';
  s += '<rect x="21" y="66" width="9" height="24" rx="3" fill="#14204F"/><rect x="34" y="66" width="9" height="24" rx="3" fill="#14204F"/>';
  s += '<path d="M16 46 Q16 38 24 38 L40 38 Q48 38 48 46 L48 70 L16 70 Z" fill="' + b + '"/>';
  s += '<rect x="9" y="42" width="9" height="24" rx="4.5" fill="' + b + '"/><rect x="46" y="42" width="9" height="24" rx="4.5" fill="' + b + '"/>';
  s += '<circle cx="13.5" cy="66" r="4.5" fill="' + k + '"/><circle cx="50.5" cy="66" r="4.5" fill="' + k + '"/>';
  if (r === 2) { s += '<path d="M11 28 Q11 3 32 3 Q53 3 53 28 L55 48 Q32 57 9 48 Z" fill="' + h + '"/><ellipse cx="32" cy="25" rx="12.5" ry="14" fill="' + k + '"/>'; }
  else { s += '<circle cx="32" cy="22" r="17" fill="' + k + '"/>'; s += r === 1 ? '<path d="M15 24 Q13 4 32 4 Q51 4 49 24 Q46 12 34 11 Q24 12 15 24 Z" fill="#2B1A14"/>' : '<path d="M15 22 Q14 4 32 4 Q50 4 49 20 Q42 12 30 12 Q22 13 15 22 Z" fill="#2B1A14"/>'; }
  s += '<circle cx="26" cy="24" r="2.4" fill="#2B1A14"/><circle cx="38" cy="24" r="2.4" fill="#2B1A14"/><path d="M27 31 Q32 34 37 31" stroke="#B9473F" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="32" cy="50" r="5" fill="#14204F"/></svg>';
  return s;
}

/* ================= Util ================= */
function simpanLokal(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function bacaLokal(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
function acak(n) { var c = 'abcdefghijkmnpqrstuvwxyz23456789', s = ''; for (var i = 0; i < n; i++) s += c[Math.floor(Math.random() * c.length)]; return s; }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]; }); }
function angka(n) { return Number(n || 0).toLocaleString('id-ID'); }
var saya = bacaLokal('kreova_murid');
var uid = bacaLokal('kreova_uid'); if (!uid || String(uid).length < 8) { uid = acak(16); simpanLokal('kreova_uid', uid); }
/* Link undangan teman: ?ajak=KODE (disimpan sampai murid baru mendaftar) */
(function () { try { var k = new URLSearchParams(location.search).get('ajak'); if (k && /^[a-z0-9]{4,8}$/.test(k) && !saya) simpanLokal('kreova_ajak', k); if (k) history.replaceState(null, '', location.pathname); } catch (e) {} })();
function bersihIG(v) { var s = String(v || '').trim().toLowerCase(), m = s.match(/instagram\.com\/([a-z0-9._]+)/); if (m) s = m[1]; s = s.replace(/^@+/, '').replace(/[^a-z0-9._]/g, '').slice(0, 30); return /^[a-z0-9._]{2,30}$/.test(s) ? s : ''; }

/* ================= Status sekolah (dari server) ================= */
var STATUS = { online:false, total:null, no:null, absen:null, vote:null, voteHasil:null, voteMinggu:null, lapakSaya:null, lapak:{ pilihan:[], semua:[], syarat:3 }, dinding:null, ig:'', kode:'', undangan:{ masuk:0, sah:0, syarat:3 }, bolehLapak:false };
function terapkanSaya(s) { s = s || {}; STATUS.no = s.no; STATUS.absen = s.absen; STATUS.vote = s.vote; STATUS.lapakSaya = s.lapak; STATUS.ig = s.ig || ''; STATUS.kode = s.kode || ''; STATUS.undangan = s.undangan || STATUS.undangan; STATUS.bolehLapak = !!s.bolehLapak; }
function linkUndangan() { return location.origin + '/?ajak=' + STATUS.kode; }
function linkLapak(slug) { return location.origin + '/lapak/' + slug; }

/* ================= Kamera ================= */
var W = 1080, H = 2880;
var vp = document.getElementById('viewport'), world = document.getElementById('world');
var cam = { s:1, x:0, y:0 };
function minS() { return Math.max(innerWidth / W, innerHeight / H); }
function clamp() {
  cam.s = Math.min(Math.max(cam.s, minS()), minS() * 4.5);
  var ww = W * cam.s, wh = H * cam.s;
  cam.x = ww <= innerWidth ? (innerWidth - ww) / 2 : Math.min(0, Math.max(innerWidth - ww, cam.x));
  cam.y = wh <= innerHeight ? (innerHeight - wh) / 2 : Math.min(0, Math.max(innerHeight - wh, cam.y));
}
function render() { clamp(); world.style.transform = 'translate(' + cam.x + 'px,' + cam.y + 'px) scale(' + cam.s + ')'; world.style.setProperty('--inv', (1 / cam.s).toFixed(3)); }
function lihat(wx, wy, s) { if (s != null) cam.s = s; cam.x = innerWidth / 2 - wx * cam.s; cam.y = innerHeight / 2 - wy * cam.s; render(); }
function zoomDi(f, sx, sy) { var wx = (sx - cam.x) / cam.s, wy = (sy - cam.y) / cam.s; cam.s *= f; clamp(); cam.x = sx - wx * cam.s; cam.y = sy - wy * cam.s; render(); }
var anim = null;
function terbang(wx, wy, s, ms, selesai) {
  cancelAnimationFrame(anim);
  var a = { s:cam.s, cx:(innerWidth / 2 - cam.x) / cam.s, cy:(innerHeight / 2 - cam.y) / cam.s }, t0 = performance.now();
  function step(t) { var k = Math.min(1, (t - t0) / ms), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    lihat(a.cx + (wx - a.cx) * e, a.cy + (wy - a.cy) * e, a.s + (s - a.s) * e);
    if (k < 1) anim = requestAnimationFrame(step); else if (selesai) selesai(); }
  anim = requestAnimationFrame(step);
}
function skalaAwal() { return Math.max(minS(), Math.min(innerWidth / 860, 1.2)); }

/* ================= Murid ================= */
var lapisan = document.getElementById('lapisan-murid');
var murid = {};
function buatMurid(id, data, punyaSaya) {
  var el = document.createElement('div');
  el.className = 'murid ' + (punyaSaya ? 'saya' : 'lain');
  el.innerHTML = avatarSVG(data.look) + '<span class="tag"></span><span class="bubble"></span>';
  if (!punyaSaya) { el.dataset.murid = id; el.setAttribute('role', 'button'); }
  lapisan.appendChild(el);
  var x = data.x == null ? 430 : data.x, y = data.y == null ? 2520 : data.y;
  var m = { el:el, bubble:el.querySelector('.bubble'), x:x, y:y, tx:x, ty:y, nama:data.nama || 'Murid', jualan:data.jualan || '', look:data.look || {}, beruntun:data.beruntun || 0, saya:punyaSaya, tBubble:null };
  tulisTag(m); taruh(m); murid[id] = m; return m;
}
function tulisTag(m) { m.el.querySelector('.tag').textContent = m.saya ? m.nama + ' (kamu)' : m.nama; if (!m.saya) m.el.setAttribute('aria-label', 'Murid ' + m.nama); }
function taruh(m) { m.el.style.left = m.x + 'px'; m.el.style.top = m.y + 'px'; m.el.style.zIndex = Math.round(m.y); }
function hapusMurid(id) { var m = murid[id]; if (m && !m.saya) { m.el.remove(); delete murid[id]; } }
function perbaruiMurid(id, data) {
  var m = murid[id]; if (!m) return buatMurid(id, data, false);
  if (data.nama && data.nama !== m.nama) { m.nama = data.nama; tulisTag(m); }
  if (data.jualan != null) m.jualan = data.jualan;
  if (data.beruntun != null) m.beruntun = data.beruntun;
  if (data.look && JSON.stringify(data.look) !== JSON.stringify(m.look)) { m.look = data.look; m.el.querySelector('.tubuh').outerHTML = avatarSVG(data.look); }
  if (data.x != null) { m.tx = data.x; m.ty = data.y; }
  return m;
}
function bicara(m, teks) { m.bubble.textContent = teks; m.bubble.classList.add('on'); clearTimeout(m.tBubble); m.tBubble = setTimeout(function () { m.bubble.classList.remove('on'); }, 4200); }
var aku = null, setelahSampai = null, KECEPATAN = 0.32, tAkhir = performance.now();
function loop(t) {
  var dt = Math.min(64, t - tAkhir); tAkhir = t;
  for (var id in murid) {
    var m = murid[id], dx = m.tx - m.x, dy = m.ty - m.y, d = Math.hypot(dx, dy);
    if (d > 1) {
      var step = Math.min(d, KECEPATAN * dt); m.x += dx / d * step; m.y += dy / d * step; taruh(m);
      if (!m.el.classList.contains('jalan')) m.el.classList.add('jalan');
      if (Math.abs(dx) > 2) m.el.classList.toggle('kiri', dx < 0);
      if (m.saya && !pts.size) ikutiKamera(m);
    } else if (m.el.classList.contains('jalan')) {
      m.x = m.tx; m.y = m.ty; taruh(m); m.el.classList.remove('jalan');
      if (m.saya && setelahSampai) { var f = setelahSampai; setelahSampai = null; f(); }
    }
  }
  requestAnimationFrame(loop);
}
function ikutiKamera(m) { var sx = cam.x + m.x * cam.s, sy = cam.y + m.y * cam.s, mg = 90; if (sx < mg || sx > innerWidth - mg || sy < mg + 100 || sy > innerHeight - mg - 60) { cam.x += (innerWidth / 2 - sx) * 0.06; cam.y += (innerHeight / 2 - sy) * 0.06; render(); } }
var tgt = document.getElementById('target');
function jalanKe(x, y, selesai) {
  if (!aku) return;
  x = Math.round(Math.min(Math.max(x, 30), W - 30)); y = Math.round(Math.min(Math.max(y, 1000), H - 10));
  tgt.style.left = x + 'px'; tgt.style.top = y + 'px'; tgt.classList.remove('on'); void tgt.offsetWidth; tgt.classList.add('on');
  aku.tx = x; aku.ty = y; setelahSampai = selesai || null;
  if (Math.hypot(x - aku.x, y - aku.y) <= 1 && selesai) { setelahSampai = null; selesai(); }
  jaringan.gerak(x, y);
}

/* ================= Jaringan ================= */
var jaringan = { mode:'sendiri', gerak:function () {}, ngobrol:function () {}, kirim:function () { return false; } };
var lampu = document.getElementById('lampu'), teksOnline = document.getElementById('teks-online');
function statusOnline(online, catatan) { lampu.classList.toggle('on', online > 0); teksOnline.textContent = catatan || (online + ' murid online'); }
function teksFrasa(i, keNama) { return i === 100 ? 'Halo, ' + (keNama || 'kak') + '!' : (FRASA[i] || ''); }
function perbaruiTarget() {
  var c = document.getElementById('chip-target');
  if (STATUS.total == null) { c.hidden = true; return; }
  c.hidden = false; c.textContent = angka(STATUS.total) + ' / ' + angka(SEKOLAH.targetMurid) + ' murid';
}
function sambungServer(url) {
  var ws = null, idSaya = null, jeda = 1000, antrean = null, tGerak = 0;
  function kirim(o) { if (ws && ws.readyState === 1) { ws.send(JSON.stringify(o)); return true; } return false; }
  function buka() {
    statusOnline(0, 'Menghubungkan…');
    try { ws = new WebSocket(url); } catch (e) { return ulang(); }
    ws.onopen = function () { jeda = 1000; kirim({ t:'masuk', uid:uid, nama:saya.nama, jualan:saya.jualan, ig:saya.ig || '', look:saya.look, x:Math.round(aku.tx), y:Math.round(aku.ty), baru:baruDaftar, ajak:baruDaftar ? (bacaLokal('kreova_ajak') || '') : '' }); };
    ws.onmessage = function (ev) { var m; try { m = JSON.parse(ev.data); } catch (e) { return; } if (m && typeof m === 'object') terima(m); };
    ws.onclose = function () { STATUS.online = false; ulang(); };
    ws.onerror = function () { try { ws.close(); } catch (e) {} };
  }
  function ulang() { statusOnline(0, 'Terputus, mencoba lagi…'); setTimeout(buka, jeda); jeda = Math.min(jeda * 2, 15000); }
  function terima(m) {
    if (m.t === 'selamat') {
      idSaya = m.id; STATUS.online = true;
      for (var id in murid) if (!murid[id].saya) hapusMurid(id);
      (m.murid || []).forEach(function (p) { if (p.id === idSaya) return; var mm = perbaruiMurid(p.id, p); mm.x = mm.tx; mm.y = mm.ty; taruh(mm); });
      statusOnline(m.online); STATUS.total = m.total; perbaruiTarget();
      if (m.nama && m.nama !== saya.nama) { saya.nama = m.nama; aku.nama = m.nama; tulisTag(aku); }
      terapkanSaya(m.saya); if (baruDaftar) { try { localStorage.removeItem('kreova_ajak'); } catch (e) {} baruDaftar = false; }
      if (STATUS.ig && !saya.ig) { saya.ig = STATUS.ig; simpanLokal('kreova_murid', saya); }
      var d = m.dunia || {}; STATUS.dinding = d.dinding; if (d.lapak) STATUS.lapak = d.lapak; if (d.vote) { STATUS.voteHasil = d.vote.hasil; STATUS.voteMinggu = d.vote.minggu; }
      aku.beruntun = STATUS.absen ? STATUS.absen.beruntun : 0;
      perbaruiTombolAbsen(); gambarPasar(); segarkanPanel(); cekLapakKosong();
    }
    else if (m.t === 'masuk') { if (m.p.id !== idSaya) { var mm = perbaruiMurid(m.p.id, m.p); mm.x = mm.tx; mm.y = mm.ty; taruh(mm); } }
    else if (m.t === 'gerak') { if (m.id !== idSaya && murid[m.id]) perbaruiMurid(m.id, { x:m.x, y:m.y }); }
    else if (m.t === 'ngobrol') { var s2 = m.id === idSaya ? aku : murid[m.id]; if (s2) bicara(s2, m.teks); }
    else if (m.t === 'keluar') hapusMurid(m.id);
    else if (m.t === 'jumlah') { statusOnline(m.online); STATUS.total = m.total; perbaruiTarget(); }
    else if (m.t === 'ubah') { if (m.p.id !== idSaya) perbaruiMurid(m.p.id, m.p); }
    else if (m.t === 'absen') { STATUS.absen = { beruntun:m.beruntun, jumlah:m.jumlah, sudahHariIni:true }; aku.beruntun = m.beruntun; perbaruiTombolAbsen(); toast(m.baru ? (m.beruntun > 1 ? 'Hadir! ' + m.beruntun + ' hari beruntun' : 'Hadir! Absen hari ini tercatat') : 'Kamu sudah absen hari ini'); segarkanPanel(); }
    else if (m.t === 'vote') { STATUS.voteHasil = m.hasil; STATUS.voteMinggu = m.minggu; if (m.pilihan != null) { STATUS.vote = m.pilihan; toast('Pilihanmu tercatat'); } segarkanPanel(); }
    else if (m.t === 'pasar') { if (m.lapak) STATUS.lapak = m.lapak; gambarPasar(); segarkanPanel(); }
    else if (m.t === 'status') {
      var sebelum = STATUS.lapakSaya ? STATUS.lapakSaya.status : null, bolehDulu = STATUS.bolehLapak;
      terapkanSaya(m.saya); segarkanPanel();
      var kini = STATUS.lapakSaya ? STATUS.lapakSaya.status : null;
      if (m.info === 'setuju' && kini === 'tampil') toast('Lapakmu sudah tampil di Pasar Sekolah!');
      else if (m.info === 'tolak') toast('Pengajuan lapakmu belum disetujui. Cek di Pasar Sekolah.');
      else if (!bolehDulu && STATUS.bolehLapak) toast('Lahan lapakmu terbuka! Isi lapakmu di Pasar Sekolah.');
      else if (sebelum !== kini && kini === 'tampil') toast('Lapakmu sudah tampil di Pasar Sekolah!');
    }
    else if (m.t === 'hasilCari') { var el = document.getElementById('hasil-cari'); if (el) el.innerHTML = m.hasil.length ? '<div class="daftar-nama">' + m.hasil.map(barisNama).join('') + '</div>' : '<p class="catatan">Nama "' + esc(m.q) + '" belum ada di dinding.</p>'; }
    else if (m.t === 'dinding') { var dl = document.getElementById('daftar-dinding'); if (dl) { dl.insertAdjacentHTML('beforeend', m.isi.map(barisNama).join('')); var lb = document.getElementById('lebih-dinding'); if (lb) { if ((m.hal + 1) * 60 >= m.total) lb.remove(); else lb.dataset.hal = m.hal + 1; } } }
    else if (m.t === 'reset') { try { localStorage.removeItem('kreova_murid'); } catch (e) {} location.reload(); }
    else if (m.t === 'galat') toast(m.teks);
    else if (m.t === 'penuh') statusOnline(0, 'Sekolah sedang penuh, coba lagi nanti');
  }
  jaringan = {
    mode:'server',
    gerak:function (x, y) { clearTimeout(antrean); var tunggu = Math.max(0, 180 - (Date.now() - tGerak)); antrean = setTimeout(function () { tGerak = Date.now(); kirim({ t:'gerak', x:x, y:y }); }, tunggu); },
    ngobrol:function (i, ke) { kirim({ t:'ngobrol', i:i, ke:ke || null }); },
    ubah:function () { kirim({ t:'ubah', nama:saya.nama, jualan:saya.jualan, ig:saya.ig || '', look:saya.look }); },
    kirim:kirim
  };
  setInterval(function () { if (ws && ws.readyState === 1) ws.send('ping'); }, 25000);
  buka();
}
function sambungRoom(room) {
  jaringan = {
    mode:'room', kirim:function () { return false; },
    gerak:function (x, y) { room.presence({ x:x, y:y }).catch(function () {}); },
    ngobrol:function (i, ke) { bicara(aku, teksFrasa(i, ke && murid[ke] ? murid[ke].nama : null)); room.emit('ngobrol', { i:i, ke:ke || null }).catch(function () {}); },
    ubah:function () { room.presence({ nama:saya.nama, jualan:saya.jualan, look:saya.look }).catch(function () {}); }
  };
  room.presence({ nama:saya.nama, jualan:saya.jualan, look:saya.look, x:Math.round(aku.tx), y:Math.round(aku.ty) }).catch(function () {});
  room.onPeers(function (c) {
    c.left.forEach(function (p) { hapusMurid(p.peer); });
    c.joined.concat(c.updated).forEach(function (p) {
      if (p.sameTab) return; var pr = p.presence || {}; if (typeof pr.x !== 'number' || typeof pr.y !== 'number') return;
      var baru = !murid[p.peer];
      var mm = perbaruiMurid(p.peer, { nama:String(pr.nama || 'Murid').slice(0, 16), jualan:String(pr.jualan || '').slice(0, 24), look:pr.look || {}, x:Math.max(0, Math.min(W, pr.x)), y:Math.max(0, Math.min(H, pr.y)) });
      if (baru) { mm.x = mm.tx; mm.y = mm.ty; taruh(mm); }
    });
    statusOnline(c.peers.length, c.peers.length + ' online · mode uji');
  });
  room.on('ngobrol', function (msg) {
    if (msg.sameTab) return; var d = msg.data || {}, s = murid[msg.peer], i = d.i | 0;
    if (!(i === 100 || (i >= 0 && i < FRASA.length))) return;
    if (s) bicara(s, teksFrasa(i, d.ke === null ? null : (murid[d.ke] ? murid[d.ke].nama : saya.nama)));
  });
}
function mulaiJaringan() {
  var url = SEKOLAH.server, diClaude = window.claude && typeof window.claude.use === 'function';
  if (!url && !diClaude && /^https?:$/.test(location.protocol)) url = (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/ws';
  if (url) { sambungServer(url); return; }
  if (diClaude) { statusOnline(0, 'Menghubungkan…'); window.claude.use('room').then(function (room) { if (room) sambungRoom(room); else statusOnline(0, 'Mode sendiri'); }).catch(function () { statusOnline(0, 'Mode sendiri'); }); return; }
  statusOnline(0, 'Mode sendiri');
}
function butuhServer() { if (jaringan.mode === 'server' && STATUS.online) return true; toast('Fitur ini aktif saat sekolah sudah online di servernya'); return false; }

/* ================= Gestur ================= */
var pts = new Map(), geser = false, awal = null, pinchD = 0;
vp.addEventListener('pointerdown', function (e) {
  pts.set(e.pointerId, { x:e.clientX, y:e.clientY });
  if (pts.size === 1) { awal = { x:e.clientX, y:e.clientY, cx:cam.x, cy:cam.y, t:e.target }; geser = false; }
  if (pts.size === 2) { var a = Array.from(pts.values()); pinchD = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y); geser = true; }
  cancelAnimationFrame(anim);
});
addEventListener('pointermove', function (e) {
  if (!pts.has(e.pointerId)) return;
  pts.set(e.pointerId, { x:e.clientX, y:e.clientY });
  if (pts.size === 2) { var a = Array.from(pts.values()), d = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y); if (pinchD) zoomDi(d / pinchD, (a[0].x + a[1].x) / 2, (a[0].y + a[1].y) / 2); pinchD = d; return; }
  if (!awal) return;
  var dx = e.clientX - awal.x, dy = e.clientY - awal.y;
  if (!geser && Math.hypot(dx, dy) > 8) { geser = true; vp.classList.add('drag'); sembunyikanHint(); }
  if (geser) { cam.x = awal.cx + dx; cam.y = awal.cy + dy; render(); }
});
function lepas(e) {
  if (!pts.has(e.pointerId)) return;
  pts.delete(e.pointerId); vp.classList.remove('drag');
  if (pts.size === 0) { if (!geser && awal) ketuk(e.clientX, e.clientY, awal.t); awal = null; pinchD = 0; }
  else if (pts.size === 1) { var p = Array.from(pts.values())[0]; awal = { x:p.x, y:p.y, cx:cam.x, cy:cam.y, t:null }; }
}
addEventListener('pointerup', lepas); addEventListener('pointercancel', lepas);
vp.addEventListener('wheel', function (e) { e.preventDefault(); zoomDi(Math.exp(-e.deltaY * 0.0015), e.clientX, e.clientY); }, { passive:false });
document.getElementById('zin').onclick = function () { zoomDi(1.3, innerWidth / 2, innerHeight / 2); };
document.getElementById('zout').onclick = function () { zoomDi(1 / 1.3, innerWidth / 2, innerHeight / 2); };
document.getElementById('home').onclick = function () { terbang(aku ? aku.x : 430, aku ? aku.y - 60 : 2400, skalaAwal(), 700); };
addEventListener('resize', render);

/* ================= Titik peta ================= */
var TITIK = { gerbang:[430,2530], pengumuman:[170,2210], usulan:[690,2205], kaskelas:[230,2650], koperasi:[560,2650], dinding:[745,1985], pasar:[142,1540], naya:[455,2665] };
var kelasPos = [[205,1770],[370,1770],[535,1770],[205,1960],[370,1960],[535,1960]];
var LAPAK_POS = [[70,1250],[142,1250],[214,1250],[70,1340],[142,1340],[214,1340],[70,1430],[142,1430],[214,1430],[70,1520],[142,1520],[214,1520]];
/* Gedung kelas yang sudah dibangun (menutupi kavling kosong) */
function GEDUNG_KELAS(no) { return '<svg viewBox="0 -14 126 136" style="position:absolute;left:0;top:-14px;width:126px;height:136px;pointer-events:none;overflow:visible" aria-hidden="true"><rect x="-1" y="-1" width="128" height="124" rx="11" fill="#D9B07A" stroke="#F1DDB5" stroke-width="5"/><ellipse cx="63" cy="114" rx="60" ry="7" fill="#000" opacity=".16"/><rect x="2" y="104" width="122" height="12" rx="4" fill="#B98A57"/><rect x="14" y="50" width="98" height="58" fill="#F4E6CC"/><rect x="14" y="98" width="98" height="10" fill="#E3CFA8"/><path d="M4 54L63 12L122 54Z" fill="#14204F"/><path d="M4 54H122L115 61H11Z" fill="#F5C518"/><rect x="61" y="0" width="3" height="16" fill="#0C1538"/><path d="M64 1H80L76 6L80 11H64Z" fill="#F5C518"/><rect x="45" y="28" width="36" height="18" rx="4" fill="#F5C518"/><text x="63" y="42" text-anchor="middle" font-family="Plus Jakarta Sans,sans-serif" font-weight="800" font-size="13" fill="#14204F">' + no + '</text><rect x="21" y="66" width="24" height="20" rx="2" fill="#A9D8F2" stroke="#14204F" stroke-width="2.5"/><path d="M33 66V86M21 76H45" stroke="#14204F" stroke-width="2"/><rect x="81" y="66" width="24" height="20" rx="2" fill="#A9D8F2" stroke="#14204F" stroke-width="2.5"/><path d="M93 66V86M81 76H105" stroke="#14204F" stroke-width="2"/><rect x="52" y="70" width="22" height="38" rx="2" fill="#A86E3E"/><circle cx="69" cy="90" r="2" fill="#F5C518"/></svg>'; }
var wadahKelas = document.getElementById('kelas-spots');
SEKOLAH.kelas.forEach(function (k, i) {
  var b = document.createElement('button');
  b.className = 'spot'; b.dataset.spot = 'kelas'; b.dataset.i = i;
  b.style.cssText = 'left:' + kelasPos[i][0] + 'px;top:' + kelasPos[i][1] + 'px;width:126px;height:122px';
  b.setAttribute('aria-label', 'Kelas ' + k.no + ': ' + k.judul + (k.status === 'buka' ? '' : ' (segera dibuka)'));
  b.innerHTML = k.status === 'buka' ? GEDUNG_KELAS(k.no) + '<span class="buka-badge">Kelas dibuka</span>' : '<span class="gembok" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5C518" stroke-width="2.6" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg></span>';
  wadahKelas.appendChild(b);
});
var GEMBOK = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5C518" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
var SVG_LAPAK = function (isi) { return '<svg viewBox="0 0 62 60" aria-hidden="true"><ellipse cx="31" cy="57" rx="28" ry="4" fill="#000" opacity=".15"/><rect x="6" y="22" width="50" height="34" fill="' + (isi ? '#F4E6CC' : '#EADBC2') + '"/><rect x="10" y="40" width="42" height="14" fill="' + (isi ? '#A86E3E' : '#C9B79B') + '"/>'
  + (isi ? '<rect x="3" y="12" width="8" height="14" fill="#14204F"/><rect x="11" y="12" width="8" height="14" fill="#F5C518"/><rect x="19" y="12" width="8" height="14" fill="#14204F"/><rect x="27" y="12" width="8" height="14" fill="#F5C518"/><rect x="35" y="12" width="8" height="14" fill="#14204F"/><rect x="43" y="12" width="8" height="14" fill="#F5C518"/><rect x="51" y="12" width="8" height="14" fill="#14204F"/>' : '<rect x="3" y="12" width="56" height="14" fill="#CDBEA5"/>') + '</svg>'; };
function gambarPasar() {
  var w = document.getElementById('lapak-lapisan'), h = '', pil = STATUS.lapak.pilihan || [];
  LAPAK_POS.forEach(function (p, i) {
    var l = i < 3 ? pil[i] : null, kunci = i >= 3;
    h += '<button class="lapak' + (l ? '' : ' kosong') + (kunci ? ' terkunci' : '') + '" data-lapak="' + i + '" style="left:' + p[0] + 'px;top:' + p[1] + 'px;z-index:' + p[1] + '" aria-label="' + (l ? 'Lapak pilihan ' + esc(l.usaha) : kunci ? 'Lahan lapak terkunci' : 'Lahan lapak kosong') + '">' + SVG_LAPAK(!!l)
      + (l ? '<span class="papan">' + esc(l.usaha) + '</span>' : '') + (kunci ? '<span class="gembok-lapak" aria-hidden="true">' + GEMBOK + '</span>' : '') + '</button>';
  });
  w.innerHTML = h;
}
gambarPasar();
function ketuk(sx, sy, t) {
  sembunyikanHint();
  var el = (t && t.closest) ? t.closest('.spot, #naya, .murid.lain, .lapak') : null;
  if (el) { aksiTitik(el); return; }
  jalanKe((sx - cam.x) / cam.s, (sy - cam.y) / cam.s);
}
document.addEventListener('keydown', function (e) {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.closest && e.target.closest('.spot, #naya, .lapak') && !panel.classList.contains('on')) { e.preventDefault(); aksiTitik(e.target.closest('.spot, #naya, .lapak')); }
});
var panelAktif = null;
function aksiTitik(el) {
  if (!aku) return;
  if (el.id === 'naya') { jalanKe(TITIK.naya[0], TITIK.naya[1], sapaNaya); return; }
  if (el.dataset.murid) { bukaKartuLain(el.dataset.murid); return; }
  if (el.dataset.lapak != null) { var i = +el.dataset.lapak, l = i < 3 ? (STATUS.lapak.pilihan || [])[i] : null; jalanKe(LAPAK_POS[i][0], LAPAK_POS[i][1] + 30, function () { if (l) tampilPanel('lapakLain', l.slug); else tampilPanel('pasar'); }); return; }
  var s = el.dataset.spot;
  if (s === 'kelas') { var k = +el.dataset.i; jalanKe(kelasPos[k][0], kelasPos[k][1] + 70, function () { tampilPanel('kelas', k); }); return; }
  jalanKe(TITIK[s][0], TITIK[s][1], function () { tampilPanel(s); });
}
var iSapa = 0, tSapa;
function sapaNaya() { var b = document.getElementById('bubble-naya'); b.textContent = SAPAAN[iSapa++ % SAPAAN.length]; b.classList.add('on'); clearTimeout(tSapa); tSapa = setTimeout(function () { b.classList.remove('on'); }, 2800); }

/* ================= Panel ================= */
function tombolLink(url, teks, kelas) { return url ? '<a class="tombol ' + kelas + '" href="' + esc(url) + '" target="_blank" rel="noopener">' + teks + '</a>' : '<span class="tombol ' + kelas + '" aria-disabled="true">' + teks + ' · segera</span>'; }
function barisNama(d) { return '<div' + (d.no === STATUS.no ? ' class="saya"' : '') + '><b>#' + angka(d.no) + '</b>' + esc(d.nama) + '</div>'; }
var PANEL = {
  gerbang:function () {
    var abs = STATUS.absen;
    return '<p class="p-label">GERBANG SEKOLAH</p><h2 class="p-judul" id="p-judul">Selamat datang, ' + esc(saya.nama) + '!</h2>'
      + '<div class="kepala-naya">' + KEPALA_NAYA + '</div>'
      + '<p class="p-teks">Aku Bu Naya, kepala sekolah di sini. Sekolah UMKM Kreova tidak punya gedung dan tidak ada SPP. Kurikulumnya <b>kalian yang ikut susun</b>.</p>'
      + '<p class="p-teks" style="clear:both">' + (STATUS.no ? 'Kamu murid <b>ke-' + angka(STATUS.no) + '</b>. ' : '') + (abs && abs.sudahHariIni ? 'Absen hari ini sudah tercatat.' : 'Jangan lupa absen hari ini.') + '</p>'
      + (STATUS.online && !STATUS.ig ? '<div class="kartu"><b>Lengkapi kartu murid</b><p class="rak-isi">Tulis akun Instagram-mu supaya bisa buka lapak di Pasar Sekolah.</p><button class="tombol kuning kecil" data-aksi="kartu">Isi akun IG</button></div>' : '')
      + (abs && abs.sudahHariIni ? '' : '<button class="tombol kuning" data-aksi="absen">Absen hari ini</button>')
      + tombolLink(SEKOLAH.link.instagram, 'Follow di Instagram', 'utama') + tombolLink(SEKOLAH.link.tiktok, 'Follow di TikTok', 'putih') + tombolLink(SEKOLAH.link.grupFB, 'Gabung Grup FB murid', 'putih');
  },
  pengumuman:function () {
    var target = STATUS.total == null ? '' : '<div class="kartu"><small>Target sekolah</small><b>' + angka(STATUS.total) + ' / ' + angka(SEKOLAH.targetMurid) + ' murid: ' + esc(SEKOLAH.hadiahTarget) + '</b><div class="hasil"><div class="baris"><span class="bar"><i style="width:' + Math.min(100, Math.round(STATUS.total / SEKOLAH.targetMurid * 100)) + '%"></i></span></div></div></div>';
    return '<p class="p-label">PAPAN PENGUMUMAN</p><h2 class="p-judul" id="p-judul">Pengumuman sekolah</h2>' + target
      + SEKOLAH.pengumuman.map(function (p) { return '<div class="kartu"><small>' + esc(p.tanggal) + '</small><b>' + esc(p.judul) + '</b><div class="p-teks" style="margin:4px 0 0">' + esc(p.isi) + '</div></div>'; }).join('')
      + tombolLink(SEKOLAH.link.episodeTerbaru, 'Tonton episode terbaru', 'utama');
  },
  usulan:function () {
    var h = '<p class="p-label">KOTAK USULAN · PUTARAN ' + PUTARAN + '</p><h2 class="p-judul" id="p-judul">Kelas berikutnya apa?</h2><p class="p-teks">Putaran 1 dimenangkan <b>Untung bocor</b>, jadi Kelas 01 sudah dibuka. Sekarang pilih masalah yang paling bikin kamu pusing. Pilihan terbanyak jadi kelas berikutnya. Kamu boleh ganti pilihan selama putaran berjalan.</p>';
    h += PILIHAN.map(function (p, i) { return '<button class="opsi" data-pilih="' + (i + 1) + '" aria-pressed="' + (STATUS.vote === i + 1) + '"><span class="no">' + (i + 1) + '</span>' + p + '</button>'; }).join('');
    if (STATUS.voteHasil) {
      var total = STATUS.voteHasil.reduce(function (a, b) { return a + b; }, 0), maks = Math.max.apply(null, STATUS.voteHasil.concat([1]));
      h += '<p class="p-label" style="margin-top:14px">HASIL SEMENTARA · ' + angka(total) + ' SUARA</p><div class="hasil">' + STATUS.voteHasil.map(function (v, i) { return '<div class="baris"><span style="width:20px">' + (i + 1) + '</span><span class="bar"><i style="width:' + Math.round(v / maks * 100) + '%"></i></span><span class="n">' + angka(v) + '</span></div>'; }).join('') + '</div>';
      h += '<p class="catatan">Satu perangkat satu suara per putaran. Suara dari komentar video juga ikut dihitung saat pengumuman.</p>';
    } else h += '<p class="catatan">Hasil suara tampil saat sekolah sudah online di servernya.</p>';
    return h;
  },
  dinding:function () {
    var d = STATUS.dinding;
    return '<p class="p-label">DINDING ANGKATAN PERTAMA</p><h2 class="p-judul" id="p-judul">' + (d ? angka(d.total) + ' murid angkatan pertama' : 'Dinding Angkatan Pertama') + '</h2>'
      + '<p class="p-teks">1.000 murid pertama namanya terukir di dinding ini, selamanya.' + (STATUS.no ? (STATUS.no <= 1000 ? ' Kamu murid <b>#' + angka(STATUS.no) + '</b>.' : ' Kamu murid #' + angka(STATUS.no) + ', angkatan berikutnya.') : '') + '</p>'
      + '<form class="baris-cari" id="form-cari"><label class="sr" for="in-cari" style="position:absolute;left:-9999px">Cari nama</label><input id="in-cari" maxlength="16" placeholder="Cari namamu…"><button type="submit">Cari</button></form><div id="hasil-cari"></div>'
      + (d ? '<p class="p-label" style="margin-top:14px">TERBARU</p><div class="daftar-nama" id="daftar-dinding">' + d.terbaru.map(barisNama).join('') + '</div>' + (d.total > d.terbaru.length ? '<button class="tombol putih" id="lebih-dinding" data-hal="0">Lihat semua nama</button>' : '') : '<p class="catatan">Daftar nama tampil saat sekolah sudah online di servernya.</p>');
  },
  pasar:function () { return panelPasar(); },
  lapakLain:function (slug) { var l = (STATUS.lapak.semua || []).filter(function (x) { return x.slug === slug; })[0]; if (!l) return panelPasar();
    return '<p class="p-label">LAPAK MURID · ' + esc(l.kategori).toUpperCase() + '</p><h2 class="p-judul" id="p-judul">' + esc(l.usaha) + '</h2>'
      + (l.perintis ? '<span class="lencana">★ Lapak Perintis</span>' : '') + (l.foto ? '<img class="lapak-foto" src="/foto/' + esc(l.foto) + '.jpg" alt="Foto produk ' + esc(l.usaha) + '">' : '')
      + (l.deskripsi ? '<p class="p-teks">' + esc(l.deskripsi) + '</p>' : '')
      + '<a class="tombol kuning" href="' + esc(linkLapak(l.slug)) + '" target="_blank" rel="noopener">Lihat produk &amp; pesan</a><button class="tombol putih" data-ke="pasar">Lihat semua lapak</button>'; },
  koperasi:function () { var k = SEKOLAH.koperasi;
    if (!k.buka) return '<p class="p-label">KOPERASI SEKOLAH</p><span class="gembok-besar">' + GEMBOK + ' Masih terkunci</span><h2 class="p-judul" id="p-judul">Koperasi segera dibuka</h2><p class="p-teks">Di sini nanti tersedia buku paket untuk setiap pelajaran.</p>';
    function rp(n) { return n ? 'Rp' + angka(n) : 'Gratis'; }
    return '<p class="p-label">KOPERASI SEKOLAH</p><h2 class="p-judul" id="p-judul">Buku paket &amp; alat praktik</h2>'
      + '<p class="p-teks">Kelasnya tetap gratis. Koperasi untuk kamu yang ingin belajar lebih dalam dan langsung praktik.</p>'
      + k.rak.map(function (b) { return '<div class="kartu rak"><img src="' + esc(b.cover) + '" alt="" loading="lazy"><div><small>' + esc(b.jenis) + '</small><b>' + esc(b.nama) + '</b>'
        + '<p class="rak-isi">' + esc(b.isi) + '</p><span class="rak-harga' + (b.harga ? '' : ' gratis') + '">' + rp(b.harga) + '</span>' + (b.nanti ? '<span class="rak-nanti">mulai 1 Jan: ' + rp(b.nanti) + '</span>' : '')
        + '<a class="tombol ' + (b.harga ? 'utama' : 'kuning') + ' kecil" href="' + esc(b.link) + '" target="_blank" rel="noopener">' + (b.harga ? 'Lihat buku' : 'Ambil gratis') + '</a></div></div>'; }).join('')
      + '<p class="catatan">' + esc(k.catatanHarga) + ' Pembayaran dan unduhan lewat toko resmi KREOVA di Lynk.id.</p>' + tombolLink(k.toko, 'Buka semua di Lynk.id', 'putih'); },
  kaskelas:function () { return SEKOLAH.kasKelas.buka
    ? '<p class="p-label">POS KAS KELAS</p><h2 class="p-judul" id="p-judul">Dukung Sekolah UMKM Kreova</h2><p class="p-teks">Sekolah tetap gratis. Kas Kelas adalah dukungan sukarela untuk produksi konten. Nominal bebas, tidak ada minimal, tidak wajib.</p>' + (SEKOLAH.kasKelas.gambarQRIS ? '<img src="' + esc(SEKOLAH.kasKelas.gambarQRIS) + '" alt="QRIS Kas Kelas KREOVA" style="width:100%;border-radius:14px;background:#fff">' : '')
    : '<p class="p-label">POS KAS KELAS</p><span class="gembok-besar">' + GEMBOK + ' Belum dibuka</span><h2 class="p-judul" id="p-judul">Belum dibuka</h2><p class="p-teks">Pos ini baru dibuka setelah kelas-kelas pertama berjalan. Sekolah UMKM Kreova tetap gratis untuk semua murid.</p>'; },
  kelas:function (i) { var k = SEKOLAH.kelas[i], buka = k.status === 'buka';
    return '<p class="p-label">KELAS ' + k.no + (buka ? '' : ' · SEGERA DIBUKA') + '</p><h2 class="p-judul" id="p-judul">' + esc(k.judul) + '</h2><p class="p-teks"><b>Masalahnya:</b> ' + esc(k.masalah) + '</p>'
      + (buka ? (k.ringkas ? '<div class="kartu"><small>Ringkasan pelajaran</small><ol style="margin:6px 0 0;padding-left:20px">' + k.ringkas.map(function (r) { return '<li class="p-teks" style="margin:0 0 6px">' + esc(r) + '</li>'; }).join('') + '</ol></div>' : '') + tombolLink(k.episode, 'Tonton pelajarannya', 'utama') + (k.pr ? '<div class="kartu" style="margin-top:14px"><small>PR minggu ini</small>' + esc(k.pr) + '</div>' : '') + (k.no === '01' && SEKOLAH.koperasi.buka ? '<button class="tombol putih" data-ke="koperasi">Alat praktik gratis: Seller Tools di Koperasi</button>' : '')
              : '<p class="p-teks">Kavling ini masih tanah kosong. Mau kelas ini dibuka duluan? Pilih di Kotak Usulan.</p><button class="tombol kuning" data-ke="usulan">Ke Kotak Usulan</button>'); },
  ngobrol:function () { return '<p class="p-label">OBROLAN CEPAT</p><h2 class="p-judul" id="p-judul">Mau bilang apa?</h2><div class="frasa">' + FRASA.map(function (f, i) { return '<button data-frasa="' + i + '">' + esc(f) + '</button>'; }).join('') + '</div><p class="catatan">Pesan muncul di atas kepalamu dan terlihat oleh murid lain.</p>'; }
};
function bukaKartuLain(id) {
  var m = murid[id]; if (!m) return;
  bukaPanel('<p class="p-label">KARTU MURID</p><div style="display:flex;gap:14px;align-items:center;margin-bottom:12px"><div class="km-preview" style="width:80px;height:100px">' + avatarSVG(m.look).replace('class="tubuh"', '') + '</div><div><h2 class="p-judul" id="p-judul" style="margin:0">' + esc(m.nama) + '</h2>'
    + (m.jualan ? '<p class="p-teks" style="margin:4px 0 6px">Jualan: <b>' + esc(m.jualan) + '</b></p>' : '') + (m.beruntun > 1 ? '<span class="lencana">Absen ' + m.beruntun + ' hari beruntun</span>' : '') + '</div></div>'
    + '<button class="tombol kuning" data-sapa="' + esc(id) + '">Sapa ' + esc(m.nama) + '</button><button class="tombol putih" data-dekati="' + esc(id) + '">Jalan ke dekatnya</button>', null);
}
var panel = document.getElementById('panel'), scrim = document.getElementById('scrim'), isi = document.getElementById('p-isi'), fokusSebelum = null;
function tampilPanel(nama, arg) { if (nama === 'pasar' && !(panelAktif && panelAktif.nama === 'pasar')) { editLapak = false; drafLapak = null; } bukaPanel(PANEL[nama](arg), { nama:nama, arg:arg }); }
function bukaPanel(html, info) { if (!panel.classList.contains('on')) fokusSebelum = document.activeElement; panelAktif = info || null; isi.innerHTML = html; panel.scrollTop = 0; panel.classList.add('on'); scrim.classList.add('on'); document.getElementById('tutup').focus(); }
function segarkanPanel() {
  if (!panel.classList.contains('on') || !panelAktif) return;
  if (['usulan', 'pasar', 'gerbang', 'pengumuman'].indexOf(panelAktif.nama) < 0) return;
  if (panelAktif.nama === 'pasar' && document.getElementById('form-lapak')) return;
  var ae = document.activeElement, sedangKetik = ae && (ae.tagName === 'INPUT' || ae.tagName === 'SELECT') && isi.contains(ae);
  if (sedangKetik) return;
  var gulir = panel.scrollTop; isi.innerHTML = PANEL[panelAktif.nama](panelAktif.arg); panel.scrollTop = gulir;
}
function tutupPanel() { if (!panel.classList.contains('on')) return; panel.classList.remove('on'); scrim.classList.remove('on'); panelAktif = null; if (fokusSebelum && fokusSebelum.focus) fokusSebelum.focus(); }
document.getElementById('tutup').onclick = tutupPanel; scrim.onclick = tutupPanel;
addEventListener('keydown', function (e) { if (e.key === 'Escape') tutupPanel(); });
var tObrol = 0;
function kirimObrol(i, ke) {
  if (Date.now() - tObrol < 1500) { toast('Tunggu sebentar sebelum kirim lagi'); return; }
  tObrol = Date.now();
  if (jaringan.mode === 'sendiri') bicara(aku, teksFrasa(i, ke && murid[ke] ? murid[ke].nama : null)); else jaringan.ngobrol(i, ke);
}
function absen() { if (!butuhServer()) return; if (STATUS.absen && STATUS.absen.sudahHariIni) { toast('Kamu sudah absen hari ini'); return; } jaringan.kirim({ t:'absen' }); }
isi.addEventListener('click', function (e) {
  var ke = e.target.closest('[data-ke]');
  if (ke) { var tuj = ke.dataset.ke; tutupPanel(); var t = TITIK[tuj]; setTimeout(function () { jalanKe(t[0], t[1], function () { tampilPanel(tuj); }); }, 250); return; }
  var fr = e.target.closest('[data-frasa]'); if (fr) { kirimObrol(+fr.dataset.frasa, null); tutupPanel(); return; }
  var sp = e.target.closest('[data-sapa]'); if (sp) { kirimObrol(100, sp.dataset.sapa); tutupPanel(); return; }
  var dk = e.target.closest('[data-dekati]'); if (dk) { var m = murid[dk.dataset.dekati]; tutupPanel(); if (m) jalanKe(m.x + (aku.x < m.x ? -60 : 60), m.y); return; }
  var ak = e.target.closest('[data-aksi="absen"]'); if (ak) { absen(); return; }
  var lb = e.target.closest('#lebih-dinding'); if (lb) { if (butuhServer()) { if (lb.dataset.hal === '0' && !lb.dataset.mulai) { lb.dataset.mulai = '1'; document.getElementById('daftar-dinding').innerHTML = ''; } jaringan.kirim({ t:'dinding', hal:+lb.dataset.hal }); } return; }
  var op = e.target.closest('[data-pilih]');
  if (op) {
    if (jaringan.mode === 'server' && STATUS.online) { jaringan.kirim({ t:'pilih', n:+op.dataset.pilih }); isi.querySelectorAll('.opsi').forEach(function (o) { o.setAttribute('aria-pressed', o === op ? 'true' : 'false'); }); }
    else toast('Voting aktif saat sekolah sudah online. Sementara, tulis angka ' + op.dataset.pilih + ' di komentar video.');
  }
});
isi.addEventListener('submit', function (e) {
  e.preventDefault();
  if (e.target.id === 'form-cari') { var q = document.getElementById('in-cari').value.trim(); if (q.length < 2) { toast('Ketik minimal 2 huruf'); return; } if (butuhServer()) jaringan.kirim({ t:'cari', q:q }); }
  if (e.target.id === 'form-lapak') { if (butuhServer()) kirimLapak(); }
});
document.getElementById('btn-ngobrol').onclick = function () { if (aku) tampilPanel('ngobrol'); };
document.getElementById('btn-kartu').onclick = function () { bukaDaftar(true); };
document.getElementById('btn-absen').onclick = absen;
function perbaruiTombolAbsen() {
  var b = document.getElementById('btn-absen'), a = STATUS.absen;
  if (a && a.sudahHariIni) { b.className = 'aksi hadir'; b.textContent = 'Hadir ✓' + (a.beruntun > 1 ? ' · ' + a.beruntun + ' hari' : ''); }
  else { b.className = 'aksi kuning'; b.textContent = 'Absen hari ini'; }
}

/* ================= Pasar Sekolah ================= */
var REKOMENDASI = { wa: { nama:'Jilid 2 · Script Balasan', link:'https://lynk.id/heykreova/v98wdkdm2ml7', teks:'Biar chat pembeli dari lapakmu nggak di-ghosting: 30 balasan siap salin.' },
  buka: { nama:'Paket Chat Jualan (Jilid 1 + 2)', link:'https://lynk.id/heykreova/z6pz2krloq7m', teks:'Lapakmu sudah tampil. Siapkan cara membalas pembeli yang mulai bertanya: membaca pembeli + 30 script balasan.' },
  fashion: { nama:'Buku Paket Bisnis Fashion Online', link:'https://lynk.id/heykreova/dxon45kk6qdp', teks:'Jualan fashion? Dari pilih produk, hitung HPP, sampai rencana 30 hari.' } };
function kartuRekomendasi(k) { var r = REKOMENDASI[k]; return '<div class="kartu saran"><small>Buku paket yang cocok</small><b>' + esc(r.nama) + '</b><p class="rak-isi">' + esc(r.teks) + '</p><a class="tombol utama kecil" href="' + esc(r.link) + '" target="_blank" rel="noopener">Lihat di Koperasi</a></div>'; }
var ATURAN_LAPAK = '<details class="aturan"><summary>Syarat &amp; aturan lapak</summary><ol>'
  + '<li>Daftar jadi murid dan tulis akun IG-mu sendiri di kartu murid.</li>'
  + '<li>Follow @hey.kreova dan absen "Hadir, Bu Naya" di komentar postingan kami.</li>'
  + '<li>Ajak 3 teman daftar lewat link undanganmu. Teman dihitung setelah absen di 2 hari berbeda.</li>'
  + '<li>Isi lapakmu: nama toko, produk, deskripsi, foto asli, dan WA atau link toko online.</li>'
  + '<li>Lapak dicek Bu Naya dulu. Setiap perubahan juga dicek ulang.</li></ol><ul>'
  + '<li>Jual produk asli milikmu sendiri, yang legal dan aman.</li>'
  + '<li>Pakai akun IG dan foto milikmu sendiri. Lapak yang memakai milik orang lain akan dihapus.</li>'
  + '<li>Transaksi langsung antara pembeli dan penjual. Sekolah UMKM Kreova tidak ikut menerima pembayaran dan tidak menjamin pengiriman.</li>'
  + '<li>Lapak yang dilaporkan dan terbukti menipu atau melanggar aturan akan dihapus.</li>'
  + '<li>Lapak yang tidak aktif 30 hari bisa diberikan ke murid lain.</li></ul></details>';
var editLapak = false, drafLapak = null, sudahDiingatkan = false;
function lapakKosong() { var l = STATUS.lapakSaya; return !!(l && l.status === 'tampil' && l.isi && !l.isi.deskripsi && !(l.isi.produk || []).length); }
function cekLapakKosong() { if (sudahDiingatkan || !lapakKosong()) return; sudahDiingatkan = true; setTimeout(function () { if (panel.classList.contains('on')) return; tampilPanel('pasar'); toast('Lapakmu sudah punya halaman sendiri. Yuk lengkapi!'); }, 4500); }
function barisLapak(l) { return '<a class="baris-lapak" href="' + esc(linkLapak(l.slug)) + '" target="_blank" rel="noopener">' + (l.foto ? '<img src="/foto/' + esc(l.foto) + '.jpg" alt="" loading="lazy">' : '<span class="tanpa-foto">' + esc(l.usaha.charAt(0)) + '</span>') + '<span><b>' + esc(l.usaha) + '</b><small>' + esc(l.kategori) + (l.perintis ? ' · ★ Perintis' : '') + '</small></span></a>'; }
function panelPasar() {
  var lp = STATUS.lapak || {}, pil = lp.pilihan || [], semua = lp.semua || [];
  var h = '<p class="p-label">PASAR SEKOLAH</p><h2 class="p-judul" id="p-judul">Lapak murid Sekolah UMKM Kreova</h2>'
    + '<p class="p-teks">Setiap lapak punya halaman sendiri: produk, foto asli, dan tombol pesan. Linknya bisa dipasang di bio atau status WA.</p>';
  if (pil.length) h += '<p class="p-label" style="margin-top:6px">LAPAK PILIHAN DI DEPAN</p>' + pil.map(barisLapak).join('');
  var lain = semua.filter(function (l) { return !pil.some(function (x) { return x.slug === l.slug; }); });
  if (lain.length) h += '<details class="semua-lapak"><summary>Semua lapak murid (' + angka(semua.length) + ')</summary>' + lain.map(barisLapak).join('') + '</details>';
  h += '<p class="p-label" style="margin-top:18px">LAPAKMU</p>' + bagianLapakSaya() + ATURAN_LAPAK;
  return h;
}
function bagianLapakSaya() {
  if (!(jaringan.mode === 'server' && STATUS.online)) return '<p class="catatan">Lapakmu tampil di sini saat sekolah sudah online.</p>';
  var l = STATUS.lapakSaya, u = STATUS.undangan || { masuk:0, sah:0, syarat:3 }, h = '';
  if (!STATUS.ig) return '<div class="kartu"><b>Isi akun IG-mu dulu</b><p class="rak-isi">Lapak hanya untuk murid yang menulis akun Instagram miliknya sendiri di kartu murid.</p><button class="tombol kuning kecil" data-aksi="kartu">Isi akun IG di kartu murid</button></div>';
  if (l && l.status === 'tampil') h += '<div class="kartu"><small>Lapakmu sudah tampil' + (l.perintis ? ' · ★ Lapak Perintis' : '') + '</small><b>' + esc(l.usaha) + '</b><input class="f link-salin" readonly value="' + esc(linkLapak(l.slug)) + '" aria-label="Link lapakmu"><div class="dua"><button class="tombol putih kecil" data-salin="' + esc(linkLapak(l.slug)) + '">Salin link</button><button class="tombol kuning kecil" data-bagikan="lapak">Bagikan</button></div><a class="tombol utama kecil" href="' + esc(linkLapak(l.slug)) + '" target="_blank" rel="noopener">Lihat halaman lapakku</a></div>';
  else if (l && l.status === 'menunggu') h += '<div class="kartu"><small>Menunggu dicek Bu Naya</small><b>' + esc(l.usaha) + '</b><p class="rak-isi">' + (l.tampil ? 'Perubahan lapakmu sedang dicek. Versi lama tetap tampil sampai perubahan disetujui.' : 'Biasanya dicek dalam 1×24 jam. Pastikan kamu sudah follow @hey.kreova dan absen di komentar, karena itu ikut dicek.') + '</p>' + (l.slug ? '<a class="tombol putih kecil" href="' + esc(linkLapak(l.slug)) + '" target="_blank" rel="noopener">Lihat lapak yang tampil</a>' : '') + '</div>';
  else if (l && (l.status === 'ditolak' || l.status === 'dihapus')) h += '<div class="kartu"><small>' + (l.status === 'ditolak' ? 'Belum disetujui' : 'Lapak dihapus') + '</small><b>' + esc(l.usaha) + '</b><p class="rak-isi">' + (l.alasan ? esc(l.alasan) : 'Cek lagi aturan lapak di bawah, lalu ajukan ulang.') + '</p></div>';
  if (!STATUS.bolehLapak) {
    var sah = Math.min(u.sah, u.syarat);
    h += '<div class="kartu kunci-lahan"><small>Lahan lapakmu masih terkunci</small><b>Ajak ' + u.syarat + ' teman daftar, lahanmu terbuka</b>'
      + '<div class="hasil"><div class="baris"><span class="bar"><i style="width:' + Math.round(sah / u.syarat * 100) + '%"></i></span><span class="n" style="width:auto">' + sah + '/' + u.syarat + '</span></div></div>'
      + '<p class="rak-isi">Teman dihitung sah setelah daftar lewat link undanganmu dan absen di 2 hari berbeda.' + (u.masuk > u.sah ? ' Sudah daftar: <b>' + u.masuk + '</b>, menunggu absen: <b>' + (u.masuk - u.sah) + '</b>.' : '') + '</p>'
      + '<input class="f link-salin" readonly value="' + esc(linkUndangan()) + '" aria-label="Link undanganmu"><div class="dua"><button class="tombol putih kecil" data-salin="' + esc(linkUndangan()) + '">Salin link</button><button class="tombol kuning kecil" data-bagikan="undangan">Bagikan</button></div></div>';
    return h;
  }
  if (l && l.status === 'tampil' && lapakKosong()) h += '<div class="kartu saran"><b>Lapakmu masih kosong</b><p class="rak-isi">Tambahkan foto asli, deskripsi, dan nomor WA atau link toko. Lapak yang lengkap dipajang di depan Pasar Sekolah dan bisa tampil di video Bu Naya.</p></div>';
  if ((l && (l.status === 'tampil' || l.status === 'menunggu')) && !editLapak && !lapakKosong()) return h + '<button class="tombol putih" data-aksi="editLapak">Ubah isi lapak</button>' + (l.status === 'tampil' ? kartuRekomendasi('buka') : '');
  return h + formLapak();
}
function isiDraf() {
  var l = STATUS.lapakSaya, d = l && l.isi ? l.isi : {};
  drafLapak = { usaha:d.usaha || (l ? l.usaha : '') || saya.jualan || '', kategori:d.kategori || (l ? l.kategori : '') || KATEGORI[0], deskripsi:d.deskripsi || '', wa:d.wa ? '0' + String(d.wa).slice(2) : '', izinWA:!!d.izinWA, link:d.link || '', legal:d.legal || '',
    produk:[0, 1, 2].map(function (i) { var p = (d.produk || [])[i] || {}; return { nama:p.nama || '', harga:p.harga || '', foto:p.foto || null }; }) };
}
function formLapak() {
  if (!drafLapak) isiDraf(); var d = drafLapak;
  var h = '<form id="form-lapak" class="form-lapak"><p class="catatan" style="margin-top:0">Lahan lapakmu terbuka. Isi selengkap mungkin: lapak dengan foto asli lebih sering dipilih tampil di depan.</p>'
    + '<label class="f" for="in-usaha">Nama toko</label><input class="f" id="in-usaha" name="usaha" maxlength="24" value="' + esc(d.usaha) + '" placeholder="Contoh: Rina Hijab">'
    + '<label class="f" for="in-kategori">Kategori</label><select class="f" id="in-kategori" name="kategori">' + KATEGORI.map(function (k) { return '<option' + (d.kategori === k ? ' selected' : '') + '>' + esc(k) + '</option>'; }).join('') + '</select>'
    + '<label class="f" for="in-desk">Deskripsi jualan</label><textarea class="f" id="in-desk" name="deskripsi" maxlength="160" rows="3" placeholder="Contoh: Hijab voal adem, bisa grosir untuk reseller. Kirim dari Bandung.">' + esc(d.deskripsi) + '</textarea>'
    + '<p class="f-judul">Produk (maks. 3, foto asli)</p>';
  d.produk.forEach(function (p, i) {
    var src = p.foto ? (p.foto.indexOf('data:') === 0 ? p.foto : '/foto/' + p.foto + '.jpg') : '';
    h += '<div class="produk-isi"><label class="foto-pilih" for="in-foto' + i + '">' + (src ? '<img src="' + esc(src) + '" alt="Foto produk ' + (i + 1) + '">' : '<span>+ Foto</span>') + '</label><input type="file" accept="image/*" id="in-foto' + i + '" data-foto="' + i + '" hidden>'
      + '<div><input class="f" data-pnama="' + i + '" maxlength="32" placeholder="Nama produk ' + (i + 1) + '" value="' + esc(p.nama) + '" aria-label="Nama produk ' + (i + 1) + '"><input class="f" data-pharga="' + i + '" maxlength="20" placeholder="Harga, mis. Rp45.000" value="' + esc(p.harga) + '" aria-label="Harga produk ' + (i + 1) + '">'
      + (p.foto ? '<button type="button" class="hapus-foto" data-hapusfoto="' + i + '">Hapus foto</button>' : '') + '</div></div>';
  });
  h += '<p class="f-judul">Cara pesan (isi minimal satu)</p>'
    + '<label class="f" for="in-wa">Nomor WhatsApp</label><input class="f" id="in-wa" name="wa" inputmode="tel" maxlength="16" value="' + esc(d.wa) + '" placeholder="0812xxxxxxx">'
    + '<label class="centang"><input type="checkbox" id="in-izinwa"' + (d.izinWA ? ' checked' : '') + '> Nomor WA saya boleh ditampilkan di halaman lapak</label>'
    + kartuRekomendasi('wa')
    + '<label class="f" for="in-link">Link toko online</label><input class="f" id="in-link" name="link" inputmode="url" maxlength="300" value="' + esc(d.link) + '" placeholder="Link Shopee, Tokopedia, TikTok Shop, Lynk, IG…">'
    + '<label class="f" for="in-legal">No. BPOM / PIRT / halal (opsional)</label><input class="f" id="in-legal" name="legal" maxlength="40" value="' + esc(d.legal) + '" placeholder="Wajib diisi untuk makanan & kosmetik bila ada">'
    + '<label class="centang"><input type="checkbox" id="in-setuju"> Saya setuju dengan syarat &amp; aturan lapak, dan semua isi lapak ini milik saya sendiri</label>'
    + '<div class="salah" id="salah-lapak" role="alert"></div><button class="tombol kuning" type="submit" id="kirim-lapak">' + (STATUS.lapakSaya && STATUS.lapakSaya.status === 'tampil' ? 'Kirim perubahan lapak' : 'Ajukan lapak') + '</button>'
    + (d.kategori === 'Fashion' ? kartuRekomendasi('fashion') : '') + '</form>';
  return h;
}
function simpanDraf() {
  var f = document.getElementById('form-lapak'); if (!f || !drafLapak) return; var d = drafLapak;
  d.usaha = f.querySelector('#in-usaha').value; d.kategori = f.querySelector('#in-kategori').value; d.deskripsi = f.querySelector('#in-desk').value;
  d.wa = f.querySelector('#in-wa').value; d.izinWA = f.querySelector('#in-izinwa').checked; d.link = f.querySelector('#in-link').value; d.legal = f.querySelector('#in-legal').value;
  d.produk.forEach(function (p, i) { p.nama = f.querySelector('[data-pnama="' + i + '"]').value; p.harga = f.querySelector('[data-pharga="' + i + '"]').value; });
}
function gambarUlangForm() { var f = document.getElementById('form-lapak'); if (!f) return; var gulir = panel.scrollTop; simpanDraf(); f.outerHTML = formLapak(); panel.scrollTop = gulir; }
function kecilkanFoto(file, cb) {
  var url = URL.createObjectURL(file), img = new Image();
  img.onload = function () {
    function coba(maks, q) { var s = Math.min(1, maks / Math.max(img.naturalWidth, img.naturalHeight)), c = document.createElement('canvas'); c.width = Math.round(img.naturalWidth * s); c.height = Math.round(img.naturalHeight * s); var x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height); return c.toDataURL('image/jpeg', q); }
    var hasil = coba(900, 0.78); if (hasil.length > 280000) hasil = coba(760, 0.66); if (hasil.length > 280000) hasil = coba(600, 0.6);
    URL.revokeObjectURL(url); cb(hasil.length > 280000 ? null : hasil);
  };
  img.onerror = function () { URL.revokeObjectURL(url); cb(null); };
  img.src = url;
}
function salinTeks(t) {
  function cadangan() { var i = document.createElement('textarea'); i.value = t; i.style.position = 'fixed'; i.style.opacity = '0'; document.body.appendChild(i); i.select(); try { document.execCommand('copy'); toast('Link disalin'); } catch (e) { toast('Tekan lama link di atas untuk menyalin'); } i.remove(); }
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { toast('Link disalin'); }, cadangan); else cadangan();
}
function bagikan(jenis) {
  var l = STATUS.lapakSaya, data = jenis === 'lapak' && l && l.slug
    ? { title:l.usaha, text:'Mampir ke lapakku "' + l.usaha + '" di Pasar Sekolah UMKM Kreova:', url:linkLapak(l.slug) }
    : { title:'Sekolah UMKM Kreova', text:'Aku belajar jualan gratis di Sekolah UMKM Kreova, sekolah virtual tanpa SPP. Daftar lewat link ini ya:', url:linkUndangan() };
  if (navigator.share) navigator.share(data).catch(function () {}); else salinTeks(data.text + ' ' + data.url);
}
function kirimLapak() {
  simpanDraf(); var d = drafLapak, salah = document.getElementById('salah-lapak'), btn = document.getElementById('kirim-lapak');
  function gagal(t) { salah.textContent = t; }
  if (d.usaha.trim().length < 3) return gagal('Nama toko minimal 3 huruf.');
  if (d.deskripsi.trim().length < 10) return gagal('Ceritakan jualanmu di deskripsi (min. 10 huruf).');
  if (!d.produk.some(function (p) { return p.nama.trim() || p.foto; })) return gagal('Tambahkan minimal 1 produk.');
  if (!d.wa.trim() && !d.link.trim()) return gagal('Isi nomor WA atau link toko online.');
  if (d.wa.trim() && !d.izinWA) return gagal('Centang izin tampil untuk nomor WA, atau kosongkan nomornya.');
  if (!document.getElementById('in-setuju').checked) return gagal('Centang persetujuan aturan lapak dulu.');
  gagal(''); btn.disabled = true; btn.textContent = 'Mengirim…';
  fetch('/api/lapak', { method:'POST', headers:{ 'content-type':'application/json' }, body:JSON.stringify({ uid:uid, ig:STATUS.ig, usaha:d.usaha, kategori:d.kategori, deskripsi:d.deskripsi, wa:d.wa, izinWA:d.izinWA && !!d.wa.trim(), link:d.link, legal:d.legal, setuju:true, produk:d.produk }) })
    .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.galat || 'Gagal mengirim'); return j; }); })
    .then(function (j) { terapkanSaya(j.saya); editLapak = false; drafLapak = null; toast('Lapakmu dikirim. Tunggu dicek Bu Naya ya!'); var g = panel.scrollTop; isi.innerHTML = PANEL.pasar(); panel.scrollTop = g; })
    .catch(function (e) { btn.disabled = false; btn.textContent = 'Coba kirim lagi'; gagal(e.message === 'Failed to fetch' ? 'Koneksi terputus. Coba lagi.' : e.message); });
}
isi.addEventListener('change', function (e) {
  var f = e.target.closest('[data-foto]'); if (f && f.files && f.files[0]) { var i = +f.dataset.foto; simpanDraf(); toast('Menyiapkan foto…'); kecilkanFoto(f.files[0], function (hasil) { if (!hasil) { toast('Foto ini tidak bisa dipakai, coba foto lain'); return; } drafLapak.produk[i].foto = hasil; gambarUlangForm(); }); return; }
  if (e.target.id === 'in-kategori') gambarUlangForm();
});
isi.addEventListener('click', function (e) {
  var t = e.target.closest('[data-salin]'); if (t) { salinTeks(t.dataset.salin); return; }
  t = e.target.closest('[data-bagikan]'); if (t) { bagikan(t.dataset.bagikan); return; }
  t = e.target.closest('[data-hapusfoto]'); if (t) { simpanDraf(); drafLapak.produk[+t.dataset.hapusfoto].foto = null; gambarUlangForm(); return; }
  t = e.target.closest('[data-aksi="editLapak"]'); if (t) { editLapak = true; drafLapak = null; var g = panel.scrollTop; isi.innerHTML = PANEL.pasar(); panel.scrollTop = g; return; }
  t = e.target.closest('[data-aksi="kartu"]'); if (t) { bukaDaftar(true); return; }
  t = e.target.closest('.link-salin'); if (t) { t.select(); }
});

/* ================= HUD ================= */
var hint = document.getElementById('hint'), hintMati = false;
function sembunyikanHint() { if (!hintMati) { hintMati = true; setTimeout(function () { hint.style.opacity = 0; }, 2500); } }
var tToast;
function toast(t) { var el = document.getElementById('toast'); el.textContent = t; el.classList.add('on'); clearTimeout(tToast); tToast = setTimeout(function () { el.classList.remove('on'); }, 2600); }
(function waktu() {
  var j = new Date().getHours(), w = j >= 5 && j < 10 ? 'rgba(255,214,150,.18)' : j >= 10 && j < 15 ? 'rgba(0,0,0,0)' : j >= 15 && j < 18 ? 'rgba(255,150,80,.22)' : 'rgba(40,52,110,.45)';
  document.getElementById('tint').style.background = w;
})();

/* ================= Kartu murid ================= */
var draf = { k:0, b:0, r:0, h:2 }, formDaftar = document.getElementById('form-daftar'), baruDaftar = false;
function isiPilihan() {
  var pr = document.getElementById('pil-rambut'), pb = document.getElementById('pil-baju'), pk = document.getElementById('pil-kulit');
  pr.innerHTML = RAMBUT.map(function (n, i) { return '<button type="button" data-r="' + i + '" aria-pressed="' + (draf.r === i) + '">' + n + '</button>'; }).join('');
  pb.innerHTML = BAJU.map(function (c, i) { return '<button type="button" class="warna" data-b="' + i + '" aria-label="Warna baju ' + (i + 1) + '" aria-pressed="' + (draf.b === i) + '" style="background:' + c + '"></button>'; }).join('')
    + (draf.r === 2 ? '<span style="width:100%;font-weight:800;font-size:13px;color:#14204F;margin-top:6px">Warna hijab</span>' + BAJU.map(function (c, i) { return '<button type="button" class="warna" data-h="' + i + '" aria-label="Warna hijab ' + (i + 1) + '" aria-pressed="' + (draf.h === i) + '" style="background:' + c + '"></button>'; }).join('') : '');
  pk.innerHTML = KULIT.map(function (c, i) { return '<button type="button" class="warna" data-k="' + i + '" aria-label="Warna kulit ' + (i + 1) + '" aria-pressed="' + (draf.k === i) + '" style="background:' + c + '"></button>'; }).join('');
  document.getElementById('km-preview').innerHTML = avatarSVG(draf).replace('class="tubuh"', '');
}
formDaftar.addEventListener('click', function (e) {
  var b = e.target.closest('button[type="button"]'); if (!b) return;
  if (b.dataset.r != null) draf.r = +b.dataset.r; if (b.dataset.b != null) draf.b = +b.dataset.b; if (b.dataset.k != null) draf.k = +b.dataset.k; if (b.dataset.h != null) draf.h = +b.dataset.h;
  isiPilihan();
});
function bukaDaftar(ubah) {
  tutupPanel();
  if (saya) { document.getElementById('in-nama').value = saya.nama; document.getElementById('in-jualan').value = saya.jualan || ''; document.getElementById('in-ig').value = saya.ig || STATUS.ig ? '@' + (saya.ig || STATUS.ig) : ''; document.getElementById('in-igsendiri').checked = !!(saya.ig || STATUS.ig); draf = { k:saya.look.k | 0, b:saya.look.b | 0, r:saya.look.r | 0, h:saya.look.h == null ? 2 : saya.look.h | 0 }; }
  document.getElementById('km-judul').textContent = ubah ? 'Ubah kartu murid' : 'Daftar jadi murid';
  isiPilihan(); document.getElementById('daftar').classList.add('on'); setTimeout(function () { document.getElementById('in-nama').focus(); }, 50);
}
formDaftar.addEventListener('submit', function (e) {
  e.preventDefault();
  var nama = document.getElementById('in-nama').value.replace(/[<>]/g, '').trim().slice(0, 16);
  var jualan = document.getElementById('in-jualan').value.replace(/[<>]/g, '').trim().slice(0, 24);
  var ig = bersihIG(document.getElementById('in-ig').value);
  if (nama.length < 2) { document.getElementById('salah').textContent = 'Isi nama panggilan minimal 2 huruf.'; return; }
  if (!ig) { document.getElementById('salah').textContent = 'Isi akun Instagram-mu, contoh: @rinahijab'; return; }
  if (!document.getElementById('in-igsendiri').checked) { document.getElementById('salah').textContent = 'Centang "Ini akun IG saya sendiri".'; return; }
  document.getElementById('salah').textContent = '';
  saya = { nama:nama, jualan:jualan, ig:ig, look:{ k:draf.k, b:draf.b, r:draf.r, h:draf.h } }; STATUS.ig = ig;
  simpanLokal('kreova_murid', saya);
  document.getElementById('daftar').classList.remove('on');
  if (aku) { aku.nama = nama; aku.jualan = jualan; aku.look = saya.look; aku.el.querySelector('.tubuh').outerHTML = avatarSVG(saya.look); tulisTag(aku); if (jaringan.ubah) jaringan.ubah(); }
  else { baruDaftar = true; masukSekolah(); }
});

/* ================= Mulai ================= */
function masukSekolah() {
  aku = buatMurid('saya', { nama:saya.nama, jualan:saya.jualan, look:saya.look, x:430, y:2860 }, true);
  mulaiJaringan();
  terbang(470, 2420, skalaAwal(), 1600, function () { jalanKe(TITIK.naya[0], TITIK.naya[1], sapaNaya); });
}
(function mulai() {
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', mulai); return; }
  lihat(470, 2300, skalaAwal());
  requestAnimationFrame(loop);
  setTimeout(function () {
    var l = document.getElementById('loading'); if (l) { l.style.opacity = 0; setTimeout(function () { if (l.parentNode) l.parentNode.removeChild(l); }, 600); }
    if (saya && saya.nama && saya.look) masukSekolah(); else bukaDaftar(false);
  }, 500);
})();
render();
window.__sekolah = { STATUS:STATUS, murid:murid, aksiTitik:aksiTitik, tampilPanel:tampilPanel, get aku() { return aku; }, jalanKe:jalanKe };
