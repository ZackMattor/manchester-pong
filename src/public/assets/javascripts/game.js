$(() => {
  console.log('Welcome to the controller');

  let game_connection = new GameConnection('game');

  game_connection.on_game_state = function(data) {
    $('#join_token').html(data.current_join_token);

    $('#gamefield').css({
      height: data.gamefield.height,
      width: data.gamefield.width
    });

    let field_width = $('#gamefield').width();
    let paddle_width = 5;

    $('#ball').css({
      top: data.ball.y,
      left: data.ball.x,
      width: data.ball.size,
      height: data.ball.size
    });

    $('#p1').css({
      top: data.p1.y,
      left: data.gamefield.paddle_offset - paddle_width,
      width: paddle_width,
      height: data.gamefield.paddle_height
    });

    $('#p1-name').html(data.p1.name);
    $('#p1-score').html(data.p1.score);

    $('#p2-name').html(data.p2.name);
    $('#p2-score').html(data.p2.score);

    $('#p2').css({
      top: data.p2.y,
      left: field_width - data.gamefield.paddle_offset,
      width: paddle_width,
      height: data.gamefield.paddle_height
    });
  }
});
