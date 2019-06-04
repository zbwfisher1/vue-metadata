<template>
    <div class="tag-detail">
        <h6>{{$t('content.personal.mqms')}}
            <i class="el-icon-edit" @click="editDesc" v-if="hasPrivilege"></i>
        </h6>
        <div class="desc" v-show="!editing">
            {{tagDetail.desc || $t('content.personal.myms')}} <!--没有描述,请点击图标添加-->
        </div>
        <el-input type="textarea"
                  ref="textarea"
                  v-show="editing"
                  :autosize="{ minRows: 4, maxRows: 8}"
                  :placeholder="$t('content.personal.qsr200')"
                  @blur="submit"
                  v-loading="btnLoading"
                  v-model="desc">  <!--请输入你的标签描述信息 (限200个字符以内)-->
        </el-input>
        <div class="item-validator">
            <span v-if="errorTip">{{$t('content.personal.bcg200')}}</span>
        </div>
        <el-table :data="tableData" v-loading="loading" border>
            <el-table-column prop="datasetName" :label="$t('content.personal.gldxm')"></el-table-column>
            <!--关联对象名-->
            <el-table-column prop="urn" :label="$t('content.files.a8')"></el-table-column>  <!--存储路径-->
            <el-table-column prop="creator" :label="$t('content.dataset.importExport.czr')"></el-table-column>
            <!--操作人-->
            <el-table-column prop="createDate" :label="$t('content.personal.glsj')"> <!--关联时间-->
                <template slot-scope="scope">
                    {{formatTime(scope.row.createDate)}}
                </template>
            </el-table-column>
        </el-table>
        <div class="tablePages">
            <el-pagination background
                           layout="total, prev, pager, next"
                           @current-change="handleCurrentChange"
                           :current-page="currentPage"
                           :page-size="rows"
                           :total="totalRows"
                           v-if="totalRows > rows">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import {textFieldLength} from '@/config/env';
    import {FormatTime} from 'mixins/common';
    import {
        getTagDetail,
        getTagListDetail,
        removeTagGroup,
        createTag,
        checkPermission
    } from '@/service/getData';

    export default {
        mixins: [FormatTime],
        props: ['id', 'visible'],
        watch: {
            visible(newval, oldval) {
                if (newval) {
                    this.fetchTag();
                    this.fetchData();
                    checkPermission('/tag/createOrUpdate', 'post').then(res => {
                        this.hasPrivilege = res.data.statusCode === 200;
                    });
                } else {
                    this.errorTip = false;
                    this.editing = false;
                }
            },
            editing(newval) {
                if (newval) {
                    setTimeout(() => {
                        this.$refs.textarea.focus();
                    }, 0);
                }
            }
        },
        data() {
            return {
                hasPrivilege: false,
                errorTip: false,
                editing: false,
                desc: '',
                dialogVisible: false,
                btnLoading: false,
                currentRow: {},
                tagDetail: {},
                loading: true,
                tableData: [],
                name: '',   //搜索关键字
                rows: 10, //每页数量
                order: '', //排序字段
                sort: '',   //asc或desc
                currentPage: 1,   //当前页
                totalRows: 0,     //总记录数
                totalPages: 0    //总页数
            };
        },
        created() {
            this.fetchTag();
            this.fetchData();
            checkPermission('/tag/createOrUpdate', 'post').then(res => {
                this.hasPrivilege = res.data.statusCode === 200;
            });
        },
        methods: {
            submit() {
                const {name, desc: oldDesc} = this.tagDetail;
                const {id, desc} = this;
                if (oldDesc !== desc) {
                    if (desc.length > 200) {
                        this.errorTip = true;
                    } else {
                        this.btnLoading = true;
                        createTag(id, name, desc).then(res => {
                            const {statusCode, message} = res.data;
                            this.btnLoading = false;
                            if (statusCode === 200) {
                                this.$message({
                                    message: this.$t('content.personal.msgxcg'),   //描述更新成功
                                    type: 'success'
                                });
                                this.editing = false;
                                this.tagDetail.desc = desc;
                            }
                        });
                    }
                } else {
                    this.editing = false;
                }
            },
            editDesc() {
                this.desc = this.tagDetail.desc;
                this.editing = true;
            },
            cancelGroup() {
                this.btnLoading = true;
                removeTagGroup(this.id, this.currentRow.datasetId).then(res => {
                    const {statusCode, message} = res.data;
                    this.btnLoading = false;
                    if (statusCode === 200) {
                        this.$message({
                            message: this.$t('content.personal.qxglcg'),   //取消关联成功
                            type: 'success'
                        });
                        this.dialogVisible = false;
                        this.fetchData();
                    }
                });
            },
            handleClick(row) {
                this.currentRow = row;
                this.dialogVisible = true;
            },
            fetchTag() {
                getTagDetail(this.id).then(res => {
                    const {statusCode, message} = res.data;
                    if (statusCode === 200) {
                        this.tagDetail = message;
                    }
                });
            },
            fetchData() {
                const {rows, currentPage: page, order, sort, id, name} = this;

                this.loading = true;
                getTagListDetail(id, {
                    rows,
                    page,
                    order,
                    sort,
                    name
                }).then(res => {
                    const {statusCode, message} = res.data;
                    this.loading = false;
                    if (statusCode === 200) {
                        const {records, currentPage, totalPages, totalRows} = message;
                        this.tableData = records;
                        this.totalPages = totalPages;
                        this.totalRows = totalRows;
                    }
                });
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.fetchData();
            }
        }
    };
</script>

<style scoped lang="less">
    .tag-title {
        display: flex;
        align-content: center;
        margin-bottom: 20px;
        .title {
            line-height: 35px;
            margin: 0;
        }
        .tag-info {
            margin-left: 20px;
            li {
                float: left;
                margin-right: 20px;
                line-height: 35px;
                color: #B5B5B5;
            }
        }
    }
    .tag-detail {
        h6 {
            margin: 0 0 10px;
            font-size: 14px;
            font-weight: bold;
        }
        .el-icon-edit {
            font-size: 14px;
            margin-left: 10px;
            color: #001CC0;
            cursor: pointer;
        }
        .desc {
            color: #959595;
        }
        .el-textarea {
            margin-bottom: 10px;
        }
        .item-validator {
            margin: 10px 0;
        }
    }
</style>
