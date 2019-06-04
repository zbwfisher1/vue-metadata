<style lang="less">
    @import "../../assets/less/mixin";
    #business {
        position: relative;
        .sub-nav {
            display: flex;
            justify-content: space-between;
            .path-wrap {
                flex-shrink: 1;
                overflow: hidden;
                ul {
                    width: 100%;
                    display: block;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    li {
                        overflow: hidden;
                        display: inline-block;
                    }
                }
            }
        }
        .vue-slider-wrap {
            float: right;
            display: flex;
            margin-right: 20px;
            align-items: center;
            > i {
                color: #014B70;
                font-size: 18px;
                cursor: pointer;
                &.disabled {
                    color: #C0C4CC;
                    cursor: not-allowed;
                }
            }
            span {
                width: 40px;
                margin: 0 10px;
                text-align: center;
                font-size: 14px;
            }
        }
        .table-list,
        .content {
            position: relative;
            overflow-y: auto;
            overflow-x: hidden;
            height: calc(~ "100% - 35px");
            .side-bar {
                position: absolute;
                right: -400px;
                top: 0;
                padding: 30px 20px 0;
                width: 400px;
                height: 100%;
                border-top: 1px solid #E0E4E9;
                background-color: #FFF;
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
                transition: all .6s;
                &.side-show {
                    right: 0;
                }
                .btn-box {
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    padding: 10px 0;
                    width: 100%;
                    text-align: center;
                    border-top: 1px solid #E0E4E9;
                }
                .el-form-item {
                    margin-bottom: 10px;
                }
            }
        }
        .table-list {
            padding: 20px;
            .list-box {
                min-height: 100%;
                padding: 15px;
                background-color: #FFF;
                .table-title {
                    margin-top: 0;
                }
                .search-wrapper {
                    display: flex;
                    align-items: center;
                    > .el-input-group {
                        width: 250px;
                    }
                    > .el-button {
                        margin-left: 30px;
                    }
                }
            }
        }
        &.bg {
            background-repeat: repeat;
            .bi('business/bg.png');
        }
        .data-empty {
            .ctt;
            .bg('business/data_empty.png', #F2F7FB);
            padding-top: 160px;
            .wh(500px, 250px);
            border: 1px dashed #4D819B;
            text-align: center;
            font-size: 14px;
            background-position: center 70px;
            cursor: pointer;
        }
        .rule-form {
            .el-form-item {
                margin-bottom: 15px;
            }
        }
        .topic-list {
            display: flex;
            flex-flow: row wrap;
            align-items: flex-start;
            align-content: flex-start;
            padding: 20px 50px;
            min-height: 100%;
            .added-current-topic {
                display: flex;
                align-items: center;
                justify-content: center;
                .wh(200px, 40px);
                border: 1px dashed #A5BFCC;
                background-color: #FFF;
                cursor: pointer;
                .el-icon-plus {
                    font-weight: bold;
                    color: #00679A;
                }
            }
            dl {
                position: relative;
                box-sizing: content-box;
                vertical-align: top;
                margin-right: 100px;
                margin-bottom: 50px;
                display: inline-block;
                width: 200px;
                font-size: 20px;
                border: 1px solid #43C4C0;
                background-color: #FFF;
                dt {
                    position: relative;
                    padding-top: 20%;
                    width: 100%;
                    line-height: 40px;
                    color: #FFF;
                    font-size: 70%;
                    background-color: #43C4C0;
                    .box {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        left: 0;
                        top: 0;
                        > span {
                            padding-left: 10px;
                            max-width: 80%;
                            .ellipsis;
                            text-decoration: underline;
                            cursor: pointer;
                        }
                        > i {
                            position: absolute;
                            right: 5px;
                            bottom: 5px;
                            .wh(6px, 6px);
                            .bg('business/icon/zk.png', transparent);
                        }
                        .tag-badge {
                            position: absolute;
                            top: 0;
                            right: 10px;
                            transform: translateY(-50%) translateX(100%);
                            display: inline-block;
                            padding: 0 6px;
                            height: 18px;
                            line-height: 18px;
                            font-size: 12px;
                            text-align: center;
                            white-space: nowrap;
                            background-color: #849197;
                            border-radius: 10px;
                            color: #FFF;
                        }
                    }
                    .menu {
                        position: relative;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100%;
                        width: 20%;
                        cursor: pointer;
                        .under-line {
                            width: 50%;
                            .icon-bar {
                                display: block;
                                width: 100%;
                                height: 2px;
                                border-radius: 1px;
                                background-color: #FFF;
                                + .icon-bar {
                                    margin-top: 20%;
                                }
                            }
                        }
                        .action {
                            box-sizing: content-box;
                            z-index: 9;
                            position: absolute;
                            top: 80%;
                            left: 50%;
                            min-width: 90px;
                            width: 300%;
                            display: none;
                            background-color: #FFF;
                            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
                            border: 1px solid #D9D9D9;
                            li {
                                position: relative;
                                padding-top: 25%;
                                width: 100%;
                                color: #636975;
                                border-bottom: 1px solid #D9D9D9;
                                > div {
                                    position: absolute;
                                    left: 0;
                                    top: 0;
                                    display: flex;
                                    align-items: center;
                                    padding-left: 10%;
                                    width: 100%;
                                    height: 100%;
                                }
                                &:hover {
                                    background-color: #E0E9EE;
                                }
                                &:last-child {
                                    border-bottom: none;
                                }
                                i {
                                    font-size: 100%;
                                    color: #014B70;
                                    margin-right: 10px;
                                }
                            }
                        }
                        &:hover {
                            .action {
                                display: block;
                            }
                        }
                    }
                }
                dd {
                    position: relative;
                    ul {
                        overflow: hidden;
                        padding: 7% 7% 0;
                        li {
                            position: relative;
                            margin: 0 5% 7%;
                            float: left;
                            width: 40%;
                            padding-top: 20%;
                            text-align: center;
                            background-color: #F1F6FA;
                            color: #00679A;
                            font-size: 60%;
                            cursor: pointer;
                            .pos {
                                position: absolute;
                                left: 0;
                                top: 0;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                width: 100%;
                                height: 100%;
                                span {
                                    width: 100%;
                                    .ellipsis;
                                }
                            }
                            &.more {
                                width: calc(~ '100% - 10%');
                                border: 1px dashed #A5BFCC;
                            }
                            .el-icon-plus {
                                font-weight: bold;
                            }
                        }
                    }
                }
                .resize {
                    position: absolute;
                    left: 50%;
                    margin-left: -7%;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    .wh(14%, auto);
                    font-size: 60%;
                    border: 1px solid transparent;
                    background-color: #FFF;
                    &:hover {
                        color: #FFF;
                    }
                }
                &:hover {
                    .resize {
                        display: flex;
                    }
                }
            }
            .dl-1 {
                border-color: #CF6E81;
                &.active {
                    box-shadow: 0 5px 20px #CF6E81;
                }
                dt {
                    background-color: #CF6E81;
                }
                .resize {
                    color: #CF6E81;
                    border-color: #CF6E81;
                    &:hover {
                        background-color: #CF6E81;
                    }
                }
            }
            .dl-2 {
                border-color: #D17BE8;
                &.active {
                    box-shadow: 0 5px 20px #D17BE8;
                }
                dt {
                    background-color: #D17BE8;
                }
                .resize {
                    color: #D17BE8;
                    border-color: #D17BE8;
                    &:hover {
                        background-color: #D17BE8;
                    }
                }
            }
            .dl-3 {
                border-color: #4487DE;
                &.active {
                    box-shadow: 0 5px 20px #4487DE;
                }
                dt {
                    background-color: #4487DE;
                }
                .resize {
                    color: #4487DE;
                    border-color: #4487DE;
                    &:hover {
                        background-color: #4487DE;
                    }
                }
            }
            .dl-4 {
                border-color: #43C4C0;
                &.active {
                    box-shadow: 0 5px 20px #43C4C0;
                }
                dt {
                    background-color: #43C4C0;
                }
                .resize {
                    color: #43C4C0;
                    border-color: #43C4C0;
                    &:hover {
                        background-color: #43C4C0;
                    }
                }
            }
        }
        .form-topic-option {
            margin-top: 20px;
            > span {
                margin-right: 20px;
            }
            .el-select {
                width: 600px;
            }
        }
        .list-group {
            width: 100%;
        }
        .flip-list-move {
            transition: transform 0.5s;
        }
        .no-move {
            transition: transform 0s;
        }
        .ghost {
            opacity: 0.5;
            background: #C8EBFB;
        }
    }
</style>
<template>
    <div id="business" :class="{bg: hasData}" v-loading="loading">
        <h1 class="sub-nav" v-if="hasData">
            <div class="path-wrap">
                <ul class="pull-left">
                    <li>
                        <span class="active" @click="navRoot">{{$t('content.tree.ywst')}}<!--业务视图--></span>
                        <span class="split-line" v-if="location.length">/</span>
                    </li>
                    <template v-for="(item, index) in location" v-if="location.length">
                        <li v-if="index < location.length - 1">
                            <span class="active" @click="viewNavList(index)">{{item}}</span>
                            <span class="split-line">/</span>
                        </li>
                        <li v-else>
                            <span>{{item}}</span>
                        </li>
                    </template>
                </ul>
            </div>
            <div class="vue-slider-wrap" v-if="type === 'Topic'">
                <i class="el-icon-remove" :class="{disabled: num === 50}" @click="reduceWidth"></i>
                <span>{{num}}%</span>
                <i class="el-icon-circle-plus" :class="{disabled: num === 150}" @click="increaseWidth"></i>
            </div>
        </h1>
        <div class="content" v-if="type === 'Topic'">
            <div class="topic-list clearfix" @click="closeSide">
                <draggable v-model="data"
                           class="list-group"
                           @start="isDragging = true"
                           @end="isDragging = false"
                           v-bind="dragOptions">
                    <transition-group name="flip-list" type="transition">
                        <dl :class="classObject(index, topic)"
                            class="topic-item"
                            v-for="(topic,index) in data"
                            :key="topic.id"
                            :style="{
							width: 200 * num/100 + 'px',
							marginLeft: 20 * num/100 + 'px',
							marginRight: 20 * num/100 + 'px',
						    marginBottom: 30 * num/100 + 'px',
							fontSize: 20 * num/100 + 'px'}">
                            <dt>
                                <div class="box" :title="`${topic.title}(${topic.datasetCount})`">
                                    <span @click="viewList(topic)">{{topic.title}}({{topic.datasetCount}})</span>
                                    <div class="menu">
                                        <div class="under-line">
                                            <span class="icon-bar"></span>
                                            <span class="icon-bar"></span>
                                            <span class="icon-bar"></span>
                                        </div>

                                        <ul class="action">
                                            <li @click="getToplist(topic)">
                                                <div>
                                                    <i class="el-icon-view"></i>
                                                    {{$t('content.business.cklb')}}<!--查看列表-->
                                                </div>
                                            </li>
                                            <li @click="handlerInfo(topic)">
                                                <div>
                                                    <i class="el-icon-document"></i>
                                                    {{$t('content.dataset.datasetDetail.sxxx')}}<!--属性信息-->
                                                </div>
                                            </li>
                                            <template v-if="hasPermission(topic.creator)">
                                                <li @click="removeTopic(topic)">
                                                    <div>
                                                        <i class="el-icon-delete"></i>
                                                        {{$t('content.tree.sczt')}}<!--删除主题-->
                                                    </div>
                                                </li>
                                            </template>
                                        </ul>
                                    </div>
                                </div>
                            </dt>
                            <dd v-show="expandTopicIds.has(topic.id)">
                                <ul>
                                    <template v-for="(child, index) in topic.childTopic">
                                        <li v-if="index < 9"
                                            @click="viewList(child)">
                                            <div class="pos"><span :title="child.title">{{child.title}}</span></div>
                                        </li>
                                    </template>
                                    <li v-if="isAdmin" @click="createChildTopic(topic)">
                                        <div class="pos"><i class="el-icon-plus"></i></div>
                                    </li>
                                    <li class="more"
                                        @click="viewList(topic)"
                                        v-if="topic.childTopic.length > 9">
                                        <div class="pos">MORE</div>
                                    </li>
                                </ul>
                            </dd>
                            <div class="resize"
                                 v-if="topic.level < 5"
                                 @click="toggleStatus(topic)">
                                <i :class="[topic.status ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"></i>
                            </div>
                        </dl>
                    </transition-group>
                </draggable>
                <div class="data-empty" @click="openDialog" v-if="!data.length && !location.length">
                    <span>
                        {{isAdmin ? $t('content.business.zwsjdjtj') : $t('content.common.zwsj')}}<!--暂无数据,点击添加业务域-->
                    </span>
                </div>
                <div class="added-current-topic topic-item"
                     :style="{
						 width: 200 * num/100 + 'px',
						 height: 40 * num/100 + 'px',
						 marginLeft: 20 * num/100 + 'px',
						 marginRight: 20 * num/100 + 'px',
						 marginBottom: 30 * num/100 + 'px',
						 fontSize: 20 * num/100 + 'px'}"
                     v-else-if="isAdmin && (location.length || data.length)"
                     @click="createSiblingTopic">
                    <i class="el-icon-plus"></i>
                </div>
            </div>
            <div class="side-bar"
                 :class="{'side-show': sideShow}"
                 v-loading="sideLoading">
                <el-form ref="form"
                         :model="form"
                         :rules="rules"
                         label-width="150px"
                         :disabled="!hasPermission(currentItem.creator)">
                    <el-form-item :label="$t('content.business.ztmc')" prop="title">  <!--主题名称-->
                        <el-input v-model="form.title"
                                  @input="compareForm"
                                  :placeholder="$t('content.business.djssztmc')">
                        </el-input>
                    </el-form-item>
                    <el-form-item :label="$t('content.dataset.importExport.czr')">{{form.creator}}</el-form-item>
                    <!--创建人-->
                    <el-form-item :label="$t('content.business.zzzsm')">{{form.childTopicCount}}</el-form-item>
                    <!--子主题数目-->
                    <el-form-item :label="$t('content.business.bwjsm')">{{form.datasetCount}}</el-form-item>
                    <!--表&文件数目-->
                    <el-form-item :label="$t('content.business.ms')" prop="description">  <!--描述-->
                        <el-input type="textarea"
                                  v-model="form.description"
                                  @input="compareForm"
                                  :placeholder="$t('content.business.djssztms')">
                        </el-input>
                    </el-form-item>
                </el-form>
                <div class="btn-box">
                    <el-button type="primary" @click="submitFormSide" :disabled="!diff">{{$t('content.common.bc')}}
                    </el-button>
                </div>
            </div>
        </div>
        <div class="table-list" v-else>
            <div class="list-box">
                <div class="tableMulti">
                    <div class="table-title">
                        <div class="table-title__text">
                            <span>{{currentItem.title}}</span>
                        </div>
                        <div class="search-wrapper">
                            <Search :keyword.sync='keyword'
                                    placeholder="content.header.srbm"
                                    @handleSearch="keywordSearch"></Search>
                            <el-button type="primary" v-if="hasPermission(currentItem.creator)" @click="openAddDialog">
                                {{$t("content.business.tjdx")}}<!--添加对象-->
                            </el-button>
                        </div>
                    </div>
                </div>
                <el-table :data="list"
                          :default-sort="{prop: 'name', order: 'descending'}"
                          border
                          v-loading="tableLoading"
                          @sort-change="sortTable">
                    <el-table-column
                            prop="name"
                            :label="$t('content.business.bwj')"
                            sortable="custom">
                        <template slot-scope="scope">
                            <template v-if="scope.row.type === 'Hdfs' ">
                                <a v-html="emphasizeName(scope.row.name,keyword)"
                                   :href="`#/Main/Files?id=${scope.row.datasetId}`"></a>
                            </template>
                            <template v-else>
                                <item-jump :params="{params:{path:scope.row.path,level:3},isfolder: false}"
                                           :name="emphasizeName(scope.row.name,keyword)"
                                           :view="false"
                                           :datasetId="scope.row.datasetId">
                                </item-jump>
                            </template>
                        </template>
                    </el-table-column> <!--表/文件-->
                    <el-table-column
                            prop="owner"
                            :label="$t('content.dataset.datasetDetail.sjfzr')"
                            sortable="custom">
                    </el-table-column> <!--业务负责人-->
                    <el-table-column
                            prop="description"
                            :label="$t('content.dataset.datasetDetail.sjms')"
                            sortable="custom">
                    </el-table-column> <!--数据简介-->
                    <el-table-column
                            prop="path"
                            :label="$t('content.business.ccwz')"
                            sortable="custom">
                    </el-table-column> <!--存储位置-->
                    <el-table-column
                            prop="projectName"
                            :label="$t('content.dataset.datasetDetail.scxm')"
                            sortable="custom">
                    </el-table-column> <!--所属项目-->

                    <el-table-column prop="lastModifyTime"
                                     :label="$t('content.dataset.datasetDetail.zhgxsj')"
                                     sortable="custom">
                        <!--最后更新时间-->
                        <template slot-scope="scope">
                            {{formatTime(scope.row.lastModifyTime * 1000)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="source"
                            :label="$t('content.dataset.datasetDetail.sjly')"
                            sortable="custom">
                    </el-table-column> <!--数据来源-->
                    <el-table-column
                            prop="useCount"
                            :label="$t('content.business.sycs')"
                            sortable="custom">
                        <template slot-scope="scope">
                            <!--除leap-hive数据源下的表外，其余表的使用次数建议默认为--->
                            <span> {{scope.row.type === 'Hive' && scope.row.isDefault === 1 ? scope.row.useCount : '-'}}</span>
                        </template>
                    </el-table-column> <!--使用次数-->
                    <el-table-column
                            prop="useProject"
                            :label="$t('content.business.syxm')"
                            sortable="custom">
                    </el-table-column> <!--使用项目-->
                    <el-table-column v-if="hasPermission(currentItem.creator)"
                                     :label="$t('content.dataset.datasetDetail.cz')">
                        <template slot-scope="scope">
                            <i class="icon iconfont icon-shanchu2" @click="openRemoveDialog(scope.row)"></i>
                        </template>
                    </el-table-column> <!--操作-->
                </el-table>
                <div class="tablePages">
                    <el-pagination background
                                   layout="total, prev, pager, next"
                                   @current-change="handleCurrentChange"
                                   :current-page="currentPage"
                                   :page-size="rows"
                                   :total="totalRows">
                    </el-pagination>
                </div>
            </div>
        </div>
        <!--移出主题-->
        <el-dialog :visible.sync="removeDialogVisible"
                   :title="$t('content.business.zcdx', [currentRow.name])"
                   :close-on-click-modal="false"
                   width="800px">
            <div>{{$t('content.business.qqrjfj')}}<!--请确认是否将该表/文件移出以下选择主题--> ?</div>
            <div class="form-topic-option">
                <span>{{$t('content.home.qxzzt')}}<!--请选择主题-->:</span>
                <el-select v-model="optionModel" multiple>
                    <el-option v-for="item in options"
                               :key="item.id"
                               :label="item.ellipsisPath"
                               :title="item.path"
                               :value="item.id">
                    </el-option>
                </el-select>
            </div>

            <div slot="footer">
                <el-button @click="removeDialogVisible = false">{{$t('content.common.qx')}}</el-button>
                <el-button type="primary" @click="removeSomeTopic" :loading="btnLoading">
                    {{$t('content.business.yc')}}
                </el-button>
            </div>

        </el-dialog>
        <!--创建业务主题表单-->
        <el-dialog :visible.sync="dialogVisible"
                   :title="currentItem.level ? $t('content.business.cjzzt', [currentItem.title]) : $t('content.business.cjyjywyt')"
                   :close-on-click-modal="false"
                   width="500px">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="rule-form">
                <el-form-item :label="$t('content.business.ztmc')" prop="title">  <!--主题名称-->
                    <el-input v-model="ruleForm.title" :placeholder="$t('content.business.qsrhz')"></el-input>
                </el-form-item>

                <el-form-item :label="$t('content.business.ms')" prop="description">  <!--描述-->
                    <el-input type="textarea"
                              v-model="ruleForm.description"
                              :placeholder="$t('content.business.djssztms')"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="dialogVisible = false">{{$t('content.common.qx')}}</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')" :loading="btnLoading">
                    {{$t('content.common.chuangj')}}
                </el-button>
            </div>
        </el-dialog>
        <!-- 确认框 -->
        <el-dialog :title="$t('content.business.sczt', [currentItem.title])"
                   :visible.sync="deleteConfirmDialog"
                   :close-on-click-modal="false"
                   width="450px"
                   @click.native.stop>
			<span>
				{{$t('content.business.qqrsc')}}
                <!--删除该主题将删除该主题下所有子主题，同时解除该主题下的表&文件所属于该业务主题关系，请确认是否删除-->?</span>
            <div slot="footer" class="dialog-footer">
                <el-button @click="deleteConfirmDialog = false">
                    {{$t('content.common.qx')}}
                </el-button>
                <el-button type="primary" @click="submitRemoveTopic" :loading="btnLoading">
                    {{$t('content.common.qd')}}
                </el-button>
            </div>
        </el-dialog>
        <!--添加表和文件-->
        <el-dialog :visible.sync="addDialogVisible"
                   :title='$t("content.business.tjdxd", [currentItem.title])'
                   :close-on-click-modal="false"
                   width="850px">
            <add-dataset ref="dialog"
                         :dialogVisible="addDialogVisible"
                         :filePath="location"
                         @submit="closeDialog"
                         :id="currentItem.id"></add-dataset>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addDialogVisible = false">{{$t('content.common.qx')}}</el-button>
                <el-button type="primary" @click="validateForm">
                    {{$t('content.common.qd')}}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import VueSlider from 'vue-slider-component';
    import 'vue-slider-component/theme/default.css';
    import Search from '@/components/MetaData/Personal/chiildren/Search';
    import {SortTable, FormatTime, EmphasizeName} from 'mixins/common';
    import {
        createTopic,
        getTopicList,
        getTopicInfo,
        updateTopic,
        deleteTopic,
        getDatasetInfo,
        getTopicsByDataset,
        removeDatasetInTopic
    } from '@/service/getData';
    import AddDataset from './children/AddDataset';
    import {textFieldLength} from '@/config/env';
    import draggable from 'vuedraggable';
    import ItemJump from 'common/ItemJump';

    export default {
        name: 'Index',
        mixins: [SortTable, FormatTime, EmphasizeName],
        components: {
            Search,
            AddDataset,
            VueSlider,
            draggable,
            ItemJump
        },
        data() {
            return {
                draggableWithBoundries: {
                    onDragStart: this.onDragStart,
                    onDragEnd: this.onDragEnd
                },
                num: 100,
                removeDialogVisible: false,
                addDialogVisible: false,
                dialogVisible: false,
                deleteConfirmDialog: false,
                btnLoading: false,
                dialogLoading: false,
                tableLoading: false,
                form: {
                    title: '',
                    description: '',
                    creator: '',
                    datasetCount: '',
                    childTopicCount: ''
                },
                ruleForm: {
                    title: '',
                    description: ''
                },
                rules: {
                    title: [
                        {required: true, message: this.$t('content.business.qsrztmc'), trigger: 'blur'},
                        {
                            required: true,
                            message: this.$t('content.business.qsrhz'),
                            trigger: 'blur',
                            pattern: /^[A-Za-z0-9_\u4e00-\u9fa5\s&]+$/g
                        },
                        {
                            min: 1,
                            max: textFieldLength.normal,
                            message: this.$t('content.dataset.datasetDetail.cdzf', [1, textFieldLength.normal]),
                            trigger: 'blur'
                        }
                    ],
                    description: [
                        {
                            min: 1,
                            max: 200,
                            message: this.$t('content.dataset.datasetDetail.cdzf', [1, textFieldLength.large]),
                            trigger: 'blur'
                        }
                    ]
                },
                data: [],
                list: [],
                options: [],
                optionModel: [],
                loading: false,
                sideLoading: true,
                sideShow: false,
                currentItem: {
                    path: '',
                    level: 0,
                    title: 'root'
                },
                expandTopicIds: new Set(),    //主题切换展开时候追加ID
                currentRow: {},
                cacheForm: {},
                diff: false,          // 表单对比差异状态
                type: 'Topic',      // 两个视图: Topic和List
                keyword: '',
                rows: 10, //每页数量
                order: 'desc',  //asc或desc
                sort: 'name',  //排序字段
                currentPage: 1,   //当前页
                totalRows: 0,     //总记录数
                totalPages: 0    //总页数
            };
        },
        watch: {
            dialogVisible: function(newValue) {
                if (!newValue) {
                    this.resetData();
                }
            },
            removeDialogVisible: function(newValue) {
                if (!newValue) {
                    this.optionModel = [];
                }
            }
        },
        computed: {
            hasData() {
                return this.data.length || (!this.data.length && this.currentItem.level);
            },
            location() {
                const {path} = this.currentItem;
                if (path && path.length) {
                    return path.split('/');
                } else {
                    return [];
                }
            },
            dragOptions() {
                return {
                    animation: 0,
                    group: "description",
                    disabled: false,
                    ghostClass: "ghost"
                };
            },
            isAdmin() {
                const {roles} = this.$store.state.userInfo;
                return roles === 'leapid.admin' || roles === 'leapid.pm';
            }
        },
        async created() {
            await this.fetchList();
        },
        methods: {
            /*
            * 切换子主题展开,并记住当前展开的主题的ID,下次刷新时,默认展开
            * */
            toggleStatus(topic) {
                topic.status = !topic.status;
                if (topic.status) {
                    this.expandTopicIds.add(topic.id);
                } else {
                    this.expandTopicIds.delete(topic.id);
                }
            },
            hasPermission(creator) {
                const {roles, userName} = this.$store.state.userInfo;
                return roles === 'leapid.admin' || (roles === 'leapid.pm' && userName === creator);
            },
            reduceWidth() {
                if (this.num > 50) {
                    this.num = this.num - 25;
                }
            },
            increaseWidth() {
                if (this.num < 150) {
                    this.num = this.num + 25;
                }
            },
            openRemoveDialog(row) {
                this.removeDialogVisible = true;
                this.currentRow = row;
                this.dialogLoading = true;
                getTopicsByDataset(row.datasetId, this.currentItem.id).then(res => {
                    const {statusCode, message} = res.data;
                    if (statusCode === 200) {
                        message.forEach(item => {

                            if (item.path && item.path.length > 50) {

                                const arrayPath = item.path.split('/');
                                const newAarray = arrayPath.map(path => {
                                    return path.length > 10 ? path.substr(0, 10) + '...' : path;
                                });
                                item.ellipsisPath = '.../' + arrayPath[arrayPath.length - 1];
                            } else {
                                item.ellipsisPath = item.path;
                            }
                        });
                        this.options = message;
                        this.dialogLoading = false;
                    }
                });
            },
            removeSomeTopic() {
                const {id} = this.currentItem;
                const {datasetId} = this.currentRow;
                const ids = this.optionModel;
                if (ids.length) {
                    removeDatasetInTopic(id, {
                        datasetId,
                        topicIds: ids
                    }).then(res => {
                        const {statusCode, message} = res.data;
                        if (statusCode === 200) {
                            this.$message({
                                message: this.$t('content.business.yccg'),    // 移出成功
                                type: 'success'
                            });
                            this.removeDialogVisible = false;
                            this.fetchData();
                        }
                    });
                }
            },
            closeDialog() {
                this.addDialogVisible = false;
                this.fetchData(this.currentItem);
            },
            openAddDialog() {
                this.addDialogVisible = true;
            },
            getToplist(topic) {
                this.currentItem = topic;
                this.type = 'List';
            },
            fetchData(topic = this.currentItem) {
                this.currentItem = topic;
                this.tableLoading = true;
                const {sort, order, currentPage: page, rows, keyword} = this;
                getDatasetInfo({
                    id: topic.id,
                    sort,
                    order,
                    page,
                    rows,
                    keyword
                }).then(res => {
                    const {statusCode, message} = res.data;
                    if (statusCode === 200) {
                        this.list = message.records;
                        this.totalRows = message.totalRows;
                        this.tableLoading = false;
                    }
                });
            },
            handlerInfo(topic) {
                this.currentItem = Object.assign({}, topic, {
                    path: this.currentItem.path
                });
                this.sideLoading = true;
                getTopicInfo(topic.id).then(res => {
                    const {statusCode, message} = res.data;
                    if (statusCode === 200) {
                        const {title, description, creator, datasetCount, childTopicCount} = message;
                        this.form = {
                            title,
                            description,
                            creator,
                            datasetCount,
                            childTopicCount
                        };
                        this.cacheForm = {
                            title,
                            description
                        };
                        this.sideLoading = false;
                        this.diff = false;
                        this.sideShow = true;
                    }
                });
            },
            compareForm() {
                const {title, description} = this.form;
                const {title: oldTitle, description: oldDescription} = this.cacheForm;
                this.diff = title !== oldTitle || description !== oldDescription;
            },
            closeSide() {
                const {sideShow, diff} = this;
                if (sideShow && diff) {
                    this.$confirm(this.$t('content.business.nhywbc'), this.$t('content.common.tis'), {
                        confirmButtonText: this.$t('content.common.qd'),
                        cancelButtonText: this.$t('content.common.qx'),
                        customClass: 'answer-dialog'
                    }).then(() => {
                        this.submitFormSide();
                    }).catch(() => {
                        this.sideShow = false;
                    });
                } else {
                    this.sideShow = false;
                }
            },
            removeTopic(topic) {
                this.currentItem = Object.assign({}, topic, {
                    path: this.currentItem.path
                });
                this.deleteConfirmDialog = true;
            },
            classObject(index, topic) {
                return {
                    'dl-1': index % 4 === 0,
                    'dl-2': index % 4 === 1,
                    'dl-3': index % 4 === 2,
                    'dl-4': index % 4 === 3,
                    'active': topic.id === this.currentItem.id && this.sideShow
                };
            },
            resetData() {
                setTimeout(() => {   // UI渲染问题
                    this.ruleForm = {
                        title: '',
                        description: ''
                    };
                    this.currentItem['childPath'] = null;
                    this.$refs.ruleForm.resetFields();
                }, 500);
            },
            randomNum() {
                return Math.ceil(Math.random() * 4);
            },
            openDialog() {
                if (this.isAdmin) {
                    this.dialogVisible = true;
                }
            },
            submitFormSide() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        const {title, description} = this.form;
                        const params = {
                            id: this.currentItem.id,
                            title,
                            description
                        };
                        this.btnLoading = true;
                        updateTopic(params).then(res => {
                            const {statusCode, message} = res.data;
                            if (statusCode === 200) {
                                this.$message({
                                    message: this.$t('content.common.bccg'),    // 保存成功
                                    type: 'success'
                                });
                                this.diff = false;
                                this.sideShow = false;
                                this.btnLoading = false;
                                this.data.forEach(topic => {
                                    if (topic.id === this.currentItem.id) {
                                        const reg = new RegExp(`${topic.title}`);
                                        topic.path = topic.path.replace(reg, title);   //替换路径字符串
                                        topic.title = title;
                                    }
                                });
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let params = {};
                        const {level, path, childPath} = this.currentItem;

                        if (level) {
                            params = Object.assign({}, this.ruleForm, {
                                parentPath: childPath || path
                            });
                        } else {
                            params = Object.assign({}, this.ruleForm);
                        }

                        createTopic(params).then(res => {
                            const {statusCode, message} = res.data;
                            if (statusCode === 200) {
                                this.$message({
                                    message: this.$t('content.business.cjztcg'),    // 创建主题成功
                                    type: 'success'
                                });
                                this.dialogVisible = false;
                                this.resetData();
                                this.viewList({
                                    path,
                                    level
                                });
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            submitRemoveTopic() {
                this.btnLoading = true;
                deleteTopic(this.currentItem.id).then(res => {
                    const {statusCode} = res.data;
                    if (statusCode === 200) {
                        this.btnLoading = false;
                        this.$message({
                            message: this.$t('content.common.sccg'),    // 创建主题成功
                            type: 'success'
                        });
                        this.deleteConfirmDialog = false;
                        this.viewList(this.currentItem);
                    }
                });
            },
            navRoot() {
                this.viewList({
                    path: '',
                    level: 0,
                    title: 'root'
                });
            },
            viewNavList(index) {
                const location = this.location.slice();
                location.length = index + 1;
                this.viewList({
                    path: location.join('/'),
                    level: index + 1,
                    title: location[index]
                });
            },
            viewList(topic) {
                if (topic.level < 5) {
                    this.type = 'Topic';
                    this.sideShow = false;
                    this.currentItem = topic;
                    this.fetchList(topic.path);
                }
            },
            fetchList(path = '') {
                this.loading = true;
                return getTopicList(path).then(res => {
                    const {statusCode, message} = res.data;
                    if (statusCode === 200) {
                        this.data = message;
                        this.loading = false;
                    }
                });
            },
            createChildTopic(topic) {
                this.currentItem = Object.assign({}, topic, {
                    path: this.currentItem.path,
                    childPath: topic.path
                });
                this.dialogVisible = true;
            },
            createSiblingTopic() {
                const {length} = this.location;
                this.currentItem = Object.assign({}, this.currentItem, {
                    level: length,
                    title: this.location[length - 1]
                });
                this.dialogVisible = true;
            },
            keywordSearch() {
                this.currentPage = 1;
                this.fetchData(this.currentItem);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.fetchData(this.currentItem);
            },
            validateForm() {
                this.$refs.dialog.postPath();
            }
        }
    };
</script>
