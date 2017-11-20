<template>
  <div id="noticeBox">
    <ul class="noticeList">
      <li class="noticeMain" @click="details(item)" v-for="item in noticeObj.list">
        <h4 class="noticeMain-title" v-text="item.title"></h4>
        <p class="noticeMain-content" v-text="item.content"></p>
        <table class="noticeMain-InfoTable">
          <tr>
            <td v-text="dateFormat(item.publishTime)"></td>
            <td v-text="item.accessoriesUrlCount"></td>
            <td v-text="item.noticeCommentCount"></td>
          </tr>
        </table>
      </li>
    </ul>
  </div>
</template>

<script>
  import {Indicator,} from 'mint-ui';
  import moment from 'moment'
  let df = 'YYYY-MM-DD HH:mm:ss';
  export default {
    data(){
      return {
        noticeObj: {}
      }
    },
    created(){
      Indicator.open('正在加载...');
      this.$http.post('/api/v1.0/client/companyNotice', {
        pageSize: 10,
        pageNumber: 1
      }).then(response => {
        if (response.body.code === 200) {
          this.noticeObj = response.body.result;
          Indicator.close();//关闭加载中
        } else {
          Indicator.close();//关闭加载中
        }
      }, response => {
        console.log('error callback');
      });
    },
    methods: {
      details(data){
        this.setCookie('noticeUid', data.uid, 365);
        this.$router.push({path: '/notice_details'});
      },
      //格式化时间
      dateFormat(data){
        return moment(data).format(df);
      }
    }
  }
</script>
<style lang="scss">
  #noticeBox {
    .noticeList {
      padding: 0 15px;
      text-align: left;
      background-color: #ffffff;
      .noticeMain {
        padding: 15px 0;
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
        }
        .noticeMain-InfoTable {
          width: 100%;
          font-size: 12px;
          color: #99a9bf;
          td {
            width: 30px;
          }
          td:first-child {
            width: auto;
          }
        }
      }
    }
  }
</style>
