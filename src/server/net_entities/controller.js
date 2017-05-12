const EventEmitter = require('events');

class Controller extends EventEmitter {
  constructor(con) {
    super();

    console.log('New Cntroller Instance');

    this.con = con;
    this.key_state = null;

    con.on('close', this._shutdown_instance.bind(this))
    con.on('bind_attempt', this._bind_attempt.bind(this))
    con.on('key_state', this._new_key_state.bind(this))
  }

  send(channel, data) {
    this.con.send(channel, data);
  }

  bind_status(bind_successful) {
    console.log(`Did we bind? - ${bind_successful}`);
    this.con.send('bind_status', {was_successful: bind_successful});
  }

  get_key_state(key_name) {
    if(!this.key_state) return false;

    return this.key_state[key_name];
  }

  // Private

  _new_key_state(key_state) {
    console.log("Recieved key state from controller!");
    console.log(key_state);
    this.key_state = key_state;
  }

  _bind_attempt(data) {
    this.emit('bind_attempt', {token: data.token, controller: this});
  }


  _shutdown_instance() {
    this.emit('close', this.con.id);
  }
}

module.exports = Controller;
