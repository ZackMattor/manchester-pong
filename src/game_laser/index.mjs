import GameConnection from '../shared/game_connection.js';
import { DAC } from '@laser-dac/core';
import { Simulator } from '@laser-dac/simulator';
import { Laserdock } from '@laser-dac/laserdock';
import { Scene, Rect, Path, Line } from '@laser-dac/draw';

function set_state(name) {
  console.log(`Current Game State: ${name}`);
};

function game_init() {
  console.log('Welcome to the laser frontend!');

  let game_connection = new GameConnection('ws_game');

  // Init laser
  const dac = new DAC();
  dac.use(new Simulator());
  if (process.env.DEVICE) {
    dac.use(new Laserdock());
  }

  // const paddleWidth = 15;
  // const center_line_width = 35;
  // const center_line_height = 8;
  // const center_line_gap = 10;

  game_connection.on_disconnect = () => {
   console.log(`Uh Oh! Server semes to be down, retrying... <span class="fa fa-cog fa-spin"></span>`);
  };

  game_connection.on_token = (data) => {
    console.log(`Current Token: ${data.current_join_token}`);
  };

  game_connection.on_player_join = (data) => {
    console.log(`player ${data.id} joined`);
  };

  game_connection.on_game_start = () => {
    set_state('game');
  };

  game_connection.on_player_left = (data) => {
    console.log(`player ${data.id} left`);
  };

  game_connection.on_game_over = (data) => {
    if(typeof data.id === 'number') {
      console.log(`Game Over! Player ${data.id + 1} wins!`)

      set_state('game-over');
    } else if(data.err) {
      console.log('Game Over! Some error...', data.err)

      set_state('error');
    }

    setTimeout(() => {
      set_state('idle');
    }, 10000);
  };

  game_connection.on_game_state = async (data) => {

    await dac.start();
    console.log('------- Game Tick -------');
    console.log(` > Game Field Data:`, data);
    console.log(` > P1:`, data.p2);
    console.log(` > P2:`, data.p1);
    console.log(` > Ball Data:`, data.ball);
    console.log('-------------------------');
  };

  set_state('idle');
}

game_init();
