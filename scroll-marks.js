/* Scroll-driven marks, one per section:
   - Vaaree:       a running-stitch thread sews down the left edge; embroidered florets bloom along it
   - Shoppingate: an order tracker ticks through a super-app journey on the right edge
   - HolidayIQ:    passport stamps land one by one down the left edge
   - Skydive:      the jump profile (exit → freefall → canopy → landing) draws itself, with a live altitude tag
*/
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const clamp01 = v => Math.max(0, Math.min(1, v));
  function progress(el, a, b) {
    // 0 when the section's top hits the bottom of the viewport, 1 when its bottom leaves the top;
    // then remapped so the mark plays out between a and b.
    const r = el.getBoundingClientRect();
    const p = (window.innerHeight - r.top) / (r.height + window.innerHeight);
    return clamp01((p - a) / (b - a));
  }
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const updaters = [];
  const layouts = [];

  /* ---------------- VAAREE: running stitch + florets ---------------- */
  (function () {
    const job = document.getElementById('job-vaaree');
    const host = job && job.querySelector('.stitch-trail');
    if (!host) return;
    const COLORS = ['#c9663f', '#c8963a', '#5c4a3a'];
    const X0 = 30, AMP = 10, WAVE = 52;
    const xAt = y => X0 + AMP * Math.sin(y / WAVE);
    let h = 0, florets = [], reveal, needle;

    function floretSVG(color, center) {
      let petals = '';
      for (let k = 0; k < 6; k++) {
        // lazy-daisy petal: a looped outline
        petals += `<path transform="rotate(${k * 60} 20 20)" d="M20 18.5 C16.6 13 16.8 6.6 20 4.6 C23.2 6.6 23.4 13 20 18.5 Z"/>`;
      }
      return `<svg viewBox="0 0 40 40"><g fill="none" stroke="${color}" stroke-width="1.5" stroke-linejoin="round">${petals}</g>` +
        `<circle cx="20" cy="20" r="3.2" fill="${center}"/><circle cx="19" cy="19" r="1" fill="rgba(255,255,255,0.45)"/></svg>`;
    }

    function layout() {
      h = job.offsetHeight;
      host.innerHTML = '';
      // thread path (full height), revealed by a growing clip box
      let d = `M ${xAt(0).toFixed(1)} 0`;
      for (let y = 6; y <= h; y += 6) d += ` L ${xAt(y).toFixed(1)} ${y}`;
      reveal = document.createElement('div');
      reveal.className = 'stitch-reveal';
      reveal.innerHTML =
        `<svg width="64" height="${h}" viewBox="0 0 64 ${h}">` +
        `<path d="${d}" fill="none" stroke="rgba(92,74,58,0.10)" stroke-width="5" stroke-linecap="round"/>` + // pressed-fabric shadow
        `<path d="${d}" fill="none" stroke="#c9663f" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="10 8"/>` +
        `</svg>`;
      host.appendChild(reveal);

      florets = [];
      const step = 150;
      for (let y = 120, i = 0; y < h - 60; y += step, i++) {
        const f = document.createElement('span');
        f.className = 'floret';
        const c = COLORS[i % COLORS.length];
        const center = COLORS[(i + 1) % COLORS.length];
        // sit florets just off the thread, alternating sides
        const side = i % 2 === 0 ? 1 : -1;
        f.style.left = (xAt(y) + side * 14 - 13) + 'px';
        f.style.top = (y - 13) + 'px';
        f.style.setProperty('--r', (i * 37 % 60) + 'deg');
        f.innerHTML = floretSVG(c, center);
        f.dataset.y = y;
        host.appendChild(f);
        florets.push(f);
      }

      needle = document.createElement('span');
      needle.className = 'needle';
      needle.innerHTML =
        '<svg viewBox="0 0 12 48"><defs><linearGradient id="needle-steel" x1="0" x2="1">' +
        '<stop offset="0" stop-color="#8d8a85"/><stop offset="0.5" stop-color="#f1efea"/><stop offset="1" stop-color="#8d8a85"/></linearGradient></defs>' +
        '<path d="M6 47 L4.4 12 Q4.2 3 6 1.5 Q7.8 3 7.6 12 Z" fill="url(#needle-steel)" stroke="#6f6a63" stroke-width="0.4"/>' +
        '<ellipse cx="6" cy="7" rx="0.9" ry="2.6" fill="#efe3cf"/></svg>';
      host.appendChild(needle);
    }

    function update() {
      if (!reveal) return;
      const t = progress(job, 0.12, 0.82);
      const tip = Math.max(0, t * (h - 40));
      reveal.style.height = tip + 'px';
      florets.forEach(f => f.classList.toggle('on', +f.dataset.y < tip - 8));
      // needle rides the tip, tilted along the thread
      const slope = (AMP / WAVE) * Math.cos(tip / WAVE);
      const ang = -Math.atan(slope) * 180 / Math.PI;
      needle.style.transform = `translate(${xAt(tip) - 6}px, ${tip - 40}px) rotate(${ang}deg)`;
      needle.style.opacity = t > 0.01 && t < 0.995 ? 1 : 0;
    }
    layouts.push(layout); updaters.push(update);
  })();

  /* ---------------- SHOPPINGATE: order tracker ---------------- */
  (function () {
    const job = document.getElementById('job-shoppingate');
    const host = job && job.querySelector('.sg-tracker');
    if (!host) return;
    const steps = [
      ['Searched', 'RUH → JED · Fri'],
      ['Flight booked', 'Economy · 1 adult'],
      ['Hotel added', '2 nights · Corniche'],
      ['Cashback applied', 'bank offer · −15%'],
      ['Dinner ordered', 'Mandi for two'],
      ['Out for delivery', 'rider 1.2 km away'],
      ['Delivered', 'enjoy your trip'],
    ];
    host.innerHTML =
      '<div class="sgt-head mono"><span class="sgt-live"></span>order #SG-2611 · live</div>' +
      '<div class="sgt-rail"><div class="sgt-fill"></div>' +
      steps.map(([t, s], i) =>
        `<div class="sgt-step" style="top:${(i / (steps.length - 1)) * 100}%">` +
        `<span class="sgt-dot"><svg viewBox="0 0 12 12"><path d="M3 6.2 L5.2 8.4 L9.2 3.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>` +
        `<span class="sgt-label"><span class="sgt-t">${t}</span><span class="sgt-s mono">${s}</span></span></div>`
      ).join('') +
      '</div>';
    const fill = host.querySelector('.sgt-fill');
    const els = Array.from(host.querySelectorAll('.sgt-step'));
    function update() {
      const t = progress(job, 0.18, 0.8);
      fill.style.height = (t * 100) + '%';
      const reached = t * (steps.length - 1);
      els.forEach((el, i) => {
        el.classList.toggle('done', i <= reached + 0.001 && t > 0);
        el.classList.toggle('current', i === Math.floor(reached + 0.001) && t > 0 && t < 1);
      });
      host.classList.toggle('complete', t >= 1);
    }
    updaters.push(update);
  })();

  /* ---------------- HOLIDAYIQ: passport stamps ---------------- */
  (function () {
    const job = document.getElementById('job-holidayiq');
    const host = job && job.querySelector('.stamp-trail');
    if (!host) return;
    const CREAM = '#f5ead0', GOLD = '#f4b83a';
    const stamps = [
      { shape: 'circle', city: 'GOA', top: 'ARRIVED', bot: '12 DEC 2017', c: GOLD, r: -12 },
      { shape: 'rect', city: 'MANALI', top: 'IMMIGRATION', bot: 'MAR 2018', c: CREAM, r: 8 },
      { shape: 'oval', city: 'KERALA', top: 'BACKWATERS', bot: 'AUG 2018', c: GOLD, r: -6 },
      { shape: 'hex', city: 'LADAKH', top: '11,562 FT', bot: 'JUN 2018', c: CREAM, r: 14 },
      { shape: 'circle', city: 'COORG', top: 'ENTRY', bot: 'NOV 2018', c: CREAM, r: 4 },
      { shape: 'rect', city: 'ANDAMAN', top: 'PORT BLAIR', bot: 'FEB 2019', c: GOLD, r: -10 },
      { shape: 'oval', city: 'HAMPI', top: 'DEPARTED', bot: 'OCT 2019', c: CREAM, r: 10 },
    ];
    function stampSVG(s) {
      const t = (x, y, size, txt, w) =>
        `<text x="${x}" y="${y}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="${size}" font-weight="${w || 700}" letter-spacing="0.6" fill="${s.c}">${txt}</text>`;
      let frame = '';
      if (s.shape === 'circle') {
        frame = `<circle cx="50" cy="50" r="44" fill="none" stroke="${s.c}" stroke-width="3"/>` +
          `<circle cx="50" cy="50" r="37" fill="none" stroke="${s.c}" stroke-width="1"/>` +
          `<path d="M18 50 L30 50 M70 50 L82 50" stroke="${s.c}" stroke-width="1"/>`;
        return frame + t(50, 36, 8, s.top) + t(50, 56, 15, s.city) + t(50, 72, 7.5, s.bot, 500);
      }
      if (s.shape === 'rect') {
        frame = `<rect x="6" y="20" width="88" height="60" rx="4" fill="none" stroke="${s.c}" stroke-width="3"/>` +
          `<rect x="11" y="25" width="78" height="50" rx="2" fill="none" stroke="${s.c}" stroke-width="1" stroke-dasharray="3 2"/>`;
        return frame + t(50, 38, 7.5, s.top) + t(50, 56, 14, s.city) + t(50, 69, 7.5, s.bot, 500);
      }
      if (s.shape === 'oval') {
        frame = `<ellipse cx="50" cy="50" rx="46" ry="32" fill="none" stroke="${s.c}" stroke-width="3"/>` +
          `<ellipse cx="50" cy="50" rx="40" ry="26" fill="none" stroke="${s.c}" stroke-width="1"/>`;
        return frame + t(50, 40, 7.5, s.top) + t(50, 56, 14, s.city) + t(50, 68, 7, s.bot, 500);
      }
      // hex
      frame = `<path d="M50 6 L88 28 L88 72 L50 94 L12 72 L12 28 Z" fill="none" stroke="${s.c}" stroke-width="3"/>` +
        `<path d="M50 13 L82 32 L82 68 L50 87 L18 68 L18 32 Z" fill="none" stroke="${s.c}" stroke-width="1"/>`;
      return frame + t(50, 38, 7.5, s.top) + t(50, 56, 14, s.city) + t(50, 70, 7, s.bot, 500);
    }
    let els = [];
    function layout() {
      const h = job.offsetHeight;
      host.innerHTML = '';
      const gap = (h - 220) / (stamps.length - 1);
      els = stamps.map((s, i) => {
        const el = document.createElement('span');
        el.className = 'stamp';
        el.style.top = (90 + i * gap) + 'px';
        el.style.left = (i % 2 === 0 ? 4 : 16) + 'px';
        el.style.setProperty('--r', s.r + 'deg');
        el.innerHTML = `<svg viewBox="0 0 100 100"><g filter="url(#ink-rough)">${stampSVG(s)}</g></svg>`;
        host.appendChild(el);
        return el;
      });
    }
    function update() {
      const t = progress(job, 0.12, 0.8);
      const shown = Math.round(t * els.length);
      els.forEach((el, i) => el.classList.toggle('on', i < shown));
    }
    layouts.push(layout); updaters.push(update);
  })();

  /* ---------------- SKYDIVE: jump profile ---------------- */
  (function () {
    const hero = document.querySelector('.sky-hero');
    const host = document.getElementById('jump-profile');
    if (!hero || !host) return;
    const media = null; // the photo sits left, so the path can use the full height
    let path, ghost, marker, altEl, wps = [], fd = 0.5, total = 1, W = 230, H = 600;

    function layout() {
      // hidden on small screens: nothing to measure
      if (getComputedStyle(host).display === 'none') { path = null; host.innerHTML = ''; return; }
      const heroRect = hero.getBoundingClientRect();
      const top = 96;
      const bottomLimit = media ? (media.getBoundingClientRect().top - heroRect.top - 36) : (hero.offsetHeight - 80);
      H = Math.max(260, bottomLimit - top);
      W = window.innerWidth < 1200 ? 190 : 230;
      host.style.top = top + 'px';
      host.style.width = W + 'px';
      host.style.height = H + 'px';

      const E = [W - 18, 26];
      const D = [W * 0.52, H * 0.56];
      const L = [W * 0.46, H - 14];
      const c = H - D[1];
      const first = `M ${E[0]} ${E[1]} C ${W - 26} ${E[1] + 40} ${W * 0.6} ${E[1] + 56} ${W * 0.55} ${E[1] + 120} L ${D[0]} ${D[1]}`;
      const d = first +
        ` C ${W * 0.06} ${D[1] + c * 0.15} ${W * 0.06} ${D[1] + c * 0.45} ${W * 0.5} ${D[1] + c * 0.55}` +
        ` C ${W * 0.94} ${D[1] + c * 0.65} ${W * 0.9} ${D[1] + c * 0.86} ${L[0]} ${L[1]}`;

      host.innerHTML =
        `<svg class="jp-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none">` +
        `<path class="jp-ghost" d="${d}"/>` +
        `<path class="jp-line" d="${d}"/>` +
        `<path class="jp-measure" d="${first}"/>` +
        // landing target
        `<g class="jp-target" transform="translate(${L[0]} ${L[1]})"><ellipse rx="22" ry="5"/><ellipse rx="11" ry="2.5"/><line x1="-30" y1="0" x2="30" y2="0"/></g>` +
        `</svg>` +
        // aircraft at exit
        `<span class="jp-plane" style="left:${E[0] - 64}px;top:${E[1] - 30}px"><svg viewBox="0 0 120 40"><path d="M4 22 L18 20 L24 10 L30 10 L28 19 L78 17 Q96 16 112 20 Q118 22 112 24 Q96 28 78 27 L28 25 L30 34 L24 34 L18 24 L4 22 Z M60 18 L70 4 L76 4 L72 18 Z M60 26 L70 38 L76 38 L72 26 Z" fill="currentColor"/></svg></span>` +
        `<div class="jp-marker"><svg class="jp-canopy" viewBox="0 0 40 30"><path d="M3 11 Q20 0 37 11 L36 15 Q20 6 4 15 Z" fill="#e85a3c"/><g stroke="rgba(255,255,255,0.85)" stroke-width="0.6"><line x1="5" y1="14" x2="19" y2="27"/><line x1="20" y1="9" x2="20" y2="27"/><line x1="35" y1="14" x2="21" y2="27"/></g></svg>` +
        `<span class="jp-dot"></span><span class="jp-alt mono">13,000 ft</span></div>`;

      path = host.querySelector('.jp-line');
      ghost = host.querySelector('.jp-ghost');
      total = path.getTotalLength();
      fd = host.querySelector('.jp-measure').getTotalLength() / total;
      path.style.strokeDasharray = total;
      path.style.strokeDashoffset = total;
      marker = host.querySelector('.jp-marker');
      altEl = host.querySelector('.jp-alt');

      const waypoints = [
        [0.0, 'Exit', '13,000 ft'],
        [fd * 0.55, 'Freefall', '~200 km/h · 45 s'],
        [fd, 'Canopy open', '5,500 ft'],
        [1.0, 'Feet down', 'stand-up landing'],
      ];
      wps = waypoints.map(([f, t, s]) => {
        const p = path.getPointAtLength(f * total);
        const el = document.createElement('div');
        el.className = 'jp-wp';
        el.style.left = p.x + 'px';
        el.style.top = p.y + 'px';
        el.innerHTML = `<span class="jp-tick"></span><span class="jp-wp-label"><span class="jp-wp-t">${t}</span><span class="jp-wp-s mono">${s}</span></span>`;
        el.dataset.f = f;
        host.appendChild(el);
        return el;
      });
    }

    function altitude(f) {
      if (f <= fd) return 13000 - (13000 - 5500) * (f / fd);
      return 5500 * (1 - (f - fd) / (1 - fd));
    }

    function update() {
      if (!path) return;
      const f = progress(hero, 0.14, 0.72);
      path.style.strokeDashoffset = total * (1 - f);
      const p = path.getPointAtLength(f * total);
      marker.style.transform = `translate(${p.x}px, ${p.y}px)`;
      marker.classList.toggle('open', f > fd);
      marker.classList.toggle('landed', f >= 0.999);
      altEl.textContent = (Math.round(altitude(f) / 10) * 10).toLocaleString('en-US') + ' ft';
      wps.forEach(el => el.classList.toggle('on', f >= +el.dataset.f - 0.002));
    }
    layouts.push(layout); updaters.push(update);
  })();

  /* ---------------- shared ink filter for stamps ---------------- */
  const defs = document.createElementNS(NS, 'svg');
  defs.setAttribute('width', '0'); defs.setAttribute('height', '0');
  defs.setAttribute('aria-hidden', 'true');
  defs.style.position = 'absolute';
  defs.innerHTML =
    '<filter id="ink-rough" x="-10%" y="-10%" width="120%" height="120%">' +
    '<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="7" result="n"/>' +
    '<feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G" result="d"/>' +
    '<feTurbulence type="fractalNoise" baseFrequency="0.35" numOctaves="1" seed="2" result="s"/>' +
    '<feColorMatrix in="s" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 1.75" result="m"/>' +
    '<feComposite in="d" in2="m" operator="in"/></filter>';
  document.body.appendChild(defs);

  /* ---------------- ideas & fosters: reveal once in view ---------------- */
  (function () {
    document.querySelectorAll('.idea-fig .ln').forEach(el => el.setAttribute('pathLength', '1'));
    const targets = document.querySelectorAll('.idea, .foster');
    if (!('IntersectionObserver' in window)) { targets.forEach(t => t.classList.add('seen')); return; }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('seen'); io.unobserve(e.target); } });
    }, { threshold: 0.45 });
    targets.forEach(t => io.observe(t));
  })();

  /* ---------------- drive ---------------- */
  function runLayouts() { layouts.forEach(fn => fn()); runUpdates(); }
  let ticking = false;
  function runUpdates() { ticking = false; updaters.forEach(fn => fn()); }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(runUpdates); } }
  let rT;
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(runLayouts, 120); });
  // fonts and images can shift section heights; re-measure once they settle
  window.addEventListener('load', runLayouts);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(runLayouts);
  runLayouts();
  if (reduced) document.documentElement.classList.add('reduced-motion');
})();
