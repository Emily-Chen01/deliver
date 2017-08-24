<template>
  <div id="index-wrapper">
    <!--头部logo-->
    <div class="index-header">
      <div class="index-header-logo"><img :src="imgSrc.bg"></div>
      <p class="index-header-firstP">欢迎使用 薪薪乐 员工自助服务</p>
      <p>您需要先绑定手机</p>
    </div>
    <!--内容 输入框-->
    <el-row class="index-main">
      <el-col :span="24">
        <el-form>
          <el-form-item>
            <el-col :span="15">
              <el-input v-model="phoneNumber" type="number" class="fs12" placeholder="手机号..."
                        auto-complete="off"></el-input>
            </el-col>
            <el-col :span="8" :push="1">
              <el-button type="primary" :disabled="YZdisabled" @click.native="handerClick" class="index-main-btn fs12">
                <span>{{yanzheng}}</span></el-button>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="24">
              <el-input type="text" v-model="phoneNumberValue" class="fs12" placeholder="请输入短信验证码..."
                        auto-complete="off"></el-input>
            </el-col>
          </el-form-item>
        </el-form>
      </el-col>
      <el-button type="primary" @click.native="handerSubmit" class="index-main-btn mt20 fs12">确定</el-button>
    </el-row>
    <!--弹框-->
    <mt-popup
      v-model="errorModel"
      class="index-Bomb"
      closeOnClickModal="true">
      <div class="index-Bomb-imgBox">
        <img :src="imgSrc.bg2" class="alertImages"/>
      </div>
      <div v-if="noneModel" class="index-Bomb-main">
        <p class="fs13">抱歉!</p>
        <p class="fs12">没有找到您的员工记录,请联系您的HR</p>
      </div>
      <div v-if="alertMessageShow" class="index-Bomb-main">
        <p class="fs12" v-text="alertMessage"></p>
      </div>
    </mt-popup>
  </div>
</template>

<script>
  import {Navbar, TabItem, Toast, MessageBox, Popup, Indicator} from 'mint-ui';
  import ManyCompany from "@/components/register/manyCompany"
  import Vue from 'vue'
  let timer1 = null;
  export default {

    name: 'hello',
    data() {
      return {
        imgSrc: {
          bg: require('../assets/logo.png'),
          bg2: require('../assets/ico_error.png'),
        },
        phoneNumber: '',
        phoneNumberValue: '',//验证码值
        sumSearch: '',
        sumSearchUid: [],
        yanzheng: '获取验证码',//验证码
        YZdisabled: false,
        errorModel: false, //错误弹框
        noneModel: false, //没有员工
        alertMessage: '', //进行赋值的错误信息
        alertMessageShow: true,
      }
    },
    created: function () {
      Indicator.open('加载中...');
      //====获取openidstart  6-2早注释为了本地测试 提交需解除注释---------此处电脑端调试要注释掉
      let _href = window.location.href;
      console.log(window.location.href);
      function getUrlParam(url, name) { //获取地址栏的参数
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        let r = url.substring(url.indexOf('?') + 1).match(reg);
        if (r !== null) return unescape(r[2]);
        return null;
      }

      let openID = getUrlParam(_href, "openid");
      if (openID === null) {
        let path = '/api/v1.0/wechat';
        let protocol = location.protocol;
        let hostname = location.hostname;
        window.location.href = `${protocol}//${hostname}${path}`;
        return;
      }
      this.setCookie('openId', openID, 365);
      this.handerList();        //先查询是否有绑定 有返回手机号
      //====获取openid 结束====
    },

    methods: {
      handerClick(){
        if (/^1\d{10}$/.test(this.phoneNumber)) {
          this.$http.get('/api/v1.0/client/code/' + this.phoneNumber).then(response => {
            //获取验证码
            if (response.body.code === 200) {
              //获取验证码倒计时
              let self = this;
              self.YZdisabled = true;
              self.yanzheng = '重新发送(30)';
              let countdown = 30;
              if (timer1) clearInterval(timer1); //开启前清除下已经开的定时器
              function settime() {
                if (countdown <= 0) {
                  self.YZdisabled = false;
                  self.yanzheng = "获取验证码";
                  clearInterval(timer1);
                  return;
                } else {
                  countdown--;
                  self.yanzheng = "重新发送(" + countdown + ")";
                }
              }

              //获取验证码倒计时
              timer1 = setInterval(settime, 1000);
              this.setCookie('iphoneNumber', this.phoneNumber, 365);
            } else if (response.body.code === 500) {
              this.errorModel = true;
              this.noneModel = true;
              this.alertMessageShow = false; //动态赋值信息false
            }
          }, response => {
            console.log('error callback');
          });

        } else {
//          this.alertMessageShow = true;
//          this.alertMessage = '手机号码错误';
//          this.errorModel = true;
//          this.noneModel = false; //隐藏没有记录
          this.popupBomb('手机号码错误');
        }
      },
      handerSubmit(){
        let bindingObj = {
          code: this.phoneNumberValue,
          phone: this.phoneNumber,
        };
        this.$http.post('/api/v1.0/client/bind', bindingObj).then(response => { //进行手机号码进行绑定
          if (response.body.code === 200) {
            this.findCompany(this.phoneNumber);
//            this.$http.get('/api/v1.0/client/findCompanies/' + this.phoneNumber).then(response => {
//              if (response.body.code === 200) {
//                this.sumSearchUid = response.body.result;
//                if (response.body.result.length === 1) {
//                  //如果等于1就进入 signCard 点击打卡
//                  let param = {
//                    companyUid: this.sumSearchUid[0].uid,
//                  };
//                  this.$http.post('/api/v1.0/client/chooseCompany', param).then(response => { //选择公司
//                    if (response.body.code === 200) {
//                      this.$router.push({path: '/signCard'});
//                    } else {
//                      this.alertMessageShow = true;
//                      this.errorModel = true;
//                      this.noneModel = false; //隐藏没有记录
//                      this.alertMessage = response.body.message;
//                    }
//                  }, response => {
//                    console.log('error callback');
//                  });
//                } else {
//                  this.handerCome(); //如果不是只有一个公司进行选择公司
//                }
//              } else {
//                this.alertMessageShow = true;
//                this.errorModel = true;
//                this.noneModel = false; //隐藏没有记录
//                this.alertMessage = response.body.message;
//              }
//            }, response => {
//              console.log('error callback');
//            });
          } else {
            this.popupBomb(response.body.message);
//            this.alertMessageShow = true;
//            this.errorModel = true;
//            this.noneModel = false; //隐藏没有记录
//            this.alertMessage = response.body.message;
          }
        }, response => {
          console.log('error callback');
        });
      },
      handerList(){
        this.$http.post('/api/v1.0/client/checkStaffWechat').then(response => { //查询员工是否有绑定手机
          if (response.body.code === 200) {
            if (!response.body.result) {
              Indicator.close();
            } else {
              let isbingPhone = response.body.result.phone;
              this.setCookie('iphoneNumber', isbingPhone, 365);//缓存手机号码用于查看公司manyCompany
              //初始化查询看是否有是一个公司进行跳转signCard  开始
              this.findCompany(isbingPhone);
//            this.$http.get('/api/v1.0/client/findCompanies/' + isbingPhone).then(response => { //初始化查询有没有公司
//              //若是没有公司在此处执行下一个页面  ?/？
//              if (!response.body.result) {
//                Indicator.close();
//              }
//              if (response.body.result) {
//                this.sumSearchUid = response.body.result;
//
//                if (response.body.result.length === 1) {
//                  //如果等于1就进入 signCard 点击打卡
//                  let param = {
//                    companyUid: this.sumSearchUid[0].uid,
//                  };
//                  this.$http.post('/api/v1.0/client/chooseCompany', param).then(response => { //选择公司
//                    if (response.body.code === 200) {
//                      this.$router.push({path: '/signCard'});
//                    }
//                    Indicator.close();//关闭加载
//                  }, response => {
//                    console.log('error callback');
//                  });
//                } else {
//                  this.handerCome(); //如果不是只有一个公司进行选择公司
//                }
//              }
//            }, response => {
////              console.log('findCompanies error callback');
//            });
              //初始化查询看是否有是一个公司进行跳转signCard  开始
            }
          } else {
//            this.alertMessageShow = true;
//            this.errorModel = true;
//            this.noneModel = false; //隐藏没有记录
//            this.alertMessage = response.body.message;
//            return;
            this.popupBomb(response.body.message);
          }
        }, response => {
          console.log('error callback');
        });
      },
      handerCome: function () {
        Indicator.close();//关闭加载
        this.$router.push({path: '/ManyCompany'});
      },

      findCompany(phone){
        this.$http.get('/api/v1.0/client/findCompanies/' + phone).then(response => {
          if (response.body.code === 200) {
            if (!response.body.result) {
              Indicator.close();
            } else {
              this.sumSearchUid = response.body.result;
              if (response.body.result.length === 1) {
                //如果等于1就进入 signCard 点击打卡
                let param = {
                  companyUid: this.sumSearchUid[0].uid,
                };
                this.$http.post('/api/v1.0/client/chooseCompany', param).then(response => { //选择公司
                  Indicator.close();
                  if (response.body.code === 200) {
                    this.$router.push({path: '/signCard'});
                  } else {
//                    this.alertMessageShow = true;
//                    this.errorModel = true;
//                    this.noneModel = false; //隐藏没有记录
//                    this.alertMessage = response.body.message;
                    this.popupBomb(response.body.message);
                  }
                }, response => {
                  console.log('error callback');
                });
              } else {
                this.handerCome(); //如果不是只有一个公司进行选择公司
              }
            }
          } else {
//            this.alertMessageShow = true;
//            this.errorModel = true;
//            this.noneModel = false; //隐藏没有记录
//            this.alertMessage = response.body.message;
            this.popupBomb(response.body.message);
          }
        }, response => {
          console.log('error callback');
        });
      },
      popupBomb(message){
        this.alertMessageShow = true;
        this.errorModel = true;
        this.noneModel = false; //隐藏没有记录
        this.alertMessage = message;
      },
//      changeCompany(){
//        let param = {
//          "companyUid": this.sumSearchUid.UID,
//        };
//        this.$http.post('/api/v1.0/client/chooseCompany', param).then(response => {
//          if (response.body.code === 200) {
//            this.$router.push({path: '/signCard'});
//          }
//        }, response => {
//          console.log('error callback');
//        });
//      },
//      closeClick(){
//        this.errorModel = false;
//      }
    },
    components: {}
  }
</script>

<style lang="scss">
  #index-wrapper {
    padding: 0 20px;
    height: 100vh;
    background: #ffffff;
    .mt20 {
      margin-top: 20px;
    }
    .fs12 {
      font-size: 12px;
    }
    .fs13 {
      font-size: 13px;
    }
    .index-header {
      width: 100%;
      .index-header-logo {
        margin: 0 auto;
        margin-top: 68px;
        width: 158px;
        img {
          width: 158px;
          height: 44px;
        }
      }
      p {
        margin: 0;
        width: 100%;
        text-align: center;
        line-height: 24px;
        font-size: 14px;
        color: #8492a6;
      }
      .index-header-firstP {
        margin-top: 20px;
      }
    }
    .index-main {
      width: 100%;
      margin-top: 35px;
      // 复写elementUI样式
      .el-form-item {
        margin-bottom: 10px;
      }
      .index-main-btn {
        width: 100%;
      }
    }
    .index-Bomb {
      width: 200px;
      border-radius: 4px;
      background-color: rgba(31, 46, 62, 0.85);
      color: #ffffff;
      .index-Bomb-imgBox {
        margin: 0 auto;
        margin-top: 25px;
        width: 35px;
        height: 35px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .index-Bomb-main {
        padding: 5px 20px 25px;
        p {
          margin: 0;
          text-align: center;
          line-height: 25px;
        }
      }
    }
  }
</style>
