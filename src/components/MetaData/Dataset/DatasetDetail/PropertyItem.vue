<template>
    <div class="attribute-item" :class="{editing: itemName === parentLabel}" v-if="isDIV">
        <div class="view">
            <label
                    @dblclick="editItem"
                    class="ali-placeholder"
                    v-if="!value">
                {{placeholder}}
                <i @click="editItem" class="edit-tip el-icon-edit"></i>
            </label>

            <label v-else>
                <div class="content"
                     @dblclick="editItem"
                     v-ellipsis="selectLabel"
                     style="float: left;"></div>
                <div style="float: right;">
                    <i @click="editItem" class="edit-tip el-icon-edit"></i>
                </div>
            </label>
        </div>
        <textarea
                v-if="!isSelect && itemName == 'description'"
                class="edit edit-textarea"
                type="text"
                :maxlength="maxlength"
                v-model="itemValue"
                @blur="doneEdit"
                @keyup.enter="doneEdit"
                @keyup.esc="cancelEdit"
                v-focus="parentLabel === itemName"
        ></textarea>
        <input v-if="!isSelect && itemName != 'description'"
               class="edit"
               type="text"
               :maxlength="maxlength"
               v-model="itemValue"
               @blur="doneEdit"
               @keyup.enter="doneEdit"
               @keyup.esc="cancelEdit"
               v-focus="parentLabel === itemName"/>
        <el-select v-if="isSelect && !isRemote"
                   v-model="itemValue"
                   :placeholder="$t('content.common.qxza')"
                   class="edit"
                   @visible-change="selectVisibleChange">
            <el-option
                    v-for="item in selectList"
                    :label="item[0]"
                    :value="item[1]">
            </el-option>
        </el-select>
        <template v-if="isSelect && isRemote">
            <el-select v-model="itemValue"
                       ref="remoteSelect"
                       class="edit"
                       filterable
                       remote
                       clearable
                       :placeholder="$t('content.common.qxza')"
                       :remote-method="remoteMethod"
                       @visible-change="selectVisibleChange"
                       :loading="loading">
                <el-option
                        v-for="item in selectList"
                        :key="item"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>
        </template>
    </div>
    <div class="attribute-item" :class="{editing: itemName === parentLabel}" v-else>
        <div class="view">
            <label @dblclick="editItem"
                   class="ali-placeholder"
                   v-if="!value">
                {{placeholder}}
                <i @click="editItem" class="edit-tip el-icon-edit"></i>
            </label>
            <label v-else>
                <div class="content"
                     @dblclick="editItem"
                     v-ellipsis="selectLabel"
                     style="float: left;"></div>
                <div style="float: right;">
                    <i @click="editItem" class="edit-tip el-icon-edit"></i>
                </div>
            </label>
        </div>
        <textarea
                v-if="!isSelect && itemName == 'description'"
                class="edit edit-textarea"
                type="text"
                :maxlength="maxlength"
                v-model="itemValue"
                @blur="doneEdit"
                @keyup.enter="doneEdit"
                @keyup.esc="cancelEdit"
                v-focus="parentLabel === itemName"
        ></textarea>
        <input v-if="!isSelect && itemName != 'description'"
               class="edit"
               type="text"
               :maxlength="maxlength"
               v-model="itemValue"
               @blur="doneEdit"
               @keyup.enter="doneEdit"
               @keyup.esc="cancelEdit"
               v-focus="parentLabel === itemName"/>
        <el-select v-if="isSelect && !isRemote"
                   v-model="itemValue"
                   :placeholder="$t('content.common.qxza')"
                   class="edit"
                   @visible-change="selectVisibleChange">
            <el-option v-for="item in selectList"
                       :label="$t(item[0])"
                       :value="item[1]">
            </el-option>
        </el-select>
        <template v-if="isSelect && isRemote">
            <el-select v-model="itemValue"
                       ref="remoteSelect"
                       class="edit"
                       filterable
                       :placeholder="$t('content.common.qxza')"
                       remote
                       clearable
                       :remote-method="remoteMethod"
                       @visible-change="selectVisibleChange"
                       :loading="loading">
                <el-option
                        v-for="item in selectList"
                        :key="item"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>
        </template>
    </div>
</template>
<script>
    import {textFieldLength} from '@/config/env';
    import Bus from 'utils/bus';

    export default {
        name: 'PropertyItem',
        props: {
            className: String,
            itemName: [String, Object],
            value: String,
            parentLabel: [String, Object],
            placeholder: String,
            isSelect: {
                default: false,
                type: Boolean
            },
            maxlength: {
                type: [Boolean, Number],
                default: function () {
                    return textFieldLength.normal;
                }
            },
            isRemote: {
                default: false,
                type: Boolean
            },
            isDIV: {
                default: false,
                type: Boolean
            },
            selectList: Array
        },
        data() {
            const vm = this;
            return {
                editedLabel: '',
                itemValue: '',
                loading: false
            };
        },
        watch: {
            value(val) {
                this.itemValue = val;
            }
        },
        created() {
            this.editedLabel = this.parentLabel;
            this.$nextTick(() => {
                this.itemValue = this.value;
            });
        },
        directives: {
            'focus': function (el, binding) {
                if (binding.value) {
                    el.focus();
                }
            }
        },
        computed: {
            selectLabel() {
                let showLabel = '';
                if (this.isSelect && this.selectList.length > 0 && this.itemName !== 'owner') {
                    let find = this.selectList.find(val => {
                        return val[1] === this.itemValue;
                    });
                    showLabel = find ? this.$t(find[0]) : '';
                } else {
                    showLabel = this.itemValue;
                }
                return showLabel;
            }
        },
        methods: {
            remoteMethod(keyword) {
                this.$emit('remote', keyword);
            },
            remoteChange() {
                this.$emit('change');
            },
            editItem() {
                if (this.isRemote && this.isSelect) {  //如果当前编辑的远程下拉框
                    this.$nextTick().then(() => {
                        // DOM 更新了
                        this.$refs.remoteSelect.focus();   //下拉选择框获得焦点
                    });
                }
                Bus.$emit('setEditLabel', this.itemName);
            },
            async doneEdit() {
                if (!this.parentLabel) {
                    return;
                }
                const editedLabel = this.itemName;
                let beforeEditCache = this.value;
                if (typeof this.itemName === 'string') {
                    const params = {
                        value: this.itemValue,
                        editedLabel,
                        beforeEditCache
                    };
                    this.$emit('emitDoneEdit', params);
                } else {
                    const params = this.itemName;
                    params.comment = this.itemValue;
                    this.$emit('emitDoneEdit', params);
                }
            },
            cancelEdit() {
                Bus.$emit('cancelEdit', this.value, this.itemName);
            },
            selectVisibleChange(val) {
                !val && this.doneEdit();
            }
        }
    };

</script>
<style lang="less">
    .attribute-item {
        width: 100%;
    }
    .editing {
        .edit {
            display: block;
            width: 100%;
            outline: none;
        }
        textarea.edit {
            height: 30px;
        }
        input.edit {
            height: 30px;
        }
        .error {
            display: inline;
            margin-left: 10px;
            color: #F00;
        }
        .view {
            height: 30px;
            line-height: 30px;
            display: none;
        }
        .el-select {
            border: 0;
            padding-left: 0;
            height: auto !important;
            width: 160px;
            .el-input__inner {
                width: 160px;
                height: 27px !important;
            }
        }
    }
    .edit-tip {
        display: none;
        position: absolute;
        top: 6px;
        right: 5px;
    }
    .view label {
        padding-left: 0;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .content {
            width: 90%;
        }
    }
    .view label:hover .edit-tip {
        display: block;
    }
    .edit-textarea {
        padding-top: 3px;
        padding-bottom: 3px;
        line-height: 20px;
    }
</style>
