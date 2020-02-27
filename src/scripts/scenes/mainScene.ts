import ExampleObject from '../objects/exampleObject';

export default class MainScene extends Phaser.Scene {
  private exampleObject: ExampleObject;
  background: Phaser.GameObjects.TileSprite;
  ship1: Phaser.GameObjects.Sprite;
  ship2: Phaser.GameObjects.Sprite;
  ship3: Phaser.GameObjects.Sprite;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, "background");
    this.background.setOrigin(0.5, 0.5);
    this.background.x = this.scale.width / 2;
    this.background.y = this.scale.height / 2;

    this.ship1 = this.add.sprite(this.scale.width / 2 - 50, this.scale.height / 2, "ship");
    this.ship2 = this.add.sprite(this.scale.width / 2, this.scale.height / 2, "ship2");
    this.ship3 = this.add.sprite(this.scale.width / 2 + 50, this.scale.height / 2, "ship3");

    this.anims.create({
      key : "ship1_anim",
      frames : this.anims.generateFrameNumbers("ship", {start : 0, end : 1}),
      frameRate : 20,
      repeat : -1
    })
    this.anims.create({
      key : "ship2_anim",
      frames : this.anims.generateFrameNumbers("ship2", {start : 0, end : 1}),
      frameRate : 20,
      repeat : -1
    })
    this.anims.create({
      key : "ship3_anim",
      frames : this.anims.generateFrameNumbers("ship3", {start : 0, end : 1}),
      frameRate : 20,
      repeat : -1
    })
    this.anims.create({
      key : "explode",
      frames : this.anims.generateFrameNumbers("explosion", {start : 0, end : 4}),
      frameRate : 20,
      repeat : 0,
      hideOnComplete : true
    })

    this.ship1.play("ship1_anim");
    this.ship2.play("ship2_anim");
    this.ship3.play("ship3_anim");

    this.ship1.setInteractive();
    this.ship2.setInteractive();
    this.ship3.setInteractive();

    this.input.on("gamedownobject", this.destroyShip, this);

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
  }
}
