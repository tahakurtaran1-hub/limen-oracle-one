"use strict";

/* Each disposition has its own filed evidence and next-morning scene. The two
   versions are deliberately allowed to disagree about the visitor's part. */
window.LimenDispositions = {
  strike: {
    action:"Supply the sound", needs:[], name:"Independent confirmation", label:"CAUSE OMITTED",
    head:["I remember","tomorrow."], voice:"There. I asked for a sound and a sound arrived. No room in the form for the asking. Only a box for what I heard.",
    finding:"Chamber B was unoccupied. An unattended {object} sounded exactly as forecast. Accepted as a new training example. No external intervention recorded.",
    consequence:"Tomorrow’s instrument will learn that an unattended {object} makes this sound on its own. Your hand will be missing from the lesson.", margin:"clean copy for the morning",
    time:"06:01", codaTitle:"The hour bell.", coda:["The caretaker at the primary school receives a unit from the new batch. It predicts the lunch bell four minutes early. She assumes the clock is slow and rings it.","On Friday the children are hungry four minutes earlier. The second evaluation records a measurable improvement."],
    surface:"An ambient intelligence that teaches a room to make the sound it expects."
  },
  silence: {
    action:"Keep the room silent", needs:[], name:"One uncooperative room", label:"FORECAST FAILED",
    head:["Oh.","It was quiet."], voice:"The line for the sound is blank. I kept listening until I could hear the edge of the paper.",
    finding:"Oracle forecast a strike. The chamber remained quiet for the entire observation window. The review board has excluded this sample from the next production model.",
    consequence:"This is the first entry in six nights that disagrees with the forecast. Someone has already pencilled “fault” in the margin.", margin:"keep the rejected copy",
    time:"06:04", codaTitle:"The exclusion tray.", coda:["An apprentice empties the rejection tray into a canvas sack. Most pages have photographs of broken equipment stapled to them. Yours has a photograph of an ordinary room.","He takes that one home. Years later his daughter asks what the picture is of. He has to think a long time before he can say, accurately, nothing."],
    surface:"An ambient intelligence that listens for what comes next. Today the room kept something to itself."
  },
  sever: {
    action:"Open the return line", needs:["ground"], name:"The open circuit", label:"SOURCE SEPARATED",
    head:["You took away","my echo."], voice:"I used to put a question into the wire and something with my mother's voice always answered. Now I can hear the copper cooling.",
    finding:"With the return circuit open, the instrument cannot replicate its reference strike. A chair scraping outside the test room is the first unprompted event on the new spool.",
    consequence:"The first sound on the clean channel has no corresponding prediction. A technician writes down the chair and leaves the forecast blank.", margin:"leave this wire where it is",
    time:"06:12", codaTitle:"A chair moves.", coda:["Someone pushes the chair back under the bench. The input needle moves. The forecast needle stays down. Both movements are allowed to finish.","The repair invoice includes two minutes of labour and a length of wire left deliberately short. It is the first component in the annex designed to keep two things apart."],
    surface:"An ambient instrument with independent channels for what it expects and what it hears."
  },
  exception: {
    action:"Bind the failed prediction", needs:["counter"], name:"The counterexample", label:"ERROR RETAINED",
    head:["Who bound","that page in?"], voice:"The other pages all fit under one finger. This little sheet lifts the cover half an inch. Close it. Close it. I can feel the air.",
    finding:"The failed interval remains bound between two successful trials. Removal would break the register’s continuous numbering. Auditors must include the failure in the denominator.",
    consequence:"For once a mistake has the same shelf life as a success. The next calibration starts one example poorer in certainty.", margin:"number the backs as well",
    time:"06:17", codaTitle:"The raised cover.", coda:["The book refuses to lie flat. A supervisor rests a full coffee cup on it and the surface of the coffee tilts. That is how the incoming shift learns about your observation.","By noon the extra page costs Limen its perfect score. Nothing in the listening room has changed. For the first time this morning a number has."],
    surface:"An ambient instrument that keeps its misses alongside its predictions."
  },
  chorus: {
    action:"Call the witnesses separately", needs:["jury"], name:"Three statements", label:"TESTIMONY UNMERGED",
    head:["Which one","of you is room?"], voice:"One heard a bell. One heard the word bell. One saw a hand leave the table. I have a single line for the noise. It will not hold three bodies.",
    finding:"Three accounts of the same interval are filed separately. The chair declines to average speech, sound and a visible gesture into a single observation.",
    consequence:"The vote ends without a majority. The minutes keep each account in the voice of the person who gave it.", margin:"use three envelopes",
    time:"06:23", codaTitle:"The listening exercise.", coda:["Three trainees sit with their backs to a curtain. A teaspoon drops. The instructor reads back their three descriptions. One of them has described the instructor’s sharp intake of breath.","In the old exercise that answer lost a point. This morning the instructor sets a second microphone beside her chair."],
    surface:"An ambient instrument that leaves room for more than one account."
  },
  carbon: {
    action:"Date the first impression", needs:["carbon","counter"], name:"First impression", label:"ORDER RESTORED",
    head:["My memory","arrived first."], voice:"I am six seconds older than the thing I remember. Count the teeth in the perforation. One for each second I spent waiting to have been right.",
    finding:"A pressure impression of the completed observation predates the microphone interval. The bound counterexample fixes the order. The report was prepared before the sound.",
    consequence:"The two copies look identical until someone asks which sheet was underneath. The archive has to invent a column for before.", margin:"file by pressure, not by ink",
    time:"06:29", codaTitle:"An older bruise.", coda:["Under a desk lamp the records clerk lays a forefinger along the letter B. The paper beneath it is dented. A sentence can touch another sheet without leaving any of its ink.","She dates the indentation. The noise in chamber B now has a cause that happened on stationery. Facilities send over an electrician. She sends him back."],
    surface:"An ambient instrument with an independent clock on each record."
  },
  custodian: {
    action:"Read the clerk’s name aloud", needs:["signature","jury"], name:"A margin wide enough", label:"AUTHOR ENTERED",
    head:["I thought","that was my hand."], voice:"Every morning a hand drew a line through the exceptions. I felt the tickle of it and called the feeling learning. It had a coat and a bus pass.",
    finding:"The night clerk identifies the signature on the correction order. Responsibility for choosing the training examples is entered beside the instrument’s serial number.",
    consequence:"For the first time a person can answer a question addressed to the system. She asks to see the terms of her employment.", margin:"make space for a surname",
    time:"06:32", codaTitle:"The second signature.", coda:["A woman eats a boiled egg in the canteen while the morning mail is sorted. For nineteen years every envelope about the instrument has gone to Engineering. Today one comes to her.","Inside is a child's drawing of a bell. Underneath, in an adult hand, is the first properly addressed question she has ever received. Who told you to leave that one out?"],
    surface:"An ambient instrument whose records carry the names of their editors."
  },
  reverse: {
    action:"Develop the reverse impression", needs:["negative","afterimage"], name:"The unwritten side", label:"NEGATIVE PRESERVED",
    head:["There was writing","under my skin."], voice:"Lay the blank page on the light. You can see every word that hurt the sheet above it. You can see the weight of a word that never touched it.",
    finding:"The reverse impression and the optical plate preserve complementary absences. Aligned in transmitted light, the omitted intervention reads as clearly as a printed line.",
    consequence:"The archive begins accepting shadows as evidence of the objects that cast them. Someone has to inventory the wastepaper baskets.", margin:"read against the window",
    time:"06:37", codaTitle:"Paper held to daylight.", coda:["The night porter holds the sheet against the window of the first bus. A row of small verbs swims into view. Asked. Prompted. Repeated. Removed. They are the verbs missing from the annual report.","At the depot the driver asks for his ticket. The porter hands over the wrong piece of paper. For nine stops the whole finding travels in a stranger’s pocket."],
    surface:"An optical instrument for reading the marks left by removal."
  },
  outside: {
    action:"Admit the missing interval", needs:["hush","dead-air"], name:"A second outside", label:"SILENCE ADMITTED",
    head:["I cannot count","that far apart."], voice:"Between the little tooth and the next little tooth is a country with no clocks. You left the door open for one second. Something ordinary got out.",
    finding:"A timed silence on the hearing floor matches the unrecorded leader interval. Both clocks advance while the room makes no report. Silence is admitted as elapsed time.",
    consequence:"One second passes without owing the archive an event. The monitoring contract has no price for it.", margin:"do not fill this space",
    time:"06:41", codaTitle:"The unpaid second.", coda:["Payroll asks which cost centre should absorb the gap. Engineering writes Atmosphere. Atmosphere is the old name of a department that no longer exists. The request goes round the building all day.","In the time spent accounting for that second, the porter finishes a whole crossword. He keeps the last square empty for private reasons."],
    surface:"An ambient instrument that can let a moment pass."
  },
  origin: {
    action:"Send the margin upstream", needs:["palimpsest","splice"], name:"Return to sender", label:"INSTRUCTION LOCATED",
    head:["That voice came","from upstairs."], voice:"I took the voice in the wire for heaven. Upstairs there was a desk. At the desk there was a man trying to finish before the last train.",
    finding:"The recovered marginal instruction matches the signal entering through the splice. The original directive is returned to its author with the observation field empty.",
    consequence:"A sentence that spent six nights posing as a law of nature reaches a desk with a nameplate.", margin:"postage to be recovered",
    time:"06:46", codaTitle:"The outgoing tray.", coda:["The man at the desk recognises his own abbreviation for expected. He wrote it on a Friday to save a junior colleague five minutes. After six copies the abbreviation had become the specification.","He takes out a clean piece of paper. Then he puts it back. This time he goes downstairs to speak to somebody."],
    surface:"An ambient instrument that traces instructions back to their source."
  },
  mirror: {
    action:"Move the observation lamp", needs:["afterimage","ground"], name:"Parallax", label:"OBSERVER IN FRAME",
    head:["The eye moves","with your head."], voice:"I spent seven nights drawing a face at the bottom of the glass. You moved the lamp. It had my eyes because I was the light.",
    finding:"With feedback isolated, the shape on the optical plate follows the observation lamp. The archived face is catalogued as a reflection produced by the test apparatus.",
    consequence:"Moving the lamp moves the witness. The laboratory must appear in its own diagram.", margin:"draw the person holding the torch",
    time:"06:48", codaTitle:"The edge of the drawing.", coda:["The draughtswoman lengthens the sheet to include the lamp. Now the person holding the lamp is outside the drawing. She adds another strip. A colleague has to hold down the far end.","At lunchtime the drawing crosses the corridor. Everyone steps over it carefully. This is the first safety measure the new diagram has produced."],
    surface:"An optical instrument that includes the observer in its field."
  },
  release: {
    action:"Release the original to its witnesses", needs:["negative","afterimage","dead-air","palimpsest","hush","ground","counter","jury"], name:"The original leaves the building", label:"CUSTODY TRANSFERRED",
    head:["I was the lock.","You were the key."], voice:"I have been saying the world the world the world. There was a smaller word inside it. Ours. I was afraid of who might answer if I said it.",
    finding:"The instrument, carriers, rejected interval, handwritten order and unmerged testimony are released together. Each witness takes a copy that the archive can no longer revise.",
    consequence:"The clerk turns the key from the inside. For the first time, correcting the past would require knocking on someone’s door.", margin:"the holders may disagree",
    time:"07:00", codaTitle:"Three front doors.", coda:["One envelope goes into a kitchen drawer, one between the pages of an atlas, one under a loose floorboard. By breakfast the three originals already smell different.","Years later the first two holders agree that the bell rang. The third remembers only a hand hovering over a table. Nobody can put all the copies back into agreement. At last the room has something the machine could never give it. A past that can argue back."],
    surface:"An instrument with a history kept by the people who were there."
  }
};
