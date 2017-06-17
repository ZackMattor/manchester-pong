<template>
  <div id="game-over">
    <h1>Game Over!</h1>

    <div class="content">
      <p class="larger">{{ $store.player_id == $route.query.winner ? "You Win!" : 'You lost!' }}</p>

      <div @click="reload" class="btn">Play Again!</div>
    </div>
  </div>
</template>

<script>
export default {
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
