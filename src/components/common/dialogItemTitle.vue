<template>
  <div class="dialog-item-title">
    <span>{{title}}</span>
  </div>
</template>
<script>
  export default{
    name: 'dialogItemTitle',
    props: {
      title: {
        require: true,
        type: String
      }
    },
  }
</script>
<style>
  .dialog-item-title{
    border-bottom: 1px solid #e2e2e2;
    margin-bottom: 15px;
    margin-top: 10px;
  }
  .dialog-item-title span{
    display: inline-block;
    line-height: 30px;
    color: #565c60;
    border-bottom: 1px solid #565c60;
    margin-bottom: -1px;
  }
</style>
