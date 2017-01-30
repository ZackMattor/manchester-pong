const url = require('url');
const GameInstance = require('./game_instance.js');
const ControllerInstance = require('./controller_instance.js');
const Connection = require('./connection.js');

class ServerManager {
  constructor(wss) {
    this.connections = {};

    this.wss = wss;

    wss.on('connection', this.on_connection_open.bind(this));
  }

  on_connection_open(ws) {
    let con = new Connection(ws);
    let instance;

    this.connections[con.id] = {
      con: con,
      instance: null
    };

    const namespace = url.parse(ws.upgradeReq.url, true).href;
    switch(namespace) {
      case '/game':
        instance = (new GameInstance(con));
        break;
      case '/controller':
        instance = (new ControllerInstance(con));
        instance.on('bind_attempt', this.bind_attempt.bind(this));
        break;
    }

    if(instance) {
      instance.on('close', this.remove_connection.bind(this));
      this.connections[con.id].instance = instance;
    }
  }

  bind_attempt(bind_obj) {
    console.log(`Player trying to join a game with ${bind_obj.token}`);

    // TODO - this
    bind_obj.instance.bind_status(false);
  }

  remove_connection(id) {
    console.log(`Removing ${this.connections[id].instance.constructor.name} from the connections!`);

    this.connections[id] = null;
  }
}

module.exports = ServerManager;
