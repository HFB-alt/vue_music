<template>
  <div class="musicitem">
    <ul class="newmusiclist">
      <ListItem
        v-for="(item, index) in newMusicList"
        :key="item.id"
        :num="index + 1"
        :item="item"
      ></ListItem>
    </ul>
    <Loading v-if="newMusicList.length <= 0"></Loading>
  </div>
</template>

<script>
import Loading from './Loading'
import ListItem from './ListItem'
export default {
  name: 'MusicItem',
  props: {
    newMusicList: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  components: {
    Loading,
    ListItem
  }

}
</script>

<style lang="less" scoped>
.musicitem {
  .newmusiclist {
    padding: 0 8px;
  }
}
</style>