<template>
  <div id="game-over">
    <h1>Game Over!</h1>

    <div class="content">
      <p class="larger">{{ $store.player_id == $route.query.winner ? "You Win!" : 'You lost!' }}</p>

      <div @click="reload" class="btn">Play Again!</div>

      <br>
      Learn about Ralph Baer
      <br>
       <a href="https://orbitgroup.com/baer-square" target="_blank">Visit Baer Square</a>
      <br>
       <a href="https://see-sciencecenter.org/ralph-baer-100/" target="_blank">SEE Science Center</a>
       <br>
       <a href="https://www.nytimes.com/2014/12/08/business/ralph-h-baer-dies-inventor-of-odyssey-first-system-for-home-video-games.html" target="_blank">NYT Article</a>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['$store'],
  name: 'GameOver',

  mounted() {
    let player_won = (this.$store.player_id == this.$route.query.winner);

    this.$ga.event('game_over', player_won ? 'win' : 'lost');
  },

  methods: {
    reload() {
      location.reload();
    }
  }
}
</script>


<style lang="scss">
</style>
