<template>
    <div class="tree-wrapper" v-if="getIsBusiness || folder.tableNum>0 || folder.level>=4 || folder.type=='more'">
        <div v-if="folder.folder">
            <section class="tit" :class="classActive">
                <span class="icon" :class="classType"></span>
                <span class="folder-name" v-ellipsis="folder.title"></span>
                <div class="setting-container"
                     v-if="isBusiness && hasPrivilege"
                     @mouseenter="displayToolBar($event)"
                     @mouseleave="hideToolBar($event)">
                <span class="setting-con">
                    <span class="setting-icon"></span>
                    <div class="qtip qtip-custom qtip-default qtip-light qtip-shadow qtip-pos-tc qtip-focus">
                        <div class="triangle-border tb-border"></div>
                        <div class="triangle-border tb-background"></div>
                        <div class="qtip-content">
                            <ul class="setting-con__toolBar" :class="{ 'setting-con__arrow': arrowPosition}"
                                :style="position">
                                <li @click.stop="actionsDispatch('add')" v-if="folder.level < 10">{{$t('content.tree.xjzzt')}}</li>
                                <li @click.stop="actionsDispatch('edit')">{{$t('content.tree.xgmc')}}</li>
                                <li @click.stop="actionsDispatch('del')">{{$t('content.tree.sczt')}}</li>
                            </ul>
                        </div>
                      </div>
            </span>
                </div>
                <span v-if="isBusiness && folder.hasChild" class="foldToggle" :class="{open: folder.open}"></span>
                <span :class="['folder-table-num', isBusiness ? 'folder-table-num-business' : '']">({{folder.tableNum}})</span>
                <span v-if="!isBusiness" class="foldToggle" :class="{open: folder.open}"></span>
            </section>
            <tree-view
                    v-if="folder.open"
                    :model="treeData"
                    :hasPrivilege="hasPrivilege"
                    :isBusiness="isBusiness">
            </tree-view>
        </div>
        <a v-else-if="folder.type!= 'more'"
           href="javascript:;"
           class="tit"
           :class="classActive">
            <span class="icon" :class="classType"></span>
            <div class="setting-container" v-if="isBusiness && hasPrivilege" @mouseenter="displayToolBar($event)"
                 @mouseleave="hideToolBar($event)">
				<span class="setting-con">
				 	<span class="setting-icon"></span>
                  <div class="qtip qtip-custom qtip-default qtip-light qtip-shadow qtip-pos-tc qtip-focus">
                      <div class="triangle-border tb-border"></div>
                      <div class="triangle-border tb-background"></div>
                      <div class="qtip-content">
                        <ul class="setting-con__toolBar" :style="position">
                          <li @click.stop="delDataset">{{$t('content.tree.ycgzt')}}</li>
                        </ul>
                      </div>
                    </div>
				 </span>
            </div>
            <span v-ellipsis:70%="emphasizeName(folder.title,keyword)"></span>
            <div class="lucky-try" v-if="folder.status=='Y'"></div>
        </a>
        <div v-else
             class="load-more"
             @click="loadeMore"
             :class="{isBusinessLoad: getIsBusiness}">
            {{$t('content.common.jzgd')}}
        </div>
        <el-dialog :title="curAction == 'add'? $t('content.tree.xjzzt'):$t('content.tree.xgztm')"
                   :visible.sync="dialogFormVisible"
                   width="385px"
                   @click.native.stop>
            <el-form :model="addFileForm"
                     :rules="addFileRules"
                     ref="addFileForm">
                <el-row :gutter="24">
                    <el-col :span="20" :offset="2">
                        <el-form-item prop="name">
                            <el-input v-model="addFileForm.name" autofocus :placeholder="$t('content.tree.qsrztm')"
                                      @keyup.native.enter="addOrEditCommit('addFileForm')"></el-input>
                            <input type="text" style="display: none;">
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">{{$t('content.common.qx')}}</el-button>
                <el-button type="primary" @click="addOrEditCommit('addFileForm')">{{$t('content.common.qd')}}
                </el-button>
            </div>
        </el-dialog>
        <el-dialog
                :title="$t('content.common.tis')"
                :visible.sync="delDialogVisible"
                width="385px"
                :close-on-click-modal="false"
                @click.native.stop>
            <div class="del-content">
                {{folder.folder ? $t('content.tree.qrsczt') : $t('content.tree.qrycb')}}
                <div v-ellipsis='`"${folder.title}"?`'></div>

            </div>
            <div slot="footer" class="dialog-footer">
                <el-button
                        @click="delDialogVisible = false">
                    {{$t('content.common.qx')}}
                </el-button>
                <el-button
                        type="primary" @click="delDatasetFetch()">
                    {{$t('content.common.qd')}}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import TreeView from './DatasetTree.vue';
    import {Message, EmphasizeName, resetValidators} from 'mixins/common'; //搜索结果高亮
    import {themeNameValidate} from 'utils/validator';
    import {mapState} from 'vuex';
    import Bus from 'utils/bus';
    import 'assets/libs/qtip/jquery.qtip.css';
    import {httpRequest} from 'utils';

    export default {
        name: 'item',
        mixins: [Message, EmphasizeName, resetValidators],
        components: {
            TreeView
        },
        data() {
            return {
                treeData: [],
                position: {left: 0, top: 0},
                arrowPosition: false,
                dialogFormVisible: false,
                delDialogVisible: false,
                dialogTreeData: [],
                loading: true,
                addFileForm: {
                    name: ''
                },
                addFileRules: {
                    name: [
                        {required: true, message: this.$t('content.tree.qsrztm'), trigger: 'blur'},
                        {min: 1, max: 50, message: this.$t('content.tree.ztmbcg'), trigger: 'blur'},
                        {validator: themeNameValidate, trigger: 'blur'}
                    ]
                },
                curAction: '',//当前操作
                timerArr: [],//定时队列
                currentPage: 1
            };
        },
        props: {
            folder: Object,
            isBusiness: Boolean,
            hasPrivilege: Boolean,
            model: Array
        },
        mounted() {
            if (this.folder.children) {
                const hasChildren = new Set(this.folder.children.records);
                this.treeData = [...hasChildren];
            } else {
                this.treeData = [];
            }
        },
        watch: {
            'folder.open': async function (val) {
                if (this.folder.open) {
                    this.fetchChildren();
                    this.timerArr = [];
                } else {
                    this.treeData = [];
                    this.timerArr.forEach((val) => {
                        clearTimeout(val);
                    });
                }
            }
        },
        computed: {
            classActive() {
                return {
                    active: (!this.isActive.datasetId || this.isActive.datasetId === this.folder.datasetId) && this.isActive.path === this.folder.path
                };
            },
            classType() {
                const {level, folder, path, datasetType} = this.folder;

                if (this.isBusiness) {
                    return {
                        'fold-icon': folder,
                        'table-icon': !folder && datasetType === 'Table',
                        'table-view-icon': !folder && datasetType === 'View',
                        'doc-icon': !folder && datasetType === 'File'
                    };
                } else {
                    return {
                        'type-icon': level === 1,
                        'type-hbase-icon': level === 1 && path === 'hbase',
                        'fold-icon': level === 2,
                        'db-icon': level === 3,
                        'table-icon': datasetType === 'Table',
                        'table-view-icon': datasetType === 'View'
                    };
                }
            },
            url() {
                let _url = "";
                if (this.isBusiness) {
                    _url = '/topic/tree';
                } else {
                    _url = '/datasets/tree';
                }
                return _url;
            },
            newPath() {
                const {path, level} = this.folder;
                let newPath = "";
                let _pathArr = [];
                if (level != 1 && path) {
                    _pathArr = path.split('/');
                    _pathArr.pop();
                    newPath = _pathArr.join('/');
                } else {
                    let setArr = new Set();
                    if (Array.isArray(this.model)) {
                        this.model.forEach((v, index) => {
                            setArr.add(v.path);
                        });
                    }
                    if (setArr.has(path)) {
                        let newArr = [...setArr];
                        let index = newArr.indexOf(path);
                        if (index - 1 >= 0) {
                            newPath = this.model[index - 1]['path'];
                        } else if (this.model.length == 1) {
                            newPath = '';
                        } else if (index + 1 == 1) {
                            newPath = this.model[index + 1]['path'];
                        } else {
                            newPath = '';
                        }
                    }
                }
                return newPath;
            },
            ...mapState({
                tableTypeOpts: 'tableTypeOpts',
                keyword: "datasetKeyword",
                isActive: "treeItemActive",
                selectItem: "selectItem",
                getIsBusiness: 'isBusiness'
            })
        },
        methods: {
            async loadeMore() {
                this.$store.dispatch('treeLoading', true);
                const vm = this;
                let path = this.folder.path,
                        level = this.$store.state.isBusiness ? this.folder.level : 3;
                ++this.currentPage;
                const targetTopicPath = this.$route.query.path;
                let params = Object.create(null);
                if (this.tableTypeOpts == '0,1,2') {
                    params = {
                        level,
                        path,
                        targetTopicPath,
                        page: vm.currentPage,
                        rows: 20
                    };
                } else {
                    params = {
                        level,
                        path,
                        targetTopicPath,
                        page: vm.currentPage,
                        rows: 20,
                        status: this.tableTypeOpts
                    };
                }

                const url = this.url;
                const headerData = {contentType: 'application/json', dataType: 'json'};
                const res = await this.axios.post(url, params, headerData);
                this.$store.dispatch('treeLoading', false);
                const {statusCode, message} = res.body;
                const {records} = message;
                records.forEach(val => {
                    if (val.folder) {
                        val.open = false;
                    }
                });
                this.$parent.model.splice((vm.currentPage - 1) * 20, 0, ...records);
                if (!message.hasNextPage) {
                    this.$parent.model.pop();
                }
            },
            fetchChildren() {
                const vm = this;

                //异步渲染Dom
                function asyncRender(originArr, limit, time = 500) {
                    // const len = originArr.length;
                    // if (len > limit) {
                    //   const timer = await setTimeout(() => this.treeData = this.treeData.concat(originArr.slice(0, limit)), time)
                    //   this.timerArr.push(timer);
                    //   asyncRender.apply(this, [originArr.slice(limit), limit, time])
                    // } else {
                    this.treeData = [...this.treeData, ...originArr];
                    // }
                }

                const {level, path, title} = this.folder;

                const _url = this.url;
                let _data = {};
                let _keyword = this.keyword;

                if (!this.keyword) {
                    _data = {
                        level,
                        path,
                        page: 1,
                        rows: 20
                    };
                } else {
                    let Reg = new RegExp(this.keyword, "ig");
                    let result = Reg.test(title);
                    if (result) {
                        _data = {
                            level,
                            key: _keyword,
                            path,
                            page: 1,
                            rows: 20
                        };
                    } else {
                        _data = {
                            level,
                            key: _keyword,
                            path,
                            page: 1,
                            rows: 20
                        };
                    }
                }
                this.treeData = [];

                this.axios.post(_url, _data).then((res) => {
                    const {statusCode, message} = res.body;
                    const {records} = message;
                    const len = records.length;
                    let renderArr = [];

                    if (statusCode === 200) {

                        if (len > 0) {
                            records.map(item => vm.$set(item, 'open', false));
                            // asyncRender.apply(this, [records, 20, 500])
                            //添加查看更多

                            if (message.hasNextPage) {
                                let path = message.records[0].path.split('/');
                                path.pop();
                                if (this.$store.state.isBusiness) {
                                    records.push({
                                        type: 'more',
                                        children: [],
                                        path: path.join('/'),
                                        level: vm.folder.level
                                    });
                                } else {
                                    records.push({
                                        type: 'more',
                                        children: [],
                                        path: path.join('/'),
                                        datasetId: 0,
                                        level: 4
                                    });
                                }
                            }
                            this.treeData = records;
                        }
                    } else {
                        this.treeData = [];
                    }
                }, (res) => {
                    // console.log(res);
                }).then(() => {
                    Bus.$emit('resetPosition');
                });
            },
            fetchTopicChildren() {
                const level = this.folder.level;
                const path = this.folder.path;
                const targetTopicPath = this.$route.query.path;
                const url = '/datasets/treeSelect';
                let params = {};
                if (this.tableTypeOpts == '0,1,2') {
                    params = {
                        level,
                        path,
                        targetTopicPath,
                        page: 1,
                        rows: 20
                    };
                } else {
                    params = {
                        level,
                        path,
                        targetTopicPath,
                        page: 1,
                        rows: 20,
                        status: this.tableTypeOpts
                    };
                }
                this.treeData = [];
                const headerData = {contentType: 'application/json', dataType: 'json'};
                this.axios.post(`/datasets/treeSelect`, params, headerData)
                        .then(res => {
                            if (res.body.statusCode == 200) {
                                let data = res.body.message;
                                data.map(item => {
                                    this.$set(item, 'open', false);
                                });
                                this.treeData = data;
                            } else {
                                this.treeData = [];
                            }
                        });
            },
            displayToolBar(evt) {
                let offset = $(evt.target).offset();
                $(evt.target).find('.qtip-custom').css({
                    'display': 'block',
                    'left': offset.left - 35,
                    'top': offset.top + 35
                });
            },
            hideToolBar(evt) {
                $(evt.target).find('.qtip-custom').css({
                    'display': 'none'
                });
            },

            actionsDispatch(type) {
                this.curAction = type;
                if (type == 'del') {
                    this.delDataset();
                } else {
                    this.addOrEditTheme(type);
                }
            },
            addOrEditTheme(type) {
                this.dialogFormVisible = true;
                this.addFileForm.name = "";
                this.resetValidators('addFileForm');
                if (type === 'edit') {
                    this.addFileForm.name = this.folder.title;
                } else if (type === 'add') {
                    this.addFileForm.name = '';
                }
            },
            addOrEditCommit(formName) {
                console.log('addOrEditCommit');
                const {path, folder, datasetId} = this.folder;
                const type = this.curAction;
                const title = this.addFileForm.name.trim();
                let _newPath = "";
                if (title == this.folder.title && type == "edit") {
                    this.dialogFormVisible = false;
                    return;
                }
                if (path.indexOf('/') == '-1') {
                    _newPath = title;
                } else {
                    _newPath = `${this.newPath}/${title}`;
                }

                const paramsObj = {
                    'add': {
                        url: '/topic/create',
                        msg: this.$t('content.common.chuangj'),
                        newPath: `${path}/${title}`
                    },
                    'edit': {
                        url: '/topic/rename',
                        msg: this.$t('content.common.xiug'),
                        newPath: _newPath
                    }
                };
                this.$store.dispatch('saveTreeItemActive', {path: paramsObj[type].newPath, datasetId: null});//保存当前点击
                const {url, msg, newPath} = paramsObj[type];
                const params = {
                    path,
                    title
                };
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.axios.post(url, params).then((res) => {
                            const code = res.body.statusCode;
                            if (code === 200) {
                                this.fetchTopicTree();
                                this.dialogFormVisible = false;
                                this.message(`${msg}${this.$t('content.common.chengg')}!`, "success");
                                setTimeout(() => {
                                    this.$store.dispatch('fetchRouter', {path: newPath, datasetId: 0});
                                    Bus.$emit('refreshTree', {path: newPath, datasetId: 0});
                                }, 1000);
                            } else {
                                this.dialogFormVisible = false;
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            // 高级搜索下拉框刷新
            fetchTopicTree(key = null) {
                const vm = this;
                const data = {
                    level: 0,
                    page: 1,
                    path: "",
                    rows: 10000,
                    key
                };
                const res = httpRequest({
                    vm,
                    url: '/search/topicTree',
                    type: 'post',
                    data
                });
                res.then(res => Bus.$emit('searchTopic', res.records));
            },
            delDatasetFetch() {
                const vm = this;
                this.$store.dispatch('fetchRouter', {path: '', datasetId: 0});
                const {path, title, folder, datasetId} = vm.folder;
                const newPath = this.newPath;
                let comfirmMessage = vm.folder.folder ? this.$t('content.tree.sczt') : this.$t('content.tree.ycb');
                this.$store.dispatch('saveTreeItemActive', {path: newPath, datasetId: null});//保存当前点击
                let url = vm.folder.folder ? `/topic/delete?path=${encodeURIComponent(path)}` : `/topicDataset/remove?path=${encodeURIComponent(newPath)}&datasetId=${datasetId}`;
                this.delDialogVisible = false;
                vm.axios.post(url).then((res) => {
                    if (res.body.statusCode == 200) {
                        this.fetchTopicTree();
                        vm.message(`${comfirmMessage}${this.$t('content.common.chengg')}!`, "success");
                        Bus.$emit('refreshTree', {path: newPath, datasetId: 0});
                    } else {
                        this.message(`${comfirmMessage} ${this.$t('content.common.shib')}!`, "error");
                    }
                });
            },
            delDataset() {
                this.delDialogVisible = true;
            }
        }
    };
</script>

<style scoped lang="less">
    @import '../../../vars.less';
    .folder-name {
        max-width: calc(~"100% - 100px") !important;
    }
    .setting-con {
        display: block;
        position: absolute;
        right: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }
    .setting-con .setting-icon {
        display: none;
        width: 16px;
        height: 16px;
        background: url("../@{imagesUrl}/icon_setting.png") -16px 0 no-repeat;
        cursor: pointer;
    }
    .active .setting-con {
        color: #333;
    }
    .active .setting-con .setting-icon {
        background-position: 0 0;
    }
    .setting-con:hover .setting-icon {
        background-position: -32px 0;
    }
    .setting-con__toolBar {
        display: block;
    }
    .liUnderLine {
        border-bottom: 1px solid #E2E2E2;
    }
    .el-radio-group {
        display: block;
        font-size: 14px;
        height: 280px;
        border: 1px solid #E2E2E2;
        overflow-y: scroll;
        padding: 10px 0 10px 20px;
    }
    .dialog__dbList {
        margin: 0
    }
    .itemDisable {
        background: #F3F3F5;
        color: #D6D7D9;
    }
    .qtip-custom {
        position: fixed;
        z-index: 15002;
        opacity: 1;
        left: 20px;
        top: 20px;
        display: none;
        width: 100px;
    }
    .triangle-border {
        position: absolute;
        left: 50%;
        overflow: hidden;
        margin-left: -10px;
        width: 0;
        height: 0;
        border-width: 10px;
        border-style: solid dashed dashed dashed;
    }
    .tb-border {
        top: -20px;
        border-color: transparent transparent #E2E2E2 transparent;
    }
    .tb-background {
        top: -19px;
        border-color: transparent transparent #FFF transparent;
    }
    .isBusinessLoad {
        margin-left: -254px !important;
    }
</style>
