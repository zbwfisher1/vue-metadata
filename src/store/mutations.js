// src/store/mutations.js
import * as types from './mutation-types';

const mutations = {
  //保存用户名
  [types.SET_USERNAME] (state, playload) {
    state.username = playload;
  },
  //dataset搜索关键字
  [types.SAVE_DATASET_KEYWORD] (state, playload) {
    state.datasetKeyword = playload;
  },
  [types.SAVE_TABLE_NAME] (state, playload) {
    state.tableName = playload;
  },
  //flow搜索关键字
  [types.SAVE_FLOW_KEYWORD] (state, playload) {
    state.flowKeyword = playload;
  },
  //当前点击树状item
  [types.TREE_ITEM_ACTIVE] (state, playload) {
    state.treeItemActive = playload;
  },
  //模版上传选择的上传文件
  [types.SAVE_UPLOAD_DATA] (state, playload) {
    state.saveUploadDate = playload;
  },
  //flow流程列表
  [types.SAVE_FLOW_PROCESS] (state, playload) {
    state.queryFlow.process = playload.params;
    state.queryFlow.isProcess = playload.isProcess;
  },
  //flow任务列表
  [types.SAVE_FLOW_TASK] (state, playload) {
    state.queryFlow.task = playload.params;
    state.queryFlow.isProcess = playload.isProcess;
  },
  [types.SAVE_PROCESS_SORT] (state, playload) {
    state.defaultSort = playload;
  },
  //手动导入选择设置路径
  [types.SAVE_MANUAL_PATH_DATA] (state, playload) {
    state.selectPath = playload;
  },
  [types.SAVE_SEARCH_VISIBLE] (state, playload) {
    state.selectPath = playload;
  },
  [types.SAVE_SEARCH_ADVANCE] (state, playload) {
    state.selectPath = playload;
  },
  [types.SAVE_SELECT_ITEM] (state, playload) {
    state.selectItem = playload;
  },
  [types.SAVE_VIEW_NOTTABLE] (state, playload) {
    if (playload == "clear") {
      state.viewData.viewNotTable = [null];
      state.viewData.viewActive = "";
      return;
    }
    const level = playload.params.level;
    state.viewData.viewNotTable[level] = playload.params;
    state.viewData.viewActive = playload.viewActive;
  }, //保存视图不是表的数据
  [types.SAVE_VIEW_TABLE] (state, playload) {
    if (playload == "clear") {
      state.viewData.viewTable = {};
      state.viewData.viewActive = "";
      return;
    }
    state.viewData.viewTable = playload.params;
    state.viewData.viewActive = playload.viewActive;

  }, //保存视图表的数据
  [types.SAVE_CHECKLIST] (state, playload) {
    if (playload) {
      let checkArr = state.checkList;
      if (checkArr.indexOf(playload) == -1) {
        state.checkList.push(playload);
      } else {
        state.checkList.splice(checkArr.indexOf(playload), 1);
      }
    } else {
      state.checkList = [];
    }
  },
  [types.SAVE_ISBUSINESS] (state, playload) {
    state.isBusiness = playload;
  },
  [types.SAVE_ISBUSINESS_TITLE] (state, playload) {
    state.isBusinessTitle = playload;
  },
  [types.ADD_THEMECHECKLIST] (state, playload) {
    if (playload) {
      const index = state.themeCheckList.findIndex((v) => {
        return v.selectPath == playload.selectPath;
      });
      if (index == -1) {
        state.themeCheckList.push(playload);

      } else {
        state.themeCheckList.splice(index, 1);
      }
    } else {
      state.themeCheckList = [];
    }
  },
  [types.DEL_THEMECHECKLIST] (state, playload) {
    const index = state.themeCheckList.findIndex((v) => {
      return v.selectTitle == playload;
    });
    state.themeCheckList.splice(index, 1);
  },
  [types.ADD_HEADERNAV] (state, playload) {
    state.headerNav = playload;
  }, //header导航
  [types.SAVE_SOURCEUSER] (state, playload) {
    state.sourceUserMessage = playload;
  },
  [types.SAVE_SOURCETITLE] (state, playload) {
    state.sourceTitle = playload;
  },
  [types.SAVE_FETCHROUTER] (state, playload) {
    state.fetchRouter = playload;
  },
  [types.SET_LANGUAGE] (state, playload) {
    state.language = playload;
  },
  [types.SELECT_ITEMS] (state, playload) {
    if (!playload) {
      state.selectItems = [];
      return;
    }
    let some = state.selectItems.some(val => {
      return val.name === playload.name;
    });
    if (!some) {
      state.selectItems.push(playload);
    } else {
      state.selectItems.forEach(val => {
        val.reType = val.name === playload.name ? playload.reType : val.reType;
      });
    }
  },
  [types.DELET_ITEM] (state, playload) {
    const set = new Set(state.selectItems);
    state.selectItems.forEach(val => {
      if (val.name === playload.name) {
        set.delete(val);
      }
    });
    state.selectItems = [...set];
  },
  //导出元数据表
  [types.SET_EXPORT_LIST] (state, playload) {
    const set = new Set(state.exportList);
    if (typeof playload.ids == 'number') {
      //当添加的是表时

      if (set.has(playload.ids)) {
        set.delete(playload.ids);
        //删除库的选择
        for (let item of set) {
          if (typeof item == 'object') {
            item.includes(playload.ids) && set.delete(item);
          }
        }

        const set1 = new Set(state.exportDBList);
        set1.delete(playload.path);
        state.exportDBList = [...set1];
      } else {
        set.add(playload.ids);
      }
    } else {
      //当添加的是库时
      set.add(playload.ids);
      playload.ids.forEach(val => {
        if (set.has(val)) {
          return;
        } else {
          set.add(val);
        }
      });
    }
    state.exportList = [...set];
  },
  //删除所选库下的表
  [types.DELETE_EXPORT_LIST] (state, playload) {
    const set = new Set(state.exportList);
    let select = [];
    for (let item of set) {
      if (typeof item === 'object' && item.every((val, index) => {
        return item[index] === playload[index];
      })) {
        select = item;
      }
    }
    set.delete(select);
    select.forEach(val => {
      set.has(val) && set.delete(val);
    });
    state.exportList = [...set];
  },
  [types.CLEAR_EXPORT_LIST] (state, playload) {
    state.exportList = [];
    state.exportDBList = [];
  },

  //导出元数据表
  [types.SET_EXPORT_DB_LIST] (state, playload) {
    const set = new Set(state.exportDBList);
    set.add(playload);
    state.exportDBList = [...set];
  },
  //删除所选库下的表
  [types.DELETE_EXPORT_DB_LIST] (state, playload) {
    const set = new Set(state.exportDBList);
    let select = [];
    for (let item of set) {
      if (typeof item === 'object' && item.every((val, index) => {
        return item[index] === playload[index];
      })) {
        select = item;
      }
    }
    set.delete(playload);
    select.forEach(val => {
      set.has(val) && set.delete(val);
    });

    state.exportDBList = [...set];
  },

  [types.SAVE_BUSINESS_STATE] (state, playload) {
    state.businessState = playload;
  },
  [types.SET_TREE_DATA] (state, playload) {
    state.fetchTreeDataEndRequest = true;
    state.hasTreeData = playload;
  },
  [types.BEGINREQUEST] (state, playload) {
    state.fetchTreeDataEndRequest = false;
  },
  [types.SAVE_IMPORT_PRIVILEGE] (state, playload) {
    state.importPrivilege = playload;
  },
  [types.SET_EXPORT_SEARCH] (state, playload) {
    state.exportSearh = playload;
  },
  [types.SET_DATA_STATUS] (state, playload) {
    state.dataStatus = playload;
  },
  [types.SET_TREE_LOADING] (state, playload) {
    state.treeLoading = playload;
  },
  [types.TREE_BUSINESS_LOADING] (state, playload) {
    state.treeBusinessLoading = playload;
  },
  [types.SAVE_COLLECT_COUNT] (state, playload) {
    state.collectCount = playload;
  },
  [types.SET_FULL_LOADING] (state, playload) {
    state.fullLoading = playload;
  },
  [types.FULL_TREE_LOADING] (state, playload) {
    state.fullTreeLoading = playload;
  },
  [types.SAVE_ROUTER] (state, playload) {
    state.saveRouter = playload;
  },
  [types.SET_NAV_DATA] (state, playload) {
    state.navIsData = playload;
  },
  [types.SET_PRIVATE] (state, playload) {
    state.isPrivate = playload;
  },
  [types.SET_PROPEDITPRIVILEGE] (state, playload) {
    state.propEditPrivilege = playload;
  },
  [types.SET_SOURCELINK] (state, playload) {
    state.setSourceLink = playload;
  },
  [types.SET_CREATETASK] (state, playload) {
    state.createTask = playload;
  },
  [types.ADD_TABLES] (state, playload) {
    state.addTables = playload;
  },
  [types.SAVE_BLACKLIST] (state, playload) {
    state.saveBlackList = [];
    state.saveBlackList = playload;
  },
  [types.GET_SAMPLE] (state, playload) {
    state.getSample = playload;
  },
  [types.SEARCH_TABLE] (state, playload) {
    state.searchTable = playload;
  },
  [types.CRON_VALUE] (state, playload) {
    state.cronValue = playload;
  },
  [types.CLOSE_DIALOG] (state, playload) {
    state.closeDialog = playload;
  },
  [types.SHOW_CRON] (state, playload) {
    state.showCron = playload;
  },
  [types.SELECT_TABLE] (state, playload) {
    state.selectTables.push(playload);
  },
  [types.CLEAR_TABLE] (state, playload) {
    state.selectTables.forEach((val, index) => {
      if (val.tableName && val.databaseName == playload.databaseName) {
        state.selectTables.splice(index, 1);
      }
    });
  },
  [types.SET_EXPORT_TABLE_SOURCE] (state, playload) {
    state.exportTableSource = playload;
  },
  [types.TEST_BLACKLIST] (state, playload) {
    state.testBlackList = playload;
  },
  [types.SAVE_SELECTLIST] (state, playload) {
    state.saveSelectList = playload;
  },
  [types.SET_SEARCH_PARAMS] (state, playload) {
    Object.keys(playload).forEach(key => {
      state.setSearchParams[key] = playload[key];
    });
  },
  [types.CHANGE_TABLE_TYPE_OPTS] (state, playload) {
    state.tableTypeOpts = playload;
  },
  [types.SET_MODEL_OPEN] (state, playload) {
    state.modelOpen = playload;
  },
  [types.SET_MANAGE_INFO] (state, playload) {
    Object.keys(playload).forEach(key => {
      state.manageInfo[key] = playload[key];
    });
  },
  [types.SET_USER_INFO] (state, playload) {
    state.userInfo = playload;
  },
  [types.SET_OWNER_TAB] (state, playload) {
    state.ownerActiveTab = playload;
  },
  [types.SET_NAV_VISIBLE] (state, payload) {
    state.navVisible = payload;
  },
  [types.CLEAR_TIMEOUT] (state, payload) {
    state.clearTimeout = payload;
  },
  [types.SOURCE_TYPE] (state, payload) {
    state.sourceType = payload;
  },
  //保存版本号
  [types.SAVE_VERSIONS] (state, playload) {
    state.versions = playload;
  },
  [types.TOGGLE_EDITING_STATUS] (state, playload) {
    state.isEditSetting = playload;
  }
};
export default mutations;
