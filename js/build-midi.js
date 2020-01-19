
/*****************************************************
build the midi page
******************************************************/

function buildMidi() {
  var i;
  dataTypes = [
    "activesensingEnabled", "channelaftertouchEnabled", "channelmodeEnabled",
    "clockEnabled", "continueEnabled", "controlchangeEnabled",
    "keyaftertouchEnabled", "noteonEnabled", "noteoffEnabled",
    "nrpnEnabled", "pitchbendEnabled", "programchangeEnabled",
    "resetEnabled", "songpositionEnabled", "songselectEnabled",
    "startEnabled", "stopEnabled", "sysexEnabled", "timecodeEnabled",
    "tuningrequestEnabled", "unknownsystemmessageEnabled"
  ]

  // add all the checkboxes with labels
  for (i = 0; i < dataTypes.length; i++) {
    var p = document.getElementById("midiDataTypes");
    var newElement = document.createElement("div");
    var newElement2 = document.createElement("label");
    var newElement3 = document.createElement("input");

    newElement.setAttribute('class', "w3-col l3 m6 s12")

    newElement2.innerHTML = " " + dataTypes[i].slice(0, -7);

    newElement3.setAttribute('class', "w3-check");
    newElement3.setAttribute('type', "checkbox");
    newElement3.setAttribute('checked', "checked");
    newElement3.setAttribute('id', dataTypes[i]);
    newElement3.setAttribute('onchange', "updateListeners()");

    newElement.appendChild(newElement3);
    newElement.appendChild(newElement2);
    p.appendChild(newElement);
  }
}
