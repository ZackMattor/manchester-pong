let set_state = function(name) {
  $('.state').hide();
  $(`#state-${name}`).show();
};

var Controller = {
  init() {
    console.log('Welcome to the controller');

    this.game_connection = new GameConnection('controller');
    this.key_state = {
      key_up: false,
      key_down: false
    };

    // Deal with messages from the server
    this.game_connection.on_bind_status = this.on_bind_status.bind(this);

    $('.control-button').on('mousedown touchstart', this.on_controller_button_press.bind(this));
    $('.control-button').on('mouseup touchend', this.on_controller_button_release.bind(this));


    $('#connect-button').click(this.bind_attempt.bind(this));

  },

  bind_attempt() {
    let data = {
      token: $('input[name="game-token"]').val()
    };

    this.game_connection.send('bind_attempt', data);
  },

  on_bind_status(data) {
    console.log(data);

    if(!data.was_successful) {
      $('input[name="game-token"]').addClass('error');
    } else {
      set_state('controller');
    }
  },

  on_controller_button_press(evt) {
    let $ele = $(evt.currentTarget);

    $ele.css('background-color', 'blue');
    this.set_key_state($ele.data('key-name'), true);
  },

  on_controller_button_release(evt) {
    let $ele = $(evt.currentTarget);

    $ele.css('background-color', 'red');
    this.set_key_state($ele.data('key-name'), false);
  },

  set_key_state(key, value) {
    this.key_state[key] = value;

    console.log(this.key_state);
    this.game_connection.send('key_state', this.key_state);
  }
};

$(Controller.init.bind(Controller));
