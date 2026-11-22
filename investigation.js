(() => {
  "use strict";

  const nextSection = document.getElementById("recursion");
  if (!nextSection || document.getElementById("west-annex")) return;

  const annex = document.createElement("section");
  annex.id = "west-annex";
  annex.className = "west-annex";
  annex.setAttribute("aria-labelledby", "annex-title");
  nextSection.before(annex);

  const schematic = `<svg viewBox="0 0 560 270" role="img" aria-label="Floor plan of the cable room, carbon archive, and night desk joined by a service corridor">
    <defs><pattern id="annex-hatch" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 6 6 0" stroke="currentColor" stroke-width=".55"/></pattern></defs>
    <g fill="none" stroke="currentColor" stroke-linecap="square">
      <path d="M30 55H179V130H211V30H362V107H393V68H530V218H411M383 218H356V244H186V218H30Z" stroke-width="2.5"/>
      <path d="M36 61H173V136H217V36H356V113H399V74H524V212H411M383 212H350V238H192V212H36Z" stroke-width=".7"/>
      <path d="M36 167H99m32 0h91m31 0h152m31 0h88M217 37v130m133-54v54M399 114v53"/>
      <path d="M99 167v-31a31 31 0 0 1 31 31m92 0v-30a30 30 0 0 1 30 30m153 0v-30a30 30 0 0 1 30 30" stroke-width=".7"/>
      <path d="M61 82h51v14H61Zm0 18h51v14H61Zm0 18h51v14H61Zm210-59h58v10h-58Zm0 16h58v10h-58Zm0 16h58v10h-58Zm0 16h58v10h-58ZM443 97h52v22h-52Z" fill="url(#annex-hatch)"/>
      <circle cx="469" cy="131" r="8"/><path d="M445 207v-18H94v-25M274 189v-22M467 189v-22" stroke-dasharray="4 5"/>
      <path d="M19 56v160m-5-160h10m-10 160h10M217 17h140m-140-5v10m140-10v10" opacity=".5"/>
    </g><g fill="currentColor" font-size="13" font-family="monospace" letter-spacing="2"><text x="128" y="106">C</text><text x="239" y="83">A</text><text x="414" y="100">N</text></g>
  </svg>`;

  annex.innerHTML = `
    <div class="annex-head"><div class="annex-wrap annex-head-grid">
      <div><p class="annex-kicker">Incident inquiry / lower floor</p><h2 id="annex-title">The west <em>annex.</em></h2>
      <p class="annex-deck">The report ends upstairs. Its three sources are still down here. Follow the wire, the paper, or the person who signed.</p></div>
      <figure class="annex-plan">${schematic}<figcaption>West annex &nbsp; / &nbsp; service access</figcaption></figure>
      <nav class="annex-doors" aria-label="Rooms in the west annex">
        <a href="#cable-room"><span>C</span>Cable room</a><a href="#carbon-archive"><span>A</span>Carbon archive</a><a href="#night-desk"><span>N</span>Night desk</a>
      </nav>
    </div></div>

    <section class="annex-room annex-cable" id="cable-room" aria-labelledby="cable-title"><div class="annex-wrap annex-room-grid">
      <div class="annex-story"><p class="annex-kicker">Cable room / return bus</p><h3 id="cable-title">Follow the<br><em>copper.</em></h3>
        <p>The loom goes through the wall at ankle height. Someone has left a square of clean paint where a second microphone ought to hang. The brass sleeve beneath it is warm.</p>
        <p>A grease-pencil instruction survives on the subtractor. Feed it two recordings. Anything they have in common disappears.</p>
        <blockquote>“Listen to what’s left.”<cite>Inscription on the bench</cite></blockquote>
      </div>
      <div class="annex-console"><div class="annex-panel-heading"><span>Difference amplifier</span><span class="annex-small">BENCH C</span></div>
        <div class="annex-scope-face"><canvas id="annex-osc" role="img" aria-label="Differential signal display"></canvas><div class="annex-scope-legend"><span>A – B</span><output id="annex-meter">Unpatched</output></div></div>
        <p class="annex-console-prompt">Patch two sources</p><div class="annex-switches" role="group" aria-label="Signal sources"><button type="button" data-wire="mic" aria-pressed="false">Ceiling mic</button><button type="button" data-wire="line" aria-pressed="false">Line return</button><button type="button" data-wire="reel" aria-pressed="false">Safety reel</button></div>
        <div id="annex-wire-reading" class="annex-reading" aria-live="polite">All three sockets bear the same acceptance stamp. Select a source to trace it.</div>
        <div id="annex-cable-file" hidden><p class="annex-console-prompt">Disposition of the splice</p><div class="annex-controls"><button type="button" data-cable-file="remove">Remove the sleeve</button><button type="button" data-cable-file="mark">Mark the sleeve in place</button></div></div>
        <p class="annex-receipt" id="annex-cable-receipt" hidden></p>
      </div>
    </div></section>

    <section class="annex-room annex-archive" id="carbon-archive" aria-labelledby="annex-archive-title"><div class="annex-wrap annex-archive-grid">
      <div class="annex-story"><p class="annex-kicker">Carbon archive / registration table</p><h3 id="annex-archive-title">The pressure<br><em>of a word.</em></h3>
        <p>In the basement archive every accepted prediction has two copies. A strip of carbon paper once lay between them. The wax stays soft for years.</p>
        <p>The clerk wrote the due time on the front. Turn the sheet over and the point of the pen has been there already.</p>
        <blockquote>“Five seconds between the forecast and the room copy. Bring the marks together.”<cite>Registration table instructions</cite></blockquote>
      </div>
      <div class="annex-lightbox"><div class="annex-panel-heading"><span>Registration table</span><span class="annex-small">R / 17</span></div>
        <div class="annex-paper-stage" id="annex-paper-stage"><div class="annex-paper"><span>WEST ANNEX &nbsp;·&nbsp; DUPLICATE</span><hr><p>Sound observed</p><strong>BELL</strong><div class="annex-paper-type">RECEIVED AT &nbsp; 02 17 05<br>WITNESS &nbsp; _______________</div></div><div class="annex-carbon" aria-hidden="true"><span>×</span><b>BELL</b><span>×</span></div></div>
        <div class="annex-archive-tools"><div class="annex-panel-row"><label for="annex-offset">Registration offset</label><output id="annex-offset-output" for="annex-offset">0 s</output></div>
          <input id="annex-offset" type="range" min="-8" max="8" step="1" value="0" aria-label="Registration offset in seconds">
          <div class="annex-face-controls" role="group" aria-label="Sheet face"><button type="button" data-face="front" aria-pressed="true">Front</button><button type="button" data-face="back" aria-pressed="false">Reverse</button></div>
          <p id="annex-paper-reading" class="annex-reading" aria-live="polite">The two punctures sit five seconds apart. Move the carbon against the clock scale.</p>
          <div id="annex-archive-file" hidden><p class="annex-console-prompt">Copy to retain</p><div class="annex-controls"><button type="button" data-archive-file="cover">File the face sheet</button><button type="button" data-archive-file="rubbing">Take a pressure rubbing</button></div></div>
          <button id="annex-develop" type="button" class="annex-developed-button" hidden>Develop the unexposed strip</button><p class="annex-receipt" id="annex-archive-receipt" hidden></p>
        </div>
      </div>
    </div></section>

    <section class="annex-room annex-desk" id="night-desk" aria-labelledby="annex-desk-title"><div class="annex-wrap annex-room-grid">
      <div class="annex-story"><p class="annex-kicker">Night desk / internal exchange</p><h3 id="annex-desk-title">Someone<br><em>signed for it.</em></h3>
        <p>A chair faces a telephone. The seat is still tucked under the desk. A crescent of dust marks the space where a cup would stand if anyone had ever sat here.</p>
        <p>Three extensions remain live. The brass plate beside the last key reads VACANT. It has been polished all the way through to silver.</p>
        <p id="annex-desk-crossnote" class="annex-crossnote" hidden></p>
      </div>
      <div class="annex-exchange"><div class="annex-panel-heading"><span>Internal exchange</span><span class="annex-small">NIGHT CIRCUIT</span></div>
        <div class="annex-phone-body"><div class="annex-grille" aria-hidden="true"></div><span id="annex-call-lamp" class="annex-call-lamp">Line idle</span></div>
        <div class="annex-lines" role="group" aria-label="Call an extension"><button type="button" data-line="registry" aria-pressed="false"><small>04</small>Registry</button><button type="button" data-line="porter" aria-pressed="false"><small>17</small>Porter</button><button type="button" data-line="vacant" aria-pressed="false"><small>00</small>Vacant</button></div>
        <div class="annex-conversation"><p class="annex-console-prompt" id="annex-speaker">Exchange transcript</p><p id="annex-answer" aria-live="polite">Pick up a line. Each call is transcribed onto the same roll.</p><div id="annex-prompts" class="annex-controls"></div></div>
        <p class="annex-receipt" id="annex-desk-receipt" hidden></p>
      </div>
    </div></section>
    <div class="annex-binder" id="annex-binder" hidden><div class="annex-wrap">
      <p class="annex-kicker">Annex inquiry / retained material</p><h3>Your <em>case file.</em></h3><div id="annex-notes"></div>
    </div></div>`;

  const find = id => annex.querySelector("#" + id);
  const documents = {
    remove: ["The loose sleeve", "Inside the sleeve, a red enamel bridge carries LINE OUT directly onto the recorder bus. The inscription on its inner lip reads ‘restore on review days’. With the bridge in your pocket, both meters finally disagree."],
    mark: ["The intact connection", "Your pencil mark runs across the return sleeve and the inspection seal. A completed maintenance slip promises that the bridge was cut last winter. Your unbroken line crosses the place where the cut should be."],
    cover: ["The accepted duplicate", "The surface sheet says a chamber bell corroborated the forecast at 02:17:05. Held against the light, both bells share the same pen stroke. The clean copy has an empty space beneath the line for cause."],
    rubbing: ["The clerk’s rubbing", "A pencil laid flat across the duplicate lifts a sentence the surface never carried. ‘Entered on instruction.’ The heavy downstroke of the B in BELL bit both slips at once. There were two sheets and a single hand."],
    witnessed: ["The named hand", "The registry specimen and the courier’s initials are the same piece of type. The porter took the unsigned slips to the annex. After the machine printed a name, he signed for their delivery. Your transcript restores the order."],
    suppressed: ["A voice left on the line", "The outgoing message is the only material on the vacant line. The night porter consented to its use as a greeting. The registry kept the syllable ‘yes’ and used it as his signature. Your copy preserves the pause before the question."],
    negative: ["The first unprinted second", "On the reverse, before the first forecast, one unfiled impression survives. A spoon fell in the washroom. Three people heard it. No trial form had been opened for spoons. The machine’s perfect account begins one sound later."]
  };
  const sourceNames = {mic:"ceiling microphone",line:"line return",reel:"safety reel"};
  const singleReadings = {
    mic:"Air through a grille, then a latch falling. The microphone caught the hinge on the far door. Pick a second source to subtract.",
    line:"An even strike with a small scrape before it. Behind the last overtone comes a soft electrical tick. Pick a second source.",
    reel:"The spool is labelled INDEPENDENT. Scrape, strike, tick. A strip of red oxide has worn clean at the splice. Pick a second source."
  };
  const calls = {
    registry: {
      name:"Registry / Mrs Vale", first:"“I can read you the certificate. I have seven certificates here. Do you have a preference for the colour of the ink?”",
      questions:[["date","Ask about the date","“We date the observation to the seal. The carbon goes into the tray as soon as the forecast arrives. The room has five seconds to finish the paperwork.”"],["hand","Ask who signed","“E. Rowe, night porter. The signature is on file. We reproduce it here so he can stay on his rounds. No, the pen doesn’t leave this desk.”"]]
    },
    porter: {
      name:"Porter / E. Rowe", first:"“I can take a parcel round. I can come and fix a light. If it’s a question about the noise, the first thing is where did they say I was standing?”",
      questions:[["round","Ask about his rounds","“I was two floors down. A spoon hit the washroom floor. The woman rinsing cups laughed. Nobody came down with a clipboard for that.”"],["receipt","Ask what he signed","“I signed to say the bundle arrived. The lad held his thumb over the heading. He said the blank after my name was for the weight of the parcel.”"]]
    },
    vacant: {
      name:"Vacant / recorded line", first:"A relay closes. You hear a breath drawn through somebody else’s teeth. Then a voice says, “Yes.” The question begins after the answer.",
      questions:[["back","Read the relay plate","The service plate has been turned over. The new inscription reads CONSENT. Beneath it, the old letters still rise through the brass. GREETING."],["tail","Read the tape leader","“For the welcome message, Mr Rowe, may we record you saying yes?” A pause. The tape runs around a splice and the first second begins again."]]
    }
  };
  let state;
  function blankState() {
    return {wires:[], matched:false, cable:null, offset:0, face:"front", registered:false, archive:null, line:null, asked:new Set(), desk:null, notes:new Set()};
  }
  function press(selector, selected) {
    annex.querySelectorAll(selector).forEach(el => el.setAttribute("aria-pressed", String(selected(el))));
  }
  function record(key, flag) {
    if (state.notes.has(key)) return;
    state.notes.add(key);
    window.LimenCase?.grant(flag);
    appendNote(key);
  }
  function appendNote(key) {
    const [title, body] = documents[key];
    const note = document.createElement("details");
    const summary = document.createElement("summary");
    summary.textContent = title;
    const text = document.createElement("p");
    text.textContent = body;
    note.append(summary, text);
    find("annex-notes").append(note);
    find("annex-binder").hidden = false;
  }
  function receipt(id, text) {
    const line = find(id);
    line.hidden = false;
    line.textContent = text;
  }

  function waveform(source, x) {
    if (!source) return 0;
    if (source === "mic") {
      const click = x > .64 ? Math.exp(-55*(x-.64))*Math.sin((x-.64)*390) : 0;
      return click*.48 + .09*Math.sin(x*81)*Math.cos(x*319);
    }
    const delta = x-.34;
    const ring = delta>0 ? Math.min(1,delta*90)*Math.exp(-delta*7)*(Math.sin(delta*199)+Math.sin(delta*411)*.32) : 0;
    const scratch = Math.exp(-Math.abs(x-.284)*155)*Math.sin(x*627)*.38;
    return ring + scratch;
  }
  function drawSignal() {
    const canvas = find("annex-osc");
    const {width, height} = canvas.getBoundingClientRect();
    if (!width || !height) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.round(width*dpr), h = Math.round(height*dpr);
    if (canvas.width !== w || canvas.height !== h) {canvas.width=w; canvas.height=h;}
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
    ctx.strokeStyle="#869d813f";ctx.lineWidth=.65;ctx.beginPath();
    for(let x=0;x<=width;x+=width/16){ctx.moveTo(x,0);ctx.lineTo(x,height);}
    for(let y=0;y<=height;y+=height/6){ctx.moveTo(0,y);ctx.lineTo(width,y);}
    ctx.stroke();
    ctx.strokeStyle=state.wires.length ? "#ccdab1" : "#78816a";ctx.lineWidth=1.6;ctx.beginPath();
    for(let x=0;x<=width;x++){const u=x/width;const y=height*(.52-(waveform(state.wires[0],u)-waveform(state.wires[1],u))*.30);if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
    ctx.stroke();
  }
  function patchWire(key) {
    if (state.wires.includes(key)) state.wires = state.wires.filter(w=>w!==key);
    else state.wires = [...state.wires.slice(-1),key];
    const [a,b] = state.wires;
    const same = a && b && !state.wires.includes("mic");
    if(same) state.matched=true;
    press("[data-wire]",el=>state.wires.includes(el.dataset.wire));
    const meter = find("annex-meter");
    const reading = find("annex-wire-reading");
    if (!a) {meter.textContent="Unpatched"; reading.textContent="All three sockets bear the same acceptance stamp. Select a source to trace it.";}
    else if (!b) {meter.textContent="A / "+sourceNames[a]; reading.textContent=singleReadings[a];}
    else if (same) {
      meter.textContent="Residual / zero";
      reading.textContent="The strike vanishes down to the scrape. The line return and the safety reel contain the same samples. Two labels have been pasted onto one wire. You can feel their common sleeve beneath the bench.";
    } else {
      meter.textContent="Residual / present";
      reading.textContent="The door latch and the strike remain. The ceiling microphone heard the building. The other source heard a bell. Patch the line return against the safety reel to find the duplicate.";
    }
    find("annex-cable-file").hidden=!state.matched || Boolean(state.cable);
    drawSignal();
  }

  function updatePaper() {
    const reverse=state.face==="back";
    const target=reverse ? -5 : 5;
    const aligned=state.offset===target;
    const secretReady=reverse && aligned && Boolean(state.cable) && Boolean(state.desk) && !state.notes.has("negative");
    const stage=find("annex-paper-stage");
    stage.classList.toggle("is-reverse",reverse);
    stage.classList.toggle("is-aligned",aligned);
    stage.style.setProperty("--registration",(state.offset-target)*2.05+"px");
    find("annex-offset-output").textContent=(state.offset>0?"+":"")+state.offset+" s";
    find("annex-offset").setAttribute("aria-valuetext",(state.offset>0?"plus ":"")+state.offset+" seconds");
    press("[data-face]",el=>el.dataset.face===state.face);
    if(aligned && !reverse) state.registered=true;
    let reading;
    if(!reverse && aligned) reading="Both punctures make one star. The original and the duplicate bear the same B, struck by the pen five seconds before the microphone was opened.";
    else if(!reverse) reading="The observation was due five seconds after the forecast. On the front scale the later time is positive. Move the carbon until both crosses coincide.";
    else if(aligned && state.notes.has("negative")) reading=documents.negative[1];
    else if(secretReady) reading="The two holes admit one thread of light. The splice gives the interval. Rowe’s testimony identifies the unfiled sound. A third impression extends beyond the edge of the scale.";
    else if(aligned) reading="The reverse holds a third impression. Two annotations are missing from its margin. One concerns the wiring, the other the authority of the night witness.";
    else reading="Here the B opens to the left. On the back of the sheet every registration runs the other way. There is a faint mark one interval before zero.";
    find("annex-paper-reading").textContent=reading;
    find("annex-archive-file").hidden=!state.registered || Boolean(state.archive);
    find("annex-develop").hidden=!secretReady;
  }
  function updateDeskNotes() {
    const note=find("annex-desk-crossnote");
    const bits=[];
    if(state.cable==="remove") bits.push("The sleeve in your pocket clicks against the telephone as you lean in.");
    if(state.cable==="mark") bits.push("The extension list is written in the same red enamel as the sleeve you marked.");
    if(state.archive==="cover") bits.push("The desk blotter has a blank the size of your face sheet.");
    if(state.archive==="rubbing") bits.push("Your rubbing fits the indentation beneath the cradle.");
    note.hidden=!bits.length;
    note.textContent=bits.join(" ");
  }
  function answerLine(line, topic) {
    state.line=line;
    const call=calls[line];
    const question=topic && call.questions.find(q=>q[0]===topic);
    if (question) state.asked.add(topic);
    press("[data-line]",el=>el.dataset.line===line);
    find("annex-call-lamp").textContent="Line open / "+call.name.split(" / ")[0];
    find("annex-speaker").textContent=call.name;
    find("annex-answer").textContent=question ? question[2] : call.first;
    const prompts=find("annex-prompts");prompts.replaceChildren();
    for(const [key,label] of call.questions){
      const btn=document.createElement("button");btn.type="button";btn.dataset.topic=key;btn.textContent=label;
      btn.setAttribute("aria-pressed",String(key===topic));prompts.append(btn);
    }
    if(state.desk) return;
    const compare=state.asked.has("hand")&&state.asked.has("receipt");
    const recover=state.asked.has("tail")&&state.asked.has("receipt");
    if(compare || recover){
      const file=document.createElement("div");file.className="annex-file-options";
      if(compare) file.innerHTML+='<button type="button" data-desk-file="witnessed">Attach the porter’s testimony</button>';
      if(recover) file.innerHTML+='<button type="button" data-desk-file="suppressed">Preserve the uncut greeting</button>';
      prompts.append(file);
    } else if(question){
      const hint=document.createElement("p");hint.className="annex-line-hint";
      hint.textContent=line==="porter" ? "The Registry holds the specimen. The vacant line keeps its spoken equivalent." : "Rowe is still on the porter’s line. Ask him what he signed.";
      prompts.append(hint);
    }
  }
  annex.addEventListener("click", event=>{
    const button=event.target.closest("button");
    if(!button || !annex.contains(button)) return;
    const cmd=button.dataset;
    if(cmd.wire) patchWire(cmd.wire);
    if(cmd.cableFile && state.matched && !state.cable) {
      state.cable=cmd.cableFile;record(state.cable,"splice");find("annex-cable-file").hidden=true;
      receipt("annex-cable-receipt",documents[state.cable][1]);find("annex-cable-receipt").tabIndex=-1;find("annex-cable-receipt").focus({preventScroll:true});
      updatePaper();updateDeskNotes();
    }
    if(cmd.face) {state.face=cmd.face;updatePaper();}
    if(cmd.archiveFile && state.registered && !state.archive) {
      state.archive=cmd.archiveFile;record(state.archive,"carbon");
      receipt("annex-archive-receipt",documents[state.archive][1]);find("annex-archive-receipt").tabIndex=-1;find("annex-archive-receipt").focus({preventScroll:true});
      updatePaper();updateDeskNotes();
    }
    if(button.id==="annex-develop" && !button.hidden) {
      record("negative","negative");updatePaper();
      find("annex-paper-reading").tabIndex=-1;find("annex-paper-reading").focus({preventScroll:true});
    }
    if(cmd.line) {state.topic=null;answerLine(cmd.line);}
    if(cmd.topic) {state.topic=cmd.topic;answerLine(state.line,cmd.topic);annex.querySelector('[data-topic="'+cmd.topic+'"]').focus({preventScroll:true});}
    if(cmd.deskFile && !state.desk) {
      state.desk=cmd.deskFile;record(state.desk,"signature");
      const extra=state.cable ? " On the back of the archive sheet, register the interval before zero." : " The signature slip asks for the copper interval to be read backwards through the archive sheet.";
      receipt("annex-desk-receipt",documents[state.desk][1]+extra);
      find("annex-desk-receipt").tabIndex=-1;find("annex-desk-receipt").focus({preventScroll:true});
      answerLine(state.line);updatePaper();
    }
    persist();
  });
  function persist(){
    window.LimenCase.save("annex",{...state,asked:[...state.asked],notes:[...state.notes]});
  }
  find("annex-offset").addEventListener("input",event=>{state.offset=Number(event.target.value);updatePaper();persist();});
  function reset() {
    state=blankState();
    press("[data-wire],[data-line]",()=>false);
    find("annex-notes").replaceChildren();find("annex-prompts").replaceChildren();
    for(const id of ["annex-binder","annex-cable-file","annex-cable-receipt","annex-archive-receipt","annex-desk-receipt"]) find(id).hidden=true;
    find("annex-meter").textContent="Unpatched";
    find("annex-wire-reading").textContent="All three sockets bear the same acceptance stamp. Select a source to trace it.";
    find("annex-offset").value="0";
    find("annex-call-lamp").textContent="Line idle";
    find("annex-speaker").textContent="Exchange transcript";
    find("annex-answer").textContent="Pick up a line. Each call is transcribed onto the same roll.";
    drawSignal();updatePaper();updateDeskNotes();
  }
  reset();
  const saved=window.LimenCase.read("annex",null);
  if(saved && typeof saved==="object"){
    const savedWires=Array.isArray(saved.wires)?saved.wires.filter(w=>Object.hasOwn(sourceNames,w)).slice(0,2):[];
    state.matched=saved.matched===true;
    state.registered=saved.registered===true;
    state.face=saved.face==="back"?"back":"front";
    state.offset=Number.isFinite(saved.offset)?Math.min(8,Math.max(-8,saved.offset)):0;
    state.asked=new Set(Array.isArray(saved.asked)?saved.asked:[]);
    for(const [field,choices] of [["cable",["remove","mark"]],["archive",["cover","rubbing"]],["desk",["witnessed","suppressed"]]]){
      if(choices.includes(saved[field])){state[field]=saved[field];receipt("annex-"+field+"-receipt",documents[state[field]][1]);}
    }
    for(const w of savedWires)patchWire(w);
    for(const note of Array.isArray(saved.notes)?saved.notes:[]){
      if(Object.hasOwn(documents,note)&&!state.notes.has(note)){state.notes.add(note);appendNote(note);}
    }
    if(Object.hasOwn(calls,saved.line)){state.topic=saved.topic;answerLine(saved.line,saved.topic);}
    find("annex-cable-file").hidden=!state.matched||!!state.cable;
    find("annex-offset").value=String(state.offset);
    updatePaper();updateDeskNotes();
  }
  new ResizeObserver(drawSignal).observe(find("annex-osc"));
  window.addEventListener("limen:reset",reset);
})();
