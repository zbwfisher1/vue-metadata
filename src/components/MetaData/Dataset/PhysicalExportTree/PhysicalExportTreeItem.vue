<template>
    <div v-if="(folder.folder && folder.hasChild) || !folder.folder">
        <div v-if="folder.folder">
            <section class="tit liUnderLine" :class="classType">
  			<span class="foldCon">
  				<i class="fold" :class="{open: folder.open}"></i>
  			</span>
                <span v-ellipsis:120="emphasizeName(folder.title,keyword)"></span>
                <span v-if="folder.hasChild" class="foldToggle" :class="{open: folder.open}"></span>
                <span class="foldToggle" :class="{open: folder.open}"></span>
                <span class="addThemeCheck"
                      v-if="classType['icon-DB']"
                      @click.stop.prevent="clickToggle(folder)">
               <el-checkbox :label="dataBaseSelect"></el-checkbox>
            </span>
            </section>
            <physical-export-tree
                    v-if="folder.open"
                    :model="treeData">
            </physical-export-tree>
        </div>
        <a href="javascript:;"
           class="liUnderLine table-title-name"
           :class="classType"
           v-else-if="folder.type!= 'more'">
            <i></i>
            <span v-html="emphasizeName(folder.title,keyword)"></span>
            <span class="addThemeCheck"
                  @click.stop.prevent="setCheckList(folder.datasetId, folder.path)">
				<el-checkbox :label="folder.datasetId"></el-checkbox>
			</span>
        </a>
        <div v-else class="dialog-load-more" @click="loadMore">
            {{$t('content.common.jzgd')}}
        </div>
    </div>
</template>
<script>
    import PhysicalExportTree from './PhysicalExportTree';
    import {Message, EmphasizeName} from 'mixins/common'; //搜索结果高亮
    import {mapState} from 'vuex';

    export default {
        name: 'PhysicalExportTreeItem',
        mixins: [Message, EmphasizeName],
        components: {
            PhysicalExportTree
        },
        props: {
            folder: Object
        },
        data() {
            return {
                treeData: [],
                dataBaseSelect: [],
                dbSelList: [],
                currentPage: 1
            };
        },
        watch: {
            'folder.open': function (val) {
                if (val) {
                    this.fetchTopicChildren();
                }
            },
        },
        computed: {
            classType() {
                const {level, folder, path, datasetId} = this.folder;
                let _path = path ? path.split('/')[0] : path;
                let _classType = {};
                let _class = "";
                if (!folder) {
                    _class += 'icon_table';
                } else {
                    if (level == 1) {
                        _class = 'icon-type';
                    } else if (_path != "hdfs" && level == 3) {
                        _class = 'icon-DB';
                    } else if (_path == "hdfs" && level > 2) {
                        _class = "icon_folder exceptHdfs";
                    } else {
                        _class = "icon_folder";
                    }
                }
                _classType = {
                    [_class]: true,
                };
                return _classType;
            },
            url() {
                let _url = '/datasets/tree';
                return _url;
            },
            ...mapState({
                keyword: 'exportSearh',
                exportList: 'exportList',
                exportDBList: 'exportDBList',
                exportTableSource: 'exportTableSource'
            })
        },
        created() {
            if (this.folder.children) {
                const hasChildren = new Set(this.folder.children.records);
                this.treeData = [...hasChildren];
            } else {
                this.treeData = [];
            }
        },
        methods: {
            //分批加载
            async loadMore() {
                const vm = this;
                const {path} = this.folder;
                this.$store.dispatch('treeBusinessLoading', true);
                ++this.currentPage;
                const targetTopicPath = this.$route.query.path;
                const params = {
                    level: 3,
                    path,
                    targetTopicPath,
                    page: vm.currentPage,
                    rows: 20,
                };

                if (this.keyword) {
                    params['key'] = this.keyword;
                }

                const url = `/excelMetadataInfo/treeSelect`;
                const headerData = {contentType: 'application/json', dataType: 'json'};
                const res = await this.axios.post(url, params, headerData);
                this.$store.dispatch('treeBusinessLoading', false);
                const {statusCode, message} = res.body;
                const {records} = message;

                this.$parent.model.splice((vm.currentPage - 1) * 20, 0, ...records);    //向父模型增加后台请求回来的数据
                if (!message.hasNextPage) {
                    this.$parent.model.pop();   //表示没有加载更多按钮了
                }

                // 把数据加到选中状态
                var _arr = [];
                this.$parent.model.map(item => {
                    var _path = item.path;
                    _path = _path.substring(0, _path.lastIndexOf('/'));
                    if (this.exportDBList.indexOf(_path) > -1) {
                        _arr.push(item.datasetId);
                    }
                });

                if (_arr.length > 0) {
                    vm.$store.dispatch('exportCheckList', {ids: _arr, path: path});
                }
            },
            async fetchTopicChildren() {
                const {level, path} = this.folder;
                const targetTopicPath = this.$route.query.path;
                // const url = '/datasets/treeSelect';
                const url = `/excelMetadataInfo/treeSelect`;
                const params = {
                    level,
                    path,
                    targetTopicPath,
                    page: 1,
                    rows: 20
                };
                if (this.keyword) {
                    params['key'] = this.keyword;
                }
                this.treeData = [];
                const headerData = {contentType: 'application/json', dataType: 'json'};
                const res = await this.axios.post(url, params, headerData);
                const {statusCode, message} = res.body;
                const records = message.records;
                if (statusCode == 200) {
                    //添加查看更多
                    if (message.hasNextPage) {
                        let path = message.records[0].path.split('/');
                        path.pop();
                        records.push({type: 'more', children: [], path: path.join('/')});
                    }
                    records.map(item => {
                        this.$set(item, 'open', false);
                    });
                    this.treeData = records;
                } else {
                    this.treeData = [];
                }
            },

            setCheckList(datasetId, path) {
                var _path = path.split('/');
                _path = _path[0] + '/' + _path[1];

                if (this.checkPath(_path)) {
                    this.$message({
                        message: this.$t('content.dataset.importExport.dctysjy'),    //只能导出同一个数据源的数据
                        type: 'warning'
                    });
                } else {
                    path = path.substring(0, path.lastIndexOf('/'));

                    this.exportTableSource[datasetId] = _path;

                    this.$store.dispatch('setExportTableSource', this.exportTableSource);
                    this.$store.dispatch('exportCheckList', {ids: datasetId, path: path});
                }
            },

            checkPath(path) {
                if (this.exportList.length > 0) {
                    if (this.exportTableSource[this.exportList[0]] && this.exportTableSource[this.exportList[0]] != path) {
                        return true;
                    }
                }
                if (this.exportDBList.length > 0) {
                    if (this.exportTableSource[this.exportDBList[0]] && this.exportTableSource[this.exportDBList[0]] != path) {
                        return true;
                    }
                }
                // for(var k in this.exportTableSource){
                //   if(this.exportTableSource[k] != path){
                //     return true;
                //   }
                // }
                return false;
            },

            async clickToggle(model) {
                var _path = model.path.split('/');
                _path = _path[0] + '/' + _path[1];

                if (this.checkPath(_path)) {   //检查是否为同一个数据源的数据
                    this.$message({
                        message: this.$t('content.dataset.importExport.dctysjy'),    //只能导出同一个数据源的数据
                        type: 'warning'
                    });
                } else {
                    let every = this.dataBaseSelect.every(val => {
                        return this.$store.state.exportList.includes(val);
                    });

                    if (this.dbSelList.indexOf(model.path) == -1) {
                        this.exportTableSource[model.path] = _path;
                        this.$store.dispatch('setExportTableSource', this.exportTableSource);

                        //添加库
                        if (!this.folder.open) {
                            await this.fetchTopicChildren();
                            //   this.folder.open = true
                        }

                        this.dbSelList.push(model.path);

                        let arr = this.treeData.map(val => {
                            return val.datasetId;
                        });

                        if (this.dataBaseSelect.length) {
                            this.dataBaseSelect.push(arr);
                        } else {
                            this.dataBaseSelect = arr;
                        }

                        this.$store.dispatch('exportCheckList', {ids: arr, path: model.path});
                        this.$store.dispatch('exportCheckDBList', model.path);
                    } else {
                        //删除库
                        this.dataBaseSelect = this.treeData.map(val => {    //找到该库下面的所有表
                            return val.datasetId;
                        });
                        this.$store.dispatch('deleteExportCheckList', this.dataBaseSelect);
                        this.$store.dispatch('deleteExportCheckDBList', model.path);
                        // this.folder.open = true
                        this.dataBaseSelect = [];
                        this.dbSelList.splice(this.dbSelList.findIndex(v => v === model.path), 1);
                    }

                }

            },
        }
    };
</script>
<style lang="less">
    .businessCheckBox {
        .el-radio-group {
            margin-bottom: 15px;
        }
        .tit {
            display: block;
        }
        margin-bottom: 0;
    }
</style>
