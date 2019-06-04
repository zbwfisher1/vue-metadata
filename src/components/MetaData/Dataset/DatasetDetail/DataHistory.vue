<template>
    <div class="data-history">
        <div class="con clearfix">
            <el-row>
                <el-radio-group v-model="radio">
                    <el-radio-button :label="1">{{$t('content.dataHistory.a1')}}</el-radio-button>
                    <el-radio-button :label="2">{{$t('content.dataHistory.a2')}}</el-radio-button>
                </el-radio-group>
                <el-button icon="el-icon-plus"
                           v-if="hasPrivilege && radio === 1"
                           type="primary"
                           class="pull-right versions"
                           @click="dialogVisible = true">{{$t("content.dataset.datasetDetail.xjbb")}}
                </el-button>
                <template v-if="radio === 2">
                    <Search
                            :placeholder="$t('content.header.srbm')"
                            emitName="fetch"
                            @fetch="handleSearch"></Search>
                </template>
            </el-row>
            <template v-if="radio === 1">
                <el-table :data="tableHistoryData"
                          border
                          key='table'
                          :default-sort="{prop: 'changeDate', order: 'descending'}"
                          @sort-change="sortTableHistory"
                          v-loading="loading"
                          v-show="radio === 1">
                    <el-table-column prop="changeDate"
                                     :label="$t('content.dataHistory.a6')"
                                     width="180px"
                                     sortable="custom">
                        <template slot-scope="scope">
                            {{formatTime(scope.row.changeDate)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="versionName"
                                     width="180px"
                                     :label="$t('content.dataHistory.a7')">
                    </el-table-column>
                    <el-table-column width="180px"
                                     prop="userName"
                                     :label="$t('content.dataHistory.a8')">
                    </el-table-column>
                    <el-table-column
                            prop="desc"
                            :label="$t('content.dataHistory.a9')">
                    </el-table-column>
                </el-table>
            </template>
            <template v-else>
                <el-table :data="tableVersionData"
                          key='table2'
                          border
                          :default-sort="{prop: 'createTime', order: 'descending'}"
                          @sort-change="sortTableVersion"
                          v-loading="loading"
                          v-show="radio === 2">
                    <el-table-column
                            prop="versionName"
                            :label="$t('content.dataHistory.a10')">
                    </el-table-column>
                    <el-table-column
                            prop="userName"
                            :label="$t('content.dataHistory.a11')">
                    </el-table-column>
                    <el-table-column prop="createTime" :label="$t('content.dataHistory.a12')" sortable="custom">
                        <template slot-scope="scope">
                            {{formatTime(scope.row.createTime * 1000)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="versionDesc"
                            :label="$t('content.dataHistory.a13')">
                    </el-table-column>
                    <el-table-column :label="$t('content.dataset.datasetDetail.cz')">
                        <template slot-scope="scope">
                            <div class="handle-icon">
                                <i class="el-icon-document" :title="$t('content.common.xq')"
                                   :class="{'disabled': compareItem.size}"
                                   @click="handlerRow('view', scope.row)"/>
                                <span v-if="hasPrivilege">
                                <i class="el-icon-refresh" :title="$t('content.common.gx')"
                                   :class="{'disabled': compareItem.size}"
                                   @click="handlerRow('update', scope.row)"/>
                                <i class="el-icon-delete" :title="$t('content.common.sc')"
                                   :class="{'disabled': compareItem.size}"
                                   @click="handlerRow('delete', scope.row)"/>
                            </span>
                                <i :class="[scope.row.isJoin ? 'el-icon-remove-outline' : 'el-icon-circle-plus-outline']"
                                   :title="$t('content.dataset.datasetDetail.bbdb')"
                                   @click="handlerRow('compare', scope.row)"/>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <div class="tablePages">
                <template v-if="radio === 2">
                    <template v-for="(item, index) in ids">
                        <el-tag @close="handleClose(item)"
                                closable>{{item.substring(item.indexOf('-') + 1)}}
                        </el-tag>
                    </template>
                    <el-button type="text" v-if="ids.length === 1" @click="openVersion">
                        {{$t('content.dataHistory.a22')}}<!--与当前版本对比--></el-button>
                    <el-button type="text" v-if="ids.length === 2" @click="openVersion">
                        {{$t('content.dataHistory.a23')}}<!--生成对比视图--></el-button>
                </template>
                <el-pagination background
                               layout="total, prev, pager, next"
                               @current-change="handleChange"
                               :current-page="currentPage"
                               :page-size="pageSize"
                               :total="totalRows">
                </el-pagination>
            </div>
        </div>

        <!--新建元数据版本-->
        <el-dialog :title="$t('content.dataset.datasetDetail.xjysjbb')"
                   :visible.sync="dialogVisible"
                   custom-class="dialogWrapper"
                   :close-on-click-modal="false">
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" class="ruleForm-dialog">
                <el-form-item :label="$t('content.dataset.datasetDetail.bbbh')" prop="number">
                    <el-input v-model="ruleForm.number"
                              :maxlength="maxLength"
                              :placeholder="$t('content.dataset.datasetDetail.bbhbkcf')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('content.dataset.datasetDetail.bbms')" prop="description">
                    <el-input type="textarea"
                              :maxlength="maxLength"
                              :placeholder="$t('content.dataset.datasetDetail.bbmsktx')"
                              :autosize="{ minRows: 4, maxRows: 6}"
                              v-model="ruleForm.description"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="dialogVisible = false">
                    {{$t("content.common.qx")}}
                </el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">
                    {{$t("content.common.qd")}}
                </el-button>
            </div>
        </el-dialog>
        <!-- 查看当前版本详情 -->
        <el-dialog :title="$t('content.dataHistory.a5')"
                   :visible.sync="detailsDialogVisible"
                   custom-class="dialogWrapper"
                   width="700px"
                   :close-on-click-modal="false">
            <div class="body-wrapper">
                <table class="table table-bordered tableList table-column-2">
                    <tbody>
                    <tr>
                        <td v-html="$t('content.dataset.businessDetail.bdyxx',[tableName])"></td>
                        <td>
                            <div><b>{{versionDetails.versionName === 'current' ?
                                $t('content.dataset.businessDetail.dqbb') :
                                tableName}}</b></div>
                            <div>{{$t('content.dataset.businessDetail.dbsj')}}:
                                {{versionDetails.versionName === 'current'? $t('content.dataset.businessDetail.bsj'):
                                formatTime(versionDetails.createTime * 1000)}}
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div class="table-wrapper">
                    <table class="table table-bordered tableList table-column-2">
                        <tbody>
                        <tr v-if="basicInfo.length">
                            <td colspan="2">
                                <b>{{$t('content.dataset.datasetDetail.jbxx')}}:</b>
                            </td>
                        </tr>
                        <tr v-for="item in basicInfo">
                            <td>{{item[1]}}</td>
                            <td>
                                <div class="commom-overflow" :title="item[2]">{{item[2]}}</div>
                            </td>
                        </tr>

                        <tr v-if="versionDetails.fields && versionDetails.fields.length">
                            <td colspan="2">
                                <b>{{$t('content.dataset.businessDetail.zdxx')}}:</b>
                            </td>
                        </tr>

                        <tr v-for="(item, index) in versionDetails.fields">
                            <td>{{item.fieldName}}</td>
                            <td>
                                <div class="commom-overflow" :title="item['dataType']">
                                    {{$t('content.common.leix')}}: {{item['dataType']}}
                                </div>
                                <div class="commom-overflow" :title="item['comment']">
                                    {{$t('content.dataset.datasetDetail.ms')}}: {{item['comment']}}
                                </div>
                                <div class="commom-overflow" :title="item['sensitiveName']">
                                    {{$t('content.dataStructure.mgjb')}}: {{item['sensitiveName']}}
                                </div>
                            </td>
                        </tr>
                        <tr v-if="versionDetails.extendFields && Object.keys(versionDetails.extendFields).length">
                            <td colspan="2">
                                <b>{{$t('content.dataset.businessDetail.zdyzdxx')}}:</b>
                            </td>
                        </tr>
                        <tr v-for="(value, key) in versionDetails.extendFields">
                            <td>{{key}}</td>
                            <td>
                                <div class="commom-overflow" :title="value">{{value}}</div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </el-dialog>
        <!-- 版本回退 -->
        <el-dialog :title="$t('content.common.tis')" :close-on-click-modal="false"
                   :visible.sync="updateDialogVisible" width="500px">
            <div>
                <span v-html="$t('content.dataHistory.a24', [tableName, currentRow.versionName])"></span>
                <a class="btn-rollback" @click.stop.prevent="openVersionDialog">
                    {{$t('content.dataHistory.a25')}}
                    <!--去创建新版本--></a>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="updateDialogVisible = false">
                    {{$t('content.common.qx')}}
                </el-button>
                <el-button type="primary" :loading="btnLoading"
                           @click="updateVersion">
                    {{$t('content.common.qd')}}
                </el-button>
            </div>
        </el-dialog>
        <!--删除版本-->
        <el-dialog :title="$t('content.common.tis')" :close-on-click-modal="false"
                   :visible.sync="deleteDialogVisible" width="350px">
            <div class="del-content" v-html="$t('content.dataHistory.a26', [currentRow.versionName])">
                <!--请确认是否删除此版本 "<b>{{currentRow.versionName}}</b>" ?-->
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="deleteDialogVisible = false">
                    {{$t('content.common.qx')}}
                </el-button>
                <el-button type="primary" :loading="btnLoading"
                           @click="deleteHandlerVersion">
                    {{$t('content.common.qd')}}
                </el-button>
            </div>
        </el-dialog>
        <!-- 版本对比-->
        <CompareDialog class="compare" :data="compareInfo"
                       :backupTypeMap="backupTypeMap"
                       :lifeDayMap="lifeDayMap"
                       :tableName="tableName"
                       :loading="dialogCompareLoading"
                       :dialogVisible.sync="compareDialogVisible"></CompareDialog>
    </div>
</template>
<script>
    import CompareDialog from './Dialog/CompareDialog';
    import {FormatTime} from 'mixins/common';
    import {createVersion, getVersion, changeHistory, compareV, returnVersion, deleteVersion} from '@/service/getData';
    import {mapState} from 'vuex';
    import Search from 'common/Search';
    import Bus from 'utils/bus';
    import {textFieldLength} from '@/config/env';

    export default {
        name: 'DataHistory',
        props: ['tableId', 'isPartitioned'],
        mixins: [FormatTime],
        components: {
            CompareDialog,
            Search
        },
        data() {
            return {
                maxLength: textFieldLength.normal,
                compareInfo: {},
                dialogCompareLoading: false,
                tableName: '',
                radio: 1,
                radioMap: {
                    1: this.$t('content.dataHistory.a1'),
                    2: this.$t('content.dataHistory.a2')
                },
                keyword: '',
                currentRow: {},
                currentVersion: {
                    versionName: this.$t('content.dataset.datasetDetail.dqbb'),
                    id: 0
                },
                btnLoading: false,
                dialogVisible: false,
                compareDialogVisible: false,
                detailsDialogVisible: false,
                updateDialogVisible: false,
                deleteDialogVisible: false,
                versionDialogVisble: false,
                ruleForm: {
                    number: '',
                    description: ''
                },
                rules: {
                    number: [
                        {required: true, message: this.$t("content.dataset.datasetDetail.qsrbbbh"), trigger: 'change'},
                        {
                            min: 1,
                            max: textFieldLength.normal,
                            message: this.$t('content.dataset.datasetDetail.cdzf', [1, textFieldLength.normal]),
                            trigger: 'change'
                        }
                    ],
                    description: [
                        {required: true, message: this.$t("content.dataset.datasetDetail.qsrbbms"), trigger: 'change'},
                        {
                            min: 1,
                            max: textFieldLength.normal,
                            message: this.$t('content.dataset.datasetDetail.cdzf', [1, textFieldLength.normal]),
                            trigger: 'change'
                        }
                    ]
                },
                dataList: [],
                loading: true,
                pageSize: 10,
                currentPage: 1,
                totalPages: 0,
                totalRows: 0,
                order: 'desc',
                sort: "createTime",
                tableHistoryData: [],
                tableVersionData: [],
                versionDetails: {},
                compareItem: new Set()
            };
        },
        computed: {
            'ids': function() {
                return [...this.compareItem];
            },
            basicInfo() {
                const arr = [];
                const {versionDetails} = this;
                const keysArray = Object.keys(versionDetails);
                if (keysArray.length) {
                    const filterKey = ['fields', 'extendFields', 'datasetId', 'id',
                        'versionDesc', 'versionIds', 'versionName', 'createTime',
                        'jsonFields', 'jsonExtendFields', 'sensitiveData'
                    ];

                    if (versionDetails.datasourceType !== 'Hdfs') {
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
                                    this.lifeDayMap(versionDetails[key])
                                ]);
                            } else if (key === 'backupType') {
                                name.length && arr.push([
                                    key,
                                    name,
                                    this.backupTypeMap(versionDetails[key])
                                ]);
                            } else {
                                name.length && arr.push([key, name, versionDetails[key]]);
                            }
                        }
                    });
                    return arr;
                } else {
                    return [];
                }
            },
            ...mapState({
                hasPrivilege: 'propEditPrivilege'
            }),
            ...mapState({
                viewData: 'viewData'
            })
        },
        created() {
            this.tableName = this.viewData.viewTable.path.split('/').slice(-1).toString();   //表名
        },
        watch: {
            '$route': function(val) {
                if (val.query.path) {
                    this.fetchBasicData();
                }
            },
            'dialogVisible': function(val) {
                if (!val) {
                    this.$refs['ruleForm'].resetFields();
                }
            },
            'radio': function(val) {
                this.resetData();
                if (val === 2) {
                    this.fetchVersionList();
                } else {
                    this.fetchBasicData();
                }
            }
        },
        methods: {
            sortTable(params, handleName) {
                const cacheOrder = this.order;  //上一次的排序字段
                const cacheSort = this.sort;  //上一次的排序值
                this.sort = params.prop;
                if (params.order === 'descending') {
                    this.order = 'desc';
                } else if (params.order === 'ascending') {
                    this.order = 'asc';
                } else {
                    this.order = null;
                }

                if (params.prop !== cacheSort || (params.order && !params.order.startsWith(cacheOrder)) || params.prop === null) {
                    this[handleName]();
                }
            },
            sortTableHistory(params) {
                this.sortTable(params, 'fetchBasicData');
            },
            sortTableVersion(params) {
                this.sortTable(params, 'fetchVersionList');
            },
            openVersionDialog() {
                this.updateDialogVisible = true;
                this.dialogVisible = true;
            },
            sortChange(params) {
                this.sort = Object.keys(params)[0];
                this.order = Object.values(params)[0];
                this.radio === 2 ? this.fetchVersionList() : this.fetchBasicData();
            },
            resetData() {
                this.pageSize = 10;
                this.currentPage = 1;
                this.totalPages = 0;
                this.totalRows = 0;
                this.order = 'desc';
                this.sort = this.radio === 2 ? 'createTime' : 'changeDate';
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const {number, description} = this.ruleForm;
                        createVersion(this.tableId, number, description).then(res => {
                            if (res.data.statusCode === 200) {
                                this.$message({
                                    message: this.$t('content.importExport.a19'),
                                    type: 'success',
                                    showClose: true
                                });
                                this.dialogVisible = false;
                                if (this.radio === 2) {
                                    this.fetchVersionList();
                                } else {
                                    this.fetchBasicData();
                                }
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            handlerRow(type, rowData) {
                let params = {type, rowData};
                if (this.compareItem.size === 0 || type === 'compare') {
                    this.customCompFunc(params);
                }
            },
            customCompFunc(params) {
                this.currentRow = params.rowData;
                if (params.type === 'view') { // do delete operation
                    this.detailsDialogVisible = true;

                    compareV(this.tableId, `${params.rowData.id},${params.rowData.id}`).then(res => {
                        this.versionDetails = res.versions[0];

                        if (!this.isPartitioned) {  //版本详情页面，非hive分区表的都要屏蔽生命周期的字段
                            delete this.versionDetails.lifeDay;
                            delete this.versionDetails.tagColumn;
                            delete this.versionDetails.backupType;
                        }
                    });
                } else if (params.type === 'update') { // do edit operation
                    this.updateDialogVisible = true;
                } else if (params.type === 'delete') { // do edit operation
                    this.deleteDialogVisible = true;
                } else if (params.type === 'compare') {

                    const key = params.rowData.id + '-' + params.rowData.versionName;

                    if (this.compareItem.size === 2) {
                        if (params.rowData.isJoin) {
                            params.rowData.isJoin = !params.rowData.isJoin;
                            this.compareItem.delete(key);
                        } else {
                            this.$message({
                                message: this.$t('content.dataHistory.a15'), //'最多只能对比两个版本',
                                type: 'error'
                            });
                        }
                    } else {

                        params.rowData.isJoin = !params.rowData.isJoin;

                        if (params.rowData.isJoin) {
                            this.compareItem.add(key);
                        } else {
                            this.compareItem.delete(key);
                        }
                    }
                    Bus.$emit('hidden.btn', this.compareItem.size);
                    this.compareItem = new Set([...this.compareItem]);  //触发视图更新
                }

            },
            openVersion() {
                const ids = this.ids.map(val => val.substring(0, val.indexOf('-')));

                this.compareDialogVisible = true;
                this.dialogCompareLoading = true;
                compareV(this.tableId, ids.length === 2 ? ids.join(',') : ids.toString() + ',0').then(res => {
                    this.compareInfo = res;
                    this.dialogCompareLoading = false;
                });
            },
            updateVersion() {
                const {tableId, currentRow} = this;
                this.btnLoading = true;
                returnVersion(tableId, currentRow.id).then(res => {
                    this.btnLoading = false;
                    this.$message({
                        message: this.$t('content.dataHistory.a16'), //'更新成功',
                        type: 'success'
                    });
                    this.updateDialogVisible = false;
                    Bus.$emit('fetch-common');
                }).catch(error => {
                    this.btnLoading = false;
                    this.$message({
                        message: this.$t('content.dataHistory.a17'), //'更新失败,请重试',
                        type: 'error'
                    });
                });
            },
            deleteHandlerVersion() {
                const {tableId, currentRow} = this;
                this.btnLoading = true;
                deleteVersion(tableId, currentRow.id).then(res => {
                    this.btnLoading = false;
                    this.$message({
                        message: this.$t('content.dataHistory.a18'), //'删除成功',
                        type: 'success'
                    });
                    this.deleteDialogVisible = false;
                    this.fetchVersionList();
                }).catch(error => {
                    this.btnLoading = false;
                    this.$message({
                        message: this.$t('content.dataHistory.a17'), //'更新失败,请重试',
                        type: 'error'
                    });
                });
            },
            fetchVersionList() {
                let {tableId, keyword, order, sort, pageSize, currentPage, totalPages, totalRows} = this;
                this.loading = true;
                if (this.order === null) {
                    sort = 'createTime';
                    order = 'desc';
                }
                getVersion(tableId, keyword, sort, order, currentPage, pageSize).then(res => {
                    this.loading = false;

                    res.records.forEach(obj => {
                        obj.isJoin = this.compareItem.has(obj.id + '-' + obj.versionName);
                    });
                    this.tableVersionData = res.records;
                    this.totalRows = res.totalRows;
                    this.totalPages = res.totalPages;
                    this.pageSize = res.pageSize;
                    this.currentPage = res.currentPage;
                });
            },
            fetchBasicData() {
                const {currentVersion, tableId, order, sort, pageSize, currentPage, totalPages, totalRows} = this;

                let param = {
                    id: tableId,
                    page: currentPage,
                    rows: pageSize,
                    order,
                    sort: 'changeDate'
                };

                currentVersion.id && (param.versionId = currentVersion.id);

                this.loading = true;

                changeHistory(param).then(res => {
                    this.loading = false;
                    res.records.forEach((obj, key) => {
                        let {changeType, field, newValue, oldValue} = obj;
                        const cacheField = field;
                        let change = '';

                        if (changeType === 'base') {
                            change += `${this.$t('content.dataset.datasetDetail.jbxx')}:`;
                            field = this.fieldMap(field);
                        } else if (changeType === 'extend') {
                            change += `${this.$t('content.dataset.businessDetail.zdyzdxx')}:`; //'自定义字段:';
                        } else if (changeType === 'field') {
                            change += `${this.$t('content.dataset.datasetDetail.sjjg')}:`; //'数据结构:';
                        } else if (changeType === 'field_desc') {
                            change += `${this.$t('content.dataset.datasetDetail.zdms')}:`; //'字段描述:';
                        } else if (changeType === 'lifecycle') {
                            change += `${this.$t('content.dataset.datasetDetail.smzq')}:`; //'生命周期:';
                            field = this.fieldMap(field);
                        } else if (changeType === 'field_sensitive') {
                            change += `${this.$t('content.dataStructure.mgjb')}:`; //敏感类别;
                        }

                        if (changeType === 'lifecycle' && cacheField === 'lifeDay') {
                            change += ` ${field} ${this.$t('content.dataHistory.a20')} "${this.lifeDayMap(oldValue)}" ${this.$t('content.dataHistory.a19')} "${this.lifeDayMap(newValue)}"`;
                        } else if (changeType === 'lifecycle' && cacheField === 'backupType') {
                            change += ` ${field} ${this.$t('content.dataHistory.a20')} "${this.backupTypeMap(oldValue)}" ${this.$t('content.dataHistory.a19')} "${this.backupTypeMap(newValue)}"`;
                        } else {
                            change += ` ${field} ${this.$t('content.dataHistory.a20')} "${oldValue || '--'}" ${this.$t('content.dataHistory.a19')} "${newValue || '--'}"`;
                        }
                        obj.desc = change;
                        return obj;
                    });
                    this.tableHistoryData = res.records;
                    this.totalRows = res.totalRows;
                    this.totalPages = res.totalPages;
                    this.pageSize = res.pageSize;
                    this.currentPage = res.currentPage;
                }).catch(res => {
                    this.loading = false;
                    this.tableHistoryData = [];
                });
            },
            backupTypeMap(dateStr) {
                if (dateStr === null || dateStr === '') {
                    return '';
                } else if (dateStr === '1') {
                    return this.$t('content.common.sc');
                } else {
                    const map = {
                        D: this.$t('content.common.tian'), //'天',
                        M: this.$t('content.common.yue'), //'月',
                        Y: this.$t('content.common.nian'), //'年',
                        F: this.$t('content.common.yongj') //'永久'
                    };
                    const dateArray = dateStr.split('_');
                    return `${this.$t('content.dataHistory.a21')} ${dateArray[2] === 'F' ? '' : dateArray[1]}${map[dateArray[2]]}`;
                }
            },
            lifeDayMap(dateStr) {
                if (dateStr === null || dateStr === '') {
                    return '';
                } else {
                    const map = {
                        D: this.$t('content.common.tian'), //'天',
                        M: this.$t('content.common.yue'), //'月',
                        Y: this.$t('content.common.nian') //'年',
                    };
                    const dateArray = dateStr.split('_');
                    return `${dateArray[0]}${map[dateArray[1]]}`;
                }
            },

            fieldMap(field) {
                switch (field) {
                    case 'owner':
                        field = this.$t('content.dataset.datasetDetail.sjfzr');
                        break;
                    case 'businessName':
                        field = this.$t('content.dataset.businessDetail.biem');
                        break;
                    case 'description':
                        field = this.$t('content.dataset.datasetDetail.sjms');
                        break;
                    case 'source':
                        field = this.$t('content.dataset.datasetDetail.sjly');
                        break;
                    case 'generateMethod':
                        field = this.$t('content.dataset.datasetDetail.scff');
                        break;
                    case 'updateInterval':
                        field = this.$t('content.dataset.datasetDetail.gxzq');
                        break;
                    case 'bizMeaning':
                        field = this.$t('content.dataset.datasetDetail.ywyy');
                        break;
                    case 'sourceCategory':
                        field = this.$t('content.dataset.datasetDetail.xyxt');
                        break;
                    case 'sensitiveCategory':
                        field = this.$t('content.dataset.datasetDetail.mglb');
                        break;
                    case 'sourceSystem':
                        field = this.$t('content.dataset.datasetDetail.lybgnmk');
                        break;
                    case 'lifeDay':
                        field = this.$t('content.dataset.datasetDetail.a13'); //  '存储周期';
                        break;
                    case 'tagColumn':
                        field = this.$t('content.dataset.datasetDetail.a14'); //'分区列';
                        break;
                    case 'backupType':
                        field = this.$t('content.dataset.datasetDetail.a15'); //'备份周期';
                        break;
                }
                return field;
            },
            handleChange(val) {
                this.currentPage = val;
                this.radio === 2 ? this.fetchVersionList() : this.fetchBasicData();
            },
            handleClose(tag) {
                this.tableVersionData.forEach(obj => {
                    const currentTag = obj.id + '-' + obj.versionName;
                    if (currentTag === tag) {
                        obj.isJoin = false;
                    } else {
                        obj.isJoin = this.compareItem.has(obj.id + '-' + obj.versionName);
                    }
                });
                this.tableVersionData = this.tableVersionData.slice();
                this.compareItem.delete(tag);
                Bus.$emit('hidden.btn', this.compareItem.size);
                this.compareItem = new Set([...this.compareItem]);  //触发视图更新
            },
            handleSearch({key = '', currentPage = 1} = {}) {
                this.keyword = key;
                this.currentPage = 1;
                this.fetchVersionList();
            }
        }
    };
</script>
<style lang="less">
    .data-history {
        .table {
            table-layout: fixed !important;
        }
        .table-search {
            float: right;
        }
        .v-table-loading {
            z-index: 9;
        }
        .handle-icon {
            i {
                margin-left: 0;
                margin-right: 15px;
                font-size: 16px;
                cursor: pointer;
                &.disabled {
                    opacity: .6;
                    cursor: not-allowed;
                }
            }
        }
        .addParam {
            color: #6DC18A;
        }
        .delParam {
            color: red;
        }
        .modifyParam {
            color: #6690C6;
        }
        .versions {
            height: 31px;
        }
        .dropdown-version,
        .select-version {
            width: 120px;
        }
        .input-with-select {
            margin-top: 1px;
            width: 200px;
            vertical-align: middle;
        }
        .el-tag {
            float: left;
            margin-right: 20px;
            .el-icon-close {
                margin-left: 20px;
            }
        }
        .el-button--text {
            float: left;
            text-decoration: underline;
        }
        .el-pagination {
            float: right;
        }
        .body-wrapper {
            min-height: 200px;
            .table-wrapper {
                overflow: auto;
                height: 300px;
                .commom-overflow {
                    width: 100%;
                }
            }
        }
        .dialogWrapper {
            .el-form-item {
                margin-bottom: 25px;
            }
        }
        .table-column-2 {
            margin-bottom: 0;
            tbody {
                tr {
                    td {
                        width: 50%;
                    }
                }
            }
        }
    }

</style>
