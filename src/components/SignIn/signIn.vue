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
        <p v-text="year+'年'+month+'月'+data+'日'"></p>
      </div>
    </div>
    <!--打卡情况信息-->
    <div class="signIn-article">
      <div class="signIn-article-left">
        <div v-if="showtwStstus" class="signIn-article-line"></div>
        <!--<div class="signIn-article-line"></div>-->
        <p class="article-icon-up">上</p>
        <p v-if="showtwStstus" class="article-icon-down">下</p>
        <!--<p class="article-icon-down">下</p>-->
      </div>
      <div class="signIn-article-right" v-if="showtwStstus">
        <div class="signIn-article-top">
          <p>
            <span v-text="'上班时间 '+initToTime"></span>
            <span class="article-tab article-tab-kg" v-if="absenteeismStatus">旷工</span>
            <span class="article-tab article-tab-zc" v-if="initDaKaRecord">正常</span>
            <span class="article-tab article-tab-cd" v-if="lateStatus">迟到</span>
            <span class="article-tab article-tab-qyw" v-if="toOutArea">区域外</span>
            <!--<span class="article-tab article-tab-zt">早退</span>-->
            <!--<span class="article-tab article-tab-sq">申请</span>-->
          </p>
          <p>
            <img :src="imgSrc.PostionIcon">
            <span v-text="'地理位置: '+ ((!toDaKaStatusIsOutsideInit) ? '区域内' : (twRangeShow+'附近'))"></span>
          </p>
          <p>
            <span class="article-tab article-tab-sq" v-if="toUpAbsenteeismStatus"
                  @click="submitApplyRouter(0)">提交请假/外出申请</span>
            <span class="article-tab article-tab-wdk" v-if="toUpForgetPunch" @click="submitApplyRouter(1)">忘打卡</span>
          </p>
        </div>
        <div class="signIn-article-bottom" v-if="zcDownShowSpan">
          <p>
            <span v-text="'下班时间 '+goToTime"></span>
            <span class="article-tab article-tab-kg" v-if="toDownKuang">旷工</span>
            <span class="article-tab article-tab-zc" v-if="initDownRecord">正常</span>
            <span class="article-tab article-tab-zt" v-if="leaveEarly">早退</span>
            <!--<span class="article-tab article-tab-cd">迟到</span>-->
            <!--<span class="article-tab article-tab-sq">申请</span>-->
            <span class="article-tab article-tab-qyw" v-if="downOutArea">区域外</span>
          </p>
          <p>
            <img :src="imgSrc.PostionIcon">
            <span v-text="'地理位置: '+((!toDownKaStatusIsOutsideInit) ? '区域内' : (owRangeShow+'附近'))"></span>
          </p>
          <p>
            <span class="article-tab article-tab-sq" v-if="toDownAbsenteeismStatus"
                  @click="submitApplyRouter(0)">提交请假/外出申请</span>
            <span class="article-tab article-tab-jbsq" @click="submitApplyRouter(3)"
                  v-if="toDownAddTimeStatus">提交加班申请</span>
          </p>
        </div>
      </div>
    </div>
    <!--打卡区域-->
    <div class="Punch-btn-wrapper" v-if="daKaHide">
      <div class="Punch-btn-bg">
        <img :src="(toClickSpan || downClickSpan) ? imgSrc.bg : imgSrc.bg1">
      </div>
      <mt-button class="Punch-btn-btn" type="primary" :disabled="!(toClickSpan || downClickSpan)"
                 @click="handerClickEvent">
        <p v-text="toClickSpan ? '上班打卡' : (downClickSpan ? '下班打卡' : '正在获取')"></p>
        <p v-text="(toClickSpan || downClickSpan) ? (hour + ':'+ minute + ':'+second) : '当前位置'"></p>
      </mt-button>
    </div>
    <!--是否允许获取定位弹窗-->
    <mt-popup
      v-model="qulocation"
      class="getLocation-alert-wrapper"
      closeOnClickModal="false">
      <div class="getLocation-alert-content" v-if="">
        <p v-if="searchLocationArray.length && !failModel && !wifiPopup">HR SAAS系统要使用您的地理位置，是否允许？</p>
        <p v-if="!searchLocationArray.length && !failModel && !wifiPopup">您没有考勤地点，请管理员为您添加考勤地点</p>
        <p v-if="failModel && !wifiPopup" v-text="failModelErr ? '获取地理位置失败' : '请打开微信定位'"></p>
        <p v-if="wifiPopup">请确认是否已经连接指定wifi，若是没有可能会造成位置异常</p>
      </div>
      <div class="getLocation-alert-btnBox">
        <p @click="closeAlert" class="getLocation-alert-btn"
           :class="(searchLocationArray.length && !failModel) ? 'getLocation-alert-btnLeft' :  'getLocation-alert-btnColor getLocation-alert-btnCenter'"
           v-text="(searchLocationArray.length && !failModel) ? '取消' : '确定'">
        </p>
        <p v-if="searchLocationArray.length && !failModel && !wifiPopup" @click="okClickEvent"
           class="getLocation-alert-btn getLocation-alert-btnRight">
          确定
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
      closeOnClickModal="false"
    >
      <div class="punch-success-box">
        <div class="punch-success-header">
          <div class="punch-success-headerLeft"></div>
          <p class="punch-success-headerCenter">打卡成功</p>
          <div class="punch-success-headerRight"></div>
        </div>
        <div class="punch-success-content">
          <div class="punch-success-img">
            <img :src="imgSrc.alertHeader">
          </div>
          <p class="punch-success-time" v-if="alertToSpan" v-text="'上班 '+' '+initToTime"></p>
          <p class="punch-success-time" v-if="alertDownSpan" v-text="'下班 '+' '+goToTime"></p>
          <div class="punch-success-tab">
            <mt-button type="default"
                       class="punch-success-tabHeight article-tab-zc"
                       v-if="initDownRecord">
              <span>打卡正常</span>
            </mt-button>
            <mt-button type="default"
                       class="punch-success-tabHeight article-tab-cd"
                       v-if="lateState">
              <span>您迟到了</span>
            </mt-button>
            <mt-button type="default"
                       class="punch-success-tabHeight article-tab-kg"
                       v-if="absenteeismStatusAlert">
              <span>旷工打卡</span>
            </mt-button>
            <mt-button type="default"
                       class="punch-success-tabHeight article-tab-zt"
                       v-if="leaveEarly">
              <span>早退</span>
            </mt-button>
            <mt-button type="default"
                       class="punch-success-tabHeight article-tab-qyw"
                       v-if="isYellowAddQ">
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

  let df = 'HH:mm:ss';
  let timer1 = null;
  export default {
    data(){
      return {
        objNr: {},// 员工姓名和所在部门
        failModel: false,// 判断是否开启定位功能或者是否成功获取地理位置弹框是否开启
        failModelErr: false,// 判断是未开启定位功能或者还是未成功获取地理位置
        alertNoDaka: '',
        year: new Date().getFullYear(), //右上角年
        month: new Date().getMonth() + 1, //右上角月
        data: new Date().getDate(), //右上角日
        imgSrc: {
          header: require('../../assets/tx.png'), // 员工头像
          PostionIcon: require('../../assets/ico_location_1.png'), // 位置图标
          bg: require('../../assets/0_gif.gif'), // 打卡按钮背景1
          bg1: require('../../assets/0_gif1.gif'), // 打卡按钮背景2
          alertHeader: require('../../assets/pic_check in.png'), // 打卡成功弹框中的图标
        },
        initToTime: '', // 上班打卡时间
        goToTime: '', // 下班打卡
        alertToSpan: false, //打卡成功弹出的模态框中显示的上班
        alertDownSpan: false, //打卡成功弹出的模态框中显示的下班
        popupVisible: false,//打卡成功弹出的模态框显示状态
        outsideObtainValue: true, //获取的经纬度，判断是否区域内，true是区域外，false区域内
        searchLocationArray: [],  //查询出来的locations经纬度，来判断是否有考勤地点
        twRange: '', //记录打卡在区域外时，所在的地址
        twRangeShow: '',// 显示上班信息区域外地址
        owRangeShow: '',// 显示下班信息区域外地址
        daKaHide: true,//整个打卡区域
        toClickSpan: true, //打卡按钮上，上班打卡文字状态
        getLocations: false, // 打卡按钮上，正在获取当前位置文字状态
        downClickSpan: false, //打卡按钮上，下班打卡文字状态
        zcDownShowSpan: false, //下班打卡后显示的信息
        toDownAbsenteeismStatus: false, //下班信息中提交请假外出申请按钮
        toUpAbsenteeismStatus: false, //上班信息中提交请假外出申请按钮
        toUpForgetPunch: false,//上班信息中忘打卡按钮
        showOwStstusX: false, //上下班信息之间的竖线
        showtwStstus: false,//显示上班打卡显示的信息
        toOutArea: false, //上班区域外
        downOutArea: false, //下班区域外
        absenteeismStatus: false, //上班 旷工打卡
        absenteeismStatusAlert: false, //打卡成功弹框中的旷工标签
        lateStatus: false, //迟到状态
        lateState: false, // 打卡弹框迟到状态
        isYellowAddQ: false,  //打卡成功弹框中的区域外标签
        initDaKaRecord: false, //上班打卡信息是否正常打卡
        leaveEarly: false,  //早退
        toDownKuang: false,  //下班旷工
        toDaKaStatusIsInit: '', //初始上班状态显示
        toDaKaStatusIsOutsideInit: false, //初始上班状态显示是否在区域外
        toDownKaStatusIsInit: '', //初始下班状态显示
        toDownKaStatusIsOutsideInit: false, //初始下班状态显示是否在区域外
        toDaKaStatusIs: '', //打卡上班状态显示
        toDaKaStatusIsOutside: false, //打卡上班是否在区域外
        toDownKaStatusIs: '', //打卡下班状态显示
        toDownKaStatusIsOutside: false, //打卡下班状态显示是否在区域外
        initDownRecord: false,//下班正常打卡
        toDownAddTimeStatus: false, //加班申请
        qulocation: false, //获取位置弹框
        hour: 0,// 打卡按钮上的时间
        minute: 0,// 打卡按钮上的时间
        second: 0,// 打卡按钮上的时间
        wifiPopup: false, // 获取wifi弹框内容
        isWifi: false, // 是否wifi打卡
        wifiIP: '',// wifiIP地址
      }
    },
    created: function () {
      this.doSearch(); //初始化页面查询数据
    },
    methods: {
      //初始开始
      doSearch(){
        this.handerSign();
        setInterval(this.handerSign, 1000);
        var imageString = this.getCookie('avatarImages'); //获取缓存的图片
        this.objNr = {
          fetchPostion: this.getCookie('infoObjPassPostion'),
          fetchName: this.getCookie('infoObjPassName'),
        };
        if (imageString) {
          this.imgSrc.header = imageString;
        }
        this.$http.post('/api/v1.0/client/findPunchCardLog').then(response => { //查询是否有打卡
          if (response.body.code === 200) {
            if (response.body.result) {
              //经纬度传值start
              this.searchLocationArray = response.body.result.locations;
              this.isWifi = response.body.result.isWifi;
              //经纬度传值end
              //进行给地理位置赋值start
              this.twRangeShow = response.body.result.twLocation;
              this.owRangeShow = response.body.result.owLocation;
              //进行给地理位置赋值end
              //如果为false不能显示打卡功能start
              this.fanwei = response.body.result.twOutside;
              this.fanweixia = response.body.result.owOutside;
              this.toDaKaStatusIsInit = response.body.result.twStatus; //上班状态赋值
              this.toDaKaStatusIsOutsideInit = response.body.result.twOutside; //上班是否在区域外
              this.toDownKaStatusIsInit = response.body.result.owStatus;//下班状态赋值
              this.toDownKaStatusIsOutsideInit = response.body.result.owOutside; //下班是否在区域外
              if (response.body.result.twTime) {
                this.toClickSpan = false;
                this.downClickSpan = true;
              }
              if (response.body.result.twTime) {
                this.initToTime = moment(response.body.result.twTime).format(df);
              }
              if (response.body.result.owTime) {
                this.goToTime = moment(response.body.result.owTime).format(df);
              }
              //我知道开始
              //   **********************初始化上下班分界线********************
              if (this.PunchClock(this.toDaKaStatusIsInit)) {  // 上班信息
                this.showtwStstus = true;
                this.toUpForgetPunch = false; // 忘打卡按钮
//                this.zcDownShowSpan = true; //下班信息
                this.toOutArea = false; // 区域外隐藏
                this.absenteeismStatus = false;//旷工隐藏
                this.toUpAbsenteeismStatus = false;
                this.lateStatus = false;
                this.initDaKaRecord = false;
                if (this.toDaKaStatusIsOutsideInit) { //区域外打卡
                  this.toOutArea = true;
                  this.toUpAbsenteeismStatus = true;
                }
                if (this.toDaKaStatusIsInit === 0) {//正常打卡显示
                  this.initDaKaRecord = true;
                } else if (this.toDaKaStatusIsInit === 1) { //迟到
                  this.lateStatus = true; //上班的迟到状态
                  this.toUpForgetPunch = true; //忘打卡按钮
                } else if (this.toDaKaStatusIsInit === 2) { //旷工打卡显示
                  this.absenteeismStatus = true;
                  this.toUpForgetPunch = true;//忘打卡按钮
                }
              }
              if (this.PunchClock(this.toDownKaStatusIsInit)) {     //****下班信息
                this.zcDownShowSpan = true;
                this.downOutArea = false;
                this.toDownAbsenteeismStatus = false;
                this.leaveEarly = false;// 早退
                this.initDownRecord = false;
                this.toDownAddTimeStatus = false;
                this.daKaHide = false;  //有下班打卡后按钮隐藏
                if (this.toDownKaStatusIsOutsideInit) { //区域外打卡显示
                  this.downOutArea = true;
                  this.toDownAbsenteeismStatus = true;
                }
                if (this.toDownKaStatusIsInit === 0 || this.toDownKaStatusIsInit === 2) {//正常打卡显示
                  if (this.toDownKaStatusIsInit === 2) { //加班打卡显示
                    this.toDownAddTimeStatus = true;
                  }
                  this.initDownRecord = true;
                } else if (this.toDownKaStatusIsInit === 1) { //早退
                  this.leaveEarly = true; //下班早退
                  this.toDownAbsenteeismStatus = true;
                } else if (this.toDownKaStatusIsInit === 3) { //旷工打卡显示
                  this.toDownKuang = true;
                  this.toDownAbsenteeismStatus = true;
                }
              }
            }
          } else if (response.body.code === 500) { //不能显示打卡功能
            MessageBox('提示', response.body.message);
            this.daKaHide = false;
            if (response.body.message === '当前考勤不需要打卡') {
              this.$router.push({path: '/signCard'});
            }
            return;
          }
        }, response => {
//          console.log('error callback');
        });
      },
      //初始结束
      // 格式化日期
      handerSign(){
        let oDate = new Date();
        this.hour = AddZero(oDate.getHours());
        this.minute = AddZero(oDate.getMinutes());
        this.second = AddZero(oDate.getSeconds());
        function AddZero(n) {
          if (n < 10) {
            return '0' + n;
          }
          return '' + n;
        }
      },
      // 判断上下班状态
      PunchClock(state){
        return typeof(state) === 'number' && state >= 0;
      },
      handerClickEvent(){  //打卡按钮   上班或下班
        console.log(navigator);
        if (navigator.onLine) { //正常工作
          if (this.isWifi) {
            this.wifiPopup = true;// 获取wifi弹框内容
          }
          this.wifiIP = '';
          this.qulocation = true;
        } else { //执行离线状态时的任务
          MessageBox('提示', '未连接网络');
        }
      },
      closeAlert(){ //打卡获取地理位置alert
        this.qulocation = false;
        // 加定时器是因为弹框不能立即消失，状态值改变，里面的内容会乱，加个定时器延迟其他状态值改变
        setTimeout(() => {
          this.failModel = false;
          this.wifiPopup = false;
        }, 300);

      },
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
        this.wifiPopup = false;
        this.qulocation = true;
      },
      // 获取位置信息
      okClickEvent(){
        let downClickSpan = this.downClickSpan;
        let toClickSpan = this.toClickSpan;
        this.qulocation = false;
        this.downClickSpan = false;
        this.toClickSpan = false;
        this.getLocations = true;
        let BMap = null;
        let map = null;
        let self = this;
        let curl;
        //判断是不是安卓苹果
        let u = navigator.userAgent;
        let isAndroid = '0';
        isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
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
        new Promise((resolve, reject) => {
          window._initBaiduMap = function () {
            window.document.body.removeChild($script);
            window._initBaiduMap = null;
            resolve();
            BMap = window.BMap;
            map = new BMap.Map();
          };
          // 获取经纬度
          const $script = document.createElement('script');
          window.document.body.appendChild($script);
          $script.src = `//api.map.baidu.com/api?v=2.0&ak=FRMO4GzB3wRlgFrAURcQSKWdZmzHuuD4&callback=_initBaiduMap`;
          // 获取ip
          const $scripts = document.createElement('script');
          window.document.body.appendChild($scripts);
          $scripts.src = "http://pv.sohu.com/cityjson?ie=utf-8";
        }).then(() => {
          this.$http.post('/api/v1.0/wechat/sign', curl).then(response => { //获取签名接口开始
            this.t1 = response.body.result.appid.toString();
            this.t2 = response.body.result.timestamp.toString();
            this.t3 = response.body.result.nonceStr.toString();
            this.t4 = response.body.result.signature.toString();
            this.yyy = true;
            let cvt = new BMap.Convertor();
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
              self.downClickSpan = downClickSpan;
              self.toClickSpan = toClickSpan;
              self.getLocations = false;
            });
            wx.ready(function () {
              wx.getLocation({
                type: 'wgs84',
                success: function (res) {
                  self.getLocations = false;
                  self.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90           res.latitude;
                  self.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。     res.longitude;  //这个是原有
                  var speed = res.speed; // 速度，以米/每秒计
                  var accuracy = res.accuracy; // 位置精度
                  cvt.translate([new BMap.Point(res.longitude, res.latitude)]/* 微信坐标 wx */, 1, 5, (data) => {   //原有
                    if (data.status === 0) {
                      let myPosition = data.points[0]; // 转换后的微信坐标
                      self.$http.post('/api/v1.0/client/findPunchCardLog').then(response => { //查询经纬度赋值
                        if (response.body.code === 200) {
                          //经纬度传值start
                          let scopes = [];
                          self.searchLocationArray = (rt => {
                            if (!rt) return false;
                            let out = [];
                            rt.forEach(item => {
                              out.push(new BMap.Point(item.LONGITUDE, item.LATITUDE));
                              scopes.push(item.SCOPE);
                            });
                            return out;
                          })(response.body.result.locations);

                          let arrayLonglat = self.searchLocationArray;
                          cvt.translate(arrayLonglat/* 可打卡坐标 */, 3, 5, (data) => {
                            if (data.status === 0) {
                              // 转换后的可打卡坐标
                              let distance;
                              self.twRange = '';
                              self.outsideObtainValue = true;// 初始值为true
                              for (let i = 0; i < data.points.length; i++) {
                                distance = map.getDistance(data.points[i], myPosition);
                                if (distance < scopes[i]) {
                                  self.outsideObtainValue = false;
                                  break;
                                }
                              }
                              if (self.outsideObtainValue) {
                                new BMap.Geocoder().getLocation(myPosition, function (res) { //进行给传值参数位置
                                  self.twRange = res.addressComponents.district + res.addressComponents.street;
                                  if (!self.twRange) {
                                    self.twRange = '未获取到位置信息';
                                  }
                                  self.punchInfo(self, self.twRange);
                                });
                              } else {
                                self.punchInfo(self, self.twRange);
                              }
                              // 下班打卡结束，打卡区域隐藏
                              if (self.PunchClock(self.toDaKaStatusIsInit)) {
                                self.daKaHide = false;
                              }
                            }
                          });
                        } else if (response.body.code === 500) {
                          MessageBox('提示', response.body.message);
                          self.daKaHide = false;
                          return;
                        }
                      }, response => {
//                        console.log('error callback');
                      });
                    }
                  });
                },
                cancel: function (res) {
                  //判断是不是安卓苹果
                  let u = navigator.userAgent;
                  let isAndroid = '0';
                  isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
                  if (isAndroid) {
                    alert('您拒绝了获取定位请求，只有允许才能进行打卡');
                  }
                  if (!isAndroid) {
                    alert('请开启微信定位服务');
                  }
                  //判断结束
                },
                fail: function (res) {
                  // 微信定位未开启
                  self.failModelErr = false;
                  self.failModel = true;
                  self.qulocation = true;
                  self.downClickSpan = downClickSpan;
                  self.toClickSpan = toClickSpan;
                  self.getLocations = false;
                }
              });
            });
          }, response => {
            console.log('error callback');
          });
        });
        //点击获取定位结束
      },
      // 获取ip地址
      getIP(){
        if (returnCitySN["cip"]) {
          this.wifiIP = returnCitySN["cip"];
        } else {
          this.getIP();
        }
      },
      punchInfo(self, twRange){
        // 获取到的ip
        if (this.isWifi) {
          this.getIP();
        }
        let updakaObj;
        if (!self.PunchClock(self.toDaKaStatusIsInit)) {
          updakaObj = {
            record: {
              twOutside: self.outsideObtainValue ? true : 0,
              twLocation: twRange,
              wifi: self.wifiIP
            }
          }
        } else if (self.PunchClock(self.toDaKaStatusIsInit) && !self.PunchClock(self.toDownKaStatusIsInit)) {
          updakaObj = {
            record: {
              owOutside: self.outsideObtainValue ? true : 0,
              owLocation: twRange,
              wifi: self.wifiIP
            }
          }
        }

        self.$http.post('/api/v1.0/client/punchCardLog', updakaObj).then(response => { //打卡
          if (response.body.code === 200) {
            self.toDaKaStatusIs = response.body.result.twStatus; //上班状态赋值
            self.toDaKaStatusIsOutside = response.body.result.twOutside; //上班班是否在区域外
            self.toDownKaStatusIs = response.body.result.owStatus;//下班状态赋值
            self.toDownKaStatusIsOutside = response.body.result.owOutside; //下班是否在区域外
            if (!self.PunchClock(self.toDaKaStatusIsInit)) {//上班打卡
              self.popupVisible = true;
              self.alertToSpan = true;//sapn 上班
              self.alertDownSpan = false; //sapn 下班
              self.absenteeismStatusAlert = false; // 打卡成功弹框中旷工标签
//              self.lateStatus = false;
              self.lateState = false;
              self.isYellowAddQ = false; // 打卡成功弹框中区域外标签
              self.downClickSpan = true; // 打卡按钮 下班打卡
              if (response.body.result.twTime) {
                self.initToTime = moment(response.body.result.twTime).format(df);
              }
              if (self.toDaKaStatusIsOutside) { //区域外   条件？？？？？
                self.isYellowAddQ = true; //alert区域外
              }
              if (self.toDaKaStatusIs === 0) {//正常打卡显示
                self.initDownRecord = true;
              } else if (self.toDaKaStatusIs === 1) { //迟到打卡显示
                self.lateState = true;
              } else if (self.toDaKaStatusIs === 2) { //旷工打卡显示
                self.absenteeismStatusAlert = true;
              }

            } else if (self.PunchClock(self.toDaKaStatusIsInit) && !self.PunchClock(self.toDownKaStatusIsInit)) { //下班打卡
              //在下班打卡前要确定是否在范围内 然后返回结果  进行打卡状态展示
              self.alertToSpan = false;//sapn 上班
              self.alertDownSpan = true; //sapn 下班
              self.popupVisible = true; //弹出的模态框打卡
              self.absenteeismStatusAlert = false;
              self.lateState = false;
              self.toDownAbsenteeismStatus = false;
              self.isYellowAddQ = false; // 打卡成功弹框中区域外标签
              self.leaveEarly = false; // 下班早退
              self.initDownRecord = false;
              if (response.body.result.owTime) {
                self.goToTime = moment(response.body.result.owTime).format(df);
              }
              if (self.toDownKaStatusIsOutside) { //区域外打卡显示
                self.isYellowAddQ = true;
                self.toDownAbsenteeismStatus = true; //提出请假外出申请
              }
              if (self.toDownKaStatusIs === 0) {//正常打卡显示
                self.initDownRecord = true;
              } else if (self.toDownKaStatusIs === 1) { //早退打卡显示
                self.leaveEarly = true;
              } else if (self.toDownKaStatusIs === 3) { //旷工打卡显示
                self.toDownAbsenteeismStatus = true;
                self.absenteeismStatusAlert = true;
              }
            }
            self.doSearch();
          } else if (response.body.code === 500) {
            MessageBox('提示', response.body.message);
            self.daKaHide = false;
            return;
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
    height: 100%;
    background-color: #ffffff;
    p {
      margin: 0;
    }
    .signIn-header {
      position: relative;
      box-sizing: border-box;
      overflow: hidden;
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
        padding-right: 140px;
        width: 100%;
        line-height: 20px;
        text-align: left;
      }
      .signIn-header-right {
        position: absolute;
        top: 16px;
        right: 15px;
        width: 125px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border: 1px solid #ffffff;
        border-radius: 4px;
        background-color: #4db3ff;
      }
    }
    .signIn-article {
      position: relative;
      box-sizing: border-box;
      width: 100%;
      padding: 25px 20px;
      .signIn-article-left {
        position: relative;
        width: 22px;
        height: 114px;
        p {
          position: absolute;
          box-sizing: border-box;
          width: 22px;
          height: 22px;
          border: 1px solid #98abbf;
          color: #98abbf;
          background-color: rgb(239, 242, 247);
          border-radius: 50%;
          z-index: 10;
        }
        .article-icon-up {
          top: 0;
        }
        .article-icon-down {
          bottom: 0;
        }
        .signIn-article-line {
          position: absolute;
          top: 0;
          left: 10px;
          height: 114px;
          border-left: 1px solid #98abbf;
        }
      }
      .signIn-article-right {
        position: absolute;
        top: 25px;
        text-align: left;
        box-sizing: border-box;
        padding-left: 22px;
        width: 90%;
        .signIn-article-top, .signIn-article-bottom {
          box-sizing: border-box;
          padding-left: 10px;
          font-size: 0;
          line-height: 22px;
          p {
            box-sizing: border-box;
            width: 100%;
            height: 22px;
            margin-bottom: 4px;
            span {
              box-sizing: border-box;
              display: inline-block;
              height: 22px;
              line-height: 22px;
              font-size: 14px;
              margin-right: 5px;
              text-align: center;
              border-radius: 4px;
            }
            .article-tab {
              font-size: 12px;
              width: 70px;
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
            .article-tab-sq {
              width: 120px;
            }
            .article-tab-jbsq {
              width: 90px;
            }
          }
          p:nth-child(1) {
            span:nth-child(1) {
              width: auto;
              text-align: left;
              margin-right: 10px;
            }
          }
          img {
            height: 15px;
            margin-right: 5px;
          }
        }
        .signIn-article-bottom {
          position: absolute;
          top: 92px;
        }
      }
    }
    .Punch-btn-wrapper {
      position: absolute;
      top: 300px;
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
          background-color: #20a2ff;
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
