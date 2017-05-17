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
            <select v-model="selectedData" class="changeSelect" >
              <option v-for="option in options" v-bind:value="option.value">
                {{ option.text }}
              </option>
            </select>
          </mt-field>
          <div v-if="changeApply">
            <mt-field label="假期分类"  >
              <select v-model="selectedData" class="changeSelect">
                <option v-for="option in options" v-bind:value="option.value">
                  {{ option.text }}
              </option>
              </select>
            </mt-field>
            <mt-field label="开始时间"  >

            </mt-field>
            <mt-field label="结束时间" >
              <select v-model="selectedData" class="changeSelect">
                <option v-for="option in options" v-bind:value="option.value">
                  {{ option.text }}
              </option>
              </select>
            </mt-field>
            <mt-field style="height: 8rem;line-height: 8rem;position: relative">
              <div class="cardClass">
                <a @@@click.native="handerClickUp()">
                  <img :src="imgSrc.shenFenIcon" class="CardImg">
                  <div>上传图片</div>
                </a>
              </div>
            </mt-field>
            <div style="width: 24rem;height: 7rem;">
              <div style="width: 23.5rem;margin-left:1rem;height: 1px;background: #cccccc;line-height: 1px"></div>
              <div style="text-align:left;font-size: 1.2rem;padding:0.2rem 0 0.5rem 1.4rem">备注</div>
              <textarea placeholder="#请输入文字"
                        style=" overflow: hidden;overflow-y: scroll;width: 20rem;height: 4rem;border-radius: 4px">
            </textarea>
            </div>

            <mt-field label="审批人"  style="margin-top: 1rem">
              <select v-model="selectedData" class="changeSelect">
                <option v-for="option in options" v-bind:value="option.value">
                  {{ option.text }}
              </option>
              </select>
            </mt-field>
          </div>
          <div v-if="changeApplyForget">
            <mt-field label="开始时间"  >

            </mt-field>
            <mt-field label="结束时间" >
              <select v-model="selectedData" class="changeSelect">
                <option v-for="option in options" v-bind:value="option.value">
                  {{ option.text }}
              </option>
              </select>
            </mt-field>
            <mt-field style="height: 8rem;line-height: 8rem;position: relative">
              <div class="cardClass">
                <a @@@click.native="handerClickUp()">
                  <img :src="imgSrc.shenFenIcon" class="CardImg">
                  <div>上传图片</div>
                </a>
              </div>
            </mt-field>
            <div style="width: 24rem;height: 7rem;">
              <div style="width: 23.5rem;margin-left:1rem;height: 1px;background: #cccccc;line-height: 1px"></div>
              <div style="text-align:left;font-size: 1.2rem;padding:0.2rem 0 0.5rem 1.4rem">备注</div>
              <textarea placeholder="#请输入文字"
                        style=" overflow: hidden;overflow-y: scroll;width: 20rem;height: 4rem;border-radius: 4px">
            </textarea>
            </div>

            <mt-field label="审批人"  style="margin-top: 1rem">
              <select v-model="selectedData" class="changeSelect">
                <option v-for="option in options" v-bind:value="option.value">
                  {{ option.text }}
              </option>
              </select>
            </mt-field>
          </div>
          <div v-if="changeApplyOutside">
            <mt-field label="开始时间"  >

            </mt-field>
            <mt-field label="结束时间" >
              <select v-model="selectedData" class="changeSelect">
                <option v-for="option in options" v-bind:value="option.value">
                  {{ option.text }}
              </option>
              </select>
            </mt-field>
            <mt-field style="height: 8rem;line-height: 8rem;position: relative">
              <div class="cardClass">
                <a @@@click.native="handerClickUp()">
                  <img :src="imgSrc.shenFenIcon" class="CardImg">
                  <div>上传图片</div>
                </a>
              </div>
            </mt-field>
            <div style="width: 24rem;height: 7rem;">
              <div style="width: 23.5rem;margin-left:1rem;height: 1px;background: #cccccc;line-height: 1px"></div>
              <div style="text-align:left;font-size: 1.2rem;padding:0.2rem 0 0.5rem 1.4rem">备注</div>
              <textarea placeholder="#请输入文字"
                        style=" overflow: hidden;overflow-y: scroll;width: 20rem;height: 4rem;border-radius: 4px">
            </textarea>
            </div>

            <mt-field label="审批人"  style="margin-top: 1rem">
              <select v-model="selectedData" class="changeSelect">
                <option v-for="option in options" v-bind:value="option.value">
                  {{ option.text }}
              </option>
              </select>
            </mt-field>
          </div>
          <div v-if="changeApplyOvertime">
            <mt-field label="加班时长"  >

            </mt-field>
            <div style="width: 24rem;height: 7rem;">
              <div style="width: 23.5rem;margin-left:1rem;height: 1px;background: #cccccc;line-height: 1px"></div>
              <div style="text-align:left;font-size: 1.2rem;padding:0.2rem 0 0.5rem 1.4rem">备注</div>
              <textarea placeholder="#请输入文字"
                        style=" overflow: hidden;overflow-y: scroll;width: 20rem;height: 4rem;border-radius: 4px">
            </textarea>
            </div>

            <mt-field label="审批人"  style="margin-top: 1rem">
              <select v-model="selectedData" class="changeSelect">
                <option v-for="option in options" v-bind:value="option.value">
                  {{ option.text }}
              </option>
              </select>
            </mt-field>
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

    export default {
        data(){
            return {
              selected: '1',
              selectedData:'A',
              pickerValue:'',
              options: [
                { text: '请假申请', value: 'A' },
                { text: '忘记打卡申请', value: 'B' },
                { text: '外出申请', value: 'C' },
                { text: '加班申请', value: 'D' },

              ],
              imgSrc: {
                shenFenIcon: require('../../assets/shenfenzheng.png'),
              },
              changeApply:true,
              changeApplyForget:false,
              changeApplyOutside:false,
              changeApplyOvertime:false,
            }
        },
        created: function () {

        },
      watch:{
        selectedData:function(val,oldVal){
            console.log(val);

            if(val=='A'){
              this.changeApply=true;
              this.changeApplyForget=false;
              this.changeApplyOutside=false
              this.changeApplyOvertime=false

            }else if(val=='B'){
              this.changeApplyForget=true;
              this.changeApplyOutside=false;
              this.changeApply=false;
              this.changeApplyOvertime=false
            }else if(val=='C'){
                this.changeApplyOutside=true;
                this.changeApplyForget=false;
                this.changeApply=false;
                this.changeApplyOvertime=false
            }
            else if(val=='D'){
              this.changeApplyOvertime=true;
              this.changeApplyOutside=false;
              this.changeApplyForget=false;
              this.changeApply=false;
            }
        }
      },
        methods: {
          handerDataSubmit(){

          },
          handleConfirm(){
              alert(11)
          },
          openPicker() {
            this.$refs.picker.open();
          }
        },

        components: {
            //      ManyCompany
        }
    }

</script>

<style scoped>
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
    height: 1.2rem;
    position: absolute;
    top:2.8rem;
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
