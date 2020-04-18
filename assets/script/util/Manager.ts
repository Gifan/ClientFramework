import { LoaderAdapter } from "../framework/loader/LoaderAdapter";
import { StorageManager } from "../framework/manager/StorageManager";
import { AudioManager, AudioType } from "../framework/manager/AudioManager";
import { NetManager } from "../framework/network/NetManager";
import { SpriteAtlasManager } from "./SpriteAtlasManager";
import { VoManager } from "../vo/VoManager";
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

    private _audio: AudioManager;
    public get audio(): AudioManager {
        if (this._audio == null) {
            this._audio = new AudioManager();
        }
        return this._audio;
    }

    private _net: NetManager;
    public get net(): NetManager {
        return NetManager.getInstance;
    }

    private _spatlas: SpriteAtlasManager;
    public get spAtlas(): SpriteAtlasManager {
        if (this._spatlas == null) {
            this._spatlas = new SpriteAtlasManager();
        }
        return this._spatlas;
    }
    
    public get vo(): VoManager {
        return VoManager.getInstance;
    }
}
export const Manager = new _Manager();