import { MVC } from "../../framework/MVC";
import NormalTips from "./NormalTips";
import { GameUtil } from "../../util/GameUtil";
import { UIManager } from "../../framework/manager/UIManager";
import { Const } from "../../config/Const";
import CurrencyTips from "./CurrencyTips";

export enum AlertType {
    COMMON = 0, //普通
    SELECT = 1,   //帮助提示框
}

let _alertInstance: AlertManager;
export class AlertManager {
    private static _canShow: boolean = true;
    public static showNormalTips(text: string, uilayer: MVC.eUILayer = MVC.eUILayer.Tips, time: number = 1, ydis: number = 70): void {
        // if(this._canShow){
        let self = this;
        GameUtil.loadPrefab("ui/common/alert/tip").then((node) => {
            self._canShow = false;
            node.getComponent(NormalTips).setText(text);
            var action1 = cc.moveBy(time, cc.v2(0, ydis));
            var action2 = cc.fadeOut(1)
            node.group = "UI";
            node.setParent(UIManager.layerRoots(uilayer));
            node.runAction(cc.sequence(action1, action2, cc.callFunc(() => {
                node.stopAllActions();
                node.destroy();
                self._canShow = true;
            })));
        })
        // }
    }

    /**
     * @description 根据不同弹窗类型显示弹窗显示弹窗
     * @author 吴建奋
     * @date 2019-03-09
     * @static
     * @param {AlertType} alertType
     * @param {*} args
     * desc: "描述",
     * confirmText: "确认按钮文字",
     * cancelText: "取消按钮文字",
     * confirm: 确定回调
     * cancel:取消回调
     * @memberof AlertManager
     */
    public static showAlert(alertType: AlertType, args: any) {
        let openargs = new MVC.OpenArgs();
        openargs.setUiLayer(MVC.eUILayer.SubPopup).setTransition(MVC.eTransition.Default).setParam(args);
        if (alertType == AlertType.COMMON) {
            UIManager.Open("ui/common/alert/CommonAlert", openargs);
        } else if (alertType == AlertType.SELECT) {
            /**
             * args
             * desc: "描述",
             * confirmText: "确认按钮文字",
             * cancelText: "取消按钮文字",
             * confirm"
             */
            UIManager.Open("ui/common/alert/SelectAlert", openargs);
        }
    }

    public static showSelectAlert(args: any) {
        AlertManager.showAlert(AlertType.SELECT, args);
    }

    public static OutputtipPool: cc.NodePool = new cc.NodePool();
    public static showOutPutTips(text: string, parent: cc.Node = null, pos: cc.Vec2 = cc.Vec2.ZERO, index: number = 0): void {
        let node1 = this.OutputtipPool.get();
        let call = (node: cc.Node) => {
            node.getChildByName("tipsText").getComponent(cc.Label).string = `+${text}`;
            node.active = true;
            node.opacity = 10;
            if (!cc.isValid(parent)) return;
            node.parent = parent;
            node.position = cc.v2(pos.x, pos.y + 5);
            let seq2 = cc.sequence(
                cc.spawn(
                    cc.fadeIn(0.5),
                    cc.moveTo(0.5, cc.v2(pos.x, pos.y + 75))
                ),
                cc.delayTime(0.4),
                cc.spawn(
                    cc.fadeOut(0.7),
                    cc.moveTo(0.7, cc.v2(pos.x, pos.y + 115))
                ),
                cc.callFunc(() => {
                    this.OutputtipPool.put(node);
                })
            );
            node.runAction(seq2);
        }
        if (!node1) {
            GameUtil.loadPrefab("ui/common/alert/OutPutTips").then((node2) => {
                call(node2);
            })
        } else {
            call(node1);
        }
    }

    /**
     * 展示通过提示 每次只会弹出一个
     * @param text 
     * @param parent 
     * @param time 
     * @param ydis 
     * @param pos 
     */
    public static canShow: boolean = true;
    public static tipPool: cc.NodePool = new cc.NodePool('NormalTips');
    public static showNormalTipsOnce(text: string, parent: cc.Node = null, time: number = 0.7, ydis: number = 50, pos: cc.Vec2 = cc.Vec2.ZERO): void {
        if (!AlertManager.canShow) return;
        AlertManager.canShow = false;
        let node1 = this.tipPool.get();
        let call = (node) => {
            node.getComponent(NormalTips).setText(text);
            node.position = pos;
            node.opacity = 20;
            let action1 = cc.moveBy(time, cc.v2(0, ydis));
            let action2 = cc.fadeOut(time)
            let action3 = cc.fadeIn(0.4);
            let action4 = cc.spawn(action1, action3);
            let action5 = cc.spawn(action2, action1);
            node.group = "UI";
            if (parent && cc.isValid(parent)) {
                node.parent = parent;
            } else {
                node.setParent(UIManager.layerRoots(MVC.eUILayer.Tips));
            }
            node.runAction(cc.sequence(action4, cc.delayTime(0.5), action5, cc.callFunc(() => {
                this.tipPool.put(node);
                AlertManager.canShow = true;
            })));
        }
        if (!node1) {
            GameUtil.loadPrefab("ui/common/alert/tip").then((node2) => {
                call(node2);
            })
        } else {
            call(node1);
        }
    }

    /**
     * 展示通过提示 每次只会弹出一个
     * @param text 
     * @param parent 
     * @param time 
     * @param ydis 
     * @param pos 
     */
    public static currencyPool: cc.NodePool = new cc.NodePool();
    public static showCurrency(text: number, type: Const.CurrencyType, parent: cc.Node = null, time: number = 0.7, pos: cc.Vec2 = cc.Vec2.ZERO): void {
        let node1 = this.currencyPool.get();
        let call = (node) => {
            node.getComponent(CurrencyTips).setText(type, text);
            node.position = pos;
            node.opacity = 20;
            let action1 = cc.moveBy(time, cc.v2(0, 50));
            let action2 = cc.fadeOut(time)
            let action3 = cc.fadeIn(0.4);
            let action4 = cc.spawn(action1, action3);
            let action5 = cc.spawn(action2, action1);
            node.group = "UI";
            if (parent && cc.isValid(parent)) {
                node.parent = parent;
            } else {
                node.setParent(UIManager.layerRoots(MVC.eUILayer.Tips));
            }
            node.runAction(cc.sequence(action4, cc.delayTime(0.5), action5, cc.callFunc(() => {
                this.currencyPool.put(node);
            })));
        }
        if (!node1) {
            GameUtil.loadPrefab("ui/common/alert/CurrencyTip").then((node2) => {
                call(node2);
            })
        } else {
            call(node1);
        }
    }
}
