<template>
  <div style="background: #ffffff">
    <div class="titleHeard">
      <div class="titleLeft" @click="handleClickUp()">< </div>
      <div class="titleMiddle">{{year}}年{{this.upTime}}月</div>
      <div class="titleRight" @click="handleClickDown()"> ></div>
    </div>
    <div class="concentClass">
      <div class="concentClassNr">
        <div class="concentClassSpan">
          <div class="concentTop">
            <div style="text-align: center">
              实际到账金额：{{dateGrid.money}}





            </div>
          </div>
          <div class="concentMiddle">
            <div style="width: 30%;height: 0.05rem;background: #d2dce6;text-align: right;margin-left: 35%"></div>
          </div>
          <div class="concentBottom">
            <div style="width: 100%;">
              <div style="width: 20%;float: left;">
                <div style="width: 2rem;height: 1rem;line-height: 1rem;padding-left:30%">
                  <img :src="imgSrc.qianIcon" class="avatar" style="width: 100%">
                </div>
              </div>
              <div style="width: 58%;float: left;">扣除金额：{{dateGrid.lost}}</div>
              <div style="width: 20%;float: right;">
                <div style="width: 2rem;height: 1rem;line-height: 1rem;padding-left:30%">
                  <img :src="imgSrc.qianIcon" class="avatar" style="width: 100%">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="concentBodyClass">
      <!--<div class="concentBodyClassTitle">-->
      <!--<div class="concentBodyClassTitleSpan">款项</div>-->
      <!--<div class="concentBodyClassTitleSpan">扣除金额</div>-->
      <!--<div class="concentBodyClassTitleSpan">增加金额</div>-->
      <!--<div class="concentBodyClassTitleSpan">小计</div>-->
      <!--</div>-->
      <!--<div class="concentBodyClassTitle" v-for="item in dateGrid.detail">-->
      <!--<div class="concentBodyClassTitleSpanColor" style="text-overflow:ellipsis;overflow:hidden">{{item.remark}}</div>-->
      <!--<div class="concentBodyClassTitleSpanColor">{{item.deduct}}</div>-->
      <!--<div class="concentBodyClassTitleSpanColor">{{item.add}}</div>-->
      <!--<div class="concentBodyClassTitleSpanColor">{{item.total}}元</div>-->
      <!--</div>-->

      <table style="width: 100%;min-height: 3rem;">
        <tr>
          <th>款项</th>
          <th>扣除金额</th>
          <th>增加金额</th>
          <th>小计</th>
        </tr>
        <tr v-for="item in dateGrid.detail">
          <td style=" background: #f8fbfb;text-overflow:ellipsis;overflow:hidden">{{item.remark}}</td>
          <td>{{item.deduct}}</td>
          <td>{{item.add}}</td>
          <td>{{item.total}}</td>
        </tr>
      </table>
    </div>
    <div style="height: 1rem;"></div>
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
          money: '',
          lost: '',
          detail: [
//                 {
//                   remark:'差旅费',
//                   deduct: 2000,
//                   total:1235
//                 },{
//                   remark:'加油费',
//                   deduct: 2000,
//                   total:5235
//                 }
//                 ,{
//                   remark:'停车费',
//                   deduct: 2000,
//                   total:4235
//                 }
          ]
        }
      }
    },

    created: function () {
      this.initDate();
    },

    methods: {
      handleClickUp(){
        this.upTime = this.upTime - 1;
        if (this.upTime == 1) {
          this.upTime = 12;
          this.year = this.year - 1;
        }
        var geshi = this.upTime < 10 ? '0' + this.upTime : this.upTime;
        var jian = this.year + '/' + geshi;
        this.dateGrid = {};

        this.initDate(jian);
      },
      handleClickDown(){
        this.upTime = this.upTime + 1;
        if (this.upTime >= 12) {
          this.upTime = 1;
          this.year = this.year + 1;
        }
        var geshi2 = this.upTime < 10 ? '0' + this.upTime : this.upTime;
        var add = this.year + '/' + geshi2;
        this.dateGrid = {};
        this.initDate(add);
      },
      initDate(sum){ //查询当月工资
        let param = {
          "date": sum
        };
        this.$http.post('/api/v1.0/client/findMonthSalaryReport', param).then(response => { //参数不传默认当月
          if (response.body.result) {
            this.dateGrid = response.body.result;
          } else {
            this.dateGrid = {
              money: '',
              lost: '',
              detail: []
            };
          }
        }, response => {
          console.log('查询当月工资 error callback');
        });
      }
    },
    components: {}
  }

</script>

<style scoped>
  table {
    border-collapse: collapse;
  }

  table, td, th {
    border: 1px solid #d2dce6;
    font-size: 1.1rem;
  }

  th {
    background: #f8fbfb;
  }

  .titleHeard {
    display: flex;
    background: #26a2ff;
    height: 3.2rem;
    line-height: 3.2rem;
    color: #ffffff;
  }

  .titleLeft {
    flex: 1;
  }

  .titleMiddle {
    flex: 3;
  }

  .titleRight {
    flex: 1;
  }

  .concentClass {
    width: 93%;
    margin: 1rem;
    height: 8rem;
    line-height: 8rem;
    background: rgb(239, 242, 247);
    position: relative;
  }

  .concentClassNr {
    width: 93%;
    height: 6.8rem;
    position: absolute;
    top: 0.5rem;
    left: 1rem;
    line-height: 6.8rem;
    background: rgb(217, 224, 234);
  }

  .concentClassSpan {
    width: 93%;
    height: 5.8rem;
    position: absolute;
    top: 0.5rem;
    left: 0.8rem;
    line-height: 6.8rem;
    background: rgb(239, 242, 247);
  }

  .concentTop {
    position: absolute;
    width: 100%;
    height: 2rem;
    line-height: 2rem;
    font-weight: 600;
  }

  .concentMiddle {
    position: absolute;
    width: 96%;
    left: 2%;
    height: 0.5rem;
    line-height: 0.5rem;
    top: 2.8rem;
  }

  .concentBottom {
    position: absolute;
    width: 100%;
    height: 2rem;
    line-height: 2rem;
    top: 3.5rem;
    font-size: 0.9rem;

  }

  .concentBodyClass {
    width: 93%;
    min-height: 3rem;
    font-size: 1rem;
    /*border: 1px solid #d2dce6;*/
    margin: 1rem;
  }

  .concentBodyClassTitle {
    display: flex;
    height: 3rem;
    line-height: 3rem;
    background: #f8fbfb;
  }

  .concentBodyClassTitleSpan {
    flex: 2;
    height: 3rem;
    line-height: 3rem;
  }

  .concentBodyClassTitleSpanColor {
    flex: 1;
    height: 3rem;
    line-height: 3rem;
    background: #ffffff;
    color: #1f2d3d;
  }
</style>
