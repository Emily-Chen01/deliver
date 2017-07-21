<template>
  <div>
    <div class="manyCompanyTitle">{{ msg }}</div>
    <div>
      <div>
        <a class="mint-cell" v-for="(item , $index) in arryName" @click="handerComeCompany(item,$index)">
          <div class="mint-cell-title qing">
            <div class="postionImages">
              <img :src="imgSrc.ico_company" class="imgSize">
            </div>
            <div>
              <i class="indexicon icon-toast"></i>
              <span>{{item.compName}}</span></div>
          </div>
          <div class="mint-cell-right"></div>
          <i class="mint-cell-allow-right"></i>
        </a>
      </div>
    </div>
  </div>

</template>
<script>
  let fromPath = '';
  export default {
    name: 'manyCompany',
    data() {
      return {
        uId: '',
        msg: '您的员工信息存在多家公司请选择',
        arryName: [
          {
            name: '苏州工业园区科技有限公司',
            url: 'www.baidu.com'
          },
        ],
        imgSrc: {
          ico_company: require('../../assets/ico_company.png'),
        },
      }
    },
    created: function () {
      let phoneObj = {
        phone: this.getCookie('iphoneNumber'),
      }
      this.$http.get('/api/v1.0/client/findCompanies/' + phoneObj.phone).then(response => { //初始化查询有没有公司
        console.log(response, '这是查处的公司接口数据');

        console.log(this.uId);
        this.arryName = response.body.result
        if (response.body.code === 500) {
          this.$http.post('/api/v1.0/client/unbind').then(response => {
            console.log('解除绑定');
            this.$router.push({path: '/index'});
          }, response => {
            this.$router.push({path: '/index'});
          });
        }
      }, response => {
//        console.log('error callback');
      });
    },
    methods: {
      handerComeCompany(item, fff) {

        console.log('yy' + item.companyUid)

        let param = {
          companyUid: item.companyUid,
        };
        this.$http.post('/api/v1.0/client/chooseCompany', param).then(response => {
          console.log('选择公司接口');
          if (response.body.code === 200) {
            this.$router.push({path: '/signCard'});
          }
        }, response => {
          console.log('error callback');
        });

      },
//
    },

  }

</script>

<style>
  .qing {
    width: 5rem;
    postion: relative;
  }

  .qing::before {
    content: " ------- ";
    /*content: url(../../assets/ico_leave.png);*/
    /*font-size: 0.5em;*/
    /*background-size: 19px 20px;*/
    /*display: inline-block;*/
    /*background-color:yellow;*/
    color: #ffffff;
    /*font-weight:bold;*/
    width: 9%;
    /*height: 20px;*/
  }

  .postionImages {
    position: absolute;
    width: 16px;
    height: 16px;
    line-height: 1.8rem;
    left: 0.9rem;
    top: 18%;
  }

  .imgSize {
    width: 100%;
    height: 100%
  }

  .manyCompanyTitle {
    height: 5rem;
    line-height: 5rem;
    /*font-weight: 600;*/
    color: #8492a6;
    font-size: 1.4rem;
  }

  .mint-cell-title {
    background-image: -webkit-linear-gradient(top, #d9d9d9, #d9d9d9 50%, transparent 0);
    background-image: linear-gradient(180deg, #d9d9d9, #d9d9d9 50%, transparent 0);
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
