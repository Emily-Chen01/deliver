<template>
    <div>
      <div  style="position: relative">
        <div class="siginLeft">
          <!--<img :src="imgSrc.comAddress" class="avatar">-->
        </div>
        <div class="siginRight">
          <div>
            <div class="detailClassBao">
              <div class="detailClass"><span>产品部</span> <span>刘佳安</span></div>
              <div class="timeClass"><span>{{year}}</span>年<span>{{month}}</span>月<span>{{data}}</span>日</div>
            </div>
          </div>
        </div>
        <div style="clear:both;"></div>
        <div style="width: 100%;height: 0.1rem;background: #cccccc;margin: 1rem 0"></div>
        <div v-show="zcToUpShow">
          <div>
            <div class="toWorkLeft"><p>上</p></div>
            <div class="toWorkRight">
              <div class="toWorkRightTimeSpan">上班时间</div>
              <div class="toWorkRightTimeSpan">
                {{initToTime}}
              </div>
              <div class="toWorkRightTime" style="position: relative" >
                 <mt-button type="default" class="toDaKaStatus" v-show="initDaKaRecord">
                    {{clickStaus}}
                </mt-button>
                <mt-button type="default" class="toDaKaStatusSecondQ" v-show="isYellow">
                  区域外
                 </mt-button>
                <mt-button type="default" class="toDaKaStatusSecondQ" v-show="lateStatusAddW">
                  <!--区域外+迟到显示-->
                  区域外
                 </mt-button>
                <mt-button type="default" class="toDaKaStatusSecondC" v-show="lateStatus">
                  <!--lateStatus-->
                  迟到了
                 </mt-button>
                <mt-button type="default" class="toDaKaStatusSecondK" v-show="absenteeismStatus">
                  <!--absenteeismStatus-->
                  旷工
                 </mt-button>
              </div>
              <div style="width: 17rem">
                <div v-show="initDaKaRecord">
                  <img :src="imgSrc.daKaPostionIcon" class="postionClassIcon" >
                  地理位置：范围内
                </div>
                <div>
                  <mt-button type="default" class="toDaKaStatusQj" v-show="absenteeismStatus">
                    <!--absenteeismStatus  旷工-->
                    提交请假/外出申请
                   </mt-button>
                  <mt-button type="default" class="toDaKaStatusWj" v-show="lateStatus">
                    <!--lateStatus  迟到块-->
                    忘打卡？
                   </mt-button>
                </div>
                </div>
            </div>
          </div>
        </div>
         <div v-show="zcDownShow">
          <div>
            <div class="toWorkLeft"><p>上</p></div>
            <div class="toWorkRight">
              <div class="toWorkRightTimeSpan">上1班时间</div>
              <div class="toWorkRightTimeSpan">
               {{initToTime}}
              </div>
              <div class="toWorkRightTime" style="position: relative" >
                <mt-button type="default" class="toDaKaStatus" v-show="initDaKaRecord">
                  {{clickStaus}}
                </mt-button>
                <mt-button type="default" class="toDaKaStatusSecondQ" v-show="isYellow">
                  区域外
                 </mt-button>
                <mt-button type="default" class="toDaKaStatusSecondQ" v-show="lateStatusAddW">
                  <!--区域外+迟到显示-->
                  区域外
                 </mt-button>
                <mt-button type="default" class="toDaKaStatusSecondC" v-show="lateStatus">
                  <!--lateStatus-->
                  迟到了
                 </mt-button>
                <mt-button type="default" class="toDaKaStatusSecondK" v-show="absenteeismStatus">
                  <!--absenteeismStatus-->
                  旷工
                 </mt-button>
              </div>
              <div style="width: 17rem">
                <div v-show="initDaKaRecord">
                  <img :src="imgSrc.daKaPostionIcon" class="postionClassIcon" >
                  地理位置：范围内
                </div>
                <div>
                  <mt-button type="default" class="toDaKaStatusQj" v-show="absenteeismStatus">
                    <!--absenteeismStatus  旷工-->
                    提交请假/外出申请
                   </mt-button>
                  <mt-button type="default" class="toDaKaStatusWj" v-show="lateStatus">
                    <!--lateStatus  迟到块-->
                    忘打卡？
                   </mt-button>
                </div>
              </div>
            </div>
          </div>
         </div>
        <div v-show="zcDownShowSpan">
          <div style="margin-top: 5rem">
            <div class="toWorkLeft"><p>下</p></div>
            <div class="toWorkRight">
              <div class="toWorkRightTimeSpan">下2班时间</div>
              <div class="toWorkRightTimeSpan">
              {{goToTime}}
              </div>
              <div class="toWorkRightTime" style="position: relative">
                <mt-button type="default" class="toDaKaStatus" v-show="initDaKaRecord">
                  {{clickStaus}}
                 </mt-button>
              </div>
              <div style="width: 12rem">
                <img :src="imgSrc.daKaPostionIcon" class="postionClassIcon">
                地理位置：范围内
              </div>
            </div>
          </div>
        </div>
        <div style="clear:both;"></div>
        <div class="clickClass">
          <div  style="position: relative" v-show="daKaHide">
            <mt-button type="primary" style="background-color: rgb(139,156,172);" v-show="toUp" @click="handerClickEvent">
              <div>
                <p class="clickClassUp" v-show="toClickSpan">上班打卡 </p>
                <p class="clickClassUp" v-show="downClickSpan">下班打卡 </p>

                <p class="clickClassDown">
                  <span id="hour"></span>:<span id="minute"></span>:<span id="second"></span>
                </p>
              </div>
              <div v-show="Obtain">
                <p class="clickClassUp" v-show="toUpYuanShow">正在获取</p>
                <p class="clickClassDown" v-show="toUpYuanShow">
                  当前位置
                </p>
              </div>
            </mt-button>

          <mt-popup
              v-model="popupVisible"
              closeOnClickModal="true"
              :class="{  popupClass:isNormal,active: isYellow,active2: isYellow2 ,absenteeismClass:absenteeismStatus }"
              >
              <div class="daKaAlert"><img :src="imgSrc.daKaIcon" /><span class="daKaSpan">打卡成功</span></div>
              <div style="clear: both"></div>

              <div class="middleSpan">
                <div class="middleSpanLeft" v-show="alertToSpan">上班</div>
                <div class="middleSpanLeft" v-show="alertDownSpan">下班</div>

                <div class="middleSpanRight">
                  <div v-show="toTimeMiddleShow">{{initToTime}}</div>
                  <div v-show="downTimeMiddleShow">{{goToTime}}</div>

                </div>
                <div class="dakahr"></div>
                <div>
                  <mt-button type="default"
                             style="width: 10rem;height: 2.5rem;position: absolute;right: 1rem;top: 4.6rem;"
                             v-show="initDaKaRecord">
                    打卡正常z
                  </mt-button>
                  <mt-button type="default"
                             style="width: 10rem;height: 2.5rem;position: absolute;right: 1rem;top: 4.6rem;"
                             v-show="lateStatus">
                    您迟到了
                  </mt-button>
                  <mt-button type="default"
                             style="width: 10rem;height: 2.5rem;position: absolute;right: 1rem;top: 4.6rem;"
                             v-show="absenteeismStatus">
                    旷工打卡
                  </mt-button>
                  <mt-button type="default"
                             style="width: 10rem;height: 2.5rem;position: absolute;right: 1rem;top: 7.4rem;"
                             v-show="isYellowAddQ">
                    <!--迟到+区域外-->
                    区域外
                  </mt-button>
                </div>
              </div>
              <div style="clear: both"></div>

              <div style="position: relative">
                <div class="dakahrWhite"></div>
                <div class="spanKnow" @click="knowFunction"> 我知道了</div>
              </div>

            </mt-popup>
          </div>
        </div>
      </div>
    </div>
</template>
<script>

  import { Toast,MessageBox,Popup} from 'mint-ui';

    export default {
      data(){
        return {
          year:2017,
          month:1,
          data:15,
          initToTime:'',
          goToTime:'',
          downTimeMiddleShow:false, //模态框下班时间
          toTimeMiddleShow:true, //模态框上班时间
          alertToSpan:true, //初始弹出的模态款span上班
          alertDownSpan:false, //弹出的模态款span下班
          daKaHide:true,//整个打卡区域
          toUp:true,
          Obtain:false,
          closeOnClickModal:true,
          popupVisible:false,
          zcToUpShow:true, //初始化上班前将要打卡
          zcDownShow:false, //上班已经打卡
          toUpYuanShow:true, //正在获取按钮
          toClickSpan:true, //上班打卡文字
          downClickSpan:false, //下班打卡文字
          clickfunction:true, //为了区别上班还是下班
          zcDownShowSpan:false, //下班打卡后显示的文字
          isYellow:false, //区域外面打卡 yellow
          isYellow2:false, //区分迟到颜色 yellow2
          isNormal:true, //正常打卡 灰色
          absenteeismStatus:false, //旷工打卡
          lateStatus:false, //迟到状态
          lateStatusAddW:false, //迟到状态
          isYellowAddQ:false,  //迟到+区域外
          initDaKaRecord:false, //查询打卡记录是否有  span
          toDaKaStatusIs:'',


          clickStaus:'打卡正常',
          imgSrc: {
            daKaIcon: require('../../assets/dakachenggong.png'),
            daKaPostionIcon: require('../../assets/weizhi.png'),
          },
        }
      },
      created: function () {

        setInterval(this.handerSign,1000);
        let initUpDakaObj={
          "openid":"2",
        }
        this.$http.post('api/v1.0/client/findPunchCardLog',initUpDakaObj).then(response => { //查询是否有打卡
          console.log('初始化上班已经打卡');
          console.log(response.body.result);
          this.toDaKaStatusIs=response.body.result.twStatus;
          console.log(this.toDaKaStatusIs);
          if(this.toDaKaStatusIs!==null){   //要查看初始化 是否显示  还要调节这个条件............................
            this.year=response.body.result.punchYear;
            this.month=response.body.result.punchMonth;
            this.data=response.body.result.punchDate;
            this.initToTime=response.body.result.twTime; //上班时间
            var zhuan=new Date(parseInt(response.body.result.twTime)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
            this.initToTime=zhuan.substring(9); //原有是8

            this.toClickSpan=false;
            this.downClickSpan=true;

            if(this.toDaKaStatusIs==0){//正常打卡显示
              this.initDaKaRecord=true;
            }else if(this.toDaKaStatusIs==1){ //迟到打卡显示
              this.lateStatus=true;
            }else if(this.toDaKaStatusIs==1&&this.toDaKaStatusIs.twOutside==true){ //迟到+区域外打卡显示
              this.lateStatus=true;
              this.lateStatusAddW =true;
            }else if(this.toDaKaStatusIs==2){ //旷工打卡显示
              this.absenteeismStatus=true;
            }


          }else if(response.body.result.owTime!==null){
            this.year=response.body.result.punchYear;
            this.month=response.body.result.punchMonth;
            this.data=response.body.result.punchDate;
            this.goToTime=response.body.result.owTime;  //下班时间
            var zhuan=new Date(parseInt(response.body.result.owTime)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
            this.goToTime=zhuan.substring(9);

            this.toClickSpan=true;
            this.downClickSpan=false;
            this.initDaKaRecord=false;
          }else if(response.body.message=='暂无任何打卡信息'){
            this.initDaKaRecord=false;
          }
        }, response => {
          console.log( 'error callback');
        });
      },
      methods: {
        handerSign(){
          var hour=document.getElementById('hour');
          var minute=document.getElementById('minute');
          var second=document.getElementById('second');

          function showTime(){
            var oDate=new Date();
            var iHours=oDate.getHours();
            var iMinute=oDate.getMinutes();
            var iSecond=oDate.getSeconds();
            hour.innerHTML=AddZero(iHours);
            minute.innerHTML=AddZero(iMinute);
            second.innerHTML=AddZero(iSecond);
          }
          showTime();
          setInterval(showTime,1000);
          function AddZero(n){
            if(n<10){
              return '0'+n;
            }
            return ''+n;
          }
        },
        handerClickEvent(){  //打卡按钮   上班或下班

              MessageBox.confirm('“HR SAAS系统”，要使用你的地理位置，是否允许？').then(action => {

                this.currentTime();
                this.clickfunction=false;
                let updakaObj={
                  "openid":"2",
                  "record":{"twOutside":0}
                }
                this.$http.post('api/v1.0/client/punchCardLog',updakaObj).then(response => { //打卡

                  if(response.body.message=='打卡失败'){
                      alert('系统打卡失败,请看接口返回结果');
                  }else{
                    if( this.toDaKaStatusIs==null){ //上班打卡
                      this.toUp=false;
                      this.Obtain=true;
                      this.popupVisible=true;
                      this.downTimeMiddleShow=false;
                      this.toTimeMiddleShow=true;
                      var zhuan=new Date(parseInt(response.body.result.twTime)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
                      this.initToTime=zhuan.substring(9);//原有是8
                      console.log('77'+this.toDaKaStatusIs)

                      this.toDaKaStatusIs=0;
                      //写死的状态  虽然没有打卡记录要给我一条状态（事先要判断给我这个是否迟到）


                      if(this.toDaKaStatusIs==1){//正常打卡显示
                        this.initDaKaRecord=true;
                      }else if(this.toDaKaStatusIs==1){ //迟到打卡显示
                        this.lateStatus=true;
                        this.isYellow2=true;
                        this.initDaKaRecord=false;
                        console.log(11111111)
                      }else if(this.toDaKaStatusIs==1&&this.toDaKaStatusIs.twOutside==true){ //迟到+区域外打卡显示
                        this.lateStatus=true;
                        this.isYellow=true;
                        this.isYellowAddQ=true;
                      }else if(this.toDaKaStatusIs==0){ //旷工打卡显示
                        this.absenteeismStatus=true;
                      }

                    }else if ( this.toDaKaStatusIs!==null){ //下班打卡

//                      this.toDaKaStatusIs==0;
                      console.log(this.toDaKaStatusIs);
                      this.zcDownShowSpan=true;
                      this.alertToSpan=false;//sapn 上班
                      this.alertDownSpan=true; //sapn 下班
                      this.popupVisible=true; //弹出的模态框打卡
                      console.log(response.body);
                      var zhuan=new Date(parseInt(response.body.result.owTime)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
                      this.goToTime=zhuan.substring(9);
                      this.downTimeMiddleShow=true;
                      this.toTimeMiddleShow=false;

                      if(this.toDaKaStatusIs==0){//正常打卡显示
                        this.initDaKaRecord=true;
                        this.absenteeismStatus=false;
                        console.log('166'+this.toDaKaStatusIs)

                      }else if(this.toDaKaStatusIs==1){ //迟到打卡显示
                        this.lateStatus=true;
                        this.isYellow=true;
                        this.absenteeismStatus=false;

                      }else if(this.toDaKaStatusIs== 1&&this.toDaKaStatusIs.twOutside==true){ //迟到+区域外打卡显示
                        this.lateStatus=true;
                        this.isYellow=true;
                        this.initDaKaRecord=false;

                        this.absenteeismStatus=false;
                        this.isYellowAddQ=true;
                        this.lateStatusAddW=true;

                      }else if(this.toDaKaStatusIs==2){ //旷工打卡显示
                        this.absenteeismStatus=true;

                      }
                    }
                  }

                }, response => {
                  console.log( 'error callback');
                });
              });
        },
        currentTime(){ //模态框显示当前打卡成功
        },
        currentTimeSpan(){ //显示在list上的日志

        },
        knowFunction(){
          this.toUp=true;
          this.popupVisible=false;
          this.toClickSpan=false;
          this.downClickSpan=true;
          this.Obtain=false;
          this.zcDownShow=true;
          this.zcToUpShow=false;
          this.currentTimeSpan();//显示在list上的日志
//          this.daKaHide=false; //下班打卡后不可再打卡

          if(this.toDaKaStatusIs==100){//正常打卡显示
            console.log('5'+this.toDaKaStatusIs)

            this.alertToSpan=false;//sapn 上班
            this.alertDownSpan=false; //sapn 下班
            this.initDaKaRecord=true;
          }else if(this.toDaKaStatusIs==1){ //迟到打卡显示
            this.lateStatus=true;
//            this.isYellow=true;
            this.initDaKaRecord=false;
            this.isYellow=false;
            this.absenteeismStatus=false;
            console.log('6'+this.toDaKaStatusIs)



          }else if(this.toDaKaStatusIs==1&&this.toDaKaStatusIs.twOutside==false){ //迟到+区域外打卡显示
            this.initDaKaRecord=false;
            this.lateStatusAddW=true;
            console.log(this.lateStatusAddW);
            console.log('7'+this.toDaKaStatusIs)

//            this.lateStatus=true;
//            this.isYellowAddQ=true;
          }else if(this.toDaKaStatusIs==2){ //旷工打卡显示
            this.absenteeismStatus=true;
            this.initDaKaRecord=false;
            this.lateStatus=true;
            console.log('8'+this.toDaKaStatusIs)

          }

        }


      }

    }

</script>

<style scoped>
  .siginLeft{
    /*display: inline-block;*/
    width: 4.2rem;
    float: left;
    height: 4.2rem;
    background-color: #cccccc;
    border-radius: 2.6rem;
  }
  .siginRight{
    /*display: inline-block;*/
    width: 19.1rem;
    float: right;
    height: 4.2rem;
  }
  .detailClass{
    width: 8rem;
    float: left;
    height: 2rem;
    line-height: 2rem;
  }
  .timeClass{
    width: 9rem;
    float: right;
    height: 2rem;
    line-height: 2rem;
    background-color: rgb(191,205,208);
    border-radius: 4px;
  }
  .detailClassBao{
    padding-top: 1.3rem;
  }
  .toWorkLeft{
    width: 1.4rem;
    height: 1.4rem;
    line-height: 1.4rem;
    float: left;
    padding-left: 0.38rem;
    padding-top: 0.3rem;
  }
  .toWorkLeft p{
    border-radius: 15px;
    border: 1px solid #cccccc;
  }
  .toWorkRight{
     width: 20.67rem;
     height: 1.4rem;
     line-height: 1.4rem;
     padding-top: 1.1rem;
     float: left;
    text-align: left;
    padding-left: 1.3rem;
  }
  .clickClass{
    width: 9rem;
    height: 9rem;
    line-height: 9rem;
    text-align: center;
    position: absolute;
    top:25rem;
    left: 7.6rem;
  }
  .clickClass button {
    width: 8rem;
    height: 8rem;
    border-radius: 4rem;
  }
  .clickClassUp{
    height: 1rem;
    line-height: 1rem;
    position: absolute;
    top:1rem;
    font-size: 1.5rem;
    color: #000000;
    left: 1rem;
    font-weight: 600;
  }
  .clickClassDown{
    height: 1rem;
    left: 1rem;
    font-weight: 600;
    line-height: 1rem;
    position: absolute;
    top:3.2rem;
    font-size: 1.5rem;
    color: #000000;
  }
  .popupClass{
    width: 16rem;
    height: 24rem;
    border-radius: 4px;
    background-color: rgb(191,205,218);
  }
  .daKaAlert{
    width: 14rem;
    height: 5rem;
    line-height: 5rem;
    font-size: 1.5rem;
    color: #ffffff;
    padding-top: 2.2rem;
    position: relative;
  }
  .daKaAlert img{
    width: 30%;
    height: 46%;
    display: block;
    position: absolute;
    top:2.5rem;
    left: 3rem;
  }
  .daKaAlert .daKaSpan{
    display: block;
    height: 5rem;
    line-height: 5rem;
    position: absolute;
    left: 7.5rem;
  }
  .middleSpan{
    position: relative;
    width: 14rem;
    height: 8rem;
    line-height: 8rem;
    top:1.6rem;
  }
  .middleSpan .middleSpanLeft{
    width: 1.5rem;
    height: 2rem;
    line-height: 2rem;
    position: absolute;
    left:3.1rem;
    font-size: 1.5rem;

  }
  .middleSpan .middleSpanRight{
    width: 3rem;
    font-size: 1.5rem;
    height: 2rem;
    line-height: 2rem;
    position: absolute;
    left:5rem;
    top:1.1rem;
    font-weight: 600;
    font-size: 2rem;

  }
  .dakahr{
    width: 69.6%;
    height: 1px;
    background: #000000;
    position: absolute;
    left:3.2rem;
    top:4rem
  }
  .dakahrWhite{
    width: 100%;
    height: 1px;
    background-color: #ffffff;
    position: absolute;
    top:4rem;

  }
  .spanKnow{
    color: #ffffff;
    font-weight: 600;
    font-size: 1.3rem;
    position: absolute;
    top:1.8rem;
    left: 5.3rem;
  }
  .toWorkRightTime{
    width: 6rem;
    height: 2rem;
    line-height: 2rem;
    float: left;
  }
  .toWorkRightTimeSpan{
    width: 5rem;
    height: 2rem;
    line-height: 2rem;
    float: left;
  }
  .toDaKaStatus{
    background-color: rgb(139, 156, 172);
    color:#000000;
    width: 5.7rem;
    left:-0.8rem;
    height: 1.8rem;
    position: absolute;
    top: 0.1rem;
    font-size: 0.3rem;
    border-radius: 8px
  }
  .toDaKaStatusSecond{
    background-color: rgb(139, 156, 172);
    color:#000000;
    width: 5.7rem;
    left:5rem;
    height: 1.8rem;
    position: absolute;
    top: 0.1rem;
    font-size: 0.3rem;
    border-radius: 8px
  }
  .toDaKaStatusSecondQ{
    background-color: rgb(255, 204, 0);
    color:#ffffff;
    width: 5rem;
    left:0rem;
  /*这个地方与上1 右边的的迟到了有重叠原来是left：5*/
    height: 1.8rem;
    position: absolute;
    top: 0.1rem;
    font-size: 0.3rem;
    border-radius: 8px
  }
  .toDaKaStatusSecondC{
    background-color: rgb(255, 204, 0);
    color:#000000;
    width: 5.2rem;
    left:5.2rem;
    height: 1.8rem;
    position: absolute;
    top: 0.1rem;
    font-size: 0.3rem;
    border-radius: 8px
  }
  .toDaKaStatusSecondK{
    background-color: rgb(255, 102, 0);
    color:#000000;
    width: 5.7rem;
    left:5rem;
    height: 1.8rem;
    position: absolute;
    top: 0.1rem;
    font-size: 0.3rem;
    border-radius: 8px
  }
  .toDaKaStatusWj{
    background-color: rgb(139, 156, 172);
    color:#ffffff;
    width: 6rem;
    height: 1.8rem;
    top: 0.5rem;
    font-size: 0.3rem;
    border-radius: 8px
  }
  .toDaKaStatusQj{
    background-color: rgb(139, 156, 172);
    color:#ffffff;
    width: 9.8rem;
    height: 1.8rem;
    top: 0.5rem;
    font-size: 0.3rem;
    border-radius: 8px
  }
  .postionClassIcon{
    width: 1.5rem;
    height: 1.5rem;
    line-height: 1.5rem
  }
  .active{
    width: 16rem;
    height: 24rem;
    border-radius: 4px;
    background-color: rgb(255,204,0);
  }
  .active2{
    width: 16rem;
    height: 24rem;
    border-radius: 4px;
    background-color: rgb(255,204,0);
  }
  .absenteeismClass{
    width: 16rem;
    height: 24rem;
    border-radius: 4px;
    background-color: rgb(255,102,0);
  }

</style>
