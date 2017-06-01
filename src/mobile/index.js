require('../shared/style.css');

import Vue from 'vue';
import VueRouter from 'vue-router';
import GameConnection from '../shared/game_connection.js';
import jquery from 'jquery';
import VueAnalytics from 'vue-analytics';

import IndexRoute from './routes/index/index.vue';
import GameOverRoute from './routes/game-over/index.vue';
import GameRoute from './routes/game/index.vue';
import LobbyRoute from './routes/lobby/index.vue';

window.$ = jquery;
window.jQuery = jquery;

const routes = [
  { path: '/', component: IndexRoute },
  { path: '/lobby', component: LobbyRoute },
  { path: '/game', component: GameRoute },
  { path: '/game-over', component: GameOverRoute }
];

const router = new VueRouter({
  routes
});


Vue.use(VueRouter);
Vue.use(VueAnalytics, {
  id: 'UA-100333942-1',
  router
});

var Controller = {
  init() {
    Vue.prototype.$game_connection = new GameConnection('ws_controller');
    Vue.prototype.$store = {};

    const app = new Vue({
      router,
      template: '<router-view></router-view>'}
    ).$mount('#app');

    router.replace('/')

    console.log('Welcome to the controller');
  }
};

$(Controller.init.bind(Controller));
