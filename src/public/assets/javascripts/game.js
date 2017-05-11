$(() => {
  console.log('Welcome to the controller');

  let game_connection = new GameConnection('game');

  game_connection.on_token = (data) => {
    $('#token').html(data.current_join_token);
  };

  game_connection.on_player_join = (data) => {
    console.log(`player ${data.id} joined`);
  };

  game_connection.on_player_left = (data) => {
    console.log(`player ${data.id} left`);
  };

  game_connection.on_game_state = (data) => {
    const canvas = document.getElementById('field');
    const context = canvas.getContext('2d');

    const fieldWidth = data.gamefield.width;

    canvas.width = fieldWidth;
    canvas.height = data.gamefield.height;

    const paddleWidth = 5;

    // Ball
    context.arc(data.ball.x, data.ball.y, data.ball.size, 0, 2 * Math.PI);

    // Player 1
    context.rect(data.gamefield.paddle_offset - paddleWidth, data.p1.y, paddleWidth, data.gamefield.paddle_height);

    // Player 2
    context.rect(fieldWidth - data.gamefield.paddle_offset, data.p2.y, paddleWidth, data.gamefield.paddle_height);

    context.fill();
  }
});
