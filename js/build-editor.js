function loadEditorMaster(high, mid, low) {

  const tabs = ["Common", "Zone 1", "Zone 2", "Zone 3", "Zone 4"]
  const parametersCommon = [{
    "name": "Name",
    "startAddress": 0x00,
    "type": "string",
    "length": 20
  }, {
    "name": "Mode",
    "startAddress": 0x19,
    "type": "byte"
  }, {
    "name": "MSB",
    "startAddress": 0x1A,
    "type": "byte"
  }, {
    "name": "MSB",
    "startAddress": 0x1B,
    "type": "byte"
  }, {
    "name": "Program Number",
    "startAddress": 0x1C,
    "type": "byte"
  }, {
    "name": "Program Number",
    "startAddress": 0x1C,
    "type": "byte"
  }, {
    "name": "Knob Function Select",
    "startAddress": 0x1E,
    "type": "byte"
  }, {
    "name": "Knob Zone Switch",
    "startAddress": 0x1F,
    "type": "byte"
  }]
  const parametersZone = [{
    "name": "Transmit Channel",
    "startAddress": 0x00,
    "type": "byte"
  }, {
    "name": "Transmit MIDI",
    "startAddress": 0x00,
    "type": "byte"
  }, {
    "name": "Transmit TG",
    "startAddress": 0x00,
    "type": "byte"
  }, {
    "name": "Octave",
    "startAddress": 0x01,
    "type": "byte"
  }, {
    "name": "Transpose",
    "startAddress": 0x02,
    "type": "byte"
  }, {
    "name": "Note Limit Low",
    "startAddress": 0x03,
    "type": "byte"
  }, {
    "name": "Note Limit High",
    "startAddress": 0x04,
    "type": "byte"
  }, {
    "name": "MIDI Vol",
    "startAddress": 0x06,
    "type": "byte"
  }, {
    "name": "MIDI Pan",
    "startAddress": 0x07,
    "type": "byte"
  }, {
    "name": "MIDI MSB",
    "startAddress": 0x08,
    "type": "byte"
  }, {
    "name": "MIDI LSB",
    "startAddress": 0x09,
    "type": "byte"
  }, {
    "name": "MIDI Prog",
    "startAddress": 0x0A,
    "type": "byte"
  }, {
    "name": "Transmit Bank Select for TG",
    "startAddress": 0x0B,
    "type": "byte"
  }, {
    "name": "Transmit Program Change for TG",
    "startAddress": 0x0B,
    "type": "byte"
  }, {
    "name": "Transmit Bank Select for MIDI",
    "startAddress": 0x0B,
    "type": "byte"
  }, {
    "name": "Transmit Program Change for MIDI",
    "startAddress": 0x0B,
    "type": "byte"
  }, {
    "name": "Transmit Vol/Exp",
    "startAddress": 0x0C,
    "type": "byte"
  }, {
    "name": "Transmit Pan",
    "startAddress": 0x0C,
    "type": "byte"
  }, {
    "name": "Transmit Sus",
    "startAddress": 0x0C,
    "type": "byte"
  }, {
    "name": "Transmit AF1",
    "startAddress": 0x0C,
    "type": "byte"
  }, {
    "name": "Transmit AF2",
    "startAddress": 0x0C,
    "type": "byte"
  }, {
    "name": "Transmit PB",
    "startAddress": 0x0C,
    "type": "byte"
  }, {
    "name": "Transmit FS",
    "startAddress": 0x0D,
    "type": "byte"
  }, {
    "name": "Transmit FC1",
    "startAddress": 0x0D,
    "type": "byte"
  }, {
    "name": "Transmit BC",
    "startAddress": 0x0D,
    "type": "byte"
  }, {
    "name": "Transmit MW",
    "startAddress": 0x0D,
    "type": "byte"
  }, {
    "name": "Transmit Assignable Knob",
    "startAddress": 0x0D,
    "type": "byte"
  }, {
    "name": "Control Knob Upper",
    "startAddress": 0x0E,
    "type": "byte"
  }, {
    "name": "Control Knob Lower",
    "startAddress": 0x0F,
    "type": "byte"
  }]

  // clear edit tabs
  var e = document.getElementById("Edit");
  var child = e.lastElementChild;
  while (child) {
    e.removeChild(child);
    child = e.lastElementChild;
  }

  // build nav bar
  var p = document.getElementById("Edit");
  var newElement = document.createElement("div");
  newElement.setAttribute('class', "w3-bar w3-theme");
  newElement.setAttribute('id', "editBar");
  p.appendChild(newElement);

  // add navbar elements
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
  for (i = 0; i < parametersCommon.length; i++) {
    var parameter = parametersCommon[i];
    var p = document.getElementById("Common");
    var newElement = document.createElement("div");
    var newElement2 = document.createElement("label");
    var newElement3 = document.createElement("input");


    newElement.setAttribute('class', "w3-col l6 s12");

    // add parameter label
    newElement2.innerHTML = parameter.name;
    newElement2.setAttribute('class', "w3-col l6");
    newElement2.setAttribute('for', parameter.name + "-value");
    newElement2.setAttribute('style', "padding: auto 0");
    newElement2.setAttribute('id', parameter.name + "-label");

    // add parameter value
    newElement3.innerHTML = "Value";
    newElement3.setAttribute('id', parameter.name + "-value");
    newElement3.setAttribute('class', "w3-input w3-col l6");

    newElement.appendChild(newElement2);
    newElement.appendChild(newElement3);
    p.appendChild(newElement);
  }

  // zone pages
  for (i = 1; i < 5; i++) {
    //each zone page
    for (i = 0; i < parametersZone.length; i++) {
      var p = document.getElementById("Zone " + i);
      var newElement = document.createElement("div");
      var newElement2 = document.createElement("label");
      var newElement3 = document.createElement("input");


      newElement.setAttribute('class', "w3-col l6 s12");

      // add parameter label
      newElement2.innerHTML = parameter.name;
      newElement2.setAttribute('class', "w3-col l6");
      newElement2.setAttribute('for', parameter.name + "-" + i + "-value");
      newElement2.setAttribute('id', parameter.name + "-" + i + "-label");

      // add parameter value
      newElement3.innerHTML = "Value";
      newElement3.setAttribute('id', parameter.name + "-" + i + "-value");
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
            for (i = 0; i < parametersCommon.length; i++) {
              var parameter = parametersCommon[i];
              if (parameter.type == "string") {
                document.getElementById(parameter.name + "-value").value = String.fromCharCode.apply(String, data.slice(parameter.startAddress, parameter.startAddress + length));
              } else if (parameter.type == "byte") {
                document.getElementById(parameter.name + "-value").value = data[parameter.startAddress];
              } else if (parameter.type == "bit") {
                document.getElementById(parameter.name + "-value").value = data[parameter.startAddress].toString(2)[parameter.positon];
              }
            }
            break;
          case 0x32:
            for (i = 0; i < parametersZone.length; i++) {
              zone = address[1] + 1
              var parameter = parametersZone[i];
              if (parameter.type == "string") {
                document.getElementById(parameter.name + "-" + zone + "-value").value = String.fromCharCode.apply(String, data.slice(parameter.startAddress, parameter.startAddress + length));
              } else if (parameter.type == "byte") {
                document.getElementById(parameter.name + "-" + zone + "-value").value = data[parameter.startAddress];
              } else if (parameter.type == "bit") {
                document.getElementById(parameter.name + "-" + zone + "-value").value = data[parameter.startAddress].toString(2)[parameter.positon];
              }
            }
            break;
        }
      }
    }
  }
}


function loadEditorVoice(high, mid, low) {}

function loadEditorPerf(high, mid, low) {}
