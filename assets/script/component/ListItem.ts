import { Log } from "../framework/Log";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ListItem extends cc.Component {

    public itemID: number = 0;

    public initItem(index: number, data: any) {
        this.itemID = index;
    }

    public updateItem(index: number, data: any) {
        this.itemID = index;
    }
}
