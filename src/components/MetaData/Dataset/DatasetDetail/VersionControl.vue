<template>
    <div class="boxCommon">
        <el-row>
            <el-button size="mini">当前元数据对比</el-button>
            <el-button size="mini">历史版本对比</el-button>
            <el-button size="mini" icon="el-icon-plus" @click="dialogVisible = true">新建版本</el-button>
        </el-row>
        <el-table :data="tableData3" border style="width: 100%">
            <el-table-column
                    prop="date"
                    label="日期"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="姓名"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="address"
                    label="地址">
            </el-table-column>
        </el-table>
        <div class="tablePages">
            <el-pagination background
                           layout="total, prev, pager, next"
                           @current-change="handleCurrentChange"
                           :current-page="currentPage"
                           :page-size="pageSize"
                           :total="totalRows"
                           v-if="totalRows>10">
            </el-pagination>
        </div>
        <el-dialog title="新建元数据版本"
                   :visible.sync="dialogVisible"
                   custom-class="dialogWrapper"
                   :close-on-click-modal="false">
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
                <el-form-item label="版本编号:" prop="number">
                    <el-input v-model="ruleForm.number" placeholder="版本号不可重复"></el-input>
                </el-form-item>
                <el-form-item label="版本描述:" prop="description">
                    <el-input type="textarea"
                              placeholder="版本描述可填写版本主要修改"
                              :autosize="{ minRows: 4, maxRows: 6}"
                              v-model="ruleForm.description"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="dialogVisible = false">
                    {{$t("content.common.qx")}}
                </el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">
                    {{$t("content.common.qd")}}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {currentLang} from '@/service/getData';

    export default {
        data () {
            return {
                currentPage: 1,
                pageSize: 10,
                totalRows: 100,
                tableData3: [{
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-08',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-06',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-07',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }],
                ruleForm: {
                    number: '',
                    description: ''
                },
                rules: {
                    number: [
                        {required: true, message: '请输入版本编号', trigger: 'change'}
                    ],
                    description: [
                        {required: true, message: '请输入版本描述', trigger: 'change'}
                    ]
                },
                dialogVisible: false
            };
        },
        methods: {
            handleCurrentChange (val) {
                this.currentPage = val;
            },
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    };
</script>
<style lang="less">
    .dialogWrapper {
        width: 500px;
        .el-form-item {
            margin-bottom: 20px;
            .el-textarea {
                margin-bottom: 5px;
            }
        }
    }
</style>
