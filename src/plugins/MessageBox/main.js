import Vue from 'vue'
import MessageBox from './MessageBox.vue'

function messageBox(options){
  let instance;
  const MessageInstance = Vue.extend(MessageBox)
  let newEl = document.createElement('div');
  newEl.className = 'message-box';
  document.body.appendChild(newEl);
  instance = new MessageInstance().$mount(newEl);
  for(let prop in options){
    instance[prop] = options[prop];
  }
  return instance;
}
export default messageBox;
