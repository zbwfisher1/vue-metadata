<template>
<div>
  <div class="tabCon">
    <div class="boxCommon">
       <div class="loading" v-if="tableConLoading"></div>
       <div class="con" v-else>
        <div class="tit">
            <span class="modelBtn">
               <a href="javascript:;" @click="downloadModel('模板下载')" ><span><img width="11px" height="13px" src="../../assets/images/icon_download.png"></span>模板下载</a>
            </span>
            <span class="modelBtn">
               <a href="javascript:;" @click="downloadModel('模板上传')" ><span><img width="11px" height="13px" src="../../assets/images/icon_upload.png"></span>模板上传</a>
            </span>
        </div>
        <table class="table table-bordered tableList" v-if="tableData.totalRows">
          <thead>
            <tr>
              <th>时间</th>
              <th>操作账号</th>
              <th>下载/上传总数</th>
              <th>导入目录</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for = "(val,key) in tableData.records">
              <td>{{formatTime(val.importTime)}}</td>
              <td>{{val.importUser}}</td>
              <td>{{val.tableCount}}</td>
              <td>{{val.path}}</td>
            </tr>
          </tbody>
        </table>
        <div class="tablePages">
          <el-pagination background
            layout="total, prev, pager, next"
            :total="tableData.totalRows"
            :page-size="tableData.pageSize"
            :current-page="tableData.currentPage"
            @current-change="handleCurrentChange">
          </el-pagination>
        </div>
          <!-- 模版下载 -->
        <el-dialog :title="dialogTitle"
              :close-on-click-modal= "false"
              :visible.sync="downDialogVisible"
              custom-class="dialogComment">
            <el-row>
              <el-col :span="5">
                  <div class="grid-content bg-purple">
                    <span>选择下载文件:</span>
                  </div>
              </el-col>
              <el-col :span="19">
                  <div class="grid-content bg-purple-light">
                      <div class="model modelDown">
                        <el-checkbox-group v-model="checkboxVal">
                          <ul class="listCon dbList" v-for = "val in modelDownList">
                              <li class="listSlicer tit" @click="foldToggle(val.type,val.open)">
                                 <div class="col-sm-12">
                                    <i class="fold"></i>
                                    <span>{{val.name}}</span>
                                 </div>
                              </li>
                              <ul v-if="val.open">
                                <li class="listItem tit" v-for="item in val.data">
                                  <div class="col-sm-10">
                                    <i class="fold"></i>
                                    <span>{{item.type}}</span>
                                  </div>
                                  <div class="col-sm-2">
                                      <el-checkbox :label="item.type"></el-checkbox>
                                  </div>
                                </li>
                              </ul>
                          </ul>
                        </el-checkbox-group>
                      </div>
                  </div>
              </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button @click.native="downDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click.native="download()">下 载</el-button>
          </span>
          </el-dialog>
          <!-- 模版上传 -->

          <el-dialog :title="dialogTitle"
                     :visible.sync="upDialogVisible"
                     :close-on-click-modal= "false"
                      custom-class="dialogComment">
               <el-row class="uploadCon">
                <el-col :span="5">
                    <div class="grid-content bg-purple">
                      <span class="selectTxt">选择本地文件:</span>
                    </div>
                </el-col>
              <form id="uploadForm" class="clearfix">
                <el-col :span="13">
                      <div class="grid-content bg-purple-light">
                         <el-input :value="selectFileInput"></el-input>
                      </div>
                </el-col>
                 <el-col :span="5" :offset="1">
                    <div class="grid-content bg-purple-light fileCon">
                       <el-button type="primary">点击上传</el-button>
                       <input type="file" name="fileField" class="file" @change="selectFile"/>
                    </div>
                </el-col>
                </form>
              </el-row>
            <el-row>
              <el-col :span="5">
                  <div class="grid-content bg-purple">
                    <span>选择上传目录:</span>
                  </div>
              </el-col>
              <el-col :span="19">
                  <div class="grid-content bg-purple-light">
                    <div class="model modelUp">
                       <el-radio-group v-model="checkList">
                        <ul class="dbList" style="background:#fff;">
                            <item v-for="model in modelUploadList" :model="model"></item>
                        </ul>
                      </el-radio-group>
                    </div>
                  </div>
              </el-col>
             </el-row>
            <span slot="footer" class="dialog-footer">
              <el-button @click.native="upDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click.native="upload()">上传</el-button>
            </span>
          </el-dialog>

            <div class="con" v-if="!tableData.totalRows">
              <div class="noData">
                <i></i>
                <p>暂无数据</p>
              </div>
          </div>
            <!-- 提示框 -->
        <message v-if="dialogVisible"
          @visible="dialogVisible = false">
          <p class="msg" slot="content">{{messageContent}}</p>
        </message>
      </div>
    </div>
  </div>
</div>
</template>

<script>

import { FormatTime } from 'mixins/common' //时间格式化
import item from "./UploadItem.vue"
import Message from 'components/Message'

export default {
  mixins: [ FormatTime ],
  data(){
    return{
      tableConLoading:true,
      dataTotal:0,//返回的数据数量
      currentPage:1,//当前页

      tableData:{},
      dialogTitle:'',
      downDialogVisible:false,
      upDialogVisible:false,
      selectFileInput:"",
      modelUploadList: [],

      modelDownList:[{  open:true,
                        type:'dataset',
                        name:'数据集',
                        data:[{type:'mysql'},{type:'oracle'},{type:'hive'},{type:'postgresql'},{type:'sqlserver'},{type:'hdfs'}]
                      },
                      {
                        open:false,
                        type:'flow',
                        name:"数据过程",
                        data:[{type:'oozie'},{type:'process'}]
                      }],
        //提示框
      dialogVisible:false,
      messageContent:"",
      checkboxVal:[],
        }

  },
  watch:{
    "downDialogVisible":function(){
      if(!this.downDialogVisible){
         this.checkboxVal = [];
      }
    }
  },
  computed:{
    checkList(){
         return this.$store.state.saveUploadDate;
    }
  },
  components:{
    item,
    Message
  },
  mounted(){
    this.fetchData(1);
  },
  methods:{
      fetchData(page){
        let _page= page || 1;
        let _url = `/api/v1/metaImport/history/ExcelImport?rows=10&page=${_page}`;
        this.axios.get(_url)
        .then(res => {
          this.tableConLoading = false;
          if(res.body.statusCode==200){
            this.tableData = res.body.message;
          }else{
            this.tableData.totalRows=0;
            return;
          }
        })
      },
    handleCurrentChange(page) {
        this.fetchData(page)
        // console.log(`当前页: ${currentPage}`);
    },
    foldToggle(type,open){
      if(type == "dataset"){
        this.modelDownList[0].open = !this.modelDownList[0].open
      }else{
        this.modelDownList[1].open = !this.modelDownList[1].open
      }
    },
    downloadModel(type){
          this.dialogTitle = type;
          if(type==="模板下载"){
            this.downDialogVisible = true
          }else if(type === "模板上传"){
            this.upDialogVisible = true;
            this.selectFileInput = "";
             this.modelUploadList = [];
          }
      },
      //下载文件
    download(){
        this.checkboxVal.map((item)=>{
              let _url =  `/api/v1/metaImport/downloadTemplate/${item}`;
              this.downloadFiled(item,_url)
           })
    },
    downloadFiled(fileName,content){
      var aLink = document.createElement('a');
          aLink.href = content;
          aLink.download = fileName;
          aLink.click();
    },
    //上传文件  选择文件
    selectFile(e){
        this.selectFileInput = e.target.value;
        let _file = e.target.files[0];
        let _url = "/api/v1/metaImport/uploadData";

        let formData = new FormData(document.getElementById('uploadForm'));
         formData.append("source",'ExcelImport');
         formData.append("file",_file );

         this.axios.post(_url,formData, {
               contentType: 'Multipart/form-data'
             }).then(res=>{
               if(res.body.return_code == 200){
                this.modelUploadList = res.body.data;
              }else{
                 this.dialogVisible = true;
                 this.messageContent = "没有获取到相应的目录！";
              }
           })

    },
    upload(){
        let url =`/api/v1/metaImport/commitData`;
        let formData = new FormData();
          formData.append("source",'ExcelImport');
          formData.append("path",this.checkList );

        this.axios.post(url,formData, {
                contentType: 'application/x-www-form-urlencoded'
             }).then(res=>{
          if(res.body.return_code== 200){
              this.dialogVisible = true;
              this.messageContent = "上传成功！";
            this.upDialogVisible = false;
          }else{
            this.dialogVisible = true;
            this.messageContent = "上传失败！";
          }
        })
    },
 }
}
</script>
<style>
    .model{background: #fff;border:1px solid #d9d9d9;}
    .boxCommon .model .tit{border:none;background: #fff;}
    .dbList .tit:hover{background: #fff;margin-left: -0;padding-left: 10px;}
    .boxCommon .model{width:360px;border:1px solid #d9d9d9;overflow-y: scroll;}
    .boxCommon .modelBtn{border-right: 1px solid #d9d9d9;padding:0 20px}
    .boxCommon .modelDown{height: 350px;}
    .boxCommon .modelUp{height: 280px}
    .listCon.dbList .tit i{margin:10px 15px 0 0}
    .listCon li { height: 38px;line-height: 38px;}
    .dataImportRecord .con .tit.listItem{padding-left: 40px;}
    .dataImportRecord .con  .model .tit{background: #fff;border:none;border-bottom: 1px solid #d9d9d9}
    .dataImportRecord .con  .modelUp .tit{border:none;}
    /*修改elmentUI 的checkbox样式*/
    .boxCommon .el-checkbox__inner.is-checked{background-color: #4bac8d;border-color: #4bac8d;border-radius: 50%;}
    .boxCommon .el-checkbox__inner.is-focus,.el-checkbox__inner{border-color: #4bac8d;border-radius: 50%;}
    .boxCommon  .el-checkbox__inner:not(.is-disabled):hover{border-color: #4bac8d;}
    .boxCommon .listCon .listItem label{margin:0 !important;}
    .el-checkbox__label{font-size: 0;}
    /*上传文件*/
    .uploadCon{padding:20px 0;line-height: 20px}
    .selectTxt{line-height: 40px}
    .fileCon{position: relative; cursor: pointer;}
    .file{width: 100%;height: 100%;position: absolute;filter:alpha(opacity:0);opacity: 0;top:0;}
    .el-radio-group{font-size: 12px;display: block;}
</style>
