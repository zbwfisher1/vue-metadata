/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 *
 */

let baseUrl = '';
let routerMode = 'history';
let imgBaseUrl = '';

if (process.env.NODE_ENV === 'development') {

} else if (process.env.NODE_ENV === 'production') {

}

const textFieldLength = {
    normal: 50,    //一般文本框长度为50个字符串
    large: 200    //描述性字段长度为200个字符串
};
const codeMap = {
    en: {
        exit: 'The user has not logged in yet, and is jumping to the login page.',
        '-200': 'Unsuccessfully handle the request',
        10001: 'Duplicate data source name',
        10002: 'verision duplicate',
        20001: 'Excel template error',
        20004: 'Excel import configuration not found in database',
        20006: 'Datasource connect failed',
        20007: 'This datasource is using by a ETL job',
        20008: 'The datasource not found',
        20009: 'The etl task type not support',
        20010: 'The task exists',
        20011: 'Sample data server connect failed',
        20012: 'Excel exceeded max rows allowed',
        20013: 'Elastic search server out of service',
        20014: 'Max allowed next verifiers number exceeded',
        20015: 'Cannot get User Admin address',
        20016: 'Next verifier duplicated',
        20017: 'Version name lenth not allow',
        20018: 'Version desc lenth not allow',
        20019: 'Files not found cause no one uplaod',
        20020: 'File upload fail with server error',
        20021: 'File type not allow',
        20022: 'Biz field duplicate',
        20023: 'Please select one partition column',
        20024: 'Backup calculate type not support',
        20025: 'Backup type not support',
        20028: 'biz fields exceeded allow',
        20030: 'duplicate tag',
        20100: 'The subject already exists',
        20031: 'The label is bound to an object cannot be deleted',
        20032: 'The existing object is bound to the label',
        20033: 'The object has been bound to specify the maximum number of label',
        20034: 'the apply has failed, Please try again later.',
        20035: 'file type duplicate.',
        20038: 'The ip address already exists',
        20039: 'delete sensitive not allow',
        20040: 'sensitive name duplicate',
    },
    zh: {
        exit: '当前用户没有登陆,正跳转到登陆页面',
        '-200': '请求失败',
        10001: '数据源名称重复',
        10002: '版本号重复',
        20001: 'excel模板错误',
        20004: 'excel导入配置未找到',
        20006: '数据源连接失败',
        20007: '数据源正在使用中',
        20008: '数据源未找到',
        20009: '不支持的任务类型',
        20010: '任务已存在',
        20011: '获取样本数据的服务器连接失败',
        20012: '导出行数超过限制',
        20013: '搜索引擎失效',
        20014: '超过允许的下一审批人数量',
        20015: '无法获取UserAdmin地址',
        20016: '下一审批人重复',
        20017: '版本号超长',
        20018: '版本描述超长',
        20019: '文件上传失败',
        20020: '由于服务器原因文件上传失败',
        20021: '文件类型不允许',
        20022: '业务自定义字段名重复',
        20023: '请选择一个分区字段',
        20024: '存储备份的依据类型不支持',
        20025: '存储备份类型不支持',
        20028: '业务自定义字段超过允许个数',
        20030: '标签重复',
        20100: '此主题已存在，请重新填写',
        20031: '标签已绑定到数据无法删除',
        20032: '数据已绑定该标签',
        20033: '数据已绑定规定最大数量的标签',
        20034: '审批失败，请稍后重试',
        20035: '文件类型重复',
        20038: '该ip地址链接已存在',
        20039: '请先删除子分类',
        20040: '敏感分类重复',
    }
};

export {
    baseUrl,
    routerMode,
    imgBaseUrl,
    codeMap,
    textFieldLength
};
