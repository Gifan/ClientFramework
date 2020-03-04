

var common = {
    debug: false,

    wechatSDKVersion: null, //微信的SDK版本
    wechatScreenHeight: null, //微信的屏幕高度(iPhone6在开发者工具中的分辨率为375*667 Dpr：2，对应微信屏幕宽高就是375*667，实际屏幕分辨率要乘以2)
    wechatScreenWidth: null, //微信的屏幕宽度
    url: {
        path: "https://game.zuiqiangyingyu.net/", //后台服务器url
        info: "common/config/info", //获得启动配置信息
        share_list: "common/game/share_list", //获得分享信息配置信息
        sign_in: "common/session/sign_in", //登录获取openid    
        shield_ip: "common/ip/is_enable", //是否屏蔽IP
    },
    sceneMgr: null, //场景管理器     
    videoMgr: null, //视频管理器
    isSoundOn: 1, //声音是否开(0关，1开)         
    isShieldIP: 0, //是否屏蔽IP(0屏蔽，1不屏蔽)
    isAuditing: 1, //是否审核(0不是,1是)
    isShowBanner: 1, //是否显示banner(0不是,1是)  
    bgmId: null, //背景音乐id      
    shareList: {}, //分享图列表(其中元素{position,title,imageUrl,weight})(position:1.发起挑战,2.群分享续命,3.普通分享,4.分享得金币',5.胜利炫耀,6.分享成绩,7.查看群分享)
    closeBtnDelayShowTime: 1.5,  //关闭按钮延迟显示时间
    m_createBannerFlag: false,  //是否创建广告 

    lauchConfig: {
        "isAuditing": 1,
        "winbtnjump": "no",
        "fullScreenAd": 0,
        "videoicon": "all",
        "showNotEnoughGoldBtn": "no",
        "iosShowMoney": "no",
        "adsclose": "no",
        "share": "no"
    },

    //获得分享图信息
    getShareInfo: function (position) {
        console.error(`分享列表------`, this.shareList);
        if (position < 1 || position > 7) return null;
        if (!this.shareList[position.toString()]) return null;
        var index = Math.floor(Math.random() * this.shareList[position.toString()].length);
        var ret = this.shareList[position.toString()][index];
        return ret;
    },

    //默认'POST'，根据情况设置为'GET'
    httpRequest: function (url, data, call = function (res) { }, sync = false, method = 'POST', json = false) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            if (json) {
                wx.request({
                    url: url,
                    data: data,
                    method: method || "POST",
                    header: { 'content-type': 'application/json' },
                    success(res) { call(res); },
                    fail() { call(null); }
                });
            }
            else {
                wx.request({
                    url: url,
                    data: data,
                    method: method || "POST",
                    header: { 'content-type': 'application/x-www-form-urlencoded' },
                    success(res) { call(res); },
                    fail() { call(null); }
                });
            }
        }
        else {
            //请求数据
            if (url.indexOf(this.url.share_list) != -1 || url.indexOf(this.url.info) != -1 || url.indexOf(this.url.shield_ip) != -1) {
                this.Get(url, data, function (res) {
                    call(res)
                })
            }
        }
    },

    Get: function (url, reqData, callback) {
        var self = this;
        url = url + "?";
        var ur = ''
        for (var item in reqData) {
            console.log(item, '++++++', reqData[item]);
            ur += item + "=" + reqData[item] + "&";
        }
        console.log(`u-----`, url + ur)
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 400) {
                    var response = xhr.responseText;
                    console.log(response)
                    if (response) {
                        var responseJson = JSON.parse(response);
                        var dataJson = { data: responseJson };
                        console.log('请求成功', dataJson)
                        callback(dataJson);
                    } else {
                        console.log("返回数据不存在")
                        callback(false);
                    }
                } else {
                    console.log("请求失败")
                    callback(false);
                }
            }
        };
        xhr.open("GET", url + ur, true);
        xhr.send();
    },

    post: function (url, reqData, success_callback, fail_callback) {
        let self = this;
        let param = "";
        reqData.platform = 'ios'
        for (let item in reqData) {
            param += item + "=" + reqData[item] + "&";
        }
        console.log('post', url, param);
        //发起请求，待换用更好的连接方法
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            console.log('xhr', JSON.stringify(xhr))
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 400) {
                    let response = xhr.responseText;
                    console.log('duangduangduang', response)
                    if (response) {
                        let response_object = JSON.parse(response);
                        console.log('responseGot success', response_object)
                        success_callback(response_object);
                    } else {
                        console.log("responseGot fail")
                        // fail_callback(false);
                    }
                } else {
                    console.log("no response", xhr.status, xhr.responseText)
                    // fail_callback(false);
                }
            } else {
                // console.log('没有')
                // fail_callback(false);
            }
        };
        xhr.onerror = () => {
            console.log('没有啦')
            fail_callback(false);
        }
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(param);
    },

    compareVersion: function (v1, v2) {//比较版本
        v1 = v1.split('.');
        v2 = v2.split('.');
        var len = Math.max(v1.length, v2.length);
        while (v1.length < len) {
            v1.push('0');
        }
        while (v2.length < len) {
            v2.push('0');
        }
        for (var i = 0; i < len; i++) {
            var num1 = parseInt(v1[i]);
            var num2 = parseInt(v2[i]);
            if (num1 > num2) {
                return 1;
            } else if (num1 < num2) {
                return -1;
            }
        }
        return 0;
    },

    createVideoByAndroid: function (cb) {
        if (!(cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID)) return;
        this.subEvent("ad_success_rewarde_count");
        let day = new Date().getDate()
        let loginday = cc.sys.localStorage.getItem("zqddn_zhb_loginDay");
        if (day - loginday == 0) {
            this.subEvent("new_user_day1_video_request_count");
        } else if (day - loginday == 1) {
            this.subEvent("new_user_day2_video_request_count");
        } else if (day - loginday == 2) {
            this.subEvent("new_user_day3_video_request_count");
        }
        this.videoCallBack = cb
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "loadVideo", "()V");
    },

    isBiggerThanWechatSDKVersion: function (targetVersion) { //微信当前SDK版本是否大于等于指定版本
        if (!this.wechatSDKVersion || !targetVersion) return false;
        return this.compareVersion(this.wechatSDKVersion, targetVersion) !== -1;
    },

    //全屏广告
    showInsertVideo() {
        if (!(cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID)) return;
        console.log("## zxh showInsertVideo---------------------");
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showInsertBanner", "()V");
        this.subEvent("inter_ad_SHOW");
        this.subEvent("ad_success_video_count");
    },

    createBanner: function (top = 0, width = 0) { //创建横幅广告
        if (this.m_createBannerFlag) {
            return;
        }
        this.m_createBannerFlag = true;
        if (this.isAndroidNav()) {
            if (!(cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID)) return;
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "addBanner", "()V");
            return;
        }
        if (!this.isBiggerThanWechatSDKVersion("2.0.4")) return;
        if (!this.bannerAd) {
            var left = 0;
            var width1 = 0;
            if (width < 300) {
                width1 = 300;
                left = parseInt((this.wechatScreenWidth - 300) / 2);
            } else if (width > this.wechatScreenWidth) {
                width1 = this.wechatScreenWidth;
                left = 0;
            }
            //console.log("创建横幅广告:left=" + left + ",width=" + width1);
            this.bannerAd = wx.createBannerAd({
                adUnitId: 'adunit-982320484dd8ef15',
                style: {
                    left: left,
                    top: top,
                    width: width1
                }
            });
            this.bannerAd.show();
        }
    },

    releaseBanner: function () { //释放横幅广告
        this.m_createBannerFlag = false;
        if (this.isAndroidNav()) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "hideBanner", "()V");
            return;
        }
        if (this.isIOSNav()) {
            this.iosRemoveBannerView()
        }
    },

    QQPlayLookVideo(call = null) {
        if (fw.isANDROID) {
            let day = new Date().getDate()
            let loginday = cc.sys.localStorage.getItem("zqddn_zhb_loginDay");
            if (day - loginday == 0) {
                this.subEvent("new_user_day1_video_request_count");
            } else if (day - loginday == 1) {
                this.subEvent("new_user_day2_video_request_count");
            } else if (day - loginday == 2) {
                this.subEvent("new_user_day3_video_request_count");
            }
        }
        fw.cls.sov.videoOrShare(cst.VideoADType.TIPS_KEY, s => s ? (call && call(0), this.sceneMgr.showTipsUI(s)) : call && call(1));
    },

    //通用---------------------------
    subEvent(key, param) { //友盟统计
        if (!(cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID)) return;
        let obj = { "value": param }
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "sendMsg", "(Ljava/lang/String;Ljava/lang/String;)V", key, JSON.stringify(obj))
    },

    iosRemoveBannerView: function () {
        console.log('调用关闭banner')
        if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {//判断是否是源生平台并且是否是iOS平台 
            console.log('关闭banner')
            jsb.reflection.callStaticMethod("AppController", "hiddenBanner");
        }
    },

    iOSCustomTrackerWithName: function (name, dictString) {
        if (this.isIOSNav()) {
            var a = JSON.stringify(dictString)
            this.CustomStat(name, dictString);
            jsb.reflection.callStaticMethod("AppController", "customTrackerWithName:andDictString:", name, a);
        }
    },

    isIOSNav: function () {
        return (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS);
    },

    isAndroidNav: function () {
        return (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID);
    },

    getConditionByTag(type) {
        if (this.lauchConfig.isAudit) {
            //审核
            return false;
        } else {
            // console.log("getConditionByTag", type, this.lauchConfig[type], this.isShieldIP)
            if (this.lauchConfig[type] == 'all') {
                return true;
            } else if (this.lauchConfig[type] == 'no') {
                return false;
            } else if (this.lauchConfig[type] == 'ip') {
                return (type == "videoicon" || type == "videoicon1") ? this.isShieldIP == 0 : this.isShieldIP != 0;
            } else {
                return (type == "videoicon" || type == "videoicon1");
            }
        }
    },

    getConditionByTag2(type) {
        if (this.lauchConfig.isAudit) {
            //审核
            return false;
        }
        else {
            if (this.lauchConfig[type] == 'all') {
                return true;
            }
            else if (this.lauchConfig[type] == 'no') {
                return false;
            }
            else if (this.lauchConfig[type] == 'ip') {
                if (this.isShieldIP == 0) {
                    return false;
                }
                else {
                    return true;
                    //暂时不屏蔽广深
                    // return true
                }
            }
            else {
                return false;
            }
        }
    },

    // V2自定义统计
    CustomStat(eventname, param) {
        if (this.wondersdk) {
            console.log('v2统计---事件统计：' + eventname);
            this.wondersdk.statevent(eventname, param || null);
        }
        else {
            console.log('v2统计---事件统计(失败)');
        }
    },

    /**
     *  发送统计消息
     */
    sendMsg(key, param) {
        if (param == null) param = " ";
        if (common.isAndroidNav()) {
            this.subEvent(key, param);
        }
        else if (common.isIOSNav()) {
            this.iOSCustomTrackerWithName(key, param);
        }
    },
};

module.exports = common;
