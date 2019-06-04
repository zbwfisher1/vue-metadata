<template>
	<li v-if="level<4">
		<div class="tit">
			<i :class="folderClass"></i>
			<span class="name">{{title}}</span>
			<div class="elCheckbox" v-if="level==3">
				 <el-radio class="radio"  v-model="active" :label="path" @click.native="hardlerCheck(path)"></el-radio>
			</div>
		</div>
		<ul>
			<item
				class="item"
				v-for="model in model.children"
				:model="model">
			</item>
		</ul>
	</li>
</template>

<script>
export default {
	name:'item',
	props: {
		model: Object
	},
	    data() {
              return {
                active:"",
              };
            },
	computed:{
		level(){
			return this.model.level;
		},
		folderClass(){
			let _level={
				fold:true,
				open:true,
			};
			_level['level'+this.level] = true;
			return _level;
		},
		title(){
			return this.model.title;
		},
		path(){
			return this.model.path;
		},
		children(){
			return this.model.children;
		}
	},
	methods:{
              hardlerCheck(path){
                this.active = path;
                this.$store.commit("saveUploadDate", path);
			}
    }
}
</script>

<style>
	.tit{position: relative;}
	.elCheckbox{position: absolute;right: 20px}
	.radio{margin:0;}
	.el-radio__label{display: none}
</style>
