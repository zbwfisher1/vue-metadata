<template>
  <li class="permission-item">
    <el-checkbox-group v-model="typeList">
      <el-row>
        <el-col :span="16">
          <div v-ellipsis="item.name"></div>
        </el-col>
        <el-col :span="4" class="permission-item-operate">
          <el-checkbox
           label="r"
           :title="item.initR?'已拥有该权限': ''"
           :disabled="item.initR">
          </el-checkbox>
        </el-col>
        <el-col :span="4" class="permission-item-operate">
          <!-- 已拥有该权限 -->
          <el-checkbox
           :title="item.initW?'已拥有该权限': ''"
           label="w"
           :disabled="item.initW">
          </el-checkbox>
        </el-col>
      </el-row>
    </el-checkbox-group>
  </li>
</template>
<script>
  import bus from 'utils/bus'
  export default{
    name: 'PermissionItemLeft',
    props: {
      item: {
        require: true
      },
      selectedType: {
        type: Array
      }
    },
    data(){
      return {
        typeList: [],
        reItem: {},
        index: 0,
        initLength: 0
      }
    },
    created(){
      const vm = this
      this.index = 0

      this.initLength = this.item.type ? this.item.type.length : 0
      bus.$on('deletItemType', item=>{
        this.index = 0
        if(item.name === this.item.name){
          this.typeList = this.item.type ? Array.from(this.item.type) : []
        }

        // item.initW && !this.typeList.includes('w') && this.typeList.push('w')
        // item.initR && !this.typeList.includes('r') && this.typeList.push('r')
        this.$store.dispatch('deleteItem', item)
      })
      // //初始化
      if(this.item.hasDisabled){
        this.typeList = this.item.type ? Array.from(this.item.type) : []
      }
      this.$store.dispatch('selectItems', null)
    },
    watch: {
      typeList(val, oldVal){
        ++this.index
        this.typeList = !oldVal.includes('w') && val.includes('w') ? ['r', 'w'] : this.typeList;
        this.typeList = oldVal.includes('r') && !val.includes('r') ? [] : this.typeList;
        if(this.index>this.initLength || !this.item.hasDisabled){
          this.addItem()
        }

        if(oldVal.length!==0 && val.length===0){
          this.$store.dispatch('deleteItem', this.item)
        }
      },
      'item.reType'(val){
        this.typeList = this.item.reType ? Array.from(this.item.reType) : this.typeList
      }
    },
    methods: {
      addItem(){
        this.reItem = this.item
        if(this.typeList.length>0){
          this.$set(this.reItem, 'reType', this.typeList.join(''))
          this.$store.dispatch('selectItems', this.reItem)
        }
      },
    }
  }
</script>
<style scope lang="less">
  .permission-item{
    height: 36px;
    line-height: 36px;
    border-bottom: 1px solid #e2e2e2;
    padding-left: 15px;
    .permission-item-operate{
      text-align: center;
      .is-disabled .el-checkbox__inner{
        background: #d1dbe5;
        border-color: #d1dbe5;
      }
    }
    .select__del{
			color: #c5c8d0;
			cursor: pointer;
		}
    .el-checkbox__label{
      display: none;
    }
  }
</style>
