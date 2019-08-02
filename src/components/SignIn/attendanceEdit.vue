<template>
    <div class="attendwhite" id="attendwhitewrap">
        <div style="height: 0;display: none;">{{tmpnumber}}</div>
        <mt-header :title="attendReport.month+'月份考勤修订'"></mt-header>
        <div
            class="attendttit"
            v-if="newAttendReport!=null && newAttendReport!='null' "
            style="padding-top: 10px;"
        >原始数据</div>
        <div class="attendDetail">
            <p>本月异常考勤累计时间</p>
            <p>迟到累计：{{attendReport.belateTimes}}次（共{{attendReport.belateTotal}}工时）</p>
            <p>早退累计：{{attendReport.leaveearlyTimes}}次（共{{attendReport.leaveearlyTotal}}工时）</p>
            <p>旷工累计: {{attendReport.absentTimes}}天(共{{attendReport.absentTotal}}工时)</p>
            <p
                v-for="list in attendReport.leaves"
            >{{list.NAME}}累计: {{list.DAYS}}天(共{{list.HOURS}}小时)</p>
            <p>工作日加班累计时长：{{attendReport.dayOvertime}}天(共{{attendReport.dayOvertimeDays}}小时)</p>
            <p>周末加班累计时长：{{attendReport.weekendOvertime}}天(共{{attendReport.weekendOvertimeDays}}小时)</p>
            <p>法定假日加班累计时长：{{attendReport.holidayOvertime}}天(共{{attendReport.holidayOvertimeDays}}小时)</p>
        </div>
        <div class="attendttit" v-if="newAttendReport!=null && newAttendReport!='null' ">修订后数据</div>
        <div class="attendDetail" v-if="newAttendReport!=null && newAttendReport!='null' ">
            <p>本月异常考勤累计时间</p>
            <p>迟到累计：{{newAttendReport.belateTimes}}次（共{{newAttendReport.belateTotal}}工时）</p>
            <p>早退累计：{{newAttendReport.leaveearlyTimes}}次（共{{newAttendReport.leaveearlyTotal}}工时）</p>
            <p>旷工累计: {{newAttendReport.absentTimes}}天(共{{newAttendReport.absentTotal}}工时)</p>
            <p
                v-for="list in newAttendReport.leaves"
            >{{list.NAME}}累计: {{list.DAYS}}天(共{{list.HOURS}}小时)</p>
            <p>工作日加班累计时长：{{newAttendReport.dayOvertime}}天(共{{newAttendReport.dayOvertimeDays}}小时)</p>
            <p>周末加班累计时长：{{newAttendReport.weekendOvertime}}天(共{{newAttendReport.weekendOvertimeDays}}小时)</p>
            <p>法定假日加班累计时长：{{newAttendReport.holidayOvertime}}天(共{{newAttendReport.holidayOvertimeDays}}小时)</p>
        </div>

        <div
            class="i-hd"
            v-if="attendReport && attendReport.year && attendReport.month"
        >{{attendReport.year}}年{{attendReport.month}}月</div>
        <full-calendar
            v-if="attendReport && attendReport.year && attendReport.month"
            :connectTime="connectTime"
            :events="fcEvents"
            lang="zh"
            @dayClick="dayClick"
            no-changeMonth="changeMonth"
        ></full-calendar>

        <div class="abnormalattend">
            <p v-if="currentStatus == '2'">原始数据</p>
            <p>
                异常考勤日期：{{daycurrent}}
                <span v-if="duration">（{{duration.dateStatus}}）</span>
            </p>
            <p>
                异常考勤状态：
                <span v-if="duration">{{duration.durationstatus}}</span>
            </p>
        </div>
        <div class="reviseapply">
            <div
                class="revisetop"
                v-if="currentStatus != '2' && (approveAllData.status == '' || approveAllData.status == null || approveAllData.status == 'null' || approveAllData.status == 3) && approveAllData.status != 0"
            >
                修订申请
                <span class="editapply" @click="editapply">修改申请</span>
            </div>
            <div class="revisetop" v-if="currentStatus == '2'">修订数据</div>
            <div class="revisecont">
                <div class="revisecontone" v-show="showRevise">
                    <!--显示考勤数据申请记录，有多个数据-->
                    <div
                        class="leavecontInfo"
                        v-if="searchApplyRecord.length > 0"
                        v-for="(detail, index) in searchApplyRecord"
                        :key="index"
                        style="border-bottom:1px dashed #dedede;margin-bottom: 15px;padding-bottom: 10px;"
                    >
                        <div class="marginTop10">
                            <h3>考勤状态：</h3>
                            <p>{{detail.name}}</p>
                        </div>

                        <!-- 忘记打卡单独处理 -->
                        <template v-if="detail.approvalType === 1">
                            <div class="marginTop10" v-for="list in detail.approvalFields">
                                <div v-if="['6'].indexOf(list.fieldType) > -1">
                                    <template
                                        v-for="(item, idx) in formatPunchCardData(detail.approvalFields)"
                                    >
                                        <h3 class="marginTop10" :key="idx">{{item.dateName}}：</h3>
                                        <p :key="idx">{{item.date}}</p>
                                        <h3 class="marginTop10" :key="idx">{{item.timeName}}：</h3>
                                        <p v-for="time in item.time" :key="time">{{time}}</p>
                                    </template>
                                </div>

                                <div v-if="['6', '4', '7', '8'].indexOf(list.fieldType) === -1">
                                    <h3>{{list.fieldName}}：</h3>
                                    <p v-for="detail in list.approvalValues">{{detail.value}}</p>
                                </div>
                                <!--日期时间段-->
                                <div
                                    class="marginTop10"
                                    v-if="list.fieldType == '7'"
                                    v-for="(detail,overIndex) in list.periodarr"
                                    :key="overIndex"
                                >
                                    <h3>第{{overtimeNum(overIndex)}}段{{list.fieldName}}</h3>
                                    <p>{{detail.startTime}}至{{detail.endTime}}</p>
                                </div>
                                <!--附件-->
                                <div v-if="list.fieldType == '8'">
                                    <h3>{{list.fieldName}}：</h3>
                                    <!--图片-->
                                    <div class="YD_image_list" v-if="list.fileAttribute=='0'">
                                        <div
                                            class="YD_image_list_item"
                                            v-for="(n, picindex) in list.approvalValues"
                                            v-fancybox-thumbnail="[n.width, n.height]"
                                            :data-index="picindex"
                                            v-if="n.value!='' && n.value!=null && n.value!=undefined "
                                        >
                                            <img
                                                @click="queryImg($event,list.approvalValues)"
                                                :src="n.url"
                                                alt
                                            />
                                        </div>
                                    </div>
                                    <!--文件-->
                                    <div class="YD_image_list" v-if="list.fileAttribute=='1'">
                                        <div
                                            class="YD_image_list_item"
                                            v-for="(n, picindex) in list.approvalValues"
                                            v-fancybox-thumbnail="[40, 40]"
                                            :data-index="picindex"
                                            v-if="n.value!='' && n.value!=null && n.value!=undefined "
                                        >
                                            <img src="../../assets/ico_document.png" alt />
                                            <a
                                                :href="n.value.replace('common', 'client') + `&openid=${tokenHeader.openId}`"
                                                :class="getExtType(n.value)"
                                                style="font-size: 14px;text-decoration: none;"
                                            >下载</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="marginTop10" v-for="list in detail.approvalFields">
                                <div v-if="list.fieldType != '7' && list.fieldType != '8'">
                                    <h3>{{list.fieldName}}：</h3>
                                    <p v-for="detail in list.approvalValues">{{detail.value}}</p>
                                </div>
                                <!--日期时间段-->
                                <div
                                    class="marginTop10"
                                    v-if="list.fieldType == '7'"
                                    v-for="(detail,overIndex) in list.periodarr"
                                    :key="overIndex"
                                >
                                    <h3>第{{overtimeNum(overIndex)}}段{{list.fieldName}}</h3>
                                    <p>{{detail.startTime}}至{{detail.endTime}}</p>
                                </div>
                                <!--附件-->
                                <div v-if="list.fieldType == '8'">
                                    <h3>{{list.fieldName}}：</h3>
                                    <!--图片-->
                                    <div class="YD_image_list" v-if="list.fileAttribute=='0'">
                                        <div
                                            class="YD_image_list_item"
                                            v-for="(n, picindex) in list.approvalValues"
                                            v-fancybox-thumbnail="[n.width, n.height]"
                                            :data-index="picindex"
                                            v-if="n.value!='' && n.value!=null && n.value!=undefined "
                                        >
                                            <img
                                                @click="queryImg($event,list.approvalValues)"
                                                :src="n.url"
                                                alt
                                            />
                                        </div>
                                    </div>
                                    <!--文件-->
                                    <div class="YD_image_list" v-if="list.fileAttribute=='1'">
                                        <div
                                            class="YD_image_list_item"
                                            v-for="(n, picindex) in list.approvalValues"
                                            v-fancybox-thumbnail="[40, 40]"
                                            :data-index="picindex"
                                            v-if="n.value!='' && n.value!=null && n.value!=undefined "
                                        >
                                            <img src="../../assets/ico_document.png" alt />
                                            <a
                                                :href="n.value.replace('common', 'client') + `&openid=${tokenHeader.openId}`"
                                                :class="getExtType(n.value)"
                                                style="font-size: 14px;text-decoration: none;"
                                            >下载</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                    <div
                        v-if="searchApplyRecord.length == 0"
                        style="padding: 100px;text-align: center;font-size: 12px;"
                    >当前无考勤修订申请</div>

                    <div
                        class="attendbutton"
                        v-if="currentStatus == '2' && approveAllData.status != 1 && approveAllData.status != 2"
                    >
                        <mt-button
                            slot="reference"
                            type="default"
                            class="btnagree"
                            @click="isPass(approveAllData, 2)"
                        >
                            <span>拒绝并退回修改</span>
                        </mt-button>
                        <mt-button
                            slot="reference"
                            type="primary"
                            class="btnrefuse"
                            @click="isPass(approveAllData, 1)"
                        >
                            <span>通过</span>
                        </mt-button>
                    </div>

                    <!--选择下一级审批人-->
                    <div
                        v-if="currentStatus == '1' && (approveAllData.status == '' || approveAllData.status == null || approveAllData.status == 'null' || approveAllData.status == 3) && approveAllData.status != 0"
                    >
                        <div
                            v-if="(typeof approvalTypeObjtwo === 'object') && approvalTypeObjtwo.length == undefined"
                        >
                            <mt-button
                                slot="reference"
                                type="primary"
                                class="btnattend"
                                @click="savereviseone()"
                            >
                                <span>提交全部考勤修订内容</span>
                            </mt-button>
                        </div>
                        <div
                            v-if="(typeof approvalTypeObjtwo === 'object') && approvalTypeObjtwo.length > 0"
                        >
                            <el-popover
                                placement="top-start"
                                trigger="click"
                                class="popoverPerson"
                                v-model="showpersontwo"
                                style="width: 100%"
                            >
                                <div class="approveperson">
                                    <div class="persontit">请选择下一级审批人</div>
                                    <div class="personcont">
                                        <el-table
                                            :data="approvalTypeObjtwo"
                                            @row-click="saverevisetwo"
                                            align="center"
                                            class="persontable"
                                            style="width: 100%"
                                        >
                                            <el-table-column prop="NAME" label="姓名"></el-table-column>
                                            <el-table-column prop="MOBILE" label="手机号"></el-table-column>
                                            <el-table-column prop="DEPT_NAME" label="部门"></el-table-column>
                                            <el-table-column prop="POSITION" label="职位"></el-table-column>
                                        </el-table>
                                    </div>
                                </div>
                                <mt-button
                                    slot="reference"
                                    type="primary"
                                    class="btnattend"
                                    @click="savereviseone()"
                                >
                                    <span>提交全部考勤修订内容</span>
                                </mt-button>
                            </el-popover>
                        </div>
                    </div>
                </div>

                <!--修改申请表单内容，有多个数据-->
                <div class="reviseconttwo" v-show="!showRevise">
                    <div class="revisecontmid">
                        <div
                            class="leave-main-box"
                            v-if="detail.status==0 || detail.status==undefined"
                            v-for="(detail, index) in searchApplyRecord"
                            :key="index"
                            style="border-bottom:1px dashed #dedede;margin-bottom: 15px;padding-bottom: 20px;"
                        >
                            <div class="leavebox">
                                <div class="leaveboxlft icon-stars">考勤状态</div>
                                <div class="leaveboxcen">
                                    <select
                                        v-model="selectedDataApply[index]"
                                        @change="shengqingclick(detail.approvalType, index)"
                                    >
                                        <option :value="''||null">请选择</option>
                                        <option
                                            v-for="option in applyTypeArray"
                                            :value="option.type"
                                        >{{option.name}}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="attendcont" style="position: relative;">
                                <div
                                    v-for="(item,fieldIndex) in detail.approvalFields"
                                    :key="fieldIndex"
                                >
                                    <!--单行文本 type为0-->
                                    <div v-if="item.fieldType=='0'" class="leavebox">
                                        <div
                                            class="leaveboxlft"
                                            :class="{'icon-stars':item.isRequired==true}"
                                        >{{item.fieldName}}</div>
                                        <div class="leaveboxcen">
                                            <input
                                                v-model="item.value"
                                                class="inputtext"
                                                type="text"
                                                :placeholder="item.fieldDescr"
                                                :maxlength="item.fieldSize ? item.fieldSize : 256"
                                                :disabled="item.code=='lengthTime' || item.fieldName=='时长（小时）'"
                                                @blur="inputblur()"
                                            />
                                        </div>
                                    </div>

                                    <!--多行文本 type为1-->
                                    <div v-if="item.fieldType=='1'" class="leaveboxText">
                                        <div
                                            class="leaveboxText-top"
                                            :class="{'icon-stars':item.isRequired==true}"
                                        >{{item.fieldName}}</div>
                                        <textarea
                                            v-model="item.value"
                                            :placeholder="item.fieldDescr"
                                            :maxlength="item.fieldSize ? item.fieldSize : 256"
                                            @blur="inputblur()"
                                        ></textarea>
                                    </div>

                                    <!--数字 type为2-->
                                    <div v-if="item.fieldType=='2'" class="leavebox">
                                        <div
                                            class="leaveboxlft"
                                            :class="{'icon-stars':item.isRequired==true}"
                                        >{{item.fieldName}}</div>
                                        <div class="leaveboxcen">
                                            <input
                                                v-model="item.value"
                                                class="inputtext"
                                                type="text"
                                                :placeholder="item.fieldDescr"
                                                :maxlength="item.fieldSize ? item.fieldSize : 256"
                                                @blur="inputblur()"
                                            />
                                        </div>
                                    </div>

                                    <!--单选按钮 type为3-->
                                    <div v-if="item.fieldType=='3'" class="forgetclock">
                                        <p
                                            :class="{'icon-stars':item.isRequired==true}"
                                            class="bluebold"
                                        >{{item.fieldName}}</p>
                                        <p>
                                            <el-radio-group
                                                v-model="confItemsval[(daycurrent+index+item.uid).toString()]"
                                            >
                                                <el-radio
                                                    v-for="(list, index3) in confItems[(daycurrent+index+item.uid).toString()] || []"
                                                    :label="list.value"
                                                    :key="index3"
                                                    :class="{'checkblock':item.orientation==1}"
                                                >
                                                    <span>{{list.value}}</span>
                                                </el-radio>
                                            </el-radio-group>
                                        </p>
                                    </div>

                                    <!--复选框 type为4-->
                                    <template
                                        v-if="selectedDataApply[index] !== 1 || searchApplyRecord[index].attendRuleUid !== '1'"
                                    >
                                        <div v-if="item.fieldType=='4'" class="forgetclock">
                                            <p
                                                :class="{'icon-stars':item.isRequired==true}"
                                                class="bluebold"
                                            >{{item.fieldName}}</p>
                                            <p>
                                                <!--忘记打卡时间-->
                                                <el-checkbox-group
                                                    v-model="confItemsval[(daycurrent+index+item.uid).toString()]"
                                                    v-if="item.code=='punchTime'"
                                                >
                                                    <el-checkbox
                                                        v-for="list in attendtime || []"
                                                        :key="list"
                                                        :label="list"
                                                    >
                                                        <span v-model="item.value">{{list}}</span>
                                                    </el-checkbox>
                                                </el-checkbox-group>

                                                <el-checkbox-group
                                                    v-model="confItemsval[(daycurrent+index+item.uid).toString()]"
                                                    v-if="item.code!='punchTime'"
                                                >
                                                    <el-checkbox
                                                        v-for="(list, index4) in confItems[(daycurrent+index+item.uid).toString()] || []"
                                                        :label="list.value"
                                                        :key="index4"
                                                        :class="{'checkblock':item.orientation==1}"
                                                    >
                                                        <span>{{list.value}}</span>
                                                    </el-checkbox>
                                                </el-checkbox-group>
                                            </p>
                                        </div>
                                    </template>

                                    <!--下拉菜单 type为5-->
                                    <!--请假和外出类型-->
                                    <div v-if="item.fieldType=='5'" class="leavebox">
                                        <div
                                            class="leaveboxlft"
                                            :class="{'icon-stars':item.isRequired==true}"
                                        >{{item.fieldName}}</div>
                                        <div class="leaveboxcen" v-if="item.fieldName == '请假类型'">
                                            <select
                                                v-model="confItemsval[(daycurrent+index+item.uid).toString()]"
                                                :class="{'colorA6':selectedDataHoliday===item.fieldHint}"
                                                @change="qingjiaclick(confItemsval[(daycurrent+index+item.uid).toString()], index, fieldIndex, item.uid)"
                                            >
                                                <option :value="''||null">请选择</option>
                                                <option
                                                    v-for="option in holidayTypeArray"
                                                    :value="option"
                                                >{{option.NAME}}</option>
                                            </select>
                                        </div>
                                        <div class="leaveboxcen" v-if="item.code == 'outType'">
                                            <select
                                                v-model="confItemsval[(daycurrent+index+item.uid).toString()]"
                                                :class="{'colorA6':selectedDataHoliday===item.fieldHint}"
                                            >
                                                <option :value="''||null">请选择</option>
                                                <option
                                                    v-for="option in outsideObj"
                                                    :value="option"
                                                >{{option.name}}</option>
                                            </select>
                                        </div>

                                        <div
                                            class="leaveboxcen"
                                            v-if="item.fieldName != '请假类型' && item.code != 'outType'"
                                        >
                                            <select
                                                v-model="confItemsval[(daycurrent+index+item.uid).toString()]"
                                            >
                                                <option :value="''||null">请选择</option>
                                                <option
                                                    v-for="option in confItems[(daycurrent+index+item.uid).toString()]"
                                                    :value="option.value"
                                                >{{option.value}}</option>
                                            </select>
                                        </div>
                                    </div>

                                    <!--日期 type为6-->
                                    <template
                                        v-if="selectedDataApply[index] !== 1 || searchApplyRecord[index].attendRuleUid !== '1'"
                                    >
                                        <div v-if="item.fieldType=='6'" class="leavebox">
                                            <div
                                                class="leaveboxlft"
                                                :class="{'icon-stars':item.isRequired==true}"
                                            >{{item.fieldName}}</div>
                                            <div
                                                class="leaveboxcen"
                                                @click="openPicker(0, 0, item.fieldType, index, fieldIndex, item.uid, item.code)"
                                            >
                                                <span
                                                    align="left"
                                                    v-text="item.value ? item.value : (item.fieldDescr ? item.fieldDescr : '请选择日期')"
                                                    :class="{'colorA6':!item.value}"
                                                    style="display: block;"
                                                ></span>
                                            </div>
                                        </div>
                                    </template>
                                    <template
                                        v-if="selectedDataApply[index] == 1 && searchApplyRecord[index].attendRuleUid == 1"
                                    >
                                        <div v-if="item.fieldType=='6'">
                                            <div
                                                v-for="(sub,$index) in detail.forgetTime"
                                                :key="$index"
                                            >
                                                <div class="leavebox">
                                                    <!-- 单独处理,选择日期 + 忘记打卡时间带手输,能分组 -->
                                                    <div
                                                        class="leaveboxlft"
                                                        :class="{'icon-stars':item.isRequired==true}"
                                                    >{{item.fieldName}}</div>
                                                    <div
                                                        class="leaveboxcen"
                                                        @click="openforgetDate($index,index)"
                                                    >
                                                        <span
                                                            align="left"
                                                            v-text=" detail.forgetTime[$index].date?detail.forgetTime[$index].date: '请选择日期'"
                                                            :class="{'colorA6':!item.value}"
                                                            style="display: block;"
                                                        ></span>
                                                    </div>
                                                    <span
                                                        class="x-del"
                                                        v-show="$index>0"
                                                        @click="detail.forgetTime.splice($index, 1)"
                                                    >+</span>
                                                </div>
                                                <div class="forgetclock">
                                                    <p
                                                        :class="{'icon-stars':fieldType4.isRequired==true}"
                                                        class="bluebold"
                                                    >{{fieldType4.fieldName}}</p>
                                                    <p>
                                                        <!--忘记打卡时间-->
                                                        <el-checkbox
                                                            v-model="detail.forgetTime[$index].checkStart"
                                                            @change="changeChb(detail.forgetTime[$index].checkStart,attendtime[0],'start',$index,index)"
                                                        >{{attendtime[0]}}</el-checkbox>
                                                        <el-checkbox
                                                            v-model="detail.forgetTime[$index].checkEnd"
                                                            @change="changeChb(detail.forgetTime[$index].checkEnd,attendtime[1],'end',$index,index)"
                                                        >{{attendtime[1]}}</el-checkbox>
                                                    </p>
                                                </div>
                                                <div class="pl30">
                                                    <div class="leavebox">
                                                        <div class="leaveboxlft">开始时间</div>
                                                        <div class="leaveboxcen">
                                                            <span
                                                                align="left"
                                                                v-text="detail.forgetTime[$index].start?detail.forgetTime[$index].start: '请输入时间'"
                                                                @click="openforgetTime($index,index,'start')"
                                                                style="display: block;"
                                                            ></span>
                                                        </div>
                                                    </div>
                                                    <div class="leavebox">
                                                        <div class="leaveboxlft">结束时间</div>
                                                        <div class="leaveboxcen">
                                                            <span
                                                                align="left"
                                                                v-text="detail.forgetTime[$index].end?detail.forgetTime[$index].end: '请输入时间'"
                                                                @click="openforgetTime($index,index,'end')"
                                                                style="display: block;"
                                                            ></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="mt10">
                                                <mt-button
                                                    type="primary"
                                                    @click.native="addForgetTime(detail.forgetTime)"
                                                >
                                                    <span>+添加</span>
                                                </mt-button>
                                            </div>
                                        </div>
                                    </template>
                                    <!--日期区间 type为7-->
                                    <div v-if="item.fieldType=='7'">
                                        <div
                                            class="mt10"
                                            v-for="(apply,applyIndex) in applyWorkRefAll[(daycurrent+index+item.uid).toString()]"
                                            :key="applyIndex"
                                            style="position: relative;"
                                        >
                                            <h4
                                                align="left"
                                                class="fc1 pr timetitdate"
                                                :class="{'icon-stars':item.isRequired==true}"
                                            >
                                                <span
                                                    v-text="'第'+overtimeNum(applyIndex)+'段'+item.fieldName"
                                                ></span>
                                                <span
                                                    v-if="applyIndex>0"
                                                    class="leave-main-box-del"
                                                    @click="deleteTime(applyIndex, item.uid, index)"
                                                >+</span>
                                            </h4>
                                            <div class="pl30">
                                                <div class="leavebox">
                                                    <div
                                                        class="leaveboxlft"
                                                        :class="{'icon-stars':item.isRequired==true}"
                                                    >开始时间</div>
                                                    <div class="leaveboxcen">
                                                        <span
                                                            align="left"
                                                            v-text="apply.startTime ? apply.startTime : '请输入日期'"
                                                            :class="{'colorA6':!apply.startTime}"
                                                            @click="openPicker(0, applyIndex, item.fieldType, index, fieldIndex, item.uid, item.code)"
                                                            style="display: block;"
                                                        ></span>
                                                    </div>
                                                </div>
                                                <div class="leavebox">
                                                    <div
                                                        class="leaveboxlft"
                                                        :class="{'icon-stars':item.isRequired==true}"
                                                    >结束时间</div>
                                                    <div class="leaveboxcen">
                                                        <span
                                                            align="left"
                                                            v-text="apply.endTime ? apply.endTime : '请输入日期'"
                                                            :class="{'colorA6':!apply.endTime}"
                                                            @click="openPicker(1,applyIndex, item.fieldType, index, fieldIndex, item.uid, item.code)"
                                                            style="display: block;"
                                                        ></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            class="mt10"
                                            v-if="item.code=='workOverTime' || (item.code=='leaveTime' && detail.isthingtype==true)"
                                        >
                                            <mt-button
                                                type="primary"
                                                @click.native="addTime(item.uid, index)"
                                            >
                                                <span>+添加时间</span>
                                            </mt-button>
                                        </div>
                                    </div>

                                    <!--附件 type为8-->
                                    <div v-if="item.fieldType=='8'" class="leavebox leaveboxImg">
                                        <div
                                            class="leaveboxImglft"
                                            :class="{'icon-stars':item.isRequired==true}"
                                        >{{item.fieldName}}</div>
                                        <div class="leaveboxImgrgt uploadpictext">
                                            <uploadImage
                                                v-if="!item.fileEdit"
                                                :title="item.fieldName"
                                                :field="item"
                                                :type="item.fileAttribute"
                                                :position="{index,fieldIndex}"
                                                @update="updateImgFile"
                                                @updateerror="showUpdateError"
                                            >
                                                <el-button
                                                    slot="button"
                                                    type="primary"
                                                    size="small"
                                                    @click="editImg(index, fieldIndex)"
                                                    :disabled="!(item.approvalFieldValues.length>0)"
                                                >
                                                    <span>编辑</span>
                                                </el-button>
                                            </uploadImage>
                                            <div v-if="item.fileEdit">
                                                <!--:disabled="!item.isEdit"-->
                                                <el-button
                                                    type="danger"
                                                    size="small"
                                                    @click="deleteFile(index, fieldIndex)"
                                                >
                                                    <span>删除{{item.isEdit}}</span>
                                                </el-button>
                                                <el-button
                                                    @click="cancelEditImg(index, fieldIndex)"
                                                    size="small"
                                                >取消</el-button>
                                            </div>
                                            <!--图片-->
                                            <div
                                                class="YD_image_list"
                                                v-if="item.fileAttribute=='0'"
                                            >
                                                <div
                                                    class="YD_image_list_item"
                                                    v-for="(n, picindex) in item.approvalFieldValues"
                                                    v-fancybox-thumbnail="[n.width, n.height]"
                                                    :data-index="picindex"
                                                    v-if="n.url!='' && n.url!=null && n.url!=undefined "
                                                >
                                                    <img
                                                        v-if="!item.fileEdit"
                                                        @click="queryImg($event,item.approvalFieldValues)"
                                                        :src="n.url"
                                                        alt
                                                    />
                                                    <i
                                                        v-if="item.fileEdit"
                                                        class="bg-img YD_image_list_item_icon"
                                                        :class="{'ico_select_1':!n.selected,'ico_select_2':n.selected}"
                                                        @click="selectImg(item.approvalFieldValues,picindex)"
                                                    ></i>
                                                    <img v-if="item.fileEdit" :src="n.url" alt />
                                                </div>
                                            </div>
                                            <!--文件-->
                                            <div
                                                class="YD_image_list"
                                                v-if="item.fileAttribute=='1'"
                                            >
                                                <div
                                                    class="YD_image_list_item"
                                                    v-for="(n, picindex) in item.approvalFieldValues"
                                                    v-fancybox-thumbnail="[40, 40]"
                                                    :data-index="index"
                                                    v-if="n.url!='' && n.url!=null && n.url!=undefined "
                                                >
                                                    <i
                                                        v-if="item.fileEdit"
                                                        class="bg-img YD_image_list_item_icon"
                                                        :class="{'ico_select_1':!n.selected,'ico_select_2':n.selected}"
                                                        @click="selectImg(item.approvalFieldValues,picindex)"
                                                    ></i>
                                                    <img src="../../assets/ico_document.png" alt />
                                                    <a
                                                        :href="n.url.replace('common', 'client') + `&openid=${tokenHeader.openId}`"
                                                        :class="getExtType(n.url)"
                                                        style="font-size: 14px;text-decoration: none;"
                                                    >下载</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!--单个申请的审批人这里不需要显示-->
                            <div class="leavebox" style="display: none;">
                                <div class="leaveboxlft icon-stars">审批对象</div>
                                <div class="leaveboxcen">
                                    <!--选择下一级审批人-->
                                    <div
                                        v-if="(typeof approvalTypeObj === 'object') && approvalTypeObj.length == undefined"
                                    >{{approvalTypeObj.NAME}}</div>
                                    <div
                                        v-if="(typeof approvalTypeObj === 'object') && approvalTypeObj.length > 0"
                                    >
                                        <span
                                            class="btnapproveper"
                                            @click="showperson=true"
                                            v-show="showpersonstyle==true"
                                        >{{selectperData}}</span>
                                        <el-popover
                                            placement="top-start"
                                            trigger="click"
                                            class="popoverPerson"
                                            v-model="showperson"
                                            style="width: 100%"
                                        >
                                            <div
                                                class="approveperson"
                                                style="height: 300px;overflow-y: auto;"
                                            >
                                                <div class="persontit">请选择下一级审批人</div>
                                                <div class="personcont">
                                                    <el-table
                                                        :data="approvalTypeObj"
                                                        @row-click="selectperson"
                                                        align="center"
                                                        class="persontable"
                                                        style="width: 100%"
                                                    >
                                                        <el-table-column prop="NAME" label="姓名"></el-table-column>
                                                        <el-table-column prop="MOBILE" label="手机号"></el-table-column>
                                                        <el-table-column
                                                            prop="DEPT_NAME"
                                                            label="部门"
                                                        ></el-table-column>
                                                        <el-table-column prop="POSITION" label="职位"></el-table-column>
                                                    </el-table>
                                                </div>
                                            </div>
                                            <mt-button
                                                slot="reference"
                                                size="small"
                                                type="primary"
                                                class="btnattend"
                                            >
                                                <span>选择审批人</span>
                                            </mt-button>
                                        </el-popover>
                                    </div>
                                </div>
                            </div>

                            <div class="deleteRecord" v-if="detail.status==undefined">
                                <mt-button
                                    type="primary"
                                    class="btndeleteRecord"
                                    @click="deleteRecord(index, detail.approvalFields)"
                                >
                                    <span>删除</span>
                                </mt-button>
                            </div>
                        </div>
                    </div>

                    <div class="leaveboxBtn">
                        <mt-button type="default" class="leaveboxBtn-btn" @click="addApproval()">
                            <span>+添加考勤状态</span>
                        </mt-button>
                    </div>

                    <div class="revisebtm">
                        <div class="revisebtmlft">
                            <mt-button type="default" class="btncancel" @click="btncancel()">
                                <span>取消</span>
                            </mt-button>
                        </div>
                        <div class="revisebtmrgt">
                            <mt-button type="primary" class="btnsave" @click="saverevisetmp()">
                                <span>保存</span>
                            </mt-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!--是否有下一级审批-->
        <div v-show="hasNextperson">
            <div class="mint-msgbox-wrapper" style="position: absolute; z-index: 1001 !important;">
                <div class="mint-msgbox" style>
                    <div class="mint-msgbox-header">
                        <div class="mint-msgbox-title">提示</div>
                    </div>
                    <div class="mint-msgbox-content">
                        <div class="mint-msgbox-message">是否有下一级审批？</div>
                        <div class="mint-msgbox-input" style="display: none;">
                            <input placeholder type="text" />
                            <div class="mint-msgbox-errormsg" style="visibility: hidden;"></div>
                        </div>
                    </div>
                    <div class="mint-msgbox-btns">
                        <div
                            style="display: inline-block;width: 50%;"
                            v-if="(typeof approvalTypeObjtwo === 'object') && approvalTypeObjtwo.length > 0"
                        >
                            <el-popover
                                placement="top-start"
                                width="400"
                                trigger="click"
                                class="popoverPerson"
                                v-model="showperson"
                            >
                                <div class="approveperson" style="height: 300px;overflow-y: auto;">
                                    <div class="persontit">请选择下一级审批人</div>
                                    <div class="personcont" v-if="approvalTypeObjtwo">
                                        <el-table
                                            :data="approvalTypeObjtwo"
                                            @row-click="selectperson"
                                            align="center"
                                            class="persontable"
                                            style="width: 100%"
                                        >
                                            <el-table-column prop="NAME" label="姓名"></el-table-column>
                                            <el-table-column prop="MOBILE" label="手机号" width="150"></el-table-column>
                                            <el-table-column prop="DEPT_NAME" label="部门"></el-table-column>
                                        </el-table>
                                    </div>
                                </div>
                                <button
                                    slot="reference"
                                    type="primary"
                                    class="mint-msgbox-btn mint-msgbox-cancel"
                                    style="width: 100%;"
                                >
                                    <span>选择下一级审批人</span>
                                </button>
                            </el-popover>
                        </div>
                        <button
                            @click="noNextperson()"
                            class="mint-msgbox-btn mint-msgbox-confirm"
                        >无下一级审批</button>
                    </div>
                </div>
            </div>
            <div class="v-modal" style="z-index: 1000 !important;"></div>
        </div>

        <!--是否保存-->
        <div v-show="hasSave">
            <div class="mint-msgbox-wrapper" style="position: absolute; z-index: 1001 !important;">
                <div class="mint-msgbox" style>
                    <div class="mint-msgbox-header">
                        <div class="mint-msgbox-title">提示</div>
                    </div>
                    <div class="mint-msgbox-content">
                        <div class="mint-msgbox-message">您当前修订的内容尚未保存，是否保存？</div>
                        <div class="mint-msgbox-input" style="display: none;">
                            <input placeholder type="text" />
                            <div class="mint-msgbox-errormsg" style="visibility: hidden;"></div>
                        </div>
                    </div>
                    <div class="mint-msgbox-btns">
                        <button
                            class="mint-msgbox-btn mint-msgbox-cancel"
                            @click="savereviseNot()"
                        >不保存</button>
                        <button
                            @click="saverevisetmp()"
                            class="mint-msgbox-btn mint-msgbox-confirm"
                        >保存修订内容</button>
                    </div>
                </div>
            </div>
            <div class="v-modal" style="z-index: 1000 !important;"></div>
        </div>

        <!--成功提示弹框-->
        <mt-popup v-model="leaveSuccess" class="image-Success" :closeOnClickModal="false">
            <div class="image-box">
                <img :src="alertSuccessImage ? imgSrc.ico_success : imgSrc.ico_error" />
            </div>
            <p v-text="alertMessage"></p>
            <div @click="closeAlert" class="image-btn">
                <span>我知道啦</span>
            </div>
        </mt-popup>

        <!--日期组件-->
        <!--v-if="wordcodecurr!='workOverTime'"-->
        <div>
            <mt-datetime-picker
                type="datetime"
                ref="picker0"
                v-model="startTimeValue1"
                year-format="{value} 年"
                month-format="{value} 月"
                date-format="{value} 日"
                hour-format="{value} 时"
                minute-format="{value} 分"
                :closeOnClickModal="false"
                @confirm="handleConfirmStart"
                @cancel="closeDatepicker"
                :end-date="enddatetime"
            ></mt-datetime-picker>
            <mt-datetime-picker
                type="datetime"
                ref="picker1"
                v-model="endTimeValue1"
                year-format="{value} 年"
                month-format="{value} 月"
                date-format="{value} 日"
                hour-format="{value} 时"
                minute-format="{value} 分"
                :closeOnClickModal="false"
                @confirm="handleConfirmEnd"
                @cancel="closeDatepicker"
                :end-date="enddatetime"
            ></mt-datetime-picker>
        </div>

        <!--加班时间日期-->
        <!--<div v-if="wordcodecurr=='workOverTime'">
      <mt-datetime-picker
        type="datetime"
        ref="picker0"
        v-model="startTimeValue1"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日"
        hour-format="{value} 时"
        minute-format="{value} 分"
        :closeOnClickModal="false"
        @confirm="handleConfirmStart"
        @cancel="closeDatepicker"
        :end-date="workdatetimevurr"
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
        :closeOnClickModal="false"
        @confirm="handleConfirmEnd"
        @cancel="closeDatepicker"
        :end-date="workdatetimevurr"
      >
      </mt-datetime-picker>
        </div>-->
        <mt-datetime-picker
            ref="forgetDate"
            :value="new Date()"
            type="date"
            @confirm="handleForgetDate"
        ></mt-datetime-picker>
        <mt-datetime-picker ref="forgetTime" type="time" @confirm="handleForgetTime"></mt-datetime-picker>
    </div>
</template>
<script>
import {
    DatetimePicker,
    Navbar,
    TabItem,
    Popup,
    Indicator,
    MessageBox
} from "mint-ui";
import V from "vue";
import fullCalendar from "@/components/vue-partcalendar/src/partCalendar";
import utilsValid from "../common/utils";
import uploadImage from "../leaves/uploadImage";
import fancyBox from "vue-fancybox";
import moment from "moment";
import _ from "lodash";

let df = "YYYY-MM-DD HH:mm";
let df1 = "YYYY/MM";
let df2 = "YYYY/MM/DD";
let df3 = "YYYY-MM-DD";
let df4 = "YYYY/MM/DD HH:mm";
const textPattern = utilsValid.textPattern; //验证文本
const idNumberPattern = utilsValid.idNumberPattern;
const getExtType = utilsValid.getExtType;

export default {
    //    abnormal=异常   normal=正常   leave=请假   这个定的值是封装在日历里面定义好的颜色
    data() {
        return {
            fieldType4: {},
            currIndex: 0,
            applyIndex: 0,
            isStart: true,

            hasSave: false,
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
            punchState: {}, //选中日期打卡信息展示
            oldDayClick: "", //已经选中的日期
            duration: {}, //选中日期当日工时
            tozhang: "", //上班打卡状态
            downzhang: "", //下班打卡状态
            connectTime: {
                // chidao: '',   //迟到数量
                // zaotui: '',//早退数量
                // kuanggong: '',//旷工数量
                // waichu: '',//外出数量
                // totalTime: '',//今日工时数量
                // state: true,//判断是否显示这些数量值
            },
            toSapnTime: "", // 上班时间
            downSapnTime: "", // 下班时间
            imgSrc: {
                timeIcon: require("../../assets/time.png")
            },
            showRevise: true,
            hasAbnormal: [],
            datePunchCardLogs: [],
            daycurrent: "",
            searchApplyRecord: [],
            searchApplyRecordAll: {},
            attendReport: {},
            newAttendReport: {},
            //申请表单数据
            applyData: {
                approvalTypeUid: "", //申请类型Uid
                approvalConfigUid: "", //具体流程的uid
                leaveUid: "", //假期类型uid (非必填)
                category: "", //审批人类型
                currentApprover: "", //审批人uid
                email: "", //审批人邮箱
                approvalValues: [
                    {
                        approvalFieldUid: "", //申请模板字段uid
                        value: "", //填写的值
                        term: "", //多段的填写0开始 第一段申请时间，默认写0
                        sortnum: "0" //时间段开始时间0，结束时间1   默认写0
                    }
                ]
            },
            approvalValues: [
                {
                    approvalFieldUid: "", //申请模板字段uid
                    value: "", //填写的值
                    term: "", //多段的填写0开始 第一段申请时间，默认写0
                    sortnum: "0" //时间段开始时间0，结束时间1   默认写0
                }
            ],
            approvalValuestmp: [],
            applyWorkRef: [
                //加班时间段
                {
                    startTime: "",
                    endTime: ""
                }
            ],
            applyWorkRefAll: {},
            pos: "", //记录加班时间段的位置
            fieldsdata: {},
            fields: [],
            checked1: true,
            checked2: false,
            attendtime: [], //忘记打卡时间
            attendtimelist: ["18:00"],
            periodnum: 0,
            perioduid: "",
            tmpnumber: "1",
            outsideObj: [],
            showperson: false, //是否显示选择审批人弹框
            showpersontwo: false, //是否显示选择审批人弹框
            showpersonstyle: false,
            selectperData: "",
            pagenum: 1,
            totalpages: "",
            currentval: "",
            valuearray: [],
            confItems: {},
            confItemsval: {},
            confItemsALL: {},
            confItemsALLval: {},
            popImgSrc: "", // 查看的图片
            popupVisible: false, // 查看图片弹框
            // selectedDataApply: 0, //选择的申请类型
            selectedDataApply: ["0"], //选择的申请类型,多个申请类型
            applyTypeArray: [], //申请分类
            applyTypeArrayAll: {},
            selectedDataHoliday: "请选择假期类型", // 选择的假期类型
            holidayTypeArray: [], // 假期类型列表
            selectHoliday: {},
            imgSrc: {
                shenFenIconShowCamera: require("../../assets/camera.png"),
                ico_success: require("../../assets/ico_success.png"),
                ico_error: require("../../assets/ico_error.png")
            },
            changeApply: true, // 是否显示假期分类
            updateImage: true, //上传图片按钮是否隐藏
            approvalTypeObj: {}, // 审批人
            approvalTypeObjtwo: {}, // 审批人
            startTimeValue: "", //开始时间value
            startTimeValue1: new Date(), //初始化日历插件
            endTimeValue: "", //结束时间value
            endTimeValue1: new Date(), //初始化日历插件
            searchApplyRecord: [], //搜索申请记录
            leaveSuccess: false, //成功显示的弹框
            alertMessage: "", //提交弹框文字，显示提交状态
            alertSuccessImage: false, //显示提交状态
            codeSuccess: "", //点击我知道了进行状态判断跳转
            tokenHeader: {
                charset: "utf-8",
                openId: this.getCookie("openId")
            },
            passportUrlErrFlag: false, // 判断图片格式是否正确
            //提交全部考勤异常数据
            attendData: {
                uid: "", // 异常考勤的审批uid
                approvalTypeUid: "", // 申请类型Uid
                applicant: "", // 申请人uid
                category: "", // 0或者1
                currentApprover: "", // 0 填写上级审批人uid
                email: "", // 1 填写邮箱
                applys: [
                    {
                        uid: "", // 里面小的提交的考勤的审批id
                        approvalTypeUid: "", // 申请类型Uid
                        approvalConfigUid: "", // 具体流程的uid
                        leaveUid: "", // 假期uid
                        applicant: "", // 申请人uid
                        approvalValues: [
                            {
                                approvalFieldUid: "", // 申请模板字段uid
                                value: "", // 填写的值
                                term: "", // 多段的填写0开始 第一段申请时间，默认写0
                                sort: "" // 时间段开始时间0，结束时间1   默认写0
                            },
                            {
                                approvalFieldUid: "", // 申请模板字段uid
                                value: "", // 填写的值
                                term: "", // 多段的填写0开始 第一段申请时间，默认写0
                                sort: "" // 时间段开始时间0，结束时间1   默认写0
                            }
                        ]
                    }
                ]
            },
            record: [],
            uid: "",
            approveAllData: {},
            showperson: false,
            configType: "", //审批人类型
            tmpdata: "",
            currentStatus: "",
            hasNextperson: false, //是否有下一级审批人
            isSaveState: true,
            tmpnumber: "1",
            currfieldIndex: "",
            qingjiapos: "",
            currApprovalConfigUid: "",
            wordcodecurr: "",
            handler: function(e) {
                e.preventDefault();
            },
            workdatetimevurr: new Date(),
            enddatetime: new Date(new Date().getFullYear() + 10, 11, 31, 23, 59)
        };
    },
    created: function() {
        //初始化查询当月考勤省略 由于 changeMonth会执行查询这个月的数据展示

        this.getDetail();
        this.getApprovalType();

        //当前日期时间
        this.workdatetimevurr = new Date(
            new Date().getFullYear() +
                "/" +
                parseInt(new Date().getMonth() + 1) +
                "/" +
                new Date().getDate() +
                " 23:59"
        );
    },
    methods: {
        changeChb(bool, val, type, index, applyIndex) {
            var forgetTime = this.searchApplyRecord[applyIndex].forgetTime;
            this.applyIndex = applyIndex;
            this.currIndex = index;
            if (bool) {
                forgetTime[this.currIndex][type] = val;
            } else {
                forgetTime[this.currIndex][type] = "";
            }
        },
        handleForgetDate(date) {
            var forgetTime = this.searchApplyRecord[this.applyIndex].forgetTime;
            forgetTime[this.currIndex].date = moment(date).format(df3);
        },
        handleForgetTime(date) {
            var forgetTime = this.searchApplyRecord[this.applyIndex].forgetTime;
            if (this.isStart) {
                forgetTime[this.currIndex].start = date;
                if (this.attendtime[0] != date) {
                    forgetTime[this.currIndex].checkStart = false;
                } else {
                    forgetTime[this.currIndex].checkStart = true;
                }
            } else {
                forgetTime[this.currIndex].end = date;
                if (this.attendtime[1] != date) {
                    forgetTime[this.currIndex].checkEnd = false;
                } else {
                    forgetTime[this.currIndex].checkEnd = true;
                }
            }
        },
        openforgetDate(index, applyIndex) {
            this.currIndex = index;
            this.applyIndex = applyIndex;
            this.$refs.forgetDate.open();
        },
        openforgetTime(index, applyIndex, type) {
            this.currIndex = index;
            this.applyIndex = applyIndex;
            this.$refs.forgetTime.open();
            if (type == "start") {
                this.isStart = true;
            } else {
                this.isStart = false;
            }
        },
        addForgetTime(obj) {
            obj.push({
                date: "",
                start: "",
                end: "",
                checkStart: false,
                checkEnd: false
            });
        },

        // 删除新增的考勤状态
        deleteRecord(posIndex, approvalFields) {
            if (approvalFields && approvalFields != undefined) {
                for (let i = 0; i < approvalFields.length; i++) {
                    let item = approvalFields[i];
                    if (
                        item.fieldType == "3" ||
                        item.fieldType == "4" ||
                        item.fieldType == "5" ||
                        item.fieldType == "6" ||
                        item.fieldType == "7"
                    ) {
                        delete this.confItemsval[
                            (this.daycurrent + posIndex + item.uid).toString()
                        ];
                    }
                }
            }
            this.selectedDataApply.splice(posIndex, 1);
            this.searchApplyRecord.splice(posIndex, 1);
            this.$set(
                this.searchApplyRecordAll,
                this.daycurrent.toString(),
                this.searchApplyRecord
            );
        },
        //增加考勤状态
        addApproval() {
            for (let i = 0; i < this.fields.length; i++) {
                let item = this.fields[i];
                if (
                    item.fieldType == "3" ||
                    item.fieldType == "4" ||
                    item.fieldType == "5"
                ) {
                    item.term = 0;
                    item.sortnumtmp = 0;
                    (item.valuearray = []), (item.valuearray2 = []);
                    let numIndex = this.searchApplyRecord.length;
                    if (item.code == "punchTime") {
                        //忘记打卡
                        if (item.approvalValues.length > 0) {
                            for (
                                let j = 0;
                                j < item.approvalValues.length;
                                j++
                            ) {
                                let appfieldval = item.approvalValues[j];
                                item.valuearray.push(appfieldval.value);
                            }
                        }
                        this.$set(
                            this.confItems,
                            (this.daycurrent + numIndex + item.uid).toString(),
                            this.attendtime
                        );
                        this.$set(
                            this.confItemsval,
                            (this.daycurrent + numIndex + item.uid).toString(),
                            item.valuearray
                        );
                    } else {
                        if (item.approvalFieldValues.length > 0) {
                            for (
                                let j = 0;
                                j < item.approvalFieldValues.length;
                                j++
                            ) {
                                let appfieldval = item.approvalFieldValues[j];
                                if (appfieldval.isDefault) {
                                    if (item.fieldType == "4") {
                                        item.valuearray.push(appfieldval.value);
                                    } else {
                                        item.valuearray = appfieldval.value;
                                    }
                                }
                            }
                        }
                        this.$set(
                            this.confItems,
                            (this.daycurrent + numIndex + item.uid).toString(),
                            item.approvalFieldValues
                        );
                        this.$set(
                            this.confItemsval,
                            (this.daycurrent + numIndex + item.uid).toString(),
                            item.valuearray
                        ); //默认选中的值
                    }
                }
            }
            this.searchApplyRecord.push(this.fields);
            this.$set(
                this.searchApplyRecordAll,
                this.daycurrent.toString(),
                this.searchApplyRecord
            );
        },
        //获取考勤详情数据
        getDetail() {
            // console.log(1)
            let uid = this.$route.query.uid;
            let frompage = this.$route.query.frompage;
            if (frompage == "" || frompage == null || frompage == undefined) {
                frompage = "1";
            }
            this.currentStatus = frompage;
            this.$http.get("/api/v1.0/client/queryApplyDetail/" + uid).then(
                response => {
                    //点击查看当天考勤
                    if (response.body.code === 200) {
                        let data = response.body.result;
                        this.approveAllData = response.body.result;
                        this.hasAbnormal =
                            data.abnormalAttendApproval.hasAbnormal;
                        this.datePunchCardLogs =
                            data.abnormalAttendApproval.datePunchCardLogs;
                        this.dateApplys =
                            data.abnormalAttendApproval.dateApplys;
                        this.attendReport =
                            data.abnormalAttendApproval.attendReport;
                        this.newAttendReport =
                            data.abnormalAttendApproval.newAttendReport;
                        this.connectTime = data.abnormalAttendApproval;

                        if (this.attendReport.year && this.attendReport.month) {
                            this.dayClick(
                                new Date(
                                    Number(this.attendReport.year),
                                    Number(this.attendReport.month) - 1,
                                    1
                                )
                            );
                            this.changeMonth();
                        }

                        this.$http
                            .get(
                                "/api/v1.0/client/queryApprovalForm/" +
                                    response.body.result.approvalType
                            )
                            .then(
                                response => {
                                    if (response.body.code === 200) {
                                        this.fieldsdata = response.body.result;
                                        let approvalType =
                                            response.body.result.approvalType;
                                        let configType =
                                            response.body.result.configType;
                                        this.currApprovalConfigUid =
                                            response.body.result.uid;
                                        this.configType = configType; //当前异常考勤的审批人类型
                                        this.approvalperson(
                                            configType,
                                            approvalType
                                        );
                                    }
                                },
                                response => {}
                            );

                        //外出类型数据
                        this.approvaloutside("43");
                    }
                },
                response => {}
            );
        },
        editapply() {
            if (
                this.approveAllData.category == "" ||
                this.approveAllData.category == "null" ||
                this.approveAllData.category == null
            ) {
                this.showMsg("请填写汇报关系", -1);
                return false;
            }
            this.showRevise = false;
            this.isSaveState = false;
        },
        btncancel() {
            this.showRevise = true;
            this.isSaveState = true; //不保存

            //这里处理添加考勤状态的数据，添加的数据不需要保存
            this.searchApplyRecord = [];
            this.selectedDataApply = [];
            let dateApplys;
            if (
                this.dateApplys[this.daycurrent] &&
                this.dateApplys[this.daycurrent] != undefined
            ) {
                dateApplys = this.dateApplys[this.daycurrent];
                this.searchApplyRecord = [].concat(
                    this.dateApplys[this.daycurrent]
                );
            }
            if (dateApplys && dateApplys.length > 0) {
                for (let i = 0; i < dateApplys.length; i++) {
                    let applyItem = dateApplys[i];
                    applyItem["daycurrent"] = this.daycurrent;
                    applyItem["daysortnum"] = i;
                    if (dateApplys.length > 0) {
                        this.selectedDataApply.push(applyItem.approvalType);
                    } else {
                        this.selectedDataApply = ["0"];
                    }
                }
            }
            this.$set(
                this.searchApplyRecordAll,
                this.daycurrent.toString(),
                this.searchApplyRecord
            );
        },
        saverevisetmp() {
            this.hasSave = false; //关闭保存提示弹框
            for (let i = 0; i < this.searchApplyRecord.length; i++) {
                let item = this.searchApplyRecord[i];
                if (item.status != "1" && item.status != "2") {
                    //已通过1，和未通过2，不需要提交申请
                    for (let j = 0; j < item.approvalFields.length; j++) {
                        let list = item.approvalFields[j];
                        //验证数据
                        if (
                            list.fieldType == "0" ||
                            list.fieldType == "1" ||
                            list.fieldType == "2"
                        ) {
                            //单行文本、多行文本、数字
                            if (list.value == "" || list.value == undefined) {
                                if (list.isRequired) {
                                    //必填
                                    this.showMsg(list.fieldHint, -1);
                                    return false;
                                }
                            } else {
                                if (
                                    (list.fieldType == "0" ||
                                        list.fieldType == "1") &&
                                    list.fieldName != "时长（小时）" &&
                                    !list.isDefault
                                ) {
                                    if (
                                        !textPattern[
                                            list.conditions.join("")
                                        ].test(list.value)
                                    ) {
                                        this.showMsg(list.fieldHint, -1);
                                        return false;
                                    }
                                } else if (
                                    list.fieldType == "2" &&
                                    !list.isDefault
                                ) {
                                    //数字
                                    if (!textPattern[3].test(list.value)) {
                                        this.showMsg(list.fieldHint, -1);
                                        return false;
                                    }
                                }
                            }
                        } else if (
                            list.fieldType == "3" ||
                            (list.fieldType == "4" &&
                                (item.approvalType !== 1 ||
                                    item.attendRuleUid !== "1"))
                        ) {
                            //多行文本
                            if (
                                (this.confItemsval[
                                    (this.daycurrent + i + list.uid).toString()
                                ] == [] ||
                                    this.confItemsval[
                                        (
                                            this.daycurrent +
                                            i +
                                            list.uid
                                        ).toString()
                                    ].length == 0) &&
                                list.isRequired
                            ) {
                                this.showMsg(list.fieldHint, -1);
                                return false;
                            }
                        } else if (list.fieldType == "5") {
                            //下拉选框（请假类型和外出类型）
                            if (
                                list.code == "leaveType" ||
                                list.code == "outType"
                            ) {
                                if (
                                    (this.confItemsval[
                                        (
                                            this.daycurrent +
                                            i +
                                            list.uid
                                        ).toString()
                                    ] == [] ||
                                        this.confItemsval[
                                            (
                                                this.daycurrent +
                                                i +
                                                list.uid
                                            ).toString()
                                        ] == undefined) &&
                                    list.isRequired
                                ) {
                                    this.showMsg(list.fieldHint, -1);
                                    return false;
                                }
                            } else {
                                if (
                                    (this.confItemsval[
                                        (
                                            this.daycurrent +
                                            i +
                                            list.uid
                                        ).toString()
                                    ] == [] ||
                                        this.confItemsval[
                                            (
                                                this.daycurrent +
                                                i +
                                                list.uid
                                            ).toString()
                                        ] == undefined) &&
                                    list.isRequired
                                ) {
                                    this.showMsg(list.fieldHint, -1);
                                    return false;
                                }
                            }
                        } else if (list.fieldType == "6") {
                            if (
                                item.approvalType !== 1 ||
                                item.attendRuleUid !== "1"
                            ) {
                                if (
                                    (list.value == "" ||
                                        list.value == undefined) &&
                                    list.isRequired
                                ) {
                                    this.showMsg(list.fieldHint, -1);
                                    return false;
                                }
                            } else if (
                                item.approvalType == 1 &&
                                item.attendRuleUid == 1
                            ) {
                                //特殊处理
                                let valid = true;

                                item.forgetTime.forEach(el => {
                                    if (
                                        el.date.length == 0 &&
                                        list.isRequired
                                    ) {
                                        this.showMsg(list.fieldHint, -1);
                                        valid = false;
                                        return valid;
                                    }
                                    if (
                                        (!el.start || !el.end) &&
                                        this.fieldType4.isRequired
                                    ) {
                                        this.showMsg(
                                            this.fieldType4.fieldHint,
                                            -1
                                        );
                                        valid = false;
                                        return valid;
                                    }
                                });
                                if (!valid) {
                                    return valid;
                                }
                            }
                        } else if (list.fieldType == "7") {
                            //日期和日期时间段
                            let workrefval = this.applyWorkRefAll[
                                (this.daycurrent + i + list.uid).toString()
                            ];
                            if (
                                workrefval.length != 0 &&
                                (workrefval[0].startTime == "" ||
                                    workrefval[0].endTime == "") &&
                                list.isRequired
                            ) {
                                this.showMsg(list.fieldHint, -1);
                                return false;
                            }
                        } else if (list.fieldType == "8") {
                            //附件
                            if (
                                list.approvalFieldValues.length == 0 ||
                                list.approvalFieldValues == []
                            ) {
                                if (list.isRequired) {
                                    //必填
                                    this.showMsg(list.fieldHint, -1);
                                    return false;
                                }
                            }
                        }

                        if (list.approvalValues.length == 0) {
                            list.approvalValues.push({
                                value: "",
                                term: 0,
                                sortnum: 0
                            });
                        }
                        var list4 = {};
                        if (
                            list.fieldType == "0" ||
                            list.fieldType == "1" ||
                            list.fieldType == "2"
                        ) {
                            if (
                                list.value != "" &&
                                list.value != null &&
                                list.value != undefined
                            ) {
                                list.approvalValues[0].value = list.value;
                            } else {
                                list.approvalValues = [];
                            }
                        } else if (list.fieldType == "3") {
                            //单选框
                            list.approvalValues[0].value = this.confItemsval[
                                (this.daycurrent + i + list.uid).toString()
                            ];
                        } else if (list.fieldType == "4") {
                            if (
                                item.approvalType !== 1 ||
                                item.attendRuleUid !== "1"
                            ) {
                                //多选框
                                for (
                                    let m = 0;
                                    m <
                                    this.confItemsval[
                                        (
                                            this.daycurrent +
                                            i +
                                            list.uid
                                        ).toString()
                                    ].length;
                                    m++
                                ) {
                                    if (
                                        list.approvalValues.length <
                                        this.confItemsval[
                                            (
                                                this.daycurrent +
                                                i +
                                                list.uid
                                            ).toString()
                                        ].length
                                    ) {
                                        list.approvalValues.push({
                                            value: "",
                                            term: 0,
                                            sortnum: m
                                        });
                                    }
                                    list.approvalValues[
                                        m
                                    ].value = this.confItemsval[
                                        (
                                            this.daycurrent +
                                            i +
                                            list.uid
                                        ).toString()
                                    ][m];
                                }
                            } else if (
                                item.approvalType == 1 &&
                                item.attendRuleUid == 1
                            ) {
                                list.approvalValues = [];
                                item.forgetTime.forEach((el, i) => {
                                    // 4
                                    list.approvalValues.push({
                                        approvalFieldUid: list.uid,
                                        value: el.start,
                                        term: i,
                                        sortnum: 0
                                    });
                                    list.approvalValues.push({
                                        approvalFieldUid: list.uid,
                                        value: el.end,
                                        term: i,
                                        sortnum: 1
                                    });
                                });
                            }
                        } else if (list.fieldType == "5") {
                            //下拉框
                            if (list.code == "leaveType") {
                                item.leaveUid = this.confItemsval[
                                    (this.daycurrent + i + list.uid).toString()
                                ].LEAVE_INFO_UID;
                                list.approvalValues[0].value = this.confItemsval[
                                    (this.daycurrent + i + list.uid).toString()
                                ].NAME;
                            } else if (list.code == "outType") {
                                item.leaveUid = "";
                                list.approvalValues[0].value = this.confItemsval[
                                    (this.daycurrent + i + list.uid).toString()
                                ].name;
                            } else {
                                list.approvalValues[0].value = this.confItemsval[
                                    (this.daycurrent + i + list.uid).toString()
                                ];
                            }
                        } else if (list.fieldType == "6") {
                            if (
                                item.approvalType !== 1 ||
                                item.attendRuleUid !== "1"
                            ) {
                                list.approvalValues[0].value = list.value;
                            }
                            if (
                                item.approvalType == 1 &&
                                item.attendRuleUid == 1
                            ) {
                                list.approvalValues = [];

                                item.forgetTime.forEach((el, i) => {
                                    //6
                                    list.approvalValues.push({
                                        approvalFieldUid: list.uid,
                                        value: el.date,
                                        term: i,
                                        sortnum: list.sortnumtmp
                                    });
                                });
                            }
                        } else if (list.fieldType == "7") {
                            let periodarr = [];
                            let tmpapprovalValues;
                            if (list.approvalValues.length == 1) {
                                //不是必填
                                list.approvalValues.push({
                                    value: "",
                                    term: 0,
                                    sortnum: 1
                                });
                            }
                            if (
                                this.applyWorkRefAll[
                                    (this.daycurrent + i + list.uid).toString()
                                ].length > 1
                            ) {
                                tmpapprovalValues = list.approvalValues[0];
                            }
                            list.periodarr = this.applyWorkRefAll[
                                (this.daycurrent + i + list.uid).toString()
                            ];
                        } else if (list.fieldType == "8") {
                            if (list.approvalFieldValues.length > 0) {
                                for (
                                    let n = 0;
                                    n < list.approvalFieldValues.length;
                                    n++
                                ) {
                                    let detail = list.approvalFieldValues[n];
                                    detail["url"] = detail.value;
                                    detail["width"] = "0";
                                    detail["height"] = "0";
                                }
                            }
                            list.approvalValues = list.approvalFieldValues;
                        }
                    }
                }
            }
            this.dateApplys[this.daycurrent] = this.searchApplyRecord;
            this.isSaveState = true; //判断是否保存
            this.showRevise = true;
        },
        savereviseNot() {
            this.showRevise = true;
            this.isSaveState = true; //不保存
            this.hasSave = false;
            //这里处理添加考勤状态的数据，添加的数据不需要保存
            this.searchApplyRecord = [];
            this.selectedDataApply = [];
            let dateApplys;
            if (
                this.dateApplys[this.daycurrent] &&
                this.dateApplys[this.daycurrent] != undefined
            ) {
                dateApplys = this.dateApplys[this.daycurrent];
                this.searchApplyRecord = [].concat(
                    this.dateApplys[this.daycurrent]
                );
            }
            if (dateApplys && dateApplys.length > 0) {
                for (let i = 0; i < dateApplys.length; i++) {
                    let applyItem = dateApplys[i];
                    applyItem["daycurrent"] = this.daycurrent;
                    applyItem["daysortnum"] = i;
                    if (dateApplys.length > 0) {
                        this.selectedDataApply.push(applyItem.approvalType);
                    } else {
                        this.selectedDataApply = ["0"];
                    }
                }
            }
            this.$set(
                this.searchApplyRecordAll,
                this.daycurrent.toString(),
                this.searchApplyRecord
            );
        },
        savereviseone() {
            if (this.configType == 1) {
                this.showpersontwo = true;
            } else {
                this.showpersontwo = false;
                this.saverevisethree();
            }
        },
        saverevisetwo(row, event, column) {
            this.approveAllData.category = "1";
            this.approveAllData.currentApprover = row.UID;
            this.approveAllData.email = "";
            this.showpersontwo = false;
            this.saverevisethree(); //提交
        },
        saverevisethree() {
            //处理申请表单的数据
            //处理申请表单的数据
            let arrdata = [];
            var obj = this.searchApplyRecordAll;
            for (let key in obj) {
                arrdata = arrdata.concat(obj[key]);
            }

            this.record = arrdata;
            let record = arrdata;
            let applys = [];
            let approvalValues = [];
            for (let i = 0; i < record.length; i++) {
                let item = record[i];
                approvalValues = [];
                if (item.status != "1" && item.status != "2") {
                    for (let j = 0; j < item.approvalFields.length; j++) {
                        let list = item.approvalFields[j];

                        if (
                            list.fieldType != "7" &&
                            list.fieldType != "8" &&
                            list.fieldType != "3" &&
                            list.fieldType != "4" &&
                            (list.fieldType != "5" &&
                                list.code != "outType" &&
                                list.code != "leaveType")
                        ) {
                            if (
                                list.fieldType == "6" &&
                                item.approvalType === 1 &&
                                item.attendRuleUid === "1"
                            ) {
                                list.approvalValues.forEach((el, i) => {
                                    approvalValues.push({
                                        approvalFieldUid: list.uid,
                                        value: el.value,
                                        term: i,
                                        sortnum: list.sortnumtmp
                                    });
                                });
                            } else {
                                if (
                                    list.value != "" &&
                                    list.value != null &&
                                    list.value != undefined
                                ) {
                                    approvalValues.push({
                                        approvalFieldUid: list.uid,
                                        value: list.value,
                                        term: list.term,
                                        sortnum: list.sortnumtmp
                                    });
                                }
                            }
                        } else {
                            if (
                                list.fieldType == "3" ||
                                list.fieldType == "5"
                            ) {
                                //单选框
                                if (list.fieldType == "3") {
                                    if (
                                        this.confItemsval[
                                            (
                                                item.daycurrent +
                                                item.daysortnum +
                                                list.uid
                                            ).toString()
                                        ] != "" &&
                                        this.confItemsval[
                                            (
                                                item.daycurrent +
                                                item.daysortnum +
                                                list.uid
                                            ).toString()
                                        ] != null &&
                                        this.confItemsval[
                                            (
                                                item.daycurrent +
                                                item.daysortnum +
                                                list.uid
                                            ).toString()
                                        ] != undefined
                                    ) {
                                        approvalValues.push({
                                            approvalFieldUid: list.uid,
                                            value: this.confItemsval[
                                                (
                                                    item.daycurrent +
                                                    item.daysortnum +
                                                    list.uid
                                                ).toString()
                                            ],
                                            term: 0,
                                            sortnum: 0
                                        });
                                    }
                                } else if (
                                    list.fieldType == "5" &&
                                    (list.code != "outType" ||
                                        list.code != "leaveType")
                                ) {
                                    let qingjiaval = this.confItemsval[
                                        (
                                            item.daycurrent +
                                            item.daysortnum +
                                            list.uid
                                        ).toString()
                                    ];
                                    if (list.code == "leaveType") {
                                        if (
                                            qingjiaval != "" &&
                                            qingjiaval != null &&
                                            qingjiaval != undefined
                                        ) {
                                            approvalValues.push({
                                                approvalFieldUid: list.uid,
                                                value: this.confItemsval[
                                                    (
                                                        item.daycurrent +
                                                        item.daysortnum +
                                                        list.uid
                                                    ).toString()
                                                ].NAME,
                                                term: 0,
                                                sortnum: 0
                                            });
                                        }
                                    } else if (list.code == "outType") {
                                        if (
                                            qingjiaval != "" &&
                                            qingjiaval != null &&
                                            qingjiaval != undefined
                                        ) {
                                            item.leaveUid = "";
                                            approvalValues.push({
                                                approvalFieldUid: list.uid,
                                                value: this.confItemsval[
                                                    (
                                                        item.daycurrent +
                                                        item.daysortnum +
                                                        list.uid
                                                    ).toString()
                                                ].name,
                                                term: 0,
                                                sortnum: 0
                                            });
                                        }
                                    } else {
                                        if (
                                            this.confItemsval[
                                                (
                                                    item.daycurrent +
                                                    item.daysortnum +
                                                    list.uid
                                                ).toString()
                                            ] != "" &&
                                            this.confItemsval[
                                                (
                                                    item.daycurrent +
                                                    item.daysortnum +
                                                    list.uid
                                                ).toString()
                                            ] != null &&
                                            this.confItemsval[
                                                (
                                                    item.daycurrent +
                                                    item.daysortnum +
                                                    list.uid
                                                ).toString()
                                            ] != undefined
                                        ) {
                                            approvalValues.push({
                                                approvalFieldUid: list.uid,
                                                value: this.confItemsval[
                                                    (
                                                        item.daycurrent +
                                                        item.daysortnum +
                                                        list.uid
                                                    ).toString()
                                                ],
                                                term: 0,
                                                sortnum: 0
                                            });
                                        }
                                    }
                                }
                            } else if (list.fieldType == "4") {
                                if (
                                    item.approvalType !== 1 ||
                                    item.attendRuleUid !== 1
                                ) {
                                    //多选框
                                    if (
                                        this.confItemsval[
                                            (
                                                item.daycurrent +
                                                item.daysortnum +
                                                list.uid
                                            ).toString()
                                        ].length > 0
                                    ) {
                                        for (
                                            let m = 0;
                                            m <
                                            this.confItemsval[
                                                (
                                                    item.daycurrent +
                                                    item.daysortnum +
                                                    list.uid
                                                ).toString()
                                            ].length;
                                            m++
                                        ) {
                                            approvalValues.push({
                                                approvalFieldUid: list.uid,
                                                value: this.confItemsval[
                                                    (
                                                        item.daycurrent +
                                                        item.daysortnum +
                                                        list.uid
                                                    ).toString()
                                                ][m],
                                                term: 0,
                                                sortnum: m
                                            });
                                        }
                                    }
                                } else if (
                                    item.approvalType === 1 &&
                                    item.attendRuleUid === "1"
                                ) {
                                    list.approvalValues.forEach((el, i) => {
                                        approvalValues.push(el);
                                    });
                                }
                            }

                            if (list.fieldType == "7") {
                                //处理item.fieldType="7"日期时间段的数据
                                let periodarr = [];
                                for (
                                    let m = 0;
                                    m <
                                    this.applyWorkRefAll[
                                        (
                                            item.daycurrent +
                                            item.daysortnum +
                                            list.uid
                                        ).toString()
                                    ].length;
                                    m++
                                ) {
                                    let itemtwo = this.applyWorkRefAll[
                                        (
                                            item.daycurrent +
                                            item.daysortnum +
                                            list.uid
                                        ).toString()
                                    ][m];
                                    for (let n = 0; n < 2; n++) {
                                        let timecurr;
                                        if (n == 0) {
                                            timecurr = itemtwo.startTime;
                                        } else if (n == 1) {
                                            timecurr = itemtwo.endTime;
                                        }
                                        if (
                                            timecurr != "" &&
                                            timecurr != null &&
                                            timecurr != undefined
                                        ) {
                                            periodarr.push({
                                                approvalFieldUid: list.uid,
                                                value: timecurr,
                                                term: m,
                                                sortnum: n
                                            });
                                        }
                                    }
                                }
                                approvalValues = approvalValues.concat(
                                    periodarr
                                );
                            }

                            if (list.fieldType == "8") {
                                if (list.approvalFieldValues.length != 0) {
                                    let picturearr = [];
                                    for (
                                        let m = 0;
                                        m < list.approvalFieldValues.length;
                                        m++
                                    ) {
                                        let detail =
                                            list.approvalFieldValues[m];
                                        if (
                                            detail.url != "" &&
                                            detail.url != null &&
                                            detail.url != undefined
                                        ) {
                                            picturearr.push({
                                                approvalFieldUid: list.uid,
                                                value: detail.url,
                                                term: 0,
                                                sortnum: m
                                            });
                                        }
                                    }
                                    approvalValues = approvalValues.concat(
                                        picturearr
                                    );
                                }
                            }
                        }
                    }
                    if (item.approvalConfigUid) {
                        //修改的
                        applys.push({
                            uid: item.uid, // 里面小的提交的考勤的审批id
                            approvalTypeUid: item.approvalTypeUid, // 申请类型Uid
                            approvalConfigUid: item.approvalConfigUid
                                ? item.approvalConfigUid
                                : item.uid, // 具体流程的uid
                            leaveUid: item.leaveUid, // 假期uid
                            approvalValues: approvalValues
                        });
                    } else {
                        //新增的
                        applys.push({
                            approvalTypeUid: item.approvalTypeUid, // 申请类型Uid
                            approvalConfigUid: item.approvalConfigUid
                                ? item.approvalConfigUid
                                : item.uid, // 具体流程的uid
                            leaveUid:
                                item.leaveUid && item.leaveUid != undefined
                                    ? item.leaveUid
                                    : "", // 假期uid
                            approvalValues: approvalValues
                        });
                    }
                }
            }
            console.log(applys);
            let applysAllparams = {
                uid: this.approveAllData.uid, // 异常考勤的审批uid
                approvalTypeUid: this.approveAllData.approvalTypeUid, // 申请类型Uid
                approvalConfigUid: this.currApprovalConfigUid, //异常考勤-1类型的uid
                category: this.approveAllData.category, // 0或者1
                currentApprover: this.approveAllData.currentApprover, // 0 填写上级审批人uid
                email: this.approveAllData.email, // 1 填写邮箱
                attendPeroid: this.approveAllData.attendPeroid,
                applys: applys
            };
            this.$http
                .post("/api/v1.0/client/abnormalApply", applysAllparams)
                .then(
                    response => {
                        //提交请假申请
                        // Indicator.close();//申请提交成功
                        this.codeSuccess = response.body.code;
                        this.leaveSuccess = true;
                        if (response.body.code === 200) {
                            this.alertSuccessImage = true;
                            this.alertMessage = response.body.message;
                        } else {
                            this.alertSuccessImage = false;
                            this.alertMessage = response.body.message;
                        }
                    },
                    response => {
                        //          console.log('error callback');
                    }
                );
        },

        dayClick(day) {
            //  点击日历，获取日期
            //  点击日历，获取日期
            //  转换日期格式
            //  检测假日里是否已经含有点击的这一天
            //再此处调用每一次日期的接口 进行传值
            //点击当天进行查询打卡状态开始
            //格式化时间开始

            if (!this.isSaveState) {
                this.hasSave = true;
                return false;
            }

            let newday = moment(day).format(df3);
            this.daycurrent = newday;
            this.duration = this.datePunchCardLogs[newday];

            if (this.duration) {
                let durationstatus = "";
                if (this.duration.isAbsent == true) {
                    durationstatus = "旷工";
                } else {
                    if (
                        this.duration.isBelate == true &&
                        this.duration.isLeaveearly == true
                    ) {
                        durationstatus = "迟到/早退";
                    } else {
                        if (this.duration.isBelate == true) {
                            durationstatus = "迟到/早退";
                        }
                        if (this.duration.isLeaveearly == true) {
                            durationstatus = "迟到/早退";
                        }
                    }
                }
                this.duration.durationstatus = durationstatus;
            }

            this.selectedDataApply = [];
            this.searchApplyRecord = []; //页面显示申请数据个数，列表和修改时
            //显示当日申请记录，可能有多个申请
            let dateApplys;
            if (
                this.dateApplys[newday] &&
                this.dateApplys[newday] != undefined
            ) {
                dateApplys = this.dateApplys[newday];
            }

            if (dateApplys && dateApplys.length > 0) {
                for (let i = 0; i < dateApplys.length; i++) {
                    let applyItem = dateApplys[i];
                    applyItem["daycurrent"] = newday;
                    applyItem["daysortnum"] = i;
                    if (dateApplys.length > 0) {
                        this.selectedDataApply.push(applyItem.approvalType);
                    } else {
                        this.selectedDataApply = ["0"];
                    }
                    var _arr = [];
                    for (
                        let j = 0;
                        j < dateApplys[i].approvalFields.length;
                        j++
                    ) {
                        let list = dateApplys[i].approvalFields[j];
                        if (list.fieldType == "7") {
                            let timearr = [];
                            if (list.periodarr && list.periodarr.length > 0) {
                                timearr = list.periodarr;
                            } else {
                                if (list.approvalValues.length > 0) {
                                    let number = Math.floor(
                                        list.approvalValues.length / 2
                                    );
                                    if (
                                        parseInt(list.approvalValues[0].term) >
                                        0
                                    ) {
                                        number =
                                            parseInt(
                                                list.approvalValues[0].term
                                            ) + number;
                                    }
                                    for (let m = 0; m < number; m++) {
                                        let timeobj = {
                                            startTime: "",
                                            endTime: ""
                                        };
                                        for (
                                            let n = 0;
                                            n < list.approvalValues.length;
                                            n++
                                        ) {
                                            let detail = list.approvalValues[n];
                                            if (
                                                detail.term == m &&
                                                detail.sortnum == 0
                                            ) {
                                                timeobj.startTime =
                                                    detail.value;
                                            } else if (
                                                detail.term == m &&
                                                detail.sortnum == 1
                                            ) {
                                                timeobj.endTime = detail.value;
                                                timearr.push(timeobj);
                                            }
                                        }
                                    }
                                    list.periodarr = timearr;
                                }
                            }
                            this.$set(
                                this.applyWorkRefAll,
                                (this.daycurrent + i + list.uid).toString(),
                                timearr
                            );
                        } else if (
                            list.fieldType == "3" ||
                            list.fieldType == "4" ||
                            list.fieldType == "5"
                        ) {
                            list.term = 0;
                            list.sortnumtmp = 0;
                            (list.valuearray = []), (list.valuearray2 = []);

                            if (list.code == "punchTime") {
                                //忘记打卡
                                if (list.approvalValues.length > 0) {
                                    for (
                                        let j = 0;
                                        j < list.approvalValues.length;
                                        j++
                                    ) {
                                        let appfieldval =
                                            list.approvalValues[j];
                                        list.valuearray.push(appfieldval.value);
                                    }
                                }
                                let daycurrentStr = this.daycurrent.toString();
                                this.$set(
                                    this.confItems,
                                    (daycurrentStr + i + list.uid).toString(),
                                    list.attendtime
                                );
                                this.$set(
                                    this.confItemsval,
                                    (daycurrentStr + i + list.uid).toString(),
                                    list.valuearray
                                );
                            } else if (list.code == "leaveType") {
                                let qingjiaval;
                                if (list.approvalValues.length > 0) {
                                    qingjiaval = list.approvalValues[0].value;
                                    let daycurrentStr = this.daycurrent.toString();
                                    this.$set(
                                        this.confItems,
                                        (
                                            daycurrentStr +
                                            i +
                                            list.uid
                                        ).toString(),
                                        { NAME: qingjiaval }
                                    );
                                    for (
                                        let n = 0;
                                        n < this.holidayTypeArray.length;
                                        n++
                                    ) {
                                        if (
                                            qingjiaval ==
                                            this.holidayTypeArray[n].NAME
                                        ) {
                                            this.$set(
                                                this.confItemsval,
                                                (
                                                    daycurrentStr +
                                                    i +
                                                    list.uid
                                                ).toString(),
                                                this.holidayTypeArray[n]
                                            );
                                        }
                                    }
                                }
                            } else if (list.code == "outType") {
                                let qingjiaval;
                                if (list.approvalValues.length > 0) {
                                    qingjiaval = list.approvalValues[0].value;
                                    let daycurrentStr = this.daycurrent.toString();
                                    this.$set(
                                        this.confItems,
                                        (
                                            daycurrentStr +
                                            i +
                                            list.uid
                                        ).toString(),
                                        { name: qingjiaval }
                                    );
                                    for (
                                        let n = 0;
                                        n < this.outsideObj.length;
                                        n++
                                    ) {
                                        if (
                                            qingjiaval ==
                                            this.outsideObj[n].name
                                        ) {
                                            this.$set(
                                                this.confItemsval,
                                                (
                                                    daycurrentStr +
                                                    i +
                                                    list.uid
                                                ).toString(),
                                                this.outsideObj[n]
                                            );
                                        }
                                    }
                                }
                            } else {
                                if (
                                    list.approvalFieldValues.length > 0 &&
                                    list.approvalValues.length > 0
                                ) {
                                    for (
                                        let j = 0;
                                        j < list.approvalValues.length;
                                        j++
                                    ) {
                                        let appfieldval =
                                            list.approvalValues[j];
                                        if (list.fieldType == "4") {
                                            list.valuearray.push(
                                                appfieldval.value
                                            );
                                        } else {
                                            list.valuearray = appfieldval.value;
                                        }
                                    }
                                }
                                let daycurrentStr = this.daycurrent.toString();
                                this.$set(
                                    this.confItems,
                                    (daycurrentStr + i + list.uid).toString(),
                                    list.approvalFieldValues
                                );
                                this.$set(
                                    this.confItemsval,
                                    (daycurrentStr + i + list.uid).toString(),
                                    list.valuearray
                                );
                            }
                        } else if (list.fieldType == "8") {
                            if (list.approvalValues.length > 0) {
                                for (
                                    let n = 0;
                                    n < list.approvalValues.length;
                                    n++
                                ) {
                                    let detail = list.approvalValues[n];
                                    detail["url"] = detail.value;
                                    detail["width"] = "0";
                                    detail["height"] = "0";
                                }
                            }
                            list.approvalFieldValues = list.approvalValues;
                        } else {
                            if (list.approvalValues.length) {
                                list.value = list.approvalValues[0].value;
                            }
                            list.term = 0;
                            list.sortnumtmp = 0;
                        }
                        if (
                            dateApplys[i].approvalType == 1 &&
                            dateApplys[i].attendRuleUid == 1
                        ) {

                            if (list.fieldType == 6) {
                                list.approvalValues.forEach((el, index) => {
                                    _arr[el.term] = {
                                        date: el.value,
                                        start: "",
                                        end: "",
                                        checkStart: false,
                                        checkEnd: false
                                    };
                                });
                            } else if (list.fieldType == 4) {
                                this.fieldType4 =list;
                                list.approvalValues.forEach((el, index) => {
                                    
                                    if (el.sortnum == 0) {
                                        _arr[el.term].start = el.value;
                                        _arr[el.term].checkStart =
                                            el.value == this.attendtime[0];
                                    } else if (el.sortnum == 1) {
                                        _arr[el.term].end = el.value;
                                        _arr[el.term].checkEnd =
                                            el.value == this.attendtime[1];
                                    }
                                });
                            }
                        }
                    }
                    this.$set(dateApplys[i],'forgetTime',_arr)
                }
                this.searchApplyRecord = this.searchApplyRecord.concat(
                    dateApplys
                );
            } else {
                this.searchApplyRecord = [];
            }
            if (dateApplys != undefined) {
                this.$set(
                    this.searchApplyRecordAll,
                    newday.toString(),
                    dateApplys
                );
            }
        },
        changeMonth(start, end, currentStart, current) {
            // console.log(2)
            let param;
            if (this.attendReport.year && this.attendReport.month) {
                param = {
                    date: moment(
                        new Date(
                            Number(this.attendReport.year),
                            Number(this.attendReport.month) - 1,
                            1
                        )
                    ).format(df1)
                };
            } else {
                return;
            }

            this.$http.post("/api/v1.0/client/findMonthAttends", param).then(
                response => {
                    //查询当月考勤接口
                    this.fcEvents = [];
                    if (response.body.code === 200) {
                        //显示默认当天考勤信息
                        // this.dayClick(new Date());
                        if (response.body.result) {
                            //显示假期信息
                            let arrayShow =
                                response.body.result.attend.holidays;
                            if (arrayShow.length) {
                                for (let i = 0; i < arrayShow.length; i++) {
                                    //此处循环一个数组进行填充假期显示
                                    if (
                                        arrayShow[i].rightType === "0" ||
                                        arrayShow[i].rightType === "1" ||
                                        arrayShow[i].rightType === "2"
                                    ) {
                                        this.fcEvents.push({
                                            isHoliday: true,
                                            start: arrayShow[i].date,
                                            end: arrayShow[i].date
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
                                for (
                                    let i = 0;
                                    i < response.body.result.records.length;
                                    i++
                                ) {
                                    //循环添加给日历表添加日期状态
                                    let connectDate = {};
                                    connectDate.start =
                                        response.body.result.records[i].date;
                                    connectDate.end =
                                        response.body.result.records[i].date;
                                    connectDate.cssClass =
                                        response.body.result.records[i].desc;
                                    this.fcEvents.push(connectDate);
                                }
                            }
                            this.connectTime.chidao =
                                response.body.result.belateTimes; //赋值给查询出来的月总数
                            this.connectTime.zaotui =
                                response.body.result.leaveearlyTimes;
                            this.connectTime.kuanggong =
                                response.body.result.absentTimes;
                            this.connectTime.waichu =
                                response.body.result.outsideTimes;
                        }
                    }
                },
                response => {}
            );
        },

        showDate(name, num) {
            //查出展示当月工作日的背景颜色
            if (!name) {
                let week = document.getElementsByClassName("week-row");
                for (let i = 0; i < week.length; i++) {
                    let data = week[i].getElementsByClassName("day-cell");
                    // if (!data[num].classList.contains("not-cur-month")) {
                    //   data[num].style.color = 'rgb(180,184,187)';
                    // } else {
                    //   data[num].style.color = '';
                    // }
                }
            } else {
                let week = document.getElementsByClassName("week-row");
                for (let i = 0; i < week.length; i++) {
                    let data = week[i].getElementsByClassName("day-cell");
                    // if (!data[num].classList.contains("not-cur-month")) {
                    //   data[num].style.color = '';
                    // } else {
                    //   data[num].style.color = '';
                    // }
                }
            }
        },
        // 格式化时间
        formatTime(time) {
            return moment(new Date(time)).format(df);
        },
        // 格式化打卡状态
        formatPunchState(state, area, time, isToday, type) {
            let show = "";
            if (time) {
                if (type) {
                    if (state === 0) {
                        show = "正常打卡";
                    } else if (state === 1) {
                        show = "迟到打卡";
                    } else if (state === 2) {
                        show = "旷工打卡";
                    }
                } else {
                    if (state === 0) {
                        show = "正常打卡";
                    } else if (state === 1) {
                        show = "早退打卡";
                    } else if (state === 2) {
                        show = "加班打卡";
                    } else if (state === 3) {
                        show = "旷工打卡";
                    }
                }
                if (area) {
                    show = show + "(区域外)";
                }
            } else {
                if (isToday) {
                    show = "";
                } else {
                    show = "未打卡";
                }
            }
            return show;
        },

        //修改申请表单内容
        getApprovalType() {
            //查询申请类型列表
            this.$http.get("/api/v1.0/client/queryApprovalType").then(
                response => {
                    if (response.body.code === 200) {
                        this.applyTypeArray = response.body.result;
                        this.selectedDatafirst = parseInt(
                            this.getCookie("leaveType")
                        );
                    }
                },
                response => {
                    console.log("error callback");
                }
            );

            //获取忘记打卡时间列表
            this.$http.get("/api/v1.0/client/queryAttendTime").then(
                response => {
                    this.attendtime = response.body.result;
                },
                response => {
                    console.log("error callback");
                }
            );

            //假期分类
            this.$http.get("/api/v1.0/client/findValidLeaves").then(
                response => {
                    this.holidayTypeArray = response.body.result;
                },
                response => {
                    console.log("假期分类 error callback");
                }
            );
        },
        // 选择审批人
        /*selectperson(row, event, column){
        this.selectperData = row.NAME;
        this.showperson = false;
        this.showpersonstyle = true;
      },*/
        // 选择审批人
        /*selectpersontwo(row, event, column){
        // this.selectperData = row.NAME;
        this.approveAllData.category = '1';
        this.approveAllData.currentApprover = row.UID;
        this.approveAllData.email = '';
        this.showpersontwo = false;
      },*/
        //根据审批类型返回的审批表单
        shengqingclick(approvalType, index) {
            this.posIndex = index; //当前是第几个申请记录
            // this.selectedDataApply = approvalType;  //申请分类类型
            let currIndex = index;
            let state = false;
            for (let i = 0; i < this.applyTypeArray.length; i++) {
                if (
                    this.selectedDataApply[index] ===
                    this.applyTypeArray[i].type
                ) {
                    this.applyData.approvalTypeUid = this.applyTypeArray[i].uid; //申请分类类型的uid
                    state = true;
                }
            }
            if (!state) {
                this.selectedDataApply[index] = this.applyTypeArray[0].type;
                this.applyData.approvalTypeUid = this.applyTypeArray[0].uid;
            }
            if (index == -1) {
                index = 0;
            }

            this.$http
                .get(
                    "/api/v1.0/client/queryApprovalForm/" +
                        this.selectedDataApply[index]
                )
                .then(
                    response => {
                        if (response.body.code === 200) {
                            this.fieldsdata = response.body.result;
                            let configType = response.body.result.configType;
                            this.approvalperson(
                                configType,
                                this.selectedDataApply[index]
                            ); //单个申请审批人不需要显示
                            this.applyData.approvalConfigUid =
                                response.body.result.uid; //具体流程的uid

                            //处理提交的表单数据格式
                            let approvalValues = [];
                            let periodnum = 0;
                            this.fields = [];
                            this.applyWorkRef = [];
                            for (
                                let i = 0;
                                i < this.fieldsdata.fields.length;
                                i++
                            ) {
                                let item = this.fieldsdata.fields[i];
                                if (
                                    this.selectedDataApply[index] == "2" &&
                                    item.defaultType == "43"
                                ) {
                                    this.approvaloutside(item.defaultType);
                                }
                                if (item.fieldType == "7") {
                                    let itemtmp = {};
                                    this.perioduid = item.uid;
                                    let timearr = [
                                        {
                                            startTime: "",
                                            endTime: "",
                                            uid: item.uid
                                        }
                                    ];
                                    let numIndex =
                                        this.searchApplyRecord.length - 1;
                                    this.$set(
                                        this.applyWorkRefAll,
                                        (
                                            this.daycurrent +
                                            numIndex +
                                            item.uid
                                        ).toString(),
                                        timearr
                                    );
                                    this.fields.push(item);
                                } else if (
                                    item.fieldType == "3" ||
                                    item.fieldType == "4" ||
                                    item.fieldType == "5"
                                ) {
                                    item.term = 0;
                                    item.sortnumtmp = 0;
                                    (item.valuearray = []),
                                        (item.valuearray2 = []);
                                    let numIndex = parseInt(
                                        this.searchApplyRecord.length - 1
                                    );
                                    if (item.code == "punchTime") {
                                        //忘记打卡
                                        if (item.approvalValues.length > 0) {
                                            for (
                                                let j = 0;
                                                j < item.approvalValues.length;
                                                j++
                                            ) {
                                                let appfieldval =
                                                    item.approvalValues[j];
                                                item.valuearray.push(
                                                    appfieldval.value
                                                );
                                            }
                                        }
                                        this.$set(
                                            this.confItems,
                                            (
                                                this.daycurrent +
                                                numIndex +
                                                item.uid
                                            ).toString(),
                                            this.attendtime
                                        );
                                        this.$set(
                                            this.confItemsval,
                                            (
                                                this.daycurrent +
                                                numIndex +
                                                item.uid
                                            ).toString(),
                                            item.valuearray
                                        );
                                    } else {
                                        if (
                                            item.approvalFieldValues.length > 0
                                        ) {
                                            for (
                                                let j = 0;
                                                j <
                                                item.approvalFieldValues.length;
                                                j++
                                            ) {
                                                let appfieldval =
                                                    item.approvalFieldValues[j];
                                                if (appfieldval.isDefault) {
                                                    if (item.fieldType == "4") {
                                                        item.valuearray.push(
                                                            appfieldval.value
                                                        );
                                                    } else {
                                                        item.valuearray =
                                                            appfieldval.value;
                                                    }
                                                }
                                            }
                                        }
                                        this.$set(
                                            this.confItems,
                                            (
                                                this.daycurrent +
                                                numIndex +
                                                item.uid
                                            ).toString(),
                                            item.approvalFieldValues
                                        );
                                        this.$set(
                                            this.confItemsval,
                                            (
                                                this.daycurrent +
                                                numIndex +
                                                item.uid
                                            ).toString(),
                                            item.valuearray
                                        ); //默认选中的值
                                    }
                                    this.fields.push(item);
                                } else {
                                    item.term = 0;
                                    item.sortnumtmp = 0;
                                    this.fields.push(item);
                                }
                                if (item.fieldType == "4") {
                                    this.fieldType4 = item;
                                }
                            }
                            this.periodnum = periodnum;
                            this.fieldsdata.approvalFields = this.fields;
                            this.fieldsdata["daycurrent"] = this.daycurrent;
                            let numIndex = parseInt(
                                this.searchApplyRecord.length - 1
                            );
                            this.fieldsdata["daysortnum"] = numIndex;
                            if (
                                this.fieldsdata.approvalType == 1 &&
                                this.fieldsdata.attendRuleUid == 1
                            ) {
                                this.$set(this.fieldsdata, "forgetTime", [
                                    {
                                        date: "",
                                        start: "",
                                        end: "",
                                        checkStart: false,
                                        checkEnd: false
                                    }
                                ]);
                            }
                            this.searchApplyRecord[index] = this.fieldsdata;
                        }
                    },
                    response => {
                        //        console.log('error callback');
                    }
                );
        },
        //获取审批人列表
        approvalperson(configType, approvalType) {
            this.$http.get("/api/v1.0/client/findReporter/" + configType).then(
                response => {
                    let data = response.body.result;
                    if (response.body.result != null) {
                        if (configType == "0") {
                            this.approvalTypeObj = data;
                            this.applyData.category = data.WAY; // 审批人类型,1或者2
                            this.approveAllData.category = data.WAY;
                            if (data.WAY == "1") {
                                this.applyData.currentApprover = data.UID;
                                this.approveAllData.currentApprover = data.UID;
                                this.approveAllData.email = "";
                            } else if (data.WAY == "2") {
                                this.applyData.email = data.NAME;
                                this.approveAllData.currentApprover = "";
                                this.approveAllData.email = data.NAME;
                            }
                        } else if (configType == "1") {
                            if (approvalType == "-1") {
                                this.approveAllData.category = 1;
                                this.approvalTypeObjtwo = data;
                            } else {
                                this.approvalTypeObj = data;
                            }
                        }
                    } else {
                        this.approveAllData.category = "";
                        this.approveAllData.currentApprover = "";
                        this.approveAllData.email = "";
                    }
                },
                response => {
                    //console.log('error callback');
                }
            );
        },
        //获取外出类型列表
        approvaloutside(configType) {
            this.$http.get("/api/v1.0/common/config/" + configType).then(
                response => {
                    let data = response.body.result;
                    this.outsideObj = data;
                },
                response => {
                    //console.log('error callback');
                }
            );
        },
        //添加加班时间段
        addTime(uid, index) {
            this.applyWorkRefAll[
                (this.daycurrent + index + uid).toString()
            ].push({
                startTime: "",
                endTime: "",
                uid: uid
            });
        },
        //删除加班时间段
        deleteTime(num, uid, index) {
            this.applyWorkRefAll[
                (this.daycurrent + index + uid).toString()
            ].splice(num, 1);
        },
        closeDatepicker() {
            this.openTouch();
        },
        // 开始时间格式化
        handleConfirmStart(data) {
            if (this.fieldTypecurr === "7") {
                this.applyWorkRefAll[
                    (this.daycurrent + this.posIndex + this.uid).toString()
                ][this.pos].startTime = moment(data).format(df);
            } else if (this.fieldTypecurr === "6") {
                this.$set(
                    this.searchApplyRecord[this.posIndex].approvalFields[
                        this.currfieldIndex
                    ],
                    "value",
                    moment(data).format(df3)
                );
                this.tmpnumber = 2;
            }
            this.openTouch();
        },
        // 结束时间格式化
        handleConfirmEnd(data) {
            if (this.fieldTypecurr === "7") {
                this.applyWorkRefAll[
                    (this.daycurrent + this.posIndex + this.uid).toString()
                ][this.pos].endTime = moment(data).format(df);
            } else if (this.fieldTypecurr === "6") {
                this.$set(
                    this.searchApplyRecord[this.posIndex].approvalFields[
                        this.currfieldIndex
                    ],
                    "value",
                    moment(data).format(df3)
                );
                this.tmpnumber = 2;
            }
            this.openTouch();
        },
        //日历样式
        openPicker(type, pos, fieldType, index, fieldIndex, uid, itemCode) {
            this.uid = uid;
            this.pos = pos;
            this.posIndex = index;
            this.currfieldIndex = fieldIndex;
            this.fieldTypecurr = fieldType;
            this.wordcodecurr = itemCode;
            if (fieldType == "6") {
                let displaytime = this.searchApplyRecord[index].approvalFields[
                    fieldIndex
                ].value;
                this.startTimeValue1 = displaytime
                    ? new Date(moment(displaytime).format(df4))
                    : new Date();
                this.$refs.picker0.open();
            } else if (fieldType == "7") {
                if (type == 0) {
                    if (
                        this.applyWorkRefAll[
                            (this.daycurrent + index + this.uid).toString()
                        ][this.pos].startTime
                    ) {
                        this.startTimeValue1 = new Date(
                            moment(
                                this.applyWorkRefAll[
                                    (
                                        this.daycurrent +
                                        index +
                                        this.uid
                                    ).toString()
                                ][this.pos].startTime
                            ).format(df4)
                        );
                    } else {
                        this.startTimeValue1 = new Date();
                    }
                    this.$refs.picker0.open();
                } else if (type == 1) {
                    if (
                        this.applyWorkRefAll[
                            (this.daycurrent + index + this.uid).toString()
                        ][this.pos].endTime
                    ) {
                        this.endTimeValue1 = new Date(
                            moment(
                                this.applyWorkRefAll[
                                    (
                                        this.daycurrent +
                                        index +
                                        this.uid
                                    ).toString()
                                ][this.pos].endTime
                            ).format(df4)
                        );
                    } else {
                        this.endTimeValue1 = new Date();
                    }
                    this.$refs.picker1.open();
                }
            }
            this.closeTouch();
        },
        // 加班段数格式化
        overtimeNum(num) {
            return typeof num === "number" ? num + 1 : "";
            // let arr = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
            // return arr[num];
        },
        //提交申请
        handerDataSubmit() {
            Indicator.open("正在提交申请...");
            let approvalValues = [];
            for (let i = 0; i < this.fields.length; i++) {
                let item = this.fields[i];
                if (
                    item.fieldType != "7" &&
                    item.fieldType != "3" &&
                    item.fieldType != "4" &&
                    (item.fieldType != "5" ||
                        item.code == "outType" ||
                        item.code == "leaveType")
                ) {
                    approvalValues.push({
                        approvalFieldUid: item.uid,
                        value: item.value,
                        term: item.term,
                        sortnum: item.sortnumtmp
                    });
                } else {
                    if (
                        item.fieldType == "3" ||
                        (item.fieldType == "5" && item.code != "outType")
                    ) {
                        //单选框
                        approvalValues.push({
                            approvalFieldUid: item.uid,
                            value: this.confItemsAllval[i.toString()][item.uid],
                            term: 0,
                            sortnum: 0
                        });
                    } else if (item.fieldType == "4") {
                        //多选框
                        for (
                            let j = 0;
                            j <
                            this.confItemsAllval[i.toString()][item.uid].length;
                            j++
                        ) {
                            approvalValues.push({
                                approvalFieldUid: item.uid,
                                value: this.confItemsAllval[i.toString()][
                                    item.uid
                                ][j],
                                term: 0,
                                sortnum: j
                            });
                        }
                    }
                }
            }

            //处理item.fieldType="7"日期时间段的数据
            let periodarr = [];
            for (let i = 0; i < this.applyWorkRef.length; i++) {
                let item = this.applyWorkRef[i];
                for (let j = 0; j < 2; j++) {
                    let timecurr;
                    if (j == 0) {
                        timecurr = item.startTime;
                    } else if (j == 1) {
                        timecurr = item.endTime;
                    }
                    periodarr.push({
                        approvalFieldUid: item.uid,
                        value: timecurr,
                        term: i,
                        sortnum: j
                    });
                }
            }
            this.applyData.approvalValues = approvalValues.concat(periodarr);
            this.$http.post("/api/v1.0/client/apply", this.applyData).then(
                response => {
                    //提交请假申请
                    Indicator.close(); //申请提交成功
                    this.codeSuccess = response.body.code;
                    this.leaveSuccess = true;
                    if (response.body.code === 200) {
                        this.alertSuccessImage = true;
                        this.alertMessage = response.body.message;
                    } else {
                        this.alertSuccessImage = false;
                        this.alertMessage = response.body.message;
                    }
                },
                response => {
                    //          console.log('error callback');
                }
            );
        },
        qingjiaclick(value, index, fieldIndex, uid) {
            if (value) {
                if (value.TYPE == "6") {
                    this.searchApplyRecord[index].isthingtype = true;
                } else {
                    this.searchApplyRecord[index].isthingtype = false;
                }
            }
        },
        // 打开查看附件弹框
        lookImages(imgSrc) {
            if (imgSrc) this.popImgSrc = imgSrc;
            else this.popImgSrc = "";
            this.popupVisible = true;
        },
        // 关闭查看附件弹框
        closeImage() {
            this.popupVisible = false;
        },
        // 格式化申请记录中的日期
        datefmt(str) {
            if (str) return moment(str).format(df);
            else return "";
        },
        //提交成功的弹框
        closeAlert() {
            this.leaveSuccess = false;
            if (this.codeSuccess === 200) {
                this.$router.push({ path: "/signCard" });
            }
        },
        // 上传图片成功
        passportUrlOk(res, file) {
            if (res.code === 200) {
                for (let i = 0; i < this.fields.length; i++) {
                    let item = this.fields[i];
                    if (item.fieldType == "8") {
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
        //通过或拒绝
        isPass(item, type) {
            let url, text;
            if (type === 1) {
                //通过
                url = "/api/v1.0/client/agree";
                text = "是否同意当前审批？";
            } else if ((type = 2)) {
                //拒绝
                url = "/api/v1.0/client/refuse/" + item.uid;
                text = "是否拒绝当前审批？";
            }
            MessageBox.confirm(text, "提示").then(action => {
                // Indicator.open('正在处理中...');
                let arr = [];
                arr.push(item.uid);
                if (type === 1) {
                    //通过
                    if (this.configType == "1") {
                        //0 是自动,  1 是自由
                        // this.currentItem = item;
                        this.hasNextperson = true;
                        // this.approvalperson(item.configType);
                    } else if (this.configType == "0") {
                        //自动审批
                        let params = {
                            // applyUid: item.uid,  //申请uid
                            applyUids: arr, //申请uid
                            status: 1, //状态（0待审批，1同意，3拒绝）
                            nextApprover: "", //下一个审批人uid 自定义流程使用
                            flowWhy: item.why //原因
                            // currentLoginUser: item.parentUid //当前登录人uid 用于判断是否是管理员审批
                        };
                        this.$http.post(url, params).then(
                            response => {
                                //提交请假申请
                                // Indicator.close();
                                if (response.body.code === 200) {
                                    MessageBox("提示", "操作成功");
                                    this.$router.push({ path: "/approve" });
                                } else {
                                    MessageBox("提示", "操作失败");
                                }
                            },
                            response => {
                                //                console.log('error callback');
                            }
                        );
                    }
                } else if ((type = 2)) {
                    //拒绝
                    this.$http.get(url).then(
                        response => {
                            //提交请假申请
                            // Indicator.close();
                            if (response.body.code === 200) {
                                MessageBox("提示", "操作成功");
                                this.$router.push({ path: "/approve" });
                            } else {
                                MessageBox("提示", "操作失败");
                            }
                        },
                        response => {
                            //          console.log('error callback');
                        }
                    );
                }
            });
        },
        // 选择审批人
        selectperson(row, event, column) {
            this.selectperData = row.NAME;
            this.hasNextperson = false;
            this.showperson = false;

            let arr = [];
            arr.push(this.approveAllData.uid);
            let params = {
                applyUids: arr, //申请uid
                status: 0, //状态（0待审批，1同意，3拒绝）
                nextApprover: row.UID, //下一个审批人uid 自定义流程使用
                flowWhy: this.approveAllData.why //原因
            };
            let url = "/api/v1.0/client/agree";
            this.$http.post(url, params).then(
                response => {
                    //提交请假申请
                    // Indicator.close();
                    if (response.body.code === 200) {
                        this.changeShow("0");
                        MessageBox("提示", "操作成功");
                    } else {
                        MessageBox("提示", "操作失败");
                    }
                },
                response => {
                    //          console.log('error callback');
                }
            );
        },
        showMsg(msg, number) {
            this.leaveSuccess = true;
            if (number == 1) {
                this.alertSuccessImage = true;
            } else if (number == -1) {
                this.alertSuccessImage = false;
            }
            this.alertMessage = msg;
            let that = this;
            setTimeout(() => {
                that.leaveSuccess = false;
            }, 2000);
        },
        //上传图片文件
        updateImgFile(data) {
            let approvalFieldValues = this.searchApplyRecord[
                data.position.index
            ].approvalFields[data.position.fieldIndex].approvalFieldValues;
            if (approvalFieldValues.length == 1) {
                if (
                    approvalFieldValues[0].value == null ||
                    approvalFieldValues[0].value == "null" ||
                    approvalFieldValues[0].value == "" ||
                    approvalFieldValues[0].value == undefined
                ) {
                    this.searchApplyRecord[data.position.index].approvalFields[
                        data.position.fieldIndex
                    ].approvalFieldValues = [
                        {
                            selected: false,
                            url: data.url,
                            value: data.url,
                            width: 0,
                            height: 0
                        }
                    ];
                } else {
                    this.searchApplyRecord[data.position.index].approvalFields[
                        data.position.fieldIndex
                    ].approvalFieldValues.push({
                        selected: false,
                        url: data.url,
                        value: data.url,
                        width: 0,
                        height: 0
                    });
                }
            } else {
                this.searchApplyRecord[data.position.index].approvalFields[
                    data.position.fieldIndex
                ].approvalFieldValues.push({
                    selected: false,
                    url: data.url,
                    value: data.url,
                    width: 0,
                    height: 0
                });
            }
        },
        showUpdateError(data) {
            this.showMsg(data.fieldHint, -1);
        },
        //查看图片
        queryImg(e, list) {
            fancyBox(e.target, list);
        },
        //编辑操作
        editImg(index, fieldIndex) {
            V.set(
                this.searchApplyRecord[index].approvalFields[fieldIndex],
                "fileEdit",
                true
            );
            this.searchApplyRecord[index].approvalFields[
                fieldIndex
            ].fileEdit = true;
        },
        //取消删除文件
        cancelEditImg(index, fieldIndex) {
            V.set(
                this.searchApplyRecord[index].approvalFields[fieldIndex],
                "fileEdit",
                false
            );
            this.searchApplyRecord[index].approvalFields[
                fieldIndex
            ].fileEdit = false;
        },
        //编辑状态，删除文件
        deleteFile(index, fieldIndex) {
            let list = this.searchApplyRecord[index].approvalFields[fieldIndex]
                .approvalFieldValues;
            for (let i = 0; i < list.length; i++) {
                if (list[i].selected) {
                    list.splice(i, 1);
                    i--;
                }
            }
            this.searchApplyRecord[index].approvalFields[fieldIndex]
                .approvalFieldValues;
            this.cancelEditImg(index, fieldIndex);
        },
        //选择删除的文件
        selectImg(list, i) {
            V.set(list[i], "selected", !list[i].selected);
        },
        getExtType,
        closeTouch() {
            document
                .getElementsByTagName("body")[0]
                .addEventListener("touchmove", this.handler, {
                    passive: false
                }); //阻止默认事件
        },
        openTouch() {
            document
                .getElementsByTagName("body")[0]
                .removeEventListener("touchmove", this.handler, {
                    passive: false
                }); //打开默认事件
        },
        //当输入框失去焦点，页面自动滚动到顶部原来的位置
        inputblur() {
            setTimeout(() => {
                let scrollHeight =
                    document.documentElement.scrollTop ||
                    document.body.scrollTop ||
                    0;
                window.scrollTo(0, Math.max(scrollHeight - 1, 0));
            }, 100);
        },
        // 处理忘记打卡时的选择日期和忘记打卡时间
        formatPunchCardData(data) {
            const [
                { approvalValues: tmpDateArr, fieldName: dateName }
            ] = _.filter(data, ["fieldType", "6"]);
            const [
                { approvalValues: tmpTimeArr, fieldName: timeName }
            ] = _.filter(data, ["fieldType", "4"]);

            const out = [];
            if (tmpDateArr.length) {
                tmpDateArr
                    .map(({ value, term: group, sortnum: idx }) => ({
                        value,
                        group: Number(group),
                        idx
                    }))
                    .forEach(({ value, group, idx }) => {
                        out[group] = {
                            dateName,
                            timeName,
                            date: value,
                            time: []
                        };
                    });
            }

            if (tmpTimeArr.length) {
                tmpTimeArr
                    .map(({ value, term: group, sortnum: idx }) => ({
                        value,
                        group: Number(group),
                        idx
                    }))
                    .forEach(({ value, group, idx }) => {
                        out[group].time[idx] = value;
                    });
            }

            return out;
        }
    },
    components: {
        fullCalendar,
        uploadImage
    }
};
</script>

<style lang="scss">
.attendwhite {
    background: #fff;
    padding-bottom: 10px;
    .inputtext {
        height: 48px;
        width: 98%;
    }
    .i-hd {
        margin-bottom: 0.75em;
    }
    // 复写mint ui 组件
    .picker-items {
        display: block;
        width: 100%;
        font-size: 12px !important;
        text-align: center;
        .picker-slot {
            flex: none !important;
            display: inline-block;
            width: 18%;
            font-size: 12px !important;
        }
        .picker-item {
            font-size: 12px !important;
        }
    }
    .attendDetail {
        background: #f2f2f2;
        margin: 15px 20px;
        font-size: 12px;
        padding: 5px 8px;
        p {
            text-align: left;
            line-height: 25px;
            &::after {
                content: "";
                display: block;
                height: 0;
                clear: both;
            }
            span {
                display: inline-block;
                width: 50%;
                &:nth-child(1) {
                    float: left;
                }
                &:nth-child(1) {
                    float: left;
                }
            }
        }
    }
    .abnormalattend {
        padding: 0 20px;
        p {
            text-align: left;
            line-height: 25px;
            font-size: 12px;
        }
    }
    .reviseapply {
        border-top: 1px solid #f2f2f2;
        margin: 15px 20px 25px 20px;
        .revisetop {
            height: 30px;
            line-height: 30px;
            font-size: 14px;
            text-align: left;
            .editapply {
                color: #26a2ff;
                float: right;
            }
        }
        .revisecont {
            text-align: left;
            .revisecontone {
                p {
                    padding: 0 0 0 10px;
                    font-size: 12px;
                    line-height: 25px;
                    span {
                        &:nth-child(2) {
                            margin-left: 20px;
                        }
                    }
                }
                .submitattend {
                    margin-top: 20px;
                    .btnattend {
                        font-size: 15px;
                        width: 100%;
                    }
                }
            }
            .reviseconttwo {
                .revisecontmid {
                    min-height: 100px;
                    .deleteRecord {
                        .btndeleteRecord {
                        }
                    }
                }
                .reviseitem {
                    line-height: 25px;
                    margin-top: 5px;
                    &:after {
                        content: "";
                        display: block;
                        height: 0;
                        clear: both;
                    }
                    &:nth-child(2) {
                        margin-top: 10px;
                    }
                    .reviseitemlft {
                        width: 20%;
                        float: left;
                        font-size: 12px;
                    }
                    .reviseitemrgt {
                        width: 80%;
                        float: left;
                        font-size: 12px;
                        .timeinput {
                            width: 30%;
                            border: 1px solid #dedede;
                            border-radius: 3px;
                            height: 20px;
                            line-height: 20px;
                            margin-right: 8px;
                            outline: none;
                            padding: 0 5px;
                        }
                        .inputarea {
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
                    background: url("../../assets/arrow_2.png") no-repeat scroll
                        right center transparent;
                    background-size: 15px;
                    padding-right: 20px;
                    option {
                        color: black;
                    }
                }
                .revisebtm {
                    &:after {
                        content: "";
                        display: block;
                        height: 0;
                        clear: both;
                    }
                    .revisebtmlft {
                        width: 40%;
                        float: left;
                        .btncancel {
                            font-size: 14px;
                            width: 100%;
                        }
                    }
                    .revisebtmrgt {
                        width: 56%;
                        margin-left: 4%;
                        float: left;
                        .btnsave {
                            font-size: 14px;
                            width: 100%;
                        }
                    }
                }
            }
        }
    }
    .timetitdate {
        &:before {
            content: "";
            margin-right: 10px;
        }
    }
}

.approveperson {
    .persontit {
        font-size: 12px;
        padding: 10px 0;
        text-align: center;
    }
    .personcont {
        .persontable {
            font-size: 12px;
        }
    }
}

.btnattend {
    font-size: 15px;
    width: 80%;
    margin: 0 auto 20px auto;
}

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

.leavecontInfo {
    font-size: 14px;
    line-height: 16px;
    .marginTop10 {
        margin-top: 10px;
    }
    h3 {
        font-size: 14px;
        color: #20a0ff;
    }
    p {
        margin-top: 5px;
        color: #324057;
        padding: 0 !important;
        line-height: 16px !important;
        font-size: 14px !important;
    }
}

.leave-main-box {
    padding: 0 0 15px 0;
    .leaveboxlft:before {
        content: "";
        margin-right: 10px;
    }
    .icon-stars:before {
        content: "*" !important;
        color: #ff4949 !important;
        margin-right: 4px !important;
    }
    .leave-main-box-del {
        transform: rotate(45deg) scale(2.4);
        display: inline-block;
        position: absolute;
        right: 0;
        top: 10px;
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
                background: url("../../assets/arrow_2.png") no-repeat scroll
                    right center transparent;
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
            &:before {
                content: "";
                margin-right: 10px;
            }
        }
        textarea {
            box-sizing: border-box;
            padding: 10px;
            outline: none;
            overflow: hidden;
            overflow-y: scroll;
            width: 96%;
            height: 70px;
            border-radius: 4px;
            resize: none;
            margin-left: 6px;
        }
    }
    .leaveboxBtn {
        margin-top: 20px;
        width: 100%;
        .leaveboxBtn-btn {
            width: 60%;
            font-size: 15px;
            margin: 0 auto;
            display: block;
        }
    }
}
.attendcont {
    /*border-top: 1px solid #CCCCCC;*/
    /*border-bottom: 1px solid #CCCCCC;*/
}
.leave-main-box .fc1 {
    color: #457aa3;
    padding-top: 10px;
}
.mint-button--normal {
    height: 33px;
    margin: 10px auto 0 auto;
    display: block;
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
.attendbutton {
    padding: 0 0 20px 0;
    &:after {
        content: "";
        height: 0;
        display: block;
        clear: both;
    }
    .btnagree {
        width: 45%;
        float: left;
    }
    .btnrefuse {
        width: 45%;
        float: right;
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
