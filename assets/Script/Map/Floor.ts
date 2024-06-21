import { _decorator, Component, instantiate, log, Node, Prefab, Sprite, UITransform } from 'cc';
import { LevelManager } from '../Manager/LevelManager';
import { BlockController } from '../Manager/BlockController';
const { ccclass, property } = _decorator;

@ccclass('Floor')
export class Floor extends Component {
    
    @property(Prefab)
    blockPrefab: Prefab = null;

    // onLoad() {
    //     this.blockWidth = LevelManager.getInstance().blockWidth;
    //     this.createFloor();
    // }

    createFloor(blockWidth: number) {
        let currentLevel = LevelManager.getInstance().currentLevel;
        let levelData = LevelManager.getInstance().getLevelData(currentLevel);
        let map = levelData.getMap();

        let mapWidth = map[0].length;
        let mapHeight = map.length;

        let startX = -mapWidth * blockWidth / 2 + blockWidth / 2;
        // let startY = mapHeight * blockWidth / 2 - blockWidth / 2;

        // TRY 
        let startY = 0;
        
        for (let i = 0; i < mapHeight; i++) {
            for (let j = 0; j < mapWidth; j++) {
                let block = instantiate(this.blockPrefab);
                block.setParent(this.node);
                block.setPosition(startX + j * blockWidth, startY - i * blockWidth);

                block.getComponent(UITransform).width = blockWidth;
                block.getComponent(UITransform).height = blockWidth;

                let blockSprite = block.getComponent(Sprite);
                blockSprite.color = (i + j) % 2 === 0 ? BlockController.getInstance().colourList[0] : 
                                                        BlockController.getInstance().colourList[1];
            }
        }
    }
}


