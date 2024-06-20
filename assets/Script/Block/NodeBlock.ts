import { _decorator, color, Color, Component, EventMouse, EventTouch, find, log, Node, UITransform, Vec2, Vec3 } from 'cc';
import { BlockController } from '../Manager/BlockController';
import { Block } from './Block';
import { LevelManager } from '../Manager/LevelManager';
const { ccclass, property } = _decorator;

@ccclass('NodeBlock')
export class NodeBlock extends Component {
    blockColor: Color;
    blockStartPos: Vec3 = new Vec3();
    blockController: BlockController = null;
    blockSize: number;
    blockNumber: number = 0;

    canvas: Node = null;
    currentPos: Vec3 = new Vec3();
    movementExtraX: number;
    movementExtraY: number;
    currentPath: Vec3[] = [];
    findIndex: number = -1;
    isChoose: boolean = false;
    anotherBlock: NodeBlock;

    onInit(color: Color, startPos: Vec3, blockNumber: number) {
        this.canvas = find("Canvas");
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this); 
        this.canvas.on(Node.EventType.MOUSE_UP, this.onMouseUP, this);
        this.node.on(Node.EventType.MOUSE_DOWN, this.onMouseDown, this);

        this.blockColor = color;
        this.blockStartPos = startPos;
        this.blockController = BlockController.getInstance();
        this.blockSize = LevelManager.getInstance().blockWidth;
        this.currentPos = this.node.position.clone();
        this.blockNumber = blockNumber;

        this.movementExtraX = (BlockController.getInstance().currentMap[0].length / 2 - 0.5 - Math.floor(BlockController.getInstance().currentMap[0].length / 2)) * this.blockSize;
        this.movementExtraY = (BlockController.getInstance().currentMap.length / 2 - 0.5 - Math.floor(BlockController.getInstance().currentMap.length / 2)) * this.blockSize;
    }

    onTouchMove(event: EventTouch) {
        let delta = event.getUILocation();
        this.moveNodeBlock(delta);
        
    }
    moveNodeBlock(delta: Vec2) {
        let {startPos, targetPos, targetIndRow, targetIndCol} = this.findStartTargetPos(delta);
        
        
        if (!this.canFindPath(startPos, targetPos, targetIndRow, targetIndCol)) {
            return;
        }

        let path = this.findPath(startPos, targetPos);

        if (this.canDrawPath(path)) {
            this.drawPath(path);
        }
    }  

    findStartTargetPos(delta: Vec2) {
        let movementX = delta.x - this.canvas.position.x;
        let movementY = delta.y - this.canvas.position.y;

        let posX = Math.round((movementX - this.movementExtraX) / this.blockSize) * this.blockSize + this.movementExtraX;
        let posY = Math.round((movementY - this.movementExtraY) / this.blockSize) * this.blockSize + this.movementExtraY;
    
        let targetIndRow = (this.blockController.startY - posY) / this.blockSize;
        let targetIndCol = (posX - this.blockController.startX) / this.blockSize;
       
        let startPos1 = this.currentPos.clone();
        let startIndRow = (this.blockController.startY - startPos1.y) / this.blockSize;
        let startIndCol = (startPos1.x - this.blockController.startX) / this.blockSize;
        let startPos = new Vec3(startIndRow, startIndCol, 0);
        let targetPos = new Vec3(targetIndRow, targetIndCol, 0);

        return {startPos, targetPos, targetIndRow, targetIndCol};
    }

    canFindPath(startPos: Vec3, targetPos: Vec3, targetIndRow: number, targetIndCol: number) {
        if (targetIndRow < 0 || 
            targetIndRow >= this.blockController.currentMap.length || 
            targetIndCol < 0 || 
            targetIndCol >= this.blockController.currentMap[0].length) {
            return false;
        }

        let number = this.blockController.currentMap[targetIndRow][targetIndCol];
        if (number != 0 && number != this.blockNumber) {
            return false;
        }
        if (Vec3.distance(startPos, targetPos) < 0.1) {
            return false;
        }
        return true;
    }

    findPath(startPos: Vec3, targetPos: Vec3) {
        const path = this.blockController.findPathBFS(startPos, targetPos, this.blockController.currentMap, this.blockNumber);
        console.log("Path:", path.map(p => `(${p.x}, ${p.y})`));
        return path;
    }

    canDrawPath(path: Vec3[]) {
        log("CurrentPath", this.currentPath, "Path", path)
        let minIndex = Math.max(this.currentPath.length, path.length);
        for (let i = 1; i < path.length; i++) {
            let index = this.currentPath.findIndex(p => Vec3.distance(p, path[i]) < 0.1);
            if (index >= 0) {
                minIndex = Math.min(minIndex, index);
            }
        }
        log("MinIndex", minIndex);
        
        if (minIndex < this.currentPath.length && minIndex > 0) {
            for (let i = this.currentPath.length - 1; i > minIndex; i--) {
                let isHorizontal = this.currentPath[i - 1].x == this.currentPath[i].x;
                let isTurnRight = this.currentPath[i - 1].y < this.currentPath[i].y;
                let isTurnUp = this.currentPath[i - 1].x > this.currentPath[i].x;
                log("Remove", this.currentPath[i]);
                this.removePathNode(isHorizontal, isTurnRight, isTurnUp, this.currentPath[i].x, this.currentPath[i].y);
                this.currentPath.pop();
                
                let posX = this.currentPath[i - 1].y * this.blockSize + this.blockController.startX;
                let posY = this.blockController.startY - this.currentPath[i - 1].x * this.blockSize;

                this.node.position = new Vec3(posX, posY, 0);
                this.currentPos = this.node.position.clone();
            }
            return false;
        } else {
            if (minIndex == 0) {
                this.resetPath();
                return false;
            }
        }
        return true;
    }

    drawPath(path: Vec3[]) {
        for (let i = 1; i < path.length; i++) {
            if (Vec3.distance(this.node.position, this.anotherBlock.node.position) < 0.1) {
                return;
            }
            let isHorizontal = path[i - 1].x == path[i].x;
            let isTurnRight = path[i - 1].y < path[i].y;
            let isTurnUp = path[i - 1].x > path[i].x;
            let moveX = !isHorizontal ? 0 : (isTurnRight ? -this.blockSize/2 :  this.blockSize/2);
            let moveY = isHorizontal ? 0 : (isTurnUp ? -this.blockSize/2 : this.blockSize/2);

            let posX = path[i].y * this.blockSize + this.blockController.startX;
            let posY = this.blockController.startY - path[i].x * this.blockSize;

            this.blockController.spawnPathBlock(new Vec3(posX + moveX, posY + moveY, 0), this.blockColor, isHorizontal);
            this.currentPath.push(path[i]);
            this.node.position = new Vec3 (posX, posY, 0);
            this.currentPos = this.node.position.clone();
        }
    }

    removePathNode(isHorizontal: boolean, isTurnRight: boolean, isTurnUp : boolean, pathX: number, pathY: number) {
        let moveX = !isHorizontal ? 0 : (isTurnRight ? -this.blockSize/2 :  this.blockSize/2);
        let moveY = isHorizontal ? 0 : (isTurnUp ? -this.blockSize/2 : this.blockSize/2);

        let posX = pathY * this.blockSize + this.blockController.startX + moveX;
        let posY = this.blockController.startY - pathX * this.blockSize + moveY;

        this.blockController.removeNodeBlock(this.blockColor, new Vec3(posX, posY, 0));     
    }

    onMouseUP(event: EventMouse) {
        log("Mouse Up");
        log(this.currentPath);
        this.currentPos = this.node.position.clone();
        if (this.isChoose) {
            this.blockController.changeCurrentMap(this.blockNumber, this.currentPath);
            log(this.blockController.currentMap);
        }
        this.isChoose = false;
    }

    onMouseDown(event: EventMouse) {
        let list = this.blockController.nodeBlockParent.children;
        for (let i = 0; i < list.length; i++) {
            if (list[i].getComponent(NodeBlock).blockColor == this.blockColor && list[i].getComponent(NodeBlock) != this) {
                this.anotherBlock = list[i].getComponent(NodeBlock);
                break;
            }
        }
            
        this.isChoose = true;
        log("Choose" + this.name);
        let list1 = this.blockController.getCOLOUR_LIST_COLOR();
        let block = list1.get(this.blockColor);

        if (block != this) {
            if (block != null) {

                // FIX ME
                this.resetPath();

                block.resetNodeBlock();
                
            }
            list1.set(this.blockColor, this);
        } else {
            if (Vec3.distance(this.currentPos, this.anotherBlock.currentPos) < 0.1) {
                this.resetPath();
            }
        }
    }

    resetPath() {
        this.blockController.removeAllPathNode(this.blockColor, this.blockNumber);
        this.resetNodeBlock();
    }

    resetNodeBlock() {
        this.node.position = this.blockController.getCOLOUR_LIST_POS().get(this);

        let indexRow1 = (this.blockController.startY - this.node.position.y) / this.blockSize;
        let indexCol1 = (this.node.position.x - this.blockController.startX) / this.blockSize;

        this.currentPath = [new Vec3(indexRow1, indexCol1, 0)];
        this.currentPos = this.node.position.clone();
    }

}
