declare module fw {
    /** 全局的控制器命名空间 */
    namespace cls {
        /** 关卡序列控制器 */
        let lvIndex: _private.ctrler.LvIndexCtrler;
        /** 分享/视频控制器 */
        let sov: _private.ctrler.SOVCtrler;
        /** 豆腐块控制器 */
        let tofu: _private.ctrler.TofuCtrler;
        /** 成就控制器 */
        let achieve: _private.ctrler.AchieveCtrler;
        /** 提示钥匙控制器 */
        let tipsKey: _private.ctrler.TipsKeyPanel;
        /** 惊喜礼包时间控制器 */
        let wonderTimer: _private.ctrler.wonderBonusTimerCtrler;
        /** 录屏控制器 */
        let screenTap: _private.ctrler.screenTapCtrler;
        /**玩家通关天数和小时数统计控制器 */
        let passDay: _private.ctrler.PassDayCtrler;
        /** 红包系统控制器 */
        let redBag: _private.ctrler.RedBagCtrler;

    }
}

declare module fw {
    namespace _private {
        namespace ctrler {
            interface LvIndexCtrler {
                /** 正在玩的关卡(开发关卡id) */
                curDevLv: number;
                /** 正在玩的关卡(发布关卡id) */
                readonly curRlsLv: number;
                /** 是否处于关卡中 */
                readonly isPlaying: boolean;
                /** 最新的未通关的一个解锁关卡(发布关卡id) */
                readonly nextRlsLv: number;
                /** 关卡最大值, 标记最后一关的关卡, 从1起算
                 * @example if(nextRlsLv === maxLv) console.log("is last lv.");) */
                readonly maxLv: number;
                /** 跳转关卡(开发关卡id) */
                jumpToDevLv(devLv: number);
                /** 跳转关卡(发布关卡id) */
                jumpToRlsLv(rlsLv: number);
                /** 开发关卡id -> 发布关卡id  */
                d2r(developLv: number): number;
                /** 发布关卡id -> 开发关卡id  */
                r2d(releaseLv: number): number;
                /**重玩本关 */
                replay();
                /**跳过本关 */
                skip();
            }
            interface SOVCtrler {
                /** [视频/分享 类型] 指示下一个进行'视频/分享'操作的状态, 用于查询后显示对应的ui或文案 */
                VOSType: typeof SOVCtrler.VOSType;
                /** [游戏大部分提示的类型] 如:提示二/道具说明/卡片获得 */
                vosType: SOVCtrler.VOSType;
                /** [回调分享] 带回调的分享，如果返回值s不为空，则分享失败 */
                share(onCpl: (failReason?: string) => void, type?: string, query?: PathObj)
                /** [通用分享] 不带任何回调的分享 */
                share_common(type?: string, query?: PathObj);
                /** [群回调分享] 从群点击进入才触发回调的分享 */
                share_group(shareGroupType: string, query?: PathObj);
                /** [自定义分享] 自定义标题及图片 */
                share_custom(title: string, spfOrPath: string | cc.SpriteFrame, query?: PathObj, arg?: any);
                /** [视频转分享] 观看视频失败时, 根据ip情况, 审核地区 : 回报错误, 非审核地区 : 自动转成分享 */
                videoOrShare(videoADType: string, onCpl: ShareCB);
                videoOrShare(videoADType: string, query: PathObj, onCpl: ShareCB);
                /** [纯视频] */
                video(videoADType: string, onCpl: SovCB);
            }
            namespace SOVCtrler {
                enum VOSType {
                    /** 无意义 */
                    NONE,
                    /** 视频广告 */
                    VIDEO_AD,
                    /** 任何的分享行为 */
                    SHARE_ANY,
                    /** 必须带有回调的分享行为 */
                    SHARE_CB,
                    /** 必须分享到群的分享行为 */
                    SHARE_GROUP,
                }
            }
            interface TofuCtrler {
                TofuGroup: typeof TofuGroup;
                createTofuNode(tofu: WonderJsSdk.BmsV2AdConfig, node: cc.Node);
                showTofuGrp(root: cc.Node): TofuCtrler.TofuGroup;
                jumpApp(data: TofuDto);
            }
            namespace TofuCtrler {
                class TofuGroup {
                    constructor(node: cc.Node, useAnime = true);
                    show();
                    hide();
                    dispose();
                }
            }
            interface AchieveCtrler {

            }
            interface TipsKeyPanel {
                readonly count: number;
                add(value: number, node?: cc.Node);
                use(value: number): boolean;
                use(value: number, node: cc.Node): boolean;
                use(value: number, onCpl: () => void): boolean;
                use(value: number, node: cc.Node, onCpl: () => void): boolean;
                useOne(): boolean;
                useOne(onCpl: () => void): boolean;
                useOne(node: cc.Node, onCpl: () => void): boolean;
                tryUseOne(type: string, node: cc.Node, onSuccess: () => void, onFail: () => void);
            }
            interface wonderBonusTimerCtrler {
                onUpdate: (pcs: number) => void
                reset();
                getTime(onUpdate?: (pcs: number) => void);
                isEnd();
            }
            interface screenTapCtrler {
                setUi(node: cc.Node);
                show();
                hide();
                clip(num1: number, num2: number);
                checkReaward(): boolean;
                start();
                stop();
                share(cmp?: any);
            }
            interface PassDayCtrler {
                getPlayDayNum();
                getGameTime();
            }
            interface RedBagCtrler {
                isActive: boolean;
                getCashLeftTime(): number;
                addCashLeftTime();
                setUsedKey(num: number);
                getCashMoney(): number;
                getCashLeftTimeText(time): string;
                getRedbagLevel(): number;
                getCompletedLevel(): number;
                getTotleLevel(): number;
                getNextTargetLevel(): number;
                getNextTargetMoney(): number
                updateLevelRedbagData(): number;
                directLookVideoToAddTime(cb: fw.cb);
                lookVideoToAddTime(cb: fw.cb);
                getRewardInfo();
                checkLevelRedbag()
            }
        }
    }
}
