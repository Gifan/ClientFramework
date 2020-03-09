import { Config } from "./config/fw_gjj_Config";
import SdkMgr from "./sdk/fw_gjj_SdkMgr";
import Util from "./util/fw_gjj_Util";
import BlackBoard from "./util/fw_gjj_BlackBoard";

declare var window:any;
export default class Framework {
    Platform = Platform;
    Util = Util;
    bb: BlackBoard<any>;
    sdk: SdkMgr;
    pf;
    static _instance: Framework;;
    static get Instance() {
        if (!Framework._instance)
            Framework._instance = new Framework();
        return Framework._instance;
    }
    startUp(config: Config.FrameWorkConfig) {

        // console.log("[Framework][startUp]", config)
        window["fw"] = this;
        this.pf = config.platform;
        this.bb = new BlackBoard<any>(true);
        this.sdk = new SdkMgr(config.sdkMgrConfig);
        console.log("Platform", this.pf, this.sdk);
        console.log("isUnkown", this.isUnkown);
        console.log("isWxLike", this.isWxLike);
        console.log("isNative", this.isNative);
        console.log("isBD", this.isBD);
        console.log("isQQ", this.isQQ);
        console.log("isIOS", this.isIOS);
        console.log("isANDROID", this.isANDROID);
        console.log("isANDROID_NORMAL", this.isANDROID_NORMAL); 
        console.log("isANDROID_SIX_K_PLAY", this.isANDROID_SIX_K_PLAY);
        console.log("isANDROID_WONDER_BOX", this.isANDROID_WONDER_BOX);
        console.log("isANDROID_YIYU", this.isANDROID_YIYU); 
	    console.log("isANDROID_TAPTAP", this.isANDROID_TAPTAP); 
        console.log("isANDROID_MTG", this.isANDROID_MTG); 
        console.log("isANDROID_XM", this.isANDROID_XM); 
        console.log("isANDROID_OPPO", this.isANDROID_OPPO); 
        console.log("isANDROID_VIVO", this.isANDROID_VIVO); 
        console.log("isTOUTIAO", this.isTOUTIAO);
        console.log("isZJTD", this.isZJTD);
        console.log("isXIAOMI", this.isXIAOMI);
        console.log("isH5_4399", this.isH5_4399);
        console.log("isH5_QTT", this.isH5_QTT);
        console.log("isH5_UC", this.isH5_UC);
        console.log("isH5_MOLI", this.isH5_MOLI);
        console.log("isSINA", this.isSINA);
        console.log("isOPPO", this.isOPPO);
        console.log("isZHANGYU", this.isZHANGYU);
        console.log("isVIVO", this.isVIVO);
        console.log("hasShareing", this.hasShareing);

        this._set_GBB_extendPropertys(this.bb, config.bbConfig);
    };

    get isCC1() {
        var ve = cc.ENGINE_VERSION;
        var vArr = ve.split('.');
        var vString = vArr[0];
        return vString[vString.length - 1] == '1';
    }
    get isCC2() {
        var ve = cc.ENGINE_VERSION;
        var vArr = ve.split('.');
        var vString = vArr[0];
        return vString[vString.length - 1] == '2';
    }
    get isUnkown() { return this.pf === undefined; }
    get isWxLike() {
        return this.pf === Platform.WECHAT_GAME
            || this.pf === Platform.BAIDU_GAME
            || this.pf === Platform.TOUTIAO
            || this.pf === Platform.QQ_MINI
            ;
    }
    get isNative() { return this.pf === Platform.NV_ANDROID || this.pf === Platform.NV_IPHONE; }
    get isWX() { return this.pf === Platform.WECHAT_GAME; }
    get isBD() { return this.pf === Platform.BAIDU_GAME }
    get isQQ() { return this.pf === Platform.QQ_MINI; }
    get isIOS() { return this.pf === Platform.NV_IPHONE; }
    get isANDROID_NORMAL() { return this.pf === Platform.NV_ANDROID; }   //Ô­Éú°²×¿
    get isANDROID() { return this.pf === Platform.NV_ANDROID 
        || this.pf === Platform.NV_ANDROID_SIX_K_PLAY
        || this.pf === Platform.NV_ANDROID_WONDER_BOX
        || this.pf === Platform.NV_ANDROID_YIYU
        || this.pf === Platform.NV_ANDROID_LING_YOU
        || this.pf === Platform.NV_ANDROID_MTG
        || this.pf === Platform.NV_ANDROID_TAPTAP
        || this.pf === Platform.NV_ANDROID_XM
        || this.pf === Platform.NV_ANDROID_VIVO
        || this.pf === Platform.NV_ANDROID_OPPO;
    } 
    get isANDROID_SIX_K_PLAY() { return this.pf === Platform.NV_ANDROID_SIX_K_PLAY; } 
    get isANDROID_WONDER_BOX() { return this.pf === Platform.NV_ANDROID_WONDER_BOX; } 
    get isANDROID_YIYU() { return this.pf === Platform.NV_ANDROID_YIYU; } 
    get isANDROID_LING_YOU() { return this.pf === Platform.NV_ANDROID_LING_YOU; } 
    get isANDROID_MTG() { return this.pf === Platform.NV_ANDROID_MTG; } 
    get isANDROID_TAPTAP() { return this.pf === Platform.NV_ANDROID_TAPTAP; } 
    get isANDROID_XM() { return this.pf === Platform.NV_ANDROID_XM; } 
    get isANDROID_VIVO() { return this.pf === Platform.NV_ANDROID_VIVO; } 
    get isANDROID_OPPO() { return this.pf === Platform.NV_ANDROID_OPPO; } 
    get isTOUTIAO() { return this.pf === Platform.TOUTIAO; }
    get isZJTD() { return this.isTOUTIAO }
    get isXIAOMI() { return this.pf === Platform.XIAOMI_GAME; }
    get isH5_4399() { return this.pf === Platform.H5_4399; }
    get isH5_QTT() { return this.pf === Platform.H5_QTT; }
    get isH5_UC() { return this.pf === Platform.H5_UC; }
    get isH5_MOLI() { return this.pf === Platform.H5_MOLI; }
    get isSINA() { return this.pf === Platform.SINA; }
    get isOPPO() { return this.pf === Platform.OPPO_GAME; }
    get isZHANGYU() { return this.pf === Platform.H5_ZHANG_YU; }
    get isVIVO() { return this.pf === Platform.VIVO_GAME; }
    get hasShareing() { return !this.isOPPO && !this.isH5_QTT && !this.isZHANGYU && !this.isVIVO }
    get isRedbagPlayer() { return fw.lsd.isRedBagPlayer.value }
    private _set_GBB_extendPropertys(bb: fw.BlackBoard, bbc: Config.BlackBoardConfig) {
        let eps = bbc.extendPropertys;
        if (!eps) return;
        for (const name in eps) {
            const p = eps[name];
            bb[name] = p;
        }
    }
}

export enum Platform {
    UNKNOWN,
    WECHAT_GAME,
    BAIDU_GAME,
    QQ_MINI,
    NV_ANDROID,
    NV_ANDROID_SIX_K_PLAY,
    NV_ANDROID_WONDER_BOX,
    NV_ANDROID_YIYU,
    NV_ANDROID_LING_YOU, 
    NV_ANDROID_TAPTAP,
    NV_ANDROID_MTG,
    NV_ANDROID_XM,
    NV_ANDROID_VIVO,
    NV_ANDROID_OPPO,
    NV_IPHONE,
    BS_ANDROID,
    BS_IPHONE,
    TOUTIAO,
    H5_4399,
    OPPO_GAME,
    H5_QTT,
    H5_MOLI,
    H5_UC,
    SINA,
    H5_ZHANG_YU,
    VIVO_GAME,
    XIAOMI_GAME
}