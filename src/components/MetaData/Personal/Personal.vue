<template>
    <multipane id="personal" class="custom-resizer" layout="vertical">
        <div class="pane" :style="{ width: '250px', maxWidth: '50%', minWidth: '250px' }">
            <div class="personal-wrapper personal-list">
                <h4>{{$t('content.personal.shuj')}}</h4> <!--数据-->
                <ul>
                    <li v-for="(item,index) in personalDataList"
                        :class="{active: selectType == index}"
                        @click="selectItem(index)">
                        <i :class="`personal_icon${item.id}`"></i>
                        {{$t(item.name)}}
                        <span class="personal-count" v-if="item.count > -1">
                            <span>({{item.count}})</span>
                        </span>
                    </li>
                </ul>
                <h4>{{$t('content.personal.shenq')}}</h4> <!--申请-->
                <ul>
                    <li v-for="(item, key) in applyList"
                        @click="selectItem(key)"
                        :class="{active: selectType == key}">
                        <i :class="`personal_icon${item.id}`"></i>
                        {{$t(item.name)}}
                        <span class="personal-count" v-if="item.count > -1">
                            <span>({{item.count}})</span>
                        </span>
                    </li>
                </ul>
                <!--<template v-if="settingPrivilege">
                    <h4>{{$t('content.personal.bqian')}} :</h4> &lt;!&ndash;标签&ndash;&gt;
                    <ul>
                        <router-link to="/Main/MetaData/Personal/Tag" tag="li" active-class="active">
                            <a>
                                <i class="personal_icon7"></i>
                                {{$t('content.personal.bqgl')}}
                            </a>
                        </router-link>
                    </ul>
                </template>-->
                <!-- 元数据变更 -->
                <template v-if="deletePrivilege">
                    <h4>{{$t('content.personal.ysjbg')}}</h4>
                    <ul>
                        <li v-for="(item, key) in delList"
                            @click="selectItem(key)"
                            :class="{active: selectType == key}">
                            <i :class="`personal_icon${item.id}`"></i>
                            {{$t(item.name)}}
                            <span class="personal-count" v-if="item.count > -1">
                                    <span>({{item.count}})</span>
                                </span>
                        </li>
                    </ul>
                </template>

                <!--环境配置-->
                <template v-if="settingPrivilege">
                    <h4>{{$t('content.personal.a26')}}</h4>
                    <ul>
                        <li v-for="(item, key) in settingList"
                            @click="selectItem(key)"
                            :class="{active: selectType == key}">
                            <i :class="`personal_icon${item.id}`"></i>
                            {{$t(item.name)}}
                            <span class="personal-count" v-if="item.count > -1">
                                    <span>({{item.count}})</span>
                                </span>
                        </li>
                    </ul>
                </template>
            </div>
        </div>
        <multipane-resizer></multipane-resizer>
        <div class="pane" :style="{ flexGrow: 1 }">
            <div class="content datasetCon">
                <div class="sub-nav">
                    <ul>
                        <li> {{$t('content.personal.gldb')}} <span class="split-line">/</span></li>
                        <li>{{$t(showTitle)}}</li>
                    </ul>
                </div>
                <div class="table-detail">
                    <template v-if="$route.name === 'Owner'">
                        <ul class="tab-box clearfix">
                            <li v-for="item in ownerTabList"
                                :class="{active: item.tab == ownerActiveTab.component}"
                                @click="$store.dispatch('ownerActiveTab', {component: item.tab, title: item.label})">
                                <span>
                                    {{$t(item.label)}}
                                     <i class="count-badge">{{item.count}}</i>
                                </span>
                            </li>
                        </ul>
                        <span class="tip-content" v-show="tipContent"><i class="iconfont icon-bangzhu"></i>{{tipContent}}</span>
                    </template>
                    <template v-if="$route.name === 'Approvals'">
                        <ul class="tab-box clearfix">
                            <li v-for="item in approvalsTabList"
                                :class="{active: item.tab === approvalsActiveTab.component}"
                                @click="approvalsActiveTab = {component: item.tab, title: item.label}">
                                <span>
                                    {{$t(item.label)}}
                                    <i class="count-badge" v-if="item.tab=='approvalsPending'">{{item.count}}</i>
                                </span>
                            </li>
                        </ul>
                    </template>
                    <router-view :tab="ownerActiveTab" :permissionTab="approvalsActiveTab"></router-view>
                </div>
            </div>
        </div>
    </multipane>
</template>
<script>
    import {Multipane, MultipaneResizer} from 'vue-multipane';
    import {windowSplitter, testPrivilege} from 'mixins/common';
    import Bus from 'utils/bus';
    import {httpRequest} from 'utils';

    export default {
        components: {
            Multipane,
            MultipaneResizer
        },
        mixins: [testPrivilege],
        data: function() {
            return {
                deletePrivilege: false,
                settingPrivilege: false,
                personalDataList: {
                    'Owner': {name: 'content.personal.gldsj', id: 2, count: -1},
                    'Authority': {name: 'content.personal.yqxdsj', id: 3, count: -1},
                    'Collect': {name: 'content.personal.scdsj', id: 1, count: -1}
                },
                applyList: {
                    'Applys': {name: 'content.personal.sqjl', id: 4, count: -1},
                    'Approvals': {name: 'content.personal.qxsp', id: 5, count: -1}
                },
                delList: {
                    'Deleted': {name: 'content.personal.yscdysj', id: 6, count: -1}
                },
                settingList: {
                    'Setting': {name: 'content.personal.a14', id: 7, count: -1}
                },
                selectType: 'Owner',
                ownerTabList: [],
                approvalsTabList: [
                    {tab: 'approvalsPending', label: 'content.personal.dsp', count: 0},
                    {tab: 'approvalsFinish', label: 'content.personal.ysp'}
                ],
                approvalsActiveTab: {component: 'approvalsPending', title: 'content.personal.dsp'}
            };
        },
        computed: {
            tipContent() {
                let content = '';
                switch (this.ownerActiveTab.component) {
                    case 'PersonalMetaMaintain':
                        content = this.$t('content.personal.dqzhxfzdb');
                        break;
                    case 'PersonalChargeMaintain':
                        content = this.$t('content.personal.qdczlszywfzr');
                        break;
                    default:
                        content = '';
                }
                return content;
            },
            showTitle() {
                if (this.selectType === 'Applys') {
                    return 'content.personal.sqjl';
                }
                if (this.selectType === 'Approvals') {
                    return 'content.personal.qxsp';
                }
                if (this.selectType === 'Deleted') {
                    return 'content.personal.yscdysj';
                }
                if (this.selectType === 'Setting') {
                    return 'content.personal.a14';    //环境配置
                }
                return this.personalDataList[this.selectType] && this.personalDataList[this.selectType].name || 'content.personal.bqgl';
            },
            ownerActiveTab() {
                return this.$store.state.ownerActiveTab;
            }
        },
        async created() {
            Bus.$off('fetchCount').$on('fetchCount', this.fetchCount);
            Bus.$on('fetchOwner', (param) => {
                this.fetchOwnerCount();
            });
            Bus.$on('fetchCountList', param => {
                this.fetchCountList();
            });
            Bus.$on('maintainCount', count => {
                // this.ownerTabList[2].count = count
                this.fetchMetaCount();
            });

            // 获取待审批计数
            this.getAppendingCount();
            Bus.$on('appendingCount', () => {
                this.getAppendingCount();
                this.fetchCountList();
            });

            await this.testPrivilege('/datasets/ownedDatasetWithoutOwnerCount', 'get');
            await this.axios.get(`/datasets/deletedDataset?testPrivilege=1`).then(response => {
                this.deletePrivilege = response.body.statusCode === 200;
            }, response => {
                this.deletePrivilege = false;
            });

            //判断配置菜单是否有权限,如果有权限,展示菜单
            await this.axios.get(`/manage/sysConf?testPrivilege=1`).then(response => {
                this.settingPrivilege = response.body.statusCode === 200;
            }, response => {
                this.settingPrivilege = false;
            });

            let activeTabLength = Object.keys(this.ownerActiveTab).length;
            if (this.hasPrivilege) {
                if (!activeTabLength) {
                    if (this.$route.query.tab === "maintain") {
                        this.$store.dispatch('ownerActiveTab', {
                            component: 'PersonalMetaMaintain',
                            title: 'content.home.yxxdwh'
                        });
                    } else {
                        this.$store.dispatch('ownerActiveTab', {
                            component: 'PersonalOwnerTable',
                            title: 'content.personal.whdsyb'
                        });
                    }
                }
                this.ownerTabList = [
                    {tab: 'PersonalOwnerTable', label: 'content.personal.whdsyb', count: 0},
                    {tab: 'PersonalChargeMaintain', label: 'content.home.fzrxxdwh', count: 0},
                    {tab: 'PersonalMetaMaintain', label: 'content.home.yxxdwh', count: 0}
                ];
            } else {
                !activeTabLength && this.$store.dispatch('ownerActiveTab', {
                    component: 'PersonalOwnerTable',
                    title: 'content.personal.whdsyb'
                });
                this.ownerTabList = [
                    {tab: 'PersonalOwnerTable', label: 'content.personal.whdsyb', count: 0},
                    {tab: 'PersonalMetaMaintain', label: 'content.home.yxxdwh', count: 0}
                ];
            }
            this.fetchCount();
            if (this.$route.name === 'Personal') {  //当路径导航到管理专区时,需要切换到子路由(我负责的路由)
                this.$router.push({name: 'Owner'});
            }
        },
        mounted() {
            let self = this;
            //其他页面跳转过来的active
            let _name = self.$route.name;
            if (_name !== "Personal") {
                self.selectType = _name;
            }
        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            $route(val) {
                let type = this.$route.fullPath.split('/')[4] || 'Owner';
                this.ownerTabList.length > 0 && this.$store.dispatch('ownerActiveTab', {
                    component: this.ownerTabList[0].tab,
                    title: this.ownerTabList[0].label
                });
                this.selectItem(type);
            }
        },
        methods: {
            getAppendingCount() {
                const res = httpRequest({vm: this, url: '/privilege/getApprovalListCount'});
                res.then(res => {
                    this.approvalsTabList[0].count = res;
                });
            },

            fetchCount() {
                this.fetchCountList();
                this.fetchMetaCount();
                if (this.hasPrivilege) {
                    this.fetchOwnerCount();
                }
            },
            fetchCountList() {
                const vm = this;
                const res = httpRequest({vm: this, url: '/datasets/getPersonalDataCount'});
                res.then(res => {
                    const keys = Object.keys(res);
                    this.$store.dispatch('setManageInfo', res);
                    for (let key of keys) {
                        if (key == 'Owner' || key == 'Authority' || key == 'Collect') {
                            vm.personalDataList[key].count = res[key];
                        } else if (key == 'Applys' || key == 'Approvals') {
                            vm.applyList[key].count = res[key];
                        } else {
                            vm.delList[key].count = res[key];
                        }
                    }
                    this.$store.dispatch('saveCollectCount', this.personalDataList.Collect.count);
                    this.ownerTabList[0].count = res.Owner;
                });
            },
            fetchOwnerCount() {
                const res = httpRequest({vm: this, url: '/datasets/ownedDatasetWithoutOwnerCount'});
                res.then(res => {
                    this.ownerTabList[1].count = res;
                });
            },
            fetchMetaCount() {
                const res = httpRequest({vm: this, url: '/datasets/ownedDatasetWithoutCommonInfoCount'});
                res.then(res => {
                    if (this.hasPrivilege) {
                        this.ownerTabList[2].count = res;
                    } else {
                        this.ownerTabList[1].count = res;
                    }
                });
            },
            selectItem(type) {
                this.selectType = type;
                if (type !== 'Tag') {
                    this.$router.push({name: this.selectType});
                }
            }
        }

    };
</script>
<style lang="less">
    #personal {
        .pane:first-child {
            padding-top: 0;
            .personal-wrapper {
                height: 100%;
            }
        }
        .table-detail {
            position: relative;
            padding: 20px;
            background-color: #FFF;
            .boxCommon {
                padding: 0;
            }
            .tab-box {
                padding: 0 15px;
                .count-badge {
                    margin-left: 10px;
                    padding: 0 5px;
                    height: 16px;
                    font: 12px/16px normal;
                    border-radius: 7px;
                    background-color: #FB7775;
                    color: #FFF;
                }
            }
            .tip-content {
                display: inline-flex;
                align-items: center;
                position: absolute;
                top: 30px;
                right: 20px;
                width: auto;
                color: #999;
                i {
                    margin-right: 5px;
                }
            }
        }
    }
    .personal-count {
        position: absolute;
        right: 27px;
        color: #CCC;
    }
    .data-history {
        li i {
            color: #014B70;
            background: none;
            font-size: 16px;
        }
        .active i {
            color: #FFF;
        }
    }
    .personal-list li {
        padding: 0 20px;
        line-height: 37px;
        cursor: pointer;
        &.active {
            > a {
                color: #FFF;
            }
        }
        > a {
            line-height: 37px;
            display: block;
            width: 100%;
            height: 100%;
            color: #4C4F57;
        }
    }
</style>
