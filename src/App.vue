<template>
    <div id="wrapper">
        <more-loading :isloading="fullLoading"></more-loading>
        <header-box></header-box>
        <div class="content-box">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import HeaderBox from './components/Header.vue';
    import FooterBox from './components/Footer.vue';

    export default {
        data () {
            return {
                loading: false
            };
        },
        components: {
            HeaderBox,
            FooterBox
        },
        computed: {
            language () {
                Vue.config.lang = this.$store.state.language;
                return this.$store.state.language;
            },
            fullLoading () {
                return this.$store.state.fullLoading;
            }
        },
        watch: {
            language (val) {
                Vue.config.lang = this.language;
            }
        }
    };
</script>
<style lang="less">
    #wrapper {
        height: 100%;
        .content-box {
            height: calc(~"100% - 60px");
        }
    }
</style>
