<template>
  <router-link to="" tag="li">
    <slot></slot>
    <div class="left" @click="showPlayer">
      <div v-if="item.highlights" class="highlight">{{ item.name }}</div>
      <div v-if="!item.highlights">{{ item.name }}</div>
      <p>
        <span v-if="item.song.privilege.maxbr > 320000" class="icon"></span>
        {{ item.song.artists | formatAuthor }} -
        <span v-if="item.highlights" class="highlight">{{
          item.song.album.name
        }}</span>
        <span v-if="!item.highlights">{{ item.song.album.name }}</span>
      </p>
    </div>
    <div class="right">
      <span
        @click="playMusic"
        v-show="
          $root.playMusic.currentIndex != num - 1 || !$root.playMusic.isPlay
        "
      ></span>
      <i
        v-show="
          $root.playMusic.currentIndex == num - 1 && $root.playMusic.isPlay
        "
        @click="playMusic"
        class="iconfont icon-zantingtingzhi"
      ></i>
    </div>
  </router-link>
</template>

<script>
import '../assets/icon/iconfont.css'
export default {
  name: 'ListItem',
  props: {
    num: {
      type: Number,
      default: function () {
        return 0;
      }
    },
    item: {
      type: Object
    }
  },
  created () {
    // console.log(this.item);
    // console.log('0000000', this.num);
  },
  methods: {
    playMusic () {
      this.$root.playMusic.musicID = this.item.id;
      this.$root.playMusic.currentIndex = this.num - 1;
      this.$root.playMusic.isPlay = !this.$root.playMusic.isPlay;
      this.$root.playMusic.isShow = !this.$root.playMusic.isShow;
      this.$root.playMusic.flag = true;
      this.$http.get(`/comment/music?id=${this.$root.playMusic.musicID}&limit=10`)
        .then(data => {
          // console.log(data);
          this.$root.playMusic.comments = data.data.comments;
          this.$root.playMusic.hotComments = data.data.hotComments;
        })
    },
    showPlayer () {
      if (this.$root.playMusic.flag) {
        this.$root.playMusic.isShowPlayPage = true;
        this.$root.playMusic.musicID = this.item.id;
        this.$root.playMusic.currentIndex = this.num - 1;
        this.$root.playMusic.isPlay = !this.$root.playMusic.isPlay;
        this.$root.playMusic.isShow = !this.$root.playMusic.isShow;
      }
    }
  },
  filters: {
    formatAuthor (val) {
      let author = '';
      val.forEach((v, i) => {
        if (i == 0) {
          author = v.name;
        } else {
          author += ' / ' + v.name;
        }
      })
      // console.log(author);
      return author;
    }
  }
}
</script>

<style lang="less" scoped>
li {
  border-bottom: 1px solid #f3f3f4;
  display: flex;
  align-items: center;
  .left {
    flex: 1;
    text-align: left;
    padding: 8px 0px;
    div {
      font-weight: bold;
      &.highlight {
        color: #6690c0;
      }
    }
    p {
      color: #989899;
      font-size: 10px;
      span.icon {
        display: inline-block;
        width: 12px;
        height: 8px;
        background: url(../assets/sprits.png) no-repeat;
        background-size: 166px 97px;
      }
      span.highlight {
        color: #6690c0;
        font-weight: bold;
      }
    }
  }
  .right {
    width: 40px;
    position: relative;
    span {
      display: inline-block;
      width: 22px;
      height: 22px;
      background: url(../assets/sprits.png) no-repeat -24px 0px;
      background-size: 166px 97px;
    }
    i {
      font-size: 30px;
      position: absolute;
      top: -18px;
      left: -6px;
      z-index: 4;
      color: #aeaeae;
    }
  }
}
</style>