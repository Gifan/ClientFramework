/** [Framework] 框架在运行时声明的全局的统一命名空间, 以减少对全局变量的污染, 此命名空间需要在框架启动后才能访问 */
declare module fw {

    var TestMode: boolean;

    /** 判断 Cocos Creator 引擎版本是否 1.x.x */
    var isCC1: boolean;
    /** 判断 Cocos Creator 引擎版本是否 2.x.x */
    var isCC2: boolean;
    /**判断当前平台是否有分享功能 */
    var hasShareing: boolean;
    /**判断当前玩家是否定位为红包用户 */
    var isRedbagPlayer: boolean;

    /** 框架提供的运行平台判断 */
    var pf: Platform;
    var isUnkown: boolean;
    var isWxLike: boolean;
    var isNative: boolean;
    var isWX: boolean;
    var isBD: boolean;
    var isQQ: boolean;
    var isIOS: boolean;
    var isANDROID: boolean;
    var isANDROID_NORMAL: boolean; 
    var isANDROID_SIX_K_PLAY: boolean;
    var isANDROID_WONDER_BOX: boolean;
    var isANDROID_YIYU: boolean; 
    var isANDROID_LING_YOU: boolean;
    var isANDROID_TAPTAP: boolean;
    var isANDROID_MTG: boolean;
    var isANDROID_XM: boolean;
    var isANDROID_VIVO: boolean;
    var isANDROID_OPPO: boolean;
    var isTOUTIAO: boolean;
    var isZJTD: boolean;
    var isXIAOMI: boolean;
    var isH5_4399: boolean;
    var isOPPO: boolean;
    var isH5_QTT: boolean;
    var isH5_MOLI: boolean;
    var isH5_UC: boolean;
    var isSINA: boolean;
    var isZHANGYU: boolean;
    var isVIVO: boolean;

    /** [UIManager] 全局的UI管理者 */
    // var ui: UIMgr;
    /** [UIManager] UI管理者 */
    class UIMgr {
        /** 当前页面 */
        get curPage(): PageBase;
        /** 当前最高一层面板(不含通用) */
        get topPanel(): PanelBase;
        /** 激活的面板栈 */
        get panelStack(): ReadonlyArray<PanelBase>;
        /** 激活的面板合集 */
        get activePanels(): { readonly [name: string]: PanelBase }
        /** 根据名称返回面板(不一定有值) */
        getPanel(panelName: string): PanelBase;
        /** UI 常用工具 */
        tools: UITools;
        /** 保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页面。 */
        navigateTo(pageName: string, arg?: any, onCpl?: fw.cb);
        /** 关闭当前页面，跳转到应用内的某个页面。 */
        navigateBack(count: number = 0, onCpl?: fw.cb);
        /** 关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages()) 获取当前的页面栈，决定需要返回几层。 */
        redirectTo(pageName: string, arg?: any, onCpl?: fw.cb);
        /** 关闭所有页面，打开到应用内的某个页面。 */
        reLaunch(pageName: string, arg?: any, onCpl?: fw.cb);

        /** 显示一个面板 */
        showPanel(panelName: string, arg?: any, onCpl?: fw.cb);
        /** 关闭指定面板 */
        hidePanel(panel: PanelBase, arg?: any, onCpl?: fw.cb);

        /** 展示一个轻提示面板, 时长为秒, 默认2秒 */
        showToast(msgOrData: string | ToastPanelData, time?: number);
        /** 展示一个确认面板 */
        showNotify(msgOrData: string | NotifyPanelData, btnText?: string, titleText?: string);
        /** 关闭当前展示的确认面板 */
        hideNotify();
        /** 展示一个用户选择面板 */
        showChoose(data: ChoosePanelData);
        /** 关闭当前展示的用户选择面板 */
        hideChoose();
        /** 设置全局输入屏蔽 */
        setInputBlock(isOn: boolean);
        /** 预加载一个UI */
        preLoad(name: string, isPanel: boolean, onCpl: (ui: UIBase) => void): void;
    }
    class UITools {
        downloadImg(sp: cc.Sprite, url: string, type: string, discardRes?: () => boolean | undefined): void;
        loadSpf(sp: cc.Sprite, path: string, discardRes?: () => boolean | undefined): void;
        instanResPath(resPath: string, parentNode: cc.Node, successCB?: (node: cc.Node) => void): void;
        instanPfb(pfb: cc.Prefab, parentNode: cc.Node): cc.Node;
        instanPfb_getCpm<T extends cc.Component>(pfb: cc.Prefab, parentNode: cc.Node, type: { prototype: T }): T;
    }
    interface UISwitchEvent {
        type: UISwitchType;
        data?: any;
        showUi?: UIBase;
        hideUi?: UIBase;
        showUiName?: string;
        hideUiName?: string;
    }
    /** [吐司面板] 显示数据 */
    class ToastPanelData extends CommonPanelBaseData {
        /** 面板持续显示的时间, 默认 1 秒 */
        time?: number = 1;
    }
    /** [通知面板] 显示数据 */
    class NotifyPanelData extends CommonPanelBaseData {
        /** 面板的标题文字, 不传则显示'提示' */
        titleText?: string;
        /** 确认按键上的文字, 不传则显示'确定' */
        acceptText?: string;
        /** no选项按键按下时触发的回调, 不传则关闭面板 */
        acceptCb?: (data?: NotifyPanelData) => void;
    }
    /** [选择面板] 显示数据 */
    class ChoosePanelData extends CommonPanelBaseData {
        /** 面板的标题文字, 不传则显示'提示' */
        titleText?: string;
        /** yes选项按键上的文字, 不传则显示'同意' */
        yesText?: string;
        /** no选项按键上的文字, 不传则显示'取消' */
        noText?: string;
        /** yes选项按键按下时触发的回调, 必选参数, 按下后默认关闭面板, 回调中返回 true 可以保持面板不关闭 */
        yesCB?: (data?: ChoosePanelData) => void;
        /** no选项按键按下时触发的回调, 必选参数, 按下后默认关闭面板, 回调中返回 true 可以保持面板不关闭 */
        noCB?: (data?: ChoosePanelData) => void;
    }
    /** [通用面板] 显示数据 */
    class CommonPanelBaseData {
        /** 面板的提示消息 */
        tipsMsg: string;
        /** 面板的自定义展示动画, 不传则使用默认动画 */
        showAction?: cc.Action;
        /** 面板展示前的回调, 用于设置自定义的面板属性 */
        preShow?: (node: cc.Node) => void;
        /** 自定义附带参数, 回调的时候会把本数据统一返回 */
        args?: any;
        /** 确认按键上的文字, 不传则显示'确定' */
        acceptText?: string;
    }

    /** [EventCenter] 全局的事件分发中心 */
    var ec: EventCenter<any>;
    /** [EventCenter] 事件分发中心 */
    class EventCenter<TData> {
        /** 监听事件 */
        on(name: string, cb: (data?: TData) => void, caller: object): void;
        /** 监听事件 */
        add(name: string, cb: (data?: TData) => void, caller: object): void;
        /** 取消监听事件 */
        off(name: string, cb: (data?: TData) => void): void;
        /** 取消监听事件 */
        remove(name: string, cb: (data?: TData) => void): void;
        /** 统一处理监听及取消监听事件 */
        listen(isOn: boolean, name: string, cb: (data?: TData) => void, caller: object): void;
        /** 触发事件 */
        emit(name: string, data?: TData): void;
        /** 清空事件中心 */
        clear(): void;
    }

    /** [NetManager] 全局的网络管理者 */
    var net: NetMgr;
    /** [NetManager] 网络管理者 */
    class NetMgr {
        /** 指示是否已经连接 Socket */
        isConnected: boolean;
        /** 设置网络参数
         * @param config 配置对象
         * @param config.http_baseUrl HTTP 请求的地址前缀
         * @param config.socket_baseUrl Socket 连接的地址前缀
         * @param config.http_authenData (HTTP/Get) 每次请求都会附带的验证信息参数, 直接传入如 "&token=abc&id=123" 形式的字符串即可, 请求时会自动拼入地址
         * @param config.socket_authenData (Socket) 每次请求都会附带的验证信息参数, 直接传入如 { token:"abc", id:123 } 形式的对象即可, 请求时会自动拼入地址
         * @param config.http_resultHandler HTTP GET 请求后的结果处理句柄
         */
        setting(config: {
            http_baseUrl?: string, socket_baseUrl?: string,
            http_authenData?: string, socket_authenData?: { [key: string]: string | number },
            http_resultHandler?: (responseText: string, cb: (res: any) => void) => void
        });
        /** 指示 Socket 是否已经连接 */
        isConnected: boolean;
        /** 连接 Socket
         * @param url 连接地址
         */
        connect(url?: string);
        /** 断开 Socket 连接 */
        disconnect();
        /** 监听 Socket 事件
         * @param isOn 是否监听 (true : 进行监听, false : 取消监听)
         * @param name 事件名称
         * @param cb 事件回调 (需要取消监听的回调, 不要使用闭包函数)
         * @param caller 回调发起者, 通常传入 this
         */
        listen(isOn: boolean, name: string, cb: (data: object) => void, caller: object);
        /** 发送带命令的消息, 最后会转成 Json 发送
         * @param command 消息命令
         * @param msgData 消息内容
         */
        sendCmdMsg(command: string, msgData?: any, quiet?: boolean);
        /** 发送 WebSocket 消息, 直接调用 WebSocket 发送内容
         * @param data WebSocket 支持的发送类型
         * @param onCpl 发送完成回调
         */
        sendWsMsg(data: string | ArrayBuffer | Blob | ArrayBufferView, onCpl?: (e?: Error) => void);
        /** Socket 状态回调的名称 */
        SocketEvent = {
            /** Socket 连接成功 */
            CONNECT: 'connect',
            /** Socket 连接失败 */
            CONNECT_FAILED: 'connect_failed',
            /** Socket 错误 */
            ERROR: 'error',
            /** Socket 离线 */
            DISCONNECT: 'disconnect',
            /** Socket 重连 */
            RECONNECT: 'reconnect',
        }
        /** 发起 HTTP GET 请求
         * @param obj 参数对象
         * @param obj.url 请求地址, 必填参数
         * @param obj.useFullUrl 是否使用全地址, 可选参数, true : { 忽略配置的 http_baseUrl , 仅使用 obj.url 发起请求 }, false | 不填此参数 : { 拼接 http_baseUrl 发起请求} 
         * @param obj.params 请求参数, 可选参数, key-value 的简单对象
         * @param obj.onSuccess 成功回调, 可选参数
         * @param obj.onError 错误回调, 可选参数
         */
        httpGet(obj: { url: string, useFullUrl?: boolean, params?: { [key: string]: any }, onSuccess?: (data: any) => void, onError?: (data: any) => void });
        /** 发起 HTTP GET 请求
         * @param url 请求地址, 必填参数
         * @param paramsOrOnCpl 请求参数, 可选参数, key-value 的简单对象, 也可直接传入完成回调(此时会忽略后一个参数)
         * @param onCpl 完成回调, 可选参数
         */
        httpGet(url: string, paramsOrOnCpl?: { [key: string]: any } | ((e, data: any) => void), onCpl?: (e, data: any) => void);
        /** 发起 HTTP POST 请求, 此API待改造 */
        httpPost(url: string, params: object, onSuccess?: (data: any) => void, onError?: (data: any) => void, object?: object);
    }

    /** [NetManager] 全局的SDK管理者 */
    var sdk: SdkMgr;
    /** [NetManager] SDK管理者 */
    class SdkMgr {
        /** 登陆
         * @param successCB 登陆成功的回调, 返回登陆的参数
         * @param failCB 登陆失败的回调, 返回失败信息
         */
        login(successCB: (data: any) => void, failCB?: (msg: string) => void);
        /** 分享 */
        shareWX():void;
        shareQQ():void;
        share(shareInfo: ShareInfo, onCpl?: (rsl: ShareResult) => void): void;
        share(shareInfo: ShareInfo, customArg?: any, onCpl?: (rsl: ShareResult) => void): void;
        /** 视频广告 */
        VideoADFailCode: typeof SdkMgr.VideoADFailCode;
        /** 渠道来源类型 */
        ChannelType: typeof SdkMgr.ChannelType;
        /** 观看视频广告
         * @param onPlayEnd 播放完毕回调
         * @param onPlayEnd.notCplReason 播放失败的原因文案, 返回空值代表完整播放
         * @param onPlayEnd.failCode 播放失败的原因
         * @param args 非必要的参数(由用户与对应实现控制器约定)
         */
        setBid(bid: string);
        showVideoAD(onPlayEnd: (notCplReason?: string, failCode?: SdkMgr.VideoADFailCode) => void, type?: string);
        showInsertAd(type: string);
        showSplashAd(type: string);
        createBannerAd(type?: string, style?: BannerADStyle, args?: any): WxBanner;
        showAddToMyGameGuide(type: string);
        showBannerAd(type: string, onShow?: () => void);
        showBannerAd(type: string, node: cc.Node, onShow?: () => void);
        showBannerAd(type: string, style?: BannerADStyle, onShow?: () => void);
        hideBannerAd();
        destoryBannerAd();
        showFeedAd(node:cc.Node=null);  //显示信息流广告
        hideFeedAd();  
        sendWechatAuthRequest();  //微信登录
        postLevel(level:string,coin:string);   //上报用户等级金币
        withdraw(amount:string);    //提现  
        getUserInfo();    //获取用户信息  
        isWXAppInstalled():boolean;  //是否安装微信
        sendRequest(url:string,params:string);
        checkAppBox(onShow: () => void);
        showGameBox();
        channelData: SdkMgr.ChannelData;
        jumpApp(appId: string, path?: string, extraData?: PathObj, onCpl?: (failReason: string) => void, arg?: any);
        showImage(url: string);
        showKefu();
        /** 开启加速计
         * @param type 加速计类型
         * @param cb 回调函数
         */
        addAccelerometerEvent(type: string, cb: fw.cb1<boolean>);
        /**关闭加速计 */
        stopAccelerometerEvent();
    }
    namespace SdkMgr {
        enum VideoADFailCode {
            /** 暂无意义 */
            NONE,
            /** 版本不支持 */
            NOT_SUPPORT,
            /** 视频未准备好 */
            NOT_READY,
            /** 未知广告类型(未找到id) */
            UNKNOW_TYPE,
            /** 广告未完整查看 */
            NOT_COMPLITE,
            /** 广告异常 */
            AD_ERROR,
        }
        enum ChannelType {
            /** 无意义 */
            NONE,
            /** 来自分享链接 */
            SHARE,
            /** 来自二维码 */
            QRCODE,
            /** 来自其他正式渠道 */
            EVERY_SOURCE,
            /** 来自虚拟渠道(用于调试测试) */
            FAKE
        }
        type ChannelData = {
            /** 本次进入游戏的来源 */
            enterSource: string,
            /** 本次进入游戏的方式 */
            type: ChannelType,
            /** BMS上的分享配置(仅分享来源时存在) */
            bms?: dto.HTTP.BMS_SHARE_CONFIG.item
            /** 推广来源 */
            promoSource?: string;
            /** 推广级别 */
            promoLv?: number;
        }
    }
    interface WxBanner {
        canShow: boolean;
        show();
        hide();
        dispose();
        onLoad(cb: () => void);
        onError(cb: (e: Error) => void);
    }
    interface ShareInfo {
        /** 设置转发标题，不传则默认使用当前小游戏的昵称 */
        title?: string;
        /** 设置转发显示图片的链接，可以是网络图片路径或本地图片文件路径或相对代码包根目录的图片文件路径 */
        imageUrl?: string;
        /** 设置查询字符串，从这条转发消息进入后，可通过 wx.onLaunch() 或 wx.onShow 获取启动参数中的 query。必须是 key1=val1&key2=val2 的格式。最大长度 128 个字符，超过部分会被截断 */
        query?: string;
        /** 对象格式的参数 */
        queryObj?: { [key: string]: string | number | boolean };
    }
    interface ShareResult {
        /** 分享是否成功 */
        iSuccess: boolean;
        /** 群信息, 如果有则不为空 */
        shareTicket?: string;
        /** 失败原因, 暂时未定义 */
        failCode?: number;
        /** 失败文案 */
        failReason?: string;
        /** 其他数据, 留作扩展 */
        data?: any;
    }
    interface BannerADStyle {
        /** [广告宽度|默认300] 会对非法值(超过300-375)作出裁剪 */
        width?: number,
        /** [广告宽度比例|默认0] 传入0-1的值, 代表可显示的 最小宽度-最大宽度 */
        widthScale?: number,
        /** [底部对齐|默认0] 传入距离底部的高度(微信的像素单位), 非法值会调整到屏幕内 */
        bottom?: number,
        /** [顶部对齐|默认不执行|会覆盖前一参数] 距离顶部的高度(微信的像素单位), 非法值会调整到屏幕内 */
        top?: number,
    }

    var audio: AudioMgr;
    class AudioMgr {
        bgmVolume: number;
        seVolume: number;
        preLoad(url, onCpl?: (e, res) => void);
        playBgm(clip: cc.AudioClip | string, volume?: number);
        playSe(clip: cc.AudioClip | string, volume?: number);
        play(url: string, onStateChange?: (state: SimplePlayState) => void, startSecond: number = 0, playSecond: number = 15);
        tap();
        stopAll();
    }

    var res: ResMgr;
    class ResMgr {
        loadRes(path: string, type: typeof cc.Asset, onCpl: (e: Error, res: any) => void): void
        loadRes(path: string, type: typeof cc.Asset, onCpl: (e: Error, res: any) => void, onEnd: () => void, timeOut?: number): void
        load(url: string,
            type: "image/jpeg" | "image/png" | "audio/mp3" | "text/xml" | "text/html" | "text/plain" | string,
            onCpl: (e: Error, res: any) => void);
        unload(url: string);
        unloadRes(url: string);
    }

    //var bb: BlackBoard;
    interface BlackBoard {
        /** [获取属性] 获取黑板上的属性值
         * @param name 属性的名称
         */
        get(name: string): any;

        /** [更新属性] 更新黑板上的属性, 会将该属性更变前后的值通知到相应关注者
         * @param name 属性的名称
         * @param value 属性的值
         */
        set(name: string, value: any): void;

        /** [删除属性] 删除黑板上的属性
         * @param name 属性的名称
         */
        delete(name: string): void;

        /** [监听属性] 统一处理关注及取消的 API */
        listen(isOn: boolean, name: string, fn: (newValue: any, oldValue?: any) => void, caller?: object): void;

        /** [关注属性] 关注黑板上的属性, 当属性发生更变时会发出回调通知
         * @param name 属性的名称
         * @param fn 回调方法 (参数 : 属性更新后的值, 属性更新前的值)
         * @param caller (可选参数) 回调的调用者
         */
        on(name: string, fn: (newValue: any, oldValue?: any) => void, caller?: object): void;

        /** [关注属性] 关注黑板上的属性, 当属性发生更变时会发出回调通知
         * @param name 属性的名称
         * @param fn 回调方法 (参数 : 属性更新后的值, 属性更新前的值)
         * @param caller (可选参数) 回调的调用者
         */
        add(name: string, fn: (newValue: any, oldValue?: any) => void, caller?: object): void;

        /** [取消关注属性] 取消关注黑板上的属性, 需要提供关注时提供的回调方法
         * @param name 属性的名称
         * @param fn 回调方法 (参数 : 属性更新后的值, 属性更新前的值)
         */
        off(name: string, fn: (newValue: any, oldValue?: any) => void): void;

        /** [取消关注属性] 取消关注黑板上的属性, 需要提供关注时提供的回调方法
         * @param name 属性的名称
         * @param fn 回调方法 (参数 : 属性更新后的值, 属性更新前的值)
         */
        remove(name: string, fn: (newValue: anys, oldValue?: any) => void): void;

        /** [清空黑板] 清除黑板上所有属性和关注数据 */
        clear(): void;
    }
    interface BBCache<T> {
        name: string;
        /** 快速获取/更新此属性的缓存值 */
        value: T;
        /** 获取此属性的缓存值 */
        get(): T;
        /** 更新此属性的缓存值 */
        set(value: T): void;
        /** 监听此属性的更变 */
        on(fn: (newValue: T, oldValue?: T) => void, caller?: object): void;
        /** 取消监听此属性的更变 */
        off(fn: (newValue: T, oldValue?: T) => void): void;
        /** 统一操作是否监听此属性的更变 */
        listen(isOn: boolean, fn: (newValue: T, oldValue?: T) => void, caller?: object): void;
    }
    interface LocalStorageObject<T> {
        value: T;
        get(): T;
        set(value: T);
        update();
        reset();
        clear();
    }
    class Util {
        static nameCutter(name: string, limit: number): string;
        static padLeft(value: string | number, digits: number, char: string | number): string;
        static getHumanDateS(date?: Date): string;
        static getHumanDate(date?: Date): number;
        static objToPath(obj: PathObj): string;
        static pathToObj(path: string): { [key: string]: string };
        static compareVersion(s1: string, s2: string): -1 | 0 | 1;
        static lerp(a: number, b: number, radio: number): number;
        static getTimer(countDownSecond: number, onUpdate?: (pcs: number) => void, onEnd?: () => void, fps?: number): Util.Timer;
        static getRester(restSecond: number, fn?: Function, caller?: any, onRest?: fw.cb): Util.Rester;
        static layout(p: number, cs: number[], x?: number): number[];
        static loginTime(days?: number): boolean;
    }
    namespace Util {
        interface Timer {
            isEnd: boolean;
            isStop: boolean;
            usems: number;
            stop();
            dispose();
        }
        interface Rester {
            doWith(fn: Function, caller?: any, args?: any | any[]);
            do(args?: any | any[]);
        }
    }

    enum Platform {
        /** 未定义平台 */
        UNKNOWN,
        /** 微信平台 */
        WECHAT_GAME,
        /** 百度平台 */
        BAIDU_GAME,
        /** qq平台 */
        QQ_MINI,
        /** 原生安卓 */
        NV_ANDROID,
        /** 原生安卓_6K玩平台 */
        NV_ANDROID_SIX_K_PLAY,
        /** 原生安卓_自家盒子 */
        NV_ANDROID_WONDER_BOX,
	    /** 原生安卓_易娱 */
        NV_ANDROID_YIYU,
        /** 原生安卓_灵游平台 */
        NV_ANDROID_LING_YOU, 
	    /** 原生安卓_TAPTAP平台 */
        NV_ANDROID_TAPTAP,
        /** 原生安卓_MTG平台 */
        NV_ANDROID_MTG,
        /** 原生安卓_XM平台 */
        NV_ANDROID_XM,
        /** 原生安卓_VIVO平台 */
        NV_ANDROID_VIVO,
        /** 原生安卓_OPPO平台 */
        NV_ANDROID_OPPO,
        /** 原生苹果 */
        NV_IPHONE,
        /** h5安卓 */
        BS_ANDROID,
        /** h5苹果 */
        BS_IPHONE,
        /** 头条系 */
        TOUTIAO,
        /** H5_4399平台 */
        H5_4399,
        /** OPPO平台 */
        OPPO_GAME,
        /** 趣头条平台 */
        H5_QTT,
        /** 魔力小游戏平台 */
        H5_MOLI,
        /** UC小游戏平台 */
        H5_UC,
        /** 新浪平台 */
        SINA,
        /**章鱼输入法 */
        H5_ZHANG_YU,
        /**vivo平台 */
        VIVO_GAME,
        /**小米平台 */
        isXIAOMI
    }

    function random(zeroTo: number): number;
    function random(from: number, to?: number): number;
    function randomf(zeroTo: number): number;
    function randomf(from: number, to?: number): number;
}
type PathObj = { [key: string]: string | number | boolean };
declare module fw {
    /** 不需要外部访问的命名空间 */
    namespace _private { }
    /** [无返回值/无参数]的回调函数 */
    type cb = { (): void }
    /** [无返回值/1个参数]的回调函数 */
    type cb1<T> = { (t: T): void }
    /** [无返回值/2个参数]的回调函数 */
    type cb2<T1, T2> = { (t1: T1, t2: T2): void }
    /** [无返回值/3个参数]的回调函数 */
    type cb3<T1, T2, T3> = { (t1: T1, t2: T2, t3: T3): void }
    /** [无返回值/4个参数]的回调函数 */
    type cb4<T1, T2, T3, T4> = { (t1: T1, t2: T2, t3: T3, t4: T4): void }
    /** [无返回值/5个参数]的回调函数 */
    type cb5<T1, T2, T3, T4, T5> = { (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): void }
    /** [带返回值/无参数]的回调函数 */
    type rcb<R> = { (): R }
    /** [带返回值/1个参数]的回调函数 */
    type rcb1<R, T> = { (t: T): R }
    /** [带返回值/2个参数]的回调函数 */
    type rcb2<R, T1, T2> = { (t1: T1, t2: T2): R }
    /** [带返回值/3个参数]的回调函数 */
    type rcb3<R, T1, T2, T3> = { (t1: T1, t2: T2, t3: T3): R }
    /** [带返回值/4个参数]的回调函数 */
    type rcb4<R, T1, T2, T3, T4> = { (t1: T1, t2: T2, t3: T3, t4: T4): R }
    /** [带返回值/5个参数]的回调函数 */
    type rcb5<R, T1, T2, T3, T4, T5> = { (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): R }
}
declare let require: (name: string) => any;