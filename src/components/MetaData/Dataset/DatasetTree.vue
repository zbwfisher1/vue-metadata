<template>
    <ul>
        <li v-for="(modelItem, index) in model"
            @click.stop="clickToggle(modelItem)"
            :key="modelItem.type === 'more' ? 10000 : index">
            <item :hasPrivilege="hasPrivilege"
                  :folder="modelItem"
                  :isBusiness="isBusiness"></item>
        </li>
    </ul>
</template>

<script>
    import Bus from 'utils/bus';
    import {clickCount} from 'utils';
    import {mapState} from 'vuex';

    export default {
        name: "treeView",
        beforeCreate: function () {
            this.$options.components.item = require("./DatasetTreeItem.vue");
        },
        props: {
            model: Array,
            isBusiness: Boolean,
            hasPrivilege: Boolean
        },
        computed: {
            ...mapState({
                isActive: 'treeItemActive',
                fetchRouter: 'fetchRouter'
            })
        },
        created() {
            this.$nextTick(() => {
                this.fetchRouterData();
            });
        },
        methods: {
            fetchRouterData() {
                const vm = this;
                const find = this.model.find((val) => {
                    if (this.fetchRouter.datasetId) {
                        return val.datasetId === this.fetchRouter.datasetId && val.path === this.fetchRouter.path;
                    } else {
                        return val.path === this.fetchRouter.path;
                    }
                });
                if (!this.fetchRouter.path) {
                    let model = {
                        level: 1,
                        title: '',
                        path: '',
                        folder: true,
                        datasetId: 0
                    };
                    vm.treeToggle(model);
                } else {
                    if (find) {
                        vm.treeToggle(find);
                    } else if (this.fetchRouter.path != '|' && this.fetchRouter.datasetId) {
                        const view = this.isBusiness ? 'business' : 'table';
                        vm.treeToggle({
                            // level: 300,
                            folder: false,
                            path: this.fetchRouter.path,
                            id: this.fetchRouter.datasetId,
                            view
                        });
                    }
                }
            },
            clickToggle(model) {
                if (!model.hasChild) {
                    var _datasetId = model.datasetId;
                    clickCount(_datasetId);
                    // this.axios.post(`/datasets/${_datasetId}/access`)
                    //           .catch(err => console.log(err))
                }
                const vm = this;
                this.$store.dispatch('fetchRouter', {path: '|'});
                if (model.folder) {
                    vm.model.forEach((val) => {
                        if (val && val.path != model.path) {
                            val.open = false;
                        }
                    });
                    model.open = !model.open;

                    this.$store.dispatch('setModelOpen', model.open);
                    this.$store.dispatch('saveTreeItemActive', {path: model.path, datasetId: model.datasetId});//保存当前点击
                }
                this.treeToggle(model);
            },
            createMap(itemModel) {
                let pathArray = itemModel.path.split('/');
                let pathLink = [];

                pathArray.forEach((val, index, arr) => {
                    let _path = [];
                    for (let i = 0; i <= index; i++) {
                        _path.push(arr[i]);
                    }
                    pathLink.push(_path.join('/'));
                });

                pathLink.pop();
                pathLink.map((val, key) => {
                    const level = key + 1;
                    const title = pathArray[key];
                    const path = val;
                    const folder = true;
                    const queryParams = {
                        params: {
                            title,
                            path,
                            level
                        },
                        isfolder: folder
                    };
                    this.$store.dispatch('saveViewData', queryParams);//保存请求参数
                });
            },
            treeToggle(model) {
                //记录点击树状item的路径所有参数,用于跳转
                const vm = this;
                const {level, title, path, folder, datasetId, refId} = model;
                const type = !model.type && model.path.split('/')[0];
                const id = model.datasetId || model.id;
                !model.type && this.createMap(model);
                let _queryParams = {};
                if (folder) {
                    if (type !== "hdfs") {
                        _queryParams = {
                            params: {
                                title,
                                path,
                                level,
                                refId
                            },
                            isfolder: folder
                        };
                    }
                } else if (model.type != 'more') {
                    _queryParams = {
                        params: {
                            id,
                            path,
                            level
                        },
                        isfolder: folder
                    };
                }
                if (model.type != 'more') {
                    if (_queryParams.params.refId === undefined) {
                        delete _queryParams.params.refId;
                    }
                    this.$store.dispatch('setBusinessTitle', this.isBusiness);//datasetDatail标题
                    if (datasetId) {
                        this.$store.dispatch('saveTreeItemActive', {path, datasetId});//保存当前点击
                    } else {
                        this.$store.dispatch('saveTreeItemActive', {path, datasetId: 0});//保存当前点击
                    }
                    _queryParams.params['t'] = +new Date();
                    this.$store.dispatch('saveViewData', _queryParams);//保存请求参数
                    if (this.$store.state.isBusiness) {
                        this.$router.replace({name: 'DatasetDetail', query: _queryParams.params});
                    } else {
                        this.$router.replace({name: 'PhysicalDetail', query: _queryParams.params});
                    }
                }
            }
        }
    };
</script>

<style scoped>
</style>
