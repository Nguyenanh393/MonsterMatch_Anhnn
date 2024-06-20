import { _decorator, Color, Component, EventMouse, log, Node } from 'cc';
import { BlockController } from '../Manager/BlockController';
import { NodeBlock } from './NodeBlock';
const { ccclass, property } = _decorator;

@ccclass('PathBlock')
export class PathBlock extends Component {
    pathBlockColor: Color;

    onInit(color: Color) {
        this.node.on(Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
        this.pathBlockColor = color;
    }

    onMouseDown(event: EventMouse) {
        let delta = event.getUILocation();

        let nodeBlock = BlockController.getInstance().getCOLOUR_LIST_COLOR().get(this.pathBlockColor);
        nodeBlock.isChoose = true;
        nodeBlock.moveNodeBlock(delta);
        
        // log(BlockController.getInstance().currentMap);
    }
}


