/* Tabs: one section on screen at a time, routed by the URL hash.
   #work shows the Work tab; #job-vaaree shows Work and scrolls to that job. */
(function () {
  const TABS = [
    ['intro', 'Hello'],
    ['work', 'Work'],
    ['projects', 'AI projects'],
    ['ideas', 'Fixes'],
    ['dogs', 'Dogs'],
    ['extras', 'Off-hours'],
  ];
  const ids = TABS.map(t => t[0]);
  const sections = ids.map(id => document.getElementById(id));
  document.body.classList.add('has-tabs');

  // prev / next links at the bottom of every tab
  sections.forEach((sec, i) => {
    if (!sec) return;
    const prev = TABS[i - 1], next = TABS[i + 1];
    const nav = document.createElement('nav');
    nav.className = 'tab-pager';
    nav.setAttribute('aria-label', 'More sections');
    nav.innerHTML =
      (prev ? `<a class="pager-link pager-prev" href="#${prev[0]}"><span class="mono">← back</span><span class="pager-name">${prev[1]}</span></a>` : '<span></span>') +
      (next ? `<a class="pager-link pager-next" href="#${next[0]}"><span class="mono">next →</span><span class="pager-name">${next[1]}</span></a>` : `<a class="pager-link pager-next" href="#intro"><span class="mono">back to start ↺</span><span class="pager-name">Hello</span></a>`);
    sec.appendChild(nav);
  });

  function currentHash() {
    try { return decodeURIComponent(location.hash.slice(1)); } catch (e) { return ''; }
  }
  function route(forced) {
    const hash = typeof forced === 'string' ? forced : currentHash();
    let tab = 'intro', target = null;
    if (ids.includes(hash)) tab = hash;
    else if (hash) {
      const el = document.getElementById(hash);
      const sec = el && el.closest('section.section');
      if (sec && ids.includes(sec.id)) { tab = sec.id; target = el; }
    }
    const changed = document.body.dataset.tab !== tab;
    sections.forEach(sec => sec && sec.classList.toggle('is-active', sec.id === tab));
    document.body.dataset.tab = tab;
    document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === tab));
    if (target) {
      requestAnimationFrame(() => {
        const y = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: y, behavior: changed ? 'auto' : 'smooth' });
      });
    } else if (changed) {
      window.scrollTo(0, 0);
    }
    // sections that were hidden have to re-measure their scroll effects
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new Event('scroll'));
    });
  }
  // Handle in-page links ourselves. Some previews (like the design editor) block or swallow
  // hash navigation, so we never rely on the URL changing for a tab to open.
  window.addEventListener('click', e => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    if (!id || !document.getElementById(id)) return;
    e.preventDefault();
    route(id);
    // keep a shareable address where the browser allows it
    try { history.pushState(null, '', '#' + id); } catch (err) { /* sandboxed preview: fine */ }
  }, true);
  window.addEventListener('hashchange', () => route());
  window.addEventListener('popstate', () => route());
  route();
})();
