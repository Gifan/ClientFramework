import { MVC } from "../../framework/MVC";
import { Cfg } from "../../config/Cfg";
import GuideModel from "./GuideModel";
import { Log } from "../../framework/Log";
import { GuideCfg, GuideDefine } from "../../config/GuideCfg";
import { Manager } from "../../util/Manager";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("视图组件/Guide/GuideView")
export class GuideView extends MVC.BaseView {

    @property(cc.Node)
    maskbg: cc.Node = null;

    @property(cc.Node)
    descBg: cc.Node = null;

    @property(cc.RichText)
    descText: cc.RichText = null;

    @property(cc.Node)
    finger: cc.Node = null;

    @property(cc.Node)
    btnKnow: cc.Node = null;

    @property(cc.Node)
    touchNode: cc.Node = null;

    protected changeListener(enable: boolean): void {
        //Notifier.changeListener(enable, NotifyID.Game_Update, this.onUpdate, this);
        this.registerTouchOperate(enable);
    }

    /*
     * 打开界面回调
     */
    protected onOpen(): void {
        super.onOpen();
        GuideModel.getInstance.isGuiding = true;
        this.setInfo();
    }

    /*
     * 主动关闭界面
     */
    public close(): void {
        super.close();
    }

    /*
     * 关闭界面后
     */
    public onClose(): void {
        super.onClose();
        GuideModel.getInstance.isGuiding = false;
    }

    /*
     * 完全显示界面后
     */
    public onShowFinish(): void {
        super.onShowFinish();
    }

    public registerTouchOperate(boo) {
        if (boo) {
            this.touchNode.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
            this.touchNode.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
            this.touchNode.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
            this.touchNode.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
        } else {
            this.touchNode.off(cc.Node.EventType.TOUCH_START, this.touchStart, this);
            this.touchNode.off(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
            this.touchNode.off(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
            this.touchNode.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
        }
    }
    public clickAreas: number[][] = [];
    public guideInfo: GuideCfg;
    public setInfo() {
        let guideId = this._openArgs.param.guideId;
        let guideinfo = Cfg.Guide.get(guideId);
        this.guideInfo = guideinfo;
        if (!guideinfo) {
            this.scheduleOnce(() => {
                this.close();
            }, 0.2);
        }
        this.descText.string = guideinfo.guideDesc;
        this.btnKnow.active = guideinfo.guideType == 2;
        if (!guideinfo.fingerInfo) {
            this.finger.active = false;
        } else {
            this.finger.active = true;
        }
        this.descBg.parent.position = cc.v2(guideinfo.descPos[0], guideinfo.descPos[1]);
        setTimeout(() => {
            this.descBg.width = this.descText.node.width + 50;
            this.descBg.height = this.descText.node.parent.height + 50;
        }, 50);
        let clickAreas = this._openArgs.param.clickAreas;//如果传入了区域，直接用传入的，否则用自带的
        if (clickAreas) {//默认先用第一个
            this.clickAreas = clickAreas;
        } else {
            this.clickAreas = guideinfo.guideArea;
        }

        if (this.clickAreas.length > 0) {
            let pos = cc.v2(this.clickAreas[0][0], this.clickAreas[0][1]);
            this.maskbg.parent.position = pos;
            this.maskbg.position = cc.v2(-pos.x, -pos.y);
            if (!this.clickAreas[0][3]) {//圆形
                this.maskbg.parent.height = this.clickAreas[0][2];
                this.maskbg.parent.getComponent(cc.Mask).type = cc.Mask.Type.ELLIPSE;
            } else {
                this.maskbg.parent.getComponent(cc.Mask).type = cc.Mask.Type.RECT;
                this.maskbg.parent.height = this.clickAreas[0][3];
            }
            this.maskbg.parent.width = this.clickAreas[0][2];
        }
        if (this.finger.active) {//[offsetx,offsety,targetoffsetx,targetoffsety,移动时间，手指旋转角度]
            this.finger.stopAllActions();
            let startPos = this.maskbg.parent.position.add(cc.v2(guideinfo.fingerInfo[0], guideinfo.fingerInfo[1]));
            let endPos = this.maskbg.parent.position.add(cc.v2(guideinfo.fingerInfo[2], guideinfo.fingerInfo[3]));
            this.finger.position = startPos;
            this.finger.angle = -guideinfo.fingerInfo[5] || 0;
            let returntime = guideinfo.fingerInfo[4];
            if (guideinfo.guideType == 3) {
                returntime = 0.01;
            }
            this.finger.runAction(cc.repeatForever(cc.sequence(cc.moveTo(guideinfo.fingerInfo[4], endPos), cc.moveTo(returntime, startPos))));
        }
    }

    public onClickFrame() {
        this.node._touchListener.setSwallowTouches(false);
    }

    public touchStart(event: cc.Event.EventTouch) {
        let pos = event.getLocation();
        let viewpos = this.touchNode.convertToNodeSpaceAR(pos);
        if (this.isClickAreas(viewpos)) {
            this.touchNode._touchListener.setSwallowTouches(false)
        } else {
            this.touchNode._touchListener.setSwallowTouches(true);
        }
    }
    public touchMove(event: cc.Event.EventTouch) {

    }
    public touchEnd(event: cc.Event.EventTouch) {
        let pos = event.getLocation();
        let viewpos = this.touchNode.convertToNodeSpaceAR(pos);
        if (this.isClickAreas(viewpos)) {
            if (this.guideInfo.guideType == 1 || this.guideInfo.guideType == 2) {//点击
                this.onClickKnow();
            }
        }
    }

    public isClickAreas(viewpos: cc.Vec2) {
        let offsetwidth = 0;
        let offsetheight = 0;
        if (this.guideInfo.id == GuideDefine.BuyCompose || this.guideInfo.id == GuideDefine.BuyComposeAgain) {//触碰区域变小
            offsetwidth = -50;
            offsetheight = -60;
        }
        for (let i = 0, len = this.clickAreas.length; i < len; i++) {
            let area = this.clickAreas[i];
            if (!area[3]) {//圆形
                if (cc.v2(area[0], area[1]).sub(viewpos).magSqr() <= area[2] * area[2]) {
                    return true;
                }
            } else {
                let rect = new cc.Rect(area[0] - (area[2] + offsetwidth) * 0.5, area[1] - (area[3] + offsetheight) * 0.5, area[2] + offsetwidth, area[3] + offsetheight);
                if (rect.contains(viewpos)) return true;
            }
        }
        return false;
    }
    public onClickKnow() {
        this.close();
        GuideModel.getInstance.setGuideId(GuideModel.getInstance.getGuideId() + 1);
        Manager.vo.saveUserData();
    }
}
