export enum ListenID {
    _Start = 999,
    Rigister_Remind,
    Game_UpdateGold,
    Game_UpdatePower,
    Game_ScheduleUpdate,
    Game_SecondDay,
    Game_OpenUIList,
    Game_AddOpenUI,
    Game_FinishUI,



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

    Guide_StartGuide,
    Guide_CheckGuide,

    Event_SendEvent,

    Stage_OpenView,//关卡模块
    Stage_CloseView,
    Stage_GameFinish,
    Stage_EnemyTanut, //敌人嘲讽
    Component_Register,
    Stage_EnemyDead,//敌人死亡通知
    Stage_WeaponDead,//武器死亡通知
    Stage_Win,
    Stage_PushReward,
    Stage_ShowShake,
    Stage_Reset,
    Stage_ShowResultView,
    Stage_DrawLine,
    Stage_ShowEffect,
    Stage_RecycleEffect,
    Stage_OpenPauseView,
    Stage_SetGamePause,
    Stage_BackHome,
    Stage_OpenChangeSkinView,
    Stage_ToChangeSkin,
    Stage_ReadyShoot,
    Stage_ShowAlert,
    // Stage_WeaponNumChange,
    Stage_ReviveSuccess,
    Stage_StartStepChange,
    Stage_ShowIceScreen,
    Stage_ShowBright,
    Stage_ShowDrawGuide,

    Currency_SetCurrencyVisible,
    Currency_OpenBuyView,

    Main_OpenView,//主面板
    Main_NeedToShowSkin,

    Cheat_PhysicsDebug,//金手指
    Physics_SetLookDown,
    Physics_SetEnable,

    Skin_UpdateSkinStateFinish,
    Skin_UpdateWeaponStateFinish,
    Skin_UpdateWearSkinSuccess,
    Skin_UpdateWearWeaponSuccess,
    Skin_OpenView,
    Skin_CloseViewCB,
    Skin_ReduceTrialSkin,
    Skin_SetCurSkinId,
    Skin_OpenRewardView,

    //fivestart
    FiveStart_OpenView,

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