import '../shared/style.css';
import './style.css';

import { GameConnection } from '../shared/game_connection.js';

import jquery from 'jquery';

window.$ = jquery;

window.set_state = function(name) {
  $('.state').hide();
  $(`#state-${name}`).show();
};

$(() => {
  console.log('Welcome to the controller');

  let game_connection = new GameConnection('ws_game');

  const canvas = document.getElementById('field');
  const ctx = canvas.getContext('2d');
  const paddleWidth = 15;

  const center_line_width = 35;
  const center_line_height = 8;
  const center_line_gap = 10;

  game_connection.on_disconnect = (data) => {
    let $alert = $('.alert.error');

    $alert.html(`Uh Oh! Server semes to be down, retrying... <span class="fa fa-cog fa-spin"></span>`);
    $alert.show();
  };

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

  game_connection.on_game_over = (data) => {
    if(typeof data.id === 'number') {
      $('span.player_id').html(data.id + 1);

      set_state('game-over');
    } else if(data.err) {
      $('span.error').html(data.err);

      set_state('error');
    }

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

    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#eee';
    ctx.strokeStyle = '#333';

    for(let i=0; i<24; i++) {
      ctx.fillRect(i * center_line_width + center_line_gap * i, canvas.height/2, center_line_width, center_line_height);
    }

    // Player Scores
    ctx.font = `150px "Press Start 2P"`;
    ctx.fillText(data.p1.score, 60, 900);
    ctx.fillText(data.p2.score, 60, 1170);

    // Ball
    ctx.beginPath();
    ctx.arc(data.ball.x, data.ball.y, data.ball.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Player 1
    ctx.fillRect(data.p1.pos, data.gamefield.paddle_offset - paddleWidth, data.gamefield.paddle_size, paddleWidth);


    // Player 2
    ctx.fillRect(data.p2.pos, data.gamefield.height - data.gamefield.paddle_offset, data.gamefield.paddle_size, paddleWidth);
  };

  set_state('idle');
});
