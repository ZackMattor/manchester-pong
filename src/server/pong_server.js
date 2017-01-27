static WebSocket = require('ws');

// Inbound
// {
//   game_id: 'sadf-sa-asdf',
//   type: 'key-state' || 'heartbeat' || 'disconnect' || 'register',
//   data: {
//     paddle-up: true,
//     paddle-down: false
//   }
// }
//
// Outbound - player
// {
//   type: 'player-connected' || 'player-disconnected' || 'game-state' || 'register',
//   data: {
//     paddle-up: true,
//     paddle-down: false
//   }
// }
//
// Outbound - game-instance
// {
//   type: 'player-connected' || 'player-disconnected' || 'game-state' || 'register',
//   data: {
//     paddle-up: true,
//     paddle-down: false
//   }
// }

class PongServer {
  constructor() {
    this.game_instances = {};

    this.wss = new WebSocket.Server({
      perMessageDeflate: false,
      port: 8080
    });

    wss.on('connection', function connection(ws) {
      ws.on('message', function incoming(message) {
        console.log('received: %s', message);
      });

      ws.send('something');
    });
  }


}

exports.default = PongServer;
