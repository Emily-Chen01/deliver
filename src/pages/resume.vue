<template>
  <div>
    <div class="resume-page" id="resume-page">
      <div v-show="resumeShow">
        <van-pull-refresh v-model="isLoading" success-text="刷新成功" @refresh="onRefresh">
        <div class="resume-title">简历</div>
        <div id="userinfo">
          <BasicsModule :BasicsList="BasicsList"></BasicsModule>
        </div>
        <div id="desiredinfo">
          <IntentionModule @intentionQuery="query" :IntentionList="IntentionList" :desNumber="desNumber"></IntentionModule>
        </div>
        <div id="workexp">
          <WorkModule @workModuleQuery="query" :workexpList="workexpList" :workNumber="workNumber"></WorkModule>
        </div>
        <div id="eduexp">
          <EducationModule @educationQuery="query" :EducationList="EducationList" :eduNumber="eduNumber"></EducationModule>
        </div>
        <div id="projexp">
          <ProjectModule @projectQuery="query" :ProjectList="ProjectList" :proNumber="proNumber"></ProjectModule>
        </div>
        <div id="practexp">
          <PractModule @practQuery="query" :PractList="PractList" :practNumber="practNumber"></PractModule>
        </div>
        <div id="traexp">
          <TrainingModule @trainingQuery="query" :TrainingList="TrainingList" :traNumber="traNumber"></TrainingModule>
        </div>
        <div id="langexp">
          <LangModule @langQuery="query" :LangList="LangList" :langNumber="langNumber"></LangModule>
        </div>
        <div id="certexp">
          <CertModule @certQuery="query" :CertList="CertList" :certNumber="certNumber"></CertModule>
        </div>
        <div id="skillexp">
          <SkillModule @skillQuery="query" :SkillList="SkillList" :skillNumber="skillNumber"></SkillModule>
        </div>
        <div id="famexp">
          <FamModule @famQuery="query" :FamList="FamList" :famNumber="famNumber"></FamModule>
        </div>
        <div id="file">
          <AttachModule @attachQuery="query" :AttachList="AttachList" :fileNumber="fileNumber"></AttachModule>
        </div>
        
        <div class="up">
          <van-button type="info" @click="deliver">投递</van-button>
        </div>
        <div v-show="show" class="yulan">
          <van-dialog v-model="show" :showConfirmButton="false">
            <van-loading />
          </van-dialog>
        </div>
        </van-pull-refresh>
      </div>
      <div v-show="!resumeShow">
        <div class="err">
            <div>
                <i class="iconfont iconcuowu"></i>
                <div>系统错误</div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { Loading, Overlay,Button,Dialog,Toast,PullRefresh } from "vant";
Vue.use(Overlay);
Vue.use(Loading);
Vue.use(Button);
Vue.use(Toast);
Vue.use(PullRefresh);
import BasicsModule from "@/components/resume/basics";
import IntentionModule from "@/components/resume/intention";
import WorkModule from "@/components/resume/work";
import EducationModule from "@/components/resume/education";
import ProjectModule from "@/components/resume/project";
import PractModule from "@/components/resume/pract";
import TrainingModule from "@/components/resume/training";
import LangModule from "@/components/resume/lang";
import CertModule from "@/components/resume/cert";
import SkillModule from "@/components/resume/skill";
import FamModule from "@/components/resume/fam";
import AttachModule from "@/components/resume/attach";
export default {
  name: "resume",
  data() {
    return {
      resumeShow:true,
      xiala:false,
      isLoading: false,
      show: false,
      BasicsList: [],
      IntentionList: [],
      EducationList: [],
      workexpList: [],
      ProjectList: [],
      PractList: [],
      TrainingList: [],
      LangList: [],
      CertList: [],
      SkillList: [],
      FamList: [],
      AttachList: [],
      category: this.$route.query.category,

      desNumber:false,
      eduNumber:false,
      workNumber:false,
      proNumber:false,
      practNumber:false,
      traNumber:false,
      langNumber:false,
      certNumber:false,
      skillNumber:false,
      famNumber:false,
      fileNumber:false,
    };
  },
  methods: {
    onRefresh() {
      this.xiala=true
      this.query()
    },
    deliver(){
      if(sessionStorage.getItem('userId')==null){
        Toast.fail('您的基本信息必填项还没有完成');
        return
      }
      this.show = true;
      this.$http.get(`/api/QR/SubmitByDB?companyId=${sessionStorage.getItem('companyId')}&templateId=${sessionStorage.getItem('templateId')}&ruipinUserId=${sessionStorage.getItem('ruipinUserId')}&userId=${sessionStorage.getItem('userId')}`
        )
        .then(response => {
          let res = response.body;
          if (res.code === "200") {
            if(res.data.result){
              this.$router.push({ path:"/success" });
            }else{
              Toast.fail(res.data.msg);
            }
          }else{
            Toast.fail("投递失败");
          }
          this.show = false;
        })
    },
    process(value) {
      let listarr = [];
      value.forEach(list => {
        let arr = [];
        list.forEach(item => {
          let tc = item.field;
          let data = {
            order: item.order, //普通删除或多项删除传给后端的时候要用到order，除附件
            baseValue:item.baseValue //附件删除那边给后端需要传baseValue，其他不用baseValue
          };
          data[tc] = item.baseText;//简历预览页取baseText值
          arr.push(data);
        });
        listarr.push(Object.assign(...arr));
      });
      value = listarr.slice(1);
      return value;
    },
    query() {
      if(!this.xiala){
        this.show = true;
      }
      let api=(sessionStorage.getItem('userId'))?
      `/api/QR/GetTemplateByCompany?companyId=${sessionStorage.getItem('companyId')}&ruipinUserId=${sessionStorage.getItem('ruipinUserId')}&templateId=${sessionStorage.getItem('templateId')}&userId=${sessionStorage.getItem('userId')}` :
      `/api/QR/GetTemplateByCompany?companyId=${sessionStorage.getItem('companyId')}&ruipinUserId=${sessionStorage.getItem('ruipinUserId')}&templateId=${sessionStorage.getItem('templateId')}`
      this.$http.get(api).then(response => {
          let res = response.body;
          if (res.code === "200") {
            if(this.xiala){
              this.isLoading = false;
              Toast('刷新成功');
            }
            if(res.data.length>0){  //后台传过来的数据动态的 不固定
              this.resumeShow=true
              res.data.forEach(item=>{
                // 基础信息
                if(item.category=="userinfo"){
                  if(item.customData){
                    this.BasicsList = item.customData;
                    this.BasicsList = this.process(this.BasicsList);
                  }
                }else if(item.category=="desiredinfo"){
                  this.desNumber=true
                  if(item.customData){
                    // 求职意向
                    this.IntentionList = item.customData;
                    this.IntentionList = this.process(this.IntentionList);
                  }
                }else if(item.category=="eduexp"){
                  this.eduNumber=true
                  if(item.customData){
                    // 教育经历
                    this.EducationList = item.customData;
                    this.EducationList = this.process(this.EducationList);
                  }
                }else if(item.category=="workexp"){
                  this.workNumber=true
                  if(item.customData){
                    // 工作经历
                    this.workexpList = item.customData;
                    this.workexpList = this.process(this.workexpList);
                  }
                }else if(item.category=="projexp"){
                  this.proNumber=true
                  if(item.customData){
                    // 项目经历
                    this.ProjectList = item.customData;
                    this.ProjectList = this.process(this.ProjectList);
                  }
                }else if(item.category=="practexp"){
                  this.practNumber=true
                  if(item.customData){
                    // 实习经历
                    this.PractList = item.customData;
                    this.PractList = this.process(this.PractList);
                  }
                }else if(item.category=="traexp"){
                  this.traNumber=true
                  if(item.customData){
                    // 培训经历
                    this.TrainingList = item.customData;
                    this.TrainingList = this.process(this.TrainingList);
                  }
                }else if(item.category=="langexp"){
                  this.langNumber=true
                  if(item.customData){
                    // 语言
                    this.LangList = item.customData;
                    this.LangList = this.process(this.LangList);
                  }
                }else if(item.category=="certexp"){
                  this.certNumber=true
                  if(item.customData){
                    // 证书
                    this.CertList = item.customData;
                    this.CertList = this.process(this.CertList);
                  }
                }else if(item.category=="skillexp"){
                  this.skillNumber=true
                  if(item.customData){
                    // 技能
                    this.SkillList = item.customData;
                    this.SkillList = this.process(this.SkillList);
                  }
                }else if(item.category=="famexp"){
                  this.famNumber=true
                  if(item.customData){
                    // 家庭成员
                    this.FamList = item.customData;
                    this.FamList = this.process(this.FamList);
                  }
                }else if(item.category=="attachinfo"){
                  this.fileNumber=true
                  if(item.customData){
                    // 附件
                    this.AttachList = item.customData;
                    this.AttachList = this.process(this.AttachList);
                  }
                }
              })
            }else{
              this.resumeShow=false
              // Toast.fail("无数据");
            }
          }else{
            Toast('查询失败');
          }
          if(!this.xiala){
            this.show = false;
          }
        });
    },
    anorapple(){
      let u = navigator.userAgent;
      let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
    },
  },
  created() {
    this.query();
    // this.anorapple()
  },
  updated() {
    window.scroll(0,0);
    // if(this.category=="userinfo"){
    //   window.scroll(0,0);
    // }else if(this.category=="desiredinfo"){
    //   window.scroll(0,document.getElementById("desiredinfo").offsetTop-100);
    // }else if(this.category=="eduexp"){
    //   window.scroll(0,document.getElementById("eduexp").offsetTop-100);
    // }else if(this.category=="workexp"){
    //   window.scroll(0,document.getElementById("workexp").offsetTop-100);
    // }else if(this.category=="projexp"){
    //   window.scroll(0,document.getElementById("projexp").offsetTop-100);
    // }else if(this.category=="practexp"){
    //   window.scroll(0,document.getElementById("practexp").offsetTop-100);
    // }else if(this.category=="traexp"){
    //   window.scroll(0,document.getElementById("traexp").offsetTop-100);
    // }else if(this.category=="langexp"){
    //   window.scroll(0,document.getElementById("langexp").offsetTop-100);
    // }else if(this.category=="certexp"){
    //   window.scroll(0,document.getElementById("certexp").offsetTop-100);
    // }else if(this.category=="skillexp"){
    //   window.scroll(0,document.getElementById("skillexp").offsetTop-100);
    // }else if(this.category=="famexp"){
    //   window.scroll(0,document.getElementById("famexp").offsetTop-100);
    // }else if(this.category=="file"){
    //   window.scroll(0,document.getElementById("file").offsetTop-100);
    // }
  },
  mounted(){
    
  },
  components: {
    BasicsModule,
    IntentionModule,
    WorkModule,
    EducationModule,
    ProjectModule,
    PractModule,
    TrainingModule,
    LangModule,
    CertModule,
    SkillModule,
    FamModule,
    AttachModule,
  }
};
</script>

<style lang="scss">
.up{
  width:100%;
  height:160px;
  display: flex;
  align-items: center;
  background: white;
  position: fixed;
  bottom: 0px;
  .van-button{
    margin-left:5%;
    width:90%;
    height:80px;
    border-radius: 5px;
  }
}
.add_bg {
  overflow: hidden;
}
.resume-page {
  width: 100%; 
  height: 110vh;
  padding-bottom: 120px;
  position: relative;
  box-sizing: border-box;
  text-align: left;
  overflow: auto;
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
}

.resume-info {
  height: 100%;
}

.resume-title {
  color: #000000;
  font-size: 30px;
  text-align: center;
  padding: 30px 0;
  font-weight: 500;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 120px;
  height: 120px;
  background-color: #fff;
}
</style>