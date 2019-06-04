<template>
	<div id="create-task">
		<div class="sub-nav">
			<ul>
				<li>{{$t('content.dataset.importExport.drdc')}}<span class="split-line">/</span></li>
				<li>{{$t('content.dataset.importExport.ysjzddr')}}<span class="split-line">/</span></li>
				<li>
					<router-link :title="$t('content.dataset.importExport.ysjcj')"
								 :to="{name: 'TaskList'}">
						{{$t('content.dataset.importExport.ysjcj')}}<!--元信息采集-->
					</router-link>
					<span class="split-line">/</span>
				</li>
				<li>{{$t(`content.importExport.${isEditing ? 'bj' : 'cj'}cjsw`)}}</li>
			</ul>
		</div>
		<div class="main">
			<div class="tableMulti">
				<div class="table-title">
					<div class="table-title__text">
						<span>{{$t(`content.importExport.${isEditing ? 'bj' : 'cj'}cjsw`)}}<!--创建采集任务--></span>
						({{$t(`content.importExport.${isEditing ? 'b' : 'w'}jzdhq`)}})
					</div>
				</div>
			</div>

			<div class="step-box">
				<el-steps :active="active" finish-status="success" simple>
					<el-step :title="$t('content.import.jbpz')"></el-step><!--基本配置-->
					<el-step :title="$t('content.import.tspz')"></el-step><!--调试配置-->
					<el-step :title="$t('content.import.drdxpz')"
							 v-if="!isEditing || form.dataSourceType === 'HDFS'"></el-step>
					<!--导入对象配置-->
				</el-steps>

				<div class="form-wrapper" v-loading="loading">
					<el-form ref="form" v-show="active === 0" :model="form" :rules="rules" label-width="200px">
						<el-form-item :label="$t('content.dataset.import.rwmc')" prop="taskName">
							<el-input v-model="form.taskName" :disabled="isEditing"></el-input>
						</el-form-item>  <!--任务名称-->
						<el-form-item :label="$t('content.dataset.importExport.rwms')" prop="description">
							<el-input type="textarea" v-model="form.description"></el-input>
						</el-form-item>    <!--任务描述-->
						<div class="tableMulti">
							<div class="table-title">
								<div class="table-title__text">
									<span>{{$t('content.importExport.sjypz')}}<!--数据源配置--></span>
									({{$t('content.importExport.pzyxxcj')}}) <!--配置元信息采集数据源连接信息-->
								</div>
							</div>
						</div>
						<el-form-item :label="$t('content.import.sjymc')" prop="businessName">
							<el-input v-model="form.businessName" :disabled="isEditing"></el-input>
						</el-form-item>
						<el-form-item :label="$t('content.dataset.importExport.sjyms')" prop="dataSourceDesc">
							<el-input v-model="form.dataSourceDesc"></el-input>
						</el-form-item>
						<el-form-item :label="$t('content.dataset.importExport.sjylx')" prop="dataSourceType">
							<!--数据源类型-->
							<el-select v-model="form.dataSourceType" :disabled="isEditing">
								<template v-if="type === 'files'">
									<el-option label="HDFS" value="HDFS"></el-option>
								</template>
								<template v-else-if="type === 'tables'">
									<el-option label="HIVE" value="HIVE"></el-option>
									<el-option label="MYSQL" value="MYSQL"></el-option>
									<el-option label="ORACLE" value="ORACLE"></el-option>
									<el-option label="HBASE" value="HBASE"></el-option>
								</template>
								<template v-else>
									<el-option label="HIVE" value="HIVE"></el-option>
									<el-option label="MYSQL" value="MYSQL"></el-option>
									<el-option label="ORACLE" value="ORACLE"></el-option>
									<el-option label="HBASE" value="HBASE"></el-option>
									<el-option label="HDFS" value="HDFS"></el-option>
								</template>
							</el-select>
						</el-form-item>
						<el-form-item prop="ipAddress" :label="$t('content.dataset.importExport.ipdz')">
							<el-input v-model="form.ipAddress"></el-input>
						</el-form-item>
						<template v-if=" form.dataSourceType !== 'HBASE' && form.dataSourceType !== 'HDFS' ">
							<el-form-item prop="port" :label="$t('content.import.dkh')">
								<el-input v-model.number="form.port"></el-input>
							</el-form-item>
							<el-form-item prop="username" :label="$t('content.import.yhm')">
								<el-input v-model="form.username"></el-input>
							</el-form-item>
							<el-form-item :label="$t('content.import.mm')" prop="password">
								<el-input v-model="form.password"></el-input>
							</el-form-item>
						</template>
						<template v-if=" form.dataSourceType === 'HIVE' ">
							<el-form-item prop="databaseName" :label="$t('content.dataset.datasetDetail.km')">
								<el-input v-model="form.databaseName"></el-input>
							</el-form-item>
						</template>
						<template v-if=" form.dataSourceType === 'ORACLE' ">
							<el-form-item prop="instanceName" :label="$t('content.import.slm')">
								<el-input v-model="form.instanceName"></el-input>
							</el-form-item>
						</template>
						<template v-if=" form.dataSourceType !== 'HDFS' ">
							<!--样本数据-->
							<el-form-item :label="$t('content.dataset.datasetDetail.ybsj')" prop="getSample">
								<el-radio-group v-model="form.getSample">
									<el-radio :label=true>{{$t('content.import.hq')}}</el-radio>
									<el-radio :label="false">{{$t('content.import.bhq')}}</el-radio>
								</el-radio-group>
							</el-form-item>
						</template>


						<template v-if=" form.dataSourceType === 'HIVE' && form.getSample ">
							<el-form-item :label="$t('content.dataset.importExport.ybsjhqlj')" prop="serverUrl">
								<el-input v-model="form.serverUrl"></el-input>
							</el-form-item>
							<el-form-item :label="$t('content.dataset.importExport.hiveserver')"
										  prop="serverUsername">
								<el-input v-model="form.serverUsername"></el-input>
							</el-form-item>
							<el-form-item :label="$t('content.dataset.importExport.hiveservermm')"
										  prop="serverPassword">
								<el-input v-model="form.serverPassword" type="password"></el-input>
							</el-form-item>
						</template>

						<template v-if="hasKerberos">
							<el-form-item :label="$t('content.dataset.importExport.sfqykerb')" prop="useKerberos">
								<el-select v-model="form.useKerberos">
									<el-option :label="$t('content.common.shi')" :value="true"></el-option>
									<el-option :label="$t('content.common.fou')" :value="false"></el-option>
								</el-select>
							</el-form-item>

							<template v-if="form.useKerberos">
								<el-form-item label="kerberos principal" class="principal-input" prop="principal">
									<el-input v-model="form.principal"></el-input>
								</el-form-item>
								<el-form-item label="kerberos keytab" prop="keytab">
									<el-input v-model="form.keytab"></el-input>
								</el-form-item>
							</template>
						</template>
						<el-row>
							<router-link class="task-btn" :to="{name: 'TaskList'}">
								<el-button class="btn-return">
									{{$t('content.common.qx')}}
								</el-button>
							</router-link>
							<el-button type="primary" @click="stepped(1)">{{$t('content.common.xyb')}}</el-button>
						</el-row>
					</el-form>
					<el-form ref="form2" class="date-range-form" v-show="active === 1" :model="form2" :rules="rules2"
							 label-width="150px">
						<el-form-item :label="$t('content.import.ddpl')" prop="interval">  <!--调度频率-->
							<!--数据源类型-->
							<el-select class="cycle-select" v-model="form2.interval" @change="handleChange">
								<el-option :label="$t('content.import.ycx')" value="O"></el-option> <!--一次性-->
								<el-option :label="$t('content.import.mxsyc')" value="H"></el-option> <!--每小时一次-->
								<el-option :label="$t('content.import.mtyc')" value="D"></el-option> <!--每天一次-->
								<el-option :label="$t('content.import.mzyc')" value="W"></el-option>  <!--每周一次-->
								<el-option :label="$t('content.import.myyc')" value="M"></el-option>  <!--每月一次-->
								<el-option :label="$t('content.import.mnian')" value="Y"></el-option>   <!--每年-->
							</el-select>
						</el-form-item>
						<el-form-item :label="$t('content.import.ddsj')" v-if='form2.interval === "D"' prop="D">
							<!--调度时间-->
							<el-time-picker v-model="form2.D" value-format="timestamp"
											:placeholder="$t('content.import.rysjd')">  <!--任意时间点-->
							</el-time-picker>
						</el-form-item>
						<el-form-item class="form-item-time" :label="$t('content.import.ddsj')"
									  v-if=" form2.interval === 'W' "><!--调度时间-->
							<el-col class="line" :span="2">{{$t('content.import.mei')}}</el-col> <!--每-->
							<el-col :span="6">
								<el-form-item prop="dayOfWeek">
									<el-select v-model="form2.dayOfWeek">
										<el-option :label="$t('content.import.zy')" :value="2"></el-option><!--周一-->
										<el-option :label="$t('content.import.ze')" :value="3"></el-option><!--周二-->
										<el-option :label="$t('content.import.zs')" :value="4"></el-option><!--周三-->
										<el-option :label="$t('content.import.zshi')" :value="5"></el-option><!--周四-->
										<el-option :label="$t('content.import.zw')" :value="6"></el-option><!--周五-->
										<el-option :label="$t('content.import.zl')" :value="7"></el-option><!--周六-->
										<el-option :label="$t('content.import.zr')" :value="1"></el-option><!--周日-->
									</el-select>
								</el-form-item>
							</el-col>
							<el-col class="line" :span="2">{{$t('content.import.de')}}</el-col><!--的-->
							<el-col :span="14">
								<el-form-item prop="scheduleTime">
									<el-time-picker value-format="timestamp"
													v-model="form2.scheduleTime"
													:placeholder="$t('content.import.rysjd')"><!--任意时间点-->
									</el-time-picker>
								</el-form-item>
							</el-col>
						</el-form-item>

						<!--每月调度时间-->
						<el-form-item class="form-item-time"
									  :label="$t('content.import.ddsj')"
									  v-if=" form2.interval === 'M' "> <!--调度时间-->
							<el-col :span="12">
								<el-form-item prop="dayOfMonth">
									<el-select v-model="form2.dayOfMonth" :placeholder="$t('content.common.qxza')">
										<el-option :label="$t(`content.import.yf${val}`)"
												   :value="val"
												   v-for="val in 31">
										</el-option>
										<el-option :label="$t(`content.import.yf32`)"
												   :value="32">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item prop="scheduleTime">
									<el-time-picker value-format="timestamp"
													v-model="form2.scheduleTime"
													:placeholder="$t('content.import.rysjd')"><!--任意时间点-->
									</el-time-picker>
								</el-form-item>
							</el-col>
						</el-form-item>
						<!--每年调度时间-->
						<el-form-item class="form-item-time" :label="$t('content.import.ddsj')"
									  v-if=" form2.interval === 'Y' "><!--调度时间-->
							<el-col :span="8">
								<el-form-item prop="monthOfYear">
									<el-select v-model="form2.monthOfYear"
											   :placeholder="$t('content.common.qxza')"
											   @change="monthChange">
										<el-option :label="$t(`content.import.month${val}`)"
												   :value="val"
												   v-for="val in 12"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item prop="dayOfMonth">
									<el-select v-model="form2.dayOfMonth" :placeholder="$t('content.common.qxza')">
										<el-option :label="$t(`content.import.yf${val}`)"
												   :value="val"
												   v-for="val in days">
										</el-option>
										<template v-if="days === 28">
											<el-option :label="$t(`content.import.yf32`)"
													   :value="32">
											</el-option>
										</template>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item prop="scheduleTime">
									<el-time-picker value-format="timestamp"
													v-model="form2.scheduleTime"
													:placeholder="$t('content.import.rysjd')"><!--任意时间点-->
									</el-time-picker>
								</el-form-item>
							</el-col>
						</el-form-item>
						<el-form-item class="form-item-time" :label="$t('content.dataset.importExport.kssj')"
									  prop="effectiveBeginTime"> <!--开始时间-->
							<el-date-picker
									v-model="form2.effectiveBeginTime"
									type="datetime"
									value-format="timestamp"
									:placeholder="$t('content.dataset.importExport.kssj')">  <!--开始时间-->
							</el-date-picker>
						</el-form-item>
						<el-row>
							<el-button @click="stepped(0)">{{$t('content.common.syb')}}</el-button>
							<el-button v-if="!isEditing || form.dataSourceType === 'HDFS'" @click="stepped(2)">
								{{$t('content.common.xyb')}}
							</el-button>
							<template v-else>
								<el-button @click="saveAndHandle">{{$t('content.import.bcbzx')}}</el-button>
								<el-button type="primary" @click="submitEditForm">{{$t('content.common.bc')}}
								</el-button>
							</template>
						</el-row>
					</el-form>
					<template v-if=" active === 2 ">
						<hdfs-source v-if="form.dataSourceType === 'HDFS'"
									 :form="form3"
									 @submit-data="submitHdfsForm"
									 @previous-step="stepped(1)"></hdfs-source>
						<black-list :dataSource="form"
									@submit-data="submitEditForm"
									@previous-step="stepped(1)"
									v-else></black-list>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import BlackList from './children/BlackList';
	import HdfsSource from './children/HdfsSource';
	import {createOrUpdateSource, validateSource, getTaskId} from '@/service/getData';

	export default {
		name: 'CreateTask',
		async beforeRouteLeave(to, from, next) {
			if (!this.isEdited) {
				this.$confirm(this.$t('content.importExport.a22'), this.$t('content.common.tis'), {
					confirmButtonText: this.$t('content.common.qd'),
					cancelButtonText: this.$t('content.common.qx'),
					customClass: 'answer-dialog'
				}).then(() => {
					next();
				}).catch(() => {
					next(false);
				});
			} else {
				next();
			}
		},
		components: {
			BlackList,
			HdfsSource
		},
		props: ['visible', 'type'],
		watch: {
			visible: function(newValue) {
				if (!this.visible) {
					this.resetData();
					this.resetForm();
				}
			}
		},
		computed: {
			hasKerberos() {
				const type = this.form.dataSourceType;
				return type === 'HIVE' || type === 'HBASE' || type === 'HDFS';
			},
			isEditing() {
				return !!this.$route.params.id;
			},
			days() {
				const month = this.form2.monthOfYear;
				if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
					return 31;
				} else if ([4, 6, 9, 11].includes(month)) {
					return 30;
				} else {
					return 28;
				}
			}
		},
		data() {
			return {
				id: 0,
				refId: 0,
				active: 0,
				loading: false,
				isEdited: false,
				form: {
					taskName: '',
					description: '',   //任务描述
					businessName: '',
					dataSourceDesc: '', //数据源描述
					dataSourceType: '',
					ipAddress: '',
					port: '',
					username: '',
					password: '',
					databaseName: '',
					instanceName: '',
					getSample: false,
					useKerberos: false,
					principal: '',
					keytab: '',
					krbPath: '',
					serverUrl: '',
					serverUsername: '',
					serverPassword: ''
				},
				rules: {
					taskName: [
						{required: true, message: this.$t('content.import.validator.qsrrwmc'), trigger: 'blur'},
						{min: 1, max: 50, message: this.$t('content.import.validator.cdbdcg', [50]), trigger: 'blur'}  /*长度在 1 到 50 个字符*/
					],
					description: [
						{min: 1, max: 50, message: this.$t('content.import.validator.cdbdcg', [50]), trigger: 'blur'}
					],
					businessName: [
						{required: true, message: this.$t('content.import.validator.qsrsjymc'), trigger: 'blur'},  /*请输入数据源名称*/
						{min: 1, max: 50, message: this.$t('content.import.validator.cdbdcg', [50]), trigger: 'blur'}
					],
					dataSourceDesc: [
						{min: 1, max: 50, message: this.$t('content.import.validator.cdbdcg', [50]), trigger: 'blur'}
					],
					dataSourceType: [
						{required: true, message: this.$t('content.import.validator.qxzsjylx'), trigger: 'change'} /*请选择数据源类型*/
					],
					ipAddress: [
						{required: true, message: this.$t('content.import.validator.qsripdz'), trigger: 'blur'}  /*请输入IP地址*/
					],
					port: [
						{required: true, message: this.$t('content.import.validator.qsrdkh'), trigger: 'blur'}, /*请输入端口号*/
						{type: 'integer', message: this.$t('content.import.validator.qsssz'), trigger: 'blur'}
					],
					username: [
						{required: true, message: this.$t('content.import.validator.qsryhm'), trigger: 'blur'}, /*请输入用户名*/
						{
							type: 'regexp',
							pattern: /^[A-Za-z0-9_\.]+$/,
							message: this.$t('content.import.validator.hzywszxhxhx')
						}   //请输入英文、数字、下划线
					],
					password: [
						{required: true, message: this.$t('content.import.validator.qsrmm'), trigger: 'blur'}, /*请输入密码*/
						{
							type: 'regexp',
							pattern: /^[A-Za-z0-9_\.]+$/,
							message: this.$t('content.import.validator.hzywszxhxhx')
						}
					],
					databaseName: [
						{required: true, message: this.$t('content.import.validator.qsrkm'), trigger: 'blur'},  /*请输入库名*/
						{
							type: 'regexp',
							pattern: /^[A-Za-z0-9_\.]+$/,
							message: this.$t('content.import.validator.hzywszxhxhx')
						}
					],
					instanceName: [
						{required: true, message: this.$t('content.import.validator.qsrslm'), trigger: 'blur'}, /*请输入实例名*/
						{
							type: 'regexp',
							pattern: /^[A-Za-z0-9_\.]+$/,
							message: this.$t('content.import.validator.hzywszxhxhx')
						}
					],
					getSample: [
						{required: true, message: this.$t('content.import.validator.qxzsjylx'), trigger: 'change'}  /*请选择样本数据*/
					],
					useKerberos: [
						{required: true, message: this.$t('content.import.validator.qxzsjylx'), trigger: 'change'}  /*请选择是否启用kerberos认证*/
					],
					principal: [
						{required: true, message: this.$t('content.import.validator.qsrp'), trigger: 'blur'},  //请输入principal
						{min: 1, max: 50, message: this.$t('content.import.validator.cdbdcg', [50]), trigger: 'blur'}
					],
					keytab: [
						{required: true, message: this.$t('content.import.validator.qsrkeytab'), trigger: 'blur'}, //请输入keytab
						{min: 1, max: 50, message: this.$t('content.import.validator.cdbdcg', [50]), trigger: 'blur'}
					],
					krbPath: [
						{min: 1, max: 50, message: this.$t('content.import.validator.cdbdcg', [50]), trigger: 'blur'}
					],
					serverUrl: [
						{required: true, message: this.$t('content.dataset.importExport.qtxybsjhqlj'), trigger: 'blur'}
					],
					serverUsername: [
						{required: true, message: this.$t('content.dataset.importExport.qtxhive'), trigger: 'blur'}
					],
					serverPassword: [
						{required: true, message: this.$t('content.dataset.importExport.qtxhivemm'), trigger: 'blur'}
					]
				},
				form2: {
					interval: 'O',
					D: '',
					scheduleTime: '',
					effectiveBeginTime: '',
					dayOfWeek: 1,
					dayOfMonth: 1,
					monthOfYear: 1
				},
				rules2: {
					interval: [
						{required: true, message: this.$t('content.import.validator.qxztspl'), trigger: 'blur'}   //请选择调试频率
					],
					D: [
						{
							required: true,
							type: 'date',
							message: this.$t('content.import.validator.qxzrq'),
							trigger: ['blur', 'change']
						}   //请选择日期
					],
					dayOfWeek: [
						{
							required: true,
							message: this.$t('content.import.validator.qxzmz'),
							trigger: ['blur', 'change']
						}   //请选择每周
					],
					dayOfMonth: [
						{
							required: true,
							message: this.$t('content.import.validator.qxzrq'),     //请选择日期
							trigger: ['blur', 'change']
						}
					],
					monthOfYear: [
						{
							required: true,
							message: this.$t('content.import.validator.qszyf'),  //请选择月份
							trigger: 'blur'
						}
					],
					scheduleTime: [
						{
							required: true,
							type: 'date',
							message: this.$t('content.import.validator.qszsj'),
							trigger: ['blur', 'change']
						}   //请选择日期
					],
					effectiveBeginTime: [
						{
							required: true,
							type: 'date',
							message: this.$t('content.import.validator.qxzrq'),
							trigger: 'blur'
						}   //请选择日期
					]
				},
				form3: {
					path: '',
					scanDepth: '',
					useWhiteList: false,
					filterPaths: '',
					fileTypeUseWhiteList: false,
					filterTypes: ''
				}
			};
		},
		created() {
			this.id = this.$route.params.id;
			if (this.id) {
				this.getEditedTask(this.id);
			}
		},
		methods: {
			handleChange(value) {
				if (value === 'D') {
					this.rules2.D = [
						{
							required: true,
							type: 'date',
							message: this.$t('content.import.validator.qxzrq'),
							trigger: ['blur', 'change']
						}
					];
				} else {
					delete this.rules2.D;
				}
				this.form2.dayOfWeek = 1;
				this.form2.dayOfMonth = 1;
				this.form2.monthOfYear = 1;
				this.$refs.form2.clearValidate();
			},
			monthChange() {
				this.form2.dayOfMonth = 1;
			},
			resetData() {
				this.form = {
					taskName: '',
					description: '',
					businessName: '',
					dataSourceDesc: '',
					dataSourceType: 'HIVE',
					ipAddress: '',
					port: '',
					username: '',
					password: '',
					databaseName: '',
					instanceName: '',
					getSample: false,
					useKerberos: false,
					principal: '',
					keytab: '',
					krbPath: '',
					serverUrl: '',
					serverUsername: '',
					serverPassword: ''
				};
				this.form2 = {
					interval: 'O',
					D: '',
					scheduleTime: '',
					effectiveBeginTime: '',
					dayOfWeek: 1,
					dayOfMonth: 1,
					monthOfYear: 1
				};
			},
			getEditedTask(id) {
				this.loading = true;
				getTaskId(id).then(res => {
					const {statusCode, message} = res.data;
					if (statusCode === 200) {

						const {
							taskName, description, businessName,
							dataSourceType, dataSource, getSample,
							serverUrl, serverUsername, serverPassword,
							refId, interval, dayOfWeek, dayOfMonth, monthOfYear,
							scheduleTime, effectiveBeginTime,
							path, scanDepth, useWhiteList,
							filterPaths, fileTypeUseWhiteList, filterTypes
						} = message;

						Object.keys(message).forEach(key => {
							if (message[key] === null) {
								message[key] = '';
							}
						});

						const {
							ipAddress, port, username,
							password, databaseName, instanceName,
							useKerberos, principal, keytab,
							krbPath, dataSourceDesc
						} = dataSource;

						this.form = {
							taskName,
							description,
							businessName,
							dataSourceDesc,
							dataSourceType,
							ipAddress,
							port,
							username,
							password,
							databaseName,
							instanceName,
							getSample,
							useKerberos,
							principal,
							keytab,
							krbPath,
							serverUrl,
							serverUsername,
							serverPassword
						};
						this.form2 = {
							interval,
							D: scheduleTime === '0' ? '' : Number(scheduleTime),
							scheduleTime: scheduleTime === '0' ? '' : Number(scheduleTime),
							effectiveBeginTime,
							dayOfWeek: dayOfWeek || '',
							dayOfMonth: dayOfMonth || '',
							monthOfYear: monthOfYear || ''
						};
						this.form3 = {
							path,
							scanDepth,
							useWhiteList,
							filterPaths,
							fileTypeUseWhiteList,
							filterTypes
						};
						this.refId = refId;
					}
					this.loading = false;
				});
			},
			submitAllForm(extraParams) {
				const {
					taskName, description, businessName,
					dataSourceDesc,
					dataSourceType, ipAddress, port,
					username, password, databaseName,
					instanceName, getSample, useKerberos,
					keytab, principal, krbPath
				} = this.form;
				const {interval, dayOfWeek, dayOfMonth, monthOfYear, effectiveBeginTime, scheduleTime, D} = this.form2;
				let params = Object.assign({}, this.getSourceParams(), extraParams, {
					effectiveBeginTime,
					interval,
					dayOfWeek,
					dayOfMonth,
					monthOfYear,
					scheduleTime: interval === 'D' ? D : scheduleTime    //选择调试频率为每天一次时,取 D 的值
				});

				this.loading = true;
				createOrUpdateSource(params).then(res => {
					const {statusCode, message} = res.body;
					if (statusCode === 200) {
						this.$message({
							message: this.$t(`content.dataset.importExport.${this.isEditing ? 'bjcg' : 'xjsjycg'}`),
							type: 'success'
						});
						this.loading = false;
						this.$router.push({name: 'TaskList'});
					}
				});
			},
			saveAndHandle() {
				this.$refs.form2.validate((valid) => {
					if (valid) {
						this.isEdited = true;
						this.submitAllForm({
							scheduleOnce: true
						});
					} else {
						return false;
					}
				});
			},
			submitHdfsForm(form) {
				this.isEdited = true;
				this.submitAllForm(form);
			},
			submitEditForm(params = {}) {
				console.log('params:', params);
				this.$refs.form2.validate((valid) => {
					if (valid) {
						this.isEdited = true;
						this.submitAllForm(params);
					} else {
						return false;
					}
				});
			},
			resetForm() {
				this.$refs.form.clearValidate();
				this.$refs.form2.clearValidate();
			},
			getSourceParams() {
				const {
					taskName, description, businessName,
					dataSourceDesc,
					dataSourceType, ipAddress, port,
					username, password, databaseName,
					instanceName, getSample, useKerberos,
					keytab, principal, krbPath,
					serverUrl, serverUsername, serverPassword
				} = this.form;

				const {id, refId} = this;
				return {
					id,
					refId,
					taskName,
					description,
					dataSource: {
						businessName,
						dataSourceDesc,
						dataSourceType,
						ipAddress,
						port,
						databaseName,
						instanceName,
						username,
						password,
						useKerberos,
						keytab,
						principal,
						krbPath,
						isDefault: 0
					},
					getSample,
					serverUrl,
					serverUsername,
					serverPassword
				};
			},
			stepped(step) {
				if (step < this.active) {   //回到上一步
					this.resetForm();
					this.active = step;
					return '';
				}
				if (step === 1) {
					this.$refs.form.validate((valid) => {
						if (valid) {
							this.loading = true;
							validateSource(this.getSourceParams()).then(res => {
								const {statusCode, message} = res.data;
								if (statusCode === 200) {
									this.active = step;
								}
								this.loading = false;
							}).catch(() => {
								this.loading = false;
							});
						} else {
							return false;
						}
					});
				} else if (step === 2) {
					this.$refs.form2.validate((valid) => {
						if (valid) {
							this.active = step;
						} else {
							return false;
						}
					});
				} else {
					this.active = step;
				}
			}
		}
	};
</script>
<style lang="less">
	#create-task {
		.step-box {
			margin: 20px auto 0;
			width: 70%;

			.el-step__icon {
				width: 12px;
				height: 12px;
				font-size: 12px;
			}

			.el-step__title {
				font-size: 14px;
				font-weight: normal;
				white-space: nowrap;
			}

			> .el-steps {
				padding-top: 10px;
				padding-bottom: 10px;
				border-radius: 0;
				border: 1px solid #CCC;
				border-bottom: none;
			}

			.form-wrapper {
				padding: 15px;
				border: 1px solid #CCC;

				> .el-form {
					width: 90%;
					margin: 0 auto;

					.form-item-time {
						.el-form-item__label:first-child {
							&:before {
								content: '*';
								color: #F56C6C;
								margin-right: 4px;
							}
						}
					}

					> .el-form-item {
						margin-bottom: 25px;

						.label-inline {
							span {
								width: 30px;
								margin-right: 10px;
							}

							> .el-form-item {
								display: inline-block;
								width: calc(~ '100% - 80px');
							}
						}
					}

					.tableMulti {
						margin-top: 40px;
					}

					.cycle-select {
						width: 100%;
					}

					> .el-row {
						> .task-btn {
							margin-right: 10px;
						}

						> .el-button:last-child {

						}
					}
				}

				.date-range-form {
					.el-input {
						width: 100%;
					}

					.line {
						text-align: center;
					}
				}
			}

			.el-row {
				text-align: right;
			}
		}
	}

</style>
