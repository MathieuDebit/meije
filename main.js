// main.js

var firstheight = window.innerHeight;
var firstwidth = window.innerWidth;
var game = new Phaser.Game(firstwidth, firstheight, Phaser.AUTO, 'gameDiv');

$(window).resize(function () {
    display.resizer();
});

var display = {

    resizer: function () {

        var myheight = $(window).innerHeight();
        var mywidth = $(window).innerWidth();

        try {

            game.width = Number(mywidth);
            game.height = Number(myheight);
            game.stage.bounds.width = Number(mywidth);
            game.stage.bounds.height = Number(myheight);

            game.renderer.resize(Number(mywidth), Number(myheight));

            firstwidth = Number(mywidth);
            firstheight = Number(myheight);

            Phaser.Canvas.setSmoothingEnabled(game.context, false);

        } catch (e) {

            console.log("Error description: " + e.message + "");

        }

    }
};

//var canvasH = 350,
//    canvasW = 600;
//var game = new Phaser.Game(canvasW, canvasH, Phaser.AUTO, 'gameDiv');

var platforms;
var speed = 1;

var mainState = {

    ///////////////////////////////////////////////
    //            
    //          PRELOAD FONCTION
    //
    ///////////////////////////////////////////////

    preload: function () {

        // PLAYER
        this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

        // SOL
        this.game.load.image('ground', 'assets/ground.png');

        // OBSTACLES
        this.game.load.image('rock', 'assets/rocks.png');
        this.game.load.image('tronc', 'assets/tronc.png');


        // BACKGROUND
        this.game.load.image('vide', 'assets/empty.png');
        this.game.load.image('back', 'assets/bg_01.jpg');
        this.game.load.image('back_02', 'assets/bg_02.png');
        this.game.load.image('back_03', 'assets/bg_03.png');
        this.game.load.image('back_04', 'assets/bg_04.png');

        //SOUND
        this.game.load.audio('die', ['assets/trumpette.mp3', 'assets/trumpette.ogg']);

        console.log("firstWidth : " + firstwidth);
        console.log("firstheight : " + firstheight);

    },

    ///////////////////////////////////////////////
    //            
    //          CREATE FONCTION
    //
    ///////////////////////////////////////////////

    create: function () {

        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.back = this.game.add.tileSprite(0, 0, firstwidth, 600, 'back');
        this.back_04 = this.game.add.tileSprite(0, firstheight - 318, firstwidth, 318, 'back_04');
        this.back_03 = this.game.add.tileSprite(0, firstheight - 254, firstwidth, 254, 'back_03');
        this.back_02 = this.game.add.tileSprite(0, firstheight - 172, firstwidth, 172, 'back_02');
        this.vide = game.add.tileSprite(50, firstheight - 139, 'vide');
        this.ground = game.add.tileSprite(0, firstheight - 50, firstwidth, 91, 'ground');

        this.die = game.add.audio('die');

        //PLATEFORMS
        platforms = game.add.group();
        platforms.enableBody = true;
        var ground = platforms.create(firstwidth / 6, firstheight - 50, 'vide');
        ground.body.immovable = true;


        //ROCKS
        this.rocks = game.add.group();
        this.rocks.enableBody = true;
        this.rocks.createMultiple(50, 'rock');

        this.timer = game.time.events.loop(3000, this.addRowOfrocks, this);


        //PLAYER
        this.dude = this.game.add.sprite(firstwidth / 6, firstheight - 98, 'dude');

        game.physics.enable(this.dude, Phaser.Physics.ARCADE);
        this.dude.enableBody = true;

        this.dude.animations.add('run', [5, 6, 7, 8], 10, true);
        this.dude.animations.add('space', [6], 10, true);
        this.dude.animations.add('stop', [4], 10, true);


        //SPACEKEYKE
        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


        //DOUBLE SAUT
        this.compte = 0;

        //SCORE


    },

    ///////////////////////////////////////////////
    //            
    //          UPDATE FONCTION
    //
    ///////////////////////////////////////////////

    update: function () {
        this.ground.tilePosition.x -= (3*speed);
        this.back_04.tilePosition.x -= (0.2*speed);
        this.back_03.tilePosition.x -= (0.4*speed);
        this.back_02.tilePosition.x -= (0.8*speed);

        game.physics.arcade.collide(this.dude, platforms);

        // Double saut
        if (this.compte < 2) {
            if (this.spaceKey.isDown) {
                if (this.spaceKey.downDuration(5)) {
                    this.compte = this.compte + 1;
                    game.physics.arcade.enable(this.dude);
                    this.dude.body.gravity.y = 1000;
                    this.dude.body.velocity.y = -350;
                }
            }
        }

        if (this.dude.body.velocity.y != 0) {
            this.dude.play('space');
        } else {
            this.dude.play('run');
            this.compte = 0;
        }

        if (this.dude.inWorld == false) {
            this.restartGame();
        }


        this.collides(this.rocks, this.dude)
        //game.physics.collide(this.dude, this.rock, collisionHandler, null, this);


    },


    ///////////////////////////////////////////////
    //            
    //          ADD ROCK FONCTION
    //
    ///////////////////////////////////////////////

    addOnerock: function (x, y) {
        // Get the first dead rock of our group
        var rock = this.rocks.getFirstDead();

        // Set the new position of the rock
        rock.reset(x, y);

        // Add velocity to the rock to make it move left
        rock.body.velocity.x = -(180*speed);

        // Kill the rock when it's no longer visible 
        rock.checkWorldBounds = true;
        rock.outOfBoundsKill = true;
        rock.body.immovable = true;
    },

    addRowOfrocks: function () {
        var obstacleNumber = Math.floor((Math.random() * 3) + 1);
        console.log("obstacleNumber : " + obstacleNumber);
        console.log("speed : " + speed);
        for (var i = 0; i < obstacleNumber; i++)
            this.addOnerock(i * (Math.floor((Math.random() * 170) + 130)) + firstwidth, firstheight - 72);
            //speed = speed * 1.1;

    },



    ///////////////////////////////////////////////
    //            
    //          RESTART FONCTION
    //
    ///////////////////////////////////////////////

    restartGame: function () {
        game.state.start('main');
        this.die.play();
        speed = 1;
    },

    collides: function (a, b) {
        var collision = game.physics.arcade.collide(a, b);
        if (collision) {
            this.restartGame();
        }

    },

};


game.state.add('main', mainState);
game.state.start('main');