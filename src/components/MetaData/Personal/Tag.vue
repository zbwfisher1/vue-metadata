<template>
    <component v-bind:is="currentTabComponent"></component>
</template>

<script>
    import TagList from './TagList';
    import TagDetail from './TagDetail';

    export default {
        components: {
            TagList,
            TagDetail
        },
        data () {
            return {
                currentTabComponent: null
            };
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                if (to.params.id) {
                    vm.currentTabComponent = 'TagDetail';
                } else {
                    vm.currentTabComponent = 'TagList';
                }
            });
        },
        beforeRouteUpdate (to, from, next) {
            if (to.params.id) {
                this.currentTabComponent = 'TagDetail';
            } else {
                this.currentTabComponent = 'TagList';
            }
            next();
        }
    };

</script>

<style scoped lang="less">

</style>
