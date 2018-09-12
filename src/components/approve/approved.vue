<template>
  <div id="approved-wrapper">
    <mt-navbar v-model="selectInfo" class="approved-header">
      <mt-tab-item id="a">
        <!--<div @click="changeShow(-1)"><span>已审批</span></div>-->
        <div><span>已审批</span></div>
      </mt-tab-item>
    </mt-navbar>
    <div class="approved-main-content">
      <div class="approved-main-content-wrapper" v-for="item in searchApplyRecord" v-if="searchApplyRecord.length>0">
        <div class="approved-main-content-top">
          <h3 class="approved-main-content-title">
                <span class="approved-main-content-title-left"
                      v-text="item.name+'申请'+(item.name===item.sname ? '':('('+item.sname+')'))"></span>
            <span class="approved-main-content-title-right"
                  v-text="applyState(item.status)"></span>
          </h3>
        </div>
        <div class="approved-main-content-Info">
          <div v-if="item.time&&item.time.length>0" :class="{'marginTop10': overIndex>0}"
               v-for="(overTime,overIndex) in item.time" :key="overIndex">
            <h3 v-text="'第'+overtimeNum(overIndex)+'段时间起止时间'"></h3>
            <p>
              <span v-text="datefmt(overTime.startTime)"></span> 至 <span v-text="datefmt(overTime.endTime)"></span>
            </p>
          </div>
          <div v-if="!(item.time&&item.time.length>0)">
            <h3>起止日期</h3>
            <p>
              <span v-text="datefmt(item.startTime)"></span> 至 <span v-text="datefmt(item.endTime)"></span>
            </p>
          </div>
          <div v-if="item.configType===3 && item.overworkTime" class="marginTop10">
            <h3>加班时长</h3>
            <p><span>平日加班：</span><span v-text="queryOverworkTime(item.workTime,0)+'小时'"></span></p>
            <p><span>周末加班：</span><span v-text="queryOverworkTime(item.workTime,1)+'小时'"></span></p>
            <p><span>节假日加班：</span><span v-text="queryOverworkTime(item.workTime,2)+'小时'"></span></p>
          </div>
          <div v-if="!(item.configType===3)" class="marginTop10">
            <h3>申请时长</h3>
            <p><span v-text="item.days ? item.days : '--'"></span></p>
          </div>
          <div class="marginTop10">
            <h3>事由</h3>
            <p v-text="item.remarks "></p>
          </div>
          <div v-if="item.why" class="marginTop10">
            <h3>拒绝原因</h3>
            <p v-text="item.why"></p>
          </div>
          <div class="approved-main-content-append marginTop10" v-if="item.image">
            <h3>附件内容：</h3>
            <mt-button size="small" class="approved-main-content-btn" type="primary" @click="lookImages(item.image)">
              <span>查看附件</span>
            </mt-button>
          </div>
          <div class="marginTop10" v-if="item.status===0&&(item.category===1||item.category===2)">
            <h3 v-text="item.category===1 ? '当前审批人' : '当前审批邮箱'"></h3>
            <p v-text="item.category===1 ? item.approvaler : item.email"></p>
          </div>
        </div>
      </div>
      <div class="myApplyNo" v-if="searchApplyRecord.length===0">
        <span>没有数据</span>
      </div>
    </div>
    <div class="imagePopup-box">
      <mt-popup
        v-model="popupVisible"
        class="imageScale-wrapper"
        :closeOnClickModal="true">
        <div class="imageScale-box">
          <img :src="popImgSrc" @click="closeImage"/>
        </div>
      </mt-popup>
    </div>
  </div>
</template>
<script>
  import {Navbar, TabItem, Popup, Indicator} from 'mint-ui';
  import moment from 'moment'
  let df = 'YYYY/MM/DD HH:mm';
  export default {
    data(){
      return {
        selectInfo: 'a', // 申请分类的nav
        popImgSrc: '', // 查看的图片
        popupVisible: false, // 查看图片弹框
        searchApplyRecord: [], //搜索申请记录
        applyData: {
          approvalConfigUid: '',//申请分类
          leaveUid: '',// 假期类型uid
          startTime: '', //开始时间value
          endTime: '', //结束时间value
          image: '',//附件
          remarks: '',//备注
          category: '',//审批人类型
//          currentApprover:'',//审批人uid
//          email:'',//审批人邮箱
        },
      };
    },
    created: function () {
      this.changeShow(-1);
    },
    watch: {},
    methods: {
      //审批状态
      applyState(state){
        let status;
        switch (state) {
          case 0:
            status = '审批中';
            break;
          case 1:
            status = '已通过';
            break;
          case 2:
            status = '未通过';
            break;
          case 3:
            status = '已撤回';
            break;
        }
        return status;
      },
      // 加班段数格式化
      overtimeNum(num){
        let arr = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
        return arr[num];
      },
      changeShow(val){ //查看申请记录
        this.$http.post('/api/v1.0/client/findApplys', {
          status: val,
          pageSize: 100,
          pageNumber: 1
        }).then(response => { //查询请假接口
          if (response.body.code === 200) {
            this.searchApplyRecord = response.body.result;
          }
        }, response => {
//          console.log('error callback');
        });

      },
      // 打开查看附件弹框
      lookImages(imgSrc){
        if (imgSrc) this.popImgSrc = imgSrc;
        else this.popImgSrc = '';
        this.popupVisible = true;
      },
      // 关闭查看附件弹框
      closeImage(){
        this.popupVisible = false;
      },
      // 格式化申请记录中的日期
      datefmt(str) {
        if (str) return moment(str).format(df);
        else return '';
      },
      //格式化加班时长
      queryOverworkTime(arr, type){
        let time = 0;
        arr.map(item => {
          if (item.type === type) {
            time = item.time;
          }
        });
        return time;
      }
    },
    components: {},
  }
</script>

<style lang="scss">
  #approved-wrapper {
    background: #ffffff;
    min-height: 100vh;
    .approved-header {
      position: fixed;
      top: 0;
      width: 100%;
      height: 44px;
      z-index: 1;
      span {
        display: inline-block;
        font-size: 14px;
      }
    }
    .approved-main-content {
      padding: 56px 15px 10px;
      background: #eff3f7;
      .approved-main-content-wrapper {
        margin-bottom: 12px;
        overflow: hidden;
        width: 100%;
        border: 1px solid #d3dce6;
        border-radius: 4px;
        .approved-main-content-top {
          height: 35px;
          background-color: #d3dde7;
          .approved-main-content-title {
            overflow: hidden;
            margin: 0;
            height: 35px;
            line-height: 35px;
            text-align: left;
            font-size: 14px;
            color: #1f2d3d;
            .approved-main-content-title-left {
              margin-left: 10px;
              margin-top: 10px;
              padding-left: 4px;
              height: 14px;
              line-height: 14px;
              float: left;
              border-left: 2px solid #1f2d3d;
            }
            .approved-main-content-title-right {
              float: right;
              margin-right: 15px;
            }
          }
        }
        .approved-main-content-Info {
          box-sizing: border-box;
          padding: 15px;
          background-color: #ffffff;
          text-align: left;
          h3, p {
            font-size: 14px;
            line-height: 16px;

          }
          h3 {
            color: #20a0ff;
          }
          p {
            margin-top: 5px;
            color: #324057;
          }
          .marginTop10 {
            margin-top: 10px;
          }
        }
        .approved-main-content-append {
          box-sizing: border-box;
          background-color: #ffffff;
          text-align: left;
          h3 {
            display: inline-block;
            font-size: 14px;
            color: #20a0ff;
          }
          .approved-main-content-btn {
            height: 22px;
            font-size: 12px;
          }
        }
      }
      .myApplyNo {
        width: 100%;
        height: 150px;
        line-height: 150px;
        text-align: center;
        border: 1px solid #d3dce6;
        border-radius: 4px;
        color: #324057;
        background: #ffffff;
        font-size: 14px;
      }
    }
    // 复写mint ui 组件，头部样式
    .mint-navbar {
      background-color: #26a2ff;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      text-align: center;
      .mint-tab-item {
        color: rgba(255, 255, 255, 0.5);
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        padding: 0 !important;
        .mint-tab-item-label {
          font-size: 15px;
          height: 44px;
          span {
            height: 44px;
            line-height: 44px;
          }
        }
      }
      .mint-tab-item.is-selected {
        border-bottom: none !important;
        margin-bottom: 0 !important;
        color: #ffffff;
        span {
          display: inline-block;
        }
        span:after {
          display: block;
          margin-top: -3px;
          content: '';
          border-top: 3px solid #ffffff;
        }
      }
    }

    /*查看附件*/
    .imagePopup-box {
      .imageScale-wrapper {
        width: 100%;
        .imageScale-box {
          width: 100%;
          max-height: 100vh;
          overflow: auto;
          img {
            width: 96%;
          }
        }
      }
      .v-modal {
        opacity: 1;
        background-color: #ffffff;
      }
    }

  }
</style>
