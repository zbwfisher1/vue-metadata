<template>
    <div class="datasetDetail datasourceDetail" v-loading="loading">
        <div class="tabCon">
            <div class="boxCommon">
                <div class="table-title">
                    <div class="table-title__text">
                        <span>{{title}}</span>
                        <span class="tit-detail">
							(
							<span v-for="(item, index) in tableInfo">
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
                          :default-sort="{prop: 'databaseName', order: 'ascending'}"
                          @sort-change="sortTable">
                    <el-table-column prop="databaseName" :label="$t('content.dataset.datasetDetail.km')"
                                     sortable="custom">
                        <template slot-scope="scope">
                            <item-jump
                                    :params="{params:{path:`${isActive.path}/${scope.row.databaseName}`,level:3,title:scope.row.databaseName,},isfolder: true}"
                                    :name="scope.row.databaseName"
                                    :view="false">
                            </item-jump>
                        </template>
                    </el-table-column>
                    <el-table-column prop="projectName"
                                     sortable="custom"
                                     :label="$t('content.dataset.datasetDetail.scxm')"></el-table-column>
                    <el-table-column prop="manager"
                                     sortable="custom"
                                     :label="$t('content.dataset.datasetDetail.xmgly')"></el-table-column>
                    <el-table-column prop="tableCount"
                                     sortable="custom"
                                     :label="$t('content.dataset.datasetDetail.bzs')"></el-table-column>
                    <el-table-column v-if="dataSourceType !== 'Hbase'"
                                     prop="size"
                                     :label="$t('content.dataset.datasetDetail.ccdx')"
                                     sortable="custom">
                        <template slot-scope="scope">
                            {{formatSize(scope.row.size)}}
                        </template>
                    </el-table-column>
                    <el-table-column v-if="dataSourceType !== 'Hbase'"
                                     prop="change_size"
                                     :label="$t('content.dataset.datasetDetail.mrbh')"
                                     sortable="custom">
                        <template slot-scope="scope">
                            {{formatSize(scope.row.change_size)}}
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('content.dataset.datasetDetail.cz')">
                        <template slot-scope="scope">
                            <i class="icon iconfont icon-chakanxiangqing icon-s"
                               @click="setDialogShow(scope.row.databaseName)"
                               :title="$t('content.common.ckgd')"></i>
                            <i class="icon iconfont icon-shanchu3 icon-s"
                               @click="delBase({databaseName:scope.row.databaseName, refId: scope.row.refId, refIdType:scope.row.refIdType})"
                               v-if="scope.row.isSystemAdmin === 1"
                               :title="$t('content.common.sc')"></i>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="tablePages" v-if="databaseList.totalRows !== 0">
                    <el-pagination background
                                   layout="total, prev, pager, next"
                                   @current-change="handleCurrentChange"
                                   :current-page="databaseList.currentPage"
                                   :page-size="databaseList.pageSize"
                                   :total="databaseList.totalRows"
                                   v-if="databaseList.totalRows>databaseList.pageSize">
                    </el-pagination>
                </div>
            </div>
        </div>
        <el-dialog
                :title="$t('content.common.xq')"
                :visible.sync="dialogVisible"
                :close-on-click-modal="false"
                custom-class="dialogComment">
            <div class="chart-header">
                <el-tabs v-model="activeChart" type="card" @tab-click="resolveData">
                    <el-tab-pane :label="$t('content.dataset.datasetDetail.bxzsl')" name="createdTable"></el-tab-pane>
                    <el-tab-pane :label="$t('content.dataset.datasetDetail.xzccqk')"
                                 name="createdStorage"></el-tab-pane>
                </el-tabs>
                <div class="date-picker-container" style="display: flex;">
                    <span>{{$t('content.dataset.datasetDetail.xzsj')}}</span>
                    <el-date-picker
                            v-model="dateRange"
                            type="daterange"
                            :range-separator="$t('content.common.to')"
                            :start-placeholder="$t('content.dataset.datasetDetail.ksrq')"
                            :end-placeholder="$t('content.dataset.datasetDetail.jsrq')">
                    </el-date-picker>
                    <!-- <date-picker
						ref="datePicker"
						:direction="'right'"
						@fectchDate="fectchDate"></date-picker> -->
                </div>
            </div>
            <div class="chart-container" v-if="activeChart=='createdTable'">
                <!-- {{createdTableOptions}} -->
                <highcharts v-if="chartMessage.length>0" :options="createdTableOptions"></highcharts>
                <no-data v-else></no-data>
            </div>
            <div class="chart-container" v-else>
                <highcharts v-if="chartMessage.length>0" :options="createdStorageOptions"></highcharts>
                <no-data v-else></no-data>
            </div>
        </el-dialog>
        <!-- 删除确认框 -->
        <el-dialog
                :title="$t('content.common.tis')"
                :visible.sync="delDialogVisible"
                width="385px"
                :close-on-click-modal="false"
                @click.native.stop>
            <div class="del-content">
                {{$t('content.personal.qrsck')}} "{{databaseName}}"?
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button
                        @click="delDialogVisible = false">
                    {{$t('content.common.qx')}}
                </el-button>
                <el-button
                        type="primary" @click="delDatasetFetch()">
                    {{$t('content.common.qd')}}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {FormatSize, Message, SortTable} from 'mixins/common';
    import item from 'components/common/TableItemJump';
    import ItemJump from 'components/common/ItemJump';
    import Bus from 'utils/bus';
    import {mapState} from 'vuex';

    export default {
        mixins: [FormatSize, Message, SortTable],
        components: {
            item,
            ItemJump
        },
        data() {
            return {
                dateRange: null,
                delDialogVisible: false,
                databaseName: '',
                refId: '',
                refIdType: '',
                databaseList: {
                    records: []
                },
                loading: true,
                sort: "databaseName",
                order: "asc",
                dialogVisible: false,
                activeChart: 'createdTable',
                createdTableOptions: {},
                createdStorageOptions: {},
                chartMessage: [],
                categories: new Set(),
                series: new Set(),
                db_name: '',
                begin_date: '',
                end_date: '',
                isClear: false,
                messageTable: {
                    total_num: 0,
                    total_size: 0
                }
            };
        },
        computed: {
            ...mapState({
                tableTypeOpts: 'tableTypeOpts',
                isActive: 'treeItemActive'
            }),
            title() {
                return this.$route.query.title;
            },
            path() {
                return this.$route.query.path;
            },
            tableInfo() {
                let tableInfo = new Map();
                tableInfo.set(this.$t('content.dataset.datasetDetail.sjzs'), this.messageTable.total_num);
                tableInfo.set(this.$t('content.dataset.datasetDetail.sjkzdx'), this.formatSize(this.messageTable.total_size));
                return [...tableInfo];
            },
            dataSourceType() {
                return this.databaseList.records.length && this.databaseList.records[0].dataSourceType;
            }
        },
        created() {
            this.fetchAll();
        },
        mounted() {
            this.$watch('dialogVisible', val => {
                this.isClear = val ? true : false;
                this.activeChart = val ? this.activeChart : 'createdTable';
                this.dateRange = val ? [] : this.dateRange;
            });
        },
        watch: {
            dateRange(val) {
                val = val ? val.map(data => Number(new Date(data))) : ['', ''];
                this.fectchDate(val);
            },
            '$route': function(val) {
                if (val.query.path) {
                    this.fetchAll();
                }
            }
        },
        methods: {
            delBase(Params = {}) {
                Object.assign(this.$data, Params);
                this.delDialogVisible = true;
            },
            async delDatasetFetch() {
                this.delDialogVisible = false;
                const res = await this.axios.post(`/datasets/deleteDataset/${this.databaseName}/${this.refId}/${this.refIdType}`);
                const {statusCode} = res.body;
                if (statusCode == 200) {
                    this.message(`${this.$t('content.common.sccg')}!`, "success");
                    this.fetchData();
                    this.fetchTopInfo();
                    let open = this.$store.state.modelOpen;

                    var _p = this.path;

                    if (this.databaseList.totalRows == 1) {
                        _p = _p.substring(0, _p.lastIndexOf('/'));
                    }

                    Bus.$emit('refreshTree', {path: _p, datasetId: 0});
                } else {
                    this.message(`${this.$t('content.personal.scsb')}!`, "error");
                }
            },
            setDialogShow(db_name) {
                this.db_name = db_name;
                this.dialogVisible = true;
            },
            fetchAll(val = 1) {
                this.fetchData(val);
                this.fetchTopInfo();
            },
            async fetchTopInfo() {
                let ref_id = this.$route.query.refId;
                if (ref_id) {
                    let res = await this.axios.get(`/datasets/getDbCount/${ref_id}?status=${this.tableTypeOpts}`);
                    let {message, statusCode} = res.body;
                    this.messageTable = statusCode == 200 ? message : {};
                }

            },
            fetchData(page = 1) {
                if (this.path) {
                    this.loading = true;
                    const url = this.order ? `/datasets/${this.path}?sort=${this.sort}&order=${this.order}&rows=10&page=${page}&status=${this.tableTypeOpts}` : `/datasets/${this.path}?rows=10&page=${page}&status=${this.tableTypeOpts}`;
                    this.axios.get(url).then(res => {
                        this.loading = false;
                        if (res.body.statusCode === 200) {
                            this.databaseList = res.body.message;
                        } else {
                            this.databaseList.records = [];
                        }
                    });
                }
            },
            tableSort({sort, order}) {
                this.sort = sort;
                this.order = order;
                this.fetchAll();
            },
            handleCurrentChange(val) {
                this.fetchAll(val);
            },
            fectchDate(arr) {
                let [begin_date, end_date] = arr;
                Object.assign(this.$data, {begin_date, end_date});
                this.fetchChartData();
            },
            async fetchChartData() {
                let ref_id = this.$route.query.refId;
                let _url = `/datasets/getDbChangeDetail?ref_id=${ref_id}&db_name=${this.db_name}` + (this.begin_date ? `&begin_date=${this.begin_date / 1000}&end_date=${this.end_date / 1000}` : '');
                const res = await this.axios.get(_url);
                const {statusCode} = res.body;
                statusCode === 200 ? this.chartMessage = res.body.message : [];
                this.resolveData();
            },
            resolveData() {
                let vm = this;
                this.categories.clear();
                this.series.clear();
                let max = 0;
                let itemSeries = {name: this.$t('content.dataset.datasetDetail.xzb'), data: []};
                for (let [index, item] of this.chartMessage.entries()) {
                    this.categories.add(item.create_date);
                    max = item.change_num > max ? item.change_num : max;
                    this.activeChart == 'createdTable' ? itemSeries.data.push(item.change_num) : itemSeries.data.push(item.change_size);
                }
                this.series.add(itemSeries);
                this.createdTableOptions = {
                    lang: {
                        thousandsSep: ','
                    },
                    chart: {
                        height: 300,
                        type: 'line'
                    },
                    title: {
                        text: this.$t('content.dataset.datasetDetail.sjkxbxzqk', [vm.db_name]),
                        style: {
                            fontSize: '14px'
                        }
                    },
                    tooltip: {
                        backgroundColor: '#AB9FFF',
                        borderColor: '#AB9FFF',
                        borderRadius: 0,
                        style: {
                            color: '#FFF'
                        }
                    },
                    xAxis: {
                        title: {
                            text: this.$t('content.source.sj'),
                            align: 'high'
                        },
                        categories: [...this.categories]
                    },
                    yAxis: [{
                        title: {
                            text: this.$t('content.dataset.datasetDetail.bsl'),
                            align: 'high',
                            rotation: 0
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }],
                        type: 'vaule',
                        minInterval: 1,
                        lineWidth: 1,
                        lineColor: '#D6D9DC',
                        allowDecimals: false
                    }],
                    legend: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    },
                    series: [...this.series]
                };

                this.createdStorageOptions = {
                    chart: {
                        height: 300,
                        type: 'line'
                    },
                    title: {
                        text: this.$t('content.dataset.datasetDetail.sjkxccxzqk', [vm.db_name]),
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
                        lineColor: '#D6D9DC',
                        labels: {
                            formatter() {
                                return vm.formatSize(this.value);
                            }
                        },
                        lineWidth: 1,
                        lineColor: '#D6D9DC'
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
											${vm.$t('content.dataset.datasetDetail.ccxz')}: ${vm.formatSize(this.y)}
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
            }
        }
    };
</script>
<style lang="less">
    .chart-header {
        .el-tabs__item {
            padding: 0 10px;
            font-size: 12px;
        }
        .date-picker-container .el-range-separator {
            line-height: 20px;
        }
        .el-date-editor .el-range__close-icon {
            line-height: 23px;
        }
        .el-date-editor {
            width: 300px;
            .el-range__icon {
                line-height: 23px;
            }
            .el-range-input {
                width: 38%;
                line-height: 22px;
            }
        }
    }
    .datasourceDetail {
        height: 100%;
        .dialogComment {
            width: 798px !important;
        }
    }
</style>
