import '../shared/style.css';

import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { GameConnection } from '../shared/game_connection.js';

import jquery from 'jquery';
import IndexComponent from './root.vue';
import IndexRoute from './routes/index/index.vue';
import GameOverRoute from './routes/game-over/index.vue';
import GameRoute from './routes/game/index.vue';
import LobbyRoute from './routes/lobby/index.vue';
import Vue3TouchEvents from "vue3-touch-events";

window.$ = jquery;
window.jQuery = jquery;

const routes = [
  { path: '/', component: IndexRoute },
  { path: '/lobby', component: LobbyRoute },
  { path: '/game', component: GameRoute },
  { path: '/game-over', component: GameOverRoute }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});


var Controller = {
  init() {
    //this.disable_zoom();
    let game_conn = new GameConnection('ws_controller')

    setTimeout(() => {
    const app = createApp(IndexComponent);
    app.provide('$game_connection', game_conn);
    app.provide('$store', {});
    app.use(router);
    app.use(Vue3TouchEvents);
    app.mount("#app");

    router.replace('/')

    console.log('Welcome to the controller');
    }, 1000);
  },

  //disable_zoom() {
  //  document.addEventListener('touchmove', function (event) {
  //    if (event.scale !== 1) { event.preventDefault(); }
  //  }, false);

  //  var lastTouchEnd = 0;
  //  document.addEventListener('touchend', function (event) {
  //    var now = (new Date()).getTime();
  //    if (now - lastTouchEnd <= 300) {
  //      event.preventDefault();
  //    }
  //    lastTouchEnd = now;
  //  }, false);
  //}
};

$(Controller.init.bind(Controller));
