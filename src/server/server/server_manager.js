const url = require('url');
const Game = require('./net_entities/game.js');
const Controller = require('./net_entities/controller.js');
const Connection = require('./connection.js');

class ServerManager {
  constructor(wss) {
    this.connections = {};

    this.wss = wss;

    wss.on('connection', this.on_connection_open.bind(this));
  }

  on_connection_open(ws) {
    let con = new Connection(ws);
    let entity;

    this.connections[con.id] = {
      con: con,
      entity: null
    };

    const namespace = url.parse(ws.upgradeReq.url, true).href;
    switch(namespace) {
      case '/ws_game':
        entity = (new Game(con));
        break;
      case '/ws_controller':
        entity = (new Controller(con));
        entity.on('bind_attempt', this.bind_attempt.bind(this));
        break;
    }

    if(entity) {
      entity.on('close', this.remove_connection.bind(this));
      this.connections[con.id].entity = entity;
    }
  }

  bind_attempt(bind_obj) {
    let token = bind_obj.token;
    let controller = bind_obj.controller;
    let success = false;
    let player_id;

    console.log(`Controller trying to join a game with ${token}`);

    for(var id in this.connections) {
      let game = this.connections[id].entity

      if(game.constructor.name !== 'Game') continue;

      player_id = game.join_game(controller, token);

      console.log(player_id);

      if(player_id != -1) break;
    }

    controller.bind_status(player_id);
  }

  remove_connection(id) {
    console.log(`Removing ${this.connections[id].entity.constructor.name} from the connections!`);

    delete this.connections[id];
  }
}

module.exports = ServerManager;
