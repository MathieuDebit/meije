// drapeau tous les 100 pts
// add description menu and tuto
// node-webkit + cordova



var overlay = document.getElementById('overlay'),
    start_button = overlay.firstElementChild;

var unefois = true;
document.onkeydown = function (event) {
    var key_press = String.fromCharCode(event.keyCode);
    var key_code = event.keyCode;

    if (key_code == 32 && unefois) {
        start_button.onclick();
    }

}

start_button.onclick = function () {
    unefois = false;
    overlay.style.display = "none";

    $(function () {
        $("#pauseButton").data("paused", false).click(function () {
            $(this).data("paused", !$(this).data("paused"));
            if ($(this).data("paused")) {
                game.paused = true;
                $(this).css('background-position', '94px');
            } else {
                game.paused = false;
                $(this).css('background-position', 'right');
            }
        })
    });









    // PHAZER -- BEGIN
    // main.js

    var easy = 1;
    var bonus = 0;

    var h_window = window.innerHeight,
        w_window = window.innerWidth;

    //    var isOn = true;

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
            this.game.load.spritesheet('dude', 'assets/hex_run.png', 69, 81);

            // SOL
            this.game.load.image('ground', 'assets/hex_ground.png');


            // OBSTACLES
            this.game.load.image('rock', 'assets/hex_obs_1.png');
            this.game.load.image('rock2', 'assets/hex_obs_2.png');
            this.game.load.image('rock3', 'assets/hex_obs_3.png');
            this.game.load.image('three', 'assets/hex_obs_4.png');
            this.game.load.spritesheet('cube', 'assets/hex_bonus.png', 46, 40);
            //            this.game.load.spritesheet('cube', 'assets/hex_bonus.png',23,20);

            // BACKGROUND
            this.game.load.image('vide', 'assets/empty.png');
            this.game.load.image('sky', 'assets/hex_sky.png');
            this.game.load.image('sun', 'assets/hex_sun.png');
            this.game.load.image('sky_night', 'assets/hex_night.png');
            this.game.load.image('moon', 'assets/hex_moon.png');
            this.game.load.image('sky_cloud', 'assets/hex_sky_cloud.png');

            this.game.load.image('m_1', 'assets/hex_m_1.png');
            this.game.load.image('m_2', 'assets/hex_m_2.png');
            this.game.load.image('m_3', 'assets/hex_m_3.png');
            this.game.load.image('pp', 'assets/hex_premierPlan.png');

            // BUTTONS
            this.game.load.spritesheet('buttons', 'assets/hex_buttons.png', 47, 30);

            //SOUND
            this.game.load.audio('die', ['assets/trumpette.mp3', 'assets/trumpette.ogg']);
            this.game.load.audio('ost', ['assets/meije_ost_part_A.mp3']);
            this.game.load.audio('ostbonus', ['assets/meije_ost_part_B.mp3']);
            this.game.load.audio('bonus', ['assets/meije_sound_bonus.mp3']);

            this.game.load.image('sound_button', 'Mouton_du_tonerre/mouton32.png')

            this.game.load.spritesheet('flag', 'assets/fire.png', 97, 130);


            this.game.load.image('overlay', 'assets/overlay.png');

            this.game.load.image('bar', 'assets/hex_bar.png');
            this.game.load.image('bar_bottom', 'assets/hex_bar_bottom.png');


        },









        ///////////////////////////////////////////////
        //
        //          CREATE FONCTION
        //
        ///////////////////////////////////////////////

        create: function () {

            //            this.game.add.plugin(Phaser.Plugin.Debug);
            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            this.speed = 6.3;
            this.maxSpeed = 10;

            this.game.stage.backgroundColor = "b9c5be";

            // BACKGROUND
            this.sky = game.add.sprite(32, 32, 'sky');
            this.sky.y = h_window - 47 - 367;
            this.sky.x = 0;
            this.sky.height = 367;
            this.sky.width = w_window;
            this.sky.smoothed = false;



            this.sky_night = game.add.sprite(32, 32, 'sky_night');
            this.sky_night.y = h_window - 47 - 367;

            this.sky_night.x = 0;
            this.sky_night.height = 367;
            this.sky_night.width = w_window;
            this.sky_night.smoothed = false;
            this.sky_night.alpha = 0;

            this.sun = this.game.add.tileSprite(230, 175, 153, 153, 'sun');
            this.moon = this.game.add.tileSprite(230, 175, 153, 153, 'moon');

            this.m_3 = this.game.add.tileSprite(0, h_window - 175 - 47, w_window, 376, 'm_3');
            this.sky_cloud = this.game.add.tileSprite(0, 150, w_window, 367, 'sky_cloud');

            this.m_2 = this.game.add.tileSprite(0, h_window - 175 - 47, w_window, 376, 'm_2');
            this.m_1 = this.game.add.tileSprite(0, h_window - 217 - 47, w_window, 376, 'm_1');
            this.vide = this.game.add.tileSprite(w_window, h_window - 139, 'vide');
            this.ground = this.game.add.tileSprite(0, h_window - 47, w_window, 91, 'ground');
            this.bar = game.add.tileSprite(0, 0, w_window, 50, 'bar');
            this.bar_bottom = game.add.tileSprite(0, 50, w_window, 5, 'bar_bottom');


            //PLATEFORMS
            platforms = game.add.group();
            platforms.enableBody = true;
            var ground = platforms.create(w_window / 6, h_window - 47, 'vide');
            ground.body.immovable = true;

            //ROCKS
            this.rocks = game.add.group();
            this.rocks.enableBody = true;
            this.rocks.createMultiple(1, 'rock');

            //THREES
            this.threes = game.add.group();
            this.threes.enableBody = true;
            this.threes.createMultiple(10, 'three');

            //CUBES BONUS
            this.bonuss = game.add.group();
            this.bonuss.enableBody = true;
            this.bonuss.createMultiple(10, 'cube');

            // BUTTONS VOLUME
            this.soundButton = this.game.add.sprite(w_window - 140, 10, 'buttons');
            this.soundButton.animations.add('volumeOn', [1]);
            this.soundButton.animations.add('volumeOff', [0]);
            this.soundButton.inputEnabled = true;


            this.sound.volume = localStorage.getItem("soundVolume");
            this.soundButton.events.onInputDown.add(soundButton, this);

            function soundButton() {
                if (this.sound.volume == 0) {
                    this.sound.volume = 1;
                    this.soundButton.play('volumeOn');
                    localStorage.setItem("soundVolume", this.sound.volume);
                } else {
                    this.sound.volume = 0;
                    this.soundButton.play('volumeOff');
                    localStorage.setItem("soundVolume", this.sound.volume);
                }
            }

            if (this.sound.volume == 0) {
                this.soundButton.play('volumeOff');
            } else {
                this.soundButton.play('volumeOn');
            }







            document.onkeydown = function (event) {
                var key_press = String.fromCharCode(event.keyCode);
                var key_code = event.keyCode;

                if (key_code == 80) {
                    if (game.paused) {
                        game.paused = false;
                    } else {
                        game.paused = true;
                    };
                }

            }

            //PLAYER
            this.dude = this.game.add.sprite(w_window / 6, h_window - 81 - 47, 'dude');
            game.physics.enable(this.dude, Phaser.Physics.ARCADE);
            this.dude.enableBody = true;
            this.dude.animations.add('run', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 16, true);
            this.dude.animations.add('space', [10, 11], 10, true);



            //KEYS
            this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
            this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
            this.escapeKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
            this.mouseDown = this.game.input.mousePointer;
            this.volumeKey = this.game.input.keyboard.addKey(Phaser.Keyboard.V);



            //DOUBLE SAUT
            this.compteNbSaut = 0;

            //MUSIC
            this.die = game.add.audio('die');

            this.music = this.game.add.audio('ost', true);
            this.music.loop = true;
            this.music.play();

            this.musicBonus = this.game.add.audio('ostbonus', true);
            this.musicBonus.loop = true;
            this.musicBonus.play();

            this.bruitBonus = this.game.add.audio('bonus', true);
            this.synchMusic = false;

            //FLAG
            this.flags = game.add.group();
            this.flags.enableBody = true;
            this.flags.createMultiple(10, 'flag');

            this.pp = this.game.add.tileSprite(0, h_window - 130, w_window, 130, 'pp');

            this.text_score = game.add.text(20, 15, "Score", {
                font: "16px Helvetica",
                fill: "#ffffff",
                align: "left",
            });
            this.text_highscore = game.add.text(150, 15, "Highscore", {
                font: "16px Helvetica",
                fill: "#ffffff",
                align: "left",
            });
            this.text_bonus = game.add.text(w_window / 2, 15, "", {
                font: "16px Helvetica",
                fill: "#ffffff",
                align: "center",
            });

        },









        ///////////////////////////////////////////////
        //
        //          UPDATE FONCTION
        //
        ///////////////////////////////////////////////

        update: function () {

            game.physics.arcade.collide(this.dude, platforms);

            if ((!this.synchMusic) && (this.music.currentTime == 0) && (total > 5)) {
                this.musicBonus.play();
                console.log(this.music.currentTime);
                console.log(this.musicBonus.currentTime);
                this.synchMusic = true;
            }

            if (localStorage.getItem("highscore")) {
                highscore = localStorage.getItem("highscore");
            }


            this.bar.tilePosition.x += 1;
            this.bar.tilePosition.y += 1;

            var rand = game.rnd.integerInRange(1, 3);
            var dif = Math.random();
            var dif_b = Math.random();
            var dif_c = Math.random();
            var dif2 = Math.random() * 10;
            easy = 0.992;


            if (dif > easy) {
                this.addRowOfrocks();
                if (rand == 1) {
                    this.rocks.createMultiple(1, 'rock2');
                } else if (rand == 2) {
                    this.rocks.createMultiple(1, 'rock');
                } else {
                    this.rocks.createMultiple(1, 'rock3');
                }
            }

            if (dif_b > easy + 0.009) {
                this.addRowOfThrees();
            }

            if (dif_c > easy + 0.007) {
                this.addRowOfFlags();
            }

            if (total > 100) {
                if (dif2 < 0.01) {
                    this.addRowOfBonuss();
                };
            }


            if (this.speed < this.maxSpeed)
                this.speed += 0.0015;

            this.ground.tilePosition.x -= this.speed;
            this.sky_cloud.tilePosition.x -= 0.23 * (this.speed / 10);

            this.m_3.tilePosition.x -= 0.2 * (this.speed / 10);
            this.m_2.tilePosition.x -= 0.3 * (this.speed / 10);
            this.m_1.tilePosition.x -= 0.4 * (this.speed / 10);
            this.pp.tilePosition.x -= this.speed * 1.5;
            for (var i in this.rocks.children) {
                this.rocks.children[i].body.x -= this.speed;
            };
            for (var i in this.bonuss.children) {
                this.bonuss.children[i].body.x -= this.speed;
            };
            for (var i in this.flags.children) {
                this.flags.children[i].body.x -= this.speed;
            };
            for (var i in this.threes.children) {
                this.threes.children[i].body.x -= this.speed;
            };


            if (this.volumeKey.isDown) {
                if (this.sound.volume == 0) {
                    soundVolume = this.sound.volume = 1;
                    console.log('soundVolume : ' + soundVolume);
                } else {
                    soundVolume = this.sound.volume = 0;
                }
                this.stop;
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

            game.input.onDown.add(zoneClick, this);

            function zoneClick(pointer) {
                if (pointer.y > 100) {
                    if (this.compteNbSaut < 2) {
                        this.compteNbSaut = this.compteNbSaut + 1;
                        game.physics.arcade.enable(this.dude);
                        this.dude.body.gravity.y = 2000;
                        this.dude.body.velocity.y = -800;
                        this.stop();
                        console.log(this.compteNbSaut);
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

            if (bonus > 0) {
                this.moon.alpha = 1;
                this.sky_night.alpha = 1;
                bonus -= 0.02;
                this.text_bonus.visible = true;
                this.text_bonus.setText("MODE INVINCIBLE : " + parseInt(bonus));
                this.game.stage.backgroundColor = "b9c5be";

                this.game.stage.backgroundColor = "141f34";
                this.dude.alpha = 0.5;
                this.sun.alpha = 0;
                this.moon.alpha = 1;
                this.sky_night.alpha = 1;
            } else {

                this.game.stage.backgroundColor = "b9c5be";
                this.text_bonus.visible = false;
                                this.collides(this.rocks, this.dude);
                                this.collidesThrees(this.threes, this.dude);
                                this.collidesFires(this.flags, this.dude);

                this.dude.alpha = 1;
                this.sky_night.alpha=0;
                this.music.volume = 1;
                this.musicBonus.volume = 0;
                this.moon.alpha = 0;
                this.sky_night.alpha = 0;
                this.sun.alpha = 1;
            }

            this.collidesBonus(this.bonuss, this.dude);


            // SCORE
            total += 0.1;
            this.text_score.setText("Score : " + parseInt(total));
            this.text_highscore.setText("Highscore : " + parseInt(highscore));





        },









        ///////////////////////////////////////////////
        //
        //          ADD OBSTACLES + BONUS
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
            this.addOnerock(w_window, h_window - 50 - 47);
        },

        addOneThree: function (x, y) {
            // Get the first dead rock of our group
            var three = this.threes.getFirstDead();

            // Set the new position of the rock
            three.reset(x, y);

            // Add velocity to the rock to make it move left
            //rock.body.velocity.x = 0;
            //rock.body.velocity.y = 0;

            // Kill the rock when it's no longer visible
            three.checkWorldBounds = true;
            three.outOfBoundsKill = true;
            three.body.immovable = true;

            //this.rocks.push(rock);
        },
        addRowOfThrees: function () {
            this.addOneThree(w_window, h_window - 88 - 47);
        },

        addOneBonus: function (x, y) {
            // Get the first dead rock of our group
            this.cube = this.bonuss.getFirstDead();

            // Set the new position of the rock
            this.cube.reset(x, y);

            // Add velocity to the rock to make it move left
            //rock.body.velocity.x = 0;
            //rock.body.velocity.y = 0;

            // Kill the rock when it's no longer visible
            this.cube.checkWorldBounds = true;
            this.cube.outOfBoundsKill = true;
            this.cube.body.immovable = true;

            //this.rocks.push(rock);
        },
        addRowOfBonuss: function () {
            this.addOneBonus(w_window, h_window - 157 - 90);
        },

        addOneFlag: function (x, y) {
            // Get the first dead rock of our group
            this.flag = this.flags.getFirstDead();

            // Set the new position of the rock
            this.flag.reset(x, y);

            // Add velocity to the rock to make it move left
            //rock.body.velocity.x = 0;
            //rock.body.velocity.y = 0;

            // Kill the rock when it's no longer visible
            this.flag.checkWorldBounds = true;
            this.flag.outOfBoundsKill = true;
            this.flag.body.immovable = true;
            this.flag.body.setSize(97, 30, 0, 100);
            this.flag.animations.add('anim', [0, 1, 2], 14, true);
            this.flag.play('anim');

            //this.rocks.push(rock);
        },
        addRowOfFlags: function () {
            this.addOneFlag(w_window, h_window - 47 - 130);
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
            this.musicBonus.stop();
            this.sound.volume = soundVolume;
        },









        ///////////////////////////////////////////////
        //
        //          COLLIDE FONCTION
        //
        ///////////////////////////////////////////////

        collides: function (a, b) {
            var collision = game.physics.arcade.collide(a, b);
            if (collision) {
                this.restartGame();
            }
        },
        collidesThrees: function (a, b) {
            var collision = game.physics.arcade.collide(a, b);
            if (collision) {
                this.restartGame();
            }
        },
        collidesFires: function (a, b) {
            var collision = game.physics.arcade.collide(a, b);
            if (collision) {
                this.restartGame();
            }
        },
        collidesBonus: function (a, b) {
            var collision = game.physics.arcade.overlap(a, b);
            if (collision) {
                var isCollide = true;
                if (isCollide) {

                    this.bruitBonus.play();
                    this.bruitBonus.volume = 0.8;
                    this.music.volume = 0;
                    this.musicBonus.volume = 1;
                    bonus = 10;
                    isCollide = false;
                    this.cube.destroy();
                }
            }
        }


    };

    game.state.add('main', mainState);
    game.state.start('main');

};