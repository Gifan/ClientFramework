import IPlatformToolsCtrler from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IPlatformToolsCtrler";
import { Const } from "../../config/Const";
let common = require('zqddn_zhb_Common');
let swan = window["swan"];
export default class BdPlatformToolsCtrler implements IPlatformToolsCtrler {
    constructor() {
        this.onAntiAddiction();
        this.showAddToMyGameGuide();
    }
    showKefu() { console.log(Const.PanelName.KEFU, this._showKefu); }
    protected _showKefu() {
        if (typeof swan.openCustomerServiceConversation !== "function")
            return console.log("版本太旧了哦，请升级百度App");
        swan.openCustomerServiceConversation();
    }
    showImage(url: string) {
        if (typeof swan.previewImage !== "function")
            return console.log("百度App版本太旧了哦，有空更新一下吧");
        swan.previewImage({ urls: [url] });
    }
    jumpApp(appId: string, path?: string, extraData?: PathObj, onCpl?: (failReason?: string) => void, envVersion?: "develop" | "trial" | "release") {

        if (typeof swan.navigateToMiniProgram !== "function")
            return console.log("百度App版本太旧了哦，有空更新一下吧");

        swan.navigateToMiniProgram({
            appId,
            appKey: appId, // 百度临时
            path,
            extraData,
            envVersion: 'release',
            success: () => onCpl && onCpl(),
            fail: () => onCpl && onCpl("跳转失败"),
        });
    }
    showAddToMyGameGuide() {
        console.log("[BdPlatformToolsCtrler][showAddToMyGameGuide]进入游戏3分钟后显示添加到我的小程序引导");
        setTimeout(() => { fw.sdk.showAddToMyGameGuide(Const.GuideType.BAR); }, 180 * 1000)
    }


    onAntiAddiction() {
        let info = swan.getSystemInfoSync();
        if (info.platform != "android") return console.log("[BdPlatformToolsCtrler][onAntiAddiction]非安卓平台不做百度防沉迷限制");
        if (!swan.getAntiAddiction) return console.log("[BdPlatformToolsCtrler][onAntiAddiction]低版本不做百度防沉迷限制");
        let api = swan.getAntiAddiction();
        console.log("[BdPlatformToolsCtrler][onAntiAddiction]开启防沉迷监听")
        api.onAntiAddiction(({ state, msg }) => {
            console.log("[BdPlatformToolsCtrler][onAntiAddiction]state: ", state);
            console.log("[BdPlatformToolsCtrler][onAntiAddiction]msg: ", msg);
            let time = 20;
            let title = "健康提示";
            let info;
            switch (state) {
                case 10001:
                    info = "健康提示，您今日游戏时长已达到90分钟，为了您的身心健康，请明天再来";
                    break;
                case 10002:
                    info = "健康提示，您今日游戏时长已达到180分钟，为了您的身心健康，请明天再来";
                    break;
                case 10003:
                    info = "健康提示，每日22:00至次日8:00禁止未成年人游戏，为了您的身心健康，请明天再来哈。晚安，好梦！";
                    break;
            }
            console.log("[BdPlatformToolsCtrler][onAntiAddiction]今日游戏时间达到上限，20秒后进入防沉迷限制")
            setTimeout(() => {
                var data = {
                    /** 面板的内容文字, 不传则隐藏节点 */
                    msgText: info,
                    /** yes选项按键上的文字, 不传则显示'同意' */
                    yesText: "我知道了",
                    /** no选项按键上的文字, 不传则显示'取消' */
                    noText: "退出",
                    /** yes选项按键按下时触发的回调, 不传则关闭面板, 处理回调后默认关闭面板, 回调中返回 true 可以保持面板不关闭 */
                    yesCB: () => {
                        console.log("点击确定退出游戏");
                        swan && swan.exit();
                    },
                    /** no选项按键按下时触发的回调, 不传则关闭面板, 处理回调后默认关闭面板, 回调中返回 true 可以保持面板不关闭 */
                    noCB: () => {
                        console.log("点击取消退出游戏");
                        swan && swan.exit();
                    },
                }
                common.sceneMgr.showChoosePanel(data);
            }, time * 1000);
        });
    }

    acceleCallback: fw.cb1<boolean>;
    accelerometerType: string;
    addAccelerometerEvent(type: string, cb: fw.cb1<boolean>) {
        this.accelerometerType = type;
        this.acceleCallback = cb;
        console.log("[BdPlatformToolsCtrler][addAccelerometerEvent]", this.accelerometerType, Const.AcceleType.SIDE_LIE_TOWARD_RIGHT, this.acceleCallback);
        swan.startAccelerometer({});
        swan.onAccelerometerChange(this._onAccelerometerEvents.bind(this));
    }
    _onAccelerometerEvents(res) {
        console.log("[BdPlatformToolsCtrler][onAccelerometerEvents]", JSON.stringify(res));
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
                if (Math.abs(res.x) > 1.3 || Math.abs(res.y) > 1.3 || Math.abs(res.z) > 1.3) { //摇晃设备
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

                if (Math.abs(res.x) < 0.5 && Math.abs(res.y) < 0.5 && Math.abs(res.z) > 1.3) { //设备上抛
                    flag = true;
                } else {
                    flag = false;
                }
                break;
            default:
                console.error("[BdPlatformToolsCtrler][_onAccelerometerEvents]" + "typeError:" + this.accelerometerType);
                break;
        }
        this.acceleCallback && this.acceleCallback(flag);
    }
    stopAccelerometerEvent() {
        console.log("[BdPlatformToolsCtrler][stopAccelerometerEvent]");
        this.acceleCallback = null;
        swan.stopAccelerometer({});
    }//停止加速度计监听
}