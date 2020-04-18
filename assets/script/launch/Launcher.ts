import { Time } from "../framework/manager/Time";
import { Manager } from "../util/Manager";
import { UILauncher } from "./UILauncher";
import { NetLauncher } from "./NetLauncher";
import { ModuleLauncher } from "./ModuleLauncher";
import { SdkLauncher } from "./SdkLauncher";
import { Const } from "../config/Const";
// import { Cfg } from "../config/Cfg";
import { EPlatform } from "../sdk/WonderSdk/config/SdkConfig";
import { WonderSdk } from "../sdk/WonderSdk/WonderSdk";
import { Notifier } from "../framework/notify/Notifier";
import { ListenID } from "../ListenID";
// import { EventDefine } from "../config/EventCfg";
import { Log } from "../framework/Log";

declare var window: any;
const { ccclass, property } = cc._decorator;

@ccclass
export default class Launcher extends cc.Component {
    @property({ displayName: "测试模式" }) testMode: boolean = false;
    @property({ type: Const.CEPlatform, displayName: "浏览器调试使用的启动参数平台" }) bmsPlatformForDebug = Const.CEPlatform.dev;
    @property({ type: Const.CustomPlatform, displayName: "自定义平台" }) CustomPlatform = EPlatform.WEB_DEV;

    onLoad() {
        cc.game.addPersistRootNode(this.node);
    }
    async start() {
        this.initWonderFrameWork();//初始化平台相关配置
        new UILauncher();
        new NetLauncher();
        new ModuleLauncher();
        // Notifier.send(ListenID.Event_SendEvent, EventDefine.inload, 1);
        // await this.loadConfig();
        new SdkLauncher();

        // this.onTest();
    }

    update(dt) {
        Time.update(dt);
        Manager.loader.update(dt);
    }

    onTest() {
    }

    public initWonderFrameWork() {
        WonderSdk.init(this.CustomPlatform, this.testMode);
        //设置浏览器全部不能全屏
        // if (cc.sys.isMobile) {
        //     cc.view.enableAutoFullScreen(false);
        // }
    }

    loadConfig() {
        let url = `${Const.JsonRemoteUrl}/${wonderSdk.BMS_APP_NAME}${wonderSdk.BMS_VERSION}/${this.testMode ? "debug" : "release"}/config/`;
        // return Promise.all([
        //     Cfg.initRemoteConfig(url + "Idiom"),
        // ]);
    }
}


