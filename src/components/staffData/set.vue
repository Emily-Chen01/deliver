<template>
  <div >
    <div >
      <div style="width: 100%;height: 8rem;margin-top: 4rem;">
        <div style="display: inline-block; width: 5.2rem;height: 5.2rem; background-color: #cccccc;border-radius: 2.6rem;">
          <img :src="imgSrc.shenFenIcon" class="avatar">
        </div>
      </div>
      <div class="confirmBinding">
        <mt-button type="primary"  size="large" @click.native="handerUnbundling">解除绑定</mt-button>
      </div>
      <div>
        <div style="text-align: center;margin-top: 2rem">客服热线 ：0512-88998989</div>
      </div>
      <div class="bottomTool">
        <div style="display: flex;position: relative">
          <div style="flex: 2"  @click="routerTool(1)">
            <div style="height: 1.8rem;width: 2rem;position: absolute;top: -0.4rem;left: 5rem;">
              <img :src="imgSrc.doIcon" class="avatar">
            </div>
            <div style="height: 1.5rem;position: absolute;left: 5rem;top:2.4rem">工作台</div>
          </div>
          <div style="flex: 2"  @click="routerTool(2)">
            <div style="height: 1.8rem;width: 2rem;position: absolute;top: -0.4rem;left: 16.5rem;">
              <img :src="imgSrc.setIcon" class="avatar">
            </div>
            <div style="height: 1.5rem;position: absolute;left: 17rem;top:2.4rem">设置</div>
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
        imgSrc: {
          shenFenIcon: require('../../assets/shenfenzheng.png'),
          doIcon: require('../../assets/ico_workbench_2.png'),
          setIcon: require('../../assets/ico_setting_1.png'),
        },
      }
    },
    created: function () {
      this.imgSrc.shenFenIcon=this.getCookie('avatarImages');

    },

    methods: {
      handerUnbundling(){
        this.$http.post('/api/v1.0/client/unbind').then(response => {
          console.log('解除绑定');

        }, response => {
          console.log( 'error callback');
        });
      },
      routerTool(number){
          if(number==1){
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
  .bottomTool{
    position:fixed;
    bottom:0;
    width: 100%;
    height: 4rem;
    /*line-height: 4rem;*/
    background: rgb(250,250,250);
  }
  .avatar{
    width: 80%;
    display: block;
    text-align: center!important;
    /*padding-top: 0.3rem;*/
    padding: 1rem 0 0 0.7rem;
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
