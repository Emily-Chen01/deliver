<template>
  <div id="manyCompanyWarpper">
    <div class="manyCompanyTitle">{{ msg }}</div>
    <div class="manyCompanyList" v-for="item in arryName" @click="handerComeCompany(item)">
      <mt-cell :title="item.compName" is-link>
        <i slot="icon" class="bg-img ico_company"></i>
      </mt-cell>
    </div>
  </div>
</template>
<script>
  import {Cell, MessageBox} from 'mint-ui';
  export default {
    name: 'manyCompany',
    data() {
      return {
        msg: '您的员工信息存在多家公司请选择',
        arryName: [{
          name: '',
          url: ''
        }],
      }
    },
    created: function () {
      let phoneObj = {
        phone: this.getCookie('iphoneNumber'),
      };
      this.$http.get('/api/v1.0/client/findCompanies/' + phoneObj.phone).then(response => { //初始化查询有没有公司
        if (response.body.code === 200) {
          this.arryName = response.body.result;
        } else if (response.body.code === 500) {
          this.$http.post('/api/v1.0/client/unbind').then(response => {
            if (response.body.code === 200) {
              this.$router.push({path: '/index'});
            }
          }, response => {
//            console.log('error callback');
          });
        }
      }, response => {
//        console.log('error callback');
      });
    },
    methods: {
      handerComeCompany(item) {
        let param = {
          companyUid: item.companyUid,
        };
        this.$http.post('/api/v1.0/client/chooseCompany', param).then(response => {
          if (response.body.code === 200) {
            this.$router.push({path: '/signCard'});
          } else {
            MessageBox('提示', response.body.message);
          }
        }, response => {
          console.log('error callback');
        });
      },
    },
  }
</script>
<style lang="scss">
  #manyCompanyWarpper {
    border-bottom: 1px solid #d9d9d9;
    .manyCompanyTitle {
      height: 50px;
      line-height: 50px;
      color: #8492a6;
      font-size: 16px;
    }
    .manyCompanyList {
      // 复写组件样式
      .mint-cell {
        text-align: left;
        background-position: top;
        .mint-cell-title {
          box-sizing: border-box;
          padding: 0 10px 0 26px;
          width: 100%;
          font-size: 0;
          i {
            margin-left: -17px;
          }
          .mint-cell-text {
            box-sizing: border-box;
            padding-left: 10px;
            display: inline-block;
            width: 100%;
            font-size: 16px;
            color: #1f2d3d;
          }
        }
      }
    }
  }
</style>
