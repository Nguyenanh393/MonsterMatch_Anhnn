import { _decorator, Component, Node } from 'cc';
import UICanvas from '../UICanvas';
const { ccclass, property } = _decorator;

@ccclass('HintUI')
export class HintUI extends UICanvas {

    onResumeButtonClicked() {
        this.close(0);
    }
}


