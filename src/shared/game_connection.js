class GameConnection {
  constructor(namespace) {
    this.namespace = namespace;

    this.ws = new WebSocket(this._socket_url());
    this.ws.onmessage = this.on_message.bind(this);
    this.ws.onclose = () => this.wait_for_server();
  }

  on_message(message) {
    let packet = JSON.parse(message.data)
    let data = packet.data;
    let route = packet.route;

    switch(route) {
      case 'ping':
        this.send('pong');
        break;
      default:
        this._call_callback(route, data);
        break;
    }
  }

  wait_for_server(time) {
    let ws = new WebSocket(this._socket_url());

    ws.onerror = () => {
      time = this._next_time(time);

      console.log(`server is still down... waiting ${time}ms till we try again`);
      this._call_callback('disconnect', {waiting: time});

      setTimeout(() => {
        this.wait_for_server(time);
      }, time);
    };

    // once we can reconnect.. just reload for now.
    ws.onopen = () => { location.reload(); };
  }

  send(route, data) {
    let packet = {
      route: route,
      data: data || null
    };
    this.ws.send(JSON.stringify(packet));
  }

  _call_callback(name, data) {
    let func = this[`on_${name}`];

    if(func) {
      func(data);
    } else {
      console.log(`No handler set for the "${name}" packet/event type`);
    }
  }

  _next_time(current_time) {
    let max_time = 3000;
    let interval = 200;

    if(!current_time) return interval;
    else if(current_time >= max_time) return max_time;
    else return current_time + interval;
  }

  _socket_url() {
    let loc = window.location
    let new_uri;

    if (loc.protocol === "https:") {
      new_uri = "wss:";
    } else {
      new_uri = "ws:";
    }

    new_uri += `//${loc.host}/${this.namespace}`;

    return new_uri;
  }
}

module.exports = GameConnection;
