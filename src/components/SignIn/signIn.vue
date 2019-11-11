<template>
  <div id="signIn-wrapper">
    <!--头部信息-->
    <div class="signIn-header">
      <div class="signIn-header-left">
        <img :src="imgSrc.header" />
      </div>
      <div class="signIn-header-center">
        <p v-text="objNr.fetchPostion+' '+objNr.fetchName"></p>
      </div>
      <div class="signIn-header-right">
        <p v-text="date"></p>
      </div>
    </div>

    <swiper :data="posterList"></swiper>

    <!--打卡情况信息-->
    <div class="signIn-middle" :class="{'signIn-middle1': (!punchCardInfo.isNeed || showHide)}">
      <div class="signIn-article" v-for="(punch,punchIndex) in punchCardInfo.punchCardLogs" :key="punchIndex">
        <div class="signIn-article-right" v-if="punchClock(punch.twStatus)">
          <div
            class="signIn-article-top"
            :class="{'signIn-article-top1':  punchCardInfo.attendRuleUid==='3'}"
          >
            <div class="article-icon-up">
              <i class="icon_bg_signInImg bg-ico_to"></i>
            </div>
            <div v-if="punchClock(punch.twStatus)" class="article-icon-down">
              <i class="icon_bg_signInImg bg-ico_off"></i>
            </div>
            <p>
              <span v-text="'上班时间： '+punchTime(punch.twTime)"></span>
            </p>
            <p>
              <span class="article-tab article-tab-zc" v-if="punch.twStatus===0">正常</span>
              <span class="article-tab article-tab-cd" v-else-if="punch.twStatus===1">迟到</span>
              <span class="article-tab article-tab-kg" v-else-if="punch.twStatus===2">旷工</span>
              <span class="article-tab article-tab-qyw" v-if="punch.twOutside">区域外</span>
            </p>
            <p>
              <i class="icon_bg_signInImg bg-ico_location_1 mr5"></i>
              <span
                class="signIn-article_location"
                v-text="'地理位置： '+ (punch.twLocation ? (punch.twLocation+'附近') : '')"
              ></span>
            </p>
            <p align="left">
              <img class="img_map" :src="punch.twMap" />
            </p>
            <p>
              <span
                class="article-tab article-tab-sq"
                v-if="punch.twOutside"
                @click="submitApplyRouter(0)"
              >提交请假/外出申请</span>
              <span
                class="article-tab article-tab-wdk"
                v-if="punch.twStatus===1 || punch.twStatus===2"
                @click="submitApplyRouter(1)"
              >忘打卡</span>
            </p>
            <p>
              <span
                class="article-tab article-tab-sx article-tab-sq"
                @click="updatePunch({punchCardUid:punch.uid,startWork:0})"
              >
                <i class="icon_bg_signInImg bg-icon_gengxin"></i>
                更新当前
                <span style="color:white;">上班</span>打卡记录(以当前时间地点作为记录)
              </span>
            </p>
          </div>
          <div
            class="signIn-article-bottom"
            v-if="punchClock(punch.owStatus) && (punchCardInfo.attendRuleUid==='1'|| punchCardInfo.attendRuleUid==='2'||punchCardInfo.attendRuleUid==='5'|| punchCardInfo.attendRuleUid==='6')"
          >
            <p>
              <span v-text="'下班时间： '+punchTime(punch.owTime)"></span>
            </p>
            <p>
              <span
                class="article-tab article-tab-zc"
                v-if="punch.owStatus===0 || punch.owStatus===2"
              >正常</span>
              <span class="article-tab article-tab-zt" v-else-if="punch.owStatus===1">早退</span>
              <span class="article-tab article-tab-kg" v-else-if="punch.owStatus===3">旷工</span>
              <span class="article-tab article-tab-qyw" v-if="punch.owOutside">区域外</span>
            </p>
            <p>
              <i class="icon_bg_signInImg bg-ico_location_1 mr5"></i>
              <span
                class="signIn-article_location"
                v-text="'地理位置： '+ (punch.owLocation ? (punch.owLocation+'附近') : '')"
              ></span>
            </p>
            <p align="left">
              <img class="img_map" :src="punch.owMap" />
            </p>
            <p v-if="punch.owOutside || punch.owStatus">
              <span
                class="article-tab article-tab-sq"
                v-if="punch.owOutside || punch.owStatus===1 || punch.owStatus===3"
                @click="submitApplyRouter(0)"
              >提交请假/外出申请</span>
              <span
                class="article-tab article-tab-jbsq"
                @click="submitApplyRouter(3)"
                v-if="punch.owStatus===2"
              >提交加班申请</span>
            </p>
            <p>
              <span
                class="article-tab article-tab-sx article-tab-sq"
                @click="updatePunch({punchCardUid:punch.uid,startWork:1})"
              >
                <i class="icon_bg_signInImg bg-icon_gengxin"></i>
                更新当前
                <span style="color:white;">下班</span>打卡记录(以当前时间地点作为记录)
              </span>
            </p>
          </div>
        </div>
      </div>
      <div class="signIn_mask" v-if="punchCardInfo.isNeed&&!showHide"></div>
    </div>
    <div
      class="signIn_hide"
      :class="{'signIn_hide1':showHide}"
      v-if="punchCardInfo.isNeed && punchCardInfo.punchCardLogs.length"
    >
      <mt-button type="default" @click="showHides" size="small">
        <img v-if="showHide" src="../../assets/ico_arrow_02.png" width="12" slot="icon" />
        <img v-if="!showHide" src="../../assets/ico_arrow_01.png" width="12" slot="icon" />
        <span v-if="showHide">收起全部</span>
        <span v-else>查看全部</span>
      </mt-button>
    </div>
    <!--打卡区域-->
    <div class="Punch-btn-wrapper" v-if="punchCardInfo.isNeed && !showHide">
      <div class="Punch-btn-bg" :class="showBtnContent ? 'Punch-btn-bg1':'Punch-btn-bg0'"></div>
      <mt-button
        class="Punch-btn-btn"
        type="primary"
        :disabled="showBtnContent"
        @click="handerClickEvent"
      >
        <p v-text="showBtnContent ? '正在获取' : (punchCardInfo.status ? '上班打卡' : '下班打卡')"></p>
        <p v-text="showBtnContent ?'当前位置' : time"></p>
      </mt-button>
    </div>
    <!--是否允许获取定位弹窗-->
    <div v-if="kejian">
      <mt-popup v-model="qulocation" position="top" class="getLocation-alert-wrapper1" pop-transition="popup-fade" :closeOnClickModal="false">
        <div class="getLocation-alert-content">
          <p v-if="!punchCardInfo.locations.length && !failModel && !wifiPopup">您没有考勤地点，请管理员为您添加考勤地点</p>
          <p v-if="failModel && !wifiPopup" v-text="failModelErr ? '获取地理位置失败' : '请打开微信定位'"></p>
          <p v-if="wifiPopup">请确认是否已经连接指定wifi，若是没有可能会造成位置异常</p>
        </div>

        <div v-if="updatePunchCard.updateState===true">
          <div class="signIn-article" v-for="(punch,punchIndex) in punchCardInfo.punchCardLogs" :key="punchIndex">
            <div class="signIn-article-right" v-if="punchClock(punch.twStatus)">
              <div style="padding: 0 20px;max-width:240px;"
                class="signIn-article-top"
                :class="{'signIn-article-top1':  punchCardInfo.attendRuleUid==='3'}"
              >
                  <div class="changeyuantitle">
                    <div style="display:flex;align-items:center;">
                      <div class="changeyuantitle-bj"></div>
                      <div class="signIn-title" style="font-size:10px;margin-top:1px;">原打卡记录</div>
                    </div>
                    <!-- <div class="punch-success-time punch-success-timex"
                      v-text="(updatePunchCard.startWork===0)?(punchTime(punch.twTime)):(punchTime(punch.owTime))"
                        ></div> -->
                  </div>
                  
                  <div style="display:flex;">
                    <div class="mapkuang" style="width:40%;">
                      <img style="margin-top: -38px;margin-left: -80px;" :src="punch.twMap" >
                    </div>
                    
                    <div class="signIn-yuanbottom-detail signIn-yuanbottom-detailx" style="width: 60%;    padding: 10px 0 0 6px;">
                        <p class="punch-success-time" v-text="(updatePunchCard.startWork===0)?('上班时间： '+punchTime(punch.twTime)):('下班时间： '+punchTime(punch.owTime))" style="font-size:10px;line-height: 16px;text-align: left;" ></p>
                      <p style="text-align: left;">
                          <!-- <i class="icon_bg_signInImg bg-ico_location_1 mr5" style="font-size:8px;"></i> -->
                          <span style="font-size:10px;"
                          class="signIn-article_location"
                          v-text="'地理位置： '+ (punch.twLocation ? (punch.twLocation+'附近') : '')"
                          ></span>
                      </p>
                    </div>
                  </div>

                  <div class="fenge-line"></div>

                <div class="amap-head" style="display:block;" v-if="punchCardInfo.locations.length && !failModel && !wifiPopup">
                  
                  <div style="display:flex;justify-content: space-between;">
                    <div style="display:flex;align-items:center;">
                      <span class="amap-headxinbiaoji" style="height:20px;"></span>
                      <span class="amap-head-xinbt" style="margin-top:1px;">新打卡记录</span>
                    </div>
                    <!-- <span v-if="!isOutside" class="amap-headLeft" :class="outsideObtainValue?'amap-headLeft1':''" v-text="outsideObtainValue?'区域外':'区域内'" ></span> -->
                    
                  </div>
                  <div style="display:flex;justify-content: space-between;margin-top: 5px;">
                    <div class="amap-headRight amap-headRightx" v-text="punTime" style="margin-left:10px;"></div>
                    <div
                      v-if="!isOutside"
                      class="amap-headLeft"
                      :class="outsideObtainValue?'amap-headLeft1':''"
                      v-text="outsideObtainValue?'区域外':'区域内'"
                      style="text-align: right;margin-right: 5px;"
                    ></div>
                  </div>
                  
                </div>
                <!-- <pre>{{isOutside}}</pre> -->
                <div id="amap-box" style="padding:0;" v-if="punchCardInfo.locations.length && !failModel && !wifiPopup">
                  <!--<div id="amapContainer"></div>-->
                  <div class="amapImgkuang">
                    <img style="margin-top: -20px;" :src="amapImg" alt />
                  </div>
                </div>
                <div class="amap-detailkuang">
                  <i class="icon_bg_signInImg bg-ico_location_1 mr5"></i>
                  <span style="font-size:12px;" class="amap-detail" id="amap-detail" v-text="'地理位置： '+twRange"> </span>
                </div>
                <!-- <div class="signIn-title" style="margin-top:20px;">新打卡记录：</div>
                <div v-if="punchCardInfo.locations.length && !failModel && !wifiPopup">
                  <div class="signIn-yuanbottom">
                    <div align="left">
                      <img class="signIn-img_map" :src="amapImg" />
                    </div>
                    <div class="signIn-yuanbottom-detail">
                      <p
                        class="punch-success-time"
                        v-text="(updatePunchCard.startWork===0)?('上班时间：'+punTime):('下班时间：'+punTime)"
                        style="font-size:12px;"
                      ></p>
                      <p>
                        <i class="icon_bg_signInImg bg-ico_location_1 mr5" style="font-size:12px;"></i>
                        <span style="font-size:12px;"
                        class="signIn-article_location"
                        id="amap-detail" 
                        v-text="'地理位置： '+ twRange"
                        ></span>
                      </p>
                    </div>
                  </div>
                </div> -->
                <div class="getLocation-alert-btnBox" style="padding: 8px 0;">
                  <p
                    @click="closeAlert"
                    class="getLocation-alert-btn"
                    :class="(punchCardInfo.locations.length && !failModel) ? 'getLocation-alert-btnLeft' :  'getLocation-alert-btnColor getLocation-alert-btnCenter'"
                    v-text="(punchCardInfo.locations.length && !failModel) ? '取消' : '确定'"
                  ></p>
                  <p
                    v-if="punchCardInfo.locations.length && !failModel && !wifiPopup"
                    @click="determinePunchCard"
                    class="getLocation-alert-btn getLocation-alert-btnRight"
                  >替换</p>
                  <p
                    v-if="wifiPopup"
                    @click="okClickWifi"
                    class="getLocation-alert-btn getLocation-alert-btnRight"
                  >确定</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="amap-head-wku" v-if="updatePunchCard.updateState===false">
          <div class="amap-head" v-if="punchCardInfo.locations.length && !failModel && !wifiPopup">
            <span
              v-if="!isOutside"
              class="amap-headLeft amap-headLeft2"
              :class="outsideObtainValue?'amap-headLeft1 amap-headLeft3':''"
              v-text="outsideObtainValue?'区域外':'区域内'"
            ></span>
            <span style="margin-top: 2px;" class="amap-headRight" v-text="punTime"></span>
          </div>
          <!-- <pre>{{isOutside}}</pre> -->
          <div style="padding:0;" id="amap-box" v-if="punchCardInfo.locations.length && !failModel && !wifiPopup">
            <!--<div id="amapContainer"></div>-->
            <div class="amapImg-waikuang">
              <img style="margin-top: -20px;" :src="amapImg" alt />
            </div>
            <!-- <img :src="amapImg" alt /> -->
            <p class="amap-detail" id="amap-detail" v-text="twRange"></p>
          </div>
          <div class="getLocation-alert-btnBox" style="padding:8px 0;">
            <p 
              @click="closeAlert"
              class="getLocation-alert-btn"
              :class="(punchCardInfo.locations.length && !failModel) ? 'getLocation-alert-btnLeft' :  'getLocation-alert-btnColor getLocation-alert-btnCenter'"
              v-text="(punchCardInfo.locations.length && !failModel) ? '取消' : '确定'"
            ></p>
            <p
              v-if="punchCardInfo.locations.length && !failModel && !wifiPopup"
              @click="determinePunchCard"
              class="getLocation-alert-btn getLocation-alert-btnRight"
            >确定打卡</p>
            <p
              v-if="wifiPopup"
              @click="okClickWifi"
              class="getLocation-alert-btn getLocation-alert-btnRight"
            >确定</p>
          </div>
        </div>
      </mt-popup>
    </div>
    
    <!--打卡成功弹窗-->
    <mt-popup v-model="popupVisible" class="punch-success-wrapper" :closeOnClickModal="false">
      <div class="punch-success-box" v-if="popupVisible">
        <div class="punch-success-header">
          <div class="punch-success-headerLeft"></div>
          <p class="punch-success-headerCenter">打卡成功</p>
          <div class="punch-success-headerRight"></div>
        </div>
        <div class="punch-success-content">
          <div class="punch-success-img">
            <img :src="imgSrc.alertHeader" />
          </div>
          <div v-if="updatePunchCard.updateState">
            <p
              class="punch-success-time"
              v-text="(updatePunchCard.startWork===0)?('上班 '+' '+punchTime(punchCardSuccess.punchCardLogs.twTime)):('下班 '+' '+punchTime(punchCardSuccess.punchCardLogs.owTime))"
            ></p>
            <div
              class="punch-success-tab"
              v-if="updatePunchCard.updateState && updatePunchCard.startWork===0"
            >
              <mt-button
                type="default"
                class="punch-success-tabHeight article-tab-zc"
                v-if="punchCardSuccess.punchCardLogs.twStatus===0"
              >
                <span>打卡正常</span>
              </mt-button>
              <mt-button
                type="default"
                class="punch-success-tabHeight article-tab-cd"
                v-if="punchCardSuccess.punchCardLogs.twStatus===1"
              >
                <span>您迟到了</span>
              </mt-button>
              <mt-button
                type="default"
                class="punch-success-tabHeight article-tab-kg"
                v-if="punchCardSuccess.punchCardLogs.twStatus===2"
              >
                <span>旷工打卡</span>
              </mt-button>
              <mt-button
                type="default"
                class="punch-success-tabHeight article-tab-qyw"
                v-if="punchCardSuccess.punchCardLogs.twOutside"
              >
                <span>区域外</span>
              </mt-button>
            </div>
            <div class="punch-success-tab" v-else>
              <mt-button
                type="default"
                class="punch-success-tabHeight article-tab-zc"
                v-if="punchCardSuccess.punchCardLogs.owStatus===0 || punchCardSuccess.punchCardLogs.owStatus===2"
              >
                <span>打卡正常</span>
              </mt-button>
              <mt-button
                type="default"
                class="punch-success-tabHeight article-tab-kg"
                v-if="punchCardSuccess.punchCardLogs.owStatus===3"
              >
                <span>旷工打卡</span>
              </mt-button>
              <mt-button
                type="default"
                class="punch-success-tabHeight article-tab-zt"
                v-if="punchCardSuccess.punchCardLogs.owStatus===1"
              >
                <span>早退</span>
              </mt-button>
              <mt-button
                type="default"
                class="punch-success-tabHeight article-tab-qyw"
                v-if="punchCardSuccess.punchCardLogs.owOutside"
              >
                <span>区域外</span>
              </mt-button>
            </div>
          </div>
          <div v-else>
            <p
              class="punch-success-time"
              v-text="(punchCardInfo.status===false || punchCardInfo.attendRuleUid === '3')?('上班 '+' '+punchTime(punchCardSuccess.punchCardLogs.twTime)):('下班 '+' '+punchTime(punchCardSuccess.punchCardLogs.owTime))"
            ></p>
            <div
              class="punch-success-tab"
              v-if="punchCardInfo.status===false|| punchCardInfo.attendRuleUid === '3'"
            >
              <mt-button
                type="default"
                class="punch-success-tabHeight article-tab-zc"
                v-if="punchCardSuccess.punchCardLogs.twStatus===0"
              >
                <span>打卡正常</span>
              </mt-button>
              <mt-button
                type="default"
                class="punch-success-tabHeight article-tab-cd"
                v-if="punchCardSuccess.punchCardLogs.twStatus===1"
              >
                <span>您迟到了</span>
              </mt-button>
              <mt-button
                type="default"
                class="punch-success-tabHeight article-tab-kg"
                v-if="punchCardSuccess.punchCardLogs.twStatus===2"
              >
                <span>旷工打卡</span>
              </mt-button>
              <mt-button
                type="default"
                class="punch-success-tabHeight article-tab-qyw"
                v-if="punchCardSuccess.punchCardLogs.twOutside"
              >
                <span>区域外</span>
              </mt-button>
            </div>
            <div class="punch-success-tab" v-else>
              <mt-button
                type="default"
                class="punch-success-tabHeight article-tab-zc"
                v-if="punchCardSuccess.punchCardLogs.owStatus===0 || punchCardSuccess.punchCardLogs.owStatus===2"
              >
                <span>打卡正常</span>
              </mt-button>
              <mt-button
                type="default"
                class="punch-success-tabHeight article-tab-kg"
                v-if="punchCardSuccess.punchCardLogs.owStatus===3"
              >
                <span>旷工打卡</span>
              </mt-button>
              <mt-button
                type="default"
                class="punch-success-tabHeight article-tab-zt"
                v-if="punchCardSuccess.punchCardLogs.owStatus===1"
              >
                <span>早退</span>
              </mt-button>
              <mt-button
                type="default"
                class="punch-success-tabHeight article-tab-qyw"
                v-if="punchCardSuccess.punchCardLogs.owOutside"
              >
                <span>区域外</span>
              </mt-button>
            </div>
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
import { Toast } from 'mint-ui';
import { MessageBox, Popup } from "mint-ui";
import moment from "moment";
import html2canvas from "html2canvas";
import MtButton from "../../../node_modules/mint-ui/packages/button/src/button";
import swiper from "./posterSwiper";
import Vue from 'vue'


let df = "HH:mm:ss";
let df1 = "YYYY年MM月DD日";
let df2 = "YYYY-MM-DD HH:mm:ss";
let df3 = "YYYY-MM-DD HH:mm";
export default {
  components: { MtButton,swiper },
  data() {
    
    // const handler = function(e) {
    //     e.preventDefault();
    // }
    return {
      handler: function(e){
        e.preventDefault()
      },
      posterList: [],
      kejian:false,
      updatePunchCard: {
        //更新打卡信息记录
        updateState: false, //判断是否更新打卡
        punchCardUid: "", //更新打卡的数据id
        startWork: null //更新打卡的上下班场次,0上班1下班
      },
      punchCardInfo: {
        //获取打卡信息记录
        locations: [],
        punchCardLogs: []
      },
      punchCardSuccess: {}, // 打卡成功
      showBtnContent: false, // 显示打卡按钮，是否是正在获取地理位置
      qulocation: false, //获取位置弹框
      failModel: false, // 判断是否开启定位功能或者是否成功获取地理位置弹框是否开启
      failModelErr: false, // 判断是未开启定位功能或者还是未成功获取地理位置
      wifiPopup: false, // 获取wifi弹框内容
      popupVisible: false, //打卡成功弹出的模态框显示状态
      wifiIP: "", // wifiIP地址
      objNr: {}, // 员工姓名和所在部门
      date: moment(new Date()).format(df1), //右上角日期
      time: "00:00:00", // 打卡按钮上的时间
      punchDateTime: new Date(), //打卡时间
      punTime: moment(new Date()).format(df3), //地图弹框中的时间
      imgSrc: {
        header: require("../../assets/tx.png"), // 员工头像
        alertHeader: require("../../assets/pic_check in.png") // 打卡成功弹框中的图标
      },
      outsideObtainValue: false, //获取的经纬度，判断是否区域内，true是区域外，false区域内
      searchLocationArray: [], //查询出来的locations经纬度，来判断是否在考勤地点区域内
      twRange: "", //记录打卡时，所在的地址
      showHide: false, //是否显示全部打卡信息
      amapImg: "", //地图截图
      isOutside: false
    };
  },
  watch: {
    qulocation(value) {
      if(value) {
        this.closeTouch ()
      }else{
        this.openTouch ()
      }
    },
    // qulocation: function (val) {
    //   if(val) {
    //       document.getElementsByTagName('body')[0].addEventListener('touchmove', this.handler, { passive: false });
    //   } else {
    //       document.getElementsByTagName('body')[0].addEventListener('touchmove', this.handler, { passive: false });
    //   }
    // }
  },
  created() {
    this.doSearch(); //初始化页面查询数据
    this.getBannerList()
  },
  methods: {
    closeTouch () {
      document.getElementById("signIn-wrapper").style.height="100%"
      document.getElementById("signIn-wrapper").style.overflow="hidden"
      document.getElementById("signIn-wrapper").style.postion="fixed"
          // document.getElementsByTagName('body')[0].addEventListener('touchmove', this.handler, {passive:false})//阻止默认事件
      },
      openTouch () {
        document.getElementById("signIn-wrapper").style.height=""
        document.getElementById("signIn-wrapper").style.overflow=""
        document.getElementById("signIn-wrapper").style.postion="relative"
          // document.getElementsByTagName('body')[0].removeEventListener('touchmove', this.handler, {passive:false})//打开默认事件
      },
    getBannerList(){
      Vue.http.interceptors.push(function (request, next) {
        request.headers.set('locationUid', '0');
      })
      this.$http.get("/api/v1.0/client/show").then(res => {
        this.posterList = res.body.result;
      });
    },
    //====初始开始====//
    doSearch(state) {
      this.handerSign();
      setInterval(this.handerSign, 1000);
      let imageString = this.getCookie("avatarImages"); //获取缓存的图片
      this.objNr = {
        fetchPostion: this.getCookie("infoObjPassPostion"),
        fetchName: this.getCookie("infoObjPassName")
      };
      if (imageString) {
        this.imgSrc.header = imageString;
      }
      this.$http.post("/api/v1.0/client/findPunchCardLog").then(
        response => {
          //查询是否有打卡
          if (response.body.code === 200) {
            this.punchCardInfo = response.body.result;
            if (this.punchCardInfo.attendRuleUid === "4") {
              MessageBox("提示", "当前考勤不需要打卡");
              this.$router.push({ path: "/signCard" });
            }
            this.isOutside = response.body.result.isOutside;
            if (state) {
              this.punchCardSuccess = JSON.parse(
                JSON.stringify(this.punchCardInfo)
              );
              if (this.updatePunchCard.updateState) {
                for (
                  let i = 0;
                  i < this.punchCardInfo.punchCardLogs.length;
                  i++
                ) {
                  if (
                    this.updatePunchCard.punchCardUid ===
                    this.punchCardInfo.punchCardLogs[i].uid
                  ) {
                    this.punchCardSuccess.punchCardLogs = this.punchCardInfo.punchCardLogs[
                      i
                    ];
                  }
                }
              } else {
                this.punchCardSuccess.punchCardLogs = this.punchCardInfo
                  .punchCardLogs.length
                  ? this.punchCardInfo.punchCardLogs[
                      this.punchCardInfo.punchCardLogs.length - 1
                    ]
                  : {};
              }
              this.popupVisible = true;
              this.showBtnContent = false;
            }
          } else if (response.body.code === 500) {
            //不能显示打卡功能
            MessageBox("提示", response.body.message);
            if (response.body.message === "当前考勤无需打卡") {
              this.$router.push({ path: "/signCard" });
            }
          }
        },
        response => {
          //          console.log('error callback');
        }
      );
    },
    //====初始结束====//

    // 打卡按钮 格式化时间
    handerSign() {
      this.time = moment(new Date()).format(df);
    },
    // 判断上下班状态
    punchClock(state) {
      return typeof state === "number" && state >= 0;
    },
    //格式化时间
    punchTime(time) {
      return time ? moment(time).format(df3) : "";
    },
    // 是否显示全部打卡信息
    showHides() {
      this.showHide = !this.showHide;
    },
    // 确定打卡
    determinePunchCard() {
      let disTime = new Date().getTime() - this.punchDateTime.getTime();
      if (disTime < 5 * 60 * 1000) {
        this.qulocation = false;
        this.punchInfo();
      } else {
        this.showBtnContent = false;
        this.qulocation = false;
        MessageBox("提示", "打卡信息已失效，请重新打卡");
      }
    },
    //更新打卡
    updatePunch(data) {
      this.kejian=true
      this.updatePunchCard.updateState = true;
      this.updatePunchCard.punchCardUid = data.punchCardUid;
      this.updatePunchCard.startWork = data.startWork;
      this.handerClickEvent();
    },
    //打卡开始
    handerClickEvent() {
      //打卡按钮   上班或下班
      this.kejian=true
      if (navigator.onLine) {
        //正常工作
        this.wifiPopup = false;
        if (this.punchCardInfo.isWifi) {
          const $scripts = document.createElement("script");
          window.document.body.appendChild($scripts);
          $scripts.src = "https://pv.sohu.com/cityjson?ie=utf-8"; //获取IP
          this.wifiPopup = true; // 获取wifi弹框内容
          this.wifiIP = "";
          this.qulocation = true;
        } else {
          this.okClickEvent();
        }
        this.punchDateTime = new Date();
        this.punTime = moment(this.punchDateTime).format(df3); //地图弹框中的时间
      } else {
        //执行离线状态时的任务
        MessageBox("提示", "未连接网络");
      }
    },
    //取消弹框按钮
    closeAlert() {
      this.kejian=false
      // let instance = Toast('加载中');
      //打卡获取地理位置alert
      this.showBtnContent = false;
      this.qulocation = false;
      
      // 加定时器是因为弹框不能立即消失，状态值改变，里面的内容会乱，加个定时器延迟其他状态值改变
      setTimeout(() => {
        this.kejian=false
        this.failModel = false;
        this.wifiPopup = false;
        this.updatePunchCard.updateState = false;
        // instance.close();
      }, 300);
    },
    //我知道了按钮
    knowFunction() {
      this.popupVisible = false;
      this.qulocation = false;
      this.updatePunchCard.updateState = false; //更新打卡状态
    },
    //提交申请跳转路由开始
    submitApplyRouter(type) {
      this.setCookie("leaveType", type, 365);
      this.$router.push({ path: "/leave" });
    },
    //获取wifi地址
    okClickWifi() {
      if (!returnCitySN) {
        returnCitySN = {};
      }
      if (returnCitySN["cip"]) {
        //获取IP
        this.wifiIP = returnCitySN["cip"];
        this.qulocation = false;
        // 加定时器是因为弹框不能立即消失，状态值改变，里面的内容会乱，加个定时器延迟其他状态值改变
        setTimeout(() => {
          this.wifiPopup = false;
        }, 300);
        this.okClickEvent();
      } else {
        this.qulocation = false;
        MessageBox("提示", "获取IP地址失败");
      }
    },
    // 获取位置信息
    okClickEvent() {
      this.showBtnContent = true;
      let self = this;
      let curl;
      //判断是不是安卓苹果
      let u = navigator.userAgent;
      let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
      if (isAndroid) {
        curl = {
          location: location.href //安卓的参数
        };
      }
      if (!isAndroid) {
        curl = {
          location: location.href.toString().split("#")[0] //苹果的参数
        };
      }

      //判断结束
      this.$http.post("/api/v1.0/wechat/sign", curl).then(
        response => {
          //获取签名接口开始
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
              jsApiList: ["getLocation"]
            });
            wx.error(function(res) {
              // 微信获取经纬度失败
              self.failModelErr = true;
              self.failModel = true;
              self.qulocation = true;
              self.showBtnContent = false;
            });
            wx.ready(function() {
              wx.getLocation({
                type: "gcj02",
                success: function(res) {
                  self.getLocations = false;
                  self.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90           res.latitude;
                  self.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。     res.longitude;  //这个是原有
                  let lnglat = [res.longitude, res.latitude]; //当前位置经纬度
                  // 获取当前地理位置详情
                  let geocoder = new AMap.Geocoder();
                  geocoder.getAddress(lnglat, function(status, result) {
                    if (status === "complete" && result.info === "OK") {
                      self.twRange = result.regeocode.formattedAddress;
                      if (self.twRange) {
                        self.qulocation = true;
                      } else {
                        self.showBtnContent = false;
                        MessageBox("提示", "获取地理位置失败");
                      }
                    } else {
                      self.twRange = "";
                      self.showBtnContent = false;
                      MessageBox("提示", "获取地理位置失败");
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
                  let url =
                    "http://restapi.amap.com/v3/staticmap?location=" +
                    lnglat[0] +
                    "," +
                    lnglat[1] +
                    "&zoom=16&size=240*180&markers=small,0xFF0000,:" +
                    lnglat[0] +
                    "," +
                    lnglat[1] +
                    "&key=79772b4966abdb3838a61e903d9d30e6";
                  getUrlBase64(url, "png", base64 => {
                    self.amapImg = base64;
                  });
                  //传入图片路径，返回base64
                  function getUrlBase64(url, ext, callback) {
                    let canvas = document.createElement("canvas"); //创建canvas DOM元素
                    let ctx = canvas.getContext("2d");
                    let img = new Image();
                    img.crossOrigin = "Anonymous";
                    img.src = url;
                    img.onload = function() {
                      canvas.height = 160; //指定画板的高度,自定义
                      canvas.width = 240; //指定画板的宽度，自定义
                      ctx.drawImage(img, 0, 0, 240, 160, 0, 0, 240, 160); //参数可自定义
                      let dataURL = canvas.toDataURL("image/" + ext);
                      callback.call(this, dataURL); //回掉函数获取Base64编码
                      canvas = null;
                    };
                  }

                  let scopes = []; //考勤地点区域内半径
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
                  self.outsideObtainValue = true; // 初始值为true,区域外
                  // 判断是否在区域内
                  for (let i = 0; i < self.searchLocationArray.length; i++) {
                    let dis = AMap.GeometryUtil.distance(
                      lnglat,
                      self.searchLocationArray[i]
                    );
                    if (dis < scopes[i]) {
                      self.outsideObtainValue = false;
                      break;
                    }
                  }
                },
                cancel: function(res) {
                  //判断是不是安卓苹果
                  let u = navigator.userAgent;
                  let isAndroid =
                    u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
                  self.showBtnContent = false;
                  if (isAndroid) {
                    MessageBox(
                      "提示",
                      "您拒绝了获取定位请求，只有允许才能进行打卡"
                    );
                  }
                  if (!isAndroid) {
                    MessageBox("提示", "请开启微信定位服务");
                  }
                  //判断结束
                },
                fail: function(res) {
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
            MessageBox("提示", response.body.message);
          }
        },
        response => {
          //            console.log('error callback');
        }
      );
      //点击获取定位结束
    },
    //上传打卡信息
    punchInfo() {
      let updakaObj = {
        isRange: this.isOutside ? false : this.outsideObtainValue,
        location: this.twRange,
        longitude: this.longitude,
        latitude: this.latitude,
        wifi: this.wifiIP,
        map: this.amapImg.split(",")[1]
      };
      let url = "/api/v1.0/client/punchCardLog";
      if (this.updatePunchCard.updateState) {
        url = "/api/v1.0/client/updatePunchCardLog";
        updakaObj.punchCardUid = this.updatePunchCard.punchCardUid;
        updakaObj.startWork = this.updatePunchCard.startWork;
      }
      this.$http.post(url, updakaObj).then(
        response => {
          //打卡
          if (response.body.code === 200) {
            this.doSearch(true);
          } else if (response.body.code === 500) {
            MessageBox("提示", response.body.message);
          }
        },
        response => {}
      );
    }
  }
};
</script>

<style lang="scss">
// body {
//     position: fixed; 
//     left: 0;
//     top: 0;
//   }
.amapImg-waikuang{
  width:100%;
  height:100px;
  overflow: hidden;
  margin:8px 0px;
}
.amap-head-wku{
  padding: 0 20px;
  max-width:240px;
}
.mapkuang{
  width:100%;
  height:100px;
  overflow: hidden;
  margin:8px 0px;
}
.fenge-line{
  width:100%;
  height:1px;
  background:#eee;
  margin:8px 0;
}
.amap-head-xinbt{
  margin-left: 5px;
  font-size: 15px;
  width: 75px;
}
.amap-headxinbiaoji{
  width:5px;
  height:16px;
  background:#20A0FF;
  margin-top:2px;
}
.amapImgkuang{
  width:100%;
  height:100px;
  overflow: hidden;
  margin:8px 0px;
}
.amap-detailkuang{
  color: #2c3e50;
  width:100%;
  text-align:left;
}
.changeyuantitle{
  display:flex;
  justify-content: space-between;
  .changeyuantitle-bj{
    width:5px;
    height:16px;
    background:#20A0FF;
    margin-top:2px;
  }
}
.signIn-title{
    font-size: 15px;
    color: #2c3e50;
    text-align: left;
    margin-left: 5px;
    // font-weight: bold;
}
.signIn-yuanbottom{
  margin-left:10px;
  margin-top:6px;
  width:100%;
  height:100px;
  display: flex;
  
  .signIn-img_map{
    width:100px;
    height:100%;
  }
  .signIn-yuanbottom-detail{
    word-wrap: break-word;
    word-break: normal;
    text-align: left;
    margin-left: 5px;
  }
  .signIn-yuanbottom-detailx{
    color: #2c3e50;
    width:100%;
    text-align:left;
  }
}

#signIn-wrapper {
  position: relative;
  width: 100%;
  min-height: 100%;
  background-color: #ffffff;
  .clearFix {
    &:before {
      content: "";
      display: table;
    }
    &:after {
      content: "";
      display: table;
      clear: both;
      overflow: hidden;
      *zoom: 1;
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
    // position: fixed;
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
    // padding-top: 100px;
    height: 120px;
    overflow-y: hidden;
    .signIn-article {
      position: relative;
      box-sizing: border-box;
      width: 100%;
      margin-bottom: 20px;
      .signIn-article-right {
        text-align: left;
        box-sizing: border-box;
        padding: 0 15px 0 25px;
        .signIn-article-top,
        .signIn-article-bottom {
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
            .article-tab-kg,
            .article-tab-zt {
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
            .article-tab-sq,
            .article-tab-wdk,
            .article-tab-jbsq {
              background-color: #20a2ff;
            }
            .article-tab-sx {
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
    .signIn-article:last-child {
      margin-bottom: 50px;
    }
    .signIn_mask {
      position: absolute;
      width: 100%;
      height: 50px;
      bottom: 0;
      background-image: linear-gradient(
        rgba(255, 255, 255, 0),
        rgba(255, 255, 255, 1)
      );
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
    margin-top: 10px;
  }
  .Punch-btn-wrapper {
    position: absolute;
    top: 350px;
    box-sizing: border-box;
    width: 100%;
    background-color: #ffffff;
    .Punch-btn-bg {
      margin: 0 auto;
      width: 250px;
      height: 250px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
    .Punch-btn-bg0 {
      background-image: url("../../assets/0_gif.gif");
    }
    .Punch-btn-bg1 {
      background-image: url("../../assets/0_gif1.gif");
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
  .getLocation-alert-wrapper1 {
    width: 276px;
    background-color: #ffffff;
    border-radius: 4px;
    padding-bottom: 18px;
    max-height: 500px;
    overflow-y: auto;
    margin-top: 35px;
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
      justify-content: space-between;
    }
    .amap-headLeft {
        width: 100px;
        text-align: left;
        // border-left: 15px solid #2bcebd;
        font-size: 16px;
        // padding-left: 5px;
        // margin-left: 15px;
        color: #2bcebd;
      }
      .amap-headLeft1 {
        // border-left: 15px solid #ff4947;
        color: #ff4947;
      }
      .amap-headLeft2{
        border-left: 5px solid #2bcebd;
        text-indent: 5px;
      }
      .amap-headLeft3{
        border-left: 5px solid #ff4947;
      }
      .amap-headRight {
        font-size: 15px;
        color: #2c3e50;
      }
      .amap-headRightx{
        margin-top: 2px;
      }
    #amap-box {
      padding: 10px 25px;
      padding-bottom: 0;
      #amapContainer {
        width: 100%;
        height: 160px;
        border: #ccc solid 1px;
        box-sizing: border-box;
        .amap-logo,
        .amap-copyright {
          display: none !important;
        }
      }
      .amap-detail {
        padding-top:  10px ;
        text-align: left;
        font-size: 14px;
        color: #333;
      }
    }
    .getLocation-alert-btnBox {
      overflow: hidden;
      padding: 15px 22px 0;
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
          font-size: 14px;
          height: 16px;
          line-height: 16px;
          color: #1f2d3d;
          padding-bottom: 10px;
        }
        .punch-success-timex{
          font-size:14px;
          line-height: 14px;
          margin-top:2px;
        }
        .punch-success-tab {
          .punch-success-tabHeight {
            height: 22px;
            font-size: 12px;
            color: #ffffff;
          }
          .article-tab-kg,
          .article-tab-zt {
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
          .article-tab-sq,
          .article-tab-wdk {
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
