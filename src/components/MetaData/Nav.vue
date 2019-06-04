<template>
  <transition name="fade">
    <div class="nav-container"
      v-show="$route.name == 'home' ? navVisible : true"
      @mouseenter="$route.name == 'home' && clear()"
      @mouseleave="$route.name == 'home' && navHidden()">
      <div class="mainType">
        <ul>
          <router-link tag="li"
              v-for="item in tabList"
              :to="{name: item.router}"
              class="mainType__li"
              :class="{active:tabActive == item.type}"
              @click.native="changeMenu(item.type)">
              <a class="mainType-box">
                  <i :class="'icon_'+item.id"></i>{{item.name}}
              </a>
          </router-link>
          <li class="searchBar" v-if="$route.name != 'home'">
            <div class="advance-search-container">
              <div style="position: relative; display: flex;">
                <div class="searchBar__container">
                  <div class="searchBar__opt" style="position:relative">
                    <div class="searchInput" :title="searchField.keywords">
                      <i class="el-icon-search searchBar__img"></i>
                      <input type="text"
                          class="form-control"
                          :placeholder="searchKeywordPlaceholder[searchType]"
                          v-model="searchField.keywords"
                          @focus="historySearch"
                          @keyup="keyupSearch"
                          @keydown.enter="routeSearch"/>
                      <div class="nav-search-select">
                        <el-select v-model="searchField.source" @change="routeSearch">
                          <el-option
                            v-for="item in selectTypeList"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                      <div class="searchResultList" v-if="searchVisible">
                        <ul>
                          <li v-for="(item,key) in tableFilterList"
                              v-html="item[0]"
                              @click="searchResult(item[1],item[2])">
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div class="searchBar__btn" @click="routeSearch">
                    {{$t("content.header.ss")}}
                  </div>
                </div>

                <home-search
                  :keyObj="searchField"
                  v-show="advanceSearchVisible"></home-search>
                  <a href="javascript:;" @click="advanceSearchVisible=!advanceSearchVisible">
                    {{$t('content.home.gjss')}}
                  </a>
                  <span class="advance-flag" v-if="advanceFlag">*</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script>
  import {testPrivilege,EmphasizeName, Message} from 'mixins/common' //搜索结果高亮
  import Vue from 'vue'
  import Bus from 'utils/bus'
  import HomeSearch from '../Home/HomeSearch'
  export default {
    name: 'Nav',
    mixins: [testPrivilege, EmphasizeName, Message],
    components: { HomeSearch },
    async created() {
      this.advanceFlag = false
      let path = this.$route.fullPath.split('/');
      this.tabActive = path[3] || 'Dataset';
      this.$store.dispatch('setBusiness', this.tabActive === 'Dataset');
      this.searchField.keywords = this.$route.query.keyword;
      await this.testPrivilege('/excelMetadataInfo/import');

      if(!this.hasPrivilege){   //产品上‘导入/出’功能模块，只有系统管理员和项目管理员可见
          this.tabList.pop();
      }
      Bus.$on('hidden', param => {
        this.advanceSearchVisible = param
        // this.hiddenOperate()
      })
    },
    mounted() {
      this.hiddenOperate()
    },
    data() {
      const vm = this
      return {
        advanceFlag: false,
        advanceSearchVisible: false,
        tabActive: "Dataset",
        tabList: [
          {
            type: 'home',
            name: this.$t('content.home.home'),
            id: 10,
            router: 'home'
          },
          {
          	type: 'business',
            name: this.$t("content.tree.ywst"),
            id: "11",
            router: 'Dataset'
          },
          {
          	type: 'metro',
            name: this.$t('content.tree.wlst'),
            id: "12",
            router: 'Physical'
          },
          {
          	type: 'Personal',
            name: this.$t('content.personal.gldb'),
            id: "13",
            router: 'Personal'
          },
          {
            type: 'ImportExport',
            name: vm.$t('content.dataset.importExport.drdc'),
            id: '14',
            router: 'ImportExport'
          }
        ],
        tableFilterList: [],
        showDelete: false,
        // 显示搜索框的位置
        searchType: "datasets",//暂时只有数据集
        searchKeywordPlaceholder: {
          all: this.$t("content.header.srbmhlcm"),
          datasets: this.$t("content.header.srbm"),
          flows: this.$t("content.header.srlcm"),
        },
        searchTypeObj: {
          all: this.$t("content.header.qb"),
          datasets: this.$t("content.header.sjj"),
          flows: this.$t("content.header.sjgc"),
        },
        //搜索显示结果
        searchVisible: false,
        isSearch: null,
        selectTypeList: [

          { label: this.$t('content.header.qb'), value: 'all' },
          { label: this.$t('content.dataset.businessDetail.biaom'), value: 'name' },
          { label: this.$t('content.dataset.businessDetail.biem'), value: 'businessName' },
          { label: this.$t('content.dataset.datasetDetail.sjms'), value: 'description' },
          { label: this.$t('content.dataset.datasetDetail.ywyy'), value: 'bizMeaning' },
          { label: this.$t('content.dataset.datasetDetail.zid'), value: 'fieldName' },
          { label: this.$t('content.dataset.datasetDetail.zdms'), value: 'fieldComment' },
          { label: this.$t('content.dataset.datasetDetail.kzzd'), value: 'extendFields' },
        ],
        searchField: {
          keywords: '',
          source: 'all',
          searchType: 'datasets'
        }
      }
    },
    computed: {
      path(){
        return this.$route.path;
      },
      language(){
        return this.$store.state.language
      },
      navVisible(){
        return this.$store.state.navVisible
      },
      clearTimeoutId(){
        return this.$store.state.clearTimeout
      },
    },
    watch: {
      advanceSearchVisible(val){
        if(val){
          this.searchVisible = false
        }
      },
      'searchField.source'(val){
        if(val){
          this.$store.dispatch('sourceType', val)
        }else{
          this.searchField.source = 'all'
          this.$store.dispatch('sourceType', 'all')
        }
      },
      '$route': function (val) {
        this.advanceFlag = false
        this.hiddenOperate()
        if(val.name != 'SearchResult'){
          Bus.$emit('clearSearch', '')
          this.searchField.source = 'all'
        }


        const {keyword} = val.query;
        const curView = this.$route.name;
        const actPath = this.path.split("/")[3];
        this.tabActive = actPath;
        curView !== "SearchResult" ? this.delectInput() : keyword ? this.showDelete = true : this.historySearch()

        if(this.$route.name == 'SearchResult'){
          this.searchField.source = this.$store.state.setSearchParams.source
          this.searchField.keywords = this.$route.query.keyword
        }

        if(val.name == 'SearchResult'){
          let searchParams = this.$store.state.setSearchParams
          let keys = Object.keys(searchParams)
          keys.forEach(key => {
            if(searchParams[key] && key != 'source'){
              this.advanceFlag = true
            }
          })
        }

      },
      language(val){
        Vue.config.lang = val
        this.tabList = [
          {type: "Dataset", name: this.$t("content.header.sjj"), id: "0"},
          {type: "Personal", name: this.$t('content.personal.grsj'), id: "10"},
        ]
        this.searchKeywordPlaceholder = {
          all: this.$t("content.header.srbmhlcm"),
          datasets: this.$t("content.header.srbm"),
          flows: this.$t("content.header.srlcm"),
        }
      }
    },
    methods: {
      hiddenOperate(){
        const vm = this
        window.addEventListener('click', function(e){
          let target = $(e.target).hasClass('searchBar__container') || $(e.target).parents().hasClass('searchBar__container')
          if (!target) {
            vm.searchVisible = false;
          }

          let target2 = ($(e.target).hasClass('home-search-select-container')||$(e.target).parents().hasClass('home-search-select-container'))
          if(!target2 && $(e.target).text().trim() != vm.$t('content.home.gjss')){
            vm.advanceSearchVisible = false
          }else if($(e.target).text().trim() == vm.$t('content.home.gjss')){
            if(vm.searchField.keywords){
                vm.advanceSearchVisible = true
              }else{
                vm.advanceSearchVisible = false
                vm.message(vm.$t('content.header.srbm'))
            }
          }
        })
      },
      clear(){
        // this
        clearTimeout(this.clearTimeoutId)
      },
      navHidden(){
        let id = setTimeout(()=> this.$store.dispatch('navVisible', false), 1000)
        this.$store.dispatch('clearTimeout', id)
      },
      changeMenu(type){
        type != 'home' && this.$store.dispatch('navVisible', true)

        this.$store.dispatch('changeTableTypeOpts', '0,1,2')
        this.$store.dispatch('saveTableName', '')
        this.$store.dispatch('saveDatasetKeyword', "")
        this.$store.dispatch('setModelOpen', false)

        if(type == 'business' || type == 'metro'){
          if(type == 'business'){
            // this.$router.push({name: 'Dataset'})
            this.$store.dispatch('setBusiness', true)
          }else{
            // this.$router.push({name: 'Physical'})
            this.$store.dispatch('setBusiness', false)
          }

          const {path} = this.$route;

          if(this.$store.state.navIsData){
            Bus.$emit('initTree')
          }
          this.$store.dispatch('saveNavData', true);
        }else{
          this.$store.dispatch('saveNavData', false)
        }
      },
      searchTypeChange(type){
        this.searchType = type;
        this.searchField.keywords = ''
        this.fetchFilterData()
      },
      keyupSearch(e = window.event){
        const vm = this
        if(this.searchField.keywords && this.searchField.keywords.trim() == ''){
          this.searchField.keywords = ''
          return;
        }
        this.searchField.keywords = e.target.value ? e.target.value : this.searchField.keywords;
        this.searchField.keywords == '' && this.historySearch()
        clearTimeout(this.isSearch)
        if (this.searchField.keywords) {
          this.isSearch = setTimeout(() => vm.fetchFilterData(), 300);
        }
      },
      delectInput(){
        this.searchVisible = false
        this.searchField.keywords = ""
        this.showDelete = false
      },

      routeSearch(){
        this.$store.dispatch('setSearchParams',{
          upstreamSystem: '',
          sourceTable: '',
          topicPath: ''
        })
        this.advanceFlag = false
        this.searchVisible = false
        Bus.$emit('clearSearch', '')
        this.advanceSearchVisible = false

        const keyword = this.searchField.keywords
        if (!keyword) {
          return;
        }
        this.$store.dispatch('setSearchParams', {
          source: this.searchField.source
        })
        this.$router.push({
          name: 'SearchResult',
          query: {category: this.searchField.searchType, keyword, t: new Date().getTime()}
        })
      },
      historySearch(){
        if (this.searchField.keywords != '') {
          this.keyupSearch()
          return;
        }
        this.advanceSearchVisible = false
        const url = "/search/recent";
        this.axios.get(url).then((res) => {
          if (res.body.statusCode != 200) {
            return
          } else {
            const result = res.body.message;
            const _result = [];
            result.map(val => {
              const arr = [];
              arr.push(val.keyword, val.keyword, val.category);
              _result.push(arr)
            })
            this.searchVisible = true;
            this.tableFilterList = _result;
          }
        }, (response) => {
          // error callback
        });
      },
      searchResult(item, category){
        if (!category) {
          category = this.searchType;
        }
        this.searchField.keywords = item;
        this.searchVisible = false;

        this.$router.push({
          name: 'SearchResult',
          query: {category: category, keyword: item, advance: false, t: new Date().getTime()}
        });
      },
      async fetchFilterData(page = 1){
        if (this.searchField.keywords) {
          let _category = this.searchType;
          let _url = "";
          let searchKeyword = this.searchField.keywords;
          let keyword = encodeURIComponent(searchKeyword);
          _url = `/search/autocomplete?category=${_category}&keyword=${keyword}&rows=10&page=${page}`;
          const res = await this.axios.get(_url)
          if (res.body.statusCode == 200) {
            const queryData = res.body.message.records;
            let _result = [];
            queryData.map((item) => {
              let _item = this.emphasizeName(item, searchKeyword);
              _result.push([_item, item]);
            });
            this.searchVisible = true;
            this.tableFilterList = _result;
          } else {
            this.searchVisible = false;
            this.tableFilterList = [];
          }
        }
      },
    }
  }
</script>
<style lang="less">
  @import '~assets/less/metaData-nav';
  .nav-container{
    margin-left: 61px;
    // a,a:hover {
    //     text-decoration: none;
    // }
    a:focus {
        color: #5a6779;
    }
  }
  .mainType{
    ul{
      .mainType__li{
        border: none;
        &:hover{
          text-decoration: none;
        }
      }
    }
  }
  .mainType .router-link-active {
      width: 100px;
      background: #FAFAFA;
  }
  .mainType .router-link-active .mainType-box {
      background: #E2E4E9;
  }
  .advance-search-container{
    position: relative;
    display: flex;
    a{
        vertical-align: top;
      line-height: 40px;
      margin-left: 20px;
    }
  }
  .nav-search-select{
    width: 140px;
    .el-input input{
      width: 100%;
        text-align: right;
    }
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active 在低于版本 2.1.8 中 */ {
    opacity: 0
  }
  .advance-flag{
    line-height: 38px;
  }

  .el-select-dropdown__item, .el-select-dropdown__item.selected.hover{
    width: 100% !important;
  }
</style>
