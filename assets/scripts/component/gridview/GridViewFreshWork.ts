import { Time } from "../../manager/Time";

export class GridViewFreshWorkItem {
    public index;
    public function: Function;
}

export class GridViewFreshWork {


    public gapTime = 0.02;

    private _timeWatcher = null;
    private dic: GridViewFreshWorkItem[] = [];

    public removeWork(index) {
        let items: any[] = this.getWorkItems(index);
        for (const item of items) {
            this.dic.splice(item, 1);
        }
    }

    public clear() {
        this.dic.length = 0;
    }

    public addWork(index, func: Function) {
        let item = new GridViewFreshWorkItem();
        item.index = index;
        item.function = func;
        this.dic.push(item);

        this.run();


    }

    private run() {
        if (this._timeWatcher === null) {
            this._timeWatcher = Time.delay(this.gapTime, this.excute, null, this, -1);
            this.excute();
        }
    }

    private excute() {
        if (this.dic.length === 0) {
            if(this._timeWatcher){
                this._timeWatcher.cancel();
            }
            this._timeWatcher = null;
            return;
        }
        this.dic[0].function();
        this.dic.shift();
    }

    private getWorkItems(index): number[] {
        let items: any[] = [];
        for (let i = 0; i < this.dic.length; i++) {
            if (this.dic[i].index === index) {
                items.push(i);
            }
        }
        return items;
    }


}
