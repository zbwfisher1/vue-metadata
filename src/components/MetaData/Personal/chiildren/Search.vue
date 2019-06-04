<template>
    <el-input :placeholder="$t(placeholder)"
              v-model="value"
              prefix-icon="el-icon-search"
              @change='handlechange'
              clearable
              @clear="onSearch"
              @keyup.enter.native="onSearch">
        <el-button slot="append" @click="onSearch">{{$t('content.header.ss')}}</el-button>
    </el-input>
</template>
<script>
    export default {
        name: 'Search',
        data() {
            return {
                value: ''
            };
        },
        watch: {
            keyword(val) {
                this.value = val;
            }
        },
        props: {
            keyword: {
                type: String,
                default: ''
            },
            placeholder: {
                type: String,
                default: 'content.header.srbm'
            }
        },
        created() {
            this.value = this.keyword;
        },
        methods: {
            onSearch() {
                this.$emit('handleSearch', this.value.trim());
            },
            handlechange(value) {
                this.$emit('update:keyword', value);
            }
        }
    };
</script>
<style lang="less">
    .el-icon-circle-close {
        color: #FD8A8B !important;
    }
</style>
