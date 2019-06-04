<template>
    <!--负责人信息待维护-->
    <div>
        <el-table
                :data="showRecordList"
                border
                :default-sort="{prop: 'datasetName', order: 'ascending'}"
                @sort-change="sortTable">
            <el-table-column
                    prop="datasetName"
                    :label="$t('content.dataset.businessDetail.biaom')"
                    sortable="custom">
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
                    :label="$t('content.dataset.datasetDetail.wllj')"></el-table-column>
            <el-table-column
                    prop="datasourceName"
                    sortable="custom"
                    :label="$t('content.dataset.datasetDetail.sjlx')">
            </el-table-column>
            <el-table-column
                    prop="projectName"
                    sortable="custom"
                    :label="$t('content.personal.ssxm')">
            </el-table-column>
            <el-table-column
                    prop="createdTime"
                    :label="$t('content.dataset.datasetDetail.cjsj')"
                    sortable="custom"
                    :formatter="_formatTime">
            </el-table-column>
            <el-table-column
                    prop="size"
                    :label="$t('content.dataset.datasetDetail.ccdx')"
                    :formatter="_formatSize">
            </el-table-column>
            <el-table-column
                    :label="$t('content.dataset.datasetDetail.szywfzr')">
                <template slot-scope="scope">
                    <div class="owner-operator">
                        <el-tooltip effect="dark" :content="$t('content.personal.xgowner')" placement="top">
                            <span @click="showOwnerInfo(scope.row.id, scope.row.datasetName, scope.row.owner)">
                                <i class="iconfont icon-yonghushezhi icon-s"></i>
                            </span>
                        </el-tooltip>
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
        <!-- <no-data v-if="totalRows == 0"></no-data> -->
        <!-- 修改owner -->
        <el-dialog :title="ownerTableName" :visible.sync="dialogOwnerVisible" custom-class="changeOwner">
            <div class="ownerCon">
                <label>{{$t('content.personal.qsrowner')}}:</label>
                <div class="txt">
                    <el-select v-model="newOwner"
                               filterable
                               reserve-keyword
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
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogOwnerVisible = false">{{$t('content.common.qx')}}</el-button>
                <el-button type="primary" @click="changeOwner()">{{$t('content.common.qd')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import Bus from 'utils/bus';
    import ItemJump from 'common/ItemJump';
    import item from 'common/TableItemJump';
    import {httpRequest} from 'utils';
    import {
        FormatTime,
        FormatSize,
        FormatLifeDay,
        Message,
        EmphasizeName,
        SortTable,
        _FormatTime,
        _FormatSize
    } from 'mixins/common';

    export default {
        name: 'PersonalChargeMaintain',
        mixins: [FormatTime, FormatSize, FormatLifeDay, Message, EmphasizeName, SortTable, _FormatTime, _FormatSize],
        data () {
            return {
                tableHeader: [
                    {name: this.$t('content.dataset.datasetDetail.bm'), hasSort: true, type: 'datasetName'},
                    {name: this.$t('content.dataset.datasetDetail.sjlx'), hasSort: true, type: 'datasourceName'},
                    {name: this.$t('content.dataset.datasetDetail.scxm'), hasSort: false},
                    {name: this.$t('content.dataset.datasetDetail.cjsj'), hasSort: true, type: "createdTime"},
                    {name: this.$t('content.dataset.datasetDetail.ccdx'), hasSort: false},
                    {name: this.$t('content.dataset.datasetDetail.szywfzr'), hasSort: false}
                ],
                records: [],
                ownerTableId: '', // 当前表id
                ownerTableName: '', // 当前表名
                tableOwnerActive: '', // 当前用户
                dialogOwnerVisible: false,
                ownerHistory: [], // owner历史
                noDataVisible: false,

                currentPage: 1,
                pageSize: 10,
                totalRows: 1,
                loading: false,
                userList: [],
                newOwner: '',
                key: '',
                sort: "datasetName",
                order: "asc"
            };
        },
        created () {
            this.fetchData();
        },
        components: {
            item,
            ItemJump
        },
        watch: {
            '$parent.key' (val) {
                this.fetchData({key: val, currentPage: 1});
            }
        },
        methods: {
            tableSort ({sort, order}) {
                this.sort = sort;
                this.order = order;
                const params = {
                    key: this.key
                };
                this.fetchData(params);
            },
            // 修改owner
            async changeOwner () {
                if (this.newOwner != '') {
                    let self = this;
                    let url = `privilege/${this.ownerTableId}/updateDatesetOwner?userName=${this.newOwner}`;
                    const res = await self.axios.get(url);
                    if (res.body.statusCode == 200) {
                        this.message(`${this.$t('content.personal.xgcg')}!`, 'success');
                        this.newOwner = '';
                        this.dialogOwnerVisible = false;
                        Bus.$emit('fetchOwner', '');
                        // this.fetchData()
                        this.fetchData({key: this.key, currentPage: this.currentPage});
                    }
                } else {
                    this.dialogOwnerVisible = false;
                }
            },
            // fetchOwnerCount(){
            //     const res = httpRequest({ vm: this, url: '/datasets/ownedDatasetWithoutOwnerCount'})
            //     res.then( res => {
            //         // console.log()
            //         this.$parent.ownerTabList[1].count = res
            //     })
            // },
            searchUserList (keyword) {
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
                    this.userList = [];
                }
            },
            async fetchData ({currentPage = 1, key = ''} = {}) {
                this.key = key;
                Bus.$emit('loadingVisible', true);

                let _url = "";
                if (this.sort) {
                    _url = `/datasets/ownedDatasetWithoutOwner?keyword=${escape(key)}&rows=10&page=${currentPage}&sort=${this.sort}&order=${this.order}`;
                } else {
                    _url = `/datasets/ownedDatasetWithoutOwner?keyword=${escape(key)}&rows=10&page=${currentPage}&sort=datasetName&order=asc`;
                }

                const res = await this.axios.get(_url);
                if (res.body.statusCode == 200) {
                    Object.assign(this.$data, res.body.message);
                    Bus.$emit('loadingVisible', false);
                }
            },
            // 显示ower信息窗口
            async showOwnerInfo (id, datasetName, owner) {
                let self = this;
                this.ownerTableId = id;
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
            handleCurrentChange (val) {
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

</style>

