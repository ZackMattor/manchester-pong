<template>
  <div id="root">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'root',
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
</style>
