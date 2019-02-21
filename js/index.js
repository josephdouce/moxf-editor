// add listeners on selected input device
function inputDeviceSelected() {
    intputSelected = document.getElementById("midiIn").value;
    var input = WebMidi.getInputByName(intputSelected);

    // Listen for a 'note on' message on all channels
    input.addListener('noteon', "all",
        function (e) {
            gotMIDImessage(e.note.name + e.note.octave); 
        }
    );

    // Listen to pitch bend message on channel all channels
    input.addListener('pitchbend', 'all',
        function (e) {
            gotMIDImessage(e);
        }
    );

    // Listen to control change message on all channels
    input.addListener('controlchange', "all",
        function (e) {
            gotMIDImessage(e);
        }
    );

    // Listen to csysex message on all channels
    input.addListener('sysex', "all",
        function (e) {
            gotMIDImessage(e.data)
        }
    );
}

// to be used for getting current data via sysex
function getData() {
    console.log("to do: get data and set all values")
}

// to be used for sending sysex, currently prints data 
function setData() {
    outputSelected = document.getElementById("midiOut").value;
    var output = WebMidi.getOutputByName(outputSelected);
    //yamaha manufacturer and model codes
    yamahaSysex = [67, 16, 127, 28]
    //send some test data
    output.sendSysex(yamahaSysex, [119, 127, 1, 1, 0, 1, 1, 5, 71, 69, 78, 79, 83, 123]);
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