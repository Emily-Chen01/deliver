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
    <div class="maSalary-details" v-if="dateGrid.detail&&dateGrid.detail.length">
      <h4 align="left">工资明细</h4>
      <!--<div class="maSalary-list" style="display: none;">
        <table>
          <tbody>
          &lt;!&ndash;<tr v-for="item in dateGrid.detail"
              v-if="(showFormat(item.add) || showFormat(item.deduct))">
            <td class="left-icon"><img :src="iconFormat(item.filedType)"></td>
            <td align="left" class="maSalary-details-td" v-text="item.remark"></td>
            <td align="right" v-text="showFormat(item.add) ? moneyFormat(item.add) : moneyFormat(item.deduct)"></td>
          </tr>&ndash;&gt;

          &lt;!&ndash;<tr v-for="item in dateGrid.detail">
            <td class="left-icon"><img src="../../assets/qianIcon.png"></td>
            <td align="left" class="maSalary-details-td" v-text="item.name">{{item.name}}</td>
            <td align="right">
              {{showFormat(item.value) ? moneyFormat(item.value) : item.value}}
            </td>
          </tr>&ndash;&gt;
          </tbody>
        </table>
      </div>-->

      <div class="salaryCategory" v-for="list in Object.keys(griddet)">
        <h1>{{list.split('_')[1]}}</h1>
        <p v-for="item in griddet[list]">
          <span class="left-icon"><img src="../../assets/qianIcon.png"></span>
          <span class="maSalary-details-td" v-text="item.name">{{item.name}}</span>
          <span>
              {{showFormat(item.value) ? moneyFormat(item.value) : item.value}}
            </span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
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
//        upTime: new Date().getMonth() + 1,
        upTime: null,
//        year: new Date().getFullYear(),
        year: null,
        dateGrid: {
          money: 0,
          lost: 0,
          detail: [
//            {
//              remark: '差旅费差旅费差旅费差旅费差旅费差旅费差旅费差旅费差旅费',
//              deduct: '0.00',
//              add: '0.00',
//              total: 1235
//            }
          ]
        },
        griddet: {}
      }
    },

    created: function () {
      let arr = this.getCookie('mySalaryDate').split('/');
      this.year = parseInt(arr[0]);
      this.upTime = parseInt(arr[1]);
      this.initDate();
    },

    methods: {
      iconFormat(icon){
        let count;
        if (typeof(icon) === 'number') {
          count = icon;
        } else {
          if (typeof(icon) === 'string') {
            if (parseInt(icon)) {
              count = parseInt(icon);
            } else {
              count = -1;
            }
          } else {
            count = -1;
          }
        }
        if (count === 0) {
          return this.imgSrc.salary;
        } else if (count > 1000 && count < 1012) {
          return this.imgSrc.social;
        } else if (count === 1016) {
          return this.imgSrc.tax;
        } else {
          return this.imgSrc.other;
        }
      },
      moneyFormat(money){
        let Money;
        if (/^[-0-9]+(\.[0-9]*)?$/.test(money) && typeof(money) === 'number') {
          Money = money.toFixed(2) + '元';
        } else {
          if (typeof(money) === 'string' && money) {
            Money = parseFloat(money).toFixed(2) + '元';
          } else {
            let moneyNum = 0;
            Money = moneyNum.toFixed(2) + '元';
          }
        }
        return Money;
      },
      showFormat(money){
        let Money;
        if (typeof(money) === 'number') {
          Money = money;
        } else {
          if (typeof(money) === 'string' && money) {
            Money = parseFloat(money);
          } else {
            Money = 0;
          }
        }
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

              let griddet = [];
              this.dateGrid.detail.forEach((item, idx) => {
                if(griddet.length > 0){
                  if(griddet[0].type == item.type){
                    griddet.push(item);
                  }else{
                    this.$set(this.griddet, (griddet[0].type).toString(), griddet);
                    griddet = [item];
                  }
                }else{
                  griddet = [item];
                }
                this.$set(this.griddet, (item.type).toString(), griddet);
              });
            } else {
              this.dateGrid = {
                money: 0,
                lost: 0,
                detail: []
              };
            }
          }
        }, response => {
//          console.log(response);
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
      padding-bottom: 20px;
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
            font-size: 12px;
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
            font-size: 14px;
            width: 70%;
            color: #475669;
            font-weight: inherit;
            padding-left: 0;
          }
        }
      }
      .salaryCategory{
        text-align: left;
        box-sizing: border-box;
        padding: 0 15px;
        h1{
          padding: 10px 0;
          height: 26px;
          line-height: 26px;
          font-size: 14px;
          border-bottom: 1px solid #d2dce6;
        }
        p{
          text-align: left;
          height: 70px;
          line-height: 70px;
          border-bottom: 1px solid #d2dce6;
          &::after{content:"";height: 0;display: block;clear: both;}
          span{
            display: inline-block;
            font-size: 12px;
            font-weight: bold;
            color: #1f2d3d;
            &:nth-child(1){
              float: left;
              width: 50px;
              height: 70px;
              padding-left: 0;
              position: relative;
              img {
                display: block;
                width: 40px;
                height: 40px;
                position: absolute;
                top:50%;
                left: 50%;
                -webkit-transform: translate(-50%,-50%);
                transform: translate(-50%,-50%);
              }
            }
            &:nth-child(2){
              float: left;
              font-size: 14px;
              color: #475669;
              font-weight: inherit;
              padding-left: 0;
            }
            &:nth-child(3){
              float: right;
            }
          }
        }
      }
    }
  }
</style>
