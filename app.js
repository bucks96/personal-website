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
  const sections = ['intro', 'work', 'projects', 'extras'].map(id => ({
    id, el: document.getElementById(id)
  }));
  const navLinks = Array.from(document.querySelectorAll('[data-nav]'));
  const body = document.body;
  const nowLabel = document.getElementById('now-label');

  const labels = {
    intro: 'currently free-falling',
    work: 'currently shipping',
    projects: 'currently rag-ing',
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
    if (active === 'projects') body.classList.add('chrome-dark');
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
    glow.style.top = e.clientY + window.scrollY + 'px';
  });
  // glow color shifts per section
  const glowColors = {
    intro: 'rgba(201,102,63,0.18)',
    work: 'rgba(244,237,225,0.10)',
    projects: 'rgba(184,255,92,0.15)',
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
  // Vaaree carpet unrolls with section progress
  const vaareeJob = document.getElementById('job-vaaree');
  const carpetStrip = vaareeJob && vaareeJob.querySelector('.carpet-strip');
  const carpetRoll  = vaareeJob && vaareeJob.querySelector('.carpet-roll');

  // Supertails puppy walks down the left edge
  const supertailsJob = document.getElementById('job-supertails');
  const puppy = supertailsJob && supertailsJob.querySelector('.puppy');

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
    if (vaareeJob && carpetStrip) {
      const p = sectionProgress(vaareeJob);
      const h = vaareeJob.offsetHeight;
      const target = (h - 60) * p;
      carpetStrip.style.height = target + 'px';
      // roll shrinks and rolls a bit as it unspools
      if (carpetRoll) {
        const scale = 1 - p * 0.35;
        carpetRoll.style.transform = `scale(${scale}) rotate(${p * 540}deg)`;
      }
    }
    if (supertailsJob && puppy) {
      const p = sectionProgress(supertailsJob);
      const h = supertailsJob.offsetHeight;
      const top = 40 + (h - 140) * p;
      puppy.style.top = top + 'px';
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
