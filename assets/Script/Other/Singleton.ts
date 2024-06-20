// Singleton for ts AnhNN

import { _decorator, Component, log, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Singleton')
export class Singleton<T extends Component> extends Component {
    private static instances = new Map<new () => Component, Component>();

    public static getInstance<T extends Component>(this: new () => T): T {
        if (!Singleton.instances.has(this)) {
            Singleton.instances.set(this, new this());
        }
        return Singleton.instances.get(this) as T;
    }

    onLoad() {
        const registeredInstance = Singleton.instances.get(this.constructor as new () => Component);
        if (registeredInstance && registeredInstance !== this) {
            this.node.destroy();
        } else {
            Singleton.instances.set(this.constructor as new () => Component, this);
        }

        // log('Singleton:', this.constructor.name);
    }
    
}
