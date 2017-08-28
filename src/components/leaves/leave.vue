<template>
  <div id="leave-wrapper">
    <mt-navbar v-model="selected" class="leave-header">
      <mt-tab-item id="1">
        <span>填写申请</span>
      </mt-tab-item>
      <mt-tab-item id="2">
        <div @click="changeShow(1)"><span>我的申请</span></div>
      </mt-tab-item>
    </mt-navbar>
    <mt-tab-container v-model="selected" class="leave-main">
      <mt-tab-container-item id="1" class="leave-main-box">
        <div class="leave-main-box-apply">
          <div class="leave-main-box-apply-left">申请分类</div>
          <div class="leave-main-box-apply-center">
            <select v-model="selectedDataApply" @change="shengqingclick(selectedDataApply)">
              <option v-for="option in optionsApply" :value="option.value" v-text="option.text"></option>
            </select>
          </div>
          <div class="leave-main-box-apply-right">
            <img :src="imgSrc.selectShow"/>
          </div>
        </div>
        <div class="leave-main-box-apply" v-if="changeApply">
          <div class="leave-main-box-apply-left">假期分类</div>
          <div class="leave-main-box-apply-center">
            <select v-model="selectedDataHoliday" @change="qingjiaclick(selectedDataHoliday)">
              <option>选择假期类型</option>
              <option v-for="option in optionsHoliday" :value="option" v-text="option.text"></option>
            </select>
          </div>
          <div class="leave-main-box-apply-right">
            <img :src="imgSrc.selectShow"/>
          </div>
        </div>
        <div class="leave-main-box-apply">
          <div class="leave-main-box-apply-left">开始时间</div>
          <div class="leave-main-box-apply-center" @click="openPicker(0)">
            <span align="left" v-text="startTimeValue ? startTimeValue : '请输入日期'"></span>
          </div>
        </div>
        <div class="leave-main-box-apply">
          <div class="leave-main-box-apply-left">结束时间</div>
          <div class="leave-main-box-apply-center" @click="openPicker(1)">
            <span align="left" v-text="endTimeValue ? endTimeValue : '请输入日期'"></span>
          </div>
        </div>
        <div class="leave-main-box-applyImg">
          <el-upload
            v-if="updateImage"
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
          <div class="leave-main-box-applyText-top">备注</div>
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
            <div @click="changeShow(1)"><span>全部</span></div>
          </mt-tab-item>
          <mt-tab-item id="b">
            <div @click="changeShow(2)"><span>审核中</span></div>
          </mt-tab-item>
          <mt-tab-item id="c">
            <div @click="changeShow(3)"><span>已通过</span></div>
          </mt-tab-item>
          <mt-tab-item id="d">
            <div @click="changeShow(4)"><span>未通过</span></div>
          </mt-tab-item>
        </mt-navbar>
        <div class="leave-main-content">
          <div class="leave-main-content-wrapper" v-for="item in searchApplyRecord" v-if="searchApplyRecord.length>0">
            <div class="leave-main-content-top">
              <h3 class="leave-main-content-title">
                <span class="leave-main-content-title-left">{{item.name}}申请</span>
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
        class="imageClass"
        closeOnClickModal="true">
        <div class="colseClass">
          <img :src="popImgSrc" class="alertImages" @click="closeImage"/>
        </div>
      </mt-popup>
    </div>
    <mt-popup
      v-model="leaveSuccess"
      class="imageClassSuccess"
      closeOnClickModal="true">
      <div style="width: 3rem;height: 3rem;text-align: center;margin:2rem auto 0.3rem auto;">
        <img width="150" :src="alertSuccessImage ? imgSrc.ico_success : imgSrc.ico_error" class="alertImages" v-if="alertSuccessImage"/>
      </div>
      <div style="clear:both;"></div>
      <div style="width: 16rem;height: 1.8rem;line-height:1.8rem;text-align: center; margin:0 auto;font-size: 1.1rem;">
        <span>{{alertMessage}}</span>
      </div>
      <div @click="closeAlert" class="colseClassAlert">
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
  import {DatetimePicker, Radio} from 'mint-ui';
  import {Navbar, TabItem, Toast, MessageBox, Popup} from 'mint-ui';
  import utils from '@/components/utils'
  import VueCoreImageUpload from 'vue-core-image-upload'
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


        popImgSrc: '',
        popupVisible: false,
        closeOnClickModal: true,
        isActive: false, //显示下滑线
        isActive2: false, //显示下滑线
        isActive3: false, //显示下滑线
        isActive4: false, //显示下滑线

        selectedData: '',
        selectedDataApply: 0,
        selectedDataApproval: 0,
        pickerValue: '',
        optionsApproval: {},
        optionsApply: [
//                { text: '请假申请', value: 0 ,uid:12,type:'q'},

        ],
        selectedDataHoliday: '选择假期类型',
        optionsHoliday: [
//                { text: '端午节' },
        ],
        imgSrc: {
          shenFenIcon: '',
          shenFenIconShow: require('../../assets/shenfenzheng.png'),
          shenFenIconShowCamera: require('../../assets/camera.png'),

          selectShow: require('../../assets/arrow_2.png'),
          ico_success: require('../../assets/ico_success.png'),
          ico_error: require('../../assets/ico_error.png'),


        },
        changeApply: true,
        changeApplyTime: true,
//              changeApplyOutside:false,
        changeApplyOvertime: false, //加班时间div
        updateImage: true, //上传图片 div
        Remark: true, //备注div
        data: {},
        applyTypeArray: [], //申请
        applyTypeName: [], //申请
        approvalTypeObj: {}, // 审批人
        holidayTypeArray: [], // 假期分类
        holidayTypeName: [], // 假期分类
        startTimeValue: '', //开始时间value
        startTimeValue1: new Date(),
        endTimeValue: '',  //结束时间value
        endTimeValue1: new Date(),
        holidayModel: '',
        textareaString: '',
        qingjiauidParam: '',
        shengqingParam: '',
        shengqingParamType: '', //判断加班申请param的类型
        imagestring: '',
        searchApplyRecord: [], //搜索申请记录
        initUpImage: true, //初始化加载的上传图片
        leaveSuccess: false, //成功显示的弹框
        alertMessage: ' 申请已提交成功',//提交弹框文字
        alertSuccessImage: '',//成功文字
        codeSuccess: '',//点击我知道了进行状态判断跳转
        isHideHeight: '',

      };
    },
    created: function () {
      this.$http.get('/api/v1.0/client/findValidConfigs').then(response => { //查询申请类型列表
        this.applyTypeArray = response.body.result;
        for (let i = 0; i < this.applyTypeArray.length; i++) {
          this.applyTypeName.push(
            {
              text: this.applyTypeArray[i].name,
              value: this.applyTypeArray[i].type,
              uid: this.applyTypeArray[i].uid
            }
          )
        }
        this.optionsApply = this.applyTypeName;

        //====此处代码为了在打开提交时在提交申请时显示申请类型====
        this.selectedDataApply = this.getCookie('leaveType');

        for (let i = 0; i < this.optionsApply.length; i++) {  //循环初始化的时候选中一个select属性值和参数
          if (this.selectedDataApply !== '') {
            this.shengqingParam = this.optionsApply[this.selectedDataApply].uid;
            this.shengqingParamType = this.optionsApply[this.selectedDataApply].value;
          }
        }
        if (this.selectedDataApply == '0') { //请假
          this.changeApply = true; //假期隐藏
          this.changeApplyTime = true; //时间隐藏
          this.updateImage = true; //上传图片隐藏
          this.changeApplyOvertime = false; //加班时间显示
          this.shengqingParamType = '0';
          this.isHideHeight = false;

        }
        if (this.selectedDataApply == '1') {
          this.changeApply = false; //假期隐藏
          this.changeApplyTime = true; //时间隐藏
          this.updateImage = true; //上传图片隐藏
          this.changeApplyOvertime = false; //加班时间显示
          this.shengqingParamType = '1';
          this.isHideHeight = false;

        }
        if (this.selectedDataApply == '2') {
          this.changeApply = false; //假期隐藏
          this.changeApplyTime = true; //时间隐藏
          this.updateImage = true; //上传图片隐藏
          this.changeApplyOvertime = false; //加班时间显示
          this.shengqingParamType = '2';
          this.isHideHeight = false;

        }
        if (this.selectedDataApply == '3') {
          this.changeApply = false; //假期隐藏
          this.changeApplyTime = true; //时间隐藏
          this.updateImage = false; //上传图片隐藏
          this.changeApplyOvertime = false; //加班时间显示
          this.shengqingParamType = '3';
          this.isHideHeight = true;


        }
        //=====此处代码为了在打开提交时在提交申请时显示 类型====


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
//        console.log(this.holidayTypeArray, '假期分类');
        for (let i = 0; i < this.holidayTypeArray.length; i++) {
          this.holidayTypeName.push(
            {
              text: this.holidayTypeArray[i].NAME,
              value: this.holidayTypeArray[i].TYPE,
              uid: this.holidayTypeArray[i].LEAVE_INFO_UID
            })
        }
        this.$nextTick(() => {
          this.optionsHoliday = this.holidayTypeName;
          console.log(this.optionsHoliday)

        });


//        console.log(this.optionsHoliday);

      }, response => {
//        console.log('假期分类 error callback');
      });

      let params = {
        "status": "-1",
        "pageSize": 100,
        "pageNumber": 1
      };
      this.$http.post('/api/v1.0/client/findApplys', params).then(response => { //查询请假记录
        this.searchApplyRecord = response.body.result;
      }, response => {
//        console.log('查询请假记录 error callback');
      });


    },
    watch: {
      holidayModel: function (val, oldVal) { //备注value 用于上传参数
        this.textareaString = val.trim();
      },
    },
    methods: {
      handleConfirmStart(data){
        if (data) {
          this.startTimeValue = moment(data).format(df2) + ':00';
        }
      },
      handleConfirmEnd(data){
        if (data) {
          this.endTimeValue = moment(data).format(df2) + ':00';
        }
      },
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
      changeShow(val){ //动态设置tab下划线显示
        let params = '';
        if (val == 1) {
          this.isActive = true;
          this.isActive2 = false;
          this.isActive3 = false;
          this.isActive4 = false;
          params = {
            "status": "-1",
            "pageSize": 100,
            "pageNumber": 1
          }
        }
        if (val == 2) {
          this.isActive2 = true;
          this.isActive = false;
          this.isActive3 = false;
          this.isActive4 = false;
          params = {
            "status": "0",
            "pageSize": 100,
            "pageNumber": 1
          }
        }
        if (val == 3) {
          this.isActive3 = true;
          this.isActive2 = false;
          this.isActive = false;
          this.isActive4 = false;
          params = {
            "status": "1",
            "pageSize": 100,
            "pageNumber": 1
          }
        }
        if (val == 4) {
          this.isActive4 = true;
          this.isActive3 = false;
          this.isActive2 = false;
          this.isActive = false;
          params = {
            "status": "2",
            "pageSize": 100,
            "pageNumber": 1
          }
        }
        this.$http.post('/api/v1.0/client/findApplys', params).then(response => { //查询请假接口
          if (response.body.code === 200) {
            this.searchApplyRecord = response.body.result;
          }
        }, response => {
//          console.log('error callback');
        });

      },
      handerDataSubmit(){
        let params;
        if (this.selectedDataApply == '0') { //请假申请所需参数
          params = {
            approvalConfigUid: this.shengqingParam,//申请分类
            currentApprover: this.approvalTypeObj ? this.approvalTypeObj.UID : '',
            leaveUid: this.qingjiauidParam,
            startTime: new Date(this.startTimeValue).getTime(),
            endTime: new Date(this.endTimeValue).getTime(),
            image: this.imgSrc.shenFenIcon,
            remarks: this.textareaString
          };
        }
        ;
        if (this.selectedDataApply == '2' || this.selectedDataApply == '1') { //忘打卡或外出申请所需参数
          params = {
            approvalConfigUid: this.shengqingParam,//申请分类
            currentApprover: this.approvalTypeObj ? this.approvalTypeObj.UID : '',
            startTime: new Date(this.startTimeValue).getTime(),
            endTime: new Date(this.endTimeValue).getTime(),
            image: this.imgSrc.shenFenIcon,
            remarks: this.textareaString
          };
        }
        ;
        if (this.selectedDataApply == '3') { //加班所需参数
          params = {
            approvalConfigUid: this.shengqingParam,  //申请分类
            currentApprover: this.approvalTypeObj ? this.approvalTypeObj.UID : '',
            remarks: this.textareaString,
            startTime: new Date(this.startTimeValue).getTime(),
            endTime: new Date(this.endTimeValue).getTime(),

          }
        }
        this.$http.post('/api/v1.0/client/apply', params).then(response => { //提交请假申请
//          console.log(response);
          this.codeSuccess = response.body.code;

          if (response.body.code == 200) {
            this.leaveSuccess = true;
            this.alertSuccessImage = true;
            this.alertMessage = response.body.message;
          } else if (response.body.code == 500) {

            this.leaveSuccess = true;
            this.alertSuccessImage = false;
            this.alertMessage = response.body.message
          }
        }, response => {
//          console.log('error callback');
        });
      },
      imageuploaded(res) { //用于图片参数上传
//        console.log(res);
//        this.imgSrc.shenFenIconShowCamera= res.result;
        this.imgSrc.shenFenIcon = res.result;
        this.initUpImage = false;  //把初始化的image隐藏
      },
      errorhandle(res){
        this.leaveSuccess = true;
        this.alertSuccessImage = false;
        if (res === 'TYPE ERROR') {
          this.alertMessage = '上传图片格式为png,jpeg,jpg';
        } else {
          this.alertMessage = '上传图片大小不能超过5M';
        }

//        console.log(res);
      },
      handerStartValue(){
//        console.log('我是开始时间' + this.startTimeValue);
      },
      shengqingclick(value){ //初始是选中一个select然后进行参数选中为了提交用
//          alert(this.selectedDataApply);
//        console.log(value, typeof value);
//            return;
//        console.log(this.optionsApply, 'this.optionsApply')

        function dd(y, array) {
          for (let i = 0; i < array.length; i++) {  //循环初始化的时候选中一个select属性值和参数
            if (y == array[i].value) {
              return array[i];
            }
          }
        }


        let result = dd(this.selectedDataApply, this.optionsApply);
        if (result) {
          this.shengqingParam = result.uid;
          this.shengqingParamType = result.value;
        }

        if (this.selectedDataApply == '0') { //请假
//          console.log('选择请假路线');
          this.changeApply = true; //假期隐藏
          this.changeApplyTime = true; //时间隐藏
          this.updateImage = true; //上传图片隐藏
          this.changeApplyOvertime = false; //加班时间显示
          this.shengqingParamType = '0';
          this.isHideHeight = false;

        }
        if (this.selectedDataApply == '1') {
//          console.log('忘记打卡路线')
          this.changeApply = false; //假期隐藏
          this.changeApplyTime = true; //时间隐藏
          this.updateImage = true; //上传图片隐藏
          this.changeApplyOvertime = false; //加班时间显示
          this.shengqingParamType = '1';
          this.isHideHeight = false;


        }
        if (this.selectedDataApply == '2') {
//          console.log('外出申请路线')
          this.changeApply = false; //假期隐藏
          this.changeApplyTime = true; //时间隐藏
          this.updateImage = true; //上传图片隐藏
          this.changeApplyOvertime = false; //加班时间显示
          this.shengqingParamType = '2';
          this.isHideHeight = false;


        }
        if (this.selectedDataApply == '3') {
//          console.log('加班路线')
          this.changeApply = false; //假期隐藏
          this.changeApplyTime = true; //时间隐藏
          this.updateImage = false; //上传图片隐藏
          this.changeApplyOvertime = false; //加班时间显示
          this.shengqingParamType = '3';
          this.isHideHeight = true;
        }
      },

      qingjiaclick(value){
        this.qingjiauidParam = value.uid;
      },
      lookImages(imgSrc){ //查看图片
//        console.log('图片');
//        console.log(imgSrc);
        if (imgSrc) this.popImgSrc = imgSrc;
        else this.popImgSrc = '';
        this.popupVisible = true;
      },
      closeImage(){
        this.popupVisible = false;
//        console.log('关闭');
        //做到这里
      },
      datefmt(str) {
        if (str) return moment(str).format(df);
        else return '';
      },
      closeAlert(){ //提交成功的提交alert
        this.leaveSuccess = false;
        if (this.codeSuccess == 200) {
          this.$router.push({path: '/signCard'});
        }
      },
      passportUrlOk(res, file) {
        this.imgSrc.shenFenIconShowCamera = URL.createObjectURL(file.raw);
        if (res.code === 200) {
          this.imgSrc.shenFenIconShowCamera = res.result;
        }
      },
      beforePassportUrl(file) {
        let isImage = utils.isImage(file);
        let isInSize = utils.isInSize(file, 5);
        if (isImage && isInSize) {
          this.passportUrlErrFlag = false;
        } else {
          this.passportUrlErrFlag = true;
        }
        return isImage && isInSize;
      },

    },

    components: {
      'vue-core-image-upload': VueCoreImageUpload,
    },
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
    .mint-navbar {
      .mint-tab-item.is-selected {
        border-bottom: none !important;
        margin-bottom: 0 !important;
        span {
          display: inline-block;
          padding-bottom: 10px;
          border-bottom: 3px solid #ffffff;
        }
      }
    }
    .leave-main {
      padding-top: 44px;
      .leave-main-box {
        padding: 0 15px;
        .leave-main-box-apply {
          overflow: hidden;
          height: 50px;
          line-height: 50px;
          font-size: 15px;
          border-bottom: 1px solid #d2dce6;
          .leave-main-box-apply-left {
            float: left;
            width: 100px;
            color: #8492a6;
            text-align: left;
          }
          .leave-main-box-apply-center {
            float: left;
            box-sizing: border-box;
            padding-left: 100px;
            /*padding-right: 30px;*/
            margin-top: -50px;
            color: #1f2d3d;
            text-align: left;
            width: 100%;
            select {
              width: 100%;
              overflow: hidden;
              border: none;
              outline: none;
              font-size: 15px;
            }
            span {
              padding-left: 4px;
              font-size: 15px;
            }
          }
          .leave-main-box-apply-right {
            float: right;
            width: 20px;
            margin-top: -50px;
            background-color: #ffffff;
            img {
              width: 15px;
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
            color: #8492a6;
          }
          textarea {
            outline: none;
            overflow: hidden;
            overflow-y: scroll;
            width: 98%;
            height: 4rem;
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
  }

  #leave-wrapper {
    .imagePopup-box {
      .v-modal {
        opacity: 1;
        background-color: #ffffff;
      }
    }

    .mint-tab-container-wrap {

    }
    .mint-tab-container-item {
      box-sizing: border-box;
      padding: 0 10px;
    }
    .mint-cell-wrapper {
      background: none;
    }
    .hrbei {
      /*width: 96%;*/
      /*margin: 0 0.8rem;*/
      height: 1px;
      background: #cccccc;
      line-height: 1px
    }

    .hideHeight {
      height: 0;
    }

    .icon {
      background: url(../../assets/ico_leave.png) !important;
    }

    .selectBao {
      position: absolute;
      width: 12px;
      height: 7px;
      top: 0.3rem;
      right: 0
    }

    .selectShowImg {
      width: 100%;
      height: 100%;
    }

    .hrClass {
      /*width: 96%;*/
      /*margin: 0 0.8rem;*/
      height: 1px;
      background: #cccccc;
      line-height: 1px
    }

    .contentClass {
      display: flex;
      padding: 0.5rem 1rem;
    }

    .contentLeft {
      flex: 1;
      text-align: left;
    }

    .contentRight {
      flex: 3;
    }

    .colseClass {
      width: 100%;
      max-height: 100vh;
      overflow: auto;
      img {
        width: 100%;
      }
    }

    .colseClassAlert {
      height: 3rem;
      line-height: 3rem;
      text-align: center;
      background: #26a2ff;
      color: #ffffff;
      width: 14rem;
      margin: 2rem auto;
      border-radius: 4px;
    }

    .alertImages {
      width: 100%;
      height: 100%;
      display: block;
      text-align: center;
    }

    .imageClass {
      width: 100%;
    }

    .imageClassSuccess {
      width: 16rem;
      height: 13rem;
      line-height: 11rem;
      border-radius: 4px;
    }

    .myApplyTitle {
      width: 100%;
      overflow: hidden;
      background: #d3dde7;
    }

    .myApplyBottom {
      padding-bottom: 1rem;
      background: #ffffff;
    }

    .showARightSpan {
      width: 15rem;
      height: 2rem;
      line-height: 2rem;
      text-align: left;
    }

    .dateTimeInput {
      border: none;
      width: 15rem;
      height: 2rem;
      line-height: 2rem;
      text-align: left;
      font-size: 0.8rem;
    }

    .dataTitle {
      position: fixed;
      width: 100%;
      z-index: 1;
    }

    .dataTitle span {
      font-size: 16px;
    }

    .changeSelect {
      width: 98%;
      display: block;
      height: 2rem;
      border: none;
      font-size: 1.1rem;
      background: #ffffff;
      -webkit-appearance: none;
      padding-left: 1rem;
    }

    .dateSelect {
      width: 98%;
      display: block;
      font-size: 1.1rem;
      padding-left: 1rem;
    }

    .cardClass {
      width: 11rem;
      height: 6rem;
      line-height: 6rem;
      padding-bottom: 1rem;
      position: absolute;
      left: 28%;
      top: 0.6rem;
    }

    .CardImg {
      display: block;
      width: 100%;
      height: 97%;
      border-bottom: 1px solid rgba(211, 219, 230, 0.3);

    }

    .CardDivImg {
      display: block;
      width: 11rem;
      height: 7rem;
      padding-left: 0rem;

    }

    .myApply {
      width: 100%;
      min-height: 12rem;
      margin-top: 1rem;
      padding-bottom: 10px;
      background: #ffffff;
      box-shadow: 0 0 0 1px #d3dce6;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      border-radius: 6px;
    }

    /*.myApplyNo {*/
    /*width: 92%;*/
    /*min-height: 12rem;*/
    /*line-height: 12rem;*/
    /*margin: 1rem;*/
    /*background: #ffffff;*/
    /*box-shadow: 0 0 0 1px #cccccc;*/
    /*white-space: nowrap;*/
    /*overflow: hidden;*/
    /*text-overflow: ellipsis;*/
    /*border-top-left-radius: 6px;*/
    /*border-top-right-radius: 6px;*/
    /*}*/

    .myApplyTitleLeft {
      width: 80%;
      text-align: left;
      height: 3rem;
      line-height: 3rem;
      float: left;
      font-weight: 600;
      font-size: 1.3rem;
    }

    .myApplyContent {
      background: #ffffff;
    }

    .myApplyContentLeft {
      width: 7rem;
      height: 3rem;
      line-height: 3rem;
      text-align: left;
      font-weight: bold;
      padding-left: 0.8rem;
      font-size: 16px;
      color: #324057;
    }

    .myApplyContentNr {
      box-sizing: border-box;
      width: 100%;
      min-height: 1rem;
      line-height: 1rem;
      text-align: left;
      padding: 0 1rem;
      font-size: 14px;
      color: #324057;
    }

    .myApplyContentNr span {
      word-break: normal;
      width: auto;
      display: inline-block;
      white-space: pre-wrap;
      word-wrap: break-word;
      overflow: hidden;
      line-height: 20px;

    }

    .myApplyBottomNrLeft {
      width: 6.5rem;
      display: inline-block;
      height: 1rem;
      line-height: 1rem;
      text-align: left;
      font-size: 1.2rem;
    }

    .myApplyBottomNrRight {
      width: 15rem;
      display: inline-block;
      height: 1rem;
      line-height: 1rem;
      text-align: left;
      font-size: 1.2rem;
    }

    .myApplyTitleRight {
      width: 20%;
      height: 3rem;
      line-height: 3rem;
      float: right;
      font-weight: 600;
      font-size: 1.3rem;
    }

    .changeShowList {
      flex: 1;
    }

    .changeTitleClass {
      position: fixed;
      left: 0;
      width: 100%;
      display: flex;
      background: rgb(29, 139, 224);
      color: rgba(255, 255, 255, 0.5);
      height: 40px;
      line-height: 40px;;
      z-index: 1;
    }

    .active {
      width: 24%;
      border-bottom: 0.2rem solid;
      color: #ffffff;
    }

    .active2 {
      width: 24%;
      border-bottom: 0.2rem solid;
      color: #ffffff;
    }

    .active3 {
      width: 24%;
      border-bottom: 0.2rem solid;
      color: #ffffff;
    }

    .active4 {
      width: 24%;
      border-bottom: 0.2rem solid;
      color: #ffffff;
    }

    /*修改tab样式*/
    .mint-navbar {
      background-color: #26a2ff;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      text-align: center;
    }

    .mint-navbar .mint-tab-item.is-selected {
      border-bottom: 3px solid #ffffff;
      color: #ffffff;
      margin-bottom: -1px;
    }

    .mint-navbar .mint-tab-item {
      padding: 17px 0;
      font-size: 15px;
      color: rgba(255, 255, 255, 0.5);
    }
  }

  /*修改tab样式结束*/
</style>
