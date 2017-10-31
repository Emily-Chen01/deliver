<template>
  <div class="full-calendar-header">
    <div class="header-left">
      <!--<slot name="header-left">-->
      <span class="prev-month" @click.stop="goPrev">{{leftArrow}}</span>
      <!--</slot>-->
    </div>
    <div class="header-center">
      <!--<span class="prev-month" @click.stop="goPrev">{{leftArrow}}</span>-->
      <span class="title">{{title}}</span>
      <!--<span class="next-month" @click.stop="goNext">{{rightArrow}}</span>-->
    </div>
    <div class="header-right">
      <!--<slot name="header-right">-->
      <span class="next-month" @click.stop="goNext">{{rightArrow}}</span>
      <!--</slot>-->
    </div>
  </div>
</template>
<script type="text/babel">
  import dateFunc from './dateFunc'

  export default {
    created () {
      this.dispatchEvent()
    },
    props: {
      currentDate: {},
      titleFormat: {},
      firstDay: {},
      monthNames: {}
    },
    data () {
      return {
        title: '',
        leftArrow: '<',
        rightArrow: '>',
        headDate: new Date()
      }
    },
    watch: {
      currentDate (val) {
        if (!val) return
        this.headDate = val
      }
    },
    methods: {
      goPrev () {
        this.headDate = this.changeMonth(this.headDate, -1)
        this.dispatchEvent()
      },
      goNext () {
        this.headDate = this.changeMonth(this.headDate, 1)
        this.dispatchEvent()
      },
      changeMonth (date, num) {
        let dt =new Date(dateFunc.format(new Date(date), 'yyyy-MM'))
        return new Date(dt.setMonth(dt.getMonth() + num))
      },
      dispatchEvent() {
        this.title = dateFunc.format(this.headDate, this.titleFormat, this.monthNames)
        let startDate = dateFunc.getStartDate(this.headDate)
        let curWeekDay = startDate.getDay()

        // 1st day of this monthView
        let diff = parseInt(this.firstDay) - curWeekDay
        if (diff) diff -= 7
        startDate.setDate(startDate.getDate() + diff)

        // the month view is 6*7
        let endDate = dateFunc.changeDay(startDate, 41)

        // 1st day of current month
        let currentDate = dateFunc.getStartDate(this.headDate)

        this.$emit('change',
          dateFunc.format(startDate, 'yyyy-MM-dd'),
          dateFunc.format(endDate, 'yyyy-MM-dd'),
          dateFunc.format(currentDate, 'yyyy-MM-dd'),
          this.headDate
        )
      }
    }
  }
</script>
<style lang="scss">
  .full-calendar-header {
    display: flex;
    align-items: center;
    height: 44px;
    background-color: rgb(32, 160, 255);
    color: rgb(255, 255, 255);
    font-size: 15px;

    .header-left, .header-right {
      flex: 1;
      text-align: left;
    }
    .header-left {
      text-align: left;
      padding-left: 15px;
    }
    .header-right {
      text-align: right;
      padding-right: 15px;
    }
    .prev-month, .next-month {
      padding: 10px;
      /*cursor: pointer;*/
    }
    .header-center {
      flex: 3;
      text-align: center;
      .title {
        margin: 0 10px;
      }
    }
  }
</style>
