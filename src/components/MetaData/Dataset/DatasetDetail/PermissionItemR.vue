<template>
  <li class="permission-item">
    <el-checkbox-group v-model="typeList">
      <el-row>
        <el-col :span="12">
          <div v-ellipsis="item.name"></div>
        </el-col>
        <el-col :span="4" class="permission-item-operate">
          <el-checkbox
           label="r"
           :disabled="true">
          </el-checkbox>
        </el-col>
        <el-col :span="4" class="permission-item-operate">
          <el-checkbox
           label="w"
           :disabled="true">
          </el-checkbox>
        </el-col>
        <el-col :span="4" class="permission-item-operate">
          <!--<i class="el-icon-close select__del" @click.stop="emitDeletItem"></i>-->
        </el-col>
      </el-row>
  </el-checkbox-group>
  </li>
</template>
<script>
  import bus from 'utils/bus'
  export default{
    name: 'PermissionItemRight',
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
      }
    },
    watch: {
      'item.reType'(val){
        this.typeList = Array.from(val)
      },
      typeList(val){
        // if(!this.item.hasDisabled){
          this.addItem()
        // }
      }
    },
    created(){
      this.typeList = Array.from(this.item.reType)
    },
    methods: {
      emitDeletItem(){
        this.reItem = this.item
        this.$store.dispatch('deleteItem', this.item)
        bus.$emit('deletItemType', this.reItem)
        this.typeList = ['r', 'w']
      },
      addItem(){
        // console.log(this.item);
        if(!this.typeList.includes('r') || (this.typeList.length == 1 && this.typeList.includes('r') && this.item.initR)){
          this.emitDeletItem()
        }else{
          this.reItem = this.item
          this.$set(this.reItem, 'reType', this.typeList.join(''))
          this.$store.dispatch('selectItems', this.reItem)
        }




        // if(!this.reItem.reType || (this.reItem.reType == this.reItem.type)){
        //   this.emitDeletItem()
        // }
      }
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
