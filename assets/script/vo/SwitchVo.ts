export class SwitchVo {
    public adsclose: string = "no";
    public fullScreenAd: number = 0;
    public iosShowMoney: string = "no";
    public isAuditing: number = 0;
    public redbag: string = "no";
    public share: string = "ip";
    public showNotEnoughGoldBtn: string = "no";
    public spaceWinFullScreenAd: number = 5;
    public startWinFullScreenAd: number = 9;
    public videoicon: string = "all";
    public idiomVideoicon: string = "all";
    public winbox: string = "no";
    public winbtnjump: string = "no";
    public level_5: number = 10;
    public isEnableIp: number = 0;//0不开放  1开放

    public updateSwitchVo(res: Object): void {
        Object.getOwnPropertyNames(this).forEach(function (key) {
            if (res.hasOwnProperty(key)) {
                this[key] = res[key];
            }
        }.bind(this));
    }

    /**
     * 审核期间 false all 开放
     * @param type 名字
     */
    getConditionByTag(type): boolean {
        if (this.isAuditing) {
            return false;
        }
        else {
            if (this[type] == 'no') {
                return false;
            }
            else if (this[type] == 'ip') {
                if (type == "videoicon" || type == "videoicon1") {
                    return this.isEnableIp == 0;
                } else {
                    return this.isEnableIp != 0;
                }
            }
            else {
                return true;
            }
        }
    }

    public get isShowNotEnoughGold(): boolean {
        return this.getConditionByTag("showNotEnoughGoldBtn");
    }

    public get isShowVideoIcon(): boolean {
        return this.getConditionByTag("videoicon");
    }
    public get isShowIdiomVideoIcon(): boolean {
        return this.getConditionByTag("idiomVideoicon");
    }
}