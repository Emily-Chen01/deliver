<template>
  <div >
    <div style="width: 100%;height: 18rem;background: #ffffff" >
      <div style="width: 100%;height: 8rem;padding-top: 2rem">
        <div style="display: inline-block; width: 5.2rem;height: 5.2rem;border-radius: 2.6rem;">
          <img :src="imgSrc.header" class="avatarTop">
        </div>
      </div>
      <div class="confirmBinding">
        <mt-button type="primary"  size="large" @click.native="handerUnbundling">解除绑定</mt-button>
      </div>
      <div>
        <div style="text-align: center;margin-top: 2rem">客服热线 ：0512-88998989</div>
      </div>
      <div class="bottomTool">
        <div style="position: relative">
          <div style="width: 50%;float: left"  @click="routerTool(1)">
            <div style="height: 20px;width: 20px; text-align: center; margin: auto;padding-top: 1rem;">
              <img :src="imgSrc.doIconBlue" class="avatar" v-if="initBlue">
              <img :src="imgSrc.doIcon" class="avatar" v-if="init">
            </div>
            <div style="height: 1.5rem;padding-top: 0.5rem;" v-if="init">工作台</div>
            <div style="height: 1.5rem;padding-top: 0.5rem;color:#20a0ff" v-if="initBlue">工作台</div>
          </div>
          <div style="width: 50%;float: right"  @click="routerTool(2)">
            <div style="height: 20px;width: 20px;text-align: center; margin: auto;padding-top: 1rem;">
              <img :src="imgSrc.setIconBlue" class="avatar" v-if="initBlueSet">
              <img :src="imgSrc.setIcon" class="avatar"  v-if="initSet">
            </div>
            <div style="height: 1.5rem;padding-top: 0.5rem;"  v-if="initSet">设置</div>
            <div style="height: 1.5rem;padding-top: 0.5rem;color:#20a0ff" v-if="initBlueSet">设置</div>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
  import { DatetimePicker } from 'mint-ui';

  export default {
    data(){
      return {
          init:'',
        initBlue:'',
        initBlueSet:'',
        initSet:'',
        imgSrc: {
//          shenFenIcon: require('../../assets/shenfenzheng.png'),
          doIcon: require('../../assets/ico_workbench_2.png'),
          doIconBlue: require('../../assets/ico_workbench_1.png'),

          setIconBlue: require('../../assets/ico_setting_1.png'),
          setIcon: require('../../assets/ico_setting_2.png'),

          header:  require('../../assets/tx.png'),


        },
      }
    },
    created: function () {
        if(this.getCookie('avatarImages')){

          this.imgSrc.header=this.getCookie('avatarImages');
        }

      this.init=true;
      this.initBlueSet=true;
      this.initSet=false;

    },

    methods: {
      handerUnbundling(){
        this.$http.post('/api/v1.0/client/unbind').then(response => {
          console.log('解除绑定');
          this.$router.push({path:'/index'});
        }, response => {
          console.log( 'error callback');
        });
      },
      routerTool(number){
          if(number==1){
            this.init=false;
            this.initBlue=true;
            this.initBlueSet=false;
            this.initSet=true;
            this.$router.push({path:'/signCard'});
          }
        if(number==2){

          this.$router.push({path:'/set'});
        }
      },
    },

    components: {
      //      ManyCompany
    }
  }

</script>

<style scoped>
  .confirmBinding{
    padding: 0 0.5rem;
  }
  .bottomTool{
    position:fixed;
    bottom:0;
    width: 100%;
    height: 5rem;
    /*line-height: 4rem;*/
    background: #ffffff;
  }
  .avatar{
    width: 100%;
    height: 100%;
    display: block;
    text-align: center!important;
    /*padding-top: 0.3rem;*/
    /*padding: 1rem 0 0 0.7rem;*/
  }
  .avatarTop{
    width: 92%;
    height: 94%;
    display: block;
    text-align: center!important;
    padding: 0.1rem 0 0 0.2rem;
    border-radius: 4rem;
    z-index: 0;
  }
  .dataTitle span{
    font-size: 1.4rem;
  }
  .changeSelect{
    width: 14rem;
    display: block;
    height: 2.5rem;
    border: none;
    font-size: 1.22rem;
  }
  .cardClass{
    width: 11rem;
    height: 6rem;
    line-height: 6rem;
    padding-bottom: 1rem;
    position: absolute;
    left: -15rem;
    top: -3rem;
  }
  .cardClass div{
    width: 9rem;
    height: 1.2rem;
    position: absolute;
    top:2.8rem;
    font-size: 1.1rem;
  }
  .CardImg{
    display: block;
    width: 80%;
    height: 80%;
    padding-left: 0rem;

  }
  .myApply{
    width: 23.2rem;
    height: 14.5rem;
    margin-top: 1rem;
    border-radius: 6px;
    border: 1px solid #cccccc;
  }
  .myApplyTitleLeft{
    width: 7rem;
    height: 3rem;
    line-height: 3rem;
    float: left;
    font-weight: 600;
    font-size:1.3rem ;
  }
  .myApplyContentLeft{
    width: 7rem;
    height: 3rem;
    line-height: 3rem;
    text-align: left;
    font-weight: 600;
    padding-left: 0.8rem;
    font-size:1.2rem ;
  }
  .myApplyContentNr{
    width: 22rem;
    height: 1rem;
    line-height: 1rem;
    text-align: left;
    padding-left: 0.8rem;
    font-size:1.2rem ;
  }
  .myApplyBottomNrLeft{
    width: 6.5rem;
    display: inline-block;
    height: 1rem;
    line-height: 1rem;
    text-align: left;
    font-size:1.2rem ;
  }
  .myApplyBottomNrRight{
    width: 15rem;
    display: inline-block;
    height: 1rem;
    line-height: 1rem;
    text-align: left;
    font-size:1.2rem ;
  }
  .myApplyTitleRight{
    width: 7rem;
    height: 3rem;
    line-height: 3rem;
    float: right;
    font-weight: 600;
    font-size:1.3rem ;
  }
</style>
