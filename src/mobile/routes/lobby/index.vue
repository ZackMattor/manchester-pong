<template>
  <div id="index">
    <h1>Welcome Player {{$store.player_id + 1}}!</h1>

    <p>Waiting for another player to join...</p>
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
