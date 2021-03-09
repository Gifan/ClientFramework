export enum ListenID {
    _Start = 999,
    Game_UpdateGold,
    Game_UpdatePower,
    Game_SecondDay,

    Login_Start,
    Login_Finish,

    Ad_ShowBanner,
    Ad_HideBanner,
    Ad_ShowVideo,
    Ad_ShowFullVideo,
    Ad_BannerCall,
    Ad_ShowInsertAd,
    Ad_ResetAutoFullAdTime,
    Ad_ShowAdDebuggView,

    Setting_MuteMusic,
    Setting_MuteShake,
    Setting_PlayShake,
    Setting_OpenView,

    Event_SendEvent,

    Currency_SetCurrencyVisible,
    Currency_OpenBuyView,

    Cheat_PhysicsDebug,//金手指
    Physics_SetLookDown,
    Physics_SetEnable,

    //loading
    Loading_StartLoad,
    Loading_EndLoad,

    ScreenCap_Start,// 录屏模块开始录屏
    ScreenCap_StartFinish,
    ScreenCap_Stop,
    ScreenCap_StopFinish,
    ScreenCap_Clean,//清空

    Power_CloseBuyView,//体力(爱心值)模块
    Power_OpenBuyView,
    Power_DonwTime,
    Power_SetPowerVisible,

}