<template>
    <div class="dataset-box">
        <!-- 属性信息 -->
        <div class="table-title">
            <div class="left">
                <div class="table-title__text">
                    <span>{{$t('content.dataset.datasetDetail.jbxx')}}</span>
                </div>
                <div class="tags">
                    <label>{{$t('content.personal.bqian')}}:</label>
                    <label v-if="!tags.length">
                        {{$t('content.common.zwsj')}}
                    </label>
                    <span class="tag" @click="viewGroup(tag)" v-for="tag in tags">{{tag.name}}</span>
                    <span class="tag new-tag" v-if="hasPrivilege" @click="addNewTag">+</span>
                </div>
            </div>
            <div class="right">
                <label>{{$t('content.dataset.datasetDetail.fzr')}}:</label>
                <template v-if="datasourceType !== 'HBASE'">
                    <span class="right-line">{{baseInfo.owner}}</span>
                    <label>{{$t('content.dataset.businessDetail.zhsjsj')}}:</label>
                    <span>{{formatTime(lastModifyTime)}}</span>
                </template>
            </div>
        </div>
        <!-- 属性信息 -->
        <properties :tableId="tableId"></properties>
        <ul class="tab-box clearfix">
            <li v-if="hasTabDataStructure"
                @click="tabChange('dataStructure')" :class="{active: activeTab === 'dataStructure'}">
                <span>{{$t('content.dataset.datasetDetail.sjjg')}}</span>

            </li>
            <li @click="tabChange('history')" :class="{active: activeTab === 'history'}">
                <span>  {{$t('content.dataset.datasetDetail.bgls')}}</span>
            </li>
            <li @click="tabChange('comments')" :class="{active: activeTab === 'comments'}">
                <span>  {{$t('content.dataset.datasetDetail.zsxx')}}</span>
            </li>

            <li v-if="hasTabLineage"
                @click="tabChange('lineage')" :class="{active: activeTab === 'lineage'}">
                <span>{{$t('content.dataset.datasetDetail.xygx')}}</span>
            </li>

            <li v-if="hasTabSampleData"
                @click="tabChange('sampleData')" :class="{active: activeTab === 'sampleData'}">
                <span>{{$t('content.dataset.datasetDetail.ybsj')}}</span>
            </li>
            <li v-if="hasTabLifeCycle"
                @click="tabChange('lifeCycle')" :class="{active: activeTab === 'lifeCycle'}">
                <span>{{$t('content.dataset.datasetDetail.smzq')}}</span>
            </li>
            <li v-if="hasTabPermission"
                @click="tabChange('permission')" :class="{active: activeTab === 'permission'}">
                <span>{{$t('content.dataset.datasetDetail.qxxx')}}</span>
            </li>
        </ul>
        <!-- 数据结构 -->
        <schema :tableId="tableId"
                v-if="activeTab === 'dataStructure'"
                :hasDetail="hasTabLineage"
                :isDefault="isDefault"
                :type='datasourceType'></schema>
        <!-- 注释信息 -->
        <comments :tableId="tableId" v-if="activeTab === 'comments'"></comments>
        <!-- 变更记录 -->
        <div class="boxCommon" v-if="activeTab === 'history'">
            <data-history :tableId="tableId" :isPartitioned="hasTabLifeCycle"></data-history>
        </div>
        <!-- 样本数据 -->
        <sampleData class="boxCommon" :tableId="tableId" :type='datasourceType'
                    v-if="activeTab === 'sampleData'"></sampleData>
        <!-- 权限信息 -->
        <data-permission :tableId="tableId" v-if="activeTab === 'permission'"></data-permission>
        <!-- 血缘关系 -->
        <diagram v-if="activeTab === 'lineage'" :tableId="tableId"/>
        <!-- 生命周期 -->
        <template v-if="activeTab === 'lifeCycle'">
            <life-cycle :id="tableId"></life-cycle>
        </template>

        <!--查看关联标签-->
        <el-dialog :title="$t('content.tags.ckgldx',[currentTag.name])"
                   :close-on-click-modal="false"
                   class="dialog-add-tags"
                   width="700px"
                   :visible.sync="addTagDialogVisible">
            <tag-detail :id="currentTag.id" :visible="addTagDialogVisible"></tag-detail>
        </el-dialog>
    </div>

</template>

<script>
    import Bus from 'utils/bus';
    import Properties from './Properties';
    import PropertyItem from './PropertyItem';
    import Comments from './Comments';
    import Schema from './Schema';
    import SampleData from './SampleData';
    import DataHistory from './DataHistory';
    import Diagram from './Diagram';
    import DataPermission from './DataPermission';
    import {testPrivilege, FormatTime} from 'mixins/common'; //时间格式化
    import {mapState} from 'vuex';
    import LifeCycle from './children/LifeCycle';
    import {getTableCommonInfo} from '@/service/getData';
    import TagDetail from '../chiildren/TagDetail';

    export default {
        components: {
            Properties,//属性信息
            Comments,//注释信息
            Schema,//数据结构
            SampleData,//样本数据
            DataHistory,//变更记录
            DataPermission,//权限信息
            Diagram,
            LifeCycle,    //生命周期子组件
            PropertyItem,
            TagDetail
        },
        mixins: [testPrivilege, FormatTime],
        props: ['tags'],
        computed: {
            tableId() {
                return this.$store.state.fetchRouter.datasetId || this.$route.query.id;
            },
            path() {
                let _path = this.$route.query.path;
                if (_path) {
                    let path = _path.replace('://', '/');
                    return path;
                }
            },
            pathType() {
                let _path = this.path;
                if (!_path) {
                    return;
                }
                let _type = _path.split("/")[0];
                return _type;
            },
            ...mapState({
                dataStatus: 'dataStatus',
                getSample: 'getSample'
            })
        },
        data() {
            return {
                activeTab: 'dataStructure',   //当前选择tab,
                hasTabSampleData: true,
                hasTabLifeCycle: true,
                hasTabPermission: true,
                hasTabLineage: true,
                hasTabDataStructure: true,
                datasourceType: '',
                tagDialogVisible: false,
                baseInfo: {
                    businessName: '',          //业务名称
                    owner: '',                 //业务负责人
                    description: '',           //简介
                    topicList: '',             //业务主题
                    sensitiveCategory: '',     //敏感标识
                    authStatus: '',            //权限状态
                    updateInterval: '',        //数据更新频率
                    status: '',                //实体状态
                    bizMeaning: '',            //业务意义
                    ms: '',                    //描述
                    source: '',                //数据来源
                    sourceCategory: '',        //下游系统
                    sourceSystem: '',          //来源表
                    datasourceType: '',
                    isDefault: ''
                },
                storageInfo: {},
                maintainInfo: {},
                lastModifyTime: '',
                tableName: '',
                editedLabel: '',
                currentTag: {},
                addTagDialogVisible: false,
                isDefault: false  //是否是默认数据源
            };
        },
        mounted() {
            this.fetchAll();
        },
        created() {
            Bus.$on('sortTab', (state) => {

                /*
                * status表示当前表的状态  0:正常, 1.已删除, 2.未知
                * datasourceType  数据源类型
                * sensitiveData
                * */
                const {sensitiveData, datasetInfo, isDefault, datasourceType, status, owner, getSample} = state;
                this.datasourceType = datasourceType;
                this.hasTabSampleData = sensitiveData === 'N' && getSample;
                this.hasTabLifeCycle = datasetInfo.isPartitioned === 'Y' && datasourceType === 'HIVE';
                this.hasTabPermission = isDefault === 1 && status === 0 && this.hasPrivilege && datasourceType !== 'HDFS';
                this.hasTabLineage = datasourceType === 'HIVE' && isDefault === 1 && status === 0;
                this.hasTabDataStructure = datasourceType !== 'HDFS';
                this.baseInfo.owner = owner;
                this.activeTab = this.datasourceType === 'HDFS' ? 'history' : 'dataStructure';
                this.isDefault = isDefault;
            });
            Bus.$on('lastModifyTime', data => {
                this.lastModifyTime = data;
            });
        },
        watch: {
            '$route'(val) {
                if (val.query.path) {
                    this.fetchAll();
                    this.activeTab = this.datasourceType === 'HDFS' ? 'history' : 'dataStructure';
                }
            }
        },
        methods: {
            viewGroup(tag) {
                this.currentTag = tag;
                this.addTagDialogVisible = true;
            },
            addNewTag() {
                this.$emit('addNewTag');
            },
            tabChange: function(type) {
                Bus.$emit('commentTab', type);
                this.activeTab = type;
            },
            async fetchAll() {
                if (this.tableId) {
                    await this.testPrivilege(`/privilege/getAuthorizedAccounts`, 'get', `datasetId=${this.tableId}`);
                    this.$store.dispatch('propEditPrivilege', this.hasPrivilege);
                }
            },
            fetchTableCommonInfo() {
                getTableCommonInfo(this.tableId).then((res) => {
                    const {statusCode, message} = res.data;
                    if (statusCode === 200) {
                        const {
                            businessName,
                            owner,
                            description,
                            topicList,
                            sensitiveCategory,
                            authStatus,
                            updateInterval,
                            status,
                            bizMeaning,
                            ms,
                            source,
                            sourceCategory,
                            sourceSystem,
                            datasourceType,
                            isDefault
                        } = message.datasetCommonInfo;
                        Bus.$emit('headerInfo', message.datasetCommonInfo);
                        this.tags = message.datasetCommonInfo.tags;
                        this.lastModifyTime = message.datasetInfo.lastModifyTime;
                        this.tableName = message.datasetCommonInfo.tableName;
                        this.baseInfo = {
                            businessName,
                            owner,
                            description,
                            topicList,
                            sensitiveCategory,
                            authStatus,
                            updateInterval,
                            status,
                            bizMeaning,
                            ms,
                            source,
                            sourceCategory,
                            sourceSystem,
                            datasourceType,
                            isDefault
                        };
                    }
                });
            }
        }
    };
</script>
<style lang="less">
    @import '../../../../vars.less';
    .dataset-box {
        background-color: #FFF;
        padding: 10px 20px 20px;
        .table-title {
            .left {
                display: flex;
            }
            .right {
                font-size: 12px;
                color: #869198;
                white-space: nowrap;
                .right-line {
                    padding-right: 10px;
                    margin-right: 10px;
                    border-right: 1px solid #CCC;
                }
            }
            .tags {
                display: flex;
                align-items: center;
                margin-left: 30px;
                margin-right: 10px;
                padding-left: 20px;
                background: url("../../@{imagesUrl}/metaData/icon/bq.png") no-repeat left center;
                cursor: pointer;
                label {
                    margin-right: 10px;
                }
                .tag {
                    display: inline-block;
                    margin-right: 10px;
                    padding: 2px 15px;
                    height: 26px;
                    line-height: 22px;
                    background-color: #EFF4F6;
                    border-radius: 2px;
                    color: #014B70;
                }
                .new-tag {
                    font-weight: bold;
                    font-size: 16px;
                }
            }
        }
        .base-info-table {
            margin-bottom: 15px;
            width: 100%;
            th, td {
                padding-left: 20px;
                height: 35px;
                line-height: 35px;
                border: 1px solid #DDD;
                color: #869198;
                font-weight: normal;
            }
            th {
                background-color: #FAFBFC;
            }
        }
        .tab-box {
            margin: 0 -15px;
            padding: 0 15px;
        }
    }
    .diagram-component {
        overflow: hidden;
        height: calc(~ '100% - 60px');
    }
</style>
