
let keyToByteLen = {
    "c": Int8Array.BYTES_PER_ELEMENT,
    "C": Uint8Array.BYTES_PER_ELEMENT,
    "h": Int16Array.BYTES_PER_ELEMENT,
    "H": Uint16Array.BYTES_PER_ELEMENT,
    "i": Int32Array.BYTES_PER_ELEMENT,
    "I": Uint32Array.BYTES_PER_ELEMENT,
    "f": Float32Array.BYTES_PER_ELEMENT,
}
export enum MsgAdapterType {
    READ,
    WRITE,
}
export class MsgAdapter {
    public static createReader(msg: any) {
        return new MsgAdapter(MsgAdapterType.READ, msg);
    }
    public static createWrite() {
        return new MsgAdapter(MsgAdapterType.WRITE);
    }
    private _offset: number = 0;
    private _msgData: any = null;
    private _parseData: DataView = null;
    private _tempMsgData: any = null;
    private _totalByteLength: number = 0;
    private _adapterType: MsgAdapterType;
    private constructor(msgAdapterType: MsgAdapterType, data?: any) {
        this._adapterType = msgAdapterType;
        this._offset = 0;
        this._msgData = data;
        if(this._adapterType == MsgAdapterType.READ && data){
            this._parseData = <DataView>data;
        }
    }
    //读取数据
    public readData(signType: string) {
        if (this._adapterType == MsgAdapterType.WRITE) { console.error("can't read in the WriteType"); return; }
        if (!this._parseData) return null;
        let len = signType.length;
        let realData = [];
        for (let i = 0; i < len; i++) {
            let c = signType.charAt(i);
            if (c == "c") {//1字节 unit8
                realData.push(this._parseData.getInt8(this._offset));
                this._offset += Int8Array.BYTES_PER_ELEMENT;
            } else if (c == "C") {
                realData.push(this._parseData.getUint8(this._offset));
                this._offset += Uint8Array.BYTES_PER_ELEMENT;
            } else if (c == "h") {
                realData.push(this._parseData.getInt16(this._offset));
                this._offset += Int16Array.BYTES_PER_ELEMENT;
            } else if (c == "H") {
                realData.push(this._parseData.getUint16(this._offset));
                this._offset += Uint16Array.BYTES_PER_ELEMENT;;
            } else if (c == "i") {
                realData.push(this._parseData.getInt32(this._offset));
                this._offset += Int32Array.BYTES_PER_ELEMENT;
            } else if (c == "I") {
                realData.push(this._parseData.getUint32(this._offset));
                this._offset += Uint32Array.BYTES_PER_ELEMENT;
            } else if (c == "f") {
                realData.push(this._parseData.getFloat32(this._offset));
                this._offset += Float32Array.BYTES_PER_ELEMENT;
            }
        }
    }

    //读取数据
    public writeData(signType: string, ...args) {
        if (this._adapterType == MsgAdapterType.READ) { console.error("can't write in the ReadType"); return; }
        let len = signType.length;
        let totalLen = 0;
        if (!this._tempMsgData) {
            this._tempMsgData = [];
        }
        for (let i = 0; i < len; i++) {
            let char = signType.charAt(i);
            totalLen += keyToByteLen[char];
            this._tempMsgData[i] = { key: char, data: args[i] };
        }
        this._totalByteLength += totalLen;
    }

    public parseBuffer() {
        // if(this._msgData) this._msgData
        if (!this._tempMsgData) return null;
        if (!this._msgData)
            this._msgData = new ArrayBuffer(this._totalByteLength);
        else {
            return this._msgData;
        }
        let data = new DataView(this._msgData);
        for (let i = 0, len = this._tempMsgData.length; i < len; i++) {
            let c = this._tempMsgData[i].key;
            let args = this._tempMsgData[i].data;
            if (c == "c") {//1字节 unit8
                data.setInt8(this._offset, args || 0);
                this._offset += Int8Array.BYTES_PER_ELEMENT;
            } else if (c == "C") {
                data.setUint8(this._offset, args || 0);
                this._offset += Uint8Array.BYTES_PER_ELEMENT;
            } else if (c == "h") {
                data.setUint16(this._offset, args || 0);
                this._offset += Int16Array.BYTES_PER_ELEMENT;
            } else if (c == "H") {
                data.setInt16(this._offset, args || 0);
                this._offset += Uint16Array.BYTES_PER_ELEMENT;;
            } else if (c == "i") {
                data.setInt32(this._offset, args || 0);
                this._offset += Int32Array.BYTES_PER_ELEMENT;
            } else if (c == "I") {
                data.setUint32(this._offset, args || 0);
                this._offset += Uint32Array.BYTES_PER_ELEMENT;
            } else if (c == "f") {
                data.setUint32(this._offset, args || 0);
                this._offset += Float32Array.BYTES_PER_ELEMENT;
            }
        }
        cc.log("长度",data.byteLength, data.buffer.byteLength);
        return data.buffer;
    }
}