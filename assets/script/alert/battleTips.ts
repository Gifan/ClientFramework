import { MVC } from "../framework/MVC";

const { ccclass, property } = cc._decorator;

@ccclass
export default class battleTips extends MVC.BaseView {

    @property(cc.Animation)
    anim: cc.Animation = null;

    @property(cc.Label)
    allBattleText: cc.Label = null;

    @property(cc.Label)
    addBattle: cc.Label = null;

    protected changeListener(enable: boolean): void {

    }

    public onOpen(args) {
        super.onOpen(args);
        this.setInfo(args);
    }

    private oldNum: number = 0;
    private newNum: number = 0;
    private startClose = false;
    public setInfo(args) {
        this.unscheduleAllCallbacks();
        this.oldNum = args.oldBattleNum;
        this.newNum = args.newBattleNum;
        let a = args.newBattleNum - args.oldBattleNum;
        let b = Math.abs(a);
        let dir = a / b;
        let op = dir > 0 ? "+" : "-";
        this.addBattle.string = `${op}${b}`;
        this.addBattle.node.color = dir >= 0 ? cc.Color.WHITE.fromHEX("#83F35D") : cc.Color.WHITE.fromHEX("#E25744");
        this.allBattleText.string = `${args.newBattleNum}`;
        this.anim.play();
        let timenum = 0;
        let times = 0;

        if (b >= 20) {
            timenum = Math.floor(b / 20) * dir;
            times = 20;
        } else {
            timenum = 1 * dir;
            times = b;
        }

        let num = 0;
        this.startClose = false;
        this.schedule(() => {
            num++;
            this.oldNum += timenum;
            this.allBattleText.string = `${this.oldNum}`;
            if (num >= times) {
                this.startClose = true;
                this.downtime = 0.5;
                this.allBattleText.string = `${this.newNum}`;
            }
        }, 0.05, times - 1, 0);
    }

    public onClose() {
        super.onClose();
    }

    private downtime = 0.5;
    public update(dt) {
        if (this.startClose) {
            this.downtime -= dt;
            if (this.downtime <= 0) {
                this.startClose = false;
                this.onClose();
            }
        }
    }
}
