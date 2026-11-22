"use strict";
(() => {
  const key="limen.oracle-one.casebook.v2";
  const fresh=()=>({flags:[],notes:{},verdict:"",history:[],role:"",lastPlace:"night-access",started:false});
  const evidence={
    splice:["Return splice","The signal has a route back to its own source."],
    carbon:["Pressure copy","Paper can record a sentence before the room supplies its sound."],
    signature:["Night signature","The correction passed through a human hand."],
    negative:["Reverse impression","The underside of the page kept a second history."],
    afterimage:["Contact print","An observer appears in the optical record."],
    "dead-air":["Leader strip","The recorder has an interval that the typed account omits."],
    palimpsest:["Pencil rubbing","An instruction survived under the amended entry."],
    ground:["Open circuit","The hearing has an independent return path."],
    counter:["Bound exception","A contradictory sample has a permanent place in the minutes."],
    jury:["Witness list","Separate voices can give separate statements."],
    hush:["Measured hush","An empty chair was allowed to testify in real time."]
  };
  const places=[
    ["instrument","Instrument drawing"],["technology","Listening room"],["field-notes","Field log"],["night-access","Staff entrance"],["west-annex","West annex"],["cable-room","Cable room"],["carbon-archive","Carbon archive"],["night-desk","Night desk"],["recursion","Feedback chamber"],["vigil","Night hearing"],["vigil-relay","Switchboard"],["vigil-tape","Cutting table"],["vigil-bench","Witness stand"],["vigil-minutes","Hearing minutes"],["witness","Last observation"]
  ];
  const mail={
    engineer:{label:"Service engineer",from:"M. Venn / plant maintenance",spot:"cable-room",lead:"Find the cable room",stamp:"23:48",title:"The red lead.",body:"I soldered a kink into the return line so I could identify it in the dark. Tonight I found the kink on the room microphone. Either somebody switched the labels or somebody switched the room. Start behind the panel. You can feel the join with your thumb.",reply:"Venn has folded the drawing around a little length of red wire. In the margin she has written “next time photograph the hands before the connections.”"},
    clerk:{label:"Records clerk",from:"E. Marr / duplicate office",spot:"carbon-archive",lead:"Find the duplicate office",stamp:"00:11",title:"The sheet underneath.",body:"When my mother made carbon copies she could tell which was first by running a thumbnail over the backs. The office says the two records are independent. Nobody who has handled both of them would say that. Borrow a lamp. I will explain the rest when you see the crease.",reply:"Marr returns a strip of carbon tucked inside the dispatch. Held at the right angle, the strip bears the pressure of somebody correcting your report before they received it."},
    observer:{label:"Relief observer",from:"I. Vale / night desk",spot:"night-desk",lead:"Find the night desk",stamp:"01:36",title:"Somebody answered.",body:"I rang down to the empty chamber after two. A woman answered and asked which version I wanted. The switchboard list has no extension there. I have worked here eleven years and the voice was my own, using the form of my surname I gave up before I started.",reply:"Vale encloses a torn page from the switchboard directory. Your reference tone is listed as an extension. The space where a number should go contains the time you finished reading."}
  };
  const hints=[
    "The optical plate has a reverse side. Printers read their layers backwards.",
    "A recording starts before its first audible event. Read the notes on its leader.",
    "Someone wrote a question diagonally across the field log. A low lamp brings out the pressure beneath it.",
    "The back of an archive sheet needs a calibration point. Ask the cable room about the interval and the night desk about the operator.",
    "At the hearing, try opening the return, preserving the blank and keeping a chair for someone who never arrived.",
    "The hardest record to erase is one held in several places. Bring the three early artifacts, the reverse impression and the hearing’s complete minutes to the final observation."
  ];
  let state=fresh(), storageWorks=true;
  try{
    const saved=JSON.parse(localStorage.getItem(key)||"null");
    if(saved && typeof saved==="object"){
      state={...state,...saved};
      state.flags=Array.isArray(saved.flags)?saved.flags.filter(f=>Object.hasOwn(evidence,f)):[];
      state.history=Array.isArray(saved.history)?saved.history.filter(f=>Object.hasOwn(window.LimenDispositions,f)):[];
      if(!state.notes||typeof state.notes!=="object"||Array.isArray(state.notes))state.notes={};
      if(!Object.hasOwn(mail,state.role))state.role="";
    }
  }catch{storageWorks=false;}
  let currentLeaf="places",hintIndex=0;
  const book=document.querySelector("#casebook-dialog");
  const textAt=(id,value)=>document.getElementById(id).textContent=value;
  const make=(tag,cls,words)=>{
    const element=document.createElement(tag);
    if(cls)element.className=cls;
    if(words!==undefined)element.textContent=words;
    return element;
  };
  const persist=()=>{try{localStorage.setItem(key,JSON.stringify(state));}catch{storageWorks=false;}};
  const eligible=id=>Object.hasOwn(window.LimenDispositions,id)&&window.LimenDispositions[id].needs.every(flag=>state.flags.includes(flag));
  function changed(flag){
    persist();showVerdicts();syncHeader();
    if(book.open)renderBook();
    window.dispatchEvent(new CustomEvent("limen:change",{detail:{flag,flags:[...state.flags]}}));
  }
  function showVerdicts(){
    const pane=document.querySelector("#dispositions");
    const holder=document.querySelector("#disposition-options");
    const available=Object.entries(window.LimenDispositions).filter(([id,s])=>s.needs.length && eligible(id));
    pane.hidden=!!ending||available.length===0;
    textAt("disposition-count",String(available.length));
    holder.replaceChildren();
    for(const [id,s] of available){
      const b=make("button","verdict-action");
      b.type="button";b.append(make("strong","",s.action),make("small","",s.needs.map(k=>evidence[k][0]).join(" · ")));
      b.addEventListener("click",()=>setEnding(id));holder.append(b);
    }
  }
  function syncHeader(){
    const late=document.getElementById("field-notes").getBoundingClientRect().top<window.innerHeight*.52;
    const active=late||state.started||state.flags.length>0;
    document.querySelector(".mast-cta").hidden=active;
    document.querySelector(".case-toggle").hidden=!active;
  }
  function renderMail(){
    const rack=document.getElementById("pass-rack");
    rack.replaceChildren();
    for(const [id,m] of Object.entries(mail)){
      const b=make("button","envelope");b.type="button";
      b.setAttribute("aria-pressed",String(id===state.role));
      b.append(make("span","mono",m.stamp+" / INTERNAL MAIL"),make("strong","",m.label),make("small","",m.from));
      b.addEventListener("click",()=>{state.role=id;state.started=true;renderMail();renderMorning();changed("correspondent");});rack.append(b);
    }
    const m=mail[state.role];document.getElementById("dispatch").hidden=!m;
    if(!m)return;
    textAt("dispatch-date","RECEIVED "+m.stamp);textAt("dispatch-title",m.title);textAt("dispatch-body",m.body);textAt("dispatch-sign",m.from);
    const link=document.getElementById("dispatch-route");link.href="#"+m.spot;link.textContent=m.lead;
  }
  function renderBook(){
    textAt("case-status",(state.role?mail[state.role].label:"Unassigned observer")+" · "+(storageWorks?"Saved in this browser":"Open for this visit"));
    document.querySelectorAll("[data-leaf]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.leaf===currentLeaf)));
    const leaf=document.getElementById("case-leaf");leaf.replaceChildren();
    if(currentLeaf==="places"){
      const all=ending?[...places,["morning-copy","Morning dispatch"]]:places;
      const bookmark=all.find(([id])=>id===state.lastPlace);
      if(bookmark){const jump=make("a","resume-place","Continue at "+bookmark[1].toLowerCase());jump.href="#"+bookmark[0];jump.addEventListener("click",()=>book.close());leaf.append(jump);}
      for(const [id,name] of all){
        const a=make("a","case-place");a.href="#"+id;a.append(make("span","",name));
        if(id===state.lastPlace)a.append(make("small","mono","BOOKMARK"));
        a.addEventListener("click",()=>book.close());leaf.append(a);
      }
      const toneButton=make("button","text-button","Change reference tone");toneButton.type="button";
      toneButton.addEventListener("click",()=>{book.addEventListener("close",()=>{showTone(material);openDialog(document.querySelector("#session-dialog"));},{once:true});book.close();});leaf.append(toneButton);
    }else if(currentLeaf==="evidence"){
      if(!state.flags.length)leaf.append(make("p","empty-leaf","The evidence sleeve is empty. Inspect the instrument, read the field log, or visit a room in the west annex."));
      for(const flag of state.flags){const item=make("div","evidence-slip");item.append(make("strong","",evidence[flag][0]),make("p","",evidence[flag][1]));leaf.append(item);}
    }else{
      leaf.append(make("p","empty-leaf",state.history.length+" of "+Object.keys(window.LimenDispositions).length+" endings filed across your visits. Reopen a decision in the morning dispatch to try another with the same evidence."));
      for(const id of state.history){const s=window.LimenDispositions[id];const item=make("details","evidence-slip");item.append(make("summary","",s.name),make("p","mono",s.label),...s.coda.map(line=>make("p","",line)));leaf.append(item);}
    }
    textAt("case-hint-text",hints[hintIndex%hints.length]);
  }
  function renderMorning(){
    const s=window.LimenDispositions[ending];
    const morning=document.getElementById("morning-copy");morning.hidden=!s;
    if(!s)return;
    textAt("morning-time",s.time);textAt("morning-title",s.codaTitle);
    const m=mail[state.notes.seal?.role??state.role];
    textAt("morning-recipient","TO / "+(m?m.from.toUpperCase():"UNASSIGNED NIGHT OBSERVER"));
    const body=document.getElementById("morning-body");body.replaceChildren(...s.coda.map(line=>make("p","",line)));
    const reply=document.getElementById("morning-reply");reply.replaceChildren();
    if(m)reply.append(make("span","mono","ENCLOSURE / "+m.label.toUpperCase()),make("p","",m.reply));
  }
  window.LimenCase={
    has:flag=>state.flags.includes(flag),
    grant(flag){
      if(!Object.hasOwn(evidence,flag)||state.flags.includes(flag))return false;
      state.flags.push(flag);state.started=true;changed(flag);toast("Filed · "+evidence[flag][0]);return true;
    },
    read:(name,fallback)=>Object.hasOwn(state.notes,name)?state.notes[name]:fallback,
    save(name,value){state.notes[name]=value;if(name==="annex"||name==="vigil")state.started=true;persist();syncHeader();},
    tone:()=>material, eligible,
    finish(id){if(state.verdict!==id||!state.notes.seal)state.notes.seal={role:state.role,flags:[...state.flags]};state.verdict=id;state.started=true;if(!state.history.includes(id))state.history.push(id);renderMorning();changed("verdict");},
    reopen(){state.verdict="";delete state.notes.seal;renderMorning();changed("reopened");},
    freshRun(){
      const history=[...state.history];state=fresh();state.history=history;hintIndex=0;currentLeaf="places";
      persist();window.dispatchEvent(new Event("limen:reset"));renderMail();renderMorning();showVerdicts();syncHeader();
    }
  };
  document.querySelectorAll("[data-leaf]").forEach(b=>b.addEventListener("click",()=>{currentLeaf=b.dataset.leaf;renderBook();}));
  document.querySelectorAll("[data-casebook]").forEach(b=>b.addEventListener("click",()=>{renderBook();openDialog(book);}));
  document.getElementById("case-next-hint").addEventListener("click",()=>{hintIndex++;textAt("case-hint-text",hints[hintIndex%hints.length]);});
  document.getElementById("reopen").addEventListener("click",()=>{resetEnding();document.getElementById("witness").scrollIntoView();document.getElementById("strike").focus({preventScroll:true});});
  document.getElementById("save-report").addEventListener("click",()=>{
    const s=window.LimenDispositions[ending];if(!s)return;
    const exhibits=state.notes.seal?.flags??state.flags;
    const report=["LIMEN INSTRUMENTS / WEST ANNEX",s.time+" — "+s.name,s.label,"",document.getElementById("filed-copy").textContent,"",s.codaTitle,...s.coda,"",document.getElementById("morning-reply").innerText,"","Evidence",...exhibits.map(k=>"• "+evidence[k][0])].join("\r\n");
    const url=URL.createObjectURL(new Blob([report],{type:"text/plain;charset=utf-8"}));const a=make("a");a.href=url;a.download="Limen-"+ending+"-record.txt";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);
  });
  let pending=false;
  function markPage(){
    pending=false;syncHeader();
    const band=window.innerHeight*.4;
    let here="";
    for(const [id] of places){
      const el=document.getElementById(id);if(!el)continue;
      const rect=el.getBoundingClientRect();
      if(rect.top<=band && rect.bottom>band)here=id;
    }
    if(here && here!==state.lastPlace){state.lastPlace=here;persist();}
  }
  window.addEventListener("scroll",()=>{if(!pending){pending=true;requestAnimationFrame(markPage);}},{passive:true});
  const savedTone=state.notes.reference;
  if(Object.hasOwn(materials,savedTone)){hasSession=true;material=savedTone;showTone(material);updateReference();}
  if(state.verdict&&eligible(state.verdict))setEnding(state.verdict,true);
  renderMail();renderMorning();showVerdicts();syncHeader();
})();
