<template>
<div class="dataImportJob">
	<div class="title">
		<div class="titShow"><span></span>数据源获取任务列表</div>
	</div>
<!-- 	<div class="crumb">数据源获取任务列表</div> -->
	<div class="tabCon">
		<div class="loading" v-if="tableConLoading"></div>

		<div class="boxCommon" :class="{hidden: activeTab != 'tableList'}" v-if="{active: activeTab == 'tableList'}">
			<div class="con">
				<!-- <div class="tableTitle">
					<div class="name" v-if="tableSummary">任务列表</div>
					<a href="javascript:;" style="float: right;" @click="addSource">添加任务</a>
				</div> -->
				<div class="tit"><a href="javascript:;"  @click="addSource" ><span><img src="../../assets/images/dataImport.png"></span>新建获取任务</a></div>
				<table class="table table-bordered tableList">
					<thead>
						<tr>
							<th>数据源名称</th>
							<th>任务名</th>
							<th>数据类型</th>
							<th>执行类型</th>
							<th>执行周期</th>
							<th>创建人</th>
							<th>任务创建时间</th>
							<th>更新时间</th>
							<th>任务状态</th>
							<th class="opt">操作</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(value, key) in tableDetail">
							<td>{{value.dataSourceName}}</td>
							<td>{{value.taskName}}</td>
							<td>{{value.dataType}}</td>
							<td>{{value.executeType}}</td>
							<td>{{cron2name(value.cron)}}</td>
							<td>{{value.creator}}</td>
							<td>{{value.createDate}}</td>
							<td>{{value.modifyDate}}</td>
							<td v-html="statusSet(value.status)"></td>
							<td class="optGroup">
								<a href="javascript:;" class="btn" @click="editInfo(value)"><span title="修改" class="glyphicon glyphicon-pencil"></span></a>
								<a href="javascript:;" class="btn" @click="delInfo(value.id)"><span title="删除" class="glyphicon glyphicon-trash"></span></a>
							</td>
						</tr>
					</tbody>
				</table>

				<el-dialog :title="dialogTitle" :visible.sync="dialogVisible" custom-class="dialogComment">
					<form>
						<div class="form-group">
							<label for="input1">选择数据源:</label>
							<div><select class="form-control" v-model="task_refId">
								<option v-for="option in sourceList" :value="option.id">
								{{ option.businessName }}
								</option>
							</select>
							</div>
						</div>
						<div class="taskInfoTit">
							任务信息
						</div>
						<div class="form-group taskInfo">
							<label for="input2"><i>*</i>任务名称:</label>
							<div>
								<input type="text" class="form-control" id="input3" v-model="task_taskName">
							</div>
						</div>
						<div class="form-group taskInfo">
							<label for="input3"><i>*</i>任务类型:</label>
							<div><select id="task_datasetType" class="form-control" v-model="task_datasetType">
								<option value="-1">-- 请选择 --</option>
								<option value="APPLICATION">application</option>
								<option value="DATASET">dataset</option>
								<option value="HDFS">hdfs</option>
								<option value="LINEAGE">Lineage</option>
							</select>
							</div>
						</div>

						<div class="form-group taskInfo" v-if="task_datasetType != 'HDFS'">
							<label for="input3"><i>*</i>执行类型:</label>
							<div><select id="task_type" class="form-control" v-model="task_type">
							<option value="-1">-- 请选择 --</option>
							<option value="AZKABAN LINEAGE">Azkaban lineage</option>
							<option value="AZKABAN">Azkaban</option>
							<option value="ORACLE">Oracle</option>
							<option value="MYSQL">Mysql</option>
							<option value="HIVE">Hive</option>
							<option value="OOZIE">Oozie</option>
							</select>
							</div>
						</div>
						<div class="form-group taskInfo">
							<label for="input4"><i>*</i>执行时间:</label>
							<div><select class="form-control" v-model="task_cron">
								<option value="-1">-- 请选择 --</option>
								<option value="0 0 * * * ?">每小时</option>
								<option value="0 0 1 * * ?">每天</option>
								<option value="0 10 0 ? * MON">每周</option>
								<option value="0 10 0 1 * ?">每月</option>
							</select>
							</div>
						</div>
					</form>

					<div class="range"  v-if="task_type == 'AZKABAN LINEAGE'">
						<div  class="rangeTit">
							获取的数据范围
						</div>
						<div class="form-group taskInfo">
							<label>lookback_period:</label>
							<input type="text" class="form-control" v-model="task_lookback_period">
						</div>
						<div class="form-group taskInfo">
							<label>hadoop 历史访问地址:</label>
							<input type="text" class="form-control" v-model="task_hadoop_jobhistory_url">
						</div>
					</div>

					<div class="range" v-if="task_type == 'AZKABAN'">
						<div  class="rangeTit">
							获取的数据范围
						</div>
						<div class="form-group">
							<label>抓取azkaban流程数据开始时间:</label>
							<input type="text" class="form-control" v-model="task_lookback_period">
						</div>
					</div>

					<div class="range" v-if="task_type == 'ORACLE'">
						<div  class="rangeTit">
							获取的数据范围
						</div>
						<div class="form-group taskInfo">
							<label>不获取元数据DB：</label>
							<input type="text" class="form-control" v-model="task_exclude_db">
						</div>
						<div class="form-group taskInfo">
							<label>是否抓取样本数据:</label>
							<select class="form-control" v-model="task_load_sample">
								<option>-- 请选择 --</option>
								<option value="true">是</option>
								<option value="false">否</option>
							</select>
						</div>
					</div>

					<div class="range"  v-if="task_type == 'MYSQL'">
						<div  class="rangeTit">
							获取的数据范围
						</div>
						<div class="form-group">
							<label>不获取元数据DB:</label>
							<input type="text" class="form-control" v-model="task_exclude_db">
						</div>
					</div>

					<div class="range"  v-if="task_datasetType == 'HDFS'">
						<div class="taskInfoTit">
							配置信息
						</div>
						<div class="form-group taskInfo">
							<label>名称:</label>
							<input type="text" class="form-control" v-model="hdfsName">
						</div>
						<div class="form-group taskInfo">
							<label>是否使用HDFS配置文件:</label><br>
							<select class="form-control" v-model="useConfigration">
								<option value="-1">-- 请选择 --</option>
								<option value="1">是</option>
								<option value="0">否</option>
							</select>
						</div>
						<div class="form-group taskInfo">
							<label>主机名:</label>
							<input type="text" class="form-control" v-model="host">
						</div>
						<div class="form-group taskInfo">
							<label>版本:</label>
							<input type="text" class="form-control" v-model="version">
						</div>
						<div class="form-group taskInfo">
							<label>配置路径:</label>
							<input type="text" class="form-control" v-model="configrationPath">
						</div>
						<div class="form-group taskInfo">
							<label>扫描根路径:</label>
							<input type="text" class="form-control" v-model="scanRootPath">
						</div>
						<div class="form-group taskInfo">
							<label>扫描深度:</label>
							<input type="text" class="form-control" v-model="scanDepth">
						</div>

					</div>

					<span slot="footer" class="dialog-footer">
						<el-button type="primary" @click.native="dialogSubmit()">保 存</el-button>
						<el-button @click.native="dialogVisible = false">取 消</el-button>
					</span>
				</el-dialog>

			</div>
		</div>
	</div>
</div>
</div>

</template>

<script>
import Highcharts from '../Highcharts'
import 'sweetalert/dist/sweetalert.css'
import swal from 'sweetalert'
export default {
	components: {
		Highcharts
	},
	data() {
		return {
			tableConLoading: false,
			ref_type: '',
			tabList: {
				'tableList': '元数据变更统计表'
			},
			tableId: '',
			activeTab: 'tableList',
			tableDetail: {},
			tableSourceDetail: {},

			chartType: 'column',
			chartSeries: [],
			chartDate: [],

			tableTitle: '变更记录',
			tableSummary: true,

			sourceList: [],

			detailSource: '',
			detailSourceName: '',
			detailType: '',

			dialogTitle: '',
			dialogVisible: false,

			s_id: '',
			s_businessName: '',
			s_type: '',
			s_url: '',
			s_driverName: '',
			s_username: '',
			s_password: '',

			s_type: '请选择',
			sourceType: ['请选择','MYSQL','ORACLE','SQLSERVER','DB2','HIVE','POSTGRESQL'],

			taskId: '',
			task_refId: -1,
			task_taskName: '',
			task_type: -1,
			task_cron: -1,
			task_datasetType: -1,

			hdfsName: '',
			useConfigration: -1,
			host: '',
			version: '',
			configrationPath: '',
			scanRootPath: '',
			scanDepth: -1,

			task_lookback_period: '',
			task_hadoop_jobhistory_url: '',
			task_exclude_db: '',
			task_load_sample: -1,



			statusSetObj: {
				'ERROR': '<span class="fontError">执行失败</span>',
				'SUCCEEDED': '<span class="fontSuccess">执行成功</span>',
			},

			cronName: {
				'0 0 * * * ?': '每小时',
				'0 0 1 * * ?': '每天',
				'0 10 0 ? * MON': '每周',
				'0 10 0 1 * ?': '每月'
			}
		}
	},
	props: {
	    name: String
	},
	created() {
		this.fetchData()
		this.fetchSourceData()
	},
	watch: {
		'$route': 'fetchData',
		'task_datasetType': function(v, old){

		}
	},
	computed: {

	},
	methods: {
		cron2name(cron){
			if ( this.cronName[cron] ){
				return this.cronName[cron]
			}
			return cron
		},

		statusSet(type){
			return this.statusSetObj[type]
		},
		fetchSourceData() {
			this.axios.get('datasource/list')
			.then(function(ret) {
				if(ret.body.return_code == 407){
					this.$router.push({ name: 'Login'})
					return
				}
				this.sourceList.push({'id': -1, 'businessName': '请选择数据源'})
				this.sourceList = this.sourceList.concat(ret.body.message.records);
			})
		},

		fetchData() {
			this.tableConLoading = true

			this.axios.get('job/list')
			.then(function(ret) {
				if(ret.body.return_code == 407){
					this.$router.push({ name: 'Login'})
					return
				}

				this.tableDetail = ret.body.message.records;

				this.tableConLoading = false
			})
		},

		delInfo(id){
			var self = this
			swal({
				title: '提示',
				text: '确定要删除这条任务信息吗?',
				type: 'info',
				customClass: "twitter",
				cancelButtonText: '取消',
				confirmButtonText: '确定',
				showCancelButton: true,
				closeOnConfirm: false
			}, function(){
				self.axios.post('job/'+id+'/delete')
				.then(function(ret) {
					if(ret.body.return_code == 407){
						self.$router.push({ name: 'Login'})
						return
					}
					if ( ret.body.code != 200 ){
						swal({
							title:'提示',
							text: ret.body.message,
							type: 'info',
							customClass: "twitter"
						});
						return
					}
					swal({
						title:'提示',
						text: '删除成功',
						type: 'success',
						customClass: "twitter",
						timer:2000
					});

					self.fetchData()
				})
			})
		},
		editInfo(value){
			this.axios.get('job/'+ value.id)
			.then(function(ret) {
				if(ret.body.return_code == 407){
					this.$router.push({ name: 'Login'})
					return
				}

				let _data = ret.body.message

				this.taskId = _data.id
				this.task_refId = _data.refId
				this.task_taskName = _data.taskName
				this.task_type = _data.executeType
				this.task_cron = _data.cron

				let _type = _data.dataType
				if(_type == 'OPERATION'){
					_type = 'APPLICATION'
				}else if(_type == 'FILE'){
					_type = 'HDFS'
				}

				this.task_datasetType = _type

				this.task_lookback_period = _data.taskName
				this.task_hadoop_jobhistory_url = _data.taskName
				this.task_exclude_db = _data.taskName
				this.task_load_sample = _data.taskName

				this.task_hadoop_jobhistory_url = _data.properties.hadoop_jobhistory_url
				this.task_exclude_db = _data.properties.exclude_db
				this.task_load_sample = _data.properties.load_sample
				this.task_lookback_period = _data.properties.lookback_period

				this.dialogTitle = '修改任务'
				this.dialogVisible = true
			})
		},

		addSource(){
			this.dialogTitle = '采集任务配置'

			this.task_refId = -1
			this.task_taskName = ''
			this.task_datasetType = -1
			this.task_type = -1
			this.task_cron = -1


			this.task_lookback_period = ''
			this.task_hadoop_jobhistory_url = ''
			this.task_exclude_db = ''
			this.task_load_sample = ''

			this.hdfsName ='',
			this.useConfigration = -1,
			this.host = '',
			this.version = '',
			this.configrationPath ='',
			this.scanRootPath = '',
			this.scanDepth = '',

			this.task_hadoop_jobhistory_url = ''
			this.task_exclude_db = ''
			this.task_load_sample = ''
			this.task_lookback_period = ''


			this.dialogVisible = true
		},

		dialogSubmit(){
			let _properties;
			if(this.task_type == 'AZKABAN LINEAGE'){
				_properties = {
					"lookback_period": this.task_lookback_period,
					"refId": this.task_refId,
					"hadoop_jobhistory_url": this.task_hadoop_jobhistory_url
				}
			}else if(this.task_type == 'AZKABAN'){
				_properties = {
					"lookback_period": this.task_lookback_period
				}
			}else if(this.task_type == 'ORACLE'){
				_properties = {
					"exclude_db": this.task_exclude_db,
					"load_sample": this.task_load_sample
				}
			}else if(this.task_type == 'MYSQL'){
				_properties = {
					"exclude_db": this.task_exclude_db
				}
			}

			let _wty = this.task_type

			if(this.task_datasetType == 'HDFS'){
				_wty = this.task_datasetType
				_properties = {
					"hdfsName": this.hdfsName,
					"useConfigration": parseInt(this.useConfigration),
					"host": this.host,
					"version": this.version,
					"configrationPat": this.configrationPat,
					"scanRootPath": (this.scanRootPath),
					"scanDepth": parseInt(this.scanDepth),
				}
			}

			if(this.dialogTitle == '修改任务'){
				this.axios.post('job/update',
					JSON.stringify({
						id: this.taskId,
						ref_id: this.task_refId,
						task_name: this.task_taskName,
						task_type: this.task_datasetType,
						wh_etl_type: _wty,
						cron_expr: this.task_cron,
						properties: _properties
					}),
					{
						// emulateJSON: true
						'Content-Type': "application/json; charset=utf-8"
					}
				)
				.then(function(ret) {
					if(ret.body.return_code == 407){
						this.$router.push({ name: 'Login'})
						return
					}
					if ( ret.body.code != 200 ){
						swal({
							title:'提示',
							text: ret.body.message,
							type: 'info',
							customClass: "twitter"
						});
						return
					}
					swal({
						title:'提示',
						text: '修改成功',
						type: 'success',
						customClass: "twitter",
						timer: 2000
					});
					this.fetchData()
					this.dialogVisible = false
				})
			}else{
				this.axios.post('job/create',
					JSON.stringify({
						ref_id: this.task_refId,
						task_name: this.task_taskName,
						task_type: this.task_datasetType,
						wh_etl_type: _wty,
						cron_expr: this.task_cron,
						properties: _properties
					}),
					{
						// emulateJSON: true
						'Content-Type': "application/json; charset=utf-8"
					}
				)
				.then(function(ret) {
					if(ret.body.return_code == 407){
						this.$router.push({ name: 'Login'})
						return
					}
					if ( ret.body.code != 200  ){
						swal({
							title:'提示',
							text: ret.body.message,
							type: 'info',
							customClass: "twitter"
						});
						return
					}
					swal({
						title:'提示',
						text: '新建成功',
						type: 'success',
						customClass: "twitter",
						timer:2000
					});
					this.fetchData()
					this.dialogVisible = false
				})
			}
		},
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
		},
		handleCurrentChange(page) {
			this.fetchCommentData(page)
		}
	}
}
</script>
