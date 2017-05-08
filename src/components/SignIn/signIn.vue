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
              <div class="timeClass"><span>2017</span>年<span>02</span>月<span>09</span>日</div>
            </div>
          </div>
        </div>
        <div style="clear:both;"></div>
        <div style="width: 100%;height: 0.1rem;background: #cccccc;margin: 1rem 0"></div>
        <div>
          <div>
            <div class="toWorkLeft"><p>上</p></div>
            <div class="toWorkRight">上班时间</div>
          </div>
        </div>
        <div style="clear:both;"></div>
        <div class="clickClass">
          <div  style="position: relative" @click="handerClickEvent">
            <mt-button type="primary" style="background-color: rgb(139,156,172);" v-if="toUp">
              <p class="clickClassUp">上班打卡 </p>
              <p class="clickClassDown">
                <span id="hour"></span>:<span id="minute"></span>:<span id="second"></span>
              </p>
            </mt-button>
            <mt-button type="primary" style="background-color: rgb(139,156,172);" v-if="Obtain">
              <p class="clickClassUp">正在获取</p>
              <p class="clickClassDown">
                当前位置
              </p>
            </mt-button>
            <mt-popup
              v-model="popupVisible"
              closeOnClickModal="false"
              >
              安监
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
          toUp:true,
          Obtain:false,
          popupVisible:false,
          imgSrc: {
            comAddress: require('../../assets/logo.png'),
            shezhiBackground: require('../../assets/shezhi.png'),
          },
        }
      },
      created: function () {
//        this.handerSign();
        setInterval(this.handerSign,1000);
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
          MessageBox.confirm('“HR SAAS系统”，要使用你的地理位置，是否允许？?').then(action => {
            this.toUp=false;
            this.Obtain=true;
            this.popupVisible=true;


          });
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
  /*.avatar{*/
    /*width: 80%;*/
    /*display: block;*/
    /*text-align: center!important;*/
    /*!*padding-top: 0.3rem;*!*/
    /*padding: 1rem 0 0 0.7rem;*/
  /*}*/

  /*.signImg img{*/
    /*position: absolute;*/
    /*left: -2.2rem;*/
    /*width: 35%;*/
    /*top: -0.6rem;*/
  /*}*/
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
  }
  .toWorkLeft p{
    border-radius: 15px;
    border: 1px solid #cccccc;
  }
  .toWorkRight{
     width: 8rem;
     height: 1.4rem;
     line-height: 1.4rem;
     padding-top: 1.28rem;
     float: left;

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
</style>
