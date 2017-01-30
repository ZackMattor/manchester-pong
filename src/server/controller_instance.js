const EventEmitter = require('events');

class ControllerInstance extends EventEmitter{
  constructor(con) {
    super();

    console.log('New Controller Instance');

    this.con = con;

    con.on('close', this.shutdown_instance.bind(this))
  }

  shutdown_instance() {
    this.emit('close', this.con);
  }
}

module.exports = ControllerInstance;
