/*****************************************************
main js file
******************************************************/

if (!('indexedDB' in window)) {
  console.log('This browser doesn\'t support IndexedDB');
}


/*****************************************************
global variables
******************************************************/


var output;
var input;
var bulkFlag = false; // set to true when a bulk header is recieved and returned to false when footer is recieved
var tmpBulkSysexArray = []; // used to temporarily store sysex messages recievced after a bulk header until the whole message is recieved


/*****************************************************
midi functions
******************************************************/

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

// triggered on change of output
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


/*****************************************************
page navigation functions
******************************************************/

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


/*****************************************************
daw functions
******************************************************/

function presetSelected(data) {
  if (1 > data.value > 50) {
    data.value = 1
  }
  var preset = data.value - 1;
  // set preset
  sysexParameterSend(0x01, 0x20, 0x00, preset);
  // get data
  requestDawData();
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

// update name of preset on change    todo: replace with bulk send
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

// update name of knob on change      todo: replace with bulk send
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

// update cc on change                todo: replace with bulk send
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

// store daw data                     todo: replace with bulk send
function store() {
  sysexParameterSend(0x01, 0x22, 0x00, []);
}

// get data for selected poreset
function requestDawData() {
  var presetAddress = document.getElementById('preset').value - 1;
  // get preset data
  console.log("[Main] Requesting Data for DAW Preset: " + document.getElementById('preset').value);
  sysexBulkDumpRequest(0x0E, 0x60, presetAddress);
}

/*****************************************************
helper functions
******************************************************/

function toHexString(byteArray) {
  return Array.from(byteArray, function (byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2).toUpperCase();
  }).join(', ')
}

// display raw midi data on MIDI page
function printMidi(data) {
  var dataList = document.querySelector('#midi-data ul')
  var newItem = document.createElement('li');
  newItem.innerHTML = data;
  dataList.insertBefore(newItem, dataList.firstChild);
}

/*****************************************************
process data functions
******************************************************/

// process a bulk sysex array 
function processBulkSysex(dataArray, store = true) {

  var j;
  var bulkHeader = toHexString([dataArray[0][8], dataArray[0][9], dataArray[0][10]]);

  // add data to db
  if (store == true) {
    var request = indexedDB.open('db1', 1);

    request.onerror = function (event) {
      console.log("Unable to open 'db1'");
    };
    request.onsuccess = function (event) {
      console.log("[IndexedDB] DB Opened")
      var db = event.target.result;
      var transaction = db.transaction('store1', 'readwrite');
      var dbstore = transaction.objectStore('store1');
      dbstore.add(dataArray, bulkHeader);
      console.log("[IndexedDB] \"" + bulkHeader + "\" Added to DB")
      db.close();
      console.log("[IndexedDB] DB Closed")
    };
    request.onupgradeneeded = function (event) {
      var db = event.target.result;
      db.createObjectStore('store1');
    };
  }

  switch (dataArray[0][9]) {
    case 0x00:
    case 0x01:
    case 0x02:
    case 0x03:
    case 0x04:
    case 0x05:
    case 0x06:
    case 0x07:
    case 0x08:
      console.log("[Main] Voice Bank: " + (dataArray[0][9] + 1) + ", Preset: " + (dataArray[0][10] + 1) + " Processed")
      var name = String.fromCharCode.apply(String, dataArray[1].slice(11, 31));
      var librarianId = "voice-" + (dataArray[0][9] + 1) + "-" + (dataArray[0][10] + 1);
      console.log(librarianId, name);
      document.getElementById(librarianId).innerHTML = name;
      break;
    case 0x0A:
    case 0x0B:
    case 0x0C:
      console.log("[Main] Voice Bank: " + dataArray[0][9] + ", Preset: " + (dataArray[0][10] + 1) + " Processed")
      var name = String.fromCharCode.apply(String, dataArray[1].slice(11, 31));
      var librarianId = "voice-" + dataArray[0][9] + "-" + (dataArray[0][10] + 1);
      console.log(librarianId, name);
      document.getElementById(librarianId).innerHTML = name;
      break;
    case 0x20:
      console.log("[Main] Drum Preset: " + (dataArray[0][10] + 1) + " Processed")
      break;
    case 0x21:
      console.log("[Main] Drum GM: " + (dataArray[0][10] + 1) + " Processed")
      break;
    case 0x28:
      console.log("[Main] Drum User: " + (dataArray[0][10] + 1) + " Processed")
      break;
    case 0x30:
      console.log("[Main] Mix Voice: " + (dataArray[0][10] + 1) + " Processed")
      break;
    case 0x31:
      console.log("[Main] Mix Part: " + (dataArray[0][10] + 1) + " Processed")
      break;
    case 0x40:
    case 0x41:
      console.log("[Main] Performance Bank: " + (dataArray[0][9] - 0x3F) + ", Preset: " + (dataArray[0][10] + 1) + " Processed")
      var name = String.fromCharCode.apply(String, dataArray[1].slice(11, 31));
      var librarianId = "perf-" + (dataArray[0][9] - 0x3F) + "-" + (dataArray[0][10] + 1);
      document.getElementById(librarianId).innerHTML = name;
      break;
    case 0x60:
      console.log("[Main] DAW Preset: " + dataArray[0][10] + " Processed")
      for (j = 1; j < dataArray.length - 1; j++) {
        messageData = dataArray[j];
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
      console.log("[Main] Master Preset:" + (dataArray[0][10] + 1) + " Processed")
      var name = String.fromCharCode.apply(String, dataArray[1].slice(11, 31));
      var librarianId = "master-" + (dataArray[0][10] + 1);
      document.getElementById(librarianId).innerHTML = name;
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
            requestDawData();
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
          console.log("[Sysex] Bulk Header Recieved")
          bulkFlag = true
        }

        // if no header was recieved process one line bulk message immediatly
        if (bulkFlag != true) {
          console.log("[Sysex] Bulk Message Recieved")
          processBulkSysex(tmpBulkSysexArray);
        }

        // if header was recieved add to bulk array until bulk bulk footer is recieved.
        if (bulkFlag == true) {
          tmpBulkSysexArray.push(messageData);
        }

        // if bulk footer is recieved process the block
        if (messageData[8] == 0x0F) {
          processBulkSysex(tmpBulkSysexArray);
          tmpBulkSysexArray = [];
          bulkFlag = false;
        }
        break;
      case 0x10: // single parameter
        // if not bulk message process immediatly
        console.log("[Sysex] Unknown Parameter Recieved " + messageData)
        processParameterSysex(messageData)
        break;
    }
  }
}


/*****************************************************
indexeddb 
******************************************************/

function loadDataStore() {
  var i;
  var request = indexedDB.open('db1', 1);

  request.onerror = function (event) {
    console.log("[IndexedDB] Unable to Open DB");
  };
  request.onsuccess = function (event) {
    console.log("[IndexedDB] DB Opened")
    var db = event.target.result;
    var transaction = db.transaction('store1', 'readwrite');
    var dbstore = transaction.objectStore('store1');
    dbstore.openCursor().onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor) {
        processBulkSysex(cursor.value, false)
        cursor.continue();
      } else {
        db.close();
        console.log("[IndexedDB] DB Closed")
      }
    }
  };

  request.onupgradeneeded = function (event) {
    var db = event.target.result;
    db.createObjectStore('store1');
  };

}

/*****************************************************
main app sequence
******************************************************/

function onloadFunction() {
  enableMidi();
  buildMidi();
  buildDaw();
  buildLibrarian();
  loadDataStore();
}

// call onload function
window.onload = onloadFunction();

/*****************************************************
webapp functions
******************************************************/

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
