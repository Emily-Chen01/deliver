<template>
    <div >
     <div class="bg">
       <div style="padding-top: 1rem;height: 8rem;color:#ffffff;display: flex;padding-left: 1rem">
         <div class="siginLeft">
           <div class="avatarBorder">
             <img :src="imgSrc.comAddress" class="avatarTop">
           </div>
         </div>
         <div class="siginRight" style="position: relative">
           <div>
             <div class="signTitle">{{oneselfData.name}}</div>
             <div class="signName"><span>{{infoObj.deptName}}</span> <span>{{infoObj.position}}</span></div>
             <div style="border-bottom-left-radius: 1.5rem;border-top-left-radius: 1.5rem; position: absolute;width: 4.8rem;height: 2rem; background: rgb(26,128,203); top:0;right: -0.5rem;" @click="routerMyData">
               <img style="display: block;width: 35%;height: 65%;padding-top: 0.3rem;padding-left: 0.4rem;" :src="imgSrc.shezhiBackground" />
               <div style="font-size: 0.8rem;top: 0.48rem; position: absolute;right: 0.5rem;">设置</div>
             </div>
           </div>
           <div class="companyNameClass">{{infoObj.companyName}}</div>

         </div>

       </div>
       <div style="padding: 0 0.8rem 2rem 0.8rem;position: relative">
         <div style="position: absolute;width: 2.5rem;height: 1.5rem;z-index: 2;left:31%;top:16.5%">
           <img :src="imgSrc.ico_pencil" class="imgSizePencil" >

         </div>
         <mt-button
           type="primary"
           style="background-color: #57b9ff;width: 97%;"
           @click="handerSign"
         >签到打卡
        </mt-button>
       </div>

     </div>
      <div style="margin-top: 1rem;height: 10rem">
        <a  class="mint-cell" @click="changeList(0)">
          <div class="mint-cell-wrapper">
            <div class="mint-cell-title qing">
              <div class="postionImages">
                <img :src="imgSrc.ico_leave" class="imgSize" >
              </div>
              <div class="showSpan">{{recordShow.apply}}</div>
            <div>
                <i class="indexicon icon-toast"></i>
                <span>请假申请</span></div>
            </div>
            <div class="mint-cell-value is-link"><span></span></div>
          </div>
          <div class="mint-cell-right"></div>
          <i class="mint-cell-allow-right"></i>
        </a>
        <a  class="mint-cell" @click="changeList(1)">
          <div class="mint-cell-wrapper">
            <div class="mint-cell-title qing">
              <div class="postionImages">
                <img :src="imgSrc.ico_attendance" class="imgSize" >
              </div>
              <div class="showSpan">{{recordShow.punchCard}}</div>
              <div>
                <i class="indexicon icon-toast"></i>
                <span>我的考勤</span></div></div>
            <div class="mint-cell-value is-link"><span></span></div>
          </div>
          <div class="mint-cell-right"></div>
          <i class="mint-cell-allow-right"></i>
        </a>
        <a  class="mint-cell" @click="changeList(2)">
          <div class="mint-cell-wrapper">
            <div class="mint-cell-title qing">
              <div class="postionImages">
                <img :src="imgSrc.ico_wage" class="imgSize">
              </div>
              <div class="showSpan">{{recordShow.salary}}</div>
              <div>
                <i class="indexicon icon-toast"></i>
                <span>我的工资条</span></div></div>
            <div class="mint-cell-value is-link"><span></span></div>
          </div>
          <div class="mint-cell-right"></div>
          <i class="mint-cell-allow-right"></i>
        </a>
      </div>
      <!--底部工具-->
      <div class="bottomTool">
        <div style="display: flex;position: relative">
          <div style="flex: 2"  @click="routerTool(1)">
            <div style="height: 1.8rem;width: 2rem;position: absolute;top: -0.4rem;left: 23%;">
              <img :src="imgSrc.doIconBlue" class="avatar" v-if="initBlue">
              <img :src="imgSrc.doIcon" class="avatar" v-if="init">
            </div>
            <div style="height: 1.5rem;position: absolute;left: 23%;top:2.4rem">工作台</div>
          </div>
          <div style="flex: 2"  @click="routerTool(2)">
            <div style="height: 1.8rem;width: 2rem;position: absolute;top: -0.4rem;right:29%;">
              <img :src="imgSrc.setIconBlue" class="avatar" v-if="initBlueSet">
              <img :src="imgSrc.setIcon" class="avatar"  v-if="initSet">
            </div>
            <div style="height: 1.5rem;position: absolute;right:27.5%;top:2.4rem">设置</div>
          </div>
        </div>
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
            name:'',

          },
          infoObj:{},
          arryOneself:[],
          imgSrc: {
//            comAddress:  require('../../assets/tou.png'),
            comAddress:  require('../../assets/tx.png'),
            shezhiBackground:  require('../../assets/ico_setting.png'),
//            doIcon: require('../../assets/ico_workbench_2.png'),
//            setIcon: require('../../assets/ico_setting_1.png'),
            ico_leave: require('../../assets/ico_leave.png'),
            ico_attendance: require('../../assets/ico_attendance.png'),
            ico_wage: require('../../assets/ico_wage.png'),
            doIcon: require('../../assets/ico_workbench_2.png'),
            doIconBlue: require('../../assets/ico_workbench_1.png'),

            setIconBlue: require('../../assets/ico_setting_1.png'),
            setIcon: require('../../assets/ico_setting_2.png'),

            ico_pencil: require('../../assets/ico_pencil.png'),
            bg1: require('../../assets/bg.png'),


          },
          recordShow:{},
          init:'',
          initBlue:'',
          initBlueSet:'',
          initSet:'',

        }
      },
    created: function () {
      //设置的切换start
      this.init=false;
      this.initBlue=true;
      this.initBlueSet=false;
      this.initSet=true;


      this.$http.get('/api/v1.0/client/status').then(response => {
        console.log(response.body.result);
        this.recordShow=response.body.result;
      }, response => {
        console.log( 'error callback');
      });
      this.searchStaff();
    },
    methods: {
      handerSign(){

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


//            let zu={};
//            zu.position=this.infoObj.position;
//            zu.name=this.oneselfData.name;
            this.setCookie('infoObjPassPostion',this.infoObj.position,365);
            this.setCookie('infoObjPassName',this.oneselfData.name,365);


            this.setCookie('avatarImages',this.imgSrc.comAddress,365);

            if(this.arryOneself[i].staffPhoUrl){
              this.imgSrc.comAddress=this.arryOneself[i].staffPhoUrl;
              this.setCookie('avatarImages',this.imgSrc.comAddress,365);

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
  .showSpan{
    position: absolute;
    width: 45%;
    height: 1.9rem;
    line-height: 1.9;
    text-align: right;
    right: 2.5rem;
    top: 0.6rem;
  }
  .qing{
    width: 5rem;
    postion:relative;
  }
  .qing::before
  {
    content:" ------- ";
    /*content: url(../../assets/ico_leave.png);*/
    /*font-size: 0.5em;*/
    /*background-size: 19px 20px;*/
    /*display: inline-block;*/
    /*background-color:yellow;*/
    color:#ffffff;
    /*font-weight:bold;*/
    width: 10%;
    /*height: 20px;*/
  }
  .postionImages{
    position:absolute;
    width:10%;
    height:1.9rem;
    left:2%;
    top:20%;
  }
  .imgSize{
    width:70%;
    height:90%
  }
  .bottomTool{
    position:fixed;
    bottom:0;
    width: 100%;
    height: 4rem;
    /*line-height: 4rem;*/
    background: rgb(250,250,250);
  }
  .bg{
    background-image: url("../../assets/bg.png");
    background-repeat: repeat-x;
  }
  .imgSizePencil{
    width: 50%;
    height: 80%;
  }
  .avatarBorder{
    width: 5rem;
    height: 5rem;
    border-radius: 2.6rem;
    text-align: right;
    background: #cccccc;
    border: solid #ffffff 0.2rem;
  }
  .siginLeft{
    width:21%;
    float:left;
    height: 5.2rem;

  }
  .siginRight{
    padding-left: 0.8rem ;
    width:74%;
    float:left;
    height: 5.2rem;
    /*line-height: 5.2rem;*/
    font-size: 1.2rem;
  }
  .avatar{
    width: 80%;
    display: block;
    text-align: center!important;
    /*padding-top: 0.3rem;*/
    padding: 1rem 0 0 0.7rem;
  }
  .avatarTop{
    width: 92%;
    height: 94%;
    display: block;
    text-align: center!important;
    padding: 0.22rem 0 0 0.23rem;
    border-radius: 4rem;
    z-index: 0;
  }
  .signName{
    text-align: left;
    /*width: 45%;*/
    height: 1.8rem;
    line-height: 1.8rem;
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
    height: 1.8rem;
    line-height: 1.8rem;
  }
  .companyNameClass{
    text-align: left;
    height: 1.8rem;
    line-height: 1.8rem;
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
