/* abstract dotted world map + travel pins */
(function () {
  const svg = document.querySelector('.world-map');
  if (!svg) return;
  const dotgrid = svg.querySelector('#dotgrid');
  const pinsGroup = svg.querySelector('#pins');

  // dotted world silhouette: cheap procedural — grid of dots with lat/lon mask
  // we'll use a simplified land-mass mask via a few rectangles
  const W = 1000, H = 500;
  const STEP = 10;
  // very loose continental rectangles in the 1000x500 viewbox
  const land = [
    // North America
    {x: 100, y: 80, w: 200, h: 160},
    // South America
    {x: 230, y: 240, w: 110, h: 170},
    // Europe
    {x: 460, y: 90, w: 90, h: 90},
    // Africa
    {x: 470, y: 180, w: 130, h: 200},
    // Middle East / west asia
    {x: 560, y: 130, w: 100, h: 90},
    // Asia
    {x: 600, y: 80, w: 240, h: 160},
    // SE Asia / Indonesia
    {x: 720, y: 240, w: 140, h: 50},
    // Australia
    {x: 800, y: 290, w: 130, h: 90},
  ];
  function inLand(x, y) {
    for (const r of land) {
      if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return true;
    }
    return false;
  }
  let dots = '';
  for (let y = 30; y < H - 30; y += STEP) {
    for (let x = 30; x < W - 30; x += STEP) {
      if (inLand(x, y)) {
        // wobble for organic feel
        const ox = x + (Math.sin(x * 0.3 + y * 0.1) * 1.4);
        const oy = y + (Math.cos(x * 0.2 - y * 0.2) * 1.4);
        dots += `<circle cx="${ox.toFixed(1)}" cy="${oy.toFixed(1)}" r="1.4"/>`;
      }
    }
  }
  dotgrid.innerHTML = dots;

  // pins (rough x,y in viewbox)
  const places = [
    { name: 'Bali, Indonesia', x: 820, y: 273, hero: true },
    { name: 'Paris, France', x: 507, y: 114 },
    { name: 'Lausanne, Switzerland', x: 518, y: 121 },
    { name: 'Geneva, Switzerland', x: 517, y: 122 },
    { name: 'San Sebastian, Spain', x: 495, y: 130 },
    { name: 'Bangkok, Thailand', x: 779, y: 212 },
    { name: 'Singapore', x: 788, y: 246 },
    { name: 'Kuala Lumpur, Malaysia', x: 783, y: 241 },
    { name: 'Kathmandu, Nepal', x: 737, y: 173 },
    { name: 'Goa, India', x: 705, y: 208 },
    { name: 'Leh-Ladakh, India', x: 716, y: 155 },
  ];

  let pinsHTML = '';
  places.forEach((p, i) => {
    const r = p.hero ? 6 : 4;
    pinsHTML += `<g class="pin" data-idx="${i}">`;
    pinsHTML += `<circle class="pin-ring" cx="${p.x}" cy="${p.y}" r="${r + 6}"/>`;
    pinsHTML += `<circle class="pin-dot" cx="${p.x}" cy="${p.y}" r="${r}"/>`;
    if (p.hero) pinsHTML += `<text class="pin-label" x="${p.x + 12}" y="${p.y + 4}">${p.name}</text>`;
    pinsHTML += `</g>`;
  });
  pinsGroup.innerHTML = pinsHTML;

  // map list
  const list = document.getElementById('map-list');
  list.innerHTML = places
    .map((p, i) => `<div class="map-list-item" data-idx="${i}">
      <span class="mli-name">${p.name}</span>
      <span class="mli-coord">${p.hero ? '★' : '·'}</span>
    </div>`)
    .join('');

  // sync hover
  function setActive(idx, on) {
    list.querySelectorAll('.map-list-item').forEach(el => {
      el.classList.toggle('active', on && +el.dataset.idx === idx);
    });
    pinsGroup.querySelectorAll('.pin').forEach(el => {
      const matches = +el.dataset.idx === idx;
      el.style.transform = (on && matches) ? 'scale(1.6)' : '';
    });
  }
  pinsGroup.querySelectorAll('.pin').forEach(el => {
    const idx = +el.dataset.idx;
    el.addEventListener('mouseenter', () => setActive(idx, true));
    el.addEventListener('mouseleave', () => setActive(idx, false));
  });
  list.querySelectorAll('.map-list-item').forEach(el => {
    const idx = +el.dataset.idx;
    el.addEventListener('mouseenter', () => setActive(idx, true));
    el.addEventListener('mouseleave', () => setActive(idx, false));
  });
})();
