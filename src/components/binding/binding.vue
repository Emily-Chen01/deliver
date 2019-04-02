<template>
  <div id="binding-wrapper">
    <!--头部logo-->
    <div class="binding-header">
      <div class="binding-header-logo"><img :src="imgSrc.bg"></div>
      <p class="binding-header-firstP">欢迎使用 薪薪乐 员工自助服务</p>
      <p>您需要先绑定手机</p>
    </div>
    <!--内容 输入框-->
    <el-row class="binding-main">
      <el-col :span="24">
        <el-form>
          <el-form-item>
            <el-col :span="15">
              <el-input v-model="phoneNumber" type="number" class="fs12" placeholder="手机号..."
                        auto-complete="off"></el-input>
            </el-col>
            <el-col :span="8" :push="1">
              <el-button type="primary" :disabled="YZdisabled || verCodeShow" @click.native="handerClick"
                         class="binding-main-btn fs12">
                <span>{{yanzheng}}</span></el-button>
            </el-col>
          </el-form-item>
          <el-form-item v-if="verCodeShow">
            <el-col :span="15">
              <el-input v-model="verCodeNum" class="fs12" placeholder="请输入图形验证码..."
                        auto-complete="off"></el-input>
            </el-col>
            <el-col :span="8" :push="1">
              <div class="verCode-box" @click="getVerCode">
                <img :src="'data:image/jpg;base64,'+verCode" width="100%" height="100%" alt="">
              </div>
            </el-col>
            <el-button type="primary" @click.native="submitVerCode" class="binding-main-btn mt20 fs12">
              <span>验证图形验证码</span>
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-col :span="24">
              <el-input type="text" v-model="phoneNumberValue" class="fs12" placeholder="请输入短信验证码..."
                        auto-complete="off"></el-input>
            </el-col>
          </el-form-item>
        </el-form>
      </el-col>
      <el-button :disabled="verCodeShow" type="primary" @click.native="handerSubmit" class="binding-main-btn mt20 fs12">
        <span>确定</span>
      </el-button>
    </el-row>
    <!--弹框-->
    <mt-popup
      v-model="errorModel"
      class="binding-Bomb"
      :closeOnClickModal="true">
      <div class="binding-Bomb-imgBox">
        <img :src="imgSrc.bg2" class="alertImages"/>
      </div>
      <div v-if="alertMessageShow" class="binding-Bomb-main">
        <p class="fs12" v-text="alertMessage"></p>
      </div>
    </mt-popup>
  </div>
</template>

<script>
  import {Popup, Indicator} from 'mint-ui';
  import ManyCompany from "@/components/register/manyCompany"
  import Vue from 'vue'
  let timer1 = null;
  export default {

    name: 'hello',
    data() {
      return {
        imgSrc: {
          bg: require('../../assets/logo.png'),
          bg2: require('../../assets/ico_error.png'),
        },
        phoneNumber: '',
        phoneNumberValue: '',//验证码值
        verCodeNum: '',//输入的图形验证码
        sumSearch: '',
        sumSearchUid: [],
        yanzheng: '获取验证码',//验证码
        YZdisabled: false,
        errorModel: false, //错误弹框
        alertMessage: '', //进行赋值的错误信息
        alertMessageShow: true,
        verCode: '',//图形验证码
        verCodeShow: false,//图形验证码是否显示
      }
    },
    created(){
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
              self.yanzheng = '重新发送(60)';
              let countdown = 60;
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
              this.popupBomb(response.body.message);
            } else if (response.body.code === 1000) {
              this.verCodeShow = true;
              this.verCode = response.body.result;
            }
          }, response => {
            console.log('error callback');
          });

        } else {
          this.popupBomb('手机号码错误');
        }
      },
      handerSubmit(){
        let bindingObj = {
          code: this.phoneNumberValue,
          phone: this.phoneNumber,
        };
        Indicator.open('加载中...');
        this.$http.post('/api/v1.0/client/bind', bindingObj).then(response => { //进行手机号码进行绑定
          if (response.body.code === 200) {
            this.findCompany(this.phoneNumber);
          } else {
            Indicator.close();//关闭加载
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
            this.sumSearchUid = response.body.result;
            if (response.body.result.length === 1) {
              //如果等于1就进入 signCard 点击打卡
              let param = {
                companyUid: this.sumSearchUid[0].uid,
              };
              this.$http.post('/api/v1.0/client/chooseCompany', param).then(response => { //选择公司
                Indicator.close();
                if (response.body.code === 200) {
                  this.setCookie('isLowEntry', response.body.result, 365);//员工状态
                  if (response.body.result === '-1' || response.body.result === '-2') {
                    this.$router.push({path: '/myData'});
                  } else {
                    this.$router.push({path: '/signCard'});
                  }
                } else {
                  this.popupBomb(response.body.message);
                }
              }, response => {
                console.log('error callback');
              });
            } else {
              this.handerCome(); //如果不是只有一个公司进行选择公司
            }
          } else {
            Indicator.close();//关闭加载
            this.popupBomb(response.body.message);
          }
        }, response => {
          console.log('error callback');
        });
      },
      popupBomb(message){
        this.alertMessageShow = true;
        this.errorModel = true;
        this.alertMessage = message;
      },
      // 验证图形验证码
      submitVerCode(){
        this.$http.post('/api/v1.0/client/checkImageCode', {phone: this.phoneNumber, code: this.verCodeNum}
        ).then(response => {
          if (response.body.code === 200) {
            this.verCodeShow = false;
            this.verCode = '';
          } else {
            this.verCode = response.body.result;
            this.popupBomb(response.body.message);
          }
        });
      },
      // 获取图形验证码
      getVerCode(){
        this.$http.get('/api/v1.0/client/sendvcode/' + this.phoneNumber).then(response => {
          if (response.body.code === 200) {
            this.verCode = response.body.result;
          }
        });
      }
    },
    components: {}
  }
</script>

<style lang="scss">
  #binding-wrapper {
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
    .binding-header {
      width: 100%;
      .binding-header-logo {
        margin: 0 auto;
        padding-top: 68px;
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
      .binding-header-firstP {
        margin-top: 20px;
      }
    }
    .binding-main {
      width: 100%;
      margin-top: 35px;
      // 复写elementUI样式
      .el-form-item {
        margin-bottom: 10px;
      }
      .binding-main-btn {
        width: 100%;
      }
      .verCode-box {
        width: 100%;
        height: 34px;
        overflow: hidden;
        margin-top: 2px;
      }
    }
    .binding-Bomb {
      width: 200px;
      border-radius: 4px;
      background-color: rgba(31, 46, 62, 0.85);
      color: #ffffff;
      .binding-Bomb-imgBox {
        margin: 0 auto;
        margin-top: 25px;
        width: 35px;
        height: 35px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .binding-Bomb-main {
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
