<template>
  <div class="App">
    Hello World
    <div>
      <router-link to="/Home">go Home</router-link>
      <router-link to="/About">go About</router-link>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>

</template>

<script>
import './index.less'
  export default {
    name: 'App',

    data() {
      return {};
    },
  };
</script>

<style lang="scss" scoped>
  .App {
    color: skyblue;
    display: grid;
    transition: all .5s;
    user-select: none;
    background: linear-gradient(to bottom, white, black);
  }
</style>