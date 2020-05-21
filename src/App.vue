<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
}
</script>

<style>
#app {
  width: 100vw;
    height: 100vh;
    text-align: center;
    color: #000;
    /* touch-action: none; */
    background: #fff;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-overflow-scrolling: touch;
}
::-webkit-scrollbar {
    width: 0;
    height: 0;
    color: transparent
}

input,
input:focus,
button,
button:focus {
    -webkit-tap-highlight-color: transparent;
}
</style>
