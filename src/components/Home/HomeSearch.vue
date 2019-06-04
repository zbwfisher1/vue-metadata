<template>
  <div class="home-search-select-container">
    <h4>{{$t('content.home.qtcxtj')}}：</h4>
    <ul>
      <li>
        <el-row :gutter="10">
          <el-col :span="7">
            <label for="">{{$t('content.home.sszt')}}:</label>
          </el-col>
          <el-col class="theme-select-container" :span="17" style="position: relative;">
            <el-input @click.native="showSelectContanier"
                      :placeholder="$t('content.home.qxzzt')"
                      readonly
                      v-model="params.topicPath"
                      :title="params.topicPath"></el-input>
            <div class="theme-select"
              v-if="showSelectVisible">
              <el-input
                :placeholder="$t('content.header.srbm')"
                v-model="theme"
                debounce="300"
                @keyup.native="fetchTopicTree(theme)"
              ></el-input>
              <div class="search-topic-tree-container"
                :style="{'overflow-y': treeNoData ? 'auto': 'scroll'}">
                <div class="boder-cover cover-top"></div>
                  <no-data :noDataVisible="treeNoData"></no-data>
                  <topic-tree
                    style="overflow: hidden;"
                    v-if="topicTrees.length>0"
                    :model="topicTrees">
                  </topic-tree>
                <div class="boder-cover cover-bottom"></div>
              </div>
            </div>
          </el-col>
        </el-row>
      </li>
      <li>
        <el-row :gutter="10">
          <el-col :span="7">
            <label for="">{{$t('content.home.sslyxt')}}:</label>
          </el-col>
          <el-col :span="17">
            <el-select
              popper-class="source-select"
              filterable
              v-model="params.upstreamSystem"
              :title="params.upstreamSystem">
              <el-option
                :style="{width: $route.name == 'home' ? '420.734px' : '233.734px'}"
                v-for="item in upstreams"
                :label="item.upstreamSystem"
                :value="item.upstreamSystem">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </li>
      <li>
        <el-row :gutter="10">
          <el-col :span="7">
            <label for="">{{$t('content.home.ybgnmk')}}:</label>
          </el-col>
          <el-col :span="17">
            <el-select
              popper-class="source-select"
              filterable
              :title="params.sourceTable"
              v-model="params.sourceTable">
              <el-option
                :style="{width: $route.name == 'home' ? '420.734px' : '233.734px'}"
                v-for="item in sourceTables"
                :label="item.sourceTable"
                :value="item.sourceTable">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </li>
    </ul>
    <footer>
      <!-- <div class="search-tips" v-show="tipVisible">
        {{$t('content.header.')}}
      </div> -->
      <div class="home-search-button">
         <el-button @click="resetValidators" type="primary">
             {{$t('content.home.cz')}}
        </el-button>
        <el-button @click="cancel">
          {{$t('content.home.guanb')}}
          <!-- {{$t('content.common.qx')}} -->
        </el-button>
      </div>
    </footer>
  </div>
</template>
<script>
  import Bus from 'utils/bus'
  import { httpRequest, hiddenClick } from 'utils'
  import TopicTree from './TopicTree'
  export default{
    name: 'HomeSearch',
    data () {
      return {
        showSelectVisible: false,
        theme: '',
        upstreams: [], //所属来源系统下拉列表
        sourceTables: [], //源表功能模块下拉列表
        topicTrees: [], //所属主题树状图列表
        // tipVisible: false,
        treeNoData: false,
        params: {
          upstreamSystem: '',
          sourceTable: '',
          topicPath: '',
          source: this.$store.state.sourceType
        }
      }
    },
    props: {
      keyObj: { type: Object }
    },
    components: {
      TopicTree
    },
    computed: {
      sourceType(){
        return this.$store.state.sourceType;
      }
    },
    watch: {
      'params.topicPath'(val){
        this.routeSearch('sourtopicPath', val)
      },
      'params.upstreamSystem'(val){
        this.routeSearch('upstreamSystem', val)
      },
      'params.sourceTable'(val){
        this.routeSearch('sourceTable', val)
      }
    },
    created () {
      this.fetchAllData()
      Bus.$on('searchTopic', data => {
        this.topicTrees = data
        if(data.length == 0){
          this.treeNoData = true
        }else{
          this.treeNoData = false
        }
        this.setOpen(this.topicTrees)
      })
      Bus.$on('clearSearch', ()=>{
        this.params = {
          upstreamSystem: '',
          sourceTable: '',
          topicPath: ''
        }
      })
    },
    mounted () {
      const vm = this
      //更新主题树状图列表
      Bus.$on('selectTopic', (path)=>{
        this.selectTopic(path)
      })

      Bus.$on('hidden', param => {
        this.showSelectVisible = param
      })
      hiddenClick('theme-select-container', 'showSelectVisible', vm)
    },
    methods: {
        resetValidators(){
            this.params = {
                upstreamSystem: '',
                sourceTable: '',
                topicPath: ''
            }
        },
      hiddenTheme(){
        const vm = this
        window.onclick = function (e) {
          let target3 = ($(e.target).hasClass('theme-select-container')||$(e.target).parents().hasClass('theme-select-container'))
          if(!target3){
            vm.showSelectVisible = false
          }
        }
      },
      async fetchAllData () {
        this.fetchTopicTree()
        Promise.all([this.fetchUpstream(),
                     this.fetchSourceTable()])
              .then( result => {
                //所属来源系统
                this.upstreams = result[0]
                //源表功能模块
                this.sourceTables = result[1]
              })
      },
      async fetchUpstream () {
        const res = httpRequest({vm: this, url: '/search/upstream'})
        return res.then( res => res )
      },
      async fetchSourceTable () {
        const res = httpRequest({vm: this, url: '/search/sourceTable'})
        return res.then( res => res)
      },
      fetchTopicTree (key=null) {
        const vm = this
        const data = {
            level: 0,
            page: 1,
            path: "",
            rows: 10000,
            key
          }
        const res = httpRequest({vm,
                                url: '/search/topicTree',
                                type: 'post',
                                data})
        res.then(res => Bus.$emit('searchTopic', res.records))
      },
      setOpen(topicTrees){
        topicTrees.forEach(tree => {
          if(tree.children){
            this.$set(tree, 'open', true)
            this.setOpen(tree.children.records)
          }else{
            this.$set(tree, 'open', false)
          }
        })
      },
      selectTopic(path){
        this.params.topicPath = path
        this.showSelectVisible = false
      },
      dispatchHighSearch(){

        this.$store.dispatch('setSearchParams',
          Object.assign(this.params, {
            source: this.keyObj.source
          })
        )




        // if(this.keyObj.keywords){
        //   this.tipVisible = false
        //   this.$store.dispatch('setSearchParams',
        //     Object.assign(this.params, {
        //       source: this.keyObj.source
        //     })
        //   )
        //   this.routeSearch()
        // } else {
        //   this.tipVisible = true
        // }
      },
      showSelectContanier(){
        this.showSelectVisible = !this.showSelectVisible
        this.showSelectVisible && this.hiddenTheme()
      },
      cancel(){
        Bus.$emit('hidden', false)
      },
      routeSearch(type, val){
        this.params.source = this.sourceType

        this.$store.dispatch('setSearchParams',
          Object.assign(this.params, {
            [type]: val
          })
        )

        this.$router.push({
          name: 'SearchResult',
          query: {category: this.keyObj.searchType, keyword: this.keyObj.keywords, t: new Date().getTime()}
        })
      }
    }
  }
</script>
<style lang="less">
  .boder-cover{
    border-left: 1px solid #ffffff;
    height: 22px;
    position: relative;
    margin-left: 20px;
  }
  .cover-top{
    margin-bottom: -18px;
  }
  .cover-bottom{
    margin-top: -15px;
  }
  .home-search-select-container{
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    z-index: 10;
    background: #fff;
    box-shadow: 0 10px 20px 2px rgba(0,0,0,.15);
    border: 1px solid #E3E8EA;
    padding: 20px;
    .search-tips{
      color: red;
    }
    .el-col-17{
      padding: 0 !important;
    }
    h4{
      color: #999999;
      font-size: 14px;
      margin-bottom: 20px;
    }
    li{
      margin-bottom: 15px;
      label{
        width: 110px;
        text-align: right;
        margin-right: 10px;
        line-height: 30px;
      }
    }
    .el-select{
      width: 100%;
    }
    footer{
      position: relative;
      margin-top: 30px;
      height: 30px;
      .search-tips{
        position: absolute;
        left: 0;
        top: 0;
      }
      .home-search-button{
        position: absolute;
        right: 0;
        top: 0;
      }
    }
  }
  .theme-select{
    position: absolute;
    padding: 10px;
    width: 100%;
    z-index: 1;
    background: #fff;
    li{
      margin-bottom: 0;
      line-height: 30px;
    }
  }
  .source-select {
    li {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 285px;
    }
  }
</style>
