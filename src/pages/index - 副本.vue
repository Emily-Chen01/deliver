<template>
  <div class="hello">
    <p class="h1Class">{{ msg }}</p>
    <p class="titlesSmall">{{ msgPhone }}</p>
    <div style="margin: 5rem 0 1.5rem 0">
      <div class="insterInput">
        <input v-model="phoneNumber" type="text" class="inputStyle" placeholder="手机号" />
      </div>
      <div class="verification"><mt-button type="default" @click.native="handerClick" style="background-color: rgb(191,205,218);"><span>获取短息验证码</span></mt-button> </div>
    </div>
    <div class="inputValidation"><input type="text"  v-model="phoneNumberValue" class="inputStyle"  placeholder="请输入验证码"/> </div>
    <div class="confirmBinding">
      <mt-button type="primary" style="background-color: rgb(139,156,172);" @click.native="handerSubmit">绑定手机号</mt-button>
    </div>
    <!--<router-link to="/manyCompany"@click.native="handerCome" >点击</router-link>-->
    <!--<router-view></router-view>-->
  </div>
</template>

<script>
import { Navbar, TabItem,Toast,MessageBox } from 'mint-ui';
import ManyCompany from "@/components/register/manyCompany"


export default {

  name: 'hello',
  data() {
    return {
      msg: '欢迎使用 EHR SAAS 员工自助服务',
      msgPhone: '您需要先绑定手机!',
      phoneNumber:'',
      phoneNumberValue:'',//验证码值
      t1:'',
      t2:'',
      t3:'',
      t4:'',

    }
  },
  created: function () {


    this.$http.get('/api/v1.0/wechat/sign').then(response => { //获取签名接口开始
      console.log(response.body.result);
      this.t1=response.body.result.appid;
      console.log(this.t1);
      this.t2=response.body.result.timestamp;
      this.t3=response.body.result.nonceStr;
      this.t4=response.body.result.signature;

      wx.config({
        debug: false,
        appId: this.t1,
        timestamp: this.t2,
        nonceStr: this.t3,
        signature: this.t4,
        jsApiList: [
          'getLocation'
        ]
      });

    }, response => {
      console.log( 'error callback');
    });


    wx.ready(function () {
      wx.error(function(res){
        alert('wx.error错误信息'+res)
        console.log(res)
        console.log(res)

      });
      wx.checkJsApi({
        jsApiList: [
          'getLocation'
        ],
        success: function (res) {
          wx.getLocation({
            success: function (res) {
              var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
              var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
              var speed = res.speed; // 速度，以米/每秒计
              var accuracy = res.accuracy; // 位置精度
             alert('纬度'+latitude+'经度'+longitude);
              console.log('纬度'+latitude+'经度'+longitude);
              console.log('纬度'+latitude+'经度'+longitude);

            },
            cancel: function (res) {
              alert('用户拒绝授权获取地理位置');
            }
          });
//          alert('微信版本！');
          // alert(JSON.stringify(res));
          // alert(JSON.stringify(res.checkResult.getLocation));
          if (res.checkResult.getLocation == false) {
            alert('你的微信版本太低，不支持微信JS接口，请升级到最新的微信版本！');
            return;
          }
        }
      });


    });












    console.log( window.location.href);
//    var _href=window.location.href;
//
//    function getUrlParam(url, name) { //获取地址栏的参数
//      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
//      var r = url.substring(url.indexOf('?') + 1).match(reg);
//      if (r != null) return unescape(r[2]);
//      return null;
//    }
////    getUrlParam(_href, "openid");
//   var openID=getUrlParam(_href, "openid");
//    if (openID==null) {
//         window.location.href="http://192.168.140.72:8080/api/v1.0/wechat";
//         return;
//    }
//    console.log(openID);
//    sessionStorage.setItem('openId', openID);
  },
  methods: {
    handerClick(){
      sessionStorage.setItem('iphoneNumber', this.phoneNumber); //缓存手机号码用于查看公司manyCompany
      alert('获取验证码');

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
        this.handerList();
      }, response => {
        console.log( 'error callback');
      });
    },
    handerList:function (){
      let phoneObj={
        "phone":this.phoneNumber
      }
      this.$http.get('/api/v1.0/client/findCompanies/'+phoneObj.phone).then(response => { //查询员工是否有绑定手机
        console.log(response.body.code);
        if(response.body.code==500){
//          Toast({
//            message: '抱歉没有找到您的员工记录，请联系您的HR',
//            iconClass: 'mint-toast-icon mintui mintui-success'
//          });
          MessageBox('提示', '抱歉没有找到您的员工记录，请联系您的HR');

        }else if(response.body.code==200){
              this.handerCome();
        }else  if(response.body.code==1001){
              alert("登录超时");
        }
      }, response => {
        console.log( 'error callback');
      });
    },
    haha:function (){
        alert(11);
    },
    handerCome:function (){
      this.$router.push({path:'/ManyCompany'});
//      this.$router.beforeEach((ManyCompany, Index, haha) => {
//        console.log('测试')
//        haha(ManyCompany)
//      })
    }


  },

  components: {
  }

}
</script>

<style scoped>
.hello{
  margin-top: 4rem;
}
.insterInput{
  width: 14rem;
  height: 2rem;
  display: inline-block;
}
.insterInput input{
  height: 2.6rem;
  width: 99%;
}
.verification{
  width: 8.8rem;
  height: 0.7rem;
  font-size: 1rem;
  display: inline-block;
  margin-bottom: 2rem;
}
.verification span{
  font-size: 0.7rem;
}
.verification button{
  width: 96.5%;
}
.inputValidation {
  margin: 1rem 0 0.5rem 0;
}
.inputValidation input{
  width: 96%;
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
