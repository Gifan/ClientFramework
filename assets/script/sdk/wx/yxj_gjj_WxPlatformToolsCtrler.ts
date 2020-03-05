import IPlatformToolsCtrler from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IPlatformToolsCtrler";
import { Const } from "../../config/Const";
export default class WxPlatformToolsCtrler implements IPlatformToolsCtrler {
    showKefu() { /*fw.ui.showPanel(Const.PanelName.KEFU, this._showKefu);*/ }
    protected _showKefu() {
        // if (typeof wx.openCustomerServiceConversation !== "function")
        //     return fw.ui.showToast("版本太旧了哦，请升级微信");
        wx.openCustomerServiceConversation();
    }
    showImage(url: string) {
        // if (typeof wx.previewImage !== "function")
        //     return fw.ui.showToast("微信版本太旧了哦，有空更新一下吧");
        wx.previewImage({ urls: [url] });
    }
    jumpApp(appId: string, path?: string, extraData?: PathObj, onCpl?: (failReason?: string) => void, envVersion?: "develop" | "trial" | "release") {

        // if (typeof wx.navigateToMiniProgram !== "function")
        //     return fw.ui.showToast("微信版本太旧了哦，有空更新一下吧");

        wx.navigateToMiniProgram({
            appId,
            appKey: appId, // 百度临时
            path,
            extraData,
            envVersion: 'release',
            success: () => onCpl && onCpl(),
            fail: () => onCpl && onCpl("跳转失败"),
        });
    }

    acceleCallback: fw.cb1<boolean>;
    accelerometerType: string;
    addAccelerometerEvent(type: string, cb: fw.cb1<boolean>) {
        this.accelerometerType = type;
        this.acceleCallback = cb;
        console.log("[WxPlatformToolsCtrler][addAccelerometerEvent]", this.accelerometerType,Const.AcceleType.SIDE_LIE_TOWARD_RIGHT, this.acceleCallback);
        wx.startAccelerometer({});
        wx.onAccelerometerChange(this._onAccelerometerEvents.bind(this));
    }
    _onAccelerometerEvents(res) {
        // console.log("[WxPlatformToolsCtrler][onAccelerometerEvents]", JSON.stringify(res));
        let flag = false;
        switch (this.accelerometerType) {

            case Const.AcceleType.ADOWN:
                if (res.x > -0.8 && res.x < 0.8 && res.y > -0.5 && res.y < 0.2 && res.z > 0.5 && res.z < 1.1) { //设备朝下(与水平面夹角0-35度)
                    flag = true;
                } else {
                    flag = false;
                }
                break;
            case Const.AcceleType.FRONT:
                if (res.x > -0.15 && res.x < 0.05 && res.y > -0.15 && res.y < 0.05 && res.z > -1.15 && res.z < 0.05) { //设备正放
                    flag = true;
                } else {
                    flag = false;
                }
                break;
            case Const.AcceleType.HANDSTAND:
                if (res.x > -0.4 && res.x < 0.4 && res.y > 0.1 && res.y < 1 && res.z > -1 && res.z < 0) { //设备倒立
                    flag = true;
                } else {
                    flag = false;
                }
                break;
            case Const.AcceleType.SHAKE:
                if (Math.abs(res.x) > 0.96 || Math.abs(res.y) > 0.96 || Math.abs(res.z) > 1.1) { //摇晃设备
                    flag = true;
                } else {
                    flag = false;
                }
                break;
            case Const.AcceleType.SIDE_LIE_TOWARD_RIGHT:
                if (res.x > 0.3 && res.x < 1 && res.y > -0.3 && res.y < 1 && res.z > -1 && res.z < 0) { //设备立起向右横
                    flag = true;
                } else {
                    flag = false;
                }
                break;
            case Const.AcceleType.THROW:
                if (Math.abs(res.y) > 0.99 || Math.abs(res.z) > 0.99) { //设备上抛
                    flag = true;
                } else {
                    flag = false;
                }
                break;
            default:
                console.error("[WxPlatformToolsCtrler][_onAccelerometerEvents]"+"typeError:"+this.accelerometerType);
                break;
        }
        this.acceleCallback && this.acceleCallback(flag);
    }
    stopAccelerometerEvent() {
        console.log("[WxPlatformToolsCtrler][stopAccelerometerEvent]");
        this.acceleCallback = null;
        wx.stopAccelerometer({});
    }//停止加速度计监听
}