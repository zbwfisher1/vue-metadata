<template>
  <li class="dialog-item" v-if="model.folder && model.title !== 'hdfs'">
    <div class="tree-single-container" @click="toggle(model)">
      <i v-if="model.level!=3" :class="{isOpen: open}"></i>
      <i v-else class="level3Icon"></i>
      <span class="model-title">{{model.title}}</span>
      <el-radio class="radio" v-model="folderLocation" v-if="model.level==3" :label="labelInfo"></el-radio>
    </div>
    <ul v-if="open && hasChildren">
      <item v-for="model in model.children" :model="model"></item>
    </ul>
    <ul v-if="open && !hasChildren">
      <item v-for="model in treeChildren" :model="model"></item>
    </ul>
  </li>
</template>
<script>
  export default{
    name: "item",
    props:{
      model: Object,
      pathOpen: Boolean
    },
    data(){
      return {
        title: "workingcode",
        open: this.pathOpen,
        folderLocation: "",
        labelInfo: this.model.path,
        treeChildren: []
      }
    },
    created(){
    },
    methods: {
      toggle(model){
        // console.warn(this.folderLocation);
        // console.log(this.labelInfo);
        if(model.level == 3){
          // console.log(this.labelInfo)
          this.folderLocation = this.labelInfo;
          // console.warn(this.folderLocation);
          this.getPath(model);
          $('#dialogTree .el-radio__input').removeClass('is-checked');
          const elDom = this.$el;
          $(elDom).find('.el-radio__input').addClass('is-checked');
        }else{
          this.$store.dispatch('setPath', "");
          this.open = !this.open;
          this.fetchChildren(model);
        }
   
      },
      fetchChildren(model){
        let _url='/dataset/tree';
        let level = model.level;
        let path = model.path;
				let data = {
					level,
					path
				};
        if(!this.open){
          return;
        }
        this.axios.post(_url,
                        data,
                        {
                          contentType: 'application/json',
                          dataType: 'json'
                        }
                        )
                        .then((res)=>{
                            this.treeChildren = res.body;
                        })
      },
      getPath(model){
        let path = '';
        if(model){
          path = model.path;
        }
        else{
          let depth = this.model.level;
          if(depth == 3){
            path = this.model.path;
          }
        }
        this.folderLocation = path;
        this.$store.dispatch('setPath', path);
      },
    },
    computed: {
      hasChildren(){
        let children = !!this.model.children.length;
      }
    }
  }
</script>
<style>
.tree-single-container{
  line-height: 35px;
  position: relative;
}
.tree-single-container span{
  display: inline-block;
  cursor: pointer;
 }
.tree-single-container i{
  display: inline-block;
  width: 20px;
  height: 20px;
  vertical-align: middle;
  background: url(../../assets/images/folder_close.png) no-repeat center center;
  margin-left: 20px;
  margin-right: 5px;
}
.tree-single-container .radio{
  padding: 0;
  position: absolute;
  right: 5px;
}
.tree-single-container .isOpen{
  background: url(../../assets/images/folder_open.png) no-repeat center center !important;
}

</style>
