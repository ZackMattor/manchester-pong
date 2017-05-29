$(() => {
  console.log('Welcome to the controller');

  let game_connection = new GameConnection('game');

  const canvas = document.getElementById('field');
  const ctx = canvas.getContext('2d');
  const paddleWidth = 50;

  game_connection.on_token = (data) => {
    $('#token').html(data.current_join_token);
  };

  game_connection.on_player_join = (data) => {
    console.log(`player ${data.id} joined`);
  };

  game_connection.on_game_start = (data) => {
    set_state('game');
  };

  game_connection.on_player_left = (data) => {
    console.log(`player ${data.id} left`);
  };

  game_connection.on_player_win = (data) => {
    $('span.player_id').html(data.id);
    set_state('game-over');

    setTimeout(() => {
      set_state('idle');
    }, 10000);
  };

  let first = true;
  game_connection.on_game_state = (data) => {
    if(first) {
      canvas.width = data.gamefield.width;
      canvas.height = data.gamefield.height;
      first = !first;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ball
    ctx.beginPath();
    ctx.arc(data.ball.x, data.ball.y, data.ball.radius, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(data.ball.x, data.ball.y, 3, 0, 2 * Math.PI);
    ctx.stroke();

    // Player 1
    ctx.fillRect(data.p1.pos, data.gamefield.paddle_offset - paddleWidth, data.gamefield.paddle_size, paddleWidth);

    // Player 2
    ctx.fillRect(data.p2.pos, data.gamefield.height - data.gamefield.paddle_offset, data.gamefield.paddle_size, paddleWidth);
  };

  set_state('idle');
});
