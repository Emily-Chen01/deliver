<template>
  <div v-if="state" id="signCard-wrapper">
    <div class="signCardcont" v-if="toolState">
      <!--头部-->
      <div id="bg">
        <div class="header-top">
          <div class="header-top-left">
            <img :src="imgSrc.comAddress" />
          </div>
          <div class="header-top-center">
            <p v-text="arryOneself.name"></p>
            <p v-text="arryOneself.deptName+' '+(arryOneself.position ? arryOneself.position : '')"></p>
            <p v-text="arryOneself.companyName"></p>
          </div>
        </div>
        <div class="header-bottom" v-if="arryOneself.punchCard">
          <mt-button class="hand-btn" @click="handerSign">
            <i class="bg-img ico_pencil"></i>
            <span>签到打卡</span>
          </mt-button>
        </div>
      </div>
      <!--中间选项列表-->
      <ul id="record-list-wrapper">
        <li
          class="record-list-item"
          v-for="(listItem, listIndex) in listData"
          :key="listIndex"
          @click="changeList(listItem.type)"
        >
          <div class="record-list-item_main">
            <div class="record-list-item_position">
              <div style="display: inline-block;position: relative;">
                <p class="record-list-item_tag" v-if="listItem.num" v-text="listItem.num">1</p>
                <i class="icon_bg_homeImg2" :class="listItem.icon"></i>
                <br />
              </div>
              <p class="mt10" v-text="listItem.name"></p>
            </div>
          </div>
        </li>
        <!-- <li class="record-list-item">
          <a href="http://cn.bing.com" style="text-decoration:none;out-line: none;color: #333333;">
            <div class="record-list-item_main">
              <div class="record-list-item_position">
                  <div style="display: inline-block;position: relative;margin-top:5px;">
                    <i class="icon_bg_homeImg2 bg-wages"></i><br/>
                  </div>
                  <p class="mt10" style="display:block;height:20px;">我的福利</p>
              </div>
            </div>
          </a>
        </li>-->
      </ul>
    </div>
    <!--解除绑定-->
    <div v-if="!toolState" id="Binding-wrapper">
      <div class="binding-box">
        <div class="headerImg-wrapper">
          <div class="headerImg-box">
            <img :src="imgSrc.comAddress" />
          </div>
        </div>
        <mt-button
          type="primary"
          size="large"
          class="Binding-btn"
          @click.native="handerUnbundling"
        >解除绑定</mt-button>
        <div class="Binding-hotLine">客服热线：{{jiebangphone}}</div>
      </div>
    </div>
    <!--底部工具-->
    <mt-tabbar id="tab-bottom" v-model="select">
      <mt-tab-item id="1">
        <i slot="icon" class="bg-img ico_workbench_1" v-if="toolState"></i>
        <i slot="icon" class="bg-img ico_workbench_2" v-if="!toolState"></i>
        <span>工作台</span>
      </mt-tab-item>
      <mt-tab-item id="2">
        <i slot="icon" class="bg-img ico_setting_1" v-if="!toolState"></i>
        <i slot="icon" class="bg-img ico_setting_2" v-if="toolState"></i>
        <span>解绑</span>
      </mt-tab-item>
    </mt-tabbar>

    <!--专项扣除申报二维码弹框-->
    <div class="popupSpecial" v-show="showSpecial">
      <div class="popoverlay" @click="showSpecial=false"></div>
      <div class="popuocont">
        <p>
          <img src="../../assets/images/pic_qrcode.png" />
        </p>
        <p>长按图片识别二维码，打开小程序</p>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Indicator, Cell, MessageBox, Toast } from "mint-ui";
export default {
  data() {
    return {
      jiebangphone: "",
      toolState: true,
      select: "1",
      state: false,
      arryOneself: {},
      listData: [
        // 九宫格数据
        {
          name: "审批申请",
          icon: "bg-apply",
          type: 0,
          num: 0
        },
        {
          name: "我的考勤",
          icon: "bg-attendance",
          type: 1,
          num: 0,
          date: ""
        },
        {
          name: "我的工资条",
          icon: "bg-wages",
          type: 2,
          num: 0
        },
        {
          name: "公司公告",
          icon: "bg-notice",
          type: 3,
          num: 0
        },
        {
          code: "personal",
          name: "个人信息",
          icon: "bg-personal",
          type: 4,
          num: 0
        },
        //          {
        //            name: '我的任务',
        //            icon: 'bg-personal',
        //            type: 5,
        //            num:0
        //          },
        {
          name: "我的审批",
          icon: "bg-approve",
          type: 6,
          num: 0
        },
        {
          name: "专项扣除申报",
          icon: "bg-declare",
          type: 7,
          num: 0
        },
        {
          name: "我的面试",
          icon: "bg-interview",
          type: 8,
          num: 0
        }
        // {
        //   name: '员工福利',
        //   icon: 'bg-interview',
        //   type: 8,
        //   num: 0
        // },
      ],
      imgSrc: {
        comAddress: require("../../assets/tx.png")
      },
      showSpecial: false
    };
  },
  watch: {
    select: function(val, oldVal) {
      if (val === "1") {
        this.toolState = true;
      } else if (val === "2") {
        this.toolState = false;
      }
    }
  },
  created: function() {
    this.jiebangp()
    this.state = false;
    Indicator.open("正在加载...");
    this.$http.get("/api/v1.0/client/status").then(
      response => {
        if (response.body.code === 200) {
          this.listData.map(item => {
            switch (item.type) {
              case 0:
                item.num = response.body.result.apply;
                break;
              case 1:
                item.num = response.body.result.punchCard;
                item.date = response.body.result.date;
                break;
              case 2:
                item.num = response.body.result.salary;
                break;
              case 3:
                item.num = response.body.result.notice;
                break;
              case 4:
                break;
              case 5:
                break;
              case 6:
                item.num = response.body.result.approvals;
                break;
              case 8:
                // TODO 渲染新增面试数量
                break;
              default:
                break;
            }
          });
        }
      },
      response => {
        console.log("error callback");
      }
    );
    this.searchStaff();
  },
  methods: {
    jiebangp(){
      this.$http
      .post("/api/v1.0/common/customerPhone", {
        "code": 2
      })
      .then(
        response => {
          if (response.body.code === 200) {
            this.jiebangphone = response.body.result.phone;
          }
        },
        response => {
          console.log("error callback");
        }
      );
    },
    handerSign() {
      this.$router.push({ path: "/signIn" }); //进入打卡页
    },
    searchStaff() {
      this.$http.post("/api/v1.0/client/findStaff").then(
        response => {
          if (response.body.code === 200) {
            if (response.body.result) {
              this.arryOneself = response.body.result;
              this.setCookie(
                "infoObjPassPostion",
                this.arryOneself.deptName,
                365
              );
              this.setCookie("infoObjPassName", this.arryOneself.name, 365);
              if (this.arryOneself.staffPhoUrl) {
                this.imgSrc.comAddress = this.arryOneself.staffPhoUrl;
                this.setCookie("avatarImages", this.imgSrc.comAddress, 365);
              } else {
                this.setCookie("avatarImages", "", 365);
              }
              this.state = true;
              Indicator.close(); //关闭加载中
            }
          }
        },
        response => {
          console.log("error callback");
        }
      );
    },
    changeList(indexX) {
      switch (indexX) {
        case 0:
          this.setCookie("leaveType", indexX, 365);
          this.$router.push({ path: "/leave" });
          /*this.$http.get('/api/v1.0/client/findValidConfigs').then(response => { //查询申请类型列表
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
            });*/
          break;
        case 1:
          this.$router.push({ path: "/attendanceRecord" });
          break;
        case 2:
          this.setCookie("mySalaryDate", this.listData[1].date, 365);
          this.$router.push({ path: "/mySalary" });
          break;
        case 3:
          this.$router.push({ path: "/notice" });
          break;
        case 4:
          this.$router.push({ path: "/myData" });
          break;
        case 5:
          this.$router.push({ path: "/task" });
          break;
        case 6:
          this.$router.push({ path: "/approve" });
          break;
        case 7:
          this.showSpecial = true;
          break;
        case 8:
          this.$router.push({ path: "/myInterview" });
          break;
        default:
          break;
      }
    },
    // 解除绑定
    handerUnbundling() {
      MessageBox.confirm("确定执行此操作?").then(action => {
        this.$http.post("/api/v1.0/client/unbind").then(
          response => {
            if (response.body.code === 200) {
              Toast({
                message: "解绑成功",
                iconClass: "bg-img ico_success"
              });
              this.$router.push({ path: "/binding" });
            }
          },
          response => {
            console.log("error callback");
          }
        );
      });
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
#signCard-wrapper {
  .signCardcont {
    padding-bottom: 55px;
  }
  .mint-tabbar {
    position: fixed;
  }
  .mt10 {
    margin-top: 10px;
  }
  #bg {
    width: 100%;
    background-image: url("../../assets/bg.png");
    background-repeat: repeat-x;
    .header-top {
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
      width: 100%;
      padding: 25px 15px 20px 95px;
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
        p {
          margin: 0;
          line-height: 24px;
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
        span {
          vertical-align: middle;
        }
      }
    }
  }

  #record-list-wrapper {
    margin-top: 13px;
    font-size: 0;
    background: #fff;
    &::after {
      content: "";
      display: block;
      height: 0;
      clear: both;
    }
    .record-list-item {
      position: relative;
      display: inline-block;
      box-sizing: border-box;
      float: left;
      width: 33.33%;
      padding-top: 33.33%;
      background-color: #ffffff;
      .record-list-item_main {
        position: absolute;
        top: 0;
        font-size: 14px;
        color: #333333;
        height: 100%;
        width: 100%;
        line-height: 100%;
        .record-list-item_position {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 100%;
          transform: translate(-50%, -50%);
        }
        .record-list-item_tag {
          position: absolute;
          top: 0;
          right: 0;
          height: 14px;
          min-width: 14px;
          padding: 1px;
          border-radius: 9px;
          font-size: 10px;
          background-color: red;
          color: #ffffff;
        }
      }
    }
    .record-list-item:nth-child(3n) {
      border-right: none;
    }
    .record-list-item:active {
      background-color: #f7f8fb;
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

.popupSpecial {
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  .popoverlay {
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 1001;
  }
  .popuocont {
    position: fixed;
    left: 18%;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    width: 64%;
    z-index: 1002;
    p {
      color: #fff;
      font-size: 12px;
      &:nth-child(1) {
        padding: 15px;
        background: #fff;
        display: block;
      }
      &:nth-child(2) {
        padding-top: 20px;
      }
    }
    img {
      width: 100%;
      display: block;
    }
  }
}
</style>
