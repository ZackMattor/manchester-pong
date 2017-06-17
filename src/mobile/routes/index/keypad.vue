<template>
<div class="wrap">
  <div class="keypad">
    <div class="number" @click="clicked(n)" v-for="n in [1,2,3,4,5,6,7,8,9,0,'<']">
      {{ n }}
    </div>
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
    background-color: #ccc;
    color: #333;
    font-size: 31px;
    font-weight: 700;
  }

  .number {
    flex-grow: 1;
    width: 32%;
    cursor: pointer;
    padding: 10px;
    border: 1px solid #333;
  }
</style>
