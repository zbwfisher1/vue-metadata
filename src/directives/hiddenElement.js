import Vue from 'vue'
import Bus from 'utils/bus'

Vue.directive('hidden', {
  inserted (el, binding) {
    const doms = el.children
    const className = el.className
    function addEvent(){
      getParent(event.target)
      function getParent(target){
        if (target.className && target.className == className || target.className == 'advance-search-container') {
          return;
        } else if (target.tagName == 'BODY' && target.text != '高级搜索'){
          window.removeEventListener('click', addEvent)
          el.style.display = 'none'
          Bus.$emit('hidden', false)
          return;
        } else {
          getParent(target.parentNode)
        }
      }
    }
    window.addEventListener('click', addEvent)
  }
})
