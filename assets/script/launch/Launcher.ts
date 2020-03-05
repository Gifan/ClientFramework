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
import * as CtrlerIniter from "./StartUpCtrl";
import Framework from "../../../packages/fw-gjj/FrameWork/fw_gjj_framework/fw_gjj_Framework";
import { Const } from "../config/Const";

declare var window: any;
const { ccclass, property } = cc._decorator;

@ccclass
export default class Launcher extends cc.Component {
    @property({ displayName: "测试模式" }) testMode: boolean = false;
    @property({ type: Const.CEPlatform, displayName: "浏览器调试使用的启动参数平台" }) bmsPlatformForDebug = Const.CEPlatform.dev;
    @property({ type: Const.CustomPlatform, displayName: "自定义平台" }) CustomPlatform = Const.CustomPlatform.dev;

    onLoad() {
        cc.game.addPersistRootNode(this.node);
    }
    start() {
        this.initWonderFrameWork();//初始化平台相关配置
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
        args.setId(FuncDefine.Login);
        Notifier.send(NotifyID.Func_Open, args);
    }

    public initWonderFrameWork() {
        let config = this.initFrameWorkConfig();
        Framework.Instance.startUp(config);

        // fw.lsd = DataIniter.initLocalStorageData();
        // if (window["qq"]) { fw.lsd = DataIniter.initLocalStorageData(); } 
        // let day = new Date().getDate();
        // let loginday = cc.sys.localStorage.getItem("zqddn_zhb_loginDay");
        // if (day - loginday > 0) fw.sdk.showSplashAd(cst.SplashADType.NOMAL);

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
            bbConfig: { extendPropertys: null, },
        }
    }
}


