<template>
    <!-- 管理专区 > 申请记录 -->
  <div class="boxCommon">
    <div class="table-title">
      <div class="table-title__text">
        <span>{{$t('content.personal.sqjllb')}}</span>
      </div>
      <div class="table-title__btns">
        <Search
            :placeholder="$t('content.validator.qsrbm')"
            emitName="recordSearch"
            @recordSearch="fetchData">
        </Search>
      </div>
    </div>
    <loading :isloading="loading"/>
    <template v-show="!loading">
      <el-table
          v-show="!loading"
          :data="formatStatus"
          border
          :default-sort = "{prop: 'create_time', order: 'descending'}"
          @sort-change="sortTable">
        <el-table-column
          prop="tableName"
          sortable="custom"
          :label="$t('content.dataset.businessDetail.biaom')">
          <template slot-scope="scope">
              <span v-if="scope.row.isDeleted">{{emphasizeName(scope.row.tableName,key)}}</span>
            <item-jump v-else  :params="{
              params:{
                path:scope.row.path,
                level:3
              },
              disabled: scope.row.disable === 1,
              isfolder: false}"
              :name = "emphasizeName(scope.row.tableName,key)"
              :datasetId = "scope.row.datasetId"
              :view = "false"
              :isPrivate = "scope.row.isPrivate"
              :isDeleted = "scope.row.isDeleted">
            </item-jump>
          </template>
        </el-table-column>
        <el-table-column
                prop="create_time"
                sortable="custom"
                :label="$t('content.personal.sqsj')">
            <template slot-scope="scope">
                {{formatTime(scope.row.create_time*1000)}}
            </template>
        </el-table-column>
        <el-table-column
          prop="description"
          :label="$t('content.dataset.datasetDetail.bms')"
        >
        </el-table-column>
        <el-table-column
          sortable="custom"
          prop="ownedProject"
          :label="$t('content.personal.ssxm')"
        >
        </el-table-column>
        <el-table-column
          prop="usedProject"
          :label="$t('content.personal.qxssxm')"
        >
        </el-table-column>
        <el-table-column
          class="approver-container"
          prop="md_approver"
          :label="$t('content.personal.shzh')"
        >
          <template slot-scope="scope">
            <el-popover
              ref="popover4"
              placement="bottom"
              trigger="hover">
              <div>
                <ul class="approver-ul"
                >
                  <!-- 当审核账号返回全由逗号隔开 -->
                  <template v-if="scope.row.md_approver.split(',').length>0">
                    <li v-for="(item,index) in scope.row.md_approver.split(',')">
                      <div>
                        <div class="approver-name">
                          {{item}}
                        </div>
                        <!-- 当审核账号只有一个的时候 -->
                        <div class="approver-flow"
                          v-if="scope.row.md_approver.split(',').length == 1"
                          >
                          <img :src="getSrc(scope.row.status_mark)" />
                          <span v-html="getShowData(scope.row.status_mark)"></span>
                        </div>
                        <!-- 当审核账号只有多个的时候 -->
                        <div class="approver-flow"
                          v-else-if="index<(scope.row.md_approver.split(',').length-1)"
                          style="color: green;">
                            <img src="../../../assets/images/approver-pass.png" />
                            通过
                        </div>
                        <div v-else class="approver-flow">
                          <img :src="getSrc(scope.row.status_mark)" />
                          <span v-html="getShowData(scope.row.status_mark)"></span>
                        </div>
                      </div>
                      <img width="30" v-if="index<(scope.row.md_approver.split(',').length-1)" src="../../../assets/images/approver-flow.png"/>
                    </li>
                  </template>
                  <!-- 当审核账号返回全由'/'隔开 -->
                  <template v-else>
                    <li>
                      <div>
                        {{scope.row.md_approver}}
                      </div>
                      <div class="approver-flow" style="color: orange;">
                        <img src="../../../assets/images/approver-wait.png" />
                        待审核
                      </div>
                    </li>
                  </template>
                </ul>
              </div>
            </el-popover>
            <div v-ellipsis="scope.row.md_approver"></div>
          </template>
        </el-table-column>
        <el-table-column
          prop="status_mark"
          :label="$t('content.common.zhuangt')">
          <template slot-scope="scope">
            <div v-html="scope.row.status_mark"></div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('content.dataset.datasetDetail.cz')">
          <template slot-scope="scope">
            <div class="personal-control">
              <i :title="$t('content.common.ckxq')"
                @click="viewDetails({id,tableName} = scope.row)"
                class="icon iconfont icon-chakanxiangqing"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="tablePages">
        <el-pagination background
        layout="total, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="totalRows">
        </el-pagination>
      </div>
    </template>
    <!-- <no-data v-if="formatStatus.length==0&&!loading"></no-data> -->
      <el-dialog
        :title="$t('content.dataset.datasetDetail.sqqx')"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        custom-class="dialogComment"
          @click.native.stop>
          <el-form
            label-width="160px">
            <el-form-item
              :label="item.label"
              v-for="item in permissionsDetail"
              v-if="!(item.field ==='opinion'&&!item.content)">
               <el-col :span="20">
                 <div class="grid-content detailCon">{{item.content}}</div>
              </el-col>
            </el-form-item>
          </el-form>
          <loading :isloading="elLoading" isTree="true"/>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">{{$t('content.common.qd')}}</el-button>
        </div>
      </el-dialog>
  </div>
</template>
<script>
  import item from 'common/TableItemJump'
  import Search from 'common/Search'
  import {FormatTime,EmphasizeName,SortTable} from 'mixins/common'
  import ItemJump from 'common/ItemJump'
  export default{
    name:"PersonalRecord",
    mixins:[FormatTime,EmphasizeName,SortTable],
    components: {
      item,
      Search,
      ItemJump,
    },
    data(){
      return {
        tableHeader:[
        {
          name:this.$t('content.dataset.datasetDetail.bm'),//表名
          type:"tableName",
          hasSort:true,
        },
        {
            name:this.$t('content.personal.sqsj'),
            type:"create_time",
            hasSort:true,
        },
        {name: this.$t('content.dataset.datasetDetail.ms'), hasSort: true, type: 'description'},
        {
          name:this.$t('content.personal.bssxm'),
          type:"ownedProject",
          hasSort:true,
        },{
          name:this.$t('content.personal.qxssxm'),
          type:"pusedProject",
          hasSort:false,
        },{
          name:this.$t('content.personal.shzh'),
          type:"audit_account",
          hasSort:false,
        },{
          name:this.$t('content.common.zhuangt'),
          type:"status",
          hasSort:false,
        }],
        sort: "create_time",
        order: "desc",
        records:[],
        currentPage:1,//当前页
        pageSize:0,//每页记录数
        totalRows:0,//总记录数
        dialogVisible:false,
        formParamsArr:[
            {field:"table_name",label: this.$t('content.personal.zzsqdbw'),content:""},
            {field:"type",label:this.$t('content.dataset.datasetDetail.qxlx'),content:""},
            {field:"project_name",label:this.$t('content.dataset.datasetDetail.sygbqxdxm'),content:""},
            {field:"reason",label:this.$t('content.dataset.datasetDetail.sqly')+':',content:""},
            {field:"final_approver",label:this.$t('content.personal.shr')+':',content:""},
            {field:"md_msg",label:this.$t('content.personal.jjyy'),content:""},
        ],
        details:{},
        loading:true,
        key:"",
        elLoading: true   //Element组件中的Loading
      }
    },
    computed:{
      formatStatus: function (value) {
        if (!value) return ''
          let status_mark= "";
          this.records.forEach(val=>{
            switch(val.md_result){
               case 0:
                  val.status_mark = `<span style="color: orange;">${this.$t('content.personal.dsh')}</span>`
                  break;
              case 1:
                  val.status_mark = `<span style="color: green;">${this.$t('content.personal.shtg')}</span>`
                  break;
              case 11:
                  val.status_mark = `<span style="color: orange;">${this.$t('content.personal.shz')}</span>`
                  break;
              case 2:
                  val.status_mark = `<span style="color: red;">${this.$t('content.personal.shbtg')}</span>`
                  break;
              }
          })
          return this.records;
      },
      permissionsDetail(){
        function isEmptyObject(obj){
           for(var n in obj){return false}
           return true;
        }
        const _isEmptyObject = isEmptyObject.call(null,this.details);
        if(_isEmptyObject){
          return this.formParamsArr
        }else{
          const formParamsArr = this.formParamsArr;
          const details = this.details;
          const {type} = details;
          details.type = Array.from(type,(val)=> val === "r" ? this.$t('content.authority.r') : this.$t('content.authority.w')).join(",");
          return formParamsArr.map((val)=>{
            const field = val.field;
            if(field && Object.prototype.hasOwnProperty.call(details, field)){
              if((field == 'md_msg' || field == 'final_approver') && details[field] == undefined || details[field] == ''){
                  return ''
              }

              this.$set(val,"content",details[field])
              return val;
            }
          })
        }
      },//详情数据
    },
    methods:{
      getShowData(html){
        const match = html.match(/<span .*?>(.*?)<\/span>/)
        const context = match['1']
        let text = context
        switch (context)
        {
          case '审核不通过':
            text='拒绝';
            break;
          case '审核通过':
            text = '通过';
            break;
        }
        const matchText = html.replace(context, text)
        return matchText;
      },
      getSrc(type){
        const vm = this
        const imgObj = {
          [vm.$t('content.personal.shbtg')]: require('../../../assets/images/approver-dispass.png'),
          [vm.$t('content.personal.shtg')]: require('../../../assets/images/approver-pass.png'),
          [vm.$t('content.personal.shz')]: require('../../../assets/images/approver-wait.png'),
          [vm.$t('content.personal.dsh')]: require('../../../assets/images/approver-wait.png'),
        }
        let getTypeName = type.replace(/<.+?>/g, '')
        let img = imgObj[getTypeName]
        return img
      },
      reasonTxt(reason){
          if(reason == '当前用户没有在项目里面分配组，无法提交资源权限请求。'){
              return this.$t('content.personal.myqxz')
          }else if(reason == '当前用户已经拥有该资源权限，不需要提交请求。'){
              return this.$t('content.personal.yyqx')
          }else if(reason == 'get wrong message when approvling,please try again later'){
              return this.$t('content.personal.leapidspsb')
          }else if(reason == 'approvle failed'){
              return this.$t('content.personal.leapidspsb')
          }else{
              return reason
          }
      },
      tableSort({sort,order}){
        this.sort = sort;
        this.order = order;
        this.fetchData({
            key: this.key
          });
      },
      async fetchData({key = "",currentPage = 1} = {}){
        let url = ''
        if(this.sort){
          url = `/privilege/getPrivilegeApplys?keyword=${escape(key)}&sort=${this.sort}&order=${this.order}&page=${currentPage}&rows=10`;
        }else{
          url = `/privilege/getPrivilegeApplys?keyword=${escape(key)}&sort=tableName&order=asc&page=${currentPage}&rows=10`;
        }

        this.loading = true;
        this.key = key;
        const res = await this.axios.get(url);
        const {statusCode} = res.body;
         this.loading = false;
         statusCode === 200 ? Object.assign(this.$data,res.body.message) :  this.records=[]
        },
      async viewDetails({id, tableName, opinion, md_msg, final_approver}){
        this.dialogVisible = true;
        this.elLoading = true;
        const url = `/privilege/${id}/getPrivilegeApplyInfo`;
        const res = await this.axios.get(url);
        let {statusCode, message} = res.body;
        opinion = opinion === "null" ? '' : opinion;
        final_approver = final_approver === "null" ? '' : final_approver;
        md_msg = md_msg === "null" ? '' : md_msg;

        md_msg = this.reasonTxt(md_msg)

        let table_name = tableName;
        statusCode === 200 ? Object.assign(message, {table_name, opinion, md_msg, final_approver}) : message = {};

        this.details = message;
        this.elLoading = false;   //请求结束，model已经有数据了，关闭loading层
      },
        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
          const params = {
            currentPage: val,
            key: this.key
          }
          this.fetchData(params)
        }
    },
    created(){
      this.fetchData()

    }
  }
</script>
<style lang="less">
  .detailCon{
    margin-top: 7px;
    line-height: 26px;
    word-break: break-all;
  }
  .el-tooltip__popper.newLight {
    line-height: 24px;
    padding: 5px;
    color:#666;
    box-shadow: 1px 1px 2px 2px #ddd;
    border: 1px solid #ccc;
  }
  .el-tooltip__popper.newLight[x-placement^=right] .popper__arrow{
    border-right-color:#ccc;
  }
  .el-dialog__body {
    position: relative;
  }
  .el-dialog__body .loading-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /*background-color: #f3f3f3;*/
  }
  .el-form-item{
    margin-bottom: 0;
  }
  .loading-container img {
    transform: translate(-50%,-50%);
    position: absolute;
    top: 50%;
    left: 50%;
  }
  .approver-ul{
    display: flex;
    li{
      display: flex;
      // flex-grow: 1;
      height: 50px;
      text-align: center;
      align-items: center;
      flex-grow: 1;
      >div{
        flex-grow: 1;
        margin: 0 15px;
        line-height: 20px;
      }
    }
  }
  .approver-flow{
    img{
      height: 25px;
      width: 25px;
    }
  }
  .approver-name{
    line-height: 30px;
  }
</style>
