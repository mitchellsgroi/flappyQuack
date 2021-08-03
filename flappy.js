//-----------FLAPPY QUACK----------------------
//-----------------------------------------------------------

var bird;
var keyWas = false;
var pipes = [];
var background;
var scoreObject;
var score;


function startGame() {
    gameArea.start();
    score = 0;
    bird = new component(30, 20, "dudBird.png", 80, 80, "image");
    // bird = new component(30, 30, "red", 80, 80);
    scoreObject = new component("30px", "Consolas", "black", 5, 30, "text");

    background = new component(480, 270, "background.png", 0, 0, "background");
}

function restartGame() {
    gameArea.stop();
    gameArea.clear();
    //gameArea = {};
    bird = {};
    pipes = [];
    document.getElementsByTagName("canvas")[0].innerHTML = "";
    document.getElementById("restartButton").style.display = "none";
    startGame();
}



// GAME AREA OBJECT -----------------------------------
var gameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[4]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e){
            gameArea.key = e.keyCode;
        });
        window.addEventListener('touchstart', function() {
            gameArea.key = 32;
        })
        window.addEventListener('keyup', function (e) {
            gameArea.key = false;
        })
        window.addEventListener('touchend', function() {
            gameArea.key = false;
        })

    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function everyInterval(n) {
    if ((gameArea.frameNo / n) % 1 == 0) {
        return true;
    }
    return false;
}


// COMPONENT OBJECT --------------------------------
function component(width, height, colour, x, y, type) {
    this.type = type;
    if (type == "image" || type == "background") {
        this.image = new Image();
        this.image.src = colour;
    }
    this.width = width;
    this.height = height;
    this.angle = 0;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.gravity = 0.0;
    this.gravitySpeed = 0;
    ctx = gameArea.context;
    ctx.fillStyle = colour;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    this.update = function() {
        ctx = gameArea.context;
        if (type == "image") {
            ctx.save();
            ctx.translate(this.x + (this.width / 2), this.y + this.height / 2);
            ctx.rotate(this.angle);
            ctx.drawImage(this.image, 
                -this.width / 2, 
                -this.height / 2,
                this.width,
                this.height);
            ctx.restore();
        } 
        else if (type == "background") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
        }
        else if (type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = colour;
            ctx.fillText(this.text, this.x, this.y)

        }
        else {
            ctx.save();
            ctx.translate(this.x + (this.width / 2), this.y + this.height / 2);
            ctx.rotate(this.angle);
            ctx.fillStyle = colour;
            ctx.fillRect(this.width / -2, 
                this.height / -2, 
                this.width, 
                this.height);
                ctx.restore();
        }




    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        if ( this.type == "background") {
            if (this.x == -(this.width)) {
                this.x = 0;
            }
        }
        this.hitBottom();
        this.hitTop();
    }
    this.hitBottom = function() {
        var rockBottom = gameArea.canvas.height - this.height;
        if (this.y > rockBottom) {
            this.y = rockBottom;
            this.gravitySpeed = 0;
        }
    }
    this.hitTop = function() {
        if (this.y < 0) {
            this.y = 0;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function(otherObject) {
        var myLeft = this.x;
        var myRight = this.x + (this.width);
        var myTop = this.y;
        var myBottom = this.y + (this.height);
        var otherLeft = otherObject.x;
        var otherRight = otherObject.x + (otherObject.width);
        var otherTop = otherObject.y;
        var otherBottom = otherObject.y + (otherObject.height);
        var crash = true;
        if ((myBottom < otherTop)
            || (myTop > otherBottom)
            || (myRight < otherLeft)
            || (myLeft > otherRight)) {
                crash = false;
        }
        
        return crash;
    }
}

function updateGameArea() {
    var x, y;

    for (var i = 0; i < pipes.length; i++) {
        if (bird.crashWith(pipes[i])) {  
            gameArea.stop();
            document.getElementById("restartButton").style.display = "block";
            return; 
        }
    }
    
    gameArea.clear();
    background.speedX = -0.5;
    background.newPos();
    background.update();
    gameArea.frameNo++;

    if (gameArea.frameNo == 1 || everyInterval(150)) {
        x = gameArea.canvas.width;
        var minY = 20;
        var maxY = 150;
        var randY = Math.floor(Math.random() * (maxY - minY + 1) + minY);
        var minGap = 50;
        var maxGap = 100;
        var gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        pipes.push(new component(25, 200, "topPipe.png", x, randY - 200, "image"));
        pipes.push(new component(25, 200, "pipe.png", x, randY + gap, "image"));



        // y = gameArea.canvas.height - 200;
        // pipes.push(new component(10, 200, "green", x, y));
    }
    
    for (var i = 0; i < pipes.length; i++) {
        pipes[i].x -= 1;
        //pipes[i].newPos();
        pipes[i].update();

        if (pipes[i].x == bird.x) {
            score += 0.5;
        }

    }
    
            
    // Jump when space is pressed
    if (!keyWas && gameArea.key && gameArea.key == 32) {
        console.log(gameArea.key)
        accelerate(-3);
        
    } else {
        accelerate(0.1);
    }

    keyWas = gameArea.key;

    //gameArea.key = false;
    scoreObject.text = score;
    scoreObject.update();

    rotateBird();
    bird.newPos();
    bird.update();



}

function accelerate(n) {
    bird.gravity = n;
}

function rotateBird() {
    if (bird.gravitySpeed > 0) {
        bird.angle = 20 * (Math.PI / 180)
    } 
    else if (bird.gravitySpeed < 0) {
        bird.angle = 340 * (Math.PI / 180)
    }

    else {
        bird.angle = 0;
    } 
}