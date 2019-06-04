<template>
    <div id="data-type-detail" class="dataTypeDetail" v-loading="loading">
        <div class="tabCon">
            <div class="boxCommon">
                <div class="table-title">
                    <div class="table-title__text">
                        <span>{{title}} {{$t('content.dataset.datasetDetail.sjylb')}}</span>
                    </div>
                </div>
                <el-table :data="dataTypeList.records" border
                          :default-sort="{prop: 'dataSourceName', order: 'ascending'}"
                          @sort-change="sortTable">
                    <el-table-column prop="dataSourceName" :label="$t('content.import.sjymc')" sortable="custom">
                        <template slot-scope="scope">
                            <item-jump
                                    :params="{params:{path:`${isActive.path}/${scope.row.dataSourceName}`,level:2,title:scope.row.dataSourceName,},isfolder: true}"
                                    :name="scope.row.dataSourceName"
                                    :view="false">
                            </item-jump>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ip" label="IP" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="port" :label="$t('content.import.dkh')"></el-table-column>
                    <el-table-column prop="userName" :label="$t('content.import.yhm')"></el-table-column>
                </el-table>
                <div class="tablePages">
                    <el-pagination background
                                   layout="total, prev, pager, next"
                                   @size-change="handleSizeChange"
                                   @current-change="handleCurrentChange"
                                   :current-page="dataTypeList.currentPage"
                                   :page-size="dataTypeList.pageSize"
                                   :total="dataTypeList.totalRows"
                                   v-if="dataTypeList.totalRows>dataTypeList.pageSize">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {FormatSize, SortTable} from 'mixins/common';
    import ItemJump from 'components/common/ItemJump';

    export default {
        mixins: [FormatSize, SortTable],
        components: {
            ItemJump
        },
        data() {
            return {
                dataTypeList: {
                    records: []
                },
                loading: false,
                isEdit: false,
                editModel: '',
                sort: "dataSourceName",
                order: "asc"
            };
        },
        computed: {
            isActive() {
                return this.$store.state.treeItemActive;
            },
            title() {
                return this.$route.query.title;
            },
            path() {
                return this.$route.query.path;
            }
        },
        created() {
            this.fetchData();
        },
        watch: {
            '$route': function (val) {
                if (val.query.path) {
                    this.fetchData();
                }
            }
        },
        methods: {
            fetchData(page = 1) {
                if (this.path && this.$store.state.viewData.viewActive === 'datatype') {
                    this.loading = true;
                    const url = this.order ? `/datasets/${this.path}?sort=${this.sort}&order=${this.order}&rows=10&page=${page}` : `/datasets/${this.path}?rows=10&page=${page}`;
                    this.axios.get(url).then(res => {
                        this.loading = false;
                        const {statusCode, message} = res.data;
                        if (statusCode === 200) {
                            this.fetchIp(message);
                        } else {
                            this.message.records = [];
                        }
                    });
                }
            },
            fetchIp(data) {
                let records = data.records;
                records.map(val => {
                    if (val.url) {
                        if (val.dataSourceType === 'ORACLE') {   //jdbc:oracle:thin:@172.17.202.145:1521:ora11
                            const array = val.url.split("@");
                            const URLArray = array[1].split(":");
                            val.ip = URLArray[0];
                            val.port = URLArray[1];
                        } else {
                            let array = val.url.split(":");
                            if (val.dataSourceType === 'HBASE') {
                                val.ip = val.url;
                            } else {
                                val.ip = array[2].substr(2);
                                val.port = array[3].split("/")[0];
                            }
                        }
                    }
                });
                this.dataTypeList = data;
            },
            tableSort({sort, order}) {
                this.sort = sort;
                this.order = order;
                this.fetchData();
            },
            handleCurrentChange(val) {
                this.fetchData(val);
            }
        }
    };
</script>
<style lang="less">
    #data-type-detail {
        background-color: #FFF;
        height: 100%;
    }
</style>
