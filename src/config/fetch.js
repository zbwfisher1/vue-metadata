import {baseUrl} from './env';
import {parsed} from './mUtils';

export default async (url = '', data = {}, type = 'GET', method = 'fetch') => {
  type = type.toUpperCase();
  url = baseUrl + url;

  if (type === 'GET') {
    let dataStr = ''; //数据拼接字符串
    Object.keys(data).forEach(key => {
      dataStr += key + '=' + data[key] + '&';
    });

    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
      url = url + '?' + dataStr;
    }
  }

  if (url.indexOf('?') >= 0) { //判断url中是否已经带有参数
    url = url + '&t=' + (new Date()).valueOf();
  } else {
    url = url + '?t=' + (new Date()).valueOf();
  }

  if (window.fetch && method === 'fetch') {
    let requestConfig = {
      credentials: 'include',
      method: type,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: "cors"
    };

    if (type === 'POST') {
      Object.defineProperty(requestConfig, 'body', {
        value: JSON.stringify(data)
      });
    }

    try {
      const response = await fetch(url, requestConfig);
      return parsed(await response.json());
    } catch (error) {
      throw new Error(error.message);
    }
  } else {
    return new Promise((resolve, reject) => {
      let requestObj;
      if (window.XMLHttpRequest) {
        requestObj = new XMLHttpRequest();
      } else {
        requestObj = new ActiveXObject;
      }

      let sendData = '';
      if (type === 'POST') {
        sendData = JSON.stringify(data);
      }

      requestObj.open(type, url, true);
      requestObj.setRequestHeader("Content-type", "application/json");
      requestObj.send(sendData);

      requestObj.onreadystatechange = () => {
        if (requestObj.readyState === 4) {
          if (requestObj.status === 200) {
            let obj = requestObj.response;
            if (typeof obj !== 'object') {
              obj = JSON.parse(obj);
            }
            resolve(parsed(obj));
          } else {
            reject(requestObj);
          }
        }
      };
    });
  }
}
