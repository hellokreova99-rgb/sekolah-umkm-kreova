# Sekolah UMKM Kreova · Sekolah Virtual

Sekolah virtual 2D yang ringan di HP: murid berjalan di peta sekolah, saling sapa, absen setiap hari, memilih pelajaran di Kotak Usulan, menulis nama di Dinding Angkatan Pertama, dan membuka lapak di Pasar Murid. Berjalan gratis di Cloudflare Workers (paket Free).

## Isi folder

- `public/index.html`, `game.js`, `peta.js`, `style.css`, `*.svg` — game (peta, Bu Naya, lambang sekolah, avatar, panel).
- `public/admin.html` — halaman admin di `/admin` untuk menyetujui lapak Pasar Murid.
- `src/worker.js` — server: posisi & obrolan, absen, voting, dinding, pasar, admin.
- `wrangler.toml` — pengaturan Cloudflare. **Jangan ubah `name`.**

## Cara memasang (cukup browser)

1. Repository GitHub `sekolah-umkm-kreova` sudah berisi file ini.
2. Buka dash.cloudflare.com → **Workers & Pages → Create application → Import a repository**.
3. Hubungkan GitHub, pilih `sekolah-umkm-kreova`, nama proyek `sekolah-umkm-kreova`, perintah deploy bawaan (`npx wrangler deploy`), lalu **Save and Deploy**.
4. Setelah jadi, buka Worker → **Settings → Variables and Secrets → Add**: Type **Secret**, Name **`ADMIN_KEY`**, Value = kata sandi panjang buatanmu. Simpan, lalu **Deploy** ulang bila diminta.
5. Situs: `https://sekolah-umkm-kreova.<namamu>.workers.dev` · Admin: `…/admin` (masukkan ADMIN_KEY).

## Mengubah isi sekolah

Di `public/game.js`, bagian **PENGATURAN SEKOLAH** (paling atas):

- `link.tiktok`, `link.grupFB`, `link.episodeTerbaru` — isi link.
- `pengumuman` — isi papan pengumuman.
- `kelas[...].status` — ubah `'segera'` jadi `'buka'` dan isi `episode`, `pr`.
- `targetMurid` — target di chip atas (angka murid dihitung otomatis).
- `koperasi.buka` dan `kasKelas.buka` — masih `false` (terkunci).

## Fitur & aturan keamanan

- Obrolan hanya frasa siap pakai. Nama, jualan, dan nama usaha disaring dari kata kasar; link dan nomor HP otomatis dihapus.
- Lapak baru tampil setelah disetujui di `/admin`. Pasar menampilkan 12 lapak terbaru.
- Dinding Angkatan Pertama: 1.000 murid pertama, bisa dicari namanya.
- Voting: satu perangkat satu suara per minggu (Senin–Minggu WIB), boleh ganti pilihan.
- Absen: sekali sehari (WIB), menghitung hari beruntun.
- Murid dihitung sekali per perangkat. Data tersimpan di Durable Object (SQLite) milik Cloudflare-mu.

## Batas paket gratis

Durable Objects SQLite tersedia di paket Free dengan batas harian (reset 00:00 UTC). Bila terlampaui, game menampilkan "Terputus" sampai kuota pulih; tidak ada tagihan.
