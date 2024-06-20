import { _decorator, Component, Label, Node } from 'cc';
import UICanvas from '../UICanvas';
const { ccclass, property } = _decorator;

@ccclass('GamePlay')
export class GamePlay extends UICanvas {
    @property(Label)
    levelLabel: Label = null;

    
}


