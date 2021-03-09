import { Notifier } from "../framework/notify/Notifier";
import { NotifyID } from "../framework/notify/NotifyID";
import { Log } from "../framework/Log";
import { Cfg } from "../config/Cfg";
import { Manager } from "./Manager";

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
    DRAW = 1,
    Music = 2,
    Max = Music,
}

export enum PlayType {
    Component = 1,//组件形式播放
    Scripts = 2,//统一脚本形式播放
}

export class AudioManager {
    static musicType: PlayType = PlayType.Scripts;
    public constructor() {
        const scene = cc.director.getScene();
        let node = new cc.Node('_AudioManager');
        cc.game.addPersistRootNode(node);
        node.parent = scene;
        this._root = node;
        AudioManager.musicType = PlayType.Scripts;
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
        this._audioWaitToPlay.push(0);
        this._audioConfigVolumes.push(1);
    }

    private _root: cc.Node;
    private _clips: ClipAssetMap = {}
    //背景音乐源
    private _musicSource: cc.AudioSource;
    //UI音效源
    private _audioSources: cc.AudioSource[] = [];
    private _audioIdLists: number[] = [];
    private _audioWaitToPlay: number[] = [];
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
    public setMusicEnable(enable: boolean, isdoaction: number = 0) {
        this._enableMusic = enable;
        if (isdoaction) return;
        if (this._enableMusic) {
            if (!this._musicClip) {
                if (this._musicId == 0) return;
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
            let realid = Number(id);
            Manager.loader.loadRes(path, cc.AudioClip, (error: Error, resource: cc.AudioClip) => {
                if (error) {
                    return;
                }
                if (!this._clips[realid]) {
                    this._clips[realid] = new ClipAsset(realid);
                    this._clips[realid].clip = resource;
                }
                this.doPlayMusic(this._clips[realid]);
            });
        } else {
            this.doPlayMusic(clip);
        }
    }

    private doPlayMusic(clip: ClipAsset) {
        this._musicClip = clip;
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
        AudioManager.musicType == PlayType.Component ? (this._musicSource.stop(), this._musicClip = null, cc.audioEngine.stopMusic()) : cc.audioEngine.stopMusic();
        this._musicClip = null;
        this._musicId = -1;
    }
    public setMusicClip(id, clip: cc.AudioClip) {
        this._clips[id] = new ClipAsset(id);
        this._clips[id].clip = clip;
    }
    public pauseMusic() {
        // if (!this._enableMusic) {
        //     console.log("pauseMusic");
        AudioManager.musicType == PlayType.Component ? this._musicSource.pause() : cc.audioEngine.pauseMusic();
        // }
    }
    public resumeMusic() {
        if (this._enableMusic) {
            console.log("resumeMusic");
            AudioManager.musicType == PlayType.Component ? this._musicSource.resume() : cc.audioEngine.resumeMusic();
        }
    }


    /////////////////////////////////////////////////////////////////////////////
    private _audioSettingVolume = 1;
    //配置表里的音效大小
    private _audioConfigVolumes: number[] = [];

    public setAudioVolume(volume: number, type: AudioType) {
        this._audioSettingVolume = volume;
        AudioManager.musicType == PlayType.Component ? () => {
            // for (let type = 0; type < this._audioSources.length; type++) {
            const source = this._audioSources[type];
            source.volume = this._audioSettingVolume * this._audioConfigVolumes[type];
            // }
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
        this.setAudioVolume(soundCfg.volume, type);
        this._audioSources[type].loop = !!soundCfg.loop;
        let clip = this._clips[id];
        if (this._audioSources[type].loop) {
            this._audioWaitToPlay[type]++;
        }
        if (!clip) {
            let path = soundCfg.path;
            this._clips[id] = new ClipAsset(id);
            let realid = Number(id);
            Manager.loader.loadRes(path, cc.AudioClip, (error: Error, resource: cc.AudioClip) => {
                if (error) {
                    return;
                }
                if (resource) {
                    this._clips[realid].clip = resource;
                    if (this._audioWaitToPlay[type] < 0) return;
                    this.doPlayAudio(this._clips[realid], type);
                } else {
                    delete this._clips[realid];
                }
            });
        } else {
            this.doPlayAudio(clip, type);
        }
    }

    private doPlayAudio(clip: ClipAsset, type: AudioType) {
        if (clip.clip == null) {
            Log.warn("doPlayAudio clip null");
            return;
        }
        this._audioWaitToPlay[type] = 0;
        if (AudioManager.musicType == PlayType.Component) {
            this._audioSources[type].clip = clip.clip;
            this._audioSources[type].play();
        } else {
            if (this._audioIdLists[type] > 0 && this._audioSources[type].loop) {
                cc.audioEngine.stopEffect(this._audioIdLists[type]);
                this._audioIdLists[type] = -1;
            }
            this._audioIdLists[type] = cc.audioEngine.playEffect(clip.clip, this._audioSources[type].loop);
        }
    }

    public stopAudio(type = AudioType.UI) {
        if (this._audioSources[type].loop) {
            this._audioWaitToPlay[type]--;
        }
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