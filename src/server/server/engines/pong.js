const EventEmitter = require('events');

class Pong extends EventEmitter {
  constructor(players) {
    super();

    this.intervals = [];
    this.game_running = false;
    this.winning_score = 5;

    this.gamefield = {
      width: 1080,
      height: 1920,
      paddle_size: 230,
      paddle_offset: 50
    };

    this.players = [
      {
        pos: 400,
        name: 'Bot',
        score: 0,
        controller: players[0].controller
      },
      {
        pos: 400,
        name: 'Bot',
        score: 0,
        controller: players[1].controller
      }
    ];

    this.ball = {
      x: this.gamefield.width / 2,
      y: this.gamefield.height / 2,
      radius: 35,
      vx: 10,
      vy: 8
    };

    this.intervals.push(setInterval(this.send_game_state.bind(this), (1000 / 34)));
    this.intervals.push(setInterval(this.game_tick.bind(this), (1000 / 60)));

    console.log('new game');

    this.ball_paused = true;
    setTimeout(() => {
      this.ball_paused = false;
    }, 3000);
  }

  cleanup() {
    this._clear_intervals();
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
    let distance_to_paddle = (bfy - ball_radius) - this.gamefield.paddle_offset;

    in_p1 = bfy < (this.gamefield.paddle_offset + ball_radius);
    in_p1 = in_p1 && distance_to_paddle > -Math.abs(this.ball.vx);
    in_p1 = in_p1 && (bfx + ball_radius) > player.pos;
    in_p1 = in_p1 && bfx < (player.pos + this.gamefield.paddle_size);

    player = this.players[1];
    distance_to_paddle = -((bfy + ball_radius) - (this.gamefield.height - this.gamefield.paddle_offset));

    in_p2 = bfy > (this.gamefield.height - this.gamefield.paddle_offset - ball_radius);
    in_p2 = in_p2 && distance_to_paddle > -Math.abs(this.ball.vx);
    in_p2 = in_p2 && (bfx + ball_radius) > player.pos;
    in_p2 = in_p2 && bfx < (player.pos + this.gamefield.paddle_size);

    if(in_p1 || in_p2) {
      invert_y = true;
    }

    // Wall Detection
    let top_wall = -(ball_radius * 2);
    let bottom_wall = this.gamefield.height + (ball_radius * 2);

    if(bfx + ball_radius > this.gamefield.width || (bfx - ball_radius) < 0) invert_x = true;
    if(bfy + ball_radius > bottom_wall || bfy < top_wall) {
      if(bfy + ball_radius > this.gamefield.height) this.player_scored(0);
      if(bfy < top_wall) this.player_scored(1);

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

    if(this.players[id].score == this.winning_score) {
      console.log(`GAME OVER player ${id+1} won!!!`);
      this.emit('game_over', id);
    } else {
      this.ball_paused = true;
      setTimeout(() => {
        this.ball_paused = false;
      }, 2000);
    }
  }

  send_game_state() {
    let p1 = this.players[0];
    let p2 = this.players[1];

    let data = {
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

    this.emit('game_state', data);
  }

  _clear_intervals() {
    this.intervals.forEach((interval) => clearInterval(interval));
    this.intervals = [];
  }
};

module.exports = Pong;
