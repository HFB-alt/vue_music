<template>
  <div class="topNav">
    <ul>
      <li><router-link tag="a" to="/">推荐音乐</router-link></li>
      <li><router-link tag="a" to="/hotMusic">热歌榜</router-link></li>
      <li><router-link tag="a" to="search">搜索</router-link></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TopNav'
}
</script>

<style lang="less" scoped>
.topNav {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  z-index: 99;
  background-color: #fff;
  ul {
    display: flex;
    border-bottom: 1px solid #eeeeee;
    li {
      flex: 1;
      line-height: 40px;
      a {
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        display: inline-block;
        text-decoration: none;
        color: #333333;
        font-size: 15px;
        padding: 0px 4px;
        &.router-link-exact-active {
          color: #f22a2a;
          border-bottom: 2px solid #f22a2a;
        }
      }
    }
  }
}
</style>