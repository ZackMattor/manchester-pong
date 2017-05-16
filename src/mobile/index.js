import Vue from 'vue';
import VueRouter from 'vue-router';

import IndexRoute from './routes/index/index.vue';
import GameOverRoute from './routes/game-over/index.vue';
import GameRoute from './routes/game/index.vue';
import LobbyRoute from './routes/lobby/index.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', component: IndexRoute },
  { path: '/lobby', component: LobbyRoute },
  { path: '/game', component: GameRoute },
  { path: '/game-over', component: GameOverRoute }
]

const router = new VueRouter({
  routes
})

var Controller = {
  init() {

    Vue.prototype.$game_connection = new GameConnection('controller');

    const app = new Vue({
      router,
      template: '<router-view></router-view>'}
    ).$mount('#app');

    router.replace('/')

    console.log('Welcome to the controller');

    this.game_connection = new GameConnection('controller');
    this.key_state = {
      key_up: false,
      key_down: false
    };

    // Deal with messages from the server
    this.game_connection.on_bind_status = this.on_bind_status.bind(this);
    this.game_connection.on_game_start = this.on_game_start.bind(this);
    this.game_connection.on_player_win = this.player_win.bind(this);

    $('.control-button').on('mousedown touchstart', this.on_controller_button_press.bind(this));
    $('.control-button').on('mouseup touchend', this.on_controller_button_release.bind(this));

    $('#connect-button').click(this.bind_attempt.bind(this));
  },

  bind_attempt() {
    let data = {
      token: $('input[name="game-token"]').val()
    };

    this.game_connection.send('bind_attempt', data);
  },

  on_bind_status(data) {
    console.log(data);

    if(!data.was_successful) {
      $('input[name="game-token"]').addClass('error');
    } else {
      set_state('lobby');
    }
  },

  on_game_start(data) {
    set_state('controller');
  },

  player_win(data) {
    $('span.player_id').html(data.id);
    set_state('game-over');
  },

  on_controller_button_press(evt) {
    let $ele = $(evt.currentTarget);

    $ele.css('background-color', 'blue');
    this.set_key_state($ele.data('key-name'), true);
  },

  on_controller_button_release(evt) {
    let $ele = $(evt.currentTarget);

    $ele.css('background-color', 'red');
    this.set_key_state($ele.data('key-name'), false);
  },

  set_key_state(key, value) {
    this.key_state[key] = value;

    console.log(this.key_state);
    this.game_connection.send('key_state', this.key_state);
  }
};

$(Controller.init.bind(Controller));
