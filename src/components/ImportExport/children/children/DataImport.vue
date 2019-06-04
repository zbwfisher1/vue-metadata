<template>
    <div id="data-import">
        <div class="sub-nav">
            <ul>
                <li>{{$t('content.dataset.importExport.drdc')}}<span class="split-line">/</span></li>
                <li>{{$t('content.dataset.importExport.ysjzddr')}}<span class="split-line">/</span></li>
                <li>{{$t('content.dataset.importExport.mbdr')}}<span class="split-line">/</span></li>
                <li>{{$t('content.dataset.import.drsjyxx')}}</li>
            </ul>
        </div>
        <div class="data-import-content main">
            <section class="data-import-controler" v-if="!showResult">
                <div class="selectDatasource">
                    <label>{{$t('content.dataset.import.xzsjy')}}: </label>
                    <el-select
                            v-model="datasource"
                            class="datasourceSel"
                            :disabled="datasourceSelDisabled"
                            filterable
                            allow-create
                            :placeholder="$t('content.import.qxzsjy')">
                        <el-option
                                v-for="item in datasourceList"
                                :key="item.id"
                                :label="item.businessName.length>15?item.businessName.slice(0,15)+'...':item.businessName"
                                :title="item.businessName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </div>

                <div class="upload-controler">
                    <el-form class="upload-input-container" v-show="!fileValue">
                        <span id="UpFileOut">
                          <input id="upFile"
                                 accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                 type="file"/>
                        </span>
                        <div class="upload-input-text" @click="upFileClick()">
                            <i class="iconfont icon-excel"></i><br/>
                            {{$t('content.dataset.import.djxzwj')}}
                        </div>
                    </el-form>
                    <div class="upload-select-list" v-if="fileValue && !isUploadCheck && !error">
                        <i class="el-icon-circle-close" @click="resetFileValue"></i>
                        <i class="iconfont icon-excel"></i><br/>
                        <span v-ellipsis="reFileValue"></span>
                    </div>
                    <el-progress
                            v-if="isUploadCheck && !isFileCheck"
                            type="circle"
                            :percentage="percentage">
                    </el-progress>
                    <div class="upload-tips">
                        <div class="tipIcon" v-if="isFileCheck != 0">
                            <i class="iconfont icon-success" v-if="isFileCheck == 2"></i>
                            <i class="iconfont icon-shibai" v-if="isFileCheck == -1"></i>
                            <i class="iconfont icon-alerterrorblack" v-if="isFileCheck == 1"></i>
                        </div>
                        <div v-ellipsis="importContent"></div>
                    </div>
                </div>
            </section>
            <section class="data-import-controler" v-else>
                <div class="upload-result upload-result-success">
                    {{$t('content.header.daor')}}{{$t('content.common.chengg')}}:
                    <a herf="javascripg:;">
            <span v-if="isClickExist">
              {{success-existInUnknowCounr}}
            </span>
                        <span v-else>
              {{success}}
            </span>
                    </a>
                    {{$t('content.dataset.import.tiao')}}
                </div>
                <div class="upload-result upload-result-failed">
                    {{$t('content.header.daor')}}{{$t('content.common.shib')}}:<a
                        herf="javascript:;">{{total-success}}</a>
                    {{$t('content.dataset.import.tiao')}}
                </div>
            </section>
            <footer class="data-import-buttons" v-if="!showResult&&!isUploadCheck&&!error">
                <el-button
                        @click="upload"
                        type="primary">
                    {{$t('content.common.qd')}}
                </el-button>
                <el-button @click="backToPage">{{$t('content.common.qx')}}</el-button>
            </footer>
            <footer class="data-import-buttons" v-else-if="!showResult&&!uploading">
                <el-button v-if="(success>existInUnknowCounr)&&(existInUnknowCounr > 0)" @click="confirmImport('exist')"
                           type="primary">
                    {{$t('content.dataset.import.dryzsj')}}
                </el-button>
                <el-button @click="confirmImport" type="primary">
                    {{$t('content.header.daor')}}
                </el-button>
                <el-button @click="cancelImport">{{$t('content.dataset.import.qxdr')}}</el-button>
            </footer>
            <footer class="data-import-buttons" v-if="showResult">
                <el-button
                        @click="backToPage"
                        type="primary">
                    {{$t('content.common.qd')}}
                </el-button>
            </footer>
            <!-- error -->
            <footer class="data-import-buttons" v-if="error">
                <el-button @click="goBack" type="primary">
                    {{$t('content.common.back')}}
                </el-button>
                <el-button @click="backToPage">{{$t('content.common.qx')}}</el-button>
            </footer>
        </div>
        <el-dialog
                :title="$t('content.common.tis')"
                width="385px"
                :visible.sync="resultVisible">
            <div class="dialogTips">{{uploadTips}}</div>
            <span slot="footer" class="dialog-footer">
           <el-button type="primary" @click="resultVisible = false">{{$t('content.common.qd')}}</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
    import {Message, FormatSize} from 'mixins/common';
    import {mapState} from 'vuex';

    export default {
        mixins: [Message, FormatSize],
        data() {
            return {
                fileValue: '',
                isUploadCheck: false,
                isFileCheck: 0,
                percentage: 0,
                success: 0,
                total: 0,
                import_time: Date.parse(new Date()) + '',
                showResult: false,
                uploading: false,
                error: false,
                importContent: `${this.$t('content.dataset.import.qscyzldwj')} ,  ${this.$t('content.dataset.import.xxdrdbxt')}`,
                id: null,
                dialogTitle: '',
                dialogDetailVisible: false,
                isClickExist: false,
                successList: [],
                failList: [],
                datasourceList: [],
                datasource: '',
                existInUnknowCounr: 0,
                existInUnknow: [],
                datasourceSelDisabled: false,
                resultVisible: false,
                uploadTips: ''
            };
        },
        computed: {
            ...mapState({
                saveRouter: 'saveRouter'
            }),
            reFileValue() {
                let value = this.fileValue;
                let nameArr = value.split('\\');
                return nameArr[nameArr.length - 1];
            },
            showFailList() {
                this.failList.map(val => {
                    val.state = this.$t('content.dataset.import.drsb');
                    switch (val.errorCode) {
                        case '20001':
                            val.reason = this.$t('content.dataset.import.mbcw');
                            break;
                        case '20002':
                            val.reason = this.$t('content.dataset.import.myqx');
                            break;
                        case '20003':
                            val.reason = this.$t('content.dataset.import.kbbcz');
                            break;
                        case '20004':
                            val.reason = this.$t('content.dataset.import.sjkpzmzd');
                            break;
                        case '80001':
                            val.reason = this.$t('content.dataset.datasetDetail.xtyc');
                            break;
                    }
                });
                return this.failList;
            }
        },
        methods: {
            resetFileValue() {
                this.fileValue = '';
            },
            async fetchData(page = 1) {
                this.dialogVisible = false;
                this.loadingVisible = true;
                const res = await this.axios.get('excelMetadataInfo/getDatasource');
                const {statusCode} = res.body;
                if (statusCode == 200) {
                    this.loadingVisible = false;
                    this.datasourceList = res.body.message;
                }
            },
            showResultList(type) {
                if (type == 0 && this.success == 0) return;
                if (type == 1 && (this.total - this.success) == 0) return;
                this.dialogDetailVisible = true;

                if (type == 0) {
                    this.dialogTitle = this.$t('content.dataset.import.drcg');
                    // this.showList = this.showSuccessList
                } else {
                    this.dialogTitle = this.$t('content.dataset.import.drsb');
                    // this.showList = this.showFailList
                }
            },
            selectFile(e) {
                this.fileValue = e.target.value;
            },
            upFileClick() {
                var vm = this;
                $('#UpFileOut').html($('#UpFileOut').html());
                $('#upFile').change(function () {
                    vm.fileValue = $(this).val();
                });
                $("#upFile").click();
            },
            upload() {
                if (this.datasource == '') {
                    this.resultVisible = true;
                    this.uploadTips = this.$t('content.dataset.import.xzsjy') + '!';
                    return;
                }

                if (!this.fileValue) {
                    this.resultVisible = true;
                    this.uploadTips = this.$t('content.dataset.import.qscwj');
                    return;
                }

                let formData = new FormData();
                this.datasourceSelDisabled = true;

                formData.append("uploadFile", this.fileValue);
                formData.append("datasource", this.datasource);
                formData.append("file", $("#upFile")[0].files[0]);
                formData.append("source", "ScriptImport");

                const f = document.getElementById('upFile').files[0];
                const fileSize = f.size;

                if (fileSize > 15728640) {
                    this.message(this.$t('content.dataset.import.zdzc50M'));
                    return;
                } else {
                    this.percentage = 0;
                    this.uploading = true;
                    this.isUploadCheck = !!this.fileValue;
                    this.importContent = this.$t('content.dataset.import.wjzzjz');
                    let flag = setInterval(() => {
                        ++this.percentage;
                        if (this.percentage > 98) clearInterval(flag);
                    }, 50);

                    this.axios.post('/excelMetadataInfo/import', formData, {contentType: 'Multipart/form-data'}).then(res => {
                        this.percentage = 100;
                        Object.assign(this.$data, res.data.message);
                        if (res.body.statusCode === 200 && this.success !== 0) {
                            this.uploading = false;
                            const {failData, existInUnknow, existInUnknowCounr, success,} = res.body.message;

                            if (existInUnknowCounr === 0 && failData.length === 0) {
                                this.isFileCheck = 2;
                                this.importContent = this.$t('content.dataset.import.wjjzcg', [success]);
                            } else {
                                this.isFileCheck = 1;
                                if (existInUnknowCounr > 0 && failData.length === 0) {
                                    this.importContent = this.$t('content.dataset.import.wjjzcg1', [success, existInUnknowCounr, existInUnknow.join(',<br>')]);
                                } else if (existInUnknowCounr === 0 && failData.length > 0) {
                                    this.importContent = this.$t('content.dataset.import.wjjzcg2', [success, failData.join(',<br>')]);
                                } else {
                                    this.importContent = this.$t('content.dataset.import.wjjzcg3', [success, existInUnknowCounr, existInUnknow.join(',<br>'), failData.join(',<br>')]);
                                }
                            }
                            this.successList = res.body.message.success;
                            this.failList = res.body.message.total - res.body.message.success;
                        } else {

                            this.isUploadCheck = false;
                            this.error = true;
                            this.isFileCheck = -1;

                            if (res.body.message === '20001') {
                                this.importContent = this.$t('content.dataset.import.jxsbqsc');
                            } else if (/20012_/.test(res.body.message)) {
                                this.importContent = this.$t('content.dataset.import.jxcc', res.body.message.split('_'));
                            } else if (res.body.message === '20004') {
                                this.importContent = this.$t('content.dataset.import.a1');
                            } else {
                                if (this.success === 0) {
                                    const {failData} = res.body.message;
                                    if (failData.length) {
                                        this.importContent = this.$t('content.dataset.import.jxccwjm', [failData.join(',<br>')]);
                                    } else {
                                        this.importContent = this.$t('content.dataset.import.jxccwjz');
                                    }
                                } else {
                                    this.importContent = this.$t('content.dataset.import.jxsbwjzmy');
                                }
                            }
                        }
                    });
                }
            },
            backToPage() {
                const router = this.saveRouter ? this.saveRouter : 'Physical';
                this.$router.push({name: router});
            },
            async confirmImport(type) {

                this.isUploadCheck = false;
                this.isFileCheck = 0;
                this.uploading = true;
                this.percentage = 0;

                const vm = this;
                let params = {};
                if (type == 'exist') {
                    this.isClickExist = true;
                    params = {
                        import_time: this.import_time,
                        type: 'exists'
                    };
                } else {
                    this.isClickExist = false;
                    params = {
                        import_time: this.import_time
                    };
                }

                this.importContent = this.$t('content.dataset.import.wjdrz');
                vm.isUploadCheck = true;
                let flag = setInterval(() => {
                    ++vm.percentage;
                    if (vm.percentage > 95) clearInterval(flag);
                }, 50);
                this.axios.post('/excelMetadataInfo/confirm', JSON.stringify(params)).then(async res => {
                    const {statusCode} = res.body;
                    this.$store.dispatch('setTreeData', true);
                    vm.percentage = 100;
                    clearInterval(flag);
                    let t = setTimeout(() => {
                        vm.showResult = statusCode == 200 ? true : false;
                    }, 500);
                });
            },
            async cancelImport() {
                this.isFileCheck = 0;
                this.fileValue = '';
                this.isUploadCheck = false;
                this.importContent = `${this.$t('content.dataset.import.qscyzldwj')} ,  ${this.$t('content.dataset.import.xxdrdbxt')}`;
                let import_time = this.import_time;
                let res = await this.axios.post('/excelMetadataInfo/cancel', JSON.stringify({import_time}));
                const {statusCode} = res.body;
                if (statusCode == 200) {
                    this.fileValue = '';
                    this.isUploadCheck = false;
                    this.datasourceSelDisabled = false;
                    this.datasource = '';
                }
            },
            goBack() {
                this.error = false;
                this.isFileCheck = 0;
                this.datasource = '';
                this.datasourceSelDisabled = false;
                this.fileValue = '';
                this.importContent = `${this.$t('content.dataset.import.qscyzldwj')} , ${this.$t('content.dataset.import.xxdrdbxt')}`;
            }
        },
        created() {
            this.fetchData();
        }
    };
</script>

<style lang="less">
    .dialogTips {
        text-align: center;
    }
    .selectDatasource {
        width: 435px;
        margin: 50px 0 15px;
        label {
            float: left;
            line-height: 32px;
            font-size: 14px;
        }
        .datasourceSel {
            float: right;
            width: 220px;
        }
    }
    #data-import {
        .data-import-content {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            h4 {
                font-size: 14px;
            }
            .upload-controler {
                width: 100%;
                text-align: center;
                .el-progress--circle {

                }
            }
            .data-import-controler {
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            .data-import-buttons {
                margin-top: 15px;
                display: flex;
                justify-content: flex-end;
            }
            .upload-input-container {
                width: 435px;
                height: 205px;
                background: #FFF;
                border: 1px dashed #ABABAD;
                position: relative;
                margin: 0 auto;
                input {
                    position: absolute;
                    width: 0px;
                    height: 100%;
                    opacity: 0;
                    cursor: pointer;
                }
                .upload-input-text {
                    width: 435px;
                    height: 205px;
                    padding-top: 55px;
                    cursor: pointer;
                    text-align: center;
                    font-size: 14px;
                    color: #1A5D7F;
                    line-height: 40px;
                    .iconfont {
                        font-size: 48px;
                    }
                }
            }
            .upload-tips {
                margin-top: 20px;
                margin-bottom: 30px;
                color: #A9AFB6;
                font-size: 14px;
                text-align: center;
            }
            .upload-select-list {
                width: 435px;
                height: 205px;
                padding-top: 55px;
                margin: 0 auto;
                position: relative;
                text-align: center;
                line-height: 40px;
                border: 1px solid #D9D9D9;
                background: #FFF;
                color: #5F6366;
                font-size: 14px;
                .el-icon-circle-close {
                    position: absolute;
                    right: -9px;
                    top: -9px;
                    color: #FF4343;
                    cursor: pointer;
                    font-size: 18px;
                }
                .iconfont {
                    font-size: 48px;
                    color: #1A5D7F;
                }
            }
        }
        .upload-result {
            line-height: 40px;
            font-size: 14px;
            /*cursor: pointer;*/
            a {
                font-size: 18px;
            }
            a:hover {
                text-decoration: none;
                cursor: auto;
            }
        }
        /*.upload-result:hover a{
		  text-decoration:underline;
		}*/
        .el-progress__text {
            color: #025ADB;
        }
    }
    .tipIcon {
        width: 72px;
        height: 72px;
        line-height: 72px;
        vertical-align: middle;
        margin: 0 auto 20px;
        .iconfont {
            font-size: 72px;
        }
        .icon-success {
            color: #13CE66;
        }
        .icon-shibai {
            color: #FF4949;
        }
        .icon-alerterrorblack {
            color: #F7BA2A;
        }
    }
    .upload-result-success, .upload-result-success a {
        color: #22B66F;
    }
    .upload-result-failed, .upload-result-failed a {
        color: red;
    }
</style>
