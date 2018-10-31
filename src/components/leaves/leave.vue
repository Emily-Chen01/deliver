<template>
  <div id="leave-wrapper">
    <mt-navbar v-model="selected" class="leave-header">
      <mt-tab-item id="1">
        <span>填写申请</span>
      </mt-tab-item>
      <mt-tab-item id="2">
        <div @click="changeShow(-1)"><span>我的申请</span></div>
      </mt-tab-item>
    </mt-navbar>
    <div style="height: 30px">{{tmpnumber}}</div>
    <mt-tab-container v-model="selected" class="leave-main">
      <mt-tab-container-item id="1" class="leave-main-box">
        <div class="leavebox">
          <div class="leaveboxlft icon-stars">申请分类</div>
          <div class="leaveboxcen">
            <select v-model="selectedDataApply" @change="shengqingclick">
              <option v-for="option in applyTypeArray" :value="option.type" v-text="option.name"></option>
            </select>
          </div>
        </div>

        <div v-for="(item,index) in fields" :key="index">
          <!--单行文本 type为0-->
          <div v-if="item.fieldType=='0'" class="leavebox">
            <div class="leaveboxlft icon-stars">{{item.fieldName}}</div>
            <div class="leaveboxcen">
              <input v-model="item.value" class="inputtext" type="text" :placeholder="item.fieldDescr">
            </div>
          </div>

          <!--多行文本 type为1-->
          <div v-if="item.fieldType=='1'" class="leaveboxText">
            <div class="leaveboxText-top icon-stars">{{item.fieldName}}</div>
            <textarea v-model="item.value" :placeholder="item.fieldDescr"></textarea>
          </div>

          <!--数字 type为2-->
          <div v-if="item.fieldType=='2'" class="leavebox">
            <div class="leaveboxlft icon-stars">{{item.fieldName}}</div>
            <div class="leaveboxcen">
              <input v-model="item.value" class="inputtext" type="text" :placeholder="item.fieldDescr">
            </div>
          </div>

          <!--单选按钮 type为3-->

          <!--复选框 type为4-->
          <div v-if="item.fieldType=='4'" class="forgetclock">
            <p>{{item.fieldDescr}}</p>
            <p>
              <el-checkbox-group v-model="attendtimelist">
                <el-checkbox v-for="item in attendtime || []" :key="item" :label="item">
                  <span>{{item}}</span>
                </el-checkbox>
              </el-checkbox-group>
            </p>
          </div>
          <!--下拉菜单 type为5-->
          <!--请假和外出类型-->
          <div v-if="item.fieldType=='5'" class="leavebox">
            <div class="leaveboxlft icon-stars">{{item.fieldName}}</div>
            <div class="leaveboxcen" v-if="item.fieldName == '请假类型'">
              <select v-model="selectedDataHoliday" :class="{'colorA6':selectedDataHoliday===item.fieldHint}"
                      @change="qingjiaclick(selectedDataHoliday, index)">
                <option>{{item.fieldHint}}</option>
                <option v-for="option in holidayTypeArray" :value="option"
                        v-text="option.NAME"></option>
              </select>
            </div>
            <div class="leaveboxcen" v-if="item.fieldName == '外出类型'">
              <select v-model="selectedDataHoliday" :class="{'colorA6':selectedDataHoliday===item.fieldHint}"
                      @change="waichuclick(selectedDataHoliday, index)">
                <option>{{item.fieldHint}}</option>
                <option v-for="option in outsideObj" :value="option"
                        v-text="option.name"></option>
              </select>
            </div>
            <!--<div class="leaveboxcen" v-if="item.fieldName == '外出类型'">
              <select v-model="selectedDataHoliday" :class="{'colorA6':selectedDataHoliday===item.fieldHint}"
                      @change="qingjiaclick(selectedDataHoliday, index)">
                <option>{{item.fieldHint}}</option>
                <option v-for="option in outsideObj" :value="option"
                        v-text="option.name"></option>
              </select>
            </div>-->
          </div>

          <!--日期 type为6-->
          <div v-if="item.fieldType=='6'" class="leavebox">
            <div class="leaveboxlft icon-stars">{{item.fieldName}}</div>

            <div class="leaveboxcen" @click="openPicker(item.term, 0, item.fieldType, index)">
            <span align="left" v-text="item.value ? item.value : (item.fieldDescr ? item.fieldDescr : '请选择日期')"
                  :class="{'colorA6':!item.value}"></span>
            </div>
          </div>
          <!--日期区间 type为7-->
          <!--<div v-if="item.fieldType=='7'">
            <div class="mt10">
              <h4 align="left" class="fc1 pr" v-if="item.sortnumtmp == 0">
                <span v-text="'第'+overtimeNum(item.term)+'段'+item.fieldName"></span>
                <span v-if="item.term>0" class="leave-main-box-del" @click="deleteTime(item.term)">+</span>
              </h4>
              <div class="pl30">
                <div class="leavebox">
                  <div class="leaveboxlft icon-stars">{{ item.sortnumtmp == 0 ? '开始时间' : '结束时间'}}</div>
                  <div class="leaveboxcen">
            <span align="left" v-text="item.value ? item.value : (item.fieldDescr ? item.fieldDescr : '请选择日期')"
                  :class="{'colorA6':!item.value}" @click="openPicker(item.term, item.sortnumtmp, item.fieldType, index)"></span>
                  </div>
                  &lt;!&ndash;<div class="leaveboxcen">
            <span align="left" v-text="item.value"
                  :class="{'colorA6':!item.value}" @click="openPicker(item.term, item.sortnumtmp, item.fieldType, index)"></span>
                  </div>&ndash;&gt;
                </div>
              </div>
            </div>
            <div class="mt10" v-if="(item.term == periodnum-1) && item.sortnumtmp == 1">
              <mt-button type="primary"
                         @click.native="addTime()">
                <span> +添加新的加班时间段</span>
              </mt-button>
            </div>
          </div>-->

          <!--返回多个日期时间段时，默认只去最后一个-->
          <div v-if="item.fieldType=='7' && perioduid == item.uid">
            <div class="mt10" v-for="(apply,applyIndex) in applyWorkRef" :key="applyIndex">
              <h4 align="left" class="fc1 pr">
                <span v-text="'第'+overtimeNum(applyIndex)+'段加班申请'"></span>
                <span v-if="applyIndex>0" class="leave-main-box-del" @click="deleteTime(applyIndex)">+</span>
              </h4>
              <div class="pl30">
                <div class="leavebox">
                  <div class="leaveboxlft icon-stars">开始时间</div>
                  <div class="leaveboxcen">
              <span align="left" v-text="apply.startTime ? apply.startTime : '请输入日期'"
                    :class="{'colorA6':!apply.startTime}" @click="openPicker(0, applyIndex, item.fieldType, index)"></span>
                    <!--term, sortnum, fieldType, index-->
                  </div>
                </div>
                <div class="leavebox">
                  <div class="leaveboxlft icon-stars">结束时间</div>
                  <div class="leaveboxcen">
                <span align="left" v-text="apply.endTime ? apply.endTime : '请输入日期'"
                      :class="{'colorA6':!apply.endTime}" @click="openPicker(1,applyIndex, item.fieldType, index)"></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt10">
              <mt-button type="primary"
                         @click.native="addTime()">
                <span> +添加时间 </span>
                <!--<span v-if="item.code=='leaveTime'"> +添加事假时间</span>-->
                <!--<span v-if="item.code=='outTime'"> +添加新的加班时间段</span>-->
              </mt-button>
            </div>
          </div>


          <!--附件 type为8-->
          <div v-if="item.fieldType=='8' && updateImage" class="leaveboxImg">
            <div class="" style="height: 10px;background: #dedede;"></div>
            <el-upload
              action="/api/v1.0/client/upload"
              name="files"
              :show-file-list="false"
              :headers="tokenHeader"
              :on-success="passportUrlOk"
              :before-upload="beforePassportUrl">
              <div class="leavebox-upload"
                   :style="{'background-image': 'url('+(applyData.image ? applyData.image : imgSrc.shenFenIconShowCamera)+')'}"></div>
            </el-upload>
            <p v-show="passportUrlErrFlag">
              请上传正确的护照照片(格式为 jpg 或 jpeg 或 png，照片体积小于 5 兆)</p>
          </div>
        </div>
        <div class="leavebox">
          <div class="leaveboxlft icon-stars">审批对象</div>
          <div class="leaveboxcen">
            <!--<mt-button size="small" class="leave-main-content-btn" type="primary">
              <span>选择审批人</span>
            </mt-button>-->

            <!--选择下一级审批人-->

            <!--typeof b === 'object' && !isNaN(b.length)-->
            <div v-if="(typeof approvalTypeObj === 'object') && approvalTypeObj.length == undefined">{{approvalTypeObj.NAME}}</div>
            <div v-if="(typeof approvalTypeObj === 'object') && approvalTypeObj.length > 0">
              <el-popover
                placement="top-start"
                width="400"
                trigger="click" class="popoverPerson">
                <div class="approveperson">
                  <div class="persontit">请选择下一级审批人</div>
                  <div class="personcont">
                    <el-table :data="approvalTypeObj" @row-click="selectperson()" align="center" class="persontable" style="width: 100%">
                      <el-table-column prop="NAME" label="姓名"></el-table-column>
                      <el-table-column prop="MOBILE" label="手机号" width="150"></el-table-column>
                      <el-table-column prop="DEPT_NAME" label="部门"></el-table-column>
                    </el-table>
                  </div>
                </div>
                <mt-button slot="reference" size="small" type="primary" class="btnattend">
                  <span>选择审批人</span>
                </mt-button>
              </el-popover>

            </div>

          </div>
        </div>

        <!--原来页面的表单，先注释-->
        <div style="display: none;">
          <div style="height: 350px;border:1px solid #dedede"></div>
          <div class="leavebox" v-if="changeApply">
            <div class="leaveboxlft icon-stars">假期分类</div>
            <div class="leaveboxcen">
              <select v-model="selectedDataHoliday" :class="{'colorA6':selectedDataHoliday==='选择假期类型'}"
                      @change="qingjiaclick(selectedDataHoliday)">
                <option>选择假期类型</option>
                <option v-for="option in holidayTypeArray" :value="option"
                        v-text="option.NAME"></option>
              </select>
            </div>
          </div>
          <div class="leavebox" v-if="changeApply && (selectHoliday.TYPE===0||selectHoliday.TYPE===13)">
            <div class="leaveboxlft">剩余假期</div>
            <div class="leaveboxcen">
              <span align="left" class="colorA6" v-text="selectHoliday.DAYS+(selectHoliday.TYPE===0?' 天':' 小时')"></span>
            </div>
          </div>
          <div v-if="selectedDataApply!==3">
            <div class="leavebox">
              <div class="leaveboxlft icon-stars">开始时间</div>
              <div class="leaveboxcen" @click="openPicker(0)">
              <span align="left" v-text="startTimeValue ? startTimeValue : '请输入日期'"
                    :class="{'colorA6':!startTimeValue}"></span>
              </div>
            </div>
            <div class="leavebox">
              <div class="leaveboxlft icon-stars">结束时间</div>
              <div class="leaveboxcen" @click="openPicker(1)">
                <span align="left" v-text="endTimeValue ? endTimeValue : '请输入日期'"
                      :class="{'colorA6':!endTimeValue}"></span>
              </div>
            </div>
          </div>
          <div v-if="selectedDataApply===3">
            <div class="mt10" v-for="(apply,applyIndex) in applyWorkRef" :key="applyIndex">
              <h4 align="left" class="fc1 pr">
                <span v-text="'第'+overtimeNum(applyIndex)+'段加班申请'"></span>
                <span v-if="applyIndex>0" class="leave-main-box-del" @click="deleteTime(applyIndex)">+</span>
              </h4>
              <div class="pl30">
                <div class="leavebox">
                  <div class="leaveboxlft icon-stars">开始时间</div>
                  <div class="leaveboxcen">
              <span align="left" v-text="apply.startTime ? apply.startTime : '请输入日期'"
                    :class="{'colorA6':!apply.startTime}" @click="openPicker(0,applyIndex)"></span>
                  </div>
                </div>
                <div class="leavebox">
                  <div class="leaveboxlft icon-stars">结束时间</div>
                  <div class="leaveboxcen">
                <span align="left" v-text="apply.endTime ? apply.endTime : '请输入日期'"
                      :class="{'colorA6':!apply.endTime}" @click="openPicker(1,applyIndex)"></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt10">
              <mt-button type="primary"
                         @click.native="addTime()">
                <span> +添加新的加班时间段</span>
              </mt-button>
            </div>

          </div>
          <div class="leaveboxImg" v-if="updateImage">
            <el-upload
              action="/api/v1.0/client/upload"
              name="files"
              :show-file-list="false"
              :headers="tokenHeader"
              :on-success="passportUrlOk"
              :before-upload="beforePassportUrl">
              <div class="leavebox-upload"
                   :style="{'background-image': 'url('+(applyData.image ? applyData.image : imgSrc.shenFenIconShowCamera)+')'}"></div>
            </el-upload>
            <p v-show="passportUrlErrFlag">
              请上传正确的护照照片(格式为 jpg 或 jpeg 或 png，照片体积小于 5 兆)</p>
          </div>
          <div class="leaveboxText">
            <div class="leaveboxText-top icon-stars">申请内容</div>
            <textarea placeholder="#请输入文字(不超过50字)" v-model="applyData.remarks"></textarea>
          </div>
          <div class="leavebox" v-if="approvalTypeObj">
            <div class="leaveboxlft"
                 v-text="approvalTypeObj.WAY==='1'?'审批人':(approvalTypeObj.WAY==='2'?'审批邮箱':'')"></div>
            <div class="leaveboxcen" v-text="approvalTypeObj.NAME"></div>
          </div>
        </div>

        <div class="leaveboxBtn">
          <mt-button type="primary" class="leaveboxBtn-btn"
                     @click.native="handerDataSubmit()">
            <span>提交</span>
          </mt-button>
        </div>
      </mt-tab-container-item>

      <!--我的申请-->
      <mt-tab-container-item id="2" class="leave-main-applyInfo">
        <mt-navbar v-model="selectInfo" class="leave-header">
          <mt-tab-item id="a">
            <div @click="changeShow(-1)"><span>全部</span></div>
          </mt-tab-item>
          <mt-tab-item id="b">
            <div @click="changeShow(0)"><span>审核中</span></div>
          </mt-tab-item>
          <mt-tab-item id="c">
            <div @click="changeShow(1)"><span>已通过</span></div>
          </mt-tab-item>
          <mt-tab-item id="d">
            <div @click="changeShow(2)"><span>未通过</span></div>
          </mt-tab-item>
        </mt-navbar>
        <div class="leave-main-content">
          <!--原来显示内容-->
          <div class="leave-main-content-wrapper" v-for="item in searchApplyRecord" v-if="searchApplyRecord.length>0">
            <div class="leave-main-content-top">
              <h3 class="leave-main-content-title">
                <span class="leave-main-content-title-left"
                      v-text="item.name+'申请'+(item.name===item.sname ? '':('('+item.sname+')'))"></span>
                <span class="leave-main-content-title-right"
                      v-text="applyState(item.status)"></span>
              </h3>
            </div>
            <div class="leave-main-content-Info">
              <div v-if="item.time&&item.time.length>0" :class="{'marginTop10': overIndex>0}"
                   v-for="(overTime,overIndex) in item.time" :key="overIndex">
                <h3 v-text="'第'+overtimeNum(overIndex)+'段时间起止时间'"></h3>
                <p>
                  <span v-text="datefmt(overTime.startTime)"></span> 至 <span v-text="datefmt(overTime.endTime)"></span>
                </p>
              </div>
              <div v-if="!(item.time&&item.time.length>0)">
                <h3>起止日期</h3>
                <p>
                  <span v-text="datefmt(item.startTime)"></span> 至 <span v-text="datefmt(item.endTime)"></span>
                </p>
              </div>
              <div v-if="item.configType===3 && item.overworkTime" class="marginTop10">
                <h3>加班时长</h3>
                <p><span>平日加班：</span><span v-text="queryOverworkTime(item.workTime,0)+'小时'"></span></p>
                <p><span>周末加班：</span><span v-text="queryOverworkTime(item.workTime,1)+'小时'"></span></p>
                <p><span>节假日加班：</span><span v-text="queryOverworkTime(item.workTime,2)+'小时'"></span></p>
              </div>
              <div v-if="!(item.configType===3)" class="marginTop10">
                <h3>申请时长</h3>
                <p><span v-text="item.days ? item.days : '--'"></span></p>
              </div>
              <div class="marginTop10">
                <h3>事由</h3>
                <p v-text="item.remarks "></p>
              </div>
              <div v-if="item.why" class="marginTop10">
                <h3>拒绝原因</h3>
                <p v-text="item.why"></p>
              </div>
              <div class="leave-main-content-append marginTop10" v-if="item.image">
                <h3>附件内容：</h3>
                <mt-button size="small" class="leave-main-content-btn" type="primary" @click="lookImages(item.image)">
                  <span>查看附件</span>
                </mt-button>
              </div>
              <div class="marginTop10" v-if="item.status===0&&(item.category===1||item.category===2)">
                <h3 v-text="item.category===1 ? '当前审批人' : '当前审批邮箱'"></h3>
                <p v-text="item.category===1 ? item.approvaler : item.email"></p>
              </div>
            </div>
            <div class="leave-main-content-append leave-main-content-append1 " v-if="item.status===0">
              <mt-button size="small" class="leave-main-content-btn" type="primary" @click="revokes(item.uid)">
                <span>撤回申请</span>
              </mt-button>
            </div>
          </div>

          <div class="myApplyNo" v-if="searchApplyRecord.length===0">
            <span>没有数据</span>
          </div>
        </div>
      </mt-tab-container-item>
    </mt-tab-container>
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


    <mt-datetime-picker
      type="datetime"
      ref="picker0"
      v-model="startTimeValue1"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      hour-format="{value} 时"
      minute-format="{value} 分"
      @confirm="handleConfirmStart"
    >
    </mt-datetime-picker>
    <mt-datetime-picker
      type="datetime"
      ref="picker1"
      v-model="endTimeValue1"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      hour-format="{value} 时"
      minute-format="{value} 分"
      @confirm="handleConfirmEnd"
    >
    </mt-datetime-picker>

  </div>
</template>
<script>
  import {DatetimePicker, Navbar, TabItem, Popup, Indicator, MessageBox} from 'mint-ui';
  import utils from '@/components/utils'
  import moment from 'moment'

  let df = 'YYYY-MM-DD HH:mm';

  export default {
    data(){
      return {
        tokenHeader: {
          charset: 'utf-8',
          openId: this.getCookie('openId')
        },
        passportUrlErrFlag: false,// 判断图片格式是否正确
        selected: '1',// 最上层的填写申请，申请分类的nav
        selectInfo: 'a', // 申请分类的nav
        popImgSrc: '', // 查看的图片
        popupVisible: false, // 查看图片弹框
        selectedDataApply: 0, //选择的申请类型
        applyTypeArray: [], //申请分类
        selectedDataHoliday: '请选择假期类型', // 选择的假期类型
        holidayTypeArray: [], // 假期类型列表
        selectHoliday: {},
        imgSrc: {
          shenFenIconShowCamera: require('../../assets/camera.png'),
          ico_success: require('../../assets/ico_success.png'),
          ico_error: require('../../assets/ico_error.png'),
        },
        changeApply: true, // 是否显示假期分类
        updateImage: true, //上传图片按钮是否隐藏
        approvalTypeObj: {}, // 审批人
        startTimeValue: '', //开始时间value
        startTimeValue1: new Date(),  //初始化日历插件
        endTimeValue: '',  //结束时间value
        endTimeValue1: new Date(),//初始化日历插件
        // searchApplyRecord: [], //搜索申请记录
        searchApplyRecord: [
          {
            name: 'test',
            sname: '加班申请',
            status: 0,
            time: [
              {
                startTime: '2018-10-24 9:00',
                endTime: '2018-10-24 12:00'
              },
              {
                startTime: '2018-10-25 9:00',
                endTime: '2018-10-25 12:00'
              }
            ],
            configType: '3',
            overworkTime: true,
            workTime: '2',
            days: '5',
            remarks: '有事需要请假',
            category: '1',
            image: '',
            uid: '123456',
            email: '12121212@qq.com'
          },
          {
            name: 'test',
            sname: '加班申请',
            status: '审批中',
            time: [
              {
                startTime: '2018-10-24 9:00',
                endTime: '2018-10-24 12:00'
              },
              {
                startTime: '2018-10-25 9:00',
                endTime: '2018-10-25 12:00'
              }
            ],
            configType: '3',
            overworkTime: true,
            workTime: '2',
            days: '5',
            remarks: '有事需要请假',
            category: '1',
            image: '',
            uid: '123456',
            email: '12121212@qq.com'
          }
        ], //搜索申请记录
        leaveSuccess: false, //成功显示的弹框
        alertMessage: '',//提交弹框文字，显示提交状态
        alertSuccessImage: false,//显示提交状态
        codeSuccess: '',//点击我知道了进行状态判断跳转
        applyData: {
          approvalTypeUid: '',  //申请类型Uid
          approvalConfigUid: '',  //具体流程的uid
          leaveUid: '',  //假期类型uid (非必填)
          category: '',  //审批人类型
          currentApprover:'',  //审批人uid
          email:'',  //审批人邮箱
          approvalValues:[
            {
              approvalFieldUid: '',  //申请模板字段uid
              value: '',  //填写的值
              term: '',  //多段的填写0开始 第一段申请时间，默认写0
              sortnum: '0'  //时间段开始时间0，结束时间1   默认写0
            }
          ]
        },
        approvalValues:[
          {
            approvalFieldUid: '',  //申请模板字段uid
            value: '',  //填写的值
            term: '',  //多段的填写0开始 第一段申请时间，默认写0
            sortnum: '0'  //时间段开始时间0，结束时间1   默认写0
          }
        ],
        approvalValuestmp: [],
        applyWorkRef: [//加班时间段
          {
            startTime: '',
            endTime: '',
          }
        ],
        pos: '',//记录加班时间段的位置
        fieldsdata: {},
        fields: [],
        checked1: true,
        checked2: false,
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
        attendtime: [],  //忘记打卡时间
        attendtimelist: ['18:00'],
        periodnum: 0,
        perioduid: '',
        tmpnumber: "1",
        outsideObj: []
      };
    },
    created: function () {
      //查询申请类型列表
      this.$http.get('/api/v1.0/client/queryApprovalType').then(response => {
        if (response.body.code === 200) {
          this.applyTypeArray = response.body.result;
          console.log(this.applyTypeArray);
          this.selectedDataApply = parseInt(this.getCookie('leaveType'));
          this.shengqingclick();
          // this.selectedDataApply = 3;
        }
      }, response => {
        console.log('error callback');
      });

      //审批人列表
//       this.$http.get('/api/v1.0/client/findReporter').then(response => {
//         this.approvalTypeObj = response.body.result;
//       }, response => {
// //        console.log('error callback');
//       });

      //获取忘记打卡时间列表
      this.$http.get('/api/v1.0/client/queryAttendTime').then(response => {
        this.attendtime = response.body.result;
        // for(let i = 0; i < this.attendtime.length; i++){
        //   this.attendtime[i].checktime = false;
        // }
      }, response => {
        console.log('error callback');
      });

      this.attendtime = [ '9:00', '18:00'];
      console.log(this.attendtime);

      //假期分类
      this.$http.get('/api/v1.0/client/findValidLeaves').then(response => {
        this.holidayTypeArray = response.body.result;
      }, response => {
        console.log('假期分类 error callback');
      });

      /*this.$http.get('/api/v1.0/client/queryApprovalType').then(response => { //查看审批类型
        this.holidayTypeArray = response.body.result;
      }, response => {
//        console.log('假期分类 error callback');
      });*/

      // this.approvalform();

    },
    watch: {},
    methods: {
      // 选择审批人
      selectperson(){

      },
      //根据审批类型返回的审批表单
      shengqingclick(){
        console.log(this.selectedDataApply);
        // this.selectedDataApply = 2;

        let state = false;
        for (let i = 0; i < this.applyTypeArray.length; i++) {
          if (this.selectedDataApply === this.applyTypeArray[i].type) {
            this.applyData.approvalTypeUid = this.applyTypeArray[i].uid;   //申请分类类型的uid
            state = true;
          }
        }
        if (!state) {
          this.selectedDataApply = this.applyTypeArray[0].type;
          this.applyData.approvalTypeUid = this.applyTypeArray[0].uid;
        }

        this.$http.get('/api/v1.0/client/queryApprovalForm/'+this.selectedDataApply).then(response => {
          if (response.body.code === 200) {
            this.fieldsdata = response.body.result;
            let configType = response.body.result.configType;
            this.approvalperson(configType);
            this.applyData.approvalConfigUid = response.body.result.uid;  //具体流程的uid

            //处理提交的表单数据格式
            let approvalValues = [];
            let periodnum = 0;
            this.fields = [];
            this.applyWorkRef = [];
            for( let i = 0; i < this.fieldsdata.fields.length; i++){
              let item = this.fieldsdata.fields[i];
              if(this.selectedDataApply=='2' && item.defaultType == '43'){
                this.approvaloutside(item.defaultType);
              }
              if(item.fieldType == '7'){
                let itemtmp = {};
                this.perioduid = item.uid;
                this.applyWorkRef.push({
                  startTime: '',
                  endTime: '',
                  uid: item.uid
                });


                /*for(let j = 0; j < 2; j++){
                  // item.approvalValues = approvalValues;
                  // itemtmp = item;

                  itemtmp = {
                    accountUid : item.accountUid,
                    approvalConfigUid : item.approvalConfigUid,
                    approvalFieldValue : item.approvalFieldValue,
                    approvalFieldValues : item.approvalFieldValues,
                    approvalValues : item.approvalValues,
                    code : item.code,
                    companyUid : item.companyUid,
                    conditions : item.conditions,
                    datetimeType : item.datetimeType,
                    defaultType : item.defaultType,
                    fieldDescr : item.fieldDescr,
                    fieldHint : item.fieldHint,
                    fieldLimit : item.fieldLimit,
                    fieldMinSize : item.fieldMinSize,
                    fieldName : item.fieldName,
                    fieldSize : item.fieldSize,
                    fieldType : item.fieldType,
                    fileAttribute : item.fileAttribute,
                    isDefault : item.isDefault,
                    isRequired : item.isRequired,
                    javaValidexp : item.javaValidexp,
                    jsValidexp : item.jsValidexp,
                    numberLimit : item.numberLimit,
                    orientation : item.orientation,
                    sortnum : item.sortnum,
                    uid : item.uid,
                    sortnumtmp : j,
                    term : periodnum
                  };
                  // itemtmp.term = periodnum;
                  // itemtmp.sortnum = j;
                  this.fields.push(itemtmp);
                }
                console.log(345);
                console.log(this.fields);
                periodnum++;*/

                this.fields.push(item);
              }else{
                item.term = 0;
                item.sortnumtmp = 0;
                this.fields.push(item);
              }
            }
            this.periodnum = periodnum;
            console.log(this.fields);
            console.log(this.applyWorkRef);
            console.log(55555);

            // this.approvalValues = approvalValues;
            // console.log(approvalValues);
          }
        }, response => {
//        console.log('error callback');
        });
      },
      //获取审批人列表
      approvalperson(configType){
        this.$http.get('/api/v1.0/client/findReporter/'+configType).then(response => {
          let data = response.body.result;
          console.log("data.length="+data.length);

          this.approvalTypeObj = data;
          // this.applyData.applicant = data.UID;   //申请人uid
          this.applyData.category = data.WAY;
          if(data.WAY == '1'){
            this.applyData.currentApprover = data.UID;
          }

          var a=[];
          var b={};
          typeof a === 'object' && !isNaN(a.length)//true 数组
          typeof b === 'object' && !isNaN(b.length)//false 对象

        }, response => {
          //console.log('error callback');
        });
      },
      //获取外出类型列表
      approvaloutside(configType){
        this.$http.get('/api/v1.0/common/config/'+configType).then(response => {
          let data = response.body.result;
          this.outsideObj = data;
          console.log(this.outsideObj);
          // this.applyData.applicant = data.UID;   //申请人uid
          // this.applyData.category = data.WAY;
          // if(data.WAY == '1'){
          //   this.applyData.currentApprover = data.UID;
          // }
        }, response => {
          //console.log('error callback');
        });
      },
      //添加加班时间段
      addTime(){
        this.applyWorkRef.push({
          startTime: '',
          endTime: '',
          uid: this.perioduid
        });

      },
      //删除加班时间段
      deleteTime(num){
        this.applyWorkRef.splice(num, 1);
      },
      // 开始时间格式化
      handleConfirmStart(data){
        // if (data) {
        //   this.fields[this.pos].value =  moment(data).format(df);
        //   this.tmpnumber = 2;
        // }

        if (this.fieldTypecurr === '7') {
          this.applyWorkRef[this.pos].startTime = moment(data).format(df);
        } else if(this.fieldTypecurr === '6'){
          this.startTimeValue = moment(data).format(df);
        }

      },
      // 结束时间格式化
      handleConfirmEnd(data){
        // if (data) {
        //   this.fields[this.pos].value =  moment(data).format(df);
        //   this.tmpnumber = 2;
        // }

        if (this.fieldTypecurr === '7') {
          this.applyWorkRef[this.pos].endTime = moment(data).format(df);
        } else if(this.fieldTypecurr === '6'){
          this.endTimeValue = moment(data).format(df);
        }
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
      // 日历样式
      // openPicker(term, sortnum, fieldType, index) {
      openPicker(type, pos, fieldType, index) {
        // this.pos = index;
        // if(sortnum == 0){
        //   let displaytime = this.fields[index].value;
        //   this.startTimeValue1 = displaytime ? displaytime : new Date();
        //   this.$refs.picker0.open();
        //   console.log("我是picker0");
        // }else if(sortnum == 1){
        //   let displaytime = this.fields[index].value;
        //   this.endTimeValue1 = displaytime ? displaytime : new Date();
        //   this.$refs.picker1.open();
        //   console.log("我是picker1");
        // }

        this.pos = pos;
        this.fieldTypecurr = fieldType;
        if(fieldType == '6'){
            let displaytime = this.fields[index].value;
            this.startTimeValue1 = displaytime ? displaytime : new Date();
            this.$refs.picker0.open();
        }else if(fieldType == '7'){
          if(type == 0){
            if(this.applyWorkRef[this.pos].startTime){
              this.startTimeValue1 = this.applyWorkRef[this.pos].startTime;
            }else{
              this.startTimeValue1 = new Date();
            }
            this.$refs.picker0.open();
          }else if(type == 1){
            if(this.applyWorkRef[this.pos].endTime){
              this.endTimeValue1 = this.applyWorkRef[this.pos].endTime;
            }else{
              this.endTimeValue1 = new Date();
            }
            this.$refs.picker1.open();
          }
        }


        /*if (type === 0) {
          if (fieldType == '7' && this.applyWorkRef[this.pos].startTime) {
            this.startTimeValue1 = this.applyWorkRef[this.pos].startTime;
          } else if (fieldType == '6') {
            this.startTimeValue1 = new Date();
          } else {
            this.startTimeValue1 = this.startTimeValue ? this.startTimeValue : new Date();
          }
          this.$refs.picker0.open();
        } else {
          if (this.applyWorkRef[this.pos].endTime) {
            this.endTimeValue1 = this.applyWorkRef[this.pos].endTime;
          } else if (this.selectedDataApply === 3) {
            this.endTimeValue1 = new Date();
          } else {
            this.endTimeValue1 = this.endTimeValue ? this.endTimeValue : new Date();
          }
          this.$refs.picker1.open();
        }*/


        /*if (type === 0) {
          // if ((this.selectedDataApply === 3) && this.applyWorkRef[this.pos].startTime) {
          //   this.startTimeValue1 = this.applyWorkRef[this.pos].startTime;
          // } else if (this.selectedDataApply === 3) {
          //   this.startTimeValue1 = new Date();
          // } else {
          //   this.startTimeValue1 = this.startTimeValue ? this.startTimeValue : new Date();
          // }
          if (this.applyWorkRef[this.pos].startTime) {
            this.startTimeValue1 = this.applyWorkRef[this.pos].startTime;
          } else if (this.selectedDataApply === 3) {
            this.startTimeValue1 = new Date();
          } else {
            this.startTimeValue1 = this.startTimeValue ? this.startTimeValue : new Date();
          }
          this.$refs.picker0.open();
        } else {
          if (this.applyWorkRef[this.pos].endTime) {
            this.endTimeValue1 = this.applyWorkRef[this.pos].endTime;
          } else if (this.selectedDataApply === 3) {
            this.endTimeValue1 = new Date();
          } else {
            this.endTimeValue1 = this.endTimeValue ? this.endTimeValue : new Date();
          }
          this.$refs.picker1.open();
        }*/
      },
      // 加班段数格式化
      overtimeNum(num){
        let arr = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
        return arr[num];
      },
      changeShow(val){ //查看申请记录
        // this.$http.post('/api/v1.0/client/findApplys', {
        this.$http.post('/api/v1.0/queryOwnApplys', {
          status: val,
          pageSize: 100,
          pageNumber: 1
        }).then(response => { //查询请假接口
          if (response.body.code === 200) {
            this.searchApplyRecord = response.body.result;
          }
        }, response => {
//          console.log('error callback');
        });

      },
      //提交申请
      handerDataSubmit(){
        Indicator.open('正在提交申请...');
        let approvalValues = [];
        for( let i = 0; i < this.fields.length; i++){
          let item = this.fields[i];
          if(item.fieldType != "7"){
            approvalValues.push({
              approvalFieldUid : item.uid,
              value : item.value,
              term : item.term,
              sortnum : item.sortnumtmp
            });
          }
        }

        let periodarr = [];
        for(let i = 0; i < this.applyWorkRef.length; i++){
          let item = this.applyWorkRef[i];
          for(let j = 0; j < 2; j++){
            let timecurr;
            if(j == 0){
              timecurr = item.startTime;
            }else if(j == 1){
              timecurr = item.endTime;
            }
            periodarr.push({
              approvalFieldUid : item.uid,
              value : timecurr,
              term : i,
              sortnum : j
            });
          }
        }
        this.applyData.approvalValues = approvalValues.concat(periodarr);
        this.$http.post('/api/v1.0/client/apply', this.applyData).then(response => { //提交请假申请
          Indicator.close();//申请提交成功
          this.codeSuccess = response.body.code;
          // this.leaveSuccess = true;
          // if (response.body.code === 200) {
          //   this.alertSuccessImage = true;
          //   this.alertMessage = response.body.message;
          // } else {
          //   this.alertSuccessImage = false;
          //   this.alertMessage = response.body.message
          // }
        }, response => {
//          console.log('error callback');
        });


        /*// 表单验证
        let applyData = this.applyData;
        let selectedDataApply = this.selectedDataApply;
        if(selectedDataApply == '0'){ //请假
          if(applyData.leaveUid == ''){
            console.log("请选择请假类型");
          }
        }
        return false;
        if (this.selectedDataApply === 3) {
          this.applyData.applyWorkRef = this.applyWorkRef.map((item, index) => {
            return {
              startTime: new Date(item.startTime).getTime(),
              endTime: new Date(item.endTime).getTime(),
              sortnum: index,
            };
          });
        } else {
          this.applyData.startTime = new Date(this.startTimeValue).getTime();
          this.applyData.endTime = new Date(this.endTimeValue).getTime();
        }
        this.applyData.remarks = this.applyData.remarks.trim();
        if (this.approvalTypeObj) {
          if (this.approvalTypeObj.WAY === '1') {
            this.applyData.category = '1';
            this.applyData.currentApprover = this.approvalTypeObj.UID
          } else if (this.approvalTypeObj.WAY === '2') {
            this.applyData.category = '2';
            this.applyData.email = this.approvalTypeObj.NAME
          }
        }
        this.$http.post('/api/v1.0/client/apply', this.applyData).then(response => { //提交请假申请
          Indicator.close();//申请提交成功
          this.codeSuccess = response.body.code;
          this.leaveSuccess = true;
          if (response.body.code === 200) {
            this.alertSuccessImage = true;
            this.alertMessage = response.body.message;
          } else {
            this.alertSuccessImage = false;
            this.alertMessage = response.body.message
          }
        }, response => {
//          console.log('error callback');
        });*/
      },

      // 选择申请分类
      /*shengqingclick(){ //初始是选中一个select然后进行参数选中为了提交用
        this.updateImage = true; //上传图片按钮是否隐藏 true显示false隐藏
        this.changeApply = false; //假期类型隐藏
        let state = false;
        for (let i = 0; i < this.applyTypeArray.length; i++) {
          if (this.selectedDataApply === this.applyTypeArray[i].type) {
            this.applyData.approvalConfigUid = this.applyTypeArray[i].uid;
            state = true;
          }
        }
        if (!state) {
          this.selectedDataApply = this.applyTypeArray[0].type;
          this.applyData.approvalConfigUid = this.applyTypeArray[0].uid;
        }
        if (this.selectedDataApply === 0) { //请假
          this.changeApply = true; //假期类型显示
        }
        if (this.selectedDataApply === 3) {
          this.updateImage = false; //上传图片隐藏
        }
      },*/
      qingjiaclick(value, index){
        this.applyData.leaveUid = value.LEAVE_INFO_UID;
        this.fields[index].value = value.LEAVE_INFO_UID;
        this.selectHoliday = value;
      },
      waichuclick(value, index){
        // this.applyData.leaveUid = value.LEAVE_INFO_UID;
        this.fields[index].value = value.name;
        this.selectHoliday = value;
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
      // 上传图片成功
      passportUrlOk(res, file) {
        if (res.code === 200) {
          this.applyData.image = res.result;
        }
      },
      // 上传图片前验证
      beforePassportUrl(file) {
        let isImage = utils.isImage(file);
        let isInSize = utils.isInSize(file, 5);
        if (isImage && isInSize) {
          this.passportUrlErrFlag = false;
        } else {
          this.passportUrlErrFlag = true;
        }
        return isImage && isInSize;
      },
      //撤回申请
      revokes(uid){
        MessageBox.confirm('确定执行撤回?', '提示').then(action => {
          Indicator.open('正在撤回...');
          this.$http.get('/api/v1.0/client/revokeApply/' + uid).then(response => { //提交请假申请
            Indicator.close();
            if (response.body.code === 200) {
              this.changeShow(-1);
              MessageBox('提示', '撤回成功');
            } else {
              MessageBox('提示', '撤回失败');
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
      }
    },
    components: {},
  }
</script>

<style lang="scss">
  #leave-wrapper {
    background: #ffffff;
    min-height: 100vh;
    .mt10 {
      margin-top: 10px;
    }
    .pl30 {
      padding-left: 30px;
    }
    .fc1 {
      color: #457aa3;
    }
    .pr {
      position: relative;
    }
    .leave-header {
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
    // 复写mint ui 组件，头部样式
    .mint-tab-container-item {
      box-sizing: border-box;
      padding: 0 10px;
    }
    .picker-items {
      display: block;
      width: 100%;
      .picker-slot {
        flex: none !important;
        display: inline-block;
        width: 20%;
        font-size: 12px;
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
    .leave-main {
      padding-top: 44px;
      .leave-main-box {
        padding: 0 15px 15px;
        .leaveboxlft:before {
          content: '';
          margin-right: 10px;
        }
        .icon-stars:before {
          content: '*';
          color: #ff4949;
          margin-right: 4px;
        }
        .leave-main-box-del {
          transform: rotate(45deg) scale(2.4);
          display: inline-block;
          position: absolute;
          right: 0;
          top: 0;
        }
        .leavebox {
          position: relative;
          overflow: hidden;
          height: 50px;
          line-height: 50px;
          font-size: 15px;
          border-bottom: 1px solid #d2dce6;
          .leaveboxlft {
            width: 120px;
            font-weight: bold;
            color: #457aa3;
            text-align: left;
          }
          .leaveboxcen {
            position: absolute;
            top: 0;
            box-sizing: border-box;
            padding-left: 120px;
            color: #1f2d3d;
            text-align: left;
            width: 100%;
            select {
              padding-left: 4px;
              width: 100%;
              overflow: hidden;
              border: none;
              outline: none;
              font-size: 15px;
              /*background: transparent;*/

              /*很关键：将默认的select选择框样式清除*/
              appearance: none;
              /*在选择框的最右侧中间显示小箭头图片*/
              background: url("../../assets/arrow_2.png") no-repeat scroll right center transparent;
              background-size: 15px;
              /*为下拉小箭头留出一点位置，避免被文字覆盖*/
              padding-right: 20px;
              option {
                color: black;
              }
            }
            span {
              padding-left: 4px;
              font-size: 15px;
            }
            .colorA6 {
              color: #97a8be;
            }
          }
        }
        .leaveboxImg {
          padding: 10px 0 5px;
          border-bottom: 1px solid #d2dce6;
          .leavebox-upload {
            width: 180px;
            height: 120px;
            background-size: 100% 100%;
            background-repeat: no-repeat;
          }
          p {
            font-size: 15px;
            color: red;
          }
        }
        .leaveboxText {
          padding-bottom: 10px;
          border-bottom: 1px solid #d2dce6;
          font-size: 15px;
          .leaveboxText-top {
            text-align: left;
            padding: 10px 0;
            color: #457aa3;
            font-weight: bold;
          }
          textarea {
            box-sizing: border-box;
            padding: 10px;
            outline: none;
            overflow: hidden;
            overflow-y: scroll;
            width: 98%;
            height: 70px;
            border-radius: 4px;
            resize: none;
          }
        }
        .leaveboxBtn {
          margin-top: 20px;
          width: 100%;
          .leaveboxBtn-btn {
            width: 80%;
            font-size: 15px;
          }
        }
      }
      .leave-main-applyInfo {
        width: 100%;
        background: #eff3f7;
        .leave-header {
          position: fixed;
          top: 44px;
          left: 0;
          width: 100%;
          height: 44px;
          z-index: 1;
          a {
            background-color: #1d8be0;
          }

        }
        .leave-main-content {
          padding: 56px 5px 10px;
          .leave-main-content-wrapper {
            margin-bottom: 12px;
            overflow: hidden;
            width: 100%;
            border: 1px solid #d3dce6;
            border-radius: 4px;
            .leave-main-content-top {
              height: 35px;
              background-color: #d3dde7;
              .leave-main-content-title {
                overflow: hidden;
                margin: 0;
                height: 35px;
                line-height: 35px;
                text-align: left;
                font-size: 14px;
                color: #1f2d3d;
                .leave-main-content-title-left {
                  margin-left: 10px;
                  margin-top: 10px;
                  padding-left: 4px;
                  height: 14px;
                  line-height: 14px;
                  float: left;
                  border-left: 2px solid #1f2d3d;
                }
                .leave-main-content-title-right {
                  float: right;
                  margin-right: 15px;
                }
              }
            }
            .leave-main-content-Info {
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
            .leave-main-content-append {
              box-sizing: border-box;
              background-color: #ffffff;
              text-align: left;
              h3 {
                display: inline-block;
                font-size: 14px;
                color: #20a0ff;
              }
              .leave-main-content-btn {
                height: 22px;
                font-size: 12px;
              }
            }
            .leave-main-content-append1 {
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

  .forgetclock{
    p{
      text-align: left;
      font-size: 14px;
      &:nth-child(1){
        padding: 10px 0;
      }
    }
  }
  .leaveboxImg{
    border: none;
  }
  .inputtext{
    border:none;
    outline: none;
    height: 25px;
  }
  .mint-button--normal{
    height: 33px;
  }
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

  .mint-button-text{
    font-size: 14px;
  }
  .leave-main-box{
    .fc1{
      font-size: 14px;
    }
  }
</style>
