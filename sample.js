// Transmitter.js


var url = localStorage["transmissionURL"] || "localhost:9091";
var baseURL = url + "/transmission/rpc";
var paths   = {
  'movies': localStorage["transmission_movie_path"],
  'tv' : localStorage["transmission_tv_path"]
};


// The onClicked callback function.
function onClickHandler(info, tab) {
  console.log(info);
  var filename = info.linkUrl;
  if (filename.substring(0,6) != 'magnet') {
    console.log(filename + " is not a magent torrent link");
    return;
  }

  submitToTransmission(filename, info.menuItemId);
};

function submitToTransmission(filename, type) {
  $.ajax({
    url: baseURL,
    method: 'GET',
    type: 'html',
    error: function(jq, status, err) {
      var sessionId = extractSessionId(jq.responseText);
      var download_path = paths[type] || paths['movies'];
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
      'torrent-dir' : download_path
    }
  }

  console.log("Send to transmission " + JSON.stringify(options));

  $.ajax({
    url: baseURL,
    method: 'POST',
    type: 'json',
    data: JSON.stringify(options),
    headers: headers,
    success: function(data) {
      console.log(data.result);      
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
