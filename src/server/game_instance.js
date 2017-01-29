const EventEmitter = require('events');

class GameInstance extends EventEmitter{
  constructor(ws) {
    super();

    this.tokens = [];
    this.ws = ws;
    this.players = [null, null];

    console.log('new game instance');

    setTimeout(() => {
      this.emit('close');
    }, 1000);
  }

}

module.exports = GameInstance;
