<template>
    <div class="wrapper-content">
        <multipane class="custom-resizer" layout="vertical">
            <div class="pane" :style="{ width: '250px', maxWidth: '50%', minWidth: '250px' }">
                <div class="pane-title">
                    <h6 class="title">{{$t('content.files.a1')}}<!--文件的元信息--></h6>
                    <div class="data-controler" v-if="!leftLoading">
                        <i class="tree-control-icon icon2"
                           @click="dialogVisible = true"
                           :title="$t('content.header.daoc')"></i>
                        <i class="tree-control-icon icon3"
                           v-if="isAdmin"
                           @click="collectionDialog = true"
                           :title="$t('content.header.daor')"
                        ></i>
                    </div>
                </div>
                <div class="dbList" v-loading="leftLoading">
                    <ul>
                        <li class="item">
                            <div class="wrap">
                                <span class="icon type-icon"></span>
                                <span class="name">HDFS</span>
                            </div>
                            <ul>
                                <li v-for="item in list" @click="menuSelect(item)">
                                    <div class="wrap" :class="{active: item.refId === currentItem.refId}">
                                        <span class="icon fold-icon"></span>
                                        <span class="name">{{item.businessName}}</span>
                                    </div>
                                </li>
                            </ul>
                        </li>

                        <li class="item " v-for="item in categoryList">
                            <div class="wrap"
                                 @click="toggleMenu(item)"
                                 :class="{active: item.refId === currentItem.refId}">
                                <span :class="`icon ${item.category}-icon`"></span>
                                <span class="name">
                                    {{$t(`content.files.${item.category}`)}}
                                </span>
                                <span class="count">{{item.totalCount}}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <multipane-resizer></multipane-resizer>
            <div class="pane" :style="{ flexGrow: 1 }">
                <div class="sub-nav">
                    <ul>
                        <li v-if="menuType === 'source'">HDFS
                            <span class="split-line" v-if="list.length">/</span>
                        </li>
                        <li>
                            <span class="active" @click="toggleSource" v-if="pathArray.length">
                                 {{menuType === 'source' ? currentItem.businessName : $t(currentItem.businessName)}}
                            </span>
                            <span v-else>
                                  {{menuType === 'source' ? currentItem.businessName : $t(currentItem.businessName)}}
                            </span>
                        </li>
                        <li v-for="(path, index) in pathArray">
                            <span class="split-line">/</span>
                            <span :class="{active: index < pathArray.length-1}"
                                  @click="handlePathNav(index)">{{path}}</span>
                        </li>
                    </ul>
                </div>
                <div class="main" v-if="docType === 'Folder'" v-loading="loading">
                    <template v-if="list.length === 0">
                        <div class="data-empty">
                            <img :src="this.imgSrc"/>
                            <div @click="collectionDialog = true">{{$t('content.files.a2')}}
                                <!--暂无数据,请前往"管理专区"导入管理对象--></div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="table-title">
                            <div class="table-title__text">
                                <span>{{menuType === 'source' ? filename : $t(filename)}}</span>
                            </div>
                            <div class="search-wrap"
                                 :class="{'search-wrap-logger': tags.length > 2}"
                                 v-clickoutside="handleClose">
                                <!--/*请输入内容*/-->
                                <input-tag :placeholder="$t('content.files.a3')"
                                           :value="tags"
                                           :newTag.sync="form.keyword"
                                           @show:search="showSearch"
                                           @update:tags="updateTags"
                                           @search="searchFiles"
                                           :addTagOnKeys='[]'
                                           :limit="limit">
                                </input-tag>
                                <span v-if="tags.length || (form.keyword && form.keyword.length)"
                                      @click="clearTags"
                                      class="el-icon-circle-close"></span>
                                <el-form :class='{show: isShowMoreSearch}'
                                         ref="form"
                                         :model="form"
                                         label-width="90px"
                                         :disabled="searchLoading"
                                         size="mini">
                                    <div class="loading-wrap" v-if="searchLoading">
                                        <i class="el-icon-loading"></i>
                                    </div>
                                    <ul class="history-list" v-if="!searchLoading && historyList.length">
                                        <li v-for="history in historyList"
                                            :title="history.title"
                                            @click="historySearch(history.record)">
                                            <template v-for="item in history.record">
                                                <span class="label">{{$t(item.name)}}:</span>
                                                <strong>{{item.name === 'content.files.a15' ? item.value.datasourceName
                                                    :
                                                    item.value}}</strong>
                                                <span class="split" v-if="history.record.length > 1">|</span>
                                            </template>
                                        </li>
                                    </ul>
                                    <div class="form-title">{{$t('content.files.a4')}}<!--添加查询选项--></div>
                                    <el-form-item :label="$t('content.files.a15')"
                                                  v-if="!Number.isInteger(this.currentItem.refId)">  <!--文件来源-->
                                        <el-select v-model="form.source" @change="sourceChange"
                                                   :placeholder="$t('content.common.qxza')" clearable>
                                            <el-option v-for="item in list"
                                                       :key="item.refId"
                                                       :label="item.businessName"
                                                       :value="item">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item :label="$t('content.files.a5') + ':'">  <!--更新时间-->
                                        <el-date-picker
                                                v-model="form.date"
                                                value-format="timestamp"
                                                type="daterange"
                                                @change="settingDate"
                                                :range-separator="$t('content.common.zhi')"
                                                :start-placeholder="$t('content.dataset.datasetDetail.ksrq')"
                                                :end-placeholder="$t('content.dataset.datasetDetail.jsrq')">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item :label="$t('content.home.bq') + ':'">
                                        <el-select v-model="form.tag"
                                                   class="tag-select"
                                                   clearable
                                                   @change="selectChange"
                                                   remote
                                                   :remote-method="querySearchAsync"
                                                   :loading="selectLoading"
                                                   filterable
                                                   :placeholder="$t('content.files.a6')"> <!--输入一个标签名,例如:机器学习-->
                                            <el-option v-for="item in options"
                                                       :key="item.id"
                                                       :label="item.name"
                                                       :value="item.name">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                        <el-table :data="tableData"
                                  :default-sort="{prop: 'title', order: 'descending'}"
                                  border
                                  ref="elTable"
                                  class="files-table"
                                  @sort-change="sortTable">
                            <el-table-column prop="title" :label="$t('content.files.a7')" sortable="custom"> <!--文件名称-->
                                <template slot-scope="scope">
                                    <div class="files-name" :class="{'folder-box' : scope.row.folder}">
                                        <i :class="[scope.row.folder ? 'fold-icon' : 'doc-icon', 'icon']"></i>
                                        <span v-if="scope.row.folder"
                                              @click="scanFiles(scope.row)">{{scope.row.title}}</span>
                                        <span @click="checkDetails(scope.row)" v-else>{{scope.row.title}}</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column v-if="menuType === 'category'"
                                             prop="path"
                                             :label="$t('content.files.a8')"
                                             sortable="custom">
                                <template slot-scope="scope">
                                    {{scope.row.path && scope.row.path.replace('hdfs://', 'hdfs/') || ''}}
                                </template>
                            </el-table-column> <!--存储路径-->

                            <el-table-column prop="description" :label="$t('content.dataset.datasetDetail.sjms')"
                                             sortable="custom"></el-table-column> <!--文件描述-->


                            <el-table-column prop="fileType" :label="$t('content.files.a10')" sortable="custom">
                                <!--文件类型-->
                                <template slot-scope="scope">
                                    {{scope.row.folder ? $t('content.files.a11') : scope.row.fileType}} <!--文件夹-->
                                </template>
                            </el-table-column>

                            <el-table-column prop="modifyTime" :label="$t('content.dataset.businessDetail.zhsjsj')"
                                             sortable="custom">
                                <!--更新时间-->
                                <template slot-scope="scope">
                                    {{formatTime(scope.row.modifyTime * 1000)}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="size" :label="$t('content.files.a12')" sortable="custom"> <!--文件大小-->
                                <template slot-scope="scope">
                                    {{scope.row.folder ? '' : formatSize(scope.row.size)}}
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="tablePages">
                            <el-pagination background
                                           layout="total, prev, pager, next"
                                           @current-change="handleCurrentChange"
                                           :current-page="currentPage"
                                           :page-size="rows"
                                           :total="totalRows">
                            </el-pagination>
                        </div>
                    </template>
                </div>
                <template v-else>
                    <dataset-detail type="HDFS"></dataset-detail>
                </template>
                <el-dialog :visible.sync="dialogVisible"
                           :title="$t('content.dataset.datasetDetail.xzdcdysj')"
                           width="800px">
                    <export-tree :isOpen="dialogVisible"
                                 v-on:update:visible="dialogVisible = $event"></export-tree>
                </el-dialog>
                <!--导入弹窗-->
                <el-dialog :visible.sync="collectionDialog"
                           class="create-task-dialog"
                           :title="$t('content.importExport.yxxhq')"
                           width="800px">
                    <el-form label-position="left">
                        <el-form-item :label="$t('content.importExport.hqfs')">  <!--获取方式-->
                            <el-select v-model="importValue" :placeholder="$t('content.common.qxz')"><!--请选择-->
                                <el-option :label="$t('content.importExport.sjycj')" :value="1"></el-option>
                                <!--数据源采集-->
                                <el-option :label="$t('content.importExport.excel')" :value="2"></el-option>
                                <!--Excel导入-->
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <create-task :visible="collectionDialog" type="files" v-show="importValue === 1"></create-task>
                    <div class="dialog-footer" v-if="importValue === 2" slot="footer">
                        <el-button type="primary" @click="handleDataImport">
                            {{$t('content.common.qd')}}
                        </el-button>
                        <el-button @click="collectionDialog = false">{{$t('content.common.qx')}}</el-button>
                    </div>
                </el-dialog>
            </div>
        </multipane>
    </div>
</template>

<script>
    import {Multipane, MultipaneResizer} from 'vue-multipane';
    import InputTag from './children/InputTag';
    import ExportTree from './children/ExportTree';
    import {
        getDataSource,
        getFileCategory,
        getFileTree,
        searchFileData,
        getTagList,
        getFilesInfo,
        getUnStructureHistory
    } from '@/service/getData';
    import {FormatTime, FormatSize, SortTable, EmphasizeName} from 'mixins/common';
    import DatasetDetail from '@/components/MetaData/Dataset/DatasetDetail';
    import CreateTask from '@/components/ImportExport/children/children/CreateTask';

    export default {
        mixins: [FormatTime, FormatSize, SortTable, EmphasizeName],
        components: {
            Multipane,
            MultipaneResizer,
            DatasetDetail,
            InputTag,
            ExportTree,
            CreateTask
        },
        data() {
            return {
                collectionDialog: false,
                dialogVisible: false,
                importDialog: false,
                btnLoading: false,
                isShowMoreSearch: false,
                limit: 10,
                filename: '',
                leftLoading: true,
                loading: false,
                tableData: [],
                categoryList: [],
                list: [],
                currentItem: {},
                category: '',  // 所选择的文件类型分类: document, picture, video, audio, other. 在分类中搜索
                rows: 10, // 每页数量
                order: 'desc',  // asc或desc
                sort: 'title',  // 排序字段
                currentPage: 1,   // 当前页
                totalRows: 0,     // 总记录数
                totalPages: 0,    // 总页数
                pathArray: [],
                locationPrefix: null,     // 要获取列表的路径的请求参数
                docType: 'Folder',
                menuType: 'source',   // 两种类型,source和category
                form: {
                    keyword: '',   // 和子组件,双向绑定,注意子组件,修改这个值的情况
                    source: '',
                    date: [],
                    tag: ''
                },
                options: [],
                importValue: 1,
                selectLoading: false,
                isSearch: false,     // 是否在执行搜索
                historyList: [],
                searchLoading: false,
                imgSrc: require('@/assets/images/files/no-data.png'),
                sourceId: '',
                tags: [],   // 不要直接操作这个值
                tagMap: new Map(),
                myMapChangeTracker: 1,
                isSearching: false
            };
        },
        computed: {
            isAdmin() {
                const {roles} = this.$store.state.userInfo;
                return roles === 'leapid.admin' || roles === 'leapid.pm';
            }
        },
        watch: {
            myMapChangeTracker: function() {
                const tags = [];
                for (const [key, value] of this.tagMap) {
                    if (key === 'source') {
                        tags.push(value.businessName);
                    } else {
                        tags.push(value);
                    }
                }
                this.tags = tags;
            },
            dialogVisible: function(newValue) {
                if (!newValue) {
                    this.treeSearchKeyword = '';
                    this.cacheKeyword = '';
                }
            }
        },
        created() {
            this.fetchSource().then(() => {
                const id = this.$route.query.id;
                if (id) {
                    getFilesInfo(id).then(res => {
                        const {statusCode, message} = res.data;
                        if (statusCode === 200) {
                            if (message === null) {
                                this.$message({
                                    message: this.$t('content.files.nmyqx'),    //你没有权限查看该表,已跳转到主目录
                                    type: 'error'
                                });
                                if (this.list.length) {
                                    this.loading = false;  //为false时,才可以选中每一行数据
                                    this.menuSelect(this.list[0]);   // 选中第一行数据
                                }
                            } else {
                                const {refId} = message;
                                this.currentItem = this.list.find(item => item.refId === refId);   // 找到当前文件对应的数据源
                                this.checkDetails(message);
                            }
                        }
                    });
                } else {
                    if (this.list.length) {
                        this.menuSelect(this.list[0]);   // 选中第一行数据
                    }
                }
            });
        },
        methods: {
            handleDataImport() {
                if (this.importValue === 1) {
                    this.collectionDialog = true;
                } else {
                    this.$store.dispatch('saveRouter', 'Files');
                    this.$router.push({name: 'DataImport'});
                }
            },
            handleClose(e) {
                this.isShowMoreSearch = false;
            },
            showSearch(isShow) {
                this.isShowMoreSearch = isShow;
                this.searchLoading = true;
                getUnStructureHistory(this.currentItem.category).then(res => {
                    const {statusCode, message} = res.data;
                    if (statusCode === 200) {
                        this.searchLoading = false;

                        message.forEach(item => {
                            const record = [];
                            const {keyword, beginTime, endTime, tag, datasourceName, refId} = item.param;

                            if (keyword) {
                                record.push({
                                    name: 'content.files.a16',   // 关键字
                                    value: keyword
                                });
                            }

                            if (beginTime && endTime) {
                                record.push({
                                    name: 'content.files.a5',   // 更新时间
                                    value: `${this.formatTime(beginTime, 'date')}${this.$t('content.common.zhi')}${this.formatTime(endTime, 'date')}`,
                                    beginTime,
                                    endTime
                                });
                            }

                            if (tag) {
                                record.push({
                                    name: 'content.files.a17',   // 标签
                                    value: tag
                                });
                            }
                            if (datasourceName && datasourceName.length) {
                                record.push({
                                    name: 'content.files.a15',   // 文件来源
                                    value: {
                                        refId,
                                        datasourceName,
                                        businessName: datasourceName
                                    }
                                });
                            }
                            item.record = record;
                            item.title = record.reduce((total, currentValue) => {
                                return total + `${this.$t(currentValue.name)}:${currentValue.name === 'content.files.a15' ? currentValue.value.datasourceName : currentValue.value};`;
                            }, '');
                        });
                        this.historyList = message;
                    }
                });
            },
            historySearch(array) {
                this.clearTags();
                array.forEach(item => {
                    if (item.name === 'content.files.a16') {   // 关键字
                        this.form.keyword = item.value;
                    } else if (item.name === 'content.files.a5') {  // 更新时间
                        this.tagMap.set('date', item.value);
                        this.form.date.push(item.beginTime);
                        this.form.date.push(item.endTime);
                    } else if (item.name === 'content.files.a17') {
                        this.tagMap.set('tag', item.value);
                        this.form.tag = item.value;
                    } else {
                        this.tagMap.set('source', item.value);
                        this.form.source = item.value;
                    }
                });
                this.myMapChangeTracker += 1;
                this.searchFiles();
            },
            clearTags() {
                this.form = {
                    keyword: '',
                    source: '',
                    date: [],
                    tag: ''
                };
                this.tagMap = new Map();
                this.myMapChangeTracker += 1;
                this.searchFiles();
            },
            updateTags(tags) {
                if (tags === this.tagMap.get('date')) {
                    this.tagMap.delete('date');
                    this.form.date = '';
                } else if (tags === this.tagMap.get('tag')) {
                    this.tagMap.delete('tag');
                    this.form.tag = '';
                } else {
                    this.tagMap.delete('source');
                    this.form.source = '';
                }
            },
            settingDate(dateArray) {
                if (dateArray) {   // 设置有日期范围
                    const star = this.formatTime(dateArray[0], 'date');
                    const end = this.formatTime(dateArray[1], 'date');
                    this.tagMap.set('date', `${star}${this.$t('content.common.zhi')}${end}`); // 如果有日期就覆盖,没有就追加
                } else {
                    this.tagMap.delete('date');
                }
                this.myMapChangeTracker += 1;
            },
            selectChange(item) {
                if (item) {
                    this.tagMap.set('tag', item);
                } else {
                    this.tagMap.delete('tag');
                }
                this.myMapChangeTracker += 1;
            },
            sourceChange(item) {
                if (item) {
                    this.tagMap.set('source', item);
                } else {
                    this.tagMap.delete('source');
                }
                this.myMapChangeTracker += 1;
            },
            searchFiles() {
                this.isShowMoreSearch = false;
                if (Number.isInteger(this.currentItem.refId)) {
                    this.isSearch = !(this.tags.length === 0 && (this.form.keyword === '' || this.form.keyword === undefined));
                } else {
                    this.isSearch = true;
                }
                this.currentPage = 1;
                this.fetchData();
            },
            querySearchAsync(query) {
                if (query !== '') {
                    this.selectLoading = true;
                    getTagList({
                        rows: 10,
                        page: 1,
                        order: '',
                        sort: '',
                        name: query
                    }).then(res => {
                        const {statusCode, message} = res.data;
                        if (statusCode === 200) {
                            const {records} = message;
                            this.selectLoading = false;
                            this.options = records;
                        }
                    });
                } else {
                    this.options = [];
                }
            },
            handlePathNav(index) {
                if (index < this.pathArray.length - 1) {   // 最后一个路径,不需要请求数据
                    let locationPrefix = this.currentItem.rootPath;

                    this.pathArray.forEach((item, i) => {
                        if (i <= index) {
                            locationPrefix += item + '/';
                        }
                    });
                    this.locationPrefix = locationPrefix;
                    this.filename = this.pathArray[index];
                    this.pathArray.length = index + 1;
                    this.docType = 'Folder';
                    this.resetPageData();
                    this.isSearch = false;
                    this.clearTags();
                    this.fetchData();
                }
            },
            generatePath(fullPath) {
                const {rootPath} = this.currentItem;
                const index = fullPath.indexOf(rootPath);
                return fullPath.slice(index + rootPath.length).split('/');
            },
            scanFiles(row) {
                this.pathArray = this.generatePath(row.path);
                this.locationPrefix = row.locationPrefix + row.title + '/';
                this.filename = row.title;
                this.resetPageData();
                this.fetchData();
            },
            toggleSource() {
                const {rootPath, refId, businessName, category, locationPrefix} = this.currentItem;
                this.resetPageData();
                this.resetData();
                if (this.menuType === 'category') {
                    this.category = category;
                    this.isSearch = true;
                } else {
                    this.isSearch = false;
                    this.locationPrefix = locationPrefix;
                }
                this.filename = businessName;
                this.fetchData();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.fetchData();
            },
            checkDetails(row) {
                const {datasetId, path, title, level, folder} = row;
                const queryParams = {
                    params: {
                        title,
                        path,
                        level: 0
                    },
                    isfolder: false
                };
                if (this.menuType === 'category') {
                    this.pathArray = [title];
                } else {
                    this.pathArray = this.generatePath(row.path);
                }
                this.$store.dispatch('saveViewData', queryParams);// 保存请求参数
                this.$store.dispatch('setTreeData', true);
                this.$store.dispatch('fetchRouter', {datasetId, path});
                this.docType = 'Doc';
            },
            toggleMenu(item) {    //切换文件类型
                if (!this.loading) {
                    this.filename = item.businessName;
                    this.docType = 'Folder';
                    this.menuType = 'category';
                    this.isSearch = true;   // 特殊处理,默认调用搜索接口
                    this.currentItem = item;
                    this.resetData();
                    this.resetPageData();
                    this.category = item.category;
                    this.$refs.elTable.clearSort();  //清空排序
                    this.$refs.elTable.sort('title', 'descending');   //设置默认排序,已经开始请求数据了
                }
            },
            menuSelect(item) {
                if (!this.loading) {
                    this.docType = 'Folder';
                    this.menuType = 'source';
                    this.isSearch = false;
                    this.currentItem = item;
                    this.filename = item.businessName;
                    this.resetData();
                    this.locationPrefix = item.locationPrefix;
                    this.fetchData();
                }
            },
            resetData() {
                this.pathArray = [];
                this.locationPrefix = null;
                this.docType = 'Folder';
                this.category = '';
                this.form = {
                    keyword: '',
                    source: '',
                    date: [],
                    tag: ''
                };
                this.tags = [];
            },
            resetPageData() {
                this.rows = 10; // 每页数量
                this.order = 'desc'; // asc或desc
                this.sort = 'title';   // 排序字段
                this.currentPage = 1;   // 当前页
                this.totalRows = 0;     // 总记录数
                this.totalPages = 0;    // 总页数
            },
            fetchSource() {
                this.leftLoading = true;
                return this.axios.all([getDataSource(), getFileCategory()]).then(this.axios.spread((source, category) => {

                    const {statusCode: statusCode1, message: message1} = source.data;
                    const {statusCode: statusCode2, message: message2} = category.data;

                    this.leftLoading = false;
                    if (statusCode1 === 200 && statusCode2 === 200) {    // 获取用户信息接口成功
                        this.list = message1;
                        message2.forEach(item => {
                            item.refId = item.category;
                            item.businessName = `content.files.${item.category}`;
                        });
                        this.categoryList = message2;
                    }
                }));
            },
            fetchData() {
                this.loading = true;
                const {refId} = this.currentItem;
                const {category, rows, currentPage: page, order, sort, locationPrefix, isSearch} = this;
                const prams = {
                    rows,
                    page,
                    order,
                    sort,
                    refId

                };
                let fn = null;

                if (isSearch) {
                    const {date, tag, keyword, source} = this.form;
                    prams.keyword = keyword;
                    prams.tag = tag;
                    if (Array.isArray(date)) {
                        prams.beginTime = date[0];
                        prams.endTime = date[1];
                    } else {
                        prams.beginTime = '';
                        prams.endTime = '';
                    }
                    if (Number.isInteger(refId)) {
                        prams.path = locationPrefix;
                    } else {
                        prams.category = category;
                        if (Number.isInteger(source.refId)) {
                            prams.refId = source.refId;
                            prams.datasourceName = source.businessName;
                        } else {
                            delete prams.refId;
                            delete prams.datasourceName;
                        }
                    }
                    fn = searchFileData;
                } else {
                    prams.locationPrefix = locationPrefix;
                    fn = getFileTree;
                }
                fn(prams).then(res => {
                    const {statusCode, message} = res.data;
                    this.loading = false;
                    if (statusCode === 200) {
                        const {records, currentPage, totalPages, totalRows} = message;
                        this.tableData = records;
                        this.totalPages = totalPages;
                        this.totalRows = totalRows;
                    }
                });
            }
        }
    };
</script>

<style lang="less">
    .create-task-dialog {
        .sub-nav {
            display: none;
        }
        .el-dialog__body {
            background-color: #FFF;
        }
        .main {
            padding: 0 !important;
            .step-box {
                width: 100% !important;
                .el-form {
                    width: 100% !important;
                    .btn-return {
                        display: none;
                    }
                }
            }
        }
    }
    .pane > .dbList {
        margin: 0 -15px;
        height: calc(~ '100% - 40px');
        ul {
            li {
                .wrap {
                    margin-left: -9999px;
                    padding-left: 9999px;
                    height: 32px;
                    line-height: 32px;
                    cursor: pointer;
                    &:hover {
                        background-color: #F3F3F3;
                    }
                    &.active {
                        color: #FFF;
                        background-color: #014B70;
                    }
                    .count {
                        float: right;
                        margin-right: 10px;
                    }
                }
            }
        }
    }
    .wrapper-content {
        float: left;
        width: calc(~"100% - 80px");
        .custom-resizer {
            width: 100%;
            height: 100%;
            .pane-title {
                display: flex;
                height: 40px;
                border-bottom: 1px dashed #DDD;
                justify-content: space-between;
                .title {
                    margin: 0;
                    font-weight: bold;
                    line-height: 40px;
                }
            }
            > .pane {
                text-align: left;
                padding: 15px;
                padding-bottom: 0;
                border-right: 1px solid #CCC;
                ~ .pane {
                    overflow: auto;
                    border-left: 1px solid #CCC;
                    background-color: #EEF0F1;
                    z-index: auto;
                    .table {
                        table-layout: auto;
                    }
                    .sub-nav {
                        margin: -15px -15px 15px;
                        padding-left: 20px;
                        height: 38px;
                        line-height: 38px;
                        background-color: #FFF;
                    }
                    .datasetCon {
                        height: auto;
                    }
                    #main-dataset {
                        height: 100%;
                    }
                    .main {
                        position: relative;
                        padding: 15px;
                        background-color: #FFF;
                        min-height: calc(~ '100% - 53px');
                        .data-empty {
                            position: absolute;
                            left: 0;
                            top: 0;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            height: 100%;
                            width: 100%;
                            div {
                                margin-top: 10px;
                                color: #00699D;
                                cursor: pointer;
                                &:hover {
                                    color: #23527C;
                                    text-decoration: underline;
                                }
                            }
                        }
                        .files-table .icon {
                            margin-top: 10px;
                        }
                        .files-name,
                        .folder-box {
                            position: relative;
                            cursor: pointer;
                            padding-left: 25px;
                            .icon {
                                position: absolute;
                                top: 2px;
                                left: 5px;
                            }
                            span {
                                display: block;
                                width: 100%;
                                height: 100%;
                            }
                        }
                        .files-name {
                            width: 100%;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                            span {
                                display: inline-block;
                                width: auto;
                                height: 100%;
                            }
                        }
                        .search-wrap {
                            position: relative;
                            width: 350px;
                            transition: width .5s;
                            &.search-wrap-logger {
                                width: 480px;
                            }
                            .show {
                                display: block;
                            }
                            > .el-icon-circle-close {
                                position: absolute;
                                right: 55px;
                                top: 10px;
                                cursor: pointer;
                            }
                            .el-form {
                                display: none;
                                z-index: 9;
                                position: absolute;
                                left: 0;
                                top: 31px;
                                border: 1px solid #CCC;
                                padding: 10px;
                                width: 100%;
                                background-color: #FFF;
                                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
                                border-radius: 4px;
                                .form-title {
                                    margin: 20px 0 15px;
                                    color: #8F9192;
                                }
                                .loading-wrap {
                                    margin: -10px;
                                    padding-top: 15px;
                                    text-align: center;
                                    i {
                                        font-size: 26px;
                                    }
                                }
                                .history-list {
                                    margin: -10px;
                                    padding: 10px;
                                    background-color: #F6F7FB;
                                    li {
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                        height: 25px;
                                        line-height: 25px;
                                        .label {
                                            padding: 0;
                                            color: #8F9192;
                                            line-height: 25px;
                                        }
                                        strong {
                                            color: #333;
                                            font-weight: 700;
                                            font-size: 12px;
                                        }
                                        .split {
                                            margin: 0 10px;
                                        }
                                    }
                                }
                                .el-range-editor {
                                    padding: 3px;
                                    width: 238px;
                                    .el-range__icon {
                                        margin-left: 0;
                                        line-height: 20px;
                                    }
                                    .el-range-input {
                                        width: 90px;
                                    }
                                    .el-range-separator {
                                        width: 20%;
                                    }
                                }
                                .el-select {
                                    width: 238px;
                                }
                                .el-input__inner {
                                    height: 28px !important;
                                    line-height: 28px !important;
                                }
                            }
                        }
                    }
                    .content-wrapper {
                        padding: 0;
                    }
                    .datasetCon > .title {
                        display: none;
                    }
                }
            }
            > .multipane-resizer {
                margin: 0;
                left: 0;
                position: relative;
                &:before {
                    display: block;
                    content: "";
                    width: 3px;
                    height: 40px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    margin-top: -20px;
                    margin-left: -1.5px;
                    border-left: 1px solid #CCC;
                    border-right: 1px solid #CCC;
                }
                &:hover {
                    &:before {
                        border-color: #999;
                    }
                }
            }
        }
    }
</style>
