<template>
    <div>
      <mt-navbar v-model="selected" class="dataTitle">
        <mt-tab-item id="1" @@@click="handerClickInit" ><span>个人资料</span></mt-tab-item>
        <mt-tab-item id="2"><span>岗位信息</span></mt-tab-item>
      </mt-navbar>

      <!-- tab-container -->
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="1">
          <!--个人资料-->
          <mt-field label="性别"  >
            <select v-model="selectedData" class="changeSelect">
              <option v-for="option in options" v-bind:value="option.value">
                {{ option.text }}
              </option>
            </select>
          </mt-field>
          <mt-field label="手机号" placeholder="请输入手机号" type="number"></mt-field>
          <mt-field label="国家/地区" placeholder="大陆地区"  ></mt-field>
          <mt-field label="身份证号" placeholder=""  >215159654236987452</mt-field>
          <mt-field label="" placeholder=""  style="height: 9.2rem;line-height: 9.2rem" >
            <div class="cardClass">
              <a @click.native="handerClickUp()">
                <img :src="imgSrc.shenFenIcon" class="CardImg">
                <div>上传身份证正面</div>
              </a>
            </div>
            <div class="cardClass">
              <a @click.native="handerClickUp()">
                <img :src="imgSrc.shenFenIcon" class="CardImg">
                <div>上传身份证背面</div>
              </a>
            </div>
          </mt-field>
          <mt-field label="公积金账号" placeholder="" type="number"></mt-field>
          <mt-field label="银行卡号" placeholder=""  ></mt-field>
          <mt-field label="开户行" placeholder=""  ></mt-field>

        </mt-tab-container-item>
        <mt-tab-container-item id="2">
          <!--岗位信息-->
          <mt-field label="入职日期" placeholder="" type="number"></mt-field>
          <mt-field label="聘用形式" placeholder=""  ></mt-field>
          <mt-field label="合同类型" placeholder=""  ></mt-field>

          <mt-field label="职位" placeholder="" type="number"></mt-field>
          <mt-field label="所在部门" placeholder=""  ></mt-field>
          <mt-field label="转正日期" placeholder=""  ></mt-field>

          <mt-field label="司龄" placeholder="" type="number"></mt-field>
          <mt-field label="首次工作时间" placeholder=""  ></mt-field>
          <mt-field label="工作邮箱" placeholder=""  ></mt-field>

          <mt-field label="工作电话" placeholder="" type="number"></mt-field>
          <mt-field label="工号" placeholder=""  ></mt-field>
          <mt-field label="合同类型" placeholder=""  ></mt-field>


        </mt-tab-container-item>

      </mt-tab-container>
      <div style="padding-top: 0.6rem">
        <mt-button type="primary"
                   style="background-color: rgb(139,156,172);width: 20rem;height:3rem;line-height: 3rem"
                   @click.native="handerDataSubmit()">更新我的资料
        </mt-button>
      </div>


    </div>
</template>
<script>
  import { Navbar, TabItem ,mtTabContainerItem} from 'mint-ui';
    export default {
        data(){
            return {
              selected: '1',
              selectedData:'',
              options: [
                { text: '男', value: 'A' },
                { text: '女', value: 'B' },
              ],
              imgSrc: {
                shenFenIcon: require('../../assets/shenfenzheng.png'),
              },
            }
        },
        created: function () {
          this.handerClickInit();
        },

        methods: {
          handerClickInit(){
            this.initStyle=true;
          },
          handerDataSubmit(){
            alert('请填写完整表单');
          },
          handerClickUp(){
            alert(11);
          },
        },
        components: {
            //      ManyCompany
        }
    }

</script>

<style scoped>
  is-selected {
    border-bottom: 3px solid #26a2ff;
    color: #26a2ff;
    margin-bottom: -3px;
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
    float: left;
    position: relative;
    padding-bottom: 1rem;
  }
  .cardClass div{
    width: 9rem;
    height: 1.2rem;
    position: absolute;
    top:3.5rem;
    font-size: 1.1rem;
  }
  .CardImg{
    display: block;
    width: 80%;
    height: 90%;
    padding-left: 0.6rem;

  }
</style>
