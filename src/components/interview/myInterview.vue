<template>
  <div class="myInterview">
    <mt-header title="我的面试安排"></mt-header>
    <full-calendar
      :connectTime="connectTime"
      :events="fcEvents"
      lang="zh"
      @dayClick="dayClick"
      @changeMonth="changeMonth"
    ></full-calendar>
    <div class="candidate" v-if="candidateList.length > 0">
      <h2 class="title">候选人</h2>
      <ul class="list">
        <li @click="handleClick(item.RESUME_UID)" v-for="item in candidateList">
          <div class="clearfix">
            <div class="avatar fl">
              <img v-bind:src="item.AVATAR" alt="">
            </div>
            <div class="fl">
              <p class="name">{{item.NAME}}<span class="id">(ID:{{item.PERFILE_NO}})</span>
                <mt-badge type="primary" size="small">{{item.channel}}</mt-badge>
              </p>
              <p class="field">{{item.AGE || 0}}岁 · {{getValueByKey(item.SEX, 'sex')}} · {{item.educationName}}</p>
              <p>生育情况：{{item.marryName}}</p>
              <p>应聘岗位：{{item.EXPECTED_POSITION || '空'}}</p>
              <p>{{item.WORK_TIME || '0年'}}经验 · 现居{{item.cityName}}</p>
            </div>
          </div>
          <p class="clearfix">
            <span class="fl">面试时间：{{item.interviewTime}}</span>
            <span class="fr">期望月薪：{{item.salaryExpect}}/月</span>
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import fullCalendar from '@/components/vue-fullcalendar/src/fullCalendar'
  import moment from 'moment'
  import {Badge, Indicator} from 'mint-ui';

  Vue.component(Badge.name, Badge);

  let df = 'YYYY/MM/DD HH:mm';
  let df1 = 'YYYY-MM';
  let df2 = 'YYYY-MM-DD';
  const KeyAndValue = {
    "sex": {
      "option": [
        {
          "value": 1,
          "label": "男"
        },
        {
          "value": 2,
          "label": "女"
        }
      ]
    },
  };

  export default {
    data() {
      return {
        fcEvents: [],
        candidateList: {},      // 候选人列表
        oldDayClick: '',        // 已经选中的日期
        connectTime: {
          state: false,         // 判断是否显示这些数量值
        },
      }
    },
    created: function () {
      // 初始化查询当月省略 由于 changeMonth会执行查询这个月的数据展示
    },
    methods: {
      // 候选人点击
      handleClick(id) {
        this.$router.push({path: '/candidate/detail/' + id});
      },
      // 点击日历日期，获取对应数据
      dayClick(day) {
        const thisDay = moment(day).format(df2);
        if (this.oldDayClick !== thisDay) {
          this.oldDayClick = thisDay;
          Indicator.open('正在加载...');
          this.$http.post('/api/v1.0/client/interview/arrange', {yearMonthDay: thisDay}).then(response => {    // 点击查看当天
            if (response.body.code === 200) {
              this.candidateList = response.body.result;
            }
            Indicator.close();
          }, response => {
          });
        }
      },
      changeMonth(start, end, currentStart, current) {
        const date = moment(new Date(currentStart)).format(df1);
        Indicator.open('正在加载...');
        this.$http.get('/api/v1.0/client/arrangeTime/' + date).then(response => {    // 查询当月
          this.fcEvents = [];
          if (response.body.code === 200) {
            // 显示默认当天信息
            this.dayClick(new Date());
            if (response.body.result) {
              if (response.body.result.length) {
                for (let i = 0; i < response.body.result.length; i++) { // 循环添加给日历表添加日期状态
                  let connectDate = {};
                  connectDate.start = date + '-' + response.body.result[i].day;
                  connectDate.end = date + '-' + response.body.result[i].day;
                  connectDate.isHoliday = true;
                  this.fcEvents.push(connectDate);
                }
              }
            }
          }
          Indicator.close();
        }, response => {
        });
      },

      // 通过key获取value
      getValueByKey(target, key) {
        let str = '';
        KeyAndValue[key].option.forEach(item => {
          if(target == item.value) {
            str = item.label
          }
        });
        return str;
      },

      // 格式化时间
      formatTime(time) {
        return moment(new Date(time)).format(df)
      },
    },
    components: {
      fullCalendar
    }
  }
</script>

<style scoped lang="scss">
  .myInterview {
    min-height: 100%;
    background-color: #fff;
  }

  .fl {
    float: left;
  }

  .fr {
    float: right;
  }

  .clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden
  }

  .clearfix {
    *zoom: 1;
  }

  .mint-header {
    height: 44px;
  }

  .candidate {
    .title {
      padding: 0 10px;
      text-align: left;
      font-size: 18px;
      font-weight: normal;
      line-height: 40px;
      border-bottom: 1px solid #e9ebf0;
    }
    .list {
      padding: 0 10px;
      li {
        padding: 10px 0;
        border-bottom: 1px #e9ebf0 dashed;
        p {
          text-align: left;
          line-height: 1.6rem;
          font-size: .9rem;
        }
        .avatar {
          width: 92px;
          height: 114px;
          margin-right: 10px;
          position: relative;
          img {
            position: absolute;
            top: 50%;
            left: 50%;
            -webkit-transform: translate(-50%, -50%);
            -moz-transform: translate(-50%, -50%);
            -ms-transform: translate(-50%, -50%);
            -o-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            width: 100%;
            max-height: 100%;
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
          }
        }
        .name {
          line-height: 1rem;
          .id {
            font-size: .8rem;
            margin: 0 4px;
          }
        }
        .field {
          font-size: 12px;
        }
      }
    }
  }
</style>
<style lang="scss">
  .full-calendar-header {
    background-color: #eff3f7;
    color: #26a2ff;
  }
</style>
