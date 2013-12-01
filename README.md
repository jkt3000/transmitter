# Transmitter

A Chrome extension that adds a context menu item that lets you send a magnet torrent link to your remote Transmission server.


## installing

1. Download git repo locally
2. In Chrome, go to your `tools > extensions` page
3. Add the extension to your Extensions by clicking on `Load unpacked extension...` button
4. Navigate to the directory of the transmitter repo and select it
5. Extension should now be added

## Setup

1. Ensure you have your transmission set up to allow external web access and you know your username/password
2. In Chrome, click on the `Options` link for the Transmitter extension
3. Fill out the host, port, username and password fields.
    4. Host should be just the domain name of your tranmission server that you can access globally (or locally if you just plan on using transmission within your own network). It's handy to a have a dynamicDNS routing to your server (eg: myhost.dyndns.org)
    5. Port is the transmission port (default is 9091)
    6. Username/password is what you set it up as    

4. Enter the local paths you want map movies and TV downloads to.
    1. eg: /Volumes/video/movies is the path I want my movies to download to on my transmission server
  

## Using

1. Navigate to your favorite site. Right-click on any magnet link, and the you can select to send that link to your remote transmission site and download to your movies or TV path

2. View your transmission server and you should see it downloading. Enjoy!



