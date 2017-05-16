<template>

<div id="index">
<h1>Milyard Pong</h1>
<div class="token">Token: {{ token }}</div>

<br>

<keypad v-on:number="on_number"></keypad>
</div>

</template>

<script>
import Keypad from './keypad.vue';

export default {
  name: 'index',

  mounted() {
    this.$game_connection.on_bind_status = this.on_bind_status.bind(this);
  },

  methods: {
    on_number(num) {
      if(this.token.length !== 4) {
        this.token += num;

        if(this.token.length === 4) {
          let data = {
            token: this.token
          };

          this.$game_connection.send('bind_attempt', data);
        }
      }
    },

    on_bind_status(data) {
      if(!data.was_successful) {
        this.token = "";
      } else {
        this.$router.push('/lobby');
      }
    }
  },

  data() {
    return {
      token: ''
    };
  },

  components: {Keypad}
}
</script>


<style lang="scss">
  .number {
    border: 1px solid black;
    padding: 20px;
  }
</style>
