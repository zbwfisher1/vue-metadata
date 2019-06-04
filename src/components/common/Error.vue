<template>
  <div class="error-tip" v-if="visible">
    {{tip}}
  </div>
</template>
<script>
  export default{
    name: 'Error',
    props: {
      tip: String,
      visible: Boolean
    }
  }
</script>
<style>
  .error-tip{
		font-size: 12px;
		color: #f56c6c;
	}
</style>
