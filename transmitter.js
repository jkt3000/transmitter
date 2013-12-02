// Transmitter.js


var url = localStorage["transmissionURL"] || "localhost:9091";
var baseURL = url + "/transmission/rpc";
var paths   = {
  'movies': localStorage["transmission_movie_path"],
  'tv' : localStorage["transmission_tv_path"]
};


// The onClicked callback function.
function onClickHandler(info, tab) {
  var filename = info.linkUrl;
  submitToTransmission(filename, info.menuItemId);
};

function submitToTransmission(filename, type) {
  console.log("Submit to transmission " + filename);
  $.ajax({
    url: baseURL,
    method: 'GET',
    type: 'html',
    error: function(jq, status, err) {
      var sessionId = extractSessionId(jq.responseText);
      var download_path = paths[type] || paths['movies'];
      console.log("Getting session id " + sessionId);
      sendTorrent(sessionId, filename, download_path);
    }
  });
};

function sendTorrent(sessionId, filename, download_path) {
  var headers = {'X-Transmission-Session-Id': sessionId};
  var options = {
    'method' : 'torrent-add',
    'arguments' : {
      'filename' : filename,
      'download-dir' : download_path
    }
  }

  console.log("Sending to transmission " + JSON.stringify(options));

  $.ajax({
    url: baseURL,
    method: 'POST',
    type: 'json',
    data: JSON.stringify(options),
    headers: headers,
    success: function(data) {
      console.log(["Submitted", data]);
      var result, msg;
      if (data.result == 'success') {
        result = "Success";
        msg = "Successfully added torrent: " + data.arguments['torrent-added'].name;
      } else if (data.result == 'duplicate torrent') {
        result = "Duplicate";
        msg = "Torrent called '"+data.arguments['torrent-duplicate'].name + "' already exists.";
      } else {
        result = data.result;
        msg = JSON.stringify(data.arguments);
      }

      var notify = webkitNotifications.createNotification(
        "icons/Transmission_64.png",
        "Send to Transmission: " + result,
        msg
      );  
      notify.show();
      console.log("Created notification");
    }
  });
};

function extractSessionId(text) {
  var regex = /X-Transmission-Session-Id: (.*)<\/code>/;
  return text.match(regex)[1];
};

chrome.contextMenus.onClicked.addListener(onClickHandler);

var parent = chrome.contextMenus.create({
  "title": "Send to Transmission",
  "contexts":['link']
});

chrome.contextMenus.create({
  "title": "Download to movies",
  "id": "movies",
  "contexts":['link'],
  "parentId": parent
});

chrome.contextMenus.create({
  "title": "Download to TV",
  "id": "tv",
  "contexts":['link'],
  "parentId": parent
});
