<template>
  <div class="permission-list-container">
    <el-row class="permission-list-header">
      <el-col :span="hasDelete ? 12 : 16">
        {{$t('content.dataset.datasetDetail.xmm')}}
      </el-col>
      <el-col :span="4" class="list-operate">
        {{$t('content.dataset.datasetDetail.du')}}
      </el-col>
      <el-col :span="4" class="list-operate">
        {{$t('content.dataset.datasetDetail.xie')}}
      </el-col>
      <el-col :span="4" v-if="hasDelete" class="list-operate">
        &nbsp
      </el-col>
    </el-row>
    <div class="permission-li-container">
      <ul>
        <component
          :is = "'permissionItem'+direction"
          v-for="(item, index) in permissionData"
          :item="item"
          :key="index"
        ></component>
      </ul>
    </div>
  </div>
</template>
<script>
  // import permissionItem from './PermissionItem'
  import permissionItemLeft from './PermissionItemL'
  import permissionItemRight from './PermissionItemR'
  import bus from 'utils/bus'
  export default{
    name: 'permissionList',
    components: {
      permissionItemLeft,
      permissionItemRight
    },
    props: {
      hasDelete: {
        type: Boolean,
        default: false,
      },
      permissionData: {
        type: Array,
        require: true
      },
      direction: {
        type: String
      }
    },
    mounted(){
      this.$nextTick(()=>{
        bus.$emit('selectItems', null)
      })
    }
  }
</script>
<style lang="less">
  .permission-list-container{
    height: 281px;
    background: #fff;
    border: 1px solid #e2e2e2;
    font-size: 12px;
    .permission-list-header{
      line-height: 36px;
      background: #f9f9f9;
      padding-left: 15px;
      border-bottom: 1px solid #e2e2e2;
    }
    .permission-li-container{
      height: 242px;
      overflow-y: auto;
    }
    .el-checkbox-group{
      font-size: 12px;
    }
    .el-row{
      margin-bottom: 0;
    }
    .list-operate{
      text-align: center;
    }
  }
</style>
