/// <reference path="../creator.d.ts"/>
/// <reference path="lib.dom.d.ts"/>

declare module cc {
    export interface Button {
        _onTouchEnded(event: any): void;
        audioId: number,
    }

    export interface Node {
        gridIndex: number,
        _touchListener: { setSwallowTouches: Function },
    }

    export let nativeAndroid:any;
}