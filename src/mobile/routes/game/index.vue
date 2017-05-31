<template>
  <div id="game">
    <h1>Loby</h1>

    <div v-on:mousedown="pressed('left')"
         v-on:mouseup="released('left')"
         v-on:touchstart="pressed('left')"
         v-on:touchend="released('left')"
         class="left">Left</div>

    <div v-on:mousedown="pressed('right')"
         v-on:mouseup="released('right')"
         v-on:touchstart="pressed('right')"
         v-on:touchend="released('right')"
         class="right">Right</div>
  </div>
</template>

<script>
export default {
  name: 'game',
  mounted() {
    this.$game_connection.on_game_over = (data) => {
      if(data.err) {
        alert(data.err);
        location.reload();
      } else {
        this.$router.push({path: 'game-over', query: { winner: data.id}});
      }
    };
  },

  methods: {
    pressed(key) {
      this.set_key_state(key, true);
    },

    released(key) {
      this.set_key_state(key, false);
    },

    set_key_state(key, value) {
      this.key_state[key] = value;

      console.log(this.key_state);
      this.$game_connection.send('key_state', this.key_state);
    }
  },

  data() {
    return {
      key_state: {
        key_up: false,
        key_down: false
      }
    };
  }
}
</script>


<style lang="scss">
  .left, .right {
    display: inline-block;
    width: 40%;
    background-color: #ccc;
    padding: 20px;
  }
</style>
