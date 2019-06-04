<template>
    <!--元信息待维护-->
    <div class="meta-maintain">
        <el-table
                :data="records"
                border
                :default-sort="{prop: 'datasetName', order: 'ascending'}"
                @sort-change="sortTable">
            <el-table-column
                    prop="datasetName"
                    :label="$t('content.dataset.businessDetail.biaom')"
                    sortable="custom">
                <template slot-scope="scope">
                    <template v-if="scope.row.datasetType === 'Hdfs' ">
                        <div><a class="dataset-name" v-html="emphasizeName(scope.row.datasetName,key)"
                                :href="`#/Main/Files?id=${scope.row.id}`"></a></div>
                        <span class="name">{{scope.row.rate ? scope.row.rate : 0}}%</span>
                    </template>
                    <template v-else>
                        <item-jump
                                :params="{
                                params:{
                                    path:scope.row.path,
                                    level:3,
                                    rate:scope.row.rate?scope.row.rate:'0'
                                },
                                isfolder: false
                            }"
                                :name="emphasizeName(scope.row.datasetName,key)"
                                :view="false"
                                :datasetId="scope.row.id"
                        >
                        </item-jump>
                    </template>
                </template>
            </el-table-column>
            <el-table-column
                    prop="path"
                    sortable="custom"
                    :label="$t('content.dataset.datasetDetail.wllj')"></el-table-column>
            <el-table-column
                    prop="datasourceName"
                    sortable="custom"
                    :label="$t('content.dataset.datasetDetail.sjlx')">
            </el-table-column>
            <el-table-column
                    prop="projectName"
                    sortable="custom"
                    :label="$t('content.dataset.datasetDetail.scxm')">
            </el-table-column>
            <el-table-column
                    sortable="custom"
                    prop="createdTime"
                    :label="$t('content.dataset.datasetDetail.cjsj')"
                    :formatter="_formatTime">
            </el-table-column>
            <el-table-column
                    prop="size"
                    :label="$t('content.dataset.datasetDetail.ccdx')"
                    :formatter="_formatSize">
            </el-table-column>
            <el-table-column
                    prop="owner"
                    :label="$t('content.dataset.datasetDetail.sjfzr')">
            </el-table-column>
            <el-table-column
                    prop="datasetName"
                    :label="$t('content.dataset.datasetDetail.cz')">
                <template slot-scope="scope">
                    <div class="owner-operator">
                        <el-tooltip
                                effect="dark"
                                :content="$t('content.personal.whysj')"
                                placement="top">
                            <span @click="showMetaInfo(scope.row.id, scope.row.datasetName, scope.row)">
                                <i class="iconfont icon-weihu icon-s"></i>
                            </span>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>


        </el-table>
        <div class="tablePages">
            <el-pagination background
                           layout="total, prev, pager, next"
                           @current-change="handleCurrentChange"
                           :current-page="currentPage"
                           :page-size="10"
                           :total="totalRows">
            </el-pagination>
        </div>
        <el-dialog
                :title="$t('content.personal.bjyxx')"
                :visible.sync="dialogVisible"
                custom-class="edit-meta-info"
                :close-on-click-modal="false">
            <div class="save-loading" v-if="savingLoading">
                <p>{{$t('content.personal.zzbc')}}...</p>
            </div>
            <h4 class="meta-info-title">
                {{$t('content.personal.dywyxx', [datasetName])}}
            </h4>
            <div style="min-height: 250px; background: #FFF;">
                <table class="table table-bordered tableList">
                    <thead>
                    <tr>
                        <th width="178">{{$t('content.dataset.datasetDetail.mc')}}</th>
                        <th>{{$t('content.dataset.datasetDetail.sx')}}</th>
                    </tr>
                    </thead>
                    <tbody v-if="!propertieLoading">
                    <tr>
                        <td>{{$t('content.dataset.businessDetail.biem')}}</td>
                        <td>
                            <el-input
                                    maxlength=50
                                    @blur="validateForm('businessName', properties.businessName)"
                                    v-model="properties.businessName"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>{{$t('content.dataset.datasetDetail.sjms')}}</td>
                        <td>
                            <el-input
                                    maxlength=200
                                    @blur="validateForm('description', properties.description)"
                                    v-model="properties.description"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>{{$t('content.dataset.datasetDetail.ywyy')}}</td>
                        <td>
                            <el-input
                                    maxlength=200
                                    @blur="validateForm('bizMeaning',properties.bizMeaning)"
                                    v-model="properties.bizMeaning"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>{{$t('content.dataset.datasetDetail.sjfzr')}}</td>
                        <td>
                            <el-select
                                    class="owner-select"
                                    v-model="owner"
                                    filterable
                                    remote
                                    :placeholder="$t('content.personal.qsrgjc')"
                                    :remote-method="searchUserList"
                                    :loading="loading">
                                <el-option
                                        v-for="item in userList"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr>
                        <td>{{$t('content.dataset.datasetDetail.mglb')}}<!--敏感类别--></td>
                        <td>
                            <el-cascader ref="cascader"
                                         v-if="currentRow.datasetType === 'Hdfs'"
                                         expand-trigger="hover"
                                         :options="sensitiveOptions"
                                         @active-item-change="clickSelectDep"
                                         v-model="selected">
                            </el-cascader>
                            <span v-else>{{properties.sensitiveCategory}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td>{{$t('content.dataset.datasetDetail.sjly')}}</td>
                        <td>
                            <el-input
                                    maxlength=50
                                    @blur="validateForm('source', properties.source)"
                                    v-model="properties.source"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>{{$t('content.dataset.datasetDetail.xyxt')}}</td>
                        <td>
                            <el-input
                                    maxlength=50
                                    @blur="validateForm('sourceCategory', properties.sourceCategory)"
                                    v-model="properties.sourceCategory"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>{{$t('content.dataset.datasetDetail.lybgnmk')}}</td>
                        <td>
                            <el-input
                                    maxlength=50
                                    @blur="validateForm('sourceSystem',properties.sourceSystem)"
                                    v-model="properties.sourceSystem"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>{{$t('content.dataset.datasetDetail.gxzq')}}</td>
                        <td>
                            <el-input
                                    maxlength=50
                                    @blur="validateForm('updateInterval', properties.updateInterval)"
                                    v-model="properties.updateInterval"></el-input>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <loading :isloading="propertieLoading"></loading>
            </div>
            <template v-if="currentRow.datasetType !== 'Hdfs'">
                <h4>{{$t('content.personal.dzdxx', [ datasetName ])}} </h4>
                <div>
                    <table class="table table-bordered tableList">
                        <thead>
                        <tr>
                            <th>{{$t('content.dataset.datasetDetail.zid')}}</th>
                            <th>{{$t('content.dataset.datasetDetail.sjlx')}}</th>
                            <th>{{$t('content.dataset.datasetDetail.zdms')}}</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(data, index) in commentList">
                            <td>
                                <div v-ellipsis="data.fieldName"></div>
                            </td>
                            <td>{{data.dataType}}</td>
                            <td>
                                <el-input
                                        @blur="validateForm('field',commentTable[index].comment)"
                                        v-model='commentTable[index].comment'></el-input>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <loading :isloading="schemaLoading"></loading>
                </div>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button :disabled="savingLoading" @click="dialogVisible = false">{{$t('content.common.qx')}}
                </el-button>
                <el-button :disabled="savingLoading" type="primary" @click="confirmDialog">{{$t('content.common.qd')}}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import Bus from 'utils/bus';
    import PropertyItem from '../Dataset/DatasetDetail/PropertyItem';
    import {
        FormatTime,
        FormatSize,
        Message,
        FormatLifeDay,
        _FormatTime,
        _FormatSize,
        SortTable,
        EmphasizeName
    } from 'mixins/common';
    import {clickCount} from 'utils';
    import ItemJump from 'common/ItemJump';
    import {getSensitiveList} from '@/service/getData';

    export default {
        name: 'PersonalMetaMaintain',
        mixins: [FormatTime, FormatSize, Message, FormatLifeDay, _FormatTime, _FormatSize, SortTable, EmphasizeName],
        data() {
            return {
                tableHeader: [
                    {name: this.$t('content.dataset.datasetDetail.bm'), hasSort: true, type: 'datasetName'},
                    {name: this.$t('content.dataset.datasetDetail.sjlx'), hasSort: true, type: 'datasourceName'},
                    {name: this.$t('content.dataset.datasetDetail.scxm'), hasSort: false},
                    {name: this.$t('content.dataset.datasetDetail.cjsj'), hasSort: true, type: "createdTime"},
                    {name: this.$t('content.dataset.datasetDetail.ccdx'), hasSort: false},
                    {name: this.$t('content.dataset.datasetDetail.sjfzr'), hasSort: false},
                    {name: this.$t('content.dataset.datasetDetail.cz'), hasSort: false}
                ],
                owner: '',
                savingLoading: false,

                dialogVisible: false,
                noDataVisible: false,
                editedItem: '',
                records: [],
                currentPage: 1,
                totalRows: 1,

                tableId: '',
                sensitiveSelect: [
                    [this.$t('content.common.shi'), 'Y'],
                    [this.$t('content.common.fou'), 'N']
                ],
                selected: [],
                sensitiveOptions: [],
                properties: {
                    businessName: '',
                    description: '',
                    bizMeaning: '',
                    sensitiveData: '',
                    sensitiveId: '',    //敏感类别
                    source: '',
                    updateInterval: '',
                    generateMethod: '',
                    sourceCategory: '',
                    sourceSystem: '',
                    extendedField: ''
                },
                propertiesInit: {
                    businessName: '',
                    description: '',
                    bizMeaning: '',
                    sensitiveData: '',
                    sensitiveId: '',
                    source: '',
                    updateInterval: '',
                    generateMethod: '',
                    extendedField: '',
                    sourceCategory: '',
                    sourceSystem: ''
                },
                userList: [],
                propertieLoading: true,
                schemaLoading: true,
                commentList: [],
                commentTable: [],
                datasetName: '',
                sort: "datasetName",
                order: "asc",
                editedLabel: '',
                errors: false,
                loading: false,
                currentRow: {
                    datasetType: null
                }
            };
        },
        components: {
            PropertyItem,
            ItemJump
        },
        created() {
            Bus.$on('setEditLabel', label => {
                this.editedLabel = label;
            });
            Bus.$on('cancelEdit', (value, label) => {
                this.editedLabel = '';
                this[label] = value;
            });

            this.fetchData();
            this.fetchTree();
        },
        watch: {
            '$parent.key'(val) {
                this.fetchData({key: val, currentPage: 1});
            }
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
                        this.sensitiveOptions = message;
                    }
                });
            },
            validateForm(type, value) {
                if (value === null && value === '') {
                    if (type === 'businessName' || type === 'field') {
                        if (value.length >= 50) {
                            this.error = true;
                            this.message(this.$t('content.dataset.datasetDetail.zdsrgzf', [50]), "error");
                            return false;
                        } else if (/\//.test(value)) {
                            // this.message('不能输入"/"', "error")
                            this.error = true;
                            this.message(this.$t('content.dataset.datasetDetail.bnsrxx'), "error");
                        } else {
                            this.error = false;
                            return true;
                        }
                    } else if (type === 'updateInterval') {
                        if (value.length <= 50) {
                            this.error = false;
                            return true;
                        } else {
                            this.message(this.$t('content.dataset.datasetDetail.zdsrgzf', [50]), "error");
                            this.error = true;
                            return false;
                        }
                    } else {
                        if (value.length <= 50) {
                            this.error = false;
                            return true;
                        } else {
                            this.message(this.$t('content.dataset.datasetDetail.zdsrgzf', [50]), "error");
                            this.error = true;
                            return false;
                        }
                    }
                }
            },
            async confirmDialog() {
                if (this.error) {
                    this.message(this.$t('content.personal.qtxzqdxx'), "error");
                } else {
                    await this.submit();
                }
            },

            tableSort({sort, order}) {
                this.sort = sort;
                this.order = order;
                const params = {
                    key: this.key
                };
                this.fetchData(params);
            },
            searchUserList(keyword) {
                if (keyword !== '') {
                    this.loading = true;
                    this.axios.get(`/privilege/getLeapUsers?kw=${encodeURIComponent(keyword)}`)
                        .then((res) => {
                            if (res.status === 200) {
                                this.loading = false;
                                this.userList = res.body.message;
                            }
                        });
                }
            },
            link(queryParams) {
                const path = queryParams.path;
                const datasetId = queryParams.id;
                clickCount(datasetId);
                this.$store.dispatch('fetchRouter', {path, datasetId});

                const name = queryParams.datasetName;
                this.$store.dispatch('saveTableName', name);
                this.$router.push({name: 'Physical'});
                this.$store.dispatch('setBusiness', false);

                this.$store.dispatch('saveNavData', true);
            },
            // 比较属性值是否改变
            compareProperties() {
                let _editedField = [];
                for (let key in this.properties) {
                    if (this.properties[key] !== this.propertiesInit[key]) {
                        _editedField.push(key);
                    }
                }
                return _editedField.join(',');
            },
            submit() {
                this.savingLoading = true;

                let params = this.properties;
                params.field = this.compareProperties();
                //将null转成空字符串
                Object.keys(params).forEach(key => {
                    if (params[key] == null) {
                        params[key] = '';
                    }
                });
                params.privilege = null;    //去掉权限信息
                let cacheData = new Date().valueOf();

                params.sensitiveId = this.selected[this.selected.length === 1 ? 0 : 1];

                if (params.sensitiveId !== this.propertiesInit.sensitiveId) {
                    if (params.field && params.field.length) {
                        params.field += ',sensitiveCategory';
                    } else {
                        params.field = 'sensitiveCategory';
                    }
                }
                this.axios.post(`/datasets/${this.tableId}/commoninfo`, params).then(async res => {
                    let body = res.body;
                    if (body.result && body.statusCode === 200) {
                        await this.submitField();
                        await this.submitOwner();
                        Bus.$emit('fetchOwner', '');

                        this.message(this.$t('content.dataset.importExport.bjcg'), "success");
                        this.dialogVisible = false;
                        let currentPage = this.currentPage;
                        let key = this.$parent.key;
                        this.savingLoading = false;
                        this.fetchData({currentPage, key});
                    } else {
                        this.message(this.$t('content.common.shib'), "error");
                    }
                });
            },

            async submitField() {
                //字段信息保存
                let arr = [];
                this.commentTable.forEach((val, index) => {
                    let singleObj = {
                        "commentId": val.commentId ? val.commentId : 0,
                        "fieldId": this.commentList[index].id,
                        "text": val.comment
                    };
                    arr.push(singleObj);
                });

                const fieldData = JSON.stringify(arr);

                const fieldPromise = await this.axios.post(`/datasets/${this.tableId}/columns/comments`, {fieldData});
                if (fieldPromise.body.statusCode === 200) {

                } else {
                    this.message(this.$t('content.common.shib'), 'error');
                }
            },

            async submitOwner() {
                let url = `privilege/${this.tableId}/updateDatesetOwner?userName=${this.owner === null ? '' : this.owner}`;
                const res = await this.axios.get(url);
                if (res.body.statusCode != 200) {
                    this.message(this.$t('content.personal.ywfzrbjsb'), 'error');
                }
            },

            async fetchData({currentPage = 1, key = ''} = {}) {
                Bus.$emit('loadingVisible', true);
                let _url = '';
                this.key = key;
                if (this.sort) {
                    _url = `/datasets/ownedDatasetWithoutCommonInfo?rows=10&page=${currentPage}&keyword=${escape(key)}&sort=${this.sort}&order=${this.order}`;
                } else {
                    _url = `/datasets/ownedDatasetWithoutCommonInfo?rows=10&page=${currentPage}&keyword=${escape(key)}&sort=datasetName&order=asc`;
                }

                const res = await this.axios.get(_url);
                if (res.body.statusCode == 200) {
                    Bus.$emit('maintainCount', res.body.message.totalRows);
                    Bus.$emit('fetchCountList', '');
                    Object.assign(this.$data, res.body.message);
                }
                Bus.$emit('loadingVisible', false);
            },
            showMetaInfo(id, datasetName, row) {
                console.log('row', row);
                this.currentRow = row;
                const vm = this;
                this.clearFormValue();
                this.propertieLoading = true;
                this.schemaLoading = true;
                this.datasetName = datasetName;

                this.tableId = id;
                this.dialogVisible = true;
                this.axios.get(`/datasets/${id}/columns?page=1&rows=99999`).then(res => {
                    this.schemaLoading = false;
                    if (res.body.statusCode === 200) {
                        this.commentList = res.body.message.records;
                        this.commentList.forEach((val, index) => {
                            vm.$set(vm.commentTable, index, {
                                comment: val.comment ? val.comment : '',
                                commentId: val.commentId
                            });
                        });
                    }
                });
                this.axios.get(`/datasets/${id}/commoninfo`).then(res => {
                    this.propertieLoading = false;
                    if (res.body.statusCode === 200) {
                        const data = res.body.message.datasetCommonInfo;
                        this.owner = data.owner;
                        delete data.owner;
                        const index = data.parentSensitiveId;
                        const index2 = data.sensitiveId;
                        this.selected = index ? [index, index2] : [index2];
                        Object.assign(this.properties, data);
                        Object.assign(this.propertiesInit, data);
                    }
                });
            },
            clearFormValue() {
                for (const key in this.properties) {
                    this.properties[key] = '';
                }
                this.commentList = [];
                this.commentTable = [];
            },
            handleCurrentChange(val) {
                const params = {
                    currentPage: val,
                    key: this.key
                };
                this.fetchData(params);
            }
        }
    };
</script>
<style lang="less">
    .meta-maintain {
        .cell {
            position: relative;
            .dataset-name {
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-right: 40px;
                width: calc(~ '100% - 30px');
            }
            .name {
                position: absolute;
                top: 0;
                right: 10px;
                width: auto;
                color: orange;
            }
        }
        .owner-select {
            width: 178px;
        }
        .table {
            td > span {
                padding-left: 16px;
            }
            .el-cascader {
                width: 178px;
                padding-left: 0;
            }
        }
    }
    .edit-meta-info {
        width: 930px;
        .el-input__inner {
            padding-right: 15px;
            border: 1px solid #FFF;
        }
        .el-cascader,
        .el-select {
            .el-input__inner {
                border: 1px solid #BFCBD9;
            }
        }
        .el-input__inner:hover {
            border: 1px solid #BFCBD9;
        }
        .el-dialog__body {
            padding: 10px 30px !important;
        }
        .el-select__caret {
            visibility: none;
        }
        h4 {
            font-size: 14px;
            margin-bottom: 10px;
            color: #999;
        }
        table {
            margin-bottom: 15px;
        }
    }
    .dataset-complete {
        display: flex;
        justify-content: space-between;
        .maintain-datasetName {
            display: inline-block;
        }
        i {
            line-height: 24px;
            font-style: normal;
            color: #FEB155;
        }
    }
    .maintain-pagenation {
        display: flex;
        justify-content: space-between;
        margin-top: 15px;
        .tablePages {
            margin: 0;
        }
        .maintain-page-total {
            color: #999;
            line-height: 30px;
        }
    }
    .meta-info-title {
        display: flex;
    }
    .save-loading {
        z-index: 1000;
        position: absolute;
        background: #333;
        opacity: 0.3;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        p {
            text-align: center;
            color: #FFF;
            opacity: 1;
            line-height: 40px;
        }
    }
</style>

