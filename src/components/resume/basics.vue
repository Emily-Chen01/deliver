<template>
  <div>
    <div class="basics">
      <div style="display:flex;" v-show="BasicsList.length==0">
        <div class="avatar">
          <img class="avatarImg" src="../../assets/img/avatar.png" alt />
        </div>
        <div class="info">
          <div class="name">{{upData}}</div>
          <div class="other">性别
            <i style="margin-right:10px;">|</i>生日
            <i style="margin-right:10px;">|</i>所在地
          </div>
        </div>
      </div>
      <div style="width:100%;" v-for="(item,i) in BasicsList" :key="i">
        <div style="display:flex;">
          <div class="avatar">
            <img v-show="item.Photo" class="avatarImg" :src="item.Photo" alt />
            <img v-show="!item.Photo" class="avatarImg" src="../../assets/img/avatar.png" alt />
          </div>
          <div class="info">
            <div
              :class="['name',item.ChineseName ? 'have' : '']"
            >{{item.ChineseName ? item.ChineseName : "基本资料"}}</div>
            <div class="other">
              <span v-show="item.Gender">{{item.Gender ? (item.Gender==1?"男":"女") : "性别"}}
              </span>
              <span v-show="item.Birthday"><i>|</i> {{item.Birthday ? item.Birthday : "生日"}}
              </span>
              <span v-show="item.PostAddress"><i>|</i> {{item.PostAddress ? item.PostAddress : "所在地"}}</span>
              
            </div>
          </div>
        </div>
        <div class="contact-way">
          <div v-show="item.MobilePhone" class="phone">{{item.MobilePhone ? item.MobilePhone : "-"}}</div>
          <div v-show="item.Email" class="email">{{item.Email ? item.Email : "-"}}</div>
        </div>

      <!-- 婚姻状况  有小孩  国籍 证件类型 证件号码 有无海外经历 政治面貌 当前地点 邮编 qq 微信
      自我评价 当前薪资 最高学历 专业 最近公司 最近职位 工作年数 毕业院校 院校所在地 毕业时间 在校附加信息 海外学校
      学位编码 学历编码 个人照片 意向科室 兴趣爱好 身高 体重 族别 学位 出生地 籍贯 户口所在地-->
      <div class="ty">
      <div class="cont" v-show="item.EnglishName">英文名: {{item.EnglishName}}</div>
      <div class="cont" v-show="item.Phone">电话号码: {{item.Phone}}</div>
      <div class="cont" v-show="item.WorkStartTime">开始工作时间: {{item.WorkStartTime}}</div>
      <div class="conta" v-show="item.MaritalStatusID">婚姻状况: {{item.MaritalStatusID}}</div>
      <div class="conta" v-show="item.Child">有无小孩: {{item.Child}}</div>
      <div class="conta" style="width:100%" v-show="item.Nation">国籍: {{item.Nation}}</div>
      <div class="conta" v-show="item.IdType">证件类型: {{item.IdType}}</div>
      <div class="conta" style="width:100%" v-show="item.IdNumber">证件号码: {{item.IdNumber}}</div>
      <div class="conta" v-show="item.OverseasExperience">有无海外经历: {{item.OverseasExperience}}</div>
      <div class="conta" v-show="item.PoliticalStatus">政治面貌: {{item.PoliticalStatus}}</div>
      <div class="conta" v-show="item.PostalCode">邮编: {{item.PostalCode}}</div>
      <div class="conta" v-show="item.QQ">qq: {{item.QQ}}</div>
      <div class="conta" v-show="item.WeiChat">微信: {{item.WeiChat}}</div>
      <div class="conta" v-show="item.SalaryRangeID">当前薪资: {{item.SalaryRangeID}}</div>
      <div class="conta" v-show="item.LatestEducationID">最高学历: {{item.LatestEducationID}}</div>
      <div class="conta" v-show="item.Major">专业: {{item.Major}}</div>
      <div class="conta" v-show="item.LatestCompany">最近公司: {{item.LatestCompany}}</div>
      <div class="conta" v-show="item.LatestPosition">最近职位: {{item.LatestPosition}}</div>
      <div class="conta" v-show="item.TotalYears">工作年数: {{item.TotalYears}}</div>
      <div class="conta" v-show="item.School">毕业院校: {{item.School}}</div>
      <div class="conta" style="width:100%" v-show="item.SchoolPlace">院校所在地: {{item.SchoolPlace}}</div>
      <div class="conta" v-show="item.GraduationDate">毕业时间: {{item.GraduationDate}}</div>
      <div class="conta" style="width:100%" v-show="item.AdditionalInfo">在校附加信息: {{item.AdditionalInfo}}</div>
      <div class="conta" v-show="item.OverseaSchool">海外学校: {{item.OverseaSchool}}</div>
      <div class="conta" v-show="item.BachelorNo">学位编码: {{item.BachelorNo}}</div>
      <div class="conta" v-show="item.CollegeNo">学历编码: {{item.CollegeNo}}</div>
      <div class="conta" v-show="item.SectionOffice">意向科室: {{item.SectionOffice}}</div>
      <div class="conta" v-show="item.Hobby">兴趣爱好: {{item.Hobby}}</div>
      <div class="conta" v-show="item.Height">身高: {{item.Height}}</div>
      <div class="conta" v-show="item.Weight">体重: {{item.Weight}}</div>
      <div class="conta" v-show="item.Nationality">族别: {{item.Nationality}}</div>
      <div class="conta" v-show="item.Degree">学位: {{item.Degree}}</div>
      <div class="conta" style="width:100%" v-show="item.BirthPlace">出生地: {{item.BirthPlace}}</div>
      <div class="conta" style="width:100%" v-show="item.RegisteredAddress">籍贯: {{item.RegisteredAddress}}</div>
      <div class="conta" style="width:100%" v-show="item.HuKou">户口所在地: {{item.HuKou}}</div>
      <div
        class="conta"
        style="width:100%"
        v-show="item.ExecutiveSummary"
      >自我评价: {{item.ExecutiveSummary}}</div>
      </div>
      <div v-show="BasicsList.length>0" class="edit" @click="toEditBasics(item)">
        <div class="icon"></div>
      </div>
      </div>
      <div v-show="BasicsList.length>0" style="width:100%;height:38px;"></div>
      <div class="add" v-show="BasicsList.length===0">
        <div class="add-link" @click="toAddBasics">
          <div class="add-icon"></div>新增
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "basics",
  props: ["BasicsList"],
  data() {
    return {
      data: null,
      upData:"基本资料"
    };
  },
  methods: {
    toEditBasics(item) {
      let order=item.order
      this.$router.push({ 
        path:"/information",
        query:{
          upData:this.upData,
          category:"userinfo",
          companyId:sessionStorage.getItem('companyId'),
          ruipinUserId:sessionStorage.getItem('ruipinUserId'),
          templateId:sessionStorage.getItem('templateId'),
          order,
          userId:sessionStorage.getItem('userId'),
        } 
      });
    },
    toAddBasics() {
      this.$router.push({ 
        path:"/information",
        query:{
          upData:this.upData,
          category:"userinfo",
          companyId:sessionStorage.getItem('companyId'),
          ruipinUserId:sessionStorage.getItem('ruipinUserId'),
          templateId:sessionStorage.getItem('templateId'),
          order:0
        } 
      });
    }
  },
  created() {
  },
  components: {}
};
</script>

<style lang="scss">
.basics {
  margin-top: 17px;
  display: flex;
  flex-wrap: wrap;
  padding: 0 40px;
  position: relative;

  .avatar {
    width: 150px;
    height: 150px;
    border: 3px solid #f2f2f2;
    border-radius: 50%;

    .avatarImg {
      width: 100%;
      height: 100%;
      border-radius:50%
    }
  }
  

  .info {
    width:65%;
    font-size: 26px;
    color: #282828;
    margin-left: 40px;

    .name {
      padding: 30px 0;
      word-wrap:break-word;

      &.have {
        font-size: 40px;
        font-weight: bold;
        padding: 20px 0;
      }
    }
    .have {
      font-size: 40px;
      font-weight: bold;
      padding: 20px 0;
    }

    .other i {
      font-style: normal;
      margin: 0 6px;
      color: #bdbdbd;
      display: inline-block;
      width: 1px;
      font-size: 23px;
      line-height: 23px;
      vertical-align: 1px;
    }
  }

  .contact-way {
    font-size: 26px;
    color: #333;
    margin: 50px 0;
    line-height: 45px;
    width: 100%;

    .phone {
      background: url("../../assets/img/phone.png") left center no-repeat;
      padding-left: 43px;
      background-size: 30px 30px;
    }

    .email {
      background: url("../../assets/img/mail.png") left center no-repeat;
      padding-left: 43px;
      background-size: 30px 30px;
    }
  }
  .ty{
    width:100%;
    display: flex;
    flex-wrap: wrap;
    .cont {
      color: #666666;
      font-size: 26px;
      line-height: 45px;
      width: 50%;
    }

    .conta {
      color: #666666;
      font-size: 26px;
      line-height: 45px;
      width: 50%;
    }
  }

  .edit {
    position: absolute;
    top: 16px;
    right: 20px;
  padding: 20px;

  .icon {
    width: 34px;
    height: 34px;
    background: url("../../assets/img/edit.png") center center no-repeat;
    background-size: 34px;
  }
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
  }
}
</style>