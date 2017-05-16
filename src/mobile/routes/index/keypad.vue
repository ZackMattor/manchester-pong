<template>
<div class="wrap">
  <div class="keypad">
    <span class="number" @click="clicked(n)" v-for="n in [1,2,3,4,5,6,7,8,9,0]">{{ n }}</span>
  </div>
</div>
</template>

<script>
export default {
  name: 'app',
  methods: {
    clicked(n) {
      this.$emit('number', n);
    }
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    };
  }
}
</script>

<style lang="scss">
  .wrap {
    display: flex;
    justify-content: center;
    user-select: none;
  }

  .keypad {
    display: flex;
    flex-wrap: wrap;
    width: 70%;
  }

  .number {
    flex-grow: 1;
    width: 32%;
  }
</style>
