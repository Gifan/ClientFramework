export default interface IADCtrler {
    setBid?(bid: string);
    showInsertAd?(type: string);
    showSplashAd?(type: string);
    showVideoAD(onPlayEnd: (notCplReason?: string, failCode?: VideoADFailCode) => void, type: string, args?: any);
    createBannerAd(type: string, style: BannerADStyle, args?: any): IBanner;
    showAddToMyGameGuide?(type: string);
    showBannerAd_withNode(type: string, node: cc.Node, onShow: () => void);
    showBannerAd_withStyle(type: string, style: BannerADStyle, onShow: () => void);
    hideBannerAd();
    destoryBannerAd();
    showMoreGameBtn?(moreGameBtn?: cc.Node);
    showGameBox?();
    hideMoreGameBtn?();

}
export type BannerADStyle = {
    /** [广告宽度|默认300] 会对非法值(超过300-375)作出裁剪 */
    width?: number,
    /** [左边对齐] 距离左边缘的高度(微信的像素单位), 非法值会调整到屏幕内 */
    left?: number,
    /** [广告宽度比例|默认0] 传入0-1的值, 代表可显示的 最小宽度-最大宽度 */
    widthScale?: number,
    /** [底部对齐|默认0] 传入距离底部的高度(微信的像素单位), 非法值会调整到屏幕内 */
    bottom?: number,
    /** [顶部对齐|默认不执行|会覆盖前一参数] 距离顶部的高度(微信的像素单位), 非法值会调整到屏幕内 */
    top?: number,
}
export interface IBanner {
    canShow: boolean;
    show();
    hide();
    dispose();
    onLoad(cb: () => void);
    onError(cb: (e: Error) => void);
}
export enum VideoADFailCode {
    /** 暂无意义 */
    NONE,
    /** 版本不支持 */
    NOT_SUPPORT,
    /** 视频未准备好 */
    NOT_READY,
    /** 未知广告类型(未找到id) */
    UNKNOW_TYPE,
    /** 广告未完整查看 */
    NOT_COMPLITE,
    /** 广告异常 */
    AD_ERROR,
}