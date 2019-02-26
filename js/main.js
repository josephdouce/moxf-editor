// add listeners on selected input device
function inputDeviceSelected() {
  intputSelected = document.getElementById("midiIn").value;
  var input = WebMidi.getInputByName(intputSelected);

  // Listen for a all messages on all channels
  input.addListener('noteon', "all",
    function(e) {
      gotMIDImessage(e.data);
    }
  );

  input.addListener('controlchange', "all",
    function(e) {
      gotMIDImessage(e.data);
    }
  );

  input.addListener('sysex', "all",
    function(e) {
      processSysex(e.data);
    }
  );
  // listen for sysex and update fields
}

// remote mode selected
function remoteSelected() {
  for (let el of document.querySelectorAll('.cc')) el.style.display = 'none';
  for (let el of document.querySelectorAll('.remote')) el.style.display = 'block';
  var outputSelected = document.getElementById("midiOut").value;
  var output = WebMidi.getOutputByName(outputSelected);
  output.sendSysex([0x43, 0x10, 0x7F, 0x1C], [0x00, 0x01, 0x00, 0x19, 0x00]);
}

// cc mode selected
function ccSelected() {
  for (let el of document.querySelectorAll('.remote')) el.style.display = 'none';
  for (let el of document.querySelectorAll('.cc')) el.style.display = 'block';
  var outputSelected = document.getElementById("midiOut").value;
  var output = WebMidi.getOutputByName(outputSelected);
  output.sendSysex([0x43, 0x10, 0x7F, 0x1C], [0x00, 0x01, 0x00, 0x19, 0x01]);
}

// action for change of mode dropdown
function changeType(value) {
  eval(value);
}

function getMidiDevices() {
  WebMidi.enable(function(err) {
    if (err) {
      console.log("WebMidi could not be enabled.", err);
    } else {
      console.log("WebMidi enabled");

      var inputs = WebMidi.inputs;
      var outputs = WebMidi.outputs;

      var select = document.getElementById("midiIn");
      for (var i in WebMidi.inputs) {
        var option = document.createElement('option');
        option.text = option.value = WebMidi.inputs[i].name;
        select.add(option, 0);
      }

      var select = document.getElementById("midiOut");
      for (var i in WebMidi.inputs) {
        var option = document.createElement('option');
        option.text = option.value = WebMidi.outputs[i].name;
        select.add(option, 0);
      }
    }
  }, true);
}

function openTab(tabName) {
  var i;
  var x = document.getElementsByClassName("tabPage");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  document.getElementById(tabName).style.display = "block";
}

function gotMIDImessage(messageData) {
  var dataList = document.querySelector('#midi-data ul')
  var newItem = document.createElement('li');
  newItem.appendChild(document.createTextNode(messageData));
  dataList.insertBefore(newItem, dataList.firstChild);
}

function presetSelected() {
  var outputSelected = document.getElementById("midiOut").value;
  var output = WebMidi.getOutputByName(outputSelected);
  var preset = document.getElementById("preset").value - 1;
  // set preset
  output.sendSysex([0x43, 0x10, 0x7F, 0x1C], [0x00, 0x01, 0x20, 0x00, preset]);
  // get data
  requestData();
}

function presetNameChange(data) {
  var outputSelected = document.getElementById("midiOut").value;
  var output = WebMidi.getOutputByName(outputSelected);
  // set preset name
  for (i = 0x00; i < 0x0C; i++) {
    if (data.value[i] == undefined) {
      output.sendSysex([0x43, 0x10, 0x7F, 0x1C], [0x00, 0x01, 0x00, i, 0x20]);
    } else {
      output.sendSysex([0x43, 0x10, 0x7F, 0x1C], [0x00, 0x01, 0x00, i, String(data.value[i]).charCodeAt(0)]);
    }
  }
  for (i = 0x0D; i < 0x19; i++) {
    if (data.value[i] == undefined) {
      output.sendSysex([0x43, 0x10, 0x7F, 0x1C], [0x00, 0x01, 0x00, i, 0x20]);
    } else {
      output.sendSysex([0x43, 0x10, 0x7F, 0x1C], [0x00, 0x01, 0x00, i, String(data.value[i]).charCodeAt(0)]);
    }
  }
}

function knobNameChange(data) {
  var outputSelected = document.getElementById("midiOut").value;
  var output = WebMidi.getOutputByName(outputSelected);
  var knob = undefined;
  switch (data.id) {
    case "knobName1":
      knob = 16;
      break;
    case "knobName2":
      knob = 17;
      break;
    case "knobName3":
      knob = 18;
      break;
    case "knobName4":
      knob = 19;
      break;
    case "knobName5":
      knob = 20;
      break;
    case "knobName6":
      knob = 21;
      break;
    case "knobName7":
      knob = 22;
      break;
    case "knobName8":
      knob = 23;
      break;
    case "knobName9":
      knob = 24;
      break;
    case "knobName10":
      knob = 25;
      break;
    case "knobName11":
      knob = 26;
      break;
    case "knobName12":
      knob = 27;
      break;
  }
  console.log(knob);
  for (i = 0x09; i < 0x18; i++) {
    if (data.value[i - 9] == undefined) {
      output.sendSysex([0x43, 0x10, 0x7F, 0x1C], [0x00, 0x01, knob, i, 0x20]);
    } else {
      output.sendSysex([0x43, 0x10, 0x7F, 0x1C], [0x00, 0x01, knob, i, String(data.value[i - 9]).charCodeAt(0)]);
    }
  }
}

function ccChange(data) {
  var outputSelected = document.getElementById("midiOut").value;
  var output = WebMidi.getOutputByName(outputSelected);
  var value = data.value;
  var knobAddress = parseInt(data.id) + 15;
  output.sendSysex([0x43, 0x10, 0x7F, 0x1C], [0x00, 0x01, knobAddress, 0x18, value]);
}

function store() {
  var outputSelected = document.getElementById("midiOut").value;
  var output = WebMidi.getOutputByName(outputSelected);
  output.sendSysex([0x43, 0x10, 0x7F, 0x1C], [0x00, 0x01, 0x22, 0x00]);
}

function requestData() {
  var outputSelected = document.getElementById("midiOut").value;
  var output = WebMidi.getOutputByName(outputSelected);
  // get preset number
  output.sendSysex([0x43, 0x30, 0x7F, 0x1C], [0x00, 0x01, 0x20, 0x00]);
  // get preset data
  output.sendSysex([0x43, 0x30, 0x7F, 0x1C], [0x00, 0x0E, 0x60, document.getElementById('preset').value, 0x00]);
}

function processSysex(messageData) {
  var dataList = document.querySelector('#midi-data ul')
  var newItem = document.createElement('li');
  newItem.appendChild(document.createTextNode(messageData));
  dataList.insertBefore(newItem, dataList.firstChild);

  switch (messageData[2]) {
    // bulk dump
    case 0x00:
      // address high
      switch (messageData[8]) {
        case 0x01:
          // address mid
          switch (messageData[9]) {
            case 0x00:
              for (i = 11; i < 24; i++) {
                document.getElementById("presetName").value = String.fromCharCode(messageData[i]);
                if (messageData[36] == 1) {
                  document.getElementById("ccRemote").value = "ccSelected()";
                } else {
                  document.getElementById("ccRemote").value = "remoteSelected()";
                }
              }
              break;
            case 0x10:
            case 0x11:
            case 0x12:
            case 0x13:
            case 0x14:
            case 0x15:
            case 0x16:
            case 0x17:
            case 0x18:
            case 0x19:
            case 0x1A:
            case 0x1B:
              var knobId = "knobName" + (messageData[9] - 15);
              var = "cc" + (messageData[9] - 15);
              for (i = 20; i < 35; i++) {
                document.getElementById(knobId).value = String.fromCharCode(messageData[i]);
              }
              document.getElementById(ccId).value = messageData[35];
              break;
          }
          break;
      }
      break;
      // parameter dump
    case 0x10:
      // address high
      switch (messageData[6]) {
        case 0x01:
          // address mid
          switch (messageData[7]) {
            case 0x20:
              if (document.getElementById("preset").value == messageData[9] + 1) {
                console.log("no change in preset");
              } else {
                console.log("preset changed updating data");
                document.getElementById("preset").value = messageData[9] + 1;
                requestData();
              }
              break;
          }
          break;
      }
      break;

  }

}

// on load function
function onLoadFunction() {
  getMidiDevices();
}

// call onload function
window.onload = onLoadFunction();
