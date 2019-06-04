<template>
    <div class="database-detail" v-loading="loading">
        <div class="table-title">
            <div class="table-title__text">
                <span>{{title}}</span>
                <span class="tit-detail">
							(
							<span v-for="item in tableInfo" v-if="item[1] || item[1] == 0">
								{{item[0]}}:
								<span class="subTitContent">{{item[1]}}</span>
								<span class="division-flag">;&nbsp;</span>
							</span>
							)
						</span>
            </div>
        </div>
        <el-table :data="databaseList.records"
                  border
                  @sort-change="sortTable"
                  :default-sort="{prop:'datasetName',order: 'ascending'}">
            <el-table-column prop="datasetName"
                             sortable="custom"
                             :label="$t('content.dataset.businessDetail.biaom')">
                <template slot-scope="scope">
                    <item-jump :params="{
                                          params:{
                                              id: scope.row.id,
                                              path:`${isActive.path}/${scope.row.datasetName}`,
                                          },
                                          isfolder:false
                                      }"
                               :name="scope.row.datasetName"
                               :view="false"
                               :datasetId="scope.row.id">
                    </item-jump>
                </template>
            </el-table-column>
            <el-table-column prop="description" :label="$t('content.dataset.datasetDetail.bms')">
            </el-table-column>
            <el-table-column prop="owner" :label="$t('content.dataset.datasetDetail.sjfzr')">
            </el-table-column>
            <el-table-column sortable="custom"
                             prop="createdTime"
                             :label="$t('content.dataset.datasetDetail.cjsj')"
                             :formatter="_formatTime">
            </el-table-column>
            <el-table-column prop="lastModifyTime"
                             sortable="custom"
                             :render-header="renderHeader"
                             :label="$t('content.dataset.businessDetail.zhsjsj')"
                             :formatter="_formatTime">
            </el-table-column>
            <el-table-column v-if="tableType !== 'Hbase'"
                             sortable="custom"
                             prop="size"
                             :label="$t('content.dataset.datasetDetail.dx')">
                <template slot-scope="scope">
                    {{formatSize(scope.row.size)}}
                </template>
            </el-table-column>
            <el-table-column v-if="tableType !== 'Hbase'"
                             prop="change_size"
                             :label="$t('content.dataset.datasetDetail.mrbh')"
                             :formatter="_formatSize">
            </el-table-column>
            <el-table-column :label="$t('content.dataset.datasetDetail.cz')">
                <template slot-scope="scope">
                    <div class="personal-control">
                        <i class="icon iconfont icon-chakanxiangqing icon-s"
                           @click="setDialogShow(scope.row.id)"
                           :title="$t('content.common.ckgd')"></i>
                        <template v-if="$route.query.path && $route.query.path.includes('LEAP-Hive')">
                            <i v-if="scope.row.status==0"
                               class="database-sql-button"
                               :title="$t('content.dataset.datasetDetail.ljsql')"
                               @click="linkToSQL(title, scope.row.datasetName, scope.row.id)">SQL</i>
                            <i v-else class="database-sql-button" style="background: #EEE;">SQL</i>
                        </template>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="tablePages" v-if="databaseList.totalRows !== 0">
            <el-pagination background
                           layout="total, prev, pager, next"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="databaseList.currentPage"
                           :page-size="databaseList.pageSize"
                           :total="databaseList.totalRows"
                           v-if="databaseList.totalRows>databaseList.pageSize">
            </el-pagination>
        </div>
        <el-dialog
                :title="$t('content.common.xq')"
                :visible.sync="dialogVisible"
                :close-on-click-modal="false"
                width="780px"
                custom-class="dialogComment">
            <div class="date-picker-container" style="display: flex;">
                <span>{{$t('content.dataset.datasetDetail.xzsj')}}</span>
                <el-date-picker
                        v-model="dateRange"
                        type="daterange"
                        :range-separator="$t('content.common.to')"
                        :start-placeholder="$t('content.dataset.datasetDetail.ksrq')"
                        :end-placeholder="$t('content.dataset.datasetDetail.jsrq')">
                </el-date-picker>
            </div>
            <div class="chart-container">
                <highcharts
                        v-if="chartMessage.length>0"
                        :options="createdTableOptions"></highcharts>
                <no-data v-else></no-data>
            </div>
        </el-dialog>
        <el-dialog
                :title="$t('content.common.tis')"
                :visible.sync="warnDialogVisible"
                :close-on-click-modal="false">
            {{$t('content.dataset.datasetDetail.save')}}
        </el-dialog>
    </div>
</template>
<script>
    import {
        Message,
        FormatTime,
        FormatSize,
        FormatLifeDay,
        EmphasizeName,
        SortTable,
        _FormatSize,
        _FormatTime
    } from 'mixins/common';
    import ItemJump from 'common/ItemJump';
    import {mapState} from 'vuex';

    export default {
        name: "DatabaseDetail",
        mixins: [Message, FormatTime, FormatSize, FormatLifeDay, EmphasizeName, SortTable, _FormatSize, _FormatTime],
        components: {
            ItemJump
            // item,
            // DatePicker,
        },
        data() {
            return {
                warnDialogVisible: false,
                dateRange: null,
                databaseList: {
                    records: [],
                    totalRows: 0
                },
                sort: "datasetName",
                order: "asc",
                loading: true,
                dialogVisible: false,
                createdTableOptions: {},
                chartMessage: [],
                begin_date: '',
                end_date: '',
                categories: new Set(),
                series: new Set(),
                datasetId: '',
                isClear: true,
                messageObj: {},
                records: [],
                totalRows: 0,
                linkDatabase: '',
                linkTable: '',
                proxyUser: '',
                linkData: '',
                queryKey: ''
            };
        },
        computed: {
            ...mapState({
                tableTypeOpts: 'tableTypeOpts'
            }),
            isActive() {
                return this.$store.state.treeItemActive;
            },
            title() {
                return this.$route.query.title;
            },
            path() {
                return this.$route.query.path;
            },
            tableInfo() {
                let tableInfo = new Map();
                tableInfo.set(this.$t('content.dataset.datasetDetail.scxm'), this.messageObj.name);
                tableInfo.set(this.$t('content.dataset.datasetDetail.xmgly'), this.messageObj.manager);
                tableInfo.set(this.$t('content.dataset.datasetDetail.bzs'), this.databaseList.totalRows + ', ' + this.$t('content.dataset.datasetDetail.qzbysc', [this.messageObj.deletedCount]));
                tableInfo.set(this.$t('content.dataset.datasetDetail.syzccdx'), this.formatSize(this.messageObj.total_size));
                return [...tableInfo];
            },
            tableType() {
                return this.databaseList.records.length && this.databaseList.records[0].datasetType;
            }
        },
        created() {
            this.fetchAll();
        },
        mounted() {
            this.$watch('dialogVisible', (val) => {
                this.dateRange = [];
            });
        },
        watch: {
            dateRange(val) {
                val = val ? val.map(date => Number(new Date(date))) : ['', ''];
                this.dialogVisible && this.fectchDate(val);
            },
            '$route': function (val) {
                if (val.query.path) {
                    this.fetchAll();
                }
            }
        },
        methods: {
            renderHeader: function (h, {column}) {
                //todo 翻译:  已有的图     数据或表结构更新
                const title = column.property === 'change_size' ? this.$t('content.dataset.businessDetail.yydt') : this.$t('content.dataset.businessDetail.sjhbjggx');
                return (<span>
                    {column.label}
                    <i class="el-icon-question" title={title} v-tippy/>
                </span>);
            },
            sortTest(params) {
                console.log(params);
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
            linkToSQL(database, table, tableId) {
                this.openInNewTab("about:blank"); //先打开新窗口
                this.axios.get(`/datasets/${tableId}/privilege`)
                        .then(res => {
                            if (res.body.statusCode === 200) {
                                const {_lpt_, proxyUser} = res.body.message;
                                //判断无权访问sql
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
            setDialogShow(id) {
                this.datasetId = id;
                this.dialogVisible = true;
            },
            fetchAll(val = 1) {
                this.fetchData(val);
                this.$nextTick(() => {
                    this.fetchTopInfo();
                });
            },
            async fetchTopInfo() {
                let {refId, title} = this.$route.query;
                if (refId) {
                    let url = '';
                    if (this.tableTypeOpts == '0,1,2') {
                        url = `/datasets/getDatasetCount/${refId}/${title}`;
                    } else {
                        url = `/datasets/getDatasetCount/${refId}/${title}?status=${this.tableTypeOpts}`;
                    }
                    let res = await this.axios.get(url);
                    let {message, statusCode} = res.body;
                    this.messageObj = statusCode == 200 ? message : {};
                }
            },
            fectchDate(arr) {
                let [begin_date, end_date] = arr ? arr : ['', ''];
                Object.assign(this.$data, {begin_date, end_date});
                this.showChart();
            },
            fetchData(page = 1) {
                this.loading = true;
                if (this.path) {
                    let _url = "";

                    if (this.sort) {
                        _url = `/datasets/${this.path}?sort=${this.sort}&order=${this.order}&rows=10&page=${page}`;
                    } else {
                        _url = `/datasets/${this.path}?rows=10&page=${page}&sort=datasetName&order=asc`;
                    }

                    if (this.tableTypeOpts != '0,1,2') {
                        _url += `&status=${this.tableTypeOpts}`;
                    }
                    this.axios.get(_url).then(res => {
                        this.loading = false;
                        if (res.body.statusCode == 200) {
                            this.totalRows = res.body.totalRows;
                            this.databaseList = res.body.message;
                        } else {
                            this.records = [];
                        }
                    });
                }
            },
            tableSort({sort, order}) {
                this.sort = sort;
                this.order = order;
                this.fetchAll();
            },
            async showChart() {
                let _url = this.begin_date ? `/datasets/getDatasetChangeDetail?dataset_id=${this.datasetId}&begin_date=${this.begin_date / 1000}&end_date=${this.end_date / 1000}` : `/datasets/getDatasetChangeDetail?dataset_id=${this.datasetId}`;
                const res = await this.axios.get(_url);
                const {statusCode} = res.body;
                statusCode == 200 ? this.chartMessage = res.body.message : [];
                this.resolveData();
            },
            resolveData() {
                const vm = this;
                this.categories.clear();
                this.series.clear();
                let itemSeries = {name: this.$t('content.dataset.datasetDetail.xzb'), data: []};
                for (let [index, item] of this.chartMessage.entries()) {
                    this.categories.add(item.create_date);
                    this.activeChart == 'createdTable' ? itemSeries.data.push(item.change_num) : itemSeries.data.push(item.change_size);
                }
                this.series.add(itemSeries);

                this.createdTableOptions = {
                    chart: {
                        height: 300,
                        type: 'line'
                    },
                    title: {
                        text: this.$t('content.dataset.datasetDetail.bsjxzxq'),
                        style: {
                            fontSize: '14px'
                        }
                    },
                    xAxis: {
                        title: {
                            text: this.$t('content.source.sj'),
                            align: 'high'
                        },
                        categories: [...this.categories]
                    },
                    yAxis: {
                        title: {
                            text: this.$t('content.dataset.datasetDetail.dx'),
                            align: 'high',
                            rotation: 0
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }],
                        lineWidth: 1,
                        lineColor: '#D6D9DC',
                        labels: {
                            formatter() {
                                return vm.formatSize(this.value);
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: '#AB9FFF',
                        borderColor: '#AB9FFF',
                        borderRadius: 0,
                        style: {
                            color: '#FFF'
                        },
                        pointFormatter() {
                            return `<div>\
                                    ${vm.$t('content.dataset.datasetDetail.bsjxz')}: ${vm.formatSize(this.y)}
							         </div>`;
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    },
                    series: [...this.series]
                };
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.fetchAll(val);
                console.log(`当前页: ${val}`);
            }
        }
    };
</script>
<style lang="less">
    .database-detail {
        padding: 20px;
        height: 100%;
        .database-sql-button {
            font-size: 12px;
            display: inline-block;
            background: #014B70;
            color: #FFF;
            line-height: 20px;
            padding: 0 5px;
            border-radius: 4px;
            cursor: pointer;
            font-style: normal;
        }
        .tableList .icon-chakanxiangqing {
            font-size: 18px;
        }
        .tableList i {
            vertical-align: middle;
        }
    }
</style>
