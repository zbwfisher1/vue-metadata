<template>
  <div class="metadata-main-page clearfix">
    <main-nav></main-nav>
    <router-view class="main-wrapper wrapper-content"></router-view>
  </div>
</template>
<script>
  import MainNav from './MainNav'
  export default{
    components: {
      MainNav
    }
  }
</script>
<style>

  .metadata-main-page,
  .main-wrapper{
    height: 100%;
  }
</style>
