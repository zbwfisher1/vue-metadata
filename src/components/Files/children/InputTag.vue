<template>
    <div @click="focusNewTag()"
         :class="{
      'read-only': readOnly,
      'vue-input-tag-wrapper--active': isInputActive,
       }" class="vue-input-tag-wrapper">

        <el-tag size="mini"
                :key="index"
                :title="tag"
                v-for="(tag, index) in innerTags"
                closable
                :disable-transitions="false"
                @close="remove(index, tag)">
            {{tag}}
        </el-tag>
        <input
                v-if="!readOnly && !isLimit"
                ref="inputtag"
                :placeholder="placeholder"
                type="text"
                v-bind:value="newTag"
                v-on:input="newTag = $event.target.value"
                v-on:keydown.delete.stop="removeLastTag"
                v-on:keydown="addNew"
                v-on:keyup.enter="$emit('search')"
                v-on:blur="handleInputBlur"
                v-on:focus="handleInputFocus"
                class="new-tag"
        />
        <div class="search-btn" @click="$emit('search')">{{$t('content.header.ss')}}</div>
    </div>
</template>
<script>
    /* eslint-disable */
    const validators = {
        email: new RegExp(
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
        url: new RegExp(
                /^(https?|ftp|rmtp|mms):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i
        ),
        text: new RegExp(/^[a-zA-Z]+$/),
        digits: new RegExp(/^[\d() \.\:\-\+#]+$/),
        isodate: new RegExp(
                /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/
        )
    };
    /* eslint-enable */

    export default {
        name: "InputTag",

        props: {
            value: {
                type: Array,
                default: () => []
            },
            placeholder: {
                type: String,
                default: ""
            },
            readOnly: {
                type: Boolean,
                default: false
            },
            validate: {
                type: String | Function | Object,
                default: ""
            },
            addTagOnKeys: {
                type: Array,
                default: function () {
                    return [
                        13, // Return
                        188, // Comma ','
                        9 // Tab
                    ];
                }
            },
            addTagOnBlur: {
                type: Boolean,
                default: false
            },
            limit: {
                type: Number,
                default: -1
            },
            allowDuplicates: {
                type: Boolean,
                default: false
            },
            newTag: {
                type: String,
                default: ""
            }
        },

        data() {
            return {
                innerTags: [...this.value],
                isInputActive: false
            };
        },
        watch: {
            value: function (newValue, oldValue) {
                this.innerTags = newValue;
            },
            newTag: function (newValue, oldValue) {
                this.$emit('update:newTag', newValue);
            }
        },
        computed: {
            isLimit: function () {
                return this.limit > 0 && Number(this.limit) === this.innerTags.length;
            }
        },
        methods: {
            focusNewTag() {
                if (this.readOnly || !this.$el.querySelector(".new-tag")) {
                    return;
                }
                //this.$el.querySelector(".new-tag").focus();
            },

            handleInputFocus() {
                this.isInputActive = true;
                this.$emit("show:search", true);
            },

            handleInputBlur(e) {
                this.isInputActive = false;
                this.addNew(e);
            },
            addNew(e) {
                const keyShouldAddTag = e
                        ? this.addTagOnKeys.indexOf(e.keyCode) !== -1
                        : true;

                const typeIsNotBlur = e && e.type !== "blur";

                if (
                        (!keyShouldAddTag && (typeIsNotBlur || !this.addTagOnBlur)) ||
                        this.isLimit
                ) {
                    return;
                }

                if (
                        this.newTag &&
                        (this.allowDuplicates || this.innerTags.indexOf(this.newTag) === -1) &&
                        this.validateIfNeeded(this.newTag)
                ) {
                    this.innerTags.push(this.newTag);
                    this.newTag = "";
                    this.tagChange();

                    e && e.preventDefault();
                }
            },

            validateIfNeeded(tagValue) {
                if (this.validate === "" || this.validate === undefined) {
                    return true;
                }

                if (typeof this.validate === "function") {
                    return this.validate(tagValue);
                }

                if (
                        typeof this.validate === "string" &&
                        Object.keys(validators).indexOf(this.validate) > -1
                ) {
                    return validators[this.validate].test(tagValue);
                }

                if (
                        typeof this.validate === "object" &&
                        this.validate.test !== undefined
                ) {
                    return this.validate.test(tagValue);
                }

                return true;
            },

            remove(index, tag) {
                this.innerTags.splice(index, 1);
                this.$emit("update:tags", tag);
                this.tagChange();
            },

            removeLastTag() {
                if (this.newTag) {
                    return;
                }
                this.$emit("update:tags", this.innerTags.pop());
                this.tagChange();
            },
            tagChange() {
                this.$emit("input", this.innerTags);
            }
        }
    };
</script>
<style lang="less">
    .search-btn {
        width: 50px;
        vertical-align: middle;
        background-color: #F5F7FA;
        border-left: 1px solid #DCDFE6;
        text-align: center;
        line-height: 30px;
        font-size: 12px;
        cursor: pointer;
        color: #909399;
    }

    .vue-input-tag-wrapper {
        background-color: #FFF;
        border: 1px solid #DCDFE6;
        padding-left: 5px;
        cursor: text;
        text-align: left;
        display: flex;

        .el-tag {
            position: relative;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 120px;
            margin-top: 5px;
            padding-right: 15px;

            .el-tag__close {
                position: absolute;
                top: 2px;
                right: 0;
            }
        }
    }

    .vue-input-tag-wrapper .input-tag {
        background-color: #CDE69C;
        border-radius: 2px;
        border: 1px solid #A5D24A;
        color: #638421;
        display: inline-block;
        font-size: 13px;
        font-weight: 400;
        margin-bottom: 4px;
        margin-right: 4px;
        padding: 3px;
    }

    .vue-input-tag-wrapper .input-tag .remove {
        cursor: pointer;
        font-weight: bold;
        color: #638421;
    }

    .vue-input-tag-wrapper .input-tag .remove:hover {
        text-decoration: none;
    }

    .vue-input-tag-wrapper .input-tag .remove::before {
        content: " x";
    }

    .vue-input-tag-wrapper .new-tag {
        min-width: 30px;
        background: transparent;
        border: 0;
        color: #777;
        font-size: 12px;
        font-weight: 400;
        line-height: 30px;
        outline: none;
        flex: 1;
        margin-left: 5px;
        padding-right: 20px;
    }

    .vue-input-tag-wrapper.read-only {
        cursor: default;
    }
</style>
