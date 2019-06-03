<template>
  <div class="approveDetail">
    <mt-header title="8月份异常考勤"></mt-header>
    <!--新增加考勤异常申请-->
    <div class="attendcontInfo">
      <div class="attendtop">申请人：张三(CI11570)</div>
      <div class="attendttit">原始数据</div>
      <div class="attendDetail">
        <p>本月异常考勤累计时间</p>
        <p>
          <span>迟到累计：2次（共3工时）</span>
          <span>事假累计: 10天(共80工时)</span>
        </p>
        <p>
          <span>早退累计：2次（共3工时）</span>
          <span>病假累计: 10天(共80工时)</span>
        </p>
        <p>
          <span class="spanlft">旷工累计: 10天(共80工时)</span>
          <span class="spanlft">产假累计: 10天(共80工时)</span>
        </p>
        <p style="padding: 20px;text-align: center;">根据假期配置产生累计</p>
        <p>工作日加班累计时长：0.5天(共4小时)</p>
        <p>周末加班累计时长：0.5天(共4小时)</p>
        <p>法定假日加班累计时长：0.5天(共4小时)</p>
      </div>
      <div class="attendttit">修订后数据</div>
      <div class="attendDetail">
        <p>本月异常考勤累计时间</p>
        <p>
          <span>迟到累计：2次（共3工时）</span>
          <span>事假累计: 10天(共80工时)</span>
        </p>
        <p>
          <span>早退累计：2次（共3工时）</span>
          <span>病假累计: 10天(共80工时)</span>
        </p>
        <p>
          <span class="spanlft">旷工累计: 10天(共80工时)</span>
          <span class="spanlft">产假累计: 10天(共80工时)</span>
        </p>
        <p style="padding: 20px;text-align: center;">根据假期配置产生累计</p>
        <p>工作日加班累计时长：0.5天(共4小时)</p>
        <p>周末加班累计时长：0.5天(共4小时)</p>
        <p>法定假日加班累计时长：0.5天(共4小时)</p>
      </div>
      <!--<div class="btnlookdet">
        <mt-button size="normal" class="btnlookattend" type="primary" @click="">
          <span>查看详情</span>
        </mt-button>
      </div>-->

      <div class="attendttit">修订后数据详情</div>
      <full-calendar
        :connectTime="connectTime"
        :events="fcEvents" lang="zh"
        @dayClick="dayClick"
        @changeMonth="changeMonth"
      ></full-calendar>
      <div class="originalinfo">
        <h1>原始数据</h1>
        <p>异常考勤日期：2018-08-11 （工作日）</p>
        <p>异常考勤状态：迟到</p>
      </div>
      <div class="originalinfo">
        <h1>修定数据</h1>
        <p>考勤状态: 忘打卡</p>
        <p>
          <span>是否有加班：是</span>
          <span>加班时长: 3小时</span>
        </p>
        <p>考勤原因：忘记打卡了</p>
      </div>
      <div class="applylist">
        <p>2018-09-01 15:00:21 张三 提交了异常考勤申请</p>
        <p>2018-09-01 15:02:21 李四 通过了异常考勤申请</p>
      </div>
      <div class="approvebutton">
        <mt-button size="small" class="btnsendback" @click="refuse()">
          <span>拒绝并退回修改</span>
        </mt-button>
        <mt-button size="small" class="btnpass" type="primary" @click="gopass()">
          <span>通过</span>
        </mt-button>
      </div>

    </div>

    <div class="approvedetcont" style="display: none;">



      <!--<div class="approvedetcont-wrapper attendance">
        <div class="approvedetcont-top">
          <h3 class="approvedetcont-title">
                <span class="approvedetcont-title-left">审批申请（8月份异常考勤申请）</span>
            <span class="approvedetcont-title-right">审批中</span>
          </h3>
        </div>



      </div>-->




    </div>


    <div class="imagePopup-box">
      <mt-popup
        v-model="popupVisible"
        class="imageScale-wrapper"
        :closeOnClickModal="true">
        <div class="imageScale-box">
          <img :src="popImgSrc" @click="closeImage"/>
        </div>
      </mt-popup>
    </div>
    <mt-popup
      v-model="leaveSuccess"
      class="image-Success"
      :closeOnClickModal="false">
      <div class="image-box">
        <img :src="alertSuccessImage ? imgSrc.ico_success : imgSrc.ico_error"/>
      </div>
      <p v-text="alertMessage"></p>
      <div @click="closeAlert" class="image-btn">
        <span>我知道啦</span>
      </div>
    </mt-popup>


  </div>
</template>
<script>
  import {DatetimePicker, Navbar, TabItem, Popup, Indicator, MessageBox} from 'mint-ui';
  import utils from '@/components/utils'
  import fullCalendar from '@/components/vue-partcalendar/src/partCalendar'
  import moment from 'moment'

  let df = 'YYYY-MM-DD HH:mm';
  let df1 = 'YYYY/MM';
  let df2 = 'YYYY/MM/DD';

  export default {
    data(){
      return {
//        tokenHeader: {
//          charset: 'utf-8',
//          openId: this.getCookie('openId')
//        },
//         selectInfo: 'b', // 申请分类的nav
        popImgSrc: '', // 查看的图片
        popupVisible: false, // 查看图片弹框
        imgSrc: {
          ico_success: require('../../assets/ico_success.png'),
          ico_error: require('../../assets/ico_error.png'),
        },
        searchApplyRecord: [], //搜索申请记录
        leaveSuccess: false, //成功显示的弹框
        alertMessage: '',//提交弹框文字，显示提交状态
        alertSuccessImage: false,//显示提交状态
        codeSuccess: '',//点击我知道了进行状态判断跳转

        checked: true,
        checked1: true,
        checked2: true,
        fcEvents: [
//                {
//                  title : '',
//                  start : '2017/06/4',
//                  end : '2017/06/4',
//                  cssClass:'normal',
//                  YOUR_DATA  : {}
//                }
        ],
        punchState: {},//选中日期打卡信息展示
        oldDayClick: '',//已经选中的日期
        duration: null,//选中日期当日工时
        tozhang: '', //上班打卡状态
        downzhang: '',  //下班打卡状态
        connectTime: {
          chidao: '',   //迟到数量
          zaotui: '',//早退数量
          kuanggong: '',//旷工数量
          waichu: '',//外出数量
          totalTime: '',//今日工时数量
          state: true,//判断是否显示这些数量值
        },
        toSapnTime: '', // 上班时间
        downSapnTime: '', // 下班时间
        imgSrc: {
          timeIcon: require('../../assets/time.png'),
        },
      };
    },
    created: function () {
      this.changeShow()
    },
    watch: {},
    methods: {
      //拒绝并退回修改
      refuse(){

      },
      //审批状态
      applyState(state){
        let status;
        switch (state) {
          case 0:
            status = '审批中';
            break;
          case 1:
            status = '已通过';
            break;
          case 2:
            status = '未通过';
            break;
          case 3:
            status = '已撤回';
            break;
        }
        return status;
      },
      changeShow(val){ //查看审批信息
        this.$http.get('/api/v1.0/client/approval/findComplete').then(response => { //查询请假接口
          if (response.body.code === 200) {
            this.searchApplyRecord = response.body.result;
          }
        }, response => {
//          console.log('error callback');
        });
      },
      // 打开查看附件弹框
      lookImages(imgSrc){
        if (imgSrc) this.popImgSrc = imgSrc;
        else this.popImgSrc = '';
        this.popupVisible = true;
      },
      // 关闭查看附件弹框
      closeImage(){
        this.popupVisible = false;
      },
      // 格式化申请记录中的日期
      datefmt(str) {
        if (str) return moment(str).format(df);
        else return '';
      },
      //提交成功的弹框
      closeAlert(){
        this.leaveSuccess = false;
        if (this.codeSuccess === 200) {
          this.$router.push({path: '/signCard'});
        }
      },
      //通过或拒绝
      isPass(uid, type){
        let url, text;
        if (type === 1) {//通过
          url = '/api/v1.0/client/revokeApply/' + uid
          text = '是否同意当前审批？';
        } else if (type = 2) {//拒绝
          url = '/api/v1.0/client/revokeApply/' + uid
          text = '是否拒绝当前审批？';
        }
        MessageBox.confirm(text, '提示').then(action => {
          Indicator.open('正在处理中...');
          this.$http.get(url).then(response => { //提交请假申请
            Indicator.close();
            if (response.body.code === 200) {
              this.changeShow(-1);
              MessageBox('提示', '操作成功');
            } else {
              MessageBox('提示', '操作失败');
            }
          }, response => {
//          console.log('error callback');
          });
        });
      },
      //格式化加班时长
      queryOverworkTime(arr, type){
        let time = 0;
        arr.map(item => {
          if (item.type === type) {
            time = item.time;
          }
        });
        return time;
      },

      editapply () {
        this.showRevise = false;
      },
      saverevise () {
        this.showRevise = true;
      },

      dayClick (day) {
        //  点击日历，获取日期
        //  转换日期格式
        //  检测假日里是否已经含有点击的这一天
        //再此处调用每一次日期的接口 进行传值
        //点击当天进行查询打卡状态开始
        //格式化时间开始
        if (this.oldDayClick !== moment(day).format(df2)) {
          this.oldDayClick = moment(day).format(df2);
          let param = {
            date: moment(day).format(df2)
          };
          this.$http.post('/api/v1.0/client/findDatePunchCardLog', param).then(response => { //点击查看当天考勤
            if (response.body.code === 200) {
              this.punchState = response.body.result;
              this.duration = null;
              for (let i = 0; i < this.punchState.data.length; i++) {
                this.duration += this.punchState.data[i].duration;
              }
              if (typeof(this.duration) === 'number') {
                this.duration = parseFloat(this.duration.toFixed(2));
              }
            }
          }, response => {
          });
        }
      },
      changeMonth (start, end, currentStart, current) {
        let param = {
          date: moment(new Date(currentStart)).format(df1)
        };
        this.$http.post('/api/v1.0/client/findMonthAttends', param).then(response => { //查询当月考勤接口
          this.fcEvents = [];
          if (response.body.code === 200) {
            //显示默认当天考勤信息
            this.dayClick(new Date());
            if (response.body.result) {
              //显示假期信息
              let arrayShow = response.body.result.attend.holidays;
              if (arrayShow.length) {
                for (let i = 0; i < arrayShow.length; i++) {    //此处循环一个数组进行填充假期显示
                  if (arrayShow[i].rightType === '0' || arrayShow[i].rightType === '1' || arrayShow[i].rightType === '2') {
                    this.fcEvents.push({
                      isHoliday: true,
                      start: arrayShow[i].date,
                      end: arrayShow[i].date,
                    });
                  }
                }
              }
              //  改变当月工作日的背景颜色
              this.showDate(response.body.result.attend.wdSun, 0);
              this.showDate(response.body.result.attend.wdMon, 1);
              this.showDate(response.body.result.attend.wdTue, 2);
              this.showDate(response.body.result.attend.wdWed, 3);
              this.showDate(response.body.result.attend.wdThu, 4);
              this.showDate(response.body.result.attend.wdFri, 5);
              this.showDate(response.body.result.attend.wdSat, 6);
              if (response.body.result.records.length) {
                for (let i = 0; i < response.body.result.records.length; i++) { //循环添加给日历表添加日期状态
                  let connectDate = {};
                  connectDate.start = response.body.result.records[i].date;
                  connectDate.end = response.body.result.records[i].date;
                  connectDate.cssClass = response.body.result.records[i].desc;
                  this.fcEvents.push(connectDate);
                }
              }
              this.connectTime.chidao = response.body.result.belateTimes;   //赋值给查询出来的月总数
              this.connectTime.zaotui = response.body.result.leaveearlyTimes;
              this.connectTime.kuanggong = response.body.result.absentTimes;
              this.connectTime.waichu = response.body.result.outsideTimes;
            }
          }
        }, response => {
        });
      },

      showDate(name, num){ //查出展示当月工作日的背景颜色
        if (!name) {
          let week = document.getElementsByClassName('week-row');
          for (let i = 0; i < week.length; i++) {
            let data = week[i].getElementsByClassName('day-cell');
            // if (!data[num].classList.contains("not-cur-month")) {
            //   data[num].style.color = 'rgb(180,184,187)';
            // } else {
            //   data[num].style.color = '';
            // }
          }
        } else {
          let week = document.getElementsByClassName('week-row');
          for (let i = 0; i < week.length; i++) {
            let data = week[i].getElementsByClassName('day-cell');
            // if (!data[num].classList.contains("not-cur-month")) {
            //   data[num].style.color = '';
            // } else {
            //   data[num].style.color = '';
            // }
          }
        }
      },
      // 格式化时间
      formatTime(time){
        return moment(new Date(time)).format(df)
      },
      // 格式化打卡状态
      formatPunchState(state, area, time, isToday, type){
        let show = '';
        if (time) {
          if (type) {
            if (state === 0) {
              show = '正常打卡';
            } else if (state === 1) {
              show = '迟到打卡';
            } else if (state === 2) {
              show = '旷工打卡';
            }
          } else {
            if (state === 0) {
              show = '正常打卡';
            } else if (state === 1) {
              show = '早退打卡';
            } else if (state === 2) {
              show = '加班打卡';
            } else if (state === 3) {
              show = '旷工打卡';
            }
          }
          if (area) {
            show = show + '(区域外)';
          }
        } else {
          if (isToday) {
            show = '';
          } else {
            show = '未打卡';
          }
        }
        return show;
      }
    },
    components: {
      fullCalendar
    },
  }
</script>

<style lang="scss">
.approveDetail{
  background: #fff;
  .attendcontInfo{
    padding: 10px 20px;
    .attendtop{
      text-align: center;
      font-size: 14px;
      border-bottom: 1px solid #dedede;
      height: 30px;
      line-height: 30px;
    }
    .attendttit{
      font-size: 14px;
      padding: 10px 0 0 0;
      text-align: left;
    }
    .attendDetail{
      background: #F2F2F2;
      margin: 10px 0;
      font-size: 12px;
      padding: 5px 8px;
      p{
        text-align: left;
        line-height: 25px;
        font-size: 12px;
        span{
          display: inline-block;
          width: 50%;
          font-size: 12px;
          &:nth-child(1){
            float:left;
          }
          &:nth-child(1){
            float:left;
          }
        }
      }
    }
    .btnlookdet{
      text-align: center;
      .btnlookattend{
        font-size: 14px;
        width: 100px;
        height: 30px;
      }
    }
  }
  .originalinfo{
    text-align: left;
    padding: 5px 0;
    border-bottom: 1px solid #dedede;
    h1{
      font-size: 14px;
      line-height: 30px;
    }
    p{
      font-size: 12px;
      line-height: 22px;
      span{
        &:nth-child(2){
          margin-left: 20px;
        }
      }
    }
  }
  .applylist{
    padding: 5px 0;
    p{
      font-size: 14px;
      text-align: left;
      line-height: 26px;
    }
  }
  .approvebutton{
    padding: 10px 0;
    .btnsendback{
      width: 40%;
    }
    .btnpass{
      margin-left: 20px;
      width: 35%;
    }
  }

}



  /*#approve-wrapper {
    !*background: #ffffff;*!
    background: #eff3f7;
    min-height: 100vh;
    .mt10 {
      margin-top: 10px;
    }
    .pl30 {
      padding-left: 30px;
    }
    .plr15 {
      padding: 0 15px;
    }
    .fs13 {
      font-size: 13px;
    }
    .fc1 {
      color: #457aa3;
    }
    .pr {
      position: relative;
    }
    .approve-header {
      position: fixed;
      top: 0;
      width: 100%;
      height: 44px;
      z-index: 1;
      span {
        display: inline-block;
        font-size: 14px;
      }
    }
    .mint-navbar {
      background-color: #26a2ff;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      text-align: center;
      .mint-tab-item {
        color: rgba(255, 255, 255, 0.5);
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        padding: 0 !important;
        .mint-tab-item-label {
          font-size: 15px;
          height: 44px;
          span {
            height: 44px;
            line-height: 44px;
          }
        }
      }
      .mint-tab-item.is-selected {
        border-bottom: none !important;
        margin-bottom: 0 !important;
        color: #ffffff;
        span {
          display: inline-block;
        }
        span:after {
          display: block;
          margin-top: -3px;
          content: '';
          border-top: 3px solid #ffffff;
        }
      }
    }
    .approvedetcont {
      padding: 56px 15px 10px;
      background: #eff3f7;
      .approvedetcont-wrapper {
        margin-bottom: 12px;
        overflow: hidden;
        width: 100%;
        border: 1px solid #d3dce6;
        border-radius: 4px;
        .approvedetcont-top {
          height: 35px;
          background-color: #d3dde7;
          .approvedetcont-title {
            overflow: hidden;
            margin: 0;
            height: 35px;
            line-height: 35px;
            text-align: left;
            font-size: 14px;
            color: #1f2d3d;
            .approvedetcont-title-left {
              margin-left: 10px;
              margin-top: 10px;
              padding-left: 4px;
              height: 14px;
              line-height: 14px;
              float: left;
              border-left: 2px solid #1f2d3d;
            }
            .approvedetcont-title-right {
              float: right;
              margin-right: 15px;
            }
          }
        }
        .approvedetcont-Info {
          box-sizing: border-box;
          padding: 15px;
          background-color: #ffffff;
          text-align: left;
          h3, p {
            font-size: 14px;
            line-height: 16px;

          }
          h3 {
            color: #20a0ff;
          }
          p {
            margin-top: 5px;
            color: #324057;
          }
          .marginTop10 {
            margin-top: 10px;
          }
        }
        .approvedetcont-append {
          box-sizing: border-box;
          background-color: #ffffff;
          text-align: left;
          h3 {
            display: inline-block;
            font-size: 14px;
            color: #20a0ff;
          }
          .approvedetcont-btnBox {
            display: inline-block;
            width: 40%;
            .approvedetcont-btn {
              height: 22px;
              font-size: 12px;
            }
          }
        }
        .approvedetcont-append1 {
          border-top: 1px solid #d3dce6;
          padding: 10px 0;
          text-align: center;
        }
      }
      .myApplyNo {
        width: 100%;
        height: 150px;
        line-height: 150px;
        text-align: center;
        border: 1px solid #d3dce6;
        border-radius: 4px;
        color: #324057;
        background: #ffffff;
        font-size: 14px;
      }
    }
    !*查看附件*!
    .imagePopup-box {
      .imageScale-wrapper {
        width: 100%;
        .imageScale-box {
          width: 100%;
          max-height: 100vh;
          overflow: auto;
          img {
            width: 96%;
          }
        }
      }
      .v-modal {
        opacity: 1;
        background-color: #ffffff;
      }
    }
    .image-Success {
      box-sizing: border-box;
      width: 250px;
      padding: 15px;
      border-radius: 4px;
      .image-box {
        margin: 0 auto;
        width: 34px;
        height: 34px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      p {
        margin-top: 10px;
        font-size: 15px;
        line-height: 20px;
        color: #1f2d3d;
      }
      .image-btn {
        display: inline-block;
        margin-top: 20px;
        padding: 0 10px;
        height: 36px;
        line-height: 36px;
        background-color: #20a2ff;
        color: #ffffff;
        font-size: 14px;
        border-radius: 4px;
      }
    }
  }

  .approveDetail{
    background: #fff;
  }
  .approvedetcont-Info{
    &.attendcontInfo{
      .attendtop{
        text-align: center;
        font-size: 14px;
      }
      .attendttit{
        font-size: 12px;
      }
      .attendDetail{
        background: #F2F2F2;
        margin: 15px 0;
        font-size: 12px;
        padding: 5px 8px;
        p{
          text-align: left;
          line-height: 25px;
          font-size: 12px;
          span{
            display: inline-block;
            width: 50%;
            font-size: 12px;
            &:nth-child(1){
              float:left;
            }
            &:nth-child(1){
              float:left;
            }
          }
        }
      }
      .btnlookdet{
        text-align: center;
        .btnlookattend{
          font-size: 14px;
          width: 100px;
          height: 30px;
        }
      }
    }
  }*/



</style>
