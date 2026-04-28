/* Tweaks app — applies CSS variable overrides + DOM tweaks based on user knobs */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "marqueeSpeed": 3,
  "accentColor": "#c9663f",
  "paperTone": "cream",
  "fontScale": 100,
  "portraitTilt": -2.5,
  "cursorGlow": true,
  "showFacts": true,
  "statusText": "default",
  "skydiveProgress": 8
}/*EDITMODE-END*/;

const PAPER_TONES = {
  cream:  { paper: '#f4ede1', paper2: '#ece2d0', rule: '#c9bfb0' },
  bone:   { paper: '#f6f2ea', paper2: '#ebe4d6', rule: '#cdc5b6' },
  cool:   { paper: '#eef0ee', paper2: '#e2e6e2', rule: '#bcc2bd' },
  warm:   { paper: '#f7e9d6', paper2: '#eedcc0', rule: '#c9b694' },
  blush:  { paper: '#f6ece8', paper2: '#ecddd5', rule: '#cdb6ad' },
};

function TweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // marquee speed: speed=1 → 40s; speed=3 → ~13s; speed=8 → 5s
  React.useEffect(() => {
    const dur = (40 / Math.max(0.25, t.marqueeSpeed)).toFixed(2) + 's';
    document.documentElement.style.setProperty('--marquee-duration', dur);
  }, [t.marqueeSpeed]);

  // accent color → vaaree var (and amp/fact-num/cursor glow color)
  React.useEffect(() => {
    document.documentElement.style.setProperty('--vaaree', t.accentColor);
  }, [t.accentColor]);

  // paper tone
  React.useEffect(() => {
    const tone = PAPER_TONES[t.paperTone] || PAPER_TONES.cream;
    const r = document.documentElement.style;
    r.setProperty('--paper', tone.paper);
    r.setProperty('--paper-2', tone.paper2);
    r.setProperty('--rule', tone.rule);
  }, [t.paperTone]);

  // font scale
  React.useEffect(() => {
    document.documentElement.style.fontSize = (t.fontScale / 100 * 17).toFixed(2) + 'px';
    return () => { document.documentElement.style.fontSize = ''; };
  }, [t.fontScale]);

  // portrait tilt
  React.useEffect(() => {
    const el = document.querySelector('.portrait-frame');
    if (el) el.style.setProperty('--portrait-tilt', t.portraitTilt + 'deg');
    // override the inline rule
    let style = document.getElementById('twk-portrait-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'twk-portrait-style';
      document.head.appendChild(style);
    }
    style.textContent = `.portrait-frame{transform:rotate(${t.portraitTilt}deg)!important}
      .portrait-frame:hover{transform:rotate(0deg) scale(1.02)!important}`;
  }, [t.portraitTilt]);

  // cursor glow toggle
  React.useEffect(() => {
    let style = document.getElementById('twk-glow-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'twk-glow-style';
      document.head.appendChild(style);
    }
    style.textContent = t.cursorGlow ? '' : '.cursor-glow{display:none!important}';
  }, [t.cursorGlow]);

  // facts visibility
  React.useEffect(() => {
    const el = document.querySelector('.intro-facts');
    if (el) el.style.display = t.showFacts ? '' : 'none';
  }, [t.showFacts]);

  // status label override
  React.useEffect(() => {
    const lbl = document.getElementById('now-label');
    if (!lbl) return;
    if (t.statusText && t.statusText !== 'default') {
      lbl.textContent = t.statusText;
      lbl.dataset.locked = '1';
    } else {
      delete lbl.dataset.locked;
    }
  }, [t.statusText]);

  // skydive pip count
  React.useEffect(() => {
    const pips = document.getElementById('sky-pips');
    if (!pips) return;
    let html = '';
    for (let i = 0; i < 25; i++) html += `<span class="pip${i < t.skydiveProgress ? ' done' : ''}"></span>`;
    pips.innerHTML = html;
    // also update the "8 / 25" label next to it
    const sib = pips.parentElement && pips.parentElement.querySelector('.mono:not(.dim)');
    if (sib) sib.textContent = `${t.skydiveProgress} / 25`;
  }, [t.skydiveProgress]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Motion" />
      <TweakSlider label="Marquee speed" value={t.marqueeSpeed}
                   min={0.5} max={8} step={0.25} unit="×"
                   onChange={(v) => setTweak('marqueeSpeed', v)} />
      <TweakToggle label="Cursor glow" value={t.cursorGlow}
                   onChange={(v) => setTweak('cursorGlow', v)} />

      <TweakSection label="Look" />
      <TweakColor label="Accent color" value={t.accentColor}
                  onChange={(v) => setTweak('accentColor', v)} />
      <TweakSelect label="Paper tone" value={t.paperTone}
                   options={['cream', 'bone', 'cool', 'warm', 'blush']}
                   onChange={(v) => setTweak('paperTone', v)} />
      <TweakSlider label="Text size" value={t.fontScale}
                   min={85} max={120} step={1} unit="%"
                   onChange={(v) => setTweak('fontScale', v)} />

      <TweakSection label="Intro" />
      <TweakSlider label="Portrait tilt" value={t.portraitTilt}
                   min={-8} max={8} step={0.5} unit="°"
                   onChange={(v) => setTweak('portraitTilt', v)} />
      <TweakToggle label="Show facts list" value={t.showFacts}
                   onChange={(v) => setTweak('showFacts', v)} />
      <TweakSelect label='"Currently…" label' value={t.statusText}
                   options={['default', 'currently shipping', 'currently in ubud', 'currently coding', 'open to roles']}
                   onChange={(v) => setTweak('statusText', v)} />

      <TweakSection label="Off-hours" />
      <TweakSlider label="Skydive jumps done" value={t.skydiveProgress}
                   min={0} max={25} step={1}
                   onChange={(v) => setTweak('skydiveProgress', v)} />
    </TweaksPanel>
  );
}

const root = ReactDOM.createRoot(document.getElementById('tweaks-root'));
root.render(<TweaksApp />);
