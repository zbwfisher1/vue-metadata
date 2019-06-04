<template>
    <div>
        <more-loading :isloading="fullLoading" :isFull="true"></more-loading>
        <router-view></router-view>
    </div>
</template>
<script>
    import NavBox from './Nav.vue';

    export default {
        name: 'MetaData',
        components: {NavBox},
        computed: {
            fullLoading () {
                return this.$store.state.fullTreeLoading;
            }
        },
        beforeRouteUpdate (to, from, next) {
            if (to.name === "Dataset") {
                this.$store.dispatch('setBusiness', true);
            } else if (to.name === "Physical") {
                this.$store.dispatch('setBusiness', false);
            }
            next();
        }
    };
</script>

<style lang="less" scope>
    @import '~assets/less/metaData';
    @import '~assets/font/iconfont.css';
</style>
