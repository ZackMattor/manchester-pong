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

    canvas.width = data.gamefield.width;
    canvas.height = data.gamefield.height;

    const paddleWidth = 50;

    // Ball
    context.arc(data.ball.x, data.ball.y, data.ball.size, 0, 2 * Math.PI);

    console.log(data.p1.pos);

    // Player 1
    context.rect(data.p1.pos, data.gamefield.paddle_offset - paddleWidth, data.gamefield.paddle_size, paddleWidth);

    // Player 2
    context.rect(data.p2.pos, data.gamefield.height - data.gamefield.paddle_offset, data.gamefield.paddle_size, paddleWidth);

    context.fill();
  }
});
