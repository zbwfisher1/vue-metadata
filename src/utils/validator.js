/**
 *
 *@表单验证
 *
 */
import store from '../store/index';

function validatorFoo({...params
}) {
  const lang = store.state.language;

  if (params.value) {
    let _reg = params.reg;
    params.value = params.value + '';
    // let _result = params.value.match(_reg);
    let _result = _reg.test(params.value)
    if (_result) {
      // || /^zh/.test(lang)
      if (/^zh/.test(lang)) {
        params.callback(new Error(`${params.cnContent}`));
      } else {
        params.callback(new Error(`${params.enContent}`));
      }
    } else {
      params.callback()
    }
  } else {
    params.callback()
  }
}


// 汉字、英文、数字、下划线
const nameValidate = (rule, value, callback) => {
    let reg = /^[A-Za-z0-9_\u4e00-\u9fa5]+$/
    validatorFoo({
      rule,
      value,
      callback,
      reg,
      enContent: 'Please enter Chinese characters, English, numbers or underline',
      cnContent: '请输入汉字、英文、数字、下划线'
    })
  }
  // 汉字、英文、数字、下划线，小数点
const contentValidate = (rule, value, callback) => {
  let reg = /^[A-Za-z0-9_\u4e00-\u9fa5\.\s]+$/
  validatorFoo({
    rule,
    value,
    callback,
    reg,
    enContent: 'Please enter Chinese characters, English, numbers, underlines or decimal points',
    cnContent: '请输入汉字、英文、数字、下划线，小数点'
  })
}

// 汉字、英文、数字、横线、下划线
const taskNameValidate = (rule, value, callback) => {
  let reg = /^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/
  validatorFoo({
    rule,
    value,
    callback,
    reg,
    enContent: 'Please enter Chinese characters, English, numbers, horizontal lines or underline',
    cnContent: '请输入汉字、英文、数字、横线、下划线'
  })
}

// 英文、数字、小数点、分号、/斜杠
const hostNameValidate = (rule, value, callback) => {
  validatorFoo({
    rule,
    value,
    callback,
    reg: /^[A-Za-z0-9:\/\.\,]+$/,
    enContent: 'Please enter english, number, ‘.’, ‘:’, ‘,’, or /',
    cnContent: '请输入英文、数字、小数点、冒号、逗号、/斜杠'
  })
}

//英文、数字、下划线、小数点
const driveNameValidate = (rule, value, callback) => {
  validatorFoo({
    rule,
    value,
    callback,
    reg: /^[A-Za-z0-9_\.]+$/,
    enContent: 'Please enter English, number, ‘_’ or ’ .’',
    cnContent: '请输入英文、数字、下划线、小数点'
  })
}


const databaseValidate = (rule, value, callback) => {
  validatorFoo({
    rule,
    value,
    callback,
    reg: /^[A-Za-z0-9_]+$/,
    enContent: 'Please enter English, number or ‘_’',
    cnContent: '请输入英文、数字、下划线'
  })
}

//数字
const numberValidate = (rule, value, callback) => {
    validatorFoo({
      rule,
      value,
      callback,
      reg: /^\d+$/,
      enContent: 'Please enter a number',
      cnContent: '请输入整数'
    })
  }


// IP地址校验
const ipValidate = (rule, value, callback) => {
  const reg = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
  validatorFoo({
    rule,
    value,
    callback,
    reg,
    enContent: 'Please enter the correct IP address',
    cnContent: '请输入正确的ip地址'
  })
}

//文件名
const fileNameValidate = (rule, value, callback) => {
  let reg = /^[A-Za-z\u4e00-\u9fa5\d\_\s]+$/;
  validatorFoo({
    rule,
    value,
    callback,
    reg,
    enContent: 'Input in English, Chinese characters, numbers, underscores, space',
    cnContent: '主题名只能为英文、汉字、数字、下划线、空格'
  })
}

const themeNameValidate = (rule, value, callback) => {
  let reg = /\//
  validatorFoo({
    rule,
    value,
    callback,
    reg,
    enContent: 'Please do not enter "/"',
    cnContent: '请不要输入"/"'
  })
}

export {
  nameValidate,
  contentValidate,
  hostNameValidate,
  taskNameValidate,
  databaseValidate,
  driveNameValidate,
  numberValidate,
  ipValidate,
  fileNameValidate,
  themeNameValidate
};
