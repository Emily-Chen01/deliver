<template>
  <div class="hello">
    <p>{{ msg }}</p>
    <p class="titlesSmall">{{ msgPhone }}</p>
    <div style="margin: 5rem 0 1.5rem 0">
      <div class="insterInput"><input v-model="phoneNumber" type="text" placeholder="手机号"/> </div>
      <div class="verification"><mt-button type="default" @click.native="handerClick"><span>获取短息验证码</span></mt-button> </div>
    </div>

    <div class="inputValidation"><input type="text" placeholder="请输入验证码"/> </div>
    <div class="confirmBinding">
      <mt-button type="primary">绑定手机号</mt-button>
    </div>


  </div>
</template>

<script>
import { Navbar, TabItem,Toast,MessageBox } from 'mint-ui';
export default {
  name: 'hello',
  data() {
    return {
      msg: '欢迎使用 EHR SAAS 员工自助服务',
      msgPhone: '您需要先绑定手机!',
      phoneNumber:'18550045759',
      paramVerification:{
        "phone":18601421739,
        "type":1,
        "code":"159216",
        "passwd":123456,
        "confirmPasswd":123456
      }

    }
  },
  created() {

  },
  mounted: function() {

  },
  methods: {
    handerClick(){
        console.log(this.paramVerification)
//      MessageBox('提示', '请联系您的HR绑定手机');
      this.$http.post('/api/v1.0/account/signup',this.paramVerification).then(response => {
        console.log(1234);
        console.log(response);
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

.insterInput{
  width: 14rem;
  height: 2rem;
  display: inline-block;
}
.insterInput input{
  height: 2.2rem;
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
  height: 2rem;
}
.confirmBinding{
  padding-top: 3rem;
}
.confirmBinding button{
  width: 99%;
}
</style>
