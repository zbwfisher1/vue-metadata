<template>
	<thead>
	  <tr>
	 	<th
			class="operate-th"
			v-for="model in tableHeader"
  			@click="changeSort(model)">
	 		{{model.name}}
	 	      <div
					 style="border"
						class="order"
						v-if="model.hasSort">
	 	      	<span class="asc"
	 		      	:class="{active:model.type == $parent.sort && 'asc'== $parent.order }">
	 	      	</span>
	 	      	<span class="desc"
	 	      		 :class="{active:model.type == $parent.sort && 'desc'== $parent.order }">
	 	      	</span>
	 	      </div>
	 	</th>
	 	<slot></slot>
	  </tr>
	</thead>

</template>
<script>
	export default{
		name: "TableHeader",
		props:{
			tableHeader:Array,
		},
		methods:{
			changeSort(model){
				if(model.hasSort){
					let newOrder = this.$parent.order == 'desc' ? 'asc' : 'desc';
					this.tableOrder(model.type, newOrder);
				}else{
					return;
				}
			},
			tableOrder(sort,order){
				this.$emit("tableSort",{sort,order});
			}
		},
	}
</script>
<style scoped>
	/*排序*/
 .order{
   float:right;
   margin-top: 3px;
   cursor: pointer;
 }
 .order span{display: none;width: 0;height: 0; border-left: 4px solid transparent;border-right: 4px solid transparent;}
 .operate-th:hover span{
   display: block;
 }
 .order .active{
   display: block;
 }
 .order .asc{border-bottom: 4px solid #a8a9ae;}
 .order .desc{border-top: 4px solid #a8a9ae;margin-top: 3px;}

 .order .asc.active{border-bottom: 5px solid #014b70;}
 .order .desc.active{border-top: 5px solid #014b70;}
 th{
 	cursor: pointer;
 }
</style>
