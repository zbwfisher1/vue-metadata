<template>
    <div class="life-cycle">
        <div class="table-title">
            <div class="table-title__text">
                <span>{{$t('content.lifecycle.a1')}}</span>
            </div>
        </div>
        <div class="chart-wrapper" v-loading="loadingDataChange">
            <div class="c-title">
                <span class="t">
                    {{$t('content.lifecycle.a2')}}：{{formatTime(form.lastModifyTime)}}
                    <strong>
                        {{$t('content.lifecycle.a3')}}：{{formatTime(form.modifiedTime)}}
                    </strong>
                </span>
                <el-date-picker
                        @change="dataChange"
                        v-model="dateRange"
                        type="daterange"
                        value-format="timestamp"
                        format="yyyy-MM-dd"
                        :range-separator="$t('content.common.zhi')"
                        :start-placeholder="$t('content.dataset.datasetDetail.ksrq')"
                        :end-placeholder="$t('content.dataset.datasetDetail.jsrq')">
                </el-date-picker>
            </div>
            <no-data v-if="option.xAxis.data.length === 0"/>
            <chart ref="chart" :options="option" auto-resize v-else/>
        </div>

        <div class="table-title">
            <div class="table-title__text">
                <span>{{$t('content.lifecycle.a4')}}</span>
            </div>
        </div>
        <div class="form-wrapper" v-loading="loadingLifeCycle">
            <el-form :disabled="!isEditing || !propEditPrivilege">
                <div class="form-item">
                    <span class="item-label">{{$t('content.lifecycle.a5')}}:</span>
                    <div class="item-content">
                        <span class="item-content-txt">{{$t('content.lifecycle.a6')}}</span>
                        <el-input v-model="form.life_day"
                                  class="input-num" @blur="handleShow"></el-input>
                        <el-select v-model="form.type" :placeholder="$t('content.import.placeholder.qsr')">
                            <el-option
                                    v-for="item in optionsCycle"
                                    :key="item.value"
                                    :label="$t(item.label)"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                        <div class="btn-box" v-show="false">
                            <el-button type="success" class="el-bt-mini" icon="el-icon-check" circle></el-button>
                            <el-button type="danger" class="el-bt-mini" icon="el-icon-close" circle></el-button>
                        </div>
                    </div>
                </div>
            </el-form>
            <el-form v-if="showMore" :disabled="!isEditing">
                <div class="form-item">
                    <span class="item-label">{{$t('content.lifecycle.a7')}}:</span>
                    <div class="item-content">
                        <span class="item-content-txt">{{$t('content.lifecycle.a8')}}</span>
                        <el-select v-model="form.tag_column"
                                   @change="selectChange"
                                   :placeholder="$t('content.import.placeholder.qsr')">
                            <el-option v-for="(item, key) in form.partitionFields"
                                       :key="key"
                                       :label="item"
                                       :value="item">
                            </el-option>
                        </el-select>
                        <span class="comment-txt w150" v-if="form.tagColumnFail">
                            {{$t('content.lifecycle.a23')}}
                            <!--分区列已失效-->
                        </span>
                    </div>
                </div>
                <div class="form-item">
                    <span class="item-label">{{$t('content.lifecycle.a9')}}:</span>
                    <div class="item-content">
                        <el-radio v-model="form.delete_type" :label="1">{{$t('content.lifecycle.a12')}}</el-radio>
                        <el-radio v-model="form.delete_type" :label="2">{{$t('content.lifecycle.a13')}}</el-radio>
                        <span class="item-content-txt comment-txt"
                              :title="form.backupTable"
                              v-if="form.delete_type === 2 && form.backupTable">
                            <!--归档路径-->{{$t('content.lifecycle.a24')}}: {{form.backupTable}}
                        </span>
                    </div>
                </div>
                <div class="form-item" v-if="form.delete_type === 2 && false">
                    <span class="item-label"> </span>
                    <div class="item-content">
                        <span class="item-content-txt">{{$t('content.lifecycle.a10')}}</span>
                        <el-input v-model="form.day_num" class="input-num"
                                  v-if="form.delete_day_type !== 'F'"></el-input>
                        <el-select v-model="form.delete_day_type" :placeholder="$t('content.import.placeholder.qsr')">
                            <el-option
                                    v-for="item in optionsArchive"
                                    :key="item.value"
                                    :label="$t(item.label)"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </el-form>
            <template v-if="propEditPrivilege">
                <div class="form-item" v-if="isEditing && showMore">
                    <span class="item-label"> </span>
                    <div class="item-content">
                        <el-button type="primary" @click="submitForm">
                            {{$t('content.common.bc')}}
                        </el-button>

                        <el-button @click="backForm">
                            {{$t('content.common.qx')}}
                        </el-button>
                    </div>
                </div>
                <div class="form-item" v-if="!isEditing && showMore">
                    <span class="item-label"> </span>
                    <div class="item-content">
                        <el-button type="primary" @click="isEditing = true">
                            {{$t('content.common.sz')}}
                        </el-button>
                        <el-button @click.native="dialogVisible = true">
                            {{$t('content.home.cz')}}
                        </el-button>
                    </div>
                </div>
            </template>
        </div>
        <el-dialog :title="$t('content.common.tis')" :visible.sync="dialogVisible" width="400px">
            <span class="warn-tip">{{$t('content.lifecycle.a11')}}?</span>
            <div slot="footer">
                <el-button @click.native="dialogVisible = false">
                    {{$t("content.common.qx")}}
                </el-button>
                <el-button type="primary" @click="resetForm">
                    {{$t("content.common.qd")}}
                </el-button>
            </div>
        </el-dialog>

        <el-dialog :title="$t('content.common.tis')" :visible.sync="deleteConfirmDialog" width="400px">
            <span v-html="$t('content.lifecycle.a22')" class="warn-tip"></span>
            <div slot="footer">
                <el-button @click.native="deleteConfirmDialog = false">
                    {{$t("content.common.qx")}}
                </el-button>
                <el-button type="primary" @click="deleteSubmit">
                    {{$t("content.common.qd")}}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {getDataChange, getLifeCycle, settingLifeCycle, deleteLifeCycle} from '@/service/getData';
    import {FormatTime, FormatSize} from 'mixins/common';
    import {mapState} from 'vuex';

    export default {
        props: ['id'],
        mixins: [FormatTime, FormatSize],
        computed: {
            ...mapState({
                propEditPrivilege: 'propEditPrivilege'
            })
        },
        data: function () {
            return {
                isEditing: false,
                loadingDataChange: true,
                loadingLifeCycle: true,
                dateRange: [],
                initForm: {},
                form: {
                    modifiedTime: 0,
                    lastModifyTime: 0,
                    life_day: '',
                    type: 'D',
                    tag_column: '',
                    day_num: '',
                    delete_type: 2,
                    delete_day_type: 'M',
                    partitionFields: [],
                    tagColumnFail: false,
                    backupTable: ''
                },
                optionsCycle: [{
                    value: 'D',
                    label: 'content.common.tian'
                }, {
                    value: 'M',
                    label: 'content.common.yue'
                }, {
                    value: 'Y',
                    label: 'content.common.nian'
                }],
                optionsArchive: [{
                    value: 'D',
                    label: 'content.common.tian'
                }, {
                    value: 'M',
                    label: 'content.common.yue'
                }, {
                    value: 'Y',
                    label: 'content.common.nian'
                }, {
                    value: 'F',
                    label: 'content.common.yongj'
                }],
                option: {
                    title: {
                        text: this.$t('content.dataset.datasetDetail.ccdx'),
                        textStyle: {
                            align: 'left',
                            lineHeight: 30,
                            fontWeight: 'normal',
                            fontSize: '14'
                        },
                        left: 20,
                        top: 20
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: "{c} B"
                    },
                    color: ['#108EE9'],
                    xAxis: {
                        type: 'category',
                        nameTextStyle: 'center',
                        data: []
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value} B'
                        }
                    },
                    series: [{
                        data: [],
                        type: 'line',
                        symbolSize: 10,
                        areaStyle: {}
                    }]
                },
                showMore: false,
                dialogVisible: false,
                deleteConfirmDialog: false
            };
        },
        mounted() {
            this.fetchData();
            this.fetchLifeCycle();
        },
        methods: {
            selectChange() {
                this.form.tagColumnFail = false;
            },
            resetForm() {
                deleteLifeCycle(this.id).then(res => {
                    this.$message({
                        message: this.$t('content.lifecycle.a14'),
                        type: 'success'
                    });
                    this.dialogVisible = false;
                    this.form = Object.assign({}, this.form, {
                        life_day: '',
                        type: 'D',
                        tag_column: '',
                        day_num: '',
                        delete_type: 2,
                        delete_day_type: 'M',
                        backupTable: ''
                    });
                    this.showMore = false;
                    this.isEditing = true;
                });
            },
            backForm() {
                const {life_day} = this.initForm;
                this.showMore = life_day > 0;
                this.isEditing = life_day <= 0;
                this.form = Object.assign({}, this.initForm);
            },
            submitForm() {
                const {type, tag_column, delete_type, day_num, life_day, delete_day_type} = this.form;

                if (!type) {
                    this.$message({
                        message: this.$t('content.lifecycle.a15'),  // '请选择存储时长单位',
                        type: 'error'
                    });
                } else {
                    if (!tag_column) {
                        this.$message({
                            message: this.$t('content.lifecycle.a16'), // '请选择一个分区列',
                            type: 'error'
                        });
                    } else {
                        if (delete_type !== 1 && delete_type !== 2) {
                            this.$message({
                                message: this.$t('content.lifecycle.a17'), // '请选择一个过期数据操作',
                                type: 'error'
                            });
                        } else {
                            if (delete_type === 1) {
                                this.deleteConfirmDialog = true;
                            } else {
                                this.submitLifeCycle({
                                    life_day,
                                    type,
                                    tag_column,
                                    delete_type,
                                    datasetId: this.id
                                });
                            }
                        }
                    }
                }
            },
            deleteSubmit() {
                const {type, tag_column, delete_type, day_num, life_day, delete_day_type} = this.form;
                this.submitLifeCycle({
                    life_day,
                    type,
                    tag_column,
                    delete_type,
                    datasetId: this.id
                });
            },
            submitLifeCycle(param) {
                settingLifeCycle(param).then(res => {
                    this.$message({
                        message: this.$t('content.lifecycle.a20'), //'保存成功',
                        type: 'success'
                    });
                    this.isEditing = false;
                    this.deleteConfirmDialog = false;
                    this.fetchLifeCycle();
                });
            },
            handleShow() {
                if (/^[1-9]*[1-9][0-9]*$/.test(this.form.life_day)) {
                    this.showMore = true;
                } else {
                    this.showMore = false;
                    this.$message({
                        message: this.$t('content.lifecycle.a21'), //'需要正整数',
                        type: 'error'
                    });
                }
            },
            dataChange(dataArray) {
                if (dataArray === null) {
                    this.fetchData();
                } else {
                    this.fetchData({
                        startData: dataArray[0] / 1000,
                        endData: dataArray[1] / 1000
                    });
                }
            },
            fetchLifeCycle() {
                this.loadingLifeCycle = true;
                getLifeCycle(this.id).then(res => {
                    const {tag_column, delete_type, day_num, life_day, type, delete_day_type} = res.data.message;

                    this.loadingLifeCycle = false;
                    this.showMore = life_day > 0;
                    this.isEditing = life_day <= 0;
                    res.data.message.life_day = (life_day === 0 ? '' : life_day);
                    res.data.message.day_num = (day_num === 0 ? '' : life_day);
                    this.initForm = res.data.message;
                    this.form = Object.assign({}, this.initForm);
                });
            },
            fetchData({startData = '', endData = ''} = {}) {
                this.loadingDataChange = true;
                getDataChange(this.id, startData, endData).then(res => {
                    let XData = [], Ydata = [];

                    res.data.message.forEach(obj => {
                        XData.push(obj.create_date);
                        Ydata.push(obj.change_size);
                    });
                    this.loadingDataChange = false;
                    this.option.xAxis.data = XData;
                    this.option.series[0]['data'] = Ydata;
                    this.option = Object.assign({}, this.option);
                });
            }
        }
    };
</script>

<style lang="less">
    .life-cycle {
        .warn-tip b {
            color: #F00;
        }
        .table-title {
            margin-top: 20px;
            margin-bottom: 0;
            padding-bottom: 8px;
        }
        .border-bottom {
            border-bottom: 1px solid #CCC;
        }
        .form-item {
            margin-bottom: 20px;
            padding: 0 0 0 50px;
            display: flex;
            width: 100%;
            align-items: center;
            font-size: 14px;
            .item-label {
                color: #666;
                width: 150px;
            }
            .item-content {
                display: flex;
                align-items: center;
                width: calc(~"100% - 160px");
                .item-content-txt {
                    margin-right: 10px;
                    color: #999;
                }
                .comment-txt {
                    display: inline-block;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    color: #04E587;
                    margin-left: 20px;
                    width: calc(~"100% - 150px");
                }
                .w150 {
                    width: 250px;
                }
                .el-select {
                    width: 90px;
                }
                .input-num {
                    margin: 0 10px;
                    height: 30px;
                    width: 40px;
                    .el-input__inner {
                        padding: 0;
                        border: none;
                        border-bottom: 1px solid #CCC;
                        text-align: center;
                    }
                }
                .el-input__inner {
                    height: 30px !important;
                }
                .btn-box {
                    display: inline-block;
                    margin-left: 15px;
                    .el-bt-mini {
                        padding: 2px;
                    }
                }
            }
        }
        .form-wrapper {
            padding: 20px 20px 0;
            border: 1px solid #CCC;
        }
        .chart-wrapper {
            border: 1px solid #CCC;
            width: 100%;
            .c-title {
                margin: 15px 100px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .t {
                    display: block;
                    padding-left: 10px;
                    padding-right: 15px;
                    height: 35px;
                    line-height: 35px;
                    border-left: 3px solid #FFCE3D;
                    background-color: #FFFAEB;
                    color: #666;
                    strong {
                        margin-left: 20px;
                        font-weight: normal;
                    }
                }
            }
            .echarts {
                width: 100%;
                height: 300px;
            }
        }

    }

</style>
