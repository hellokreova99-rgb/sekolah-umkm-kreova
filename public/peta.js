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
  // sungai (belum ada jembatan)
  var tengah = catmull([[600, 650], [660, 820], [720, 1000], [600, 1260], [640, 1500], [820, 1760], [880, 2050], [760, 2400], [820, 2700], [880, 2900]], 30);
  function lebar(y) { return 26 + Math.max(0, y - 650) / 2250 * 190; }
  var kiri = [], kanan = [];
  tengah.forEach(function (p, i) {
    var a = tengah[Math.max(i - 1, 0)], b = tengah[Math.min(i + 1, tengah.length - 1)], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L, w = lebar(p[1]) / 2;
    kiri.push([p[0] + nx * w, p[1] + ny * w]); kanan.push([p[0] - nx * w, p[1] - ny * w]);
  });
  var poly = d(kiri.concat(kanan.slice().reverse())) + 'Z';
  o.push('<path d="' + poly + '" fill="#5E9C4A" stroke="#5E9C4A" stroke-width="22" stroke-linejoin="round"/><path d="' + poly + '" fill="#5BB4D6"/>');
  for (i = 10; i < tengah.length - 10; i += 9) { var p = tengah[i], w = lebar(p[1]); [-0.22, 0.18].forEach(function (f) { o.push('<path d="M' + Math.round(p[0] + f * w) + ' ' + Math.round(p[1]) + 'l' + ri(-6, 6) + ' ' + Math.round(18 + w * .12) + '" stroke="#9AD6EC" stroke-width="' + (3 + w * .02).toFixed(1) + '" stroke-linecap="round"/>'); }); }
  function sungaiX(yq) { var best = tengah[0]; tengah.forEach(function (p) { if (Math.abs(p[1] - yq) < Math.abs(best[1] - yq)) best = p; }); return best[0]; }
  var sx = sungaiX(1500), sw = lebar(1500);
  for (i = 0; i < 6; i++) { var bx = Math.round(sx - sw / 2 + (i + .5) / 6 * sw), by = 1500 + (i % 2) * 8; o.push('<ellipse cx="' + bx + '" cy="' + (by + 4) + '" rx="15" ry="8" fill="#7E8794"/><ellipse cx="' + bx + '" cy="' + by + '" rx="15" ry="8" fill="#A7B0BC"/>'); }
  // jalan tanah
  function tanah(pts, w) { var s = d(catmull(pts, 20)); o.push('<path d="' + s + '" stroke="#B5854F" stroke-width="' + (w + 10) + '" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="' + s + '" stroke="#D2A46D" stroke-width="' + w + '" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'); }
  tanah([[150, 2900], [240, 2640], [330, 2420], [340, 2250]], 74);
  tanah([[330, 1660], [360, 1560], [440, 1500], [560, 1500]], 46);
  tanah([[760, 1500], [880, 1440], [960, 1300], [1100, 1240]], 46);
  tanah([[330, 1660], [260, 1400], [300, 1200], [430, 1060], [560, 960]], 50);
  tanah([[240, 2640], [60, 2560], [-40, 2520]], 44);
  tanah([[430, 1060], [250, 1000], [-40, 980]], 38);
  // alas Pasar Murid
  o.push('<rect x="26" y="1186" width="232" height="340" rx="26" fill="#C9A06B"/><rect x="30" y="1180" width="224" height="340" rx="24" fill="#D8B47F"/>');
  // lahan sekolah
  var FX = 330, FY = 1960;
  o.push('<ellipse cx="' + FX + '" cy="' + (FY + 14) + '" rx="318" ry="300" fill="#B5854F"/><ellipse cx="' + FX + '" cy="' + FY + '" rx="312" ry="294" fill="#D8AE79"/>');
  for (i = 0; i < 60; i++) { var a = rnd() * 6.283, r = Math.sqrt(rnd()); o.push('<ellipse cx="' + Math.round(FX + Math.cos(a) * r * 280) + '" cy="' + Math.round(FY + Math.sin(a) * r * 260) + '" rx="' + ri(4, 9) + '" ry="3" fill="#C49663"/>'); }
  var n = 1;
  [1800, 1990].forEach(function (py) { [140, 285, 430].forEach(function (px) {
    var cx = px + 62, cy = py + 58;
    o.push('<rect x="' + px + '" y="' + py + '" width="125" height="120" rx="10" fill="#CFA26C" stroke="#FFF6E2" stroke-width="4" stroke-dasharray="14 10"/><rect x="' + (cx - 3) + '" y="' + (cy - 6) + '" width="6" height="46" fill="#8A5A34"/><rect x="' + (cx - 30) + '" y="' + (cy - 38) + '" width="60" height="38" rx="6" fill="#14204F"/><text x="' + cx + '" y="' + (cy - 12) + '" text-anchor="middle" font-family="Plus Jakarta Sans,sans-serif" font-weight="800" font-size="20" fill="#F5C518">0' + (n++) + '</text>');
  }); });
  o.push('<ellipse cx="330" cy="1748" rx="26" ry="8" fill="#B5854F"/><rect x="326" y="1600" width="8" height="150" rx="3" fill="#E9ECF2"/><circle cx="330" cy="1598" r="7" fill="#F5C518"/><rect x="334" y="1606" width="64" height="22" fill="#D83A34"/><rect x="334" y="1628" width="64" height="22" fill="#fff"/>');
  o.push('<g transform="translate(470 1650)"><rect x="-4" y="40" width="8" height="60" fill="#8A5A34"/><rect x="76" y="40" width="8" height="60" fill="#8A5A34"/><rect x="-12" y="-10" width="104" height="66" rx="5" fill="#C9A77A"/><rect x="-6" y="-4" width="92" height="54" rx="3" fill="#14204F"/><path d="M6 12H46M6 26H70" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".6"/><rect x="58" y="38" width="18" height="5" rx="2" fill="#F5C518"/></g>');
  o.push('<g transform="translate(470 1770)"><rect width="90" height="14" rx="4" fill="#A86E3E"/><rect x="8" y="14" width="7" height="18" fill="#8A5A34"/><rect x="75" y="14" width="7" height="18" fill="#8A5A34"/></g>');
  o.push('<g transform="translate(150 1700)"><rect x="-3" width="6" height="70" fill="#8A5A34"/><rect x="-22" y="-4" width="44" height="7" rx="3" fill="#8A5A34"/><path d="M0 4C-12 4-14 14-14 24L-17 34H17L14 24C14 14 12 4 0 4Z" fill="#F5C518"/><circle cy="38" r="4" fill="#14204F"/></g>');
  o.push('<g transform="translate(340 2290)"><rect x="-180" y="-10" width="16" height="120" rx="4" fill="#0C1538"/><rect x="164" y="-10" width="16" height="120" rx="4" fill="#0C1538"/><rect x="-200" y="-80" width="400" height="86" rx="12" fill="#14204F"/><rect x="-200" y="-4" width="400" height="10" rx="4" fill="#F5C518"/><circle cx="-158" cy="-37" r="24" fill="#F5C518"/><text x="-158" y="-28" text-anchor="middle" font-family="Plus Jakarta Sans,sans-serif" font-weight="800" font-size="26" fill="#14204F">K</text><text x="-122" y="-46" font-family="Plus Jakarta Sans,sans-serif" font-weight="800" font-size="27" fill="#fff">SEKOLAH UMKM</text><text x="-122" y="-16" font-family="Plus Jakarta Sans,sans-serif" font-weight="800" font-size="27" fill="#F5C518">KREOVA</text></g>');
  // rumah & warung warga
  var RUMAH = [[150, 1080, .8, 'h'], [520, 1150, .85, 'w'], [820, 1130, .8, 'h'], [950, 1020, .7, 'h'], [330, 930, .6, 'h'], [720, 920, .6, 'w'], [960, 1620, 1, 'h'], [1010, 2150, 1.05, 'w'], [960, 2480, 1.1, 'h'], [80, 2380, 1.1, 'h'], [520, 2620, 1.15, 'w']];
  RUMAH.forEach(function (h) {
    var g = '<g transform="translate(' + h[0] + ' ' + h[1] + ') scale(' + h[2] + ')">';
    if (h[3] === 'h') g += '<ellipse cy="62" rx="72" ry="12" opacity=".12"/><rect x="-56" width="112" height="62" fill="#F4E6CC"/><path d="M-70 4L0-46L70 4Z" fill="#C8553D"/><path d="M-70 4H70L64 12H-64Z" fill="#9E3F2E"/><rect x="-12" y="24" width="24" height="38" fill="#14204F"/><rect x="-46" y="22" width="24" height="22" fill="#fff" stroke="#6A4A2E" stroke-width="3"/><rect x="22" y="22" width="24" height="22" fill="#fff" stroke="#6A4A2E" stroke-width="3"/>';
    else { g += '<ellipse cy="66" rx="70" ry="12" opacity=".12"/><rect x="-58" y="10" width="116" height="56" fill="#F4E6CC"/><rect x="-44" y="26" width="88" height="22" fill="#fff" stroke="#6A4A2E" stroke-width="3"/><rect x="-58" y="48" width="116" height="18" fill="#A86E3E"/>';
      for (var j = 0; j < 8; j++) g += '<rect x="' + (-64 + j * 16) + '" y="-8" width="16" height="24" fill="' + (j % 2 ? '#F5C518' : '#14204F') + '"/>'; }
    o.push(g + '</g>');
  });
  // pohon & pisang
  function terhalang(x, y) {
    if (Math.pow(x - FX, 2) / 115600 + Math.pow(y - FY, 2) / 108900 < 1) return true;
    if (Math.abs(x - sungaiX(y)) < lebar(y) / 2 + 60) return true;
    if (y > 2200 && y < 2420 && x > 100 && x < 640) return true;
    if (y > 1580 && y < 1820 && x > 420 && x < 640) return true;
    if (y > 1180 && y < 1540 && x < 270) return true;
    if (y > 1800 && y < 1990 && x > 600 && x < 790) return true;
    for (var k = 0; k < RUMAH.length; k++) { var h = RUMAH[k]; if (Math.abs(x - h[0]) < 95 * h[2] && y - h[1] > -70 * h[2] && y - h[1] < 110 * h[2]) return true; }
    return false;
  }
  var pos = [], coba = 0;
  while (pos.length < 46 && coba++ < 4000) {
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
