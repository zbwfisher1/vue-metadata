<template>
  <div class="">
    <div class="dataImportRecord">
      <div class="tabCon">
        <div class="loading" v-if="tableConLoading"></div>
        <div class="boxCommon">
        <div class="con">
          <div class="tit"><a href="javascript:;" @click="addSource" ><span><img src="../../assets/images/dataImport.png"></span>{{$t('content.import.xjsddr')}}</a></div>
          <div class="clearfix">
            <table class="table table-bordered tableList">
              <thead>
                <tr>
                  <th width="20%">{{$t('content.import.bdwjm')}}</th>
                  <th width="30%">{{$t('content.import.drml')}}</th>
                  <th width="10%">{{$t('content.import.drzs')}}</th>
                  <th width="10%">{{$t('content.import.rwzt')}}</th>
                  <th width="10%">{{$t('content.import.czzh')}}</th>
                  <th width="20%">{{$t('content.import.sj')}}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in tableShowData">
                  <td><div v-ellipsis="item.fileName"></div></td>
                  <td>{{item.path}}</td>
                  <td>{{item.tableCount}}</td>
                  <td>{{item.status}}</td>
                  <td>{{item.importUser}}</td>
                  <td>{{item.time}}</td>
                </tr>
              </tbody>
            </table>
            <div class="page-style">
              <el-pagination background
                layout="total, prev, pager, next"
                :total="totalPage"
                :page-size="10"
                :current-page="currentPage"
                @current-change="changePage">
              </el-pagination>
            </div>
          </div>
          <el-dialog :visible.sync="dialogContainerVisible" :title="dialogTitle" :close-on-click-modal= "false" >
            <el-form ref="uploadForm" :model="fileForm" :rules="fileRules" class="form-horizontal">
              <div class="el-form-group">
                <label class="col-sm-3 control-label">{{$t('content.import.wjlx')}}:</label>
                <div class="col-sm-9">
                  <el-radio class="radio" v-model="fileType" label="1">DDL文件导入</el-radio>
                </div>
              </div>
                <el-form-item>
                  <label class="col-sm-3 control-label">{{$t('content.import.xzscml')}}:</label>
                  <div class="col-sm-9">
                    <el-form-item prop="selectPath">
                      <div class="tree-container uploadTree">
                          <el-radio-group v-model="fileForm.selectPath">
                            <ul id="dialogTree">
                              <item :pathOpen="isOpen" :model="model" v-for="model in dialogTreeData"></item>
                            </ul>
                          </el-radio-group>
                      </div>
                    </el-form-item>
                  </div>
                </el-form-item>
              <div id="fileForm" class="el-form-group">
                <el-row :gutter="20">
                  <div class="grid-content bg-purple col-sm-3">
                    <div class="meta-import-record-label">{{$t('content.import.xzbdwj')}}:</div>
                  </div>
                  <div class="col-sm-8">
                    <el-form-item prop="fileValueName">
                      <el-col :span="15">
                          <el-input readonly v-model="fileForm.fileValueName"></el-input>
                      </el-col>
                      <el-col :span="2">&nbsp;</el-col>
                      <el-col :span="4">
                        <div class="uploadContainer">
                          <div>
                            <el-button type="primary">{{$t('content.import.tjwj')}}</el-button>
                          </div>
                          <div class="uploadeInput">
                            <input accept=".sql, .txt" type="file" id="upFile" :value="fileForm.fileValue" @change="getFileValue($event)" />
                          </div>
                        </div>
                      </el-col>
                    </el-form-item>
                  </div>
                </el-row>
              </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click.native="dialogContainerVisible = false">{{$t("content.common.qx")}}</el-button>
              <el-button :disabled="isDisable" type="primary" @click.native="checkForm('uploadForm')">{{$t("content.common.qd")}}</el-button>
              </span>
          </el-dialog>
          <el-dialog :visible.sync="waitVisible">
            <h3 class="warn-title">{{uploadFileName}}文件正在上传，请稍等...</h3>
          </el-dialog>
        </div>
      </div>
      </div>
      <!-- 提示框 -->
      <message v-if="warnVisible"
        @visible="warnVisible = false">
        <p class="msg" slot="content">{{messageContent}}</p>
      </message>
    </div>
</div>
</template>

<script>
import Highcharts from '../Highcharts'
import 'sweetalert/dist/sweetalert.css'
import swal from 'sweetalert'
import item from './DataTreeDialog'
import { FormatTime, resetValidators } from 'mixins/common'
import Message from 'components/Message'

export default {
  props:{
    modelData: Array
  },
  mixins: [ FormatTime, resetValidators ],
  data(){
    const validateFile = (rule, value, callback) => {
      const testExt = /\.(sql|txt)$/i;
      if (!testExt.test(value)) {
        callback(new Error('文件选择格式错误'));
      } else {
        callback();
      }
    };
    const validatePath = (rule, value, callback) => {
      if(value === ''){
        callback(new Error('文件选择格式错误'));
      } else {
        callback();
      }
    }
    const validateFileSize = (rule, value, callback) => {
      const fileSize = $("#upFile")[0].files[0].size;
      if (fileSize === 0) {
        callback(new Error('文件大小不能为0'));
      } else {
        callback();
      }
    };
    return {
      uploadFileName: 'uploadFileName',
      dialogContainerVisible: false,
      dialogTreeData: [],
      fileType: "1",
      dialogTitle: "手动文件导入",
      tableData: [],
      totalPage: 0,
      currentPage: 1,
      isOpen: false,
      waitVisible: false,
      tableConLoading: false,
      isDisable: false,

      tableListUrl: 'api/v1/metaImport/history/ScriptImport',
      messageContent: 'test',
      warnVisible: false,
      sort:"importTime",
      order:"desc",

      uploadFileName: '',

      fileForm: {
        selectPath: this.$store.state.selectPath,
        fileValue: '',
        fileValueName: ''
      },
      fileRules: {
        selectPath: [
          { validator: validatePath, message: this.$t('content.import.validator.qxzsclj')},
        ],
        fileValueName: [
          { required: true, message: this.$t('content.import.validator.qxzbdwj')},
          { validator: validateFile, message: this.$t('content.import.validator.xzwjbxw'), trigger: 'change'},
          {validator: validateFileSize, message: this.$t('content.import.validator.sxwjbnwk')}
        ],
      }
    }
  },
  mounted(){
    this.getTableData();
  },
  computed: {
    tableShowData(){
      if(this.tableData.length === 0){
        return;
      }
      this.tableData.forEach((v)=>{
        v.time = this.formatTime(v.importTime);
        v.status = v.status === 'S' ? '成功' : '失败';
      })
      return this.tableData;
    },
  },
  methods: {
    getFileValue($event){
      this.fileForm.fileValue = $event.target.value;
      let fileComplete = this.fileForm.fileValue;
      fileComplete = fileComplete.split('\\');
      let index = fileComplete.length - 1;
      this.uploadFileName = fileComplete[index];
      this.fileForm.fileValueName = this.uploadFileName;
    },

    addSource(){
      if(this.isDisable){
        this.waitVisible = true;
        return;
      }
      this.resetValidators('uploadForm');
      this.isDisable = false;
      this.tableConLoading = true;
      this.dialogTreeData = [];
      this.fileForm.fileValue = '';
      this.fetchTreeData();

      this.$store.dispatch('setPath', "")
      this.fileForm.selectPath = this.$store.state.selectPath;
      this.dialogContainerVisible = true;
      this.isOpen = false;
    },
    fetchTreeData(){
      let url='/dataset/tree';
			let data = {
				level:1,
				path:""
			};
      this.axios.post('/dataset/tree',
                      data,
                      {
                        contentType: 'application/json'
                      }
                      )
                      .then((res)=>{
        this.tableConLoading = false;
        let _data = res.body;
        this.dialogTreeData = _data;
      })
    },
    getTableData(page){
      const _page = page || 1;
      const listUrl = `${this.tableListUrl}?sort=${this.sort}&order=${this.order}&rows=10&page=${_page}`;
      this.axios.get(listUrl).then((res)=>{
        if(res.body.status === 'error'){
            return;
        }else{
          this.tableData = res.body.message.records;
          this.totalPage = res.body.message.totalRows;
        }
      })
    },
    checkForm(formName){
      this.fileForm.selectPath = this.$store.state.selectPath;
      this.$refs[formName].validate((valid) => {
          if (!valid) {
            return false;
          }else{
            this.dialogSubmit();
          }
      });
    },
    dialogSubmit(){
      let self = this;
      let path = this.$store.state.selectPath;
      let formData = new FormData();
      this.waitVisible = true;
      this.isDisable = true;
      formData.append("path", path);
      formData.append("file", $("#upFile")[0].files[0]);
      formData.append("source", "ScriptImport");
      this.axios.post("/api/v1/metaImport/upload",
                  formData,
                  {
                    contentType: 'Multipart/form-data'
                  }
                ).then((res)=>{
                  self.isDisable = false;
                  self.dialogContainerVisible = false;
                  self.waitVisible = false;
                  if(res.body.return_code === 200){
                    this.$message({
                      message: '添加成功',
                      type: 'success',
                      duration: 2000
                    });
                  }else{
                    this.$message({
                      message: '添加失败',
                      type: 'warning',
                      duration: 2000
                    });
                  }
                  self.getTableData();
                })
    },
    changePage(val){
      this.currentPage = val;
      this.getTableData(this.currentPage);
    }
  },
  components: {
    item,
    Message
  }
}

</script>
<style>
.uploadContainer{
  position: relative;
}
.uploadeInput{
  position: absolute;
  left: 0;
  top: 0;
  width: 90px;
  height: 35px;
  opacity: 0;
}
.uploadeInput input{
  width: 100%;
  height: 100%;
}
</style>
