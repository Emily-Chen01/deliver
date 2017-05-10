<template>
    <div>
      <p class="manyCompanyTitle">{{ msg }}</p>
      <div>
        <div >
          <a  class="mint-cell" v-for="(item , $index) in arryName" @click="handerComeCompany(item,$index)" >
            <div class="mint-cell-wrapper">
              <div class="mint-cell-title"><!----> <div ><i class="indexicon icon-toast"></i> <span>{{item.COMP_NAME}}</span></div></div>
              <div class="mint-cell-value is-link"><span></span></div>
            </div>
            <div class="mint-cell-right"></div>
            <i class="mint-cell-allow-right"></i>
          </a>
        </div>
      </div>
    </div>

</template>
<script >
  let fromPath = '';
    export default {
      name: 'manyCompany',
      data() {
        return {
            uId:'',
          msg: '您的员工信息存在多家公司请选择',
          arryName:[
            {
                name:'苏州工业园区科技有限公司',
                url:'www.baidu.com'
            }
          ]


        }
      },
      created: function () {
        let phoneObj={
          phone:18356081327
        }
        this.$http.get('api/v1.0/client/findCompanies/'+phoneObj.phone).then(response => { //初始化查询有没有公司
            console.log('这个data是查询公司的'+response.body.result);
            //若是没有公司在此处执行下一个页面  ?/？
          console.log(response.body.result);
          for(let i=0;i<response.body.result.length;i++){
            this.uId=response.body.result[i].UID;
          }
          console.log(this.uId);
            this.arryName=response.body.result
        }, response => {
          console.log( 'error callback');
        });
      },
      methods: {
        handerComeCompany(item,ff) {
            let param={
              "openid":"2",
              "companyUid":this.uId,
            }
            this.$http.post('api/v1.0/client/chooseCompany',param).then(response => {
              console.log('选择公司接口');

              this.$router.push({path:'/signCard'});
            }, response => {
              console.log( 'error callback');
            });

        },
//
      },

    }

</script>

<style>
  .manyCompanyTitle{
    margin-top: 4rem;
    font-weight: 600;
    font-size: 1.4rem;
  }
  .mint-cell-title{
    background-image: -webkit-linear-gradient(top,#d9d9d9,#d9d9d9 50%,transparent 0);
    background-image: linear-gradient(180deg,#d9d9d9,#d9d9d9 50%,transparent 0);
    background-size: 120% 1px;
    background-repeat: no-repeat;
    background-position: 0 0;
    background-origin: content-box;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    box-sizing: border-box;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    font-size: 16px;
    line-height: 1;
    min-height: inherit;
    overflow: hidden;
    padding: 0 10px;
    width: 100%;
  }

</style>
