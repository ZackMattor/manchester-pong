<template>
<div id="index">
  <h1>Millyard Pong</h1>
  <div class="token">
    <span v-if="err" class="error">{{ err }}</span>
    <span v-else-if="token">{{ token }}</span>
    <span v-else class="placeholder">Enter Game Token...</span>
  </div>

  <keypad v-on:number="on_number"></keypad>
</div>
</template>

<script>
import Keypad from './keypad.vue';

export default {
  inject: ['$game_connection', '$store'],
  name: 'index',

  mounted() {
    this.$game_connection.on_bind_status = this.on_bind_status.bind(this);

    console.log(this.$router.query);

    let game_token_param = ( new URLSearchParams(window.location.search) ).get('game_token');

    if(game_token_param) {
      setTimeout(() => {
        this.$game_connection.send('bind_attempt', { token: game_token_param });
      }, 500);
    }
  },

  methods: {
    on_number(num) {
      if(num == '<') {
        this.token = this.token.slice(0,-1);
      } else {
        this.token += num;
      }

      if(this.token.length === 4) {
        let data = {
          token: this.token
        };

        this.$game_connection.send('bind_attempt', data);
      }
    },

    on_bind_status(data) {
      if(!data.was_successful) {
        this.err = 'Invalid Token...';

        setTimeout(() => {
          this.err = '';
          this.token = '';
        }, 1300);
      } else {
        this.$store.player_id = data.player_id;
        this.$router.push('/lobby');
      }
    }
  },

  data() {
    return {
      token: '',
      err: ''
    };
  },

  components: {Keypad}
}
</script>

<style lang="scss">
  body {
    background-color: #333;
    color: #eee;
  }

  h1 {
    margin-top: 10px;
  }

  .token {
    text-align: center;
    border: 1px solid black;
    font-weight: bold;
    width: 70%;
    padding: 9px;
    font-size: 18px;
    margin: 0 auto;
    margin-top: 20px;
    color: #333;
    background-color: #ccc;
  }

  .placeholder {
    color: #666;
  }

  .error {
    color: red;
  }
</style>
