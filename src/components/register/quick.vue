<template>
    <div>
        <div style="margin-top: 15rem">
          <mt-button size="small" @click="handerClickBing()">员工绑定</mt-button>
          <mt-button size="small" @click="handerClickQuick">快捷打卡</mt-button>
        </div>
    </div>
</template>
<script>

    export default {
        data(){
            return {}
        },
        created: function () {

        },
        methods: {
          handerClickBing(){

            let phoneObj={
              "openid":"2"
            }
            this.$http.post('api/v1.0/client/checkStaffWechat',phoneObj).then(response => { //查询员工是否有绑定手机
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
            let phoneObj={
              "openid":"2"
            }
            this.$http.post('api/v1.0/client/checkStaffWechat',phoneObj).then(response => { //查询员工是否有绑定手机
              console.log(response.body.code);
              if(response.body.code==200){
                this.$router.push({path:'/signIn'});
              }else if(response.body.code==200){

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
