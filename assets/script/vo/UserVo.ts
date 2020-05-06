export class UserVo {
    public day: number = 0;
    public gold: number = 2;
    public diamond: number = 0;
    public isAcceptPrivacy:boolean = false;
    public updatetUserVo(res: Object): void {
        Object.getOwnPropertyNames(this).forEach(function (key) {
            if (res.hasOwnProperty(key)) {
                this[key] = res[key];
            }
        }.bind(this));
    }

    public serializeAll():string{
        let data = {
            day: this.day,
            gold: this.gold,
            diamond: this.diamond,
        }
        return JSON.stringify(data);
    }
}