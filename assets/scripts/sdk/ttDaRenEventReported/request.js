let aes = require('encrypt_decrypt')
// console.log(aes);
/**
 * 网络请求
 */
function request(method,  url, params) {
  params.seq = randomString(16);
  let jsonStr = JSON.stringify(params);
  // console.log(url + '  params=> ' + jsonStr);

  let aesData = aes.Encrypt(jsonStr);
  // console.log('请求=>明文参数：' + jsonStr);
  // console.log('请求=>加密参数：' + aesData);
  return new Promise((resolve, reject) => {
    window["tt"] && tt.request({
      url: url,
      method: method,
      header: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      data: {
        di: aesData
      },
      // data: params,
      success: function (res) {
        resolve(res)
      },
      fail: function (res) {
        reject(res)
      },
    })
  })
}

function randomString(len) {
  len = len || 32;
  let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyzoOLl9gqVvUuI12345678';
  let maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

module.exports.request = request;
