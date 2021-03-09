import { Manager } from "../manager/Manager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class ExSprite extends cc.Sprite {
    onLoad() {
        if (!CC_EDITOR) {
            let DrawRescueKey = "DrawRescueKey";
            if (cc.sys.language != cc.sys.LANGUAGE_CHINESE) {
                let spriteframename = this.spriteFrame.name;
                if (spriteframename) {
                    this.spriteFrame = null;
                    const url = "ui/word/" + window[DrawRescueKey] + "/" + spriteframename;
                    Manager.loader.loadSpriteAsync(url).then(res => {
                        this.spriteFrame = res;
                    }).catch(err => {
                        cc.error("error");
                    });
                }
            }
        }
    }
}
