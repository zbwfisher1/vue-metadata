<template>
    <div class="wrapper">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
            <div class="table-title">
                <div class="table-title__text">
                    <span>{{$t('content.importExport.a1')}}<!--路径设置--></span>
                    <span class="tip">{{$t('content.importExport.a2')}}<!--建议选择的导入路径中单个文件夹下文件数不超过10W--></span>
                </div>
            </div>
            <el-form-item :label="$t('content.importExport.a3')" prop="path" label-width="150px"> <!--指定路径-->
                <el-input v-model="ruleForm.path"
                          :placeholder="$t('content.importExport.a9')"></el-input> <!--例如:myhdfs/root-->
            </el-form-item>
            <el-form-item :label="$t('content.importExport.a4')" prop="scanDepth" label-width="150px"><!--导入导数-->
                <el-input v-model.number="ruleForm.scanDepth"
                          :placeholder="$t('content.importExport.a10')"></el-input> <!--导数设置不超过10-->
            </el-form-item>

            <el-form-item :label="$t('content.importExport.a5')" prop="useWhiteList" label-width="150px"><!--黑白名单-->
                <el-radio-group v-model="ruleForm.useWhiteList" :disabled="userInfo.roles !== 'leapid.admin'">
                    <el-radio :label="false">{{$t('content.importExport.a6')}}</el-radio><!--黑名单-->
                    <el-radio :label="true">{{$t('content.importExport.a7')}}</el-radio><!--白名单-->
                </el-radio-group>
            </el-form-item>
            <el-form-item label="" prop="filterPaths" label-width="150px">
                <el-input type="textarea" :rows="6"
                          :placeholder="$t('content.importExport.a11')"
                          v-model="ruleForm.filterPaths"></el-input>  <!--输入多个路径时使用","隔开-->
            </el-form-item>

            <div class="table-title">
                <div class="table-title__text">
                    <span>{{$t('content.importExport.a8')}}</span><!--文件类型-->
                    <span class="tip">{{$t('content.importExport.a21')}}</span> <!--按照文件后缀名区分文件类型-->
                </div>
            </div>
            <el-form-item :label="$t('content.importExport.a5')"
                          label-width="150px"
                          prop="fileTypeUseWhiteList"><!--黑白名单-->
                <el-radio-group v-model="ruleForm.fileTypeUseWhiteList" :disabled="userInfo.roles !== 'leapid.admin'">
                    <el-radio :label="false">{{$t('content.importExport.a6')}}<!--黑名单--></el-radio>
                    <el-radio :label="true">{{$t('content.importExport.a7')}}<!--白名单--></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="" prop="filterTypes" label-width="150px">
                <el-input type="textarea" :rows="6"
                          :placeholder="$t('content.importExport.a12')"
                          v-model="ruleForm.filterTypes"></el-input>
                <!--不区分大小写且不同文件类型直接用","隔开-->
            </el-form-item>
            <el-form-item label-width="150px" class="text-right">
                <el-button @click="$emit('previous-step')">{{$t('content.common.syb')}}</el-button><!--上一步-->
                <el-button @click="submitForm('handle')">{{$t('content.import.bcbzx')}}<!--保存并执行--></el-button>
                <el-button @click="submitForm" type="primary" :loading="loading">
                    {{$t('content.common.bc')}}
                </el-button>
                <!--保存-->
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    export default {
        props: {
            form: Object
        },
        data() {
            return {
                loading: false,
                ruleForm: {
                    path: '',
                    scanDepth: '',
                    useWhiteList: false,
                    filterPaths: '',
                    fileTypeUseWhiteList: false,
                    filterTypes: ''
                },
                rules: {
                    path: [
                        {required: true, message: this.$t('content.importExport.a13'), trigger: 'blur'}, /*请输入指定路径*/
                        {
                            min: 1,
                            max: 50,
                            message: this.$t('content.importExport.a14'),
                            trigger: 'blur'
                        }  /*长度在 1 到 50 个字符*/
                    ],
                    scanDepth: [
                        {required: true, message: this.$t('content.importExport.a15'), trigger: 'blur'}, /*导入层数不能为空*/
                        {
                            type: 'number',
                            min: 1,
                            max: 10,
                            message: this.$t('content.importExport.a16'),
                            trigger: 'blur'
                        } /*导入层数必须为数字值且不超过10层*/
                    ],
                    useWhiteList: [
                        {required: true, message: this.$t('content.importExport.a17'), trigger: 'blur'} /*请选择黑白名单*/
                    ],
                    filterPaths: [
                        {message: this.$t('content.importExport.a18'), trigger: 'blur'} /*请填写*/
                    ],
                    fileTypeUseWhiteList: [
                        {required: true, message: this.$t('content.importExport.a17'), trigger: 'blur'} /*请选择黑白名单*/
                    ],
                    filterTypes: [
                        {message: this.$t('content.importExport.a18'), trigger: 'blur'}  /*请填写*/
                    ]
                }
            };
        },
        computed: {
            userInfo() {
                return this.$store.state.userInfo;
            }
        },
        created() {
            if (this.$route.params.id) {   //在编辑状态
                const {path, scanDepth, useWhiteList, filterPaths, fileTypeUseWhiteList, filterTypes} = this.form;
                this.ruleForm = {
                    path,
                    scanDepth,
                    useWhiteList,
                    filterPaths,
                    fileTypeUseWhiteList,
                    filterTypes
                };
            }
        },
        methods: {
            submitForm(action) {
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        if (action === 'handle') {
                            this.$emit('submit-data', Object.assign({}, this.ruleForm, {
                                scheduleOnce: true
                            }));
                        } else {
                            this.$emit('submit-data', this.ruleForm);
                        }

                    } else {
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs.ruleForm.resetFields();
            }
        }
    };
</script>
<style lang="less">
    .wrapper {
        width: 800px;
        margin: 50px auto 0;
        .tip {
            margin-left: 10px;
            color: #9E9E9E;
        }
        .el-form-item {
            margin-bottom: 15px;
        }
    }
</style>
