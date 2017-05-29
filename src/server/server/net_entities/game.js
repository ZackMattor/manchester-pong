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

    this.players = [
      {
        pos: 400,
        name: 'Bot',
        score: 0,
        controller: null
      },
      {
        pos: 400,
        name: 'Bot',
        score: 0,
        controller: null
      }
    ];

    this.ball = {
      x: this.gamefield.width / 2,
      y: this.gamefield.height / 2,
      radius: 70,
      vx: 10,
      vy: 8
    };

    this.ball_paused = false;
  }

  reset() {
    this._clear_intervals();
    this.construct_field();
  }

  start() {
    this.intervals.push(setInterval(this.send_game_state.bind(this), (1000 / 34)));
    this.intervals.push(setInterval(this.game_tick.bind(this), (1000 / 60)));

    this.players[0].controller.send('game_start');
    this.players[1].controller.send('game_start');
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
    let ball_radius = this.ball.radius;
    let invert_x = false;
    let invert_y = false;

    // Process player movement
    let player_speed = 22;

    this.players.forEach((player) => {
      let controller = player.controller;

      if(controller) {
        if(controller.get_key_state('left')) {
          if(player.pos - player_speed > 0) player.pos -= player_speed;
          else player.pos = 0;
        }

        if(controller.get_key_state('right')) {
          if(player.pos + player_speed + this.gamefield.paddle_size < this.gamefield.width) player.pos += player_speed;
          else player.pos = this.gamefield.width - this.gamefield.paddle_size;
        }
      }
    });

    // Paddle hit detection
    let in_p1, in_p2;
    let player = this.players[0];

    in_p1 = bfy < (this.gamefield.paddle_offset + ball_radius);
    in_p1 = in_p1 && (bfx + ball_radius) > player.pos;
    in_p1 = in_p1 && bfx < (player.pos + this.gamefield.paddle_size);

    player = this.players[1];
    in_p2 = bfy > (this.gamefield.height - this.gamefield.paddle_offset - ball_radius);
    in_p2 = in_p2 && (bfx + ball_radius) > player.pos;
    in_p2 = in_p2 && bfx < (player.pos + this.gamefield.paddle_size);

    if(in_p1 || in_p2) {
      invert_y = true;
    }

    // Wall Detection
    if(bfx + ball_radius > this.gamefield.width || (bfx - ball_radius) < 0) invert_x = true;
    if(bfy + ball_radius > this.gamefield.height || bfy < 0) {
      if(bfy + ball_radius > this.gamefield.height) this.player_scored(0);
      if(bfy < 0) this.player_scored(1);

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

    this.players[id].score++;

    if(this.players[id].score == 5) {
      this.players[0].controller.send('player_win', {id: id});
      this.players[1].controller.send('player_win', {id: id});
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

    console.log('send token?');
    this.con.send('token', data);
  }

  send_game_state() {
    let p1 = this.players[0];
    let p2 = this.players[1];
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
    return (!!this.players[0].controller && !!this.players[1].controller);
  }

  join_game(controller) {
    console.log('player joinging');

    let index = this.players.findIndex((player) => {
      return !player.controller;
    });

    if(index == -1) return;

    if(!this.players[index].controller) {
      controller.on('close', () => {
        this.remove_player(index);
      });

      this.players[index].controller = controller;
      this.players[index].name = `Player ${index}`;

      this.con.send('player_join', {id: index});
    }

    if(this.is_full()) {
      this.start();
    }
  }

  remove_player(id) {
    this.players[id].controller = null;
    this.players[id].name = "Bot";

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
