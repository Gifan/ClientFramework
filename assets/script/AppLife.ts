import { Manager } from "./util/Manager";
import { Notifier } from "./framework/notify/Notifier";
import { NotifyID } from "./framework/notify/NotifyID";

cc.game.on(cc.game.EVENT_SHOW, function (res) {
    console.log('## 回到游戏')
    Notifier.send(NotifyID.Game_Pause, false);
}.bind(this), this);

cc.game.on(cc.game.EVENT_HIDE, function (res) {
    console.log('## 隐藏游戏')
    Manager.vo.saveUserData();
    Notifier.send(NotifyID.Game_Pause, true);
}.bind(this), this);