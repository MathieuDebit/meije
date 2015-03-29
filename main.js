var overlay = document.getElementById('overlay'),
    start_button = overlay.firstElementChild;

start_button.onclick = function () {

    overlay.style.display = "none";

    $(function () {
        $("#pauseButton").text("Pause").data("paused", false).click(function () {
            $(this).data("paused", !$(this).data("paused"));
            if ($(this).data("paused")) {
                $(this).text("Resume");
                game.paused = true;
            } else {
                $(this).text("Pause");
                game.paused = false;
            }
        })
    });


    // PHAZER -- BEGIN
    // main.js

    var easy = 1;
    var bonus = 0;

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
            this.game.load.spritesheet('dude', 'assets/hex_run.png', 69, 84);

            // SOL
            this.game.load.image('ground', 'assets/hex_ground.png');

            // OBSTACLES
            this.game.load.image('rock', 'assets/hex_obs.png');
            this.game.load.image('cube', 'assets/rock_mario.png');

            // BACKGROUND
            this.game.load.image('vide', 'assets/empty.png');
            this.game.load.image('back', 'assets/hex_sky.png');
            this.game.load.image('stars', 'assets/stars.png');
            this.game.load.image('back_02', 'assets/m_three.png');
            this.game.load.image('back_03', 'assets/m_two.png');
            this.game.load.image('back_04', 'assets/m_one.png');

            // SOUND
            this.game.load.audio('die', ['assets/trumpette.mp3', 'assets/trumpette.ogg']);
            this.game.load.audio('ost', ['assets/Meije_OST_0.mp3']);

            //MENU
            // this.game.load.image('menu1', 'assets/menu-1.png', 270, 50);
            // this.game.load.image('menu2', 'assets/menu2.png', 270, 50);
            // this.game.load.image('menu3', 'assets/menu3.png', 270, 50);

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

            this.back = this.game.add.sprite(338, 220, 'back');
            this.back.x = 0;
            this.back.y = 0;
            this.back.height = h_window;
            this.back.width = w_window;
            this.back.smoothed = false;

            this.stars = this.game.add.tileSprite(0, 0, w_window, 376, 'stars');
            this.back_02 = this.game.add.tileSprite(0, h_window - 376 - 90, w_window, 376, 'back_02');
            this.back_03 = this.game.add.tileSprite(0, h_window - 376 - 90, w_window, 376, 'back_03');
            this.back_04 = this.game.add.tileSprite(0, h_window - 376 - 90, w_window, 376, 'back_04');
            this.vide = this.game.add.tileSprite(w_window, h_window - 139, 'vide');
            this.ground = this.game.add.tileSprite(0, h_window - 90, w_window, 91, 'ground');
            //this.vide = this.game.add.rectangle(0, h_window-50, w_window, 1);

            this.speed = 6.3;
            this.maxSpeed = 10;

            //this.back_bonus.alpha = 0;

            //PLATEFORMS
            platforms = game.add.group();
            platforms.enableBody = true;
            var ground = platforms.create(w_window / 6, h_window - 90, 'vide');
            ground.body.immovable = true;

            //ROCKS
            this.rocks = game.add.group();
            this.rocks.enableBody = true;
            this.rocks.createMultiple(50, 'rock');

            //CUBES BONUS
            this.bonuss = game.add.group();
            this.bonuss.enableBody = true;
            this.bonuss.createMultiple(10, 'cube');

            // var rdmTime = Math.max(Math.random()*1000 + easy, 1000);
            // console.log(rdmTime);
            // this.timer = game.time.events.loop(rdmTime, this.addRowOfrocks, this);

            //PLAYER
            this.dude = this.game.add.sprite(w_window / 6, h_window - 84 - 90, 'dude');
            game.physics.enable(this.dude, Phaser.Physics.ARCADE);
            this.dude.enableBody = true;
            this.dude.animations.add('run', [0, 1, 2, 3, 4, 5, 6, 7], 12, true);
            this.dude.animations.add('space', [8, 9], 10, true);

            //KEYS
            this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
            this.escapeKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
            this.mouseDown = this.game.input.mousePointer;

            //DOUBLE SAUT
            this.compteNbSaut = 0;

            //MUSIC
            this.die = game.add.audio('die');
            this.music = this.game.add.audio('ost', true);
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

            var dif = Math.random();
            var dif2 = Math.random()*10;
            easy = 0.989;
            //var dif2 = Math.random(0,2);
            //console.log(dif2);


            if (dif > easy) {
                this.addRowOfrocks();
                //console.log('condition : ' + dif + ' > ' + easy)
            }

            if (total > 100) {
                if (dif2 < 0.01) {
                    this.addRowOfBonuss();
                };
            }

            if (this.speed < this.maxSpeed)
                this.speed += 0.0015;



            this.ground.tilePosition.x -= this.speed;
            this.stars.tilePosition.x -= 0.1 * (this.speed/10);
            this.back_02.tilePosition.x -= 0.2 * (this.speed/10);
            this.back_03.tilePosition.x -= 0.3 * (this.speed/10);
            this.back_04.tilePosition.x -= 0.4 * (this.speed/10);
            for (var i in this.rocks.children) {
                this.rocks.children[i].body.x -= this.speed;
            };
            for (var i in this.bonuss.children) {
                this.bonuss.children[i].body.x -= this.speed;
            };



            // Double saut

            if (this.compteNbSaut < 2) {
                if (this.spaceKey.isDown || this.upKey.isDown) {
                    if (this.spaceKey.downDuration(5) || this.upKey.downDuration(5)) {
                        this.compteNbSaut = this.compteNbSaut + 1;
                        game.physics.arcade.enable(this.dude);
                        this.dude.body.gravity.y = 2000;
                        this.dude.body.velocity.y = -800;
                    }
                }

            }
            /*if (this.mouseDown.isDown) {
                this.compteNbSaut = this.compteNbSaut + 1;
                game.physics.arcade.enable(this.dude);
                this.dude.body.gravity.y = 1600;
                this.dude.body.velocity.y = -600;
            }*/

            game.input.onDown.add(function () {
                if (this.compteNbSaut < 2) {
                    this.compteNbSaut = this.compteNbSaut + 1;
                    game.physics.arcade.enable(this.dude);
                    this.dude.body.gravity.y = 2000;
                    this.dude.body.velocity.y = -800;
                    this.stop();
                    console.log(this.compteNbSaut);
                }
            }, this);


            if (this.dude.body.velocity.y !== 0) {
                this.dude.play('space');
            } else {
                this.dude.play('run');
                this.compteNbSaut = 0;
            }
            if (this.dude.inWorld === false) {
                this.restartGame();
            }
            
            

            if (bonus>0) {
                //this.back_bonus.alpha = 1;
                this.back.tint = 0xb5ff70;
                bonus -= 0.02;
                game.debug.text('INVISIBLE MODE : ' + parseInt(bonus), 32, 62 * 1.5);
            } else {
                this.back.tint = 0x70cfff;
                this.collides(this.rocks, this.dude);
            };
            
            this.collidesBonus(this.bonuss, this.dude);

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
            this.addOnerock(w_window, h_window - 57 - 90);
        },

        addOneBonus: function (x, y) {
            // Get the first dead rock of our group
            var cube = this.bonuss.getFirstDead();

            // Set the new position of the rock
            cube.reset(x, y);

            // Add velocity to the rock to make it move left
            //rock.body.velocity.x = 0;
            //rock.body.velocity.y = 0;

            // Kill the rock when it's no longer visible
            cube.checkWorldBounds = true;
            cube.outOfBoundsKill = true;
            cube.body.immovable = true;

            //this.rocks.push(rock);
        },
        addRowOfBonuss: function () {
            this.addOneBonus(w_window, h_window - 157 - 90);
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
        },

        collidesBonus: function (a, b) {
            var collision = game.physics.arcade.overlap(a, b);
            if (collision) {
                bonus += 0.5;
            }
        }


    };

    game.state.add('main', mainState);
    game.state.start('main');

};