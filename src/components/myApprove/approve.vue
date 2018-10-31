<template>
  <div id="approve-wrapper">
    <mt-navbar v-model="selectInfo" class="approve-header">
      <!--<mt-tab-item id="a">-->
      <!--<div @click="changeShow()"><span>待处理审批</span></div>-->
      <!--</mt-tab-item>-->
      <mt-tab-item id="b">
        <div @click="changeShow()"><span>已处理审批</span></div>
      </mt-tab-item>
    </mt-navbar>
    <div class="approve-main-content">
      <div class="approve-main-content-wrapper" v-for="item in searchApplyRecord" v-if="searchApplyRecord.length>0">
        <div class="approve-main-content-top">
          <h3 class="approve-main-content-title">
                <span class="approve-main-content-title-left"
                      v-text="item.name+'申请'+(item.leaveName ? item.leaveName:'')"></span>
            <span class="approve-main-content-title-right"
                  v-text="applyState(item.status)"></span>
          </h3>
        </div>
        <div class="approve-main-content-Info">
          <div>
            <h3>申请人</h3>
            <p v-text="item.applyer"></p>
          </div>
          <div class="marginTop10">
            <h3>当前审批人</h3>
            <p v-text="item.approvaler"></p>
          </div>
          <div v-if="item.time&&item.time.length>0" class="marginTop10"
               v-for="(overTime,overIndex) in item.time" :key="overIndex">
            <h3 v-text="'第'+overtimeNum(overIndex)+'段时间起止时间'"></h3>
            <p>
              <span v-text="datefmt(overTime.startTime)"></span> 至 <span v-text="datefmt(overTime.endTime)"></span>
            </p>
          </div>
          <div v-if="!(item.time&&item.time.length>0)" class="marginTop10">
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
          <div class="approve-main-content-append marginTop10" v-if="item.image">
            <h3>附件内容：</h3>
            <div class="approve-main-content-btnBox">
              <mt-button size="small" class="approve-main-content-btn" type="primary" @click="lookImages(item.image)">
                <span>查看附件</span>
              </mt-button>
            </div>
          </div>
        </div>
        <div class="approve-main-content-append approve-main-content-append1 " v-if="item.status===0">
          <div class="approve-main-content-btnBox">
            <mt-button size="small" class="approve-main-content-btn" type="primary" @click="isPass(item.uid,1)">
              <span>通过</span>
            </mt-button>
          </div>
          <div class="approve-main-content-btnBox">
            <mt-button size="small" class="approve-main-content-btn" type="primary" @click="isPass(item.uid,2)">
              <span>拒绝</span>
            </mt-button>
          </div>
        </div>
        <div class="approve-main-content-append approve-main-content-append1 plr15 fs13" v-if="item.status===3">
          <p>
            <span v-text="datefmt(new Date())"></span><span> 审批人:刘佳安(CI11511)        已通过</span>
          </p>
          <p>
            <span v-text="datefmt(new Date())"></span><span> 审批人:刘佳安(CI11511)        已通过</span>
          </p>
        </div>
      </div>
      <div class="myApplyNo" v-if="searchApplyRecord.length===0">
        <span>没有数据</span>
      </div>

      <!--新增加考勤异常申请-->
      <div class="approve-main-content-wrapper attendance">
        <div class="approve-main-content-top">
          <h3 class="approve-main-content-title">
                <span class="approve-main-content-title-left">审批申请（8月份异常考勤申请）</span>
            <span class="approve-main-content-title-right">审批中</span>
          </h3>
        </div>
        <div class="approve-main-content-Info attendcont">
          <div class="attendtop">申请人：张三(CI11570)</div>
          <div class="attendttit">原始数据</div>
          <div class="attendDetail">
            <p>本月异常考勤累计时间</p>
            <p>
              <span>迟到累计：2次（共3工时）</span>
              <span>事假累计: 10天(共80工时)</span>
            </p>
            <p>
              <span>早退累计：2次（共3工时）</span>
              <span>病假累计: 10天(共80工时)</span>
            </p>
            <p>
              <span class="spanlft">旷工累计: 10天(共80工时)</span>
              <span class="spanlft">产假累计: 10天(共80工时)</span>
            </p>
            <p style="padding: 20px;text-align: center;">根据假期配置产生累计</p>
            <p>工作日加班累计时长：0.5天(共4小时)</p>
            <p>周末加班累计时长：0.5天(共4小时)</p>
            <p>法定假日加班累计时长：0.5天(共4小时)</p>
          </div>
          <div class="attendttit">修订后数据</div>
          <div class="attendDetail">
            <p>本月异常考勤累计时间</p>
            <p>
              <span>迟到累计：2次（共3工时）</span>
              <span>事假累计: 10天(共80工时)</span>
            </p>
            <p>
              <span>早退累计：2次（共3工时）</span>
              <span>病假累计: 10天(共80工时)</span>
            </p>
            <p>
              <span class="spanlft">旷工累计: 10天(共80工时)</span>
              <span class="spanlft">产假累计: 10天(共80工时)</span>
            </p>
            <p style="padding: 20px;text-align: center;">根据假期配置产生累计</p>
            <p>工作日加班累计时长：0.5天(共4小时)</p>
            <p>周末加班累计时长：0.5天(共4小时)</p>
            <p>法定假日加班累计时长：0.5天(共4小时)</p>
          </div>
          <div class="btnlookdet">
            <mt-button size="normal" class="btnlookattend" type="primary" @click="gotodetail()">
              <span>查看详情</span>
            </mt-button>
          </div>

        </div>
        <div class="approve-main-content-append approve-main-content-append1 ">
          <div class="approve-main-content-btnBox">
            <mt-button size="small" class="approve-main-content-btn" type="primary" @click="isPass('uid',1)">
              <span>通过</span>
            </mt-button>
          </div>
          <div class="approve-main-content-btnBox">
            <mt-button size="small" class="approve-main-content-btn" type="primary" @click="isPass('uid',2)">
              <span>拒绝并修改</span>
            </mt-button>
          </div>
        </div>
        <div class="approve-main-content-append approve-main-content-append1 plr15 fs13">
          <p>
            <span>2018-05-12 16:22:11</span><span> 审批人:刘佳安(CI11511)        已通过</span>
          </p>
          <p>
            <span>2018-05-12 16:22:11</span><span> 审批人:刘佳安(CI11511)        已通过</span>
          </p>
        </div>
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
    <mt-popup
      v-model="leaveSuccess"
      class="image-Success"
      :closeOnClickModal="false">
      <div class="image-box">
        <img :src="alertSuccessImage ? imgSrc.ico_success : imgSrc.ico_error"/>
      </div>
      <p v-text="alertMessage"></p>
      <div @click="closeAlert" class="image-btn">
        <span>我知道啦</span>
      </div>
    </mt-popup>
  </div>
</template>
<script>
  import {DatetimePicker, Navbar, TabItem, Popup, Indicator, MessageBox} from 'mint-ui';
  import utils from '@/components/utils'
  import moment from 'moment'


  let df = 'YYYY-MM-DD HH:mm';

  export default {
    data(){
      return {
//        tokenHeader: {
//          charset: 'utf-8',
//          openId: this.getCookie('openId')
//        },
        selectInfo: 'b', // 申请分类的nav
        popImgSrc: '', // 查看的图片
        popupVisible: false, // 查看图片弹框
        imgSrc: {
          ico_success: require('../../assets/ico_success.png'),
          ico_error: require('../../assets/ico_error.png'),
        },
        searchApplyRecord: [], //搜索申请记录
        leaveSuccess: false, //成功显示的弹框
        alertMessage: '',//提交弹框文字，显示提交状态
        alertSuccessImage: false,//显示提交状态
        codeSuccess: '',//点击我知道了进行状态判断跳转
      };
    },
    created: function () {
      this.changeShow()
    },
    watch: {},
    methods: {
      //查看详情
      gotodetail(){
        this.$router.push({path: '/approveDetail'});
      },
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
      changeShow(val){ //查看审批信息
        this.$http.get('/api/v1.0/client/approval/findComplete').then(response => { //查询请假接口
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
      //提交成功的弹框
      closeAlert(){
        this.leaveSuccess = false;
        if (this.codeSuccess === 200) {
          this.$router.push({path: '/signCard'});
        }
      },
      //通过或拒绝
      isPass(uid, type){
        let url, text;
        if (type === 1) {//通过
          url = '/api/v1.0/client/revokeApply/' + uid
          text = '是否同意当前审批？';
        } else if (type = 2) {//拒绝
          url = '/api/v1.0/client/revokeApply/' + uid
          text = '是否拒绝当前审批？';
        }
        MessageBox.confirm(text, '提示').then(action => {
          Indicator.open('正在处理中...');
          this.$http.get(url).then(response => { //提交请假申请
            Indicator.close();
            if (response.body.code === 200) {
              this.changeShow(-1);
              MessageBox('提示', '操作成功');
            } else {
              MessageBox('提示', '操作失败');
            }
          }, response => {
//          console.log('error callback');
          });
        });
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
  #approve-wrapper {
    /*background: #ffffff;*/
    background: #eff3f7;
    min-height: 100vh;
    .mt10 {
      margin-top: 10px;
    }
    .pl30 {
      padding-left: 30px;
    }
    .plr15 {
      padding: 0 15px;
    }
    .fs13 {
      font-size: 13px;
    }
    .fc1 {
      color: #457aa3;
    }
    .pr {
      position: relative;
    }
    .approve-header {
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
    .approve-main-content {
      padding: 56px 15px 10px;
      background: #eff3f7;
      .approve-main-content-wrapper {
        margin-bottom: 12px;
        overflow: hidden;
        width: 100%;
        border: 1px solid #d3dce6;
        border-radius: 4px;
        .approve-main-content-top {
          height: 35px;
          background-color: #d3dde7;
          .approve-main-content-title {
            overflow: hidden;
            margin: 0;
            height: 35px;
            line-height: 35px;
            text-align: left;
            font-size: 14px;
            color: #1f2d3d;
            .approve-main-content-title-left {
              margin-left: 10px;
              margin-top: 10px;
              padding-left: 4px;
              height: 14px;
              line-height: 14px;
              float: left;
              border-left: 2px solid #1f2d3d;
            }
            .approve-main-content-title-right {
              float: right;
              margin-right: 15px;
            }
          }
        }
        .approve-main-content-Info {
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
        .approve-main-content-append {
          box-sizing: border-box;
          background-color: #ffffff;
          text-align: left;
          h3 {
            display: inline-block;
            font-size: 14px;
            color: #20a0ff;
          }
          .approve-main-content-btnBox {
            display: inline-block;
            width: 40%;
            .approve-main-content-btn {
              height: 22px;
              font-size: 12px;
            }
          }
        }
        .approve-main-content-append1 {
          border-top: 1px solid #d3dce6;
          padding: 10px 0;
          text-align: center;
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
    .image-Success {
      box-sizing: border-box;
      width: 250px;
      padding: 15px;
      border-radius: 4px;
      .image-box {
        margin: 0 auto;
        width: 34px;
        height: 34px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      p {
        margin-top: 10px;
        font-size: 15px;
        line-height: 20px;
        color: #1f2d3d;
      }
      .image-btn {
        display: inline-block;
        margin-top: 20px;
        padding: 0 10px;
        height: 36px;
        line-height: 36px;
        background-color: #20a2ff;
        color: #ffffff;
        font-size: 14px;
        border-radius: 4px;
      }
    }
  }

  .approve-main-content-Info{
    &.attendcont{
      .attendtop{
        text-align: center;
        font-size: 14px;
      }
      .attendttit{
        font-size: 12px;
      }
      .attendDetail{
        background: #F2F2F2;
        margin: 15px 0;
        font-size: 12px;
        padding: 5px 8px;
        p{
          text-align: left;
          line-height: 25px;
          font-size: 12px;
          span{
            display: inline-block;
            width: 50%;
            font-size: 12px;
            &:nth-child(1){
              float:left;
            }
            &:nth-child(1){
              float:left;
            }
          }
        }
      }
      .btnlookdet{
        text-align: center;
        .btnlookattend{
          font-size: 14px;
          width: 100px;
          height: 30px;
        }
      }
    }
  }



</style>
