<template>
    <div class="personal-approval">
        <ul class="tab-box clearfix">
            <li :class="{active: activeTab === 'delDataTable'}" @click="tabChange('delDataTable')">
                <span>{{$t('content.personal.yscb')}}</span>
            </li>
            <li :class="{active: activeTab === 'delDataBase'}"
                @click="tabChange('delDataBase')"
                v-if="$store.state.userInfo.roles === 'leapid.admin'">
                <span>{{$t('content.personal.ysck')}}</span>
            </li>
        </ul>
        <div class="tableMulti">
            <div class="table-title">
                <div class="table-title__text">
                    <span>{{$t(`content.personal.${activeTab === 'delDataTable' ?  'yscb' : 'ysck'}`)}}</span>
                </div>
                <div class="table-title__btns">
                    <Search :keyword.sync='keyword'
                            placeholder="content.header.srbm"
                            @handleSearch="fetchData"></Search>
                </div>
            </div>
            <el-table :data="records"
                      border
                      :default-sort="defaultSort"
                      @sort-change="sortTable"
                      v-loading="loadingVisible">
                <el-table-column prop="operateTime" sortable="custom" :label="$t('content.source.czsj')">
                    <template slot-scope="scope">
                        {{formatTime(scope.row.operateTime*1000)}}
                    </template>
                </el-table-column>
                <el-table-column prop="operator" sortable="custom"
                                 :label="$t('content.source.czzh')"></el-table-column>
                <el-table-column v-if="activeTab === 'delDataTable'" prop="sourceName" sortable="custom"
                                 :label="$t('content.dataset.businessDetail.biaom')"></el-table-column>
                <el-table-column prop="refName" sortable="refName"
                                 :label="$t('content.import.sjy')"></el-table-column>
                <el-table-column prop="parentName" sortable="parentName"
                                 :label="$t('content.dataset.datasetDetail.km')"></el-table-column>
                <el-table-column prop="" :label="$t('content.dataset.datasetDetail.cz')">
                    <template slot-scope="scope">
                        <i class="icon iconfont icon-huifu1"
                           @click="recover ({
                                                    deleteKey: scope.row.deleteKey,
                                                    sourceType: scope.row.sourceType,
                                                    refId: scope.row.refId,
                                                    refIdType: scope.row.refIdType,
                                                    sourceName: scope.row.sourceName
                                                    })"
                           :title="$t('content.personal.huif')"></i>
                        <i class="icon iconfont icon-shanchu3"
                           @click="physicallyDelete ({
                                                    deleteKey: scope.row.deleteKey,
                                                    sourceType: scope.row.sourceType,
                                                    refId: scope.row.refId,
                                                    refIdType: scope.row.refIdType,
                                                    sourceName: scope.row.sourceName
                                                })"
                           :title="$t('content.common.sc')"></i>
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
        <!-- 确认框 -->
        <el-dialog
                :title="$t('content.common.tis')"
                :visible.sync="dialogVisible"
                width="385px"
                :close-on-click-modal="false"
                @click.native.stop>
            <div class="del-content">
                {{confirmMessage}}?
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button
                        @click="dialogVisible = false">
                    {{$t('content.common.qx')}}
                </el-button>
                <el-button
                        type="primary"
                        @click="operatePost">
                    {{$t('content.common.qd')}}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import Bus from 'utils/bus';
    import Search from '@/components/MetaData/Personal/chiildren/Search';
    import {FormatTime, Message, SortTable} from 'mixins/common';

    export default {
        mixins: [FormatTime, Message, SortTable],
        components: {
            Search
        },
        data() {
            return {
                defaultSort: {prop: 'operateTime', order: 'descending'},
                sort: 'operateTime',
                order: "desc",
                activeTab: 'delDataTable',
                records: [],
                messageObj: {},
                loadingVisible: true,
                dialogVisible: false,
                confirmMessage: '',
                deleteKey: '',
                sourceType: '',
                refId: '',
                refIdType: '',
                sourceName: '',
                currentPage: 1,
                pageSize: 10,
                totalRows: 1,
                operatorType: null,
                keyword: ''     //搜索关键字
            };
        },
        created() {
            this.fetchData();
        },
        methods: {
            tabChange(activeTab) {
                this.keyword = '';
                this.activeTab = activeTab;
                this.$set(this, 'defaultSort', {prop: 'operateTime', order: 'descending'});
                this.fetchData();
            },
            fetchData({key = '', currentPage = 1} = {}) {
                this.loadingVisible = true;
                const type = this.activeTab === 'delDataTable' ? 'Table' : 'Database';
                let params = {
                    sourceType: type,
                    page: currentPage ? currentPage : 1,
                    sort: this.sort,
                    order: this.order,
                    rows: this.pageSize,
                    sourceName: this.keyword
                };

                return this.axios.get('/datasets/deletedDataset', {
                    params
                }).then(res => {
                    const {statusCode, message} = res.data;
                    if (statusCode === 200) {
                        this.loadingVisible = false;
                        this.records = message.records;
                        this.totalRows = message.totalRows;
                        this.messageObj = message;
                    }
                });
            },
            recover(params) {
                this.dialogVisible = true;
                this.operatorType = 'recover';
                Object.assign(this.$data, params);
                this.confirmMessage = this.sourceType == 'Table' ? this.$t('content.personal.qrhfb', [this.sourceName]) : this.$t('content.personal.qrhfk', [this.sourceName]);
            },
            physicallyDelete(params) {
                // this.operatePhysicallyDelete(params)
                this.operatorType = 'del';
                this.dialogVisible = true;
                Object.assign(this.$data, params);
                this.confirmMessage = this.sourceType == 'Table' ? this.$t('content.personal.qrcdscb', [this.sourceName]) : this.$t('content.personal.qrcdsck', [this.sourceName]);
            },

            operatePost() {
                if (this.operatorType == 'recover') {
                    this.recoverPost();
                } else {
                    this.operatePhysicallyDelete();
                }
            },

            async recoverPost() {
                const vm = this;
                this.dialogVisible = false;
                const {deleteKey, sourceType, refId, refIdType} = this.$data;
                const params = {deleteKey, sourceType, refId, refIdType};
                const res = await this.axios.post('/datasets/recoverDeletedDataset', params);
                const {message, statusCode} = res.body;
                if (statusCode === 200) {
                    switch (message) {
                        case '20005': {
                            vm.message(`${vm.$t('content.personal.sjkhcy')}!`, 'error');
                            break;
                        }
                        case '': {
                            vm.message(`${vm.$t('content.personal.hfcg')}!`, "success");
                            break;
                        }
                    }
                    await this.fetchData({
                        currentPage: this.records.length === 1 ? this.currentPage - 1 : this.currentPage
                    });
                    Bus.$emit('fetchCount');
                } else {
                    this.message(`${vm.$t('content.personal.hfsb')}!`, "error");
                }
            },
            async operatePhysicallyDelete() {
                const vm = this;
                this.dialogVisible = false;

                const {deleteKey, sourceType, refId, refIdType, sourceName} = this.$data;
                const params = {deleteKey, sourceType, refId, refIdType, sourceName};

                let res;
                if (this.activeTab === 'delDataTable') {
                    res = await this.axios.post('/datasets/' + params.deleteKey + '/deleteDatasetFromDb', {});
                } else {
                    res = await this.axios.post('/datasets/deleteDbFromDB/' + params.refId + '/' + params.sourceName, {
                        ref_id: params.refId,
                        dbName: params.sourceName
                    });
                }
                const {message, statusCode} = res.body;

                if (statusCode === 200) {
                    vm.message(`${vm.$t('content.personal.cdsccg')}!`, "success");
                    await this.fetchData({
                        currentPage: this.records.length === 1 ? this.currentPage - 1 : this.currentPage
                    });
                    Bus.$emit('fetchCount');
                } else {
                    vm.message(`${vm.$t('content.personal.cdscsb')}!`, "error");
                }
            },

            handleCurrentChange(val) {
                const params = {
                    currentPage: val,
                    key: this.key
                };
                this.fetchData(params);
            }
        }
    };
</script>
<style>
    .personal-approval .el-table__empty-block {
        min-height: 200px;
    }
</style>
