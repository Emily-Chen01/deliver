<template>
  <mt-datetime-picker
    :startDate="startDate"
    :type="pickerType"
    ref="picker"
    v-model="nowDateTime"
    year-format="{value} 年"
    month-format="{value} 月"
    date-format="{value} 日"
    hour-format="{value} 时"
    minute-format="{value} 分"
    @confirm="handleConfirm">
  </mt-datetime-picker>
</template>
<script>
  /* open(date,type,pos, currentDate)中有三个参数-->
   *其中date有三个值0表示有年月日时分；1表示有年月日时-会带有分，分为00；2表示有年月日时-不会带有分；3表示有年月日；4表示有年月；5表示年-->
   *其中type表示用来记录判断操作的对象-->
   *其中pos表示如果操作对象在数组中，其表示在数组的位置，如果不在数组中可以任意传值-->
   *其中currentDate表示当前已经选中的时间，日历会定位在这里，若是没有在定位到当前时间*/
  import {DatetimePicker, Radio} from 'mint-ui';
  import {Navbar, TabItem, Toast, MessageBox, Popup} from 'mint-ui';
  import moment from 'moment';
  let df0 = 'YYYY-MM-DD HH:mm';
  let df12 = 'YYYY-MM-DD HH';
  let df3 = 'YYYY-MM-DD';
  let df4 = 'YYYY-MM';
  let df5 = 'YYYY';
  let pickerslot = document.getElementsByClassName('picker-slot');
  //  let pickeritems = document.getElementsByClassName('picker-items');
  export default {
    data(){
      return {
        startDate: '',
        nowDateTime: new Date(),
        selectDateTime: '',
        pickerType: 'dateTime',
        startHour: 0,
        dateType: 0,
        type: 0,
        pos: 0, // 如果日期是在数组中，判断在数组中的位置
      }
    },
    created(){
      let Year = new Date().getFullYear() - 64;
      this.startDate = new Date(Year + '-' + 1 + '-' + 1);
    },
    methods: {
      open(date, type, pos, currentDate){
        this.dateType = date;
        this.type = type;
        this.pos = pos;
        if (currentDate) {
          this.nowDateTime = new Date(currentDate);
        }
//        pickeritems[0].style.display = 'initial';
        for (let i = 0; i < pickerslot.length; i++) {
          pickerslot[i].style.display = 'block';
//          pickerslot[i].style.flex = 'initial';
//          pickerslot[i].style.float = 'left';
//          if (this.dateType === 0) {
//            pickerslot[i].style.width = '20%';
//          } else if (this.dateType === 1 || this.dateType === 2) {
//            pickerslot[i].style.width = '25%';
//          } else if (this.dateType === 3) {
//            pickerslot[i].style.width = '33.3%';
//          } else if (this.dateType === 4) {
//            pickerslot[i].style.width = '50%';
//          } else if (this.dateType === 5) {
//            pickerslot[i].style.width = '100%';
//          }
        }
        if (this.dateType === 0) {
          this.pickerType = 'datetime';
        } else if (this.dateType === 1) {
          pickerslot[4].style.display = 'none';
          this.pickerType = 'datetime';
        } else if (this.dateType === 2) {
          pickerslot[4].style.display = 'none';
          this.pickerType = 'datetime';
        } else if (this.dateType === 3) {
          this.pickerType = 'date';
        } else if (this.dateType === 4) {
          pickerslot[2].style.display = 'none';
          this.pickerType = 'date';
        } else if (this.dateType === 5) {
          pickerslot[1].style.display = 'none';
          pickerslot[2].style.display = 'none';
          this.pickerType = 'date';
        }
        this.$refs.picker.open();
      },
      // 开始时间格式化
      handleConfirm(data){
        if (data) {
          if (this.dateType === 0) {
            this.selectDateTime = moment(data).format(df0);
          } else if (this.dateType === 1) {
            this.selectDateTime = moment(data).format(df12) + ':00';
          } else if (this.dateType === 2) {
            this.selectDateTime = moment(data).format(df12);
          } else if (this.dateType === 3) {
            this.selectDateTime = moment(data).format(df3);
          } else if (this.dateType === 4) {
            this.selectDateTime = moment(data).format(df4);
          } else if (this.dateType === 5) {
            this.selectDateTime = moment(data).format(df5);
          }
          this.$emit('selcetDateTime', {time: this.selectDateTime, type: this.type, pos: this.pos});
        }
      },
    }
  };
</script>
