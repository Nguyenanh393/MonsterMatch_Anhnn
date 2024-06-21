import { _decorator, Label, Node, UITransform, Vec3 } from 'cc';
import UICanvas from '../UICanvas';
import { BlockController } from '../../Manager/BlockController';
import { LevelManager } from '../../Manager/LevelManager';
const { ccclass, property } = _decorator;

@ccclass('GamePlay')
export class GamePlay extends UICanvas {
    @property(Label)
    levelLabel: Label = null;

    setLevelLabel(level: number) {
        this.levelLabel.string = `Level ${level}`;
    }
}


