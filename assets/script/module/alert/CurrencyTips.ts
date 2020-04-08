
import { GameUtil } from "../../util/GameUtil";
import { Const } from "../../config/Const";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CurrencyTips extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property([cc.SpriteFrame])
    spriteframes: cc.SpriteFrame[] = [];

    @property(cc.Sprite)
    currency: cc.Sprite = null;

    start() {

    }

    setText(type: Const.CurrencyType, text: number) {
        let sign = "+";
        if (type == Const.CurrencyType.Diamond) {
            this.currency.spriteFrame = this.spriteframes[1];
        } /*else if (type == Const.CurrencyType.Power) {
            this.currency.spriteFrame = this.spriteframes[2];
        } */else {
            this.currency.spriteFrame = this.spriteframes[0];
        }
        if (text < 0) {
            sign = "-";
        }

        this.label.string = sign + GameUtil.changeGoldStr(Math.abs(text));
    }
}
