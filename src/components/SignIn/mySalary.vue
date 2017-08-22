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
      <hr/>
      <!--列表-->
      <div class="maSalary-details">
        <table>
          <thead>
          <tr>
            <th>款项</th>
            <th>扣除金额</th>
            <th>增加金额</th>
            <th>小计</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in dateGrid.detail">
            <td class="maSalary-details-td" v-text="item.remark"></td>
            <td v-text="moneyFormat(item.deduct)"></td>
            <td v-text="moneyFormat(item.add)"></td>
            <td v-text="moneyFormat(item.total)"></td>
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
//              remark: '差旅费',
//              deduct: 0,
//              add: 34,
//              total: 1235
//            }
          ]
        }
      }
    },

    created: function () {
      this.initDate();
    },

    methods: {
      moneyFormat(money){
        let Money = money ? ((money >= 0) ? (money + '元') : '无') : '无';
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
      hr {
        margin: 15px 0 12px;
        border: none;
        height: 0;
        width: 100%;
        border-top: 1px solid #d2dce6;
      }
      .maSalary-details {
        width: 100%;
        table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #d2dce6;
          font-size: 14px;
          th, td {
            width: 25%;
            padding: 10px;
            border: 1px solid #d2dce6;
            font-size: 13px;
          }
          th, .maSalary-details-td {
            color: #475669;
            background: #f8fbfb;
          }
          td {
            color: #1f2d3d;
            background: #ffffff;
          }
        }
      }
    }

    /*table {*/
    /*border-collapse: collapse;*/
    /*}*/

    /*table, td, th {*/
    /*border: 1px solid #d2dce6;*/
    /*font-size: 1.1rem;*/
    /*}*/

    /*th {*/
    /*background: #f8fbfb;*/
    /*}*/

    /*.titleHeard {*/
    /*display: flex;*/
    /*background: #26a2ff;*/
    /*height: 3.2rem;*/
    /*line-height: 3.2rem;*/
    /*color: #ffffff;*/
    /*}*/

    /*.titleLeft {*/
    /*flex: 1;*/
    /*}*/

    /*.titleMiddle {*/
    /*flex: 3;*/
    /*}*/

    /*.titleRight {*/
    /*flex: 1;*/
    /*}*/

    /*.concentClass {*/
    /*width: 93%;*/
    /*margin: 1rem;*/
    /*height: 8rem;*/
    /*line-height: 8rem;*/
    /*background: rgb(239, 242, 247);*/
    /*position: relative;*/
    /*}*/

    /*.concentClassNr {*/
    /*width: 93%;*/
    /*height: 6.8rem;*/
    /*position: absolute;*/
    /*top: 0.5rem;*/
    /*left: 1rem;*/
    /*line-height: 6.8rem;*/
    /*background: rgb(217, 224, 234);*/
    /*}*/

    /*.concentClassSpan {*/
    /*width: 93%;*/
    /*height: 5.8rem;*/
    /*position: absolute;*/
    /*top: 0.5rem;*/
    /*left: 0.8rem;*/
    /*line-height: 6.8rem;*/
    /*background: rgb(239, 242, 247);*/
    /*}*/

    /*.concentTop {*/
    /*position: absolute;*/
    /*width: 100%;*/
    /*height: 2rem;*/
    /*line-height: 2rem;*/
    /*font-weight: 600;*/
    /*}*/

    /*.concentMiddle {*/
    /*position: absolute;*/
    /*width: 96%;*/
    /*left: 2%;*/
    /*height: 0.5rem;*/
    /*line-height: 0.5rem;*/
    /*top: 2.8rem;*/
    /*}*/

    /*.concentBottom {*/
    /*position: absolute;*/
    /*width: 100%;*/
    /*height: 2rem;*/
    /*line-height: 2rem;*/
    /*top: 3.5rem;*/
    /*font-size: 0.9rem;*/

    /*}*/

    /*.concentBodyClass {*/
    /*width: 93%;*/
    /*min-height: 3rem;*/
    /*font-size: 1rem;*/
    /*!*border: 1px solid #d2dce6;*!*/
    /*margin: 1rem;*/
    /*}*/

    /*.concentBodyClassTitle {*/
    /*display: flex;*/
    /*height: 3rem;*/
    /*line-height: 3rem;*/
    /*background: #f8fbfb;*/
    /*}*/

    /*.concentBodyClassTitleSpan {*/
    /*flex: 2;*/
    /*height: 3rem;*/
    /*line-height: 3rem;*/
    /*}*/

    /*.concentBodyClassTitleSpanColor {*/
    /*flex: 1;*/
    /*height: 3rem;*/
    /*line-height: 3rem;*/
    /*background: #ffffff;*/
    /*color: #1f2d3d;*/
    /*}*/
  }
</style>
