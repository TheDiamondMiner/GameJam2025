export class CatacombsOne extends Phaser.Scene {
    constructor() {
        super('CatacombsOne');
    }

    preload() {
        this.load.image('tileset', 'assets/Catacombs/tileset.png');
        this.load.tilemapTiledJSON('catacombsMap', 'assets/Catacombs/map.tmj');
        this.load.image('LightWarrior', 'assets/Global/placeholder.png');
    }

    create() {
        this.lights.enable();
        this.lights.setAmbientColor(0x555555);

        const map = this.make.tilemap({ key: 'catacombsMap' });
        const tileset = map.addTilesetImage('tileset', 'tileset');

        const groundLayer = map.createLayer('bg', tileset, 0, 0);
        const wallLayer = map.createLayer('l2', tileset, 0, 0);

        groundLayer.setPipeline('Light2D');
        wallLayer.setPipeline('Light2D');
        wallLayer.setCollisionByProperty({ collides: true });

        this.player = this.physics.add.sprite(100, 100, 'LightWarrior').setPipeline('Light2D');
        this.player.setCollideWorldBounds(true);
        this.player.body.setGravityY(600); // Enable gravity
        this.physics.add.collider(this.player, wallLayer);

        this.playerLight = this.lights.addLight(this.player.x, this.player.y, 200, 0xffffff, 1.0);

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setZoom(3.0);

        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE
        });

        const lightLayer = map.getObjectLayer('lights');
        if (lightLayer) {
            const defaultRadius = 300;
            const defaultIntensity = 1.0;
            const defaultColor = 0xffffff;

            lightLayer.objects.forEach(obj => {
                const props = obj.properties || [];
                const radius = props.find(p => p.name === 'radius')?.value || defaultRadius;
                const intensity = props.find(p => p.name === 'intensity')?.value || defaultIntensity;
                const colorHex = props.find(p => p.name === 'color')?.value || '#ffffff';
                const color = Phaser.Display.Color.HexStringToColor(colorHex).color;

                this.lights.addLight(obj.x, obj.y, radius, color, intensity);
            });
        }
    }

    update() {
        const speed = 150;
        const keys = this.cursors;

        // Horizontal movement
        this.player.body.setVelocityX(0);
        if (keys.left.isDown) this.player.body.setVelocityX(-speed);
        else if (keys.right.isDown) this.player.body.setVelocityX(speed);

        // Jump
        if (Phaser.Input.Keyboard.JustDown(keys.space) && this.player.body.blocked.down) {
            this.player.setVelocityY(-350); // Adjust jump force as needed
        }

        // Follow player with light
        this.playerLight.x = this.player.x;
        this.playerLight.y = this.player.y;
    }

    initanimation() {}
}
