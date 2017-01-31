let set_state = function(name) {
  $('.state').hide();
  $(`#state-${name}`).show();
}

$(() => {
  console.log('Welcome to the controller');

  let game_connection = new GameConnection('controller');

  game_connection.on_bind_status = function(data) {
    if(!data.was_successful) {
      $('input[name="game-token"]').addClass('error');
    } else {
      set_state('controller');
    }
    console.log(data);
  }

  $('#connect-button').click(() => {
    let data = {
      token: $('input[name="game-token"]').val()
    };

    game_connection.send('bind_attempt', data);
  });

  $('#paddle-up').on('touchstart', (evt) => {
    $(evt.currentTarget).css('background-color', 'blue');
  });
  $('#paddle-up').on('touchend', (evt) => {
    $(evt.currentTarget).css('background-color', 'red');
  });

  $('#paddle-down').on('touchstart', (evt) => {
    $(evt.currentTarget).css('background-color', 'blue');
  });
  $('#paddle-down').on('touchend', (evt) => {
    $(evt.currentTarget).css('background-color', 'red');
  });
});
