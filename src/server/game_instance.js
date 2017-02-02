const EventEmitter = require('events');

class GameInstance extends EventEmitter{
  constructor(con) {
    super();

    con.on('close', this.shutdown_instance.bind(this))

    this.active_tokens = ['foo'];
    this.con = con;

    this.players = {
      p1: {
        y: 100,
        name: 'Bot',
        score: 0,
        controller_instance: null
      },
      p2: {
        y: 50,
        name: 'Bot',
        score: 0,
        controller_instance: null
      }
    };

    this.ball = {
      x: 50,
      y: 50,
      size: 15,
      vx: 2,
      vy: 2
    };

    this.gamefield = {
      width: 500,
      height: 300,
      paddle_height: 50,
      paddle_offset: 30
    };

    this.intervals = [];
    this.intervals.push(setInterval(this.send_game_state.bind(this), (1000 / 34)));
    this.intervals.push(setInterval(this.game_tick.bind(this), (1000 / 60)));
    this.intervals.push(setInterval(this.generate_token.bind(this), (1000 * 10)));

    this.generate_token();

    console.log('new game instance');
  }

  generate_token() {
    var token = parseInt(Math.random() * (9999-1000) + 1000);
    this.active_tokens.unshift(token);

    if(this.active_tokens.length > 4) {
      this.active_tokens.pop();
    }
  }

  game_tick() {
    let bfx = this.ball.x + this.ball.vx;
    let bfy = this.ball.y + this.ball.vy;
    let ball_size = this.ball.size;
    let invert_x = false;
    let invert_y = false;

    // Process player movement
    let p1_instance = this.players.p1.controller_instance;
    let p2_instance = this.players.p2.controller_instance;
    let player_speed = 2;

    for(var key in this.players) {
      let player = this.players[key];
      let player_instance = player.controller_instance;

      if(player_instance) {
        if(player_instance.get_key_state('key_up')) {
          player.y -= player_speed;
        }

        if(player_instance.get_key_state('key_down')) {
          player.y += player_speed;
        }
      }
    }

    // Paddle hit detection
    let in_p1, in_p2;
    let player = this.players.p1;

    in_p1 = bfx < this.gamefield.paddle_offset;
    in_p1 = in_p1 && (bfy + this.ball.size) > player.y;
    in_p1 = in_p1 && bfy < (player.y + this.gamefield.paddle_height);

    player = this.players.p2;
    in_p2 = bfx > (this.gamefield.width - this.gamefield.paddle_offset - this.ball.size);
    in_p2 = in_p2 && (bfy + this.ball.size) > player.y;
    in_p2 = in_p2 && bfy < (player.y + this.gamefield.paddle_height);

    if(in_p1 || in_p2) {
      invert_x = true;
    }

    // Wall Detection
    if(bfy + ball_size > this.gamefield.height || bfy < 0) invert_y = true;
    if(bfx + ball_size > this.gamefield.width || bfx < 0) {
      if(bfx + ball_size > this.gamefield.width) this.players.p1.score++;
      if(bfx < 0) this.players.p2.score++;

      invert_x = true;
    }

    if(invert_x) this.ball.vx *= -1;
    if(invert_y) this.ball.vy *= -1;

    // Process ball movement
    this.ball.x += this.ball.vx;
    this.ball.y += this.ball.vy;
  }

  send_game_state() {
    let p1 = this.players.p1;
    let p2 = this.players.p2;
    let current_token = this.active_tokens[0];

    let data = {
      current_join_token: current_token,
      p1: {
        y: p1.y,
        score: p1.score,
        name: p1.name
      },
      p2: {
        y: p2.y,
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

  is_game_full() {
    return (!!this.players.p1.controller_instance && !!this.players.p2.controller_instance);
  }

  join_game(controller_instance) {
    if(!this.players.p1.controller_instance) {
      controller_instance.on('close', () => {
        this.players.p1.controller_instance = null;
        this.players.p1.name = "Bot";
      });

      this.players.p1.controller_instance = controller_instance;
      this.players.p1.name = "Player 1";
    } else if(!this.players.p2.controller_instance) {
      controller_instance.on('close', () => {
        this.players.p2.controller_instance = null;
        this.players.p2.name = "Bot";
      });

      this.players.p2.controller_instance = controller_instance;
      this.players.p2.name = "Player 2";
    }

    console.log(this.players);
  }

  shutdown_instance() {
    this.intervals.forEach((interval) => clearInterval(interval));

    this.emit('close', this.con.id);
  }
}

module.exports = GameInstance;
