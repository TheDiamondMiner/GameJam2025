export class MainMenu extends Phaser.Scene {

    constructor() {
        super('MainMenu');
    }

    preload() {
        this.load.image('background', 'assets/mainmenu/bg.png');
        this.load.image('logo', 'assets/mainmenu/logo.png');
        this.load.audio('menuMusic', 'assets/mainmenu/bg.mp3');
    }

    create() {
        const clickText = this.add.text(640, 500, 'Click Anywhere to Start', {
            fontSize: '28px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: clickText,
            alpha: { from: 1, to: 0 },
            duration: 700,
            yoyo: true,
            repeat: -1
        });

        this.input.once('pointerdown', () => {
            this.cameras.main.fadeOut(1000, 255, 255, 255);

            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.cameras.main.fadeIn(1000, 255, 255, 255);

                this.background = this.add.tileSprite(640, 360, 1280, 920, 'background');
                const logo = this.add.image(675, 200, 'logo');
                
                this.music = this.sound.add('menuMusic', {
                    loop: true,
                    volume: 0.2
                });
                this.music.play();

                clickText.destroy();

                const buttonStyle = {
                    fontSize: '30px',
                    fill: '#ffffff',
                    backgroundColor: '#00000088',
                    padding: { x: 20, y: 10 }
                };

                const centerX = 640;
                const startY = 450;
                const spacing = 70;

                const startButton = this.add.text(centerX, startY, 'START', buttonStyle).setOrigin(0.5).setInteractive();
                const settingsButton = this.add.text(centerX, startY + spacing * 2, 'SETTINGS', buttonStyle).setOrigin(0.5).setInteractive();

                [startButton, settingsButton].forEach(btn => {
                    btn.on('pointerover', () => btn.setStyle({ fill: '#ffff00' }));
                    btn.on('pointerout', () => btn.setStyle({ fill: '#ffffff' }));
                });

                startButton.on('pointerdown', () => {
                    this.transitionToScene('CatacombsOne');
                });
                settingsButton.on('pointerdown', () => {
                    this.transitionToScene('Settings');
                });
            });
        });
    }

    transitionToScene(sceneKey) {
        this.music.stop();
        this.cameras.main.fadeOut(2000, 255, 255, 255);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(sceneKey);
        });
    }

    update() {
    }
}
