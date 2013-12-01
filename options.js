// Saves options to localStorage.
function save_options() {
  var host = $('#transmission_host').val();
  var port = $('#transmission_port').val();
  var user = $('#transmission_user').val();
  var pass = $('#transmission_pass').val();

  var url = "http://" + user + ":" + pass + "@" + host + ":" + port;
  console.log(url);
  localStorage["transmissionURL"] = url;
  localStorage["transmission_host"] = host;
  localStorage["transmission_port"] = port;
  localStorage["transmission_user"] = user;
  localStorage["transmission_pass"] = pass;
  
  
  $('#status').html("Options saved.");
  setTimeout(function(){
    $('#status').fadeOut();
  }, 1000);
};

// Restores select box state to saved value from localStorage.
function restore_options() {
  var url = localStorage["transmissionURL"];
  if (!url) { return; }
  
  $('#transmission_host').val(localStorage["transmission_host"]);
  $('#transmission_port').val(localStorage["transmission_port"]);
  $('#transmission_user').val(localStorage["transmission_user"]);
  $('#transmission_pass').val(localStorage["transmission_pass"]);
};

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);

