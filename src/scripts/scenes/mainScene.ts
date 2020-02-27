import ExampleObject from '../objects/exampleObject';
import { Cameras } from 'phaser';
import { gameSettings} from '../game';

export default class MainScene extends Phaser.Scene {
  private exampleObject: ExampleObject;
  background: Phaser.GameObjects.TileSprite;
  ship1: Phaser.GameObjects.Sprite;
  ship2: Phaser.GameObjects.Sprite;
  ship3: Phaser.GameObjects.Sprite;
  player: Phaser.Physics.Arcade.Sprite;
  myCam: any;
  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  spacebar: Phaser.Input.Keyboard.Key;
  projectiles: Phaser.GameObjects.Group;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, "background");
    this.background.setOrigin(0, 0);
    this.background.setScrollFactor(0);
    this.background.x = this.scale.width / 2;
    this.background.y = this.scale.height / 2;

    this.ship1 = this.add.sprite(this.scale.width / 2 - 50, this.scale.height / 2, "ship");
    this.ship2 = this.add.sprite(this.scale.width / 2, this.scale.height / 2, "ship2");
    this.ship3 = this.add.sprite(this.scale.width / 2 + 50, this.scale.height / 2, "ship3");

    this.player = this.physics.add.sprite(this.scale.width / 2 - 8, this.scale.height - 64, "player");
    this.player.play("thrust");
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.player.setCollideWorldBounds(true);

    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.projectiles = this.add.group();

    this.ship1.play("ship1_anim");
    this.ship2.play("ship2_anim");
    this.ship3.play("ship3_anim");

    this.ship1.setInteractive();
    this.ship2.setInteractive();
    this.ship3.setInteractive();

    this.input.on("gamedownobject", this.destroyShip, this);

    this.cameras.main.startFollow(this.player);
    this.background.tilePositionX = this.myCam.scrollX * 3;

    //this.exampleObject = new ExampleObject(this, 0, 0);
  }

  moveShip(ship, speed){
    ship.y += speed;
    if(ship.y > this.scale.height){
      this.resetShipPos(ship);
    }
  }

  resetShipPos(ship){
    ship.y = 0;
    var randomX = Phaser.Math.Between(0, this.scale.width);
    ship.x = randomX;
  }

  destroyShip(pointer, gameObject){
    gameObject.setTexture("explosion");
    gameObject.play("explode");
  }

  update() {
    this.moveShip(this.ship1, 1);
    this.moveShip(this.ship2, 2);
    this.moveShip(this.ship3, 3);

    this.movePlayerManager();

    if(Phaser.Input.Keyboard.JustDown(this.spacebar)){
      this.shootBeam();
    }

    for(var i = 0; i < this.projectiles.getChildren().length; i++){
      var beam = this.projectiles.getChildren()[i];
      beam.update();
    }
  }

  shootBeam(){
    var beam = new Beam(this);
  }

  movePlayerManager(){
    if(this.cursorKeys.left?.isDown){
      this.player.setVelocityX(-gameSettings.playerSpeed);
    }
    else if(this.cursorKeys.right?.isDown){
      this.player.setVelocityX(gameSettings.playerSpeed);
    }

    if(this.cursorKeys.up?.isDown){
      this.player.setVelocityY(-gameSettings.playerSpeed);
    }
    else if(this.cursorKeys.down?.isDown){
      this.player.setVelocityY(gameSettings.playerSpeed);
    }
  }
}
