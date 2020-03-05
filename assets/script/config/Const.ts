export namespace Const {
    export const ButtonAudioId: number = 1;
    export const designHeight:number = 1355;
    export const designWidth:number = 750;

    export const CEPlatform = cc.Enum({ dev: 0, wx: 1, bd: 2, qq: 3, ios: 4, android: 5, H5_4399: 6 });
    export const CustomPlatform = cc.Enum({ dev: 0, H5_4399: 1, H5_QTT: 2, H5_MOLI: 3, H5_UC: 4, SINA: 5, H5_ZHANG_YU: 6, NV_ANDROID_SIX_K_PLAY: 7, NV_ANDROID_WONDER_BOX: 8 });

    export class AppConst {
        static WX_APPID = "wx6290d6ec04fe4508";
        static BD_APPID = "18183598";
        static BD_APP_SID = "c2687d4f";
        static BMS_APP_NAME = "wodexiaomao";
        static BMS_APP_NAME_NEW = "wdxm";
        static PROJECT_CODE = "wodexiaomao";
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
    export class PageName {
        static readonly OPENING = "sfq_gjj_openingPage";
        static readonly CHAPTER = "brain_cz_chapterPage";
        static readonly EXTEND = "brain_cz_extendPage";
        static readonly ENDING = "sfq_gjj_endingPage";
        static readonly TITLE = "yxj_gjj_titlePage";
        static readonly ACHIEVE = "yxj_gjj_achievePage";
        static readonly PLATE = "yxj_gjj_platePage";
        static readonly LV_SELECT = "combine_gjj_lvSelectPage";
        static readonly LV_START = "yxj_gjj_lvStartPage";
        static readonly LV_END = "yxj_gjj_lvEndPage";
        static readonly LEVEL = "sfq_lv";
        static readonly DEAD_QST = "sfq_gjj_deadQstPage";
        static readonly SRV_GUIDE = "sfq_gjj_surviveGuidePage";
        static readonly LV_QST = "yxj_cz_lvQstPage";
        static readonly SPY = "yxj_cz_spyPage";
        static readonly PLANE = "yxj_cz_planePage";
    }
    export class PanelName {
        static readonly SPY = "yxj_gjj_spyPanel";
        static readonly SIDE = "yxj_gjj_sidePanel";
        static readonly KEFU = "yxj_gjj_kefuPanel";
        static readonly RANK = "yxj_gjj_rankPanel";
        static readonly PROMO = "yxj_gjj_promoPanel";
        static readonly PLATE = "yxj_gjj_platePanel";
        static readonly PLATE_LARGE = "sfq_gjj_plateLargePanel";
        static readonly UNLOCK = "yxj_gjj_unlockPanel";
        static readonly LV_TIPS = "yxj_gjj_lvTipsPanel";
        static readonly LV_MAMA_TIPS = "sfq_gjj_lvMamaTipsPanel";
        static readonly LV_ITEM = "yxj_gjj_lvItemPanel";
        static readonly LV_TITLE = "yxj_gjj_lvTitlePanel";
        static readonly LV_PAUSE = "yxj_gjj_lvPausePanel";
        static readonly LV_PLATE = "yxj_gjj_lvPlatePanel";
        static readonly FEEDBACK = "yxj_gjj_feedBackPanel";
        static readonly TIPS_CARD = "yxj_cz_tipsCardPanel";
        static readonly GAIN_ITEM = "yxj_cz_gainItemPanel";
        static readonly MY_RECORD = "yxj_gjj_myRecordPanel";
        static readonly REDPACK = "yxj_gjj_redpackPanel";
        static readonly DEAD_QST = "sfq_gjj_deadQstPanel";
        static readonly SECRET_PROMO = "yxj_gjj_secretPromoPanel";
        static readonly SUB_ICON = "yxj_gjj_subIconPanel";
        static readonly TIPS_KEY = "yxj_gjj_tipsKeyPanel";
        static readonly CHEST = "yxj_gjj_chestPanel";
        static readonly LV_GUIDE = "yxj_cz_guidePanel";
        static readonly LV_ANSWER = "sfq_cz_lvAnswerPanel";
        static readonly LV_TALKING = "yxj_cz_lvTalkingPanel";
        static readonly SIGN_IN = "yxj_gjj_signInPanel";
        static readonly WARN = "yxj_gjj_warningPanel";
        static readonly GAME_CTRLER = "brain_cz_gameCtrlerPanel";
        static readonly SKIP = "brain_cz_skipPanel";
        static readonly VIDEO_SHARE_GUIDE = "sfq_cz_videoShareGuidePanel";
        static readonly ZJTD_WARM_TIPS = "brain_cz_zjtdWarmTipsPanel";
        static readonly COMMENT = "yxj_gjj_commentPanel";
        static readonly TITLE_REDBAG = "yxj_gjj_titleRedBagPanel";
        static readonly REDBAG_RANK = "yxj_gjj_redBagRankPanel";
        static readonly REDBAG = "yxj_gjj_redbagPanel";
        static readonly REWARD_INFO = "yxj_gjj_rewardInfoPanel";
        static readonly CASH = "yxj_gjj_cashPanel";
    }
    export class CommonEvent {
        static readonly FIRST_END_OP = "FIRST_END_OP";
        static readonly TOFU_SHOW = "TOFU_SHOW";
        static readonly TOFU_JUMP = "TOFU_JUMP";
        static readonly IQ_QST_TAP = "IQ_QST_TAP";
        static readonly LV_BOOK_TAP = "LV_BOOK_TAP";
        static readonly UI_AB_TAP = "UI_AB_TAP";
        static readonly SHOW_LV_TIPS = "SHOW_LV_TIPS";
        static readonly LV_START = "LV_START";
        static readonly LV_END = "LV_END";
        static readonly LV_END_DATA_PHASE = "LV_END_DATA_PHASE";
        static readonly UISHOW = "UISHOW";
        static readonly UIHIDE = "UIHIDE";
        static readonly IQ_QST_SHOW_ANSWER = "IQ_QST_SHOW_ANSWER";
        static readonly SPY_QST_SHOW_ANSWER = "SPY_QST_SHOW_ANSWER";
        static readonly LV_BOOK_SHOW_ANSWER = "LV_BOOK_SHOW_ANSWER";
        static readonly DEAD_QST_ANSWER_RIGHT = "DEAD_QST_ANSWER_RIGHT";
        static readonly REDPACK = "REDPACK";
        static readonly DEAD_QST = "DEAD_QST";
        static readonly SRV_GUIDE = "SRV_GUIDE";
        static readonly SOV_IN = "SOV_IN";
        static readonly SOV_FIN = "SOV_FIN";
        static readonly TIPSCARD = "TIPSCARD";
        static readonly PLAYRR_ACTION = "PLAYRR_ACTION";
    }
    export class ResPath {
        /** 关卡开始转板图, path + [关卡id] */
        static readonly LV_START = "yxj_gjj_resource/image/lvStart/";
        /** 关卡结算图, path + [胜利0|失败1]-[关卡id]-[结局序列] */
        static readonly LV_END = "yxj_gjj_resource/image/lvEnd/";
        /** 成就图, path + [成就id] (+ "_1", 未解锁) */
        static readonly ACHIEVE = "yxj_gjj_resource/image/achieve/";
        /** 成就和图鉴说明文字图, path + [成就id] */
        static readonly CARD_INFO = "yxj_gjj_resource/image/plateAndAchiveText/";
        /** 卡片图, path + [图鉴id] */
        static readonly PLATE = "yxj_gjj_resource/image/plate/";
        /** 卡片说明文字图, path + [图鉴id] */
        static readonly PLATE_INFO = "yxj_gjj_resource/image/plateText/";
        /** 卡片的爸爸图, path + [文件名] */
        static readonly PLATE_BIG_CARD = "yxj_gjj_resource/image/father/";
        /** 关卡答案图 */
        static readonly LV_ANSWER = "yxj_gjj_resource/image/lvAnswer/";

        /** 关卡道具栏上, 部分需要改变样式的图片, path + [itemType] */
        static readonly TOOLS_FIX = "yxj_gjj_resource/image/tools/toolFix";

        /** 提示卡预设体 */
        static readonly TIPS_CARD_ITEM = "yxj_gjj_resource/prefabs/ui/item/yxj_cz_tipsCardItem";
        /** 侦探题的彩色书按钮预制体路径 */
        static readonly SPY_QST_ITEM = "yxj_gjj_resource/prefabs/ui/item/spyQstItem";
        /** IQ题的黑板预制体路径 */
        static readonly IQ_QST_ITEM = "yxj_gjj_resource/prefabs/ui/item/iqQstItem";
        /** 秘籍预制体路径 */
        static readonly TIPS_BOOK_ITEM = "yxj_gjj_resource/prefabs/ui/item/tipsBookItem";
        /** 关卡内摇头的妈妈预制体路径 */
        static readonly LV_MAMA_ITEM = "yxj_gjj_resource/prefabs/level_element/shakeHeadMother";
        /** 关卡内对话框预制体路径 */
        static readonly LV_DIALOG_ITEM = "yxj_gjj_resource/prefabs/level_element/lvDialog";

        /** 广告条误触按钮 */
        static readonly AD_BLOCK = "zqddn_zhb/prefab/around/braintalent_adBlock";

        /** 排行榜人物头像 */
        static readonly HEAD = "yxj_gjj_resource/image/head/head";
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
        static readonly TIPS_KEY = "VAD_TIPS_KEY";
        /** 新红包 */
        static readonly REDBAG = "VAD_REDBAG";
    }
    export class BannerADType {
        /** 关卡提示的广告 */
        static readonly LV_TIPS = "BAD_LV_TIPS";
        /** 关卡结算的广告 */
        static readonly LV_END = "BAD_LV_END";
        /** 框架自动广告 */
        static readonly AUTO = "BAD_AUTO";
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
}