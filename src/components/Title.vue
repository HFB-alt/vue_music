<template>
  <div class="title">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Title'
}
</script>

<style lang="less" scoped>
.title {
  color: #333333;
  text-align: left;
  padding-left: 10px;
  border-left: 2px solid #f22a2a;
  margin: 16px 0px;
}
</style>