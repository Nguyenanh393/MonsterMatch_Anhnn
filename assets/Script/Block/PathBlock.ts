import { _decorator, Color, Component, EventMouse, EventTouch, find, log, Node, Sprite, UITransform, Vec3 } from 'cc';
import { BlockController } from '../Manager/BlockController';
import { NodeBlock } from './NodeBlock';
import { CharacterManager } from '../Manager/CharacterManager';
const { ccclass, property } = _decorator;

@ccclass('PathBlock')
export class PathBlock extends Component {
    pathBlockColor: Color;
    pathBlockNumber: number;
    
    @property(Node)
    pathBlockImage: Node = null;
    
    onInit(color: Color, pathBlockNumber: number, angle: number) {
        this.node.on(Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
        this.pathBlockColor = color;
        let pathBlockImageUITransform = this.pathBlockImage.getComponent(UITransform);
        pathBlockImageUITransform.width = BlockController.getInstance().blockSize * 0.4;
        pathBlockImageUITransform.height = BlockController.getInstance().blockSize * 1.4;
        this.pathBlockImage.setPosition(new Vec3(0, BlockController.getInstance().blockSize / 2, 0));
        let sprite = this.pathBlockImage.getComponent(Sprite);
        sprite.color = color;
        this.node.angle = angle;
        this.pathBlockNumber = pathBlockNumber;
    }

    onMouseDown(event: EventMouse) {
        let delta = event.getUILocation();

        let nodeBlock = BlockController.getInstance().getCOLOUR_LIST_COLOR().get(this.pathBlockColor);
        nodeBlock.isChoose = true;
        nodeBlock.moveNodeBlock(delta);
        BlockController.getInstance().currentColorNumber = nodeBlock.blockNumber;
        CharacterManager.getInstance().moveMonster(true, this.pathBlockNumber)
    }
    
}


