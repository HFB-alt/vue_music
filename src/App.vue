<template>
  <div id="app">
    <TopNav v-show="$route.meta.isShowNav"></TopNav>
    <div style="padding-bottom: 50px">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    <PlayMusic :musicID="$root.playMusic.musicID"></PlayMusic>
  </div>
</template>

<script>
import PlayMusic from './components/PlayMusic'
import TopNav from './components/TopNav'
export default {
  name: 'App',
  components: {
    PlayMusic,
    TopNav
  },
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #fcfcfd;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
