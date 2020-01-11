var output = WebMidi.output;
var input;

function sysexDumpSendTest() {
  sysexBulkDumpSend(14, 64, 0, []);
  sysexBulkDumpSend(48, 0, 0, [77, 101, 109, 111, 114, 105, 101, 115, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 64, 0, 64, 64, 64, 64, 64, 64, 0, 64, 64, 64, 64, 0, 0, 64, 64, 0, 64, 64, 64, 0, 64, 64, 0, 80, 64, 1, 127, 127, 0, 0, 1, 1, 0, 60, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 32, 0, 15]);
  sysexBulkDumpSend(15, 64, 0, []);
}

function sysexBulkDumpChange(high, mid, low, data) {
  var byteCount = data.length + 4;
  var checksum = ~[0x00, high, mid, low].concat(data).reduce((a, b) => a + b, 0) + 1 & 0x7F
  try {
    console.log(0x43, [0x00, 0x7F, 0x1C, 0x00, byteCount, 0x00, high, mid, low].concat(data).concat(checksum))
    output.sendSysex(0x43, [0x00, 0x7F, 0x1C, 0x00, byteCount, 0x00, high, mid, low].concat(data).concat(checksum));
  } catch (err) {
    console.log(err);
  }
}

function sysexParameterChange(high, mid, low, data) {
  try {
    output.sendSysex(0x43, [0x10, 0x7F, 0x1C, 0x00, high, mid, low].concat(data));
  } catch (err) {
    console.log(err);
  }
}

function sysexBulkDumpRequest(high, mid, low) {
  try {
    output.sendSysex(0x43, [0x20, 0x7F, 0x1C, 0x00, high, mid, low]);
  } catch (err) {
    console.log(err);
  }
}

function sysexParameterRequest(high, mid, low) {
  try {
    output.sendSysex(0x43, [0x30, 0x7F, 0x1C, 0x00, high, mid, low]);
  } catch (err) {
    console.log(err);
  }
}

//change input and add listeners
function updateListeners() {

  console.log("[Main] Updating Listeners")

  for (var i in WebMidi.inputs) {

    input = WebMidi.inputs[i];

    input.removeListener();

    var events = ['activesensing', 'channelaftertouch', 'channelmode', 'clock', 'continue', 'controlchange',
      'keyaftertouch', 'noteoff', 'noteon', 'nrpn', 'pitchbend', 'programchange', 'reset', 'songposition',
      'songselect', 'start', 'stop', 'sysex', 'timecode', 'tuningrequest', 'unknownsystemmessage'
    ];

    for (var i in events) {
      if (document.getElementById(events[i] + "Enabled").checked) {
        input.addListener(events[i], "all",
          function (e) {
            printMidi(e.target.name + ", " + e.type + ", " + e.data);
            switch (e.type) {
              case 'sysex':
                sysexEventHandler(e.data);
            }
          }
        );
      };
    }
  }
}

function outputSelected() {
  var outputSelected = document.getElementById("midiOut").value;
  try {
    console.log("[Main] Output Selected : " + outputSelected);
    output = WebMidi.getOutputByName(outputSelected);
  } catch (err) {
    console.log("[Main] No Output Selected")
    console.log(err);
  }
}

// funcion for change of cc/remote dropdown
function changeType() {
  var type = document.getElementById("ccRemote").value;
  if (type == "cc") {
    for (let el of document.querySelectorAll('.remote')) el.style.display = 'none';
    for (let el of document.querySelectorAll('.cc')) el.style.display = 'block';
    sysexParameterChange(0x01, 0x00, 0x19, 0x01);
  } else if (type == "remote") {
    for (let el of document.querySelectorAll('.cc')) el.style.display = 'none';
    for (let el of document.querySelectorAll('.remote')) el.style.display = 'block';
    sysexParameterChange(0x01, 0x00, 0x19, 0x00);
  }
}

// request enable MIDI in broweser and wait for user response before proceeding
async function enableMidi() {
  console.log("[Main] Enabling Midi")

  var promise = new Promise((resolve, reject) => {
    WebMidi.enable(function (err) {
      if (err) {
        console.log("[Main] WebMidi could not be enabled.", err);
      } else {
        resolve();
        console.log("[Main] WebMidi enabled");
      }
    }, true);
  });

  // wait for midi to be enabled
  await promise;

  WebMidi.addListener('connected',
    function (e) {
      console.log("New Device Connected")
      getMidiDevices();
      updateListeners();
      outputSelected();
    }
  );

  WebMidi.addListener('disconnected',
    function (e) {
      console.log("Device Disonnected")
      getMidiDevices();
    }
  );

  getMidiDevices();
  updateListeners();
  outputSelected();

}

// get available midi devices and populate dropdowns 
function getMidiDevices() {
  console.log("[Main] Getting Midi Devices")

  document.getElementById("midiOut").options.length = 0;
  document.getElementById("midiIn").innerHTML = "";

  if (WebMidi.inputs.length > 0) {

    document.getElementById('connectionWarning').style.display = 'none';

    for (var i in WebMidi.inputs) {
      console.log("[Main] Added Input: " + WebMidi.inputs[i].name);
      var ul = document.getElementById("midiIn");
      var li = document.createElement("li");
      li.appendChild(document.createTextNode(WebMidi.inputs[i].name));
      ul.appendChild(li);
    }

    for (var i in WebMidi.outputs) {
      console.log("[Main] Added Output: " + WebMidi.outputs[i].name);
      var option = document.createElement('option');
      option.text = option.value = WebMidi.outputs[i].name;
      document.getElementById("midiOut").add(option);
    }

  } else {
    document.getElementById('connectionWarning').style.display = 'block';
  }

}

function openMainTab(event, tabName) {

  var i, x, tablinks;
  x = document.getElementsByClassName("mainTabPage");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < x.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" w3-red", "");
  }
  document.getElementById(tabName).style.display = "block";
  event.currentTarget.className += " w3-red";

}

function openLibrarianTab(tabName) {
  var i;
  var x = document.getElementsByClassName("librarianTabPage");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  document.getElementById(tabName).style.display = "block";
  document.getElementById("Librarian-Page-Selected").innerHTML = tabName;
}

function presetSelected(data) {
  if (1 > data.value > 50) {
    data.value = 1
  }
  var preset = data.value - 1;
  // set preset
  sysexParameterChange(0x01, 0x20, 0x00, preset);
  // get data
  requestData();
}

function presetNameChange(data) {
  // set preset name
  for (i = 0x00; i < 0x0C; i++) {
    if (data.value[i] == undefined) {
      sysexParameterChange(0x01, 0x00, i, 0x20);
    } else {
      sysexParameterChange(0x01, 0x00, i, String(data.value[i]).charCodeAt(0));
    }
  }
  for (i = 0x0D; i < 0x19; i++) {
    if (data.value[i] == undefined) {
      sysexParameterChange(0x01, 0x00, i, 0x20);
    } else {
      sysexParameterChange(0x01, 0x00, i, String(data.value[i]).charCodeAt(0));
    }
  }
}

function knobNameChange(data) {
  var knobAddress = parseInt(data.id[8]) + 15;
  for (i = 0x09; i < 0x18; i++) {
    if (data.value[i - 9] == undefined) {
      sysexParameterChange(0x01, knobAddress, i, 0x20);
    } else {
      sysexParameterChange(0x01, knobAddress, i, String(data.value[i - 9]).charCodeAt(0));
    }
  }
}

function ccChange(data) {
  if (1 > data.value > 95) {
    data.value = 1;
  }
  if (data.value == 32) {
    data.value = 1;
  }
  var value = data.value;
  var knobAddress = parseInt(data.id[2]) + 15;
  sysexParameterChange(0x01, knobAddress, 0x18, value);
}

function store() {
  sysexParameterChange(0x01, 0x22, 0x00, []);
}

function requestData() {
  var presetAddress = document.getElementById('preset').value - 1;
  // get preset data
  console.log("[Main] Requesting data for preset: " + document.getElementById('preset').value);
  sysexBulkDumpRequest(0x0E, 0x60, presetAddress);
}

function sysexEventHandler(messageData) {
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
                console.log("[Main] Preset not changed: " + document.getElementById("preset").value);
              } else {
                console.log("[Main] Loading new preset: " + (messageData[9] + 1))
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
function printMidi(data) {
  var dataList = document.querySelector('#midi-data ul')
  var newItem = document.createElement('li');
  newItem.appendChild(document.createTextNode(data));
  dataList.insertBefore(newItem, dataList.firstChild);
}

function voiceSelect(LSB, i) {
  sysexParameterChange(0x0A, 0x00, 0x01, 0)
  output.sendControlChange(0, 63);
  output.sendControlChange(32, LSB);
  output.sendProgramChange(i);
}

function performanceSelect(LSB, i) {
  sysexParameterChange(0x0A, 0x00, 0x01, 1)
  output.sendControlChange(0, 63);
  output.sendControlChange(32, LSB);
  output.sendProgramChange(i);
}

function songSelect(i) {
  sysexParameterChange(0x0A, 0x00, 0x01, 3)
  output.sendSongSelect(i);
}

function patternSelect(i) {
  sysexParameterChange(0x0A, 0x00, 0x01, 2)
  output.sendSongSelect(i);
}

function masterSelect(i) {
  sysexParameterChange(0x0A, 0x00, 0x01, 4)
  sysexParameterChange(0x0A, 0x00, 0x00, i)
}

function mixSelect(i) {
  output.sendControlChange(0, 63);
  output.sendControlChange(32, 60);
  output.sendProgramChange(i);
}


function buildLibrarian() {
  var i;
  for (i = 0; i < 128; i++) {
    // Adds an element to the document
    var p = document.getElementById("Performance-User-1");
    var newElement = document.createElement("button");
    newElement.setAttribute('class', "w3-col l3 w3-button");
    newElement.setAttribute('onclick', "performanceSelect(64, " + i + ")")
    newElement.innerHTML = i;
    p.appendChild(newElement);

    // Adds an element to the document
    var p = document.getElementById("Performance-User-2");
    var newElement = document.createElement("button");
    newElement.setAttribute('class', "w3-col l3 w3-button");
    newElement.setAttribute('onclick', "performanceSelect(65, " + i + ")")
    newElement.innerHTML = i;
    p.appendChild(newElement);

    var p = document.getElementById("Voice-Pre-1");
    var newElement = document.createElement("button");
    newElement.setAttribute('class', "w3-col l3 w3-button");
    newElement.setAttribute('onclick', "voiceSelect(0, " + i + ")")
    newElement.innerHTML = i;
    p.appendChild(newElement);

    var p = document.getElementById("Voice-Pre-2");
    var newElement = document.createElement("button");
    newElement.setAttribute('class', "w3-col l3 w3-button");
    newElement.setAttribute('onclick', "voiceSelect(1, " + i + ")")
    newElement.innerHTML = i;
    p.appendChild(newElement);

    var p = document.getElementById("Voice-Pre-3");
    var newElement = document.createElement("button");
    newElement.setAttribute('class', "w3-col l3 w3-button");
    newElement.setAttribute('onclick', "voiceSelect(2, " + i + ")")
    newElement.innerHTML = i;
    p.appendChild(newElement);

    var p = document.getElementById("Voice-Pre-4");
    var newElement = document.createElement("button");
    newElement.setAttribute('class', "w3-col l3 w3-button");
    newElement.setAttribute('onclick', "voiceSelect(3, " + i + ")")
    newElement.innerHTML = i;
    p.appendChild(newElement);
    
    var p = document.getElementById("Voice-Pre-5");
    var newElement = document.createElement("button");
    newElement.setAttribute('class', "w3-col l3 w3-button");
    newElement.setAttribute('onclick', "voiceSelect(4, " + i + ")")
    newElement.innerHTML = i;
    p.appendChild(newElement);
    
    var p = document.getElementById("Voice-Pre-6");
    var newElement = document.createElement("button");
    newElement.setAttribute('class', "w3-col l3 w3-button");
    newElement.setAttribute('onclick', "voiceSelect(5, " + i + ")")
    newElement.innerHTML = i;
    p.appendChild(newElement);
    
    var p = document.getElementById("Voice-Pre-7");
    var newElement = document.createElement("button");
    newElement.setAttribute('class', "w3-col l3 w3-button");
    newElement.setAttribute('onclick', "voiceSelect(6, " + i + ")")
    newElement.innerHTML = i;
    p.appendChild(newElement);
    
    var p = document.getElementById("Voice-Pre-8");
    var newElement = document.createElement("button");
    newElement.setAttribute('class', "w3-col l3 w3-button");
    newElement.setAttribute('onclick', "voiceSelect(7, " + i + ")")
    newElement.innerHTML = i;
    p.appendChild(newElement);
    
    var p = document.getElementById("Voice-Pre-9");
    var newElement = document.createElement("button");
    newElement.setAttribute('class', "w3-col l3 w3-button");
    newElement.setAttribute('onclick', "voiceSelect(8, " + i + ")")
    newElement.innerHTML = i;
    p.appendChild(newElement);
    
    var p = document.getElementById("Voice-User-1");
    var newElement = document.createElement("button");
    newElement.setAttribute('class', "w3-col l3 w3-button");
    newElement.setAttribute('onclick', "voiceSelect(9, " + i + ")")
    newElement.innerHTML = i;
    p.appendChild(newElement);
    
    var p = document.getElementById("Voice-User-2");
    var newElement = document.createElement("button");
    newElement.setAttribute('class', "w3-col l3 w3-button");
    newElement.setAttribute('onclick', "voiceSelect(10, " + i + ")")
    newElement.innerHTML = i;
    p.appendChild(newElement);
    
    var p = document.getElementById("Voice-User-3");
    var newElement = document.createElement("button");
    newElement.setAttribute('class', "w3-col l3 w3-button");
    newElement.setAttribute('onclick', "voiceSelect(11, " + i + ")")
    newElement.innerHTML = i;
    p.appendChild(newElement);

    var p = document.getElementById("Song");
    var newElement = document.createElement("button");
    newElement.setAttribute('class', "w3-col l3 w3-button");
    newElement.setAttribute('onclick', "songSelect(" + i + ")")
    newElement.innerHTML = i;
    p.appendChild(newElement);

    var p = document.getElementById("Pattern");
    var newElement = document.createElement("button");
    newElement.setAttribute('class', "w3-col l3 w3-button");
    newElement.setAttribute('onclick', "patternSelect(" + i + ")")
    newElement.innerHTML = i;
    p.appendChild(newElement);

    var p = document.getElementById("Master");
    var newElement = document.createElement("button");
    newElement.setAttribute('class', "w3-col l3 w3-button");
    newElement.setAttribute('onclick', "masterSelect(" + i + ")")
    newElement.innerHTML = i;
    p.appendChild(newElement);
  }
  for (i = 0; i < 16; i++) {
    var p = document.getElementById("Mix");
    var newElement = document.createElement("button");
    newElement.setAttribute('class', "w3-col l3 w3-button");
    newElement.setAttribute('onclick', "mixSelect(" + i + ")")
    newElement.innerHTML = i;
    p.appendChild(newElement);
  }
}

function onloadFunction() {
  enableMidi();
  buildLibrarian();
}

// call onload function
window.onload = onloadFunction();

// webapp install
let deferredPrompt;
const addBtn = document.querySelector('.add-button');
const addPanel = document.querySelector('.add-panel');
addPanel.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
  console.log("[Main] A2HS Triggered")
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen
  addPanel.style.display = 'block';

  addBtn.addEventListener('click', (e) => {
    // hide our user interface that shows our A2HS button
    addPanel.style.display = 'none';
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
