WebMidi.enable(function (err) {
    if (err) {
        console.log("WebMidi could not be enabled.", err);
    } else {
        console.log("Inputs : " + WebMidi.inputs);
        console.log("Outputs : " + WebMidi.outputs);

        var input = WebMidi.getInputByName("MIDI function");
        var output = WebMidi.getOutputByName("MIDI function");

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
}, true);

function getData() {
    console.log("to do: get data and set all values")
}

function setData() {
    console.log("to do: set data")
}

function remote() {
    for (let el of document.querySelectorAll('.cc')) el.style.display = 'none';
    for (let el of document.querySelectorAll('.remote')) el.style.display = 'block';
}

function cc() {
    for (let el of document.querySelectorAll('.remote')) el.style.display = 'none';
    for (let el of document.querySelectorAll('.cc')) el.style.display = 'block';
}

function changeType(value) {
    eval(value);
}

