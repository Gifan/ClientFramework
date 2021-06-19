export interface AlertInterface {
    showSelectAlert(data: { title?: string, desc?: string, confirm: () => void, cancel?: () => void }): void;
    showNormalTipsOnce(text: string, parent: cc.Node, time: number, ydis: number, pos: cc.Vec3);
}

/**
 * 适配sdk对话框相关
 */
class _AlertAdapter {
    private _adapter!: AlertInterface;
    public setAdapter(alertInterface: AlertInterface) {
        this._adapter = alertInterface;
    }
    showAlert(data: { title?: string, desc?: string, confirm: () => void, cancel?: () => void }) {
        if (this._adapter) {
            this._adapter.showSelectAlert(data);
        } else {
            data.confirm && data.confirm();
        }
    }
    showNormalTipsOnce(text: string, parent: cc.Node = null, time: number = 0.7, ydis: number = 50, pos: cc.Vec3 = cc.Vec3.ZERO) {
        this._adapter.showNormalTipsOnce(text, parent, time, ydis, pos);
    }

}

export const SdkAlertAdapter = new _AlertAdapter();