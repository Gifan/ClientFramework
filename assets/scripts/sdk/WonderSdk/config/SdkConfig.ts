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
    UC_MICRO:15,
    GOOGLE_ANDROID:16,      //谷歌android
    MEIZU_MICRO:26,
})

/**
 * 对应的平台渠道类名
 */
export const SdkClass = {
    [EPlatform.WEB_DEV]: "WebDev",
    [EPlatform.NA_ANDROID]: "JUHEAndroid",
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
}

/**
 * appid列表
 */
export const AppIdList = {
    [EPlatform.WEB_DEV]: "wxe0552dd7b5098c63",
    [EPlatform.NA_ANDROID]: "123456",
    [EPlatform.NA_IOS]: "1511848893",
    [EPlatform.WECHAT_GAME]: "wx5575bdec21f3a9ce",
    [EPlatform.BYTE_DANCE]: "ttaa3cdc813507a794",
    [EPlatform.QQ]: "1109835663",
    [EPlatform.BAIDU]: "20369973",
    [EPlatform.QTT_GAME]: "a3XWihw6VsSL",
    [EPlatform.JKW_GAME]: "633154511",
    [EPlatform.OPPO_ANDROID]: "10000",
    [EPlatform.OPPP_MICRO]: "10000",
    [EPlatform.VIVO_ANDROID]: "103929724",
    [EPlatform.XIAOMI_ANDROID]: "2882303761518436858",
    [EPlatform.VIVO_MICRO]: "100007012",
    [EPlatform.GOOGLE_ANDROID]: "654321",
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
    [EPlatform.NA_IOS]: {
        '0': "10001",
    },
    [EPlatform.WECHAT_GAME]: {
        '0': "adunit-4f5d22a27f73ee0f",
    },
    [EPlatform.BYTE_DANCE]: {
        '0': "6dau8eeq2g1giuwrmf",
    },
    [EPlatform.QQ]: {
        '0': "96a18395ce699f809eab3b374fedefe7",
    },
    [EPlatform.BAIDU]: {
        '0': "7110312-f8098ec0",
    },
    [EPlatform.QTT_GAME]: { "0": "000" },
    [EPlatform.JKW_GAME]: { "0": "403716895" },
    [EPlatform.OPPO_ANDROID]: { "0": "945194818" },
    [EPlatform.OPPP_MICRO]: { "0": "945194818" },
    [EPlatform.VIVO_ANDROID]: { "0": "945194818" },
    [EPlatform.XIAOMI_ANDROID]: { "0": "945194818" },
    [EPlatform.VIVO_MICRO]: { "0": "83f163665a7e489faf5492b39f6bb51d" },
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
    [EPlatform.GOOGLE_ANDROID]: {
        '0': "945194814",
    },
    [EPlatform.NA_IOS]: {
        '0': "10001",
    },
    [EPlatform.WECHAT_GAME]: {
        '0': "adunit-e010edbcf2d6b7fc",
    },
    [EPlatform.BYTE_DANCE]: {
        '0': "55p45lc67jf8end0f2",
    },
    [EPlatform.QQ]: {
        '0': "2a6947d4ffd71db4e2087db178269f1f",
    },
    [EPlatform.BAIDU]: {
        '0': "7110313-f8098ec0",
    },
    [EPlatform.QTT_GAME]: { "0": "000" },
    [EPlatform.JKW_GAME]: { "0": "740329865" },
    [EPlatform.OPPO_ANDROID]: { "0": "945194818" },
    [EPlatform.OPPP_MICRO]: { "0": "945194818" },
    [EPlatform.VIVO_ANDROID]: { "0": "945194818" },
    [EPlatform.XIAOMI_ANDROID]: { "0": "945194818" },
    [EPlatform.VIVO_MICRO]: { "0": "e537c8315abb412ea74c827a50b5da54" },
}


/**
 *  全屏视频id列表
 */
export const FullVideoIdList = {
    [EPlatform.WEB_DEV]: "000",
    [EPlatform.NA_ANDROID]: "945194815",
    [EPlatform.GOOGLE_ANDROID]: "945194815",
    [EPlatform.NA_IOS]: "000",
    [EPlatform.WECHAT_GAME]: "000",
    [EPlatform.BYTE_DANCE]: "c1046eh5ej4137ckjt",
    [EPlatform.QQ]: "111",
    [EPlatform.OPPO_ANDROID]: "945194815",
    [EPlatform.OPPP_MICRO]: "945194815",
    [EPlatform.VIVO_ANDROID]: "945194818",
    [EPlatform.XIAOMI_ANDROID]: "945194818",
}

/**
 * 插屏广告列表
 */
export const InsterIdList = {
    [EPlatform.WEB_DEV]: "000",
    [EPlatform.NA_ANDROID]: "000",
    [EPlatform.WECHAT_GAME]: "adunit-c0bf63752e915d78",
    [EPlatform.NA_IOS]: "000",
    [EPlatform.BYTE_DANCE]: "c1046eh5ej4137ckjt",
    [EPlatform.QQ]: "002199c083ece33c2eea97695b4d1243",
    [EPlatform.QTT_GAME]: "000",
    [EPlatform.JKW_GAME]: "18753942",
    [EPlatform.OPPO_ANDROID]: "000",
    [EPlatform.OPPP_MICRO]: "000",
    [EPlatform.VIVO_ANDROID]: "945194818",
    [EPlatform.VIVO_MICRO]: "6a6f4c76e62a454088fb3746094b134f",
}

/**
 * 闪屏广告列表
 */
export const SplashIdList = {
    [EPlatform.WEB_DEV]: "000",
    [EPlatform.NA_ANDROID]: "887327489",
    [EPlatform.NA_IOS]: "000",
    [EPlatform.WECHAT_GAME]: "000",
    [EPlatform.OPPO_ANDROID]: "887327489",
    [EPlatform.OPPP_MICRO]: "887327489",
    [EPlatform.VIVO_ANDROID]: "887327489",
    [EPlatform.XIAOMI_ANDROID]: "887327489",
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
    [EPlatform.WEB_DEV]: { BMS_APP_NAME: "fdttttt", BMS_VERSION: "1.1.1" },
    [EPlatform.NA_ANDROID]: { BMS_APP_NAME: "fdttthykb", BMS_VERSION: "1.0.0" },
    [EPlatform.GOOGLE_ANDROID]: { BMS_APP_NAME: "fdttthwapk", BMS_VERSION: "1.1.0" },
    [EPlatform.NA_IOS]: { BMS_APP_NAME: "fdtttios", BMS_VERSION: "1.0.0" },
    [EPlatform.WECHAT_GAME]: { BMS_APP_NAME: "dmxwx", BMS_VERSION: "1.2.7" },
    [EPlatform.BYTE_DANCE]: { BMS_APP_NAME: "fdttttt", BMS_VERSION: "1.1.2" },
    [EPlatform.QQ]: { BMS_APP_NAME: "dmxqq", BMS_VERSION: "1.0.3" },
    [EPlatform.BAIDU]: { BMS_APP_NAME: "dmxbd", BMS_VERSION: "1.0.2" },
    [EPlatform.QTT_GAME]: { BMS_APP_NAME: "dmxqtt", BMS_VERSION: "1.0.1" },
    [EPlatform.JKW_GAME]: { BMS_APP_NAME: "dmxjkw", BMS_VERSION: "1.0.0" },
    [EPlatform.OPPO_ANDROID]: { BMS_APP_NAME: "mxdsgameapk", BMS_VERSION: "1.0.0oppo" },
    [EPlatform.OPPP_MICRO]: { BMS_APP_NAME: "dmxoppo", BMS_VERSION: "1.0.0" },
    [EPlatform.VIVO_MICRO]: { BMS_APP_NAME: "dmxvivo", BMS_VERSION: "1.0.1" },
    [EPlatform.VIVO_ANDROID]: { BMS_APP_NAME: "mxdsgameapk", BMS_VERSION: "1.0.0vivo" },
    [EPlatform.XIAOMI_ANDROID]: { BMS_APP_NAME: "mxdsgameapk", BMS_VERSION: "1.0.0xm" },
}
