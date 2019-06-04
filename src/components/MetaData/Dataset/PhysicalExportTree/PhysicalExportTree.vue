<template>
  <ul>
		<li v-for="(modelItem, index) in model"
				@click.stop="clickToggle(modelItem)"
        :key="modelItem.type=='more'?10000:index">
			<physical-export-tree-item
			:folder="modelItem"
			></physical-export-tree-item>
		</li>
	</ul>
</template>
<script>
  export default{
    name: 'PhysicalExportTree',
    beforeCreate(){
  	  this.$options.components.physicalExportTreeItem = require("./PhysicalExportTreeItem.vue")
  	},
    props: {
      model: Array,
    },
    methods:{
  		clickToggle(model){
  		  const vm = this;
  			if(model.folder){
  	 			model.open = !model.open;
  			}
  		},
  	}
  }
</script>
