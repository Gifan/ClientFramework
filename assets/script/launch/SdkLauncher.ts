import { Notifier } from "../framework/notify/Notifier";
import { ListenID } from "../ListenID";
import { Time } from "../framework/manager/Time";
import { Manager } from "../util/Manager";
import { StorageID } from "../StorageID";
import { Const } from "../config/Const";
import { Watcher } from "../framework/Watcher";
import { Cfg } from "../config/Cfg";
import { AlertManager } from "../module/alert/AlertManager";
import { Log } from "../framework/Log";
// import { EventDefine } from "../config/EventCfg";

export class SdkLauncher {
    public constructor() {
        wonderSdk.setAlertAdpater(AlertManager);
        wonderSdk.setAudioAdapter(Manager.audio);//适配sdk
        this.login();
    }

    private isLoadData: boolean = false;
    private finishWatch: Watcher = null;
    public login() {
        this.showPrivacy();
        this.isLoadData = false;
        Notifier.send(ListenID.Login_Start);
        this.finishWatch = Time.delay(1, this.checkLogin, null, this, -1);
        this.loadAllData();
    }

    public checkLogin() {
        if (this.isLoadData && Manager.vo.userVo.isAcceptPrivacy) {
            this.finishWatch.cancel();
            Notifier.send(ListenID.Login_Finish);
            this.finishWatch = null;
        }
    }

    async loadAllData() {
        await Promise.all([this.loadTime(), this.loadUserData(), this.loadScene(), this.loadGameSwitchConfig(), this.loadShieldIp(), this.loadMusic()]);
        this.initData();
        this.isLoadData = true;
    }

    async loadTime() {
        return new Promise((resolve, reject) => {
            let time = Date.now();
            Time.setServerTime(time);
            resolve();
        })
    }

    async loadMusic() {
        let cfg = Cfg.Sound.filter({ loop: 1 });
        let num = cfg.length;
        let curnum = 0;
        return new Promise((resolve, reject) => {
            for (let i = 0; i < cfg.length; i++) {
                let data = cfg[i];
                let id = data.id;
                cc.loader.loadRes(data.path, cc.AudioClip, (err, resouce) => {
                    curnum++;
                    if (!err)
                        Manager.audio.setMusicClip(id, resouce);
                    if (curnum >= num) resolve();
                })
            }
        });
    }
    /**加载用户数据 */
    async loadUserData() {
        return new Promise((resolve, reject) => {
            let data = Manager.storage.getObject(StorageID.UserData, null);
            if (data) {
                Manager.vo.userVo.updatetUserVo(data);
            }
            Manager.vo.isGetData = true;
            resolve();
        });
    }

    /**
     * 预加载场景
     */
    async loadScene() {
        return new Promise((resolve, reject) => {
            cc.director.preloadScene(Const.GAME_SCENENAME, (curcomplete, totalcount) => {
            }, () => {
                resolve();
            });
        })
    }

    /**加载游戏开关控制 */
    async loadGameSwitchConfig() {
        return new Promise((resolve, reject) => {
            wonderSdk.requestSwitchConfig().then(data => {
                Manager.vo.uodateSwitchVo(data.data);
                resolve();
            }).catch(err => {
                resolve();
            });
            // Manager.net.httpRequest(Const.BaseUrl.HTTP_HEAD_RELEASE + Const.Url.BMS_LAUNCH_CONFIG, { app_name: Const.AppConst.BMS_APP_NAME, version: Const.AppConst.BMS_VERSION }, "GET").then((data) => {
            //     Manager.vo.uodateSwitchVo(data.data);
            //     resolve();
            // }).catch(err => {
            //     resolve();
            // })
        })
    }

    async loadShieldIp() {
        return new Promise((resolve, reject) => {
            wonderSdk.requestShiledIp().then(data => {
                Manager.vo.switchVo.isEnableIp = data ? 1 : 0;
                resolve();
            }).catch(err => {
                resolve();
            })
            // Manager.net.httpRequest(Const.BaseUrl.HTTP_HEAD_RELEASE + Const.Url.BMS_IP_IS_ENABLE, { app_name: Const.AppConst.BMS_APP_NAME, version: Const.AppConst.BMS_VERSION }, "GET").then((data) => {
            //     Manager.vo.switchVo.isEnableIp = parseInt(data.data.is_enable);
            //     resolve();
            // }).catch(err => {
            //     resolve();
            // })
        })
    }

    public showPrivacy() {
        wonderSdk.showPrivacy((boo) => {
            Manager.vo.userVo.isAcceptPrivacy = !!boo;
        })
        // if (!fw.sdk.showPrivacy()) {//不不弹出隐私弹窗

        // } else {
        //     //根据各个平台实际展示 
        // }
    }

    public initData() {
        let date = new Date(Time.serverTimeMs);
        let curday = date.getDate();
        let userData = Manager.vo.userVo;
        if (curday != userData.day) {//第二天
            Manager.vo.userVo.day = curday;
            Notifier.send(ListenID.Game_SecondDay);
        }
    }
}