<template>
    <div id="searchContainer" v-loading.fullscreen.lock="loading">
        <div class="nav-bar">
            <span>{{$t('content.home.home')}}</span> /{{$t('content.dataset.datasetDetail.ssjg')}}
        </div>
        <div class="input-search">
            <span class="txt">{{$t('content.search.a1')}}:</span>
            <div class="autocomplete-box">
                <el-autocomplete ref="input" :placeholder="$t('content.header.srbm')"
                                 :fetch-suggestions="fetchSearch"
                                 v-model="searchField.keywords"
                                 value-key="keyword"
                                 select-when-unmatched
                                 @select="handleListSearch"
                                 class="input-with-select">
                </el-autocomplete>
                <el-button class="submit"
                           type="primary" icon="el-icon-search" @click="handleAllSearch"></el-button>
                <el-select v-model="searchField.source" @change="sourceSearch"
                           :placeholder="$t('content.common.qxz')">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <template v-if="isShowSearchPage">
            <div class="search-content">
                <div class="keyword">
                    <b class="emphasize">"{{searchKeyword}}"</b>
                    {{$t('content.dataset.datasetDetail.ssxgjg')}} : {{searchResult.totalRows}}
                </div>
                <div class="select-search">
                    <div class="select-group">
                        <div class="select-box select-txt">
                            <span>{{$t('content.search.a2')}}:</span>  <!--结果筛选-->
                        </div>
                        <div class="select-box theme-select-container">
                            <el-input class="top-input"
                                      @click.native="showSelectContanier"
                                      @clear="clearHandleSearch"
                                      @change="changeHandleSearch"
                                      :placeholder="$t('content.home.qxzzt')"
                                      v-model="params.topicPath"
                                      clearable
                                      :title="params.topicPath"></el-input>
                            <div class="theme-select" v-if="showSelectVisible">
                                <el-input
                                        :placeholder="$t('content.header.srbm')"
                                        v-model="theme"
                                        debounce="300"
                                        @keyup.native="remoteMethod"></el-input>
                                <div class="search-topic-tree-container" v-loading="remoteLoading">
                                    <topic-tree v-if="topicTrees.length > 0" :model="topicTrees"></topic-tree>
                                    <no-data v-else></no-data>
                                </div>
                            </div>
                        </div>
                        <div class="select-box">
                            <el-select class="select"
                                       filterable
                                       clearable
                                       remote
                                       :remote-method="fetchUpstreamSystem"
                                       :loading="sourceLoading"
                                       @change="handleSearch"
                                       v-model="params.upstreamSystem"
                                       :placeholder="$t('content.dataset.datasetDetail.lyxt')">
                                <el-option
                                        v-for="item in upstreams"
                                        :key="item.upstreamSystem"
                                        :label="item.upstreamSystem"
                                        :value="item.upstreamSystem">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="select-box">
                            <el-select class="select"
                                       filterable
                                       clearable
                                       remote
                                       :remote-method="fetchModule"
                                       :loading="moduleLoading"
                                       @change="handleSearch"
                                       v-model="params.sourceTable" :placeholder="$t('content.home.ybgnmk')">
                                <el-option
                                        v-for="item in sourceTables"
                                        :key="item.sourceTable"
                                        :label="item.sourceTable"
                                        :value="item.sourceTable">
                                </el-option>
                            </el-select>
                        </div>


                        <div class="select-box">
                            <el-select class="select"
                                       v-model="params.tagName"
                                       clearable
                                       @change="handleSearch"
                                       remote
                                       :remote-method="querySearchAsync"
                                       :loading="selectLoading"
                                       filterable
                                       :placeholder="$t('content.home.bq')">
                                <el-option
                                        v-for="item in tagsOptions"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.name">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="block">
                            <el-cascader :placeholder="$t('content.home.qxzmgfl')"
                                         :options="categoryOptions"
                                         ref="cascader"
                                         clearable
                                         expand-trigger="hover"
                                         @active-item-change="clickSelectDep"
                                         v-model="params.sensitiveId"
                                         @change="handleSearch">
                            </el-cascader>
                        </div>
                    </div>
                    <ul class="sort-wrapper">
                        <li class="relate-sort" :class="{ active: sort === 'relate'}" @click="relateSort">
                            {{$t('content.search.axgd')}}<i
                                :class="{down: this.order === 'desc', up: this.order === 'asc'}"></i>
                        </li>
                        <li class="size-sort" :class="{ active: sort === 'size'}" @click="sizeSort">
                            {{$t('content.search.accdx')}}<i
                                :class="{down: this.order === 'desc', up: this.order === 'asc'}"></i>
                        </li>
                        <li class="time-sort" :class="{ active: sort === 'createTime'}" @click="createTimeSort">
                            {{$t(`content.search.${activeTab === 'datasets' ? 'acjsj' : 'axgsj'}`)}}<!--按创建时间--><i
                                :class="{down: this.order === 'desc', up: this.order === 'asc'}"></i>
                        </li>
                    </ul>
                </div>
                <div class="tabs">
                    <ul>
                        <li :class="{active: activeTab === tab}"
                            @click="toggleDataType(tab)"
                            v-for="tab in tabs">{{$t(`content.tree.${ tab === 'datasets' ? 'jgh' : 'fjgh'}`)}}
                        </li>
                    </ul>
                </div>

                <div class="list-wrap" v-if="searchResult.totalRows > 0">


                    <!-- 搜索结果记录 -->
                    <ul v-for="item in searchResult.records">
                        <li class="searchItem">
                            <h6 @click="link(item)"><span class="name" v-html="item.name"></span></h6>
                            <ul class="attr-list">
                                <li>{{$t('content.dataset.businessDetail.biem')}} :
                                    <span v-ellipsis:300="item.businessName"></span>
                                </li>
                                <li>{{$t('content.dataset.businessDetail.miaos')}} :
                                    <span v-ellipsis:400="item.description"></span>
                                </li>
                                <li>{{$t('content.common.leix')}} : {{item.source}}</li>
                                <li class="tableCreated sub">{{$t('content.dataset.datasetDetail.dx')}} :
                                    {{formatSize(item.size)}}
                                </li>
                                <li>
                                    {{$t('content.dataStructure.mgjb')}}:
                                    {{item.sensitiveCategory}}
                                </li>
                                <li>
                                    {{$t('content.dataset.datasetDetail.zhgxsj')}}:
                                    {{formatTime(item.modifiedTime*1000)}}
                                </li>
                                <li>
                                    {{$t('content.dataset.datasetDetail.sjfzr')}}:
                                    {{item.owner}}
                                </li>
                                <li>{{$t('content.common.luj')}} :
                                    {{item.urn.replace('://','/')}}
                                </li>
                                <li class="attr-fields" :title="processTitle(item.fields)"
                                    v-if=" activeTab === 'datasets' ">
                                    {{$t('content.dataset.datasetDetail.zid')}} :
                                    <div class="fields" v-for="(val,index) in item.fields">
                                        <span v-html="val.fieldName"></span>
                                        <template v-if="val.comment.length">
                                            : <span v-html="val.comment"></span>
                                        </template>
                                        <span v-if="index < (item.fields.length - 1)">;</span>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>

                    <div class="tablePages">
                        <el-pagination background
                                       layout="total, prev, pager, next"
                                       @current-change="handleCurrentChange"
                                       :current-page="searchResult.currentPage"
                                       :page-size="searchResult.pageSize"
                                       :total="searchResult.totalRows"
                                       v-if="searchResult.totalRows>searchResult.pageSize">
                        </el-pagination>
                    </div>

                </div>
                <div class="list-wrap" v-else>
                    <no-data>
                        <div v-html="$t('content.dataset.datasetDetail.hebbaoqian', [searchKeyword])"></div>
                    </no-data>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
    import {FormatSize, FormatTime, EmphasizeName} from 'mixins/common'; //搜索结果高亮
    import Bus from 'utils/bus';
    import {httpRequest, hiddenClick, clickCount} from 'utils';
    import TopicTree from '../Home/TopicTree';
    import {
        getTopicTree,
        getSourceList,
        getModuleList,
        getRecentList,
        getCompleteList,
        getSearchList,
        getTagList,
        getSensitiveList
    } from '@/service/getData';

    export default {
        name: "SearchResult",
        mixins: [FormatSize, FormatTime, EmphasizeName],
        components: {
            TopicTree
        },
        data() {
            return {
                tabs: ['datasets', 'unstructure'],
                activeTab: 'datasets',
                treeNoData: false,
                theme: '',
                showSelectVisible: false,
                isShowSearchPage: false,
                visibleSearchList: false,
                searchListLoading: false,
                remoteLoading: false,
                sourceLoading: false,
                moduleLoading: false,
                selectLoading: false,
                searchContainerHeight: 300,
                emptyText: '加载中',
                loading: false,//loading
                searchResult: {},//搜索结果
                tableFilterList: [],
                options: [
                    {label: this.$t('content.header.qb'), value: 'all'},
                    {label: this.$t('content.dataset.businessDetail.biaom'), value: 'name'},
                    {label: this.$t('content.dataset.businessDetail.biem'), value: 'businessName'},
                    {label: this.$t('content.dataset.datasetDetail.sjms'), value: 'description'},
                    {label: this.$t('content.dataset.datasetDetail.ywyy'), value: 'bizMeaning'},
                    {label: this.$t('content.dataset.datasetDetail.zid'), value: 'fieldName'},
                    {label: this.$t('content.dataset.datasetDetail.zdms'), value: 'fieldComment'},
                    {label: this.$t('content.dataset.datasetDetail.kzzd'), value: 'extendFields'},
                    {label: this.$t('content.dataset.datasetDetail.bq'), value: 'tags'}
                ],

                upstreams: [], //所属来源系统下拉列表
                sourceTables: [], //源表功能模块下拉列表
                topicTrees: [], //所属主题树状图列表
                tagsOptions: [],  //标签
                params: {
                    upstreamSystem: '', //所属来源系统下拉列表
                    sourceTable: '',  //源表功能模块下拉列表
                    topicPath: '',   //所属主题远程下拉列表
                    tagName: '',
                    sensitiveId: []  //过滤敏感分类
                },
                searchField: {
                    keywords: '',
                    source: 'all',
                    searchType: 'datasets'
                },
                sort: 'relate',
                order: 'desc',
                currentPage: 1,
                searchKeyword: '',  //搜索关键字
                selectedOptions: [],
                categoryOptions: [],
            };
        },
        watch: {
            '$route': function () {

            }
        },
        computed: {},
        mounted() {
            //更新主题树状图列表
            Bus.$on('selectTopic', (path) => {
                this.params.topicPath = path;
                this.showSelectVisible = false;
                this.handleSearch();
            });
            hiddenClick('theme-select-container', 'showSelectVisible', this);
        },
        created() {
            const keys = Object.keys(this.$route.query);

            if (keys.length) {    //从主页搜索页面跳转过来的
                this.searchField.keywords = this.$route.query.keyword;
                this.searchField.source = this.$route.query.source;
                this.handleAllSearch();
            }
            this.remoteMethod();
            this.fetchTree();
        },
        methods: {
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
            fetchTree() {
                getSensitiveList().then(res => {
                    const {statusCode, message} = res.data;
                    if (statusCode === 200) {
                        message.forEach(obj => {
                            obj.label = obj.name;
                            obj.value = obj.id;
                            if (obj.children && obj.children.length) {
                                obj.children.forEach(item => {
                                    item.label = item.name;
                                    item.value = item.id;
                                    if (!item.children.length) {
                                        item.children = null;
                                    }
                                });
                            } else {
                                obj.children = null;
                            }
                        });
                        message.splice(0, 1);
                        this.categoryOptions = message;
                    }
                });
            },
            handleChange(value) {
                console.log(value);
            },
            processTitle(obj) {
                let str = '';
                const reg = /<[^<>]+>/g;
                obj.forEach((val, index) => {
                    str += `${(val.fieldName).replace(reg, '')}:${(val.comment).replace(reg, '')};`;
                });
                return str;
            },
            toggleDataType(category) {
                this.sort = 'relate';
                this.order = 'desc';
                this.currentPage = 1;
                this.activeTab = category;
                this.handleSearch();
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
                            this.tagsOptions = records;
                        }
                    });
                } else {
                    this.tagsOptions = [];
                }
            },
            clearHandleSearch() {
                this.params.topicPath = '';
                this.showSelectVisible = false;
                this.handleSearch();
            },
            changeHandleSearch() {
                if (this.params.topicPath === '') {
                    this.handleSearch();
                }
            },
            selectTopic(path) {
                this.params.topicPath = path;
                this.showSelectVisible = false;
            },
            setOpen(topicTrees) {
                topicTrees.forEach(tree => {
                    if (tree.children) {
                        this.$set(tree, 'open', true);
                        this.setOpen(tree.children.records);
                    } else {
                        this.$set(tree, 'open', false);
                    }
                });
            },
            showSelectContanier() {
                this.showSelectVisible = !this.showSelectVisible;
            },
            relateSort() {
                const {sort, order} = this;

                if (sort === 'relate') {
                    this.order = 'desc';
                } else {
                    this.sort = 'relate';
                    this.order = 'desc';
                    this.currentPage = 1;
                    this.handleSearch();
                }
            },
            sizeSort() {
                const {sort, order} = this;

                if (sort === 'size') {
                    this.order = this.order === 'desc' ? 'asc' : 'desc';
                } else {
                    this.sort = 'size';
                    this.order = 'desc';
                }
                this.currentPage = 1;
                this.handleSearch();
            },
            createTimeSort() {
                const {sort, order} = this;

                if (sort === 'createTime') {
                    this.order = this.order === 'desc' ? 'asc' : 'desc';
                } else {
                    this.sort = 'createTime';
                    this.order = 'desc';
                }
                this.currentPage = 1;
                this.handleSearch();
            },
            handleListSearch(item) {
                this.searchField.keywords = item.keyword || item.value;
                const arr = Object.keys(item);
                this.resetData();
                this.handleSearch();
            },
            resetData() {
                this.upstreams = [];
                this.sourceTables = [];
                this.theme = '';
                this.sort = 'relate';
                this.order = 'desc';
                this.activeTab = 'datasets';
                this.params = {
                    upstreamSystem: '', //所属来源系统下拉列表
                    sourceTable: '',  //源表功能模块下拉列表
                    topicPath: '',   //所属主题远程下拉列表
                    tagName: '',
                    sensitiveId: []  //过滤敏感分类
                };
            },
            handleAllSearch() {
                this.resetData();
                this.handleSearch();
            },
            sourceSearch() {
                const {keywords} = this.searchField;
                if (keywords.length) {
                    this.handleSearch();
                }
            },
            handleSearch() {
                const {keywords: keyword, source} = this.searchField;
                if (keyword.length) {
                    const {topicPath, upstreamSystem, sourceTable, tagName, sensitiveId} = this.params;
                    const {activeTab, currentPage: page, sort, order} = this;

                    this.isShowSearchPage = true;
                    this.searchKeyword = keyword;
                    this.loading = true;

                    const params = {
                        keyword,
                        source,
                        topicPath,
                        upstreamSystem,
                        sourceTable,
                        tagName,
                        category: activeTab,
                        sort,
                        order,
                        page,
                        rows: 10,
                        sensitiveId: sensitiveId.length === 2 ? sensitiveId[1] : sensitiveId[0]
                    };
                    getSearchList(params).then(res => {
                        this.loading = false;
                        this.searchResult = res.data.message;
                    });

                } else {
                    this.$message({
                        message: this.$t('content.dataset.businessDetail.gjzbnwk'),
                        type: 'warning',
                        showClose: true
                    });
                }
            },
            async fetchSearch(keywords, cb) {
                const {searchType} = this.searchField;
                let list = [];
                if (keywords === undefined || keywords === '') {
                    await getRecentList().then(res => {
                        list = this.tableFilterList = res;
                    });
                } else {
                    await getCompleteList(searchType, keywords).then(res => {
                        res = res.records;
                        list = this.tableFilterList = res.map(val => {
                            return {
                                keyword: val,
                                category: searchType
                            };
                        });
                    });
                }
                cb(list);
            },
            remoteMethod() {
                const query = this.theme;
                this.remoteLoading = true;
                getTopicTree(query).then(res => {
                    this.remoteLoading = false;
                    this.topicTrees = res.records;
                    this.treeNoData = !this.topicTrees.length;
                    this.setOpen(this.topicTrees);
                });
            },
            fetchUpstreamSystem(query) {
                if (query !== '') {
                    this.sourceLoading = true;
                    getSourceList(query).then(res => {
                        this.sourceLoading = false;
                        this.upstreams = res;
                    });
                } else {
                    this.upstreams = [];
                }
            },
            fetchModule(query) {
                if (query !== '') {
                    this.moduleLoading = true;
                    getModuleList(query).then(res => {
                        this.moduleLoading = false;
                        this.sourceTables = res;
                    });
                } else {
                    this.sourceTables = [];
                }
            },
            link(item) {
                const {activeTab: type} = this;
                if (type === "datasets") {
                    let {id, name} = item;
                    let path = item.urn.replace('://', '/');
                    this.$store.dispatch('saveTableName', name);
                    this.$store.dispatch('fetchRouter', {path, datasetId: id});
                    this.$router.push({name: 'Physical'});
                } else if (type === "unstructure") {
                    this.$router.push({name: 'Files', query: {id: item.id}});
                }
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.handleSearch();
            }
        }
    };
</script>

<style lang="less">
    .sort-wrapper {
        height: 30px;
        border: 1px solid #D8DCDF;
        float: right;
        li {
            position: relative;
            float: left;
            height: 28px;
            padding-left: 10px;
            padding-right: 25px;
            color: #666;
            line-height: 28px;
            border-right: 1px solid #D8DCDF;
            cursor: pointer;
            &:last-child {
                border-right: none;
            }
            &.active {
                background-color: #F3FAFE;
                .down {
                    background-position: -42px 0;
                }
                .up {
                    background-position: -56px 0;
                }
            }
            i {
                background: transparent no-repeat url(../../assets/images/icon/sort-icon.png) -28px 0;
                position: absolute;
                top: 7px;
                right: 5px;
                display: block;
                width: 14px;
                height: 14px;
            }
        }
    }
    .theme-select-container {
        float: left;
        margin-left: 10px;
        width: 200px;
        position: relative;
        .top-input {
            .el-input__inner {
                padding-right: 10px;
            }
        }
        .theme-select {
            position: absolute;
            border: 1px solid #CCC;
            border-top: none;
            padding: 10px;
            width: 100%;
            z-index: 1;
            background: #FFF;
            .search-topic-tree-container {
                overflow-x: auto;
                max-height: 300px;
                max-width: 100%;
                > ul {
                    margin-top: 15px;
                    padding-left: 0;
                    > li {
                        border-left: 1px solid #DEDEDE;
                    }
                }
            }
            li {
                margin-bottom: 0;
                line-height: 30px;
            }
        }
    }
    #searchContainer {
        overflow-y: scroll;
        background: #EEF0F1;
        height: 100%;
        .el-cascader {
            width: 160px;
        }
        .search-content {
            margin: 0 20px;
            padding: 20px 0;
            background-color: #FFF;
            .keyword {
                margin: 0 20px;
                padding-left: 20px;
                height: 40px;
                line-height: 40px;
                font-size: 14px;
                background-color: #F3FAFE;
            }
            .tabs {
                margin: 0;
            }
        }
        .nav-bar {
            padding-left: 20px;
            height: 40px;
            line-height: 40px;
            color: #70757F;
            background-color: #FFF;
            span {
                color: #014B70;
            }
        }
        .searchResultList {
            width: 561px;
            left: 0;
            top: 40px;
            .empty {
                padding: 10px 0;
                text-align: center;
                color: #999;
                font-size: 14px;
            }
        }
        .emphasize {
            color: #F00;
        }
        .select-search {
            display: flex;
            justify-content: space-between;
            margin: 20px;
            .select-group {
                display: flex;
                align-items: center;
                height: 30px;
                .select-box {
                    margin-right: 10px;
                    line-height: 30px;
                    width: 150px;
                    .theme-select {
                        .el-input {
                            width: 100%;
                        }
                    }
                }
                .select-txt {
                    width: auto;
                }
            }
        }
        .input-search {
            display: flex;
            align-items: center;
            margin: 20px 20px 10px;
            padding: 0 20px;
            width: calc(~"100% - 40px");
            height: 70px;
            background-color: #FFF;
            .txt {
                margin-right: 10px;
            }
            .autocomplete-box {
                position: relative;
                font-size: 0;
                .el-autocomplete {
                    display: inline-block;
                    width: 500px
                }
                .el-select {
                    position: absolute;
                    right: 52px;
                    top: 5px;
                    .el-input__inner {
                        border-color: transparent;
                        height: 30px;
                        line-height: 30px;
                        text-align: right;
                    }
                }
            }
            .submit {
                border-width: 2px;
                width: 50px;
                line-height: 20px;
                border-color: transparent;
            }
            .el-input__inner {
                height: 40px;
                line-height: 40px;
            }
            .el-input-group__append {
                padding: 0 35px;
                border-color: #15A2EA;
                background-color: #15A2EA;
                .el-icon-search {
                    color: #FFF;
                    font-size: 16px;
                }
            }
        }
    }
    .list-wrap {
        margin-top: 10px;
        .searchResultTit {
            padding-left: 20px;
            border-bottom: 1px solid #E8ECEE;
        }
        .titFlag {
            background-color: #009CFF;
            display: inline-block;
            width: 3px;
            height: 14px;
        }
        .searchItem {
            padding: 20px;
            border-left: 3px solid #FFF;
            border-bottom: 1px solid #E8ECEE;
            line-height: 30px;
            h6 {
                cursor: pointer;
            }
            &:first-child {

            }
            b {
                color: #C00;
            }
            .name {
                font-size: 16px;
                color: #007FF5;
            }
            .attr-list {
                overflow: hidden;
                width: 100%;
                li {
                    float: left;
                    width: 50%;
                    color: #9598A0;
                    &:last-child {
                        width: 100%;
                    }
                    &.attr-fields {
                        position: relative;
                        overflow: hidden;
                        width: 100%;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        .fields {
                            display: inline;
                        }
                    }
                }
            }
            &:hover {
                border-left-color: #15A2EA;
                background-color: #F4F7F9;
                .main {
                    text-decoration: underline;
                }
            }
            .list-inline > li {
                padding-right: 20px;
            }
        }
        .tableDisc {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            display: inline-block;
            background-color: #333;
        }

        .search-description {
            max-height: 30px;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
</style>
