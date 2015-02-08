// main.js

var firstheight = window.innerHeight;
var firstwidth = window.innerWidth;

var game = new Phaser.Game(firstwidth, firstheight, Phaser.AUTO, 'gameDiv');

// SCORE
var timer;
var total = 0;
var highscore = 0;

// RESPONSIVE
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

// PLATEFORMS
var platforms;

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
        this.game.load.image('ground', 'assets/ground_mario.png');

        // OBSTACLES
        this.game.load.image('rock', 'assets/rock_mario.png');


        // BACKGROUND
        this.game.load.image('vide', 'assets/empty.png');
        this.game.load.image('back', 'assets/bg.png');
        this.game.load.image('stars', 'assets/stars.png');
        this.game.load.image('back_02', 'assets/m_three.png');
        this.game.load.image('back_03', 'assets/m_two.png');
        this.game.load.image('back_04', 'assets/m_one.png');

        //SOUND
        this.game.load.audio('die', ['assets/trumpette.mp3', 'assets/trumpette.ogg']);

    },

    ///////////////////////////////////////////////
    //            
    //          CREATE FONCTION
    //
    ///////////////////////////////////////////////

    create: function () {

        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.stage.backgroundColor = "70cfff";
        this.back = this.game.add.tileSprite(0, 0, firstwidth, 376, 'back');
        this.stars = this.game.add.tileSprite(0, 0, firstwidth, 376, 'stars');
        this.back_02 = this.game.add.tileSprite(0, firstheight - 376 - 50, firstwidth, 376, 'back_02');
        this.back_03 = this.game.add.tileSprite(0, firstheight - 376 - 50, firstwidth, 376, 'back_03');
        this.back_04 = this.game.add.tileSprite(0, firstheight - 376 - 50, firstwidth, 376, 'back_04');
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
        this.rocks.createMultiple(10, 'rock');

        this.timer = game.time.events.loop(5000, this.addRowOfrocks, this);


        //PLAYER
        this.dude = this.game.add.sprite(firstwidth / 6, firstheight - 98, 'dude');

        game.physics.enable(this.dude, Phaser.Physics.ARCADE);
        this.dude.enableBody = true;

        this.dude.animations.add('run', [5, 6, 7, 8], 10, true);
        this.dude.animations.add('space', [6], 10, true);
        this.dude.animations.add('stop', [4], 10, true);

        //KEYS
        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.escapeKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);

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

        if (localStorage.getItem("hg")) {
            highscore = localStorage.getItem("hg");
        }

        this.ground.tilePosition.x -= 3.3;
        this.stars.tilePosition.x -= 0.1;
        this.back_02.tilePosition.x -= 0.2;
        this.back_03.tilePosition.x -= 0.3;
        this.back_04.tilePosition.x -= 0.4;

        game.physics.arcade.collide(this.dude, platforms);

        // Double saut
        if (this.compte < 2) {
            if (this.spaceKey.isDown || this.upKey.isDown) {
                if (this.spaceKey.downDuration(5) || this.upKey.downDuration(5)) {
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

        // SCORE 

        total += 0.1;
        game.debug.text('Score : ' + parseInt(total), 32, 32);
        game.debug.text('High Score : ' + highscore, 32, 32 * 1.5);

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
        rock.body.velocity.x = -198;

        // Kill the rock when it's no longer visible 
        rock.checkWorldBounds = true;
        rock.outOfBoundsKill = true;
        rock.body.immovable = true;


    },

    addRowOfrocks: function () {
        var obstacleNumber = Math.floor((Math.random() * 3) + 1);
        console.log("obstacleNumber : " + obstacleNumber);
        for (var i = 0; i < obstacleNumber; i++)
            this.addOnerock(i*Math.floor((Math.random() * 170) + 130) + firstwidth, firstheight - 82);

        // repert pour voir le loop de la fonction
        this.addOnerock(firstwidth, firstheight - 282);


    },

    ///////////////////////////////////////////////
    //            
    //          RESTART FONCTION
    //
    ///////////////////////////////////////////////

    restartGame: function () {
        game.state.start('main');
        //        this.die.play();

        if (total > highscore) {
            highscore = total;
        }
        total = 0;

        localStorage.setItem("hg", highscore);
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