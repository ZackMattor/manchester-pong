$(() => {
  console.log('Welcome to the controller');

  let game_connection = new GameConnection('controller');

  game_connection.on_bind_status = function(data) {
    if(!data.was_successful) {
      $('input[name="game-token"]').addClass('error');

    } else {

    }
    console.log(data);
  }

  $('#connect-button').click(() => {
    let data = {
      token: $('input[name="game-token"]').val()
    };

    game_connection.send('bind_attempt', data);
  });
});
