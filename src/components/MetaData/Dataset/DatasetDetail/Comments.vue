<template>
    <div class="boxCommon" id="tab-comments">
        <div class="addContainer" v-loading="loading">
            <div class="addContainer-add">
                <a class="addContainer-btn" href="javascript:;" @click="addComment">
                    <i class="addContainer-img"></i>{{$t("content.dataset.datasetDetail.tjzsxx")}}
                </a>
            </div>
            <div class="con" v-if="tableComment.totalRows > 0">
                <div class="comment" v-for="(item,key) in tableComment.records">
                    <div class="row">
                        <div class="col-sm-12">
                            <i :class="nameObj[item.type].icon"></i>
                            <h5>{{nameObj[item.type].text}}&nbsp;<small :class="[item.modified]">
                                ({{item.modified}})
                            </small>
                            </h5>
                            <p class="commentTxt">{{item.comment}}</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="editWrapper">
                                <div class="editComment">
                                    <a v-if="item.editable == 1"
                                       href="javascript:;"
                                       class="operate"
                                       @click="editComment(item.id, item.type, item.comment)"
                                       title="编辑">
                                        <span class="icon-pencil"></span>
                                        &nbsp;{{$t("content.common.bj")}}
                                    </a>
                                    &nbsp;&nbsp;
                                    <a v-if="item.deletable == 1"
                                       href="javascript:;"
                                       class="operate setting-con__toolBar"
                                       @click="showDelComment(item.id)"
                                       title="删除">
                                        <span class="glyphicon glyphicon-trash"></span>
                                        &nbsp;{{$t("content.common.sc")}}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tablePages" v-if="tableComment.totalRows !== 0">
                <el-pagination background
                               layout="total, prev, pager, next"
                               @size-change="handleSizeChange"
                               @current-change="handleCurrentChange"
                               :current-page="tableComment.currentPage"
                               :page-size="tableComment.pageSize"
                               :total="tableComment.totalRows"
                               v-if="tableComment.totalRows>tableComment.pageSize">
                </el-pagination>
                <!-- {{tableComment.totalPages}} -->
            </div>
            <no-data v-else></no-data>
        </div>
        <el-dialog
                :title="$t(dialogCommentTitle)"
                :visible.sync="dialogCommentVisible"
                custom-class="dialogComment"
                :close-on-click-modal="false">
            <el-form ref="commentForm" :model="commentForm" :rules="commentRoles">
                <el-form-item prop="commentType" style="margin-bottom: 10px;">
                    <el-select v-model="commentForm.commentType"
                               :placeholder="$tc('content.dataset.datasetDetail.qxzzs', 1)"
                               style="width: 200px;">
                        <el-option
                                v-for="option in commentTypeOpts"
                                :label="option.label"
                                :value="option.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="commentText">
                    <el-input type="textarea"
                              style="margin: 5px 0;"
                              v-model="commentForm.commentText"
                              :rows='7'
                              :maxlength="500"
                              :placeholder="$tc('content.dataset.datasetDetail.qxzzs', 2)"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
						<el-button @click.native="dialogCommentVisible = false">
							{{$t("content.common.qx")}}
						</el-button>
						<el-button :disabled="isDisable" type="primary"
                                   @click.native="dialogCommentSubmit('commentForm')">
							{{$t("content.common.qd")}}
						</el-button>
					</span>
        </el-dialog>
        <el-dialog
                :title="$t('content.common.czts')"
                :visible.sync="confirmVisible"
                custom-class="dialogComment"
                :close-on-click-modal="false">
            {{$t('content.dataset.datasetDetail.qrscgzsm')}}
            <span slot="footer" class="dialog-footer">
						<el-button @click.native="confirmVisible = false">
							{{$t("content.common.qx")}}
						</el-button>
						<el-button :disabled="isDisable" type="primary" @click.native="delComment()">
							{{$t("content.common.qd")}}
						</el-button>
					</span>
        </el-dialog>
    </div>
</template>
<script>
    import {
        Message,
        resetValidators,
        testPrivilege
    } from 'mixins/common';
    import Bus from 'utils/bus';

    export default {
        name: "comments",
        mixins: [Message, resetValidators, testPrivilege],
        data () {
            return {
                loading: true,
                tableComment: {
                    totalRows: 0
                },
                dialogCommentTitle: "content.dataset.datasetDetail.tjzs",   //添加注释
                dialogCommentVisible: false,
                isDisable: false,
                confirmVisible: false,
                commentId: "",
                commentForm: {
                    commentType: '',
                    commentText: ''
                },
                commentRoles: {
                    commentType: [
                        // { required: true, message: '请选择注释类型', trigger: 'change'}
                        {required: true, message: this.$tc('content.dataset.datasetDetail.qxzzs', 1), trigger: 'change'}
                    ],
                    commentText: [
                        {required: true, message: this.$tc('content.dataset.datasetDetail.qxzzs', 2), trigger: 'blur'},
                        {max: 500, message: this.$t('content.validator.cdbdcg', [500]), trigger: 'blur'}
                    ]
                },
                commentTypeOpts: [
                    {
                        value: 'ParamsInfo',
                        label: this.$t('content.dataset.datasetDetail.sxxxwt')
                    },
                    {
                        value: 'FieldsDes',
                        label: this.$t('content.dataset.datasetDetail.zdxxwt')
                    },
                    {
                        value: 'Other',
                        label: this.$t('content.dataset.datasetDetail.qita')
                    }
                ],
                nameObj: {
                    // "Example": {text:this.$t('content.dataset.datasetDetail.yyjl'),icon:'icon icon_app'},
                    // "Scene": {text:this.$t('content.dataset.datasetDetail.sycj'),icon:'icon icon_usage'},
                    // "Description": {text:this.$t("content.dataset.datasetDetail.ms"),icon:'icon icon_description'},
                    // "DQ Issue": {text:this.$t("content.dataset.datasetDetail.sjzlwt"),icon:'icon icon_quality'},

                    "Example": {text: this.$t('content.dataset.datasetDetail.qita'), icon: 'icon icon_quality'},
                    "Scene": {text: this.$t('content.dataset.datasetDetail.qita'), icon: 'icon icon_quality'},
                    "Description": {text: this.$t('content.dataset.datasetDetail.qita'), icon: 'icon icon_quality'},
                    "DQ Issue": {text: this.$t('content.dataset.datasetDetail.qita'), icon: 'icon icon_quality'},

                    "ParamsInfo": {text: this.$t('content.dataset.datasetDetail.sxxxwt'), icon: 'icon icon_app'},
                    "FieldsDes": {text: this.$t('content.dataset.datasetDetail.zdxxwt'), icon: 'icon icon_usage'},
                    "Other": {text: this.$t('content.dataset.datasetDetail.qita'), icon: 'icon icon_quality'}
                }
            };
        },
        props: ['tableId'],
        watch: {
            '$route': function (val) {
                if (val.query.path) {
                    // this.testPrivilege(`/datasets/${this.tableId}/comments`);
                    this.fetchData();
                }
            }
        },
        created () {
            // this.testPrivilege(`/datasets/${this.tableId}/comments`);
            Bus.$on('fetchComment', () => {
                this.fetchData();
            });
            this.fetchData();
        },
        methods: {
            showDelComment (id) {
                this.confirmVisible = true;
                this.commentId = id;
            },
            fetchData ({...arg}) {
                let page = 1;
                if (arg.page) {
                    page = arg.page;
                }
                this.loading = true;
                let _url = '/datasets/' + this.tableId + '/comments?rows=10&page=' + page + '&t=' + new Date().getTime();
                let _param = {
                    refId: this.tableId,
                    text: this.commentForm.commentText,
                    type: this.commentForm.commentType
                };
                this.axios.get(_url).then(response => {
                    this.loading = false;
                    if (response.body.statusCode === 200) {
                        const messageContent = [this.$t('content.common.tj'), this.$t('content.common.xg')][_param['id'] ? 1 : 0] + this.$t('content.common.chengg');
                        if (arg.isSubmit) {
                            this.message(`${messageContent}!`, "success");
                        }
                        this.tableComment = response.body.message;
                    }
                });
            },
            addComment () {
                this.dialogCommentVisible = true;
                this.resetValidators('commentForm');
                this.commentId = '';
                this.commentForm.commentType = '';
                this.commentForm.commentText = '';
                this.dialogCommentTitle = this.$t('content.dataset.datasetDetail.tjzs');
            },//添加注释信息
            editComment (id, type, text) {
                this.resetValidators('commentForm');
                this.commentId = id;
                this.commentForm.commentType = type;
                this.commentForm.commentText = text;
                this.dialogCommentVisible = true;
                this.dialogCommentTitle = this.$t('content.dataset.datasetDetail.bjzs');
            },//修改注释信息
            delComment () {
                this.confirmVisible = false;
                const id = this.commentId;
                const vm = this;
                vm.axios.delete('/datasets/' + vm.tableId + '/comments/' + id).then((res) => {

                    if (res.body.statusCode === 200) {
                        this.message(`${this.$t('content.common.sc')}${this.$t('content.common.chengg')}!`, "success");
                        this.fetchData();
                    } else {
                        this.message(`${this.$t('content.common.sc')}${this.$t('content.common.shib')}!`, "error");
                    }
                });
            },
            dialogCommentSubmit (formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        return;
                    }
                    this.isDisable = true;
                    let _url = '/datasets/' + this.tableId + '/comments';
                    let _param = {
                        refId: this.tableId,
                        text: this.commentForm.commentText,
                        type: this.commentForm.commentType
                    };
                    if (this.commentId !== '') {
                        _param['id'] = this.commentId;
                    }
                    this.axios({
                        method: "POST",
                        url: _url,
                        params: _param,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(res => {
                        this.isDisable = false;
                        this.commentForm.commentText = '';

                        this.commentForm.commentType = '';
                        if (res.body.statusCode !== 200) {
                            const messageContent = res.body.message ||
                                    ([this.$t('content.commont.tj'), this.$t('content.common.xg')][_param['id'] ? 1 : 0] + `${this.$t('content.common.shib')}!`);
                            this.message(`${messageContent}!`, "error");
                        } else {
                            this.dialogCommentVisible = false;
                            this.fetchData({isSubmit: true});
                        }
                    });
                });
            },//提交
            handleSizeChange (val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange (val) {
                this.fetchData({page: val});
            }
        }
    };
</script>
<style media="screen" lang="less">
    .operate .setting-icon__delect {
        margin: 0;
    }
    .operate:hover {
        text-decoration: none;
    }
    .setting-con__toolBar span {
        color: #014B70;
    }
    .setting-con__toolBar:hover span {
        color: #F00;
    }
    #tab-comments {
        .commentTxt {
            word-wrap:break-word
        }
    }
</style>
