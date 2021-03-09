import { MVC } from "../../framework/MVC";
import NormalTips from "./NormalTips";
import { Const } from "../../config/Const";
import CurrencyTips from "./CurrencyTips";
import { Manager } from "../../manager/Manager";
import { UIManager } from "../../manager/UIManager";
import OutputTips from "./OutputTips";

export enum AlertType {
    COMMON = 0, //普通
    SELECT = 1,   //帮助提示框
}

export enum HitType {
    BOOM = 0,//爆炸
    ROLL_OVER,//碾压
    BOUNCE_OFF,//弹开
    HEAD_SHOT,//爆头
}

export class AlertManager {
    private static _canShow: boolean = true;
    public static showNormalTips(text: string, uilayer: MVC.eUILayer = MVC.eUILayer.Tips, time: number = 1, ydis: number = 70): void {
        // if(this._canShow){
        let self = this;
        Manager.loader.loadPrefab("ui/common/alert/tip").then((node) => {
            self._canShow = false;
            node.getComponent(NormalTips).setText(text);
            node.group = "UI";
            node.setParent(UIManager.layerRoots(uilayer));
            cc.tween(node).by(time, { position: cc.v3(0, ydis, 0) }).to(1, { opacity: 0 }).call(() => {
                node.stopAllActions();
                node.destroy();
                self._canShow = true;
            }).start();
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

    public static showSelectAlert(args: {
        desc: string,//描述
        confirm?: Function,//确认回调
        cancel?: Function,//取消回调
        confirmText?: string,//确认按钮文字
        cancelText?: string,//取消按钮文字
        isVideo?: boolean,//是否需要视频icon
    }) {
        AlertManager.showAlert(AlertType.SELECT, args);
    }

    public static OutputtipPool: cc.NodePool = new cc.NodePool(OutputTips);
    public static showOutPutTips(type: HitType, parent: cc.Node = null, pos: cc.Vec3 = cc.Vec3.ZERO, index: number = 0): void {
        let node1 = this.OutputtipPool.get();
        let call = (node: cc.Node) => {
            node.active = true;

            node.getComponent(OutputTips).showTips(type, AlertManager.OutputtipPool);
            if (!parent || !cc.isValid(parent)) {
                let parenttips = UIManager.layerRoots(MVC.eUILayer.Tips);
                node.setParent(parenttips);
                node.position = parenttips.convertToNodeSpaceAR(pos);
            } else {
                node.position = pos;
                node.parent = parent;
            }
        }
        if (!node1) {
            Manager.loader.loadPrefab("ui/common/alert/OutPutTips").then((node2) => {
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
    public static showNormalTipsOnce(text: string, parent: cc.Node = null, time: number = 0.7, ydis: number = 50, pos: cc.Vec3 = cc.Vec3.ZERO): void {
        if (!AlertManager.canShow) return;
        AlertManager.canShow = false;
        let node1 = this.tipPool.get();
        let call = (node: cc.Node) => {
            node.getComponent(NormalTips).setText(text);
            node.position = pos;
            node.opacity = 20;
            node.group = "UI";
            if (parent && cc.isValid(parent)) {
                node.parent = parent;
            } else {
                node.setParent(UIManager.layerRoots(MVC.eUILayer.Tips));
            }
            let movetween = cc.tween().by(time, { position: cc.v3(0, ydis) });
            cc.tween(node)
                .parallel(movetween,
                    cc.tween().to(0.4, { opacity: 255 }))
                .delay(0.5)
                .by(time, { position: cc.v3(0, ydis), opacity: -255 })
                .call(() => {
                    this.tipPool.put(node);
                    AlertManager.canShow = true;
                }).start();
        }
        if (!node1) {
            Manager.loader.loadPrefab("ui/common/alert/tip").then((node2) => {
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
    public static showCurrency(text: number, type: Const.CurrencyType, parent: cc.Node = null, time: number = 0.7, pos: cc.Vec3 = cc.Vec3.ZERO): void {
        let node1 = this.currencyPool.get();
        let call = (node: cc.Node) => {
            node.getComponent(CurrencyTips).setText(type, text);
            node.position = pos;
            node.opacity = 20;
            node.group = "UI";
            if (parent && cc.isValid(parent)) {
                node.parent = parent;
            } else {
                node.setParent(UIManager.layerRoots(MVC.eUILayer.Tips));
            }
            let movetween = cc.tween().by(time, { position: cc.v3(0, 50) });
            cc.tween(node)
                .parallel(movetween,
                    cc.tween().to(0.4, { opacity: 255 }))
                .delay(0.5)
                .by(time, { position: cc.v3(0, 50), opacity: -255 })
                .call(() => {
                    this.currencyPool.put(node);
                }).start();
        }
        if (!node1) {
            Manager.loader.loadPrefab("ui/common/alert/CurrencyTip").then((node2) => {
                call(node2);
            })
        } else {
            call(node1);
        }
    }
}
