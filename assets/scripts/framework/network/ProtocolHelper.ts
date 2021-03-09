import { IProtocolHelper, NetData } from "./NetInterface";

export default class ProtocolHelper implements IProtocolHelper {
    private _heartBeat: ArrayBuffer = null;
    public constructor() {
        if (!this._heartBeat) {
            this._heartBeat = new ArrayBuffer(4);
            let a = new DataView(this._heartBeat);
            a.setUint32(0, 1001);
        }
    }

    getHeadlen(): number {
        return 0;
    }
    getHearbeat(): NetData {
        return this._heartBeat;
    }
    /**
     * 返回数据字节长度
     * @param msg 
     */
    getPackageLen(msg: NetData): number {
        if (typeof msg === "string") {
            return msg.length;
        } else {
            return msg.toString().length;
        }
        return 0;
    }
    checkPackage(msg: NetData): boolean {
        return true;
    }
    getPackageId(msg: NetData): number {
        if (msg instanceof ArrayBuffer) {
            let data = new DataView(msg);
            let a = data.getUint32(0);
            return a;
        } else if (msg instanceof Uint8Array) {
            let data = new DataView(msg.buffer);
            let a = data.getUint32(0);
            return a;
        }
        else if (typeof msg == "string") {//decode

        }
        return 0;
    }

}