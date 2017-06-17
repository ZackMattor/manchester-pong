<template>
  <div id="index">
    <h1>Welcome Player {{$store.player_id + 1}}!</h1>

    <div class="content"><p>Waiting for another player to join...</p></div>
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
  .content {
    background-color: #ccc;
    width: 80%;
    margin: 30px auto;
    color: #333;
    font-size: 20px;
    font-weight: 700;
    padding: 17px;
  }
</style>
