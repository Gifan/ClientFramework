export interface SelectAlertInterface {
    showSelectAlert(data: { title?: string, desc?: string, confirm: () => void, cancel?: () => void }): void;
}

/**
 * 适配sdk对话框相关
 */
class _AlertAdapter {
    private _adapter!: SelectAlertInterface;
    public setAdapter(alertInterface: SelectAlertInterface) {
        this._adapter = alertInterface;
    }
    showAlert(data: { title?: string, desc?: string, confirm: () => void, cancel?: () => void }) {
        if (this._adapter) {
            this._adapter.showSelectAlert(data);
        } else {
            data.confirm && data.confirm();
        }
    }
}

export const SdkSelectAlertAdapter = new _AlertAdapter();