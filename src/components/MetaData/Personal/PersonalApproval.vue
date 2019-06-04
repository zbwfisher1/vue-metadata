<template>
    <!-- 权限审批 -->
    <div class="personal-approval">
        <div class="personal-approval-content">
            <div class="boxCommon">
                <div class="table-title">
                    <div class="table-title__text">
                        <span>{{$t(permissionTab.title)}}</span>
                    </div>
                    <div class="table-title__btns">
                        <Search
                                :placeholder="$t('content.validator.qsrbm')"
                                emitName="approvalSearch"
                                @approvalSearch="fetchData"></Search>
                    </div>
                </div>
                <div class="con">
                    <div class="tableMulti">
                        <el-table :data="approvalList"
                                  ref="table1"
                                  border
                                  :default-sort="{prop: 'create_time', order: 'descending'}"
                                  @sort-change="sortTable"
                                  v-loading="loadingVisible">
                            <el-table-column prop="create_time"
                                             sortable="custom"
                                             :label="$t(`content.personal.${activeTab === 'approvalsPending' ? 'spsj' : 'spsjsj'}`)">
                                <template slot-scope="scope">
                                    {{formatTime(activeTab === 'approvalsPending' ? scope.row.create_time*1000 :
                                    scope.row.approver_time)}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="creator" sortable="custom"
                                             :label="$t('content.personal.sqr')"></el-table-column>
                            <el-table-column prop="dbAndTable" :label="$t('content.personal.sqkb')"></el-table-column>
                            <el-table-column prop="ownerProject"
                                             :label="$t('content.personal.ssxm')"></el-table-column>
                            <el-table-column prop="type" :label="$t('content.personal.qxlx')">
                                <template slot-scope="scope">
                                    <i v-for="type in Array.from(scope.row.type)"
                                       class="permission__icon"
                                       :class="{'permission__icon-r': type==='r','permission__icon-w': type==='w'}">
                                        {{type === 'r' ? $t('content.authority.r') : $t('content.authority.w')}}
                                    </i>
                                </template>
                            </el-table-column>
                            <el-table-column prop="project_name"
                                             :label="$t('content.personal.syqxxm')"></el-table-column>
                            <el-table-column prop="reason"
                                             :label="$t('content.dataset.datasetDetail.sqly')"></el-table-column>
                            <el-table-column prop="md_result" :label="$t('content.common.zhuangt')">
                                <template slot-scope="scope">
                                    <span style="color: orange;" v-if="scope.row.md_result === 0">{{$t('content.personal.dsh')}}</span>
                                    <span style="color: green;" v-if="scope.row.md_result === 1">{{$t('content.personal.shtg')}}</span>
                                    <span style="color: orange;" v-if="scope.row.md_result === 3">{{$t('content.personal.dsh')}}</span>
                                    <el-tooltip class="item" effect="dark" placement="top">
                                        <div slot="content" v-html="reasonTxt(scope.row.md_msg)"></div>
                                        <span style="color: red; border-bottom: 1px dashed red;"
                                              v-if="scope.row.md_result === 2">
                                                {{$t('content.personal.shbtg')}}
                                            </span>
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('content.personal.spcz')"
                                             v-if="activeTab === 'approvalsPending'">
                                <template slot-scope="scope">
                                    <div class="owner-operator" v-if="scope.row.md_result === 0">
                                        <a href="javascript:;"
                                           @click="operateApproval(scope.row.id, scope.row.allowNext)">
                                            {{$t('content.dataset.datasetDetail.cz')}}
                                        </a>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="tablePages">
                            <el-pagination background
                                           layout="total, prev, pager, next"
                                           @current-change="handleCurrentChange"
                                           :current-page="currentPage"
                                           :page-size="pageSize"
                                           :total="totalRows">
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog
                :title="$t('content.personal.jjly')"
                :visible.sync="reasonDialogVisible"
                width="385px"
                :close-on-click-modal="false">
            <el-input
                    type="textarea"
                    v-model="reason"
                    autofocus
                    :placeholder="$t('content.personal.qsrly')"
                    @keyup.native.enter="disagree"></el-input>
            <div class="refuse-warn" v-if="refuseValidator">{{refuseContent}}</div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="reasonDialogVisible = false">{{$t('content.common.qx')}}</el-button>
                <el-button type="primary" @click="disagree">{{$t('content.common.qd')}}</el-button>
            </div>
        </el-dialog>
        <el-dialog
                :title="$t('content.common.tis')"
                :visible.sync="loadingDialogVisible"
                width="385px"
                :close-on-click-modal="false">
            <div class="del-content">
                {{$t('content.personal.shz')}}...
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="loadingDialogVisible = false">{{$t('content.common.qd')}}</el-button>
            </div>
        </el-dialog>
        <el-dialog
                class="appvoval-dialog"
                :visible.sync="approvalDialog"
                :title="$t('content.personal.spi')">
            <el-form :model="approvalForm" label-width="100px">
                <el-form-item class="approval-pass">
                    <el-radio-group v-model="approvalForm.pass">
                        <el-radio :label="1">{{$t('content.personal.sptg')}}</el-radio>
                        <el-radio :label="2">{{$t('content.personal.spbtg')}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                        v-if="approvalForm.pass==1 && allowNext=='Y'"
                        :label="$t('content.personal.zdspr')"
                        class="approval-person">
                    <el-select
                            v-model="approvalForm.owner"
                            filterable
                            remote
                            :placeholder="$t('content.personal.qsrgjc')"
                            :remote-method="searchUserList"
                            :loading="loading">
                        <el-option
                                v-for="item in userList"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button
                        @click="approvalDialog = false">
                    {{$t('content.common.qx')}}
                </el-button>
                <el-button
                        type="primary"
                        @click="approvalSubmit()">
                    {{$t('content.common.qd')}}
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import Search from 'common/Search';
    import Bus from 'utils/bus';
    import {FormatTime, Message, FormatSize, EmphasizeName, SortTable} from 'mixins/common';

    export default {
        props: ['permissionTab'],
        mixins: [FormatTime, Message, EmphasizeName, SortTable],
        data() {
            return {
                approvalDialog: false,
                approvalForm: {
                    pass: 1,
                    owner: ''
                },
                isClear: false,
                key: '',
                userList: [],
                approvalList: [],
                reasonDialogVisible: false,
                reason: '',
                id: '',
                url: '/privilege/approvalApplyForPrivliege',
                contentMessage: '',
                currentPage: 1,
                pageSize: 10,
                totalRows: 1,
                totalPages: 0,
                loadingVisible: true,
                sort: 'create_time',
                order: 'desc',
                refuseValidator: false,
                refuseContent: '',
                tableHeader: [],
                agreeArr: [],
                disAgreeOpt: false,
                loadingDialogVisible: false,
                loading: false,
                allowNext: ''
            };
        },
        components: {
            Search
        },
        watch: {
            'permissionTab.component'(val) {
                this.loadingVisible = true;
                this.isClear = true;
                this.$refs.table1.clearSort();
                this.$refs.table1.sort('create_time', 'descending');
            }
        },
        created() {

        },
        computed: {
            activeTab() {
                return this.permissionTab.component;   //两类值:   approvalsPending(待审批) approvalsFinish(已审批)
            }
        },
        methods: {
            searchUserList(keyword) {
                if (keyword !== '') {
                    this.loading = true;
                    this.axios.get(`/privilege/getLeapUsers?kw=${encodeURIComponent(keyword)}`).then((res) => {
                        this.loading = false;
                        if (res.status === 200) {
                            this.loading = false;
                            this.userList = res.body.message;
                        }
                    });
                } else {
                    this.options4 = [];
                }
            },
            operateApproval(id, allowNext) {
                this.allowNext = allowNext;
                this.resetDialog();
                this.id = id;
                this.approvalDialog = true;
            },
            resetDialog() {
                this.approvalForm = {
                    pass: 1,
                    owner: ''
                };

            },
            reasonTxt(reason) {
                if (reason === '当前用户没有在项目里面分配组，无法提交资源权限请求。') {
                    return this.$t('content.personal.myqxz');
                } else if (reason === '当前用户已经拥有该资源权限，不需要提交请求。') {
                    return this.$t('content.personal.yyqx');
                } else if (reason === 'get wrong message when approvling,please try again later') {
                    return this.$t('content.personal.leapidspsb');
                } else if (reason === 'approvle failed') {
                    return this.$t('content.personal.leapidspsb');
                } else if (reason === '你提交的资源请求正在等待审批，请无重复提交。') {
                    return this.$t('content.personal.qwcftj');
                } else {
                    return reason;
                }
            },
            closeResult() {
                this.fetchData();
            },
            disagree() {
                const params = {
                    id: this.id,
                    result: this.approvalForm.pass,
                    reason: this.reason,
                    nextVerifier: this.approvalForm.pass === 2 ? '' : this.approvalForm.owner
                };
                if (this.reason.length === 0) {
                    this.refuseValidator = true;
                    this.refuseContent = this.$t('content.validator.qsrjjly');
                } else if (this.reason.length > 200) {
                    this.refuseValidator = true;
                    this.refuseContent = this.$t('content.validator.cdbdcg', [200]);
                } else {
                    this.refuseValidator = false;

                    if (this.disAgreeOpt) {
                        return;
                    }

                    this.disAgreeOpt = true;
                    this.postIsAgree(params);
                }

            },

            async approvalSubmit() {
                this.approvalDialog = false;
                let params = null;
                // 审批通过
                if (this.approvalForm.pass === 1) {
                    if (this.agreeArr.indexOf(this.id) > -1) {
                        this.loadingDialogVisible = true;
                        return;
                    }
                    this.agreeArr.push(this.id);
                    params = {
                        id: this.id,
                        result: this.approvalForm.pass,
                        reason: '',
                        nextVerifier: this.approvalForm.owner
                    };
                    this.postIsAgree(params);
                } else {
                    // 审批不通过
                    if (this.agreeArr.indexOf(this.id) > -1) {
                        return;
                    }
                    this.disAgreeOpt = false;
                    this.reasonDialogVisible = true;
                    this.reason = '';
                }
            },
            // 不管审批通过还是不通过最终都会执行postIsAgree
            async postIsAgree(params) {
                params.lang = this.$i18n.locale;
                this.loadingDialogVisible = true;
                const res = await this.axios.post(this.url, params);
                if (res.body.statusCode === 200) {
                    const {result, reason} = res.body.message;
                    this.reasonDialogVisible = false;
                    if (result === 1) {
                        this.contentMessage = this.$t('content.personal.spcg');
                        this.message(`${this.contentMessage}`, "success");
                    } else {
                        this.contentMessage = this.reasonTxt(reason);
                        this.message(`${this.contentMessage}`, "error");
                    }
                    Bus.$emit('appendingCount');
                    this.fetchData();
                } else if (res.body.message === 20014) {
                    this.reasonDialogVisible = false;
                    this.message(this.$t('content.personal.cgwjsh'), "error");   //超过五级审核
                } else if (res.body.message === 20016) {
                    this.message(this.$t('content.personal.bntjcfdspr'), "error");   //不能添加重复的审批人
                }
                this.loadingDialogVisible = false;
                this.agreeArr.splice(this.agreeArr.indexOf(params.id), 1);
            },
            fetchData({key = '', page = 1} = {}) {
                this.loadingVisible = true;
                const {order, sort} = this;
                this.key = key;
                const params = {
                    keyword: key,
                    key: 10,
                    page,
                    sort,
                    order,
                    approvalStatus: this.permissionTab.component === 'approvalsPending' ? 0 : 1
                };
                this.axios.get(`privilege/getApprovalList`, {params}).then(res => {
                    const {statusCode, message} = res.data;
                    if (statusCode === 200) {
                        this.loadingVisible = false;
                        this.approvalList = message.records;
                        Object.assign(this.$data, message);
                    }
                });
            },
            tableSort({sort, order}) {
                this.sort = sort;
                this.order = order;
                const params = {
                    key: this.key
                };
                this.fetchData(params);
            },
            handleCurrentChange(val) {
                const params = {
                    page: val,
                    key: this.key
                };
                this.fetchData(params);
            }
        }
    };
</script>
<style lang="less">
    .owner-operator {
        .icon-cf-c100 {
            color: #5BB65F;
        }
        .icon-weitongguo {
            color: #F64E43;
        }
    }
    .personal-approval {
        a {
            color: #00699D;
            text-decoration: none;
        }
        textarea {
            height: 100px;
        }
    }
    .personal-approval-content {
        .person-approval-waiting {
            background: #FFF;
        }
    }
    .approval-content {
        text-align: center;
    }
    .appvoval-dialog {
        .el-dialog {
            width: 30vw;
        }
        .approval-pass .el-form-item__content {
            margin-left: 0 !important;
        }
        .el-radio__label {
            display: inline;
        }
        .approval-person {
            padding-left: 20px;
            .el-form-item__label {
                text-align: left;
            }
            .el-input {
                width: 200px;
            }
        }
    }
</style>
