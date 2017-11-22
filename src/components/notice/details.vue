<template>
  <div id="detailsBox" v-if="state">
    <div class="detailsContent">
      <div class="detailsMain">
        <h4 class="detailsMain-title" v-text="noticeData.title"></h4>
        <table class="detailsMain-tableBottom">
          <tr>
            <td>
              <i class="bg-img time_1"></i>
              <span v-text="dateFormat(noticeData.publishTime)"></span>
            </td>
          </tr>
        </table>
        <p class="detailsMain-content" v-text="noticeData.content"></p>
        <ul class="detailsFile">
          <li class="detailsFile-item" v-for="itemUrl in noticeData.accessoriesUrl">
            <i class="bg-img ico_document"></i>
            <a :href="itemUrl.url" v-text="itemUrl.name" download=""></a>
          </li>
        </ul>
      </div>
    </div>
    <h4 class="detailComment" v-if="!noticeData.comment">
      <i class="bg-img ico_comment"></i>
      <span>评论</span>
    </h4>
    <ul class="detailsList" v-if="!noticeData.comment">
      <li class="detailsMain" v-for="item in commentData">
        <table class="detailsMain-tableTop">
          <tr>
            <td><h4 v-text="item.name"></h4></td>
            <td v-text="dateFormat(item.ctime)"></td>
          </tr>
        </table>
        <p class="detailsMain-content" v-text="item.content"></p>
      </li>
    </ul>
    <div class="commentBox" v-if="!noticeData.comment">
      <mt-button type="primary" class="commentBtn" @click="comment">
        <span>评论</span>
      </mt-button>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import {Indicator, Toast} from 'mint-ui';
  import moment from 'moment'
  let df = 'YYYY-MM-DD HH:mm:ss';
  export default {
    data(){
      return {
        state: false,
        noticeData: {},
        commentData: [],
      }
    },
    created(){
      this.state = false;
      Indicator.open('正在加载...');
      let noticeUid = this.getCookie('noticeUid');
      Vue.Promise.all([
        this.$http.get('/api/v1.0/client/findCompanyNotice/' + noticeUid),
        this.$http.get('/api/v1.0/client/noticeComment/' + noticeUid)
      ]).then(res => {
        if (res[0].body.code === 200) {
          this.noticeData = res[0].body.result.notice;
        }
        if (res[1].body.code === 200) {
          this.commentData = res[1].body.result.noticeComent;
        }
        this.state = true;
        Indicator.close();//关闭加载中
      })
    },
    methods: {
      comment(){
        this.$router.push({path: '/comment'});
      },
      //格式化时间
      dateFormat(data){
        return moment(data).format(df);
      }
    }
  }
</script>
<style lang="scss">
  #detailsBox {
    box-sizing: border-box;
    padding: 0 15px;
    min-height: 100%;
    background-color: #ffffff;
    text-align: left;
    .detailComment {
      padding-left: 10px;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      color: #1f2d3d;
      background-color: #e1f2ff;

    }
    .detailsList, .detailsContent {
      .detailsMain {
        padding: 15px 0;
        border-bottom: 1px solid #d2dce6;
        .detailsMain-title {
          padding-bottom: 5px;
          line-height: 17px;
          font-size: 17px;
          color: #1f2d3d;
        }
        .detailsMain-content {
          padding-bottom: 5px;
          line-height: 20px;
          font-size: 14px;
          color: #1f2d3d;
        }
        .detailsFile {
          padding-bottom: 10px;
          width: 100%;
          font-size: 0;
          .detailsFile-item {
            box-sizing: border-box;
            display: inline-block;
            width: 25%;
            padding: 0 5px;
            font-size: 14px;
            text-align: center;
            a {
              margin-top: 5px;
              display: block;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
        .detailsMain-tableTop {
          width: 100%;
          padding-bottom: 5px;
          td {
            font-size: 14px;
            color: #1f2d3d;
          }
          td:last-child {
            font-size: 12px;
            color: #99a9bf;
            text-align: right;
          }
        }
        .detailsMain-tableBottom {
          width: 100%;
          font-size: 12px;
          color: #99a9bf;
          td {
            span {
              vertical-align: middle;
            }
          }
        }
      }
    }
    .detailsList{
      margin-bottom: 70px;
    }
    .detailsContent {
      .detailsMain {
        border-bottom: none;
      }
    }
    .commentBox {
      box-sizing: border-box;
      padding: 10px 0;
      width: 100%;
      position: fixed;
      bottom: 0;
      left: 0;
      background-color: #ffffff;
      box-shadow: 0 -2px 6px 0 rgba(215, 216, 219, 1);
      .commentBtn {
        margin-left: 5%;
        width: 90%;
        font-size: 14px;
      }
    }
  }
</style>

