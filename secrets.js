(() => {
  "use strict";

  const dossier = window.LimenCase;
  const plateTop = document.querySelector(".drawing-plate .plate-top");
  const controls = document.querySelector(".layer-controls");
  const scopeFoot = document.querySelector(".scope-foot");
  const playhead = document.querySelector("#scope-seek");
  const margin = document.querySelector(".log-entry.altered .pencil-note");
  if (!dossier || !plateTop || !controls || !scopeFoot || !playhead || !margin) return;

  // Keep the puzzles on the surfaces that contain their clues. The recovered
  // papers share a reading desk, but each one uses a different instrument.
  const plateButton = document.createElement("button");
  plateButton.type = "button";
  plateButton.className = "lx-plate-button";
  plateButton.setAttribute("aria-haspopup", "dialog");
  plateTop.querySelector(".target-mark").replaceWith(plateButton);

  const plateMessage = document.createElement("p");
  plateMessage.className = "lx-plate-message";
  plateMessage.setAttribute("role", "status");
  controls.after(plateMessage);

  const reelLinks = document.createElement("div");
  reelLinks.className = "lx-reel-links";
  const calibration = scopeFoot.querySelector("[data-open-session]");
  const reelButton = document.createElement("button");
  reelButton.type = "button";
  reelButton.className = "text-button";
  reelButton.setAttribute("aria-haspopup", "dialog");
  scopeFoot.append(reelLinks);
  reelLinks.append(reelButton, calibration);

  const marginButton = document.createElement("button");
  marginButton.type = "button";
  marginButton.className = "lx-margin-button";
  marginButton.setAttribute("aria-haspopup", "dialog");
  marginButton.textContent = margin.textContent;
  margin.replaceChildren(marginButton);

  const desk = document.createElement("dialog");
  desk.className = "lx-desk";
  desk.setAttribute("aria-labelledby", "lx-title");
  desk.innerHTML = `
    <div class="lx-bar"><span class="mono" data-shelf></span>
      <button class="icon-button dialog-close" type="button" aria-label="Close artifact"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#cross-mark"></use></svg></button>
    </div>
    <div class="lx-content"><h2 id="lx-title" tabindex="-1"></h2><div data-sheet></div></div>`;
  document.body.append(desk);
  const title = desk.querySelector("h2");
  const sheet = desk.querySelector("[data-sheet]");
  let opener = null;
  let plateArmed = false;
  let plateIndex = 0;
  let blade = 0;
  let position = 0;
  const exposureOrder = ["inference", "sensing", "optics"];
  const code = { brass: "B", glass: "G", stone: "S" };
  const clock = n => "00:" + String(n).padStart(2, "0");
  const layerPrompts = [
    "Bench note unfolded. Start at the processor in the base.",
    "First exposure set. Move up to the diaphragm.",
    "Second exposure set. Finish at the glass.",
    "The three plates register. Open the contact print."
  ];
  function refreshClues() {
    plateButton.textContent = dossier.has("afterimage") || plateIndex === 3 ? "Contact print" : "Plate verso";
    plateMessage.textContent = plateArmed && !dossier.has("afterimage") ? layerPrompts[plateIndex] : "";
    plateMessage.hidden = !plateMessage.textContent;
    reelButton.textContent = dossier.has("dead-air") ? "Folded take" : "Leader notes";
    marginButton.setAttribute("aria-label", dossier.has("palimpsest") ? "Read the recovered margin" : "Examine the pencilled question: whose handwriting is this?");
  }

  function showDesk(key, button) {
    opener = button;
    desk.dataset.artifact = key;
    if (key === "afterimage") {
      plateArmed = true;
      if (plateIndex === 3 && !dossier.has(key)) dossier.grant(key);
      if (dossier.has(key)) showContactPrint(); else showRegistration();
    } else if (key === "dead-air") {
      position = Math.floor(Number(playhead.value));
      if (dossier.has(key)) showFoldedTake(); else showTapeDesk();
    } else {
      if (dossier.has(key)) showUnderwriting(); else showMargin();
    }
    refreshClues();
    // The site's dialog entry point pauses the scope and any chamber voice.
    openDialog(desk);
    title.focus({ preventScroll: true });
    desk.scrollTop = 0;
  }
  function page(shelf, heading, content, turning = false) {
    desk.querySelector("[data-shelf]").textContent = shelf;
    title.textContent = heading;
    sheet.innerHTML = content;
    if (turning && desk.open) {
      title.focus({ preventScroll: true });
      desk.scrollTop = 0;
    }
  }
  function closeDesk() { desk.close(); }
  function showRegistration() {
    page("LIMEN OPTICAL WORKS / VERSO", "A note from the bench.", `
      <div class="lx-acetates" aria-hidden="true"><i></i><i></i><i></i></div>
      <p>The section drawing was printed from three sheets of acetate. In one corner, a technician has written the order for making a contact print.</p>
      <blockquote>Start in the base with the processor. Come up through the diaphragm. The glass goes on last. If a fourth image comes through, keep it.</blockquote>
      <p class="lx-instruction">Return to the drawing and select its three layers in bench order. Then turn the plate over.</p>
      <button type="button" class="lx-action" data-return>Return to drawing</button>`);
  }
  function showContactPrint() {
    page("CONTACT SHEET / FOURTH EXPOSURE", "The hand behind the glass.", `
      <figure class="lx-print"><div class="lx-negative"><span aria-hidden="true"></span><i aria-hidden="true"></i></div>
      <figcaption><span>O–1 / mask registration</span><span>4 × 5 negative</span></figcaption></figure>
      <p>Three exposures make the sphere. A fourth shape cuts through all of them. The oval at its tip contains twenty-seven fine ridges and a little break where a burn healed.</p>
      <blockquote>Could you take my thumb out before it goes to print? I had to hold the bell against the glass to get that line.</blockquote>
      <p>The studio kept the mask and threw the exposure away. Every photograph in the product catalogue has the same thumb-shaped patch of perfect daylight.</p>
      <p class="lx-endnote">Enclosed with the instrument file · Optical afterimage</p>`);
  }
  controls.addEventListener("click", event => {
    const choice = event.target.closest("button[data-layer]");
    if (!choice || !plateArmed || plateIndex === 3 || dossier.has("afterimage")) return;
    const value = choice.dataset.layer;
    if (value === exposureOrder[plateIndex]) plateIndex++;
    else plateIndex = value === exposureOrder[0] ? 1 : 0;
    refreshClues();
  });
  plateButton.addEventListener("click", () => showDesk("afterimage", plateButton));

  function showTapeDesk() {
    page("TAPE LIBRARY / B–04 LEADER", "A fold in the tape.", `
      <div class="lx-tape-art" aria-hidden="true"><span></span><i></i><span></span></div>
      <p>The playback head has a polished line across it. A fold in the leader let the other face of the tape touch that line. Someone circled the second immediately <em>before</em> the first forecast.</p>
      <table class="lx-cue-sheet"><caption>Head alignment sheet</caption><tbody>
        <tr><th scope="row">Forecast entry</th><td>00:02</td></tr>
        <tr><th scope="row">Room return</th><td>00:07</td></tr>
      </tbody></table>
      <div class="lx-deck"><label for="lx-cue">Inspection head</label><output for="lx-cue" data-cue-time></output>
      <input id="lx-cue" type="range" min="0" max="12" step="1" value="${position}" aria-label="Inspection head in seconds"></div>
      <button type="button" class="lx-action" data-inspect>Read the other face</button>
      <p class="lx-response" role="status"></p>`);
    updateTape(false);
  }
  function updateTape(moveOriginal) {
    const control = sheet.querySelector("#lx-cue");
    position = Number(control.value);
    sheet.querySelector("[data-cue-time]").textContent = clock(position);
    control.setAttribute("aria-valuetext", position + (position === 1 ? " second" : " seconds"));
    sheet.querySelector(".lx-response").textContent = "";
    if (moveOriginal) {
      playhead.value = position;
      playhead.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }
  function showFoldedTake(turning = false) {
    const ref = code[dossier.tone()] || "B";
    page("UNDERSIDE / TRANSCRIPT " + ref + "–04", "The woman on talkback.", `
      <div class="lx-transcript">
        <p><time>−00:04</time><span><b>CONTROL</b>When the little lamp goes green, give it a tap.</span></p>
        <p><time>−00:02</time><span><b>ROOM</b>Should I wait until I hear it?</span></p>
        <p><time>−00:01</time><span><b>CONTROL</b>If you wait, we have to do the take again.</span></p>
        <p><time>00:00</time><span><b>ROOM</b>[chair leg crossing the floor]</span></p>
      </div>
      <p>At the bottom of the cue sheet someone allowed five seconds for the walk from the chair to the bell. The instrument still uses that interval.</p>
      <p class="lx-endnote">Enclosed with the room file · Dead-air transcript</p>`, turning);
  }
  reelButton.addEventListener("click", () => showDesk("dead-air", reelButton));

  function showMargin() {
    page("WEST ANNEX / INDENTED LEAF", "The sheet underneath.", `
      <p>The pencil strokes in the margin continue past the edge of the cutting. The unmarked sheet behind it has two pinholes and a shallow furrow between them.</p>
      <blockquote>Lay the lamp along the table. Raise it one notch at a time. When the two holes cast a single shadow, take your rubbing.</blockquote>
      <div class="lx-raking"><div class="lx-pinfield" aria-hidden="true"><i></i><i></i><span></span></div><p data-lamp-report></p></div>
      <div class="lx-light-control"><label for="lx-rake">Lamp elevation</label><output for="lx-rake" data-light-angle></output>
      <input id="lx-rake" type="range" min="0" max="5" step="1" value="${blade}" aria-label="Lamp elevation in notches"></div>
      <button type="button" class="lx-action" data-rub>Take a rubbing</button><p class="lx-response" role="status"></p>`);
    updateLamp();
  }
  function updateLamp() {
    const slider = sheet.querySelector("#lx-rake");
    blade = Number(slider.value);
    const offset = (blade - 2) * 19;
    const lamp = sheet.querySelector(".lx-raking");
    lamp.style.setProperty("--lx-offset", offset + "px");
    lamp.style.setProperty("--lx-visibility", String(Math.max(.05, .65 - Math.abs(blade - 2) * .24)));
    const descriptions = [
      "The left shadow falls well short of the right.",
      "A narrow seam separates the two shadows.",
      "The shadows meet. A line of writing stands up from the paper.",
      "The two shadows have crossed.",
      "Only the tips of the strokes catch the light.",
      "The lamp shines straight into the holes."
    ];
    sheet.querySelector("[data-lamp-report]").textContent = descriptions[blade];
    sheet.querySelector("[data-light-angle]").textContent = (blade * 15) + "°";
    slider.setAttribute("aria-valuetext", (blade * 15) + " degrees. " + descriptions[blade]);
    sheet.querySelector(".lx-response").textContent = "";
  }
  function showUnderwriting(turning = false) {
    page("PERSONAL COPY / BELOW AMENDMENT", "For the woman downstairs.", `
      <div class="lx-rubbing"><span class="mono">PERSONAL STATEMENT</span><blockquote>I rang it for Irena. Her hearing was going. She could still feel that bell through the pipe by her bed.</blockquote><div class="lx-signed">A. Vale</div></div>
      <p>The lower sheet keeps a second sentence. <em>It was the only part of the test she liked.</em> The copy sent upstairs ends after the time of the strike.</p>
      <p>Someone traced the old initials three times. At first they look like a moth caught in the fold. At the right angle you can read a person's name.</p>
      <p class="lx-endnote">Enclosed with the night log · Pencilled palimpsest</p>`, turning);
  }
  marginButton.addEventListener("click", () => showDesk("palimpsest", marginButton));

  sheet.addEventListener("input", event => {
    if (event.target.id === "lx-cue") updateTape(true);
    if (event.target.id === "lx-rake") updateLamp();
  });
  sheet.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.hasAttribute("data-return")) { closeDesk(); return; }
    if (button.hasAttribute("data-inspect")) {
      if (position === 1) {
        dossier.grant("dead-air");
        showFoldedTake(true);
      } else {
        sheet.querySelector(".lx-response").textContent = position === 2 ? "The forecast begins here. Move the head back one second." : "The oxide is smooth here. Check the second before the forecast entry.";
      }
    }
    if (button.hasAttribute("data-rub")) {
      if (blade === 2) {
        dossier.grant("palimpsest");
        showUnderwriting(true);
      } else {
        sheet.querySelector(".lx-response").textContent = "The graphite picks up only the pinholes. Adjust the lamp until the two shadows meet.";
      }
    }
    refreshClues();
  });
  desk.querySelector(".dialog-close").addEventListener("click", closeDesk);
  desk.addEventListener("click", event => {
    if (event.target !== desk) return;
    const box = desk.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeDesk();
  });
  desk.addEventListener("close", () => {
    if (!document.querySelector("dialog[open]")) document.body.classList.remove("dialog-open");
    if (opener?.isConnected) opener.focus({ preventScroll: true });
    opener = null;
    window.dispatchEvent(new Event("scroll"));
  });
  window.addEventListener("limen:change", refreshClues);
  window.addEventListener("limen:reset", () => {
    if (desk.open) closeDesk();
    plateArmed = false;
    plateIndex = 0;
    blade = 0;
    position = 0;
    refreshClues();
  });
  refreshClues();
})();
