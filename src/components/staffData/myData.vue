<template>
  <div id="MyData" v-if="status">
    <div class="my-data">

      <mt-navbar fixed v-model="selected" class="dataTitle">
        <mt-tab-item id="1"><span>个人资料</span></mt-tab-item>
        <mt-tab-item id="2"><span>岗位信息</span></mt-tab-item>
      </mt-navbar>

      <!-- tab-container -->
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="1">
          <div v-if="selected==='1'">
            <el-form label-position="left" :model="model" :label-width="labelWidth"
                     style="padding-bottom: 10px" ref="personFm">
              <div v-for="confListItem in confList" v-if="confListItem.isdefault===true">
                <div v-if="confListItem.jname==='name' && staff.name">
                  <el-form-item v-if="staff.name" label="姓名" prop="name"
                                :rules="{required: staff.name.isrequired, min: 2, max: 32, message: '请输入员工姓名(最少 2 个字符，最多 32 个字符)', trigger: 'change'}">
                    <el-input :disabled="!staff.name.isedit" placeholder="请输入姓名" v-model="model.name"></el-input>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='mobile' && staff.mobile">
                  <el-form-item v-if="staff.mobile" label="手机号" prop="mobile"
                                :rules="{required: staff.mobile.isrequired, message: '请输入正确的手机号', trigger: 'change', pattern: /^1\d{10}$/}">
                    <el-input :disabled="!staff.mobile.isedit" placeholder="请输入手机号" v-model="model.mobile"></el-input>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='gender' && staff.gender">
                  <el-form-item v-if="staff.gender" label="性别" prop="gender"
                                :rules="{required: staff.gender.isrequired,type: 'number', message: '请选择性别', trigger: 'change'}">
                    <p class="pl10 fc-bbb" v-text="model.gender===0 ? '女':(model.gender===1?'男':'')"></p>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='dateOfBirth' && staff.dateOfBirth">
                  <el-form-item v-if="staff.dateOfBirth" label="出生日期" prop="dateOfBirth"
                                :rules="{required: staff.dateOfBirth.isrequired, type: 'date', message: '请选择出生日期', trigger: 'change',validator:isDate}">
                    <p class="pl10" :class="{'fc-bbb':!staff.dateOfBirth.isedit}" v-text="model.dateOfBirth"></p>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='idcard' && staff.idcard">
                  <el-form-item v-if="staff.idcard" label="身份证号" prop="idcard"
                                :rules="{required: staff.idcard.isrequired, message: '请填写正确的身份证号', trigger: 'change',pattern: /^\d{17}(?:\d|[Xx])$/}">
                    <el-input :disabled="!staff.idcard.isedit" placeholder="请输入身份证号" @change="staffIdcard(model.idcard)"
                              v-model="model.idcard"></el-input>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='podoMessage' && staff.podoMessage">

                  <el-form-item v-if="staff.podoMessage" label="户口省份" prop="podoProvince"
                                :rules="{required: staff.podoMessage.isrequired, message: '请选择户口所在省份', trigger: 'change'}">
                    <select :disabled="!staff.podoMessage.isedit" v-model="model.podoProvince"
                            @change="queryPodoCities(model.podoProvince)" :class="{'option-color':!model.podoProvince}">
                      <option value="" disabled>请选择</option>
                      <option v-for="p in provinces" :key="p.uid" v-text="p.name" :value="p.uid"></option>
                    </select>
                  </el-form-item>

                  <el-form-item v-if="staff.podoMessage" label="户口城市" prop="podoCity"
                                :rules="{required: staff.podoMessage.isrequired, message: '请选择户口所在城市', trigger: 'change'}">
                    <select :disabled="!staff.podoMessage.isedit" v-model="model.podoCity"
                            :class="{'option-color':!model.podoCity}">
                      <option value="" disabled>请选择</option>
                      <option v-for="c in podoCities" :key="c.uid" v-text="c.name" :value="c.uid"></option>
                    </select>
                  </el-form-item>

                  <el-form-item v-if="staff.podoMessage" label="户口地址" prop="podoAddress"
                                :rules="[{required: staff.podoMessage.isrequired, message: '请输入正确的户口详细地址', trigger: 'change'},
                        {message: '不能超过256个字符', trigger: 'blur', max: 256}]">
                    <el-input :disabled="!staff.podoMessage.isedit" placeholder="请输入户口地址"
                              v-model="model.podoAddress"></el-input>
                  </el-form-item>

                  <el-form-item v-if="staff.podoMessage" label="户口性质" prop="typeOfDemicile"
                                :rules="{required: staff.podoMessage.isrequired, message: '请选择户口性质', trigger: 'change'}">
                    <select :disabled="!staff.podoMessage.isedit" v-model="model.typeOfDemicile"
                            :class="{'option-color':!model.typeOfDemicile}">
                      <option value="" disabled>请选择</option>
                      <option v-for="(v, k) in typeOfDemiciles" :key="k" v-text="v.name" :value="v.id"></option>
                    </select>
                  </el-form-item>
                </div>
              </div>
              <div v-for="confListItem in confList" v-if="confListItem.isdefault===false">
                <div v-if="confListItem.jname==='nativePlace' && staff.nativePlace">
                  <el-form-item v-if="staff.nativePlace" label="国籍" prop="nativePlace"
                                :rules="{required: staff.nativePlace.isrequired, message: '请选择国籍', trigger: 'change'}">
                    <select :disabled="!staff.nativePlace.isedit" v-model="model.nativePlace"
                            :class="{'option-color':!model.nativePlace}">
                      <option value="" disabled>请选择</option>
                      <option v-for="(v, k) in nativePlaces" :key="k" v-text="v.name" :value="v.id"></option>
                    </select>
                  </el-form-item>

                  <el-form-item v-if="staff.nativePlace && (model.nativePlace === '1'||model.nativePlace === '2')"
                                label="护照编号" prop="passportNum"
                                :rules="[{required: (staff.nativePlace.isrequired || (model.nativePlace !== '0')),  message: '请填写护照号', trigger: 'change'},
                                          {message: '请填写正确的护照号(字母和/或数字)', trigger: 'blur', pattern: /^[A-Za-z0-9]+$/},
                                          {message: '不能超过64个字符', trigger: 'blur', max: 64}]">
                    <el-input :disabled=" !staff.nativePlace.isedit" placeholder="请输入护照编号"
                              v-model="model.passportNum"></el-input>
                  </el-form-item>

                  <el-form-item v-if="staff.nativePlace && (model.nativePlace === '1'||model.nativePlace === '2')"
                                label="护照照片" prop="passportUrl"
                                :rules="{required: staff.nativePlace.isrequired, message: '请上传护照照片', trigger: 'blur'}">
                    <el-upload
                      v-if="staff.nativePlace.isedit"
                      action="/api/v1.0/client/upload"
                      name="files"
                      :show-file-list="false"
                      :headers="tokenHeader"
                      :on-success="passportUrlOk"
                      :before-upload="beforePassportUrl">
                      <el-button type="primary" size="small">
                        <span><i class="el-icon-upload el-icon--right"></i>上传照片</span>
                      </el-button>
                    </el-upload>
                    <el-button type="primary" size="small" v-if="!staff.nativePlace.isedit"
                               :disabled="!staff.nativePlace.isedit">
                      <span><i class="el-icon-upload el-icon--right"></i>上传照片</span>
                    </el-button>
                    <div v-if="model.passportUrl" class="upload-img-wrapper">
                      <img :src="model.passportUrl" @click="imageScaleOpen(model.passportUrl)"/>
                    </div>
                    <p class="uploadErrorTip" v-show="passportUrlErrFlag">
                      请上传正确的护照照片(格式为 jpg 或 jpeg 或 png，照片体积小于 5 兆)</p>
                  </el-form-item>

                  <el-form-item v-if="staff.nativePlace && model.nativePlace === '2'"
                                label="护照国家" prop="state"
                                :rules="{required: staff.nativePlace.isrequired, message: '请选择护照国家', trigger: 'change'}">
                    <select :disabled=" !staff.nativePlace.isedit" v-model="model.state"
                            :class="{'option-color':!model.state}">
                      <option value="" disabled>请选择</option>
                      <option v-for="item in states" :key="item.id" :label="item.name" :value="item.id"></option>
                    </select>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='idcardPhoUrl' && staff.idcardPhoUrl">
                  <el-form-item v-if="staff.idcardPhoUrl" label="身份证正面" prop="idcardPhoUrl"
                                :rules="{required: staff.idcardPhoUrl.isrequired, message: '请上传身份证照片', trigger: 'blur'}">
                    <el-upload
                      v-if="staff.idcardPhoUrl.isedit"
                      action="/api/v1.0/client/upload"
                      name="files"
                      :show-file-list="false"
                      :headers="tokenHeader"
                      :on-success="idcardPhoUrlOk"
                      :before-upload="beforeIdcardPhoUrl">
                      <el-button type="primary" size="small">
                        <span><i class="el-icon-upload el-icon--right"></i>上传照片</span>
                      </el-button>
                    </el-upload>
                    <el-button type="primary" size="small" v-if="!staff.idcardPhoUrl.isedit"
                               :disabled="!staff.idcardPhoUrl.isedit">
                      <span><i class="el-icon-upload el-icon--right"></i>上传照片</span>
                    </el-button>
                    <div v-if="model.idcardPhoUrl" class="upload-img-wrapper">
                      <img :src="model.idcardPhoUrl" @click="imageScaleOpen(model.idcardPhoUrl)"/>
                    </div>
                    <p class="uploadErrorTip" v-show="idcardPhoUrlErrFlag">
                      请上传正确的身份证正面照片(格式为 jpg 或 jpeg 或 png，照片体积小于 5 兆)</p>
                  </el-form-item>

                  <el-form-item v-if="staff.idcardPhoUrl" label="身份证背面" prop="idcardPhoUrlRev"
                                :rules="{required: staff.idcardPhoUrl.isrequired, message: '请上传身份证照片', trigger: 'blur'}">
                    <el-upload
                      v-if="staff.idcardPhoUrl.isedit"
                      action="/api/v1.0/client/upload"
                      name="files"
                      :show-file-list="false"
                      :headers="tokenHeader"
                      :on-success="idcardPhoUrlRevOk"
                      :before-upload="beforeIdcardPhoUrlRev">
                      <el-button type="primary" size="small">
                        <span><i class="el-icon-upload el-icon--right"></i>上传照片</span>
                      </el-button>
                    </el-upload>
                    <el-button type="primary" size="small" v-if="!staff.idcardPhoUrl.isedit"
                               :disabled="!staff.idcardPhoUrl.isedit">
                      <span><i class="el-icon-upload el-icon--right"></i>上传照片</span>
                    </el-button>
                    <div v-if="model.idcardPhoUrlRev" class="upload-img-wrapper">
                      <img :src="model.idcardPhoUrlRev" @click="imageScaleOpen(model.idcardPhoUrlRev)"/>
                    </div>
                    <p class="uploadErrorTip" v-show="idcardPhoUrlRevErrFlag">
                      请上传正确的身份证背面照片(格式为 jpg 或 jpeg 或 png，照片体积小于 5 兆)</p>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='socsecNum' && staff.socsecNum">
                  <el-form-item v-if="staff.socsecNum" label="社保编号" prop="socsecNum"
                                :rules="[{required: staff.socsecNum.isrequired,message: '请填写正确的社保编号(数字)', trigger: 'blur', pattern: /^\d+$/},
                        {message: '不能超过 24 个数字', trigger: 'blur', max:24}]">
                    <el-input :disabled="!staff.socsecNum.isedit" placeholder="请输入社保编号"
                              v-model="model.socsecNum"></el-input>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='accfuNum' && staff.accfuNum">
                  <el-form-item v-if="staff.accfuNum" label="公积金号" prop="accfuNum"
                                :rules="[{required: staff.accfuNum.isrequired, message: '请填写正确的公积金编号(数字)', trigger: 'blur',pattern: /^\d+$/},
                        {message: '不能超过24个数字', trigger: 'blur', max:24}]">
                    <el-input :disabled="!staff.accfuNum.isedit" placeholder="请输入公积金号"
                              v-model="model.accfuNum"></el-input>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='bankName' && staff.bankName">
                  <el-form-item v-if="staff.bankName" label="银行名称" prop="bankName"
                                :rules="{required: staff.bankName.isrequired, message: '请选择银行', trigger: 'blur'}">
                    <select :disabled="!staff.bankName.isedit" v-model="model.bankName"
                            :class="{'option-color':!model.bankName}">
                      <option value="" disabled>请选择</option>
                      <option v-for="(v, k) in bankNames" :key="k" v-text="v.name" :value="v.id"></option>
                    </select>
                  </el-form-item>

                  <el-form-item v-if="staff.bankName" label="开户行" prop="openingBank"
                                :rules="[{required: staff.bankName.isrequired, message: '请填写正确的开户行名称', trigger: 'blur'},
                        {message: '不能超过 64 个字符', trigger: 'blur', max: 64}]">
                    <el-input :disabled="!staff.bankName.isedit" placeholder="请输入开户行名称"
                              v-model="model.openingBank"></el-input>
                  </el-form-item>

                  <el-form-item v-if="staff.bankName" label="银行卡号" prop="cardNumber"
                                :rules="[{required: staff.bankName.isrequired, message: '请填写正确的银行卡号', trigger: 'blur',pattern: /^\d+$/},
                        {message: '最少 16 个数字', trigger: 'blur',min:16},
                        {message: '最多 64 个数字', trigger: 'blur',max:64}]">
                    <el-input :disabled="!staff.bankName.isedit" placeholder="请输入银行卡号"
                              v-model="model.cardNumber"></el-input>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='staffPhoUrl' && staff.staffPhoUrl">
                  <el-form-item v-if="staff.staffPhoUrl" label="员工照片" prop="staffPhoUrl"
                                :rules="{required: staff.staffPhoUrl.isrequired, message: '请上传员工照片', trigger: 'blur'}">
                    <el-upload
                      v-if="staff.staffPhoUrl.isedit"
                      action="/api/v1.0/client/upload"
                      name="files"
                      :show-file-list="false"
                      :headers="tokenHeader"
                      :on-success="staffPhoUrlOk"
                      :before-upload="beforeStaffPhoUrl">
                      <el-button type="primary" size="small">
                        <span><i class="el-icon-upload el-icon--right"></i>上传照片</span>
                      </el-button>
                    </el-upload>
                    <el-button type="primary" size="small" v-if="!staff.staffPhoUrl.isedit"
                               :disabled="!staff.staffPhoUrl.isedit">
                      <span><i class="el-icon-upload el-icon--right"></i>上传照片</span>
                    </el-button>
                    <div v-if="model.staffPhoUrl" class="upload-img-wrapper">
                      <img :src="model.staffPhoUrl" @click="imageScaleOpen(model.staffPhoUrl)"/>
                    </div>
                    <p class="uploadErrorTip" v-show="staffPhoUrlErrFlag">
                      请上传正确的员工照片(格式为 jpg 或 jpeg 或 png，照片体积小于 5 兆)</p>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='englishName' && staff.englishName">
                  <el-form-item v-if="staff.englishName" label="英文名" prop="englishName"
                                :rules="[{required: staff.englishName.isrequired,  message: '请填写正确的英文名', trigger: 'blur', pattern: /^[a-zA-Z]+$/},
                                  {message: '不能超过32个字符', trigger: 'blur', max: 32}]">
                    <el-input :disabled="!staff.englishName.isedit" placeholder="请输入您的英文名"
                              v-model="model.englishName"></el-input>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='qq' && staff.qq">
                  <el-form-item v-if="staff.qq" label="QQ" prop="qq"
                                :rules="[{required: staff.qq.isrequired,message: '请填写正确的 QQ 号(数字)', trigger: 'blur', pattern: /^\d+$/},
                        {message: '不能超过24个字符', trigger: 'blur',max: 24}]">
                    <el-input :disabled="!staff.qq.isedit" placeholder="请输入QQ号" v-model="model.qq"></el-input>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='wechart' && staff.wechart">
                  <el-form-item v-if="staff.wechart" label="微信" prop="wechart"
                                :rules="[{required: staff.wechart.isrequired,message: '请填写正确的微信号', trigger: 'blur', pattern: /^[a-zA-Z0-9-_]+$/},
                        {message: '不能少于6个或超过20个字符', trigger: 'blur',min:6,max: 20}]">
                    <el-input :disabled="!staff.wechart.isedit" placeholder="请输入微信号" v-model="model.wechart"></el-input>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='maritalStatus' && staff.maritalStatus">
                  <el-form-item v-if="staff.maritalStatus" label="婚姻状况" prop="maritalStatus"
                                :rules="{required: staff.maritalStatus.isrequired,message: '请选择婚姻状况', trigger: 'blur'}">
                    <select :disabled="!staff.maritalStatus.isedit" v-model="model.maritalStatus"
                            :class="{'option-color':!model.maritalStatus}">
                      <option value="" disabled>请选择</option>
                      <option v-for="(v, k) in maritalStatuses" :key="k" v-text="v.name" :value="v.id"></option>
                    </select>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='nation' && staff.nation">
                  <el-form-item v-if="staff.nation" label="民族" prop="nation"
                                :rules="{required: staff.nation.isrequired,message: '请选择民族', trigger: 'blur'}">
                    <select :disabled="!staff.nation.isedit" v-model="model.nation"
                            :class="{'option-color':!model.nation}">
                      <option value="" disabled>请选择</option>
                      <option v-for="(v, k) in nations" :key="k" v-text="v.name" :value="v.id"></option>
                    </select>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='politicsStatus' && staff.politicsStatus">
                  <el-form-item v-if="staff.politicsStatus" label="政治面貌" prop="politicsStatus"
                                :rules="{required: staff.politicsStatus.isrequired,message: '请选择政治面貌', trigger: 'change'}">
                    <select :disabled="!staff.politicsStatus.isedit" v-model="model.politicsStatus"
                            :class="{'option-color':!model.politicsStatus}">
                      <option value="" disabled>请选择</option>
                      <option v-for="(v, k) in politicsStatuses" :key="k" v-text="v.name" :value="v.id"></option>
                    </select>
                  </el-form-item>

                  <el-form-item v-if="model.politicsStatus === '2' && staff.politicsStatus" label="入党时间"
                                prop="thePartyTime"
                                :rules="{required: staff.politicsStatus.isrequired,type: 'date',message: '请选择入党时间', trigger: 'change',validator:isDate}">
                    <p class="pl10" v-if="staff.politicsStatus.isedit"
                       v-text="model.thePartyTime ? model.thePartyTime:'请选择日期' "
                       @click="openPicker(0,0,0,model.thePartyTime)"></p>
                    <p class="pl10 fc-bbb" v-else v-text="model.thePartyTime ? model.thePartyTime:'请选择日期'"></p>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='theArcIns' && staff.theArcIns">
                  <el-form-item v-if="staff.theArcIns" label="存档机构" prop="theArcIns"
                                :rules="[{required: staff.theArcIns.isrequired,message: '请输入正确的存档机构', trigger: 'change'},
                                  {message: '不能超过128个字符', trigger: 'blur', max: 128}]">
                    <el-input :disabled="!staff.theArcIns.isedit" placeholder="请输入存档机构"
                              v-model="model.theArcIns"></el-input>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='houregPhoUrl' && staff.houregPhoUrl">
                  <el-form-item v-if="staff.houregPhoUrl" label="户口本首页" prop="houregPhoUrl"
                                :rules="{required: staff.houregPhoUrl.isrequired, message: '请上传户口本首页照片', trigger: 'blur'}">
                    <el-upload
                      v-if="staff.houregPhoUrl.isedit"
                      action="/api/v1.0/client/upload"
                      name="files"
                      :show-file-list="false"
                      :headers="tokenHeader"
                      :on-success="houregPhoUrlOk"
                      :before-upload="beforeHouregPhoUrl">
                      <el-button type="primary" size="small">
                        <span><i class="el-icon-upload el-icon--right"></i>上传照片</span>
                      </el-button>
                    </el-upload>
                    <el-button type="primary" size="small" v-if="!staff.houregPhoUrl.isedit"
                               :disabled="!staff.houregPhoUrl.isedit">
                      <span><i class="el-icon-upload el-icon--right"></i>上传照片</span>
                    </el-button>
                    <div v-if="model.houregPhoUrl" class="upload-img-wrapper">
                      <img :src="model.houregPhoUrl" @click="imageScaleOpen(model.houregPhoUrl)"/>
                    </div>
                    <p class="uploadErrorTip" v-show="houregPhoUrlErrFlag">
                      请上传正确的户口本首页照片(格式为 jpg 或 jpeg 或 png，照片体积小于 5 兆)</p>
                  </el-form-item>

                  <el-form-item v-if="staff.houregPhoUrl" label="本人户口页" prop="houregPerphoUrl"
                                :rules="{required: staff.houregPhoUrl.isrequired, message: '请上传户口页照片', trigger: 'blur'}">
                    <el-upload
                      v-if="staff.houregPhoUrl.isedit"
                      action="/api/v1.0/client/upload"
                      name="files"
                      :show-file-list="false"
                      :headers="tokenHeader"
                      :on-success="houregPerphoUrlOk"
                      :before-upload="beforeHouregPerphoUrl">
                      <el-button type="primary" size="small">
                        <span><i class="el-icon-upload el-icon--right"></i>上传照片</span>
                      </el-button>
                    </el-upload>
                    <el-button type="primary" size="small" v-if="!staff.houregPhoUrl.isedit"
                               :disabled="!staff.houregPhoUrl.isedit">
                      <span><i class="el-icon-upload el-icon--right"></i>上传照片</span>
                    </el-button>
                    <div v-if="model.houregPerphoUrl" class="upload-img-wrapper">
                      <img :src="model.houregPerphoUrl" @click="imageScaleOpen(model.houregPerphoUrl)"/>
                    </div>
                    <p class="uploadErrorTip" v-show="houregPerphoUrlErrFlag">
                      请上传正确的户口本本人页照片(格式为 jpg 或 jpeg 或 png，照片体积小于 5 兆)</p>
                  </el-form-item>

                  <el-form-item v-if="staff.houregPhoUrl" label="本人户口页背面" prop="houregPerrevphoUrl"
                                :rules="{required: staff.houregPhoUrl.isrequired, message: '请上传户口页背面照片', trigger: 'blur'}">
                    <el-upload
                      v-if="staff.houregPhoUrl.isedit"
                      action="/api/v1.0/client/upload"
                      name="files"
                      :show-file-list="false"
                      :headers="tokenHeader"
                      :on-success="houregPerrevphoUrlOk"
                      :before-upload="beforeHouregPerrevphoUrl">
                      <el-button type="primary" size="small">
                        <span><i class="el-icon-upload el-icon--right"></i>上传照片</span>
                      </el-button>
                    </el-upload>
                    <el-button type="primary" size="small" v-if="!staff.houregPhoUrl.isedit"
                               :disabled="!staff.houregPhoUrl.isedit">
                      <span><i class="el-icon-upload el-icon--right"></i>上传照片</span>
                    </el-button>
                    <div v-if="model.houregPerrevphoUrl" class="upload-img-wrapper">
                      <img :src="model.houregPerrevphoUrl" @click="imageScaleOpen(model.houregPerrevphoUrl)"/>
                    </div>
                    <p class="uploadErrorTip" v-show="houregPerrevphoUrlErrFlag">
                      请上传正确的户口本本人页背面照片(格式为 jpg 或 jpeg 或 png，照片体积小于 5 兆)</p>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='ResperMessage' && staff.ResperMessage">
                  <el-form-item v-if="staff.ResperMessage" label="居住证">
                    <el-switch
                      :disabled="!staff.ResperMessage.isedit"
                      v-model="model.hasResper"
                      on-text="有"
                      off-text="无">
                    </el-switch>
                  </el-form-item>

                  <el-form-item v-if="model.hasResper && staff.ResperMessage" label="居住证省份" prop="residenceProvince"
                                :rules="{required: staff.ResperMessage.isrequired,message: '请选择居住证所在省份', trigger: 'change'}">
                    <select :disabled="!staff.ResperMessage.isedit" v-model="model.residenceProvince"
                            :class="{'option-color':!model.residenceProvince}"
                            @change="queryResidenceCities(model.residenceProvince)">
                      <option value="" disabled>请选择</option>
                      <option v-for="p in provinces" :key="p.uid" :label="p.name" :value="p.uid"></option>
                    </select>
                  </el-form-item>

                  <el-form-item v-if="model.hasResper && staff.ResperMessage" label="居住证城市" prop="residenceCity"
                                :rules="{required: staff.ResperMessage.isrequired,message: '请选择居住证所在城市', trigger: 'blur'}">

                    <select :disabled="!staff.ResperMessage.isedit" v-model="model.residenceCity"
                            :class="{'option-color':!model.residenceCity}">
                      <option value="" disabled>请选择</option>
                      <option v-for="c in residenceCities" :key="c.uid" :label="c.name" :value="c.uid"></option>
                    </select>
                  </el-form-item>

                  <el-form-item v-if="model.hasResper && staff.ResperMessage" label="居住证办理时间" prop="resperst"
                                :rules="{required: staff.ResperMessage.isrequired,type: 'date', message: '请选择居住证办理时间', trigger: 'change',validator:isDate}">
                    <p class="pl10" v-if="staff.ResperMessage.isedit" v-text="model.resperst ? model.resperst:'请选择日期'"
                       @click="openPicker(0,1,0,model.resperst)"></p>
                    <p class="pl10 fc-bbb" v-else v-text="model.resperst ? model.resperst:'请选择日期'"></p>
                  </el-form-item>

                  <el-form-item v-if="model.hasResper && staff.ResperMessage" label="居住证截止日期" prop="resperet"
                                :rules="{required: staff.ResperMessage.isrequired,type: 'date', message: '请选择居住证截止日期', trigger: 'change',validator:isResperDate}">
                    <p class="pl10" v-if="staff.ResperMessage.isedit" v-text="model.resperet ? model.resperet:'请选择日期' "
                       @click="openPicker(0,2,0,model.resperet)"></p>
                    <p class="pl10 fc-bbb" v-else v-text="model.resperet ? model.resperet:'请选择日期' "></p>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='poreLocation' && staff.poreLocation">
                  <el-form-item v-if="staff.poreLocation" label="现居住地省份" prop="poreProvince"
                                :rules="{required: staff.poreLocation.isrequired, message: '请选择现居住地所在省份', trigger: 'change'}">

                    <select :disabled="!staff.poreLocation.isedit" v-model="model.poreProvince"
                            :class="{'option-color':!model.poreProvince}"
                            @change="queryPoreCities(model.poreProvince)">
                      <option value="" disabled>请选择</option>
                      <option v-for="p in provinces" :key="p.uid" :label="p.name" :value="p.uid"></option>
                    </select>
                  </el-form-item>

                  <el-form-item v-if="staff.poreLocation" label="现居住地城市" prop="poreCity"
                                :rules="{required: staff.poreLocation.isrequired,message: '请选择现居住地所在城市', trigger: 'change'}">

                    <select :disabled="!staff.poreLocation.isedit" v-model="model.poreCity"
                            :class="{'option-color':!model.poreCity}">
                      <option value="" disabled>请选择</option>
                      <option v-for="c in poreCities" :key="c.uid" :label="c.name" :value="c.uid"></option>
                    </select>
                  </el-form-item>

                  <el-form-item v-if="staff.poreLocation" label="现居住地址" prop="poreAddress"
                                :rules="[{required: staff.poreLocation.isrequired,message: '请输入正确的现居住地详细地址', trigger: 'change'},
                        {message: '不能超过 256 个字符', trigger: 'blur', max: 256}]">
                    <el-input :disabled="!staff.poreLocation.isedit" placeholder="请输入现居住地址"
                              v-model="model.poreAddress"></el-input>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='personalEmail' && staff.personalEmail">
                  <el-form-item v-if="staff.personalEmail" label="个人邮箱" prop="personalEmail"
                                :rules="{required: staff.personalEmail.isrequired,type: 'email', message: '请输入正确的个人邮箱', trigger: 'change', max: 30}">
                    <el-input :disabled="!staff.personalEmail.isedit" placeholder="请输入邮箱"
                              v-model="model.personalEmail"></el-input>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='emergencyContact' && staff.emergencyContact">
                  <el-form-item v-if="staff.emergencyContact" label-width="0" class="contact-box">
                    <!--<label>紧急联系人</label>-->
                    <h4 class="fs15"><span v-if="staff.emergencyContact.isrequired" class="fsStar">*</span>紧急联系人</h4>
                    <div v-if="staff.emergencyContact" class="contacts-wrapper">
                      <div class="contact" :span="24" v-for="(item, idx) in model.contacts">
                        <el-form-item label="姓名" label-width="4em"
                                      :prop="'contacts[' + idx + '].emergContact'"
                                      :rules="[{required:staff.emergencyContact.isrequired, message: '请输入姓名', trigger: 'blur'},
                            {message: ' 长度小于32个字符', trigger: 'blur', max: 32}]">
                          <el-input :disabled="!staff.emergencyContact.isedit" placeholder="请输入联系人姓名"
                                    v-model="item.emergContact">
                            <el-button v-if="idx > 0" :disabled="!staff.emergencyContact.isedit"
                                       slot="append"
                                       @click="rmvContact(item)"><i
                              class="el-icon-delete"></i></el-button>
                          </el-input>
                        </el-form-item>
                        <el-form-item label="电话" label-width="4em" :prop="'contacts[' + idx + '].emergContactPhone'"
                                      :rules="{required:staff.emergencyContact.isrequired,message: '请输入紧急联系人电话', trigger: 'blur', pattern: /^1\d{10}$/}">
                          <el-input :disabled="!staff.emergencyContact.isedit" placeholder="请输入联系电话"
                                    v-model="item.emergContactPhone"></el-input>
                        </el-form-item>
                      </div>
                      <el-row>
                        <el-col align="center" :span="24">
                          <el-button :disabled="!staff.emergencyContact.isedit" v-if="model.contacts.length < 3"
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
                <div v-else-if="confListItem.jname==='hasChilds' && staff.hasChilds">
                  <el-form-item v-if="staff.hasChilds" label="是否有子女">
                    <el-switch
                      :disabled="!staff.hasChilds.isedit"
                      v-model="model.hasChild"
                      on-text="有"
                      off-text="无">
                    </el-switch>
                  </el-form-item>
                  <div class="child-box" v-if="staff.hasChilds && model.hasChild">
                    <div class="child" v-for="(item, idx) in model.childs">
                      <el-form-item label="子女姓名" :prop="'childs[' + idx + '].name'" label-position="top"
                                    labelWidth="105px"
                                    :rules="[{required: staff.hasChilds.isrequired, message: '请输入子女姓名', trigger: 'change'},
                                    {message: ' 长度小于32个字符', trigger: 'blur', max: 32,}]">
                        <el-input :disabled="!staff.hasChilds.isedit" placeholder="请输入子女姓名" v-model="item.name">
                          <el-button slot="append" v-if="idx > 0" :disabled="!staff.hasChilds.isedit"
                                     @click="rmvChild(item)">
                            <i class="el-icon-delete"></i>
                          </el-button>
                        </el-input>
                      </el-form-item>
                      <el-form-item label="子女性别" :prop="'childs[' + idx + '].gender'" labelWidth="105px"
                                    :rules="{required: staff.hasChilds.isrequired,type: 'number', message: '请选择子女性别', trigger: 'blur'}">
                        <el-radio-group :disabled="!staff.hasChilds.isedit" v-model="item.gender">
                          <el-radio :label="1">男</el-radio>
                          <el-radio :label="0">女</el-radio>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item label="子女出生日期" :prop="'childs[' + idx + '].dateOfBirth'" labelWidth="105px"
                                    :rules="{required: staff.hasChilds.isrequired,type: 'date', message: '请选择出生日期', trigger: 'blur',validator:isDate}">
                        <p class="pl10" v-if="staff.hasChilds.isedit"
                           v-text="item.dateOfBirth ? item.dateOfBirth:'请选择日期' "
                           @click="openPicker(0,3,idx,item.dateOfBirth)"></p>
                        <p class="pl10 fc-bbb" v-else v-text="item.dateOfBirth ? item.dateOfBirth:'请选择日期'"></p>
                      </el-form-item>
                      <el-form-item label="子女出生证明" labelWidth="105px">
                        <el-upload
                          v-if="staff.hasChilds.isedit"
                          action="/api/v1.0/client/upload"
                          name="files"
                          :show-file-list="false"
                          :headers="tokenHeader"
                          :on-success="makeChildOk(item)"
                          :before-upload="makeChildCheck(item)">
                          <el-button type="primary" size="small">
                            <span><i class="el-icon-upload el-icon--right"></i>上传照片</span>
                          </el-button>
                        </el-upload>
                        <el-button type="primary" size="small" v-if="!staff.hasChilds.isedit"
                                   :disabled="!staff.hasChilds.isedit">
                          <span><i class="el-icon-upload el-icon--right"></i>上传照片</span>
                        </el-button>
                        <div class="child-imgBox">
                          <img class="child-img" v-if="item.birthCertifUrl" :src="item.birthCertifUrl"
                               @click="imageScaleOpen(item.birthCertifUrl)"/>
                        </div>
                        <p class="uploadErrorTip" v-show="item.err">请上传正确的出生证明(格式为 jpg 或 jpeg 或 png，照片体积小于 5 兆)</p>
                      </el-form-item>
                      <p class="p10 fs12">如子女不满1周岁需要提供出生证明</p>
                    </div>
                    <el-row>
                      <el-col align="center" :span="24">
                        <el-button class="add-child" type="primary" size="small" :disabled="!staff.hasChilds.isedit"
                                   @click="addChild">
                          <span>添加子女</span>
                        </el-button>
                      </el-col>
                    </el-row>

                  </div>
                  <!--</el-form-item>-->
                </div>
                <div v-else-if="confListItem.jname==='finallyEmpCom' && staff.finallyEmpCom">
                  <el-form-item v-if="staff.finallyEmpCom" label="上一家受聘公司" prop="finallyEmpCom"
                                :rules="[{required: staff.finallyEmpCom.isrequired,message: '请输入正确的上一家受聘公司', trigger: 'change'},
                                {message: '不能超过 255 个字符', trigger: 'blur', max: 255}]">
                    <el-input :disabled="!staff.finallyEmpCom.isedit" placeholder="请输入上一家受聘公司"
                              v-model="model.finallyEmpCom"></el-input>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='eduInfor' && staff.eduInfor">
                  <el-form-item v-if="staff.eduInfor" label="最高学历" prop="maxinumDeucaLevel"
                                :rules="{required: staff.eduInfor.isrequired, message: '请选择最高学历', trigger: 'blur'}">
                    <select :disabled="!staff.eduInfor.isedit" v-model="model.maxinumDeucaLevel"
                            :class="{'option-color':!model.maxinumDeucaLevel}">
                      <option value="" disabled>请选择</option>
                      <option v-for="(v, k) in maxinumDeucaLevels" :key="k" v-text="v.name" :value="v.id"></option>
                    </select>
                  </el-form-item>

                  <el-form-item v-if="staff.eduInfor" label="学历类型" prop="diplomaType"
                                :rules="{required: staff.eduInfor.isrequired, message: '请选择学历类型', trigger: 'blur',validator:noopValidat}">
                    <select :disabled="!staff.eduInfor.isedit" v-model="model.diplomaType"
                            :class="{'option-color':!model.diplomaType}">
                      <option value="" disabled>请选择学历类型</option>
                      <option v-for="(v, k) in diplomaTypes" :key="k" v-text="v.name" :value="v.id"></option>
                    </select>
                  </el-form-item>

                  <el-form-item v-if="staff.eduInfor" label="毕业院校" prop="graduateInst"
                                :rules="[{required: staff.eduInfor.isrequired, message: '请输入正确的毕业院校', trigger: 'change'},
                        {message: '不能超过64个字符', trigger: 'blur', max: 64}]">
                    <el-input :disabled="!staff.eduInfor.isedit" placeholder="请输入毕业院校"
                              v-model="model.graduateInst"></el-input>
                  </el-form-item>

                  <el-form-item v-if="staff.eduInfor" label="入学日期" prop="entSchst"
                                :rules="{required: staff.eduInfor.isrequired,type: 'date', message: '请选择入学日期', trigger: 'change',validator:isDate}">
                    <p class="pl10" v-if="staff.eduInfor.isedit" v-text="model.entSchst ? model.entSchst:'请选择日期' "
                       @click="openPicker(1,4,0,model.entSchst)"></p>
                    <p class="pl10 fc-bbb" v-else v-text="model.entSchst ? model.entSchst:'请选择日期' "></p>
                  </el-form-item>

                  <el-form-item v-if="staff.eduInfor" label="毕业日期" prop="entSchet"
                                :rules="{required: staff.eduInfor.isrequired,type: 'date', message: '请选择毕业日期', trigger: 'change',validator:isDates}">
                    <p class="pl10" v-if="staff.eduInfor.isedit" v-text="model.entSchet ? model.entSchet:'请选择日期' "
                       @click="openPicker(1,5,0,model.entSchet)"></p>
                    <p class="pl10 fc-bbb" v-else v-text="model.entSchet ? model.entSchet:'请选择日期' "></p>
                  </el-form-item>

                  <el-form-item v-if="staff.eduInfor" label="专业" prop="major"
                                :rules="[{required: staff.eduInfor.isrequired,message: '请输入正确的专业名称', trigger: 'change'},
                        {message: '不能超过32个字符', trigger: 'blur',max: 32}]">
                    <el-input :disabled="!staff.eduInfor.isedit" placeholder="请输入专业" v-model="model.major"></el-input>
                  </el-form-item>

                  <el-form-item v-if="staff.eduInfor" label="学位证书" prop="diplomaUrl"
                                :rules="{required: staff.eduInfor.isrequired, message: '请上传学位证书照片', trigger: 'blur'}">
                    <el-upload
                      v-if="staff.eduInfor.isedit"
                      action="/api/v1.0/client/upload"
                      name="files"
                      :show-file-list="false"
                      :headers="tokenHeader"
                      :on-success="diplomaUrlOk"
                      :before-upload="beforeDiplomaUrl">
                      <el-button type="primary" size="small">
                        <span><i class="el-icon-upload el-icon--right"></i>上传照片</span>
                      </el-button>
                    </el-upload>
                    <el-button type="primary" size="small" v-if="!staff.eduInfor.isedit"
                               :disabled="!staff.eduInfor.isedit">
                      <span><i class="el-icon-upload el-icon--right"></i>上传照片</span>
                    </el-button>
                    <div v-if="model.diplomaUrl" class="upload-img-wrapper">
                      <img :src="model.diplomaUrl" @click="imageScaleOpen(model.diplomaUrl)"/>
                    </div>
                    <p class="uploadErrorTip" v-show="diplomaUrlErrFlag">
                      请上传正确的学位证书照片(格式为 jpg 或 jpeg 或 png，照片体积小于 5 兆)</p>
                  </el-form-item>

                  <el-form-item v-if="staff.eduInfor" label="毕业证书" prop="greducaCertUrl"
                                :rules="{required: staff.eduInfor.isrequired, message: '请上传毕业证书照片', trigger: 'blur'}">
                    <el-upload
                      v-if="staff.eduInfor.isedit"
                      action="/api/v1.0/client/upload"
                      name="files"
                      :show-file-list="false"
                      :headers="tokenHeader"
                      :on-success="greducaCertUrlOk"
                      :before-upload="beforeGreducaCertUrl">
                      <el-button type="primary" size="small">
                        <span><i class="el-icon-upload el-icon--right"></i>上传照片</span>
                      </el-button>
                    </el-upload>
                    <el-button type="primary" size="small" v-if="!staff.eduInfor.isedit"
                               :disabled="!staff.eduInfor.isedit">
                      <span><i class="el-icon-upload el-icon--right"></i>上传照片</span>
                    </el-button>
                    <div v-if="model.greducaCertUrl" class="upload-img-wrapper">
                      <img :src="model.greducaCertUrl" @click="imageScaleOpen(model.greducaCertUrl)"/>
                    </div>
                    <p class="uploadErrorTip" v-show="greducaCertUrlErrFlag">
                      请上传正确的毕业证书照片(格式为 jpg 或 jpeg 或 png，照片体积小于 5 兆)</p>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='technicalTitle' && staff.technicalTitle">
                  <el-form-item v-if="staff.technicalTitle" label="职称" prop="technicalTitle"
                                :rules="[{required: staff.technicalTitle.isrequired, message: '请输入正确的职称', trigger: 'change'},
                        {message: '不能超过32个字符', trigger: 'blur', max: 32}]">
                    <el-input :disabled="!staff.technicalTitle.isedit" placeholder="请输入职称"
                              v-model="model.technicalTitle"></el-input>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='resumeUrl' && staff.resumeUrl">
                  <el-form-item v-if="staff.resumeUrl" label="简历" prop="resumeUrl"
                                :rules="{required: staff.resumeUrl.isrequired, message: '请上传简历', trigger: 'blur'}">
                    <el-upload
                      v-if="staff.resumeUrl.isedit"
                      action="/api/v1.0/client/upload"
                      name="files"
                      :show-file-list="false"
                      :headers="tokenHeader"
                      :on-success="resumeUrlOk"
                      :before-upload="beforeResumeUrl">
                      <el-button type="primary" size="small">
                        <span><i class="el-icon-upload el-icon--right"></i>上传简历</span>
                      </el-button>
                    </el-upload>
                    <el-button type="primary" size="small" v-if="!staff.resumeUrl.isedit"
                               :disabled="!staff.resumeUrl.isedit">
                      <span><i class="el-icon-upload el-icon--right"></i>上传简历</span>
                    </el-button>
                    <div v-if="model.resumeUrls.length" class="upload-img-wrapper">
                      <div v-for="(item, idx) in model.resumeUrls" :class="{'upload-img-box':isFormatImg(item.url)}">
                        <img v-if="isFormatImg(item.url)" :src="item.url" @click="imageScaleOpen(item.url)"/>
                        <a v-else :href="item.url + `&openId=${tokenHeader.openId}`">文档上传成功</a>
                      </div>
                    </div>
                    <p class="uploadErrorTip" v-show="resumeUrlErrFlag">
                      请上传正确的简历文档或图片(文档格式为 doc 或 docx 或 pdf，图片格式为 jpg 或 jpeg 或 png，单个文档或图片体积小于 5 兆，文档最多一个，图片可以多个)</p>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='hasComres' && staff.hasComres">
                  <el-form-item v-if="staff.hasComres" label="是否有竞业协议">
                    <el-switch
                      :disabled="!staff.hasComres.isedit"
                      v-model="model.hasComres"
                      on-text="有"
                      off-text="无">
                    </el-switch>
                  </el-form-item>
                  <el-form-item v-if="model.hasComres && staff.hasComres" label="竞业协议备注" prop="hasComresRmk"
                                :rules="[{required: staff.hasComres.isrequired,message: '请输入备注信息', trigger: 'blur'},
                        {message: '不能超过32个字符', trigger: 'blur', max: 32}]">
                    <el-input :disabled="!staff.hasComres.isedit" v-model="model.hasComresRmk"
                              placeholder="备注信息"></el-input>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='emplsepacertUrl' && staff.emplsepacertUrl">
                  <el-form-item v-if="staff.emplsepacertUrl" label="离职证明" prop="emplsepacertUrl"
                                :rules="{required: staff.emplsepacertUrl.isrequired, message: '请上传离职证明照片', trigger: 'blur'}">
                    <el-upload
                      v-if="staff.emplsepacertUrl.isedit"
                      action="/api/v1.0/client/upload"
                      name="files"
                      :show-file-list="false"
                      :headers="tokenHeader"
                      :on-success="emplsepacertUrlOk"
                      :before-upload="beforeEmplsepacertUrl">
                      <el-button type="primary" size="small">
                        <span><i class="el-icon-upload el-icon--right"></i>上传照片</span>
                      </el-button>
                    </el-upload>
                    <el-button type="primary" size="small" v-if="!staff.emplsepacertUrl.isedit"
                               :disabled="!staff.emplsepacertUrl.isedit">
                      <span><i class="el-icon-upload el-icon--right"></i>上传照片</span>
                    </el-button>
                    <div v-if="model.emplsepacertUrl" class="upload-img-wrapper">
                      <img :src="model.emplsepacertUrl" @click="imageScaleOpen(model.emplsepacertUrl)"/>
                    </div>
                    <p class="uploadErrorTip" v-show="emplsepacertUrlErrFlag">
                      请上传正确的离职证明照片(格式为 jpg 或 jpeg 或 png，照片体积小于 5 兆)</p>
                  </el-form-item>
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
            <el-form label-position="left" :model="model" ref="postFm" :label-width="labelWidth">
              <div v-for="confListItem in confList" v-if="confListItem.isdefault===true">
                <div v-if="confListItem.jname==='contracMes' && staffRecord.contracMes">
                  <el-form-item v-if="staffRecord.contracMes" label="合同类型">
                    <span>{{contractTypes && contractTypes[model.record.contract.contracType.toString()]}}</span>
                  </el-form-item>
                  <!-- 劳动合同 -->
                  <el-form-item v-if="model.record.contract.contracType === '0' && staffRecord.contracMes"
                                label="合同生效日期">
                    <span>{{datefmt(model.record.contract.startTime)}}</span>
                  </el-form-item>

                  <el-form-item v-if="model.record.contract.contracType === '0' && staffRecord.contracMes" label="合同期限">
                <span
                  v-text="model.record.contract.contractPeriod===-1 ? '无固定期限' : (model.record.contract.contractPeriod%12===0 ? model.record.contract.contractPeriod/12+'年' : (model.record.contract.contractPeriod%6===0 ? '半年' : model.record.contract.contractPeriod+'个月'))"></span>
                  </el-form-item>
                  <el-form-item v-if="model.record.contract.contracType === '0' && staffRecord.contracMes"
                                label="合同结束日期">
                    <span>{{ formalEndTime }}</span>
                  </el-form-item>
                  <el-form-item v-if="model.record.contract.contracType === '0' && staffRecord.contracMes"
                                label="候选人来源渠道">
                    <span>{{recruitmentChannels[+model.record.contract.recruitmentChannel]}}</span>
                  </el-form-item>
                  <el-form-item v-if="model.record.contract.contracType === '0' && staffRecord.contracMes" label="基础薪资">
                    <span>{{model.record.baseSalary}}元</span>
                  </el-form-item>
                  <el-form-item v-if="model.record.contract.contracType === '0' && staffRecord.contracMes" label="试用薪资">
                    <span>{{model.record.trialSalary}}元</span>
                  </el-form-item>
                  <el-form-item v-if="model.record.contract.contracType === '0' && staffRecord.contracMes" label="试用期">
                    <span>{{probations && probations[model.record.probation.toString()]}}</span>
                  </el-form-item>
                  <!-- 实习合同 -->
                  <el-form-item label="实习合同生效日期"
                                v-if="model.record.contract.contracType === '1' && staffRecord.contracMes">
                    <span>{{datefmt(model.record.contract.startTime)}}</span>
                  </el-form-item>
                  <el-form-item label="实习合同结束日期"
                                v-if="model.record.contract.contracType === '1' && staffRecord.contracMes">
                    <span>{{datefmt(model.record.contract.endTime)}}</span>
                  </el-form-item>
                  <!-- 返聘 -->
                  <el-form-item label="返聘合同生效日期"
                                v-if="model.record.contract.contracType === '2' && staffRecord.contracMes">
                    <span>{{datefmt(model.record.contract.startTime)}}</span>
                  </el-form-item>
                  <el-form-item label="返聘合同结束日期"
                                v-if="model.record.contract.contracType === '2' && staffRecord.contracMes">
                    <span>{{datefmt(model.record.contract.endTime)}}</span>
                  </el-form-item>
                  <!-- 兼职 -->
                  <el-form-item label="兼职协议生效日期"
                                v-if="model.record.contract.contracType === '3' && staffRecord.contracMes">
                    <span>{{datefmt(model.record.contract.startTime)}}</span>
                  </el-form-item>
                  <el-form-item label="兼职协议结束日期"
                                v-if="model.record.contract.contracType === '3' && staffRecord.contracMes">
                    <span>{{datefmt(model.record.contract.endTime)}}</span>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='dateOfEntry' && staffRecord.dateOfEntry">
                  <el-form-item v-if="staffRecord.dateOfEntry" label="入职时间">
                    <span>{{datefmt(model.record.dateOfEntry)}}</span>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='companyAge' && staffRecord.companyAge">
                  <el-form-item v-if="staffRecord.companyAge" label="司龄">
                    <span>{{isCompanyAge}} 年(司龄计算是根据入职日期开始计算)</span>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='deptUid' && staffRecord.deptUid">
                  <el-form-item label="所在部门" v-if="staffRecord.deptUid">
                    <span>{{emp && emp.record && emp.record.deptName}}</span>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='position' && staffRecord.position">
                  <el-form-item v-if="staffRecord.position" label="职位">
                    <span>{{model.record.position}}</span>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='jobGrade' && staffRecord.jobGrade">
                  <el-form-item v-if="staffRecord.jobGrade" label="职级">
                    <span>{{model.record.jobGrade}}</span>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='workAge' && staffRecord.workAge">
                  <el-form-item v-if="staffRecord.workAge" label="首次工作时间">
                    <span>{{datefmt(model.record.fristWorkTime)}}</span>
                  </el-form-item>
                  <el-form-item v-if="staffRecord.workAge" label="工龄">
                    <span>{{isWorkAge}} 年(工龄计算是根据首次参加工作时间开始计算)</span>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='jobNumber' && staffRecord.jobNumber">
                  <el-form-item v-if="staffRecord.jobNumber" label="工号">
                    <span>{{model.record.jobNumber}}</span>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='StaffStatus' && staffRecord.StaffStatus">
                  <el-form-item v-if="staffRecord.StaffStatus && (model.record.sstaffStatus== state.id)"
                                v-for="(state,index) in staffStatusList" :key="index" label="员工状态">
                    <span v-text="state.name"></span>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='reporterJobNumber' && staffRecord.reporterJobNumber">
                  <el-form-item v-if="staffRecord.reporterJobNumber" label="汇报上级">
                    <span>{{staffRecord.upji}}</span>
                  </el-form-item>
                </div>
              </div>
              <div v-for="confListItem in confList" v-if="confListItem.isdefault===false">
                <div v-if="confListItem.jname==='workLocation' && staffRecord.workLocation">
                  <el-form-item v-if="staffRecord.workLocation" label="工作地省份">
                    <span v-text="getPC(model.record.workProvince || '', model.record.workCity || '')"></span>
                  </el-form-item>
                  <el-form-item v-if="staffRecord.workLocation" label="工作地城市">
                    <span>{{staticWorkCity}}</span>
                  </el-form-item>
                  <el-form-item v-if="staffRecord.workLocation" label="工作地址">
                    <span>{{model.record.workAddress}}</span>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='workEmail' && staffRecord.workEmail">
                  <el-form-item v-if="staffRecord.workEmail" label="工作邮箱">
                    <span>{{model.record.workEmail}}</span>
                  </el-form-item>
                </div>
              </div>
            </el-form>
            <el-form label-position="left" :model="model" ref="optionFm" :label-width="labelWidth">
              <div v-for="confListItem in confList" v-if="confListItem.isdefault===true">
                <div v-if="confListItem.jname==='awardDate' && staffShareOption.awardDate">
                  <el-form-item v-if="staffShareOption.awardDate" label="授予日期">
                    <span>{{datefmt(model.shareOption.awardDate)}}</span>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='awardAmount' && staffShareOption.awardAmount">
                  <el-form-item v-if="staffShareOption.awardAmount" label="授予数量">
                    <span>{{model.shareOption.awardAmount}}</span>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='awardRound' && staffShareOption.awardRound">
                  <el-form-item v-if="staffShareOption.awardRound" label="授予轮次">
                    <span>{{model.shareOption.awardRound}}轮</span>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='exercSchedule' && staffShareOption.exercSchedule">
                  <el-form-item v-if="staffShareOption.exercSchedule" label="行权期">
                    <span>{{model.shareOption.exercSchedule}}月</span>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='terminallyCount' && staffShareOption.terminallyCount">
                  <el-form-item v-if="staffShareOption.terminallyCount" label="每期数量">
                    <span>{{model.shareOption.terminallyCount}}</span>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='contractUrl' && staffShareOption.contractUrl">
                  <el-form-item v-if="staffShareOption.contractUrl" label="期权合同">
                    <a v-if="model.shareOption.contractUrl"
                       :href="model.shareOption.contractUrl + `&openId=${tokenHeader.openId}`"></a>
                    <span v-else>未上传</span>
                  </el-form-item>
                </div>
              </div>
              <div v-for="confListItem in confList" v-if="confListItem.isdefault===false">
                <div v-if="confListItem.jname==='awardRate' && staffShareOption.awardRate">
                  <el-form-item v-if="staffShareOption.awardRate" label="授予总比例">
                    <span>{{model.shareOption.awardRate}}%</span>
                  </el-form-item>
                </div>
                <div v-else-if="confListItem.jname==='terminallyRate' && staffShareOption.terminallyRate">
                  <el-form-item v-if="staffShareOption.terminallyRate" label="每期比例">
                    <span>{{model.shareOption.terminallyRate}}%</span>
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
        closeOnClickModal="false"
      >
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
      @confirm="handleConfirm"
    >
    </mt-datetime-picker>
  </div>
</template>
<script>

  import moment from 'moment'
  import ElementUI from 'element-ui'
  import 'element-ui/lib/theme-default/index.css'
  import V from 'vue'
  import utils from '@/components/utils'
  import {Indicator, Switch} from 'mint-ui';
  V.use(ElementUI);

  let df1 = 'YYYY-MM-DD';
  let df2 = 'YYYY-MM';
  // ====日历组件需求开始====
  let df3 = 'YYYY-MM-DD';
  let df4 = 'YYYY-MM';
  let pickerslot = document.getElementsByClassName('picker-slot');
  // ====日历组件需求结束====
  export default {
    data() {
      return {
        // =====日历选择器字段开始=====
        startDate: '',
        nowDateTime: new Date(),
        selectDateTime: '',
        dateType: 0,
        type: 0,
        pos: 0, // 如果日期是在数组中，判断在数组中的位置
        // =====日历选择器字段结束=====

        startTimeValue1: '',
        imageScale: false,// 图片点击全屏显示
        imageScaleUrl: '', //图片点击全屏显示的图片地址
        loadProvince1: true, // 省市联动
        loadProvince2: true, // 省市联动
        loadProvince3: true, // 省市联动
        selected: '1',
        status: false,
        staffStatusList: [],//  员工状态列表
        // invisible: true,
        confList: null,
        emp: null,
        staticWorkCity: '',
        tokenHeader: {
          charset: 'utf-8',
          openId: this.getCookie('openId')
        },
        staff: {
          name: '',
          socsecNum: '',
          accfuNum: '',
          bankName: '',
          staffPhoUrl: '',
          englishName: '',
          qq: '',
          wechart: '',
          nation: '',
          maritalStatus: '',
          politicsStatus: '',
          thePartyTime: '',
          theArcIns: '',
          dateOfBirth: '',
          podoMessage: '',
          gender: '',
          houregPhoUrl: '',
          ResperMessage: '',
          poreLocation: '',
          mobile: '',
          personalEmail: '',
          hasChilds: '',
          finallyEmpCom: '',
          eduInfor: '',
          nativePlace: '',
          technicalTitle: '',
          resumeUrl: '',
          hasComres: '',
          idcard: '',
          emplsepacertUrl: '',
          idcardPhoUrl: ''
        },
        staffRecord: {
          contracMes: '',
          dateOfEntry: '',
          // StaffStatus: '',
          probation: '',
          position: '',
          jobGrade: '',
          deptUid: '',
          workEmail: '',
          jobNumber: '',
          reporterJobNumber: '',
          workLocation: '',
          becomeFullTime: '',
          upji: '',
        },
        staffShareOption: {
          awardDate: '',
          awardAmount: '',
          awardRate: '',
          awardRound: '',
          exercSchedule: '',
          terminallyCount: '',
          terminallyRate: '',
          contractUrl: ''
        },
        publicParams: null,
        labelWidth: '125px',
        passportUrlErrFlag: '',
        idcardPhoUrlErrFlag: '',
        idcardPhoUrlRevErrFlag: '',
        staffPhoUrlErrFlag: '',
        houregPhoUrlErrFlag: '',
        houregPerphoUrlErrFlag: '',
        houregPerrevphoUrlErrFlag: '',
        diplomaUrlErrFlag: '',
        greducaCertUrlErrFlag: '',
        resumeUrlErrFlag: '',
        emplsepacertUrlErrFlag: '',
        contractUrlErrFlag: '',
        recordContractUrlErrFlag: '',
        genders: [{id: 1, name: '男'}, {id: 0, name: '女'}],
        nativePlaces: null,
        bankNames: null,
        maritalStatuses: null,
        nations: null,
        politicsStatuses: null,
        provinces: null,
        podoCities: null,
        typeOfDemiciles: null,
        residenceCities: null,
        poreCities: null,
        maxinumDeucaLevels: null,
        diplomaTypes: null,
        probations: null,
        depts: null,
        contractTypes: null,
        recruitmentChannels: ['百度', '51job', '智联', '推荐', 'boss 直聘'],
        states: null,
        model: {
          uid: '',
          name: '',
          gender: '',
          state: '', //护照国家
          mobile: '',
          nativePlace: '', // 国籍
          passportNum: '', // 护照号
          passportUrl: '', // 护照图片
          idcard: '', // 身份证号
          idcardPhoUrl: '', // 身份证照片正面
          idcardPhoUrlRev: '', // 身份证照片反面
          socsecNum: '', // 社保号
          accfuNum: '', // 公积金编号
          bankName: '', // 银行名称
          openingBank: '', // 开户行
          cardNumber: '', // 银行卡号
          staffPhoUrl: '', // 员工照片
          englishName: '', // 英文名
          qq: '',
          wechart: '',
          maritalStatus: '', // 婚姻状况
          nation: '', // 民族
          politicsStatus: '', // 政治面貌
          thePartyTime: '', // 入党时间
          theArcIns: '', // 存档机构
          dateOfBirth: '', // 生日
          podoProvince: '', // 户口所在省
          podoCity: '', // 户口所在城市
          podoAddress: '', // 户口详细地址
          typeOfDemicile: '', // 户口性质
          houregPhoUrl: '', // 户口本首页
          houregPerphoUrl: '', // 户口本本人页
          houregPerrevphoUrl: '', // 户口本本人页背面
          hasResper: false, // 是否有居中证
          residenceProvince: '', // 居住证省份
          residenceCity: '', // 居住证城市
          resperst: '', // 居住证开始
          resperet: '', // 居住证结束
          poreProvince: '', // 现居住地省
          poreCity: '', // 现居住地城市
          poreAddress: '', // 现居住地详细地址
          personalEmail: '', // 个人邮箱
          contacts: [
            {
              emergContact: '',
              emergContactPhone: '',
              key: Date.now()
            }
          ], // 紧急联系人
          hasChild: false, // 是否有子女
          childs: [
            {
              name: '',
              gender: 1,
              dateOfBirth: '',
              birthCertifUrl: '',
              key: Date.now(),
              err: false
            }
          ], // 子女
          finallyEmpCom: '', // 上一家受聘公司
          maxinumDeucaLevel: '', // 最高学历
          diplomaType: '', // 学历类型
          graduateInst: '', // 毕业院校
          entSchst: '', // 入学时间
          entSchet: '', // 毕业时间
          major: '', // 专业
          diplomaUrl: '', // 学位证书
          greducaCertUrl: '', // 毕业证书
          technicalTitle: '', // 职称
//          resumeUrl: '', // 简历
          resumeUrls: [],
          hasComres: false, // 有无竞业协议
          hasComresRmk: '', // 竞业协议备注信息
          emplsepacertUrl: '', // 离职证明
          record: {
            dateOfEntry: '', // 入职日期
            probation: '', // 试用期
            companyAge: '', // 司龄
            position: '', // 职位
            jobGrade: '', // 职级
            deptUid: '', // 所在部门
            fristWorkTime: '', // 首次参加工作时间
            workAge: '', // 工龄
            workEmail: '',
            jobNumber: '', // 工号
            reporterJobNumber: '', // 汇报人工号
            workProvince: '',
            workCity: '',
            workAddress: '',
            baseSalary: '', // 基础薪资
            trialSalary: '', // 试用薪资
            contract: {
              contracType: '', // 合同类型
              startTime: '', // 合同生效日期
              contractPeriod: '', // 合同期限
              endTime: '', // 合同结束日期
              contractUrls: [], // 合同附件
              recruitmentChannel: '', // 候选人来源渠道
            }
          },
          shareOption: {
            awardDate: '', // 授予日期
            awardAmount: '', // 授予总数量
            awardRate: '', // 授予总比例
            awardRound: '', // 授予轮次
            exercSchedule: '', // 行权期
            terminallyCount: '', // 每期数量
            terminallyRate: '', // 每期比例
            contractUrl: '', // 期权合同
          }
        }
      }
    },
    created: function () {
      // ====日历组件需求开始====
      this.startDate = new Date(new Date().getTime() - (365 * 48 + 366 * 16) * 24 * 60 * 60 * 1000);
      // ====日历组件需求结束====
      this.status = false;
      Indicator.open('正在加载...');
      V.Promise.all([
        this.$http.get('/api/v1.0/common/config/6'),
        // 行业规模列表
        this.$http.get('/api/v1.0/common/config/20')
      ]).then(res => {
        // 员工状态列表
        if (res[0].body.code === 200) {
          this.staffStatusList = res[0].body.result;
        }
        //国家信息列表
        if (res[1].body.code === 200) {
          this.states = res[1].body.result;
        }
      });
    },
    computed: {
      formalEndTime() {
        let ct = this.model.record.contract;
        if (
          ct.contracType === '0'
          && ct.startTime
          && ct.contractPeriod
        ) {
          return moment(ct.startTime).add(ct.contractPeriod, 'months').subtract(1, 'days').format('YYYY-MM-DD');
        } else {
          return '';
        }
      },
      isWorkAge(){
        let fwt = this.model.record.fristWorkTime;
        if (fwt) {
          let ta = (new Date().getTime() - +moment(fwt).format('x')) / 31536000000;
          if (ta < 0) return '0.0';
          return ta.toFixed(1);
        } else {
          return '0.0';
        }
      },
      isCompanyAge() {
        let doe = this.model.record.dateOfEntry;
        if (doe) {
          let ta = (new Date().getTime() - +moment(doe).format('x')) / 31536000000;
          if (ta < 0) return '0.0';
          return ta.toFixed(1);
        } else {
          return '0.0';
        }
      },
    },
    methods: {
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
          pickerslot[2].style.display = 'block';
        } else if (this.dateType === 1) {
          pickerslot[2].style.display = 'none';
        }
        this.$refs.picker.open();
      },
      handleConfirm(data){
        if (data) {
          if (this.dateType === 0) {
            this.selectDateTime = moment(data).format(df3);
          } else if (this.dateType === 1) {
            this.selectDateTime = moment(data).format(df4);
          }
          this.selcetDateTime({time: this.selectDateTime, type: this.type, pos: this.pos});
        }
      },
      // ====日历组件方法结束====
      // 选择日期组件，传回来的值
      selcetDateTime(data){
        // 入党时间
        if (data.type === 0) {
          this.model.thePartyTime = data.time;
        }
        // 居住证办理时间
        if (data.type === 1) {
          this.model.resperst = data.time;
        }
        // 居住证截止时间
        if (data.type === 2) {
          this.model.resperet = data.time;
        }
        //子女的出生日期
        if (data.type === 3) {
          this.model.childs[data.pos].dateOfBirth = data.time;
        }
        // 入学时间
        if (data.type === 4) {
          this.model.entSchst = data.time;
        }
        // 毕业时间
        if (data.type === 5) {
          this.model.entSchet = data.time;
        }
      },
      noopValidat(rule, value, callback, source, options) {
        // return true;
        callback();
      },
      isDate(rule, value, callback) {
        if (rule.required) {
          if (value) callback();
          else callback(new Error(rule.message));
        } else {
          callback();
        }
      },
      isDates(rule, value, callback) {
        if (rule.required) {
          if (value) {
            if (this.model.entSchst) {
              if (new Date(value).getTime() > new Date(this.model.entSchst).getTime()) {
                callback();
              } else {
                callback(new Error(rule.message = "毕业日期不能小于入学日期"));
              }
            }
          } else {
            callback(new Error(rule.message));
          }
        } else {
          if (value) {
            if (this.model.entSchst) {
              if (new Date(value).getTime() > new Date(this.model.entSchst).getTime()) {
                callback();
              } else {
                callback(new Error(rule.message = "毕业日期不能小于入学日期"));
              }
            }
          } else {
            callback();
          }
        }
      },
      isResperDate(rule, value, callback) {
        if (rule.required) {
          if (value) {
            if (this.model.resperst) {
              if (new Date(value).getTime() > new Date(this.model.resperst).getTime()) {
                callback();
              } else {
                callback(new Error(rule.message = "截止日期不能小于办理日期"));
              }
            }
          } else {
            callback(new Error(rule.message));
          }
        } else {
          if (value) {
            if (this.model.resperst) {
              if (new Date(value).getTime() > new Date(this.model.resperst).getTime()) {
                callback();
              } else {
                callback(new Error(rule.message = "截止日期不能小于办理日期"));
              }
            }
          } else {
            callback();
          }
        }
      },
      datefmt(str) {
        if (str) return moment(str).format('YYYY-MM-DD');
        else return '';
      },
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
//                  this.workCities = res.result;
                }
              });
            return false;
          }
        });
        return p;
      },
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
      queryPodoCities(pid) {
        if (!pid) {
          this.podoCities = null;
          this.model.podoProvince = '';
          this.model.podoCity = '';
          return;
        }
        this.$http.get(`/api/v1.0/common/query/city/${pid}`)
          .then(res => {
            res = res.body;
            if (res.code === 200) {
              this.podoCities = res.result;
              if (this.loadProvince1) {
                this.loadProvince1 = false;
              } else {
                this.model.podoCity = res.result[0].uid;
              }
            }
          })
          .catch(err => {
            console.log(err.status, err.statusText);
          });
      },
      queryResidenceCities(pid) {
        if (!pid) {
          this.residenceCities = null;
          this.model.residenceProvince = '';
          this.model.residenceCity = '';
          return;
        }
        this.$http.get(`/api/v1.0/common/query/city/${pid}`)
          .then(res => {
            res = res.body;
            if (res.code === 200) {
              this.residenceCities = res.result;
              if (this.loadProvince2) {
                this.loadProvince2 = false;
              } else {
                this.model.residenceCity = res.result[0].uid;
              }
            }
          })
          .catch(err => {
            console.log(err.status, err.statusText);
          });
      },
      queryPoreCities(pid) {
        if (!pid) {
          this.poreCities = null;
          this.model.poreProvince = '';
          this.model.poreCity = '';
          return;
        }
        this.$http.get(`/api/v1.0/common/query/city/${pid}`)
          .then(res => {
            res = res.body;
            if (res.code === 200) {
              this.poreCities = res.result;
              if (this.loadProvince3) {
                this.loadProvince3 = false;
              } else {
                this.model.poreCity = res.result[0].uid;
              }
            }
          })
          .catch(err => {
            console.log(err.status, err.statusText);
          });
      },
      makeChildOk(item) {
        return function (res, file) {
          if (res.code === 200) {
            item.birthCertifUrl = res.result;
          }
        }
      },
      makeChildCheck(item) {
        return function (file) {
          let isImage = utils.isImage(file);
          let isInSize = utils.isInSize(file, 5);

          if (isImage && isInSize) {
            item.err = false;
          } else {
            item.err = true;
          }
          return isImage && isInSize;
        }
      },
      passportUrlOk(res, file) {
        this.model.passportUrl = URL.createObjectURL(file.raw);
        if (res.code === 200) {
          this.model.passportUrl = res.result;
        }
      },
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
      idcardPhoUrlOk(res, file) {
        console.log(res);
        if (res.code === 200) {
          this.model.idcardPhoUrl = res.result;
        }
      },
      beforeIdcardPhoUrl(file) {
        console.log('file', file);
        let isImage = utils.isImage(file);
        let isInSize = utils.isInSize(file, 5);
        if (isImage && isInSize) {
          this.idcardPhoUrlErrFlag = false;
        } else {
          this.idcardPhoUrlErrFlag = true;
        }
        return isImage && isInSize;
      },
      idcardPhoUrlRevOk(res, file) {
        if (res.code === 200) {
          this.model.idcardPhoUrlRev = res.result;
        }
      },
      beforeIdcardPhoUrlRev(file) {
        let isImage = utils.isImage(file);
        let isInSize = utils.isInSize(file, 5);
        if (isImage && isInSize) {
          this.idcardPhoUrlRevErrFlag = false;
        } else {
          this.idcardPhoUrlRevErrFlag = true;
        }
        return isImage && isInSize;
      },
      staffPhoUrlOk(res, file) {
        if (res.code === 200) {
          this.model.staffPhoUrl = res.result;
        }
      },
      beforeStaffPhoUrl(file) {
        let isImage = utils.isImage(file);
        let isInSize = utils.isInSize(file, 5);
        if (isImage && isInSize) {
          this.staffPhoUrlErrFlag = false;
        } else {
          this.staffPhoUrlErrFlag = true;
        }
        return isImage && isInSize;
      },
      houregPhoUrlOk(res, file) {
        if (res.code === 200) {
          this.model.houregPhoUrl = res.result;
        }
      },
      beforeHouregPhoUrl(file) {
        let isImage = utils.isImage(file);
        let isInSize = utils.isInSize(file, 5);
        if (isImage && isInSize) {
          this.houregPhoUrlErrFlag = false;
        } else {
          this.houregPhoUrlErrFlag = true;
        }
        return isImage && isInSize;
      },
      houregPerphoUrlOk(res, file) {
        if (res.code === 200) {
          this.model.houregPerphoUrl = res.result;
        }
      },
      beforeHouregPerphoUrl(file) {
        let isImage = utils.isImage(file);
        let isInSize = utils.isInSize(file, 5);
        if (isImage && isInSize) {
          this.houregPerphoUrlErrFlag = false;
        } else {
          this.houregPerphoUrlErrFlag = true;
        }
        return isImage && isInSize;
      },
      houregPerrevphoUrlOk(res, file) {
        if (res.code === 200) {
          this.model.houregPerrevphoUrl = res.result;
        }
      },
      beforeHouregPerrevphoUrl(file) {
        let isImage = utils.isImage(file);
        let isInSize = utils.isInSize(file, 5);
        if (isImage && isInSize) {
          this.houregPerrevphoUrlErrFlag = false;
        } else {
          this.houregPerrevphoUrlErrFlag = true;
        }
        return isImage && isInSize;
      },
      addContact() {
        this.model.contacts.push({
          emergContact: '',
          emergContactPhone: '',
          key: Date.now()
        });
      },
      rmvContact(item) {
        let index = this.model.contacts.indexOf(item)
        if (index !== -1) {
          this.model.contacts.splice(index, 1)
        }
      },
      addChild() {
        this.model.childs.push({
          name: '',
          gender: 1,
          dateOfBirth: '',
          birthCertifUrl: '',
          key: Date.now(),
          err: false
        });
      },
      rmvChild(item) {
        let index = this.model.childs.indexOf(item)
        if (index !== -1) {
          this.model.childs.splice(index, 1)
        }
      },
      diplomaUrlOk(res, file) {
        if (res.code === 200) {
          this.model.diplomaUrl = res.result;
        }
      },
      beforeDiplomaUrl(file) {
        let isImage = utils.isImage(file);
        let isInSize = utils.isInSize(file, 5);
        if (isImage && isInSize) {
          this.diplomaUrlErrFlag = false;
        } else {
          this.diplomaUrlErrFlag = true;
        }
        return isImage && isInSize;
      },
      greducaCertUrlOk(res, file) {
        if (res.code === 200) {
          this.model.greducaCertUrl = res.result;
        }
      },
      beforeGreducaCertUrl(file) {
        let isImage = utils.isImage(file);
        let isInSize = utils.isInSize(file, 5);
        if (isImage && isInSize) {
          this.greducaCertUrlErrFlag = false;
        } else {
          this.greducaCertUrlErrFlag = true;
        }
        return isImage && isInSize;
      },
      resumeUrlOk(res, file) {
        if (res.code === 200) {
          this.model.resumeUrls.push({
            uid: null,
            staffUid: null,
            url: res.result
          });
//          this.model.resumeUrl = res.result;
        }
      },
      beforeResumeUrl(file) {
//        let isDoc = utils.isDoc(file);
//        let isImage = utils.isImage(file);
//        let isInSize = utils.isInSize(file, 5);
//        if ((isDoc || isImage) && isInSize) {
//          this.resumeUrlErrFlag = false;
//        } else {
//          this.resumeUrlErrFlag = true;
//        }
//        return (isDoc || isImage) && isInSize;

        let noMoreDoc = function (file) {
          let flag = 0;
          this.model.resumeUrls.forEach(v => {
            if (utils.isDoc({name: v.url})) flag++;
          });
          return !flag;
        };
        let hasDoc = function () {
          let flag = 0;
          this.model.resumeUrls.forEach(v => {
            if (utils.isDoc({name: v.url})) flag++;
          });
          return flag > 0;
        }.bind(this)();
        let isDoc = utils.isDoc(file);
        let isImage = utils.isImage(file);
        let isInSize = utils.isInSize(file, 5);

        if (isInSize && (isImage || (!hasDoc && isDoc))) {
          this.resumeUrlErrFlag = false;
          return true;
        } else {
          this.resumeUrlErrFlag = true;
          return false;
        }
      },
      isFormatImg(url) {
        return utils.isImage({name: url});
      },
      emplsepacertUrlOk(res, file) {
        if (res.code === 200) {
          this.model.emplsepacertUrl = res.result;
        }
      },
      beforeEmplsepacertUrl(file) {
        let isImage = utils.isImage(file);
        let isInSize = utils.isInSize(file, 5);
        if (isImage && isInSize) {
          this.emplsepacertUrlErrFlag = false;
        } else {
          this.emplsepacertUrlErrFlag = true;
        }
        return isImage && isInSize;
      },
      contractUrlOk(res, file) {
        if (res.code === 200) {
          this.model.shareOption.contractUrl = res.result;
        }
      },
      beforeContractUrl(file) {
        let isDoc = utils.isDoc(file);
        let isInSize = utils.isInSize(file);
        if (isDoc && isInSize) {
          this.contractUrlErrFlag = false;
        } else {
          this.contractUrlErrFlag = true;
        }
        return isDoc && isInSize;
      },
      recordContractUrlOk(res, file) {
        if (res.code === 200) {
          this.model.record.contract.contractUrls = res.result;
        }
      },
      beforeRecordContractUrl(file) {
        let isDoc = utils.isDoc(file);
        let isInSize = utils.isInSize(file);
        if (isDoc && isInSize) {
          this.recordContractUrlErrFlag = false;
        } else {
          this.recordContractUrlErrFlag = true;
        }
        return isDoc && isInSize;
      },
      save() {
        let makePost = () => {
          let out = {};
          let record = {};
          let shareOption = {};
          out.uid = this.model.uid;
          out.name = this.model.name;
//          out.gender = this.model.gender;
          out.mobile = this.model.mobile;
          out.nativePlace = this.model.nativePlace; // 国籍
          out.passportNum = this.model.passportNum; // 护照号
          out.passportUrl = this.model.passportUrl; // 护照图片
          out.state = this.model.state;
          out.idcard = this.model.idcard; // 身份证号
          out.idcardPhoUrl = this.model.idcardPhoUrl; // 身份证照片正面
          out.idcardPhoUrlRev = this.model.idcardPhoUrlRev; // 身份证照片反面
          out.socsecNum = this.model.socsecNum; // 社保号
          out.accfuNum = this.model.accfuNum; // 公积金编号
          out.bankName = this.model.bankName; // 银行名称
          out.openingBank = this.model.openingBank; // 开户行
          out.cardNumber = this.model.cardNumber; // 银行卡号
          out.staffPhoUrl = this.model.staffPhoUrl; // 员工照片
          out.englishName = this.model.englishName; // 英文名
          out.qq = this.model.qq;
          out.wechart = this.model.wechart;
          out.maritalStatus = this.model.maritalStatus; // 婚姻状况
          out.nation = this.model.nation; // 民族
          out.politicsStatus = this.model.politicsStatus; // 政治面貌
          out.thePartyTime = new Date(this.model.thePartyTime).getTime(); // 入党时间
          out.theArcIns = this.model.theArcIns; // 存档机构
//          out.dateOfBirth = new Date(this.model.dateOfBirth).getTime(); // 生日
          out.podoProvince = this.model.podoProvince; // 户口所在省
          out.podoCity = this.model.podoCity; // 户口所在城市
          out.podoAddress = this.model.podoAddress; // 户口详细地址
          out.typeOfDemicile = this.model.typeOfDemicile; // 户口性质
          out.houregPhoUrl = this.model.houregPhoUrl; // 户口本首页
          out.houregPerphoUrl = this.model.houregPerphoUrl; // 户口本本人页
          out.houregPerrevphoUrl = this.model.houregPerrevphoUrl; // 户口本本人页背面
          out.hasResper = this.model.hasResper; // boolean 是否有居中证
          out.residenceProvince = this.model.residenceProvince; // 居住证省份
          out.residenceCity = this.model.residenceCity; // 居住证城市
          out.resperst = new Date(this.model.resperst).getTime(); // 居住证开始
          out.resperet = new Date(this.model.resperet).getTime(); // 居住证结束
          out.poreProvince = this.model.poreProvince; // 现居住地省
          out.poreCity = this.model.poreCity; // 现居住地城市
          out.poreAddress = this.model.poreAddress; // 现居住地详细地址
          out.personalEmail = this.model.personalEmail; // 个人邮箱
          let contacts = ((contacts) => {
            var out = [];
            contacts.forEach(v => {
              let o = {};
              o.emergContact = v.emergContact;
              o.emergContactPhone = v.emergContactPhone;
              if (this.model.uid) {
                o.uid = v.uid;
                o.staffUid = v.staffUid;
              }
              if (Object.keys(o).length) {
                out.push(o);
              }
            });
            return out;
          })(this.model.contacts);
          out.contacts = contacts;
          out.hasChild = this.model.hasChild; // boolean 是否有子女
          let childs = ((childs, hasChild) => {
            var out = [];
            if (!hasChild) {
              return out;
            }
            childs.forEach(v => {
              let o = {};
              o.name = v.name;
              o.gender = v.gender;
              o.dateOfBirth = new Date(v.dateOfBirth).getTime();
              o.birthCertifUrl = v.birthCertifUrl;
              if (this.model.uid) {
                o.uid = v.uid;
                o.staffUid = v.staffUid;
              }
              if (Object.keys(o).length) {
                out.push(o);
              }
            });
            return out;
          })(this.model.childs, this.model.hasChild);
          out.childs = childs;
          out.finallyEmpCom = this.model.finallyEmpCom; // 上一家受聘公司
          out.maxinumDeucaLevel = this.model.maxinumDeucaLevel; // 最高学历
          out.diplomaType = this.model.diplomaType; // 学历类型
          out.graduateInst = this.model.graduateInst; // 毕业院校
          out.entSchst = new Date(this.model.entSchst).getTime(); // 入学时间
          out.entSchet = new Date(this.model.entSchet).getTime(); // 毕业时间
          out.major = this.model.major; // 专业
          out.diplomaUrl = this.model.diplomaUrl; // 学位证书
          out.greducaCertUrl = this.model.greducaCertUrl; // 毕业证书
          out.technicalTitle = this.model.technicalTitle; // 职称
//          out.resumeUrl = this.model.resumeUrl; // 简历
          out.resumeUrls = this.model.resumeUrls; // 简历
          out.hasComres = this.model.hasComres; // boolean 有无竞业协议
          out.hasComresRmk = this.model.hasComresRmk; // 竞业协议备注信息
          out.emplsepacertUrl = this.model.emplsepacertUrl; // 离职证明
          record.dateOfEntry = new Date(this.model.record.dateOfEntry).getTime(); // 入职日期
          record.probation = this.model.record.probation; // 试用期
          record.companyAge = this.model.record.companyAge; // 司龄
          record.position = this.model.record.position; // 职位
          record.jobGrade = this.model.record.jobGrade; // 职级
          record.deptUid = this.model.record.deptUid; // 所在部门
          record.fristWorkTime = new Date
          (this.model.record.fristWorkTime).getTime(); // 首次参加工作时间
          record.workAge = this.model.record.workAge; // 工龄
          record.workEmail = this.model.record.workEmail;
          record.jobNumber = this.model.record.jobNumber; // 工号
          record.reporterJobNumber = this.model.record.reporterJobNumber; // 汇报人工号
          record.workProvince = this.model.record.workProvince;
          record.workCity = this.model.record.workCity;
          record.workAddress = this.model.record.workAddress;

          let contract = ((v) => {
            var o = {};
            o.contracType = v.contracType;
            if (v.contracType === '0') {
              o.startTime = new Date(v.startTime).getTime();
              o.contractPeriod = v.contractPeriod;
              o.endTime = Number(moment(this.formalEndTime).format('x'));
              o.contractUrls = v.contractUrls;
              o.recruitmentChannel = v.recruitmentChannel;
              record.baseSalary = this.model.record.baseSalary; // 基础薪资
              record.trialSalary = this.model.record.trialSalary; // 试用薪资
            } else if (v.contracType === '1') {
              o.startTime = new Date(v.startTime).getTime();
              o.endTime = new Date(v.endTime).getTime();
              o.contractUrls = v.contractUrls;
            } else if (v.contracType === '2') {
              o.contractUrls = v.contractUrls;
            } else if (v.contracType === '3') {
              o.startTime = new Date(v.startTime).getTime();
              o.endTime = new Date(v.endTime).getTime();
              o.contractUrls = v.contractUrls;
            }
            if (this.model.uid) {
              o.uid = v.uid;
              o.recordUid = v.recordUid
            }
            return o;
          })(this.model.record.contract);
          record.contract = contract;

          if (this.model.uid) {
            record.uid = this.model.record.uid;
            record.companyUid = this.model.record.companyUid;
            record.staffUid = this.model.record.staffUid;
          }
          out.record = record;
          shareOption.awardDate = new Date(this.model.shareOption.awardDate).getTime(); // 授予日期
          shareOption.awardAmount = this.model.shareOption.awardAmount; // 授予总数量
          shareOption.awardRate = this.model.shareOption.awardRate; // 授予总比例
          shareOption.awardRound = this.model.shareOption.awardRound; // 授予轮次
          shareOption.exercSchedule = this.model.shareOption.exercSchedule; // 行权期
          shareOption.terminallyCount = this.model.shareOption.terminallyCount; // 每期数量
          shareOption.terminallyRate = this.model.shareOption.terminallyRate; // 每期比例
          shareOption.contractUrl = this.model.shareOption.contractUrl; // 期权合同

          if (this.model.uid) {
            shareOption.uid = this.model.shareOption.uid;
            shareOption.recordUid = this.model.shareOption.recordUid;
          }
          out.shareOption = shareOption;

          return out;
        };
//        let flaf = 0;
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
        let staffApi = '/api/v1.0/client/updateStaff';
        this.$http.post(staffApi, makePost())
          .then(res => {
            res = res.body;
            if (res.code === 200) {
              Indicator.close();
              this.$router.push({path: '/signCard'});
            } else {
              Indicator.close();
            }
          })
          .catch(err => console.log(err.status, err.statusText));
      },
      queryConf() {
        this.$http.get('/api/v1.0/client/configuration')
          .then(res => {
            res = res.body;
            if (res.code === 200) {
              this.confList = res.result.sort((a, b) => a.sortnum - b.sortnum);
              let d = {};
              res.result.forEach(item => {
                d[item.remark] = item;
                switch (item.tname) {
                  case 'STAFF':
                    if (item.isconfig && item.isvisible) {
                      this.staff[item.jname] = item;
                    }
                    break;
                  case 'STAFF_RECORD':
                    if (item.isconfig && item.isvisible) {
                      this.staffRecord[item.jname] = item;
                    }
                    break;
                  case 'STAFF_SHARE_OPTION':
                    if (item.isconfig && item.isvisible) {
                      this.staffShareOption[item.jname] = item;
                    }
                    break;
                }
              });
              if (this.staff || this.staffRecord || this.staffShareOption) {
                Indicator.close();//关闭加载中
                this.status = true;
              }
            }

          })
          .catch(err => console.log(err.status, err.statusText));

      },
      queryEmp() {
        let makeEmp = emp => {
          let numProcess = v => typeof v === 'number' ? v : '';
          let dateProcess1 = v => v ? moment(new Date(v)).format(df1) : '';
          let dateProcess2 = v => v ? moment(new Date(v)).format(df2) : '';
          let toNum = v => v ? Number(v) : '';
          let toStr = v => typeof v === 'number' ? v.toString() : '';
          this.model.uid = emp.uid;
          this.model.name = emp.name || '';
//          this.model.gender = numProcess(emp.gender);
          this.model.mobile = emp.mobile || '';
          this.model.nativePlace = toStr(emp.nativePlace);
          this.model.passportNum = emp.passportNum || '';
          this.model.passportUrl = emp.passportUrl || '';
          this.model.state = emp.state || '';
          this.model.idcard = emp.idcard || '';
          this.staffIdcard(emp.idcard);//根据身份证号计算出生日期和性别
          this.model.idcardPhoUrl = emp.idcardPhoUrl || '';
          this.model.idcardPhoUrlRev = emp.idcardPhoUrlRev || '';
          this.model.socsecNum = emp.socsecNum || '';
          this.model.accfuNum = emp.accfuNum || '';
          this.model.bankName = emp.bankName ? emp.bankName : '';
          this.model.openingBank = emp.openingBank || '';
          this.model.cardNumber = emp.cardNumber || '';
          this.model.staffPhoUrl = emp.staffPhoUrl || '';
          this.model.englishName = emp.englishName || '';
          this.model.qq = emp.qq || '';
          this.model.wechart = emp.wechart || '';
          this.model.maritalStatus = toStr(emp.maritalStatus);
          this.model.nation = emp.nation ? emp.nation : '';
          this.model.politicsStatus = toStr(emp.politicsStatus);
          this.model.thePartyTime = dateProcess1(emp.thePartyTime);
          this.model.theArcIns = emp.theArcIns || ''; // 存档机构
//          this.model.dateOfBirth = dateProcess1(emp.dateOfBirth); // 生日
          this.model.podoProvince = emp.podoProvince ? emp.podoProvince : ''; // 户口所在省
          this.model.podoCity = emp.podoCity ? emp.podoCity : ''; // 户口所在城市
          this.model.podoAddress = emp.podoAddress || ''; // 户口详细地址
          this.model.typeOfDemicile = toStr(emp.typeOfDemicile); // 户口性质
          this.model.houregPhoUrl = emp.houregPhoUrl || ''; // 户口本首页
          this.model.houregPerphoUrl = emp.houregPerphoUrl || ''; // 户口本本人页
          this.model.houregPerrevphoUrl = emp.houregPerrevphoUrl || ''; // 户口本本人页背面
          this.model.hasResper = emp.hasResper; // 是否有居中证
          this.model.residenceProvince = emp.residenceProvince; // 居住证省份
          this.model.residenceCity = emp.residenceCity; // 居住证城市
          this.model.resperst = dateProcess1(emp.resperst); // 居住证开始
          this.model.resperet = dateProcess1(emp.resperet); // 居住证结束
          this.model.poreProvince = emp.poreProvince ? emp.poreProvince : ''; // 现居住地省
          this.model.poreCity = emp.poreCity ? emp.poreCity : ''; // 现居住地城市
          this.model.poreAddress = emp.poreAddress || ''; // 现居住地详细地址
          this.model.personalEmail = emp.personalEmail || ''; // 个人邮箱
          this.model.contacts = function (contacts) {
            if (!(contacts && contacts.length)) {
              return [{
                emergContact: '',
                emergContactPhone: ''
              }];
            }
            let arr = [];
            contacts.forEach(v => {
              arr.push({
                emergContact: v.emergContact,
                emergContactPhone: v.emergContactPhone,
                uid: v.uid,
                staffUid: v.staffUid
              });
            });
            return arr;
          }(emp.contacts);
          this.model.hasChild = emp.hasChild;
          this.model.childs = function (childs) {
            if (!(childs && childs.length)) {
              return [{
                name: '',
                gender: 1,
                dateOfBirth: '',
                birthCertifUrl: ''
              }];
            }
            let arr = [];
            childs.forEach(v => {
              arr.push({
                name: v.name,
                gender: v.gender,
                dateOfBirth: v.dateOfBirth,
                birthCertifUrl: v.birthCertifUrl,
                uid: v.uid,
                staffUid: v.staffUid,
                err: false
              });
            });
            return arr;
          }(emp.childs);
          this.model.finallyEmpCom = emp.finallyEmpCom || ''; // 上一家受聘公司
          this.model.maxinumDeucaLevel = emp.maxinumDeucaLevel ? emp.maxinumDeucaLevel : ''; // 最高学历
          this.model.diplomaType = toStr(emp.diplomaType); // 学历类型
          this.model.graduateInst = emp.graduateInst || ''; // 毕业院校
          this.model.entSchst = dateProcess2(emp.entSchst) || ''; // 入学时间
          this.model.entSchet = dateProcess2(emp.entSchet) || ''; // 毕业时间
          this.model.major = emp.major || ''; // 专业
          this.model.diplomaUrl = emp.diplomaUrl || ''; // 学位证书
          this.model.greducaCertUrl = emp.greducaCertUrl || ''; // 毕业证书
          this.model.technicalTitle = emp.technicalTitle || ''; // 职称
//          this.model.resumeUrl = emp.resumeUrl || ''; // 简历
          this.model.resumeUrls = emp.resumeUrls || []; // 简历
          this.model.hasComres = emp.hasComres; // 有无竞业协议
          this.model.hasComresRmk = emp.hasComresRmk || ''; // 竞业协议备注信息
          this.model.emplsepacertUrl = emp.emplsepacertUrl || ''; // 离职证明
          this.model.record.uid = emp.record.uid;
          this.model.record.companyUid = emp.record.companyUid;
          this.model.record.staffUid = emp.record.staffUid;
          this.model.record.dateOfEntry = dateProcess1(emp.record.dateOfEntry); // 入职日期
          this.model.record.probation = toStr(emp.record.probation); // 试用期
          this.model.record.companyAge = emp.record.companyAge || ''; // 司龄
          this.model.record.position = emp.record.position || ''; // 职位
          this.model.record.jobGrade = emp.record.jobGrade || ''; // 职级
          this.model.record.deptUid = emp.record.deptUid; // 所在部门
          this.model.record.fristWorkTime = dateProcess1(emp.record.fristWorkTime); // 首次参加工作时间
          this.model.record.workAge = emp.record.workAge || ''; // 工龄
          this.model.record.workEmail = emp.record.workEmail || '';
          this.model.record.jobNumber = emp.record.jobNumber || ''; // 工号
          this.model.record.reporterJobNumber = emp.record.reporterJobNumber || ''; // 汇报人工号
          this.model.record.workProvince = emp.record.workProvince;
          this.model.record.workCity = emp.record.workCity;
          this.model.record.workAddress = emp.record.workAddress || '';
          this.model.record.baseSalary = toStr(emp.record.baseSalary); // 基础薪资
          this.model.record.trialSalary = toStr(emp.record.trialSalary); // 试用薪资
          this.model.record.sstaffStatus = emp.record.staffStatus; // 员工状态  6-16-16新增
          this.model.record.contract.uid = emp.record.contract.uid;
          this.model.record.contract.recordUid = emp.record.contract.recordUid;
          this.model.record.contract.contracType = toStr(emp.record.contract.contracType); // 合同类型
          this.model.record.contract.startTime = dateProcess1(emp.record.contract.startTime); // 合同生效日期
          this.model.record.contract.contractPeriod = emp.record.contract.contractPeriod || ''; // 合同期限
          this.model.record.contract.endTime = dateProcess1(emp.record.contract.endTime); // 合同结束日期
          this.model.record.contract.contractUrls = emp.record.contract.contractUrls || ''; // 合同附件
          this.model.record.contract.recruitmentChannel = toNum(emp.record.contract.recruitmentChannel); // 候选人来源渠道
          this.model.shareOption.uid = this.model.uid;
          this.model.shareOption.uid = emp.shareOption.uid;
          this.model.shareOption.recordUid = emp.shareOption.recordUid;
          this.model.shareOption.awardDate = dateProcess1(emp.shareOption.awardDate); // 授予日期
          this.model.shareOption.awardAmount = toStr(emp.shareOption.awardAmount); // 授予总数量
          this.model.shareOption.awardRate = toStr(emp.shareOption.awardRate); // 授予总比例
          this.model.shareOption.awardRound = toStr(emp.shareOption.awardRound); // 授予轮次
          this.model.shareOption.exercSchedule = toStr(emp.shareOption.exercSchedule); // 行权期
          this.model.shareOption.terminallyCount = toStr(emp.shareOption.terminallyCount); // 每期数量
          this.model.shareOption.terminallyRate = toStr(emp.shareOption.terminallyRate); // 每期比例
          this.model.shareOption.contractUrl = emp.shareOption.contractUrl || ''; // 期权合同
          if (this.model.podoProvince) this.queryPodoCities(this.model.podoProvince);
          if (this.model.residenceProvince) this.queryResidenceCities(this.model.residenceProvince);
          if (this.model.poreProvince) this.queryPoreCities(this.model.poreProvince);
        };

        this.$http.post(`/api/v1.0/client/findStaff`)
          .then(res => {
            res = res.body;
            this.emp = res.result;
            if (res.code === 200) makeEmp(res.result);
          })
          .catch(err => console.log(err.status, err.statusText));
      },
      // 图片点击全屏放大
      imageScaleOpen(data){
        this.imageScale = true;
        this.imageScaleUrl = data;
      },
      //关闭图片放大
      imageScaleClose(){
        this.imageScale = false;
      },
      staffIdcard(data){
        if (/^\d{17}(?:\d|[Xx])$/g.test(data.toString().trim())) {
          this.model.dateOfBirth = `${data.substring(6, 10)}-${data.substring(10, 12)}-${data.substring(12, 14)}`;
          this.model.gender = (+data.toString().trim()[16]) % 2 === 0 ? 0 : 1;
        }
      }
    },
    mounted: function () {
      V.Promise.all([
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
        this.$http.get('/api/v1.0/common/config/13')
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
        this.probations = this.publicParams.probation;
        this.contractTypes = this.publicParams.contractType;

        this.queryEmp();
        // 省份列表
        this.queryProvinces();
        this.queryConf();
      });

      // 汇报人
      this.$http.get('/api/v1.0/client/findReporter').then(response => { //审批人表赋值给汇报上级
        if (response.body.code === 200) {
          if (response.body.result) {
            this.staffRecord.upji = response.body.result.NAME;
          } else {
            this.staffRecord.upji = '';
          }
        }
      }, response => {
        console.log('error callback');
      });
    },
    components: {}
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

    .my-data {
      padding: 44px 0 70px;
      text-align: left;
      background: #ffffff;
      // 复写mint ui 组件，头部样式
      .mint-navbar {
        .mint-tab-item {
          padding: 17px 0;
          color: rgba(255, 255, 255, 0.5);
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          span {
            font-size: 15px;
          }
        }
        .mint-tab-item.is-selected {
          border-bottom: none !important;
          margin-bottom: 0 !important;
          span {
            display: inline-block;
            padding-bottom: 9px;
            border-bottom: 3px solid #ffffff;
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

    .my-data .uploadErrorTip {
      color: #ff4949;
      font-size: 12px;
      margin-top: 0;
      margin-bottom: 0;
      line-height: 1.3;
    }
    .my-data .add-child,
    .my-data .add-contact {
      margin-bottom: 10px;
      margin-top: 20px;
    }
    .my-data .el-form-item__label {
      font-weight: 900;
      font-size: 15px;
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
      width: 60%;
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
    }
    .my-data .upload-img-box {
      box-sizing: border-box;
      display: inline-block;
      padding: 0 5px;
      width: 33.33%;
    }
    .my-data .upload-img-wrapper img {
      display: block;
      max-width: 100%;
    }
    .my-data .child-imgBox {
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

    .my-data .child div.el-form-item {
      /*padding-top: 0;*/
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

    .my-data .el-form-item:nth-of-type(n + 2) {
    }
    .my-data .el-input-group__append {
      border: none;
    }

    .my-data .el-form-item__error {
      position: static;
      /*margin-top: 4px;*/
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

    /*修改tab样式*/
    .mint-navbar {
      background-color: #26a2ff;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      text-align: center;
    }

    .mint-navbar .mint-tab-item.is-selected {
      border-bottom: 3px solid #ffffff;
      color: #ffffff;
      margin-bottom: -1px;
    }

    .mint-navbar .mint-tab-item {
      padding: 17px 0;
      font-size: 15px;
      color: rgba(255, 255, 255, 0.5);
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

  /*修改tab样式结束*/
</style>
