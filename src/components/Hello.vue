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
import { Navbar, TabItem,Toast,mtTabContainerItem } from 'mint-ui';
export default {
  name: 'hello',
  data() {
    return {
      msg: '欢迎使用 EHR SAAS 员工自助服务',
      msgPhone: '您需要先绑定手机',
      phoneNumber:'185500454656'

    }
  },
  mounted: function() {

  },
  methods: {
    handerClick(){
        console.log(this.phoneNumber)
    },

  },

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
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}
.dd{
  font-size: 1.2rem;
  width: 9.4rem;
  height: 3rem;
  display: inline-block;
}
p{
  text-align: center;
  font-size: 1.1rem;
  height: 1rem;
  font-weight: 600;
}
 .titlesSmall{
  font-size: 1rem;
  height: 0.8rem;
   font-weight: 600;
 }
li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
