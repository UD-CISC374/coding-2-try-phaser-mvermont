import { gameSettings} from '../game';
import Beam from "../objects/beam";

export default class MainScene extends Phaser.Scene {
  background: Phaser.GameObjects.TileSprite;
  ship1: Phaser.GameObjects.Sprite;
  ship2: Phaser.GameObjects.Sprite;
  ship3: Phaser.GameObjects.Sprite;
  player: Phaser.Physics.Arcade.Sprite;
  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  spacebar: Phaser.Input.Keyboard.Key;
  projectiles: Phaser.GameObjects.Group;
  //powerUps: Phaser.Physics.Arcade.Group;  //No power-ups in galaga
  enemies: Phaser.Physics.Arcade.Group;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {

    //Set up background
    this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, "background");
    this.background.setOrigin(0, 0);

    /*******************************************************************************/

    //Set up player and camera
    this.player = this.physics.add.sprite(this.scale.width / 2, this.scale.height - 32, "player");
    this.player.play("thrust");
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.player.setCollideWorldBounds(true);    

    /*******************************************************************************/

    //Set up enemies
    this.ship1 = this.add.sprite(this.scale.width / 2 - 50, this.scale.height / 2, "ship1");
    this.ship2 = this.add.sprite(this.scale.width / 2, this.scale.height / 2, "ship2");
    this.ship3 = this.add.sprite(this.scale.width / 2 + 50, this.scale.height / 2, "ship3");
    
    this.enemies = this.physics.add.group();
    this.enemies.add(this.ship1);
    this.enemies.add(this.ship2);
    this.enemies.add(this.ship3);

    this.ship1.play("ship1_anim");
    this.ship2.play("ship2_anim");
    this.ship3.play("ship3_anim");

    this.ship1.setInteractive();
    this.ship2.setInteractive();
    this.ship3.setInteractive();

    this.input.on("gamedownobject", this.destroyShip, this);

    /*******************************************************************************/

    //set up power-ups --- No power-ups in galaga
    /*this.powerUps = this.physics.add.group();
    var maxObjects = 4;
    for(var i = 0; i <= maxObjects; i++){
      let powerUp = this.physics.add.sprite(16, 16, "power-up");
      this.powerUps.add(powerUp);
      powerUp.setRandomPosition(0, 0, this.scale.width, this.scale.height);

      if(Math.random() > 0.5){
        powerUp.play("red");
      }
      else{
        powerUp.play("gray");
      }

      powerUp.setVelocity(100, 100);
      powerUp.setCollideWorldBounds(true);
      powerUp.setBounce(1);
    }*/

    /*******************************************************************************/

    //Set up shooting 
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.projectiles = this.add.group();

    /*******************************************************************************/ 
    
    //Set up collisions
    /*this.physics.add.collider(this.projectiles, this.powerUps, function(projectile, powerUp){
      projectile.destroy();
    });
    this.physics.add.overlap(this.player, this.powerUps, this.pickPowerUp, this.giveNull, this);*/
    this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, this.giveNull, this);
    this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, this.giveNull, this);
  }

  update() {
    this.player.setVelocity(0);

    this.movePlayerManager();

    for(var i = 0; i < this.projectiles.getChildren().length; i++){
      let beam = this.projectiles.getChildren()[i];
      beam.update(this);
    }
  }

  /*pickPowerUp(player, powerUp){
    powerUp.disableBody(true, true);
  }*/

  hurtPlayer(player, enemy){
    this.resetShipPos(enemy);
    player.x = this.scale.width / 2 - 8;
    player.y = this.scale.height - 64;
  }

  hitEnemy(projectile, enemy){
    projectile.destroy();
    this.resetShipPos(enemy);
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

  giveNull(){
    return null;
  }

  shootBeam(){
    let beam = new Beam(this);
  }

  movePlayerManager(){
    if(this.cursorKeys.left?.isDown){
      this.player.setVelocityX(-gameSettings.playerSpeed);
    }
    else if(this.cursorKeys.right?.isDown){
      this.player.setVelocityX(gameSettings.playerSpeed);
    }

    /*if(this.cursorKeys.up?.isDown){
      this.player.setVelocityY(-gameSettings.playerSpeed);
    }
    else if(this.cursorKeys.down?.isDown){
      this.player.setVelocityY(gameSettings.playerSpeed);
    }*/
    if(Phaser.Input.Keyboard.JustDown(this.spacebar)){
      this.shootBeam();
    }
  }
}
