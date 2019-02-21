// add listeners on selected input device
function inputDeviceSelected(val) {
    alert("The input value has changed. The new value is: " + val);

    console.log("Inputs : " + WebMidi.inputs);

    var input = WebMidi.getInputByName(val);

    // Listen for a 'note on' message on all channels
    input.addListener('noteon', "all",
        function (e) {
            console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ").");
            document.getElementById("demo").innerHTML = e.note.name + e.note.octave;
        }
    );

    // Listen to pitch bend message on channel all channels
    input.addListener('pitchbend', 'all',
        function (e) {
            console.log("Received 'pitchbend' message.", e);
            document.getElementById("demo").innerHTML = e;
        }
    );

    // Listen to control change message on all channels
    input.addListener('controlchange', "all",
        function (e) {
            console.log("Received 'controlchange' message.", e);
            document.getElementById("demo").innerHTML = e;
        }
    );

    // Listen to csysex message on all channels
    input.addListener('sysex', "all",
        function (e) {
            console.log("Received 'sysex' message.", e);
            document.getElementById("demo").innerHTML = e;
        }
    );
}

// to be used for getting current data via sysex
function getData() {
    console.log("to do: get data and set all values")
}

// to be used for sending sysex, currently prints data 
function setData() {
    console.log(document.getElementById("knobName1").value);
    console.log(document.getElementById("cc1").value);
    console.log(document.getElementById("knobName2").value);
    console.log(document.getElementById("cc2").value);
    console.log(document.getElementById("knobName3").value);
    console.log(document.getElementById("cc3").value);
    console.log(document.getElementById("knobName4").value);
    console.log(document.getElementById("cc4").value);
    console.log(document.getElementById("knobName5").value);
    console.log(document.getElementById("cc5").value);
    console.log(document.getElementById("knobName6").value);
    console.log(document.getElementById("cc6").value);
    console.log(document.getElementById("knobName7").value);
    console.log(document.getElementById("cc7").value);
    console.log(document.getElementById("knobName8").value);
    console.log(document.getElementById("cc8").value);
    console.log(document.getElementById("knobName9").value);
    console.log(document.getElementById("cc9").value);
    console.log(document.getElementById("knobName10").value);
    console.log(document.getElementById("cc10").value);
    console.log(document.getElementById("knobName11").value);
    console.log(document.getElementById("cc11").value);
    console.log(document.getElementById("knobName12").value);
    console.log(document.getElementById("cc12").value);
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
            console.log("Inputs : " + WebMidi.inputs);
            console.log("Outputs : " + WebMidi.outputs);

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
                option.text = option.value = WebMidi.inputs[i].name;
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

function onLoadFunction() {
    getMidiDevices();
}

window.onload = onLoadFunction();