<template id="">
  <div class="source-body">
      <el-row :gutter="20" class="row-totalCount">
        <el-col :span="item.span" v-for="item in sourceList">
           <source-list
            :listTitle="item.listTitle"
            :labelTitle="item.labelTitle"
            :total="item.total"
            :linkText="item.linkText"
            :routerName="item.routerName"
            :tableName="$parent.showLabel">
          </source-list>
        </el-col>
      </el-row>
      <el-row class="row-List clearfix" type="flex" justify="space-between">
        <el-col :span="8" class="border-right space-usage-container">
            <div class="grid-title">
              <span v-if="$parent.showLabel == '' || $parent.showLabel == $t('content.header.qb')">{{$t('content.source.jqcczbxq')}}</span>
              <span v-else>{{$parent.showLabel}}{{$t('content.source.xmcczbxq')}}</span>
            </div>
            <loading :isloading="totalSpaceUsagePieLoading"></loading>
            <!-- <no-data v-if="!totalSpaceUsagePieLoading && ($parent.projectId!='' && allTotalSize==0 && totalSize == 0)"></no-data> -->
            <no-data v-if="!totalSpaceUsagePieLoading && showTotalPie"></no-data>
            <template v-else>
              <pie-chart v-if="!totalSpaceUsagePieLoading && (allTotalSize!=0 || capacityTotal != 0)" :pieOptions="totalSpaceUsagePie"
              ></pie-chart>
              <div class="space-usage-legend" v-if="!totalSpaceUsagePieLoading">
                <ul>
                  <li v-for="item in legendData">
                    {{item.name}}:&nbsp;{{item.value}}&nbsp;
                    <span v-if="item.name != $t('content.source.ysycc')">
                      {{/NaN/.test(item.percent) ? '0.00%' : item.percent}}
                    </span>
                  </li>
                </ul>
              </div>
            </template>
        </el-col>
        <el-col :span="15">
          <div class="chart-header-container">
            <div class="grid-title">
              <span v-if="$parent.showLabel == '' || $parent.showLabel == $t('content.header.qb')">{{$t('content.source.jqccsyqst')}}</span>
              <span v-else>{{$parent.showLabel}}{{$t('content.source.xmccsyqst')}}</span>
            </div>
            <div style="float: right;">
              <el-select
               v-model="totalSpaceUsage"
               class="rank-list-select"
               placeholder="请选择时间"
               @change="fetchTotalSpaceUsageChart">
                 <el-option
                 v-for="item in lineSelect"
                 :label="item.label"
                 :value="item.value"
                 ></el-option>
               </el-select>
             </div>
           </div>
           <loading :isloading="totalSpaceUsageLineLoading"></loading>
           <no-data v-if="!totalSpaceUsageLineLoading && lineData.length==0"></no-data>
           <highcharts
             v-if="!totalSpaceUsageLineLoading && lineData.length>0"
            :options="totalSpaceUsageLine"
           ></highcharts>
        </el-col>
      </el-row>
      <el-row class="row-List clearfix"
          v-if="!$parent.projectId"
          type="flex"
          justify="space-between">
        <el-col :span="8" class="right-space">
          <div class="grid-title">{{$t('content.source.dbccsyzb')}}</div>
          <loading :isloading="DBSpaceUsagePieLoading"></loading>
          <no-data v-if="!DBSpaceUsagePieLoading && reDBRankList.length==0"></no-data>
          <pie-chart
            :title="totalSize"
            :pieOptions="DBSpaceUsagePie"
            v-if="!DBSpaceUsagePieLoading && reDBRankList.length!=0"
          ></pie-chart>
        </el-col>
        <el-col :span="7" class="border-right">
          <header class="rank-list-header">
      			<h4 class="ranklist-title">{{$t('content.source.gddbccphxq')}}</h4>
      			<a href="javascript:;"
      				class="rankList-btn"
      				@click="pushRouter('SourceDatabase')"
              v-if="reTableList.length!==0">{{$t('content.common.ckgd')}}></a>
      		</header>
          <loading :isloading="DBRankListLoading"></loading>
          <no-data v-if="!DBRankListLoading && reDBRankList.length==0"></no-data>
          <rank-list
            v-if="!DBRankListLoading && reDBRankList.length!=0"
            targetRouter="SourceDatabase"
            :model="reDBRankList"
          ></rank-list>
        </el-col>
        <el-col :span="7" class="rank-list-container">
          <div class="chart-header-container">
            <div class="grid-title">
              {{$t('content.source.dbxzcczytop10')}}
            </div>
            <el-select
            v-model="dbChangeSelect"
            class="rank-list-select"
            placeholder="请选择时间"
            @change="fetchDbChangeRecent">
              <el-option
              v-for="item in timeSelect"
              :label="item.label"
              :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <rank-list
          v-if="!dbChangeListLoading && reDbChangeRecentList.length!=0"
          :model="reDbChangeRecentList"
          ></rank-list>
          <loading :isloading="dbChangeListLoading"></loading>
          <no-data v-if="!dbChangeListLoading && reDbChangeRecentList.length==0"></no-data>
        </el-col>
      </el-row>
      <el-row class="row-List clearfix" type="flex" justify="space-between">
        <el-col :span="8" class="right-space">
          <div class="grid-title">
            <span v-if="showLabel!=$t('content.header.qb')">{{$parent.showLabel}}</span>
            {{$t('content.source.bcczb')}}
          </div>
          <loading :isloading="datasetLoading"></loading>
          <no-data v-if="!datasetLoading && reTableList.length==0"></no-data>
          <pie-chart
            v-if="!datasetLoading && reTableList.length != 0"
            :title="totalSize"
            :pieOptions="datasetPie"
          ></pie-chart>
        </el-col>
        <el-col :span="7" class="border-right">
          <header class="rank-list-header">
      			<h4 class="ranklist-title">{{$t('content.source.gdbdxphxx')}}</h4>
      			<a href="javascript:;"
      				class="rankList-btn"
      				@click="pushRouter('SourceDataset')"
              v-if="reTableList.length!==0">{{$t('content.common.ckgd')}}></a>
      		</header>
          <loading :isloading="datasetLoading"></loading>
          <no-data v-if="!datasetLoading && reTableList.length==0"></no-data>
          <rank-list
            v-if="!datasetLoading && reTableList.length!=0"
            targetRouter="SourceDataset"
            :model="reTableList"
          ></rank-list>
        </el-col>
        <el-col :span="7" class="rank-list-container">
          <div class="chart-header-container">
            <div class="grid-title">
              <span v-if="showLabel!=$t('content.header.qb')">{{$parent.showLabel}}</span>
              {{$t('content.source.bccxzzbtop10')}}
            </div>
            <el-select
            v-model="tableChangeSelect"
            class="rank-list-select"
            placeholder="请选择时间"
            @change="fetchTableChangeRecent">
              <el-option
              v-for="item in timeSelect"
              :label="item.label"
              :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <rank-list
          v-if="!tableChangeListLoading && reTableChangeRecentList.length!=0"
          :model="reTableChangeRecentList"
          ></rank-list>
          <loading :isloading="tableChangeListLoading"></loading>
          <no-data v-if="!tableChangeListLoading && reTableChangeRecentList.length==0"></no-data>
        </el-col>
      </el-row>
  </div>

</template>
<script>
  import SourceList from './SourceList'
  import PieChart from 'components/common/PieChart'
  import RankList from 'components/common/RankList'
  import {ChartColor, getData, setRankList} from 'utils'
  import { ToThousand, FormatSize } from 'mixins/common'

  import echarts from 'echarts/lib/echarts'
  import pie from 'echarts/lib/chart/pie'
  import tooltip from 'echarts/lib/component/tooltip'
  import title from 'echarts/lib/component/title'
  import legend from 'echarts/lib/component/legend'

  export default{
    components: {
      SourceList,
      PieChart,
      RankList,
    },
    data(){
      return {
        chartColor: ChartColor,
        totalSpaceUsageLine: {},
        totalSpaceUsagePie: {},
        DBSpaceUsagePie: {},
        datasetPie: {},
        dbNum: 0,
        tableNum: 0,
        filesTotal: 0,
        totalSize: 0,
        capacityTotal: 0,
        allTotalSize: 0,
        totalSpaceUsagePieSeries: [],
        DBRankList:[],
        tableList: [],
        DbChangeRecentList: [],
        tableChangeRecentList: [],
        dbChangeSelect: 'D',
        tableChangeSelect: 'D',
        totalSpaceUsage: 'W',
        lineSelect:[
          {
            value: 'W',
            label: this.$t('content.source.zjyz'),
          },
          {
            value: 'M',
            label: this.$t('content.source.zjygy'),
          },
          {
            value: 'Y',
            label: this.$t('content.source.zjyn'),
          },
          {
            value: 'X',
            label: this.$t('content.source.lssy'),
          }
        ],
        timeSelect: [
          {
            value: 'D',
            label: this.$t('content.source.zjyt'),
          },
          {
            value: 'W',
            label: this.$t('content.source.zjyz'),
          },
          {
            value: 'M',
            label: this.$t('content.source.zjygy'),
          },
          {
            value: 'Y',
            label: this.$t('content.source.zjyn'),
          },
        ],
        totalSpaceUsagePieLoading: true,
        totalSpaceUsageLineLoading: true,
        DBSpaceUsagePieLoading: true,
        DBRankListLoading: true,
        dbChangeListLoading: true,
        tableChangeListLoading: true,
        datasetLoading: true,
        showLabel: '',
        chartLegend: [],
        lineNum: 1,
        lineData: [],
        legendData: [],
        showTotalPie: false,
        capacityRemaining: 0
      };
    },
    mixins: [ ToThousand, FormatSize ],
    async created(){
      this.showLabel = this.$parent.showLabel;
      // this.$store.dispatch('resetTableTypeOpts') // 重置左侧菜单选择条件
      this.$store.dispatch('setSourceTitle', '');
      this.fetchDbChangeRecent()
      this.fetchTableChangeRecent()
      await this.fetchGeneralInfo()
      this.fetchTotalPercent()
      await this.fetchSpaceUsageForDb()
      this.showDBSpaceUsagePie()
      this.fetchTotalSpaceUsageChart()
      await this.fetchSpaceUsageForTable()
      this.showDatasetPie()

    },
    watch:{
      async '$parent.projectId'(val){
        await this.fetchGeneralInfo()
        this.showLabel = this.$parent.showLabel
        this.DBSpaceUsagePieLoading = true
        this.fetchTableChangeRecent()
        this.fetchTotalPercent()
        this.fetchTotalSpaceUsageChart()
        await this.fetchSpaceUsageForTable()
        if(!val){
          this.fetchDbChangeRecent()
          await this.fetchSpaceUsageForDb()
          this.showDBSpaceUsagePie()
        }
        this.showDatasetPie()
      }
    },
    computed: {
      sourceList(){
        return [
          {
            span: 12,
            listTitle: this.$t('content.import.sjk'),
            labelTitle: this.$t('content.source.sjkzs'),
            total: this.dbNum,
          },
          {
            span: 12,
            listTitle: this.$t('content.common.sjb'),
            labelTitle: this.$t('content.source.sjbzs'),
            total: this.tableNum,
            linkText: this.$t('content.source.ckbsmbgjl'),
            routerName: 'NumberRecord'
          },
          // {
          //   span: 8,
          //   listTitle: 'HDFS',
          //   labelTitle: this.$t('content.source.wjjzs'),
          //   total: this.filesTotal,
          // },
        ]
      },
      reDBRankList(){
        return setRankList(this, this.DBRankList, new Map([['name', 'dbName'],['num', 'totalSize']]), true)
      },
      reTableList(){
        return setRankList(this, this.tableList, new Map([['num', 'size']]), true)
      },
      reDbChangeRecentList(){
        return setRankList(this, this.DbChangeRecentList, new Map([['name', 'dbName'], ['num', 'totalChangeSize']]), true)
      },
      reTableChangeRecentList(){
        return setRankList(this, this.tableChangeRecentList, new Map([['name', 'tableName'], ['num', 'totalChangeSize']]), true)
      },
      sourceUserMessage(){
        return this.$store.state.sourceUserMessage
      }
    },
    methods: {
      async fetchTotalPercent(){
        this.totalSpaceUsagePieLoading = true;
        const res = await this.axios.get('/space/getClusterInfo')
        this.totalSpaceUsagePieLoading = false;
        const {message, code , statusCode} = res.body
        this.showTotalPie = code == -200 ? true : false
        statusCode == 200 && Object.assign(this.$data, message)
        this.showTotalSpaceUsagePie()
      },
      pushRouter(targetRouter){
        this.$router.push({name: targetRouter})
      },
      async fetchGeneralInfo(){
        const res = await this.axios.get(`/space/getGeneralInfo?id=${this.$parent.projectId}`);
        const {message, statusCode} = res.body;
        statusCode == 200 && Object.assign(this.$data, message)
      },
      async fetchTotalSpaceUsageChart(){
        this.totalSpaceUsageLineLoading = true;
        let num = 1;
        let type = 'W'
        if(this.totalSpaceUsage == 'X'){
          num = 3;
          type = 'Y';
        }else{
          type = this.totalSpaceUsage;
        }
        const res = await this.axios.get(`/space/getTotalSpaceUsageChart?num=${num}&type=${type}&projectId=${this.$parent.projectId}`);
        this.totalSpaceUsageLineLoading = false;
        const {message, statusCode} = res.body;
        if(statusCode == 200){
          this.lineData = message;
          this.$nextTick(()=>{
            this.showTotalSpaceUsageChart(message)
          })
        }
      },
      async fetchSpaceUsageForDb(){
        let url = `/space/getSpaceUsageForDb?page=1&sort=totalSize&order=desc&rows=10&projectId=${this.$parent.projectId}`;
        this.DBRankList = await getData(this, url);
        this.DBRankListLoading = false;
        this.DBSpaceUsagePieLoading = false;
      },
      async fetchSpaceUsageForTable(){
        this.datasetLoading = true;
        const vm = this;
        let url = `/space/getSpaceUsageForTable?page=1&rows=10&sort=size&order=desc&projectId=${this.$parent.projectId}`;
        this.tableList = await getData(this, url);



        this.datasetLoading = false;
      },
      async fetchDbChangeRecent(){
        this.dbChangeListLoading = true;
        let url = `/space/getDbChangeRecent?page=1&sort=totalChangeSize&order=desc&rows=10&num=1&type=${this.dbChangeSelect}&projectId=${this.$parent.projectId}`;
        this.DbChangeRecentList = await getData(this, url);
        this.dbChangeListLoading = false;
      },
      async fetchTableChangeRecent(){
        this.tableChangeListLoading = true;
        let url = `/space/getTableChangeRecent?page=1&sort=totalChangeSize&order=desc&rows=10&num=1&type=${this.tableChangeSelect}&projectId=${this.$parent.projectId}`
        this.tableChangeRecentList = await getData(this, url);
        this.tableChangeListLoading = false;
      },
      showTotalSpaceUsageChart(data){
        let categories = [],
            series = [],
            vm = this;
        let singleObj = {name: '', data: []};
        Array.from(data, value=>{
          categories.push(value.createDate);
          singleObj['data'].push(value.maxTotalSize)
        })
        series.push(singleObj)
        this.totalSpaceUsageLine = {
          title: {
              text: '',
            },
            xAxis: {
              gridLineColor:"#e0e0e0",
              gridLineWidth:1,
              lineColor:"#e0e0e0",
              tickLength:0,
              categories
            },
            yAxis: {
              title: {
                text: ''
              },
              gridLineColor:"#e0e0e0",
              labels: {
                formatter: function () {
                    return vm.formatSize(this.value)
                }
              },
              lineWidth: 1,
    					lineColor: '#d6d9dc',
            },
            credits: {
                enabled: false
            },
            colors: ChartColor,
            tooltip: {
              backgroundColor:'#ab9fff',
              borderColor:'#ab9fff',
              borderRadius: 0,
              style: {
                color: '#fff',
              },
              headerFormat: '',
              pointFormatter(){
                return `<div>\
                        <div>${vm.$t('content.common.rq')}: ${this.category}</div><br/>
  											<div>${vm.$t('content.dataset.datasetDetail.dx')}: ${vm.formatSize(this.y)}</div>
  									 </div>`
              }
            },
            legend: {
              enabled: false
            },
            series,
         }
      },
      showTotalSpaceUsagePie(){
        const vm = this;
        this.totalSpaceUsagePieSeries = []
        this.legendData = []
        let legendName = []
        let single1,single2;
        if(this.sourceUserMessage.roleLevel == 1 && !this.$parent.projectId){
          single1 = {name: this.$t('content.source.ysycc'), value: this.totalSize}
          // single2 = {name: this.$t('content.source.sycc'), value: this.capacityTotal- this.totalSize}
          single2 = {name: this.$t('content.source.sycc'), value: this.capacityRemaining}
        }else if(this.sourceUserMessage.roleLevel == 2 || this.$parent.projectId){
          single1 = {name: this.$t('content.source.dqxmcc'), value: this.totalSize}
          single2 = {name: this.$t('content.source.qtxmcc'), value: Math.abs(this.allTotalSize- this.totalSize)}
        }

        this.totalSpaceUsagePieSeries.push(single1, single2)
        let total = (this.sourceUserMessage.roleLevel == 1 && !this.$parent.projectId) ? this.capacityTotal : this.allTotalSize;
        this.totalSpaceUsagePieSeries.every(n=>!!n) && this.totalSpaceUsagePieSeries.forEach(val=>{
          let singleObj = {
            name: val.name,
            value: this.formatSize(val.value),
            percent: ((val.value/total)*100).toFixed(2)+ '%'
            // percent: (val.value/total?(((val.value/total)*100).toFixed(2)):0)+ '%'
          }
          this.legendData.push(singleObj)
        })
        this.$set(this.totalSpaceUsagePie, 'title', {
          text: ''
        })
        this.$set(this.totalSpaceUsagePie, 'series', [{
            type: 'pie',
            name: '',
            radius: ['50%', '70%'],
            labelLine: {
              normal: {
                lineStyle: {
                  color: '#e0dfdf'
                }
              }
            },
            tooltip: {
              backgroundColor: '#ab9fff',
              borderRadius: 0,
              formatter(params){
                return `${params.name}: ${vm.formatSize(params.value)} (${params.percent}%)`
              }
            },
            avoidLabelOverlap: false,
            data: this.totalSpaceUsagePieSeries
        }])
        this.$set(this.totalSpaceUsagePie.series[0],'label', {normal: {
          show:false,
          formatter(params){
            return `${params.percent}%`
          },
          textStyle: {
            color: '#838d9d',
          }
        }})
      },
      showDBSpaceUsagePie(){
        let DBSeries = [];
        let topTotalSize = 0;
        let otherSize = 0
        this.DBRankList.forEach(value=>{
          let singleObj = {}
          topTotalSize += value.totalSize
          singleObj.value = value.totalSize
          singleObj.name = value.dbName
          let singleNum = +value.percent.substring(0, value.percent.length - 1)
          if(singleNum>1){
            DBSeries.push(singleObj)
          }else{
            otherSize += singleNum
          }
        })
        if(otherSize>0&&this.DBRankList.length<9){
          let otherObj = {
            name: 'other',
            value: otherSize,
          }
          DBSeries.push(otherObj)
        }else if(this.DBRankList.length>9){
          DBSeries.push({name: 'other', value: this.totalSize - topTotalSize})
        }
        this.$set(this.DBSpaceUsagePie, 'title', {
          text: this.formatSize(this.totalSize),
          x: 'center',
          y: 'center'
        })
        this.$set(this.DBSpaceUsagePie,'series', [{
            type: 'pie',
            name: '',
            radius: ['50%', '70%'],
            label: {
              normal: {
                show:false
              }
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: '#e0dfdf'
                },
                show: false
              },
            },
            data: DBSeries,
        }])
      },
      showDatasetPie(){
        const vm = this
        let tableSeries = []
        let topTotalSize = 0
        let otherSize = 0
        // this.tableList.forEach(value=>{
        //   let singleObj = {}
        //   singleObj.name = value.name
        //   singleObj.value = value.size
        //   // topTotalSize += value.size
        //   // let singleNum = +value.percent.substring(0, value.percent.length - 1)
        //   tableSeries.push(singleObj)
        // })
        Array.from(this.tableList, value=>{
          let singleObj = {}
          singleObj.name = value.path
          singleObj.value = value.size
          topTotalSize += value.size
          let singleNum = +value.percent.substring(0, value.percent.length - 1)
          if(singleNum>1){
            tableSeries.push(singleObj)
          }else{
            otherSize += singleNum
          }
        })
        if(otherSize>0 && this.tableList.length<=9){
          let otherObj = {
            name: 'other',
            value: otherSize,
          }
          tableSeries.push(otherObj)
        }else if(this.tableList.length>9){
          tableSeries.push({name: 'other', value: this.totalSize - topTotalSize})
        }
        this.$set(this.datasetPie, 'colors', ChartColor)

        this.datasetPie = {
          title: {
            text: this.formatSize(this.totalSize),
            x: 'center',
		       	y: 'center'
          },
        //   colors: ChartColor,
        series: [
          {
          name:'',
          type:'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show:false
            }
          },
          labelLine: {
            normal: {
              lineStyle: {
                color: '#e0dfdf',
              },
              show: false
            }
          },
          tooltip: {
            backgroundColor:'#ab9fff',
            borderColor:'#ab9fff',
            borderRadius: 0,
            style: {
              color: '#fff',
            },
            headerFormat: '',
            formatter(params){
              let paramsArr = params.name.split('/')
              let name = paramsArr[paramsArr.length-1]
              return `${name}: ${params.percent}%`
            }
          },
          data: tableSeries,
        }]
        }
      }
    }
  }
</script>
<style lang="less" scope>
.el-row{
  margin-bottom: 20px;
}
.row-totalCount{
  .grid-content{
    background:#fff;
    padding:20px;
     h3{
      margin:0 0 15px 0;
      font-size: 15px;
      color: #91959f;
    }
  }
}
.source-list-container{
  background: #eff4f6;
  padding: 15px;
  h4{
    font-size: 14px;
    color: #858b96;
    margin-bottom: 20px;
    margin-top: 0;
  }
  span{
    font-size: 28px;
  }
}
.row-List{
  background: #fff;
  margin-bottom: 20px;
  padding: 25px;
}
.grid-title{
  float: left;
  font-size: 16px;
  color: #91959f;
  line-height: 30px;
}
.border-right{
  border-right: 1px solid #e5e5e5;
  margin-right: 25px;
  padding-right: 30px;
}
.right-space{
  margin-right: 25px;
  padding-right: 30px;
}
.rank-list-container{
  position: relative;
}
.space-usage-container{
  position: relative;
  .space-usage-legend{
    position: absolute;
    right: 10px;
    bottom: 10px;
    font-size: 12px;
    font-weight: bolder;
  }
}
.rank-list-header{
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
	h4{
		font-size: 16px;
		color: #91959f;
		margin:0;
	}
	a{
		flex-shrink:0;
	}
}
.rank-list-header .rankList-btn{
	color: #5a6779;
	text-decoration: underline;
}
</style>
