<template>

  <div id="employees-wrapper">
    <el-card v-if="model.mails && model.bodies" class="box-card">
      <div slot="header" class="clearfix tab-wrapper">
        <mt-navbar fixed v-model="selected" class="dataTitle">
          <mt-tab-item v-if="isLowEntry!=='-2'" v-for="item in model.bodies"
                       :key="item.uid" :id="item.uid">
            <span>{{item.fieldName === item.fieldDescr ? item.fieldName : (item.fieldName + item.fieldDescr)}}</span>
          </mt-tab-item>
          <mt-tab-item v-if="isLowEntry==='-2' && index===0" v-for="(item,index) in model.bodies"
                       :key="item.uid" :id="item.uid">
            <span
              v-text="(item.fieldName === item.fieldDescr) ? item.fieldName : (item.fieldName + item.fieldDescr)"></span>
          </mt-tab-item>
        </mt-navbar>
      </div>

      <el-form ref="fm" :model="model" label-suffix="：" :label-width="labelWidth" align="left">
        <div
          data-level="1"
          class="employees-func-body"
          v-for="(body, bodyIdx) in model.bodies"
          :key="body.uid"
          v-if="body.uid === actTab">
          <div
            data-level="2"
            class="employees-func-part"
            v-for="(part, partIdx) in body.children"
            :key="part.uid">
            <el-row class="header-bar">
              <el-col :span="12">
                <i class="icon_bg_signMyData" :class="`bg-ic_${part.jname}`"></i>
                <span class="vam" v-text="part.fieldName"></span>
              </el-col>
              <el-col :span="12" class="opt">
                <a @click="toggleFold(part.uid)">
                  <i class="icon_bg_signMyData"
                     :class="{'bg-ic_shouqi': !fold[part.uid], 'bg-ic_zhankai': fold[part.uid]}"></i>
                  <span class="vam">{{ !fold[part.uid] ? '收起' : '展开' }}</span>
                </a>
              </el-col>
            </el-row>
            <div class="fieldset-wrapper" v-if="!fold[part.uid]">
              <div class="field-group" v-for="(group, groupIdx) in part._children" :key="group">
                <div class="group-hd clearfix" v-if="part.isGroup">
                  <span class="pull-left">第 {{groupIdx + 1}} 段{{part.fieldName}}</span>
                  <span class="pull-right add"
                        @click="addGroup(part.uid, bodyIdx, partIdx, groupIdx + 1)">
                    <i class="icon_bg_signMyData bg-ic_add"></i>
                    <span class="vam">添加</span>
                </span>
                  <span v-if="part._children.length > 1"
                        class="pull-right del"
                        style="color: #F56C6C;"
                        @click="removeGroup(bodyIdx, partIdx, groupIdx)">
                    <i class="icon_bg_signMyData bg-ic_del"></i>
                    <span class="vam">删除</span>
                </span>
                </div>
                <template v-for="(field, fieldIdx) in group">


                  <el-form-item
                    v-if="field._configs.fieldType === '4' && field.jname !== 'reporterJobNumber' && field.isVisible"
                    :key="field.uid"
                    :label="field.fieldName"
                    :prop="`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`"
                    :rules="[{
                    required: (field.isDefault || field.isRequired),
                    trigger: 'change',
                    message: field._configs.fieldHint
                  }]">
                    <select v-if="!field.isDefined"
                            :disabled="isDisabledByField(field) || !field.isEdit"
                            v-model="field._configs._staffValues.value"
                            @change="makeCities(field)"
                            class="myData_select">
                      <option :value="''||null">请选择</option>
                      <option v-for="item in confItems[makeKeyOfConfitems(field)]"
                              :key="item.id"
                              v-text="item.name"
                              :value="item.id"
                              :class="{[item.idx]: `dept-item-${item.idx}`}"></option>
                    </select>
                    <select v-else-if="field.isDefined" :disabled="!field.isEdit"
                            v-model="field._configs._staffValues.value"
                            class="myData_select">
                      <option :value="''||null">请选择</option>
                      <option v-for="item in field._configs.staffFieldValues" :key="item.uid" v-text="item.value"
                              :value="item.value"></option>
                    </select>
                  </el-form-item>
                  <el-form-item
                    v-if="field._configs.fieldType === '4' && field.jname === 'reporterJobNumber' && showed(field) && field.isVisible"
                    :key="field.uid"
                    :label="field.fieldName"
                    :prop="`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`"
                    :rules="[{
                    required: (field.isDefault || field.isRequired),
                    message: field._configs.fieldHint
                  }]">
                    <el-button :disabled="true" v-text="reporterJobNumberName"></el-button>
                    <!--<el-input-->
                    <!--:disabled="true"-->
                    <!--v-model="field._configs._staffValues.value">-->
                    <!--</el-input>-->
                    <!--<job-reporter-->
                    <!--@validate="empValidateJR(`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`)"-->
                    <!--class="job-reporter" v-model="field._configs._staffValues.value" ref="jobReporter">-->
                    <!--</job-reporter>-->
                    <!--<el-tooltip v-if="field.fieldDescr" :content="field.fieldDescr" placement="right">-->
                    <!--<i class="el-icon-info"></i>-->
                    <!--</el-tooltip>-->
                  </el-form-item>

                  <el-form-item
                    v-if="field._configs.fieldType === '1' && showed(field) && field.isVisible"
                    class="text-form-item"
                    :key="field.uid"
                    :label="field.fieldName"
                    :prop="`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`"
                    :rules="[{
                    required: (field.isDefault || field.isRequired),
                    trigger: 'blur',
                    message: field._configs.fieldHint,
                    validator: makeValidator(field, getFieldsByJname(field._dpd4show))
                  }]"
                    :ref="field.jname">
                    <el-input
                      @keyup.native="isIDCard(field)"
                      :disabled="isDisabledByField(field) || !field.isEdit"
                      v-model.trim="field._configs._staffValues.value"
                      :maxlength="field._configs.fieldSize ? +field._configs.fieldSize : 256">
                    </el-input>
                  </el-form-item>

                  <el-form-item
                    v-if="field._configs.fieldType === '5' && field.isVisible"
                    :key="field.uid"
                    :label="field.fieldName"
                    :prop="`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`"
                    :rules="[{
                    required: (field.isDefault || field.isRequired),
                    trigger: 'change',
                    message: field._configs.fieldHint
                  }]">
                    <el-radio-group
                      v-if="!field.isDefined"
                      v-model="field._configs._staffValues.value"
                      :disabled="isDisabledByField(field) || !field.isEdit">
                      <el-radio
                        v-for="item in confItems[field._configs.configType]"
                        :key="item.id"
                        :label="item.id">
                        <span>{{item.name}}</span>
                      </el-radio>
                    </el-radio-group>
                    <el-radio-group
                      v-else
                      v-model="field._configs._staffValues.value"
                      :disabled="!field.isEdit">
                      <el-radio
                        v-for="item in field._configs.staffFieldValues"
                        :key="item.uid"
                        :label="item.value">
                        <span>{{item.value}}</span>
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <div
                    v-if="field._configs.fieldType === '5'&& isEmail('isEmail', '0') && field.jname === 'isEmail' && field.isVisible">
                    <el-form-item
                      v-for="(item, i) in model.mails"
                      :key="i"
                      :label="`第${i + 1}级审批邮箱`"
                      :prop="`mails.${i}.mail`"
                      :rules="[{
                    required: (field.isDefault || field.isRequired),
                    pattern: /^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-z0-9]{2,5}$/,
                    message: '请输入正确的审批邮箱',
                    trigger: 'blur'
                  }]"
                      class="text-form-item">
                      <el-input :maxlength="64" :disabled="!field.isEdit"
                                v-model.trim="item.mail"></el-input>
                      <!--<el-button class="mail-x" type="text" :disabled="!field.isEdit"-->
                      <!--@click="removeAPEmail(i)">-->
                      <!--<i class="el-icon-delete"></i>-->
                      <!--</el-button>-->
                    </el-form-item>
                    <!--<el-form-item>-->
                    <!--<el-button :disabled="!field.isEdit" type="primary" icon="el-icon-circle-plus-outline"-->
                    <!--@click="addAPEmail">-->
                    <!--<span>添加审批邮箱</span>-->
                    <!--</el-button>-->
                    <!--</el-form-item>-->
                  </div>
                  <el-form-item
                    v-if="field._configs.fieldType === '2' && field.isVisible"
                    :key="field.uid"
                    :label="field.fieldName"
                    :prop="`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`"
                    :rules="[{
                    required: (field.isDefault || field.isRequired),
                    trigger: 'change',
                    message: field._configs.fieldHint
                  }]">
                    <el-input :disabled="isDisabledByField(field) || !field.isEdit"
                              v-model="field._configs._staffValues.value" placeholder="请选择日期" readonly
                              @focus="openPicker({bodyIdx,partIdx,groupIdx,fieldIdx},field._configs._staffValues.value)"
                              icon="date"></el-input>
                  </el-form-item>
                  <el-form-item
                    v-if="field._configs.fieldType === '3' && field.isVisible"
                    class="text-form-item"
                    :key="field.uid"
                    :label="field.fieldName"
                    :prop="`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`"
                    :rules="[{
                    required: (field.isDefault || field.isRequired),
                    trigger: 'blur',
                    message: field._configs.fieldHint,
                    validator: makeValidator(field)
                  }]">
                    <el-input
                      v-model.trim="field._configs._staffValues.value"
                      :maxlength="field._configs.fieldSize ? +field._configs.fieldSize : 256"
                      :disabled="isDisabledByField(field) || !field.isEdit"
                      :placeholder="'请输入'+field.fieldName">
                    </el-input>
                  </el-form-item>
                  <el-form-item
                    v-if="field._configs.fieldType === '6' && field.isVisible"
                    :key="field.uid"
                    :label="field.fieldName"
                    :prop="`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`"
                    :rules="[{
                    required: (field.isDefault || field.isRequired),
                    type: 'array',
                    trigger: 'change',
                    message: field._configs.fieldHint
                  }]">
                    <el-checkbox-group v-model="field._configs._staffValues.value" :disabled="!field.isEdit">
                      <el-checkbox
                        style="z-index: 0;"
                        v-for="item in field._configs.staffFieldValues || []"
                        :key="item.uid"
                        :label="item.value">
                        <span>{{item.value}}</span>
                      </el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item
                    v-if="field._configs.fieldType === '7' && field.isVisible"
                    :key="field.uid"
                    :required="(field.isDefault || field.isRequired)"
                    :label="field.fieldName"
                    :prop="`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`">
                    <uploadImage
                      v-if="!field._configs.fileEdit"
                      :title="field.fieldName" :field="field" :type="'image'"
                      :position="{bodyIdx,partIdx,groupIdx,fieldIdx}" @update="updateImgFile">
                      <el-button slot="button" type="primary" size="small"
                                 :disabled="!(field._configs._staffValues.value.length>0)||!field.isEdit"
                                 @click="editImg(bodyIdx,partIdx,groupIdx,fieldIdx)">
                        <span>编辑</span>
                      </el-button>
                    </uploadImage>
                    <div v-if="field._configs.fileEdit">
                      <el-button type="danger" size="small"
                                 @click="deleteFile(bodyIdx,partIdx,groupIdx,fieldIdx)"
                                 :disabled="!field.isEdit">
                        <span>删除</span>
                      </el-button>
                      <el-button @click="cancelEditImg(bodyIdx,partIdx,groupIdx,fieldIdx)" :disabled="!field.isEdit"
                                 size="small">
                        <span>取消</span>
                      </el-button>
                    </div>


                    <!--<div class="customize-uploads">-->
                    <!--<div class="customize-upload" v-for="(item, idx) in field._configs._staffValues.value" :key="idx">-->
                    <!--<i class="bg-img ico_select_1"-->
                    <!--@click="makeRemoveUploadItem(bodyIdx, partIdx, groupIdx, fieldIdx, idx)"></i>-->
                    <!--<img :src="item.url" @click="openTab(item)"/>-->
                    <!--</div>-->
                    <!--</div>-->
                    <div class="YD_image_list">
                      <div class="YD_image_list_item"
                           v-for="(n, index) in (field._configs._staffValues.value)"
                           v-fancybox-thumbnail="[n.width, n.height]" :data-index="index">
                        <img v-if="!field._configs.fileEdit" @click="queryImg($event,field._configs._staffValues.value)"
                             :src="n.url" alt="">
                        <!--<i v-if="field._configs.fileEdit" class="bg-img ico_select_1" :class="{'ico_select_1':!n.selected,'ico_select_2':n.selected}"-->
                        <!--@click="makeRemoveUploadItem(bodyIdx, partIdx, groupIdx, fieldIdx, idx)"></i>-->
                        <i v-if="field._configs.fileEdit" class="bg-img YD_image_list_item_icon"
                           :class="{'ico_select_1':!n.selected,'ico_select_2':n.selected}"
                           @click="selectImg(field._configs._staffValues.value,index)"></i>
                        <img v-if="field._configs.fileEdit" :src="n.url" alt="">
                      </div>
                    </div>
                  </el-form-item>
                  <el-form-item
                    v-if="field._configs.fieldType === '8' && field.isVisible"
                    :key="field.uid"
                    :required="(field.isDefault || field.isRequired)"
                    :label="field.fieldName"
                    :prop="`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`">
                    <uploadImage
                      v-if="!field._configs.fileEdit"
                      :title="field.fieldName" :field="field" :type="'file'"
                      :position="{bodyIdx,partIdx,groupIdx,fieldIdx}" @update="updateImgFile">
                      <el-button slot="button" type="primary" size="small"
                                 :disabled="!(field._configs._staffValues.value.length>0)||!field.isEdit"
                                 @click="editImg(bodyIdx,partIdx,groupIdx,fieldIdx)">
                        <span>编辑</span>
                      </el-button>
                    </uploadImage>
                    <div v-if="field._configs.fileEdit">
                      <el-button type="danger" size="small" @click="deleteFile(bodyIdx,partIdx,groupIdx,fieldIdx)"
                                 :disabled="!field.isEdit">
                        <span>删除</span>
                      </el-button>
                      <el-button @click="cancelEditImg(bodyIdx,partIdx,groupIdx,fieldIdx)" size="small">取消</el-button>
                    </div>
                    <!--<div class="customize-uploads">-->
                    <!--<div class="customize-upload" v-for="(item, idx) in field._configs._staffValues.value" :key="idx">-->
                    <!--<i class="fa fa-minus-circle rmv"-->
                    <!--@click="makeRemoveUploadItem(bodyIdx, partIdx, groupIdx, fieldIdx, idx)"></i>-->
                    <!--<a :href="item + `&token=${tokenHeader.token}&mobile=${tokenHeader.mobile}`"-->
                    <!--:class="getExtType(item)">下载</a>-->
                    <!--</div>-->
                    <!--</div>-->
                    <div class="YD_image_list">
                      <div class="YD_image_list_item"
                           v-for="(n, index) in field._configs._staffValues.value"
                           v-fancybox-thumbnail="[40, 40]" :data-index="index">
                        <i v-if="field._configs.fileEdit" class="bg-img YD_image_list_item_icon"
                           :class="{'ico_select_1':!n.selected,'ico_select_2':n.selected}"
                           @click="selectImg(field._configs._staffValues.value,index)"></i>
                        <img src="../../assets/ico_document.png" alt="">
                        <a :href="n.url + `&token=${tokenHeader.token}&mobile=${tokenHeader.mobile}`"
                           :class="getExtType(n.url)" style="font-size: 14px;">下载</a>
                      </div>
                    </div>
                  </el-form-item>
                  <!--<el-form-item-->
                  <!--v-if="field._configs.fieldType === '9' && field.isVisible"-->
                  <!--class="text-form-item"-->
                  <!--:key="field.uid"-->
                  <!--:label="field.fieldName"-->
                  <!--:prop="`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`"-->
                  <!--:rules="[{-->
                  <!--required: (field.isDefault || field.isRequired),-->
                  <!--trigger: 'blur',-->
                  <!--message: field._configs.fieldHint,-->
                  <!--validator: makeValidator(field)-->
                  <!--}]">-->
                  <!--<el-input-->
                  <!--:disabled="!field.isEdit"-->
                  <!--v-model.trim="field._configs._staffValues.value"-->
                  <!--:maxlength="field._configs.fieldSize ? +field._configs.fieldSize : 256">-->
                  <!--</el-input>-->
                  <!--</el-form-item>-->

                  <!--<el-form-item-->
                  <!--v-if="field._configs.fieldType === '10' && field.isVisible"-->
                  <!--class="text-form-item"-->
                  <!--:key="field.uid"-->
                  <!--:label="field.fieldName"-->
                  <!--:prop="`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`"-->
                  <!--:rules="[{-->
                  <!--required: (field.isDefault || field.isRequired),-->
                  <!--trigger: 'blur',-->
                  <!--message: field._configs.fieldHint,-->
                  <!--validator: makeValidator(field)-->
                  <!--}]">-->
                  <!--<el-input-->
                  <!--:disabled="!field.isEdit"-->
                  <!--v-model.trim="field._configs._staffValues.value"-->
                  <!--:maxlength="field._configs.fieldSize ? +field._configs.fieldSize : 256">-->
                  <!--</el-input>-->
                  <!--</el-form-item>-->
                  <!--<el-form-item-->
                  <!--v-if="field._configs.fieldType === '11'&& field.isVisible"-->
                  <!--class="text-form-item"-->
                  <!--:key="field.uid"-->
                  <!--:label="field.fieldName"-->
                  <!--:prop="`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`"-->
                  <!--:rules="[{-->
                  <!--required: (field.isDefault || field.isRequired),-->
                  <!--trigger: 'blur',-->
                  <!--message: field._configs.fieldHint,-->
                  <!--validator: makeValidator(field)-->
                  <!--}]">-->
                  <!--<el-input-->
                  <!--:disabled="!field.isEdit"-->
                  <!--v-model.trim="field._configs._staffValues.value"-->
                  <!--:maxlength="field._configs.fieldSize ? +field._configs.fieldSize : 256">-->
                  <!--</el-input>-->
                  <!--</el-form-item>-->
                  <!--<el-form-item-->
                  <!--v-if="field._configs.fieldType === '12' && field.isVisible"-->
                  <!--class="text-form-item"-->
                  <!--:key="field.uid"-->
                  <!--:label="field.fieldName"-->
                  <!--:prop="`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`"-->
                  <!--:rules="[{-->
                  <!--required: (field.isDefault || field.isRequired),-->
                  <!--trigger: 'blur',-->
                  <!--message: field._configs.fieldHint,-->
                  <!--validator: makeValidator(field)-->
                  <!--}]">-->
                  <!--<el-input-->
                  <!--:disabled="!field.isEdit"-->
                  <!--v-model.trim="field._configs._staffValues.value"-->
                  <!--:maxlength="field._configs.fieldSize ? +field._configs.fieldSize : 256">-->
                  <!--</el-input>-->
                  <!--</el-form-item>-->
                  <el-form-item
                    v-if="(field._configs.fieldType === '9'||field._configs.fieldType === '10'||field._configs.fieldType === '11'||field._configs.fieldType === '12'||field._configs.fieldType === '13'||field._configs.fieldType === '15') && field.isVisible"
                    class="text-form-item"
                    :key="field.uid"
                    :label="field.fieldName"
                    :prop="`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`"
                    :rules="[{
                    required: (field.isDefault || field.isRequired),
                    trigger: 'blur',
                    message: field._configs.fieldHint,
                    validator: makeValidator(field)
                  }]">
                    <el-input
                      :disabled="!field.isEdit"
                      v-model.trim="field._configs._staffValues.value"
                      :maxlength="field._configs.fieldSize ? +field._configs.fieldSize : 256">
                    </el-input>
                  </el-form-item>
                  <el-form-item
                    v-if="field._configs.fieldType === '14' && field.isVisible"
                    class="text-form-item"
                    :key="field.uid"
                    :label="field.fieldName"
                    :prop="`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`"
                    :rules="[{
                    required: (field.isDefault || field.isRequired),
                    trigger: 'blur',
                    message: field._configs.fieldHint,
                    validator: makeValidator(field)
                  }]">
                    <el-input
                      :disabled="isDisabledByField(field) || !field.isEdit"
                      v-model.trim="field._configs._staffValues.value"
                      :maxlength="field._configs.fieldSize ? +field._configs.fieldSize : 256">
                    </el-input>
                  </el-form-item>
                </template>
              </div>
            </div>
          </div>
        </div>
      </el-form>
      <el-button style="width: 100%;position: fixed;bottom: 0;left: 0;" type="primary" @click="save">保存更新</el-button>
    </el-card>
    <mt-datetime-picker type="date" ref="picker" v-model="nowDateTime" :startDate="startDate" year-format="{value} 年"
                        month-format="{value} 月" date-format="{value} 日" @confirm="handleConfirm">
    </mt-datetime-picker>
  </div>
</template>
<script>
  import moment from 'moment'
  import V from 'vue'
  import _ from 'lodash'
  import ElementUI from 'element-ui'
  import "element-ui/lib/theme-default/index.css";
  import utils from '../common/utils'
  import uploadImage from "./uploadImage"
  import fancyBox from 'vue-fancybox';
  //  import jobReporter from '../common/emp-one'//选择汇报人弹框，暂时不用
  import {MessageBox, Indicator} from "mint-ui";
  V.use(ElementUI);
  // ====日历组件需求开始====
  let df1 = "YYYY-MM-DD";
  //  let df2 = "YYYY-MM";
  let pickerslot = document.getElementsByClassName("picker-slot");
  // ====日历组件需求结束====
  const computeMaxValueTerm = function computeMaxValueTerm(item, children) {
    const computeFieldMaxTerm = function computeFieldMaxTerm(values) {
      let term = 0;
      values.forEach(item => {
        if (+item.term > term) {
          term = +item.term;
        }
      });
      return term;
    };
    let maxFieldTerm = 0;
    if (item.isGroup) {
      children.forEach(child => {
        let fieldTerm = computeFieldMaxTerm(child.configs[0].staffValues)
        if (fieldTerm > maxFieldTerm) {
          maxFieldTerm = fieldTerm;
        }
      })
    }
    return maxFieldTerm;
  };
  const group4add = {};
  const grub = utils.grub;
  const modifyNode = utils.modifyNode;
  const makeRemoveUploadItem = utils.makeRemoveUploadItem;
  const makeValidator = utils.makeValidator;
  const getExtType = utils.getExtType;
  const idNumberPattern = utils.idNumberPattern;
  export default {
    data() {
      return {
        isLowEntry: null,//判断是否是待入职员工
        startDate: new Date(),
        nowDateTime: new Date(),
        selected: '',//tab切换的判断位
        labelWidth: '140px',
        uid: null,
        staffRecordUid: null,
        model: {
          bodies: null,
          mails: null
        },
        confItems: {},
        uploadError: {},
        tokenHeader: {
          token: sessionStorage.getItem('token'),
          mobile: sessionStorage.getItem('mobile')
        },
        perm: {},
        actTab: '',
        fold: null,
        reporterJobNumberName: '--',//汇报人名称
      }
    },
    methods: {
      empValidateJR(prop) {
        this.$refs.fm.validateField(prop);
      },
      makeKeyOfConfitems(field) {
        if (field.jname === 'deptUid') {
          return '_depts';
        } else {
          return field._configs.configType === 'city' ? `${field.jname}_${field._mark}` : field._configs.configType;
        }
      },
      updateWholeModel(states, groupIdx) {
        let tmpmodel = this.model;
        tmpmodel.bodies.forEach(body => {
          body.children.forEach(part => {
            part._children.forEach(one_group => {
              one_group.forEach(field => {
                states.forEach(state => {
                  if (
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
        let id = val;
        let birth = `${id.substring(6, 10)}-${id.substring(10, 12)}-${id.substring(12, 14)}`;
        let delta = new Date().getTime() - (+moment(birth).format('x'));
        let age = moment.duration(delta).years() || '';
        return age.toString();
      },
      empdateOfBirth(val) {
        let id = val;
        let birth = `${id.substring(6, 10)}-${id.substring(10, 12)}-${id.substring(12, 14)}`;
        let modelBirth = moment(birth).format(df1);
        return modelBirth
      },
      empgender(val) {
        let sex = (+val.toString().trim()[16]) % 2 === 0 ? '女' : '男';
        if (sex === '男') return '1';
        else return '0'
      },
      getFieldsByJname(jname) {
        let out = [];
        if (!jname) {
          return out;
        }
        this.model.bodies.forEach(body => {
          body.children.forEach(part => {
            part._children.forEach(one_group => {
              one_group.forEach(field => {
                if (field.jname === jname) {
                  out.push(field)
                }
              });
            });
          });
        });
        return out;
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
        if (field._dpd4show) {
          let relfields = this.getFieldsByJname(field._dpd4show);
          if (relfields.length) {
            relfields.forEach(relfield => {
              if (this.getSliceOfMark(relfield, 2) === this.getSliceOfMark(field, 2)) {
                const val = relfield._configs._staffValues.value;
                if (~`-${relfield._hasJnames.join('-')}-`.indexOf(`-${field.jname}-`)) {
                  switch (field._dpd4show) {
                    case 'isEmail':
                      if (val && +val > 0) {
                        rt = false;
                      }
                      break;
                    default:
                      if (!val) {
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
      isIDCard: _.debounce(function (field) {
        if (field.jname === 'idNumber') {
          this.getFieldsByJname(field._dpd4show).forEach(dpdfield => {
            const groupIdx = this.getSliceOfMark(field, 2);
            if (
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
        if (field._dpd4disabled) {
          let relfields = this.getFieldsByJname(field._dpd4disabled);
          if (relfields.length) {
            relfields.forEach(relfield => {
              if (this.getSliceOfMark(relfield, 2) === this.getSliceOfMark(field, 2)) {
                const val = relfield._configs._staffValues.value;
                if (~`-${relfield._hasJnames.join('-')}-`.indexOf(`-${field.jname}-`)) {
                  switch (field._dpd4disabled) {
                    case 'idNumber':
                      if (idNumberPattern.test(val)) {
                        rt = true;
                      }
                      break;
                    case 'highestDegree':
                      if ((val && +val <= 2 && field.jname === 'collegeGraduate') || (val && +val <= 6 && (field.jname === 'degreeType' || field.jname === 'degreeName' || field.jname === 'degreeNo'))) {
                        rt = true;
                      }
                      break;
                    case 'contractType':
                      if (val && +val > 0) {
                        rt = true;
                      }
                      break;
                    default:
                      if (val) {
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
        if (field.jname === 'workingFirstTime') {
          const fwt = field._configs._staffValues.value;
          if (fwt) {
            let ta = (new Date().getTime() - moment(fwt).valueOf()) / 31536000000;
            let wage = '0.0';
            if (ta > 0) {
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
      makeCities(field, isInit) {
        this.$nextTick(function () {
          const _hold4query = field._hold4query
          if (_hold4query) {
            this.getFieldsByJname(field._hold4query).forEach(needQueryField => {
              const groupIdx = this.getSliceOfMark(field, 2);
              if (groupIdx === this.getSliceOfMark(needQueryField, 2)) {
                const val = field._configs._staffValues.value;
                if (val) {
                  this.$http.get(`/api/v1.0/common/query/city/${val}`).then(({body: res}) => {
                    if (res.code === 200) {

                      this.$set(this.confItems, `${_hold4query}_${needQueryField._mark}`, res.result)
                      if (isInit !== 1) {
                        this.updateWholeModel(
                          [
                            {jname: _hold4query, value: this.confItems[`${_hold4query}_${needQueryField._mark}`][0].id}
                          ],
                          groupIdx
                        )
                      }
                    }
                  }).catch(res => console.log(res.status, res.statusText, res.url));
                } else {
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
      arrangeVein(bodyIdx, partIdx) {
        const tmpmodel = this.model;
        if (typeof bodyIdx === 'number' && typeof partIdx === 'number') {
          tmpmodel.bodies[bodyIdx].children[partIdx]._children.forEach((group, groupIdx) => {
            group.forEach((field, fieldIdx) => {
              field._mark = `${bodyIdx}-${partIdx}-${groupIdx}-${fieldIdx}`;
            })
          });
        } else {
          tmpmodel.bodies.forEach((body, bodyIdx) => {
            body.children.forEach((part, partIdx) => {
              part._children.forEach((group, groupIdx) => {
                group.forEach((field, fieldIdx) => {
                  field._mark = `${bodyIdx}-${partIdx}-${groupIdx}-${fieldIdx}`;
                });
              });
            });
          });
        }
        this.model = tmpmodel;
      },
      addGroup(partUid, bodyIdx, partIdx, groupIdx) {
        const group = _.cloneDeep(group4add[partUid]);
        this.model.bodies[bodyIdx].children[partIdx]._children.splice(groupIdx, 0, group);
        this.arrangeVein(bodyIdx, partIdx);
      },
      removeGroup(bodyIdx, partIdx, groupIdx) {
        this.model.bodies[bodyIdx].children[partIdx]._children.splice(groupIdx, 1);
        this.arrangeVein(bodyIdx, partIdx);
      },
      isEmail(jname, groupIdx) {
        const fields = this.getFieldsByJname(jname);
        let returned = false;
        fields.forEach(field => {
          if (this.getSliceOfMark(field, 2) === groupIdx) {
            if (field._configs._staffValues.value === '1') {
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
      save() {
        let flag = 0;
        this.$refs.fm.validate(valid => {
          if (!valid) {
            flag++;
            return false;
          }
        });
        if (flag) {
          return;
        }
        Indicator.open("正在保存中...");
        /*
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
        const postData = {uid: this.model.uid, staffValues: [], approvalMails: []};
        this.model.bodies.forEach((body, bodyIndex) => {
          if (this.isLowEntry === '-2' && bodyIndex === 0) {
            forBody(body);
          } else if (this.isLowEntry !== '-2') {
            forBody(body);
          }
        });
        function forBody(body) {
          body.children.forEach(part => {
            part._children.forEach((one_group, groupIdx) => {
              one_group.forEach(field => {
                if (_.isArray(field._configs._staffValues.value) && field._configs._staffValues.value.length > 0) {
                  field._configs._staffValues.value.forEach(value => {
                    if (field._configs.fieldType === '7' || field._configs.fieldType === '8') {
                      postData.staffValues.push({
                        staffFieldConfigUid: field._configs.uid,
                        value: value.url,
                        term: groupIdx,
                      })
                    } else {
                      postData.staffValues.push({
                        staffFieldConfigUid: field._configs.uid,
                        value: value,
                        term: groupIdx,
                      })
                    }
                  })
                } else if (!_.isArray(field._configs._staffValues.value) && field._configs._staffValues.value !== null && field._configs._staffValues.value !== '') {
                  postData.staffValues.push({
                    staffFieldConfigUid: field._configs.uid,
                    value: field._configs._staffValues.value,
                    term: groupIdx,
                  })
                }
              });
            });
          });
        }

        if (this.isEmail('isEmail', '0')) {
          this.model.mails.forEach((mail, idx) => {
            postData.approvalMails.push({mail, sort: idx + 1})
          });
        }
        this.$http.post('/api/v1.0/client/updateStaffInfo', postData).then(res => {
          const {body: {code, message}} = res;
          if (code === 200) {
            if (!(this.isLowEntry === '-1' || this.isLowEntry === '-2')) {
              this.$router.push({path: "/signCard"});
            }
          }
          MessageBox("提示", message);
          Indicator.close();
        });
      },
      //切换岗位与基本信息
      switchTab(uid) {
        if (this[`actTab`] !== uid) {
          this[`actTab`] = uid;
        }
      },
      // 收起展开
      toggleFold(uid) {
        this[`fold`][uid] = !this[`fold`][uid]
      },
      makeRemoveUploadItem,
      makeValidator,
      getExtType,
      // 选择日期组件
      // openPicker(date,pos,currentDate)中有三个参数
      //其中date值0表示有年月日，1表示有年月
      //其中pos表示用来记录判断操作的对象位置
      //其中currentDate表示当前已经选中的时间，日历会定位在这里，若是没有在定位到当前时间
      // ====日历组件方法开始====
      openPicker(pos, currentDate, position) {
        this.pos = pos;
        this.position = position;
        if (currentDate) {
          this.nowDateTime = new Date(currentDate);
        } else {
          this.nowDateTime = new Date();
        }
        for (let i = 0; i < 3; i++) {
          pickerslot[i].style.width = "33.33%";
        }
        this.$refs.picker.open();
      },
      //选中日期
      handleConfirm(data) {
        if (data) {
          this.selectDateTime = moment(data).format(df1);
          this.model.bodies[this.pos.bodyIdx].children[this.pos.partIdx]._children[this.pos.groupIdx][this.pos.fieldIdx]._configs._staffValues.value = this.selectDateTime;
          var currfield=this.model.bodies[this.pos.bodyIdx].children[this.pos.partIdx]._children[this.pos.groupIdx][this.pos.fieldIdx];
          if(currfield.jname === 'workingFirstTime'){
            this.computeWorkAge(currfield);
          }
        }
      },
      //上传图片文件
      updateImgFile(data){
        this.model.bodies[data.position.bodyIdx].children[data.position.partIdx]._children[data.position.groupIdx][data.position.fieldIdx]._configs._staffValues.value.push(
          {
            selected: false,
            url: data.url,
            width: 0,
            height: 0
          }
        );
      },
      //查看图片
      queryImg(e, list){
        fancyBox(e.target, list);
      },
      //编辑操作
      editImg(bodyIdx, partIdx, groupIdx, fieldIdx){
//        console.log(123456789, this.model.bodies[bodyIdx].children[partIdx]._children[groupIdx][fieldIdx]._configs._staffValues.value)
        V.set(this.model.bodies[bodyIdx].children[partIdx]._children[groupIdx][fieldIdx]._configs, 'fileEdit', true)
      },
      //取消删除文件
      cancelEditImg(bodyIdx, partIdx, groupIdx, fieldIdx){
        V.set(this.model.bodies[bodyIdx].children[partIdx]._children[groupIdx][fieldIdx]._configs, 'fileEdit', false);
      },
      //编辑状态，删除文件
      deleteFile(bodyIdx, partIdx, groupIdx, fieldIdx){
        let list = this.model.bodies[bodyIdx].children[partIdx]._children[groupIdx][fieldIdx]._configs._staffValues.value;
        for (let i = 0; i < list.length; i++) {
          if (list[i].selected) {
            list.splice(i, 1);
            i--;
          }
        }
//        console.log(list)
        this.model.bodies[bodyIdx].children[partIdx]._children[groupIdx][fieldIdx]._configs._staffValues.value = list;
        this.cancelEditImg(bodyIdx, partIdx, groupIdx, fieldIdx);
      },
      //选择删除的文件
      selectImg(list, i){
        V.set(list[i], 'selected', !list[i].selected)
      },
    },
    watch: {
      // 监听是否切换岗位与基本信息
      selected: function (newValue, oldValue) {
        this.switchTab(newValue);
      }
    },
    mounted() {
      Indicator.open("正在加载...");
      this.isLowEntry = this.getCookie("isLowEntry");
      const rootdata = {
        staffFields: null,
        mails: null,
        uid: null
      };
      //审批人表赋值给汇报上级
      this.$http.get("/api/v1.0/client/findReporter").then(
        response => {
          if (response.body.code === 200 && response.body.result) {
            this.reporterJobNumberName = response.body.result.NAME;
          }
        },
        response => {
          console.log("error callback");
        }
      );
      this.$http.get('/api/v1.0/client/selectStaff').then(res => {
        const {body: {code, result}} = res;
        if (code === 200) {
          rootdata.mails = result.approvalMails || [];
          rootdata.staffFields = result.staffFields;
          rootdata.uid = result.uid;
          this.selected = rootdata.staffFields[0].uid;
          this.fold = grub({
            arr: rootdata.staffFields,
            filter: item => item.level === 2 ? {filteredItem: item} : false,
            format: filteredData => {
              const out = {};
              filteredData.forEach(({uid}) => out[uid] = false);
              return out
            }
          });
          const fieldConfigTypes = _.uniqBy(
            grub({
              arr: rootdata.staffFields,
              filter: item => item.level === 3 ? {filteredItem: item} : false,
              format: filteredData => {
                const out = [];
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
                );
                return out
              }
            })
          );
          const fieldConfigReqs = fieldConfigTypes.map(configType => {
            if (configType === 'province') {
              return this.$http.get('/api/v1.0/common/query/province');
            } else if (configType === '_depts') {
              return this.$http.get(`/api/v1.0/client/fundept/staff`)
            } else {
              return this.$http.get(`/api/v1.0/common/config/${configType}`);
            }
          });
          V.Promise.all(fieldConfigReqs).then(res => {
            fieldConfigTypes.forEach((configType, idx) => {
              const {body} = res[idx]
              if (body && body.code === 200) {
                if (configType === '_depts') {
                  this.$set(
                    this.confItems,
                    configType.toString(),
                    (result => {
                      return utils.getDE(result[0]).map(dept => {
                        dept.id = dept.uid;
                        return dept;
                      });
                    })(body.result));
                } else {
                  this.$set(this.confItems, configType.toString(), body.result);
                }
              }

            });
          }).catch(res => console.log(res.status, res.statusText, res.url));
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
              });
              const maxValueTerm = computeMaxValueTerm(part, children)
              for (let i = 0, l = maxValueTerm + 1; i < l; i++) {
                _children.push(_.cloneDeep(children))
              }
              _children.forEach((group, idx) => {
                group.forEach(field => {
                  field._configs._staffValues = function (field, idx) {
                    const values = field._configs.staffValues;
                    const setvalues = [];
                    const dftvalues = [];
                    const fieldType = field._configs.fieldType;
                    if (values.length) {
                      values.forEach(item => {
                        if (typeof (item.term) === 'string' || typeof (item.term) === 'number') {
                          if (+item.term === idx) {
                            setvalues.push(item.value);
                          }
                        }
                      });
                      if (setvalues.length > 0 && (fieldType === '7' || fieldType === '8')) {
                        let arr = [];
                        setvalues.forEach(item => {
                          let img_url = item;
                          // 创建对象
                          let img = new Image();
                          // 改变图片的src
                          img.src = img_url;
                          // 加载完成执行
                          arr.push({
                            width: img.width,
                            height: img.height,
                            url: item,
                            selected: false
                          })
                        });
                        return {
                          value: arr,
                          term: 0
                        }
                      } else if (setvalues.length > 1) {
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
              });
              if (part.isGroup) {
                group4add[part.uid] = _.cloneDeep(_children[0]);
                group4add[part.uid].forEach(field => {
                  const val = [];
                  if (+field._configs.fieldType >= 4 && +field._configs.fieldType <= 6) {
                    field._configs.staffFieldValues.forEach(option => {
                      if (option.isDefault) {
                        val.push(option.value);
                      }
                    });
                  }
                  if (+field._configs.fieldType >= 6 && +field._configs.fieldType <= 8) {
                    field._configs._staffValues = {value: val, term: 0, d: 'to copy'};
                  } else {
                    field._configs._staffValues = {value: val[0] || null, term: 0, d: 'to copy'};
                  }
                })
              }
              part._children = _children
            }
          });
          this.model.mails = rootdata.mails;
          this.model.uid = rootdata.uid;
          this.model.bodies = _.cloneDeep(tmpmodel);
//          console.log('this.model', this.model)
          this.arrangeVein();
          this.model.bodies.forEach((body, bodyIdx) => {
            body.children.forEach((part, partIdx) => {
              part._children.forEach((group, groupIdx) => {
                group.forEach((field, fieldIdx) => {
                  if (field.jname === 'province') {
                    this.makeCities(field, 1);//第二个参数判断是否是初始化加载
                  }
                  if (field.jname === 'workingFirstTime') {
                    this.computeWorkAge(field);
                  }
//                  field._mark = `${bodyIdx}-${partIdx}-${groupIdx}-${fieldIdx}`;
                });
              });
            });
          });
          Indicator.close();
        }
      });
      // ====日历组件需求开始====
      this.startDate = new Date(
        new Date().getTime() - (365 * 48 + 366 * 16) * 24 * 60 * 60 * 1000
      );
      // ====日历组件需求结束====
    },
    components: {
//      jobReporter,
      uploadImage
    }
  }
</script>

<style lang="scss">
  @import "../../assets/css/boxCard";

  #employees-wrapper {
    width: 100%;
    .vam {
      vertical-align: middle;
    }
    // 复写lable原有样式
    .YD_image_list {
      line-height: normal;
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

    .picker-items {
      display: block;
      width: 100%;
      .picker-slot {
        flex: none !important;
        display: inline-block;
      }
    }
    .myData_select {
      width: 100%;
      border: 1px solid #bfcbd9;
      color: #1f2d3d;
      border-radius: 4px;
      height: 34px;
      outline: none;
      padding-left: 10px;
      text-align: left;
      font-size: 14px;
      /*很关键：将默认的select选择框样式清除*/
      appearance: none;
      /*!*在选择框的最右侧中间显示小箭头图片*!*/
      background: url("../../assets/images/ic_xiala2x.png") no-repeat scroll right center transparent;
      background-size: 30px;
      /*为下拉小箭头留出一点位置，避免被文字覆盖*/
      padding-right: 30px;
      &:disabled {
        background-color: #eef1f6;
        border-color: #d1dbe5;
        color: #bbb;
      }
    }
    .box-card {
      border: none;
      box-shadow: none;
      margin-bottom: 35px;
    }
    .tab-wrapper {
      height: 32px;
      position: relative;
    }
    .tabs {
      position: absolute;
      bottom: -11px;
      left: 0;
    }
    .tab {
      display: block;
      height: 42px;
      line-height: 42px;
      padding: 0 1em;
      border: 1px solid #ebeef5;
      background: #fff;
      border-radius: 3px 3px 0 0;
      color: #1F2D3D;
      &:last-of-type {
        margin-left: 0.5em;
      }
      &:hover {
        color: #409eff;
        border-color: #c6e2ff;
        border-bottom-color: #ecf5ff;
        background-color: #ecf5ff;
      }
      &.on {
        color: #fff;
        border-color: #409eff;
        background-color: #409eff;
      }
    }
    .employees-func-body {
      .employees-func-part {
        border-bottom: 5px solid rgb(239, 242, 247);
        &:last-child {
          border: none;
          padding-bottom: 20px;
        }
      }

      .header-bar {
        padding: 0 20px;
        /*background: #eee;*/
        border-bottom: 1px solid #e3e3e3;
        font-size: 14px;
        .header-bar_title {
          font-weight: bold;
          font-size: 15px;
          color: #1f2d3d;
        }
        .el-col {
          height: 44px;
          line-height: 44px;
        }
        .opt {
          text-align: right;
          padding-right: 4px;
          span {
            font-size: 12px;
            color: #99a9bf;
          }
        }
        .el-checkbox {
          margin-left: 12px;
        }
      }
      .fieldset-wrapper {
        padding: 20px 20px 0;
        /*background: #eff3f7;*/
        .field-group {
          overflow: hidden;
          .group-hd {
            margin-bottom: 20px;
            background: #eff3f7;
            color: #1e2c3c;
            font-size: 15px;
            line-height: 2.5;
            padding: 0 20px;
            width: 100%;
            .add {
              margin-left: 1em;
              font-size: 12px;
            }
            .del {
              margin-left: 1em;
              font-size: 12px;
            }
          }
          .job-reporter {
            display: inline-block;
          }
          .customize-uploads {
            width: 100%;
            .customize-upload {
              width: 33.33%;
              img {
                width: 100%;
              }
            }
          }
        }
        .field-group:nth-of-type(n + 2) {
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
        .text-form-item {
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
            width: 78%;
          }
          .mail-x {
            width: 20%;
          }
        }
        .el-checkbox-group {
          display: inline-block;
        }
      }
    }
    .el-card__body {
      padding: 0;
    }
    .el-card__header {
      height: 44px;
    }
    .el-form-item__label {
      font-weight: 900;
      font-size: 14px;
      color: #457aa3;
    }
    a {
      text-decoration: none;
    }
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
    .el-form-item__error{
      position: static !important;
    }
  }
</style>
