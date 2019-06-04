<template>
    <div v-if="(folder.folder && folder.hasChild) || !folder.folder">
        <div v-if="folder.folder">
            <section class="tit" :class="classType">
					<span class="foldCon">
						<i class="fold" :class="{open: folder.open}"></i>
					</span>
                <span v-ellipsis:120="emphasizeName(folder.title,keyword)"></span>
                <span v-if="folder.hasChild" class="foldToggle" :class="{open: folder.open}"></span>
            </section>
            <tree-view
                    v-if="folder.open"
                    :keyword="keyword"
                    :model="treeData">
            </tree-view>
        </div>
        <a v-else-if="folder.type!= 'more'"
           href="javascript:;"
           class="tit table-title-name"
           :class="classType">
            <i></i>
            <span v-html="emphasizeName(folder.title,keyword)"></span>
            <span v-if="alias">{{alias}}</span>
            <span class="addThemeCheck"
                  @click.stop.prevent="setCheckList(selectPath, folder, folder.path)">
				 <el-checkbox
                         v-if="folder.inTargetTopic !=='Y'"
                         :label="selectPath"
                 ></el-checkbox>
				 <el-checkbox
                         v-if="folder.inTargetTopic =='Y'"
                         disabled
                         label="disabled"
                 ></el-checkbox>
			</span>
        </a>
        <div v-else class="dialog-load-more" @click="loadeMore">
            {{$t('content.common.jzgd')}}
        </div>
    </div>
</template>

<script>
    import TreeView from './BusinessTree.vue';
    import {Message, EmphasizeName, resetValidators} from 'mixins/common'; //搜索结果高亮
    import {fileNameValidate} from 'utils/validator';

    export default {
        name: 'item',
        mixins: [Message, EmphasizeName, resetValidators],
        components: {
            TreeView,
        },
        data() {
            return {
                treeData: [],
                alias: '',
                loading: true,
                selectPath: '',
                currentPage: 1
            };
        },
        props: {
            keyword: String,
            folder: Object,
        },
        mounted() {
            if (this.folder.children) {
                const hasChildren = new Set(this.folder.children.records);
                this.treeData = [...hasChildren];
            } else {
                this.treeData = [];
            }
            this.selectPath = this.folder.datasetId;
            this.alias = this.folder.businessName ? `(${this.folder.businessName})` : '';
        },
        watch: {
            'folder.open': async function () {
                if (this.folder.open) {
                    await this.fetchTopicChildren();
                }
            },
            'folder.title': function () {
                this.alias = this.folder.alias;
            },
        },
        computed: {
            classType() {
                const {level, folder, path} = this.folder;
                let _path = path ? path.split('/')[0] : path;
                let _classType = {};
                let _class = "";
                if (!folder) {
                    _class += 'icon_table';
                    if (this.folder.inTargetTopic == 'Y') {
                        _class += ' itemDisable';
                    }
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
                    liUnderLine: true
                };
                return _classType;
            },
            url() {
                let _url = '/datasets/tree';
                return _url;
            },
        },
        methods: {
            async loadeMore() {
                this.$store.dispatch('treeBusinessLoading', true);
                const vm = this;
                const {path} = this.folder;
                ++this.currentPage;
                const targetTopicPath = this.$route.query.path;
                const params = {
                    level: 3,
                    path,
                    targetTopicPath,
                    page: vm.currentPage,
                    rows: 20,
                };
                const url = `/datasets/treeSelect`;
                const headerData = {contentType: 'application/json', dataType: 'json'};
                const res = await this.axios.post(url, params, headerData);
                this.$store.dispatch('treeBusinessLoading', false);
                const {statusCode, message} = res.body;
                const {records} = message;
                this.$parent.model.splice((vm.currentPage - 1) * 20, 0, ...records);
                if (!message.hasNextPage) {
                    this.$parent.model.pop();
                }
            },
            async fetchTopicChildren() {
                const {level, path} = this.folder;
                const targetTopicPath = this.$route.query.path;
                const url = '/datasets/treeSelect';
                const params = {
                    level,
                    path,
                    targetTopicPath,
                    page: 1,
                    rows: 20,
                    key: this.keyword
                };
                this.treeData = [];
                const headerData = {contentType: 'application/json', dataType: 'json'};
                const res = await this.axios.post(`/datasets/treeSelect`, params, headerData);
                const {statusCode, message} = res.body;
                const {records} = message;
                //添加查看更多
                if (message.hasNextPage) {
                    let path = message.records[0].path.split('/');
                    path.pop();
                    records.push({type: 'more', children: [], path: path.join('/')});
                }
                if (statusCode == 200) {
                    records.map(item => {
                        this.$set(item, 'open', false);
                    });
                    this.treeData = records;
                } else {
                    this.treeData = [];
                }
            },
            setCheckList(id, {title = '', businessName = '', path = ''}) {
                this.selectPath = id;
                if (this.folder.inTargetTopic !== 'Y') {
                    let item = {
                        selectPath: id,
                        selectTitle: title,
                        businessName,
                        path
                    };
                    this.$store.dispatch('addThemeCheckList', item);
                }
            },
        }
    };
</script>
