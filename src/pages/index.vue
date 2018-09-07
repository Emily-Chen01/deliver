<template>
  <div id="index-wrapper">
    <mt-popup
      v-model="errorModel"
      class="index-Bomb"
      closeOnClickModal="true">
      <div class="index-Bomb-imgBox">
        <img :src="imgSrc.bg2" class="alertImages"/>
      </div>
      <div class="index-Bomb-main">
        <p class="fs12" v-text="alertMessage"></p>
      </div>
    </mt-popup>
  </div>
</template>

<script>
  import {Popup} from 'mint-ui';
  import ManyCompany from "@/components/register/manyCompany"
  import Vue from 'vue'
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
        alertMessage: '', //进行赋值的错误信息
        verCode: '',//图形验证码
        verCodeShow: false,//图形验证码是否显示
      }
    },
    created() {
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
    watch: {
      '$route'(to, from){
        if (to.query.openid) {
          let openID = to.query.openid;
          this.setCookie('openId', openID, 365);
          this.handerList();
        } else {
          let path = '/api/v1.0/wechat';
          let protocol = location.protocol;
          let hostname = location.hostname;
          window.location.href = `${protocol}//${hostname}${path}`;
        }
      }
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
            this.$router.push({path: '/binding'});
          }
        }, response => {
          console.log('error callback');
        });
      },
      handerCome: function () {
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
                  companyUid: this.sumSearchUid[0].companyUid,
                };
                this.$http.post('/api/v1.0/client/chooseCompany', param).then(response => { //选择公司
                  if (response.body.code === 200) {
                    this.setCookie('isLowEntry', response.body.result, 365);//员工状态
                    if (response.body.result === '-1' || response.body.result === '-2') {
                      this.$router.push({path: '/myData'});
                    } else {
                      this.$router.push({path: '/signCard'});
                    }
                  }
                }, response => {
//                  console.log('error callback');
                });
              } else {
                this.handerCome();//如果不是只有一个公司进行选择公司
              }
            }
          } else if (response.body.code === 500) {
            this.$router.push({path: '/binding'});
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
