<template>
  <li class="recordLi">
    <i></i>
    <div>
      <span>{{ item }}</span>
      <i @click="deleteItem"></i>
    </div>
  </li>
</template>

<script>
export default {
  name: 'Record',
  props: ['item', 'index'],
  data () {
    return {
      history: null,
      records: []
    }
  },
  methods: {
    deleteItem () {
      console.log(111);
      // console.log(this.index);
      let records = JSON.parse(localStorage.getItem('record'));
      records.splice(this.index, 1);
      localStorage.setItem('record', JSON.stringify(records));

      this.history = localStorage.getItem('record');
      if (this.history != null) {
        this.records = JSON.parse(this.history);
      }
      this.$emit('localStorageDataChange', this.records);
    }
  }
}
</script>

<style lang="less" scoped>
.recordLi {
  padding: 8px 0px;
  line-height: 30px;
  display: flex;
  align-items: center;
  i {
    display: inline-block;
    width: 15px;
    height: 15px;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMCAzMCI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjYzljYWNhIiBkPSJNMTUgMzBDNi43MTYgMzAgMCAyMy4yODQgMCAxNVM2LjcxNiAwIDE1IDBzMTUgNi43MTYgMTUgMTUtNi43MTYgMTUtMTUgMTVtMC0yOEM3LjgyIDIgMiA3LjgyIDIgMTVzNS44MiAxMyAxMyAxMyAxMy01LjgyIDEzLTEzUzIyLjE4IDIgMTUgMm03IDE2aC04YTEgMSAwIDAgMS0xLTFWN2ExIDEgMCAxIDEgMiAwdjloN2ExIDEgMCAxIDEgMCAyIi8+PC9zdmc+);
  }
  div {
    flex: 1;
    border-bottom: 1px solid #f3f3f4;
    margin: 0px 5px;
    display: flex;
    text-align: left;

    span {
      flex: 1;
      color: #333333;
      font-size: 16px;
    }
    i {
      display: inline-block;
      width: 12px;
      height: 12px;
      background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjOTk5ODk5IiBkPSJNMTMuMzc5IDEybDEwLjMzOCAxMC4zMzdhLjk3NS45NzUgMCAxIDEtMS4zNzggMS4zNzlMMTIuMDAxIDEzLjM3OCAxLjY2MyAyMy43MTZhLjk3NC45NzQgMCAxIDEtMS4zNzgtMS4zNzlMMTAuNjIzIDEyIC4yODUgMS42NjJBLjk3NC45NzQgMCAxIDEgMS42NjMuMjg0bDEwLjMzOCAxMC4zMzhMMjIuMzM5LjI4NGEuOTc0Ljk3NCAwIDEgMSAxLjM3OCAxLjM3OEwxMy4zNzkgMTIiLz48L3N2Zz4=);
    }
  }
}
</style>