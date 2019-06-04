<template>
  <div>
    <div
      class="propertiesContent"
      v-if="isAbled && isEditable"
      @dblclick="editItem">
      <span v-if="showValue">{{showValue}}</span>
      <span class="ali-placeholder" v-else>{{placeholder}}</span>
    </div>
     <el-form-item :prop="propsName" v-else>
        <el-input v-model="editorValue"
        :class="{disabled:isAbleds}"
        :placeholder="placeholder"
        type="text" v-focus="!isEdit"
        @blur="doneEdit" @keyup.enter="doneEdit" @keyup.esc="cancelEdit"
        @change="emitSetValue"></el-input>
      </el-form-item>
    </div>
</template>
<script>
  import Bus from 'utils/bus'
  export default{
    props: {
      isAbled: {
        require: true,
        type: Boolean
      },
      showValue: {
        type: String
      },
      placeholder: {
        type: String
      },
      propsName: {
        type: String
      },
    },
    data: function(){
      return {
        editorValue: '',
        isEditable: true
      }
    },
    watch: {
      isAbled: function(val, oldVal){
        this.editorValue = this.showValue;
      }
    },
    directives: {
      'focus': function (el, binding) {
        if (binding.value) {
          $(el).find('input').focus();
        }
      }
    },
    methods: {
      editItem(){
          this.editorValue = this.showValue;
          this.beforeEditCache = this.editorValue;  //用过取消这次编辑
          this.isEditable = false;
      },
      emitSetValue(){
        let value = this.propsName;
        this.$emit('setValue', {[value]: this.editorValue})
      },
      doneEdit(){
        let self = this;
        this.$emit('doneEdit');
        Bus.$on('formValidate', function (status) {
          self.isEditable = status;
        })
      },
      cancelEdit() {
        this.editorValue = this.beforeEditCache;
      }
    }
  }
</script>
