
// Basic Game
// Team Tux

// ----- Initialize Canvas -----
var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
canvas.width = 640;
canvas.height = 480;
document.body.appendChild(canvas);

// ----- Load Background Image -----
var backgroundReady = false;
var backgroundImage = new Image();
backgroundImage.onload = function () {
	backgroundReady = true;
};
backgroundImage.src = "images/background.png";

// ------ Moving Characters Class -----
var Character = Class.extend({
	init: function (x, y) {
		this.setPosition(x, y);
	},
	setPosition: function (x, y) {
		this.x = x;
		this.y = y;
	},
	setImage: function (img) {
		this.image = new Image();
		this.image.src = img;
	}
});

var Pyro = Character.extend({
	init: function(x, y) {
		this._super(x, y);
		this.height = 36;
		this.width = 32;
		this.speed = 4;
		this.gravity = 4;
		this.jumpHeight = 6;
		this.life = 3;
		this.damage = 1;
		this.onGround = false;
	},
	setPosition: function(x, y) {
		this.x = x;
		this.y = y;
	},
	setImage: function(image) {
		this.image = new Image();
		this.image.src = image;
	}
});

var Zombie = Character.extend({
	init: function(x, y) {
		this._super(x, y);
		this.height = 36;
		this.width = 32;
		this.speed = 2;
		this.gravity = 4;
		this.jumpHeight = 6;
		this.onGround = false;
		this.life = 2;
		this.damage = 1;
	},
	setPosition: function(x, y) {
		this.x = x;
		this.y = y;
	},
	setImage: function(image) {
		this.image = new Image();
		this.image.src = image;
	}
});

// ----- Static Characters Class -----
var Block = Class.extend({
	init: function (x, y) {
		this.setPosition(x, y);
		this.setImage("images/block.png");
		this.setBoundries(32, 32);
	},
	setPosition: function (x, y) {
		this.x = x;
		this.y = y;
	},
	setImage: function (img) {
		this.image = new Image();
		this.image.src = img;
	},
	setBoundries: function (width, height){
		this.width = width;
		this.height = height;
	}
});

// ----- Create Characters -----
var characters = new Array();
var blocks = new Array();

var pyro = new Pyro(0, 0);
pyro.setImage("images/pyro.png");
characters[0] = pyro;

var zombie = new Zombie(0, 0);
zombie.setImage("images/zombie.png");
characters[1] = zombie;

var block1 = new Block(32,32);
blocks[0] = block1;

var kills = 0;
var coins = 0;

// ----- Listen for Input -----
var keysPressed = {};

addEventListener("keydown", function (e) {
	keysPressed[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysPressed[e.keyCode];
}, false);

// ----- Reset the Game -----
var reset = function () {
	pyro.x = canvas.width / 2;
	pyro.y = canvas.height - (32 + pyro.height);
	
	zombie.x = 2 * zombie.width;
	zombie.y = canvas.height / 2;
};

var jump = 20;
var zJump = 20;

// ----- Update all of the Objects -----
var update = function () {
	
	//Up arrow
	if (38 in keysPressed && pyro.onGround) {
		pyro.y -= pyro.jumpHeight;
		pyro.onGround = false;
	}
	//Down arrow
	if (40 in keysPressed) {
		pyro.y += pyro.speed;
	}
	//Left arrow
	if (37 in keysPressed) {
		pyro.x -= pyro.speed;
	}
	//Right arrow
	if (39 in keysPressed) {
		pyro.x += pyro.speed;
	}
	
	//Gravity
	if (!pyro.onGround && jump < 20) {
		pyro.y -= pyro.jumpHeight;
		jump++;
	}
	else if	(!pyro.onGround && jump < 22) {
		jump++;
	}
	else {
		pyro.y += pyro.gravity;
	}
	
	//Check collisions
	if (pyro.x < 0 ) { 
		pyro.x = 0; 
	}
	if (pyro.x > canvas.width - pyro.width) { 
		pyro.x = canvas.width - pyro.width;
	}
	if (pyro.y < 0 ) { 
		pyro.y = 0; 
	}
	if (pyro.y > canvas.height - (32 + pyro.height)) { 
		pyro.y = canvas.height - (32 + pyro.height);
		pyro.onGround = true;
		jump = 0;
	}
	
	//Redo it all for the zombie
	// This needs to be re-written where each char is and object, 
	// and the function is detectCollisions(char object). Then
	// we can just store all of the enemies in an array and loop
	// through it calling this function on each one. 
	// To do this I need to figure out how to make a character class
	// and make zombies and the pyro inherit from it.
	
	//Gravity
	if (!zombie.onGround && zJump < 20) {
		zombie.y -= zombie.jumpHeight;
		zJump++;
	}
	else if	(!zombie.onGround && zJump < 22) {
		zJump++;
	}
	else {
		zombie.y += zombie.gravity;
	}
	
	//Check collisions
	if (zombie.x < 0 ) { 
		zombie.x = 0; 
	}
	if (zombie.x > canvas.width - zombie.width) { 
		zombie.x = canvas.width - zombie.width;
	}
	if (zombie.y < 0 ) { 
		zombie.y = 0; 
	}
	if (zombie.y > canvas.height - (32 + zombie.height)) { 
		zombie.y = canvas.height - (32 + zombie.height);
		zombie.onGround = true;
		zJump = 0;
	}
};

// ----- Draw the Objects -----
var render = function () {
	if (backgroundReady) {
		context.drawImage(backgroundImage, 0, 0);
	}
	
	context.drawImage(pyro.image, pyro.x, pyro.y);
	context.drawImage(zombie.image, zombie.x, zombie.y);
	context.drawImage(block1.image, block1.x, block1.y);
	
	/*
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Kills: " + kills, 32, 32);
	*/
};

// ----- Main loop -----
var main = function () {
	update();
	render();
};

reset();
setInterval(main, 1);