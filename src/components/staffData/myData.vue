<template>
    <div>
      <mt-navbar v-model="selected" class="dataTitle">
        <mt-tab-item id="1"  ><span>个人资料</span></mt-tab-item>
        <mt-tab-item id="2"><span>岗位信息</span></mt-tab-item>
      </mt-navbar>

      <!-- tab-container -->
      <mt-tab-container v-model="selected" style="margin-top: 1rem">
        <mt-tab-container-item id="1">
          <div v-if="submitDivShow">
            <!--展示-->
            <mt-field label="性别"  >
              <div class="showARightSpan">{{stationObj.baseSalary}}</div>
            </mt-field>
            <mt-field v-model="phone" label="手机号" placeholder="" type="number">
              <div class="showARightSpan">{{stationObj.baseSalary}}</div>
            </mt-field>
            <mt-field v-model="address" label="国家/地区" placeholder=""  >
              <div class="showARightSpan">{{stationObj.baseSalary}}</div>
            </mt-field>
            <mt-field v-model="card" label="身份证号" placeholder="" type="number" >
              <div class="showARightSpan">{{stationObj.baseSalary}}</div>
            </mt-field>
            <mt-field  label="" placeholder=""  style="height: 8.2rem;line-height: 8.2rem" >
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
            <mt-field v-model="gold" label="公积金账号" placeholder="" type="number">
              <div class="showARightSpan">{{stationObj.baseSalary}}</div>
            </mt-field>
            <mt-field v-model="bankCard" label="银行卡号" placeholder="" type="number"  >
              <div class="showARightSpan">{{stationObj.baseSalary}}</div>
            </mt-field>
            <mt-field v-model="openBank" label="开户行" placeholder=""  >
              <div class="showARightSpan">{{stationObj.baseSalary}}</div>
            </mt-field>
          </div>

          <div v-if="submitDivHide">
            <!--编辑-->
            <mt-field label="性55别"  >
              <select v-model="selectedData" class="changeSelect" >
                <option v-for="option in options" :value="option.value" >
                  {{ option.text }}
              </option>
              </select>
            </mt-field>
            <mt-field v-model="phone" label="手机号" placeholder="请输入手机号" type="number"></mt-field>
            <mt-field v-model="address" label="国家/地区" placeholder="大陆地区"  ></mt-field>
            <mt-field v-model="card" label="身份证号" placeholder="请输入身份证号" type="number" ></mt-field>
            <mt-field  label="" placeholder=""  style="height: 8.2rem;line-height: 8.2rem" >
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
            <mt-field v-model="gold" label="公积金账号" placeholder="请输入公积金账号" type="number"></mt-field>
            <mt-field v-model="bankCard" label="银行卡号" placeholder="请输入银行卡" type="number"  ></mt-field>
            <mt-field v-model="openBank" label="开户行" placeholder="请输入开户行"  ></mt-field>
          </div>

          <div style="width: 23.5rem;margin-left:1rem;height: 1px;background: #cccccc;line-height: 1px"></div>
          <div style="padding-top: 0.6rem" v-if="submitDivShow">
            <mt-button type="primary"
                       style="background-color: rgb(139,156,172);width: 20rem;height:3rem;line-height: 3rem"
                       @click.native="handerDataSubmit()">编辑我的资料
             </mt-button>
          </div>
          <div style="padding-top: 0.6rem" v-if="submitDivHide">
            <mt-button type="primary"
                       style="background-color: rgb(139,156,172);width: 20rem;height:3rem;line-height: 3rem"
                       @click.native="handerDataSubmit2()">保存我的资料
             </mt-button>
          </div>
        </mt-tab-container-item>


        <mt-tab-container-item id="2">
          <!--岗位信息-->
          <mt-field label="入职日期" placeholder="" type="number">
            <div class="showARightSpan">{{stationObj.baseSalary}}</div>
          </mt-field>
          <mt-field label="聘用形式" placeholder=""  >
            <div class="showARightSpan">{{stationObj.baseSalary}}</div>
          </mt-field>
          <mt-field label="合同类型" placeholder=""  >
            <div class="showARightSpan">{{stationObj.trialSalary}}</div>
          </mt-field>

          <mt-field label="职位" placeholder="" type="number">
            <div class="showARightSpan">{{stationObj.position}}</div>
          </mt-field>
          <mt-field label="所在部门" placeholder=""  >
            <div class="showARightSpan">{{stationObj.deptName}}</div>
          </mt-field>
          <mt-field label="转正日期" placeholder=""  >
            <div class="showARightSpan">{{stationObj.zhuanWork}}</div>
          </mt-field>

          <mt-field label="司龄" placeholder="" type="number">
            <div class="showARightSpan">{{stationObj.companyAge}}</div>
          </mt-field>
          <mt-field label="首次工作" placeholder=""  >
            <div class="showARightSpan">{{stationObj.firstWork}}</div>
          </mt-field>
          <mt-field label="工作邮箱" placeholder=""  >
            <div class="showARightSpan">{{stationObj.workEmail}}</div>
          </mt-field>

          <mt-field label="工作电话" placeholder="" type="number">
            <div class="showARightSpan">{{stationObj.jobNumber}}</div>
          </mt-field>
          <mt-field label="工号" placeholder=""  >
            <div class="showARightSpan">{{stationObj.serialVersionUID}}</div>
          </mt-field>


        </mt-tab-container-item>

      </mt-tab-container>



    </div>
</template>
<script>
  import { Navbar, TabItem ,mtTabContainerItem} from 'mint-ui';
    export default {
        data(){
            return {
              phone:'',  //手机号
              address:'',  //地区
              card:'',  //身份证
              gold:'',   //公积金
              openBank:'',  //开户行
              bankCard:'',  //银行卡

              selected: '1',
              selectedData:'1',
              stationObj:{},
              options: [
                { text: '男', value: '1' },
                { text: '女', value: '2' },
              ],
              imgSrc: {
                shenFenIcon: require('../../assets/shenfenzheng.png'),
              },
              submitDivShow:true,
              submitDivHide:false,

            }
        },
        created: function () {


//          let ff=JSON.parse(sessionStorage.obj);
//          console.log(ff.openIDD);

//          let phoneObj={
//            "openid":ff.openIDD
//          }
          this.$http.post('api/v1.0/client/findStaff').then(response => { //查询
            this.stationObj=response.body.result.record;
            var firstWork=new Date(parseInt(this.stationObj.fristWork)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
            var zhuanWork=new Date(parseInt(this.stationObj.fristWorkTime)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");

            this.stationObj.firstWork=firstWork;
            this.stationObj.zhuanWork=zhuanWork;
            console.log(this.stationObj);

          }, response => {
            console.log( 'error callback');
          });


        },

        methods: {

          handerDataSubmit(){
            this.submitDivShow=false;
              this.submitDivHide=true;
            let param={
              phone:this.phone,
              address:this.address,
              card:this.card,
              gold:this.gold,
              openBank:this.openBank,
              bankCard:this.bankCard,
            }
//            this.$http.post('api/v1.0/client/updateStaff',param).then(response => {
//              console.log('修改个人资料');
//
//            }, response => {
//              console.log( 'error callback');
//            });
          },
          handerDataSubmit2(){
            this.submitDivShow=true;
              this.submitDivHide=false;
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
  .showARightSpan{
    width: 15rem;
    height:2rem;
    line-height: 2rem;
    text-align: left;
  }
</style>
