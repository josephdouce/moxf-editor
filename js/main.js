if (!('indexedDB' in window)) {
  console.log('This browser doesn\'t support IndexedDB');
}

var output;
var input;
var bulkFlag = false;
var bulkSysexArray = [];

function sysexDumpSendTest() {
  sysexBulkDumpSend(14, 64, 0);
  sysexBulkDumpSend(48, 0, 0, [77, 101, 109, 111, 114, 105, 101, 115, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 64, 0, 64, 64, 64, 64, 64, 64, 0, 64, 64, 64, 64, 0, 0, 64, 64, 0, 64, 64, 64, 0, 64, 64, 0, 80, 64, 1, 127, 127, 0, 0, 1, 1, 0, 60, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 32, 0, 15]);
  sysexBulkDumpSend(15, 64, 0);
}

function sysexBulkDumpSend(high, mid, low, data = []) {
  var byteCount1 = 0x00;
  var byteCount2 = data.length + 4;
  var checksum = ~[0x00, high, mid, low].concat(data).reduce((a, b) => a + b, 0) + 1 & 0x7F
  try {
    output.sendSysex(0x43, [0x00, 0x7F, 0x1C, byteCount1, byteCount2, 0x00, high, mid, low].concat(data).concat(checksum));
  } catch (err) {
    console.log(err);
  }
}

function sysexParameterSend(high, mid, low, data = []) {
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
            printMidi(e.target.name + ", " + e.type + ", " + toHexString(e.data));
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
    console.log("[Main] No MIDI Output")
    console.log(err);
  }
}

// funcion for change of cc/remote dropdown
function changeType() {
  var type = document.getElementById("ccRemote").value;
  if (type == "cc") {
    for (let el of document.querySelectorAll('.remote')) el.style.display = 'none';
    for (let el of document.querySelectorAll('.cc')) el.style.display = 'block';
    sysexParameterSend(0x01, 0x00, 0x19, 0x01);
  } else if (type == "remote") {
    for (let el of document.querySelectorAll('.cc')) el.style.display = 'none';
    for (let el of document.querySelectorAll('.remote')) el.style.display = 'block';
    sysexParameterSend(0x01, 0x00, 0x19, 0x00);
  }
}

// request enable MIDI in broweser and wait for user response before proceeding
async function enableMidi() {
  console.log("[Main] Enabling MIDI")

  var promise = new Promise((resolve, reject) => {
    WebMidi.enable(function (err) {
      if (err) {
        console.log("[Main] WebMidi could not be Enabled.", err);
      } else {
        resolve();
        console.log("[Main] WebMidi Enabled");
      }
    }, true);
  });

  // wait for midi to be enabled
  await promise;

  WebMidi.addListener('connected',
    function (e) {
      console.log("[Main] New Device Connected")
      getMidiDevices();
      updateListeners();
      outputSelected();
    }
  );

  WebMidi.addListener('disconnected',
    function (e) {
      console.log("[Main] Device Disonnected")
      getMidiDevices();
    }
  );

  getMidiDevices();
  updateListeners();
  outputSelected();

}

// get available midi devices and populate dropdowns 
function getMidiDevices() {
  console.log("[Main] Getting MIDI Devices")

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
    tablinks[i].className = tablinks[i].className.replace(" w3-grey", "");
  }
  document.getElementById(tabName).style.display = "block";
  event.currentTarget.className += " w3-grey";
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
  sysexParameterSend(0x01, 0x20, 0x00, preset);
  // get data
  requestData();
}

function presetNameChange(data) {
  // set preset name
  for (i = 0x00; i < 0x0C; i++) {
    if (data.value[i] == undefined) {
      sysexParameterSend(0x01, 0x00, i, 0x20);
    } else {
      sysexParameterSend(0x01, 0x00, i, String(data.value[i]).charCodeAt(0));
    }
  }
  for (i = 0x0D; i < 0x19; i++) {
    if (data.value[i] == undefined) {
      sysexParameterSend(0x01, 0x00, i, 0x20);
    } else {
      sysexParameterSend(0x01, 0x00, i, String(data.value[i]).charCodeAt(0));
    }
  }
}

function knobNameChange(data) {
  var knobAddress = parseInt(data.id[8]) + 15;
  for (i = 0x09; i < 0x18; i++) {
    if (data.value[i - 9] == undefined) {
      sysexParameterSend(0x01, knobAddress, i, 0x20);
    } else {
      sysexParameterSend(0x01, knobAddress, i, String(data.value[i - 9]).charCodeAt(0));
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
  sysexParameterSend(0x01, knobAddress, 0x18, value);
}

function store() {
  sysexParameterSend(0x01, 0x22, 0x00, []);
}

function requestData() {
  var presetAddress = document.getElementById('preset').value - 1;
  // get preset data
  console.log("[Main] Requesting Data for DAW Preset: " + document.getElementById('preset').value);
  sysexBulkDumpRequest(0x0E, 0x60, presetAddress);
}

function toHexString(byteArray) {
  return Array.from(byteArray, function (byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2).toUpperCase();
  }).join(', ')
}

// process a bulk sysex array 
function processBulkSysex(bulkSysexArray) {
  var j;
  var bulkHeader = toHexString([bulkSysexArray[0][8], bulkSysexArray[0][9], bulkSysexArray[0][10]]);

  // add data to db
  var request = indexedDB.open('db1', 1);
  request.onsuccess = function (event) {
    var db = event.target.result;
    var transaction = db.transaction('store1', 'readwrite');
    var dbstore = transaction.objectStore('store1');
    dbstore.add(bulkSysexArray, bulkHeader);
  };
  request.onupgradeneeded = function (event) {
    var db = event.target.result;
    db.createObjectStore('store1');
  };

  switch (bulkSysexArray[0][9]) {
    case 0x01:
    case 0x02:
    case 0x03:
    case 0x04:
    case 0x05:
    case 0x06:
    case 0x07:
    case 0x08:
    case 0x09:
    case 0x0A:
    case 0x0B:
    case 0x0C:
      console.log("[Main] Voice Bank: " + (bulkSysexArray[0][9] + 1) + ", Preset: " + (bulkSysexArray[0][10] + 1))
      break;
    case 0x20:
      console.log("[Main] Drum Preset: " + (bulkSysexArray[0][10] + 1))
      break;
    case 0x21:
      console.log("[Main] Drum GM: " + (bulkSysexArray[0][10] + 1))
      break;
    case 0x28:
      console.log("[Main] Drum User: " + (bulkSysexArray[0][10] + 1))
      break;
    case 0x31:
      console.log("[Main] Mix: " + (bulkSysexArray[0][10] + 1))
      break;
    case 0x40:
    case 0x41:
      console.log("[Main] Performance Bank: " + (bulkSysexArray[0][9] - 0x3F) + ", Preset: " + (bulkSysexArray[0][10] + 1))
      break
    case 0x60:
      console.log("[Main] DAW Preset: " + bulkSysexArray[0][10])
      for (j = 1; j < bulkSysexArray.length - 1; j++) {
        messageData = bulkSysexArray[j];
        switch (messageData[8]) { // address mid
          case 0x01: // daw 
            switch (messageData[9]) { // address low
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
      }
      break;
    case 0x70:
      console.log("[Main] Master Preset:" + (bulkSysexArray[0][10] + 1))
      break;
  }
}

// process a parameter change sysex message 
function processParameterSysex(messageData) {
  switch (messageData[6]) { // address high
    case 0x01: // daw 
      switch (messageData[7]) { // address mid
        case 0x20: // preset 
          if (document.getElementById("preset").value == (messageData[9] + 1)) {
            console.log("[Main] Preset Not Changed: " + document.getElementById("preset").value);
          } else {
            console.log("[Main] Loading New Preset: " + (messageData[9] + 1))
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
}

function sysexEventHandler(messageData) {
  // only process MOXF messages
  if (messageData[1] != 0x43 | messageData[3] != 0x7F | messageData[4] != 0x1C) {
    console.log("[Main] Unsupported Sysex Command Recieved")
  } else {
    switch (messageData[2]) { // type identifier
      case 0x00: // bulk
        // if bulk type & bulk header set bulk flag 
        if (messageData[8] == 0x0E) {
          bulkFlag = true
        }

        // if no header was recieved process one line bulk message immediatly
        if (bulkFlag != true) {
          console.log("[Main] Sysex Single Bulk Recieved")
          processBulkSysex(bulkSysexArray);
        }

        // if header was recieved add to bulk array until bulk bulk footer is recieved.
        if (bulkFlag == true) {
          bulkSysexArray.push(messageData);
        }

        // if bulk footer is recieved process the block
        if (messageData[8] == 0x0F) {
          console.log("[Main] Sysex Bulk Recieved")
          processBulkSysex(bulkSysexArray);
          bulkSysexArray = [];
          bulkFlag = false;
        }
        break;
      case 0x10: // single parameter
        // if not bulk message process immediatly
        console.log("[Main] Sysex Parameter Recieved")
        processParameterSysex(messageData)
        break;
    }
  }
}

// display raw midi data on MIDI page
function printMidi(data) {
  var dataList = document.querySelector('#midi-data ul')
  var newItem = document.createElement('li');
  newItem.innerHTML = data;
  dataList.insertBefore(newItem, dataList.firstChild);
}

function loadDataStore() {
  var i;
  var request = indexedDB.open('db1');
  request.onsuccess = function (event) {
    var db = request.result;
    var transaction = db.transaction('store1', 'readwrite');
    var dbstore = transaction.objectStore('store1');
    keys = dbstore.getAllKeys();
    keys.onsuccess = function () {
      for (i=0; i < 1; i++) {
        console.log(keys.result[i]);
        data = dbstore.get(keys.result[i])
        data.onsuccess = function () {
          console.log(data.result);
          processBulkSysex(data.result);
        }
      }
    };
  };
}

function voiceSelect(LSB, i) {
  sysexParameterSend(0x0A, 0x00, 0x01, 0)
  output.sendControlChange(0, 63);
  output.sendControlChange(32, LSB);
  output.sendProgramChange(i);
}

function performanceSelect(LSB, i) {
  sysexParameterSend(0x0A, 0x00, 0x01, 1)
  output.sendControlChange(0, 63);
  output.sendControlChange(32, LSB);
  output.sendProgramChange(i);
}

function songSelect(i) {
  sysexParameterSend(0x0A, 0x00, 0x01, 3)
  output.sendSongSelect(i);
}

function patternSelect(i) {
  sysexParameterSend(0x0A, 0x00, 0x01, 2)
  output.sendSongSelect(i);
}

function masterSelect(i) {
  sysexParameterSend(0x0A, 0x00, 0x01, 4)
  sysexParameterSend(0x0A, 0x00, 0x00, i)
}

function mixSelect(i) {
  output.sendControlChange(0, 63);
  output.sendControlChange(32, 60);
  output.sendProgramChange(i);
}

// build the midi page
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

//build the daw page
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

//build the librarian page
function buildLibrarian() {
  var i;
  var j;
  var tabs = [
    "Voice-Pre-1", "Voice-Pre-2", "Voice-Pre-3", "Voice-Pre-4",
    "Voice-Pre-5", "Voice-Pre-6", "Voice-Pre-7", "Voice-Pre-8",
    "Voice-Pre-9", "Voice-User-1", "Voice-User-2", "Voice-User-3",
    "Performance-User-1", "Performance-User-2", "Song",
    "Pattern", "Mix", "Master"
  ];

  // add tab pages 
  for (i = 0; i < tabs.length; i++) {
    var p = document.getElementById("Librarian");
    var newElement = document.createElement("div");
    newElement.setAttribute('class', "librarianTabPage");
    newElement.setAttribute('id', tabs[i])
    if (i > 0) {
      newElement.setAttribute('style', "display:none")
    }
    p.appendChild(newElement);
  }

  // add voice dropdown options
  for (i = 0; i < 12; i++) {
    var p = document.getElementById("voiceDropdown");
    var newElement = document.createElement("a");
    newElement.setAttribute('class', "w3-bar-item w3-button");
    newElement.setAttribute('href', "#")
    newElement.setAttribute('onclick', "openLibrarianTab('" + tabs[i] + "')")
    newElement.innerHTML = tabs[i]
    p.appendChild(newElement);
  }

  // add performance dropdown options
  for (i = 12; i < 14; i++) {
    var p = document.getElementById("performanceDropdown");
    var newElement = document.createElement("a");
    newElement.setAttribute('class', "w3-bar-item w3-button");
    newElement.setAttribute('href', "#")
    newElement.setAttribute('onclick', "openLibrarianTab('" + tabs[i] + "')")
    newElement.innerHTML = tabs[i]
    p.appendChild(newElement);
  }

  // add voices
  for (j = 0; j < 12; j++) {
    for (i = 0; i < 128; i++) {
      var p = document.getElementById(tabs[j]);
      var newElement = document.createElement("button");
      newElement.setAttribute('class', "w3-col l15 w3-button w3-theme-l4 w3-border-white");
      newElement.setAttribute('onclick', "voiceSelect(" + j + ", " + i + ")")
      newElement.innerHTML = i;
      p.appendChild(newElement);
    }
  }

  // add performances
  for (j = 12; j < 14; j++) {
    for (i = 0; i < 128; i++) {
      var p = document.getElementById(tabs[j]);
      var newElement = document.createElement("button");
      newElement.setAttribute('class', "w3-col l15 w3-button w3-theme-l4 w3-border-white");
      newElement.setAttribute('onclick', "performanceSelect(" + (64 - 12 + j) + ", " + i + ")")
      newElement.innerHTML = i;
      p.appendChild(newElement);
    }
  }

  // add pattern/song/masters
  for (i = 0; i < 128; i++) {
    var p = document.getElementById("Song");
    var newElement = document.createElement("button");
    newElement.setAttribute('class', "w3-col l15 w3-button w3-theme-l4 w3-border-white");
    newElement.setAttribute('onclick', "songSelect(" + i + ")")
    newElement.innerHTML = i;
    p.appendChild(newElement);

    var p = document.getElementById("Pattern");
    var newElement = document.createElement("button");
    newElement.setAttribute('class', "w3-col l15 w3-button w3-theme-l4 w3-border-white");
    newElement.setAttribute('onclick', "patternSelect(" + i + ")")
    newElement.innerHTML = i;
    p.appendChild(newElement);

    var p = document.getElementById("Master");
    var newElement = document.createElement("button");
    newElement.setAttribute('class', "w3-col l15 w3-button w3-theme-l4 w3-border-white");
    newElement.setAttribute('onclick', "masterSelect(" + i + ")")
    newElement.innerHTML = i;
    p.appendChild(newElement);
  }

  // add mixes
  for (i = 0; i < 16; i++) {
    var p = document.getElementById("Mix");
    var newElement = document.createElement("button");
    newElement.setAttribute('class', "w3-col l15 w3-button w3-theme-l4 w3-border-white");
    newElement.setAttribute('onclick', "mixSelect(" + i + ")")
    newElement.innerHTML = i;
    p.appendChild(newElement);
  }
}

function onloadFunction() {
  enableMidi();
  buildMidi();
  buildDaw();
  buildLibrarian();
  loadDataStore();
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
        console.log('User Accepted the A2HS Prompt');
      } else {
        console.log('User Dismissed the A2HS Prompt');
      }
      deferredPrompt = null;
    });
  });
});
