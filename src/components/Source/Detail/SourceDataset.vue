<template>
  <div class="datasetDetail datasourceDetail">
    <div class="tabCon">
      <div class="boxCommon" v-if="loading">
        <loading :isloading="loading"></loading>
      </div>
      <div class="boxCommon" v-else>
        <div class="table-title">
          <div class="table-title__text">
            <span>{{showLabel}}{{$t('content.source.bccphxq')}}</span>
          </div>
        </div>
        <table class="table table-bordered tableList">
          <table-header
            :tableHeader="tableHeader"
            :sort="sort"
            :order="order"
            @tableSort="tableSort">
            <th width="100">{{$t('content.dataset.datasetDetail.cz')}}</th>
          </table-header>
          <tbody v-if="databaseList.totalRows>0">
            <item v-for="(item, index) in databaseList.records">
              <td>{{(currentPage * pageSize) + index + 1}}</td>
              <td><div v-ellipsis="item.name"></div></td>
              <td>
                <div v-ellipsis="item.description"></div>
              </td>
              <td>{{formatSize(item.size)}}</td>
              <td>{{item.owner}}</td>
              <td><div v-ellipsis="formatTime(item.lastModifyTime*1000)"></div></td>
              <td>{{formatSize(item.changeSize)}}</td>
              <td class="table-button-parent">
                <div class="personal-control">
                  <i
                    class="icon iconfont icon-chakan"
                    @click="setDialogShow(item.datasetId)"
                    :title="$t('content.common.ckgd')"
                    ></i>
                  <!-- <a
                  href="javascript:;"
                  @click="setDialogShow(item.datasetId)">
                    {{$t('content.common.ckgd')}}
                  </a> -->
                </div>
              </td>
            </item>
          </tbody>
        </table>
        <div class="tablePages" v-if="databaseList.totalRows !== 0">
          <el-pagination background
            layout="total, prev, pager, next"
            @current-change="handleCurrentChange"
            :current-page="databaseList.currentPage"
            :page-size="databaseList.pageSize"
            :total="databaseList.totalRows"
            v-if="databaseList.totalRows>databaseList.pageSize"
            >
          </el-pagination>
        </div>
        <no-data v-else></no-data>
      </div>
    </div>
    <el-dialog
      :title="$t('content.common.xq')"
      :visible.sync="dialogVisible"
      @close = "closeAll"
      :close-on-click-modal="false"
      custom-class="dialogComment">
      <div class="date-picker-container">
        <span>{{$t('content.dataset.datasetDetail.xzsj')}}</span>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          :range-separator="$t('content.common.zhi')"
          :start-placeholder="$t('content.dataset.datasetDetail.ksrq')"
          :end-placeholder="$t('content.dataset.datasetDetail.jsrq')">
        </el-date-picker>
        <!-- <date-picker @fectchDate="fectchDate" ref="datePicker"></date-picker> -->
      </div>
      <div class="chart-container">
        <loading :isloading="dialogLoading"></loading>
        <highcharts v-if="chartMessage.length>0 && !dialogLoading" :options="createdTableOptions"></highcharts>
        <no-data v-if="chartMessage.length==0 && !dialogLoading"></no-data>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { FormatTime,FormatSize,FormatLifeDay} from 'mixins/common';
  import item from 'components/common/TableItemJump';
  export default {
    mixins: [ FormatTime,FormatSize,FormatLifeDay],
    components:{
      item,
    },
    data() {
      return {
        listColor: ['#fb7a53', '#ffbf01', '#ffdc16', '#92d14f', '#31c45e', '#50da9e', '#76e9e2', '#26d4ff', '#2cabf4', '#1064fe', '#f0f0f0'],
        tableHeader: [{
          name: this.$t('content.dataset.datasetDetail.xh'),
          type: "index",
          hasSort: false,
        },
          {
            name: this.$t('content.dataset.businessDetail.biaom'),
            type: "name",
            hasSort: false,
          },
          {
            name: this.$t('content.dataset.businessDetail.miaos'),
            type: "description",
            hasSort: false,
          },
          {
            name: this.$t('content.dataset.datasetDetail.dx'),
            type: "size",
            hasSort: false,
          },
          {
            name: this.$t('content.dataset.datasetDetail.sjfzr'),
            type: "owner",
            hasSort: false,
          },
          {
            name: this.$t('content.dataset.datasetDetail.zhgxsj'),
            hasSort: false,
          },
          {
            name:this.$t('content.dataset.datasetDetail.xzdx'),
            hasSort: false,
          }
        ],
        databaseList: {},
        loading: true,
        sort: "size",
        order: "desc",
        pageSize: 10,
        currentPage: 0,
        dialogVisible: false,
        createdTableOptions: {},
        chartMessage: [],
        begin_date: '',
        end_date: '',
        dateRange: null,
        categories: new Set(),
        series: new Set(),
        datasetId: '',
        isClear: true,
        message: {},
        records: [],
        showLabel: '',
        dialogLoading: false
      }
    },
    created() {
      this.$store.dispatch('setSourceTitle', this.$t('content.source.bccphxq'));
      this.showLabel = this.$parent.showLabel;
      this.fetchData()
    },
    mounted(){
      this.$watch('dialogVisible',(val)=>{
        this.dateRange = []
      })
    },
    watch: {
      dateRange(val){
        const [begin_date, end_date] = val ? val.map(date => Number(date)/1000) : ['', '']
        Object.assign(this.$data, {begin_date, end_date})
        this.dialogVisible && this.showChart()
      },
      '$parent.projectId'(val){
        this.showLabel = this.$parent.showLabel;
        this.fetchData();
      }
    },
    methods: {
      setDialogShow(id){
        this.datasetId = id;
        this.dialogVisible = true;
      },
      closeAll(){
        this.dialogVisible = false
        this.dateRange = []
      },
      fetchData(page = 1) {
        this.loading = true;
        const _url = `/space/getSpaceUsageForTable?sort=${this.sort}&order=${this.order}&page=${page}&rows=${this.pageSize}&projectId=${this.$parent.projectId}`;
        this.axios.get(_url).then(res => {
          this.loading = false;
          if (res.body.statusCode == 200) {
            this.databaseList = res.body.message
          } else {
            this.databaseList.records = []
          }
        })
      },
      async showChart(){
        this.dialogLoading = true
        // this.dialogVisible = true;
        let _url = this.begin_date ? `/datasets/getDatasetChangeDetail?dataset_id=${this.datasetId}&begin_date=${this.begin_date}&end_date=${this.end_date}` : `/datasets/getDatasetChangeDetail?dataset_id=${this.datasetId}`;
        const res = await this.axios.get(_url);
        this.dialogLoading = false
        const {statusCode} = res.body;
        statusCode==200?this.chartMessage = res.body.message : [];
        this.resolveData();
      },
      resolveData(){
        const vm = this;
        this.categories.clear();
        this.series.clear();
        let itemSeries = {name: this.$t('content.dataset.datasetDetail.xzb'), data: []};
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
            text: this.$t('content.dataset.datasetDetail.bsjxzxq'),
            style: {
              fontSize: '14px'
            }
          },
          tooltip: {
            backgroundColor:'#ab9fff',
            borderColor:'#ab9fff',
            borderRadius: 0,
            style: {
              color: '#fff',
            },
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
            borderRadius: 0,
            style: {
              color: '#fff',
            },
            pointFormatter(){
              return `<div>\
												${vm.$t('content.dataset.datasetDetail.bsjxz')}: ${vm.formatSize(this.y)}
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
        };
      },
      tableSort({sort, order}){
        this.sort = sort;
        this.order = order;
        this.currentPage = 0;  //重新排序，需要重置
        this.fetchData();
      },
      handleCurrentChange(val) {
        this.currentPage = val - 1;
        this.fetchData(val);
      }
    }
  }
</script>
<style>
  .datasourceDetail .dialogComment {
    width: 798px !important;
  }
</style>
