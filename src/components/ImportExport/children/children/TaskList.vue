<template>
    <div id="task-list" class="pane" :style="{ flexGrow: 1 }">
        <div class="sub-nav">
            <ul>
                <li>{{$t('content.dataset.importExport.drdc')}}<span class="split-line">/</span></li>
                <li>{{$t('content.dataset.importExport.ysjzddr')}}<span class="split-line">/</span></li>
                <li>{{$t('content.dataset.importExport.ysjcj')}}<!--元信息采集--><span class="split-line">/</span></li>
                <li>
                    {{$t(`content.importExport.${currentTab.title}`)}}
                </li>
            </ul>
        </div>
        <div class="main">
            <ul class="tab-box clearfix">
                <li :class="{active: currentTab.value === 1}" @click="toggleTab(1)">
                    <span>{{$t('content.importExport.rwgl')}}</span>
                </li>
                <li :class="{active: currentTab.value === 2}" @click="toggleTab(2)">
                    <span>{{$t('content.importExport.ysjy')}}</span>
                </li>
            </ul>
            <div class="tableMulti">
                <div class="table-title">
                    <div class="table-title__text">
                        <span>{{$t('content.dataset.importExport.rwlb')}}</span>
                    </div>
                    <div class="search-wrapper">
                        <Search :keyword.sync='keyword'
                                class="search"
                                :placeholder=" `content.dataset.importExport.${currentTab.value === 1 ? 'qsrrwmc' : 'qsrsjymc'}` "
                                @handleSearch="keywordSearch"></Search>
                        <router-link class="task-btn" :to="{name: 'CreateTask'}" v-if="currentTab.value === 1">
                            <el-button type="primary">
                                {{$t('content.dataset.importExport.xjrw')}}
                            </el-button>
                        </router-link>
                    </div>
                </div>
            </div>
            <el-table :data="tableData"
                      ref="table1"
                      border
                      v-show="currentTab.value === 1"
                      :default-sort="{prop: 'createDate', order: 'ascending'}"
                      @sort-change="sortTable"
                      v-loading="loading">
                <el-table-column prop="taskName" :label="$t('content.dataset.import.rwmc')" sortable="custom">
                    <template slot-scope="scope">
                        <span v-html="emphasizeName(scope.row.taskName, keyword)"></span>
                    </template>
                </el-table-column>
                <el-table-column prop="dataSourceName"
                                 sortable="custom"
                                 :label="$t('content.import.sjy')"></el-table-column><!--数据源-->
                <el-table-column prop="interval" :label="$t('content.import.ddlx')" width="250px"><!--调试类型-->
                    <template slot-scope="scope">
                        <span v-if="scope.row.interval === 'O' ">
                             {{$t('content.import.yc', [formatTime(scope.row.effectiveBeginTime * 1000)])}}
                        </span>
                        <span v-if="scope.row.interval === 'H' ">
                            {{$t('content.import.mxs')}}
                        </span>
                        <span v-if="scope.row.interval === 'D' ">
                            {{$t('content.import.mt', [getHours(scope.row.scheduleTime)])}}
                        </span>
                        <span v-if="scope.row.interval === 'W' ">
                              {{$t(`content.import.mz${scope.row.dayOfWeek}`, [getHours(scope.row.scheduleTime)])}}
                        </span>
                        <span v-if="scope.row.interval === 'M' ">
                            <template v-if="scope.row.dayOfMonth === 32">
                                 {{$t(`content.import.myzhyc`, [getHours(scope.row.scheduleTime)])}}
                            </template>
                            <template v-else>
                                {{$t(`content.import.my`, [$store.state.language === 'zh' ? scope.row.dayOfMonth : dayMap(scope.row.dayOfMonth), getHours(scope.row.scheduleTime)])}}
                            </template>
                        </span>
                        <span v-if="scope.row.interval === 'Y' ">
                            <template v-if="scope.row.dayOfMonth === 32">
                                {{$t(`content.import.mnzhyc`, [$store.state.language === 'zh' ? scope.row.monthOfYear : monthMap(scope.row.monthOfYear),getHours(scope.row.scheduleTime)])}}
                            </template>
                            <template v-else>
                                {{$t(`content.import.mn`, [$store.state.language === 'zh' ? scope.row.monthOfYear : monthMap(scope.row.monthOfYear),
                                   $store.state.language === 'zh' ? scope.row.dayOfMonth : dayMap(scope.row.dayOfMonth), getHours(scope.row.scheduleTime)])}}
                            </template>
                        </span>
                    </template>
                </el-table-column>


                <el-table-column prop="status"
                                 :label="$t('content.import.rwzt')"
                                 sortable="custom">
                    <template slot-scope="scope">
                        {{scope.row.status ? $t(`content.import.${scope.row.status}`) : ''}}
                    </template>
                </el-table-column>
                <el-table-column prop="creator" :label="$t('content.dataset.importExport.cjr')"
                                 sortable="custom"></el-table-column>
                <el-table-column prop="createDate" :label="$t('content.dataset.businessDetail.cjsj')" sortable="custom">
                    <template slot-scope="scope">
                        {{formatTime(scope.row.createDate * 1000)}}
                    </template>
                </el-table-column>
                <el-table-column :label="$t('content.dataset.importExport.xczxsj')">
                    <template slot-scope="scope">
                        <div v-if="scope.row.isActive === 'Y'"
                             v-ellipsis="formatTime(scope.row.nextRun*1000)"></div>
                        <span v-else>{{scope.row.interval === 'O' ? $t(`content.import.dcrw`) : ''}}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="taskDesc" :label="$t('content.dataset.importExport.rwms')"></el-table-column>
                <el-table-column :label="$t('content.dataset.datasetDetail.cz')">
                    <template slot-scope="scope">
                        <el-row>
                            <el-col :span="6">
                                <span :class="{'glyphicon-pause': scope.row.isActive === 'Y'}"
                                      @click="setting(scope.row)"
                                      :title="$t(`content.dataset.importExport.${ scope.row.isActive === 'Y' ? 'tingy' : 'qy'}`)"
                                      class="glyphicon glyphicon-play"></span>
                            </el-col>
                            <el-col :span="6">
                                <!--历史记录-->
                                <router-link class="glyphicon glyphicon-time"
                                             :title="$t(`content.import.lsjl`)"
                                             :to="{name: 'HistoryList', params: { id: scope.row.id }}">
                                </router-link>
                            </el-col>
                            <template v-if="scope.row.status !== 'REQUESTED' && scope.row.status !== 'STARTED'">
                                <el-col :span="6">
                                    <!--编辑-->
                                    <router-link class="glyphicon glyphicon-pencil"
                                                 :title="$t(`content.common.bj`)"
                                                 :to="{name: 'CreateTask', params: { id: scope.row.id }}">
                                    </router-link>
                                </el-col>
                                <el-col :span="6" v-if="scope.row.dataSourceType !== 'HDFS' ">
                                    <!--新增数据导入-->
                                    <router-link class="glyphicon glyphicon-plus"
                                                 :title="$t(`content.import.xzsjdr`)"
                                                 :to="{name: 'InsertData', params: { id: scope.row.refId },
                                                 query: { name: scope.row.taskName }
                                                 }">
                                    </router-link>
                                </el-col>
                            </template>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
            <el-table :data="tableData"
                      ref="table2"
                      border
                      v-show="currentTab.value === 2"
                      :default-sort="{prop: 'createDate', order: 'ascending'}"
                      @sort-change="sortTable"
                      v-loading="loading">
                <el-table-column prop="businessName"
                                 width="150"
                                 :label="$t('content.import.sjymc')"
                                 sortable="custom">
                    <template slot-scope="scope">
                        <span v-html="emphasizeName(scope.row.businessName, keyword)"></span>
                    </template>
                </el-table-column>
                <el-table-column prop="dataSourceType" :label="$t('content.import.sjylx')" width="150"
                                 sortable="custom"></el-table-column>
                <el-table-column prop="url" :label="$t('content.importExport.ljdz')"
                                 sortable="custom"></el-table-column>
                <el-table-column prop="createDate" :label="$t('content.dataset.businessDetail.cjsj')" sortable="custom">
                    <template slot-scope="scope">
                        {{formatTime(scope.row.createDate * 1000)}}
                    </template>
                </el-table-column>
                <el-table-column prop="creator" :label="$t('content.dataset.importExport.cjr')"
                                 sortable="custom"></el-table-column>
                <el-table-column :label="$t('content.common.cz')" width="150">
                    <template slot-scope="scope">
                        <!--查看源配置-->
                        <span class="glyphicon glyphicon-eye-open"
                              :title="$t(`content.import.ckypz`)"
                              @click="viewSetting(scope.row)"></span>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background
                           layout="total, prev, pager, next"
                           @current-change="handleCurrentChange"
                           :current-page="currentPage"
                           :total="totalRows">
            </el-pagination>
            <!-- 确认框 -->
            <el-dialog :title="$t('content.common.tis')"
                       :visible.sync="confirmDialogVisible"
                       :close-on-click-modal="false"
                       width="400px"
                       @click.native.stop>
                <span>{{confirmMessage}}?</span>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="confirmDialogVisible = false">
                        {{$t('content.common.qx')}}
                    </el-button>
                    <el-button type="primary" @click="operatePost" :loading="btnLoading">
                        {{$t('content.common.qd')}}
                    </el-button>
                </div>
            </el-dialog>
            <!-- 数据源详情 -->
            <el-dialog :title=" $t(`content.importExport.yxq`, [currentRow.businessName]) "
                       :visible.sync="sourceDialog"
                       :close-on-click-modal="false"
                       width="500px"
                       @click.native.stop>
                <el-form ref="table-form" label-width="180px">
                    <el-form-item :label="$t('content.import.sjymc')">
                        <span>{{currentRow.businessName}}</span>
                    </el-form-item>
                    <el-form-item :label="$t('content.dataset.importExport.sjyms')">
                        <span>{{currentRow.dataSourceDesc}}</span>
                    </el-form-item>
                    <el-form-item :label="$t('content.dataset.importExport.ipdz')">
                        <span class="txt-inline" v-if="isRelationalDatabase">{{currentRow.ipAddress}}</span>
                        <template v-else>
                            <span class="txt-inline" v-for="ip in ipGroup">
                                {{ip}}
                            </span>
                        </template>
                    </el-form-item>
                    <template v-if="isRelationalDatabase">
                        <el-form-item :label="$t('content.import.dkh')">
                            <span>{{currentRow.port}}</span>
                        </el-form-item>
                        <el-form-item :label="$t('content.import.yhm')">
                            <span>{{currentRow.username}}</span>
                        </el-form-item>
                        <el-form-item :label="$t('content.import.mm')">
                            <span>{{currentRow.password}}</span>
                        </el-form-item>
                    </template>

                    <el-form-item :label="$t('content.dataset.datasetDetail.km')"
                                  v-if=" currentRow.dataSourceType === 'HIVE' ">
                        <span>{{currentRow.databaseName}}</span>
                    </el-form-item>

                    <el-form-item :label="$t('content.import.slm')" v-if=" currentRow.dataSourceType === 'ORACLE' ">
                        <span>{{currentRow.instanceName}}</span>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import Search from '@/components/MetaData/Personal/chiildren/Search';
    import {FormatTime, Message, SortTable, EmphasizeName} from 'mixins/common';
    import {getTaskList, getDataSourceList, updateTask} from '@/service/getData';

    export default {
        name: 'TaskList',
        data() {
            return {
                rows: 10, //每页数量
                order: 'desc',  //asc或desc
                sort: 'createDate',  //排序字段
                currentPage: 1,   //当前页
                totalRows: 0,     //总记录数
                totalPages: 0,    //总页数
                loading: false,
                keyword: '',
                tableData: [],
                searchKey: '',
                confirmDialogVisible: false,
                confirmMessage: '',
                btnLoading: false,
                sourceDialog: false,
                currentRow: {},
                currentTab: {
                    title: 'rwgl',
                    value: 1     //1是任务管理,2是元数据源
                },
                defaultSort: {
                    prop: 'createDate',
                    order: 'ascending'
                },
                month: {
                    '1': '1st',
                    '2': '2nd',
                    '3': '3rd'
                }
            };
        },
        mixins: [FormatTime, Message, SortTable, EmphasizeName],
        components: {
            Search
        },
        computed: {
            isRelationalDatabase() {   //HIVE,MYSQL,ORACLE
                const {dataSourceType} = this.currentRow;
                return dataSourceType && dataSourceType !== 'HDFS' && dataSourceType !== 'HBASE';
            },
            ipGroup() {
                const {ipAddress} = this.currentRow;
                if (ipAddress) {
                    return ipAddress.split(',');
                } else {
                    return [];
                }
            }
        },
        methods: {
            dayMap(str) {
                switch (str) {
                    case '1':
                        return '1st';
                    case '2':
                        return '2nd';
                    case '3':
                        return '3rd';
                    case '21':
                        return '21st';
                    case '22':
                        return '22nd';
                    case '23':
                        return '23rd';
                    case '31':
                        return '31st';
                    default:
                        return `${str}th`;
                }
            },
            monthMap(month) {
                switch (month) {
                    case 1:
                        return 'Jan';
                    case 2:
                        return 'Feb';
                    case 3:
                        return 'Mar';
                    case 4:
                        return 'Apr';
                    case 5:
                        return 'May';
                    case 6:
                        return 'Jun';
                    case 7:
                        return 'Jul';
                    case 8:
                        return 'Aug';
                    case 9:
                        return 'Sep';
                    case 10:
                        return 'Oct';
                    case 11:
                        return 'Nov';
                    case 12:
                        return 'Dec';
                }
            },
            resetData() {
                this.currentPage = 1;
                this.keyword = '';
            },
            viewSetting(row) {
                this.currentRow = row;
                this.sourceDialog = true;
            },
            getHours(timestamp) {
                return this.formatTime(Number(timestamp), 'time').substr(0, 5);
            },
            toggleTab(tab) {
                if (!this.loading) {
                    if (tab !== this.currentTab.value) {
                        this.currentTab = {
                            value: tab,
                            title: tab === 1 ? 'rwgl' : 'ysjy'
                        };
                        this.$emit('update:title', tab === 1 ? 'rwgl' : 'ysjy');
                        this.resetData();
                        this.$refs.table1.clearSort();
                        this.$refs.table2.clearSort();
                        if (tab === 1) {
                            this.$refs.table1.sort('createDate', 'ascending');
                        } else {
                            this.$refs.table2.sort('createDate', 'descending');
                        }
                    }
                }
            },
            modifyTask(id) {
                this.$router.push({name: 'Configuration', params: {id}});
            },
            setting(row) {
                this.currentRow = row;
                this.confirmMessage = this.$t(`content.dataset.importExport.qd${row.isActive === "N" ? 'qy' : 'ty'}`);
                this.confirmDialogVisible = true;
            },
            operatePost() {
                const {isActive, id} = this.currentRow;
                this.btnLoading = true;
                updateTask(id, isActive === "N" ? 'Y' : 'N').then(res => {
                    const {statusCode, message} = res.data;
                    if (statusCode === 200) {
                        this.$message({
                            message: this.$t(`content.dataset.importExport.${isActive === "N" ? 'qycg' : 'tycg'}`),
                            type: 'success'
                        });
                        this.confirmDialogVisible = false;
                        this.fetchData();
                    }
                    this.btnLoading = false;
                }).catch(() => {
                    this.btnLoading = false;
                });
            },
            createTask() {
                this.$emit('update:title', '创建采集任务');
                this.$emit('update:type', 'Creation');
            },
            keywordSearch() {
                this.currentPage = 1;
                this.fetchData();
            },
            fetchData() {
                if (!this.loading) {   //防止重置请求
                    const {rows, currentPage: page, order, sort, currentTab, keyword} = this;
                    let params = {
                        rows,
                        page,
                        order,
                        sort
                    };
                    let fn = null;
                    this.loading = true;
                    if (currentTab.value === 1) {
                        fn = getTaskList;
                        params.taskName = keyword;
                    } else {
                        fn = getDataSourceList;
                        params.businessName = keyword;
                    }
                    fn(params).then(res => {
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
    #task-list {
        height: 100%;
        &.pane {
            .tabs {
                margin: 0 -15px;
            }
        }
        .search-wrapper {
            display: flex;
            align-items: center;
            .search {
                width: 300px;
            }
            .task-btn {
                margin-left: 30px;
            }
        }
        .glyphicon {
            font-size: 14px;
            cursor: pointer;
            color: #606266;
            &:hover {
                text-decoration: none;
                color: #014B70;
            }
        }
        .txt-inline {
            word-break: break-word;
        }
        .el-row {
            margin-bottom: 0;
            .glyphicon-play {
                color: #00E5B8;
                &:hover {
                    color: #FF4800;
                }
            }
            .glyphicon-pause {
                color: #F0D50C;
                &:hover {
                    color: #189E50;
                }
            }
        }
    }
</style>
