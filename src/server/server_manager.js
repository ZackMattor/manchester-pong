// Inbound
// {
//   game_id: 'sadf-sa-asdf',
//   route: 'key-state' || 'heartbeat' || 'disconnect' || 'register',
//   data: {
//     paddle-up: true,
//     paddle-down: false
//   }
// }
//
// Outbound - player
// {
//   route: 'player-connected' || 'player-disconnected' || 'game-state' || 'register',
//   data: {
//     paddle-up: true,
//     paddle-down: false
//   }
// }
//
// Outbound - game-instance
// {
//   route: 'player-connected' || 'player-disconnected' || 'game-state' || 'register',
//   data: {
//     paddle-up: true,
//     paddle-down: false
//   }
// }
const url = require('url');
const GameInstance = require('./game_instance.js');
const ControllerInstance = require('./controller_instance.js');
const Connection = require('./connection.js');

class ServerManager {
  constructor(wss) {
    this.game_instances = {};
    this.controller_instances = {};

    this.wss = wss;

    wss.on('connection', this.on_connection_open.bind(this));
  }

  on_connection_open(ws) {
    const location = url.parse(ws.upgradeReq.url, true);
    let con = new Connection(ws);
    let instance;

    switch(location.href) {
      case '/game':
        instance = (new GameInstance(con));
        instance.on('close', this.remove_game_instance.bind(this));
        this.game_instances[con] = instance;
        break;
      case '/controller':
        instance = (new ControllerInstance(con));
        instance.on('close', this.remove_controller_instance.bind(this));
        this.controller_instances[con] = instance;
        break;
    }
  }

  remove_game_instance(con) {
    console.log('Removing game instance!');

    this.game_instances[con] = null;
  }

  remove_controller_instance(con) {
    console.log('Removing controller instance!');

    this.controller_instances[con] = null;

    console.log(Object.keys(this.controller_instances).length);
  }
}

module.exports = ServerManager;
