<template>
  <div id="game">
    <div v-on:mousedown="pressed('left', $event)"
         v-on:mouseup="released('left', $event)"
         v-on:touchstart="pressed('left', $event)"
         v-on:touchend="released('left', $event)"
         class="left disable-dbl-tap-zoom"><i class="fa fa-arrow-up" aria-hidden="true"></i></div>

    <div v-on:mousedown="pressed('right', $event)"
         v-on:mouseup="released('right', $event)"
         v-on:touchstart="pressed('right', $event)"
         v-on:touchend="released('right', $event)"
         class="right disable-dbl-tap-zoom"><i class="fa fa-arrow-down" aria-hidden="true"></i></div>
  </div>
</template>

<script>
export default {
  inject: ['$game_connection', '$store'],
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
    pressed(key, evt) {
      evt.preventDefault();
      this.set_key_state(key, true);
    },

    released(key, evt) {
      evt.preventDefault();
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
  #game {
    display: flex;
  }

  .left {
    border-right: 2px solid #333;
  }

  .left, .right {
    flex-grow: 1;
    color: black;
    font-size: 90px;
    background-color: #ccc;
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: center;

    &:active {
      background-color: #aaa;
    }
  }
</style>
