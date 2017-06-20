<template>
    <div >
      <full-calendar
        :events="fcEvents" locale="zh"
        @dayClick="dayClick"
        @changeMonth="changeMonth"
      ></full-calendar>
      <div>
        <div class="egClass"><span class="publicStyle normalStyle"></span>&nbsp正常出勤</div>
        <div class="egClass"><span class="publicStyle abnormalStyle"></span>&nbsp考勤异常</div>
        <div class="egClass"><span class="publicStyle leaveStyle"></span>&nbsp请假</div>
      </div>
      <div style="height: 1px;background: #cccccc;margin:0.5rem 1rem 0.3rem 1rem"></div>

      <div>
        <div class="spanStatus">
          <div class="">{{connectTime.chidao}}</div>
          <div class="">迟到</div>
        </div>
        <div class="spanStatus">
          <div class="">{{connectTime.zaotui}}</div>
          <div class="">早退</div>
        </div>
        <div class="spanStatus">
          <div class="">{{connectTime.kuanggong}}</div>
          <div class="">旷工</div>
        </div>
        <div class="spanStatus">
          <div class="">{{connectTime.waichu}}</div>
          <div class="">外出</div>
        </div>

      </div>

      <div style="height: 1px;background: #cccccc;margin: 0.4rem 1rem;clear: both;"></div>

      <div style="background:rgb(239,241,247);">
        <div class="timeTitle">
          <div class="timeDivClass">
            <img :src="imgSrc.timeIcon" class="timeImageClass">
          </div>
          <div class="timeSpanClass">
            今日工时共计：{{connectTime.totalTime}}小时
          </div>
          <div style="height: 1px;background: #cccccc;margin: 0.5rem 1rem 0.6rem 1rem"></div>
          <div class="spanListClass">
            <div class="toWorkLeft"><div>上</div></div>
            <div class="toWorkRight">
              <div class="toWorkRightTimeSpan">
                <span>{{toSapnTime}}</span>
                <span>{{tozhang}}</span>
              </div>
            </div>
          </div>
          <div class="spanListClass" >
            <div class="toWorkLeft"><div>下</div></div>
            <div class="toWorkRight">
              <div class="toWorkRightTimeSpan">
                <span>{{downSapnTime}}</span>
                <span>{{downzhang}}</span>
              </div>
            </div>
          </div>
          <div style="clear: both;"></div>
        </div>
      </div>
    </div>
</template>
<script>

  import fullCalendar from '@/components/vue-fullcalendar/dist/vue-fullcalendar'
  import moment from 'moment'

  let df = 'HH:mm:ss';
  let df2 = 'YYYY/MM/DD';
  let df3 = 'YYYY/MM/DD';




  export default {


//    abnormal=异常   normal=正常   leave=请假   这个定的值是封装在日历里面定义好的颜色
        data(){
            return {
              fcEvents: [
//                {
//                  title : '',
//                  start : '2017/06/4',
//                  end : '2017/06/4',
//                  cssClass:'normal',
//                  YOUR_DATA  : {}
//                },
//                {
//                  title : '',
//                  start : '2017/06/5',
//                  end : '2017/06/5',
//                  cssClass:'normal',
//                  YOUR_DATA  : {}
//                },
//                {
//                  title : '',
//                  start : '2017/06/6',
//                  end : '2017/06/6',
//                  cssClass:'leave',
//
//                },
//                {
//                  title : '',
//                  start : '2017/06/7',
//                  end : '2017/06/7',
//                  cssClass:'abnormal',
//
//                }

              ],
              objToSpan: {
                toTime:'',
                downTime:'',
                downType:'',
                toType:'',
              }
              ,
              objDownSpan: {
                  downTime:'19:11:22',
                  downType:10,
                },
              tozhang:'', //
              downzhang:'' ,  //

              connectTime:{},
              toSapnTime:'',
              downSapnTime:'',
              imgSrc: {
                timeIcon: require('../../assets/time.png'),
              },
            }
        },
        created: function () {

            //初始化查询当月考勤省略 由于 changeMonth会执行查询这个月的数据展示

        },

        methods: {
          dayClick (day, jsEvent) {
            //  点击日历，获取日期
            //  转换日期格式
            //  检测假日里是否已经含有点击的这一天
            //再此处调用每一次日期的接口 进行传值
            //点击当天进行查询打卡状态开始
    //格式化时间开始

            function AddZero(n){
              if(n<10){
                return '0'+n;
              }
              return ''+n;
            };
            var d=day;
            let data=AddZero(d.getDate());
            let Month=AddZero((d.getMonth() + 1));
            var kk=  d.getFullYear() + '/' + Month + '/' + data;
            console.log(kk);
    //格式化时间结束

            let param={
              "date":kk
            }
            this.$http.post('/api/v1.0/client/findDatePunchCardLog',param).then(response => { //点击查看当天考勤
//              console.log(response.body.result.duration);
                this.tozhang='';
                this.downzhang='';
                this.toSapnTime='';
                this.downSapnTime='';
                this.connectTime.totalTime='';

              this.connectTime.totalTime=response.body.result.duration?response.body.result.duration:0;



              if (response.body.result.twTime ) {
                this.toSapnTime = moment(response.body.result.twTime).format(df);
              }

              if (response.body.result.owTime ) {
                this.downSapnTime = moment(response.body.result.owTime).format(df);
              }


//                if(day.getTime()<=new Date().getTime()){
//                  this.objToSpan={
//                    toTime:this.toSapnTime,
//                    downTime:this.downSapnTime,
//                    toType:this.tozhang,
//                    downType:this.downzhang,
//                  };
//                }else {
//                  alert('超出打卡时间了');
//                }

              console.log('twStatus'+response.body.result.twStatus);
              console.log('owStatus'+response.body.result.owStatus);
              this.tozhang='';
              this.downzhang='';



                  if(response.body.result.status=='未打卡'){//判断状态转换文字上班
                    this.tozhang='未打卡';
                    this.downzhang='未打卡';
                  }else {
                    if(response.body.result.twStatus==0){

                      this.tozhang='正常打卡';
                      if(response.body.result.twOutside){
                        this.tozhang='正常打卡(区域外)';
                      }

//                  alert('正常打卡');
                    } if (response.body.result.twStatus==1){
                      this.tozhang='迟到打卡';
                      if(response.body.result.twOutside){
                        this.tozhang='迟到打卡(区域外)';
                      }
//                  alert('迟到打卡');

                    } if (response.body.result.twStatus==2){
                      this.tozhang='旷工打卡';
                      if(response.body.result.twOutside){
                        this.tozhang='旷工打卡(区域外)';
                      }
//                  alert('旷工打卡');

                    }
                    if(response.body.result.owStatus==0){
                      this.downzhang='正常打卡';
                      if(response.body.result.owOutside){
                        this.tozhang='正常打卡(区域外)';
                      }
//                    alert('正常打卡');

                    } if (response.body.result.owStatus==1){
                      this.downzhang='早退打卡';
//                      if(response.body.result.owOutside||response.body.result.twOutside){
//                        this.tozhang='早退打卡(区域外)';
//                      }
//                    alert('早退打卡');

                    } if (response.body.result.owStatus==2){
                      this.downzhang='加班打卡';
                      if(response.body.result.owOutside){
                        this.tozhang='加班打卡(区域外)';
                      }
//                    alert('加班打卡');

                    }if (response.body.result.owStatus==3){
                      this.downzhang='旷工打卡';
                      if(response.body.result.owOutside){
                        this.tozhang='旷工打卡(区域外)';
                      }
//                    alert('加班打卡');  //添加6-14-9 新增的下班旷工（修改提交的bug）

                    }
                  }

            }, response => {
              console.log( 'error callback');
            });
            //点击当天进行查询打卡状态结束




            console.log('当前'+new Date().getTime());
            console.log('点击时间'+day.getTime());
            console.log(new Date().getTime());


          },



          'changeMonth' (start, end, current) {
            console.log('start'+start)
            console.log('end'+end)
            console.log('current'+current)
//            console.log('???');








            var zhuan = current.toLocaleString().replace(/-/g, "/").replace(/日/g, " ");
           var tt = zhuan.substring(0,7);
            console.log(tt);
            let param={
                date:tt
            }
            this.$http.post('/api/v1.0/client/findMonthAttends',param).then(response => { //查询当月考勤接口
              this.tozhang='';
              this.downzhang='';
              this.toSapnTime ='',
              this.downSapnTime='',
                this.connectTime={};
                this.fcEvents=[];



              //测试显示默认当天信息start
              var myDate = new Date();
              var timePass= myDate.getFullYear()+'/'+(myDate.getMonth()+1)+'/'+myDate.getDate();        //获取当前年份(2位)

              var zhuanDate= moment(timePass).format(df2);
              console.log(timePass,'timePass');
              console.log(zhuanDate,'zhuanDate');

              let param={
                "date":zhuanDate
              };
              this.$http.post('/api/v1.0/client/findDatePunchCardLog',param).then(response => { //点击查看当天考勤

                console.log('init', response);
//              console.log(response.body.result.duration);
                if(response.body.result==null){  //如果没有打卡记录清空时间和文字状态
                  this.tozhang='';
                  this.downzhang='';
                  this.toSapnTime='';
                  this.downSapnTime='';
                  this.connectTime.totalTime='';
                }
                this.connectTime.totalTime=response.body.result.duration?response.body.result.duration:0;
                this.$nextTick(() => {
                  if (response.body.result.twTime ) {
                    this.toSapnTime = moment(response.body.result.twTime).format(df);
                  }
                  if (response.body.result.owTime ) {
                    this.downSapnTime = moment(response.body.result.owTime).format(df);
                  }
                  console.log('twStatus'+response.body.result.twStatus);
                  console.log('owStatus'+response.body.result.owStatus);
                  this.tozhang='';
                  this.downzhang='';

                  if(response.body.result.status=='未打卡'){//判断状态转换文字上班
                    this.tozhang='未打卡';
                    this.downzhang='未打卡';
                  }else {
                    if(response.body.result.twStatus==0){

                      this.tozhang='正常打卡';
                      if(response.body.result.twOutside){
                        this.tozhang='正常打卡(区域外)';
                      }

//                  alert('正常打卡');
                    } if (response.body.result.twStatus==1){
                      this.tozhang='迟到打卡';
                      if(response.body.result.twOutside){
                        this.tozhang='迟到打卡(区域外)';
                      }
//                  alert('迟到打卡');

                    } if (response.body.result.twStatus==2){
                      this.tozhang='旷工打卡';
                      if(response.body.result.twOutside){
                        this.tozhang='旷工打卡(区域外)';
                      }
//                  alert('旷工打卡');

                    }
                    if(response.body.result.owStatus==0){
                      this.downzhang='正常打卡';
                      if(response.body.result.owOutside){
                        this.tozhang='正常打卡(区域外)';
                      }
//                    alert('正常打卡');

                    } if (response.body.result.owStatus==1){
                      this.downzhang='早退打卡';
//                      if(response.body.result.owOutside||response.body.result.twOutside){
//                        this.tozhang='早退打卡(区域外)';
//                      }
//                    alert('早退打卡');

                    } if (response.body.result.owStatus==2){
                      this.downzhang='加班打卡';
                      if(response.body.result.owOutside){
                        this.tozhang='加班打卡(区域外)';
                      }
//                    alert('加班打卡');

                    }if (response.body.result.owStatus==3){
                      this.downzhang='旷工打卡';
                      if(response.body.result.owOutside){
                        this.tozhang='旷工打卡(区域外)';
                      }
//                    alert('加班打卡');  //添加6-14-9 新增的下班旷工（修改提交的bug）

                    }
                  }
                });

              }, response => {
                console.log( 'error callback');
              });
              //测试显示默认当天信息结束


              let arrayShow=[
//               {
//                  date : '2017-06-5',
//                },
              ];
              arrayShow=response.body.result.attend.holidays;
              if(arrayShow){
                for(let i=0;i<arrayShow.length;i++){    //此处循环一个数组进行填充假期显示
                  this.fcEvents.push({
                    title : '假',
                    start :arrayShow[i].date.toLocaleString().replace(/-/g, "/"),
                    // start :arrayShow[i].start,
                    end : arrayShow[i].date.toLocaleString().replace(/-/g, "/"),
                  });
                }
              }




              this.$nextTick(() => {
                //  改变当月工作日的背景颜色
                this.showDate('', 0);
                this.showDate(1, 1);
                this.showDate(1, 2);
                this.showDate(1, 3);
                this.showDate(1, 4);
                this.showDate(1, 5);
                this.showDate('', 6);
              });





              if(response.body.result.records){
                for(let i=0;i<response.body.result.records.length;i++){ //循环添加给日历表添加日期状态
                  let connectDate={};
                  connectDate.start=response.body.result.records[i].punchYear+'/'+response.body.result.records[i].punchMonth+'/'+response.body.result.records[i].punchDate
                  connectDate.end=response.body.result.records[i].punchYear+'/'+response.body.result.records[i].punchMonth+'/'+response.body.result.records[i].punchDate
                  connectDate.cssClass=response.body.result.records[i].desc;
                  connectDate.totalTime=response.body.result.records[i].duration?response.body.result.records[i].duration:0;
//                  connectDate.title =response.body.result.records[i].desc;
                  this.fcEvents.push(connectDate);
                }
              }

                this.connectTime.chidao=response.body.result.belateTimes;   //赋值给查询出来的月总数
                this.connectTime.zaotui=response.body.result.leaveearlyTimes;
                this.connectTime.kuanggong=response.body.result.absentTimes;
                this.connectTime.waichu=response.body.result.outsideTimes;
                console.log( this.connectTime);

                console.log( this.fcEvents);














            }, response => {
              console.log( 'error callback');
            });







          },

          showDate(name, num){ //查处战展示当月的工作日
            if (name) {
              let week = document.getElementsByClassName('events-week');
              for (let i = 0; i < week.length; i++) {
                let data = week[i].getElementsByClassName('events-day');
                if (!data[num].classList.contains("not-cur-month")) {
                  data[num].style.background = 'rgba(130,130,130,0.1)';
                } else {
                  data[num].style.background = '';
                }
              }
            } else {
              let week = document.getElementsByClassName('events-week');
              for (let i = 0; i < week.length; i++) {
                let data = week[i].getElementsByClassName('events-day');
                if (!data[num].classList.contains("not-cur-month")) {
                  data[num].style.background = '';
                } else {
                  data[num].style.background = '';
                }
              }
            }
          },






        },

        components: {
          fullCalendar
        }
    }

</script>

<style scoped>
/*.ffff{  background: red!important;}*/
.spanStatus{
  width: 5rem;
  height: 2rem;
  /*line-height: 2rem;*/
  display: inline-block;
  padding: 0.2rem;
}
.egClass{
  width:7.5rem;
  height: 2rem;
  line-height: 2.6rem;
  display: inline-block;
}
.timeTitle{
  /*padding-top: 0.5rem;*/
}
.publicStyle{
  width: 0.6rem;
  height: 0.55rem;
  line-height: 0.6rem;
  border-radius: 0.3rem;
  display: inline-block;
}
.normalStyle{
  background: rgb(32,161,255);
}
.abnormalStyle{
  background: rgb(255,204,0);
}
.leaveStyle{
  background: rgb(102,204,0);
}
  .timeImageClass{
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    line-height: 1.5rem;
    padding-top: 0.2rem;
  }
  .timeDivClass{
    width: 2rem;
    height: 2rem;
    line-height: 2rem;
    display: inline-block;
    vertical-align: top;
  }
  .timeSpanClass{
    width: 19rem;
    height: 2rem;
    line-height: 2rem;
    display: inline-block;
    text-align: left;
    vertical-align: top;

  }
.spanListClass{
  height: 2rem;
  line-height: 2rem;
}
.toWorkLeft{
  width: 1.4rem;
  height: 1.4rem;
  line-height: 1.4rem;
  float: left;
  padding-left: 0.38rem;
  vertical-align: bottom;
}
.toWorkLeft div{
  border-radius: 15px;
  border: 1px solid #cccccc;
}
.toWorkRight{
  width: 20.67rem;
  height: 1.4rem;
  line-height: 1.4rem;
  float: left;
  text-align: left;
  padding-left: 1.3rem;
  vertical-align: bottom;

}
</style>
