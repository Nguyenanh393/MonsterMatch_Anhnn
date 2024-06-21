import { _decorator, JsonAsset, log, resources, Vec3 } from 'cc';
import { LevelManager } from '../Manager/LevelManager';
import { LevelData } from '../Level/LevelData';
import { BlockController } from '../Manager/BlockController';
import { CharacterManager } from '../Manager/CharacterManager';

const { ccclass, property } = _decorator;

@ccclass('ReadMap')
export class ReadMap {

    blockController: BlockController = null;
    blockWidth: number = 0;

    loadJson(blockController: BlockController) {

        this.blockController = blockController;

        // Đường dẫn tới tệp JSON trong thư mục "assets/resources"
        const jsonFilePath = 'Data/LevelData';

        resources.load(jsonFilePath, JsonAsset, (err, jsonAsset) => {
            if (err) {
                console.error('Failed to load JSON file:', err);
                return;
            }

            // Lấy dữ liệu từ JsonAsset
            const data = jsonAsset.json;
            // console.log('Loaded JSON data:', data);

            

            Object.keys(data).forEach(key => {
                // log(new LevelData(data[key].mapName, data[key].map, data[key].max_value));
                LevelManager.getInstance().levelDataList.
                                            push(new LevelData(
                                                data[key].mapName, 
                                                data[key].map, 
                                                data[key].max_value));
                
            });
            //log('LevelData:', LevelManager.getInstance().levelDataList.length);
            this.blockWidth = LevelManager.getInstance().blockWidth;
            log('blockWidth:', this.blockWidth);
            log('currentLevel:', localStorage.getItem("currentLevel") ? parseInt(localStorage.getItem("currentLevel")) : 1);
            this.loadLevel(localStorage.getItem("currentLevel") ? parseInt(localStorage.getItem("currentLevel")) : 1);
            
        });

        
    }

    loadLevel(level: number) {
        this.blockController.currentMap = LevelManager.getInstance().levelDataList[level - 1].getMap().map((arr) => arr.slice());
        this.blockController.fixedMap = LevelManager.getInstance().levelDataList[level - 1].getMap().map((arr) => arr.slice());
        this.processMatrix(this.blockController.currentMap, LevelManager.getInstance().levelDataList[level - 1].getMaxValue());
        log(this.blockWidth + "-----")
        LevelManager.getInstance().setPositionPartBg();
        LevelManager.getInstance().loadFloor(this.blockWidth);
        CharacterManager.getInstance().spawnCharacter(LevelManager.getInstance().levelDataList[level - 1].getMaxValue());
    }


    processMatrix(matrix: number[][], maxValue: number) {
        let mapWidth = matrix[0].length;
        let mapHeight = matrix.length;

        
        let startX = -mapWidth * this.blockWidth / 2 + this.blockWidth / 2;
        // TRY
        let startY = 0;
        // let startY = mapHeight * this.blockWidth / 2 - this.blockWidth / 2;
        //log('startX:', startX, 'startY:', startY);
        this.blockController.startX = startX;
        this.blockController.startY = startY;
        this.blockController.spawnListPathParentChildren(maxValue.valueOf());
        for (let i = 1; i <= maxValue; i++) {
            for (let j = 0; j < matrix.length; j++) {
                for (let k = 0; k < matrix[j].length; k++) {
                    if (matrix[j][k] === i) {
                        //log('j:', j, 'k:', k, 'i:', i);
                        //log(new Vec3(startX + k * this.blockWidth, startY - j * this.blockWidth, 0));
                        BlockController.getInstance().spawnBlock(new Vec3(startX + k * this.blockWidth, startY - j * this.blockWidth, 0), i);
                    }
                }
            }
        }     
    }
}