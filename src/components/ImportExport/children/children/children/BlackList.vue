<template>
    <div class="config-blacklist" id="config-blacklist">
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
                <section class="black-list-left" v-loading="leftLoading">
                    <div class="tree-search">
                        <div class="el-input">
                            <input type="text"
                                   v-model="form.keyword"
                                   @keyup.enter="fetchDatabaseData"
                                   :placeholder="$t('content.import.czbm')"
                                   class="el-input__inner"/>
                        </div>
                        <i class="el-icon-search" @click="fetchDatabaseData"></i>
                    </div>
                    <div class="black-tree-container dbList tree-wrap">
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
                                                <!-- 加载更多-->
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
                    <ul class="database-list dbList tree-wrap">
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
            <el-row class="config-blacklist">
                <el-button @click="$emit('previous-step')">{{$t('content.common.syb')}}<!--上一步--></el-button>
                <el-button @click="submitAndHandle">{{$t('content.import.bcbzx')}}<!--保存并执行--></el-button>
                <el-button type="primary" @click="submitForm">{{$t('content.common.bc')}}<!--保存--></el-button>
            </el-row>
        </el-form>
    </div>
</template>
<script>
    import {EmphasizeName} from 'mixins/common';
    import {getBlackAndWhiteList} from '@/service/getData';

    export default {
        name: 'BlackList',
        props: {
            dataSource: Object
        },
        mixins: [EmphasizeName],
        data() {
            return {
                leftLoading: false,
                checkList: [],
                type: true,
                treeData: [],
                form: {
                    keyword: '',
                    page: 1,
                    rows: 10,
                    database: '',
                    requestTime: 0
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
        },
        methods: {
            submitForm() {
                this.$emit('submit-data', {
                    useWhiteList: this.type,
                    tables: this.filterList,
                    requestTime: this.form.requestTime
                });
            },
            submitAndHandle() {
                this.$emit('submit-data', {
                    useWhiteList: this.type,
                    tables: this.filterList,
                    requestTime: this.form.requestTime,
                    scheduleOnce: true
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
                const {keyword, rows, database, requestTime} = this.form;
                return getBlackAndWhiteList({
                    keyword,
                    refId: null,
                    dataSource: this.dataSource,
                    page,
                    rows,
                    database,
                    requestTime
                });
            },
            fetchDatabaseData() {
                const params = {
                    keyword: this.form.keyword,
                    refId: null,
                    dataSource: this.dataSource,
                    database: '',
                    page: 1,
                    rows: 10,
                    requestTime: 0
                };
                this.leftLoading = true;
                getBlackAndWhiteList(params).then(res => {
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
                        this.form.requestTime = message.extraParam.requestTime;
                    } else {
                        this.message(this.$t('content.dataset.importExport.hivemetastore'), 'error');
                    }
                });
            }
        }
    };
</script>
<style lang="less">
    #config-blacklist {
        .config-blacklist {
            margin-top: 12px;
        }
    }
</style>
