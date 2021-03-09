import { Manager } from "../../manager/Manager";
import { HitType } from "./AlertManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class OutputTips extends cc.Component {

    @property(cc.Sprite)
    spriteIcon: cc.Sprite = null;

    start() {

    }

    showTips(type: HitType, nodepool?: cc.NodePool) {
        let suffix = "";
        if (cc.sys.language != cc.sys.LANGUAGE_CHINESE) {
            suffix = "_en";
        }
        Manager.loader.loadSpriteAsync(`ui/common/outputtips/output${type}${suffix}`).then(res => {
            this.spriteIcon.spriteFrame = res;
            res.addRef();
            cc.tween(this.node).by(1, { y: 200 }, { easing: cc.easing.expoOut }).to(0.15, { opacity: 0 }).call(() => {
                this.spriteIcon.spriteFrame = null;
                res.decRef();
                if (nodepool) {
                    nodepool.put(this.node);
                } else {
                    this.node.destroy();
                }
            }).start();
        }).catch(err => {
            this.node.destroy();
        })
    }

    unuse() {

    }
    reuse() {
        this.node.opacity = 255;
        this.node.active = true;
    }
}
