import { MVC } from "../../framework/MVC";
import { Const } from "../../config/Const";

export default class SettingModel extends MVC.BaseModel {

    private static _instance: SettingModel = null;
    public muteMusic: boolean = true;     //屏蔽音乐
    public muteAudio: boolean = true;     //屏蔽音效
    private designSize: cc.Size = null;

    public constructor() {
        super();
        if (SettingModel._instance == null) {
            SettingModel._instance = this;
        }
    }
    public reset(): void {

    }

    public initSetting(data: any) {
        if (data === null) {
            return;
        }
        this.muteMusic = data.music;
        this.muteAudio = data.audio;
    }

    public static get getInstance(): SettingModel {
        if (SettingModel._instance == null) {
            SettingModel._instance = new SettingModel();
        }
        return SettingModel._instance;
    }

    /**
     * 获取实际的设计分辨率
     */
    public getRealDesignSize(): cc.Size {
        if (!this.designSize) {
            let size = cc.view.getCanvasSize();
            cc.view.getFrameSize();
            if (size.height / size.width <= 1.6) {
                let realwidth = Const.designHeight * size.width / size.height;
                this.designSize = new cc.Size(realwidth, cc.winSize.height);
            } else {
                let realheight = Const.designWidth * size.height / size.width;
                this.designSize = new cc.Size(cc.winSize.width, realheight);
            }
        }
        return this.designSize;
    }
}