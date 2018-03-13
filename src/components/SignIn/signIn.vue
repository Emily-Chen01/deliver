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
        <p v-text="year+'年'+month+'月'+date+'日'"></p>
      </div>
    </div>
    <!--打卡情况信息-->
    <div class="signIn-middle" :class="{'signIn-middle1': (!punchCardInfo.isNeed || showHide)}">
      <div class="signIn-article" v-if="punchCardInfo.punchCardLogs.length===0">
        <div class="signIn-article-left">
          <p class="article-icon-up"></p>
        </div>
      </div>
      <div class="signIn-article" v-for="(punch,punchIndex) in punchCardInfo.punchCardLogs">
        <div class="signIn-article-left">
          <div v-if="punchClock(punch.twStatus)" class="signIn-article-line"></div>
          <p class="article-icon-up"></p>
          <p v-if="punchClock(punch.twStatus)" class="article-icon-down"></p>
        </div>
        <div class="signIn-article-right" v-if="punchClock(punch.twStatus)">
          <div class="signIn-article-top" :class="{'signIn-article-top1':  punchCardInfo.attendRuleUid==='3'}">
            <p>
              <span v-text="'上班时间 '+punchTime(punch.twTime)"></span>
              <span class="article-tab article-tab-zc" v-if="punch.twStatus===0">正常</span>
              <span class="article-tab article-tab-cd" v-else-if="punch.twStatus===1">迟到</span>
              <span class="article-tab article-tab-kg" v-else-if="punch.twStatus===2">旷工</span>
              <span class="article-tab article-tab-qyw" v-if="punch.twOutside">区域外</span>
            </p>
            <p>
              <img :src="imgSrc.PostionIcon">
              <span
                v-text="'地理位置: '+ ((!punch.twOutside) ? '区域内' : (punch.twLocation ? (punch.twLocation+'附近') : ''))"></span>
            </p>
            <p>
            <span class="article-tab article-tab-sq" v-if="punch.twOutside"
                  @click="submitApplyRouter(0)">提交请假/外出申请</span>
              <span class="article-tab article-tab-wdk" v-if="punch.twStatus===1 || punch.twStatus===2"
                    @click="submitApplyRouter(1)">忘打卡</span>
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
              <img :src="imgSrc.PostionIcon">
              <span
                v-text="'地理位置: '+((!punch.owOutside) ? '区域内' : (punch.owLocation ? (punch.owLocation+'附近') : ''))"></span>
            </p>
            <p>
            <span class="article-tab article-tab-sq" v-if="punch.owOutside || punch.owStatus===1 || punch.owStatus===3"
                  @click="submitApplyRouter(0)">提交请假/外出申请</span>
              <span class="article-tab article-tab-jbsq" @click="submitApplyRouter(3)"
                    v-if="punch.owStatus===2">提交加班申请</span>
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
        <p v-text="showBtnContent ?'当前位置' : (hour + ':'+ minute + ':'+second)"></p>
      </mt-button>
    </div>
    <!--是否允许获取定位弹窗-->
    <mt-popup
      v-model="qulocation"
      class="getLocation-alert-wrapper"
      closeOnClickModal="false">
      <div class="getLocation-alert-content">
        <p v-if="punchCardInfo.locations.length && !failModel && !wifiPopup">HR SAAS系统要使用您的地理位置，是否允许？</p>
        <p v-if="!punchCardInfo.locations.length && !failModel && !wifiPopup">您没有考勤地点，请管理员为您添加考勤地点</p>
        <p v-if="failModel && !wifiPopup" v-text="failModelErr ? '获取地理位置失败' : '请打开微信定位'"></p>
        <p v-if="wifiPopup">请确认是否已经连接指定wifi，若是没有可能会造成位置异常</p>
      </div>
      <div class="getLocation-alert-btnBox">
        <p @click="closeAlert" class="getLocation-alert-btn"
           :class="(punchCardInfo.locations.length && !failModel) ? 'getLocation-alert-btnLeft' :  'getLocation-alert-btnColor getLocation-alert-btnCenter'"
           v-text="(punchCardInfo.locations.length && !failModel) ? '取消' : '确定'">
        </p>
        <p v-if="punchCardInfo.locations.length && !failModel && !wifiPopup" @click="okClickEvent"
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
             v-text="(punchCardInfo.status===false)?('上班 '+' '+punchTime(punchCardSuccess.punchCardLogs.twTime)):('下班 '+' '+punchTime(punchCardSuccess.punchCardLogs.owTime))"></p>
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
  import MtButton from "../../../node_modules/mint-ui/packages/button/src/button";

  let df = 'HH:mm:ss';
  export default {
    components: {MtButton}, data(){
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
        MyPosition: {},//当前位置
        objNr: {},// 员工姓名和所在部门
        year: new Date().getFullYear(), //右上角年
        month: new Date().getMonth() + 1, //右上角月
        date: new Date().getDate(), //右上角日
        hour: 0,// 打卡按钮上的时间
        minute: 0,// 打卡按钮上的时间
        second: 0,// 打卡按钮上的时间
        imgSrc: {
          header: require('../../assets/tx.png'), // 员工头像
          PostionIcon: require('../../assets/ico_location_1.png'), // 位置图标
          bg: require('../../assets/0_gif.gif'), // 打卡按钮背景1
          bg1: require('../../assets/0_gif1.gif'), // 打卡按钮背景2
          alertHeader: require('../../assets/pic_check in.png'), // 打卡成功弹框中的图标
        },
        outsideObtainValue: true, //获取的经纬度，判断是否区域内，true是区域外，false区域内
        searchLocationArray: [],  //查询出来的locations经纬度，来判断是否有考勤地点
        twRange: '', //记录打卡在区域外时，所在的地址
        showHide: false,//是否显示全部打卡信息
      }
    },
    created(){
      this.doSearch(); //初始化页面查询数据
    },
    methods: {
      //初始开始
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
            if (response.body.message === '当前考勤不需要打卡') {
              this.$router.push({path: '/signCard'});
            }
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
      handerClickEvent(){  //打卡按钮   上班或下班
        if (navigator.onLine) { //正常工作
          if (this.punchCardInfo.isWifi) {
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
//        this.punchInfo(this.twRange);
        this.showBtnContent = true;
        this.qulocation = false;
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
          $scripts.src = "https://pv.sohu.com/cityjson?ie=utf-8";
        }).then(() => {
          this.$http.post('/api/v1.0/wechat/sign', curl).then(response => { //获取签名接口开始
            if (response.body.code === 200) {
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
                self.showBtnContent = false;
              });
              wx.ready(function () {
                wx.getLocation({
                  type: 'wgs84',
                  success: function (res) {
                    self.getLocations = false;
                    self.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90           res.latitude;
                    self.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。     res.longitude;  //这个是原有
                    let speed = res.speed; // 速度，以米/每秒计
                    let accuracy = res.accuracy; // 位置精度
                    cvt.translate([new BMap.Point(res.longitude, res.latitude)]/* 微信坐标 wx */, 1, 5, (data) => {   //原有
                      if (data.status === 0) {
                        let myPosition = data.points[0]; // 转换后的微信坐标
                        self.MyPosition = myPosition;
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
                        })(self.punchCardInfo.locations);

                        let arrayLonglat = self.searchLocationArray;
                        cvt.translate(arrayLonglat/* 可打卡坐标 */, 3, 5, (data) => {
                          //status === 0 百度地图服务状态码，0是正常
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
                            new BMap.Geocoder().getLocation(myPosition, function (res) { //进行给传值参数位置
                              self.twRange = res.addressComponents.district + res.addressComponents.street;
                              if (!self.twRange) {
                                self.twRange = '未获取到位置信息';
                              }
                              self.punchInfo(self.twRange);
                            });
                          } else {
                            this.showBtnContent = false;
                            MessageBox('提示', '获取地理位置失败');
                          }
                        });
                      } else {
                        this.showBtnContent = false;
                        MessageBox('提示', '获取地理位置失败');
                      }
                    });
                  },
                  cancel: function (res) {
                    //判断是不是安卓苹果
                    let u = navigator.userAgent;
                    let isAndroid = '0';
                    isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
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
      punchInfo(twRange){
        // 获取到的ip
        if (this.punchCardInfo.isWifi) {
          this.getIP();
        }
        let updakaObj;
        if (!this.punchCardInfo.punchCardLogs.length) {
          this.punchCardInfo.punchCardLogs.push({
            twStatus: '',
            owStatus: ''
          })
        }
        let position = this.punchCardInfo.punchCardLogs.length - 1;
        if (!this.punchClock(this.punchCardInfo.punchCardLogs[position].twStatus)) {
          updakaObj = {
            isRange: this.outsideObtainValue,
            location: twRange,
            longitude: this.MyPosition.lng,
            latitude: this.MyPosition.lat,
            wifi: this.wifiIP
          }
        } else {
          updakaObj = {
            isRange: this.outsideObtainValue,
            location: twRange,
            longitude: this.MyPosition.lng,
            latitude: this.MyPosition.lat,
            wifi: this.wifiIP
          }
        }
        this.$http.post('/api/v1.0/client/punchCardLog', updakaObj).then(response => { //打卡
          if (response.body.code === 200) {
            this.doSearch(true);
          } else if (response.body.code === 500) {
            MessageBox('提示', response.body.message);
          }
        }, response => {
        });
        console.log('updakaObj', updakaObj);
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
        padding: 25px 20px;
        margin-bottom: 20px;
        .signIn-article-left {
          position: relative;
          width: 22px;
          height: 144px;
          p {
            position: absolute;
            width: 22px;
            height: 22px;
            border-radius: 50%;

          }
          .article-icon-up {
            top: 0;
            background: url("../../assets/ico_to.png");
            background-size: 22px 22px;
          }
          .article-icon-down {
            bottom: 0;
            background: url("../../assets/ico_off.png");
            background-size: 22px 22px;
          }
          .signIn-article-line {
            position: absolute;
            top: 1px;
            left: 10px;
            height: 142px;
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
            p {
              box-sizing: border-box;
              width: 100%;
              min-height: 22px;
              margin-bottom: 4px;
              span {
                box-sizing: border-box;
                display: inline-block;
                min-height: 22px;
                font-size: 14px;
                margin-right: 5px;
                text-align: center;
                border-radius: 4px;
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
              .article-tab-sq {
                min-width: 120px;
                padding: 3px 10px;
              }
              .article-tab-jbsq {
                min-width: 90px;
                padding: 3px 10px;
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
          .signIn-article-top1 {
            margin-top: 30px;
          }
          .signIn-article-bottom {
            position: absolute;
            top: 122px;
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
      /*bottom: 30px;*/
      /*position: relative;*/
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
