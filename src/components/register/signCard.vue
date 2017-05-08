<template>
    <div>
      <div class="siginLeft">
        <img :src="imgSrc.comAddress" class="avatar">
      </div>
      <div class="siginRight">
        <div>北京科锐国际人力资源股份有限公司</div>
        <div>
          <p class="signName"><span>产品部</span> <span>刘佳安</span></p>
          <div class="signImg"><img :src="imgSrc.shezhiBackground" /></div>
        </div>
        <div class="signTitle">产品总监</div>
      </div>
      <div>
        <mt-button
          type="primary"
          style="background-color: rgb(139,156,172);width: 97%;margin-top: 2rem;"
          @click="handerSign"
        >签到打卡
        </mt-button>
      </div>
      <div style="margin-top: 3rem;">
        <a href="/toast" class="mint-cell" v-for="item in arryName">
          <div class="mint-cell-wrapper">
            <div class="mint-cell-title"><!----> <div><i class="indexicon icon-toast"></i> <span>{{item.name}}</span></div></div>
            <div class="mint-cell-value is-link"><span></span></div>
          </div>
          <div class="mint-cell-right"></div>
          <i class="mint-cell-allow-right"></i>
        </a>
      </div>
    </div>
</template>
<script >
//  import ManyCompany from "./manyCompany"

  export default {
      data(){
        return {
          imgSrc: {
            comAddress:  require('../../assets/logo.png'),
            shezhiBackground:  require('../../assets/shezhi.png'),
          },
          arryName:[
            {
              name:'请假申请'
            },
            {
              name:'我的考勤'
            },
            {
              name:'我的工资条'
            }
          ]
        }
      },
    created: function () {
//          let param={
//            "openid":"2",
//            "companyUid":"d713a5e1-4624-4301-8602-b1eb5f869663"
//          }
//      this.$http.post('api/v1.0/client/chooseCompany',param).then(response => {
//        console.log(123);
//        console.log(response);
//      }, response => {
//        console.log( 'error callback');
//      });
    },
    methods: {
      handerSign(){
        let signObj={
          "openid":"2",
          "record":{"twOutside":10}
        }
        this.$http.post('api/v1.0/client/punchCardLog',signObj).then(response => {
          console.log(111);
          console.log(response);
        }, response => {
          console.log( 'error callback');
        });

        this.$router.push({path:'/signIn'}); //进入打卡页

      }

    },

    components: {
//      ManyCompany
    }
    }

</script>

<style scoped>
.siginLeft{
  display: inline-block;
  width: 5.2rem;
  height: 5.2rem;
  background-color: #cccccc;
  border-radius: 2.6rem;
}
.siginRight{
  display: inline-block;
  width: 17.5rem;
  height: 5.2rem;
}
  .avatar{
    width: 80%;
    display: block;
    text-align: center!important;
    /*padding-top: 0.3rem;*/
    padding: 1rem 0 0 0.7rem;
  }
  .signName{
    display: inline-block;
    width: 45%;
    height: 0.5rem;
    line-height: 0.5rem;
    text-indent: -22%;
  }
  .signImg {
    display: inline-block;
    width: 30%;
    height: 0.5rem;
    line-height: 0.5rem;
    position: relative;

  }
.signImg img{
  position: absolute;
  left: -2.2rem;
  width: 35%;
  top: -0.6rem;
}
  .signTitle {
    text-align: left;
    padding-left: 0.89rem;
    height: 0.65rem;
    line-height: 0.65rem;
  }
.mint-cell-title{
  background-image: -webkit-linear-gradient(top,#d9d9d9,#d9d9d9 50%,transparent 0);
  background-image: linear-gradient(180deg,#d9d9d9,#d9d9d9 50%,transparent 0);
  background-size: 120% 1px;
  background-repeat: no-repeat;
  background-position: 0 0;
  background-origin: content-box;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  box-sizing: border-box;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  font-size: 16px;
  line-height: 1;
  min-height: inherit;
  overflow: hidden;
  padding: 0 10px;
  width: 100%;
}
</style>
