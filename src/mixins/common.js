/**
 *
 *@组件共用方法
 *
 */

/*
 *
 *@时间格式化formatTime(params1,params2)
 *params1:需要转换的时间，默认单位ms
 *params2:需要返回的类型，默认日期，时间YY-MM-DD:hh-mm-ss
 *
 */

const FormatTime = {
	methods: {
		formatTime(timestamp, type = "dateTime") {
			if (!timestamp) {
				return '';
			} else {
				let date = new Date(timestamp),
					year = date.getFullYear(),
					month = date.getMonth() + 1,
					day = date.getDate(),
					hour = date.getHours(),
					minute = date.getMinutes(),
					second = date.getSeconds();
				month < 10 && (month = '0' + month);
				day < 10 && (day = '0' + day);
				hour < 10 && (hour = '0' + hour);
				minute < 10 && (minute = '0' + minute);
				second < 10 && (second = '0' + second);
				if (type === "dateTime") {
					return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
				} else if (type === "date") {
					return year + '-' + month + '-' + day;
				} else if (type === "time") {
					return hour + ':' + minute + ':' + second;
				}
			}
		}
	}
};

/*
 *
 *@存储大小格式化formatSize(params1)
 *params1:需要转换的成存储大小的值
 *
 */

const FormatSize = {
	methods: {
		formatSize(bytes) {
			const k = 1024;
			const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
			if (!bytes && bytes != 0) {
				return;
			}
			if (bytes == 0) return '0 B';
			else {
				let newByte = Math.abs(bytes);
				let i = Math.floor(Math.log(newByte) / Math.log(k));
				if (i > 0) {
					return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
				} else {
					return bytes + 'B';
				}

			}
		}
	}
};

/*
 *
 *@顶部提示信息message(params1,params2,params3)
 *params1:需要提示的文本信息
 *params2:提示信息类型，success(成功)，warning(警告)，error(错误)
 *params3:提示信息持续时间，默认2s
 *
 */

const Message = {

	methods: {
		message(message, type = "warning", duration = 2000) {
			this.$message({
				showClose: true,
				message: message,
				customClass: `el-toast__${type}`,
				iconClass: `el-type__${type}`,
				type,
				duration
			});
		}
	}
};

/*
 *
 *@重置validate信息resetValidators(params1)
 *params1:需要重置的表单名
 *
 */
//清空validate信息
const resetValidators = {
	methods: {
		resetValidators(formName) {
			if (this.$refs[formName]) {
				this.$refs[formName].resetFields();
			}
		}
	}
};

/*
 *
 *@高亮搜索结果emphasizeName(params1,params2)
 *params1:需要高亮的文字
 *params2:高亮的关键字
 *
 */
//高亮搜索结果
const EmphasizeName = {
	methods: {
		emphasizeName(name, keyword) {
			let key = keyword;
			if (!key) {
				return name;
			}
			if (!name) {
				return '';
			}
			let _keyword = key.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&"); //是否有特殊字符输入,有就转义
			// if (/\s+/g.test(_keyword)) {
			_keyword = _keyword.replace(/\s+/g, "|");
			// }
			const Reg = new RegExp(_keyword, "gi");
			let _name = name;
			if (_name.match(Reg)) {
				_name = _name.replace(eval("/(" + _keyword + ")/gi"), '<b style="color: #C00">' + '$1' + '</b>');
			}
			return _name;
		}
	}
};

/*
 *
 *@测试权限testPrivilege(params1,params2)
 *params1:权限测试的URL
 *params2:接口支持的请求类型,默认post
 *
 */
const testPrivilege = {
	data() {
		return {
			hasPrivilege: false
		};
	},
	methods: {
		async testPrivilege(url, type = 'post', last = "") {
			if (url.includes('undefined')) {
				return;
			}
			let _url = !!last ? `${url}?testPrivilege=1&${last}` : `${url}?testPrivilege=1`;
			return this.axios[type](_url).then(res => {
				this.hasPrivilege = res.data.statusCode === 200;
			});
		}
	}
};

/*
 *
 *@窗口分割点位置treeControlInit(params1)
 *params1:初始位置，默认280
 *
 */
const windowSplitter = {
	data: function() {
		return {
			splitter: 0
		};
	},
	methods: {
		treeControlInit(distance = 250) {
			distance = +distance;
			this.splitter = $('#MainCon').split({
				orientation: 'vertical',
				limit: distance,
				position: distance,
				onDrag: (event) => {
					const windowHalfW = ~~$(window).width() / 2;
					const splitterPosition = this.splitter.position();
					if (splitterPosition >= windowHalfW) {
						this.splitter.position(windowHalfW);
					}
					this.resetPosition();
				}
			});
		}
	}
};

/*
 *
 *@调整下拉框
 *
 */
const SelectRender = {
	updated() {
		//调整下拉框
		this.$nextTick(() => {
			let select = $('.el-select-dropdown');
			let elSelect = document.querySelector('.el-select');
			let elDropDown = document.querySelector('.el-select-dropdown');
			let windowH = $(window).height();
			let boundingClientRect;
			let dropDownPosition;
			if (elSelect && select.length > 0) {
				boundingClientRect = elSelect.getBoundingClientRect();
				$('.content').scroll(() => {
					boundingClientRect = elSelect.getBoundingClientRect();
					dropDownPosition = elDropDown.getBoundingClientRect();
					if (windowH - dropDownPosition.bottom < 0) {
						$('.el-select-dropdown').css({
							'top': `${boundingClientRect.top - 200}px`
						});
					} else {
						$('.el-select-dropdown').css('top', `${boundingClientRect.top + 30}px`);
					}
				});
			}
		});
	}
};

/*
 *
 *@生命周期格式化switchLifeType(params1,params2)
 *params1:生命周期时间
 *params2:生命周期转换的类型
 *
 */
const FormatLifeDay = {
	computed: {
		showRecordList() {
			Array.from(this.$data.records, v => {
				v.showLifeDay = this.switchLifeType(v);
			});
			return this.$data.records;
		}
	},
	methods: {
		switchLifeType({
			               lifeDay = "",
			               lifeType = ""
		               }, ...param) {
			let lang = window.localStorage.getItem('lang');
			let showType = '';
			switch (lifeType) {
				case 'F':
					showType = lang == 'en' ? 'Forever' : '永久';
					break;
				case 'D':
					showType = lang == 'en' ? ' Day' : '天';
					break;
				case 'W':
					showType = lang == 'en' ? ' Week' : '周';
					break;
				case 'M':
					showType = lang == 'en' ? ' Month' : '月';
					break;
				case 'Y':
					showType = lang == 'en' ? ' Year' : '年';
					break;
				default:
					showType = '';
					break;
			}
			if (lifeDay || lifeDay === 0) {
				lifeDay = showType === '永久' || showType === 'Forever' ? '' : lifeDay;
				showType = `${lifeDay}${showType}`;
			} else {
				showType = '';
			}
			return showType;
		}
	}
};

/*
 *
 *@资源空间：千分号
 *
 */
const ToThousand = {
	methods: {
		toThousand(num) {
			num = num + '';
			let counter = 1;
			let newStr = '';
			for (let i = (num.length - 1); i >= 0; i--) {
				newStr = num.charAt(i) + newStr;
				if (!(counter % 3) && i) {
					newStr = ',' + newStr;
				}
				++counter;
			}
			return newStr;
		}
	}
};

const reStructureTreeData = {
	methods: {
		reStructureTreeData() {
			let hasNextPage = true;
			let path = '';

			function checkChildren(data) {
				data.forEach((val, index) => {
					if (val.level == 3 && val.children) {
						hasNextPage = val.children.hasNextPage;
						path = val.path;
					}
					if (val.children) {
						checkChildren(val.children.records);
					} else if (index == (data.length - 1) && val.level == 4 && hasNextPage) {
						data.push({type: 'more', children: [], path});
					}
				});
			}

			this.treeData.forEach(val => {
				if (val.children) {
					checkChildren(val.children.records);
				}
			});
		}
	}
};

//表格排序
const SortTable = {
	data() {
		return {
			isLoading: true
		};
	},
	methods: {
		sortTable(params) {
			const cacheOrder = this.order;  //上一次的排序字段
			const cacheSort = this.sort;  //上一次的排序值
			this.sort = params.prop;
			if (params.order === 'descending') {
				this.order = 'desc';
			} else if (params.order === 'ascending') {
				this.order = 'asc';
			} else {
				this.order = null;
			}
			if (this.isLoading) {   //防止重复请求数据
				this.isLoading = false;
				this.fetchData();
				setTimeout(() => {
					this.isLoading = true;
				}, 500);
			}
		}
	}
};
/*
 *这里是配合表格使用
 *@存储大小格式化_formatSize(row, column)
 *
 *
 */
const _FormatSize = {
	methods: {
		_formatSize(row, column, cellValue) {
			let bytes = row[column.property];
			const k = 1024;
			const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
			if (!bytes && bytes != 0) {
				return;
			}
			;
			if (bytes == 0) return '0 B';
			else {
				let newByte = Math.abs(bytes);
				let i = Math.floor(Math.log(newByte) / Math.log(k));
				if (i > 0) {
					return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
				} else {
					return bytes + 'B';
				}
			}
		}
	}
};

const _FormatTime = {
	methods: {
		_formatTime(row, column, cellValue) {
			let timestamp = row[column.property];
			let type = "dateTime";
			if (!timestamp) {
				return '';
			} else {
				let date = new Date(timestamp),
					year = date.getFullYear(),
					month = date.getMonth() + 1,
					day = date.getDate(),
					hour = date.getHours(),
					minute = date.getMinutes(),
					second = date.getSeconds();
				month < 10 && (month = '0' + month);
				day < 10 && (day = '0' + day);
				hour < 10 && (hour = '0' + hour);
				minute < 10 && (minute = '0' + minute);
				second < 10 && (second = '0' + second);
				if (type === "dateTime") {
					return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
				} else if (type === "date") {
					return year + '-' + month + '-' + day;
				} else if (type === "time") {
					return hour + ':' + minute + ':' + second;
				}
			}
		}
	}
};

export {
	FormatLifeDay,
	FormatTime,
	FormatSize,
	Message,
	resetValidators,
	EmphasizeName,
	testPrivilege,
	windowSplitter,
	SelectRender,
	ToThousand,
	reStructureTreeData,
	SortTable,
	_FormatSize,
	_FormatTime
};
