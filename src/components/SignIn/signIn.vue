<template>
  <div>
    <div style="position: relative">
      <div class="siginLeft">
        <!--<img :src="imgSrc.comAddress" class="avatar">-->
      </div>
      <div class="siginRight">
        <div>
          <div class="detailClassBao">
            <div class="detailClass"><span>{{objNr.deptName}}</span> <span>{{objNr.name}}</span></div>
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
            <div class="toWorkRightTime" style="position: relative">
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
                <img :src="imgSrc.daKaPostionIcon" class="postionClassIcon">
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
          <div class="toWorkLeft"><p>上 </p></div>
          <div class="toWorkRight">
            <div class="toWorkRightTimeSpan">上1班时间</div>
            <div class="toWorkRightTimeSpan">
              {{initToTime}}


            </div>
            <div class="toWorkRightTime" style="position: relative">
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
                旷工1


              </mt-button>
            </div>
            <div style="width: 17rem">
              <div v-show="initDaKaRecord">
                <img :src="imgSrc.daKaPostionIcon" class="postionClassIcon">
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
              <mt-button type="default"
                         style="background-color: rgb(255,204,0);color:#000000;width: 5.2rem;left:5.5rem;height: 1.8rem;position: absolute;top: 0.1rem;font-size: 0.3rem;border-radius: 8px"
                         v-show="leaveEarly">
                早退


              </mt-button>
              <mt-button type="default" class="toDaKaStatusSecondQ" v-show="toDownLateStatusAddW">
                <!--区域外+迟到显示-->
                区域外


              </mt-button>
              <mt-button type="default" class="toDaKaStatusSecondC" v-show="toDownLateStatus">
                <!--lateStatus-->
                迟到了


              </mt-button>
              <mt-button type="default"
                         class="addTimeTotleClass"
                         v-show="overTime">
                加班+{{addtime}}小时


              </mt-button>
            </div>
            <div style="width: 12rem">
              <img :src="imgSrc.daKaPostionIcon" class="postionClassIcon">
              地理位置：范围内


            </div>
            <div>
              <mt-button type="default" class="toDaKaStatusQj" v-show="toDownAbsenteeismStatus">
                <!--absenteeismStatus  旷工-->
                提交请假/外出申请


              </mt-button>
            </div>
          </div>
        </div>
      </div>
      <div style="clear:both;"></div>
      <div class="clickClass">
        <div   v-show="daKaHide" style="position: absolute; top:-2.5rem;left:-2.6rem;width: 14rem;height: 14rem">
          <img  v-show="toUp" :src="imgSrc.bg" style="width: 13rem;height: 13rem;line-height: 13rem" >

        </div>
        <div style="position: relative" v-show="daKaHide">
          <mt-button type="primary"  v-show="toUp" @click="handerClickEvent">
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
            <div class="daKaAlert"><img :src="imgSrc.daKaIcon"/><span class="daKaSpan">打卡成功</span></div>
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
                  打卡正常


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
                <mt-button type="default"
                           style=" width: 10rem;height: 2.5rem;position: absolute;right: 1rem;top: 4.6rem;"
                           v-show="leaveEarly">
                  早退


                </mt-button>
                <mt-button type="default"
                           style="width: 11rem;height: 2.5rem;position: absolute;right: 0.5rem;top: 4.6rem;"
                           v-show="overTime">
                  加班+{{addtime}}小时


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

  import {Toast, MessageBox, Popup} from 'mint-ui';
  let timer1 = null;
  export default {
    data(){
      return {
        year: 2017,
        month: 1,
        data: 15,
        initToTime: '',
        goToTime: '',
        downTimeMiddleShow: false, //模态框下班时间
        toTimeMiddleShow: true, //模态框上班时间
        alertToSpan: true, //初始弹出的模态款span上班
        alertDownSpan: false, //弹出的模态款span下班
        daKaHide: true,//整个打卡区域
        toUp: true,
        Obtain: false,
        closeOnClickModal: true,
        popupVisible: false,
        zcToUpShow: true, //初始化上班前将要打卡
        zcDownShow: false, //上班已经打卡
        toUpYuanShow: true, //正在获取按钮
        toClickSpan: true, //上班打卡文字
        downClickSpan: false, //下班打卡文字
        clickfunction: true, //为了区别上班还是下班
        zcDownShowSpan: false, //下班打卡后显示的文字
        isYellow: false, //区域外面打卡 yellow
        isYellow2: false, //区分迟到颜色 yellow2
        isNormal: true, //正常打卡 灰色
        absenteeismStatus: false, //旷工打卡
        lateStatus: false, //迟到状态
        lateStatusAddW: false, //迟到状态
        isYellowAddQ: false,  //迟到+区域外
        initDaKaRecord: false, //查询打卡记录是否有  span
        leaveEarly: false,  //早退
        overTime: false,  //加班
        toDaKaStatusIsInit: '', //初始上班状态显示
        toDaKaStatusIsOutsideInit: '', //初始下班状态显示是否在区域外
        toDownKaStatusIsInit: '', //初始下班状态显示
        toDownKaStatusIsOutsideInit: '', //初始下班状态显示是否在区域外
        toDaKaStatusIs: '', //上班状态显示
        toDaKaStatusIsOutside: '', //上班是否在区域外
        toDownKaStatusIs: '', //下班状态显示
        toDownKaStatusIsOutside: '', //下班状态显示是否在区域外
        toDownAbsenteeismStatus: false, //下班提交请假span
        toDownLateStatusAddW: false, //下班状态span 区域外
        toDownLateStatus: false, //下班状态span 迟到
        objNr: {},
        addtime: 1.5,
        sumNumber: '',
        imgSrc: {
          daKaPostionIcon: require('../../assets/weizhi.png'),
          daKaIcon: require('../../assets/dakachenggong.png'),
          bg: require('../../assets/0_gif.gif'),

        },


        clickStaus: '打卡正常',

      }
    },
    created: function () {


      timer1 = setInterval(this.handerSign, 1000);

      this.doSearch(); //初始化页面查询数据

    },
    methods: {


      //初始开始

      doSearch(){
        this.$http.post('api/v1.0/client/findPunchCardLog').then(response => { //查询是否有打卡
          console.log('初始化上班已经打卡');
          console.log(response.body.result);
          this.toDaKaStatusIsInit = response.body.result.twStatus; //上班状态赋值
          this.toDaKaStatusIsOutsideInit = response.body.result.owOutside //上班是否在区域外
          this.toDownKaStatusIsInit = response.body.result.owStatus;//下班状态赋值
          this.toDownKaStatusIsOutsideInit = response.body.result.owOutside; //下班是否在区域外

          console.log('查询后的结果' + this.toDaKaStatusIsInit);
          console.log('查询后的结果111' + response.body.result.owTime);
          console.log('查询后的结果' + this.toDaKaStatusIsInit);




          if(response.body.result.twTime!==null){
            var zhuan = new Date(parseInt(response.body.result.twTime)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
            this.initToTime = zhuan.substring(9);//原有是8
          }
          var zhuan = new Date(parseInt(response.body.result.owTime)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
          this.goToTime = zhuan.substring(9);



          //我知道开始
          if (this.toDaKaStatusIsInit == 0 || this.toDaKaStatusIsInit == 1 || this.toDaKaStatusIsInit == 2) {        //上班点击完成后进行页面展示内容

            if (this.toDaKaStatusIsInit == 0) {//正常打卡显示
              console.log('5' + this.toDaKaStatusIsInit)

              this.alertToSpan = false;//sapn 上班
              this.alertDownSpan = false; //sapn 下班
              this.initDaKaRecord = true;
              this.lateStatus = false;
            } else if (this.toDaKaStatusIsInit == 1) { //迟到打卡显示
              this.lateStatus = true;
              this.initDaKaRecord = false;
              this.isYellow = false;
              this.absenteeismStatus = false;
              console.log('6' + this.toDaKaStatusIsInit)

            } else if (this.toDaKaStatusIsInit == 1 && this.toDaKaStatusIsOutsideInit == 1) { //迟到+区域外打卡显示
              this.initDaKaRecord = false;
              this.lateStatusAddW = true;

              console.log(this.lateStatusAddW);
              console.log('7' + this.toDaKaStatusIsInit)

              //            this.lateStatus=true;
              //            this.isYellowAddQ=true;
            } else if (this.toDaKaStatusIsInit == 2) { //旷工打卡显示
              this.absenteeismStatus = true;
              this.initDaKaRecord = false;
              //              this.lateStatus=true;
              this.lateStatus = false;

              console.log('8' + this.toDaKaStatusIsInit)

            }
          }


          if (this.toDownKaStatusIsInit == 0 || this.toDownKaStatusIsInit == 1 || this.toDownKaStatusIsInit == 2) {     //****下班点击完成后进行页面展示内容
            //            alert('进行下班打卡span'+this.toDownKaStatusIsInit);

            if (this.toDownKaStatusIsInit == 0) {//正常打卡显示
              console.log('toDaKaStatusIsInit状态' + this.toDaKaStatusIsInit)
              this.zcDownShowSpan = true; //下班总线所展示的所有文字
              this.toDownAbsenteeismStatus = false; //下班提交文字sapn
              this.absenteeismStatus = false;
              this.alertToSpan = false;//sapn 上班
              this.alertDownSpan = false; //sapn 下班
              this.lateStatus = false;
              this.initDaKaRecord = true;
//**************上面的这个与上班打卡正常冲突
            } else if (this.toDownKaStatusIsInit == 1) { //早退打卡显示
              this.zcDownShowSpan = true; //下班总线所展示的所有文字
              this.leaveEarly = true; //下班早退
              this.toDownAbsenteeismStatus=true;


            } else if (this.toDownKaStatusIsInit == 1 && this.toDownKaStatusIsOutsideInit == 1) { //早退+区域外打卡显示
              this.zcDownShowSpan = true; //下班总线所展示的所有文字
              this.toDownAbsenteeismStatus = true; //下班提交请假span
              this.toDownLateStatusAddW = true; //下班状态span 区域外
              this.toDownLateStatus = false; //下班状态span 迟到
              this.leaveEarly = true; //下班早退

            } else if (this.toDownKaStatusIsInit == 2) { //加班打卡显示
              this.toDownAbsenteeismStatus = false; //下班提交请假span
              this.overTime = true;

              this.zcDownShowSpan = true;
              //              this.overTime=true?true:false;
              console.log('8' + this.toDaKaStatusIsInit)
            }
            this.daKaHide = false;  //有下班打卡后按钮隐藏
          }

          //我知道结束

        }, response => {
          console.log('error callback');
        });
      },
      //初始结束
      handerSign(){
        var hour = document.getElementById('hour');
        var minute = document.getElementById('minute');
        var second = document.getElementById('second');

        function showTime() {
          var oDate = new Date();
          var iHours = oDate.getHours();
          var iMinute = oDate.getMinutes();
          var iSecond = oDate.getSeconds();
          hour.innerHTML = AddZero(iHours);
          minute.innerHTML = AddZero(iMinute);
          second.innerHTML = AddZero(iSecond);
        }

        showTime();
        setInterval(showTime, 1000);
        function AddZero(n) {
          if (n < 10) {
            return '0' + n;
          }
          return '' + n;
        }
      },
      handerClickEvent(){  //打卡按钮   上班或下班



        MessageBox.confirm('“HR SAAS系统”，要使用你的地理位置，是否允许？').then(action => {
          let updakaObj;
          this.currentTime();
          this.clickfunction = false;
          if (this.toDaKaStatusIsInit == null) {
            updakaObj = {
              "record": {"twOutside": 0}
            }
          } else if (this.toDaKaStatusIsInit !== null && this.toDownKaStatusIsInit == null) {
            updakaObj = {
              "record": {"owOutside": 0}
            }
          } else {
            alert("不能重复打卡");
          }

          this.$http.post('api/v1.0/client/punchCardLog', updakaObj).then(response => { //打卡


            //现在缺少判断的赋值条件......................... 在此处填写 和我知道的部分也要改写

            this.toDaKaStatusIs = response.body.result.twStatus; //上班状态赋值
            this.toDaKaStatusIsOutside = response.body.result.owOutside; //上班班是否在区域外
            this.toDownKaStatusIs = response.body.result.owStatus;//下班状态赋值
            this.toDownKaStatusIsOutside = response.body.result.owOutside; //下班是否在区域外

            console.log('上下', this.toDaKaStatusIsInit + '和' + this.toDownKaStatusIsInit);

            if (this.toDaKaStatusIsInit == null) {//上班打卡

              this.toUp = false;
              this.Obtain = true;
              this.popupVisible = true;
              this.downTimeMiddleShow = false;
              this.toTimeMiddleShow = true;
              var zhuan = new Date(parseInt(response.body.result.twTime)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
              this.initToTime = zhuan.substring(9);//原有是8
              console.log('77' + this.toDaKaStatusIs)

//                        this.toDaKaStatusIs=0;
              //写死的状态  虽然没有打卡记录要给我一条状态（事先要判断给我这个是否迟到）
              //在此处调用接口范围 进行确定当前员工位置状态

              console.log('上班状态' + this.toDaKaStatusIs)
              if (this.toDaKaStatusIs == 0) {//正常打卡显示
                this.initDaKaRecord = true;
                this.toUp = true;
                this.downClickSpan = true;
                this.toUpYuanShow = false
              } else if (this.toDaKaStatusIs == 1) { //迟到打卡显示
                this.lateStatus = true;
                this.isYellow2 = true;
                this.initDaKaRecord = false;
                this.daKaHide=true;
                this.downClickSpan=true;
                this.toUp=true;
                this.toUpYuanShow=false;


              } else if (this.toDaKaStatusIs == 1 && this.toDaKaStatusIsOutside == 1) { //迟到+区域外打卡显示
                this.lateStatus = true;
                this.isYellow = true;
                this.isYellowAddQ = true;

              } else if (this.toDaKaStatusIs == 2) { //旷工打卡显示
                this.absenteeismStatus = true;
                this.daKaHide=true;
                this.toUp=true;
                this.Obtain=false;
                this.downClickSpan=true;
                this.toClickSpan=false;
              //测试过



              }
              this.toClickSpan = false;

              this.doSearch();


            } else if (this.toDaKaStatusIsInit !== null && this.toDownKaStatusIsInit == null) { //下班打卡
              //在下班打卡前要确定是否在范围内 然后返回结果  进行打卡状态展示
//                        this.toDownKaStatusIs==0; //此处写死状态进行调试

              console.log(this.toDownKaStatusIs);
              this.zcDownShowSpan = true;
              this.alertToSpan = false;//sapn 上班
              this.alertDownSpan = true; //sapn 下班
              this.popupVisible = true; //弹出的模态框打卡
              console.log(response.body);
              var zhuan = new Date(parseInt(response.body.result.owTime)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
              this.goToTime = zhuan.substring(9);
              this.downTimeMiddleShow = true;
              this.toTimeMiddleShow = false;

              if (this.toDownKaStatusIs == 0) {//正常打卡显示
                this.initDaKaRecord = true;
                this.absenteeismStatus = false;
                this.lateStatus = false;
                console.log('166' + this.toDownKaStatusIs)


                this.overTime = false; //加班隐藏


              } else if (this.toDownKaStatusIs == 1) { //早退打卡显示
                this.isYellow = true;
                this.leaveEarly = true;
//                        this.isNormal=false;
                console.log('167' + this.toDownKaStatusIs);
                this.isYellow=false;



              } else if (this.toDownKaStatusIsOutside == 1) { //区域外打卡显示

                this.isYellow = true;
                this.absenteeismStatus = false;
                this.lateStatus = false;
                this.absenteeismStatus = false;
                this.initDaKaRecord = false;
                this.isYellowAddQ = true;
                console.log('1688' + this.toDownKaStatusIs)
              } else if (this.toDownKaStatusIs == 1 && this.toDownKaStatusIsOutside == 1) { //早退+区域外打卡显示

                this.isYellow = true;
                this.absenteeismStatus = false;
                this.lateStatus = false;
                this.leaveEarly = true;
                this.isYellowAddQ = true;
              } else if (this.toDownKaStatusIs == 2) { //加班打卡显示
                this.lateStatus = false;
                this.overTime = true;
                console.log('169' + this.toDownKaStatusIs);
                this.zcDownShowSpan=true;
                this.zcToUpShow=true;


              }
              this.toUp=false;

            }

          }, response => {
            console.log('error callback');
          });
        });
      },
      currentTime(){ //模态框显示当前打卡成功
      },
      currentTimeSpan(){ //显示在list上的日志

      },
      knowFunction(){
        this.popupVisible=false;
//        if (this.toDaKaStatusIsInit == null) {//上班打卡
//            this.popupVisible=false;
//
//        }
//        this.popupVisible=true;
//        if(this.toDaKaStatusIsInit !== null && this.toDownKaStatusIsInit == null){
//          this.popupVisible=false;
//        }
//          this.toUp=true;
//          this.toClickSpan=false;
//          this.downClickSpan=true;
//          this.Obtain=false;
//          this.zcDownShow=true;
//          this.zcToUpShow=false;
//          this.daKaHide=false; //下班打卡后不可再打卡
//        }





      }
    },
    beforeDestroy: function () {
      clearInterval(timer1);
      timer1 = null;
      console.log('销毁完成timer1')
    },

  }

</script>

<style scoped>
  .siginLeft {
    /*display: inline-block;*/
    width: 4.2rem;
    float: left;
    height: 4.2rem;
    background-color: #cccccc;
    border-radius: 2.6rem;
  }

  .siginRight {
    /*display: inline-block;*/
    width: 19.1rem;
    float: right;
    height: 4.2rem;
  }

  .detailClass {
    width: 8rem;
    float: left;
    height: 2rem;
    line-height: 2rem;
  }

  .timeClass {
    width: 9rem;
    float: right;
    height: 2rem;
    line-height: 2rem;
    background-color: rgb(191, 205, 208);
    border-radius: 4px;
  }

  .detailClassBao {
    padding-top: 1.3rem;
  }

  .toWorkLeft {
    width: 1.4rem;
    height: 1.4rem;
    line-height: 1.4rem;
    float: left;
    padding-left: 0.38rem;
    padding-top: 0.3rem;
  }

  .toWorkLeft p {
    border-radius: 15px;
    border: 1px solid #cccccc;
  }

  .toWorkRight {
    width: 20.67rem;
    height: 1.4rem;
    line-height: 1.4rem;
    padding-top: 1.1rem;
    float: left;
    text-align: left;
    padding-left: 1.3rem;
  }

  .clickClass {
    width: 9rem;
    height: 9rem;
    line-height: 9rem;
    text-align: center;
    position: absolute;
    top: 25rem;
    left: 7.6rem;
  }

  .clickClass button {
    width: 8rem;
    height: 8rem;
    border-radius: 4rem;
  }

  .clickClassUp {
    height: 1rem;
    line-height: 1rem;
    position: absolute;
    top: 1rem;
    font-size: 1.5rem;
    color: #ffffff;
    left: 1rem;
    font-weight: 600;
  }

  .clickClassDown {
    height: 1rem;
    left: 1rem;
    font-weight: 600;
    line-height: 1rem;
    position: absolute;
    top: 3.2rem;
    font-size: 1.5rem;
    color: #ffffff;
  }

  .popupClass {
    width: 16rem;
    height: 24rem;
    border-radius: 4px;
    background-color: rgb(191, 205, 218);
  }

  .daKaAlert {
    width: 14rem;
    height: 5rem;
    line-height: 5rem;
    font-size: 1.5rem;
    color: #ffffff;
    padding-top: 2.2rem;
    position: relative;
  }

  .daKaAlert img {
    width: 30%;
    height: 46%;
    display: block;
    position: absolute;
    top: 2.5rem;
    left: 3rem;
  }

  .daKaAlert .daKaSpan {
    display: block;
    height: 5rem;
    line-height: 5rem;
    position: absolute;
    left: 7.5rem;
  }

  .middleSpan {
    position: relative;
    width: 14rem;
    height: 8rem;
    line-height: 8rem;
    top: 1.6rem;
  }

  .middleSpan .middleSpanLeft {
    width: 1.5rem;
    height: 2rem;
    line-height: 2rem;
    position: absolute;
    left: 3.1rem;
    font-size: 1.5rem;

  }

  .middleSpan .middleSpanRight {
    width: 3rem;
    font-size: 1.5rem;
    height: 2rem;
    line-height: 2rem;
    position: absolute;
    left: 5rem;
    top: 1.1rem;
    font-weight: 600;
    font-size: 2rem;

  }

  .dakahr {
    width: 69.6%;
    height: 1px;
    background: #000000;
    position: absolute;
    left: 3.2rem;
    top: 4rem
  }

  .dakahrWhite {
    width: 100%;
    height: 1px;
    background-color: #ffffff;
    position: absolute;
    top: 4rem;

  }

  .spanKnow {
    color: #ffffff;
    font-weight: 600;
    font-size: 1.3rem;
    position: absolute;
    top: 1.8rem;
    left: 5.3rem;
  }

  .toWorkRightTime {
    width: 6rem;
    height: 2rem;
    line-height: 2rem;
    float: left;
  }

  .toWorkRightTimeSpan {
    width: 5rem;
    height: 2rem;
    line-height: 2rem;
    float: left;
  }

  .toDaKaStatus {
    background-color: rgb(139, 156, 172);
    color: #000000;
    width: 5.7rem;
    left: -0.8rem;
    height: 1.8rem;
    position: absolute;
    top: 0.1rem;
    font-size: 0.3rem;
    border-radius: 8px
  }

  .addTimeTotleClass {
    background-color: rgb(139, 156, 172);
    color: #000000;
    width: 7.8rem;
    left: -0.8rem;
    height: 1.8rem;
    position: absolute;
    top: 0.1rem;
    font-size: 0.3rem;
    border-radius: 8px
  }

  .toDaKaStatusSecond {
    background-color: rgb(139, 156, 172);
    color: #000000;
    width: 5.7rem;
    left: 5rem;
    height: 1.8rem;
    position: absolute;
    top: 0.1rem;
    font-size: 0.3rem;
    border-radius: 8px
  }

  .toDaKaStatusSecondQ {
    background-color: rgb(255, 204, 0);
    color: #ffffff;
    width: 5rem;
    left: 0rem;
    /*这个地方与上1 右边的的迟到了有重叠原来是left：5*/
    height: 1.8rem;
    position: absolute;
    top: 0.1rem;
    font-size: 0.3rem;
    border-radius: 8px
  }

  .toDaKaStatusSecondC {
    background-color: rgb(255, 204, 0);
    color: #000000;
    width: 5.2rem;
    left: 5.2rem;
    height: 1.8rem;
    position: absolute;
    top: 0.1rem;
    font-size: 0.3rem;
    border-radius: 8px
  }

  .toDaKaStatusSecondK {
    background-color: rgb(255, 102, 0);
    color: #000000;
    width: 5.7rem;
    left: 5rem;
    height: 1.8rem;
    position: absolute;
    top: 0.1rem;
    font-size: 0.3rem;
    border-radius: 8px
  }

  .toDaKaStatusWj {
    background-color: rgb(139, 156, 172);
    color: #ffffff;
    width: 6rem;
    height: 1.8rem;
    top: 0.5rem;
    font-size: 0.3rem;
    border-radius: 8px
  }

  .toDaKaStatusQj {
    background-color: rgb(139, 156, 172);
    color: #ffffff;
    width: 9.8rem;
    height: 1.8rem;
    top: 0.5rem;
    font-size: 0.3rem;
    border-radius: 8px
  }

  .postionClassIcon {
    width: 1.5rem;
    height: 1.5rem;
    line-height: 1.5rem
  }

  .active {
    width: 16rem;
    height: 24rem;
    border-radius: 4px;
    background-color: rgb(255, 204, 0);
  }

  .active2 {
    width: 16rem;
    height: 24rem;
    border-radius: 4px;
    background-color: rgb(255, 204, 0);
  }

  .absenteeismClass {
    width: 16rem;
    height: 24rem;
    border-radius: 4px;
    background-color: rgb(255, 102, 0);
  }

</style>
