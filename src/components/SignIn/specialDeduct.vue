<template>
  <div id="special-wrapper">
    <!--头部-->
    <div class="special-header">
      <p>专项扣除</p>
    </div>
    <!--内容-->
    <div class="special-content">
      <p>长按图片识别二维码，打开小程序</p>
      <p><img src="../../assets/images/pic_qrcode.png"></p>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return {
      }
    },
    created: function () {
    },
    methods: {
    },
    components: {}
  }
</script>

<style scoped lang="scss">
  #special-wrapper {
    background: #ffffff;
    width: 100%;
    p {
      margin: 0;
    }
    .special-header {
      height: 44px;
      width: 100%;
      background: #26a2ff;
      color: #ffffff;
      p{
        line-height: 44px;
      }
    }
    .special-content {
      box-sizing: border-box;
      width: 100%;
      padding: 15px;
      img{
        display: block;
        width: 60%;
        margin: 20px auto;
      }
    }
  }
</style>
