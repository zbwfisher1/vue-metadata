<template>
  <div v-if="typeof folder.open != 'undefined'">
    <div class="search-item-contianer">
      <div class="border-bottom-style"></div>
      <a href="javascript:;"
        @click.stop="selectTopic(folder.path)"
        class="item-href">
        <span class="folder-title" :title="folder.title">
          {{folder.title}}
        </span>
      </a>
      <i class="folder-icon"
        @click="toggleTree">
        <span v-if="folder.hasChild">
          {{folder.open ? '-' : '+'}}
        </span>
      </i>
    </div>
    <topic-tree
      v-if="folder.children"
      :model="folder.children.records"></topic-tree>
  </div>
</template>
<script>
  import { httpRequest } from 'utils'
  import Bus from 'utils/bus'
  import TopicTree from './TopicTree'
  export default{
    name: 'TopicTreeItem',
    props: [ 'folder' ],
    data(){
      return {
        treeData: []
      }
    },
    components: {
      TopicTree
    },
    watch: {
      'folder.open'(newVal){
        if(newVal){
          this.requestChildren()
        }else{
          this.folder.children = {}
          this.treeData = []
        }
      }
    },
    methods: {
      selectTopic(path){
        Bus.$emit('selectTopic', path)
      },
      toggleTree(){
        this.folder.open = !this.folder.open
      },
      requestChildren(){

        // const vm = this
        // const data = {
        //     level: 0,
        //     page: 1,
        //     path: "",
        //     rows: 10000,
        //     key
        //   }
        // const res = httpRequest({vm,
        //                         url: '/search/topicTree',
        //                         type: 'post',
        //                         data})
        // res.then(res => Bus.$emit('searchTopic', res.records))






        const _url = '/search/topicTree'
        const {level, path, title} = this.folder;
        const _data = {
              level,
              path,
              page: 1,
              rows: 20,
              status: '0,1,2'
            }

        this.axios.post(_url, JSON.stringify(_data),
          {contentType: 'application/json', dataType: 'json'})
          .then(res => {
            this.folder.children= res.body.message
            this.folder.hasChild = true
            this.folder.children.records.forEach( record => {
              this.$set(record, 'open', false)
            })
          })
      }
    }
  }
</script>
<style>
  .item-href:before{
    content: '●';
    margin-left: -1px;
    color: #dedede;
    height: 30px;
    line-height: 30px;
  }
  .search-item-contianer{
      width: 120px;
    position: relative;
  }
  .folder-icon:hover{
    cursor: pointer;
    font-style: normal;
  }
  .folder-icon{
    position: absolute;
    top: 1px;
    right: 10px;
    z-index: 14;
    font-size: 14px;
    font-style: normal;
  }
  .folder-icon:before{
    content: '';
    position: absolute;
    right: -10px;
    left: -10px;
    bottom: -5px;
    top: -5px;
  }
  .border-bottom-style{
    border-bottom: 1px solid #dcdcdc;
    position: relative;
    left: -999px;
    top: 16px;
    width: 1000px;
    z-index: 10;
  }
  .folder-title{
      overflow: hidden;
      padding-right: 15%;
      text-overflow: ellipsis;
      white-space: nowrap;
    display: inline-block;
    line-height: 30px;
    position: absolute;
    background: #fff;
    width: 100%;
    z-index: 10;
    padding-left: 5px;
    left: 6px;
  }
  .folder-title:hover{
    background: #eef6f6;
  }
</style>
