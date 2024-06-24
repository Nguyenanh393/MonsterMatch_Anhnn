import { _decorator, Component, Node } from 'cc';
import UICanvas from '../UICanvas';
import { BlockController } from '../../Manager/BlockController';
import { GamePlay } from './GamePlay';
import { UIManager } from '../UIManager';
import { CharacterManager } from '../../Manager/CharacterManager';
import { LevelManager } from '../../Manager/LevelManager';
const { ccclass, property } = _decorator;

@ccclass('PauseUI')
export class PauseUI extends UICanvas {
    
    onResumeButtonClicked() {
        BlockController.getInstance().turnOnNodeBlockEvent();
        UIManager.getInstance().openUI(GamePlay);
        this.close(0);
    }

    onRestartButtonClicked() {
        BlockController.getInstance().reset();
        CharacterManager.getInstance().reset();
        LevelManager.getInstance().loadCurrentLevel();
        UIManager.getInstance().openUI(GamePlay);
        this.close(0);
    }
}


