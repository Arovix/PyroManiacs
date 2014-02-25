
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
		this.onGround = false;
		this.gravity = 3;
		this.speed = 3;
		this.jumpFrame = 20;
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
		this.jumpFrame = 20;
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
		this.jumpFrame = 20;
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

var pyro = new Pyro(0, 0);
pyro.setImage("images/pyro.png");
characters[0] = pyro;

var zombie = new Zombie(0, 0);
zombie.setImage("images/zombie.png");
characters[1] = zombie;

// ----- Create Levels -----
var currentLevel = 0;
var levels = new Array();
var level_0 = new Array();

level_0[0] = new Block(64,376);
level_0[1] = new Block(96,376);
level_0[2] = new Block(128,376);
level_0[3] = new Block(160,376);
level_0[4] = new Block(224,304);
level_0[5] = new Block(256,304);
level_0[6] = new Block(288,304);
level_0[7] = new Block(320,304);
level_0[8] = new Block(384,376);
level_0[9] = new Block(416,376);
level_0[10] = new Block(448,376);
level_0[11] = new Block(480,376);

levels[0] = level_0;

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


// ----- Detect Collisions -----
var collision = function (char) {
	
	// ----- Gravity -----
	if (!char.onGround && char.jumpFrame < 20) {
		char.y -= char.jumpHeight;
		char.jumpFrame++;
	}
	else if	(!char.onGround && char.jumpFrame < 22) {
		char.jumpFrame++;
	}
	else {
		char.y += char.gravity;
	}
	
	// ----- Canvas Limits -----
	if (char.x < 0 ) { 
		char.x = 0; 
	}
	if (char.x > canvas.width - char.width) { 
		char.x = canvas.width - char.width;
	}
	if (char.y < 0 ) { 
		char.y = 0; 
	}
	if (char.y > canvas.height - (32 + char.height)) { 
		char.y = canvas.height - (32 + char.height);
		char.onGround = true;
		char.jumpFrame = 0;
	}
};

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
	
	// Collision detection for characters
	for (var i = 0; i < characters.length; i++){
		collision(characters[i]);
	}
};

// ----- Draw the Objects -----
var render = function () {
	// Draw background
	if (backgroundReady) {
		context.drawImage(backgroundImage, 0, 0);
	}

	// Draw Characters
	for (var i = 0; i < characters.length; i++){
		context.drawImage(characters[i].image, characters[i].x, characters[i].y);
	}
	
	// Draw Level's Static Objects
	for (var j = 0; j < levels[currentLevel].length; j++){
		context.drawImage(levels[currentLevel][j].image, levels[currentLevel][j].x, levels[currentLevel][j].y);
	}
	
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