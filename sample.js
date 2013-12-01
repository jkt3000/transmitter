// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var baseURL = "http://user:pass@yoursite.com:9091/transmission/rpc";
var paths   = {
  'movies': '/Volumes/video/downloads',
  'tv' : '/Volumes/video/TV'
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
