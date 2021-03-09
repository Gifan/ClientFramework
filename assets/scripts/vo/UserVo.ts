export interface SkinVoItem {
    //当前状态  0未解锁 1已解锁未装备 2已解锁已装备
    curState: number,
    //当前获得进度
    curProgress: number,
    //总进度
    allProgress: number,
}
export interface SkinVoMap {
    //皮肤id
    [id: number]: SkinVoItem,
}
export class UserVo {
    public day: number = 0;
    public loginDay: number = 0;//登录天数
    public gold: number = 0;

    public isAcceptPrivacy: boolean = false;


    //体力模块
    public power: number = -1;
    public powerRecoverTime: number = 0;
    public nextPowerTime: number = 0;

    //临时变量
    public isNewUser: boolean = true;//第一天登录算新用户
    public updatetUserVo(res: Object): void {
        Object.getOwnPropertyNames(this).forEach(function (key) {
            if (res.hasOwnProperty(key)) {
                this[key] = res[key];
            }
        }.bind(this));
    }

    public serializeAll(): string {
        let data = {
            day: this.day,
            loginDay: this.loginDay,
            gold: this.gold,
            power: this.power,
            powerRecoverTime: this.powerRecoverTime,
            nextPowerTime: this.nextPowerTime,
        }
        return JSON.stringify(data);
    }
}