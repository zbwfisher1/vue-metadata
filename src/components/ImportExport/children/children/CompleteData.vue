<template>
    <div id="insert-data" class="pane" :style="{ flexGrow: 1 }">
        <div class="sub-nav">
            <ul>
                <li>{{$t('content.dataset.importExport.drdc')}}<span class="split-line">/</span></li>
                <li>{{$t('content.dataset.importExport.ysjzddr')}}<span class="split-line">/</span></li>
                <li>
                    <router-link :title="$t('content.dataset.importExport.ysjcj')"
                                 :to="{name: 'TaskList'}">
                        {{$t('content.dataset.importExport.ysjcj')}}<!--元信息采集-->
                    </router-link>
                    <span class="split-line">/</span>
                </li>
                <li>{{$t('content.importExport.rwgl')}}<!--任务管理--><span class="split-line">/</span></li>
                <li>
                    <router-link :title="$t('content.dataset.importExport.xzsjdr')"
                                 :to="{name: 'InsertData'}">
                        {{$t('content.importExport.xzsjdr')}}<!--新增数据导入-->
                    </router-link>
                    <span class="split-line">/</span>
                </li>
                <li>{{$t('content.importExport.yclsj')}}<!--已处理数据--></li>
            </ul>
        </div>
        <div class="main">
            <div class="table-title">
                <div class="table-title__text">
                    <span>{{$t('content.importExport.yclsj')}}</span>
                </div>
            </div>
            <el-form @submit.native.prevent>
                <el-row class="header-setting">
                    <el-col :span="12">
                        <el-form-item :label="$t('content.dataset.importExport.sxpzlx')+':'">
                            <el-radio v-model="type" :label="false" :disabled="userInfo.roles !== 'leapid.admin'">
                                {{$t('content.dataset.importExport.pzhmd')}}
                            </el-radio>
                            <el-radio v-model="type" :label="true" :disabled="userInfo.roles !== 'leapid.admin'">
                                {{$t('content.dataset.importExport.pzbmd')}}
                            </el-radio>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" class="header-tip">
                        {{$t(`content.dataset.importExport.${type ? 'pzbxyb' : 'pzbxyh'}`)}}
                    </el-col>
                </el-row>
                <div class="black-list-container">
                    <section class="black-list-left">
                        <div class="list-title">{{$t(`content.importExport.yclsj`)}}<!--已处理数据--></div>
                        <div class="tree-search">
                            <!--请输入要查找的表名-->
                            <div class="el-input">
                                <input type="text"
                                       v-model="form.keyword"
                                       @keyup.enter="fetchDatabaseData"
                                       :placeholder="$t('content.import.czbm')"
                                       class="el-input__inner"/>
                            </div>
                            <i class="el-icon-search" @click="fetchDatabaseData"></i>
                        </div>
                        <div class="tree-wrap dbList" v-loading="leftLoading">
                            <el-checkbox-group v-model="checkList">
                                <ul class="database-list dbList">
                                    <li v-for="tree in treeData">
                                        <div class="database-item">
                                            <div class="item-name" @click="toggle(tree)">
                                                <i class="icon db-icon"></i>
                                                <span class="el-tree-node__loading-icon el-icon-loading"
                                                      v-if="tree.loading"></span>
                                                <span v-html="emphasizeName(tree.databaseName, form.keyword)"></span>
                                            </div>
                                            <el-checkbox :label="tree.databaseName"
                                                         @change="handleCheckedChange(tree)"></el-checkbox>
                                        </div>
                                        <ul class="database-list dbList" v-if="tree.children.length && tree.isExpand">
                                            <li v-for="item in tree.children">
                                                <div class="database-item">
                                                    <div class="item-name">
                                                        <i class="icon table-icon"></i>
                                                        <span v-html="emphasizeName(item.tableName, form.keyword)"></span>
                                                    </div>
                                                    <el-checkbox :disabled="checkList.includes(tree.databaseName)"
                                                                 :label=" `${item.databaseName}/${item.tableName}` "></el-checkbox>
                                                </div>
                                            </li>
                                            <li v-if="tree.isMore">
                                                <div class="more" @click="loadMore(tree)">
                                                    {{$t('content.common.jzgd')}}
                                                </div>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </el-checkbox-group>
                        </div>
                    </section>
                    <section class="black-list-center">
                        <div class="arrow">
                            <i class="el-icon-arrow-right"></i>
                            <i class="el-icon-arrow-left"></i>
                        </div>
                    </section>
                    <section class="black-list-right black-tree-container">
                        <div class="list-title">{{$t(`content.import.yxzdrsj`)}}<!--已选择导入数据--></div>
                        <ul class="tree-wrap database-list dbList" v-loading="rightLoading">
                            <li v-for="check in filterList">
                                <div class="database-item">
                                    <div class="item-name">
                                        <i class="icon db-icon"></i>
                                        {{check.databaseName}}
                                    </div>
                                    <span class="el-icon-circle-close" v-if="!check.children.length"
                                          @click="removeDatabase(check.databaseName)"></span>
                                </div>
                                <ul class="database-list dbList" v-if="check.children.length">
                                    <li v-for="item in check.children">
                                        <div class="database-item">
                                            <div class="item-name">
                                                <i class="icon table-icon"></i>
                                                {{item}}
                                            </div>
                                            <span class="el-icon-circle-close"
                                                  @click="removeTable(check.databaseName, item)"></span>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </section>
                </div>
                <el-row class="btn-row text-right">
                    <el-button type="primary" @click="submitForm" :loading="btnLoading">{{$t('content.common.bc')}}
                    </el-button>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {EmphasizeName} from 'mixins/common';
    import {achieveDbAndTable, selectedDbAndTable, updateDbAndTable} from '@/service/getData';

    export default {
        name: 'BlackList',
        props: {
            dataSource: Object
        },
        mixins: [EmphasizeName],
        async beforeRouteLeave(to, from, next) {
            if (!this.isEdited) {
                this.$confirm(this.$t('content.importExport.a22'), this.$t('content.common.tis'), {
                    confirmButtonText: this.$t('content.common.qd'),
                    cancelButtonText: this.$t('content.common.qx'),
                    customClass: 'answer-dialog'
                }).then(() => {
                    next();
                }).catch(() => {
                    next(false);
                });
            } else {
                next();
            }
        },
        data() {
            return {
                btnLoading: false,
                leftLoading: false,
                rightLoading: false,
                isEdited: false,
                checkList: [],
                type: true,
                treeData: [],
                form: {
                    id: this.$route.params.id,
                    keyword: '',
                    page: 1,
                    rows: 10,
                    database: ''
                }
            };
        },
        computed: {
            userInfo() {
                return this.$store.state.userInfo;
            },
            filterList() {
                let dataBase = [];
                this.checkList.forEach(item => {
                    const baseAndTable = item.split('/');
                    if (baseAndTable.length === 2) {
                        const index = dataBase.findIndex(base => base.databaseName === baseAndTable[0]);
                        if (index !== -1) {
                            dataBase[index].children.push(baseAndTable[1]);
                        } else {
                            dataBase.push({
                                databaseName: baseAndTable[0],
                                children: [baseAndTable[1]]
                            });
                        }
                    } else {
                        dataBase.push({
                            databaseName: item,
                            children: []
                        });
                    }
                });
                return dataBase;
            },
        },
        created() {
            this.fetchDatabaseData();
            this.fetchCheckList();
        },
        methods: {
            submitForm() {
                const {id} = this.form;
                const {filterList} = this;
                this.btnLoading = true;
                updateDbAndTable({
                    refId: id,
                    tables: this.filterList,
                    useWhiteList: this.type
                }).then(res => {
                    const {statusCode, message} = res.body;
                    if (statusCode === 200) {
                        this.$message({
                            message: this.$t('content.dataset.datasetDetail.tjcg'),
                            type: 'success'
                        });
                        this.btnLoading = false;
                        this.isEdited = true;
                        this.$router.push({
                            name: 'TaskList'
                        });
                    } else {
                        this.message(this.$t('content.dataset.importExport.hivemetastore'), 'error');
                    }
                });
            },
            removeDatabase(database) {
                this.checkList = this.checkList.filter(item => {
                    return item !== database;
                });
            },
            removeTable(database, table) {
                this.checkList = this.checkList.filter(item => {
                    return item !== `${database}/${table}`;
                });
            },
            toggle(row) {
                row.isExpand = !row.isExpand;
                if (!row.isLoadData) {
                    row.loading = true;
                    this.loadChildren(row).then(() => {
                        row.isLoadData = true;
                        row.loading = false;
                    });
                }
            },
            handleCheckedChange(row) {
                if (this.checkList.find(item => item === row.databaseName)) {
                    this.checkList = this.checkList.filter(item => {     //勾选库之后,库下已经选择的表,全部取消选择
                        return !item.includes(row.databaseName + '/');
                    });
                }
            },
            loadMore(row) {
                this.loadChildren(row);
            },
            loadChildren(row) {
                this.form.database = row.databaseName;
                return this.fetchTableData(row.page).then(res => {
                    const {statusCode, message} = res.body;
                    if (statusCode === 200) {
                        row.children = [...row.children, ...message.records];
                        row.isMore = message.hasNextPage;
                        row.page = ++row.page;
                        this.form.requestTime = message.extraParam.requestTime;
                    } else {
                        this.message(this.$t('content.dataset.importExport.hivemetastore'), 'error');
                    }
                });
            },
            fetchTableData(page) {
                const {keyword, rows, database, id} = this.form;
                return achieveDbAndTable({
                    keyword,
                    refId: id,
                    page,
                    rows,
                    database
                });
            },
            fetchCheckList() {
                const {id} = this.form;
                this.rightLoading = true;
                selectedDbAndTable(id).then(res => {
                    const {statusCode, message} = res.body;
                    if (statusCode === 200) {
                        message.tables.forEach(databse => {
                            if (databse.children.length) {
                                databse.children.forEach(table => {
                                    this.checkList.push(`${databse.databaseName}/${table}`);
                                });
                            } else {
                                this.checkList.push(databse.databaseName);
                            }
                        });
                        this.rightLoading = false;
                    }
                });
            },
            fetchDatabaseData() {
                const {keyword, id} = this.form;
                const params = {
                    keyword,
                    refId: id,
                    database: '',
                    page: 1,
                    rows: 10
                };
                this.leftLoading = true;
                achieveDbAndTable(params).then(res => {
                    const {statusCode, message} = res.body;
                    if (statusCode === 200) {
                        message.records.forEach(item => {
                            item.loading = false;
                            item.children = [];
                            item.isExpand = false;
                            item.isLoadData = false;
                            item.isMore = false;
                            item.page = 1;
                        });
                        this.treeData = message.records;
                        this.leftLoading = false;
                        this.type = message.extraParam.useWhiteList;
                    } else {
                        this.message(this.$t('content.dataset.importExport.hivemetastore'), 'error');
                    }
                });
            }
        }
    };
</script>


<style scoped lang="less">
    #insert-data {
        .table-title {
            margin: 0;
            padding: 0 0 12px;
            border-bottom: 1px solid #CCC;
        }
        .el-form {
            width: 80%;
            margin: 20px auto 0;
            .review-data {
                margin-left: 100px;
                text-decoration: underline;
            }
            .btn-row {
                margin-top: 20px;
            }
        }
    }
</style>
