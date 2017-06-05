<template>
<div>
  

  <mt-navbar fixed v-model="selected" class="dataTitle">
    <mt-tab-item id="1"><span>个人资料</span></mt-tab-item>
    <mt-tab-item id="2"><span>岗位信息</span></mt-tab-item>
  </mt-navbar>

  <!-- tab-container -->
  <mt-tab-container v-model="selected">
    <mt-tab-container-item id="1">
      <mt-field label="姓名" placeholder="请输入姓名" v-model="model.name"></mt-field>
      <mt-field label="手机号" placeholder="请输入手机号" v-model="model.mobile"></mt-field>
      <mt-radio
        title="性别"
        v-model="model.gender"
        :options="genders">
      </mt-radio>

      <mt-field label="出生年月" readonly disableClear placeholder="请输入出生年月" v-model="model.dateOfBirth" @click.native="birthDpOpen"></mt-field>

      <mt-field label="身份证号" placeholder="请输入身份证号" v-model="model.idcard"></mt-field>
      
      <mt-field label="户口所在地省份" readonly disableClear placeholder="请选择户口所在地省份" v-model="model.podoProvince" @click.native="podoP"></mt-field>


      <el-form :model="model" ref="personFm">

        <el-form-item label="姓名" prop="name">
          <el-input v-model="model.name"></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="model.mobile"></el-input>
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="model.gender">
            <el-radio v-for="item in genders" :key="item.id" :label="item.id">{{ item.name }}</el-radio>
            <!--<el-radio :label="0">女</el-radio>-->
          </el-radio-group>
        </el-form-item>

        <el-form-item label="出生日期" prop="dateOfBirth">
          <el-date-picker
            v-model="model.dateOfBirth"
            type="date"
            placeholder="选择出生日期"
            :editable="false">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="身份证号" prop="idcard">
          <el-input v-model="model.idcard"></el-input>
        </el-form-item>

        <el-form-item label="户口所在地省份" prop="podoProvince">
          <el-select clearable v-model="model.podoProvince" placeholder="请选择" @change="queryPodoCities">
            <el-option v-for="p in provinces" :key="p.uid" :label="p.name" :value="p.uid"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="户口所在地城市" prop="podoCity">
          <el-select clearable v-model="model.podoCity" placeholder="请选择">
            <el-option
              v-for="c in podoCities"
              :key="c.uid"
              :label="c.name"
              :value="c.uid">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="户口详细地址" prop="podoAddress">
          <el-input v-model="model.podoAddress"></el-input>
        </el-form-item>

        <el-form-item label="户口性质" prop="typeOfDemicile">
          <el-select clearable v-model="model.typeOfDemicile" placeholder="请选择">
            <el-option
              v-for="(v, k) in typeOfDemiciles"
              :key="k"
              :label="v"
              :value="k">
            </el-option>
          </el-select>
        </el-form-item>

        
        <el-form-item v-if="staff.nativePlace" label="国籍" prop="nativePlace">
          <el-select clearable v-model="model.nativePlace" placeholder="请选择">
            <el-option
              v-for="(v, k) in nativePlaces"
              :key="k"
              :label="v"
              :value="k">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="model.nativePlace === '2' && staff.passportNum" label="护照号" prop="passportNum">
          <el-input v-model="model.passportNum"></el-input>
        </el-form-item>

        <el-form-item v-if="model.nativePlace === '2' && staff.passportUrl" label="护照照片">
          <el-upload
            action="/api/v1.0/common/upload"
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

        <el-form-item v-if="staff.idcardPhoUrl" label="身份证正面照片">
          <el-upload
            action="/api/v1.0/common/upload"
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

        <el-form-item v-if="staff.idcardPhoUrl" label="身份证背面照片">
          <el-upload
            action="/api/v1.0/common/upload"
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
          <el-input v-model="model.socsecNum"></el-input>
        </el-form-item>

        <el-form-item v-if="staff.accfuNum" label="公积金号" prop="accfuNum">
          <el-input v-model="model.accfuNum"></el-input>
        </el-form-item>

        <el-form-item v-if="staff.bankName" label="银行名称" prop="bankName">
          <el-select clearable v-model="model.bankName" placeholder="请选择">
            <el-option
              v-for="(v, k) in bankNames"
              :key="k"
              :label="v"
              :value="k">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="staff.bankName" label="开户行" prop="openingBank">
          <el-input v-model="model.openingBank"></el-input>
        </el-form-item>

        <el-form-item v-if="staff.bankName" label="银行卡号" prop="cardNumber">
          <el-input v-model="model.cardNumber"></el-input>
        </el-form-item>

        <el-form-item v-if="staff.staffPhoUrl" label="员工照片">
          <el-upload
            action="/api/v1.0/common/upload"
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
          <el-input v-model="model.englishName"></el-input>
        </el-form-item>

        <el-form-item v-if="staff.qq" label="QQ" prop="qq">
          <el-input v-model="model.qq"></el-input>
        </el-form-item>

        <el-form-item v-if="staff.wechart" label="微信" prop="wechart">
          <el-input v-model="model.wechart"></el-input>
        </el-form-item>

        <el-form-item v-if="staff.maritalStatus" label="婚姻状况" prop="maritalStatus">
          <el-select clearable v-model="model.maritalStatus" placeholder="请选择">
            <el-option
              v-for="(v, k) in maritalStatuses"
              :key="k"
              :label="v"
              :value="k">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="staff.nation" label="民族" prop="nation">
          <el-select clearable v-model="model.nation" placeholder="请选择">
            <el-option
              v-for="(v, k) in nations"
              :key="k"
              :label="v"
              :value="k">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="staff.politicsStatus" label="政治面貌" prop="politicsStatus">
          <el-select clearable v-model="model.politicsStatus" placeholder="请选择">
            <el-option
              v-for="(v, k) in politicsStatuses"
              :key="k"
              :label="v"
              :value="k">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="model.politicsStatus === '3'" label="入党时间" prop="thePartyTime">
          <el-date-picker
            v-model="model.thePartyTime"
            type="month"
            placeholder="选择入党时间"
            :editable="false">
          </el-date-picker>
        </el-form-item>

        <el-form-item v-if="staff.theArcIns" label="存档机构" prop="theArcIns">
          <el-input v-model="model.theArcIns"></el-input>
        </el-form-item>

        <el-form-item v-if="staff.houregPhoUrl" label="户口本首页">
          <el-upload
            action="/api/v1.0/common/upload"
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

        <el-form-item v-if="staff.houregPhoUrl" label="户口本本人页">
          <el-upload
            action="/api/v1.0/common/upload"
            :show-file-list="false"
            :headers="tokenHeader"
            :on-success="houregPerphoUrlOk"
            :before-upload="beforeHouregPerphoUrl">
            <i class="el-icon-plus"></i> 户口本本人页
          </el-upload>
          <div v-if="model.houregPerphoUrl" class="upload-img-wrapper">
            <i class="fa fa-times" @click.stop="model.houregPerphoUrl = ''" aria-hidden="true"></i>
            <img :src="model.houregPerphoUrl" />
          </div>
          <p class="uploadErrorTip" v-show="houregPerphoUrlErrFlag">请上传正确的户口本本人页照片(格式为 jpg 或 jpeg 或 png，照片体积小于 2 兆)</p>
        </el-form-item>

        <el-form-item v-if="staff.houregPhoUrl" label="户口本本人页背面">
          <el-upload
            action="/api/v1.0/common/upload"
            :show-file-list="false"
            :headers="tokenHeader"
            :on-success="houregPerrevphoUrlOk"
            :before-upload="beforeHouregPerrevphoUrl">
            <i class="el-icon-plus"></i> 户口本本人页背面
          </el-upload>
          <div v-if="model.houregPerrevphoUrl" class="upload-img-wrapper">
            <i class="fa fa-times" @click.stop="model.houregPerrevphoUrl = ''" aria-hidden="true"></i>
            <img :src="model.houregPerrevphoUrl" />
          </div>
          <p class="uploadErrorTip" v-show="houregPerrevphoUrlErrFlag">请上传正确的户口本本人页背面照片(格式为 jpg 或 jpeg 或 png，照片体积小于 2 兆)</p>
        </el-form-item>

        <el-form-item v-if="staff.ResperMessage" label="居住证">
          <el-switch
            v-model="model.hasResper"
            on-text="有"
            off-text="无">
          </el-switch>
        </el-form-item>

        <el-form-item v-if="model.hasResper" label="居住证所在省份" prop="residenceProvince">
          <el-select clearable v-model="model.residenceProvince" placeholder="请选择" @change="queryResidenceCities">
            <el-option
              v-for="p in provinces"
              :key="p.uid"
              :label="p.name"
              :value="p.uid">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="model.hasResper" label="居住证所在城市" prop="residenceCity">
          <el-select clearable v-model="model.residenceCity" placeholder="请选择">
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
            v-model="model.resperst"
            type="date"
            placeholder="选择日期"
            :editable="false">
          </el-date-picker>
        </el-form-item>

        <el-form-item v-if="model.hasResper" label="居住证截止日期" prop="resperet">
          <el-date-picker
            v-model="model.resperet"
            type="date"
            placeholder="选择日期"
            :editable="false">
          </el-date-picker>
        </el-form-item>

        <el-form-item v-if="staff.poreLocation" label="现居住地所在省份" prop="poreProvince">
          <el-select clearable v-model="model.poreProvince" placeholder="请选择" @change="queryPoreCities">
            <el-option
              v-for="p in provinces"
              :key="p.uid"
              :label="p.name"
              :value="p.uid">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="staff.poreLocation" label="现居住地所在城市" prop="poreCity">
          <el-select clearable v-model="model.poreCity" placeholder="请选择">
            <el-option
              v-for="c in poreCities"
              :key="c.uid"
              :label="c.name"
              :value="c.uid">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="staff.poreLocation" label="现居住地详细地址" prop="poreAddress">
          <el-input v-model="model.poreAddress"></el-input>
        </el-form-item>

        <el-form-item v-if="staff.personalEmail" label="个人邮箱" prop="personalEmail">
          <el-input v-model="model.personalEmail"></el-input>
        </el-form-item>
        
        <!-- DO NOT DEL -->
        <el-form-item label="紧急联系人">
        </el-form-item>
        <div class="contacts-wrapper">
          <div class="contact" :span="24" v-for="(item, idx) in model.contacts">
            <el-form-item label="姓名" label-width="3.5em" :prop="'contacts[' + idx + '].emergContact'" :rules="{min: 2, max: 32, message: '请输入紧急联系人姓名(最少 2 个字符，最多 32 个字符)', trigger: 'change', transform: value => typeof value === 'string' ? value.trim() : ''}">
              <el-input v-model="item.emergContact"></el-input>
            </el-form-item>
            <el-form-item label="电话" label-width="3.5em" :prop="'contacts[' + idx + '].emergContactPhone'" :rules="{message: '请输入紧急联系人电话', trigger: 'change', transform: value => typeof value === 'string' ? value.trim() : '', pattern: /^1\d{10}$/}">
              <el-input v-model="item.emergContactPhone"></el-input>
            </el-form-item>
            <el-button v-if="idx > 0" class="remove-contact" type="danger" @click="rmvContact(item)"><i class="el-icon-delete"></i></el-button>
          </div>
          <el-button v-if="model.contacts.length < 3" class="add-contact" type="primary" @click="addContact">添加紧急联系人</el-button>
        </div>

        <el-form-item v-if="staff.childMessage" label="是否有子女">
          <el-switch
            v-model="model.hasChild"
            on-text="有"
            off-text="无">
          </el-switch>
        </el-form-item>

        <div v-if="staff.childMessage && model.hasChild">
          <div class="child" v-for="(item, idx) in model.childs">
            <el-form-item label="子女姓名" label-width="8em" :prop="'childs[' + idx + '].name'" :rules="{min: 2, max: 32, message: '请输入子女姓名(最少 2 个字符，最多 32 个字符)', trigger: 'change', transform: value => typeof value === 'string' ? value.trim() : ''}">
              <el-input v-model="item.name"></el-input>
            </el-form-item>
            <el-form-item label="子女性别" label-width="8em" :prop="'childs[' + idx + '].gender'" :rules="{type: 'number', message: '请选择子女性别', trigger: 'change', validator: (rule, value, callback) => {callback()}}">
              <el-radio-group v-model="item.gender">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="0">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="子女出生日期" label-width="8em" :prop="'childs[' + idx + '].dateOfBirth'" :rules="{type: 'date', message: '请选择子女出生日期', trigger: 'change', validator: (rule, value, callback) => {callback()}}">
              <el-date-picker
                v-model="item.dateOfBirth"
                type="date"
                placeholder="选择出生日期"
                :editable="false">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="子女出生证明" label-width="8em">
              <el-upload
                action="/api/v1.0/common/upload"
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
          <el-input v-model="model.finallyEmpCom"></el-input>
        </el-form-item>

        <el-form-item v-if="staff.eduInfor" label="最高学历" prop="maxinumDeucaLevel">
          <el-select clearable v-model="model.maxinumDeucaLevel" placeholder="请选择">
            <el-option
              v-for="(v, k) in maxinumDeucaLevels"
              :key="k"
              :label="v"
              :value="k">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="staff.eduInfor" label="学历类型" prop="diplomaType">
          <el-select clearable v-model="model.diplomaType" placeholder="请选择">
            <el-option
              v-for="(v, k) in diplomaTypes"
              :key="k"
              :label="v"
              :value="k">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="staff.eduInfor" label="毕业院校" prop="graduateInst">
          <el-input v-model="model.graduateInst"></el-input>
        </el-form-item>

        <el-form-item v-if="staff.eduInfor" label="入学日期" prop="entSchst">
          <el-date-picker
            v-model="model.entSchst"
            type="month"
            placeholder="选择日期"
            :editable="false">
          </el-date-picker>
        </el-form-item>

        <el-form-item v-if="staff.eduInfor" label="毕业日期" prop="entSchet">
          <el-date-picker
            v-model="model.entSchet"
            type="month"
            placeholder="选择日期"
            :editable="false">
          </el-date-picker>
        </el-form-item>

        <el-form-item v-if="staff.eduInfor" label="专业" prop="major">
          <el-input v-model="model.major"></el-input>
        </el-form-item>

        <el-form-item v-if="staff.eduInfor" label="学位证书">
          <el-upload
            action="/api/v1.0/common/upload"
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
            action="/api/v1.0/common/upload"
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
          <el-input v-model="model.technicalTitle"></el-input>
        </el-form-item>

        <el-form-item v-if="staff.resumeUrl" label="简历">
          <el-upload
            action="/api/v1.0/common/upload"
            :show-file-list="false"
            :headers="tokenHeader"
            :on-success="resumeUrlOk"
            :before-upload="beforeResumeUrl">
            <i class="el-icon-plus"> 上传简历</i>
          </el-upload>
          <p v-if="model.resumeUrl" class="el-icon-check"> 上传成功 <i class="fa fa-times" @click.stop="model.resumeUrl = ''"></i><a :href="model.resumeUrl + `&token=${tokenHeader.token}`">下载</a></p>
          <p class="uploadErrorTip" v-show="resumeUrlErrFlag">请上传正确的简历(格式为 doc 或 docx 或 pdf，照片体积小于 2 兆)</p>
        </el-form-item>

        <el-form-item v-if="staff.hasComres" label="是否有竞业协议">
          <el-form-item>
            <el-switch
              v-model="model.hasComres"
              on-text="有"
              off-text="无">
            </el-switch>
          </el-form-item>
          <el-form-item v-if="model.hasComres" prop="hasComresRmk">
            <el-input v-model="model.hasComresRmk" placeholder="备注信息"></el-input>
          </el-form-item>
        </el-form-item>

        <el-form-item v-if="staff.emplsepacertUrl" label="离职证明">
          <el-upload
            action="/api/v1.0/common/upload"
            :show-file-list="false"
            :headers="tokenHeader"
            :on-success="emplsepacertUrlOk"
            :before-upload="beforeEmplsepacertUrl">
            <i class="el-icon-plus"> 上传离职证明</i>
          </el-upload>
          <p v-if="model.emplsepacertUrl" class="el-icon-check"> 上传成功 <i class="fa fa-times" @click.stop="model.emplsepacertUrl = ''"></i><a :href="model.emplsepacertUrl + `&token=${tokenHeader.token}`">下载</a></p>
          <p class="uploadErrorTip" v-show="emplsepacertUrlErrFlag">请上传正确的离职证明(格式为 doc 或 docx 或 pdf，照片体积小于 2 兆)</p>
        </el-form-item>
      </el-form>

    </mt-tab-container-item>

    <mt-tab-container-item id="2">
      <p>岗位信息</p>
    </mt-tab-container-item>

  </mt-tab-container>

  <div class="save-wrapper">
    <mt-button class="save" type="primary">保存</mt-button>
  </div>
  <mt-datetime-picker
    ref="birthDp"
    v-model="model.dateOfBirth"
    type="date"
    :startDate="new Date()">
  </mt-datetime-picker>
  <mt-popup
    v-model="podoPFlag"
    position="bottom">
    <mt-picker :slots="provinces" @change="provinceCh"></mt-picker>
  </mt-popup>
</div>
</template>
<script>
// import { Navbar, TabItem ,mtTabContainerItem,Toast } from 'mint-ui';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import V from 'vue'

V.use(ElementUI);
import VueCoreImageUpload from 'vue-core-image-upload'

export default {
  data() {
    return {
      selected: '1',
      genders: [
        {
          label: '男',
          value: 1
        },
        {
          label: '女',
          value: 0
        }
      ],
      podoPFlag: false,
      provinces: [
        {
          values: ['2015-01', '2015-02', '2015-03', '2015-04', '2015-05', '2015-06', '2015-02', '2015-03', '2015-04', '2015-05', '2015-06', '2015-02', '2015-03', '2015-04', '2015-05', '2015-06', '2015-02', '2015-03', '2015-04', '2015-05', '2015-06', '2015-02', '2015-03', '2015-04', '2015-05', '2015-06', '2015-02', '2015-03', '2015-04', '2015-05', '2015-06', '2015-02', '2015-03', '2015-04', '2015-05', '2015-06', '2015-02', '2015-03', '2015-04', '2015-05', '2015-06', '2015-02', '2015-03', '2015-04', '2015-05', '2015-06', '2015-02', '2015-03', '2015-04', '2015-05', '2015-06', '2015-02', '2015-03', '2015-04', '2015-05', '2015-06', '2015-02', '2015-03', '2015-04', '2015-05', '2015-06', '2015-02', '2015-03', '2015-04', '2015-05', '2015-06', '2015-02', '2015-03', '2015-04', '2015-05', '2015-06', '2015-02', '2015-03', '2015-04', '2015-05', '2015-06']
        }
      ],

      staff: {},
      staffRecord: {},
      staffShareOption: {},
      a: '',
      b: '',
      model: {
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
        }
      },
    }
  },
  methods: {
    birthDpOpen() {
      this.$refs.birthDp.open();
    },
    podoP() {
      this.podoPFlag = true;
    },
    provinceCh(p, v) {
      console.log(p, v);
      this.a = v[0]
    },
    /*
      changeCity(value){
        console.log(value);
        this.cityParam=value;
      },

      handerDataSubmit(){
        this.submitDivShow=false;
        this.submitDivHide=true;
        console.log(this.myDataSearch)


        //点击后把编辑的信息传过来start
        this.gold=this.myDataSearch.gongjijin;
        this.bankCard=this.myDataSearch.bankcard;
        this.openBank=this.myDataSearch.kaihuhang;
        this.imgSrc.shenFenIcon=this.myDataSearch.shenfengzheng;
        this.imgSrc.shenFenIconbei=this.myDataSearch.shenfengbei;
        this.card=this.myDataSearch.shenfeng;
        this.phone=this.myDataSearch.phone;
        this.cityParam=this.myDataSearch.city;

        this.selectedData = this.myDataSearch.xingbie;
        this.selectedDataCity = this.myDataSearch.city;
        console.log(this.myDataSearch.city, 'this.selectedDataCity');


        switch(this.myDataSearch.xingbie) {
          case '男':
            this.selectedData= 1;
            break;
          case '女':
            this.selectedData = 0;
            break;

          default:
            this.selectedDataCity = '';
            break;
        }

        switch(this.myDataSearch.city) {
          case '大陆地区':
            this.selectedDataCity = 1;
            break;
          case '港澳地区':
            this.selectedDataCity = 2;
            break;
          case '台湾地区':
            this.selectedDataCity = 3;
            break;
          default:
            this.selectedDataCity = '';
            break;
        }

        //点击后把编辑的信息传过来end

        this.imginit=false;
        this.imginit2=false;

      //            this.$http.post('/api/v1.0/client/findStaff').then(response => {
      //              console.log('查询个人资料');
      //              console.log(response);
      //
      //
      //            }, response => {
      //              console.log( 'error callback');
      //            });
      },
      handerDataSubmit2(){
        this.submitDivShow=true;
        this.submitDivHide=false;
        let param={
          'uid':this.uid,
          'gender':this.selectedData,
          'mobile':this.phone,
          'nativePlace': this.selectedDataCity,
          'idcard':this.card,
          'idcardPhoUrl':this.imgSrc.shenFenIcon,
          'idcardPhoUrlRev':this.imgSrc.shenFenIconbei,
          'accfuNum':this.gold,
          'cardNumber':this.bankCard,
          'openingBank':this.openBank,
        }
      this.$http.post('/api/v1.0/client/updateStaff',param).then(response => {
          console.log('修改个人资料');
          if(response.code==200){
            Toast({
              message: '个人资料保存成功',
              iconClass: 'icon icon-success'
            })
          }
        this.initSearch();  //提交后在查询一次


      }, response => {
          console.log( 'error callback');
        });




      },
      handerClickUp(){
        alert(11);
      },

      imageuploaded(res) {
          console.log(res);
        if (res) {
            this.imginit=false;
          this.imgSrc.shenFenIcon = res.result;



          console.log(this.imgSrc.shenFenIcon);
        }

      },
      imageuploadedbei(res) {
        console.log(res);
        if (res) {
          this.imginit2=false;

          this.imgSrc.shenFenIconbei = res.result;
          console.log(this.imgSrc.shenFenIconbei);
        }

      },
      initSearch(){
        this.$http.post('/api/v1.0/client/findStaff').then(response => { //查询

          //岗位信息查询赋值开始
          this.stationObj=response.body.result.record;
          var firstWork=new Date(parseInt(this.stationObj.fristWork)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
          var zhuanWork=new Date(parseInt(this.stationObj.fristWorkTime)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");

          this.stationObj.firstWork=firstWork;
          this.stationObj.zhuanWork=zhuanWork;
          console.log(response);

          //岗位信息查询赋值结束

          //个人资料查询赋值开始
          this.myDataSearch.phone =response.body.result.mobile; //手机号
          this.myDataSearch.city=response.body.result.nativePlace; //国家
          this.myDataSearch.shenfeng=response.body.result.idcard; //身份证
          this.myDataSearch.shenfengzheng=response.body.result.idcardPhoUrl; //正身份证照片
          this.myDataSearch.shenfengbei=response.body.result.idcardPhoUrlRev;//背身份证照片
          this.myDataSearch.gongjijin=response.body.result.accfuNum; //公积金
          this.myDataSearch.bankcard=response.body.result.cardNumber; //银行卡号
          this.myDataSearch.kaihuhang=response.body.result.openingBank; //开户行

          console.log(response.body.result.nativePlace, 'response.body.result.nativePlace');
          switch(response.body.result.nativePlace) {
            case 1:
              this.myDataSearch.city = '大陆地区';
                break;
            case 2:
              this.myDataSearch.city = '港澳地区';
              break;
            case 3:
              this.myDataSearch.city = '台湾地区';
              break;
            default:
              this.myDataSearch.city = '';
                break;
          }

          switch(response.body.result.gender) {
            case 1:
              this.myDataSearch.xingbie='男';
              break;
            case 0:
              this.myDataSearch.xingbie='女';
              break;
            default:
              this.myDataSearch.city = '';
              break;
          }


          this.uid=response.body.result.uid;
          //个人资料查询赋值结束
        }, response => {
          console.log( 'error callback');
        });
        console.log('ddd'+this.imgSrc.shenFenIcon);
      }
    */
  },
  mounted: function () {
    this.$http.get('/api/v1.0/client/configuration')
      .then(res => {
        res = res.body;
        if(res.code === 200) {
          res.result.forEach(item => {
            switch(item.tname) {
              case 'STAFF':
                if('debug' || (item.isconfig && item.isvisible)) {
                  this.staff[item.jname] = item;
                }
              break;
              case 'STAFF_RECORD':
                if('debug' || (item.isconfig && item.isvisible)) {
                  this.staffRecord[item.jname] = item;
                }
              break;
              case 'STAFF_SHARE_OPTION':
                if('debug' || (item.isconfig && item.isvisible)) {
                  this.staffShareOption[item.jname] = item;
                }
              break;
            }
          });
        }
        console.log('rr', this.staff, this.staffRecord, this.staffShareOption);
      })
      .catch(err => console.log(err.status, err.statusText));
  },
  components: {
    'vue-core-image-upload': VueCoreImageUpload,
  }
}

</script>

<style scoped lang="scss">
.mint-tab-container-item {
  padding: 48px 0 73px;
  text-align: left;
}
.save-wrapper {
  display: block;
  width: 100%;
  padding: 16px;
  overflow: visible;
  position: fixed;
  left: 0;
  bottom: 0;
  box-sizing: border-box;
  background-color: rgba(255, 255, 255, 1);
  // box-shadow: 0px 3px 9px 0px black;
  .save {
    display: block;
    width: 100%;
  }
}
// .is-selected {
//   border-bottom: 3px solid #26a2ff;
//   color: #26a2ff;
//   margin-bottom: -3px;
// }
// .hrClass{
//   width: 96%;
//   margin:0 0.8rem;
//   height: 1px;
//   background: #cccccc;
//   line-height: 1px
// }
// .contentClass{
//   display: flex;
//   padding: 1rem;
// }
// .contentLeft{
//   flex:1.2;
//   text-align: left;
// }
// .contentRight{
//   flex:2.8;
//   text-align: left;
// }
// .dataTitle span{
//   font-size: 1.4rem;
// }
// .changeSelect{
//   width: 12rem;
//   display: block;
//   height: 2.5rem;
//   border: none;
//   font-size: 1.22rem;
// }
// .cardClass{
//   width: 11rem;
//   height: 6rem;
//   line-height: 6rem;
//   float: left;
//   position: relative;
// }
// .cardClassSearch{
//   width: 11rem;
//   height: 6rem;
//   line-height: 6rem;
//   float: left;
//   position: relative;
// }
// .cardClass div{
//   width: 9rem;
//   position: absolute;
//   font-size: 1.1rem;
//   height: 6.2rem;
//   line-height: 6.2rem;
// }
// .CardImg{
//   display: block;
//   width: 80%;
//   height: 90%;
//   padding-left: 0.6rem;

// }
// .CardImgSearch{
//   display: block;
//   width: 94%;
//   height: 90%;
//   padding-left: 0.6rem;
//   padding-top: 0.2rem;
// }
// .showARightSpan{
//   width: 15rem;
//   height:2rem;
//   line-height: 2rem;
//   text-align: left;
// }
// .imgclassShen{
//   position: absolute;
//   top:3rem;
// }
</style>
