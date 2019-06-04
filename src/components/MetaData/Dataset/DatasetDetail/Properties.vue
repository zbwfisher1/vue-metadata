<!--suppress ALL -->
<template>
    <div class="properties" id="attribute-info">
        <!-- 基本信息 -->
        <div class="properties-container">
            <dl class="base-info-table" v-loading="loadingVisible">
                <dt>{{$t('content.dataset.businessDetail.biaom')}}</dt> <!--实体名-->
                <dd><span class="text-aligin">{{tableName}}</span></dd>
                <dt>{{$t('content.dataset.datasetDetail.bstzt')}}</dt> <!--实体状态-->
                <dd>
                    <span class="font-w" :class="{green: status === 0, red: status === 1, khaki: status === 2}">
                        {{$t(`content.dataset.datasetDetail.${status === 0 ? 'zhengc' : status === 1 ? 'ysc' : 'weiz'}`)}}
                    </span>
                </dd>

                <dt>{{$t('content.dataset.businessDetail.biem')}}<!--业务名称--></dt>
                <dd>
                    <property-item
                            :isDIV="true"
                            :value="businessName"
                            itemName="businessName"
                            :parentLabel="editedLabel"
                            :placeholder="$t('content.dataset.datasetDetail.qsrgbdbm')"
                            @emitDoneEdit="doneEdit"></property-item>
                </dd>
                <dt>{{$t('content.dataset.datasetDetail.sjms')}}<!--数据简介--></dt>
                <dd>
                    <property-item
                            :isDIV="true"
                            :maxlength="textFieldLength.large"
                            :value="description"
                            itemName="description"
                            :parentLabel="editedLabel"
                            :placeholder="$t('content.dataset.datasetDetail.nrjytdmsxx')"
                            @emitDoneEdit="doneEdit"
                    ></property-item>
                </dd>
                <dt>{{$t('content.dataset.businessDetail.mss')}}</dt>   <!--描述-->
                <dd>
                            <span class="view-btn" @click="openTextEdit">
                                {{$t(`content.dataset.businessDetail.${propEditPrivilege ? `dj${hasDetailContent ? 'ck' : 'bj'}` : 'djck'}`)}}
                            </span>
                    <text-dialog :dialogVisible.sync="textDialog"
                                 v-on:update:hasValue="hasDetailContent = $event"
                                 :id="tableId"
                                 v-if="tableId"></text-dialog>
                </dd>
                <dt>{{$t('content.dataset.datasetDetail.ywyy')}}<!--业务意义--></dt>
                <dd>
                    <property-item
                            :isDIV="true"
                            :maxlength="textFieldLength.large"
                            :value="bizMeaning"
                            itemName="bizMeaning"
                            :parentLabel="editedLabel"
                            :placeholder="$t('content.dataset.datasetDetail.sjsrgbdywhy')"
                            @emitDoneEdit="doneEdit"></property-item>
                </dd>
                <dt>{{$t('content.dataset.datasetDetail.sjfzr')}}<!--业务负责人--></dt>
                <dd>
                    <property-item
                            :isDIV="true"
                            v-if="propEditPrivilege"
                            :value="owner"
                            itemName="owner"
                            :parentLabel="editedLabel"
                            :placeholder="$t('content.personal.qsrgjc')"
                            :isSelect="true"
                            :isRemote="true"
                            :selectList="userList"
                            @remote="searchUserList"
                            @change="saveOwner"
                            @emitDoneEdit="doneEdit"/>
                    <div v-else><span class="text-aligin">{{owner}}</span></div>
                </dd>
                <dt>{{$t('content.dataset.datasetDetail.ztlj')}}<!--所属主题路径--></dt>
                <dd :title="topicList.join(';')">
                    <label v-ellipsis="topicList.join(';')"></label>
                </dd>
                <dt>{{$t('content.dataset.datasetDetail.sjly')}}<!--数据来源--></dt>
                <dd>
                    <property-item :isDIV="true"
                                   :value="source"
                                   itemName="source"
                                   :parentLabel="editedLabel"
                                   :placeholder="$t('content.dataset.datasetDetail.sjsrsjly')"
                                   @emitDoneEdit="doneEdit"
                    ></property-item>
                </dd>
                <dt>{{$t('content.dataset.datasetDetail.xyxt')}}<!--下游系统--></dt>
                <dd>
                    <property-item :isDIV="true"
                                   :value="sourceCategory"
                                   itemName="sourceCategory"
                                   :parentLabel="editedLabel"
                                   :placeholder="$t('content.dataset.datasetDetail.sjsrxyxt')"
                                   @emitDoneEdit="doneEdit"
                    ></property-item>
                </dd>
                <dt>{{$t('content.dataset.datasetDetail.lybgnmk')}}<!--来源表/功能模块--></dt>
                <dd>
                    <property-item :isDIV="true"
                                   :value="sourceSystem"
                                   itemName="sourceSystem"
                                   :parentLabel="editedLabel"
                                   :placeholder="$t('content.dataset.datasetDetail.sjsrlybgnmk')"
                                   @emitDoneEdit="doneEdit"
                    ></property-item>
                </dd>
                <dt>{{$t('content.dataset.datasetDetail.gxzq')}}<!--数据更新频率--></dt>
                <dd>
                    <property-item :isDIV="true"
                                   :value="updateInterval"
                                   itemName="updateInterval"
                                   :parentLabel="editedLabel"
                                   :placeholder="$t('content.dataset.datasetDetail.qxzgxzq')"
                                   @emitDoneEdit="doneEdit"
                    ></property-item>
                </dd>
                <template v-if="hasApplyAuthority && status == 0 && storage.datasourceType !== 'HDFS'">
                    <dt>{{$t('content.dataset.datasetDetail.wdqx')}}</dt> <!--权限状态-->
                    <dd>
                        <div class="propertiesContent">
                            <div class="propertiew-authority">
                                <span :class="{properiesReadable: isReadable}">{{$t('content.authority.r')}}</span>
                                <span :class="{propperiesWritable: isWritable}">{{$t('content.authority.w')}}</span>
                            </div>
                        </div>
                    </dd>
                </template>
                <dt>{{$t('content.dataStructure.mgjb')}}<!--敏感类别--></dt>
                <dd class="cascader-wrap">
                    <template v-if="propEditPrivilege && storage.datasourceType === 'HDFS'">
                        <el-cascader ref="cascader"
                                     :options="sensitiveOptions"
                                     expand-trigger="hover"
                                     @active-item-change="clickSelectDep"
                                     @visible-change="selectVisibleChange"
                                     v-model="selected">
                        </el-cascader>
                    </template>
                    <span v-else>{{sensitiveCategory}}</span>
                </dd>
                <template v-if="userInfo['hive.encrypt'] && storage.datasourceType === 'HIVE' && hasApplyAuthority">
                    <dt>{{$t('content.dataset.datasetDetail.sfjm')}}<!--是否加密--></dt>
                    <dd>
                        <span>{{$t(fieldsKeyText)}}</span>
                    </dd>
                </template>
            </dl>
        </div>
        <template v-if="showMoreInfo">
            <!-- 业务维护信息 -->
            <div class="maintain-info">
                <div class="tableMulti" v-if="bizFields.length" :loading="loadingVisible">
                    <div class="table-title">
                        <div class="table-title__text">
                            <span>{{$t('content.dataset.datasetDetail.lyxx')}}</span>
                        </div>
                    </div>
                    <dl class="base-info-table"
                        :class="{'table-odd': this.bizFields.lenght === 1}"
                        v-loading="loadingVisible">
                        <template v-for="(field,key) in this.bizFields">
                            <dt :title="field.fieldName">{{field.fieldName}}</dt>
                            <dd>
                                <property-item :value="field.fieldValue" :itemName="field.fieldName + '-bizFields'"
                                               :parentLabel="editedLabel"
                                               :placeholder="$t('content.dataset.businessDetail.qsrzdysx')"
                                               @emitDoneEdit="fieldsDoneEdit"/>
                            </dd>
                        </template>
                    </dl>
                </div>
            </div>

            <!-- 存储信息 -->
            <storage v-show="!loadingVisible && status !== 2"
                     :tableId="tableId"
                     :storageData="storage"
                     :loading="loadingVisible"
                     :lastUpdate="formatTime(lastUpdate * 1000)"
                     :lastStructurUpdate="formatTime(lastStructurUpdate * 1000)">
            </storage>
        </template>
        <div class="data-toggle" :class="{'off': !showMoreInfo}" @click="showMoreInfo = !showMoreInfo">

        </div>
    </div>
</template>
<script>
    import {
        FormatTime,
        FormatSize,
        Message,
        testPrivilege,
        SelectRender
    } from 'mixins/common';
    import TextDialog from './Dialog/TextDialog';
    import Bus from 'utils/bus';
    import Storage from './Storage';
    import PropertyItem from './PropertyItem';
    import {mapState} from 'vuex';
    import {httpRequest} from 'utils';
    import {updateBizField, getSensitiveList} from '@/service/getData';
    import E from 'wangeditor';

    export default {
        mixins: [FormatTime, FormatSize, Message, testPrivilege, SelectRender],
        name: "properties",
        props: {
            tableId: {
                require: true,
                default: 0
            }
        },
        components: {
            Storage,//存储信息
            PropertyItem,
            TextDialog
        },
        computed: {
            //字段加密字段文字描述
            fieldsKeyText() {
                if (this.fieldsEncryption === 'any') {
                    return 'content.dataset.datasetDetail.zdjm';      //'字段加密';
                } else if (this.fieldsEncryption === 'all') {
                    return 'content.dataset.datasetDetail.zbjm';    //'整表加密';
                } else {
                    return 'content.dataset.datasetDetail.wjm';    //'未加密'
                }
            },
            //是否展示‘敏感类别’字段
            isShowSensitiveCategory() {
                return this.sensitiveData === 'Y';
            },
            computedLimitDate() {
                let newDateArr = this.dataLimite;
                if (!newDateArr)
                    return;
                newDateArr = newDateArr.split(':');
                const startDate = newDateArr[0] * 1;
                const endDate = newDateArr[1] * 1;
                const newDateLimit = `${this.formatTime(startDate * 1000)}--${this.formatTime(endDate * 1000)}`;
                return newDateLimit;
            },
            ...mapState({
                dataStatus: 'dataStatus',
                propEditPrivilege: 'propEditPrivilege',
                userInfo: 'userInfo'
            })
        },
        data() {
            return {
                showMoreInfo: false,
                userList: [],
                hasErrors: false,
                editedLabel: '',
                businessName: '',
                description: '',
                source: '',
                tableName: '',
                generateMethod: '',
                updateInterval: '',  //数据更新频率
                topicList: [], //主题路径属性
                owner: "",  //数据负责人属性
                // OwnerOption: [],
                isReadable: false,
                isWritable: false,
                lastUpdate: '--',
                lastStructurUpdate: '--',
                dataLimite: '',
                loadingVisible: true,
                dialogFormVisible: false,
                storage: {extendedField: ''},
                bizMeaning: '', //业务意义
                sensitiveData: '', //敏感数据
                sensitiveCategory: '',
                sourceCategory: '', //数据来源类型
                sourceSystem: '', //数据来源系统
                fieldsEncryption: '',     // any:字段加密,  all:整表加密    空或null:未加密
                projectId: '',
                getSample: false,
                sensitiveSelect: [
                    ['content.common.shi', 'Y'],
                    ['content.common.fou', 'N']
                ],
                sensitiveCategorySelect: [
                    ['content.common.p', 'PII'],
                    ['content.common.l', 'LRI']
                ],
                options: [
                    [this.$t('content.common.ant'), 'day'],
                    [this.$t('content.common.anz'), 'week'],
                    [this.$t('content.common.any'), 'month'],
                    [this.$t('content.common.anj'), 'quarter'],
                    [this.$t('content.common.ann'), 'year']
                ],
                extendFieldLang: {},
                status: 0,
                extendedField: {},
                hasApplyAuthority: true,
                loading: false,
                textDialog: false,
                bizFields: {},
                hasDetailContent: false,   //双向绑定,子组件可以修改这个值
                sensitiveOptions: [],
                selected: [],
                cachedSelected: []
            };
        },
        created() {
            Bus.$on('setEditLabel', label => {
                this.editedLabel = label;
            });
            Bus.$on('cancelEdit', (value, label) => {
                this.editedLabel = null;
                this[label] = value;
            });
            setTimeout(() => {   //暂时先延时,避免 tableId 不同时,请求两次不同 tableId 的情况,导致数据出错
                this.getAllData();
                this.fetchTree();
            }, 200);
            Bus.$on('fetch-common', () => {
                this.getAllData();
            });
        },
        destroyed() {
            Bus.$off('fetch-common');
        },
        watch: {
            tableId: function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    this.loadingVisible = true;
                    this.editedLabel = null;
                    this.isReadable = false;
                    this.isWritable = false;
                    this.getAllData(newValue);
                    Bus.$emit('scrollTop');
                    this.showMoreInfo = false;
                }
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
            selectVisibleChange(val) {
                this.editedLabel = null;
                const selected = this.selected[this.selected.length - 1];
                if (this.cachedSelected !== selected) {
                    this.submit('sensitiveCategory');
                    this.$nextTick(() => {
                        if (this.storage.datasourceType === 'HDFS') {
                            const ele = this.$refs.cascader && this.$refs.cascader.$el &&
                                this.$refs.cascader.$el.querySelectorAll('.el-input__inner');
                            this.sensitiveCategory = ele && ele.length && ele[0].value;   //重新赋值
                        }
                    });
                }
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
            openTextEdit() {
                this.textDialog = true;
            },
            async saveOwner() {
                if (this.owner == null) {
                    this.owner = '';
                }
                let url = `privilege/${this.tableId}/updateDatesetOwner?userName=${this.owner}`;
                const res = await this.axios.get(url);
                if (res.body.statusCode !== 200) {
                    this.message(this.$t('content.personal.ywfzrbjsb'), 'error');
                }
                this.getAllData();
                //修改完成之后,再判断用户是否还有权限再修改
                await this.testPrivilege(`/privilege/getAuthorizedAccounts`, 'get', `datasetId=${this.tableId}`);
                this.$store.dispatch('propEditPrivilege', this.hasPrivilege);
            },
            searchUserList(keyword) {
                if (keyword !== '') {
                    this.loading = true;
                    this.axios.get(`/privilege/getLeapUsers?kw=${encodeURIComponent(keyword)}`).then((res) => {
                        if (res.status == 200) {
                            this.loading = false;
                            this.userList = res.body.message;
                        }
                    });
                }
            },
            doneEdit(params) {
                const vm = this;
                const label = params.editedLabel;
                this.editedLabel = label;
                vm[label] = params.value;
                if (!vm[label]) {
                    vm[label] = '';
                }
                vm[label] = vm[label].trim();
                if (vm.validator(label, this[label])) {
                    vm.editedLabel = null;
                    this.hasErrors = false;
                    if (this[label] !== params.beforeEditCache) {
                        if (params.editedLabel === 'owner') {
                            this.saveOwner();
                        } else {
                            this.submit(params.editedLabel);
                        }
                    }
                } else {
                    this.hasErrors = true;
                }
            },
            submitField(field) {
                updateBizField(this.tableId, field.id, field.fieldName, field.fieldValue).then(res => {
                    console.log(res);
                });
            },
            fieldsDoneEdit(params) {
                const key = params.editedLabel.substring(0, params.editedLabel.indexOf('-bizFields'));
                this.editedLabel = params.editedLabel;
                let fields = this.bizFields;
                let currentField = {};
                if (this.validator('extendedField', params.value)) {
                    fields.forEach(val => {
                        if (val.fieldName === key) {
                            val.fieldValue = params.value.trim();
                            currentField = val;
                        }
                    });
                    this.bizFields = fields;
                    this.editedLabel = null;
                    this.hasErrors = false;
                    params.value !== params.beforeEditCache && this.submitField(currentField);
                } else {
                    this.hasErrors = true;
                }
            },
            submit(editedField) {
                let params = {
                    businessName: this.businessName,
                    description: this.description,
                    source: this.source,
                    generateMethod: this.generateMethod,
                    updateInterval: this.updateInterval,
                    bizMeaning: this.bizMeaning,
                    sensitiveData: this.sensitiveData,
                    sensitiveCategory: this.sensitiveCategory,
                    sourceCategory: this.sourceCategory,
                    sourceSystem: this.sourceSystem,
                    extendedField: this.extendedField,
                    field: editedField,
                    sensitiveId: this.selected[this.selected.length - 1]
                };
                let cacheData = new Date().valueOf();
                this.axios.post(`/datasets/${this.tableId}/commoninfo`, params).then(res => {
                    const {statusCode, result} = res.data;
                    if (statusCode === 200 && result) {
                        console.info('修改成功!');
                    } else {
                        this.message("编辑失败!", "error");
                    }
                });
            },
            validator(type, value) {
                this.errors = '';
                if (type === 'businessName') {
                    if (value.length > 50) {
                        this.message(this.$t('content.dataset.datasetDetail.zdsrgzf', [50]), "error");
                        return false;
                    } else if (/\//.test(value)) {
                        // this.message('不能输入"/"', "error")
                        this.message(this.$t('content.dataset.datasetDetail.bnsrxx'), "error");
                    } else {
                        return true;
                    }
                } else if (type === 'updateInterval') {
                    if (value.length <= 50) {
                        return true;
                    } else {
                        this.message(this.$t('content.dataset.datasetDetail.zdsrgzf', [50]), "error");
                        return false;
                    }
                } else if (type === 'extendedField') {
                    if (value.length <= 200) {
                        return true;
                    } else {
                        this.message(this.$t('content.dataset.datasetDetail.zdsrgzf', [200]), "error");
                        return false;
                    }
                } else {
                    if (value.length <= 200) {
                        return true;
                    } else {
                        this.message(this.$t('content.dataset.datasetDetail.zdsr200gzf'), "error");
                        return false;
                    }
                }
            },
            setIsPrivate(isPrivate) {
                this.$store.dispatch('setPrivate', isPrivate);
            },
            getAllData(tableId) {
                let id = null;
                if (tableId) {
                    id = tableId;
                } else {
                    id = this.tableId;
                }
                if (id) {
                    this.axios.get(`/datasets/${this.tableId}/commoninfo`).then((response) => {
                        if (response.body.statusCode === 200) {
                            this.loadingVisible = false;
                            let data = response.body.message;
                            let datasetInfo = data.datasetInfo;
                            data = data.datasetCommonInfo;
                            data.datasetInfo = datasetInfo;
                            this.setIsPrivate(data.isPrivate);
                            Object.assign(this.$data, data);   //合并原始数据对象
                            Bus.$emit('headerInfo', data);
                            Bus.$emit('sortTab', data);   //字段值为‘是’时，屏蔽该表的样本数据展示（详情页不展示‘样本数据’tab）；
                            Bus.$emit('update-tags', data.tags);
                            Bus.$emit('lastModifyTime', response.body.message.datasetInfo.lastModifyTime);
                            this.$store.dispatch('setDataStatus', this.status);
                            this.$store.dispatch('getSample', data.getSample);
                            Bus.$emit('IncreaseCollection', datasetInfo.favorite > 0);  //触发收藏功能，非父子间组件通信
                            this.bizFields = data.bizFields.map(field => {
                                field.fieldValue = field.fieldValue === null ? '' : field.fieldValue;
                                return field;
                            });
                            this.hasApplyAuthority = data.isDefault == 0 ? false : true;
                            const index = data.parentSensitiveId;
                            const index2 = data.sensitiveId;
                            this.selected = data.parentSensitiveId ? [index, index2] : [index2];
                            /*
                            * 权限申请
                            * */
                            if (data.privilege && data.privilege.resourcePrivilege === 'r') {
                                this.isReadable = true;
                            } else if (data.privilege && data.privilege.resourcePrivilege === 'rw') {
                                this.isReadable = true;
                                this.isWritable = true;
                            }

                            if (this.status != 2) {
                                this.storage = datasetInfo;
                                this.storage.datasourceType = data.datasourceType;
                                this.storage.partition_column = datasetInfo.properties.partition_column;
                                this.storage = JSON.parse(JSON.stringify(this.storage));
                                this.lastUpdate = datasetInfo.properties.last_modify_time;
                                this.lastStructurUpdate = datasetInfo.properties.modify_time;
                                this.dataLimite = datasetInfo.properties.data_scope;
                            }
                        }
                    });
                }
            },
            changeOwner(command) {
                this.editedLabel = null;
                this.axios.get(`/privilege/${this.tableId}/updateDatesetOwner?userName=${command}`).then(res => {
                    let body = res.body;
                    if (body.result && body.statusCode === 200) {
                        this.owner = command;
                    } else {
                        this.message("编辑失败!", "error");
                    }
                });
            }
        }
    };

</script>
<style lang="less">
    #attribute-info {
        &.properties {
            overflow: auto;
            margin-top: 20px;
            margin-bottom: 20px;
            transition: height .5s ease;
            .el-select > .el-input {
                margin-left: -4px;
            }
        }
        .block {
            width: 100%;
            label {
                padding-left: 0;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .content {
                    width: 90%;
                }
            }
        }
        .properties-container {
            margin-bottom: 25px;
        }
        .data-toggle {
            border-top: 1px solid #CCC;
            height: 16px;
            width: 100%;
            background: #FFF url("../../../../assets/images/metaData/icon/sq.png") no-repeat center center;
            cursor: pointer;
            &.off {
                background-image: url("../../../../assets/images/metaData/icon/zk.png");
            }
        }
        .base-info-table {
            overflow: hidden;
            border: 1px solid #DDD;
            border-bottom: none;
            border-right: none;
            width: 100%;
            dt {
                line-height: 35px;
                width: 200px;
                background-color: #FAFBFC;
            }
            dd {
                display: flex;
                align-items: center;
                width: calc(~ '(100% - 400px) / 2');
            }
            dt, dd {
                overflow: hidden;
                float: left;
                padding: 0 15px;
                height: 35px;
                line-height: 35px;
                border: 1px solid #DDD;
                border-top: none;
                border-left: none;
                color: #869198;
                font-weight: normal;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .cascader-wrap {
                .el-cascader {
                    .el-input__inner {
                        border-color: transparent;
                    }
                    .el-input__suffix {
                        display: none;
                    }
                    .el-cascader__label {
                        padding-left: 0;
                        color: #869198;
                    }
                }
            }
            th {
                background-color: #FAFBFC;
            }
        }
        .table-odd {
            border-top: none;
            dt, dd {
                border-top: 1px solid #DDD;
            }
        }
    }
    td span.text-aligin {
        padding-left: 0;
    }
    .storage {
        margin-top: 10px;
    }
    .properties .titIndex span {
        float: left;
    }
    .properties .edit-container {
        float: right;
        margin-bottom: 10px;
    }
    .properties .el-input.is-disabled .el-input__inner {
        background-color: transparent;
        border-color: #FFF;
        cursor: text;
        color: #333;
        padding-left: 0;
    }
    .properties .el-form-item__error {
        left: 420px;
        top: 5px;
    }
    .properties .el-form-item {
        margin-bottom: 0px;
    }
    .properties .el-form-item__content {
        line-height: 26px;
    }
    .properties .el-input__inner,
    .properties .el-select {
        height: 25px;
        width: 400px;
    }
    .propertiesContent {
        padding-left: 5px;
        width: 100%;
        word-break: break-all;
        font-size: 13px;
    }
    .propertiew-authority span {
        display: inline-block;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        margin-top: 2px;
        margin-right: 3px;
        background: #DBDBDB;
        color: #FFF;
    }
    .propertiew-authority .propperiesWritable {
        background: #267CEB;
    }
    .propertiew-authority .properiesReadable {
        background: #3CBF80;
    }
    .pl0 {
        padding-left: 0 !important;
    }
    .path-list {
        border-bottom: 1px solid #D9D9D9;
        padding-left: 30px;
        height: 29px;
        line-height: 23px;
    }
    .path-list:last-child {
        border-bottom: none;
        line-height: 34px;
    }
    .ali-placeholder {
        padding-left: 7px;
        color: #C5C4CC;
    }
    label {
        margin-bottom: 0;
    }
    .edit {
        display: none;
    }
    .view {
        .commom-overflow {
            display: inline-block;
        }
        label {
            position: relative;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
            white-space: nowrap;
        }
        height: 23px;
        line-height: 23px;
    }
    .error {
        display: none;
    }
    .editing {
        .edit {
            display: inline-block;
        }
        .error {
            display: inline;
            color: #F00;
        }
        .view {
            display: none;
        }
    }
    .edit {
        border: 1px solid #BFCBD9;
        padding-left: 5px;
        width: 400px;
        height: 30px;
        line-height: 30px;
        background-color: #FFF;
    }
    .property-owner:hover input {
        border: 1px solid #BFCBD9;
    }
    .view-btn {
        cursor: pointer;
    }
    .font-w {
        font-weight: bold;
    }
</style>
