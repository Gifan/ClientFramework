export interface AudioInterface {
    playMusic(id: number): void;
    stopMusic(): void;
    pauseMusic(): void;
    resumeMusic(): void;
    setMusicEnable(enable: boolean): void;
}

/**
 * 适配sdk相关音效处理
 */
class _AudioAdapter {
    private _adapter!: AudioInterface;
    public setAdapter(audioInterface: AudioInterface) {
        this._adapter = audioInterface;
    }
    public playMusic(id: number) {
        this._adapter.playMusic(id);
    }
    public stopMusic() {
        this._adapter.stopMusic();
    }
    public pauseMusic() {
        this._adapter.pauseMusic();
    }
    public resumeMusic() {
        this._adapter.resumeMusic();
    }
    public setMusicEnable(enable: boolean) {
        this._adapter.setMusicEnable(enable);
    }
}

export const SdkAudioAdapter = new _AudioAdapter();