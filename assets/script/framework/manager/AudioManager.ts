import { Notifier } from "../notify/Notifier";
import { NotifyID } from "../notify/NotifyID";
import { Log } from "../Log";
import { Manager } from "./Manager";
import { Cfg } from "../../config/Cfg";
class ClipAsset {
    public id: number;
    public clip: cc.AudioClip;
    public constructor(id: number) {
        this.id = id;
    }
}

declare interface ClipAssetMap {
    [key: number]: ClipAsset;
}

export enum AudioType {
    UI = 0,
    Music,
    Max = Music,
}

export enum PlayType {
    Component,//组件形式播放
    Scripts,//统一脚本形式播放
}

export class AudioManager {
    static musicType: PlayType = PlayType.Component;
    public constructor() {
        const scene = cc.director.getScene();
        let node = new cc.Node('_AudioManager');
        cc.game.addPersistRootNode(node);
        node.parent = scene;
        this._root = node;
        AudioManager.musicType = PlayType.Component;
        this._musicSource = node.addComponent(cc.AudioSource);
        this._musicSource.loop = true;

        for (let index = 0; index < AudioType.Max; index++) {
            this.addAudioSource();
        }
        this._musicId = 0;
        Notifier.addListener(NotifyID.Game_Pause, this.OnGamePause, this);
    }

    private addAudioSource() {
        this._audioSources.push(this._root.addComponent(cc.AudioSource));
        this._audioIdLists.push(-1);
        this._audioConfigVolumes.push(1);
    }

    private _root: cc.Node;
    private _clips: ClipAssetMap = {}
    //背景音乐源
    private _musicSource: cc.AudioSource;
    //UI音效源
    private _audioSources: cc.AudioSource[] = [];
    private _audioIdLists: number[] = [];
    private _musicClip: ClipAsset;
    //设置界面的音乐大小
    private _musicSettingVolume = 1;
    //配置表里的音乐大小
    private _musicConfigVolume = 1;
    //淡入淡出的音乐大小
    private _musicFadeVolume = 1;
    private _musicId: number = 0;
    //是否静音
    private _enableMusic: boolean = true;
    public setMusicEnable(enable: boolean) {
        this._enableMusic = enable;
        if (this._enableMusic) {
            if (!this._musicClip) {
                this.playMusic(this._musicId, true);
            } else {
                this.resumeMusic();
            }
        } else {
            this.pauseMusic();
        }
    }
    /**
     * 设置音乐大小
     * @param volume 0-1
     */
    public setMusicVolume(volume: number) {
        this._musicSettingVolume = volume;
        if (this._musicSource != null && AudioManager.musicType == PlayType.Component) {
            this._musicSource.volume = this._musicSettingVolume * this._musicConfigVolume * this._musicFadeVolume;
        } else {
            cc.audioEngine.setMusicVolume(volume);
        }

    }

    /**
     * 获取音乐大小
     */
    public musicVolume() {
        return AudioManager.musicType == PlayType.Component ? this._musicSettingVolume : cc.audioEngine.getMusicVolume();
    }

    /**
     * 设置背景音乐配置大小
     * @param volume 0-1
     */
    private setMusicConfigVolume(volume: number) {
        this._musicConfigVolume = volume;
        if (this._musicSource != null && AudioManager.musicType == PlayType.Component) {
            this._musicSource.volume = this._musicSettingVolume * this._musicConfigVolume * this._musicFadeVolume;
        } else {
            cc.audioEngine.setMusicVolume(volume);
        }
    }

    /**
     * 播放背景音乐
     * @param id 配置表音效id
     * @param loop 是否循环
     * @param replay 
     */
    public playMusic(id: number, loop = true) {
        this._musicId = id;
        if (this._musicClip != null && this._musicClip.id == id) {
            Log.log("skip the same music:", id);
            return;
        }
        if (this._musicClip != null && id == this._musicClip.id) {
            return;
        }
        if (!this._enableMusic) return;
        let soundCfg = Cfg.Sound.get(id);
        if (soundCfg == null) {
            Log.error("PlayMusic error config id:", id)
            return;
        }
        if (soundCfg.volume <= 0) {
            Log.error("soundCfg volume error id:", id)
            soundCfg.volume = 1;
        }
        this.setMusicConfigVolume(soundCfg.volume);
        this._musicSource.loop = loop;

        let clip = this._clips[id];
        if (clip == null) {
            let path = soundCfg.path;
            Manager.loader.loadAssetAsync(id + "", path, cc.AudioClip, (name: string, resource: cc.AudioClip, asset: string) => {
                let realid = Number(name);
                if (!this._clips[realid]) {
                    this._clips[realid] = new ClipAsset(realid);
                    this._clips[realid].clip = resource;
                    this._musicClip = clip;
                }
                this.doPlayMusic(this._clips[realid]);
            }, this);
        } else {
            this._musicClip = clip;
            this.doPlayMusic(clip);
        }
    }

    private doPlayMusic(clip: ClipAsset) {
        if (AudioManager.musicType == PlayType.Component) {
            if (clip.clip != null) {
                this._musicSource.clip = clip.clip;
                this._musicSource.play();
            } else {
                Log.warn("DoPlayMusic clip null")
            }
        } else {
            cc.audioEngine.playMusic(clip.clip, true);
        }
    }

    public stopMusic() {
        AudioManager.musicType == PlayType.Component ? this._musicSource.stop() : cc.audioEngine.stopMusic();
    }

    public pauseMusic() {
        if (!this._enableMusic) {
            AudioManager.musicType == PlayType.Component ? this._musicSource.pause() : cc.audioEngine.pauseMusic();
        }
    }
    public resumeMusic() {
        if (this._enableMusic) {
            AudioManager.musicType == PlayType.Component ? this._musicSource.resume() : cc.audioEngine.resumeMusic();
        }
    }


    /////////////////////////////////////////////////////////////////////////////
    private _audioSettingVolume = 1;
    //配置表里的音效大小
    private _audioConfigVolumes: number[] = [];

    public setAudioVolume(volume: number) {
        this._audioSettingVolume = volume;
        AudioManager.musicType == PlayType.Component ? () => {
            for (let type = 0; type < this._audioSources.length; type++) {
                const source = this._audioSources[type];
                source.volume = this._audioSettingVolume * this._audioConfigVolumes[type];
            }
        } : cc.audioEngine.setEffectsVolume(volume);
    }

    public setAudioClip(id, clip: cc.AudioClip) {
        if (!this._clips[id]) {
            this._clips[id] = new ClipAsset(id);
        }
        this._clips[id].clip = clip;
    }

    private _enableAudio: boolean = true;
    public playAudio(id: number, type = AudioType.UI) {
        let soundCfg = Cfg.Sound.get(id);
        if (!soundCfg) {
            Log.error("playAudio error config id:", id);
            return;
        }
        if (!this._enableAudio) return;
        if (soundCfg.volume <= 0) {
            Log.error("soundCfg volume error id:", id)
            soundCfg.volume = 1;
        }
        this._audioSources[type].loop = false;

        let clip = this._clips[id];
        if (!clip) {
            let path = soundCfg.path;
            this._clips[id] = new ClipAsset(id);
            Manager.loader.loadAssetAsync(`${id}`, path, cc.AudioClip, (name: string, resource: cc.AudioClip, assetpath: string) => {
                let realid = Number(name);
                if (resource) {
                    this._clips[realid].clip = resource;
                    this.doPlayAudio(this._clips[realid], type);
                } else {
                    delete this._clips[realid];
                }
            }, this);
        } else {
            this.doPlayAudio(clip, type);
        }
    }

    private doPlayAudio(clip: ClipAsset, type: AudioType) {
        if (AudioManager.musicType == PlayType.Component) {
            if (clip.clip != null) {
                this._audioSources[type].clip = clip.clip;
                this._audioSources[type].play();
            } else {
                Log.warn("doPlayAudio clip null");
            }
        } else {
            this._audioIdLists[type] = cc.audioEngine.playEffect(clip.clip, false);
        }
    }

    public stopAudio(type = AudioType.UI) {
        AudioManager.musicType == PlayType.Component ? this._audioSources[type].stop() : cc.audioEngine.stopEffect(this._audioIdLists[type]);
    }

    public setEnableAudio(enable: boolean) {
        this._enableAudio = enable;
    }

    public audioVolume() {
        return this._audioSettingVolume;
    }

    public OnGamePause(enable: boolean): void {

    }
}