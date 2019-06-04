<template>
    <section class="top-10-list">
        <h4>{{$t(item.title)}}</h4>
        <template v-if="!item.loading">
            <ul v-if="item.list.length > 0">
                <li v-for="(name, index) in item.list"
                    @click="linkTo(name)"
                    class="top-list-item">
                    <i :class="`listNum listNum${++index}`">{{index}}</i>
                    <span class="commom-overflow" :title="name.path">{{name.name}}</span>
                </li>
            </ul>
            <no-data :noDataVisible="item.list.length == 0"></no-data>
        </template>
        <template v-else>
            <loading :isloading="true"></loading>
        </template>
    </section>
</template>
<script>
    import {clickCount} from 'utils';
    import Bus from 'utils/bus';

    export default {
        props: {
            item: [Object]
        },
        methods: {
            linkTo(item) {
                this.$store.dispatch('saveTreeItemActive', {path: item.path, datasetId: item.id});//保存当前点击
                clickCount(item.id);
                // 我也不知道下面一句是用来干什么的，但是不能删。
                if (item.disabled) {
                    return;
                }
                const {path} = item;
                const datasetId = item.id;
                this.$store.dispatch('fetchRouter', {path, datasetId});
                const name = item.name;
                this.$store.dispatch('saveTableName', name);
                const type = item.path.split('/')[0];  //格式如: hive/LEAP-Hive/ytest/links
                if (type === 'hdfs') {
                    this.$router.push({name: 'Files', query: {id: item.id}});
                } else {
                    this.$router.push({name: 'Physical'});
                }
                this.$store.dispatch('setBusiness', false);
                this.$store.dispatch('saveNavData', true);
            }
        }
    };
</script>
<style lang="less">
    .top-10-list {
        flex-grow: 1;
        h4 {
            margin: 0;
            padding: 0;
            line-height: 55px;
            border-bottom: 1px solid #E2E8EB;
            padding-left: 20px;
            font-size: 16px;
        }
        ul {
            padding: 10px 20px;
            line-height: 30px;

            li {
                position: relative;
                width: 100%;
                height: 30px;
                cursor: pointer;
                &:hover {
                    background: #EEE;
                }
                i {
                    position: absolute;
                    top: 0;
                    left: 0;
                    margin-top: 7px;
                    width: 16px;
                    height: 16px;
                    font-style: normal;
                    line-height: 16px;
                    text-align: center;
                    color: #FFF;
                    background: #A9B0BC;
                }
                span {
                    position: absolute;
                    top: 0;
                    right: 0;
                    float: left;
                    display: block;
                    width: calc(~ "100% - 26px");
                    margin-left: 10px;
                    color: #707070;
                }
                .listNum1 {
                    background: #F54744;
                }
                .listNum2 {
                    background: #FE8545;
                }
                .listNum3 {
                    background: #FFAD36;
                }

            }
        }
    }
</style>
