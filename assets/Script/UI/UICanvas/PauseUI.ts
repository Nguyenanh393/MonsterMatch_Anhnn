import { _decorator, Component, Node } from 'cc';
import UICanvas from '../UICanvas';
const { ccclass, property } = _decorator;

@ccclass('PauseUI')
export class PauseUI extends UICanvas {
    
    onResumeButtonClicked() {
        this.close(0);
        
    }
}


