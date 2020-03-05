export class SwitchVo {
    public updateSwitchVo(res: Object): void {
        Object.getOwnPropertyNames(this).forEach(function (key) {
            if (res.hasOwnProperty(key)) {
                this[key] = res[key];
            }
        }.bind(this));
    }
}