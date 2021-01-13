<template>
  <div class="loading">
    <div>
      <i></i>
      <i></i>
      <i></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loading',
}
</script>

<style lang="less" scoped>
.loading {
  display: flex;
  height: 20vh;
  justify-content: center;
  align-items: center;
  div {
    width: 28px;
    height: 30px;
    display: flex;
    justify-content: space-between;
    i {
      display: inline-block;
      width: 5px;
      height: 30px;
      background-color: #f22a2a;
      animation: loading 0.5s linear 0s infinite alternate-reverse;
      transform-origin: center center;
      // &:first-of-type {
      //   animation-delay: 0s;
      // }
      // &:last-of-type {
      //   animation-delay: 0s;
      // }
      &:nth-of-type(2) {
        animation-delay: 0.4s;
      }
    }
  }
}
@keyframes loading {
  from {
    transform: scale(0.2);
  }
  to {
    transform: scale(1);
  }
}
</style>