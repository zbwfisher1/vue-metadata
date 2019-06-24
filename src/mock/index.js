import Mock from 'mockjs';


//公共接口,判断测试
Mock.mock(/\?testPrivilege=1/, 'post', require('./json/authenticate.json'));
Mock.mock(/\?testPrivilege=1/, 'get', require('./json/authenticate.json'));

//首页所有接口
Mock.mock(/authenticate/, 'post', require('./json/authenticate.json'));
Mock.mock(/\/lang/, 'get', require('./json/lang.json'));
Mock.mock(/\/appEntry/, 'get', require('./json/appEntry.json'));
Mock.mock(/\/init/, 'get', require('./json/init.json'));
Mock.mock(/\/excelMetadataInfo\/import/, 'post', require('./json/excelMetadataInfoImport.json'));
Mock.mock(/\/getTopDatasetCommonInfo/, 'get', require('./json/getTopDatasetCommonInfo.json'));

/*Mock.mock(/\/getTopFavoriteDataset/, 'get', require('./json/lang.json'));
Mock.mock(/\/getTopDatasetAccess/, 'get', require('./json/lang.json'));
Mock.mock(/\/topic\/treeInfo/, 'get', require('./json/lang.json'));
Mock.mock(/\/datasets\/treeInfo/, 'get', require('./json/lang.json'));
Mock.mock(/\/ownedDatasetWithoutOwnerCount/, 'get', require('./json/lang.json'));
Mock.mock(/\/ownedDatasetWithoutCommonInfoCount/, 'get', require('./json/lang.json'));
Mock.mock(/\/getPersonalDataCount/, 'get', require('./json/lang.json'));
Mock.mock(/\/getPendingApproveCount/, 'get', require('./json/lang.json'));
Mock.mock(/\/ownedDatasetWithoutCommonInfoCount/, 'get', require('./json/lang.json'));
Mock.mock(/\/unstructureTreeInfo/, 'get', require('./json/lang.json'));*/
