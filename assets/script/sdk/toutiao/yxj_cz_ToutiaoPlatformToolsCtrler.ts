import IPlatformToolsCtrler from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IPlatformToolsCtrler";
import { Const } from "../../config/Const";
export default class ToutiaoPlatformToolsCtrler implements IPlatformToolsCtrler {
    constructor() {
        console.log("[ToutiaoPlatformToolsCtrler][constructor]");
    }
    showKefu() { }
    showImage(url: string) { }
    jumpApp(appId: string, path?: string, extraData?: PathObj, onCpl?: (failReason?: string) => void, envVersion?: "develop" | "trial" | "release") {
        console.log('------跳转', appId);
    }

    acceleCallback: fw.cb1<boolean>;
    accelerometerType: string;
    addAccelerometerEvent(type: string, cb: fw.cb1<boolean>) {
        console.log("[ToutiaoPlatformToolsCtrler][addAccelerometerEvent]", type, cb);
        this.accelerometerType = type;
        this.acceleCallback = cb;
        wx.startAccelerometer({});
        wx.onAccelerometerChange(this._onAccelerometerEvents.bind(this));
    }
    _onAccelerometerEvents(res) {
        console.log("[ToutiaoPlatformToolsCtrler][onAccelerometerEvents]", JSON.stringify(res));
        let flag = false;
        switch (this.accelerometerType) {
            default: break;
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
                if (Math.abs(res.x) > 0.6 && Math.abs(res.y) > 0.6 && Math.abs(res.z) > 0.6) { //摇晃设备
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
        }
        this.acceleCallback && this.acceleCallback(flag);
    }
    stopAccelerometerEvent() {
        this.acceleCallback = null;
        wx.stopAccelerometer({});
    }//停止加速度计监听
}