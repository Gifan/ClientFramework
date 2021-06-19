import { Manager } from "../manager/Manager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class ExSprite extends cc.Sprite {
    start() {
        if (!CC_EDITOR) {
            if (cc.sys.language != cc.sys.LANGUAGE_CHINESE) {
                let spriteframename = this.spriteFrame.name;
                if (spriteframename) {
                    this.spriteFrame = null;
                    const url = "ui/word/" + cc.sys.language + "/" + spriteframename;
                    Manager.loader.loadSpriteAsync(url).then(res => {
                        this.spriteFrame = res;
                    }).catch(err => {
                        cc.error("error");
                    });
                }
            }
        }
    }
    onLoad() {

    }
}
