<template>
    <div class="table-search">
        <div class="table-search-wrap">
            <el-input :placeholder="placeholder"
                      prefix-icon="el-icon-search"
                      v-model="searchContent"
                      @keyup.enter.native="searchKey">
            </el-input>
            <span v-if="searchContent.length>0"
                  class="el-icon-circle-close"
                  @click="clearInput"
            ></span>
        </div>
        <el-button @click.native="searchKey">{{$t('content.header.ss')}}</el-button>
    </div>
</template>
<script>
    import Bus from 'utils/bus';

    export default {
        name: 'Search',
        props: {
            placeholder: String,
            emitName: String,
        },
        watch: {
            '$parent.isClear'() {
                if (this.$parent.isClear) {
                    this.searchContent = this.searchContent.repeat(0);
                    this.$parent.isClear = false;
                }
            },
        },
        data() {
            return {
                searchContent: ''
            };
        },
        mounted() {
            Bus.$on('clearSearch', () => {
                this.clearInput();
            });
        },
        methods: {
            clearInput() {
                this.searchContent = '';
                this.searchKey();
            },
            searchKey() {
                const key = this.searchContent.trim();
                const currentPage = 1;
                const params = {
                    key,
                    currentPage
                };
                this.$emit(this.emitName, params);
            }
        }
    };
</script>
<style>
    .table-search {
        position: relative;
        display: flex;
        margin-top: -3px;
    }
    .table-search > div {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #D9D9D9;
    }
    .table-search .el-input__icon {
        right: auto;
    }
    .table-search .el-input {
        width: auto;
    }
    .table-search .el-input__inner {
        width: 200px;
        height: 28px !important;
        padding-left: 30px !important;
        padding-right: 25px;
        border-radius: 0;
        border: 0;
    }
    .table-search .el-button {
        line-height: 0;
        height: 30px;
        border-radius: 0;
        background: #F3F3F3;
        border-color: #D9D9D9;
        border-left: 0;
    }
    .table-search .el-button:hover {
        color: #014B70
    }
    .table-search .el-icon-circle-close {
        position: absolute;
        right: 5px;
        color: #FD8A8B;
        cursor: pointer;
    }
</style>
