<template>
    <div>
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
                实际到账金额：{{dateGrid.total}}
              </div>
           </div>
           <div class="concentMiddle">
              <div style="width: 30%;height: 0.05rem;background: #d2dce6;text-align: right;margin-left: 35%"></div>
           </div>
           <div class="concentBottom">
            <div style="display: flex">
              <div style="flex: 1">
                <div style="width: 2rem;height: 1rem;line-height: 1rem;padding-left:30%">
                  <img :src="imgSrc.qianIcon" class="avatar" style="width: 100%">
                </div>
              </div>
              <div style="flex: 2">扣除金额：{{dateGrid.kou}}</div>
              <div style="flex: 1">
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
        <div class="concentBodyClassTitle">
          <div class="concentBodyClassTitleSpan">款项</div>
          <div class="concentBodyClassTitleSpan">扣除金额</div>
          <div class="concentBodyClassTitleSpan">增加金额</div>
          <div class="concentBodyClassTitleSpan">小计</div>
        </div>

        <div class="concentBodyClassTitle" v-for="item in dateGrid.records">
          <div class="concentBodyClassTitleSpan">{{item.name}}</div>
          <div class="concentBodyClassTitleSpanColor">无</div>
          <div class="concentBodyClassTitleSpanColor">{{item.much}}元</div>
          <div class="concentBodyClassTitleSpanColor">{{item.total}}元</div>
        </div>
        <!--<div class="concentBodyClassTitle">-->
          <!--<div class="concentBodyClassTitleSpan">个人所得税</div>-->
          <!--<div class="concentBodyClassTitleSpanColor">-3255.00</div>-->
          <!--<div class="concentBodyClassTitleSpanColor">无</div>-->
          <!--<div class="concentBodyClassTitleSpanColor">1231.00元</div>-->
        <!--</div>-->
      </div>
    </div>
</template>
<script>
  import Header from 'mint-ui';

    export default {
        data(){
            return {
              imgSrc: {
                qianIcon:  require('../../assets/qianIcon.png'),
              },
              initTime:'',
             upTime:new Date().getMonth()+1,
             downTime:'',
             year:new Date().getFullYear(),
             dateGrid:{
                total:'15215',
                kou:'561',
               'records': [
                 {
                   name:'差旅费',
                   much: 2000,
                   total:1235
                 },{
                   name:'加油费',
                   much: 2000,
                   total:5235
                 }
                 ,{
                   name:'停车费',
                   much: 2000,
                   total:4235
                 }
               ]
             }
            }
        },

        created: function () {
            this.initDate();
        },

        methods: {
          handleClickUp(){
              console.log('上一个')
            this.upTime= this.upTime-1;
              if( this.upTime==1){
                this.upTime=12;
                this.year=this.year-1;
              }
              var geshi= this.upTime<10?'0'+this.upTime:this.upTime;
              var jian=this.year+'/'+geshi;
                console.log('jian'+jian);
              this.initDate(jian);
          },
          handleClickDown(){
            console.log('下一个')
            this.upTime= this.upTime+1;
            if( this.upTime>=12){
              this.upTime=1;
              this.year=this.year+1;
            }
            var geshi2= this.upTime<10?'0'+this.upTime:this.upTime;
            var add=this.year+'/'+geshi2;
            console.log('add'+add);
            this.initDate(add);
          },
          initDate(sum){ //查询当月工资
            let param={
              "date":sum
            };
            this.$http.post('/api/v1.0/client/findMonthSalaryReport',param).then(response => {

              console.log(response);
              this.dateGrid=response.body;
//              this.dateGrid=response.body.result;

            }, response => {
              console.log( '查询当月工资 error callback');
            });
          }
        },


        components: {
            //      ManyCompany
        }
    }

</script>

<style scoped>
.titleHeard{
  display: flex;
  background: #26a2ff;
  height: 2.6rem;
  line-height: 2.6rem;
  color: #ffffff;
}
.titleLeft{
  flex: 1;
}
.titleMiddle{
  flex: 3;
}
.titleRight{
  flex: 1;
}
  .concentClass{
    width: 21.8rem;
    margin: 1.5rem 1rem;
    height: 8rem;
    line-height: 8rem;
    background: rgb(239,242,247);
    position: relative;
  }
  .concentClassNr{
    width: 19.8rem;
    height: 6.8rem;
    position: absolute;
    top:0.5rem;
    left: 1rem;
    line-height: 6.8rem;
    background: rgb(217,224,234);
  }
.concentClassSpan{
  width: 18.2rem;
  height: 5.8rem;
  position: absolute;
  top: 0.5rem;
  left: 0.8rem;
  line-height: 6.8rem;
  background: rgb(239,242,247);
}
  .concentTop{
    position: absolute;
    width: 18rem;
    height: 2rem;
    line-height: 2rem;
    font-weight: 600;
  }
.concentMiddle{
  position: absolute;
  width: 18rem;
  height: 0.5rem;
  line-height: 0.5rem;
  top:2.8rem;
}
.concentBottom {
  position: absolute;
  width: 18rem;
  height: 2rem;
  line-height: 2rem;
  top:3.5rem;
  font-size: 0.9rem;

}
.concentBodyClass{
  width: 21.8rem;
  margin: 1.5rem 1rem;
  min-height: 9rem;
  font-size: 1rem;
  border: 1px solid #d2dce6;
}
  .concentBodyClassTitle{
    display: flex;
    height: 3rem;
    line-height: 3rem;
    background: #f8fbfb;
  }
  .concentBodyClassTitleSpan{
    flex: 1;
    height: 3rem;
    line-height: 3rem;
  }
.concentBodyClassTitleSpanColor{
  flex: 1;
  height: 3rem;
  line-height: 3rem;
  background: #ffffff;
  color: #1f2d3d;
}
</style>
