function inputSelected() {
  console.log("Input selected : " + document.getElementById("midiIn").value);
  var intputSelected = document.getElementById("midiIn").value;
  input = WebMidi.getInputByName(intputSelected);
  input.removeListener();
  addListeners();
}

function outputSelected() {
  console.log("Output selected : " + document.getElementById("midiOut").value);
  var outputSelected = document.getElementById("midiOut").value;
  output = WebMidi.getOutputByName(outputSelected);
}

// add listeners on selected input device
function addListeners() {
  input.addListener('noteon', "all",
    function (e) {
      printMidiDebug("Recieved: " + e.data);
    }
  );

  input.addListener('controlchange', "all",
    function (e) {
      printMidiDebug("Recieved: " + e.data);
    }
  );

  input.addListener('sysex', "all",
    function (e) {
      printMidiDebug("Recieved: " + e.data);
      processSysex(e.data);
    }
  );
}

// funcion for change of cc/remote dropdown
function changeType() {
  var type = document.getElementById("ccRemote").value;
  if (type == "cc") {
    for (let el of document.querySelectorAll('.remote')) el.style.display = 'none';
    for (let el of document.querySelectorAll('.cc')) el.style.display = 'block';
    output.sendSysex([0x43, 0x10, 0x7F, 0x1C], [0x00, 0x01, 0x00, 0x19, 0x01]);
  } else if (type == "remote") {
    for (let el of document.querySelectorAll('.cc')) el.style.display = 'none';
    for (let el of document.querySelectorAll('.remote')) el.style.display = 'block';
    output.sendSysex([0x43, 0x10, 0x7F, 0x1C], [0x00, 0x01, 0x00, 0x19, 0x00]);
  }
}

// request enable MIDI in broweser and wait for user response before proceeding
async function enableMidi() {

  var promise = new Promise((resolve, reject) => {
    WebMidi.enable(function (err) {
      if (err) {
        console.log("WebMidi could not be enabled.", err);
      } else {
        resolve();
        console.log("WebMidi enabled");
      }
    }, true);
  });

  // wait for midi to be enabled
  await promise;

  WebMidi.addListener('connected',
    function (e) {
      getMidiDevices();
    }
  );

  WebMidi.addListener('disconnected',
    function (e) {
      getMidiDevices();
    }
  );

  getMidiDevices();

}

// get available midi devices and populate dropdowns 
function getMidiDevices() {

  document.getElementById("midiIn").options.length = 0;
  document.getElementById("midiOut").options.length = 0;

  if (Webmidi.inputs.length > 0) {
    document.getElementById('connectionWarning').style.display = 'none';
  } else {
    document.getElementById('connectionWarning').style.display = 'block';
  }

  for (var i in WebMidi.inputs) {
    console.log("Added input: " + WebMidi.inputs[i].name);
    var option = document.createElement('option');
    option.text = option.value = WebMidi.inputs[i].name;
    document.getElementById("midiIn").add(option);
  }

  for (var i in WebMidi.outputs) {
    console.log("Added output: " + WebMidi.outputs[i].name);
    var option = document.createElement('option');
    option.text = option.value = WebMidi.outputs[i].name;
    document.getElementById("midiOut").add(option);
  }

  document.getElementById("midiIn").value = WebMidi.getInputByName("MOXF6/MOXF8-5").name;
  inputSelected();
  document.getElementById("midiOut").value = WebMidi.getOutputByName("MOXF6/MOXF8-1").name;
  outputSelected();
}

function openTab(tabName) {
  var i;
  var x = document.getElementsByClassName("tabPage");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  document.getElementById(tabName).style.display = "block";
}

function presetSelected(data) {
  if (data.value > 50) {
    data.value = 50
  }
  var preset = data.value - 1;
  // set preset
  output.sendSysex([0x43, 0x10, 0x7F, 0x1C], [0x00, 0x01, 0x20, 0x00, preset]);
  // get data
  requestData();
}

function presetNameChange(data) {
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
  var knobAddress = parseInt(data.id[8]) + 15;
  for (i = 0x09; i < 0x18; i++) {
    if (data.value[i - 9] == undefined) {
      output.sendSysex([0x43, 0x10, 0x7F, 0x1C], [0x00, 0x01, knobAddress, i, 0x20]);
    } else {
      output.sendSysex([0x43, 0x10, 0x7F, 0x1C], [0x00, 0x01, knobAddress, i, String(data.value[i - 9]).charCodeAt(0)]);
    }
  }
}

function ccChange(data) {
  if (data.value > 95) {
    data.value = 95;
  }
  var value = data.value;
  var knobAddress = parseInt(data.id[2]) + 15;
  output.sendSysex([0x43, 0x10, 0x7F, 0x1C], [0x00, 0x01, knobAddress, 0x18, value]);
}

function store() {
  output.sendSysex([0x43, 0x10, 0x7F, 0x1C], [0x00, 0x01, 0x22, 0x00]);
}

function requestData() {
  var presetAddress = document.getElementById('preset').value - 1;
  // get preset data
  console.log("Requesting data for preset: " + document.getElementById('preset').value);
  output.sendSysex([0x43, 0x20, 0x7F, 0x1C], [0x00, 0x0E, 0x60, presetAddress, 0x00]);
}

function processSysex(messageData) {
  switch (messageData[2]) {
    // bulk dump
    case 0x00:
      // address high
      switch (messageData[8]) {
        case 0x01:
          // address mid
          switch (messageData[9]) {
            case 0x00:
              document.getElementById("presetName").value = String.fromCharCode(messageData[11]);
              for (i = 12; i < 24; i++) {
                document.getElementById("presetName").value += String.fromCharCode(messageData[i]);
              }
              if (messageData[36] == 1) {
                document.getElementById("ccRemote").value = "cc";
              } else {
                document.getElementById("ccRemote").value = "remote";
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
              var ccId = "cc" + (messageData[9] - 15);
              document.getElementById(knobId).value = String.fromCharCode(messageData[20]);
              for (i = 21; i < 35; i++) {
                document.getElementById(knobId).value += String.fromCharCode(messageData[i]);
              }
              document.getElementById(ccId).value = messageData[35];
              break;
            default:
              break;
          }
          break;
        default:
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
              if (document.getElementById("preset").value == (messageData[9] + 1)) {
                console.log("Preset not changed: " + document.getElementById("preset").value);
              } else {
                console.log("Loading new preset: " + (messageData[9] + 1))
                document.getElementById("preset").value = messageData[9] + 1;
                requestData();
              }
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
      break;
    default:
      break;
  }
}

// print midi data if debuggin enabled
function printMidiDebug(data) {
  // only print if debug enabled
  if (document.getElementById("debuggingEnabled").checked) {
    // append to top of list
    var dataList = document.querySelector('#midi-data ul')
    var newItem = document.createElement('li');
    newItem.appendChild(document.createTextNode(data));
    dataList.insertBefore(newItem, dataList.firstChild);
  }
}

// call onload function
window.onload = enableMidi();

// webapp install desktop
let deferredPrompt;
const addBtn = document.querySelector('.add-button');
addBtn.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen
  addBtn.style.display = 'block';

  addBtn.addEventListener('click', (e) => {
    // hide our user interface that shows our A2HS button
    addBtn.style.display = 'none';
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
      });
  });
});