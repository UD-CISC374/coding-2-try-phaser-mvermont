export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    this.load.image("background", "assets/background.png");
    
    this.load.spritesheet("ship1", "assets/ship.png", {
      frameWidth : 16,
      frameHeight : 16
    });
    this.load.spritesheet("ship2", "assets/ship2.png", {
      frameWidth : 32,
      frameHeight : 16
    });
    this.load.spritesheet("ship3", "assets/ship3.png", {
      frameWidth : 32,
      frameHeight : 32
    });
    this.load.spritesheet("explosion", "assets/explosion.png", {
      frameWidth : 16,
      frameHeight : 16
    })
  }

  create() {
    this.scene.start('MainScene');
  }
}
