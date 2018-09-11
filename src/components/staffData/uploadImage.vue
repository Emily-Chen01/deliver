<template>
  <div>
    <div style="display: inline-block">
      <el-upload action="/api/v1.0/client/upload" name="files" :show-file-list="false" :headers="tokenHeader"
                 :on-success="staffPhoUrlOk"
                 :before-upload="beforeStaffPhoUrl">
        <el-button type="primary" size="small">
        <span>
          <i class="el-icon-upload"></i>
          <span v-text="'上传'+title"></span>
        </span>
        </el-button>
      </el-upload>
    </div>
    <slot name="button"></slot>
    <p class="uploadErrorTip" v-if="uploadErrFlag && type==='image'">
      请上传正确的照片(格式为 {{errType}}，体积小于 {{parseInt(configs.numberLimit / 1000)}} 兆，图片不超过{{configs.fieldSize}}个)</p>
    <p class="uploadErrorTip" v-if="uploadErrFlag && type==='file'">
      请上传正确的文件(格式为 {{errType}}，体积小于 {{parseInt(configs.numberLimit / 1000)}} 兆，图片不超过{{configs.fieldSize}}个)</p>
  </div>
</template>

<script>
  import utils from "@/components/common/utils";
  export default {
    props: ["child", 'title', 'position', 'configs', 'type'],
    data() {
      return {
        tokenHeader: {
          charset: "utf-8",
          openId: this.getCookie("openId")
        },
        uploadErrFlag: false,
        errType: '',
        uploadErrFormats: "",
        picFormatsMap: {
          "1": "jpg(jpeg)",
          "2": "png",
          "3": "gif"
        },
        picPatt: {
          "1": "jpg-jpeg-JPG-JPEG",
          "2": "png-PNG",
          "3": "gif-GIF"
        },
        docFormatsMap: {
          "1": "doc(docx)",
          "2": "pdf",
          "3": "txt",
          "4": "xls(xlsx)",
          "5": "ppt(pptx)",
          "6": "zip(rar)"
        },
        docPatt: {
          "1": "doc-docx-DOC-DOCX",
          "2": "pdf-PDF",
          "3": "txt-TXT",
          "4": "xls-xlsx-XLS-XLSX",
          "5": "ppt-pptx-PPT-PPTX",
          "6": "zip-rar-ZIP-RAR"
        }
      };
    },
    methods: {
      staffPhoUrlOk(res, file) {
        if (res.code === 200) {
          this.$emit("update", {url: res.result, position: this.position});
        }
      },
      beforeStaffPhoUrl(file) {
        console.log('wertyu', this.configs)
        let errType = '';
        let backValue;
        let condition = null;
        let isFieldSize = this.configs._staffValues.value.length < this.configs.fieldSize;
        if (this.configs.conditions && this.configs.conditions.length) {
          condition = '-'
        }
        let isInSize = utils.isInSize(file, this.configs.numberLimit / 1000);
        if (this.type === 'image') {
          this.configs.conditions.forEach((item, i) => {
            condition += this.picPatt[item] + '-';
            if (i !== 0) {
              errType += '、' + this.picFormatsMap[item];
            } else {
              errType = this.picFormatsMap[item];
            }
          });
          let isImage = utils.isImage(file, condition);
          if (isImage && isInSize && isFieldSize) {
            backValue = true;
          } else {
            backValue = false;
          }
        } else if (this.type === 'file') {
          this.configs.conditions.forEach((item, i) => {
            condition += this.docPatt[item] + '-';
            if (i !== 0) {
              errType += '、' + this.docFormatsMap[item];
            } else {
              errType = this.docFormatsMap[item];
            }
          });
          let isDoc = utils.isDoc(file, condition);
          if (isDoc && isInSize && isFieldSize) {
            backValue = true;
          } else {
            backValue = false;
          }
        } else {
          backValue = false;
        }
        if (backValue) {
          this.uploadErrFlag = false;
        } else {
          this.uploadErrFlag = true;
        }
        this.errType = errType;
        return backValue;
      }

    }
  };
</script>
<style scoped lang="scss">
  .uploadErrorTip {
    color: #ff4949;
    font-size: 12px;
    margin-top: 0;
    margin-bottom: 0;
    line-height: 1.3;
  }
</style>
