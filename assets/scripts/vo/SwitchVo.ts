export class SwitchVo {
    public isAuditing: number = 0;
    public isEnableIp: number = 0;//0不开放  1开放
    public updateSwitchVo(res: Object): void {
        Object.getOwnPropertyNames(this).forEach(function (key) {
            if (res.hasOwnProperty(key)) {
                this[key] = res[key];
            }
        }.bind(this));
    }
}