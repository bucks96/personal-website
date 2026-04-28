/* ===========================================================
   Virtual Interview — chat widget wired to /api/chat (RAG)
   =========================================================== */
(function () {
  const root      = document.getElementById('vi-root');
  const launcher  = document.getElementById('vi-launcher');
  const win       = document.getElementById('vi-window');
  const closeBtn  = document.getElementById('vi-close');
  const stream    = document.getElementById('vi-stream');
  const composer  = document.getElementById('vi-composer');
  const input     = document.getElementById('vi-input');
  const sendBtn   = document.querySelector('.vi-send');
  const suggested = document.getElementById('vi-suggested');

  if (!root || !launcher || !win) return;

  /* ---------- open / close ---------- */
  function open() {
    root.classList.add('is-open');
    launcher.setAttribute('aria-expanded', 'true');
    win.setAttribute('aria-hidden', 'false');
    setTimeout(() => input && input.focus(), 320);
  }
  function close() {
    root.classList.remove('is-open');
    launcher.setAttribute('aria-expanded', 'false');
    win.setAttribute('aria-hidden', 'true');
  }
  launcher.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && root.classList.contains('is-open')) close();
  });

  /* ---------- scroll ---------- */
  function scrollToBottom() {
    requestAnimationFrame(() => { stream.scrollTop = stream.scrollHeight; });
  }

  /* ---------- escape HTML ---------- */
  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }

  /* ---------- format plain-text answer into paragraphs ---------- */
  function formatAnswer(text) {
    return text
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => `<p>${escapeHTML(p).replace(/\n/g, '<br>')}</p>`)
      .join('');
  }

  /* ---------- mascot SVG ---------- */
  function mascotSVG() {
    return `<svg viewBox="0 0 50 50">
      <circle cx="25" cy="25" r="24" fill="#f4ede1" stroke="#c9bfb0" stroke-width="1"/>
      <circle cx="25" cy="20" r="6" fill="#1a1714"/>
      <path d="M20 15 q1 -4 5 -4 q4 0 5 4" stroke="#1a1714" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <path d="M14 40 q0 -12 11 -12 q11 0 11 12 z" fill="#1a1714"/>
      <circle cx="22.5" cy="19.5" r="0.9" fill="#f4ede1"/>
      <circle cx="27.5" cy="19.5" r="0.9" fill="#f4ede1"/>
      <path d="M22.5 22.5 q2.5 2 5 0" stroke="#f4ede1" stroke-width="1.1" fill="none" stroke-linecap="round"/>
    </svg>`;
  }

  /* ---------- message helpers ---------- */
  function appendUser(text) {
    const row = document.createElement('div');
    row.className = 'vi-row vi-row--user';
    row.innerHTML = `<div class="vi-bubble">${escapeHTML(text)}</div>`;
    stream.appendChild(row);
    scrollToBottom();
  }

  function appendBot(htmlContent) {
    const row = document.createElement('div');
    row.className = 'vi-row vi-row--bot';
    row.innerHTML = `<div class="vi-mascot">${mascotSVG()}</div><div class="vi-bubble">${htmlContent}</div>`;
    stream.appendChild(row);
    scrollToBottom();
  }

  function appendTyping() {
    const row = document.createElement('div');
    row.className = 'vi-row vi-row--bot';
    row.innerHTML = `<div class="vi-mascot">${mascotSVG()}</div>
      <div class="vi-bubble"><span class="vi-typing"><span></span><span></span><span></span></span></div>`;
    stream.appendChild(row);
    scrollToBottom();
    return row;
  }

  /* ---------- lock / unlock input during request ---------- */
  function setInputLocked(locked) {
    input.disabled = locked;
    if (sendBtn) sendBtn.disabled = locked;
  }

  /* ---------- RAG API call ---------- */
  async function askRAG(question) {
    const res = await fetch('https://personal-website-production-3270.up.railway.app/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    if (!res.ok) throw new Error(`Server error ${res.status}`);
    const data = await res.json();
    return data.answer;
  }

  /* ---------- send flow ---------- */
  async function send(text) {
    const q = (text || '').trim();
    if (!q || input.disabled) return;

    // Hide suggested chips after first message
    if (suggested && !suggested.classList.contains('is-hidden')) {
      suggested.style.display = 'none';
      suggested.classList.add('is-hidden');
    }

    appendUser(q);
    input.value = '';
    setInputLocked(true);

    const typingRow = appendTyping();
    try {
      const answer = await askRAG(q);
      typingRow.remove();
      appendBot(formatAnswer(answer));
    } catch (_err) {
      typingRow.remove();
      appendBot(
        '<p class="vi-bubble-soft">Something went wrong — please try again in a moment.</p>'
      );
    } finally {
      setInputLocked(false);
      input.focus();
    }
  }

  /* ---------- form submit ---------- */
  composer.addEventListener('submit', (e) => {
    e.preventDefault();
    send(input.value);
  });

  /* ---------- suggested chips ---------- */
  document.querySelectorAll('.vi-chip').forEach((chip) => {
    chip.addEventListener('click', () => send(chip.dataset.q || chip.textContent));
  });
})();
