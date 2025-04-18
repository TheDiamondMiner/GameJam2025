export class CatacombsOne extends Phaser.Scene {
    constructor() {
        super('CatacombsOne');
        this.lightarr = [];
    }

    preload() {
        this.load.image('tileset', 'assets/Catacombs/tileset.png');
        this.load.tilemapTiledJSON('catacombsMap', 'assets/Catacombs/map.tmj');
        this.load.image('LightWarrior', 'assets/Global/placeholder.png');
        this.load.image('BoxTexture', 'assets/Global/box.png');
        this.load.image('energyBall', 'assets/Global/energyBall.png');
    }

    create() {
        this.lights.enable();
        this.lights.setAmbientColor(0x000000);

        const map = this.make.tilemap({ key: 'catacombsMap' });
        const tileset = map.addTilesetImage('tileset', 'tileset');

        const groundLayer = map.createLayer('bg', tileset, 0, 0).setPipeline('Light2D');
        this.wallLayer = map.createLayer('l2', tileset, 0, 0).setPipeline('Light2D');
        this.wallLayer.setCollisionByProperty({ collides: true });

        this.player = this.physics.add.sprite(100, 100, 'LightWarrior').setPipeline('Light2D');
        this.player.setCollideWorldBounds(true);
        this.player.body.setGravityY(100);
        this.physics.add.collider(this.player, this.wallLayer);

        this.playerLight = this.lights.addLight(this.player.x, this.player.y, 100, 0xffea00, 0.5);

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setZoom(2.75);

        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            e: Phaser.Input.Keyboard.KeyCodes.SHIFT,
            q: Phaser.Input.Keyboard.KeyCodes.Q
        });

        this.energyBalls = this.physics.add.group();

        this.physics.add.collider(this.energyBalls, this.wallLayer, (ball) => {
            const radius = 1; // 3x3 grid check
            let closestTile = null;
            let minDist = Number.MAX_VALUE;

            for (let dx = -radius; dx <= radius; dx++) {
                for (let dy = -radius; dy <= radius; dy++) {
                    const tx = this.wallLayer.worldToTileX(ball.x) + dx;
                    const ty = this.wallLayer.worldToTileY(ball.y) + dy;
                    const tile = this.wallLayer.getTileAt(tx, ty);

                    if (tile && tile.layer && tile.layer.name === 'l2') {
                        const canBreak = tile.properties?.canBreak === true;

                        if (canBreak) {
                            const tileWorldX = this.wallLayer.tileToWorldX(tx) + tile.width / 2;
                            const tileWorldY = this.wallLayer.tileToWorldY(ty) + tile.height / 2;
                            const dist = Phaser.Math.Distance.Between(ball.x, ball.y, tileWorldX, tileWorldY);

                            if (dist < minDist) {
                                minDist = dist;
                                closestTile = { x: tx, y: ty };
                            }
                        }
                    }
                }
            }

            if (closestTile) {
                console.log(`Removing breakable tile at (${closestTile.x}, ${closestTile.y})`);
                this.wallLayer.removeTileAt(closestTile.x, closestTile.y, true);
            } else {
                console.log(`Ball hit wallLayer but no breakable tile found`);
            }

            ball.destroy();
        });

        const objectsLayer = map.getObjectLayer('levelObjects');
        if (objectsLayer) {
            const defaultRadius = 200;
            objectsLayer.objects.forEach(obj => {
                const props = obj.properties || [];

                if (obj.type === 'LIGHT') {
                    const radius = props.find(p => p.name === 'radius')?.value || defaultRadius;
                    const colorHex = props.find(p => p.name === 'color')?.value || '#ffffff';
                    const color = Phaser.Display.Color.HexStringToColor(colorHex).color;

                    this.lights.addLight(obj.x, obj.y, radius, color, 0.8);
                    this.lightarr.push({ x: obj.x, y: obj.y,});
                }

                else if (obj.type === 'TEXT') {
                    const textData = obj.text || {};
                    const content = textData.text || 'Text';
                    const color = textData.color || '#ffffff';
                    const align = textData.halign || 'left';
                    const wrapWidth = obj.width || 200;

                    const textObject = this.add.text(obj.x, obj.y, content, {
                        fontSize: '12px',
                        color: color,
                        wordWrap: { width: wrapWidth },
                        align: align,
                        fontFamily: 'Arial'
                    })
                        .setOrigin(0)
                        .setDepth(10);

                    if (textData.valign === 'center') {
                        textObject.setOrigin(0, 0.5);
                    } else if (textData.valign === 'bottom') {
                        textObject.setOrigin(0, 1);
                    }
                }

                else if (obj.type === 'SPAWN') {
                    this.player.setPosition(obj.x, obj.y - this.player.height / 2);
                }

                else if (obj.type === 'MOBILE') {
                    const width = obj.width || 32;
                    const height = obj.height || 32;
                    const texture = props.find(p => p.name === 'texture')?.value || 'BoxTexture';

                    const box = this.physics.add.image(obj.x + width / 2, obj.y - height / 2, texture)
                        .setDisplaySize(width, height)
                        .setPipeline('Light2D')
                        .setBounce(0.2)
                        .setCollideWorldBounds(true)
                        .setImmovable(false)
                        .setDrag(100, 0)
                        .setFriction(100, 10);

                    this.physics.add.collider(box, this.wallLayer);
                    this.physics.add.collider(this.player, box);
                }
            });
        }
    }

    update() {
        var evalue = 0;
        const keys = this.cursors;

        this.player.body.setVelocityX(0);

        if (keys.e.isDown) {
            evalue = 500;
        }

        let speed = 150 + evalue;

        if (keys.left.isDown) {
            this.player.body.setVelocityX(-speed);
        } else if (keys.right.isDown) {
            this.player.body.setVelocityX(speed);
        }

        if (Phaser.Input.Keyboard.JustDown(keys.space) && this.player.body.blocked.down) {
            this.player.setVelocityY(-(450 + evalue));
        }

        // Fix clipping through walls
        if (this.player.body.velocity.x !== 0) {
            this.physics.world.collide(this.player, this.wallLayer);
        }

        this.playerLight.x = this.player.x;
        this.playerLight.y = this.player.y;

        if (Phaser.Input.Keyboard.JustDown(keys.q)) {
            this.shootEnergyBall();
        }
        if(this.getDistanceNearestLightSource() > 150) {
            console.log('DARK ZONE')
        }else{
            console.log('LIGHT ZONE')
        }
    }

    shootEnergyBall() {
        const ball = this.energyBalls.create(this.player.x, this.player.y, 'energyBall')
            .setPipeline('Light2D')
            .setCollideWorldBounds(true)
            .setBounce(0.5)
            .setCircle(8)
            .setDepth(5);
        const direction = this.cursors.right.isDown ? 1 : this.cursors.left.isDown ? -1 : this.player.flipX ? -1 : 1;
        ball.body.velocity.x = 400 * direction;
        ball.body.velocity.y = -100;
    }
    getDistanceNearestLightSource(){
        let distancearr = [];
        this.lightarr.forEach((light) => {
            distancearr.push(Math.round(Phaser.Math.Distance.Between(this.player.x, this.player.y, light.x, light.y)));
        });
        return Math.min(...distancearr);
    }
}
