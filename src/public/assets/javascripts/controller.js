$(() => {
  console.log('Welcome to the controller');

  var game_socket = new WebSocket(socket_url());

  $('#connect-button').click(() => {
    console.log('foo');
  });
});

var socket_url = function() {
  var loc = window.location, new_uri;
  if (loc.protocol === "https:") {
    new_uri = "wss:";
  } else {
    new_uri = "ws:";
  }
  new_uri += "//" + loc.host;

  return new_uri;
}
