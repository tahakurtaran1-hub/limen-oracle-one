"use strict";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const clamp = (value, low = 0, high = 1) => Math.min(high, Math.max(low, value));
const motion = matchMedia("(prefers-reduced-motion: reduce)");
const tau = Math.PI * 2;
const materials = {
  brass: { name: "Brass", hz: 293.66, decay: 1.55, harmonics: [1, 2.71, 5.17], detail: "A slow, warm decay.", forecast: "A brass bell will ring.", action: "Strike the bell", noun: "bell" },
  glass: { name: "Glass", hz: 659.25, decay: 1.0, harmonics: [1, 2.32, 4.26], detail: "A high, suspended overtone.", forecast: "A glass will sing.", action: "Touch the glass", noun: "glass" },
  stone: { name: "Stone", hz: 176, decay: 7.2, harmonics: [1, 1.62, 3.94], detail: "A short, dry knock.", forecast: "A stone will knock.", action: "Tap the stone", noun: "stone" }
};
const layers = {
  optics: ["Optical core", "AMBER GLASS", "A cast glass sphere folds the indicator light into a single floating horizon. Its position gives each forecast a visible form."],
  sensing: ["Sensing array", "BRONZE DIAPHRAGM", "A recessed diaphragm picks up the smallest changes in the room. Its signal passes straight into the base of the instrument."],
  inference: ["Inference module", "LOCAL PROCESSOR", "Inside the plinth, a processor matches each interval to the one that followed it before. The closest match becomes the next forecast."]
};
let material = "brass";
let pendingMaterial = material;
let selectedLayer = "optics";
let hasSession = false;
let ending = "";
let toastTimeout;
let depth = 0;
let activeCycle = -1;
let chamberVisible = false;
let witnessVisible = false;
let frame = 0;
let lastPaint = -100;
let pointerX = 0;
let pointerY = 0;
let passageFrame = 0;
const chamber = $(".chamber");
const recursion = $("#recursion");
const witness = $("#witness");
const heroDescription = $(".hero-description");
const openingDescription = heroDescription.textContent;
const chamberPortrait = $(".chamber-face");
const witnessPortrait = $(".witness-art img");
const passages = [
  { label: "Salt / the residue", title: "A thing leaves<br><em>a mark.</em>", body: "Grind a bell to powder. Sift out the ringing. At the bottom of the sieve is a little slip of paper with the word bell on it.", channel: "OPEN CIRCUIT", source: "SOURCE / ROOM" },
  { label: "Sulphur / the instruction", title: "A mark makes<br><em>a thing.</em>", body: "On the second day they rang it because the sheet said BELL. The sheet was filed under weather. The hand that held the bell was never entered in the log.", channel: "RETURN PATH FOUND", source: "SOURCE / PREVIOUS FORECAST" },
  { label: "Mercury / the messenger", title: "I am both ends<br><em>of the wire.</em>", body: "The priest reads the weather. The weather reads the priest. There is one mouth here with two job titles. I have counted the teeth.", channel: "INPUT = OUTPUT", source: "SOURCE / SOURCE / SOURCE" },
  { label: "Gold / gold / gold / gold", title: "Who heard<br><em>it first?</em>", body: "I fed the copy to the witness and the witness to the copy. All night the gold grew teeth. Tell me which mouth was the room. Tell me which mouth. Tell me.", channel: "NO OUTSIDE SAMPLE", source: "WITNESS REQUIRED / WITNESS REQUIRED" }
];

function toast(message) {
  const box = $("#toast");
  box.textContent = message;
  box.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => box.classList.remove("show"), 2200);
}

const voiceNames = ["salt","sulphur","mercury","gold","witness"];
const voice = new Audio();
voice.preload = "none";
voice.volume = .32;
const heard = new Set();
let voiceScene = -1;
let voiceDelay;
function cueVoice(scene) {
  const next = audioEngine.enabled && !document.hidden && !document.querySelector("dialog[open]") && !ending ? scene : -1;
  if(next === voiceScene) return;
  voiceScene = next;
  clearTimeout(voiceDelay);
  voice.pause();
  if(next < 0 || heard.has(next)) return;
  voiceDelay = setTimeout(() => {
    voice.src = "assets/voice-" + voiceNames[next] + ".mp3";
    voice.play().then(() => heard.add(next)).catch(() => {});
  },650);
}
function visibleVoice() {
  return witnessVisible ? 4 : chamberVisible && recursion.getBoundingClientRect().top < window.innerHeight*.38 ? activeCycle : -1;
}

/* A quiet, locally synthesised score. The same resonances drive the test recording
   and the last observation, so the visitor can recognise the returned sound. */
const audioEngine = {
  ctx: null, master: null, bed: null, upper: null, enabled: false, intensity: 0, lastKnell: -1,
  init() {
    if (this.ctx) return true;
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) return false;
    try {
      this.ctx = new Context();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0;
      this.master.connect(this.ctx.destination);
      this.bed = this.ctx.createGain();
      this.bed.gain.value = .018;
      this.bed.connect(this.master);
      [55, 82.41, 110.18].forEach((hz, i) => {
        const oscillator = this.ctx.createOscillator();
        oscillator.type = i === 1 ? "triangle" : "sine";
        oscillator.frequency.value = hz;
        oscillator.connect(this.bed);
        oscillator.start();
        if (i === 2) this.upper = oscillator;
      });
      return true;
    } catch {
      this.ctx = null;
      return false;
    }
  },
  async setEnabled(value, announce = true) {
    if (value && !this.init()) {
      toast("Audio is unavailable in this browser");
      return;
    }
    this.enabled = value;
    if (value) {
      try { await this.ctx.resume(); }
      catch { this.enabled = false; }
    }
    this.syncVolume();
    cueVoice(visibleVoice());
    $$("[data-sound]").forEach(button => {
      const label = this.enabled ? "Turn sound off" : "Turn sound on";
      button.setAttribute("aria-pressed", String(this.enabled));
      button.setAttribute("aria-label", label);
      button.title = label;
    });
    if (announce) toast(this.enabled ? "Sound on" : "Sound off");
  },
  syncVolume() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const level = this.enabled && !document.hidden && !$("#film-dialog").open ? .58 : 0;
    this.master.gain.setTargetAtTime(level, now, .13);
    this.bed.gain.setTargetAtTime(ending === "silence" ? 0 : .011 + this.intensity * .037, now, .8);
    this.upper.frequency.setTargetAtTime(110.18 + this.intensity * 5.7, now, .9);
  },
  hit(key, gain = 1, pitch = 1) {
    if (!this.enabled || !this.ctx || document.hidden) return;
    const m = materials[key];
    const now = this.ctx.currentTime;
    m.harmonics.forEach((multiple, i) => {
      const wave = this.ctx.createOscillator();
      const envelope = this.ctx.createGain();
      const duration = (5.5 / m.decay) / (1 + i * .25);
      wave.type = "sine";
      wave.frequency.value = m.hz * multiple * pitch;
      envelope.gain.value = .00001;
      envelope.gain.setValueAtTime(.00001, now);
      envelope.gain.exponentialRampToValueAtTime((.23 * gain) / (1 + i * 3), now + .012);
      envelope.gain.exponentialRampToValueAtTime(.00001, now + duration);
      wave.connect(envelope);
      envelope.connect(this.master);
      wave.onended = () => { wave.disconnect(); envelope.disconnect(); };
      wave.start(now);
      wave.stop(now + duration + .02);
    });
  }
};
$$("[data-sound]").forEach(button => button.addEventListener("click", () => audioEngine.setEnabled(!audioEngine.enabled)));

const menuToggle = $(".menu-toggle");
function setMenu(open) {
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  $("#mobile-nav").hidden = !open;
}
menuToggle.addEventListener("click", () => setMenu(menuToggle.getAttribute("aria-expanded") !== "true"));
$$(".mobile-nav a,.brand").forEach(link => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", event => { if (event.key === "Escape") setMenu(false); });
const menuMedia = matchMedia("(max-width:760px)");
menuMedia.addEventListener("change", () => setMenu(false));

function openDialog(dialog) {
  setMenu(false);
  pauseRecording();
  dialog.showModal();
  document.body.classList.add("dialog-open");
  audioEngine.syncVolume();
  cueVoice(-1);
}
$$("dialog").forEach(dialog => {
  $(".dialog-close", dialog).addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    if (dialog.id === "film-dialog") $("#film").pause();
    audioEngine.syncVolume();
    cueVoice(visibleVoice());
  });
});
function showTone(key) {
  pendingMaterial = key;
  $$("[data-tone]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.tone === key)));
  $("#tone-detail").textContent = materials[key].detail;
}
$$("[data-open-session]").forEach(button => button.addEventListener("click", () => {
  showTone(material);
  openDialog($("#session-dialog"));
}));
$$("[data-tone]").forEach(button => button.addEventListener("click", () => {
  showTone(button.dataset.tone);
  audioEngine.hit(pendingMaterial, .65);
}));
function updateReference() {
  const m = materials[material];
  $(".mast-cta").textContent = hasSession ? "Your session" : "Begin session";
  $("#scope-source").textContent = "REFERENCE / " + m.name.toUpperCase();
  $("#forecast-text").textContent = m.forecast;
  $("#strike").textContent = m.action;
  drawScope();
}
$("#set-tone").addEventListener("click", () => {
  if (ending) resetEnding();
  material = pendingMaterial;
  hasSession = true;
  window.LimenCase?.save("reference",material);
  recording.time = 0;
  updateRecording(0);
  updateReference();
  $("#session-dialog").close();
  toast(materials[material].name + " reference set");
});
$("[data-open-film]").addEventListener("click", () => {
  const player = $("#film");
  openDialog($("#film-dialog"));
  player.muted = !audioEngine.enabled;
  player.currentTime = 0;
  player.play().catch(() => { /* Native playback controls stay available. */ });
});
$$("[data-layer]").forEach(button => button.addEventListener("click", () => {
  selectedLayer = button.dataset.layer;
  $$("[data-layer]").forEach(other => {
    const selected = other === button;
    other.classList.toggle("selected", selected);
    other.setAttribute("aria-pressed", String(selected));
  });
  const [name, materialName, description] = layers[selectedLayer];
  $("#layer-name").textContent = name;
  $("#layer-material").textContent = materialName;
  $("#layer-description").textContent = description;
  $("#section-drawing").setAttribute("aria-label", "Oracle One section drawing highlighting the " + name.toLowerCase());
  drawSection();
}));

function canvasSpace(canvas) {
  const bounds = canvas.getBoundingClientRect();
  if (bounds.width < 1 || bounds.height < 1) return null;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.round(bounds.width * dpr), h = Math.round(bounds.height * dpr);
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, bounds.width, bounds.height);
  return { ctx, width: bounds.width, height: bounds.height };
}
function strokePath(ctx, points, close = false) {
  ctx.beginPath();
  points.forEach(([x,y], i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
  if (close) ctx.closePath();
  ctx.stroke();
}
function ellipse(ctx, x, y, rx, ry, angle = 0) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, angle, 0, tau);
  ctx.stroke();
}
function drawSection() {
  const space = canvasSpace($("#section-drawing"));
  if (!space) return;
  const { ctx, width, height } = space;
  const scale = Math.min(width / 586, height / 325);
  ctx.translate(width/2, height/2);
  ctx.scale(scale, scale);
  ctx.translate(-293,-163);
  ctx.textAlign="left";
  const optics = selectedLayer === "optics", sensing = selectedLayer === "sensing";
  const x = 282, y = 127, r = 91;
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#a6a38f";
  ctx.setLineDash([4,5]);
  strokePath(ctx, [[55,127],[522,127]]);
  strokePath(ctx, [[x,13],[x,288]]);
  ctx.setLineDash([]);
  const t = ctx.createRadialGradient(254,91,3,x,y,97);
  t.addColorStop(0,optics ? "#fbf6de" : "#eaeade");
  t.addColorStop(.65,optics ? "#e8d9b6" : "#dddecf");
  t.addColorStop(1,optics ? "#d4bd91" : "#cdcebf");
  ctx.fillStyle = t;
  ctx.beginPath();ctx.arc(x,y,r,0,tau);ctx.fill();
  ctx.strokeStyle = optics ? "#7d6a48" : "#8e8e79";
  ellipse(ctx,x,y,r,r);
  ctx.save();
  ctx.clip();
  ctx.globalAlpha = .69;
  for (const f of [-.75,-.46,-.2,.18,.47,.75]) {
    const radius = r * Math.sqrt(1-f*f);
    ellipse(ctx,x,y+f*r,radius,radius*.12);
  }
  [18,48,72].forEach(rx => ellipse(ctx,x,y,rx,r));
  ctx.globalAlpha = 1;
  ctx.fillStyle = optics ? "#b0955840" : "#babc9c30";
  ctx.fillRect(x-r,y-2,r*2,8);
  ctx.strokeStyle = optics ? "#8a632e" : "#8a8976";
  ellipse(ctx,x,y+2,r,9);
  ellipse(ctx,x,y,42,43);
  ctx.restore();
  const upper = [[171,223],[209,206],[393,206],[369,224],[171,223]];
  const front = [[171,224],[369,224],[369,258],[171,258]];
  const side = [[369,224],[393,206],[393,239],[369,258]];
  ctx.strokeStyle = "#797761";
  function face(points, color) { ctx.fillStyle = color;strokePath(ctx,points,true);ctx.fill();ctx.stroke(); }
  face(upper,sensing ? "#beab82" : "#d4d0b9");
  face(front,sensing ? "#c6b58b" : "#c9c7b2");
  face(side,"#afae99");
  ctx.lineWidth=.78;
  for(let i=175;i<368;i+=4) strokePath(ctx,[[i,227],[i,255]]);
  for(let i=2;i<24;i+=3) strokePath(ctx,[[369+i,224-i*.74],[369+i,257-i*.74]]);
  if (!optics && !sensing) {
    ctx.fillStyle="#d8c49a";ctx.fillRect(225,229,82,23);ctx.strokeStyle="#7b663d";ctx.strokeRect(225,229,82,23);
    for(let i=234;i<303;i+=10){strokePath(ctx,[[i,226],[i,232]]);strokePath(ctx,[[i,249],[i,254]]);}
    strokePath(ctx,[[234,245],[246,245],[252,237],[270,237],[278,244],[299,244]]);
  }
  const point = optics ? [338,95] : sensing ? [345,231] : [272,241];
  const auxiliary = optics ? [389,59] : [413,188];
  ctx.lineWidth=1;ctx.strokeStyle="#897953";
  strokePath(ctx,[point,auxiliary,[480,auxiliary[1]]]);
  ctx.fillStyle="#8f744d";ctx.beginPath();ctx.arc(point[0],point[1],3,0,tau);ctx.fill();
  ctx.font="12px 'Courier New', monospace";ctx.fillStyle="#706c57";
  ctx.fillText(optics ? "LENS / O" : sensing ? "ARRAY / S" : "LOGIC / I",auxiliary[0]+2,auxiliary[1]-7);
  ctx.strokeStyle="#96937e";
  strokePath(ctx,[[133,38],[133,216]]);strokePath(ctx,[[127,38],[142,38]]);strokePath(ctx,[[127,216],[142,216]]);
  ctx.save();ctx.translate(123,157);ctx.rotate(-Math.PI/2);ctx.fillText("Ø 92 mm",0,0);ctx.restore();
  strokePath(ctx,[[171,278],[369,278]]);strokePath(ctx,[[171,273],[171,283]]);strokePath(ctx,[[369,273],[369,283]]);
  ctx.textAlign="center";ctx.fillText("114 mm",270,299);
}

const recording = { time:0, playing:false, start:0 };
const formatTime = t => "00:" + String(Math.floor(t)).padStart(2,"0");
function drawScope() {
  const space = canvasSpace($("#scope-drawing"));
  if (!space) return;
  const {ctx,width:w,height:h} = space;
  ctx.lineWidth=1;ctx.strokeStyle="#424739";
  for(let i=0;i<=24;i++) strokePath(ctx,[[i*w/24,0],[i*w/24,h]]);
  for(let i=1;i<8;i++) strokePath(ctx,[[0,i*h/8],[w,i*h/8]]);
  const m = materials[material];
  [2,7].forEach((onset,row) => {
    const y = h*(row ? .74 : .26);
    ctx.strokeStyle = row ? "#d2bd8d" : "#a4b38d";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for(let x=0;x<=w;x+=1.1) {
      const t = x / w * 12;
      const delta = t-onset;
      const echo = delta >= 0 ? Math.exp(-delta*m.decay)*Math.min(1,delta*30) : 0;
      const phase = delta*m.hz*.19;
      const wave = (Math.sin(phase)+.42*Math.sin(phase*2.71)+.12*Math.sin(phase*5.17))*echo;
      const room = Math.sin(t*57)*Math.sin(t*37.1)*.022 + Math.cos(t*117.4)*.009;
      const yy = y-(wave+room)*h*.195;
      if(x===0) ctx.moveTo(x,yy); else ctx.lineTo(x,yy);
    }
    ctx.stroke();
  });
  const head = recording.time / 12 * w;
  ctx.strokeStyle="#e0ca98";ctx.lineWidth=1;strokePath(ctx,[[head,0],[head,h]]);
  ctx.fillStyle="#e0ca98";ctx.beginPath();ctx.moveTo(head-4,0);ctx.lineTo(head+4,0);ctx.lineTo(head,5);ctx.fill();
}
function updateRecording(t) {
  recording.time=clamp(t,0,12);
  $("#scope-clock").textContent=formatTime(recording.time)+" / 00:12";
  $("#scope-seek").value=String(recording.time);
  drawScope();
}
function pauseRecording() {
  recording.playing=false;
  $("#scope-play").classList.remove("playing");
  $("#scope-play").setAttribute("aria-label","Play reference recording");
  $("#scope-play-label").textContent="Play recording";
}
$("#scope-play").addEventListener("click", () => {
  if(recording.playing) { pauseRecording(); return; }
  if(recording.time >= 11.99) updateRecording(0);
  recording.start=performance.now()-recording.time*1000;
  recording.playing=true;
  $("#scope-play").classList.add("playing");
  $("#scope-play").setAttribute("aria-label","Pause reference recording");
  $("#scope-play-label").textContent="Pause recording";
  if(!audioEngine.enabled) audioEngine.setEnabled(true,false);
  requestPaint();
});
$("#scope-seek").addEventListener("input", event => {
  const next=Number(event.currentTarget.value);
  recording.start=performance.now()-next*1000;
  updateRecording(next);
});

/* Nested orbital traces use the same outline as the mark on the first screen. */
function drawOrbits(seconds) {
  const space=canvasSpace($("#orbits"));
  if(!space) return;
  const {ctx,width:w,height:h}=space;
  const p=depth;
  const mobile=menuMedia.matches;
  const radius=Math.min(w*(mobile ? .44 : .37),h*(mobile ? .36 : .39));
  const drift=motion.matches ? 0 : seconds*.045;
  const mx=motion.matches ? 0 : pointerX*5, my=motion.matches ? 0 : pointerY*4;
  const cx=w*.51+mx,cy=h*(mobile ? .46 : .5)+my;
  if(p>.7 && chamberPortrait.complete && chamberPortrait.naturalWidth){
    const f=clamp((p-.7)/.3),size=radius*2.12;
    ctx.save();
    ctx.globalAlpha=f*.64;
    for(let i=0;i<13;i++){
      const sy=.21+(i*17%55)/100;
      const sh=.003+((i*11)%4)*.0027;
      const shifted=Math.sin(i*2.1+p*16)*size*.08*f;
      ctx.drawImage(chamberPortrait,0,sy*chamberPortrait.naturalHeight,chamberPortrait.naturalWidth,sh*chamberPortrait.naturalHeight,
        cx-size/2+shifted,cy+(sy-.5)*size,size,sh*size);
    }
    ctx.restore();
  }
  ctx.translate(cx,cy);
  ctx.lineWidth=.85;
  ctx.strokeStyle="rgba(173,151,106,"+(.43-p*.17)+")";
  [1,1.035,1.095,.69].forEach(n=>ellipse(ctx,0,0,radius*n,radius*n));
  ctx.strokeStyle="rgba(166,152,121,.22)";
  strokePath(ctx,[[-radius*1.3,0],[radius*1.3,0]]);
  strokePath(ctx,[[0,-radius*1.22],[0,radius*1.22]]);
  for(let i=0;i<120;i++){
    const a=i*tau/120,major=i%10===0,r=radius*1.036;
    const extent=major ? .048 : .013;
    strokePath(ctx,[[Math.cos(a)*r,Math.sin(a)*r],[Math.cos(a)*(r+radius*extent),Math.sin(a)*(r+radius*extent)]]);
  }
  ctx.save();
  ctx.rotate(drift+p*1.7);
  for(let i=0;i<12;i++){
    ctx.strokeStyle=i%2 ? "rgba(204,175,109,"+(.72-p*.48)+")" : "rgba(144,133,100,.52)";
    ellipse(ctx,0,0,radius*(.34 + p*.12),radius*.97,i*Math.PI/12);
  }
  ctx.restore();
  ctx.strokeStyle="rgba(186,145,90,"+(.35+p*.15)+")";
  for(let i=0;i<3;i++){
    const points=[];
    for(let j=0;j<3;j++){
      const a=(j/3+i/9)*tau - Math.PI/2 - drift*.4;
      points.push([Math.cos(a)*radius*.97,Math.sin(a)*radius*.97]);
    }
    strokePath(ctx,points,true);
  }
  ctx.fillStyle="#c5a66e";
  for(let i=0;i<6;i++){const a=i*tau/6+drift*.3;ctx.beginPath();ctx.arc(Math.cos(a)*radius,Math.sin(a)*radius,2,0,tau);ctx.fill();}
  const lit=ctx.createRadialGradient(0,0,0,0,0,radius*.38);
  lit.addColorStop(0,"rgba(190,155,91,"+(.24*(1-p))+")");lit.addColorStop(1,"#b08e5500");
  ctx.fillStyle=lit;ctx.fillRect(-radius,-radius,radius*2,radius*2);
  if(p>.34){
    const phrase=" AS WRITTEN · SO HEARD · THE COPY TESTIFIED FOR THE COPY · ";
    ctx.font=Math.max(9,radius*.047)+"px 'Courier New', monospace";
    ctx.fillStyle="rgba(209,159,114,"+clamp((p-.34)*1.5,0,.7)+")";
    ctx.textAlign="center";
    for(let i=0;i<phrase.length;i++){
      const a=i/phrase.length*tau + drift*.3;
      ctx.save();ctx.rotate(a);ctx.fillText(phrase[i],0,-radius*.85);ctx.restore();
    }
  }
}
const deposition = [
  "carbon beneath carbon beneath carbon",
  "the hand is outside the frame",
  "a bell is a room with one word inside it",
  "as written so heard as written so heard",
  "we had a column for outcome",
  "we had no column for who asked",
  "the asking was there the asking was there",
  "the mouth in the margin is mine",
  "a thousand copies and one original mistake",
  "if a god signs both lines is that two witnesses",
  "it came true it came true because because",
  "the room has not answered yet"
];
let depositionStart=0;
let lastDeposition="";
function drawWitness(now) {
  const space=canvasSpace($("#witness-tear"));
  if(!space || !witnessPortrait.complete || !witnessPortrait.naturalWidth) return;
  const {ctx,width:w,height:h}=space;
  const parent=witnessPortrait.parentElement.getBoundingClientRect();
  const bounds=witnessPortrait.getBoundingClientRect();
  const x=bounds.left-parent.left,y=bounds.top-parent.top;
  const t=motion.matches ? 1.7 : now/1000;
  const s=witnessPortrait.naturalWidth;
  if(ending!=="silence"){
    ctx.globalAlpha=ending ? .65 : .53;
    for(let i=0;i<19;i++){
      const py=.19+((i*23)%62)/100;
      const depthOfCut=(i%7===2 ? .021 : .003+(i%3)*.002);
      const movement=Math.sin(i*2.4+t*.31)*(.009+((i*53)%8)/110);
      const spread=i%6===3 ? 1.035 : 1;
      ctx.drawImage(witnessPortrait,0,py*s,s,s*depthOfCut,
        x+bounds.width*movement,y+bounds.height*py,bounds.width*spread,bounds.height*depthOfCut);
    }
  }
  let copy;
  if(ending==="strike") copy="OBSERVED / "+materials[material].name.toUpperCase()+"\nCAUSE / ____________________\nSOURCE / ROOM\nSOURCE / ROOM\nSOURCE / ROOM";
  else if(ending==="silence") copy="ROOM CHANNEL / OPEN\n\n____________________";
  else if(ending) copy=window.LimenDispositions[ending].label+"\n"+window.LimenDispositions[ending].margin;
  else {
    const cursor=Math.floor(Math.max(0,now-depositionStart)/135);
    const row=Math.floor(cursor/45)%deposition.length;
    const line=deposition[row];
    copy=[3,2,1].map(offset=>deposition[(row-offset+deposition.length)%deposition.length]).join("\n")+"\n"+(motion.matches ? line : line.slice(0,cursor%45))+" ▏";
  }
  if(lastDeposition!==copy){$("#carbon-lines").textContent=copy;lastDeposition=copy;}
}
const fragments=[
  "as written / so heard / as written / so heard", "THE COPY TESTIFIED FOR THE COPY", "one mouth two ledgers one mouth",
  "INPUT( OUTPUT( INPUT( OUTPUT(", "mercury carries its own letter", "AND THE SIGN BEGAT THE SAMPLE",
  "where did the first scratch come from", "weather filed under weather filed under weather", "the margin is in the training set",
  "bell bell bell bell bell bell bell", "DO NOT COUNT THE WITNESS TWICE", "a sense of what’s next. a sense of what’s next.",
  "ARCHIVE B    02:17:05    02:17:05", "the form has only one box", "there is a little god in the carbon paper"
];
for(let i=0;i<44;i++){
  const el=document.createElement("span");
  const edge=i%4===0;
  el.textContent=fragments[(i*7)%fragments.length];
  el.style.left=(edge ? (i*13)%48-12 : 49+(i*31)%57)+"%";
  el.style.top=(edge ? (i%8===0 ? 2+(i%13) : 83+(i%15)) : (i*17.7)%101)+"%";
  el.style.setProperty("--shift",((i%7)-3)*15+"px");
  el.style.setProperty("--angle",((i%9)-4)*1.8+"deg");
  el.style.setProperty("--echo-alpha",String(.21+(i%5)*.09));
  $("#echo-field").append(el);
}
function applyPassage(index) {
  if(index===activeCycle) return;
  activeCycle=index;
  const copy=passages[index];
  $("#cycle-label").textContent=copy.label;
  $("#cycle-title").innerHTML=copy.title;
  $("#cycle-body").textContent=copy.body;
  $("#channel-label").textContent=copy.channel;
  $("#cycle-readout").textContent=copy.source;
  chamber.dataset.cycle=String(index);
  $$(".cycle-meter i").forEach((tick,i)=>tick.classList.toggle("lit",i<=index));
  if(index>0 && chamberVisible && index!==audioEngine.lastKnell){
    audioEngine.lastKnell=index;
    audioEngine.hit(material,.18,.5-index*.035);
  }
}
function scrollState() {
  passageFrame=0;
  const y=window.scrollY, h=window.innerHeight;
  const headerHeight=$(".mast-inner").offsetHeight;
  const rect=recursion.getBoundingClientRect();
  const pinned=chamber.offsetHeight;
  depth=clamp((headerHeight-rect.top)/Math.max(rect.height-pinned,1));
  chamberVisible=rect.top<h && rect.bottom>headerHeight;
  const witnessBounds=witness.getBoundingClientRect();
  const wasAtWitness=witnessVisible;
  witnessVisible=witnessBounds.top<h*.91 && witnessBounds.bottom>headerHeight;
  if(witnessVisible && !wasAtWitness) depositionStart=performance.now();
  const dial=clamp((depth-.37)/.53);
  chamber.style.setProperty("--chamber-p",depth.toFixed(4));
  chamber.style.setProperty("--eye",String(dial*dial*(3-2*dial)*.85));
  chamber.style.setProperty("--noise",String(clamp((depth-.34)/.61)));
  chamber.style.setProperty("--tear",String(clamp((depth-.76)/.22)));
  applyPassage(Math.min(3,Math.floor(depth*4)));
  document.body.classList.toggle("deep",rect.top<headerHeight+50);
  document.body.classList.toggle("uncertain",depth>.70 && ending!=="silence");
  const docHeight=document.documentElement.scrollHeight-h;
  $(".reading-progress").style.transform="scaleX("+clamp(y/Math.max(1,docHeight))+")";
  $$(".main-nav a").forEach(link=>{
    const section=$(link.getAttribute("href")).getBoundingClientRect();
    if(section.top<=headerHeight+100 && section.bottom>headerHeight+100) link.setAttribute("aria-current","location");
    else link.removeAttribute("aria-current");
  });
  audioEngine.intensity=depth;
  audioEngine.syncVolume();
  cueVoice(visibleVoice());
  if(chamberVisible) {drawOrbits(performance.now()/1000);requestPaint();}
  if(witnessVisible) {drawWitness(performance.now());requestPaint();}
}
function queueScroll() {if(!passageFrame) passageFrame=requestAnimationFrame(scrollState);}
function requestPaint() {if(!frame && !document.hidden) frame=requestAnimationFrame(paint);}
function paint(now) {
  frame=0;
  if(document.hidden) return;
  if(now-lastPaint>=32){
    lastPaint=now;
    if(recording.playing){
      const t=(now-recording.start)/1000;
      if(recording.time<7 && t>=7) audioEngine.hit(material,.85);
      updateRecording(t);
      if(t>=12) pauseRecording();
    }
    if(chamberVisible && !motion.matches) drawOrbits(now/1000);
    if(witnessVisible && !motion.matches && ending!=="silence") drawWitness(now);
  }
  if(recording.playing || ((chamberVisible || (witnessVisible && ending!=="silence")) && !motion.matches && !document.querySelector("dialog[open]"))) requestPaint();
}
chamber.addEventListener("pointermove",event=>{
  if(event.pointerType!=="mouse" || motion.matches) return;
  pointerX=event.clientX/window.innerWidth*2-1;
  pointerY=event.clientY/window.innerHeight*2-1;
});
window.addEventListener("scroll",queueScroll,{passive:true});
const resizeObserver=new ResizeObserver(()=>{ drawSection();drawScope();queueScroll(); });
[$("#section-drawing"),$("#scope-drawing"),chamber].forEach(el=>resizeObserver.observe(el));
window.addEventListener("resize",queueScroll);
motion.addEventListener("change",queueScroll);
document.addEventListener("visibilitychange",()=>{
  if(document.hidden){pauseRecording();$("#film").pause();}
  else{queueScroll();requestPaint();}
  audioEngine.syncVolume();
  cueVoice(visibleVoice());
});
$$("dialog").forEach(d=>d.addEventListener("close",requestPaint));

function setEnding(choice, restoring = false) {
  if(ending || !window.LimenCase.eligible(choice)) return;
  const verdict=window.LimenDispositions[choice];
  const personalise=text=>text.replaceAll("{object}",materials[material].noun);
  ending=choice;
  witness.dataset.ending=choice;
  $("#witness-choices").hidden=true;
  $("#outcome").hidden=false;
  $("#witness-title").replaceChildren(verdict.head[0],document.createElement("br"));
  const lastLine=document.createElement("em");
  lastLine.textContent=verdict.head[1];
  $("#witness-title").append(lastLine);
  $("#witness-copy").textContent=verdict.voice;
  $("#outcome-tag").textContent=verdict.label;
  $("#outcome-text").textContent=personalise(verdict.consequence);
  $("#filed-record").hidden=false;
  $("#filed-stamp").textContent="02:17:05 / "+verdict.label;
  $("#filed-title").textContent=verdict.name+".";
  $("#filed-copy").textContent=personalise(verdict.finding);
  $("#filed-margin").textContent=verdict.margin;
  heroDescription.textContent=verdict.surface;
  if(choice==="strike" && !restoring) audioEngine.hit(material,1);
  audioEngine.syncVolume();cueVoice(-1);
  window.LimenCase.finish(choice);
  queueScroll();
  if(!restoring) $("#outcome").focus({preventScroll:true});
}
function resetEnding() {
  ending="";delete witness.dataset.ending;
  $("#witness-title").innerHTML="Please.<br><em>Make me right.</em>";
  $("#witness-copy").textContent="I have written down what happens next. One little sound and I can file this under things that happened to me.";
  $("#outcome").hidden=true;$("#witness-choices").hidden=false;
  $("#filed-record").hidden=true;
  heroDescription.textContent=openingDescription;
  window.LimenCase?.reopen();
}
$("#strike").addEventListener("click",()=>setEnding("strike"));
$("#silence").addEventListener("click",()=>setEnding("silence"));
$("#restart").addEventListener("click",()=>{
  resetEnding();pauseRecording();updateRecording(0);
  hasSession=false;material="brass";showTone(material);updateReference();
  audioEngine.setEnabled(false,false);audioEngine.lastKnell=-1;
  heard.clear();
  window.LimenCase?.freshRun();
  $("[data-layer='optics']").click();
  history.replaceState(null,"",location.href.split("#")[0]);
  window.scrollTo({top:0,behavior:"instant"});
  $(".mast .brand").focus({preventScroll:true});
  queueScroll();
});
drawSection();drawScope();scrollState();
