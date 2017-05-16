<template>
  <div id="index">
    <h1>Loby</h1>

    <p>Waiting for player 2 to join</p>
  </div>
</template>

<script>
export default {
  name: 'lobby',
  mounted() {
    this.$game_connection.on_game_start = () => {
      this.$router.push('/game');
    }
  }
}
</script>


<style lang="scss">
</style>
