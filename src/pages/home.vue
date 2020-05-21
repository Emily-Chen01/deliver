<template>
  <div>
    <div class="home-page">
      <div v-show="homeShow">
        <div class="title">{{title || ''}}</div>
        <div class="subtitle">{{subtitle || ''}}</div>
        <div class="mode write" @click="manually">
          <div class="mode-text">手动录入</div>
          <img src="../assets/img/mode_01.png" alt />
        </div>
        <div class="mode upload">
          <van-uploader
            accept="file"
            :before-read="beforeRead"
            :after-read="afterRead"
            multiple
            :max-count="1"
          >
            <div class="mode-text">上传附件</div>
            <img src="../assets/img/mode_02.png" alt />
          </van-uploader>
        </div>
        <div class="msg">提醒：请尽量选择常用文件格式简历；选择图片简历上 传时，请选择清晰且正向的照片，避免影响解析准确性</div>
        <div class="logo">
          <img src="../assets/img/logo.png" alt />
        </div>
        <van-overlay :show="show">
          <div class="wrapper" @click.stop>
            <van-loading size="24px">上传中...</van-loading>
          </div>
          <van-loading />
        </van-overlay>
      </div>
      <div v-show="!homeShow">
        <div class="err">
            <div>
                <i class="iconfont iconcuowu"></i>
                <div>该二维码投递已关闭</div>
            </div>
        </div>
      </div>
      <van-overlay :show="pageShow">
        <div class="wrapper" @click.stop>
          <van-loading size="24px">查询中...</van-loading>
        </div>
        <van-loading />
      </van-overlay>
    </div>
  </div>
</template>

<script>
import utils from "../common/utils";
import Vue from "vue";
import { Uploader, Toast, Loading, Overlay } from "vant";
Vue.use(Uploader);
Vue.use(Loading);
Vue.use(Overlay);
export default {
  name: "home",
  data() {
    return {
      pageShow:false,
      homeShow:true,
      fileCount: 0,
      show: false,
      title: "",
      subtitle: "",
      isAttach: 0
    };
  },
  methods: {
    // 上传成功后的获取到的文件
    afterRead(file) {
      this.show = true;
      let content = file.file;
      let data = new FormData();
      data.append("file", content);
      this.$http
        .post(
          `/api/QR/SubmitByUpload?companyId=${sessionStorage.getItem(
            "companyId"
          )}&ruipinUserId=${sessionStorage.getItem("ruipinUserId")}`,
          data
        )
        .then(response => {
          let res = response.body;
          if (res.code === "200") {
            if (res.data.result) {
              Toast.success("上传成功");
              this.fileCount = 1;
            } else {
              Toast.fail(res.data.msg);
            }
          } else {
            Toast.fail("上传失败");
          }
          this.show = false;
        });
    },
    //上传之前
    beforeRead(file) {
      if (this.fileCount) {
        Toast("请勿重复上传");
        return false;
      }
      let isContract = utils.isContract(file);
      let inSize = utils.isInSize(file, 10);
      if (isContract && inSize) {
        return true;
      } else {
        Toast("格式：doc、docx、pdf、jpg、jpeg、png，不能超过10MB");
        return false;
      }
    },
    manually() {
      this.$router.push({ path: "/resume" });
    }
  },
  created() {
    this.pageShow=true
    // let companyId=427,ruipinUserId=923,templateId=50
    let companyId, ruipinUserId, templateId;
    if (window.location.href.split("?").length > 1) {
      let url = window.location.href.split("?")[1].split("&");
      url.forEach(item => {
        if (item.indexOf("companyId=") == 0) {
          companyId = parseInt(item.substring(10));
        } else if (item.indexOf("ruipinUserId=") == 0) {
          ruipinUserId = parseInt(item.substring(13));
        } else if (item.indexOf("templateId=") == 0) {
          templateId = parseInt(item.substring(11));
        }
      });
    }
    sessionStorage.setItem("companyId", companyId);
    sessionStorage.setItem("ruipinUserId", ruipinUserId);
    sessionStorage.setItem("templateId", templateId);
    this.$http
      .get(
        `/api/QR/GetQRBaseInfo?templateId=${sessionStorage.getItem(
          "templateId"
        )}`
      )
      .then(response => {
        let res = response.body;
        this.pageShow=false
        if (res.code === "200") {
          this.title = res.data.companyName;
          this.subtitle = res.data.companyInfo;
          if(res.data.status==0){
            this.homeShow=false
            return
          }else{
            this.homeShow=true
          }
          this.isAttach = res.data.isAttach;
          if (this.isAttach) {
            this.$router.push({ path: "/resume" });
          }
        }else{
          Toast("系统错误")
        }
      });
  },
  mounted() {},
  components: {}
};
</script>

<style lang="scss">
.home-page {
  width: 100vw;
  height: 100vh;
  padding: 50px;
  box-sizing: border-box;
  .err{
        div{
            width:300px;
            height:400px;
            text-align: center;
            position:absolute;
            top:50%;
            left:50%;
            margin:-180px 0 0 -150px ;
            .iconfont{
              color:orange;
              font-size:98px;
            }
            div{
                font-size: 30px;
                color: #211F22;
                margin-top:-80px;
            }
        }
    }
  .title {
    font-size: 36px;
    color: #000;
    font-weight: 700;
    margin-top: 50px;
    word-wrap:break-word;
  }
  .subtitle {
    font-size: 26px;
    color: #000;
    margin: 15px 0 50px 0;
    word-wrap:break-word;
  }
  .mode {
    width: 100%;
    height: 300px;
    border-radius: 40px;
    margin-bottom: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px;
    box-sizing: border-box;
    &.write {
      border: 1px solid #e5f4ea;
      background: #e5f4ea;
    }
    &.upload {
      border: 1px solid #e7f4ff;
      background: #e7f4ff;
    }
    .van-uploader {
      width: 100%;
      height: 100%;
      .van-uploader__wrapper {
        width: 100%;
        height: 100%;
        .van-uploader__input-wrapper {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
    img {
      width: 260px;
      height: 220px;
    }
    .mode-text {
      font-size: 40px;
      font-weight: 700;
      color: #000;
      margin-left: 47px;
    }
  }
  .msg {
    font-size: 22px;
    color: #333;
    padding: 40px 53px 40px 70px;
    line-height: 40px;
    background: #fff9eb;
    border: 1px solid #ffc378;
    border-radius: 40px;
    position: relative;
    &::before {
      content: "";
      width: 30px;
      height: 30px;
      background: url("../assets/img/attention.png") center center no-repeat;
      background-size: 30px;
      position: absolute;
      top: 43px;
      left: 40px;
    }
  }
  .logo {
    width: 100px;
    height: 20px;
    position: absolute;
    left: 50%;
    bottom: 80px;
    transform: translateX(-50%);
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>