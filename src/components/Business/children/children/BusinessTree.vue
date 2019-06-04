<template>
	<ul>
		<li v-for="(modelItem, index) in model"
			@click.stop="clickToggle(modelItem)"
			:key="modelItem.type === 'more' ? 10000 : index">
			<item :path="path"
				  :keyword="keyword"
				  :folder="modelItem"></item>
		</li>
	</ul>
</template>


<script>
	export default {
		name: "treeView",
		beforeCreate: function() {
			this.$options.components.item = require("./BusinessTreeItem.vue");
		},
		props: {
			keyword: String,
			model: Array,
			path: String
		},
		methods: {
			clickToggle(model) {
				const vm = this;
				if (model.folder) {
					model.open = !model.open;
				}
			}
		}
	};
</script>
