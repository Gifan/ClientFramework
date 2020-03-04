import SOVHandler_Base from "./yxj_gjj_SOVHandler";

export default class SOVHandler_Android extends SOVHandler_Base {

    get isIpShield(): boolean { return true; };
    protected _maxVideoCount = 999;

    customShare(title: string, spfOrPath: string | cc.SpriteFrame, query?: PathObj, arg?: any) {
        this._androidShare_bmsConfig(null);
    }

    commonShare(type?: string, query?: PathObj, arg?: any) {
        this._androidShare_bmsConfig(null);
    }

    cbShare(onCpl: (failReason?: string) => void, type?: string, query?: PathObj, arg?: any) {
        console.log("[SOVHandler_android][cbShare]");
        this._androidShare_bmsConfig(onCpl);
        
    }

    private _androidShare_bmsConfig(onCpl?: (failReason?: string) => void) {
        let config = this._getRandomConfig();
        if (!config) return onCpl && onCpl("素材还没准备好哦");
        this._androidShare_customConfig(config.title, config.image, onCpl);
    }

    private _androidShare_customConfig(
        title: string,
        image: string,
        onCpl?: (failReason?: string) => void,
    ) {
        let shareInfo: any = {
            title: title,
            imageUrl: image,
        };
        fw.sdk.share(shareInfo,null, (rsl) => { onCpl && onCpl(rsl.iSuccess ? null : "分享失败了鸭") });
    }
}
