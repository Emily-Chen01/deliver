import _ from 'lodash'
// 解析部门以及部门下的员工
let validator = {
  rate: {
    check(rule, value, callback, source, options) {
      let val = typeof value !== 'string' ? value.toString().trim() : value.trim();
      let patt = /^(?:[1-9](?:[0-9]+)?|0)(?:\.[0-9]{1,2})?$/;
      if (rule.required && patt.test(val) && +val <= 100) {
        callback();
      } else if (!(rule.required || val.length)) {
        callback();
      } else if (val.length && patt.test(val) && +val <= 100) {
        callback();
      } else {
        callback(new Error(rule.message));
      }
    },
    msg(str) {
      return `${str}(最多2位小数，不小于0，不大于100)`;
    }
  }
};

let noopValidator = (rule, value, callback, source, options) => {
  // console.log(rule, value, source, options);
  // return true;
  callback();
};


function getDE(result) {
  let arr = [];
  let idx = 0;
  let run = result => {
    if (result.children && result.children.length) {
      idx++;
      result.children.forEach(v => {
        let r = {};
        r.name = v.name;
        r.uid = v.uid;
        r.idx = idx;
        arr.push(r);
        run(v);
      });
      idx--;
    }
  };
  if (result.children && result.children.length) {
    run(result);
  } else if (result && result.length) {
    let findAncestorDept = function (result) {
      let parents = [];
      result.forEach((r1, i1) => {
        let hasChildren = false;
        let hasParent = false;
        result.forEach((r2, i2) => {
          if (i1 !== i2) {
            if (r1.uid === r2.parentId) {
              hasChildren = true;
            }
            if (r1.parentId === r2.uid) {
              hasParent = true;
            }
          }
        });
        if (!hasParent) {
          parents.push({
            name: r1.name,
            uid: r1.uid,
            children: []
          });
        }
      });
      return parents;
    };
    let parents = findAncestorDept(result);
    let makeChildrenDept = function (parent) {
      if (parent.children.length) {
        parent.children.forEach(child => {
          for (let i = 0, l = result.length; i < l; i++) {
            if (child.uid === result[i].parentId) {
              child.children.push({
                name: result[i].name,
                uid: result[i].uid,
                // idx: child.idx + 1,
                children: []
              });
            }
          }
          makeChildrenDept(child);
        });
      }
    };
    makeChildrenDept({children: parents});
    run({children: parents});
  }
  return arr;
}

// 得到各种配置参数
function getConfs(res) {
  let arr = [];
  let out = {};
  let arr2Obj = function (arr) {
    let out = {};
    arr && arr.forEach(v => {
      out[v.id] = v.name;
    });
    return out;
  };
  res.forEach(v => {
    arr.push(v.body.result);
  });

  // 性别
  out.gender = arr2Obj(arr[0]);
  out.genderOrg = arr[0];

  // 学历类型
  out.diplomaType = arr2Obj(arr[1]);
  out.diplomaTypeOrg = arr[1];

  // 户口类型
  out.typeOfDemicile = arr2Obj(arr[2]);
  out.typeOfDemicileOrg = arr[2];

  // 婚姻状态
  out.maritalStatus = arr2Obj(arr[3]);
  out.maritalStatusOrg = arr[3];

  // 政治面貌
  out.politicsStatus = arr2Obj(arr[4]);
  out.politicsStatusOrg = arr[4];

  // 国籍
  out.nativePlace = arr2Obj(arr[5]);
  out.nativePlaceOrg = arr[5];

  // 员工状态
  out.staffStatus = arr2Obj(arr[6]);
  out.staffStatusOrg = arr[6];

  // 合同类型
  out.contractType = arr2Obj(arr[7]);
  out.contractTypeOrg = arr[7];

  // 银行名称
  out.bankName = arr2Obj(arr[8]);
  out.bankNameOrg = arr[8];

  // 最高学历
  out.maxinumDeucaLevel = arr2Obj(arr[9]);
  out.maxinumDeucaLevelOrg = arr[9];

  // 试用期
  out.probation = arr2Obj(arr[10]);
  out.probationOrg = arr[10];

  // 民族
  out.nation = arr2Obj(arr[11]);
  out.nationOrg = arr[11];

  // 出勤规则
  out.attendRules = arr2Obj(arr[12]);
  out.attendRulesOrg = arr[12];

  // 计薪方式
  out.salaryModes = arr2Obj(arr[13]);
  out.salaryModesOrg = arr[13];

  return out;
};

let getFileExt = file => {
  let arr = file.name.split('.');
  if (arr.length < 2) {
    return '';
  }
  return arr[arr.length - 1].toLowerCase();
};

let isImage = (file, type) => {
  console.log(356, file, type)
  if (type) {
    return type.indexOf('-' + getFileExt(file) + '-') > -1;
  } else {
    return '-jpg-jpeg-png-JPG-JPEG-PNG-'.indexOf('-' + getFileExt(file) + '-') > -1;
  }
  // console.log('t', ext, '-jpg-jpeg-png-'.indexOf('-' + ext + '-') > -1);
};

let isDoc = (file, type) => {
  if (type) {
    return type.indexOf('-' + getFileExt(file) + '-') > -1;
  } else {
    return '-doc-docx-pdf-DOC-DOCX-PDF-'.indexOf('-' + getFileExt(file) + '-') > -1;
  }
};

let isContract = file => {
  return '-doc-docx-pdf-jpg-jpeg-DOC-DOCX-PDF-JPG-JPEG-'.indexOf('-' + getFileExt(file) + '-') > -1;
}

let isExcel = file => {
  return '-xls-xlsx-XLS-XLSX-'.indexOf('-' + getFileExt(file) + '-') > -1;
}

let isInSize = (file, size) => {
  if (!size) size = 2;
  // console.log('t', file.size / 1024 / 1024 < size);
  return file.size / 1024 / 1024 < size;
};
let isImages = (file, item) => {
  return item.indexOf("-" + getFileExt(file) + "-") > -1;
};
let isDocs = (file, item) => {
  return item.indexOf("-" + getFileExt(file) + "-") > -1;
};

// 数据结构很清晰简单，暂不实现
let getProvinces = () => {

};

// 数据结构很清晰简单，暂不实现
let getCities = () => {

};

// ps 为所有省，p 为省 uid
let getProvinceName = (ps, p) => {
  let out = '';
  ps.forEach(v => {
    if (v.uid === p) {
      out = v.name;
      return false;
    }
  });
  return out;
};

// cs 为所有市，c 为市 uid
let getCityName = (cs, c) => {
  let out = '';
  cs.forEach(v => {
    if (v.uid === c) {
      out = v.name;
      return false;
    }
  });
  return out;
};

// 参数 array to object
let arr2Obj = function (arr) {
  let out = {};
  arr.forEach(v => {
    out[v.id.toString()] = v.name;
  });
  return out;
};

let customizeFieldTypes = [
  {uid: 1, name: '文本'},
  {uid: 2, name: '日期'},
  {uid: 3, name: '纯数字'},
  {uid: 4, name: '列表'},
  {uid: 5, name: '单选框'},
  {uid: 6, name: '多选框'},
  {uid: 7, name: '图片上传'},
  {uid: 8, name: '文件上传'}
];

let textOptions = [
  {uid: 1, name: '中文'},
  {uid: 2, name: '英文'},
  {uid: 3, name: '数字'},
  {uid: 4, name: '常用标点/符号'}
];

let picFormats = [
  {uid: 1, name: 'jpg(jpeg)'},
  {uid: 2, name: 'png'},
  {uid: 3, name: 'gif'},
];

let picFormatsMap = {
  '1': 'jpg(jpeg)',
  '2': 'png',
  '3': 'gif'
};

let picPatt = {
  '1': 'jpg-jpeg',
  '2': 'png',
  '3': 'gif'
};

let docFormats = [
  {uid: 1, name: 'doc(docx)'},
  {uid: 2, name: 'pdf'},
  {uid: 3, name: 'txt'},
  {uid: 4, name: 'xls(xlsx)'},
  {uid: 5, name: 'ppt(pptx)'},
  {uid: 6, name: 'zip(rar)'},
];

let docFormatsMap = {
  '1': 'doc(docx)',
  '2': 'pdf',
  '3': 'txt',
  '4': 'xls(xlsx)',
  '5': 'ppt(pptx)',
  '6': 'zip(rar)'
};

let docPatt = {
  '1': 'doc-docx',
  '2': 'pdf',
  '3': 'txt',
  '4': 'xls-xlsx',
  '5': 'ppt-pptx',
  '6': 'zip-rar'
};

let makeIsCustomize = function (patt) {
  return function (file, item) {
    let arr = [];
    item.pictureTypes.sort().forEach(item => {
      arr.push(patt[item.toString()]);
    });

    return (`-${arr.join('-')}-`).indexOf(`-${getFileExt(file)}-`) > -1;
  };
};

let isCustomizeImage = makeIsCustomize(picPatt);

let isCustomizeDoc = makeIsCustomize(docPatt);

let makeUploadOk = function (item) {
  return function (res, file) {
    if (res.code === 200) {
      this.model[item.uid].push(res.result);
    }
  }.bind(this);
};

let makeBeforePic = function (item) {
  return function (file) {
    let isImage = isCustomizeImage(file, item);
    let inSize = isInSize(file, item.sizeLimit / 1000);

    if (isImage && inSize) {
      this.customizeUploads[item.uid] = false;
      return true;
    } else {
      this.customizeUploads[item.uid] = true;
      return false;
    }
  }.bind(this);
};

let makeBeforeDoc = function (item) {
  return function (file) {
    let isDoc = isCustomizeDoc(file, item);
    let inSize = isInSize(file, item.sizeLimit / 1000);

    if (isDoc && inSize) {
      this.customizeUploads[item.uid] = false;
      return true;
    } else {
      this.customizeUploads[item.uid] = true;
      return false;
    }
  }.bind(this);
};

let makeRmvUpload = function (item, idx) {
  this.model[item.uid].splice(idx, 1);
};

let makeCustomizeUploadsDesc = function (item) {
  function makeFormats(item) {
    let type = item.fieldType;
    let desc = function (map) {
      let out = [];
      item.pictureTypes.sort().forEach(item => {
        out.push(map[item.toString()]);
      });
      return out.join(' 或 ');
    }
    if (type === 7) {
      return desc(picFormatsMap);
    } else if (type === 8) {
      return desc(docFormatsMap);
    }
  }

  let type = item.fieldType;
  if (type === 7) {
    return `请上传正确的${item.remark}图片(格式为 ${makeFormats(item)}，单个图片体积小于 ${item.sizeLimit}KB，图片最多 ${item.numberLimit} 个)`;
  } else if (type === 8) {
    return `请上传正确的${item.remark}文档(格式为 ${makeFormats(item)}，单个文档体积小于 ${item.sizeLimit}KB，文档最多 ${item.numberLimit} 个)`;
  }
};

let isFormatImg = function (url) {
  return function (arr) {
      let out = [];
      arr.forEach(item => {
        out.push(picPatt[item.uid.toString()]);
      });
      return `-${out.join('-')}-`;
    }(picFormats).indexOf('-' + getFileExt({name: url}) + '-') > -1;
};

let getExtType = function (url) {
  let ext = getFileExt({name: url});
  if (ext.indexOf('doc') > -1) {
    return 'fa fa-file-word-o';
  } else if (ext.indexOf('pdf') > -1) {
    return 'fa fa-file-pdf-o';
  } else if (ext.indexOf('xls') > -1) {
    return 'fa fa-file-excel-o';
  } else if (ext.indexOf('ppt') > -1) {
    return 'fa fa-file-powerpoint-o';
  } else if (ext.indexOf('txt') > -1) {
    return 'fa fa-file-text-o';
  } else if (ext.indexOf('zip') > -1 || ext.indexOf('rar') > -1) {
    return 'fa fa-file-archive-o';
  }
};

const textPattern = {
  '1': /^[\u4e00-\u9fa5]+$/,
  '2': /^[A-Za-z]+$/,
  '3': /^\d+$/,
  '4': /^[|\[\],.?'"\(\)+\-_*\/\\&\$#^@!%~`<>:;={}\s：；？，。·！￥……（）｛｝【】、《》‘’“”『』——]+$/,
  '5': /^[\u4e00-\u9fa5A-Za-z.· {}]{2,32}$/,
  '12': /^[\u4e00-\u9fa5A-Za-z]+$/,
  '13': /^[\u4e00-\u9fa5\d]+$/,
  '14': /^[\u4e00-\u9fa5|\[\],.?'"\(\)+\-_*\/\\&\$#^@!%~`<>:;={}\s：；？，。·！￥……（）｛｝【】、《》‘’“”『』——]+$/,
  '23': /^[A-Za-z\d]+$/,
  '24': /^[A-Za-z|\[\],.?'"\(\)+\-_*\/\\&\$#^@!%~`<>:;={}\s：；？，。·！￥……（）｛｝【】、《》‘’“”『』——]+$/,
  '34': /^[\d|\[\],.?'"\(\)+\-_*\/\\&\$#^@!%~`<>:;={}\s：；？，。·！￥……（）｛｝【】、《》‘’“”『』——]+$/,
  '123': /^[\u4e00-\u9fa5A-Za-z\d]+$/,
  '124': /^[\u4e00-\u9fa5A-Za-z|\[\],.?'"\(\)+\-_*\/\\&\$#^@!%~`<>:;={}\s：；？，。·！￥……（）｛｝【】、《》‘’“”『』——]+$/,
  '134': /^[\u4e00-\u9fa5\d|\[\],.?'"\(\)+\-_*\/\\&\$#^@!%~`<>:;={}\s：；？，。·！￥……（）｛｝【】、《》‘’“”『』——]+$/,
  '234': /^[A-Za-z\d|\[\],.?'"\(\)+\-_*\/\\&\$#^@!%~`<>:;={}\s：；？，。·！￥……（）｛｝【】、《》‘’“”『』——]+$/,
  '1234': /^[\u4e00-\u9fa5A-Za-z\d|\[\],.?'"\(\)+\-_*\/\\&\$#^@!%~`<>:;={}\s：；？，。·！￥……（）｛｝【】、《》‘’“”『』——]+$/
};

const idNumberPattern = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/;

let makeRules = function (item) {
  // pending
  function getPattern(item) {
    /*
     1 - 中文
     2 - 英文
     3 - 数字
     4 - 标点符号
     */
    let patt = {
      '1': /^[\u4e00-\u9fa5]+$/,
      '2': /^[A-Za-z]+$/,
      '3': /^\d+$/,
      '4': /^[|\[\],.?'"\(\)+\-_*\/\\&\$#^@!%~`<>:;={}\s：；？，。·！￥……（）｛｝【】、《》‘’“”『』——]+$/,
      '5': /^[\u4e00-\u9fa5A-Za-z.· {}]{2,32}$/,
      '12': /^[\u4e00-\u9fa5A-Za-z]+$/,
      '13': /^[\u4e00-\u9fa5\d]+$/,
      '14': /^[\u4e00-\u9fa5|\[\],.?'"\(\)+\-_*\/\\&\$#^@!%~`<>:;={}\s：；？，。·！￥……（）｛｝【】、《》‘’“”『』——]+$/,
      '23': /^[A-Za-z\d]+$/,
      '24': /^[A-Za-z|\[\],.?'"\(\)+\-_*\/\\&\$#^@!%~`<>:;={}\s：；？，。·！￥……（）｛｝【】、《》‘’“”『』——]+$/,
      '34': /^[\d|\[\],.?'"\(\)+\-_*\/\\&\$#^@!%~`<>:;={}\s：；？，。·！￥……（）｛｝【】、《》‘’“”『』——]+$/,
      '123': /^[\u4e00-\u9fa5A-Za-z\d]+$/,
      '124': /^[\u4e00-\u9fa5A-Za-z|\[\],.?'"\(\)+\-_*\/\\&\$#^@!%~`<>:;={}\s：；？，。·！￥……（）｛｝【】、《》‘’“”『』——]+$/,
      '134': /^[\u4e00-\u9fa5\d|\[\],.?'"\(\)+\-_*\/\\&\$#^@!%~`<>:;={}\s：；？，。·！￥……（）｛｝【】、《》‘’“”『』——]+$/,
      '234': /^[A-Za-z\d|\[\],.?'"\(\)+\-_*\/\\&\$#^@!%~`<>:;={}\s：；？，。·！￥……（）｛｝【】、《》‘’“”『』——]+$/,
      '1234': /^[\u4e00-\u9fa5A-Za-z\d|\[\],.?'"\(\)+\-_*\/\\&\$#^@!%~`<>:;={}\s：；？，。·！￥……（）｛｝【】、《》‘’“”『』——]+$/
    };

    let type = item.fieldType;
    if (type === 1) {
      return patt[item.conditions.sort().join('')];
    } else if (type === 3) {
      return /^[1-9][0-9]*$/;
    }

  }

  function conditions2desc(item) {
    let conditions = {
      '1': '中文',
      '2': '英文',
      '3': '数字',
      '4': '常用标点/符号'
    };

    return function (arr) {
      let out = [];
      arr.forEach(item => {
        out.push(conditions[item.toString()]);
      });
      if (out.length) {
        return '，可为' + out.join('或');
      } else {
        return '';
      }
    }(item.conditions);
  }

  switch (item.fieldType) {
    case 1:
      let desc = function (arr) {

      }(item.conditions);
      return [
        {
          message: `请输入正确的${item.remark}(最多${item.characterLimit}个字符${conditions2desc(item)})`,
          pattern: getPattern(item),
          trigger: 'blur'
        },
        {
          message: `请输入正确的${item.remark}(最多${item.characterLimit}个字符${conditions2desc(item)})`,
          validator: function (rule, value, callback, source, options) {
            if ((value || '').length <= item.characterLimit) {
              callback();
            } else {
              callback(new Error(rule.message));
            }
          },
          trigger: 'blur'
        }
      ];
      break;
    case 2:
      return [
        {type: 'date', message: `请选择${item.remark}`},
      ];
      break;
    case 3:
      return [
        {
          message: `请输入正确的${item.remark}(必须大于0，小于或等于${Math.pow(10, item.characterLimit) - 1})`,
          pattern: getPattern(item),
          trigger: 'blur'
        },
        {
          message: `请输入正确的${item.remark}(必须大于0，小于或等于${Math.pow(10, item.characterLimit) - 1})`,
          validator: function (rule, value, callback, source, options) {
            if (!value) {
              callback();
              return;
            }
            let n = +value;
            if (n > 0 && n <= (Math.pow(10, item.characterLimit) - 1)) {
              callback();
            } else {
              callback(new Error(rule.message));
            }
          },
          trigger: 'blur'
        }
      ];
      break;
    case 4:
      return [
        {message: `请选择${item.remark}`}
      ];
      break;
  }
  return [];
  /*
   字段类型：
   [
   {uid: 1, name: '文本'},
   {uid: 2, name: '日期'},
   {uid: 3, name: '纯数字'},
   {uid: 4, name: '列表'},
   {uid: 5, name: '单选框'},
   {uid: 6, name: '多选框'},
   {uid: 7, name: '图片上传'},
   {uid: 8, name: '文件上传'}
   ]

   文本限制：
   [
   {uid: 1, name: '中文'},
   {uid: 2, name: '英文'},
   {uid: 3, name: '数字'},
   {uid: 4, name: '标点符号'}
   ]

   图片格式：
   [
   {uid: 1, name: 'jpg(jpeg)'},
   {uid: 2, name: 'png'},
   {uid: 3, name: 'gif'} // 新增
   ]

   文件格式:
   [
   {uid: 1, name: 'doc(docx)'},
   {uid: 2, name: 'pdf'},
   {uid: 3, name: 'txt'}, // 新增
   {uid: 4, name: 'xls(xlsx)'}, // 新增
   {uid: 5, name: 'ppt(pptx)'}, // 新增
   {uid: 6, name: 'zip(rar)'} // 新增
   ]
   */
};
let getPath = function (data) {
  let arr = data.split('/');
  let backValue = '';
  for (let i = 0; i < arr.length - 2; i++) {
    backValue += "../";
  }
  return backValue;
};
// 锚点,滚动方法
let scrollTop = function (dom, box) {
  let b = box.scrollTop;
  let d = dom.offsetTop;
  let s = d / 50;
  // console.log(d, b);
  if (d > b) {
    smoothDown()
  } else {
    s = (b - d) / 50;
    smoothUp()
  }
  function smoothDown() {
    if (b < d) {
      b += s;
      box.scrollTop = b;
      setTimeout(smoothDown, 10)
    } else {
      box.scrollTop = d;
    }
  }

  function smoothUp() {
    if (b > d) {
      b -= s;
      box.scrollTop = b;
      setTimeout(smoothUp, 10)
    } else {
      box.scrollTop = d;
    }
  }

  box.scrollTop = dom.offsetTop;
};
// 获取应用员工的uid
let selectedStaff = function (data) {
  let staffUid = data.map(item => {
    return item.recordUid;
  });
  return staffUid;
};

let makeSrc = function ({
                          group = '',
                          type = '',
                          timestart = '',
                          timeend = '',
                          pointstart = '',
                          pointend = '',
                          mobile = ''
                        } = {}) {
  let root = '/'/*  && '/static/' */;
  return `${root}manager.html?group=${group/*  && '' */}&type=${type}&timestart=${timestart}&timeend=${timeend}&pointstart=${pointstart}&pointend=${pointend}&mobile=${mobile}`;
};

let serviceid = function () {
  if (location.href.indexOf('hisalari.com') > -1) {
    return '161796';
  } else {
    return '161792';
  }
}();

let isDeptTreeWalk = function (funCode) {
  return '-waitEntry-task-approval-datacente-notice-'.indexOf(funCode) > -1;
}

const grub = function grub({arr, descendantName = 'children', filter, format}) {
  let filteredData = []
  const _grub = function (arr) {
    for (let i = 0, l = arr.length; i < l; i++) {
      let {filteredItem} = filter(arr[i])
      if (filteredItem) {
        filteredData.push(filteredItem)
      } else {
        _grub(arr[i][descendantName])
      }
    }
  }
  _grub(arr)
  return format(filteredData)
}

const modifyNode = function modifyNode({arr, descendantName = 'children', condition, process}) {
  if (_) {
    arr = _.cloneDeep(arr)
  }
  function _modifyNode(arr) {
    arr.forEach((item, idx) => {
      if (condition(item)) {
        process(item)
      } else if (item[descendantName]) {
        _modifyNode(item[descendantName])
      }
    })
  }

  _modifyNode(arr);
  return arr;
}


const makeIsSomethingFunc = function makeIsSomethingFunc(patt) {
  return function (file, extCodes) {
    let arr = [];
    extCodes.sort().forEach(code => {
      arr.push(patt[code.toString()]);
    });
    console.log(`-${arr.join('-')}-`, `-${getFileExt(file)}-`)
    return (`-${arr.join('-')}-`).indexOf(`-${getFileExt(file)}-`) > -1;
  };
};

const isImg = makeIsSomethingFunc(picPatt);

// const makeUploadBeforeImgCallback = function makeUploadBeforeImgCallback(bodyIdx, partIdx, groupIdx, fieldIdx, configs) {
const makeUploadBeforeImgCallback = function makeUploadBeforeImgCallback(configs) {
  return file => {
    let isImage = isImg(file, configs.conditions);
    let inSize = isInSize(file, configs.numberLimit / 1000);

    // this.$nextTick(function() {
    //   this.$refs.fm.validateField(`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`);
    // })
    setTimeout(() => {
      this.$refs.fm.validateField(`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`);
    }, 2000)
    if (isImage && inSize) {
      console.log('img ok')
      this.$refs.fm.validateField(`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`);
      console.log('true')
      this.$set(this.uploadError, `${bodyIdx}-${partIdx}-${groupIdx}-${fieldIdx}`, false)
      return true;
    } else {
      console.log('img wrong')
      this.$refs.fm.validateField(`bodies.${bodyIdx}.children.${partIdx}._children.${groupIdx}.${fieldIdx}._configs._staffValues.value`);
      console.log('false')
      this.$set(this.uploadError, `${bodyIdx}-${partIdx}-${groupIdx}-${fieldIdx}`, true)
      return false;
    }
  };
};

const isDocument = makeIsSomethingFunc(docPatt)

const makeUploadBeforeDocCallback = function makeUploadBeforeDocCallback(configs) {
  return file => {
    let isDoc = isDocument(file, configs.conditions);
    let inSize = isInSize(file, configs.numberLimit / 1000);

    if (isDoc && inSize) {
      console.log('doc ok')
      this.$set(this.uploadError, `${bodyIdx}-${partIdx}-${groupIdx}-${fieldIdx}`, false)
      return true;
    } else {
      console.log('doc wrong')
      this.$set(this.uploadError, `${bodyIdx}-${partIdx}-${groupIdx}-${fieldIdx}`, true)
      return false;
    }
  };
}

const makeUploadOkCallback = function makeUploadOkCallback(bodyIdx, partIdx, groupIdx, fieldIdx) {
  return res => {
    if (res.code === 200) {
      this.model.bodies[bodyIdx].children[partIdx]._children[groupIdx][fieldIdx]._configs._staffValues.value.push(res.result);
    }
  }
};

const makeRemoveUploadItem = function makeRemoveUploadItem(bodyIdx, partIdx, groupIdx, fieldIdx, imgIdx) {
  this.model.bodies[bodyIdx].children[partIdx]._children[groupIdx][fieldIdx]._configs._staffValues.value.splice(imgIdx, 1);
};

const makeValidator = function makeValidator(field, dpds) {
  const {_configs: configs} = field

  function parseString2RegExp(regexpstring) {
    return new RegExp(regexpstring);
  }

  return function madeValidator(rule, value, callback, source, options) {
    let pattern, val, vall, minl, maxl, condition;
    switch (configs.fieldType) {
      case '9':
        pattern = parseString2RegExp(configs.jsValidexp);
        val = typeof value === 'string' ? value.trim() : '';
        vall = val.length;
        minl = configs.fieldMinSize || 1;
        maxl = configs.fieldSize;
        if (!(val || rule.required)) {
          callback();
        } else {
          if (pattern.test(val) && vall >= minl && vall <= maxl) {
            callback();
          } else {
            callback(new Error(rule.message))
          }
        }
        break;

      case '15':
        pattern = parseString2RegExp(configs.jsValidexp);
        val = typeof value === 'string' ? value.trim() : '';
        vall = val.length;
        minl = configs.fieldMinSize || 1;
        maxl = configs.fieldSize;

        if (!(val || rule.required)) {
          callback();
        } else {
          if (pattern.test(val) && vall >= minl && vall <= maxl) {
            callback();
          } else {
            callback(new Error(rule.message))
          }
        }
        break;

      case '10':
        pattern = parseString2RegExp(configs.jsValidexp);
        val = typeof value === 'string' ? value.trim() : '';

        if (!(val || rule.required)) {
          callback();
        } else {
          if (pattern.test(val)) {
            callback();
          } else {
            callback(new Error(rule.message))
          }
        }

        break;

      case '1':
        val = typeof value === 'string' ? value.trim() : '';
        pattern = idNumberPattern;
        vall = val.length;
        minl = configs.fieldMinSize || 1;
        maxl = configs.fieldSize || 32;
        condition = configs.conditions.join('');

        if (!(val || rule.required)) {
          callback();
        } else {
          if (dpds && dpds.length) {
            dpds.forEach(dpdField => {
              if (
                field._dpd4show === dpdField.jname
                && field._mark.split('-')[2] === dpdField._mark.split('-')[2]
                && field.jname === 'idNumber'
                && dpdField._configs._staffValues.value === '1'
              ) {
                if (pattern.test(val)) {
                  callback();
                } else {
                  rule.message = '请输入正确的身份证号码';
                  callback(new Error(rule.message))
                }
              } else {
                if (
                  textPattern[condition].test(val)
                  && vall >= minl
                  && vall <= maxl
                ) {
                  callback();
                } else {
                  callback(new Error(rule.message));
                }
              }
            });
          } else {
            if (
              textPattern[condition].test(val)
              && vall >= minl
              && vall <= maxl
            ) {
              callback();
            } else {
              callback(new Error(rule.message));
            }
          }
        }

        break;

      case '3':
        condition = configs.conditions.join('');
        if(field.isDefined && condition === '3') {
          pattern = /^(?:[1-9]\d*|\d)(?:\.\d)?$/;
        }else {
          pattern = parseString2RegExp(configs.jsValidexp);
        }
        // pattern = parseString2RegExp(configs.jsValidexp);
        val = typeof value === 'string' ? value.trim() : '';
        vall = val.length;
        minl = configs.fieldMinSize || 1;
        maxl = configs.fieldSize || 32;

        if (!(val || rule.required)) {
          callback();
        } else {
          if (pattern.test(val) && vall >= minl && vall <= maxl) {
            callback();
          } else {
            callback(new Error(rule.message));
          }
        }

        break;

      case '11':
        pattern = parseString2RegExp(configs.jsValidexp);
        val = typeof value === 'string' ? value.trim() : '';

        if (!(val || rule.required)) {
          callback();
        } else {
          if (pattern.test(val)) {
            callback();
          } else {
            callback(new Error(rule.message))
          }
        }
        break;

      // case '7':
      //   val = value || [];
      //   vall = val.length;
      //   minl = configs.fieldMinSize || 1;
      //   maxl = configs.fieldSize;
      //   console.log('val, vall, minl, maxl', val, vall, minl, maxl)
      //   if(vall >= minl && vall <= maxl) {
      //     callback();
      //   }else {
      //     callback(new Error(rule.message))
      //   }
      // break;

      case '12':
        pattern = parseString2RegExp(configs.jsValidexp);
        val = typeof value === 'string' ? value.trim() : '';

        if (!(val || rule.required)) {
          callback();
        } else {
          if (pattern.test(val)) {
            callback();
          } else {
            callback(new Error(rule.message))
          }
        }

        break;

      case '13':
        pattern = parseString2RegExp(configs.jsValidexp);
        val = typeof value === 'string' ? value.trim() : '';
        vall = val.length;
        minl = configs.fieldMinSize || 1;
        maxl = configs.fieldSize;

        if (!(val || rule.required)) {
          callback();
        } else {
          if (pattern.test(val) && vall >= minl && vall <= maxl) {
            callback();
          } else {
            callback(new Error(rule.message))
          }
        }

        break;

      case '14':
        pattern = parseString2RegExp(configs.jsValidexp);
        val = typeof value === 'string' ? value.trim() : '';

        if (!(val || rule.required)) {
          callback();
        } else {
          if (pattern.test(val)) {
            callback();
          } else {
            callback(new Error(rule.message))
          }
        }

        break;

      case '15':
        pattern = parseString2RegExp(configs.jsValidexp);
        val = typeof value === 'string' ? value.trim() : '';
        vall = val.length;
        minl = configs.fieldMinSize || 1;
        maxl = configs.fieldSize;

        if (!(val || rule.required)) {
          callback();
        } else {
          if (pattern.test(val) && vall >= minl && vall <= maxl) {
            callback();
          } else {
            callback(new Error(rule.message))
          }
        }

        break;

    }

  }
}

export default {
  getDE,
  getConfs,
  isImage,
  isDoc,
  isContract,
  isInSize,
  isExcel,
  getFileExt,
  getProvinceName,
  getCityName,
  arr2Obj,
  isImages,
  isDocs,
  validator,

  customize: {
    customizeFieldTypes, // use
    textOptions, // use
    picFormats, // use
    docFormats, // use

    makeUploadOk,
    makeBeforePic,
    makeBeforeDoc,
    makeRmvUpload,
    makeCustomizeUploadsDesc,
    makeRules
  },
  isFormatImg,
  getExtType,
  getPath,
  scrollTop,
  selectedStaff,
  makeSrc,
  serviceid,
  isDeptTreeWalk,
  grub,
  modifyNode,
  makeUploadOkCallback,
  makeUploadBeforeImgCallback,
  makeUploadBeforeDocCallback,
  makeRemoveUploadItem,
  textPattern,
  idNumberPattern,
  makeValidator,
  makeIsSomethingFunc
}
