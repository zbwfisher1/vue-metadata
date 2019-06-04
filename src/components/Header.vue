<template>
    <div class="content">
        <div class="header clearfix">
            <div class="logo pull-left"><img :src="logoSrc" alt=""/></div>
            <nav class="menu clearfix">
                <div class="sub-logo pull-left">
                    <img :src="subLogoSrc" alt=""/>
                </div>
                <ul class="menu-nav pull-left clearfix">
                    <li v-for="(nav, index) in topNavList">
                        <a :href="nav[1]" target="_blank" v-if="index < 4">{{$t(nav[0])}}</a>
                        <router-link :to="{name: nav[1]}" class="router-link-active" v-else>
                            {{$t(nav[0])}}
                        </router-link>
                    </li>
                </ul>
                <ul class="user-menu pull-right clearfix">
                    <li>
                        <a href="javascript:;" @click="changeLanguage">
                            {{selectLanguage === 'en' ? '中文' : 'English'}}
                        </a>
                    </li>
                    <li v-if="authenticateUrl">
                        <a target="_blank" :href="authenticateUrl">{{$t('content.entry.qxgl')}}</a>
                    </li>
                    <li class="user">
                        <a href="javascript:;"><img :src="userSrc"/></a>
                        <div class="userInfo">
                            <span class="arrow-up"></span>
                            <p class="user_name">{{username}}</p>
                            <p class="modify_psw">
                                <a href="javascript:;" @click="pushModifyRouter">
                                    {{$t('content.entry.xgmm')}}
                                </a>
                            </p>
                            <p class="logo_out">
                                <a href="javascript:;" :title="$t('content.entry.tc')" @click="logout()">{{$t('content.entry.tc')}}</a>
                            </p>
                        </div>
                    </li>
                </ul>
            </nav>
        </div>
    </div>

</template>

<script>
    import {setStore} from '@/config/mUtils';

    export default {
        name: 'Header',
        data() {
            return {
                logoSrc: require('assets/images/logo_s.png'),
                subLogoSrc: require('assets/images/sub_logo.png'),
                userSrc: require('assets/images/user.png'),
                userInfo: false,
                selectLanguage: this.$i18n.locale,
                ignoreLastFetch: false,
                topNavList: [],
                authenticateUrl: ''
            };
        },
        async created() {
            this.settingLanguage();
            await this.fetchData();
        },
        computed: {
            username() {
                return this.$store.state.username;
            }
        },
        methods: {
            settingLanguage() {
                let resLang = this.$i18n.locale;
                this.selectLanguage = resLang;
                this.$store.dispatch('setLanguage', resLang);
            },
            //判断浏览器语言
            changeLanguage() {
                if (!this.ignoreLastFetch) {    //如果当前还处于上一次请求中,不需要再次执行
                    this.selectLanguage = /^zh/.test(this.selectLanguage) ? 'en' : 'zh';
                    this.$i18n.locale = this.selectLanguage;   //重新设置语言,本地改变
                    this.ignoreLastFetch = true;
                    this.$store.dispatch('setLanguage', this.selectLanguage);
                    this.axios.post(`/lang/${this.selectLanguage}`).then(res => {
                        this.ignoreLastFetch = false;   //请求结束
                    });
                }
            },
            pushModifyRouter() {
                window.location.href = "/changepw";
            },
            fetchData() {
                this.axios.get('/appEntry').then(res => {
                    let {statusCode, message} = res.data;
                    if (statusCode === 200) {
                        this.topNavList = [
                            ['content.entry.zl', `${message['sqlEntry']}/overview.jsp`],
                            ['content.entry.cxfxq', message['sqlEntry']],
                            ['content.entry.rwdd', message['procEntry']],
                            ['content.entry.sjjc', message['dhubEntry']],
                            ['content.entry.ysjgl', 'MetaData']
                        ];
                        this.authenticateUrl = message['leapidEntry'];
                        setStore('sqlEntry', message['sqlEntry']);
                        setStore('searchUrl', message['sqlEntry']);
                    }
                });
            },
            logout() {
                this.$store.dispatch('setUsername', '');
                window.sessionStorage.removeItem('username');
                window.sessionStorage.removeItem('exitingURL');
                window.location.href = "/logout";
            }
        }
    };
</script>

<style scope lang="less">
    @imgUrl: '../images';
    @themeColor: #014B70;
    .header {
        width: 100%;
        height: 60px;
        font-size: 12px !important;
        text-align: center;
        .logo {
            width: 80px;
            height: 60px;
            background-color: #01354F;
            img {
                margin-top: 10px;
            }
        }
        .menu {
            height: 60px;
            background: @themeColor;
            .sub-logo {
                width: 230px;
                height: 100%;
                text-align: left;
                img {
                    margin-left: 25px;
                    margin-top: 21px;
                }
            }
        }
    }
    .menu-nav {
        li {
            float: left;
            height: 60px;
            a {
                display: inline-block;
                height: 60px;
                line-height: 60px;
                padding: 0 18px;
                text-align: center;
                color: #FFF;
                text-decoration: none;
                cursor: pointer;
                font-style: normal;
                &:hover,
                &.router-link-active {
                    background-color: #01354F;
                }
            }
        }
    }
    .user-menu {
        li {
            float: left;
            height: 60px;
            &.user {
                position: relative;
                border-left: 1px solid #346F8D;
                background: #014263;
                padding-left: 5px;
                .userInfo {
                    display: none;
                    position: absolute;
                    right: 10px;
                    width: 180px;
                    height: 130px;
                    padding: 10px;
                    background: #FFF;
                    box-shadow: 0 0 5px #AAA;
                    z-index: 2300;
                    .arrow-up {
                        position: absolute;
                        top: -5px;
                        right: 10px;
                        width: 0;
                        height: 0;
                        border-left: 5px solid transparent;
                        border-right: 5px solid transparent;
                        border-bottom: 5px solid #FFF;
                    }
                    p {
                        margin: 0;
                        padding: 10px;
                        text-align: center;
                        border-bottom: 1px solid #EEE;
                        line-height: 18px;
                        a {
                            line-height: 18px;
                            color: #444;
                            &:hover {
                                color: #F00;
                            }
                        }
                        &:last-child {
                            border-bottom: 0;
                        }
                    }
                }
                &:hover {
                    .userInfo {
                        display: block;
                    }
                }
            }
            > a {
                display: inline-block;
                height: 60px;
                line-height: 60px;
                padding: 0 10px;
                text-align: center;
                color: #FFF;
                text-decoration: none;
            }
        }
    }
</style>
