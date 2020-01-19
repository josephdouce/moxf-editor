
/*****************************************************
build the daW page
******************************************************/

function buildDaw() {
  var i;
  var remoteNames = ["Cutoff", "Resonance", "FEG Depth", "Portamento",
    "Attack", "Decay", "Sustain", "Release", "Vol", "Pan", "Assign 1",
    "Assign 2"
  ];

  // build the cc view
  for (i = 0; i < 12; i++) {
    var p = document.getElementById("ccView");
    var newElement = document.createElement("div");
    var newElement2 = document.createElement("input");
    var newElement3 = document.createElement("input");

    newElement.setAttribute('class', "w3-col l3 m6 s12");

    newElement2.setAttribute('class', "w3-input w3-border w3-col s9")
    newElement2.setAttribute('type', "text")
    newElement2.setAttribute('onchange', "knobNameChange(this)")
    newElement2.setAttribute('placeholder', "DisplayName")
    newElement2.setAttribute('id', "knobName" + (i + 1))
    newElement2.setAttribute('maxlength', "15")

    newElement3.setAttribute('class', "w3-input w3-border w3-col s3")
    newElement3.setAttribute('type', "number")
    newElement3.setAttribute('onchange', "ccChange(this)")
    newElement3.setAttribute('id', "cc" + (i + 1))
    newElement3.setAttribute('min', "1")
    newElement3.setAttribute('max', "95")
    newElement3.setAttribute('placeholder', "CC")

    newElement.appendChild(newElement2);
    newElement.appendChild(newElement3);
    p.appendChild(newElement);
  }

  // build the remote view
  for (i = 0; i < 12; i++) {
    var p = document.getElementById("remoteView");
    var newElement = document.createElement("div");
    var newElement2 = document.createElement("input");
    var newElement3 = document.createElement("input");

    newElement.setAttribute('class', "w3-col l3 m6 s12");

    newElement2.setAttribute('class', "w3-input w3-border w3-col s9")
    newElement2.setAttribute('type', "text")
    newElement2.setAttribute('value', remoteNames[i])
    newElement2.setAttribute('readonly', 'true')

    newElement3.setAttribute('class', "w3-input w3-border w3-col s3")
    newElement3.setAttribute('type', "number")
    newElement3.setAttribute('value', (i + 16))
    newElement3.setAttribute('readonly', 'true')

    newElement.appendChild(newElement2);
    newElement.appendChild(newElement3);
    p.appendChild(newElement);
  }
}
