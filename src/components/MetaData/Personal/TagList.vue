<template>
    <div class="boxCommon">
        <div class="table-title">
            <div class="table-title__text">
                <span>{{$t('content.personal.bqgl')}}</span>
            </div>
            <div class="table-title__btns">
                <el-button type="primary" @click="dialogVisible = true">{{$t('content.personal.cjbq')}}</el-button>
                <Search :keyword='keyword' @handleSearch="searchList"></Search>
            </div>
        </div>

        <el-table :data="tableData"
                  ref="elTable"
                  v-loading="loading"
                  border
                  :default-sort="{prop: 'name', order: 'descending'}"
                  @sort-change="sortTable">
            <el-table-column
                    prop="name"
                    sortable="custom"
                    :label="$t('content.personal.bqmc')">
                <template slot-scope="scope">
                    <router-link :to="`/Main/MetaData/Personal/Tag/${scope.row.id}`">
                        {{scope.row.name}}
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column
                    prop="createDate"
                    sortable="custom"
                    :label="$t('content.process.cjsj')">
                <template slot-scope="scope">
                    {{formatTime(scope.row.createDate)}}
                </template>
            </el-table-column>

            <el-table-column
                    prop="creator"
                    :label="$t('content.dataset.importExport.cjr')"
                    sortable="custom">
            </el-table-column>

            <el-table-column
                    prop="bindDatasetCount"
                    sortable="custom"
                    :label="$t('content.personal.gldxsm')">
            </el-table-column>

            <el-table-column
                    prop="desc"
                    sortable="custom"
                    :label="$t('content.personal.mqms')">
            </el-table-column>
            <el-table-column prop="" :label="$t('content.dataset.datasetDetail.cz')">
                <template slot-scope="scope">
                    <div class="el-icon-wrapper">
                        <el-tooltip effect="dark" :content="$t('content.tags.ckgldx')" placement="top">
                            <router-link :to="`/Main/MetaData/Personal/Tag/${scope.row.id}`">
                                <i class="el-icon-view"></i>
                            </router-link>
                        </el-tooltip>
                        <el-tooltip effect="dark" :content="$t('content.tags.bjbq')" placement="top">
                            <i class="el-icon-edit-outline"
                               @click="handleClick(scope.row, 'edit')"></i>
                        </el-tooltip>
                        <el-tooltip effect="dark" :content="$t('content.tags.scbq')" placement="top"
                                    v-if="!scope.row.bindDatasetCount">
                            <i class="el-icon-delete" @click="handleClick(scope.row, 'delete')"></i>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :title="$t(`content.tags.${dialogType === 'created' ? 'x': 'b'}jbq`)"
                   :close-on-click-modal="false"
                   width="450px"
                   :visible.sync="dialogVisible">
            <el-form :inline="true" :model="form" status-icon :rules="rules" ref="ruleForm">
                <el-form-item v-if="dialogType === 'created'"
                              :label="$t('content.personal.bqmc')"
                              label-width="100px"
                              prop="name"> <!--标签名称-->
                    <el-input v-model="form.name"
                              :placeholder="$t('content.import.placeholder.qsr')"
                              auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item v-else :label="$t('content.personal.bqmc')" label-width="100px" prop="name"> <!--标签名称-->
                    {{currentRow.name}}
                </el-form-item>

                <el-form-item :label="$t('content.personal.mqms')" label-width="100px" prop="desc"> <!--标签描述-->
                    <el-input v-model="form.desc"
                              type="textarea"
                              :placeholder="$t('content.import.placeholder.qsr')"
                              auto-complete="off"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button
                        @click="dialogVisible = false">
                    {{$t('content.common.qx')}}
                </el-button>
                <el-button type="primary" :loading="btnLoading" @click="submitForm('ruleForm')">
                    {{$t('content.common.qd')}}
                </el-button>
            </div>
        </el-dialog>

        <div class="tablePages">
            <el-pagination background
                           layout="total, prev, pager, next"
                           @current-change="handleCurrentChange"
                           :current-page="currentPage"
                           :page-size="rows"
                           :total="totalRows"
                           v-if="totalRows > rows">
            </el-pagination>
        </div>


        <!--删除确认弹出框-->
        <el-dialog :title="$t('content.common.tis')"
                   :close-on-click-modal="false"
                   width="400px"
                   :visible.sync="deleteConfirmDialog">
            <div class="del-content">
                {{$t('content.personal.a29', [currentRow.name])}}?
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="deleteConfirmDialog = false">
                    {{$t('content.common.qx')}}
                </el-button>
                <el-button type="primary" :loading="btnLoading" @click="deleteConfirm">
                    {{$t('content.common.qd')}}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {textFieldLength} from '@/config/env';
    import {FormatTime, SortTable} from 'mixins/common';
    import Search from './chiildren/Search';
    import {
        createTag,
        getTagList,
        deleteTag
    } from '@/service/getData';

    export default {
        mixins: [FormatTime, SortTable],
        components: {
            Search
        },
        data () {
            return {
                dialogType: 'created',
                dialogVisible: false,
                deleteConfirmDialog: false,
                btnLoading: false,
                loading: true,
                tableData: [],
                rows: 10, //每页数量
                order: '', //排序字段
                sort: '',   //asc或desc
                currentPage: 1,   //当前页
                totalRows: 0,     //总记录数
                totalPages: 0,    //总页数
                form: {
                    name: '',
                    desc: ''
                },
                rules: {
                    name: [
                        {required: true, message: '请输入标签名称', trigger: 'blur'},
                        {
                            min: 1,
                            max: textFieldLength.normal,
                            message: `长度在1到${textFieldLength.normal}个字符`,
                            trigger: 'blur'
                        }
                    ],
                    desc: [
                        {required: true, message: '请输入标签描述', trigger: 'blur'},
                        {
                            min: 1,
                            max: textFieldLength.large,
                            message: `长度在1到${textFieldLength.large}个字符`,
                            trigger: 'blur'
                        }
                    ]
                },
                currentRow: {},
                keyword: ''
            };
        },
        watch: {
            deleteConfirmDialog: function (newVal, oldVal) {
                if (!newVal) {  //关闭弹窗的时候
                    this.resetData();
                }
            },
            dialogVisible: function (newVal) {
                if (!newVal) {
                    this.resetData();
                    this.$refs['ruleForm'].resetFields();   //重置表单
                }
            }
        },
        created () {
            this.fetchData();
        },
        methods: {
            searchList (keyword) {
                this.keyword = keyword;
                this.$refs.elTable.clearSort();  //清空排序
                this.$refs.elTable.sort('name', 'descending');   //设置默认排序
                this.fetchData();
            },
            handleCurrentChange (val) {
                this.currentPage = val;
                this.fetchData();
            },
            deleteConfirm () {
                this.btnLoading = true;
                deleteTag(this.currentRow.id).then(res => {
                    const {statusCode} = res.data;

                    this.btnLoading = false;
                    if (statusCode === 200) {
                        this.btnLoading = false;
                        this.deleteConfirmDialog = false;
                        this.$message({
                            message: '删除标签成功',
                            type: 'success'
                        });
                        this.fetchData();
                    }
                });
            },
            handleClick (row, type) {
                this.currentRow = row;
                this.form = {
                    name: row.name,
                    desc: row.desc
                };
                this.deleteConfirmDialog = type === 'delete';
                this.dialogVisible = type === 'edit';
                this.dialogType = type;
            },
            resetData () {
                this.form = {
                    name: '',
                    desc: ''
                };
                this.currentRow = {};
                this.dialogType = 'created';
                this.currentPage = 1;
            },
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const {name, desc} = this.form;
                        const {dialogType} = this;

                        this.btnLoading = true;
                        if (dialogType === 'edit' && desc === this.currentRow.desc) { //编辑的时候,描述值没有改动过
                            this.dialogVisible = false;
                            this.btnLoading = false;
                        } else {
                            createTag(dialogType === 'edit' ? this.currentRow.id : null, name, desc).then(res => {
                                const {statusCode} = res.data;

                                this.btnLoading = false;
                                if (statusCode === 200) {
                                    this.$message({
                                        message: this.$t(`content.personal.a${dialogType === 'edit' ? '30' : '31'}`),
                                        type: 'success'
                                    });
                                    this.dialogVisible = false;
                                    this.btnLoading = false;
                                    this.currentPage = 1;
                                    this.fetchData();
                                }
                            });
                        }
                    } else {
                        return false;
                    }
                });
            },
            fetchData () {
                const {rows, currentPage: page, order, sort, keyword} = this;
                this.loading = true;
                getTagList({
                    rows,
                    page,
                    order,
                    sort,
                    name: keyword
                }).then(res => {
                    const {statusCode, message} = res.data;
                    this.loading = false;
                    if (statusCode === 200) {
                        const {records, currentPage, totalPages, totalRows} = message;
                        this.tableData = records;
                        this.totalPages = totalPages;
                        this.totalRows = totalRows;
                    }
                });
            }
        }
    };
</script>

<style scoped lang="less">
    .table-title__btns {
        display: flex;
        .el-input-group {
            width: 370px;
        }
        > .el-button {
            margin-right: 20px;
            height: 30px;
        }
    }
    .el-form-item {
        margin-bottom: 22px;
        .el-input,
        .el-textarea {
            width: 220px;
        }
    }
</style>
