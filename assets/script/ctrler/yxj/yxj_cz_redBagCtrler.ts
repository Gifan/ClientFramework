import { Const } from "../../config/Const";

var common = require('zqddn_zhb_Common');
export default class RedBagCtrler {
    get isActive() {
        return this.getCashLeftTime() > 0;
    }
    constructor() {
        this.getCashLeftTime()
    }

    getCashLeftTime(): number { //提现剩余时间
        let ret = 0;
        let lastTime = fw.lsd.cashStartTime.value;//提现倒计时开始时间
        if (lastTime > 0) { //有记录时间
            let totalTime = fw.lsd.cashTotalTime.value; //提现累计可用总时间
            let nowTime = Math.floor(Date.now() / 1000);
            let deltaTime = nowTime - lastTime;
            if (deltaTime > 0 && deltaTime < totalTime) { //在规定时间内
                ret = totalTime - deltaTime;
            } else {
                ret = 0;
            }
            console.log("getCashLeftTime", nowTime, lastTime, deltaTime, ret)
        } else { //没有记录则从48小时开始倒计时

            let nowTime = Math.floor(Date.now() / 1000);
            fw.lsd.cashStartTime.value = nowTime;
            let totalTime = 2 * 24 * 3600;
            fw.lsd.cashTotalTime.value = totalTime; //提现累计可用总时间
            ret = totalTime;
        }
        return ret;
    }

    addCashLeftTime() {//延长提现剩余时间
        common.sceneMgr.showTipsUI("红包活动延长6小时");
        let totalTime = fw.lsd.cashTotalTime.value; //提现累计可用总时间
        let ret = this.getCashLeftTime();
        if (ret <= 0) {
            let nowTime = Math.floor(Date.now() / 1000);
            totalTime = 3600 * 6;
            fw.lsd.cashStartTime.value = nowTime; //重置开始时间
        } else {
            totalTime += 3600 * 6;
        }
        fw.lsd.cashTotalTime.value = totalTime;
    }
    //获取当前玩家已经消耗钥匙个数
    getUsedKey(): number {
        let usedKey = fw.lsd.usedKey.value;
        return usedKey;
    }

    //设置当前玩家已经消耗钥匙个数
    setUsedKey(num: number) {
        let usedKey = this.getUsedKey();
        usedKey += num;
        fw.lsd.usedKey.value = usedKey;
        if (usedKey >= 20) {
            let day = new Date().getDate();
            let loginday = cc.sys.localStorage.getItem("zqddn_zhb_loginDay");
            if (day - loginday == 0) {
                if (!fw.lsd.hasUploadUsedKey.value) {
                    console.log("当天新用户仅首次玩家消耗到20把钥匙");
                    fw.lsd.hasUploadUsedKey.value = true;
                    if (fw.isANDROID) {
                        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "sendMsg", "(Ljava/lang/String;Ljava/lang/String;)V", "first_consume_20key");
                    }
                }
            }
        }
    }

    //获取当前玩家所获得的红包总金额
    getCashMoney(): number {
        let cashMoney = fw.lsd.cashMoney.value;
        console.log("红包总金额cashMoney==", cashMoney);
        return cashMoney;
    }
    //设置当前玩家所获得的红包总金额
    setCashMoney(num: number) {
        let cashMoney = this.getCashMoney();
        cashMoney += num;
        fw.lsd.cashMoney.value = cashMoney;
    }
    getCashLeftTimeText(time): string { //获得提现倒计时文本
        let hour = Math.floor(time / 3600);
        let minute = Math.floor(time % 3600 / 60);
        let second = Math.floor(time % 60);
        let str = "";
        if (hour == 0) {
            str += "00";
        } else if (hour > 0 && hour < 10) {
            str += "0" + hour;
        } else {
            str += hour;
        }
        str += ":";
        if (minute == 0) {
            str += "00";
        } else if (minute > 0 && minute < 10) {
            str += "0" + minute;
        } else {
            str += minute;
        }
        str += ":";
        if (second == 0) {
            str += "00";
        } else if (second > 0 && second < 10) {
            str += "0" + second;
        } else {
            str += second;
        }
        return str;
    }
    getRedbagLevel(): number { //获得当前红包奖励关卡
        let completedLevel = this.getCompletedLevel();
        let titleLv = 0;
        for (let index = 0; index < rewardInfo.length; index++) {
            if (completedLevel >= rewardInfo[index].level) {
                titleLv = index + 1;
            }
        }
        if (completedLevel >= this.getTotleLevel()) {
            titleLv = rewardInfo.length - 1;
        }
        return titleLv;
    }

    getCompletedLevel(): number {

        return 0;
    }

    getTotleLevel(): number {

        return 0;
    }

    getNextTargetLevel(): number {
        let currentLevel = this.getCompletedLevel() + 1;
        var num = 0;
        for (var i = 0; i < rewardInfo.length; i++) {
            if (currentLevel >= rewardInfo[i].level && currentLevel <= rewardInfo[i + 1].level) {
                num = i + 1;
            }
        }
        console.log("[RedBagCtrler][getNextTargetLevel]", num)
        let value = rewardInfo[num].level;
        return value;
    }

    getNextTargetMoney(): number {
        let currentLevel = this.getCompletedLevel() + 1;
        var num = 0;
        for (var i = 0; i < rewardInfo.length; i++) {
            if (currentLevel >= rewardInfo[i].level && currentLevel <= rewardInfo[i + 1].level) {
                num = i + 1;
            }
        }
        console.log("[RedBagCtrler][getNextTargetMoney]", num)
        let value = rewardInfo[num].money;
        return value;
    }

    updateLevelRedbagData(): number {
        let index;
        let completedLevel = this.getCompletedLevel();
        for (let i = 0; i < rewardInfo.length; i++) {
            if (completedLevel >= rewardInfo[i].level && completedLevel <= rewardInfo[i + 1].level) {
                index = i;
            }
        }
        let money = rewardInfo[index].money;
        this.setCashMoney(money);
        return money;
    }

    directLookVideoToAddTime(cb: fw.cb) {
        fw.cls.sov.videoOrShare(Const.VideoADType.REDBAG, (s) => {
            if (s) {
                common.sceneMgr.showTipsUI(s)
            } else {
                this.addCashLeftTime();
                setTimeout(() => { cb && cb() }, 1000);
            }
        });
    }

    lookVideoToAddTime(cb: fw.cb) {

        var data = {
            /** 面板的标题文字, 不传则显示'提示' */
            titleText: "增加活动时长",
            /** 面板的内容文字, 不传则隐藏节点 */
            msgText: "看视频可增加6小时活动时长",
            /** yes选项按键上的文字, 不传则显示'同意' */
            yesText: "确定",
            /** no选项按键上的文字, 不传则显示'取消' */
            noText: "取消",
            /** yes选项按键按下时触发的回调, 不传则关闭面板, 处理回调后默认关闭面板, 回调中返回 true 可以保持面板不关闭 */
            yesCB: () => {
                fw.cls.sov.videoOrShare(Const.VideoADType.REDBAG, (s) => {
                    if (s) {
                        common.sceneMgr.showTipsUI(s)
                    } else {
                        this.addCashLeftTime();
                        setTimeout(() => { cb && cb() }, 1000);
                    }
                });
            },
            /** no选项按键按下时触发的回调, 不传则关闭面板, 处理回调后默认关闭面板, 回调中返回 true 可以保持面板不关闭 */
            noCB: () => { },
        }
        common.sceneMgr.showChoosePanel(data);
    }

    getRewardInfo() {
        return rewardInfo;
    }

    checkLevelRedbag() {
        let completedLevel = this.getCompletedLevel();
        for (let i = 0; i < rewardInfo.length; i++) {
            if (rewardInfo[i].level === completedLevel) {
                if (fw.lsd.getRedbagLevel.value[completedLevel]) return false
                fw.lsd.getRedbagLevel.value[completedLevel] = 1;
                fw.lsd.getRedbagLevel.update();
                return true;
            }
        }
        return false;
    }

}

let rewardInfo =
    [
        { title: "完成第6关", level: 6, money: 1 },
        { title: "完成第12关", level: 12, money: 1 },
        { title: "完成第20关", level: 20, money: 1 },
        { title: "完成第30关", level: 30, money: 2 },
        { title: "完成第40关", level: 40, money: 2 },
        { title: "完成第50关", level: 50, money: 2 },
        { title: "完成第70关", level: 70, money: 2 },
        { title: "完成第90关", level: 90, money: 2 },
        { title: "完成第110关", level: 110, money: 2 },
        { title: "完成第130关", level: 130, money: 2 },
        { title: "完成第150关", level: 150, money: 2 },
        { title: "完成第170关", level: 170, money: 3 },
        { title: "完成第190关", level: 190, money: 3 },
        { title: "完成第210关", level: 210, money: 3 },
        { title: "完成第230关", level: 230, money: 3 },
        { title: "完成第250关", level: 250, money: 3 },
        { title: "完成第270关", level: 270, money: 3 },
        { title: "完成第290关", level: 290, money: 4 },
        { title: "完成第310关", level: 310, money: 4 },
        { title: "完成第330关", level: 330, money: 4 },
        { title: "完成第350关", level: 350, money: 5 },
        { title: "完成第380关", level: 380, money: 5 },
        { title: "完成第400关", level: 400, money: 10 },
        { title: "完成第400关", level: 400, money: 10 },
        { title: "第400关以后每20关", level: 1000, money: 10 }
    ];
