<template>
  <div class="recommend">
    <Title>推荐歌单</Title>
    <ul class="recommendList">
      <router-link
        to="/"
        v-for="val in musicRecommendList"
        :key="val.id"
        tag="li"
      >
        <div>
          <img :src="val.picUrl" />
          <span>{{ val.playCount | formatNum }}</span>
        </div>
        <p>{{ val.name }}</p>
      </router-link>
    </ul>
    <Title>最新音乐</Title>
    <MusicItem :newMusicList="newMusicList"></MusicItem>
  </div>
</template>

<script>
import Title from '../components/Title'
import MusicItem from '../components/MusicItem'
export default {
  name: 'Recommend',
  data () {
    return {
      musicRecommendList: [],
      newMusicList: []
    }
  },
  components: {
    Title,
    MusicItem
  },
  filters: {
    formatNum (value) {
      return (value / 10000).toFixed(1) + '万';
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$http.get('/personalized?limit=6')
        .then(data => {
          // console.log(data);
          vm.musicRecommendList = data.data.result;
        })
      vm.$http.get('/personalized/newsong')
        .then(data => {
          // console.log(data);
          vm.newMusicList = data.data.result;
        })
    })
  }
}
</script>

<style lang="less" scoped>
.recommend {
  margin-top: 58px;
  ul.recommendList {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    li {
      width: 33%;
      div {
        position: relative;
        span {
          position: absolute;
          top: 2px;
          right: 3px;
          color: white;
          text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
          font-size: 12px;
          font-weight: bolder;
        }
      }
      p {
        font-size: 13px;
        text-align: left;
        padding: 0 5px 12px;
        font-family: "黑体";
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
    }
  }
}
</style>
