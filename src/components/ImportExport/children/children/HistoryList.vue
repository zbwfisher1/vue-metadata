<template>
    <div id="task-history-list" class="pane" :style="{ flexGrow: 1 }">
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
                <li>{{$t('content.importExport.rwgl')}}<!--任务管理--><span class="split-line">/</span></li>
                <li>{{$t('content.dataset.importExport.rwjl')}}<!--任务记录--></li>
            </ul>
        </div>
        <div class="main">
            <div class="tableMulti">
                <div class="table-title">
                    <div class="table-title__text">
                        <span>{{$t('content.dataset.importExport.rwlb')}}</span>
                    </div>
                    <div class="search-wrapper">
                        <el-date-picker v-model="dateRange"
                                        type="daterange"
                                        @change="fetchData"
                                        :range-separator="$t('content.common.to')"
                                        :start-placeholder="$t('content.dataset.datasetDetail.ksrq')"
                                        :end-placeholder="$t('content.dataset.datasetDetail.jsrq')"></el-date-picker>
                    </div>
                </div>
            </div>
            <el-table :data="tableData"
                      border
                      :default-sort="{prop: 'startTime', order: 'descending'}"
                      @sort-change="sortTable"
                      v-loading="loading">
                <el-table-column :label="$t('content.dataset.import.rwmc')" prop="taskName">
                </el-table-column>
                <el-table-column prop="startTime" :label="$t('content.dataset.importExport.kssj')" sortable="custom">
                    <template slot-scope="scope">
                        {{formatTime(scope.row.startTime * 1000)}}
                    </template>
                </el-table-column>
                <el-table-column prop="endTime" :label="$t('content.dataset.importExport.jssj')" sortable="custom">
                    <template slot-scope="scope">
                        {{formatTime(scope.row.endTime * 1000)}}
                    </template>
                </el-table-column>
                <el-table-column prop="status"
                                 :label="$t('content.importExport.zxjg')"
                                 sortable="custom">
                    <template slot-scope="scope">
                        {{scope.row.status ? $t(`content.import.${scope.row.status}`) : ''}}
                    </template>
                </el-table-column>
                <el-table-column :label="$t('content.dataset.datasetDetail.cz')">
                    <template slot-scope="scope">
                        <i @click="showDialog(scope.row.message)"
                           :title="$t('content.dataset.importExport.ckrz')"
                           class="icon iconfont icon-chakanrizhi"></i>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background
                           layout="total, prev, pager, next"
                           @current-change="handleCurrentChange"
                           :current-page="currentPage"
                           :total="totalRows">
            </el-pagination>
            <el-dialog :visible.sync="dialogVisible"
                       width="70%"
                       :title="$t('content.dataset.importExport.rizhi')">
                <span class="log-message" v-html="log"></span>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible=false" type="primary">
                        {{$t('content.common.qd')}}
                    </el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import {FormatTime, SortTable} from 'mixins/common';
    import {getTaskLog} from '@/service/getData';

    export default {
        name: 'TaskList',
        data() {
            return {
                id: this.$route.params.id,
                rows: 10, //每页数量
                order: 'desc',  //asc或desc
                sort: 'createDate',  //排序字段
                currentPage: 1,   //当前页
                totalRows: 0,     //总记录数
                totalPages: 0,    //总页数
                dateRange: 0,
                loading: false,
                defaultSort: {
                    prop: 'createDate',
                    order: 'ascending'
                },
                tableData: [],
                dialogVisible: false,
                log: ''
            };
        },
        mixins: [FormatTime, SortTable],
        computed: {},
        methods: {
            showDialog(message) {
                this.dialogVisible = true;
                message = message.replace(/\r/g, "<br/>");
                message = message.replace(/\n/g, "<br/>");
                message = message.replace(/\r\n/g, "<br/>");
                this.log = message;
            },
            fetchData() {
                if (!this.loading) {   //防止重复请求
                    const {id, rows, currentPage: page, order, sort, currentTab, dateRange} = this;
                    const startTime = dateRange ? Number(new Date(this.dateRange[0])) : 0;
                    const endTime = dateRange ? Number(new Date(this.dateRange[1])) : 0;
                    let params = {
                        id,
                        rows,
                        page,
                        order,
                        sort,
                        startTime,
                        endTime
                    };
                    this.loading = true;
                    getTaskLog(params).then(res => {
                        this.loading = false;
                        const {statusCode, message} = res.data;
                        if (statusCode === 200) {
                            const {records, currentPage, totalPages, totalRows} = message;
                            this.tableData = records;
                            this.totalPages = totalPages;
                            this.totalRows = totalRows;
                        }
                    });
                }
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.fetchData();
            }
        }
    };
</script>
<style lang="less">
    #task-history-list {
        .log-message {
            word-break: break-word;
        }
    }
</style>
