<template>
    <div class="boxCommon">
        <div class="table-title">
            <div class="table-title__text">
                <span>{{$t(tab.title)}}</span>
            </div>
            <div class="table-title__btns">
                <Search :placeholder="$t('content.validator.qsrbm')"
                        emitName="ownerSearch"
                        @ownerSearch="emitData"></Search>
            </div>
        </div>
        <loading :isloading="loadingVisible"></loading>
        <component
                v-show="!loadingVisible"
                :is="tab.component"></component>
    </div>
</template>
<script>
    import item from 'common/TableItemJump';
    import Search from 'common/Search';
    import {Message, FormatTime, FormatSize, EmphasizeName, FormatLifeDay, resetValidators} from 'mixins/common';
    import dialogItemTitle from 'common/dialogItemTitle';
    import Bus from 'utils/bus';
    import PersonalOwnerTable from './PersonalOwnerTable';
    import PersonalMetaMaintain from './PersonalMetaMaintain';
    import PersonalChargeMaintain from './PersonalChargeMaintain';
    import 'assets/libs/qtip/jquery.qtip.css';

    export default {
        mixins: [Message, FormatTime, FormatSize, EmphasizeName, FormatLifeDay, resetValidators],
        data() {
            return {
                deadline: 1,
                testIndex: 22,
                loadingVisible: true,
                key: ''
            };
        },
        props: ['tab'],
        components: {
            item,
            Search,
            dialogItemTitle,
            PersonalOwnerTable,
            PersonalMetaMaintain,
            PersonalChargeMaintain
        },
        watch: {
            'tab.component'(val) {
                this.loadingVisible = true;
                Bus.$emit('clearSearch');
            }
        },
        created() {
            Bus.$on('loadingVisible', value => {
                this.loadingVisible = value;
            });
        },
        methods: {
            emitData(params) {
                this.key = params.key;
            }
        }
    };
</script>
<style lang="less">
    @import '../../../vars.less';
    .newOwner {
        width: 200px;
    }
    .hidden-operator {
        cursor: pointer;
    }
    .owner-operator {
        display: flex;
        justify-content: left;
        span {
            margin-right: 7px;
        }
        i {
            font-size: 18px;
            color: #4D819B;
            cursor: pointer;
            &:hover {
                color: #FF5A5A;
            }
        }
        .icon-s {
            font-size: 16px;
        }
    }
    .table-tip-content {
        display: flex;
    }
    .triangle-border {
        position: absolute;
        top: 0;
        right: 42px;
        overflow: hidden;
        margin-left: -10px;
        width: 0;
        height: 0;
        border-width: 10px;
        border-style: solid dashed dashed dashed;
    }
    .tb-border {
        top: -21px;
        border-color: transparent transparent #DDD transparent;
    }
    .tb-background {
        top: -20px;
        border-color: transparent transparent #FFF transparent;
    }
    .ownerTit {
        padding-bottom: 10px;
        margin-bottom: 10px;
        border-bottom: 1px solid #DDD;
        color: #B3B8BF
    }
    .ownerCon {
        padding: 5px 0;
        overflow: hidden;
    }
    .ownerCon label {
        float: left;
        width: 150px;
        text-align: right;
        line-height: 32px;
        color: #777
    }
    .ownerCon .txt {
        margin-left: 160px;
        line-height: 32px;
    }
    .ownerCon ul {
        max-height: 128px;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .changeOwner {
        width: 520px;
    }
    .ownerCon li {
    }
    .ownerCon .ownerName {
        float: left;
        width: 130px;
        height: 32px;
        margin-right: 10px;
        vertical-align: middle;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .icon-private {
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url("../@{imagesUrl}/owner_operation.png") no-repeat;
        background-position: -45px 4px;
    }
    .iconIsPrivate {
        background-position: -14px 2px;
    }
</style>
