import Mock from 'mockjs';

console.log('mock');
Mock.mock(/authenticate/, 'post', require('./json/authenticate.json'));
Mock.mock(/\/lang/, 'get', require('./json/lang.json'));
