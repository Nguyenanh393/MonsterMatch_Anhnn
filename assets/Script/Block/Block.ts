import { _decorator, Color, Component, EventMouse, EventTouch, find, Graphics, log, Node, Sprite, Vec2, Vec3 } from 'cc';
import { BlockController } from '../Manager/BlockController';
const { ccclass, property } = _decorator;

@ccclass('Block')
export class Block extends Component {

    color: Color;


    onLoad() {
        this.node.on(Node.EventType.MOUSE_DOWN, this.onMouseEnter, this); 
        // this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this); 
    }

    onInit(color: Color) {
        this.color = color;
        //log("Block color: " + this.color);
    }

    onMouseEnter(event: EventMouse) {
        // log("Block color: " + this.color);
    }


    // onTouchMove(event: EventTouch) {
    //     // if (!this.hasPath) {
            
    //     // }
    //     let delta = event.getUIDelta();
    //     //let direction = delta.x > 0 ? 1 : -1;
    //     let movement = delta.x;

        
    //     this.node.position = this.node.position.add3f(movement, 0, 0);
    // }

}


