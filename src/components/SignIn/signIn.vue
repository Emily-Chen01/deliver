<template>
  <div id="signIn-wrapper">
    <!--头部信息-->
    <div class="signIn-header">
      <div class="signIn-header-left">
        <img :src="imgSrc.header">
      </div>
      <div class="signIn-header-center">
        <p v-text="objNr.fetchPostion+' '+objNr.fetchName"></p>
      </div>
      <div class="signIn-header-right">
        <p v-text="date"></p>
      </div>
    </div>
    <!--打卡情况信息-->
    <div class="signIn-middle" :class="{'signIn-middle1': (!punchCardInfo.isNeed || showHide)}">
      <div class="signIn-article" v-for="(punch,punchIndex) in punchCardInfo.punchCardLogs">
        <div class="signIn-article-right" v-if="punchClock(punch.twStatus)">
          <div class="signIn-article-top" :class="{'signIn-article-top1':  punchCardInfo.attendRuleUid==='3'}">
            <div class="article-icon-up">
              <i class="icon_bg_signInImg bg-ico_to"></i>
            </div>
            <div v-if="punchClock(punch.twStatus)" class="article-icon-down">
              <i class="icon_bg_signInImg bg-ico_off"></i>
            </div>
            <p>
              <span v-text="'上班时间 '+punchTime(punch.twTime)"></span>
              <span class="article-tab article-tab-zc" v-if="punch.twStatus===0">正常</span>
              <span class="article-tab article-tab-cd" v-else-if="punch.twStatus===1">迟到</span>
              <span class="article-tab article-tab-kg" v-else-if="punch.twStatus===2">旷工</span>
              <span class="article-tab article-tab-qyw" v-if="punch.twOutside">区域外</span>
            </p>
            <p>
              <i class="icon_bg_signInImg bg-ico_location_1 mr5"></i>
              <span class="signIn-article_location"
                    v-text="'地理位置: '+ (punch.twLocation ? (punch.twLocation+'附近') : '')"></span>
            </p>
            <p align="left">
              <img class="img_map" :src="punch.twMap">
            </p>
            <p>
              <span class="article-tab article-tab-sq" v-if="punch.twOutside"
                    @click="submitApplyRouter(0)">提交请假/外出申请</span>
              <span class="article-tab article-tab-wdk" v-if="punch.twStatus===1 || punch.twStatus===2"
                    @click="submitApplyRouter(1)">忘打卡</span>
            </p>
            <p>

              <span class="article-tab article-tab-sx article-tab-sq"
                    @click="updatePunch({punchCardUid:punch.uid,startWork:0})">
                <i class="icon_bg_signInImg bg-icon_gengxin"></i>
                更新当前打卡记录(已前时间地点作为记录)
              </span>
            </p>
          </div>
          <div class="signIn-article-bottom"
               v-if="punchClock(punch.owStatus) && (punchCardInfo.attendRuleUid==='1'|| punchCardInfo.attendRuleUid==='2')">
            <p>
              <span v-text="'下班时间 '+punchTime(punch.owTime)"></span>
              <span class="article-tab article-tab-zc" v-if="punch.owStatus===0 || punch.owStatus===2">正常</span>
              <span class="article-tab article-tab-zt" v-else-if="punch.owStatus===1">早退</span>
              <span class="article-tab article-tab-kg" v-else-if="punch.owStatus===3">旷工</span>
              <span class="article-tab article-tab-qyw" v-if="punch.owOutside">区域外</span>
            </p>
            <p>
              <i class="icon_bg_signInImg bg-ico_location_1 mr5"></i>
              <span class="signIn-article_location"
                    v-text="'地理位置: '+ (punch.owLocation ? (punch.owLocation+'附近') : '')"></span>
            </p>
            <p align="left">
              <img class="img_map" :src="punch.owMap">
            </p>
            <p v-if="punch.owOutside || punch.owStatus">
            <span class="article-tab article-tab-sq" v-if="punch.owOutside || punch.owStatus===1 || punch.owStatus===3"
                  @click="submitApplyRouter(0)">提交请假/外出申请</span>
              <span class="article-tab article-tab-jbsq" @click="submitApplyRouter(3)"
                    v-if="punch.owStatus===2">提交加班申请</span>
            </p>
            <p>
              <span class="article-tab article-tab-sx article-tab-sq"
                    @click="updatePunch({punchCardUid:punch.uid,startWork:1})">
                <i class="icon_bg_signInImg bg-icon_gengxin"></i>
                更新当前打卡记录(已前时间地点作为记录)
              </span>
            </p>
          </div>
        </div>
      </div>
      <div class="signIn_mask" v-if="punchCardInfo.isNeed&&!showHide"></div>
    </div>
    <div class="signIn_hide" :class="{'signIn_hide1':showHide}"
         v-if="punchCardInfo.isNeed && punchCardInfo.punchCardLogs.length">
      <mt-button type="default" @click="showHides" size="small">
        <img v-if="showHide" src="../../assets/ico_arrow_02.png" width="12" slot="icon">
        <img v-if="!showHide" src="../../assets/ico_arrow_01.png" width="12" slot="icon">
        <span v-if="showHide">收起全部</span>
        <span v-else>查看全部</span>
      </mt-button>
    </div>
    <!--打卡区域-->
    <div class="Punch-btn-wrapper" v-if="punchCardInfo.isNeed && !showHide">
      <div class="Punch-btn-bg">
        <img :src="showBtnContent ? imgSrc.bg1 : imgSrc.bg">
      </div>
      <mt-button class="Punch-btn-btn" type="primary" :disabled="showBtnContent"
                 @click="handerClickEvent">
        <p v-text="showBtnContent ? '正在获取' : (punchCardInfo.status ? '上班打卡' : '下班打卡')"></p>
        <p v-text="showBtnContent ?'当前位置' : time"></p>
      </mt-button>
    </div>
    <!--是否允许获取定位弹窗-->
    <mt-popup
      v-model="qulocation"
      class="getLocation-alert-wrapper"
      :closeOnClickModal="false">
      <div class="getLocation-alert-content">
        <p v-if="!punchCardInfo.locations.length && !failModel && !wifiPopup">您没有考勤地点，请管理员为您添加考勤地点</p>
        <p v-if="failModel && !wifiPopup" v-text="failModelErr ? '获取地理位置失败' : '请打开微信定位'"></p>
        <p v-if="wifiPopup">请确认是否已经连接指定wifi，若是没有可能会造成位置异常</p>
      </div>
      <h3 class="amap-head" v-if="punchCardInfo.locations.length && !failModel && !wifiPopup">
        <span class="amap-headLeft" :class="outsideObtainValue?'amap-headLeft1':''"
              v-text="outsideObtainValue?'区域外':'区域内'"></span>
        <span class="amap-headRight" v-text="punTime"></span>
      </h3>
      <div id="amap-box" v-if="punchCardInfo.locations.length && !failModel && !wifiPopup">
        <!--<div id="amapContainer"></div>-->
        <img :src="amapImg" alt="">
        <p class="amap-detail" id="amap-detail" v-text="twRange"></p>
      </div>
      <div class="getLocation-alert-btnBox">
        <p @click="closeAlert" class="getLocation-alert-btn"
           :class="(punchCardInfo.locations.length && !failModel) ? 'getLocation-alert-btnLeft' :  'getLocation-alert-btnColor getLocation-alert-btnCenter'"
           v-text="(punchCardInfo.locations.length && !failModel) ? '取消' : '确定'">
        </p>
        <p v-if="punchCardInfo.locations.length && !failModel && !wifiPopup" @click="determinePunchCard"
           class="getLocation-alert-btn getLocation-alert-btnRight">
          确定打卡
        </p>
        <p v-if="wifiPopup" @click="okClickWifi"
           class="getLocation-alert-btn getLocation-alert-btnRight">
          确定
        </p>
      </div>
    </mt-popup>
    <!--打卡成功弹窗-->
    <mt-popup
      v-model="popupVisible"
      class="punch-success-wrapper"
      closeOnClickModal="false">
      <div class="punch-success-box" v-if="popupVisible">
        <div class="punch-success-header">
          <div class="punch-success-headerLeft"></div>
          <p class="punch-success-headerCenter">打卡成功</p>
          <div class="punch-success-headerRight"></div>
        </div>
        <div class="punch-success-content">
          <div class="punch-success-img">
            <img :src="imgSrc.alertHeader">
          </div>
          <p class="punch-success-time"
             v-text="(punchCardInfo.status===false || punchCardInfo.attendRuleUid === '3')?('上班 '+' '+punchTime(punchCardSuccess.punchCardLogs.twTime)):('下班 '+' '+punchTime(punchCardSuccess.punchCardLogs.owTime))"></p>
          <div class="punch-success-tab" v-if="punchCardInfo.status===false">
            <mt-button type="default"
                       class="punch-success-tabHeight article-tab-zc"
                       v-if="punchCardSuccess.punchCardLogs.twStatus===0">
              <span>打卡正常</span>
            </mt-button>
            <mt-button type="default"
                       class="punch-success-tabHeight article-tab-cd"
                       v-if="punchCardSuccess.punchCardLogs.twStatus===1">
              <span>您迟到了</span>
            </mt-button>
            <mt-button type="default"
                       class="punch-success-tabHeight article-tab-kg"
                       v-if="punchCardSuccess.punchCardLogs.twStatus===2">
              <span>旷工打卡</span>
            </mt-button>
            <mt-button type="default"
                       class="punch-success-tabHeight article-tab-qyw"
                       v-if="punchCardSuccess.punchCardLogs.twOutside">
              <span>区域外</span>
            </mt-button>
          </div>
          <div class="punch-success-tab" v-else>
            <mt-button type="default"
                       class="punch-success-tabHeight article-tab-zc"
                       v-if="punchCardSuccess.punchCardLogs.owStatus===0 || punchCardSuccess.punchCardLogs.owStatus===2">
              <span>打卡正常</span>
            </mt-button>
            <mt-button type="default"
                       class="punch-success-tabHeight article-tab-kg"
                       v-if="punchCardSuccess.punchCardLogs.owStatus===3">
              <span>旷工打卡</span>
            </mt-button>
            <mt-button type="default"
                       class="punch-success-tabHeight article-tab-zt"
                       v-if="punchCardSuccess.punchCardLogs.owStatus===1">
              <span>早退</span>
            </mt-button>
            <mt-button type="default"
                       class="punch-success-tabHeight article-tab-qyw"
                       v-if="punchCardSuccess.punchCardLogs.owOutside">
              <span>区域外</span>
            </mt-button>
          </div>
        </div>
        <div class="punch-success-btn" @click="knowFunction">
          <span>我知道啦</span>
        </div>
      </div>
    </mt-popup>
  </div>
</template>
<script>

  import {MessageBox, Popup} from 'mint-ui';
  import moment from 'moment'
  import html2canvas from 'html2canvas';
  import MtButton from "../../../node_modules/mint-ui/packages/button/src/button";

  let df = 'HH:mm:ss';
  let df1 = 'YYYY年MM月DD日';
  let df2 = 'YYYY-MM-DD HH:mm:ss';
  export default {
    components: {MtButton},
    data(){
      return {
        punchCardInfo: {//获取打卡信息记录
          locations: [],
          punchCardLogs: []
        },
        punchCardSuccess: {},// 打卡成功
        showBtnContent: false,// 显示打卡按钮，是否是正在获取地理位置
        qulocation: false, //获取位置弹框
        failModel: false,// 判断是否开启定位功能或者是否成功获取地理位置弹框是否开启
        failModelErr: false,// 判断是未开启定位功能或者还是未成功获取地理位置
        wifiPopup: false, // 获取wifi弹框内容
        popupVisible: false,//打卡成功弹出的模态框显示状态
        wifiIP: '',// wifiIP地址
        objNr: {},// 员工姓名和所在部门
        date: moment(new Date()).format(df1), //右上角日期
        time: '00:00:00',// 打卡按钮上的时间
        punchDateTime: new Date(),//打卡时间
        punTime: moment(new Date()).format(df2),//地图弹框中的时间
        imgSrc: {
          header: require('../../assets/tx.png'), // 员工头像
          bg: require('../../assets/0_gif.gif'), // 打卡按钮背景1
          bg1: require('../../assets/0_gif1.gif'), // 打卡按钮背景2
          alertHeader: require('../../assets/pic_check in.png'), // 打卡成功弹框中的图标
        },
        outsideObtainValue: false, //获取的经纬度，判断是否区域内，true是区域外，false区域内
        searchLocationArray: [],  //查询出来的locations经纬度，来判断是否在考勤地点区域内
        twRange: '', //记录打卡时，所在的地址
        showHide: false,//是否显示全部打卡信息
        amapImg: '',//地图截图
        updateState: false,//判断是否更新打卡
        punchCardUid: '',//更新打卡的数据id
        startWork: null,//更新打卡的上下班场次
      }
    },
    created(){
      this.doSearch(); //初始化页面查询数据
    },
    methods: {
      //====初始开始====//
      doSearch(state){
        this.handerSign();
        setInterval(this.handerSign, 1000);
        let imageString = this.getCookie('avatarImages'); //获取缓存的图片
        this.objNr = {
          fetchPostion: this.getCookie('infoObjPassPostion'),
          fetchName: this.getCookie('infoObjPassName'),
        };
        if (imageString) {
          this.imgSrc.header = imageString;
        }
        this.$http.post('/api/v1.0/client/findPunchCardLog').then(response => { //查询是否有打卡
          if (response.body.code === 200) {
            this.punchCardInfo = response.body.result;
            if (this.punchCardInfo.attendRuleUid === '4') {
              MessageBox('提示', '当前考勤不需要打卡');
              this.$router.push({path: '/signCard'});
            }
            if (state) {
              this.punchCardSuccess = JSON.parse(JSON.stringify(this.punchCardInfo));
              this.punchCardSuccess.punchCardLogs = this.punchCardInfo.punchCardLogs.length ? this.punchCardInfo.punchCardLogs[this.punchCardInfo.punchCardLogs.length - 1] : {};
              this.popupVisible = true;
              this.showBtnContent = false;
            }
          } else if (response.body.code === 500) { //不能显示打卡功能
            MessageBox('提示', response.body.message);
            if (response.body.message === '当前考勤无需打卡') {
              this.$router.push({path: '/signCard'});
            }
          }
        }, response => {
//          console.log('error callback');
        });
      },
      //====初始结束====//

      // 打卡按钮 格式化时间
      handerSign(){
        this.time = moment(new Date()).format(df);
      },
      // 判断上下班状态
      punchClock(state){
        return typeof(state) === 'number' && state >= 0;
      },
      //格式化时间
      punchTime(time){
        return time ? moment(time).format(df) : '';
      },
      // 是否显示全部打卡信息
      showHides(){
        this.showHide = !this.showHide;
      },
      // 确定打卡
      determinePunchCard(){
        let disTime = new Date().getTime() - this.punchDateTime.getTime();
        if (disTime < 5 * 60 * 1000) {
          this.qulocation = false;
          this.punchInfo();
        } else {
          this.showBtnContent = false;
          this.qulocation = false;
          MessageBox('提示', '打卡信息已失效，请重新打卡');
        }
      },
      //打卡开始
      handerClickEvent(){  //打卡按钮   上班或下班
        if (navigator.onLine) { //正常工作
          this.wifiPopup = false;
          if (this.punchCardInfo.isWifi) {
            const $scripts = document.createElement('script');
            window.document.body.appendChild($scripts);
            $scripts.src = "https://pv.sohu.com/cityjson?ie=utf-8"; //获取IP
            this.wifiPopup = true;// 获取wifi弹框内容
            this.wifiIP = '';
            this.qulocation = true;
          } else {
            this.okClickEvent();
          }
          this.punchDateTime = new Date();
          this.punTime = moment(this.punchDateTime).format(df2);//地图弹框中的时间
        } else { //执行离线状态时的任务
          MessageBox('提示', '未连接网络');
        }
      },
      //更新打卡
      updatePunch(data){
        this.updateState = true;
        this.punchCardUid = data.punchCardUid;
        this.startWork = data.startWork;
        this.handerClickEvent();
      },
      //取消弹框按钮
      closeAlert(){ //打卡获取地理位置alert
        this.showBtnContent = false;
        this.qulocation = false;
        // 加定时器是因为弹框不能立即消失，状态值改变，里面的内容会乱，加个定时器延迟其他状态值改变
        setTimeout(() => {
          this.failModel = false;
          this.wifiPopup = false;
        }, 300);
      },
      //我知道了按钮
      knowFunction(){
        this.popupVisible = false;
        this.qulocation = false;
      },
      //提交申请跳转路由开始
      submitApplyRouter(type){
        this.setCookie('leaveType', type, 365);
        this.$router.push({path: '/leave'});
      },
      //获取wifi地址
      okClickWifi(){
        this.wifiPopup = true;
        if (returnCitySN["cip"]) {//获取IP
          this.wifiIP = returnCitySN["cip"];
          this.qulocation = false;
          this.okClickEvent();
        } else {
          this.qulocation = false;
          MessageBox('提示', '获取IP地址失败');
        }
      },
      // 获取位置信息
      okClickEvent(){
        this.showBtnContent = true;
        let self = this;
        let curl;
        //判断是不是安卓苹果
        let u = navigator.userAgent;
        let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        if (isAndroid) {
          curl = {
            location: location.href //安卓的参数
          };
        }
        if (!isAndroid) {
          curl = {
            location: location.href.toString().split('#')[0] //苹果的参数
          };
        }

        //判断结束
        this.$http.post('/api/v1.0/wechat/sign', curl).then(response => { //获取签名接口开始
          if (response.body.code === 200) {
            this.t1 = response.body.result.appid.toString();
            this.t2 = response.body.result.timestamp.toString();
            this.t3 = response.body.result.nonceStr.toString();
            this.t4 = response.body.result.signature.toString();
            wx.config({
              debug: false,
              appId: this.t1,
              timestamp: this.t2,
              nonceStr: this.t3,
              signature: this.t4,
              jsApiList: [
                'getLocation'
              ]
            });
            wx.error(function (res) {
              // 微信获取经纬度失败
              self.failModelErr = true;
              self.failModel = true;
              self.qulocation = true;
              self.showBtnContent = false;
            });
            wx.ready(function () {
              wx.getLocation({
                type: 'gcj02',
                success: function (res) {
                  self.getLocations = false;
                  self.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90           res.latitude;
                  self.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。     res.longitude;  //这个是原有
                  let lnglat = [res.longitude, res.latitude];//当前位置经纬度
                  // 获取当前地理位置详情
                  let geocoder = new AMap.Geocoder();
                  geocoder.getAddress(lnglat, function (status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                      self.twRange = result.regeocode.formattedAddress;
                      if (self.twRange) {
                        self.qulocation = true;
                      } else {
                        self.showBtnContent = false;
                        MessageBox('提示', '获取地理位置失败');
                      }
                    } else {
                      self.twRange = '';
                      self.showBtnContent = false;
                      MessageBox('提示', '获取地理位置失败');
                    }
                  });

                  // 创建地图
//                  let map = new AMap.Map('amapContainer', {
//                    zoom: 16,//级别
//                    center: lnglat,//中心点坐标
//                    dragEnable: false, //是否可拖拽
//                    doubleClickZoom: false,//是否双击放大
//                    touchZoom: false,//移动端多指触控放大缩小
//                  });
//                  // 标记当前位置
//                  let marker = new AMap.Marker({
//                    map: map,
//                    position: lnglat,
//                  });

                  //静态地图路径
                  let url = 'http://restapi.amap.com/v3/staticmap?location=' + lnglat[0] + ',' + lnglat[1] + '&zoom=16&size=240*180&markers=small,0xFF0000,:' + lnglat[0] + ',' + lnglat[1] + '&key=79772b4966abdb3838a61e903d9d30e6';
                  getUrlBase64(url, 'png', (base64) => {
                    self.amapImg = base64;
                  });
                  //传入图片路径，返回base64
                  function getUrlBase64(url, ext, callback) {
                    let canvas = document.createElement("canvas");   //创建canvas DOM元素
                    let ctx = canvas.getContext("2d");
                    let img = new Image;
                    img.crossOrigin = 'Anonymous';
                    img.src = url;
                    img.onload = function () {
                      canvas.height = 160; //指定画板的高度,自定义
                      canvas.width = 240; //指定画板的宽度，自定义
                      ctx.drawImage(img, 0, 0, 240, 160, 0, 0, 240, 160); //参数可自定义
                      let dataURL = canvas.toDataURL("image/" + ext);
                      callback.call(this, dataURL); //回掉函数获取Base64编码
                      canvas = null;
                    };
                  }

                  let scopes = [];//考勤地点区域内半径
                  // 获取考勤地点经纬度集合
                  self.searchLocationArray = (rt => {
                    if (!rt) return false;
                    let out = [];
                    rt.forEach(item => {
                      out.push([item.LONGITUDE, item.LATITUDE]);
                      scopes.push(item.SCOPE);
                    });
                    return out;
                  })(self.punchCardInfo.locations);
                  self.outsideObtainValue = true;// 初始值为true,区域外
                  // 判断是否在区域内
                  for (let i = 0; i < self.searchLocationArray.length; i++) {
                    let dis = AMap.GeometryUtil.distance(lnglat, self.searchLocationArray[i]);
                    if (dis < scopes[i]) {
                      self.outsideObtainValue = false;
                      break;
                    }
                  }
                },
                cancel: function (res) {
                  //判断是不是安卓苹果
                  let u = navigator.userAgent;
                  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
                  self.showBtnContent = false;
                  if (isAndroid) {
                    MessageBox('提示', '您拒绝了获取定位请求，只有允许才能进行打卡');
                  }
                  if (!isAndroid) {
                    MessageBox('提示', '请开启微信定位服务');
                  }
                  //判断结束
                },
                fail: function (res) {
                  // 微信定位未开启
                  self.failModelErr = false;
                  self.failModel = true;
                  self.qulocation = true;
                  self.showBtnContent = false;
                }
              });
            });
          } else {
            this.showBtnContent = false;
            MessageBox('提示', response.body.message);
          }
        }, response => {
//            console.log('error callback');
        });
        //点击获取定位结束
      },
      //上传打卡信息
      punchInfo(){
        let updakaObj = {
          isRange: this.outsideObtainValue,
          location: this.twRange,
          longitude: this.longitude,
          latitude: this.latitude,
          wifi: this.wifiIP,
          map: this.amapImg.split(',')[1]
        };
        let url = '/api/v1.0/client/punchCardLog';
        if (this.updateState) {
          url = '/api/v1.0/client/updatePunchCardLog';
          updakaObj.punchCardUid = this.punchCardUid;
          updakaObj.startWork = this.startWork;
          this.updateState = false;
        }
        this.$http.post(url, updakaObj).then(response => { //打卡
          if (response.body.code === 200) {
            this.doSearch(true);
          } else if (response.body.code === 500) {
            MessageBox('提示', response.body.message);
          }
        }, response => {
        });
      }
    },
  }

</script>

<style lang="scss">
  #signIn-wrapper {
    position: relative;
    width: 100%;
    min-height: 100%;
    background-color: #ffffff;
    .clearFix {
      &:before {
        content: "";
        display: table
      }
      &:after {
        content: "";
        display: table;
        clear: both;
        overflow: hidden;
        *zoom: 1
      }
    }
    .mr5 {
      margin-right: 5px;
    }
    .vam {
      vertical-align: middle;
    }
    .vat {
      vertical-align: top;
    }
    p {
      margin: 0;
    }
    .signIn-header {
      position: fixed;
      box-sizing: border-box;
      overflow: hidden;
      z-index: 10;
      width: 100%;
      padding: 10px 15px 10px 60px;
      background: #20a1ff;
      font-size: 14px;
      color: #ffffff;
      .signIn-header-left {
        float: left;
        box-sizing: border-box;
        margin-left: -45px;
        width: 45px;
        height: 45px;
        border-radius: 50%;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .signIn-header-center {
        float: left;
        box-sizing: border-box;
        margin-top: 15px;
        padding-left: 10px;
        padding-right: 170px;
        width: 100%;
        line-height: 20px;
        text-align: left;
      }
      .signIn-header-right {
        position: absolute;
        top: 16px;
        right: 15px;
        padding: 0 10px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border: 1px solid #ffffff;
        border-radius: 4px;
        background-color: #4db3ff;
      }
    }
    .signIn-middle {
      position: relative;
      padding-top: 60px;
      height: 250px;
      overflow-y: hidden;
      .signIn-article {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        padding: 25px 0;
        margin-bottom: 20px;
        .signIn-article-right {
          position: absolute;
          top: 25px;
          text-align: left;
          box-sizing: border-box;
          padding: 0 15px 0 25px;
          .signIn-article-top, .signIn-article-bottom {
            box-sizing: border-box;
            padding-left: 20px;
            padding-bottom: 30px;
            font-size: 0;
            p {
              box-sizing: border-box;
              width: 100%;
              min-height: 22px;
              margin-bottom: 5px;
              span {
                box-sizing: border-box;
                display: inline-block;
                min-height: 22px;
                font-size: 14px;
                margin-right: 5px;
                text-align: center;
                border-radius: 4px;
              }
              .signIn-article_location {
                display: inline;
                vertical-align: middle;
              }
              .article-tab {
                font-size: 14px;
                padding: 3px 0;
                min-height: 22px;
                min-width: 70px;
                color: #ffffff;
              }
              .article-tab-kg, .article-tab-zt {
                background-color: #f54435;
              }
              .article-tab-qyw {
                background-color: #b2c92b;
              }
              .article-tab-zc {
                background-color: #2acfbc;
              }
              .article-tab-cd {
                background-color: #f6bc2a;
              }
              .article-tab-sq, .article-tab-wdk, .article-tab-jbsq {
                background-color: #20a2ff;
              }
              .article-tab-sx {
                /*line-height: 22px;*/
                font-size: 10px;
                background-color: #f08c60;
              }
              .article-tab-sq {
                min-width: 120px;
                padding: 3px 10px;
              }
              .article-tab-jbsq {
                min-width: 90px;
                padding: 3px 10px;
              }
              .img-postionIcon {
                height: 15px;
                margin-right: 5px;
              }
            }
            p:nth-child(1) {
              span:nth-child(1) {
                width: auto;
                text-align: left;
                margin-right: 10px;
              }
            }
            .img_map {
              width: 240px;
            }
          }
          .signIn-article-top {
            position: relative;
            border-left: 1px solid #98abbf;
            .article-icon-up {
              display: inline-block;
              width: 22px;
              height: 22px;
              position: absolute;
              top: -1px;
              left: -11px;
            }
            .article-icon-down {
              display: inline-block;
              width: 22px;
              height: 22px;
              position: absolute;
              bottom: -1px;
              left: -11px;
            }
          }
          .signIn-article-top1 {
            margin-top: 30px;
          }
          .signIn-article-bottom {
            margin-top: -20px;
          }
        }
      }
      .signIn_mask {
        position: absolute;
        width: 100%;
        height: 50px;
        bottom: 0;
        background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
      }
    }
    .signIn_hide {
      .mint-button {
        background-color: transparent;
        box-shadow: none;
        &:after {
          background-color: transparent;
        }
        .mint-button-text {
          color: #26a2ff;
        }
        .mint-button-icon {
          vertical-align: inherit;
        }
      }
    }
    .signIn_hide1 {
      width: 100%;
      position: fixed;
      height: 50px;
      bottom: 0;
      background-color: #26a2ff;
      .mint-button {
        margin-top: 9px;
        background-color: transparent;
        box-shadow: none;
        &:after {
          background-color: transparent;
        }
        .mint-button-text {
          color: #ffffff;
        }
        .mint-button-icon {
          vertical-align: inherit;
        }
      }
    }
    .signIn-middle1 {
      height: auto;
      overflow-y: inherit;
    }
    .Punch-btn-wrapper {
      position: absolute;
      top: 350px;
      box-sizing: border-box;
      width: 100%;
      .Punch-btn-bg {
        margin: 0 auto;
        width: 250px;
        height: 250px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .Punch-btn-btn {
        position: absolute;
        top: 50%;
        left: 50%;
        margin: -80px 0 0 -80px;
        padding-top: 80px;
        box-sizing: border-box;
        width: 160px;
        height: 160px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0);
        p {
          margin-bottom: 8px;
          width: 100%;
          height: 16px;
          line-height: 16px;
          color: #ffffff;
          font-size: 16px;
          text-align: center;
        }
        p:nth-child(2) {
          margin-bottom: 40px;
        }
      }
    }
    .getLocation-alert-wrapper {
      width: 276px;
      background-color: #ffffff;
      border-radius: 4px;
      padding-bottom: 18px;
      .getLocation-alert-content {
        box-sizing: border-box;
        padding: 20px 55px 0;
        width: 100%;
        text-align: center;
        p {
          width: 100%;
          line-height: 25px;
          font-size: 15px;
        }
      }
      .amap-head {
        width: 100%;
        overflow: hidden;
        display: flex;
        align-items: center;
        .amap-headLeft {
          width: 100px;
          text-align: left;
          border-left: 15px solid #2bcebd;
          font-size: 16px;
          padding-left: 10px;
          margin-left: 0;
          color: #2bcebd;
        }
        .amap-headLeft1 {
          border-left: 15px solid #ff4947;
          color: #ff4947;
        }
        .amap-headRight {
          width: 100%;
          text-align: right;
          padding-right: 15px;
          font-size: 14px;
          color: #666666;
        }
      }
      #amap-box {
        padding: 15px;
        padding-bottom: 0;
        #amapContainer {
          width: 100%;
          height: 160px;
          border: #ccc solid 1px;
          box-sizing: border-box;
          .amap-logo, .amap-copyright {
            display: none !important;
          }
        }
        .amap-detail {
          padding-top: 15px;
          text-align: left;
          font-size: 14px;
          font-weight: bold;
          color: #333333;
        }
      }
      .getLocation-alert-btnBox {
        overflow: hidden;
        padding: 25px 22px 0;
        .getLocation-alert-btn {
          box-sizing: border-box;
          width: 100px;
          height: 40px;
          line-height: 40px;
          border-radius: 4px;
          font-size: 14px;
          text-align: center;
        }
        .getLocation-alert-btn:nth-child(1) {
          border: 1px solid #bfcbd8;
          background-color: #ffffff;
          color: #1f2d3d;
        }
        .getLocation-alert-btn:nth-child(2) {
          background-color: #20a0ff;
          color: #ffffff;
        }
        .getLocation-alert-btnLeft {
          float: left;
        }
        .getLocation-alert-btnCenter {
          margin: 0 auto;
        }
        .getLocation-alert-btnRight {
          float: right;
        }
        .getLocation-alert-btnColor {
          border: 1px solid #20a2ff;
          background-color: #20a2ff;
          color: #ffffff;
        }
      }
    }
    .punch-success-wrapper {
      width: 250px;
      border-radius: 4px;
      .punch-success-box {
        box-sizing: border-box;
        width: 100%;
        padding: 10px;
        .punch-success-header {
          padding: 10px 80px 17px;
          overflow: hidden;
          .punch-success-headerLeft {
            float: left;
            width: 60px;
            height: 0;
            margin-left: -60px;
            margin-top: 8px;
            border-top: 1px solid #cbd5df;
          }
          .punch-success-headerCenter {
            float: left;
            width: 100%;
            text-align: center;
            font-size: 16px;
            line-height: 16px;
            color: #99a9bf;
          }
          .punch-success-headerRight {
            float: right;
            width: 60px;
            height: 0;
            margin-right: -60px;
            margin-top: 8px;
            border-top: 1px solid #cbd5df;
          }
        }
        .punch-success-content {
          width: 100%;
          .punch-success-img {
            width: 100%;
            padding-bottom: 15px;
            img {
              margin: 0 auto;
              width: 50px;
              height: 50px;
              border-radius: 50%;
            }
          }
          .punch-success-time {
            font-size: 16px;
            height: 16px;
            line-height: 16px;
            color: #1f2d3d;
            padding-bottom: 10px;
          }
          .punch-success-tab {
            .punch-success-tabHeight {
              height: 22px;
              font-size: 12px;
              color: #ffffff;
            }
            .article-tab-kg, .article-tab-zt {
              background-color: #f54435;
            }
            .article-tab-qyw {
              background-color: #b2c92b;
            }
            .article-tab-zc {
              background-color: #2acfbc;
            }
            .article-tab-cd {
              background-color: #f6bc2a;
            }
            .article-tab-sq, .article-tab-wdk {
              background-color: #20a2ff;
            }
          }
        }
        .punch-success-btn {
          margin-top: 30px;
          width: 100%;
          height: 40px;
          line-height: 40px;
          border-radius: 4px;
          color: #ffffff;
          background-color: #20a2ff;
        }
      }
    }
  }
</style>
