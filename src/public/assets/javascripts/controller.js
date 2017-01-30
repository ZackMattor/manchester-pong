$(() => {
  console.log('Welcome to the controller');

  let game_connection = new GameConnection('controller');

  $('#connect-button').click(() => {
    let data = {
      token: $('input[name="game-token"]').val()
    };

    game_connection.send('bind-attempt', data);
  });
});
