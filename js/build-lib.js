
/*****************************************************
build the librarian page
******************************************************/

function buildLibrarian() {
  var i;
  var j;
  var tabs = [
    "Voice-Pre-1", "Voice-Pre-2", "Voice-Pre-3", "Voice-Pre-4",
    "Voice-Pre-5", "Voice-Pre-6", "Voice-Pre-7", "Voice-Pre-8",
    "Voice-Pre-9", "Voice-User-1", "Voice-User-2", "Voice-User-3",
    "Performance-User-1", "Performance-User-2", "Song",
    "Pattern", "Master"
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

  // add sync dropdown options
  for (i = 0; i < 9; i++) {
    var p = document.getElementById("syncDropdown");
    var newElement = document.createElement("a");
    newElement.setAttribute('class', "w3-bar-item w3-button");
    newElement.setAttribute('href', "#")
    newElement.setAttribute('onclick', "sync1BankVoices(" + i + ")")
    newElement.innerHTML = tabs[i]
    p.appendChild(newElement);
  }
  for (i = 9; i < 12; i++) {
    var p = document.getElementById("syncDropdown");
    var newElement = document.createElement("a");
    newElement.setAttribute('class', "w3-bar-item w3-button");
    newElement.setAttribute('href', "#")
    newElement.setAttribute('onclick', "sync1BankVoices(" + (i + 1) + ")")
    newElement.innerHTML = tabs[i]
    p.appendChild(newElement);
  }
  for (i = 12; i < 14; i++) {
    var p = document.getElementById("syncDropdown");
    var newElement = document.createElement("a");
    newElement.setAttribute('class', "w3-bar-item w3-button");
    newElement.setAttribute('href', "#")
    newElement.setAttribute('onclick', "sync1BankPerfs(" + (i - 11) + ")")
    newElement.innerHTML = tabs[i]
    p.appendChild(newElement);
  }
  for (i = 17; i < 18; i++) {
    var p = document.getElementById("syncDropdown");
    var newElement = document.createElement("a");
    newElement.setAttribute('class', "w3-bar-item w3-button");
    newElement.setAttribute('href', "#")
    newElement.setAttribute('onclick', "syncMasters()")
    newElement.innerHTML = tabs[i]
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
      newElement.setAttribute('id', "voice-" + (j + 1) + "-" + (i + 1))
      newElement.innerHTML = i + 1;
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
      newElement.setAttribute('id', "perf-" + (j - 11) + "-" + (i + 1))
      newElement.innerHTML = i + 1;
      p.appendChild(newElement);
    }
  }

  // add pattern/song
  for (i = 0; i < 64; i++) {
    var p = document.getElementById("Song");
    var newElement = document.createElement("button");
    newElement.setAttribute('class', "w3-col l15 w3-button w3-theme-l4 w3-border-white");
    newElement.setAttribute('onclick', "songSelect(" + i + ")")
    newElement.setAttribute('id', "song-" + (i + 1))
    newElement.innerHTML = i + 1;
    p.appendChild(newElement);

    var p = document.getElementById("Pattern");
    var newElement = document.createElement("button");
    newElement.setAttribute('class', "w3-col l15 w3-button w3-theme-l4 w3-border-white");
    newElement.setAttribute('onclick', "patternSelect(" + i + ")")
    newElement.setAttribute('id', "pattern-" + (i + 1))
    newElement.innerHTML = i + 1;
    p.appendChild(newElement);
  }

  // add masters
  for (i = 0; i < 128; i++) {
    var p = document.getElementById("Master");
    var newElement = document.createElement("button");
    newElement.setAttribute('class', "w3-col l15 w3-button w3-theme-l4 w3-border-white");
    newElement.setAttribute('onclick', "masterSelect(" + i + ")")
    newElement.setAttribute('id', "master-" + (i + 1))
    newElement.innerHTML = i + 1;
    p.appendChild(newElement);
  }
}
