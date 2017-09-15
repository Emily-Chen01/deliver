<template>
  <div id="mySalary-wrapper">
    <!--头部-->
    <div class="maSalary-header">
      <p class="maSalary-header-center" v-text="year+'年'+upTime+'月'"></p>
      <p class="maSalary-header-left" @click="handleClickUp()"><</p>
      <p class="maSalary-header-right" @click="handleClickDown()">></p>
    </div>
    <!--内容-->
    <div class="maSalary-content">
      <div class="maSalary-total-wrapper">
        <div class="maSalary-total-box">
          <h2 v-text="'实际到账金额:'+moneyFormat(dateGrid.money)"></h2>
          <div class="maSalary-total-line"></div>
          <h3 v-text="'扣除金额:'+moneyFormat(dateGrid.lost)"></h3>
          <img :src="imgSrc.qianIcon">
          <img :src="imgSrc.qianIcon">
        </div>
      </div>
    </div>
    <!--工资明细-->
    <div class="maSalary-details" v-if="dateGrid.detail.length">
      <h4 align="left">工资明细</h4>
      <div class="maSalary-list">
        <table>
          <tbody>
          <tr v-for="item in dateGrid.detail">
            <td class="left-icon"><img :src="iconFormat(item.remark)"></td>
            <td align="left" class="maSalary-details-td" v-text="item.remark"></td>
            <td align="right" v-text="item.add ? moneyFormat(item.add) : moneyFormat(item.deduct)"></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
  import Header from 'mint-ui';

  export default {
    data(){
      return {
        imgSrc: {
          qianIcon: require('../../assets/qianIcon.png'),
          salary: require('../../assets/ico_salary.png'),
          social: require('../../assets/ico_social.png'),
          tax: require('../../assets/ico_tax.png'),
          other: require('../../assets/ico_other.png'),
        },
        initTime: '',
        upTime: new Date().getMonth() + 1,
        downTime: '',
        year: new Date().getFullYear(),
        dateGrid: {
          money: 0,
          lost: 0,
          detail: [
//            {
//              remark: '差旅费差旅费差旅费差旅费差旅费差旅费差旅费差旅费差旅费',
//              deduct: 0,
//              add: 34,
//              total: 1235
//            }, {
//              remark: '基本薪资',
//              deduct: '',
//              add: 98,
//              total: 1235
//            }, {
//              remark: '绩效',
//              deduct: -48,
//              add: '',
//              total: 1235
//            },
          ]
        }
      }
    },

    created: function () {
      this.initDate();
    },

    methods: {
      iconFormat(icon){
        if (icon === '基本薪资') {
          return this.imgSrc.salary;
        } else if (icon === '个人社保缴纳金额' || icon === '个人公积金缴纳金额' || icon === '企业社保缴纳金额' || icon === '企业公积金缴纳金额' || icon === '个人补缴社保缴纳金额' || icon === '个人补缴公积金缴纳金额' || icon === '企业补缴社保缴纳金额' || icon === '企业补缴公积金缴纳金额' || icon === '商业保险') {
          return this.imgSrc.social;
        } else if (icon === '扣除个人所得税') {
          return this.imgSrc.tax;
        } else {
          return this.imgSrc.other;
        }
      },
      moneyFormat(money){
        let Money = Math.abs(money) ? (money + '元') : '无';
        return Money;
      },
      // 上一个月
      handleClickUp(){
        this.upTime = this.upTime - 1;
        if (this.upTime < 1) {
          this.upTime = 12;
          this.year = this.year - 1;
        }
        let minus = this.year + '/' + (this.upTime < 10 ? '0' + this.upTime : this.upTime);
        this.initDate(minus);
      },
      // 下一个月
      handleClickDown(){
        this.upTime = this.upTime + 1;
        if (this.upTime > 12) {
          this.upTime = 1;
          this.year = this.year + 1;
        }
        let add = this.year + '/' + ((this.upTime < 10) ? ('0' + this.upTime) : this.upTime);
        this.initDate(add);
      },
      initDate(sum){ //查询当月工资
        let param = {
          date: sum
        };
        this.$http.post('/api/v1.0/client/findMonthSalaryReport', param).then(response => { //参数不传默认当月
          if (response.body.code === 200) {
            this.dateGrid = {};
            if (response.body.result) {
              this.dateGrid = response.body.result;
            } else {
              this.dateGrid = {
                money: '',
                lost: '',
                detail: []
              };
            }
          }
        }, response => {
//          console.log('查询当月工资 error callback');
        });
      }
    },
    components: {}
  }

</script>

<style lang="scss">
  #mySalary-wrapper {
    background: #ffffff;
    width: 100%;
    p {
      margin: 0;
    }
    .maSalary-header {
      height: 44px;
      width: 100%;
      background: #26a2ff;
      color: #ffffff;
      .maSalary-header-left, .maSalary-header-right {
        float: left;
        width: 40px;
        height: 44px;
        line-height: 44px;
        text-align: center;
        margin-top: -44px;

      }
      .maSalary-header-right {
        float: right;
      }
      .maSalary-header-center {
        width: 100%;
        height: 44px;
        line-height: 44px;
        text-align: center;
      }
    }
    .maSalary-content {
      box-sizing: border-box;
      width: 100%;
      padding: 15px;
      .maSalary-total-wrapper {
        box-sizing: border-box;
        width: 100%;
        height: 125px;
        background: rgb(239, 243, 247);
        padding: 10px;
        .maSalary-total-box {
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          border: 5px solid rgb(217, 224, 233);
          h2 {
            margin: 0;
            height: 50px;
            line-height: 50px;
            font-size: 17px;
          }
          h3 {
            margin: 0;
            height: 43px;
            line-height: 43px;
            font-size: 13px;
          }
          .maSalary-total-line {
            margin: 0 auto;
            height: 0;
            width: 60px;
            border: 1px solid rgb(224, 231, 237);

          }
          img {
            float: left;
            margin-top: -43px;
            margin-left: 10px;
            width: 40px;
            height: 33px;
          }
          img:last-child {
            float: right;
            margin-right: 10px;
          }
        }
      }
    }
    .maSalary-details {
      width: 100%;
      h4 {
        padding-left: 15px;
        height: 26px;
        line-height: 26px;
        background: rgb(239, 243, 247);
        font-size: 14px;
      }
      .maSalary-list {
        box-sizing: border-box;
        padding: 0 15px;
        table {
          width: 100%;
          border-collapse: collapse;
          border: none;
          font-size: 14px;
          td {
            width: 30%;
            padding: 10px;
            font-size: 13px;
            font-weight: bold;
            color: #1f2d3d;
            background: #ffffff;
            border: none;
            border-bottom: 1px solid #d2dce6;
          }
          .left-icon {
            width: 50px;
            padding-left: 0;
            img {
              width: 40px;
              height: 40px;
            }
          }
          .maSalary-details-td {
            width: 70%;
            color: #475669;
            font-weight: inherit;
            padding-left: 0;
          }
        }
      }
    }
  }
</style>
