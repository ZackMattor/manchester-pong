$(() => {
  console.log('Welcome to the controller');

  var game_socket = new WebSocket(socket_url());

  game_socket.onmessage = function(message) {
    console.log(message);
    let data = JSON.parse(message.data);

    switch(data.route) {
      case 'ping':
        console.log('?');
        game_socket.send(JSON.stringify({route: 'pong', data: null}));
        break;
    }
    console.log(message.data);
  };
});

var socket_url = function() {
  var loc = window.location, new_uri;
  if (loc.protocol === "https:") {
    new_uri = "wss:";
  } else {
    new_uri = "ws:";
  }
  new_uri += "//" + loc.host + '/game';

  return new_uri;
}
