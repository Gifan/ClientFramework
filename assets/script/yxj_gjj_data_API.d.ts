/// <reference path="../../../../packages/fw-gjj/FrameWork/fw_gjj_framework/fw_gjj_Framework_API.d.ts" />
declare module fw { // 扩展框架的 api , 增加数据方面的描述

    /** 全局本地储存数据 (Local Storage Data) */
    let lsd: _private.data.LocalStorageData;
    /** 全局静态数据 (Static Data) */
    let sd: _private.data.StaticData;

    /** 声明全局黑板的数据(需要和 data.ts 同步) */
    let bb: _private.data.BlackBoard;
}
declare var wb:any;
declare var qg:any;
declare var wx:any;
declare var BK:any;
declare module fw {
    namespace _private {
        namespace data {
            interface LocalStorageData {
                /** 最后运行的日期, 6位数值(如: 180809), 用于判断每日清空的需求 */
                readonly lastPlayDate: LocalStorageObject<number>;
                /** 今天的看视频次数 */
                readonly videoAdCount: LocalStorageObject<number>;
                /** 今天的分享次数, 用于高于某版本之后显示提示 */
                readonly shareCount: LocalStorageObject<number>;
                /** 玩家是否已经开启了红包功能 */
                readonly isRedBagPlayer: LocalStorageObject<boolean>;
                /** 通过分享录屏获取的钥匙次数 */
                readonly getKeyCountByShareVideo: LocalStorageObject<number>;
                /** 通过分享获取金币的次数 */
                readonly shareGetGoldCount: LocalStorageObject<number>;
                /** 通过激励视频获取金币的次数 */
                readonly videoGetGoldCount: LocalStorageObject<number>;
                /** 已领取红包的关卡 */
                readonly getRedbagLevel: LocalStorageObject<{ [plateId: string]: 0 | 1 }>;
                /** 提现倒计时开始时间 */
                readonly cashStartTime: LocalStorageObject<number>;
                /** 提现累计可用总时间 */
                readonly cashTotalTime: LocalStorageObject<number>;
                /** 玩家累计消耗钥匙个数 */
                readonly usedKey: LocalStorageObject<number>;
                /** 是否已上报玩家累计消耗的钥匙 */
                readonly hasUploadUsedKey: LocalStorageObject<boolean>;
                /** 红包(累计关卡活动)金额 */
                readonly cashMoney: LocalStorageObject<number>;
            }
            interface StaticData {
            }
            interface BlackBoard extends BlackBoard {
                listen(isOn: boolean, name: string, fn: (newValue: T, oldValue?: T) => void, caller: object);
                off(name: string, fn: (newValue: T, oldValue?: T) => void);
                on(name: string, fn: (newValue: T, oldValue?: T) => void, caller: object);
                set(name: string, value: T);
                get(name: string): T;
                /** BMS 分享配置 */
                readonly bms_shareConfig: BBCache<dto.HTTP.BMS_SHARE_CONFIG.item[]>;
                /** BMS 豆腐块配置 */
                readonly bms_tofuConfig: BBCache<WonderJsSdk.BmsV2AdConfig[]>;
                //readonly bms_tofuConfig: BBCache<dto.HTTP.BMS_TOFU_CONFIG.item[]>; // bms广告v1 (已弃用)
                /** BMS 启动参数 */
                readonly bms_launchConfig: BBCache<dto.HTTP.BMS_LAUNCH_CONFIG.rp>;

                /** BMS token */
                readonly bms_token: BBCache<string>;
                /** BMS 新用户标记 */
                readonly bms_isNew: BBCache<boolean>;
                /** ip拦截标记, true 的时候采用安全行为, false 的时候尽情耍流氓, 未收到任何请求时默认为true */
                readonly bms_ipShield: BBCache<boolean>;
                /** openid */
                readonly sys_openId: BBCache<string>;
                /** 五个相关界面分享和看视频的总次数 */
                readonly sovCount: BBCache<string>;
            }
        }
    }
}



//#endregion 数据接口
