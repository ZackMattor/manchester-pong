$(() => {
  console.log('Welcome to the controller');

  let game_connection = new GameConnection();

  game_connection.on_game_state = function(data) {
    let width = $('#gamefield').width();

    $('#join_token').html(data.current_join_token);

    $('#ball').css({
      top: data.ball.y,
      left: data.ball.x
    });

    $('#p1').css({
      top: data.p1.y,
      left: 10
    });

    $('#p2').css({
      top: data.p2.y,
      left: width - 10
    });
  }
});
