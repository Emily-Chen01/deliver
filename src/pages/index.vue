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
    <div class="inputValidation"><input type="text" class="inputStyle"  placeholder="请输入验证码"/> </div>
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
      phoneNumber:'18021611639',
      paramVerification:{
        "phone":18601421739,
        "type":1,
        "code":"159216",
        "passwd":123456,
        "confirmPasswd":123456
      },
    }
  },
  methods: {
    handerClick(){
        console.log(this.paramVerification)
    },
    handerSubmit(){
        let bindingObj={
          "openid":"2",
          "phone":this.phoneNumber
        }
      this.$http.post('api/v1.0/client/bind',bindingObj).then(response => { //进行手机号码进行绑定
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
      this.$http.get('api/v1.0/client/findCompanies/'+phoneObj.phone).then(response => { //查询员工是否有绑定手机
        console.log(response.body.code);
        if(response.body.code==500){
          Toast({
            message: '抱歉没有找到您的员工记录，请联系您的HR',
            iconClass: 'mint-toast-icon mintui mintui-success'
          });

        }else{
            if(response.body.code==200){
              this.handerCome();
            }
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
