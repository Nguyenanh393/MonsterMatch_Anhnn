import { _decorator, Component, log, Node, UITransform, Vec3 } from 'cc';
import { Singleton } from '../Other/Singleton';
import { LevelData } from '../Level/LevelData';
import { Floor } from '../Map/Floor';
import { BlockController } from './BlockController';
import { ReadMap } from '../Map/ReadMap';
const { ccclass, property } = _decorator;
const MOVEMENT_UI : number = 300;
@ccclass('LevelManager')
export class LevelManager extends Singleton<LevelManager> {

    @property
    blockWidth: number = 0;
    
    @property(Node)
    mapParent: Node = null;

    floor: Floor = null;

    levelDataList: LevelData[] = [];

    currentLevel: number = 1;
    readMapObj : ReadMap = null;

    @property(Node)
    partBg : Node = null;

    onLoad() {
        //delete current level in local storage
        //localStorage.removeItem("currentLevel");
        super.onLoad();
        this.floor = this.mapParent.children[1].getComponent(Floor);
        this.currentLevel = localStorage.getItem("currentLevel") ? parseInt(localStorage.getItem("currentLevel")) : 1;
    }
    getLevelData(currentLevel: number) {
        return this.levelDataList[currentLevel - 1];
    }

    saveCurrentLevel() {
        localStorage.setItem("currentLevel", this.currentLevel.toString());
    }

    loadFloor(blockWidth: number) {
        this.floor.createFloor(blockWidth);
    }
    
    getMovementUI() {
        return MOVEMENT_UI;
    }
    setPositionPartBg() {
        log("Set position part bg");
        let partBgUITransform = this.partBg.getComponent(UITransform);

        let partBgHeight = partBgUITransform.height;

        let posY = BlockController.getInstance().startY - partBgHeight / 2 + this.getMovementUI();

        this.partBg.setPosition(new Vec3(0, posY, 0));
    }

    nextLevel() {
        this.currentLevel++;
        if (this.currentLevel > this.levelDataList.length) {
            this.currentLevel = 1;
        }
        this.saveCurrentLevel();
        this.readMapObj.loadLevel(this.currentLevel);

    }

    loadCurrentLevel() {
        let currentLevel = localStorage.getItem("currentLevel");
        if (currentLevel) {
            this.currentLevel = parseInt(currentLevel);
        }

        this.readMapObj.loadLevel(this.currentLevel);
    }

    loadLevelNumber(levelNumber: number) {
        this.currentLevel = levelNumber;
        this.readMapObj.loadLevel(this.currentLevel);
    }

}


