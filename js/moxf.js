
/*****************************************************
standard sysex commands for moxf 
******************************************************/

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

/*****************************************************
select commands
******************************************************/
function voiceSelect(LSB, i) {
  sysexParameterSend(0x0A, 0x00, 0x01, 0)
  output.sendControlChange(0, 63);
  output.sendControlChange(32, LSB);
  output.sendProgramChange(i);
  if (LSB < 9) {
    sysexBulkDumpRequest(0x0E, LSB, i);
    loadEditor(0x0E, LSB, i);
  }
  if (!(LSB < 9) & LSB < 12) {
    sysexBulkDumpRequest(0x0E, LSB + 1, i);
    loadEditor(0x0E, LSB + 1, i);
  }
}

function performanceSelect(LSB, i) {
  sysexParameterSend(0x0A, 0x00, 0x01, 1)
  output.sendControlChange(0, 63);
  output.sendControlChange(32, LSB);
  output.sendProgramChange(i);
  sysexBulkDumpRequest(0x0E, LSB, i);
  loadEditor(0x0E, LSB, i);
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
  sysexBulkDumpRequest(0x0E, 0x70, i);
  loadEditor(0x0E, 0x70, i);
}

/*****************************************************
sync commands
******************************************************/
function syncMasters() {
  var i;
  for (i = 0; i < 128; i++) {
    sysexBulkDumpRequest(0x0E, 0x70, i);
  }
}

function syncPerfs() {
  var i;
  var j;
  for (j = 0x40; j < 0x42; j++) {
    for (i = 0; i < 128; i++) {
      sysexBulkDumpRequest(0x0E, j, i);
    }
  }
}

function sync1BankPerfs(bank) {
  var i;
  for (i = 0; i < 128; i++) {
    sysexBulkDumpRequest(0x0E, bank + 0x3F, i);
  }
}

function syncVoices() {
  var i;
  var j;
  for (j = 0; j < 9; j++) {
    for (i = 0; i < 128; i++) {
      sysexBulkDumpRequest(0x0E, j, i);
    }
  }
}

function sync1BankVoices(bank) {
  var i;
  for (i = 0; i < 128; i++) {
    sysexBulkDumpRequest(0x0E, bank, i);
  }
}
