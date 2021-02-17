const EventEmitter = require('events');
const Wall = require('../2d/wall.js');
const Pong = require('../engines/pong.js');

class Game extends EventEmitter{
  constructor(con) {
    super();

    con.on('close', this.shutdown.bind(this))

    this.active_tokens = ['foo'];
    this.con = con;
    this.game_running = false;

    this.construct_field();
  }

  construct_field() {
    this.intervals = [];
    this.game_running = false;

    this.generate_token();
    this.intervals.push(setInterval(this.generate_token.bind(this), (1000 * 60)));

    this.players = [
      {
        controller: null
      },
      {
        controller: null
      }
    ];
  }

  reset() {
    this.pong.cleanup();
    this.pong = null;
    this._clear_intervals();
    this.construct_field();
  }

  start() {
    this.pong = new Pong(this.players);

    this.pong.on('game_state', this.send_game_state.bind(this));
    this.pong.on('game_over', this.game_over.bind(this));

    this.send_to(0, 'game_start');
    this.send_to(1, 'game_start');
    this.con.send('game_start');
  }

  generate_token() {
    var token = parseInt(Math.random() * (9999-1000) + 1000);
    this.active_tokens.unshift(token);

    if(this.active_tokens.length > 4) {
      this.active_tokens.pop();
    }

    this.send_token();
  }

  game_over(id) {
    console.log(`GAME OVER player ${id+1} won!!!`);
    this.send_to(0, 'game_over', {id: id});
    this.send_to(1, 'game_over', {id: id});
    this.con.send('game_over', {id: id});
    this.reset();
  }

  send_token() {
    let current_token = this.active_tokens[0];

    let data = { current_join_token: current_token };

    this.con.send('token', data);
  }

  send_game_state(data) {
    this.con.send('game_state', data);
  }

  send_to(player_id, cmd, data) {
    let player = this.players[player_id];

    if(player.controller) {
      player.controller.send(cmd, data);
    }
  }

  is_token_valid(token) {
    console.log(this.active_tokens);
    return this.active_tokens.indexOf(parseInt(token)) !== -1;
  }

  is_full() {
    return (!!this.players[0].controller && !!this.players[1].controller);
  }

  join_game(controller, token) {
    console.log('player joinging');

    // is this a valid token?
    if(!this.is_token_valid(token)) return -1;

    // find a open spot
    let player_id = this.players.findIndex((player) => {
      return !player.controller;
    });

    // is the game full?
    if(player_id == -1) return -1;

    if(!this.players[player_id].controller) {
      controller.on('close', () => {
        this.remove_player(player_id);
      });

      this.players[player_id].controller = controller;
      this.players[player_id].name = `Player ${player_id}`;

      this.con.send('player_join', {id: player_id});
    }

    if(this.is_full()) {
      setTimeout(() => {
        this.start();
      }, 500);
    }

    return player_id;
  }

  remove_player(id) {
    console.log('PLAYER LEFT!!');
    let data = {err: `Player ${id+1} left!`}

    if(this.game_running) {
      this.send_to(0, 'game_over', data);
      this.send_to(1, 'game_over', data);
      this.con.send('game_over', data);

      this.reset();
    } else {
      this.players[id].controller = null;
      this.players[id].name = "Bot";
    }
  }

  shutdown() {
    this._clear_intervals();

    this.emit('close', this.con.id);
  }

  _clear_intervals() {
    this.intervals.forEach((interval) => clearInterval(interval));
    this.intervals = [];
  }
}

module.exports = Game;
