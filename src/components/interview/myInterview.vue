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
      <ul class="list"
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loading"
          infinite-scroll-distance="10"
      >
        <li @click="handleClick(item)" v-for="item in candidateList" :key="item.RESUME_UID">
          <div class="clearfix">
            <div class="avatar fl">
              <img v-bind:src="item.AVATAR" alt="">
            </div>
            <div class="fl">
              <p><span class="id">ID:{{item.PERFILE_NO}}</span></p>
              <p class="name">
                <span class="name-part line-ellipsis">{{item.NAME}}</span>
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
            <span class="fr">期望月薪：{{item.salaryExpect}}</span>
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
  import {Badge, Indicator, InfiniteScroll} from 'mint-ui';

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
        loading: false,         // 上滑加载loading
        total: 0,               // 候选人总数
        fetchList_params: {     // 列表请求参数
          yearMonthDay: '',
          pageSize: 10,
          pageNumber: 1,
        },
        fcEvents: [],
        candidateList: {},      // 候选人列表
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
      handleClick(item) {
        if(item.SOURCE === 1) {
          this.$router.push({path: '/candidate/detail/' + item.RESUME_UID});
        }else {
          const api = `/api/v1.0/client/resumePreview/${item.JP_POSITION_UID}/${item.JP_PROFILE_UID}`
          this.$http
            .get(api)
            .then(({body: res}) => {
              if(res.code === 200) {
                // console.log('res.result', res.result)
                // location.href = 'http://www.geetemp.com/geetemp/jd/report/即派推荐1009074-人事专员-朱先生.pdf'
                location.href = res.result.pdf
              }
            })
            .catch(err => {
              console.log(err.status, err.statusText, err.url)
            });
        }
      },
      // handleClick2(item) {
      //   this.$router.push({path: '/jp-resume', query: {jpid: 0, jid: 1}})
      // },
      // 点击日历日期，获取对应数据
      dayClick(day) {
        const thisDay = moment(day).format(df2);
        const yearMonthDay = this.fetchList_params.yearMonthDay;
        if (yearMonthDay !== thisDay) {
          this.fetchList_params.pageNumber = 1;
          this.fetchList_params.yearMonthDay = thisDay;
          this.fetchList();
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

      fetchList(callback) {
        Indicator.open('正在加载...');
        this.$http.post('/api/v1.0/client/interview/arrange', this.fetchList_params).then(response => {    // 点击查看当天
          if (response.body.code === 200) {
            this.total = response.body.result.total;
            this.candidateList = response.body.result.data;
          }
          Indicator.close();
          callback && callback();
        }, response => {
        });
      },

      loadMore() {
        if(this.fetchList_params.pageNumber * this.fetchList_params.pageSize < this.total){
          this.loading = true;
          this.fetchList_params.pageNumber = this.fetchList_params.pageNumber + 1;
          this.fetchList(() => {
            this.loading = false;
          });
        }
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
        .name-part {
          display: inline-block;
          max-width: 9em;
          vertical-align: middle;
          // line-height: 13px;
        }
        .id {
          font-size: .8rem;
          margin: 0 4px;
          font-weight: bold;
        }
      }
      .field {
        margin-top: 2px;
        font-size: 12px;
      }
    }
  }

}
.line-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
<style lang="scss">
.full-calendar-header {
  background-color: #eff3f7;
  color: #26a2ff;
}
</style>
