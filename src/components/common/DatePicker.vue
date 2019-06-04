<template>
<!-- :placeholder="$t('content.common.xzrqfs')" -->
<!-- :default-value="dateValue" -->
<!-- change="testValue" -->
<!-- popper-class="datePicker" -->
<div>
	<el-date-picker
		:clearable="false"
		:default-value="dateValue"
		:title="dateTitle"
		ref="date"
		v-model="dateValue"
		type="daterange"
		:range-separator="$t('content.common.to')"
		:picker-options="pickerOptions"
		popper-class="datePicker"
		:align="direction"
		size="small"
		:editable="false"
		change="testValue"
		start-placeholder="开始日期"
		end-placeholder="结束日期"
	>
	</el-date-picker>
	</div>
</template>

<script>
import Vue from 'vue';
import {FormatTime} from 'mixins/common'//时间格式化
//ElementUI国际化
// import langZh from 'element-ui/lib/locale/lang/zh-CN'
// import langEn from 'element-ui/lib/locale/lang/en'
// import locale from 'element-ui/lib/locale'

// export default{
// 	mixins:[FormatTime],
// 	data(){
// 		const vm = this;
// 		return{
// 			pickerOptions:{
// 				disabledDate(time) {
// 					return time.getTime() > Date.now();
//           //  return time.getTime() > Date.now() - 8.64e7;
//         },
//         shortcuts: [{
//             text: this.$t('content.common.qd'),
//             onClick(picker) {
//             	const dateArr = vm.dateSelect.map((date)=>{
//             		const _date = new Date(date).getTime();
//             		return vm.formatTime(_date,"date")
//             	})
// 							vm.$emit('fectchDate',dateArr)
// 							picker.$emit('pickEnd',dateArr)
// 							},
//           }],
// 			},
// 			dateValue: [],
// 			dateSelect:[],
// 			showClose: false,
// 			language: '',
// 			pickerVisible: false
// 		}
// 	},
// 	props:{
// 		direction: {
// 	      type: String,
// 	      default:'left'
//   		}
// 	},
// 	computed:{
// 		dateTitle(){
// 			return this.dateValue && this.dateValue.join(' to ');
// 		},
// 	},
// 	methods:{
// 		handleClickIcon(...param){
// 			console.log('handleClickIcon')
// 			const vm = this;
// 			if (vm.readonly || vm.disabled) return;
// 			if (param.length || param[0]) {
// 				vm.currentValue = '';
// 				vm.dateValue = [];
// 				vm.showClose = false;
// 				//这里导致fetchData emit了两次
// 				// [Date.now(), Date.now()]
// 				this.$emit('fectchDate', ['', ''])
// 				this.pickerVisible = false
// 				// this.picker.handleClear();
// 			} else {
// 				vm.pickerVisible = false
// 			}
// 		}
// 	},
// 	mounted(){
// 		/*
// 		 *
// 		 *@修改饿了么日期选择组件方法
// 		 *
// 		 */
// 		// this.$emit('fectchDate', ['', '']);
// 		this.pickerVisible = false
// 		 const vm = this.$refs.date;
// 		 vm.handleClickIcon = ()=> {

// 		      if (vm.readonly || vm.disabled) return;
// 		      if (vm.showClose) {
// 		        vm.currentValue = '';
// 						vm.showClose = false;
// 						// this.$emit('fectchDate', ['', '']);
// 						this.pickerVisible = false
// 						// console.log(3)
// 						// this.picker.handleClear();
// 					}
// 					else {
// 		        vm.pickerVisible = false
// 					}
// 		    }
// 		 vm.showPicker = ()=>{
//    			if (vm.$isServer) return;
//    			if (!vm.picker) {
//    			  vm.panel.defaultValue = vm.currentValue;
//    			  vm.picker = new Vue(vm.panel).$mount();
//    			  vm.picker.popperClass = vm.popperClass;
//    			  vm.popperElm = vm.picker.$el;
//    			  vm.picker.width = vm.reference.getBoundingClientRect().width;
//    			  vm.picker.showTime = vm.type === 'datetime' || vm.type === 'datetimerange';
//    			  vm.picker.selectionMode = vm.selectionMode;
//    			  if (vm.format) {
//    			    vm.picker.format = vm.format;
//    			  }

//    			  const updateOptions = () => {
//    			    const options = vm.pickerOptions;

//    			    if (options && options.selectableRange) {
//    			      let ranges = options.selectableRange;
//    			      const parser = TYPE_VALUE_RESOLVER_MAP.datetimerange.parser;
//    			      const format = DEFAULT_FORMATS.timerange;

//    			      ranges = Array.isArray(ranges) ? ranges : [ranges];
//    			      vm.picker.selectableRange = ranges.map(range => parser(range, format, vm.rangeSeparator));
//    			    }

//    			    for (const option in options) {
//    			      if (options.hasOwnProperty(option) &&
//    			          // 忽略 time-picker 的该配置项
//    			          option !== 'selectableRange') {
//    			        vm.picker[option] = options[option];
//    			      }
//    			    }
//    			  };
//    			  updateOptions();
//    			  vm.$watch('pickerOptions', () => updateOptions(), { deep: true });


//    			  vm.$el.appendChild(vm.picker.$el);
//    			  vm.pickerVisible = vm.picker.visible = true;
//    			  vm.picker.resetView && vm.picker.resetView();

// 					//  vm.picker.$on('dodestroy', vm.doDestroy);

// 					 //重新改写事件

//    			  vm.picker.$on('pick', (date) => {
//  			  	  this.dateSelect = date;
// 					 });

//    			   vm.picker.$on('pickEnd', (date,visible = false) => {
// 							if(date.length!=0){
// 								vm.$emit('input', date)
// 							}
// 							vm.dateValue = date
//    			  	  vm.pickerVisible = vm.picker.visible = visible;
//    			  	  vm.picker.resetView && vm.picker.resetView();
// 					 });

//    			  vm.picker.$on('select-range', (start, end) => {
//    			    vm.refInput.setSelectionRange(start, end);
//    			    vm.refInput.focus();
//    			  });
//    			} else {
//    			  vm.pickerVisible = vm.picker.visible = true;
//    			}

//    			vm.updatePopper();

//    			if (vm.currentValue instanceof Date) {
//    			  vm.picker.date = new Date(vm.currentValue.getTime());
//    			} else {
//    			  vm.picker.value = vm.currentValue;
//    			}
//    			vm.picker.resetView && vm.picker.resetView();

//    			vm.$nextTick(() => {
//    			  vm.picker.ajustScrollTop && vm.picker.ajustScrollTop();
//    			});
//   		}
// 	},
// }
</script>
<style lang="less" scope>
// .datePicker.has-sidebar .el-date-table td.end-date{
// 	background: #fff !important;
// }
// 	.baseBorder{
// 		border:1px solid #cecece;
// 	}
// 	.el-icon-date:before{
// 		cursor: pointer;
// 		content: "";
// 		display:inline-block;
// 		width: 14px;
// 		height: 16px;
// 		background: url("~assets/images/icon_datePicker.png") no-repeat;
// 	}
// 	.datePicker{
// 		width: auto !important;
// 	}
// 	.datePicker.has-sidebar{
// 		// min-width: 502px;
// 		.el-picker-panel__body-wrapper{
// 			background: #f1f1f1;
// 			padding: 10px 10px 50px 10px;
// 		}
// 		.el-date-range-picker__header{
// 			height: 30px;
// 			background: #146db1;
// 			color: #fff;
// 			line-height: 30px;
// 			padding: 0 10px;
// 		}
// 		.el-picker-panel__icon-btn{
// 			margin-top: 10px;
// 			color: #fff;
// 		}
// 		.el-icon-arrow-left{
// 			margin-left: 10px;
// 		}
// 		.el-icon-arrow-right{
// 			margin-right: 10px;
// 		}
// 		// .el-picker-panel__body{
// 		// 	min-width: 480px;
// 		// 	max-width: 480px;
// 		// }
// 		.el-picker-panel__content{
// 			padding: 0;
// 			max-width: 230px;
// 		}
// 		 .el-date-range-picker__content.is-left{
// 			margin-right: 10px
// 		}
// 		.el-date-range-picker__content.is-right{
// 			margin-left: 10px
// 		}
// 		.el-date-table tr:first-child{
// 			.baseBorder;
// 		}
// 		.el-date-table th{text-align: center;}
// 		.el-date-table__row{
// 			background: #fff
// 		}
// 		.el-date-table td{
// 			height: 20px;
// 			.baseBorder;
// 		}
// 		.el-date-table td.in-range,
// 		.el-date-table td.available:hover {
// 		    background-color: #fac9ca;
// 		}
// 		.el-date-table td.start-date,
// 		.el-date-table td.end-date{
// 			 background-color: #d26b9e!important;
// 		}
// 		.el-picker-panel__sidebar+.el-picker-panel__body{
// 			min-width: 0;
// 			margin:0;
// 		}
// 		.el-picker-panel__sidebar{
// 			padding: 0;
// 			bottom:10px;
// 			width: 62px;
// 			right: 10px;
// 			top:inherit;
// 		}
// 		.el-picker-panel__shortcut{
// 			background: #146db1;
// 			padding: 0;
// 			text-align: center;
// 			color: #fff;
// 			border: 1px solid #014b70;
// 			&:hover{
// 				background: #4492ba;
// 			}
// 		}
// 	}
// 	.el-date-editor--daterange.el-input__inner{
// 		width: 250px;
// 	}
	// .el-range-editor--small .el-range-separator{
	// 	width: 22px;
	// }
</style>
