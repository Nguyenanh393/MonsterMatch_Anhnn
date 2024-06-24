import { _decorator, Component, easing, game, instantiate, log, Node, Prefab, Sprite, tween, UI, UITransform, Vec3 } from 'cc';
import { LevelManager } from './LevelManager';
import { BlockController } from './BlockController';
import { Singleton } from '../Other/Singleton';
import { UIManager } from '../UI/UIManager';
import { WinUI } from '../UI/UICanvas/WinUI';
import { GamePlay } from '../UI/UICanvas/GamePlay';
const { ccclass, property } = _decorator;

const MONSTER_START_POSITION_X = 0;
const MONSTER_DISTANCE = 20
@ccclass('CharacterManager')
export class CharacterManager extends Singleton<CharacterManager> {
    
    @property(Prefab) 
    monsterPrefab: Prefab = null;

    @property(Prefab)
    heroPrefab: Prefab = null;

    @property(Node)
    monsterParent: Node = null;

    @property(Node)
    heroParent: Node = null;

    @property
    monsterSize: number = 0;

    originPos : Vec3[] = [];

    list_monster : Node[] = [];
    hero : Node = null;
    heroPos : Vec3 = new Vec3(0, 0, 0);
    spawnMonster(max_value : number) {
        for (let i = 0; i < max_value; i++) {
            let monster = instantiate(this.monsterPrefab);
            monster.setParent(this.monsterParent);
            this.originPos.push(new Vec3(MONSTER_START_POSITION_X + i * (this.monsterSize)
                            , LevelManager.getInstance().getMovementUI() + this.monsterSize/2, 0));
            monster.setPosition(this.originPos[i]);

            let monsterSprite = monster.getComponent(Sprite);
            monsterSprite.color = BlockController.getInstance().colourListHead[i];
            this.list_monster.push(monster);

            let monsterUITransform = monster.getComponent(UITransform);
            monsterUITransform.width = this.monsterSize;
            monsterUITransform.height = this.monsterSize;
        }
    }

    spawnHero() {
        this.hero = instantiate(this.heroPrefab);
        this.hero.setParent(this.heroParent);
        this.hero.setPosition(-400, LevelManager.getInstance().getMovementUI() + this.monsterSize * 1.6 /2 );

        // let heroSprite = hero.getComponent(Sprite);
        // heroSprite.color = BlockController.getInstance().colourList[1];

        let heroUITransform = this.hero.getComponent(UITransform);
        heroUITransform.width = this.monsterSize * 1.6;
        heroUITransform.height = this.monsterSize * 1.6;
        this.heroPos = new Vec3(-400, LevelManager.getInstance().getMovementUI() + this.monsterSize * 1.6 /2, 0);
        log("Hero pos: " + this.heroPos);
    }

    spawnCharacter(max_value : number) {
        this.spawnMonster(max_value);
        this.spawnHero();
    }

    moveMonster(isMoveUp : boolean, blockColor: number) {
        log("Move monster");
        let monster = this.list_monster[blockColor - 1];
        let monsterPos = monster.position.clone();
        log("Monster pos: " + monsterPos);

        if (Vec3.distance(monsterPos, this.originPos[blockColor - 1]) < 0.1) {
            if (!isMoveUp) {
                log("Move down");
                let monsterNewPos = new Vec3(this.originPos[blockColor - 1].x + 1000, this.originPos[blockColor - 1].y + 1000, this.originPos[blockColor - 1].z);
                // monster.position = monsterNewPos;
                tween(monster.position).to(0.3, monsterNewPos, {
                    onUpdate: (target: Vec3, ratio: number) => {
                        monster.position = target;
                    },
                    easing: easing.cubicInOut
                }).start();
            }
        } else {
            if (isMoveUp) {
                log("Move up");
                let monsterNewPos = new Vec3(this.originPos[blockColor - 1].x, this.originPos[blockColor - 1].y, this.originPos[blockColor - 1].z);
                // monster.position = monsterNewPos;
                tween(monster.position).to(0.3, monsterNewPos, {
                    onUpdate: (target: Vec3, ratio: number) => {
                        monster.position = target;
                    },
                    easing: easing.cubicInOut
                }).start();
            }
        }

        // moveByTween();
    }

    async makeHeroAttackMonster(blockColor: number) {
        let index = blockColor - 1;
        let monsterPos = this.list_monster[index].position.clone();
        monsterPos.x -= this.monsterSize / 2;
        monsterPos.y += this.monsterSize / 2 + this.monsterSize * 1.6 / 2;
        let time = 0.4;
    
        log("Hero pos: " + this.heroPos);
        log("Monster pos: " + monsterPos);
        log("Tween");
    
        const moveByTween = () => {
            log("Move by tween");
        
            const bezier = (t: number, startPos: Vec3, controlPos: Vec3, endPos: Vec3) => {
                const u = 1 - t;
                const tt = t * t;
                const uu = u * u;
        
                const p = new Vec3();
                p.x = uu * startPos.x + 2 * u * t * controlPos.x + tt * endPos.x;
                p.y = uu * startPos.y + 2 * u * t * controlPos.y + tt * endPos.y;
                p.z = uu * startPos.z + 2 * u * t * controlPos.z + tt * endPos.z;
        
                return p;
            };
        
            return new Promise<void>((resolve) => {
                const startPos = this.hero.position.clone();
                const endPos = monsterPos;
        
                // Điểm kiểm soát cho đường cong (có thể điều chỉnh độ cao của đường cong)
                const controlPos = new Vec3((startPos.x + endPos.x) / 2, startPos.y + 200, 0);
        
                const time = 0.3; // Thời gian di chuyển
                let elapsedTime = 0;
        
                tween(this.hero.position)
                    .to(time, {}, {
                        onUpdate: (target: Vec3, ratio: number) => {
                            elapsedTime += game.deltaTime;
                            const t = elapsedTime / time;
                            const bezierPos = bezier(t, startPos, controlPos, endPos);
                            this.hero.position = bezierPos;
                            log("Hero pos: " + bezierPos);
                        },
                        easing: easing.cubicInOut,
                        onComplete: () => {
                            resolve();
                        }
                    })
                    .start();
            });
        };
         
        
        const returnByTween = () => {
            log("Move by tween");
            return new Promise<void>((resolve) => {
                tween(this.hero.position)
                .to(time, new Vec3(-400, LevelManager.getInstance().getMovementUI() + this.monsterSize * 1.6 / 2, 0), {
                    onUpdate: (target: Vec3, ratio: number) => {
                        this.hero.position = target;
                    },
                    easing: easing.cubicInOut,
                    onComplete: () => {
                        resolve();
                    }
                })
                .start();
            });
        }; 
        
        const moveMonster = async () => { 
            log("Move monster");
            await moveByTween();
            log("Block color: " + blockColor);
        
            this.moveMonster(true, blockColor);
            returnByTween();
            log("BlockController.getInstance().isWin: " + BlockController.getInstance().isWin);
            if (BlockController.getInstance().isWin) {
                log("Call win ui");
                UIManager.getInstance().closeUI(GamePlay);
                UIManager.getInstance().openUI(WinUI);
                BlockController.getInstance().turnOffNodeBlockEvent();
                BlockController.getInstance().isWin = false;
            }
        }
        
    
        //await moveByTween();
        await moveMonster();
        log("Block color: " + blockColor);
    
        this.moveMonster(false, blockColor);

        log("BlockController.getInstance().isWin: " + BlockController.getInstance().isWin);
        if (BlockController.getInstance().isWin) {
            log("Call win ui");
            UIManager.getInstance().openUI(WinUI);
            BlockController.getInstance().turnOffNodeBlockEvent();
            BlockController.getInstance().isWin = false;
        }
    }

    reset() {
        this.list_monster.forEach(monster => {
            monster.destroy();
        });
        this.list_monster = [];
        this.originPos = [];
        this.hero.destroy();
    }
    
}


