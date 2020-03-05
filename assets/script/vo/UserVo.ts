export class UserVo {
    public updatetUserVo(res: Object): void {
        Object.getOwnPropertyNames(this).forEach(function (key) {
            if (res.hasOwnProperty(key)) {
                this[key] = res[key];
            }
        }.bind(this));
    }

    public serializeAll():string{
        let data = {

        }
        return JSON.stringify(data);
    }
}