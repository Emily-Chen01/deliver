<template>
  <div>
    <div class="basicsInformation">
      <van-nav-bar :title="upData" left-arrow @click-left="onClickLeft" />
      <div class="void"></div>
      <van-form ref="form" @submit="onSubmit" :scroll-to-error="true">
        <div v-for="(item,i) in formList" :key="item.baseId">
          <div v-if="item.controlType=='input'">
            <div class="fu" :class="[item.necessary ? 'jiben' : '']">
              <van-field
                v-model="item.baseValue"
                :name="item.field"
                :label="item.fieldName"
                :placeholder="item.description"
                :rules="item.qfMobilePhone ? ([{ required: true, pattern:/^[1][3-9]\d{9}$/, message: '请填写正确的手机号码' }]) :  
                (item.qfPhone?([Object.assign(rulesPhone, item.necessary ? rulesPhoneRequired : {})]):
                (item.qfEmail?([Object.assign(rulesEmail, item.necessary ? rulesEmailRequired : {})]):
                (item.necessary ? [{ required: true, message: item.description }] : [])))"
              />
            </div>
          </div>
          <!-- select -->
          <div
            v-if="item.controlType=='select'||item.controlType=='radio'||item.controlType=='checkbox'"
          >
            <div :class="['data',item.necessary ? 'jiben' : '']">
              <van-field
                readonly
                clickable
                :name="item.field"
                :value="item.baseValue"
                :label="item.fieldName"
                :placeholder="item.description"
                right-icon="arrow-down"
                @click="item.showPicker = true"
                :rules="item.necessary ? [{ required: true, message: item.description,trigger: 'onChange' }] : []"
              />
              <van-popup v-model="item.showPicker" position="bottom">
                <van-picker
                  show-toolbar
                  value-key="value"
                  :columns="item.selection"
                  @confirm="e => onConfirmSelect(e, i)"
                  @cancel="item.showPicker = false"
                />
              </van-popup>
            </div>
          </div>
          <!-- location -->
          <div v-if="item.controlType=='location'">
            <div :class="['data',item.necessary ? 'jiben' : '']">
              <van-field
                readonly
                clickable
                :name="item.field"
                :value="item.baseValue"
                :label="item.fieldName"
                :placeholder="item.description"
                right-icon="arrow-down"
                @click="item.showPicker = true"
                :rules="item.necessary ? [{ required: true, message: item.description,trigger: 'onChange' }] : []"
              />
              <van-popup v-model="item.showPicker" position="bottom">
                <van-area
                  :area-list="areaList"
                  @confirm="e=>onConfirmLocation(e,i)"
                  @cancel="item.showPicker = false"
                />
              </van-popup>
            </div>
          </div>
          <!-- date -->
          <div v-if="item.controlType=='date'">
            <div :class="['data',item.necessary ? 'jiben' : '']">
              <van-field
                readonly
                clickable
                :name="item.field"
                :value="item.baseValue"
                :label="item.fieldName"
                :placeholder="item.description"
                right-icon="arrow-down"
                @click="item.showPicker = true"
                :rules="item.necessary ? [{ required: true, message: item.description,trigger: 'onChange' }] : []"
              />
              <van-popup v-model="item.showPicker" position="bottom">
                <van-datetime-picker
                  v-model="currentDate"
                  type="date"
                  :min-date="minDate"
                  :max-date="maxDate"
                  @confirm="e=>onConfirmData(e,i)"
                  @cancel="item.showPicker = false"
                />
              </van-popup>
            </div>
          </div>
          <!-- smalldate -->
          <div v-if="item.controlType=='smalldate'">
            <div :class="['data',item.necessary ? 'jiben' : '']">
              <van-field
                readonly
                clickable
                :name="item.field"
                :value="item.baseValue"
                :label="item.fieldName"
                :placeholder="item.description"
                right-icon="arrow-down"
                @click="item.showPicker = true"
                :rules="item.necessary ? [{ required: true, message: item.description,trigger: 'onChange' }] : []"
              />
              <van-popup v-model="item.showPicker" position="bottom">
                <van-datetime-picker
                  v-model="currentDate"
                  type="year-month"
                  :min-date="minDate"
                  :max-date="maxDate"
                  @confirm="e=>onConfirmSmallData(e,i)"
                  @cancel="item.showPicker = false"
                />
              </van-popup>
            </div>
          </div>
          <!-- photo -->
          <div v-if="item.controlType=='photo'"  :class="['phototext',item.necessary ? 'jiben' : '']">
            <van-field
                :name="item.field"
                :label="item.fieldName"
              >
              <template #input>
                <van-uploader
                  :before-read="beforeRead"
                  :after-read="afterRead"
                  multiple
                  :max-count="1"
                >
                  <img
                    :src="photoUrl"
                    alt="等待传图"
                    class="imgPreview"
                  />
                </van-uploader>
                <div class="iconfontdiv" @click="deleteicon"  v-show="iconshow">
                  <i class="iconfont icondelete"></i>
                </div>
                <div v-show="rulephoto" class="err">请上传个人照片</div>
              </template>
            </van-field>
          </div>
          <!-- textarea -->
          <div v-if="item.controlType=='textarea'">
            <div :class="['data',item.necessary ? 'jiben' : '']">
              <van-field
                :name="item.field"
                v-model="item.baseValue"
                rows="2"
                autosize
                :label="item.fieldName"
                type="textarea"
                :placeholder="item.description"
                show-word-limit
                :rules="item.necessary ? [{ required: true, message: item.description }] : []"
              />
            </div>
          </div>
        </div>
        <div style="margin: 20px;">
          <van-button round block type="info" native-type="submit">保存</van-button>
        </div>
      </van-form>
      <div v-show="show" class="yulan">
        <van-dialog v-model="show" :showConfirmButton="false">
          <van-loading />
        </van-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Uploader, Toast, Loading } from "vant";
Vue.use(Loading);
Vue.use(Uploader);
import areaList from "../../assets/js/area";
import utils from "../../common/utils";
export default {
  name: "basics",
  data() {
    // 验证电话
    var validatorPhone = (val, rule) => {
      var reg = /^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
      if (val == null || val == "") {
        // 为空的时候通过
        return true;
      } else {
        if (reg.test(val) === false) {
          return false;
        } else {
          return true;
        }
      }
    };
    // 验证邮箱
    var validatorEmail = (val, rule) => {
      var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (val == null || val == "") {
        // 为空的时候通过
        return true;
      } else {
        if (reg.test(val) === false) {
          return false;
        } else {
          return true;
        }
      }
    };
    // 验证身份证
    var validatorIdNumber=(val)=>{
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (val == null || val == "") {
          // 为空的时候通过
          return true;
        } else {
          // 身份证的时候校验
          if (this.formList[11].baseValue == "身份证") {
            if (reg.test(val) === false) {
              return false;
            } else {
              return true;
            }
            // 不是身份证不校验
          } else {
            return true;
          }
        }
      };
    return {
      iconshow:false,
      rulephoto:false,
      show: false,
      upData: this.$route.query.upData,
      category: this.$route.query.category,
      companyId: this.$route.query.companyId,
      ruipinUserId: this.$route.query.ruipinUserId,
      templateId: this.$route.query.templateId,
      order: this.$route.query.order,
      userId: this.$route.query.userId,
      formList: [],
      qfMobilePhone: 0,
      qfPhone: 0,
      qfEmail: 0,
      qfIdType: 0,
      // location
      areaList,
      // data
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(),

      // 接的照片地址
      photoUrl: require('../../assets/img/photo.jpg'),
      baseId: 0,

      // 电话
      rulesPhone: { validator: validatorPhone, message: "请填写正确的电话号" },
      rulesPhoneRequired: { required: true },
      // 邮箱
      rulesEmail: { validator: validatorEmail, message: "请输入正确的邮箱" },
      rulesEmailRequired: { required: true },
      // 身份证
      rulecert:false,
      qfIdNumber:0,
      rulesIdNumber:{ validator:validatorIdNumber, message: '请输入正确的身份证号' },
      rulesIdNumberRequired:{ required: true},
    };
  },
  methods: {
    delshow(){
      if(this.photoUrl!=require('../../assets/img/photo.jpg')){
        this.iconshow=true
      }else{
        this.iconshow=false
      }
    },
    // 个人照片左上角的删除事件
    deleteicon(){
      this.photoUrl=require('../../assets/img/photo.jpg')
      this.delshow()
    },
    // 上传成功后的获取到的图片地址
    afterRead(file) {
      this.show = true;
      let cd={
        Img:file.content,
        CompanyId:this.companyId
      }
      this.$http.post("/api/QR/UploadPhoto", cd).then(response => {
        let res = response.body;
        if (res.code === "200") {
          this.photoUrl = res.data.data;
          setTimeout(() => {
            this.delshow()
            Toast.success("上传成功");
          }, 600);
          this.show = false;
          document.body.style.overflow = "auto";
        }
      })
    },
    //上传之前
    beforeRead(file) {
      let isImage = utils.isImage(file);
      let inSize = utils.isInSize(file, 10);
      if (isImage && inSize) {
        return true;
      } else {
        Toast("格式：jpg、jpeg、png，不能超过10MB");
        return false;
      }
    },
    onConfirmSmallData(e, i) {
      this.formList[i].baseValue = this.sftime(e);
      this.formList[i].baseText = this.sftime(e);
      this.formList[i].showPicker = false;
    },
    sftime(value) {
      const d = new Date(value);
      const resDate = d.getFullYear() + "-" + this.p(d.getMonth() + 1);
      return resDate;
    },
    p(s) {
      return s < 10 ? "0" + s : s;
    },
    cftime(value) {
      const d = new Date(value);
      const resDate =
        d.getFullYear() +
        "-" +
        this.p(d.getMonth() + 1) +
        "-" +
        this.p(d.getDate());
      return resDate;
    },
    onConfirmData(e, i) {
      this.formList[i].baseValue = this.cftime(e);
      this.formList[i].baseText = this.cftime(e);
      this.formList[i].showPicker = false;
    },
    onConfirmLocation(e, i) {
      this.formList[i].baseValue = e.map(item => item.name).join("/");
      this.formList[i].baseText = e.map(item => item.name).join("/");
      this.formList[i].showPicker = false;
    },
    onConfirmSelect(e, i) {
      this.formList[i].baseValue = e.value;
      this.formList[i].baseText = e.value;
      this.formList[i].showPicker = false;
    },
    onClickLeft() {
      this.$router.push({ path: "/resume" });
    },
    tab(date1, date2) {
      var oDate1 = new Date(date1);
      var oDate2 = new Date(date2);
      if (oDate1.getTime() > oDate2.getTime()) {
        return false;
      } else {
        return true;
      }
    },
    onSubmit() {
      // 处理选择器 传key 借助baseText 直接赋给baseValue会影响视觉上的字
      this.formList.forEach(item=>{
        if(item.controlType === "select" ||
            item.controlType == "radio" ||
            item.controlType == "checkbox" ){
              item.selection.forEach(item1=>{
                if(item.baseText==item1.value){
                  item.baseText=item1.key
                }
              })
        }
      })
      // 开始时间与结束时间比较
      let StartTime = "";
      let EndTime = "";
      let BeginTime = "";
      let EndTime1 = "";
      if (this.category == "eduexp" || this.category == "traexp") {
        this.formList.forEach(item => {
          if (item.field == "StartTime" && item.baseValue != null) {
            StartTime = item.baseValue;
          } else if (item.field == "EndTime" && item.baseValue != null) {
            EndTime = item.baseValue;
          }
        });
      } else if (
        this.category == "workexp" ||
        this.category == "projexp" ||
        this.category == "practexp" ||
        this.category == "skillexp"
      ) {
        this.formList.forEach(item => {
          if (item.field == "BeginTime" && item.baseValue != null) {
            BeginTime = item.baseValue;
          } else if (item.field == "EndTime" && item.baseValue != null) {
            EndTime1 = item.baseValue;
          }
        });
      }
      if (!this.tab(StartTime, EndTime) || !this.tab(BeginTime, EndTime1)) {
        Toast("您的开始时间大于结束时间，请重新选择");
        return false;
      }
      let Order = this.order;
      // 处理个人照片数据
      this.formList = this.formList.filter(e => !Array.isArray(e));
      if(this.photoUrl == require('../../assets/img/photo.jpg')){
        this.photoUrl=""
      }
      let item1 = {
        baseId: this.baseId,
        baseValue: this.photoUrl
      };
      this.formList = this.formList.map(item =>
        item.baseId === item1.baseId ? item1 : item
      );
      let BaseDatas = [];
      if(this.category=="userinfo"){
        // 验证身份证号码
        this.formList.forEach((item,i)=>{
          if(this.formList[i].baseValue=="身份证"){
            if(this.formList[i+1].baseValue!=null){
              var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
              if (reg.test(this.formList[i+1].baseValue) === false) {
                Toast("请输入正确的身份证号");
                return false;
              }
            }
          }
          // 照片必填时验证照片
          if(item.field=="Photo"&&item.necessary==1&&item.baseValue==""){
            this.rulephoto=true
          }else{
            this.rulephoto=false
          }
        })
      }
      this.formList.forEach(item => {
        if(item.controlType === "select" ||
            item.controlType == "radio" ||
            item.controlType == "checkbox"){
          BaseDatas.push({
            BaseId: item.baseId,
            Value: item.baseText
          });
        }else{
          BaseDatas.push({
            BaseId: item.baseId,
            Value: item.baseValue
          });
        }
      });
      // 你没有填写任何内容 return
      let flag=0
      BaseDatas.forEach(item=>{
        if(item.Value==null){
          flag=flag+1
        }
      })
      if(BaseDatas.length==flag){
        Toast("您还没有填写内容，请填写");
        return false;
      }
      this.show = true;
      let cd = {
        UserDataInput: {
          UserId: this.userId,
          BaseDatas,
          Category: this.category,
          Order
        },
        SysInfo: {
          companyId: this.companyId,
          ruipinUserId: this.ruipinUserId,
          templateId: this.templateId
        }
      };
      this.$http.post("/api/QR/SetUserData", cd).then(response => {
        let res = response.body;
        if (res.code === "200") {
          if(res.data.result){
            if(Order==0){
              if (this.category == "userinfo") {
                sessionStorage.setItem("userId", res.data.data);
              }
            }
            document.body.style.overflow = "auto";
            this.show = false;
            this.$router.push({
                path: "/resume",
                query: {
                  category: this.category
                }
              }); 
          }else{
            Toast.fail(res.data.msg);
          }
        }else{
          Toast.fail("保存失败");
        }
      });
    },
    query() {
      this.show = true;
      let api = this.userId
        ? `/api/QR/GetEditPreview?companyId=${this.companyId}&ruipinUserId=${this.ruipinUserId}&templateId=${this.templateId}&category=${this.category}&order=${this.order}&userId=${this.userId}`
        : `/api/QR/GetEditPreview?companyId=${this.companyId}&ruipinUserId=${this.ruipinUserId}&templateId=${this.templateId}&category=${this.category}&order=${this.order}`;
      this.$http.get(api).then(response => {
        let res = response.body;
        if (res.code === "200") {
          this.show = false;
          this.form = res.data;
          for (var i in this.form) {
            //循环遍历每一个对象
            this.formList.push(this.form[i]); //把每一个对象放入大数组中
          }
          this.formList = this.formList.map(e => {
            return {
              ...e,
              ...((e.controlType === "select" ||
                e.controlType == "date" ||
                e.controlType == "smalldate" ||
                e.controlType == "radio" ||
                e.controlType == "checkbox" ||
                e.controlType == "location") && { showPicker: false }),
              ...(e.field === "MobilePhone" && { qfMobilePhone: 1 }),
              ...(e.field === "Phone" && { qfPhone: 1 }),
              ...(e.field === "Email" && { qfEmail: 1 }),
              ...(e.field === "Photo" && (e.baseValue===""||e.baseValue===null) && { baseValue: require('../../assets/img/photo.jpg')})
            };
          });
          this.formList.forEach(item => {
            if (item.selection != null) {
              item.selection.forEach(item1 => {
                if (item.baseValue == item1.key) {
                  item.baseValue = item1.value;
                }
              });
            }
            if(item.controlType === "select" ||
                item.controlType == "radio" ||
                item.controlType == "checkbox"){
              item.baseText=item.baseValue
            }
            if (item.controlType == "photo") {
              this.baseId = item.baseId;
              this.photoUrl=item.baseValue
            }
            this.delshow()
          });
        }else{
          Toast.fail("系统出错了");
        }
      });
    }
  },
  created() {
  },
  mounted() {
    this.query();
  },
  components: {}
};
</script>

<style lang="scss">
.basicsInformation {
  .van-nav-bar .van-icon {
    color: black;
  }
  .void {
    width: 100%;
    height: 10px;
    background: #f3f3f4;
  }
  .jiben1:after {
    content: "*" !important;
    color: #ff4949 !important;
    margin-right: 4px !important;
  }
  .jiben {
    .van-cell__title:after {
      content: "*" !important;
      color: #ff4949 !important;
      margin-right: 4px !important;
    }
  }
  .van-cell {
    width: 90%;
    margin-left: 5%;
    padding: 15px 13px 15px 16px;
    border-bottom: 1px solid #f5f6f8;
  }
  .van-field__label {
    text-align: left;
    width:33%;
  }
  .van-field__control {
    padding-left: 30px;
  }
  .fu,
  .data {
    display: flex;
  }
  .buqi {
    width: 8%;
    border-bottom: 1px solid #f5f6f8;
    // padding-top: -6px;
    img {
      width: 30px;
      height: 30px;
    }
  }
  .phototext{
    position: relative;
    .van-cell{
      height:180px;
    }
    .imgPreview{
      position: absolute;
      top: -10px;
      left: 0;
      width: 130px;
      height: 130px;  
      border-radius: 10px;
    }
    .van-uploader__input{
      position: absolute;
      top: -10px;
      left: 0;
      width: 130px;
      height: 130px;
      border-radius: 10px;
    }
    .err {
      color: #ff4949;
      font-size: 18px;
      text-indent: 10px;
      line-height: 238px;
      position: absolute;
      top: 10px;
      left: 46%;
    }
    .iconfontdiv{
      width:30px;
      height: 30px;
      background: #cccccc;
      border-radius: 50%;
      line-height: 30px;
      text-align: center;
      position: absolute;
      top:5px;
      left:135px;
      .iconfont{
        font-size:24px;
      }
    }
    
  }
  .photodiv {
    display: flex;
    width: 90%;
    height: 148px;
    border-bottom: 1px solid #f5f6f8;
    margin-top: 5px;
    margin-left: 15px;
    position: relative;
    
    .photo {
      width: 90px;
      height: 100%;
      color: #323233;
      font-size: 14px;
      line-height: 24px;
    }
    .van-uploader {
      margin-top: 10px;
    }
    .imgPreview {
      width: 120px;
      height: 120px;
      border-radius: 10px;
      margin-left:28px;
    }
  }
}
</style>