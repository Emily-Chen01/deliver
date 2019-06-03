<template>
  <div id="approve-wrapper">
    <mt-navbar v-model="selectInfo" class="approve-header">
      <mt-tab-item id="a">
        <div @click="changeShow('0')"><span>待处理审批</span></div>
      </mt-tab-item>
      <mt-tab-item id="b">
        <div @click="changeShow('1')"><span>已处理审批</span></div>
      </mt-tab-item>
    </mt-navbar>
    <div class="approve-main-content">
      <div class="approve-main-content-wrapper" v-for="item in searchApplyRecord" v-if="searchApplyRecord.length>0">
        <div class="approve-main-content-top">
          <h3 class="approve-main-content-title">
            <span class="approve-main-content-title-left" v-if="item.approvalType != -1">审批申请（{{item.name}}）</span>
            <span class="approve-main-content-title-left" v-if="item.approvalType == -1">审批申请（{{item.abnormalAttendApproval.attendReport.month}}月份{{item.name}}申请）</span>
            <span class="approve-main-content-title-right">{{applyState(item.status)}}</span>
          </h3>
        </div>
        <div class="approve-main-content-Info">
          <div v-if="item.approvalType != -1">
            <h3>申请人</h3>
            <p>{{item.staffName}}（{{item.jobNumber}}）</p>
          </div>
          <div class="marginTop10" v-if="item.approvalType != -1">
            <h3>当前审批人</h3>
            <p>{{item.applyFlows[item.applyFlows.length-1].flowApproverName}}</p>
          </div>
          <!--普通审批-->
          <div class="leave-main-content-Info" v-if="item.approvalType != -1">
            <div class="marginTop10" v-for="list in item.approvalFields">
              <div v-if="list.fieldType != '7' && list.fieldType != '8'">
                <h3>{{list.fieldName}}：</h3>
                <p v-for="detail in list.approvalValues">{{detail.value}}</p>
              </div>
              <!--日期时间段-->
              <div class="marginTop10" v-if="list.fieldType == '7'" v-for="(detail,overIndex) in list.periodarr" :key="overIndex">
                <h3>第{{overtimeNum(overIndex)}}段{{list.fieldName}}</h3>
                <p>{{detail.startTime}}至{{detail.endTime}}</p>
              </div>
              <!--附件-->
              <div v-if="list.fieldType == '8'">
                <h3>{{list.fieldName}}：</h3>
                <!--图片-->
                <div class="YD_image_list" v-if="list.fileAttribute=='0'">
                  <div class="YD_image_list_item"
                       v-for="(n, index) in list.approvalValues"
                       v-fancybox-thumbnail="[n.width, n.height]" :data-index="index">
                    <img @click="queryImg($event,list.approvalValues)" :src="n.value" alt="">
                  </div>
                </div>
                <!--文件-->
                <div class="YD_image_list" v-if="list.fileAttribute=='1'">
                  <div class="YD_image_list_item"
                       v-for="(n, index) in list.approvalValues"
                       v-fancybox-thumbnail="[40, 40]" :data-index="index">
                    <img src="../../assets/ico_document.png" alt="">
                    <a :href="n.value.replace('common', 'client') + `&openid=${tokenHeader.openId}`"
                       :class="getExtType(n.value)" style="font-size: 14px;text-decoration: none;">下载</a>
                  </div>
                </div>
              </div>
            </div>
            <!--加班时显示加班时长-->
            <div class="marginTop10" v-if="item.approvalType == 3">
              <h3>累计加班时长：</h3>
              <div v-for="detail in item.workOvertimeHistories">
                <p v-if="detail.type=='0'">平日加班:{{detail.time}}小时</p>
                <p v-if="detail.type=='1'">周末加班:{{detail.time}}小时</p>
                <p v-if="detail.type=='2'">假日加班:{{detail.time}}小时</p>
              </div>
            </div>
          </div>

          <!--考勤异常审批-->
          <div class="approve-main-content-Info attendcont" v-if="item.approvalType == -1" style="padding: 0;">
            <div class="attendtop">申请人：{{item.staffName}}({{item.jobNumber}})</div>
            <div class="attendttit">原始数据</div>
            <div class="attendDetail">
              <p>本月异常考勤累计时间</p>
              <p>迟到累计：{{item.abnormalAttendApproval.attendReport.belateTimes}}次（共{{item.abnormalAttendApproval.attendReport.belateTotal}}工时）</p>
              <p>早退累计：{{item.abnormalAttendApproval.attendReport.leaveearlyTimes}}次（共{{item.abnormalAttendApproval.attendReport.leaveearlyTotal}}工时）</p>
              <p>旷工累计: {{item.abnormalAttendApproval.attendReport.absentTimes}}天(共{{item.abnormalAttendApproval.attendReport.absentTotal}}工时)</p>
              <p v-for="list in item.abnormalAttendApproval.attendReport.leaves">{{list.NAME}}累计: {{list.DAYS}}天(共{{list.HOURS}}小时)</p>
              <p>工作日加班累计时长：{{item.abnormalAttendApproval.attendReport.dayOvertimeDays}}天(共{{item.abnormalAttendApproval.attendReport.dayOvertime}}小时)</p>
              <p>周末加班累计时长：{{item.abnormalAttendApproval.attendReport.weekendOvertimeDays}}天(共{{item.abnormalAttendApproval.attendReport.weekendOvertime}}小时)</p>
              <p>法定假日加班累计时长：{{item.abnormalAttendApproval.attendReport.holidayOvertimeDays}}天(共{{item.abnormalAttendApproval.attendReport.holidayOvertime}}小时)</p>
            </div>
            <div class="attendttit">修订后数据</div>
            <div class="attendDetail">
              <p>本月异常考勤累计时间</p>
              <p>迟到累计：{{item.abnormalAttendApproval.newAttendReport.belateTimes}}次（共{{item.abnormalAttendApproval.newAttendReport.belateTotal}}工时）</p>
              <p>早退累计：{{item.abnormalAttendApproval.newAttendReport.leaveearlyTimes}}次（共{{item.abnormalAttendApproval.newAttendReport.leaveearlyTotal}}工时）</p>
              <p>旷工累计: {{item.abnormalAttendApproval.newAttendReport.absentTimes}}天(共{{item.abnormalAttendApproval.newAttendReport.absentTotal}}工时)</p>
              <p v-for="list in item.abnormalAttendApproval.newAttendReport.leaves">{{list.NAME}}累计: {{list.DAYS}}天(共{{list.HOURS}}小时)</p>
              <p>工作日加班累计时长：{{item.abnormalAttendApproval.newAttendReport.dayOvertime}}天(共{{item.abnormalAttendApproval.newAttendReport.dayOvertimeDays}}小时)</p>
              <p>周末加班累计时长：{{item.abnormalAttendApproval.newAttendReport.weekendOvertime}}天(共{{item.abnormalAttendApproval.newAttendReport.weekendOvertimeDays}}小时)</p>
              <p>法定假日加班累计时长：{{item.abnormalAttendApproval.newAttendReport.holidayOvertime}}天(共{{item.abnormalAttendApproval.newAttendReport.holidayOvertimeDays}}小时)</p>
            </div>
            <div class="btnlookdet" style="margin-bottom:10px;">
              <mt-button size="normal" class="btnlookattend" type="primary" @click="gotodetail(item.uid)">
                <span>查看详情</span>
              </mt-button>
            </div>
          </div>

          <div class="approve-main-content-append approve-main-content-append1 marginTop10" v-if="item.status===0">
            <div class="approve-main-content-btnBox">
              <mt-button size="small" class="approve-main-content-btn" type="primary" @click="isPass(item, 1)">
                <span>通过</span>
              </mt-button>
            </div>
            <div class="approve-main-content-btnBox">
              <mt-button size="small" class="approve-main-content-btn" type="primary" @click="isPass(item, 2)">
                <span>拒绝</span>
              </mt-button>
            </div>
          </div>
          <div class="approve-main-content-append approve-main-content-append1 plr15 fs13">
            <p v-for="list in item.applyFlows">
              <span v-if="list.flowStatus!=0">{{datefmt(new Date(list.flowTime))}}&nbsp;&nbsp;&nbsp;</span><span>审批人:{{list.flowApproverName}}<span v-if="list.jobNumber!='' && list.jobNumber==null && list.jobNumber!='null' && list.jobNumber!=undefined">({{list.jobNumber}})</span>&nbsp;&nbsp;&nbsp;{{applyState(list.flowStatus)}}</span>
            </p>
          </div>
        </div>
      </div>

      <div class="myApplyNo" v-if="searchApplyRecord.length===0">
        <span>没有数据</span>
      </div>
    </div>

    <!--是否有下一级审批-->
    <div v-show="hasNextperson">
      <div class="mint-msgbox-wrapper" style="position: absolute; z-index: 1001 !important;">
        <div class="mint-msgbox" style="">
          <div class="mint-msgbox-header">
            <div class="mint-msgbox-title">提示</div>
          </div>
          <div class="mint-msgbox-content">
            <div class="mint-msgbox-message">是否有下一级审批？</div>
            <div class="mint-msgbox-input" style="display: none;">
              <input placeholder="" type="text">
              <div class="mint-msgbox-errormsg" style="visibility: hidden;"></div>
            </div>
          </div>
          <div class="mint-msgbox-btns">
            <div style="display: inline-block;width: 50%;">
              <el-popover
                placement="top-start"
                trigger="click" class="popoverPerson" v-model="showperson" style="width: 100%;">
                <div class="approveperson" style="height: 300px;overflow-y: auto;">
                  <div class="persontit">请选择下一级审批人</div>
                  <div class="personcont" v-if="approvalTypeObj">
                    <el-table :data="approvalTypeObj" @row-click="selectperson" align="center" class="persontable" style="width: 100%">
                      <el-table-column prop="NAME" label="姓名"></el-table-column>
                      <el-table-column prop="MOBILE" label="手机号"></el-table-column>
                      <el-table-column prop="DEPT_NAME" label="部门"></el-table-column>
                      <el-table-column prop="POSITION" label="职位"></el-table-column>
                    </el-table>
                  </div>
                </div>
                <button slot="reference" type="primary" class="mint-msgbox-btn mint-msgbox-cancel " style="width: 100%;">
                  <span>选择下一级审批人</span>
                </button>
              </el-popover>
            </div>
            <button @click="noNextperson()" class="mint-msgbox-btn mint-msgbox-confirm ">无下一级审批</button>
          </div>
        </div>
      </div>
      <div class="v-modal" style="z-index: 1000 !important;"></div>
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
  import ElementUI from 'element-ui'
  import utilsValid from '../common/utils'
  import utils from '@/components/utils'
  import moment from 'moment'
  import fancyBox from 'vue-fancybox';


  let df = 'YYYY-MM-DD HH:mm';
  const getExtType = utilsValid.getExtType;

  export default {
    data(){
      return {
        tokenHeader: {
           charset: 'utf-8',
           openId: this.getCookie('openId')
        },
        selectInfo: 'a', // 申请分类的nav
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
        hasNextperson: true,
        approvalTypeObj: [],
        applyData:{},
        approveAllData:{},
        selectperData:'',
        showperson: false,  //是否显示选择审批人弹框
        hasNextperson: false, //是否有下一级审批人
        currentItem: {},
        currentval: '0'
      };
    },
    created: function () {
      this.changeShow('0');
    },
    watch: {},
    methods: {
      //无下一级审批人，然后同意申请
      noNextperson(){
        let arr = [];
        arr.push(this.currentItem.uid);
        let params = {
          applyUids: arr,  //申请uid
          status: 1, //状态（0待审批，1同意，3拒绝）
          nextApprover: '', //下一个审批人uid 自定义流程使用
          flowWhy: this.currentItem.why, //原因
        };
        let url = '/api/v1.0/client/agree';
        this.$http.post(url, params).then(response => { //提交请假申请
          // Indicator.close();
          this.hasNextperson = false;
          MessageBox.close();
          if (response.body.code === 200) {
            this.changeShow('1');
            this.selectInfo = 'b';
            MessageBox('提示', '操作成功');
          } else {
            MessageBox('提示', '操作失败');
          }
        }, response => {
//          console.log('error callback');
        });
      },
      // 选择审批人
      selectperson(row, event, column){
        this.selectperData = row.NAME;
        this.hasNextperson = false;
        this.showperson = false;

        let arr = [];
        arr.push(this.currentItem.uid);
        let params = {
          applyUids: arr,  //申请uid
          status: 1, //状态（0待审批，1同意，3拒绝）
          nextApprover: row.UID, //下一个审批人uid 自定义流程使用
          flowWhy: this.currentItem.why, //原因
        };
        let url = '/api/v1.0/client/agree';
        Indicator.open('正在处理中...');
        this.$http.post(url, params).then(response => { //提交请假申请
          Indicator.close();
          MessageBox.close();
          if (response.body.code === 200) {
            this.changeShow('1');
            this.selectInfo = 'b';
            MessageBox('提示', '操作成功');
          } else {
            MessageBox('提示', '操作失败');
          }
        }, response => {
//          console.log('error callback');
        });

      },
      //获取审批人列表
      approvalperson(configType){
        this.$http.get('/api/v1.0/client/findReporter/'+configType).then(response => {
          let data = response.body.result;
          this.approvalTypeObj = data;

        }, response => {
          //console.log('error callback');
        });
      },
      //查看详情
      gotodetail(uid){
        this.$router.push({path: '/attendanceEdit', query: {uid: uid, frompage: '2'} });
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
      // 加班段数格式化
      overtimeNum(num) {
        return typeof num === 'number' ? (num + 1) : '';
        // let arr = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
        // return arr[num];
      },
      changeShow(val){ //查看审批信息
        this.$http.post('/api/v1.0/client/queryOtherApplys', {
          status: val,
          pageSize: 100,
          pageNumber: 1
        }).then(response => {
          if (response.body.code === 200) {
            let data = response.body.result.list;
            for(let i = 0; i < data.length; i++){
              let item = data[i];
              for(let j = 0; j < item.approvalFields.length; j++){
                let list = item.approvalFields[j];
                if(list.fieldType == '7' && list.approvalValues.length > 0){
                  let timearr = [];
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
                }else if(list.fieldType == '8'){
                  if(list.approvalValues.length > 0){
                    for(let n = 0; n < list.approvalValues.length; n++){
                      let detail = list.approvalValues[n];
                      detail["url"] = detail.value;
                      detail["width"] = '0';
                      detail["height"] = '0';
                    }
                  }
                }
              }
            }
            this.searchApplyRecord = data;

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
      datetimestamp(str) {
        if (str){
          return moment(str).format(df);
        }else {
          return '';
        }
      },
      //提交成功的弹框
      closeAlert(){
        this.leaveSuccess = false;
        if (this.codeSuccess === 200) {
          this.$router.push({path: '/signCard'});
        }
      },
      //通过或拒绝
      isPass(item, type){
        let url, text;
        if (type === 1) {//通过
          url = '/api/v1.0/client/agree';
          text = '是否同意当前审批？';
        } else if (type = 2) {//拒绝
          url = '/api/v1.0/client/refuse/' + item.uid;
          text = '是否拒绝当前审批？';
        }
        MessageBox.confirm(text, '提示').then(action => {
          let arr = [];
          arr.push(item.uid);
          if (type === 1) {//通过
            if(item.configType == '1'){  //0 是自动,  1 是自由
              this.currentItem = item;
              this.hasNextperson = true;
              this.approvalperson(item.configType);
            }else if(item.configType == '0'){  //自动审批
              let params = {
                // applyUid: item.uid,  //申请uid
                applyUids: arr,  //申请uid
                status: 1, //状态（0待审批，1同意，3拒绝）
                nextApprover: "", //下一个审批人uid 自定义流程使用
                flowWhy: item.why, //原因
                // currentLoginUser: item.parentUid //当前登录人uid 用于判断是否是管理员审批
              };
              Indicator.open('正在处理中...');
              this.$http.post(url, params).then(response => { //提交请假申请
                Indicator.close();
                if (response.body.code === 200) {
                  this.changeShow('1');
                  this.selectInfo = 'b';
                  MessageBox('提示', '操作成功');
                } else {
                  MessageBox('提示', '操作失败');
                }
              }, response => {
//                console.log('error callback');
              });
            }

          } else if (type = 2) {//拒绝
            Indicator.open('正在处理中...');
            this.$http.get(url).then(response => { //提交请假申请
              Indicator.close();
              if (response.body.code === 200) {
                this.changeShow('1');
                this.selectInfo = 'b';
                MessageBox('提示', '操作成功');
              } else {
                MessageBox('提示', '操作失败');
              }
            }, response => {
//          console.log('error callback');
            });
          }

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
      getExtType,
      //查看图片
      queryImg(e, list){
        fancyBox(e.target, list);
      },
    },
    components: {},
  }
</script>

<style lang="scss">
  #approve-wrapper {
    /*background: #ffffff;*/
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
    .mint-navbar{
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
    .approve-main-content {
      padding: 56px 15px 10px;
      background: #eff3f7;
      .approve-main-content-wrapper {
        margin-bottom: 12px;
        overflow: hidden;
        width: 100%;
        border: 1px solid #d3dce6;
        border-radius: 4px;
        .approve-main-content-top {
          height: 35px;
          background-color: #d3dde7;
          .approve-main-content-title {
            overflow: hidden;
            margin: 0;
            height: 35px;
            line-height: 35px;
            text-align: left;
            font-size: 14px;
            color: #1f2d3d;
            .approve-main-content-title-left {
              margin-left: 10px;
              margin-top: 10px;
              padding-left: 4px;
              height: 14px;
              line-height: 14px;
              float: left;
              border-left: 2px solid #1f2d3d;
            }
            .approve-main-content-title-right {
              float: right;
              margin-right: 15px;
            }
          }
        }
        .approve-main-content-Info {
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
            text-align: left;
          }
          .marginTop10 {
            margin-top: 10px;
          }
        }
        .approve-main-content-append {
          box-sizing: border-box;
          background-color: #ffffff;
          text-align: left;
          h3 {
            display: inline-block;
            font-size: 14px;
            color: #20a0ff;
          }
          .approve-main-content-btnBox {
            display: inline-block;
            width: 40%;
            .approve-main-content-btn {
              height: 22px;
              font-size: 12px;
            }
          }
        }
        .approve-main-content-append1 {
          border-top: 1px solid #d3dce6;
          padding: 10px 0;
          text-align: center;
          margin-top:10px;
          p{
            text-align: left;
          }
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
    /*查看附件*/
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

  .approve-main-content-Info{
    &.attendcont{
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
  }

  // 复写lable原有样式
  .YD_image_list {
    line-height: normal;
    padding-bottom: 10px;
    .YD_image_list_item {
      display: inline-block;
      position: relative;
      /*overflow: hidden;*/
      height: 60px;
      width: 60px;
      margin: 2px 5px 0 0;
      .YD_image_list_item_icon {
        position: absolute;
        right: 5px;
        bottom: 5px;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

</style>
