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
}

// cc mode selected
function cc() {
  for (let el of document.querySelectorAll('.remote')) el.style.display = 'none';
  for (let el of document.querySelectorAll('.cc')) el.style.display = 'block';
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
  dataList.appendChild(newItem);
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
  requestData();
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
  for (i = 0x10; i < 0x1C; i++) {
    for (j = 0x09; j < 0x1A; j++) {
      output.sendSysex([0x43, 0x30, 0x7F, 0x1C], [0x00, 0x01, i, j]);
    }
  }
}

function processSysex(messageData) {
  var dataList = document.querySelector('#midi-data ul')
  var newItem = document.createElement('li');
  newItem.appendChild(document.createTextNode(messageData));
  dataList.appendChild(newItem);

   switch (messageData[6]) {
    case 0x01:
      switch (messageData[7]) {
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
