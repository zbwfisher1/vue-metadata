/**
 *
 * http请求配置
 */
import axios from 'axios';
import store from '../store';
import {codeMap} from '../config/env';
import {setStore} from '../config/mUtils';
import {Message} from 'element-ui';

/*
*
* 网页加载时,还没有请求 /lang 接口的时候,如果有提示错误信息,需要获取浏览器设置语言,以提供报错信息
*   Firefox Chrome Safari     用  navigator.language
*   IE  用 navigator.browserLanguage
*
* */
const navLang = (navigator.language || navigator.browserLanguage).toLowerCase();
let loginOutFlag = false;    //用户是否已经登出标记,防止重复报错信息提示

// axios 配置
axios.defaults.headers.post['Content-Type'] = 'application/json';

// 请求拦截器
axios.interceptors.request.use(function (config) {
  const url = config.url;
  if (url.indexOf("?") >= 0) {//判断url中是否已经带有参数
    config.url = url + "&t=" + (new Date()).valueOf();
  } else {
    config.url = url + "?t=" + (new Date()).valueOf();
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

// http response 响应拦截器
axios.interceptors.response.use(function (response) {
  const url = response.config.url;   //请求接口的url
  response.body = response.data;   //兼容以前的vue-resource

  if (response.headers['content-type'].indexOf('application/json') > -1 &&
      url.indexOf('/outerapi/v1/getOutterSql/key/') === -1) {    //过滤掉文件上传请求,SQL查询的请求
    const code = response.data.statusCode;
    const lang = store.state.language;   //获取当前设置的语言
    if (code === 407) {  //用户当前是否已经登陆, 用户每次请求接口时,都要去判断是否已经登陆,否则跳转到登陆页面
      if (!loginOutFlag) {
        loginOutFlag = true;
        setStore("exitingURL", window.location.hash);       //登出时候停留的页面保存起来

        //过滤掉这两个接口,因为当前还不确定用户的设置语言,只能以浏览器的设置完成提示
        if (url.indexOf('/authenticate') > -1 || url.indexOf('/lang') > -1) {
          Message.error(codeMap[navLang.includes('zh') ? 'zh' : 'en']['exit']);
        } else {
          Message.error(codeMap[lang]['exit']);
        }
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } else if (code === 200 || code === 403) {
      return response;
    } else {
      Message({
        showClose: true,
        type: 'warning',
        message: codeMap[lang][code]
      });
      return response;
    }
  } else {
    return response;
  }
}, function (error) {
  return Promise.reject(error);
});

export default axios;
