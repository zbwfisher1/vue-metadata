<template>
    <el-dialog :title="$t('content.dataset.businessDetail.miaos')"
               :visible.sync="isShowingModal"
               :close-on-click-modal="false"
               custom-class="fullscreen-dialog"
               @open='getDomContent'
               width="60%">
        <div class="dialog-title" slot="title">
            {{$t('content.dataset.businessDetail.mss')}}
        </div>
        <div ref="editor" class="editor" v-html="txt"></div>
        <div slot="footer" class="dialog-footer" v-if="propEditPrivilege">
            <el-button @click="isShowingModal = false">
                {{$t('content.common.qx')}}
            </el-button>
            <el-button type="primary" @click="getContent" :loading="loading">
                {{$t('content.common.tjiao')}}
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {getRichText, submitRichText} from '@/service/getData';
    import E from 'wangeditor';
    import {mapState} from 'vuex';

    export default {
        name: 'TextDialog',
        props: ['dialogVisible', 'id'],
        watch: {
            dialogVisible: function(newValue) {
                this.isShowingModal = newValue;
            },
            isShowingModal: function(newValue) {
                //每当dialogVisible的值改变则发送事件update:dialogVisible , 并且把值传过去
                this.$emit('update:dialogVisible', newValue);
            },
            id: function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    this.fetchTextData();
                }
            }
        },
        computed: {
            ...mapState({
                table: 'fetchRouter',
                propEditPrivilege: 'propEditPrivilege'
            })
        },
        created() {
            window.wangEditor = {};
            window.wangEditor.fullscreen = {};
            window.wangEditor.fullscreen = {
                toggleFullscreen: function(editorSelector) {
                    $(editorSelector).toggleClass('fullscreen-editor');
                    $(editorSelector + ' ._wangEditor_btn_fullscreen').toggleClass('icon_restore');
                    if ($(editorSelector + ' ._wangEditor_btn_fullscreen').text() === '全屏') {
                        $(editorSelector + ' ._wangEditor_btn_fullscreen').text('退出全屏');
                    } else {
                        $(editorSelector + ' ._wangEditor_btn_fullscreen').text('全屏');
                    }
                }
            };
        },
        mounted() {
            this.fetchTextData();
        },
        data() {
            return {
                isShowingModal: this.dialogVisible,
                editorContent: '',
                editor: null,
                txt: '',
                loading: false
            };
        },
        methods: {
            init: function(editorSelector) {
                $(editorSelector + " .w-e-toolbar").append('<div class="w-e-menu"><i class="_wangEditor_btn_fullscreen icon_fullscreen" href="###" onclick="window.wangEditor.fullscreen.toggleFullscreen(\'' + editorSelector + '\')">全屏</i></div>');
            },
            fetchTextData() {
                getRichText(this.id).then(res => {
                    const txt = res.data.message.richDesc;
                    this.txt = txt;
                    this.$emit('update:hasValue', txt === '<p><br></p>' ? false : txt.length);
                });
            },
            getDomContent() {
                this.$nextTick(() => {
                    if (!this.editor) {
                        let editor = new E(this.$refs.editor);
                        this.editor = editor;
                        editor.customConfig.uploadImgTimeout = 300000;   //timeout 时间是 300 秒钟
                        // 自定义菜单配置

                        if (this.propEditPrivilege) {
                            editor.customConfig.menus = [
                                'head',  // 标题
                                'bold',  // 粗体
                                'fontSize',  // 字号
                                'fontName',  // 字体
                                'italic',  // 斜体
                                'underline',  // 下划线
                                'strikeThrough',  // 删除线
                                'foreColor',  // 文字颜色
                                'backColor',  // 背景颜色
                                'list',  // 列表
                                'justify',  // 对齐方式
                                'quote',  // 引用
                                'image',  // 插入图片
                                'table',  // 表格
                                'undo',  // 撤销
                                'redo'  // 重复
                            ];
                        } else {
                            editor.customConfig.menus = [];   //没有权限,就不能有编辑菜单
                        }
                        editor.customConfig.lang = {
                            '设置标题': 'title',
                            '正文': 'p',
                            '链接文字': 'link text',
                            '链接': 'link',
                            '上传图片': 'upload image',
                            '上传': 'upload',
                            '创建': 'init',
                            '字号': 'Font Size',
                            '字体': 'font',
                            '文字颜色': 'Text color',
                            '设置标题': 'Title',
                            '背景色': 'Background',
                            '设置列表': 'Settings List',
                            '有序列表': 'Ordered List',
                            '无序列表': 'Unordered List',
                            '对齐方式': 'Alignment',
                            '靠左': 'Left',
                            '靠右': 'Right',
                            '居中': 'Centered',
                            '插入表格': 'Insert Table',
                            '行': 'Row',
                            '列': 'Column',
                            '插入': 'Insert',
                            '的表格': '',
                            '编辑图片': 'Edit Image',
                            '最大宽度': 'Max Width',
                            '删除图片': 'Remove Image'
                        };
                        editor.customConfig.debug = true;
                        editor.customConfig.onchange = (html) => {
                            if (html === '<p><br></p>') {   //默认有这些字符串,表示内容已经为空了
                                this.editorContent = '';
                            } else {
                                this.editorContent = html;
                            }
                        };
                        editor.customConfig.uploadImgServer = `/datasets/${this.id}/uploadAttachments`;  // 上传图片到服务器
                        editor.customConfig.showLinkImg = false;   // 隐藏“网络图片”tab
                        editor.create();
                        this.init('.editor');
                        editor.$textElem.attr('contenteditable', this.propEditPrivilege);
                    } else {
                        if (this.propEditPrivilege) {
                            this.editor.customConfig.menus = [
                                'head',  // 标题
                                'bold',  // 粗体
                                'fontSize',  // 字号
                                'fontName',  // 字体
                                'italic',  // 斜体
                                'underline',  // 下划线
                                'strikeThrough',  // 删除线
                                'foreColor',  // 文字颜色
                                'backColor',  // 背景颜色
                                'list',  // 列表
                                'justify',  // 对齐方式
                                'quote',  // 引用
                                'image',  // 插入图片
                                'table',  // 表格
                                'undo',  // 撤销
                                'redo'  // 重复
                            ];
                        } else {
                            this.editor.customConfig.menus = [];   //没有权限,就不能有编辑菜单
                        }
                        this.$refs.editor.innerHTML = this.txt;
                        this.editor.create();
                        this.init('.editor');
                        this.editor.$textElem.attr('contenteditable', this.propEditPrivilege);
                    }
                });
            },
            getContent: function() {
                this.loading = true;
                this.editor.$textElem.attr('contenteditable', true);  // 禁用编辑功能
                submitRichText(this.id, this.editor.txt.html()).then(res => {
                    const {statusCode} = res.data;
                    this.loading = false;
                    if (statusCode === 200) {
                        this.isShowingModal = false;
                        this.$message({
                            message: this.$t('content.common.bccg'), //'保存成功',
                            type: 'success'
                        });
                        this.fetchTextData();
                    }
                }).catch(res => this.loading = false);
            }
        }
    };
</script>

<style lang="less">
    @imagesUrl: '../../../../../assets/images';
    .title-compare {
        margin: 15px 0 5px;
    }
    .same {
        margin: 10px 0;
    }
    .compare {
        .el-dialog__body {
            min-height: 200px;
            .table-wrapper {
                overflow: auto;
                height: 300px;
                .commom-overflow {
                    width: 100%;
                }
                .b {
                    font-size: 16px;
                }
            }
        }
    }
    /*富文本编辑器wangEditor的全屏*/
    .editor {
        white-space: normal;
        ul {
            list-style: disc;
        }
        ol {
            list-style: decimal;
        }
    }
    .w-e-toolbar {
        flex-wrap: wrap;
        -webkit-box-lines: multiple;
    }
    .w-e-toolbar .w-e-menu:hover {
        z-index: 10002 !important;
    }
    .w-e-menu a {
        text-decoration: none;
    }
    .fullscreen-editor {
        position: fixed !important;
        width: 100% !important;
        height: 100% !important;
        left: 0px !important;
        top: 0px !important;
        background-color: white;
        z-index: 9999;
    }
    .fullscreen-editor .w-e-text-container {
        width: 100% !important;
        height: 95% !important;
    }
    ._wangEditor_btn_fullscreen {
        width: 18px;
        height: 20px;
        display: inline-block;
        background: url("@{imagesUrl}/icon_zoom.png") no-repeat;
        text-indent: -9999px;
        vertical-align: text-top;
        &.icon_fullscreen {
            background-position: 0 0;
            &:hover {
                background-position: -18px 0;
            }
        }
        &.icon_restore {
            background-position: -36px 0;
            &:hover {
                background-position: -54px 0;
            }
        }
    }
</style>
