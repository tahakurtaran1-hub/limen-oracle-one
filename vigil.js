/* The hearing is a physical record of the visitor's interventions. */
(() => {
  "use strict";
  const witness = document.getElementById("witness");
  if (!witness || document.getElementById("vigil")) return;
  const section = document.createElement("section");
  section.id = "vigil";
  section.setAttribute("aria-labelledby", "vigil-title");
  const fresh = () => ({relay:"", tape:"", bench:"", second:0, voice:"operator", wireMeter:false, carbonRub:false, payStub:false, seconds:0, hushed:false});
  let entry = fresh();
  const saved = window.LimenCase?.read?.("vigil", null);
  if (saved && typeof saved === "object") {
    const allowed = {relay:["","open","bridge"],tape:["","blank","patch"],bench:["","jury","oracle","empty"],voice:["operator","clerk","chair"]};
    for (const [key, choices] of Object.entries(allowed)) {
      if (choices.includes(saved[key])) entry[key] = saved[key];
    }
    if(Number.isInteger(saved.second) && saved.second >= 0 && saved.second <= 8) entry.second = saved.second;
    for (const key of ["wireMeter","carbonRub","payStub","hushed"]) entry[key] = saved[key] === true;
  }
  function persist(){window.LimenCase?.save?.("vigil",{...entry,seconds:0});}
  let clockTimer = 0;
  const has = key => Boolean(window.LimenCase?.has(key));
  const grant = key => { if (!has(key)) window.LimenCase?.grant(key); };
  const $ = s => section.querySelector(s);
  const $$ = s => Array.from(section.querySelectorAll(s));
  const set = (id, words) => { const el = $("#"+id); if(el.textContent !== words) el.textContent = words; };
  const svg = (view, label, drawing) => '<svg viewBox="' + view + '" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg">' + drawing + '</svg>';
  const caption = (tag, detail) => '<figcaption class="vg-figcaption"><span>'+tag+'</span><span>'+detail+'</span></figcaption>';
  const ticks = (n, make) => Array.from({length:n}, (_, i) => make(i)).join("");
  function relayDrawing() {
    const sockets = [[88,80],[88,178],[408,80],[408,178]].map(([x,y]) =>
      '<g stroke="#daac71" fill="#121811"><circle cx="'+x+'" cy="'+y+'" r="10"/><circle cx="'+x+'" cy="'+y+'" r="5"/><circle cx="'+x+'" cy="'+y+'" r="1.5" fill="#e5d7a9"/></g>').join("");
    return svg("0 0 500 253", "Wiring diagram of the room pickup, monitor, and a mechanical return switch",
      '<defs><pattern id="vg-grid" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M14 0H0v14" fill="none" stroke="#cad2ab" opacity=".12" stroke-width=".65"/></pattern></defs>'+
      '<rect width="500" height="253" fill="url(#vg-grid)"/><g fill="none" stroke="#899578" stroke-width="2"><path d="M88 80h99l20 18h74l19-18h108"/><path d="M88 178h101v-29h24m61 0h33v29h101"/></g>'+
      '<path class="vg-trace-feed" d="M88 178h101v-29h24l61 0h33v29h101" fill="none" stroke="#d7ac6f" stroke-width="3"/>'+
      '<g fill="none" stroke="#aea68b" stroke-width="1"><path d="M90 87v20h-26v55h26v12M407 88v17h29v55h-29v13" stroke-dasharray="3 4"/>'+
      '<path d="M204 93h79" stroke-dasharray="1 3"/><path d="M217 95q4-17 8 0t8 0t8 0t8 0t8 0t8 0t8 0"/></g>'+
      '<g fill="#bec3aa" font-family="monospace" font-size="12" text-anchor="middle"><text x="87" y="50">ROOM</text><text x="409" y="50">REGISTER</text><text x="88" y="213">ORACLE</text><text x="410" y="213">RETURN</text></g>'+
      '<g fill="#c79961"><circle cx="213" cy="149" r="4"/><circle cx="274" cy="149" r="4"/></g>'+
      '<g class="vg-arm" stroke="#d5b484" stroke-linecap="round"><path d="M213 149 272 123" stroke-width="5"/><circle cx="213" cy="149" r="3" fill="#574734"/></g>'+
      sockets+'<g fill="#c6bb98"><path d="M232 188h20m-16 4h12m-9 4h6" stroke="#ab9a78" fill="none"/></g>');
  }
  function tapeDrawing() {
    let waves = "";
    for(let i=0;i<266;i++) {
      const x=27+i*1.88, beat=Math.abs(Math.sin(i*.74)*Math.cos(i*.28));
      const h=4+(24+17*Math.sin(i*.046))*beat;
      if(x<260 || x>298) waves += '<path d="M'+x.toFixed(2)+' '+(85-h).toFixed(2)+'v'+(2*h).toFixed(2)+'"/>';
    }
    const teeth=ticks(44,i=>'<rect x="'+(8+i*12)+'" y="17" width="5" height="7" rx="1"/><rect x="'+(8+i*12)+'" y="146" width="5" height="7" rx="1"/>');
    const marks=ticks(9,i=>'<path d="M'+(28+i*61)+' 129v6"/><text x="'+(28+i*61)+'" y="182">'+i+'</text>');
    return svg("0 0 544 195","An eight-second stretch of recording tape. The center has a clean break under the fourth tick.",
      '<rect x="1" y="10" rx="4" width="542" height="153" fill="#332a21" stroke="#7c6b56"/><g fill="#161611">'+teeth+'</g><path d="M20 35h504M20 135h504" stroke="#afa783" stroke-width=".65"/>'+
      '<g fill="none" stroke="#c3a66c" stroke-width="1.5">'+waves+'</g><path d="M263 33 264 134h28l8-101z" fill="#d6c5a4" opacity=".82"/>'+
      '<g class="vg-patch-mark" stroke="#94543e" stroke-width="2"><path d="m259 65 31 38m-29-33 31 36m-25-39 28 35"/></g>'+
      '<g fill="#b8a98f" stroke="#b8a98f" stroke-width=".5" font-family="monospace" text-anchor="middle" font-size="12">'+marks+'</g>'+
      '<g id="vg-tape-head"><path d="m22 0 6 8 6-8z" fill="#f3d2a8"/><path d="M28 7v150" stroke="#edcea6" stroke-width="1.5"/></g>');
  }
  function benchDrawing() {
    const chair=(x,y,idx) =>
      '<g transform="translate('+x+' '+y+')" class="vg-chair vg-chair-'+idx+'">'+
      '<path d="m-42 62 78 13 56 62-85-21Z" fill="#090c09" opacity=".75"/>'+
      '<g stroke="#c6b99d" fill="none" stroke-linejoin="round"><path d="m-28-28 49-5 4 59-48 7z" fill="#35352c"/><path d="m-23 33 48-7 18 19-50 10z" fill="#4d493b"/>'+
      '<path d="m-27-28 8 109m40-114 9 105M-7 55l-1 33m50-43 2 34" stroke-width="2.3"/>'+
      ticks(7,i=>'<path d="m'+(-22+i*6)+' -22 3.7 45" opacity=".38" stroke-width=".8"/>')+'</g>'+
      '<ellipse class="vg-seat-mark" cx="3" cy="37" rx="14" ry="4" fill="#d4b475"/></g>';
    return svg("0 0 500 240", "Three empty chairs in the hearing room. Each chair casts a different shadow.",
      '<defs><radialGradient id="vg-light"><stop stop-color="#78705b" stop-opacity=".48"/><stop offset="1" stop-color="#25271f" stop-opacity="0"/></radialGradient></defs>'+
      '<ellipse cx="252" cy="142" rx="246" ry="104" fill="url(#vg-light)"/>'+
      '<g stroke="#a2987d" stroke-width=".6" opacity=".3">'+ticks(7,i=>'<path d="m'+(30+i*66)+' 198 90-157"/>')+'<path d="m23 171 453-40m-447 75 448-44m-424-14 405-35"/></g>'+
      chair(104,95,0)+chair(246,78,1)+chair(383,61,2)+
      '<g font-family="monospace" font-size="11" fill="#bcaf90" text-anchor="middle"><text x="104" y="216">OPERATOR</text><text x="246" y="207">COPY CLERK</text><text x="383" y="194">UNASSIGNED</text></g>');
  }
  section.innerHTML = `
    <div class="vg-wrap">
      <header class="vg-opening"><p class="vg-kicker">West annex / sealed proceedings</p>
        <h2 id="vigil-title">The night <em>hearing.</em></h2>
        <p>After the staff went home, a court was assembled from the furniture they left behind. The bell was called as a witness to its own ringing. You may examine the exhibits before it gives evidence.</p>
        <nav class="vg-directory" aria-label="Hearing rooms"><a href="#vigil-relay">Switchboard</a><a href="#vigil-tape">Cutting table</a><a href="#vigil-bench">Witness stand</a><a href="#vigil-minutes">Minutes</a></nav>
      </header>
      <article id="vigil-relay" class="vg-act">
        <header class="vg-act-head"><p class="vg-kicker">The switchboard</p><h3>Which wire gets<br>to <em>speak?</em></h3></header>
        <div class="vg-act-body"><p class="vg-voice">“Whenever the machine spoke, both needles moved. We took this for an agreement between two instruments.”</p><p class="vg-source">Deposition of the electrician</p>
          <p>The upper circuit carries the room. The lower carries Oracle’s voice back to the register. Someone used a wedding ring to close the return switch. There is an inscription inside the band. <em>Until one of us is right.</em></p>
          <figure class="vg-machine vg-switch">${relayDrawing()}${caption("Annex relay / cutaway","Contact C")}</figure>
          <div class="vg-controls" role="group" aria-label="Route the return signal"><button type="button" data-relay="open">Open the return</button><button type="button" data-relay="bridge">Bridge the monitor</button></div>
          <p class="vg-result" id="vg-relay-result" aria-live="polite"></p>
          <div class="vg-exhibit" id="vg-splice-exhibit"><p class="vg-kicker">Cross-examination / splice</p><p id="vg-splice-hint"></p><button type="button" data-extra="wireMeter" hidden>Test the third contact</button><div class="vg-evidence-note" id="vg-meter-note" hidden><strong>Continuity test · contact C</strong><p id="vg-meter-text"></p></div></div>
        </div>
      </article>
      <article id="vigil-tape" class="vg-act">
        <header class="vg-act-head"><p class="vg-kicker">The cutting table</p><h3>The missing<br><em>second.</em></h3></header>
        <div class="vg-act-body"><p class="vg-voice">“The report is exactly eight seconds long. The tape is exactly seven seconds long. I used a piece of my dinner receipt to make them the same.”</p><p class="vg-source">Deposition of the copy clerk</p>
          <p>Run the inspection head across the leader. The fourth tick falls on a pale piece of paper. The magnetic coating ends at one side and begins again at the other.</p>
          <figure class="vg-machine vg-cutting">${tapeDrawing()}${caption("Return reel / optical reader","Eight-second strip")}</figure>
          <label class="vg-slider" for="vg-scrub"><span>Inspection head</span><output id="vg-scrub-time" for="vg-scrub">0 s</output></label><input id="vg-scrub" type="range" min="0" max="8" step="1" value="0"><p id="vg-transcript" class="vg-transcript" aria-live="polite"></p>
          <div class="vg-controls" role="group" aria-label="Disposition of the recording"><button type="button" data-tape="blank">Bind the blank second</button><button type="button" data-tape="patch">Patch from yesterday</button></div>
          <p class="vg-result" id="vg-tape-result" aria-live="polite"></p>
          <div class="vg-exhibit"><p class="vg-kicker">Cross-examination / carbon</p><p id="vg-carbon-hint"></p><button type="button" data-extra="carbonRub" hidden>Lift the pressure marks</button><div class="vg-evidence-note" id="vg-carbon-note" hidden><strong>Reverse impression · dinner receipt</strong><p>Pressed into the paper from the other side are the words <em>ring when the ribbon stops.</em> The original order went to the furnace. The price of a bowl of soup is the only reason it survived.</p></div></div>
        </div>
      </article>
      <article id="vigil-bench" class="vg-act">
        <header class="vg-act-head"><p class="vg-kicker">The witness stand</p><h3>A mouth<br>for the <em>room.</em></h3></header>
        <div class="vg-act-body"><p class="vg-voice">“There are three chairs. We have budget for two witnesses. The third chair belongs to what actually happened.”</p><p class="vg-source">Handwritten rule inside the clerk’s cuff</p>
          <figure class="vg-machine vg-benches">${benchDrawing()}${caption("Seating plan / west wall","Third chair unassigned")}</figure>
          <p>Read the statements left under the seats, then decide whom the court should hear.</p>
          <div class="vg-tabs" role="group" aria-label="Read a witness statement"><button type="button" data-voice="operator">Operator</button><button type="button" data-voice="clerk">Copy clerk</button><button type="button" data-voice="chair">Third chair</button></div>
          <blockquote class="vg-deposition" id="vg-deposition" aria-live="polite"></blockquote>
          <div class="vg-controls" role="group" aria-label="Seat the hearing"><button type="button" data-bench="jury">Call the operators</button><button type="button" data-bench="oracle">Seat Oracle twice</button><button type="button" data-bench="empty">Reserve the empty chair</button></div><p class="vg-result" id="vg-bench-result" aria-live="polite"></p>
          <div class="vg-exhibit"><p class="vg-kicker">Cross-examination / signature</p><p id="vg-signature-hint"></p><button type="button" data-extra="payStub" hidden>Compare the wage slips</button><div class="vg-evidence-note" id="vg-wage-note" hidden><strong>Payroll counterfoil · second witness</strong><p>The operator and the copy clerk signed with opposite hands. The blot on the second signature is the first signature folded shut. Both men drew pay. Only one man bought dinner.</p></div></div>
        </div>
      </article>
      <section id="vigil-minutes" class="vg-minutes" aria-labelledby="vg-minutes-title">
        <div class="vg-minutes-head"><p class="vg-kicker">Counterfoil / keep with file</p><h3 id="vg-minutes-title">Minutes of the <em>hearing.</em></h3><p>The court stamps the order you leave on each instrument. The pressure reaches the last sheet.</p></div>
        <dl class="vg-ledger"><div><dt>Return circuit</dt><dd id="vg-ledger-relay"></dd></div><div><dt>Recording</dt><dd id="vg-ledger-tape"></dd></div><div><dt>Attendance</dt><dd id="vg-ledger-bench"></dd></div></dl>
        <details class="vg-margin"><summary>Pencil in the binding</summary><p>Open the return. Bind the missing second at its own tick. Keep the unassigned seat empty. If all three are entered together, the minutes can take four seconds of testimony directly from the room.</p></details>
        <div class="vg-quiet" id="vg-quiet" hidden><p class="vg-kicker">Supplement / room channel</p><p id="vg-quiet-text" aria-live="polite"></p><div class="vg-silence-meter" aria-hidden="true"><i></i><i></i><i></i><i></i></div><button type="button" id="vg-observe">Observe four seconds</button></div>
      </section>
    </div>`;
  witness.before(section);

  const relayReport = {
    "":"The ring rests loose between the contacts. The clerk is waiting for your order.",
    open:"The return needle falls. The room needle stays still. For the first time tonight the two needles disagree without anybody losing their job.",
    bridge:"The ring warms. Both needles rise in perfect agreement. On the sheet, the clerk enters two independent witnesses."
  };
  const tapeReport = {
    "":"The disposition line is blank. To bind the missing second, park the inspection head on the paper splice.",
    blank:"The paper is stitched into the master as a blank. Its four edges remain visible. A reviewer will have to count the absence by hand.",
    patch:"Yesterday fits. Even the little catching noise at the end of the strike fits. Tomorrow the same catching noise will be called a property of brass."
  };
  const benchReport = {
    "":"The register has three seats and a single pen.",
    jury:"The operators sit apart. The clerk has to begin a new line for the hand, another for its instruction, and a third for the sound.",
    oracle:"The first Oracle swears the second Oracle is reliable. The second Oracle supplies the date. One visitor takes both coats at the door.",
    empty:"The seat remains assigned to the room. A clerk draws an empty pair of brackets where the witness should sign."
  };
  const snippets = [
    "Room tone. A loose thread brushes the microphone cloth.",
    "The operator removes his cuff link and places it in his pocket.",
    "Relay A closes. A far-off nail catches against brass.",
    "The copy clerk unwinds enough tape for a single strike.",
    "Paper splice. No oxide, no waveform. You can see the price of soup through the back.",
    "The recording resumes mid-decay. The start of the sound belongs to another reel.",
    "A chair leg scrapes. Somebody has already stood up.",
    "The report calls the room empty. The chair settles on three feet.",
    "End leader. The final hole is square, punched by hand."
  ];
  const formatSel = (key, value) => $$("[data-"+key+"]").forEach(el => el.setAttribute("aria-pressed", String(el.dataset[key] === value)));
  const listEntries = {
    relay: { "":"Awaiting routing","open":"Open circuit. Room pickup isolated.","bridge":"Closed circuit. Two matching traces."},
    tape: { "":"Unexamined reel","blank":"One second bound as missing.","patch":"Yesterday’s strike entered as today’s."},
    bench: { "":"Court unseated","jury":"Operator testimony admitted.","oracle":"Oracle called as its own corroborating witness.","empty":"Third chair reserved. Signature [          ]."}
  };
  const exhibits = [
    {key:"splice", bit:"wireMeter", hint:"splice", note:"meter", missing:"A third test contact sits under the switch. The cable-room splice fits its narrow socket.", found:"The splice you brought fits the unlabelled contact beneath the register."},
    {key:"carbon", bit:"carbonRub", hint:"carbon", note:"carbon", missing:"The receipt is covered in shallow grooves. A carbon sheet from the archive could lift the old writing.", found:"Your carbon sheet will make a rubbing of the pressure marks under the splice."},
    {key:"signature", bit:"payStub", hint:"signature", note:"wage", missing:"Two wage slips have been pinned face down. The signed night-desk register is needed for comparison.", found:"Your signed register carries the same violet blot as both wage slips."}
  ];
  const quietReady = () => entry.relay==="open" && entry.tape==="blank" && entry.bench==="empty";
  function stopClock() {
    if(clockTimer) window.clearInterval(clockTimer);
    clockTimer = 0;
    entry.seconds = 0;
  }
  function renderQuiet() {
    if(!quietReady() && !entry.hushed) stopClock();
    $("#vg-quiet").hidden = !quietReady() && !entry.hushed;
    const words = entry.hushed ? "Four seconds entered without a strike. On the last sheet the clerk has written, in the space for a name, “Present.” The room has been accepted as a witness." :
      clockTimer ? (entry.seconds===0 ? "The clerk sets the pen down." : "Room channel open. "+entry.seconds+" of 4 seconds observed.") :
        "The register has space for a duration. Let the whole measure pass before the clerk closes it.";
    set("vg-quiet-text", words);
    $$(".vg-silence-meter i").forEach((el,i) => el.classList.toggle("vg-lit",entry.hushed || i < entry.seconds));
    $("#vg-observe").hidden = entry.hushed;
    $("#vg-observe").textContent = clockTimer ? "Cancel observation" : "Observe four seconds";
  }
  function render() {
    Object.keys(listEntries).forEach(key => {
      set("vg-ledger-"+key, listEntries[key][entry[key]]);
      section.dataset[key]=entry[key];
      formatSel(key, entry[key]);
    });
    formatSel("voice", entry.voice);
    section.dataset.voice = entry.voice;
    set("vg-relay-result",relayReport[entry.relay]);
    set("vg-tape-result",tapeReport[entry.tape]);
    set("vg-bench-result",benchReport[entry.bench]);
    $("#vg-scrub").value=String(entry.second);
    $("#vg-scrub").setAttribute("aria-valuetext",entry.second+" seconds. "+snippets[entry.second]);
    $("#vg-tape-head").setAttribute("transform","translate("+(61*entry.second)+" 0)");
    set("vg-scrub-time",entry.second+" s");
    set("vg-transcript",snippets[entry.second]);
    const statements={
      operator:entry.relay==="open" ? "“I pulled the lead and the needle stopped. I kept my fingers there a long time. In the morning the forecast included a small warm patch on the cable.”" :
        entry.relay==="bridge" ? "“My instruction was to keep the two needles in agreement. The wedding ring was mine. It could have been anything that conducts.”" :
        "“The lamp came on before I struck the bell. When they asked what the lamp meant, I said it meant I should strike the bell.”",
      clerk:entry.tape==="blank" ? "“I tried to give the blank a number. The index asked me for a noise. I wrote down the little tearing sound my pencil made in the paper.”" :
        entry.tape==="patch" ? "“You have my restoration. The little scrape in the margin comes from yesterday’s cuff link. If it turns up again tomorrow, please send the cuff link my regards.”" :
        "“Nobody said to change what happened. They said to make certain what happened would fit through the rollers.”",
      chair:"There is a ring of varnish where a glass once stood. Under the seat a child has printed an instruction in blue pencil. LEAVE A PLACE FOR SOMETHING THAT CAN DISAGREE."
    };
    set("vg-deposition",statements[entry.voice]);
    for(const e of exhibits) {
      const unlocked=has(e.key);
      set("vg-"+e.hint+"-hint",unlocked ? e.found : e.missing);
      const button=$('[data-extra="'+e.bit+'"]');
      button.hidden=!unlocked;
      button.setAttribute("aria-expanded", String(entry[e.bit] && unlocked));
      button.setAttribute("aria-controls","vg-"+e.note+"-note");
      $("#vg-"+e.note+"-note").hidden=!(unlocked && entry[e.bit]);
    }
    set("vg-meter-text",entry.relay==="open" ? "The socket reads open. A second pair of initials is scratched underneath: the electrician who broke the circuit before you. Their report is missing from the file." :
      entry.relay==="bridge" ? "The open coil reads zero ohms. The brass ring is bypassing the room entirely. On the inside someone has scratched a date two days before the first prediction." :
        "The meter sits between zero and infinity. Operate the switch with the lead attached to follow the change at contact C.");
    renderQuiet();
  }
  $("#vg-scrub").addEventListener("input",event => {entry.second=Number(event.target.value);persist();render();});
  section.addEventListener("click",event => {
    const button=event.target.closest("button");
    if(!button || !section.contains(button)) return;
    const d=button.dataset;
    if(d.relay) {entry.relay=d.relay;if(d.relay==="open") grant("ground");}
    if(d.tape) {
      if(d.tape==="blank" && entry.second!==4) {
        set("vg-tape-result","The needle is over coated tape. Move the inspection head to the paper under the fourth tick, then bind it.");
        $("#vg-scrub").focus({preventScroll:true});
        return;
      }
      entry.tape=d.tape;if(d.tape==="blank") grant("counter");
    }
    if(d.bench) {entry.bench=d.bench;if(d.bench==="jury") grant("jury");}
    if(d.voice) entry.voice=d.voice;
    if(d.extra) {
      const e=exhibits.find(item=>item.bit===d.extra);
      if(e && has(e.key)) entry[e.bit]=!entry[e.bit];
    }
    if(button.id==="vg-observe") {
      if(clockTimer) stopClock();
      else if(quietReady() && !entry.hushed) {
        entry.seconds=0;
        clockTimer=window.setInterval(()=>{
          entry.seconds++;
          if(entry.seconds>=4) {
            stopClock(); entry.hushed=true; grant("hush");persist();
            $("#vg-quiet-text").setAttribute("tabindex","-1");
            if(document.activeElement===button) $("#vg-quiet-text").focus({preventScroll:true});
          }
          renderQuiet();
        },1000);
      }
    }
    persist();render();
  });
  window.addEventListener("limen:change",render);
  window.addEventListener("limen:reset",()=>{stopClock();entry=fresh();$("#vigil-minutes details").open=false;render();});
  document.addEventListener("visibilitychange",()=>{if(document.hidden && clockTimer){stopClock();renderQuiet();}});
  if("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observed=new IntersectionObserver(entries=>{
      for(const item of entries) if(item.isIntersecting){item.target.classList.add("vg-in-view");observed.unobserve(item.target);}
    }, {threshold:.09});
    $$(".vg-act").forEach(el=>observed.observe(el));
  }
  render();
})();
