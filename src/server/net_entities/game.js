const EventEmitter = require('events');

class Game extends EventEmitter{
  constructor(con) {
    super();

    con.on('close', this.shutdown.bind(this))

    this.active_tokens = ['foo'];
    this.con = con;

    this.construct_field();
  }

  construct_field() {
    this.intervals = [];

    this.generate_token();
    this.intervals.push(setInterval(this.generate_token.bind(this), (1000 * 10)));

    this.gamefield = {
      width: 1070,
      height: 1800,
      paddle_size: 300,
      paddle_offset: 30
    };

    this.players = {
      p1: {
        pos: 400,
        name: 'Bot',
        score: 0,
        controller: null
      },
      p2: {
        pos: 400,
        name: 'Bot',
        score: 0,
        controller: null
      }
    };

    this.ball = {
      x: this.gamefield.width / 2,
      y: this.gamefield.height / 2,
      size: 70,
      vx: 10,
      vy: 8
    };

    this.ball_paused = false;
  }

  reset() {
    this._clear_intervals();
    this.construct_field();
  }

  game_start() {
    this.intervals.push(setInterval(this.send_game_state.bind(this), (1000 / 34)));
    this.intervals.push(setInterval(this.game_tick.bind(this), (1000 / 60)));

    this.players.p1.controller.con.send('game_start');
    this.players.p2.controller.con.send('game_start');
    this.con.send('game_start');

    console.log('new game');
  }

  generate_token() {
    var token = parseInt(Math.random() * (9999-1000) + 1000);
    this.active_tokens.unshift(token);

    if(this.active_tokens.length > 4) {
      this.active_tokens.pop();
    }

    this.send_token();
  }

  game_tick() {
    let bfx = this.ball.x + this.ball.vx;
    let bfy = this.ball.y + this.ball.vy;
    let ball_size = this.ball.size;
    let invert_x = false;
    let invert_y = false;

    // Process player movement
    let player_speed = 22;

    for(var key in this.players) {
      let player = this.players[key];
      let controller = player.controller;

      if(controller) {
        if(controller.get_key_state('key_up')) {
          if(player.pos - player_speed > 0) player.pos -= player_speed;
        }

        if(controller.get_key_state('key_down')) {
          if(player.pos + player_speed + this.gamefield.paddle_size < this.gamefield.width) player.pos += player_speed;
        }
      }
    }

    // Paddle hit detection
    let in_p1, in_p2;
    let player = this.players.p1;

    in_p1 = bfy < this.gamefield.paddle_offset;
    in_p1 = in_p1 && (bfx + this.ball.size) > player.pos;
    in_p1 = in_p1 && bfx < (player.pos + this.gamefield.paddle_size);

    player = this.players.p2;
    in_p2 = bfy > (this.gamefield.height - this.gamefield.paddle_offset - this.ball.size);
    in_p2 = in_p2 && (bfx + this.ball.size) > player.pos;
    in_p2 = in_p2 && bfx < (player.pos + this.gamefield.paddle_size);

    if(in_p1 || in_p2) {
      invert_y = true;
    }

    // Wall Detection
    if(bfx + ball_size > this.gamefield.width || bfx < 0) invert_x = true;
    if(bfy + ball_size > this.gamefield.height || bfy < 0) {
      if(bfy + ball_size > this.gamefield.height) this.player_scored(1);
      if(bfy < 0) this.player_scored(2);

      invert_y = true;
    }

    if(invert_x) this.ball.vx *= -1;
    if(invert_y) this.ball.vy *= -1;

    // Process ball movement
    if(!this.ball_paused) {
      this.ball.x += this.ball.vx;
      this.ball.y += this.ball.vy;
    }
  }

  player_scored(id) {
    this.ball.x = this.gamefield.width / 2;
    this.ball.y = this.gamefield.height / 2;

    this.players[`p${id}`].score++;

    if(this.players[`p${id}`].score == 5) {
      this.players.p1.controller.con.send('player_win', {id: id});
      this.players.p2.controller.con.send('player_win', {id: id});
      this.con.send('player_win', {id: id});
      this.reset();
    } else {
      this.ball_paused = true;
      setTimeout(() => {
        this.ball_paused = false;
      }, 2000);
    }
  }

  send_token() {
    let current_token = this.active_tokens[0];

    let data = { current_join_token: current_token };

    this.con.send('token', data);
  }

  send_game_state() {
    let p1 = this.players.p1;
    let p2 = this.players.p2;
    let current_token = this.active_tokens[0];

    let data = {
      current_join_token: current_token,
      p1: {
        pos: p1.pos,
        score: p1.score,
        name: p1.name
      },
      p2: {
        pos: p2.pos,
        score: p2.score,
        name: p2.name
      }
    };

    data.ball = this.ball;
    data.gamefield = this.gamefield;

    this.con.send('game_state', data);
  }

  is_token_valid(token) {
    console.log(this.active_tokens);
    return this.active_tokens.indexOf(parseInt(token)) !== -1;
  }

  is_full() {
    return (!!this.players.p1.controller && !!this.players.p2.controller);
  }

  join_game(controller) {
    console.log('player joinging');
    if(!this.players.p1.controller) {
      controller.on('close', () => {
        this.remove_player(1);
      });

      this.add_player(1, controller);
    } else if(!this.players.p2.controller) {
      controller.on('close', () => {
        this.remove_player(2);
      });

      this.add_player(2, controller);
    }

    console.log(this.players);
  }

  add_player(id, player) {
    this.players[`p${id}`].controller = player;
    this.players[`p${id}`].name = `Player ${id}`;

    this.con.send('player_join', {id: id});

    // If we are the last player needed...
    if(id == 2) {
      this.game_start();
    }
  }

  remove_player(id) {
    this.players[`p${id}`].controller = null;
    this.players[`p${id}`].name = "Bot";

    this.con.send('player_left', {id: id});
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
