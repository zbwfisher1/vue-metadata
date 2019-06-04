<template>
    <div class="pane" :style="{ flexGrow: 1 }" v-if=" $route.name === 'ImportModule' ">
        <div class="el-row-wrap">
            <el-row :gutter="40" class="import-module-header">
                <el-col :span="12" @click.native="toImportRoute">
                    <import-header-item
                            :title="$t('content.dataset.importExport.dcwj')"
                            :content="$t('content.dataset.importExport.scybjhdysj')"
                            id="2"
                    ></import-header-item>
                </el-col>
                <el-col :span="12" @click.native="downloadTemplate">
                    <import-header-item
                            justify="flex-end"
                            :title="$t('content.dataset.importExport.xzmb')"
                            :content="$t('content.dataset.importExport.xzysjdrmb')"
                            id="1"
                    ></import-header-item>
                </el-col>
            </el-row>
        </div>
        <div class="boxCommon">
            <div class="tableMulti">
                <div class="table-title">
                    <div class="table-title__text">
                        <span>{{$t('content.dataset.importExport.drjl')}}</span>
                    </div>
                </div>
            </div>

            <el-table :data="records"
                      border
                      :default-sort="{prop: 'oper_time', order: 'descending'}"
                      @sort-change="sortTable"
                      v-loading="loading">
                <el-table-column prop="oper_time" :label="$t('content.dataset.importExport.drsj')" sortable="custom">
                    <template slot-scope="scope">
                        {{formatTime(scope.row.oper_time)}}
                    </template>
                </el-table-column>


                <el-table-column prop="operator" :label="$t('content.dataset.importExport.czr')"></el-table-column>
                <el-table-column prop="file_name" :label="$t('content.dataset.importExport.wjm')"></el-table-column>

                <el-table-column prop="dataType" :label="$t('content.dataset.importExport.drjg')">
                    <template slot-scope="scope">
                        <span v-if="scope.row.successCount > 0" class="export-success">{{$t('content.dataset.importExport.drcgt', [scope.row.successCount])}}</span>
                        <span v-if="scope.row.successCount > 0 && scope.row.failCount > 0">,</span>
                        <span v-if="scope.row.failCount > 0" class="export-fail">{{$t('content.dataset.importExport.drsbt', [scope.row.failCount])}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="tablePages" v-if="records.length !== 0 && !loading">
                <el-pagination background
                               layout="total, prev, pager, next"
                               @current-change="handleCurrentChange"
                               :current-page="currentPage"
                               :page-size="10"
                               :total="totalRows"
                               v-if="totalRows>10">
                </el-pagination>
            </div>
        </div>
        <el-dialog
                :title="dialogTitle"
                :visible.sync="dialogVisible"
                :close-on-click-modal="false"
                custom-class="import-export-dialog">
            <ul>
                <li v-for="item in showList">
                    {{item.name ? item.name : ''}},
                    {{item.state ? item.state : ''}}
                    <span v-if="item.reason">,</span>
                    {{item.reason ? item.reason : ''}}
                </li>
            </ul>
            <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible=false">确 认</el-button>
      </span>
        </el-dialog>

    </div>
    <router-view v-else></router-view>
</template>
<script>
    import importHeaderItem from './children/importHeaderItem';
    import {FormatTime, SortTable} from 'mixins/common';
    import FileSaver from 'file-saver';

    export default {
        components: {
            importHeaderItem
        },
        mixins: [FormatTime, SortTable],
        data() {
            return {
                dialogTitle: '',
                dialogVisible: false,
                sort: "oper_time",
                order: "desc",
                showList: [],
                records: [],
                currentPage: 1,
                totalRows: 1,
                loading: true
            };
        },
        created() {
            this.fetchData();
        },
        methods: {
            toImportRoute() {
                this.$store.dispatch('saveRouter', 'ImportModule');
                this.$router.push({name: 'DataImport'});
            },
            tableSort({sort, order}) {
                this.sort = sort;
                this.order = order;
                this.fetchData();
            },
            exportSuccess(detail) {
                const vm = this;
                this.showList = [];
                this.dialogVisible = true;
                this.dialogTitle = this.$t('content.dataset.importExport.drcgt', [detail.length]);
                detail.forEach(val => {
                    this.showList.push({name: val.tableName, state: vm.$t('content.dataset.import.drcg')});
                });
            },
            exportFail(detail) {
                const vm = this;
                this.showList = [];
                this.dialogVisible = true;
                this.dialogTitle = $t('content.dataset.importExport.drsbt', [detail.length]);
                detail.forEach(val => {
                    const reason = vm.errorCodeTranslate(val.errorCode);
                    this.showList.push({name: val.tableName, state: vm.$t('content.dataset.import.drsb'), reason});
                });
            },
            errorCodeTranslate(code) {
                const vm = this;
                let reason = '';
                switch (code) {
                    case '20001':
                        reason = vm.$t('content.dataset.import.mbcw');
                        break;
                    case '20002':
                        reason = vm.$t('content.dataset.import.myqx');
                        break;
                    case '20003':
                        reason = vm.$t('content.dataset.import.kbbcz');
                        break;
                    case '20004':
                        reason = vm.$t('content.dataset.import.sjkpzmzd');
                        break;
                    case '80001':
                        reason = vm.$t('content.dataset.datasetDetail.xtyc');
                        break;
                }
                return reason;
            },
            async downloadTemplate() {
                const lang = this.$i18n.locale;
                await this.axios.post(`/excelMetadataInfo/exportTemplate/${lang}`, {
                            responseparameterType: 'arraybuffer'
                        },
                        {
                            responseType: 'arraybuffer'
                        }
                ).then(res => {
                    if (res.status === 200) {
                        var blob = new Blob([res.data], {type: 'application/vnd.ms-excel'});
                        FileSaver.saveAs(blob, this.$t('content.dataset.import.dcwjm') + ".xlsx");
                    }
                });
            },
            fetchData(page = 1) {
                this.loading = true;

                let url = '';
                if (this.sort) {
                    url = `/excelMetadataInfo/getImportLog?sort=${this.sort}&order=${this.order}&page=${page}&rows=10`;
                } else {
                    url = `/excelMetadataInfo/getImportLog?page=${page}&rows=10`;
                }

                this.axios.post(url).then(res => {
                    this.loading = false;
                    const {statusCode, message} = res.data;
                    if (statusCode === 200) {
                        Object.assign(this.$data, message);
                    }
                });
            },
            handleCurrentChange(val) {
                this.fetchData(val);
            }
        }
    };
</script>
<style>
    .import-module-header {
        display: -ms-flexbox;
    }
</style>
