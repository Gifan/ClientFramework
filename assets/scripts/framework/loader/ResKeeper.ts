
const { ccclass, property } = cc._decorator;

/** 自动释放配置 */
export interface autoResInfo {
    asset: cc.Asset;
};

@ccclass
export default class ResKeeper extends cc.Component {

    private autoRes: autoResInfo[] = [];

    /**
     * 组件销毁时自动释放所有keep的资源
     */
    public onDestroy() {
        this.releaseAutoRes();
    }

    /**
     * 释放资源，组件销毁时自动调用
     */
    public releaseAutoRes() {
        for (let index = 0; index < this.autoRes.length; index++) {
            const element = this.autoRes[index];
            if (element.asset) {
                element.asset.decRef();
                element.asset = null;
            }
        }
        this.autoRes = null;
    }

    /**
     * 加入一个自动释放的资源
     * @param resConf 资源url和类型 [ useKey ]
     */
    public autoReleaseRes(resConf: autoResInfo) {
        resConf.asset.addRef();
        this.autoRes.push(resConf);
    }
}
