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

