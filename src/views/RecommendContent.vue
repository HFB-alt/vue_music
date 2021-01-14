<template>
  <div class="recommendContent">
    <TopContent :detailData="detailData"></TopContent>
    <div class="singsList">歌曲列表</div>
    <ul>
      <ListItem
        v-for="(item, index) in songsList"
        :key="item.id"
        :item="item"
        :num="index + 1"
      >
        <div class="order">{{ index + 1 }}</div>
      </ListItem>
    </ul>
    <p ref="scrllBar"><Loading v-show="searching" /></p>
    <p v-show="!searching && noMore">没有更多内容了！</p>
  </div>
</template>

<script>
import TopContent from '../components/TopContent'
import ListItem from '../components/ListItem'
import Loading from '../components/Loading'
export default {
  name: 'RecommendContent',
  props: ['id'],
  data () {
    return {
      detailData: {
        coverImgUrl: '',
        name: null,
        creator: {
          avatarUrl: '',
          nikename: null
        },
        playCount: 0,
        trackIds: []
      },
      songsList: [],
      searching: false,
      num: 0,
      noMore: false,
      isRequest: true
    }
  },
  components: {
    TopContent,
    ListItem,
    Loading
  },
  created () {
    // this.isRequest = true;
    window.addEventListener('scroll', this.getMore);
  },
  destroyed () {
    window.removeEventListener('scroll', this.getMore);
  },
  methods: {
    getMore () {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
      let barTop = this.$refs.scrllBar.offsetTop;
      if (scrollTop + clientHeight > barTop) {
        this.num++;
        this.getData(this);
      }
    },
    getData (vm) {
      let musicIds = [];
      let musicIdsStr = [];
      // console.log(vm.isRequest);
      if (vm.isRequest) {
        vm.searching = true;

        vm.$http.get('/playlist/detail?id=' + vm.id)
          .then(data => {
            // console.log(data);
            vm.detailData = {
              coverImgUrl: data.data.playlist.coverImgUrl,
              name: data.data.playlist.name,
              creator: {
                avatarUrl: data.data.playlist.creator.avatarUrl,
                nickname: data.data.playlist.creator.nickname
              },
              playCount: data.data.playlist.playCount,
              trackIds: data.data.playlist.trackIds
            }
            // console.log('aaaaa', vm.detailData);
            musicIds = data.data.playlist.trackIds.slice(vm.num * 20, (vm.num + 1) * 20);
            // console.log(musicIds.length);
            if (musicIds.length >= 20) {
              musicIds.forEach(v => {
                musicIdsStr.push(v.id);
              })
              musicIdsStr = musicIdsStr.join(',');
              vm.noMore = false;
              vm.isRequest = true;
            } else {
              vm.noMore = true;
              vm.isRequest = false;
            }
          })
          .then(() => {
            if (musicIds.length >= 20) {
              vm.$http.get('/song/detail?ids=' + musicIdsStr)
                .then(data => {
                  // console.log(data);
                  for (var i = 0; i < data.data.songs.length; i++) {
                    vm.songsList.push({
                      name: data.data.songs[i].name,
                      id: data.data.songs[i].id,
                      song: {
                        privilege: {
                          maxbr: 0
                        },
                        artists: data.data.songs[i].ar,
                        album: data.data.songs[i].al
                      }
                    });
                  }
                  vm.$root.playMusic.musicList = vm.songsList;
                  // console.log('song', vm.songsList);
                })
            } else {
              vm.searching = false;
            }
          })
          .finally(() => {
            // vm.isRequest = false;
            vm.searching = false;
          })
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.isRequest = true;
      vm.num = 0;
      vm.songsList = [];
      vm.getData(vm);
    })
  },
  // beforeRouteUpdate () {
  //   console.log('update');
  //   this.isRequest = true;
  // }
}
</script>

<style lang="less" scoped>
.recommendContent {
  .singsList {
    width: 100%;
    height: 206x;
    line-height: 26px;
    background-color: #eeeff0;
    font-size: 12px;
    text-align: left;
    padding-left: 8px;
  }
  ul {
    padding: 0 8px 0 40px;
    li {
      position: relative;
      .order {
        position: absolute;
        top: 15px;
        left: -30px;
        font-size: 18px;
        margin-right: 10px;
        font-weight: bold;
        color: #999999;
      }
    }
  }
}
</style>