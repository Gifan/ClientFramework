import IADCtrler, { VideoADFailCode, IBanner, BannerADStyle } from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IADCtrler";
import { commentToUS } from "../android/yxj_cz_AndroidGlobals";
let common = require('zqddn_zhb_Common');
export default class FakeAdCtrler implements IADCtrler {
    showVideoAD(onPlayEnd: (notCplReason?: string, failCode?: VideoADFailCode) => void) {
        var data = {
            /** 面板的标题文字, 不传则显示'提示' */
            titleText: "提示",
            /** 面板的内容文字, 不传则隐藏节点 */
            msgText: "假装看视频",
            /** yes选项按键上的文字, 不传则显示'同意' */
            yesText: "看完",
            /** no选项按键上的文字, 不传则显示'取消' */
            noText: "没看完",
            /** yes选项按键按下时触发的回调, 不传则关闭面板, 处理回调后默认关闭面板, 回调中返回 true 可以保持面板不关闭 */
            yesCB: () => { onPlayEnd && onPlayEnd() },
            /** no选项按键按下时触发的回调, 不传则关闭面板, 处理回调后默认关闭面板, 回调中返回 true 可以保持面板不关闭 */
            noCB: () => { onPlayEnd && onPlayEnd("没看完视频",VideoADFailCode.NOT_COMPLITE) },
        }
        common.sceneMgr.showChoosePanel(data);

    }
    //插屏
    showInsertAd(type: string) {
        console.log("[FakeAdCtrler][showInsertAd]", type)
        var data = {
            /** 面板的标题文字, 不传则显示'提示' */
            titleText: "提示",
            /** 面板的内容文字, 不传则隐藏节点 */
            msgText: "假装我是个插屏广告",
            /** yes选项按键上的文字, 不传则显示'同意' */
            yesText: "关闭",
            /** no选项按键上的文字, 不传则显示'取消' */
            noText: "关闭",
        }
        common.sceneMgr.showChoosePanel(data);
    }
    setBid(bid: string) {

    }
    createBannerAd(type?: string, style?: BannerADStyle, args?: any): IBanner { return null; }
    showBannerAd_withNode(type: string, node: cc.Node, onShow: () => void) {
        // common.sceneMgr.showTipsUI("本平台暂不支持banner广告");
        console.log("本平台暂不支持banner广告")
    }
    showBannerAd_withStyle(type: string, style: BannerADStyle, onShow: () => void) { common.sceneMgr.showTipsUI("本平台暂不支持banner广告"); }
    hideBannerAd() { }
    destoryBannerAd() { }
}