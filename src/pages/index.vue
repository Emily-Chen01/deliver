<template>
  <div class="hello" style="padding: 0 8px" >
    <div class="logo"><img :src="imgSrc.bg" style="width: 50%;height: 99.5%"></div>
    <p class="h1Class">{{ msg }}</p>
    <p class="titlesSmall">{{ msgPhone }}</p>
    <div style="margin: 5rem 0 1.5rem 0;display: flex;width: 97.5%">
      <div class="insterInput">
        <input v-model="phoneNumber" type="text" class="inputStyle" placeholder="手机号" />
      </div>
      <div class="verification"><mt-button type="primary" @click.native="handerClick" ><span>获取验证码</span></mt-button> </div>
    </div>
    <div class="inputValidation"><input type="text"  v-model="phoneNumberValue" class="inputStyle"  placeholder="请输入验证码"/> </div>
    <div class="confirmBinding">
      <mt-button type="primary"  @click.native="handerSubmit">绑定手机号</mt-button>
    </div>
    <!--<baidu-map :center="center" @ready="handler" ></baidu-map>-->

    <!--<router-link to="/manyCompany"@click.native="handerCome" >点击</router-link>-->
    <!--<router-view></router-view>-->
  </div>
</template>

<script>
import { Navbar, TabItem,Toast,MessageBox } from 'mint-ui';
import ManyCompany from "@/components/register/manyCompany"
import Vue from 'vue'

    let jwresult={"lat":0.0, "lng":0.0};

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
      t1:'',
      t2:'',
      t3:'',
      t4:'',
      center: {
        lng: 121.738688,
        lat: 31.571045
      },
      latitude:'',
      longitude:'',
      radius: '',
      yyy:false,
      result:{"lat":0.0, "lng":0.0},
      sumSearch:'',
      sumSearchUid:[],
      isCompany:'',

//      isbing:'',

    }
  },
  created: function () {

         this.handerList();        //先查询是否有绑定 有返回手机号



//    (function() {
//      let path = '/api/v1.0/wechat';
//      let protocol = location.protocol;
//      let hostname = location.hostname;
//      console.log('customize', `${protocol}//${hostname}${path}`);
//    })();





    //获取openidstart  6-2早注释为了本地测试 提交需解除注释
//      var _href=window.location.href;
//    console.log( window.location.href);
//
//      function getUrlParam(url, name) { //获取地址栏的参数
//        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
//        var r = url.substring(url.indexOf('?') + 1).match(reg);
//        if (r != null) return unescape(r[2]);
//        return null;
//      }
////    getUrlParam(_href, "openid");
//      var openID=getUrlParam(_href, "openid");
//
//      if (openID==null) {
//        let path = '/api/v1.0/wechat';
//        let protocol = location.protocol;
//        let hostname = location.hostname;
////        console.log(`${protocol}//${hostname}${path}`);
//        window.location.href = `${protocol}//${hostname}${path}`;
//        return;
//      }
//        this.setCookie('openId',openID,365);
//        console.log('openid修改过的'+this.getCookie('openId'));


    //获取openid end







  },



  methods: {
    handerClick(){
//      localStorage.setItem('iphoneNumber', this.phoneNumber); //缓存手机号码用于查看公司manyCompany
      this.setCookie('iphoneNumber',this.phoneNumber,365);

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

            this.$http.get('/api/v1.0/client/findCompanies/'+this.phoneNumber).then(response => {
                if(response.body.code==500){
                  MessageBox('提示', '抱歉没有找到您的员工记录，请您的联系HR');
                  return;
                }

                if(response.body.code==200){

                //查询是否有公司进行绑定start
                  let bindingObj={
                    "code":this.phoneNumberValue,
                    "phone":this.phoneNumber,

                  }
                  this.$http.post('/api/v1.0/client/bind',bindingObj).then(response => { //进行手机号码进行绑定
                    console.log(111);
                    console.log(response);

                }, response => {
                console.log( 'error callback');
              });
                  //查询是否有公司进行绑定end

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

                }

            }, response => {
              console.log( 'error callback');
            });





//        this.handerList(1); //提交的时候验证下是否有过绑定手机

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
//          localStorage.setItem('iphoneNumber', isbing); //缓存手机号码用于查看公司manyCompany
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


//    handler ({BMap, map}) {
//      console.log(BMap, map);
//      console.log(this.latitude);
//      console.log(this.latitude);
//      console.log(this.latitude);
//      this.$http.get('/api/v1.0/wechat/sign').then(response => { //获取签名接口开始
//        console.log(response.body.result);
//        this.t1=response.body.result.appid;
//        console.log(this.t1);
//        this.t2=response.body.result.timestamp;
//        this.t3=response.body.result.nonceStr;
//        this.t4=response.body.result.signature;
//        this.yyy=true;
//
//        wx.config({
//          debug: false,
//          appId: this.t1,
//          timestamp: this.t2,
//          nonceStr: this.t3,
//          signature: this.t4,
//          jsApiList: [
//            'getLocation'
//          ]
//        });
//
//
//      }, response => {
//        console.log( 'error callback');
//      });
//
//
//      wx.ready(function () {
//        wx.error(function(res){
//          alert('wx.error错误信息'+res)
//          console.log(res)
//          console.log(res)
//
//        });
//        wx.checkJsApi({
//          jsApiList: [
//            'getLocation'
//          ],
//          success: function (res) {
//            wx.getLocation({
//              type:'gcj02',
//              success: function (res) {
//                this.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90           res.latitude;
//                this.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。     res.longitude;
//                var speed = res.speed; // 速度，以米/每秒计
//                var accuracy = res.accuracy; // 位置精度
//                alert(speed);
//                alert(accuracy);
//
//             function  Convert_GCJ02_To_BD09($lng,$lat,$result){  //腾讯转换百度经纬度
//                  var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
//                  var x = $lng;
//                  var y = $lat;
//                  var z =Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
//                  var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
//                  $lng = z * Math.cos(theta) + 0.0065;
//                  $lat = z * Math.sin(theta) + 0.006;
//                  console.log( $lng,$lat);
//                  $result.lat =$lat;
//                  $result.lng =$lng ;
//                  console.log($result);
//                  console.log(this);
//
//               return  $result;
//                };
//                var shuzi=Convert_GCJ02_To_BD09(this.longitude,this.latitude,jwresult);
//                console.log('下面是转后');
//                console.log(shuzi);
//
//                alert('纬度'+shuzi.lat+'经度'+shuzi.lng);
//                let distance=map.getDistance(new BMap.Point(120.738232,31.271393), new BMap.Point(shuzi.lng, shuzi.lat));
//                if(distance<1000){
//                  alert('区域内'+map.getDistance(new BMap.Point(120.738232,31.271393), new BMap.Point(shuzi.lng, shuzi.lat)));
//                }else{
//                  alert('区域外'+map.getDistance(new BMap.Point(120.738232,31.271393), new BMap.Point(shuzi.lng, shuzi.lat)));
//                }
//
//              },
//              cancel: function (res) {
//                alert('用户拒绝授权获取地理位置');
//              }
//            });
////          alert('微信版本！');
//            // alert(JSON.stringify(res));
//            // alert(JSON.stringify(res.checkResult.getLocation));
//            if (res.checkResult.getLocation == false) {
//              alert('你的微信版本太低，不支持微信JS接口，请升级到最新的微信版本！');
//              return;
//            }
//          }
//        });
//
//
//      });




//    }


  },

  components: {
  }

}
</script>

<style scoped>
.hello{
  margin-top: 4rem;
}
.logo{
  width: 100%;
  height: 3rem;
}
.insterInput{
  flex: 2.8;
}
.insterInput input{
  height: 2.6rem;
  width: 95%;
}
.verification{
 flex: 1.2;
  height: 1.2rem;
  font-size: 1rem;
  margin-bottom: 2rem;
}
.verification span{
  font-size: 0.7rem;
}
.verification button{
  width: 98%;
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
