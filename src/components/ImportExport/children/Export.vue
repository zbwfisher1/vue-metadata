<template>
    <div class="import-module-container pane" :style="{ flexGrow: 1 }">
        <div class="el-row-wrap">
            <el-row :gutter="40" class="import-module-header">
                <el-col :span="12" @click.native="dataExport">
                    <import-header-item
                            :title="$t('content.dataset.datasetDetail.dcysj')"
                            :content="$t('content.dataset.importExport.dcbyxx')"
                    ></import-header-item>
                </el-col>
                <el-col :span="12" @click.native="ExportFiles">
                    <import-header-item
                            :title="$t('content.importExport.dcwj')"
                            :content="$t('content.dataset.importExport.dcwjyxx')"
                            id="1"
                    ></import-header-item>
                </el-col>
            </el-row>
        </div>
        <div class="boxCommon">
            <div class="tableMulti">
                <div class="table-title">
                    <div class="table-title__text">
                        <span>{{$t('content.dataset.importExport.dcjl')}}</span>
                    </div>
                </div>
            </div>

            <el-table :data="records"
                      border
                      :default-sort="{prop: 'oper_time', order: 'descending'}"
                      @sort-change="sortTable"
                      v-loading="loading">
                <el-table-column prop="oper_time" :label="$t('content.dataset.importExport.dcsj')" sortable="custom">
                    <template slot-scope="scope">
                        {{formatTime(scope.row.oper_time)}}
                    </template>
                </el-table-column>
                <el-table-column prop="operator" :label="$t('content.dataset.importExport.czr')"></el-table-column>
                <el-table-column prop="dataType" :label="$t('content.dataset.importExport.dcjg')">
                    <template slot-scope="scope">
                        <span v-if="scope.row.successCount === 0 && scope.row.failCount === 0" class="export-success">
                            {{$t('content.dataset.importExport.dccgt', [scope.row.successCount])}}
                        </span>
                        <template v-else>
                            <span v-if="scope.row.successCount > 0" class="export-success">{{$t('content.dataset.importExport.dccgt', [scope.row.successCount])}}</span>
                            <span v-if="scope.row.successCount > 0 && scope.row.failCount > 0">,</span>
                            <span v-if="scope.row.failCount > 0" class="export-fail">{{$t('content.dataset.importExport.dcsbt', [scope.row.failCount])}}</span>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
            <div class="tablePages" v-if="records.length > 0 && !loading">
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

        <el-dialog :title="$t('content.dataset.datasetDetail.xzdcdysj')"
                   :visible.sync="dialogVisible"
                   width="750px"
                   :close-on-click-modal="false">
            <div class="dbList businessCheckBox">
                <el-form class="check-group-container"
                         :model="exportTree"
                         @submit.native.prevent
                         ref="exportTree">
                    <div class="addtheme-searchWrap">
                        <input type="text"
                               :placeholder="$t('content.dataset.businessDetail.zcdggjz')"
                               v-model="searchContent"
                               @keyup.enter="searchClick">
                        <input type="text" style="display: none;"/>
                        <button class="search-button" @click="searchClick">
                            <span class="el-icon-search"></span>
                        </button>
                    </div>
                    <loading :isloading="treeLoading"></loading>
                    <div style="position: relative;">
                        <div v-if="treeMoreLoading" class="tree-dialog-loading-container">
                            <more-loading :isTree="true" :isloading="treeMoreLoading"></more-loading>
                        </div>
                        <no-data v-if="!treeLoading && treeData.length == 0 && !treeMoreLoading"></no-data>
                        <el-checkbox-group v-model="exportList" v-if="!treeLoading && treeData.length != 0">
                            <physical-export-tree :model="treeData"></physical-export-tree>
                        </el-checkbox-group>
                    </div>
                </el-form>
            </div>
            <div class="import-validator">
                <span v-if="validatorShow">{{$t('content.validator.zsxzyx')}}</span>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button
                        :disabled="exportDisable"
                        @click="dialogVisible = false">
                    {{$t('content.common.qx')}}
                </el-button>
                <el-button
                        :disabled="exportDisable"
                        type="primary"
                        @click="submitData"
                        v-loading.fullscreen.lock="fullscreenLoading">
                    {{$t('content.common.qd')}}
                </el-button>
            </div>
        </el-dialog>
        <el-dialog
                :title="dialogTitle"
                :visible.sync="dialogDetailVisible"
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
        <el-button type="primary" @click="dialogDetailVisible=false">确 认</el-button>
      </span>
        </el-dialog>
        <el-dialog :visible.sync="treeDialog"
                   :title="$t('content.dataset.datasetDetail.xzdcdysj')"
                   width="750px">
            <export-tree :isOpen="treeDialog"
                         v-on:fetch:data="fetchListData"
                         v-on:update:visible="treeDialog = $event"></export-tree>
        </el-dialog>
    </div>
</template>
<script>
    import {mapState} from 'vuex';
    import {FormatTime, reStructureTreeData, SortTable} from 'mixins/common';
    import FileSaver from 'file-saver';
    import importHeaderItem from './children/importHeaderItem';
    import PhysicalExportTree from '@/components/MetaData/Dataset/PhysicalExportTree/PhysicalExportTree';
    import ExportTree from "@/components/Files/children/ExportTree";

    export default {
        components: {
            importHeaderItem,
            PhysicalExportTree,
            ExportTree
        },
        mixins: [FormatTime, reStructureTreeData, SortTable],
        data() {
            const vm = this;
            return {
                treeDialog: false,
                exportDisable: false,
                dialogVisible: false,
                treeData: [],
                showList: [],
                sort: "oper_time",
                order: "desc",
                records: [],
                currentPage: 1,
                totalRows: 1,
                dialogDetailVisible: false,
                dialogTitle: '',
                loading: true,
                treeLoading: true,
                validatorShow: false,
                fullscreenLoading: false,
                activeOnly: true,
                exportTree: null,
                searchContent: ''
            };
        },
        created() {
            this.fetchData();
        },
        computed: {
            ...mapState({
                exportList: 'exportList',
                exportDBList: 'exportDBList',
                treeMoreLoading: 'treeBusinessLoading'
            })
        },
        watch: {
            dialogVisible(val) {
                this.validatorShow = val ? false : this.validatorShow;
            }
        },
        methods: {
            fetchListData() {
                this.fetchData();
            },
            ExportFiles() {
                this.treeDialog = true;
            },
            searchClick() {
                console.log('exportList:', this.exportList);
                this.treeData = [];
                this.treeLoading = true;
                this.validatorShow = false;
                this.$store.dispatch('saveExportSearch', this.searchContent);
                let params = {
                    targetTopicPath: this.$route.query.path,
                    level: 0,
                    path: "",
                    key: this.searchContent,
                    page: 1,
                    rows: 20
                };
                this.axios.post(`/excelMetadataInfo/treeSelect`, params).then(res => {
                    const {statusCode, message} = res.data;
                    const {records} = message;
                    if (statusCode === 200) {
                        this.treeLoading = false;
                        this.setOpen(records);
                        this.treeData = records;
                        this.noDataVisible = this.treeData.length !== 0;
                        if (this.$store.state.getIsBusiness) {
                            this.reStructureBusinessData();
                        } else {
                            this.reStructureTreeData();
                        }
                        this.$store.dispatch('clearExportCheckList', []);
                    } else {
                        this.treeData = [];
                        this.noDataVisible = true;
                    }
                });
            },
            reStructureBusinessData() {
                let hasNextPage = true;
                let path = '';

                function checkChildren(data) {
                    data.forEach((val, index) => {
                        let arrPath = val.path.split('/');
                        arrPath.pop();
                        let newPath = arrPath.join('/');
                        if (val.children) {
                            if (val.children.hasNextPage) {
                                const {path, level} = val;
                                val.children.records.push({type: 'more', children: [], path, level});
                            } else {
                                checkChildren(val.children.records);
                            }
                        }
                    });
                }

                checkChildren(this.treeData);
            },
            tableSort({sort, order}) {
                this.sort = sort;
                this.order = order;
                this.fetchData();
            },
            dataExport() {
                this.$store.dispatch('clearExportCheckList', []);
                this.searchContent = '';
                this.$store.dispatch('saveExportSearch', '');
                this.dialogVisible = true;
                this.fetchTreeData();
            },
            async fetchData(page = 1) {
                this.loading = true;

                let url = '';
                if (this.sort) {
                    url = `/excelMetadataInfo/getExportLog?sort=${this.sort}&order=${this.order}&page=${page}&rows=10`;
                } else {
                    url = `/excelMetadataInfo/getExportLog?page=${page}&rows=10`;
                }

                this.axios.post(url).then(res => {
                    this.loading = false;
                    const {statusCode, message} = res.data;
                    if (statusCode === 200) {
                        Object.assign(this.$data, message);
                    }
                });
            },
            async fetchTreeData() {
                const vm = this;
                vm.treeLoading = true;
                const targetPath = this.$route.query.path;
                let url = '/excelMetadataInfo/treeSelect';
                let params = {
                    targetTopicPath: targetPath,
                    level: 0,
                    path: "",
                    page: 1,
                    rows: 20
                };
                let headerData = {contentType: 'application/json', dataType: 'json'};
                const res = await this.axios.post(url, params, headerData);
                const {statusCode, message} = res.body;
                vm.treeLoading = false;
                if (statusCode === 200) {
                    const {records} = message;
                    records.length > 0 && vm.setOpen(records);
                    vm.treeData = records;
                    vm.reStructureTreeData();
                }
            },
            setOpen(value) {
                const vm = this;
                if (!value.length) {
                    return;
                }
                value.map(val => {
                    if (val.children) {
                        vm.$set(val, 'open', true);
                        vm.setOpen(val.children.records);
                    } else {
                        vm.$set(val, 'open', false);
                    }
                });
            },
            async submitData() {
                this.exportDisable = true;
                if (this.exportList.length === 0 && this.exportDBList.length === 0) {
                    this.validatorShow = true;
                    this.exportDisable = false;
                } else {
                    this.validatorShow = false;
                    let newExportList = [];
                    this.exportList.forEach(val => {
                        typeof val === 'number' && newExportList.push(val);
                    });
                    const datasetIds = newExportList && newExportList.join(',');
                    let urn = this.exportDBList && this.exportDBList.join(',');
                    const lang = this.$i18n.locale;

                    let ignoreWarn = 'true';
                    let key = this.searchContent;
                    const activeOnly = this.activeOnly;
                    this.fullscreenLoading = true;

                    this.axios.post('/excelMetadataInfo/export', {
                        key,
                        urn,
                        datasetIds,
                        lang,
                        ignoreWarn,
                        responseparameterType: 'arraybuffer'
                    }, {
                        responseType: 'arraybuffer'
                    }).then(res => {
                        this.exportDisable = false;
                        this.fullscreenLoading = false;
                        this.dialogVisible = false;
                        this.downFile(res.data);
                        this.fetchData();
                    });
                }
            },
            async downFile(data) {
                let blob = new Blob([data], {type: 'application/vnd.ms-excel'});
                let date = new Date();
                let fileName = `${this.$t('content.dataset.datasetDetail.dcysj')}${date.getFullYear()}-${date.getMonth() < 9 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)}-${date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()}-${date.getHours()}-${date.getMinutes()}.xlsx`;

                await FileSaver.saveAs(blob, fileName);
                this.fetchData();
                this.$store.dispatch('clearExportCheckList', []);
            },
            exportSuccess(detail) {
                const vm = this;
                this.showList = [];
                this.dialogDetailVisible = true;
                this.dialogTitle = this.$t('content.dataset.importExport.dccgt', [detail.length]);
                detail.forEach(val => {
                    this.showList.push({name: val.tableName, state: vm.$t('content.dataset.importExport.dccg')});
                });
            },
            exportFail(detail) {
                const vm = this;
                this.showList = [];
                this.dialogDetailVisible = true;
                this.dialogTitle = this.$t('content.dataset.importExport.dcsbt', [detail.length]);
                detail.forEach(val => {
                    const reason = vm.errorCodeTranslate(val.errorCode);
                    this.showList.push({
                        name: val.tableName,
                        state: vm.$t('content.dataset.importExport.dcsb'),
                        reason
                    });
                });
            },
            handleCurrentChange(val) {
                this.fetchData(val);
            }
        }
    };
</script>
<style lang="less">
    .import-module-container {
        .el-dialog--small {
            width: 540px;
        }
        .el-row-wrap {
            margin-left: 20px;
            margin-right: 20px;
        }
    }
</style>
