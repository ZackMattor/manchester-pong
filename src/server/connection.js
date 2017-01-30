const EventEmitter = require('events');
const WebSocket = require('ws');

class Connection extends EventEmitter {
  constructor(ws) {
    super();

    ws.on('message', this.on_message.bind(this));
    ws.on('close', this._disconnect.bind(this));

    this.ws = ws;
    this.start_heartbeat();
  }

  on_message(message) {
    let packet = JSON.parse(message);

    // throw out poorly formated packets
    if(!packet.route) {
      console.log('Invalid packet detected');
      return;
    }

    this.emit(packet.route, packet.data);
  }

  send(route, data) {
    let packet = {
      route: route,
      data: data
    };

    if(this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(packet));
    }
  }

  start_heartbeat() {
    var count = 0;

    this.on('pong', () => {
      count = 0;
    });

    this.heartbeat_interval = setInterval(() => {
      this.send('ping', null);
      count++;

      if(count > 5) { this._disconnect() }
    }, 500);
  }

  _disconnect() {
    console.log('Connection Closed');
    clearInterval(this.heartbeat_interval);
    this.emit('close', this.ws);
  }
}

module.exports = Connection;
