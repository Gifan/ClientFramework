import { Manager } from "./util/Manager";
import { Notifier } from "./framework/notify/Notifier";
import { NotifyID } from "./framework/notify/NotifyID";

let ishided: boolean = false;

cc.game.on(cc.game.EVENT_SHOW, function (res) {
    console.log('## 回到游戏')
    // let compoundCommon = CompoundCommon.GetInstance(); 
    // if(compoundCommon.m_eventHideFlag){ 
    //     //切到后台回来才会触发离线收益
    //     compoundCommon.loadOffLineTime(); 
    // }
    // compoundCommon.m_eventHideFlag = false; 
    Notifier.send(NotifyID.Game_Pause, false);
}.bind(this), this);

cc.game.on(cc.game.EVENT_HIDE, function (res) {
    console.log('## 隐藏游戏')
    // if(!common.debug){
    // 切到后台，保存合成数据
    //     let compoundCommon = CompoundCommon.GetInstance();
    //     compoundCommon.m_eventHideFlag  = true;
    //     compoundCommon.saveCompoundCommonData(); 
    // // }
    Manager.vo.saveUserData();
    Notifier.send(NotifyID.Game_Pause, true);
}.bind(this), this);