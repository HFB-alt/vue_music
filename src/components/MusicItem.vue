<template>
  <div class="musicitem">
    <ul class="newmusiclist">
      <router-link to="/" v-for="item in newMusicList" :key="item.id" tag="li">
        <div class="left">
          <div>{{ item.song.name }}</div>
          <p>
            <span v-if="item.song.exclusive"></span>
            {{ item.song.artists | formatAuthor }} - {{ item.song.album.name }}
          </p>
        </div>
        <div class="right">
          <span></span>
        </div>
      </router-link>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'MusicItem',
  props: {
    newMusicList: Array
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
.musicitem {
  .newmusiclist {
    padding: 0 8px;
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
        }
        p {
          color: #989899;
          font-size: 10px;
          span {
            display: inline-block;
            width: 12px;
            height: 8px;
            background: url(../assets/sprits.png) no-repeat;
            background-size: 166px 97px;
          }
        }
      }
      .right {
        width: 40px;
        span {
          display: inline-block;
          width: 22px;
          height: 22px;
          background: url(../assets/sprits.png) no-repeat -24px 0px;
          background-size: 166px 97px;
        }
      }
    }
  }
}
</style>