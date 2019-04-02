<template>
  <div class="candidateDetail">
    <mt-header v-bind:title='title'></mt-header>
    <div v-if="Object.keys(pageData.detail).length > 0">
      <div class="base">
        <div class="df">
          <div class="avatar">
            <img v-bind:src="pageData.avatar">
          </div>
          <div class="f1">
            <!-- <p><span class="id">ID:{{basicData.PERFILE_NO}}</span></p> -->
            <p class="name clearfix">
              <span class="name-part line-ellipsis">
                {{pageData.detail.basic.name.value}}
              </span>
              <mt-badge type="primary" size="small" class="fr">
                {{basicData.TYPE}}
              </mt-badge>
            </p>
            <p class="field">{{pageData.age}}岁 · {{getValueByKey('sex')}} · {{getValueByKey('education')}}</p>
            <p>生育情况：{{getValueByKey('marry_status')}}</p>
            <p>应聘岗位：{{getValue('expect_position', 'intent')}}</p>
            <p>{{new Date().getFullYear() - (getValue('work_begin_year', 'basic'))}}年经验 · 现居{{pageData.detail.basic.city_id.value}}</p>
          </div>
        </div>
        <span class="status">{{getStatus(basicData.STATUS)}}</span>
      </div>
      <div class="info">
        <ul>
          <li>
            <span class="title">工作经历</span>
            <dl>
              <dd v-for="item in pageData.detail.jobs" :key="item.company.value">
                <p class="companyName">{{item.company.value}}</p>
                <p class="companyDate">
                  {{item.start_date.value.replace(/-/g, '/')}} - {{
                    item.end_date.value.indexOf('0000-') > -1
                      ? '至今'
                      : item.end_date.value.replace(/-/g, '/')
                  }}
                  （{{`${diffDate(item.start_date.value, item.end_date.value)}年`}}）
                </p>
                <p class="position">职位：{{item.position.value}}</p>
              </dd>
            </dl>
          </li>

          <li>
            <span class="title">项目经历</span>
            <dl>
              <dd v-for="item in pageData.detail.projects" :key="item.company.value">
                <p class="companyName">{{item.company.value}}</p>
                <p class="companyDate">
                  {{item.start_date.value.replace(/-/g, '/')}} - {{
                    item.end_date.value.indexOf('0000-') > -1
                      ? '至今'
                      : item.end_date.value.replace(/-/g, '/')
                  }}
                  （{{`${diffDate(item.start_date.value, item.end_date.value)}年`}}）
                </p>
                <p class="position">项目名称：{{item.name.value}}</p>
              </dd>
            </dl>
          </li>

          <li>
            <span class="title">教育经历</span>
            <dl>
              <dd v-for="item in pageData.detail.edus" :key="item.school.value">
                <p>{{item.start_date.value.replace(/-/g, '/')}} - {{item.start_date.value.replace(/-/g, '/')}}</p>
                <p>{{item.school.value}}</p>
                <p class="df space-between"><span>{{item.is_fulltime.label}}</span>  <span>专业：{{item.major.value}}</span></p>
              </dd>
            </dl>
          </li>

          <li>
            <span class="title">求职意向</span>
            <p>公司期望：{{getValueByKey('status')}}。</p>
          </li>
        </ul>
      </div>
      <div class="feedback" v-if="interviewerFeedbacks && interviewerFeedbacks.length">
        <span class="feedback-title">面试反馈</span>
        <ul>
          <li v-for="item in interviewerFeedbacks" :key="item.feedbackTime">
            <p>{{item.content}}</p>
            <p class="tr">{{item.func}} {{item.name || 'admin'}} {{formatDate(item.feedbackTime)}}</p>
          </li>
        </ul>
      </div>
    </div>
    <mt-actionsheet
      :actions="actions"
      v-model="sheetVisible">
    </mt-actionsheet>
    <div class="foot df">
      <mt-button type="default" size="small" @click="handleAddInterviewFeedback">添加面试反馈</mt-button>
      <mt-button type="primary" size="small" @click="sheetVisible = !sheetVisible">修改面试状态</mt-button>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import moment from 'moment'
  import { Badge, Indicator, MessageBox, Toast, Actionsheet } from 'mint-ui';
  Vue.component(Badge.name, Badge);
  Vue.component(Actionsheet.name, Actionsheet);
  // Vue.component(Toast.name, Toast);

  export default {
    data() {
      return {
        title: '',
        url_params: this.$route.params,
        pageData: {
          detail: {},
        },
        basicData: {},
        interviewerFeedbacks: {},
        sheetVisible: false,
        actions: [],
        statusData: [],
      }
    },
    created: function () {
      this.fetchResume();
      this.fetchProfile();
      // 获取面试状态
      this.$http.get('/api/v1.0/common/config/901002').then((response) => {
        if (response.body.code === 200) {
          this.statusData = response.body.result;
          response.body.result.forEach(item => {
            if(['7', '0'].indexOf(item.id) > -1) {
              return;
            }
            this.actions.push({
              name: item.name,
              method: () => this.handleChangeStatus(item.id),
            })
          });
        }
      });
    },
    methods: {
      // 获取简历详情
      fetchResume() {
        Indicator.open('正在加载...');
        this.$http.get('/api/v1.0/client/query/resume/' + this.url_params.id).then((response) => {
          if (response.body.code === 200) {
            this.pageData = response.body.result;
          }
          Indicator.close();
        });
      },
      // 获取备注 跟人选的一些信息
      fetchProfile() {
        this.$http.get('/api/v1.0/client/query/profile/' + this.url_params.id).then((response) => {
          if (response.body.code === 200) {
            this.basicData = response.body.result.profile;
            this.interviewerFeedbacks = response.body.result.interviewerFeedbacks;
            this.title = `ID:${this.basicData.PERFILE_NO}`;
          }
        })
      },
      // 获取value
      getValue(key, data) {
        if(this.pageData.detail[data]){
          return this.pageData.detail[data][key].value;
        }
      },
      // 通过key获取value
      getValueByKey(key, data = 'basic') {
        if(this.pageData.detail[data]){
          const obj = this.pageData.detail[data][key];
          const target = obj.option.filter(item => obj.value === item.value);
          return target.length > 0 ? target[0].label : '空';
        }
      },
      // 获取当前简历状态
      getStatus(value) {
        const status = this.statusData.filter(item => value == item.id);
        return status.length > 0 ? status[0].name : '';
      },
      // 时间戳格式化
      formatDate(timeStamp) {
        return moment(timeStamp).format('YYYY-MM-DD H:mm:ss');
      },
      // 计算时间差
      diffDate(startDate, endDate) {
        return moment(endDate.indexOf('0000-') > -1 ? new Date() : endDate).diff(moment(startDate), 'years', true).toFixed(1);
      },
      // 添加面试反馈
      handleAddInterviewFeedback() {
        MessageBox.prompt('请输入反馈内容').then(({ value, action }) => {
          const strl = (value || '').trim().length
          if(strl < 1) {
            MessageBox({
              title: '提示',
              message: '请输入反馈信息！'
            });
            return;
          }else if(strl > 255) {
            MessageBox({
              title: '提示',
              message: '反馈信息最多255个字符！'
            });
            return;
          }
          if(action === 'confirm') {
            const params = {
              positionUid: this.basicData.POSITION_UID,
              profileUid: this.basicData.RESUME_UID,
              content: value,
            };
            this.$http.post('/api/v1.0/client/update/feedback', params).then((response) => {
              if (response.body.code === 200) {
                Toast({
                  message: '反馈成功',
                  iconClass: 'icon icon-success'
                });
                this.fetchProfile();
              }
            });
          }
        });
      },
      // 修改面试状态
      handleChangeStatus(value) {
        const params = {
          positionUid: this.basicData.POSITION_UID,
          profileUid: this.basicData.RESUME_UID,
          status: value,
        };
        this.$http.post('/api/v1.0/client/update/status', params).then((response) => {
          if (response.body.code === 200) {
            Toast({
              message: '状态修改成功',
              iconClass: 'icon icon-success'
            });
            this.fetchProfile();
          }
        });
      },
    },
    components: {
    }
  }
</script>

<style scoped lang="scss">
.df{display: flex;}
.space-between{
  justify-content: space-between;
}
.f1{flex: 1;}
.fl{float: left;}
.fr{float: right;}
.tr{font-size: 0.8rem; color: #999;}
.clearfix:after{content:".";display:block;height:0;clear:both;visibility:hidden}
.clearfix { *zoom:1;}
.candidateDetail{
  min-height: 100%;
  background-color: #fff;
  padding-bottom: 60px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
.mint-header{
  height: 44px;
}
.base{
  position: relative;
  padding: 10px;
  .status{
    position: absolute;
    right: 10px;
    bottom: 0;
  }
  p{
    text-align: left;
    line-height: 1.6rem;
    font-size: 0.9rem;
  }
  .avatar{
    width: 92px;
    height: 114px;
    margin-right: 10px;
    img{
      width: 100%;
      height: 100%;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
    }
  }
  .name{
    line-height: 1rem;
    .name-part {
      display: inline-block;
      max-width: 9em;
      margin-top: 3px;
    }
    .id {
      font-size: .8rem;
      margin: 0 4px;
      font-weight: bold;
    }
  }
  .field{
    font-size: 12px;
  }
}

.info{
  padding: 0 10px;
  text-align: left;
  li{
    border-top: 2px #e9ebf0 solid;
    margin: 10px 0 20px;
    .title{
      position: relative;
      top: -12px;
      background-color: #fff;
      padding-right: 10px;
      font-weight: bold;
    }
    p{
      line-height: 26px;
      font-size: .9rem;
    }
    dd{
      margin: 5px 0;
      border-bottom: 1px #e9ebf0 dashed;
      &:first-child{
        margin-top: 0;
      }
      &:last-child{
        border-bottom: none;
        margin-bottom: 0;
      }
    }
  }
}
.feedback{
  border-top: 1px #e9ebf0 solid;
  padding: 13px 10px 0;
  font-size: .9rem;
  position: relative;
  .feedback-title {
    left: 0;
    position: absolute;
    top: -11px;
    background-color: #fff;
    padding-right: 10px;
    padding-left: 10px;
    font-weight: bold;
    font-size: 1rem;
  }
  li{
    padding: 5px 0;
    line-height: 20px;
    text-align: left;
    border-bottom: 1px #e9ebf0 dashed;
    &:last-child{
      border-bottom: none;
    }
  }
}
.foot{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 60px;
  line-height: 60px;
  background-color: #fff;
  border-top: 1px #e9ebf0 solid;
  justify-content: space-around;
  align-items: center;
}
.line-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
