<template>
    <div class="home-box-container">
        <div class="home-container">
            <div class="searchCon">
                <h3>{{$t('content.home.ysjglxt')}}</h3>
                <div class="input-search">
                    <el-autocomplete :placeholder="$t('content.header.srbm')"
                                     :fetch-suggestions="fetchSearch"
                                     v-model="searchField.keywords"
                                     value-key="keyword"
                                     @keydown.enter.native="routeSearch"
                                     @select="handleListSearch"
                                     class="input-with-select">
                        <el-button slot="append" type="primary" icon="el-icon-search" @click="routeSearch"></el-button>
                    </el-autocomplete>
                    <el-select v-model="searchField.source"
                               popper-class="select-source-popper"
                               size="mini"
                               class="select-source"
                               placeholder="请选择">
                        <el-option
                                v-for="item in selectTypeList"
                                :key="item.value"
                                :label="$t(item.label)"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>

            <section class="home-userinfo">
                <div class="home-count-info">
                    <div class="home-user-box">
                        <div class="user-avatar">
                            <img :src="avatarUrl" alt=""/>
                        </div>
                        <h4>{{userInfo.userName}}</h4>
                        <ul>
                            <li>
                                <label>{{$t('content.home.zhjs')}}:</label>
                                <div :title="userRole" class="projectsNum" v-ellipsis:90="userRole"></div>
                            </li>
                            <li>
                                <label>{{$t('content.home.jrxm')}}:</label>
                                <div
                                        :title="userInfo.projects"
                                        class="projectsNum"
                                        v-ellipsis="userInfo.projects"></div>
                            </li>
                        </ul>
                    </div>
                    <ul class="user-info-right">
                        <li v-for="item in userInfoRight"
                            @click="pushRouter(item.router)">
                            <label>{{item.label}}</label>
                            <div class="loading" v-if="item.count == null"></div>
                            <template v-else>
                                <div>
                                    <span>{{item.count}}</span>
                                    {{$t('content.common.tiao')}}
                                </div>
                            </template>
                        </li>
                    </ul>
                </div>
                <div class="info-right">
                    <home-user-info
                            v-for="(item, index) in infoList"
                            @click.native="pushRouter(item.router, item.params && item.params)"
                            :userInfo="item"
                            v-if="showInfoList(item.title)"/>
                </div>
            </section>
            <section class="home-footer">
                <div class="home-footer-left">
                    <router-link :to="{name: 'Business'}" class="home-footer-link">
                        <i class="home-footer-icon1"></i>
                        <div>
                            <h4>{{$t('content.tree.ywst')}}</h4>
                            <p>{{$t('content.home.azywljgl')}}</p>
                            <ul class="num">
                                <li> {{$t('content.home.zs')}}<span class="num-b">{{topic.datasetCount}}</span></li>
                                <li><span class="num-b">{{topic.topicCount}}</span> {{$t('content.home.gywzt')}}</li>
                                <li><span class="num-b">{{topic.level1}}</span> {{$t('content.home.gyjzt')}}</li>
                            </ul>
                        </div>
                    </router-link>
                    <router-link tag="div"
                                 :to="{name: 'Physical'}"
                                 @click.native="changeMenu('metro')"
                                 class="home-footer-link">
                        <i class="home-footer-icon2"></i>
                        <div>
                            <h4>{{$t('content.tree.jgh')}}</h4>
                            <p>{{$t('content.home.azwlljglzs')}}</p>
                            <ul class="num">
                                <li> {{$t('content.home.zs')}}<span class="num-b">{{physical.tableNum}}</span></li>
                                <li><span class="num-b">{{physical.datasourceNum}}</span> {{$t('content.home.gsjy')}}
                                </li>
                                <li><span class="num-b">{{physical.databaseNum}}</span> {{$t('content.home.gsjk')}}
                                </li>
                            </ul>
                        </div>
                    </router-link>
                    <router-link :to="{name: 'Files'}" class="home-footer-link">
                        <i class="home-footer-icon3"></i>
                        <div>
                            <h4>{{$t('content.files.a13')}}{{filesInfo.tableNum}}</h4>
                            <p>{{$t('content.files.a14')}}</p>

                            <ul class="num">
                                <li> {{$t('content.home.zs')}}<span class="num-b">{{filesInfo.total}}</span></li>
                                <li><span class="num-b">{{filesInfo.source}}</span> {{$t('content.home.gsjy')}}
                                </li>
                            </ul>
                        </div>
                    </router-link>
                </div>
                <div class="home-footer-right">
                    <home-top-list v-for="item in homeTopList" :item="item"/>
                </div>
            </section>
        </div>
    </div>
</template>
<script>

    import HomeUserInfo from './HomeUserInfo';
    import HomeTopList from './HomeTopList';
    import HomeSearch from './HomeSearch';
    import Bus from 'utils/bus';
    import {httpRequest} from 'utils';
    import {testPrivilege, EmphasizeName} from 'mixins/common'; //时间格式化
    import {
        getTopicTree,
        getSourceList,
        getModuleList,
        getRecentList,
        getCompleteList,
        getSearchList,
        getFilesNum
    } from '@/service/getData';

    export default {
        mixins: [testPrivilege, EmphasizeName],
        data() {
            return {
                lang: this.$i18n.locale,
                tableFilterList: [],
                recentVisible: false,
                userSrc: require('assets/images/user.png'),
                user: {
                    username: this.$store.state.username && window.sessionStorage.getItem('username')
                },
                searchField: {
                    keywords: '',
                    source: 'all',
                    searchType: 'datasets'
                },

                avatarUrl: require('assets/images/leapavartar.png'),
                homeTopList: [
                    {
                        title: 'content.home.ysjwhwzx',
                        list: [],
                        loading: true
                    },
                    {
                        title: 'content.home.ysjsc',
                        list: [],
                        loading: true
                    },
                    {
                        title: 'content.home.ysjdj',
                        list: [],
                        loading: true
                    }
                ],
                searchVisible: false,
                selectType: 'all',
                selectTypeList: [
                    {label: 'content.header.qb', value: 'all'},
                    {label: 'content.dataset.businessDetail.biaom', value: 'name'},
                    {label: 'content.dataset.businessDetail.biem', value: 'businessName'},
                    {label: 'content.dataset.datasetDetail.sjms', value: 'description'},
                    {label: 'content.dataset.datasetDetail.ywyy', value: 'bizMeaning'},
                    {label: 'content.dataset.datasetDetail.zid', value: 'fieldName'},
                    {label: 'content.dataset.datasetDetail.zdms', value: 'fieldComment'},
                    {label: 'content.dataset.datasetDetail.kzzd', value: 'extendFields'},
                    {label: 'content.dataset.datasetDetail.bq', value: 'tags'}
                ],
                topic: {
                    datasetCount: 0,
                    topicCount: 0,
                    level1: 0
                },
                physical: {
                    tableNum: 0,
                    databaseNum: 0,
                    datasourceNum: 0
                },
                filesInfo: {
                    total: 0,
                    source: 0
                },
                ownerCount: null,
                metaCount: null,
                authorityCount: null,
                collectCount: null,
                examines: {
                    waitExamine: null,
                    waitMyExamine: null,
                    examined: null
                }
            };
        },
        components: {
            HomeUserInfo,
            HomeTopList,
            HomeSearch
        },
        computed: {
            userInfo() {
                return this.$store.state.userInfo;
            },
            userRole() {
                switch (this.userInfo.roles) {
                    case 'leapid.admin':
                        return this.$t('content.home.cjgly');
                    case 'leapid.pm':
                        return this.$t('content.dataset.datasetDetail.xmgly');
                    case 'leapid.member':
                        return this.$t('content.home.ptyh');
                    case 'leapid.finance':
                        return this.$t('content.home.cwgly');
                }
            },
            infoList() {
                return [
                    {
                        title: this.$t('content.personal.yqxdsj'),
                        label: this.$t('content.home.zhxydxqx'),
                        count: this.authorityCount,
                        color: '#60C94D',
                        router: 'Authority'
                    },
                    {
                        title: this.$t('content.personal.scdsj'),
                        label: this.$t('content.home.zhxscdsyb'),
                        count: this.collectCount,
                        color: '#FF7572',
                        router: 'Collect'
                    },
                    {
                        title: this.$t('content.home.fzrxxdwh'),
                        label: this.$t('content.home.dwhywfzr'),
                        count: this.ownerCount,
                        color: '#FFCA53',
                        router: 'Owner',
                        params: {tab: 'PersonalChargeMaintain', label: this.$t('content.home.fzrxxdwh')}
                    },
                    {
                        title: this.$t('content.home.yxxdwh'),
                        label: this.$t('content.home.dwhdywyxx'),
                        count: this.metaCount,
                        color: '#B187FF',
                        router: 'Owner',
                        params: {tab: 'PersonalMetaMaintain', label: this.$t('content.home.yxxdwh')}
                    }
                ];
            },
            userInfoRight() {
                return [
                    {
                        label: this.$t('content.home.sqdsh'),
                        count: this.examines.waitExamine,
                        router: 'Applys'
                    },
                    {
                        label: this.$t('content.home.dwsh'),
                        count: this.examines.waitMyExamine,
                        router: 'Approvals'
                    }
                ];
            }
        },
        async created() {
            Bus.$on('hidden', param => {
                this.searchVisible = param;
                this.hiddenOperate();
            });

            let vm = this;
            this.fetchMaintainTopList();
            this.fetchFavTopList();
            this.fetchClickTopList();
            this.fetchCount();

            this.fetchOwnerCount();
            this.fetchMetaCount();

            this.fetchPersonal();

            this.fetchWaitMyExamined();
            this.fetchWaitExamined();

            await this.testPrivilege('/datasets/ownedDatasetWithoutCommonInfoCount', 'get');

            getFilesNum().then(res => {
                let total = 0;
                res.data.message.forEach(item => {
                    total = total + item.tableNum;
                });
                this.filesInfo = {
                    total,
                    source: res.data.message.length
                };
            });
        },
        mounted() {
            this.hiddenOperate();
        },
        watch: {
            searchVisible(val) {
                if (val) {
                    this.recentVisible = false;
                }
            }
        },
        methods: {
            handleListSearch(item) {
                this.$store.dispatch('saveNavData', true);
                this.searchField.keywords = item.keyword;
                this.routeSearch();
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
            hiddenOperate() {
                const vm = this;
                window.onclick = function(e) {
                    let target = $(e.target).hasClass('searchResultList') || $(e.target).parents().hasClass('searchResultList') || $(e.target).hasClass('home-search') || $(e.target).parents().hasClass('home-search');
                    if (!target) {
                        vm.recentVisible = false;
                    }
                };
            },
            searchResult(item, category) {
                if (!category) {
                    category = this.searchField.searchType;
                }
                this.searchField.keywords = item;
                this.recentVisible = false;

                this.$router.push({
                    name: 'SearchResult',
                    query: {category: category, keyword: item, advance: false, t: new Date().getTime()}
                });
            },
            async historySearch() {
                if (this.searchField.keywords !== '') {   //如果输入框里的内容不为空,需要调用关键字搜索接口
                    this.keyupSearch();
                } else {
                    this.searchVisible = false;
                    const url = "/search/recent";
                    await this.axios.get(url).then(res => {
                        if (res.body.statusCode === 200) {
                            const result = res.body.message;
                            const _result = [];
                            result.map(val => {
                                const arr = [];
                                arr.push(val.keyword, val.keyword, val.category);
                                _result.push(arr);
                            });
                            this.recentVisible = true;
                            this.tableFilterList = _result;
                        }
                    }, (response) => {
                        // error callback
                    });
                }
            },
            keyupSearch() {
                if (this.searchField.keywords === '') {
                    this.historySearch();
                } else {
                    clearTimeout(this.isSearch);
                    this.isSearch = setTimeout(() => this.fetchFilterData(), 300);
                }
            },
            async fetchFilterData(page = 1) {
                if (this.searchField.keywords) {
                    let _category = this.searchField.searchType;
                    let _url = "";
                    let searchKeyword = this.searchField.keywords;
                    let keyword = encodeURIComponent(searchKeyword);
                    _url = `/search/autocomplete?category=${_category}&keyword=${keyword}&rows=10&page=${page}`;
                    const res = await this.axios.get(_url);
                    if (res.body.statusCode == 200) {
                        const queryData = res.body.message.records;
                        let _result = [];
                        queryData.map((item) => {
                            let _item = this.emphasizeName(item, searchKeyword);
                            _result.push([_item, item]);
                        });
                        this.recentVisible = true;
                        this.tableFilterList = _result;
                    } else {
                        this.recentVisible = false;
                        this.tableFilterList = [];
                    }
                }
            },
            pushRouter(routerName, params = null) {
                if (params) {
                    this.$store.dispatch('ownerActiveTab', {component: params.tab, title: params.label});
                }
                this.$router.push({name: routerName});
            },
            fetchPersonal() {
                const res = httpRequest({vm: this, url: '/datasets/getPersonalDataCount'});
                res.then(res => {
                    this.collectCount = res.Collect;
                    this.authorityCount = res.Authority;
                });
            },
            fetchWaitMyExamined() {
                const res = httpRequest({vm: this, url: '/privilege/getApprovalListCount'});
                res.then(res => {
                    this.examines.waitMyExamine = res;
                });
            },
            fetchWaitExamined() {
                const res = httpRequest({vm: this, url: '/privilege/getPendingApproveCount'});
                res.then(res => {
                    this.examines.waitExamine = res;
                });
            },
            fetchMetaCount() {
                const res = httpRequest({vm: this, url: '/datasets/ownedDatasetWithoutCommonInfoCount'});
                res.then(res => {
                    this.metaCount = res;
                });
            },
            async fetchMaintainTopList() {
                const res = await this.axios.get(`datasets/getTopDatasetCommonInfo`);
                if (res.body.statusCode == 200) {
                    var _records = res.body.message;
                    // var _list = [];
                    // for (var i = 0; i < _records.length; i++) {
                    //     _list.push(_records[i]['datasetName']);
                    // }
                    this.homeTopList[0].list = _records;
                    this.homeTopList[0].loading = false;
                }
            },
            async fetchFavTopList() {
                const res = await this.axios.get(`/datasets/getTopFavoriteDataset`);
                if (res.body.statusCode == 200) {
                    var _records = res.body.message;
                    // var _list = [];
                    // for (var i = 0; i < _records.length; i++) {
                    //     _list.push(_records[i]['name']);
                    // }
                    this.homeTopList[1].list = _records;
                    this.homeTopList[1].loading = false;
                }
            },
            async fetchClickTopList() {
                const res = await this.axios.get(`/datasets/getTopDatasetAccess`);
                if (res.body.statusCode == 200) {
                    var _records = res.body.message;
                    // var _list = [];
                    // for (var i = 0; i < _records.length; i++) {
                    //     _list.push(_records[i]['name']);
                    // }
                    this.homeTopList[2].list = _records;
                    this.homeTopList[2].loading = false;
                    // console.log(this.homeTopList[2])
                }
            },
            fetchCount() {
                this.fetchTopicCount();
                this.fetchPhysicalCount();
            },
            fetchOwnerCount() {
                const res = httpRequest({vm: this, url: '/datasets/ownedDatasetWithoutOwnerCount'});
                res.then(res => {
                    this.ownerCount = res;
                });
            },
            fetchTopicCount() {
                const res = httpRequest({vm: this, url: '/topic/treeInfo'});
                res.then(res => {
                    res.forEach(val => {
                        this.topic.datasetCount += val.datasetCount;
                        this.topic.topicCount += val.topicCount;
                        if (val.level == 1) {
                            this.topic.level1 += val.topicCount;
                        }
                    });
                });
            },
            fetchPhysicalCount() {
                const res = httpRequest({vm: this, url: '/datasets/treeInfo'});
                res.then(res => {
                    let source = 0;
                    res.forEach(val => {
                        this.physical.tableNum += val.tableNum;
                        this.physical.databaseNum += val.databaseNum;
                        source++;
                    });
                    this.physical.datasourceNum = source;
                });
            },
            changeMenu(type) {
                this.$store.dispatch('changeTableTypeOpts', '0,1,2');
                this.$store.dispatch('saveTableName', '');
                this.$store.dispatch('saveDatasetKeyword', "");

                if (type == 'business' || type == 'metro') {
                    if (type == 'business') {
                        // this.$router.push({name: 'Dataset'})
                        this.$store.dispatch('setBusiness', true);
                    } else {
                        // this.$router.push({name: 'Physical'})
                        this.$store.dispatch('setBusiness', false);
                    }

                    const {path} = this.$route;

                    if (this.$store.state.navIsData) {
                        Bus.$emit('initTree');
                    }
                    this.$store.dispatch('saveNavData', true);
                } else {
                    this.$store.dispatch('saveNavData', false);
                }
            },
            routeSearch() {
                const keyword = this.searchField.keywords;
                if (keyword.trim() === '') {
                    this.searchField.keywords = '';
                    return;
                }
                this.$store.dispatch('setSearchParams', {
                    source: this.searchField.source
                });
                this.$router.push({
                    name: 'Search',
                    query: {source: this.searchField.source, keyword}
                });
            },
            //判断权限
            showInfoList(title) {
                let visible = true;
                const userRole = this.userInfo.roles;
                const isAdmin = userRole == 'leapid.admin';
                const isPm = userRole == 'leapid.pm';
                const isMember = userRole == 'leapid.member';
                switch (title) {
                    case this.$t('content.home.fzrxxdwh'):
                        visible = isAdmin || isPm ? true : false;
                        break;
                    case this.$t('content.home.yxxdwh'):
                        visible = ((this.hasPrivilege && isPm) || (isMember && this.hasPrivilege) || isAdmin) ? true : false;
                        break;
                }
                return visible;
            }
        }
    };
</script>
<style lang="less">
    .input-search {
        position: relative;
        margin: 50px auto 0;
        height: 40px;
        width: 640px;
        .el-autocomplete {
            display: flex;
            width: 100%;
        }
        .select-source {
            width: 130px;
        }
        .el-select {
            position: absolute;
            height: 38px;
            right: 80px;
            top: 1px;
            .el-input__inner {
                border-color: transparent;
                height: 38px;
                line-height: 38px;
                text-align: right;
                vertical-align: top;
            }
            .el-input.is-focus {
                .el-input__inner {
                    border-color: transparent;
                }
            }
        }
        .el-input__inner {
            height: 40px;
            line-height: 40px;
        }
        .el-input-group__append {
            padding: 0 35px;
            border-color: #014B70;
            background-color: #014B70;
            .el-icon-search {
                color: #FFF;
                font-size: 16px;
            }
        }
    }
    .advance-link {
        font-size: 14px;
        color: #014B70;
    }
    .home-box-container {
        height: 100%;
        overflow: auto;
    }
    .home-container {
        border: 1px solid transparent;
        padding: 0 40px;
        background: #FFF;
        margin: 20px;
        > .searchCon {
            height: auto;
            width: 670px;
            margin: 40px auto 80px;
            border: none;
            h3 {
                text-align: center;
                margin-bottom: 30px;
                margin-top: 0;
                font-size: 30px;
                color: #444;
                font-weight: 400;
            }
            .home-search-container {
                position: relative;
                flex-grow: 1;
                a {
                    line-height: 30px;
                    margin-left: 20px;
                }
                .home-search {
                    width: 100%;
                    height: 100%;
                    .el-icon-search {
                        font-weight: bolder;
                        font-size: 18px;
                    }
                    .el-button--primary {
                        width: 60px;
                    }
                    .searchResultList {
                        top: 44px;
                    }
                    .search-submit {
                        height: 44px;
                        float: left;
                    }
                    .home-search-input {
                        float: left;
                        width: 574px;
                        height: 44px;
                        border: 2px solid #E3E8EA;
                        border-right: 0;
                        position: relative;
                        .search-keyword {
                            input {
                                height: 40px !important;
                                padding-left: 10px !important;
                                text-align: left;
                            }
                            input::-webkit-input-placeholder {
                                color: #B2B7BF;
                                font-size: 14px;
                            }
                        }
                        .home-search-select {
                            position: absolute;
                            top: 0;
                            right: 0;
                            width: 146px;
                            line-height: 37px;
                            color: #AAA;
                            cursor: pointer;
                            i {
                                margin-left: 5px;
                            }
                        }
                        input {
                            width: 100%;
                            text-align: right;
                            border: none;
                        }
                    }
                }
            }
        }
        .home-userinfo {
            display: flex;
            height: 200px;
        }
        .info-right {
            flex-grow: 1;
            display: flex;
            display: -ms-flexbox;
        }
        .home-count-info {
            display: flex;
            display: -ms-flexbox;
            width: 450px;
            border: 1px solid #E2E8EB;
            padding: 0 20px 0 20px;
            flex-grow: 0;
            flex-shrink: 0;
            .home-user-box {
                border-right: 1px solid #E2E8EB;
                margin-right: 20px;
                padding-right: 10px;
                width: 180px;
                .user-avatar {
                    width: 80px;
                    height: 80px;
                    margin: -40px auto 0;
                    border-radius: 100%;
                    position: relative;
                    img {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        border: 10px solid #FFF;
                        border-radius: 100%;
                    }
                }
                h4 {
                    text-align: center;
                    margin-bottom: 20px;
                    color: #014B70;
                    margin-top: 15px;
                }
                ul {
                    width: 230px;
                    margin: 0 auto;
                    font-size: 14px;
                    line-height: 30px;
                    label {
                        color: #888;
                        display: inline-block;
                        width: 70px;
                        text-align: right;
                    }
                    span {
                        color: #444;
                    }
                    .links {
                        color: #014B70
                    }
                    .projectsNum {
                        display: inline-block;
                        width: 90px;
                        color: #444;
                        word-break: break-all;
                    }
                }
            }
            .user-info-right {
                font-size: 14px;
                width: 208px;
                .loading {
                    width: 16px;
                    height: 16px;
                    margin-top: 25px;
                    background: url(../../assets/images/loading_s.gif);
                }
                li {
                    display: flex;
                    border-bottom: 1px solid #E2E8EB;
                    line-height: 99px;
                    justify-content: space-between;
                    cursor: pointer;
                    label {
                        cursor: pointer;
                        color: #666;
                    }
                    div {
                        color: #014B70;
                        font-size: 14px;
                        span {
                            font-size: 28px;
                            font-weight: normal;
                            font-family: 'Arial';
                        }
                    }
                }
                li:last-child {
                    border: 0;
                }
            }
        }
        .home-footer {
            display: flex;
            flex-flow: row; /*伸缩项目单行排列*/
            justify-content: space-between;
            margin-top: 40px;
            .home-footer-left {
                width: 400px;
                flex-grow: 0;
                .home-footer-link {
                    padding: 10px 15px;
                    display: flex;
                    background: #EFF4F6;
                    margin-bottom: 15px;
                    align-items: center;
                    color: #344769;
                    cursor: pointer;
                    text-decoration: none;
                    &:last-child {
                        margin-bottom: 0;
                    }
                    > i {
                        margin-left: 60px;
                        display: block;
                        flex-shrink: 0;
                    }
                    h4 {
                        color: #424544;
                        margin-bottom: 5px;
                    }
                    p {
                        line-height: 16px;
                    }
                    .num {
                        margin-top: 15px;
                        margin-bottom: 10px;
                        line-height: 25px;
                        li {
                            display: inline-block;
                            margin-right: 10px;
                            .num-b {
                                color: #014B70;
                                font-weight: bold;
                            }
                        }
                    }
                }
            }
            .home-footer-right {
                display: flex;
                width: auto;
                flex-grow: 1;
                margin-left: 20px;
                border: 1px solid #E2E8EB;
            }
        }
        .project-list {
            display: inline-block;
            /* margin-left: 80px; */
            font-size: 12px;
            width: 110px;
            margin-top: 5px;
            line-height: 20px;
            word-break: break-all;
            vertical-align: top;
        }
    }
    .home-search-select {
        input {
            width: 97px;
        }
    }
    .select-source-popper {
        .el-scrollbar__wrap {
            overflow: hidden;
        }
    }
</style>
