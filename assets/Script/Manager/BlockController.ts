import { _decorator, Color, Component, instantiate, LightingStage, log, Node, Prefab, Quat, Sprite, UITransform, Vec2, Vec3 } from 'cc';
import { Singleton } from '../Other/Singleton';
import { ReadMap } from '../Map/ReadMap';
import { LevelManager } from './LevelManager';
import { Block } from '../Block/Block';
import { NodeBlock } from '../Block/NodeBlock';
import { PathBlock } from '../Block/PathBlock';
import { CharacterManager } from './CharacterManager';
const { ccclass, property } = _decorator;
// 5- 10 level
// tween hero
interface NodeWithE {
    pos: Vec3;
    f: number;
    g: number;
    h: number;
    parent: NodeWithE | null;  // Recursive type reference
}

const COLOUR_LIST = [
    new Color(72, 209, 85, 255), // light green
    new Color(65, 190, 77, 255), // dark green
];

const COLOUR_LIST_HEAD = [
    new Color(255, 235, 0, 255),
    new Color(255, 124, 91, 255),
    new Color(0, 206, 255, 255),
    new Color(255, 124, 186, 255),
    Color.WHITE,
    Color.GRAY,
    Color.CYAN
];

const NODEBLOCK_LIST_COLOR : Map<Color, NodeBlock> = new Map(); // Lưu nodeBlock đang được chọn theo màu
const NODEBLOCK_LIST_POS : Map<NodeBlock, Vec3> = new Map(); // lưu vị trí ban đầu của nodeBlock

@ccclass('BlockController')
export class BlockController extends Singleton<BlockController> {

    colourList: Color[] = COLOUR_LIST;
    colourListHead: Color[] = COLOUR_LIST_HEAD;

    @property(Node)
    blockParent: Node = null;

    @property(Node)
    pathParent: Node = null;

    @property(Prefab)
    blockPrefab: Prefab = null;

    @property(Prefab)
    pathBlockPrefab: Prefab = null;

    @property(Prefab)
    nodeBlockPrefab: Prefab = null;
    @property(Node)
    nodeBlockParent: Node = null;

    currentMap: number[][] = null;
    fixedMap: number[][] = null;

    max_value: number = 0;
    startX: number = 0;
    startY: number = 0;
    blockSize: number;
    PATHPARENT_LIST_COLOR : Map<Color, Node> = new Map(); // Lưu pathParent theo màu
    currentColorNumber: number = 0;

    onLoad() {
        super.onLoad();
        this.readMap();
        this.blockSize = LevelManager.getInstance().blockWidth;
    }

    readMap() {
        const readMap = new ReadMap();
        readMap.loadJson(this);
    }

    spawnBlock(pos : Vec3, color : number) {

        let block = instantiate(this.blockPrefab);
        this.blockParent.addChild(block);
        block.setPosition(pos);
        
        block.getComponent(UITransform).width = LevelManager.getInstance().blockWidth * 0.8;
        block.getComponent(UITransform).height = LevelManager.getInstance().blockWidth * 0.8;
        block.getComponent(Block).onInit(COLOUR_LIST_HEAD[color - 1]);

        let blockSprite = block.getComponent(Sprite);
        blockSprite.color = COLOUR_LIST_HEAD[color - 1];

        this.spawnNodeBlock(pos, COLOUR_LIST_HEAD[color - 1], color);
    }

    spawnListPathParentChildren(numberColor: number) {
        for (let i = 0; i < numberColor; i++) {
            this.spawnPathParent(COLOUR_LIST_HEAD[i], i + 1);
        }
    }

    spawnPathParent(color : Color, numberColor: number) {
        let pathParentColor = new Node();
        pathParentColor.name = "PathParent" + numberColor;
        this.pathParent.addChild(pathParentColor);
        this.PATHPARENT_LIST_COLOR.set(color, pathParentColor); // Lưu vào map
    }

    spawnNodeBlock(pos : Vec3, color : Color, blockNumber: number) {

        let block = instantiate(this.nodeBlockPrefab);
        this.nodeBlockParent.addChild(block);
        block.setPosition(pos);
        NODEBLOCK_LIST_POS.set(block.getComponent(NodeBlock), pos);

        block.getComponent(UITransform).width = LevelManager.getInstance().blockWidth * 0.8;
        block.getComponent(UITransform).height = LevelManager.getInstance().blockWidth * 0.8;
        block.getComponent(NodeBlock).onInit(color, pos, blockNumber);
        let blockSprite = block.getComponent(Sprite);
        blockSprite.color = color; 
    }

    spawnPathBlock(pos : Vec3, color : Color, isTurnRight : boolean, isTurnLeft : boolean, isTurnUp : boolean, isTurnDown : boolean) {
        if (this.hasPathBlock(color, pos)) {
            return;
        }
        let pathBlock = instantiate(this.pathBlockPrefab);
        this.PATHPARENT_LIST_COLOR.get(color).addChild(pathBlock);
        pathBlock.setPosition(pos);

        let pathBlockUITransform = pathBlock.getComponent(UITransform);
        pathBlockUITransform.width = LevelManager.getInstance().blockWidth;
        pathBlockUITransform.height = LevelManager.getInstance().blockWidth;
        let angle = 0;
        if (isTurnRight) {
            angle = 90;
        } else if (isTurnLeft) {
            angle = 270;
        } else if (isTurnUp) {
            angle = 180;
        } else if (isTurnDown) {
            angle = 0;
        }
        pathBlock.getComponent(PathBlock).onInit(color, this.currentColorNumber, angle);
    }

    hasPathBlock(color : Color, pos : Vec3) {
        let list = this.PATHPARENT_LIST_COLOR.get(color).children;
        for (let i = 0; i < list.length; i++) {
            if (Vec3.distance(list[i].position, pos) < 0.1) {
                return true;
            }
        }
    }

    getCOLOUR_LIST_COLOR() {
        return NODEBLOCK_LIST_COLOR;
    }

    getCOLOUR_LIST_POS() {
        return NODEBLOCK_LIST_POS;
    }

    findPathBFS(startPos: Vec3, targetPos: Vec3, currentMap : number[][], blockNumber : number): Vec3[] {
        //log(currentMap)
        const rows = currentMap.length;
        const cols = currentMap[0].length;
        const queue: Vec3[] = [startPos];
        const visited = new Set<string>();
        const parentMap = new Map<string, Vec3>();

        visited.add(`${startPos.x},${startPos.y}`);
        parentMap.set(`${startPos.x},${startPos.y}`, null);

        while (queue.length > 0) {
            const current = queue.shift();
            const x = current.x;
            const y = current.y;

            if (x === targetPos.x && y === targetPos.y) {
                return this.constructPath(parentMap, current);
            }

            const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]]; // Right, Down, Left, Up
            for (const [dx, dy] of directions) {
                const nx = x + dx;
                const ny = y + dy;
                const key = `${nx},${ny}`;

                if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && !visited.has(key)) {
                    //log(currentMap[nx][ny]);
                    if (currentMap[nx][ny] === 0 || currentMap[nx][ny] === blockNumber) {
                        visited.add(key);
                        queue.push(new Vec3(nx, ny, 0));
                        parentMap.set(key, new Vec3(x, y, 0));
                    }
                }
            }
        }
        return [];
    }

    constructPath(parentMap: Map<string, Vec3>, endPos: Vec3): Vec3[] {
        const path = [];
        let step = endPos;
        while (step) {
            path.unshift(new Vec3(step.x, step.y, 0)); // Add to the front of the path array
            step = parentMap.get(`${step.x},${step.y}`);
        }
        return path;
    }

    resetCurrentMap(path: Vec3[]) {
        for (let i = 0; i < path.length; i++) {
            let pos = path[i];
            this.currentMap[pos.x][pos.y] = 0;
        }
    }

    removeNodeBlock(color : Color, pos : Vec3) {
        // remove the child of pathParent with the same position as pos
        let list = this.PATHPARENT_LIST_COLOR.get(color).children;
        for (let i = 0; i < list.length; i++) {
            if (Vec3.distance(list[i].position, pos) < 0.1){
                // log(list[i]);
                list[i].destroy();
                return;
            }
        }
    }

    changeCurrentMap(blockNumber: number, path: Vec3[]) {
        for (let i = 0; i < this.fixedMap.length; i++) {
            for (let j = 0; j < this.fixedMap[i].length; j++) {
                if (this.currentMap[i][j] === blockNumber && this.fixedMap[i][j] === 0) {
                    this.currentMap[i][j] = 0;
                }
            }
        }
        // log(this.currentMap);
        let list = path.map((pos) => pos.clone());
        for (let i = 0; i < list.length; i++) {
            let x = list[i].x;
            let y = list[i].y;
            this.currentMap[x][y] = blockNumber;
        }

    }

    removeAllPathNode(color: Color, blockNumber: number) {
        let list = this.PATHPARENT_LIST_COLOR.get(color).children;
        for (let i = 0; i < list.length; i++) {
            list[i].destroy();
        }

        for (let i = 0; i < this.fixedMap.length; i++) {
            for (let j = 0; j < this.fixedMap[i].length; j++) {
                if (this.currentMap[i][j] === blockNumber && this.fixedMap[i][j] === 0) {
                    this.currentMap[i][j] = 0;
                }
            }
        }
    }

    checkWin() {
        log(NODEBLOCK_LIST_POS)
        let list = Array.from(NODEBLOCK_LIST_POS.keys());
        for (let i = 1; i < list.length; i++) {
            if (list[i].blockNumber == list[i - 1].blockNumber) {
                if (Vec3.distance(list[i].node.position, list[i - 1].node.position) > 0.1) {
                    return false;
                }
            }
        }
        return true;
    }

    makeHeroAttackMonster(blockNumber: number) {
        if (blockNumber != this.currentColorNumber) {
            return;
        }
        let list = Array.from(NODEBLOCK_LIST_POS.keys());
        for (let i = 1; i < list.length; i+=2) {
            log("Number: " + list[i].blockNumber + " " + this.currentColorNumber)
            if (list[i].blockNumber != blockNumber) {
                continue;
            }
            if (list[i].blockNumber == list[i - 1].blockNumber) {
                if (Vec3.distance(list[i].node.position, list[i - 1].node.position) < 0.1) {
                    log("Attack" + list[i].blockNumber);
                    CharacterManager.getInstance().makeHeroAttackMonster(list[i].blockNumber);
                    break;
                }
            }
        }
    }
}

