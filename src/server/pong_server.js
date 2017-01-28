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
  constructor(wss) {
    this.game_instances = {};

    this.wss = wss;

    wss.on('connection', function connection(ws) {
      ws.on('message', (message) => {
        let data = JSON.parse(message);
        console.log(JSON.stringify(data, null, 4));
      });

      //ws.send('something');
    });
  }
}

module.exports = PongServer;
