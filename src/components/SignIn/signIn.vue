<template>
  <div style="background: #ffffff">
    <div style="position: relative;background: #20a1ff;overflow: hidden">
      <div class="siginLeft" style="overflow: hidden">
        <!--<img :src="imgSrc.comAddress" class="avatar">-->
        <div class="avatarBorder">
          <img :src="imgSrc.header" class="avatarTop">
        </div>
        <div class="nameClass"><span>{{objNr.fetchPostion}}</span> <span>{{objNr.fetchName}}</span></div>
        <div style="clear: both"></div>
      </div>
      <div class="siginRight">
        <div>
          <div class="detailClassBao">
            <!--<div class="detailClass"><span>{{objNr.fetchPostion}}</span> <span>{{objNr.fetchName}}</span></div>-->
            <div class="timeClass"><span>{{year}}</span>年<span>{{month}}</span>月<span>{{data}}</span>日</div>
          </div>
        </div>
      </div>
    </div>
    <div style="height: 84.5vh; padding-left: 1rem;padding-top: 2rem; position: relative">
      <div style="clear:both;"></div>
      <!--<div style="width: 100%;height: 0.1rem;margin: 1rem 0"></div>-->
      <div v-show="zcToUpShow" style="min-height: 6rem;">
        <div>
          <div class="toWorkLeft">
            <div>上</div>
          </div>
          <div class="toWorkRight">
            <div class="toWorkRightTimeSpan">上班时间</div>
            <div class="toWorkRightTimeSpan">
              <span>{{initToTime}}</span>
            </div>
            <div class="toWorkRightTime" style="position: relative">
              <mt-button type="default" class="toDaKaStatus" v-show="initDaKaRecord">
                <span>打卡正常</span>
              </mt-button>
              <mt-button type="default" class="toDaKaStatusSecondQ" v-show="isYellow">
                <span>区域外</span>
              </mt-button>
              <mt-button type="default" class="toDaKaStatusSecondQ" v-show="lateStatusAddW">
                <!--区域外+迟到显示-->
                <span>区域外</span>
              </mt-button>

              <mt-button type="default" class="toDaKaStatusSecondC" v-show="lateStatus">
                <!--lateStatus-->
                <span>迟到了</span>
              </mt-button>
              <mt-button type="default" class="toDaKaStatusSecondC" v-show="lateStatusTo">
                <!--lateStatus-->
                <span>迟到了</span>
              </mt-button>
              <mt-button type="default" class="toDaKaStatusSecondK" v-show="absenteeismStatus">
                <!--absenteeismStatus-->
                <span>旷工</span>
              </mt-button>
            </div>
            <div style="clear: both"></div>
            <div style="width: 99%">
              <div v-show="initDaKaRecordWeiZhi">
                <img :src="imgSrc.PostionIcon" class="postionClassIcon" style="display: inline-block">
                <span v-if="!fanwei" style="display: inline-block;line-height: 2rem">地理位置：范围内</span>
                <span v-if="twRangeShow" style="display: inline-block;line-height: 2rem">地理位置：{{twRangeShow}}附近</span>
              </div>
              <div>
                <mt-button type="default" class="toDaKaStatusQj" v-show="absenteeismStatus"
                           @click="submitApplyRouter(0)">
                  <!--absenteeismStatus  旷工-->
                  <span>提交请假/外出申请</span>
                </mt-button>
                <mt-button type="default" class="toDaKaStatusQj" v-show="absenteeismStatus2"
                           @click="submitApplyRouter(0)">
                  <!--absenteeismStatus  旷工-->
                  <span>提交请假/外出申请</span>
                </mt-button>
                <mt-button type="default" class="toDaKaStatusWj" v-show="lateStatus" @click="submitApplyRouter(1)">
                  <!--lateStatus  迟到块-->
                  <span>忘打卡？</span>
                </mt-button>
                <mt-button type="default" class="toDaKaStatusWj" v-show="tokuangWdk" @click="submitApplyRouter(1)">
                  <!--lateStatus  迟到块-->
                  <span>忘打卡？</span>
                </mt-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style="clear:both;"></div>

      <!--测试竖线-->

      <div v-show="showOwStstusX"
           style="position: absolute;background: rgb(152,171,191);height: 5.84rem;width: 0.1rem;top:3.63rem;left:2rem"></div>
      <!--测试竖线-->


      <div style="margin-top: 1.3rem" v-show="showOwStstus" :class={xiaShowOpacity:daAfter}>
        <!--此处是为了页面上班打卡后显示的初始化下班时间显示-->
        <div class="toWorkLeft" v-show="showOwStstus">
          <div>下</div>
        </div>
        <div class="toWorkRight">
          <div class="toWorkRightTimeSpan" v-show="showOwStstus">下班时间</div>
        </div>
      </div>

      <div v-show="zcDownShowSpan">
        <div style="margin-top: 1.3rem">
          <!--上面的top原有是5rem 5-16晚改-->
          <div class="toWorkLeft">
            <div>下</div>
          </div>
          <div class="toWorkRight">
            <div class="toWorkRightTimeSpan">下班时间</div>
            <div class="toWorkRightTimeSpan">
              <span>{{goToTime}}</span>
            </div>
            <div class="toWorkRightTime" style="position: relative">
              <mt-button type="default" class="toDaKaStatus" v-show="initDownRecord">
                <span>打卡正常</span>
              </mt-button>
              <mt-button type="default"
                         style="background-color: rgb(255,204,0);color:#ffffff;width: 5.7rem;left:-0.8rem;height: 1.8rem;position: absolute;top: 0.1rem;font-size: 0.8rem;border-radius: 4px"
                         v-show="leaveEarly">
                <span>早退</span>
              </mt-button>
              <mt-button type="default" class="toDaKaStatusSecondQ" v-show="toDownLateStatusAddW">
                <!--区域外+迟到显示-->
                <span>区域外</span>
              </mt-button>
              <mt-button type="default" class="toDaKaStatusSeconLeft" v-show="toDownLateStatusLeft">
                <!--区域外+迟到显示-->
                <span>区域外</span>
              </mt-button>
              <mt-button type="default" class="toDaKaStatusSecondC" v-show="toDownLateStatus">
                <span>迟到了</span>
              </mt-button>
              <mt-button type="default" class="toDaKaStatusSecondKG" v-show="toDownKuang">
                <span>旷工</span>
              </mt-button>
            </div>
            <div style="clear: both"></div>
            <div style="width: 99%">
              <img :src="imgSrc.PostionIcon" class="postionClassIcon" style="display: inline-block">

              <span v-if="!fanweixia" style="display: inline-block;line-height: 2rem">地理位置：范围内</span>
              <span v-if="owRangeShow" style="display: inline-block;line-height: 2rem">地理位置：{{owRangeShow}}附近</span>

            </div>
            <div>
              <mt-button type="default" class="toDaKaStatusQj" v-show="toDownAbsenteeismStatus"
                         @click="submitApplyRouter(0)">
                <span>提交请假/外出申请</span>
              </mt-button>
              <mt-button type="default" class="toDaKaStatusAdd" v-show="toDownAddTimeStatus"
                         @click="submitApplyRouter(3)">
                <span>提交加班申请</span>
              </mt-button>
            </div>
          </div>
        </div>
      </div>
      <div style="clear:both;"></div>
      <div class="clickClass">
        <div v-show="daKaHide">
          <img v-show="toUp && (toClickSpan || downClickSpan)" :src="imgSrc.bg"
               style="width: 16rem;height: 16rem;">
          <img v-show="toUp && getLocations" :src="imgSrc.bg1"
               style="width: 16rem;height: 16rem;">
          <!--此处是gif圆-->
        </div>
        <div style="position: absolute;top:4rem;left: 4rem;width:8rem;height: 8rem;text-align: center"
             v-show="daKaHide">
          <mt-button class="clickClassButton" type="primary" v-show="toUp" :disabled="getLocations"
                     @click="handerClickEvent"
                     style="background: rgba(255,255,255,0);width:100%;height: 8rem;">
            <div class="clickSignCard">
              <p class="clickClassUp signInFont" v-show="toClickSpan">上班打卡 </p>
              <p class="clickClassUp signInFont" v-show="getLocations">正在获取</p>
              <p class="clickClassDown signInFont" v-show="getLocations">当前位置</p>
              <p class="clickClassUp signInFont" v-show="downClickSpan">下班打卡 </p>
              <p class="clickClassDown signInFont" v-show="toClickSpan || downClickSpan">
                <span id="hour">
                </span><span :class="{  maohaoClass:maohao}">:</span><span id="minute">
               </span><span :class="{  maohaoClass:maohao}">:</span><span id="second">
              </span>
              </p>
            </div>
          </mt-button>
          <mt-popup
            v-model="popupVisible"
            closeOnClickModal="true"
            :class="{  popupClass:isNormal,active: isYellow,active2: isYellow2 ,absenteeismClass:absenteeismStatus }"
          >
            <div class="daKaAlert">
              <!--<img :src="imgSrc.daKaIcon"/><span class="daKaSpan">打卡成功</span>-->
              <div style="float: left;width:33%">
                <div style="width: 88%;height: 1px;background: rgb(204,212,213);margin: 2rem 0 0 1rem"></div>
              </div>
              <div style="float: left;width: 33%;font-size: 1.3rem;height: 2px; color:rgb(204,212,213);">打卡成功</div>
              <div style="float: left;width: 33%">
                <div style="width: 88%;height: 1px;background: rgb(204,212,213);margin: 2rem 1rem 0px 0"></div>
              </div>
            </div>
            <div style="clear: both"></div>
            <div style="width: 20rem;height: 9rem;">
              <div style="width: 9rem;height: 9rem;line-height: 7rem;text-align: center;margin: auto;">
                <img :src="imgSrc.alertHeader" style="text-align: center;width: 100%;height: 100%;display: block"/>
              </div>

            </div>

            <div class="middleSpan">
              <div class="middleSpanLeft" v-show="alertToSpan">上班</div>
              <div class="middleSpanLeft" v-show="alertDownSpan">下班</div>

              <div class="middleSpanRight">
                <div v-show="toTimeMiddleShow">{{initToTime}}</div>
                <div v-show="downTimeMiddleShow">{{goToTime}}</div>
              </div>
              <div style="clear: both"></div>
              <div style="width: 20rem;">
                <mt-button type="default"
                           class="alertStatusBottonClass"
                           style="background-color: #2acfbc;"
                           v-if="initDownRecord">
                  <span>打卡正常</span>
                </mt-button>

                <mt-button type="default"
                           class="alertStatusBottonClass"
                           style="background-color: #f6bc2a;"
                           v-if="lateStatus">
                  <span>您迟到了</span>
                </mt-button>
                <mt-button type="default"
                           class="alertStatusBottonClass"
                           style="background-color: #f54435;"
                           v-if="absenteeismStatusAlert">
                  <span>旷工打卡</span>
                </mt-button>
                <mt-button type="default"
                           class="alertStatusBottonClass"
                           style="background-color: #b2c92b;"
                           v-if="isYellowAddQ">
                  <!--迟到+区域外-->
                  <span>区域外</span>
                </mt-button>
                <mt-button type="default"
                           class="alertStatusBottonClass"
                           style="background-color: #f6bc2a;"
                           v-if="leaveEarly">
                  <span>早退</span>
                </mt-button>
              </div>
            </div>
            <div style="clear: both"></div>

            <div>
              <div class="spanKnow" @click="knowFunction"> 我知道啦</div>
            </div>

          </mt-popup>


          <mt-popup
            v-model="qulocation"
            class="imageClassAlert"
            closeOnClickModal="true"
          >
            <div style="font-size:1.2rem;width: 14rem;height: 1.5rem;text-align: center;margin:2rem auto 0.3rem auto;">
              <span>HR SAAS系统要使用您的</span>
            </div>
            <div
              style="font-size:1.2rem; width: 12rem;height: 1.5rem;text-align: center;margin:0.5rem auto 0.3rem auto;">
              <span>地理位置，是否允许？</span>
            </div>
            <div style="clear:both;"></div>
            <div @click="closeAlert" class="okClassAlert">
              <span>取消</span>
            </div>
            <div @click="okClickEvent" class="colseClassAlert">
              <span>确定</span>
            </div>
          </mt-popup>


          <mt-popup
            v-model="failModel"
            class="imageClassSuccess"
            closeOnClickModal="true"
          >
            <div style="clear:both;"></div>
            <div
              style="width: 16rem;height: 1.8rem;line-height:1.8rem;text-align: center; margin-top: 2rem;font-size: 1.1rem;">
              <span>请打开微信定位</span>
            </div>

            <div @click="closeAlertFail" class="colseClassAlertFail">
              <span>确定</span>
            </div>
          </mt-popup>
        </div>
      </div>
    </div>
    <div style="clear: both"></div>
  </div>
</template>
<script>

  import {Navbar, TabItem, Toast, MessageBox, Popup, Indicator} from 'mint-ui';
  import moment from 'moment'

  let df = 'HH:mm:ss';
  let timer1 = null;
  let jwresult = {"lat": 0.0, "lng": 0.0};
  export default {
    data(){
      return {
        isVisibleDaka: false,
        ncloseOnClickModal: true,
        failModel: false,
        alertNoDaka: '',
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        data: new Date().getDate(),
        initToTime: '',
        goToTime: '',
        downTimeMiddleShow: false, //模态框下班时间
        toTimeMiddleShow: true, //模态框上班时间
        alertToSpan: true, //初始弹出的模态款span上班
        alertDownSpan: false, //弹出的模态款span下班
        daKaHide: true,//整个打卡区域
        toUp: true,
        closeOnClickModal: true,
        popupVisible: false,
        zcToUpShow: true, //初始化上班前将要打卡
        zcDownShow: false, //上班已经打卡
        toUpYuanShow: true, //正在获取按钮
        toClickSpan: true, //上班打卡文字
        getLocations: false,
        downClickSpan: false, //下班打卡文字
        clickfunction: true, //为了区别上班还是下班
        zcDownShowSpan: false, //下班打卡后显示的文字
        isYellow: false, //区域外面打卡 yellow
        isYellow2: false, //区分迟到颜色 yellow2
        isNormal: true, //正常打卡 灰色
        absenteeismStatus: false, //旷工打卡
        absenteeismStatusAlert: false, //弹框旷工
        lateStatus: false, //迟到状态
        lateStatusAddW: false, //迟到状态
        isYellowAddQ: false,  //迟到+区域外
        initDaKaRecord: false, //查询打卡记录是否有  span
        leaveEarly: false,  //早退
        overTime: false,  //加班
        toDownKuang: false,  //下班旷工
        toDaKaStatusIsInit: '', //初始上班状态显示
        toDaKaStatusIsOutsideInit: false, //初始下班状态显示是否在区域外
        toDownKaStatusIsInit: '', //初始下班状态显示
        toDownKaStatusIsOutsideInit: '', //初始下班状态显示是否在区域外
        toDaKaStatusIs: '', //上班状态显示
        toDaKaStatusIsOutside: '', //上班是否在区域外
        toDownKaStatusIs: '', //下班状态显示
        toDownKaStatusIsOutside: '', //下班状态显示是否在区域外
        toDownAbsenteeismStatus: false, //下班提交请假span
        toDownLateStatusAddW: false, //下班状态span 区域外
        toDownLateStatus: false, //下班状态span 迟到
        objNr: {},
        addtime: 1.5,
        sumNumber: '',
        imgSrc: {
          comAddress: require('../../assets/logo.png'),
          header: require('../../assets/tx.png'),

          shezhiBackground: require('../../assets/shezhi.png'),
          daKaPostionIcon: require('../../assets/weizhi.png'),
          PostionIcon: require('../../assets/ico_location_1.png'),

          daKaIcon: require('../../assets/dakachenggong.png'),
          bg: require('../../assets/0_gif.gif'),
          bg1: require('../../assets/0_gif1.gif'),
          alertHeader: require('../../assets/pic_check in.png'),

        },
        clickStaus: '打卡正常',
        //下面是新增每种少的状态变量
        tokuangWdk: false, //上班旷工显示的忘打卡 状态
        initDaKaRecordWeiZhi: false,
        absenteeismStatus2: false, //提交外出申请2span
        lateStatusTo: false, //上班的迟到状态
        addTimeAlert: '', //alert加班时间
        initDownRecord: '',//下班正常
        toDownAddTimeStatus: '', //加班申请
        outsideObtainValue: true, //获取的经纬=判断的值是都区域外
        outsideObtainValueEr: '', //获取的经纬=判断的值是都区域外
        searchLocationArray: [],  //查询出来的locations经纬度
        twRange: '', //上班span文字
        twRangeShow: '',// 显示范围
        owRangeShow: '',// 显示范围
        twRangeNei: '', //范围内
        owRange: '', //下班span文字
        fanwei: '',
        fanweixia: true,
        maohao: true,//时间全展示
        showOwStstus: '',//显示下班的文字
        showOwStstusX: '', //竖线
        daAfter: '',
        toDownLateStatusLeft: false,  //在左边的区域外
        qulocation: false, //获取位置弹框
        alertMessage: '',

      }
    },
    created: function () {

//      this.handler(); //注释掉了初始化加载
      timer1 = setInterval(this.handerSign, 1000);

      this.doSearch(); //初始化页面查询数据

    },
    methods: {
      //初始开始
      doSearch(){
        var imageString = this.getCookie('avatarImages'); //获取缓存的图片
        this.objNr = {
          fetchPostion: this.getCookie('infoObjPassPostion'),
          fetchName: this.getCookie('infoObjPassName'),
        }
        if (imageString) {
          this.imgSrc.header = imageString;
        }
        this.$http.post('/api/v1.0/client/findPunchCardLog').then(response => { //查询是否有打卡
          if (response.body.code === 200) {
            if (response.body.result) {
              this.showOwStstus = response.body.result.twTime;
              this.showOwStstusX = response.body.result.twTime; //竖线的
              this.daAfter = response.body.result.owTime;
              if (response.body.result.owTime) {
                this.showOwStstus = false;
              }
              //经纬度传值start
              this.searchLocationArray = response.body.result.locations;
              //经纬度传值end
              //进行给地理位置赋值start
              this.twRangeShow = response.body.result.twLocation;
              this.owRangeShow = response.body.result.owLocation;
              //进行给地理位置赋值end
              //如果为false不能显示打卡功能start

              this.fanwei = response.body.result.twOutside;
              this.fanweixia = response.body.result.owOutside;
              this.toDaKaStatusIsInit = response.body.result.twStatus; //上班状态赋值
              this.toDaKaStatusIsOutsideInit = response.body.result.twOutside //上班是否在区域外
              this.toDownKaStatusIsInit = response.body.result.owStatus;//下班状态赋值
              this.toDownKaStatusIsOutsideInit = response.body.result.owOutside; //下班是否在区域外
              if (response.body.result.overTime !== null) {
                this.$nextTick(() => {
                  this.addtime = response.body.result.overTime;
                  this.setCookie('upAddTime', this.addtime, 365);
                });
              }
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
              if (this.toDaKaStatusIsInit == 0) {//正常打卡显示
                this.alertToSpan = false;//sapn 上班
                this.alertDownSpan = false; //sapn 下班
                this.initDaKaRecord = true;
                this.lateStatus = false;
                this.lateStatusAddW = false;
                this.absenteeismStatus = false;//旷工隐藏
                this.initDaKaRecordWeiZhi = true; //6-12-15测试提交bug添加
              }
              if (this.toDaKaStatusIsInit == 1 && this.toDaKaStatusIsOutsideInit) { //迟到+区域外打卡显示
                this.initDaKaRecord = false;
                this.lateStatusAddW = true;
                this.tokuangWdk = false; //忘打卡隐藏
                this.lateStatus = false; //第二个忘记打卡
                this.lateStatusTo = true; //上班的迟到状态
                this.$nextTick(() => {
                  this.absenteeismStatus = false; //旷工和提交隐藏
                  this.absenteeismStatus2 = true; //展示提交
                });
                this.initDaKaRecordWeiZhi = true; //6-12-15测试提交bug添加
              } else if (this.toDaKaStatusIsInit == 1) { //迟到打卡显示
                this.lateStatus = true;
                this.initDaKaRecord = false;
                this.isYellow = false;
                this.absenteeismStatus = false;
                this.initDaKaRecordWeiZhi = true;
              }
              if (this.toDaKaStatusIsInit == 2) { //旷工打卡显示
                this.absenteeismStatus = true;
                this.initDaKaRecord = false;
                this.lateStatus = false;
                this.tokuangWdk = true;
                this.initDaKaRecordWeiZhi = true;
              }
              if (this.toDaKaStatusIsOutsideInit) { //区域外打卡
                this.lateStatusAddW = true;
                this.initDaKaRecord = response.body.result.twStatus == 0 ? true : false;
                this.initDaKaRecordWeiZhi = true;
                this.absenteeismStatus = true;
              }
              if (this.toDaKaStatusIsOutsideInit && this.toDaKaStatusIsInit == 0) { //区域外打卡+正常显示
                this.$nextTick(() => {
                  this.lateStatusAddW = true;
                  this.initDaKaRecord = response.body.result.twStatus == 0 ? true : false;
                  this.initDaKaRecordWeiZhi = true;
                  this.absenteeismStatus = false; //隐藏包含旷工和提交span
                  this.absenteeismStatus2 = true;
                  this.tokuangWdk = false;
                  this.lateStatus = false;

                });
              }

//   **********************初始化上下班分界线********************


              if (this.toDownKaStatusIsInit == 0 || this.toDownKaStatusIsInit == 1 || this.toDownKaStatusIsInit == 2 || this.toDownKaStatusIsInit == 3) {     //****下班点击完成后进行页面展示内容
                if (this.toDownKaStatusIsInit == 0) {//正常打卡显示
                  console.log('toDaKaStatusIsInit状态' + this.toDaKaStatusIsInit)
                  this.zcDownShowSpan = true; //下班总线所展示的所有文字
                  this.initDownRecord = true;
                }
                if (this.toDownKaStatusIsInit == 0 && this.toDownKaStatusIsOutsideInit) {//正常打卡显示+区域外
                  console.log('toDaKaStatusIsInit状态' + this.toDaKaStatusIsInit)
                  this.zcDownShowSpan = true; //下班总线所展示的所有文字
                  this.initDownRecord = true;
                  this.toDownLateStatusAddW = true;
                }

                if (this.toDownKaStatusIsOutsideInit) { //区域外打卡显示
                  this.$nextTick(() => {
                    this.toDownLateStatusAddW = true;
                    this.toDownAbsenteeismStatus = true;
                  });
                }
                if (this.toDownKaStatusIsInit == 1 && this.toDownKaStatusIsOutsideInit) { //早退+区域外打卡显示
                  this.$nextTick(() => {
                    this.zcDownShowSpan = true; //下班总线所展示的所有文字
                    this.toDownAbsenteeismStatus = true; //下班提交请假span
                    this.toDownLateStatus = false; //下班状态span 迟到
                    this.leaveEarly = true; //下班早退
                    this.toDownLateStatusAddW = true; //区域外早退
                  });
                } else if (this.toDownKaStatusIsInit == 1) { //早退打卡显示
                  this.zcDownShowSpan = true; //下班总线所展示的所有文字
                  this.leaveEarly = true; //下班早退
                  this.toDownAbsenteeismStatus = true;
                }
                if (this.toDownKaStatusIsInit == 2) { //加班打卡显示
                  this.zcDownShowSpan = true;

                  this.toDownAddTimeStatus = true;
                  console.log('8' + this.toDaKaStatusIsInit)
                }
                if (this.toDownKaStatusIsInit == 2 && this.toDownKaStatusIsOutsideInit) { //加班+区域外打卡显示
                  this.$nextTick(() => {
                    this.toDownLateStatusAddW = false;
                    this.toDownAbsenteeismStatus = false; //下班提交请假span
                    this.toDownAddTimeStatus = true;
                    this.toDownLateStatusLeft = true;  //在左边的区域外显示
                  });
                }
                if (this.toDownKaStatusIsInit == 3) { //旷工打卡显示
                  this.toDownAbsenteeismStatus = false; //下班提交请假span
                  this.toDownKuang = true;
                  this.zcDownShowSpan = true;
                  this.toDownAbsenteeismStatus = true;
                }
                if (this.toDownKaStatusIsInit == 3 && this.toDownKaStatusIsOutsideInit) { //旷工+区域外打卡显示
//              alert('初始化加班+区域外');
                  this.$nextTick(() => {
                    this.toDownLateStatusAddW = true;
                  });
                }
                this.daKaHide = false;  //有下班打卡后按钮隐藏
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
          console.log('error callback');
        });
      },
      //初始结束
      handerSign(){
        var hour = document.getElementById('hour');
        var minute = document.getElementById('minute');
        var second = document.getElementById('second');
        self = this;
        function showTime() {
          var oDate = new Date();
          var iHours = oDate.getHours();
          var iMinute = oDate.getMinutes();
          var iSecond = oDate.getSeconds();
          hour.innerHTML = AddZero(iHours);
          minute.innerHTML = AddZero(iMinute);
          second.innerHTML = AddZero(iSecond);
          self.maohao = false;

        }

        showTime();
        setInterval(showTime, 1000);
        function AddZero(n) {
          if (n < 10) {
            return '0' + n;
          }
          return '' + n;
        }
      },
      handerClickEvent(){  //打卡按钮   上班Indicator.close();或下班
        this.qulocation = true;
      },
      closeAlert(){ //打卡获取地理位置alert
        this.qulocation = false;

      },
      knowFunction(){
        this.popupVisible = false;
        this.qulocation = false;


        if (this.toDaKaStatusIsInit == null) {//上班打卡
          this.popupVisible = false;

//          this.winReload();
        }
        if (this.toDaKaStatusIsInit !== null && this.toDownKaStatusIsInit == null) {
          this.popupVisible = false;

        }

        this.doSearch();

      },
      winReload: function (cond) {
        window.location.reload();
      },

      //提交申请跳转路由开始

      submitApplyRouter(type){
        this.setCookie('leaveType', type, 365);
        console.log(this.getCookie('leaveType'), '这是singIn的this.getCookie(leaveType)');
        this.$router.push({path: '/leave'});
      },
      //提交申请跳转路由结束

      okClickEvent(){

        this.qulocation = false;
        this.downClickSpan = false;
//        Indicator.open('正在获取位置...');  //本地调节注释
        // d点击获取定位开始
        this.toClickSpan = false;
        this.getLocations = true;
        let BMap = null;
        let map = null;
        let self = this;
        let curl;

        //判断是不是安卓苹果
        var u = navigator.userAgent;
        var isAndroid = '0';
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
            window.document.body.removeChild($script)
            window._initBaiduMap = null;
            resolve();
            BMap = window.BMap;
            map = new BMap.Map();
            console.log('bmap', BMap, map);
          }
          const $script = document.createElement('script')
          window.document.body.appendChild($script)
          $script.src = `//api.map.baidu.com/api?v=2.0&ak=FRMO4GzB3wRlgFrAURcQSKWdZmzHuuD4&callback=_initBaiduMap`
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
              console.log('err1 微信获取经纬度失败', res)
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

                        //添加不可以打卡的员工
                        if (response.body.code == 500) {
                          MessageBox('提示', response.body.message);
                          self.daKaHide = false;
                          Indicator.close();
                          return;
                        }
                        //添加可以不打卡的员工
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
                            for (let i = 0; i < data.points.length; i++) {

                              distance = map.getDistance(data.points[i], myPosition);

                              if (distance < scopes[i]) {
                                self.twRange = '';
                                self.outsideObtainValue = false;
                                if (!self.twRange) {
                                  Indicator.close();
                                  let updakaObj;
                                  self.clickfunction = false;
                                  console.log(self.twRange, '位置1传')
                                  if (self.toDaKaStatusIsInit == null) {
                                    updakaObj = {
                                      "record": {
                                        "twOutside": self.outsideObtainValue ? true : 0,
                                        "twLocation": self.twRange,
                                      }

                                    }
                                  } else if (self.toDaKaStatusIsInit !== null && self.toDownKaStatusIsInit == null) {
                                    updakaObj = {
                                      "record": {
                                        "owOutside": self.outsideObtainValue ? true : 0,
                                        "owLocation": self.twRange,
                                      }//0  'true'
                                    }
                                  }

                                  self.$http.post('/api/v1.0/client/punchCardLog', updakaObj).then(response => { //打卡
                                    if (response.body.code == 500) {
                                      MessageBox('提示', response.body.message);
                                      self.daKaHide = false;
                                      Indicator.close();
                                      return;
                                    }
                                    self.toDaKaStatusIs = response.body.result.twStatus; //上班状态赋值
                                    self.toDaKaStatusIsOutside = response.body.result.twOutside; //上班班是否在区域外
                                    self.toDownKaStatusIs = response.body.result.owStatus;//下班状态赋值
                                    self.toDownKaStatusIsOutside = response.body.result.owOutside; //下班是否在区域外
                                    self.addTimeAlert = response.body.result.overTime; //alert 加班时间
                                    if (self.toDaKaStatusIsInit == null) {//上班打卡

                                      self.toUp = false;
                                      self.popupVisible = true;
                                      self.downTimeMiddleShow = false;


                                      self.toTimeMiddleShow = true;

                                      if (response.body.result.twTime) {
                                        self.initToTime = moment(response.body.result.twTime).format(df);
                                      }
                                      if (self.toDaKaStatusIs == 0) {//正常打卡显示
                                        self.initDownRecord = true;
                                        self.toUp = true;
                                        self.downClickSpan = true;
                                        self.toUpYuanShow = false
                                        self.lateStatusAddW = false;

                                      }
                                      if (self.toDaKaStatusIs == 1) { //迟到打卡显示
                                        self.lateStatus = true;
                                        self.isYellow2 = true;
                                        self.initDownRecord = false;
                                        self.daKaHide = true;
                                        self.downClickSpan = true;
                                        self.toUp = true;
                                        self.toUpYuanShow = false;
                                      }
                                      if (self.toDaKaStatusIs == 2) { //旷工打卡显示
                                        self.absenteeismStatusAlert = true;
                                        self.daKaHide = true;
                                        self.toUp = true;
                                        self.downClickSpan = true;
                                        self.toClickSpan = false;
                                        self.tokuangWdk = true;
                                      }
                                      if (self.toDaKaStatusIsOutside) { //区域外   条件？？？？？
                                        self.isYellowAddQ = true; //alert区域外
                                      }
                                      if (self.toDaKaStatusIsOutside && self.toDaKaStatusIs == 0) { //区域外   条件？？？？？
                                        self.isYellowAddQ = true; //alert区域外
                                        self.lateStatusAddW = true; //区域外span
                                        self.initDownRecord = true;
                                        self.isYellow2 = true;
                                      }
                                      self.toClickSpan = false;
                                    } else if (self.toDaKaStatusIsInit !== null && self.toDownKaStatusIsInit == null) { //下班打卡
                                      //在下班打卡前要确定是否在范围内 然后返回结果  进行打卡状态展示
                                      self.zcDownShowSpan = true;
                                      self.alertToSpan = false;//sapn 上班
                                      self.alertDownSpan = true; //sapn 下班
                                      self.popupVisible = true; //弹出的模态框打卡
                                      self.overTime = false; //xinjia5-16 17:34加
                                      if (response.body.result.owTime) {
                                        self.goToTime = moment(response.body.result.owTime).format(df);
                                      }
                                      self.downTimeMiddleShow = true;
                                      self.toTimeMiddleShow = false;

                                      if (self.toDownKaStatusIs == 0) {//正常打卡显示
                                        self.initDownRecord = true;
                                        self.absenteeismStatusAlert = false;
                                        self.lateStatus = false;
                                        self.isYellow2 = false;
                                        self.overTime = false; //加班隐藏
                                        self.isYellowAddQ = false;
                                      }
                                      if (self.toDownKaStatusIs == 1) { //早退打卡显示
                                        self.leaveEarly = true;
                                        self.toDownAbsenteeismStatus = true; //早退内容显示提交请假5-16 17:39
                                        self.overTime = false;
                                        self.absenteeismStatusAlert = false;
                                        self.isYellow2 = true;
                                        self.isYellowAddQ = false; //区域外隐藏
                                        self.lateStatus = false; //您迟到了
                                        self.initDownRecord = false; //7-1提交的bug 7-4改暂时还没重新发布
                                      }
                                      if (self.toDownKaStatusIs == 1 && self.toDownKaStatusIsOutside) { //早退+区域外打卡显示
                                        self.leaveEarly = true;
                                        self.toDownAbsenteeismStatus = true; //早退内容显示提交请假5-16 17:39
                                        self.overTime = false;
                                        self.absenteeismStatusAlert = false;
                                        self.isYellow2 = true;
                                        self.isYellowAddQ = false; //区域外隐藏
                                        self.lateStatus = false; //您迟到了
                                        self.isYellow2 = true;
                                        self.isYellowAddQ = true;
                                        self.overTime = false;
                                      }
                                      if (self.toDownKaStatusIs == 3 && self.toDownKaStatusIsOutside) { //旷工+区域外打卡显示
                                        self.leaveEarly = false;
                                        self.overTime = false;
                                        self.absenteeismStatusAlert = true;
                                        self.isYellow2 = true;
                                        self.isYellowAddQ = true;
                                        self.initDownRecord = false;//隐藏正常打卡
                                        self.lateStatus = false;
                                      }
                                      if (self.toDownKaStatusIs == 3) { //旷工打卡显示
                                        self.leaveEarly = false;
                                        self.overTime = false;
                                        self.absenteeismStatusAlert = true;
                                        self.isYellow2 = true;
                                        self.initDownRecord = false;//隐藏正常打卡
                                        self.lateStatus = false;
                                        self.isYellowAddQ = false;//区域外
                                      }
                                      if (self.toDownKaStatusIsOutside) { //区域外打卡显示
                                        self.isYellow2 = true;
                                        self.isYellowAddQ = true;
                                        self.overTime = false;
                                      }
                                      if (self.toDownKaStatusIs == 2 && self.toDownKaStatusIsOutside) { //加班+区域外打卡显示
                                        self.lateStatus = false;
                                        self.overTime = false;
                                        self.absenteeismStatusAlert = false
                                      } else if (self.toDownKaStatusIs == 2) { //加班打卡显示
                                        self.lateStatus = false;
                                        self.overTime = false;
                                        self.zcDownShowSpan = true;
                                        self.zcToUpShow = true;
                                        self.isYellowAddQ = false;
                                        self.isNormal = true;
                                        self.absenteeismStatusAlert = false;
                                        self.isYellow2 = false;
                                      }
                                      self.toUp = false;
                                    }
                                    self.showOwStstus = false; //新增为了打卡时给下班时间的状态
                                  }, response => {
                                    console.log('error callback');
                                  });
                                }
                                break;
                              }
                            }
                            if (self.outsideObtainValue) {
                              self.outsideObtainValue = true;
                              new BMap.Geocoder().getLocation(myPosition, function (res) { //进行给传值参数位置
                                self.twRange = res.addressComponents.district + res.addressComponents.street;
                                if (self.twRange) {
                                  Indicator.close();
                                  let updakaObj;
                                  self.clickfunction = false;
                                  if (self.toDaKaStatusIsInit == null) {
                                    updakaObj = {
                                      "record": {
                                        "twOutside": self.outsideObtainValue ? true : 0,
                                        "twLocation": self.twRange,
                                      }
                                    }
                                  } else if (self.toDaKaStatusIsInit !== null && self.toDownKaStatusIsInit == null) {
                                    updakaObj = {
                                      "record": {
                                        "owOutside": self.outsideObtainValue ? true : 0,
                                        "owLocation": self.twRange,
                                      }//0  'true'
                                    }
                                  }
                                  self.$http.post('/api/v1.0/client/punchCardLog', updakaObj).then(response => { //打卡
                                    if (response.body.code == 500) {
                                      MessageBox('提示', response.body.message);
                                      self.daKaHide = false;
                                      Indicator.close();
                                      return;
                                    }
                                    self.toDaKaStatusIs = response.body.result.twStatus; //上班状态赋值
                                    self.toDaKaStatusIsOutside = response.body.result.twOutside; //上班班是否在区域外
                                    self.toDownKaStatusIs = response.body.result.owStatus;//下班状态赋值
                                    self.toDownKaStatusIsOutside = response.body.result.owOutside; //下班是否在区域外

                                    self.addTimeAlert = response.body.result.overTime; //alert 加班时间
                                    if (self.toDaKaStatusIsInit == null) {//上班打卡
                                      self.toUp = false;
                                      self.popupVisible = true;
                                      self.downTimeMiddleShow = false;
                                      self.toTimeMiddleShow = true;
                                      if (response.body.result.twTime) {
                                        self.initToTime = moment(response.body.result.twTime).format(df);
                                      }
                                      if (self.toDaKaStatusIs == 0) {//正常打卡显示
                                        self.initDownRecord = true;
                                        self.toUp = true;
                                        self.downClickSpan = true;
                                        self.toUpYuanShow = false
                                        self.lateStatusAddW = false;
                                      }
                                      if (self.toDaKaStatusIs == 1) { //迟到打卡显示
                                        self.lateStatus = true;
                                        self.isYellow2 = true;
                                        self.initDownRecord = false;
                                        self.daKaHide = true;
                                        self.downClickSpan = true;
                                        self.toUp = true;
                                        self.toUpYuanShow = false;


                                      }
                                      if (self.toDaKaStatusIs == 2) { //旷工打卡显示
                                        self.absenteeismStatusAlert = true;
                                        self.daKaHide = true;
                                        self.toUp = true;
                                        self.downClickSpan = true;
                                        self.toClickSpan = false;
                                        self.tokuangWdk = true;
                                        //测试过
                                      }
                                      if (self.toDaKaStatusIsOutside) { //区域外   条件？？？？？
                                        self.isYellowAddQ = true; //alert区域外
                                      }
                                      if (self.toDaKaStatusIsOutside && self.toDaKaStatusIs == 0) { //区域外   条件？？？？？
                                        self.isYellowAddQ = true; //alert区域外
                                        self.lateStatusAddW = true; //区域外span
                                        self.initDownRecord = true;
                                        self.isYellow2 = true;
                                      }
                                      self.toClickSpan = false;
                                    } else if (self.toDaKaStatusIsInit !== null && self.toDownKaStatusIsInit == null) { //下班打卡
                                      //在下班打卡前要确定是否在范围内 然后返回结果  进行打卡状态展示
                                      self.zcDownShowSpan = true;
                                      self.alertToSpan = false;//sapn 上班
                                      self.alertDownSpan = true; //sapn 下班
                                      self.popupVisible = true; //弹出的模态框打卡
                                      self.overTime = false; //xinjia5-16 17:34加
                                      if (response.body.result.owTime) {
                                        self.goToTime = moment(response.body.result.owTime).format(df);
                                      }
                                      self.downTimeMiddleShow = true;
                                      self.toTimeMiddleShow = false;
                                      if (self.toDownKaStatusIs == 0) {//正常打卡显示
                                        self.initDownRecord = true;
                                        self.absenteeismStatusAlert = false;
                                        self.lateStatus = false;
                                        self.isYellow2 = false;
                                        self.overTime = false; //加班隐藏
                                        self.isYellowAddQ = false;
                                      }
                                      if (self.toDownKaStatusIs == 1) { //早退打卡显示
                                        self.leaveEarly = true;
                                        self.toDownAbsenteeismStatus = true; //早退内容显示提交请假5-16 17:39
                                        self.overTime = false;
                                        self.absenteeismStatusAlert = false;
                                        self.isYellow2 = true;
                                        self.isYellowAddQ = false; //区域外隐藏
                                        self.lateStatus = false; //您迟到了
                                        self.initDownRecord = false; //7-1提交的bug 7-4改暂时还没重新发布


                                      }
                                      if (self.toDownKaStatusIs == 1 && self.toDownKaStatusIsOutside) { //早退+区域外打卡显示
                                        self.leaveEarly = true;
                                        self.toDownAbsenteeismStatus = true; //早退内容显示提交请假5-16 17:39
                                        self.overTime = false;
                                        self.absenteeismStatusAlert = false;
                                        self.isYellow2 = true;
                                        self.isYellowAddQ = false; //区域外隐藏
                                        self.lateStatus = false; //您迟到了
                                        self.isYellow2 = true;
                                        self.isYellowAddQ = true;
                                        self.overTime = false;
                                      }
                                      if (self.toDownKaStatusIs == 3 && self.toDownKaStatusIsOutside) { //旷工+区域外打卡显示
                                        self.leaveEarly = false;
                                        self.overTime = false;
                                        self.absenteeismStatusAlert = true;
                                        self.isYellow2 = true;
                                        self.isYellowAddQ = true;
                                        self.initDownRecord = false;//隐藏正常打卡
                                        self.lateStatus = false;
                                      }
                                      if (self.toDownKaStatusIs == 3) { //旷工打卡显示
                                        self.leaveEarly = false;
                                        self.overTime = false;
                                        self.absenteeismStatusAlert = true;
                                        self.isYellow2 = true;
                                        self.initDownRecord = false;//隐藏正常打卡
                                        self.lateStatus = false;
                                        self.isYellowAddQ = false;//区域外
                                      }
                                      if (self.toDownKaStatusIsOutside) { //区域外打卡显示
                                        self.isYellow2 = true;
                                        self.isYellowAddQ = true;
                                        self.overTime = false;
                                      }
                                      if (self.toDownKaStatusIs == 2 && self.toDownKaStatusIsOutside) { //加班+区域外打卡显示
                                        self.lateStatus = false;
                                        self.overTime = false;
                                        self.absenteeismStatusAlert = false
                                      } else if (self.toDownKaStatusIs == 2) { //加班打卡显示
                                        self.lateStatus = false;
                                        self.overTime = false;
                                        self.zcDownShowSpan = true;
                                        self.zcToUpShow = true;
                                        self.isYellowAddQ = false;
                                        self.isNormal = true;
                                        self.absenteeismStatusAlert = false;
                                        self.isYellow2 = false;
                                      }
                                      self.toUp = false;
                                    }
                                    self.showOwStstus = false; //新增为了打卡时给下班时间的状态
                                  }, response => {
                                    console.log('error callback');
                                  });
                                } else {
                                  console.log('没有获取到定位')
                                }
                              });
                            }


                            self.daKaHide = true;

                            if (distance && response.body.result.twTime && response.body.result.owTime) {
                              self.daKaHide = false;
                            }
                          }
                        });

                      }, response => {
                        console.log('error callback');
                      });

                    }
                  });

                },
                cancel: function (res) {
                  Indicator.close();
                  //判断是不是安卓苹果
                  var u = navigator.userAgent;
                  var isAndroid = '0';
                  isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
                  if (isAndroid) {
                    alert('您拒绝了获取定位请求，只有允许才能进行打卡');
                  }
                  if (!isAndroid) {
                    alert('请开启微信定位服务');
                  }
                  console.log(curl, 'curl');
                  //判断结束
                },
                fail: function (res) {
                  Indicator.close();
                  self.failModel = true;
                  console.log('请开启微信定位服务');
                  console.log(res, '请开启微信定位服务')

                }
              });

            });


          }, response => {
            console.log('error callback');
          });
          console.log('wx go');

        });
        console.info('debug info');


        //点击获取定位结束


      },
      closeAlertFail(){
        this.failModel = false;
      },
      closeAlertDaka(){
        this.isVisibleDaka = false;

      }
    },
    beforeDestroy: function () {
      clearInterval(timer1);
      timer1 = null;
      console.log('销毁完成timer1')
    },

  }

</script>

<style scoped>
  .imageClassSuccess {
    width: 16rem;
    /*top: 10rem;*/
    height: 12rem;
    /*line-height: 11rem;*/
    border-radius: 4px;
    /*background: pink;*/

  }

  .colseClassAlert {
    display: inline-block;
    height: 3rem;
    line-height: 3rem;
    text-align: center;
    background: #26a2ff;
    color: #ffffff;
    width: 6rem;
    margin: 2rem auto;
    border-radius: 4px;
    margin-left: 0.5rem;
  }

  .colseClassAlertFail {
    display: inline-block;
    height: 3rem;
    line-height: 3rem;
    text-align: center;
    background: #26a2ff;
    color: #ffffff;
    width: 6rem;
    margin: 3rem auto;
    border-radius: 4px;
    margin-left: 0.5rem;
  }

  .okClassAlert {
    display: inline-block;
    height: 3rem;
    line-height: 3rem;
    text-align: center;
    background: #ffffff;
    border: 1px solid #cccccc;
    color: rgb(116, 123, 129);
    width: 6rem;
    margin: 2rem auto;
    border-radius: 4px;
  }

  .imageClassAlert {
    width: 19rem;
    height: 13rem;
    background: #ffffff;
    border-radius: 4px;
  }

  .alertStatusBottonClass {
    width: 7.5rem;
    height: 2rem;
    display: inline-block;
    color: #ffffff;
  }

  .xiaShowOpacity {
    opacity: 0;
  }

  .siginLeft {
    /*display: inline-block;*/
    width: 21rem;
    float: left;
    /*height: 4.2rem;*/
    margin: 1.5% 0 0 1.5%;
    position: relative;
  }

  .avatarTop {
    width: 92%;
    height: 94%;
    display: block;
    text-align: center !important;
    padding: 0.22rem 0 0 0.23rem;
    border-radius: 4rem;
    z-index: 0;
  }

  .siginRight {
    /*display: inline-block;*/
    width: 3rem;
    float: right;
    height: 4.2rem;
  }

  .avatarBorder {
    width: 4rem;
    height: 4rem;
    border-radius: 2rem;
    text-align: right;
    margin-bottom: 0.5rem;
    float: left;
  }

  .nameClass {
    width: 16.5rem;
    /*height: 2rem;*/
    /*background: pink;*/
    /*position: absolute;*/
    margin-top: 1.5rem;
    font-size: 16px;
    color: #ffffff;
    float: right;
    box-sizing: border-box;
    padding-right: 5rem;
    /*top: 1rem;*/
    /*left: 4.5rem;*/
    text-align: left;
  }

  .detailClass {
    width: 9rem;
    float: left;
    height: 2rem;
    line-height: 2rem;
  }

  .timeClass {
    width: 8rem;
    float: right;
    height: 2rem;
    line-height: 2rem;
    background-color: #4db3ff;
    color: #ffffff;
    border-radius: 4px;
  }

  .detailClassBao {
    padding-top: 1.3rem;
    color: #ffffff;
  }

  .toWorkLeft {
    width: 6%;
    /*height: 1.4rem;*/
    line-height: 1.4rem;
    float: left;
    padding-left: 0.38rem;
    padding-top: 0.23rem;
  }

  .toWorkLeft div {
    width: 1.4rem;
    height: 1.4rem;
    box-sizing: border-box;
    border-radius: 50%;
    border: 1px solid #cccccc;
    background: rgb(239, 243, 247);
    color: rgb(152, 171, 209);
  }

  .toWorkRight {
    width: 90%;
    /*height: 1.4rem;*/
    line-height: 1.4rem;
    float: right;
    padding-right: 1%;
    text-align: left;
    /*padding-left: 1.3rem;*/
  }

  .clickClass {
    width: 16rem;
    height: 16rem;
    /*line-height: 9rem;*/
    /*text-align: center;*/
    position: absolute;
    top: 40vh;
    left: 50%;
    margin-left: -8rem;
  }

  .clickClassButton {
    width: 11rem;
    height: 11rem;
    /*padding-bottom: 5rem;*/
  }

  .clickSignCard {
    width: 100%;
    height: 8rem;
    overflow: hidden;
    padding-top: 4.5rem;
  }

  .clickClassUp {
    /*height: 1rem;*/
    /*line-height: 1rem;*/
    /*position: absolute;*/
    /*top: 1rem;*/
    /*font-size: 1.5rem;*/
    /*color: #ffffff;*/
    /*left: 1rem;*/
    /*font-weight: 600;*/
  }

  .clickClassDown {
    /*height: 1rem;*/
    /*left: 1rem;*/
    /*!*font-weight: 600;*!*/
    /*line-height: 1rem;*/
    /*position: absolute;*/
    /*top: 3.2rem;*/
    /*font-size: 1.5rem;*/
    /*color: #ffffff;*/
  }

  .signInFont {
    box-sizing: border-box;
    /*padding-top: 2rem;*/
    line-height: 20px;
    font-size: 16px;
    width: 100%;
    text-align: center;
    margin: 0;
    line-height: 20px;

  }

  .popupClass {
    width: 20rem;
    height: 24rem;
    border-radius: 4px;
    background-color: #ffffff;
  }

  .daKaAlert {
    width: 20rem;
    height: 3rem;
    line-height: 4rem;
    font-size: 1.2rem;
    color: #ffffff;
    /*padding-top: 2.2rem;*/
    position: relative;
  }

  .daKaAlert img {
    width: 30%;
    height: 46%;
    display: block;
    position: absolute;
    top: 2.5rem;
    left: 3rem;
  }

  .daKaAlert .daKaSpan {
    display: block;
    height: 5rem;
    line-height: 5rem;
    position: absolute;
    left: 7.5rem;
  }

  .middleSpan {
    width: 20rem;
    height: 6rem;
    line-height: 4rem
  }

  .middleSpan .middleSpanLeft {
    width: 3.9rem;
    height: 2rem;
    line-height: 2rem;
    padding-left: 5rem;
    padding-top: 0.5rem;
    font-size: 1.2rem;
    float: left;

  }

  .middleSpan .middleSpanRight {
    width: 3rem;
    height: 2rem;
    line-height: 2rem;
    float: left;
    padding-top: 0.5rem;
    font-size: 1.3rem;

  }

  /*.dakahr {*/
  /*width: 69.6%;*/
  /*height: 1px;*/
  /*background: #000000;*/
  /*position: absolute;*/
  /*left: 3.2rem;*/
  /*top: 4rem*/
  /*}*/

  .dakahrWhite {
    width: 100%;
    height: 1px;
    background-color: #ffffff;
    position: absolute;
    top: 5rem;

  }

  .spanKnow {
    /*color: #ffffff;*/
    /*!*font-weight: 600;*!*/
    /*font-size: 1.3rem;*/
    /*position: absolute;*/
    /*top: 6.8rem;*/
    /*left: 5.3rem;*/
    height: 3rem;
    line-height: 3rem;
    text-align: center;
    background: #26a2ff;
    color: #ffffff;
    width: 18rem;
    margin: 2rem auto;
    border-radius: 4px;
  }

  .toWorkRightTime {
    width: 6rem;
    height: 2rem;
    line-height: 2rem;
    float: left;
  }

  .toWorkRightTimeSpan {
    width: 5rem;
    height: 2rem;
    line-height: 2.1rem;
    float: left;
  }

  .toDaKaStatus {
    background-color: #2acfbc;
    color: #ffffff;
    width: 5.7rem;
    left: -0.8rem;
    height: 1.8rem;
    position: absolute;
    top: 0.1rem;
    font-size: 0.8rem;
    border-radius: 4px
  }

  .addTimeTotleClass {
    background-color: #6e83c5;
    color: #ffffff;
    width: 5.7rem;
    left: -0.9rem;
    height: 1.8rem;
    position: absolute;
    top: 0.1rem;
    font-size: 0.8rem !important;
    border-radius: 4px;
  }

  .toDaKaStatusSecond {
    background-color: rgb(139, 156, 172);
    color: #000000;
    width: 5.7rem;
    left: 5rem;
    height: 1.8rem;
    position: absolute;
    top: 0.1rem;
    font-size: 0.8rem;
    border-radius: 8px
  }

  .toDaKaStatusSecondQ {
    background-color: #b2c92b;
    color: #ffffff;
    width: 5.7rem;
    left: 5.3rem;
    height: 1.8rem;
    position: absolute;
    top: 0.1rem;
    font-size: 0.8rem;
    border-radius: 4px
  }

  .toDaKaStatusSeconLeft {
    background-color: #b2c92b;
    color: #ffffff;
    width: 5.7rem;
    left: -0.8rem;
    height: 1.8rem;
    position: absolute;
    top: 0.1rem;
    font-size: 0.8rem;
    border-radius: 4px
  }

  .toDaKaStatusSecondC {
    background-color: #f6bc2a;
    color: #ffffff;
    width: 5.7rem;
    left: -0.8rem;
    height: 1.8rem;
    position: absolute;
    top: 0.1rem;
    font-size: 0.8rem;
    border-radius: 4px
  }

  .toDaKaStatusSecondKG {
    background-color: #f54435;
    color: #ffffff;
    width: 5.7rem;
    left: -0.8rem;
    height: 1.8rem;
    position: absolute;
    top: 0.1rem;
    font-size: 0.8rem;
    border-radius: 4px
  }

  .toDaKaStatusSecondK {
    background-color: #f54435;
    color: #ffffff;
    width: 5.7rem;
    left: -0.8rem;
    height: 1.8rem;
    position: absolute;
    top: 0.1rem;
    font-size: 0.8rem;
    border-radius: 4px
  }

  .toDaKaStatusWj {
    background-color: rgb(32, 161, 255);
    color: #ffffff;
    width: 6rem;
    height: 1.8rem;
    top: 0.5rem;
    font-size: 0.8rem;
    border-radius: 8px
  }

  .toDaKaStatusQj {
    background-color: rgb(32, 161, 255);
    color: #ffffff;
    width: 9.8rem;
    height: 1.8rem;
    top: 0.5rem;
    font-size: 0.8rem;
    border-radius: 8px
  }

  .toDaKaStatusAdd {
    background-color: rgb(32, 161, 255);
    color: #ffffff;
    width: 7.8rem;
    height: 1.8rem;
    top: 0.5rem;
    font-size: 0.8rem;
    border-radius: 8px
  }

  .postionClassIcon {
    width: 1.1rem;
    height: 1.5rem;
    line-height: 1.5rem
  }

  .active {
    width: 20rem;
    height: 24rem;
    border-radius: 4px;
    background-color: #ffffff;
  }

  .active2 {
    width: 20rem;
    height: 24rem;
    border-radius: 4px;
    background-color: #ffffff;
  }

  .absenteeismClass {
    width: 20rem;
    height: 24rem;
    border-radius: 4px;
    background-color: #ffffff;
  }

  .maohaoClass {
    color: #26a2ff;
    opacity: 0;
  }
</style>
