$(() => {
  console.log('Welcome to the controller');

  var game_socket = new WebSocket(socket_url());

  game_socket.onmessage = function(message) {
    console.log(message.data);
  };

  $('#connect-button').click(() => {
    let data = {
      type: 'player-connection',
      data: {
        token: $('input[name="game-token"]').val()
      }
    };

    game_socket.send(JSON.stringify(data));
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
