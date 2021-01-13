<template>
  <div class="searchResult">
    <ul>
      <li class="search" v-show="searchVal != searchMusicFirstName">
        搜索“{{ searchVal }}”
      </li>
      <li v-for="item in result" :key="item.id" @click="searchIt(item)">
        <i></i>
        <span>{{ item.name }}-{{ item | filterItem }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SearchResult',
  props: {
    result: {
      type: Array,
      default: function () {
        return []
      }
    },
    searchVal: {
      type: String,
      default: function () {
        return '';
      }
    },
    searchMusicFirstName: {
      type: String
    }
  },
  data () {
    return {
      history: null,
      historyRecord: [],
    }
  },
  methods: {
    searchIt (val) {
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
      this.$emit('searchResult', val.name);
    }
  },
  filters: {
    filterItem (val) {
      if (val.artists) {
        return '歌曲'
      } else if (val.artist) {
        return '专辑'
      } else {
        return '歌手'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.searchResult {
  ul {
    margin: 0px 8px;
    .search {
      color: #4e7eb6;
      font-size: 14px;
      border-bottom: 1px solid #eeeeee;
    }
    li {
      display: flex;
      height: 40px;
      line-height: 40px;
      align-items: center;
      i {
        display: inline-block;
        width: 15px;
        height: 15px;
        background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMCAzMCI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjMDQwMDAwIiBkPSJNMjguMTgxIDI3LjUzNWwtMS40MTQgMS40MTQtNy43NTUtNy43NTRBMTEuNDQ1IDExLjQ0NSAwIDAgMSAxMS41IDI0QzUuMTQ5IDI0IDAgMTguODUyIDAgMTIuNSAwIDYuMTQ5IDUuMTQ5IDEgMTEuNSAxIDE3Ljg1MiAxIDIzIDYuMTQ5IDIzIDEyLjVjMCAyLjc1Ni0uOTczIDUuMjg1LTIuNTg5IDcuMjY2bDcuNzcgNy43Njl6TTExLjUgM2E5LjUgOS41IDAgMSAwIDAgMTkgOS41IDkuNSAwIDAgMCAwLTE5eiIgb3BhY2l0eT0iLjMiLz48L3N2Zz4=);
      }
      span {
        display: inline-block;
        flex: 1;
        border-bottom: 1px solid #eeeeee;
        text-align: left;
        padding-left: 12px;
        font-size: 16px;
        color: #515151;
      }
    }
  }
}
</style>