import { CallID } from "../../CallID";
import { MVC } from "../../framework/MVC";
import { Notifier } from "../../framework/notify/Notifier";
import { ListenID } from "../../ListenID";
import { Time } from "../../manager/Time";
import ScreenCapModel from "./ScreenCapModel";
declare let tt: any;
/*
 * desc
 */
export class ScreenCapController extends MVC.MController<ScreenCapModel> {
    public constructor() {
        super();
        this.setup(ScreenCapModel.getInstance);
        this.changeListener(true);
        this.initScreenCap();
    }
    public reset(): void { }

    public get classname(): string {
        return "ScreenCapController";
    }
    protected registerAllProtocol(): void {

    }

    protected changeListener(enable: boolean): void {
        Notifier.changeListener(enable, ListenID.ScreenCap_Start, this.onStartScreenCap, this);
        Notifier.changeListener(enable, ListenID.ScreenCap_Stop, this.onStopScreenCap, this);
        Notifier.changeCall(enable, CallID.ScreenCap_CanShareVideo, this.canShowShareVideo, this);
        Notifier.changeListener(enable, ListenID.ScreenCap_Clean, this.onCleanVideo, this);
    }

    private _recorder: any = null;
    private _state: number = 0;//0不在录屏中 1录屏中 2录屏完成
    private _time: number = 15;
    private _recorderTime: number = 0;
    private _startTime: number = 0;
    public initScreenCap(startCall?: Function, endCall?: Function) {
        if (wonderSdk.isByteDance) {
            this._state = 0;
            this._recorder = tt && tt.getGameRecorderManager();
            this._recorder.onStart(res => {
                this._state = 1;
                this._recorderTime = 0;
                // console.log("录屏开始", this._recorderTime);
                this._startTime = Time.serverTimeMs;
                Notifier.send(ListenID.ScreenCap_StartFinish, res.videoPath);
                startCall && startCall();
            });
            this._recorder.onStop(res => {
                this._state = 2;
                this._recorderTime += Time.serverTimeMs - this._startTime;
                // console.log("录屏结束", this._recorderTime, res.videoPath);
                this._model.shareVideoPath = res.videoPath;
                Notifier.send(ListenID.ScreenCap_StopFinish, res.videoPath);
                endCall && endCall(res.videoPath);
            });
            this._recorder.onError(res => {
                // console.log("Error = ", res);
                if (this._state == 1) {
                    this.onStartScreenCap(this._time);
                } else {
                    this._recorderTime = 0;
                    this._recorder && this._recorder.stop();
                    this._model.shareVideoPath = null;
                }
            });
            this._recorder.onInterruptionBegin(res => {
                // console.log("录屏中断开始", res);
                if (this._state == 1) {
                    this._recorderTime += Time.serverTimeMs - this._startTime;
                    this._recorder.pause();
                }
            });
            this._recorder.onInterruptionEnd(res => {
                // console.log("中断结束", res);
                if (this._state == 1) {
                    this._startTime = Time.serverTimeMs;
                    this._recorder.resume();
                }
            })
        }
    }

    public onStartScreenCap(time) {
        this._recorderTime = 0;
        if (wonderSdk.isByteDance) {
            this._time = time;
            this._recorder && this._recorder.start && this._recorder.start({
                duration: this._time,
            })
        }
    }

    public onStopScreenCap() {
        if (wonderSdk.isByteDance) {
            if (this._state == 1) {
                this._recorder && this._recorder.stop && this._recorder.stop();
            } else {
                Notifier.send(ListenID.ScreenCap_StopFinish, null);
            }
        }
    }

    public canShowShareVideo() {
        if (this._recorderTime > 2999 && this._model.shareVideoPath != null && this._model.shareVideoPath != "") {
            return this._model.shareVideoPath;
        } else return null;
    }

    public onCleanVideo() {
        this._recorderTime = 0;
        this._model.shareVideoPath = null;
    }
}

