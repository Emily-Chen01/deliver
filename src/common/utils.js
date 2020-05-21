let getFileExt = file => {
    let arr = file.name.split('.');
    if (arr.length < 2) {
      return '';
    }
    return arr[arr.length - 1].toLowerCase();
  };
  
  let isImage = file => {
    // console.log('t', ext, '-jpg-jpeg-png-'.indexOf('-' + ext + '-') > -1);
    return '-jpg-jpeg-png-'.indexOf('-' + getFileExt(file) + '-') > -1;
  };
  
  let isDoc = file => {
    return '-doc-docx-pdf-'.indexOf('-' + getFileExt(file) + '-') > -1;
  };
  
  let isContract = file => {
    return '-doc-docx-pdf-jpg-jpeg-png-'.indexOf('-' + getFileExt(file) + '-') > -1;
  }
  
  let isExcel = file => {
    return '-xls-xlsx-'.indexOf('-' + getFileExt(file) + '-') > -1;
  }
  
  let isInSize = (file, size) => {
    if (!size) size = 2;    
    // console.log('t', file.size / 1024 / 1024 < size);
    return file.size / 1024 / 1024 < size;
  };

  export default {
    isImage,
    isDoc,
    isContract,
    isInSize,
    isExcel,
  }