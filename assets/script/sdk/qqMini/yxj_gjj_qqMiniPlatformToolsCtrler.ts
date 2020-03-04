import IPlatformToolsCtrler from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IPlatformToolsCtrler";
let common = require('zqddn_zhb_Common');
export default class qqMiniPlatformToolsCtrler implements IPlatformToolsCtrler {
    currentSystem: string;
    isNewAccelerometer: boolean;
    constructor() {
        wx.getSystemInfo({
            success: (res) => {
                this.currentSystem = res.platform;
                this.isNewAccelerometer = common.compareVersion(res.version, '8.1.5') >= 0;
                console.log("[qqMiniPlatformToolsCtrler][constructor]:", res.version, this.currentSystem, this.isNewAccelerometer);
            },
            fail: (res) => {
                console.log("getSystem fail", res)
            }
        })
    }
    showKefu() { /*fw.ui.showPanel(cst.PanelName.KEFU, this._showKefu);*/ }
    protected _showKefu() {

    }
    showImage(url: string) {
        // if (typeof wx.previewImage !== "function")
        //     return fw.ui.showToast("QQ版本太旧了哦，有空更新一下吧");
        wx.previewImage({ urls: [url] });
    }
    jumpApp(appId: string, path?: string, extraData?: PathObj, onCpl?: (failReason?: string) => void, envVersion?: "develop" | "trial" | "release") {

        // if (typeof wx.navigateToMiniProgram !== "function")
        //     return fw.ui.showToast("QQ版本太旧了哦，有空更新一下吧");


        wx.showModal({
            title: '温馨提示',
            content: '即将跳到别的小游戏',
            showCancel: true,//是否显示取消按钮
            cancelText: "取消",//默认是“取消”
            cancelColor: '#000000',//取消文字的颜色
            confirmText: "确定",//默认是“确定”
            confirmColor: '#3cc51f',//确定文字的颜色
            success: function (res) {
                if (res.cancel) {
                    //点击取消，wx.navigateBack
                } else {
                    wx.navigateToMiniProgram({
                        appId: appId,
                        path: path,
                        extraData: extraData,
                        envVersion: 'release',
                        success: (res) => {
                            console.log("跳转成功", res)
                            onCpl && onCpl()
                        },
                        fail: (res) => {
                            console.log("跳转失败", res)
                            onCpl && onCpl("跳转失败")
                        },
                        complete: (res) => { console.log("用户点击了跳转", res) }
                    });
                }
            },
            fail: function (res) {
                //接口调用失败的回调函数，wx.navigateBack
            },
            complete: function (res) {
                //接口调用结束的回调函数（调用成功、失败都会执行）
            },



        })
    }

    acceleCallback: fw.cb1<boolean>;
    accelerometerType: string;
    addAccelerometerEvent(type: string, cb: fw.cb1<boolean>) {
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
            case cst.AcceleType.ADOWN:
                if (this.currentSystem == "android" && !this.isNewAccelerometer) { //QQ小游戏才需要区分
                    if (res.x > -2 && res.x < 2 && res.y > -2 && res.y < 2 && res.z > -11 && res.z < -7) { //手机朝下(与水平面夹角0-35度)
                        flag = true;
                    } else {
                        flag = false;
                    }
                } else {
                    if (res.x > -0.8 && res.x < 0.8 && res.y > -0.5 && res.y < 0.2 && res.z > 0.5 && res.z < 1.1) { //手机朝下(与水平面夹角0-35度)
                        flag = true;
                    } else {
                        flag = false;
                    }
                }
                break;
            case cst.AcceleType.FRONT:
                    if(this.currentSystem == "android" && !this.isNewAccelerometer){ //QQ小游戏才需要区分
                        if(res.x > -1 && res.x < 1 && res.y > -2 && res.y < 2 && res.z > 8 && res.z < 11){ //手机正放
                            flag = true;
                        }else{
                            flag = false;
                        }
                    }else{
                        if(res.x > -0.15 && res.x < 0.05 && res.y > -0.15 && res.y < 0.05 && res.z > -1.15 && res.z < 0.05){ //手机正放
                            flag = true;
                        }else{
                            flag = false;
                        }
                    }
                break;
            case cst.AcceleType.HANDSTAND:
                    if(this.currentSystem == "android" && !this.isNewAccelerometer){ //QQ小游戏才需要区分
                        if(res.x > -1 && res.x < 1 && res.y > -10 && res.y < 2 && res.z > -8 && res.z < 8){ //手机倒立，且顶部指地
                            flag = true;
                        }else{
                            flag = false;
                        }
                    }else{
                        if(res.x > -0.4 && res.x < 0.4 && res.y > 0.1 && res.y < 1 && res.z > -1 && res.z < 0){ //手机倒立
                            flag = true;
                        }else{
                            flag = false;
                        }
                    }
                break;
            case cst.AcceleType.SHAKE:
                    if(this.currentSystem == "android" && !this.isNewAccelerometer){ //QQ小游戏才需要区分
                        if (Math.abs(res.x) > 6 && Math.abs(res.y) > 6 && Math.abs(res.z) > 6){ //摇晃手机
                            flag = true;
                        }else{
                            flag = false;
                        }
                    }else{
                        if (Math.abs(res.x) > 1.8 || Math.abs(res.y) > 1.8|| Math.abs(res.z) > 1.8){ //摇晃手机
                            flag = true;
                        }else{
                            flag = false;
                        } 
                    }
                break;
            case cst.AcceleType.SIDE_LIE_TOWARD_RIGHT:
                    if(this.currentSystem == "android" && !this.isNewAccelerometer){ //QQ小游戏才需要区分
                        if(res.x > -10 && res.x < -1 && res.y > -5 && res.y < 5 && res.z > 1 && res.z < 10){ //手机立起向右横
                            flag = true;
                        }else{
                            flag = false;
                        }
                    }else{
                        if(res.x > 0.3 && res.x < 1 && res.y > -0.3 && res.y < 1 && res.z > -1 && res.z < 0){ //手机立起向右横
                            flag = true;
                        }else{
                            flag = false;
                        }
                    }
                break;
            case cst.AcceleType.THROW:
                if (this.currentSystem == "android" && !this.isNewAccelerometer) { //QQ小游戏才需要区分
                    if (Math.abs(res.y) > 10 || Math.abs(res.z) > 10) { //手机上抛
                        flag = true;
                    } else {
                        flag = false;
                    }
                } else {
                    if (Math.abs(res.x) < 0.5 && Math.abs(res.y) < 0.5 && Math.abs(res.z) > 1.3) { //手机上抛
                        flag = true;
                    } else {
                        flag = false;
                    }
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