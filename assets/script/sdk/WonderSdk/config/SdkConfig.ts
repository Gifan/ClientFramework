/**
 * 对应平台id
 */
export const  EPlatform =cc.Enum({
    WEB_DEV : 1,
    NA_ANDROID:2,
    NA_IOS:3,
    WECHAT_GAME:4,
})

/**
 * 对应的平台渠道类名
 */
export const SdkClass = {
    [EPlatform.WEB_DEV]: "WebDev",
    [EPlatform.NA_ANDROID]: "NativeAndroid",
    [EPlatform.NA_IOS]: "WebDev",
    [EPlatform.WECHAT_GAME]: "WebDev",
}

/**
 * appid列表
 */
export const AppIdList = {
    [EPlatform.WEB_DEV]: "0000",
    [EPlatform.NA_ANDROID]: "0001",
    [EPlatform.NA_IOS]: "0002",
    [EPlatform.WECHAT_GAME]: "wx00000",
}

/**
 * bannerid列表
 */
export const BannerIdList = {
    [EPlatform.WEB_DEV]: {
        '0': "945103842",
    },
    [EPlatform.NA_ANDROID]: {
        '0': "945103842",
    },
    [EPlatform.NA_IOS]: {
        '0': "10001",
    },
    [EPlatform.WECHAT_GAME]: {
        '0': "10001",
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
        '0': "945103837",
    },
    [EPlatform.NA_IOS]: {
        '0': "10001",
    },
    [EPlatform.WECHAT_GAME]: {
        '0': "10001",
    },
}


/**
 *  全屏视频id列表
 */
export const FullVideoIdList = {
    [EPlatform.WEB_DEV]: "000",
    [EPlatform.NA_ANDROID]: "945103839",
    [EPlatform.NA_IOS]: "000",
    [EPlatform.WECHAT_GAME]: "000",
}

/**
 * 插屏广告列表
 */
export const InsterIdList = {
    [EPlatform.WEB_DEV]: "000",
    [EPlatform.NA_ANDROID]: "000",
    [EPlatform.NA_IOS]: "000",
    [EPlatform.WECHAT_GAME]: "000",
}

/**
 * 闪屏广告列表
 */
export const SplashIdList = {
    [EPlatform.WEB_DEV]: "000",
    [EPlatform.NA_ANDROID]: "887309880",
    [EPlatform.NA_IOS]: "000",
    [EPlatform.WECHAT_GAME]: "000",
}

/**
 * 信息流广告id列表
 */
export const FeedAdIdList = {
    [EPlatform.WEB_DEV]: "000",
    [EPlatform.NA_ANDROID]: "945103840",
    [EPlatform.NA_IOS]: "000",
    [EPlatform.WECHAT_GAME]: "000",
}

/**
 * BMS后台名字已经BMS后台版本
 */
export const BMSInfoList = {
    [EPlatform.WEB_DEV]: { BMS_APP_NAME: "ggqlx", BMS_VERSION: "1.0.1" },
    [EPlatform.NA_ANDROID]: { BMS_APP_NAME: "ggqlxapk", BMS_VERSION: "1.0.2" },
    [EPlatform.NA_IOS]: { BMS_APP_NAME: "ggqlxios", BMS_VERSION: "1.0.1" },
    [EPlatform.WECHAT_GAME]: { BMS_APP_NAME: "ggqlxwx", BMS_VERSION: "1.0.1" },
}
