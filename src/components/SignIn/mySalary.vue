<template>
    <div>
      <div class="titleHeard">
        <div class="titleLeft">> </div>
        <div class="titleMiddle">2017年2月薪资</div>
        <div class="titleRight"><</div>

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
</style>
