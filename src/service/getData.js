import fetch from '../config/fetch';
import axios from 'axios';

/*
* 测试权限公共接口
*
* */
export const checkPermission = (url, type = 'get') => {
    if (url.includes('testPrivilege=1')) {
        return axios[type](url);
    } else {
        return axios[type](`${url}?testPrivilege=1`);
    }
};

export const authenticate = () => axios.post('/authenticate', {});

export const currentLang = () => axios.get('/lang');

/***
 * 创建版本
 * @param datasetId
 * @param versionName
 * @param versionDesc
 */
export const createVersion = (datasetId, versionName, versionDesc) => axios.post(`/datasets/${datasetId}/datasetVersion`, {
    versionName,
    versionDesc
});

/*
* 更新版本（版本回退）
*
* */
export const deleteVersion = (datasetId, id) => fetch(`/datasets/${datasetId}/${id}/datasetVersion`, '', 'DELETE');

/*
* 删除某个版本
*
* */
export const returnVersion = (datasetId, id) => axios.post(`/datasets/${datasetId}/${id}/versionRollback`, {});

/***
 * 获取所有版本列表
 * @param datasetId
 * @param sort
 * @param order
 * @param page
 * @param rows
 * @param versionName
 */
export const getVersion = (datasetId, versionName = '', sort = 'createTime', order = 'desc', page = 1, rows = 10) => fetch(`/datasets/${datasetId}/datasetVersion`, {
    sort,
    order,
    page,
    rows,
    versionName
});

/*
 * 变更历史下两个接口
 * 1.数据结构变更
 * 2.业务元数据变更
 *
 * */
export const changeHistory = (param, type = 'metadata') => fetch(`/changereport/${type}`, param, 'POST');

/***
 * 获取所有版本列表
 * @param datasetId
 * @param versionIds   （必填，使用上一个接口返回的id，用逗号拼接成字符串，例如：455,456）
 */
export const compareV = (datasetId, versionIds) => fetch(`/datasets/${datasetId}/versionCompare`, {versionIds});

/***
 * 获取搜索模块下的  所属来源系统列表
 */
export const getSourceList = (keyword = '') => fetch('/search/upstream', {
    upstreamSystem: keyword
});

/***
 * 获取搜索模块下的  源表功能模块
 */
export const getModuleList = (keyword = '') => fetch('/search/sourceTable', {
    sourceTable: keyword
});

/*
 * 获取搜索模块下的 所属主题
 * @param key
 * */
export const getTopicTree = (key) => {

    //默认请求参数
    const para = {
        level: 0,
        page: 1,
        path: "",
        rows: 10000,
        key
    };

    return fetch('/search/topicTree', para, 'POST');
};

/***
 * 获取最近搜索历史列表
 */
export const getRecentList = () => fetch('/search/recent');

/***
 * 自动补全列表
 * @param category
 * @param keyword
 */
export const getCompleteList = (category, keyword) => fetch(`/search/autocomplete?category=${category}&keyword=${keyword}&rows=10&page=1`);

/***
 * 获取搜索结果
 * @param params
 */
export const getSearchList = (params) => {
    const url = `/search/doSearch`;

    if (params.sort === 'relate') {
        delete params.sort;
        delete params.order;
    }
    return axios.post(url, params);
};

/*
* 获取系统配置
*
* */
export const getSystemConfig = () => fetch('/manage/sysConf');

/*
* 修改某个系统配置
*
* */
export const submitSystemConfig = (key, value) => fetch('/manage/sysConf', {key, value}, 'POST');

/*
* 获取所有自定义业务字段
*
* */
export const getBizField = () => fetch('/manage/bizField');

/*
* 删除某个自定义业务字段
*
* */
export const deleteBizField = (id) => fetch(`/manage/${id}/bizField`, '', 'DELETE');

/*
* 修改某个自定义业务字段
*
* */
export const submitBizField = (fieldName, fieldDesc, id) => {
    const para = {
        id,
        fieldName,
        fieldDesc
    };
    if (id === undefined) {
        delete para.id;
    }
    return axios.post('/manage/bizField', para);
};

/*
* 某个表在表管理批量更新自定义字段的值
* */
export const updateBizField = (id, fieldId, fieldName, fieldValue) => axios.post(`/datasets/${id}/commoninfo/bizField`, {
    id: fieldId,
    fieldName,
    fieldValue
});

/*
* 获取富文本框内容
*
* */
export const getRichText = (id) => axios.get(`/datasets/${id}/commoninfo/richDesc`);

/*
* 提交富文本框内容
*
* */
export const submitRichText = (id, richDesc) => axios.post(`/datasets/${id}/commoninfo/richDesc`, {richDesc});

/*
* 数据变化
*
* */
export const getDataChange = (dataset_id, begin_date, end_date) => {
    const params = {
        dataset_id,
        begin_date,
        end_date
    };
    if (!begin_date || !end_date) {
        delete params.begin_date;
        delete params.end_date;
    }
    return axios.get('/datasets/getDatasetChangeDetail', {
        params
    });
};

/*
* 获取生命周期的配置
*
* */
export const getLifeCycle = (id) => axios.get(`/lifecycle/${id}`);

/*
* 获取属性信息
*
* */
export const getCommonInfo = (id) => axios.get(`/datasets/${id}/commoninfo`);

/*
* 修改生命周期的配置
*
* 1.tag_column 时间判断标准选择的字段
* 2.life_day 数据存储周期设置的数字
* 3.type 数据存储周期的类型：D: 天,M:月, Y:年 F:永久
* 4.delete_type 过期数据的处理方式： 1: 删除 2:归档
* 5.day_num 归档时长设置的数字
* 6.delete_day_type 归档保存设置的日期类型：D:day,M:month,Y:year,F:永久*
*
* */
export const settingLifeCycle = (params) => axios.post(`/lifecycle/${params.datasetId}`, params);

/*
* 重置生命周期
* */
export const deleteLifeCycle = (dataSetId) => axios.delete(`/lifecycle/${dataSetId}`);

/***
 * ,获取ip地址
 */
export const getBackEndHosts = () => axios.get('/systemImport/getBackEndHosts');

/*
* 创建或更新标签
* */
export const createTag = (id, name, desc) => axios.post(`/tag/createOrUpdate`, {
    id,
    name,
    desc
});

/*
* 查看标签列表
* */
export const getTagList = (params) => axios.get(`/tag/list`, {
    params
});

/*
* 查看标签详情
* */
export const getTagDetail = (id) => axios.get(`/tag/get/${id}`);

/*
* 删除标签
* */
export const deleteTag = (id) => axios.delete(`/tag/delete/${id}`);

/*
* 查看标签详情
* */
export const getTagListDetail = (id, params) => axios.get(`/tag/list/${id}`, {
    params
});

/*
* 移除表绑定的标签
* */
export const removeTagGroup = (tagId, datasetId) => axios.delete(`/tag/${tagId}/removeFromTag/${datasetId}`);

/*
* 搜索获取标签列表接口
* */
export const searchTags = (tagName) => axios.get(`/search/tags`, {
    params: {
        tagName
    }
});

/*
* 批量更新表绑定的标签
* */
export const addToTag = (id, array) => axios.post(`tag/addToTag/${id}`, array);

/*
* 创建hdfs导入任务
* */
export const createTask = (params) => {
    const type = params.type;
    if (type === 'edit') {
        delete params.type;
    } else {
        delete params.id;
    }
    return axios.post(`systemImport/${type === 'edit' ? 'update' : 'create'}`, params);
};

/*
*
* 非结构化数据获取数据源
*
* */
export const getDataSource = () => axios.get(`/datasets/unstructuredDatasource`);

/*
* 非结构化数据获取文档视图
* */
export const getFileTree = (params) => axios.post(`datasets/unstructuredTree`, params);

/*
* 非结构化数据列表里的搜索功能
* */
export const searchFileData = (params) => axios.post(`search/searchUnstructureData`, params);

/*
* 非结构化数据列表里的category
* */
export const getFileCategory = () => axios.get(`datasets/unstructuredDataCategory`);

/*
* 管理专区里的文件类型管理
* */
export const getFileType = () => axios.get(`manage/fileType`);

/*
* 管理专区里的文件类型管理修改文件类型
* @params fileType  文件类型,多个文件类型用逗号分隔
* @params category  类型分类
*
* */
export const EditFileType = (fileType, category) => axios.post(`manage/fileType`, {
    fileType,
    category
});

/*
* HDFS获取当前文件的详情
* */
export const getFilesInfo = (id) => axios.get(`/datasets/unstructureDataPosition?datasetId=${id}`);

/*
* 1.16非结构化数据列表里的搜索中获取搜索记录
*
*@params category 区分是获取非结构化数据的数据源下搜索时的记录，还是在文件分类中的搜索记录，取值范围：
* 1.分类中：unstructureCategory
* 2.数据源下：unstructureTree
* */
export const getUnStructureHistory = (category) => axios.get(`/search/recentUnstructureSearch?category=${category}`);

/*
* 业务视图中向主题中添加非结构化数据
*
* @params  obj
*
* params = {
* keyword,
* refId,
* path,
* }
*
*
* */
export const getFileTreeData = (params) => axios.post(`excelMetadataInfo/unstructuredSelectTree`, params);

export const getFileData = (params) => axios.post(`datasets/unstructuredSelectTree`, params);

/*
*
* 主页获取文件的统计个数
*
* */
export const getFilesNum = () => axios.get(`/datasets/unstructureTreeInfo`);

/*
* 获取任务列表
*
* */
export const getTaskList = (params) => axios.get(`/systemImport/getTask`, {params});

/*
* 获取数据源列表
*
* @params  obj
*
* params = {
* businessName: String  按数据源名称搜索，可选,
* page:int  请求页码，必选
* rows:int   每页数量，必选
* sort:String  排序字段，可选
* order:String 排序参数，可选ASC,DESC,
* }
* */
export const getDataSourceList = (params) => axios.get(`/datasource/getDatasource`, {params});

/*
* 启用或停用某个任务
*
* */
export const updateTask = (id, active) => axios.get(`/systemImport/updateActive/${id}/${active}`);

/*
* 查看新增数据
*
* @params  obj
*
* params = {
    keyword:String 搜索关键字
    refId: ref Id    在任务列表中点击处理新增数据时传refId
    dataSource:{      在新建任务时由于数据源还没有保存,此时没有refId,将dataSource的信息传递到后端
        businessName:数据源名称
        dataSourceType: 数据类型
        ipAddress: ip地址
        port:端口
        databaseName: 库名
        instanceName: 实例名
        username:用户名
        password: 密码
        useKerberos:是否使用kerberos (Hive,Hdfs,Hbase)
        keytab： 填入keytab ,useKerberos 为true时必选 (Hive,Hdfs,Hbase)
        principal：填入principal ,useKerberos 为true时必选 (Hive,Hdfs,Hbase)
        krbPath: kerberos配置文件路径 ,useKerberos 为true时可选 (Hive,Hdfs,Hbase)
        isDefault:  页面新建时值为0，  修改时/systemImport/get/{id}接口返回的isDefault是多少就传多少
    }
    database:String  点击展开某个库时 必填
    page:int  请求页码，必选
    rows:int   每页数量，必选
    requestTime: long  ,  13位时间戳,第一次请求时为0, 请求完成时后端会返回一个时间戳。后续再请求时需要携带这个返回的时间戳。
}
*
*
*
* */
export const getBlackAndWhiteList = (params) => axios.post(`/systemImport/getNewSampleDbAndTable`, params);

/*
*
* 创建或修改采集任务
* {
    id: 任务id，新建时没有，修改时有
    taskName: 任务名
    description: 任务描述
    dataSource:{
        businessName:数据源名称
        dataSourceType: 数据类型
        ipAddress: ip地址
        port:端口
        databaseName: 库名
        instanceName: 实例名
        username:用户名
        password: 密码
        useKerberos:是否使用kerberos (Hive,Hdfs,Hbase)
        keytab： 填入keytab ,useKerberos 为true时必选 (Hive,Hdfs,Hbase)
        principal：填入principal ,useKerberos 为true时必选 (Hive,Hdfs,Hbase)
        krbPath: kerberos配置文件路径 ,useKerberos 为true时可选 (Hive,Hdfs,Hbase)
        isDefault:  页面新建时值为0，  修改时/systemImport/get/{id}接口返回的isDefault是多少就传多少
    }
    getSample:是否获取样本数据 (Hive,Mysql,Oracle,Hbase)
    serverUrl: hiveServer2连接地址 （Hive）
    serverUsername：hiveServer2用户名（Hive）
    serverPassword：hiveServer2密码（Hive）
    effectiveBeginTime:开始时间
    interval:调度频率类型(H:每小时，D:每天，W:每周，M:每月)
    rank: 选择调度为每周 每月 时需要
    scheduleTime:选择每小时 时不需要，调度的时间；
    refId: ref id，新建时没有，修改时有
    useWhiteList:是否使用白名单(Hive,Mysql,Oracle,Hbase,Hdfs)
    path: 扫描根目录（Hdfs）
    scanDepth:扫描深度（Hdfs）
    filterPaths: 黑白名单按文件夹过滤 (Hdfs)
    fileTypeUseWhiteList：文件类型是否使用白名单（Hdfs）
    filterTypes: 黑白名单按文件类型过滤（Hdfs）
    dbs:[{      (Hive,Mysql,Oracle,Hbase)
        databaseName: 选择的数据库名
    }]
    tables:[{      (Hive,Mysql,Oracle,Hbase)
        databaseName: 选择的表所在的数据库名
        tableName: 选择的表名
    }],
    requestTime: 13位时间戳,由获取黑白名单列表的接口返回，必填
    properties:{} 新建时不需要，修改时需要。将/systemImport/get/{id}接口返回的properties原样提交回来。
}
*
* */

export const createOrUpdateSource = (params) => axios.post(`/systemImport/createOrUpdate`, params);

/*
* 创建或修改采集任务时第一页点击下一步时
* */
export const validateSource = (params) => axios.post(`/systemImport/validateBasic`, params);

/*
* 获取单个任务的详情
*
* */
export const getTaskId = (id) => axios.get(`/systemImport/get/${id}`);

/*
* 查看某个任务的执行记录
*
*
* {
    id:int  所选任务的id，必选
    page:int  请求页码，必选
    rows:int   每页数量，必选
    sort:String  排序字段，可选
    order:String 排序参数，可选ASC,DESC
    startTime:int  开始时间，可选 unix时间戳
    endTime:int   结束时间，可选 unix时间戳
}
* */
export const getTaskLog = (params) => axios.post(`/systemImport/getTaskLog`, params);

/*
* 保存处理的新增数据（通过在任务列表中点击处理新增数据时，保存数据调用此接口，新建采集任务时数据由新建任务的接口发送）
*
*
* {
    refId: ref Id
    requestTime: 13位时间戳, 来自于getNewSampleDbAndTable接口后端返回
    dbs:[{
        databaseName: 选择的数据库名
    }]
    tables:[{
        databaseName: 选择的表所在的数据库名
        tableName: 选择的表名
    }]
}
* */
export const savedDbAndTable = (params) => axios.post(`/systemImport/saveNewSampleDbAndTable`, params);

/*
* 查看已处理的数据
*
* {
    keyword:String 搜索关键字
    refId: ref Id
    database:String  点击展开某个库时需要
    page:int  请求页码，必选
    rows:int   每页数量，必选
}
*
* */
export const achieveDbAndTable = (params) => axios.post(`/systemImport/getSampleDbAndTable`, params);

/*
* 查看已处理数时之前已选择的数据
*
* */
export const selectedDbAndTable = (refId) => axios.get(`/systemImport/getSavedSampleDbAndTable/${refId}`);

/*
* 更新已处理数据
*
* */
export const updateDbAndTable = (params) => axios.post(`/systemImport/updateSavedSampleDbAndTable`, params);

/*
* 获取所有敏感分类
*
* */
export const getSensitiveList = () => axios.get(`/manage/listSensitive`);

/*
* 创建敏感分类
*
* */
export const createSensitive = (params) => axios.post(`/manage/createSensitive`, params);

/*
* 修改敏感分类
*
* */
export const updateSensitive = (id, name, level) => axios.post(`/manage/updateSensitive`, {
    id,
    name,
    level
});

/*
* 删除敏感分类
*
* */
export const deleteSensitive = (id) => axios.delete(`/manage/deleteSensitive/${id}`);

/*
*
* 获取当前表的所有信息
*
* */

export const getTableCommonInfo = (id) => axios.get(`/datasets/${id}/commoninfo`);

/*
* 给表的字段设置敏感分类
*
* */
export const setSensitive = (datasetId, fieldId, sensitiveId) => axios.post(`/datasets/${datasetId}/fieldSensitive/${fieldId}/${sensitiveId}`);

/*
*
* 获取字段的权限详情
*
* */
export const getFieldAuthorizedAccounts = (datasetId, fieldId, keyword = '') => axios.get(`/privilege/getFieldAuthorizedAccounts/${datasetId}/${fieldId}`, {
    params: {
        keyword
    }
});

/*
* 创建主题
*
* */
export const createTopic = (params) => axios.post(`/topic/create`, params);

/*
*
* 下钻或返回上一级时列出指定主题的下一级子主题
*
* */

export const getTopicList = (path = '') => axios.post(`/topic/listTopic`, {
    path
});

/*
* 获取指定主题的属性信息
*
* */
export const getTopicInfo = (id) => axios.get(`/topic/getTopicInfo/${id}`);

/*
* 修改主题
*
* */
export const updateTopic = (params) => axios.post(`/topic/update/${params.id}`, params);

/*
* 删除主题
*
* */
export const deleteTopic = (id) => axios.delete(`/topic/delete/${id}`);

/*
* 列出指定主题的文件和表
*
* */
export const getDatasetInfo = (params) => axios.post(`/topicDataset/getDatasetInfo`, params);

/*
* 添加表文件到指定主题时，列出指定主题下的所有层级的子主题供选择
*
* */
export const listSelectTopic = (id) => axios.get(`/topic/listSelectTopic/${id}`);

/*
* 获取某个表或文件所在的主题
* 返回的主题用在将表移出主题时确定需要从哪些主题中移除
*  @param datasetId:指定的表或文件，
*
* */
export const getTopicsByDataset = (datasetId, topicId) => axios.get(`/topicDataset/getTopicsByDataset/${datasetId}/${topicId}`);

/*
* 将某个表或文件从指定的主题中移除
*  datasetId:指定的表或文件
*  topicId:当前所在主题的id
*  topicIds:移除时可以选择从当前所在主题下的某些子主题中一起移除，因此将这些需要一起移除的topic id 用逗号分隔组成字符串，将从这些主题中移除该表
*
* */
export const removeDatasetInTopic = (id, params) => axios.post(`/topicDataset/remove/${id}`, params);
