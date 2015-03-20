// main.js

var easy = 1;

var h_window = window.innerHeight,
    w_window = window.innerWidth;


var game = new Phaser.Game(w_window, h_window, Phaser.AUTO, 'gameDiv');

// SCORE
var timer, total = 0,
    highscore = 0;

// PLATEFORMS
var platforms;

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
            w_window = Number(mywidth);
            h_window = Number(myheight);
            Phaser.Canvas.setSmoothingEnabled(game.context, false);
        } catch (e) {
            console.log("Error description: " + e.message + "");
        }
    }
};

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
        this.game.load.image('rock', 'assets/mouton64.png');
        this.game.load.image('tronc', 'assets/tronc.png');

        // BACKGROUND
        this.game.load.image('vide', 'assets/empty.png');
        this.game.load.image('back', 'assets/bg.png');
        this.game.load.image('stars', 'assets/stars.png');
        this.game.load.image('back_02', 'assets/m_three.png');
        this.game.load.image('back_03', 'assets/m_two.png');
        this.game.load.image('back_04', 'assets/m_one.png');

        //SOUND
        this.game.load.audio('die', ['assets/trumpette.mp3', 'assets/trumpette.ogg']);
        this.game.load.audio('ost', ['assets/Meije_OST_0.mp3']);

        //MENU
        this.game.load.image('menu1', 'assets/menu-1.png', 270, 50);
        this.game.load.image('menu2', 'assets/menu2.png', 270, 50);
        this.game.load.image('menu3', 'assets/menu3.png', 270, 50);

        this.game.load.image('overlay', 'assets/overlay.png');
        
    },

    ///////////////////////////////////////////////
    //            
    //          CREATE FONCTION
    //
    ///////////////////////////////////////////////

    create: function () {

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.stage.backgroundColor = "70cfff";
        this.back = this.game.add.tileSprite(0, 0, w_window, 376, 'back');
        this.stars = this.game.add.tileSprite(0, 0, w_window, 376, 'stars');
        this.back_02 = this.game.add.tileSprite(0, h_window - 376 - 50, w_window, 376, 'back_02');
        this.back_03 = this.game.add.tileSprite(0, h_window - 376 - 50, w_window, 376, 'back_03');
        this.back_04 = this.game.add.tileSprite(0, h_window - 376 - 50, w_window, 376, 'back_04');
        this.vide = this.game.add.tileSprite(w_window, h_window - 139, 'vide');
        this.ground = this.game.add.tileSprite(0, h_window - 50, w_window, 91, 'ground');
        //this.vide = this.game.add.rectangle(0, h_window-50, w_window, 1);

        this.speed = 4;
        this.maxSpeed = 10;

        //PLATEFORMS
        platforms = game.add.group();
        platforms.enableBody = true;
        var ground = platforms.create(w_window / 6, h_window - 50, 'vide');
        ground.body.immovable = true;

        //ROCKS
        this.rocks = game.add.group();
        this.rocks.enableBody = true;
        this.rocks.createMultiple(50, 'rock');

        // var rdmTime = Math.max(Math.random()*1000 + easy, 1000);
        // console.log(rdmTime);
        // this.timer = game.time.events.loop(rdmTime, this.addRowOfrocks, this);

        //PLAYER
        this.dude = this.game.add.sprite(w_window / 6, h_window - 98, 'dude');
        game.physics.enable(this.dude, Phaser.Physics.ARCADE);
        this.dude.enableBody = true;
        this.dude.animations.add('run', [5, 6, 7, 8], 10, true);
        this.dude.animations.add('space', [6], 10, true);

        //KEYS
        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.escapeKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);

        //DOUBLE SAUT
        this.compteNbSaut = 0;

        //MUSIC
        this.die = game.add.audio('die');
        this.music = this.game.add.audio('ost',true);
        this.music.loop = true;
        this.music.play();
    },

    ///////////////////////////////////////////////
    //            
    //          UPDATE FONCTION
    //
    ///////////////////////////////////////////////

    update: function () {

       game.physics.arcade.collide(this.dude, platforms);

       if (localStorage.getItem("highscore")) {
            highscore = localStorage.getItem("highscore");
        }

       // var rdmTime = Math.max(Math.random()*1000 + easy, 1000);
       // console.log(rdmTime);
       // this.timer = game.time.events.loop(rdmTime, this.addRowOfrocks, this);

        var dif=Math.random();
        //easy-=0.01;
        easy = Math.max(easy-0.001, 0.99);
        //console.log('easy = ' + easy + ', dif = ' + dif);

        
        if( dif >  easy){
            this.addRowOfrocks();
            //console.log('condition : ' + dif)
        }

        if(this.speed < this.maxSpeed)
            this.speed += 0.001;

        

        this.ground.tilePosition.x -= this.speed;
        this.stars.tilePosition.x -= 0.1;
        this.back_02.tilePosition.x -= 0.2;
        this.back_03.tilePosition.x -= 0.3;
        this.back_04.tilePosition.x -= 0.4;
        for(var i in this.rocks.children){
            this.rocks.children[i].body.x -= this.speed;

        };

        

        // Double saut
        if (this.compteNbSaut < 2) {
            if (this.spaceKey.isDown || this.upKey.isDown) {
                if (this.spaceKey.downDuration(5) || this.upKey.downDuration(5)) {
                    this.compteNbSaut = this.compteNbSaut + 1;
                    game.physics.arcade.enable(this.dude);
                    this.dude.body.gravity.y = 1600;
                    this.dude.body.velocity.y = -600;
                }
            }
        }
        if (this.dude.body.velocity.y !== 0) {
            this.dude.play('space');
        } else {
            this.dude.play('run');
            this.compteNbSaut = 0;
        }
        if (this.dude.inWorld === false) {
            this.restartGame();
        }
        this.collides(this.rocks, this.dude);

        // SCORE 
        total += 0.1;
        game.debug.text('Score : ' + parseInt(total), 32, 32);
        game.debug.text('High Score : ' + parseInt(highscore), 32, 32 * 1.5);
       
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
        //rock.body.velocity.x = 0;
        //rock.body.velocity.y = 0;

        // Kill the rock when it's no longer visible 
        rock.checkWorldBounds = true;
        rock.outOfBoundsKill = true;
        rock.body.immovable = true;

        //this.rocks.push(rock);

    },

    addRowOfrocks: function () {
        this.addOnerock(w_window, h_window - 112);
    },


    ///////////////////////////////////////////////
    //            
    //          RESTART FONCTION
    //
    ///////////////////////////////////////////////

    restartGame: function () {
        game.state.start('main');
                this.die.play();
        if (total > highscore) {
            highscore = total;
        }
        total = 0;
        localStorage.setItem("highscore", highscore);
        this.music.stop();
    },

    collides: function (a, b) {
        var collision = game.physics.arcade.collide(a, b);
        if (collision) {
            this.restartGame();
        }
    }


};

game.state.add('main', mainState);
game.state.start('main');