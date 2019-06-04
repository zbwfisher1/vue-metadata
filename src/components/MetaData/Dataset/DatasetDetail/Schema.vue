<template>
    <div id="data-structure" class="boxCommon">
        <div class="con">
            <div class="table-title">
                <div class="table-title__text">
                    <span>{{$t('content.dataset.datasetDetail.zdxx')}}</span>
                </div>
            </div>
            <div class="schema">
                <div id="TableView" class="con">
                    <el-table key="2" :data="tableSchema" border v-loading="loadingVisible">
                        <el-table-column prop="fieldName"
                                         :label="$t(type === 'HBASE'? 'content.dataset.datasetDetail.lc':'content.dataset.datasetDetail.zid')">
                        </el-table-column>

                        <!--权限状态-->
                        <el-table-column v-if="hasDetail"
                                         key="3"
                                         prop="resourcePrivilege"
                                         :label="$t('content.dataset.datasetDetail.wdqx')"
                                         width="150">
                            <template slot-scope="scope">
                                <span class="green-text">
                                     {{ scope.row.resourcePrivilege ?
                                $t(`content.authority.${scope.row.resourcePrivilege}`):
                                ''}}
                                </span>
                            </template>
                        </el-table-column>

                        <!--敏感类别-->
                        <el-table-column
                                prop="fieldSensitive"
                                :label="$t('content.dataStructure.mgjb')"
                                width="200">
                            <template slot-scope="scope">
                                <el-cascader v-if="propEditPrivilege"
                                             :ref="`cascader${scope.row.id}`"
                                             :options="options"
                                             expand-trigger="hover"
                                             v-model="scope.row.selectedOptions"
                                             @active-item-change="clickSelectDep($event, scope.row.id)"
                                             @visible-change="handleChange($event, scope.row)">
                                </el-cascader>
                                <span v-else>{{scope.row.fieldSensitive}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="dataType"
                                         :label="$t('content.dataset.importExport.sjylx')"
                                         width="180">
                        </el-table-column>

                        <!--是否加密-->
                        <el-table-column prop="encryption"
                                         :label='$t("content.dataset.datasetDetail.sfjm")'
                                         v-if="userInfo['hive.encrypt'] &&  type === 'HIVE' && isDefault"
                                         width="120">
                            <template slot-scope="scope">
                                <span v-if="scope.row.encryption == '1'"> {{$t("content.dataset.datasetDetail.shi")}}</span>
                                <span v-else>{{$t("content.dataset.datasetDetail.fou")}}</span>
                            </template>
                        </el-table-column>

                        <el-table-column :label='$t("content.dataset.datasetDetail.zdms")' width="250">
                            <template slot-scope="scope">
                                <property-item
                                        :isDIV="true"
                                        :value="scope.row.comment"
                                        :itemName="scope.row"
                                        :parentLabel="editedItem"
                                        :placeholder="$t('content.dataset.datasetDetail.sjsrzdms')"
                                        @emitDoneEdit="doneEdit"></property-item>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('content.personal.qxxq')"
                                         key="4"
                                         v-if="propEditPrivilege && hasDetail">
                            <!--权限详情-->
                            <template slot-scope="scope">
                                <div class="handle-icon">
                                    <i class="el-icon-document" :title="$t('content.common.xq')"
                                       @click="handlerRow(scope.row)">
                                    </i>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="tablePages">
                        <el-pagination background
                                       layout="total, prev, pager, next"
                                       @current-change="handleCurrentChange"
                                       :current-page="currentPage"
                                       :page-size="pageSize"
                                       :total="totalRows">
                        </el-pagination>
                    </div>
                </div>
                <div class="con" v-if="partition">
                    <div class="tableMulti">
                        <div>
                            <div class="table-title">
                                <div class="table-title__text">
                                    <span>{{$t('content.dataset.datasetDetail.fqxx')}}</span>
                                </div>
                            </div>
                            <table class="table table-bordered tableList">
                                <thead>
                                <tr>
                                    <th width="30%">{{$t('content.dataset.datasetDetail.mc')}}</th>
                                    <th>{{$t('content.dataset.datasetDetail.sx')}}</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>{{$t('content.dataset.datasetDetail.fqzd')}}</td>
                                    <td>
                                        {{partition}}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <el-dialog :title="$t('content.dataStructure.qxqx',[currentRow.fieldName])"
                   :close-on-click-modal="false"
                   :visible.sync="dialogVisible"
                   width="650px">
            <div class="permission-search">
                <el-input :placeholder="$t('content.header.srbm')"
                          v-model="keyword"
                          prefix-icon="el-icon-search"
                          clearable
                          @clear="keywordSearch"
                          @keyup.enter.native="keywordSearch">
                    <el-button slot="append" @click="keywordSearch">{{$t('content.header.ss')}}</el-button>
                </el-input>
            </div>
            <div v-loading="dialogLoading">
                <dl class="permission-group">
                    <dt>{{$t('content.dataStructure.jkd')}}</dt>
                    <dd>
                        <el-tree :data="treeData.read" :props="defaultProps">
                            <div slot-scope="{ node, data }">
                                <span v-html="emphasizeName(data.label, cacheKeyword)"></span>
                            </div>
                        </el-tree>
                    </dd>
                </dl>
                <dl class="permission-group last-child">
                    <dt>{{$t('content.dataStructure.jkdx')}}</dt>
                    <dd>
                        <el-tree :data="treeData.write" :props="defaultProps">
                            <div slot-scope="{ node, data }">
                                <span v-html="emphasizeName(data.label, cacheKeyword)"></span>
                            </div>
                        </el-tree>
                    </dd>
                </dl>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {mapState} from 'vuex';
    import Bus from 'utils/bus';
    import {Message, EmphasizeName} from 'mixins/common'; //公用方法
    import PropertyItem from './PropertyItem';
    import Search from '@/components/MetaData/Personal/chiildren/Search';
    import {getSensitiveList, setSensitive, getFieldAuthorizedAccounts} from '@/service/getData';

    export default {
        components: {
            PropertyItem,
            Search
        },
        mixins: [Message, EmphasizeName],
        data() {
            return {
                editedItem: null,
                errors: null,
                tableSchema: [],
                tableVisiable: true,// 显示表格和JSON视图
                columnId: 0,
                columnCommentId: '',
                clickDisabled: false,
                partition: null,   //分区信息
                loadingVisible: true,
                hasErrors: false,
                currentPage: 1,
                totalRows: 1,
                pageSize: 10,
                fieldLoading: false,
                options: [],
                currentRow: {},
                dialogVisible: false,
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                treeData: {
                    read: [],
                    write: []
                },
                cacheTreeData: {
                    read: [],
                    write: []
                },
                keyword: '',
                cacheKeyword: '',
                dialogLoading: false
            };
        },
        props: ["tableId", 'type', 'hasDetail', 'isDefault'],
        created() {
            Bus.$on('setEditLabel', label => {
                this.editedItem = label;
            });
            this.fetchData();
            this.fetchTree();
        },
        watch: {
            '$route': function(val) {
                if (val.query.path) {
                    this.fetchData();
                }
            },
            'dialogVisible': function(newValue) {
                if (!newValue) {
                    this.keyword = '';
                    this.cacheKeyword = '';
                    this.cacheTreeData = this.treeData = {
                        read: [],
                        write: []
                    };
                }
            }
        },
        computed: {
            ...mapState({
                propEditPrivilege: 'propEditPrivilege',
                userInfo: 'userInfo'
            })
        },
        directives: {
            'focus': function(el, binding) {
                if (binding.value) {
                    el.focus();
                }
            }
        },
        methods: {
            clickSelectDep(result, id) {
                const cascader = this.$refs[`cascader${id}`].menu;
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
            fetchFieldList() {
                this.dialogLoading = true;
                getFieldAuthorizedAccounts(this.tableId, this.currentRow.id, this.cacheKeyword).then(res => {
                    const {statusCode, message} = res.data;
                    if (statusCode === 200) {
                        Object.keys(message).forEach(key => {
                            message[key].forEach(obj => {
                                obj.children = obj.group;
                                obj.label = obj.projectName;
                                if (obj.children && obj.children.length) {
                                    obj.children.forEach(item => {
                                        item.label = item.groupName;
                                        item.children = item.users;
                                        item.users.forEach(user => {
                                            user.label = user.username;
                                        });
                                    });
                                }
                            });
                        });
                        this.dialogLoading = false;
                        this.treeData = message;
                        this.cacheTreeData = message;
                    }
                });
            },
            keywordSearch() {
                this.cacheKeyword = this.keyword;
                this.fetchFieldList();
            },
            handlerRow(rowData) {
                this.dialogVisible = true;
                this.currentRow = rowData;
                this.fetchFieldList();
            },
            handleChange(value, currentRow) {
                if (!value) {
                    const {id, selectedOptions} = currentRow;
                    setSensitive(this.tableId, id, selectedOptions[selectedOptions.length === 1 ? 0 : 1]).then(res => {
                        const {statusCode, message} = res.data;
                        if (statusCode === 200) {
                            Bus.$emit('fetch-common');
                        }
                    });
                }
                const menus = document.querySelectorAll('.el-cascader-menus.el-popper');
                menus.forEach(menu => {
                    menu.parentNode.removeChild(menu);
                });
            },
            handleCurrentChange(val) {
                this.fetchData(val);
            },
            editItem: function(item) {
                this.beforeEditCache = item.comment;
                this.editedItem = item;
            },
            validator(type, value) {
                let _reg = /^[A-Za-z\d\_\-\u4e00-\u9fa5]*$/;
                this.errors = '';
                if (_reg.test(value)) {
                    return true;
                } else {
                    this.message(this.$t('content.validator.hzywszxhxhx'), "error");
                    return false;
                }
            },
            doneEdit: function(item) {
                if (!this.editedItem) {
                    return;
                }

                if (!item.comment) {
                    item.comment = '';
                }

                item.comment = item.comment.trim();

                this.hasErrors = false;
                this.editedItem = null;
                if (!item.comment) {
                    item.comment = '';
                }
                if (item.comment !== this.beforeEditCache) {
                    this.CommentSubmit(item);
                }
            },
            cancelEdit: function(item) {
                this.editedItem = null;
                item.comment = this.beforeEditCache;
            },
            CommentSubmit(item) {
                let _param = {
                    text: item.comment,
                    id: item.commentId
                };
                this.columnId = item.id;
                this.axios.post(`/datasets/${this.tableId}/columns/${this.columnId}/comments`, _param).then(function(res) {
                    if (res.body.statusCode === 200) {
                        //this.message("修改成功!","success");
                    } else {
                        this.message("修改失败!", "error");
                    }
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
                        this.options = message;
                    }
                });
            },
            fetchData(page = 1) {
                if (this.tableId) {
                    this.loadingVisible = true;
                    this.axios.get(`/datasets/${this.tableId}/columns?page=${page}&rows=10`).then(res => {
                        this.loadingVisible = false;
                        if (res.body.statusCode !== 200) {
                            this.tableSchema = [];
                        } else {
                            Object.assign(this.$data, res.body.message);
                            const {records} = res.body.message;
                            records.forEach(obj => {
                                const {parentSensitiveId, sensitiveId} = obj;
                                obj.selectedOptions = parentSensitiveId ? [parentSensitiveId, sensitiveId] : [sensitiveId];
                            });
                            this.tableSchema = records;
                        }
                    });
                }
            }
        }
    };
</script>
<style lang="less">
    #data-structure {
        .permission-search {
            width: 250px;
        }
        .permission-group {
            margin-top: 20px;
            border: 1px solid #CCC;
            &.last-child {
                margin-top: 0;
                border-top: none;
            }
            dt {
                padding: 5px 10px;
                background-color: #DCDCDC;
                border-bottom: 1px solid #CCC;
            }
            dd {
                overflow: auto;
                height: 200px;
                background-color: #FFF;
            }
        }
        .green-text {
            color: #77B27B;
        }
        .el-cascader {
            width: 100%;
            .el-input__inner {;
                background-color: transparent;
                border-color: transparent;
            }
            .el-cascader__label {
                padding-left: 0;
            }
        }
        .handle-icon {
            i {
                font-size: 16px;
                cursor: pointer;
            }
        }
        .el-form-item__error {
            left: 0;
            top: 100%;
        }
    }
</style>
