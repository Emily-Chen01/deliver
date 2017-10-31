<template>
  <div>
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

    <div style="background:rgb(239,241,247);">
      <div class="timeTitle">
        <div class="todayTime lineStyle">
          <div class="timeDivClass">
            <img :src="imgSrc.timeIcon" class="timeImageClass">
          </div>
          <div class="timeSpanClass">
            <span>今日工时共计：{{connectTime.totalTime}}小时</span>
          </div>
        </div>
        <div class="punchInfo">
          <div class="punchInfoLeft">
            <div class="punchInfoLine"></div>
            <p class="punchInfoUp"></p>
            <p class="punchInfoDown"></p>
          </div>
          <div class="punchInfoRight">
            <p v-text="(toSapnTime ? (toSapnTime+' ') : '')+tozhang"></p>
            <p v-text="(downSapnTime ? (downSapnTime+' ') : '')+downzhang"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import fullCalendar from '@/components/vue-fullcalendar/src/fullCalendar'
  import moment from 'moment'

  let df = 'HH:mm:ss';
  let df2 = 'YYYY/MM/DD';


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
        //格式化时间结束

        let param = {
          "date": kk
        };
        this.$http.post('/api/v1.0/client/findDatePunchCardLog', param).then(response => { //点击查看当天考勤
          this.tozhang = '';
          this.downzhang = '';
          this.toSapnTime = '';
          this.downSapnTime = '';
          this.connectTime.totalTime = '';
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
              }
            }
          }
        }, response => {
        });
      },

      'changeMonth' (start, end, currentStart, current) {
        let zhuan = currentStart.toLocaleString().replace(/-/g, "/").replace(/日/g, " ");
        let currentDate = current.toLocaleString().replace(/-/g, "/").replace(/日/g, " ");
        let td = currentDate.substring(0, 10);
        let tt = zhuan.substring(0, 7);
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

          let param = {
            "date": zhuanDate
          };
          this.$http.post('/api/v1.0/client/findDatePunchCardLog', param).then(response => { //点击查看当天考勤

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
      .publicStyle {
        width: 0.6rem;
        height: 0.6rem;
        margin-right: 6px;
        line-height: 0.6rem;
        border-radius: 50%;
        display: inline-block;
      }
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
    padding-bottom: 10px;
    .todayTime {
      height: 44px;
      line-height: 44px;
      .timeDivClass {
        margin-top: 14px;
        margin-left: 15px;
        line-height: 16px;
        display: inline-block;
        vertical-align: top;
        .timeImageClass {
          display: block;
          width: 16px;
          height: 16px;
        }
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
    .lineStyle {
      border-bottom: 1px solid #cccccc;
    }
    .punchInfo {
      box-sizing: border-box;
      width: 100%;
      padding: 15px 15px;
      overflow: hidden;
      p {
        margin: 0;
      }
      .punchInfoLeft {
        position: relative;
        width: 22px;
        float: left;
        .punchInfoLine {
          margin-left: 10px;
          width: 0;
          height: 59px;
          border-left: 1px solid #9aaabf;
        }
        p {
          position: absolute;
          width: 22px;
          height: 22px;
          border-radius: 50%;
        }
        .punchInfoUp {
          top: 0;
          background: url("../../assets/ico_to.png");
          background-size: 22px 22px;
        }
        .punchInfoDown {
          bottom: 0;
          background: url("../../assets/ico_off.png");
          background-size: 22px 22px;
        }
      }
      .punchInfoRight {
        float: left;
        margin-left: 10px;
        p {
          box-sizing: border-box;
          width: 100%;
          height: 22px;
          line-height: 22px;
          font-size: 14px;
          color: #1f2d3d;
        }
        p:nth-child(2) {
          margin-top: 15px;
        }
      }
    }
  }
</style>
