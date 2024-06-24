import { _decorator, Component, Node } from 'cc';
import UICanvas from '../UICanvas';
import { BlockController } from '../../Manager/BlockController';
const { ccclass, property } = _decorator;

@ccclass('WinUI')
export class WinUI extends UICanvas {
    onResumeButtonClicked() {
        BlockController.getInstance().turnOnNodeBlockEvent();
        this.close(0);
    }
}


