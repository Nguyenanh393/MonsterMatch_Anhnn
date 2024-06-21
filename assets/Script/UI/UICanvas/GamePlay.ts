import { _decorator, Label, Node, UI, UITransform, Vec3 } from 'cc';
import UICanvas from '../UICanvas';
import { BlockController } from '../../Manager/BlockController';
import { LevelManager } from '../../Manager/LevelManager';
import { UIManager } from '../UIManager';
import { PauseUI } from './PauseUI';
import { HintUI } from './HintUI';
const { ccclass, property } = _decorator;

@ccclass('GamePlay')
export class GamePlay extends UICanvas {
    @property(Label)
    levelLabel: Label = null;

    setLevelLabel(level: number) {
        this.levelLabel.string = `Level ${level}`;
    }

    onPauseButtonClicked() {
        UIManager.getInstance().openUI(PauseUI);
    }

    onHintButtonClicked() {
        UIManager.getInstance().openUI(HintUI);
    }
}


