import IPlatformToolsCtrler from "../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/sdk/fw_gjj_IPlatformToolsCtrler";
export default class OppoPlatformToolsCtrler implements IPlatformToolsCtrler {
    constructor() {

    }
    times = 0;
    jumplist =
        [
            "com.wonder.mostbrain.nearme.gamecenter",
            "com.wonder.cgdroppo.nearme.gamecenter",
            "com.wonder.sndoppo.nearme.gamecenter"
        ];
    showKefu() { }
    showImage(url: string) { }
    jumpApp(appId: string, path?: string, extraData?: PathObj, onCpl?: (failReason?: string) => void, envVersion?: "develop" | "trial" | "release") {

        console.log('oppo------跳转', this.jumplist[this.times]);
        qg.navigateToMiniGame({
            pkgName: this.jumplist[this.times],
            success: () => {
            },
            fail: (res) => {
                console.log("跳转失败", JSON.stringify(res));
            }
        });
        this.times++;
        if (this.times >= this.jumplist.length) { this.times = 0 };
    }
}