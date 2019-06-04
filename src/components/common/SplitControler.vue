<template>
  <div class="tree-controler"
     @click="treeControl"
     :class="{activeTree: !isOpenTree}">
  </div>
</template>
<script>
  export default {
    props: {
      controlerLeft: Number,
      isOpenTree: Boolean
    },
    mounted(){
      this.setControlerPosition();
    },
    watch: {
      controlerLeft(){
        this.setControlerPosition();
      }
    },
    methods: {
      setControlerPosition(){
        this.$el.style.left = `${this.controlerLeft}px`;
      },
      treeControl(){
        this.$emit('setTreeControler');
  		},
    }
  }
</script>
