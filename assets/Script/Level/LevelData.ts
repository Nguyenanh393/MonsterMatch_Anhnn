import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LevelData')
export class LevelData {
    private mapName: string;
    private map: number[][];
    private maxValue: number;

    constructor(mapName: string, map: number[][], maxValue: number) {
        this.mapName = mapName;
        this.map = map;
        this.maxValue = maxValue;
    }

    getMapName() {
        return this.mapName;
    }

    getMap() {
        return this.map;
    }

    getMaxValue() {
        return this.maxValue;
    }
}


