<template>
  <div class="datasetDetail datasourceDetail">
    <div class="tabCon">
      <div class="boxCommon" v-if="loading">
        <loading :isloading="loading"></loading>
      </div>
      <div class="boxCommon" v-else>
        <div class="table-title">
          <div class="table-title__text">
            <span>{{$t('content.source.sjkccphxp')}}</span>
          </div>
        </div>

        <table class="table table-bordered tableList">
          <table-header
            :tableHeader = "tableHeader"
            :sort = "sort"
            :order = "order"
            @tableSort="tableSort"
          >
            <th width="100">{{$t('content.dataset.datasetDetail.cz')}}</th>
          </table-header>
          <tbody v-if="databaseList.totalRows>0">
          <item v-for="(item, index) in databaseList.records">
            <td>{{(currentPage * pageSize) + index + 1}}</td>
            <td><div v-ellipsis="item.dbName"></div></td>
            <td>{{formatSize(item.totalSize)}}</td>
            <td>{{item.tableNum}}</td>
            <td><div v-ellipsis="item.projectName"></div></td>
            <td><div v-ellipsis="item.manager"></div></td>
            <td class="table-button-parent">
              <div class="personal-control">
                <i
                    class="icon iconfont icon-chakan"
                    @click="showChart(item.ref_id, item.dbName)"
                    :title="$t('content.common.ckgd')"
                    ></i>
              </div>
            </td>
          </item>
          </tbody>
        </table>
        <div class="tablePages" v-if="databaseList.totalRows !== 0">
          <el-pagination background
            layout="total, prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="databaseList.currentPage"
            :page-size="databaseList.pageSize"
            :total="databaseList.totalRows"
            v-if="databaseList.totalRows>databaseList.pageSize">
          </el-pagination>
        </div>
        <no-data v-else></no-data>
      </div>
    </div>


    <el-dialog
      :title="$t('content.common.xq')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @close = "closeAll"
      custom-class="dialogComment"
      size="large">
      <div class="chart-header">
        <el-tabs v-model="activeChart" type="card" @tab-click="resolveData">
          <el-tab-pane :label="$t('content.dataset.datasetDetail.bxzsl')" name="createdTable"></el-tab-pane>
          <el-tab-pane :label="$t('content.dataset.datasetDetail.xzccqk')" name="createdStorage"></el-tab-pane>
        </el-tabs>
        <div class="date-picker-container">
          <span>{{$t('content.dataset.datasetDetail.xzsj')}}</span>
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            :range-separator="$t('content.common.zhi')"
            :start-placeholder="$t('content.dataset.datasetDetail.ksrq')"
            :end-placeholder="$t('content.dataset.datasetDetail.jsrq')">
          </el-date-picker>
        </div>
      </div>
      <div class="chart-container" v-if="activeChart=='createdTable'">
        <loading :isloading="dialogLoading"></loading>
        <highcharts v-if="chartMessage.length>0 && !dialogLoading" :options="createdTableOptions"></highcharts>
        <no-data v-if="chartMessage.length == 0 && !dialogLoading"></no-data>
      </div>
      <div class="chart-container" v-else>
        <loading :isloading="dialogLoading"></loading>
        <highcharts v-if="chartMessage.length>0 && !dialogLoading" :options="createdStorageOptions"></highcharts>
        <no-data v-if="chartMessage.length==0 && !dialogLoading"></no-data>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { FormatSize } from 'mixins/common'
  import item from 'components/common/TableItemJump'
  export default {
    mixins: [ FormatSize ],
    components:{
      item
    },
    data() {
      return {
        dateRange: null,
        listColor: ['#fb7a53', '#ffbf01', '#ffdc16', '#92d14f', '#31c45e', '#50da9e', '#76e9e2', '#26d4ff', '#2cabf4', '#1064fe', '#f0f0f0'],
        tableHeader:[{
          name: this.$t('content.dataset.datasetDetail.xh'),
          type: "index",
          hasSort: false,
        },
          {
          name:this.$t('content.dataset.datasetDetail.km'),
          type:"dbName",
          hasSort:false,
        },
          {
            name: this.$t('content.dataset.datasetDetail.sjkdx'),
            type:"totalSize",
            hasSort:false,
          },
          {
            name: this.$t('content.dataset.datasetDetail.bsl'),
            type:"tableNum",
            hasSort:false,
          },
          {
            name: this.$t('content.personal.ssxm'),
            type:"projectName",
            hasSort:false,
          },
          {
            name: this.$t('content.dataset.datasetDetail.xmgly'),
            type:"manager",
            hasSort:false,
          }
        ],
        databaseList:{},
        loading:true,
        sort:"totalSize",
        order:"desc",
        currentPage: 0,
        pageSize: 10,
        dialogVisible: false,
        activeChart: 'createdTable',
        createdTableOptions: {},
        createdStorageOptions: {},
        chartMessage: [],
        categories: new Set(),
        series: new Set(),
        db_name: '',
        begin_date: '',
        end_date: '',
        isClear: false,
        message: {},
        ref_id: 0,
        begin_date: '',
        end_date: '',
        dialogLoading: false,
      }
    },
    created() {
      this.$store.dispatch('setSourceTitle', this.$t('content.source.sjkccphxp'));
      this.fetchData()
    },
    mounted(){
      this.$watch('dialogVisible', val=>{
        this.isClear = val ? true : false;
        this.activeChart = val ? this.activeChart : 'createdTable';
        this.dateRange = []
      })
    },
    watch: {
      dateRange(val){
        const [begin_date, end_date] = val ? val.map(date => Number(date)/1000) : ['','']
        Object.assign(this.$data, {begin_date, end_date})
        if(this.dialogVisible){
          this.showChart(this.ref_id, this.db_name)
        }
      },
      '$route': function(){
        this.fetchData()
      },
      '$parent.projectId'(val){
        this.fetchData()
      },
    },
    methods: {
      closeAll(){
        this.dialogVisible = false
        this.dateRange = []
      },
      fetchData(page = 1) {
          this.loading = true;
          let _url = `/space/getSpaceUsageForDb?sort=${this.sort}&order=${this.order}&rows=10&page=${page}&projectId=${this.$parent.projectId}`;
          this.axios.get(_url).then(res=>{
            this.loading = false;
            if(res.body.statusCode == 200 ){
              this.databaseList = res.body.message
            }else{
              this.databaseList.records = []
            }
          })
      },
      tableSort({sort,order}){
        this.sort = sort;
        this.order = order;
        this.currentPage = 0;  //重新排序，需要重置
        this.fetchData();
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.currentPage = val - 1;
        this.fetchData(val)
      },
      showChart(ref_id, db_name){
        this.dialogLoading = true
        this.ref_id = ref_id
        this.db_name = db_name
        this.dialogVisible = true
        this.fetchChartData()
      },
      async fetchChartData(){
        let _url = this.begin_date ? `/datasets/getDbChangeDetail?ref_id=${this.ref_id}&db_name=${this.db_name}&begin_date=${this.begin_date}&end_date=${this.end_date}` : `/datasets/getDbChangeDetail?ref_id=${this.ref_id}&db_name=${this.db_name}`;
        const res = await this.axios.get(_url);
        this.dialogLoading = false
        const {statusCode} = res.body;
        statusCode==200?this.chartMessage = res.body.message : [];
        this.resolveData();
      },
      resolveData(){
        let vm = this;
        this.categories.clear();
        this.series.clear();
        let itemSeries = {name: vm.$t('content.dataset.datasetDetail.xzb'), data: []};
        for(let [index, item] of this.chartMessage.entries()){
          this.categories.add(item.create_date);
          this.activeChart == 'createdTable' ? itemSeries.data.push(item.change_num) : itemSeries.data.push(item.change_size);
        }
        this.series.add(itemSeries);
        this.createdTableOptions = {
          chart: {
            height: 300,
            type: 'line'
          },
          title: {
            text: this.$t('content.dataset.datasetDetail.sjkxbxzqk', [vm.db_name]),
            style: {
              fontSize: '14px'
            }
          },
          xAxis: {
            title: {
              text: this.$t('content.source.sj'),
              align: 'high'
            },
            categories: [...this.categories]
          },
          yAxis: [{
            title: {
              text: this.$t('content.dataset.datasetDetail.bsl'),
              align: 'high',
              rotation: 0
            },
            plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
            }],
            minInterval: 1,
            lineWidth: 1,
            lineColor: '#d6d9dc',
	          allowDecimals:false
          }],
          tooltip: {
            backgroundColor:'#ab9fff',
            borderColor:'#ab9fff',
            borderRadius: 0,
            style: {
                color: '#fff',
            },
          },
          legend: {
            enabled: false
          },
          credits: {
            enabled: false
          },
          series: [...this.series]
        };

        this.createdStorageOptions = {
          chart: {
            height: 300,
            type: 'line'
          },
          title: {
            text: this.$t('content.dataset.datasetDetail.sjkxccxzqk', [vm.db_name]),
            style: {
              fontSize: '14px'
            }
          },
          xAxis: {
            title: {
              text: this.$t('content.source.sj'),
              align: 'high'
            },
            categories: [...this.categories]
          },
          yAxis: {
            title: {
              text: this.$t('content.dataset.datasetDetail.dx'),
              align: 'high',
              rotation: 0
            },
            plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
            }],
            lineWidth: 1,
            lineColor: '#d6d9dc',
            labels: {
							formatter(){
								return vm.formatSize(this.value)
							}
						}
          },
          tooltip: {
            backgroundColor:'#ab9fff',
            borderColor:'#ab9fff',
            style: {
                color: '#fff',
            },
            pointFormatter(){
              return `<div>\
											${vm.$t('content.dataset.datasetDetail.ccxz')}: ${vm.formatSize(this.y)}
									 </div>`
            }
          },
          legend: {
            enabled: false
          },
          credits: {
            enabled: false
          },
          series: [...this.series]
        }
      },
    }
  }
</script>
<style>
  .datasourceDetail .dialogComment{
    width: 798px !important;
  }
  .boxCommon {
    overflow-x: auto;
  }
  .chart-container{
    min-height: 300px;
  }
</style>
