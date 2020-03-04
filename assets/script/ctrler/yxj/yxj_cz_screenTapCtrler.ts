// import { yxj_Autobind } from "../../ui/base/yxj_gjj_Autobind";
// import { CompoundCommon } from "../../compound/CompoundCommon";
import * as MyConstans from "../../config/MyConstans";
let common = require('zqddn_zhb_Common');
let tt = window["tt"];
export class screenTapCtrler {

    protected _hasInit: boolean;
    protected item: screenTapItem;
    constructor() {
        if (this._hasInit) return;
        this._hasInit = true;
        this._init();
    }

    protected _init() {
        console.log("[screenTapCtrler][init]", fw.isZJTD);
        if (fw.isZJTD) this.item = new screenTapItem();
    }

    setUi(node: cc.Node) {
        node.active = false;
        this.item && this.item.setUi(node);
    }


    show() {
        console.log("[screenTapCtrler][show]");
        this.item && this.item.show();
    }

    hide() {
        console.log("[screenTapCtrler][hide]");
        this.item && this.item.hide();
    }

    clip(num1: number, num2: number) {
        console.log("[screenTapCtrler][clip]", num1, num2);
        this.item && this.item.clip(num1, num2);
    }

    checkReaward() {
        console.log("[screenTapCtrler][checkReaward]");
        if (!this.item) return false;
        return this.item._timer.time >= 5;
    }

    start() {
        console.log("[screenTapCtrler][start]");
        this.item && this.item.StartRecord();
    }

    stop() {
        console.log("[screenTapCtrler][stop]");
        this.item && this.item.stopRecord();
    }

    share(cmp?) {
        console.log("[screenTapCtrler][share]", cmp);
        this.item && this.item.shareRecord(cmp);
    }
}

class fakeGetGameRecorderManager {
    startcmp = null;
    stopcmp = null;
    constructor() {
        console.log("fakeGetGameRecorderManager");
    }
    onStart(cmp) {
        this.startcmp = cmp;
    }
    onStop(cmp) {
        this.stopcmp = cmp;
    }
    start() {
        this.startcmp();
    }
    stop() {
        this.stopcmp({
            videoPath: "假的路径"
        });
    }
    recordClip(timeRange) {
        console.log("recordClip", timeRange);
    }
    clipVideo() { }
}

class screenTapItem {
    //#region [AutoBind]

    $startBtn: cc.Node = null;
    $$startBtn_te() {
        this.StartRecord();
    }

    $stopBtn: cc.Node = null;
    $$stopBtn_te() {
        this.stopRecord(stopMolde.MANUAL);
    }

    $shareVideoBtn: cc.Node = null;
    $$shareVideoBtn_te() {
        if (this._timer.recordStatus == recordStatus.START) {
            this.stopRecord(stopMolde.AUTO);
        } else {
            this._toshare();
        }
    }

    $shareGoldIconNode: cc.Node = null;

    //#endregion [AutoBind]
    node: cc.Node;
    stopMolde: stopMolde;
    _timer: timer = null;
    _aotuScreenTimer: aotuScreenTimer = null;
    _hasInit = false;
    _clickAble = true;
    _recorderManager = null;
    videoPath: string = null;
    constructor() {

    }

    setUi(node: cc.Node) {
        node.active = true;
        this.node = node;
        // yxj_Autobind.quick(this);
        if (!this._hasInit) {
            this._hasInit = true;
            this._init();
        }
        this.reset();
    }

    _init() {
        this._timer = new timer(this);
        this._aotuScreenTimer = new aotuScreenTimer(this);
        this.initManager();
    }

    initManager() {
        console.log("[screenTapItem][initManager]")
        let info = tt.getSystemInfoSync();
        console.log("[screenTapItem][initManager]", info)
        switch (info.appName) {
            default: this._recorderManager = tt.getGameRecorderManager(); break;
            case "devtools": this._recorderManager = new fakeGetGameRecorderManager(); break;
        }
        this._recorderManager.onStart(res => {
            console.log("[screenTapItem]recordStart", res);
            this._timer.recordStatus = recordStatus.START;
            this._aotuScreenTimer.recordStatus = recordStatus.START;
            this._clickAble = true;
            this.$stopBtn.active = true;
            this.$startBtn.active = false;
            this.$shareVideoBtn.active = false;
        })
        this._recorderManager.onStop(res => {
            console.log("[screenTapItem]recordStop", res, "录制时间", this._timer.time);
            this._timer.recordStatus = recordStatus.STOP;
            this._aotuScreenTimer.recordStatus = recordStatus.STOP;
            this._clickAble = true;
            this.$stopBtn.active = false;
            this.$startBtn.active = false;
            this.$shareVideoBtn.active = true;
            this.checkClip(res);
        })

    }

    clip(num1: number, num2: number) {
        if (fw.Util.compareVersion(wx.getSystemInfoSync().SDKVersion, "1.6.1") === -1) return;
        if (this._timer.recordStatus != recordStatus.START) return;
        if (num1 <= 0.5) num1 + 1;
        if (num2 <= 0.5) num2 + 1;
        console.error("[screenTapItem][clip]", num1, num2)
        this._recorderManager.recordClip({
            timeRange: [num1, num2]
        })

    }

    checkClip(res) {
        this._clickAble = false;
        if (fw.Util.compareVersion(wx.getSystemInfoSync().SDKVersion, "1.6.1") === -1) {
            this.videoPath = res.videoPath;
            this._clickAble = true;
            if (this.stopMolde === stopMolde.AUTO) { this._toshare(); };
        } else {
            let clipBeforTime = 15;
            console.log("clipBeforTime", clipBeforTime);
            this._recorderManager.clipVideo({
                path: res.videoPath,
                timeRange: [clipBeforTime, 0],
                success: (res) => {
                    console.log("clipVideoSuccess", res);
                    this.videoPath = res.videoPath;
                    this._clickAble = true;
                    if (this.stopMolde === stopMolde.AUTO) { this._toshare(); };
                },
                fail: (e) => {
                    console.error("clipVideoFail", e)
                    this.videoPath = res.videoPath;
                    this._clickAble = true;
                    if (this.stopMolde === stopMolde.AUTO) { this._toshare(); };
                }
            })
        }
    }

    hide() {

    }

    show() {
    }

    StartRecord() {
        if (!this._clickAble) return;
        this._clickAble = false;
        this._recorderManager.start({
            duration: 60,
        })
    }


    stopRecord(stopMolde?: stopMolde) {
        if (!this._clickAble) return;
        if (this._timer.time < 5) return common.sceneMgr.showTipsUI("录屏时间过短");
        this._clickAble = false;
        this.stopMolde = stopMolde;
        this._recorderManager.stop({

        })

    }
    _toshare() {
        this.shareRecord((resultCode) => {
            if (resultCode === 1 && fw.lsd.getKeyCountByShareVideo.value < 4) {
                fw.lsd.getKeyCountByShareVideo.value++;
                // CompoundCommon.GetInstance().addWithdrawalsGold(500);
                cc.director.emit(MyConstans.msg.showGoldFlyNode, true);
                cc.director.emit(MyConstans.msg.updateWithdrawalsGoldUI);
            } else {
                console.log("录屏没有分享成功")
            }
            this.reset();
        });
    }

    shareRecord(cmp?: fw.cb1<number>) {
        if (!this._clickAble) return;
        this._clickAble = false;
        setTimeout(() => {
            this._clickAble = true;
        }, 2000);
        var self = this;
        console.log("[screenTapItem][shareRecord]", self.videoPath, this._timer.time, common.isAuditing);
        if (this._timer.time < 5) return common.sceneMgr.showTipsUI("录屏时间过短不能进行分享");
        if (!this.videoPath) return;

        let title = shareTitle[Math.floor(Math.random() * shareTitle.length)];
        console.log("分享录屏title", title)
        tt.shareAppMessage({
            desc: title,
            channel: 'video',
            extra: {
                videoPath: this.videoPath, // 可用录屏得到的视频地址
                videoTopics: this.getTopic()
            },
            success: () => {
                cmp && cmp(1);

            },
            fail: (e) => {
                console.log("视频分享失败", e, this.videoPath);
                common.sceneMgr.showTipsUI("视频分享失败");
                cmp && cmp(0);
            }
        });
    }

    reset() {
        this.$startBtn.active = true;
        this.$stopBtn.active = false;
        this.$shareVideoBtn.active = false;
        this.$shareGoldIconNode.active = fw.lsd.getKeyCountByShareVideo.value < 4;
        this.stopMolde = stopMolde.NONE;
        this.videoPath = null;
        this._timer.recordStatus = recordStatus.UNUSED;
        this._aotuScreenTimer.recordStatus = recordStatus.UNUSED;
    }

    getTopic() {
        let arr = videoTopics;
        console.log("getTopic", arr)
        return arr;
    }
}

let videoTopics = [
    "快来领养心动猫咪，收获和猫咪亲密互动的快乐~",
    "天呐，这些毛茸茸的小家伙简直太可爱啦！",
];
let shareTitle = [
    "快来领养心动猫咪，收获和猫咪亲密互动的快乐~",
    "天呐，这些毛茸茸的小家伙简直太可爱啦！",
]

class timer {
    _recordStatus: recordStatus;
    _totalTime = 10000;
    _interval = 3;
    _leftTime: number;
    _utilTimer: fw.Util.Timer;
    _hasSaveHead = false;
    constructor(private ui: screenTapItem) {

    }
    set recordStatus(s: recordStatus) {
        console.error("timer", s)
        this._recordStatus = s;
        (s === recordStatus.START) ? this.reset() : this.stop();
    }
    get recordStatus() {
        return this._recordStatus;
    }
    get time() {
        return this._totalTime - this._leftTime;
    }
    reset() {
        console.log("[timer][reset]");
        this._hasSaveHead = false;
        this._leftTime = this._totalTime;
        this._utilTimer = fw.Util.getTimer(this._totalTime,
            pcs => {
                let leave = 1 - pcs;
                this._leftTime = Math.floor(this._totalTime * leave);
                if (this.time >= 5 && !this._hasSaveHead) {
                    this._hasSaveHead = true;
                    this.ui.clip(5, 0);
                }
                if (this.time > 30) {
                    this.ui.$stopBtn.active = false;
                    this.ui.$shareVideoBtn.active = true;
                }
            },
            () => {
            },
            1
        );
    }

    stop() {
        this._utilTimer && this._utilTimer.dispose();
    }
}

class aotuScreenTimer {
    _fps = 60;
    _recordStatus: recordStatus;
    _interval = 3;
    _duration = 0;
    _totalTime = 10000;
    _utilTimer: fw.Util.Timer;
    constructor(private ui: screenTapItem) {

    }
    set recordStatus(s: recordStatus) {
        console.error("aotuScreenTimer", s)
        this._recordStatus = s;
        (s === recordStatus.UNUSED) ? this.reset() : this.stop();
    }
    get recordStatus() {
        return this._recordStatus;
    }
    reset() {
        console.log("[aotuScreenTimer][reset]");
        this._duration = 0;
        this._utilTimer = fw.Util.getTimer(this._totalTime,
            (pcs) => {
                this._duration += 1000 / this._fps;
                if (this._duration >= this._interval * 1000) {
                    console.log("[aotuScreenTimer]长时间没有点击录屏按钮，现在进入自动录屏");
                    this.ui.StartRecord();
                }
            },
            () => {
            },
            this._fps
        );
    }

    stop() {
        this._utilTimer && this._utilTimer.dispose();
    }
}

enum recordStatus { START, STOP, UNUSED }
enum stopMolde { AUTO, MANUAL, NONE }
