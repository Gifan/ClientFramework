import { Notifier } from "../framework/notify/Notifier";
import { ListenID } from "../ListenID";
import { StorageID } from "../StorageID";
import { Const } from "../config/Const";
import { Watcher } from "../framework/Watcher";
import { Cfg } from "../config/Cfg";
import { AlertManager } from "../module/alert/AlertManager";
import { Manager } from "../manager/Manager";
import { Time } from "../manager/Time";

export class SdkLauncher {
    public constructor(launchDesc?: cc.Label, progress?: cc.ProgressBar) {
        this.launchDesc = launchDesc;
        this.progress = progress;
        //@ts-ignore
        wonderSdk.setAlertAdpater(AlertManager);
        wonderSdk.setAudioAdapter(Manager.audio);//适配sdk
        this._progressNum = 10;
        this.login();
    }

    private isLoadData: boolean = false;
    private finishWatch: Watcher = null;
    public login() {
        this.showPrivacy();
        this.isLoadData = false;
        Notifier.send(ListenID.Login_Start);
        this.finishWatch = Time.delay(0.2, this.checkLogin, null, this, -1);
        this.loadAllData();
    }

    public checkLogin() {
        if (this.isLoadData && Manager.vo.userVo.isAcceptPrivacy) {
            Time.doCancel(this.finishWatch);//.cancel();
            Notifier.send(ListenID.Login_Finish);
            this.finishWatch = null;
        }
    }

    async loadAllData() {
        if (wonderSdk.isWeChat)
            await this.sdkLogin();
        await this.loadUserData();
        await Promise.all([this.loadTime(), this.loadScene(), this.loadGameSwitchConfig(), this.loadShieldIp(), this.loadView(),/*this.loadMusic()*/]);
        this.initData();
        if (this.progress) {
            this.addProgress(1);
        }
        wonderSdk.preLoadRewardVideo();
        this.isLoadData = true;
    }

    /**
     * 加载部分资源
     */
    async loadView(): Promise<void> {
        let preloadlist = [];
        let per = 0.2 / preloadlist.length;
        let curlen = 0;
        let alllen = preloadlist.length;
        return new Promise((resolve, reject) => {
            if (wonderSdk.isNative || preloadlist.length <= 0) {
                this.addProgress(0.2);
                resolve();
            } else {
                for (let i = 0; i < preloadlist.length; i++) {
                    let data = preloadlist[i];
                    Manager.loader.preloadRes(data, cc.Prefab, (cur, total) => {
                        this.addProgress(per * (1 / total));
                    }, () => {
                        curlen++;
                        if (curlen >= alllen)
                            resolve(null);
                    });
                }
            }
        });
    }

    async loadTime(): Promise<void> {
        return new Promise((resolve, reject) => {
            wonderSdk.requestServerTime().then(data => {
                if (data && data.data.time) {
                    Time.setServerTime(data.data.time * 1000);
                } else {
                    let time = Date.now();
                    Time.setServerTime(time);
                }
                this.addProgress(0.1);
                resolve(null);
            }).catch(err => {
                let time = Date.now();
                Time.setServerTime(time);
                this.addProgress(0.1);
                resolve(null);
            })
        })
    }

    async loadMusic(): Promise<void> {
        let cfg = Cfg.Sound.filter({ loop: 1 });
        let num = cfg.length;
        let curnum = 0;
        return new Promise((resolve, reject) => {
            for (let i = 0; i < cfg.length; i++) {
                let data = cfg[i];
                let id = data.id;
                Manager.loader.loadRes(data.path, cc.AudioClip, (error, resouce) => {
                    curnum++;
                    if (!error) {
                        let audioclip = <cc.AudioClip>resouce;
                        Manager.audio.setMusicClip(id, audioclip);
                    }
                    if (curnum >= num) {
                        this.addProgress(0.05);
                        resolve(null);
                    }
                });
            }
        });
    }
    /**加载用户数据 */
    async loadUserData(): Promise<void> {
        return new Promise((resolve, reject) => {
            let data = Manager.storage.getObject(StorageID.UserData, null);
            if (data) {
                Manager.vo.userVo.updatetUserVo(data);
            }
            Manager.vo.isGetData = true;
            this.addProgress(0.2);
            resolve(null);
        });
    }

    async sdkLogin(): Promise<void> {
        return wonderSdk.login();
    }

    /**
     * 预加载场景
     */
    async loadScene(): Promise<void> {
        return new Promise((resolve, reject) => {
            cc.director.preloadScene(Const.GAME_SCENENAME, (curcomplete, totalcount) => {
                this.addProgress(0.15 * (1 / totalcount));
            }, () => {
                resolve(null);
            });
        })
    }

    /**加载游戏开关控制 */
    async loadGameSwitchConfig(): Promise<void> {
        return new Promise((resolve, reject) => {
            wonderSdk.requestSwitchConfig().then(data => {
                Manager.vo.updateSwitchVo(data.data);
                this.addProgress(0.1);
                resolve(null);
            }).catch(err => {
                this.addProgress(0.1);
                resolve(null);
            });
        })
    }

    async loadShieldIp(): Promise<void> {
        return new Promise((resolve, reject) => {
            wonderSdk.requestShiledIp().then(data => {
                Manager.vo.switchVo.isEnableIp = data ? 1 : 0;
                this.addProgress(0.1);
                resolve(null);
            }).catch(err => {
                this.addProgress(0.1);
                resolve(null);
            })
        })
    }

    /**
     * 加载分享信息
     */
    async loadShareConfig() {
        return new Promise((resolve, reject) => {
            if (wonderSdk.isWeChat) {
                wonderSdk.requestShareConfig().then(data => {
                    console.log(data);
                    this.addProgress(0.05);
                    resolve(null);
                }).catch(err => {
                    this.addProgress(0.05);
                    resolve(null);
                });
            } else {
                resolve(null);
            }
        })
    }

    public showPrivacy() {
        wonderSdk.showPrivacy((boo) => {
            Manager.vo.userVo.isAcceptPrivacy = !!boo;
        })
    }

    public initData() {
        let date = new Date(Time.serverTimeMs);
        let curday = date.getDate();
        let userData = Manager.vo.userVo;
        if (curday != userData.day) {//第二天
            Manager.vo.userVo.day = curday;
            Manager.vo.userVo.loginDay++;
            Notifier.send(ListenID.Game_SecondDay);
        }
        Manager.vo.isNewUser = Manager.vo.userVo.loginDay <= 1;
    }

    private launchDesc: cc.Label = null;
    private progress: cc.ProgressBar = null;
    private _progressNum: number = 0;
    public get progressNum(): number {
        return this._progressNum > 100 ? 100 : this._progressNum;
    }
    public set progressNum(num) {
        this._progressNum = num;
        if (this._progressNum > 100) {
            this._progressNum = 100;
        }
    }

    public addProgress(progress: number) {
        if (!this.progress) return;
        cc.error("progress", progress);
        this.progressNum = this.progressNum + progress * 100;
        this.progress.progress = this.progressNum / 100;
        this.launchDesc.string = cc.js.formatStr("载入中...%d%", Math.round(this.progressNum));
    }
}