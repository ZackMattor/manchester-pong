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
  }
};

$(Controller.init.bind(Controller));
