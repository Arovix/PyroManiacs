//Basic Game

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 640;
canvas.height = 480;
document.body.appendChild(canvas);

//Load Background
var backgroundReady = false;
var backgroundImage = new Image();
backgroundImage.onload = function () {
	backgroundReady = true;
};
backgroundImage.src = "images/background.png";

//Load Pyro
var pyroReady = false;
var pyroImage = new Image();
pyroImage.onload = function () {
	pyroReady = true;
};
pyroImage.src = "images/pyro.png";

//Load Background
var zombieReady = false;
var zombieImage = new Image();
zombieImage.onload = function () {
	zombieReady = true;
};
zombieImage.src = "images/zombie.png";

var pyro = {
		speed: 4,
		life: 3,
		damage: 1
};
var zombie = {
		speed: 1,
		life: 2,
		damage: 1
};
var gravity = 3; // pixels per second falling down
var kills = 0;
var coins = 0;

var keysPressed = {};

addEventListener("keydown", function (e) {
	keysPressed[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysPressed[e.keyCode];
}, false);

//Reset the game to the start state
var reset = function () {
	pyro.x = canvas.width / 2;
	pyro.y = canvas.height - (32 + 36);
	
	zombie.x = canvas.width / 2;
	zombie.y = canvas.height / 2;
};

//Update all of the objects
var update = function (speed) {
	//Up arrow
	if (38 in keysPressed) {
		pyro.y -= pyro.speed;
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
	
	//Check collisions
	if (pyro.x < 0 ) { pyro.x = 0; }
	if (pyro.x > canvas.width - 32) { pyro.x = canvas.width - 32;}
	if (pyro.y < 0 ) { pyro.y = 0; }
	if (pyro.y > canvas.height - (32 + 36)) { pyro.y = canvas.height - (32 + 36);}
};

//Draw Screen
var render = function () {
	if (backgroundReady) {
		ctx.drawImage(backgroundImage, 0, 0);
	}
	
	if (pyroReady) {
		ctx.drawImage(pyroImage, pyro.x, pyro.y);
	}
	if (zombieReady) {
		ctx.drawImage(zombieImage, zombie.x, zombie.y);
	}
	
	/*
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Kills: " + kills, 32, 32);
	*/
};

//Main loop
var main = function () {
	var now = Date.now();
	var d = now - start;
	
	update(d / 1000);
	render();
	out.println("Hello World!");
	
	start = now;
};

reset();
var start = Date.now();
setInterval(main, 1);