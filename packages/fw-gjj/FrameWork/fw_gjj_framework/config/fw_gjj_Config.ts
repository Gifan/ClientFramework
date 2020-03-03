
import IShareCtrler from "../sdk/fw_gjj_IShareCtrler";
import ILoginCtrler from "../sdk/fw_gjj_ILoginCtrler";
import IADCtrler from "../sdk/fw_gjj_IADCtrler";
import IChannelCtrler from "../sdk/fw_gjj_IChannelCtrler";
import IPlatformToolsCtrler from "../sdk/fw_gjj_IPlatformToolsCtrler";
import { Platform } from "../fw_gjj_Framework";
import { BBCacheBase } from "../util/fw_gjj_BBCache";

export namespace Config {
    export interface FrameWorkConfig {
        TestMode: boolean;
        platform: Platform;
        bbConfig: BlackBoardConfig;
        sdkMgrConfig: SdkMgrConfig;
    }
    export interface SdkMgrConfig {
        shareCtrler?: IShareCtrler;
        adCtrler?: IADCtrler;
        channelCtrler?: IChannelCtrler;
        platformToolsCtrler?: IPlatformToolsCtrler;
    }
    export interface BlackBoardConfig {
        extendPropertys: { [name: string]: BBCacheBase };
    }
}