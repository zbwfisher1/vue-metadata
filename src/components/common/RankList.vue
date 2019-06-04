<template>
	<div class="rankList-wrapper">
		<header class="rank-list-header" v-if="hasMore">
			<h4 class="ranklist-title">{{title}}</h4>
			<a href="javascript:;"
				class="rankList-btn"
				@click="pushRouter">{{$t('content.common.ckgd')}}></a>
		</header>
		<div class="rankList-container clearfix">
			<rank-item
				v-for="(item,index) in model"
				:item="item"
				:color="colors[index]"
				:rank="index"
			></rank-item>
		</div>

	</div>
</template>

<script>
	const RankItem ={
		name:"RankItem",
		template:`
				<el-row type="flex"
					class="rankList"
					justify="space-between"
					align="middle"
					:title="title">
				  <el-col :span="13">
				  	 <div class="grid-content rankList-left">
				  	 	<i v-if="rank<3"
								class="rankList-num"
		  	 				:style="{'background-color': color}">
								{{rank+1}}
							</i>
							<span v-else class="rankList-num" style="background-color:#ececec;">
								{{rank+1}}
							</span>
				  	 	<span class="rankList-name" v-ellipsis="item.name"></span>
				  	 </div>
				  </el-col>
				  <el-col :span="11">
				  	<div class="grid-content rankList-right":class="{hasMore: !$parent.hasMore}">
				  		<span class="rankList-size">{{item.num}}</span>
				  		<span v-if="$parent.hasMore">{{item.percent}}</span>
				  	</div>
				  </el-col>
				</el-row>
			`,
		props:{
			rank:[Number||String],
			item:[Object],
			color:[String],
		},
		computed:{
			title(){
				const {name,num,percent} = this.item;
				return `${name} ${num}(${percent})`
			}
		},
	};

	export default{
		name:'RankList',
		components:{RankItem},
		props:{
			title:{
				type:String,
			},
			colors:{
				type:Array,
				default(){
					return ['#fb7a53', '#ffbf01', '#ffdc16', '#92d14f', '#31c45e', '#50da9e', '#76e9e2', '#26d4ff', '#2cabf4', '#1064fe', '#f0f0f0']
				}
			},
			model:{
				type:Array,
				default(){
					return [
           {name:'Firefox',num:12,   percent: 45.0},
           {name:'IE', num:12,     percent:  26.8},
           {name:'Chrome',num:12,      percent: 12.8},
           {name:'Safari',num:12,      percent:  8.5},
           {name:'Opera', num:12, percent: 6.2},
           {name:'其他', num:12, percent:  0.7}]
				}
			},
			hasMore: {
				type: Boolean,
				default: false
			},
			targetRouter: [String]
		},
		methods: {
			pushRouter(){
				this.$router.push({name: this.targetRouter})
			}
		}
	}
</script>
<style lang="less" scope>
.rankList-wrapper{
	background: #fff;
	a{
		display: inline-block;
		line-height: 30px;
		color: #5a6779;
	}
}
.rankList-title{
	height: 40px;
	padding-top: 5px;
	font-size: 16px;
	font-weight: normal;
	margin: 0;
	color: #91959f;
}
.ranklist-title{
	line-height: 30px;
}
.rankList-container{
	.el-row{
		margin-bottom: 0;
	}
	span{
		color: #5a6779;
	}
}
.rankList{
    overflow: hidden;
	background: #fff;
	padding: 0 5px;
	border-top: 1px solid #e5e5e5;
	line-height: 37px;
}
.rankList:last-child{
	border-bottom: 1px solid #e5e5e5;
}
.rankList-left{
	display: flex;
	align-items: center;
	i{
		flex-shrink: 0;
	}
}
.rankList-btn{
	color: #98a0ab;
	float: right;
	text-decoration: underline;
}
.rank-list-header{
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
	h4{
		font-size: 16px;
		color: #91959f;
		margin:0;
	}
	a{
		flex-shrink:0;
	}
}
.rankList-right{
	display: flex;
	justify-content: space-between;
}
.hasMore{
	justify-content: flex-end !important;
}
</style>
