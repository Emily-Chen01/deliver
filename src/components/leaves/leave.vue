<template>
    <div>
      <!--请假申请-->
      <mt-navbar v-model="selected" class="dataTitle">
        <mt-tab-item id="1"  ><span>填写申请</span></mt-tab-item>
        <mt-tab-item id="2"><span>我的申请</span></mt-tab-item>
      </mt-navbar>

      <!-- tab-container -->
      <mt-tab-container v-model="selected" style="margin-top: 1rem">
        <mt-tab-container-item id="1">
          <!--个人资料-->
          <mt-field label="申请分类"  >
            <select v-model="selectedDataApply" class="changeSelect"  @change="shengqingclick(selectedDataApply)">
              <option v-for="option in optionsApply"  v-bind:value="option" >
                {{ option.text }}
              </option>
            </select>
          </mt-field>
          <div v-if="changeApply">
            <mt-field label="假期分类"  >
              <select v-model="selectedDataHoliday" class="changeSelect" @change="qingjiaclick(selectedDataHoliday)" >
                <option v-for="option in optionsHoliday" v-bind:value="option">
                  {{ option.text }}
              </option>
              </select>
            </mt-field>
          </div>
          <div v-if="changeApplyTime">
            <mt-field label="开始时间"  >

                <div class="showARightSpan"   >
                  <datePick @ieventStart = "ieventStart" ></datePick>
                </div>

              </mt-field>
              <mt-field label="结束时间" >
                <div class="showARightSpan">
                  <endDatePick  @ieventEnd = "ieventEnd"></endDatePick>
                </div>
              </mt-field>
          </div>
            <mt-field style="height: 8rem;line-height: 8rem;position: relative" v-if="updateImage">
              <div class="cardClass">
                <div>
                  <vue-core-image-upload
                    :crop="false"
                    @imageuploaded="imageuploaded"
                    :data="data"
                    :headers="tokenHeader"
                    :max-file-size="5242880"
                    url="api/v1.0/client/upload" >
                    <img width="150" :src="imgSrc.shenFenIcon"  class="CardImg"  />
                  </vue-core-image-upload>
                </div>
              </div>
            </mt-field>
            <div  style="width: 24rem;height: 7rem;">
              <div style="width: 23.5rem;margin-left:1rem;height: 1px;background: #cccccc;line-height: 1px"></div>
              <div style="text-align:left;font-size: 1.2rem;padding:0.2rem 0 0.5rem 1.4rem">备注</div>
              <textarea placeholder="#请输入文字"
                        v-model="holidayModel"
                        style=" overflow: hidden;overflow-y: scroll;width: 20rem;height: 4rem;border-radius: 4px">
            </textarea>
            </div>
          <div v-if="changeApplyOvertime">
            <mt-field label="加班时长" v-model="addTimeValue" >
            </mt-field>
          </div>

            <mt-field label="审批人"  style="margin-top: 1rem">
              <div class="showARightSpan">{{approvalTypeObj.NAME}}</div>
            </mt-field>

      <div>
      </div>
          <div style="padding-top: 0.6rem">
            <mt-button type="primary"
                       style="background-color: rgb(139,156,172);width: 20rem;height:3rem;line-height: 3rem"
                       @click.native="handerDataSubmit()">提交
             </mt-button>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="2">
          <!--我的申请-->
          <div class="myApply">
            <div class="myApplyTitle">
              <div class="myApplyTitleLeft">病假申请</div>
              <div class="myApplyTitleRight">审核中</div>
              <div style="clear: both;width: 22rem;height: 1px;margin-left:0.7rem;background: #000000"></div>
            </div>
            <div class="myApplyContent">
              <div class="myApplyContentLeft">起止日期</div>

              <div class="myApplyContentNr">521315-231251</div>
              <div class="myApplyContentLeft">事由</div>
              <div class="myApplyContentNr">难受中</div>
              <div style="clear: both;width: 22rem;margin: 0.8rem 1rem; height: 1px;margin-left:0.7rem;background: #000000"></div>
            </div>
            <div class="myApplyBottom">
              <div>
                <div class="myApplyBottomNrLeft">附件内容 ：</div>
                <div class="myApplyBottomNrRight">xxxxx.jpg</div>
              </div>
            </div>
          </div>

        </mt-tab-container-item>

      </mt-tab-container>

    </div>
</template>
<script>
  import { DatetimePicker } from 'mint-ui';
  import VueCoreImageUpload from 'vue-core-image-upload'
  import datePick from "@/components/components/datePick"
  import endDatePick from "@/components/components/endDatePick"




  export default {
        data(){
            return {
              tokenHeader: {
                openId: sessionStorage.getItem('openId')
              },
              selected: '1',
              selectedData:0,
              selectedDataApply:0,
              selectedDataApproval:0,
              pickerValue:'',
              options: [
                { text: '端午节', value: 'A' },
                { text: '元宵', value: 'B' },
                { text: '元旦', value: 'C' },
                { text: '申请', value: 'D' },

              ],
            optionsApproval: {},
              optionsApply: [
                { text: '请假申请', value: 0 ,uid:12,type:'q'},
                { text: '忘记打卡申请', value: 1 ,uid:22 ,type:'w'},
                { text: '外出申请', value: 2 ,uid:32 ,type:'wc'},
                { text: '加班申请', value:3 ,uid:42 ,type:'j'},

              ],
              selectedDataHoliday:0,
              optionsHoliday:[
                { text: '端午节' },
                { text: '元宵' },
                { text: '元旦' },
                { text: '申请' },
              ],
              imgSrc: {
                shenFenIcon: require('../../assets/shenfenzheng.png'),
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
              imagestring:'',

            }
        },
        mounted:function(){
//          var calendar = new lCalendar();
//          calendar.init({
//            'trigger': '#demo1,#demo2',//标签id
//            'type': 'datetime',//date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择
//            'minDate':'1900-1-1',//最小日期 注意：该值会覆盖标签内定义的日期范围
//            'maxDate':'2020-1-1'//最大日期 注意：该值会覆盖标签内定义的日期范围
//          });

        },
        created: function () {
//          this.optionsApply= [
//            { text: '请选择', value: 0 ,uid:2},],




          this.$http.get('api/v1.0/client/findValidConfigs').then(response => { //查询申请类型列表
            this.applyTypeArray=response.body.result;
            console.log(this.applyTypeArray);
            for(let i=0;i<this.applyTypeArray.length;i++){
              this.applyTypeName.push(
                  {
                    text:this.applyTypeArray[i].name,
                    value:this.applyTypeArray[i].type,
                    uid:this.applyTypeArray[i].uid
                  }
                  )
            }
            console.log(this.applyTypeName);
            this.optionsApply=this.applyTypeName

          }, response => {
            console.log( 'error callback');
          });

          this.$http.get('api/v1.0/client/findReporter').then(response => { //审批人列表
            this.approvalTypeObj=response.body.result;
            console.log(this.approvalTypeObj);

//            this.optionsApproval=this.approvalTypeName

          }, response => {
            console.log( 'error callback');
          });
          this.$http.get('api/v1.0/client/findValidLeaves').then(response => { //假期分类
            this.holidayTypeArray=response.body.result;
            console.log(this.holidayTypeArray);
            for(let i=0;i<this.holidayTypeArray.length;i++){
              this.holidayTypeName.push(
                  {
                    text:this.holidayTypeArray[i].NAME,
                    value:this.holidayTypeArray[i].TYPE,
                    uid:this.holidayTypeArray[i].LEAVE_INFO_UID
                  })
            }
            this.optionsHoliday=this.holidayTypeName
            console.log(this.optionsHoliday);

          }, response => {
            console.log( 'error callback');
          });


        },
      watch:{
        addTimeValue:function(val,oldVal){
          console.log('我是加班时间'+val);
          
        },
//        selectedDataApply:function(val,oldVal){
////            console.log(val);
//
//            if(val==0){
//              this.changeApply=true;
//              this.changeApplyTime=false;
//              this.changeApplyOutside=false
//              this.changeApplyOvertime=false
//
//            }else if(val==1){
//              this.changeApplyTime=true;
//              this.changeApplyOutside=false;
//              this.changeApply=false;
//              this.changeApplyOvertime=false
//            }else if(val==2){
//                this.changeApplyOutside=true;
//                this.changeApplyTime=false;
//                this.changeApply=false;
//                this.changeApplyOvertime=false
//            }
//            else if(val==3){
//              this.changeApplyOvertime=true;
//              this.changeApplyOutside=false;
//              this.changeApplyTime=false;
//              this.changeApply=false;
//            }
//        },
        holidayModel:function(val,oldVal){ //备注value 用于上传参数
            console.log(val);
            this.textareaString=val;
        }
      },
        methods: {
          ieventStart(...data){
            var timestamp2 = new Date(data[0]).getTime();
            this.startTimeValue=timestamp2;
            console.log(this.startTimeValue);

          },
          ieventEnd(...data){
            console.log('allEndData:',data);
            var timestamp3 = new Date(data[0]).getTime();
            console.log(timestamp3);
            this.endTimeValue=timestamp3;
          },
          handerDataSubmit(){
              let params ={
                approvalConfigUid:this.shengqingParam,
                currentApprover:this.approvalTypeObj.UID,
                leaveUid:this.qingjiauidParam,
                startTime: this.startTimeValue,
                endTime:this.endTimeValue,
                image:this.imagestring,
                remarks:this.textareaString

              }
            this.$http.post('api/v1.0/client/apply',params).then(response => { //提交请假申请
//              this.holidayTypeArray=response.body.result;
//              console.log(this.holidayTypeArray);
//            for(let i=0;i<this.applyTypeArray.length;i++){
//              this.applyTypeName.push({text:this.applyTypeArray[i].name, value:this.applyTypeArray[i].type,})
//            }
//            console.log(this.applyTypeName);
//            this.optionsApply=this.applyTypeName
              console.log(response);

            }, response => {
              console.log( 'error callback');
            });
          },
          imageuploaded(res) { //用于图片参数上传
            console.log(res);
            this.imagestring=res.result;
//            if (res) {
//              this.imgSrc.shenFenIcon = res.result;
//              console.log(this.imgSrc.shenFenIcon);
//            }

          },
          handerStartValue(){
              console.log('我是开始时间'+this.startTimeValue);
          },
          shengqingclick(value){
            this.shengqingParam= value.uid;
            console.log('我是选中的申请类型'+ this.shengqingParam);
            if(value.type=='q'){ //请假
                console.log('选择请假路线')
            }
            if(value.type=='w'){
              console.log('忘记打卡路线')
            }
            if(value.type=='wc'){
              console.log('外出申请路线')
            }
            if(value.type=='j'){
              console.log('加班路线')
              this.changeApply=false; //假期隐藏
              this.changeApplyTime=false; //时间隐藏
              this.updateImage=false; //上传图片隐藏
              this.changeApplyOvertime=true; //加班时间显示





            }
          },
          qingjiaclick(value){
            this.qingjiauidParam= value.uid;
            console.log('我是选中的假期类型'+ this.qingjiauidParam);

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
    width: 14rem;
    display: block;
    height: 2.5rem;
    border: none;
    font-size: 1.22rem;
  }
  .cardClass{
    width: 11rem;
    height: 6rem;
    line-height: 6rem;
    padding-bottom: 1rem;
    position: absolute;
    left: -15rem;
    top: -3rem;
  }
  .cardClass div{
    width: 9rem;
    height: 6.2rem;
    position: absolute;
    font-size: 1.1rem;
  }
  .CardImg{
    display: block;
    width: 80%;
    height: 80%;
    padding-left: 0rem;

  }
  .myApply{
    width: 23.2rem;
    height: 14.5rem;
    margin-top: 1rem;
    border-radius: 6px;
    border: 1px solid #cccccc;
  }
  .myApplyTitleLeft{
    width: 7rem;
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
</style>
