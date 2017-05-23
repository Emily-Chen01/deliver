<template>
    <div>
      <div style="text-align: center;color: chartreuse;font-size: 1.5rem">您好欢迎进入</div>
      <div>openid:<input type="text" v-model="allOpenId"></div>
      <div style="margin-top: 15rem;">
          <mt-button size="small" @click="handerClickBing()">员工绑定</mt-button>
          <mt-button size="small" @click="handerClickQuick">快捷打卡</mt-button>
        </div>
    </div>
</template>
<script>
  import { MessageBox } from 'mint-ui';
let openIdD;

    export default {
        data(){
            return {
              allOpenId:'',
            }
        },
        created: function () {
//          this.$http.get('/api/v1.0/wechat').then(response => { //opind
//            console.log(response);
//
//
//          }, response => {
//            console.log( 'error callback');
//          });
//          window.location.href= "http://192.168.140.72:8080/api/v1.0/wechat";
          var thisHREF = document.location.href;
//          alert(thisHREF);
//          console.log( window.location);

//          alert()
        },
        watch:{
          allOpenId:function(val){
            sessionStorage.setItem('openId', val);
          }
        },
        methods: {
          handerClickBing(){

            this.$http.post('/api/v1.0/client/checkStaffWechat').then(response => { //查询员工是否有绑定手机
              console.log(response.body.code);
              if(response.body.code==200){
                this.$router.push({path:'/ManyCompany'});
              }else{
                this.$router.push({path:'/index'});
              }
            }, response => {
              console.log( 'error callback');
            });

          },
          handerClickQuick(){
            this.$http.post('/api/v1.0/client/checkStaffWechat').then(response => { //查询员工是否有绑定手机
              console.log(response.body.code);
              if(response.body.code==200){
                this.$router.push({path:'/signIn'});
              }else if(response.body.code==500){
                MessageBox.confirm('暂未绑定，确认进行绑定').then(action => {
                  this.$router.push({path:'/index'});
                });
              }else  if(response.body.code==1001){
                alert("登录超时");
              }
            }, response => {
              console.log( 'error callback');
            });
          }
        },

        components: {
            //      ManyCompany
        }
    }

</script>

<style scoped>

</style>
