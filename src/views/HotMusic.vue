<template>
  <div class="hotMusic">
    <div class="hotop">
      <div class="hotMusicList"></div>
      <div class="hotime">更新日期：01月07日</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HotMusic',
  data () {
    return {
      hotMusicList: []
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$http.get('/toplist/detail')
        .then(data => {
          vm.hotMusicList = data.data.list[3].tracks;
          console.log(vm.hotMusicList);
        })
    })
  }
}
</script>


<style lang="less" scoped>
.hotMusic {
  margin-top: 42px;
  .hotop {
    width: 100%;
    height: 145px;
    background: url(../assets/background.jpg) no-repeat;
    background-size: 100% 100%;
    padding-top: 30px;
    padding-left: 20px;
    .hotMusicList {
      width: 142px;
      height: 68px;
      background: url(../assets/sprits.png) no-repeat -23px -30px;
      background-size: 166px 97px;
    }
    .hotime {
      color: white;
      font-size: 12px;
      text-align: left;
      margin-top: 8px;
    }
  }
}
</style>