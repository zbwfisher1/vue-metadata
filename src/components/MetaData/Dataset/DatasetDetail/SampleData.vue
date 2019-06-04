<template>
    <div class="boxCommon sample-data">
        <div class="owner-table" v-loading="loading">
            <div v-if="type === 'HBASE'">
                <template v-if="tableData.length">
                    <el-table border :data="tableData" style="width: 100%">
                        <el-table-column prop='index' label='' fixed>
                            <template slot-scope="scope">
                                <div class="td1">{{$t("content.common.zj")}}:</div> <!--主键-->
                                <div class="td2"> {{scope.row.index[1]}}</div>
                            </template>
                        </el-table-column>
                        <template v-for="n in maxCellNum">
                            <el-table-column :prop='`a${n-1}`' label='' width="300">
                                <template slot-scope="scope">
                                    <div class="td1">{{scope.row[`a${n-1}`][0]}}</div>
                                    <div class="td2">{{scope.row[`a${n-1}`][1]}}</div>
                                </template>
                            </el-table-column>
                        </template>
                    </el-table>
                </template>
                <no-data v-else/>
            </div>
            <el-table v-else :data="tableSample" border style="width: 100%">
                <el-table-column
                        v-for="value in tableSampleKey"
                        :prop=value
                        :label=value>
                </el-table-column>
                <span slot="empty">
                        <template v-if="loading && tableSample.length === 0">
                            <loading :isloading="loading"/>
                        </template>
                        <no-data v-else/>
                    </span>
            </el-table>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                loading: true,
                tableSampleKey: {},
                tableSample: [],
                tableData: [],
                maxCellNum: 0
            };
        },
        props: ['tableId', 'type'],
        watch: {
            '$route': function (val) {
                if (val.query.path) {
                    this.fetchData();
                }
            }
        },
        created() {
            this.fetchData();
        },
        methods: {
            fetchData() {
                let _url = '/datasets/' + this.tableId + '/sample';
                this.loading = true;
                this.axios.get(_url).then(res => {
                    this.loading = false;

                    const {statusCode, message} = res.data;
                    if (statusCode === 200) {
                        const {maxCellNum, sample: sampleArray, columns} = message;
                        this.tableSample = sampleArray;
                        this.tableData = [];
                        this.maxCellNum = maxCellNum;
                        sampleArray.forEach((sample, i) => {
                            const sampleArray = Object.entries(sample);
                            let obj = {};

                            const index = sampleArray.findIndex(array => {
                                return array[0] === 'rowkey';
                            });
                            obj.index = sampleArray[index];
                            sampleArray.splice(index, 1);
                            for (let i = 0; i < maxCellNum; i++) {
                                obj[`a${i}`] = sampleArray[i] || [];
                            }
                            this.tableData[i] = obj;
                        });
                        this.tableSampleKey = columns;
                        this.tableSample.forEach((v) => {
                            for (var key in v) {
                                if (key === 'P1') {
                                    let valueArr = v[key].split('.');
                                    if (valueArr.length > 1 && valueArr[1] == 0) {
                                        v[key] = valueArr[0];
                                    }
                                }
                            }
                        });
                    } else {
                        this.tableData = [];
                        this.tableSample = [];
                    }
                });
            }
        }
    };
</script>
<style scope>
    .sample-data .tableList {
        table-layout: auto;
    }
    .owner-table {
        margin-top: 20px;
        min-height: 150px;
    }
    .td1 {
        text-align: center;
        margin: 0 -10px;
        line-height: 39px;
        height: 40px;
        border-bottom: 1px dashed #CCC;
    }
    .td2 {
        text-align: center;
        line-height: 40px;
        margin: 0 -10px;
        height: 40px;
    }
</style>
