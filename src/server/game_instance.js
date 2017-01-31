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
        controller_instance: null
      },
      p2: {
        y: 50,
        name: 'Bot',
        controller_instance: null
      }
    };

    this.ball = {
      x: 50,
      y: 50,
      size: 10,
      vx: 2,
      vy: 2
    };

    this.gamefield = {
      width: 500,
      height: 300,
      paddle_height: 20,
      paddle_offset: 40
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
    this.players.p2.y+= 0.1;

    let fx = this.ball.x + this.ball.vx;
    let fy = this.ball.y + this.ball.vy;
    let ball_size = this.ball.size;

    // Wall Detection
    if(fx + ball_size > this.gamefield.width || fx < 0) this.ball.vx *= -1;
    if(fy + ball_size > this.gamefield.height || fy < 0) this.ball.vy *= -1;

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
        name: p1.name
      },
      p2: {
        y: p2.y,
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
