import { LoaderAdapter } from "../loader/LoaderAdapter";
import { StorageManager } from "./StorageManager";
import { AudioManager, AudioType } from "./AudioManager";
export type GameAudioType = AudioType;

class _Manager {
    private _loader: LoaderAdapter;
    public get loader(): LoaderAdapter {
        if (this._loader == null) {
            this._loader = new LoaderAdapter();
        }
        return this._loader;
    }

    private _storage: StorageManager;
    public get storage(): StorageManager {
        if (this._storage == null) {
            this._storage = new StorageManager();
        }
        return this._storage;
    }

    public _audio: AudioManager;
    public get audio(): AudioManager {
        if (this._audio == null) {
            this._audio = new AudioManager();
        }
        return this._audio;
    }
}
export const Manager = new _Manager();