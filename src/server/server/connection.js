import EventEmitter from 'events';
import WebSocket from 'ws';

export class Connection extends EventEmitter {
  constructor(ws) {
    super();

    this.id = this._uuid();
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
      data: data || null
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

    console.log('should we unbind listeners?');
    //this.removeAllListeners();
  }

  _uuid() {
    var s4 = function() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
}
