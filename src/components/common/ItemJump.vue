<template>
    <div>
        <a href="javascript:;"
           class="table-item-jump"
           @click="link(params)"
           :class="{disabled: params.disabled}">
            <span v-ellipsis="name"></span>
            <span class="name" v-if="params.params.rate">{{params.params.rate}}%</span>
            <i v-if="isPrivate != undefined && isPrivate == 1"
               :title="$t('content.common.yyc')">
                <img :src="privateImg"/>
            </i>
        </a>
    </div>
</template>
<script>
    import {clickCount} from 'utils';
    import Bus from 'utils/bus';

    export default {
        name: "LinkJump",
        props: {
            name: String,
            params: {
                type: Object,
                require: true
            },
            datasetId: {
                default: null
            },
            view: Boolean,
            isPrivate: 0,
        },
        data() {
            return {
                privateImg: require('../../assets/images/private.png')
            };
        },
        computed: {
            isDataset() {
                const {path} = this.$route;
                return path.includes("Dataset") || path.includes("Physical");
            },
            tableName() {
                // if(typeof this.names === "string"){
                // 	return Array.of(this.names)
                // }
                return this.name;
            }
        },
        methods: {
            link(queryParams) {
                this.$store.dispatch('saveTreeItemActive', {path: queryParams.params.path, datasetId: this.datasetId});//保存当前点击
                clickCount(this.datasetId);
                // 我也不知道下面一句是用来干什么的，但是不能删。
                if (queryParams.disabled) {
                    return;
                }
                const {path} = queryParams.params;
                const datasetId = this.datasetId;
                this.$store.dispatch('fetchRouter', {path, datasetId});
                if (!this.isDataset) {
                    const name = this.tableName;
                    this.$store.dispatch('saveTableName', name);
                    this.$router.push({name: 'Physical'});
                    this.$store.dispatch('setBusiness', false);
                } else {
                    //this.$store.dispatch('saveDatasetKeyword', "");  //取消搜索关键字
                    this.$store.dispatch('setBusiness', this.view);
                    Bus.$emit('refreshTree', {path, datasetId});
                }
                this.$store.dispatch('saveNavData', true);
            }
        }
    };
</script>
<style>
    .table-item-jump {
        display: flex;
        justify-content: space-between;
    }
    .table-item-jump:hover {
        text-decoration: none;
    }
    .table-item-jump i {
        color: orange;
    }
</style>
