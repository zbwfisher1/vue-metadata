<template>
    <div class="storage">
        <div class="con">
            <div class="tableMulti">
                <div class="table-title">
                    <div class="table-title__text">
                        <span>{{$t('content.dataset.datasetDetail.ccxx')}}</span> <!-- 存储信息 -->
                    </div>
                </div>
                <dl class="base-info-table">

                    <template v-if="storageData.datasourceType === 'HBASE'">
                        <template v-for="(value, property) in tableDetail">
                            <dt>
                                {{nameObj[property] ? $t(nameObj[property]) : property}}
                            </dt>
                            <dd>
                                <!--如果值还是对象,还需要重新循环遍历 -->
                                <template v-if="typeof value === 'object'">
                                    <div class="text-break" :title="reduceValue(value)">{{reduceValue(value)}}</div>
                                </template>
                                <div class="commom-overflow" :title="value" v-else>{{value}}</div>
                            </dd>
                        </template>
                    </template>
                    <template v-else>
                        <template v-if="!isBusiness">
                            <template
                                    v-if="!isMysqlOrOracle && storageData.properties.tbl_type !== 'VIRTUAL_VIEW' && !isFileType ">
                                <dt>{{$t('content.dataset.datasetDetail.sfwfqb')}}</dt>  <!--是否为分区表-->
                                <dd>{{$t(isPartitioned)}}</dd>
                            </template>
                            <template v-if="storageData.isPartitioned === 'Y'">  <!-- 只有分区表才有分区字段-->
                                <dt>{{$t('content.dataset.datasetDetail.fqzd')}}</dt>   <!--分区字段-->
                                <dd>{{storageData.partition_column}}</dd>
                            </template>
                            <template v-if="storage && storageData.properties.tbl_type !== 'VIRTUAL_VIEW'">
                                <dt>{{$t('content.dataset.datasetDetail.dx')}}</dt>  <!--大小-->
                                <dd>{{storage}}</dd>
                            </template>
                        </template>
                        <template v-if="!isFileType">
                            <dt>{{$t('content.dataset.datasetDetail.cjsj')}}</dt>  <!--创建时间-->
                            <dd>{{formatTime(storageData.createdTime)}}</dd>
                        </template>
                        <template>
                            <dt>{{$t('content.dataset.datasetDetail.sjjgzhgxsj')}}</dt>   <!--数据结构更新时间-->
                            <dd>{{formatTime(storageData.modifiedTime)}}</dd>
                        </template>
                        <template v-if="!isMysqlOrOracle && !isFileType">
                            <dt>{{$t('content.dataset.datasetDetail.zhgxsj')}}</dt>   <!--最后更新时间-->
                            <dd>{{formatTime(storageData.lastModifyTime)}}</dd>
                        </template>
                        <template v-if="isMysqlOrOracle">
                            <dt>{{$t('content.dataset.datasetDetail.hs')}}</dt> <!--行数-->
                            <dd>{{storageData.properties.data_rows}}</dd>
                        </template>
                        <template v-if="!isMysqlOrOracle && storageData.properties.tbl_type !== 'VIRTUAL_VIEW' ">
                            <dt>{{$t('content.dataset.datasetDetail.cclj')}}</dt>  <!--存储路径-->
                            <dd :title="location">
                                <div class="commom-overflow">{{location}}</div>
                            </dd>
                        </template>
                        <template v-if="tableDetailType === 1">
                            <template v-for="(value, key) in tableDetail" v-if="key !== 'partition_column'">
                                <dt>
                                    {{$t(nameObj[key])}}
                                </dt>
                                <dd>
                                    <div class="commom-overflow" :title="value">{{value}}</div>
                                </dd>
                            </template>
                        </template>
                    </template>
                </dl>
            </div>
        </div>
    </div>
</template>
<script>
    import {
        FormatTime,
        FormatSize,
        Message,
        testPrivilege,
        resetValidators,
        FormatLifeDay
    } from 'mixins/common';
    import _ from 'lodash';
    import dialogItemTitle from 'common/dialogItemTitle';

    export default {
        mixins: [FormatTime, FormatSize, Message, testPrivilege, resetValidators, FormatLifeDay],
        name: "properties",
        components: {
            dialogItemTitle
        },
        props: {
            tableId: {
                require: true
            },
            storageData: Object, /*datasetInfo 属性*/
            lastUpdate: String,
            lastStructurUpdate: String,
            flag: String,
            loading: Boolean
        },
        data() {
            const vm = this;
            return {
                oldLifeSet: {
                    life_day: '',
                    type: ''
                },
                deadline: 1,
                showPlaceholder: false,
                tableDetail: {},
                tableDetailType: 1,
                warnVisible: false,
                lifeCycle: this.$t('content.common.yongj'),
                storage: "",
                life_day: '',
                type: 'D',
                tag_type: '',
                tag_column: '',
                create_time: '',

                isPartitioned: 'content.common.fou',
                change: false, //输入是否改变
                nameObj: {
                    location: 'content.dataset.datasetDetail.cclj',
                    DB_ID: 'content.dataset.datasetDetail.sjkbh',
                    TBL_ID: 'content.dataset.datasetDetail.bgbh',
                    create_time: 'content.dataset.datasetDetail.cjsj',   // 创建时间
                    lastUpdate: 'content.dataset.datasetDetail.zhgxsj',   //最后更新时间
                    lastStructurUpdate: 'content.dataset.datasetDetail.sjjgzhgxsj',   //数据结构更新时间
                    input_format: 'content.dataset.datasetDetail.srgs',
                    output_format: 'content.dataset.datasetDetail.scgs',
                    is_compressed: 'content.dataset.datasetDetail.sfys',
                    is_storedassubdirectories: 'content.dataset.datasetDetail.sfcwzml',
                    serialization_format: 'content.dataset.datasetDetail.xlhgs',
                    tbl_type: 'content.dataset.datasetDetail.bglx',
                    etl_source: 'content.dataset.datasetDetail.a16',  //'ETL源',
                    view_related_tables: 'content.dataset.datasetDetail.a17',  //'相关表',
                    length: 'content.dataset.datasetDetail.a18',  //'长度',
                    modificationTime: 'content.dataset.datasetDetail.a19',  //'修改时间',
                    permission: 'content.dataset.datasetDetail.a20',  //'权限',
                    owner: 'content.dataset.datasetDetail.a21',  //'负责人',
                    group: 'content.dataset.datasetDetail.a22',  //'权限组',
                    is_primary_key: 'content.dataset.datasetDetail.a23',  //'是否主键',
                    is_unique: 'content.dataset.datasetDetail.a24',  //'是否唯一',
                    type: 'content.dataset.datasetDetail.a25',  //'类型',
                    index_columns: 'content.dataset.datasetDetail.a26',  //'索引列',
                    constraint_type: 'content.dataset.datasetDetail.a27',  //'约束类型',
                    name: 'content.dataset.datasetDetail.a28',  //'名称',
                    num_of_columns: 'content.dataset.datasetDetail.a29',  //'列数',
                    constraint_name: 'content.dataset.datasetDetail.a30',  //'约束名',
                    compaction: 'content.dataset.datasetDetail.a31',  //'是否启用压缩',
                    configuration: 'content.dataset.datasetDetail.a32',  //'配置项',
                    replication: 'content.dataset.datasetDetail.a33',  //'副本数',
                    blockSize: 'content.dataset.datasetDetail.a34',  //'块大小',
                    durability: 'content.dataset.datasetDetail.a41',
                    maxFileSize: 'content.dataset.datasetDetail.a35',  //'最大文件大小',
                    memstoreSize: 'content.dataset.datasetDetail.a36',  //'内存刷新阈值',
                    readOnly: 'content.dataset.datasetDetail.a37',  //'是否只读',
                    values: 'content.dataset.datasetDetail.a40',
                    enable: 'content.dataset.datasetDetail.a38',
                    columnFamilies: 'content.dataset.datasetDetail.a39',
                    depth: 'content.dataset.datasetDetail.a42', //'depth',
                    fileType: 'content.dataset.datasetDetail.a43' //'文件类型'
                },
                showMore: false,
                location: '',
                isFileType: false  //是否是文件类型的数据
            };
        },
        created() {
            if (this.tableId) {
                this.fetchStorageData();
                this.fetchIsPartitioned();
            }
        },
        updated() {
            const {life_day, type} = this.$data;
            Object.assign(this.oldLifeSet, {life_day, type});
        },
        computed: {
            isBusiness() {
                return this.$store.state.isBusiness;
            },
            // 覆盖mixins中的showRecordList
            showRecordList() {
                let lifeDay = this.life_day;
                let lifeType = this.type;
                return this.switchLifeType({lifeDay, lifeType}, {lang: this.language});
            },
            isMysqlOrOracle() {
                return this.storageData && this.storageData.urn && (this.storageData.urn.startsWith('mysql://') || this.storageData.urn.startsWith('oracle://'));
            }
        },
        methods: {
            reduceValue(obj) {
                let str = '';
                for (name in obj) {
                    str += `${name}:${obj[name]};`;
                }
                return str.substring(0, str.length - 1);
            },
            fetchIsPartitioned() {
                const isP = this.storageData.isPartitioned;
                this.isPartitioned = isP === 'N' ? 'content.common.fou' : 'content.common.shi';
                if (isP !== 'N') {
                    this.type = 'F';
                    this.showPlaceholder = true;
                } else {
                    this.loading = false;
                }
            },
            fetchStorageData() {
                const someData = JSON.parse(JSON.stringify(this.storageData));  //深拷贝
                if (someData.datasetStorageInfo) {
                    const _size = someData.datasetStorageInfo.size;
                    this.storage = this.formatSize(_size);
                }
                this.tableDetail = someData.properties;
                this.create_time = this.tableDetail.create_time;
                if (someData.datasourceType === 'HDFS') {
                    console.log('location', this.location);
                    this.location = someData.urn && someData.urn.replace('hdfs://', 'hdfs/') || '';
                    this.isFileType = true;
                } else {
                    this.location = this.tableDetail.location;
                    this.isFileType = false;
                }
                let keyArray = ['last_modify_time', 'structurModifyTime', 'data_scope', 'modify_time', 'create_time', 'location'];
                if (this.tableDetail.tbl_type === 'VIRTUAL_VIEW') {
                    keyArray.push('location', 'serialization_format');
                }

                keyArray.map(v => {
                    Reflect.deleteProperty(this.tableDetail, v);
                });

                if ("indexes" in this.tableDetail) {
                    this.tableDetailType = 2;//数据库
                } else {
                    this.tableDetailType = 1;//hive 或者 hdfs
                    if ("DB_ID" in this.tableDetail) { //hive
                        // 过滤 参数
                        ['DB_ID', 'TBL_ID', 'etl_source', 'SD_ID'].map((v) => {
                            Reflect.deleteProperty(this.tableDetail, v);
                        });
                        this.tableDetail.is_compressed = this.tableDetail.is_compressed ? this.$t('content.common.shi') : this.$t('content.common.fou');
                        this.tableDetail.is_storedassubdirectories = this.tableDetail.is_storedassubdirectories ? this.$t('content.common.shi') : this.$t('content.common.fou');
                    } else {

                        if (someData.datasourceType === 'HBASE') {
                            this.tableDetail.columnFamilies = this.tableDetail.columnFamilies &&
                                    this.tableDetail.columnFamilies.length &&
                                    this.tableDetail.columnFamilies.reduce((accumulator, currentValue) => {
                                        return accumulator + currentValue + ';';
                                    }, '');
                            this.tableDetail.columnFamilies = this.tableDetail.columnFamilies.substring(0, this.tableDetail.columnFamilies.length - 1);
                            for (name in this.tableDetail.columnFamiliesConfs) {
                                this.tableDetail[`${name}-Configuration`] = this.tableDetail.columnFamiliesConfs[name].configuration;
                                this.tableDetail[`${name}-values`] = Object.assign({}, this.tableDetail.columnFamiliesConfs[name].values);
                            }
                            Reflect.deleteProperty(this.tableDetail, 'columnFamiliesConfs');
                        } else if (someData.datasourceType !== 'HBASE') {
                            this.tableDetail.blockSize = this.tableDetail.blockSize ? this.formatSize(this.tableDetail.blockSize) : '';
                        }
                        Reflect.deleteProperty(this.tableDetail, 'length');
                    }
                }
            }
        }
    };

</script>
<style lang="less">
    @import '../../../../vars.less';
    .storage {
        .tableList {
            margin-bottom: 0;
        }
        .commom-overflow {
            width: 100%;
        }
        .storage-table {

        }
    }
    .storage .titIndex span {
        float: left;
    }
    .storage .edit-container {
        float: right;
        margin-bottom: 10px;
    }
    .storage .el-input.is-disabled .el-input__inner {
        background-color: transparent;
        border-color: #FFF;
        cursor: text;
        color: #333;
        padding-left: 0;
    }
    .storage .el-form-item__error {
        left: 0;
        top: 33px;
    }
    .storage .el-form-item {
        margin-bottom: 0px;
    }
    .storage .el-form-item__content {
        line-height: 26px;
    }
    .storage .el-input__inner,
    .storage .el-select {
        height: 28px;
        width: 400px;
    }
    .storageContent {
        width: 600px;
        word-break: break-all;
        font-size: 13px;
    }
    .propertiew-authority span {
        background: #DBDBDB;
        color: #FFF;
    }
    .propertiew-authority .propperiesWritable {
        background: #267CEB;
    }
    .propertiew-authority .properiesReadable {
        background: #3CBF80;
    }
    .life-cycle-edit .el-form-item__error {
        width: 250px;
        left: 273px;
        top: 5px;
    }
    .life-cycle-edit .el-select-dropdown {
        min-width: 80px !important;
    }
    .life-cycle-edit .el-select, .life-cycle-edit .el-select .el-input__inner {
        width: 80px;
    }
    .life-cycle-edit .el-select-dropdown__item {
        width: 80px;
    }
    .life-cycle-edit .el-input__inner {
        width: 185px;
    }
    .life-cycle-edit {
        .el-row {
            margin-bottom: 0;
        }
    }
    .ail-txt {
        line-height: 30px;
    }
    .warn-box {
        width: 345px;
        line-height: 27px;
        padding-left: 20px;
        border: 1px solid #EEE7D1;
        background: #F5F2E8;
        color: #CDA068;
    }
    .warn-box i {
        display: inline-block;
        width: 6px;
        height: 15px;
        background: url("../../@{imagesUrl}/lifecycle_warn_icon.png");
        vertical-align: middle;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }
    .fade-enter, .fade-leave-to, .fade-leave-active /* .fade-leave-active in <2.1.8 */ {
        opacity: 0
    }
    .ali-placeholder {
        color: #C5C4CC;
    }
    .ail-normal {
        color: #000;
    }
    .lifecycleCon {
        position: relative;
        display: inline-block;
    }
    .storage-dialog {
        width: 534px;
    }
    .storage-dialog .el-input__inner, .storage-dialog .el-select {
        width: 100%;
    }
    .storage-dialog .el-radio__label {
        display: inline-block;
    }
    .storage-dialog .el-form-item__content {
        line-height: 35px;
    }
    .storage-dialog .el-dialog__body {
        padding: 30px 40px;
        min-height: 100px;
    }
    .boxCommon.storage .el-form-item__error {
        width: 300px;
    }
    .storage-show-more {
        line-height: 30px;
        text-align: center;
        color: #014B70;
        cursor: pointer;
        width: 60px;
        margin: 0 auto;
    }
    .storage-show-more:hover {
        color: #2EBFF1;
    }
    .text-break {
        overflow: hidden;
        width: 100%;
        word-break: break-all;
        text-overflow: ellipsis;
    }
</style>
