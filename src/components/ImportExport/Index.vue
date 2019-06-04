<template>
    <div id="import-modules" class="wrapper-content">
        <multipane class="custom-resizer" layout="vertical">
            <div class="pane" v-loading="loading" :style="{ width: '250px', maxWidth: '50%', minWidth: '250px' }">
                <template v-if="hasAuth">
                    <div class="pane-title">
                        <h6 class="title">{{$t('content.dataset.importExport.ysjzddr')}}<!--元数据自动导入--></h6>
                    </div>
                    <div class="menu-list">
                        <router-link class="menu" :to="{name: 'Collection'}" active-class="active">
                            <i class="icon-collection"></i>
                            <span>{{$t('content.dataset.importExport.ysjcj')}}<!--元信息采集--></span>
                        </router-link>
                        <router-link class="menu" :to="{name: 'ImportModule'}" active-class="active">
                            <i class="icon-import-excel"></i>
                            <span>{{$t('content.dataset.importExport.mbdr')}} <!--元数据Excel模板导入--></span>
                        </router-link>
                    </div>
                </template>
                <div class="pane-title title-top">
                    <h6 class="title">{{$t('content.dataset.importExport.ysjdc')}}<!--元数据导出--></h6>
                </div>
                <div class="menu-list">
                    <router-link class="menu" :to="{name: 'ExportModule'}" active-class="active">
                        <i class="icon-export"></i>
                        <span>{{$t('content.dataset.importExport.ysjdc')}}<!--元数据导出--></span>
                    </router-link>
                </div>
            </div>
            <multipane-resizer></multipane-resizer>
            <div class="pane" :style="{ flexGrow: 1 }">
                <router-view></router-view>
            </div>
        </multipane>
    </div>
</template>
<script>
    import {Multipane, MultipaneResizer} from 'vue-multipane';

    export default {
        components: {
            Multipane,
            MultipaneResizer
        },
        beforeRouteUpdate(to, from, next) {
            if (to.fullPath === "/Main/ImportExport/Collection" || to.fullPath === "/Main/ImportExport") {   //重复点击左侧导航导入/导出的时候,避免不加载子页面
                next({
                    name: this.hasAuth ? 'TaskList' : 'ExportModule'
                });
            } else {
                next();
            }
        },
        data() {
            return {
                loading: false,
                hasAuth: false
            };
        },
        created() {
            this.loading = true;
            this.getPermission('/excelMetadataInfo/import', 'post').then(res => {
                this.loading = false;
                const {statusCode, message} = res.data;
                if (this.$route.name === 'ImportExport') {
                    if (statusCode === 200) {
                        this.$router.push({name: 'TaskList'});
                    } else {
                        this.$router.push({name: 'ExportModule'});
                    }
                }
                this.hasAuth = statusCode === 200;
            }).catch(() => {
                this.hasAuth = false;
            });
        }
    };
</script>
<style lang="less">
    #import-modules {
        .pane-title {
        }
        .title-top {
            margin-top: 0;
        }
        .menu {
            display: flex;
            margin: 0 -15px;
            height: 32px;
            align-items: center;
            cursor: pointer;
            padding-left: 30px;
            color: #333;
            &:hover {
                text-decoration: none;
                background-color: #F3F3F3;
            }
            &.active {
                color: #FFF;
                background-color: #014B70;
                .icon-collection {
                    background-position: -16px 0;
                }
                .icon-import-excel {
                    background-position: -48px 0;
                }
                .icon-export {
                    background-position: -80px 0;
                }
            }
            i {
                display: inline-block;
                margin-right: 10px;
                width: 16px;
                height: 16px;
                background: transparent url("../../assets/images/importExport/icon.png") no-repeat 0 0;
                &.icon-collection {
                    background-position: 0 0;
                }
                &.icon-import-excel {
                    background-position: -32px 0;
                }
                &.icon-export {
                    background-position: -64px 0;
                }
            }
        }
    }
</style>
