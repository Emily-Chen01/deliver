<template>
    <div >
     <div style="">
       <div class="siginLeft">
         <img :src="imgSrc.comAddress" class="avatar">
       </div>
       <div class="siginRight">
         <div style="text-indent: -19%">{{infoObj.companyName}}</div>
         <div>
           <p class="signName"><span>{{infoObj.deptName}}</span> <span>{{oneselfData.name}}</span></p>
           <div class="signImg" @click="routerMyData"><img :src="imgSrc.shezhiBackground" /></div>
         </div>
         <div class="signTitle">{{infoObj.position}}</div>
       </div>
       <div>
         <mt-button
           type="primary"
           style="background-color: rgb(139,156,172);width: 97%;margin-top: 2rem;"
           @click="handerSign"
         >签到打卡
        </mt-button>
       </div>
     </div>
      <div style="margin-top: 3rem;">
        <a  class="mint-cell" v-for="(item,index) in arryName" @click="changeList(index)">
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
let oneselfData={};

  export default {
      data(){
        return {
          oneselfData:{
            companyNmae:'北京科锐国际人力资源股份有限公司',
            department:'产品部',
            position:'产品员工',
            name:'刘易斯',

          },
          infoObj:{},
          arryOneself:[],
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
//      this.$http.post('/api/v1.0/client/chooseCompany',param).then(response => {
//        console.log(123);
//        console.log(response);
//      }, response => {
//        console.log( 'error callback');
//      });
      this.searchStaff();
//      this.$nextTick(() => {
//        this.searchStaff();
//      });

    },
    methods: {
      handerSign(){


        let signObj={
          "record":{"twOutside":10}
        }
        this.$http.post('/api/v1.0/client/punchCardLog',signObj).then(response => {
          console.log(111);
        }, response => {
          console.log( 'error callback');
        });

        this.$router.push({path:'/signIn'}); //进入打卡页

      },
      searchStaff(){

        this.$http.post('/api/v1.0/client/findStaff').then(response => {
          console.log("111",response.body.result.record);
          this.arryOneself.push(response.body.result);
          console.log("rryOne",this.arryOneself);

          this.infoObj=response.body.result.record;
          for(let i=0; i<this.arryOneself.length;i++){
            this.oneselfData={
//              companyNmae:this.arryOneself[i].finallyEmpCom,
//                department:this.arryOneself[i].theArcIns,
//                position:this.arryOneself[i].record.postion,
                name:this.arryOneself[i].name,
            };
            if(this.arryOneself[i].staffPhoUrl){
              this.imgSrc.comAddress=this.arryOneself[i].staffPhoUrl;
              sessionStorage.setItem('avatarImages',  this.imgSrc.comAddress);

            }else {
              console.log('record.staffPhoUrl的images值为空')
            }
          }
          console.log(this.oneselfData);



        }, response => {
          console.log( 'error callback');
        });
      },
      changeList(indexX){

          if(indexX==0){
//              alert('点击了请假');
            this.$router.push({path:'/leave'});

//            this.$http.post('/api/v1.0/client/findStaff',phoneObj).then(response => {
//              console.log("111",response.body.result.record);
//
//              console.log(this.oneselfData);
//
//            }, response => {
//              console.log( 'error callback');
//            });
          }else if(indexX==1){
            this.$router.push({path:'/attendanceRecord'});

          }else if(indexX==2){
            this.$router.push({path:'/mySalary'});



          }

      },
      routerMyData(){
        this.$router.push({path:'/MyData'});
      },

    },

    components: {
//      ManyCompany
    }
    }

</script>

<style scoped>
  /*.mint-cell-title:before*/
  /*{*/
    /*content:"台词：-";*/
    /*background-color:yellow;*/
    /*color:red;*/
    /*font-weight:bold;*/
  /*}*/
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
  font-size: 1.2rem;
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
    text-indent: -24%;
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
    text-indent:-72.5%;
    padding-left: 0.33rem;
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
