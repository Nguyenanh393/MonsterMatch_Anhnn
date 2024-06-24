import { _decorator, Component, log, Node } from 'cc';
import { Singleton } from '../Other/Singleton';
import { UIManager } from '../UI/UIManager';
import { GamePlay } from '../UI/UICanvas/GamePlay';
import { BlockController } from './BlockController';
import { LevelManager } from './LevelManager';
import { CharacterManager } from './CharacterManager';
const { ccclass, property } = _decorator;

@ccclass('MainController')
export class MainController extends Singleton<MainController> {
    @property(UIManager)
    uiManager: UIManager = null;

    @property(BlockController)
    blockController: BlockController = null;

    @property(LevelManager)
    levelManager: LevelManager = null;

    start() {
        //this.uiManager.openUI(GamePlay);
        this.levelManager.mapParent.active = true;
        this.setLevelLabel();        
        log("Current Level: ", this.levelManager.currentLevel);
    }

    reset() {
        BlockController.getInstance().reset();
        CharacterManager.getInstance().reset();
        
    }
    restart() {
        this.reset();
        LevelManager.getInstance().loadCurrentLevel();
        this.setLevelLabel();
    }

    nextLevel() {
        this.reset();
        LevelManager.getInstance().nextLevel();
        this.setLevelLabel();
    }

    async setLevelLabel(): Promise<void> {
        let gamePlay = await this.uiManager.openUI(GamePlay);
        log('GamePlay:', gamePlay);
        //gamePlay.setPositionPartBg();
        gamePlay.setLevelLabel(this.levelManager.currentLevel);
    }
}


