<template>
  <div id="app">
    <!--<div style="height: 5rem"><img style="width: 100%;height: 100%;" src="./assets/logo.png"></div> eg:图片自适应-->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 5px;
  font-size: 1rem;
}
</style>
