
function round(num) {
    return Math.round(num);
}

class MaskPolygonGizmo extends Editor.Gizmo {
    init() {
        // 初始化一些参数
    }
    selectedIdx = -1;
    timeout = -1;
    onCreateMoveCallbacks() {
        // 创建 gizmo 操作回调

        // 申明一些局部变量
        let start_vertex;        // 按下鼠标时记录的位置
        let pressx, pressy;     // 按下鼠标时记录的鼠标位置

        return {
            /**
             * 在 gizmo 上按下鼠标时触发
             * @param x 按下点的 x 坐标
             * @param y 按下点的 y 坐标
             * @param event mousedown dom event
             */
            start: (x, y, event, param) => {
                y = this._view.offsetHeight - y;
                start_vertex = null;
                pressx = x;
                pressy = y;
                const target = this.target;
                const node = this.node;
                const i = param.i;
                const type = param.type;
                const vertexes = target.vertexes;

                // 转换坐标点到节点下
                let position = cc.v2(x, y);
                position = Editor.GizmosUtils.snapPixelWihVec2(position);
                position = this._view.pixelToWorld(position);
                position = node.convertToNodeSpaceAR(position);


                if (type === 'line') {
                    const len = vertexes.length;
                    vertexes[len] = cc.v2();

                    for (let index = len; index > (i + 1); index--) {
                        vertexes[index].x = vertexes[index - 1].x;
                        vertexes[index].y = vertexes[index - 1].y;
                    }
                    vertexes[i + 1].x = round(position.x);
                    vertexes[i + 1].y = round(position.y);

                    // Editor.log('onCreateMoveCallbacks start line', position);
                    target.vertexes = vertexes;
                } else if (type === 'circle') {
                    if (this.selectedIdx == i) {//双击删除
                        if (vertexes.length <= 3) return;
                        vertexes.splice(i, 1);
                        target.vertexes = vertexes;
                        this.selectedIdx = -1;
                        return;
                    }

                    this.selectedIdx = i;
                    clearTimeout(this.timeout);
                    this.timeout = setTimeout(() => {
                        this.selectedIdx = -1;
                    }, 500);
                }
            },

            /**
             * 在 gizmo 上按下鼠标移动时触发
             * @param dx 鼠标移动的 x 位移
             * @param dy 鼠标移动的 y 位移
             * @param event mousedown dom event
             */
            update: (dx, dy, event, param) => {
                // Editor.log('onCreateMoveCallbacks update', param)

                const i = param.i;
                const type = param.type;
                if (type === 'circle') {
                    // 获取 gizmo 依附的组件
                    const target = this.target;
                    const scaleX = target.node.scaleX;
                    const scaleY = target.node.scaleY;
                    const angle = target.node.angle * Math.PI / 180;
                    const cos_angle = Math.cos(angle);
                    const sin_angle = Math.sin(angle);
                    dx = dx / this._view.scale / scaleX;
                    dy = dy / this._view.scale / scaleY;
                    const dx_new = dx * cos_angle + dy * sin_angle;
                    const dy_new = -dx * sin_angle + dy * cos_angle;

                    if (!start_vertex) {
                        start_vertex = target.vertexes[i].clone();
                    }
                    let newx = round(start_vertex.x + dx_new);
                    let newy = round(start_vertex.y + dy_new);
                    //吸附效果
                    //查找前后两个端点
                    let disx = 999999;
                    let disy = 999999;
                    for (let j = 0, len = target.vertexes.length; j < len; j++) {
                        if (j != i) {
                            let point = target.vertexes[j];
                            let pdis = Math.abs(newx - point.x);
                            if (pdis <= target.threshold && pdis <= disx) {
                                disx = pdis;
                                newx = point.x;
                            }
                            pdis = Math.abs(newy - point.y);
                            if (pdis <= target.threshold && pdis <= disy) {
                                disy = pdis;
                                newy = point.y;
                            }
                        }
                    }
                    target.vertexes[i].x = newx;//round(start_vertex.x + dx_new);
                    target.vertexes[i].y = newy;//round(start_vertex.y + dy_new);
                    target.vertexes = target.vertexes;
                    // this.adjustValue(target);
                }
            },

            /**
             * 在 gizmo 抬起鼠标时触发
             * @param event mousedown dom event
             */
            end: (updated, event, param) => {

            }
        };
    }

    onCreateRoot() {
        // 创建 svg 根节点的回调，可以在这里创建你的 svg 工具
        // this._root 可以获取到 Editor.Gizmo 创建的 svg 根节点

        // 创建一个 svg 工具
        // group 函数文档 : http://documentup.com/wout/svg.js#groups
        this._tool = this._root.group();
        const target = this.target;

        const circles = [];
        const lines = [];
        const texts = [];

        const getCircle = (i) => {
            let circle = circles[i];
            if (!circle) {
                circles[i] = circle = this._tool.circle()
                    // 设置 fill 样式
                    .fill({ color: 'rgba(0,128,255,0.4)' })
                    // 设置点击区域，这里设置的是根据 fill 模式点击
                    .style('pointer-events', 'fill')
                    // 设置鼠标样式
                    .style('cursor', 'move')
                // 注册点击事件
                this.registerMoveSvg(circle, circle, { cursor: 'move' });
            }
            circle.i = i;
            circle.type = 'circle';
            return circle;
        }

        const getText = (i) => {
            let text = texts[i];
            if (!text) {
                texts[i] = text = this._tool.text(i + "").font({ size: 20, anchor: 'middle' }).fill('#ffffffff');
                this.registerMoveSvg(text, text, { cursor: 'move' });
            }
            text.i = i;
            text.type = 'text';
            return text;
        }

        const getLine = (i) => {
            let line = lines[i];
            if (!line) {
                lines[i] = line = this._tool.line()
                    .stroke({ color: '#7fc97a66', width: 15 })
                // 设置鼠标样式
                // .style('cursor', 'move')
                // 注册点击事件
                this.registerMoveSvg(line, line, { cursor: 'pointer', ignoreWhenHoverOther: true });
            }
            line.i = i;
            line.type = 'line';
            return line;
        }


        // 接下来要定义绘画函数
        this._tool.plot = (points, position) => {

            // 移动到节点位置
            this._tool.move(position.x, position.y);
            // 清除原来的点
            circles.forEach(v => v.radius(0));
            lines.forEach(v => v.plot(0, 0, 0, 0));
            // 画圆点
            points.map((v, i) => {
                // this._view.scale 编辑器缩放系数
                const v_next = points[(i + 1) % points.length];
                const line = getLine(i);
                // const text = getText(i);
                // text.move(v.x, v.y - 20);
                line.plot(v.x, v.y, v_next.x, v_next.y);
                // text.text(i+"");
            });
            points.map((v, i) => {
                const circle = getCircle(i);
                circle.center(v.x, v.y).radius(12 * this._view.scale);
            });
            // for (let i = points.length, len = texts.length; i < len; i++) {
            //     const text = getText(i);
            //     if (text) {
            //         text.move(1000, 1000);
            //     }
            // }

        };
        this.target._updateGraphisc();
    }

    onUpdate() {
        // 更新 svg 工具

        // 获取 gizmo 依附的组件
        let target = this.target;

        // 获取 gizmo 依附的节点
        let node = this.node;

        // // 获取节点世界坐标
        let position = node.convertToWorldSpaceAR(cc.v2(0, 0));

        // 转换世界坐标到 svg view 上
        // svg view 的坐标体系和节点坐标体系不太一样，这里使用内置函数来转换坐标
        position = this.worldToPixel(position);

        // 对齐坐标，防止 svg 因为精度问题产生抖动
        position = Editor.GizmosUtils.snapPixelWihVec2(position);

        // 移动 svg 工具到坐标
        this._tool.plot(target.vertexes.map((p) => {
            let scaleX = node.scaleX;
            let scaleY = node.scaleY;
            let angle = -node.angle * Math.PI / 180;
            const cos_angle = Math.cos(angle);
            const sin_angle = Math.sin(angle);

            const v = Editor.GizmosUtils.snapPixelWihVec2(p.mul(this._view.scale));
            return cc.v2(
                (v.x * cos_angle * scaleX + v.y * sin_angle * scaleY),
                -(-v.x * sin_angle * scaleX + v.y * cos_angle * scaleY)
            );
        }), position);
    }
}

module.exports = MaskPolygonGizmo;