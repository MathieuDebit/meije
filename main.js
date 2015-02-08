// main.js

var canvasH = 550,
    canvasW = 800;
var game = new Phaser.Game(canvasW, canvasH, Phaser.AUTO, 'gameDiv');

var platforms;
var randomGap = 0;

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


        // BACKGROUND
        this.game.load.image('vide', 'assets/empty.png');
        this.game.load.image('back', 'assets/bg_01.jpg');
        this.game.load.image('back_02', 'assets/bg_02.png');
        this.game.load.image('back_03', 'assets/bg_03.png');
        this.game.load.image('back_04', 'assets/bg_04.png');
    },

    ///////////////////////////////////////////////
    //            
    //          CREATE FONCTION
    //
    ///////////////////////////////////////////////

    create: function () {

        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.back = this.game.add.tileSprite(0, 0, canvasW, 600, 'back');
        this.back_04 = this.game.add.tileSprite(0, game.world.height - 318, canvasW, 318, 'back_04');
        this.back_03 = this.game.add.tileSprite(0, game.world.height - 254, canvasW, 254, 'back_03');
        this.back_02 = this.game.add.tileSprite(0, game.world.height - 172, canvasW, 172, 'back_02');
        this.vide = game.add.tileSprite(50, canvasH - 139, 'vide');
        this.ground = game.add.tileSprite(0, game.world.height - 50, canvasW, 91, 'ground');


        //PLATEFORMS
        platforms = game.add.group();
        platforms.enableBody = true;
        var ground = platforms.create(106, game.world.height - 50, 'vide');
        ground.body.immovable = true;


        //ROCKS
        this.rocks = game.add.group();
        this.rocks.enableBody = true;
        this.rocks.createMultiple(50, 'rock');

        this.timer = game.time.events.loop(2000, this.addRowOfrocks, this);


        //PLAYER
        this.dude = this.game.add.sprite(canvasW / 6, canvasH - 98, 'dude');

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
        this.ground.tilePosition.x -= 3.3;
        this.back_04.tilePosition.x -= 0.2;
        this.back_03.tilePosition.x -= 0.4;
        this.back_02.tilePosition.x -= 0.8;

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
        rock.body.velocity.x = -200;

        // Kill the rock when it's no longer visible 
        rock.checkWorldBounds = true;
        rock.outOfBoundsKill = true;
        rock.body.immovable = true;


    },

    addRowOfrocks: function () {
        // Pick where the hole will be
        var hole = Math.floor(Math.random() * 60) + 30;

        for (var i = 0; i < 3; i++)
            if (i != hole && i != hole + 1)
                this.addOnerock(30*i + canvasW, canvasH - 72);
    },

    ///////////////////////////////////////////////
    //            
    //          RESTART FONCTION
    //
    ///////////////////////////////////////////////

    restartGame: function () {
        game.state.start('main');
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