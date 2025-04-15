export class CatacombsOne extends Phaser.Scene {
    constructor() {
        super('CatacombsOne');
    }

    preload() {
        this.load.image('brick', 'assets/Catacombs/brick.png');
        this.load.spritesheet('torch', 'assets/Catacombs/torch.png', {
            frameWidth: 64,
            frameHeight: 64
        });
    }

    create() {
        this.lights.enable();
        this.lights.setAmbientColor(0x222222);

        this.background = this.add.tileSprite(640, 360, 1280, 720, 'brick');
        this.background.setPipeline('Light2D');

        this.anims.create({
            key: 'torch_anim',
            frames: this.anims.generateFrameNumbers('torch', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        const torch = this.add.sprite(100, 100, 'torch').play('torch_anim');
        torch.setOrigin(0.5, 0.5);
        torch.setPipeline('Light2D');

        const torchLight = this.lights.addLight(100, 100, 150, 0xffaa00, 1.0);

        this.time.addEvent({
            delay: 100,
            loop: true,
            callback: () => {
                const flicker = Phaser.Math.FloatBetween(0.8, 1.0);
                torchLight.intensity = flicker;
            }
        });
    }

    update() {
    }

    initanimation() {
    }
}
