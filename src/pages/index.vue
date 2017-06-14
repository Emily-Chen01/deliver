<template>
  <div class="hello" style="padding: 0 8px" >
    <div style="height: 5rem;"></div>
    <div class="logo"><img :src="imgSrc.bg" style="width: 50%;height: 99.5%"></div>
    <p class="h1Class">{{ msg }}</p>
    <p class="titlesSmall">{{ msgPhone }}</p>
    <div style="clear:both"></div>
      <div style="margin: 5rem 0 1.5rem 0;width: 97.5%">
        <div class="insterInput">
          <input v-model="phoneNumber" type="text" class="inputStyle" placeholder="手机号" />
        </div>
        <div class="verification">
          <mt-button type="primary"  :disabled="YZdisabled" id="aaa"   @click.native="handerClick()" >
            <span>{{yanzheng}}</span>
          </mt-button>
        </div>
      </div>
      <div style="clear:both"></div>
      <div class="inputValidation"><input type="text"  v-model="phoneNumberValue" class="inputStyle"  placeholder="请输入验证码"/> </div>
    <div class="confirmBinding">
      <mt-button type="primary"  @click.native="handerSubmit">绑定手机号</mt-button>
    </div>
  </div>
</template>

<script>
import { Navbar, TabItem,Toast,MessageBox } from 'mint-ui';
import ManyCompany from "@/components/register/manyCompany"
import Vue from 'vue'

    let jwresult={"lat":0.0, "lng":0.0};
let timer1 = null;

export default {

  name: 'hello',
  data() {
    return {
      imgSrc: {
        bg: require('../assets/indexLogo.png'),
      },
      msg: '欢迎使用 EHR SAAS 员工自助服务',
      msgPhone: '您需要先绑定手机!',
      phoneNumber:'',
      phoneNumberValue:'',//验证码值
      yyy:false,
      result:{"lat":0.0, "lng":0.0},
      sumSearch:'',
      sumSearchUid:[],
      isCompany:'',
      yanzheng:'获取验证码' ,//验证码
      YZdisabled:false,


    }
  },
  created: function () {

         this.handerList();        //先查询是否有绑定 有返回手机号


    //获取openidstart  6-2早注释为了本地测试 提交需解除注释
      var _href=window.location.href;
    console.log( window.location.href);

      function getUrlParam(url, name) { //获取地址栏的参数
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = url.substring(url.indexOf('?') + 1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
      }
//    getUrlParam(_href, "openid");
      var openID=getUrlParam(_href, "openid");

      if (openID==null) {
        let path = '/api/v1.0/wechat';
        let protocol = location.protocol;
        let hostname = location.hostname;
//        console.log(`${protocol}//${hostname}${path}`);
        window.location.href = `${protocol}//${hostname}${path}`;
        return;
      }
        this.setCookie('openId',openID,365);
        console.log('openid修改过的'+this.getCookie('openId'));


    //获取openid end



  },



  methods: {
    handerClick(){
      this.setCookie('iphoneNumber',this.phoneNumber,365);

      let self = this;
      clearInterval(timer1); //开启前清除下已经开的定时器

      var countdown=30;
      function settime() {
        if (countdown == 0) {
          self.yanzheng="获取验证码";
          countdown = 30;
          self.YZdisabled=false;
          clearInterval(timer1);
          return;
        } else {
            self.yanzheng="重新发送(" + countdown + ")";
            countdown--;
            self.YZdisabled=true;
            var rr=document.getElementById('aaa');
//            rr.style.color= "#ffffff"; //这个方法可以设置不可用的背景颜色
        }

      }
      timer1= setInterval(settime,1000);




//      alert('获取验证码');

      let number={
          phone :this.phoneNumber,
      };
      this.$http.get('/api/v1.0/client/code/'+number.phone).then(response => { //获取验证码

      }, response => {
        console.log( 'error callback');
      });
    },
    handerSubmit(){

      let bindingObj={
        "code":this.phoneNumberValue,
        "phone":this.phoneNumber,

      }
      this.$http.post('/api/v1.0/client/bind',bindingObj).then(response => { //进行手机号码进行绑定
        console.log(111);
        console.log(response);
//            this.$router.push({path:'/signCard'});//进行跳转 条件还需增加5-31 19:20
//            this.handerList();
          this.$http.get('/api/v1.0/client/findCompanies/'+this.phoneNumber).then(response => {
            this.sumSearchUid=response.body.result;
            if(response.body.code==500){
              MessageBox('提示', '抱歉没有找到您的员工记录，请您的联系HR');
              return;
            }

              if(response.body.result.length==1){
                //如果等于1就进入 signCard 点击打卡
                let param={
                  "companyUid":this.sumSearchUid[0].uid,
                }
                this.$http.post('/api/v1.0/client/chooseCompany',param).then(response => { //选择公司
                  console.log('选择公司接口');
//                      if(response.body.code==200){
                  this.$router.push({path:'/signCard'});
                  return;
//                      }
                }, response => {
                  console.log( 'error callback');
                });
              }else{
                this.handerCome(); //如果不是只有一个公司进行选择公司

              };

          }, response => {
            console.log( 'error callback');
          });

//        this.handerList(1); //提交的时候验证下是否有过绑定手机
      }, response => {
        console.log( 'error callback');
      });
    },
    handerList:function (number){
      this.$http.post('/api/v1.0/client/checkStaffWechat').then(response => { //查询员工是否有绑定手机
        console.log('dddd',response);
//        alert('查询绑定');

        if(number==1){//此处判断是当提交的时候判断下是否已经绑定过
          if(response.body.code==500){
            MessageBox('提示', response.body.message);

          }
        }

            if(response.body.code==200){
         let isbing=response.body.result.phone;
              this.setCookie('iphoneNumber',isbing,365);//缓存手机号码用于查看公司manyCompany

//              alert('iphoneNumber'+this.getCookie('iphoneNumber'));


              //初始化查询看是否有是一个公司进行跳转signCard  开始
              let number={
                phone :isbing,
              };
              this.$http.get('/api/v1.0/client/findCompanies/'+number.phone).then(response => { //初始化查询有没有公司
                console.log('这个data是查询公司的'+response.body.result);
                //若是没有公司在此处执行下一个页面  ?/？
                console.log(response.body.result.length);
                this.sumSearchUid=response.body.result;

                if(response.body.result.length==1){
                   //如果等于1就进入 signCard 点击打卡
                    let param={
                      "companyUid":this.sumSearchUid[0].uid,
                    }
                    this.$http.post('/api/v1.0/client/chooseCompany',param).then(response => { //选择公司
                      console.log('选择公司接口');
//                      if(response.body.code==200){
                        this.$router.push({path:'/signCard'});
//                      }
                    }, response => {
                      console.log( 'error callback');
                    });
                }else{
                  this.handerCome(); //如果不是只有一个公司进行选择公司

                };
                //添加查询是否有员工
                if(response.body.code==500){
                    this.isCompany=true;

                }
              }, response => {
                console.log( 'findCompanies error callback');
              });
              //初始化查询看是否有是一个公司进行跳转signCard  开始

        }else  if(response.body.code==1001){
              MessageBox('提示', response.body.message);
        }
      }, response => {
        console.log( 'error callback');
      });
    },
    handerCome:function (){
      this.$router.push({path:'/ManyCompany'});
//      this.$router.beforeEach((ManyCompany, Index, haha) => {
//        console.log('测试')
//        haha(ManyCompany)
//      })
    },
    changeCompany(){
      let param={
        "companyUid":this.sumSearchUid.UID,
      }
      this.$http.post('/api/v1.0/client/chooseCompany',param).then(response => {
        console.log('选择公司接口');
        if(response.body.code==200){
          this.$router.push({path:'/signCard'});
        }
      }, response => {
        console.log( 'error callback');
      });
    },


  },

  components: {
  }

}
</script>

<style scoped>
.hello{
  /*margin-top: 4rem;*/
  background: #ffffff;
  height: 100vh;
}
.logo{
  width: 100%;
  height: 3rem;
}
.insterInput{
  width:64%;
  float:left;
}
.insterInput input{
  height: 2.6rem;
  width: 95%;
}
.verification{
  width:33%;
  float:right;
  height: 2.9rem;
  font-size: 1rem;
  margin-bottom: 2rem;
}
.verification span{
  font-size: 0.7rem;
}
.verification button{
  width: 98%;
  height:100%;
}
.inputValidation {
  margin: 0.2rem 0 0.5rem 0;
}
.inputValidation input{
  width: 95%;
  height: 2.6rem;
}
.confirmBinding{
  padding-top: 3rem;
}
.confirmBinding button{
  width: 97%;
}
.inputStyle{
  border: solid 1px #cccccc;border-radius: 4px;font-size: 1.2rem;
}
  p{
    font-weight: 600;
    font-size: 1.2rem;

  }
  .h1Class{
    font-size: 1.4rem;
  }
  .titlesSmall{
    font-size: 1.2rem;
  }
</style>
