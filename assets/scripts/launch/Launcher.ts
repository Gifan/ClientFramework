
import { UILauncher } from "./UILauncher";
import { NetLauncher } from "./NetLauncher";
import { ModuleLauncher } from "./ModuleLauncher";
import { SdkLauncher } from "./SdkLauncher";
import { Const } from "../config/Const";
import { EPlatform } from "../sdk/WonderSdk/config/SdkConfig";
import { WonderSdk } from "../sdk/WonderSdk/WonderSdk";
import { Manager } from "../manager/Manager";
import { Time } from "../manager/Time";
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
        this.initLanguageInfo();
        cc["_gameManager"] = Manager;
        cc.game.addPersistRootNode(this.node);
        if (cc.sys.isBrowser)
            cc.view.enableAutoFullScreen(false);
    }
    async start() {
        this.initWonderFrameWork();//初始化平台相关配置
        if (wonderSdk.isGoogleAndroid || wonderSdk.isIOS || wonderSdk.isAmzAndroid) {
            this.progress.node.parent.getChildByName("notice").active = false;
            this.progress.node.parent.getChildByName("noticedesc").active = false;
        }
        new UILauncher();
        new NetLauncher();
        this.progressText.string = cc.js.formatStr("%d%", 0);
        this.progress.progress = 0;
        new ModuleLauncher();
        // await this.loadConfig();
        if (wonderSdk.isByteDance) ttTalentCommon.ttLogin();
        new SdkLauncher(this.progressText, this.progress);
    }

    update(dt) {
        Time.update(dt);
    }

    public initWonderFrameWork() {
        WonderSdk.init(this.CustomPlatform, this.testMode);
    }

    loadConfig() {
        let url = `${Const.JsonRemoteUrl}/${wonderSdk.BMS_APP_NAME}${wonderSdk.BMS_VERSION}/${this.testMode ? "debug" : "release"}/config/`;
        // return Promise.all([
        //     Cfg.initRemoteConfig(url + "Idiom"),
        // ]);
    }

    public initLanguageInfo() {
        let lType = cc.sys.language;
        let lCode = cc.sys.languageCode;
        let realType = cc.sys.language;
        // console.log("initLanguageInfo = ", lCode);
        try {
            if (lType === cc.sys.LANGUAGE_CHINESE) {
                if (
                    lCode.indexOf('hant') != -1
                    || lCode.indexOf('sg') != -1
                    || lCode.indexOf('tw') != -1
                    || lCode.indexOf('hk') != -1
                    || lCode.indexOf('mo') != -1
                ) {
                    realType = 'tw';
                }
            }
            else if (lType == cc.sys.LANGUAGE_JAPANESE) {
                realType = cc.sys.LANGUAGE_JAPANESE;
            }
            else {
                realType = cc.sys.LANGUAGE_ENGLISH;
            }
            cc.sys.language = realType;
        } catch (error) {
            console.log(error);
        }

    }
}


