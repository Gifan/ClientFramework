export enum ListenID {
    _Start = 999,
    Rigister_Remind,
    Game_UpdateGold,
    Game_UpdateDiamond,
    Game_ScheduleUpdate,
    Game_SecondDay,
    Game_OpenUIList,//以次打开弹窗
    Game_AddOpenUI,//添加对应弹窗
    Game_FinishUI,

    Login_Start,
    Login_Finish,

    Ad_ShowBanner,//广告模块
    Ad_HideBanner,
    Ad_ShowVideo,
    Ad_ShowFullVideo,
    Ad_BannerCall,

    Setting_MuteMusic, //设置模块

    Guide_StartGuide,//引导模块
    Guide_CheckGuide,//检查引导

    Event_SendEvent,//事件统计模块
}