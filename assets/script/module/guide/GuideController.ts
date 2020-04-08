import { MVC } from "../../framework/MVC";
import { Notifier } from "../../framework/notify/Notifier";
import GuideModel from "./GuideModel";
import { CallID } from "../../CallID";
import { ListenID } from "../../ListenID";
import { UIManager } from "../../framework/manager/UIManager";
import { Cfg } from "../../config/Cfg";
import { Log } from "../../framework/Log";
import { GuideDefine } from "../../config/GuideCfg";

/*
 * desc
 */
export class GuideController extends MVC.MController<GuideModel> {
    public constructor() {
        super();
        this.setup(GuideModel.getInstance);
        this.changeListener(true);
    }
    public reset(): void { }

    public get classname(): string {
        return "GuideController";
    }
    protected registerAllProtocol(): void {

    }

    protected changeListener(enable: boolean): void {
        //    Notifier.changeListener(enable, ListenID.Scene_AskSwitch, this.onAskSwitch, this);
        Notifier.changeCall(enable, CallID.Guide_isGuiding, this.isGuiding, this);
        Notifier.changeListener(enable, ListenID.Guide_StartGuide, this.startGuide, this);
        Notifier.changeListener(enable, ListenID.Guide_CheckGuide, this.checkGuide, this);
        Notifier.changeCall(enable, CallID.Guide_GetGuideId, this.getCurGuideId, this);
        Notifier.changeListener(enable, ListenID.Compose_ComposeSuccess, this.composeSuccess, this);
        Notifier.changeListener(enable, ListenID.Idiom_AnswerRight, this.answerRight, this);
    }

    public isGuiding() {
        return this._model.isGuiding;
    }
    public startGuide(guideId: number, param) {
        let obj = new MVC.OpenArgs();
        obj.setUiLayer(MVC.eUILayer.Guide).setParam({ guideId: guideId, clickAreas: param })
        UIManager.Open('ui/guide/GuideView', obj);
    }

    public onCloseGuideView() {
        UIManager.Close('ui/guide/GuideView');
    }
    public getCurGuideId(): number {
        return this._model.getGuideId();
    }

    public composeSuccess(id: number) {
        if (this._model.isGuiding && this._model.getGuideId() == GuideDefine.BuyCompose) {
            this.onCloseGuideView();
            this._model.setGuideId(this._model.getGuideId() + 1);
        }
    }
    public answerRight() {
        let guideid = this._model.getGuideId();
        if (this._model.isGuiding && (guideid == GuideDefine.UnLockIdiom || guideid == GuideDefine.PlayVerticalForward || guideid == GuideDefine.ResetIdiom || guideid == GuideDefine.PlayVerticalReverse)) {
            this.onCloseGuideView();
            this._model.setGuideId(guideid + 1);
        }
    }

    public checkGuide(param: any, param2: any) {
        // if (!Cfg.Guide.get(guideId)) return;
        let passguideid = this._model.getGuideId();
        let curguideid = passguideid + 1;
        // Log.log("curguideid", curguideid, passguideid);
        if (!Cfg.Guide.get(curguideid)) return;
        if (curguideid == GuideDefine.BuyCompose || curguideid == GuideDefine.BuyComposeAgain) {
            let info = Notifier.call(CallID.Compose_GetGuideInfoByIndex, GuideDefine.BuyCompose);
            if (info)
                this.startGuide(curguideid, info);
        } else if (curguideid == GuideDefine.DragCompose) {//拖动
            let info = Notifier.call(CallID.Compose_GetGuideInfoByIndex, GuideDefine.DragCompose);
            if (info) this.startGuide(curguideid, info);
        } else if (curguideid == GuideDefine.UnLockIdiom) {//解锁闯关
            if (param && param >= 5) {//大于等于5级开始引导
                let info = Notifier.call(CallID.Compose_GetGuideInfoByIndex, GuideDefine.UnLockIdiom)
                if (info) this.startGuide(curguideid, info);
            }
        } else if (curguideid == GuideDefine.PlayVerticalForward) {
            if (param && param == 1) {//第一关
                let info = Notifier.call(CallID.Idiom_GetGuideInfoByIndex, GuideDefine.PlayVerticalForward);
                if (info) this.startGuide(curguideid, info);
            }
        } else if (curguideid == GuideDefine.PlayHorForward) {
            if (param && param == 1) {
                if (param2) {//第一关首次打开直接调过防止卡死
                    this._model.setGuideId(curguideid);
                } else {
                    let info = Notifier.call(CallID.Idiom_GetGuideInfoByIndex, GuideDefine.PlayHorForward);
                    if (info) this.startGuide(curguideid, info);
                }
            }
        } else if (curguideid == GuideDefine.ResetIdiom) {
            if (param && param == 3) {
                let info = Notifier.call(CallID.Idiom_GetGuideInfoByIndex, GuideDefine.ResetIdiom);
                if (info) this.startGuide(curguideid, info);
            }
        } else if (curguideid == GuideDefine.PlayVerticalReverse) {
            if (param && param == 4) {
                let info = Notifier.call(CallID.Idiom_GetGuideInfoByIndex, GuideDefine.PlayVerticalReverse);
                if (info) this.startGuide(curguideid, info);
            }
        } else if (curguideid == GuideDefine.PlayHorReverse) {
            if (param && param == 4) {
                if (param2) {//第4关首次打开直接调过防止卡死
                    this._model.setGuideId(curguideid);
                } else {
                    let info = Notifier.call(CallID.Idiom_GetGuideInfoByIndex, GuideDefine.PlayHorReverse);
                    if (info) this.startGuide(curguideid, info);
                }
            }
        } else if (curguideid == GuideDefine.ReturnHome) {
            let info = Notifier.call(CallID.Travel_GetRoleGuideInfoByIndex, GuideDefine.ReturnHome);
            if (info) this.startGuide(curguideid, info);
        } else if (curguideid == GuideDefine.RoleUpgradeUp) {
            let info = Notifier.call(CallID.Travel_GetGuideInfoByIndex, GuideDefine.RoleUpgradeUp);
            if (info) this.startGuide(curguideid, info);
        }
        else if (curguideid == GuideDefine.TipsIdiom) {
            if (param && param == 6) {
                let info = Notifier.call(CallID.Idiom_GetGuideInfoByIndex, GuideDefine.TipsIdiom);
                if (info) this.startGuide(curguideid, info);
            }
        } else if (curguideid == GuideDefine.FindIdiom) {
            if (param && param == 9) {
                let info = Notifier.call(CallID.Idiom_GetGuideInfoByIndex, GuideDefine.FindIdiom);
                if (info) this.startGuide(curguideid, info);
            }
        }

        // if (guideId == 1) {//点击购买
        //     this.startGuide(guideId, param);
        // } else if (guideId == 2) {//拖动
        //     this.startGuide(guideId, param);
        // } else if (guideId == 3) {
        //     this.startGuide(guideId, param);
        // } else if (guideId == 4) {
        //     this.startGuide(guideId, param);
        // }else if(guideId == 5){
        //     this.startGuide(guideId, param);
        // }else if
    }
}

