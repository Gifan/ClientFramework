import { AudioType, AudioManager } from "./AudioManager";
import { LoaderAdapter } from "../framework/loader/LoaderAdapter";
import { NetManager } from "../framework/network/NetManager";
import { VoManager } from "../vo/VoManager";
import { StorageManager } from "./StorageManager";
import { UIManager } from "./UIManager";

export type GameAudioType = AudioType;

class _Manager {
    public get loader() {
        return LoaderAdapter;
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

    public get vo(): VoManager {
        return VoManager.getInstance;
    }

    private _ui: UIManager;
    public get ui(): UIManager {
        return this._ui;
    }
}
export const Manager = new _Manager();