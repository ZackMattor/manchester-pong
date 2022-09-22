<template>
  <div id="root">
    <div v-if="err_msg" class="alert-box">
      <div class="alert error" v-html="err_msg"></div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  inject: ['$game_connection', '$store'],
  name: 'root',

  mounted() {
    this.$game_connection.on_disconnect = () => {
      this.err_msg = `Uh Oh! Server semes to be down, retrying... <span class="fa fa-cog fa-spin"></span>`;
    };
  },

  data() {
    return {
      err_msg: null
    };
  }
}
</script>

<style lang="scss">
  html, body, #app, #root, #game {
    height: 100%;
  }

  .content {
    background-color: #ccc;
    width: 80%;
    margin: 30px auto;
    color: #333;
    font-size: 20px;
    font-weight: 700;
    padding: 17px;
  }

  .btn {
    cursor: pointer;
    background-color: #333;
    color: white;
    width: 80%;
    margin: 5px auto;
    padding: 14px;
    border-radius: 20px;
    margin-top: 20px;
  }

  .larger {
    font-size: 35px;
  }

  .alert-box {
    position: absolute;
    width: 100%;
    top: 20px;
  }

  .alert {
    width: 80%;
    background-color: #ccc;
    font-size: 18px;
    border-radius: 10px;
    color: #333;
    margin: 0 auto;
    padding: 17px;
  }

  .alert.error {
    background-color: #f2dede;
    border-color: #ebcccc;
    color: #a94442;
  }
</style>
