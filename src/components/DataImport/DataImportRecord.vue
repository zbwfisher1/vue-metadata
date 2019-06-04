<template>
<!-- <div class="dataImportRecord">
	<div class="tabCon">
		<div class="loading" v-if="tableConLoading"></div>

		<div class="boxCommon " :class="{hidden: activeTab != 'tableList'}" v-if="{active: activeTab == 'tableList'}" >
			<div class="con clearfix">
					<div class="tit">
						<a href="javascript:;" @click="addDataSet('recordForm')" >
							<span><img src="../assets/images/icon_newdataset.png"></span>
							{{$t("content.import.xjsjjdr")}}
						</a>
					</div>

					<table class="table table-bordered tableList">
						<thead>
							<tr>
								<th width="10%">
									{{$t("content.common.rwm")}}
									 <div class="order">
									 <span
										 class="asc"
									 	:class="{active:'taskName' == sort && 'asc'== order }"
									  @click="tableOrder('taskName','asc')"></span>
									  <span
									  	class="desc"
									   :class="{active:'taskName' == sort && 'desc'== order }"
									  @click="tableOrder('taskName','desc')"></span>
									  </div>
								</th>
								<th width="10%">
									{{$t("content.import.sjy")}}
									 <div class="order">
									 <span
										 class="asc"
									 	:class="{active:'businessName' == sort && 'asc'== order }"
									  @click="tableOrder('businessName','asc')"></span>
									  <span
									  	class="desc"
									   :class="{active:'businessName' == sort && 'desc'== order }"
									  @click="tableOrder('businessName','desc')"></span>
									  </div>
								</th>
								<th width="10%">
									{{$t("content.import.sjylx")}}
									 <div class="order">
									 <span
										 class="asc"
									 	:class="{active:'dataSourceType' == sort && 'asc'== order }"
									  @click="tableOrder('dataSourceType','asc')"></span>
									  <span
									  	class="desc"
									   :class="{active:'dataSourceType' == sort && 'desc'== order }"
									  @click="tableOrder('dataSourceType','desc')"></span>
									  </div>
								</th>
								<th width="15%">
									{{$t("content.import.drlx")}}
									 <div class="order">
									 <span
										 class="asc"
									 	:class="{active:'taskCategory' == sort && 'asc'== order }"
									  @click="tableOrder('taskCategory','asc')"></span>
									  <span
									  	class="desc"
									   :class="{active:'taskCategory' == sort && 'desc'== order }"
									  @click="tableOrder('taskCategory','desc')"></span>
									  </div>
								</th>
								<th width="10%">
									{{$t("content.import.csr")}}
								 <div class="order">
									 <span
										 class="asc"
									 	:class="{active:'creator' == sort && 'asc'== order }"
									  @click="tableOrder('creator','asc')"></span>
									  <span
									  	class="desc"
									   :class="{active:'creator' == sort && 'desc'== order }"
									  @click="tableOrder('creator','desc')"></span>
									  </div>
								</th>
								<th width="18%">
									{{$t("content.import.cssj")}}
									 <div class="order">
									 <span
										 class="asc"
									 	:class="{active:'createDate' == sort && 'asc'== order }"
									  @click="tableOrder('createDate','asc')"></span>
									  <span
									  	class="desc"
									   :class="{active:'createDate' == sort && 'desc'== order }"
									  @click="tableOrder('createDate','desc')"></span>
									  </div>
								</th>
								<th width="10%">
									{{$t("content.import.rwzt")}}
									 <div class="order">
									 <span
										 class="asc"
									 	:class="{active:'status' == sort && 'asc'== order }"
									  @click="tableOrder('status','asc')"></span>
									  <span
									  	class="desc"
									   :class="{active:'status' == sort && 'desc'== order }"
									  @click="tableOrder('status','desc')"></span>
									  </div>
								</th>
								<th width="17%">
									{{$t("content.import.rwzxsj")}}
									 <div class="order">
									 <span
										 class="asc"
									 	:class="{active:'modifyDate' == sort && 'asc'== order }"
									  @click="tableOrder('modifyDate','asc')"></span>
									  <span
									  	class="desc"
									   :class="{active:'modifyDate' == sort && 'desc'== order }"
									  @click="tableOrder('modifyDate','desc')"></span>
									  </div>
								</th>
								<!-- <th width="150">操作</th> -->
							<!-- </tr>
						</thead>
						<tbody>
							<tr v-for="item in resolveTableDetail">
								<td><div :title="item.taskName" class="control-width-name commom-overflow">{{item.taskName}}</div></td>
								<td><div :title="item.businessName" class="control-width-businessname commom-overflow">{{item.businessName}}</div></td>
								<td>{{item.dataSourceType}}</td>
								<td>{{item.taskCategory}}</td>
								<td>{{item.creator}}</td>
								<td>{{item.createDate}}</td>
								<td>{{item.status}}</td>
								<td>{{item.modifyDate}}</td>
							</tr>
						</tbody>
					</table>

					<div class="page-style">
	          <el-pagination background
	            layout="total, prev, pager, next"
	            :total="totalPage"
	            :page-size="10"
	            :current-page="currentPage"
	            @current-change="changePage">
	          </el-pagination>
	        </div>

					<el-dialog :title="dialogTitle"
							   :close-on-click-modal= "false"
							   v-model="dialogVisible"
							   custom-class="dialogComment">

						<el-form :model="recordForm" :rules="recordRules" ref="recordForm" class="form-horizontal clearfix addNewMeta">
							<div v-if="!isProcess">
								<div v-if="isFirstStep">
									<el-form-item>
										<el-col :span="6">
											<div class="grid-content bg-purple">
												<div class="meta-import-record-label"><i>*</i>{{$t("content.import.drnr")}}:</div>
											</div>
										</el-col>
										<el-col :span="1">&nbsp;</el-col>
										<el-col :span="17">
											<div class="grid-content bg-purple-light">
												<el-form-item prop="task_type">
													<el-select v-model="recordForm.task_type" @change="selectType">
														<el-option
														v-for="item in datasetBigData"
														:label="item.label"
														:value="item.value"
														>
														</el-option>
													</el-select>
												</el-form-item>
											</div>
										</el-col>
									</el-form-item>
									<el-form-item>
										<el-col :span="6">
											<div class="grid-content bg-purple">
												<div class="meta-import-record-label"><i>*</i>{{$t("content.import.sjymc")}}:</div>
											</div>
										</el-col>
										<el-col :span="1">&nbsp;</el-col>
										<el-col :span="17">
											<div class="grid-content bg-purple">
												<el-form-item prop="hdfsName" v-if="isHDFS">
													<el-input v-model="recordForm.hdfsName" :placeholder="$t('content.import.placeholder.srydrdsj')"></el-input>
												</el-form-item>
												<el-form-item prop="s_businessName" v-else>
													<el-input v-model="recordForm.s_businessName" :placeholder="$t('content.import.placeholder.srydrdsj')"></el-input>
												</el-form-item>
											</div>
										</el-col>
									</el-form-item>
									<div v-if="isHDFS">
										<el-form-item>
											<el-col :span="6">
												<div class="grid-content bg-purple">
													<div class="meta-import-record-label"><i>*</i>{{$t("content.import.zjm")}}:</div>
												</div>
											</el-col>
											<el-col :span="1">&nbsp;</el-col>
											<el-col :span="17">
												<div class="grid-content bg-purple">
													<el-form-item prop="host">
														<el-input v-model="recordForm.host" :placeholder="$t('content.import.placeholder.srxutxlj')"></el-input>
													</el-form-item>
												</div>
											</el-col>
										</el-form-item>
									</div>
									<div v-else>
										<el-form-item>
											<el-col :span="6">
												<div class="grid-content bg-purple">
													<div class="meta-import-record-label"><i>*</i>{{$t("content.import.ipdz")}}:</div>
												</div>
											</el-col>
											<el-col :span="1">&nbsp;</el-col>
											<el-col :span="17">
												<div class="grid-content bg-purple">
													<el-form-item prop="s_ip">
														<el-input v-model="recordForm.s_ip" :placeholder="$t('content.import.placeholder.qsr')"></el-input>
													</el-form-item>
												</div>
											</el-col>
										</el-form-item>
										<el-form-item>
											<el-col :span="6">
												<div class="grid-content bg-purple">
													<div class="meta-import-record-label"><i>*</i>{{$t("content.import.dkh")}}:</div>
												</div>
											</el-col>
											<el-col :span="1">&nbsp;</el-col>
											<el-col :span="17">
												<div class="grid-content bg-purple">
													<el-form-item prop="s_port">
														<el-input v-model="recordForm.s_port" :placeholder="$t('content.import.placeholder.qsr')"></el-input>
													</el-form-item>
												</div>
											</el-col>
										</el-form-item>
										<el-form-item v-if="this.recordForm.task_type === 'ORACLE'" style="margin-bottom: 5px;">
											<el-col :span="6">
												<div class="grid-content bg-purple">
													<div class="meta-import-record-label"><i>*</i>{{$t("content.import.fwmhsid")}} :</div>
												</div>
											</el-col>
											<el-col :span="1">&nbsp;</el-col>
											<el-col :span="17">
												<div class="grid-content bg-purple">
													<el-form-item prop="s_database">
														<el-input v-model="recordForm.s_database" :placeholder="$t('content.import.placeholder.qsr')"></el-input>
													</el-form-item>
												</div>
											</el-col>
										</el-form-item>
										<el-form-item v-if="this.recordForm.task_type === 'ORACLE'" style="margin-bottom: 5px;">
											<el-col :span="7">&nbsp;</el-col>
											<el-col :span="17">
												<div class="grid-content bg-purple">
													<el-radio v-model="serverName" label="server">{{$t("content.import.fwm")}}</el-radio>
													<el-radio v-model="serverName" label="sid">SID</el-radio>
												</div>
											</el-col>
										</el-form-item>
										<el-form-item v-if="isHive">
											<el-col :span="6">
												<div class="grid-content bg-purple">
													<div class="meta-import-record-label"><i>*</i>数据库:</div>
												</div>
											</el-col>
											<el-col :span="1">&nbsp;</el-col>
											<el-col :span="17">
												<div class="grid-content bg-purple">
													<el-form-item prop="s_database">
														<el-input v-model="recordForm.s_database" :placeholder="$t('content.import.placeholder.qsr')"></el-input>
													</el-form-item>
												</div>
											</el-col>
										</el-form-item>

										<el-form-item>
											<el-col :span="6">
												<div class="grid-content bg-purple">
													<div class="meta-import-record-label"><i>*</i>{{$t("content.import.yhm")}}:</div>
												</div>
											</el-col>
											<el-col :span="1">&nbsp;</el-col>
											<el-col :span="17">
												<div class="grid-content bg-purple">
													<el-form-item prop="s_username">
														<el-input v-model="recordForm.s_username" :placeholder="$t('content.import.placeholder.qsr')"></el-input>
													</el-form-item>
												</div>
											</el-col>
										</el-form-item>
										<el-form-item>
											<el-col :span="6">
												<div class="grid-content bg-purple">
													<div class="meta-import-record-label"><i>*</i>{{$t("content.import.mm")}}:</div>
												</div>
											</el-col>
											<el-col :span="1">&nbsp;</el-col>
											<el-col :span="17">
												<div class="grid-content bg-purple">
													<el-form-item prop="s_password">
														<input type="password" class="form-control" v-model="recordForm.s_password" />
													</el-form-item>
												</div>
											</el-col>
										</el-form-item>
									</div>
								</div>

								<div v-if="!isFirstStep">
									<el-form-item>
										<el-col :span="7">
											<div class="grid-content bg-purple">
												<div class="meta-import-record-label"><i>*</i>{{$t("content.import.rwmc")}}:</div>
											</div>
										</el-col>
										<el-col :span="1">&nbsp;</el-col>
										<el-col :span="16">
											<el-form-item prop="task_taskName">
											<el-input v-model="recordForm.task_taskName" :placeholder="$t('content.import.placeholder.qsrbcdr')"></el-input>
											</el-form-item>
										</el-col>
									</el-form-item>
									<div v-if="isHDFS">
										<el-form-item>
											<el-col :span="7">
												<div class="grid-content bg-purple">
													<div class="meta-import-record-label"><i>*</i>{{$t("content.import.smglj")}}:</div>
												</div>
											</el-col>
											<el-col :span="1">&nbsp;</el-col>
											<el-col :span="16">
												<el-form-item prop="scanRootPath">
													<el-input v-model="recordForm.scanRootPath"></el-input>
												</el-form-item>
											</el-col>
										</el-form-item>
										<el-form-item>
											<el-col :span="7">
												<div class="grid-content bg-purple">
													<div class="meta-import-record-label"><i>*</i>{{$t("content.import.smsd")}}:</div>
												</div>
											</el-col>
											<el-col :span="1">&nbsp;</el-col>
											<el-col :span="16">
												<div class="grid-content bg-purple-light">
													<el-form-item prop="scanDepth">
														<el-select v-model="recordForm.scanDepth">
															<el-option
																v-for="item in hdfsDeep"
																:label="item.label"
				      									:value="item.value"
															>
															</el-option>
														</el-select>
													</el-form-item>
												</div>
											</el-col>
										</el-form-item>
										<el-form-item v-if="useConfigration">
											<el-col :span="7">
												<div class="grid-content bg-purple">
													<div class="meta-import-record-label">配置路径:</div>
												</div>
											</el-col>
											<el-col :span="1">&nbsp;</el-col>
											<el-col :span="16">
												<div class="grid-content bg-purple-light">
													<el-input v-model="configrationPath"></el-input>
												</div>
											</el-col>
										</el-form-item>
									</div>
								</div>
							</div>
							<div v-if="isProcess">
								<div v-if="isFirstStep">
									<el-row>
										<el-col :span="6">
											<div class="grid-content bg-purple">
												<div class="meta-import-record-label"><i>*</i>{{$t("content.import.drnr")}}:</div>
											</div>
										</el-col>
										<el-col :span="1">&nbsp;</el-col>
										<el-col :span="17">
											<div class="grid-content bg-purple-light">
												<el-form-item prop="task_type">
													<el-select v-model="recordForm.task_type">
														<el-option
														v-for="item in processType"
														:label="item.label"
														:value="item.value"
														>
														</el-option>
													</el-select>
												</el-form-item>
											</div>
										</el-col>
									</el-row>

									<el-row>
										<el-col :span="6">
											<div class="grid-content bg-purple">
												<div class="meta-import-record-label"><i>*</i>{{$t("content.import.sjymc")}}:</div>
											</div>
										</el-col>
										<el-col :span="1">&nbsp;</el-col>
										<el-col :span="17">
											<div class="grid-content bg-purple">
												<el-form-item prop="hdfsName" v-if="isHDFS">
													<el-input v-model="recordForm.hdfsName" :placeholder="$t('content.import.placeholder.qsr')"></el-input>
												</el-form-item>
												<el-form-item prop="s_businessName" v-else>
													<el-input v-model="recordForm.s_businessName" :placeholder="$t('content.import.placeholder.qsr')"></el-input>
												</el-form-item>
											</div>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="6">
											<div class="grid-content bg-purple">
												<div class="meta-import-record-label"><i>*</i>{{$t("content.import.ipdz")}}:</div>
											</div>
										</el-col>
										<el-col :span="1">&nbsp;</el-col>
										<el-col :span="17">
											<div class="grid-content bg-purple">
												<el-form-item prop="s_ip">
													<el-input v-model="recordForm.s_ip" :placeholder="$t('content.import.placeholder.qsr')"></el-input>
												</el-form-item>
											</div>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="6">
											<div class="grid-content bg-purple">
												<div class="meta-import-record-label"><i>*</i>{{$t("content.import.dkh")}}:</div>
											</div>
										</el-col>
										<el-col :span="1">&nbsp;</el-col>
										<el-col :span="17">
											<div class="grid-content bg-purple">
												<el-form-item prop="s_port">
													<el-input v-model="recordForm.s_port" :placeholder="$t('content.import.placeholder.qsr')"></el-input>
												</el-form-item>
											</div>
										</el-col>
									</el-row>
									<el-form-item>
										<el-col :span="6">
											<div class="grid-content bg-purple">
												<div class="meta-import-record-label"><i>*</i>{{$t("content.import.sjk")}}:</div>
											</div>
										</el-col>
										<el-col :span="1">&nbsp;</el-col>
										<el-col :span="17">
											<div class="grid-content bg-purple">
												<el-form-item prop="s_database">
													<el-input v-model="recordForm.s_database" :placeholder="$t('content.import.placeholder.qsr')"></el-input>
												</el-form-item>
											</div>
										</el-col>
									</el-form-item>
									<el-row>
										<el-col :span="6">
											<div class="grid-content bg-purple">
												<div class="meta-import-record-label"><i>*</i>{{$t("content.import.yhm")}}:</div>
											</div>
										</el-col>
										<el-col :span="1">&nbsp;</el-col>
										<el-col :span="17">
											<div class="grid-content bg-purple">
												<el-form-item prop="s_username">
													<el-input v-model="recordForm.s_username" :placeholder="$t('content.import.placeholder.qsr')"></el-input>
												</el-form-item>
											</div>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="6">
											<div class="grid-content bg-purple">
												<div class="meta-import-record-label"><i>*</i>{{$t("content.import.mm")}}:</div>
											</div>
										</el-col>
										<el-col :span="1">&nbsp;</el-col>
										<el-col :span="17">
											<div class="grid-content bg-purple">
												<el-form-item prop="s_password">
													<input type="password" style="display: none;">
													<input type="password" class="form-control" v-model="recordForm.s_password" />
												</el-form-item>
											</div>
										</el-col>
									</el-row>
								</div>
								<div v-if="!isFirstStep">
									<el-col :span="6">
										<div class="grid-content bg-purple">
											<div class="meta-import-record-label"><i>*</i>{{$t("content.import.rwmc")}}:</div>
										</div>
									</el-col>
									<el-col :span="1">&nbsp;</el-col>
									<el-col :span="17">
										<el-form-item prop="task_taskName">
											<el-input v-model="recordForm.task_taskName" :placeholder="$t('content.import.placeholder.qsrbcdr')"></el-input>
										</el-form-item>
									</el-col>
							</div>

						</el-form>

						<span slot="footer" class="dialog-footer clearfix" v-if="isFirstStep">
							<div class="meta-import-record-testbutton">
								<el-button v-if="!isHDFS" @click.native="testLink('recordForm')">{{$t("content.import.cslj")}}</el-button>
							</div>
							<el-button type="primary" @click.native="datasetNext('recordForm')">{{$t("content.common.xyb")}}</el-button>
							&nbsp;
							<el-button @click.native="dialogVisible = false">{{$t("content.common.qx")}}</el-button>
						</span>
						<span slot="footer" class="dialog-footer clearfix" v-if="!isFirstStep">
							<el-button @click.native="datasetPrev()">{{$t("content.common.syb")}}</el-button>
							<el-button type="primary" @click.native="dialogSubmit('recordForm')">{{$t("content.common.bc")}}</el-button>
						</span>
					</el-dialog>

					<el-dialog custom-class="dialogComment" v-model="delDialogVisible">
						<h3 class="warn-info">您确定要删除这条数据源吗？</h3>
						<h4 class="warn-text">删除后将无法再找回!</h4>
						<span slot="footer" class="dialog-footer">
							<el-button type="primary" @click.native="delSubmit()">确 认</el-button>
							<el-button @click.native="cancelDialog">取 消</el-button>
						</span>
					</el-dialog>
					<el-dialog :title="warnTitle" custom-class="dialogComment" v-model="warnDialogVisible">
						<h3 class="warn-info">请输入{{warnInfo}}</h3>
						<span slot="footer" class="dialog-footer">
							<el-button type="primary" @click.native="confirmWarn()">确 认</el-button>
						</span> -->
					<!-- </el-dialog> -->
				<!-- </div> -->
					<div class="con">
					<!-- <div class="noData">
						<!--<i></i>-->
						<!-- <p><i></i>暂数据源信息</p> -->
					</div>
				<!-- </div> -->
		<!-- 提示框 -->
					<!-- <message v-if="warnVisible"
					@visible="warnVisible = false">
					<p class="msg" slot="content">{{messageContent}}</p>
					</message>
			</div>
		</div>
	</div>
</div>
</div> -->

</template>

<script>
import Highcharts from '../Highcharts';
import 'sweetalert/dist/sweetalert.css';
import swal from 'sweetalert';
import Message from 'components/Message';
import { FormatTime } from 'mixins/common';
import * as formValidators from 'utils/validator';

export default {
	components: {
		Highcharts,
		Message
	},
	mixins: [FormatTime],
	data() {
		return {
			tableConLoading: false,
			tabList: {
				'tableList': '元数据变更统计表'
			},

			messageContent: 'test',
			warnVisible: false,

			tableId: '',
			activeTab: 'tableList',
			tableDetail: {},
			tableSourceDetail: {},

			chartType: 'column',
			chartSeries: [],
			chartDate: [],

			tableTitle: '变更记录',
			tableSummary: true,

			detailSource: '',
			detailSourceName: '',
			detailType: '',

			dialogTitle: '',
			dialogVisible: false,
			delDialogVisible: false,
			warnDialogVisible: false,
			warnInfo: '',

			serverName: 'server',

			recordForm: {
				// classDatasetType: '数据库',
				task_type: '',
				task_datasetType: '',
				host: '',
				s_database: '',

				s_businessName: '',
				hdfsName: '',
				s_port: '',
				s_ip: '',
				s_driverName: '',
				s_username: '',
				s_password: '',

				task_taskName: '',

				scanRootPath: '/',
				scanDepth: '10',
			},

			recordRules: {
				task_type: [
					{ required: true, message: this.$t('content.import.validator.qxzdrsjlx'), trigger: 'change' }
				],
				task_datasetType: [
					{ required: true, message: this.$t('content.import.validator.qxzsjylx'), trigger: 'change' },
				],
				s_businessName: [
					{ required: true, message: this.$t('content.import.validator.qsrsjymc'), trigger: 'blur' },
					{ validator: formValidators.taskNameValidate, trigger: 'blur' },
					{ max: 15, message: this.$t('content.import.validator.cdbdcg15gzf'), trigger: 'blur'}
				],
				hdfsName: [
					{ required: true, message: this.$t('content.import.validator.qsrsjymc'), trigger: 'blur' },
					{ validator: formValidators.taskNameValidate, trigger: 'blur' },
					{ max: 15, message: this.$t('content.import.validator.cdbdcg15gzf'), trigger: 'blur'}
				],
				host: [
					{ required: true, message: this.$t('content.import.validator.qsrzjm'), trigger: 'blur' },
					{ validator: formValidators.hostNameValidate, trigger: 'blur' },
				],
				s_ip: [
					{ required: true, message: this.$t('content.import.validator.qsripdz'), trigger: 'blur' },
					{ validator: formValidators.ipValidate, trigger: 'blur'}
				],
				s_port: [
					{ required: true, message: this.$t('content.import.validator.qsrdkh'), trigger: 'blur' },
					{ validator: formValidators.numberValidate,trigger: 'blur'}
				],
				s_database: [
					{ required: true, message: this.$t('content.import.validator.qsrsjk'), trigger: 'blur' },
					{ validator: formValidators.databaseValidate,trigger: 'blur'},
					{ max: 50, message: this.$t('content.import.validator.cdbdcg', [50]), trigger: 'blur'}
				],
				scanRootPath: [
					{ required: true, message: this.$t('content.import.validator.qsrsmglj'), trigger: 'blur' },
				],
				// s_driverName: [
				// 	{ required: true, message: '请输入驱动名', trigger: 'blur' },
				// 	{ validator: driveNameValidate , message: '请输入英文、数字、下划线、小数点', trigger: 'blur' },
				// ],
				s_username: [
					{ required: true, message: this.$t('content.import.validator.qsryhm'), trigger: 'blur' },
				],
				s_password: [
					{ required: true, message: this.$t('content.import.validator.qsrmm'), trigger: 'blur' },
				],
				task_taskName: [
					{ required: true, message: this.$t('content.import.validator.qsrrwmc'), trigger: 'blur' },
					{ max: 50, message: this.$t('content.import.validator.cdbdcg', [50]), trigger: 'blur' },
					{ validator: formValidators.taskNameValidate , trigger: 'blur' },
				],
			},

			s_id: '',



			s_type: '',
			task_cron: '0 0 0/1 * * ?',

			task_lookback_period: '',
			task_hadoop_jobhistory_url: '',
			task_exclude_db: '',


			useConfigration: false,
			version: 'version',
			configrationPath: '',
			task_refId: -1,

			selectId: '',
			warnTitle: '提示',
			refId: 0,

			disabledType: true,

			dataSetType2: [
				{value: 'ORACLE', label: 'Oracle'},
				{value: 'SQLSERVER', label: 'Sqlserver'},
				{value: 'POSTGRESQL', label: 'Postgresql'},
				{value: 'MYSQL', label: 'Mysql'},
			],
			s_type: '',

			selectDataContent: '',

			dataContentSelect: [],

			isHDFS: false,
			isDB: true,
			isHive: false,

			isUseHDFS: false,

			totalPage: 1,
			currentPage:1,

			datasetVisible: false,
			isFirstStep: true,
			isProcess: false,

			datasetDatabase: [
				{value: 'ORACLE', label: 'oracle'},
				{value: 'SQLSERVER', label: 'sqlserver'},
				{value: 'POSTGRESQL', label: 'postgresql'},
				{value: 'MYSQL', label: 'mysql'},
			],
			datasetBigData: [
				{value: 'ORACLE', label: 'oracle'},
				{value: 'SQLSERVER', label: 'sqlserver'},
				{value: 'POSTGRESQL', label: 'postgresql'},
				{value: 'MYSQL', label: 'mysql'},
				{value: 'HDFS', label: 'hdfs'},
				{value: 'HIVE', label: 'hive'},
			],

			datasetName: '',
			datasetURL: '',
			datasetDriverName: '',
			datasetUsername: '',
			datasetPassword: '',
			databaseType: '',
			bigDataType: '',

			datasetTaskName: '',
			task_load_sample: '',

			datasetContentName: '',

			hdfsTaskName: '',
			hdfsRootURL: '/',
			hdfsDeep: [
				{ label: 1, value: 1},
				{ label: 2, value: 2},
				{ label: 3, value: 3},
				{ label: 4, value: 4},
				{ label: 5, value: 5},
				{ label: 6, value: 6},
				{ label: 7, value: 7},
				{ label: 8, value: 8},
				{ label: 9, value: 9},
				{ label: 10, value: 10},
			],
			hdfsRootDeep: '1',

			datasetType3: [
				{value: '0', label: '数据库'},
				{value: '1', label: '大数据'},
			],
			hiveDatasetType: '0',
			hiveDatasetClass: '',

			processType: [
				{value: 'PROCESS', label: 'process'},
				{value: 'AZKABAN', label: 'azkaban'},
			],
			classProcessType: '',
			isImportLineage: false,
			lineage_datasetType: '',

			lineage_hive: '',
			lineage_hdfs: '',
			hdfsList: [],
			hiveList: [],
			// 排序
			sort:"createDate",
			order:"desc",

			resultIP: '',
		}
	},
	props: {
	    name: String
	},
	created() {
		this.fetchData();
	},
	watch: {
		'$route': 'fetchData',
		'recordForm.task_type': function(val){
			this.autoDriveName(val);
		},
		'recordForm.task_datasetType': function(val){
			this.autoDriveName(val);
		}
	},
	computed: {
		resolveTableDetail(){
			if(!Array.isArray(this.tableDetail)){
				return;
			}
			this.tableDetail.map((v, k)=>{
				switch (v.taskCategory) {
					case 'HDFS':
						v.dataSourceType = 'HDFS';
						v.taskCategory = '数据集';
						break;
					case 'DATASET':
						v.taskCategory = '数据集';
						break;
					case 'APPLICATION':
					  v.taskCategory = '数据过程';
						break;
					case 'LINEAGE':
						v.taskCategory = '血缘关系';
						break;
				}
				switch (v.status) {
					case 'SUCCEEDED':
						v.status = '导入成功';
						break;
					case 'ERROR':
						v.status = '导入失败';
						break;
					case '':
						v.status = '未导入';
						break;
					case null:
						v.status = '等待导入';
						break;
					default:
						v.status = '正在导入';
				}
				if(v.taskCategory == '数据过程'){
					v.taskCategory = '数据处理流程';
				}
				v.createDate = this.formatTime(v.createDate);
				v.modifyDate = !!v.modifyDate ? this.formatTime(v.modifyDate) : '';
				v.taskCategory = v.taskCategory === '数据处理流程' ? '数据处理过程' : v.taskCategory;
			})
			return this.tableDetail;
		},
		computeTableDetail(){
			if(!Array.isArray(this.tableDetail)){
				return;
			}
			this.tableDetail.forEach(function(v){
				//重新计算执行时间
				switch (v.cron) {
					case '0 0 * * * ?':
						v.cron = this.$t('content.dataset.importExport.mxs')
						break;
					case '0 0 1 * * ?':
						v.cron = this.$t('content.dataset.importExport.meit')
						break;
					case '0 10 0 ? * MON':
						v.cron = this.$t('content.dataset.importExport.meiz')
						break;
					case '0 10 0 1 * ?':
						v.cron = this.$t('content.dataset.importExport.meiy')
						break;
				}
				// computeExecuteType
				if(v.executeType){
					let exeValue = v.executeType.toLowerCase();
					v.computeExecuteType = exeValue.replace(/\b(\w)|\s(\w)/g, function(m){
	        	return m.toUpperCase();
	    		});
				}

			})
			return this.tableDetail;
		}
	},
	methods: {
		autoDriveName(val){
			if(val === 'MYSQL'){
				this.recordForm.s_driverName = 'com.mysql.jdbc.Driver';
			}else if(val === 'ORACLE'){
				this.recordForm.s_driverName = 'oracle.jdbc.driver.OracleDriver';
			}else if(val === 'POSTGRESQL'){
				this.recordForm.s_driverName = 'org.postgresql.Driver';
			}else if(val === 'SQLSERVER'){
				this.recordForm.s_driverName = 'com.microsoft.sqlserver.jdbc.SQLServerDriver';
			}else if(val === 'HIVE'){
				this.recordForm.s_driverName = 'com.mysql.jdbc.Driver';
			}
		},
		testLink(formName){
			let driverName = this.isProcess ? 'com.mysql.jdbc.Driver':  this.recordForm.s_driverName;
			let ip = this.recordForm.s_ip;
			let port = this.recordForm.s_port;
			let url = '';
			let username = this.recordForm.s_username;
			let password = this.recordForm.s_password;
			let taskType = this.recordForm.task_type;
			this.generateResultIP(ip, port);
			let testUrl = `/datasource/connect?driverName=${driverName}&url=${this.resultIP}&username=${username}&password=${password}`;
			this.$refs[formName].validate((valid) => {
				if (!valid) {
					return false;
        }else{
					this.axios.post(testUrl)
					.then(function(res) {
						const warnMessage = res.body.message;
						if(warnMessage === 'success'){
							this.$message({
								message: '连接成功',
								type: 'success',
								duration: 2000
							});
						}else{
							this.$message({
								message: warnMessage,
								type: 'warning',
								duration: 2000
							});
						}
						return;
					})
				}
			})
		},
		datasetNext(formName){
			this.$refs[formName].validate((valid) => {
				if (!valid) {
					return false;
        }else{
					this.isFirstStep = false;
				}
			})
		},
		datasetPrev(){
			this.isFirstStep = true;
		},
		selectType(){
			let selectType = this.recordForm.task_type;
			if(selectType === 'HIVE'){
				this.isHive = true;
			}else{
				this.isHive = false;
			}
			if(selectType === 'HDFS'){
				this.isHDFS = true;
				this.isDB = false;
			}else{
				this.isHDFS = false;
				this.isDB = true;
			}
		},

		switchdatasetType2(){
			if(this.recordForm.task_datasetType == 'DB'){
				this.disabledType = false;
				this.isDB = true;
				this.isHDFS = false;
			}else{
				this.disabledType = true;
				this.s_type = '';
				this.isHDFS = true;
				this.isDB = false;
			}
		},

		changeDataContent(){
			this.recordForm.task_type = '';
			if(this.selectDataContent === 'APPLICATION'){
				this.dataContentSelect = [
					{value: 'PROCESS', label: 'process'},
					{value: 'AZKABAN', label: 'azkaban'},
				]
			}else{
				this.dataContentSelect = [
					{value: 'ORACLE', label: 'oracle'},
					{value: 'MYSQL', label: 'mysql'},
					{value: 'HIVE', label: 'hive'},
				]
			}
		},

		confirmWarn(){
			this.warnDialogVisible = false;
		},
		nameChange(name){
			if(this.nameObj[name]){
				return this.nameObj[name]
			}else{
				return name
			}
		},
		tabChange: function(type) {
			this.activeTab = type;
			this.fetchData();
		},
		schemaView(type){
			if(type == 'table'){
				this.tableVisiable = true;
				this.jsonVisiable = false;

				this.jsonviewVisiable = false

			}else{
				this.tableVisiable = false;
				this.jsonVisiable = true;
				this.jsonviewVisiable = true
			}
		},
		fetchData(page) {
			const _page = page || 1;
			const listUrl = `/api/v1/systemImport/list?sort=${this.sort}&order=${this.order}&rows=10&page=${_page}`;
			this.axios.get(listUrl)
			.then(function(ret) {
				this.totalPage = ret.body.message.totalRows;
				this.currentPage = ret.body.message.currentPage
				this.tableDetail = ret.body.message.records;
				this.tableConLoading = false
			})
		},

		delInfo(id){
			this.delDialogVisible = true;
			this.selectId = id;
			this.delSubmit();
		},
		delSubmit(){
			var self = this;
			self.axios.post(`/api/v1/systemImport/${this.selectId}/delete`)
			.then(function(ret) {
				self.delDialogVisible = false;
				if(ret.body.return_code == 407){
					self.$router.push({ name: 'Login'})
					return
				}
				if ( ret.body.code != 200 ){
					swal({
						title: '提示',
						text: ret.body.message,
						type: 'info',
						customClass: "twitter"
					});
					return
				}
				swal({
					title: '提示',
					text: '删除成功',
					type: 'success',
					customClass: "twitter",
					timer:2000
				});
				self.fetchData()
			})
		},
		cancelDialog(){
			this.delDialogVisible = false;
		},
		editInfo(value){
			this.dialogTitle = '修改数据源';
			this.isFirstStep = true;
			this.dialogVisible = true;

			// this.selectDataContent = 'DATASET';

			this.s_id = value.id;
			this.refId = value.refId;

			this.recordForm.task_datasetType = value.importType;
			this.s_type = value.dataSourceType;
			this.recordForm.hdfsName = value.hdfsName;
			this.recordForm.s_businessName = value.businessName;

			// if(this.task_datasetType == 'DB'){
			// 	this.isHDFS = false;
			// 	this.disabledType = false;
			// 	this.s_businessName = value.businessName;
			// }else{
			// 	this.isHDFS = true;
			// 	this.disabledType = true;
			// 	this.hdfsName = value.businessName;
			// }
			this.recordForm.task_taskName = value.taskName;
			// this.version = value.
			this.recordForm.s_ip = value.ip;
			this.recordForm.s_port = value.port;
			this.recordForm.s_driverName = value.driverName;
			this.recordForm.s_username = value.username;
			this.recordForm.s_password = value.password;
			this.selectDataContent = value.taskCategory;
			this.recordForm.task_type = value.taskType;
		},
		addProcess(formName){
			this.clearForm(formName);
			this.isProcess = true;
			this.dialogTitle = '新建数据处理过程导入';
			this.dialogVisible = true;


			this.selectDataContent = 'APPLICATION';
			this.isImportLineage = '';
			this.lineage_hdfs = '';
			this.lineage_hive = '';

			this.fetchLineageData();
		},
		fetchLineageData(){
			let listUrl = '/api/v1/systemImport/lineagedb';
			this.axios.get(listUrl)
			.then(function(res) {
				let resList = res.body.message;
				let hiveList = [];
				let hdfsList = [];
				resList.forEach((v)=>{
					if(v.flag === 'hive'){
						let singleHive = {value: v.hive_id, label: v.hive_name};
						hiveList.push(singleHive);
					}else if(v.flag === 'hdfs'){
						let singleHdfs = {value: v.hdfs_id, label: v.hdfs_name};
						hdfsList.push(singleHdfs);
					}
				})
				this.hdfsList = hdfsList;
				this.hiveList = hiveList;
			})
		},
		addDataSet(formName){
			this.clearForm(formName);
			this.isProcess = false;
			this.dialogTitle = '新建数据集导入';
			this.dialogVisible = true;
			this.selectDataContent = 'DATASET';
		},
		clearForm(formName){
			if(this.$refs[formName]){
				this.$refs[formName].resetFields();
			}
			this.isFirstStep = true;
			this.isHDFS = false;
			this.recordForm.classDatasetType = '数据库';
			this.recordForm.s_businessName = '';
			this.recordForm.hdfsName = '';
			this.version = 'default';
			this.recordForm.host = '';
			this.configrationPath = '';
			this.recordForm.scanRootPath = '/';
			this.recordForm.task_type = '';
			this.task_exclude_db = '';
			this.task_lookback_period = '';
			this.task_load_sample = '';

			this.serverName = 'server';
			this.s_type = '请选择';
			this.recordForm.s_ip = '';
			this.recordForm.s_port = '';
			this.recordForm.s_driverName = '';
			this.recordForm.task_taskName = '';
			this.recordForm.task_datasetType = '';
			this.recordForm.s_username = '';
			this.recordForm.s_password = '';
			this.recordForm.s_database = ''
		},

		dialogSubmit(formName){
			this.$refs[formName].validate((valid) => {
				if (!valid) {
					return false;
        }
				let _properties = {};
				let _wty = this.recordForm.task_type;
				if(this.recordForm.task_type == 'AZKABAN'){
					_properties = {
						"lookback_period": this.task_lookback_period
					}
				}else if(this.recordForm.task_type == 'ORACLE'){
					_properties = {
						"exclude_db": this.task_exclude_db,
						"load_sample": this.task_load_sample
					}
				}else if(this.recordForm.task_type == 'MYSQL'){
					_properties = {
						"exclude_db": this.task_exclude_db
					}
				}
				if(this.recordForm.task_type == 'HDFS'){
					// _wty = this.task_datasetType;
					if(this.useConfigration){
						_properties["useConfigration"] = 1;
					}else{
						_properties["useConfigration"] = 0;
					}
					_properties["host"] = this.recordForm.host;
					_properties["version"] = this.version;
					_properties["configrationPath"] = this.configrationPath;
					_properties["scanRootPath"] = this.recordForm.scanRootPath;
					_properties["scanDepth"] = this.recordForm.scanDepth;
				}
				if(!_properties){
					_properties = {};
				}
				if(this.dialogTitle == '修改数据源'){
					let reqUpdateData = {};
					if(this.recordForm.task_datasetType == "HDFS"){
						reqUpdateData = {
							importType: this.recordForm.task_datasetType,
							businessName: this.recordForm.hdfsName,
							taskName: this.recordForm.task_taskName,
							taskType: _wty,
							cron: this.task_cron,
							properties: _properties,
							id: this.s_id,
							refId: this.refId
						};
					}else{
						reqUpdateData = {
							importType: this.recordForm.task_datasetType,
							dataSourceType: this.s_type,
							businessName: this.recordForm.s_businessName,
							driverName: this.recordForm.s_driverName,
							username: this.recordForm.s_username,
							password: this.recordForm.s_password,
							taskName: this.recordForm.task_taskName,
							cron: this.task_cron,
							taskCategory: this.selectDataContent,
							taskType: _wty,
							properties: _properties,
							id: this.s_id,
							refId: this.refId
						}
					}


					this.axios.post('/api/v1/systemImport/update',
						reqUpdateData,
						{
							emulateJSON: true
						}
					)
					.then(function(ret) {
						if ( ret.body.code != 200 ){
							this.warnVisible = true;
							this.messageContent = ret.body.message;
							return;
						}
						this.dialogVisible = false
						this.warnVisible = true;
						this.messageContent = '修改成功';
						this.fetchData()

					})


				}else{//新建
					let reqData = {};
					let dataSource = '';
					// if (this.recordForm.task_type === 'HIVE') {
					// 	dataSource = 'MYSQL';
					// }else{
						dataSource = this.recordForm.task_type;
					// }
					if (this.selectDataContent === 'APPLICATION'){
						dataSource = this.recordForm.task_datasetType;
					}
					if(this.isProcess){
						dataSource = 'MYSQL';
						this.recordForm.s_driverName = 'com.mysql.jdbc.Driver';
					}
					if(this.recordForm.task_type === 'HDFS'){

						reqData = {
							businessName: this.recordForm.hdfsName,
							taskName: this.recordForm.task_taskName,
							taskType: _wty,
							cron: this.task_cron,
							properties: _properties
						};
					}else{
						reqData = {
							dataSourceType: dataSource,
							businessName: this.recordForm.s_businessName,
							driverName: this.recordForm.s_driverName,
							username: this.recordForm.s_username,
							password: this.recordForm.s_password,
							taskName: this.recordForm.task_taskName,
							cron: this.task_cron,
							taskCategory: this.selectDataContent,
							taskType: _wty,
							properties: _properties
						}
					}
					if(this.lineage_hive){
						reqData['hiveId'] = this.lineage_hive;
					}
					if(this.lineage_hdfs){
						reqData['hdfsId'] = this.lineage_hdfs;
					}
					let taskType = this.recordForm.task_type;
					let ip = this.recordForm.s_ip;
					let port = this.recordForm.s_port;
					this.generateResultIP(ip, port);

					if(!this.isHDFS){
						reqData['url'] = this.resultIP;
					}
					this.createTask(reqData);
				}
			})
		},
		generateResultIP(ip, port){
			let taskType = this.recordForm.task_type;
			if(taskType === 'ORACLE') {
				if(this.serverName === 'server'){
					this.resultIP = `jdbc:oracle:thin:@//${ip}:${port}/${this.recordForm.s_database}`;
				}else{
					this.resultIP = `jdbc:oracle:thin:@${ip}:${port}:${this.recordForm.s_database}`;
				}
			}else if(taskType === 'MYSQL'){
				this.resultIP = `jdbc:mysql://${ip}:${port}/`;
			}else if(taskType === 'SQLSERVER'){
				this.resultIP = `jdbc:sqlserver://${ip}:${port}`;
			}else if(taskType === 'POSTGRESQL'){
				this.resultIP = `jdbc:postgresql://${ip}:${port}/postgres`;
			}else if(taskType === 'HIVE'){
				this.resultIP = `jdbc:mysql://${ip}:${port}/${this.recordForm.s_database}`;
			}
			if(this.isProcess){
				this.resultIP = `jdbc:mysql://${ip}:${port}/${this.recordForm.s_database}`;
			}
		},
		createTask(reqData){
			this.axios.post('/api/v1/systemImport/create',
				reqData,
				{
					emulateJSON: true
				}
			)
			.then(function(ret) {
				if(ret.body.statusCode == 407){
					this.$router.push({ name: 'Login'})
					return;
				}
				if ( ret.body.statusCode != 200 ){
					if(ret.body.message == '10001'){
						ret.body.message = '该数据源名称已经存在';
					}
					this.$message({
						message: ret.body.message,
						type: 'warning',
						duration: 2000
					})
					return;
				}
				this.$message({
          message: '新建成功',
          type: 'success',
					duration: 2000
        });
				this.dialogVisible = false;
				this.fetchData();
			})
		},
		tableOrder(sort,order){
				this.sort = sort;
				this.order = order;
				this.fetchData(1);
		},
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
		},
		handleCurrentChange(page) {
			this.fetchCommentData(page)
		},

		changePage(val){

			this.fetchData(val);
		}
	}
}
</script>
<style>
.addNewMeta h4{
	font-size: 14px;
	line-height: 30px;
	margin-bottom: 20px;
	border-bottom: 1px solid #e2e2e2;
}
.addNewMeta h4 span{
	display: inline-block;
	border-bottom: 1px solid #c4c4c4;
	margin-bottom: -1px;
}
.el-select{
	border: 0;
	padding: 0;
}
.form-horizontal{
	position: relative;
}
.isDB{
	height: 310px;
}
.isHDFS{
	height: 140px;
}

.meta-import-record-testbutton{
	float: left;
}
.bg-purple-light .el-checkbox{
	margin-top: 5px;
}
.form-control{
	height: 35px;
	border-radius: 3px;
	border: 1px solid #c2cedb;
}
.control-width-name{
	width: 150px;
}
.control-width-businessname{
	width: 150px;
}
</style>
