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
    }
}, true);

function getData() {
    console.log("to do: get data and set all values")
}

function setData() {
    console.log("to do: set data")
}

function remote() {
    console.log("to do: change to remote mode")
    for (let el of document.querySelectorAll('.CC')) el.style.visibility = 'hidden';
}

function cc() {
    console.log("to do: change to cc mode")
    for (let el of document.querySelectorAll('.CC')) el.style.visibility = 'visible';
}

function changeType(value) {
    eval(value);
}