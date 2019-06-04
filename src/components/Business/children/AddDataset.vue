<template>
    <div class="add-dataset">
        <div class="cascader-wrap">
            <span>{{$t("content.dataset.businessDetail.zhut")}}<!--主题-->:</span>
            <el-cascader :placeholder="$t('content.business.qxzy')"
                         :options="options"
                         ref="cascader"
                         expand-trigger="hover"
                         @active-item-change="clickSelectDep"
                         @change="topicChange"
                         :props="optionsProps"
                         :show-all-levels="false"
                         v-model="topicPath">
            </el-cascader>
        </div>
        <ul class="tab-box clearfix">
            <li :class="{active: tabType === 'Table'}" @click="tabType='Table'">
                <span>{{$t('content.tree.jgh')}}</span>
            </li>
            <li :class="{active: tabType === 'File'}" @click="tabType='File'">
                <span>{{$t('content.tree.fjgh')}}</span>
            </li>
        </ul>
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
                                <tree-view :keyword="treeSearchKeywords"
                                           :path="targetTopicPath"
                                           :model="treeData"
                                           v-if="treeData.length !== 0 && !dialogLoading">
                                </tree-view>
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
    import TreeView from './children/BusinessTree.vue';
    import item from 'components/common/TableItemJump';
    import Cascader from './cascader/src/main';
    import ItemJump from 'common/ItemJump';
    import {mapState} from 'vuex';
    import Bus from 'utils/bus';
    import {
        getDataSource,
        getFileTree,
        getFileData,
        listSelectTopic
    } from '@/service/getData';

    export default {
        name: 'businessDetail',
        mixins: [FormatTime, FormatSize, Message, testPrivilege, reStructureTreeData, SortTable, EmphasizeName],
        components: {
            TreeView,
            item,
            ItemJump,
            Cascader
        },
        props: ['dialogVisible', 'id', 'filePath'],
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
                fileKeywords: '',
                options: [],
                topicPath: [],
                optionsProps: {
                    children: 'childTopic',
                    label: 'title',
                    value: 'path'
                }
            };
        },
        created() {
            this.topicPath = [this.filePath.join('/')];
            this.addData();
            listSelectTopic(this.id).then(res => {
                const {statusCode, message} = res.data;
                if (statusCode === 200) {
                    this.removeEmptyArray(message);
                    this.options = message;
                }
            });
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
            },
            targetTopicPath() {
                return this.topicPath[this.topicPath.length - 1] || '';
            }
        },
        watch: {
            dialogVisible(val) {
                if (val) {  //打开弹窗
                    this.addData();
                    listSelectTopic(this.id).then(res => {
                        const {statusCode, message} = res.data;
                        if (statusCode === 200) {
                            this.removeEmptyArray(message);
                            this.options = message;
                        }
                    });
                    this.topicPath = [this.filePath.join('/')];
                } else {
                    this.resetData();
                }
            },
            tabType() {
                this.fileKeywords = '';
            }
        },
        methods: {
            removeEmptyArray(array) {
                array.forEach(item => {
                    if (item.childTopic && item.childTopic.length) {
                        this.removeEmptyArray(item.childTopic);
                    } else {
                        item.childTopic = null;
                    }
                });
            },
            resetData() {
                this.tabType = 'Table';
                this.btnLoading = false;
                this.fileKeywords = this.treeSearchKeywords = '';  //清空关键字
                this.$store.dispatch('addThemeCheckList');  //清空已选表的数据
                this.allChecked = [];   //清空已选择文件的数据
            },
            clickSelectDep(result) {
                const cascader = this.$refs.cascader.menu;
                const menuIndex = result.length - 1;
                let item = {};
                this.$nextTick(() => {
                    const elem = document.querySelectorAll('.el-cascader-menu__item.is-active')[menuIndex];
                    elem.onclick = (e) => {
                        item.value = result[menuIndex];
                        item.label = e.currentTarget.innerText;
                        cascader.select(item, menuIndex);
                    };
                });
            },
            topicChange(currentValue) {
                if (this.tabType === 'Table') {
                    this.getExitData();
                    this.$store.dispatch('addThemeCheckList');  //清空已选表的数据
                } else {
                    this.resetTreeSearch();
                    this.allChecked = [];
                }
            },
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
                        targetTopicPath: this.targetTopicPath,
                        keyword: this.fileKeywords
                    };
                    getFileData(prams).then(res => {
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
            treeSearch() {
                this.dialogLoading = true;
                this.axios.post(`/datasets/treeSelect`, {
                    targetTopicPath: this.targetTopicPath,
                    level: 0,
                    path: "",
                    key: this.treeSearchKeywords,
                    page: 1,
                    rows: 20
                }).then(res => {
                    const {statusCode, message} = res.data;
                    if (statusCode === 200) {
                        const {records} = message;
                        this.treeData = [];
                        this.$store.dispatch('treeBusinessLoading', false);
                        this.dialogLoading = false;
                        this.setOpen(records);
                        this.treeData = records;
                        this.reStructureTreeData();
                    } else {
                        this.treeData = [];
                    }
                });
            },
            getExitData(targetTopicPath) {
                this.businessTreeError = false;
                this.dialogLoading = true;
                this.axios.post('/datasets/treeSelect', {
                    targetTopicPath: this.targetTopicPath,
                    level: 0,
                    path: "",
                    page: 1,
                    rows: 20
                }).then(res => {
                    const {statusCode, message} = res.body;
                    if (statusCode === 200) {
                        this.dialogLoading = false;
                        this.$store.dispatch('treeBusinessLoading', false);
                        const {records} = message;
                        records.length > 0 && this.setOpen(records);
                        this.treeData = records;
                        this.reStructureTreeData();
                    }
                });
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
            addData() {
                this.treeSearchKeywords = '';
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
                const path = this.targetTopicPath;
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
                        datasetId: allIds.join(',')
                    };
                    this.btnLoading = true;
                    this.axios.post(`topicDataset/addTopic/${this.id}`, data).then(res => {
                        const {statusCode, message} = res.data;
                        if (statusCode === 200) {
                            this.message(this.$t('content.dataset.businessDetail.tjcg'), "success");
                            this.$emit('submit');
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
            handleCurrentChange(val) {
                this.fetchData(val);
            },
            delSelectItem(item) {
                this.$store.dispatch('delThemeCheckList', item);
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
    @import '../../../vars.less';
    .add-dataset {
        .tab-box {
            padding: 0 20px;
        }
        .cascader-wrap {
            padding-left: 20px;
            margin-bottom: 20px;
            .el-cascader {
                margin-left: 10px;
                width: 160px;
            }
        }
        .business-list-container {
            margin-top: 0;
            padding: 20px;
            background-color: #FFF;
            border: 1px solid #CCC;
            border-top: none;
        }
        .businessCheckBox {
            border: none;
            width: 450px;
            height: 400px;
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
        .selected-list-box {
            height: 400px;
            width: 300px;
            .selected-check-list {
                overflow: auto;
                border: 1px solid #CCC;
                height: calc(~ '100% - 35px');
                background-color: #FFF;
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
                background: url("../@{imagesUrl}/icon/checkbox.png") center center no-repeat;
                &.checked {
                    background-image: url("../@{imagesUrl}/icon/checkbox-checked.png");
                }
                &.disabled {
                    background-image: url("../@{imagesUrl}/icon/checkbox-disabled.png");
                }
                &.remove {
                    background-image: url("../@{imagesUrl}/icon/remove.png");
                    &:hover {
                        background-image: url("../@{imagesUrl}/icon/remove-hover.png");
                    }
                }
            }
        }
    }
</style>
