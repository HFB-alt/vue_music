<template>
  <li>
    <div class="left">
      <img :src="item.user.avatarUrl" />
      <i
        v-show="item.user.avatarDetail == null"
        :style="{
          backgroundImage: `url(${item.user.avatarDetail})`,
        }"
      ></i>
    </div>
    <div class="right">
      <div class="box">
        <div class="right_left">
          <div>{{ item.user.nickname }}</div>
          <div>{{ item.time | formateDate(handleDate) }}</div>
        </div>
        <div class="right_right">
          <span>{{ item.likedCount }}</span>
          <i>
            <svg
              class="u-svg u-svg-unzancmt"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 28 28"
            >
              <path
                fill="#999"
                d="m25.857 14.752c-.015.059-1.506 5.867-2.932 8.813-1.162 2.402-3 2.436-3.099 2.436h-12.826v-13c3 0 5.728-4 5.728-7.275 0-3.725 1.433-3.725 2.142-3.725 1.327 0 1.978 1.345 1.978 4 0 2.872-.832 4.525-.839 4.537-.161.31-.155.682.027.981.181.299.5.482.849.482h6.942c.922 0 1.551.215 1.866.64.467.626.286 1.705.164 2.112m-23.857 10.248v-10c0-1.795.659-1.981.855-2h2.145v13h-2.173c-.829 0-.827-.648-.827-1m25.309-13.54c-.713-.969-1.886-1.46-3.482-1.46h-5.519c.26-.932.519-2.285.519-4 0-5.221-2.507-6-4-6-1.909 0-4.185.993-4.185 5.725 0 2.206-1.923 5.275-3.815 5.275h-4-.011c-1.034.011-2.816.862-2.816 4v10.02c0 1.198.675 2.979 2.827 2.979h16.971.035c.364 0 3.224-.113 4.894-3.564 1.514-3.127 3.01-8.942 3.056-9.14.071-.23.664-2.289-.474-3.836"
              ></path>
            </svg>
          </i>
        </div>
      </div>
      <p>{{ item.content }}</p>
    </div>
  </li>
</template>

<script>
export default {
  name: 'Comments',
  props: {
    item: {
      type: Object,
      default: function () {
        return {
          user: {
            avatarUrl: '',
            avatarDetail: {
              identityIconUrl: ''
            },
            nickname: null
          },
          time: 0,
          likedCount: 0,
          content: null
        };
      }
    }
  },
  filters: {
    formateDate (val, vm) {
      // let currentDate = +Date.now();
      // let subtractTime = currentDate - val;
      let dateTime = new Date(val);
      let time = vm(dateTime);
      return time;
    }
  },
  methods: {
    handleDate (d) {
      let y = d.getFullYear();
      let m = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
      let date = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
      let h = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
      let mm = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
      let s = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
      return `${y}-${m}-${date} ${h}:${mm}:${s}`
    }
  }
}
</script>

<style lang="less" scoped>
li {
  display: flex;
  margin: 11px 0px;
  .left {
    position: relative;
    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
    i {
      position: absolute;
      right: -3px;
      top: 21px;
      width: 12px;
      height: 12px;
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center center;
    }
  }
  .right {
    flex: 1;
    // padding-top: 3px;
    .box {
      display: flex;
      .right_left {
        flex: 1;
        text-align: left;
        margin: 0px 8px;
        div {
          &:first-of-type {
            color: #8091a9;
            font-size: 14px;
          }
          &:last-of-type {
            color: #697a95;
            font-size: 12px;
          }
          // &:last-of-type {
          //   color: white;
          //   font-size: 16px;
          // }
        }
      }
      .right_right {
        span {
          color: #999999;
          font-size: 11px;
        }
        i {
          display: inline-block;
          width: 14px;
          height: 14px;
          margin-left: 6px;
          cursor: pointer;
        }
      }
    }
    p {
      color: white;
      font-size: 16px;
      text-align: left;
      font-weight: bold;
      margin-top: 8px;
    }
  }
}
</style>