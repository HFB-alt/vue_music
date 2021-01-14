<template>
  <div class="search">
    <form @submit.stop.prevent="searchList(searchVal)">
      <div class="searchBox">
        <i></i>
        <input
          type="text"
          placeholder="搜索歌曲、歌手、专辑"
          @input="searching"
          v-model="searchVal"
        />
        <i v-show="isShow" @click="close"></i>
      </div>
    </form>
    <div class="hotSearch" v-show="hotSearchShow">
      <div>
        <span>热门搜索</span>
      </div>
      <div class="hotSearchResult">
        <ul>
          <li
            v-for="(item, index) in hotSearchResult"
            :key="index"
            @click="searchCurrent"
          >
            {{ item.first }}
          </li>
        </ul>
      </div>
    </div>
    <ul class="record">
      <Record
        v-show="recordShow"
        v-for="(item, index) in historyRecord"
        :key="index"
        :item="item"
        :index="index"
        @localStorageDataChange="localStorageDataChange"
      ></Record>
    </ul>
    <SearchResult
      v-show="!loadingShow && searchResultShow"
      :result="result"
      :searchVal="searchVal"
      @searchResult="searchList"
      :searchMusicFirstName="searchMusicFirstName"
    ></SearchResult>
    <Loading v-show="loadingShow && searchResultShow"></Loading>
    <Result
      :searchMusicList="searchMusicList"
      v-show="resultShow"
      :keywords="searchVal"
      :searchMusicFirstName="searchMusicFirstName"
    ></Result>
  </div>
</template>

<script>
import SearchResult from '../components/SearchResult'
import Loading from '../components/Loading'
import Result from '../components/Result'
import Record from '../components/Record'
export default {
  name: 'Search',
  components: {
    SearchResult,
    Loading,
    Result,
    Record
  },
  data () {
    return {
      isShow: false,
      searchVal: '',
      loadingShow: false,
      searchResultShow: true,
      resultShow: false,
      result: [],
      searchMusicList: [],
      searchMusicFirstName: '',
      hotSearchResult: [],
      hotSearchShow: true,
      historyRecord: [],
      history: null,
      recordShow: true
    }
  },
  mounted () {
    this.history = localStorage.getItem('record');
    if (this.history != null) {
      this.historyRecord = JSON.parse(this.history);
    }
  },
  methods: {
    searching () {
      if (this.searchVal == '') {
        this.isShow = false;
        this.recordShow = true;
        this.searchResultShow = false;
      } else {
        this.isShow = true;
        this.recordShow = false;
        this.searchResultShow = true;
      }
    },
    close () {
      this.searchVal = '';
      this.resultShow = false;
      this.recordShow = true;
      this.searchResultShow = false;
    },
    searchList (val) {
      // this.searchVal = '';
      if (this.searchVal == '') {
        this.recordShow = true;
      } else {
        this.recordShow = false;
      }
      this.loadingShow = true;
      this.searchResultShow = true;
      this.resultShow = false;
      // JSON.stringify this.historyRecord.push(val);
      this.history = localStorage.getItem('record');
      if (this.history == null) {
        this.history = [];
        this.history.push(val);
        localStorage.setItem('record', JSON.stringify(this.history));
        this.historyRecord = this.history;
      } else {
        let middle = JSON.parse(this.history);
        middle.push(val)
        localStorage.setItem('record', JSON.stringify(middle));
        this.historyRecord = middle;
      }
      this.$http.get('/search?keywords=' + val)
        .then(data => {
          // console.log(data);
          if (data.data.code == 200) {
            this.searchMusicList = data.data.result.songs.map(resultData => {
              return {
                name: resultData.name,
                id: resultData.id,
                highlights: resultData.name,
                song: {
                  artists: resultData.artists,
                  album: resultData.album,
                  privilege: {
                    maxbr: 330000
                  }
                }
              }
            })
          }
          this.$root.playMusic.musicList = this.searchMusicList;
          // console.log(this.searchMusicList);
        })
        .finally(() => {
          this.resultShow = true;
          this.searchResultShow = false;
          this.loadingShow = false;
          this.searchVal = this.searchMusicList[0].name;
          this.searchMusicFirstName = this.searchMusicList[0].name;
          // console.log(1111);
          // console.log(this.searchVal);
          // console.log(this.searchMusicFirstName);
        })
    },
    searchCurrent (e) {
      this.searchVal = e.target.innerHTML;
      this.hotSearchShow = false;
      this.recordShow = false;
      this.isShow = true;
      // this.history = localStorage.getItem('record');
      // if (this.history == null) {
      //   this.history = [];
      //   this.history.push(this.searchVal);
      //   localStorage.setItem('record', (JSON.stringify(this.history)));
      //   this.historyRecord = this.history;
      // } else {
      //   let mid = JSON.parse(this.history);
      //   mid.push(this.searchVal);
      //   // JSON.parse(this.history).push(this.searchVal);
      //   localStorage.setItem('record', JSON.stringify(mid));
      //   this.historyRecord = mid;
      // }
    },
    localStorageDataChange (val) {
      // console.log(val);
      // console.log(1111);
      this.historyRecord = val;
    }
  },
  watch: {
    searchVal (val) {
      if (this.searchVal != '' && this.searchVal != this.searchMusicFirstName) {
        this.loadingShow = true;
        this.searchResultShow = true;
        this.resultShow = false;
        this.hotSearchShow = false;
        this.$http.get('/search/suggest?keywords=' + val)
          .then(data => {
            if (data.data.code == 200 && data.data.result.order) {
              // console.log(data);
              let re = data.data.result.order.reduce((pre, cut) => {
                if (cut != 'playlists') {
                  let rev = data.data.result[cut];
                  return pre.concat(rev);
                } else {
                  return pre;
                }
              }, [])
              // console.log(re);
              this.result = re;
              // console.log(this.searchVal);
              // console.log(this.searchMusicList[0]);
              if (this.searchVal == this.searchMusicFirstName || this.searchVal == '') {
                this.result = [];
              }
            }
            // console.log(this.result);
          })
          .finally(() => {
            this.loadingShow = false;
          })
      } else if (this.searchVal == '') {
        this.hotSearchShow = true;
      } else {
        this.searchResultShow = false;
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$http.get('/search/hot')
        .then(data => {
          // console.log(data);
          vm.hotSearchResult = data.data.result.hots;
        })
    })
  }
}
</script>

<style lang="less" scoped>
.search {
  margin-top: 54px;
  .searchBox {
    margin: 12px 10px;
    border-bottom: 1px solid #eeeeee;
    background-color: #ebecec;
    border-radius: 15px;
    padding: 0px 12px;
    display: flex;
    align-items: center;
    i {
      display: inline-block;
      width: 13px;
      height: 13px;
      &:first-of-type {
        background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNiAyNiI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjYzljOWNhIiBkPSJNMjUuMTgxIDIzLjUzNWwtMS40MTQgMS40MTQtNy4zMTUtNy4zMTRBOS45NjYgOS45NjYgMCAwIDEgMTAgMjBDNC40NzcgMjAgMCAxNS41MjMgMCAxMFM0LjQ3NyAwIDEwIDBzMTAgNC40NzcgMTAgMTBjMCAyLjM0Mi0uODExIDQuNDktMi4xNiA2LjE5NWw3LjM0MSA3LjM0ek0xMCAyYTggOCAwIDEgMCAwIDE2IDggOCAwIDAgMCAwLTE2eiIvPjwvc3ZnPg==);
      }
      &:last-of-type {
        background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyOCAyOCI+PGcgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjYmNiZGJkIiBkPSJNMTQgMGM3LjczMiAwIDE0IDYuMjY4IDE0IDE0cy02LjI2OCAxNC0xNCAxNFMwIDIxLjczMiAwIDE0IDYuMjY4IDAgMTQgMHoiLz48cGF0aCBkPSJNMTkgOUw5IDE5TTkgOWwxMCAxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZWJlY2ViIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIi8+PC9nPjwvc3ZnPg==);
      }
    }
    input {
      flex: 1;
      width: 100%;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      background-color: transparent;
      border: none;
      outline: none;
    }
  }
  .hotSearch {
    padding: 0 14px;
    div {
      text-align: left;
      span {
        font-size: 12px;
        color: #7b7b7b;
      }
    }
    .hotSearchResult {
      margin-bottom: 16px;
      ul {
        display: flex;
        flex-wrap: wrap;
        li {
          display: inline-block;
          padding: 5px 12px;
          font-size: 14px;
          color: #545454;
          border-radius: 14px;
          border: 1px solid #f1f2f5;
          background-color: #fff;
          margin-right: 4px;
          margin-top: 10px;
        }
      }
    }
  }
  .record {
    padding: 0px 8px;
  }
}
</style>