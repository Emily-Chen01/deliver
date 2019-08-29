<template>
  <div class="full-calendar-body">
    <div class="pos-fixed" v-if="connectTime.state">
      <div class="spanStatus">
        <div class="spanStatusCount">{{connectTime.chidao}}</div>
        <div class="">迟到</div>
      </div>
      <div class="spanStatus">
        <div class="spanStatusCount">{{connectTime.zaotui}}</div>
        <div class="">早退</div>
      </div>
      <div class="spanStatus">
        <div class="spanStatusCount">{{connectTime.kuanggong}}</div>
        <div class="">旷工</div>
      </div>
      <div class="spanStatus">
        <div class="spanStatusCount">{{connectTime.waichu}}</div>
        <div class="">外出</div>
      </div>
    </div>
    <div class="weeks">
      <strong class="week" v-for="week in weekNames">{{week}}</strong>
    </div>
    <div class="dates" ref="dates">
      <div class="dates-bg">
        <div class="week-row" v-for="week in currentDates">
          <div class="day-cell" v-for="day in week"
               :class="{'today' : day.isToday,
              'todayBg':convertTime(day.date)===convertTime(currentDay),
              'clickDay':currentDay===day.date,
              'not-cur-month' : !day.isCurMonth}">
            <p class="day-number">{{day.monthDay}}</p>
          </div>
        </div>
      </div>

      <!-- absolute so we can make dynamic td -->
      <div class="dates-events">
        <div class="events-week" v-for="week in currentDates">
          <div class="events-day" v-for="day in week" track-by="$index"
               :class="{'today' : day.isToday,
              'not-cur-month' : !day.isCurMonth}" @click.stop="dayClick(day.date,day.isCurMonth, $event)">
            <p class="day-number">{{day.monthDay}}</p>
            <div class="event-box">
              <div class="event-box-div">
                <p class="event-item" v-show="event.cellIndex <= eventLimit" v-for="event in day.events">
                  <span v-if="event.cssClass"
                        class="dotStyle"
                        :class="{
                          'normalStyle': event.cssClass === 'normal','abnormalStyle': event.cssClass === 'abnormal','leaveStyle': event.cssClass === 'leave',
                          'absenceStyle': event.cssClass === 'absence', // 旷工
                          'lateAndEarlyStyle': event.cssClass === 'lateAndEarly', // 迟到早退
                          'beLateStyle': event.cssClass === 'beLate', // 迟到
                          'leaveEarlyStyle': event.cssClass === 'leaveEarly', //早退
                        }"></span>
                  <span class="dotStyle holidayStyle" v-else-if="!event.cssClass && event.isHoliday"></span>
                  <!--<img src="../../../../assets/ico_holiday.png" class="ico_holiday" v-if="event.isHoliday" alt=""/>-->
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- full events when click show more -->
      <div class="more-events" v-show="showMore"
           :style="{left: morePos.left + 'px', top: morePos.top + 'px'}">
        <div class="more-header">
          <span class="title">{{moreTitle(selectDay.date)}}</span>
          <span class="close" @click.stop="showMore = false">x</span>
        </div>
        <div class="more-body">
          <ul class="body-list">
            <li v-for="event in selectDay.events"
                v-show="event.isShow" class="body-item"
                @click="eventClick(event,$event)">
              <span>{{event.title}}</span>
            </li>
          </ul>
        </div>
      </div>
      <slot name="body-card"></slot>
    </div>
  </div>
</template>
<script type="text/babel">
  import dateFunc from './dateFunc'

  export default {
    props: {
      connectTime: {},
      currentDate: {},
      events: {},
      weekNames: {
        type: Array,
        default: []
      },
      monthNames: {},
      firstDay: {}
    },
    created () {
      this.events.forEach((item, index) => {
        item._id = item.id || index;
        item.end = item.end || item.start;
      })
      // this.events = events
    },
    data () {
      return {
        // weekNames : DAY_NAMES,
        weekMask: [1, 2, 3, 4, 5, 6, 7],
        // events : [],
        isLismit: true,
        eventLimit: 3,
        showMore: false,
        morePos: {
          top: 0,
          left: 0
        },
//        sltDay: new Date(),
        selectDay: {},
        currentDay: new Date()
      }
    },
    watch: {
      weekNames (val) {
      },
      currentDate(val){
      }
    },
    computed: {
      currentDates () {
        return this.getCalendar();
      }
    },
    methods: {
      isBegin (event, date, index) {
        let st = new Date(event.start);

        if (index == 0 || st.toDateString() == date.toDateString()) {
          return event.title
        }
        return '　';
      },
      moreTitle (date) {
        let dt = new Date(date);
        return this.weekNames[dt.getDay()] + ', ' + this.monthNames[dt.getMonth()] + dt.getDate();
      },
      classNames (cssClass) {
        if (!cssClass) return '';
        // string
        if (typeof cssClass == 'string') return cssClass;

        // Array
        if (Array.isArray(cssClass)) return cssClass.join(' ');

        // else
        return ''
      },
      getCalendar () {
        // calculate 2d-array of each month
        // first day of this month
        let now = new Date();// today
        let current = new Date(this.currentDate);

        let startDate = dateFunc.getStartDate(current);// 1st day of this month

        let curWeekDay = startDate.getDay();

        // begin date of this table may be some day of last month
        let diff = parseInt(this.firstDay) - curWeekDay;
        diff = diff > 0 ? (diff - 7) : diff;

        startDate.setDate(startDate.getDate() + diff);
        let calendar = [];

        for (let perWeek = 0; perWeek < 6; perWeek++) {

          let week = []

          for (let perDay = 0; perDay < 7; perDay++) {
            week.push({
              monthDay: startDate.getDate(),
              isToday: now.toDateString() == startDate.toDateString(),
              isCurMonth: startDate.getMonth() == current.getMonth(),
              weekDay: perDay,
              date: new Date(startDate),
              events: this.slotEvents(startDate)
            })

            startDate.setDate(startDate.getDate() + 1)
            // if (startDate.toDateString() == endDate.toDateString()) {
            //   isFinal = true
            //   break
            // }
          }
          calendar.push(week)
          // if (isFinal) break
        }
        return calendar
      },
      slotEvents (date) {

        // find all events start from this date
        let cellIndexArr = []
        let thisDayEvents = this.events.filter(day => {
          let dt = new Date(day.start);
          let st = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
          let ed = day.end ? new Date(day.end) : st;
          return date >= st && date <= ed;
        });

        // sort by duration
        thisDayEvents.sort((a, b) => {
          if (!a.cellIndex) return 1;
          if (!b.cellIndex) return -1;
          return a.cellIndex - b.cellIndex;
        });

        // mark cellIndex and place holder
        for (let i = 0; i < thisDayEvents.length; i++) {
          thisDayEvents[i].cellIndex = thisDayEvents[i].cellIndex || (i + 1);
          thisDayEvents[i].isShow = true;
          if (thisDayEvents[i].cellIndex == i + 1 || i > 2) continue
          thisDayEvents.splice(i, 0, {
            title: 'holder',
            cellIndex: i + 1,
            start: dateFunc.format(date, 'yyyy-MM-dd'),
            end: dateFunc.format(date, 'yyyy-MM-dd'),
            isShow: false
          })
        }

        return thisDayEvents
      },
      isStart (eventDate, date, day) {
        let st = new Date(eventDate)
        return st.toDateString() == date.toDateString();
      },
      convertTime(data){
        let year = (new Date(data)).getFullYear();
        let month = (new Date(data)).getMonth() + 1;
        let day = (new Date(data)).getDate();
        if (month < 10) {
          month = '0' + month;
        }
        if (day < 10) {
          day = '0' + day;
        }
        return year + '/' + month + '/' + day;
      },
      isEnd (eventDate, date) {
        let ed = new Date(eventDate)
        return ed.toDateString() == date.toDateString();
      },
      selectThisDay (day, jsEvent) {
        this.selectDay = day;
        this.showMore = true;
        this.morePos = this.computePos(event.target);
        this.morePos.top -= 100
        let events = day.events.filter(item => {
          return item.isShow == true;
        });
        this.$emit('moreclick', day.date, events, jsEvent);
      },
      computePos (target) {
        let eventRect = target.getBoundingClientRect();
        let pageRect = this.$refs.dates.getBoundingClientRect();
        return {
          left: eventRect.left - pageRect.left,
          top: eventRect.top + eventRect.height - pageRect.top
        };
      },
      dayClick(day, isCurMonthDay, jsEvent) {
        if (isCurMonthDay) {
          this.$emit('dayclick', day, jsEvent);
          this.currentDay = day;
        }
      },
      eventClick(event, jsEvent) {
        if (!event.isShow) {
          return
        }
        jsEvent.stopPropagation();
        let pos = this.computePos(jsEvent.target);
        this.$emit('eventclick', event, jsEvent, pos);
      }
    }
  }
</script>
<style lang="scss">
  .full-calendar-body {
    padding-bottom: 15px;
    border-bottom: 1px solid rgb(233, 235, 240);
    .pos-fixed {
      position: relative;
      overflow: hidden;
      z-index: 1;
      border-bottom: 1px solid rgb(233, 235, 240);
      .spanStatus {
        float: left;
        box-sizing: border-box;
        width: 25%;
        display: inline-block;
        padding: 5px;
        color: rgb(132, 146, 166);
        font-size: 11px;
        .spanStatusCount {
          color: rgb(71, 86, 105);
          font-size: 14px;
        }
      }
    }
    .weeks {
      width: 100%;
      height: 44px;
      .week {
        display: inline-block;
        width: 14.28%;
        text-align: center;
        height: 44px;
        line-height: 44px;
        font-size: 12px;
        color: #8492a6;
      }
    }
    .dates {
      position: relative;
      .week-row {
        .day-cell {
          display: inline-block;
          width: 14.28%;
          height: 44px;
          font-size: 14px;
          color: #1f2d3d;
          .day-number {
            margin: 0 auto;
            margin-top: 10px;
            width: 24px;
            height: 24px;
            line-height: 24px;
            border-radius: 50%;
          }
          &.today {
            .day-number {
              width: 20px;
              height: 20px;
              line-height: 20px;
              border: 2px solid rgb(33, 160, 253);
            }
          }
          &.todayBg {
            .day-number {
              color: rgb(255, 255, 255);
              background-color: rgb(33, 160, 253);
            }
          }
          &.clickDay {
            .day-number {
              color: rgb(255, 255, 255);
              background-color: rgb(33, 160, 253);
            }
          }
          &.not-cur-month {
            .day-number {
              color: rgba(0, 0, 0, 0.24);
            }
          }
        }
      }
      .abc {
        background-color: red;
      }
      .dates-events {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        .events-week {
          height: 44px;
          .events-day {
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
            float: left;
            display: inline-block;
            width: 14.28%;
            height: 44px;
            overflow: hidden;
            text-overflow: ellipsis;
            .day-number {
              text-align: right;
              height: 44px;
              opacity: 0;
            }
            &.not-cur-month {
              .day-number {
                color: rgba(0, 0, 0, 0.24);
              }
            }
            .event-box {
              width: 100%;
              height: 44px;
              margin-top: -44px;
              position: relative;
              z-index: -1;
              .event-box-div {
                box-sizing: border-box;
                overflow: hidden;
                height: 44px;
                padding-top: 24px;
              }
              .event-item {
                margin-top: 8px;
                display: inline-block;
                line-height: 1;
                .dotStyle {
                  display: inline-block;
                  margin: 0 2px;
                  width: 4px;
                  height: 4px;
                  border-radius: 50%;
                  vertical-align: middle;
                }
                .ico_holiday {
                  width: 8px;
                  height: 8px;
                  margin: 0 2px;
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
                .absenceStyle {
                  background: gray;
                }
                .lateAndEarlyStyle {
                  background: rgb(0, 255, 191);
                }
                .beLateStyle {
                  background: purple;
                }
                .leaveEarlyStyle {
                  background: #ff8800;
                }
                .holidayStyle {
                  background-color: #ff4949;
                }
              }
            }
          }
        }
      }
      .more-events {
        position: absolute;
        width: 150px;
        z-index: 2;
        border: 1px solid #eee;
        box-shadow: 0 2px 6px rgba(0, 0, 0, .15);
        .more-header {
          background-color: #eee;
          padding: 5px;
          display: flex;
          align-items: center;
          font-size: 14px;
          .title {
          }
          .close {
            margin-right: 2px;
            font-size: 16px;
          }
        }
        .more-body {
          height: 140px;
          overflow: hidden;
          .body-list {
            height: 120px;
            padding: 5px;
            overflow: auto;
            background-color: #fff;
            .body-item {
              font-size: 12px;
              background-color: #C7E6FD;
              margin-bottom: 2px;
              color: rgba(0, 0, 0, .87);
              padding: 0 0 0 4px;
              height: 18px;
              line-height: 18px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
  }
</style>
