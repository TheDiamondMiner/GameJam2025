export class CatacombsOne extends Phaser.Scene {
    constructor() {
        super('CatacombsOne');
    }
    preload() {
        this.load.image('brick','assets/Catacombs/brick.png');
        this.load.spritesheet('torch', 'assets/Catacombs/torch.png', {
            frameWidth: 64,
            frameHeight: 64
        });
    }
    create() {
        this.background = this.add.tileSprite(640, 360, 1280, 720, 'brick');
        this.anims.create({
            key: 'torch_anim',
            frames: this.anims.generateFrameNumbers('torch', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        const torch = this.add.sprite(100, 100, 'torch').play('torch_anim');
        torch.setOrigin(0.5, 0.5);
    }
    update() {}
    initanimation() {

    }
}