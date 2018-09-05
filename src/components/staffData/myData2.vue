<template>

<div class="employees-func plr30">
  <el-card v-if="model.mails && model.bodies" class="box-card">
    <div slot="header" class="clearfix tab-wrapper">
      <!--<div class="tabs clearfix">-->
        <!--<a-->
          <!--data-level="1"-->
          <!--v-for="item in model.bodies"-->
          <!--:key="item.uid"-->
          <!--class="tab pull-left"-->
          <!--href="javascript:;"-->
          <!--:class="{on: actTab === item.uid}"-->
          <!--@click="switchTab(item.uid)">-->
          <!--{{item.fieldName === item.fieldDescr ? item.fieldName : (item.fieldName + item.fieldDescr)}}-->
        <!--</a>-->
      <!--</div>-->
      <mt-navbar fixed v-model="selected" class="dataTitle">
        <mt-tab-item v-for="item in model.bodies"
                     :key="item.uid" :id="item.uid">
          <span>{{item.fieldName === item.fieldDescr ? item.fieldName : (item.fieldName + item.fieldDescr)}}</span>
        </mt-tab-item>
        <!--<mt-tab-item v-if="!isLowEntry" id="2">-->
        <!--<span>岗位信息</span>-->
        <!--</mt-tab-item>-->
      </mt-navbar>
    </div>

    <el-form ref="fm" :model="model" label-suffix="：" :label-width="labelWidth">
      <div
        data-level="1"
        class="employees-func-body"
        v-for="(body, bodyIdx) in model.bodies"
        :key="body.uid"
        v-show="body.uid === actTab">
        <div
          data-level="2"
          class="part"
          v-for="(part, partIdx) in body.children"
          :key="part.uid">
          <el-row class="header-bar">
            <el-col :span="12">{{part.fieldName === part.fieldDescr ? part.fieldName : (part.fieldName + part.fieldDescr)}}</el-col>
            <el-col :span="12" class="opt">
              <a href="javascript:;" @click="toggleFold(part.uid)">
                <i :class="{'el-icon-arrow-up': !fold[part.uid], 'el-icon-arrow-down': fold[part.uid]}"></i>
                {{
                  !fold[part.uid] ? '收起' : '展开'
                }}
              </a>
              <a class="add" v-if="part.isGroup" href="javascript:;" @click="addGroup(part.uid, bodyIdx, partIdx, part._children.length)"><i class="el-icon-circle-plus"></i> {{`添加${part.fieldName}`}}</a>
            </el-col>
          </el-row>


          <div class="fieldset-wrapper" v-if="!fold[part.uid]">

            <div
              class="field-group"
              v-for="(group, groupIdx) in part._children"
              :key="group">

              <div class="group-hd clearfix" v-if="part.isGroup">
                <span class="pull-left">第 {{groupIdx + 1}} 段{{part.fieldName}}</span>
                <a
                  class="pull-right add"
                  href="javascript:;"
                  @click="addGroup(part.uid, bodyIdx, partIdx, groupIdx + 1)">
                  <i class="el-icon-circle-plus-outline"></i> 添加
                </a>
                <a
                  v-if="part._children.length > 1"
                  class="pull-right"
                  href="javascript:;"
                  style="color: #F56C6C;"
                  @click="removeGroup(bodyIdx, partIdx, groupIdx)">
                  <i class="el-icon-circle-close-outline"></i> 删除
                </a>
              </div>

              <template v-for="(field, fieldIdx) in group">

                <el-form-item
                  v-if="field._configs.fieldType === '9'"
                  class="text-form-item"
                  :key="field.uid"
                  :label="field.fieldName"
                  :prop="`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`"
                  :rules="[{
                    required: field.isDefault || field.isRequired,
                    trigger: 'blur',
                    message: field._configs.fieldHint,
                    validator: makeValidator(field)
                  }]">
                  <el-input
                    v-model.trim="field._configs._staffValues.value"
                    :maxlength="field._configs.fieldSize ? +field._configs.fieldSize : 256">
                  </el-input>
                  <el-tooltip v-if="field.fieldDescr" :content="field.fieldDescr" placement="right">
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                </el-form-item>

                <el-form-item
                  v-if="field._configs.fieldType === '10'"
                  class="text-form-item"
                  :key="field.uid"
                  :label="field.fieldName"
                  :prop="`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`"
                  :rules="[{
                    required: field.isDefault || field.isRequired,
                    trigger: 'blur',
                    message: field._configs.fieldHint,
                    validator: makeValidator(field)
                  }]">
                  <el-input
                    v-model.trim="field._configs._staffValues.value"
                    :maxlength="field._configs.fieldSize ? +field._configs.fieldSize : 256">
                  </el-input>
                  <el-tooltip v-if="field.fieldDescr" :content="field.fieldDescr" placement="right">
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                </el-form-item>

                <el-form-item
                  v-if="field._configs.fieldType === '4' && field.jname !== 'reporterJobNumber'"
                  :key="field.uid"
                  :label="field.fieldName"
                  :prop="`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`"
                  :rules="[{
                    required: field.isDefault || field.isRequired,
                    trigger: 'change',
                    message: field._configs.fieldHint
                  }]">
                  <el-select
                    v-if="!field.isDefined"
                    :disabled="isDisabledByField(field)"
                    filterable
                    clearable
                    v-model="field._configs._staffValues.value"
                    placeholder="请选择"
                    @change="onChange(field)">
                    <el-option
                      v-for="item in confItems[makeKeyOfConfitems(field)]"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                      :class="{[item.idx]: `dept-item-${item.idx}`}">
                    </el-option>
                  </el-select>
                  <el-select
                    v-else
                    filterable
                    clearable
                    v-model="field._configs._staffValues.value"
                    placeholder="请选择">
                    <el-option
                      v-for="item in field._configs.staffFieldValues"
                      :key="item.uid"
                      :label="item.value"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-tooltip v-if="field.fieldDescr" :content="field.fieldDescr" placement="right">
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                </el-form-item>
                <el-form-item
                  v-show="field._configs.fieldType === '4' && field.jname === 'reporterJobNumber' && showed(field)"
                  :key="field.uid"
                  :label="field.fieldName"
                  :prop="`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`"
                  :rules="[{
                    required: field.isDefault || field.isRequired,
                    message: field._configs.fieldHint
                  }]">
                  <job-reporter
                    @validate="empValidateJR(`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`)"
                    class="job-reporter"
                    v-model="field._configs._staffValues.value"
                    ref="jobReporter"
                    :reporterOfStaff="reporterOfStaff" />
                  <el-tooltip v-if="field.fieldDescr" :content="field.fieldDescr" placement="right">
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                </el-form-item>

                <el-form-item
                  v-if="field._configs.fieldType === '1' && showed(field)"
                  class="text-form-item"
                  :key="field.uid"
                  :label="field.fieldName"
                  :prop="`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`"
                  :rules="[{
                    required: field.isDefault || field.isRequired,
                    trigger: 'blur',
                    message: field._configs.fieldHint,
                    validator: makeValidator(field, getFieldsByJname(field._dpd4show))
                  }]"
                  :ref="field.jname">
                  <el-input
                    @keyup.native="isIDCard(field)"
                    :disabled="isDisabledByField(field)"
                    v-model.trim="field._configs._staffValues.value"
                    :maxlength="field._configs.fieldSize ? +field._configs.fieldSize : 256">
                  </el-input>
                  <el-tooltip v-if="field.fieldDescr" :content="field.fieldDescr" placement="right">
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                </el-form-item>

                <el-form-item
                  v-if="field._configs.fieldType === '15'"
                  class="text-form-item"
                  :key="field.uid"
                  :label="field.fieldName"
                  :prop="`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`"
                  :rules="[{
                    required: field.isDefault || field.isRequired,
                    trigger: 'blur',
                    message: field._configs.fieldHint,
                    validator: makeValidator(field)
                  }]"
                  :ref="field.jname">
                  <el-input
                    v-model.trim="field._configs._staffValues.value"
                    :maxlength="field._configs.fieldSize ? +field._configs.fieldSize : 256">
                  </el-input>
                  <el-tooltip v-if="field.fieldDescr" :content="field.fieldDescr" placement="right">
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                </el-form-item>

                <el-form-item
                  v-if="field._configs.fieldType === '5'"
                  :key="field.uid"
                  :label="field.fieldName"
                  :prop="`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`"
                  :rules="[{
                    required: field.isDefault || field.isRequired,
                    trigger: 'change',
                    message: field._configs.fieldHint
                  }]">
                  <el-radio-group
                    v-if="!field.isDefined"
                    v-model="field._configs._staffValues.value"
                    :disabled="isDisabledByField(field)">
                    <el-radio
                      v-for="item in confItems[field._configs.configType]"
                      :key="item.id"
                      :label="item.id">
                      {{item.name}}
                    </el-radio>
                  </el-radio-group>
                  <el-radio-group
                    v-else
                    v-model="field._configs._staffValues.value">
                    <el-radio
                      v-for="item in field._configs.staffFieldValues"
                      :key="item.uid"
                      :label="item.value">
                      {{item.value}}
                    </el-radio>
                  </el-radio-group>
                  <el-tooltip v-if="field.fieldDescr" :content="field.fieldDescr" placement="right">
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                </el-form-item>

                <el-form-item
                  v-if="field._configs.fieldType === '2'"
                  :key="field.uid"
                  :label="field.fieldName"
                  :prop="`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`"
                  :rules="[{
                    required: field.isDefault || field.isRequired,
                    trigger: 'change',
                    message: field._configs.fieldHint
                  }]">
                  <el-date-picker
                    v-model="field._configs._staffValues.value"
                    type="date"
                    placeholder="选择日期"
                    clearable
                    :editable="false"
                    value-format="yyyy-MM-dd"
                    :disabled="isDisabledByField(field)"
                    @change="computeWorkAge(field)">
                  </el-date-picker>
                  <el-tooltip v-if="field.fieldDescr" :content="field.fieldDescr" placement="right">
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                </el-form-item>

                <el-form-item
                  v-if="field._configs.fieldType === '3'"
                  class="text-form-item"
                  :key="field.uid"
                  :label="field.fieldName"
                  :prop="`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`"
                  :rules="[{
                    required: field.isDefault || field.isRequired,
                    trigger: 'blur',
                    message: field._configs.fieldHint,
                    validator: makeValidator(field)
                  }]">
                  <el-input
                    v-if="field.jname === 'workAge'"
                    v-model.trim="field._configs._staffValues.value"
                    :maxlength="field._configs.fieldSize ? +field._configs.fieldSize : 256"
                    :disabled="isDisabledByField(field)">
                    <span slot="append">年</span>
                  </el-input>
                  <el-input
                    v-else-if="field.jname === 'age'"
                    v-model.trim="field._configs._staffValues.value"
                    :maxlength="field._configs.fieldSize ? +field._configs.fieldSize : 256"
                    :disabled="isDisabledByField(field)">
                    <span slot="append">岁</span>
                  </el-input>
                  <el-input
                    v-else-if="field.jname === 'height'"
                    v-model.trim="field._configs._staffValues.value"
                    :maxlength="field._configs.fieldSize ? +field._configs.fieldSize : 256"
                    :disabled="isDisabledByField(field)">
                    <span slot="append">cm(厘米)</span>
                  </el-input>
                  <el-input
                    v-else-if="field.jname === 'weight'"
                    v-model.trim="field._configs._staffValues.value"
                    :maxlength="field._configs.fieldSize ? +field._configs.fieldSize : 256"
                    :disabled="isDisabledByField(field)">
                    <span slot="append">kg(公斤)</span>
                  </el-input>
                  <el-input
                    v-else
                    v-model.trim="field._configs._staffValues.value"
                    :maxlength="field._configs.fieldSize ? +field._configs.fieldSize : 256"
                    :disabled="isDisabledByField(field)">
                  </el-input>
                  <el-tooltip v-if="field.fieldDescr" :content="field.fieldDescr" placement="right">
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                </el-form-item>

                <el-form-item
                  v-if="field._configs.fieldType === '6'"
                  :key="field.uid"
                  :label="field.fieldName"
                  :prop="`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`"
                  :rules="[{
                    required: field.isDefault || field.isRequired,
                    type: 'array',
                    trigger: 'change',
                    message: field._configs.fieldHint
                  }]">
                  <el-checkbox-group v-model="field._configs._staffValues.value">
                    <el-checkbox
                      v-for="item in field._configs.staffFieldValues || []"
                      :key="item.uid"
                      :label="item.value">
                      {{item.value}}
                    </el-checkbox>
                  </el-checkbox-group>
                  <el-tooltip v-if="field.fieldDescr" :content="field.fieldDescr" placement="right">
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                </el-form-item>

                <el-form-item
                  v-if="field._configs.fieldType === '7'"
                  :key="field.uid"
                  :required="field.isDefault || field.isRequired"
                  :label="field.fieldName"
                  x-prop="`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`"
                  x-rules="[{
                    required: field.isDefault || field.isRequired,
                    type: 'array',
                    min: field._configs.fieldMinSize || 1,
                    max: field._configs.fieldSize,
                    message: field._configs.fieldHint,
                    novalidator: makeValidator(field)
                  }]">

                  <el-upload
                    action="/api/v1.0/common/upload"
                    :show-file-list="false"
                    :headers="tokenHeader"
                    :on-success="makeUploadOkCallback(bodyIdx, partIdx, groupIdx, fieldIdx)"
                    :before-upload="makeUploadBeforeImgCallback(bodyIdx, partIdx, groupIdx, fieldIdx, field._configs)">
                    <i v-if="field._configs._staffValues.value.length < field._configs.fieldSize" class="el-icon-plus"> 上传{{field.fieldName}}</i>
                    <el-tooltip v-if="field.fieldDescr" :content="field.fieldDescr" placement="right">
                      <i class="el-icon-info"></i>
                    </el-tooltip>
                  </el-upload>

                  <div class="customize-uploads clearfix">
                    <div class="customize-upload" v-for="(item, idx) in field._configs._staffValues.value" :key="idx">
                      <i class="fa fa-minus-circle rmv" @click="makeRemoveUploadItem(bodyIdx, partIdx, groupIdx, fieldIdx, idx)" />
                      <img :src="item" @click="openTab(item)" />
                    </div>
                  </div>
                  <el-alert v-show="uploadError[field._mark]" type="error" :description="field._configs.fieldHint" show-icon @close="closeUploadErrorByMark(field._mark)" />

                </el-form-item>

                <el-form-item
                  v-if="field._configs.fieldType === '8'"
                  :key="field.uid"
                  :required="field.isDefault || field.isRequired"
                  :label="field.fieldName"
                  x-prop="`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`">

                  <el-upload
                    action="/api/v1.0/common/upload"
                    :show-file-list="false"
                    :headers="tokenHeader"
                    :on-success="makeUploadOkCallback(bodyIdx, partIdx, groupIdx, fieldIdx)"
                    :before-upload="makeUploadBeforeDocCallback(bodyIdx, partIdx, groupIdx, fieldIdx, field._configs)">
                    <i v-if="field._configs._staffValues.value.length < field._configs.fieldSize" class="el-icon-plus"> 上传{{field.fieldName}}</i>
                    <el-tooltip v-if="field.fieldDescr" :content="field.fieldDescr" placement="right">
                      <i class="el-icon-info"></i>
                    </el-tooltip>
                  </el-upload>

                  <div class="customize-uploads clearfix">
                    <div class="customize-upload" v-for="(item, idx) in field._configs._staffValues.value" :key="idx">
                      <i class="fa fa-minus-circle rmv" @click="makeRemoveUploadItem(bodyIdx, partIdx, groupIdx, fieldIdx, idx)" />
                      <a :href="item + `&token=${tokenHeader.token}&mobile=${tokenHeader.mobile}`"><i :class="getExtType(item)" /></a>
                    </div>
                  </div>

                  <el-alert v-show="uploadError[field._mark]" type="error" :description="field._configs.fieldHint" show-icon @close="closeUploadErrorByMark(field._mark)" />

                </el-form-item>

                <el-form-item
                  v-if="field._configs.fieldType === '11'"
                  class="text-form-item"
                  :key="field.uid"
                  :label="field.fieldName"
                  :prop="`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`"
                  :rules="[{
                    required: field.isDefault || field.isRequired,
                    trigger: 'blur',
                    message: field._configs.fieldHint,
                    validator: makeValidator(field)
                  }]">
                  <el-input
                    v-model.trim="field._configs._staffValues.value"
                    :maxlength="field._configs.fieldSize ? +field._configs.fieldSize : 256">
                  </el-input>
                  <el-tooltip v-if="field.fieldDescr" :content="field.fieldDescr" placement="right">
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                </el-form-item>

                <el-form-item
                  v-if="field._configs.fieldType === '12'"
                  class="text-form-item"
                  :key="field.uid"
                  :label="field.fieldName"
                  :prop="`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`"
                  :rules="[{
                    required: field.isDefault || field.isRequired,
                    trigger: 'blur',
                    message: field._configs.fieldHint,
                    validator: makeValidator(field)
                  }]">
                  <el-input
                    v-model.trim="field._configs._staffValues.value"
                    :maxlength="field._configs.fieldSize ? +field._configs.fieldSize : 256">
                  </el-input>
                  <el-tooltip v-if="field.fieldDescr" :content="field.fieldDescr" placement="right">
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                </el-form-item>

                <el-form-item
                  v-if="field._configs.fieldType === '13'"
                  class="text-form-item"
                  :key="field.uid"
                  :label="field.fieldName"
                  :prop="`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`"
                  :rules="[{
                    required: field.isDefault || field.isRequired,
                    trigger: 'blur',
                    message: field._configs.fieldHint,
                    validator: makeValidator(field)
                  }]">
                  <el-input
                    v-model.trim="field._configs._staffValues.value"
                    :maxlength="field._configs.fieldSize ? +field._configs.fieldSize : 256">
                  </el-input>
                  <el-tooltip v-if="field.fieldDescr" :content="field.fieldDescr" placement="right">
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                </el-form-item>

                <el-form-item
                  v-if="field._configs.fieldType === '14'"
                  class="text-form-item"
                  :key="field.uid"
                  :label="field.fieldName"
                  :prop="`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`"
                  :rules="[{
                    required: field.isDefault || field.isRequired,
                    trigger: 'blur',
                    message: field._configs.fieldHint,
                    validator: makeValidator(field)
                  }]">
                  <el-input
                    :disabled="isDisabledByField(field)"
                    v-model.trim="field._configs._staffValues.value"
                    :maxlength="field._configs.fieldSize ? +field._configs.fieldSize : 256">
                    <span slot="append">元/月</span>
                  </el-input>
                  <el-tooltip v-if="field.fieldDescr" :content="field.fieldDescr" placement="right">
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                </el-form-item>

              </template>

              <template v-if="
                bodyIdx === 1
                && partIdx === 0
                && groupIdx === 0
                && isEmail('isEmail', '0')
                ">
                <el-form-item
                  v-for="(item, i) in model.mails"
                  :key="i"
                  v-if="true && 'something dpdwork'"
                  :label="`第${i + 1}级审批邮箱`"
                  :prop="`mails.${i}.mail`"
                  :rules="[{
                    required: true,
                    pattern: /^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-z0-9]{2,5}$/,
                    message: '请输入正确的审批邮箱',
                    trigger: 'blur'
                  }]"
                  class="text-form-item">
                  <el-input class="mail-input" :maxlength="64" v-model.trim="item.mail"></el-input>
                  <el-button v-if="model.mails.length > 1" class="mail-x" type="danger" icon="el-icon-remove-outline" @click="removeAPEmail(i)" />
                </el-form-item>

                <el-form-item v-if="true">
                  <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addAPEmail">添加审批邮箱</el-button>
                </el-form-item>
              </template>


            </div>

          </div>
        </div>
      </div>
    </el-form>
  </el-card>

  <!-- <pre>{{model}}</pre> -->
  <!-- <pre>{{uploadError}}</pre> -->
  <!-- <pre>{{confItems}}</pre> -->
  <!-- <pre>{{fold}}</pre> -->


</div>

</template>
<script>
  import moment from 'moment'
  import V from 'vue'
  import _ from 'lodash'
  import ElementUI from 'element-ui'
  import "element-ui/lib/theme-default/index.css";
  import utils from '../common/utils'
    import jobReporter from '../common/emp-one'
  import {MessageBox, Indicator} from "mint-ui";
  V.use(ElementUI);

// import tr from './test'

const computeMaxValueTerm = function computeMaxValueTerm(item, children) {
  const computeFieldMaxTerm = function computeFieldMaxTerm(values) {
    let term = 0;
    values.forEach(item => {
      if(+item.term > term) {
        term = +item.term;
      }
    });
    return term;
  }

  let maxFieldTerm = 0;
  if(item.isGroup) {
    children.forEach(child => {
      let fieldTerm = computeFieldMaxTerm(child.configs[0].staffValues)
      if(fieldTerm > maxFieldTerm) {
        maxFieldTerm = fieldTerm;
      }
    })
  }
  return maxFieldTerm;
}

const group4add = {};


const grub = utils.grub;
const modifyNode = utils.modifyNode;
const makeUploadOkCallback = utils.makeUploadOkCallback;
const makeUploadBeforeImgCallback = utils.makeUploadBeforeImgCallback;
const makeUploadBeforeDocCallback = utils.makeUploadBeforeDocCallback;
const makeRemoveUploadItem = utils.makeRemoveUploadItem;
const makeValidator = utils.makeValidator;
const getExtType = utils.getExtType;
const idNumberPattern = utils.idNumberPattern;

export default {
//  name: 'employee cu',
//  props: ['staffUid'], // staffRecordUid
  data() {
    return {
      selected:'',
      labelWidth: '12em',
      uid: null,
      staffRecordUid: null,
      model: {
        bodies: null,
        mails: null
      },
      confItems: {},
      uploadError: {},
      reporterOfStaff: null,

      tokenHeader: {
        token: sessionStorage.getItem('token'),
        mobile: sessionStorage.getItem('mobile')
      },
//      perm: {},

      actTab: '',
      fold: null,

      loading: null
    }
  },
  methods: {
    empValidateJR(prop) {
      this.$refs.fm.validateField(prop);
    },
    makeKeyOfConfitems(field) {
      let out = null;
      if(field.jname === 'deptUid') {
        return '_depts'
      }else {
        return field._configs.configType === 'city'
                ? `${field.jname}_${field._mark}`
                : field._configs.configType
      }
    },
    updateWholeModel(states, groupIdx) {
      /*
        state: [
          {
            jname: '',
            value: ''
          }
        ]
      */
      let tmpmodel = this.model;
      tmpmodel.bodies.forEach(body => {
        body.children.forEach(part => {
          part._children.forEach(one_group => {
            one_group.forEach(field => {

              states.forEach(state => {
                if(
                  field.jname === state.jname
                  && groupIdx === this.getSliceOfMark(field, 2)
                ) {
                  field._configs._staffValues.value = state.value;
                }
              });

            });
          });
        });
      });
      this.model = tmpmodel;
    },
    empage(val) {
      let id = val
      let age = ''
      let birth = `${id.substring(6, 10)}-${id.substring(10, 12)}-${id.substring(12, 14)}`
      let delta = new Date().getTime() - (+moment(birth).format('x'))
      age = moment.duration(delta).years() || ''
      return age.toString();
    },
    empdateOfBirth(val) {
      let id = val
      let birth = ''
      let modelBirth = '';
      birth = `${id.substring(6, 10)}-${id.substring(10, 12)}-${id.substring(12, 14)}`
      modelBirth = moment(birth).format('YYYY-MM-DD')
      return modelBirth
    },
    empgender(val) {
      let id = val;
      let sex = ''

      sex = (+id.toString().trim()[16]) % 2 === 0 ? '女' : '男'
      if(sex === '男') return '1'
      else return '0'
    },
    getFieldsByJname(jname) {
      let out = [];
      if(!jname) {
        return out;
      }
      this.model.bodies.forEach(body => {
        body.children.forEach(part => {
          part._children.forEach(one_group => {
            one_group.forEach(field => {
              if(field.jname === jname) {
                out.push(field)
              }
            });
          });
        });
      });
      return out;
    },
    getUploadFieldByMark(mark) {
      const [bodyIdx, partIdx, groupIdx, fieldIdx] = mark.split('-');
      const field = this.model.bodies[bodyIdx].children[partIdx]._children[groupIdx][fieldIdx];

      return field;
    },
    /*
      idxOfMark
      0 bodyIdx
      1 partIdx
      2 groupIdx
      3 fieldIdx
    */
    getSliceOfMark(field, idxOfMark) {
      return field._mark.split('-')[idxOfMark];
    },
    showed(field) {
      let rt = true;

      if(field._dpd4show) {
        let relfields = this.getFieldsByJname(field._dpd4show);
        if(relfields.length) {
          relfields.forEach(relfield => {
            if(
              this.getSliceOfMark(relfield, 2)
              === this.getSliceOfMark(field, 2)
            ) {
              const val = relfield._configs._staffValues.value;

              if(
                ~`-${relfield._hasJnames.join('-')}-`.indexOf(`-${field.jname}-`)
              ) {

                switch(field._dpd4show) {
                  case 'isEmail':
                    if(val && +val > 0) {
                      rt = false;
                    }
                  break;
                  default:
                    if(!val) {
                      rt = false;
                    }
                  break;
                }
              }
            }
          })
        }

      }
      return rt
    },
    isIDCard: _.debounce(function(field) {
      if(field.jname === 'idNumber') {
        // const certificateTypes = this.getFieldsByJname('certificateType');

        this.getFieldsByJname(field._dpd4show).forEach(dpdfield => {
          const groupIdx = this.getSliceOfMark(field, 2);
          if(
            groupIdx === this.getSliceOfMark(dpdfield, 2)
            && dpdfield._configs._staffValues.value === '1'
            && idNumberPattern.test(field._configs._staffValues.value)
          ) {

            let gender = this.empgender(field._configs._staffValues.value);
            let age = this.empage(field._configs._staffValues.value);
            let dateOfBirth = this.empdateOfBirth(field._configs._staffValues.value);

            this.updateWholeModel(
              field._hasJnames.map(jname => ({
                jname,
                value: this[`emp${jname}`](field._configs._staffValues.value)
              })),
              groupIdx
            );

          }
        });
      }
    }, 500),
    isDisabledByField(field) {
      let rt = false;

      if(field._dpd4disabled) {
        let relfields = this.getFieldsByJname(field._dpd4disabled);
        if(relfields.length) {
          relfields.forEach(relfield => {
            if(
              this.getSliceOfMark(relfield, 2)
              === this.getSliceOfMark(field, 2)
            ) {
              const val = relfield._configs._staffValues.value;
              if(
                ~`-${relfield._hasJnames.join('-')}-`.indexOf(`-${field.jname}-`)
              ) {

                switch(field._dpd4disabled) {
                  case 'idNumber':
                    this.getFieldsByJname('idNumber').forEach(idNumberField => {
                      if(
                        this.getSliceOfMark(field, 2) === this.getSliceOfMark(idNumberField, 2)
                      ) {
                        this.getFieldsByJname(idNumberField._dpd4show).forEach(cert => {
                          if(
                            this.getSliceOfMark(cert, 2) === this.getSliceOfMark(field, 2)
                            && cert._configs._staffValues.value === '1'
                            && idNumberPattern.test(val)
                          ) {
                            rt = true;
                          }
                        })
                      }
                    })

                  break;
                  case 'highestDegree':
                    if(
                      (
                        val
                        && +val <= 2
                        && field.jname === 'collegeGraduate'
                      )
                      ||
                      (
                        val
                        && +val <= 6
                        &&
                        (
                          field.jname === 'degreeType'
                          || field.jname === 'degreeName'
                          || field.jname === 'degreeNo'
                        )
                      )
                    ) {
                      rt = true;
                    }
                  break;
                  case 'contractType':
                    if(val && +val > 0) {
                      rt = true;
                    }
                  break;
                  default:
                    if(val) {
                      rt = true;
                    }
                  break;
                }

              }

            }
          });
        }

      }
      return rt
    },
    computeWorkAge(field) {
      if(field.jname === 'workingFirstTime') {
        const fwt = field._configs._staffValues.value;
        if(fwt) {
          let ta = (new Date().getTime() - moment(fwt).valueOf()) / 31536000000;
          let wage = '0.0';
          if(ta > 0) {
            wage = ta.toFixed(1);
          }
          this.updateWholeModel(
            field._hasJnames.map(jname => ({
              jname,
              value: wage
            })),
            this.getSliceOfMark(field, 2)
          )
        }
      }
    },
    onChange(field) {
      this.$nextTick(function() {
        const _hold4query = field._hold4query

        if(_hold4query) {
          this.getFieldsByJname(field._hold4query).forEach(needQueryField => {
            const groupIdx = this.getSliceOfMark(field, 2);
            if(groupIdx === this.getSliceOfMark(needQueryField, 2)) {

              const val = field._configs._staffValues.value;
              if(val) {
                this.$http.get(`/api/v1.0/common/query/city/${val}`)
                  .then(({body: res}) => {
                    if(res.code === 200) {
                      this.$set(this.confItems, `${_hold4query}_${needQueryField._mark}`, res.result)

                      if(
                        needQueryField._configs._staffValues.value
                        && ~_.findIndex(res.result, item => item.id === needQueryField._configs._staffValues.value)
                      ) {
                        this.updateWholeModel(
                          [
                            {jname: _hold4query, value: needQueryField._configs._staffValues.value}
                          ],
                          groupIdx
                        )
                      }else {
                        this.updateWholeModel(
                          [
                            {jname: _hold4query, value: null}
                          ],
                          groupIdx
                        )
                      }

                    }
                  })
                  .catch(res => console.log(res.status, res.statusText, res.url));
              }else {
                this.$set(this.confItems, `${_hold4query}_${needQueryField._mark}`, null)

                this.updateWholeModel(
                  [
                    {jname: _hold4query, value: null}
                  ],
                  groupIdx
                )

              }

            }
          })

        }
      })
    },
    arrangeUploadError(bodyIdx, partIdx) {
      const tmpmodel = this.model;

      if(typeof bodyIdx === 'number' && typeof partIdx === 'number') {
        const keys = Object.keys(this.uploadError);
        if(keys.length) {
          keys.forEach(key => {
            if(~key.indexOf(`${bodyIdx}-${partIdx}`)) {
              delete this.uploadError[key]
            }
          })
        }

        tmpmodel.bodies[bodyIdx].children[partIdx]._children.forEach((group, groupIdx) => {
          group.forEach((field, fieldIdx) => {
            if(
              field._configs.fieldType === '7'
              || field._configs.fieldType === '8'
            ) {
              this.$set(this.uploadError, `${bodyIdx}-${partIdx}-${groupIdx}-${fieldIdx}`, false)
            }
          })
        });
      }else {
        tmpmodel.bodies.forEach((body, bodyIdx) => {
          body.children.forEach((part, partIdx) => {
            part._children.forEach((group, groupIdx) => {
              group.forEach((field, fieldIdx) => {
                if(
                  field._configs.fieldType === '7'
                  || field._configs.fieldType === '8'
                ) {
                  this.$set(this.uploadError, `${bodyIdx}-${partIdx}-${groupIdx}-${fieldIdx}`, false)
                }
              });
            });
          });
        });
      }
      this.model = tmpmodel;
    },
    arrangeMark(bodyIdx, partIdx) {
      const tmpmodel = this.model;
      if(typeof bodyIdx === 'number' && typeof partIdx === 'number') {
        tmpmodel.bodies[bodyIdx].children[partIdx]._children.forEach((group, groupIdx) => {
          group.forEach((field, fieldIdx) => {
            field._mark = `${bodyIdx}-${partIdx}-${groupIdx}-${fieldIdx}`;
            if(
              field._configs.fieldType === '7'
              || field._configs.fieldType === '8'
            ) {
              this.$set(this.uploadError, field._mark, false)
            }
          })
        });
      }else {
        tmpmodel.bodies.forEach((body, bodyIdx) => {
          body.children.forEach((part, partIdx) => {
            part._children.forEach((group, groupIdx) => {
              group.forEach((field, fieldIdx) => {
                field._mark = `${bodyIdx}-${partIdx}-${groupIdx}-${fieldIdx}`;
                if(
                  field._configs.fieldType === '7'
                  || field._configs.fieldType === '8'
                ) {
                  this.$set(this.uploadError, field._mark, false)
                }
              });
            });
          });
        });
      }
      this.model = tmpmodel;
    },
    addGroup(partUid, bodyIdx, partIdx, groupIdx) {
      const group = _.cloneDeep(group4add[partUid]);
      this.model
          .bodies[bodyIdx]
          .children[partIdx]
          ._children
          .splice(groupIdx, 0, group);
      this.arrangeMark(bodyIdx, partIdx);
      this.arrangeUploadError(bodyIdx, partIdx);
    },
    removeGroup(bodyIdx, partIdx, groupIdx) {
      this.model.bodies[bodyIdx].children[partIdx]._children.splice(groupIdx, 1);
      // const keys = Object.keys(this.uploadError);
      // if(keys) {
      //   keys.forEach(key => {
      //     if(~key.indexOf(`${bodyIdx}-${partIdx}-${groupIdx}`)) {
      //       delete this.uploadError[key]
      //     }
      //   })
      // }
      this.arrangeMark(bodyIdx, partIdx);
      this.arrangeUploadError(bodyIdx, partIdx);
    },
    isEmail(jname, groupIdx) {
      const fields = this.getFieldsByJname(jname);
      let returned = false;
      fields.forEach(field => {
        if(this.getSliceOfMark(field, 2) === groupIdx) {
          if(field._configs._staffValues.value === '1') {
            returned = true;
          }
        }
      });
      return returned;
    },
    addAPEmail() {
      this.model.mails.push({mail: null});
    },
    removeAPEmail(i) {
      this.model.mails.splice(i, 1);
    },
    openTab(src) {
      window.open(src);
    },
    closeUploadErrorByMark(mark) {
      this.uploadError[mark] = false
    },
    async save() {

      let errorFlag = 0;
      this.$refs.fm.validate(valid => {
        if(!valid) {
          errorFlag++;
        }
      });

      const uploadErrorKeys = Object.keys(this.uploadError);
      if(uploadErrorKeys.length) {
        uploadErrorKeys.forEach(mark => {
          const field = this.getUploadFieldByMark(mark);
          if(field.isDefault || field.isRequired) {
            const val = field._configs._staffValues.value || [];
            const vall = val.length;
            const minl = field._configs.fieldMinSize || 1;
            const maxl = field._configs.fieldSize;
            if(vall >= minl && vall <= maxl) {
              this.uploadError[mark] = false;
            }else {
              this.uploadError[mark] = true;
              errorFlag++;
            }
          }else {
            this.uploadError[mark] = false;
          }
        })
      }

      if(errorFlag) {
        this.$alert('请仔细检查每个字段是否填写正确！', '字段验证失败', {
          type: 'error',
          showClose: false
        });
        return;
      }

      this.$emit('saveState', true);
      /*
        {
          staffValues:[
            {
              staffFieldConfigUid:'',
              values:"" || [],
              term:""
            }
          ]
        }

        个人信息 personal
        教育经历 education
        工作经历 job
        语言能力 language
        工作技能 skill
        其他证书 credential
        培训经历 train
        紧急联系人 emergency
        家庭情况 family

        在职信息 duty
        员工薪资 salary
        员工联系方式 contact
        银行卡 cardInfo
        社保公积金 socsecFundAccount
        档案 archive

      */
      const postData = {staffValues: [], approvalMails: []};
      this.model.bodies.forEach(body => {
        body.children.forEach(part => {

          part._children.forEach((one_group, groupIdx) => {
            one_group.forEach(field => {

              if(
                _.isArray(field._configs._staffValues.value)
                && field._configs._staffValues.value.length > 0
              ) {

                field._configs._staffValues.value.forEach(value => {
                  postData.staffValues.push({
                    staffFieldConfigUid: field._configs.uid,
                    value: value,
                    term: groupIdx,
                  })
                })
              }else if(
                !_.isArray(field._configs._staffValues.value)
                && field._configs._staffValues.value !== null
                && field._configs._staffValues.value !== ''
              ) {
                switch(field.jname) {
                  case 'reporterJobNumber':
                    if(!this.isEmail('isEmail', '0')) {
                      postData.staffValues.push({
                        staffFieldConfigUid: field._configs.uid,
                        value: field._configs._staffValues.value,
                        term: groupIdx
                      });
                    }
                  break;
                  case 'isEmail':
                    if(this.isEmail('isEmail', '0')) {
                      this.model.mails.forEach((item, idx) => {
                        if(item.mail) {
                          postData.approvalMails.push({mail: item.mail, sort: idx + 1})
                        }
                      });
                      postData.staffValues.push({
                        staffFieldConfigUid: field._configs.uid,
                        value: field._configs._staffValues.value,
                        term: groupIdx
                      });
                    }
                  break;
                  case 'workAge':
                    this.getFieldsByJname(field._dpd4disabled).forEach(dpdField => {
                      if(
                        this.getSliceOfMark(field, 2) === this.getSliceOfMark(dpdField, 2)
                        && !dpdField._configs._staffValues.value
                      ) {
                        postData.staffValues.push({
                          staffFieldConfigUid: field._configs.uid,
                          value: field._configs._staffValues.value,
                          term: groupIdx
                        });
                      }
                    })
                  break;
                  case 'collegeGraduate':
                    this.getFieldsByJname(field._dpd4disabled).forEach(dpdField => {
                      if(
                        this.getSliceOfMark(field, 2) === this.getSliceOfMark(dpdField, 2)
                        && dpdField._configs._staffValues.value
                        && +dpdField._configs._staffValues.value > 2
                      ) {
                        postData.staffValues.push({
                          staffFieldConfigUid: field._configs.uid,
                          value: field._configs._staffValues.value,
                          term: groupIdx
                        });
                      }
                    })
                  break;
                  case 'degreeType':
                    this.getFieldsByJname(field._dpd4disabled).forEach(dpdField => {
                      if(
                        this.getSliceOfMark(field, 2) === this.getSliceOfMark(dpdField, 2)
                        && dpdField._configs._staffValues.value
                        && +dpdField._configs._staffValues.value > 6
                      ) {
                        postData.staffValues.push({
                          staffFieldConfigUid: field._configs.uid,
                          value: field._configs._staffValues.value,
                          term: groupIdx
                        });
                      }
                    })
                  break;
                  case 'degreeName':
                    this.getFieldsByJname(field._dpd4disabled).forEach(dpdField => {
                      if(
                        this.getSliceOfMark(field, 2) === this.getSliceOfMark(dpdField, 2)
                        && dpdField._configs._staffValues.value
                        && +dpdField._configs._staffValues.value > 6
                      ) {
                        postData.staffValues.push({
                          staffFieldConfigUid: field._configs.uid,
                          value: field._configs._staffValues.value,
                          term: groupIdx
                        });
                      }
                    })
                  break;
                  case 'degreeNo':
                    this.getFieldsByJname(field._dpd4disabled).forEach(dpdField => {
                      if(
                        this.getSliceOfMark(field, 2) === this.getSliceOfMark(dpdField, 2)
                        && dpdField._configs._staffValues.value
                        && +dpdField._configs._staffValues.value > 6
                      ) {
                        postData.staffValues.push({
                          staffFieldConfigUid: field._configs.uid,
                          value: field._configs._staffValues.value,
                          term: groupIdx
                        });
                      }
                    })
                  break;
                  case 'probation':

                    this.getFieldsByJname(field._dpd4disabled).forEach(dpdField => {
                      if(
                        this.getSliceOfMark(field, 2) === this.getSliceOfMark(dpdField, 2)
                        && dpdField._configs._staffValues.value === '0'
                      ) {
                        postData.staffValues.push({
                          staffFieldConfigUid: field._configs.uid,
                          value: field._configs._staffValues.value,
                          term: groupIdx
                        });
                      }
                    })
                  break;
                  case 'becomeDate':
                    this.getFieldsByJname(field._dpd4disabled).forEach(dpdField => {
                      if(
                        this.getSliceOfMark(field, 2) === this.getSliceOfMark(dpdField, 2)
                        && dpdField._configs._staffValues.value === '0'
                      ) {
                        postData.staffValues.push({
                          staffFieldConfigUid: field._configs.uid,
                          value: field._configs._staffValues.value,
                          term: groupIdx
                        });
                      }
                    })
                  break;
                  case 'trialSalary':

                    this.getFieldsByJname(field._dpd4disabled).forEach(dpdField => {
                      if(
                        this.getSliceOfMark(field, 2) === this.getSliceOfMark(dpdField, 2)
                        && dpdField._configs._staffValues.value === '0'
                      ) {
                        postData.staffValues.push({
                          staffFieldConfigUid: field._configs.uid,
                          value: field._configs._staffValues.value,
                          term: groupIdx
                        });
                      }
                    })
                  break;
                  default:
                    postData.staffValues.push({
                      staffFieldConfigUid: field._configs.uid,
                      value: field._configs._staffValues.value,
                      term: groupIdx
                    })
                  break;
                }
              }

            });
          });

        });
      });


      // console.log('postData', postData);
      const apiUrl = this.staffUid
                      ? '/api/v1.0/staff/info/update'
                      : '/api/v1.0/staff/info/insert'
      const res = await this.$http.post(apiUrl, postData).catch(res => console.log(res.status, res.statusText, res.url));

      this.$emit('saveState', false);
      if(res) {
        const {body: {code, message}} = res
        if(code === 200) {
          this.$message.success({
            message: message,
            showClose: true
          });
          this.$emit('goback', {update: 'update'});
        }

      }

    },


    switchTab(uid) {
      if(this[`actTab`] !== uid) {
        this[`actTab`] = uid;
      }
    },

    toggleFold(uid) {
      this[`fold`][uid] = !this[`fold`][uid]
    },
    makeUploadOkCallback,
    makeUploadBeforeImgCallback,
    makeUploadBeforeDocCallback,
    makeRemoveUploadItem,
    makeValidator,
    getExtType,
  },
  mounted() {
    Indicator.open("正在加载...");
    // console.log('staffUid', this.staffUid);
//    this.perm.hasHighRole = this.$hroPerm.role.type < 2;
//    for(let i = 0, l = this.$hroPerm.account.funcModules.length; i < l; i++) {
//      let item = this.$hroPerm.account.funcModules[i];
//      if (item.funCode === 'staff') {
//        this.perm.code = item.funCode;
//        this.perm.name = item.fname;
//        break;
//      }
//    }
    // console.log('this.perm', this.perm);
    const rootdata = {
      staffFields: null,
      mails: null,
      data: null
    }
//    this.loading = this.$loading({
//      target: '.content',
//      text: '加载中......'
//    })

//    const apiUrl = this.staffUid
//                    ? `/api/v1.0/staff/info/query/${this.staffUid}`
//                    : '/api/v1.0/staff/info/field/query';
//
//    const res = await this.$http.get(apiUrl).catch(res => console.log(res.status, res.statusText, res.url));
    this.$http.get('/api/v1.0/client/selectStaff').then(res => {

      if (res) {
        const {body: {code, result}} = res

        if (code === 200) {
//          if (this.staffUid) {
//            this.uid = result.uid;
//            this.staffRecordUid = result.staffRecordUid;
//            rootdata.mails = (
//              result.approvalMails
//              && result.approvalMails.length
//            )
//              ? result.approvalMails
//              : [{mail: null}];
//            rootdata.staffFields = result.staffFields;
//          } else {
            rootdata.mails = [{mail: null}]
            rootdata.staffFields = result.staffFields;
//          }
//          console.log(12345,rootdata.staffFields)

          this.selected = rootdata.staffFields[0].uid;
//          this.switchTab(rootdata.staffFields[0].uid);

          this.fold = grub({
            arr: rootdata.staffFields,
            filter: item => item.level === 2 ? {filteredItem: item} : false,
            format: filteredData => {
              const out = {}
              filteredData.forEach(({uid}) => out[uid] = false)
              return out
            }
          });

          const fieldConfigTypes = _.uniqBy(
            grub({
              arr: rootdata.staffFields,
              filter: item => item.level === 3 ? {filteredItem: item} : false,
              format: filteredData => {
                const out = []
                filteredData.forEach(
                  ({
                     configs: [
                       {
                         configType
                       }
                     ],
                     jname
                   }) => {
                    if (jname === 'deptUid') {
                      out.push('_depts');
                    } else {
                      if (configType && configType !== 'city') {
                        out.push(configType);
                      }
                    }
                  }
                )
                return out
              }
            })
          );

          const fieldConfigReqs = fieldConfigTypes.map(configType => {
            if (configType === 'province') {
              return this.$http.get('/api/v1.0/common/query/province');
            } else if (configType === '_depts') {
              return this.$http.get(`/api/v1.0/dept/fundept/staff`)
            } else {
              return this.$http.get(`/api/v1.0/common/config/${configType}`);
            }
          });

          V.Promise
            .all(fieldConfigReqs)
            .then(res => {
              fieldConfigTypes.forEach((configType, idx) => {
                const {body} = res[idx]
                if (body && body.code === 200) {
                  if (configType === '_depts') {
                    this.$set(
                      this.confItems,
                      configType.toString(),
                      (result => {
//                        if (
//                          this.perm.hasHighRole
//                          || utils.isDeptTreeWalk(this.perm.code)
//                        ) {
//                          return utils.getDE({children: result}).map(dept => {
//                            dept.id = dept.uid;
//                            return dept;
//                          });
//                        } else {
                          return utils.getDE(result).map(dept => {
                            dept.id = dept.uid;
                            return dept;
                          });
//                        }
                      })(body.result)
                    );
                  } else {
                    this.$set(this.confItems, configType.toString(), body.result);
                  }

                }
              });

              // result = tr; // for test structure
              const self = this;
              const tmpmodel = modifyNode({
                arr: rootdata.staffFields,
                condition: part => part.level === 2,
                process(part) {

                  const _children = [];

                  const children = modifyNode({
                    arr: part.children,
                    condition: field => field.level === 3,
                    process(field) {
                      switch (field.jname) {
                        case 'certificateType':
                          field._hasJnames = ['idNumber'];
                          break;
                        case 'idNumber':
                          field._dpd4show = 'certificateType';
                          field._hasJnames = ['gender', 'age', 'dateOfBirth'];
                          break;
                        case 'gender':
                          field._dpd4disabled = 'idNumber';
                          break;
                        case 'age':
                          field._dpd4disabled = 'idNumber';
                          break;
                        case 'dateOfBirth':
                          field._dpd4disabled = 'idNumber';
                          break;
                        case 'workingFirstTime':
                          field._hasJnames = ['workAge'];
                          break;
                        case 'workAge':
                          field._dpd4disabled = 'workingFirstTime';
                          break;
                        case 'province':
                          field._hold4query = 'city'; // city is field's jname
                          break;
                        case 'highestDegree':
                          field._hasJnames = ['collegeGraduate', 'degreeType', 'degreeName', 'degreeNo'];
                          break;
                        case 'collegeGraduate':
                          field._dpd4disabled = 'highestDegree'; // test 4 use
                          break;
                        case 'degreeType':
                          field._dpd4disabled = 'highestDegree'; // test 4 use
                          break;
                        case 'degreeName':
                          field._dpd4disabled = 'highestDegree';
                          break;
                        case 'degreeNo':
                          field._dpd4disabled = 'highestDegree';
                          break;
                        case 'contractType':
                          field._hasJnames = ['probation', 'becomeDate', 'trialSalary']
                          break;
                        case 'probation':
                          field._dpd4disabled = 'contractType';
                          break;
                        case 'becomeDate':
                          field._dpd4disabled = 'contractType';
                          break;
                        case 'trialSalary':
                          field._dpd4disabled = 'contractType';
                          break;
                        case 'isEmail':
                          field._hasJnames = ['reporterJobNumber'];
                          break;
                        case 'reporterJobNumber':
                          field._dpd4show = 'isEmail';
                          break;
                      }

                      field._configs = _.cloneDeep(field.configs[0]);

                    }
                  })


                  const maxValueTerm = computeMaxValueTerm(part, children)
                  for (let i = 0, l = maxValueTerm + 1; i < l; i++) {
                    _children.push(_.cloneDeep(children))
                  }
                  _children.forEach((group, idx) => {
                    group.forEach(field => {
                      // console.log('this.confItems', this.confItems)
                      field._configs._staffValues = function (field, idx) {
                        const values = field._configs.staffValues;
                        const setvalues = [];
                        const dftvalues = [];
                        const fieldType = field._configs.fieldType;

                        if (field.jname === 'deptUid' && values.length) {

                          let flag = false;
                          self.confItems._depts.forEach(item => {
                            if (values[0].value === item.id) {
                              flag = true;
                            }
                          });
                          if (!flag) {
                            values[0].value = null;
                          }
                        }

                        if (values.length) {
                          values.forEach(item => {
                            if (+item.term === idx) {
                              setvalues.push(item.value);
                            }
                          })

                          if (+fieldType >= 6 && +fieldType <= 8) {
                            return {
                              value: setvalues,
                              term: 0
                            }
                          } else {
                            return {
                              value: setvalues[0] || null,
                              term: 0
                            }
                          }

                        } else {
                          if (+fieldType >= 4 && +fieldType <= 6) {
                            field._configs.staffFieldValues.forEach(item => {
                              if (item.isDefault) {
                                dftvalues.push(item.value)
                              }
                            })
                          }

                          if (+fieldType >= 6 && +fieldType <= 8) {
                            return {
                              value: dftvalues,
                              term: 0
                            }
                          } else {
                            return {
                              value: dftvalues[0] || null,
                              term: 0
                            }
                          }
                        }
                      }(field, idx)
                    })
                  })

                  if (part.isGroup) {

                    group4add[part.uid] = _.cloneDeep(_children[0]);
                    group4add[part.uid].forEach(field => {

                      const val = [];

                      if (
                        +field._configs.fieldType >= 4
                        && +field._configs.fieldType <= 6
                      ) {

                        field._configs.staffFieldValues.forEach(option => {
                          if (option.isDefault) {
                            val.push(option.value);
                          }
                        });

                      }

                      if (
                        +field._configs.fieldType >= 6
                        && +field._configs.fieldType <= 8
                      ) {
                        field._configs._staffValues = {value: val, term: 0, d: 'to copy'};
                      } else {
                        field._configs._staffValues = {value: val[0] || null, term: 0, d: 'to copy'};
                      }
                    })

                  }

                  part._children = _children
                }

              });

              // console.log('tmpmodel', tmpmodel)
              console.log(123450)
              this.model.mails = rootdata.mails
              this.model.bodies = _.cloneDeep(tmpmodel);
              this.arrangeMark();
              this.arrangeUploadError();
              Indicator.close();

//              if (this.staffUid) {
                this.getFieldsByJname('reporterJobNumber').forEach(field => {
                  if (
                    this.getSliceOfMark(field, 2) === '0'
                    && field._configs._staffValues.value
                  ) {
                    this.$http.get(`/api/v1.0/staff/info/staffInfo/${field._configs._staffValues.value}`)
                      .then(({body: res}) => {
                        if (res.code === 200) {
                          const {jobNumber, name, deptUid} = res.result;
                          const deptName = function (arr, id) {
                            let out = '';
                            arr.forEach(item => {
                              if (item.id === id) {
                                out = item.name;
                              }
                            });
                            return out;
                          }(this.confItems._depts, deptUid)
                          this.reporterOfStaff = {jobNumber, name, deptName};
                        } else {
                          this.reporterOfStaff = null;
                        }
                      })
                      .catch(res => console.log(res.status, res.statusText, res.url));
                  }
                })

                this.getFieldsByJname('workAge').forEach(field => {
                  this.getFieldsByJname(field._dpd4disabled).forEach(dpdField => {
                    if (
                      dpdField._configs._staffValues.value
                      && this.getSliceOfMark(field, 2) === this.getSliceOfMark(dpdField, 2)
                    ) {
                      this.computeWorkAge(dpdField);
                    }
                  });
                })

                this.getFieldsByJname('province').forEach(field => {
                  this.onChange(field);
                })

//              }

//              this.loading.close();

              // console.log('this.model', this.model);
              // console.log('group4add', group4add);
              // console.log('this.confItems', this.confItems)

            })
            .catch(res => console.log(res.status, res.statusText, res.url));

        }
      }
    })

  },
  watch: {
    // 监听是否切换岗位与基本信息
    selected: function (newValue, oldValue) {
      this.switchTab(newValue);
    }
  },
  components: {
    jobReporter
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/css/employees-func";
.fieldset-wrapper {
  padding: 20px 20px 0;
  .field-group {
    .group-hd {
      margin-bottom: 20px;
      background: #eee;
      line-height: 2.5;
      padding: 0 20px;
      .add {
        margin-left: 1em;
      }
    }
    .job-reporter {
      display: inline-block;
    }
  }
  .field-group:nth-of-type(n + 2) {
    border-top: 1px solid #eee;
    padding-top: 20px;
  }
  .text-form-item {
    width: 38em;
    position: relative;
    .el-tooltip {
      position: absolute;
      top: 13px;
      right: -17px;
    }
    .mail-input,
    .mail-x {
      display: inline-block;
    }
    .mail-input {
      width: 83%;
    }
  }
  .el-checkbox-group {
    display: inline-block;
  }
}
.opt {
  .add {
    margin-left: 1em;
  }
}
.el-alert {
  width: 336px;
}
.customize-uploads {
  .customize-upload {
    float: left;
    margin: 0 22px 22px 0;
    position: relative;
    .rmv {
      font-size: 14px;
      position: absolute;
      right: -0.4em;
      top: -0.5em;
      color: red;
      background: #fff;
      cursor: pointer;
      border-radius: 50%;
    }
    img,
    a {
      display: block;
    }
    img {
      cursor: pointer;
      height: 120px;
    }
    a {
      width: 118px;
      height: 118px;
      text-align: center;
      line-height: 118px;
      font-size: 48px;
      text-decoration: none;
      border: 1px solid #4db3ff;
    }
  }
}
</style>
<style lang="scss">
.employees-func {
  .el-card__body {
    padding: 0;
  }
  .el-card__header {
    height: 44px;
  }
  a {
    text-decoration: none;
  }
  /*.el-alert .el-alert__description {*/
  /*line-height: 1.3;*/
  /*}*/

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
        content: "";
        border-top: 3px solid #ffffff;
      }
      span.low-entry:after {
        display: none;
      }
    }
  }
  .dataTitle {
    height: 44px;
  }
}
</style>
