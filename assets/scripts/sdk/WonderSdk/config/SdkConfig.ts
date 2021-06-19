/**
 * 对应平台id
 */
export const EPlatform = cc.Enum({
    WEB_DEV: 1,
    NA_ANDROID: 2,
    NA_IOS: 3,
    WECHAT_GAME: 4,//微信小游戏
    BYTE_DANCE: 5,//字节跳动
    QQ: 6,//qq小游戏
    BAIDU: 7,//百度小游戏
    QTT_GAME: 8,//趣头条
    JKW_GAME: 9,//即可玩
    OPPO_ANDROID: 10,   // OPPO
    OPPP_MICRO: 11,     // OPPO 快游戏
    VIVO_MICRO: 12,     //vivo小游戏
    VIVO_ANDROID: 13,       // vivo
    XIAOMI_ANDROID: 14,      // xiaomi
    UC_MICRO: 15,
    GOOGLE_ANDROID: 16,      //谷歌android
    XIAOMI_MICRO: 17,//小米快游戏
    KWAI_MICRO: 18,//快手小游戏
    SSJJ_ANDROID: 19, //4399安卓
    MEIZU_MICRO: 21,
    HUAWEI_MICRO: 22,
    TAPTAP_ANDROID: 23,
    MMY_ANDROID: 24,
    HYKB_ANDROID:25,//好游快爆
    ANDROID_233:26,//233
    AMZ_ANDROID:27,//亚马逊安卓渠道
})

/**
 * 对应的平台渠道类名
 */
export const SdkClass = {
    [EPlatform.WEB_DEV]: "WebDev",
    [EPlatform.NA_ANDROID]: "JUHEAndroid",
    [EPlatform.TAPTAP_ANDROID]: "JUHEAndroid",
    [EPlatform.MMY_ANDROID]: "JUHEAndroid",
    [EPlatform.HYKB_ANDROID]: "JUHEAndroid",
    [EPlatform.ANDROID_233]:"JUHEAndroid",
    [EPlatform.NA_IOS]: "IOSSdk",
    [EPlatform.WECHAT_GAME]: "WeChatSdk",
    [EPlatform.BYTE_DANCE]: "ByteDance",
    [EPlatform.QQ]: "QQSdk",
    [EPlatform.BAIDU]: "BaiDuSdk",
    [EPlatform.QTT_GAME]: "QttGameSdk",
    [EPlatform.JKW_GAME]: "JkwGameSdk",
    [EPlatform.OPPO_ANDROID]: "OppoAndroidSdk",
    [EPlatform.OPPP_MICRO]: "OppoMicroSdk",
    [EPlatform.VIVO_ANDROID]: "VivoAndroidSdk",
    [EPlatform.XIAOMI_ANDROID]: "XiaomiAndroidSdk",
    [EPlatform.VIVO_MICRO]: "VivoMicroSdk",
    [EPlatform.GOOGLE_ANDROID]: "NativeAndroid",
    [EPlatform.AMZ_ANDROID]: "NativeAndroid",
    [EPlatform.XIAOMI_MICRO]: "XmMicroSdk",
    [EPlatform.MEIZU_MICRO]: "MeiZuMicroSdk",
    [EPlatform.KWAI_MICRO]: "KwaiSdk",
    [EPlatform.SSJJ_ANDROID]: "NativeAndroid",
}

/**
 * appid列表
 */
export const AppIdList = {
    [EPlatform.WEB_DEV]: "wxe0552dd7b5098c63",
    [EPlatform.NA_ANDROID]: "123456",
    [EPlatform.TAPTAP_ANDROID]: "123456",
    [EPlatform.MMY_ANDROID]: "123",
    [EPlatform.HYKB_ANDROID]: "123",
    [EPlatform.ANDROID_233]: "123",
    [EPlatform.NA_IOS]: "1511848893",
    [EPlatform.WECHAT_GAME]: "wx0313fe4394d25f1b",
    [EPlatform.BYTE_DANCE]: "tt8ad0fc6d15ebc2bd",
    [EPlatform.QQ]: "1109835663",
    [EPlatform.BAIDU]: "24218312",
    [EPlatform.QTT_GAME]: "a3XWihw6VsSL",
    [EPlatform.JKW_GAME]: "633154511",
    [EPlatform.OPPO_ANDROID]: "30535663",
    [EPlatform.OPPP_MICRO]: "10000",
    [EPlatform.VIVO_ANDROID]: "103929724",
    [EPlatform.XIAOMI_ANDROID]: "2882303761518436858",
    [EPlatform.XIAOMI_MICRO]: "2882303761519858998",
    [EPlatform.VIVO_MICRO]: "100007012",
    [EPlatform.GOOGLE_ANDROID]: "654321",
    [EPlatform.AMZ_ANDROID]: "654321",
    [EPlatform.KWAI_MICRO]: "ks696650571558531114",
    [EPlatform.SSJJ_ANDROID]: "10000",
}

/**
 * bannerid列表
 */
export const BannerIdList = {
    [EPlatform.WEB_DEV]: {
        '0': "945103842",
    },
    [EPlatform.NA_ANDROID]: {
        '0': "945194818",
    },
    [EPlatform.TAPTAP_ANDROID]: {
        '0': "945194818",
    },
    [EPlatform.HYKB_ANDROID]: {
        '0': "945194818",
    },
    [EPlatform.ANDROID_233]:{
        '0': "945194818",
    },
    [EPlatform.MMY_ANDROID]: {
        '0': "945194818",
    },
    [EPlatform.NA_IOS]: {
        '0': "10001",
    },
    [EPlatform.WECHAT_GAME]: {
        '0': "adunit-98a090c987a65af5",
    },
    [EPlatform.BYTE_DANCE]: {
        '0': "40vji2mbisrcdh175c",
    },
    [EPlatform.QQ]: {
        '0': "96a18395ce699f809eab3b374fedefe7",
    },
    [EPlatform.BAIDU]: {
        '0': "7532440-ac9f0292",
    },
    [EPlatform.QTT_GAME]: { "0": "000" },
    [EPlatform.JKW_GAME]: { "0": "403716895" },
    [EPlatform.OPPO_ANDROID]: { "0": "945194818" },
    [EPlatform.OPPP_MICRO]: { "0": "313296" },
    [EPlatform.VIVO_ANDROID]: { "0": "945194818" },
    [EPlatform.XIAOMI_ANDROID]: { "0": "945194818" },
    [EPlatform.VIVO_MICRO]: { "0": "83f163665a7e489faf5492b39f6bb51d" },
    [EPlatform.SSJJ_ANDROID]: { "0": "000" },
}

/**
 * 激励视频id列表
 */
export const VideoIdList = {
    [EPlatform.WEB_DEV]: {
        '0': "945103837",
    },
    [EPlatform.NA_ANDROID]: {
        '0': "945194814",
    },
    [EPlatform.TAPTAP_ANDROID]: {
        '0': "945194814",
    },
    [EPlatform.MMY_ANDROID]: {
        '0': "945194814",
    },
    [EPlatform.ANDROID_233]:{
        '0': "945194818",
    },
    [EPlatform.HYKB_ANDROID]: {
        '0': "945194814",
    },
    [EPlatform.GOOGLE_ANDROID]: {
        '0': "945194814",
    },
    [EPlatform.AMZ_ANDROID]: {
        '0': "945194814",
    },
    [EPlatform.NA_IOS]: {
        '0': "10001",
    },
    [EPlatform.WECHAT_GAME]: {
        '0': "adunit-e7c8e3cd0458bbca",
    },
    [EPlatform.BYTE_DANCE]: {
        '0': "jeg73qbilbb7sneguj",
    },
    [EPlatform.QQ]: {
        '0': "2a6947d4ffd71db4e2087db178269f1f",
    },
    [EPlatform.BAIDU]: {
        '0': "7532442-ac9f0292",
    },
    [EPlatform.QTT_GAME]: { "0": "000" },
    [EPlatform.JKW_GAME]: { "0": "740329865" },
    [EPlatform.OPPO_ANDROID]: { "0": "945194818" },
    [EPlatform.OPPP_MICRO]: { "0": "306772" },
    [EPlatform.VIVO_ANDROID]: { "0": "945194818" },
    [EPlatform.XIAOMI_ANDROID]: { "0": "945194818" },
    [EPlatform.XIAOMI_MICRO]: { "0": "43c7cf3f129ebad79a1b91362f3a7f1f" },
    [EPlatform.VIVO_MICRO]: { "0": "e537c8315abb412ea74c827a50b5da54" },
    [EPlatform.MEIZU_MICRO]: { "0": "4ruNK7xM" },
    [EPlatform.KWAI_MICRO]: { "0": "2300001028_01" },
    [EPlatform.SSJJ_ANDROID]: { "0": "000" },
}


/**
 *  全屏视频id列表
 */
export const FullVideoIdList = {
    [EPlatform.WEB_DEV]: "000",
    [EPlatform.NA_ANDROID]: "945194815",
    [EPlatform.TAPTAP_ANDROID]: "945194815",
    [EPlatform.MMY_ANDROID]: "945194815",
    [EPlatform.HYKB_ANDROID]: "945194815",
    [EPlatform.ANDROID_233]:"945194815",
    [EPlatform.WECHAT_GAME]: "adunit-a49216e5475d38a6",
    [EPlatform.GOOGLE_ANDROID]: "945194815",
    [EPlatform.AMZ_ANDROID]: "945194815",
    [EPlatform.NA_IOS]: "000",
    [EPlatform.BYTE_DANCE]: "4e542kdl16b1lh0d0c",
    [EPlatform.QQ]: "111",
    [EPlatform.OPPO_ANDROID]: "945194815",
    [EPlatform.OPPP_MICRO]: "945194815",
    [EPlatform.VIVO_ANDROID]: "945194818",
    [EPlatform.XIAOMI_ANDROID]: "945194818",
    [EPlatform.SSJJ_ANDROID]: "000",
    [EPlatform.MEIZU_MICRO]: "fat1dEcr",
}

/**
 * 插屏广告列表
 */
export const InsterIdList = {
    [EPlatform.WEB_DEV]: "000",
    [EPlatform.NA_ANDROID]: "000",
    [EPlatform.TAPTAP_ANDROID]: "000",
    [EPlatform.MMY_ANDROID]: "000",
    [EPlatform.WECHAT_GAME]: "adunit-a49216e5475d38a6",
    [EPlatform.NA_IOS]: "000",
    [EPlatform.BYTE_DANCE]: "4e542kdl16b1lh0d0c",
    [EPlatform.QQ]: "002199c083ece33c2eea97695b4d1243",
    [EPlatform.QTT_GAME]: "000",
    [EPlatform.JKW_GAME]: "18753942",
    [EPlatform.OPPO_ANDROID]: "000",
    [EPlatform.OPPP_MICRO]: "329444",
    [EPlatform.VIVO_ANDROID]: "945194818",
    [EPlatform.VIVO_MICRO]: "6a6f4c76e62a454088fb3746094b134f",
    [EPlatform.SSJJ_ANDROID]: "000",
}

/**
 * 闪屏广告列表
 */
export const SplashIdList = {
    [EPlatform.WEB_DEV]: "000",
    [EPlatform.NA_ANDROID]: "887327489",
    [EPlatform.TAPTAP_ANDROID]: "887327489",
    [EPlatform.MMY_ANDROID]: "887327489",
    [EPlatform.NA_IOS]: "000",
    [EPlatform.WECHAT_GAME]: "000",
    [EPlatform.OPPO_ANDROID]: "887327489",
    [EPlatform.OPPP_MICRO]: "887327489",
    [EPlatform.VIVO_ANDROID]: "887327489",
    [EPlatform.XIAOMI_ANDROID]: "887327489",
    [EPlatform.SSJJ_ANDROID]: "000",
}

/**
 * 信息流广告id列表
 */
export const FeedAdIdList = {
    [EPlatform.WEB_DEV]: "000",
    [EPlatform.NA_ANDROID]: "945194816",
    [EPlatform.NA_IOS]: "000",
    [EPlatform.WECHAT_GAME]: "000",
    [EPlatform.BYTE_DANCE]: "0",
    [EPlatform.OPPO_ANDROID]: "945194816",
    [EPlatform.OPPP_MICRO]: "945194816",
    [EPlatform.VIVO_ANDROID]: "945194816",
    [EPlatform.XIAOMI_ANDROID]: "945194816",
    [EPlatform.SSJJ_ANDROID]: "000",
}

/**
 * 更多游戏id列表
 */
export const BoxIdList = {
    [EPlatform.QQ]: "4e76c74a420605bb4fa6cc8a03cfe6a5",
    [EPlatform.WECHAT_GAME]: "adunit-60f8d0f68ec9eb3d",
}

/**
 * BMS后台名字已经BMS后台版本
 */
export const BMSInfoList = {
    [EPlatform.WEB_DEV]: { BMS_APP_NAME: "fmshdev", BMS_VERSION: "1.0.0" },
    [EPlatform.NA_ANDROID]: { BMS_APP_NAME: "fmshapk", BMS_VERSION: "1.3.1" },
    [EPlatform.GOOGLE_ANDROID]: { BMS_APP_NAME: "fmshhwapk", BMS_VERSION: "1.3.1" },
    [EPlatform.AMZ_ANDROID]: { BMS_APP_NAME: "fmshymx", BMS_VERSION: "1.0.0" },
    [EPlatform.NA_IOS]: { BMS_APP_NAME: "fmshios", BMS_VERSION: "1.0.3" },
    [EPlatform.WECHAT_GAME]: { BMS_APP_NAME: "fmshwx", BMS_VERSION: "1.1.2" },
    [EPlatform.BYTE_DANCE]: { BMS_APP_NAME: "fmshtt", BMS_VERSION: "1.3.7" },
    [EPlatform.QQ]: { BMS_APP_NAME: "dmxqq", BMS_VERSION: "1.0.4" },
    [EPlatform.BAIDU]: { BMS_APP_NAME: "fmshbd", BMS_VERSION: "1.0.3" },
    [EPlatform.QTT_GAME]: { BMS_APP_NAME: "dmxqtt", BMS_VERSION: "1.0.1" },
    [EPlatform.JKW_GAME]: { BMS_APP_NAME: "dmxjkw", BMS_VERSION: "1.0.0" },
    [EPlatform.OPPO_ANDROID]: { BMS_APP_NAME: "fmshoppoapk", BMS_VERSION: "1.0.2" },
    [EPlatform.OPPP_MICRO]: { BMS_APP_NAME: "fmshoppo", BMS_VERSION: "1.1.0" },
    [EPlatform.VIVO_MICRO]: { BMS_APP_NAME: "dmxvivo", BMS_VERSION: "1.0.1" },
    [EPlatform.VIVO_ANDROID]: { BMS_APP_NAME: "mxdsgameapk", BMS_VERSION: "1.0.0vivo" },
    [EPlatform.XIAOMI_ANDROID]: { BMS_APP_NAME: "mxdsgameapk", BMS_VERSION: "1.0.0xm" },
    [EPlatform.XIAOMI_MICRO]: { BMS_APP_NAME: "fmshxm", BMS_VERSION: "1.0.4" },
    [EPlatform.MEIZU_MICRO]: { BMS_APP_NAME: "fmshmz", BMS_VERSION: "1.0.7" },
    [EPlatform.KWAI_MICRO]: { BMS_APP_NAME: "fmshks", BMS_VERSION: "1.0.6" },
    [EPlatform.SSJJ_ANDROID]: { BMS_APP_NAME: "fmsh4399", BMS_VERSION: "1.0.0" },
    [EPlatform.TAPTAP_ANDROID]: { BMS_APP_NAME: "fmshtaptap", BMS_VERSION: "1.3.1" },
    [EPlatform.MMY_ANDROID]: { BMS_APP_NAME: "fmshmmy", BMS_VERSION: "1.3.1" },
    [EPlatform.HYKB_ANDROID]: { BMS_APP_NAME: "fmshhykb", BMS_VERSION: "1.3.1" },
    [EPlatform.ANDROID_233]: { BMS_APP_NAME: "fmsh233", BMS_VERSION: "1.3.1" },

}
