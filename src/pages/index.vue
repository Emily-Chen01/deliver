<template>
  <div class="hello" style="padding: 0 8px">
    <div style="height: 5rem;"></div>
    <div class="logo"><img :src="imgSrc.bg" style="width: 50%;height: 99.5%"></div>
    <p class="h1Class">{{ msg }}</p>
    <p class="titlesSmall">{{ msgPhone }}</p>
    <div style="clear:both"></div>
    <div style="padding: 5rem 1rem 1.5rem 1rem;box-sizing:border-box;width: 100%">

      <el-row style="width: 100%">
        <el-col :span="24">
          <el-form>
            <el-form-item>
              <el-col :span="15">
                <el-input v-model="phoneNumber" type="number" placeholder="手机号" auto-complete="off"></el-input>
              </el-col>
              <el-col :span="8" :push="1">
                <el-button type="primary" :disabled="YZdisabled" @click.native="handerClick()"
                           style="width: 100%;text-align: center"><span>{{yanzheng}}</span></el-button>
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-col :span="24">
                <el-input type="text" v-model="phoneNumberValue" placeholder="请输入验证码" auto-complete="off"></el-input>
              </el-col>
            </el-form-item>
          </el-form>
        </el-col>
        <el-button type="primary" @click.native="handerSubmit" style="width: 100%;margin-top: 1rem">确定</el-button>
      </el-row>
    </div>

    <mt-popup
      v-model="errorModel"
      class="imageClassSuccess"
      closeOnClickModal="true">
      <div @click.native="closeClick"
           style="width: 2rem;height: 2rem;text-align: center;margin:1.5rem auto 0.3rem auto;">
        <img width="150" :src="imgSrc.bg2" class="alertImages"/>
      </div>
      <div style="clear:both;"></div>
      <div v-if="noneModel">
        <div style="font-size:1.2rem; width: 5rem;height: 1.5rem;text-align: center;margin:0.1rem auto 0.3rem auto;">
          <span>抱歉 ！</span>
        </div>
        <div style="font-size:1.2rem;width: 12rem;height: 1.5rem;text-align: center;margin:0.1rem auto 0.3rem auto;">
          <span>没有找到您的员工记录</span>
        </div>
        <div style="font-size:1.2rem;width: 6rem;height: 1.5rem;text-align: center;margin:0.2rem auto 0.3rem auto;">
          <span>请联系HR</span>
        </div>
      </div>
      <div v-if="alertMessageShow" style="margin-top: 1.5rem">{{alertMessage}}</div>
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
        msg: '欢迎使用 薪薪乐 员工自助服务',
        msgPhone: '您需要先绑定手机!',
        phoneNumber: '',
        phoneNumberValue: '',//验证码值
        sumSearch: '',
        sumSearchUid: [],
        isCompany: '',
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
        //测试字符串length
        function GetLength(str) {
          ///<summary>获得字符串实际长度，中文2，英文1</summary>
          ///<param name="str">要获得长度的字符串</param>
          let realLength = 0, len = str.length, charCode = -1;
          for (let i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) realLength += 1;
            else realLength += 2;
          }
          return realLength;
        };
        if (GetLength(this.phoneNumber) === 11) {
          let number = {
            phone: this.phoneNumber,
          };
          this.$http.get('/api/v1.0/client/code/' + number.phone).then(response => {
            //获取验证码
            if (response.body.code === 200) {
              //获取验证码倒计时
              let self = this;
              self.YZdisabled = true;
              self.yanzheng = '重新发送(30)';
              let countdown = 30;
              if (timer1) clearInterval(timer1); //开启前清除下已经开的定时器
              function settime() {
                if (countdown === 0) {
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
              return;
            }
          }, response => {
            console.log('error callback');
          });

        } else {
          this.alertMessageShow = true;
          this.alertMessage = '手机号码错误';
          this.errorModel = true;
          this.noneModel = false; //隐藏没有记录
        }
      },
      handerSubmit(){
        let bindingObj = {
          "code": this.phoneNumberValue,
          "phone": this.phoneNumber,
        };
        this.$http.post('/api/v1.0/client/bind', bindingObj).then(response => { //进行手机号码进行绑定
          if (response.body.code === 200) {
            this.$http.get('/api/v1.0/client/findCompanies/' + this.phoneNumber).then(response => {
              if (response.body.code === 200) {
                this.sumSearchUid = response.body.result;
                if (response.body.result.length === 1) {
                  //如果等于1就进入 signCard 点击打卡
                  let param = {
                    "companyUid": this.sumSearchUid[0].uid,
                  };
                  this.$http.post('/api/v1.0/client/chooseCompany', param).then(response => { //选择公司
                    if (response.body.code === 200) {
                      this.$router.push({path: '/signCard'});
                    }
                  }, response => {
                    console.log('error callback');
                  });
                } else {
                  this.handerCome(); //如果不是只有一个公司进行选择公司
                }
              } else {
                this.alertMessageShow = true;
                this.errorModel = true;
                this.noneModel = false; //隐藏没有记录
                this.alertMessage = response.body.message;
                return;
              }
            }, response => {
              console.log('error callback');
            });
          } else {
            this.alertMessageShow = true;
            this.errorModel = true;
            this.noneModel = false; //隐藏没有记录
            this.alertMessage = response.body.message;
            return;
          }
        }, response => {
          console.log('error callback');
        });
      },
      handerList: function (number) {
        this.$http.post('/api/v1.0/client/checkStaffWechat').then(response => { //查询员工是否有绑定手机
          if (!response.body.result) {
            Indicator.close();
          }
          if (number == 1) {//此处判断是当提交的时候判断下是否已经绑定过
            if (response.body.code === 500) {
//            MessageBox('提示', response.body.message);
              this.alertMessageShow = true;
              this.errorModel = true;
              this.noneModel = false; //隐藏没有记录
              this.alertMessage = response.body.message;
              return;

            }
          }

          if (response.body.code === 200) {
            let isbing = response.body.result.phone;
            this.setCookie('iphoneNumber', isbing, 365);//缓存手机号码用于查看公司manyCompany
            //初始化查询看是否有是一个公司进行跳转signCard  开始
            let number = {
              phone: isbing,
            };
            this.$http.get('/api/v1.0/client/findCompanies/' + number.phone).then(response => { //初始化查询有没有公司
              console.log('这个data是查询公司的' + response.body.result);
              //若是没有公司在此处执行下一个页面  ?/？
              if (!response.body.result) {
                Indicator.close();
              }
              if (response.body.result) {
                this.sumSearchUid = response.body.result;

                if (response.body.result.length === 1) {
                  //如果等于1就进入 signCard 点击打卡
                  let param = {
                    "companyUid": this.sumSearchUid[0].uid,
                  };
                  this.$http.post('/api/v1.0/client/chooseCompany', param).then(response => { //选择公司
                    if (response.body.code === 200) {
                      this.$router.push({path: '/signCard'});
                    }
                    Indicator.close();//关闭加载
                  }, response => {
                    console.log('error callback');
                  });
                } else {
                  this.handerCome(); //如果不是只有一个公司进行选择公司
                }
              }
              //添加查询是否有员工
              if (response.body.code === 500) {
                this.isCompany = true;
              }
            }, response => {
//              console.log('findCompanies error callback');
            });
            //初始化查询看是否有是一个公司进行跳转signCard  开始
          } else if (response.body.code === 1001) {
//              MessageBox('提示', response.body.message);
            this.alertMessageShow = true;
            this.errorModel = true;
            this.noneModel = false; //隐藏没有记录
            this.alertMessage = response.body.message;
            return;
          }
        }, response => {
          console.log('error callback');
        });
      },
      handerCome: function () {
        Indicator.close();//关闭加载
        this.$router.push({path: '/ManyCompany'});
      },
      changeCompany(){
        let param = {
          "companyUid": this.sumSearchUid.UID,
        };
        this.$http.post('/api/v1.0/client/chooseCompany', param).then(response => {
          if (response.body.code === 200) {
            this.$router.push({path: '/signCard'});
          }
        }, response => {
          console.log('error callback');
        });
      },
      closeClick(){
        this.errorModel = false;
      }
    },
    components: {}
  }
</script>

<style scoped>
  .imageClassSuccess {
    width: 16rem;
    height: 12rem;
    border-radius: 4px;
  }

  .alertImages {
    width: 100%;
    height: 100%;
    display: block;
    text-align: center;
  }

  .hello {
    background: #ffffff;
    height: 100vh;
  }

  .logo {
    width: 100%;
    height: 3rem;
  }

  .insterInput input {
    height: 2.6rem;
    width: 100%;
  }

  .verification span {
    font-size: 0.7rem;
  }

  .verification button {
    width: 98%;
    height: 100%;
  }

  .verification label span {
    display: block;
  }

  .inputValidation input {
    width: 95%;
    height: 2.6rem;
  }

  .confirmBinding button {
    width: 97%;
  }

  p {
    font-weight: 600;
    font-size: 1.2rem;

  }

  .h1Class {
    font-size: 1.4rem;
  }

  .titlesSmall {
    font-size: 1.2rem;
  }
</style>
