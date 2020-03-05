import IPlatformToolsCtrler from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IPlatformToolsCtrler";
export default class FakePlatformToolsCtrler implements IPlatformToolsCtrler {
    showKefu() { /*fw.ui.showPanel(Const.PanelName.KEFU, () => fw.ui.showNotify("本平台暂无客服功能"));*/ }
    showImage(url: string) {
        // fw.ui.showNotify({
        //     titleText: "本平台暂时无法展示图片",
        //     tipsMsg: "图片地址:\n" + url,
        // });
    }
    jumpApp(appId: string, path?: string, extraData?: PathObj, onCpl?: (failReason?: string) => void, envVersion?: "develop" | "trial" | "release") {
        // setTimeout(() => fw.ui.showChoose({
        //     titleText: "本平台暂时无法跳转",
        //     tipsMsg: "跳转id:\n" + appId + "\n跳转path:\n" + path,
        //     yesText: "模拟跳转",
        //     yesCB: () => { onCpl && onCpl(); return false },
        //     noText: "不跳转",
        //     noCB: () => { onCpl && onCpl("跳转失败"); return false },
        // }), 500);
    }
}