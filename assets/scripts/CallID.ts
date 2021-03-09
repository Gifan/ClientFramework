export enum CallID {
    _Start = 999,
    Setting_IsMuteMusic,
    Setting_IsMuteAudio,
    Setting_IsMuteShake,
    Setting_GetRealDesignSize,//获取实际的设计屏幕分辨率
    Guide_isGuiding,//引导模块
    Guide_GetGuideId,//获取当前引导id

    Common_GetMainViewCurrencyPosition,
    Common_GetMainViewPowerPosition,

    Stage_GetTopStage,//关卡模块
    Stage_GetMaxStageNum,


    Skin_GetCurSkinId,
    Skin_GetCurSkinPath,
    Skin_GetCurWeaponPath,
    Skin_GetGoldEnoughBuy,
    Skin_GetCurWeaponId,
    Skin_GetCurSkinInfo,
    Skin_GetAllLockedSkinCfg,
    Skin_GetAllLockedWeaponCfg,
    Skin_GetRandomSkinInfo,

    ScreenCap_CanShareVideo,

    //体力
    Power_GetPowerCountTime,//体力值
}