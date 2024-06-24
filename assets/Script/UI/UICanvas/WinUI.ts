import { _decorator, Component, log, Node } from 'cc';
import UICanvas from '../UICanvas';
import { BlockController } from '../../Manager/BlockController';
import { LevelManager } from '../../Manager/LevelManager';
import { CharacterManager } from '../../Manager/CharacterManager';
import { UIManager } from '../UIManager';
import { GamePlay } from './GamePlay';
import { MainController } from '../../Manager/MainController';
const { ccclass, property } = _decorator;

@ccclass('WinUI')
export class WinUI extends UICanvas {
    onResumeButtonClicked() {
        BlockController.getInstance().turnOnNodeBlockEvent();
        this.close(0);
    }

    onRestartButtonClicked() {
        MainController.getInstance().restart();
        this.close(0);
    }

    onNextButtonClicked() {
        MainController.getInstance().nextLevel();
        this.close(0);
    }
}


