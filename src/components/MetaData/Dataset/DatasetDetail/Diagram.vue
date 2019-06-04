<template>
    <div id="diagram-wrapper" :class="{'full-screen': isFullScreen}">
        <div class="diagram-title">
            <span>{{$t('content.dataset.datasetDetail.xygx')}}</span>
        </div>

        <div class="control-btn">
            <span @click="downloadDiagram"><i class="icon_download"></i></span>
            <span @click="fullscreen"><i class="icon_fullscreen" :class="{'icon_restore': isFullScreen}"></i></span>
        </div>
        <div class="panes-box">
            <multipane class="horizontal-panes custom-resizer" layout="horizontal">
                <div class="pane" :style="{ height: '80%', maxHeight: '90%' }">
                    <relational-graph
                            :id="tableId"
                            :download="download"
                            :fullScreen="isFullScreen"
                            @select="changeSQL"/>

                </div>
                <multipane-resizer></multipane-resizer>
                <div class="pane" :style="{ flexGrow: 1 }">
                    <div class="tab-wrapper">
                        <ul class="tabs-nav">
                            <li class="active">
                                <span>{{$t('content.dataset.datasetDetail.dmxx')}}</span>
                            </li>
                        </ul>
                        <div class="tab-content">
                            <transition name="bounce">
                                <p v-if="show">{{sql}}</p>
                            </transition>
                        </div>
                    </div>
                </div>
            </multipane>
        </div>
    </div>
</template>

<script>
    import RelationalGraph from './RelationalGraph';
    import {Multipane, MultipaneResizer} from 'vue-multipane';

    export default {
        props: ['tableId'],
        data() {
            return {
                sql: '',
                isFullScreen: false,
                show: true,
                download: false
            };
        },
        components: {
            RelationalGraph,
            Multipane,
            MultipaneResizer
        },
        methods: {
            fullscreen() {
                this.isFullScreen = !this.isFullScreen;
            },
            changeSQL(val) {
                this.sql = val;
            },
            downloadDiagram() {
                this.download = !this.download;
            }
        }
    };
</script>

<style lang="less">
    @imagesUrl: '../../../../assets/images';
    #diagram-wrapper {
        position: relative;
        padding: 20px 20px 0;
        background-color: #FFF;
        height: 500px;
        &.full-screen {
            z-index: 1000;
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            .panes-box {
                height: calc(~"100% - 76px");
            }
        }
        .diagram-title {
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #D9D9D9;
            height: 36px;
            span {
                font-size: 14px;
                line-height: 25px;
                &:before {
                    display: inline-block;
                    margin-right: 8px;
                    width: 3px;
                    height: 14px;
                    background-color: #014B70;
                    content: "";
                    vertical-align: middle;
                }
            }
        }
        .panes-box {
            height: calc(~"100% - 56px");
            .custom-resizer {
                width: 100%;
                height: 100%;
            }
            .custom-resizer > .pane {
                padding: 0;
                text-align: left;
                overflow: hidden;
                background: #FFF;
                border: 1px solid #CCC;
            }
            .custom-resizer > .pane ~ .pane {
            }
            .custom-resizer .multipane-resizer {
                margin-top: 0;
                top: 0;
                position: relative;
                &:before {
                    display: block;
                    content: "";
                    width: 40px;
                    height: 3px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    margin-top: -1.5px;
                    margin-left: -20px;
                    border-top: 1px solid #CCC;
                    border-bottom: 1px solid #CCC;
                }
                &:hover {
                    &:before {
                        border-color: #999;
                    }
                }
            }
        }
        .control-btn {
            position: absolute;
            top: 20px;
            right: 25px;
            height: 30px;
            border: 1px solid #D9D9D9;
            a,
            span {
                float: left;
                width: 40px;
                height: 100%;
                text-align: center;
                line-height: 40px;
                background-color: #F3F3F3;
                cursor: pointer;
                i {
                    width: 18px;
                    height: 20px;
                    display: inline-block;
                    background: url("@{imagesUrl}/icon_zoom.png") no-repeat;
                }
                .icon_download {
                    background-position: -108px 0;
                    &:hover {
                        background-position: -126px 0;
                    }
                }
                .icon_fullscreen {
                    background-position: 0 0;
                    &:hover {
                        background-position: -18px 0;
                    }
                }
                .icon_restore {
                    background-position: -36px 0;
                    &:hover {
                        background-position: -54px 0;
                    }
                }
            }
        }
        .tab-wrapper {
            .tabs-nav {
                border: 0;
                background-color: #EBEDEE;
                padding-top: 10px;
                span {
                    display: inline-block;
                    padding: 5px 30px;
                    text-decoration: none;
                    color: #000;
                    background-color: #FFF;
                    border-top: 3px solid #006EE6;
                }
            }
            .tab-content {
                padding: 10px;
                height: 20px;
                line-height: 20px;
            }
        }
    }
    .bounce-enter-active {
        animation: bounce-in .3s;
    }
    .bounce-leave-active {
        animation: bounce-in .3s reverse;
    }
    @keyframes bounce-in {
        0% {
            transform: scale(0);
        }
        50% {
            transform: scale(1.5);
        }
        100% {
            transform: scale(1);
        }
    }
</style>
