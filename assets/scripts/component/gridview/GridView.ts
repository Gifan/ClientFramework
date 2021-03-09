import { PoolArray } from "./PoolArray";
import GridViewCell from "./GridViewCell";
import { LAYOUT_HORIZONTAL_TYPE, LAYOUT_VERTICAL_TYPE, TwoDLayoutObject } from "./layout/TwoDLayoutObject";
import { TwoDHorizontalLayoutObject } from "./layout/TwoDHorizontalLayoutObject";
import { MathSection } from "./mathsection/MathSection";
import { MathUtils } from "./mathsection/MathUtils";
import { AutoScaleComponent } from "./layout/AutoScaleComponent";
import { GridViewFreshWork } from "./GridViewFreshWork";

const { ccclass, property } = cc._decorator;

export enum GRID_TYPE {
    GRID_HORIZONTAL,
    GRID_VERTICAL
}

@ccclass
export default class GridView extends cc.Component {
    // 类型,水平/竖直;
    @property({ type: cc.Enum(GRID_TYPE), tooltip: "水平/竖直" })
    public grid_view_type: GRID_TYPE = GRID_TYPE.GRID_VERTICAL;

    // 布局方式(左对齐,右对齐,居中对齐);
    @property({ type: cc.Enum(LAYOUT_HORIZONTAL_TYPE), tooltip: "水平对齐方式 - 左 / 中 / 右" })
    public horizontal_layout: LAYOUT_HORIZONTAL_TYPE = LAYOUT_HORIZONTAL_TYPE.CENTER;

    @property({ type: cc.Enum(LAYOUT_VERTICAL_TYPE), tooltip: "竖直对齐方式 - 上 / 中 / 下" })
    public vertical_layout: LAYOUT_VERTICAL_TYPE = LAYOUT_VERTICAL_TYPE.TOP;

    @property({ tooltip: "cell之间的水平/竖直间距" })
    public space: cc.Vec2 = cc.Vec2.ZERO;

    @property({ type: cc.ScrollView })
    public scrollview: cc.ScrollView = null;

    @property({ type: cc.Prefab, tooltip: "cell的预制物" })
    public templete: cc.Prefab = null;

    @property({ type: cc.Integer, min: 1, tooltip: "行列数,当GRID_TYPE为水平时,值只会为1" })
    public key_count: number = 1;

    @property({ type: cc.Node, tooltip: "", readonly: true })
    public content: cc.Node = null;

    @property
    public enableAutoScale: boolean = true;

    public dataCallBack: Function = null;

    // 可见区的大小;
    protected viewport_length: number = 0;

    protected data_list: any[] = [];

    protected layout_obj: TwoDLayoutObject = null;

    protected _autoScaleComponent: AutoScaleComponent = null;

    protected _scaleRatio = 1;

    private last_visible_range: MathSection = new MathSection();

    private pool_array: PoolArray = new PoolArray();

    private has_init: boolean = false;

    private _scrollEnabled: boolean = true;

    private _freshWorks: GridViewFreshWork = new GridViewFreshWork();



    public addNodeCreateEvent(callBack: Function) {
        this.pool_array.firstLoad.push(callBack);
    }

    // public set scrollEnable(enabled: boolean) {
    //     if (this.scrollview === null) {
    //         return;
    //     }

    //     if (enabled === this._scrollEnabled) {
    //         return;
    //     }
    //     this._scrollEnabled = enabled;
    //     if (enabled) {
    //         (this.scrollview as any)._registerEvent();
    //     } else {
    //         (this.scrollview as any)._unregisterEvent();
    //     }
    // }

    public scrollToCell(index: number) {
        const pos = this.layout_obj.getPosByIndex(index);
        const itemSize = this.layout_obj.item_size;
        let offset: cc.Vec2 = null;
        switch (this.grid_view_type) {
            case GRID_TYPE.GRID_HORIZONTAL:
                offset = cc.v2(pos.x - itemSize.x * 0.5, 0);
                break;
            case GRID_TYPE.GRID_VERTICAL:
                offset = cc.v2(0, -pos.y + itemSize.y * 0.5);
                break;
            default:
                offset = cc.v2(0, 0);
                break;
        }

        this.scrollview.scrollToOffset(offset);
        this.doFresh();
    }

    public moveToTop() {
        if (this.scrollview === null) {
            return;
        }
        this.scrollview.scrollToOffset(new cc.Vec2(0, 0));
    }

    public loadData(data_list: any[]) {
        this.init();
        if (data_list.length >= this.data_list.length) {
            // 
        }
        else {
            this.moveToTop();
        }

        this.data_list = data_list;

        this.layout_obj.count = this.data_list.length;

        let parent_size = cc.Vec2.ZERO;

        switch (this.grid_view_type) {
            case GRID_TYPE.GRID_VERTICAL:
                {
                    let height = this.layout_obj.getBoundingRect().y;
                    this.content.height = height;
                    this.content.width = this.node.width;
                    parent_size.x = this.node.width;
                    parent_size.y = height;
                }
                break;

            case GRID_TYPE.GRID_HORIZONTAL:
                {
                    let width = this.layout_obj.getBoundingRect().x;
                    this.content.width = width;
                    this.content.height = this.node.height;
                    parent_size.x = width;
                    parent_size.y = this.node.height;
                }
                break;
        }
        this.layout_obj.parent_size = parent_size;

        this.onLoadData();

        this.doFresh();
    }

    protected onLoadData() {

    }

    protected onEnable() {
        if (this.scrollview === null) {
            return;
        }
        if (!this._scrollEnabled) {
            (this.scrollview as any)._unregisterEvent();
        }
    }

    protected onDestroy() {
        this.pool_array.clear();
        this.dataCallBack = null;
        this._freshWorks.clear();
    }



    private init() {
        if (this.has_init) {
            return;
        }

        this.has_init = true;

        this.node.on("scrolling", this.onScrolling, this);

        if (this.node.getComponent(cc.Widget)) {
            this.node.getComponent(cc.Widget).updateAlignment();
        }

        let temp_node = cc.instantiate(this.templete);
        let widget_component = temp_node.getComponent(cc.Widget);
        if (widget_component && widget_component.enabled === true) {
            // 特殊处理有widget组件的node，需要显式地调用updateAlignment才能获取到对应的尺寸
            temp_node.parent = this.node;
            widget_component.updateAlignment();
        }

        let cell_width = temp_node.width * temp_node.scale;
        let cell_height = temp_node.height * temp_node.scale;

        temp_node.destroy();

        let key_size = 0;
        let tmp_size = new cc.Vec2(cell_width, cell_height);
        // this.scrollview.node.
        switch (this.grid_view_type) {
            case GRID_TYPE.GRID_HORIZONTAL:
                if (this.scrollview !== null) {
                    this.scrollview.horizontal = true;
                    this.scrollview.vertical = false;
                }

                this.layout_obj = new TwoDHorizontalLayoutObject();
                this.layout_obj.vertical_layout_type = this.vertical_layout;

                this.viewport_length = this.node.width;
                this.key_count = 1;
                break;

            case GRID_TYPE.GRID_VERTICAL:
                if (this.scrollview !== null) {
                    this.scrollview.horizontal = false;
                    this.scrollview.vertical = true;
                }

                this.layout_obj = new TwoDLayoutObject();
                this.layout_obj.horizontal_layout_type = this.horizontal_layout;

                this.viewport_length = this.node.height;
                break;
        }

        if (this.enableAutoScale && this._autoScaleComponent === null) {
            this._autoScaleComponent = new AutoScaleComponent();

            this._autoScaleComponent.itemSize = tmp_size;
            this._autoScaleComponent.parentSize = new cc.Vec2(this.node.width, this.node.height);
            this._autoScaleComponent.type = this.grid_view_type;
            this._autoScaleComponent.space = this.space;
            this._autoScaleComponent.keyCount = this.key_count;

            let scale = this._autoScaleComponent.getScale();

            this._scaleRatio = scale;
        }

        this.layout_obj.key_count = this.key_count;
        this.layout_obj.space = this.space;
        this.layout_obj.item_anchor_point = this.templete.data.getAnchorPoint();
        this.layout_obj.item_size = tmp_size;

        switch (this.grid_view_type) {
            case GRID_TYPE.GRID_HORIZONTAL:
                key_size = this.layout_obj.item_size.x + this.space.x;
                break;

            case GRID_TYPE.GRID_VERTICAL:
                key_size = this.layout_obj.item_size.y + this.space.y;
                break;
        }

        let max_count: number = (Math.ceil(this.viewport_length / key_size) + 1) * this.key_count;

        this.pool_array.parent = this.content;
        this.pool_array.template = this.templete;
        this.pool_array.max_count = max_count;
        this.pool_array.firstLoad.push((obj, i, index) => {
            obj.name = this.templete.name + "_" + index;
            obj.scale *= this._scaleRatio;
        });
    }

    private doFresh() {
        let cur_visible_range: MathSection = this.getCurVisibleIndex();
        let repeat_area: MathSection = cur_visible_range.and(this.last_visible_range);
        let need_hide_area: MathSection = repeat_area.Invert(this.last_visible_range);

        if (!need_hide_area.isNullRange()) {
            let left = Math.floor(need_hide_area.left);
            let right = Math.floor(need_hide_area.right);

            for (let i = left; i <= right; i++) {
                this.pool_array.getObj(i, false).active = false;
                this._freshWorks.removeWork(i);
            }
        }
        this.freshArea(cur_visible_range, this.compareSection(cur_visible_range, repeat_area));
        this.freshFinish(cur_visible_range);
    }

    private freshItemInFrames(i) {
        this._freshWorks.addWork(i, () => {
            let obj = this.pool_array.getObj(i, false);
            obj.active = true;
            (obj as any)._onSiblingIndexChanged();


            let widget_component = obj.getComponent(cc.Widget);
            if (widget_component) {
                obj.removeComponent(widget_component);
                obj.width = this.layout_obj.item_size.x;
                obj.height = this.layout_obj.item_size.y;
            }

            this.calculatePos(obj, i);
            let data = this.data_list[i];

            if (this.dataCallBack !== null) {
                this.dataCallBack(obj, data, i);
            }

            let cell: GridViewCell = obj.getComponent(GridViewCell);

            if (cell !== null) {
                cell.onRefresh(data, i);
            }
        });
    }

    private freshArea(fresh_range: MathSection, dir) {
        if (fresh_range.isNullRange()) {
            return;
        }

        let left = Math.floor(fresh_range.left);
        let right = Math.floor(fresh_range.right);

        // 获取刷新的方向;
        if (dir >= 0) {
            for (let j = left; j <= right; j++) {
                let i = j;
                this.freshItemInFrames(i);
            }
        }
        else {
            for (let j = right; j >= left; j--) {
                let i = j;
                this.freshItemInFrames(i);
            }
        }
    }

    private freshFinish(cur_visible_range: MathSection) {
        this.last_visible_range = cur_visible_range;
    }

    private calculatePos(obj: cc.Node, i: number) {
        let pos: cc.Vec2 = this.layout_obj.getPosByIndex(i);
        obj.position = cc.v3(pos.x,pos.y,0);
    }

    private getCurVisibleIndex(): MathSection {
        let ht: MathSection = new MathSection();

        let key_pos: number = 0;
        let key_size: number = 0;
        let real_size: number = 0;

        if (this.grid_view_type === GRID_TYPE.GRID_VERTICAL) {
            key_pos = this.content.y;
            key_size = this.layout_obj.item_size.y + this.layout_obj.space.y;
            real_size = this.content.height;
        } else if (this.grid_view_type === GRID_TYPE.GRID_HORIZONTAL) {
            key_pos = -this.content.x;
            key_size = this.layout_obj.item_size.x + this.layout_obj.space.x;
            real_size = this.content.width;
        }

        let visible_range: MathSection = new MathSection();
        visible_range.left = key_pos;
        visible_range.right = visible_range.left + this.viewport_length;

        let real_range: MathSection = new MathSection();
        real_range.left = 0;
        real_range.right = real_range.left + real_size;

        let section_range: MathSection = visible_range.and(real_range);
        if (!section_range.isNullRange() && section_range.length() !== 0) {

            if (section_range.left !== section_range.right) {
                let a = Math.floor(section_range.left / key_size);
                ht.left = this.key_count * a;

                let b = Math.ceil(section_range.right / key_size);
                ht.right = b * this.key_count - 1;

                ht.right = MathUtils.Clamp(ht.right, 0, this.layout_obj.count - 1);
            }
        }

        return ht;
    }

    private onScrolling() {
        this.refresh();
    }

    private refresh() {
        let cur_visible_range: MathSection = this.getCurVisibleIndex();
        let repeat_area: MathSection = cur_visible_range.and(this.last_visible_range);
        let need_hide_area: MathSection = repeat_area.Invert(this.last_visible_range);

        if (!need_hide_area.isNullRange()) {
            let left = Math.floor(need_hide_area.left);
            let right = Math.floor(need_hide_area.right);

            for (let i = left; i <= right; i++) {
                this.pool_array.getObj(i, false).active = false;
                this._freshWorks.removeWork(i);
            }
        }

        let need_refresh_area: MathSection = repeat_area.Invert(cur_visible_range);

        if (!need_refresh_area.isNullRange()) {
            this.freshArea(need_refresh_area, this.compareSection(need_refresh_area, repeat_area));
        }
        this.freshFinish(cur_visible_range);
    }

    private compareSection(sectionA: MathSection, sectionB: MathSection) {
        if (sectionA.isNullRange()) {
            return -1;
        }

        if (sectionB.isNullRange()) {
            return 1;
        }

        if (sectionA.left < sectionB.left) {
            return -1;
        }

        return 1;
    }
}
