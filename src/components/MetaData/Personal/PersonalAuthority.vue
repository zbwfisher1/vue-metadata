<template>
    <div class="boxCommon">
        <div class="table-title">
            <div class="table-title__text">
                <span>{{$t('content.personal.yqxdsjlb')}}</span>
            </div>
            <div class="table-title__btns">
                <Search
                        :placeholder="$t('content.validator.qsrbm')"
                        emitName="authoritySearch"
                        @authoritySearch="fetchData"></Search>
            </div>
        </div>
        <el-table :data="showRecordList"
                  v-loading="loading"
                  border
                  :default-sort="{prop: 'tableName', order: 'ascending'}"
                  @sort-change="sortTable">
            <el-table-column
                    prop="tableName"
                    :label="$t('content.dataset.businessDetail.biaom')"
                    sortable="custom">
                <template slot-scope="scope">
                    <item-jump
                            :params="{
                            params:{
                                path:scope.row.path,
                                level:3,
                            },
                            isfolder: false
                        }"
                            :name="emphasizeName(scope.row.resourceName.split('.')[1],key)"
                            :view="false"
                            :datasetId="scope.row.datasetId">
                    </item-jump>
                </template>
            </el-table-column>
            <el-table-column
                    prop="path"
                    show-overflow-tooltip
                    :label="$t('content.dataset.datasetDetail.wllj')"
                    sortable="custom">
            </el-table-column>
            <el-table-column
                    prop="description"
                    :label="$t('content.dataset.datasetDetail.bms')"
                    sortable="custom">
            </el-table-column>
            <el-table-column
                    prop="owner"
                    :label="$t('content.dataset.datasetDetail.sjfzr')"
                    sortable="custom">
            </el-table-column>
            <el-table-column
                    prop="ownedProject"
                    :label="$t('content.personal.ssxm')"
                    sortable="custom">
            </el-table-column>
            <el-table-column
                    prop="usedProject"
                    :label="$t('content.personal.qxssxm')"
                    sortable="custom">
            </el-table-column>
            <el-table-column :label="$t('content.personal.qxxq')">
                <template slot-scope="scope">
                    <div class="owner-operator">
                        <i :title="$t('content.common.ckxq')"
                           @click="showTableDetail(scope.row.tableName, scope.row.resourceName)"
                           class="icon iconfont icon-chakanxiangqing"></i>
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
        <el-dialog
                :title="dialogTableDetailTitle"
                :visible.sync="dialogTableDetailVisible"
                :close-on-click-modal="false"
                custom-class="detailDialog">

            <loading :isloading="detailLoading"/>

            <template v-if="!detailLoading">
                <table class="table table-bordered tableList">
                    <table-header :tableHeader="detailTableHeader">
                    </table-header>
                    <tbody v-if="!detailNoDataVisible">
                    <item v-for="(data, index) in detailRecordList"
                          :params="{
                                params:{
                                    path: data.path,
                                    level:3,
                                },
                                isfolder: false
                                }"
                          :view="false"
                          :datasetId="data.datasetId"
                          :indexKey="index">
                        <td>
                            <div v-ellipsis="data.usedProject"></div>
                        </td>
                        <td>
                            <div>
                                <i v-for="item in data.type"
                                   :class="[item.val ? item.icon : '']"
                                   class="permission__icon">
                                    {{item.text}}
                                </i>
                            </div>
                        </td>
                    </item>
                    </tbody>
                </table>
                <no-data :noDataVisible="detailNoDataVisible"></no-data>
            </template>
            <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogTableDetailVisible=false">{{$t('content.common.qd')}}</el-button>
      </span>
        </el-dialog>
    </div>
</template>
<script>
    import item from 'common/TableItemJump';
    import Search from 'common/Search';
    import {FormatTime, FormatSize, EmphasizeName, FormatLifeDay, SortTable} from 'mixins/common';
    import ItemJump from 'common/ItemJump';

    export default {
        mixins: [FormatTime, FormatSize, EmphasizeName, FormatLifeDay, SortTable],
        data () {
            return {
                loading: true,
                noDataVisible: false,
                detailLoading: true,
                detailNoDataVisible: false,
                records: [],
                detailRecords: [],
                detailList: [
                    {project: '项目1', authority: '读&写'},
                    {project: '项目2', authority: '读&写'},
                    {project: '项目3', authority: '读&写'},
                    {project: '项目4', authority: '读&写'}
                ],
                currentPage: 1,
                pageSize: 10,
                totalRows: 1,
                detailTableHeader: [
                    {
                        name: this.$t('content.personal.qxssxm'),
                        type: "usedProject",
                        hasSort: false
                    },
                    {
                        name: this.$t('content.dataset.datasetDetail.dxqx'),
                        type: "type",
                        hasSort: false
                    }
                ],
                sort: "tableName",
                order: "asc",
                dialogTableDetailTitle: '',
                dialogTableDetailVisible: false
            };
        },
        components: {
            item,
            ItemJump,
            Search
        },
        created () {
            this.fetchData();
        },
        computed: {
            showRecordList () {
                const vm = this;

                function type (type = "") {
                    let typeArr = [
                        {text: vm.$t('content.authority.r'), icon: 'permission__icon-r', val: false},
                        {text: vm.$t('content.authority.w'), icon: 'permission__icon-w', val: false}
                    ];
                    if (!!type) {
                        Array.from(type, (val, index) => {
                            typeArr[index]['val'] = !!val;
                        });
                    }
                    return typeArr;
                }

                const records = this.records;

                records.map((val) => {
                    val.type = type(val.type);//读写权限
                    val.lifeCycle = this.switchLifeType({lifeDay: val.lifeDay, lifeType: val.lifeType});//生命周期
                });
                return records;
            },

            detailRecordList () {
                const vm = this;

                function type (type = "") {
                    let typeArr = [
                        {text: vm.$t('content.authority.r'), icon: 'permission__icon-r', val: false},
                        {text: vm.$t('content.authority.w'), icon: 'permission__icon-w', val: false}
                    ];
                    if (!!type) {
                        Array.from(type, (val, index) => {
                            typeArr[index]['val'] = !!val;
                        });
                    }
                    return typeArr;
                }

                const detailRecords = this.detailRecords;
                detailRecords.map((val) => {
                    val.type = type(val.type);//读写权限
                    val.lifeCycle = this.switchLifeType({lifeDay: val.lifeDay, lifeType: val.lifeType});//生命周期
                });
                return detailRecords;
            }
        },
        methods: {
            async fetchData ({key = '', currentPage = 1} = {}) {
                this.key = key;
                let url = '';
                if (this.sort) {
                    url = `/privilege/getOwnedPrivileges?keyword=${escape(key)}&rows=10&page=${currentPage}&sort=${this.sort}&order=${this.order}`;
                } else {
                    url = `/privilege/getOwnedPrivileges?keyword=${escape(key)}&rows=10&page=${currentPage}`;
                }

                this.loading = true;
                await this.axios.get(url).then(res => {
                    this.loading = false;
                    const {statusCode, message} = res.data;
                    if (statusCode === 200) {
                        Object.assign(this.$data, message);
                    }
                });
            },
            tableSort ({sort, order}) {
                this.sort = sort;
                this.order = order;
                const params = {
                    key: this.key
                };
                this.fetchData(params);
            },
            handleSizeChange () {
            },
            handleCurrentChange (val) {
                const params = {
                    currentPage: val,
                    key: this.key
                };
                this.fetchData(params);
            },

            async showTableDetail (tableName, resourceName) {
                this.detailLoading = true;
                this.dialogTableDetailTitle = `"${tableName}" ${this.$t('content.personal.qxxq')}`;
                this.dialogTableDetailVisible = true;

                let url = `/privilege/getOwnedPrivilegesDetail?resourceName=${resourceName}&rows=1000&page=1`;
                const res = await this.axios.get(url);
                this.detailLoading = false;
                if (res.body.statusCode == 200) {
                    this.detailNoDataVisible = res.body.message.records.length == 0 ? true : false;
                    this.detailRecords = res.body.message.records;
                }
            }
        }
    };
</script>
<style lang="less">
    .popover-container {
        .el-button {
            border: 0;
            padding: 0;
            color: #169BD5;
        }
    }
    .detailDialog {
        .el-dialog__body {
            min-height: 150px;
            max-height: 400px;
            overflow-y: auto;
        }
    }
</style>
