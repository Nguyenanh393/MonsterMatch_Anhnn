import { _decorator, Component, easing, instantiate, log, Node, Prefab, Sprite, tween, UITransform, Vec3 } from 'cc';
import { LevelManager } from './LevelManager';
import { BlockController } from './BlockController';
import { Singleton } from '../Other/Singleton';
const { ccclass, property } = _decorator;

const MONSTER_START_POSITION_X = 100;
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
            this.originPos.push(new Vec3(MONSTER_START_POSITION_X + i * (this.monsterSize + MONSTER_DISTANCE)
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
        this.hero.setPosition(-200, LevelManager.getInstance().getMovementUI() + this.monsterSize * 1.6 /2 );

        // let heroSprite = hero.getComponent(Sprite);
        // heroSprite.color = BlockController.getInstance().colourList[1];

        let heroUITransform = this.hero.getComponent(UITransform);
        heroUITransform.width = this.monsterSize * 1.6;
        heroUITransform.height = this.monsterSize * 1.6;
        this.heroPos = new Vec3(-200, LevelManager.getInstance().getMovementUI() + this.monsterSize * 1.6 /2, 0);
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
                let monsterNewPos = new Vec3(this.originPos[blockColor - 1].x, this.originPos[blockColor - 1].y - 100, this.originPos[blockColor - 1].z);
                monster.position = monsterNewPos;
            }
        } else {
            if (isMoveUp) {
                log("Move up");
                let monsterNewPos = new Vec3(this.originPos[blockColor - 1].x, this.originPos[blockColor - 1].y, this.originPos[blockColor - 1].z);
                monster.position = monsterNewPos;
            }
        }
    }

    async makeHeroAttackMonster(blockColor: number) {
        let index = blockColor - 1;
        let monsterPos = this.list_monster[index].position.clone();
    
        let time = 0.5;
    
        log("Hero pos: " + this.heroPos);
        log("Monster pos: " + monsterPos);
        log("Tween");
    
        const moveByTween = () => {
            log("Move by tween");
            return new Promise<void>((resolve) => {
                tween(this.hero.position)
                    .to(time, monsterPos, {
                        onUpdate: (target: Vec3, ratio: number) => {
                            log("Hero pos: " + target);
                            this.hero.position = target;
                        },
                        easing: easing.cubicInOut
                    })
                    .to(time, new Vec3(-200, LevelManager.getInstance().getMovementUI() + this.monsterSize * 1.6 / 2, 0), {
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
    
        await moveByTween();
        log("Block color: " + blockColor);
    
        this.moveMonster(false, blockColor);

        if (BlockController.getInstance().checkWin()) {
            log("You Win");
        }
    }
    
}


