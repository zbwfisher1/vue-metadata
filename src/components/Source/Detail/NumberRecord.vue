<template>
  <div class="source-body">
    <div class="boxCommon">
      <div class="table-title">
        <div class="table-title__text">
          <span>{{showLabel}}{{$t('content.source.bsmbgjlxq')}}</span>
        </div>
      </div>
      <div v-if="loading">
				<loading :isloading="loading"></loading>
			</div>
      <div v-else>
        <table class="table table-bordered tableList" v-if="!loading">
          <table-header
            :tableHeader = "tableHeader"
            :sort = "sort"
            :order = "order"
            @tableSort="tableSort"
          >
          </table-header>
          <tbody v-if="message.records && message.records.length>0">
          <tr v-for="item in message.records">
            <td>
              <div v-ellipsis="formatTime(item.stateTime*1000)"></div>
            </td>
            <td>
              <div v-ellipsis="item.name"></div></td>
            <td>
              <div v-ellipsis="item.path"></div>
            </td>
            <!-- <td>{{formatSize(item.totalSize)}}</td> -->
            <td>
              <span :class="{'operate-type-add': item.state==1, 'operate-type-del': item.state==2}">{{item.state==1?$t('content.common.xz'):$t('content.common.sc')}}</span>
            </td>
            <td><div v-ellipsis="item.description?item.description:''"></div></td>
          </tr>
          </tbody>
        </table>
        <no-data v-if="message.records && (message.records.length==0 && !loading)"></no-data>
        <div class="tablePages" v-else>
          <el-pagination background
            layout="total, prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="message.currentPage"
            :page-size="message.pageSize"
            :total="message.totalRows"
            v-if="message.totalRows>message.pageSize">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { getData } from 'utils'
  import { FormatTime, FormatSize } from 'mixins/common'
  export default{
    data(){
      return {
        loading: true,
        tableHeader: [
          {
            name: this.$t('content.source.czsj'),
    				type:"stateTime",
    				hasSort:true,
          },
          {
            name: this.$t('content.dataset.businessDetail.biaom'),
    				type:"name",
    				hasSort:false,
          },
          {
            name: this.$t('content.source.wldz'),
    				type:"path",
    				hasSort:false,
          },
          // {
          //   name: this.$t('content.dataset.datasetDetail.dx'),
    			// 	hasSort:false,
          // },
          {
            name: this.$t('content.source.czlx'),
    				hasSort:false,
          },
          {
            name: this.$t('content.dataset.businessDetail.miaos'),
    				hasSort:false,
          },
        ],
        tableList: [],
        sort: 'stateTime',
        order: 'desc',
        showLabel: '',
        message: {},
      }
    },
    mixins: [ FormatTime, FormatSize ],
    watch: {
      '$parent.projectId'(val){
        this.showLabel = this.$parent.showLabel;
        this.fetchData()
      }
    },
    created(){
      this.$store.dispatch('setSourceTitle', this.$t('content.source.bsmbgjlxq'));
      this.showLabel = this.$parent.showLabel;
      this.fetchData()
    },
    methods: {
      tableSort({sort,order}){
        this.sort = sort;
        this.order = order;
        this.fetchData();
      },
      async fetchData(page=1){
        this.loading = true;
        let url = `/space/getTableStateInfo?page=${page}&sort=${this.sort}&order=${this.order}&rows=10&projectId=${this.$parent.projectId}`;
        const res = await this.axios.get(url);
        const {message, statusCode} = res.body
        statusCode == 200 && Object.assign(this.$data, res.body)
        this.loading = false;
      },
      handleSizeChange(val) {
  	        console.log(`每页 ${val} 条`);
    	},
    	handleCurrentChange(val) {
        this.currentPage = val - 1
      	this.fetchData(val)
      	console.log(`当前页: ${val}`);
    	},
    }
  }
</script>
