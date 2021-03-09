/**
 * 分层状态机
 */

interface StateMap<T> {
    [key: number]: IState<T>;
}
interface TransitionMap<T> {
    [key: number]: IStateTransition<T>[];
}

interface IState<T> {
    onEnter(entity: T): void;
    onUpdate(entity: T, dt): void;
    onExit(entity: T): void;
    addTransition(transition: IStateTransition<T>): boolean;
    addState(st: IState<T>): boolean;
    onMessage(entity: T, msg: any): boolean;
    handleMessage?(msg: any): boolean;
    tag: number;
    isReEnter: boolean;
}

/**
 * 状态转移
 */
export interface IStateTransition<T> {
    fromTag: number;            //从哪个状态来
    toTag: number;              //到哪个状态去
    onCheck(entity: T): boolean;//检测是否可以转移
    onCompletaCallBack(entity: T): boolean;//转移成功回调，处理转移后状态重置或转移后回调
}

export abstract class State<T>{
    private _isReEnter: boolean = true;//是否能重复进入
    protected static _tag: number; //状态id
    protected _transitionMap: TransitionMap<T> = {};
    protected _stateMap: StateMap<T> = {};
    protected _parentState: State<T>;
    protected _curSubStateTag: number = StateType.NONE;// 当前子状态索引
    protected _preSubStateTag: number = StateType.NONE;// 上一次子状态索引
    protected _parentStateTag: number = StateType.NONE;
    protected _owner: T;
    public constructor(owner: T) {
        this._owner = owner;
    }

    abstract get tag(): number;

    set isReEnter(reenter: boolean) {
        this._isReEnter = reenter;
    }
    get isReEnter(): boolean {
        return this._isReEnter;
    }

    public setParentState(st: State<T>) {
        this._parentState = st;
    }

    public addTransition(transition: IStateTransition<T>): boolean {
        let trans = this._transitionMap[transition.fromTag];
        if (!trans) {
            trans = [];
            trans.push(transition);
        } else {
            for (let i = 0, len = trans.length; i < len; i++) {
                let item = trans[i];
                if (item.fromTag == transition.fromTag && item.toTag == transition.toTag) {
                    return false;
                }
            }
            trans.push(transition);
        }
        return true;
    }

    protected checkTransition() {
        for (this.tempIndex = 0, this.tempLength = this._transitionMap[this._curSubStateTag].length; this.tempIndex < this.tempLength; this.tempIndex++) {
            let transition = this._transitionMap[this._curSubStateTag][this.tempIndex];
            if (transition.onCheck(this._owner)) {
                if (transition.onCompletaCallBack(this._owner)) {
                    this.changeState(transition.toTag);
                }
            }
        }
    }

    public addState(st: State<T>): boolean {
        if (this._stateMap[st.tag]) {
            console.warn("repeat addState Tag = ", st.tag);
            return false;
        }
        this._stateMap[st.tag] = st;
        st.setParentState(this);
        if (!this._transitionMap[st.tag]) {
            this._transitionMap[st.tag] = [];
        }
        return true;
    }

    /**
     * 根据tag获取对应状态
     * @param tag 状态tag
     */
    public getStateByTag(tag: number) {
        return this._stateMap[tag];
    }

    protected tempIndex: number = 0;
    protected tempLength: number = 0;
    public onEnter(entity: T) {
        /**
         * 如果存在子状态（已经分层）则根据实体参数计算当前应该进入哪个子状态或者进入上一次的子状态
         */
        let state = this._stateMap[this._curSubStateTag];
        if (state) {
            state.onEnter(entity);
        }
    };

    public onUpdate(entity: T, dt) {
        let state = this._stateMap[this._curSubStateTag];
        if (state) {//存在子状态更新子状态并检测状态转移
            state.onUpdate(entity, dt);
        }
    };

    public onExit(entity: T) {
        let state = this._stateMap[this._curSubStateTag];
        if (state) {
            state.onExit(entity);
            this._preSubStateTag = this._curSubStateTag;
        } else {
            this._preSubStateTag = StateType.NONE;
        }
    };

    /**
     * 由状态机传输过来的消息处理
     * @param entity 对应实体
     * @param msg 消息数据
     */
    public onMessage(entity: T, msg: any): boolean {
        let state = this._stateMap[this._curSubStateTag];
        if (state) {
            return state.onMessage(entity, msg);
        }
        return false;
    };

    /**
     * 状态切换
     * @param stateTag 
     */
    public changeState(stateTag: number) {
        if (stateTag < 0) {
            console.error("<State call changeState>:trying to assign null state to current");
            return;
        }
        if (this._curSubStateTag == stateTag && !this._stateMap[this._curSubStateTag].isReEnter) {
            console.warn("can\'t enter repeat tag", stateTag);
            return;
        }
        this._preSubStateTag = this._curSubStateTag;
        if (this._stateMap[this._curSubStateTag]) {
            this._stateMap[this._curSubStateTag].onExit(this._owner);
        }
        this._curSubStateTag = stateTag;
        if (this._stateMap[this._curSubStateTag]) {
            this._stateMap[this._curSubStateTag].onEnter(this._owner);
        }
    }

    //返回前一个状态
    public revertToPreviousState() {
        this.changeState(this._preSubStateTag);
    }

    public isInState(st: number): boolean {
        return st === this._curSubStateTag;
    }
}


/**
 * 状态转移
 */
export class StateTransition<T> implements IStateTransition<T>{
    public constructor(from: number, to: number) {
        this._fromTag = from;
        this._toTag = to;
    }
    protected _fromTag: number;
    protected _toTag: number;
    get fromTag(): number { return this._fromTag; };
    get toTag(): number { return this._toTag; };
    onCheck(entity: T): boolean {
        return true;
    }
    onCompletaCallBack(entity: T): boolean {
        return true;
    }
}

enum StateType {
    NONE = -1,
}

export class StateMachine<T> extends State<T>{
    get tag(): number {
        return 0;
    }
    private _globalState: State<T>;//全局状态
    public constructor(owner: T) {
        super(owner);
        this._globalState = null;
    }

    public update(dt) {
        if (this._stateMap[this._curSubStateTag] && this._curSubStateTag != StateType.NONE) {
            this._stateMap[this._curSubStateTag].onUpdate(this._owner, dt);
            this.checkTransition();
        }
        this._globalState && this._globalState.onUpdate(this._owner, dt);
    }

    public handleMessage(msg: any): boolean {
        if (this._curSubStateTag && this._stateMap[this._curSubStateTag] && this._stateMap[this._curSubStateTag].onMessage(this._owner, msg)) {
            return true;
        }

        if (this._globalState && this._globalState.onMessage(this._owner, msg)) {
            return true;
        }
        return false;
    }

    public registerGlobalState(st: State<T>) {
        this._globalState = st;
    }
}

