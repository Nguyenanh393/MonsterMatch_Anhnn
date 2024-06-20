import { Component, Node, Vec2, director, view } from "cc";

export default class UICanvas extends Component {
    // public IsAvoidBackKey: boolean = false;
    public IsDestroyOnClose: boolean = false;

    m_OffsetY: number = 0;

    protected start(): void {
        this.onInit();
    }

    // Init default Canvas
    // Khoi tao gia tri canvas
    protected onInit(): void {
        // Xu ly tai tho
        const visibleSize = view.getVisibleSize();
        const ratio: number = visibleSize.height / visibleSize.width;
        if (ratio > 2.1) {
            const currentPosition = this.node.getPosition();
            this.node.setPosition(currentPosition.x, currentPosition.y - 100);
            this.m_OffsetY = 100;
        }
    }

    // Setup canvas to avoid flash UI
    // Set up mac dinh cho UI de tranh truong hop bi nhay' hinh
    public setup(): void {
        // Implement setup logic here
    }

    // Back key in android device
    // Back key danh cho android
    public backKey(): void {
        // Implement back key logic here
    }

    // Open canvas
    // Mo canvas
    public open(): void {
        this.node.active = true;
    }

    // Close canvas directly
    // Dong truc tiep, ngay lap tuc
    public closeDirectly(): void {
        this.node.active = false;
        if (this.IsDestroyOnClose) {
            this.destroy();
        }
    }

    // Close canvas with delay time, used to anim UI action
    // Dong canvas sau mot khoang thoi gian delay
    // Close canvas with delay time, used to anim UI action
    // Dong canvas sau mot khoang thoi gian delay
    public close(delayTime: number): void {
        director.getScheduler().schedule(() => {
            this.closeDirectly();
        }, this.node, 0, 0, delayTime, false);
    }

}
