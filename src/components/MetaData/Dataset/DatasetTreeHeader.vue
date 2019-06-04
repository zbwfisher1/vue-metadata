<template>
    <div class="searchCon searchCon__search">
        <div class="search-line">
            <div class="search-container">
                <div class="data-search" :class="{'has-flex-grow': hasImport}">
                    <div class="searchWrap" v-if="searchVisible">
                        <input type="text"
                               :placeholder="$t('content.common.ssgjz')"
                               :title="treeSearchKeywords"
                               v-model="treeSearchKeywords"
                               @keyup.enter="treeSearch">
                        <span v-if="treeSearchKeywords.length>0"
                              class="tree-search-input-delete el-icon-circle-close"
                              @click="resetTreeData"></span>
                        <a href="javascript:;" class="tree-control-icon" @click="treeSearch"></a>
                    </div>
                    <h4 v-else class="dataset-tree-title">
                        {{getIsBusiness ? $t('content.header.ywfl') : $t('content.header.sjj')}}
                    </h4>
                </div>
                <div class="data-controler">
                    <i v-if="!searchVisible"
                       @click="showSearchInput"
                       class="tree-control-icon icon1"
                       :title="$t('content.header.sscx')"></i>
                    <i class="tree-control-icon icon2"
                       @click.stop="dataExport"
                       v-if="hasImport"
                       :title="$t('content.header.daoc')"
                    ></i>
                    <i class="tree-control-icon icon3"
                       v-if="hasImport && hasPrivilege"
                       @click="collectionDialog = true"
                       :title="$t('content.header.daor')"></i>
                </div>
            </div>
        </div>

        <!--导出元数据弹窗-->
        <el-dialog
                :title="$t('content.dataset.datasetDetail.xzdcdysj')"
                width="800px"
                @submit.native.prevent
                :visible.sync="dialogVisible"
                :close-on-click-modal="false">
            <div class="dbList businessCheckBox">
                <el-form class="check-group-container"
                         :model="exportTree"
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
                    <loading :isloading="loadingVisible"></loading>
                    <div style="position: relative;">
                        <div v-if="treeBusinessLoading" class="tree-dialog-loading-container">
                            <more-loading :isTree="true" :isloading="treeBusinessLoading"></more-loading>
                        </div>
                        <el-checkbox-group v-model="exportList" v-if="!loadingVisible">
                            <no-data :noDataVisible="!treeData.length"></no-data>
                            <physical-export-tree :model="treeData"></physical-export-tree>
                        </el-checkbox-group>
                    </div>
                </el-form>
            </div>
            <div class="import-validator" v-if="validatorShow">
                {{$t('content.validator.zsxzyx')}}
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
        <!--导入弹窗-->
        <el-dialog :visible.sync="collectionDialog"
                   class="create-task-dialog"
                   :title="$t('content.importExport.yxxhq')"
                   width="800px">
            <el-form label-position="left">
                <el-form-item :label="$t('content.importExport.hqfs')">  <!--获取方式-->
                    <el-select v-model="importValue" :placeholder="$t('content.common.qxz')"><!--请选择-->
                        <el-option :label="$t('content.importExport.sjycj')" :value="1"></el-option>  <!--数据源采集-->
                        <el-option :label="$t('content.importExport.excel')" :value="2"></el-option> <!--Excel导入-->
                    </el-select>
                </el-form-item>
            </el-form>
            <create-task :visible="collectionDialog" type="tables" v-show="importValue === 1"></create-task>
            <div class="dialog-footer" v-if="importValue === 2" slot="footer">
                <el-button type="primary" @click="handleDataImport">
                    {{$t('content.common.qd')}}
                </el-button>
                <el-button @click="collectionDialog = false">{{$t('content.common.qx')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import PhysicalExportTree from './PhysicalExportTree/PhysicalExportTree';
    import {mapState} from 'vuex';
    import {testPrivilege, reStructureTreeData, Message} from 'mixins/common';
    import Bus from 'utils/bus';
    import FileSaver from 'file-saver';
    import CreateTask from '@/components/ImportExport/children/children/CreateTask';

    export default {
        name: 'TreeHeader',
        mixins: [testPrivilege, reStructureTreeData, Message],
        components: {
            PhysicalExportTree,
            CreateTask
        },
        data() {
            return {
                exportDisable: false, //导出时是否禁用确定按钮
                exportTree: null,
                fullscreenLoading: false,
                searchVisible: false,
                treeSearchKeywords: '',//搜索关键字
                dialogVisible: false,
                treeData: [],
                hasImport: false,
                validatorShow: false,
                searchContent: '',
                loadingVisible: true,
                noDataVisible: false,
                filterOpts: [],
                filterOptsActive: true,
                filterOptsDeleted: true,
                filterOptsUnknown: true,
                filterOptsConVisible: false,
                thisRouter: '',
                filterTimer: '',
                activeOnly: true,
                collectionDialog: false,
                importDialog: false,
                importValue: 1,
                btnLoading: false,
            };
        },
        // treeSearchKeywords
        async created() {
            this.hasImport = /Physical/.test(this.$route.path);
            this.testPrivilege('/excelMetadataInfo/import');
            this.filterOptsActive = true;
            this.filterOptsDeleted = true;
            this.filterOptsUnknown = true;
            this.changeFilterOpts();
            this.thisRouter = this.$route.name;
            Bus.$on('show:keyword', (key) => {
                this.searchVisible = true;
                this.treeSearchKeywords = key;
            });
            Bus.$on('open:import:dialog', () => {
                this.collectionDialog = true;
            });
        },
        mounted() {
            this.$nextTick(() => {
                const vm = this;
                document.onclick = function (e) {
                    let target = $(e.target).hasClass('searchWrap') || $(e.target).parents().hasClass('searchWrap') || $(e.target).hasClass('icon1');
                    if (!target) {
                        vm.searchVisible = false;
                    }
                };
            });
        },
        watch: {
            tableTypeOpts(newVal, oldVal) {
                var _filterOpts = newVal.split(',');

                this.filterOptsActive = _filterOpts.indexOf('0') > -1 ? true : false;
                this.filterOptsDeleted = _filterOpts.indexOf('1') > -1 ? true : false;
                this.filterOptsUnknown = _filterOpts.indexOf('2') > -1 ? true : false;
            },
            getIsBusiness(newData, oldData) {
                this.clearSearch();
                this.filterOptsActive = true;
                this.filterOptsDeleted = true;
                this.filterOptsUnknown = true;

                var _filterOpts = [];
                if (this.filterOptsActive) {
                    _filterOpts.push(0);
                }
                if (this.filterOptsDeleted) {
                    _filterOpts.push(1);
                }
                if (this.filterOptsUnknown) {
                    _filterOpts.push(2);
                }
                this.$store.dispatch('changeTableTypeOpts', _filterOpts.join(','));
            },
            dialogVisible(val) {
                this.validatorShow = val ? false : this.validatorShow;
                if (val) {
                    this.$store.dispatch('saveExportSearch', '');
                    this.searchContent = '';
                    this.noDataVisible = false;
                }
            },
            filterOptsActive(val) {
                if (!this.filterOptsDeleted && !this.filterOptsUnknown) {
                    this.filterOptsActive = true;
                    return;
                }
            },
            filterOptsDeleted() {
                if (!this.filterOptsActive && !this.filterOptsUnknown) {
                    this.filterOptsDeleted = true;
                    return;
                }
            },
            filterOptsUnknown() {
                if (!this.filterOptsDeleted && !this.filterOptsActive) {
                    this.filterOptsUnknown = true;
                    return;
                }
            },
            '$route'(val) {
                this.hasImport = !!/Physical/.test(val.path);

                //如果用户直接进入的是物理视图,业务视图路由,需要清空以前搜索记录
                if (val.name === "Dataset" || val.name === "Physical") {
                    this.treeSearchKeywords = '';
                }
            }
        },
        computed: {
            ...mapState({
                tableTypeOpts: 'tableTypeOpts',
                exportList: 'exportList',
                exportDBList: 'exportDBList',
                getIsBusiness: 'isBusiness',
                treeBusinessLoading: 'treeBusinessLoading'
            })
        },
        methods: {
            handleDataImport() {
                if (this.importValue === 1) {
                    this.collectionDialog = true;
                } else {
                    this.$store.dispatch('saveRouter', 'Physical');
                    this.$router.push({name: 'DataImport'});
                }
            },
            filterOptsConToggle() {
                if (this.filterOptsConVisible) {
                    this.filterOptsActive = this.filterOpts[0];
                    this.filterOptsDeleted = this.filterOpts[1];
                    this.filterOptsUnknown = this.filterOpts[2];

                    this.filterOptsConVisible = false;
                } else {
                    this.filterOpts = [this.filterOptsActive, this.filterOptsDeleted, this.filterOptsUnknown];
                    this.filterOptsConVisible = true;
                }
            },
            filterOptsConHide() {
                this.filterOptsActive = this.filterOpts[0];
                this.filterOptsDeleted = this.filterOpts[1];
                this.filterOptsUnknown = this.filterOpts[2];

                this.filterOptsConVisible = false;
            },
            filterOptsSubmit() {
                this.changeFilterOpts();
                this.filterOptsConVisible = false;
            },
            changeFilterOpts() {
                var _filterOpts = [];
                if (this.filterOptsActive) {
                    _filterOpts.push(0);
                }
                if (this.filterOptsDeleted) {
                    _filterOpts.push(1);
                }
                if (this.filterOptsUnknown) {
                    _filterOpts.push(2);
                }
                this.$store.dispatch('changeTableTypeOpts', _filterOpts.join(','));
                Bus.$emit('initTree');
            },
            async searchClick() {
                this.loadingVisible = true;
                this.validatorShow = false;
                const vm = this;
                this.treeData = [];
                this.loading = true;
                this.$store.dispatch('saveExportSearch', this.searchContent);
                const targetPath = this.$route.query.path;
                let url = `/excelMetadataInfo/treeSelect`;
                let params = {
                    targetTopicPath: targetPath,
                    level: 0,
                    path: "",
                    key: vm.searchContent,
                    page: 1,
                    rows: 20
                };
                let headerData = {contentType: 'application/json', dataType: 'json'};
                const res = await this.axios.post(url, params, headerData);
                const {statusCode, message} = res.body;
                const {records} = message;
                if (statusCode == 200) {
                    this.loadingVisible = false;
                    this.loading = false;
                    this.setOpen(records);
                    this.treeData = records;
                    this.noDataVisible = this.treeData.length == 0 ? true : false;
                    if (this.$store.state.getIsBusiness) {
                        vm.reStructureBusinessData();
                    } else {
                        vm.reStructureTreeData();
                    }
                } else {
                    vm.treeData = [];
                    this.noDataVisible = true;
                }
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
            resetTreeData() {
                this.treeSearchKeywords = '';
                Bus.$emit('searchKeyword:header', '');
                this.$store.dispatch('saveDatasetKeyword', '');
            },
            showSearchInput() {
                this.searchVisible = true;
            },
            clearSearch() {
                this.treeSearchKeywords = '';
            },
            pushToImport() {
                this.$store.dispatch('saveRouter', 'PhysicalDetail');
                this.$router.push({name: 'DataImport'});
            },
            treeSearch() {
                this.$store.dispatch('saveDatasetKeyword', this.treeSearchKeywords);
            },
            dataExport() {
                this.fetchTreeData();
                this.$store.dispatch('clearExportCheckList', []);
                this.dialogVisible = true;
            },
            async fetchTreeData() {
                const vm = this;
                vm.loadingVisible = true;
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
                const {records} = message;
                if (statusCode === 200) {
                    vm.loadingVisible = false;
                    vm.setOpen(records);     //把有子节点设置为展开状态
                    vm.treeData = records;

                    let childItem = null;

                    function getChildrenList(data) {
                        data.children && data.children.records.forEach(item => {
                            if (item.level == 2) {
                                childItem = item;
                            } else if (item.hasChild) {
                                getChildrenList(item);
                            }
                        });
                    }

                    this.treeData.forEach(val => {
                        getChildrenList(val);
                    });
                    if (!childItem.hasChild) {
                        //this.noDataVisible = true;
                        //this.message('您账号下暂没有可导出的元数据', "error");
                    }

                    this.reStructureTreeData();
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
                        typeof val == 'number' && newExportList.push(val);
                    });
                    if (newExportList.length) {
                        this.fullscreenLoading = true;

                        let datasetIds = newExportList && newExportList.join(',');
                        let urn = this.exportDBList && this.exportDBList.join(',');
                        let ignoreWarn = 'true';
                        const lang = this.$i18n.locale;
                        const key = this.$store.state.exportSearh;
                        const activeOnly = this.activeOnly;

                        this.axios.post('/excelMetadataInfo/export',
                                {
                                    urn,
                                    datasetIds,
                                    lang,
                                    ignoreWarn,
                                    key,
                                    activeOnly,
                                    responseparameterType: 'arraybuffer'
                                },
                                {
                                    responseType: 'arraybuffer',
                                    timeout: 20000
                                })
                                .then(res => {
                                    this.exportDisable = false;
                                    this.fullscreenLoading = false;
                                    this.dialogVisible = false;
                                    this.downFile(res.data);
                                });
                    }
                }
            },
            downFile(data) {
                let blob = new Blob([data], {type: 'application/vnd.ms-excel'});
                let date = new Date();
                let fileName = `${this.$t('content.dataset.datasetDetail.dcysj')}${date.getFullYear()}-${date.getMonth() < 9 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)}-${date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()}-${date.getHours()}-${date.getMinutes()}.xlsx`;

                FileSaver.saveAs(blob, fileName);
                this.$store.dispatch('clearExportCheckList', []);
            }
        }
    };
</script>
<style lang="less">
    .searchCon {
        height: 40px;
        padding: 0;
        margin: 0 15px 5px;
        border-bottom: 1px dashed #DDD;
    }
    .filterOpts {
        z-index: 1;
        position: absolute;
        top: 45px;
        left: 0;
        width: 255px;
        background: #FFF;
        box-shadow: 0 8px 8px rgba(0, 0, 0, .2);

        .btnSubmit {
            float: right;
            height: 28px;
            margin: 20px 20px 20px -10px;
            padding: 0 16px !important;
            line-height: 26px;
            font-size: 13px;
        }
        ul {
            padding: 10px 20px;
            border-top: 1px solid #DDD;
            border-bottom: 1px solid #DDD;
        }
        li {
            padding: 5px 0
        }
        .cb {
            .el-checkbox__input {
                margin-top: -2px;
            }
            .el-checkbox__label {
                font-size: 12px;
                padding-left: 3px;
            }
            .el-checkbox__inner {
                border-radius: 3px;
                zoom: 0.8
            }
        }
    }
    .search-container {
        display: flex;
        justify-content: space-between;
    }
    .has-flex-grow {
        margin-right: 15px;
    }
    .data-search {
        flex-grow: 1;
    }
    .data-controler {
        display: flex;
        align-items: center;
        i {
            margin-right: 20px;
            &:last-child {
                margin-right: 0;
            }
        }
    }
    .searchCon__search {
        .dbList {
            margin: 0;
            .el-radio-group {
                padding-left: 0;
                padding-top: 0;
                padding-bottom: 20px;
            }
        }
        .el-row {
            margin: 0;
        }
    }
</style>
