
import { UILauncher } from "./UILauncher";
import { NetLauncher } from "./NetLauncher";
import { ModuleLauncher } from "./ModuleLauncher";
import { SdkLauncher } from "./SdkLauncher";
import { EPlatform } from "../sdk/WonderSdk/config/SdkConfig";
import { WonderSdk } from "../sdk/WonderSdk/WonderSdk";
import { MVC } from "../framework/MVC";
import { Manager } from "../manager/Manager";
import { Time } from "../manager/Time";
import { UIManager } from "../manager/UIManager";
import { Cfg } from "../config/Cfg";
var ttTalentCommon = require('ttTalentCommon');

const { ccclass, property } = cc._decorator;
@ccclass
export default class Launcher extends cc.Component {
    @property({ displayName: "测试模式" }) testMode: boolean = false;
    @property({ type: EPlatform, displayName: "自定义平台" }) CustomPlatform = EPlatform.WEB_DEV;

    @property(cc.ProgressBar)
    progress: cc.ProgressBar = null;

    @property(cc.Label)
    progressText: cc.Label = null;

    onLoad() {
        cc["_gameManager"] = Manager;
        cc.game.addPersistRootNode(this.node);
    }

    async start() {
        if (cc.sys.isBrowser)
            cc.view.enableAutoFullScreen(false);
        this.initWonderFrameWork();//初始化平台相关配置
        new UILauncher();
        new NetLauncher();
        this.progressText.string = cc.js.formatStr("载入中...%d%", 0);
        await this.loadConfig();
        new ModuleLauncher();
        if (wonderSdk.isByteDance) ttTalentCommon.ttLogin();
        new SdkLauncher(this.progressText, this.progress);
    }

    update(dt) {
        Time.update(dt);
    }

    onTest() {
        let obj = MVC.openArgs().setUiLayer(MVC.eUILayer.Popup).setTransition(MVC.eTransition.EaseScale);
        UIManager.Open("ui/example/ExampleView", obj);
    }

    public initWonderFrameWork() {
        WonderSdk.init(this.CustomPlatform, this.testMode);
    }

    async loadConfig() {
        // let url = `${Const.JsonRemoteUrl}/${wonderSdk.BMS_APP_NAME}${wonderSdk.BMS_VERSION}/${this.testMode ? "debug" : "release"}/config/`;
        return Promise.all([
            Cfg.initLocalJson("Sound",this.progressText, this.progress),
            Cfg.initLocalJson("Event",this.progressText, this.progress),
        ]);
    }
}


