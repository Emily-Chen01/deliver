<template>
<div class="my-data" style="background: #ffffff">


  <mt-navbar fixed v-model="selected" class="dataTitle">
    <mt-tab-item id="1"><i v-if="personFlag" class="el-icon-warning fa-error" aria-hidden="true">&nbsp;</i><span>个人资料</span></mt-tab-item>
    <mt-tab-item id="2"><i v-if="postFlag || optionFlag" class="el-icon-warning fa-error" aria-hidden="true">&nbsp;</i><span>岗位信息</span></mt-tab-item>
  </mt-navbar>

  <!-- tab-container -->
  <mt-tab-container v-model="selected">
    <mt-tab-container-item id="1">

      <el-form label-position="left" :model="model" :rules="rules" :label-width="labelWidth" ref="personFm">

        <el-form-item v-if="staff.name" label="姓名" prop="name">
          <el-input :readonly="!staff.name.isedit" v-model="model.name"></el-input>
        </el-form-item>

        <el-form-item v-if="staff.mobile" label="手机号" prop="mobile">
          <el-input :readonly="!staff.mobile.isedit" v-model="model.mobile"></el-input>
        </el-form-item>

        <el-form-item v-if="staff.gender" label="性别" prop="gender">
          <el-radio-group :disabled="!staff.gender.isedit" v-model="model.gender">
            <el-radio v-for="item in genders" :key="item.id" :label="item.id">{{ item.name }}</el-radio>
            <!--<el-radio :label="0">女</el-radio>-->
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="staff.dateOfBirth" label="出生日期" prop="dateOfBirth">
          <el-date-picker
            :readonly="!staff.dateOfBirth.isedit"
            v-model="model.dateOfBirth"
            type="date"
            placeholder="选择出生日期"
            :editable="false">
          </el-date-picker>
        </el-form-item>

        <el-form-item v-if="staff.idcard" label="身份证号" prop="idcard">
          <el-input :readonly="!staff.idcard.isedit" v-model="model.idcard"></el-input>
        </el-form-item>

        <el-form-item v-if="staff.podoMessage" label="户口省份" prop="podoProvince">
          <el-select :disabled="!staff.podoMessage.isedit" clearable v-model="model.podoProvince" placeholder="请选择" @change="queryPodoCities">
            <el-option v-for="p in provinces" :key="p.uid" :label="p.name" :value="p.uid"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="staff.podoMessage" label="户口城市" prop="podoCity">
          <el-select :disabled="!staff.podoMessage.isedit" clearable v-model="model.podoCity" placeholder="请选择">
            <el-option
              v-for="c in podoCities"
              :key="c.uid"
              :label="c.name"
              :value="c.uid">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="staff.podoMessage" label="户口地址" prop="podoAddress">
          <el-input :readonly="!staff.podoMessage.isedit" v-model="model.podoAddress"></el-input>
        </el-form-item>

        <el-form-item v-if="staff.podoMessage" label="户口性质" prop="typeOfDemicile">
          <el-select :disabled="!staff.podoMessage.isedit" clearable v-model="model.typeOfDemicile" placeholder="请选择">
            <el-option
              v-for="(v, k) in typeOfDemiciles"
              :key="k"
              :label="v"
              :value="k">
            </el-option>
          </el-select>
        </el-form-item>


        <el-form-item v-if="staff.nativePlace" label="国籍" prop="nativePlace">
          <el-select :disabled="!staff.nativePlace.isedit" clearable v-model="model.nativePlace" placeholder="请选择">
            <el-option
              v-for="(v, k) in nativePlaces"
              :key="k"
              :label="v"
              :value="k">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="model.nativePlace === '2' && staff.passportNum" label="护照号" prop="passportNum">
          <el-input :readonly="!staff.passportNum.isedit" v-model="model.passportNum"></el-input>
        </el-form-item>

        <el-form-item v-if="model.nativePlace === '2' && staff.passportUrl" label="护照照片">
          <el-upload
            v-if="staff.passportUrl.isedit"
            action="/api/v1.0/client/upload"
            name="files"
            :show-file-list="false"
            :headers="tokenHeader"
            :on-success="passportUrlOk"
            :before-upload="beforePassportUrl">
            <i class="el-icon-plus"> 上传护照照片</i>
          </el-upload>
          <div v-if="model.passportUrl" class="upload-img-wrapper">
            <i class="fa fa-times" @click.stop="model.passportUrl = ''" aria-hidden="true"></i>
            <img :src="model.passportUrl" />
          </div>
          <p class="uploadErrorTip" v-show="passportUrlErrFlag">请上传正确的护照照片(格式为 jpg 或 jpeg 或 png，照片体积小于 2 兆)</p>
        </el-form-item>

        <el-form-item v-if="staff.idcardPhoUrl" label="身份证正面">
          <el-upload
            v-if="staff.idcardPhoUrl.isedit"
            action="/api/v1.0/client/upload"
            name="files"
            :show-file-list="false"
            :headers="tokenHeader"
            :on-success="idcardPhoUrlOk"
            :before-upload="beforeIdcardPhoUrl">
            <i class="el-icon-plus"> 上传身份证正面照片</i>
          </el-upload>
          <div v-if="model.idcardPhoUrl" class="upload-img-wrapper">
            <i class="fa fa-times" @click.stop="model.idcardPhoUrl = ''" aria-hidden="true"></i>
            <img :src="model.idcardPhoUrl" />
          </div>
          <p class="uploadErrorTip" v-show="idcardPhoUrlErrFlag">请上传正确的身份证正面照片(格式为 jpg 或 jpeg 或 png，照片体积小于 2 兆)</p>
        </el-form-item>

        <el-form-item v-if="staff.idcardPhoUrl" label="身份证背面">
          <el-upload
            v-if="staff.idcardPhoUrl.isedit"
            action="/api/v1.0/client/upload"
            name="files"
            :show-file-list="false"
            :headers="tokenHeader"
            :on-success="idcardPhoUrlRevOk"
            :before-upload="beforeIdcardPhoUrlRev">
            <i class="el-icon-plus"> 上传身份证背面照片</i>
          </el-upload>
          <div v-if="model.idcardPhoUrlRev" class="upload-img-wrapper">
            <i class="fa fa-times" @click.stop="model.idcardPhoUrlRev = ''" aria-hidden="true"></i>
            <img :src="model.idcardPhoUrlRev" />
          </div>
          <p class="uploadErrorTip" v-show="idcardPhoUrlRevErrFlag">请上传正确的身份证背面照片(格式为 jpg 或 jpeg 或 png，照片体积小于 2 兆)</p>
        </el-form-item>

        <el-form-item v-if="staff.socsecNum" label="社保编号" prop="socsecNum">
          <el-input :readonly="!staff.socsecNum.isedit" v-model="model.socsecNum"></el-input>
        </el-form-item>

        <el-form-item v-if="staff.accfuNum" label="公积金号" prop="accfuNum">
          <el-input :readonly="!staff.accfuNum.isedit" v-model="model.accfuNum"></el-input>
        </el-form-item>

        <el-form-item v-if="staff.bankName" label="银行名称" prop="bankName">
          <el-select :disabled="!staff.bankName.isedit" clearable v-model="model.bankName" placeholder="请选择">
            <el-option
              v-for="(v, k) in bankNames"
              :key="k"
              :label="v"
              :value="k">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="staff.bankName" label="开户行" prop="openingBank">
          <el-input :readonly="!staff.bankName.isedit" v-model="model.openingBank"></el-input>
        </el-form-item>

        <el-form-item v-if="staff.bankName" label="银行卡号" prop="cardNumber" >
          <el-input :readonly="!staff.bankName.isedit" v-model="model.cardNumber"></el-input>
        </el-form-item>

        <el-form-item v-if="staff.staffPhoUrl" label="员工照片">
          <el-upload
            v-if="staff.staffPhoUrl.isedit"
            action="/api/v1.0/client/upload"
            name="files"
            :show-file-list="false"
            :headers="tokenHeader"
            :on-success="staffPhoUrlOk"
            :before-upload="beforeStaffPhoUrl">
            <i class="el-icon-plus"> 上传员工照片</i>
          </el-upload>
          <div v-if="model.staffPhoUrl" class="upload-img-wrapper">
            <i class="fa fa-times" @click.stop="model.staffPhoUrl = ''" aria-hidden="true"></i>
            <img :src="model.staffPhoUrl" />
          </div>
          <p class="uploadErrorTip" v-show="staffPhoUrlErrFlag">请上传正确的员工照片(格式为 jpg 或 jpeg 或 png，照片体积小于 2 兆)</p>
        </el-form-item>

        <el-form-item v-if="staff.englishName" label="英文名" prop="englishName">
          <el-input :readonly="!staff.englishName.isedit" v-model="model.englishName"></el-input>
        </el-form-item>

        <el-form-item v-if="staff.qq" label="QQ" prop="qq">
          <el-input :readonly="!staff.qq.isedit" v-model="model.qq"></el-input>
        </el-form-item>

        <el-form-item v-if="staff.wechart" label="微信" prop="wechart">
          <el-input :readonly="!staff.wechart.isedit" v-model="model.wechart"></el-input>
        </el-form-item>



        <el-form-item v-if="staff.maritalStatus" label="婚姻状况" prop="maritalStatus">
          <el-select :disabled="!staff.maritalStatus.isedit" clearable v-model="model.maritalStatus" placeholder="请选择">
            <el-option
              v-for="(v, k) in maritalStatuses"
              :key="k"
              :label="v"
              :value="k">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="staff.nation" label="民族" prop="nation">
          <el-select :disabled="!staff.nation.isedit" clearable v-model="model.nation" placeholder="请选择">
            <el-option
              v-for="(v, k) in nations"
              :key="k"
              :label="v"
              :value="k">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="staff.politicsStatus" label="政治面貌" prop="politicsStatus">
          <el-select :disabled="!staff.politicsStatus.isedit" clearable v-model="model.politicsStatus" placeholder="请选择">
            <el-option
              v-for="(v, k) in politicsStatuses"
              :key="k"
              :label="v"
              :value="k">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="model.politicsStatus === '2' && staff.politicsStatus" label="入党时间" prop="thePartyTime">
          <el-date-picker
            :readonly="!staff.politicsStatus.isedit"
            v-model="model.thePartyTime"
            type="month"
            placeholder="选择入党时间"
            :editable="false">
          </el-date-picker>
        </el-form-item>

        <el-form-item v-if="staff.theArcIns" label="存档机构" prop="theArcIns">
          <el-input :readonly="!staff.theArcIns.isedit" v-model="model.theArcIns"></el-input>
        </el-form-item>

        <el-form-item v-if="staff.houregPhoUrl" label="户口本首页">
          <el-upload
            v-if="staff.houregPhoUrl.isedit"
            action="/api/v1.0/client/upload"
            name="files"
            :show-file-list="false"
            :headers="tokenHeader"
            :on-success="houregPhoUrlOk"
            :before-upload="beforeHouregPhoUrl">
            <i class="el-icon-plus"></i> 户口本首页
          </el-upload>
          <div v-if="model.houregPhoUrl" class="upload-img-wrapper">
            <i class="fa fa-times" @click.stop="model.houregPhoUrl = ''" aria-hidden="true"></i>
            <img :src="model.houregPhoUrl" />
          </div>
          <p class="uploadErrorTip" v-show="houregPhoUrlErrFlag">请上传正确的户口本首页照片(格式为 jpg 或 jpeg 或 png，照片体积小于 2 兆)</p>
        </el-form-item>

        <el-form-item v-if="staff.houregPhoUrl" label="本人户口页">
          <el-upload
            v-if="staff.houregPhoUrl.isedit"
            action="/api/v1.0/client/upload"
            name="files"
            :show-file-list="false"
            :headers="tokenHeader"
            :on-success="houregPerphoUrlOk"
            :before-upload="beforeHouregPerphoUrl">
            <i class="el-icon-plus"></i> 本人户口页
          </el-upload>
          <div v-if="model.houregPerphoUrl" class="upload-img-wrapper">
            <i class="fa fa-times" @click.stop="model.houregPerphoUrl = ''" aria-hidden="true"></i>
            <img :src="model.houregPerphoUrl" />
          </div>
          <p class="uploadErrorTip" v-show="houregPerphoUrlErrFlag">请上传正确的户口本本人页照片(格式为 jpg 或 jpeg 或 png，照片体积小于 2 兆)</p>
        </el-form-item>

        <el-form-item v-if="staff.houregPhoUrl" label="本人户口页背面">
          <el-upload
            v-if="staff.houregPhoUrl.isedit"
            action="/api/v1.0/client/upload"
            name="files"
            :show-file-list="false"
            :headers="tokenHeader"
            :on-success="houregPerrevphoUrlOk"
            :before-upload="beforeHouregPerrevphoUrl">
            <i class="el-icon-plus"></i> 本人户口页背面
          </el-upload>
          <div v-if="model.houregPerrevphoUrl" class="upload-img-wrapper">
            <i class="fa fa-times" @click.stop="model.houregPerrevphoUrl = ''" aria-hidden="true"></i>
            <img :src="model.houregPerrevphoUrl" />
          </div>
          <p class="uploadErrorTip" v-show="houregPerrevphoUrlErrFlag">请上传正确的户口本本人页背面照片(格式为 jpg 或 jpeg 或 png，照片体积小于 2 兆)</p>
        </el-form-item>

        <el-form-item v-if="staff.ResperMessage" label="居住证">
          <el-switch
            :disabled="!staff.ResperMessage.isedit"
            v-model="model.hasResper"
            on-text="有"
            off-text="无">
          </el-switch>
        </el-form-item>

        <el-form-item v-if="model.hasResper" label="居住证省份" prop="residenceProvince">
          <el-select :disabled="!staff.ResperMessage.isedit" clearable v-model="model.residenceProvince" placeholder="请选择" @change="queryResidenceCities">
            <el-option
              v-for="p in provinces"
              :key="p.uid"
              :label="p.name"
              :value="p.uid">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="model.hasResper" label="居住证城市" prop="residenceCity">
          <el-select :disabled="!staff.ResperMessage.isedit" clearable v-model="model.residenceCity" placeholder="请选择">
            <el-option
              v-for="c in residenceCities"
              :key="c.uid"
              :label="c.name"
              :value="c.uid">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="model.hasResper" label="居住证办理时间" prop="resperst">
          <el-date-picker
            :readonly="!staff.ResperMessage.isedit"
            v-model="model.resperst"
            type="date"
            placeholder="选择日期"
            :editable="false">
          </el-date-picker>
        </el-form-item>

        <el-form-item v-if="model.hasResper" label="居住证截止日期" prop="resperet">
          <el-date-picker
            :readonly="!staff.ResperMessage.isedit"
            v-model="model.resperet"
            type="date"
            placeholder="选择日期"
            :editable="false">
          </el-date-picker>
        </el-form-item>

        <el-form-item v-if="staff.poreLocation" label="现居住地省份" prop="poreProvince">
          <el-select :disabled="!staff.poreLocation.isedit" clearable v-model="model.poreProvince" placeholder="请选择" @change="queryPoreCities">
            <el-option
              v-for="p in provinces"
              :key="p.uid"
              :label="p.name"
              :value="p.uid">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="staff.poreLocation" label="现居住地城市" prop="poreCity">
          <el-select :disabled="!staff.poreLocation.isedit" clearable v-model="model.poreCity" placeholder="请选择">
            <el-option
              v-for="c in poreCities"
              :key="c.uid"
              :label="c.name"
              :value="c.uid">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="staff.poreLocation" label="现居住地址" prop="poreAddress">
          <el-input :readonly="!staff.poreLocation.isedit" v-model="model.poreAddress"></el-input>
        </el-form-item>

        <el-form-item v-if="staff.personalEmail" label="个人邮箱" prop="personalEmail">
          <el-input :readonly="!staff.personalEmail.isedit" v-model="model.personalEmail"></el-input>
        </el-form-item>

        <!-- DO NOT DEL -->
        <el-form-item v-if="confList" label="紧急联系人">
        </el-form-item>
        <div v-if="confList" class="contacts-wrapper">
          <div class="contact" :span="24" v-for="(item, idx) in model.contacts">
            <el-form-item label="姓名" label-width="3.1em" :prop="'contacts[' + idx + '].emergContact'" :rules="{min: 2, max: 32, message: '请输入紧急联系人姓名(最少 2 个字符，最多 32 个字符)', trigger: 'change', transform: value => typeof value === 'string' ? value.trim() : ''}">
              <el-input v-model="item.emergContact"></el-input>
            </el-form-item>
            <el-form-item label="电话" label-width="3.1em" :prop="'contacts[' + idx + '].emergContactPhone'" :rules="{message: '请输入紧急联系人电话', trigger: 'change', transform: value => typeof value === 'string' ? value.trim() : '', pattern: /^1\d{10}$/}">
              <el-input v-model="item.emergContactPhone"></el-input>
            </el-form-item>
            <el-button v-if="idx > 0" class="remove-contact" type="danger" @click="rmvContact(item)"><i class="el-icon-delete"></i></el-button>
          </div>
          <el-button v-if="model.contacts.length < 3" class="add-contact" type="primary" @click="addContact">添加紧急联系人</el-button>
        </div>

        <el-form-item v-if="staff.childMessage" label="是否有子女">
          <el-switch
            :disabled="!staff.childMessage.isedit"
            v-model="model.hasChild"
            on-text="有"
            off-text="无">
          </el-switch>
        </el-form-item>

        <div v-if="staff.childMessage && model.hasChild">
          <div class="child" v-for="(item, idx) in model.childs">
            <el-form-item label="子女姓名" :prop="'childs[' + idx + '].name'" :rules="{min: 2, max: 32, message: '请输入子女姓名(最少 2 个字符，最多 32 个字符)', trigger: 'change', transform: value => typeof value === 'string' ? value.trim() : ''}">
              <el-input :readonly="!staff.childMessage.isedit" v-model="item.name"></el-input>
            </el-form-item>
            <el-form-item label="子女性别" :prop="'childs[' + idx + '].gender'" :rules="{type: 'number', message: '请选择子女性别', trigger: 'change', validator: (rule, value, callback) => {callback()}}">
              <el-radio-group :disabled="!staff.childMessage.isedit" v-model="item.gender">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="0">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="子女出生日期" :prop="'childs[' + idx + '].dateOfBirth'" :rules="{type: 'date', message: '请选择子女出生日期', trigger: 'change', validator: (rule, value, callback) => {callback()}}">
              <el-date-picker
                :readonly="!staff.childMessage.isedit"
                v-model="item.dateOfBirth"
                type="date"
                placeholder="选择出生日期"
                :editable="false">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="子女出生证明">
              <el-upload
                v-if="staff.childMessage.isedit"
                action="/api/v1.0/client/upload"
                name="files"
                :show-file-list="false"
                :headers="tokenHeader"
                :on-success="makeChildOk(item)"
                :before-upload="makeChildCheck(item)">
                <i class="el-icon-plus"></i> 如子女不满1周岁需要提供出生证明
              </el-upload>
              <img class="child-img" v-if="item.birthCertifUrl" :src="item.birthCertifUrl" />
              <p class="uploadErrorTip" v-show="item.err">请上传正确的出生证明(格式为 jpg 或 jpeg 或 png，照片体积小于 2 兆)</p>
            </el-form-item>
            <el-button v-if="idx > 0" class="remove-child" type="danger" @click="rmvChild(item)"><i class="el-icon-delete"></i></el-button>
          </div>
          <el-button class="add-child" type="primary" @click="addChild">添加子女</el-button>
        </div>

        <el-form-item v-if="staff.finallyEmpCom" label="上一家受聘公司" prop="finallyEmpCom">
          <el-input :readonly="!staff.finallyEmpCom.isedit" v-model="model.finallyEmpCom"></el-input>
        </el-form-item>

        <el-form-item v-if="staff.eduInfor" label="最高学历" prop="maxinumDeucaLevel">
          <el-select :disabled="!staff.eduInfor.isedit" clearable v-model="model.maxinumDeucaLevel" placeholder="请选择">
            <el-option
              v-for="(v, k) in maxinumDeucaLevels"
              :key="k"
              :label="v"
              :value="k">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="staff.eduInfor" label="学历类型" prop="diplomaType">
          <el-select :disabled="!staff.eduInfor.isedit" clearable v-model="model.diplomaType" placeholder="请选择">
            <el-option
              v-for="(v, k) in diplomaTypes"
              :key="k"
              :label="v"
              :value="k">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="staff.eduInfor" label="毕业院校" prop="graduateInst">
          <el-input :readonly="!staff.eduInfor.isedit" v-model="model.graduateInst"></el-input>
        </el-form-item>

        <el-form-item v-if="staff.eduInfor" label="入学日期" prop="entSchst">
          <el-date-picker
            :readonly="!staff.eduInfor.isedit"
            v-model="model.entSchst"
            type="month"
            placeholder="选择日期"
            :editable="false">
          </el-date-picker>
        </el-form-item>

        <el-form-item v-if="staff.eduInfor" label="毕业日期" prop="entSchet">
          <el-date-picker
            :readonly="!staff.eduInfor.isedit"
            v-model="model.entSchet"
            type="month"
            placeholder="选择日期"
            :editable="false">
          </el-date-picker>
        </el-form-item>

        <el-form-item v-if="staff.eduInfor" label="专业" prop="major">
          <el-input :readonly="!staff.eduInfor.isedit" v-model="model.major"></el-input>
        </el-form-item>

        <el-form-item v-if="staff.eduInfor" label="学位证书">
          <el-upload
            v-if="staff.eduInfor.isedit"
            action="/api/v1.0/client/upload"
            name="files"
            :show-file-list="false"
            :headers="tokenHeader"
            :on-success="diplomaUrlOk"
            :before-upload="beforeDiplomaUrl">
            <i class="el-icon-plus"></i> 学位证书
          </el-upload>
          <div v-if="model.diplomaUrl" class="upload-img-wrapper">
            <i class="fa fa-times" @click.stop="model.diplomaUrl = ''" aria-hidden="true"></i>
            <img :src="model.diplomaUrl" />
          </div>
          <p class="uploadErrorTip" v-show="diplomaUrlErrFlag">请上传正确的学位证书照片(格式为 jpg 或 jpeg 或 png，照片体积小于 2 兆)</p>
        </el-form-item>

        <el-form-item v-if="staff.eduInfor" label="毕业证书">
          <el-upload
            v-if="staff.eduInfor.isedit"
            action="/api/v1.0/client/upload"
            name="files"
            :show-file-list="false"
            :headers="tokenHeader"
            :on-success="greducaCertUrlOk"
            :before-upload="beforeGreducaCertUrl">
            <i class="el-icon-plus"></i> 毕业证书
          </el-upload>
          <div v-if="model.greducaCertUrl" class="upload-img-wrapper">
            <i class="fa fa-times" @click.stop="model.greducaCertUrl = ''" aria-hidden="true"></i>
            <img :src="model.greducaCertUrl" />
          </div>
          <p class="uploadErrorTip" v-show="greducaCertUrlErrFlag">请上传正确的毕业证书照片(格式为 jpg 或 jpeg 或 png，照片体积小于 2 兆)</p>
        </el-form-item>

        <el-form-item v-if="staff.technicalTitle" label="职称" prop="technicalTitle">
          <el-input :readonly="!staff.technicalTitle.isedit" v-model="model.technicalTitle"></el-input>
        </el-form-item>

        <el-form-item v-if="staff.resumeUrl" label="简历">
          <el-upload
            v-if="staff.resumeUrl.isedit"
            action="/api/v1.0/client/upload"
            name="files"
            :show-file-list="false"
            :headers="tokenHeader"
            :on-success="resumeUrlOk"
            :before-upload="beforeResumeUrl">
            <i class="el-icon-plus"> 上传简历</i>
          </el-upload>
          <p v-if="model.resumeUrl" class="el-icon-check"> 上传成功 <i class="fa fa-times" @click.stop="model.resumeUrl = ''"></i><a :href="model.resumeUrl + `&openId=${tokenHeader.openId}`">下载</a></p>
          <p class="uploadErrorTip" v-show="resumeUrlErrFlag">请上传正确的简历(格式为 doc 或 docx 或 pdf，照片体积小于 2 兆)</p>
        </el-form-item>

        <el-form-item v-if="staff.hasComres" label="是否有竞业协议">
          <el-form-item>
            <el-switch
              :disabled="!staff.hasComres.isedit"
              v-model="model.hasComres"
              on-text="有"
              off-text="无">
            </el-switch>
          </el-form-item>
          <el-form-item v-if="model.hasComres" prop="hasComresRmk">
            <el-input :readonly="!staff.hasComres.isedit" v-model="model.hasComresRmk" placeholder="备注信息"></el-input>
          </el-form-item>
        </el-form-item>

        <el-form-item v-if="staff.emplsepacertUrl" label="离职证明">
          <el-upload
            v-if="staff.emplsepacertUrl.isedit"
            action="/api/v1.0/client/upload"
            name="files"
            :show-file-list="false"
            :headers="tokenHeader"
            :on-success="emplsepacertUrlOk"
            :before-upload="beforeEmplsepacertUrl">
            <i class="el-icon-plus"> 上传离职证明</i>
          </el-upload>
          <p v-if="model.emplsepacertUrl" class="el-icon-check"> 上传成功 <i class="fa fa-times" @click.stop="model.emplsepacertUrl = ''"></i><a :href="model.emplsepacertUrl + `&openId=${tokenHeader.openId}`">下载</a></p>
          <p class="uploadErrorTip" v-show="emplsepacertUrlErrFlag">请上传正确的离职证明(格式为 doc 或 docx 或 pdf，照片体积小于 2 兆)</p>
        </el-form-item>
      </el-form>

      <div class="save-wrapper">
        <mt-button class="save" type="primary" @click="save">保存并更新</mt-button>
      </div>

    </mt-tab-container-item>

    <mt-tab-container-item id="2">

      <el-form label-position="left" :model="model" :rules="rules" ref="postFm" :label-width="labelWidth">

        <!--<el-form-item v-if="staffRecord.contracMes" label="合同类型">-->
          <!--{{contractTypes && contractTypes[model.record.contract.contracType.toString()]}}-->
        <!--</el-form-item>-->
        <el-form-item v-if="staffRecord.contracMes" label="合同类型">
          {{contractTypes && contractTypes[model.record.contract.contracType.toString()]}}
        </el-form-item>

        <!-- 劳动合同 -->
        <el-form-item v-if="model.record.contract.contracType === '0'" label="合同生效日期">
          {{datefmt(model.record.contract.startTime)}}
        </el-form-item>

        <el-form-item v-if="model.record.contract.contracType === '0'" label="合同期限">
          {{model.record.contract.contractPeriod}}
          <!--<el-select :disabled="!staffRecord.contracMes.isedit" clearable v-model="model.record.contract.contractPeriod" placeholder="请选择">
            <el-option
              v-for="item in contractPeriods"
              :key="item.val"
              :label="item.name"
              :value="item.val">
            </el-option>
          </el-select>-->
        </el-form-item>

        <el-form-item v-if="model.record.contract.contracType === '0'" label="合同结束日期">
          {{ formalEndTime }}
        </el-form-item>

        <el-form-item v-if="model.record.contract.contracType === '0'" label="合同附件">
          <a v-if="model.record.contract.contractUrl" :href="model.record.contract.contractUrl + `&openId=${tokenHeader.openId}`">下载</a>
          <!--<el-upload
            v-if="staffRecord.contracMes.isedit"
            action="/api/v1.0/client/upload"
            :show-file-list="false"
            :headers="tokenHeader"
            :on-success="recordContractUrlOk"
            :before-upload="beforeRecordContractUrl">
            <i class="el-icon-plus"> 上传合同附件</i>
          </el-upload>
          <p v-if="model.record.contract.contractUrl" class="el-icon-check"> 上传成功 <i class="fa fa-times" @click.stop="model.record.contract.contractUrl = ''"></i><a :href="model.record.contract.contractUrl + `&openId=${tokenHeader.openId}`">下载</a></p>
          <p class="uploadErrorTip" v-show="recordContractUrlErrFlag">请上传正确的合同附件(格式为 doc 或 docx 或 pdf，照片体积小于 2 兆)</p>-->
        </el-form-item>

        <el-form-item v-if="model.record.contract.contracType === '0'" label="候选人来源渠道">
          {{recruitmentChannels[+model.record.contract.recruitmentChannel]}}
          <!--<el-select :disabled="!staffRecord.contracMes.isedit" clearable v-model="model.record.contract.recruitmentChannel" placeholder="请选择">
            <el-option
              v-for="(item, idx) in recruitmentChannels"
              :key="idx"
              :label="item"
              :value="idx">
            </el-option>
          </el-select>-->
        </el-form-item>

        <el-form-item v-if="model.record.contract.contracType === '0'" label="基础薪资">
          {{model.record.baseSalary}}元
          <!--<el-input :readonly="!staffRecord.contracMes.isedit" v-model="model.record.baseSalary"></el-input>-->
        </el-form-item>

        <el-form-item v-if="model.record.contract.contracType === '0'" label="试用薪资">
          {{model.record.trialSalary}}元
          <!--<el-input :readonly="!staffRecord.contracMes.isedit" v-model="model.record.trialSalary"></el-input>-->
        </el-form-item>

        <!-- 实习合同 -->
        <el-form-item label="实习合同生效日期" v-if="model.record.contract.contracType === '1'">
          {{datefmt(model.record.contract.startTime)}}
          <!--<el-date-picker
            :readonly="!staffRecord.contracMes.isedit"
            v-model="model.record.contract.startTime"
            type="date"
            placeholder="选择日期"
            :editable="false">
          </el-date-picker>-->
        </el-form-item>

        <el-form-item label="实习合同结束日期" v-if="model.record.contract.contracType === '1'">
          {{datefmt(model.record.contract.endTime)}}
          <!--<el-date-picker
            :readonly="!staffRecord.contracMes.isedit"
            v-model="model.record.contract.endTime"
            type="date"
            placeholder="选择日期"
            :editable="false">
          </el-date-picker>-->
        </el-form-item>

        <el-form-item label="实习合同附件" v-if="model.record.contract.contracType === '1'">
          <a v-if="model.record.contract.contractUrl" :href="model.record.contract.contractUrl + `&openId=${tokenHeader.openId}`">下载</a>
          <!--<el-upload
            v-if="staffRecord.contracMes.isedit"
            action="/api/v1.0/client/upload"
            :show-file-list="false"
            :headers="tokenHeader"
            :on-success="recordContractUrlOk"
            :before-upload="beforeRecordContractUrl">
            <i class="el-icon-plus"> 上传实习合同附件</i>
          </el-upload>
          <p v-if="model.record.contract.contractUrl" class="el-icon-check"> 上传成功 <i class="fa fa-times" @click.stop="model.record.contract.contractUrl = ''"></i><a :href="model.record.contract.contractUrl + `&openId=${tokenHeader.openId}`">下载</a></p>
          <p class="uploadErrorTip" v-show="recordContractUrlErrFlag">请上传正确的实习合同附件(格式为 doc 或 docx 或 pdf，照片体积小于 2 兆)</p>-->
        </el-form-item>

        <!-- 返聘 -->
        <el-form-item label="返聘协议" v-if="model.record.contract.contracType === '2'">
          <a v-if="model.record.contract.contractUrl" :href="model.record.contract.contractUrl + `&openId=${tokenHeader.openId}`">下载</a>
          <!--<el-upload
            v-if="staffRecord.contracMes.isedit"
            action="/api/v1.0/client/upload"
            :show-file-list="false"
            :headers="tokenHeader"
            :on-success="recordContractUrlOk"
            :before-upload="beforeRecordContractUrl">
            <i class="el-icon-plus"> 上传返聘协议</i>
          </el-upload>
          <p v-if="model.record.contract.contractUrl" class="el-icon-check"> 上传成功 <i class="fa fa-times" @click.stop="model.record.contract.contractUrl = ''"></i><a :href="model.record.contract.contractUrl + `&openId=${tokenHeader.openId}`">下载</a></p>
          <p class="uploadErrorTip" v-show="recordContractUrlErrFlag">请上传正确的返聘协议附件(格式为 doc 或 docx 或 pdf，照片体积小于 2 兆)</p>-->
        </el-form-item>

        <!-- 兼职 -->
        <el-form-item label="兼职协议生效日期"  v-if="model.record.contract.contracType === '3'">
          {{datefmt(model.record.contract.startTime)}}
          <!--<el-date-picker
            :readonly="!staffRecord.contracMes.isedit"
            v-model="model.record.contract.startTime"
            type="date"
            placeholder="选择日期"
            :editable="false">
          </el-date-picker>-->
        </el-form-item>

        <el-form-item label="兼职协议结束日期" v-if="model.record.contract.contracType === '3'">
          {{datefmt(model.record.contract.endTime)}}
          <!--<el-date-picker
            :readonly="!staffRecord.contracMes.isedit"
            v-model="model.record.contract.endTime"
            type="date"
            placeholder="选择日期"
            :editable="false">
          </el-date-picker>-->
        </el-form-item>

        <el-form-item label="兼职协议附件" v-if="model.record.contract.contracType === '3'">
          <a v-if="model.record.contract.contractUrl" :href="model.record.contract.contractUrl + `&openId=${tokenHeader.openId}`">下载</a>
          <!--<el-upload
            v-if="staffRecord.contracMes.isedit"
            action="/api/v1.0/client/upload"
            :show-file-list="false"
            :headers="tokenHeader"
            :on-success="recordContractUrlOk"
            :before-upload="beforeRecordContractUrl">
            <i class="el-icon-plus"> 上传兼职协议附件</i>
          </el-upload>
          <p v-if="model.record.contract.contractUrl" class="el-icon-check"> 上传成功 <i class="fa fa-times" @click.stop="model.record.contract.contractUrl = ''"></i><a :href="model.record.contract.contractUrl + `&openId=${tokenHeader.openId}`">下载</a></p>
          <p class="uploadErrorTip" v-show="recordContractUrlErrFlag">请上传正确的兼职协议附件(格式为 doc 或 docx 或 pdf，照片体积小于 2 兆)</p>-->
        </el-form-item>

        <el-form-item v-if="staffRecord.dateOfEntry" label="入职时间">
          {{datefmt(model.record.dateOfEntry)}}
          <!--<el-date-picker
            :readonly="!staffRecord.dateOfEntry.isedit"
            v-model="model.record.dateOfEntry"
            type="datetime"
            placeholder="选择日期"
            :editable="false">
          </el-date-picker>-->
        </el-form-item>

        <el-form-item v-if="model.record.contract.contracType === '0' && staffRecord.contracMes" label="试用期">
          {{probations && probations[model.record.probation.toString()]}}
          <!--<el-select :disabled="!staffRecord.contracMes.isedit" clearable v-model="model.record.probation" placeholder="请选择">
            <el-option
              v-for="(v, k) in probations"
              :key="k"
              :label="v"
              :value="k">
            </el-option>
          </el-select>-->
        </el-form-item>

        <el-form-item label="司龄">
          {{typeof model.record.companyAge === 'number' ? model.record.companyAge.toFixed(1) : '0.0'}} 年(司龄计算是根据入职日期开始计算)
        </el-form-item>

        <el-form-item label="所在部门" v-if="staffRecord.deptUid">
          {{emp && emp.record && emp.record.deptName}}
          <!--<el-select clearable v-model="model.record.deptUid" placeholder="请选择">
            <el-option
              v-for="item in depts"
              :key="item.uid"
              :label="item.name"
              :value="item.uid">
            </el-option>
          </el-select>-->
        </el-form-item>

        <el-form-item v-if="staffRecord.position" label="职位">
          {{model.record.position}}
          <!--<el-input :readonly="!staffRecord.position.isedit" v-model="model.record.position"></el-input>-->
        </el-form-item>

        <el-form-item v-if="staffRecord.jobGrade" label="职级">
          {{model.record.jobGrade}}
          <!--<el-input :readonly="!staffRecord.jobGrade.isedit" v-model="model.record.jobGrade"></el-input>-->
        </el-form-item>

        <el-form-item v-if="false" label="首次工作时间">
          {{datefmt(model.record.fristWorkTime)}}
          <!--<el-date-picker
            v-model="model.record.fristWorkTime"
            type="date"
            placeholder="选择日期"
            :editable="false">
          </el-date-picker>-->
        </el-form-item>

        <el-form-item label="工龄">
          {{typeof model.record.workAge === 'number' ? model.record.workAge.toFixed(1) : '0.0'}} 年(工龄计算是根据首次参加工作时间开始计算)
        </el-form-item>

        <el-form-item v-if="staffRecord.jobNumber" label="工号">
          {{model.record.jobNumber}}
          <!--<el-input :readonly="!staffRecord.jobNumber.isedit" v-model="model.record.jobNumber"></el-input>-->
        </el-form-item>

        <el-form-item v-if="staffRecord.StaffStatus" label="员工状态">
          {{model.record.sstaffStatus}}
          <!--6-16-17新增员工状态-->
          <!--<el-input :readonly="!staffRecord.jobNumber.isedit" v-model="model.record.jobNumber"></el-input>-->
        </el-form-item>

        <el-form-item v-if="staffRecord.workEmail" label="工作邮箱">
          {{model.record.workEmail}}
          <!--<el-input :readonly="!staffRecord.workEmail.isedit" v-model="model.record.workEmail"></el-input>-->
        </el-form-item>

        <!--<el-form-item v-if="staffRecord.reporterJobNumber" label="汇报上级">-->
          <!--{{model.record.reporterJobNumber}}-->
          <!--&lt;!&ndash;<el-input :readonly="!staffRecord.reporterJobNumber.isedit" v-model="model.record.reporterJobNumber"></el-input>&ndash;&gt;-->
        <!--</el-form-item>   这个是jd原有的-->
        <el-form-item v-if="staffRecord.reporterJobNumber" label="汇报上级">
          {{staffRecord.upji}}
          <!--<el-input :readonly="!staffRecord.reporterJobNumber.isedit" v-model="model.record.reporterJobNumber"></el-input>-->
        </el-form-item>

        <el-form-item v-if="staffRecord.workLocation" label="工作地省份">
          {{provinces && getPC(model.record.workProvince || '', model.record.workCity || '')}}
          <!--<el-select :disabled="!staffRecord.workLocation.isedit" clearable v-model="model.record.workProvince" placeholder="请选择省" @change="queryWorkCities">
            <el-option
              v-for="p in provinces"
              :key="p.uid"
              :label="p.name"
              :value="p.uid">
            </el-option>
          </el-select>-->
        </el-form-item>

        <el-form-item v-if="staffRecord.workLocation" label="工作地城市">
          {{staticWorkCity}}
          <!--<el-select :disabled="!staffRecord.workLocation.isedit" clearable v-model="model.record.workCity" placeholder="请选择市">
            <el-option
              v-for="c in workCities"
              :key="c.uid"
              :label="c.name"
              :value="c.uid">
            </el-option>
          </el-select>-->
        </el-form-item>

        <el-form-item v-if="staffRecord.workLocation" label="工作地址">
          {{model.record.workAddress}}
          <!--<el-input :readonly="!staffRecord.workLocation.isedit" v-model="model.record.workAddress"></el-input>-->
        </el-form-item>

      </el-form>


      <el-form label-position="left" :model="model" :rules="rules" ref="optionFm" :label-width="labelWidth">

        <el-form-item v-if="staffShareOption.awardDate" label="授予日期">
          {{datefmt(model.shareOption.awardDate)}}
          <!--<el-date-picker
            :readonly="!staffShareOption.awardDate.isedit"
            v-model="model.shareOption.awardDate"
            type="date"
            placeholder="选择日期"
            :editable="false">
          </el-date-picker>-->
        </el-form-item>

        <el-form-item v-if="staffShareOption.awardAmount" label="授予总数量">
          {{model.shareOption.awardAmount}}
          <!--<el-input :readonly="!staffShareOption.awardAmount.isedit" type="number" v-model="model.shareOption.awardAmount"></el-input>-->
        </el-form-item>

        <el-form-item v-if=" staffShareOption.awardRound" label="授予轮次">
          {{model.shareOption.awardRound}}轮
          <!--<el-input :readonly="!staffShareOption.awardRound.isedit" type="number" v-model="model.shareOption.awardRound">
            <template slot="append">轮</template>
          </el-input>-->
        </el-form-item>

        <el-form-item v-if="staffShareOption.exercSchedule" label="行权期">
          {{model.shareOption.exercSchedule}}月
          <!--<el-input :readonly="!staffShareOption.exercSchedule.isedit" type="number" v-model="model.shareOption.exercSchedule">
            <template slot="append">月</template>
          </el-input>-->
        </el-form-item>

        <el-form-item v-if="staffShareOption.terminallyCount" label="每期数量">
          {{model.shareOption.terminallyCount}}
          <!--<el-input :readonly="!staffShareOption.terminallyCount.isedit" type="number" v-model="model.shareOption.terminallyCount"></el-input>-->
        </el-form-item>

        <el-form-item v-if="staffShareOption.terminallyCount" label="期权合同">
          <a v-if="model.shareOption.contractUrl" :href="model.shareOption.contractUrl + `&openId=${tokenHeader.openId}`">下载</a>
          <!--<el-upload
            v-if="staffShareOption.contractUrl.isedit"
            action="/api/v1.0/client/upload"
            :show-file-list="false"
            :headers="tokenHeader"
            :on-success="contractUrlOk"
            :before-upload="beforeContractUrl">
            <i class="el-icon-plus"> 上传期权合同</i>
          </el-upload>
          <p v-if="model.shareOption.contractUrl" class="el-icon-check"> 上传成功 <i class="fa fa-times" @click.stop="model.shareOption.contractUrl = ''"></i><a :href="model.shareOption.contractUrl + `&openId=${tokenHeader.openId}`">下载</a></p>
          <p class="uploadErrorTip" v-show="contractUrlErrFlag">请上传正确的期权合同(格式为 doc 或 docx 或 pdf，照片体积小于 2 兆)</p>-->
        </el-form-item>

        <el-form-item v-if="staffShareOption.awardRate" label="授予总比例">
          {{model.shareOption.awardRate}}%
          <!--<el-input :readonly="!staffShareOption.awardRate.isedit" v-model="model.shareOption.awardRate">
            <template slot="append">%</template>
          </el-input>-->
        </el-form-item>

        <el-form-item v-if="staffShareOption.terminallyRate" label="每期比例">
          {{model.shareOption.terminallyRate}}%
          <!--<el-input :readonly="!staffShareOption.terminallyRate.isedit" v-model="model.shareOption.terminallyRate">
            <template slot="append">%</template>
          </el-input>-->
        </el-form-item>

      </el-form>
    </mt-tab-container-item>

  </mt-tab-container>



</div>
</template>
<script>

import moment from 'moment'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import V from 'vue'
import utils from '@/components/utils'

let transform = value => typeof value === 'string' ? value.trim() : '';
let noopValidator = (rule, value, callback, source, options) => {
  // console.log(rule, value, source, options);
  // return true;
  callback();
};

V.use(ElementUI);
// import VueCoreImageUpload from 'vue-core-image-upload'

export default {
  data() {
    return {
      selected: '1',
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
        childMessage: '',
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
        upji:'',
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
      labelWidth: '113px',
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
      workCities: null,
      contractTypes: null,
      contractPeriods: [
        {name: '1 年', val: 1},
        {name: '2 年', val: 2},
        {name: '3 年', val: 3}
      ],
      recruitmentChannels: ['百度', '51job', '智联', '推荐', 'boss 直聘'],
      personFlag: false,
      postFlag: false,
      optionFlag: false,
      model: {
        uid: '',
        name: '',
        gender: '',
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
            gender: '',
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
        resumeUrl: '', // 简历
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
          // staffStatus: '', // 员工状态
          // jobTransferTime: '', // 调岗日期
          // jobTransferResult: '', // 调岗原因
          // becomeFullTime: '', // 转正日期
          // becomeFullEvaluate: '', // 转正评价
          baseSalary: '', // 基础薪资
          trialSalary: '', // 试用薪资
          contract: {
            contracType: '', // 合同类型
            startTime: '', // 合同生效日期
            contractPeriod: '', // 合同期限
            endTime: '', // 合同结束日期
            contractUrl: '', // 合同附件
            recruitmentChannel: '', // 候选人来源渠道
            // terminaleTime: '', // 合同终止日期
            // terminaleResult: '' // 合同终止原因
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
      },
      rules: {
        name: [
          {
            required: true, min: 2, max: 32, message: '请输入员工姓名(最少 2 个字符，最多 32 个字符)', trigger: 'change', transform
          }
        ],
        gender: [
          {
            type: 'number', required: true, message: '请选择性别', trigger: 'change'
          }
        ],
        mobile: [
          {
            required: true, message: '请输入正确的手机号', trigger: 'change', transform, pattern: /^1\d{10}$/
          }
        ],
        nativePlace: [
          {
            message: '请选择国籍', trigger: 'change', validator: noopValidator
          }
        ],
        passportNum: [
          {
            message: '请填写护照号', trigger: 'change', transform
          }
        ],
        idcard: [
          {
            required: true, message: '请填写正确的身份证号', trigger: 'change',
            transform, pattern: /^\d{17}(?:\d|[Xx])$/
          }
        ],
        socsecNum: [
          {
            message: '请填写正确的社保编号', trigger: 'change',
            transform, pattern: /^\d{7,9}$/
          }
        ],
        accfuNum: [
          {
            message: '请填写正确的公积金编号', trigger: 'change', transform, pattern: /^\d{12}$/
          }
        ],
        bankName: [
          {
            message: '请选择银行', trigger: 'change', validator: noopValidator
          }
        ],
        openingBank: [
          {
            message: '请填写正确的开户行名称(最多 64 个字符)', trigger: 'change', transform, max: 64
          }
        ],
        cardNumber: [
          {
            message: '请填写正确的银行卡号', trigger: 'change', transform, pattern: /^\d{19}$/
          }
        ],
        englishName: [
          {
            message: '请填写正确的英文名(最多 32 个字符)', trigger: 'change', transform, pattern: /^[a-zA-Z]{1,32}$/
          }
        ],
        qq: [
          {
            message: '请填写正确的 QQ 号(最多 24 个字符)', trigger: 'change', transform, pattern: /^\d{1,24}$/
          }
        ],
        wechart: [
//          {
//            message: '请填写正确的微信号(最多 24 个字符)', trigger: 'change', transform, pattern: /^\d{1,24}$/
//          }
        ],
        maritalStatus: [
          {
            message: '请选择婚姻状况', trigger: 'change', validator: noopValidator
          }
        ],
        nation: [
          {
            message: '请选择民族', trigger: 'change', validator: noopValidator
          }
        ],
        politicsStatus: [
          {
            message: '请选择政治面貌', trigger: 'change', validator: noopValidator
          }
        ],
        thePartyTime: [
          {
            message: '请选择入党时间', trigger: 'change', validator: noopValidator
          }
        ],
        theArcIns: [
          {
            message: '请输入正确的存档机构(最多 128 个字符)',trigger: 'change', transform, max: 128
          }
        ],
        dateOfBirth: [
          {
            required: true, type: 'date', message: '请选择出生日期', trigger: 'change'
          }
        ],
        podoProvince: [
          {
            required: true, message: '请选择户口所在省份', trigger: 'change'
          }
        ],
        podoCity: [
          {
            required: true, message: '请选择户口所在城市', trigger: 'change'
          }
        ],
        podoAddress: [
          {
            required: true, message: '请输入正确的户口详细地址(最多 256 个字符)',trigger: 'change', transform, max: 256
          }
        ],
        typeOfDemicile: [
          {
            required: true, message: '请选择户口性质', trigger: 'change'
          }
        ],
        residenceProvince: [
          {
            message: '请选择居住证所在省份', trigger: 'change', validator: noopValidator
          }
        ],
        residenceCity: [
          {
            message: '请选择居住证所在城市', trigger: 'change', validator: noopValidator
          }
        ],
        resperst: [
          {
            type: 'date', message: '请选择居住证办理时间', trigger: 'change', validator: noopValidator
          }
        ],
        resperet: [
          {
            type: 'date', message: '请选择居住证截止日期', trigger: 'change', validator: noopValidator
          }
        ],
        poreProvince: [
          {
            message: '请选择现居住地所在省份', trigger: 'change', validator: noopValidator
          }
        ],
        poreCity: [
          {
            message: '请选择现居住地所在城市', trigger: 'change', validator: noopValidator
          }
        ],
        poreAddress: [
          {
            message: '请输入正确的现居住地详细地址(最多 256 个字符)',trigger: 'change', transform, max: 256
          }
        ],
        personalEmail: [
          {
            type: 'email', message: '请输入正确的个人邮箱', trigger: 'change', transform
          }
        ],
        finallyEmpCom: [
          {
            message: '请输入正确的上一家受聘公司(最多 256 个字符)',trigger: 'change', transform, max: 256
          }
        ],
        maxinumDeucaLevel: [
          {
            message: '请选择最高学历', trigger: 'change', validator: noopValidator
          }
        ],
        diplomaType: [
          {
            message: '请选择学历类型', trigger: 'change', validator: noopValidator
          }
        ],
        graduateInst: [
          {
            message: '请输入正确的毕业院校(最多 64 个字符)',trigger: 'change', transform, max: 64
          }
        ],
        entSchst: [
          {
            type: 'date', message: '请选择入学日期', trigger: 'change', validator: noopValidator
          }
        ],
        entSchet: [
          {
            type: 'date', message: '请选择毕业日期', trigger: 'change', validator: noopValidator
          }
        ],
        major: [
          {
            message: '请输入正确的专业名称(最多 32 个字符)',trigger: 'change', transform, max: 32
          }
        ],
        technicalTitle: [
          {
            message: '请输入正确的职称(最多 32 个字符)',trigger: 'change', transform, max: 32
          }
        ],
        hasComresRmk: [
          {
            message: '请输入备注信息(最多 32 个字符)',trigger: 'change', transform, max: 32
          }
        ],
        'record.contract.contracType': [
          {
            required: true, message: '请选择合同类型', trigger: 'change'
          }
        ],
        'record.contract.startTime': [
          {
            required: true, type: 'date', message: '请选择合同生效日期', trigger: 'change'
          }
        ],
        'record.contract.endTime': [
          {
            required: true, type: 'date', message: '请选择合同结束日期', trigger: 'change'
          }
        ],
        'record.contract.contractPeriod': [
          {
            required: true, message: '请选择合同期限', trigger: 'change', type: 'number'
          }
        ],
        'record.contract.recruitmentChannel': [
          {
            required: true, message: '请选择候选人来源渠道', trigger: 'change', type: 'number'
          }
        ],
        'record.baseSalary': [
          {
            required: true, message: '请输入基本薪资', trigger: 'change', transform, pattern: /^[0-9]+(\.[0-9]+)?$/
          }
        ],
        'record.trialSalary': [
          {
            required: true, message: '请输入试用薪资', trigger: 'change', transform, pattern: /^[0-9]+(\.[0-9]+)?$/
          }
        ],
        'record.dateOfEntry': [
          {
            required: true, type: 'date', message: '请选择入职时间', trigger: 'change'
          }
        ],
        'record.probation': [
          {
            required: true, message: '请选择试用期', trigger: 'change'
          }
        ],
        'record.position': [
          {
            required: true, message: '请输入职位(最多 32 个字符)', trigger: 'change', transform, max: 32
          }
        ],
        'record.jobGrade': [
          {
            required: true, message: '请输入职级(最多 32 个字符)', trigger: 'change', transform, max: 32
          }
        ],
        'record.deptUid': [
          {
            required: true, message: '请选择所在部门', trigger: 'change'
          }
        ],
        'record.fristWorkTime': [
          {
            required: true, type: 'date', message: '请选择首次参加工作时间', trigger: 'change'
          }
        ],
        'record.workEmail': [
          {
            type: 'email', message: '请输入正确的工作邮箱', trigger: 'change', transform
          }
        ],
        'record.jobNumber': [
          {
            required: true, message: '请输入工号(最多 32 个字符)', trigger: 'change', transform, max: 32
          }
        ],
        'record.reporterJobNumber': [
          {
            message: '请选择汇报上级', trigger: 'change'
          }
        ],
        'record.workProvince': [
          {
            message: '请选择工作地所在省份', trigger: 'change', validator: noopValidator
          }
        ],
        'record.workCity': [
          {
            message: '请选择工作地所在城市', trigger: 'change', validator: noopValidator
          }
        ],
        'record.workAddress': [
          {
            message: '请输入正确的工作地址(最多 256 个字符)',trigger: 'change', transform, max: 256
          }
        ],
        'record.staffStatus': [
          {
            required: true, message: '请选择员工状态', trigger: 'change', type: 'number'
          }
        ],
        'shareOption.awardDate': [
          {
            type: 'date', message: '请选择授予日期', trigger: 'change', validator: noopValidator
          }
        ],
        'shareOption.awardAmount': [
          {
            message: '请输入授予总数量', trigger: 'change', transform, pattern: /^\d+$/
          }
        ],
        'shareOption.awardRate': [
          {
            message: '请输入授予总比例', trigger: 'change', transform, pattern: /^[0-9]+(\.[0-9]+)?$/
          }
        ],
        'shareOption.awardRound': [
          {
            message: '请输入授予轮次', trigger: 'change', transform, pattern: /^\d+$/
          }
        ],
        'shareOption.exercSchedule': [
          {
            message: '请输入行权期', trigger: 'change', transform, pattern: /^\d+$/
          }
        ],
        'shareOption.terminallyCount': [
          {
            message: '请输入每期数量', trigger: 'change', transform, pattern: /^\d+$/
          }
        ],
        'shareOption.terminallyRate': [
          {
            message: '请输入每期比例', trigger: 'change', transform, pattern: /^[0-9]+(\.[0-9]+)?$/
          }
        ]
      }
    }
  },
  computed: {
    formalEndTime() {
      let ct = this.model.record.contract;
      if(
        ct.contracType === '0'
        && ct.startTime
        && ct.contractPeriod
      ) {
        return moment(ct.startTime).add(ct.contractPeriod, 'years').subtract(1, 'days').format('YYYY-MM-DD');
      }else {
        return '';
      }
    }
  },
  methods: {
    datefmt(str) {
      if(str) return moment(str).format('YYYY-MM-DD');
      else return '';
    },
    getPC(pid, cid) {
      let p = '';
      this.provinces.forEach(v => {
        if(pid.toString() === v.uid) {
          p = v.name;
          this.$http.get(`/api/v1.0/client/query/city/${pid}`)
            .then(res => {
              res = res.body;
              if(res.code === 200) {
                res.result.forEach(v => {
                  if(v.uid === cid.toString()) {
                    this.staticWorkCity = v.name;
                    return false;
                  }
                });
                this.workCities = res.result;
              }
            })
          return false;
        }
      });
      return p;
    },
    queryProvinces() {
      this.$http.get('/api/v1.0/common/query/province')
        .then(res => {
          res = res.body;
          console.log('p', res);
          if(res.code === 200) {
            this.provinces = res.result;
          }
        })
        .catch(err => {
          console.log(err.status, err.statusText);
        });
    },
    queryPodoCities(pid) {
      // podoCity podoCities
      if(!pid) {
        this.podoCities = null;
        this.model.podoProvince = '';
        this.model.podoCity = '';
        return;
      }
      this.$http.get(`/api/v1.0/common/query/city/${pid}`)
        .then(res => {
          res = res.body;
          if(res.code === 200) {
            this.podoCities = res.result;
          }
        })
        .catch(err => {
          console.log(err.status, err.statusText);
        });
    },
    queryResidenceCities(pid) {
      console.log('resident');
      if(!pid) {
        this.residenceCities = null;
        this.model.residenceProvince = '';
        this.model.residenceCity = '';
        return;
      }
      this.$http.get(`/api/v1.0/common/query/city/${pid}`)
        .then(res => {
          res = res.body;
          if(res.code === 200) {
            this.residenceCities = res.result;
          }
        })
        .catch(err => {
          console.log(err.status, err.statusText);
        });
    },
    queryPoreCities(pid) {
      if(!pid) {
        this.poreCities = null;
        this.model.poreProvince = '';
        this.model.poreCity = '';
        return;
      }
      this.$http.get(`/api/v1.0/common/query/city/${pid}`)
        .then(res => {
          res = res.body;
          if(res.code === 200) {
            this.poreCities = res.result;
          }
        })
        .catch(err => {
          console.log(err.status, err.statusText);
        });
    },
    queryWorkCities(pid) {
      if(!pid) {
        this.workCities = null;
        this.model.record.workProvince = '';
        this.model.record.workCity = '';
        return;
      }
      this.$http.get(`/api/v1.0/common/query/city/${pid}`)
        .then(res => {
          res = res.body;
          if(res.code === 200) {
            this.workCities = res.result;
          }
        })
        .catch(err => {
          console.log(err.status, err.statusText);
        });
    },
    makeChildOk(item) {
      return function(res, file) {
        if(res.code === 200) {
          item.birthCertifUrl = res.result;
        }
      }
    },
    makeChildCheck(item) {
      return function(file) {
        let isImage = utils.isImage(file);
        let isInSize = utils.isInSize(file);

        if(isImage && isInSize) {
          item.err = false;
        }else {
          item.err = true;
        }
        return isImage && isInSize;
      }
    },
    passportUrlOk(res, file) {
      this.model.passportUrl = URL.createObjectURL(file.raw);
      if(res.code === 200) {
        this.model.passportUrl = res.result;
      }
    },
    beforePassportUrl(file) {
      let isImage = utils.isImage(file);
      let isInSize = utils.isInSize(file);
      if(isImage && isInSize) {
        this.passportUrlErrFlag = false;
      }else {
        this.passportUrlErrFlag = true;
      }
      return isImage && isInSize;
    },
    idcardPhoUrlOk(res, file) {
      console.log(res);
      if(res.code === 200) {
        this.model.idcardPhoUrl = res.result;
      }
    },
    beforeIdcardPhoUrl(file) {
      console.log('file', file);
      let isImage = utils.isImage(file);
      let isInSize = utils.isInSize(file);
      if(isImage && isInSize) {
        this.idcardPhoUrlErrFlag = false;
      }else {
        this.idcardPhoUrlErrFlag = true;
      }
      return isImage && isInSize;
    },
    idcardPhoUrlRevOk(res, file) {
      if(res.code === 200) {
        this.model.idcardPhoUrlRev = res.result;
      }
    },
    beforeIdcardPhoUrlRev(file) {
      let isImage = utils.isImage(file);
      let isInSize = utils.isInSize(file);
      if(isImage && isInSize) {
        this.idcardPhoUrlRevErrFlag = false;
      }else {
        this.idcardPhoUrlRevErrFlag = true;
      }
      return isImage && isInSize;
    },
    staffPhoUrlOk(res, file) {
      if(res.code === 200) {
        this.model.staffPhoUrl = res.result;
      }
    },
    beforeStaffPhoUrl(file) {
      let isImage = utils.isImage(file);
      let isInSize = utils.isInSize(file);
      if(isImage && isInSize) {
        this.staffPhoUrlErrFlag = false;
      }else {
        this.staffPhoUrlErrFlag = true;
      }
      return isImage && isInSize;
    },
    houregPhoUrlOk(res, file) {
      if(res.code === 200) {
        this.model.houregPhoUrl = res.result;
      }
    },
    beforeHouregPhoUrl(file) {
      let isImage = utils.isImage(file);
      let isInSize = utils.isInSize(file);
      if(isImage && isInSize) {
        this.houregPhoUrlErrFlag = false;
      }else {
        this.houregPhoUrlErrFlag = true;
      }
      return isImage && isInSize;
    },
    houregPerphoUrlOk(res, file) {
      if(res.code === 200) {
        this.model.houregPerphoUrl = res.result;
      }
    },
    beforeHouregPerphoUrl(file) {
      let isImage = utils.isImage(file);
      let isInSize = utils.isInSize(file);
      if(isImage && isInSize) {
        this.houregPerphoUrlErrFlag = false;
      }else {
        this.houregPerphoUrlErrFlag = true;
      }
      return isImage && isInSize;
    },
    houregPerrevphoUrlOk(res, file) {
      if(res.code === 200) {
        this.model.houregPerrevphoUrl = res.result;
      }
    },
    beforeHouregPerrevphoUrl(file) {
      let isImage = utils.isImage(file);
      let isInSize = utils.isInSize(file);
      if(isImage && isInSize) {
        this.houregPerrevphoUrlErrFlag = false;
      }else {
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
        gender: '',
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
      if(res.code === 200) {
        this.model.diplomaUrl = res.result;
      }
    },
    beforeDiplomaUrl(file) {
      let isImage = utils.isImage(file);
      let isInSize = utils.isInSize(file);
      if(isImage && isInSize) {
        this.diplomaUrlErrFlag = false;
      }else {
        this.diplomaUrlErrFlag = true;
      }
      return isImage && isInSize;
    },
    greducaCertUrlOk(res, file) {
      if(res.code === 200) {
        this.model.greducaCertUrl = res.result;
      }
    },
    beforeGreducaCertUrl(file) {
      let isImage = utils.isImage(file);
      let isInSize = utils.isInSize(file);
      if(isImage && isInSize) {
        this.greducaCertUrlErrFlag = false;
      }else {
        this.greducaCertUrlErrFlag = true;
      }
      return isImage && isInSize;
    },
    resumeUrlOk(res, file) {
      if(res.code === 200) {
        this.model.resumeUrl = res.result;
      }
    },
    beforeResumeUrl(file) {
      let isDoc = utils.isDoc(file);
      let isInSize = utils.isInSize(file);
      if(isDoc && isInSize) {
        this.resumeUrlErrFlag = false;
      }else {
        this.resumeUrlErrFlag = true;
      }
      return isDoc && isInSize;
    },
    emplsepacertUrlOk(res, file) {
      if(res.code === 200) {
        this.model.emplsepacertUrl = res.result;
      }
    },
    beforeEmplsepacertUrl(file) {
      let isDoc = utils.isDoc(file);
      let isInSize = utils.isInSize(file);
      if(isDoc && isInSize) {
        this.emplsepacertUrlErrFlag = false;
      }else {
        this.emplsepacertUrlErrFlag = true;
      }
      return isDoc && isInSize;
    },
    contractUrlOk(res, file) {
      if(res.code === 200) {
        this.model.shareOption.contractUrl = res.result;
      }
    },
    beforeContractUrl(file) {
      let isDoc = utils.isDoc(file);
      let isInSize = utils.isInSize(file);
      if(isDoc && isInSize) {
        this.contractUrlErrFlag = false;
      }else {
        this.contractUrlErrFlag = true;
      }
      return isDoc && isInSize;
    },
    recordContractUrlOk(res, file) {
      if(res.code === 200) {
        this.model.record.contract.contractUrl = res.result;
      }
    },
    beforeRecordContractUrl(file) {
      let isDoc = utils.isDoc(file);
      let isInSize = utils.isInSize(file);
      if(isDoc && isInSize) {
        this.recordContractUrlErrFlag = false;
      }else {
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

        if(this.model.name.trim()) out.name = this.model.name;
        if(this.model.gender !== '') out.gender = this.model.gender;
        if(this.model.mobile.trim()) out.mobile = this.model.mobile;
        if(this.model.nativePlace !== '') out.nativePlace = this.model.nativePlace; // 国籍
        if(this.model.passportNum.trim() && this.model.nativePlace === 2) out.passportNum = this.model.passportNum; // 护照号
        if(this.model.passportUrl && this.model.nativePlace === 2) out.passportUrl = this.model.passportUrl; // 护照图片
        if(this.model.idcard.trim()) out.idcard = this.model.idcard; // 身份证号
        if(this.model.idcardPhoUrl) out.idcardPhoUrl = this.model.idcardPhoUrl; // 身份证照片正面
        if(this.model.idcardPhoUrlRev) out.idcardPhoUrlRev = this.model.idcardPhoUrlRev; // 身份证照片反面
        if(this.model.socsecNum.trim()) out.socsecNum = this.model.socsecNum; // 社保号
        if(this.model.accfuNum.trim()) out.accfuNum = this.model.accfuNum; // 公积金编号
        if(this.model.bankName !== '') out.bankName = this.model.bankName; // 银行名称
        if(this.model.openingBank.trim()) out.openingBank = this.model.openingBank; // 开户行
        if(this.model.cardNumber.trim()) out.cardNumber = this.model.cardNumber; // 银行卡号
        if(this.model.staffPhoUrl) out.staffPhoUrl = this.model.staffPhoUrl; // 员工照片
        if(this.model.englishName.trim()) out.englishName = this.model.englishName; // 英文名
        if(this.model.qq.trim()) out.qq = this.model.qq;
        if(this.model.wechart.trim()) out.wechart = this.model.wechart;
        if(this.model.maritalStatus !== '') out.maritalStatus = this.model.maritalStatus; // 婚姻状况
        if(this.model.nation !== '') out.nation = this.model.nation; // 民族
        if(this.model.politicsStatus !== '') out.politicsStatus = this.model.politicsStatus; // 政治面貌
        if(this.model.thePartyTime) out.thePartyTime = new Date(this.model.thePartyTime).getTime(); // 入党时间
        if(this.model.theArcIns.trim()) out.theArcIns = this.model.theArcIns; // 存档机构
        if(this.model.dateOfBirth) out.dateOfBirth = new Date(this.model.dateOfBirth).getTime(); // 生日
        if(this.model.podoProvince !== '') out.podoProvince = this.model.podoProvince; // 户口所在省
        if(this.model.podoCity !== '') out.podoCity = this.model.podoCity; // 户口所在城市
        if(this.model.podoAddress.trim()) out.podoAddress = this.model.podoAddress; // 户口详细地址
        if(this.model.typeOfDemicile !== '') out.typeOfDemicile = this.model.typeOfDemicile; // 户口性质
        if(this.model.houregPhoUrl) out.houregPhoUrl = this.model.houregPhoUrl; // 户口本首页
        if(this.model.houregPerphoUrl) out.houregPerphoUrl = this.model.houregPerphoUrl; // 户口本本人页
        if(this.model.houregPerrevphoUrl) out.houregPerrevphoUrl = this.model.houregPerrevphoUrl; // 户口本本人页背面
        out.hasResper = this.model.hasResper; // boolean 是否有居中证
        if(this.model.residenceProvince !== '' && this.model.hasResper) out.residenceProvince = this.model.residenceProvince; // 居住证省份
        if(this.model.residenceCity !== '' && this.model.hasResper) out.residenceCity = this.model.residenceCity; // 居住证城市
        if(this.model.resperst && this.model.hasResper) out.resperst = new Date(this.model.resperst).getTime(); // 居住证开始
        if(this.model.resperet && this.model.hasResper) out.resperet = new Date(this.model.resperet).getTime(); // 居住证结束
        if(this.model.poreProvince !== '') out.poreProvince = this.model.poreProvince; // 现居住地省
        if(this.model.poreCity !== '') out.poreCity = this.model.poreCity; // 现居住地城市
        if(this.model.poreAddress.trim()) out.poreAddress = this.model.poreAddress; // 现居住地详细地址
        if(this.model.personalEmail.trim()) out.personalEmail = this.model.personalEmail; // 个人邮箱
        let contacts = ((contacts) => {
          var out = [];
          contacts.forEach(v => {
            let o = {};
            if(typeof v.emergContact === 'string' && v.emergContact.trim()) o.emergContact = v.emergContact;
            if(typeof v.emergContact === 'string' && v.emergContactPhone.trim()) o.emergContactPhone = v.emergContactPhone;
            if(this.model.uid) {
              if(v.uid) o.uid = v.uid;
              if(v.staffUid) o.staffUid = v.staffUid;
            }
            if(Object.keys(o).length) {
              out.push(o);
            }
          });
          return out;
        })(this.model.contacts);
        if(contacts.length) out.contacts = contacts;
        out.hasChild = this.model.hasChild // boolean 是否有子女
        let childs = ((childs, hasChild) => {
          var out = [];
          if(!hasChild) {
            return out;
          }
          childs.forEach(v => {
            let o = {};
            if(v.name.trim()) o.name = v.name;
            if(v.gender !== '') o.gender = v.gender;
            if(v.dateOfBirth) o.dateOfBirth = new Date(v.dateOfBirth).getTime();
            if(v.birthCertifUrl) o.birthCertifUrl = v.birthCertifUrl;
            if(this.model.uid) {
              if(v.uid) o.uid = v.uid;
              if(v.staffUid) o.staffUid = v.staffUid;
            }
            if(Object.keys(o).length) {
              out.push(o);
            }
          });
          return out;
        })(this.model.childs, this.model.hasChild);
        if(childs.length) out.childs = childs;
        if(this.model.finallyEmpCom.trim()) out.finallyEmpCom = this.model.finallyEmpCom; // 上一家受聘公司
        if(this.model.maxinumDeucaLevel !== '') out.maxinumDeucaLevel = this.model.maxinumDeucaLevel; // 最高学历
        if(this.model.diplomaType !== '') out.diplomaType = this.model.diplomaType; // 学历类型
        if(this.model.graduateInst.trim()) out.graduateInst = this.model.graduateInst; // 毕业院校
        if(this.model.entSchst) out.entSchst = new Date(this.model.entSchst).getTime(); // 入学时间
        if(this.model.entSchet) out.entSchet = new Date(this.model.entSchet).getTime(); // 毕业时间
        if(this.model.major.trim()) out.major = this.model.major; // 专业
        if(this.model.diplomaUrl) out.diplomaUrl = this.model.diplomaUrl; // 学位证书
        if(this.model.greducaCertUrl) out.greducaCertUrl = this.model.greducaCertUrl; // 毕业证书
        if(this.model.technicalTitle.trim()) out.technicalTitle = this.model.technicalTitle; // 职称
        if(this.model.resumeUrl) out.resumeUrl = this.model.resumeUrl; // 简历
        out.hasComres = this.model.hasComres; // boolean 有无竞业协议
        if(this.model.hasComresRmk.trim() && this.model.hasComres) out.hasComresRmk = this.model.hasComresRmk; // 竞业协议备注信息
        if(this.model.emplsepacertUrl) out.emplsepacertUrl = this.model.emplsepacertUrl; // 离职证明

        if(this.model.record.dateOfEntry) record.dateOfEntry = new Date(this.model.record.dateOfEntry).getTime(); // 入职日期
        if(this.model.record.probation !== '') record.probation = this.model.record.probation; // 试用期
        if(this.model.record.companyAge) record.companyAge = this.model.record.companyAge; // 司龄
        if(this.model.record.position.trim()) record.position = this.model.record.position; // 职位
        if(this.model.record.jobGrade.trim()) record.jobGrade = this.model.record.jobGrade; // 职级
        if(this.model.record.deptUid !== '') record.deptUid = this.model.record.deptUid; // 所在部门
        if(this.model.record.fristWorkTime) record.fristWorkTime = new Date
        (this.model.record.fristWorkTime).getTime(); // 首次参加工作时间
        if(this.model.record.workAge) record.workAge = this.model.record.workAge; // 工龄
        if(this.model.record.workEmail.trim()) record.workEmail = this.model.record.workEmail;
        if(this.model.record.jobNumber.trim()) record.jobNumber = this.model.record.jobNumber; // 工号
        if(this.model.record.reporterJobNumber !== '') record.reporterJobNumber = this.model.record.reporterJobNumber; // 汇报人工号
        if(this.model.record.workProvince !== '') record.workProvince = this.model.record.workProvince;
        if(this.model.record.workCity !== '') record.workCity = this.model.record.workCity;
        if(this.model.record.workAddress.trim()) record.workAddress = this.model.record.workAddress;

        let contract = ((v) => {
          var o = {};
          if(v.contracType !== '') o.contracType = v.contracType;
          if(v.contracType === '0') {
            if(v.startTime) o.startTime = new Date(v.startTime).getTime();
            if(v.contractPeriod !== '') o.contractPeriod = v.contractPeriod;
            if(this.formalEndTime) o.endTime = Number(moment(this.formalEndTime).format('x'));
            if(v.contractUrl) o.contractUrl = v.contractUrl;
            if(v.recruitmentChannel !== '') o.recruitmentChannel = v.recruitmentChannel;
            if(this.model.record.baseSalary.trim()) record.baseSalary = this.model.record.baseSalary; // 基础薪资
            if(this.model.record.trialSalary.trim()) record.trialSalary = this.model.record.trialSalary; // 试用薪资
          }else if(v.contracType === '1') {
            if(v.startTime) o.startTime = new Date(v.startTime).getTime();
            if(v.endTime) o.endTime = new Date(v.endTime).getTime();
            if(v.contractUrl) o.contractUrl = v.contractUrl;
          }else if(v.contracType === '2') {
            if(v.contractUrl) o.contractUrl = v.contractUrl;
          }else if(v.contracType === '3') {
            if(v.startTime) o.startTime = new Date(v.startTime).getTime();
            if(v.endTime) o.endTime = new Date(v.endTime).getTime();
            if(v.contractUrl) o.contractUrl = v.contractUrl;
          }

          if(this.model.uid) {
            if(v.uid) o.uid = v.uid;
            if(v.recordUid) o.recordUid = v.recordUid
          }

          return o;
        })(this.model.record.contract);
        if(Object.keys(contract).length) record.contract = contract;

        if(this.model.uid) {
          if(this.model.record.uid) record.uid = this.model.record.uid;
          if(this.model.record.companyUid) record.companyUid = this.model.record.companyUid;
          if(this.model.record.staffUid) record.staffUid = this.model.record.staffUid;
        }
        if(Object.keys(record).length) out.record = record;


        if(this.model.shareOption.awardDate) shareOption.awardDate = new Date(this.model.shareOption.awardDate).getTime(); // 授予日期
        if(this.model.shareOption.awardAmount.trim()) shareOption.awardAmount = this.model.shareOption.awardAmount; // 授予总数量
        if(this.model.shareOption.awardRate.trim()) shareOption.awardRate = this.model.shareOption.awardRate; // 授予总比例
        if(this.model.shareOption.awardRound.trim()) shareOption.awardRound = this.model.shareOption.awardRound; // 授予轮次
        if(this.model.shareOption.exercSchedule.trim()) shareOption.exercSchedule = this.model.shareOption.exercSchedule; // 行权期
        if(this.model.shareOption.terminallyCount.trim()) shareOption.terminallyCount = this.model.shareOption.terminallyCount; // 每期数量
        if(this.model.shareOption.terminallyRate.trim()) shareOption.terminallyRate = this.model.shareOption.terminallyRate; // 每期比例
        if(this.model.shareOption.contractUrl) shareOption.contractUrl = this.model.shareOption.contractUrl; // 期权合同

        if(this.model.uid) {
          if(this.model.shareOption.uid) shareOption.uid = this.model.shareOption.uid;
          if(this.model.shareOption.recordUid) shareOption.recordUid = this.model.shareOption.recordUid;
        }
        if(Object.keys(shareOption).length) out.shareOption = shareOption;

        return out;
      };

      let flag = 0;
      this.$refs.personFm.validate(valid => {
        if (valid) {
          this.personFlag = false;
        } else {
          this.personFlag = true;
          flag++;
          return false;
        }
      });

      this.$refs.postFm.validate(valid => {
        if (valid) {
          this.postFlag = false;
        } else {
          this.postFlag = true;
          flag++;
          return false;
        }
      });

      this.$refs.optionFm.validate(valid => {
        if (valid) {
          this.optionFlag = false;
        } else {
          this.optionFlag = true;
          return false;
        }
      });

      if(flag) {
        return;
      }


      console.log(makePost());
      let staffApi = '/api/v1.0/client/updateStaff';

      // return;
      this.$http.post(staffApi, makePost())
        .then(res => {
          res = res.body;
          if(res.code === 200) {
//            this.$message.success({message: '保存并更新成功！', showClose: true});
            this.$router.push({path:'/signCard'});

            // this.reset();
            // this.selected = '1';
          }
        })
        .catch(err => console.log(err.status, err.statusText));
    },
    reset() {
      this.$refs.personFm.resetFields();
      this.$refs.postFm.resetFields();
      this.$refs.optionFm.resetFields();

      this.model.childs = [
        {
          name: '',
          gender: '',
          dateOfBirth: '',
          birthCertifUrl: '',
          key: Date.now(),
          err: false
        }
      ];
      this.model.hasChild = false;

      this.model.record.companyAge = '';
      this.model.record.workAge = '';

      this.personFlag = false;
      this.postFlag = false;
      this.optionFlag = false;

      this.model.idcardPhoUrl = '';
      this.idcardPhoUrlErrFlag = false;

      this.model.idcardPhoUrlRev = '';
      this.idcardPhoUrlRevErrFlag = false;

      this.model.passportUrl = '';
      this.passportUrlErrFlag = false;

      this.model.staffPhoUrl = '';
      this.staffPhoUrlErrFlag = false;

      this.model.houregPhoUrl = '';
      this.houregPhoUrlErrFlag = false;

      this.model.houregPerphoUrl = '';
      this.houregPerphoUrlErrFlag = false;

      this.model.houregPerrevphoUrl = '';
      this.houregPerrevphoUrlErrFlag = false;

      this.model.diplomaUrl = '';
      this.diplomaUrlErrFlag = false;

      this.model.greducaCertUrl = '';
      this.greducaCertUrlErrFlag = false;

      this.model.resumeUrl = '';
      this.resumeUrlErrFlag = false;

      this.model.emplsepacertUrl = '';
      this.emplsepacertUrlErrFlag = false;

      this.model.record.contract.contractUrl = '';
      this.recordContractUrlErrFlag = false;

      this.model.shareOption.contractUrl = '';
      this.contractUrlErrFlag = false;

    },
    queryConf() {
      this.$http.get('/api/v1.0/client/configuration')
      .then(res => {
        res = res.body;
        if(res.code === 200) {
          this.confList = res.result;
          let d = {};
          res.result.forEach(item => {
              d[item.remark] = item.jname;
            switch(item.tname) {
              case 'STAFF':
                if(item.isconfig && item.isvisible) {
                  this.staff[item.jname] = item;
                }
              break;
              case 'STAFF_RECORD':
                if(item.isconfig && item.isvisible) {
                  this.staffRecord[item.jname] = item;
                }
              break;
              case 'STAFF_SHARE_OPTION':
                if(item.isconfig && item.isvisible) {
                  this.staffShareOption[item.jname] = item;
                }
              break;
            }
          });

          console.log('rr', d, this.staff, this.staffRecord, this.staffShareOption);
        }
        //测试居住证
        this.confList.forEach(item => {
//            console.log(item.remark);
          if(item.remark==='工作居住证信息'){
            console.log('工作居住证信息',item);
          }
          switch(item.tname) {
            case 'STAFF':
              if(item.isconfig) {
                this.staff[item.jname] = 1;
              }
              break;
            case 'STAFF_RECORD':
              if(item.isconfig) {
                this.staffRecord[item.jname] = 1;
              }
              break;
          }


        });

        //测试居住证


      })
      .catch(err => console.log(err.status, err.statusText));

    },
    queryEmp() {

      let makeEmp = emp => {

        let numProcess = v => typeof v === 'number' ? v : '';
        let dateProcess = v => v ? new Date(v) : '';
        let toNum = v => v ? Number(v) : '';
        let toStr = v => typeof v === 'number' ? v.toString() : '';

        this.model.uid = emp.uid;
        this.model.name = emp.name || '';
        this.model.gender = numProcess(emp.gender);
        this.model.mobile = emp.mobile || '';
        this.model.nativePlace = toStr(emp.nativePlace);
        this.model.passportNum = emp.passportNum || '';
        this.model.passportUrl = emp.passportUrl || '';
        this.model.idcard = emp.idcard || '';
        this.model.idcardPhoUrl = emp.idcardPhoUrl || '';
        this.model.idcardPhoUrlRev = emp.idcardPhoUrlRev || '';
        this.model.socsecNum = emp.socsecNum || '';
        this.model.accfuNum = emp.accfuNum || '';
        this.model.bankName = emp.bankName;
        this.model.openingBank = emp.openingBank || '';
        this.model.cardNumber = emp.cardNumber || '';
        this.model.staffPhoUrl = emp.staffPhoUrl || '';
        this.model.englishName = emp.englishName || '';
        this.model.qq = emp.qq || '';
        this.model.wechart = emp.wechart || '';
        this.model.maritalStatus = toStr(emp.maritalStatus);
        this.model.nation = emp.nation;
        this.model.politicsStatus = toStr(emp.politicsStatus);
        this.model.thePartyTime = dateProcess(emp.thePartyTime);
        this.model.theArcIns = emp.theArcIns || ''; // 存档机构
        this.model.dateOfBirth = dateProcess(emp.dateOfBirth); // 生日
        // console.log('tp', this.provinces);
        this.model.podoProvince = emp.podoProvince; // 户口所在省
        this.model.podoCity = emp.podoCity; // 户口所在城市
        this.model.podoAddress = emp.podoAddress || ''; // 户口详细地址
        this.model.typeOfDemicile = toStr(emp.typeOfDemicile); // 户口性质
        this.model.houregPhoUrl = emp.houregPhoUrl || ''; // 户口本首页
        this.model.houregPerphoUrl = emp.houregPerphoUrl || ''; // 户口本本人页
        this.model.houregPerrevphoUrl = emp.houregPerrevphoUrl || ''; // 户口本本人页背面
        this.model.hasResper = emp.hasResper; // 是否有居中证
        this.model.residenceProvince = emp.residenceProvince; // 居住证省份
        this.model.residenceCity = emp.residenceCity; // 居住证城市
        this.model.resperst = dateProcess(emp.resperst); // 居住证开始
        this.model.resperet = dateProcess(emp.resperet); // 居住证结束
        this.model.poreProvince = emp.poreProvince; // 现居住地省
        this.model.poreCity = emp.poreCity; // 现居住地城市
        this.model.poreAddress = emp.poreAddress || ''; // 现居住地详细地址
        this.model.personalEmail = emp.personalEmail || ''; // 个人邮箱
        this.model.contacts = function(contacts) {
          if(!(contacts && contacts.length)) {
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
        this.model.childs = function(childs) {
          if(!(childs && childs.length)) {
            return [{
              name: '',
              gender: '',
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
        this.model.maxinumDeucaLevel = emp.maxinumDeucaLevel; // 最高学历
        this.model.diplomaType = emp.diplomaType; // 学历类型
        this.model.graduateInst = emp.graduateInst || ''; // 毕业院校
        this.model.entSchst = dateProcess(emp.entSchst) || ''; // 入学时间
        this.model.entSchet = dateProcess(emp.entSchet) || ''; // 毕业时间
        this.model.major = emp.major || ''; // 专业
        this.model.diplomaUrl = emp.diplomaUrl || ''; // 学位证书
        this.model.greducaCertUrl = emp.greducaCertUrl || ''; // 毕业证书
        this.model.technicalTitle = emp.technicalTitle || ''; // 职称
        this.model.resumeUrl = emp.resumeUrl || ''; // 简历
        this.model.hasComres = emp.hasComres; // 有无竞业协议
        this.model.hasComresRmk = emp.hasComresRmk || ''; // 竞业协议备注信息
        this.model.emplsepacertUrl = emp.emplsepacertUrl || ''; // 离职证明

        console.log(emp.record,'emp.record');
        this.model.record.uid = emp.record.uid;
        this.model.record.companyUid = emp.record.companyUid;
        this.model.record.staffUid = emp.record.staffUid;

        this.model.record.dateOfEntry = dateProcess(emp.record.dateOfEntry); // 入职日期
        this.model.record.probation = toStr(emp.record.probation); // 试用期
        this.model.record.companyAge = emp.record.companyAge || ''; // 司龄
        this.model.record.position = emp.record.position || ''; // 职位
        this.model.record.jobGrade = emp.record.jobGrade || ''; // 职级
        this.model.record.deptUid = emp.record.deptUid; // 所在部门
        this.model.record.fristWorkTime = dateProcess(emp.record.fristWorkTime); // 首次参加工作时间
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
        console.log(emp.record,'emp.record.contract.contracType这里面的是空值light');
        this.model.record.contract.contracType = toStr(emp.record.contract.contracType); // 合同类型
        this.model.record.contract.startTime = dateProcess(emp.record.contract.startTime); // 合同生效日期
        this.model.record.contract.contractPeriod = emp.record.contract.contractPeriod || ''; // 合同期限
        this.model.record.contract.endTime = dateProcess(emp.record.contract.endTime); // 合同结束日期
        this.model.record.contract.contractUrl = emp.record.contract.contractUrl || ''; // 合同附件
        this.model.record.contract.recruitmentChannel = toNum(emp.record.contract.recruitmentChannel); // 候选人来源渠道

        this.model.shareOption.uid = this.model.uid;

        this.model.shareOption.uid = emp.shareOption.uid;
        this.model.shareOption.recordUid = emp.shareOption.recordUid;

        this.model.shareOption.awardDate = dateProcess(emp.shareOption.awardDate); // 授予日期
        this.model.shareOption.awardAmount = toStr(emp.shareOption.awardAmount); // 授予总数量
        this.model.shareOption.awardRate = toStr(emp.shareOption.awardRate); // 授予总比例
        this.model.shareOption.awardRound = toStr(emp.shareOption.awardRound); // 授予轮次
        this.model.shareOption.exercSchedule = toStr(emp.shareOption.exercSchedule); // 行权期
        this.model.shareOption.terminallyCount = toStr(emp.shareOption.terminallyCount); // 每期数量
        this.model.shareOption.terminallyRate = toStr(emp.shareOption.terminallyRate); // 每期比例
        this.model.shareOption.contractUrl = emp.shareOption.contractUrl || ''; // 期权合同

        if(this.model.podoProvince) this.queryPodoCities(this.model.podoProvince);
        if(this.model.residenceProvince) this.queryResidenceCities(this.model.residenceProvince);
        if(this.model.poreProvince) this.queryPoreCities(this.model.poreProvince);
        if(this.model.record.workProvince) this.queryWorkCities(this.model.record.workProvince);
      };

      this.$http.post(`/api/v1.0/client/findStaff`)
        .then(res => {
          res = res.body;
          console.log('fs', res.result);
          // return;
          this.emp = res.result;
          if(res.code === 200) makeEmp(res.result);
          // this.invisible = false;
        })
        .catch(err => console.log(err.status, err.statusText));
    },

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
      console.log('publicParams', this.publicParams);
      this.typeOfDemiciles = this.publicParams.typeOfDemicile;
      this.nativePlaces = this.publicParams.nativePlace;
      this.bankNames = this.publicParams.bankName;
      this.maritalStatuses = this.publicParams.maritalStatus;
      this.nations = this.publicParams.nation;
      this.politicsStatuses = this.publicParams.politicsStatus;
      this.maxinumDeucaLevels = this.publicParams.maxinumDeucaLevel;
      this.diplomaTypes = this.publicParams.diplomaType;
      this.probations = this.publicParams.probation;
      this.contractTypes = this.publicParams.contractType;

      this.queryConf();
      this.queryEmp();
    });

    this.queryProvinces();


    this.$http.get('/api/v1.0/client/findReporter').then(response => { //审批人表赋值给汇报上级
//      console.log(response.body.result.NAME ,'审批人列表=汇报上级');

      this.staffRecord.upji=response.body.result.NAME; //查询审批接口报错先注释6-16-15

    }, response => {
      console.log( 'error callback');
    });



  }
}

</script>

<style lang="scss">
  .my-data .mint-tab-container-item {
    padding: 64px 0 73px;
    text-align: left;
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
    line-height: 1;
    margin-top: 0;
    margin-bottom: 0;
    line-height: 1.3;
  }

  .my-data .pos-rel {
    position: relative;
  }

  .my-data .add-child,
  .my-data .add-contact {
    margin-left: 113px;
    margin-bottom: 22px;
    margin-top: 22px;
  }

  .my-data .add-contact {
    margin-bottom: 0;
  }

  .my-data .child,
  .my-data .contact {
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-left: 113px;
    padding: 10px 10px 0 10px;
    position: relative;
  }

  .my-data .child .el-input,
  .my-data .contact .el-input {
    width: 86%;
  }

  .my-data .child:nth-of-type(n + 2),
  .my-data .contact:nth-of-type(n + 2) {
    margin-top: 22px;
  }

  .my-data .contacts-wrapper {
    margin-top: -58px;
    margin-bottom: 22px;
  }

  .my-data .remove-child,
  .my-data .remove-contact {
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .my-data .fa-error {
    color: red;
  }

  .my-data .upload-img-wrapper {
    display: inline-block;
    position: relative;
  }

  .my-data .upload-img-wrapper img {
    display: block;
    max-width: 100%;
  }

  .my-data .upload-img-wrapper .fa-times {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    font-size: 1.2em;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 0 0 0 4px;
    cursor: pointer;
  }

  .my-data .child-img {
    display: block;
    max-height: 180px;
  }

  .my-data .el-form-item .fa-times {
    display: none;
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
    padding-top: 0;
  }

  .my-data .el-upload {
    text-align: left;
  }

  .my-data .el-form-item {
    margin-bottom: 11px;
  }

  .my-data .el-form-item:nth-of-type(n + 2) {
    padding-top: 11px;
  }

  .my-data .el-form-item__error {
    position: static;
    margin-top: 4px;
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
  color: rgba(255,255,255,0.5);
}
/*修改tab样式结束*/
</style>
