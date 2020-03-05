import BBCache from "../../../packages/fw-gjj/FrameWork/fw_gjj_framework/util/fw_gjj_BBCache";
import { LocalStorageObject } from "../../../packages/fw-gjj/FrameWork/fw_gjj_framework/util/fw_gjj_LocalStorageObject";
import { GameConst } from "../config/yxj_gjj_const";

export function getGBB_ExtendPropertys() {
    let eps: { [name: string]: BBCache<any> } = Object.create(null);
    for (const name in bbDict) eps[name] = new BBCache(name, bbDict[name]);
    return eps;
}
export function initLocalStorageData(): fw._private.data.LocalStorageData {
    let lsd: any = Object.create(null);
    lsd.resetAll = function () { for (const name in lsd) lsd[name].reset && lsd[name].reset(); }
    lsd.clearAll = function () { for (const name in lsd) lsd[name].clear && lsd[name].clear(); }
    for (const name in lsdDict) lsd[name] = new LocalStorageObject(GameConst.AppConst.PROJECT_CODE + "_zhb_" + name, lsdDict[name]);
    clearDailyLSD(lsd);
    return lsd;
}

function clearDailyLSD(lsd: fw._private.data.LocalStorageData) {
    let today = fw.Util.getHumanDate();
    console.log(lsd.lastPlayDate.value);
    if (lsd.lastPlayDate.value === today) return;
    console.log("清除每日数据");
    lsd.shareCount.reset();
    lsd.shareGetGoldCount.reset();
    lsd.videoGetGoldCount.reset();
    lsd.videoAdCount.reset();
    lsd.getKeyCountByShareVideo.reset();
    lsd.lastPlayDate.value = today;
}

/** 声明本地储存的数据和默认值(需要和 data_API.d.ts 同步) */
let lsdDict = {
    lastPlayDate: () => 0,
    videoAdCount: () => 0,
    shareCount: () => 0,
    isRedBagPlayer: () => null,
    getKeyCountByShareVideo: () => 0,
    shareGetGoldCount: () => 0,
    videoGetGoldCount: () => 0,
    getRedbagLevel: () => Object.create(null),
    cashStartTime: () => 0,
    cashTotalTime: () => 0,
    cashMoney: () => 0,
    hasUploadUsedKey: () => false,
    usedKey: () => 0,
}

/** 声明全局黑板的数据(需要和 data_API.d.ts 同步) */
let bbDict = {
    bms_shareConfig: [],
    bms_tofuConfig: [],
    bms_launchConfig: { "shareVersion": "6.7.2", "reduce": 0.9, "level2room": 1 },

    bms_token: undefined,
    bms_isNew: undefined,
    bms_ipShield: true,
    sys_openId: undefined,
}
