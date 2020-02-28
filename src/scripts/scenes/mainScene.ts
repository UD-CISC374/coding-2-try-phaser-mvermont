import { gameSettings} from '../game';
import Beam from "../objects/beam";
import Explosion from '../objects/explosion';

export default class MainScene extends Phaser.Scene {
  background: Phaser.GameObjects.TileSprite;
  //ship1: Phaser.GameObjects.Sprite;
  //ship2: Phaser.GameObjects.Sprite;
  //ship3: Phaser.GameObjects.Sprite;
  player: Phaser.Physics.Arcade.Sprite;
  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  spacebar: Phaser.Input.Keyboard.Key;
  projectiles: Phaser.GameObjects.Group;
  //powerUps: Phaser.Physics.Arcade.Group;  //No power-ups in galaga
  enemies: Phaser.Physics.Arcade.Group;
  scoreLabel: Phaser.GameObjects.BitmapText;
  score: number;
  enemyMovement: any;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {

    //Set up background
    this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, "background");
    this.background.setOrigin(0, 0);
    this.score = 0;
    this.scoreLabel = this.add.bitmapText(10, 5, "pixelFont", "SCORE: ", 15);
    this.add.text(this.scale.width / 2 - 35, 5, "GALAGA", {
      fill : "yellow",
    });

    /*******************************************************************************/

    //Set up player
    this.player = this.physics.add.sprite(this.scale.width / 2, this.scale.height - 32, "player");
    this.player.play("thrust");
    this.cursorKeys = this.input.keyboard.createCursorKeys();   

    /*******************************************************************************/

    //Set up enemies
    this.enemies = this.physics.add.group();
    let xCounter = 60;
    for(let i = 0; i < 5; i++){
      let ship = this.physics.add.sprite(xCounter, 60, "ship3");
      this.enemies.add(ship);
      xCounter += 70;
      ship.play("ship3_anim");
      ship.setInteractive();
      ship.setScale(2);
    }
    xCounter = 40;
    for(let i = 0; i < 9; i++){
      let ship = this.physics.add.sprite(xCounter, 120, "ship2");
      this.enemies.add(ship);
      xCounter += 40;
      ship.play("ship2_anim");
      ship.setInteractive();
    }
    xCounter = 30;
    for(let i = 0; i < 18; i++){
      let shipA = this.physics.add.sprite(xCounter, 150, "ship1");
      let shipB = this.physics.add.sprite(xCounter, 180, "ship1");
      this.enemies.add(shipA);
      this.enemies.add(shipB);
      xCounter += 20;
      shipA.play("ship1_anim");
      shipB.play("ship1_anim");
      shipA.setInteractive();
      shipB.setInteractive();
    }
    this.enemyMovement = 0.20;
    
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
    this.physics.add.overlap(this.player, this.enemies, this.killPlayer, this.giveNull, this);
    this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, this.giveNull, this);
  }

  update() {
    this.player.setVelocity(0);

    for(let i = 0; i < this.enemies.getChildren().length; i++){
      this.moveShip(this.enemies.getChildren()[i], this.enemyMovement);
      let ship = this.getShip(this.enemies.getChildren()[i]);
      if(ship.y >= this.player.y){
        this.endGame(false);
      }
    }

    this.movePlayerManager();

    for(var i = 0; i < this.projectiles.getChildren().length; i++){
      let beam = this.projectiles.getChildren()[i];
      beam.update(this);
    }

    if(this.score == 750){
      this.endGame(true);
    }
  }

  /*pickPowerUp(player, powerUp){
    powerUp.disableBody(true, true);
  }*/

  hitEnemy(projectile, enemy){
    let explosion = new Explosion(this, enemy.x, enemy.y);
    projectile.destroy();
    enemy.destroy();
    this.score += 15;
    this.scoreLabel.text = "SCORE: " + this.score;
  }

  killPlayer(){
    this.endGame(false);
  }

  moveShip(ship, speed){
    ship.y += speed;
  }

  /*resetShipPos(ship){
    ship.y = 0;
    var randomX = Phaser.Math.Between(0, this.scale.width);
    ship.x = randomX;
  }*/

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

  getShip(ship){
    return ship;
  }

  movePlayerManager(){
    if(this.cursorKeys.left?.isDown ){
      if(this.player.x >= 10){
        this.player.setVelocityX(-gameSettings.playerSpeed);
      }
    }
    else if(this.cursorKeys.right?.isDown){
      if(this.player.x <= this.scale.width-10){
        this.player.setVelocityX(gameSettings.playerSpeed);
      }
    }
    /*if(this.cursorKeys.up?.isDown){
      this.player.setVelocityY(-gameSettings.playerSpeed);
    }
    else if(this.cursorKeys.down?.isDown){
      this.player.setVelocityY(gameSettings.playerSpeed);
    }*/
    if(Phaser.Input.Keyboard.JustDown(this.spacebar)){
      if(this.player.active){
        this.shootBeam();
      }
    }
  }
  endGame(didWin){
    if(didWin){
      this.add.text(this.scale.width / 2 - 65, this.scale.height / 2 - 30, "YOU WIN", {
        fill : "green",
        fontSize : 30
      });
    }
    else{
      let explosion = new Explosion(this, this.player.x, this.player.y);
      this.player.disableBody(true, true);
      this.enemyMovement = 0;
      this.add.text(this.scale.width / 2 - 65, this.scale.height / 2 - 30, "YOU LOSE", {
        fill : "red",
        fontSize : 30
      });
    }
  }
}
