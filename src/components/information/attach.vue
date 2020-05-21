<template>
    <div>
       <div class="attachInformation">
           <van-nav-bar :title="upData" left-arrow @click-left="onClickLeft"/>
            <div class="void"></div>
            <div class="data jiben">
                <van-field
                    readonly
                    clickable
                    name="picker"
                    :value="fileType"
                    label="附件类型"
                    placeholder="请选择附件类型"
                    @click="showPicker = true"
                    />
                    <van-popup v-model="showPicker" position="bottom">
                    <van-picker
                        show-toolbar
                        :columns="columns"
                        @confirm="onConfirm"
                        @cancel="showPicker = false"
                    />
                </van-popup>
                <div class="buqi" @click="showPicker = true">
                    <img src="../../assets/img/arrow.png" alt />
                </div>
            </div>
            <van-uploader
                accept="file"
                :before-read="beforeRead"
                :after-read="afterRead"
                multiple
                :max-count="1"
              >
                <van-button icon="photo" type="primary">上传文件</van-button>
            </van-uploader>
            <van-overlay :show="show" @click="show = false">
                <div class="wrapper" @click.stop>
                <van-loading size="24px">上传中...</van-loading>
                </div>
                <van-loading />
            </van-overlay>
        </div> 
    </div>
</template>

<script>
import Vue from 'vue';
import utils from "../../common/utils";
import { Uploader,Toast,Loading,Overlay } from 'vant';
Vue.use(Uploader);
Vue.use(Toast);
Vue.use(Loading);
Vue.use(Overlay);
export default {
    data() {
        return {
            upData: this.$route.query.upData,
            fileType: '',
            columns: ['简历原件', '其他'],
            showPicker: false,
            show:false
        }
    },
    methods:{
        // 上传成功后的获取到的图片地址
        afterRead(file) {
            this.show = true;
            let content = file.file;
            let data = new FormData();
            data.append("file", content);
            this.$http
                .post(`/api/QR/UploadFile?userId=${sessionStorage.getItem('userId')}&fileType=${this.fileType}`, data)
                .then(response => {
                    let res = response.body;
                    if (res.code === "200") {
                        this.show = false;
                        document.body.style.overflow = "auto";
                        // Toast.success("上传成功");
                        this.$router.push({path: "/resume",});
                    } else {
                        Toast.fail("上传失败");
                    }
                });
        },
        //上传之前
        beforeRead(file) {
            if(this.fileType==''){
                Toast("您还没有选择附件类型，请选择");
                return false;
            }
            let inSize = utils.isInSize(file, 100);
            if (inSize) {
                return true;
            } else {
                Toast("文件大小最大不能超过100MB");
                return false;
            }
        },
        onConfirm(value) {
            this.fileType = value;
            this.showPicker = false;
        },
        onClickLeft() {
            this.$router.push({ path: "/resume" });
        },
    },
}
</script>

<style lang="scss">
.attachInformation{
    .van-nav-bar .van-icon {
        color: black;
    }
    .void {
        width: 100%;
        height: 10px;
        background: #f3f3f4;
    }
    .van-uploader{
        width:100%;
        margin-left:60px;
    }
    .van-button{
        width:320%;
        border-radius: 10px;
    }
    .van-uploader__input{
        width:320%;
    }
    .van-button--primary{
        background-color: #1989fa;
        border: 1px solid #1989fa;
    }
    .data {
        display: flex;
    }
    .buqi {
        width: 8%;
        border-bottom: 1px solid #f5f6f8;
        margin-top: -6px;
        img {
            width: 50%;
            height: 30%;
        }
    }
    .van-cell {
        width: 80%;
        margin-left: 5%;
    }
    .van-field__label {
        text-align: left;
    }
    .van-field__control {
        padding-left: 30px;
    }
    .jiben {
        .van-cell__title:after {
            content: "*" !important;
            color: #ff4949 !important;
            margin-right: 4px !important;
        }
    }
}
</style>