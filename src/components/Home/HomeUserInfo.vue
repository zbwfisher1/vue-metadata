<template>
    <div class="home-count-list" :style="{borderTop: `1px solid ${userInfo.color}`}">
        <section class="user-info-header">
            <h4>{{userInfo.title}}</h4>
            <div class="desc-label">{{userInfo.label}}</div>
            <section class="user-info-footer">
                <div class="loading" v-if="userInfo.count == null"></div>
                <template v-else>
                    <span>{{userInfo.count}}</span> {{$t('content.common.tiao')}}
                </template>
            </section>
        </section>
    </div>
</template>
<script>
    export default {
        name: 'HomeUserInfo',
        props: {
            userInfo: Object,
            loading: Boolean
        },
    };
</script>
<style lang="less">
    .home-count-list {
        display: flex;
        align-content: center;
        align-items: center;
        flex-grow: 1;
        margin-left: 20px;
        border: 1px solid #E3E8EB;
        padding: 0 10px;
        text-align: center;
        position: relative;
        cursor: pointer;
        .user-info-header {
            width: 100%;
            h4 {
                margin-top: 0;
                font-size: 15px;
            }
            .desc-label {
                color: #999;
                margin-bottom: 0;
                border-bottom: 1px solid #E2E8E6;
                padding-bottom: 20px;
            }

        }
        .user-info-footer {
            margin-top: 15px;
            text-align: center;
            color: #014B70;
            .loading {
                width: 16px;
                height: 16px;
                margin: 45px auto 0;
                background: url(../../assets/images/loading_s.gif);
            }
            span {
                font-size: 30px;
            }
        }
    }
</style>

q
