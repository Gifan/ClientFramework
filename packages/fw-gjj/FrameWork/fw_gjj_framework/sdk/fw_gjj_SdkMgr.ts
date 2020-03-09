import { Config } from "../config/fw_gjj_Config";
import ILoginCtrler from "./fw_gjj_ILoginCtrler";
import IShareCtrler, { ShareInfo, ShareResult } from "./fw_gjj_IShareCtrler";
import IADCtrler, { BannerADStyle, VideoADFailCode } from "./fw_gjj_IADCtrler";
import IChannelCtrler, { ChannelType } from "./fw_gjj_IChannelCtrler";
import IPlatformToolsCtrler from "./fw_gjj_IPlatformToolsCtrler";

export default class SdkMgr {
    ChannelType = ChannelType;
    VideoADFailCode = VideoADFailCode;
    bannerTime: number = null;//刷新banner时间

    constructor(config: Config.SdkMgrConfig) {
        this.shareCtrler = config.shareCtrler;
        this.adCtrler = config.adCtrler;
        this.channelCtrler = config.channelCtrler;
        this.platfromCtrler = config.platformToolsCtrler;
    }

    loginCtrler: ILoginCtrler;
    login(successCB: (data: any) => void, failCB?: (msg: string) => void) {
        this.loginCtrler && this.loginCtrler.login(successCB, failCB);
    }

    shareCtrler: IShareCtrler;
    shareWX():void{  //分享到Android 微信
        this.shareCtrler && this.shareCtrler.shareWX && this.shareCtrler.shareWX();
    }
    shareQQ():void{   //分享到Android QQ
        this.shareCtrler && this.shareCtrler.shareQQ && this.shareCtrler.shareQQ(); 
    }
    share(shareInfo: ShareInfo, onCpl?: (rsl: ShareResult) => void): void;
    share(shareInfo: ShareInfo, customArg?: any, onCpl?: (rsl: ShareResult) => void): void {
        console.log("[SdkMgr][share]", shareInfo);
        if (shareInfo && !shareInfo.query && shareInfo.queryObj) shareInfo.query = fw.Util.objToPath(shareInfo.queryObj);
        this.shareCtrler && this.shareCtrler.share(shareInfo, customArg, onCpl);
    }

    shareInList(list: Array<ShareInfo>, elseInfo?: ShareInfo, successCB?: (res?: any) => void, failCB?: (res?: any) => void) {
        if (!list) return;
        let item = list[Math.floor(Math.random() * list.length)];
        if (!item) return;
        let shareInfo: ShareInfo = { title: item.title || "", imageUrl: item.imageUrl || "" };
        if (elseInfo) for (const key in elseInfo) shareInfo[key] = elseInfo[key];
        this.shareCtrler && this.shareCtrler.share(shareInfo, successCB, failCB);
    }
    shareIn2Lists(titles: Array<string>, imgUrls: Array<string>, elseInfo?: ShareInfo, successCB?: (res?: any) => void, failCB?: (res?: any) => void) {
        if (!titles || !imgUrls) return;
        let title = titles[Math.floor(Math.random() * titles.length)] || "";
        let imageUrl = imgUrls[Math.floor(Math.random() * imgUrls.length)] || "";
        let shareInfo: ShareInfo = { title, imageUrl };
        if (elseInfo) for (const key in elseInfo) shareInfo[key] = elseInfo[key];
        this.shareCtrler && this.shareCtrler.share(shareInfo, successCB, failCB);
    }

    adCtrler: IADCtrler;
    setBid(bid: string) {
        typeof (bid) === "string" && bid.length >= 4 && this.adCtrler && this.adCtrler.setBid && this.adCtrler.setBid(bid);
    }

    showVideoAD(onPlayEnd: (notCplReason?: string, failCode?: VideoADFailCode) => void, type?: string) {
        console.log("[SdkMgr][showVideoAD]", type);
        this.adCtrler && this.adCtrler.showVideoAD(onPlayEnd, type);
    }
    showInsertAd(type: string) {
        console.log("[SdkMgr][showInsertAd]");
        this.adCtrler && this.adCtrler.showInsertAd && this.adCtrler.showInsertAd(type);
    };
    showSplashAd(type: string) {
        console.log("[SdkMgr][showSplashAd]");
        this.adCtrler && this.adCtrler.showSplashAd && this.adCtrler.showSplashAd(type);
    };
    createBannerAd(type: string, style?: BannerADStyle, args?: any) {
        console.log("[SdkMgr][creatBannerAd]", args);
        return this.adCtrler && this.adCtrler.createBannerAd(type, style, args);
    }
    showAddToMyGameGuide(type: string) {
        console.log("[SdkMgr][showAddToMyGameGuide]", type);
        if (this.adCtrler && this.adCtrler.showAddToMyGameGuide) {
            this.adCtrler.showAddToMyGameGuide(type);
            return;
        }
        console.error("[showAddToMyGameGuide][NoSupport]")
    };
    showBannerAd(type: string, onShow?: () => void);
    showBannerAd(type: string, node: cc.Node, onShow?: () => void);
    showBannerAd(type: string, style?: BannerADStyle, onShow?: () => void);
    showBannerAd(type: string, arg2?: BannerADStyle | cc.Node | (() => void), onShow?: () => void) {

        let nowTime = (new Date()).getTime();
        console.log("[SdkMgr][showBannerAd]", (nowTime - this.bannerTime) / 1000, nowTime, this.bannerTime);
        if (this.bannerTime) {
            if (nowTime - this.bannerTime > 50 * 1000) {
                this.destoryBannerAd();
                this.bannerTime = nowTime;
                console.log('banner刷新')
            }
        } else {
            this.bannerTime = nowTime;
        }
        if (!arg2)
            this.adCtrler && this.adCtrler.showBannerAd_withStyle(type, undefined, onShow);
        else if (typeof arg2 === "function")
            this.adCtrler && this.adCtrler.showBannerAd_withStyle(type, undefined, arg2);
        else if (arg2 instanceof cc.Node)
            this.adCtrler && this.adCtrler.showBannerAd_withNode(type, arg2, onShow);
        else
            this.adCtrler && this.adCtrler.showBannerAd_withStyle(type, arg2, onShow);
    }
    hideBannerAd() {
        console.log("[SdkMgr][hideBannerAd]");
        this.adCtrler && this.adCtrler.hideBannerAd && this.adCtrler.hideBannerAd();
    }
    destoryBannerAd() {
        console.log("[SdkMgr][destoryBannerAd]");
        this.adCtrler && this.adCtrler.destoryBannerAd && this.adCtrler.destoryBannerAd();
    }

    showFeedAd(node:cc.Node=null){
        console.log("[SdkMgr][showFeedAd]");
        this.adCtrler && this.adCtrler.showFeedAd && this.adCtrler.showFeedAd(node);
    }

    hideFeedAd(){
        console.log("[SdkMgr][hideFeedAd]");
        this.adCtrler && this.adCtrler.hideFeedAd && this.adCtrler.hideFeedAd();
    }

    sendWechatAuthRequest(){ //微信登录
        this.adCtrler && this.adCtrler.sendWechatAuthRequest && this.adCtrler.sendWechatAuthRequest();
    }

    postLevel(level:string,coin:string){ //上报用户等级金币
        this.adCtrler && this.adCtrler.postLevel && this.adCtrler.postLevel(level,coin);
    }

    withdraw(amount:string){ //提现 
        this.adCtrler && this.adCtrler.withdraw && this.adCtrler.withdraw(amount);
    }    

    getUserInfo(){  //获取用户信息
        this.adCtrler && this.adCtrler.getUserInfo && this.adCtrler.getUserInfo();
    }

    isWXAppInstalled():boolean{   //是否安装微信 
        if(this.adCtrler && this.adCtrler.isWXAppInstalled){
            return this.adCtrler.isWXAppInstalled();
        }
    }

    sendRequest(url:string,params:string){    
        if(this.adCtrler && this.adCtrler.sendRequest){
            return this.adCtrler.sendRequest(url,params);
        }
    }

    checkAppBox(onShow: () => void) {
        console.log("[SdkMgr][checkAppBox]");
        this.adCtrler && this.adCtrler.checkAppBox && this.adCtrler.checkAppBox(onShow);
    }

    showGameBox() {
        console.log("[SdkMgr][showGameBox]");
        this.adCtrler && this.adCtrler.showGameBox && this.adCtrler.showGameBox();
    }

    channelCtrler: IChannelCtrler;
    get channelData() { return this.channelCtrler && this.channelCtrler.data; }

    platfromCtrler: IPlatformToolsCtrler;
    showKefu() { this.platfromCtrler && this.platfromCtrler.showKefu(); }
    showImage(url: string) {
        this.platfromCtrler && this.platfromCtrler.showImage && this.platfromCtrler.showImage(url);
    }
    jumpApp(appId: string, path?: string, extraData?: PathObj, onCpl?: (failReason: string) => void, arg?: any) {
        console.log("appid", appId)
        this.platfromCtrler && this.platfromCtrler.jumpApp && this.platfromCtrler.jumpApp(appId, path, extraData, onCpl, arg);
    }

    addAccelerometerEvent(type: string, cb: fw.cb1<boolean>) {
        this.platfromCtrler && this.platfromCtrler.addAccelerometerEvent && this.platfromCtrler.addAccelerometerEvent(type, cb);
    }

    stopAccelerometerEvent() {
        this.platfromCtrler && this.platfromCtrler.stopAccelerometerEvent && this.platfromCtrler.stopAccelerometerEvent();
    }
}