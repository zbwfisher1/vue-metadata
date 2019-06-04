<template>
    <div id="manager-setting">
        <div class="title">
            <span>{{$t('content.personal.a1')}}</span>
        </div>
        <el-form :disabled="fullscreenLoading" v-loading="fullscreenLoading"
                 class="form-wrap"
                 element-loading-spinner="el-icon-loading"
                 element-loading-background="rgba(255, 255, 255, 0.6)">
            <div class="input-wrapper">
                <span>{{$t('content.personal.a2')}}：</span>
                <el-input type="number"
                          min="1" max="40000"
                          v-model.trim='exportMaxline' @focus="cacheValue = exportMaxline"
                          @blur="submit('export.maxline', exportMaxline)"
                          :placeholder="$t('content.import.placeholder.qsr')"></el-input>
            </div>
            <div class="input-wrapper">
                <span>{{$t('content.personal.a3')}}：</span>
                <el-input type="number"
                          min="1" max="10000"
                          v-model.trim='importMaxline' @blur="submit('import.maxline', importMaxline)"
                          @focus="cacheValue = importMaxline"
                          :placeholder="$t('content.import.placeholder.qsr')"></el-input>
            </div>
            <div class="input-wrapper">
                <span>{{$t('content.personal.a4')}}：</span>
                <el-input v-model.trim='mailHost' @focus="cacheValue = mailHost"
                          @blur="submit('mail.host', mailHost)"
                          :placeholder="$t('content.import.placeholder.qsr')"></el-input>
            </div>
            <div class="input-wrapper">
                <span>{{$t('content.personal.a5')}}：</span>
                <el-input v-model.trim='mailUsername' @focus="cacheValue = mailUsername"
                          @blur="submit('mail.username', mailUsername)"
                          :placeholder="$t('content.import.placeholder.qsr')"></el-input>
            </div>
            <div class="input-wrapper">
                <span>{{$t('content.personal.a6')}}：</span>
                <el-input v-model.trim='mailPassword'
                          @focus="cacheValue = mailPassword"
                          @blur="submit('mail.password', mailPassword)"
                          :placeholder="$t('content.import.placeholder.qsr')"></el-input>
            </div>
            <div class="input-wrapper">
                <span>{{$t('content.personal.a7')}}：</span>
                <el-select v-model="datasetStatus"
                           multiple
                           collapse-tags
                           @change="handleChange"
                           :placeholder="$t('content.common.qxz')" class="select-status">
                    <el-option v-for="item in options"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="input-wrapper">
                <span class="top-align">{{$t('content.personal.mgdj')}}：</span>
                <div class="el-input mg-wrap">
                    <el-tree :data="data"
                             :props="defaultProps"
                             :expand-on-click-node="false">
                        <div class="custom-tree-node" slot-scope="{ node, data }">
                            <template>
                                <span class="icon-plus"
                                      :class="{'show': !data.isEditing, 'hide': data.isEditing}"
                                      @click="handleNodeClick(data)"
                                      v-if="!Number.isInteger(data.id)">
                                </span>
                                <span class="name"
                                      :class="{'show': !data.isEditing,
                                      'long-input': data.id === 0 || !isShowRemoveIcon(data),
                                      'is-class': '!Number.isInteger(data.id)',
                                      'hide': data.isEditing}"
                                      @click="handleNodeClick(data)">{{Number.isInteger(data.id) ? node.label : $t(node.label)}}</span>
                                <input class="node-input"
                                       v-model="labelTitle"
                                       @blur="appendNode(data)"
                                       :maxlength="textFieldLength.normal"
                                       :ref="`${data.id}`"
                                       :class="{'show': data.isEditing, 'hide': !data.isEditing}"
                                       type="text"/>
                                <template v-if="Number.isInteger(data.id)">
                                    <i class="el-icon-close remove-node"
                                       v-if="isShowRemoveIcon(data)"
                                       :class="{'level-2': data.parentId !== null}"
                                       @click="dialogConfirm(data)"></i>
                                    <span class="rate-txt">{{$t('content.personal.dj')}}:</span> <!--等级-->
                                    <el-rate v-model="data.level"
                                             :disabled="data.id === 0"
                                             @change="changeRate($event, data)"></el-rate>
                                </template>
                            </template>
                        </div>
                    </el-tree>
                </div>
                <div class="tree-error">
                    {{error}}
                </div>
            </div>
        </el-form>
        <div class="title">
            <span>{{$t('content.personal.a34')}}<!--文件分类配置--></span>
        </div>
        <el-form v-loading="fileLoading"
                 class="form-file"
                 element-loading-spinner="el-icon-loading"
                 element-loading-background="rgba(255, 255, 255, 0.6)">
            <div class="input-wrapper">
                <span class="top-align">{{$t('content.files.picture')}}：</span>
                <el-input type="textarea"
                          @focus="cacheValue = fileTypeForm.picture"
                          @blur="fileTypeSubmit('picture')"
                          v-model="fileTypeForm.picture"></el-input>
            </div>
            <div class="input-wrapper">
                <span class="top-align">{{$t('content.files.audio')}}：</span>
                <el-input type="textarea"
                          @focus="cacheValue = fileTypeForm.audio"
                          @blur="fileTypeSubmit('audio')"
                          v-model="fileTypeForm.audio"></el-input>
            </div>
            <div class="input-wrapper">
                <span class="top-align">{{$t('content.files.video')}}：</span>
                <el-input type="textarea"
                          @focus="cacheValue = fileTypeForm.video"
                          @blur="fileTypeSubmit('video')"
                          v-model="fileTypeForm.video"></el-input>
            </div>
            <div class="input-wrapper">
                <span class="top-align">{{$t('content.files.document')}}：</span>
                <el-input type="textarea"
                          @focus="cacheValue = fileTypeForm.document"
                          @blur="fileTypeSubmit('document')"
                          v-model="fileTypeForm.document"></el-input>
            </div>
        </el-form>
        <div class="title">
            <span>{{$t('content.personal.a8')}}</span>
        </div>
        <el-form :inline="true" :model="form">
            <el-form-item :label="$t('content.personal.a9')" label-width="100px">
                <el-input v-model="form.fieldName"
                          :placeholder="$t('content.import.placeholder.qsr')"
                          auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item :label="$t('content.personal.a10')" label-width="130px">
                <el-input v-model="form.fieldDesc"
                          class="desc-input"
                          :placeholder="$t('content.import.placeholder.qsr')" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="createdData">{{$t('content.common.tj')}}</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableData"
                  v-loading="tableLoading"
                  border
                  style="width: 100%"
                  @cell-dblclick="cellClick">
            <el-table-column :label="$t('content.personal.a9')" prop="fieldName"></el-table-column>
            <el-table-column :label="$t('content.personal.a10')" prop="fieldDesc">
                <template scope="scope">
                    <el-input v-model="scope.row.fieldDesc"
                              v-if="scope.row.isEdit"
                              :ref="`input-${scope.row.id}`"
                              maxlength="200"
                              @blur="cellEditDone(scope.$index, scope.row, 'fieldDesc')">
                    </el-input>
                    <span v-else>{{ scope.row.fieldDesc }}</span>
                </template>
            </el-table-column>

            <el-table-column :label="$t('content.common.cz')" class-name="edit-row-data">
                <template scope="scope">
                    <i class="el-icon-delete" @click="customCompFunc(scope.row)"/>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :title="$t('content.common.tis')"
                   :close-on-click-modal="false"
                   width="400px"
                   :visible.sync="dialogVisible">
            <div class="del-content">
                {{$t('content.personal.a11', [deleteField.fieldName])}}?
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button
                        @click="dialogVisible = false">
                    {{$t('content.common.qx')}}
                </el-button>
                <el-button type="primary" :loading="btnLoading"
                           @click="deleteConfirm">
                    {{$t('content.common.qd')}}
                </el-button>
            </div>
        </el-dialog>

        <el-dialog :title="$t('content.common.tis')"
                   :close-on-click-modal="false"
                   width="500px"
                   :visible.sync="deleteConfirmDialog">
            <div class="del-content">
                {{$t('content.personal.qqsjfsc', [currentNode.name])}}?<br/>
                <span class="text-danger">{{$t('content.personal.gflxdsy')}}</span>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="deleteConfirmDialog = false">
                    {{$t('content.common.qx')}}
                </el-button>
                <el-button type="primary" :loading="btnLoading"
                           @click="removeNode">
                    {{$t('content.common.qd')}}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        getSystemConfig,
        submitSystemConfig,
        getBizField,
        deleteBizField,
        submitBizField,
        getFileType,
        EditFileType,
        getSensitiveList,
        createSensitive,
        updateSensitive,
        deleteSensitive
    } from '@/service/getData';
    import {nameValidate} from '@/utils/validator';

    export default {
        name: "Setting",
        data() {
            return {
                id: -1,
                options: [{
                    value: '0',
                    label: 'active'
                }, {
                    value: '1',
                    label: 'deleted'
                }, {
                    value: '2',
                    label: 'unknown'
                }],
                form: {
                    fieldName: '',
                    fieldDesc: ''
                },
                fileTypeForm: {
                    picture: '',
                    video: '',
                    document: '',
                    audio: ''
                },
                fileLoading: true,
                dialogVisible: false,
                btnLoading: false,
                fullscreenLoading: true,
                tableLoading: true,
                exportMaxline: 0,
                importMaxline: 0,
                mailHost: '',
                mailUsername: '',
                mailPassword: '',
                datasetStatus: '',
                cacheValue: '',
                tableData: [],
                deleteField: {
                    fieldName: '',
                    id: 0
                },
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                data: [],
                isShow: false,
                labelTitle: '',
                error: '',
                currentNode: {},
                nodeEditing: false,
                deleteConfirmDialog: false
            };
        },
        async created() {
            this.fullscreenLoading = true;
            await getSystemConfig().then(res => {
                res.forEach(obj => {
                    const keyStr = obj['key'];
                    const index = keyStr.indexOf('.');
                    const key = keyStr.substring(0, index) + keyStr.substring(index + 1, index + 2).toUpperCase() + keyStr.substring(index + 2);
                    if (key === 'datasetStatus') {
                        this[key] = obj['value'].split(',');
                    } else {
                        this[key] = obj['value'];
                    }
                });
                this.fullscreenLoading = false;
            });
            await this.fetchBizFieldList();
            await this.fetchFileType();
            await this.fetchTree();
        },
        watch: {
            deleteConfirmDialog(newval) {
                if (!newval) {
                    this.btnLoading = false;
                }
            }
        },
        methods: {
            isShowRemoveIcon(data) {
                return (data.parentId === null && data.children.length === 1) || data.parentId !== null;
            },
            guid() {
                /**
                 * @return {string}
                 */
                const S4 = function () {
                    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
                };
                return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
            },
            fetchTree() {
                getSensitiveList().then(res => {
                    const {statusCode, message} = res.data;
                    if (statusCode === 200) {
                        //添加到一级分类
                        message.push({
                            name: 'content.personal.tdyjfl', //添加一级分类
                            id: this.guid(),
                            children: [],
                            isEditing: false,
                            type: 'add-1'
                        });
                        message.forEach((obj, index) => {
                            //每个一级分类下,要添加一个创建二级分类的功能
                            if (index < message.length - 1 && obj.id !== 0) {
                                obj.children.push({
                                    name: 'content.personal.tdejfl',   //添加二级分类
                                    id: this.guid(),
                                    isEditing: false,
                                    parentId: obj.id,
                                    type: 'add-2'
                                });
                                obj.children.forEach((item, index) => {
                                    item.isEditing = false;
                                });
                            }
                            obj.isEditing = false;
                        });
                        this.data = message;
                    }
                });
            },
            handleNodeClick(data) {
                if (!this.nodeEditing && data.id !== 0) {     //没有节点还在编辑中
                    const {id, name} = data;
                    data.isEditing = true;
                    this.nodeEditing = true;   //设置为编辑节点中
                    this.currentNode = data;
                    if (Number.isInteger(id)) {
                        this.labelTitle = data.name;
                    } else {
                        this.labelTitle = '';
                    }
                    this.$nextTick(function () {
                        this.$refs[data.id].focus();
                    });
                }
            },
            appendNode(data) {
                const {id, parentId, level, type} = data;
                const name = this.labelTitle;
                if (Number.isInteger(id)) {  //修改标称名称
                    if (name === '') {
                        this.labelTitle = '';
                        this.nodeEditing = false;
                        this.error = '';
                        data.isEditing = false;
                    } else if (this.currentNode.name === name) {
                        this.labelTitle = '';
                        data.isEditing = false;
                        this.nodeEditing = false;
                    } else {
                        updateSensitive(id, name, level).then(res => {
                            const {statusCode, message} = res.data;
                            if (statusCode === 200) {
                                this.$message({
                                    message: this.$t('content.dataHistory.a16'), //更新成功
                                    type: 'success'
                                });
                                this.labelTitle = '';
                                data.isEditing = false;
                                data.name = name;
                                this.nodeEditing = false;
                            }
                        });
                    }
                } else {
                    if (name === '') {
                        this.labelTitle = '';
                        this.nodeEditing = false;
                        data.isEditing = false;
                        this.error = '';
                    } else if (!/^[A-Za-z0-9_\u4e00-\u9fa5]+$/.test(name)) {
                        this.error = this.$t('content.personal.qsrhz');  //请输入汉字、英文、数字、下划线
                        this.$refs[id].focus();
                    } else if (name.length > this.textFieldLength.normal) {
                        this.error = this.$t('content.import.validator.cdbdcg', this.textFieldLength.normal);  //长度不得超过{0}个字符
                        this.$refs[id].focus();
                    } else {
                        this.error = '';
                        let params = {
                            name
                        };
                        //创建二级目录时,需要知道一级目录的id
                        if (type === 'add-2') {
                            params.parentId = parentId;
                        }
                        createSensitive(params).then(res => {
                            const {statusCode, message} = res.data;
                            if (statusCode === 200) {
                                if (type === 'add-1') {
                                    this.data.splice(-1, 0, {
                                        name: this.labelTitle,
                                        id: message.id,
                                        children: [{
                                            name: 'content.personal.tdejfl',   //添加二级分类
                                            id: this.guid(),
                                            isEditing: false,
                                            parentId: message.id,
                                            type: 'add-2'
                                        }],
                                        parentId: null
                                    });
                                } else {
                                    const index = this.data.findIndex(node => node.id === parentId);
                                    this.data[index].children.splice(-1, 0, {
                                        name: this.labelTitle,
                                        id: message.id,
                                        parentId: message.parentId
                                    });
                                }
                                this.labelTitle = '';
                                data.isEditing = false;
                                this.nodeEditing = false;
                                this.$message({
                                    message: this.$t('content.importExport.a19'), //创建成功
                                    type: 'success'
                                });
                            }
                        });
                    }
                }
            },
            dialogConfirm(data) {
                this.currentNode = data;
                this.deleteConfirmDialog = true;
            },
            removeNode() {
                const {id, parentId} = this.currentNode;
                this.btnLoading = true;
                deleteSensitive(id).then(res => {
                    const {statusCode, message} = res.data;
                    if (statusCode === 200) {
                        if (parentId) {  //删除的是二级分类
                            this.data.forEach(node => {
                                node.children = node.children.filter(node => node.id !== id);
                            });
                        } else {
                            this.data = this.data.filter(node => node.id !== id);
                        }
                        this.currentNode = {};
                        this.deleteConfirmDialog = false;
                        this.btnLoading = false;
                        this.$message({
                            message: this.$t('content.common.sccg'), //删除成功
                            type: 'success'
                        });
                    }
                });
            },
            changeRate(num, data) {
                const {id, name} = data;
                updateSensitive(id, name, num).then(res => {
                    const {statusCode, message} = res.data;
                    if (statusCode !== 200) {
                        this.$message({
                            message: this.$t('content.dataHistory.a17'), //更新失败,请重试
                            type: 'error'
                        });
                    }
                });
            },
            fileTypeSubmit(type) {
                const typeValue = this.fileTypeForm[type];
                if (this.cacheValue !== typeValue) {
                    this.fileLoading = true;
                    EditFileType(typeValue, type).then(res => {
                        const {statusCode, message} = res.data;
                        this.fileLoading = false;
                    });
                }
            },
            fetchFileType() {
                this.fileLoading = true;
                getFileType().then(res => {
                    const {statusCode, message} = res.data;
                    this.fileLoading = false;
                    if (statusCode === 200) {
                        const fileType = {};
                        message.forEach(item => {
                            fileType[item.category] = item.fileType;
                        });
                        this.fileTypeForm = fileType;
                    }
                }).catch(res => {
                    this.fileLoading = false;
                });
            },
            fetchBizFieldList() {
                this.tableLoading = true;
                getBizField().then(res => {
                    this.tableLoading = false;
                    res.forEach(item => {
                        item.isEdit = false;
                    });
                    this.tableData = res;
                }).catch(res => {
                    this.tableLoading = true;
                });
            },
            openDialog() {
                this.dialogVisible = true;
            },
            createdData() {
                const {fieldName, fieldDesc} = this.form;
                if (fieldName.length) {
                    if (fieldName.length > 50) {
                        this.$message({
                            message: this.$t('content.personal.a15'), //'字段名称不能超过50个字符',
                            type: 'error'
                        });
                    } else {
                        if (fieldDesc.length > 200) {
                            this.$message({
                                message: this.$t('content.personal.a16'), //'字段描述不能超过200个字符',
                                type: 'error'
                            });
                        } else {
                            submitBizField(fieldName, fieldDesc).then(res => {
                                if (res.data.message === 'Successfully handle the request.') {
                                    this.dialogVisible = false;
                                    this.$message({
                                        message: this.$t('content.personal.a17'), //'新增成功',
                                        type: 'success'
                                    });
                                    this.form = {
                                        fieldName: '',
                                        fieldDesc: ''
                                    };
                                    this.fetchBizFieldList();
                                }
                            });
                        }
                    }
                } else {
                    this.$message({
                        message: this.$t('content.personal.a18'), //'字段名称不能为空',
                        type: 'error'
                    });
                }
            },
            submit(key, value) {
                if (this.validateForm(key, value)) {
                    if (this.cacheValue !== value) {
                        this.fullscreenLoading = true;
                        submitSystemConfig(key, value).then(res => {
                            this.fullscreenLoading = false;
                        });
                    }
                }
            },
            validateForm(key, val) {
                if (val === '') {
                    this.$message({
                        message: this.$t('content.personal.a19'), //'值不能为空',
                        type: 'error'
                    });
                    return false;
                } else {
                    if (key.indexOf('maxline') !== -1) {
                        if (/^[1-9]\d*$/.test(val)) {

                            if (key === 'export.maxline' && val > 40000) {
                                this.$message({
                                    message: this.$t('content.personal.a20'), //'excel导出行数,最大值不能超过 40000',
                                    type: 'error'
                                });
                                return false;
                            } else if (key === 'import.maxline' && val > 10000) {
                                this.$message({
                                    message: this.$t('content.personal.a21'), //'excel导入行数,最大值不能超过 10000',
                                    type: 'error'
                                });
                                return false;
                            } else {
                                return true;
                            }
                        } else {
                            this.$message({
                                message: this.$t('content.personal.a22'), //'只能是正整数',
                                type: 'error'
                            });
                            return false;
                        }
                    } else if (key === 'mail.username') {
                        if (/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(val)) {
                            return true;
                        } else {
                            this.$message({
                                message: this.$t('content.personal.a23'), //'邮箱格式不正确',
                                type: 'error'
                            });
                            return false;
                        }
                    } else {
                        return true;
                    }
                }
            },
            handleChange(value) {
                this.submit('dataset.status', value.join(','));
            },
            customCompFunc(obj) {
                this.dialogVisible = true;
                this.deleteField = obj;
            },
            deleteConfirm() {
                this.btnLoading = true;
                deleteBizField(this.deleteField.id).then(res => {
                    if (res === 'Successfully handle the request.') {
                        this.$message({
                            message: this.$t('content.personal.a24'), //'删除成功',
                            type: 'success'
                        });
                        this.btnLoading = false;
                        this.dialogVisible = false;
                        this.fetchBizFieldList();
                    }
                });
            },
            cellClick(row, column) {
                if (column.property === 'fieldDesc') {
                    row.isEdit = true;
                    row.cacheFieldDesc = row.fieldDesc;
                    this.$nextTick(function () {
                        this.$refs[`input-${row.id}`].focus();
                    });
                }
            },
            // 单元格编辑回调
            cellEditDone(rowIndex, rowData, field) {
                const newValue = rowData[field];
                const oldValue = rowData.cacheFieldDesc;

                rowData.isEdit = false;
                if (newValue !== oldValue) {
                    if (newValue.length > 200) {
                        this.$message({
                            message: this.$t('content.personal.a16'), //'字段描述不能超过200个字符',
                            type: 'error'
                        });
                    } else {
                        this.tableLoading = true;
                        submitBizField(rowData.fieldName, newValue, rowData.id).then(res => {
                            if (res.data.message === 'Successfully handle the request.') {
                                this.dialogVisible = false;
                                this.$message({
                                    message: this.$t('content.personal.a25'), //'修改成功',
                                    type: 'success'
                                });
                                this.fetchBizFieldList();
                            }
                        });
                    }
                }
            }
        }
    };
</script>

<style lang="less">
    #manager-setting {
        background-color: #FFF;
        .title {
            margin-bottom: 20px;
            line-height: 45px;
            height: 40px;
            border-bottom: 1px dashed #D5D5D8;
            span {
                padding-left: 10px;
                display: inline-block;
                height: 14px;
                font-size: 14px;
                line-height: 14px;
                border-left: 2px solid #0F81DA;
            }
        }
        .el-icon-delete {
            font-size: 16px;
        }
        .edit-row-data {
            i {
                font-size: 16px;
                cursor: pointer;
            }
        }
        .cell-edit-color {
            color: #2DB7F5;
            font-weight: bold;
        }
        .form-wrap {
            width: 650px;
        }
        .form-file {
            width: 530px;
        }
        .el-form {
            margin-bottom: 20px;
            .desc-input {
                width: 300px;
            }
            .input-wrapper {
                width: 100%;
                margin-bottom: 20px;
                > span {
                    text-align: right;
                    display: inline-block;
                    width: 170px;
                }
                .top-align {
                    vertical-align: top;
                }

                .tree-error,
                .el-input {
                    width: 400px;
                }
                .el-textarea {
                    width: 330px;
                }
                .tree-error {
                    height: 25px;
                    line-height: 25px;
                    margin-left: 170px;
                    color: #F00;
                }
                .mg-wrap {
                    overflow: auto;
                    height: 200px;
                    border: 1px solid #C0C4CC;
                    .custom-tree-node {
                        display: flex;
                        align-items: center;
                        padding-right: 0;
                        .el-rate {
                            height: 12px;
                            .el-rate__item {
                                vertical-align: top;
                                .el-rate__icon {
                                    font-size: 12px;
                                }
                            }
                        }
                        .name {
                            overflow: hidden;
                            width: 120px;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .long-input {
                            width: 152px;
                        }
                        .is-class {
                            width: 250px;
                        }
                        .rate-txt {
                            margin-left: 60px;
                            margin-right: 5px;
                        }
                        .icon-plus {
                            margin-right: 10px;
                            display: inline-block;
                            height: 13px;
                            width: 13px;
                            background: url(../../../assets/images/icon/plus.png);
                        }
                        .node-input {
                            width: 120px;
                            border: 1px solid #CCC;
                            height: 20px;
                        }
                        .hide {
                            display: none;
                        }
                        .show {
                            display: block;
                        }

                        .remove-node {
                            margin-left: 18px;
                            font-size: 14px;
                            &.level-2 {
                                margin-left: 0;
                            }
                            &:hover {
                                color: #F00;
                            }
                        }
                    }

                }
            }
        }
        .btn-box {
            margin-top: 15px;
            width: 100%;
            .add-data {
                display: block;
                margin: 0 auto;
                border: none;
                width: 46px;
                height: 28px;
                background: transparent url("../../../assets/images/tj.png");
                &:focus {
                    outline: none;
                }
            }
        }
        b {
            color: #F00;
        }
        .el-button {
            height: 30px;
        }
    }
</style>
