
(function (langRes) {
    Object.defineProperty(cc.Label.prototype, 'string', {
        get() {
            return this._string;
        },
        set(value) {
            var oldValue = this._string;
            var newvalue = value;
            if (cc.sys.language != cc.sys.LANGUAGE_CHINESE) {
                var data = window[langRes];
                if (data && data[value]) {
                    let newlan = data[value][cc.sys.language];
                    if (newlan) { newvalue = newlan };
                }
            }
            this._string = '' + newvalue;
            if (this.string !== oldValue) {
                this.setVertsDirty();
            }

            this._checkStringEmpty();
        },
    });

    cc.Label.prototype.onLoad = function () {
        // For compatibility with v2.0.x temporary reservation.
        if (this._batchAsBitmap && this.cacheMode === CacheMode.NONE) {
            this.cacheMode = CacheMode.BITMAP;
            this._batchAsBitmap = false;
        }

        if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
            // CacheMode is not supported in Canvas.
            this.cacheMode = CacheMode.NONE;
        }
        this.string = this.string;
    };
    cc.js.formatStr = function (value, ...any) {
        var msg = arguments[0];
        if (cc.sys.language != cc.sys.LANGUAGE_CHINESE) {
            var data = window[langRes];
            if (data && data[value]) {
                let newlan = data[value][cc.sys.language];
                if (newlan) { msg = newlan };
            }
        }
        let REGEXP_NUM_OR_STR = /(%d)|(%s)/;
        let REGEXP_STR = /%s/;
        var argLen = arguments.length;
        if (argLen === 0) {
            return '';
        }
        if (argLen === 1) {
            return '' + msg;
        }

        var hasSubstitution = typeof msg === 'string' && REGEXP_NUM_OR_STR.test(msg);
        if (hasSubstitution) {
            for (let i = 1; i < argLen; ++i) {
                var arg = arguments[i];
                var regExpToTest = typeof arg === 'number' ? REGEXP_NUM_OR_STR : REGEXP_STR;
                if (regExpToTest.test(msg)) {
                    let newvalue = arg;
                    if (cc.sys.language != cc.sys.LANGUAGE_CHINESE && typeof newvalue === 'string') {
                        var data = window[langRes];
                        if (data && data[newvalue]) {
                            let newlan = data[newvalue][cc.sys.language];
                            if (newlan) { newvalue = newlan };
                        }
                    }
                    msg = msg.replace(regExpToTest, newvalue);
                } else
                    msg += ' ' + arg;
            }
        }
        else {
            for (let i = 1; i < argLen; ++i) {
                msg += ' ' + arguments[i];
            }
        }
        return msg;
    }
    window[langRes] = { "提示": { "id": "提示", "en": "TIPS" }, "确定": { "id": "确定", "en": "CONFIRM" }, "取消": { "id": "取消", "en": "CANCEL" }, "点击屏幕开始": { "id": "点击屏幕开始", "en": "TAP TO START" }, "皮肤": { "id": "皮肤", "en": "SKIN" }, "设置": { "id": "设置", "en": "SETTINGS" }, "音效": { "id": "音效", "en": "MUSIC" }, "震动": { "id": "震动", "en": "VIBRATION" }, "使用中": { "id": "使用中", "en": "USING" }, "未解锁": { "id": "未解锁", "en": "LOCKED" }, "使用": { "id": "使用", "en": "USE" }, "获得": { "id": "获得", "en": "GET" }, "返回主页": { "id": "返回主页", "en": "HOME" }, "继续游戏": { "id": "继续游戏", "en": "CONTINUE" }, "暂停": { "id": "暂停", "en": "PAUSE" }, "恭喜通关": { "id": "恭喜通关", "en": "CONGRATULATIONS" }, "载入中...%d%": { "id": "载入中...%d%", "en": "LOADING...%d%" }, "关闭": { "id": "关闭", "en": "CLOSE" }, "关卡%d": { "id": "关卡%d", "en": "LEVEL%d" }, "金币不足": { "id": "金币不足", "en": "NOT ENOUGH COINS" }, "需再看%s次视频后解锁": { "id": "需再看%s次视频后解锁", "en": "UNLOCK AFTER WATCHING %s VIDEOS" }, "替换成功!": { "id": "替换成功!", "en": "REPLACEMENT SUCCEEDED!" }, "后续关卡正在开发当中": { "id": "后续关卡正在开发当中", "en": "UNDER DEVELOPMENT" }, "加载关卡失败": { "id": "加载关卡失败", "en": "LOADING ERROR" }, "看完广告": { "id": "看完广告", "en": "DID NOT WATCH THE ENTIRE ADS" }, "内容正在加载中，请稍后再试！": { "id": "内容正在加载中，请稍后再试！", "en": "CONTENT IS LOADING,TRY AGAIN LATER!" }, "我知道了": { "id": "我知道了", "en": "I KNOW" }, "没有看完视频": { "id": "没有看完视频", "en": "VIDEO NOT FINISHED" }, "未完整观看广告": { "id": "未完整观看广告", "en": "DID NOT WATCH THE ENTIRE ADS" }, "评分": { "id": "评分", "en": "RATE" }, "喜欢这游戏？": { "id": "喜欢这游戏？", "en": "LIKE THIS GAME?" }, "主页": { "id": "主页", "en": "HOME" }, "不了，谢谢": { "id": "不了，谢谢", "en": "NO THANKS" }, "皮肤推送": { "id": "皮肤推送", "en": "POPUP" }, "多倍获得": { "id": "多倍获得", "en": "GET DOUBLE" }, "放弃": { "id": "放弃", "en": "CANCEL" }, "好": { "id": "好", "en": "GET" }, "体力不足": { "id": "体力不足", "en": "NOT ENOUGH ENERGY" }, "获得皮肤": { "id": "获得皮肤", "en": "GET SKIN" }, "需看视频获得": { "id": "需看视频获得", "en": "WATCH VIDEO" }, "攻击自己，可免费变换": { "id": "攻击自己，可免费变换", "en": "FREE REPLANCEMENT" }, "所有皮肤！": { "id": "所有皮肤！", "en": "ALL SKINS" }, "下一关": { "id": "下一关", "en": "NEXT" }, "录屏分享": { "id": "录屏分享", "en": "SHARE VIDEO" }, "今日剩余视频数：%d": { "id": "今日剩余视频数：%d", "en": "VIDEO REMAINING：%d" }, "不需要看视频获得": { "id": "不需要看视频获得", "en": "NOT WATCH VIDEO" }, "看视频获取": { "id": "看视频获取", "en": "WATCH VIDEO" }, "获得(%d/%d)": { "id": "获得(%d/%d)", "en": "GET(%d/%d)" }, "体力已满": { "id": "体力已满", "en": "ENERGY IS FULL" }, "重来": { "id": "重来", "en": "RESTART" }, "跳过关卡": { "id": "跳过关卡", "en": "SKIP" }, "通关失败": { "id": "通关失败", "en": "FAILED" }, "发布录屏求助": { "id": "发布录屏求助", "en": "SHARE VIDEOS" }, "录屏结束": { "id": "录屏结束", "en": "RECORD END" }, "观看广告复活": { "id": "观看广告复活", "en": "REVIVE" }, "武器耗尽": { "id": "武器耗尽", "en": "EXHAUSTED" }, "是否满武器复活？": { "id": "是否满武器复活？", "en": "RESURRECTION OR NOT" }, "跳过": { "id": "跳过", "en": "SKIP" }, "复活成功": { "id": "复活成功", "en": "RESURRECTION SUCCESSFUL" }, "是": { "id": "是", "en": "YES" }, "否": { "id": "否", "en": "NO" }, "冒险模式": { "id": "冒险模式", "en": "ADVENTURE" }, "是否需要解锁冒险模式": { "id": "是否需要解锁冒险模式", "en": "TO UNLOCK ADVENTURE MODE" }, "宝贝，我回来了": { "id": "宝贝，我回来了", "en": "Baby I'm back!" }, "我要相信她吗？": { "id": "我要相信她吗？", "en": "Should I believe her?" }, "关卡选择": { "id": "关卡选择", "en": "SELECT" }, "游戏失败": { "id": "游戏失败", "en": "FAIL" }, "免费复活": { "id": "免费复活", "en": "HELP ME" }, "你比世界上99%的人聪明！": { "id": "你比世界上99%的人聪明！", "en": "You are cleverer than 99% people" }, "金币x500": { "id": "金币x500", "en": "%s" }, "新皮肤解锁": { "id": "新皮肤解锁", "en": "New Dress" }, "签到": { "id": "签到", "en": "SIGN IN" }, "基地": { "id": "基地", "en": "HOME" }, "关卡": { "id": "关卡", "en": "LEVEL" }, "开始游戏": { "id": "开始游戏", "en": "START" }, "皮肤领取": { "id": "皮肤领取", "en": "GET" }, "她是谁？": { "id": "她是谁？", "en": "Who is she?" }, "我应该相信她么？": { "id": "我应该相信她么？", "en": "Should I believe her?" }, "有本事来抓我呀~": { "id": "有本事来抓我呀~", "en": "hey!!! I'm here!" }, "我必须要走了": { "id": "我必须要走了", "en": "I have to go now" }, "我得找到地方藏起来": { "id": "我得找到地方藏起来", "en": "Where can I hide?" }, "初遇": { "id": "初遇", "en": "Police's Home" }, "关卡%s": { "id": "关卡%s", "en": "LEVEL %s" }, "不用，谢谢": { "id": "不用，谢谢", "en": "NO THANKS" }, "金币x%s": { "id": "金币x%s", "en": "x%s" }, "关卡尚未解锁": { "id": "关卡尚未解锁", "en": "pass previous levels to unlock!" }, "更多关卡，敬请期待": { "id": "更多关卡，敬请期待", "en": "More levels coming soon" }, "你去收集\n一下证据": { "id": "你去收集\n一下证据", "en": "U go to collect evidence" }, "HI,很高兴认识你": { "id": "HI,很高兴认识你", "en": "Hi,nice to meet U" }, "你好呀，小哥哥": { "id": "你好呀，小哥哥", "en": "Hi,Handsome boy" }, "不是啊，你自己摔的呀": { "id": "不是啊，你自己摔的呀", "en": "What?U fall on your own" }, "有人开车撞老人啦": { "id": "有人开车撞老人啦", "en": "Help!Help!" }, "她是杀手": { "id": "她是杀手", "en": "She is KILLER" }, "      =杀手": { "id": "      =杀手", "en": "       KILLER" }, "来吧！决斗吧": { "id": "来吧！决斗吧", "en": "Come on!" }, "第1章-1": { "id": "第1章-1", "en": "CHAPTER 1-1" }, "第1章-2": { "id": "第1章-2", "en": "CHAPTER 1-2" }, "第1章-3": { "id": "第1章-3", "en": "CHAPTER 1-3" }, "在哪？": { "id": "在哪？", "en": "Where ?" }, "怎么样\n拆穿她呢": { "id": "怎么样\n拆穿她呢", "en": "How to expose her?" }, "快去快回": { "id": "快去快回", "en": "GO!GO!!!" }, "很高兴认识你...": { "id": "很高兴认识你...", "en": "Nice to meet U." }, "杀手藏哪里了呢": { "id": "杀手藏哪里了呢", "en": "Where are U?" }, "5555\n我不管": { "id": "5555\n我不管", "en": "Waah..." }, "得想办法离开这里": { "id": "得想办法离开这里", "en": "Time to go!" }, "我们一起走吧": { "id": "我们一起走吧", "en": "Let's go" }, "喜欢这个游戏吗？": { "id": "喜欢这个游戏吗？", "en": "Would U like this game?" }, "给我们一个好评吧！": { "id": "给我们一个好评吧！", "en": "Plese give us a like!" }, "广告还没准备好": { "id": "广告还没准备好", "en": "Ads are not ready yet. Please Wait." }, "需要获取提示吗？": { "id": "需要获取提示吗？", "en": "Need to get tips?" }, "获取提示": { "id": "获取提示", "en": "Get tips" }, "是否要观看视频跳过关卡？": { "id": "是否要观看视频跳过关卡？", "en": "Do you want to watch the video to skip the level?" }, "开": { "id": "开", "en": "on" }, "关": { "id": "关", "en": "off" }, "跳过此关": { "id": "跳过此关", "en": "skip" }, "提 示": { "id": "提 示", "en": "tips" }, "是否要观看一段小视频解锁特殊剧情？": { "id": "是否要观看一段小视频解锁特殊剧情？", "en": "Do you want to watch a small video to unlock the special plot?" }, "马上解锁": { "id": "马上解锁", "en": "Unlock" }, "请攻击章鱼头！": { "id": "请攻击章鱼头！", "en": "Please attack Octopus head!" }, "切断！": { "id": "切断！", "en": "Cut off!" }, "传送门！": { "id": "传送门！", "en": "Portal!" }, "易碎木板！": { "id": "易碎木板！", "en": "Fragile wood!" }, "通关解锁": { "id": "通关解锁", "en": "LEVEL UNLOCK" }, "宝箱获得": { "id": "宝箱获得", "en": "BOX" }, "恭喜获得": { "id": "恭喜获得", "en": "CONGRATULATIONS!" }, "宝箱": { "id": "宝箱", "en": "BOX" }, "开启": { "id": "开启", "en": "OPEN" }, "开启%d个": { "id": "开启%d个", "en": "OPEN%d" }, "领取": { "id": "领取", "en": "GET" }, "上热门": { "id": "上热门", "en": "HOT SEARCH LIST" }, "成功通关": { "id": "成功通关", "en": "CONGRATULATIONS!" }, "宝箱奖励": { "id": "宝箱奖励", "en": "BOX REWARD" }, "金币x%d": { "id": "金币x%d", "en": "GOLDx%d" }, "皮肤 x%d": { "id": "皮肤 x%d", "en": "SKINx%d" }, "金币 x%d": { "id": "金币 x%d", "en": "GOLD x%d" }, "体力 x%d": { "id": "体力 x%d", "en": "ENERGY x%d" }, "领取成功": { "id": "领取成功", "en": "GET" }, "商店": { "id": "商店", "en": "SHOP" }, "武器": { "id": "武器", "en": "WEAPON" }, "请画线攻击": { "id": "请画线攻击", "en": "LET'S DRAW!" }, "获得武器": { "id": "获得武器", "en": "GET WEAPON" } };
})("DrawRescueRes");