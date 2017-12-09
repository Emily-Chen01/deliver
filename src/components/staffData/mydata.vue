<template>
  <div id="MyData" v-if="status">
    <div class="my-data">
      <mt-navbar fixed v-model="selected" class="dataTitle">
        <mt-tab-item id="1"><span>个人资料</span></mt-tab-item>
        <mt-tab-item id="2"><span>岗位信息</span></mt-tab-item>
      </mt-navbar>
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="1">
          <div v-if="selected==='1'">
            <el-form label-position="left" :model="staffInfoName" :rules="rulesStaffInfoName" :label-width="labelWidth"
                     style="padding-bottom: 10px"
                     ref="personFm">
              <div v-for="(item,index) in staffInfo" v-if="item.isvisible">
                <div v-if="item.isDefined">
                  <!--文本-->
                  <el-form-item v-if="item.fieldType===1" :label="item.remark" :prop="item.uid+'[0].value'"
                                :rules=" [{message: '请输入正确的'+item.remark+'('+textType[item.javaValidexp]+')', pattern: patt[item.javaValidexp], trigger: 'blur'},
            {message: `最多${item.characterLimit}个字符`,max:item.characterLimit, validator: isLength, trigger: 'blur'}
          ]">
                    <el-input :disabled="!item.isedit" :placeholder="item.defaultTips"
                              v-model="staffInfoName[item.uid][0].value"></el-input>
                  </el-form-item>
                  <!--日期-->
                  <el-form-item v-if="item.fieldType===2" :label="item.remark">
                    <p class="pl10" v-if="item.isedit"
                       v-text="staffInfoName[item.uid][0].value ? datefmt(parseInt(staffInfoName[item.uid][0].value)):item.defaultTips "
                       @click="openPicker(0,item.uid,0,parseInt(staffInfoName[item.uid][0].value))"></p>
                    <p class="pl10 fc-bbb" v-else
                       v-text="staffInfoName[item.uid][0].value ? datefmt(staffInfoName[item.uid][0].value):item.defaultTips "></p>
                  </el-form-item>
                  <!--纯数字-->
                  <el-form-item v-if="item.fieldType===3" :label="item.remark" :prop="item.uid+'[0].value'"
                                :rules=" [{message: `请输入正确的${item.remark}(只能输入数字)`, pattern: patt['type3'], trigger: 'blur'},
            {message: `必须是大于0，小于或等于${Math.pow(10, item.characterLimit) - 1}的数字`,max:item.characterLimit, validator: isSize, trigger: 'blur'}
          ]">
                    <el-input :disabled="!item.isedit" :placeholder="item.defaultTips"
                              v-model="staffInfoName[item.uid][0].value"></el-input>
                  </el-form-item>
                  <!--列表-->
                  <el-form-item v-if="item.fieldType===4" :label="item.remark">
                    <select :disabled="!item.isedit"
                            v-model="staffInfoName[item.uid][0].value"
                            :class="{'option-color':!staffInfoName[item.uid][0].value}">
                      <option :value="''||null" disabled>{{item.defaultTips}}</option>
                      <option v-for="(v, k) in item.optionConfigs" :key="k" v-text="v.name" :value="v.uid"></option>
                    </select>
                  </el-form-item>
                  <!--单选框-->
                  <el-form-item v-if="item.fieldType===5" :label="item.remark">
                    <el-radio-group v-model="staffInfoName[item.uid][0].value">
                      <el-radio v-for="(v, k) in item.optionConfigs" :label="v.uid" :key="v">{{v.name}}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <!--多选框-->
                  <el-form-item v-if="item.fieldType===6" :label="item.remark">
                    <el-checkbox-group v-model="staffInfoName[item.uid].arr" @change="checkList(item.uid)">
                      <el-checkbox v-for="(v, k) in item.optionConfigs" :label="v.uid" :key="k">
                        <span>{{v.name}}</span>
                      </el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                  <!--图片上传、文件上传-->
                  <el-form-item v-if="item.fieldType===7||item.fieldType===8" :label="item.remark">
                    <div class="upload-btn" v-if="item.isedit && !staffInfoName[item.uid].edit">
                      <uploadImage @update="_upload"
                                   :child="{name:item.uid,type:item.fieldType,value:staffInfoName[item.uid].info}"></uploadImage>
                    </div>
                    <el-button size="small"
                               v-if="item.isedit && !staffInfoName[item.uid].edit && staffInfoName[item.uid].info.value.length"
                               @click="resumeDel(item.uid,staffInfoName[item.uid].edit)"
                               class="upload-img-delBtn">
                      <span><i class="el-icon-delete"></i>删除</span>
                    </el-button>
                    <el-button type="danger" size="small" v-if="item.isedit && staffInfoName[item.uid].edit"
                               @click="resumeConfirm(item.uid,staffInfoName[item.uid].edit)">
                      <span><i class="el-icon-delete"></i>确定删除</span>
                    </el-button>
                    <el-button size="small" v-if="item.isedit && staffInfoName[item.uid].edit"
                               @click="resumeCancel(staffInfoName[item.uid].edit,item.uid)">
                      <span><i class="el-icon-circle-cross"></i>取消</span>
                    </el-button>
                    <el-button type="primary" size="small" v-if="!item.isedit"
                               :disabled="!item.isedit">
                      <span><i class="el-icon-upload"></i>上传照片</span>
                    </el-button>
                    <el-button size="small" v-if="!item.isedit && staffInfoName[item.uid].info.value.length"
                               :disabled="!item.isedit">
                      <span><i class="el-icon-delete"></i>删除</span>
                    </el-button>
                    <div v-if="staffInfoName[item.uid].info.value.length && staffInfoName[item.uid].info.value[0].value"
                         class="upload-img-wrapper">
                      <div v-if="item.fieldType===7" v-for="(ite, idx) in staffInfoName[item.uid].info.value"
                           class="upload-img-box"
                           @click="imageScaleOpen(ite.value,4,idx,item.uid)">
                        <img :src="ite.value"/>
                        <img src="../../assets/ico_select_1.png"
                             class="upload-img-icon"
                             v-if="staffInfoName[item.uid].edit && !staffInfoName[item.uid].info.value[idx].state"
                             alt="">
                        <img src="../../assets/ico_select_2.png"
                             class="upload-img-icon"
                             v-if="staffInfoName[item.uid].edit && staffInfoName[item.uid].info.value[idx].state"
                             alt="">
                      </div>
                      <div v-if="item.fieldType===8" v-for="(ite, idx) in staffInfoName[item.uid].info.value"
                           class="upload-img-box"
                           @click="imageScaleOpen(ite.value,5,idx,item.uid)">
                        <div class="upload-document-box">
                          <div v-if="staffInfoName[item.uid].edit"
                               :class="{'upload-document-main':staffInfoName[item.uid].edit}">
                            <img class="upload-img-document" src="../../assets/ico_document.png" alt="">
                            <!--<span>已上传</span>-->
                          </div>
                          <a v-else :href="(fileUrl(ite.value)+  '&openid=' + tokenHeader.openId)">
                            <div :class="{'upload-document-main':staffInfoName[item.uid].edit}">
                              <img class="upload-img-document" src="../../assets/ico_document.png" alt="">
                              <!--<span>已上传</span>-->
                            </div>
                          </a>
                          <img src="../../assets/ico_select_1.png"
                               class="upload-img-icon"
                               v-if="staffInfoName[item.uid].edit && !staffInfoName[item.uid].info.value[idx].state"
                               alt="">
                          <img src="../../assets/ico_select_2.png"
                               class="upload-img-icon"
                               v-if="staffInfoName[item.uid].edit && staffInfoName[item.uid].info.value[idx].state"
                               alt="">
                        </div>
                      </div>
                    </div>
                  </el-form-item>
                </div>
                <div v-else>
                  <div v-if="item.jname==='podoMessage'">
                    <el-form-item label="户口省份" :prop="item.jname+'.podoProvince'"
                                  :rules="{required: item.isrequired, message: '请选择户口所在省份', trigger: 'change'}">
                      <select :disabled="!item.isedit" v-model="staffInfoName[item.jname].podoProvince"
                              @change="queryCities(item.value.podoProvince,'podoMessage')"
                              :class="{'option-color':!staffInfoName[item.jname].podoProvince}">
                        <option value="" disabled>请选择户口省份</option>
                        <option v-for="p in provinces" :key="p.uid" v-text="p.name" :value="p.uid"></option>
                      </select>
                    </el-form-item>

                    <el-form-item label="户口城市" :prop="item.jname+'.podoCity'"
                                  :rules="{required: item.isrequired, message: '请选择户口所在城市', trigger: 'change'}">
                      <select :disabled="!item.isedit" v-model="staffInfoName[item.jname].podoCity"
                              :class="{'option-color':!staffInfoName[item.jname].podoCity}">
                        <option value="" disabled>请选择户口城市</option>
                        <option v-for="c in podoCities" :key="c.uid" v-text="c.name" :value="c.uid"></option>
                      </select>
                    </el-form-item>

                    <el-form-item label="户口地址" :prop="item.jname+'.podoAddress'"
                                  :rules="[{required: item.isrequired, message: '请输入正确的户口详细地址', trigger: 'change'},
                        {message: '不能超过256个字符', trigger: 'blur', max: 256}]">
                      <el-input :disabled="!item.isedit" placeholder="请输入户口地址"
                                v-model="staffInfoName[item.jname].podoAddress"></el-input>
                    </el-form-item>

                    <el-form-item label="户口性质" :prop="item.jname+'.typeOfDemicile'"
                                  :rules="{required: item.isrequired, message: '请选择户口性质', trigger: 'change'}">
                      <select :disabled="!item.isedit" v-model="staffInfoName[item.jname].typeOfDemicile"
                              :class="{'option-color':!staffInfoName[item.jname].typeOfDemicile}">
                        <option value="" disabled>请选择户口性质</option>
                        <option v-for="(v, k) in typeOfDemiciles" :key="k" v-text="v.name" :value="v.id"></option>
                      </select>
                    </el-form-item>
                  </div>
                  <div v-else-if="item.jname==='nativePlace'">
                    <el-form-item :label="item.remark" :prop="item.jname+'.nativePlace'"
                                  :rules="{required: item.isrequired, message: '请选择国籍', trigger: 'change'}">
                      <select :disabled="!item.isedit" v-model="staffInfoName[item.jname].nativePlace"
                              :class="{'option-color':!staffInfoName[item.jname].nativePlace}">
                        <option :value="''||null" disabled>请选择国籍</option>
                        <option v-for="(v, k) in nativePlaces" :key="k" v-text="v.name" :value="v.id"></option>
                      </select>
                    </el-form-item>
                    <el-form-item
                      v-if="(staffInfoName[item.jname].nativePlace === '1'||staffInfoName[item.jname].nativePlace === '2')"
                      label="护照编号" :prop="item.jname+'.passportNum'"
                      :rules="[{required: (item.isrequired || (staffInfoName[item.jname].nativePlace !== '0')),  message: '请填写护照号', trigger: 'change'},
                                          {message: '请填写正确的护照号(字母和/或数字)', trigger: 'blur', pattern: /^[A-Za-z0-9]+$/},
                                          {message: '不能超过64个字符', trigger: 'blur', max: 64}]">
                      <el-input :disabled=" !item.isedit" placeholder="请输入护照编号"
                                v-model="staffInfoName[item.jname].passportNum"></el-input>
                    </el-form-item>
                    <el-form-item
                      v-if="(staffInfoName[item.jname].nativePlace === '1'||staffInfoName[item.jname].nativePlace === '2')"
                      label="护照照片" :prop="item.jname+'.passportUrl'"
                      :rules="{required: item.isrequired, message: '请上传护照照片', trigger: 'blur'}">
                      <uploadImage v-if="item.isedit" @update="_upload"
                                   :child="{name:'nativePlace.passportUrl',type:0}"></uploadImage>
                      <el-button type="primary" size="small" v-if="!item.isedit"
                                 :disabled="!item.isedit">
                        <span><i class="el-icon-upload"></i>上传照片</span>
                      </el-button>
                      <div v-if="staffInfoName[item.jname].passportUrl" class="upload-img-wrapper">
                        <img :src="staffInfoName[item.jname].passportUrl"
                             @click="imageScaleOpen(staffInfoName[item.jname].passportUrl,0,0)"/>
                      </div>
                    </el-form-item>
                    <el-form-item v-if="staffInfoName[item.jname].nativePlace === '2'"
                                  label="护照国家" :prop="item.jname+'.state'"
                                  :rules="{required: item.isrequired, message: '请选择护照国家', trigger: 'change'}">
                      <select :disabled=" !item.isedit" v-model="staffInfoName[item.jname].state"
                              :class="{'option-color':!staffInfoName[item.jname].state}">
                        <option :value="''||null" disabled>请选择护照国家</option>
                        <option v-for="ite in states" :key="ite.id" v-text="ite.name" :value="ite.id"></option>
                      </select>
                    </el-form-item>
                  </div>
                  <div v-else-if="item.jname==='politicsStatus'">
                    <el-form-item :label="item.remark" :prop="item.jname+'.politicsStatus'"
                                  :rules="{required: item.isrequired,message: '请选择政治面貌', trigger: 'change'}">
                      <select :disabled="!item.isedit" v-model="staffInfoName[item.jname].politicsStatus"
                              :class="{'option-color':!staffInfoName[item.jname].politicsStatus}">
                        <option :value="''||null" disabled>请选择{{item.remark}}</option>
                        <option v-for="(v, k) in politicsStatuses" :key="k" v-text="v.name" :value="v.id"></option>
                      </select>
                    </el-form-item>

                    <el-form-item v-if="staffInfoName[item.jname].politicsStatus === '2'" label="入党时间"
                                  :prop="item.jname+'.thePartyTime'"
                                  :rules="{required: item.isrequired,type: 'date',message: '请选择入党时间', trigger: 'change',validator:isDate}">
                      <p class="pl10" v-if="item.isedit"
                         v-text="staffInfoName[item.jname].thePartyTime ? datefmt(staffInfoName[item.jname].thePartyTime):'请选择日期' "
                         @click="openPicker(0,0,0,staffInfoName[item.jname].thePartyTime)"></p>
                      <p class="pl10 fc-bbb" v-else
                         v-text="staffInfoName[item.jname].thePartyTime ? datefmt(staffInfoName[item.jname].thePartyTime):'请选择日期'"></p>
                    </el-form-item>
                  </div>
                  <div v-else-if="item.jname==='eduInfor'">
                    <el-form-item label="最高学历" :prop="item.jname+'.maxinumDeucaLevel'"
                                  :rules="{required: item.isrequired, message: '请选择最高学历', trigger: 'blur'}">
                      <select :disabled="!item.isedit" v-model="staffInfoName[item.jname].maxinumDeucaLevel"
                              :class="{'option-color':!staffInfoName[item.jname].maxinumDeucaLevel}">
                        <option value="" disabled>请选择最高学历</option>
                        <option v-for="(v, k) in maxinumDeucaLevels" :key="k" v-text="v.name" :value="v.id"></option>
                      </select>
                    </el-form-item>

                    <el-form-item label="学历类型" :prop="item.jname+'.diplomaType'"
                                  :rules="{required: item.isrequired, message: '请选择学历类型', trigger: 'blur'}">
                      <select :disabled="!item.isedit" v-model="staffInfoName[item.jname].diplomaType"
                              :class="{'option-color':!staffInfoName[item.jname].diplomaType}">
                        <option :value="''||null" disabled>请选择学历类型</option>
                        <option v-for="(v, k) in diplomaTypes" :key="k" v-text="v.name" :value="v.id"></option>
                      </select>
                    </el-form-item>

                    <el-form-item label="毕业院校" :prop="item.jname+'.graduateInst'"
                                  :rules="[{required: item.isrequired, message: '请输入正确的毕业院校', trigger: 'change'},
                        {message: '不能超过64个字符', trigger: 'blur', max: 64}]">
                      <el-input :disabled="!item.isedit" placeholder="请输入毕业院校"
                                v-model="staffInfoName[item.jname].graduateInst"></el-input>
                    </el-form-item>

                    <el-form-item label="入学日期" :prop="item.jname+'.entSchst'"
                                  :rules="{required: item.isrequired,type: 'date', message: '请选择入学日期', trigger: 'change',validator:isDate}">
                      <p class="pl10" v-if="item.isedit"
                         v-text="staffInfoName[item.jname].entSchst ? datefmt1(staffInfoName[item.jname].entSchst):'请选择日期' "
                         @click="openPicker(1,4,0,staffInfoName[item.jname].entSchst)"></p>
                      <p class="pl10 fc-bbb" v-else
                         v-text="staffInfoName[item.jname].entSchst ? datefmt1(staffInfoName[item.jname].entSchst):'请选择日期' "></p>
                    </el-form-item>

                    <el-form-item label="毕业日期" :prop="item.jname+'.entSchet'"
                                  :rules="{required: item.isrequired,type: 'date', message: '请选择毕业日期', trigger: 'change',validator:isDates}">
                      <p class="pl10" v-if="item.isedit"
                         v-text="staffInfoName[item.jname].entSchet ? datefmt1(staffInfoName[item.jname].entSchet):'请选择日期' "
                         @click="openPicker(1,5,0,staffInfoName[item.jname].entSchet)"></p>
                      <p class="pl10 fc-bbb" v-else
                         v-text="staffInfoName[item.jname].entSchet ? datefmt1(staffInfoName[item.jname].entSchet):'请选择日期' "></p>
                    </el-form-item>

                    <el-form-item label="专业" :prop="item.jname+'.major'"
                                  :rules="[{required: item.isrequired,message: '请输入正确的专业名称', trigger: 'change'},
                        {message: '不能超过32个字符', trigger: 'blur',max: 32}]">
                      <el-input :disabled="!item.isedit" placeholder="请输入专业"
                                v-model="staffInfoName[item.jname].major"></el-input>
                    </el-form-item>

                    <el-form-item label="学位证书" :prop="item.jname+'.diplomaUrl'"
                                  :rules="{required: item.isrequired, message: '请上传学位证书照片', trigger: 'blur'}">
                      <uploadImage v-if="item.isedit" @update="_upload"
                                   :child="{name:'eduInfor.diplomaUrl',type:0}"></uploadImage>
                      <el-button type="primary" size="small" v-if="!item.isedit"
                                 :disabled="!item.isedit">
                        <span><i class="el-icon-upload"></i>上传照片</span>
                      </el-button>
                      <div v-if="staffInfoName[item.jname].diplomaUrl" class="upload-img-wrapper">
                        <img :src="staffInfoName[item.jname].diplomaUrl"
                             @click="imageScaleOpen(staffInfoName[item.jname].diplomaUrl,0,0)"/>
                      </div>
                    </el-form-item>

                    <el-form-item label="毕业证书" :prop="item.jname+'.greducaCertUrl'"
                                  :rules="{required: item.isrequired, message: '请上传毕业证书照片', trigger: 'blur'}">
                      <uploadImage v-if="item.isedit" @update="_upload"
                                   :child="{name:'eduInfor.greducaCertUrl',type:0}"></uploadImage>
                      <el-button type="primary" size="small" v-if="!item.isedit"
                                 :disabled="!item.isedit">
                        <span><i class="el-icon-upload"></i>上传照片</span>
                      </el-button>
                      <div v-if="staffInfoName[item.jname].greducaCertUrl" class="upload-img-wrapper">
                        <img :src="staffInfoName[item.jname].greducaCertUrl"
                             @click="imageScaleOpen(staffInfoName[item.jname].greducaCertUrl,0,0)"/>
                      </div>
                    </el-form-item>
                  </div>
                  <div v-else-if="item.jname==='hasChilds'">
                    <el-form-item label="是否有子女">
                      <el-switch
                        :disabled="!item.isedit"
                        v-model="staffInfoName[item.jname].hasChild"
                        on-text="有"
                        off-text="无">
                      </el-switch>
                    </el-form-item>
                    <div class="child-box" v-if="staffInfoName[item.jname].hasChild">
                      <div class="child" v-for="(ite, idx) in staffInfoName[item.jname].childs">
                        <el-form-item label="子女姓名" :prop="item.jname+'.childs['+idx+'].name'" label-position="top"
                                      labelWidth="125px"
                                      :rules="[{required: item.isrequired, message: '请输入子女姓名', trigger: 'change'},
                                    {message: ' 长度小于32个字符', trigger: 'blur', max: 32,}]">
                          <el-input :disabled="!item.isedit" placeholder="请输入子女姓名" v-model="ite.name">
                            <el-button slot="append" v-if="idx > 0" :disabled="!item.isedit"
                                       @click="rmvChild(ite)">
                              <i class="el-icon-delete"></i>
                            </el-button>
                          </el-input>
                        </el-form-item>
                        <el-form-item label="子女性别" :prop="item.jname+'.childs['+idx+'].gender'" labelWidth="125px"
                                      :rules="{required: item.isrequired,type: 'number', message: '请选择子女性别', trigger: 'blur'}">
                          <el-radio-group :disabled="!item.isedit" v-model="ite.gender">
                            <el-radio :label="1">男</el-radio>
                            <el-radio :label="0">女</el-radio>
                          </el-radio-group>
                        </el-form-item>
                        <el-form-item label="子女出生日期" :prop="item.jname+'.childs['+idx+'].dateOfBirth'"
                                      labelWidth="125px"
                                      :rules="{required: item.isrequired,type: 'date', message: '请选择出生日期', trigger: 'blur',validator:isDate}">
                          <p class="pl10" v-if="item.isedit"
                             v-text="ite.dateOfBirth ? datefmt(ite.dateOfBirth):'请选择日期' "
                             @click="openPicker(0,3,idx,ite.dateOfBirth)"></p>
                          <p class="pl10 fc-bbb" v-else v-text="ite.dateOfBirth ? datefmt(ite.dateOfBirth):'请选择日期'"></p>
                        </el-form-item>
                        <el-form-item label="子女出生证明" labelWidth="125px">
                          <uploadImage v-if="item.isedit" @update="_upload"
                                       :child="{name:'hasChilds.childs.birthCertifUrl',type:0,position:idx}"></uploadImage>
                          <el-button type="primary" size="small" v-if="!item.isedit"
                                     :disabled="!item.isedit">
                            <span><i class="el-icon-upload"></i>上传照片</span>
                          </el-button>
                          <div class="child-imgBox">
                            <img class="child-img" v-if="ite.birthCertifUrl" :src="ite.birthCertifUrl"
                                 @click="imageScaleOpen(ite.birthCertifUrl,0,0)"/>
                          </div>
                        </el-form-item>
                        <p class="p10 fs12">如子女不满1周岁需要提供出生证明</p>
                      </div>
                      <el-row>
                        <el-col align="center" :span="24">
                          <el-button class="add-child" type="primary" size="small" :disabled="!item.isedit"
                                     @click="addChild">
                            <span>添加子女</span>
                          </el-button>
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                  <div v-else-if="item.jname==='poreLocation'">
                    <el-form-item label="现居住地省份" :prop="item.jname+'.poreProvince'"
                                  :rules="{required:item.isrequired, message: '请选择现居住地所在省份', trigger: 'change'}">
                      <select :disabled="!item.isedit" v-model="staffInfoName[item.jname].poreProvince"
                              :class="{'option-color':!staffInfoName[item.jname].poreProvince}"
                              @change="queryCities(staffInfoName[item.jname].poreProvince,'poreLocation')">
                        <option value="" disabled>请选择现居住地省份</option>
                        <option v-for="p in provinces" :key="p.uid" v-text="p.name" :value="p.uid"></option>
                      </select>
                    </el-form-item>
                    <el-form-item label="现居住地城市" :prop="item.jname+'.poreCity'"
                                  :rules="{required: item.isrequired,message: '请选择现居住地所在城市', trigger: 'change'}">
                      <select :disabled="!item.isedit" v-model="staffInfoName[item.jname].poreCity"
                              :class="{'option-color':!staffInfoName[item.jname].poreCity}">
                        <option value="" disabled>请选择现居住地城市</option>
                        <option v-for="c in poreCities" :key="c.uid" v-text="c.name" :value="c.uid"></option>
                      </select>
                    </el-form-item>
                    <el-form-item label="现居住地址" prop="poreAddress"
                                  :rules="[{required: item.isrequired,message: '请输入正确的现居住地详细地址', trigger: 'change'},
                        {message: '不能超过 256 个字符', trigger: 'blur', max: 256}]">
                      <el-input :disabled="!item.isedit" placeholder="请输入现居住地址"
                                v-model="staffInfoName[item.jname].poreAddress"></el-input>
                    </el-form-item>
                  </div>
                  <div v-else-if="item.jname==='houregPhoUrl'">
                    <el-form-item label="户口本首页" :prop="item.jname+'.houregPhoUrl'"
                                  :rules="{required: item.isrequired, message: '请上传户口本首页照片', trigger: 'blur'}">
                      <uploadImage v-if="item.isedit" @update="_upload"
                                   :child="{name:'houregPhoUrl.houregPhoUrl',type:0}"></uploadImage>
                      <el-button type="primary" size="small" v-if="!item.isedit"
                                 :disabled="!item.isedit">
                        <span><i class="el-icon-upload"></i>上传照片</span>
                      </el-button>
                      <div v-if="staffInfoName[item.jname].houregPhoUrl" class="upload-img-wrapper">
                        <img :src="staffInfoName[item.jname].houregPhoUrl"
                             @click="imageScaleOpen(staffInfoName[item.jname].houregPhoUrl,0,0)"/>
                      </div>
                    </el-form-item>
                    <el-form-item label="本人户口页" :prop="item.jname+'.houregPerphoUrl'"
                                  :rules="{required: item.isrequired, message: '请上传户口页照片', trigger: 'blur'}">
                      <uploadImage v-if="item.isedit" @update="_upload"
                                   :child="{name:'houregPhoUrl.houregPerphoUrl',type:0}"></uploadImage>
                      <el-button type="primary" size="small" v-if="!item.isedit"
                                 :disabled="!item.isedit">
                        <span><i class="el-icon-upload"></i>上传照片</span>
                      </el-button>
                      <div v-if="staffInfoName[item.jname].houregPerphoUrl" class="upload-img-wrapper">
                        <img :src="staffInfoName[item.jname].houregPerphoUrl"
                             @click="imageScaleOpen(staffInfoName[item.jname].houregPerphoUrl,0,0)"/>
                      </div>
                    </el-form-item>
                    <el-form-item label="本人户口页背面" :prop="item.jname+'.houregPerrevphoUrl'"
                                  :rules="{required: item.isrequired, message: '请上传户口页背面照片', trigger: 'blur'}">
                      <uploadImage v-if="item.isedit" @update="_upload"
                                   :child="{name:'houregPhoUrl.houregPerrevphoUrl',type:0}"></uploadImage>
                      <el-button type="primary" size="small" v-if="!item.isedit"
                                 :disabled="!item.isedit">
                        <span><i class="el-icon-upload"></i>上传照片</span>
                      </el-button>
                      <div v-if="staffInfoName[item.jname].houregPerrevphoUrl" class="upload-img-wrapper">
                        <img :src="staffInfoName[item.jname].houregPerrevphoUrl"
                             @click="imageScaleOpen(staffInfoName[item.jname].houregPerrevphoUrl,0,0)"/>
                      </div>
                    </el-form-item>
                  </div>
                  <div v-else-if="item.jname==='emergencyContact'">
                    <el-form-item label-width="0" class="contact-box">
                      <h4 class="fs15"><span v-if="item.isrequired" class="fsStar">*</span>紧急联系人</h4>
                      <div class="contacts-wrapper">
                        <div class="contact" :span="24" v-for="(ite, idx) in staffInfoName[item.jname]">
                          <el-form-item label="姓名" label-width="4em"
                                        :prop="item.jname+'[' + idx + '].emergContact'"
                                        :rules="[{required:item.isrequired, message: '请输入姓名', trigger: 'blur'},
                            {message: ' 长度小于32个字符', trigger: 'blur', max: 32}]">
                            <el-input :disabled="!item.isedit" placeholder="请输入联系人姓名"
                                      v-model="ite.emergContact">
                              <el-button v-if="idx > 0" :disabled="!item.isedit"
                                         slot="append"
                                         @click="rmvContact(ite)"><i
                                class="el-icon-delete"></i></el-button>
                            </el-input>
                          </el-form-item>
                          <el-form-item label="电话" label-width="4em"
                                        :prop="item.jname+'[' + idx + '].emergContactPhone'"
                                        :rules="{required:item.isrequired,message: '请输入紧急联系人电话', trigger: 'blur', pattern: /^1\d{10}$/}">
                            <el-input :disabled="!item.isedit" placeholder="请输入联系电话"
                                      v-model="ite.emergContactPhone"></el-input>
                          </el-form-item>
                        </div>
                        <el-row>
                          <el-col align="center" :span="24">
                            <el-button :disabled="!item.isedit" v-if="staffInfoName[item.jname].length < 3"
                                       class="add-contact"
                                       size="small"
                                       type="primary" @click="addContact">
                              <span>添加紧急联系人</span>
                            </el-button>
                          </el-col>
                        </el-row>
                      </div>
                    </el-form-item>
                  </div>
                  <div v-else-if="item.jname==='idcardPhoUrl'">
                    <el-form-item label="身份证正面" :prop="item.jname+'.idcardPhoUrl'"
                                  :rules="{required: item.isrequired, message: '请上传身份证照片', trigger: 'blur'}">
                      <uploadImage v-if="item.isedit" @update="_upload"
                                   :child="{name:'idcardPhoUrl.idcardPhoUrl',type:0}"></uploadImage>
                      <el-button type="primary" size="small" v-if="!item.isedit"
                                 :disabled="!item.isedit">
                        <span><i class="el-icon-upload"></i>上传照片</span>
                      </el-button>
                      <div v-if="staffInfoName[item.jname].idcardPhoUrl" class="upload-img-wrapper">
                        <img :src="staffInfoName[item.jname].idcardPhoUrl"
                             @click="imageScaleOpen(staffInfoName[item.jname].idcardPhoUrl,0,0)"/>
                      </div>
                    </el-form-item>
                    <el-form-item label="身份证背面" :prop="item.jname+'.idcardPhoUrlRev'"
                                  :rules="{required: item.isrequired, message: '请上传身份证照片', trigger: 'blur'}">
                      <uploadImage v-if="item.isedit" @update="_upload"
                                   :child="{name:'idcardPhoUrl.idcardPhoUrlRev',type:0}"></uploadImage>
                      <el-button type="primary" size="small" v-if="!item.isedit"
                                 :disabled="!item.isedit">
                        <span><i class="el-icon-upload"></i>上传照片</span>
                      </el-button>
                      <div v-if="staffInfoName[item.jname].idcardPhoUrlRev" class="upload-img-wrapper">
                        <img :src="staffInfoName[item.jname].idcardPhoUrlRev"
                             @click="imageScaleOpen(staffInfoName[item.jname].idcardPhoUrlRev,0,0)"/>
                      </div>
                    </el-form-item>
                  </div>
                  <div v-else-if="item.jname==='ResperMessage'">
                    <el-form-item label="居住证">
                      <el-switch
                        :disabled="!item.isedit"
                        v-model="staffInfoName[item.jname].hasResper"
                        on-text="有"
                        off-text="无">
                      </el-switch>
                    </el-form-item>
                    <el-form-item v-if="staffInfoName[item.jname].hasResper" label="居住证省份"
                                  :prop="item.jname+'.residenceProvince'"
                                  :rules="{required: item.isrequired,message: '请选择居住证所在省份', trigger: 'change'}">
                      <select :disabled="!item.isedit" v-model="staffInfoName[item.jname].residenceProvince"
                              :class="{'option-color':!staffInfoName[item.jname].residenceProvince}"
                              @change="queryCities(staffInfoName[item.jname].residenceProvince,'ResperMessage')">
                        <option :value="''||null" disabled>请选择居住证省份</option>
                        <option v-for="p in provinces" :key="p.uid" v-text="p.name" :value="p.uid"></option>
                      </select>
                    </el-form-item>

                    <el-form-item v-if="staffInfoName[item.jname].hasResper" label="居住证城市"
                                  :prop="item.jname+'.residenceCity'"
                                  :rules="{required: item.isrequired,message: '请选择居住证所在城市', trigger: 'blur'}">
                      <select :disabled="!item.isedit" v-model="staffInfoName[item.jname].residenceCity"
                              :class="{'option-color':!staffInfoName[item.jname].residenceCity}">
                        <option :value="''||null" disabled>请选择居住证城市</option>
                        <option v-for="c in residenceCities" :key="c.uid" v-text="c.name" :value="c.uid"></option>
                      </select>
                    </el-form-item>

                    <el-form-item v-if="staffInfoName[item.jname].hasResper" label="居住证办理时间"
                                  :prop="item.jname+'.resperst'"
                                  :rules="{required: item.isrequired,type: 'date', message: '请选择居住证办理时间', trigger: 'change',validator:isDate}">
                      <p class="pl10" v-if="item.isedit"
                         v-text="staffInfoName[item.jname].resperst ? datefmt(staffInfoName[item.jname].resperst):'请选择日期'"
                         @click="openPicker(0,1,0,staffInfoName[item.jname].resperst)"></p>
                      <p class="pl10 fc-bbb" v-else
                         v-text="staffInfoName[item.jname].resperst ? datefmt(staffInfoName[item.jname].resperst):'请选择日期'"></p>
                    </el-form-item>

                    <el-form-item v-if="staffInfoName[item.jname].hasResper" label="居住证截止日期"
                                  :prop="item.jname+'.resperet'"
                                  :rules="{required:item.isrequired,type: 'date', message: '请选择居住证截止日期', trigger: 'change',validator:isDates}">
                      <p class="pl10" v-if="item.isedit"
                         v-text="staffInfoName[item.jname].resperet ? datefmt(staffInfoName[item.jname].resperet):'请选择日期' "
                         @click="openPicker(0,2,0,staffInfoName[item.jname].resperet)"></p>
                      <p class="pl10 fc-bbb" v-else
                         v-text="staffInfoName[item.jname].resperet ? datefmt(staffInfoName[item.jname].resperet):'请选择日期' "></p>
                    </el-form-item>
                  </div>
                  <div v-else-if="item.jname==='bankName'">
                    <el-form-item label="银行名称" :prop="item.jname+'.bankName'"
                                  :rules="{required: item.isrequired, message: '请选择银行', trigger: 'blur'}">
                      <select :disabled="!item.isedit" v-model="staffInfoName[item.jname].bankName"
                              :class="{'option-color':!staffInfoName[item.jname].bankName}">
                        <option value="" disabled>请选择银行名称</option>
                        <option v-for="(v, k) in bankNames" :key="k" v-text="v.name" :value="v.id"></option>
                      </select>
                    </el-form-item>
                    <el-form-item label="开户行" :prop="item.jname+'.openingBank'"
                                  :rules="[{required: item.isrequired, message: '请填写正确的开户行名称', trigger: 'blur'},
                        {message: '不能超过 64 个字符', trigger: 'blur', max: 64}]">
                      <el-input :disabled="!item.isedit" placeholder="请输入开户行名称"
                                v-model="staffInfoName[item.jname].openingBank"></el-input>
                    </el-form-item>
                    <el-form-item label="银行卡号" :prop="item.jname+'.cardNumber'"
                                  :rules="[{required: item.isrequired, message: '请填写正确的银行卡号', trigger: 'blur',pattern: /^\d+$/},
                        {message: '最少 16 个数字', trigger: 'blur',min:16},
                        {message: '最多 64 个数字', trigger: 'blur',max:64}]">
                      <el-input :disabled="!item.isedit" placeholder="请输入银行卡号"
                                v-model="staffInfoName[item.jname].cardNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="银行卡照片" :prop="item.jname+'.staffCardUrls'"
                                  :rules="{required:item.isrequired,type:'array', message: '请上传银行卡照片', trigger: 'blur'}">
                      <div class="upload-btn" v-if="item.isedit && !bankCardEdit">
                        <uploadImage @update="_upload"
                                     :child="{name:'bankName.staffCardUrls',type:2,value:staffInfoName[item.jname].staffCardUrls}"></uploadImage>
                      </div>
                      <el-button size="small"
                                 v-if="item.isedit && !bankCardEdit && staffInfoName[item.jname].staffCardUrls.length"
                                 @click="resumeDel('bankName.staffCardUrls','bankCardEdit')"
                                 class="upload-img-delBtn">
                        <span><i class="el-icon-delete"></i>删除</span>
                      </el-button>
                      <el-button type="danger" size="small" v-if="item.isedit && bankCardEdit"
                                 @click="resumeConfirm('bankName.staffCardUrls','bankCardEdit')">
                        <span><i class="el-icon-delete"></i>确定删除</span>
                      </el-button>
                      <el-button size="small" v-if="item.isedit && bankCardEdit"
                                 @click="resumeCancel('bankCardEdit',item.jname)">
                        <span><i class="el-icon-circle-cross"></i>取消</span>
                      </el-button>
                      <el-button type="primary" size="small" v-if="!item.isedit"
                                 :disabled="!item.isedit">
                        <span><i class="el-icon-upload"></i>上传照片</span>
                      </el-button>
                      <el-button size="small" v-if="!item.isedit  && staffInfoName[item.jname].staffCardUrls.length"
                                 :disabled="!item.isedit">
                        <span><i class="el-icon-delete"></i>删除</span>
                      </el-button>
                      <div v-if="staffInfoName[item.jname].staffCardUrls.length" class="upload-img-wrapper">
                        <div v-for="(ite, idx) in staffInfoName[item.jname].staffCardUrls" class="upload-img-box"
                             @click="imageScaleOpen(ite.url,2,idx)" v-if="isFormatImg(ite.url)">
                          <img :src="ite.url"/>
                          <img src="../../assets/ico_select_1.png"
                               class="upload-img-icon"
                               v-if="bankCardEdit && !staffInfoName[item.jname].staffCardUrls[idx].state" alt="">
                          <img src="../../assets/ico_select_2.png"
                               class="upload-img-icon"
                               v-if="bankCardEdit && staffInfoName[item.jname].staffCardUrls[idx].state" alt="">
                        </div>
                      </div>
                    </el-form-item>
                  </div>
                  <div v-else-if="item.jname==='hasComres'">
                    <el-form-item label="是否有竞业协议">
                      <el-switch
                        :disabled="!item.isedit"
                        v-model="staffInfoName[item.jname].hasComres"
                        on-text="有"
                        off-text="无">
                      </el-switch>
                    </el-form-item>
                    <el-form-item v-if="staffInfoName[item.jname].hasComres" label="竞业协议备注"
                                  :prop="item.jname+'.hasComresRmk'"
                                  :rules="[{required: item.isrequired,message: '请输入备注信息', trigger: 'blur'},
                        {message: '不能超过32个字符', trigger: 'blur', max: 32}]">
                      <el-input :disabled="!item.isedit" v-model="staffInfoName[item.jname].hasComresRmk"
                                placeholder="备注信息"></el-input>
                    </el-form-item>
                  </div>
                  <div v-else-if="item.jname==='informUrl'">
                    <el-form-item :label="item.remark" prop="informUrl" :required="item.isrequired">
                      <div class="upload-btn" v-if="item.isedit && !informEdit">
                        <uploadImage @update="_upload"
                                     :child="{name:'informUrl',type:1,value:staffInfoName[item.jname]}"></uploadImage>
                      </div>
                      <el-button size="small" v-if="item.isedit && !informEdit && staffInfoName[item.jname].length"
                                 @click="resumeDel('informUrl','informEdit')"
                                 class="upload-img-delBtn">
                        <span><i class="el-icon-delete"></i>删除</span>
                      </el-button>
                      <el-button type="danger" size="small" v-if="item.isedit && informEdit"
                                 @click="resumeConfirm('informUrl','informEdit')">
                        <span><i class="el-icon-delete"></i>确定删除</span>
                      </el-button>
                      <el-button size="small" v-if="item.isedit && informEdit"
                                 @click="resumeCancel('informEdit',item.jname)">
                        <span><i class="el-icon-circle-cross"></i>取消</span>
                      </el-button>
                      <el-button type="primary" size="small" v-if="!item.isedit"
                                 :disabled="!item.isedit">
                        <span><i class="el-icon-upload"></i>上传文件</span>
                      </el-button>
                      <el-button size="small" v-if="!item.isedit && staffInfoName[item.jname].length"
                                 :disabled="!item.isedit">
                        <span><i class="el-icon-delete"></i>删除</span>
                      </el-button>
                      <div v-if="staffInfoName[item.jname].length" class="upload-img-wrapper">
                        <div v-for="(ite, idx) in staffInfoName[item.jname]" class="upload-img-box"
                             @click="imageScaleOpen(ite.url,3,idx)" v-if="isFormatImg(ite.url)">
                          <img :src="ite.url"/>
                          <img src="../../assets/ico_select_1.png"
                               class="upload-img-icon" v-if="informEdit && !staffInfoName[item.jname][idx].state"
                               alt="">
                          <img src="../../assets/ico_select_2.png"
                               class="upload-img-icon" v-if="informEdit && staffInfoName[item.jname][idx].state" alt="">
                        </div>
                        <div v-for="(ite, idx) in staffInfoName[item.jname]" class="upload-img-box upload-img-box1"
                             @click="imageScaleOpen(ite.url,3,idx)" v-if="!(isFormatImg(ite.url))">
                          <div v-if="!(isFormatImg(ite.url))" class="upload-document-box">
                            <div v-if="informEdit" :class="{'upload-document-main':informEdit}">
                              <img class="upload-img-document" src="../../assets/ico_document.png" alt="">
                              <span>已上传</span>
                            </div>
                            <a v-else :href="(fileUrl(ite.url)+  '&openid=' + tokenHeader.openId)">
                              <div :class="{'upload-document-main':informEdit}">
                                <img class="upload-img-document" src="../../assets/ico_document.png" alt="">
                                <span>已上传</span>
                              </div>
                            </a>
                            <img src="../../assets/ico_select_1.png"
                                 class="upload-img-icon" v-if="informEdit && !staffInfoName[item.jname][idx].state"
                                 alt="">
                            <img src="../../assets/ico_select_2.png"
                                 class="upload-img-icon" v-if="informEdit && staffInfoName[item.jname][idx].state"
                                 alt="">
                          </div>
                        </div>
                      </div>
                    </el-form-item>
                  </div>
                  <div v-else-if="item.jname==='resumeUrl'">
                    <el-form-item :label="item.remark" prop="resumeUrl" :required="item.isrequired">
                      <div class="upload-btn" v-if="item.isedit && !resumeEdit">
                        <uploadImage @update="_upload"
                                     :child="{name:'resumeUrl',type:1,value:staffInfoName[item.jname]}"></uploadImage>
                      </div>
                      <el-button size="small" v-if="item.isedit && !resumeEdit && staffInfoName[item.jname].length"
                                 @click="resumeDel('resumeUrl','resumeEdit')"
                                 class="upload-img-delBtn">
                        <span><i class="el-icon-delete"></i>删除</span>
                      </el-button>
                      <el-button type="danger" size="small" v-if="item.isedit && resumeEdit"
                                 @click="resumeConfirm('resumeUrl','resumeEdit')">
                        <span><i class="el-icon-delete"></i>确定删除</span>
                      </el-button>
                      <el-button size="small" v-if="item.isedit && resumeEdit"
                                 @click="resumeCancel('resumeEdit',item.jname)">
                        <span><i class="el-icon-circle-cross"></i>取消</span>
                      </el-button>
                      <el-button type="primary" size="small" v-if="!item.isedit"
                                 :disabled="!item.isedit">
                        <span><i class="el-icon-upload"></i>上传简历</span>
                      </el-button>
                      <el-button size="small" v-if="!item.isedit && staffInfoName[item.jname].length"
                                 :disabled="!item.isedit">
                        <span><i class="el-icon-delete"></i>删除</span>
                      </el-button>
                      <div v-if="staffInfoName[item.jname].length" class="upload-img-wrapper">
                        <div v-for="(ite, idx) in staffInfoName[item.jname]" class="upload-img-box"
                             @click="imageScaleOpen(ite.url,1,idx)" v-if="isFormatImg(ite.url)">
                          <img :src="ite.url"/>
                          <img src="../../assets/ico_select_1.png"
                               class="upload-img-icon" v-if="resumeEdit && !staffInfoName[item.jname][idx].state"
                               alt="">
                          <img src="../../assets/ico_select_2.png"
                               class="upload-img-icon" v-if="resumeEdit && staffInfoName[item.jname][idx].state" alt="">
                        </div>
                        <div v-for="(ite, idx) in staffInfoName[item.jname]" class="upload-img-box upload-img-box1"
                             @click="imageScaleOpen(ite.url,1,idx)" v-if="!(isFormatImg(ite.url))">
                          <div v-if="!(isFormatImg(ite.url))" class="upload-document-box">
                            <div v-if="resumeEdit" :class="{'upload-document-main':resumeEdit}">
                              <img class="upload-img-document" src="../../assets/ico_document.png" alt="">
                              <span>已上传</span>
                            </div>
                            <a v-else :href="(fileUrl(ite.url)+  '&openid=' + tokenHeader.openId)">
                              <div :class="{'upload-document-main':resumeEdit}">
                                <img class="upload-img-document" src="../../assets/ico_document.png" alt="">
                                <span>已上传</span>
                              </div>
                            </a>
                            <img src="../../assets/ico_select_1.png"
                                 class="upload-img-icon" v-if="resumeEdit && !staffInfoName[item.jname][idx].state"
                                 alt="">
                            <img src="../../assets/ico_select_2.png"
                                 class="upload-img-icon" v-if="resumeEdit && staffInfoName[item.jname][idx].state"
                                 alt="">
                          </div>
                        </div>
                      </div>
                    </el-form-item>
                  </div>
                  <div v-else-if="item.jname==='emplsepacertUrl'">
                    <el-form-item :label="item.remark" prop="emplsepacertUrl" :required="item.isrequired">
                      <uploadImage v-if="item.isedit" @update="_upload"
                                   :child="{name:'emplsepacertUrl',type:0}"></uploadImage>
                      <el-button type="primary" size="small" v-if="!item.isedit"
                                 :disabled="!item.isedit">
                        <span><i class="el-icon-upload"></i>上传照片</span>
                      </el-button>
                      <div v-if="staffInfoName[item.jname]" class="upload-img-wrapper">
                        <img :src="staffInfoName[item.jname]" @click="imageScaleOpen(staffInfoName[item.jname],0,0)"/>
                      </div>
                    </el-form-item>
                  </div>
                  <div v-else-if="item.jname==='staffPhoUrl'">
                    <el-form-item :label="item.remark" prop="staffPhoUrl" :required="item.isrequired">
                      <uploadImage v-if="item.isedit" @update="_upload"
                                   :child="{name:'staffPhoUrl',type:0}"></uploadImage>
                      <el-button type="primary" size="small" v-if="!item.isedit"
                                 :disabled="!item.isedit">
                        <span><i class="el-icon-upload"></i>上传照片</span>
                      </el-button>
                      <div v-if="staffInfoName[item.jname]" class="upload-img-wrapper">
                        <img :src="staffInfoName[item.jname]" @click="imageScaleOpen(staffInfoName[item.jname],0,0)"/>
                      </div>
                    </el-form-item>
                  </div>
                  <div v-else>
                    <el-form-item :label="item.remark" :prop="item.jname" :required="item.isrequired">
                      <p v-if="item.jname==='gender'" class="pl10 fc-bbb"
                         v-text="staffInfoName[item.jname]===0 ? '女':(staffInfoName[item.jname]===1?'男':'')"></p>
                      <p v-else-if="item.jname==='dateOfBirth'" class="pl10" :class="{'fc-bbb':!item.isedit}"
                         v-text="datefmt(staffInfoName[item.jname])"></p>
                      <select v-else-if="item.jname==='nation'" :disabled="!item.isedit"
                              v-model="staffInfoName[item.jname]"
                              :class="{'option-color':!staffInfoName[item.jname]}">
                        <option value="" disabled>请选择{{item.remark}}</option>
                        <option v-for="(v, k) in nations" :key="k" v-text="v.name" :value="v.id"></option>
                      </select>
                      <select v-else-if="item.jname==='maritalStatus'" :disabled="!item.isedit"
                              v-model="staffInfoName[item.jname]"
                              :class="{'option-color':!staffInfoName[item.jname]}">
                        <option :value="''||null" disabled>请选择{{item.remark}}</option>
                        <option v-for="(v, k) in maritalStatuses" :key="k" v-text="v.name" :value="v.id"></option>
                      </select>
                      <el-input v-else-if="item.jname==='idcard'" :disabled="!item.isedit"
                                :placeholder="'请输入'+item.remark"
                                @change="staffIdcard(staffInfoName[item.jname],true)"
                                v-model="staffInfoName[item.jname]"></el-input>
                      <el-input v-else :disabled="!item.isedit" :placeholder="'请输入'+item.remark"
                                v-model="staffInfoName[item.jname]"></el-input>
                    </el-form-item>
                  </div>
                </div>
              </div>
            </el-form>
            <div class="save-wrapper">
              <mt-button class="save" type="primary" @click="save">更新我的资料</mt-button>
            </div>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="2">
          <div v-if="selected==='2'">
            <!--岗位信息-->
            <el-form label-position="left" :label-width="labelWidth">
              <div v-for="item in staffRecordInfo">
                <div v-if="item.jname==='workAge'">
                  <el-form-item label="首次工作时间">
                    <span v-text="datefmt(item.value)"></span>
                  </el-form-item>
                  <el-form-item :label="item.remark">
                    <span v-text="workAge(item.value)+'年(工龄计算是根据首次参加工作时间开始计算)'"></span>
                  </el-form-item>
                </div>
                <div v-else-if="item.jname==='contracMes'">
                  <el-form-item label="合同类型">
                    <span>{{contractTypes && contractTypes[item.value.contracType.toString()]}}</span>
                  </el-form-item>
                  <!-- 劳动合同 -->
                  <el-form-item :label="contracTime({type:item.value.contracType,state:true})">
                    <span>{{datefmt(item.value.startTime)}}</span>
                  </el-form-item>
                  <el-form-item :label="contracTime({type:item.value.contracType,state:false})">
                    <span>{{datefmt(item.value.endTime)}}</span>
                  </el-form-item>
                  <el-form-item v-if="item.value.contracType === 0" label="合同期限">
                    <span
                      v-text="item.value.contractPeriod===-1 ? '无固定期限' : (item.value.contractPeriod%12===0 ? item.value.contractPeriod/12+'年' : (item.value.contractPeriod%6===0 ? '半年' : item.value.contractPeriod+'个月'))"></span>
                  </el-form-item>
                  <el-form-item v-if="item.value.contracType === 0" label="候选人来源渠道">
                    <span>{{recruitmentChannels[+item.value.recruitmentChannel]}}</span>
                  </el-form-item>
                  <el-form-item v-if="item.value.contracType === 0" label="基础薪资">
                    <span v-text="item.value.baseSalary?(item.value.baseSalary+'元'):''"></span>
                  </el-form-item>
                  <el-form-item v-if="item.value.contracType === 0" label="试用薪资">
                    <span v-text="item.value.trialSalary?(item.value.trialSalary+'元'):''"></span>
                  </el-form-item>
                  <el-form-item v-if="item.value.contracType === 0" label="试用期">
                    <span>{{probations && probations[item.value.probation.toString()]}}</span>
                  </el-form-item>
                  <el-form-item label="合同附件">
                    <div v-if="item.value.contractUrls.length&&item.value.contractUrls[0].url"
                         class="upload-img-wrapper">
                      <div v-for="(ite, idx) in item.value.contractUrls" class="upload-img-box"
                           @click="imageScaleOpen(ite.url,0,0)" v-if="isFormatImg(ite.url)">
                        <img :src="ite.url"/>
                      </div>
                      <div v-for="(ite, idx) in item.value.contractUrls"
                           class="upload-img-box upload-img-box1"
                           @click="imageScaleOpen(ite.url,0,0)" v-if="!(isFormatImg(ite.url))">
                        <div v-if="!(isFormatImg(ite.url))" class="upload-document-box">
                          <a :href="(fileUrl(ite.url)+  '&openid=' + tokenHeader.openId)">
                            <div class="upload-document-main">
                              <img class="upload-img-document" src="../../assets/ico_document.png" alt="">
                              <span>已上传</span>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </el-form-item>
                </div>
                <div v-else-if="item.jname==='workLocation'">
                  <el-form-item label="工作地省份">
                    <span v-text="getPC(item.value.workProvince || '', item.value.workCity || '')"></span>
                  </el-form-item>
                  <el-form-item label="工作地城市">
                    <span>{{staticWorkCity}}</span>
                  </el-form-item>
                  <el-form-item label="工作地址">
                    <span>{{item.value.workAddress}}</span>
                  </el-form-item>
                </div>
                <div v-else>
                  <el-form-item :label="item.remark">
                    <span v-if="item.jname==='dateOfEntry'" v-text="datefmt(item.value)"></span>
                    <span v-else-if="item.jname==='StaffStatus'"
                          v-text="staffStatus && staffStatus[item.value].name"></span>
                    <span v-else-if="item.jname==='reporterJobNumber'" v-text="reportPerson"></span>
                    <span v-else v-text="item.value"></span>
                  </el-form-item>
                </div>
              </div>
            </el-form>
            <!--期权信息-->
            <el-form label-position="left" :label-width="labelWidth">
              <div v-for="item in staffShareOptionInfo">
                <div>
                  <el-form-item :label="item.remark">
                    <span v-if="item.jname==='awardRound'" v-text="item.value?item.value+'轮':''"></span>
                    <span v-else-if="item.jname==='exercSchedule'" v-text="item.value?item.value+'月':''"></span>
                    <span v-else-if="item.jname==='awardDate'" v-text="datefmt(item.value)"></span>
                    <span v-else-if="item.jname==='awardRate'|| item.jname==='terminallyRate'"
                          v-text="item.value?item.value+'%':''"></span>
                    <div v-else-if="item.jname==='contractUrl' && item.value" class="shareOption-document-main">
                      <img src="../../assets/ico_document.png" alt="">
                      <br/>
                      <span>已上传</span>
                    </div>
                    <span v-else v-text="item.value"></span>
                  </el-form-item>
                </div>
              </div>
            </el-form>
          </div>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
    <!--点击图片放大弹框-->
    <div id="imageScale-wrapper">
      <mt-popup
        v-model="imageScale"
        class="imageScale-wrapper"
        closeOnClickModal="false">
        <div class="imageScale-box">
          <img :src="imageScaleUrl" @click="imageScaleClose">
        </div>
      </mt-popup>
    </div>
    <mt-datetime-picker
      type="date"
      ref="picker"
      v-model="nowDateTime"
      :startDate="startDate"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      @confirm="handleConfirm">
    </mt-datetime-picker>
  </div>
</template>
<script>
  import moment from 'moment'
  import 'element-ui/lib/theme-default/index.css'
  import Vue from 'vue'
  import {
    Input,
    InputNumber,
    Radio,
    RadioGroup,
    RadioButton,
    Checkbox,
    CheckboxGroup,
    Switch,
    Select,
    Option,
    OptionGroup,
    Button,
    ButtonGroup,
    Form,
    FormItem,
    Icon,
    Row,
    Col,
    Upload,
  } from 'element-ui'
  Vue.use(Input);
  Vue.use(InputNumber);
  Vue.use(Radio);
  Vue.use(RadioGroup);
  Vue.use(RadioButton);
  Vue.use(Checkbox);
  Vue.use(CheckboxGroup);
  Vue.use(Switch);
  Vue.use(Select);
  Vue.use(Option);
  Vue.use(OptionGroup);
  Vue.use(Button);
  Vue.use(ButtonGroup);
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Icon);
  Vue.use(Row);
  Vue.use(Col);
  Vue.use(Upload);
  import utils from '@/components/utils';
  import {MessageBox, Indicator} from 'mint-ui';
  import uploadImage from './uploadImage'

  // ====日历组件需求开始====
  let df1 = 'YYYY-MM-DD';
  let df2 = 'YYYY-MM';
  let pickerslot = document.getElementsByClassName('picker-slot');
  // ====日历组件需求结束====
  export default {
    data() {
      return {
        tokenHeader: {
          charset: 'utf-8',
          openId: this.getCookie('openId')
        },
        textType: {
          '1': '中文',
          '2': '英文',
          '3': '数字',
          '4': '标点符号',
          '12': '中文、英文',
          '13': '中文、数字',
          '14': '中文、标点符号',
          '23': '英文、数字',
          '24': '英文、标点符号',
          '34': '数字、标点符号',
          '123': '中文、英文、数字',
          '124': '中文、英文、标点符号',
          '134': '中文、数字、标点符号',
          '234': '英文、数字、标点符号',
          '1234': '中文、英文、数字、标点符号',
          'type3': '',
        },
        patt: {
          '1': /^[\u4e00-\u9fa5]+$/,
          '2': /^[A-Za-z]+$/,
          '3': /^\d+$/,
          '4': /^[|\[\],.?'"\(\)+\-_*\/\\&\$#^@!%~`<>:;=\{\}\s：；？，。·！￥……（）｛｝【】、《》‘’“”『』——]+$/,
          '12': /^[\u4e00-\u9fa5A-za-z]+$/,
          '13': /^[\u4e00-\u9fa5\d]+$/,
          '14': /^[\u4e00-\u9fa5|\[\],.?'"\(\)+\-_*\/\\&\$#^@!%~`<>:;=\{\}\s：；？，。·！￥……（）｛｝【】、《》‘’“”『』——]+$/,
          '23': /^[A-Za-z\d]+$/,
          '24': /^[A-Za-z|\[\],.?'"\(\)+\-_*\/\\&\$#^@!%~`<>:;=\{\}\s：；？，。·！￥……（）｛｝【】、《》‘’“”『』——]+$/,
          '34': /^[\d|\[\],.?'"\(\)+\-_*\/\\&\$#^@!%~`<>:;=\{\}\s：；？，。·！￥……（）｛｝【】、《》‘’“”『』——]+$/,
          '123': /^[\u4e00-\u9fa5A-Za-z\d]+$/,
          '124': /^[\u4e00-\u9fa5A-Za-z|\[\],.?'"\(\)+\-_*\/\\&\$#^@!%~`<>:;=\{\}\s：；？，。·！￥……（）｛｝【】、《》‘’“”『』——]+$/,
          '134': /^[\u4e00-\u9fa5\d|\[\],.?'"\(\)+\-_*\/\\&\$#^@!%~`<>:;=\{\}\s：；？，。·！￥……（）｛｝【】、《》‘’“”『』——]+$/,
          '234': /^[A-Za-z\d|\[\],.?'"\(\)+\-_*\/\\&\$#^@!%~`<>:;=\{\}\s：；？，。·！￥……（）｛｝【】、《》‘’“”『』——]+$/,
          '1234': /^[\u4e00-\u9fa5A-Za-z\d|\[\],.?'"\(\)+\-_*\/\\&\$#^@!%~`<>:;=\{\}\s：；？，。·！￥……（）｛｝【】、《》‘’“”『』——]+$/,
          'type3': /^[1-9][0-9]*$/,
        },
        // =====日历选择器字段开始=====
        startDate: '',
        nowDateTime: new Date(),
        selectDateTime: '',
        dateType: 0,
        type: 0,
        pos: 0, // 如果日期是在数组中，判断在数组中的位置
        // =====日历选择器字段结束=====
        resumeEdit: false,// 简历编辑状态
        bankCardEdit: false,//银行卡编辑状态
        informEdit: false,// 知情书编辑状态
        imageScale: false,// 图片点击全屏显示
        imageScaleUrl: '', //图片点击全屏显示的图片地址
        selected: '1',
        status: false,
        staticWorkCity: '',
        publicParams: null,
        labelWidth: '140px',
        nativePlaces: null,
        bankNames: null,
        staffStatus: null,//员工状态列表
        maritalStatuses: null,
        nations: null,
        states: null,//国家信息列表
        politicsStatuses: null,
        provinces: null,
        podoCities: null,
        typeOfDemiciles: null,
        residenceCities: null,
        poreCities: null,
        maxinumDeucaLevels: null,
        diplomaTypes: null,
        probations: null,
        contractTypes: null,
        recruitmentChannels: ['百度', '51job', '智联', '推荐', 'boss 直聘'],
        staffInfo: [], // 员工个人信息列表
        staffInfoName: {},// 员工个人信息对象
        staffRecordInfo: [],//员工岗位信息
        staffShareOptionInfo: [],// 员工期权信息
        reportPerson: '',//汇报人
        rulesStaffInfoName: {
          accfuNum: [{message: '请填写正确的公积金编号(数字)', trigger: 'blur', pattern: /^\d+$/},
            {message: '不能超过24个数字', trigger: 'blur', max: 24}],//公积金联名卡号
          dateOfBirth: [{type: 'date', message: '请选择出生日期', trigger: 'change', validator: this.isDate}],//出生日期
          emplsepacertUrl: [{message: '请上传离职证明照片', trigger: 'blur'}],//前公司离职证明
          englishName: [{message: '请填写正确的英文名', trigger: 'blur', pattern: /^[a-zA-Z]+$/},
            {message: '不能超过32个字符', trigger: 'blur', max: 32}],//英文名
          finallyEmpCom: [{message: '请输入正确的上一家受聘公司', trigger: 'change'},
            {message: '不能超过 255 个字符', trigger: 'blur', max: 255}],//上一家受聘公司
          gender: [{type: 'number', message: '请选择性别', trigger: 'change'}],//性别
          idcard: [{message: '请填写正确的身份证号', trigger: 'blur', pattern: /^\d{17}(?:\d|[Xx])$/}],//身份证号
          informUrl: [{type: 'array', message: '请上传知情书', trigger: 'blur'}],//知情书附件
          maritalStatus: [{message: '请选择婚姻状况', trigger: 'blur'}],//婚姻状态
          mobile: [{message: '请输入正确的手机号', trigger: 'blur', pattern: /^1\d{10}$/}],//手机号
          name: [{min: 2, max: 32, message: '请输入员工姓名(最少 2 个字符，最多 32 个字符)', trigger: 'change'}],//姓名
          nation: [{message: '请选择民族', trigger: 'blur'}],//民族
          personalEmail: [{type: 'email', message: '请输入正确的个人邮箱', trigger: 'change', max: 30}],//个人邮箱
          qq: [{message: '请填写正确的 QQ 号(数字)', trigger: 'blur', pattern: /^\d+$/},
            {message: '不能超过24个字符', trigger: 'blur', max: 24}],//qq号
          resumeUrl: [{type: 'array', message: '请上传简历', trigger: 'blur'}],//简历附件
          socsecNum: [{message: '请填写正确的社保编号(数字)', trigger: 'blur', pattern: /^\d+$/},
            {message: '不能超过 24 个数字', trigger: 'blur', max: 24}],//
          staffPhoUrl: [{message: '请上传员工照片', trigger: 'blur'}],//员工照片
          technicalTitle: [{message: '请输入正确的职称', trigger: 'change'},
            {message: '不能超过32个字符', trigger: 'blur', max: 32}],//职称
          theArcIns: [{message: '请输入正确的存档机构', trigger: 'change'},
            {message: '不能超过128个字符', trigger: 'blur', max: 128}],//存档机构
          wechart: [{message: '请填写正确的微信号', trigger: 'blur', pattern: /^[a-zA-Z0-9-_]+$/},
            {message: '不能少于6个或超过20个字符', trigger: 'blur', min: 6, max: 20}]//微信号
        }
      }
    },
    created: function () {
    },
    computed: {},
    methods: {
      queryStaffInfo() {
        this.$http.get('/api/v1.0/client/selectStaff')
          .then(res => {
            res = res.body;
            if (res.code === 200) {
              res.result.staffs.forEach(item => {
                switch (item.tname) {
                  case 'STAFF':
                    this.staffInfo.push(item);
                    if (item.isDefined) {
                      if (item.fieldType === 6) {
                        this.staffInfoName[item.uid] = {value: item.value, arr: []};
                        item.value.forEach(v => {
                          this.staffInfoName[item.uid].arr.push(v.value);
                        })
                      } else if (item.fieldType === 7 || item.fieldType === 8) {
                        this.staffInfoName[item.uid] = {info: item, edit: false};
                        this.staffInfoName[item.uid].info.value.forEach(v => {
                          v.state = false;
                        })
                      } else {
                        this.staffInfoName[item.uid] = item.value;
                      }
                    } else {
                      this.staffInfoName[item.jname] = item.value;
                    }
                    break;
                  case 'STAFF_RECORD':
                    this.staffRecordInfo.push(item);
                    break;
                  case 'STAFF_SHARE_OPTION':
                    this.staffShareOptionInfo.push(item);
                    break;
                }
              })
              if (this.staffInfoName['podoMessage']) this.staffInfoName['podoMessage'].typeOfDemicile = this.staffInfoName.podoMessage.typeOfDemicile + '';
              if (this.staffInfoName['nativePlace']) this.staffInfoName['nativePlace'].nativePlace = this.staffInfoName.nativePlace.nativePlace + '';
              if (this.staffInfoName['politicsStatus']) this.staffInfoName['politicsStatus'].politicsStatus = this.staffInfoName.politicsStatus.politicsStatus + '';
              if (this.staffInfoName['maritalStatus']) this.staffInfoName['maritalStatus'] = this.staffInfoName.maritalStatus + '';
              if (this.staffInfoName['eduInfor']) this.staffInfoName['eduInfor'].diplomaType = this.staffInfoName['eduInfor'].diplomaType + '';
              if (this.staffInfoName['informUrl']) this.staffInfoName['informUrl'].forEach(item => {
                item.state = false;
              });
              if (this.staffInfoName['resumeUrl']) this.staffInfoName['resumeUrl'].forEach(item => {
                item.state = false;
              });
              if (this.staffInfoName.bankName) this.staffInfoName.bankName.staffCardUrls.forEach(item => {
                item.state = false;
              });
              if (this.staffInfoName['podoMessage'] && this.staffInfoName['podoMessage'].podoProvince) this.queryCities(this.staffInfoName['podoMessage'].podoProvince, 'podoMessage');
              if (this.staffInfoName['ResperMessage'] && this.staffInfoName['ResperMessage'].residenceProvince) this.queryCities(this.staffInfoName['ResperMessage'].residenceProvince, 'ResperMessage');
              if (this.staffInfoName['poreLocation'] && this.staffInfoName['poreLocation'].poreProvince) this.queryCities(this.staffInfoName['poreLocation'].poreProvince, 'poreLocation');
              if (this.staffInfoName['idcard']) this.staffIdcard(this.staffInfoName['idcard'], false);
              Indicator.close();//关闭加载中
              this.status = true;
            }
          })
          .catch(err => console.log(err.status, err.statusText));
      },
      // 工龄
      workAge(data){
        if (data) {
          let ta = (new Date().getTime() - +moment(data).format('x')) / 31536000000;
          if (ta < 0) return '0.0';
          return ta.toFixed(1);
        } else {
          return '0.0';
        }
      },
      // 格式化日期
      datefmt(str) {
        if (str) return moment(str).format(df1);
        else return '';
      },
      datefmt1(str) {
        if (str) return moment(str).format(df2);
        else return '';
      },
      //合同起始日期字段名称
      contracTime(data){
        if (data.type === 0) {
          return data.state ? '合同生效日期' : '合同结束日期';
        } else if (data.type === 1) {
          return data.state ? '实习合同生效日期' : '实习合同结束日期';
        } else if (data.type === 2) {
          return data.state ? '返聘合同生效日期' : '返聘合同结束日期';
        } else if (data.type === 3) {
          return data.state ? '兼职协议生效日期' : '兼职协议结束日期';
        } else {
          return data.state ? '合同生效日期' : '合同结束日期';
        }
      },
      // 计算出生日期和性别
      staffIdcard(data, state){
        if (/^\d{17}(?:\d|[Xx])$/g.test(data.toString().trim())) {
          this.staffInfoName.dateOfBirth = new Date(`${data.substring(6, 10)}-${data.substring(10, 12)}-${data.substring(12, 14)}`).getTime();
          this.staffInfoName.gender = (+data.toString().trim()[16]) % 2 === 0 ? 0 : 1;
        }
        if (state) {
          this._updateValue('gender' || 'dateOfBirth');
        }
      },
      //根据省份查城市
      queryCities(pid, type) {
        if (!pid) {
          return;
        }
        this.$http.get(`/api/v1.0/common/query/city/${pid}`)
          .then(res => {
            res = res.body;
            if (res.code === 200) {
              if (type === 'podoMessage') {
                this.podoCities = res.result;
              } else if (type === 'ResperMessage') {
                this.residenceCities = res.result;
              } else if (type === 'poreLocation') {
                this.poreCities = res.result;
              }
            }
          })
          .catch(err => {
            console.log(err.status, err.statusText);
          });
      },
      // 岗位信息，获取工作地址的省市名称
      getPC(pid, cid) {
        let p = '';
        this.provinces.forEach(v => {
          if (pid.toString() === v.uid) {
            p = v.name;
            this.$http.get(`/api/v1.0/common/query/city/${pid}`)
              .then(res => {
                res = res.body;
                if (res.code === 200) {
                  res.result.forEach(v => {
                    if (v.uid === cid.toString()) {
                      this.staticWorkCity = v.name;
                      return false;
                    }
                  });
                }
              });
            return false;
          }
        });
        return p;
      },
      //添加子女信息
      addChild() {
        this.staffInfoName.hasChilds.childs.push({
          accountUid: null,
          age: null,
          birthCertifUrl: null,
          companyUid: null,
          dateOfBirth: null,
          gender: 1,
          name: null,
          staffUid: null,
          uid: null
        });
      },
      //删除子女信息
      rmvChild(item) {
        let index = this.staffInfoName.hasChilds.childs.indexOf(item);
        if (index !== -1) {
          this.staffInfoName.hasChilds.childs.splice(index, 1)
        }
      },
      //添加联系人
      addContact() {
        this.staffInfoName.emergencyContact.push({
          accountUid: null,
          companyUid: null,
          emergContact: null,
          emergContactPhone: null,
          staffUid: null,
          uid: null,
        });
        this._updateValue('emergencyContact');
      },
      //删除联系人
      rmvContact(item) {
        let index = this.staffInfoName.emergencyContact.indexOf(item);
        if (index !== -1) {
          this.staffInfoName.emergencyContact.splice(index, 1);
          this._updateValue('emergencyContact');
        }
      },
      // 判断开始日期是否小于结束日期
      isDates(rule, value, callback) {
        let arr = rule.field.split('.');
        if (arr[0] === 'eduInfor') arr[1] = 'entSchst';
        else if (arr[0] === 'ResperMessage') arr[1] = 'resperst';
        if (value) {
          if (this.staffInfoName[arr[0]][arr[1]]) {
            if (value > this.staffInfoName[arr[0]][arr[1]]) {
              callback();
            } else {
              if (arr[0] === 'eduInfor') callback(new Error(rule.message = "毕业日期不能小于入学日期"));
              else if (arr[0] === 'ResperMessage') callback(new Error(rule.message = "截止日期不能小于办理日期"));
            }
          }
        } else {
          if (rule.required) callback(new Error(rule.message));
          else callback();
        }
      },
      //用于数组中每一项值改变的监测
      _updateValue(name){
        this.staffInfo.forEach((item, index) => {
          if (item.isDefined) {
            if (item.uid === name) {
              this.$set(this.staffInfo, index, this.staffInfo[index]);
            }
          } else {
            if (item.jname === name) {
              this.$set(this.staffInfo, index, this.staffInfo[index]);
            }
          }

        })
      },
      // 上传回调
      _upload(data){
        let arr = data.info.name.split('.');
        if (arr.length === 1) {
          if (data.info.type === 0) {
            this.staffInfoName[arr[0]] = data.url;
          } else if (data.info.type === 1) {
            this.staffInfoName[arr[0]].push({
              uid: null,
              staffUid: null,
              url: data.url,
              state: false
            });
          } else if (data.info.type === 7 || data.info.type === 8) {
            if (this.staffInfoName[arr[0]].info.value.length > 0) {
              if (this.staffInfoName[arr[0]].info.value[0].value) {
                this.staffInfoName[arr[0]].info.value.push({
                  accountUid: null,
                  companyUid: null,
                  staffConfigUid: null,
                  staffUid: null,
                  state: false,
                  uid: null,
                  value: data.url
                })
              } else {
                this.staffInfoName[arr[0]].info.value[0].value = data.url;
              }
            } else {
              this.staffInfoName[arr[0]].info.value.push({
                accountUid: null,
                companyUid: null,
                staffConfigUid: null,
                staffUid: null,
                state: false,
                uid: null,
                value: data.url
              })
            }

          }
        } else if (arr.length === 2) {
          if (data.info.type === 0) {
            this.staffInfoName[arr[0]][arr[1]] = data.url;
          } else if (data.info.type === 2) {
            this.staffInfoName[arr[0]][arr[1]].push({
              uid: null,
              staffUid: null,
              url: data.url,
              state: false
            });
          }

        } else if (arr.length === 3) {
          this.staffInfoName[arr[0]][arr[1]][data.info.position][arr[2]] = data.url;
        }
        this._updateValue(arr[0]);
      },
      // 选择删除图片状态
      resumeDel(name, edit){
        console.log('rel', name, edit, typeof (edit))
        let arr = name.split('.');
        let obj;
        if (arr.length === 1) {
          if (typeof (edit) === 'string') {
            obj = this.staffInfoName[arr[0]];
          } else {
            obj = this.staffInfoName[arr[0]].info.value;
          }
        } else if (arr.length === 2) {
          obj = this.staffInfoName[arr[0]][arr[1]];
        }
        for (let i = 0; i < obj.length; i++) {
          if (obj[i].state) {
            obj[i].state = false;
          }
        }
        if (typeof (edit) === 'string') {
          this[edit] = true;
        } else {
          this.staffInfoName[arr[0]].edit = true;
        }
        this._updateValue(arr[0]);
      },
      // 确认删除图片按钮
      resumeConfirm(name, edit){
        let arr = name.split('.');
        let obj;
        if (arr.length === 1) {
          if (typeof (edit) === 'string') {
            obj = this.staffInfoName[arr[0]];
          } else {
            obj = this.staffInfoName[arr[0]].info.value;
          }
        } else if (arr.length === 2) {
          obj = this.staffInfoName[arr[0]][arr[1]];
        }
        for (let i = 0; i < obj.length; i++) {
          if (obj[i].state) {
            obj.splice(i, 1);
            i--;
          }
        }
        if (typeof (edit) === 'string') {
          this[edit] = false;
        } else {
          this.staffInfoName[arr[0]].edit = false;
        }
        this._updateValue(arr[0]);
      },
      // 删除图片取消按钮
      resumeCancel(edit, name){
        if (typeof (edit) === 'string') {
          this[edit] = false;
        } else {
          this.staffInfoName[name].edit = false;
        }
        this._updateValue(name);
      },
      //选择要删除的图片
      imageSelect(data, name, state){
        let arr = name.split('.');
        let obj;
        if (arr.length === 1) {
          if (state === 4 || state === 5) {
            obj = this.staffInfoName[arr[0]].info.value[data];
          } else {
            obj = this.staffInfoName[arr[0]][data];
          }
        }
        else if (arr.length === 2) {
          obj = this.staffInfoName[arr[0]][arr[1]][data];
        }
        if (obj.state) obj.state = false;
        else obj.state = true;
      },
      // 图片点击全屏放大
      imageScaleOpen(data, state, index, uid){
        if (state === 0 || ((state === 1) && !this.resumeEdit) || ((state === 2) && !this.bankCardEdit) || ((state === 3) && !this.informEdit) || ((state === 4) && !this.staffInfoName[uid].edit)) {
          if (this.isFormatImg(data)) {
            this.imageScale = true;
            this.imageScaleUrl = data;
          }
        } else {
          // 监听数组中属性变化不然监听不到
          if (state === 1) {
            this.imageSelect(index, 'resumeUrl')
            this._updateValue('resumeUrl');
          } else if (state === 2) {
            this.imageSelect(index, 'bankName.staffCardUrls')
          } else if (state === 3) {
            this.imageSelect(index, 'informUrl')
            this._updateValue('informUrl');
          } else if (state === 4) {
            this.imageSelect(index, uid, state);
            this._updateValue(uid);
          } else if (state === 5) {
            this.imageSelect(index, uid, state);
            this._updateValue(uid);
          }
        }
      },
      //关闭图片放大
      imageScaleClose(){
        this.imageScale = false;
      },
      // 获取省份信息
      queryProvinces() {
        this.$http.get('/api/v1.0/common/query/province')
          .then(res => {
            res = res.body;
            if (res.code === 200) {
              this.provinces = res.result;
            }
          })
          .catch(err => {
            console.log(err.status, err.statusText);
          });
      },
      //判断是否是图片
      isFormatImg(url) {
        return utils.isImage({name: url});
      },
      //验证是否是日期
      isDate(rule, value, callback) {
        if (rule.required) {
          if (value) callback();
          else callback(new Error(rule.message));
        } else {
          callback();
        }
      },
      // 判断字符串长度
      isLength(rule, value, callback, source, options){
        if ((value || '').length <= rule.max) {
          callback();
        } else {
          callback(new Error(rule.message));
        }
      },
      // 判断数字大小
      isSize(rule, value, callback, source, options){
        if (!value) {
          callback();
          return;
        }
        let n = +value;
        if (n > 0 && n <= (Math.pow(10, rule.max) - 1)) {
          callback();
        } else {
          callback(new Error(rule.message));
        }
      },
      //多选框选中监听值的变化
      checkList(data){
        this._updateValue(data);
      },
      //文件路径转化
      fileUrl(data){
        return data.replace('common', 'client');
      },
      //更新保存按钮
      save(){
        let flag = 0;
        this.$refs.personFm.validate(valid => {
          if (!valid) {
            flag++;
            return false;
          }
        });
        if (flag) {
          return;
        }
        Indicator.open('正在保存...');
        this.staffInfoName['informUrl'].forEach(item => {
          delete item.state;
        });
        this.staffInfoName['resumeUrl'].forEach(item => {
          delete item.state;
        });
        this.staffInfoName.bankName.staffCardUrls.forEach(item => {
          delete item.state;
        });
        this.staffInfo.forEach(item => {
          if (item.isDefined) {
            if (item.fieldType === 6) {
              let values = [];
              this.staffInfoName[item.uid].arr.forEach(v => {
                values.push({
                  accountUid: null,
                  companyUid: null,
                  staffConfigUid: null,
                  staffUid: null,
                  uid: null,
                  value: v,
                });
              });
              item.value = values;
            } else if (item.fieldType === 7 || item.fieldType === 8) {
              item.value = this.staffInfoName[item.uid].info.value;
              item.value.forEach(item => {
                delete item.state;
              });
            } else {
              item.value = this.staffInfoName[item.uid];
            }
          } else {
            item.value = this.staffInfoName[item.jname];
          }
          if (item.jname === 'maritalStatus') {
            item.value = parseInt(item.value);
          }
        });
        this.$http.post('/api/v1.0/client/updateStaffInfo', this.staffInfo).then(res => {
          res = res.body;
          if (res.code === 200) {
            Indicator.close();
            this.$router.push({path: '/signCard'});
          } else {
            MessageBox('提示', '个人资料更新失败');
            Indicator.close();
          }
        })
          .catch(err => console.log(err.status, err.statusText));
      },
      // 选择日期组件
      // openPicker(date,type,pos)中有三个参数
      //其中date值0表示有年月日，1表示有年月
      //其中type表示用来记录判断操作的对象
      //其中pos表示如果操作对象在数组中，其表示在数组的位置，如果不在数组中可以任意传值
      //其中currentDate表示当前已经选中的时间，日历会定位在这里，若是没有在定位到当前时间
      // ====日历组件方法开始====
      openPicker(date, type, pos, currentDate){
        this.dateType = date;
        this.type = type;
        this.pos = pos;
        if (currentDate) {
          this.nowDateTime = new Date(currentDate);
        } else {
          this.nowDateTime = new Date();
        }
        if (this.dateType === 0) {
          pickerslot[2].style.display = 'inline-block';
        } else if (this.dateType === 1) {
          pickerslot[2].style.display = 'none';
        }
        for (let i = 0; i < 3; i++) {
          if (this.dateType === 0) {
            pickerslot[i].style.width = '33.33%';
          } else if (this.dateType === 1) {
            pickerslot[i].style.width = '50%';
          }
        }
        this.$refs.picker.open();
      },
      handleConfirm(data){
        if (data) {
          if (this.dateType === 0) {
            this.selectDateTime = moment(data).format(df1);
          } else if (this.dateType === 1) {
            this.selectDateTime = moment(data).format(df2);
          }
          this.selcetDateTime({time: this.selectDateTime, type: this.type, pos: this.pos});
        }
      },
      // ====日历组件方法结束====
      // 选择日期组件，传回来的值
      selcetDateTime(data){
        if (typeof (data.type) === 'number') {
          // 入党时间
          if (data.type === 0) {
            this.staffInfoName.politicsStatus.thePartyTime = new Date(data.time.replace(/-/g, '/')).getTime();
          }
          // 居住证办理时间
          if (data.type === 1) {
            this.staffInfoName['ResperMessage'].resperst = new Date(data.time.replace(/-/g, '/')).getTime();
          }
          // 居住证截止时间
          if (data.type === 2) {
            this.staffInfoName['ResperMessage'].resperet = new Date(data.time.replace(/-/g, '/')).getTime();
          }
          //子女的出生日期
          if (data.type === 3) {
            this.staffInfoName['hasChilds'].childs[data.pos].dateOfBirth = new Date(data.time.replace(/-/g, '/')).getTime();
          }
          // 入学时间
          if (data.type === 4) {
            this.staffInfoName['eduInfor'].entSchst = new Date(data.time.replace(/-/g, '/')).getTime();
          }
          // 毕业时间
          if (data.type === 5) {
            this.staffInfoName['eduInfor'].entSchet = new Date(data.time.replace(/-/g, '/')).getTime();
          }
        } else {
          this.staffInfoName[data.type][0].value = new Date(data.time.replace(/-/g, '/')).getTime();
        }
      },
    },
    mounted: function () {
      Vue.Promise.all([
        this.$http.get('/api/v1.0/common/config/0'),
        this.$http.get('/api/v1.0/common/config/1'),
        this.$http.get('/api/v1.0/common/config/2'),
        this.$http.get('/api/v1.0/common/config/3'),
        this.$http.get('/api/v1.0/common/config/4'),
        this.$http.get('/api/v1.0/common/config/5'),
        this.$http.get('/api/v1.0/common/config/6'),
        this.$http.get('/api/v1.0/common/config/7'),
        this.$http.get('/api/v1.0/common/config/8'),
        this.$http.get('/api/v1.0/common/config/9'),
        this.$http.get('/api/v1.0/common/config/10'),
        this.$http.get('/api/v1.0/common/config/11'),
        this.$http.get('/api/v1.0/common/config/12'),
        this.$http.get('/api/v1.0/common/config/13'),
        this.$http.get('/api/v1.0/common/config/20')
      ]).then((res) => {
        this.publicParams = utils.getConfs(res);
        this.typeOfDemiciles = this.publicParams.typeOfDemicileOrg;
        this.nativePlaces = this.publicParams.nativePlaceOrg;
        this.bankNames = this.publicParams.bankNameOrg;
        this.maritalStatuses = this.publicParams.maritalStatusOrg;
        this.nations = this.publicParams.nationOrg;
        this.politicsStatuses = this.publicParams.politicsStatusOrg;
        this.maxinumDeucaLevels = this.publicParams.maxinumDeucaLevelOrg;
        this.diplomaTypes = this.publicParams.diplomaTypeOrg;
        this.staffStatus = this.publicParams.staffStatusOrg;
        this.states = this.publicParams.statesOrg;
        this.probations = this.publicParams.probation;
        this.contractTypes = this.publicParams.contractType;
        // ====日历组件需求开始====
        this.startDate = new Date(new Date().getTime() - (365 * 48 + 366 * 16) * 24 * 60 * 60 * 1000);
        // ====日历组件需求结束====
        this.status = false;
        Indicator.open('正在加载...');
        // 省份列表
        this.queryProvinces();
        //获取员工信息
        this.queryStaffInfo();
      });
      // 汇报人
      this.$http.get('/api/v1.0/client/findReporter').then(response => { //审批人表赋值给汇报上级
        if (response.body.code === 200) {
          if (response.body.result) {
            this.reportPerson = response.body.result.NAME;
          } else {
            this.reportPerson = '';
          }
        }
      }, response => {
        console.log('error callback');
      });
    },
    components: {
      uploadImage
    }
  }

</script>

<style lang="scss">
  #MyData {
    background: #ffffff;
    min-height: 100vh;
    .pl10 {
      padding-left: 10px;
    }
    .p10 {
      padding: 10px 0;
    }
    .fs12 {
      font-size: 12px;
      color: #97a8be;
    }
    .fs15 {
      font-size: 15px;
    }
    .fsStar {
      display: inline-block;
      color: #ff4949;
      font-size: 18px;
      font-weight: bold;
      margin-right: 4px;
    }
    .fc-bbb {
      color: #bbb;
    }
    .is-disabled {
      .el-input__inner {
        background: #ffffff;
      }
      input {
        color: black;
      }
    }
    // 选择日期覆盖样式
    .picker-items {
      display: block;
      width: 100%;
      .picker-slot {
        flex: none !important;
        display: inline-block;
      }
    }
    .my-data {
      padding: 44px 0 70px;
      text-align: left;
      background: #ffffff;
      // 复写mint ui 组件，头部样式
      /*修改tab样式*/
      .mint-navbar {
        background-color: #26a2ff;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        text-align: center;
        .mint-tab-item {
          padding: 0 !important;
          color: rgba(255, 255, 255, 0.5);
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          .mint-tab-item-label {
            height: 44px;
            font-size: 15px;
            span {
              height: 44px;
              line-height: 44px;
            }
          }
        }
        .mint-tab-item.is-selected {
          position: relative;
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
      .dataTitle {
        height: 44px;
      }
      .contacts-wrapper {
        width: 100%;
      }
      select {
        width: 100%;
        border: none;
        outline: none;
        padding-left: 10px;
        text-align: left;
        font-size: 14px;
        /*很关键：将默认的select选择框样式清除*/
        appearance: none;
        /*在选择框的最右侧中间显示小箭头图片*/
        background: url("../../assets/arrow_2.png") no-repeat scroll right center transparent;
        background-size: 15px;
        /*为下拉小箭头留出一点位置，避免被文字覆盖*/
        padding-right: 20px;
      }
      .option-color {
        color: rgb(151, 168, 190);
        option {
          color: #1f2d3d;
          font-size: 14px;
        }
      }
    }
    .mint-indicator-mask {
      top: 0;
      left: 0;
      position: fixed;
      width: 100%;
      height: 100%;
      opacity: 0.3;
      background: #000000;
    }
    .mint-indicator-wrapper {
      top: 50%;
      left: 50%;
      position: fixed;
      -webkit-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      border-radius: 5px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      box-sizing: border-box;
      text-align: center;
    }
    .my-data .save-wrapper {
      display: block;
      width: 100%;
      padding: 16px;
      overflow: visible;
      position: fixed;
      left: 0;
      bottom: 0;
      box-sizing: border-box;
      background-color: white;
    }
    .my-data .save-wrapper .save {
      display: block;
      width: 100%;
    }
    .my-data .add-child,
    .my-data .add-contact {
      margin-bottom: 10px;
      margin-top: 20px;
    }
    // 复写lable原有样式
    .my-data .el-form-item__label {
      font-weight: 900;
      font-size: 15px;
      color: #457aa3;
      padding-left: 12px;
    }
    .my-data .el-form-item__content {
      z-index: 0;
    }
    .my-data .contact-box {
      width: 100%;
    }
    .my-data .child,
    .my-data .contact {
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 0 10px 10px;
      position: relative;
    }
    .my-data .child {
      padding: 0 10px;
      margin-top: 20px;
    }
    .child-box {
      padding-bottom: 10px;
      border-bottom: 1px solid #d9d9d9;
    }
    .my-data .contact .el-input {
      width: 70%;
    }
    .my-data .child .el-input {
      width: 50%;
      input {
        padding-left: 0;
      }
    }
    .my-data .child:nth-of-type(n + 2),
    .my-data .contact:nth-of-type(n + 2) {
      margin-top: 22px;
    }
    .my-data .fa-error {
      color: red;
    }
    .my-data .upload-img-wrapper {
      display: inline-block;
      position: relative;
      margin-top: 10px;
      width: 100%;
    }
    .my-data .upload-btn {
      display: inline-block;
    }
    .my-data .upload-img-delBtn {
      margin-left: 10px;
    }
    .my-data .upload-img-box {
      box-sizing: border-box;
      display: inline-block;
      padding: 0 5px 0 0;
      width: 33.33%;
      height: 60px;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
    .my-data .upload-img-box1 {
      padding: 0;
      width: 100%;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      .upload-document-box {
        box-sizing: border-box;
        padding: 0 5px 0 0;
        width: 33.33%;
        text-align: center;
        line-height: 1;
        .upload-document-main {
          box-sizing: border-box;
          padding: 5px 0;
          height: 60px;
        }
        img {
          margin: 0 auto;
        }
        span {
          font-size: 12px;
        }
      }
    }
    .my-data .upload-img-wrapper img {
      display: block;
      width: 100%;
      height: 100%;
    }
    .my-data .shareOption-document-main {
      padding: 5px 0;
      height: 50px;
      line-height: 1;
    }
    .my-data .upload-img-wrapper .upload-img-document, .my-data .shareOption-document-main img {
      width: 32px;
      height: 35px;
    }
    .my-data .upload-img-wrapper .upload-img-box .upload-img-icon {
      position: relative;
      float: right;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      margin-top: -20px;
      margin-right: 4px;
    }
    .my-data .child-imgBox {
      margin-top: 10px;
      padding-left: 105px;
    }
    .my-data .child-img {
      display: block;
      width: 100%;
      max-height: 180px;
    }
    .my-data .el-form {
      margin: 0 16px;
    }
    .my-data .el-date-editor.el-input {
      width: 100%;
    }
    .my-data .child .el-form-item__content {
      margin-left: 0 !important;
    }

    .my-data .el-upload {
      text-align: left;
    }
    .my-data .el-form-item {
      margin-bottom: 0;
      padding: 10px 0;
      border-bottom: 1px solid #d9d9d9;
      input {
        border: none !important;
      }
    }
    .my-data .el-input-group__append {
      border: none;
    }
    .my-data .el-form-item__error {
      position: static;
      padding-top: 0;
      line-height: 1.3;
    }
    .my-data .el-select {
      display: block;
    }
    .my-data a {
      color: #26a2ff;
      text-decoration: none;
    }
    #imageScale-wrapper {
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
  }

  .el-form-item .el-form-item__label:before {
    content: '';
    float: left;
    margin-left: -12px;
  }
</style>
