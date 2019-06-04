import * as types from './mutation-types';

const actions = {
  //保存用户名
  setUsername ({
                 commit
               }, playload) {
    commit(types.SET_USERNAME, playload);
  },
  //dataset搜索关键字
  saveDatasetKeyword ({
                        commit
                      }, playload) {
    commit(types.SAVE_DATASET_KEYWORD, playload);
  },
  //dataset搜索关键字
  saveTableName ({
                   commit
                 }, playload) {
    commit(types.SAVE_TABLE_NAME, playload);
  },
  //flow搜索关键字
  saveFlowKeyword ({
                     commit
                   }, playload) {
    commit(types.SAVE_FLOW_KEYWORD, playload);
  },
  //当前点击树状item
  saveTreeItemActive ({
                        commit
                      }, playload) {
    commit(types.TREE_ITEM_ACTIVE, playload);
  },
  //模版上传选择的上传文件
  saveUploadData ({
                    commit
                  }, playload) {
    commit(types.SAVE_UPLOAD_DATA, playload);
  },
  //dataset数据源存储
  saveQueryFlow ({
                   commit
                 }, playload) {
    if (playload.isProcess) {
      commit(types.SAVE_FLOW_PROCESS, playload);
    } else {
      commit(types.SAVE_FLOW_TASK, playload);
    }
  },
  //手动导入选择设置路径
  setPath ({
             commit
           }, playload) {
    commit(types.SAVE_MANUAL_PATH_DATA, playload);
  },
  //
  searchVisibleUpdate ({
                         commit
                       }, playload) {
    commit(types.SAVE_SEARCH_VISIBLE, playload);
  },
  searchAdvanceVisibleUpdate ({
                                commit
                              }, playload) {
    commit(types.SAVE_SEARCH_ADVANCE, playload);
  },
  //数据流程设置默认排序
  setDefaultSort ({
                    commit
                  }, playload) {
    commit(types.SAVE_PROCESS_SORT, playload);
  },
  setSelectItem ({
                   commit
                 }, playload) {
    commit(types.SAVE_SELECT_ITEM, playload);
  },
  //保存视图数据
  saveViewData ({
                  commit,
                  state
                }, playload) {
    if (playload == "clear") {
      commit(types.SAVE_VIEW_NOTTABLE, "clear");
      commit(types.SAVE_VIEW_TABLE, "clear");
      return;
    }
    let _playload = {};
    _playload["params"] = playload["params"];
    const view = state.isBusiness;
    if (playload.isfolder) {
      if (view) {
        _playload["viewActive"] = "business";
      } else {
        const level = playload.params.level;
        switch (level) {
          case 1:
            _playload["viewActive"] = "datatype";
            break;
          case 2:
            _playload["viewActive"] = "datasource";
            break;
          case 3:
            _playload["viewActive"] = "database";
            break;
          default:
            break;
        }
      }
      _playload["params"]['view'] = _playload["viewActive"];
      commit(types.SAVE_VIEW_NOTTABLE, _playload);
    } else {
      _playload["viewActive"] = "table";
      _playload["params"]['view'] = _playload["viewActive"];
      commit(types.SAVE_VIEW_TABLE, _playload);
    }
    window.sessionStorage.setItem('viewActive', _playload["viewActive"]);
  },
  setCheckList ({commit}, playload) {
    commit(types.SAVE_CHECKLIST, playload);
  },
  addThemeCheckList ({commit}, playload) {
    commit(types.ADD_THEMECHECKLIST, playload);
  },
  delThemeCheckList ({commit}, playload) {
    commit(types.DEL_THEMECHECKLIST, playload);
  },
  setBusiness ({commit}, playload) {
    commit(types.SAVE_ISBUSINESS, playload);
  },
  setBusinessTitle ({commit}, playload) {
    commit(types.SAVE_ISBUSINESS_TITLE, playload);
  },
  addHeaderNav ({commit}, playload) {
    commit(types.ADD_HEADERNAV, playload);
  }, //header导航
  sourceUserMessage ({commit}, playload) {
    commit(types.SAVE_SOURCEUSER, playload);
  },
  setSourceTitle ({commit}, playload) {
    commit(types.SAVE_SOURCETITLE, playload);
  },
  fetchRouter ({commit}, playload) {
    commit(types.SAVE_FETCHROUTER, playload);
  },
  setLanguage ({commit}, playload) {
    commit(types.SET_LANGUAGE, playload);
  },
  selectItems ({commit}, playload) {
    commit(types.SELECT_ITEMS, playload);
  },
  deleteItem ({commit}, playload) {
    commit(types.DELET_ITEM, playload);
  },
  exportCheckList ({commit}, playload) {
    commit(types.SET_EXPORT_LIST, playload);
  },
  deleteExportCheckList ({commit}, playload) {
    commit(types.DELETE_EXPORT_LIST, playload);
  },
  exportCheckDBList ({commit}, playload) {
    commit(types.SET_EXPORT_DB_LIST, playload);
  },
  deleteExportCheckDBList ({commit}, playload) {
    commit(types.DELETE_EXPORT_DB_LIST, playload);
  },
  clearExportCheckList ({commit}, playload) {
    commit(types.CLEAR_EXPORT_LIST, playload);
  },
  saveBusinessState ({commit}, playload) {
    commit(types.SAVE_BUSINESS_STATE, playload);
  },
  setTreeData ({commit}, playload) {
    commit(types.SET_TREE_DATA, playload);
  },
  beginRequest ({commit}, playload) {
    commit(types.BEGINREQUEST, playload);
  },
  saveExportSearch ({commit}, playload) {
    commit(types.SET_EXPORT_SEARCH, playload);
  },
  setDataStatus ({commit}, playload) {
    commit(types.SET_DATA_STATUS, playload);
  },
  treeLoading ({commit}, playload) {
    commit(types.SET_TREE_LOADING, playload);
  },
  saveCollectCount ({commit}, playload) {
    commit(types.SAVE_COLLECT_COUNT, playload);
  },
  fullLoading ({commit}, playload) {
    commit(types.SET_FULL_LOADING, playload);
  },
  treeBusinessLoading ({commit}, playload) {
    commit(types.TREE_BUSINESS_LOADING, playload);
  },
  fullTreeLoading ({commit}, playload) {
    commit(types.FULL_TREE_LOADING, playload);
  },
  saveRouter ({commit}, playload) {
    commit(types.SAVE_ROUTER, playload);
  },
  saveNavData ({commit}, playload) {
    commit(types.SET_NAV_DATA, playload);
  },
  setPrivate ({commit}, playload) {
    commit(types.SET_PRIVATE, playload);
  },
  propEditPrivilege ({commit}, playload) {
    commit(types.SET_PROPEDITPRIVILEGE, playload);
  },
  fetchDataSourceLink ({commit}, playload) {
    commit(types.SET_SOURCELINK, playload);
  },
  createTask ({commit}, playload) {
    commit(types.SET_CREATETASK, playload);
  },
  addTables ({commit}, playload) {
    commit(types.ADD_TABLES, playload);
  },
  saveBlackList ({commit}, playload) {
    commit(types.SAVE_BLACKLIST, playload);
  },
  getSample ({commit}, playload) {
    commit(types.GET_SAMPLE, playload);
  },
  searchTables ({commit}, playload) {
    commit(types.SEARCH_TABLE, playload);
  },
  cronValue ({commit}, playload) {
    commit(types.CRON_VALUE, playload);
  },
  showCron ({commit}, playload) {
    commit(types.SHOW_CRON, playload);
  },
  closeDialog ({commit}, playload) {
    commit(types.CLOSE_DIALOG, playload);
  },
  selectTables ({commit}, playload) {
    commit(types.SELECT_TABLE, playload);
  },
  clearTables ({commit}, playload) {
    commit(types.CLEAR_TABLE, playload);
  },
  setExportTableSource ({commit}, playload) {
    commit(types.SET_EXPORT_TABLE_SOURCE, playload);
  },
  testBlackList ({commit}, playload) {
    commit(types.TEST_BLACKLIST, playload);
  },
  saveSelectList ({commit}, playload) {
    commit(types.SAVE_SELECTLIST, playload);
  },
  changeTableTypeOpts ({commit}, playload) {
    commit(types.CHANGE_TABLE_TYPE_OPTS, playload);
  },
  resetTableTypeOpts ({commit}, playload) {
    commit(types.CHANGE_TABLE_TYPE_OPTS, playload);
  },
  setModelOpen ({commit}, playload) {
    commit(types.SET_MODEL_OPEN, playload);
  },
  setSearchParams ({commit}, playload) {
    commit(types.SET_SEARCH_PARAMS, playload);
  },
  setManageInfo ({commit}, playload) {
    commit(types.SET_MANAGE_INFO, playload);
  },
  setUserInfo ({commit}, playload) {
    commit(types.SET_USER_INFO, playload);
  },
  ownerActiveTab ({commit}, playload) {
    commit(types.SET_OWNER_TAB, playload);
  },
  navVisible ({commit}, payload) {
    commit(types.SET_NAV_VISIBLE, payload);
  },
  clearTimeout ({commit}, payload) {
    commit(types.CLEAR_TIMEOUT, payload);
  },
  sourceType ({commit}, payload) {
    commit(types.SOURCE_TYPE, payload);
  },
  saveVersions ({commit}, payload) {
    commit(types.SAVE_VERSIONS, payload);
  },
  toggleEditingStatus ({commit}, payload) {
    commit(types.TOGGLE_EDITING_STATUS, payload);
  }
};
export default actions;
