import SOVHandler_Wx from "./yxj_gjj_SOVHandler_wx";

export class SOVHandler_Bd extends SOVHandler_Wx {
    get isIpShield(): boolean { return true; };
    protected _maxVideoCount = 999;
    customShare(title: string, spfOrPath: string | cc.SpriteFrame, query?: PathObj, arg?: any) {
        this.commonShare(null, query, arg);
    }
}