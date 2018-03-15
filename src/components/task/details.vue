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
    </div>
    <div class="detail_main">
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
      <div class="detail_comment">
        <div class="detail_commentList">
          <p>2018-3-15 08:30:00</p>
          <mt-cell>
            <span class="detail_commentListText">设置到期时间设置到期时间设置到期时间设置到期时间设置到期时间</span>
            <img slot="icon" src="../../assets/tx.png" width="25" height="25">
          </mt-cell>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  export default {}
</script>
<style lang="scss">
  #task_details_wrapper {
    text-align: left;
    .detail_header {
      padding: 0 15px;
      background-color: #ffffff;
      .detail_title {
        padding: 15px 0;
        .detail_titleText {
          padding-left: 5px;
          font-size: 15px;
          color: #333333;
          vertical-align: middle;
        }
      }
      .detail_name {
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
        padding: 30px 5px;
      }
    }
    .detail_main {
      margin-top: 10px;
      .detail_content {
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
      .detail_comment {
        padding: 0 15px;
        .detail_commentList {
          margin: 10px 0;
          p {
            text-align: center;
          }
          .mint-cell {
            /*height: auto;*/
            min-height: 0;
            background-color: transparent;
            .mint-cell-left,.mint-cell-right{
              height: auto;
            }
            .mint-cell-wrapper {
              height: auto;
              font-size: 14px;
              padding: 0;
            }
          }
          .detail_commentListText{
            padding-left: 5px;
            /*padding-top: 15px;*/
            /*margin-top: 5px;*/
          }
        }
      }
    }
  }
</style>
