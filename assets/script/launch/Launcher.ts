import { Time } from "../framework/manager/Time";
import { Manager } from "../framework/manager/Manager";
import { UILauncher } from "./UILauncher";
import { NetLauncher } from "./NetLauncher";
import { ModuleLauncher } from "./ModuleLauncher";
import { SdkLauncher } from "./SdkLauncher";
import { Notifier } from "../framework/notify/Notifier";
import { FuncDefine } from "../config/FuncCfg";
import { MVC } from "../framework/MVC";
import { NotifyID } from "../framework/notify/NotifyID";
import { Config } from "../../../packages/fw-gjj/FrameWork/fw_gjj_framework/config/fw_gjj_Config";
import * as CtrlerIniter from "./yxj_gjj_StartUp_CtrlerIniter";
import * as DataIniter from "./yxj_gjj_StartUp_DataIniter";
import { GameConst } from "../config/yxj_gjj_const";
import Framework from "../../../packages/fw-gjj/FrameWork/fw_gjj_framework/fw_gjj_Framework";

declare var window:any;
export let CEPlatform = cc.Enum({ dev: 0, wx: 1, bd: 2, qq: 3, ios: 4, android: 5, H5_4399: 6 });
export let CustomPlatform = cc.Enum({ dev: 0, H5_4399: 1, H5_QTT: 2, H5_MOLI: 3, H5_UC: 4, SINA: 5, H5_ZHANG_YU: 6, NV_ANDROID_SIX_K_PLAY: 7, NV_ANDROID_WONDER_BOX: 8 });

const { ccclass, property } = cc._decorator;

@ccclass
export default class Launcher extends cc.Component {
    @property({ displayName: "测试模式" }) testMode: boolean = false;
    @property({ type: CEPlatform, displayName: "浏览器调试使用的启动参数平台" }) bmsPlatformForDebug = CEPlatform.dev;
    @property({ type: CustomPlatform, displayName: "自定义平台" }) CustomPlatform = CustomPlatform.dev;

    onLoad() {
        cc.game.addPersistRootNode(this.node);
    }
    start() {
        this.initWonderFrameWork();
        new UILauncher();
        new NetLauncher();
        new ModuleLauncher();
        new SdkLauncher();
    }

    update(dt) {
        Time.update(dt);
        Manager.loader.update(dt);
    }

    onTest() {
        let args = new MVC.OpenArgs();
        args.setId(FuncDefine.Login)
        Notifier.send(NotifyID.Func_Open, args);
    }

    public initWonderFrameWork(){
        window["cst"] = GameConst;
        let config = this.initFrameWorkConfig();
        Framework.Instance.startUp(config);
        fw.lsd = DataIniter.initLocalStorageData();
        if (window["qq"]) { fw.lsd = DataIniter.initLocalStorageData(); } 
        let day = new Date().getDate();
        let loginday = cc.sys.localStorage.getItem("zqddn_zhb_loginDay");
        if (day - loginday > 0) fw.sdk.showSplashAd(cst.SplashADType.NOMAL);

        //设置浏览器全部不能全屏
        if (cc.sys.isMobile) {
            cc.view.enableAutoFullScreen(false);
        }
    }

    public initFrameWorkConfig(): Config.FrameWorkConfig {
        let PlatformConfig = CtrlerIniter.initPlatformConfig(this.bmsPlatformForDebug, this.CustomPlatform);
        return {
            TestMode: this.testMode,
            platform: PlatformConfig.platform,
            sdkMgrConfig: PlatformConfig.sdkMgrConfig,
            bbConfig: { extendPropertys: DataIniter.getGBB_ExtendPropertys(), },
        }
    }
}


