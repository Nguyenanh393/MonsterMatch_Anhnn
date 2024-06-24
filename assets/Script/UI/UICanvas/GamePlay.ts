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

    onEnable(): void {
        super.onEnable();
        this.setLevelLabel(LevelManager.getInstance().currentLevel);
    }
    setLevelLabel(level: number) {
        this.levelLabel.string = `Level ${level}`;
    }

    onPauseButtonClicked() {
        UIManager.getInstance().openUI(PauseUI);
        BlockController.getInstance().turnOffNodeBlockEvent();
        this.close(0);
    }

    onHintButtonClicked() {
        UIManager.getInstance().openUI(HintUI);
        BlockController.getInstance().turnOffNodeBlockEvent();
        this.close(0);
    }
}


