<template>
  <div id="game">
    <div v-on:mousedown="pressed('left')"
         v-on:mouseup="released('left')"
         v-on:touchstart="pressed('left')"
         v-on:touchend="released('left')"
         class="left"><i class="fa fa-arrow-up" aria-hidden="true"></i></div>

    <div v-on:mousedown="pressed('right')"
         v-on:mouseup="released('right')"
         v-on:touchstart="pressed('right')"
         v-on:touchend="released('right')"
         class="right"><i class="fa fa-arrow-down" aria-hidden="true"></i></div>
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
