class GameConnection {
  constructor() {
    this.ws = new WebSocket(this._socket_url());
    this.ws.onmessage = this.on_message.bind(this);
  }

  on_message(message) {
    let packet = JSON.parse(message.data)
    let data = packet.data;
    let route = packet.route;

    console.log(`Recieved ${route} packet.`);

    switch(route) {
      case 'ping':
        this.send('pong');
        break;
      default:
        let func = this[`on_${route}`];

        if(func) {
          func(data);
        } else {
          console.log(`No handler set for the "${route}" packet type`);
        }
        break;
    }
  }

  send(route, data) {
    let packet = {
      route: route,
      data: data || null
    };

    this.ws.send(JSON.stringify(packet));
  }

  _socket_url() {
    let loc = window.location
    let new_uri;

    if (loc.protocol === "https:") {
      new_uri = "wss:";
    } else {
      new_uri = "ws:";
    }
    new_uri += "//" + loc.host + '/game';

    return new_uri;
  }
}
