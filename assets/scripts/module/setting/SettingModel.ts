import { MVC } from "../../framework/MVC";
import { Const } from "../../config/Const";
export default class SettingModel extends MVC.BaseModel {

    private static _instance: SettingModel = null;
    public muteMusic: boolean = false;     //屏蔽音乐
    public muteAudio: boolean = false;     //屏蔽音效
    public muteShake: boolean = false;     //屏蔽震动
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
        this.muteMusic = !!data.music;
        this.muteAudio = !!data.audio;
        this.muteShake = !!data.shake;
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
        }
        return this.designSize;
    }

    public serialize(): string {
        let data = {
            music: this.muteMusic,
            audio: this.muteAudio,
            shake: this.muteShake,
        }
        return JSON.stringify(data);
    }
}