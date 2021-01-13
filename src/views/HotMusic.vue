<template>
  <div class="hotMusic">
    <div class="hotop">
      <div class="hotMusicList"></div>
      <div class="hotime">更新日期：{{ updateDate | formateDate }}</div>
    </div>
    <ul>
      <ListItem
        v-for="(item, index) in hotMusicList"
        :key="item.id"
        :item="item"
        :num="index + 1"
      >
        <div class="order">{{ (index + 1) | formatNum }}</div>
      </ListItem>
    </ul>
    <Loading
      v-if="hotMusicList.length <= 0 || length + 20 != hotMusicList.length"
    ></Loading>
    <router-link :to="{ path: '/hotMusic/' + (num + 1) }" class="more" tag="div"
      >查看更多歌曲</router-link
    >
  </div>
</template>

<script>
import ListItem from '../components/ListItem'
import Loading from '../components/Loading'
export default {
  name: 'HotMusic',
  data () {
    return {
      hotMusicList: [],
      updateDate: new Date(),
      num: 1,
      length: 0
    }
  },
  components: {
    ListItem,
    Loading
  },
  filters: {
    formateDate (val) {
      let date = new Date(val);
      let month = date.getMonth() + 1;
      let day = date.getDay();
      return (month < 10 ? '0' + month : month) + '月' + (day < 10 ? '0' + day : day) + '日';
    },
    formatNum (val) {
      return val < 10 ? '0' + val : val;
    }
  },
  methods: {
    getData (vm) {
      let musicIds = [];
      let musicIdsStr = [];
      vm.length = vm.hotMusicList.length;
      console.log(vm.length);
      // vm.num++;
      vm.$http.get('/top/list?idx=1')
        .then(data => {
          // vm.hotMusicList = data.data.list[3].tracks;
          // console.log(vm.hotMusicList);
          console.log(data);
          vm.updateDate = data.data.playlist.updateTime;
          musicIds = data.data.playlist.trackIds.slice((vm.num - 1) * 20, vm.num * 20);
          musicIds.forEach(v => {
            musicIdsStr.push(v.id)
          })
          musicIdsStr = musicIdsStr.join(',');
          // console.log(musicIdsStr);
        })
        .then(() => {
          vm.$http.get('/song/detail?ids=' + musicIdsStr)
            .then(data => {
              console.log(data);
              // vm.hotMusicList = data.data.songs;
              for (var i = 0; i < data.data.songs.length; i++) {
                vm.hotMusicList.push({
                  name: data.data.songs[i].name,
                  id: data.data.songs[i].id,
                  song: {
                    privilege: {
                      maxbr: data.data.privileges[i].maxbr
                    },
                    artists: data.data.songs[i].ar,
                    album: data.data.songs[i].al
                  }
                });
                // console.log(vm.hotMusicList);
                // vm.length = vm.hotMusicList.length;
              }
              vm.$root.playMusic.musicList = vm.hotMusicList;
              // vm.length = vm.hotMusicList.length;
              // console.log(vm.length);
              // console.log(vm.hotMusicList.length);
            })
        })

    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.hotMusicList = [];
      vm.getData(vm);
    })
  },
  beforeRouteUpdate (to, from, next) {
    this.num++;
    this.getData(this);
    next();
  },
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
  ul {
    padding: 0 8px 0 40px;
    li {
      position: relative;
      .order {
        position: absolute;
        top: 15px;
        left: -30px;
        color: #f22a2a;
        font-size: 18px;
        // border-bottom: 1px solid #fff;
        margin-right: 10px;
        font-weight: bold;
      }
      &:nth-of-type(n + 4) {
        .order {
          color: #999999;
        }
      }
    }
  }
  .more {
    margin: 10px 0px;
    color: #999999;
    font-size: 14px;
  }
}
</style>