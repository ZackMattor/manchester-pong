<template>
  <div id="game-over">
    <h1>Game Over!</h1>

    <p>Player {{ $route.query.winner }} wins!</p>

    <div @click="reload" class="btn">Play Again!</div>
  </div>
</template>

<script>
export default {
  name: 'GameOver',

  methods: {
    reload() {
      location.reload();
    }
  }
}
</script>


<style lang="scss">
</style>
