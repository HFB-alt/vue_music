<template>
  <div class="topContent">
    <!-- <img :src="detailData.coverImgUrl" class="bg" /> -->
    <div
      class="container"
      :style="{
        backgroundImage: `url(${detailData.coverImgUrl})`,
      }"
    ></div>
    <div class="box">
      <div class="left">
        <img :src="detailData.coverImgUrl" />
        <span>{{ detailData.playCount | formatCount }}</span>
      </div>
      <div class="right">
        <p>{{ detailData.name }}</p>
        <div class="avatar">
          <img :src="detailData.creator.avatarUrl" />
          <span class="nickname">{{ detailData.creator.nickname }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopContent',
  props: ['detailData'],
  data () {
    return {
    }
  },
  mounted () {
    // console.log('ppppppp', this.detailData);
    console.log('llllllll');
  },
  filters: {
    formatCount (val) {
      return (val / 10000).toFixed(1) + '万';
    }
  }
}
</script>

<style lang="less" scoped>
.topContent {
  padding: 30px 10px 30px 15px;
  position: relative;
  overflow: hidden;
  .container {
    position: absolute;
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;
    filter: blur(20px);
    z-index: 1;
    background-repeat: no-repeat;
    background-size: cover;
    transform: scale(1.5);
    background-position: 50%;
    &::after {
      content: "";
      background-color: rgba(0, 0, 0, 0.25);
      position: absolute;
      top: 0px;
      left: 0px;
      bottom: 0px;
      right: 0px;
    }
  }
  .box {
    display: flex;
    justify-content: space-between;
    position: relative;
    z-index: 2;
    .left {
      position: relative;
      img {
        width: 126px;
        height: 126px;
      }
      span {
        position: absolute;
        top: 2px;
        right: 3px;
        color: white;
        text-shadow: 1px, 1px 8px #ccc;
      }
      &::after {
        content: "歌单";
        width: 40px;
        height: 19px;
        line-height: 19px;
        background-color: #ca0f0c;
        color: white;
        text-shadow: 1px 1px 5px #eee;
        font-size: 12px;
        font-weight: bold;
        position: absolute;
        top: 20px;
        left: 0px;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        text-align: left;
        padding-left: 6px;
      }
    }
    .right {
      flex: 1;
      margin-left: 10px;
      padding-top: 10px;
      p {
        text-align: left;
        color: white;
        font-size: 18px;
        font-weight: bold;
      }
      .avatar {
        margin-top: 20px;
        text-align: left;
        img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          vertical-align: middle;
        }
        span {
          margin-left: 10px;
          font-size: 12px;
          color: #a5a89b;
          text-shadow: 0px 0px 1px #ccc;
        }
      }
    }
  }
}
</style>