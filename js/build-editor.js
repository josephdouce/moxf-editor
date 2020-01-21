function loadEditor(high, mid, low) {

  var e = document.getElementById("Edit");

  //e.firstElementChild can be used. 
  var child = e.lastElementChild;
  while (child) {
    e.removeChild(child);
    child = e.lastElementChild;
  }

  var key = toHexString([high, mid, low]);
  var request = indexedDB.open('db1', 1);

  request.onerror = function (event) {
    console.log("[IndexedDB] Unable to Open DB");
  };

  request.onsuccess = function (event) {
    console.log("[IndexedDB] DB Opened")
    var db = event.target.result;
    var transaction = db.transaction('store1', 'readwrite');
    var dbstore = transaction.objectStore('store1');
    var data = dbstore.get(key);

    data.onerror = function (event) {
      console.log("[IndexedDB] Unable to find " + key);
    }

    data.onsuccess = function (event) {
      var i;
      for (i = 0; i < event.target.result.length; i++) {
        var p = document.getElementById("Edit");
        var newElement = document.createElement("p");
        newElement.innerHTML = toHexString(event.target.result[i].slice(8, -2));
        p.appendChild(newElement);
      }
    }
  };
}
