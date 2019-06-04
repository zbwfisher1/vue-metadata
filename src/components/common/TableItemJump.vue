<template>
	<tr :key="indexKey">
		<td v-for="name in tableName">
            <div class="jump-item-container">
                <a href="javascript:;"
    			   v-ellipsis="name"
    			   @click="link(params)"
				   :class="{disabled: params.disabled}">
    			</a>
                <!-- 0是非隐藏1是隐藏 -->
				<div>
					<i v-if="isPrivate != undefined && isPrivate == 1"
						:title="$t('content.common.yyc')">
						<img :src="privateImg" />
					</i>
					<i v-if="isDeleted == 1" class="el-icon-delete"></i>
				</div>
            </div>
		</td>
		<slot></slot>
	</tr>
</template>
<script>
import { Message } from 'mixins/common'
import Bus from 'utils/bus'
import { clickCount } from 'utils'
	export default{
		name:"TableItemJump",
		mixins: [ Message],
        data(){
            return {
                privateImg: require('../../assets/images/private.png')
            }
        },
		props:{
			params:{
				 type: Object,
				 require:true
			},
			names:[String, Array],
			view:Boolean,
			datasetId:{
				// type:Number,
				default: null
			},
			indexKey: Number,
            isPrivate: 0,
			isDeleted: 0
		},
		computed:{
			isDataset(){
				const {path} = this.$route;
				return path.includes("Dataset") || path.includes("Physical");
			},
			tableName(){
				if(typeof this.names === "string"){
					return Array.of(this.names)
				}
				return this.names
			}
		},
		methods:{
			link(queryParams){
				this.$store.dispatch('saveTreeItemActive', {path: queryParams.params.path , datasetId: this.datasetId})//保存当前点击
				clickCount(this.datasetId)
				if(queryParams.disabled){
					return;
				}
				const {path} = queryParams.params
				const datasetId = this.datasetId
				this.$store.dispatch('fetchRouter', {path,datasetId})
				if(!this.isDataset){
					const name = this.tableName[0];
					this.$store.dispatch('saveTableName', name)
          			this.$router.push({name: 'Physical'})
					this.$store.dispatch('setBusiness', false)
				}else{
          			this.$store.dispatch('saveDatasetKeyword', "")  //取消搜索关键字
					this.$store.dispatch('setBusiness', this.view)
          			// Bus.$emit('clearTreeSearchKeywords');
					Bus.$emit('refreshTree',{path,datasetId})
				}
				this.$store.dispatch('saveNavData', true)
			},
		},
	}
</script>
<style lang="less">
    .jump-item-container{
        display:flex;
        justify-content: space-between;
        align-items: center;
		.disabled{
			color: #ccc;
			text-decoration: none;
		}
		.el-icon-delete{
			color: #B9B9B9;
			font-size: 14px;
		}
	}


</style>
