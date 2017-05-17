<template>
    <div>
      <div class="titleHeard">
        <div class="titleLeft" @click="handleClickUp()">< </div>
        <div class="titleMiddle">2017年2月</div>
        <div class="titleRight" @click="handleClickDown()"> ></div>
      </div>
      <div class="concentClass">
        <div class="concentClassNr">
         <div class="concentClassSpan">
           <div class="concentTop"> df</div>
           <div class="concentMiddle">ffffff </div>
           <div class="concentBottom"> ffffffhhhhh</div>
         </div>
        </div>
      </div>
    </div>
</template>
<script>
  import Header from 'mint-ui';

    export default {
        data(){
            return {}
        },
        created: function () {

        },

        methods: {
          handleClickUp(){
              console.log('上一个')
          },
          handleClickDown(){
            console.log('下一个')
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
    width: 15rem;
    height: 2rem;
    line-height: 2rem;
  }
.concentMiddle{
  position: absolute;
  width: 15rem;
  height: 2rem;
  line-height: 2rem;
  top:2rem;
}
.concentBottom {
  position: absolute;
  width: 15rem;
  height: 2rem;
  line-height: 2rem;
  top:4rem;

}
</style>
