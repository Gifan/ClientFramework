"use strict";

require('adapter-min.js');

__globalAdapter.init();

require('cocos2d-js-min.js');

__globalAdapter.adaptEngine();

require('./ccRequire');

require('./src/settings'); // Introduce Cocos Service here


require('./main'); // TODO: move to common
// Adjust devicePixelRatio


cc.view._maxPixelRatio = 4;

if (cc.sys.platform !== cc.sys.BYTEDANCE_GAME_SUB) {
  // Release Image objects after uploaded gl texture
  cc.macro.CLEANUP_IMAGE_CACHE = true;
}
let uma = require('./utils/uma.min');
uma.init({
  appKey: '6046dccfb8c8d45c1391258f', //由友盟分配的APP_KEY
  autoGetOpenid: true, // 是否需要通过友盟后台获取openid或匿名openid，如若需要，请到友盟后台设置appId及secret
  debug: false, //是否打开调试模式
  uploadUserInfo: true // 自动上传用户信息，设为false取消上传，默认为false
});

window.boot();