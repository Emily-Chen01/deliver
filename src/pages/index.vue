<template>
  <div id="index-wrapper">
    <!--头部logo-->
    <!--<div class="index-header">-->
    <!--<div class="index-header-logo"><img :src="imgSrc.bg"></div>-->
    <!--<p class="index-header-firstP">欢迎使用 薪薪乐 员工自助服务</p>-->
    <!--<p>您需要先绑定手机</p>-->
    <!--</div>-->
    <!--&lt;!&ndash;内容 输入框&ndash;&gt;-->
    <!--<el-row class="index-main">-->
    <!--<el-col :span="24">-->
    <!--<el-form>-->
    <!--<el-form-item>-->
    <!--<el-col :span="15">-->
    <!--<el-input v-model="phoneNumber" type="number" class="fs12" placeholder="手机号..."-->
    <!--auto-complete="off"></el-input>-->
    <!--</el-col>-->
    <!--<el-col :span="8" :push="1">-->
    <!--<el-button type="primary" :disabled="YZdisabled || verCodeShow" @click.native="handerClick"-->
    <!--class="index-main-btn fs12">-->
    <!--<span>{{yanzheng}}</span></el-button>-->
    <!--</el-col>-->
    <!--</el-form-item>-->
    <!--<el-form-item v-if="verCodeShow">-->
    <!--<el-col :span="15">-->
    <!--<el-input v-model="verCodeNum" class="fs12" placeholder="请输入图形验证码..."-->
    <!--auto-complete="off"></el-input>-->
    <!--</el-col>-->
    <!--<el-col :span="8" :push="1">-->
    <!--<div class="verCode-box" @click="getVerCode">-->
    <!--<img :src="'data:image/jpg;base64,'+verCode" width="100%" height="100%" alt="">-->
    <!--</div>-->
    <!--</el-col>-->
    <!--<el-button type="primary" @click.native="submitVerCode" class="index-main-btn mt20 fs12">验证图形验证码</el-button>-->
    <!--</el-form-item>-->
    <!--<el-form-item>-->
    <!--<el-col :span="24">-->
    <!--<el-input type="text" v-model="phoneNumberValue" class="fs12" placeholder="请输入短信验证码..."-->
    <!--auto-complete="off"></el-input>-->
    <!--</el-col>-->
    <!--</el-form-item>-->
    <!--</el-form>-->
    <!--</el-col>-->
    <!--<el-button :disabled="verCodeShow" type="primary" @click.native="handerSubmit" class="index-main-btn mt20 fs12">-->
    <!--<span>确定</span>-->
    <!--</el-button>-->
    <!--</el-row>-->
    <!--&lt;!&ndash;弹框&ndash;&gt;-->
    <!--<mt-popup-->
    <!--v-model="errorModel"-->
    <!--class="index-Bomb"-->
    <!--closeOnClickModal="true">-->
    <!--<div class="index-Bomb-imgBox">-->
    <!--<img :src="imgSrc.bg2" class="alertImages"/>-->
    <!--</div>-->
    <!--<div v-if="noneModel" class="index-Bomb-main">-->
    <!--<p class="fs13">抱歉!</p>-->
    <!--<p class="fs12">没有找到您的员工记录,请联系您的HR</p>-->
    <!--</div>-->
    <!--<div v-if="alertMessageShow" class="index-Bomb-main">-->
    <!--<p class="fs12" v-text="alertMessage"></p>-->
    <!--</div>-->
    <!--</mt-popup>-->
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
          bg: require('../assets/logo.png'),
          bg2: require('../assets/ico_error.png'),
        },
        phoneNumber: '',
        phoneNumberValue: '',//验证码值
        verCodeNum: '',//输入的图形验证码
        sumSearch: '',
        sumSearchUid: [],
        yanzheng: '获取验证码',//验证码
        YZdisabled: false,
        errorModel: false, //错误弹框
        noneModel: false, //没有员工
        alertMessage: '', //进行赋值的错误信息
        alertMessageShow: true,
        verCode: '',//图形验证码
        verCodeShow: false,//图形验证码是否显示
      }
    },
    created: function () {
//      Indicator.open('加载中...');
      //====获取openidstart  6-2早注释为了本地测试 提交需解除注释---------此处电脑端调试要注释掉
      let _href = window.location.href;

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
      handerList(){
        this.$http.post('/api/v1.0/client/checkStaffWechat').then(response => { //查询员工是否有绑定手机
          if (response.body.code === 200) {
            let isbingPhone = response.body.result.phone;
            this.setCookie('iphoneNumber', isbingPhone, 365);//缓存手机号码用于查看公司manyCompany
            //初始化查询看是否有是一个公司进行跳转signCard  开始
            this.findCompany(isbingPhone);
          } else {
            setTimeout(() => {
              this.$router.push({path: '/binding'});
            }, 2000);
          }
        }, response => {
          console.log('error callback');
        });
      },
      handerCome: function () {
//        Indicator.close();//关闭加载
        this.$router.push({path: '/ManyCompany'});
      },
      findCompany(phone){
        this.$http.get('/api/v1.0/client/findCompanies/' + phone).then(response => {
          if (response.body.code === 200) {
            if (response.body.result) {
              this.sumSearchUid = response.body.result;
              if (response.body.result.length === 1) {
                //如果等于1就进入 signCard 点击打卡
                let param = {
                  companyUid: this.sumSearchUid[0].uid,
                };
                this.$http.post('/api/v1.0/client/chooseCompany', param).then(response => { //选择公司
//                  Indicator.close();
                  if (response.body.code === 200) {
                    setTimeout(() => {
                      if (response.body.result === '-1' || response.body.result === '-2') {
                        this.$router.push({path: '/myData'});
                      } else {
                        this.$router.push({path: '/signCard'});
                      }
                    }, 2000);
                  }
                }, response => {
                  console.log('error callback');
                });
              } else {
                setTimeout(this.handerCome(), 2000); //如果不是只有一个公司进行选择公司
              }
            }
          }
        }, response => {
          console.log('error callback');
        });
      }
    },
    components: {}
  }
</script>

<style lang="scss">
  #index-wrapper {
    /*padding: 0 20px;*/
    width: 100%;
    height: 100vh;
    background-color: #ffffff;
    background-image: url("../assets/loading.png");
    background-size: 100% 100%;
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
      .verCode-box {
        width: 100%;
        height: 34px;
        overflow: hidden;
        margin-top: 2px;
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
