<template>
  <div>
    <el-upload action="/api/v1.0/client/upload" name="files" :show-file-list="false" :headers="tokenHeader" :on-success="staffPhoUrlOk" :before-upload="beforeStaffPhoUrl">
      <el-button type="primary" size="small">
        <span>
          <i class="el-icon-upload"></i>
          <span v-text="'上传'+((child.type===1)?'附件':((child.type===8)?'文件':'照片'))"></span>
        </span>
      </el-button>
    </el-upload>
    <p class="uploadErrorTip" v-if="uploadErrFlag && child.type===0">
      请上传正确的照片(格式为 jpg 、jpeg 或 png，体积小于 5 兆)</p>
    <p class="uploadErrorTip" v-if="uploadErrFlag && child.type===1">
      请上传正确的文档或图片(文档格式为 doc、docx 或 pdf，图片格式为 jpg 、 jpeg 或 png，单个文档或图片体积小于 5 兆，文档最多一个，图片可以多个)</p>
    <p class="uploadErrorTip" v-if="uploadErrFlag && child.type===2">
      请上传正确的照片(格式为 jpg 、jpeg 或 png，体积小于 5 兆，图片不超过2个)</p>
    <p class="uploadErrorTip" v-if="uploadErrFlag && child.type===7">
      请上传正确的照片(格式为{{uploadErrFormats}}，体积小于 {{child.value.sizeLimit / 1000}} 兆，图片不超过{{child.value.numberLimit}}张)</p>
    <p class="uploadErrorTip" v-if="uploadErrFlag && child.type===8">
      请上传正确的文件(格式为{{uploadErrFormats}}，体积小于 {{child.value.sizeLimit / 1000}} 兆，文件不超过{{child.value.numberLimit}}个)</p>
  </div>
</template>

<script>
import utils from "@/components/utils";
export default {
  props: ["child"],
  data() {
    return {
      tokenHeader: {
        charset: "utf-8",
        openId: this.getCookie("openId")
      },
      uploadErrFlag: false,
      uploadErrFormats: "",
      picFormatsMap: {
        "1": "jpg(jpeg)",
        "2": "png",
        "3": "gif"
      },
      picPatt: {
        "1": "jpg-jpeg",
        "2": "png",
        "3": "gif"
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
        "1": "doc-docx",
        "2": "pdf",
        "3": "txt",
        "4": "xls-xlsx",
        "5": "ppt-pptx",
        "6": "zip-rar"
      }
    };
  },
  methods: {
    staffPhoUrlOk(res, file) {
      if (res.code === 200) {
        this.$emit("update", { url: res.result, info: this.child });
      }
    },
    beforeStaffPhoUrl(file) {
      let backValue;
      let isImage = utils.isImage(file);
      let isInSize = utils.isInSize(file, 5);
      let isDoc = utils.isDoc(file);
      if (this.child.type === 0) {
        backValue = isImage && isInSize;
      } else if (this.child.type === 1) {
        let hasDoc = function() {
          let flag = 0;
          this.child.value.forEach(v => {
            if (utils.isDoc({ name: v.url })) flag++;
          });
          return flag > 0;
        }.bind(this)();
        backValue = isInSize && (isImage || (!hasDoc && isDoc));
      } else if (this.child.type === 2) {
        if (this.child.value.length < 2) {
          backValue = isImage && isInSize;
        } else {
          backValue = false;
        }
      } else if (this.child.type === 7 || this.child.type === 8) {
        if (this.child.value.isDefined) {
          isInSize = utils.isInSize(file, this.child.value.sizeLimit / 1000);
          if (
            this.child.value.value.length < this.child.value.numberLimit ||
            (this.child.value.value.length === 1 &&
              !this.child.value.value[0].value)
          ) {
            if (this.child.value.fieldType === 7) {
              let arr = this.child.value.pictureType.split(",");
              let pitType = "-";
              this.uploadErrFormats = "";
              arr.forEach(item => {
                pitType = pitType + this.picPatt[item] + "-";
                this.uploadErrFormats =
                  this.uploadErrFormats + "、" + this.picFormatsMap[item];
              });
              this.uploadErrFormats = this.uploadErrFormats.substring(1);
              let isImages = utils.isImages(file, pitType);
              backValue = isImages && isInSize;
            } else if (this.child.value.fieldType === 8) {
              let arr = this.child.value.pictureType.split(",");
              let pitType = "-";
              this.uploadErrFormats = "";
              arr.forEach(item => {
                pitType = pitType + this.docPatt[item] + "-";
                this.uploadErrFormats =
                  this.uploadErrFormats + "、" + this.docFormatsMap[item];
              });
              this.uploadErrFormats = this.uploadErrFormats.substring(1);
              let isDocs = utils.isDocs(file, pitType);
              backValue = isDocs && isInSize;
            }
          } else {
            backValue = false;
          }
        } else {
          backValue = false;
        }
      }
      if (backValue) {
        this.uploadErrFlag = false;
      } else {
        this.uploadErrFlag = true;
      }
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
