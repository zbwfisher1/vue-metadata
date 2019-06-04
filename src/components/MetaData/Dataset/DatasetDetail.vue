<template>
	<div id="main-dataset" class="datasetCon">
		<div class="no-data-wrap" v-if="!hasTreeData">
			<no-data>
				<div class="management" v-if="!$store.state.isBusiness" @click="openDialog">{{$t('content.files.a2')}}
					<!--暂无数据,请前往"管理专区"导入管理对象--></div>
			</no-data>
		</div>
		<div class="datasetCon" v-else>
			<div class="sub-nav" v-if="type !== 'HDFS'">
				<ul>
					<li v-for="(item, index) in pathShow">
                        <span v-if="index !== pathShow.length-1 && pathType !== 'hdfs'">
                            <span v-if="index !== 0" class="split-line">/</span>
                            <a href="javascript:;" @click="link(index)">{{item}} </a>
                        </span>
						<span v-else>
                            <span class="split-line">/</span>
                            <span v-ellipsis:220="item"></span>
                        </span>
					</li>
				</ul>
			</div>
			<div class="content-wrapper">
				<div class="title-top" v-if="dataType === 'table'">
					<span class="table-name" :title="headerInfo.tableName">{{headerInfo.tableName}}</span>
					<ul class="operate-container" v-if="headerInfo.status !== 1">
						<template v-if="headerInfo.status !== 2">
							<li class="icon-linkToSQL"
								v-if="headerInfo.datasourceType === 'HIVE' && headerInfo.isDefault === 1"
								@click="linkToSQL" :title="$t('content.dataset.datasetDetail.ljsql')"></li>
						</template>

						<li v-if="!isPrivate" class="icon-email" @click="shareTable" :title="$t('content.header.fsyj')">
							<!--发送邮件--></li>
						<li v-if="headerInfo.datasourceType === 'HIVE' && headerInfo.isDefault === 1"
							class="icon-auth" @click="permission" :title="$t('content.dataset.datasetDetail.sqqx')">
							<!--申请权限--></li>
						<li class="icon-favorite" :class="{'icon-unfavorite':collectActive}"
							:title="collectParams.text"
							@click="collectToggle">
						</li> <!--收藏-->
						<li class="icon-show" :class="{'icon-hide':!isPrivate}"
							v-if="propEditPrivilege"
							:title="isPrivate==0?$t('content.common.yc'):$t('content.common.qxyc')"
							@click="privateToggle(isPrivate)">
						</li> <!--隐藏-->
					</ul>
				</div>
				<component :is="dataType+'-detail'"
						   :tags="headerInfo.tags"
						   @addNewTag="addNewTag"
						   :id="queryParams.id"></component>
			</div>
		</div>
		<!-- 邮件分享 -->
		<el-dialog
				:title="$t('content.header.fsyj')"
				:visible.sync="shareDialogVisble"
				width="385px"
				:close-on-click-modal="false"
				@click.native.stop>
			<div class="tipContent">
				<el-input
						type="textarea"
						:rows="4"
						:placeholder="$t('content.header.qsremail')"
						v-model="emails">
				</el-input>
				<Error :tip="tip" :visible="expVisible"/>
			</div>

			<div slot="footer" class="dialog-footer">
				<el-button
						@click="shareDialogVisble = false">
					{{$t('content.common.qx')}}
				</el-button>
				<el-button
						type="primary"
						:disabled="buttonDisabled"
						@click="shareSubmit()">
					{{$t('content.common.qd')}}
				</el-button>
			</div>
		</el-dialog>
		<!-- 权限申请 -->
		<el-dialog
				:title="$t('content.dataset.datasetDetail.sqqx')"
				width="713px"
				:visible.sync="dialogFormVisible"
				:close-on-click-modal="false"
				@click.native.stop>
			<el-alert type="warning" :closable="false">
				{{$t('content.dataset.datasetDetail.zawbsqdxqx', [permissionParams.tableName])}}
			</el-alert>
			<el-form
					ref="permissionsForm"
					:model="permissionsForm"
					label-width="170px"
					:rules="permissionsRules">
				<div class="permission-form-label">
					{{$t('content.dataset.datasetDetail.xasqqxdxm')}}
				</div>
				<el-row type="flex" justify="space-between" class="permission-container">
					<el-col :span="11">
						<label class="permission-label">{{$t('content.common.qxz')}}</label>
						<permission-list
								:permissionData="reResMessage"
								direction="Left"
						></permission-list>
					</el-col>
					<el-col :span="2">
						<div class="grid-content select__imgCon">
							<img :src="imgSrc">
						</div>
					</el-col>
					<el-col :span="11">
						<label class="permission-label">
							{{$t('content.dataset.datasetDetail.yxz')}}
							<span class="selectNum">
                                ({{selectItems?selectItems.length:0}})
                            </span>
						</label>
						<permission-list
								:permissionData="selectItems"
								direction="Right"
								:hasDelete="true"
						></permission-list>
					</el-col>
				</el-row>
				<div v-if="itemValidator" class="item-validator">
					{{$t('content.dataset.datasetDetail.qzsxzygxm')}}
				</div>
				<el-row class="permission-container" style="margin-top: 10px;">
					<el-col :span="24">
						<label class="permission-label">
							{{$t('content.dataset.datasetDetail.sqly')}}:
						</label>
						<el-input
								type="textarea"
								:rows="4"
								:placeholder="$t('content.dataset.datasetDetail.qsrsqly')"
								v-model="permissionsForm.reason">
						</el-input>
					</el-col>
				</el-row>
				<div class="item-validator" v-show="reasonValidator">
					{{$t('content.dataset.datasetDetail.qsrsqly')}}
				</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">
					{{$t('content.common.qx')}}
				</el-button>
				<el-button type="primary"
						   @click="permissionsCommit('permissionsForm')">
					{{$t('content.common.qd')}}
				</el-button>
			</div>
		</el-dialog>
		<!-- 重复提交提示框 -->
		<el-dialog
				:title="$t('content.common.tis')"
				:visible.sync="warnVisible"
				width="385px"
				:close-on-click-modal="false"
				@click.native.stop>
			<div class="tipContent" v-for="(data, index) in messageContent">
				<p :class="data.indexOf('failed') > -1 ? 'failed' : 'success' ">
					{{tipText(data)}}
				</p>
			</div>

			<div slot="footer" class="dialog-footer">
				<el-button type="primary"
						   @click="warnVisible = false">
					{{$t('content.common.qd')}}
				</el-button>
			</div>
		</el-dialog>
		<!-- 添加注释 -->
		<el-dialog
				:title="dialogCommentTitle"
				:visible.sync="dialogCommentVisible"
				custom-class="dialogComment"
				:close-on-click-modal="false">
			<el-form
					ref="commentForm"
					:model="commentForm"
					:rules="commentRoles">
				<el-form-item prop="commentType" style="margin-bottom: 10px;">
					<el-select v-model="commentForm.commentType"
							   :placeholder="$tc('content.dataset.datasetDetail.qxzzs', 1)" style="width: 200px;">
						<el-option
								v-for="option in commentTypeOpts"
								:label="option.label"
								:value="option.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="commentText">
					<el-input type="textarea"
							  style="margin: 5px 0;"
							  v-model="commentForm.commentText"
							  :rows='7'
							  :placeholder="$tc('content.dataset.datasetDetail.qxzzs', 2)"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
                <el-button @click.native="dialogCommentVisible = false">
                    {{$t("content.common.qx")}}
                </el-button>
                <el-button :disabled="isDisable" type="primary" @click.native="dialogCommentSubmit('commentForm')">
                    {{$t("content.common.qd")}}
                </el-button>
            </span>
		</el-dialog>
		<!--增加标签-->
		<el-dialog :title="$t('content.tags.bjbq')"
				   :close-on-click-modal="false"
				   v-loading.fullscreen.lock="tagLoading"
				   width="400px"
				   :visible.sync="tagDialogVisible">
			<el-form class="del-content" label-position="left">
				<el-select v-model="tagKeyWord"
						   filterable
						   remote
						   :remote-method="remoteMethod"
						   @change="handleSelect"
						   :popper-class="popperClass"
						   :placeholder="$t('content.common.qxza')"
						   :loading="loading">
					<template v-if="options.length > 1">
						<el-option v-for="item in options"
								   :key="item.id"
								   :label="item.name"
								   :value="item">
							<span :class="{tag: item.id === -1}">{{ item.name }}</span>
						</el-option>
					</template>
					<el-option key="noData"
							   value="noData"
							   label=""
							   v-if="options.length === 1 && tagQueryLength">
						<div class="add-tags">
							{{$t("content.tags.zwppsj")}}
							<span>{{$t("content.tags.tj")}}</span>
						</div>
					</el-option>
				</el-select>
				<el-form-item class="tag-select" :label="$t('content.dataset.datasetDetail.yxz')" label-width="70px">
					<template v-if="tags.length">
						<el-tag size="small"
								closable
								@close="handleClose(tag)"
								v-for="tag in tags">{{tag.name}}
						</el-tag>
					</template>
					<template v-else>
						{{$t('content.common.zwsj')}}
					</template>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="tagDialogVisible = false">
					{{$t('content.common.qx')}}
				</el-button>
				<el-button type="primary" :loading="btnLoading" @click="submitTag">
					{{$t('content.common.qd')}}
				</el-button>
			</div>
		</el-dialog>
		<!--查看关联标签-->
		<el-dialog :title="$t('content.tags.ckgldx',[currentTag.name])"
				   :close-on-click-modal="false"
				   class="dialog-add-tags"
				   width="700px"
				   :visible.sync="addTagDialogVisible">
			<tag-detail :id="currentTag.id" :visible="addTagDialogVisible"></tag-detail>
		</el-dialog>
	</div>
</template>

<script>
	import DatatypeDetail from './DatasetDetail/DataTypeDetail';
	import DatabaseDetail from './DatasetDetail/DatabaseDetail';
	import DatasourceDetail from './DatasetDetail/DatasourceDetail';
	import TableDetail from './DatasetDetail/TableDetail';
	import Error from 'components/common/Error';
	import permissionList from './DatasetDetail/PermissionList';
	import TagDetail from './chiildren/TagDetail';
	import {Message, FormatTime, resetValidators, testPrivilege} from 'mixins/common';
	import Bus from 'utils/bus';
	import {mapState} from 'vuex';
	import Vue from 'vue';
	import {strMapToObj} from 'utils';
	import {getTagList, addToTag, createTag} from '@/service/getData';
	import {textFieldLength} from '@/config/env';

	export default {
		data() {
			return {
				rows: 99999, //每页数量
				order: '', //排序字段
				sort: '',   //asc或desc
				currentPage: 1,   //当前页
				totalRows: 0,     //总记录数
				totalPages: 0,    //总页数
				tagKeyWord: '', //搜索关键字
				tagQuery: '',
				tagLoading: false,
				options: [],
				tags: [],
				isDisable: false,
				loading: false,
				messageContent: [],
				isComment: true,
				reasonValidator: false,
				btnLoading: false,
				addTagDialogVisible: false,
				tagDialogVisible: false,
				form: {
					name: '',
					desc: ''
				},
				rules: {
					name: [
						{required: true, message: this.$t('content.tags.a1'), trigger: 'blur'}, /* 请输入标签名称 */
						{
							min: 1,
							max: textFieldLength.normal,
							message: this.$t('content.tags.a2'),
							trigger: 'blur'
						}  /*长度在 1 到 50 个字符*/
					],
					desc: [
						{required: true, message: this.$t('content.tags.a3'), trigger: 'blur'}, /*请输入标签描述*/
						{
							min: 1,
							max: textFieldLength.large,
							message: this.$t('content.tags.a2'),
							trigger: 'blur'
						} /*长度在 1 到 50 个字符*/
					]
				},
				dialogCommentTitle: this.$t('content.dataset.datasetDetail.tjzs'), //添加注释信息对话框标题
				dialogCommentVisible: false, //添加注释信息对话框显示隐藏
				commentRoles: {
					commentType: [
						// { required: true, message: '请选择注释类型', trigger: 'change'}
						{required: true, message: this.$tc('content.dataset.datasetDetail.qxzzs', 1), trigger: 'change'}
					],
					commentText: [
						{required: true, message: this.$tc('content.dataset.datasetDetail.qxzzs', 2), trigger: 'blur'},
						{max: 500, message: this.$t('content.validator.cdbdcg', [500]), trigger: 'blur'}
					]
				},
				permissionsRules: {
					type: [{type: 'array', required: true}],
					project_arr: [
						{type: 'array', required: true, message: this.$t('content.dataset.datasetDetail.qzsxzygxm')}],
					reason: [
						{required: true, message: this.$t('content.dataset.datasetDetail.qsrsqly'), trigger: 'blur'},
						{min: 1, max: 200, message: this.$t('content.dataset.datasetDetail.sqlybdcg'), trigger: 'blur'}
					]
				},
				commentTypeOpts: [
					{
						value: 'ParamsInfo',
						label: this.$t('content.dataset.datasetDetail.sxxxwt')
					},
					{
						value: 'FieldsDes',
						label: this.$t('content.dataset.datasetDetail.zdxxwt')
					},
					{
						value: 'Other',
						label: this.$t('content.dataset.datasetDetail.qita')
					}
				],
				collectActive: false,
				headerInfo: {
					tags: []
				},
				lastModifyTime: null,
				//邮箱分享
				shareDialogVisble: false,
				expVisible: false,
				emails: '',
				buttonDisabled: false,
				resMessage: [],//返回的数据
				permissionsForm: {
					type: ['r'],
					project_arr: [],//已选择的数组
					reason: null
				},
				selectedMap: new Map(),//已选择的值
				warnVisible: false,
				dialogFormVisible: false,
				imgSrc: require('assets/images/icon_select.png'),
				brushIcon: require('assets/images/brush_icon.png'),
				itemValidator: false,

				commentForm: {
					commentType: '',
					commentText: ''
				},
				hasApplyAuthority: false,
				tip: '',   //提示信息
				currentTag: {
					id: 0,
					name: ''
				}
			};
		},
		props: ['type'],
		mixins: [Message, FormatTime, resetValidators, testPrivilege],
		components: {
			DatatypeDetail,     //数据类型详情
			DatasourceDetail,   //数据源详情
			DatabaseDetail,     //数据库详情
			TableDetail,        //表详情
			permissionList,
			Error,
			TagDetail
		},
		watch: {
			dialogFormVisible(val) {
				if (!val) {  //如果是关闭弹窗,则把以前的验证结果提示信息清除
					this.itemValidator = false;
					this.reasonValidator = false;
				}
			},
			tagDialogVisible(val) {
				if (!val) {
					this.tags = this.headerInfo.tags.slice();
				}

			},
			'$route'() {
				if (this.dataType === 'table' && this.queryParams.id) {
					this.testPrivilege(`/tag/addToTag/${this.queryParams.id}`);
				}
			}
		},
		computed: {
			tagQueryLength() {
				return this.tagQuery && !!this.tagQuery.length;
			},
			popperClass() {
				return this.options.length > 1 ? 'popper' : 'popper-tags';
			},
			formParams() {
				const {reason} = this.permissionsForm;
				const {datasetId} = this.permissionParams;
				let project_arr = [];
				this.selectItems.forEach(val => {
					let single = new Map();
					single.set('id', val.id);
					single.set('name', val.name);
					single.set('type', val.reType);
					let obj = strMapToObj(single);
					project_arr.push(obj);
				});
				return {
					dataset_id: datasetId,
					project_arr,
					reason
				};
			},//请求参数
			permissionParams() {
				const {id, path} = this.queryParams;
				let _path = path && path.split("/");
				return {
					datasetId: Number(id),
					dbAndTable: _path && _path.slice(-2).join('.'),
					tableName: _path && _path.slice(-1).toString()
				};
			},
			getIsBusiness() {
				return this.$store.state.isBusinessTitle ? this.$t('content.tree.ywst') : this.$t('content.tree.wlst');
			},
			queryDatasetParams() {
				return this.$store.state.viewData;
			},
			dataType() {
				return this.queryDatasetParams.viewActive;
			},//判断是表、库、源、类型
			queryParams() {
				const path = this.$route.query.path ? this.$route.query.path : this.$store.state.fetchRouter.path;
				const id = this.$route.query.id ? this.$route.query.id : this.$store.state.fetchRouter.datasetId;
				path && path.replace('://', '/');
				return {
					path,
					id
				};
			},
			pathShow() {
				let _path = this.queryParams.path;
				let path = "";
				if (_path) {
					path = _path && _path.split('/');
				}
				return path;
			},
			pathType() {
				return this.pathShow && this.pathShow.slice(0, 1);
			},
			collectParams() {
				const map = new Map([
					[false, {type: "post", text: this.$t('content.common.shouc')}],
					[true, {type: "delete", text: this.$t('content.common.qxsc')}]
				]);
				return map.get(this.collectActive);
			},
			...mapState({
				dataStatus: 'dataStatus',
				hasTreeData: "hasTreeData",
				isPrivate: 'isPrivate',
				selectItems: 'selectItems',
				propEditPrivilege: 'propEditPrivilege',
				lang: 'language'
			}),
			reResMessage: {
				get: function() {
					this.resMessage.forEach(val => {
						let singleObj = {};
						if (val.type) {
							this.$set(val, 'hasDisabled', true);
							this.$set(val, 'initW', val.type.includes('w') ? true : false);
							this.$set(val, 'initR', val.type.includes('r') ? true : false);
						} else {
							this.$set(val, 'hasDisabled', false);
							this.$set(val, 'initW', false);
							this.$set(val, 'initR', false);
						}
						this.$set(val, 'reType', null);
					});
					return this.resMessage;
				}
			},
			tagIds() {
				let ids = [];
				this.tags.forEach(tag => ids.push(tag.id));
				return ids;
			}
		},
		created() {
			Bus.$on('headerInfo', data => {
				this.headerInfo = data;
				this.tags = data.tags.slice();   //复制数组
			});
			Bus.$on('lastModifyTime', data => {
				this.lastModifyTime = this.formatTime(data);
			});
			Bus.$on('commentTab', (data) => {
				this.isComment = data === 'comments';
			});
			if (this.dataType === 'table' && this.queryParams.id) {
				this.testPrivilege(`/tag/addToTag/${this.queryParams.id}`);
			}
		},
		mounted() {
			// 是否有申请权限
			Bus.$on('hasApplyAuthority', state => {
				this.hasApplyAuthority = state !== 0;
			});
			Bus.$on('IncreaseCollection', state => {
				this.collectActive = state;
			});
		},
		methods: {
			openDialog() {
				Bus.$emit('open:import:dialog');
			},
			viewGroup(tag) {
				this.currentTag = tag;
				this.addTagDialogVisible = true;
			},
			handleSelect(selectTag) {
				if (selectTag !== 'noData' && selectTag.id !== -1) {
					if (this.tags.every(tag => selectTag.id !== tag.id)) {
						this.tags.push(selectTag);
					}
					this.tagKeyWord = '';
					this.options = [];
					this.tagQuery = '';
				} else {
					this.tagKeyWord = '';
					this.options = [];
					this.tagLoading = true;
					createTag(null, this.tagQuery, '').then(res => {
						const {statusCode, message} = res.data;
						this.tagLoading = false;
						if (statusCode === 200) {
							this.$message({
								message: this.$t('content.personal.a31'),
								type: 'success'
							});
							this.tagQuery = '';
							if (this.tags.every(tag => message.id !== tag.id)) {
								this.tags.push(message);
							}
						}
					});
				}
			},
			handleClose(removeTag) {
				this.tags = this.tags.filter(tag => tag.id !== removeTag.id);
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						const {name, desc} = this.form;
						this.btnLoading = true;
						createTag(null, name, desc).then(res => {
							const {statusCode} = res.data;

							this.btnLoading = false;
							if (statusCode === 200) {
								this.$message({
									message: this.$t(`content.personal.a31`),
									type: 'success'
								});
								this.addTagDialogVisible = false;
								this.btnLoading = false;
							}
						});
					} else {
						return false;
					}
				});
			},
			submitTag() {
				this.btnLoading = true;
				addToTag(this.queryParams.id, this.tagIds).then(res => {
					const {statusCode, message} = res.data;
					this.btnLoading = false;
					if (statusCode === 200) {
						this.tagDialogVisible = false;
						this.headerInfo.tags = this.tags.slice();
						this.$message({
							message: this.$t('content.tags.a4'),
							type: 'success'
						});
					}
				});
			},
			remoteMethod(query) {
				this.tagQuery = query;
				if (query !== '') {
					const {rows, currentPage: page, order, sort} = this;
					this.loading = true;
					getTagList({
						rows,
						page,
						order,
						sort,
						name: query
					}).then(res => {
						const {statusCode, message} = res.data;
						this.loading = false;
						if (statusCode === 200) {
							const {records} = message;
							records.push({
								id: -1,
								name: this.$t('content.tags.a5')
							});
							this.options = records;
						}
					});
				} else {
					this.options = [];
				}
			},
			addNewTag() {
				this.tagDialogVisible = true;
			},
			openInNewTab(url) {
				const a = document.createElement("a");
				a.setAttribute("href", url);
				a.setAttribute("target", "testNewWindow");
				document.body.appendChild(a);
				a.click();
			},
			updateNewWindowUrl(url) {
				const newWindow = window.open(null, 'testNewWindow');
				newWindow.location.href = url;
			},
			closeTab() {
				const newWindow = window.open(null, 'testNewWindow');
				newWindow.close();
			},
			//链接到SQL
			linkToSQL() {
				const database = this.headerInfo.datasetInfo.databaseName;
				const table = this.headerInfo.datasetInfo.datasetName;
				const tableId = this.headerInfo.datasetInfo.id;

				this.openInNewTab("about:blank"); //先打开新窗口
				this.axios.get(`/datasets/${tableId}/privilege`).then(res => {
					if (res.body.statusCode === 200) {
						const {_lpt_, proxyUser} = res.body.message;
						//判断无权访问sql
						debugger;
						if (!proxyUser) {
							this.closeTab();
							this.message(this.$t('content.dataset.datasetDetail.wqxfw'), 'error');
						} else {
							this.getLink(database, table, proxyUser, _lpt_);
						}
					} else {
						this.closeTab();
						this.message(this.$t('content.dataset.datasetDetail.fwqlbcw'), 'error');
					}
				}, response => {
					this.closeTab();
					this.message(this.$t('content.dataset.datasetDetail.fwqlbcw'), 'error');
				});
			},
			getLink(database, table, proxyUser, _lpt_) {
				let host = window.localStorage.getItem('sqlEntry');
				const url = `${host}/outerapi/v1/getOutterSql/key/?database=${database}&table=${table}&proxyUser=${proxyUser}&_lpt_=${_lpt_}`;
				this.axios.get(url).then(res => {
					const {code, data} = res.data;
					if (code === 1) {
						console.log(`${host}?queryKey=${data}&_lpt_=${_lpt_}`);
						this.updateNewWindowUrl(`${host}?queryKey=${data}&_lpt_=${_lpt_}`);
					}
				}, response => {
					this.closeTab();
					this.message(this.$t('content.dataset.datasetDetail.save'), 'warning');
				});
			},
			checkboxChange() {
				if (this.versionOptions.length > 2) {
					this.$message({
						message: this.$t('content.dataset.datasetDetail.znxzlgbb'),
						type: 'warning',
						showClose: true
					});
					this.versionOptions.splice(2, this.versionOptions.length - 2);
				}
			},
			addComments() {
				this.dialogCommentVisible = true;
				Object.keys(this.commentForm).forEach(key => {
					this.commentForm[key] = '';
				});
			},
			// 提交注释信息
			dialogCommentSubmit(formName) {
				this.$refs[formName].validate((valid) => {
					if (!valid) {
						return;
					}
					this.isDisable = true;

					let id = this.$route.query.id ? this.$route.query.id : this.$store.state.fetchRouter.datasetId;

					let _url = '/datasets/' + id + '/comments';
					let _param = {
						refId: id,
						text: this.commentForm.commentText,
						type: this.commentForm.commentType
					};
					if (this.commentId !== '') {
						_param['id'] = this.commentId;
					}
					// 点击之后直接关掉对话框，以免用户一直点击
					this.dialogCommentVisible = false;

					this.axios({
						method: "POST",
						url: _url,
						params: _param
					}).then(res => {
						this.isDisable = false;
						this.commentForm.commentText = '';
						if (res.body.statusCode !== 200) {
							const messageContent = res.body.message ||
								([this.$t('content.commont.tj'), this.$t('content.common.xg')][_param['id'] ? 1 : 0] + `${this.$t('content.common.shib')}!`);
							this.message(`${messageContent}!`, "error");

						} else {
							this.isComment && Bus.$emit('fetchComment');
							this.message(this.$t('content.dataset.businessDetail.tjcg'), "success");
						}
					});
				});
			},

			tipText(txt) {
				if (txt.indexOf('failed') >= 0) {
					return '"' + txt.replace(/ failed for applying repeatedly/g, '" ' + this.$t('content.dataset.businessDetail.cftj'));
				} else {
					return '"' + txt.replace(/ apply sucessfully/g, '" ' + this.$t('content.dataset.datasetDetail.tjcg'));
				}
			},
			link(index) {
				const _index = index + 1;
				const query = this.queryDatasetParams.viewNotTable[_index];
				const {path, view} = query;
				const status = view === 'business';
				this.$store.dispatch('setBusiness', status);
				this.$store.dispatch('saveTreeItemActive', {path});
				Bus.$emit('refreshTree', {path, datasetId: 0});
			},
			shareTable() {
				this.emails = '';
				this.expVisible = false;
				this.shareDialogVisble = true;
			},
			fetchEmail() {
				this.expVisible = false;
				this.buttonDisabled = true;
				let targetUrl = null;

				if (this.$route.path.startsWith('/Main/Files')) {
					targetUrl = `/Main/Files?id=${this.queryParams.id}`;
				} else {
					targetUrl = `/Main/MetaData/Physical/PhysicalDetail?id=${this.queryParams.id}`;
				}

				this.axios.post('/datasets/shareDataset', {
					datasetId: this.queryParams.id,
					targetUsers: this.emails,
					lang: this.$i18n.locale,
					targetUrl
				}).then((res) => {
					this.buttonDisabled = false;
					const {statusCode, message} = res.body;
					if (statusCode === 200) {
						this.message(this.$t('content.header.fxcg'), 'success');
						this.shareDialogVisble = false;
					} else {
						this.message(this.$t('content.header.fxsb'), 'error');
					}
				});
			},
			shareSubmit() {
				this.expVisible = false;
				this.tip = '';
				const {emails} = this;
				const patt1 = emails.indexOf('，'); //中文分号
				const patt2 = emails.indexOf(',');  //英文分号
				const patt3 = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
				if (emails.length > 0) {
					if (patt1 !== -1) {  //当为中文分号
						this.expVisible = true;
						this.tip = this.$t('content.header.fhbnwzw');
					} else if (patt2 !== -1) { //当存在英文分号，即邮箱不只一个
						const arrayMail = emails.split(',').filter(item => item);   //去掉空数组;
						let verifyState = true;
						arrayMail.map(email => {
							const isEmail = patt3.test(email.trim());
							if (!isEmail) { //当多个邮箱都符合邮箱格式
								verifyState = false;
							}
						});
						if (verifyState) {
							this.fetchEmail();
						} else {
							this.expVisible = true;
							this.tip = this.$t('content.header.qzygyxgsbfyq');
						}
					} else if (patt3.test(emails)) {  //当只有一个邮箱
						this.fetchEmail();
					} else {
						this.expVisible = true;
						this.tip = this.$t('content.header.yxgsbfyq');
					}
				} else {
					this.expVisible = true;
					this.tip = this.$t('content.header.yxbnwk');
				}
			},
			privateToggle: _.debounce(async function(isPrivate) {
				let url = isPrivate == 0 ? `/private/privateDataset/${this.queryParams.id}` : `/private/publicDataset/${this.queryParams.id}`;
				await this.axios.post(url).then(res => {
					if (res.body.statusCode == 200) {
						let privateState = isPrivate == 0 ? 1 : 0;
						let messageContent = isPrivate == 0 ? this.$t('content.common.yccg') : this.$t('content.common.qxyccg');
						this.$store.dispatch('setPrivate', privateState);
						this.message(messageContent, 'success');
					} else {
						this.message(this.$t('content.header.czsb'), 'error');
					}
				});

			}, 1000),

			collectToggle: _.debounce(async function() {
				const vm = this;
				const url = `/datasets/${this.queryParams.id}/favorite`;
				const {type, text} = this.collectParams;
				const res = await vm.axios[type](url);
				const status = res.body.statusCode === 200;
				if (status) {
					vm.collectActive = !vm.collectActive;
					Vue.config.lang == 'zh-CN' ? vm.message(`${text}${this.$t('content.common.chengg')}!`, "success") : vm.message(`${text}${this.$t('content.common.chengg')}!`, "success");
				} else {
					Vue.config.lang == 'zh-CN' ? vm.message(`${text}${this.$t('content.common.shib')}!`, "error") :
						vm.message(`${text}${this.$t('content.common.shib')}!`, "error");
				}
			}, 500),
			permission: _.debounce(function() {
				this.itemValidator = false;
				this.resetForm();
				this.dialogFormVisible = true;
				this.fetchData();
			}, 500),
			resetForm() {
				this.$store.dispatch('selectItems', '');
				this.resMessage = [];
				this.permissionsForm.reason = '';
			},
			async fetchData() {
				this.resetValidators('permissionsForm');//重置表单
				this.selectedMap.clear();
				this.permissionsForm.type = ['r'];
				const url = "/project/getProjectInfo?datasetId=" + this.queryParams.id;
				const res = await this.axios.get(url);
				const {statusCode, message} = res.body;
				statusCode === 200 && Object.assign(this.$data, {resMessage: message});
			},
			async permissionsCommit(formName) {

				this.itemValidator = false;
				this.reasonValidator = false;

				if (this.selectItems.length === 0) {
					this.itemValidator = true;
				} else if (this.permissionsForm.reason.length === 0 || this.permissionsForm.reason.length > 200) {
					this.reasonValidator = true;
				} else {
					const url = "/privilege/applyPrivilege";
					const params = this.formParams;
					params.lang = this.$i18n.locale;
					const res = await this.axios.post(url, params);
					const {statusCode, message} = res.body;
					if (statusCode === 200) {
						if (message.join('').indexOf('failed') >= 0) {
							this.warnVisible = true;
							this.messageContent = message;
						} else {
							this.message(this.$t('content.dataset.datasetDetail.tjcg'), 'success');
						}
					} else {
						this.message(this.$t('content.dataset.datasetDetail.sqtjsb'), "error");
					}
					this.itemValidator = false;
					this.reasonValidator = false;
					this.dialogFormVisible = false;
				}
			}
		}
	};
</script>
<style lang="less">
	@import '../../../vars.less';

	#main-dataset {
		position: relative;
		height: 100%;

		.datasetCon {
			position: relative;
			width: 100%;
			height: 100%;

			> .title {
				padding-left: 20px;
				height: 40px;
				line-height: 40px;
				background: #FFF;

				a {
					font-size: 14px;
				}
			}

			.content-wrapper {
				background-color: #FFF;
				height: calc(~'100% - 58px');

				.title-top {
					display: flex;
					align-items: center;
					justify-content: space-between;
					height: 50px;
					background-color: #FAFBFC;
					border-bottom: 1px solid #E1E4E8;
					line-height: 49px;

					.table-name {
						margin-left: 20px;
						font-size: 20px;
						color: #2A313F;
					}

					.operate-container {
						display: flex;
						align-items: center;
						height: 40px;

						li {
							border-right: 1px solid #CCC;
							padding: 0 10px;
							width: 50px;
							height: 18px;
							line-height: 18px;
							font-size: 14px;
							background: no-repeat center center;
							cursor: pointer;

							&:last-child {
								border-right: none;
							}
						}

						.icon-linkToSQL {
							background-image: url("../@{imagesUrl}/icon/SQL.png");
						}

						.icon-compare {
							background-image: url("../@{imagesUrl}/icon/db.png");
						}

						.icon-email {
							background-image: url("../@{imagesUrl}/icon/email.png");
						}

						.icon-auth {
							background-image: url("../@{imagesUrl}/icon/qx.png");
						}

						.icon-favorite {
							background-image: url("../@{imagesUrl}/icon/sc.png");
						}

						.icon-unfavorite {
							background-image: url("../@{imagesUrl}/icon/sc_.png");
						}

						.icon-show {
							background-image: url("../@{imagesUrl}/icon/qxyc.png");
						}

						.icon-hide {
							background-image: url("../@{imagesUrl}/icon/yc.png");
						}
					}
				}

				.header-info {
					padding: 10px 20px;
					display: flex;
					align-content: center;
					justify-content: space-between;
					color: #798085;
					background-color: #FFF;

					.content {
						display: flex;

						.table-name {
							word-break: break-all;
							white-space: pre-wrap;
							margin-right: 30px;
							font-size: 25px;
							line-height: 40px;
							color: #000;
						}

						.table-fields {

							li {
								display: flex;
								align-items: center;
								float: left;
								line-height: 40px;
								margin-right: 10px;

								label {
									margin-right: 5px;
									font-size: 14px;
								}

								span {
									border-right: 1px solid #DBDFE3;

									&:last-child {
										border: 0;
									}
								}

								.button-new-tag {
									margin-left: 10px;
								}
							}
						}

					}

				}

				.dataset-box {
					> .boxCommon {
						min-height: 400px;
					}
				}

				.dataTypeDetail {
					height: 100%;
				}
			}
		}

		.item-validator {
			color: #F00;
		}

		.no-data-wrap {
			position: absolute;
			top: 50%;
			left: 50%;
			width: 100%;
			transform: translate(-50%, -50%);
			text-align: center;

			.nodata-container {
				.management {
					margin-top: 10px;
					cursor: pointer;
					color: #23527C;

					&:hover {
						text-decoration: underline;
					}
				}
			}
		}
	}

	.permission-form-label {
		margin: 20px 0 15px;
		color: #6E6E6E;
	}

	.permission-label {
		margin-bottom: 10px;
	}

	.del-content {
		.el-select {
			width: 100%;
		}

		.tag-select {
			margin-top: 20px;

			.el-tag {
				border-radius: 0;
				margin: 0 10px 0 0;

				+ .el-tag {
					margin-left: 0;
				}
			}
		}
	}

	.popper .tag {
		color: #014B70;

		&:hover {
			text-decoration: underline;
			color: #016DA4;
		}
	}

	.popper-tags {
		.el-select-dropdown__item {
			background-color: #FFF;
			height: 200px;
		}
	}

	.add-tags {
		text-align: center;
		height: 100%;
		line-height: 230px;
		background: url("../@{imagesUrl}/box.png") center 60px no-repeat;

		span {
			color: #014B70;

			&:hover {
				text-decoration: underline;
				color: #016DA4;
			}
		}
	}

	.dialog-add-tags {
		.el-dialog__body {
			background-color: #FFF;
		}

		.el-form-item {
			margin-bottom: 22px;

			.el-input,
			.el-textarea {
				width: 220px;
			}
		}
	}
</style>
