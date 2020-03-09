import SOVHandler_Base from "./yxj_gjj_SOVHandler";
import { Const } from "../../../config/Const";

export default class SOVHandler_H5_UC extends SOVHandler_Base {

    get isIpShield(): boolean { return true; };
    protected _maxVideoCount = 999;

    customShare(title: string, spfOrPath: string | cc.SpriteFrame, query?: PathObj, arg?: any) {
        fw.sdk.share({title:title});
    }

    commonShare(type?: string, query?: PathObj, arg?: any) {
        let cf = this._getRandomConfig();
        fw.sdk.share({title:cf.title});
    }

    cbShare(onCpl: (failReason?: string) => void, type?: string, query?: PathObj, arg?: any) {
        let config = this._getRandomConfig();
        console.error('UCcbShare----')
        fw.cls.sov.video(Const.VideoADType.TIPS_KEY, s => onCpl(s));
    }
}