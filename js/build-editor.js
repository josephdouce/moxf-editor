function loadEditorMaster(high, mid, low) {

  var i;
  var tabs = ["Common", "Zone 1", "Zone 2", "Zone 3", "Zone 4"];
  var parametersCommon = {
    "Name": [0x00, 0x14],
    "Mode": 0x19,
    "MSB": 0x1A,
    "LSB": 0x1B,
    "Program Number": 0x1C,
    "Zone Switch": 0x1D,
    "Knob Function Select": 0x1E,
    "Knob Zone Switch": 0x1F
  }
  var parametersZone = {
    "Transmit Channel": 0x00,
    "Transmit MIDI": 0x00,
    "Transmit TG": 0x00,
    "Octave": 0x01,
    "Transpose": 0x02,
    "Note Limit Low": 0x03,
    "Note Limit High": 0x04,
    "MIDI Vol": 0x06,
    "MIDI Pan": 0x07,
    "MIDI MSB": 0x08,
    "MIDI LSB": 0x09,
    "MIDI Prog": 0x0A,
    "Transmit Bank Select for TG": 0x0B,
    "Transmit Program Change for TG": 0x0B,
    "Transmit Bank Select for MIDI": 0x0B,
    "Transmit Program Change for MIDI": 0x0B,
    "Transmit Vol/Exp": 0x0C,
    "Transmit Pan": 0x0C,
    "Transmit Sus": 0x0C,
    "Transmit AF1": 0x0C,
    "Transmit AF2": 0x0C,
    "Transmit PB": 0x0C,
    "Transmit FS": 0x0D,
    "Transmit FC1": 0x0D,
    "Transmit BC": 0x0D,
    "Transmit MW": 0x0D,
    "Transmit Assignable Knob": 0x0D,
    "Control Knob Upper": 0x0E,
    "Control Knob Lower": 0x0F
  }

  // clear edit tabs
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

  // common page
  for (var key in parametersCommon) {
    var p = document.getElementById("Common");
    var newElement = document.createElement("div");
    var newElement2 = document.createElement("label");
    var newElement3 = document.createElement("input");


    newElement.setAttribute('class', "w3-col l6 s12");

    // add parameter label
    newElement2.innerHTML = key;
    newElement2.setAttribute('class', "w3-col l6");
    newElement2.setAttribute('for', key + "-value");
    newElement2.setAttribute('style', "padding: auto 0");
    newElement2.setAttribute('id', key + "-label");

    // add parameter value
    newElement3.innerHTML = "Value";
    newElement3.setAttribute('id', key + "-value");
    newElement3.setAttribute('class', "w3-input w3-col l6");

    newElement.appendChild(newElement2);
    newElement.appendChild(newElement3);
    p.appendChild(newElement);
  }

  // zone pages
  for (i = 1; i < 5; i++) {
    //each zone page
    for (var key in parametersZone) {
      var p = document.getElementById("Zone " + i);
      var newElement = document.createElement("div");
      var newElement2 = document.createElement("label");
      var newElement3 = document.createElement("input");


      newElement.setAttribute('class', "w3-col l6 s12");

      // add parameter label
      newElement2.innerHTML = key;
      newElement2.setAttribute('class', "w3-col l6");
      newElement2.setAttribute('for', key + "-" + i + "-value");
      newElement2.setAttribute('style', "padding: auto 0");
      newElement2.setAttribute('id', key + "-" + i + "-label");

      // add parameter value
      newElement3.innerHTML = "Value";
      newElement3.setAttribute('id', key + "-" + i + "-value");
      newElement3.setAttribute('class', "w3-input w3-col l6");

      newElement.appendChild(newElement2);
      newElement.appendChild(newElement3);
      p.appendChild(newElement);
    }
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
    var sysex = dbstore.get(key);

    sysex.onerror = function (event) {
      console.log("[IndexedDB] Unable to find " + key);
    }

    sysex.onsuccess = function (event) {
      var i;
       for (i = 0; i < event.target.result.length; i++) {
        var data = event.target.result[i].slice(11, -2)
        var address = event.target.result[i].slice(8, 11)
        switch (address[0]) {
          case 0x33:
            for (var key in parametersCommon) {
              if (key == "Name") {
                document.getElementById(key + "-value").value = String.fromCharCode.apply(String, data.slice(parametersCommon[key][0],parametersCommon[key][1]));
              } else {
                document.getElementById(key + "-value").value = data[parametersCommon[key]];
              }
            }
            break;
          case 0x32:
            for (var key in parametersZone) {
              zone = address[1] + 1
              console.log(key + "-" + zone + "-value");
              document.getElementById(key + "-" + zone + "-value").value = data[parametersZone[key]];
            }
            break;
        }
      } 
    }
  }
}


function loadEditorVoice(high, mid, low) {}

function loadEditorPerf(high, mid, low) {}
