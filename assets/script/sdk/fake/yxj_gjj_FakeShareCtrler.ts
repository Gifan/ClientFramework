import IShareCtrler, { ShareInfo } from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IShareCtrler";
let common = require('zqddn_zhb_Common');
export default class FakeShareCtrler implements IShareCtrler {
    share(shareInfo: ShareInfo, onCpl?: (res?: any) => void): void {
        var data = {
            /** 面板的标题文字, 不传则显示'提示' */
            titleText: "提示",
            /** 面板的内容文字, 不传则隐藏节点 */
            msgText: "模拟分享",
            /** yes选项按键上的文字, 不传则显示'同意' */
            yesText: "分享成功",
            /** no选项按键上的文字, 不传则显示'取消' */
            noText: "分享失败",
            /** yes选项按键按下时触发的回调, 不传则关闭面板, 处理回调后默认关闭面板, 回调中返回 true 可以保持面板不关闭 */
            yesCB: () => { onCpl&&onCpl(); },
            /** no选项按键按下时触发的回调, 不传则关闭面板, 处理回调后默认关闭面板, 回调中返回 true 可以保持面板不关闭 */
            noCB: () => { onCpl&&onCpl("没有分享成功"); },
        }
        common.sceneMgr.showChoosePanel(data);
    }
}