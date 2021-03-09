import { MVC } from "../../framework/MVC";

export default class ScreenCapModel extends MVC.BaseModel {

    private static _instance: ScreenCapModel = null;
    private _videoPath:string = "";
    private constructor() {
        super();
        if (ScreenCapModel._instance == null) {
            ScreenCapModel._instance = this;
        }
    }
    public reset(): void {

    }

    public static get getInstance(): ScreenCapModel {
        if (ScreenCapModel._instance == null) {
            ScreenCapModel._instance = new ScreenCapModel();
        }
        return ScreenCapModel._instance;
    }

    public get shareVideoPath(){
        return this._videoPath;
    }

    public set shareVideoPath(path:string){
        this._videoPath = path;
    }
}