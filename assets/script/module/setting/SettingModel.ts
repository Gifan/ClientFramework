import { MVC } from "../../framework/MVC";
import { Const } from "../../config/Const";
import { Log } from "../../framework/Log";

export default class SettingModel extends MVC.BaseModel {

    private static _instance: SettingModel = null;
    public muteMusic: boolean = true;     //屏蔽音乐
    public muteAudio: boolean = true;     //屏蔽音效
    private designSize: any = null;

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
    public getRealDesignSize(): any {
        if (!this.designSize) {
            let srcScaleForShowAll = Math.min(
                cc.view.getCanvasSize().width / Const.designWidth,
                cc.view.getCanvasSize().height / Const.designHeight
            );
            let realWidth1 = Const.designWidth * srcScaleForShowAll;
            let realHeight1 = Const.designHeight * srcScaleForShowAll;
            let widthratio = cc.view.getCanvasSize().width / realWidth1;
            let heightratio = cc.view.getCanvasSize().height / realHeight1;
            let width = Const.designWidth * widthratio;
            let height = Const.designHeight * heightratio;
            this.designSize = { height: height, width: width, radioHeight: heightratio, radioWidth: widthratio };
            // if (size.height / size.width <= 1.6) {
            //     let realwidth = Math.ceil(Const.designHeight * size.width / size.height);
            //     let radioWidth = realwidth / Const.designWidth;
            //     this.designSize = { height: cc.winSize.height, width: realwidth, radioWidth: radioWidth, radioHeight: 1 };
            // } else {
            //     let realheight = Math.ceil(Const.designWidth * size.height / size.width);
            //     let radioHeight = realheight / Const.designHeight;
            //     this.designSize = { height: realheight, width: cc.winSize.width, radioWidth: 1, radioHeight: radioHeight };
            // }
        }
        return this.designSize;
    }

    public serialize(): string {
        let data = {
            music: this.muteMusic,
            audio: this.muteAudio,
        }
        return JSON.stringify(data);
    }
}