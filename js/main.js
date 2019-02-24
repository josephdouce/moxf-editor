// add listeners on selected input device
function inputDeviceSelected() {
  intputSelected = document.getElementById("midiIn").value;
  var input = WebMidi.getInputByName(intputSelected);

  // Listen for a all messages on all channels
  input.addListener('noteon', "all",
    function (e) {
      gotMIDImessage(e.data);
    }
  );

  input.addListener('sysex', "all",
    function (e) {
      processSysex(e.data);
    }
  );
  // listen for sysex and update fields
}

// remote mode selected
function remote() {
  for (let el of document.querySelectorAll('.cc')) el.style.display = 'none';
  for (let el of document.querySelectorAll('.remote')) el.style.display = 'block';
  var outputSelected = document.getElementById("midiOut").value;
  var output = WebMidi.getOutputByName(outputSelected);
  output.sendSysex([0x43, 0x10, 0x7F, 0x1C], [0x00, 0x01, 0x00, 0x19, 0x00]);
}

// cc mode selected
function cc() {
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

// get a list of the available midi devices and set dropdown options
function getMidiDevices() {
  WebMidi.enable(function (err) {
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

// change tab
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

// on load function
function onLoadFunction() {
  getMidiDevices();
}

// call onload function
window.onload = onLoadFunction();

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
    if (data.value[i-9] == undefined) {
      output.sendSysex([0x43, 0x10, 0x7F, 0x1C], [0x00, 0x01, knob, i, 0x20]);
    } else {
      output.sendSysex([0x43, 0x10, 0x7F, 0x1C], [0x00, 0x01, knob, i, String(data.value[i-9]).charCodeAt(0)]);
    }
  }
}

function store() {
  var outputSelected = document.getElementById("midiOut").value;
  var output = WebMidi.getOutputByName(outputSelected);
  output.sendSysex([0x43, 0x10, 0x7F, 0x1C], [0x00, 0x01, 0x22, 0x00]);
}

function cc1() {
  var outputSelected = document.getElementById("midiOut").value;
  var output = WebMidi.getOutputByName(outputSelected);
  var value = document.getElementById("cc1").value;
  output.sendSysex([0x43, 0x10, 0x7F, 0x1C], [0x00, 0x01, 0x10, 0x18, value]);
}

function cc2() {
  var outputSelected = document.getElementById("midiOut").value;
  var output = WebMidi.getOutputByName(outputSelected);
  var value = document.getElementById("cc2").value;
  output.sendSysex([0x43, 0x10, 0x7F, 0x1C], [0x00, 0x01, 0x11, 0x18, value]);
}

function cc3() {
  var outputSelected = document.getElementById("midiOut").value;
  var output = WebMidi.getOutputByName(outputSelected);
  var value = document.getElementById("cc3").value;
  output.sendSysex([0x43, 0x10, 0x7F, 0x1C], [0x00, 0x01, 0x12, 0x18, value]);
}

function cc4() {
  var outputSelected = document.getElementById("midiOut").value;
  var output = WebMidi.getOutputByName(outputSelected);
  var value = document.getElementById("cc4").value;
  output.sendSysex([0x43, 0x10, 0x7F, 0x1C], [0x00, 0x01, 0x13, 0x18, value]);
}

function cc5() {
  var outputSelected = document.getElementById("midiOut").value;
  var output = WebMidi.getOutputByName(outputSelected);
  var value = document.getElementById("cc5").value;
  output.sendSysex([0x43, 0x10, 0x7F, 0x1C], [0x00, 0x01, 0x14, 0x18, value]);
}

function cc6() {
  var outputSelected = document.getElementById("midiOut").value;
  var output = WebMidi.getOutputByName(outputSelected);
  var value = document.getElementById("cc6").value;
  output.sendSysex([0x43, 0x10, 0x7F, 0x1C], [0x00, 0x01, 0x15, 0x18, value]);
}

function cc7() {
  var outputSelected = document.getElementById("midiOut").value;
  var output = WebMidi.getOutputByName(outputSelected);
  var value = document.getElementById("cc7").value;
  output.sendSysex([0x43, 0x10, 0x7F, 0x1C], [0x00, 0x01, 0x16, 0x18, value]);
}

function cc8() {
  var outputSelected = document.getElementById("midiOut").value;
  var output = WebMidi.getOutputByName(outputSelected);
  var value = document.getElementById("cc8").value;
  output.sendSysex([0x43, 0x10, 0x7F, 0x1C], [0x00, 0x01, 0x17, 0x18, value]);
}

function cc9() {
  var outputSelected = document.getElementById("midiOut").value;
  var output = WebMidi.getOutputByName(outputSelected);
  var value = document.getElementById("cc9").value;
  output.sendSysex([0x43, 0x10, 0x7F, 0x1C], [0x00, 0x01, 0x18, 0x18, value]);
}

function cc10() {
  var outputSelected = document.getElementById("midiOut").value;
  var output = WebMidi.getOutputByName(outputSelected);
  var value = document.getElementById("cc10").value;
  output.sendSysex([0x43, 0x10, 0x7F, 0x1C], [0x00, 0x01, 0x19, 0x18, value]);
}

function cc11() {
  var outputSelected = document.getElementById("midiOut").value;
  var output = WebMidi.getOutputByName(outputSelected);
  var value = document.getElementById("cc11").value;
  output.sendSysex([0x43, 0x10, 0x7F, 0x1C], [0x00, 0x01, 0x1A, 0x18, value]);
}

function cc12() {
  var outputSelected = document.getElementById("midiOut").value;
  var output = WebMidi.getOutputByName(outputSelected);
  var value = document.getElementById("cc12").value;
  output.sendSysex([0x43, 0x10, 0x7F, 0x1C], [0x00, 0x01, 0x1A, 0x18, value]);
}

function requestData() {
  var outputSelected = document.getElementById("midiOut").value;
  var output = WebMidi.getOutputByName(outputSelected);
  // get preset number
  output.sendSysex([0x43, 0x30, 0x7F, 0x1C], [0x00, 0x01, 0x20, 0x00]);
  // get preset name
  for (i = 0x00; i < 0x1B; i++) {
    output.sendSysex([0x43, 0x30, 0x7F, 0x1C], [0x00, 0x01, 0x00, i]);
  }
  // get preset data
  for (i = 0x10; i < 0x1C; i++) {
    for (j = 0x09; j < 0x1B; j++) {
      output.sendSysex([0x43, 0x30, 0x7F, 0x1C], [0x00, 0x01, i, j]);
    }
  }
}

function processSysex(messageData) {
  var dataList = document.querySelector('#midi-data ul')
  var newItem = document.createElement('li');
  newItem.appendChild(document.createTextNode(messageData));
  dataList.insertBefore(newItem, dataList.firstChild);

  switch (messageData[6]) {
    case 0x01:
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
        case 0x00:
          switch (messageData[8]) {
            case 0x00:
              document.getElementById("presetName").value = String.fromCharCode(messageData[9]);
              break;
            case 0x01:
              document.getElementById("presetName").value += String.fromCharCode(messageData[9]);
              break;
            case 0x02:
              document.getElementById("presetName").value += String.fromCharCode(messageData[9]);
              break;
            case 0x03:
              document.getElementById("presetName").value += String.fromCharCode(messageData[9]);
              break;
            case 0x04:
              document.getElementById("presetName").value += String.fromCharCode(messageData[9]);
              break;
            case 0x05:
              document.getElementById("presetName").value += String.fromCharCode(messageData[9]);
              break;
            case 0x06:
              document.getElementById("presetName").value += String.fromCharCode(messageData[9]);
              break;
            case 0x07:
              document.getElementById("presetName").value += String.fromCharCode(messageData[9]);
              break;
            case 0x08:
              document.getElementById("presetName").value += String.fromCharCode(messageData[9]);
              break;
            case 0x09:
              document.getElementById("presetName").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0A:
              document.getElementById("presetName").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0B:
              document.getElementById("presetName").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0C:
              document.getElementById("presetName").value += String.fromCharCode(messageData[9]);
              break;
            case 0x19:
              if (messageData[9] == 1) {
                document.getElementById("ccRemote").value = "cc()";
              } else {
                document.getElementById("ccRemote").value = "remote()";
              }
              break;
          }
          break;
        case 0x10:
          switch (messageData[8]) {
            case 0x09:
              document.getElementById("knobName1").value = String.fromCharCode(messageData[9]);
              break;
            case 0x0A:
              document.getElementById("knobName1").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0B:
              document.getElementById("knobName1").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0C:
              document.getElementById("knobName1").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0D:
              document.getElementById("knobName1").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0E:
              document.getElementById("knobName1").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0F:
              document.getElementById("knobName1").value += String.fromCharCode(messageData[9]);
              break;
            case 0x10:
              document.getElementById("knobName1").value += String.fromCharCode(messageData[9]);
              break;
            case 0x11:
              document.getElementById("knobName1").value += String.fromCharCode(messageData[9]);
              break;
            case 0x12:
              document.getElementById("knobName1").value += String.fromCharCode(messageData[9]);
              break;
            case 0x13:
              document.getElementById("knobName1").value += String.fromCharCode(messageData[9]);
              break;
            case 0x14:
              document.getElementById("knobName1").value += String.fromCharCode(messageData[9]);
              break;
            case 0x15:
              document.getElementById("knobName1").value += String.fromCharCode(messageData[9]);
              break;
            case 0x16:
              document.getElementById("knobName1").value += String.fromCharCode(messageData[9]);
              break;
            case 0x17:
              break;
            case 0x18:
              document.getElementById("cc1").value = messageData[9];
              break;
            case 0x19:
              break;
          }
          break;
        case 0x11:
          switch (messageData[8]) {
            case 0x09:
              document.getElementById("knobName2").value = String.fromCharCode(messageData[9]);
              break;
            case 0x0A:
              document.getElementById("knobName2").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0B:
              document.getElementById("knobName2").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0C:
              document.getElementById("knobName2").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0D:
              document.getElementById("knobName2").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0E:
              document.getElementById("knobName2").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0F:
              document.getElementById("knobName2").value += String.fromCharCode(messageData[9]);
              break;
            case 0x10:
              document.getElementById("knobName2").value += String.fromCharCode(messageData[9]);
              break;
            case 0x11:
              document.getElementById("knobName2").value += String.fromCharCode(messageData[9]);
              break;
            case 0x12:
              document.getElementById("knobName2").value += String.fromCharCode(messageData[9]);
              break;
            case 0x13:
              document.getElementById("knobName2").value += String.fromCharCode(messageData[9]);
              break;
            case 0x14:
              document.getElementById("knobName2").value += String.fromCharCode(messageData[9]);
              break;
            case 0x15:
              document.getElementById("knobName2").value += String.fromCharCode(messageData[9]);
              break;
            case 0x16:
              document.getElementById("knobName2").value += String.fromCharCode(messageData[9]);
              break;
            case 0x17:
              break;
            case 0x18:
              document.getElementById("cc2").value = messageData[9];
              break;
            case 0x19:
              break;
          }
          break;
        case 0x12:
          switch (messageData[8]) {
            case 0x09:
              document.getElementById("knobName3").value = String.fromCharCode(messageData[9]);
              break;
            case 0x0A:
              document.getElementById("knobName3").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0B:
              document.getElementById("knobName3").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0C:
              document.getElementById("knobName3").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0D:
              document.getElementById("knobName3").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0E:
              document.getElementById("knobName3").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0F:
              document.getElementById("knobName3").value += String.fromCharCode(messageData[9]);
              break;
            case 0x10:
              document.getElementById("knobName3").value += String.fromCharCode(messageData[9]);
              break;
            case 0x11:
              document.getElementById("knobName3").value += String.fromCharCode(messageData[9]);
              break;
            case 0x12:
              document.getElementById("knobName3").value += String.fromCharCode(messageData[9]);
              break;
            case 0x13:
              document.getElementById("knobName3").value += String.fromCharCode(messageData[9]);
              break;
            case 0x14:
              document.getElementById("knobName3").value += String.fromCharCode(messageData[9]);
              break;
            case 0x15:
              document.getElementById("knobName3").value += String.fromCharCode(messageData[9]);
              break;
            case 0x16:
              document.getElementById("knobName3").value += String.fromCharCode(messageData[9]);
              break;
            case 0x17:
              break;
            case 0x18:
              document.getElementById("cc3").value = messageData[9];
              break;
            case 0x19:
              break;
          }
          break;
        case 0x13:
          switch (messageData[8]) {
            case 0x09:
              document.getElementById("knobName4").value = String.fromCharCode(messageData[9]);
              break;
            case 0x0A:
              document.getElementById("knobName4").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0B:
              document.getElementById("knobName4").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0C:
              document.getElementById("knobName4").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0D:
              document.getElementById("knobName4").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0E:
              document.getElementById("knobName4").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0F:
              document.getElementById("knobName4").value += String.fromCharCode(messageData[9]);
              break;
            case 0x10:
              document.getElementById("knobName4").value += String.fromCharCode(messageData[9]);
              break;
            case 0x11:
              document.getElementById("knobName4").value += String.fromCharCode(messageData[9]);
              break;
            case 0x12:
              document.getElementById("knobName4").value += String.fromCharCode(messageData[9]);
              break;
            case 0x13:
              document.getElementById("knobName4").value += String.fromCharCode(messageData[9]);
              break;
            case 0x14:
              document.getElementById("knobName4").value += String.fromCharCode(messageData[9]);
              break;
            case 0x15:
              document.getElementById("knobName4").value += String.fromCharCode(messageData[9]);
              break;
            case 0x16:
              document.getElementById("knobName4").value += String.fromCharCode(messageData[9]);
              break;
            case 0x17:
              break;
            case 0x18:
              document.getElementById("cc4").value = messageData[9];
              break;
            case 0x19:
              break;
          }
          break;
        case 0x14:
          switch (messageData[8]) {
            case 0x09:
              document.getElementById("knobName5").value = String.fromCharCode(messageData[9]);
              break;
            case 0x0A:
              document.getElementById("knobName5").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0B:
              document.getElementById("knobName5").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0C:
              document.getElementById("knobName5").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0D:
              document.getElementById("knobName5").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0E:
              document.getElementById("knobName5").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0F:
              document.getElementById("knobName5").value += String.fromCharCode(messageData[9]);
              break;
            case 0x10:
              document.getElementById("knobName5").value += String.fromCharCode(messageData[9]);
              break;
            case 0x11:
              document.getElementById("knobName5").value += String.fromCharCode(messageData[9]);
              break;
            case 0x12:
              document.getElementById("knobName5").value += String.fromCharCode(messageData[9]);
              break;
            case 0x13:
              document.getElementById("knobName5").value += String.fromCharCode(messageData[9]);
              break;
            case 0x14:
              document.getElementById("knobName5").value += String.fromCharCode(messageData[9]);
              break;
            case 0x15:
              document.getElementById("knobName5").value += String.fromCharCode(messageData[9]);
              break;
            case 0x16:
              document.getElementById("knobName5").value += String.fromCharCode(messageData[9]);
              break;
            case 0x17:
              break;
            case 0x18:
              document.getElementById("cc5").value = messageData[9];
              break;
            case 0x19:
              break;
          }
          break;
        case 0x15:
          switch (messageData[8]) {
            case 0x09:
              document.getElementById("knobName6").value = String.fromCharCode(messageData[9]);
              break;
            case 0x0A:
              document.getElementById("knobName6").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0B:
              document.getElementById("knobName6").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0C:
              document.getElementById("knobName6").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0D:
              document.getElementById("knobName6").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0E:
              document.getElementById("knobName6").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0F:
              document.getElementById("knobName6").value += String.fromCharCode(messageData[9]);
              break;
            case 0x10:
              document.getElementById("knobName6").value += String.fromCharCode(messageData[9]);
              break;
            case 0x11:
              document.getElementById("knobName6").value += String.fromCharCode(messageData[9]);
              break;
            case 0x12:
              document.getElementById("knobName6").value += String.fromCharCode(messageData[9]);
              break;
            case 0x13:
              document.getElementById("knobName6").value += String.fromCharCode(messageData[9]);
              break;
            case 0x14:
              document.getElementById("knobName6").value += String.fromCharCode(messageData[9]);
              break;
            case 0x15:
              document.getElementById("knobName6").value += String.fromCharCode(messageData[9]);
              break;
            case 0x16:
              document.getElementById("knobName6").value += String.fromCharCode(messageData[9]);
              break;
            case 0x17:
              break;
            case 0x18:
              document.getElementById("cc6").value = messageData[9];
              break;
            case 0x19:
              break;
          }
          break;
        case 0x16:
          switch (messageData[8]) {
            case 0x09:
              document.getElementById("knobName7").value = String.fromCharCode(messageData[9]);
              break;
            case 0x0A:
              document.getElementById("knobName7").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0B:
              document.getElementById("knobName7").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0C:
              document.getElementById("knobName7").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0D:
              document.getElementById("knobName7").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0E:
              document.getElementById("knobName7").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0F:
              document.getElementById("knobName7").value += String.fromCharCode(messageData[9]);
              break;
            case 0x10:
              document.getElementById("knobName7").value += String.fromCharCode(messageData[9]);
              break;
            case 0x11:
              document.getElementById("knobName7").value += String.fromCharCode(messageData[9]);
              break;
            case 0x12:
              document.getElementById("knobName7").value += String.fromCharCode(messageData[9]);
              break;
            case 0x13:
              document.getElementById("knobName7").value += String.fromCharCode(messageData[9]);
              break;
            case 0x14:
              document.getElementById("knobName7").value += String.fromCharCode(messageData[9]);
              break;
            case 0x15:
              document.getElementById("knobName7").value += String.fromCharCode(messageData[9]);
              break;
            case 0x16:
              document.getElementById("knobName7").value += String.fromCharCode(messageData[9]);
              break;
            case 0x17:
              break;
            case 0x18:
              document.getElementById("cc7").value = messageData[9];
              break;
            case 0x19:
              break;
          }
          break;
        case 0x17:
          switch (messageData[8]) {
            case 0x09:
              document.getElementById("knobName8").value = String.fromCharCode(messageData[9]);
              break;
            case 0x0A:
              document.getElementById("knobName8").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0B:
              document.getElementById("knobName8").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0C:
              document.getElementById("knobName8").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0D:
              document.getElementById("knobName8").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0E:
              document.getElementById("knobName8").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0F:
              document.getElementById("knobName8").value += String.fromCharCode(messageData[9]);
              break;
            case 0x10:
              document.getElementById("knobName8").value += String.fromCharCode(messageData[9]);
              break;
            case 0x11:
              document.getElementById("knobName8").value += String.fromCharCode(messageData[9]);
              break;
            case 0x12:
              document.getElementById("knobName8").value += String.fromCharCode(messageData[9]);
              break;
            case 0x13:
              document.getElementById("knobName8").value += String.fromCharCode(messageData[9]);
              break;
            case 0x14:
              document.getElementById("knobName8").value += String.fromCharCode(messageData[9]);
              break;
            case 0x15:
              document.getElementById("knobName8").value += String.fromCharCode(messageData[9]);
              break;
            case 0x16:
              document.getElementById("knobName8").value += String.fromCharCode(messageData[9]);
              break;
            case 0x17:
              break;
            case 0x18:
              document.getElementById("cc8").value = messageData[9];
              break;
            case 0x19:
              break;
          }
          break;
        case 0x18:
          switch (messageData[8]) {
            case 0x09:
              document.getElementById("knobName9").value = String.fromCharCode(messageData[9]);
              break;
            case 0x0A:
              document.getElementById("knobName9").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0B:
              document.getElementById("knobName9").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0C:
              document.getElementById("knobName9").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0D:
              document.getElementById("knobName9").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0E:
              document.getElementById("knobName9").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0F:
              document.getElementById("knobName9").value += String.fromCharCode(messageData[9]);
              break;
            case 0x10:
              document.getElementById("knobName9").value += String.fromCharCode(messageData[9]);
              break;
            case 0x11:
              document.getElementById("knobName9").value += String.fromCharCode(messageData[9]);
              break;
            case 0x12:
              document.getElementById("knobName9").value += String.fromCharCode(messageData[9]);
              break;
            case 0x13:
              document.getElementById("knobName9").value += String.fromCharCode(messageData[9]);
              break;
            case 0x14:
              document.getElementById("knobName9").value += String.fromCharCode(messageData[9]);
              break;
            case 0x15:
              document.getElementById("knobName9").value += String.fromCharCode(messageData[9]);
              break;
            case 0x16:
              document.getElementById("knobName9").value += String.fromCharCode(messageData[9]);
              break;
            case 0x17:
              break;
            case 0x18:
              document.getElementById("cc9").value = messageData[9];
              break;
            case 0x19:
              break;
          }
          break;
        case 0x19:
          switch (messageData[8]) {
            case 0x09:
              document.getElementById("knobName10").value = String.fromCharCode(messageData[9]);
              break;
            case 0x0A:
              document.getElementById("knobName10").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0B:
              document.getElementById("knobName10").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0C:
              document.getElementById("knobName10").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0D:
              document.getElementById("knobName10").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0E:
              document.getElementById("knobName10").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0F:
              document.getElementById("knobName10").value += String.fromCharCode(messageData[9]);
              break;
            case 0x10:
              document.getElementById("knobName10").value += String.fromCharCode(messageData[9]);
              break;
            case 0x11:
              document.getElementById("knobName10").value += String.fromCharCode(messageData[9]);
              break;
            case 0x12:
              document.getElementById("knobName10").value += String.fromCharCode(messageData[9]);
              break;
            case 0x13:
              document.getElementById("knobName10").value += String.fromCharCode(messageData[9]);
              break;
            case 0x14:
              document.getElementById("knobName10").value += String.fromCharCode(messageData[9]);
              break;
            case 0x15:
              document.getElementById("knobName10").value += String.fromCharCode(messageData[9]);
              break;
            case 0x16:
              document.getElementById("knobName10").value += String.fromCharCode(messageData[9]);
              break;
            case 0x17:
              break;
            case 0x18:
              document.getElementById("cc10").value = messageData[9];
              break;
            case 0x19:
              break;
          }
          break;
        case 0x1A:
          switch (messageData[8]) {
            case 0x09:
              document.getElementById("knobName11").value = String.fromCharCode(messageData[9]);
              break;
            case 0x0A:
              document.getElementById("knobName11").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0B:
              document.getElementById("knobName11").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0C:
              document.getElementById("knobName11").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0D:
              document.getElementById("knobName11").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0E:
              document.getElementById("knobName11").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0F:
              document.getElementById("knobName11").value += String.fromCharCode(messageData[9]);
              break;
            case 0x10:
              document.getElementById("knobName11").value += String.fromCharCode(messageData[9]);
              break;
            case 0x11:
              document.getElementById("knobName11").value += String.fromCharCode(messageData[9]);
              break;
            case 0x12:
              document.getElementById("knobName11").value += String.fromCharCode(messageData[9]);
              break;
            case 0x13:
              document.getElementById("knobName11").value += String.fromCharCode(messageData[9]);
              break;
            case 0x14:
              document.getElementById("knobName11").value += String.fromCharCode(messageData[9]);
              break;
            case 0x15:
              document.getElementById("knobName11").value += String.fromCharCode(messageData[9]);
              break;
            case 0x16:
              document.getElementById("knobName11").value += String.fromCharCode(messageData[9]);
              break;
            case 0x17:
              break;
            case 0x18:
              document.getElementById("cc11").value = messageData[9];
              break;
            case 0x19:
              break;
          }
          break;
        case 0x1B:
          switch (messageData[8]) {
            case 0x09:
              document.getElementById("knobName12").value = String.fromCharCode(messageData[9]);
              break;
            case 0x0A:
              document.getElementById("knobName12").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0B:
              document.getElementById("knobName12").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0C:
              document.getElementById("knobName12").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0D:
              document.getElementById("knobName12").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0E:
              document.getElementById("knobName12").value += String.fromCharCode(messageData[9]);
              break;
            case 0x0F:
              document.getElementById("knobName12").value += String.fromCharCode(messageData[9]);
              break;
            case 0x10:
              document.getElementById("knobName12").value += String.fromCharCode(messageData[9]);
              break;
            case 0x11:
              document.getElementById("knobName12").value += String.fromCharCode(messageData[9]);
              break;
            case 0x12:
              document.getElementById("knobName12").value += String.fromCharCode(messageData[9]);
              break;
            case 0x13:
              document.getElementById("knobName12").value += String.fromCharCode(messageData[9]);
              break;
            case 0x14:
              document.getElementById("knobName12").value += String.fromCharCode(messageData[9]);
              break;
            case 0x15:
              document.getElementById("knobName12").value += String.fromCharCode(messageData[9]);
              break;
            case 0x16:
              document.getElementById("knobName12").value += String.fromCharCode(messageData[9]);
              break;
            case 0x17:
              break;
            case 0x18:
              document.getElementById("cc12").value = messageData[9];
              break;
            case 0x19:
              break;
          }
          break;
      }
      break;
  } 
}
