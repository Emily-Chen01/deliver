<template>
  <div id="task_details_wrapper">
    <div class="detail_header">
      <div class="detail_title">
        <i class="icon_bg_taskImg bg-ico_file"></i>
        <span class="detail_titleText">项目：安保工作</span>
      </div>
      <div class="detail_name">
        <span class="detail_nameLeft">日常任务</span>
        <span class="detail_nameRight">朝外大街巡逻</span>
      </div>
      <div class="detail_complete">
        <mt-button type="primary" size="large">点击完成任务</mt-button>
      </div>
      <div class="detail_content">
        <div class="detail_contentTitle">
          <mt-cell title="李晓岚">
            <mt-button type="primary" size="small">指派他人</mt-button>
            <img slot="icon" src="../../assets/tx.png" width="40" height="40">
          </mt-cell>
        </div>
        <div class="detail_contentList">
          <mt-cell title="添加任务地点">
            <i slot="icon" class="icon_bg_taskImg bg-ico_location"></i>
          </mt-cell>
          <mt-cell title="设置到期时间">
            <i slot="icon" class="icon_bg_taskImg bg-ico_date"></i>
          </mt-cell>
          <mt-cell>
            <mt-field style="width:100%" placeholder="编辑任务名称" :disableClear="true" type="text"></mt-field>
            <i slot="icon" class="icon_bg_taskImg bg-ico_pencil1"></i>
          </mt-cell>
        </div>
      </div>
    </div>
    <div class="detail_comment">
      <div class="detail_commentList" v-for=" n in 6">
        <p>2018-3-15 08:30:00</p>
        <mt-cell>
            <span class="detail_commentListText">
              <b class="detail_commentNameColor">张明 </b>
              <span>给</span>
              <b class="detail_commentNameColor">刘佳</b>
              <span>只指派了任务</span>
            </span>
          <img slot="icon" src="../../assets/tx.png" width="25" height="25">
        </mt-cell>
      </div>
    </div>
    <mt-popup
      v-model="popupVisible"
      popup-transition="popup-fade">
      <div class="feedback_wrapper">
        <h3 class="feedback_title">反馈内容</h3>
        <mt-field placeholder="请填写反馈内容(不超过256个字)" type="textarea" :attr="{ maxlength: 256 }" v-model="feedbackContent" rows="5"></mt-field>
        <mt-button type="primary" size="large" @click="submitFeedback">提交任务反馈</mt-button>
      </div>
    </mt-popup>
    <div class="detail_addCommentBtn">
      <mt-button size="large" @click="addComment">填写任务反馈</mt-button>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        popupVisible: false,//判断弹框是否打开
        feedbackContent:''//反馈内容
      };
    },
    methods: {
      addComment(){
        this.popupVisible = true;
      },
      submitFeedback(){
        this.popupVisible = false;
      }
    }

  }
</script>
<style lang="scss">
  #task_details_wrapper {
    text-align: left;
    .detail_header {
      position: fixed;
      z-index: 10;
      width: 100%;
      box-sizing: border-box;
      background-color: #ffffff;
      .detail_title {
        padding: 15px 15px;
        .detail_titleText {
          padding-left: 5px;
          font-size: 15px;
          color: #333333;
          vertical-align: middle;
        }
      }
      .detail_name {
        padding: 0 15px;
        .detail_nameLeft {
          display: inline-block;
          padding: 3px;
          margin-right: 5px;
          border-radius: 3px;
          font-size: 13px;
          color: #ffffff;
          background-color: #ff9f4a;
        }
        .detail_nameRight {
          font-size: 15px;
          color: #333333;
        }
      }
      .detail_complete {
        padding: 30px 15px;
      }
      .detail_content {
        box-sizing: border-box;
        border-top: 10px solid #eff3f7;
        padding: 10px 15px;
        background-color: #ffffff;
        .detail_contentTitle {
          background-color: #ffffff;
          padding-bottom: 10px;
          border-bottom: 1px solid rgb(204, 204, 204);
          .mint-cell-wrapper {
            padding: 0;
            font-size: 15px;
            color: #333333;
            font-weight: 600;
          }
        }
        .detail_contentList {
          background-color: #ffffff;
          .mint-cell-wrapper {
            padding: 0;
            font-size: 14px;
            color: #333333;
          }
          .mint-cell:last-child {
            .mint-cell-title {
              flex: 0;
            }
            .mint-cell-value {
              margin-left: 3px;
              width: 100%;
              input {
                padding: 3px;
                background-color: #f2f2f2;
                border-radius: 3px;
              }
            }
          }
        }
      }
    }
    .detail_comment {
      padding: 420px 15px 60px;
      overflow: auto;
      background-color: #eff3f7;
      .detail_commentList {
        margin: 10px 0 15px;
        p {
          font-size: 12px;
          color: #666666;
          text-align: center;
        }
        .mint-cell {
          min-height: 0;
          background-color: transparent;
          .mint-cell-left, .mint-cell-right {
            height: auto;
          }
          .mint-cell-wrapper {
            height: auto;
            font-size: 14px;
            padding: 0;
            align-items: inherit;
            .mint-cell-title {
              flex: 0;
            }
            .mint-cell-value {
              margin-top: 5px;
              .detail_commentListText {
                padding-left: 5px;
                line-height: 20px;
                color: #666666;
                .detail_commentNameColor {
                  color: #333333;
                }
              }
            }
          }
        }
      }
    }
    .mint-popup {
      width: 80vw;
      .feedback_wrapper{
        padding: 15px;
        .feedback_title{
          margin-bottom: 20px;
          font-size: 15px;
          text-align: center;
        }
        .mint-field{
          margin-bottom: 20px;
          .mint-cell-wrapper{
            padding: 0;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
          }
          .mint-field-core{
            font-size: 14px;
          }
          textarea{
            resize: none;
          }
        }
        .mint-button{
          font-size: 14px;
        }
      }
    }
    .detail_addCommentBtn {
      position: fixed;
      bottom: 0;
      padding: 10px 20px;
      width: 100%;
      box-sizing: border-box;
      background-color: #f9f9f9;
    }
  }
</style>
