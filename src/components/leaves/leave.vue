<template>
  <div id="leave-wrapper">
    <mt-navbar v-model="selected" class="leave-header">
      <mt-tab-item id="1">
        <span>填写申请</span>
      </mt-tab-item>
      <mt-tab-item id="2">
        <div @click="changeShow(-1)"><span>我的申请</span></div>
      </mt-tab-item>
    </mt-navbar>
    <mt-tab-container v-model="selected" class="leave-main">
      <mt-tab-container-item id="1" class="leave-main-box">
        <div class="leave-main-box-apply">
          <div class="leave-main-box-apply-left icon-stars">申请分类</div>
          <div class="leave-main-box-apply-center">
            <select v-model="selectedDataApply" @change="shengqingclick">
              <option v-for="option in applyTypeArray" :value="option.type" v-text="option.name"></option>
            </select>
          </div>
        </div>
        <div class="leave-main-box-apply" v-if="changeApply">
          <div class="leave-main-box-apply-left icon-stars">假期分类</div>
          <div class="leave-main-box-apply-center">
            <select v-model="selectedDataHoliday" :class="{'colorA6':selectedDataHoliday==='选择假期类型'}"
                    @change="qingjiaclick(selectedDataHoliday)">
              <option>选择假期类型</option>
              <option v-for="option in holidayTypeArray" :value="option"
                      v-text="option.NAME"></option>
            </select>
          </div>
        </div>
        <div class="leave-main-box-apply" v-if="changeApply && (selectHoliday.TYPE===0||selectHoliday.TYPE===13)">
          <div class="leave-main-box-apply-left">剩余假期</div>
          <div class="leave-main-box-apply-center">
            <span align="left" class="colorA6" v-text="selectHoliday.DAYS+(selectHoliday.TYPE===0?' 天':' 小时')"></span>
          </div>
        </div>
        <div class="leave-main-box-apply">
          <div class="leave-main-box-apply-left icon-stars">开始时间</div>
          <div class="leave-main-box-apply-center" @click="openPicker(0)">
            <span align="left" v-text="startTimeValue ? startTimeValue : '请输入日期'"
                  :class="{'colorA6':!startTimeValue}"></span>
          </div>
        </div>
        <div class="leave-main-box-apply">
          <div class="leave-main-box-apply-left icon-stars">结束时间</div>
          <div class="leave-main-box-apply-center" @click="openPicker(1)">
            <span align="left" v-text="endTimeValue ? endTimeValue : '请输入日期'" :class="{'colorA6':!endTimeValue}"></span>
          </div>
        </div>
        <div class="leave-main-box-applyImg" v-if="updateImage">
          <el-upload
            action="/api/v1.0/client/upload"
            name="files"
            :show-file-list="false"
            :headers="tokenHeader"
            :on-success="passportUrlOk"
            :before-upload="beforePassportUrl">
            <div class="leave-main-box-apply-upload">
              <img :src="imgSrc.shenFenIcon ? imgSrc.shenFenIcon : imgSrc.shenFenIconShowCamera"/>
            </div>
          </el-upload>
          <p v-show="passportUrlErrFlag">
            请上传正确的护照照片(格式为 jpg 或 jpeg 或 png，照片体积小于 5 兆)</p>
        </div>
        <div class="leave-main-box-applyText">
          <div class="leave-main-box-applyText-top icon-stars">申请内容</div>
          <textarea placeholder="#请输入文字(不超过50字)" v-model="holidayModel"></textarea>
        </div>
        <div class="leave-main-box-apply" v-if="approvalTypeObj">
          <div class="leave-main-box-apply-left">审批人</div>
          <div class="leave-main-box-apply-center" v-text="approvalTypeObj.NAME"></div>
        </div>
        <div class="leave-main-box-applyBtn">
          <mt-button type="primary" class="leave-main-box-applyBtn-btn"
                     @click.native="handerDataSubmit()">
            <span>提交</span>
          </mt-button>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="2" class="leave-main-applyInfo">
        <mt-navbar v-model="selectInfo" class="leave-header">
          <mt-tab-item id="a">
            <div @click="changeShow(-1)"><span>全部</span></div>
          </mt-tab-item>
          <mt-tab-item id="b">
            <div @click="changeShow(0)"><span>审核中</span></div>
          </mt-tab-item>
          <mt-tab-item id="c">
            <div @click="changeShow(1)"><span>已通过</span></div>
          </mt-tab-item>
          <mt-tab-item id="d">
            <div @click="changeShow(2)"><span>未通过</span></div>
          </mt-tab-item>
        </mt-navbar>
        <div class="leave-main-content">
          <div class="leave-main-content-wrapper" v-for="item in searchApplyRecord" v-if="searchApplyRecord.length>0">
            <div class="leave-main-content-top">
              <h3 class="leave-main-content-title">
                <span class="leave-main-content-title-left"
                      v-text="item.name+'申请'+(item.name===item.sname ? '':('('+item.sname+')'))"></span>
                <span class="leave-main-content-title-right"
                      v-text="item.status===0 ? '审核中' : (item.status===1 ? '已通过' : '未通过')"></span>
              </h3>
            </div>
            <div class="leave-main-content-Info">
              <div>
                <h3>起止日期</h3>
                <p>
                  <span v-text="datefmt(item.startTime)"></span> 至 <span v-text="datefmt(item.endTime)"></span>
                </p>
              </div>
              <div v-if="item.overworkTime" class="marginTop10">
                <h3>加班时长</h3>
                <p>{{item.overworkTime}}小时</p>
              </div>
              <div class="marginTop10">
                <h3>事由</h3>
                <p v-text="item.remarks "></p>
              </div>
              <div v-if="item.why" class="marginTop10">
                <h3>拒绝原因</h3>
                <p v-text="item.why"></p>
              </div>
            </div>
            <div class="leave-main-content-append" v-if="item.image">
              <h3>附件内容：</h3>
              <mt-button size="small" class="leave-main-content-btn" type="primary" @click="lookImages(item.image)">
                <span>查看附件</span>
              </mt-button>
            </div>
          </div>
          <div class="myApplyNo" v-if="searchApplyRecord.length===0">
            <span>没有数据</span>
          </div>
        </div>
      </mt-tab-container-item>
    </mt-tab-container>
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
    <mt-datetime-picker
      type="datetime"
      ref="picker0"
      v-model="startTimeValue1"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      hour-format="{value} 时"
      minute-format="{value} 分"
      @confirm="handleConfirmStart"
    >
    </mt-datetime-picker>
    <mt-datetime-picker
      type="datetime"
      ref="picker1"
      v-model="endTimeValue1"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      hour-format="{value} 时"
      minute-format="{value} 分"
      @confirm="handleConfirmEnd"
    >
    </mt-datetime-picker>
  </div>
</template>
<script>
  import {DatetimePicker, Navbar, TabItem, Popup, Indicator} from 'mint-ui';
  import utils from '@/components/utils'
  import moment from 'moment'


  let df = 'YYYY-MM-DD HH:mm';
  let df2 = 'YYYY/MM/DD HH';

  export default {
    data(){
      return {
        tokenHeader: {
          charset: 'utf-8',
          openId: this.getCookie('openId')
        },
        passportUrlErrFlag: false,// 判断图片格式是否正确
        selected: '1',// 最上层的填写申请，申请分类的nav
        selectInfo: 'a', // 申请分类的nav
        popImgSrc: '', // 查看的图片
        popupVisible: false, // 查看图片弹框
        selectedDataApply: 0, //选择的申请类型
        applyTypeArray: [], //申请分类
        selectedDataHoliday: '选择假期类型', // 选择的假期类型
        holidayTypeArray: [], // 假期类型列表
        selectHoliday: {},
        imgSrc: {
          shenFenIcon: '',
          shenFenIconShowCamera: require('../../assets/camera.png'),
          ico_success: require('../../assets/ico_success.png'),
          ico_error: require('../../assets/ico_error.png'),
        },
        changeApply: true, // 是否显示假期分类
        updateImage: true, //上传图片按钮是否隐藏
        holidayModel: '', //备注div
        approvalTypeObj: {}, // 审批人
        startTimeValue: '', //开始时间value
        startTimeValue1: new Date(),  //初始化日历插件
        endTimeValue: '',  //结束时间value
        endTimeValue1: new Date(),//初始化日历插件
        textareaString: '',// 去除空格缩进后的备注信息
        qingjiauidParam: '', // 假期类型uid
        shengqingParam: '',  //申请类型uid
        searchApplyRecord: [], //搜索申请记录
        leaveSuccess: false, //成功显示的弹框
        alertMessage: '',//提交弹框文字，显示提交状态
        alertSuccessImage: false,//显示提交状态
        codeSuccess: '',//点击我知道了进行状态判断跳转
      };
    },
    created: function () {
      this.$http.get('/api/v1.0/client/findValidConfigs').then(response => { //查询申请类型列表
        if (response.body.code === 200) {
          this.applyTypeArray = response.body.result;
          this.selectedDataApply = parseInt(this.getCookie('leaveType'));
          this.shengqingclick();
        }
      }, response => {
//        console.log('error callback');
      });

      this.$http.get('/api/v1.0/client/findReporter').then(response => { //审批人列表
        this.approvalTypeObj = response.body.result;
      }, response => {
//        console.log('error callback');
      });
      this.$http.get('/api/v1.0/client/findValidLeaves').then(response => { //假期分类
        this.holidayTypeArray = response.body.result;
      }, response => {
//        console.log('假期分类 error callback');
      });
    },
    watch: {
      holidayModel: function (val, oldVal) { //备注value 用于上传参数
        this.textareaString = val.trim();
      },
    },
    methods: {
      // 开始时间格式化
      handleConfirmStart(data){
        if (data) {
          this.startTimeValue = moment(data).format(df2) + ':00';
        }
      },
      // 结束时间格式化
      handleConfirmEnd(data){
        if (data) {
          this.endTimeValue = moment(data).format(df2) + ':00';
        }
      },
      // 日历样式
      openPicker(data) {
        let pickerslot = document.getElementsByClassName('picker-slot');
        if (data === 0) {
          pickerslot[4].style.display = 'none';
          this.$refs.picker0.open();
        } else {
          pickerslot[9].style.display = 'none';
          this.$refs.picker1.open();
        }
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
      handerDataSubmit(){
        Indicator.open('正在提交申请...');
        let params = {
          approvalConfigUid: this.shengqingParam,//申请分类
          currentApprover: this.approvalTypeObj ? this.approvalTypeObj.UID : '',
          leaveUid: this.qingjiauidParam,
          startTime: new Date(this.startTimeValue).getTime(),
          endTime: new Date(this.endTimeValue).getTime(),
          image: this.imgSrc.shenFenIcon,
          remarks: this.textareaString
        };
        this.$http.post('/api/v1.0/client/apply', params).then(response => { //提交请假申请
          Indicator.close();//申请提交成功
          this.codeSuccess = response.body.code;
          this.leaveSuccess = true;
          if (response.body.code === 200) {
            this.alertSuccessImage = true;
            this.alertMessage = response.body.message;
          } else {
            this.alertSuccessImage = false;
            this.alertMessage = response.body.message
          }
        }, response => {
//          console.log('error callback');
        });
      },

      // 选择申请分类
      shengqingclick(){ //初始是选中一个select然后进行参数选中为了提交用
        this.updateImage = true; //上传图片按钮是否隐藏 true显示false隐藏
        this.changeApply = false; //假期类型隐藏
        let state = false;
        for (let i = 0; i < this.applyTypeArray.length; i++) {
          if (this.selectedDataApply === this.applyTypeArray[i].type) {
            this.shengqingParam = this.applyTypeArray[i].uid;
            state = true;
          }
        }
        if (!state) {
          this.selectedDataApply = this.applyTypeArray[0].type;
          this.shengqingParam = this.applyTypeArray[0].uid;
        }
        if (this.selectedDataApply === 0) { //请假
          this.changeApply = true; //假期类型显示
        }
        if (this.selectedDataApply === 3) {
          this.updateImage = false; //上传图片隐藏
        }
      },
      qingjiaclick(value){
        this.qingjiauidParam = value.LEAVE_INFO_UID;
        this.selectHoliday = value;
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
      // 上传图片成功
      passportUrlOk(res, file) {
        if (res.code === 200) {
          this.imgSrc.shenFenIcon = res.result;
        }
//        Indicator.close();//图片上传成功
      },
      // 上传图片前验证
      beforePassportUrl(file) {
        let isImage = utils.isImage(file);
        let isInSize = utils.isInSize(file, 5);
        if (isImage && isInSize) {
//          Indicator.open('图片上传中...');
          this.passportUrlErrFlag = false;
        } else {
          this.passportUrlErrFlag = true;
        }
        return isImage && isInSize;
      },
    },
    components: {},
  }
</script>

<style lang="scss">
  #leave-wrapper {
    background: #ffffff;
    min-height: 100vh;
    .leave-header {
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
    // 复写mint ui 组件，头部样式
    .mint-tab-container-item {
      box-sizing: border-box;
      padding: 0 10px;
    }
    .picker-items {
      display: block;
      width: 100%;
      .picker-slot {
        flex: none !important;
        display: inline-block;
        width: 25%;
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
    .leave-main {
      padding-top: 44px;
      .leave-main-box {
        padding: 0 15px 15px;
        .leave-main-box-apply-left:before {
          content: '';
          margin-right: 10px;
        }
        .icon-stars:before {
          content: '*';
          color: #ff4949;
          margin-right: 4px;
        }
        .leave-main-box-apply {
          position: relative;
          overflow: hidden;
          height: 50px;
          line-height: 50px;
          font-size: 15px;
          border-bottom: 1px solid #d2dce6;
          .leave-main-box-apply-left {
            width: 120px;
            font-weight: bold;
            color: #457aa3;
            text-align: left;
          }
          .leave-main-box-apply-center {
            position: absolute;
            top: 0;
            box-sizing: border-box;
            padding-left: 120px;
            color: #1f2d3d;
            text-align: left;
            width: 100%;
            select {
              padding-left: 4px;
              width: 100%;
              overflow: hidden;
              border: none;
              outline: none;
              font-size: 15px;
              /*background: transparent;*/

              /*很关键：将默认的select选择框样式清除*/
              appearance: none;
              /*在选择框的最右侧中间显示小箭头图片*/
              background: url("../../assets/arrow_2.png") no-repeat scroll right center transparent;
              background-size: 15px;
              /*为下拉小箭头留出一点位置，避免被文字覆盖*/
              padding-right: 20px;
              option {
                color: black;
              }
            }
            span {
              padding-left: 4px;
              font-size: 15px;
            }
            .colorA6 {
              color: #97a8be;
            }
          }
        }
        .leave-main-box-applyImg {
          padding: 10px 0 5px;
          border-bottom: 1px solid #d2dce6;
          .leave-main-box-apply-upload {
            width: 100%;
            img {
              display: block;
              width: 180px;
              height: 120px;
            }
          }
          p {
            font-size: 15px;
            color: red;
          }
        }
        .leave-main-box-applyText {
          padding-bottom: 10px;
          border-bottom: 1px solid #d2dce6;
          font-size: 15px;
          .leave-main-box-applyText-top {
            text-align: left;
            padding: 10px 0;
            color: #457aa3;
            font-weight: bold;
          }
          textarea {
            box-sizing: border-box;
            padding: 10px;
            outline: none;
            overflow: hidden;
            overflow-y: scroll;
            width: 98%;
            height: 70px;
            border-radius: 4px;
            resize: none;
          }
        }
        .leave-main-box-applyBtn {
          margin-top: 20px;
          width: 100%;
          .leave-main-box-applyBtn-btn {
            width: 80%;
            font-size: 15px;
          }
        }
      }
      .leave-main-applyInfo {
        width: 100%;
        background: #eff3f7;
        .leave-header {
          position: fixed;
          top: 44px;
          left: 0;
          width: 100%;
          height: 44px;
          z-index: 1;
          a {
            background-color: #1d8be0;
          }

        }
        .leave-main-content {
          padding: 56px 5px 10px;
          .leave-main-content-wrapper {
            margin-bottom: 12px;
            overflow: hidden;
            width: 100%;
            border: 1px solid #d3dce6;
            border-radius: 4px;
            .leave-main-content-top {
              height: 35px;
              background-color: #d3dde7;
              .leave-main-content-title {
                overflow: hidden;
                margin: 0;
                height: 35px;
                line-height: 35px;
                text-align: left;
                font-size: 14px;
                color: #1f2d3d;
                .leave-main-content-title-left {
                  margin-left: 10px;
                  margin-top: 10px;
                  padding-left: 4px;
                  height: 14px;
                  line-height: 14px;
                  float: left;
                  border-left: 2px solid #1f2d3d;
                }
                .leave-main-content-title-right {
                  float: right;
                  margin-right: 15px;
                }
              }
            }
            .leave-main-content-Info {
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
            .leave-main-content-append {
              box-sizing: border-box;
              padding-left: 15px;
              height: 35px;
              line-height: 35px;
              border-top: 1px solid #d3dce6;
              background-color: #ffffff;
              text-align: left;

              h3 {
                display: inline-block;
                font-size: 14px;
                color: #20a0ff;
              }
              .leave-main-content-btn {
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
</style>
