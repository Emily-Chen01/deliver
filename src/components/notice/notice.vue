<template>
  <div id="noticeBox">
    <ul class="noticeList" v-infinite-scroll="loadMore" :infinite-scroll-disabled="loadState">
      <li class="noticeMain" :class="{'noticeIsRead':!item.noticeStaffreadRefs}" @click="details(item)"
          v-for="item in noticeObj.list">
        <h4 class="noticeMain-title" v-text="item.title"></h4>
        <table class="noticeMain-InfoTable">
          <tr>
            <td>
              <i class="bg-img time_1"></i>
              <span v-text="dateFormat(item.publishTime)"></span>
            </td>
            <td>
              <i class="bg-img ico_link"></i>
              <span v-text="item.accessoriesUrlCount"></span>
            </td>
            <td>
              <i class="bg-img ico_comment"></i>
              <span v-text="item.noticeCommentCount"></span>
            </td>
          </tr>
        </table>
      </li>
    </ul>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {Indicator, InfiniteScroll} from 'mint-ui';
  Vue.use(InfiniteScroll);
  import moment from 'moment'
  let df = 'YYYY-MM-DD HH:mm:ss';
  export default {
    data(){
      return {
        loadAll: false,
        loadState: false,
        noticeObj: {total: null, currentPage: 10, list: []},
        id: 1,
      }
    },
    created(){
    },
    methods: {
      details(data){
        this.setCookie('noticeUid', data.uid, 365);
        this.$router.push({path: '/notice_details'});
      },
      //格式化时间
      dateFormat(data){
        return moment(data).format(df);
      },
      // 上拉刷新
      loadMore(){
        if (this.lateState) {
          return
        } else {
          this.lateState = !this.lateState;
        }
        if (this.noticeObj.total === null || this.id <= Math.ceil(this.noticeObj.total / this.noticeObj.currentPage)) {
          this.$http.post('/api/v1.0/client/companyNotice', {
            pageSize: 10,
            pageNumber: this.id
          }).then(response => {
            if (response.body.code === 200) {
              this.noticeObj.list = this.noticeObj.list.concat(response.body.result.list);
              this.noticeObj.currentPage = response.body.result.currentPage;
              this.noticeObj.total = response.body.result.total;
              this.lateState = !this.lateState;
              this.id++;
            }
          }, response => {
            console.log('error callback');
          });

        }
      }
    }
  }
</script>
<style lang="scss">
  #noticeBox {
    .noticeList {
      text-align: left;
      background-color: #ffffff;
      list-style-type: none;
      .noticeMain {
        padding: 15px 15px;
        border-bottom: 1px solid #d2dce6;
        &:last-child {
          border: none;
        }
        .noticeMain-title {
          padding-bottom: 5px;
          line-height: 15px;
          font-size: 15px;
          color: #1f2d3d;
        }
        .noticeMain-content {
          padding-bottom: 5px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          line-height: 20px;
          font-size: 14px;
          color: #1f2d3d;
          img {
            width: 30px;
          }
        }
        .noticeMain-InfoTable {
          width: 100%;
          font-size: 12px;
          color: #99a9bf;
          td {
            width: 30px;
            span {
              vertical-align: middle;
            }
          }
          td:first-child {
            width: auto;
          }
        }
      }
      .noticeIsRead {
        background-color: #fffbec;
        .noticeMain-title:before {
          display: inline-block;
          margin-right: 4px;
          width: 6px;
          height: 6px;
          border-radius: 3px;
          content: '';
          vertical-align: middle;
          background-color: red;
        }
      }
    }
  }
</style>
