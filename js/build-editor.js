function loadEditorMaster(high, mid, low) {

  var i;
  var tabs = ["Common", "Zone 1", "Zone 2", "Zone 3", "Zone 4"];
  var parametersCommon = ["Name", "Mode", "MSB", "LSB",
    "Program Number", "Zone Switch", "Knob Function Select",
    "Knob Zone Switch"
  ]
  var parametersZone = ["Transmit Channel", "Transmit MIDI", "Transmit TG",
    "Octave", "Transpose", "Note Limit Low", "Note Limit High", "MIDI Vol", "MIDI Pan",
    "MIDI MSB", "MIDI LSB", "MIDI Prog", "Transmit Bank Select for TG", "Transmit Program Change for TG",
    "Transmit Bank Select for MIDI", "Transmit Program Change for MIDI", "Transmit Vol/Exp",
    "Transmit Pan", "Transmit Sus", "Transmit AF1", "Transmit AF2", "Transmit PB", "Transmit FS",
    "Transmit FC1", "Transmit BC", "Transmit MW", "Transmit Assignable Knob", "Control Knob Upper",
    "Control Knob Lower"
  ]

  // clear edit tab
  var e = document.getElementById("Edit");
  var child = e.lastElementChild;
  while (child) {
    e.removeChild(child);
    child = e.lastElementChild;
  }

  var p = document.getElementById("Edit");
  var newElement = document.createElement("div");
  newElement.setAttribute('class', "w3-bar w3-theme");
  newElement.setAttribute('id', "editBar");
  p.appendChild(newElement);

  // build nav bar
  for (i = 0; i < tabs.length; i++) {
    var p = document.getElementById("editBar");
    var newElement = document.createElement("button");
    newElement.setAttribute('class', "w3-bar-item w3-button");
    newElement.setAttribute('onclick', "openEditTab('" + tabs[i] + "')")
    newElement.innerHTML = tabs[i];
    p.appendChild(newElement);
  }

  // add tab pages 
  for (i = 0; i < tabs.length; i++) {
    var p = document.getElementById("Edit");
    var newElement = document.createElement("div");
    newElement.setAttribute('class', "editTabPage w3-row-padding");
    newElement.setAttribute('id', tabs[i])
    if (i > 0) {
      newElement.setAttribute('style', "display:none")
    }
    p.appendChild(newElement);
  }


  for (i = 0; i < parametersCommon.length; i++) {
    var p = document.getElementById("Common");
    var newElement = document.createElement("div");
    var newElement2 = document.createElement("label");
    var newElement3 = document.createElement("input");

    
    newElement.setAttribute('class', "w3-col l12");

    // add parameter label
    newElement2.innerHTML = parametersCommon[i];
    newElement2.setAttribute('class', "w3-col l2");
    newElement2.setAttribute('for', parametersCommon[i] + "-value");
    newElement2.setAttribute('style', "padding: auto 0");
    newElement2.setAttribute('id', parametersCommon[i] + "-label");  

    // add parameter value
    newElement3.innerHTML = "Value";
    newElement3.setAttribute('id', parametersCommon[i] + "-value");
    newElement3.setAttribute('class', "w3-input w3-col l2");

    newElement.appendChild(newElement2);
    newElement.appendChild(newElement3);
    p.appendChild(newElement);
  }

  // load data from store and set values
  var key = toHexString([high, mid, low]);
  var request = indexedDB.open('db1', 1);

  request.onerror = function (event) {
    console.log("[IndexedDB] Unable to Open DB");
  };

  request.onsuccess = function (event) {
    console.log("[IndexedDB] DB Opened")
    var db = event.target.result;
    var transaction = db.transaction('store1', 'readwrite');
    var dbstore = transaction.objectStore('store1');
    var data = dbstore.get(key);

    data.onerror = function (event) {
      console.log("[IndexedDB] Unable to find " + key);
    }

    data.onsuccess = function (event) {
      var i;
      for (i = 0; i < event.target.result.length; i++) {
        switch (event.target.result[i].slice(8, -2)[0]) {
          case 0x33:
              document.getElementById("Name-value").value = String.fromCharCode.apply(String, event.target.result[i].slice(11, -2).slice(0, 20));
              document.getElementById("Mode-value").value = event.target.result[i].slice(11, -2)[0x19];
              document.getElementById("MSB-value").value = event.target.result[i].slice(11, -2)[0x1A];
              document.getElementById("LSB-value").value = event.target.result[i].slice(11, -2)[0x1B];
              document.getElementById("Program Number-value").value = event.target.result[i].slice(11, -2)[0x1C];
              document.getElementById("Zone Switch-value").value = event.target.result[i].slice(11, -2)[0x1D];
              document.getElementById("Knob Function Select-value").value = event.target.result[i].slice(11, -2)[0x1E];
              document.getElementById("Knob Zone Switch-value").value = event.target.result[i].slice(11, -2)[0x1F];
            break;
          case 0x32:
            break;

        }
      }
    }
  };
}

function loadEditorVoice(high, mid, low) {}

function loadEditorPerf(high, mid, low) {}
