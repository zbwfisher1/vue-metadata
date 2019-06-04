<template>
  <div class="source-container">
    <header class="source-header">
      <div class="source-title">
        <router-link :to="{name: 'SourceHome'}">{{$t("content.nav.cckj")}}</router-link>
        <span v-if="sourceTitle">
          <span>></span>
          <span>{{sourceTitle}}</span>
        </span>
        <span>({{$t("content.source.sjmtgx")}})</span>
      </div>
      <div class="project-selector" v-if="$route.name == 'SourceHome'">
        <label>{{$t("content.dataset.datasetDetail.xzxm")}}</label>
        <el-select
        v-model="projectId"
        @change="setLabel"
        @visible-change="setSelectTop"
        popper-class="project-select"
        class="project-list-container">
          <el-option
          v-for="(item, index) in sourceUserMessage.projectList"
          :key="index"
          :label="item.name"
          :value="item.id">
          </el-option>
        </el-select>
      </div>
    </header>
    <router-view></router-view>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  export default{
    data(){
      return {
        projectId: '',
        showLabel: '',
        scrollTop: 0
      }
    },
    beforeRouteUpdate (to, from, next) {
      if(to.name === "Source" && to.fullPath === "/Main/Source" ){
        next('SourceHome');  //导航到主页
      } else {
        next()
      }
    },
    mounted(){
    	this.$router.push({name: 'SourceHome'})
    },
    computed: {
      ...mapState(['sourceTitle']),
      sourceUserMessage(){
        if(this.$store.state.sourceUserMessage.projectList && this.$store.state.sourceUserMessage.projectList.length>0)
        this.projectId = this.$store.state.sourceUserMessage.projectList[0].id;
        return this.$store.state.sourceUserMessage
      }
    },
    methods: {
      setSelectTop(val){
        let selectElement = document.querySelector('body>.el-select-dropdown>.el-scrollbar>.el-select-dropdown__wrap');
        if (val) {
          let self = this;
          /*
          * 延迟滚动，此时节点已经渲染
          * */
          setTimeout(function () {
            selectElement.scrollTop = self.scrollTop;
          }, 100)
        } else {
          this.scrollTop = selectElement.scrollTop;
        }
      },
      setLabel(){
        let selectItem = this.sourceUserMessage.projectList.find(val=>{
          return val.id == this.projectId
        })
        this.showLabel = selectItem.name;
      }
    }
  }
</script>
<style>
  .project-selector label {
    vertical-align: top;
    margin-bottom: 0;
    margin-right: 10px;
    display: inline-block;
    line-height: 36px;
  }
    .project-select .el-select-dropdown__item {
        max-width: 200px;
    }
</style>
