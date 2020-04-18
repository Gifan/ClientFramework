export namespace Const {
    export const ButtonAudioId: number = 1;
    export const designHeight: number = 1355;
    export const designWidth: number = 750;
    export const GAME_SCENENAME: string = "GameScene";
    export const CloseBtnDelayShowTime: number = 1.5;
    export const GameName: string = "DogTravel";
    export const JsonRemoteUrl: string = `https://static.zuiqiangyingyu.net/wb_webview/${GameName}`

    export const CEPlatform = cc.Enum({ dev: 0, wx: 1, bd: 2, qq: 3, ios: 4, android: 5, H5_4399: 6 });

    export class AppConst {
        static WX_APPID = "wx6290d6ec04fe4508";
        static BD_APPID = "18183598";
        static BD_APP_SID = "c2687d4f";
        static BMS_APP_NAME = "ggqlx";
        static BMS_APP_NAME_NEW = "ggqlx";
        static PROJECT_CODE = "qqglx";
        static TTAD_APPID = "5013156";
        static OPPO_APPID = "30156204";

        static LEANCLOUD_APP_ID = 'ayKVVwLH2pbsDmUwzwlWcLy2-gzGzoHsz';
        static LEANCLOUD_APP_KEY = 'HPctsUMfHC5p1vFXqnNvu9UX';

        static ALD_SDK_ID = "";
        static MTA_SDK_ID = "";
        static MTA_SDK_EVENT_ID = "";

        static BMS_VERSION: string;
    }

    export class PlanfromConst {
        static readonly BMS_APP_NAME_WX = AppConst.BMS_APP_NAME_NEW + "wx";
        static readonly BMS_VERSION_WX = "1.0.2";

        static readonly BMS_APP_NAME_BD = AppConst.BMS_APP_NAME_NEW + "bd";
        static readonly BMS_VERSION_BD = "1.0.2";

        static readonly BMS_APP_NAME_QQ = AppConst.BMS_APP_NAME_NEW + "QQ";
        static readonly BMS_VERSION_QQ = "1.0.2";

        static readonly BMS_APP_NAME_IOS = AppConst.BMS_APP_NAME + "ios";
        static readonly BMS_VERSION_IOS = "1.0.0";

        static readonly BMS_APP_NAME_ANDROID = AppConst.BMS_APP_NAME + "apk";
        static readonly BMS_VERSION_ANDROID = "1.0.2";
        static readonly BMS_VERSION_ANDROID_SIX_K_PLAY = "1.0.2sixkw";   //6kw玩
        static readonly BMS_VERSION_ANDROID_WONDER_BOX = "1.0.2hezi";   //盒子版本

        static readonly BMS_APP_NAME_TOUTIAO = AppConst.BMS_APP_NAME_NEW + "tt";
        static readonly BMS_VERSION_TOUTIAO = "1.0.4";

        static readonly BMS_APP_NAME_OPPO = AppConst.BMS_APP_NAME_NEW + "oppo";
        static readonly BMS_VERSION_OPPO = "1.0.2";

        static readonly BMS_APP_NAME_H5_4399 = AppConst.BMS_APP_NAME_NEW + "4399";
        static readonly BMS_VERSION_H5_4399 = "1.1.0";

        static readonly BMS_APP_NAME_H5_QTT = AppConst.BMS_APP_NAME_NEW + "qtt";
        static readonly BMS_VERSION_H5_QTT = "1.0.2";

        static readonly BMS_APP_NAME_H5_MOLI = AppConst.BMS_APP_NAME_NEW + "Moli";
        static readonly BMS_VERSION_H5_MOLI = "1.2.2";

        static readonly BMS_APP_NAME_H5_UC = AppConst.BMS_APP_NAME_NEW + "uc";
        static readonly BMS_VERSION_H5_UC = "1.0.6";

        static readonly BMS_APP_NAME_VIVO = AppConst.BMS_APP_NAME_NEW + "vivo";
        static readonly BMS_VERSION_VIVO = "1.0.2";

        static readonly BMS_APP_NAME_SINA = AppConst.BMS_APP_NAME_NEW + "WB";
        static readonly BMS_VERSION_SINA = "1.0.4";

        static readonly BMS_APP_NAME_H5_ZHANG_YU = AppConst.BMS_APP_NAME_NEW + "WB";
        static readonly BMS_VERSION_H5_ZHANG_YU = "1.0.0";

        static readonly BMS_APP_NAME_DEV = AppConst.BMS_APP_NAME_NEW + "_dev";
        static readonly BMS_VERSION_DEV = "1.0.0";

        static readonly BMS_APP_NAME_XIAO_MI = AppConst.BMS_APP_NAME_NEW + "xm";
        static readonly BMS_VERSION_XIAO_MI = "1.0.2";

    }

    //#region 同步

    export class BaseUrl {
        static readonly HTTP_HEAD_DEVELOP = "https://t3game.zuiqiangyingyu.net";
        static readonly HTTP_HEAD_RELEASE = "https://game.zuiqiangyingyu.net";
        static readonly SOCKET_HEAD_DEVELOP = "";
        static readonly SOCKET_HEAD_RELEASE = "";
    }

    export class Url {

        /** [BMS配置] 获取初始化配置 */
        static readonly BMS_LAUNCH_CONFIG = "/common/config/info";
        /** [BMS配置] 获取分享内容配置 */
        static readonly BMS_SHARE_CONFIG = "/common/game/share_list";
        /** [BMS配置] 获取豆腐块(游戏跳转)内容配置 */
        static readonly BMS_TOFU_CONFIG = "/common/game/ads";
        /** [BMS] 微信登陆(辅助获取openid) */
        static readonly BMS_SIGN_IN_WX = "/common/session/sign_in";
        /** [BMS] 百度登陆(辅助获取openid) */
        static readonly BMS_SIGN_IN_BD = "/common/baidu/sign_in";
        /** [BMS] qq小游戏(辅助获取openid) */
        static readonly BMS_SIGN_IN_QQ = "/common/qqminiapp/sign_in";


        /** [BMS统计] 主动分享 */
        static readonly BMS_SHARE_SHOW = "/statistics/share/show";
        /** [BMS统计] 从分享卡进入游戏 */
        static readonly BMS_LOGIN_LOG = "/statistics/login_log";
        /** [BMS统计] 关卡维度 */
        static readonly BMS_GAME = "/statistics/game";
        /** [BMS统计] 跳转广告展示 */
        static readonly BMS_AD_SHOW = "/statistics/ad/show";
        /** [BMS统计] 跳转广告点击 */
        static readonly BMS_AD_HIT = "/statistics/ad/hit";
        /** [BMS统计] 统计玩家获取提示次数以及所在关卡 */
        static readonly BMS_HINT = "/statistics/hint";

        /** [BMS] 查看用户是否处于广深地区 res.data.is_enable 0=广深, 1=非广深 */
        static readonly BMS_IP_IS_ENABLE = "/common/ip/is_enable";

        /** [BMS] 微信解密 */
        static readonly DECODE_DATA = "/common/wechat/decode_data";

    }
    export class VideoADType {
        /** 提示钥匙 */
        static readonly TIPS_KEY = 0;
        /** 新红包 */
        static readonly REDBAG = 0;
    }
    export class BannerADType {
        static readonly LV_TIPS = 0;
        static readonly LV_END = 0;
        static readonly AUTO = 0;
    }
    export class GuideType {
        /** 横条引导 */
        static readonly BAR = "bar";
        /** 气泡引导 */
        static readonly TIPS = "tip";
    }
    export class InsertADType {
        /** 插屏广告 */
        static readonly NOMAL = "IAD_NOMAL";
    }
    export class GameboxADType {
        /** qq盒子广告 */
        static readonly NOMAL = "GAD_NOMAL";
    }
    export class SplashADType {
        /** 开屏广告 */
        static readonly NOMAL = "SAD_NOMAL";
    }
    export class ShareGroupType {
        /** 一般分享奖励 */
        static readonly COMMOM = "SGT_COMMOM";
        /** 红包 */
        static readonly RED_PACK = "SGT_RED_PACK";
    }
    export class AcceleType {
        /** 手机立起向右横 */
        static readonly SIDE_LIE_TOWARD_RIGHT = "AT_SIDE_LIE_TOWARD_RIGHT";
        /** 手机倒立 */
        static readonly HANDSTAND = "AT_HANDSTAND";
        /** 手机朝下 */
        static readonly ADOWN = "AT_ADOWN";
        /** 摇晃手机 */
        static readonly SHAKE = "AT_SHAKE";
        /** 手机上抛 */
        static readonly THROW = "AT_THROW";
        /** 手机正放 */
        static readonly FRONT = "AT_FRONT";
    }

    export const enum BannerCode {
        ShowSuccess = 0,
        ShowError = 1,
    }

    export const enum CurrencyType{
        Gold = 0,
        Diamond,
    }

}