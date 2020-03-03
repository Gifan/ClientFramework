export default interface IPlatformToolsCtrler {
    showKefu();
    showImage(url: string);
    jumpApp(appId: string, path?: string, extraData?: PathObj, onCpl?: (failReason: string) => void, arg?: any);
    addAccelerometerEvent?(type: string, cb: fw.cb1<boolean>);
    stopAccelerometerEvent?();
}