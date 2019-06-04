<template>
    <transition name="fade">
        <div class="metadata-main-nav">
            <router-link v-for="value in mainNav" :to="value.route" @click.native="changeMenu(value.route.name)">
                <span class="text-center"><i :class="`${value.icon}`"></i>{{$t(value.name)}}</span>
            </router-link>
        </div>
    </transition>
</template>
<script>
    import Vue from 'vue';
    import Bus from 'utils/bus';
    import {testPrivilege} from 'mixins/common'; //搜索结果高亮

    export default {
        name: 'MainNav',
        mixins: [testPrivilege],
        data() {
            return {
                lang: Vue.config.lang,
                mainNav: [
                    {
                        name: 'content.home.home',
                        icon: 'icon1',
                        route: {name: 'Home'}
                    },
                    {
                        name: "content.tree.ywst",
                        icon: 'icon2',
                        route: {name: 'Business'}
                    },
                    {
                        name: 'content.tree.jgh',
                        icon: 'icon3',
                        route: {name: 'Physical'}
                    },
                    {
                        name: 'content.tree.fjgh',
                        icon: 'icon7',
                        route: {name: 'Files'}
                    },
                    {
                        name: 'content.dataset.importExport.drdc',
                        icon: 'icon5',
                        route: {name: 'ImportExport'}
                    },
                    {
                        name: 'content.personal.gldb',
                        icon: 'icon4',
                        route: {name: 'Personal'}
                    }
                ]
            };
        },
        computed: {
            language() {
                return this.$store.state.language;
            },
            clearTimeoutId() {
                return this.$store.state.clearTimeout;
            }
        },
        async created() {
            this.testSourceAuthority();
            await this.testPrivilege('/excelMetadataInfo/import');
            if (!this.hasPrivilege) {   //产品上‘导入/出’功能模块，只有系统管理员和项目管理员可见
                this.mainNav.splice(-2, 1);
            }
        },
        methods: {
            changeMenu(routerName) {
                this.$store.dispatch('saveTableName', '');
                this.$store.dispatch('saveDatasetKeyword', "");
                this.$store.dispatch('setModelOpen', false);
                if (routerName === "Physical") {
                    Bus.$emit('initTree');
                    this.$store.dispatch('saveNavData', true);
                } else {
                    this.$store.dispatch('saveNavData', false);
                }
            },
            async testSourceAuthority() {
                const res = await this.axios.get('/space/init');
                const {statusCode, message} = res.body;
                if (statusCode === 200) {
                    if (message.roleLevel !== 0 || message.projectList.length !== 0) {
                        this.mainNav.push({
                            name: "content.nav.cckj",
                            icon: 'icon8',
                            route: {name: 'Source'}
                        });
                        message.roleLevel === 1 && message.projectList.unshift({
                            id: '',
                            name: this.$t('content.header.qb')
                        });
                        this.$store.dispatch('sourceUserMessage', message);
                    }
                }
            }
        }
    };
</script>
<style lang="less" scope>
    .metadata-main-nav {
        float: left;
        width: 80px;
        height: 100%;
        padding-top: 10px;
        background-color: #002336;
        z-index: 1000;
        a {
            display: flex;
            height: 70px;
            color: #607681;
            text-decoration: none;
            align-items: center;
            justify-content: center;
            &.router-link-active {
                background-color: #01344F;
                color: #FFF;
                border-left: 4px solid #00679C;
                .icon1 {
                    background-image: url("../assets/images/icon/icon1_active.png");
                }
                .icon2 {
                    background-image: url("../assets/images/icon/icon2_active.png");
                }
                .icon3 {
                    background-image: url("../assets/images/icon/icon3_active.png");
                }
                .icon4 {
                    background-image: url("../assets/images/icon/icon4_active.png");
                }
                .icon5 {
                    background-image: url("../assets/images/icon/icon5_active.png");
                }
                .icon6 {
                    background-image: url("../assets/images/icon/icon6_active.png");
                }
                .icon7 {
                    background-image: url("../assets/images/icon/icon7_active.png");
                }
                .icon8 {
                    background-image: url("../assets/images/icon/icon8_active.png");
                }
            }
        }
        i {
            display: block;
            width: 22px;
            height: 22px;
            margin: 4px auto 0;
            background: no-repeat center center;
        }
        .icon1 {
            background-image: url("../assets/images/icon/icon1.png");
        }
        .icon2 {
            background-image: url("../assets/images/icon/icon2.png");
        }
        .icon3 {
            background-image: url("../assets/images/icon/icon3.png");
        }
        .icon4 {
            background-image: url("../assets/images/icon/icon4.png");
        }
        .icon5 {
            background-image: url("../assets/images/icon/icon5.png");
        }
        .icon6 {
            background-image: url("../assets/images/icon/icon6.png");
        }
        .icon7 {
            background-image: url("../assets/images/icon/icon7.png");
        }
        .icon8 {
            background-image: url("../assets/images/icon/icon8.png");
        }
    }
</style>
