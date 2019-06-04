<template>
    <div class="boxCommon permission-wrap" v-loading="loading">
        <template>
            <template v-if="records.length !== 0">
                <span class="permission__title">{{extraParam}} {{$t('content.dataset.datasetDetail.ydxqx')}}</span>
                <div class="table-container" v-for="(record, key) in records">
                    <div class="table-title" style="overflow: hidden;">
                        <div class="table-title__text">
                            <span>{{$t('content.common.xiangm')}}:{{record[0]['usedProject']}}
                            </span>
                        </div>
                    </div>
                    <ul class="permission-list">
                        <li v-for="(item, index) in record">
                             <span class="permission__user">{{ item.username}}
                                <small class="permission__user-small" v-if="item.account">
                                   (<span v-ellipsis:160="item.account"></span>)
                                </small>
                            </span>
                            <div class="permission__authority">
                                <i class="permission__icon"
                                   :class="{'permission__icon-r': item.type.includes('r')}">{{$t('content.authority.r')}}</i>
                                <i class="permission__icon"
                                   :class="{'permission__icon-w': item.type.includes('w')}">{{$t('content.authority.w')}}</i>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="tablePages">
                    <el-pagination background
                                   layout="total, prev, pager, next"
                                   @current-change="handleCurrentChange"
                                   :current-page="currentPage"
                                   :page-size="pageSize"
                                   :total="totalRows"
                                   v-if="totalRows>pageSize">
                    </el-pagination>
                </div>
            </template>
            <no-data v-else></no-data>
        </template>
    </div>
</template>
<script>
    export default {
        name: "DataPermission",
        data() {
            return {
                loading: true,
                currentPage: 1,
                pageSize: 20,
                totalRows: 0,
                extraParam: 0,//账号数
                records: []
            };
        },
        props: {
            tableId: {
                require: true
            }
        },
        watch: {
            '$route': function (val) {
                if (val.query.path) {
                    this.fetchData();
                }
            }
        },
        methods: {
            async fetchData(page = 1) {
                this.loading = true;
                const url = `/privilege/getAuthorizedAccounts?page=${page}&datasetId=${this.tableId}&rows=20&sort=usedProject&order=asc`;
                const res = await this.axios.get(url);
                this.loading = false;
                const {statusCode, message} = res.body;
                const records = message.records;
                const usedProjectIds = new Set();
                const newArray = {};

                records.forEach((record, index) => {
                    if (usedProjectIds.has(`${record.usedProjectId}-${record.usedProject}`)) {
                        newArray[`${record.usedProjectId}-${record.usedProject}`].push(record);
                    } else {
                        usedProjectIds.add(`${record.usedProjectId}-${record.usedProject}`);
                        newArray[`${record.usedProjectId}-${record.usedProject}`] = [record];
                    }
                });
                message.records = newArray;
                console.log(newArray);
                statusCode === 200 && Object.assign(this.$data, message);
            },
            handleCurrentChange(val) {
                this.fetchData(val);
            }
        },
        created() {
            this.fetchData();
        }
    };
</script>
<style lang="less">
    .permission-wrap {
        height: calc(~ '100% - 62px');
        margin-top: 20px;
        padding-top: 0;
    }
    .permission-list {
        overflow: hidden;
        li {
            overflow: hidden;
            float: left;
            width: 50%;
            height: 36px;
            border: 1px solid #DDD;
            line-height: 24px;
            padding: 5px 10px;
            &:nth-child(2n) {
                border-left: none;
            }
            &:nth-child(n+3) {
                border-top: none;
            }
        }
    }
    .table-container {
        margin-bottom: 20px;
    }
    .permission__title {
        display: block;
        color: #A5AAAC;
        margin: 5px 0 15px;
    }
    .permission__user {
        float: left;
    }
    .permission__user-small {
        color: #A5AAAC;
    }
    .permission__authority {
        float: right;
    }
    .permission__icon {
        display: inline-block;
        font-style: normal;
        width: 20px;
        height: 20px;
        background: #DADADA;
        color: #FFF;
        text-align: center;
        line-height: 20px;
        margin-right: 8px;
    }
    .permission__icon-r {
        background: #22B66F;
    }
    .permission__icon-w {
        background: #277DEA;
    }
</style>
