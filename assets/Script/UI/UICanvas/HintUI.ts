import { _decorator, Component, Node, UI } from 'cc';
import UICanvas from '../UICanvas';
import { BlockController } from '../../Manager/BlockController';
import { GamePlay } from './GamePlay';
import { UIManager } from '../UIManager';
import { CharacterManager } from '../../Manager/CharacterManager';
import { LevelManager } from '../../Manager/LevelManager';
import { MainController } from '../../Manager/MainController';
const { ccclass, property } = _decorator;

@ccclass('HintUI')
export class HintUI extends UICanvas {

    onResumeButtonClicked() {
        BlockController.getInstance().turnOnNodeBlockEvent();
        UIManager.getInstance().openUI(GamePlay);
        this.close(0);
    }

    onRestartButtonClicked() {
        MainController.getInstance().restart();
        this.close(0);
    }
}


