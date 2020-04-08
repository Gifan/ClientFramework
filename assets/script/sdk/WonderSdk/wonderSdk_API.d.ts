declare enum EPlatform {
    WEB_DEV = 1,
    NA_ANDROID,
    NA_IOS,
    WECHAT_GAME,
}
declare class AudioInterface {
    playMusic(id: number): void;
    stopMusic(): void;
    pauseMusic(): void;
    resumeMusic(): void;
    setMusicEnable(enable: boolean): void;
}
declare class SelectAlertInterface { showSelectAlert(data: { title?: string, desc?: string, confirm: () => void, cancel?: () => void }): void; }
declare module wonderSdk {
    let isInit: boolean;
    enum VideoAdCode {
        //完成
        COMPLETE,
        //版本不支持
        NOT_SUPPORT,
        //视频还没准备好
        NOT_READY,
        //未知广告类型
        UNKNOW_AdId,
        //没有观看完全
        NOT_COMPLITE,
        //广告发生错误
        AD_ERROR,
        //广告拉起成功
        SHOW_SUCCESS,
    }

    //是否是原生平台
    let isNative: boolean;
    //是否为测试模式
    let isTest: boolean;
    /**
     * @description 初始化sdk接口，所以接口调用前必须调用init方法
     * @author 吴建奋
     * @date 2020-04-05
     * @static
     * @param {EPlatform} platformId 平台id
     * @param {boolean} [isTest=false] 预留
     * @returns
     * @memberof WonderSdk
     */
    function init(platformId: EPlatform, isTest?: boolean): boolean;
    /**
     * @description 实例版本获取版本sdk
     * @readonly
     * @memberof WonderSdk
     */
    let sdkVersion: string;
    /**
     * @description 获取当前sdk版本
     * @readonly
     * @static
     * @memberof WonderSdk
     */
    /**
     * @description 使用外部音效管理器
     * @author 吴建奋
     * @date 2020-04-05
     * @param {AudioInterface} audioInterface
     * @memberof WonderSdk
     */
    function setAudioAdapter(audioInterface: AudioInterface): void;
    /**
     * @description 使用外部弹窗
     * @author 吴建奋
     * @date 2020-04-05
     * @param {SelectAlertInterface} alertInterface
     * @memberof WonderSdk
     */
    function setAlertAdpater(alertInterface: SelectAlertInterface): void;
    /**
     * @description 请求登录
     * @author 吴建奋
     * @date 2020-04-05
     * @param {(data: any) => void} [success] 登录成功回调
     * @param {(errmsg) => void} [fail] 登录失败回调
     * @returns {Promise<any>}
     * @memberof WonderSdk
     */
    function login(success?: (data: any) => void, fail?: (errmsg: string) => void): Promise<any>;
    function showBanner(adId: number, onShow?: () => void): void;
    function showBanner(adId: number, nodeInfo: {
        x: number;
        y: number;
        width: number;
        height: number;
    }, onShow?: () => void): void;
    function showBanner(adId: number, style: {
        width?: number;
        height?: number;
        left?: number;
        bottom?: number;
        top?: number;
    }, onShow?: () => void): void;
    /**
     * @description 隐藏banner广告
     * @author 吴建奋
     * @date 2020-04-05
     * @memberof WonderSdk
     */
    function hideBanner(): void;
    /**
     * @description 删除banner广告
     * @author 吴建奋
     * @date 2020-04-05
     * @memberof WonderSdk
     */
    function destroyBanner(): void;
    /**
     * @description 展示激励视频广告
     * @author 吴建奋
     * @date 2020-04-05
     * @param {number} adId 对应sdkConfig配置id
     * @param {(code: VideoAdCode, msg?: string) => void} [onPlayEnd] 播放回调
     * @returns
     * @memberof WonderSdk
     */
    function showVideoAD(adId: number, onPlayEnd?: (code: wonderSdk.VideoAdCode, msg?: string) => void): void;
    /**
     * @description 展示全屏视频广告
     * @author 吴建奋
     * @date 2020-04-05
     * @param {number} adId 对应sdkConfig配置id
     * @param {(code: VideoAdCode, msg?: string) => void} [onPlayEnd] 播放回调
     * @returns
     * @memberof WonderSdk
     */
    function showFullVideoAD(adId: number, onPlayEnd?: (code: wonderSdk.VideoAdCode, msg?: string) => void): void;
    /**
     * @description 发送事件统计请求
     * @author 吴建奋
     * @date 2020-04-05
     * @param {string} key 事件key
     * @param {*} param 自定义参数
     * @memberof WonderSdk
     */
    function sendEvent(key: string, param: any): void;
    /**
     * @description 展示插屏广告
     * @author 吴建奋
     * @date 2020-04-05
     * @memberof WonderSdk
     */
    function showInsertAd(): void;
    /**
     * 展示开屏广告
     * @param adId 广告id
     */
    function showSplashAd(): void;
    /**
     * 展示信息流广告
     * @param style 广告样式
     */
    function showFeedAd(style: {
        width?: number;
        height?: number;
        left?: number;
        bottom?: number;
        top?: number;
    }): void;
    /**
     * @description 隐藏信息流
     * @author 吴建奋
     * @date 2020-04-05
     * @memberof WonderSdk
     */
    function hideFeedAd(): void;
    /**
     * @description 显示隐私政策
     * @author 吴建奋
     * @date 2020-04-05
     * @param {(boo:any) => void} success 成功回调
     * @memberof WonderSdk
     */
    function showPrivacy(success: (boo: any) => void): void;
    /**
     * @description 拉起分享
     * @author 吴建奋
     * @date 2020-04-05
     * @param {*} param
     * @param {() => void} [success] 成功回调
     * @param {() => void} [fail] 失败回调
     * @memberof WonderSdk
     */
    function share(param: any, success?: () => void, fail?: () => void): void;
    /**
     * @description 获取BMS对应唯一标识
     * @readonly
     * @memberof WonderSdk
     */
    let BMS_APP_NAME: string;
    /**
     * @description 获取BMS版本
     * @readonly
     * @memberof WonderSdk
     */
    let BMS_VERSION: string;
    /**
     * @description 请求是否为屏蔽IP地址
     * @author 吴建奋
     * @date 2020-04-05
     * @returns {Promise<boolean>}
     * @memberof WonderSdk
     */
    function requestShiledIp(): Promise<boolean>;
    /**
     * @description 请求获取开关配置
     * @author 吴建奋
     * @date 2020-04-05
     * @returns {Promise<any>}
     * @memberof WonderSdk
     */
    function requestSwitchConfig(): Promise<any>;
}
