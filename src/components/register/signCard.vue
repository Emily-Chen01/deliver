<template>
  <div v-if="state">
    <div v-if="toolState">
      <!--头部-->
      <div class="bg">
        <div style="padding-top: 1rem;color:#ffffff;padding-left: 1rem; overflow: hidden">
          <div class="siginLeft">
            <div class="avatarBorder">
              <img :src="imgSrc.comAddress" class="avatarTop">
            </div>
          </div>
          <div class="siginRight" style="position: relative;">
            <div>
              <div class="signTitle" style="padding-right: 66px;box-sizing: border-box">{{oneselfData.name}}</div>
              <div class="signName"><span>{{infoObj.deptName}}</span> <span>{{infoObj.position}}</span></div>
              <div
                style="border-bottom-left-radius: 1.5rem;border-top-left-radius: 1.5rem; position: absolute;width: 4.4rem;height: 2rem; background: rgb(26,128,203); top:0;right: -0.5rem;"
                @click="routerMyData">
                <div style="display: block;width: 13px;height: 13px;">
                  <img style="display: block;width: 100%;height: 100%;padding-top: 0.5rem;padding-left: 0.5rem;"
                       :src="imgSrc.shezhiBackground"/>
                </div>
                <div style="font-size: 0.8rem;top: 0.43rem; position: absolute;right: 0.8rem;z-index: 10">设置</div>
              </div>
            </div>
            <div class="companyNameClass">{{infoObj.companyName}}</div>
          </div>
        </div>
        <div style="padding: 0 0.8rem 2rem 0.8rem;position: relative" v-if="punchCard">
          <mt-button
            type="primary"
            style="background-color: #57b9ff;width: 97%;"
            @click="handerSign"
          >
            <img :src="imgSrc.ico_pencil" style="width:12px;height: 12px;" class="imgSizePencil">
            <span>签到打卡</span>
          </mt-button>
        </div>
      </div>
      <!--中间选项列表-->
      <div style="margin-top: 1rem;border-bottom: 1px solid #d9d9d9">
        <div @click="changeList(0)">
          <mt-cell title="请假申请" is-link>
            <span>{{recordShow.apply}}</span>
            <img slot="icon" :src="imgSrc.ico_leave" class="ImgIcon">
          </mt-cell>
        </div>
        <div @click="changeList(1)">
          <mt-cell title="我的考勤" is-link>
            <span>{{recordShow.punchCard}}</span>
            <img slot="icon" :src="imgSrc.ico_attendance" class="ImgIcon">
          </mt-cell>
        </div>
        <div @click="changeList(2)">
          <mt-cell title="我的工资条" is-link>
            <span>{{recordShow.salary}}</span>
            <img slot="icon" :src="imgSrc.ico_wage" class="ImgIcon">
          </mt-cell>
        </div>
      </div>
    </div>
    <div v-if="!toolState" id="Binding-wrapper">
      <div class="binding-box">
        <div class="headerImg-wrapper">
          <div class="headerImg-box">
            <img :src="imgSrc.comAddress" class="avatarTop">
          </div>
        </div>
        <mt-button type="primary" size="large" class="Binding-btn" @click.native="handerUnbundling">解除绑定</mt-button>
        <div class="Binding-hotLine">客服热线 ：0512-88998989</div>
      </div>
    </div>
    <!--底部工具-->
    <mt-tabbar v-model="select">
      <mt-tab-item id="1">
        <img slot="icon" :src="imgSrc.doIconBlue" class="avatar" v-if="toolState">
        <img slot="icon" :src="imgSrc.doIcon" class="avatar" v-if="!toolState">
        <span>工作台</span>
      </mt-tab-item>
      <mt-tab-item id="2">
        <img slot="icon" :src="imgSrc.setIconBlue" class="avatar" v-if="!toolState">
        <img slot="icon" :src="imgSrc.setIcon" class="avatar" v-if="toolState">
        <span>设置</span>
      </mt-tab-item>
    </mt-tabbar>
    <!--<div class="bottomTool">-->
    <!--<div style="position: relative">-->
    <!--<div style="width: 50%;float: left;-webkit-tap-highlight-color: rgba(0, 0, 0, 0);" @click="routerTool(1)">-->
    <!--<div style="height: 20px;width: 20px; text-align: center; margin: auto;padding-top: 1rem;">-->
    <!--<img :src="imgSrc.doIconBlue" class="avatar" v-if="initBlue">-->
    <!--<img :src="imgSrc.doIcon" class="avatar" v-if="init">-->
    <!--</div>-->
    <!--<div style="height: 1.5rem;padding-top: 0.5rem;" v-if="init">工作台</div>-->
    <!--<div style="height: 1.5rem;padding-top: 0.5rem;color:#20a0ff" v-if="initBlue">工作台</div>-->
    <!--</div>-->
    <!--<div style="width: 50%;float: right;-webkit-tap-highlight-color: rgba(0, 0, 0, 0);" @click="routerTool(2)">-->
    <!--<div style="height: 20px;width: 20px;text-align: center; margin: auto;padding-top: 1rem;">-->
    <!--<img :src="imgSrc.setIconBlue" class="avatar" v-if="initBlueSet">-->
    <!--<img :src="imgSrc.setIcon" class="avatar" v-if="initSet">-->
    <!--</div>-->
    <!--<div style="height: 1.5rem;padding-top: 0.5rem;" v-if="initSet">设置</div>-->
    <!--<div style="height: 1.5rem;padding-top: 0.5rem;color:#20a0ff" v-if="initBlueSet">设置</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->
    <mt-popup
      v-model="isVisible"
      class="imageClassSuccess"
      closeOnClickModal="true"
    >
      <div style="clear:both;"></div>
      <div
        style="width: 16rem;height: 1.8rem;line-height:1.8rem;text-align: center; margin-top: 2rem;font-size: 1.1rem;">
        <span>审批功能已经被关闭了</span>
      </div>
      <div @click="closeAlertFail" class="colseClassAlertFail">
        <span>确定</span>
      </div>
    </mt-popup>
  </div>
</template>
<script>
  //  import {Navbar, TabItem, Toast, MessageBox, Popup} from 'mint-ui';
  import Vue from 'vue'
  import {Indicator, Popup, Cell} from 'mint-ui';
  import {Tabbar, TabItem} from 'mint-ui';
  Vue.component(Tabbar.name, Tabbar);
  Vue.component(TabItem.name, TabItem);

  export default {
    data(){
      return {
        toolState: true,
        select: '1',
        state: false,
        isVisible: false,
        closeOnClickModal: true,
        punchCard: false, // 判断是否需要打卡
        oneselfData: {
          companyNmae: '',
          department: '',
          position: '',
          name: '',
        },
        infoObj: {},
        arryOneself: [],
        imgSrc: {
          comAddress: require('../../assets/tx.png'),
          shezhiBackground: require('../../assets/ico_setting.png'),
          ico_leave: require('../../assets/ico_leave.png'),
          ico_attendance: require('../../assets/ico_attendance.png'),
          ico_wage: require('../../assets/ico_wage.png'),
          doIcon: require('../../assets/ico_workbench_2.png'),
          doIconBlue: require('../../assets/ico_workbench_1.png'),
          setIconBlue: require('../../assets/ico_setting_1.png'),
          setIcon: require('../../assets/ico_setting_2.png'),
          ico_pencil: require('../../assets/ico_pencil.png'),
        },
        recordShow: {},
        init: '',
        initBlue: '',
        initBlueSet: '',
        initSet: '',

      }
    },
    watch: {
      select: function (val, oldVal) {
        if (val === '1') {
          this.toolState = true;
        } else if (val === '2') {
          this.toolState = false;
        }
      },
      holidayModel: function (val, oldVal) { //备注value 用于上传参数
        this.textareaString = val.trim();
      },
    },
    created: function () {
      this.state = false;
      Indicator.open('正在加载...');
      //设置的切换start
      this.init = false;
      this.initBlue = true;
      this.initBlueSet = false;
      this.initSet = true;


      this.$http.get('/api/v1.0/client/status').then(response => {
        console.log(response.body.result);
        this.recordShow = response.body.result;
      }, response => {
        console.log('error callback');
      });
      this.searchStaff();
    },
    methods: {
      handerSign(){
        this.$router.push({path: '/signIn'}); //进入打卡页
      },
      searchStaff(){
        this.$http.post('/api/v1.0/client/findStaff').then(response => {
          if (response.body.code === 200) {
            if (response.body.result) {
              console.log('response.body.result', response.body.result);
              this.punchCard = response.body.result.punchCard;
              this.arryOneself.push(response.body.result);
              this.infoObj = response.body.result.record;
              for (let i = 0; i < this.arryOneself.length; i++) {
                this.oneselfData = {
                  name: this.arryOneself[i].name,
                };
                this.setCookie('infoObjPassPostion', this.infoObj.deptName, 365);
                this.setCookie('infoObjPassName', this.oneselfData.name, 365);
                if (this.arryOneself[i].staffPhoUrl) {
                  this.imgSrc.comAddress = this.arryOneself[i].staffPhoUrl;
                  this.setCookie('avatarImages', this.imgSrc.comAddress, 365);
                } else {
                  this.setCookie('avatarImages', '', 365);
                }
              }
              this.state = true;
              Indicator.close();//关闭加载中
            }
          }
        }, response => {
          console.log('error callback');
        });
      },
      changeList(indexX){
        if (indexX == 0) {
          this.$http.get('/api/v1.0/client/findValidConfigs').then(response => { //查询申请类型列表
            console.log(response.body.result.length, 'res');
            if (response.body.result.length == 0) { //此处设置的是在pc端关闭了考勤给出提示关闭了
              this.isVisible = true;
            } else {
              this.setCookie('leaveType', indexX, 365);
              this.$router.push({path: '/leave'});
            }
          }, response => {
            console.log('error callback');
          });
        } else if (indexX == 1) {
          this.$router.push({path: '/attendanceRecord'});

        } else if (indexX == 2) {
          this.$router.push({path: '/mySalary'});
        }

      },
      routerMyData(){
        this.$router.push({path: '/MyData'});
      },
      routerTool(number){
        if (number == 1) {
          this.$router.push({path: '/signCard'});
        }
        if (number == 2) {
          this.$router.push({path: '/set'});
        }
      },
      closeAlertFail(){
        this.isVisible = false;
      },
      // 解除绑定
      handerUnbundling(){
        this.$http.post('/api/v1.0/client/unbind').then(response => {
          console.log('解除绑定');
          this.$router.push({path: '/index'});
        }, response => {
          console.log('error callback');
        });
      },
    },
    components: {}
  }

</script>

<style lang="scss" scoped>
  .imageClassSuccess {
    width: 16rem;
    height: 12rem;
    border-radius: 4px;

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

  .bottomTool {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 5rem;
    background: #ffffff;
  }

  .bg {
    background-image: url("../../assets/bg.png");
    background-repeat: repeat-x;
  }

  .imgSizePencil {
    width: 100%;
    height: 100%;
  }

  .avatarBorder {
    width: 5rem;
    height: 5rem;
    border-radius: 2.6rem;
    text-align: right;
    background: #ffffff;
    border: solid #ffffff 0.15rem;
  }

  .siginLeft {
    width: 21%;
    float: left;
    height: 5.2rem;

  }

  .siginRight {
    padding-left: 0.8rem;
    width: 74%;
    float: left;
    font-size: 1.2rem;
  }

  .avatar {
    width: 100%;
    height: 100%;
    display: block;
    text-align: center !important;
  }

  .avatarTop {
    width: 100%;
    height: 100%;
    display: block;
    text-align: center !important;
    padding: 0;
    border-radius: 4rem;
    z-index: 0;
  }

  .signName {
    text-align: left;
    padding-top: 0.2rem;
  }

  .signTitle {
    text-align: left;
  }

  .companyNameClass {
    text-align: left;
    padding-top: 0.2rem;
    padding-bottom: 0.5rem;
  }

  .ImgIcon {
    margin-right: 8px;
    width: 19px;
    height: 19px;
  }

  .mint-cell:last-child {
    background-size: 100% 1px;
    background-repeat: no-repeat;
    background-position: top;
  }

  #Binding-wrapper {
    width: 100%;
    margin: 0 auto;
    height: 100%;
    background: #fff;
    padding-top: 2rem;
    .binding-box {
      width: 90%;
      margin: 0 auto;
      padding-bottom: 20px;
      .headerImg-wrapper {
        width: 100%;
        height: 8rem;
        padding-top: 2rem;
        .headerImg-box {
          display: inline-block;
          width: 5.2rem;
          height: 5.2rem;
          border-radius: 2.6rem;
        }
      }
      .Binding-btn {
        width: 100%;
      }
      .Binding-hotLine {
        text-align: center;
        margin-top: 2rem;
      }
    }
  }

</style>
