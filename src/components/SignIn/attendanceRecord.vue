<template>
    <div>
      <full-calendar
        :events="fcEvents" locale="zh"
        @dayClick="dayClick"
        @changeMonth="changeMonth"
        style="width: 23.6rem"
      ></full-calendar>
      <div>
        <div class="egClass"><span class="publicStyle normalStyle"></span>&nbsp正常出勤</div>
        <div class="egClass"><span class="publicStyle abnormalStyle"></span>&nbsp考勤异常</div>
        <div class="egClass"><span class="publicStyle leaveStyle"></span>&nbsp请假</div>
      </div>
      <!--<div style="height: 1px;background: #cccccc;margin: 0.8rem 1rem"></div>-->

      <!--<div>-->
        <!--<div class="spanStatus">-->
          <!--<div class="">0</div>-->
          <!--<div class="">迟到</div>-->
        <!--</div>-->
        <!--<div class="spanStatus">-->
          <!--<div class="">0</div>-->
          <!--<div class="">早退</div>-->
        <!--</div>-->
        <!--<div class="spanStatus">-->
          <!--<div class="">0</div>-->
          <!--<div class="">旷工</div>-->
        <!--</div>-->
        <!--<div class="spanStatus">-->
          <!--<div class="">0</div>-->
          <!--<div class="">外出</div>-->
        <!--</div>-->

      <!--</div>-->


      <div style="height: 1px;background: #cccccc;margin: 0.8rem 1rem"></div>

      <div style="background:rgb(239,241,247);">
        <div class="timeTitle">
          <div class="timeDivClass">
            <img :src="imgSrc.timeIcon" class="timeImageClass">
          </div>
          <div class="timeSpanClass">
            今日工时共计：<span>9</span>小时<span>5</span>分钟
          </div>
          <div style="height: 1px;background: #cccccc;margin: 0.8rem 1rem"></div>
          <div class="spanListClass">
            <div class="toWorkLeft"><div>上</div></div>
            <div class="toWorkRight">
              <div class="toWorkRightTimeSpan">
                <span>{{objToSpan.toTime}}</span>
                <span>{{objToSpan.type}}</span>
              </div>
            </div>
          </div>
          <div class="spanListClass" >
            <div class="toWorkLeft"><div>下</div></div>
            <div class="toWorkRight">
              <div class="toWorkRightTimeSpan">
                <span>{{objDownSpan.downTime}}</span>
                <span>{{objDownSpan.downType}}</span>
              </div>
            </div>
          </div>
          <div style="clear: both;"></div>
        </div>
      </div>
    </div>
</template>
<script>

  import fullCalendar from 'vue-fullcalendar'


  export default {


//    abnormal=异常   normal=正常   leave=请假
        data(){
            return {
              fcEvents: [
                {
                  title : '',
                  start : '2017-05-4',
                  end : '2017-05-4',
                  desc:'09:25:11',
                  cssClass:'normal',
                  YOUR_DATA  : {}
                },
                {
                  title : '',
                  start : '2017-05-5',
                  end : '2017-05-5',
                  desc:'09:25:11',
                  cssClass:'normal',
                  YOUR_DATA  : {}
                },
                {
                  title : '',
                  start : '2017-05-6',
                  end : '2017-05-6',
                  desc:'11:25:11',
                  cssClass:'leave',

                },
                {
                  title : '',
                  start : '2017-05-7',
                  end : '2017-05-7',
                  desc:'19:25:11',
                  cssClass:'abnormal',

                }

              ],
              objToSpan: {
                  toTime:'08:11:22',
                  type:1000,
                }
              ,
              objDownSpan: {
                  downTime:'19:11:22',
                  downType:10,
                }
              ,
              imgSrc: {
                timeIcon: require('../../assets/time.png'),
              },
            }
        },
        created: function () {

        },

        methods: {
          'dayClick' (day, jsEvent) {
            //  点击日历，获取日期
            //  转换日期格式

            //  检测假日里是否已经含有点击的这一天
           console.log(day);
           console.log('d'+jsEvent);
          //再此处调用每一次日期的接口 进行传值

            console.log('当前'+new Date().getTime());
            console.log('点击时间'+day.getTime());
            console.log(new Date().getTime());
            if(day.getTime()<=new Date().getTime()){
              let arrNr={
                toTime:'23:11:22',
                type:'正常打卡',
              };
              this.objToSpan=arrNr;
            }else {
                alert('超出时间了');
            }


          },



          'changeMonth' (start, end, current) {
            console.log('start'+start)
            console.log('end'+end)
            console.log('current'+current)

          },



        },

        components: {
          'full-calendar': require('vue-fullcalendar')
        }
    }

</script>

<style scoped>
/*.ffff{  background: red!important;}*/
.spanStatus{
  width: 5rem;
  height: 2rem;
  line-height: 2rem;
  display: inline-block;
  padding: 0.2rem;
}
.egClass{
  width:7.5rem;
  height: 2rem;
  line-height: 2rem;
  display: inline-block;
}
.timeTitle{
  padding-top: 0.5rem;
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
