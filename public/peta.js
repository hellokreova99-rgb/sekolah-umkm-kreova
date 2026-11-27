/* Peta Sekolah UMKM Kreova — digambar oleh kode (ringan, ~8 KB) */
function buatPeta() {
  var W = 1080, H = 2880, o = [];
  var seed = 7; function rnd() { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
  function ri(a, b) { return a + Math.floor(rnd() * (b - a + 1)); }
  function pilih(a) { return a[Math.floor(rnd() * a.length)]; }
  function catmull(p, n) {
    var r = [], q = [p[0]].concat(p, [p[p.length - 1]]);
    for (var i = 1; i < q.length - 2; i++) for (var k = 0; k < n; k++) {
      var t = k / n, t2 = t * t, t3 = t2 * t, a = q[i - 1], b = q[i], c = q[i + 1], d = q[i + 2];
      r.push([0.5 * (2 * b[0] + (-a[0] + c[0]) * t + (2 * a[0] - 5 * b[0] + 4 * c[0] - d[0]) * t2 + (-a[0] + 3 * b[0] - 3 * c[0] + d[0]) * t3),
              0.5 * (2 * b[1] + (-a[1] + c[1]) * t + (2 * a[1] - 5 * b[1] + 4 * c[1] - d[1]) * t2 + (-a[1] + 3 * b[1] - 3 * c[1] + d[1]) * t3)]);
    }
    r.push(p[p.length - 1]); return r;
  }
  function d(p) { return 'M' + p.map(function (v) { return Math.round(v[0]) + ' ' + Math.round(v[1]); }).join('L'); }
  // langit & cakrawala
  o.push('<rect width="1080" height="2880" fill="#78C25A"/>');
  [[0, 180, '#BFE0EF'], [180, 330, '#D3E9EE'], [330, 470, '#E9EEDD'], [470, 640, '#F6EBCB']].forEach(function (b) { o.push('<rect y="' + b[0] + '" width="1080" height="' + (b[1] - b[0]) + '" fill="' + b[2] + '"/>'); });
  o.push('<circle cx="808" cy="300" r="78" fill="#F5C518" opacity=".9"/>');
  [[180, 150, 1], [560, 95, .8], [930, 170, .9], [380, 260, .6]].forEach(function (c) { o.push('<g transform="translate(' + c[0] + ' ' + c[1] + ') scale(' + c[2] + ')" fill="#fff"><ellipse rx="70" ry="24"/><ellipse cx="-34" cy="-14" rx="34" ry="24"/><ellipse cx="22" cy="-22" rx="40" ry="30"/></g>'); });
  [[300, 210], [330, 230], [690, 190]].forEach(function (b) { o.push('<path d="M' + (b[0] - 10) + ' ' + b[1] + 'q5 -7 10 0q5 -7 10 0" stroke="#4A5677" stroke-width="2.5" fill="none" stroke-linecap="round"/>'); });
  o.push('<path d="M-40 640L150 430L260 520L420 360L560 500L640 450L760 560L900 410L1120 640Z" fill="#8A9BCB"/><path d="M420 360L470 412L440 420L410 405L385 398Z" fill="#DCE3F3"/><path d="M900 410L945 455L915 460L885 448L865 445Z" fill="#DCE3F3"/>');
  o.push('<path d="M-40 660L120 540L240 600L380 520L520 610L700 540L860 610L1000 560L1120 640L1120 700L-40 700Z" fill="#6C7FB8"/>');
  o.push('<rect y="640" width="1080" height="300" fill="#8FD16A"/>');
  for (var i = 0, y = 650; y < 940; y += 26, i++) o.push('<rect y="' + y + '" width="1080" height="12" fill="' + (i % 2 ? '#83C760' : '#9BD876') + '"/>');
  for (var x = -20; x < W + 40; x += 34) o.push('<circle cx="' + x + '" cy="' + (652 + ri(-6, 6)) + '" r="' + ri(16, 24) + '" fill="#4E9A49"/>');
  o.push('<rect y="940" width="1080" height="1940" fill="#78C25A"/>');
  for (i = 0; i < 90; i++) o.push('<ellipse cx="' + ri(0, W) + '" cy="' + ri(960, H) + '" rx="' + ri(40, 120) + '" ry="' + ri(14, 34) + '" fill="' + pilih(['#6EB651', '#84CB63']) + '" opacity=".7"/>');
  // sungai di tepi kanan (lahan sekolah jadi lega)
  var tengah = catmull([[700, 650], [780, 820], [880, 1000], [960, 1250], [990, 1600], [996, 2000], [986, 2400], [1000, 2900]], 30);
  function lebar(y) { return 26 + Math.max(0, y - 650) / 2250 * 110; }
  var kiri = [], kanan = [];
  tengah.forEach(function (p, i) {
    var a = tengah[Math.max(i - 1, 0)], b = tengah[Math.min(i + 1, tengah.length - 1)], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L, w = lebar(p[1]) / 2;
    kiri.push([p[0] + nx * w, p[1] + ny * w]); kanan.push([p[0] - nx * w, p[1] - ny * w]);
  });
  var poly = d(kiri.concat(kanan.slice().reverse())) + 'Z';
  o.push('<path d="' + poly + '" fill="#5E9C4A" stroke="#5E9C4A" stroke-width="22" stroke-linejoin="round"/><path d="' + poly + '" fill="#5BB4D6"/>');
  for (i = 10; i < tengah.length - 10; i += 9) { var p = tengah[i], w = lebar(p[1]); [-0.22, 0.18].forEach(function (f) { o.push('<path d="M' + Math.round(p[0] + f * w) + ' ' + Math.round(p[1]) + 'l' + ri(-6, 6) + ' ' + Math.round(18 + w * .12) + '" stroke="#9AD6EC" stroke-width="' + (3 + w * .02).toFixed(1) + '" stroke-linecap="round"/>'); }); }
  function sungaiX(yq) { var best = tengah[0]; tengah.forEach(function (p) { if (Math.abs(p[1] - yq) < Math.abs(best[1] - yq)) best = p; }); return best[0]; }
  // jalan tanah: gerbang -> halaman depan, lapangan -> Pasar Murid
  function tanah(pts, w) { var s = d(catmull(pts, 20)); o.push('<path d="' + s + '" stroke="#B5854F" stroke-width="' + (w + 10) + '" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="' + s + '" stroke="#D2A46D" stroke-width="' + w + '" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'); }
  tanah([[430, 2900], [430, 2620], [430, 2400], [430, 2300]], 96);
  tanah([[400, 1600], [360, 1470], [300, 1380], [250, 1350]], 56);
  // alas Pasar Murid
  o.push('<rect x="26" y="1186" width="232" height="340" rx="26" fill="#C9A06B"/><rect x="30" y="1180" width="224" height="340" rx="24" fill="#D8B47F"/>');
  // lapangan sekolah (persegi lebar)
  var LX = 60, LY = 1590, LW = 840, LH = 720;
  o.push('<rect x="' + LX + '" y="' + (LY + 14) + '" width="' + LW + '" height="' + LH + '" rx="64" fill="#B5854F"/><rect x="' + LX + '" y="' + LY + '" width="' + LW + '" height="' + LH + '" rx="64" fill="#D8AE79"/>');
  o.push('<rect x="' + (LX + 22) + '" y="' + (LY + 22) + '" width="' + (LW - 44) + '" height="' + (LH - 44) + '" rx="46" fill="none" stroke="#E6C495" stroke-width="5" stroke-dasharray="2 16" stroke-linecap="round"/>');
  for (i = 0; i < 70; i++) o.push('<ellipse cx="' + ri(LX + 40, LX + LW - 40) + '" cy="' + ri(LY + 40, LY + LH - 40) + '" rx="' + ri(4, 9) + '" ry="3" fill="#C49663"/>');
  // kavling kelas: 2 baris x 3, jarak lega
  var n = 1;
  [1770, 1960].forEach(function (cy0) { [205, 370, 535].forEach(function (cx0) {
    var px = cx0 - 63, py = cy0 - 60, cx = cx0, cy = cy0;
    o.push('<rect x="' + px + '" y="' + py + '" width="126" height="120" rx="10" fill="#CFA26C" stroke="#FFF6E2" stroke-width="4" stroke-dasharray="14 10"/><rect x="' + (cx - 3) + '" y="' + (cy - 4) + '" width="6" height="46" fill="#8A5A34"/><rect x="' + (cx - 30) + '" y="' + (cy - 36) + '" width="60" height="38" rx="6" fill="#14204F"/><text x="' + cx + '" y="' + (cy - 10) + '" text-anchor="middle" font-family="Plus Jakarta Sans,sans-serif" font-weight="800" font-size="20" fill="#F5C518">0' + (n++) + '</text>');
  }); });
  // koperasi (warung bergaris navy-kuning)
  (function () { var g = '<g transform="translate(610 2530) scale(1.2)"><ellipse cy="66" rx="70" ry="12" opacity=".12"/><rect x="-58" y="10" width="116" height="56" fill="#F4E6CC"/><rect x="-44" y="26" width="88" height="22" fill="#fff" stroke="#6A4A2E" stroke-width="3"/><rect x="-58" y="48" width="116" height="18" fill="#A86E3E"/>';
    for (var j = 0; j < 8; j++) g += '<rect x="' + (-64 + j * 16) + '" y="-8" width="16" height="24" fill="' + (j % 2 ? '#F5C518' : '#14204F') + '"/>';
    o.push(g + '</g>'); })();
  // pohon & pisang (hanya pemandangan, tidak menutupi tempat penting)
  function terhalang(x, y) {
    if (x > LX - 50 && x < LX + LW + 40 && y > LY - 60 && y < LY + LH + 60) return true;   // lapangan
    if (x > 90 && x < 800 && y > LY + LH && y < H) return true;                             // halaman depan
    if (Math.abs(x - sungaiX(y)) < lebar(y) / 2 + 50) return true;                          // sungai
    if (x < 300 && y > 1110 && y < 1580) return true;                                       // Pasar Murid
    if (x > 200 && x < 460 && y > 1320 && y < 1600) return true;                            // jalan ke pasar
    return false;
  }
  var pos = [], coba = 0;
  while (pos.length < 46 && coba++ < 6000) {
    var tx = ri(20, W - 20), ty = ri(980, H - 40);
    if (terhalang(tx, ty)) continue;
    if (pos.some(function (q) { return Math.pow(tx - q[0], 2) + Math.pow(ty - q[1], 2) < 9025; })) continue;
    pos.push([tx, ty]);
  }
  pos.sort(function (a, b) { return a[1] - b[1]; });
  pos.forEach(function (q, i) {
    var s = .7 + (q[1] - 980) / (H - 980) * .7, x = q[0], y = q[1];
    if (i % 3 === 0) {
      var daun = [[-2.6, '#4E9E48'], [-.5, '#4E9E48'], [-2, '#66B85A'], [-1.1, '#66B85A'], [-1.57, '#3F8C45']].map(function (L) { var c = Math.cos(L[0]), sn = Math.sin(L[0]); return '<path d="M0 0Q' + Math.round(30 * c) + ' ' + Math.round(-40 + 30 * sn) + ' ' + Math.round(70 * c) + ' ' + Math.round(-30 + 50 * sn) + 'Q' + Math.round(40 * c) + ' ' + Math.round(-20 + 20 * sn) + ' 0 0Z" fill="' + L[1] + '"/>'; }).join('');
      o.push('<g transform="translate(' + x + ' ' + y + ') scale(' + s.toFixed(2) + ')"><rect x="-5" width="10" height="40" fill="#6E8F3A"/>' + daun + '</g>');
    } else {
      var r = Math.round(26 * s + ri(0, 6));
      o.push('<ellipse cx="' + x + '" cy="' + Math.round(y + r * .95) + '" rx="' + Math.round(r * .8) + '" ry="' + Math.round(r * .22) + '" opacity=".13"/><rect x="' + Math.round(x - r * .12) + '" y="' + y + '" width="' + Math.round(r * .24) + '" height="' + Math.round(r * .9) + '" fill="#7A5232"/><circle cx="' + x + '" cy="' + Math.round(y - r * .2) + '" r="' + r + '" fill="#3F8C45"/><circle cx="' + Math.round(x - r * .3) + '" cy="' + Math.round(y - r * .45) + '" r="' + Math.round(r * .6) + '" fill="#57A851"/>');
    }
  });
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 2880" width="1080" height="2880" aria-hidden="true">' + o.join('') + '</svg>';
}
