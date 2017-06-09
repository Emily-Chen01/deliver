<template>
    <div>
      <input class="dateTimeInput"   v-model="startTimeValue"
             style="font-size: 0.9rem" type="text" readonly="" id="demo1"  name="input_date" placeholder="请输入日期" data-lcalendar="2000-01-01,2020-01-01"
      />
    </div>
</template>
<script>

    export default {
        data(){
            return {
              startTimeValue:'',
            }
        },
        created: function () {

        },
      watch:{
        startTimeValue:function(data,oldVal){
          console.log(data);
//          sessionStorage.setItem('applyStartTime', val);
          this.$emit('ieventStart',data);
        }
      },
      mounted:function(){
        var calendar = new lCalendar();
        calendar.init({
          'trigger': '#demo1',//标签id
          'type': 'datetime',//date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择
          'minDate':'1900-1-1',//最小日期 注意：该值会覆盖标签内定义的日期范围
          'maxDate':'2020-1-1'//最大日期 注意：该值会覆盖标签内定义的日期范围
        });

      },

        methods: {},

        components: {
            //      ManyCompany
        }
    }

</script>

<style scoped>
  .showARightSpan{
    width: 15rem;
    height:2rem;
    line-height: 2rem;
    text-align: left;
  }
  .dateTimeInput{
    border: none;
    width: 15rem;
    height:2rem;
    line-height: 2rem;
    text-align: left;
    font-size: 0.8rem;
  }
</style>
