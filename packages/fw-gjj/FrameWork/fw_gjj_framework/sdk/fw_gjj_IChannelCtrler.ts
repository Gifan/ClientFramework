export enum ChannelType {
    /** 无意义 */
    NONE,
    /** 来自分享链接 */
    SHARE,
    /** 来自二维码 */
    QRCODE,
    /** 来自其他正式渠道来源 */
    EVERY_SOURCE,
    /** 来自虚拟渠道(用于调试测试) */
    FAKE
}
export type ChannelData = {
    /** 本次进入游戏的来源 */
    enterSource: string,
    /** 本次进入游戏的方式 */
    type: ChannelType,
    /** BMS上的分享配置(仅分享来源时存在) */
    bms?: dto.HTTP.BMS_SHARE_CONFIG.item
    /** 推广来源 */
    promoSource?: string;
    /** 推广级别 */
    promoLv?: number;
}
export default interface IChannelCtrler {
    data: ChannelData;
}