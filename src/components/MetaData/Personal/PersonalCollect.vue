<template>
    <div class="boxCommon personal-collect">
        <div class="table-title">
            <div class="table-title__text">
                <span>{{$t('content.personal.scdsjlb')}}</span>
            </div>
            <div class="table-title__btns">
                <Search
                        :placeholder="$t('content.validator.qsrbm')"
                        emitName="collectSearch"
                        @collectSearch="fetchData"></Search>
            </div>
        </div>
        <template>
            <el-table :data="showRecordList"
                      v-loading="loading"
                      border
                      :default-sort="{prop: 'createdTime', order: 'descending'}"
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
                                title: scope.row.datasetName,
                                path:scope.row.path,
                                level:3,
                            },
                            isfolder: false
                        }"
                                    :name="emphasizeName(scope.row.datasetName,key)"
                                    :view="false"
                                    :datasetId="scope.row.id">
                            </item-jump>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="path"
                        :label="$t('content.dataset.datasetDetail.wllj')"
                        show-overflow-tooltip
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
                        prop="projectName"
                        :label="$t('content.personal.ssxm')"
                        sortable="custom">
                </el-table-column>
                <el-table-column
                        prop="createdTime"
                        :label="$t('content.personal.scsj')"
                        sortable="custom">
                    <template slot-scope="scope">
                        {{formatTime(scope.row.createdTime)}}
                    </template>
                </el-table-column>
                <el-table-column prop="" :label="$t('content.dataset.datasetDetail.cz')">
                    <template slot-scope="scope">
                        <div class="personal-control">
                            <i class="icon iconfont icon-jiarushoucang"
                               @click="confirmCancel(scope.row.id)"
                               :title="$t('content.common.qxsc')"></i>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="tablePages">
                <el-pagination background
                               layout="total, prev, pager, next"
                               @current-change="handleCurrentChange"
                               :current-page="currentPage"
                               :page-size=10
                               :total="totalRows">
                </el-pagination>
            </div>
        </template>
    </div>
</template>
<script>
    import item from 'common/TableItemJump';
    import Search from 'common/Search';
    import Bus from 'utils/bus';
    import ItemJump from 'common/ItemJump';
    import {FormatTime, FormatSize, EmphasizeName, FormatLifeDay, Message, SortTable} from 'mixins/common';

    export default {
        mixins: [FormatTime, FormatSize, EmphasizeName, FormatLifeDay, Message, SortTable],
        data () {
            return {
                isClear: false,
                records: [],
                loading: true,
                currentPage: 1,
                pageSize: 10,
                totalRows: 1,
                cancelId: '',
                key: '',
                lifeType: '',
                sort: "createdTime",
                order: "desc",
                index: 0
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
        mounted () {
            Bus.$on('confirmCancel', this.confirmCancel);
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
            async fetchData ({key = '', currentPage = 1} = {}) {
                this.key = key;

                let url = '';
                if (this.sort) {
                    url = `datasets/favorites?keyword=${escape(key)}&rows=10&page=${currentPage}&sort=${this.sort}&order=${this.order}`;
                } else {
                    url = `datasets/favorites?keyword=${escape(key)}&rows=10&page=${currentPage}`;
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
            confirmCancel (id) {
                this.cancelId = id;
                this.index++;
                let self = this;
                const cancelUrl = `datasets/${this.cancelId}/favorite`;
                this.axios.delete(cancelUrl)
                        .then(res => {
                            if (res.body.statusCode === 200) {
                                // this.isClear = true;
                                Bus.$emit('fetchCountList', '');
                                self.fetchData({key: this.key, currentPage: this.currentPage});
                            }
                        })
                        .then(() => {
                            this.message(`${this.$t('content.common.qxsc')}${this.$t('content.common.chengg')}!`, 'success');
                        })
                        .then(() => {
                            this.fetchCount();
                        });
            },
            fetchCount () {
                this.axios.get('/datasets/getPersonalDataCount').then(res => {
                    const {statusCode, message} = res.body;
                    statusCode == 200 && this.$store.dispatch('saveCollectCount', message.Collect);
                });
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

