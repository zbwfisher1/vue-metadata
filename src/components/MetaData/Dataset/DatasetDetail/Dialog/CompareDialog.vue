<template>
    <el-dialog
            :title="$t('content.dataset.datasetDetail.bbdb')"
            :visible.sync="dialogVisible"
            custom-class="dialog-version"
            width="60%">
        <loading :isloading="loading" v-if="loading"></loading>
        <template v-else>
            <div class="same">
                <el-checkbox v-model="checked">{{$t('content.dataset.businessDetail.ycxtx')}}</el-checkbox>
            </div>
            <table class="table table-bordered tableList">
                <tbody>
                <tr>
                    <td v-html="$t('content.dataset.businessDetail.bdyxx',[tableName])"></td>
                    <td v-for="version in data.versions">
                        <div><b>{{version.versionName === 'current' ? $t('content.dataset.businessDetail.dqbb') :
                            version.versionName}}</b></div>
                        <div>{{$t('content.dataset.businessDetail.dbsj')}}:
                            {{version.versionName === 'current'? $t('content.dataset.businessDetail.bsj'):
                            formatTime(version.createTime * 1000)}}
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="table-wrapper">
                <table class="table table-bordered tableList">
                    <tbody>
                    <tr v-if="basicInfo.length">
                        <td colspan="3">
                            <b>{{$t('content.dataset.datasetDetail.jbxx')}}:</b>
                        </td>
                    </tr>
                    <tr v-for="item in basicInfo">
                        <td>{{item[1]}}</td>
                        <td>
                            <div class="commom-overflow" :title="item[2]">{{item[2]}}</div>
                        </td>
                        <td>
                            <div class="commom-overflow" :title="item[3]">{{item[3]}}</div>
                        </td>
                    </tr>
                    <tr v-if="fieldsInfo.length">
                        <td colspan="3">
                            <b>{{$t('content.dataset.businessDetail.zdxx')}}:</b>
                        </td>
                    </tr>
                    <tr v-for="(item, index) in fieldsInfo">
                        <td>{{item[0]}}</td>
                        <td>
                            {{item[1] ?
                            `${$t('content.dataset.businessDetail.zdlx')}(${item[1]})`:`${$t('content.dataset.businessDetail.zdlx')}(--)`}}
                            <template v-if="item[2] !== undefined">
                                <br/>
                                {{`${$t('content.dataset.businessDetail.zdms')}(${item[2]})`}}
                            </template>
                            <template v-if="item[3] !== undefined">
                                <br/>
                                {{`${$t('content.dataStructure.mgjb')}(${item[3]})`}}
                            </template>
                        </td>
                        <td>
                            {{item[4] ?
                            `${$t('content.dataset.businessDetail.zdlx')}(${item[4]})`:`${$t('content.dataset.businessDetail.zdlx')}(--)`}}
                            <template v-if="item[5] !== undefined">
                                <br/>
                                {{`${$t('content.dataset.businessDetail.zdms')}(${item[5]})`}}
                            </template>
                            <template v-if="item[6] !== undefined">
                                <br/>
                                {{`${$t('content.dataStructure.mgjb')}(${item[6]})`}}
                            </template>
                        </td>
                    </tr>
                    <tr v-if="extendFields.length">
                        <td colspan="3">
                            <b>{{$t('content.dataset.businessDetail.zdyzdxx')}}:</b>
                        </td>
                    </tr>
                    <tr v-for="item in extendFields">
                        <td>{{item[0]}}</td>
                        <td>
                            <div class="commom-overflow" :title="item[1] === undefined? '--' : item[1]">
                                {{item[1] === undefined? '--' : item[1]}}
                            </div>
                        </td>
                        <td>
                            <div class="commom-overflow" :title="item[2] === undefined? '--' : item[2]">
                                {{item[2] === undefined? '--' : item[2]}}
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">{{$t('content.common.qd')}}</el-button>
          </span>
        </template>
    </el-dialog>
</template>

<script>
    import {Message, FormatTime, resetValidators} from 'mixins/common';

    export default {
        name: "CompareDialog",
        props: ['versionDialogVisble', 'dialogVisible', 'data', 'tableName', 'loading', 'backupTypeMap', 'lifeDayMap'],
        mixins: [Message, FormatTime, resetValidators],
        watch: {
            dialogVisible: function (newValue) {
                //每当dialogVisible的值改变则发送事件update:dialogVisible , 并且把值传过去
                this.$emit('update:dialogVisible', newValue);
            }
        },
        computed: {
            fieldsInfo() {
                if (this.checked) {
                    const notSameFields = this.data.notSameFields;
                    const newArray = [];
                    this.fieldsAll && this.fieldsAll.forEach((value, index) => {
                        notSameFields.includes(`fieldName.${value[0]}`) && newArray.push(value);
                    });
                    return newArray;
                } else {
                    return this.fieldsAll;
                }
            },
            fieldsDesc() {
                if (this.checked) {
                    const notSameFields = this.data.notSameFields;
                    const newArray = [];
                    this.fieldsAll && this.fieldsAll.forEach((value, index) => {
                        notSameFields.includes(`fieldDesc.${value[0]}`) && newArray.push(value);
                    });
                    return newArray;
                } else {
                    return this.fieldsAll;
                }
            },
            extendFields() {
                const arr = [];
                const {versions} = this.data;

                if (versions && versions.length) {
                    const map1 = Object.keys(versions[0]['extendFields']);
                    const map2 = Object.keys(versions[1]['extendFields']);
                    const keys = [...new Set([...map1, ...map2])];  //去重并转换成数组

                    keys.forEach(key => {
                        arr.push([key, versions[0]['extendFields'][key], versions[1]['extendFields'][key]]);
                    });
                }

                if (this.checked) {
                    const notSameFields = this.data.notSameFields;
                    const newArray = [];
                    arr.forEach((value, index) => {
                        notSameFields.includes(`extendFields.${value[0]}`) && newArray.push(value);
                    });
                    return newArray;
                } else {
                    return arr;
                }
            },
            fieldsAll() {
                const arr = [];
                const existFiels = [];
                const {versions} = this.data;

                if (versions && versions.length) {
                    versions[0]['fields'].forEach(fiels => {
                        existFiels.push(fiels.fieldName);
                        arr.push([fiels.fieldName, fiels.dataType, fiels.comment, fiels.sensitiveName, undefined, undefined, undefined]);
                    });

                    versions[1]['fields'].forEach(fiels => {
                        if (existFiels.includes(fiels.fieldName)) {
                            arr.forEach((value1, key) => {
                                if (arr[key][0] === fiels.fieldName) {
                                    arr[key][4] = fiels.dataType;
                                    arr[key][5] = fiels.comment;
                                    arr[key][6] = fiels.sensitiveName;
                                }
                            });
                        } else {
                            arr.push([fiels.fieldName, undefined, undefined, undefined, fiels.dataType, fiels.comment, fiels.sensitiveName]);
                        }
                    });
                }
                return arr;
            },
            lifeCycle() {
                const arr = [];
                const {versions} = this.data;

                if (versions && versions.length) {

                }

            },
            basicInfo() {
                const arr = [];
                if (this.data && this.data.versions && this.data.versions.length) {
                    const keysArray = Object.keys(this.data.versions[0]);
                    const version1 = this.data.versions[0];
                    const version2 = this.data.versions[1];

                    const filterKey = ['fields', 'extendFields', 'datasetId', 'id',
                        'versionDesc', 'versionIds', 'versionName', 'createTime',
                        'jsonFields', 'jsonExtendFields', 'sensitiveData'
                    ];

                    //当表在两个版本都不为敏感表时，在版本对比页面，不展示敏感类别字段; 表也不需要展示
                    if (this.data.versions.every(version => version.sensitiveData === 'N') || version1.datasourceType !== 'Hdfs') {
                        filterKey.push('sensitiveCategory');
                    }

                    keysArray.forEach(key => {
                        if (!filterKey.includes(key)) {  //去掉基本信息的这两个字段
                            let name = '';
                            switch (key) {
                                case 'downstream':
                                    name = this.$t('content.dataset.datasetDetail.xyxt');
                                    break;
                                case 'sourceTable':
                                    name = this.$t('content.dataset.datasetDetail.lybgnmk'); //'来源表/功能模块';
                                    break;
                                case 'topicPaths':
                                    name = this.$t('content.dataset.datasetDetail.ztlj'); //'所属主题路径';
                                    break;
                                case 'businessName':
                                    name = this.$t('content.dataset.businessDetail.biem');
                                    break;
                                case 'description':
                                    name = this.$t('content.dataset.datasetDetail.sjms');
                                    break;
                                case 'source':
                                    name = this.$t('content.dataset.datasetDetail.sjly');
                                    break;
                                case 'generateMethod':
                                    name = this.$t('content.dataset.datasetDetail.scff');
                                    break;
                                case 'updateInterval':
                                    name = this.$t('content.dataset.datasetDetail.gxzq');
                                    break;
                                case 'bizMeaning':
                                    name = this.$t('content.dataset.datasetDetail.ywyy');
                                    break;
                                case 'sourceCategory':
                                    name = this.$t('content.dataset.datasetDetail.xyxt');
                                    break;
                                case 'sensitiveCategory':
                                    name = this.$t('content.dataset.datasetDetail.mglb');
                                    break;
                                case 'sourceSystem':
                                    name = this.$t('content.dataset.datasetDetail.lybgnmk');
                                    break;
                                case 'owner':
                                    name = this.$t('content.dataset.datasetDetail.sjfzr');
                                    break;
                                case 'lifeDay':
                                    name = this.$t('content.dataset.datasetDetail.a13'); //  '存储周期';
                                    break;
                                case 'tagColumn':
                                    name = this.$t('content.dataset.datasetDetail.a14'); //'分区列';
                                    break;
                                case 'backupType':
                                    name = this.$t('content.dataset.datasetDetail.a15'); //'备份周期';
                                    break;
                            }

                            if (key === 'lifeDay') {
                                name.length && arr.push([
                                    key,
                                    name,
                                    this.lifeDayMap(version1[key]),
                                    this.lifeDayMap(version2[key])
                                ]);
                            } else if (key === 'backupType') {
                                name.length && arr.push([
                                    key,
                                    name,
                                    this.backupTypeMap(version1[key]),
                                    this.backupTypeMap(version2[key])
                                ]);
                            } else {
                                name.length && arr.push([key, name, version1[key], version2[key]]);
                            }
                        }
                    });
                    if (this.checked) {
                        const notSameFields = this.data.notSameFields;
                        const newArray = [];
                        arr.forEach((value, index) => {
                            notSameFields.includes(value[0]) && newArray.push(value);
                        });
                        return newArray;
                    } else {
                        return arr;
                    }
                } else {
                    return [];
                }
            }
        },
        created() {
        },
        data() {
            return {
                checked: false
            };
        },
        methods: {
            previous() {
                this.dialogVisible = false;
                this.versionDialogVisble = true;
            }
        }
    };
</script>

<style lang="less">
    .title-compare {
        margin: 15px 0 5px;
    }
    .same {
        margin: 10px 0;
    }
    .compare {
        .el-dialog__body {
            min-height: 200px;
            .table-wrapper {
                overflow: auto;
                height: 300px;
                .commom-overflow {
                    width: 100%;
                }
                .b {
                    font-size: 16px;
                }
                .table > tbody > tr > td {
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }
</style>
