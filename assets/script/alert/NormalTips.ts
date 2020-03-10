
const { ccclass, property } = cc._decorator;

@ccclass
export default class NormalTips extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    start() {

    }

    setText(text: string) {
        this.label.string = text;
    }
}
