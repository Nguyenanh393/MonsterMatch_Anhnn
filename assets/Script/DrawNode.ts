import { _decorator, Component, EventMouse, Graphics, Vec2, Color, EventTouch, Node, log } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DrawScript')
export class DrawScript extends Component {
    private graphics?: Graphics;
    private lastPoint?: Vec2;

    @property(Node)
    canvas: Node = null;

    @property
    lineColor: Color = new Color(255, 255, 255, 255); // màu trắng

    @property
    lineWidth: number = 5;

    onLoad() {
        this.graphics = this.getComponent(Graphics);
        if (!this.graphics) {
            this.graphics = this.addComponent(Graphics);
        }

        this.canvas.on(Node.EventType.TOUCH_START, this.onMouseMove, this);
    }

    onMouseMove(event: EventTouch) {
        log('onMouseMove');
        let point = event.getUILocation(); // Lấy vị trí chuột
        this.drawTo(new Vec2(point.x, point.y));
    }

    drawTo(point: Vec2) {
        if (this.lastPoint) {
            this.graphics!.lineWidth = this.lineWidth;
            this.graphics!.strokeColor = this.lineColor;
            this.graphics!.moveTo(this.lastPoint.x, this.lastPoint.y);
            this.graphics!.lineTo(point.x, point.y);
            this.graphics!.stroke();
        }
        this.lastPoint = point;
    }

    onDestroy() {
        this.canvas.off(Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }
}
