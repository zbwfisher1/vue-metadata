<template>
	<multipane id="data-set" class="custom-resizer" layout="vertical">
		<div class="pane" :style="{ width: '250px', maxWidth: '50%', minWidth: '250px' }">
			<div class="datasetList">
				<tree-header></tree-header>
				<div class="structure-container">
					<loading :isloading="loading" isTree="true"></loading>
					<div class="tree-loading-container" v-if="treeLoading">
						<more-loading :isTree="true" :isloading="treeLoading"></more-loading>
					</div>
					<template v-if="!loading">
						<div class="dbList"
							 :class="{'pb45': $store.state.isBusiness}"
							 v-if="treeData.length && treeDataIsNotNull">
							<tree-view
									:model="treeData"
									:isBusiness="getIsBusiness"
									:hasPrivilege="hasPrivilege">
							</tree-view>
						</div>
						<template v-if="treeData.length === 0 || !treeDataIsNotNull">
							<div class="addTheme__con"
								 @click="addNewTheme"
								 v-if="businessVisible && isShowAdd &&hasPrivilege">
								<img :src="icon_addTheme" alt="">
								<p class="addTheme__txt">
									{{$t('content.common.qdj')}}
									<a href="javascript:;">{{$t('content.tree.xjywzt')}}</a>
								</p>
							</div>
							<no-data v-else></no-data>
						</template>
					</template>
				</div>
				<div class="addThemeBotoom__con" @click="addNewTheme" v-if="businessVisible && hasPrivilege">
					<i class="el-icon-plus"></i>
					<span>{{$t('content.tree.xjywzt')}}</span>
				</div>
				<el-dialog
						:title="$t('content.dataset.businessDetail.xjzt')"
						:visible.sync="dialogFormVisible"
						width="385px"
						:close-on-click-modal="false"
						@click.native.stop>
					<el-form :model="addFileForm" :rules="addFileRules" ref="addFileForm" @submit.native.prevent>
						<el-row :gutter="24">
							<el-col :span="20" :offset="2">
								<el-form-item prop="name">
									<el-input v-model="addFileForm.name"
											  autofocus
											  :placeholder="$t('content.tree.qsrztm')"
											  @keyup.native.enter="addFileCommit('addFileForm')"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click="dialogFormVisible = false">{{$t('content.common.qx')}}</el-button>
						<el-button type="primary" @click="addFileCommit('addFileForm')"
								   :disabled="buttonDisabled">
							{{$t('content.common.qd')}}
						</el-button>
					</div>
				</el-dialog>
			</div>
		</div>
		<multipane-resizer></multipane-resizer>
		<div class="pane" :style="{ flexGrow: 1 }">
			<router-view></router-view>
		</div>
	</multipane>
</template>

<script>
	import {Multipane, MultipaneResizer} from 'vue-multipane';
	import TreeView from './DatasetTree';
	import TreeHeader from './DatasetTreeHeader';
	import SplitControler from 'components/common/SplitControler';
	import 'assets/libs/splitter/jquery.splitter.js';
	import 'assets/libs/splitter/jquery.splitter.css';
	import {Message, resetValidators, windowSplitter, testPrivilege, reStructureTreeData} from 'mixins/common';
	import {themeNameValidate} from 'utils/validator';
	import Bus from 'utils/bus';
	import {mapState} from 'vuex';
	import {httpRequest} from 'utils';

	export default {
		components: {
			TreeView,
			SplitControler,
			TreeHeader,
			Multipane,
			MultipaneResizer
		},
		mixins: [Message, resetValidators, testPrivilege, windowSplitter, reStructureTreeData],
		data() {
			return {
				icon_addTheme: require('assets/images/icon_addTheme.png'),
				icon_add: require('assets/images/icon_add.png'),
				loading: true,
				isOpenTree: true,
				treeData: [],
				dialogFormVisible: false,
				addFileForm: {
					name: ''
				},
				addFileRules: {
					name: [
						{required: true, message: this.$t('content.tree.qsrztm'), trigger: 'blur'},
						{min: 1, max: 50, message: this.$t('content.validator.cdbdcg', [50]), trigger: 'blur'},
						{validator: themeNameValidate, trigger: 'blur'}
					]
				},
				isShowAdd: false,
				hasPrivilege: true,
				buttonDisabled: false,
				treeDataIsNotNull: false,
				rootPath: '',
				flag: false,
				isHasAloneId: false
			};
		},
		computed: {
			...mapState({
				keyword: 'datasetKeyword',
				getIsBusiness: 'isBusiness',
				treeLoading: 'treeLoading',
				datasetKeyword: 'datasetKeyword'
			}),
			path() {
				return this.$route.query.path;
			},
			url() {
				return this.getIsBusiness ? '/topic/tree' : '/datasets/tree';
			},
			businessVisible() {
				return this.getIsBusiness;
			}
		},
		watch: {
			keyword(val) {
				let url = this.url;
				let data = {
					level: 0,
					key: val,
					rows: 20,
					path: '',
					page: 1
				};

				this.loading = true;
				this.$store.dispatch('beginRequest');
				this.axios.post(url, data).then((res) => {
					this.loading = false;
					this.$store.dispatch('treeLoading', false);
					const {statusCode, message} = res.body;
					const {records} = message;

					this.isNotNull(records);
					this.$store.dispatch('setTreeData', Array.isArray(records) && records.length !== 0 && this.treeDataIsNotNull);

					if (statusCode === 200) {
						this.setOpen(records);
						this.setFirst(records);
						this.isShowAdd = false;
						this.treeData = records;
						if (this.getIsBusiness) {
							this.reStructureBusinessData();
							this.$router.push({name: 'DatasetDetail'});
						} else {
							this.reStructureTreeData();
							this.$router.push({name: 'PhysicalDetail'});
						}
					} else {
						this.treeData = [];
					}
				});
			}
		},
		destroyed() {
			Bus.$off('initTree');
		},
		async created() {
			this.rootPath = this.$store.state.fetchRouter.path;
			//先off再on，防止请求两次
			Bus.$off('initTree').$on('initTree', () => {
				this.$store.dispatch('setBusiness', this.$route.path.includes('Dataset'));
				this.fetchAllData();
			});
			Bus.$on('searchKeyword:header', (val) => {
				this.searchKeyword(val);
			});
			Bus.$off('refreshTree').$on('refreshTree', async(activeParams) => {
				this.rootPath = activeParams.path;
				this.isHasAloneId = false;
				await this.keyTreeSearch({path: activeParams.path, key: ''});
				if (activeParams.path === '' && this.treeData.length > 0) {  //为空的时候，当前为根目录，需要选中首条数据
					this.setFirst(this.treeData);
				} else {
					this.$store.dispatch('fetchRouter', activeParams);
				}
			});
			this.$store.dispatch('setBusiness', this.$route.path.includes('Dataset'));
		},
		methods: {
			searchKeyword(val) {
				let url = this.url;
				let data = {
					level: 0,
					key: val,
					rows: 20,
					path: '',
					page: 1
				};
				this.loading = true;
				this.isHasAloneId = false;
				this.$store.dispatch('beginRequest');
				this.axios.post(url, data).then((res) => {
					this.loading = false;
					this.$store.dispatch('treeLoading', false);
					const {statusCode, message} = res.body;
					const {records} = message;

					this.isNotNull(records);
					this.$store.dispatch('setTreeData', Array.isArray(records) && records.length !== 0 && this.treeDataIsNotNull);

					if (statusCode === 200) {
						this.setOpen(records);
						this.setFirst(records);
						this.isShowAdd = false;
						this.treeData = records;

						if (this.getIsBusiness) {
							this.reStructureBusinessData();
							this.$router.push({name: 'DatasetDetail'});
						} else {
							this.reStructureTreeData();
							this.$router.push({name: 'PhysicalDetail'});
						}
					} else {
						this.treeData = [];
					}
				});
			},
			isNotNull(records) {
				if (this.getIsBusiness) {
					this.treeDataIsNotNull = true;
				} else {
					this.treeDataIsNotNull = false;
					for (var i = 0; i < records.length; i++) {
						if (records[i].tableNum != null) {
							this.treeDataIsNotNull = true;
						}
					}
				}
			},
			destroyed() {
				this.treeData = [];
				this.$store.dispatch('saveDatasetKeyword', "");
				this.$store.dispatch('saveTreeItemActive', "");
				this.$store.dispatch('saveViewData', "clear");
			},
			async fetchAllData() {
				if (this.$store.state.tableName) {
					await this.keyTreeSearch({
						path: this.path,
						key: ''
					});
					this.$store.dispatch('saveTableName', "");
				} else {
					this.treeData = await this.fetchTreeData();

					if (this.getIsBusiness) {
						this.reStructureBusinessData();
					} else {
						this.reStructureTreeData();
					}
					this.setOpen(this.treeData);
					this.setFirst(this.treeData);

				}
			},
			reStructureBusinessData() {
				let hasNextPage = true;
				let path = '';

				function checkChildren(data) {
					data && data.forEach((val, index) => {
						let arrPath = val.path.split('/');
						arrPath.pop();
						let newPath = arrPath.join('/');
						if (val.children) {
							if (val.children.hasNextPage) {
								const {path, level} = val;
								val.children.records.push({type: 'more', children: [], path, level});
							}
							checkChildren(val.children.records);
						}
					});
				}

				checkChildren(this.treeData);
			},
			fetchTreeData() { //获取树状
				this.loading = true;
				this.$store.dispatch('fullTreeLoading', true);
				let postData = {
					level: 0,
					path: "",
					page: 1,
					rows: 20,
					key: this.datasetKeyword
				};
				const queryKey = Object.keys(this.$route.query);
				if (queryKey.length === 1) {
					postData.datasetId = this.$route.query.id;
					this.isHasAloneId = true;
				} else {
					this.isHasAloneId = false;
				}

				return new Promise((resolve, reject) => {
					const vm = this;
					const url = this.url;
					vm.treeData = [];
					vm.axios.post(url, postData).then(res => {
						vm.loading = false;
						this.$store.dispatch('treeLoading', false);
						vm.isShowAdd = true;
						if (res.body.statusCode === 200) {
							this.$store.dispatch('fullTreeLoading', false);
							const {records} = res.body.message;
							this.isNotNull(records);
							this.$store.dispatch('setTreeData', Array.isArray(records) && records.length !== 0 && this.treeDataIsNotNull);
							if (this.getIsBusiness) {
								this.$router.push({name: 'DatasetDetail'});
							} else {
								this.$router.push({name: 'PhysicalDetail'});
							}
							resolve(records);
						} else {
							this.treeData = [];
						}
					});
				});
			},
			//搜索结果跳过来的精确搜索，
			keyTreeSearch({path = this.path, key = ""}) {
				const modelOpen = this.$store.state.modelOpen;
				const vm = this;
				//url地址没有path参数，就从全局存储状态里面获取
				let targetPath = modelOpen ? (path || this.$store.state.fetchRouter.path) + '/' : (path || this.$store.state.fetchRouter.path);
				let postData = {
					level: 0,
					key,
					page: 1,
					rows: 20,
					targetPath
				};

				return new Promise((resolve, reject) => {
					let url = vm.url;
					vm.loading = true;
					vm.axios.post(url, postData).then(res => {
						vm.loading = false;
						vm.treeData = [];
						vm.isShowAdd = true;
						const {statusCode, message} = res.body;
						const {records} = message;
						if (statusCode === 200) {
							this.isNotNull(records);
							this.$store.dispatch('setTreeData', Array.isArray(records) && records.length !== 0 && this.treeDataIsNotNull);
							this.treeData = records;

							this.hasRootPath();
							if (!this.flag) {
								this.datasetKeyword = '';
								this.treeData = this.fetchTreeData();
								this.reStructureTreeData();
								this.setOpen(this.treeData, targetPath);
								this.setFirst(this.treeData);
							} else {
								vm.setOpen(records, targetPath);
								if (this.getIsBusiness) {
									this.reStructureBusinessData();
								} else {
									this.reStructureTreeData();
								}
								this.$router.push({name: 'PhysicalDetail'});
								resolve();
							}
						} else {
							vm.treeData = [];
							reject(new Error(res.body.statusCode));
						}
					});
				});
			},
			// 判断
			hasRootPath() {
				this.flag = false;
				this.treeData.forEach(tree => {
					if (this.rootPath && this.rootPath.includes(tree.path) || tree.targetPath == this.rootPath) {
						this.flag = true;
					}
				});
			},
			setOpen(value, targetPath) {     //targetPath
				let newTargetPath = null;
				if (!value) {
					return;
				}

				if (targetPath) {
					newTargetPath = targetPath.endsWith('/') ? targetPath.slice(0, -1) : targetPath;
				}

				value.map((val, index) => {
					if (val.children) {
						if (newTargetPath && newTargetPath === val.path) {     //查询的路径和当前的遍历的路径的path值相等,则下面的子节点收起来
							this.$set(val, 'open', false);
						} else if (newTargetPath && val.path.includes(newTargetPath.slice(0, newTargetPath.lastIndexOf('/') + 1))) {  //同级的默认收起来
							this.$set(val, 'open', false);
						} else {
							this.$set(val, 'open', true);
						}
						this.setOpen(val.children.records, targetPath);
					} else {
						this.$set(val, 'open', false);
					}
				});
			},
			setFirst(data) {
				const vm = this;
				const datafirst = data[0];
				if (!datafirst) {
					let path = '';
					let datasetId = 0;
					this.$store.dispatch('fetchRouter', {datasetId, path});
				} else {
					let {path, folder, datasetId, title} = datafirst;
					if (datafirst.hasChild && datafirst.children != null) {
						vm.setFirst(datafirst.children.records);
					} else {
						if (this.getIsBusiness && datafirst.folder) {
							const {title, path} = datafirst;
							this.$store.dispatch('saveBusinessState', {title, path});
							this.$store.dispatch('saveTreeItemActive', {path, datasetId: null});//保存当前点击
						} else {
							this.$store.dispatch('saveBusinessState', {title: '', path: ''});
						}
						this.$store.dispatch('fetchRouter', {datasetId, path});
						if (this.isHasAloneId) {
							Bus.$emit('show:keyword', title);
						}
					}
				}
			},
			addNewTheme() {
				this.dialogFormVisible = true;
				this.resetValidators('addFileForm');
			},
			addFileCommit(formName) {
				const title = this.addFileForm.name.trim();
				this.$store.dispatch('saveTreeItemActive', {path: title, datasetId: null});//保存当前点击
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let params = {
							path: "",
							title
						};
						let _url = `/topic/create`;
						this.buttonDisabled = true;
						this.axios.post(_url, params)
							.then((res) => {
								const code = res.body.statusCode;
								if (code === 200) {
									this.dialogFormVisible = false;
									this.message(`${this.$t('content.common.chuangj')}${this.$t('content.common.chengg')}!`, "success");
									this.fetchTopicTree();
									Bus.$emit('refreshTree', {path: title, datasetId: 0});
								}
								this.buttonDisabled = false;
							});
					} else {
						return false;
					}
				});
			},

			fetchTopicTree(key = null) {
				const vm = this;
				const data = {
					level: 0,
					page: 1,
					path: "",
					rows: 10000,
					key
				};
				const res = httpRequest({
					vm,
					url: '/search/topicTree',
					type: 'post',
					data
				});
				res.then(res => Bus.$emit('searchTopic', res.records));
			}
		}
	};
</script>
<style scoped lang="less">
	#data-set {
		height: 100%;
		width: 100%;

		.datasetList {
			position: relative;
			margin: -15px -15px 0;
			height: calc(~"100% + 15px");

			.structure-container {
				overflow: auto;
				height: calc(~"100% - 44px");
				position: relative;

				.dbList {
					overflow: auto;
					height: 100%;
					margin-bottom: 0;

					&.pb45 {
						padding-bottom: 45px;
					}
				}
			}

			img {
				display: inline-block;
			}
		}

		.content {
			overflow: hidden;
		}
	}
</style>
