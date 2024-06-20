// Base source code from: Linh Soi
// Rewrite to typescript by: AnhNN


import { _decorator, Component, instantiate, log, Node, Prefab, resources } from 'cc';
import UICanvas from './UICanvas';
import { Singleton } from '../Other/Singleton';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Singleton<UIManager> {
    private uiCanvasPrefab: { [key: string]: Prefab } = {};
    private uiCanvas: { [key: string]: UICanvas } = {};

    @property({ type: Node })
    CanvasParentTF: Node;
    
    async openUI<T extends UICanvas>(type: { new (): T }): Promise<T> {
        const canvas = await this.getUI(type);
        canvas.setup();
        canvas.open();
        return canvas;
    }

    async closeUI<T extends UICanvas>(type: { new (): T }, delayTime?: number): Promise<void> {
        if (await this.isOpened(type)) {  // Sử dụng 'await' để kiểm tra trạng thái được mở
            const canvas = await this.getUI(type);  // Chờ đợi đối tượng UI được tải
            if (delayTime) {
                canvas.close(delayTime);  // Gọi phương thức 'close' với thời gian delay
            } else {
                canvas.closeDirectly();  // Gọi phương thức 'closeDirectly'
            }
        }
    }
    

    isOpened<T extends UICanvas>(type: { new (): T }): boolean {
        return this.isLoaded(type) && this.uiCanvas[type.name]!.node.activeInHierarchy;
    }

    isLoaded<T extends UICanvas>(type: { new (): T }): boolean {
        return this.uiCanvas[type.name] !== undefined && this.uiCanvas[type.name] !== null;
    }

    async getUI<T extends UICanvas>(type: { new (): T }) {
        const typeName = (type as any).name;
        if (!this.isLoaded(type)) {
            log(type);
            let prefab = await this.getUIPrefab(type);
            log('Prefab:', this.getUIPrefab(type));
            const canvas = instantiate(prefab);
            this.CanvasParentTF.addChild(canvas);
            this.uiCanvas[typeName] = canvas.getComponent(type);
        }
        return this.uiCanvas[typeName] as T;
    }

    closeAll(): void {
        for (const key in this.uiCanvas) {
            if (this.uiCanvas[key] !== null && this.uiCanvas[key].node.activeInHierarchy) {
                this.uiCanvas[key].closeDirectly();
            }
        }
    }

    private async getUIPrefab<T extends UICanvas>(type: { new (): T }): Promise<Prefab> {
        const typeName = (type as any).name;
        return new Promise((resolve, reject) => {
            if (this.uiCanvasPrefab[typeName]) {
                resolve(this.uiCanvasPrefab[typeName]);
            } else {
                resources.load(`UI/${typeName}`, Prefab, (err, prefab) => {
                    if (err) {
                        log('Failed to load UI prefab:', err);
                        reject(err);
                    } else {
                        this.uiCanvasPrefab[typeName] = prefab;
                        log('Loaded UI prefab:', prefab);
                        resolve(prefab);
                    }
                });
            }
        });
    }
    

}


