// 解析部门以及部门下的员工
function getDE(result) {
  let idx = 0;
  let arr = [];
  let run = (result) => {
    // console.log(result.children)
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
  run(result);
  return arr;
}

// 得到各种配置参数
function getConfs(res) {
  let arr = [];
  let out = {};
  let arr2Obj = function (arr) {
    let out = {};
    arr.forEach(v => {
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

  // 国家信息
  out.states = arr2Obj(arr[14]);
  out.statesOrg = arr[14];

  return out;
};

let getFileExt = file => {
  let arr = file.name.split('.');
  if (arr.length < 2) {
    return '';
  }
  return arr[arr.length - 1].toLowerCase();
};

let isImage = file => {
  return '-jpg-jpeg-png-'.indexOf('-' + getFileExt(file) + '-') > -1;
};
let isJpg = file => {
  return '-jpg-jpeg-'.indexOf('-' + getFileExt(file) + '-') > -1;
};
let isPng = file => {
  return '-png-'.indexOf('-' + getFileExt(file) + '-') > -1;
};
let isDoc = file => {
  return '-doc-docx-pdf-'.indexOf('-' + getFileExt(file) + '-') > -1;
};
let isDocx = file => {
  return '-doc-docx-'.indexOf('-' + getFileExt(file) + '-') > -1;
};
let isPdf = file => {
  return '-pdf-'.indexOf('-' + getFileExt(file) + '-') > -1;
};

let isExcel = file => {
  return '-xls-xlsx-'.indexOf('-' + getFileExt(file) + '-') > -1;
}

let isInSize = (file, size) => {
  if (!size) size = 2;
  // console.log('t', file.size / 1024 / 1024 < size);
  return file.size / 1024 / 1024 < size;
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

// cs 为所有省，c 为市 uid
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
    out[v.id] = v.name;
  });
  return out;
};

export default {
  getDE,
  getConfs,
  isImage,
  isJpg,
  isPng,
  isDoc,
  isDocx,
  isPdf,
  isInSize,
  isExcel,
  getProvinceName,
  getCityName,
  arr2Obj
}
