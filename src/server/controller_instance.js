const EventEmitter = require('events');

class ControllerInstance extends EventEmitter{
  constructor(con) {
    super();

    console.log('New Controller Instance');

    this.con = con;

    con.on('close', this.shutdown_instance.bind(this))
    con.on('bind-attempt', this.bind_attempt.bind(this))
  }

  bind_attempt(data) {
    this.emit('bind-attempt', data.token);
  }

  bind_status(bind_successful) {
    this.con.send('bind-status', bind_successful);
  }

  shutdown_instance() {
    this.emit('close', this.con.id);
  }
}

module.exports = ControllerInstance;
