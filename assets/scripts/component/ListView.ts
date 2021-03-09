

/**
 * 通用横向、纵向滚动条复用
 */

const { ccclass, property } = cc._decorator;

@ccclass
export class ListView extends cc.Component {

    @property(cc.Node)
    itemPrefab: cc.Node = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;



    @property({ displayName: 'item间隔' })
    public spacing: number = 0;// space between each item

    private bufferZone: number = 0; // when item is away from bufferZone, we relocate it

    @property({ displayName: '更新频率' })
    private updateInterval: number = 0.15;

    private updateTimer: number = 0;
    private totalCount: number = 0; // how many items we need for the whole list
    private isHor: boolean = false;  //是否是垂直
    private lastContentPos: number = 0;
    private content: cc.Node = null;
    private adapter: DataAdapter = null;
    private items: cc.Node[] = [];
    public itemHeight: number = 0;
    public itemWidth: number = 0;
    private spawnCount: number = 0;
    private extraNodeNum: number = 1;
    onLoad() {
        if (this.scrollView) {
            this.isHor = this.scrollView.horizontal;
            this.content = this.scrollView.content;
            this.itemWidth = this.itemPrefab.width;
            this.itemHeight = this.itemPrefab.height;
            if (this.isHor) {
                this.scrollView.vertical = false;
                this.content.anchorX = 0;
                this.content.anchorY = 0.5;
                this.content.x = this.content.parent.width * this.content.parent.anchorX;
                this.content.height = this.content.parent.height;
                this.spawnCount = Math.ceil(this.content.parent.width / (this.itemWidth + this.spacing)) + this.extraNodeNum;
                this.bufferZone = (this.scrollView.node.width + this.spacing + this.itemWidth) * 0.5;
            } else {
                this.scrollView.vertical = true;
                this.content.anchorY = 1;
                this.content.anchorX = 0.5;
                this.content.width = this.content.parent.width;
                this.content.y = this.content.parent.height * this.content.parent.anchorY;
                this.spawnCount = Math.ceil(this.content.parent.height / (this.itemHeight + this.spacing)) + this.extraNodeNum;
                this.bufferZone = (this.scrollView.node.height + this.spacing + this.itemHeight) * 0.5;
            }
        } else {
            console.error("ListView need a scrollView to showing.");
        }
        this.lastContentPos = 0;

    }

    scrollEvent(sender, event: cc.ScrollView.EventType) {
        switch (event) {
            case cc.ScrollView.EventType.SCROLLING:
                {
                    if (this.isHor) {
                        this.adjustViewHorizontal();
                    } else {
                        this.adjustViewVertical();
                    }
                }
                break;
        }
    }

    start() {

    }

    //计算item相对scrollview的坐标
    private getPositionInView(item: cc.Node): cc.Vec3 {
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    }

    public setAdapter(adapter: DataAdapter) {
        this.adapter = adapter;
        this.itemHeight = this.itemPrefab.height;
        this.itemWidth = this.itemPrefab.width;
        this.totalCount = this.adapter.getCount();
        if (this.isHor) {
            this.content.width = this.totalCount * (this.itemWidth + this.spacing) + this.spacing;
        } else {
            this.content.height = this.totalCount * (this.itemHeight + this.spacing) + this.spacing;
        }
        if (this.totalCount <= this.spawnCount - this.extraNodeNum) this.spawnCount = this.totalCount;
        for (let i = 0; i < this.spawnCount; i++) {
            let item = cc.instantiate(this.itemPrefab);
            this.content.addChild(item);
            item.active = true;
            this.isHor ? item.setPosition(item.width * (0.5 + i) + this.spacing * (i + 1), 0) : item.setPosition(0, -item.height * (0.5 + i) - this.spacing * (i + 1));
            item.getComponent(item.name).initItem(i, this.adapter.getItem(i));
            this.items.push(item);
        }
    }


    update(dt) {
        if (!this.adapter || this.updateInterval <= 0) return;
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) return; // we don't need to do the math every frame
        this.updateTimer = 0;
        if (this.isHor) {
            this.adjustViewHorizontal();
        } else {
            this.adjustViewVertical();
        }

    }

    public adjustViewHorizontal() {
        let items = this.items;
        let buffer = this.bufferZone;
        let isDown = this.scrollView.content.x > this.lastContentPos; // scrolling direction
        let offset = (this.itemWidth + this.spacing) * items.length;
        for (let i = 0; i < items.length; ++i) {
            let viewPos = this.getPositionInView(items[i]);

            if (isDown) {
                // if away from buffer zone and not reaching top of content
                if (viewPos.x > buffer && items[i].x - offset > 0) {
                    items[i].x = items[i].x - offset;
                    let item = items[i].getComponent(items[i].name);
                    let itemId = item.itemID - items.length; // update item id
                    item.updateItem(itemId, this.adapter.getItem(itemId));
                }
            } else {
                // if away from buffer zone and not reaching bottom of content
                if (viewPos.x < -buffer && items[i].x + offset < this.content.width) {//超过显示区域，且还没有到底就改变位置
                    items[i].x = items[i].x + offset;
                    let item = items[i].getComponent(items[i].name);
                    let itemId = item.itemID + items.length;
                    item.updateItem(itemId, this.adapter.getItem(itemId));
                }
            }
        }
        // update lastContentPosY
        this.lastContentPos = this.scrollView.content.x;
    }
    public adjustViewVertical() {
        let items = this.items;
        let buffer = this.bufferZone;
        let isDown = this.scrollView.content.y < this.lastContentPos; // scrolling direction
        let offset = (this.itemHeight + this.spacing) * items.length;
        for (let i = 0; i < items.length; ++i) {
            let viewPos = this.getPositionInView(items[i]);

            if (isDown) {
                // Log.log("y=",i, viewPos.y, items[i].y, -buffer, offset);
                // if away from buffer zone and not reaching top of content
                if (viewPos.y < -buffer && items[i].y + offset < 0) {
                    items[i].y = items[i].y + offset;
                    let item = items[i].getComponent(items[i].name);
                    let itemId = item.itemID - items.length; // update item id
                    item.updateItem(itemId, this.adapter.getItem(itemId));
                }
            } else {
                // if away from buffer zone and not reaching bottom of content
                if (viewPos.y > buffer && items[i].y - offset > -this.content.height) {
                    items[i].y = items[i].y - offset;
                    let item = items[i].getComponent(items[i].name);
                    let itemId = item.itemID + items.length;
                    item.updateItem(itemId, this.adapter.getItem(itemId));
                }
            }
        }
        // update lastContentPosY
        this.lastContentPos = this.scrollView.content.y;
    }

    /**
     * 主动更新界面
     * @param index 
     */
    public updateView(index: number = -1) {
        if (index == -1) {//更新全部
            let items = this.items;
            for (let i = 0; i < items.length; ++i) {
                let item = items[i].getComponent(items[i].name);
                item.updateItem(item.itemID, this.adapter.getItem(item.itemID));
            }
        } else {
            let item = this.items[index];
            if (item) {
                let com = item.getComponent(item.name)
                com.updateItem(com.itemID, this.adapter.getItem(com.itemID));
            }
        }

    }
}

export class DataAdapter {
    private dataSet: any[] = [];
    public setDataSet(data: any[]) {
        this.dataSet = data;
    }

    public getCount(): number {
        return this.dataSet.length;
    }

    public getItem(posIndex: number): any {
        return this.dataSet[posIndex];
    }
}
