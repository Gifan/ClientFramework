export namespace Const {
    export const ButtonAudioId: number = 1;
    export const designHeight: number = 1334;
    export const designWidth: number = 750;
    export const GAME_SCENENAME: string = "GameScene";
    export const GameName: string = "DrawArrow";
    export const JsonRemoteUrl: string = `https://static.zuiqiangyingyu.net/wb_webview/${GameName}`
    export const CEPlatform = cc.Enum({ dev: 0, wx: 1, bd: 2, qq: 3, ios: 4, android: 5, H5_4399: 6 });

    export class BannerADType {
        static readonly LV_TIPS = 0;
        static readonly LV_END = 0;
        static readonly AUTO = 0;
    }

    export const enum CurrencyType {
        Gold = 0,
        Power,
    }

    export const enum GoldUse{
        GetDefault = 0,
        CostShopBuy,
    }

    export const enum PowerUse{
        GetDefault = 0,
    }

}