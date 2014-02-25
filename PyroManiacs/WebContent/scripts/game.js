
/*
We are using the following code as a library, in order to implement object oriented programming in JavaScript.
*/

var reflection = {};

//http://ejohn.org/blog/simple-javascript-inheritance/
(function(){
	var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

	// The base Class implementation (does nothing)
	this.Class = function(){};
   
	// Create a new Class that inherits from this class
	Class.extend = function(prop, ref_name) {
		if(ref_name)
			reflection[ref_name] = Class;
			
		var _super = this.prototype;

		// Instantiate a base class (but only create the instance,
		// don't run the init constructor)
		initializing = true;
		var prototype = new this();
		initializing = false;
		 
		// Copy the properties over onto the new prototype
		for (var name in prop) {
		// Check if we're overwriting an existing function
		prototype[name] = typeof prop[name] == "function" && 
			typeof _super[name] == "function" && fnTest.test(prop[name]) ?
			(function(name, fn) {
				return function() {
					var tmp = this._super;

					// Add a new ._super() method that is the same method
					// but on the super-class
					this._super = _super[name];

					// The method only need to be bound temporarily, so we
					// remove it when we're done executing
					var ret = fn.apply(this, arguments);        
					this._super = tmp;

					return ret;
				};
			})(name, prop[name]) :
			prop[name];
		}
		 
		// The dummy class constructor
		function Class() {
			// All construction is actually done in the init method
			if ( !initializing && this.init )
				this.init.apply(this, arguments);
		}
		 
		// Populate our constructed prototype object
		Class.prototype = prototype;
		 
		// Enforce the constructor to be what we expect
		Class.prototype.constructor = Class;

		// And make this class extendable
		Class.extend = arguments.callee;
		 
		return Class;
	};
})();

/*
 * End Library Code
*/

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
		height: 36,
		width: 32,
		speed: 4,
		gravity: 4,
		jumpHeight: 6,
		onGround: false,
		life: 3,
		damage: 1
};
var zombie = {
		height: 36,
		width: 32,
		speed: 2,
		gravity: 4,
		jumpHeight: 6,
		onGround: false,
		life: 2,
		damage: 1
};

var block = Class.extend({
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

var block1 = new block(32,32);

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
	pyro.y = canvas.height - (32 + pyro.height);
	
	zombie.x = 2 * zombie.width;
	zombie.y = canvas.height / 2;
};

var jump = 20;
var zJump = 20;
//Update all of the objects
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
	
	//if (block1.imageReady) {
		ctx.drawImage(block1.image, block1.x, block1.y);
	//}
	
	
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
	update();
	render();
};

reset();
setInterval(main, 1);