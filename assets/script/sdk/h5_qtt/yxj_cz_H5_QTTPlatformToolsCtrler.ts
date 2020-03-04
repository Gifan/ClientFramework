import IPlatformToolsCtrler from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IPlatformToolsCtrler";
export default class H5_QTTPlatformToolsCtrler implements IPlatformToolsCtrler {
    showKefu() { }
    showImage(url: string) { }
    jumpApp(appId: string, path?: string, extraData?: PathObj, onCpl?: (failReason?: string) => void, envVersion?: "develop" | "trial" | "release") {
        console.log('------跳转', appId);
        if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {//判断是否是源生平台并且是否是iOS平台 
            console.log('跳转', appId);
            jsb.reflection.callStaticMethod("AppController", "jumpToAppWithID:", appId);
        }
    }
}