<template>
  <div class="recommend">
    <!-- 轮播图 -->
    <van-swipe :autoplay="4000">
      <van-swipe-item v-for="(image, index) in bannerData" :key="index">
        <img v-lazy="image.pic" />
      </van-swipe-item>
    </van-swipe>
    <Loading v-if="bannerData <= 0"></Loading>

    <Title>推荐歌单</Title>
    <ul class="recommendList">
      <!-- 传变量的时候，只有第一种是正确的，后两种都是错误的 -->
      <!-- :to="{ path: '/recommendContent/' + val.id }" -->
      <!-- to="'/recommendContent/'+val.id" -->
      <!-- to="`/recommendContent${val.id}`" -->
      <router-link
        v-for="val in musicRecommendList"
        :key="val.id"
        :to="{ path: '/recommendContent/' + val.id }"
        tag="li"
      >
        <div>
          <img :src="val.picUrl" />
          <span>{{ val.playCount | formatNum }}</span>
        </div>
        <p>{{ val.name }}</p>
      </router-link>
    </ul>
    <Loading v-if="musicRecommendList <= 0"></Loading>
    <Title>最新音乐</Title>
    <MusicItem :newMusicList="newMusicList"></MusicItem>
  </div>
</template>

<script>
import Title from '../components/Title'
import MusicItem from '../components/MusicItem'
import Loading from '../components/Loading'
import { Swipe, SwipeItem } from 'vant'
export default {
  name: 'Recommend',
  data () {
    return {
      musicRecommendList: [],
      newMusicList: [],
      bannerData: []
    }
  },
  components: {
    Title,
    MusicItem,
    Loading,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
  },
  filters: {
    formatNum (value) {
      return (value / 10000).toFixed(1) + '万';
    }
  },
  methods: {
    // playMusic (id) {
    //   this.$emit('playMusic', id);
    // }
  },
  // computed: {
  //   isReq () {
  //     if (!this.$root.playMusic.isRequest) {
  //       this.$root.playMusic.isRequest = true;
  //     }
  //     return this.$root.playMusic.isRequest;
  //   }
  // },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$http.get('/personalized?limit=6')
        .then(data => {
          // console.log(data);
          vm.musicRecommendList = data.data.result;
        })
        .catch(() => {
        })
      vm.$http.get('/personalized/newsong')
        .then(data => {
          // console.log(data);
          vm.newMusicList = data.data.result;
          vm.$root.playMusic.musicList = data.data.result;
        })
        .catch(() => {
        })
      vm.$http.get('/banner?type=2')
        .then(data => {
          vm.bannerData = data.data.banners.slice(0, 5);
          // console.log(vm.bannerData);
        })
    })
  }
}
</script>

<style lang="less" scoped>
.recommend {
  margin-top: 44px;
  ul.recommendList {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    li {
      width: 33%;
      &:nth-of-type(n + 4) {
        margin-top: 12px;
      }
      div {
        position: relative;
        img {
          border-radius: 12px;
        }
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
        padding: 0 5px;
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
