var common = require('zqddn_zhb_Common');

// 声音管理模块对象
var sound_manager = {
    b_music_mute: 0, // 表示我们的背景音乐是否静音，0为没有静音，1为静音;
    b_effect_mute: 0, // 表示我们的音效是否静音，0为没有静音，1为静音;

    bg_music_name: null, // 保存我们的背景音乐的文件名称的;
    bg_music_loop: false,

    audioDict: {}, // 2xx

    _play(url: string, loop: boolean, volue: number) { // 2xx
        let i = url.lastIndexOf(".mp3");
        if (i >= 0) url = url.substring(0, i);
        i = url.indexOf("resources/");
        if (i >= 0) url = url.substring("resources/".length);
        let audio: cc.AudioClip = this.audioDict[url];
        if (audio) {
            cc.audioEngine.play(audio, loop, volue);
        }
        else {
            cc.loader.loadRes(url, cc.AudioClip, (e, res) => {
                if (e || !res) return console.error("[soundManager][loadAudioClipFail] " + url, e);
                console.log("[soundManager][success] " + url);
                this.audioDict[url] = res;
                return cc.audioEngine.play(res, loop, volue);
            });
        }
    },

    set_music_mute(b_mute) {

        if (this.b_music_mute == b_mute) return; // 状态没有改变;

        this.b_music_mute = (b_mute) ? 1 : 0;
        console.log("[sound_manager][set_music_mute]", b_mute, this.b_music_mute);
        // 如果是静音，那么我们就是将背景的音量调整到0，否则为1:
        if (this.b_music_mute === 1) { // 静音
            common.isSoundOn = 0;
            this.pause_music() // 暂停背景音乐播放
        }
        else if (this.b_music_mute === 0) {
            common.isSoundOn = 1;
            if (this.bg_music_name)
                this._play(this.bg_music_name, this.bg_music_loop, 1); // 2xx
        }


        // 将这个参数存储到本地;
        cc.sys.localStorage.setItem("zqddn_zhb_music_mute", this.b_music_mute);
    },

    set_effect_mute(b_mute) {
        console.log("[sound_manager][set_effect_mute]", b_mute);
        if (this.b_effect_mute == b_mute)
            return;

        this.b_effect_mute = (b_mute) ? 1 : 0;

        // 将这个参数存储到本地;
        cc.sys.localStorage.setItem("zqddn_zhb_effect_mute", this.b_effect_mute);
    },

    stop_music() {
        console.log("[sound_manager][stop_music]2xx")
        cc.audioEngine.stopAll(); // 先停止当前正在播放的;
        if (this.bg_music_name)
            this.bg_music_name = null;
    },

    pause_music() {
        console.log("[sound_manager][pause_music]2xx")
        cc.audioEngine.stopAll(); // 先停止当前正在播放的;
    },

    // 播放背景音乐
    play_music(file_name, loop) {
        this.check_ifOpen();
        this.stop_music() // 先停止当前正在播放的;
        var url = file_name;
        if (file_name === this.bg_music_name) return;
        this.bg_music_name = file_name; // 保存我们当前正在播放的背景音乐;
        this.bg_music_loop = loop;
        if (!this.b_music_mute) {
            console.log("播放背景音乐url", this.b_music_mute, url)
            this._play(url, loop, 1); // 当我们调用playMusic的时候，volue又回到了1;
        }
    },

    // 播放背景音乐
    resume_music(file_name?, loop?) {
        console.log("[sound_manager][resume_music]1xx")
        this.play_music(this.bg_music_name, true);
    },

    backGuang_listen() {
        if (fw.isWX) {
            wx.onHide(() => {
                if (this.bg_music_name)
                    this.pause_music();
            });
            wx.onShow(() => {
                if (this.bg_music_name)
                    this.resume_music();
            });
        }
    },

    check_ifOpen() {
        if (this.b_music_mute == 0)
            this.b_music_mute = 0;
        else
            this.b_music_mute = 1;
    },

    // 播放背景音效:
    play_effect(file_name: string) {
        if (this.b_effect_mute) return; // 如果音效静音了，直接return;
        var url = file_name;
        return this._play(url, false, 1);
    }
};

// sound_manager.backGuang_listen();

// 从本地获取这个用户的声音设置;
let music_mute = cc.sys.localStorage.getItem("zqddn_zhb_music_mute");
if (music_mute) { // 如果本地有输出，才处理;
    music_mute = parseInt(music_mute);
}
else {
    music_mute = 0;
}

sound_manager.set_music_mute(music_mute);


export default sound_manager;
