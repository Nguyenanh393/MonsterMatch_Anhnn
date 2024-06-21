import { _decorator, Component, Node } from 'cc';
import UICanvas from '../UICanvas';
const { ccclass, property } = _decorator;

@ccclass('WinUI')
export class WinUI extends UICanvas {
    onResumeButtonClicked() {
        this.close(0);
    }
}


