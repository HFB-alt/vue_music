<template>
  <div class="result">
    <p v-show="multimatchResult.length != 0">最佳匹配</p>
    <ul class="box">
      <li v-for="item in multimatchResult" :key="item.id">
        <div class="bestFitting">
          <div class="left">
            <img :src="item.picUrl" />
          </div>
          <div class="center">
            {{ item.occupation }}：{{ item.name }}
            <span v-show="item.aliasStr != []"
              >({{ aliasStr | formatAlias }})
            </span>
          </div>
          <div class="right">
            <i></i>
          </div>
        </div>
      </li>
    </ul>

    <ul>
      <ListItem
        v-for="item in searchMusicList"
        :key="item.id"
        :item="item"
      ></ListItem>
    </ul>
  </div>
</template>

<script>
import ListItem from './ListItem'
export default {
  name: 'Result',
  props: {
    searchMusicList: {
      type: Array,
      default: function () {
        return [];
      }
    },
    keywords: String,
    searchMusicFirstName: String
  },
  components: {
    ListItem
  },
  data () {
    return {
      multimatchResult: [],
      aliasStr: []
    }
  },
  watch: {
    keywords (val) {
      if (this.keywords == this.searchMusicFirstName) {
        // console.log(this.multimatchResult);
        this.multimatchResult = [];
        // console.log(this.multimatchResult);
        this.aliasStr = [];
        this.$http.get('/search/multimatch?keywords=' + val)
          .then(data => {
            // console.log('result1111==>', data);
            // this.multimatchResult = data.data.result;
            let resultData = data.data.result.orders.reduce((prev, current) => {
              if (current != 'new_mlog' && current != 'mv') {
                return prev.concat(data.data.result[current]);
              }
              return prev;
            }, []);
            this.multimatchResult = resultData;
            // console.log(Array.isArray(this.multimatchResult));
            // console.log(this.multimatchResult);
            if (this.multimatchResult.length != 0) {
              this.aliasStr = this.multimatchResult[0].alias;
            }
            // console.log(1111222221);
            // console.log('kkkkkk', this.multimatchResult);
          })
      }
    }
  },
  filters: {
    formatAlias (val) {
      // console.log('val', val);
      let str = '';
      val.forEach(v => {
        // console.log(v);
        str = str + '/' + v;
      })
      return str.slice(1);
    }
  }
}
</script>

<style lang="less" scoped>
.result {
  padding: 0 8px;
  p {
    font-size: 12px;
    color: #6d6d6d;
    text-align: left;
  }
  ul.box {
    margin-top: 8px;
    li {
      border-bottom: 1px solid #f3f3f4;
      padding-bottom: 8px;
      .bestFitting {
        display: flex;
        align-items: center;
        line-height: 50px;
        .left {
          width: 58px;
          img {
            width: 100%;
            vertical-align: middle;
          }
        }
        .center {
          flex: 1;
          font-weight: bold;
          font-size: 16px;
          color: #3d3d3d;
          text-align: left;
          margin-left: 10px;
        }
        .right {
          width: 42px;
          i {
            display: inline-block;
            width: 8px;
            height: 13px;
            background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAyNiI+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOWI5YjliIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iTTIuOTM5IDIzLjkzOUwxMy44NzkgMTMgMi45MzkgMi4wNjEiLz48L3N2Zz4=);
          }
        }
      }
    }
  }
}
</style>