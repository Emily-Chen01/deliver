<template>
  <div>
    <div class="education module" v-show="eduNumber">
      <div class="interlayer"></div>
      <div class="title">{{upData}}</div>
        <div class="box" v-for="(item,i) in EducationList" v-show="EducationList.length>0" :key="i">
          <div class="info" style="width:82%;">
            <div class="info-item" style="word-wrap:break-word;" v-show="item.SchoolName||item.SchoolName==''">
              <span>院校名称：{{item.SchoolName || "-"}}</span>
            </div>
            <div class="info-item" v-show="item.StartTime||item.StartTime==''">
              <span>起始时间：{{(item.StartTime || "-") + "---" +  (item.EndTime || "-")}}</span>
            </div>
            <div class="info-item" style="display:flex;">
              <div style="width:38%;" v-show="item.DegreeName||item.DegreeName==''">学历：{{item.DegreeName || "-"}}</div>
              <div v-show="item.TongZhao||item.TongZhao==''">是否统招：{{item.TongZhao || "-"}}</div>
            </div>
            <div class="info-item" style="display:flex;">
              <div v-show="item.Major||item.Major==''">专业：{{item.Major || "-"}}</div>
            </div>
            <div class="info-item" style="display:flex;">
              <div v-show="item.ShoolClass||item.ShoolClass==''">班级：{{item.ShoolClass || "-"}}</div>
            </div>
          </div>
          <div class="desc" v-show="item.Description||item.Description==''">
            <div class="desc-title">描述：</div>
            <div class="desc-content">{{item.Description || "-"}}</div>
          </div>
          
          <div class="work-action module-action">
            <div class="edit" @click="toEditEducation(item)">
              <div class="icon"></div>
            </div>
            <div class="delete" @click="toDeleteEducation(item)">
              <div class="icon"></div>
            </div>
          </div>
        </div>
      <!-- :class="['add',data.length > 0 ? 'have' : '']" -->
      <div class="add">
        <div class="add-link" @click="toAddEducation">
          <div class="add-icon"></div>新增
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { Toast,Dialog } from 'vant';

Vue.use(Toast);
export default {
  name: "education",
  props: ["EducationList","eduNumber"],
  data() {
    return {
      data: null,
      upData:"教育经历"
    };
  },
  methods: {
    toEditEducation(item){
      let order=item.order
      this.$router.push({ 
        path:"/information",
        query:{
          upData:this.upData,
          category:"eduexp",
          companyId:sessionStorage.getItem('companyId'),
          ruipinUserId:sessionStorage.getItem('ruipinUserId'),
          templateId:sessionStorage.getItem('templateId'),
          order,
          userId:sessionStorage.getItem('userId')
        } 
      });
    },
    toDeleteEducation(item){
      Dialog.confirm({
        title: "提示",
        message: "您确认要删除此项记录吗？"
      })
        .then(() => {
          this.$http
            .get(
              `/api/QR/DeleteUserData?userId=${sessionStorage.getItem('userId')}&category=eduexp&order=${item.order}`
            )
            .then(response => {
              let res = response.body;
              if (res.code === "200") {
                // Toast.success("删除成功");
                this.$emit('educationQuery');
              } else {
                Toast.fail("删除失败");
              }
            });
        })
        .catch(() => {});
    },
    toAddEducation() {
      if(sessionStorage.getItem('userId')==null){
        Toast.fail('您的基本信息必填项还没有完成');
        return
      }
      this.$router.push({ 
        path:"/information",
        query:{
          upData:this.upData,
          category:"eduexp",
          companyId:sessionStorage.getItem('companyId'),
          ruipinUserId:sessionStorage.getItem('ruipinUserId'),
          templateId:sessionStorage.getItem('templateId'),
          order:0,
          userId:sessionStorage.getItem('userId')
        } 
      });
    }
  },
  created() {},
  components: {}
};
</script>

<style scoped lang="scss">

.resume-page {
  width: 100%;
  height: 100%;
  padding-bottom: 140px;
  position: relative;
  box-sizing: border-box;
  text-align: left;
  overflow: auto;
}

.resume-info {
  height: 100%;
}

.resume-title {
  color: #000000;
  font-size: 30px;
  text-align: center;
  padding: 30px 0;
}

.add {
  width: 100%;
  // margin-top: 38px;
  display: flex;
  justify-content: center;

  .add-link {
    font-size: 28px;
    color: #587cec;
    display: flex;
    align-items: center;
    padding: 35px;

    .add-icon {
      width: 36px;
      height: 36px;
      background: url("../../assets/img/add.png") center center no-repeat;
      background-size: contain;
      margin-right: 10px;
    }
  }

  &.have {
    margin-top: 0;
  }
}

.interlayer {
  width: 100%;
  height: 20px;
  background-color: #f3f3f4;
  margin: 0 -45px;
  padding: 0 45px;
  // box-sizing: border-box;
}

.module {
  padding: 0 45px;

  .title {
    font-size: 34px;
    color: #282828;
    margin-top: 40px;
    font-weight:500;
  }
  .bold{
    font-weight: 700;
  }
}

.edit {
  padding: 20px;

  .icon {
    width: 34px;
    height: 34px;
    background: url("../../assets/img/edit.png") center center no-repeat;
    background-size: 34px;
  }
}

.delete {
  padding: 20px;
  margin-top: -3px;

  .icon {
    width: 36px;
    height: 36px;
    background: url("../../assets/img/delete.png") center center no-repeat;
    background-size: 34px;
  }
}

.module-action {
  display: flex;

  .edit {
    margin-right: 5px;
  }
}


.work,
.education,
.project,
.training {
  .box {
    position: relative;
    .info-item{
      word-wrap:break-word;
    }

    .info {
      color: #666666;
      font-size: 26px;
      line-height: 45px;
      padding-top: 20px;

    }

    .desc {
      margin-top: 30px;

      .desc-title {
        color: #666666;
        font-size: 26px;
      }

      .desc-content {
        font-size: 28px;
        color: #666666;
        line-height: 41px;
        margin-top:10px;
        word-wrap:break-word;
      }
    }
    
    & + .box {
      margin-top: 30px;
      border-top: 1px solid #f3f3f4;
    }

    .work-action {
      position: absolute;
      top: 4px;
      right: -20px;
    }
  }
}

.sendResume {
  .taro-scroll {
    padding-bottom: 140px;
  }

  .send {
    position: absolute;
    bottom: 54px;
    left: 40px;
    right: 40px;
    z-index: 998;
    background: #fff;
    box-sizing: border-box;

    .sendBtn {
      background: #587cec;
      height: 80px;
      line-height: 78px;
      border-color: #587cec;
    }

    .posted {
      background: #999;
      border-color: #999;
    }
  }
}

.resume-btns {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background: #fff;
  justify-content: center;
  height: 80px;
  padding: 30px 80px;

  at-button {
    flex: 1;
  }

  at-button:first-child {
    margin-right: 44px;
  }

  .btn {
    width: 100%;
    box-sizing: border-box;
    height: 80px;
    line-height: 80px;
    font-size: 26px;

    &.generate {
      background-color: #587cec;
      border-color: #587cec;
    }

    &.check {
      background-color: #b5b9d2;
      border-color: #b5b9d2;
    }
  }
}
</style>