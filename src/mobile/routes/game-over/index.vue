<template>
  <div id="game-over">
    <h1>Game Over!</h1>

    <p>Player {{ $route.query.winner }} wins!</p>
  </div>
</template>

<script>
export default {
  name: 'GameOver'
}
</script>


<style lang="scss">
</style>
