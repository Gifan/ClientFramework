let  CryptoJS = require('crypto-js');
// AES 秘钥
let AesKey = "NO8tU0nT0iLQzHzO";

// AES-128-CBC偏移量
let CBCIV = "wt2y0aEzGcu0wTDE";

// 加密选项
let CBCOptions = {
  iv: CryptoJS.enc.Utf8.parse(CBCIV),
  mode:CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7
}

/**
 * AES加密（CBC模式，需要偏移量）
 * @param data
 * @returns {*}
 */
function encrypt(data){
  let key = CryptoJS.enc.Utf8.parse(AesKey);
  let secretData = CryptoJS.enc.Utf8.parse(data);
  let encrypted = CryptoJS.AES.encrypt(
    secretData,
    key,
    CBCOptions
  );
  return encrypted.toString();
}

/**
 * AES解密（CBC模式，需要偏移量）
 * @param data
 * @returns {*}
 */
function decrypt(data){
  let key = CryptoJS.enc.Utf8.parse(AesKey);
  let decrypt = CryptoJS.AES.decrypt(
    data,
    key,
    CBCOptions
  );
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}




//暴露接口
module.exports.Decrypt = decrypt;
module.exports.Encrypt = encrypt;
