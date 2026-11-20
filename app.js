/* portfolio interactions:
   - active nav based on scroll
   - chrome theme swap per section
   - cursor glow
   - skydiving altimeter ticker + pip render
*/

(function () {
  // pip render for skydiving progress
  const pips = document.getElementById('sky-pips');
  if (pips) {
    let html = '';
    for (let i = 0; i < 25; i++) html += `<span class="pip${i < 8 ? ' done' : ''}"></span>`;
    pips.innerHTML = html;
  }

  // altimeter ticker (visual flavor)
  const altNum = document.getElementById('alt-num');
  if (altNum) {
    let alt = 13000;
    let dir = -1;
    setInterval(() => {
      alt += dir * 18;
      if (alt < 12200) dir = 1;
      if (alt > 13000) dir = -1;
      altNum.textContent = alt.toLocaleString();
    }, 90);
  }

  // sticky nav active state + chrome theme
  const sections = ['intro', 'work', 'projects', 'ideas', 'dogs', 'extras'].map(id => ({
    id, el: document.getElementById(id)
  }));
  const navLinks = Array.from(document.querySelectorAll('[data-nav]'));
  const body = document.body;
  const nowLabel = document.getElementById('now-label');

  const labels = {
    intro: 'currently free-falling',
    work: 'currently shipping',
    projects: 'currently rag-ing',
    ideas: 'currently tinkering',
    dogs: 'currently out on a walk',
    extras: 'currently 13,000 ft up',
  };

  function onScroll() {
    const y = window.scrollY + window.innerHeight * 0.4;
    let active = sections[0].id;
    sections.forEach(s => {
      if (s.el && s.el.offsetTop <= y) active = s.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.dataset.nav === active);
    });
    if (nowLabel && !nowLabel.dataset.locked) nowLabel.textContent = labels[active] || '';

    // chrome theme: dark on projects, sky on extras, default elsewhere
    body.classList.remove('chrome-dark', 'chrome-sky');
    if (active === 'projects' || active === 'ideas') body.classList.add('chrome-dark');
    else if (active === 'extras') {
      // figure out sub-section by scroll Y
      const extras = document.getElementById('extras');
      const skyHero = extras ? extras.querySelector('.sky-hero') : null;
      if (skyHero) {
        const rect = skyHero.getBoundingClientRect();
        if (rect.bottom > 80 && rect.top < 80) body.classList.add('chrome-sky');
      }
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // smooth scroll for nav
  navLinks.forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 40, behavior: 'smooth' });
    });
  });

  // cursor glow
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  let glowVisible = false;
  window.addEventListener('mousemove', e => {
    if (!glowVisible) {
      glow.style.opacity = '1';
      glowVisible = true;
    }
    glow.style.left = e.clientX + 'px';
    // .cursor-glow is position: fixed, so viewport coords only (adding scrollY made it drift)
    glow.style.top = e.clientY + 'px';
  });
  // glow color shifts per section
  const glowColors = {
    intro: 'rgba(201,102,63,0.18)',
    work: 'rgba(244,237,225,0.10)',
    projects: 'rgba(184,255,92,0.15)',
    ideas: 'rgba(160,200,255,0.14)',
    dogs: 'rgba(196,128,62,0.16)',
    extras: 'rgba(31,74,120,0.18)',
  };
  function updateGlow() {
    const y = window.scrollY + window.innerHeight * 0.5;
    let active = 'intro';
    sections.forEach(s => { if (s.el && s.el.offsetTop <= y) active = s.id; });
    glow.style.background = `radial-gradient(circle, ${glowColors[active]} 0%, transparent 60%)`;
  }
  window.addEventListener('scroll', updateGlow, { passive: true });
  updateGlow();
  // ---- scroll-driven decorations ----
  // Vaaree: line sketch draws itself with section progress
  const vaareeJob = document.getElementById('job-vaaree');
  const sketch = vaareeJob && vaareeJob.querySelector('.vaaree-sketch');
  const sketchPaths = sketch ? Array.from(sketch.querySelectorAll('.draw')) : [];

  // Supertails: paw prints appear down the left edge
  const supertailsJob = document.getElementById('job-supertails');
  const pawTrail = supertailsJob && supertailsJob.querySelector('.paw-trail');
  const PAW_SVG = '<svg viewBox="0 0 40 40"><g fill="currentColor">' +
    '<path d="M20 20c-6 0-11 5-11 10.5 0 3.6 2.6 5 5.4 5 2.3 0 3.6-1.2 5.6-1.2s3.3 1.2 5.6 1.2c2.8 0 5.4-1.4 5.4-5C31 25 26 20 20 20z"/>' +
    '<ellipse cx="8.5" cy="16" rx="3.4" ry="4.4" transform="rotate(-22 8.5 16)"/>' +
    '<ellipse cx="15.5" cy="8.5" rx="3.6" ry="4.8" transform="rotate(-6 15.5 8.5)"/>' +
    '<ellipse cx="24.5" cy="8.5" rx="3.6" ry="4.8" transform="rotate(6 24.5 8.5)"/>' +
    '<ellipse cx="31.5" cy="16" rx="3.4" ry="4.4" transform="rotate(22 31.5 16)"/>' +
    '</g></svg>';
  let paws = [];
  function layoutPaws() {
    if (!pawTrail || !supertailsJob) return;
    const h = supertailsJob.offsetHeight;
    const step = 64;
    const n = Math.max(6, Math.floor((h - 120) / step));
    if (paws.length !== n) {
      pawTrail.innerHTML = '';
      paws = [];
      for (let i = 0; i < n; i++) {
        const p = document.createElement('span');
        p.className = 'paw';
        const left = i % 2 === 0;
        // walking downward: toes point down, slight splay left/right
        p.style.setProperty('--rot', `rotate(${left ? 170 : 190}deg)`);
        p.style.left = (left ? 4 : 26) + 'px';
        p.innerHTML = PAW_SVG;
        pawTrail.appendChild(p);
        paws.push(p);
      }
    }
    const gap = (h - 120) / n;
    paws.forEach((p, i) => { p.style.top = (60 + i * gap) + 'px'; });
  }
  layoutPaws();
  window.addEventListener('resize', layoutPaws);

  // Skydiver scrolls through the sky hero
  const skyHero = document.querySelector('.sky-hero');
  const skydiver = document.getElementById('skydiver');

  function clamp01(v){ return Math.max(0, Math.min(1, v)); }
  function sectionProgress(el) {
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const total = rect.height + window.innerHeight;
    const scrolled = window.innerHeight - rect.top;
    return clamp01(scrolled / total);
  }

  function onScrollFx() {
    if (vaareeJob && sketchPaths.length) {
      // draw between 15% and 60% of the section's pass through the viewport
      const t = clamp01((sectionProgress(vaareeJob) - 0.15) / 0.45);
      const n = sketchPaths.length;
      sketchPaths.forEach((path, i) => {
        // each stroke gets its own slice of t, with a little overlap
        const start = (i / n) * 0.85;
        const local = clamp01((t - start) / (1.6 / n));
        path.style.strokeDashoffset = String(1 - local);
      });
      sketch.classList.toggle('done', t >= 0.999);
    }
    if (supertailsJob && paws.length) {
      const p = clamp01((sectionProgress(supertailsJob) - 0.1) / 0.75);
      const shown = Math.round(p * paws.length);
      paws.forEach((paw, i) => {
        paw.classList.toggle('on', i < shown);
        paw.classList.toggle('latest', i === shown - 1);
      });
    }
    if (skyHero && skydiver) {
      const p = sectionProgress(skyHero);
      const h = skyHero.offsetHeight;
      const top = -40 + (h - 80) * p;
      skydiver.style.top = top + 'px';
      // pass through cloud around 0.4–0.5
      const inCloud = p > 0.38 && p < 0.5;
      skydiver.classList.toggle('in-cloud', inCloud);
      // open chute after cloud
      skydiver.classList.toggle('chute-open', p > 0.55);
      // gentle horizontal sway
      const sway = Math.sin(p * Math.PI * 3) * 30;
      skydiver.style.transform = `translateX(calc(-50% + ${sway}px))`;
    }
  }
  window.addEventListener('scroll', onScrollFx, { passive: true });
  window.addEventListener('resize', onScrollFx);
  onScrollFx();
})();
