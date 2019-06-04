<template>
    <div class="business-detail-container" v-loading="loading">
        <no-data v-if="dataList.length === 0 && (!path || !hasPrivilege)"></no-data>
        <div v-else-if="dataList.length === 0 && hasPrivilege"
             class="no-data"
             @click="addData">
            <span v-html="$t('content.dataset.businessDetail.dqztmysjbqdjtj')"></span>
        </div>
        <div class="tabCon" v-else="dataList.length">
            <div class="boxCommon">
                <div class="table-title">
                    <div class="table-title__text">
                        <span>{{title}}一{{$t('content.dataset.businessDetail.ztlb')}}</span>
                    </div>
                    <div class="table-title__btns" v-if="hasPrivilege">
                        <el-button type="primary" @click.native="addData">
                            {{$t('content.dataset.businessDetail.tjbdgzt')}}
                        </el-button>
                    </div>
                </div>
                <el-table :data="dataList"
                          border
                          :default-sort="{prop: 'datasetName', order: 'ascending'}"
                          @sort-change="sortTable">
                    <el-table-column
                            prop="datasetName"
                            sortable="custom"
                            :label="$t('content.dataset.businessDetail.biaom')">
                        <template slot-scope="scope">
                            <item-jump :params="{
                                          params:{
                                            path:scope.row.path,
                                            id: scope.row.datasetId,
                                          },
                                          isfolder: false
                                       }"
                                       :name="scope.row.datasetName"
                                       :datasetId="scope.row.datasetId"
                                       :view="true">
                            </item-jump>
                        </template>
                    </el-table-column>
                    <el-table-column prop="description" sortable="custom"
                                     :label="$t('content.dataset.datasetDetail.sjms')">
                    </el-table-column>
                    <el-table-column prop="owner"
                                     :label="$t('content.dataset.datasetDetail.sjfzr')"
                                     sortable="custom">
                    </el-table-column>
                    <el-table-column prop="createdTime" :label="$t('content.dataset.businessDetail.cjsj')"
                                     sortable="custom">
                        <template slot-scope="scope">
                            {{scope.row.createdTime}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="size" :label="$t('content.dataset.datasetDetail.dx')" sortable="custom">
                    </el-table-column>
                    <el-table-column prop="lastModifyTime" :render-header="renderHeader"
                                     :label="$t('content.dataset.businessDetail.zhgxsj')" sortable="custom">
                        <template slot-scope="scope">
                            {{scope.row.lastModifyTime}}
                        </template>
                    </el-table-column>
                </el-table>
                <div class="tablePages" v-if="dataList.length">
                    <el-pagination background
                                   layout="total, prev, pager, next"
                                   @size-change="handleSizeChange"
                                   @current-change="handleCurrentChange"
                                   :current-page="currentPage"
                                   :page-size="pageSize"
                                   :total="totalRows"
                                   v-if="totalRows>pageSize">
                    </el-pagination>
                </div>
            </div>
        </div>
        <el-dialog :visible.sync="dialogVisible"
                   :title='`${$t("content.dataset.businessDetail.tjsjd")}-"${title}"${$t("content.dataset.businessDetail.zhut")}`'
                   :close-on-click-modal="closeModal"
                   custom-class="dialogComment">
            <div class="tabs">
                <ul>
                    <li :class="{active: tabType === 'Table'}" @click="tabType='Table'">{{$t('content.tree.jgh')}}</li>
                    <li :class="{active: tabType === 'File'}" @click="tabType='File'">{{$t('content.tree.fjgh')}}</li>
                </ul>
            </div>
            <div class="business-list-container" v-show="tabType === 'Table'">
                <div class="dbList businessCheckBox">
                    <h4 class="business-select-title">{{$t('content.dataset.businessDetail.qxzb')}}：</h4>
                    <el-form class="check-group-container"
                             :model="businessTree"
                             :rules="businessTreeRule"
                             ref="businessTree"
                             @submit.native.prevent
                             style="background: #FFF;">
                        <el-form-item prop="checkList">
                            <div class="addtheme-searchWrap">
                                <input type="text"
                                       :placeholder="$t('content.dataset.businessDetail.qsrnyssdnr')"
                                       v-model="treeSearchKeywords"
                                       @keyup.enter="treeSearch">
                                <input type="text" style="display: none;"/>
                                <button class="search-button" @click="treeSearch">
                                    <span class="el-icon-search"></span>
                                </button>
                            </div>
                            <el-checkbox-group
                                    v-model="businessTree.checkList"
                                    style="min-height: 250px;">
                                <loading :isloading="dialogLoading"></loading>
                                <div style="position: relative; height: 100%;">
                                    <more-loading :isTree="true"
                                                  :isloading="treeBusinessLoading"></more-loading>
                                    <tree-view
                                            :keyword="treeSearchKeywords"
                                            :model="treeData"
                                            v-if="treeData.length !== 0 && !dialogLoading"
                                    ></tree-view>
                                    <no-data
                                            :noDataVisible="treeData.length == 0 && !dialogLoading && !treeBusinessLoading"></no-data>
                                </div>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="select-center">
                    <img :src="imgUrl">
                </div>
                <div class="selected-list-box">
                    <h4 class="business-select-title">
                        {{$t('content.dataset.businessDetail.yxb')}}：({{checkList.length-1}})</h4>
                    <div class="check-group-container selected-check-list">
                        <ul>
                            <li :key="item[0]"
                                v-for="item in selectedList"
                                :title="item[1].path">
                                <div class="selected-list">
                                    <i class="list-top-icon"></i>
                                    <span class="show-title" v-ellipsis="item[1].selectTitle"></span>
                                    <span v-if="item[1].businessName"
                                          v-ellipsis:190="`(${item[1].businessName})`"></span>
                                </div>
                                <i class="el-icon-close" @click="delSelectItem(item[1].selectTitle)"></i>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="business-list-container" v-show="tabType === 'File'">
                <div class="dbList businessCheckBox">
                    <h4 class="business-select-title">{{$t('content.dataset.businessDetail.qxzwj')}}：</h4>
                    <div class="check-group-container">
                        <div class="addtheme-searchWrap file-search">
                            <input type="text"
                                   v-model="fileKeywords"
                                   @keyup.enter="resetTreeSearch"
                                   :placeholder="$t('content.dataset.businessDetail.qsrnyssdnr')">
                            <button class="search-button" @click="resetTreeSearch">
                                <span class="el-icon-search"></span>
                            </button>
                        </div>
                        <template v-if="dialogVisible && !isSearching">
                            <el-tree :props="defaultProps"
                                     :load="loadNode"
                                     node-key="id"
                                     lazy
                                     ref="tree"
                                     @node-click="handleNodeClick">
                                <div class="custom-tree-node" slot-scope="{ node, data }"
                                     :class="{'root-node': data.id === -1}">
                                    <span v-html="emphasizeName(node.label, fileKeywords)"></span>
                                    <template v-if="!data.isFolder">
                                    <span class="icon-checkbox"
                                          :class="{checked: hasId(data.id), disabled: data.inTargetTopic === 'Y'}"></span>
                                    </template>
                                </div>
                            </el-tree>
                        </template>
                    </div>
                </div>
                <div class="select-center">
                    <img :src="imgUrl">
                </div>
                <div class="selected-list-box">
                    <h4 class="business-select-title">
                        {{$t('content.dataset.businessDetail.yxwj')}}：({{allChecked.length}})</h4>
                    <div class="check-group-container selected-check-list">
                        <el-tree :data="selectTreeData" :props="defaultProps" default-expand-all>
                            <div class="custom-tree-node" slot-scope="{ node, data }">
                                <span>{{ node.label }}</span>
                                <template v-if="!data.isFolder">
                                     <span class="icon-checkbox remove"
                                           @click="() => removeNode(node, data)"
                                           :class="{checked: data.checked}"></span>
                                </template>
                            </div>
                        </el-tree>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="dialogVisible = false">{{$t('content.common.qx')}}</el-button>
                <el-button type="primary"
                           :loading="btnLoading"
                           @click="postPath('businessTree')">{{$t('content.common.qd')}}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {
        FormatTime,
        FormatSize,
        testPrivilege,
        Message,
        reStructureTreeData,
        SortTable,
        EmphasizeName
    } from 'mixins/common';
    import TreeView from './BusinessTree.vue';
    import item from 'components/common/TableItemJump';
    import ItemJump from 'common/ItemJump';
    import {mapState} from 'vuex';
    import Bus from 'utils/bus';
    import {
        getDataSource,
        getFileTree,
        getFileTreeData
    } from '@/service/getData';

    export default {
        name: 'businessDetail',
        mixins: [FormatTime, FormatSize, Message, testPrivilege, reStructureTreeData, SortTable, EmphasizeName],
        components: {
            TreeView,
            item,
            ItemJump
        },
        data() {
            let err;
            let businessTreeValid = (rule, value, callback) => {
                if (value.length === 1) {
                    err = true;
                } else {
                    err = false;
                    callback();
                }
            };
            return {
                isSearching: false,
                btnLoading: false,
                allChecked: [],
                defaultProps: {
                    children: 'children',
                    label: 'label',
                    isLeaf: 'leaf'
                },
                businessTreeError: err,
                businessTreeRule: {
                    checkList: [
                        {validator: businessTreeValid}
                    ]
                },
                businessTree: {
                    checkList: []
                },
                loading: false,
                dialogLoading: true,
                dataList: [],
                fields: [],
                closeModal: false,
                dialogVisible: false,
                treeData: [],
                sort: "datasetName",
                order: "asc",
                currentPage: 1,
                totalRows: 1,
                pageSize: 10,
                allNoData: false,
                imgUrl: require('assets/images/icon_select.png'),
                treeSearchKeywords: '',
                idNum: 0,
                tabType: 'Table',    //两种类型:Table,File
                fileKeywords: ''
            };
        },
        created() {
            this.fetchFirst();
        },
        computed: {
            ...mapState({
                tableTypeOpts: 'tableTypeOpts'
            }),
            treeBusinessLoading: {
                get() {
                    return this.$store.state.treeBusinessLoading;
                },
                set(val) {
                    this.$store.dispatch('treeBusinessLoading', val);
                }
            },
            checkList() {
                let newList = new Set();
                this.$store.state.themeCheckList.forEach(v => {
                    newList.add(v.selectPath);
                });
                newList.add('disabled');
                this.businessTree.checkList = [...newList];
                return this.businessTree.checkList;
            },
            selectedList() {
                const newList = new Map();
                this.$store.state.themeCheckList.forEach((v, i) => {
                    newList.set(i, v);
                });
                return [...newList];
            },
            path() {
                let path = this.$route.query.path ? this.$route.query.path : this.$store.state.businessState.path;
                return path;
            },
            title() {
                let title = this.$route.query.title ? this.$route.query.title : this.$store.state.businessState.title;
                return title;
            },
            selectTreeData() {
                let obj = [{
                    label: 'HDFS',
                    isFolder: true,
                    id: 0
                }];

                this.allChecked.forEach(item => {
                    item.pathArray = item.path.split('://')[1].split('/');
                    this.processData(item, obj[0]);
                });
                return obj;
            }
        },
        watch: {
            dialogVisible(val) {
                if (!val) {
                    this.tabType = 'Table';
                    this.btnLoading = false;
                    this.fileKeywords = '';
                }
            },
            tabType() {
                this.fileKeywords = '';
            },
            '$route'(val) {
                if (val.query.path) {
                    this.fetchFirst();
                }
            }
        },
        methods: {
            processData(item, obj) {
                if (item.pathArray.length) {

                    let newObj = {
                        label: item.pathArray[0],
                        isFolder: true
                    };

                    if (item.pathArray.length === 1) {    //当前是文件
                        newObj.id = item.id;
                        newObj.isFolder = false;
                    }

                    if (!obj.children) {   //第一次加
                        obj.children = [];
                        obj.children.push(newObj);
                    } else {
                        if (obj.children.every(child => child.label !== item.pathArray[0])) {
                            obj.children.push(newObj);
                        } else {
                            const index = obj.children.findIndex(child => child.label === item.pathArray[0]);
                            newObj = obj.children[index];
                        }
                    }
                    item.pathArray.splice(0, 1);
                    this.processData(item, newObj);
                }
            },
            resetTreeSearch() {
                this.isSearching = !this.isSearching;
                setTimeout(() => {
                    this.isSearching = !this.isSearching;
                    setTimeout(() => {
                        $('.root-node').click();
                    }, 500);
                }, 500);
            },
            loadNode(node, resolve) {
                if (node.level === 0) {
                    return resolve([
                                {
                                    isLeaf: true,
                                    id: -1,
                                    label: 'HDFS',
                                    isFolder: true,
                                    path: '',     //获取数据源需要,临时增加参数
                                    refId: 0   //表示获取数据源
                                }
                            ]
                    );
                } else {
                    const {refId, locationPrefix} = node.data;
                    let prams = {
                        rows: 10,
                        page: 1,
                        order: '',
                        sort: '',
                        refId,
                        path: locationPrefix,
                        targetTopicPath: this.$route.query.path,
                        keyword: this.fileKeywords
                    };
                    getFileTreeData(prams).then(res => {
                        const {statusCode, message} = res.data;
                        if (statusCode === 200) {
                            message.records.forEach(item => {
                                item.label = item.title;
                                item.isFolder = item.folder;
                                item.leaf = !item.folder;
                                item.checked = false;
                            });
                            resolve(message.records);
                        }
                    });
                }
            },
            removeNode(node, data) {
                this.allChecked = this.allChecked.filter(item => {
                    return item.id !== data.id;
                });
            },
            hasId(id) {
                return this.allChecked.some(item => item.id === id);
            },
            handleNodeClick(data) {
                if (!data.isFolder && data.inTargetTopic === 'N') {
                    data.checked = !data.checked;
                    if (data.checked) {
                        this.allChecked.push(data);
                    } else {
                        this.allChecked = this.allChecked.filter(item => {
                            return item.path !== data.path;
                        });
                    }
                }
            },
            renderHeader: function (h, {column}) {
                return (<span>
                    {column.label}
                    <i class="el-icon-question" title={this.$t('content.dataset.businessDetail.sjhbjggx')} v-tippy/>
                </span>);
            },
            async getExitData() {
                const vm = this;
                vm.businessTreeError = false;
                vm.dialogLoading = true;
                const targetPath = this.$route.query.path;
                let url = `/datasets/treeSelect`;
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
                if (statusCode === 200) {
                    vm.dialogLoading = false;
                    vm.$store.dispatch('treeBusinessLoading', false);
                    const {records} = message;
                    records.length > 0 && vm.setOpen(records);
                    vm.treeData = records;
                    vm.reStructureTreeData();
                }
            },
            isNodata() {
                const routerQuery = this.$route.query;
                const {path} = routerQuery;
                if (path == '') {
                    this.allNoData = true;
                    return;
                } else {
                    this.allNoData = false;
                }
            },
            async fetchFirst() {
                await this.fetchData();
            },
            fetchData(page = 1) {
                this.isNodata();
                let url = '';
                this.loading = true;
                if (this.sort) {
                    url = `/topicDataset/getDatasetInfo?path=${encodeURIComponent(this.path)}&status=${this.tableTypeOpts}&sort=${this.sort}&order=${this.order}&page=${page}&rows=10`;
                } else {
                    url = `/topicDataset/getDatasetInfo?path=${encodeURIComponent(this.path)}&status=${this.tableTypeOpts}&sort=datasetName&order=asc&page=${page}&rows=10`;
                }
                this.axios.get(url, {
                    contentType: 'application/json',
                    dataType: 'json'
                }).then(res => {
                    this.loading = false;
                    const {statusCode, message} = res.body;
                    if (statusCode === 200) {
                        Object.assign(this.$data, message);
                        let _data = [];

                        message.records.forEach((val) => {
                            let {businessName, datasetName, datasourceName, description, size, createdTime, lastModifyTime, datasetId, path, physicalPath, owner} = val;
                            let _obj = {
                                owner,
                                businessName,
                                datasetName,
                                datasourceName,
                                description,
                                datasetId,
                                path,
                                physicalPath,
                                size: this.formatSize(size),
                                createdTime: this.formatTime(createdTime),
                                lastModifyTime: this.formatTime(lastModifyTime)
                            };
                            _data.push(_obj);
                        });
                        this.dataList = _data;
                    } else {
                        this.dataList = [];
                    }

                });
            },
            addData() {
                this.treeSearchKeywords = '';
                this.dialogVisible = true;
                this.dialogLoading = true;
                this.treeBusinessLoading = false;
                this.treeData = [];
                this.businessTreeError = false;
                this.$nextTick(() => {
                    this.$refs['businessTree'].resetFields();
                });
                this.$store.dispatch('addThemeCheckList');
                this.getExitData();
            },
            postPath(formName) {
                let checkData = this.checkList;
                const path = this.$route.query.path;
                const folder = true;
                const disabledIndex = checkData.findIndex(v => {
                    return v === 'disabled';
                });
                checkData.splice(disabledIndex, 1);

                //选中的文件id数组
                let selectFile = [];
                this.allChecked.forEach(item => {
                    selectFile.push(item.id);
                });

                const allIds = [...checkData, ...selectFile];

                if (allIds.length) {
                    const data = {
                        path,
                        datasetIdList: allIds.join(',')
                    };
                    this.btnLoading = true;
                    this.axios.post('/topicDataset/addTopic', data).then(res => {
                        const {statusCode, message} = res.data;
                        if (statusCode === 200) {
                            this.message(this.$t('content.dataset.businessDetail.tjcg'), "success");
                            this.dialogVisible = false;
                            this.allChecked = [];
                            this.tabType = 'Table';
                            this.fetchData();
                            Bus.$emit('refreshTree', {path, datasetId: 0});
                        }
                        this.btnLoading = false;
                    }).catch(() => {
                        this.btnLoading = false;
                    });
                } else {
                    this.$message({
                        message: this.$t('content.dataset.datasetDetail.qzsxzygxm'), //请至少选择一项!,
                        type: 'error'
                    });
                }
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.fetchData(val);
            },
            delSelectItem(item) {
                this.$store.dispatch('delThemeCheckList', item);
            },
            async treeSearch() {
                const vm = this;
                vm.dialogLoading = true;
                const targetPath = this.$route.query.path;
                let url = `/datasets/treeSelect`;
                let params = {
                    targetTopicPath: targetPath,
                    level: 0,
                    path: "",
                    key: vm.treeSearchKeywords,
                    page: 1,
                    rows: 20
                };
                let headerData = {contentType: 'application/json', dataType: 'json'};
                const res = await this.axios.post(url, params, headerData);
                const {statusCode, message} = res.body;
                const {records} = message;
                if (statusCode == 200) {
                    this.treeData = [];
                    this.$store.dispatch('treeBusinessLoading', false);
                    this.dialogLoading = false;
                    vm.setOpen(records);
                    vm.treeData = records;
                    vm.reStructureTreeData();
                } else {
                    vm.treeData = [];
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
            }
        }
    };
</script>
<style lang="less">
    @import '../../../../vars.less';
    .datasetCon .business-detail-container {
        position: relative;
        width: 100%;
        height: 100%;
        min-height: 300px;
    }
    .no-data {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 175px;
        height: 218px;
        background: url("../../@{imagesUrl}/metaData/add_table.png") 0 0 no-repeat;
        cursor: pointer;
        span {
            display: block;
            margin-top: 155px;
            line-height: 25px;
            text-align: center;
        }
    }
    .no-data:hover {
        background-image: url("../../@{imagesUrl}/metaData/add_table_hover.png");
    }
    .business-list-container {
        margin-top: 20px;
        .addtheme-searchWrap {
            display: flex;
            align-items: center;
            .el-icon-search {
                margin-right: 10px;
            }
        }
        .file-search {

        }
    }
    .dialogComment {
        .tabs {
            margin: -20px -30px 20px;
            padding: 20px 30px 0;
            .active {
                background-color: #F3F3F3;
                border-bottom-color: #F3F3F3;
            }
        }
        .selected-list-box {
            height: 400px;
            .selected-check-list {
                overflow: auto;
                border: 1px solid #CCC;
                height: calc(~ '100% - 35px');
            }
        }

        .businessCheckBox {
            border: none;
            .check-group-container {
                position: relative;
                overflow: hidden;
                height: calc(~ '100% - 35px');
                margin-top: 0;
                border: 1px solid #CCC;
                > .el-tree {
                    overflow: auto;
                    margin-top: 36px;
                    height: calc(~ '100% - 36px');
                }
                .el-form-item {
                    height: 100%;
                    .el-form-item__content {
                        height: 100%;
                        .el-checkbox-group {
                            overflow: auto;
                            margin-top: 36px;
                            height: calc(~ '100% - 36px');
                        }
                    }
                }
            }
        }
        .el-tree {
            margin-top: 10px;
        }
        .custom-tree-node {
            position: relative;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 100%;
            padding-right: 25px;
            height: 100%;
            line-height: 26px;
            .icon-checkbox {
                position: absolute;
                right: 5px;
                top: 0;
                height: 100%;
                width: 14px;
                background: url("../../@{imagesUrl}/icon/checkbox.png") center center no-repeat;
                &.checked {
                    background-image: url("../../@{imagesUrl}/icon/checkbox-checked.png");
                }
                &.disabled {
                    background-image: url("../../@{imagesUrl}/icon/checkbox-disabled.png");
                }
                &.remove {
                    background-image: url("../../@{imagesUrl}/icon/remove.png");
                    &:hover {
                        background-image: url("../../@{imagesUrl}/icon/remove-hover.png");
                    }
                }
            }
        }
    }
</style>
