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
              <div class="toWorkRightTime">上班时间</div>
              <div class="toWorkRightTime">
                {{initToTime}}
              </div>
              <div class="toWorkRightTime" style="position: relative">
                  <mt-button type="default" class="toDaKaStatus">
                    {{clickStaus}}
                 </mt-button>
              </div>
              <div style="width: 12rem">
                <img :src="imgSrc.daKaPostionIcon" class="postionClassIcon">
                地理位置：范围内</div>
            </div>
          </div>
        </div>
         <div v-show="zcDownShow">
          <div>
            <div class="toWorkLeft"><p>上</p></div>
            <div class="toWorkRight">
              <div class="toWorkRightTime">上班时间</div>
              <div class="toWorkRightTime">
               {{initToTime}}
              </div>
              <div class="toWorkRightTime" style="position: relative">
                <mt-button type="default" class="toDaKaStatus">
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
        <div v-show="zcDownShowSpan">
          <div style="margin-top: 5rem">
            <div class="toWorkLeft"><p>下</p></div>
            <div class="toWorkRight">
              <div class="toWorkRightTime">下班时间</div>
              <div class="toWorkRightTime">
              {{goToTime}}
              </div>
              <div class="toWorkRightTime" style="position: relative">
                <mt-button type="default" class="toDaKaStatus">
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
              class="popupClass"
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
                             style="width: 10rem;height: 3rem;position: absolute;right: 1rem;top: 4.6rem;">
                  {{clickStaus}}
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
          console.log(response.body.result)
          this.year=response.body.result.punchYear;
          this.month=response.body.result.punchMonth;
          this.data=response.body.result.punchDate;
          this.initToTime=response.body.result.twTime; //上班时间
          this.goToTime=response.body.result.owTime;  //下班时间

          var zhuan=new Date(parseInt(response.body.result.twTime)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
          this.initToTime=zhuan.substring(8);

          var zhuan=new Date(parseInt(response.body.result.owTime)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
          this.goToTime=zhuan.substring(8);




          if(response.body.result.twTime!==null){
              this.toClickSpan=false;
              this.downClickSpan=true;

          }else{
            this.toClickSpan=true;
            this.downClickSpan=false;
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
        handerClickEvent(){


              MessageBox.confirm('“HR SAAS系统”，要使用你的地理位置，是否允许？').then(action => {

                this.currentTime();
                this.clickfunction=false;
                let updakaObj={
                  "openid":"2",
                  "record":{"twOutside":0}
                }
                this.$http.post('api/v1.0/client/punchCardLog',updakaObj).then(response => { //打卡
                    if( this.initToTime==null){ //上班打卡
                      this.toUp=false;
                      this.Obtain=true;
                      this.popupVisible=true;
                      this.downTimeMiddleShow=false;
                      this.toTimeMiddleShow=true;
                      var zhuan=new Date(parseInt(response.body.result.twTime)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
                      this.initToTime=zhuan.substring(8);
                  }else{ //下班打卡
                    this.zcDownShowSpan=true;
                    this.alertToSpan=false;//sapn 上班
                    this.alertDownSpan=true; //sapn 下班
                    this.popupVisible=true; //弹出的模态框打卡
                    console.log(response.body);
                      var zhuan=new Date(parseInt(response.body.result.owTime)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
                      this.goToTime=zhuan.substring(8);
                      this.downTimeMiddleShow=true;
                      this.toTimeMiddleShow=false;

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
          this.daKaHide=false; //下班打卡后不可再打卡

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
     width: 20.2rem;
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
  .toDaKaStatus{
    background-color: rgb(139, 156, 172);
    color:#000000;
    width: 5.9rem;
    height: 1.8rem;
    position: absolute;
    left:0.7rem;
    top: 0.1rem;
    font-size: 1rem;
    border-radius: 8px
  }
  .postionClassIcon{
    width: 1.5rem;
    height: 1.5rem;
    line-height: 1.5rem
  }
</style>
