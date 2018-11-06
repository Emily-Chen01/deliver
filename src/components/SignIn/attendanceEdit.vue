<template>
  <div class="attendwhite">
    <mt-header title="8月份考勤修订"></mt-header>
    <div class="attendDetail">
      <p>本月异常考勤累计时间</p>
      <!--<p>
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
      <p>法定假日加班累计时长：0.5天(共4小时)</p>-->

      <p>
        <span>迟到累计：{{attendReport.belateTimes}}次（共{{attendReport.belateTotal}}工时）</span>
        <span>早退累计：{{attendReport.leaveearlyTimes}}次（共{{attendReport.leaveearlyTotal}}工时）</span>
        <span class="spanlft">旷工累计: {{attendReport.absentTimes}}天(共{{attendReport.absentTotal}}工时)</span>
      </p>
      <p>
        <span v-for="list in attendReport.leaves">{{list.NAME}}累计: {{list.DAYS}}天</span>
      </p>
      <p>工作日加班累计时长：{{attendReport.dayOvertimeDays}}天(共{{attendReport.dayOvertime}}小时)</p>
      <p>周末加班累计时长：{{attendReport.weekendOvertimeDays}}天(共{{attendReport.weekendOvertime}}小时)</p>
      <p>法定假日加班累计时长：{{attendReport.holidayOvertimeDays}}天(共{{attendReport.holidayOvertime}}小时)</p>

    </div>

    <full-calendar
      :connectTime="connectTime"
      :events="fcEvents" lang="zh"
      @dayClick="dayClick"
      @changeMonth="changeMonth"
    ></full-calendar>

    <div class="abnormalattend">
      <p>异常考勤日期：{{daycurrent}}<span v-if="duration">（{{duration.dateStatus}}）</span></p>
      <p>异常考勤状态：<span v-if="duration">{{duration.durationstatus}}</span></p>
    </div>
    <div class="reviseapply">
      <div class="revisetop">
        修订申请<span class="editapply" @click="editapply()">修改申请</span>
      </div>
      <div class="revisecont">
        <div class="revisecontone" v-show="showRevise">
          <!--<p>考勤状态: 忘打卡</p>
          <p>
            <span>是否有加班：是</span>
            <span>加班时长: 3小时</span>
          </p>
          <p>考勤原因：忘记打卡了</p>
          <div class="submitattend">
            <mt-button type="primary" class="btnattend">
              <span>提交全部考勤修订内容</span>
            </mt-button>
          </div>-->

          <div class="leavecontInfo">
            <div class="marginTop10" v-for="list in searchApplyRecord.approvalFields">
              <div v-if="list.fieldType != '7'">
                <h3>{{list.fieldName}}：</h3>
                <p v-for="detail in list.approvalValues">{{detail.value}}</p>
              </div>
              <!--日期时间段-->
              <div class="marginTop10" v-if="list.fieldType == '7'" v-for="(detail,overIndex) in list.periodarr" :key="overIndex">
                <h3>第{{overtimeNum(overIndex)}}段{{list.fieldName}}</h3>
                <p>{{detail.startTime}}至{{detail.endTime}}</p>
              </div>
            </div>
          </div>

        </div>
        <div class="reviseconttwo" v-show="!showRevise">
          <div class="reviseitem">
            <div class="reviseitemlft">考勤状态：</div>
            <div class="reviseitemrgt">
              <p>
                <select>
                  <option value="忘记打卡">忘记打卡</option>
                  <option value="加班">加班</option>
                  <option value="事假">事假</option>
                  <option value="病假">病假</option>
                  <option value="年假">年假</option>
                </select>
              </p>
              <p><el-checkbox v-model="checked">是否有加班</el-checkbox></p>
              <p>
                加班时长：<input type="text" class="timeinput">/小时
              </p>
            </div>
          </div>
          <div class="reviseitem">
            <div class="reviseitemlft">考勤原因：</div>
            <div class="reviseitemrgt">
              <p>
                <textarea class="inputarea" placeholder="请输入考勤原因"></textarea>
              </p>
            </div>
          </div>

          <!--忘记打卡-->
          <div>
            <p>请选择忘记打卡时间</p>
            <p>
              <el-checkbox v-model="checked1">9:00</el-checkbox>
              <el-checkbox v-model="checked2">18:00</el-checkbox>
            </p>

          </div>

          <div class="revisebtm">
            <div class="revisebtmlft">
              <mt-button type="default" class="btncancel" @click="showRevise = true">
                <span>取消</span>
              </mt-button>
            </div>
            <div class="revisebtmrgt">
              <mt-button type="primary" class="btnsave" @click="saverevise()">
                <span>保存</span>
              </mt-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--选择下一级审批人-->
    <div>
      <!--<div class="approveperson">
        <div class="persontit">请选择下一级审批人</div>
        <div class="personcont">
          <el-table :data="tableData" align="center" class="persontable" style="width: 100%">
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="mobile" label="手机号" width="150"></el-table-column>
            <el-table-column prop="department" label="部门"></el-table-column>
            <el-table-column prop="job" label="职位"></el-table-column>
          </el-table>
        </div>
      </div>-->

      <el-popover
        placement="top-start"
        width="400"
        trigger="click" class="popoverPerson">
        <div class="approveperson">
          <div class="persontit">请选择下一级审批人</div>
          <div class="personcont">
            <el-table :data="tableData" align="center" class="persontable" style="width: 100%">
              <el-table-column prop="name" label="姓名"></el-table-column>
              <el-table-column prop="mobile" label="手机号" width="150"></el-table-column>
              <el-table-column prop="department" label="部门"></el-table-column>
              <el-table-column prop="job" label="职位"></el-table-column>
            </el-table>
          </div>
        </div>
        <mt-button slot="reference" type="primary" class="btnattend">
          <span>提交全部考勤修订内容</span>
        </mt-button>
      </el-popover>

    </div>


    <!--<div class="egStates">
      <div class="egClass"><span class="publicStyle normalStyle"></span>正常出勤</div>
      <div class="egClass"><span class="publicStyle abnormalStyle"></span>考勤异常</div>
      <div class="egClass"><span class="publicStyle leaveStyle"></span>请假</div>
      <div class="egClass"><span class="publicStyle holidayStyle"></span>假期</div>
    </div>
    <div style="background:rgb(239,241,247);">
      <div class="timeTitle">
        <div class="todayTime lineStyle">
          <div class="timeDivClass">
            <img :src="imgSrc.timeIcon" class="timeImageClass">
          </div>
          <div class="timeSpanClass">
            <span>今日工时共计:{{punchState.attendRuleUid !== '4' ? ((duration !== null) ? duration : '') : ''}}小时</span>
          </div>
        </div>
        <div class="punchInfo" v-for="(punchItem,punchIndex) in punchState.data" :key="punchIndex">
          <div class="punchInfoLeft">
            <div class="punchInfoLine"></div>
            <p class="punchInfoUp">
              <i class="icon_bg_signInImg bg-ico_to"></i>
            </p>
            <p class="punchInfoDown">
              <i class="icon_bg_signInImg bg-ico_off"></i>
            </p>
          </div>
          <div class="punchInfoRight">
            <p
              v-text="(punchItem.twTime ? (formatTime(punchItem.twTime)+' ') : '') + formatPunchState(punchItem.twStatus,punchItem.twOutside,punchItem.twTime,punchState.IS_TODAY,true)"></p>
            <p
              v-text="(punchItem.owTime ? (formatTime(punchItem.owTime)+' ') : '') + formatPunchState(punchItem.owStatus,punchItem.owOutside,punchItem.owTime,punchState.IS_TODAY,false)"></p>
          </div>
        </div>
      </div>
    </div>-->

  </div>
</template>
<script>
  import fullCalendar from '@/components/vue-partcalendar/src/partCalendar'
  import moment from 'moment'
  let df = 'YYYY/MM/DD HH:mm';
  let df1 = 'YYYY/MM';
  let df2 = 'YYYY/MM/DD';
  let df3 = 'YYYY-MM-DD';

  export default {
//    abnormal=异常   normal=正常   leave=请假   这个定的值是封装在日历里面定义好的颜色
    data(){
      return {
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
        duration: {},//选中日期当日工时
        tozhang: '', //上班打卡状态
        downzhang: '',  //下班打卡状态
        connectTime: {
          // chidao: '',   //迟到数量
          // zaotui: '',//早退数量
          // kuanggong: '',//旷工数量
          // waichu: '',//外出数量
          // totalTime: '',//今日工时数量
          // state: true,//判断是否显示这些数量值
        },
        toSapnTime: '', // 上班时间
        downSapnTime: '', // 下班时间
        imgSrc: {
          timeIcon: require('../../assets/time.png'),
        },
        showRevise: true,
        tableData: [{
          name: '测试',
          mobile: '13212121212',
          department: '技术部',
          job: '技术'
        },{
          name: '测试',
          mobile: '13212121212',
          department: '技术部',
          job: '技术'
        },{
          name: '测试',
          mobile: '13212121212',
          department: '技术部',
          job: '技术'
        },{
          name: '测试',
          mobile: '13212121212',
          department: '技术部',
          job: '技术'
        }],
        hasAbnormal: [],
        datePunchCardLogs: [],
        daycurrent: '',
        searchApplyRecord: [],
        attendReport: []
      }
    },
    created: function () {
      //初始化查询当月考勤省略 由于 changeMonth会执行查询这个月的数据展示

      //获取考勤详情数据
      // let param = {
      //   date: moment(day).format(df2)
      // };

      this.getDetail();

    },
    methods: {
      getDetail() {
        let uid = '980d32843ee04f2d98c0582873b0100b';
        this.$http.get('/api/v1.0/client/queryApplyDetail/'+uid).then(response => { //点击查看当天考勤
          if (response.body.code === 200) {
            let data = response.body.result;
            this.hasAbnormal = data.abnormalAttendApproval.hasAbnormal;
            this.datePunchCardLogs = data.abnormalAttendApproval.datePunchCardLogs;
            this.dateApplys = data.abnormalAttendApproval.dateApplys;
            this.attendReport = data.abnormalAttendApproval.attendReport;

            this.connectTime = data.abnormalAttendApproval;


            // this.connectTime.hasAbnormal.push('2018-11-08');
            // this.connectTime.hasAbnormal.push('2018-11-12');
            // this.connectTime.hasAbnormal.push('2018-11-18');
            // this.connectTime.hasApply.push('2018-11-21');
            // this.connectTime.hasApply.push('2018-11-22');
            // this.connectTime.hasApply.push('2018-11-24');

            console.log(this.connectTime);
            console.log(this.hasAbnormal);
            console.log(this.datePunchCardLogs);

          }
        }, response => {
        });
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

        let newday = moment(day).format(df3);
        this.daycurrent = newday;
        this.duration = this.datePunchCardLogs[newday];
        if(this.duration){
          let durationstatus = '';
          if(this.duration.isAbsent == true){
            durationstatus = '旷工';
          }else{
            if(this.duration.isBelate == true && this.duration.isLeaveearly == true){
              durationstatus = '迟到/早退';
            }else{
              if(this.duration.isBelate == true){
                durationstatus = '迟到/早退';
              }
              if(this.duration.isLeaveearly == true){
                durationstatus = '迟到/早退';
              }
            }
          }
          this.duration.durationstatus = durationstatus;
        }


        let dateApplys = this.dateApplys[newday];
        // console.log(this.dateApplys);
        // console.log(this.dateApplys[newday]);
        // console.log(this.dateApplys[newday][0].approvalFields);
        // console.log(dateApplys);
        // console.log(dateApplys[0].approvalFields);
        // console.log(5555);
        if(dateApplys){
          for(let j = 0; j < dateApplys[0].approvalFields.length; j++){
            let list = dateApplys[0].approvalFields[j];
            if(list.fieldType == '7'){
              let timearr = [];
              if(list.approvalValues.length > 0){
                let number = Math.floor(list.approvalValues.length/2);
                if(parseInt(list.approvalValues[0].term) > 0){
                  number = parseInt(list.approvalValues[0].term) + number;
                }
                for(let m = 0; m < number; m++){
                  let timeobj = {
                    startTime: '',
                    endTime: ''
                  };
                  for(let n = 0; n < list.approvalValues.length; n++){
                    let detail = list.approvalValues[n];
                    if(detail.term == m && detail.sortnum == 0){
                      timeobj.startTime = detail.value;
                    }else if(detail.term == m && detail.sortnum == 1){
                      timeobj.endTime = detail.value;
                      timearr.push(timeobj);
                    }
                  }
                }
                list.periodarr = timearr;
              }
            }
          }
          this.searchApplyRecord = dateApplys[0];
        }
        console.log(this.searchApplyRecord);


        // if (this.oldDayClick !== moment(day).format(df2)) {
        //   this.oldDayClick = moment(day).format(df2);
        //   let param = {
        //     date: moment(day).format(df2)
        //   };
        //   this.$http.post('/api/v1.0/client/findDatePunchCardLog', param).then(response => { //点击查看当天考勤
        //     if (response.body.code === 200) {
        //       this.punchState = response.body.result;
        //       this.duration = null;
        //       for (let i = 0; i < this.punchState.data.length; i++) {
        //         this.duration += this.punchState.data[i].duration;
        //       }
        //       if (typeof(this.duration) === 'number') {
        //         this.duration = parseFloat(this.duration.toFixed(2));
        //       }
        //     }
        //   }, response => {
        //   });
        // }
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
      },
      // 加班段数格式化
      overtimeNum(num){
        let arr = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
        return arr[num];
      }
    },
    components: {
      fullCalendar
    }
  }
</script>

<style scoped lang="scss">
  .attendwhite{
    background: #fff;
    .attendDetail{
      background: #F2F2F2;
      margin: 15px 20px;
      font-size: 12px;
      padding: 5px 8px;
      p{
        text-align: left;
        line-height: 25px;
        &::after{content:"";display: block;height: 0;clear: both;}
        span{
          display: inline-block;
          width: 50%;
          &:nth-child(1){
            float:left;
          }
          &:nth-child(1){
            float:left;
          }
        }
      }
    }
    .abnormalattend{
      padding: 0 20px;
      p{
        text-align: left;
        line-height: 25px;
        font-size: 12px;
      }
    }
    .reviseapply{
      border-top: 1px solid #F2F2F2;
      margin: 15px 20px 25px 20px;
      .revisetop{
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        text-align: left;
        .editapply{
          color:#26A2FF;
          float: right;
        }
      }
      .revisecont{
        text-align: left;
        .revisecontone{
          p{
            padding: 0 0 0 10px;
            font-size: 12px;
            line-height: 25px;
            span{
              &:nth-child(2){
                margin-left: 20px;
              }
            }
          }
          .submitattend{
            margin-top: 20px;
            .btnattend{
              font-size: 15px;
              width: 100%;
            }
          }
        }
        .reviseconttwo{
          .reviseitem{
            line-height: 25px;
            margin-top: 5px;
            &:after{content:"";display: block;height: 0;clear: both;}
            &:nth-child(2){
              margin-top: 10px;
            }
            .reviseitemlft{
              width: 20%;
              float: left;
              font-size: 12px;
            }
            .reviseitemrgt{
              width: 80%;
              float: left;
              font-size: 12px;
              .timeinput{
                width: 30%;
                border: 1px solid #dedede;
                border-radius: 3px;
                height: 20px;
                line-height: 20px;
                margin-right: 8px;
                outline: none;
                padding: 0 5px;
              }
              .inputarea{
                width: 100%;
                resize: none;
                height: 50px;
                border: 1px solid #dedede;
                border-radius: 3px;
                outline: none;
                padding: 5px;
                box-sizing: border-box;
                line-height: 18px;
                font-size: 12px;
              }
            }
          }
          select {
            padding-left: 4px;
            width: 100%;
            overflow: hidden;
            border: none;
            outline: none;
            font-size: 12px;
            appearance: none;
            background: url("../../assets/arrow_2.png") no-repeat scroll right center transparent;
            background-size: 15px;
            padding-right: 20px;
            option {
              color: black;
            }
          }
          .revisebtm{
            &:after{content:"";display: block;height:0;clear: both;}
            .revisebtmlft{
              width: 40%;
              float: left;
              .btncancel{
                font-size: 14px;
                width: 100%;
              }
            }
            .revisebtmrgt{
              width: 56%;
              margin-left: 4%;
              float: left;
              .btnsave{
                font-size: 14px;
                width: 100%;
              }
            }
          }
        }
      }
    }

  }

  /*.popoverPerson{*/
    /**/
  /*}*/

  .approveperson{
    .persontit{
      font-size: 12px;
      padding: 10px 0;
      text-align: center;
    }
    .personcont{
      .persontable{
        font-size: 12px;
      }
    }
  }

  .btnattend{
    font-size: 15px;
    width: 80%;
    margin: 0 auto 20px auto;
  }

  /*


  */




  .egStates {
    height: 43px;
    background: #ffffff;
    font-size: 0;
    .egClass {
      box-sizing: border-box;
      width: 25%;
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
      .holidayStyle {
        background-color: #ff4949;
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
          top: -1px;
        }
        .punchInfoDown {
          bottom: -1px;
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

  .leavecontInfo{
    font-size: 14px;
    line-height: 16px;
    .marginTop10{
      margin-top: 10px;
    }
    h3{
      font-size: 14px;
      color: #20a0ff;
    }
    p{
      margin-top: 5px;
      color: #324057;
      padding: 0 !important;
      line-height: 16px !important;
      font-size: 14px !important;
    }
  }

</style>
