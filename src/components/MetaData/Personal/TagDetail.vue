<template>
    <div class="boxCommon">
        <div class="tag-title">
            <h2 class="title">{{tagDetail.name}}</h2>
            <ul class="tag-info">
                <li>
                    创建时间: {{formatTime(tagDetail.createDate)}}
                </li>
                <li>
                    创建人: {{tagDetail.creator}}
                </li>
                <li>
                    描述: {{tagDetail.desc}}
                </li>
            </ul>
        </div>

        <div class="table-title">
            <div class="table-title__text">
                <span>{{$t('content.personal.gldx')}}</span>
            </div>
        </div>

        <el-table :data="tableData" v-loading="loading" border>
            <el-table-column prop="datasetName" label="实体名"></el-table-column>
            <el-table-column prop="urn" label="URL"></el-table-column>
            <el-table-column prop="creator" label="操作人"></el-table-column>
            <el-table-column prop="createDate" label="关联时间">
                <template slot-scope="scope">
                    {{formatTime(scope.row.createDate)}}
                </template>
            </el-table-column>
            <el-table-column prop="" :label="$t('content.dataset.datasetDetail.cz')">
                <template slot-scope="scope">
                    <div class="el-icon-wrapper">
                        <el-tooltip effect="dark" :content="$t('content.tags.qxgl')" placement="top">
                            <i class="glyphicon glyphicon-random" @click="handleClick(scope.row)"></i>
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
                           :page-size="rows"
                           :total="totalRows"
                           v-if="totalRows > rows">
            </el-pagination>
        </div>

        <!--取消关联确认弹出框-->
        <el-dialog :title="$t('content.personal.a33')" :close-on-click-modal="false" width="400px"
                   :visible.sync="dialogVisible">  <!--取消关联-->
            <div class="del-content">
                {{$t('content.personal.a32', [tagDetail.name, currentRow.datasetName])}}?
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">
                    {{$t('content.common.qx')}}
                </el-button>
                <el-button type="primary" :loading="btnLoading" @click="cancelGroup">
                    {{$t('content.common.qd')}}
                </el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import {textFieldLength} from '@/config/env';
    import {FormatTime} from 'mixins/common';
    import {
        getTagDetail,
        getTagListDetail,
        deleteTag,
        removeTagGroup
    } from '@/service/getData';

    export default {
        mixins: [FormatTime],
        data () {
            return {

                dialogVisible: false,
                btnLoading: false,
                currentRow: {},
                id: this.$route.params.id,
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
        created () {
            this.fetchTag();
            this.fetchData();
        },
        methods: {
            cancelGroup () {
                this.btnLoading = true;
                removeTagGroup(this.id, this.currentRow.datasetId).then(res => {
                    const {statusCode, message} = res.data;
                    this.btnLoading = false;
                    if (statusCode === 200) {
                        this.$message({
                            message: '取消关联成功',
                            type: 'success'
                        });
                        this.dialogVisible = false;
                        this.fetchData();
                    }
                });
            },
            handleClick (row) {
                this.currentRow = row;
                this.dialogVisible = true;
            },
            fetchTag () {
                getTagDetail(this.id).then(res => {
                    const {statusCode, message} = res.data;
                    if (statusCode === 200) {
                        this.tagDetail = message;
                    }
                });
            },
            fetchData () {
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
            handleCurrentChange (val) {
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

</style>
