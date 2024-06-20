import { _decorator, Component, Node } from 'cc';
import { Singleton } from '../Other/Singleton';
import { LevelData } from '../Level/LevelData';
const { ccclass, property } = _decorator;

@ccclass('LevelManager')
export class LevelManager extends Singleton<LevelManager> {

    @property
    blockWidth: number = 0;
    
    @property(Node)
    mapParent: Node = null;

    levelDataList: LevelData[] = [];

    currentLevel: number = 1;

    getLevelData(currentLevel: number) {
        return this.levelDataList[currentLevel - 1];
    }
}


