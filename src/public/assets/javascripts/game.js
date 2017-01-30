$(() => {
  console.log('Welcome to the controller');

  let game_connection = new GameConnection();

  game_connection.on_game_state = function(data) {
    console.log(data);
  }

});
