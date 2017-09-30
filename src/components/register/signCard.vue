<template>
  <div v-if="state" id="signCard-wrapper">
    <div v-if="toolState">
      <!--头部-->
      <div id="bg">
        <div class="header-top">
          <div class="header-top-left">
            <img :src="imgSrc.comAddress">
          </div>
          <div class="header-top-center">
            <p v-text="arryOneself.name"></p>
            <p
              v-text="arryOneself.record.deptName+' '+arryOneself.record.position"></p>
            <p v-text="arryOneself.record.companyName"></p>
          </div>
          <div class="header-top-right" @click="routerMyData">
            <img :src="imgSrc.shezhiBackground"/>
            <span>设置</span>
          </div>
        </div>
        <div class="header-bottom" v-if="arryOneself.punchCard">
          <mt-button class="hand-btn" @click="handerSign">
            <img :src="imgSrc.ico_pencil">
            <span>签到打卡</span>
          </mt-button>
        </div>
      </div>
      <!--中间选项列表-->
      <div id="record-list-wrapper">
        <div @click="changeList(0)">
          <mt-cell title="请假申请" is-link>
            <span v-text="recordShow.apply ? recordShow.apply : '当前无申请记录'">{{}}</span>
            <img slot="icon" :src="imgSrc.ico_leave" class="ImgIcon">
          </mt-cell>
        </div>
        <div @click="changeList(1)">
          <mt-cell title="我的考勤" is-link>
            <span v-text="recordShow.punchCard ? recordShow.punchCard : '本月无考勤异常'">{{}}</span>
            <img slot="icon" :src="imgSrc.ico_attendance" class="ImgIcon">
          </mt-cell>
        </div>
        <div @click="changeList(2)">
          <mt-cell title="我的工资条" is-link>
            <span v-text="recordShow.salary ? recordShow.salary : '当前无工资条记录'">{{}}</span>
            <img slot="icon" :src="imgSrc.ico_wage" class="ImgIcon">
          </mt-cell>
        </div>
      </div>
    </div>
    <!--解除绑定-->
    <div v-if="!toolState" id="Binding-wrapper">
      <div class="binding-box">
        <div class="headerImg-wrapper">
          <div class="headerImg-box">
            <img :src="imgSrc.comAddress">
          </div>
        </div>
        <mt-button type="primary" size="large" class="Binding-btn" @click.native="handerUnbundling">解除绑定</mt-button>
        <div class="Binding-hotLine">客服热线 ：0512-88998989</div>
      </div>
    </div>
    <!--底部工具-->
    <mt-tabbar id="tab-bottom" v-model="select">
      <mt-tab-item id="1">
        <img slot="icon" :src="imgSrc.doIconBlue" v-if="toolState">
        <img slot="icon" :src="imgSrc.doIcon" v-if="!toolState">
        <span>工作台</span>
      </mt-tab-item>
      <mt-tab-item id="2">
        <img slot="icon" :src="imgSrc.setIconBlue" v-if="!toolState">
        <img slot="icon" :src="imgSrc.setIcon" v-if="toolState">
        <span>设置</span>
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>
<script>
  import {Indicator, Popup, Cell, MessageBox, Toast} from 'mint-ui';

  export default {
    data(){
      return {
        toolState: true,
        select: '1',
        state: false,
        arryOneself: {},
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
      }
    },
    watch: {
      select: function (val, oldVal) {
        if (val === '1') {
          this.toolState = true;
        } else if (val === '2') {
          this.toolState = false;
        }
      }
    },
    created: function () {
      this.state = false;
      Indicator.open('正在加载...');

      this.$http.get('/api/v1.0/client/status').then(response => {
        console.log('1', response.body.result);
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
              this.arryOneself = response.body.result;
              this.setCookie('infoObjPassPostion', this.arryOneself.record.deptName, 365);
              this.setCookie('infoObjPassName', this.arryOneself.name, 365);
              if (this.arryOneself.staffPhoUrl) {
                this.imgSrc.comAddress = this.arryOneself.staffPhoUrl;
                this.setCookie('avatarImages', this.imgSrc.comAddress, 365);
              } else {
                this.setCookie('avatarImages', '', 365);
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
        if (indexX === 0) {
          this.$http.get('/api/v1.0/client/findValidConfigs').then(response => { //查询申请类型列表
            if (response.body.code === 200) {
              if (response.body.result.length === 0) { //此处设置的是在pc端关闭了考勤给出提示关闭了
                MessageBox('', '您的申请功能已经被管理员关闭了');
              } else {
                this.setCookie('leaveType', indexX, 365);
                this.$router.push({path: '/leave'});
              }
            }
          }, response => {
            console.log('error callback');
          });
        } else if (indexX === 1) {
          this.$router.push({path: '/attendanceRecord'});

        } else if (indexX === 2) {
          this.$router.push({path: '/mySalary'});
        }

      },
      routerMyData(){
        this.$router.push({path: '/MyData'});
      },
      // 解除绑定
      handerUnbundling(){
        MessageBox.confirm('确定执行此操作?').then(action => {
          this.$http.post('/api/v1.0/client/unbind').then(response => {
            if (response.body.code === 200) {
              Toast({
                message: '操作成功',
                iconClass: 'ico_workbench_2'
              });
              this.$router.push({path: '/index'});
            }
          }, response => {
            console.log('error callback');
          });
        });

      },
    },
    components: {}
  }

</script>

<style lang="scss">
  #signCard-wrapper {
    #bg {
      width: 100%;
      background-image: url("../../assets/bg.png");
      background-repeat: repeat-x;
      .header-top {
        position: relative;
        overflow: hidden;
        box-sizing: border-box;
        width: 100%;
        padding: 25px 0 20px 95px;
        text-align: left;
        font-size: 14px;
        color: #ffffff;
        .header-top-left {
          float: left;
          box-sizing: border-box;
          width: 75px;
          height: 75px;
          border-radius: 50%;
          margin-left: -75px;
          border: 2px solid #fff;
          background-color: #ffffff;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
        .header-top-center {
          float: left;
          box-sizing: border-box;
          display: inline-block;
          padding-left: 10px;
          padding-right: 15px;
          p {
            margin: 0;
            line-height: 24px;
          }
          p:first-child {
            padding-right: 50px;
          }
        }
        .header-top-right {
          position: absolute;
          right: 0;
          margin-top: -5px;
          width: 58px;
          height: 25px;
          border-bottom-left-radius: 10px;
          border-top-left-radius: 10px;
          background-color: rgba(26, 128, 204, 0.4);
          font-size: 0;
          img {
            height: 13px;
            vertical-align: top;
            padding: 5px 0 0 7px;
          }
          span {
            display: inline-block;
            font-size: 11px;
            height: 11px;
            line-height: 11px;
            padding: 7px 0 0 5px;
            vertical-align: top;
          }
        }
      }
      .header-bottom {
        padding: 0 0 20px 0;
        .hand-btn {
          height: 30px;
          width: 90%;
          font-size: 14px;
          color: #ffffff;
          background-color: rgba(88, 184, 255, 0.8);
        }
        img {
          width: 12px;
          height: 12px;
        }
      }
    }

    #record-list-wrapper {
      margin-top: 13px;
      border-bottom: 1px solid #d9d9d9;
      .ImgIcon {
        margin-right: 8px;
        width: 19px;
        height: 19px;
      }
      /*覆盖组件原有样式*/
      .mint-cell {
        border-top: 1px solid #d9d9d9;
      }
      .mint-cell-text, .mint-cell-value {
        font-size: 14px;
      }
      /*覆盖组件原有样式*/
      .mint-cell:last-child {
        background-position: top;
        text-align: left;
      }
    }

    #tab-bottom {
      .mint-tab-item {
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      }
    }

    /*覆盖组件原有样式*/
    .mint-tabbar > .mint-tab-item.is-selected {
      background-color: transparent;
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
            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
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
  }
</style>
