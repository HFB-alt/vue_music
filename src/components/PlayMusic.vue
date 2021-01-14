<template>
  <div class="playMusic">
    <div class="player">
      <audio
        ref="musicplayer"
        autoplay
        @timeupdate="timeupdate"
        :src="`https://music.163.com/song/media/outer/url?id=${$root.playMusic.musicID}.mp3`"
      />
      <div class="playBar">
        <i ref="rotateImg">
          <img :src="song.al.picUrl" />
        </i>
        <i class="iconfont icon-shangyishou" @click="prev"></i>
        <i @click="showPlayer">
          {{ song.ar | formatAuthor }} - {{ song.name }}
        </i>
        <i class="iconfont icon-xiayishou" @click="next"></i>
        <i @click="togglePlay">
          <canvas ref="canvas" width="30" height="30"></canvas>
          <span
            :class="[
              'iconfont',
              {
                'icon-sanjiaoxing':
                  !$root.playMusic.isPlay && !$root.playMusic.isShow,
                'icon-dengyu-':
                  $root.playMusic.isPlay && $root.playMusic.isShow,
              },
            ]"
          ></span>
        </i>
      </div>
      <div class="players" v-show="$root.playMusic.isShowPlayPage">
        <div
          class="playerbg"
          :style="{
            backgroundImage: `url(${song.al.picUrl})`,
          }"
        ></div>
        <div class="player">
          <img src="../assets/img/pole.png" class="pole" />
          <div class="playCD" ref="playingCD" @click="togglePlay">
            <div>
              <img src="../assets/img/player.png" />
              <div class="musicPic">
                <img :src="song.al.picUrl" />
              </div>
            </div>
            <!-- <div class="musicPic">
              <img :src="song.al.picUrl" />
            </div> -->
          </div>
          <i class="playButton" v-show="$root.playMusic.isPlay"></i>
        </div>
        <div class="box">
          <h1>{{ song.name }}</h1>
          <h3>{{ song.ar | formatAuthor }}</h3>
          <div class="lrc" ref="moveUl" @scroll="scrollMove">
            <!-- @touchmove="scrollDirection" -->
            <!-- @touchstart="lyricScroll" -->
            <!-- <div> -->
            <ul>
              <!-- :style="{
                  top: `-${index * 25}px`,
                }" -->
              <!-- transform: `translateY(-${index * 25}px)`, -->
              <li
                v-for="(item, i) in lrcArr"
                :key="i"
                :class="{ active: i == index }"
                @click="toggleIt(i)"
              >
                {{ item.lyric }}
              </li>
            </ul>
            <!-- </div> -->
          </div>
        </div>

        <div class="comments">
          <h3 class="hotComments" v-show="hotComments.length > 0">精彩评论</h3>
          <ul>
            <Comments
              v-for="item in hotComments"
              :key="item.commentId"
              :item="item"
            ></Comments>
          </ul>
          <h3 class="newComments" v-show="comments.length > 0">最新评论</h3>
          <ul>
            <Comments
              v-for="item in comments"
              :key="item.commentId"
              :item="item"
            ></Comments>
          </ul>
        </div>
        <i class="iconfont icon-cha" @click="close"></i>
      </div>
    </div>
  </div>
</template>
<script>
import '../assets/icon/iconfont.css'
import Comments from './Comments'
export default {
  name: 'PlayMusic',
  props: ['musicID'],
  data () {
    return {
      song: {
        al: {
          picUrl: ''
        },
        name: '-Music-Player--',
        ar: []
      },
      lrcArr: [],
      index: 0,
      timer: null,
      // count: 0
      // start: 0,
      // end: 0,
      flag: true,
      timer1: null,
      timer2: null
    }
  },
  components: {
    Comments
  },
  watch: {
    musicID (val) {
      this.$http.get('/song/detail?ids=' + val)
        .then(data => {
          // console.log(data);
          this.song = data.data.songs[0];
        });
      this.$http.get('/lyric?id=' + val)
        .then((data) => {
          // console.log(data);
          let detailStr = data.data.lrc.lyric;
          let detailArr = detailStr.split(/\n/);
          // console.log(detailArr);
          detailArr.pop();
          let reg = /\[(\d+):(\d+\.\d+)\](.+)/;
          this.lrcArr = detailArr.map(v => {
            reg.test(v);
            return {
              time: parseInt((RegExp.$1 * 60)) + parseFloat(RegExp.$2),
              lyric: RegExp.$3
            }
          })
          // console.log('hhhhh', this.lrcArr);
        })
    },
    state (val) {
      if (val == true) {
        this.$refs.rotateImg.style.animationPlayState = "running";
        this.$refs.musicplayer.play();
      } else {
        this.$refs.rotateImg.style.animationPlayState = "paused";
        this.$refs.musicplayer.pause();
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
      return author;
    }
  },
  computed: {
    state () {
      return this.$root.playMusic.isPlay;
    },
    comments () {
      return this.$root.playMusic.comments;
    },
    hotComments () {
      return this.$root.playMusic.hotComments;
    }
  },
  methods: {
    togglePlay () {
      if (this.$root.playMusic.flag) {
        this.$root.playMusic.isShow = !this.$root.playMusic.isShow;
        if (this.$root.playMusic.isPlay) {
          this.$root.playMusic.isPlay = false;
          this.$refs.musicplayer.pause();
          this.$refs.rotateImg.style.animationPlayState = "paused";
          this.$refs.playingCD.style.animationPlayState = "paused";
        } else {
          this.$root.playMusic.isPlay = true;
          this.$refs.musicplayer.play();
          this.$refs.rotateImg.style.animationPlayState = "running";
          this.$refs.playingCD.style.animationPlayState = "running";
        }
      }
    },
    timeupdate (e) {
      let currentTime = e.target.currentTime;
      let duration = e.target.duration;
      let percent = currentTime / duration;
      clearTimeout(this.timer2);
      this.timer2 = null;
      for (let i = 0; i < this.lrcArr.length; i++) {
        //time报错修改的部分
        // console.log('+++++++++++', this.lrcArr[i].time);
        if (this.lrcArr[i].time) {
          let lrcTime = this.lrcArr[i].time;
          // if (lrcTime == this.lrcArr[this.lrcArr.length - 1].time) {
          // this.index = i;
          // this.$root.playMusic.musicList.forEach((v, i) => {
          //   if (v.id == this.$root.playMusic.musicID) {
          //     this.$root.playMusic.musicID = this.$root.playMusic.musicList[i + 1].id;
          //   }
          // })
          // break;
          // } else 
          // if (typeof this.lrcArr[i + 1].time != 'undefined') {
          if (lrcTime < this.lrcArr[this.lrcArr.length - 1].time) {
            if (currentTime >= lrcTime && currentTime < this.lrcArr[i + 1].time) {
              // if (this.top == 0) {
              // setTimeout(function () {
              this.index = i;
              // this.top = 0;
              // }, 2000);
              // console.log(this.index);
              if (this.index > 3 && this.index < this.lrcArr.length - 12 && this.flag) {
                // this.$refs.ul.style.transform = `translateY(-${(this.currentIndex - 3) * 30}px)`;
                // this.$refs.scroll.scrollTop = (this.currentIndex - 3) * 30;
                this.$refs.moveUl.scrollTop = (this.index - 3) * 25;
              }
              break;
              // }
            } else if (currentTime == duration) {
              let list = this.$root.playMusic.musicList;
              clearTimeout(this.timer);
              for (let j = 0; j < list.length; j++) {
                // console.log(list[j].id);
                // console.log(this.$root.playMusic.musicID);
                if (list[j].id == this.$root.playMusic.musicID) {
                  this.timer = setTimeout(function () {
                    this.$root.playMusic.musicID = list[j + 1].id;
                    // console.log('123123', j);
                  }.bind(this), 2000);
                  break;
                }
              }
            }
          }
          if (this.timer2 == null && this.index == this.lrcArr.length - 2) {
            this.timer2 = setTimeout(() => {
              this.index = 0;
              this.$refs.moveUl.scrollTop = 0;
            }, 500);
          }
          //  else {
          //   let list = this.$root.playMusic.musicList;
          //   clearTimeout(this.timer);
          //   for (let j = 0; j < list.length; j++) {
          //     if (list[j].id == this.$root.playMusic.musicID) {
          //       this.timer = setTimeout(function () {
          //         this.$root.playMusic.musicID = list[j + 1].id;
          //       }.bind(this), 4000);
          //       break;
          //     }
          //   }
          // }
        }
      }

      this.drawCircle(percent);
    },
    drawCircle (percent) {
      let canvas = this.$refs.canvas;
      let ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.strokeStyle = 'black';
      ctx.arc(15, 15, 13, -(Math.PI / 2), Math.PI * 1.5);
      ctx.stroke();
      ctx.closePath();

      ctx.beginPath();
      ctx.strokeStyle = 'white';
      let p = percent - 0.25;
      ctx.arc(15, 15, 13, -(Math.PI / 2), Math.PI * 2 * p);
      ctx.stroke();
      ctx.closePath();
    },
    showPlayer () {
      if (this.$root.playMusic.flag) {
        this.$root.playMusic.isShowPlayPage = true;
      }
    },
    close () {
      this.$root.playMusic.isShowPlayPage = false;
    },
    next () {
      this.$root.playMusic.musicList.forEach((v, i) => {
        if (v.id == this.musicID) {
          // console.log(111);
          this.$root.playMusic.musicID = this.$root.playMusic.musicList[i + 1].id;
          // console.log(i);
        }
      })
    },
    prev () {
      this.$root.playMusic.musicList.forEach((v, i) => {
        if (v.id == this.musicID) {
          // console.log(111);
          this.$root.playMusic.musicID = this.$root.playMusic.musicList[i - 1].id;
        }
      })
    },
    // lyricScroll () {
    // this.start = e.changedTouches[0].pageY;
    // },
    // scrollDirection () {
    // this.end = e.changedTouches[0].pageY;
    // let move = this.end - this.start;
    // console.log(-this.index * 25 + move);
    // let m = -this.index * 25 + move;
    // this.$refs.moveUl.style.transform = `translateY(${m}px)`;
    // },
    scrollMove () {
      // this.top = e.target.scrollTop;
      // console.log(top);
      // if (this.top == 0) {
      //   this.top = -1;
      //   this.index -= 3;
      // }
      this.flag = false;
      clearTimeout(this.timer1);
      this.timer1 = null;
      if (this.timer1 == null) {
        this.timer1 = setTimeout(() => {
          this.flag = true;
        }, 1000);
      }
    },
    toggleIt (i) {
      // console.log('111122333444');
      let timeVal = this.lrcArr[i].time;
      // console.log(timeVal);
      this.$refs.musicplayer.currentTime = timeVal;
      // this.currentIndex = index;
    }
  },

}
</script>
<style lang="less" scoped>
.playMusic {
  position: fixed;
  bottom: 0px;
  z-index: 99;
  width: 100%;
  background-color: #fff;
  .player {
    width: 100%;
    audio {
      width: 100%;
      height: 36px;
    }
    .playBar {
      display: flex;
      align-items: center;
      height: 50px;
      padding: 0 8px;
      background-color: #252525;
      // background-color: rgba(0, 0, 0, 0.3);
      i {
        display: inline-block;
        &:first-of-type {
          width: 40px;
          height: 40px;
          animation: imgRotate 4s linear 0s infinite;
          border-radius: 50%;
          overflow: hidden;
          // font-size: 34px;
          background: url(../assets/img/playCD.png) no-repeat;
          background-size: contain;
        }
        &:nth-of-type(2),
        &:nth-of-type(4) {
          color: white;
        }
        &:nth-of-type(2) {
          margin-left: 30px;
        }
        &:nth-of-type(4) {
          margin-right: 30px;
        }
        &:nth-of-type(3) {
          flex: 1;
          font-size: 16px;
          color: white;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        &:last-of-type {
          width: 30px;
          height: 30px;
          position: relative;
          color: white;
          span {
            position: absolute;
            top: 7px;
            left: 8px;
          }
        }
      }
    }
    .players {
      width: 100vw;
      height: 100vh;
      background-color: #252525;
      position: relative;
      // overflow: hidden;
      // overflow: scroll;
      overflow-y: scroll;
      overflow-x: hidden;
      .playerbg {
        position: fixed;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
        z-index: 1;
        background-repeat: no-repeat;
        background-size: cover;
        transform: scale(1.5);
        background-position: 50%;
        filter: blur(30px);
        &::before {
          content: " ";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          top: 0;
          background-color: rgba(0, 0, 0, 0.5);
        }
      }
      .player {
        position: relative;
        z-index: 2;
        .pole {
          width: 96px;
          height: 137px;
        }
        .playCD {
          position: relative;
          top: -8vh;
          z-index: -1;
          animation: imgRotate 4s linear 0s infinite;
          div {
            img {
              width: 80vw;
              height: 45vh;
            }
            .musicPic {
              height: 29vh;
              width: 29vh;
              position: absolute;
              top: 8vh;
              left: 14vh;
              border-radius: 50%;
              overflow: hidden;
              img {
                height: 100%;
                vertical-align: middle;
              }
            }
          }
        }
        .playButton {
          display: inline-block;
          background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKgAAACoCAMAAABDlVWGAAABJlBMVEUAAAAAAAD////l5eX///9iYmKDg4Pn5+f///9YWFj////09PT////4+Pjt7e3///////9oaGhBQUH////////////////CwsIaGhr///8xMTEkJCT////7+/vp6en///////////////+srKyoqKienp58fHz////y8vKTk5P///8EBAT////////////////V1dW3t7f////////////////////v7++jo6N9fX3///////+UlJT////s7Oz////Nzc3///////+RkZGPj495eXkTExP////////29vb////k5OTPz882Njb////////////c3Nz///////9ycnJsbGz///9dXV3////////Q0ND///9QUFD///////////////////9FeiN6AAAAYXRSTlNmAP3c+oWT3ueB9vA19ealRId5EQbuurpu83RxD/nh05dfAquooo+M7JtzaSolE+vMspJ3Wj7w6KSQj6ucKeXNxLWnmpmObVYd8t3axXZRSt7TvbKLideCeSzHnn4V3Nh6YarbPAAABlRJREFUeNrU14lWEmEYh/GXcdj3HQTZRCkS913UNE2zbLd9Oc/930Q2LmVpwPAC03MD/M5835n/IC6dkqHnzcVoZvdkLp2HfHruZDcTXWw+DyVdOilAt6uNjI8782Ua1W2XjTShtdDSmzRdlH6zFKq5bKQBTS5H57gqXJrP1tsb7kShkBPJFQoJ90a7np0vhblqLrrc8R7oQ4vVPZOLIp8mp8flzsanJ59FuMjcqxZdHVKFxvYDWK1lPQXpooInu4ZVYD/m6pAWNLn0DSvvekJ6KLHuxerb0qyrQwrQViV/oZzKSc/lpi6sgUrLdSN16MyWARBcOBWbnS4EAYytj67r1KGtqMUseaSvPCWLGr14u+pDZysmwFhc+i4+BmBWZgcATTXTFvO9qOS3qOlmShu68g7A6xa13F6A7yuq0ORnA9jZENU2dgDjc1IPGvMB4QNR7+AJ4IspQVObBjDmF+Wur6qxmdKAbpeBoEcGlCcIlLf7hx7lOzxOlYeaP+oTmmoYQFsGWhswGql+oMUMEInLgItHgEzRPvS43OHYVY+/fGwXGvIBkzKU6oAvZA8aywOPZEg9AvIxO9AXAZg4lKF1OAGBF71DX5jw5EyG2NkTMJ/3Co2ZcM8tQ819D8xYb9CVgA2nijSw0gs0tArBzk59aRBWQ91Dj30QjssIiofBd9wttFiGiTMZSWcTUC52B629Bg5lRB0Cr2tdQRvAfRlZ94FGN9AjA+oywupgHHWGzuRhTEbaGORnOkFTZYj4ZaT5I1BOdYBuAnEZcXFg89/QmAFtGXltMGL/ghZ9I7+g19fUV/wHtAJBvzggfxAqd0NXDPCII/KAsXIXNPXOIQd/efjvUndAmxB2xMH/zB+G5u3Qr2k4EMd0AOmvt0IrsCMOagcqt0FbJkyLg5oGs3ULNApecVReiP4NnTHALY7KDcbHv6BbDno1XTUGW39CWwa8F4flB6P1B3TRgQ/UeqSLN6GzAQd83f1dHAKzN6AfoCQOrARLN6Andr9GpiITT9/KwPLAye/QGATFTusAxsOCDKogxH6D7sOC2GkNq+B9GVALsP8LWgzAqdjJ4LJXCRlIpxAoXkOrtteT6yYmH8gg8kL1GroHU/1CoTSQBZ6CvSto0oRc/1DM7GNRLwdm8hK6DF5RgMI9j6jnheVLaBTWdaAwPy7KrUP0Alqbg4QWlPCU6JaAuZoFDcGaqEHh6RdRLQIhC/oBsppQzAXVN1UWlixoBjyqUIhozr8H3vyE1lYhpwnVnv8CpH9CZyAi2lAIPtK8pDPn0Cp8UoWqz/8zqJ5DGzCpCdWf/0lonEMzMK0J1Z//acicQ30wrgnVn/9x8LkkCWFRherPfxiSEgKvLlR//r0QkmWY14Xqz/88LEsTsqpQ/fm3RlQWoa4L1Z//OixKFNq6UP35vw9RycDGMKAYD3P9vEhlF9y6UP35d8OuvISELlR//hPwUqxh0oTqz781TbIKueFB4em4rb/Mq5IfMpRn0nOPIS+ADBUatvcz/w/0B/X2VgMACMNQ9AMnWOADKwT/QuahyZYcDcte7e146X9W+vFmWmEzOeOJGfjMCmWOEubMYw7no7wizHPHvMuMAMFIOo5IxsiOjJDLSOOM2cDYN44hxliMjGnL2OAOWMCgGgz84uBEDKDFIG8ORLhzLPO2Y5kK6PpMdJiBsR28nQkMOBEMJtTixISY4JUTZWPCgVXevesgCINhGG7dZPLEIg7GRRsMTsaoMTEOnmLUuBgn+e//JuTHGt0aKT3y3QIFpj6vO9ctnbnAmr9PIysefn0E0PfhkjW92HFtnQHULn5AAG9aISZGF3NaQYxVrInRrcVYBW4H5vkPEPIfuIV5UGXhClHT8Qv9oXQ/MckoTfb+wVTGqK8ZUl9+4mmUnpGj03pOmzlH5y/w5w6ZiAil+G9qA0KpkfWMTxKsJ6530wel3try9CwjSscg27BTDcw321gHjzyuEjj9IbwP1hPeDqHo2abP0pn5XMR/NhTB/fyo2gv3q0gh1JSkEHCrUuMSG1VxCdxDOtfR1ZDr4AGUwIUACi5JJZMyx1RHUgY3kIn0LBuFQk2EFlv7J3t0+id7JPi86wlJsfm9FUVbQrZR1LrPmQ0hKZfSXC7Fzr5LeD7uGoYBQBCGV56PS2g5ewGy+NkUNbjr9gAAAABJRU5ErkJggg==)
            0 0 no-repeat;
          width: 56px;
          height: 56px;
          position: absolute;
          top: 32vh;
          left: 43vw;
          z-index: 9;
          background-size: 56px;
        }
      }
      .box {
        position: absolute;
        top: 59vh;
        left: 50%;
        transform: translateX(-50%);
        width: 80vw;
        z-index: 10;
        h1 {
          font-size: 28px;
          font-weight: bolder;
          text-shadow: 2px 2px 5px black;
          color: white;
        }
        h3 {
          font-size: 20px;
          font-weight: bold;
          text-shadow: 1px 1px 3px black;
          color: white;
        }
        .lrc {
          position: relative;
          height: 31vh;
          overflow-y: scroll;
          // div {
          //   position: absolute;
          //   top: 8vh;
          //   width: 100%;
          ul {
            // height: 20vh;
            position: relative;
            // overflow-y: scroll;
            // top: 0px;
            li {
              line-height: 25px;
              font-size: 16px;
              color: #424140;
              font-weight: bolder;
              text-shadow: 1px 1px 3px #fff;
              &.active {
                font-size: 20px;
                color: #ffffff;
              }
            }
          }
          // }
        }
      }
      .comments {
        padding: 0 8px;
        position: relative;
        top: 35vh;
        z-index: 20;
        h3 {
          position: relative;
          z-index: 1;
          color: white;
          font-size: 16px;
          font-weight: bold;
          text-align: left;
          margin: 10px 0px;
        }
      }
      i {
        position: fixed;
        top: 8px;
        right: 10px;
        color: white;
        z-index: 20;
      }
    }
  }
  @keyframes imgRotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
</style>
