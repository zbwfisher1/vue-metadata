<template>
    <div>
        <el-table
                :data="reShowRecordList"
                border
                style="width: 100%"
                :default-sort="{prop: 'datasetName', order: 'ascending'}"
                @sort-change="sortTable">
            <el-table-column
                    prop="datasetName"
                    sortable="custom"
                    :label="$t('content.dataset.businessDetail.biaom')">
                <template slot-scope="scope">
                    <template v-if="scope.row.datasetType === 'Hdfs' ">
                        <a v-html="emphasizeName(scope.row.datasetName,key)"
                           :href="`#/Main/Files?id=${scope.row.id}`"></a>
                    </template>
                    <template v-else>
                        <item-jump
                                :params="{
                            params:{
                                path:scope.row.path,
                                level:3,
                            },
                            isfolder: false
                        }"
                                :name="emphasizeName(scope.row.datasetName,key)"
                                :view="false"
                                :datasetId="scope.row.id"
                                :isPrivate="scope.row.isPrivate"
                        >
                        </item-jump>
                    </template>
                </template>
            </el-table-column>
            <el-table-column
                    prop="path"
                    sortable="custom"
                    :label="$t('content.dataset.datasetDetail.wllj')">
            </el-table-column>
            <el-table-column
                    prop="datasourceName"
                    sortable="custom"
                    :label="$t('content.dataset.datasetDetail.sjlx')">
            </el-table-column>
            <el-table-column
                    sortable="custom"
                    prop="projectName"
                    :label="$t('content.personal.ssxm')">
            </el-table-column>
            <el-table-column
                    prop="createdTime"
                    sortable="custom"
                    :label="$t('content.dataset.businessDetail.cjsj')">
                <template slot-scope="scope">
                    {{formatTime(scope.row.createdTime)}}
                </template>
            </el-table-column>

            <el-table-column :label="$t('content.dataset.datasetDetail.ccdx')">
                <template slot-scope="scope">
                    {{formatSize(scope.row.size)}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="showState"
                    :label="$t('content.dataset.datasetDetail.sjzt')">
            </el-table-column>
            <el-table-column
                    prop=""
                    :label="$t('content.dataset.datasetDetail.cz')">
                <template slot-scope="scope">
                    <el-tooltip effect="dark" :content="$t('content.personal.xgowner')" placement="top">
                        <span @click="showOwnerInfo(scope.row.id, scope.row.datasetName, scope.row.owner)">
                            <i class="iconfont icon-yonghushezhi icon-s"></i>
                        </span>
                    </el-tooltip>

                    <el-tooltip effect="dark"
                                :content="scope.row.isPrivate == 0 ? $t('content.common.yc') : $t('content.common.qxyc')"
                                placement="top">
                        <span @click="hiddenOperate({
                            isPrivate: scope.row.isPrivate,
                            datasetId: scope.row.id,
                            datasetName: scope.row.datasetName})">
                            <i class="iconfont"
                               :class="{'icon-YDUI-yincangmima': scope.row.isPrivate == 0, 'icon-xianshiheyincangicon': scope.row.isPrivate == 1}"></i>
                        </span>
                    </el-tooltip>

                    <el-tooltip effect="dark" :content="$t('content.common.sc')" placement="top">
                        <span @click="delTable(scope.row.id, scope.row.datasetName)">
                            <i class="iconfont icon-shanchu2 icon-s"></i>
                        </span>
                    </el-tooltip>


                    <!-- <a href="javascript:;" @click="showOwnerInfo(scope.row.id, scope.row.datasetName,scope.row.datasetName)">操作</a> -->
                </template>
            </el-table-column>
        </el-table>
        <div class="tablePages">
            <el-pagination background
                           layout="total, prev, pager, next"
                           @current-change="handleCurrentChange"
                           :current-page="currentPage"
                           :page-size="10"
                           :total="totalRows">
            </el-pagination>
        </div>
        <!-- 设置生命周期对话框 -->
        <el-dialog
                :title="$t('content.dataset.datasetDetail.smzqsz')"
                :visible.sync="dialogVisible"
                custom-class="storage-dialog"
                :close-on-click-modal="false">
            <loading :isloading="dialogLoading"></loading>
            <el-form v-if="!dialogLoading" :model="recordForm" :rules="recordRules" ref="recordForm">
                <dialog-item-title :title="$t('content.dataset.datasetDetail.smzq')"></dialog-item-title>
                <el-form-item :label="$t('content.dataset.datasetDetail.scsz')">
                    <!-- class="demo-form-inline" -->
                    <el-col
                            :span="13"
                            v-if="isDisabled">
                        <el-form-item prop="life_day">
                            <el-input
                                    :placeholder="$t('content.validator.qsrzs')"
                                    v-model="recordForm.life_day"></el-input>

                        </el-form-item>
                    </el-col>
                    <el-col :span="1">&nbsp;</el-col>
                    <el-col :span="5">
                        <el-select
                                v-model="recordForm.type"
                                prop="type"
                                @change="clearValue">
                            <el-option
                                    v-for="(value, key) in units"
                                    :label="value"
                                    :value="key"></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <dialog-item-title :title="$t('content.dataset.datasetDetail.pdyj')"></dialog-item-title>
                <el-form-item :label="$t('content.common.qxz')">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item prop="tag_type">
                                <el-select v-model="recordForm.tag_type">
                                    <el-option v-for="(label, key) in basis"
                                               :label="label"
                                               :value="key"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <template v-if="recordForm.tag_type == '1'">
                            <el-col :span="1">&nbsp;</el-col>
                            <el-col :span="6">
                                <el-form-item prop="tag_column">
                                    <el-select v-model="recordForm.tag_column">
                                        <el-option
                                                v-for="item in fieldList"
                                                :label="item.tag_column"
                                                :value="item.tag_column"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </template>
                        <el-col :span="1">&nbsp;</el-col>
                    </el-row>
                </el-form-item>
                <dialog-item-title :title="$t('content.dataset.datasetDetail.dqcl')"></dialog-item-title>
                <el-form-item :label="$t('content.common.qxz')">
                    <el-radio-group v-model="deadline">
                        <el-radio :label="1">{{$t('content.dataset.datasetDetail.zjsc')}}</el-radio>
                        <!-- <el-radio :label="2">回收站保留30天</el-radio> -->
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click.native="dialogVisible=false">{{$t('content.common.qx')}}</el-button>
            <el-button type="primary" @click="postLifeCycle()">{{$t('content.common.qd')}}</el-button>
        </span>
        </el-dialog>
        <!-- 修改owner -->
        <el-dialog :title="ownerTableName" :visible.sync="dialogOwnerVisible" custom-class="changeOwner">
            <div class="ownerCon">
                <label>{{$t('content.personal.dqowner')}}：</label>
                <div class="txt">
                    {{tableOwnerActive == undefined ? '--' : tableOwnerActive}}
                </div>
            </div>
            <div class="ownerCon">
                <label>{{$t('content.personal.qsrxdowner')}}：</label>
                <div class="txt">
                    <el-select
                            style="width: 200px;"
                            v-model="newOwner"
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
                </div>
            </div>

            <div class="ownerCon" v-if="ownerHistory.length > 0">
                <label>{{$t('content.personal.lsowner')}}：</label>
                <div class="txt">
                    <ul class="ownerList">
                        <li v-for="item in ownerHistory">
                            <span class="ownerName">{{item.owner || $t('content.personal.a27')}}</span>
                            {{formatTime(item.date)}}
                        </li>
                    </ul>
                </div>
            </div>

            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogOwnerVisible = false">{{$t('content.common.qx')}}</el-button>
            <el-button type="primary" @click="changeOwner()">{{$t('content.common.qd')}}</el-button>
        </span>
        </el-dialog>
        <!-- 确认框 -->
        <el-dialog
                :title="$t('content.common.tis')"
                :visible.sync="delDialogVisible"
                width="385px"
                :close-on-click-modal="false"
                @click.native.stop>
            <div class="del-content">
                {{confirmMessage}}?
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button
                        @click="delDialogVisible = false">
                    {{$t('content.common.qx')}}
                </el-button>
                <el-button
                        type="primary" @click="operatePost">
                    {{$t('content.common.qd')}}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import ItemJump from 'common/ItemJump';
    import Search from 'common/Search';
    import {
        Message,
        FormatTime,
        FormatSize,
        EmphasizeName,
        FormatLifeDay,
        resetValidators,
        SortTable
    } from 'mixins/common';
    import dialogItemTitle from 'common/dialogItemTitle';
    import Bus from 'utils/bus';

    export default {
        name: 'PersonalOwnerTable',
        mixins: [Message, FormatTime, FormatSize, EmphasizeName, FormatLifeDay, resetValidators, SortTable],
        data() {
            const vm = this;
            const timeValidate = (rule, value, callback) => {
                if (value) {
                    let validateValue = Number(value);
                    let selectUnit = this.recordForm.type;
                    let lifeCycle = this.recordForm.life_day;
                    let day = 1;
                    let errorContent = '';
                    switch (selectUnit) {
                        case 'D':
                            day = lifeCycle * 1;
                            errorContent = vm.$t('content.validator.cdbdcg', [36500]);
                            break;
                        case 'W':
                            day = lifeCycle * 7;
                            errorContent = vm.$t('content.validator.cdbdcg', [5214]);
                            break;
                        case 'M':
                            day = lifeCycle * 30;
                            errorContent = vm.$t('content.validator.cdbdcg', [1216]);
                            break;
                        case 'Y':
                            day = lifeCycle * 365;
                            errorContent = vm.$t('content.validator.cdbdcg', [100]);
                            break;
                        default:
                            day = 1;
                            break;
                    }
                    if (day > 36500) {
                        callback(new Error(errorContent));
                    } else if (!validateValue || !Number.isInteger(validateValue)) {
                        callback(new Error(this.$t('content.validator.qsrzs')));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            return {
                loading: false,
                delDialogVisible: false,
                dialogVisible: false,
                dialogLoading: true,
                datasetName: '',
                recordForm: {
                    life_day: '',
                    tag_type: '',
                    tag_column: '',
                    type: ''
                },
                recordRules: {
                    life_day: [
                        {validator: timeValidate},
                        {required: true, message: this.$t('content.validator.qszsc')}
                    ],
                    tag_type: [
                        {required: true, message: this.$t('content.validator.qxzpdjy')}
                    ],
                    tag_column: [
                        {required: true, message: this.$t('content.validator.qxzzd')}
                    ],
                    type: [
                        {validator: timeValidate}
                    ]
                },
                isDisabled: true,
                life_day: '',
                tag_type: '',
                tag_column: '',
                type: 'D',
                units: {
                    D: this.$t('content.common.tian'),
                    W: this.$t('content.common.zhou'),
                    M: this.$t('content.common.yue'),
                    Y: this.$t('content.common.nian'),
                    F: this.$t('content.common.yongj')
                },
                basis: {
                    '0': this.$t('content.dataset.datasetDetail.wjsj'),
                    '1': this.$t('content.dataset.datasetDetail.zdsj')
                },
                fieldList: [],
                deadline: 1,
                datasetId: '',
                testIndex: 22,
                records: [],
                currentPage: 1,
                pageSize: 10,
                totalRows: 1,
                noDataVisible: false,
                lifeType: '',
                loadingVisible: true,
                dialogOwnerVisible: false,
                key: '',
                confirmMessage: '',
                isPrivate: 0,
                isOperateHide: true,
                tableHeader: [
                    {
                        name: this.$t('content.dataset.businessDetail.biaom'),
                        type: "datasetName",
                        hasSort: true
                    },
                    {
                        name: this.$t('content.dataset.datasetDetail.sjlx'),
                        type: "datasourceName",
                        hasSort: true
                    },
                    {
                        name: this.$t('content.personal.ssxm'),
                        type: "projectName",
                        hasSort: true
                    },
                    {
                        name: this.$t('content.dataset.businessDetail.cjsj'),
                        type: "createdTime",
                        hasSort: true
                    },

                    {
                        name: this.$t('content.dataset.datasetDetail.ccdx'),
                        type: "size",
                        hasSort: true
                    },
                    // {
                    //   name: '可见状态',
                    //   hasSort: false,
                    // },
                    {
                        name: this.$t('content.dataset.datasetDetail.sjzt'),
                        hasSort: false
                    },
                    //{
                    //    name:this.$t('content.dataset.datasetDetail.smzq'),
                    //    hasSort:false,
                    //},
                    {
                        name: this.$t('content.dataset.datasetDetail.cz'),
                        hasSort: false
                    }
                ],
                sort: "datasetName",
                order: "asc",

                ownerTableId: '', // 当前表id
                ownerTableName: '', // 当前表名
                tableOwnerActive: '', // 当前用户
                ownerHistory: [], // owner历史
                newOwner: '',
                userList: []
            };
        },
        components: {
            ItemJump,
            // item,
            Search,
            dialogItemTitle
        },
        watch: {
            dialogVisible(val) {
                this.dialogLoading = val ? true : false;
                this.resetValidators('recordForm');
            },
            'recordForm.type': function (val) {
                if (val == 'F') {
                    this.isDisabled = false;
                } else {
                    this.isDisabled = true;
                }
            },
            '$parent.key'(val) {
                this.fetchData({key: val, currentPage: 1});
            }
        },
        created() {
            this.fetchData();
        },
        computed: {
            reShowRecordList() {
                const vm = this;
                this.showRecordList.forEach(val => {
                    if (val.isDeleted == 0) {
                        val.showState = this.$t('content.dataset.datasetDetail.zhengc');
                    } else if (val.isDeleted == 1) {
                        val.showState = this.$t('content.dataset.datasetDetail.ysc');
                    } else if (val.isDeleted == 2) {
                        val.showState = this.$t('content.dataset.datasetDetail.weiz');
                    }
                });
                return this.showRecordList;
            }
        },
        methods: {
            renderHeader: function (h, {column}) {
                return (<span>
                    {column.label}
                    <i class="el-icon-question" title={this.$t('content.dataset.datasetDetail.tyglxzdjh')} v-tippy/>
                </span>);
            },
            searchUserList(keyword) {
                if (keyword !== '') {
                    this.loading = true;
                    this.axios.get(`/privilege/getLeapUsers?kw=${encodeURIComponent(keyword)}`)
                            .then((res) => {
                                if (res.status == 200) {
                                    this.loading = false;
                                    this.userList = res.body.message;
                                }
                            });
                } else {
                    this.options4 = [];
                }
            },
            delTable(id, name) {
                this.delDialogVisible = true;
                this.datasetId = id;
                this.datasetName = name;
                this.isOperateHide = false;
                this.confirmMessage = this.$t('content.dataset.importExport.qrsc') + ' "' + name + '"';
            },
            async operatePost() {
                this.delDialogVisible = false;
                let url = '';
                let content = '';
                if (this.isOperateHide) {
                    if (this.isPrivate == 0) {
                        url = `/private/privateDataset/${this.datasetId}`;
                        content = this.$t('content.common.yc');
                    } else {
                        url = `/private/publicDataset/${this.datasetId}`;
                        content = this.$t('content.common.qxyc');
                    }
                } else {
                    url = `/datasets/deleteDataset/${this.datasetId}`;
                }
                const res = await this.axios.post(url);
                const {statusCode} = res.body;
                if (statusCode == 200) {
                    let messageProp = this.isOperateHide ? `${content} ${this.$t('content.common.chengg')}` : this.$t('content.common.sccg');
                    this.message(`${messageProp}!`, "success");
                    let params;
                    if (this.isOperateHide) {
                        params = {key: this.key, currentPage: this.currentPage};
                    } else {
                        if (this.reShowRecordList.length == 1 && this.currentPage > 1) {
                            params = {key: this.key, currentPage: this.currentPage - 1};
                        } else {
                            params = {key: this.key, currentPage: this.currentPage};
                        }
                    }
                    this.fetchData(params);
                    Bus.$emit('fetchCount');
                } else {
                    let messageProp = this.isOperateHide ? `${content}失败` : this.$t('content.personal.scsb');
                    this.message(`${messageProp}!`, "error");
                }
            },
            postLifeCycle() {
                let paramLifeCycle = this.recordForm.life_day ? this.recordForm.life_day : 0;
                let params = {
                    life_day: paramLifeCycle,
                    type: this.recordForm.type,
                    tag_type: this.recordForm.tag_type === this.$t('content.dataset.datasetDetail.wjsj') ? 0 : this.recordForm.tag_type,
                    delete_type: 0
                };
                if (this.recordForm.tag_type == 1) {
                    params['tag_column'] = this.recordForm.tag_column;
                }
                let postUrl = `/lifecycle/${this.datasetId}`;
                this.$refs['recordForm'].validate((valid) => {
                    if (!valid) {
                        return false;
                    } else {
                        this.axios.post(postUrl, JSON.stringify(params), {
                            contentType: 'application/json',
                            dataType: 'json'
                        }).then((res) => {
                            if (res.body.state) {
                                this.dialogVisible = false;
                                this.loading = true;
                                this.fetchData({key: this.key, currentPage: this.currentPage});
                            }
                        });
                    }
                });
            },
            fetchFieldData() {
                const url = `/lifecycle/${this.datasetId}/fields`;
                this.axios.get(url)
                        .then((res) => {
                            if (res.status == 200) {
                                this.dialogLoading = false;
                                if (res.body.data.length == 0) {
                                    this.$delete(this.basis, '1');
                                } else {
                                    this.fieldList = res.body.data;
                                }
                            }
                        });
            },
            clearValue() {
                this.recordForm.life_day = '';
            },
            async setLifeCycle(id) {
                this.dialogVisible = true;
                this.datasetId = id;
                await this.fetchLifeCycleData();
                let {life_day, tag_type, tag_column, type} = this.$data;
                Object.assign(this.recordForm, {life_day, tag_type, tag_column, type});
                this.fetchFieldData();
            },
            async fetchLifeCycleData() {
                const self = this;
                await this.axios.get(`/lifecycle/${this.datasetId}`)
                        .then((res) => {
                            if (res.status == 200) {
                                if (res.body.data.length == 0) {
                                    for (let key in self.recordForm) {
                                        self.recordForm[key] = '';
                                    }
                                    this.type = 'F';
                                } else {
                                    Object.assign(self.$data, res.body.data[0]);
                                    //转字符
                                    this.tag_type = this.tag_type + '';
                                    this.tag_column = this.tag_column + '';
                                }
                            }
                        });
            },
            async hiddenOperate(params) {
                this.delDialogVisible = true;
                Object.assign(this.$data, params);
                this.confirmMessage = this.isPrivate == 0 ? `${this.$t('content.personal.qrycb')}"${this.datasetName}"` : `${this.$t('content.personal.qrqxyc')}"${this.datasetName}"`;
                this.isOperateHide = true;
            },
            tableSort({sort, order}) {
                this.sort = sort;
                this.order = order;
                const params = {
                    key: this.key
                };
                this.fetchData(params);
            },
            async fetchData({key = '', currentPage = 1} = {}) {
                Bus.$emit('loadingVisible', true);
                this.key = key;
                let url = '';
                if (this.sort) {
                    url = `datasets/ownedDataset?keyword=${escape(key)}&rows=10&page=${currentPage}&sort=${this.sort}&order=${this.order}`;
                } else {
                    url = `datasets/ownedDataset?keyword=${escape(key)}&rows=10&page=${currentPage}&sort=datasetName&order=asc`;
                }
                const res = await this.axios.get(url);
                this.loadingVisible = false;
                if (res.body.statusCode === 200) {
                    Bus.$emit('loadingVisible', false);
                    Object.assign(this.$data, res.body.message);
                    this.noDataVisible = this.records.length === 0;
                }
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                const params = {
                    currentPage: val,
                    key: this.key
                };
                this.fetchData(params);
            },
            // 显示ower信息窗口
            async showOwnerInfo(id, datasetName, owner) {
                let self = this;
                this.ownerTableId = id;
                // this.ownerTableName = '修改表"' + datasetName + '"的owner';
                this.ownerTableName = this.$t('content.personal.xgbowner', [datasetName]);
                this.tableOwnerActive = owner;
                this.dialogOwnerVisible = true;
                let url = `privilege/${this.ownerTableId}/getOwnerHistory`;
                const res = await self.axios.get(url);
                if (res.body.statusCode == 200) {
                    this.ownerHistory = res.body.message;
                    this.ownerHistory.shift();
                }
            },

            // 修改owner
            async changeOwner() {
                if (this.newOwner != '') {
                    let self = this;
                    let url = `privilege/${this.ownerTableId}/updateDatesetOwner?userName=${this.newOwner}`;
                    const res = await self.axios.get(url);
                    if (res.body.statusCode == 200) {
                        this.message(`${this.$t('content.personal.xgcg')}!`, 'success');
                        this.newOwner = '';
                        this.dialogOwnerVisible = false;
                        this.fetchData({key: this.key, currentPage: this.currentPage});
                        Bus.$emit('fetchCount');
                    }
                } else {
                    this.dialogOwnerVisible = false;
                }
            }
        }
    };
</script>
<style lang="less">
    @import '../../../vars.less';
    .newOwner {
        width: 200px;
    }
    .hidden-operator {
        cursor: pointer;
    }
    .owner-operator {
        display: flex;
        justify-content: left;
        span {
            margin-right: 7px;
        }
        i {
            font-size: 18px;
            color: #4D819B;
            cursor: pointer;
            &:hover {
                color: #FF5A5A;
            }
        }
        .icon-s {
            font-size: 16px;
        }
    }
    .table-tip-content {
        display: flex;
    }
    .triangle-border {
        position: absolute;
        top: 0;
        right: 42px;
        overflow: hidden;
        margin-left: -10px;
        width: 0;
        height: 0;
        border-width: 10px;
        border-style: solid dashed dashed dashed;
    }
    .tb-border {
        top: -21px;
        border-color: transparent transparent #DDD transparent;
    }
    .tb-background {
        top: -20px;
        border-color: transparent transparent #FFF transparent;
    }
    .ownerTit {
        padding-bottom: 10px;
        margin-bottom: 10px;
        border-bottom: 1px solid #DDD;
        color: #B3B8BF
    }
    .ownerCon {
        padding: 5px 0;
        overflow: hidden;
    }
    .ownerCon label {
        float: left;
        width: 150px;
        text-align: right;
        line-height: 32px;
        color: #777
    }
    .ownerCon .txt {
        margin-left: 160px;
        line-height: 32px;
    }
    .ownerCon ul {
        max-height: 128px;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .changeOwner {
        width: 520px;
    }
    .ownerCon li {
    }
    .ownerCon .ownerName {
        float: left;
        width: 130px;
        margin-right: 10px;
        vertical-align: middle;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .icon-private {
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url("../@{imagesUrl}/owner_operation.png") no-repeat;
        background-position: -45px 4px;
    }
    .iconIsPrivate {
        background-position: -14px 2px;
    }
    .cell {
        span {
            i {
                margin-left: 10px;
            }
        }
    }
</style>
