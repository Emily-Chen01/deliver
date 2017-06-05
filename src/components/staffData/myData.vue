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
            <div class="hrClass"></div>
            <div class="contentClass">
              <div class="contentLeft" >性别</div>
              <div class="contentRight" >{{myDataSearch.xingbie}}</div>
            </div>
            <div class="hrClass"></div>

            <div class="contentClass">
              <div class="contentLeft" >手机号</div>
              <div class="contentRight" >{{myDataSearch.phone}}</div>
            </div>
            <div class="hrClass"></div>

            <div class="contentClass">
              <div class="contentLeft" >国家/地区</div>
              <div class="contentRight" >{{myDataSearch.city}}</div>
            </div>
            <div class="hrClass"></div>

            <div class="contentClass">
              <div class="contentLeft" >身份证号</div>
              <div class="contentRight" >{{myDataSearch.shenfeng}}</div>
            </div>
            <div class="hrClass"></div>

            <div  style="height: 7.2rem;line-height: 7.2rem;padding: 1rem 0 0 1.2rem;" >
              <div class="cardClassSearch" style="display:flex">
                <img :src="myDataSearch.shenfengzheng" class="CardImgSearch" style="flex:2">
              </div>
              <div class="cardClassSearch">
                <img :src="myDataSearch.shenfengbei" class="CardImgSearch" style="flex:2">
              </div>
            </div>
            <div class="hrClass"></div>

            <div class="contentClass">
              <div class="contentLeft" >公积金账号</div>
              <div class="contentRight" >{{myDataSearch.gongjijin}}</div>
            </div>
            <div class="hrClass"></div>

            <div class="contentClass">
              <div class="contentLeft" >银行卡号</div>
              <div class="contentRight" >{{myDataSearch.bankcard}}</div>
            </div>
            <div class="hrClass"></div>

            <div class="contentClass">
              <div class="contentLeft" >开户行</div>
              <div class="contentRight" >{{myDataSearch.kaihuhang}}</div>
            </div>

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
            <mt-field v-model="address" label="国家/地区" placeholder=""  >
              <select v-model="selectedDataCity" class="changeSelect"  @change="changeCity(selectedDataCity)" >
                <option v-for="option in optionsCity" :value="option.value" >
                  {{ option.text }}
              </option>
                </select>
            </mt-field>
            <mt-field v-model="card" label="身份证号" placeholder="请输入身份证号" type="number" ></mt-field>
            <mt-field  label="" placeholder=""  style="height: 8.2rem;line-height: 8.2rem" >
              <div class="cardClass">
                  <div>
                    <vue-core-image-upload
                      :crop="false"
                      @imageuploaded="imageuploaded"
                      :data="data"
                      :headers="tokenHeader"
                      :max-file-size="5242880"
                      url="/api/v1.0/client/upload" >
                      <img width="150" :src="imgSrc.shenFenIconShow"  class="CardImg" v-if="imginit" />
                      <img width="150" :src="imgSrc.shenFenIcon"  class="CardImg"  v-if=" this.imgSrc.shenFenIcon" />

                    </vue-core-image-upload>
                  </div>
                <!--<div class="imgclassShen">身份证正面</div>-->

              </div>
              <div class="cardClass">
                  <div>
                    <vue-core-image-upload
                      :crop="false"
                      @imageuploaded="imageuploadedbei"
                      :data="data"
                      :max-file-size="5242880"
                      :headers="tokenHeader"
                      url="/api/v1.0/client/upload" >
                      <img width="150" :src="imgSrc.shenFenIconbeiShow" class="CardImg" v-if="imginit2" />
                      <img width="150" :src="imgSrc.shenFenIconbei" class="CardImg" v-if="this.imgSrc.shenFenIconbei" />

                    </vue-core-image-upload>
                  </div>
                <!--<div class="imgclassShen">身份证背面</div>-->
              </div>
            </mt-field>
            <mt-field v-model="gold" label="公积金账号" placeholder="请输入公积金账号" type="number"></mt-field>
            <mt-field v-model="bankCard" label="银行卡号" placeholder="请输入银行卡" type="number"  ></mt-field>
            <mt-field v-model="openBank" label="开户行" placeholder="请输入开户行"  ></mt-field>
          </div>

          <!--<div style="width: 23.5rem;margin-left:1rem;height: 1px;background: #cccccc;line-height: 1px"></div>-->
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
          <div class="hrClass"></div>
          <div class="contentClass">
            <div class="contentLeft" >入职日期</div>
            <div class="contentRight" >{{stationObj.dateOfEntry}}</div>
          </div>
          <div class="hrClass"></div>
          <div class="contentClass">
            <div class="contentLeft" >聘用形式</div>
            <div class="contentRight" >{{stationObj.baseSalary}}</div>
          </div>
          <div class="hrClass"></div>
          <div class="contentClass">
            <div class="contentLeft" >合同类型</div>
            <div class="contentRight" >{{stationObj.trialSalary}}</div>
          </div>
          <div class="hrClass"></div>
          <div class="contentClass">
            <div class="contentLeft" >职位</div>
            <div class="contentRight" >{{stationObj.position}}</div>
          </div>
          <div class="hrClass"></div>
          <div class="contentClass">
            <div class="contentLeft" >所在部门</div>
            <div class="contentRight" >{{stationObj.deptName}}</div>
          </div>
          <div class="hrClass"></div>
          <div class="contentClass">
            <div class="contentLeft" >转正日期</div>
            <div class="contentRight" >{{stationObj.zhuanWork}}</div>
          </div>
          <div class="hrClass"></div>
          <div class="contentClass">
            <div class="contentLeft" >司龄</div>
            <div class="contentRight" >{{stationObj.companyAge}}</div>
          </div>
          <div class="hrClass"></div>
          <div class="contentClass">
            <div class="contentLeft" >首次工作</div>
            <div class="contentRight" >{{stationObj.firstWork}}</div>
          </div>
          <div class="hrClass"></div>
          <div class="contentClass">
            <div class="contentLeft" >工作邮箱</div>
            <div class="contentRight" >{{stationObj.workEmail}}</div>
          </div>
          <div class="hrClass"></div>
          <div class="contentClass">
            <div class="contentLeft" >工作电话</div>
            <div class="contentRight" >{{stationObj.jobNumber}}</div>
          </div>
          <div class="hrClass"></div> <div class="contentClass">
          <div class="contentLeft" >工号</div>
          <div class="contentRight" >{{stationObj.serialVersionUID}}</div>
        </div>
          <div class="hrClass"></div>


        </mt-tab-container-item>

      </mt-tab-container>



    </div>
</template>
<script>
  import { Navbar, TabItem ,mtTabContainerItem,Toast } from 'mint-ui';
  import VueCoreImageUpload from 'vue-core-image-upload'

  export default {
        data(){
            return {
              imginit:true,
              imginit2:true,
              openId:'',
              tokenHeader: {
                openId: this.getCookie('openId')
              },
              data:{},
              phone:'',  //手机号
              address:'',  //地区
              card:'',  //身份证
              gold:'',   //公积金
              openBank:'',  //开户行
              bankCard:'',  //银行卡
              selectedDataCity:'',
              selected: '1',
              selectedData:'1',
              stationObj:{},
              myDataSearch:{},
              options: [
                { text: '男', value: '1' },
                { text: '女', value: '0' },
              ],
              optionsCity: [
                {text: '大陆地区', value: '1', type: 'da'},
                {text: '港澳地区', value: '2', type: 'gang'},
                {text: '台湾地区', value: '3', type: 'tai'},

              ],
              imgSrc: {
                shenFenIcon: '',
                shenFenIconbei: '',

                shenFenIconShow: require('../../assets/shenfenzheng.png'),
                shenFenIconbeiShow: require('../../assets/shenfenzheng.png'),

        },
              submitDivShow:true,
              submitDivHide:false,
              uid:'',

            }
        },
        created: function () {
//          alert('openid111cc'+this.getCookie('openId'));
            this.initSearch();

        },
        methods: {
          changeCity(value){
              console.log(value);
            this.cityParam=value;

          },

          handerDataSubmit(){
            this.submitDivShow=false;
              this.submitDivHide=true;
              console.log(this.myDataSearch)


            //点击后把编辑的信息传过来start
            this.gold=this.myDataSearch.gongjijin;
            this.bankCard=this.myDataSearch.bankcard;
            this.openBank=this.myDataSearch.kaihuhang;
            this.imgSrc.shenFenIcon=this.myDataSearch.shenfengzheng;
            this.imgSrc.shenFenIconbei=this.myDataSearch.shenfengbei;
            this.card=this.myDataSearch.shenfeng;
            this.phone=this.myDataSearch.phone;
            this.cityParam=this.myDataSearch.city;

            this.selectedData = this.myDataSearch.xingbie;
            this.selectedDataCity = this.myDataSearch.city;
            console.log(this.myDataSearch.city, 'this.selectedDataCity');


            switch(this.myDataSearch.xingbie) {
              case '男':
                this.selectedData= 1;
                break;
              case '女':
                this.selectedData = 0;
                break;

              default:
                this.selectedDataCity = '';
                break;
            }

            switch(this.myDataSearch.city) {
              case '大陆地区':
                this.selectedDataCity = 1;
                break;
              case '港澳地区':
                this.selectedDataCity = 2;
                break;
              case '台湾地区':
                this.selectedDataCity = 3;
                break;
              default:
                this.selectedDataCity = '';
                break;
            }

            //点击后把编辑的信息传过来end

            this.imginit=false;
            this.imginit2=false;

//            this.$http.post('/api/v1.0/client/findStaff').then(response => {
//              console.log('查询个人资料');
//              console.log(response);
//
//
//            }, response => {
//              console.log( 'error callback');
//            });
          },
          handerDataSubmit2(){
            this.submitDivShow=true;
            this.submitDivHide=false;
            let param={
              'uid':this.uid,
              'gender':this.selectedData,
              'mobile':this.phone,
              'nativePlace': this.selectedDataCity,
              'idcard':this.card,
              'idcardPhoUrl':this.imgSrc.shenFenIcon,
              'idcardPhoUrlRev':this.imgSrc.shenFenIconbei,
              'accfuNum':this.gold,
              'cardNumber':this.bankCard,
              'openingBank':this.openBank,
            }
          this.$http.post('/api/v1.0/client/updateStaff',param).then(response => {
              console.log('修改个人资料');
              if(response.code==200){
                Toast({
                  message: '个人资料保存成功',
                  iconClass: 'icon icon-success'
                })
              }
            this.initSearch();  //提交后在查询一次


          }, response => {
              console.log( 'error callback');
            });




          },
          handerClickUp(){
            alert(11);
          },

          imageuploaded(res) {
              console.log(res);
            if (res) {
                this.imginit=false;
              this.imgSrc.shenFenIcon = res.result;



              console.log(this.imgSrc.shenFenIcon);
            }

          },
          imageuploadedbei(res) {
            console.log(res);
            if (res) {
              this.imginit2=false;

              this.imgSrc.shenFenIconbei = res.result;
              console.log(this.imgSrc.shenFenIconbei);
            }

          },
          initSearch(){
            this.$http.post('/api/v1.0/client/findStaff').then(response => { //查询

              //岗位信息查询赋值开始
              this.stationObj=response.body.result.record;
              var firstWork=new Date(parseInt(this.stationObj.fristWork)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
              var zhuanWork=new Date(parseInt(this.stationObj.fristWorkTime)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");

              this.stationObj.firstWork=firstWork;
              this.stationObj.zhuanWork=zhuanWork;
              console.log(response);

              //岗位信息查询赋值结束

              //个人资料查询赋值开始
              this.myDataSearch.phone =response.body.result.mobile; //手机号
              this.myDataSearch.city=response.body.result.nativePlace; //国家
              this.myDataSearch.shenfeng=response.body.result.idcard; //身份证
              this.myDataSearch.shenfengzheng=response.body.result.idcardPhoUrl; //正身份证照片
              this.myDataSearch.shenfengbei=response.body.result.idcardPhoUrlRev;//背身份证照片
              this.myDataSearch.gongjijin=response.body.result.accfuNum; //公积金
              this.myDataSearch.bankcard=response.body.result.cardNumber; //银行卡号
              this.myDataSearch.kaihuhang=response.body.result.openingBank; //开户行

              console.log(response.body.result.nativePlace, 'response.body.result.nativePlace');
              switch(response.body.result.nativePlace) {
                case 1:
                  this.myDataSearch.city = '大陆地区';
                    break;
                case 2:
                  this.myDataSearch.city = '港澳地区';
                  break;
                case 3:
                  this.myDataSearch.city = '台湾地区';
                  break;
                default:
                  this.myDataSearch.city = '';
                    break;
              }

              switch(response.body.result.gender) {
                case 1:
                  this.myDataSearch.xingbie='男';
                  break;
                case 0:
                  this.myDataSearch.xingbie='女';
                  break;
                default:
                  this.myDataSearch.city = '';
                  break;
              }


              this.uid=response.body.result.uid;
              //个人资料查询赋值结束
            }, response => {
              console.log( 'error callback');
            });
            console.log('ddd'+this.imgSrc.shenFenIcon);
          }

        },
    components: {
      'vue-core-image-upload': VueCoreImageUpload,
    },
    }

</script>

<style scoped>

  is-selected {
    border-bottom: 3px solid #26a2ff;
    color: #26a2ff;
    margin-bottom: -3px;
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
    padding: 1rem;
  }
  .contentLeft{
    flex:1.2;
    text-align: left;
  }
  .contentRight{
    flex:2.8;
    text-align: left;
  }
  .dataTitle span{
    font-size: 1.4rem;
  }
 .changeSelect{
   width: 12rem;
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
  }
  .cardClassSearch{
    width: 11rem;
    height: 6rem;
    line-height: 6rem;
    float: left;
    position: relative;
  }
  .cardClass div{
    width: 9rem;
    position: absolute;
    font-size: 1.1rem;
    height: 6.2rem;
    line-height: 6.2rem;
  }
  .CardImg{
    display: block;
    width: 80%;
    height: 90%;
    padding-left: 0.6rem;

  }
  .CardImgSearch{
    display: block;
    width: 94%;
    height: 90%;
    padding-left: 0.6rem;
    padding-top: 0.2rem;
  }
  .showARightSpan{
    width: 15rem;
    height:2rem;
    line-height: 2rem;
    text-align: left;
  }
  .imgclassShen{
    position: absolute;
    top:3rem;
  }
</style>
