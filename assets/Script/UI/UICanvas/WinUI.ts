import { _decorator, Component, Node } from 'cc';
import UICanvas from '../UICanvas';
import { BlockController } from '../../Manager/BlockController';
import { LevelManager } from '../../Manager/LevelManager';
import { CharacterManager } from '../../Manager/CharacterManager';
import { UIManager } from '../UIManager';
import { GamePlay } from './GamePlay';
const { ccclass, property } = _decorator;

@ccclass('WinUI')
export class WinUI extends UICanvas {
    onResumeButtonClicked() {
        BlockController.getInstance().turnOnNodeBlockEvent();
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


