<template>
  <div>


    <div style="background: pink;line-height: 9rem;width: 10rem">
     少时诵诗书所所所所所所
    </div>


  </div>
</template>
<script>
  import Vue from 'vue'
  import { DatetimePicker } from 'mint-ui';
  import VueCoreImageUpload from 'vue-core-image-upload'
  import { TabContainer, TabContainerItem } from 'mint-ui';
  Vue.component(TabContainer.name, TabContainer);
  Vue.component(TabContainerItem.name, TabContainerItem);
  Vue.component(DatetimePicker.name, DatetimePicker);
  export default {
    data(){
      return {
//        data:{},
        active:'',
        selected: '1',
        selectedData:'',
        options: [
          { text: '男', value: 'A' },
          { text: '女', value: 'B' },
        ],
        imgSrc: {
          shenFenIcon: require('../../assets/shenfenzheng.png'),
        },

        imgUrls: [],
        urlArr: [],
        isPhoto: true,
        btnTitle: '',
        isModify: false,
        previewImg:'',
        isPreview: false,
        pickerValue:new Date("January 12,2006")


      }
    },
    created: function () {

    },


    methods: {
      handerDataSubmit(){


      },
      handleConfirm(){
        alert(11)
      },
      openPicker() {
//        alert(11);
        this.$refs.picker.open();
//        console.log(this.$refs.picker.open(1));
      },


    },

    components: {
      'vue-core-image-upload': VueCoreImageUpload,
    },
  }

</script>

<style scoped>
  .dataTitle span{
    font-size: 1.4rem;
  }
  .changeSelect{
    width: 14rem;
    display: block;
    height: 2.5rem;
    border: none;
    font-size: 1.22rem;
  }
  .cardClass{
    width: 11rem;
    height: 6rem;
    line-height: 6rem;
    padding-bottom: 1rem;
    position: absolute;
    left: -15rem;
    top: -3rem;
  }
  .cardClass div{
    width: 9rem;
    height: 1.2rem;
    position: absolute;
    top:2.8rem;
    font-size: 1.1rem;
  }
  .CardImg{
    display: block;
    width: 80%;
    height: 80%;
    padding-left: 0rem;

  }
  .myApply{
    width: 23.2rem;
    height: 14.5rem;
    margin-top: 1rem;
    border-radius: 6px;
    border: 1px solid #cccccc;
  }
  .myApplyTitleLeft{
    width: 7rem;
    height: 3rem;
    line-height: 3rem;
    float: left;
    font-weight: 600;
    font-size:1.3rem ;
  }
  .myApplyContentLeft{
    width: 7rem;
    height: 3rem;
    line-height: 3rem;
    text-align: left;
    font-weight: 600;
    padding-left: 0.8rem;
    font-size:1.2rem ;
  }
  .myApplyContentNr{
    width: 22rem;
    height: 1rem;
    line-height: 1rem;
    text-align: left;
    padding-left: 0.8rem;
    font-size:1.2rem ;
  }
  .myApplyBottomNrLeft{
    width: 6.5rem;
    display: inline-block;
    height: 1rem;
    line-height: 1rem;
    text-align: left;
    font-size:1.2rem ;
  }
  .myApplyBottomNrRight{
    width: 15rem;
    display: inline-block;
    height: 1rem;
    line-height: 1rem;
    text-align: left;
    font-size:1.2rem ;
  }
  .myApplyTitleRight{
    width: 7rem;
    height: 3rem;
    line-height: 3rem;
    float: right;
    font-weight: 600;
    font-size:1.3rem ;
  }
</style>
