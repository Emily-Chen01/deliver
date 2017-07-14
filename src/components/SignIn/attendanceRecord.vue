<template>
  <div>
    <!--<div class="pos-fixed">-->
    <!--<div class="spanStatus">-->
    <!--<div class="">{{connectTime.chidao}}</div>-->
    <!--<div class="">迟到</div>-->
    <!--</div>-->
    <!--<div class="spanStatus">-->
    <!--<div class="">{{connectTime.zaotui}}</div>-->
    <!--<div class="">早退</div>-->
    <!--</div>-->
    <!--<div class="spanStatus">-->
    <!--<div class="">{{connectTime.kuanggong}}</div>-->
    <!--<div class="">旷工</div>-->
    <!--</div>-->
    <!--<div class="spanStatus">-->
    <!--<div class="">{{connectTime.waichu}}</div>-->
    <!--<div class="">外出</div>-->
    <!--</div>-->
    <!--</div>-->
    <full-calendar
      :connectTime="connectTime"
      :events="fcEvents" lang="zh"
      @dayClick="dayClick"
      @changeMonth="changeMonth"
    ></full-calendar>
    <div class="egStates">
      <div class="egClass"><span class="publicStyle normalStyle"></span>正常出勤</div>
      <div class="egClass"><span class="publicStyle abnormalStyle"></span>考勤异常</div>
      <div class="egClass"><span class="publicStyle leaveStyle"></span>请假</div>
    </div>
    <!--<div style="height: 1px;background: #cccccc;margin:0.5rem 1rem 0.3rem 1rem"></div>-->


    <!--<div style="height: 1px;background: #cccccc;margin: 0.4rem 1rem;clear: both;"></div>-->

    <div style="background:rgb(239,241,247);">
      <div class="timeTitle">
        <div class="todayTime">
          <div class="timeDivClass">
            <img :src="imgSrc.timeIcon" class="timeImageClass">
          </div>
          <div class="timeSpanClass">
            <span>今日工时共计：{{connectTime.totalTime}}小时</span>
          </div>
        </div>
        <div class="lineStyle"></div>
        <div class="spanListClass">
          <div class="toWorkLeft">
            <div>上</div>
          </div>
          <div class="toWorkRight">
            <div class="toWorkRightTimeSpan">
              <span v-if="toSapnTime">{{toSapnTime}}</span>
              <span>{{tozhang}}</span>
            </div>
          </div>
        </div>
        <div class="ver-line"></div>
        <div class="spanListClass">
          <div class="toWorkLeft">
            <div>下</div>
          </div>
          <div class="toWorkRight">
            <div class="toWorkRightTimeSpan">
              <span v-if="downSapnTime">{{downSapnTime}}</span>
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

  //  import fullCalendar from '@/components/vue-fullcalendar/dist/vue-fullcalendar'
  import fullCalendar from '@/components/vue-fullcalendar/src/fullCalendar'
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
          toTime: '',
          downTime: '',
          downType: '',
          toType: '',
        }
        ,
        objDownSpan: {
          downTime: '19:11:22',
          downType: 10,
        },
        tozhang: '', //
        downzhang: '',  //

        connectTime: {},
        toSapnTime: '',
        downSapnTime: '',
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
        console.log('dar123', this);
        //  点击日历，获取日期
        //  转换日期格式
        //  检测假日里是否已经含有点击的这一天
        //再此处调用每一次日期的接口 进行传值
        //点击当天进行查询打卡状态开始
        //格式化时间开始

        function AddZero(n) {
          if (n < 10) {
            return '0' + n;
          }
          return '' + n;
        };
        var d = day;
        let data = AddZero(d.getDate());
        let Month = AddZero((d.getMonth() + 1));
        var kk = d.getFullYear() + '/' + Month + '/' + data;
        console.log(12, kk);
        //格式化时间结束

        let param = {
          "date": kk
        };
        this.$http.post('/api/v1.0/client/findDatePunchCardLog', param).then(response => { //点击查看当天考勤
//              console.log(response.body.result.duration);
          this.tozhang = '';
          this.downzhang = '';
          this.toSapnTime = '';
          this.downSapnTime = '';
          this.connectTime.totalTime = '';
          console.log('response.body.result', response.body.result)
          if (response.body.result) {
            this.connectTime.totalTime = response.body.result.duration;
            if (response.body.result.twTime) {
              this.toSapnTime = moment(response.body.result.twTime).format(df);
            }
            if (response.body.result.owTime) {
              this.downSapnTime = moment(response.body.result.owTime).format(df);
            }
          } else {
            this.connectTime.totalTime = 0;
          }
//          this.connectTime.totalTime = response.body.result.duration ? response.body.result.duration : 0;


//          if (response.body.result.twTime) {
//            this.toSapnTime = moment(response.body.result.twTime).format(df);
//          }
//
//          if (response.body.result.owTime) {
//            this.downSapnTime = moment(response.body.result.owTime).format(df);
//          }

//          console.log('twStatus' + response.body.result.twStatus);
//          console.log('owStatus' + response.body.result.owStatus);
          this.tozhang = '';
          this.downzhang = '';

          if (response.body.result) {
            if (response.body.result.status == '未打卡') {//判断状态转换文字上班
              this.tozhang = '未打卡';
              this.downzhang = '未打卡';
            } else {
              if (response.body.result.twStatus == 0) {

                this.tozhang = '正常打卡';
                if (response.body.result.twOutside) {
                  this.tozhang = '正常打卡(区域外)';
                }
                if (response.body.result.twTime == null) {
                  this.tozhang = '未打卡';
                }

//                  alert('正常打卡');
              }
              if (response.body.result.twStatus == 1) {
                this.tozhang = '迟到打卡';
                if (response.body.result.twOutside) {
                  this.tozhang = '迟到打卡(区域外)';
                }
                if (response.body.result.twTime == null) {
                  this.tozhang = '未打卡';
                }

              }
              if (response.body.result.twStatus == 2) {
                this.tozhang = '旷工打卡';
                if (response.body.result.twOutside) {
                  this.tozhang = '旷工打卡(区域外)';
                }
                if (response.body.result.twTime == null) {
                  this.tozhang = '未打卡';
                }
//                  alert('旷工打卡');

              }
              if (response.body.result.owStatus == 0) {
                this.downzhang = '正常打卡';
                if (response.body.result.owOutside) {
                  this.downzhang = '正常打卡(区域外)';
                }
                if (response.body.result.owTime == null) {
                  this.downzhang = '未打卡';
                }
                if (response.body.result.owTime == null && response.body.result.IS_TODAY) {
                  this.downzhang = '';
                }
//                    alert('正常打卡');

              }
              if (response.body.result.owStatus == 1) {
                this.downzhang = '早退打卡';
                if (response.body.result.owOutside) {
                  this.downzhang = '早退打卡(区域外)';
                }
                if (response.body.result.owTime == null) {
                  this.downzhang = '未打卡';
                }
                if (response.body.result.owTime == null && response.body.result.IS_TODAY) {
                  this.downzhang = '';
                }
//                    alert('早退打卡');

              }
              if (response.body.result.owStatus == 2) {
                this.downzhang = '加班打卡';
                if (response.body.result.owOutside) {
                  this.downzhang = '加班打卡(区域外)';
                }
                if (response.body.result.owTime == null) {
                  this.downzhang = '未打卡';
                }
                if (response.body.result.owTime == null && response.body.result.IS_TODAY) {
                  this.downzhang = '';
                }
//                    alert('加班打卡');

              }
              if (response.body.result.owStatus == 3) {
                this.downzhang = '旷工打卡';
                if (response.body.result.owOutside) {
                  this.downzhang = '旷工打卡(区域外)';
                }
                if (response.body.result.owTime == null) {
                  this.downzhang = '未打卡';
                }
                if (response.body.result.owTime == null && response.body.result.IS_TODAY) {
                  this.downzhang = '';
                }
//                    alert('加班打卡');  //添加6-14-9 新增的下班旷工（修改提交的bug）

              }
            }
          }
        }, response => {
          console.log('error callback');
        });
        //点击当天进行查询打卡状态结束


        console.log('当前' + new Date().getTime());
        console.log('点击时间' + day.getTime());
        console.log(new Date().getTime());


      },

      'changeMonth' (start, end, currentStart, current) {
        console.log('start' + start)
        console.log('end' + end)
        console.log('currentStart' + currentStart)
        let zhuan = currentStart.toLocaleString().replace(/-/g, "/").replace(/日/g, " ");
        let currentDate=current.toLocaleString().replace(/-/g, "/").replace(/日/g, " ");
        let td = currentDate.substring(0, 10);
        let tt = zhuan.substring(0, 7);
        console.log(12, tt,td);
        let param = {
          date: tt
        };
        this.$http.post('/api/v1.0/client/findMonthAttends', param).then(response => { //查询当月考勤接口
          this.tozhang = '';
          this.downzhang = '';
          this.toSapnTime = '';
          this.downSapnTime = '';
          this.connectTime = {};
          this.fcEvents = [];


          //测试显示默认当天信息start
          var myDate = new Date();
          var timePass = myDate.getFullYear() + '/' + (myDate.getMonth() + 1) + '/' + myDate.getDate();        //获取当前年份(2位)

          var zhuanDate = moment(timePass).format(df2);
          console.log(timePass, 'timePass');
          console.log(zhuanDate, 'zhuanDate');

          let param = {
            "date": zhuanDate
          };
          this.$http.post('/api/v1.0/client/findDatePunchCardLog', param).then(response => { //点击查看当天考勤

            console.log('init', response);
//              console.log(response.body.result.duration);
            if (response.body.result == null) {  //如果没有打卡记录清空时间和文字状态
              this.tozhang = '';
              this.downzhang = '';
              this.toSapnTime = '';
              this.downSapnTime = '';
              this.connectTime.totalTime = '';
            }
            if (response.body.result) {
              this.connectTime.totalTime = response.body.result.duration;
            } else {
              this.connectTime.totalTime = 0;
            }
//            this.connectTime.totalTime = response.body.result.duration ? response.body.result.duration : 0;
            this.$nextTick(() => {
              this.tozhang = '';
              this.downzhang = '';
              if (response.body.result) {
                if (response.body.result.twTime) {
                  this.toSapnTime = moment(response.body.result.twTime).format(df);
                }
                if (response.body.result.owTime) {
                  this.downSapnTime = moment(response.body.result.owTime).format(df);
                }
//                console.log('twStatus' + response.body.result.twStatus);
//                console.log('owStatus' + response.body.result.owStatus);
//                console.log(response.body.result.twOutside, 'twOutside')
//                console.log(response.body.result.twOutside, 'owOutside')
                this.$nextTick(() => {
                  if (response.body.result) {
                    if (response.body.result.status == '未打卡') {//判断状态转换文字上班
                      this.tozhang = '未打卡';
                      this.downzhang = '未打卡';
                    } else {
                      if (response.body.result.twStatus == 0) {

                        this.tozhang = '正常打卡';
                        if (response.body.result.twOutside) {
                          this.tozhang = '正常打卡(区域外)';
                        }
                        if (response.body.result.twTime == null) {
                          this.tozhang = '未打卡';
                        }

//                  alert('正常打卡');
                      }
                      if (response.body.result.twStatus == 1) {
                        this.tozhang = '迟到打卡';
                        if (response.body.result.twOutside) {
                          this.tozhang = '迟到打卡(区域外)';
                        }
                        if (response.body.result.twTime == null) {
                          this.tozhang = '未打卡';
                        }

                      }
                      if (response.body.result.twStatus == 2) {
                        this.tozhang = '旷工打卡';
                        if (response.body.result.twOutside) {
                          this.tozhang = '旷工打卡(区域外)';
                        }
                        if (response.body.result.twTime == null) {
                          this.tozhang = '未打卡';
                        }
//                  alert('旷工打卡');

                      }
                      if (response.body.result.owStatus == 0) {
                        this.downzhang = '正常打卡';
                        if (response.body.result.owOutside) {
                          this.downzhang = '正常打卡(区域外)';
                        }
                        if (response.body.result.owTime == null) {
                          this.downzhang = '未打卡';
                        }
                        if (response.body.result.owTime == null && response.body.result.IS_TODAY) {
                          this.downzhang = '';
                        }
//                    alert('正常打卡');

                      }
                      if (response.body.result.owStatus == 1) {
                        this.downzhang = '早退打卡';
                        if (response.body.result.owOutside) {
                          this.downzhang = '早退打卡(区域外)';
                        }
                        if (response.body.result.owTime == null) {
                          this.downzhang = '未打卡';
                        }
                        if (response.body.result.owTime == null && response.body.result.IS_TODAY) {
                          this.downzhang = '';
                        }
//                    alert('早退打卡');

                      }
                      if (response.body.result.owStatus == 2) {
                        this.downzhang = '加班打卡';
                        if (response.body.result.owOutside) {
                          this.downzhang = '加班打卡(区域外)';
                        }
                        if (response.body.result.owTime == null) {
                          this.downzhang = '未打卡';
                        }
                        if (response.body.result.owTime == null && response.body.result.IS_TODAY) {
                          this.downzhang = '';
                        }
//                    alert('加班打卡');

                      }
                      if (response.body.result.owStatus == 3) {
                        this.downzhang = '旷工打卡';
                        if (response.body.result.owOutside) {
                          this.downzhang = '旷工打卡(区域外)';
                        }
                        if (response.body.result.owTime == null) {
                          this.downzhang = '未打卡';
                        }
                        if (response.body.result.owTime == null && response.body.result.IS_TODAY) {
                          this.downzhang = '';
                        }
//                    alert('加班打卡');  //添加6-14-9 新增的下班旷工（修改提交的bug）

                      }
                    }
                  }
                });
              }
            });

          }, response => {
            console.log('error callback');
          });
          //测试显示默认当天信息结束


          let arrayShow = [
//               {
//                  date : '2017-06-5',
//                },
          ];
          arrayShow = response.body.result.attend.holidays;
          if (arrayShow) {
            for (let i = 0; i < arrayShow.length; i++) {    //此处循环一个数组进行填充假期显示
              this.fcEvents.push({
                title: '假',
                start: arrayShow[i].date.toLocaleString().replace(/-/g, "/"),
                // start :arrayShow[i].start,
                end: arrayShow[i].date.toLocaleString().replace(/-/g, "/"),
              });
            }
          }


          this.$nextTick(() => {
            //  改变当月工作日的背景颜色
            this.showDate(response.body.result.attend.wdSun, 0);
            this.showDate(response.body.result.attend.wdMon, 1);
            this.showDate(response.body.result.attend.wdTue, 2);
            this.showDate(response.body.result.attend.wdWed, 3);
            this.showDate(response.body.result.attend.wdThu, 4);
            this.showDate(response.body.result.attend.wdFri, 5);
            this.showDate(response.body.result.attend.wdSat, 6);
          });


          if (response.body.result.records) {
            for (let i = 0; i < response.body.result.records.length; i++) { //循环添加给日历表添加日期状态
              let connectDate = {};
              connectDate.start = response.body.result.records[i].punchYear + '/' + response.body.result.records[i].punchMonth + '/' + response.body.result.records[i].punchDate
              connectDate.end = response.body.result.records[i].punchYear + '/' + response.body.result.records[i].punchMonth + '/' + response.body.result.records[i].punchDate
              connectDate.cssClass = response.body.result.records[i].desc;
              connectDate.totalTime = response.body.result.records[i].duration ? response.body.result.records[i].duration : 0;
//                  connectDate.title =response.body.result.records[i].desc;
              this.fcEvents.push(connectDate);
            }
          }

          this.connectTime.chidao = response.body.result.belateTimes;   //赋值给查询出来的月总数
          this.connectTime.zaotui = response.body.result.leaveearlyTimes;
          this.connectTime.kuanggong = response.body.result.absentTimes;
          this.connectTime.waichu = response.body.result.outsideTimes;
          console.log('this.connectTime', this.connectTime);

          console.log(this.fcEvents);


        }, response => {
          console.log('error callback');
        });

      },

      showDate(name, num){ //查处战展示当月的工作日
        if (!name) {
          let week = document.getElementsByClassName('week-row');
          for (let i = 0; i < week.length; i++) {
            let data = week[i].getElementsByClassName('day-cell');
            if (!data[num].classList.contains("not-cur-month")) {
              data[num].style.color = 'rgb(180,184,187)';
            } else {
              data[num].style.color = '';
            }
          }
        } else {
          let week = document.getElementsByClassName('week-row');
          for (let i = 0; i < week.length; i++) {
            let data = week[i].getElementsByClassName('day-cell');
            if (!data[num].classList.contains("not-cur-month")) {
              data[num].style.color = '';
            } else {
              data[num].style.color = '';
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

<style scoped lang="scss">
  .egStates {
    height: 43px;
    background: #ffffff;
    font-size: 0;
    .egClass {
      box-sizing: border-box;
      width: 33.33%;
      height: 43px;
      line-height: 43px;
      display: inline-block;
      font-size: 12px;
      .normalStyle {
        background: rgb(32, 161, 255);
      }
      .abnormalStyle {
        background: rgb(255, 204, 0);
      }

      .leaveStyle {
        background: rgb(102, 204, 0);
      }
    }
    .egClass:nth-child(1) {
      padding-left: 15px;
      text-align: left;
    }
    .egClass:nth-child(2) {
      text-align: center;
    }
    .egClass:nth-child(3) {
      padding-right: 15px;
      text-align: right;
    }

  }

  .timeTitle {
    position: relative;
    font-size: 14px;
    color: #1f2d3d;
    text-align: left;
    .lineStyle {
      height: 1px;
      background: #cccccc;
      margin-bottom: 15px;
    }
  }

  .publicStyle {
    width: 0.6rem;
    height: 0.6rem;
    margin-right: 6px;
    line-height: 0.6rem;
    border-radius: 50%;
    display: inline-block;
  }

  .timeImageClass {
    display: block;
    width: 16px;
    height: 16px;
  }

  .todayTime {
    height: 44px;
    line-height: 44px;
    .timeDivClass {
      margin-top: 14px;
      margin-left: 15px;
      line-height: 16px;
      display: inline-block;
      vertical-align: top;
    }

    .timeSpanClass {
      margin-left: 2px;
      margin-top: 14px;
      text-align: left;
      line-height: 16px;
      display: inline-block;
      vertical-align: top;
    }
  }

  .spanListClass {
    height: 22px;
    padding-left: 15px;
  }

  .ver-line {
    width: 0px;
    height: 15px;
    margin-left: 25px;
    border-left: 1px solid #cccccc;
  }

  .toWorkLeft {
    text-align: center;
    width: 22px;
    height: 22px;
    float: left;
    vertical-align: bottom;
    color: #cccccc;
  }

  .toWorkLeft div {
    width: 20px;
    height: 20px;
    line-height: 20px;
    border-radius: 50%;
    font-size: 11px;
    border: 1px solid #cccccc;
  }

  .toWorkRight {
    height: 22px;
    line-height: 22px;
    float: left;
    text-align: left;
    padding-left: 6px;
    vertical-align: bottom;
  }
</style>
