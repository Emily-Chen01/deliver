<template>
    <div>
      <p class="manyCompanyTitle">{{ msg }}</p>
      <div>
        <div >
        <a  class="mint-cell" v-for="(item , $index) in arryName" @click="handerComeCompany(item,$index)" >
          <div class="mint-cell-wrapper">
            <div class="mint-cell-title"><!----> <div ><i class="indexicon icon-toast"></i> <span>{{item.name}}</span></div></div>
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
          msg: '您的员工信息存在多家公司请选择',
          arryName:[
            {
                name:'苏州工业园区科技有限公司',
                url:'www.baidu.com'
            },
            {
              name:'苏州科技有限公司'
            },
            {
              name:'苏州工业园区科技有限公司'
            },
            {
              name:'苏州科技有限公司'
            }
          ]


        }
      },
      created: function () {
        console.log('a is: ')
      },
      methods: {
        handerComeCompany(item,ff) {
            let param={
              "openid":"2",
              "companyUid":"d713a5e1-4624-4301-8602-b1eb5f869663"
            }
            this.$http.post('api/v1.0/client/chooseCompany',param).then(response => {
              console.log(123);
              console.log(response);
            }, response => {
              console.log( 'error callback');
            });
          this.$router.push({path:'/signCard'});
          console.log(ff);
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
