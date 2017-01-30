const EventEmitter = require('events');

class GameInstance extends EventEmitter{
  constructor(con) {
    super();

    con.on('close', this.shutdown_instance.bind(this))

    this.active_tokens = ['foo'];
    this.instance_connection = con;

    this.players = {
      p1: {
        y: 50,
        name: 'Bot',
        connection: null
      },
      p2: {
        y: 50,
        name: 'Bot',
        connection: null
      }
    };

    this.ball = {
      x: 50,
      y: 50
    }

    setInterval(this.send_game_state.bind(this), (1000 / 30));

    console.log('new game instance');
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

    console.log(data);

    this.instance_connection.send('game_state', data);
  }

  shutdown_instance() {
    this.emit('close', this.instance_connection);
  }
}

module.exports = GameInstance;
