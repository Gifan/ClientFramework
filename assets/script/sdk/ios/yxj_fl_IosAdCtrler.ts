import IADCtrler, { BannerADStyle, IBanner, VideoADFailCode } from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IADCtrler";
import sound_manager from "../../ctrler/yxj/cheese_sound_manager";
declare var window:any;
export default class IosAdCtrler implements IADCtrler {
    onPlayEnd: (notCplReason?: string, failCode?: VideoADFailCode) => void
    /** Ios 广告控制器的初始化流程 */


    protected _ccCvsW: number; // ccCanvasWidth
    protected _ccCvsH: number; // ccCanvasHeight
    protected _wxSrnW: number; // wxScreenWidth
    protected _wxSrnH: number; // wxScreenHeight
    protected _cc2wxScale: number;
    protected _wx2ccScale: number;
    protected _minCCWidth: number;



    constructor() {

        let w = window["jsb"] && window["jsb"].reflection && jsb.reflection.callStaticMethod("AppController", "getViewWidth");
        let h = window["jsb"] && window["jsb"].reflection && jsb.reflection.callStaticMethod("AppController", "getViewHeight");
        let wxSysInfo = { screenWidth: w, screenHeight: h };
        this._wxSrnW = wxSysInfo.screenWidth;
        this._wxSrnH = wxSysInfo.screenHeight;
        this._ccCvsW = cc.Canvas.instance.node.width;
        this._ccCvsH = cc.Canvas.instance.node.height;
        this._cc2wxScale = wxSysInfo.screenHeight / this._ccCvsH;
        this._wx2ccScale = this._ccCvsH / wxSysInfo.screenHeight;
        this._minCCWidth = 300 * this._wx2ccScale;



        window.iOSSendMsg = (str) => {

            // console.log('ios oc传过来的' + str, '------', common.isSoundOn, '-*****', common.bgmId)

            if (str == 'playAds') {
                // cc.director.pause()
                // if( common.isSoundOn != 3 ){
                //     console.log('暂停音乐',common.bgmId);
                //     // cc.audioEngine.pause(common.bgmId); 
                //     cc.audioEngine.pauseAll();

                // }
                sound_manager.pause_music();
                cc.director.pause();
                cc.game.pause();



            }


            if (str == 'playAdsEnd' || str == 'unityAds1') {
                cc.director.resume();
                cc.game.resume();
                // }, 6000);
                sound_manager.resume_music();

                if (str == 'unityAds1') {
                    sound_manager.resume_music();
                    console.log('[IosAdCtrler][unityAds1] 看完广告')

                    if (this.onPlayEnd) this.onPlayEnd()
                }

                if (str == 'unityAds0') {
                    sound_manager.resume_music();
                    console.log('[IosAdCtrler][unityAds0] 未完整观看广告')

                    if (this.onPlayEnd) this.onPlayEnd('未完整观看广告', VideoADFailCode.NOT_COMPLITE)

                }

            }

            return 'abcd'
        }




        cc.game.on(cc.game.EVENT_SHOW, () => {
            console.log('回到游戏')
            cc.director.resume();
            cc.game.resume();

        })

    }

    setBid(bid: string) {

    }



    //#region [video]


    /** 展示视频广告
     * @param onPlayEnd 结束回调方法
     * @param onPlayEnd.notCplReason 广告观看失败的文案 (正确观看时传入 : "" / null / undefined )
     * @param onPlayEnd.failCode 失败类型, 用于判断具体的错误类型 (传入 VideoADFailCode.xxxx)
     * @param type 位置标记(标志具体哪个业务发起的广告拉取)
     */
    showVideoAD(onPlayEnd: (notCplReason?: string, failCode?: VideoADFailCode) => void, type: string) {
        console.error('showVideoAD')
        //调用APPController类中的Share方法，并且传递参数
        window["jsb"] && window["jsb"].reflection && jsb.reflection.callStaticMethod("AppController", "showAds");
        this.onPlayEnd = onPlayEnd;

    }

    //#endregion [video]

    //#region [banner]

    showBannerAd_withNode(type: string, node: cc.Node, onShow: () => void) { /* 留待实现 */
        let pos = node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        var top = ((this._ccCvsH - pos.y) - node.height * (1 - node.anchorY)) * this._cc2wxScale;
        console.log('[IosAdCtrler][showBannerAd_withNode]', top);
        window["jsb"] && window["jsb"].reflection && jsb.reflection.callStaticMethod("AppController", "showBannerAds");
    }
    showBannerAd_withStyle(type: string, style: BannerADStyle, onShow: () => void) { /* 留待实现 */
        window["jsb"] && window["jsb"].reflection && jsb.reflection.callStaticMethod("AppController", "showBannerAds1");
    }
    showInsertAd(type: string) {
        console.log('[IosAdCtrler][showInsertAd]', type)
        this.onPlayEnd = null;
        window["jsb"] && window["jsb"].reflection && jsb.reflection.callStaticMethod("AppController", "fullscreenAds");
    }
    hideBannerAd() { /* 留待实现 */
        console.log('[IosAdCtrler][hideBannerAd]');
        window["jsb"] && window["jsb"].reflection && jsb.reflection.callStaticMethod("AppController", "hiddenBanner");
    }
    destoryBannerAd() { /* 留待实现 */
        console.log('[IosAdCtrler][destoryBannerAd]');
        window["jsb"] && window["jsb"].reflection && jsb.reflection.callStaticMethod("AppController", "hiddenBanner");
    }
    createBannerAd(type?: string, style?: BannerADStyle, args?: any): IosBanner {
        window["jsb"] && window["jsb"].reflection && jsb.reflection.callStaticMethod("AppController", "showBannerAds1");
        return new IosBanner(type, style, args);
    }

    //#endregion [banner]
}
class IosBanner implements IBanner {
    /** Banner 广告对象的初始化流程 */
    constructor(type?: string, style?: BannerADStyle, args?: any) { /* 留待扩展 */ }
    /** 指示广告是否到达可以展示的状态(如加载/出错等导致) */
    canShow: boolean;
    /** 展示此广告 */
    show() { /* 留待实现 */ }
    /** 隐藏此广告 */
    hide() { /* 留待实现 */ }
    /** 删除此广告 */
    dispose() { /* 留待实现 */ }
    /** 此广告的加载完成回调 */
    onLoad(cb: () => void) { /* 留待实现 */ }
    /** 此广告的异常回调 */
    onError(cb: (e: Error) => void) { /* 留待实现 */ }
}