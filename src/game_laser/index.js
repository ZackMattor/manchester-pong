import { GameConnection } from '../shared/game_connection.js';
import { DAC } from '@laser-dac/core';
import { Simulator } from '@laser-dac/simulator';
import { Laserdock } from '@laser-dac/laserdock';
import { Scene, Rect, HersheyFont, loadHersheyFont, Line, Circle } from '@laser-dac/draw';

let gameState = null;
let gameCode = null;
let p1State = {};
let p2State = {};
let ballState = {};
let fieldState = {};
const paddleWidth = 0.3;

function set_state(name) {
  console.log(`Current Game State: ${name}`);
  gameState = name;
};

const font = loadHersheyFont('./futural.jhf');

async function game_init() {
  console.log('Welcome to the laser frontend!');

  let game_connection = new GameConnection('ws_game');

  // Init laser
  const dac = new DAC();
  dac.use(new Simulator());
  if (process.env.DEVICE) {
    dac.use(new Laserdock());
  }

  await dac.start();
  const scene = new Scene();
  function renderFrame() {
    if(!gameState) return;

    switch(gameState) {
      case 'idle':
        scene.add(new HersheyFont({
          font,
          text: `${gameCode}`,
          x: 0.1,
          y: 0.4,
          color: [1, 0, 0],
          charWidth: 0.08,
        }));
        break;
      case 'game':
        // p1State: { pos: 400, score: 0, name: 'Player 0' },
        // p2State: { pos: 400, score: 0, name: 'Player 1' },
        // ballState: { x: 990, y: 744, radius: 35, vx: 10, vy: -8 },
        // fieldState: { width: 1080, height: 1920, paddle_size: 230, paddle_offset: 50 }
        const p2 =  new Line({
          from: {
            x: p2State.pos / fieldState.width,
            y: 1 - (fieldState.paddle_offset / fieldState.height),
          },
          to: {
            x: ( p2State.pos / fieldState.width ) + ( fieldState.paddle_size / fieldState.width ),
            y: 1 - (fieldState.paddle_offset / fieldState.height),
          },
          color: [0, 1, 0],
          blankBefore: true,
          blankAfter: true,
        });

        const p1 =  new Line({
          from: {
            x: ( p1State.pos / fieldState.width ) + ( fieldState.paddle_size / fieldState.width ),
            y: (fieldState.paddle_offset / fieldState.height),
          },
          to: {
            x: p1State.pos / fieldState.width,
            y: (fieldState.paddle_offset / fieldState.height),
          },
          color: [0, 1, 0],
          blankBefore: true,
          blankAfter: true,
        });

        const ball = new Circle({
          radius: 0.01,
          x: ballState.x / fieldState.width,
          y: ballState.y / fieldState.height,
          color: [0, 1, 0],
        });

        const left =  new Line({
          from: { x: 0, y: 0, },
          to: { x: 0, y: 1, },
          color: [0, 1, 0],
          blankBefore: true,
          blankAfter: true,
        });

        const right =  new Line({
          from: { x: 1, y: 1, },
          to: { x: 1, y: 0, },
          color: [0, 1, 0],
          blankBefore: true,
          blankAfter: true,
        });

        scene.add(left);
        scene.add(p2);
        scene.add(right);
        scene.add(p1);

        if(ball.y < 0.95) scene.add(ball);
        break;
    }
  }

  scene.start(renderFrame);
  dac.stream(scene, 30000);

  game_connection.on_disconnect = () => {
   console.log(`Uh Oh! Server semes to be down, retrying... <span class="fa fa-cog fa-spin"></span>`);
  };

  game_connection.on_token = (data) => {
    console.log(`Current Token: ${data.current_join_token}`);
    gameCode = data.current_join_token;
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
    console.log('------- Game Tick -------');
    console.log(` > Game Field Data:`, data);
    console.log(` > P1:`, data.p2);
    console.log(` > P2:`, data.p1);
    console.log(` > Ball Data:`, data.ball);
    console.log('-------------------------');

    p1State = data.p1;
    p2State = data.p2;
    ballState = data.ball;
    fieldState = data.gamefield;

    // ------- Game Tick -------
    //  > Game Field Data: {
    //   current_join_token: 8338,
    //   p1: { pos: 400, score: 0, name: 'Player 0' },
    //   p2: { pos: 400, score: 0, name: 'Player 1' },
    //   ball: { x: 990, y: 744, radius: 35, vx: 10, vy: -8 },
    //   gamefield: { width: 1080, height: 1920, paddle_size: 230, paddle_offset: 50 }
    // }
    //  > P1: { pos: 400, score: 0, name: 'Player 1' }
    //  > P2: { pos: 400, score: 0, name: 'Player 0' }
    //  > Ball Data: { x: 990, y: 744, radius: 35, vx: 10, vy: -8 }
    // -------------------------

  };

  set_state('idle');
}

(async () => {
  await game_init();
})();
