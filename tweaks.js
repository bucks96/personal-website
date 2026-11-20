const __TWEAKS_STYLE=`
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;width:100%;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}
`;function useTweaks(t){const[n,e]=React.useState(t),r=React.useCallback((o,s)=>{const l=typeof o=="object"&&o!==null?o:{[o]:s};e(c=>({...c,...l})),window.parent.postMessage({type:"__edit_mode_set_keys",edits:l},"*")},[]);return[n,r]}function TweaksPanel({title:t="Tweaks",children:n}){const[e,r]=React.useState(!1),o=React.useRef(null),s=React.useRef({x:16,y:16}),l=16,c=React.useCallback(()=>{const a=o.current;if(!a)return;const d=a.offsetWidth,p=a.offsetHeight,i=Math.max(l,window.innerWidth-d-l),u=Math.max(l,window.innerHeight-p-l);s.current={x:Math.min(i,Math.max(l,s.current.x)),y:Math.min(u,Math.max(l,s.current.y))},a.style.right=s.current.x+"px",a.style.bottom=s.current.y+"px"},[]);React.useEffect(()=>{if(!e)return;if(c(),typeof ResizeObserver=="undefined")return window.addEventListener("resize",c),()=>window.removeEventListener("resize",c);const a=new ResizeObserver(c);return a.observe(document.documentElement),()=>a.disconnect()},[e,c]),React.useEffect(()=>{const a=d=>{var i;const p=(i=d==null?void 0:d.data)==null?void 0:i.type;p==="__activate_edit_mode"?r(!0):p==="__deactivate_edit_mode"&&r(!1)};return window.addEventListener("message",a),window.parent.postMessage({type:"__edit_mode_available"},"*"),()=>window.removeEventListener("message",a)},[]);const g=()=>{r(!1),window.parent.postMessage({type:"__edit_mode_dismissed"},"*")},m=a=>{const d=o.current;if(!d)return;const p=d.getBoundingClientRect(),i=a.clientX,u=a.clientY,w=window.innerWidth-p.right,b=window.innerHeight-p.bottom,f=h=>{s.current={x:w-(h.clientX-i),y:b-(h.clientY-u)},c()},x=()=>{window.removeEventListener("mousemove",f),window.removeEventListener("mouseup",x)};window.addEventListener("mousemove",f),window.addEventListener("mouseup",x)};return e?React.createElement(React.Fragment,null,React.createElement("style",null,__TWEAKS_STYLE),React.createElement("div",{ref:o,className:"twk-panel",style:{right:s.current.x,bottom:s.current.y}},React.createElement("div",{className:"twk-hd",onMouseDown:m},React.createElement("b",null,t),React.createElement("button",{className:"twk-x","aria-label":"Close tweaks",onMouseDown:a=>a.stopPropagation(),onClick:g},"\u2715")),React.createElement("div",{className:"twk-body"},n))):null}function TweakSection({label:t,children:n}){return React.createElement(React.Fragment,null,React.createElement("div",{className:"twk-sect"},t),n)}function TweakRow({label:t,value:n,children:e,inline:r=!1}){return React.createElement("div",{className:r?"twk-row twk-row-h":"twk-row"},React.createElement("div",{className:"twk-lbl"},React.createElement("span",null,t),n!=null&&React.createElement("span",{className:"twk-val"},n)),e)}function TweakSlider({label:t,value:n,min:e=0,max:r=100,step:o=1,unit:s="",onChange:l}){return React.createElement(TweakRow,{label:t,value:`${n}${s}`},React.createElement("input",{type:"range",className:"twk-slider",min:e,max:r,step:o,value:n,onChange:c=>l(Number(c.target.value))}))}function TweakToggle({label:t,value:n,onChange:e}){return React.createElement("div",{className:"twk-row twk-row-h"},React.createElement("div",{className:"twk-lbl"},React.createElement("span",null,t)),React.createElement("button",{type:"button",className:"twk-toggle","data-on":n?"1":"0",role:"switch","aria-checked":!!n,onClick:()=>e(!n)},React.createElement("i",null)))}function TweakRadio({label:t,value:n,options:e,onChange:r}){const o=React.useRef(null),[s,l]=React.useState(!1),c=e.map(i=>typeof i=="object"?i:{value:i,label:i}),g=Math.max(0,c.findIndex(i=>i.value===n)),m=c.length,a=React.useRef(n);a.current=n;const d=i=>{const u=o.current.getBoundingClientRect(),w=u.width-4,b=Math.floor((i-u.left-2)/w*m);return c[Math.max(0,Math.min(m-1,b))].value};return React.createElement(TweakRow,{label:t},React.createElement("div",{ref:o,role:"radiogroup",onPointerDown:i=>{l(!0);const u=d(i.clientX);u!==a.current&&r(u);const w=f=>{if(!o.current)return;const x=d(f.clientX);x!==a.current&&r(x)},b=()=>{l(!1),window.removeEventListener("pointermove",w),window.removeEventListener("pointerup",b)};window.addEventListener("pointermove",w),window.addEventListener("pointerup",b)},className:s?"twk-seg dragging":"twk-seg"},React.createElement("div",{className:"twk-seg-thumb",style:{left:`calc(2px + ${g} * (100% - 4px) / ${m})`,width:`calc((100% - 4px) / ${m})`}}),c.map(i=>React.createElement("button",{key:i.value,type:"button",role:"radio","aria-checked":i.value===n},i.label))))}function TweakSelect({label:t,value:n,options:e,onChange:r}){return React.createElement(TweakRow,{label:t},React.createElement("select",{className:"twk-field",value:n,onChange:o=>r(o.target.value)},e.map(o=>{const s=typeof o=="object"?o.value:o,l=typeof o=="object"?o.label:o;return React.createElement("option",{key:s,value:s},l)})))}function TweakText({label:t,value:n,placeholder:e,onChange:r}){return React.createElement(TweakRow,{label:t},React.createElement("input",{className:"twk-field",type:"text",value:n,placeholder:e,onChange:o=>r(o.target.value)}))}function TweakNumber({label:t,value:n,min:e,max:r,step:o=1,unit:s="",onChange:l}){const c=a=>e!=null&&a<e?e:r!=null&&a>r?r:a,g=React.useRef({x:0,val:0});return React.createElement("div",{className:"twk-num"},React.createElement("span",{className:"twk-num-lbl",onPointerDown:a=>{a.preventDefault(),g.current={x:a.clientX,val:n};const d=(String(o).split(".")[1]||"").length,p=u=>{const w=u.clientX-g.current.x,b=g.current.val+w*o,f=Math.round(b/o)*o;l(c(Number(f.toFixed(d))))},i=()=>{window.removeEventListener("pointermove",p),window.removeEventListener("pointerup",i)};window.addEventListener("pointermove",p),window.addEventListener("pointerup",i)}},t),React.createElement("input",{type:"number",value:n,min:e,max:r,step:o,onChange:a=>l(c(Number(a.target.value)))}),s&&React.createElement("span",{className:"twk-num-unit"},s))}function TweakColor({label:t,value:n,onChange:e}){return React.createElement("div",{className:"twk-row twk-row-h"},React.createElement("div",{className:"twk-lbl"},React.createElement("span",null,t)),React.createElement("input",{type:"color",className:"twk-swatch",value:n,onChange:r=>e(r.target.value)}))}function TweakButton({label:t,onClick:n,secondary:e=!1}){return React.createElement("button",{type:"button",className:e?"twk-btn secondary":"twk-btn",onClick:n},t)}Object.assign(window,{useTweaks,TweaksPanel,TweakSection,TweakRow,TweakSlider,TweakToggle,TweakRadio,TweakSelect,TweakText,TweakNumber,TweakColor,TweakButton});const TWEAK_DEFAULTS={marqueeSpeed:3,accentColor:"#c9663f",paperTone:"cream",fontScale:100,portraitTilt:-2.5,cursorGlow:!0,showFacts:!0,statusText:"default",skydiveProgress:8},PAPER_TONES={cream:{paper:"#f4ede1",paper2:"#ece2d0",rule:"#c9bfb0"},bone:{paper:"#f6f2ea",paper2:"#ebe4d6",rule:"#cdc5b6"},cool:{paper:"#eef0ee",paper2:"#e2e6e2",rule:"#bcc2bd"},warm:{paper:"#f7e9d6",paper2:"#eedcc0",rule:"#c9b694"},blush:{paper:"#f6ece8",paper2:"#ecddd5",rule:"#cdb6ad"}};function TweaksApp(){const[t,n]=useTweaks(TWEAK_DEFAULTS);return React.useEffect(()=>{const e=(40/Math.max(.25,t.marqueeSpeed)).toFixed(2)+"s";document.documentElement.style.setProperty("--marquee-duration",e)},[t.marqueeSpeed]),React.useEffect(()=>{document.documentElement.style.setProperty("--vaaree",t.accentColor)},[t.accentColor]),React.useEffect(()=>{const e=PAPER_TONES[t.paperTone]||PAPER_TONES.cream,r=document.documentElement.style;r.setProperty("--paper",e.paper),r.setProperty("--paper-2",e.paper2),r.setProperty("--rule",e.rule)},[t.paperTone]),React.useEffect(()=>(document.documentElement.style.fontSize=(t.fontScale/100*17).toFixed(2)+"px",()=>{document.documentElement.style.fontSize=""}),[t.fontScale]),React.useEffect(()=>{const e=document.querySelector(".portrait-frame");e&&e.style.setProperty("--portrait-tilt",t.portraitTilt+"deg");let r=document.getElementById("twk-portrait-style");r||(r=document.createElement("style"),r.id="twk-portrait-style",document.head.appendChild(r)),r.textContent=`.portrait-frame{transform:rotate(${t.portraitTilt}deg)!important}
      .portrait-frame:hover{transform:rotate(0deg) scale(1.02)!important}`},[t.portraitTilt]),React.useEffect(()=>{let e=document.getElementById("twk-glow-style");e||(e=document.createElement("style"),e.id="twk-glow-style",document.head.appendChild(e)),e.textContent=t.cursorGlow?"":".cursor-glow{display:none!important}"},[t.cursorGlow]),React.useEffect(()=>{const e=document.querySelector(".intro-facts");e&&(e.style.display=t.showFacts?"":"none")},[t.showFacts]),React.useEffect(()=>{const e=document.getElementById("now-label");e&&(t.statusText&&t.statusText!=="default"?(e.textContent=t.statusText,e.dataset.locked="1"):delete e.dataset.locked)},[t.statusText]),React.useEffect(()=>{const e=document.getElementById("sky-pips");if(!e)return;let r="";for(let s=0;s<25;s++)r+=`<span class="pip${s<t.skydiveProgress?" done":""}"></span>`;e.innerHTML=r;const o=e.parentElement&&e.parentElement.querySelector(".mono:not(.dim)");o&&(o.textContent=`${t.skydiveProgress} / 25`)},[t.skydiveProgress]),React.createElement(TweaksPanel,{title:"Tweaks"},React.createElement(TweakSection,{label:"Motion"}),React.createElement(TweakSlider,{label:"Marquee speed",value:t.marqueeSpeed,min:.5,max:8,step:.25,unit:"\xD7",onChange:e=>n("marqueeSpeed",e)}),React.createElement(TweakToggle,{label:"Cursor glow",value:t.cursorGlow,onChange:e=>n("cursorGlow",e)}),React.createElement(TweakSection,{label:"Look"}),React.createElement(TweakColor,{label:"Accent color",value:t.accentColor,onChange:e=>n("accentColor",e)}),React.createElement(TweakSelect,{label:"Paper tone",value:t.paperTone,options:["cream","bone","cool","warm","blush"],onChange:e=>n("paperTone",e)}),React.createElement(TweakSlider,{label:"Text size",value:t.fontScale,min:85,max:120,step:1,unit:"%",onChange:e=>n("fontScale",e)}),React.createElement(TweakSection,{label:"Intro"}),React.createElement(TweakSlider,{label:"Portrait tilt",value:t.portraitTilt,min:-8,max:8,step:.5,unit:"\xB0",onChange:e=>n("portraitTilt",e)}),React.createElement(TweakToggle,{label:"Show facts list",value:t.showFacts,onChange:e=>n("showFacts",e)}),React.createElement(TweakSelect,{label:'"Currently\u2026" label',value:t.statusText,options:["default","currently shipping","currently in ubud","currently coding","open to roles"],onChange:e=>n("statusText",e)}),React.createElement(TweakSection,{label:"Off-hours"}),React.createElement(TweakSlider,{label:"Skydive jumps done",value:t.skydiveProgress,min:0,max:25,step:1,onChange:e=>n("skydiveProgress",e)}))}const root=ReactDOM.createRoot(document.getElementById("tweaks-root"));root.render(React.createElement(TweaksApp,null));
