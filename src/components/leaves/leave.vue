<template>
  <div id="leave-wrapper">
    <mt-navbar v-model="selected" class="leave-header">
      <mt-tab-item id="1">
        <div @click="changeselTab()"><span>填写申请</span></div>
      </mt-tab-item>
      <mt-tab-item id="2">
        <div @click="changeShow(-1, 3)"><span>我的申请</span></div>
      </mt-tab-item>
    </mt-navbar>
    <div style="height: 30px;display: none;">{{tmpnumber}}</div>
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
            <div class="leaveboxlft" :class="{'icon-stars':item.isRequired==true}">{{item.fieldName}}</div>
            <div class="leaveboxcen">
              <input v-model="item.value" class="inputtext" type="text" :placeholder="item.fieldDescr" :maxlength="item.fieldSize ? item.fieldSize : 256" :disabled="item.code=='lengthTime' || item.fieldName=='时长（小时）'">
            </div>
          </div>

          <!--多行文本 type为1-->
          <div v-if="item.fieldType=='1'" class="leaveboxText">
            <div class="leaveboxText-top" :class="{'icon-stars':item.isRequired==true}">{{item.fieldName}}</div>
            <textarea v-model="item.value" :placeholder="item.fieldDescr" :maxlength="item.fieldSize ? item.fieldSize : 256"></textarea>
          </div>

          <!--数字 type为2-->
          <div v-if="item.fieldType=='2'" class="leavebox">
            <div class="leaveboxlft" :class="{'icon-stars':item.isRequired==true}">{{item.fieldName}}</div>
            <div class="leaveboxcen">
              <input v-model="item.value" class="inputtext" type="text" :placeholder="item.fieldDescr" :maxlength="item.fieldSize ? item.fieldSize : 256">
            </div>
          </div>

          <!--单选按钮 type为3-->
          <div v-if="item.fieldType=='3'" class="forgetclock">
            <p :class="{'icon-stars':item.isRequired==true}" class="bluebold">{{item.fieldName}}</p>
            <p>
              <el-radio-group v-model="confItemsval[item.uid]">
                <el-radio v-for="(list, index) in confItems[item.uid] || []" :label="list.value" :key="index" :class="{'checkblock':item.orientation==1}">
                  <span>{{list.value}}</span>
                </el-radio>
              </el-radio-group>
            </p>
          </div>

          <!--复选框 type为4-->
          <div v-if="item.fieldType=='4'" class="forgetclock">
            <p :class="{'icon-stars':item.isRequired==true}" class="bluebold">{{item.fieldName}}</p>
            <p>
              <!--忘记打卡时间-->
              <el-checkbox-group v-model="confItemsval[item.uid]" v-if="item.code=='punchTime'">
                <el-checkbox v-for="list in attendtime || []" :key="list" :label="list">
                  <span v-model="item.value">{{list}}</span>
                </el-checkbox>
              </el-checkbox-group>

              <el-checkbox-group v-model="confItemsval[item.uid]" v-if="item.code!='punchTime'">
                <el-checkbox v-for="(list, index) in confItems[item.uid] || []" :label="list.value" :key="index" :class="{'checkblock':item.orientation==1}">
                  <span>{{list.value}}</span>
                </el-checkbox>
              </el-checkbox-group>
            </p>
          </div>

          <!--下拉菜单 type为5-->
          <!--请假和外出类型-->
          <div v-if="item.fieldType=='5'" class="leavebox">
            <div class="leaveboxlft" :class="{'icon-stars':item.isRequired==true}">{{item.fieldName}}</div>
            <div class="leaveboxcen" v-if="item.fieldName == '请假类型'">
              <select v-model="selectedDataHoliday" :class="{'colorA6':selectedDataHoliday=='请选择'}"
                      @change="qingjiaclick(selectedDataHoliday, index)">
                <option :value="''||null">请选择</option>
                <option v-for="option in holidayTypeArray" :value="option"
                        v-text="option.NAME"></option>
              </select>
            </div>
            <div class="leaveboxcen" v-if="item.code == 'outType'">
              <select v-model="selectedDataHolidaytwo" :class="{'colorA6':selectedDataHolidaytwo=='请选择'}"
                      @change="waichuclick(selectedDataHolidaytwo, index)">
                <option :value="''||null">请选择</option>
                <option v-for="option in outsideObj" :value="option"
                        v-text="option.name"></option>
              </select>
            </div>
            <div class="leaveboxcen" v-if="item.fieldName != '请假类型' && item.code != 'outType'">
              <!--:placeholder="item.fieldDescr"-->
              <!--:class="{'colorA6': item.fieldDescr}"-->
              <select v-model="confItemsval[item.uid]" :placeholder="'请选择'">
                <option :value="''||null">请选择</option>
                <option v-for="option in confItems[item.uid]" :value="option.value">{{option.value}}</option>
              </select>
            </div>
          </div>

          <!--日期 type为6-->
          <div v-if="item.fieldType=='6'" class="leavebox">
            <div class="leaveboxlft" :class="{'icon-stars':item.isRequired==true}">{{item.fieldName}}</div>
            <div class="leaveboxcen" @click="openPicker(0, 0, item.fieldType, index, item.uid)">
            <span align="left" v-text="item.value ? item.value : (item.fieldDescr ? item.fieldDescr : '请选择日期')"
                  :class="{'colorA6':!item.value}"></span>
            </div>
          </div>

          <!--日期区间 type为7-->
          <!--返回多个日期时间段时，默认只取最后一个-->
          <div v-if="item.fieldType=='7'">
            <div class="mt10" v-for="(apply,applyIndex) in applyWorkRefAll[item.uid]" :key="applyIndex">
              <h4 align="left" class="fc1 pr" :class="{'icon-stars':item.isRequired==true}">
                <span v-if="item.code!='outTime'" v-text="'第'+overtimeNum(applyIndex)+'段'+item.fieldName"></span>
                <span v-if="item.code=='outTime'">{{item.fieldName}}</span>
                <span v-if="applyIndex>0" class="leave-main-box-del" @click="deleteTime(applyIndex, item.uid)">+</span>
              </h4>
              <div class="pl30">
                <div class="leavebox">
                  <div class="leaveboxlft" :class="{'icon-stars':item.isRequired==true}">开始时间</div>
                  <div class="leaveboxcen">
              <span align="left" v-text="apply.startTime ? apply.startTime : '请输入日期'"
                    :class="{'colorA6':!apply.startTime}" @click="openPicker(0, applyIndex, item.fieldType, index, item.uid)"></span>
                  </div>
                </div>
                <div class="leavebox">
                  <div class="leaveboxlft" :class="{'icon-stars':item.isRequired==true}">结束时间</div>
                  <div class="leaveboxcen">
                <span align="left" v-text="apply.endTime ? apply.endTime : '请输入日期'"
                      :class="{'colorA6':!apply.endTime}" @click="openPicker(1,applyIndex, item.fieldType, index, item.uid)"></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt10" v-if="item.code=='workOverTime' || (item.code=='leaveTime' && selectHoliday.TYPE==6)">
              <mt-button type="primary"
                         @click.native="addTime(item.uid)">
                <span> +添加时间 </span>
              </mt-button>
            </div>
          </div>


          <!--附件 type为8-->
          <div v-if="item.fieldType=='8'" class="leavebox leaveboxImg">
            <div class="leaveboxImglft" :class="{'icon-stars':item.isRequired==true}">{{item.fieldName}}</div>
            <div class="leaveboxImgrgt uploadpictext">
              <uploadImage
                v-if="!item.fileEdit"
                :title="item.fieldName" :field="item" :type="item.fileAttribute"
                :position="{index}" @update="updateImgFile" @updateerror="showUpdateError">
                <el-button slot="button" type="primary" size="small"
                           @click="editImg(index)" :disabled="!(item.approvalValues.length>0)">
                  <span>编辑</span>
                </el-button>
              </uploadImage>
              <div v-if="item.fileEdit">
                <!--:disabled="!item.isEdit"-->
                <el-button type="danger" size="small" @click="deleteFile(index)">
                  <span>删除{{item.isEdit}}</span>
                </el-button>
                <el-button @click="cancelEditImg(index)" size="small">取消</el-button>
              </div>
              <!--图片-->
              <div class="YD_image_list" v-if="item.fileAttribute=='0'">
                <div class="YD_image_list_item"
                     v-for="(n, index) in item.approvalValues"
                     v-fancybox-thumbnail="[n.width, n.height]" :data-index="index">
                  <img v-if="!item.fileEdit" @click="queryImg($event,item.approvalValues)"
                       :src="n.url" alt="">
                  <!--<i v-if="field._configs.fileEdit" class="bg-img ico_select_1" :class="{'ico_select_1':!n.selected,'ico_select_2':n.selected}"-->
                  <!--@click="makeRemoveUploadItem(bodyIdx, partIdx, groupIdx, fieldIdx, idx)"></i>-->
                  <i v-if="item.fileEdit" class="bg-img YD_image_list_item_icon"
                     :class="{'ico_select_1':!n.selected,'ico_select_2':n.selected}"
                     @click="selectImg(item.approvalValues,index)"></i>
                  <img v-if="item.fileEdit" :src="n.url" alt="">
                </div>
              </div>
              <!--文件-->
              <div class="YD_image_list" v-if="item.fileAttribute=='1'">
                <div class="YD_image_list_item"
                     v-for="(n, index) in item.approvalValues"
                     v-fancybox-thumbnail="[40, 40]" :data-index="index">
                  <i v-if="item.fileEdit" class="bg-img YD_image_list_item_icon"
                     :class="{'ico_select_1':!n.selected,'ico_select_2':n.selected}"
                     @click="selectImg(item.approvalValues,index)"></i>
                  <img src="../../assets/ico_document.png" alt="">
                  <a :href="n.url.replace('common', 'client') + `&openid=${tokenHeader.openId}`"
                     :class="getExtType(n.url)" style="font-size: 14px;text-decoration: none;">下载</a>
                </div>
              </div>
            </div>
          </div>

          <!--原来上传图片样式-->
          <!--<div v-if="item.fieldType=='8' && updateImage" class="leaveboxImg">
            <div class="" style="height: 10px;background: #dedede;"></div>
            <el-upload
              action="/api/v1.0/client/upload"
              name="files"
              :show-file-list="false"
              :headers="tokenHeader"
              :on-success="passportUrlOk"
              :before-upload="beforePassportUrl">
              <div class="leavebox-upload"
                   :style="{'background-image': 'url('+(item.value ? item.value : imgSrc.shenFenIconShowCamera)+')'}"></div>
            </el-upload>
            <p v-show="passportUrlErrFlag">
              请上传正确的护照照片(格式为 jpg 或 jpeg 或 png，照片体积小于 5 兆)</p>
          </div>-->
        </div>
        <div class="leavebox">
          <div class="leaveboxlft icon-stars">审批对象</div>
          <div class="leaveboxcen">
            <!--选择下一级审批人-->
            <div v-if="(typeof approvalTypeObj === 'object') && approvalTypeObj.length == undefined">{{approvalTypeObj.NAME}}</div>
            <div v-if="(typeof approvalTypeObj === 'object') && approvalTypeObj.length > 0">
              <span @click="showperson == true">{{selectperData}}</span>
              <el-popover
                placement="top-start"
                trigger="click" class="popoverPerson" v-model="showperson" style="width: 100%">
                <div class="approveperson" style="height: 300px;overflow-y: auto;">
                  <div class="persontit">请选择下一级审批人</div>
                  <div class="personcont">
                    <el-table :data="approvalTypeObj" @row-click="selectperson" align="center" class="persontable" style="width: 100%">
                      <el-table-column prop="NAME" label="姓名"></el-table-column>
                      <el-table-column prop="MOBILE" label="手机号"></el-table-column>
                      <el-table-column prop="DEPT_NAME" label="部门"></el-table-column>
                      <el-table-column prop="POSITION" label="职位"></el-table-column>
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
        <!--<div style="display: none;">
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
        </div>-->

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
            <div @click="changeShow(-1, 1)"><span>全部</span></div>
          </mt-tab-item>
          <mt-tab-item id="b">
            <div @click="changeShow(0, 1)"><span>审核中</span></div>
          </mt-tab-item>
          <mt-tab-item id="c">
            <div @click="changeShow(1, 1)"><span>已通过</span></div>
          </mt-tab-item>
          <mt-tab-item id="d">
            <div @click="changeShow(2, 1)"><span>未通过</span></div>
          </mt-tab-item>
        </mt-navbar>
        <div class="leave-main-content">

          <!--新增加考勤异常申请-->
          <!--<div class="approve-main-content-wrapper attendance" style="display: none;">
            <div class="approve-main-content-top">
              <h3 class="approve-main-content-title">
                <span class="approve-main-content-title-left">审批申请（8月份异常考勤申请）</span>
                <span class="approve-main-content-title-right">审批中</span>
              </h3>
            </div>
            <div class="approve-main-content-Info attendcont">
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
              <div class="btnlookdet">
                <mt-button size="normal" class="btnlookattend" type="primary" @click="gotodetail(item.uid)">
                  <span>查看详情</span>
                </mt-button>
              </div>
            </div>
            <div class="approve-main-content-append approve-main-content-append1 ">
              <div class="approve-main-content-btnBox">
                <mt-button size="small" class="approve-main-content-btn" type="primary" @click="isPass('uid',1)">
                  <span>通过</span>
                </mt-button>
              </div>
              <div class="approve-main-content-btnBox">
                <mt-button size="small" class="approve-main-content-btn" type="primary" @click="isPass('uid',2)">
                  <span>拒绝并修改</span>
                </mt-button>
              </div>
            </div>
            <div class="approve-main-content-append approve-main-content-append1 plr15 fs13">
              <p>
                <span>2018-05-12 16:22:11</span><span> 审批人:刘佳安(CI11511)        已通过</span>
              </p>
              <p>
                <span>2018-05-12 16:22:11</span><span> 审批人:刘佳安(CI11511)        已通过</span>
              </p>
            </div>
          </div>-->

          <!--现在显示的内容-->
          <div class="leave-main-content-wrapper" v-for="item in searchApplyRecord" v-if="searchApplyRecord.length>0">
            <div class="leave-main-content-top">
              <h3 class="leave-main-content-title">
                <span class="leave-main-content-title-left" v-if="item.approvalType != -1">审批申请（{{item.name}}）</span>
                <span class="leave-main-content-title-left" v-if="item.approvalType == -1">审批申请（{{item.abnormalAttendApproval.attendReport.month}}月份{{item.name}}申请）</span>
                <span class="leave-main-content-title-right">{{applyState(item.status)}}</span>
              </h3>
            </div>

            <!--普通申请-->
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
                          :data-index="index">
                      <img @click="queryImg($event,list.approvalValues)" :src="n.value" alt="">
                    </div>
                  </div>
                  <!--文件-->
                  <div class="YD_image_list" v-if="list.fileAttribute=='1'">
                    <div class="YD_image_list_item"
                         v-for="(n, index) in list.approvalValues"
                          :data-index="index">
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

            <!--异常考勤申请-->
            <div class="approve-main-content-Info attendcont" v-if="item.approvalType == -1">
              <div class="attendtop">申请人：{{item.staffName}}({{item.jobNumber}})</div>
              <div class="attendttit">原始数据</div>
              <div class="attendDetail">
                <p>本月异常考勤累计时间</p>
                <p>迟到累计：{{item.abnormalAttendApproval.attendReport.belateTimes}}次（共{{item.abnormalAttendApproval.attendReport.belateTotal}}工时）</p>
                <p>早退累计：{{item.abnormalAttendApproval.attendReport.leaveearlyTimes}}次（共{{item.abnormalAttendApproval.attendReport.leaveearlyTotal}}工时）</p>
                <p>旷工累计: {{item.abnormalAttendApproval.attendReport.absentTimes}}天(共{{item.abnormalAttendApproval.attendReport.absentTotal}}工时)</p>
                <p>
                  <span v-for="list in item.abnormalAttendApproval.attendReport.leaves">{{list.NAME}}累计: {{list.DAYS}}天(共{{list.HOURS}}小时)</span>
                </p>
                <p>工作日加班累计时长：{{item.abnormalAttendApproval.attendReport.dayOvertimeDays}}天(共{{item.abnormalAttendApproval.attendReport.dayOvertime}}小时)</p>
                <p>周末加班累计时长：{{item.abnormalAttendApproval.attendReport.weekendOvertimeDays}}天(共{{item.abnormalAttendApproval.attendReport.weekendOvertime}}小时)</p>
                <p>法定假日加班累计时长：{{item.abnormalAttendApproval.attendReport.holidayOvertimeDays}}天(共{{item.abnormalAttendApproval.attendReport.holidayOvertime}}小时)</p>
              </div>


              <div class="attendttit">修订后数据</div>
              <div class="attendDetail">
                <p>本月异常考勤累计时间</p>
                <p>
                  <span>迟到累计：{{item.abnormalAttendApproval.newAttendReport.belateTimes}}次（共{{item.abnormalAttendApproval.newAttendReport.belateTotal}}工时）</span>
                </p>
                <p>
                  <span>早退累计：{{item.abnormalAttendApproval.newAttendReport.leaveearlyTimes}}次（共{{item.abnormalAttendApproval.newAttendReport.leaveearlyTotal}}工时）</span>
                </p>
                <p>
                  <span class="spanlft">旷工累计: {{item.abnormalAttendApproval.newAttendReport.absentTimes}}天(共{{item.abnormalAttendApproval.newAttendReport.absentTotal}}工时)</span>
                </p>
                <p>
                  <span v-for="list in item.abnormalAttendApproval.newAttendReport.leaves">{{list.NAME}}累计: {{list.DAYS}}天(共{{list.HOURS}}小时)</span>
                </p>
                <p>工作日加班累计时长：{{item.abnormalAttendApproval.newAttendReport.dayOvertime}}天(共{{item.abnormalAttendApproval.newAttendReport.dayOvertimeDays}}小时)</p>
                <p>周末加班累计时长：{{item.abnormalAttendApproval.newAttendReport.weekendOvertime}}天(共{{item.abnormalAttendApproval.newAttendReport.weekendOvertimeDays}}小时)</p>
                <p>法定假日加班累计时长：{{item.abnormalAttendApproval.newAttendReport.holidayOvertime}}天(共{{item.abnormalAttendApproval.newAttendReport.holidayOvertimeDays}}小时)</p>
              </div>
              <div class="btnlookdet">
                <mt-button size="normal" class="btnlookattend" type="primary" @click="gotodetail(item.uid)">
                  <span>查看详情</span>
                </mt-button>
              </div>

            </div>

            <div class="leave-main-content-append leave-main-content-append1 " v-if="item.status===0">
              <mt-button size="small" class="leave-main-content-btn" type="primary" @click="revokes(item.uid)">
                <span>撤回申请</span>
              </mt-button>
            </div>
          </div>




          <!--原来显示内容-->
          <!--<div class="leave-main-content-wrapper" v-for="item in searchApplyRecord" v-if="searchApplyRecord.length>0">
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
                <p><span v-text="item.days ? item.days : '&#45;&#45;'"></span></p>
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
          </div>-->

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
  import V from 'vue'
  import utilsValid from '../common/utils'
  import utils from '@/components/utils'
  import uploadImage from "./uploadImage"
  import fancyBox from 'vue-fancybox';
  import moment from 'moment'

  let df = 'YYYY-MM-DD HH:mm';
  let df2 = 'YYYY-MM-DD';
  const textPattern = utilsValid.textPattern; //验证文本
  const idNumberPattern = utilsValid.idNumberPattern;
  const getExtType = utilsValid.getExtType;


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
        selectedDataHoliday: '', // 选择的假期类型
        selectedDataHolidaytwo: '', // 选择的外出类型
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
        searchApplyRecord: [], //搜索申请记录
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
        applyWorkRefAll: {},
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
        // perioduid: '',
        tmpnumber: "1",
        outsideObj: [],
        showperson: false,  //是否显示选择审批人弹框
        selectperData: '',
        pagenum: 1,
        totalpages: '',
        currentval: '-1',
        valuearray: [],
        confItems: {},
        confItemsval: {},
        uploadImagelist:{} //附件内容
      };
    },
    created: function () {
      //查询申请类型列表
      this.$http.get('/api/v1.0/client/queryApprovalType').then(response => {
        if (response.body.code === 200) {
          this.applyTypeArray = response.body.result;
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


      let that = this;
      window.onscroll = function() {
        if(that.getScrollTop() + that.getClientHeight() >= that.getScrollHeight()) {
          that.pagenum++;
          // console.log('下拉刷新了');
          // console.log("pagenum="+that.pagenum);
          // console.log("totalpages="+that.totalpages);
          if(that.pagenum > that.totalpages){
            return false;
          }else{
            that.changeShow(that.currentval, 2);
          }
        }
      }

      let selectedTab = this.$route.query.selectedTab;
      if(selectedTab && selectedTab == '2'){
        this.selected = selectedTab;
        this.changeShow(-1, 3);
      }

    },
    watch: {},
    methods: {
      // 选择审批人
      selectperson(row, event, column){
        this.selectperData = row.NAME;
        this.applyData.currentApprover = row.UID;
        this.showperson = false;
      },
      //根据审批类型返回的审批表单
      shengqingclick(){
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
                // this.perioduid = item.uid;
                this.applyWorkRef.push({
                  startTime: '',
                  endTime: '',
                  uid: item.uid
                });
                let timearr = [];
                timearr.push({
                  startTime: '',
                  endTime: '',
                  uid: item.uid
                });
                this.fields.push(item);
                this.$set(this.applyWorkRefAll, (item.uid).toString(), timearr);

              }else if(item.fieldType == '3' || item.fieldType == '4' || item.fieldType == '5'){

                item.term = 0;
                item.sortnumtmp = 0;
                item.valuearray = [],item.valuearray2 = [];
                if(item.approvalFieldValues.length > 0){
                  for(let j = 0; j < item.approvalFieldValues.length; j++){
                    let appfieldval = item.approvalFieldValues[j];
                    if(appfieldval.isDefault){
                      if(item.fieldType == '4'){
                        item.valuearray.push(appfieldval.value);
                      }else{
                        item.valuearray= appfieldval.value;
                      }
                    }
                  }
                }
                this.$set(this.confItems, item.uid.toString(), item.approvalFieldValues);
                this.$set(this.confItemsval, item.uid.toString(), item.valuearray); //默认选中的值
                this.fields.push(item);

              }else{
                item.term = 0;
                item.sortnumtmp = 0;
                this.fields.push(item);
              }
            }
            this.periodnum = periodnum;

          }
        }, response => {
//        console.log('error callback');
        });
      },
      //获取审批人列表
      approvalperson(configType){
        this.$http.get('/api/v1.0/client/findReporter/'+configType).then(response => {
          let data = response.body.result;
          if(response.body.result != null){
            this.approvalTypeObj = data;
            if(configType == 0){//自动流程
              this.applyData.category = data.WAY;   // 审批人类型,1或者2
              if(data.WAY == '1'){
                this.applyData.currentApprover = data.UID;
              }else if(data.WAY == '2'){
                this.applyData.email = data.NAME;
              }
            }else if(configType == 1){//自由
              this.applyData.category = '1';
              this.applyData.email = '';
            }
          }else{
            this.applyData.currentApprover = '';
            this.applyData.category = '';
            this.applyData.email = '';
          }

        }, response => {
          //console.log('error callback');
        });
      },
      //获取外出类型列表
      approvaloutside(configType){
        this.$http.get('/api/v1.0/common/config/'+configType).then(response => {
          let data = response.body.result;
          this.outsideObj = data;
        }, response => {
          //console.log('error callback');
        });
      },
      //添加加班时间段
      addTime(uid){
        // this.applyWorkRef.push({
        //   startTime: '',
        //   endTime: '',
        //   uid: this.perioduid
        // });
        this.applyWorkRefAll[(uid).toString()].push({
          startTime: '',
          endTime: '',
          uid: uid
        });

      },
      //删除加班时间段
      deleteTime(num, uid){
        // this.applyWorkRef.splice(num, 1);
        this.applyWorkRefAll[(uid).toString()].splice(num, 1);
      },
      // 开始时间格式化
      handleConfirmStart(data){
        if (this.fieldTypecurr === '7') {
          // this.applyWorkRef[this.pos].startTime = moment(data).format(df);
          this.applyWorkRefAll[(this.uid).toString()][this.pos].startTime = moment(data).format(df);
        } else if(this.fieldTypecurr === '6'){
          this.fields[this.posIndex].value =  moment(data).format(df2);
          this.tmpnumber = 2;
        }
      },
      // 结束时间格式化
      handleConfirmEnd(data){
        if (this.fieldTypecurr === '7') {
          // this.applyWorkRef[this.pos].endTime = moment(data).format(df);
          this.applyWorkRefAll[(this.uid).toString()][this.pos].endTime = moment(data).format(df);
        } else if(this.fieldTypecurr === '6'){
          this.fields[this.posIndex].value =  moment(data).format(df2);
          this.tmpnumber = 2;
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
      openPicker(type, pos, fieldType, index, uid) {
        this.uid = uid;
        this.pos = pos;
        this.posIndex = index;
        this.fieldTypecurr = fieldType;
        if(fieldType == '6'){
            let displaytime = this.fields[index].value;
            this.startTimeValue1 = displaytime ? displaytime : new Date();
            this.$refs.picker0.open();
        }else if(fieldType == '7'){
          if(type == 0){
            if(this.applyWorkRefAll[(this.uid).toString()][this.pos].startTime){
              this.startTimeValue1 = this.applyWorkRefAll[(this.uid).toString()][this.pos].startTime;
            }else{
              this.startTimeValue1 = new Date();
            }
            this.$refs.picker0.open();
          }else if(type == 1){
            if(this.applyWorkRefAll[(this.uid).toString()][this.pos].endTime){
              this.endTimeValue1 = this.applyWorkRefAll[(this.uid).toString()][this.pos].endTime;
            }else{
              this.endTimeValue1 = new Date();
            }
            this.$refs.picker1.open();
          }
        }
      },
      // 加班段数格式化
      overtimeNum(num){
        let arr = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
        return arr[num];
      },
      //提交申请
      handerDataSubmit(){
        // this.showMsg("数据出错", 1);

        if(this.selectedDataApply != '0'){
          this.applyData.leaveUid = '';
        }

        let approvalValues = [];
        for( let i = 0; i < this.fields.length; i++){
          let item = this.fields[i];
          console.log(111);
          //验证数据
          if(item.fieldType == "0" || item.fieldType == "1" || item.fieldType == "2"){ //单行文本、多行文本、数字
            if(item.value == '' || item.value ==undefined){
              if(item.isRequired){ //必填
                this.showMsg(item.fieldHint,-1);
                return false;
              }
            }else{
              if((item.fieldType == "0" || item.fieldType == "1") && item.fieldName != "时长（小时）" && (!item.isDefault)){
                if ( !textPattern[item.conditions.join('')].test(item.value) ) {
                  this.showMsg(item.fieldHint,-1);
                  return false;
                }
              }else if(item.fieldType == "2" && (!item.isDefault)){ //数字
                if ( !textPattern[3].test(item.value) ) {
                  this.showMsg(item.fieldHint,-1);
                  return false;
                }
              }
            }

          }else if(item.fieldType == "3" || item.fieldType == "4"){ //多行文本
            if(this.confItemsval[item.uid] == '' && item.isRequired){
              this.showMsg(item.fieldHint,-1);
              return false;
            }
          }else if(item.fieldType == "4"){
            if((this.confItemsval[item.uid] == [] || this.confItemsval[item.uid].length == 0) && item.isRequired){
              this.showMsg(item.fieldHint,-1);
              return false;
            }
          }else if(item.fieldType == "5"){ //下拉选框（请假类型和外出类型）
            if(item.code == 'leaveType' || item.code == 'outType'){
              if((item.value == '' || item.value ==undefined) && item.isRequired){
                this.showMsg(item.fieldHint,-1);
                return false;
              }
            }else{
              if((this.confItemsval[item.uid] == '' || this.confItemsval[item.uid] == undefined) && item.isRequired){
                this.showMsg(item.fieldHint,-1);
                return false;
              }
            }


          }else if(item.fieldType == "6"){
            if((item.value == '' || item.value ==undefined) && item.isRequired){
              this.showMsg(item.fieldHint,-1);
              return false;
            }
          }else if(item.fieldType == "7"){ //日期和日期时间段
            let worfRefval = this.applyWorkRefAll[(item.uid).toString()];
            if((worfRefval[0].startTime == '' || worfRefval[0].endTime == '') && item.isRequired){
              this.showMsg(item.fieldHint,-1);
              return false;
            }
          }else if(item.fieldType == "8"){ //附件
            if(item.approvalValues.length == 0 || item.approvalValues ==[]){
              if(item.isRequired){ //必填
                this.showMsg(item.fieldHint,-1);
                return false;
              }
            }
          }

          //处理数据
          if(item.fieldType != "7" && item.fieldType != "8" && item.fieldType != "3" && item.fieldType != "4" && item.fieldType != "5"){
            if(item.value != '' && item.value != null && item.value != undefined){
              approvalValues.push({
                approvalFieldUid : item.uid,
                value : item.value,
                term : item.term,
                sortnum : item.sortnumtmp
              });
            }
          }else{
            if(item.fieldType == "3"){  //单选框
              if(this.confItemsval[item.uid] != '' && this.confItemsval[item.uid] != null && this.confItemsval[item.uid] != undefined) {
                approvalValues.push({
                  approvalFieldUid: item.uid,
                  value: this.confItemsval[item.uid],
                  term: 0,
                  sortnum: 0
                });
              }
            }else if(item.fieldType == "4"){  //多选框(并且不是忘记打卡的情况)
            // && item.code!='punchTime'
              if(this.confItemsval[item.uid].length > 0){
                for(let j = 0; j < this.confItemsval[item.uid].length; j++){
                  if(this.confItemsval[item.uid][j] != '' && this.confItemsval[item.uid][j] != null){
                    approvalValues.push({
                      approvalFieldUid : item.uid,
                      value : this.confItemsval[item.uid][j],
                      term : 0,
                      sortnum : j
                    });
                  }
                }
              }
            }else if(item.fieldType == "5"){ //下拉菜单
              if(item.code == 'leaveType' || item.code == 'outType' || item.fieldName=='请假类型' || item.fieldName=='外出类型'){
                if(item.value != '' && item.value != null && item.value != undefined) {
                  approvalValues.push({
                    approvalFieldUid: item.uid,
                    value: item.value,
                    term: 0,
                    sortnum: 0
                  });
                }
              }else{
                if(this.confItemsval[item.uid] != '' && this.confItemsval[item.uid] != null && this.confItemsval[item.uid] != undefined) {
                  approvalValues.push({
                    approvalFieldUid: item.uid,
                    value: this.confItemsval[item.uid],
                    term: 0,
                    sortnum: 0
                  });
                }
              }
            }else if(item.fieldType == "7"){
              //处理item.fieldType="7"日期时间段的数据
              let periodarr = [];
              for(let i = 0; i < this.applyWorkRefAll[(item.uid).toString()].length; i++){
                let detail = this.applyWorkRefAll[(item.uid).toString()][i];
                for(let j = 0; j < 2; j++){
                  let timecurr;
                  if(j == 0){
                    timecurr = detail.startTime;
                  }else if(j == 1){
                    timecurr = detail.endTime;
                  }
                  periodarr.push({
                    approvalFieldUid : item.uid,
                    value : timecurr,
                    term : i,
                    sortnum : j
                  });
                }
              }
              approvalValues = approvalValues.concat(periodarr);
            }else if(item.fieldType == "8"){ //附件
              if(item.approvalValues.length != 0){
                let picturearr = [];
                for(let i = 0; i < item.approvalValues.length; i++){
                  let detail = item.approvalValues[i];
                  picturearr.push({
                    approvalFieldUid : item.uid,
                    value : detail.url,
                    term : 0,
                    sortnum : i
                  });
                }
                approvalValues = approvalValues.concat(picturearr);
              }
            }
          }

        }

        this.applyData.approvalValues = approvalValues;
        console.log(555);
        console.log(this.applyData);

        Indicator.open('正在提交申请...');
        this.$http.post('/api/v1.0/client/apply', this.applyData).then(response => { //提交请假申请
          Indicator.close();//申请提交成功
          this.codeSuccess = response.body.code;
          this.leaveSuccess = true;
          if (response.body.code === 200) {
            this.alertSuccessImage = true;
            this.alertMessage = response.body.message;
          } else {
            this.alertSuccessImage = false;
            this.alertMessage = response.body.message;
          }
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
      qingjiaclick(value, index){
        if(value!=null && value!=''){
          this.applyData.leaveUid = value.LEAVE_INFO_UID;
          this.fields[index].value = value.NAME;
          this.selectHoliday = value;
        }
      },
      waichuclick(value, index){
        if(value!=null && value!='') {
          this.fields[index].value = value.name;
          this.selectHoliday = value;
          this.applyData.leaveUid = '';
        }
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
          // this.applyData.image = res.result;

          for(let i = 0; i< this.fields.length; i++){
            let item = this.fields[i];
            if(item.fieldType == '8'){
              item.value = res.result;
            }
          }
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
      changeselTab(){
        let origin = window.location.href.split("#")[0];
        console.log(origin);
        let newloactionhref = origin+"#/leave";
        window.location.replace(newloactionhref);
      },
      //查看申请记录
      changeShow(val, type){
        if(this.currentval != val){
          this.searchApplyRecord = [];
          this.currentval = val;
          this.pagenum = 1;
        }
        if(type == 1){
          this.searchApplyRecord = [];
          this.currentval = val;
          this.pagenum = 1;
        }else if(type == 3){
          this.searchApplyRecord = [];
          this.currentval = val;
          this.pagenum = 1;
          this.selectInfo = 'a';

          let selectedTab = this.$route.query.selectedTab;
          if(!(selectedTab && selectedTab == '2')) {
            let loactionhref = window.location.href;
            let newloactionhref = loactionhref+"?selectedTab=2";
            window.location.replace(newloactionhref);
          }
        }

        if(val == -1){
          val = '';
        }
        this.$http.post('/api/v1.0/client/queryOwnApplys', {
          status: val,
          pageSize: 5,
          pageNumber: this.pagenum
        }).then(response => { //查询申请接口
          if (response.body.code === 200) {
            let data = response.body.result.list;
            this.totalpages = response.body.result.pages;
            for(let i = 0; i < data.length; i++){
              let item = data[i];
              for(let j = 0; j < item.approvalFields.length; j++){
                let list = item.approvalFields[j];
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
            }
            this.searchApplyRecord = this.searchApplyRecord.concat(data);

            /*let that = this;
            window.onscroll = function() {
              if(that.getScrollTop() + that.getClientHeight() >= that.getScrollHeight()) {

                ++that.pagenum;
                console.log('下拉刷新了');
                console.log("pagenum="+that.pagenum);
                console.log("totalpages="+that.totalpages);
                if(that.pagenum > that.totalpages){
                  return false;
                }else{
                  that.changeShow(val);
                }

              }
            }*/


          }
        }, response => {
//          console.log('error callback');
        });
      },
      //撤回申请
      revokes(uid){
        MessageBox.confirm('确定执行撤回?', '提示').then(action => {
          Indicator.open('正在撤回...');
          this.$http.get('/api/v1.0/client/revokeApply/' + uid).then(response => { //提交请假申请
            Indicator.close();
            if (response.body.code === 200) {
              this.searchApplyRecord = [];
              this.currentval = -1;
              this.pagenum = 1;
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
      },
      showMsg(msg, number){
        this.leaveSuccess = true;
        if(number == 1){
          this.alertSuccessImage = true;
        }else if(number == -1){
          this.alertSuccessImage = false;
        }
        this.alertMessage = msg;
        let that = this;
        setTimeout(() => {
          that.leaveSuccess = false;
        },2000);
      },
      //获取滚动条当前的位置
      getScrollTop(){
        var scrollTop = 0;
        if(document.documentElement && document.documentElement.scrollTop) {
          scrollTop = document.documentElement.scrollTop;
        } else if(document.body) {
          scrollTop = document.body.scrollTop;
        }
        return scrollTop;
      },
      //获取当前可视范围的高度
      getClientHeight(){
        var clientHeight = 0;
        if(document.body.clientHeight && document.documentElement.clientHeight) {
          clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
        } else {
          clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
        }
        return clientHeight;
      },
      //获取文档完整的高度
      getScrollHeight(){
        return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      },
      gotodetail(uid){
        this.$router.push({path: '/attendanceEdit', query: {uid: uid, frompage: '1'} });
      },
      //上传图片文件
      updateImgFile(data){
        // console.log(123456);
        // console.log(data);
        // console.log(data.position);
        // console.log(this.fields[data.position.index].approvalValues);
        this.fields[data.position.index].approvalValues.push({
          selected: false,
          url: data.url,
          width: 0,
          height: 0
        });
        // console.log(3333);
        // console.log(this.fields[data.position.index]);

      },
      showUpdateError(data){
        this.showMsg(data.fieldHint, -1);
      },
      //查看图片
      queryImg(e, list){
        fancyBox(e.target, list);
      },
      //编辑操作
      editImg(index){

//        console.log(123456789, this.model.bodies[bodyIdx].children[partIdx]._children[groupIdx][fieldIdx]._configs._staffValues.value)
        V.set(this.fields[index], 'fileEdit', true);
        this.fields[index].fileEdit = true;
        // console.log(this.fields[index]);
        // console.log(11111111111);

      },
      //取消删除文件
      cancelEditImg(index){
        V.set(this.fields[index], 'fileEdit', false);
        this.fields[index].fileEdit = false;
        // console.log(this.fields[index]);
      },
      //编辑状态，删除文件
      deleteFile(index){
        let list = this.fields[index].approvalValues;
        for (let i = 0; i < list.length; i++) {
          if (list[i].selected) {
            list.splice(i, 1);
            i--;
          }
        }
//        console.log(list)
        this.fields[index].approvalValues = list;
        this.cancelEditImg(index);
      },
      //选择删除的文件
      selectImg(list, i){
        V.set(list[i], 'selected', !list[i].selected)
      },
      getExtType,
    },
    components: {
      uploadImage
    },
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
    border-bottom: 1px solid #d2dce6;
    padding: 0 0 10px 0;
  }
  .leaveboxImg{
    border: none;
  }
  .inputtext{
    border:none;
    outline: none;
    height: 25px;
    background: none;
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
  .checkblock{
    display: block;
    margin: 5px 0 10px 0 !important;
  }

  .approve-main-content-wrapper {
    margin-bottom: 12px;
    overflow: hidden;
    width: 100%;
    border: 1px solid #d3dce6;
    border-radius: 4px;
    font-size: 13px;
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
    }
  }
  .approve-main-content-Info{
    &.attendcont{
      box-sizing: border-box;
      padding: 15px;
      background-color: #ffffff;
      text-align: left;
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
          &:after{content:"";display: block;height: 0;clear: both;}
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
  .bluebold{
    font-weight: bold;
    color: #457aa3;
  }

  /*.approveperson{
    .el-table .cell, .el-table th>div{
      padding: 0 5px;
    }
  }*/

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
  .leaveboxImg{
    &.leavebox{
      height: auto !important;
      padding: 0 !important;
      &:after{content:"";display: block;height: 0;clear: both;}
      .leaveboxImglft{
        width: 120px;
        font-weight: bold;
        color: #457aa3;
        text-align: left;
        float: left;
      }
      .leaveboxImgrgt{
        float: left;
        box-sizing: border-box;
        /*padding-left: 120px;*/
        color: #1f2d3d;
        text-align: left;
        display: inline-block;
        .uploadpictext{
          margin-top: 10px;
          line-height: 36px !important;
          .el-upload{
            line-height: 36px !important;
          }
          span{
            font-size: 12px !important;
          }
        }
      }


    }


  }

  #leave-wrapper{
    .inputtext{
      height: 48px;
      width: 98%;
    }
  }
</style>
