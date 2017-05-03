<template>
  <div class="hello">
    <p>{{ msg }}</p>


    <mt-button type="default" @click.native="tip">mintui button</mt-button>
    <mt-button type="default" @click.native="handerClick">handerClick button</mt-button>




    <mt-navbar v-model="selected">
      <mt-tab-item id="1">选项一</mt-tab-item>
      <mt-tab-item id="2">选项二</mt-tab-item>
    </mt-navbar>

    <!-- tab-container -->
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="1">
        <mt-cell v-for="n in array" :title="'内容 ' + n" />
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
        <mt-cell v-for="n in 4" :title="'测试 ' + n" />
      </mt-tab-container-item>
    </mt-tab-container>

    <div>
      <mt-button type="default" size="large">点击</mt-button>
    </div>



  </div>
</template>

<script type="text/ecmascript-6">
import { Navbar, TabItem,Toast,mtTabContainerItem } from 'mint-ui';


//import { Button } from 'mint-ui';


export default {
  name: 'hello',
  data() {
    return {
      msg: 'Welcome',
      fff: 'sdfs',
      selected: 'selected',
      array:5


    }
  },
  methods: {
    tip() {
        Toast('提示信息');
    },
    handerClick(){
    }
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}
.dd{
  font-size: 1.2rem;
  width: 9.4rem;
  height: 3rem;
  display: inline-block;
}
li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
