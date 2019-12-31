import { ILoader } from "./ILoader";
type LoaderCallback = (name: string, asset: object) => void;

export class Session {
    public name: string;
    public path: string;
    public type: typeof cc.Asset;
    public loader: ILoader;
    public callbacks: LoaderCallback[];
    public targets: any[];
}