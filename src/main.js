import Vue from 'vue';
import App from './App';
import VueHighcharts from 'vue-highcharts';
import Highcharts from 'highcharts/highcharts';
import ECharts from 'vue-echarts';
import VueI18n from 'vue-i18n';
import 'babel-polyfill';
import store from './store';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';
import Element from 'element-ui';
//Element国际化
import enLocale from 'element-ui/lib/locale/lang/en';
import zhLocale from 'element-ui/lib/locale/lang/zh-CN';
import 'element-ui/lib/theme-chalk/index.css';
import 'assets/element-theme/element-variables.scss';
import 'assets/css/elementUiEdit.less';
import 'assets/less/source.less';
import 'assets/css/common.css';
import {VTable, VPagination} from 'vue-easytable';
import 'vue-easytable/libs/themes-base/index.css';
import directive from 'directives';
import './directives/hiddenElement';
import commonComponents from 'components/common';
import Plugins from './plugins';
import VueTippy from 'vue-tippy';
import {cnContent, enContent} from 'locale/international';
import router from './router';
import {currentLang, authenticate} from '@/service/getData';
import {getStore, removeStore} from './config/mUtils';
import {textFieldLength} from '@/config/env';
import axios from './config/http';
import VueFilter from 'vue-filter';

Vue.component('chart', ECharts);
Vue.component(VTable.name, VTable);
Vue.component(VPagination.name, VPagination);
Vue.use(VueHighcharts, {Highcharts});
Vue.use(directive);
Vue.use(VueI18n);
Vue.use(commonComponents);
Vue.use(Plugins);
Vue.use(VueTippy);
Vue.use(VueFilter);
Highcharts.setOptions({lang: {thousandsSep: ','}});

// 将axios挂载到prototype上，在组件中可以直接使用this.axios访问
Vue.prototype.axios = axios;

//全局混入,会影响到 所有 之后创建的 Vue 实例.请注意哦
Vue.mixin({
    data: function () {
        return {
            textFieldLength
        };
    },
    methods: {
        getPermission: function (url, type = 'get') {
            return this.axios[type](`${url}?testPrivilege=1`);
        }
    }
});

//international
const messages = {
    en: Object.assign(enContent, enLocale),
    zh: Object.assign(cnContent, zhLocale)
};

axios.all([authenticate(), currentLang()]).then(axios.spread(function (auth, currentLang) {
    const {statusCode: statusCode1, message: message1} = auth.data;
    const {statusCode: statusCode2, message: message2} = currentLang.data;

    if (statusCode1 === 200 && statusCode2 === 200) {    //获取用户信息接口成功
        const {lang} = message2;
        const path = getStore('exitingURL');
        const i18n = new VueI18n({
            locale: lang.includes('zh') ? 'zh' : 'en', // set locale
            messages // set locale messages
        });

        Vue.use(Element, {
            i18n: (key, value) => i18n.t(key, value)
        });

        router.beforeEach((to, from, next) => {
            window.scrollTo(0, 0);
            next();
        });

        new Vue({
            i18n,
            axios,
            router,
            store,
            render: h => h(App)
        }).$mount('#App');
        if (path && path.length) {
            removeStore('exitingURL');
            router.push({
                path: path.substring(1)
            });
        }
        store.dispatch('setUsername', message1.userName);
        store.dispatch('setUserInfo', message1);
    } else {
        store.dispatch('setUsername', "");
    }

}));
