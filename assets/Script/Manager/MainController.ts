import { _decorator, Component, Node } from 'cc';
import { Singleton } from '../Other/Singleton';
import { UIManager } from '../UI/UIManager';
import { GamePlay } from '../UI/UICanvas/GamePlay';
import { BlockController } from './BlockController';
import { LevelManager } from './LevelManager';
const { ccclass, property } = _decorator;

@ccclass('MainController')
export class MainController extends Singleton<MainController> {
    @property(UIManager)
    uiManager: UIManager = null;

    @property(BlockController)
    blockController: BlockController = null;

    @property(LevelManager)
    levelManager: LevelManager = null;

    start(): void {
        this.uiManager.openUI(GamePlay);
        this.levelManager.mapParent.active = true;
    }
}


