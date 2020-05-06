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
    BAIDU:7,//百度小游戏
})

/**
 * 对应的平台渠道类名
 */
export const SdkClass = {
    [EPlatform.WEB_DEV]: "WebDev",
    [EPlatform.NA_ANDROID]: "NativeAndroid",
    [EPlatform.NA_IOS]: "IOSSdk",
    [EPlatform.WECHAT_GAME]: "WeChatSdk",
    [EPlatform.BYTE_DANCE]: "ByteDance",
    [EPlatform.QQ]: "QQSdk",
    [EPlatform.BAIDU]:"BaiDuSdk",
    
}

/**
 * appid列表
 */
export const AppIdList = {
    [EPlatform.WEB_DEV]: "wxe0552dd7b5098c63",
    [EPlatform.NA_ANDROID]: "5061913",
    [EPlatform.NA_IOS]: "10000",
    [EPlatform.WECHAT_GAME]: "wxe0552dd7b5098c63",
    [EPlatform.BYTE_DANCE]: "tt036d75d09c474568",
    [EPlatform.QQ]: "1109644655",
    [EPlatform.BAIDU]:"19628854",
}

/**
 * bannerid列表
 */
export const BannerIdList = {
    [EPlatform.WEB_DEV]: {
        '0': "945103842",
    },
    [EPlatform.NA_ANDROID]: {
        '0': "945146545",
    },
    [EPlatform.NA_IOS]: {
        '0': "10001",
    },
    [EPlatform.BYTE_DANCE]: {
        '0': "15e48k0hamdf82bo6d",
    },
    [EPlatform.QQ]: {
        '0': "f71b3ddfbbb0aa2a7809693e35abe76e",
    },
    [EPlatform.BAIDU]: {
        '0': "7043591-bb1a4900",
    },
}

/**
 * 激励视频id列表
 */
export const VideoIdList = {
    [EPlatform.WEB_DEV]: {
        '0': "945103837",
    },
    [EPlatform.NA_ANDROID]: {
        '0': "945146525",
    },
    [EPlatform.NA_IOS]: {
        '0': "10001",
    },
    [EPlatform.BYTE_DANCE]: {
        '0': "jjd1pp6iei114upodp",
    },
    [EPlatform.QQ]: {
        '0': "64693a636d64dc6acb5f5dc54c28857e",
    },
    [EPlatform.BAIDU]: {
        '0': "7043592-bb1a4900",
    },
}


/**
 *  全屏视频id列表
 */
export const FullVideoIdList = {
    [EPlatform.WEB_DEV]: "000",
    [EPlatform.NA_ANDROID]: "945146527",
    [EPlatform.NA_IOS]: "000",
    [EPlatform.WECHAT_GAME]: "000",
    [EPlatform.BYTE_DANCE]: "000",
    [EPlatform.QQ]: "111",
}

/**
 * 插屏广告列表
 */
export const InsterIdList = {
    [EPlatform.WEB_DEV]: "000",
    [EPlatform.NA_ANDROID]: "000",
    [EPlatform.NA_IOS]: "000",
    [EPlatform.BYTE_DANCE]: "8ce32idq34imj4lpn1",
    [EPlatform.QQ]: "7755b7d086ed434021397d0e08947ae3",
}

/**
 * 闪屏广告列表
 */
export const SplashIdList = {
    [EPlatform.WEB_DEV]: "000",
    [EPlatform.NA_ANDROID]: "887317511",
    [EPlatform.NA_IOS]: "000",
    [EPlatform.WECHAT_GAME]: "000",
}

/**
 * 信息流广告id列表
 */
export const FeedAdIdList = {
    [EPlatform.WEB_DEV]: "000",
    [EPlatform.NA_ANDROID]: "945146534",
    [EPlatform.NA_IOS]: "000",
    [EPlatform.WECHAT_GAME]: "000",
    [EPlatform.BYTE_DANCE]: "0"
}

/**
 * 更多游戏id列表
 */
export const BoxIdList = {
    [EPlatform.QQ]: "0478e066c4551c549deb58b7f0faf7e2",
}

/**
 * BMS后台名字已经BMS后台版本
 */
export const BMSInfoList = {
    [EPlatform.WEB_DEV]: { BMS_APP_NAME: "jjnhqq", BMS_VERSION: "1.0.0" },
    [EPlatform.NA_ANDROID]: { BMS_APP_NAME: "jjnhapk", BMS_VERSION: "1.0.0" },
    [EPlatform.NA_IOS]: { BMS_APP_NAME: "jjnhios", BMS_VERSION: "1.0.0" },
    [EPlatform.WECHAT_GAME]: { BMS_APP_NAME: "jjnhwx", BMS_VERSION: "1.0.0" },
    [EPlatform.BYTE_DANCE]: { BMS_APP_NAME: "jjnhtt", BMS_VERSION: "1.0.0" },
    [EPlatform.QQ]: { BMS_APP_NAME: "jjnhqq", BMS_VERSION: "1.0.0" },
    [EPlatform.BAIDU]: {BMS_APP_NAME:"jjnhbd",BMS_VERSION:"1.0.0"},
}
