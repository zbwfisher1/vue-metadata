<template>
    <div class="dialog-body-wrap" id="export-tree">
        <div class="businessCheckBox" v-loading="loading">
            <div class="addtheme-searchWrap">
                <input type="text"
                       :placeholder="$t('content.dataset.businessDetail.zcdggjz')"
                       v-model="keyword"
                       @keyup.enter="treeSearch">
                <button class="search-button" @click="treeSearch">
                    <span class="el-icon-search"></span>
                </button>
            </div>
            <template v-if="!isSearching && isOpen">
                <el-tree :props="defaultProps"
                         @check="checkClick"
                         :load="loadNode"
                         show-checkbox
                         node-key="id"
                         lazy
                         ref="tree">
                    <div class="custom-tree-node" slot-scope="{ node, data }"
                         :class="{'root-node': data.id === -1}">
                        <span v-html="emphasizeName(node.label, cacheKeyword)"></span>
                    </div>
                </el-tree>
            </template>
            <div class="import-validator">
                <span v-if="validatorShow">{{$t('content.validator.zsxzyx')}}</span>
            </div>
        </div>
        <div class="dialog-footer">
            <el-button type="primary" :loading="loading" @click="getCheckedKeys">
                {{$t('content.common.qd')}}
            </el-button>
            <el-button @click="handleClose">{{$t('content.common.qx')}}</el-button>
        </div>
    </div>
</template>

<script>
    import {EmphasizeName} from 'mixins/common';
    import {getFileTreeData} from '@/service/getData';
    import FileSaver from 'file-saver';

    export default {
        name: "ExportTree",
        mixins: [EmphasizeName],
        props: ['isOpen'],
        data() {
            return {
                loading: false,
                keyword: '',
                cacheKeyword: '',
                isSearching: '',
                defaultProps: {
                    children: 'children',
                    label: 'label',
                    isLeaf: 'leaf'
                },
                validatorShow: false
            };
        },
        watch: {
            isOpen(val) {
                this.validatorShow = false;
            }
        },
        methods: {
            getCheckedKeys() {
                const lang = this.$i18n.locale;
                const param = this.$refs.tree.getCheckedNodes();
                if (param.length) {
                    this.loading = true;
                    this.axios.post('/excelMetadataInfo/exportUnstructure', {
                        lang,
                        ignoreWarn: true,
                        key: this.cacheKeyword,
                        param,
                        responseparameterType: 'arraybuffer'
                    }, {
                        responseType: 'arraybuffer',
                        timeout: 20000
                    }).then(res => {
                        this.loading = false;
                        this.downFile(res.data);
                        this.$emit('fetch:data');
                        this.handleClose();
                    }).catch(() => {
                        this.loading = false;
                    });
                    this.validatorShow = false;
                } else {
                    this.validatorShow = true;
                }
            },
            downFile(data) {
                let blob = new Blob([data], {type: 'application/vnd.ms-excel'});
                let date = new Date();
                let fileName = `${this.$t('content.dataset.datasetDetail.dcysj')}${date.getFullYear()}-${date.getMonth() < 9 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)}-${date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()}-${date.getHours()}-${date.getMinutes()}.xlsx`;
                FileSaver.saveAs(blob, fileName);
            },
            treeSearch() {
                this.validatorShow = false;
                this.isSearching = !this.isSearching;
                this.cacheKeyword = this.keyword;
                setTimeout(() => {
                    this.isSearching = !this.isSearching;
                    setTimeout(() => {
                        $('.root-node').click();
                    }, 100);
                }, 100);
            },
            checkClick(data) {
                const nodes = this.$refs.tree.getCheckedNodes().filter(node => node.id !== -1 && node.label !== 'HDFS');
                if (nodes.length) {
                    const refId = nodes[0].refId;
                    if (data.refId !== refId) {
                        this.$message({
                            message: this.$t('content.dataset.importExport.dctysjy'),    //只能导出同一个数据源的数据
                            type: 'warning'
                        });
                        const sameNodes = nodes.filter(node => node.refId === refId);
                        this.$refs.tree.setCheckedNodes(sameNodes);
                    }
                }
            },
            loadNode(node, resolve) {
                if (node.level === 0) {
                    return resolve([
                        {
                            level: node.level,
                            isLeaf: true,
                            id: -1,
                            label: 'HDFS',
                            isFolder: true,
                            path: '',     //获取数据源需要,临时增加参数
                            refId: 0   //表示获取数据源
                        }
                    ]);
                } else {
                    const {refId, locationPrefix} = node.data;
                    let prams = {
                        rows: 10,
                        page: 1,
                        order: '',
                        sort: '',
                        refId,
                        path: locationPrefix,
                        targetTopicPath: this.$route.query.path,
                        keyword: this.keyword
                    };
                    getFileTreeData(prams).then(res => {
                        const {statusCode, message} = res.data;
                        if (statusCode === 200) {
                            const {roles} = this.$store.state.userInfo;
                            const isAdmin = roles === 'leapid.admin';

                            message.records.forEach(item => {
                                if (node.level > 1 && !isAdmin) {     //非管理员用户,显示路径
                                    item.label = item.locationPrefix;
                                } else {
                                    item.label = item.title;
                                }
                                item.isFolder = item.folder;
                                item.leaf = !item.folder;
                                item.checked = false;
                                item.level = node.level;
                            });
                            resolve(message.records);
                        }
                    });
                }
            },
            handleClose(e) {
                this.$emit('update:visible', false);
                this.keyword = '';
                this.cacheKeyword = '';
                this.loading = false;
            }
        }
    };
</script>

<style lang="less">
    #export-tree {
        .businessCheckBox {
            height: 400px;
            background-color: #FFF;
            border: 1px solid #DDD;
            .el-tree {
                margin-top: 36px;
                overflow: auto;
                height: calc(~ "100% - 36px");
                > .el-tree-node > .el-tree-node__content > .el-checkbox {
                    display: none;
                }
                > .el-tree-node > .el-tree-node__children > .el-tree-node > .el-tree-node__content > .el-checkbox {
                    display: none;
                }
            }
        }
        .dialog-footer {
            margin-top: 20px;
            text-align: right;
        }
    }
</style>
