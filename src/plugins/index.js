import messageBox from './MessageBox/main'
import Vue from 'vue'
const defaultOptions = {
  message: '确认删除？',
  title: '提示',
  callback: ''
}
const Plugins = {
  install: Vue => {
    Vue.prototype.$metaMessage = {
      confirm(options = defaultOptions){
        return messageBox(options)
      }
    }
  }
}
export default Plugins
