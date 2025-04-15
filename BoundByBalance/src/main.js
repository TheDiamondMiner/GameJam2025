import { MainMenu } from './scenes/MainMenu.js';
import { CatacombsOne } from './scenes/Catacombs_1.js';

const config = {
    type: Phaser.WEBGL,
    title: 'Bound By Balance',
    description: '',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    pixelArt: false,
    physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 500 },
                debug: false,} 
            },
    scene: [
        MainMenu,
        CatacombsOne,
    ],
    scale: {
        mode: Phaser.Scale.FILL,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
            