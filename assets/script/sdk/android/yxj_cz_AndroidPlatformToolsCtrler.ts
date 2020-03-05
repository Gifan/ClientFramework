import IPlatformToolsCtrler from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IPlatformToolsCtrler";
import { Const } from "../../config/Const";
export default class AndroidPlatformToolsCtrler implements IPlatformToolsCtrler {
    showKefu() { }
    showImage(url: string) { }
    jumpApp(appId: string, path?: string, extraData?: PathObj, onCpl?: (failReason?: string) => void, envVersion?: "develop" | "trial" | "release") {
        console.log('------跳转', appId);
        if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID) {//判断是否是源生平台并且是否是Android平台 
            console.log('跳转', appId);
            jsb.reflection.callStaticMethod("AppController", "jumpToAppWithID:", appId);
        }
    }
    acceleCallback: fw.cb1<boolean>;
    accelerometerType: string;
    addAccelerometerEvent(type: string, cb: fw.cb1<boolean>) {
        this.accelerometerType = type;
        this.acceleCallback = cb;
        cc.systemEvent.setAccelerometerEnabled(true);
        cc.systemEvent.setAccelerometerInterval(0.1);
    cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION, this._onAccelerometerEvents.bind(this), this);
    }
    _onAccelerometerEvents(res) {
        console.log("[ToutiaoPlatformToolsCtrler][onAccelerometerEvents]", JSON.stringify(res));
        let flag = false;
        switch (this.accelerometerType) {
            default: break;
            case Const.AcceleType.ADOWN:
                if (res.x > -0.2 && res.x < 0.8 && res.y > -0.2 && res.y < 1 && res.z > -1.2 && res.z < 0.5) { //设备朝下(与水平面夹角0-35度)
                    flag = true;
                } else {
                    flag = false;
                }
                break;
            case Const.AcceleType.FRONT:
                if (res.x > -0.15 && res.x < 0.15 && res.y > -0.15 && res.y < 0.05 && res.z > 0.8 && res.z < 1.2) { //设备正放
                    flag = true;
                } else {
                    flag = false;
                }
                break;
            case Const.AcceleType.HANDSTAND:
                if (res.x > -0.4 && res.x < 0.4 && res.y > 0.1 && res.y < 1 && res.z > 0.1 && res.z < 0.8) { //设备倒立
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
                if (res.x > 0.5 && res.x < 1.1 && res.y > -0.2 && res.y < 0.2 && res.z > -0.1 && res.z < 1) { //设备立起向右横
                    flag = true;
                } else {
                    flag = false;
                }
                break;
            case Const.AcceleType.THROW:
                    if (Math.abs(res.y) > 0.7 && Math.abs(res.z) > 0.7) { //手机上抛
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
        cc.systemEvent.off(cc.SystemEvent.EventType.DEVICEMOTION, this._onAccelerometerEvents, this);
        cc.systemEvent.setAccelerometerEnabled(false);
    }//停止加速度计监听
}