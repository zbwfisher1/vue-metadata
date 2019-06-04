<template>
<div id="searchContainer" :style="{height: searchContainerHeight+'px'}">
	<div class="title" v-if="searchKeyword">
		<div class="titShow">
			<h4 class="search-result-title">
				<span>"<span class="emphasize">{{searchKeyword}}</span> " {{$t('content.dataset.datasetDetail.ssxgjg')}} : {{searchResult.totalRows}}</span>
			</h4>
		</div>
	</div>
	<div class="tabCon">
		<loading :isloading="loading"></loading>
		<div v-if="!loading">
			<div class="boxCommon" style="margin-top: 20px;" v-if = "searchKeyword">
				<div class="con" v-if="searchResult.totalRows > 0">
					<div class="wrapper searchResultTit">
						<h4>
							<span class="titFlag"></span>
							<span>{{$t('content.dataset.datasetDetail.ssjg')}}:</span>
						</h4>
					</div>
					<div>
						<!-- 搜索结果记录 -->
						<ul v-for="(item,key) in searchResult.records">
						<!-- Datasets -->
						 	 <li class="wrapper searchItem"
									 v-if="item.flag == 'D'"
									 @click="link(item,'dataset')">
						  		<ul class="list-inline searchItemTit">
						  		 	<li class="main">
						  				<span class="tableDisc"></span>
						  		 		<span class="name" v-html="item.name"></span>
						  		 	</li>
						  		  <li class="sub">{{$t('content.dataset.businessDetail.biem')}} :
						  		 	  <span v-ellipsis:300="item.businessName"></span>
						  		 	</li>
						  		  <li class="sub">{{$t('content.dataset.businessDetail.miaos')}} :
									    <span v-ellipsis:400="item.description"></span>
						  		 	</li>
								  <!-- <li class="sub">最后更新时间: 			{{formatTime(JSON.parse(item.properties).last_modify_time*1000)}}
									</li> -->
									  <li class="sub">{{$t('content.common.leix')}} : {{item.source}}</li>
									  <li class="tableCreated sub">{{$t('content.dataset.datasetDetail.dx')}} : {{formatSize(item.size)}}</li>
									</ul>
									<div class="sub">{{$t('content.common.luj')}} : {{item.urn.replace('://','/')}}</div>
									<div class="tableUrn sub search-description">
										{{$t('content.dataset.datasetDetail.zid')}} :
										<span v-for="(val,index) in item.fields">
											<span v-html="val.fieldName,searchKeyword"></span>
											<span v-if="val.comment!='null'" v-html="val.comment"></span>
                      <span v-if="index<(item.fields.length-1)">,</span>
										</span>
									</div>
						  	</li>
						  	<!-- flowSearch -->
							 <li class="wrapper searchItem" v-if="item.flag == 'F'" @click="link(item,'flow')">
						  		<ul class="list-inline searchItemTit">
						  			<li class="tableName main">
						  				<span class="tableDisc"></span>
									  	<span class="name" v-html="emphasizeName(item.flowName,searchKeyword)"></span>
						  			</li>
									  <li class="tableSource sub">数据处理类型 : {{item.appCode}}</li>
									</ul>
								<div class="tableUrn sub">路径 : {{item.path}}</div>
					  	</li>
						</ul>
						<div class="tablePages">
							<el-pagination background
							  layout="total, prev, pager, next"
							  @size-change="handleSizeChange"
							  @current-change="handleCurrentChange"
							  :current-page="searchResult.currentPage"
							  :page-size="searchResult.pageSize"
							  :total="searchResult.totalRows"
								v-if="searchResult.totalRows>searchResult.pageSize">
							</el-pagination>
						</div>
					</div>
				</div>
				<div class="con" v-else>
					<no-data>
						<div>很抱歉，没有找到与<span class="emphasize">"{{searchKeyword}}"</span>相关的内容。</div>
					</no-data>
				</div>
			</div>
			<div class="boxCommon" v-else>
				<div class="con">
					<no-data>
						<div>请输入你要搜索的内容。</div>
					</no-data>
				</div>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import { FormatSize,FormatTime,EmphasizeName } from 'mixins/common' //搜索结果高亮
import { mapState } from 'vuex'
import { clickCount } from 'utils'
export default {
	name:"SearchResult",
	mixins: [FormatSize,FormatTime,EmphasizeName],
	data() {
		return {
			searchContainerHeight: 300,
			loading:true,//loading
			searchResult: {},//搜索结果
			setSearchParams: {source: ''} //搜索参数

		}
	},
	watch: {
		'$route': function(){
			this.fetchData()
		},
	},
	computed: {
		...mapState({
			sourceType: 'sourceType',
		}),
		searchKeyword (){
			return this.$route.query.keyword
		},
		searchCategory(){
			return this.$route.query.category
		},
		searchAdvance (){
			return this.$route.query.advance
		},
	},
	created(){
		console.log('searchResult')
		this.setSearchParams = this.$store.state.setSearchParams
		this.fetchData();
	},
	mounted(){
		this.countWinHeight();
	},
	methods: {
		// 获取数据
		fetchData(page = 1){
			// this.countWinHeight();
			if(!this.searchKeyword){
				this.loading = false;
				this.searchResult.records = [];
				return;
			}

			this.loading = true;
			this.searchResult.totalRows = '';

			let _url;
			// if(this.searchAdvance){
			// 	//高级搜索
			// 	_url = `/api/v1/advsearch/search?searchOpts=${this.searchKeyword}&size=10&page=${page}`
			// }else{
				//非高级搜索
				let keyword = encodeURIComponent(this.searchKeyword);
				let topicPath = this.setSearchParams.topicPath ? this.setSearchParams.topicPath : '';
                topicPath = encodeURIComponent(topicPath);
				let upstreamSystem = this.setSearchParams.upstreamSystem ? this.setSearchParams.upstreamSystem : ''
				upstreamSystem = encodeURIComponent(upstreamSystem)
				let sourceTable = this.setSearchParams.sourceTable ? this.setSearchParams.sourceTable : ''
				sourceTable = encodeURIComponent(sourceTable)
				_url = `/search/doSearch?category=${this.searchCategory}&source=${this.setSearchParams.source?this.setSearchParams.source:'all'}&keyword=${keyword}&topicPath=${topicPath}&upstreamSystem=${upstreamSystem}&sourceTable=${sourceTable}&rows=10&page=${page}`
			// }
			this.axios.get(_url)
			.then(function(res) {
				this.loading = false;
				if(res.body.statusCode == 200){
					this.searchResult = res.body.message;
				}else{
					this.searchResult.records = [];
				}
			})
		},
		countWinHeight(){
			let windowH = $('body').height() - 80;
			this.searchContainerHeight = windowH
		},
		link(item,type){
			this.$store.dispatch('setBusiness', false)
			if(type == "dataset"){
				let {id, name} = item;
				let path = item.urn.replace('://', '/');
				this.$store.dispatch('saveTableName', name);
				this.$store.dispatch('fetchRouter', {path, datasetId: id})
				clickCount(id)
				this.$router.push({name: 'Physical'})

			}else if(type == "flow"){
				let path = item.path.replace(":","/");
				let id = item.flowId;
				let name = item.flowName;
				const query = {path,id};
				this.$store.dispatch('saveFlowKeyword', name)
				this.$router.push({name: 'FlowDetail', query });
			}
		},
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
		},
		handleCurrentChange(val) {
			this.fetchData(val)
		}
	},
}
</script>

<style>
	#searchContainer{
		overflow-y: scroll;
		background: #eef0f1;
	}
	.title .titShow span.emphasize{color: #f00;padding-left: 10px;}
	.boxCommon .searchResultTit{border-bottom:1px solid #e8ecee;}
	.boxCommon .titFlag{background-color: #009cff;display: inline-block;width: 3px;height: 14px;}
	.boxCommon .searchItem{padding: 20px 0;border-bottom:1px solid #e8ecee;line-height: 30px}
	.boxCommon .searchItem:hover{background-color: #f7f7f7;cursor: pointer;}
	.boxCommon .tableDisc{width: 6px;height: 6px;border-radius: 50%;display: inline-block;background-color: #333;}
	.boxCommon .name{word-break: break-all;}
	.boxCommon .searchItem:hover .main{text-decoration: underline;}
	.boxCommon .searchItem .sub{color: #9598a0;}
	.boxCommon .searchItem .main{color: #007ff5;}
	.boxCommon .list-inline > li{padding-right: 20px;}
	.search-description{
		max-height: 30px;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.boxCommon .searchItem b, .boxCommon .searchItemTit li .main b{
		color: #c00;
	}
</style>
