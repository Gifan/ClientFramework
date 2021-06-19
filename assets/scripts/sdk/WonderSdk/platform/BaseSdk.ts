export abstract class BaseSdk {
    /**
     * 初始化sdk
     */
    public init(appid?: string) {
        if (appid)
            this.setAppId(appid);
    };
    /**
     * 登录
     */
    public abstract login(success?: (data: any) => void, fail?: (errmsg: string) => void): Promise<any>;

    /**
     * 展示banner广告
     * @param adId 广告id
     * @param style 广告样式
     * @param onShow 展示回调
     */
    public showBanner(adId: string, onShow?: () => void) {
        this.showBannerWithStyle(adId, {}, onShow);
    }
    /**
     * @description 根据node节点位置展示banner广告
     * @author 吴建奋
     * @date 2020-04-05
     * @abstract
     * @param {string} adId
     * @param {{ x: number, y: number, width: number, height: number }} node
     * @param {() => void} [onShow]
     * @memberof BaseSdk
     */
    public abstract showBannerWithNode(adId: string, node: { x: number, y: number, width: number, height: number }, onShow?: () => void): void;
    public abstract showBannerWithStyle(adId: string, style: {
        width?: number,
        height?: number,
        left?: number,
        bottom?: number,
        top?: number,
    }, onshow?: () => void): void
    /**
     * 隐藏banner广告
     */
    public abstract hideBanner(): void;
    /**
     * 删除banner广告
     */
    public abstract destroyBanner(): void;
    /**
     * 展示激励视频广告
     * @param adId 广告id
     * @param onPlayEnd 观看回调
     */
    public abstract showVideoAD(adId: string, onPlayEnd?: (code: VideoAdCode, msg?: string) => void): void;

    /**
     * 展示全屏视频广告
     * @param adId 广告id
     * @param onPlayEnd 观看回调
     */
    public showFullVideoAD(adId: string, onPlayEnd?: (code: VideoAdCode, msg?: string) => void) { }
    /**
     * 记录对应事件
     * @param key 事件id
     * @param param 额外参数 
     */
    public abstract sendEvent(key: string, param: any): void;
    /**
     * 展示插屏广告
     * @param adId 广告id
     */
    public showInsertAd(adId: string) { };
    /**
     * 展示开屏广告
     * @param adId 广告id
     */
    public showSplashAd(adId: string) { };
    /**
     * 展示信息流广告
     * @param style 广告样式
     */
    public showFeedAd(adId: string, style: {
        width?: number,
        height?: number,
        left?: number,
        bottom?: number,
        top?: number,
    }) { };//信息流
    /**
     * 隐藏信息留广告
     */
    public hideFeedAd() { };
    /**
     * 展示隐私政策
     * @param success 回调
     */
    public showPrivacy(success: (boo: any) => void) { success && success(true); }
    /**
     * 获取用户信息
     */
    public getUserInfo(success?: (data: any) => void, fail?: (errmsg: string) => void): Promise<any> {
        return new Promise<any>((resolve: any, reject: any) => {
            resolve(null);
            success && success(null);
        });
    };

    protected _shareList: Array<Array<ShareListType>> = [];
    public setShareList(list: Array<ShareListType>) { }
    /**
     * 分享
     * @param param 参数
     */
    public abstract share(type: ShareType, param: any, success?: () => void, fail?: (errmsg: string) => void): void;

    private _appId: string = "";
    /**
     * @description 获取对应平台的appid
     * @author 吴建奋
     * @date 2020-04-04
     * @returns {string}
     * @memberof BaseSdk
     */
    public getAppId(): string {
        return this._appId;
    }
    /**
     * @description 设置平台appid
     * @author 吴建奋
     * @date 2020-04-04
     * @param {string} appid
     * @returns
     * @memberof BaseSdk
     */
    public setAppId(appid: string) {
        this._appId = appid;
        return this;
    }

    private _openId: string = "";
    public getOpenId(): string {
        return this._openId;
    }

    public setOpenId(openid: string) {
        this._openId = openid;
        return this;
    }

    protected bmsVo:any = null;
    public setBmsVo(res:Object){
        this.bmsVo = res;
    }

    /**
     * 震动
     * @param type 
     */
    public vibrate(type: number = 0) {

    }

    /**
     * 创建盒子更多游戏
     * @param adId id
     * @param node 挂在节点
     */
    public createAppBox(adId: string, node?: any) {

    }
    /**
     * 展示更多游戏
     * @param adId id
     */
    public showAppBox(adId: string) {

    }

    /**
     * 预加载激励视频
     */
    public preLoadRewardVideo() {

    }

    /**
     * 商店评分
     * @param path 跳转路径
     */
    public goRate(path?: string): void {

    }

    /**
     * 登录完成
     */
    public setLoginFinish(): void {

    }

    public toPay(): void {

    }

    public toRestorePay(): void {

    }

    public getNativeAdInfo() {
        return null;
    }

    /**
     * 显示原生插屏
     */
     public showNativeFullVideoAD(id: string) {

    }

    public nativeAdRefresh(){
        
    }

    public toShareFaceBook(call?:Function){}
}

export enum VideoAdCode {
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

export enum ShareType {
    //发起挑战
    SHARE_CHALLENGE = 1,
    //群分享续命
    SHARE_GROUP = 2,
    //普通分享
    SHARE_NORMAL = 3,
    //分享获得奖励
    SHARE_REWARD = 4,
    //胜利炫耀
    SHARE_VICTORY = 5,
    //分享成绩
    SHARE_SORCE = 6,
    //群排行榜
    SHARE_RANK = 7,
    //求助
    SHARE_HELP = 8,
    //其它
    SHARE_OTHER = 9,
}

export interface ShareListType {
    id: number,
    position: ShareType,
    title: string,
    weight: number,
    image: string,
    flag: string,
}