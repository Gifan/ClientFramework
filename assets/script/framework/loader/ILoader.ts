export interface ILoader {
    asset : object;
    isAlive : boolean;
    progress : number;

    init(assetName : string, assetPath : string, assetType : typeof cc.Asset) : void;
    //Load() : object;
    loadAsync() : void;
    isDone() : boolean;
    unLoad() : void;

    setProgressCallback(callback:(path : string, progress : number) => void, target : any);
}