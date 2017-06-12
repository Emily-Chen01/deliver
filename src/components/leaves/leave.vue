<template>
    <div  style="background: #ffffff;height: 100vh">
      <!--请假申请-->
      <mt-navbar v-model="selected" class="dataTitle">
        <mt-tab-item id="1"  ><span>填写申请</span></mt-tab-item>
        <mt-tab-item id="2"  ><span  @click="changeShow(1)">我的申请</span></mt-tab-item>
      </mt-navbar>

      <!-- tab-container -->
      <mt-tab-container v-model="selected" style="margin-top: 1rem">
        <mt-tab-container-item id="1">
          <!--个人资料-->

          <div class="hrClass"></div>
          <div class="contentClass">
            <div class="contentLeft" style="padding-top: 0.3rem">申请分类</div>
            <div class="contentRight" style="position: relative;" >
              <div class="selectBao">
                <img width="150" :src="imgSrc.selectShow"  class="selectShowImg"  />
              </div>
              <select v-model="selectedDataApply" class="changeSelect"  @change="shengqingclick(selectedDataApply)"> <!--shengqingclick(selectedDataApply)-->
                <option v-for="option in optionsApply"  v-bind:value="option.value">
                  {{ option.text }}
              </option>
              </select>
            </div>
          </div>

          <div class="hrClass" v-if="changeApply"></div>
          <div class="contentClass" v-if="changeApply">
            <div class="contentLeft" style="padding-top: 0.3rem">假期分类</div>
            <div class="contentRight" style="position: relative;" >
              <div class="selectBao">
                <img width="150" :src="imgSrc.selectShow"  class="selectShowImg"  />
              </div>
              <select v-model="selectedDataHoliday" class="changeSelect" @change="qingjiaclick(selectedDataHoliday)" >
                <option v-for="option in optionsHoliday" v-bind:value="option">
                  {{ option.text }}
              </option>
              </select>
            </div>
          </div>
          <!--<div class="hrClass" v-if="changeApply"></div>-->


          <div  v-if="changeApplyTime" class="hrClass" ></div>
          <div  v-if="changeApplyTime" class="contentClass">
            <div class="contentLeft" >开始时间</div>
            <div class="contentRight" >
              <datePick @ieventStart = "ieventStart" ></datePick>
            </div>
          </div>
          <div  v-if="changeApplyTime" class="hrClass" ></div>
          <div  v-if="changeApplyTime" class="contentClass">
            <div class="contentLeft" >结束时间</div>
            <div class="contentRight" >
              <endDatePick  @ieventEnd = "ieventEnd"></endDatePick>
            </div>
          </div>
          <div  v-if="changeApplyTime" class="hrClass" ></div>



          <div style="clear:both;"></div>
          <!--<div class="hrClass" v-if="updateImage"></div>-->
          <div v-if="updateImage" style="width:98%;height: 8rem;line-height: 8rem; position: relative">
                <div class="cardClass">
                  <div>
                    <vue-core-image-upload
                      crop-ratio="1:1"
                      @imageuploaded="imageuploaded"
                      :data="data"
                      :headers="tokenHeader"
                      :max-file-size="20971520"
                      url="/api/v1.0/client/upload" >
                      <div class="CardDivImg" v-if="initUpImage">  <img width="150" :src="imgSrc.shenFenIconShow"  class="CardImg"   /></div>
                      <div class="CardDivImg" v-if="imgSrc.shenFenIcon">  <img width="150" :src="imgSrc.shenFenIcon"  class="CardImg"  /></div>

                    </vue-core-image-upload>
                  </div>
                </div>
              </div>
          <!--<div class="hrClass" v-if="updateImage"></div>-->


          <div style="clear:both;"></div>

          <div v-if="changeApplyOvertime">
              <mt-field label="加班时长" v-model="addTimeValue" >
              </mt-field>
            </div>
          <div   style="width: 96%;margin:0 0.8rem;height: 1px;background: #cccccc;line-height: 1px"></div>

          <div  style="width: 100%;height: 7rem;">
              <div style="text-align:left;font-size: 1.2rem;padding:0.2rem 0 0.5rem 1.4rem">备注</div>
              <div style="width: 95%;margin:  1rem ;">
                 <textarea placeholder="#请输入文字"
                           v-model="holidayModel"
                           style=" overflow: hidden;overflow-y: scroll;width: 98%;height: 4rem;border-radius: 4px">
            </textarea>
              </div>

            </div>

            <mt-field label="审批人"  style="margin-top: 1rem" v-if="approvalTypeObj">
              <div class="showARightSpan">{{approvalTypeObj.NAME}}</div>
            </mt-field>

      <div>
      </div>
          <div style="padding-top: 2rem">
            <mt-button type="primary"
                       style="background-color: rgb(32, 161, 255);width: 20rem;height:3rem;line-height: 3rem"
                       @click.native="handerDataSubmit()">提交
             </mt-button>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="2">

          <!--进行编辑内容开始-->
          <div    class="changeTitleClass">
            <div  @click="changeShow(1)" class="changeShowList" :class="{  active:isActive}">全部 </div>
            <div  @click="changeShow(2)" class="changeShowList" :class="{  active2:isActive2}">审核中</div>
            <div  @click="changeShow(3)" class="changeShowList" :class="{  active3:isActive3}">已通过 </div>
            <div  @click="changeShow(4)" class="changeShowList" :class="{  active4:isActive4}">未通过</div>

          </div>

          <!--//进行编辑内容结束-->

      <!--我的申请-->
          <div class="myApply" v-for="item in searchApplyRecord" v-if="searchApplyRecord!==null">
            <div class="myApplyTitle">
              <div class="myApplyTitleLeft" >
                <div style="float:left;padding-left: 0.5rem;padding-top: 0.1rem;"><span >| </span></div>
                <div style="float:left;padding-top: 0.2rem;"> &nbsp{{item.name}}申请</div>
              </div>
              <div class="myApplyTitleRight" v-if="item.status==0">审核中</div>
              <div class="myApplyTitleRight" v-else-if="item.status==1">已通过</div>
              <div class="myApplyTitleRight" v-else-if="item.status==2">未通过</div>
              <div style="clear: both;"></div>
            </div>
            <div class="myApplyContent">
              <div v-if="item.startTime">
                <div class="myApplyContentLeft">起止日期</div>
                <div class="myApplyContentNr" >
                    {{ datefmt(item.startTime)}}
                    至
                    {{ datefmt(item.endTime)}}
                </div>
              </div>
              <div v-if="item.overworkTime">
                <div class="myApplyContentLeft">加班时长</div>
                <div class="myApplyContentNr" >
                  {{item.overworkTime}}小时
                </div>
              </div>

              <div class="myApplyContentLeft">事由</div>
              <div class="myApplyContentNr">{{item.remarks}}</div>
              <div v-if="item.image" style="clear: both;width: 96%;margin: 0.4rem 1rem 0.3rem 1rem; height: 1px;margin-left:0.7rem;background: #d3dde5"></div>
            </div>
            <div class="myApplyBottom" v-if="item.image">
              <div>
                <div class="myApplyBottomNrLeft">附件内容 ：</div>
                <div class="myApplyBottomNrRight">
                  <mt-button size="small" type="primary" @click="lookImages(item.image)">
                    查看图片
                  </mt-button>
                </div>
              </div>
            </div>
          </div>
          <div  class="myApply"  v-else-if="searchApplyRecord==null">
            没有数据
          </div>

        </mt-tab-container-item>

      </mt-tab-container>
      <mt-popup
        v-model="popupVisible"
        class="imageClass"
        closeOnClickModal="true"
      >
        <img width="150" :src="popImgSrc"  class="alertImages" v-if="popImgSrc"  />
        <div @click="closeImage" class="colseClass">
          关闭
        </div>
      </mt-popup>
    </div>
</template>
<script>
  import { DatetimePicker ,Radio  } from 'mint-ui';
  import { Navbar, TabItem,Toast,MessageBox,Popup } from 'mint-ui';

  import VueCoreImageUpload from 'vue-core-image-upload'
  import datePick from "@/components/components/datePick"
  import endDatePick from "@/components/components/endDatePick"
//  import { TabContainer, TabContainerItem } from 'mint-ui';
  import moment from 'moment'

  let df = 'YYYY-MM-DD HH:mm';
  let df2 = 'YYYY/MM/DD HH:mm';

  export default {
        data(){
            return {
              popImgSrc: '',
              popupVisible:false,
              closeOnClickModal:true,
              isActive:false, //显示下滑线
              isActive2:false, //显示下滑线
              isActive3:false, //显示下滑线
              isActive4:false, //显示下滑线
              tokenHeader: {
                openId: this.getCookie('openId')
              },
              selected: '1',
              selectedData:0,
              selectedDataApply:0,
              selectedDataApproval:0,
              pickerValue:'',
//              options: [
//                { text: '端午节', value: 'A' },
//                { text: '元宵', value: 'B' },
//                { text: '元旦', value: 'C' },
//                { text: '申请', value: 'D' },
//
//              ],
            optionsApproval: {},
              optionsApply: [
//                { text: '请假申请', value: 0 ,uid:12,type:'q'},
//                { text: '忘记打卡申请', value: 1 ,uid:2122 ,type:'w'},
//                { text: '外出申请', value: 2 ,uid:321152 ,type:'wc'},
//                { text: '加班申请', value:3 ,uid:42 ,type:'j'},

              ],
              selectedDataHoliday:0,
              optionsHoliday:[
//                { text: '端午节' },
//                { text: '元宵' },
//                { text: '元旦' },
//                { text: '申请' },
              ],
              imgSrc: {
                shenFenIcon: '',
                shenFenIconShow: require('../../assets/shenfenzheng.png'),
                selectShow: require('../../assets/arrow_2.png'),


              },
              changeApply:true,
              changeApplyTime:true,
//              changeApplyOutside:false,
              changeApplyOvertime:false, //加班时间div
              updateImage:true, //上传图片 div
              Remark:true, //备注div
              addTimeValue:'',  //加班时间value
              data:{},
              applyTypeArray:[], //申请
              applyTypeName:[], //申请
              approvalTypeObj:{}, // 审批人
              approvalTypeName:[], // 审批人
              holidayTypeArray:[], // 假期分类
              holidayTypeName:[], // 假期分类
              startTimeValue:'' , //开始时间value
              endTimeValue:'',  //结束时间value
              holidayModel:'',
              textareaString:'',
              qingjiauidParam:'',
              shengqingParam:'',
              shengqingParamType:'', //判断加班申请param的类型
              imagestring:'',
              searchApplyRecord:[], //搜索申请记录
              initUpImage:true, //初始化加载的上传图片

            }
        },
        mounted:function(){

        },
        created: function () {




          this.addTimeValue=this.getCookie('upAddTime');



//          this.addTimeValue=this.getCookie('leaveType');
          console.log(this.addTimeValue,'在打卡加班传来的加班时间');

          this.$http.get('/api/v1.0/client/findValidConfigs').then(response => { //查询申请类型列表
            this.applyTypeArray=response.body.result;
            console.log(this.applyTypeArray,'查询申请类型列表');
            for(let i=0;i<this.applyTypeArray.length;i++){
              this.applyTypeName.push(
                  {
                    text:this.applyTypeArray[i].name,
                    value:this.applyTypeArray[i].type,
                    uid:this.applyTypeArray[i].uid
                  }
                  )
            }
            console.log('我是申请类型data'+this.applyTypeName);
            this.$nextTick(()=>{
              this.optionsApply=this.applyTypeName;
              //此区域是在在点击提交申请的时候进行选中传参start
              this.selectedDataApply=this.getCookie('leaveType').toString();
//              this.shengqingclick(this.selectedDataApply);
              //此区域是在在点击提交申请的时候进行选中传参end




              //此处代码为了在打开提交时在提交申请时显示 start
              this.selectedDataApply=this.getCookie('leaveType');


              for(let i=0;i<this.optionsApply.length;i++){  //循环初始化的时候选中一个select属性值和参数

//                if(+value === this.optionsApply[i].value){
//                  this.shengqingParam = this.optionsApply[i].uid;
//                  this.shengqingParamType = this.optionsApply[i].value;
//                }
                this.shengqingParam = this.optionsApply[this.selectedDataApply].uid;
                this.shengqingParamType = this.optionsApply[this.selectedDataApply].value;
              }
              console.log(" this.shengqingParam uid" + this.shengqingParam);
              console.log("value shengqingParamType:" +this.shengqingParamType);



              if(this.selectedDataApply=='0'){ //请假
                console.log('选择请假路线');
                this.changeApply=true; //假期隐藏
                this.changeApplyTime=true; //时间隐藏
                this.updateImage=true; //上传图片隐藏
                this.changeApplyOvertime=false; //加班时间显示
                this.shengqingParamType = '0';
              }
              if(this.selectedDataApply=='1'){
                console.log('忘记打卡路线')
                this.changeApply=false; //假期隐藏
                this.changeApplyTime=true; //时间隐藏
                this.updateImage=true; //上传图片隐藏
                this.changeApplyOvertime=false; //加班时间显示
                this.shengqingParamType = '1';

              }
              if(this.selectedDataApply=='2'){
                console.log('外出申请路线')
                this.changeApply=false; //假期隐藏
                this.changeApplyTime=true; //时间隐藏
                this.updateImage=true; //上传图片隐藏
                this.changeApplyOvertime=false; //加班时间显示
                this.shengqingParamType = '2';

              }
              if(this.selectedDataApply=='3'){
                console.log('加班路线')
                this.changeApply=false; //假期隐藏
                this.changeApplyTime=false; //时间隐藏
                this.updateImage=false; //上传图片隐藏
                this.changeApplyOvertime=true; //加班时间显示
                this.shengqingParamType = '3';


              }
              //此处代码为了在打开提交时在提交申请时显示 start





            });


          }, response => {
            console.log( 'error callback');
          });

          this.$http.get('/api/v1.0/client/findReporter').then(response => { //审批人列表
            this.approvalTypeObj=response.body.result;
            console.log(this.approvalTypeObj,'审批人列表');

//            this.optionsApproval=this.approvalTypeName

          }, response => {
            console.log( 'error callback');
          });
          this.$http.get('/api/v1.0/client/findValidLeaves').then(response => { //假期分类
            this.holidayTypeArray=response.body.result;
            console.log(this.holidayTypeArray,'假期分类');
            for(let i=0;i<this.holidayTypeArray.length;i++){
              this.holidayTypeName.push(
                  {
                    text:this.holidayTypeArray[i].NAME,
                    value:this.holidayTypeArray[i].TYPE,
                    uid:this.holidayTypeArray[i].LEAVE_INFO_UID
                  })
            }
            this.$nextTick(()=>{
              this.optionsHoliday=this.holidayTypeName
            });


            console.log(this.optionsHoliday);

          }, response => {
            console.log( '假期分类 error callback');
          });

          let params={
            "status":"-1",
            "pageSize":100,
            "pageNumber":1
          };
          this.$http.post('/api/v1.0/client/findApplys',params).then(response => { //查询请假记录
            console.log(response.body.result,'查询请假记录');
            this.searchApplyRecord=response.body.result;

          }, response => {
            console.log( '查询请假记录 error callback');
          });


        },
      watch:{
        addTimeValue:function(val,oldVal){
          console.log('我是加班时间'+val);
          this.addTimeValue=val

        },
        holidayModel:function(val,oldVal){ //备注value 用于上传参数
            console.log(val);
            this.textareaString=val;
        },


      },
        methods: {
          changeShow(val){ //动态设置tab下划线显示
            let params
            if (val == 1) {
              this.isActive = true;
              this.isActive2 = false;
              this.isActive3 = false;
              this.isActive4 = false;
              params = {
                "status": "-1",
                "pageSize": 100,
                "pageNumber": 1
              }
            }
            if (val == 2) {
              this.isActive2 = true;
              this.isActive = false;
              this.isActive3 = false;
              this.isActive4 = false;
              params = {
                "status": "0",
                "pageSize": 100,
                "pageNumber": 1
              }
            }
            if (val == 3) {
              this.isActive3 = true;
              this.isActive2 = false;
              this.isActive = false;
              this.isActive4 = false;
              params = {
                "status": "1",
                "pageSize": 100,
                "pageNumber": 1
              }
            }
            if (val == 4) {
              this.isActive4 = true;
              this.isActive3 = false;
              this.isActive2 = false;
              this.isActive = false;
              params = {
                "status": "2",
                "pageSize": 100,
                "pageNumber": 1
              }
            }
            this.$http.post('/api/v1.0/client/findApplys', params).then(response => { //查询请假接口
              console.log(response);
              this.searchApplyRecord = response.body.result;
            }, response => {
              console.log('error callback');
            });

          },
          ieventStart(...data){
//            var timestamp2 = new Date(data[0]).getTime();
//            this.startTimeValue = timestamp2;
//            console.log(this.startTimeValue);
//            var timestamp2 = new Date(data[0]).getTime();
            console.log(data[0].toLocaleString().replace(/-/g, "/"),'data[0]');

            this.startTimeValue = new Date(data[0].toLocaleString().replace(/-/g, "/")).getTime();
            console.log(this.startTimeValue,'this.startTimeValue转出的开始');

          },
          ieventEnd(...data){
//            console.log('allEndData:', data);
//            var timestamp3 = new Date(data[0]).getTime();
//            console.log(timestamp3);

            console.log(data[0].toLocaleString().replace(/-/g, "/"),'data[0]');

            this.endTimeValue = new Date(data[0].toLocaleString().replace(/-/g, "/")).getTime();
            console.log(this.endTimeValue,'this.endTimeValue结束')
          },
          handerDataSubmit(){
            let params;
            if (this.selectedDataApply == '0') { //请假申请所需参数
              params = {
                approvalConfigUid: this.shengqingParam,//申请分类
                currentApprover: this.approvalTypeObj ? this.approvalTypeObj.UID : '',
                leaveUid: this.qingjiauidParam,
                startTime: this.startTimeValue,
                endTime: this.endTimeValue,
                image: this.imgSrc.shenFenIcon,
                remarks: this.textareaString
              };
            }
            ;
            if (this.selectedDataApply == '2' || this.selectedDataApply == '1') { //忘打卡或外出申请所需参数
              params = {
                approvalConfigUid: this.shengqingParam,//申请分类
                currentApprover: this.approvalTypeObj ? this.approvalTypeObj.UID : '',
                startTime: this.startTimeValue,
                endTime: this.endTimeValue,
                image: this.imgSrc.shenFenIcon,
                remarks: this.textareaString
              };
            }
            ;
            if (this.selectedDataApply == '3') { //加班所需参数
              params = {
                approvalConfigUid: this.shengqingParam,  //申请分类
                currentApprover: this.approvalTypeObj ? this.approvalTypeObj.UID : '',
                overworkTime: this.addTimeValue,
                remarks: this.textareaString,

              }
            }
            this.$http.post('/api/v1.0/client/apply', params).then(response => { //提交请假申请
              console.log(response);

              if (response.body.code == 200) {
                MessageBox('提示', response.body.message)
                this.$router.push({path: '/signIn'});
              } else if (response.body.code == 500) {
                MessageBox('提示', response.body.message);
              }
//              this.holidayTypeArray=response.body.result;
//              console.log(this.holidayTypeArray);
//            for(let i=0;i<this.applyTypeArray.length;i++){
//              this.applyTypeName.push({text:this.applyTypeArray[i].name, value:this.applyTypeArray[i].type,})
//            }
//            console.log(this.applyTypeName);
//            this.optionsApply=this.applyTypeName

            }, response => {
              console.log('error callback');
            });
          },
          imageuploaded(res) { //用于图片参数上传
            console.log(res);
            this.imgSrc.shenFenIcon = res.result;
            this.initUpImage = false;  //把初始化的image隐藏
//            if (res) {
//              this.imgSrc.shenFenIcon = res.result;
//              console.log(this.imgSrc.shenFenIcon);
//            }

          },
          handerStartValue(){
            console.log('我是开始时间' + this.startTimeValue);
          },
          shengqingclick(value){ //初始是选中一个select然后进行参数选中为了提交用
//          alert(this.selectedDataApply);
            console.log(value, typeof value);
//            return;
            console.log(this.optionsApply, 'this.optionsApply')

            function dd(y, array) {
              for (let i = 0; i < array.length; i++) {  //循环初始化的时候选中一个select属性值和参数
                if (y == array[i].value) {
                  return array[i];
                }
              }
            }


            let result = dd(this.selectedDataApply, this.optionsApply);
            this.shengqingParam = result.uid;
            this.shengqingParamType = result.type;
            console.log(" this.shengqingParam uid" + this.shengqingParam);
            console.log("value shengqingParamType:" + this.shengqingParamType);


            if (this.selectedDataApply == '0') { //请假
              console.log('选择请假路线');
              this.changeApply = true; //假期隐藏
              this.changeApplyTime = true; //时间隐藏
              this.updateImage = true; //上传图片隐藏
              this.changeApplyOvertime = false; //加班时间显示
              this.shengqingParamType = '0';
            }
            if (this.selectedDataApply == '1') {
              console.log('忘记打卡路线')
              this.changeApply = false; //假期隐藏
              this.changeApplyTime = true; //时间隐藏
              this.updateImage = true; //上传图片隐藏
              this.changeApplyOvertime = false; //加班时间显示
              this.shengqingParamType = '1';

            }
            if (this.selectedDataApply == '2') {
              console.log('外出申请路线')
              this.changeApply = false; //假期隐藏
              this.changeApplyTime = true; //时间隐藏
              this.updateImage = true; //上传图片隐藏
              this.changeApplyOvertime = false; //加班时间显示
              this.shengqingParamType = '2';

            }
            if (this.selectedDataApply == '3') {
              console.log('加班路线')
              this.changeApply = false; //假期隐藏
              this.changeApplyTime = false; //时间隐藏
              this.updateImage = false; //上传图片隐藏
              this.changeApplyOvertime = true; //加班时间显示
              this.shengqingParamType = '3';


            }
          },

          qingjiaclick(value){
            this.qingjiauidParam= value.uid;
            console.log('我是选中的假期类型'+ this.qingjiauidParam);

          },
          lookImages(imgSrc){ //查看图片
            console.log('图片')
            if(imgSrc) this.popImgSrc = imgSrc;
            else this.popImgSrc = '';
            this.popupVisible=true;
          },
          closeImage(){
            this.popupVisible=false;
            console.log('关闭');
            //做到这里
          },
          datefmt(str) {
              if(str) return moment(str).format(df);
              else return '';
          }

        },

      components: {
        'vue-core-image-upload': VueCoreImageUpload,
        'datePick': datePick,
        'endDatePick':endDatePick,
      },
    }

</script>

<style scoped>
  /*.changeSelect::after*/
  /*{*/
    /*content:" ------- ";*/
    /*!*content: url(../../assets/ico_leave.png);*!*/
    /*!*font-size: 0.5em;*!*/
    /*!*background-size: 19px 20px;*!*/
    /*!*display: inline-block;*!*/
    /*background-color:yellow;*/
    /*!*color:#ffffff;*!*/
    /*width: 10%;*/
  /*}*/
  .selectBao{
    position: absolute;
    width: 2rem;
    height: 1.5rem;
    /*background: pink;*/
    top:0.3rem;
    right:0
  }
  .selectShowImg{
    width: 50%;
    height: 50%;
  }
  .hrClass{
    width: 96%;
    margin:0 0.8rem;
    height: 1px;
    background: #cccccc;
    line-height: 1px
  }
  .contentClass{
    display: flex;
    padding: 0.5rem 1rem;
  }
  .contentLeft{
    flex:1;
    text-align: left;
  }
  .contentRight{
    flex:3;
  }

  .colseClass{
    height: 3rem;
    line-height: 3rem;
    text-align: center;
    background: #26a2ff;
    width: 20rem;
    color: #ffffff;
  }
  .alertImages{
    width: 100%;
    height: 100%;
    display: block;
  }
  .imageClass{
    width: 20rem;
    /*top: 10rem;*/
    height: 24rem;
    line-height: 24rem;

  }
  .myApplyTitle{
    background: #d3dde7;
  }
  .myApplyBottom{
    padding-bottom: 1rem;
  }
  .showARightSpan{
    width: 15rem;
    height:2rem;
    line-height: 2rem;
    text-align: left;
  }
  .dateTimeInput{
    border: none;
    width: 15rem;
    height:2rem;
    line-height: 2rem;
    text-align: left;
    font-size: 0.8rem;
  }
  .dataTitle span{
    font-size: 1.4rem;
  }
  .changeSelect{
    width: 98%;
    display: block;
    height: 2rem;
    border: none;
    font-size: 1.1rem;
    background: #ffffff;
    -webkit-appearance: none;
  }
  .cardClass{
    width: 11rem;
    height: 6rem;
    line-height: 6rem;
    padding-bottom: 1rem;
    position: absolute;
    left: 33%;
    top: 1.6rem;
  }
  /*.cardClass div{*/
    /*width: 9rem;*/
    /*height: 6.2rem;*/
    /*position: absolute;*/
    /*font-size: 1.1rem;*/
  /*}*/
  .CardImg{
    display: block;
    width: 80%;
    height: 80%;
    padding-left: 0rem;

  }
  .CardDivImg{
    display: block;
    width: 11rem;
    height: 6rem;
    padding-left: 0rem;

  }
  .myApply{
    width: 92%;
    min-height: 12rem;
    margin: 1rem 1rem 0 1rem;
    border-radius: 6px;
    border: 1px solid #cccccc;
  }
  .myApplyTitleLeft{
    width: 11rem;
    text-align: left;
    height: 3rem;
    line-height: 3rem;
    float: left;
    font-weight: 600;
    font-size:1.3rem ;
  }
  .myApplyContentLeft{
    width: 7rem;
    height: 3rem;
    line-height: 3rem;
    text-align: left;
    font-weight: 600;
    padding-left: 0.8rem;
    font-size:1.2rem ;
  }
  .myApplyContentNr{
    width: 22rem;
    height: 1rem;
    line-height: 1rem;
    text-align: left;
    padding-left: 0.8rem;
    font-size:1.2rem ;
  }
  .myApplyBottomNrLeft{
    width: 6.5rem;
    display: inline-block;
    height: 1rem;
    line-height: 1rem;
    text-align: left;
    font-size:1.2rem ;
  }
  .myApplyBottomNrRight{
    width: 15rem;
    display: inline-block;
    height: 1rem;
    line-height: 1rem;
    text-align: left;
    font-size:1.2rem ;
  }
  .myApplyTitleRight{
    width: 7rem;
    height: 3rem;
    line-height: 3rem;
    float: right;
    font-weight: 600;
    font-size:1.3rem ;
  }
  .changeShowList{
    flex: 1;
  }
  .changeTitleClass{
    display: flex;
    background: rgb(29,139,224);
    color:#ffffff;
    height: 2.5rem;
    line-height: 2.5rem;
  }
  .active{
    width: 24%;
    border-bottom: 0.2rem solid;
  }
  .active2{
    width: 24%;
    border-bottom: 0.2rem solid;

  }
  .active3{
    width: 24%;
    border-bottom: 0.2rem solid;
  }
  .active4{
    width: 24%;
    border-bottom: 0.2rem solid;

  }
</style>
