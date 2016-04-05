const GAME_WIDTH = 1000;
const GAME_HEIGHT = 700;

const qs = '/' + window.location.search.slice(window.location.search.indexOf('?') + 4); // eslint-disable-line
const socket = io(qs); // eslint-disable-line

// Game Variables
let explosions;
let ship;
let tween1, tween2, tween3, tween4, tween5, tweenAll1, tweenAll2, tweenAll3, tweenAll4, tweenAll5; // eslint-disable-line
let lasers;
let enemyBullets;
let aliens1, aliens2, aliens3, aliens4, aliens5; // eslint-disable-line
let mouseTouchDown = false;
let stateText;

// Create a Phaser game instance
const game = new Phaser.Game( // eslint-disable-line
	GAME_WIDTH,
	GAME_HEIGHT,
	Phaser.AUTO, // eslint-disable-line
	'container',
	{ preload, create, update, init, render } // eslint-disable-line
);
socket.on('changeVariable', e => {
  localStorage.setItem(e[0], e[1]);
});

// Preload assets
function preload() {
  game.canvas.id = 'canvas';
  const dir = '/games/space/static/img/';
  game.load.image('ship', `${dir}playerShip1_red.png`);
  game.load.image('laser', `${dir}laserBlue02.png`);
  game.load.image('ufo', `${dir}ufo.png`, 32, 32);
  game.load.spritesheet('kaboom', `${dir}explode.png`, 128, 128);
}

// Init
function init() {
	// Listen to space & enter keys
  const keys = [Phaser.KeyCode.SPACEBAR, Phaser.KeyCode.ENTER]; // eslint-disable-line
	// Create Phaser.Key objects for listening to the state
  phaserKeys = game.input.keyboard.addKeys(keys); // eslint-disable-line
	// Capture these keys to stop the browser from receiving this event
  game.input.keyboard.addKeyCapture(keys);
}
// Assets are available in create
function create() {
  game.paused = false;
	// Create the group using the group factory
  lasers = game.add.group();
	// To move the sprites later on, we have to enable the body
  lasers.enableBody = true;
  // We're going to set the body type to the ARCADE physics
  // since we don't need any advanced physics
  lasers.physicsBodyType = Phaser.Physics.ARCADE; // eslint-disable-line
	/*

    This will create 20 sprites and add it to the stage.
    They're inactive and invisible, but they're there for later use.
		We only have 20 laser bullets available, and will 'clean'
    and reset they're off the screen.
    This way we save on precious resources by not constantly
    adding & removing new sprites to the stage

	*/
  lasers.createMultiple(40, 'laser');


  createAliens(); // eslint-disable-line
	/*
		Create a ship using the sprite factory
		game.add is an instance of Phaser.GameObjectFactory,
    and helps us to quickly create common game objects.
		The sprite is already added to the stage
	*/
  ship = game.add.sprite(500, 650, 'ship');
  game.physics.enable(ship, Phaser.Physics.ARCADE); // eslint-disable-line
	// Set the anchorpoint to the middle
  ship.anchor.setTo(0.5, 0.5);

  // stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' }); // eslint-disable-line
  // stateText.anchor.setTo(0.5, 0.5);
  // stateText.visible = false;

  // create explosion image
  explosions = game.add.group();
  explosions.createMultiple(30, 'kaboom');
  explosions.forEach((invader) => {
    invader.anchor.x = 0.5; // eslint-disable-line
    invader.anchor.y = 0.5; // eslint-disable-line
    invader.animations.add('kaboom');
  }, this);
	/*

		Behind the scenes, this will call the following function on all lasers:
			- events.onOutOfBounds.add(resetLaser)
		Every sprite has an 'events' property, where you can add callbacks to specific events.
		Instead of looping over every sprite in the group manually, this function will do it for us.

	*/
  lasers.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetLaser); // eslint-disable-line
	// Same as above, set the anchor of every sprite to 0.5, 1.0
  lasers.callAll('anchor.setTo', 'anchor', 0.5, 1.0);

	// This will set 'checkWorldBounds' to true on all sprites in the group
  lasers.setAll('checkWorldBounds', true);
  cursors = game.input.keyboard.createCursorKeys(); // eslint-disable-line
}

function resetLaser(laser) {
  laser.kill();
}
function createAliens() {
  aliens1 = game.add.group();
  aliens1.enableBody = true;
  aliens1.physicsBodyType = Phaser.Physics.ARCADE; // eslint-disable-line
  for (let i = 0; i < 8; i++) {
    const alien = aliens1.create(i * 48, 50, 'ufo');
    alien.anchor.setTo(0.5, 0.5);
    alien.body.moves = false;
    alien.width = 40;
    alien.height = 40;
  }
  aliens1.x = 450;
  aliens1.y = 100;
  tween1 = game.add.tween(aliens1).to( { x: 200 }, 2000*localStorage.getItem('alienSpeed'), Phaser.Easing.Linear.None, true, 1, 1000, true); // eslint-disable-line
  // tween1.onLoop.add(() => { aliens1.x += 10; }, this);
  aliens2 = game.add.group();
  aliens2.enableBody = true;
  aliens2.physicsBodyType = Phaser.Physics.ARCADE; // eslint-disable-line
  for (let i = 0; i < 8; i++) {
    const alien = aliens2.create(i * 48, 100, 'ufo');
    alien.anchor.setTo(0.5, 0.5);
    alien.body.moves = false;
    alien.width = 40;
    alien.height = 40;
  }
  aliens2.x = 450;
  aliens2.y = 100;
  tween2 = game.add.tween(aliens2).to( { x: 200 }, 1500*localStorage.getItem('alienSpeed'), Phaser.Easing.Linear.None, true, 0, 2000, true); // eslint-disable-line
  // tween2.onLoop.add(() => { aliens2.x += 10; }, this);
  aliens3 = game.add.group();
  aliens3.enableBody = true;
  aliens3.physicsBodyType = Phaser.Physics.ARCADE; // eslint-disable-line
  for (let i = 0; i < 8; i++) {
    const alien = aliens3.create(i * 48, 150, 'ufo');
    alien.anchor.setTo(0.5, 0.5);
    alien.body.moves = false;
    alien.width = 40;
    alien.height = 40;
  }
  aliens3.x = 450;
  aliens3.y = 100;
  tween3 = game.add.tween(aliens3).to( { x: 200 }, 1800*localStorage.getItem('alienSpeed'), Phaser.Easing.Linear.None, true, 150, 2000, true); // eslint-disable-line
  // tween3.onLoop.add(() => { aliens3.x += 10; }, this);
  aliens4 = game.add.group();
  aliens4.enableBody = true;
  aliens4.physicsBodyType = Phaser.Physics.ARCADE; // eslint-disable-line
  for (let i = 0; i < 8; i++) {
    const alien = aliens4.create(i * 48, 200, 'ufo');
    alien.anchor.setTo(0.5, 0.5);
    alien.body.moves = false;
    alien.width = 40;
    alien.height = 40;
  }
  aliens4.x = 450;
  aliens4.y = 100;
  tween4 = game.add.tween(aliens4).to( { x: 200 }, 1300*localStorage.getItem('alienSpeed'), Phaser.Easing.Linear.None, true, 100, 2000, true); // eslint-disable-line
  // tween4.onLoop.add(() => { aliens4.x += 10; }, this);
  aliens5 = game.add.group();
  aliens5.enableBody = true;
  aliens5.physicsBodyType = Phaser.Physics.ARCADE; // eslint-disable-line
  for (let i = 0; i < 8; i++) {
    const alien = aliens5.create(i * 48, 250, 'ufo');
    alien.anchor.setTo(0.5, 0.5);
    alien.body.moves = false;
    alien.width = 40;
    alien.height = 40;
  }
  aliens5.x = 450;
  aliens5.y = 100;
  tween5 = game.add.tween(aliens5).to( { x: 200 }, 1000*localStorage.getItem('alienSpeed'), Phaser.Easing.Linear.None, true, 50, 2000, true); // eslint-disable-line
  // tween5.onLoop.add(() => {aliens5.x += 10;}, this);
  tweenAll1 = game.add.tween(aliens1).to({y:1000}, 90000, Phaser.Easing.Linear.None, true, 1000, 1000, false ); // eslint-disable-line
  tweenAll2 = game.add.tween(aliens2).to({y:1000}, 90000, Phaser.Easing.Linear.None, true, 1000, 1000, false ); // eslint-disable-line
  tweenAll3 = game.add.tween(aliens3).to({y:1000}, 90000, Phaser.Easing.Linear.None, true, 1000, 1000, false ); // eslint-disable-line
  tweenAll4 = game.add.tween(aliens4).to({y:1000}, 90000, Phaser.Easing.Linear.None, true, 1000, 1000, false ); // eslint-disable-line
  tweenAll5 = game.add.tween(aliens5).to({y:1000}, 90000, Phaser.Easing.Linear.None, true, 1000, 1000, false ); // eslint-disable-line
  // tweenAll1.onLoop.add(() => { aliens1.y += 10; }, this);
  // tweenAll2.onLoop.add(() => { aliens2.y += 10; }, this);
  // tweenAll3.onLoop.add(() => { aliens3.y += 10; }, this);
  // tweenAll4.onLoop.add(() => { aliens4.y += 10; }, this);
  // tweenAll5.onLoop.add(() => { aliens5.y += 10; }, this);
}
// Update
function update() {
  aliens1.scale.set(localStorage.getItem('alienSize'));
  aliens1.children.forEach((alien) => {
    // alien.updateBounds(alien.scale.x, alien.scale.y)
    alien.body.updateBounds(alien.scale.x, alien.scale.y);
  });
  aliens2.scale.set(localStorage.getItem('alienSize'));
  aliens2.children.forEach((alien) => {
    // alien.updateBounds(alien.scale.x, alien.scale.y)
    alien.body.updateBounds(alien.scale.x, alien.scale.y);
  });
  aliens3.scale.set(localStorage.getItem('alienSize'));
  aliens3.children.forEach((alien) => {
    // alien.updateBounds(alien.scale.x, alien.scale.y)
    alien.body.updateBounds(alien.scale.x, alien.scale.y);
  });
  aliens4.scale.set(localStorage.getItem('alienSize'));
  aliens4.children.forEach((alien) => {
    // alien.updateBounds(alien.scale.x, alien.scale.y)
    alien.body.updateBounds(alien.scale.x, alien.scale.y);
  });
  aliens5.scale.set(localStorage.getItem('alienSize'));
  aliens5.children.forEach((alien) => {
    // alien.updateBounds(alien.scale.x, alien.scale.y)
    alien.body.updateBounds(alien.scale.x, alien.scale.y);
  });

  ship.scale.set(localStorage.getItem('shipSize'));

  tween1.updateTweenData('duration', 2000 / localStorage.getItem('alienSpeed'));
  tween2.updateTweenData('duration', 1500 / localStorage.getItem('alienSpeed'));
  tween3.updateTweenData('duration', 1800 / localStorage.getItem('alienSpeed'));
  tween4.updateTweenData('duration', 1300 / localStorage.getItem('alienSpeed'));
  tween5.updateTweenData('duration', 1000 / localStorage.getItem('alienSpeed'));

  lasers.scale.set(localStorage.getItem('laserSize'));
  lasers.children.forEach((laser) => {
    // laser.updateBounds(laser.scale.x, laser.scale.y)
    laser.body.width = 13 * localStorage.getItem('laserSize');
    laser.body.height = 37 * localStorage.getItem('laserSize');
  });
  // lasers.scale.x = localStorage.getItem('laserSize');
  // lasers.scale.y = localStorage.getItem('laserSize');
  // lasers.multiplyAll()
  //   a.body.height = 37 * localStorage.getItem('laserSize');
  //   a.body.width = 13 * localStorage.getItem('laserSize');
  //   a.body.sourceheight = 37 * localStorage.getItem('laserSize');
  //   a.body.sourcewidth = 13 * localStorage.getItem('laserSize');
  //   a.height = 37 * localStorage.getItem('laserSize');
  //   a.width = 13 * localStorage.getItem('laserSize');

  // lasers.body.height *= localStorage.getItem('laserSize');
  // lasers.body.width *= localStorage.getItem('laserSize');

  ship.body.velocity.setTo(0, 0);

  if (cursors.left.isDown && ship.body.right-100 >= game.world.bounds.left) { // eslint-disable-line
    ship.body.velocity.x = -200;
  } else if (cursors.right.isDown && ship.body.right < game.world.bounds.right) { // eslint-disable-line
    ship.body.velocity.x = 200;
  }
	// Loop over the keys
  for (const index in phaserKeys) { // eslint-disable-line
    // Save a reference to the current key
    const key = phaserKeys[index]; // eslint-disable-line
		// If the key was just pressed, fire a laser
    if (key.justDown) {
      fireLaser(); // eslint-disable-line
    }
  }

	// Game.input.activePointer is either the first finger touched, or the mouse

  game.physics.arcade.collide(lasers, aliens1, killAliens); // eslint-disable-line
  game.physics.arcade.collide(lasers, aliens2, killAliens); // eslint-disable-line
  game.physics.arcade.collide(lasers, aliens3, killAliens); // eslint-disable-line
  game.physics.arcade.collide(lasers, aliens4, killAliens); // eslint-disable-line
  game.physics.arcade.collide(lasers, aliens5, killAliens); // eslint-disable-line
  game.physics.arcade.collide(aliens1, ship, youLose); // eslint-disable-line
  game.physics.arcade.collide(aliens2, ship, youLose); // eslint-disable-line
  game.physics.arcade.collide(aliens3, ship, youLose); // eslint-disable-line
  game.physics.arcade.collide(aliens4, ship, youLose); // eslint-disable-line
  game.physics.arcade.collide(aliens5, ship, youLose); // eslint-disable-line
}

function youLose(alien, ship) { // eslint-disable-line
  // setTimeout(() => {location.reload();}, 1000);
  const explosion = explosions.getFirstExists(false);
  explosion.reset(ship.body.x, ship.body.y);
  explosion.play('kaboom', 30, false, true);
  // stateText.kill();
  // stateText.text = 'Game Over! \nClick to restart';
  stateText = game.add.text(game.world.centerX,game.world.centerY,'Game Over! \nClick to restart', { font: '84px Arial', fill: '#fff' }); // eslint-disable-line
  stateText.anchor.setTo(0.5, 0.5);
  stateText.visible = true;
  game.paused = true;
  game.input.onTap.addOnce(restart, this); // eslint-disable-line
}
function killAliens(laser, alien) {
  laser.kill();
  alien.kill();
  const explosion = explosions.getFirstExists(false);
  explosion.reset(alien.body.x, alien.body.y);
  explosion.play('kaboom', 30, false, true);
  if (aliens1.countLiving() === 0 && aliens2.countLiving() === 0 && aliens3.countLiving() === 0 && aliens4.countLiving() === 0 && aliens5.countLiving() === 0) {
    // enemyBullets.callAll('kill', this);
    stateText = game.add.text(game.world.centerX,game.world.centerY,'You win! \nClick to restart', { font: '84px Arial', fill: '#fff' }); // eslint-disable-line
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = true;

    // the "click to restart" handler
    game.input.onTap.addOnce(restart, this); // eslint-disable-line
  }
}
function touchDown() {
	// Set touchDown to true, so we only trigger this once
  mouseTouchDown = true;
  fireLaser(); // eslint-disable-line
}

function touchUp() {
	// Set touchDown to false, so we can trigger touchDown on the next click
  mouseTouchDown = false;
}

function fireLaser() {
	// Get the first laser that's inactive, by passing 'false' as a parameter
  const laser = lasers.getFirstExists(false);
  if (laser) {
		// If we have a laser, set it to the starting position
    laser.reset(ship.x / localStorage.getItem('laserSize'), (ship.y - 20) / localStorage.getItem('laserSize')); // eslint-disable-line
		// Give it a velocity of -500 so it starts shooting
    laser.body.velocity.y = -500 / localStorage.getItem('laserSpeed');
  }
}
function drawPic() {
  const board = document.getElementById('canvas');
  const ctx = board.getContext('webgl', {preserveDrawingBuffer: true}); // eslint-disable-line
  const obj = board.toDataURL('image/png');
  socket.emit('image', obj);
}


setInterval(drawPic, 250);
socket.on('changeGame', (e) => {
  localStorage.setItem('gameName', e);
  location.reload();
});

function restart() {
  aliens1.removeAll();
  aliens2.removeAll();
  aliens3.removeAll();
  aliens4.removeAll();
  aliens5.removeAll();
  explosions.removeAll();
  createAliens();
  explosions = game.add.group();
  explosions.createMultiple(30, 'kaboom');
  explosions.forEach((invader) => {
    invader.anchor.x = 0.5; // eslint-disable-line
    invader.anchor.y = 0.5; // eslint-disable-line
    invader.animations.add('kaboom');
  }, this);
  ship.revive();
  stateText.kill();
  game.paused = false;
}
// Render some debug text on screen
function render() {

}
