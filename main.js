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
                document.getElementById('pauseButton').innerHTML = '<i class="icon-play">';
            } else {
                game.paused = false;
                document.getElementById('pauseButton').innerHTML = '<i class="icon-pause">';
            }
        })
    });
    $(function () {
        $("#volumeButton").data("mute", false).click(function () {
            $(this).data("mute", !$(this).data("mute"));
            if ($(this).data("mute")) {

                document.getElementById('volumeButton').innerHTML = '<i class="icon-volume-off">';
                console.log("mute on");
            } else {

                document.getElementById('volumeButton').innerHTML = '<i class="icon-volume">';
                console.log("mute off");
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
            this.game.load.image('cube', 'assets/hex_bonus.png');
            //            this.game.load.spritesheet('cube', 'assets/hex_bonus.png',23,20);

            // BACKGROUND
            this.game.load.image('vide', 'assets/empty.png');
            this.game.load.image('sky', 'assets/hex_sky.png');
            this.game.load.image('m_1', 'assets/hex_m_1.png');
            this.game.load.image('m_2', 'assets/hex_m_2.png');
            this.game.load.image('m_3', 'assets/hex_m_3.png');
            this.game.load.image('pp', 'assets/hex_premierPlan.png');

            //SOUND
            this.game.load.audio('die', ['assets/trumpette.mp3', 'assets/trumpette.ogg']);
            this.game.load.audio('ost', ['assets/meije_ost_part_A.mp3']);
            this.game.load.audio('ostbonus', ['assets/meije_ost_part_B.mp3']);
            this.game.load.audio('bonus', ['assets/meije_sound_bonus.mp3']);

            this.game.load.spritesheet('flag', 'assets/hex_flag.png', 104, 120);


            this.game.load.image('overlay', 'assets/overlay.png');

        },

        ///////////////////////////////////////////////
        //
        //          CREATE FONCTION
        //
        ///////////////////////////////////////////////

        create: function () {
            this.game.add.plugin(Phaser.Plugin.Debug);

            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            this.game.stage.backgroundColor = "b9c5be";

            this.sky = game.add.sprite(32, 32, 'sky');
            this.sky.x = 0;
            this.sky.y = 0;
            this.sky.height = h_window;
            this.sky.width = w_window;
            this.sky.smoothed = false;
            this.m_3 = this.game.add.tileSprite(0, h_window - 175 - 47, w_window, 376, 'm_3');
            this.m_2 = this.game.add.tileSprite(0, h_window - 175 - 47, w_window, 376, 'm_2');
            this.m_1 = this.game.add.tileSprite(0, h_window - 217 - 47, w_window, 376, 'm_1');
            this.vide = this.game.add.tileSprite(w_window, h_window - 139, 'vide');
            this.ground = this.game.add.tileSprite(0, h_window - 47, w_window, 91, 'ground');

            //FLAG
            //            this.flag = this.game.add.sprite('flag');
            //            this.flag.animations.add('anim', [0, 1, 2], 14, true);


            this.speed = 6.3;
            this.maxSpeed = 10;

            //this.back_bonus.alpha = 0;

            //PLATEFORMS
            platforms = game.add.group();
            platforms.enableBody = true;
            var ground = platforms.create(w_window / 6, h_window - 47, 'vide');
            ground.body.immovable = true;

            //ROCKS
            this.rocks = game.add.group();
            this.rocks.enableBody = true;
            this.rocks.createMultiple(1, 'rock');

            //CUBES BONUS
            this.bonuss = game.add.group();
            this.bonuss.enableBody = true;
            this.bonuss.createMultiple(100, 'cube');

            // var rdmTime = Math.max(Math.random()*1000 + easy, 1000);
            // console.log(rdmTime);
            // this.timer = game.time.events.loop(rdmTime, this.addRowOfrocks, this);

            //PLAYER
            this.dude = this.game.add.sprite(w_window / 6, h_window - 81 - 47, 'dude');
            game.physics.enable(this.dude, Phaser.Physics.ARCADE);
            this.dude.enableBody = true;
            this.dude.animations.add('run', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 16, true);
            this.dude.animations.add('space', [10, 11], 10, true);

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

            this.musicBonus = this.game.add.audio('ostbonus', true);
            this.musicBonus.loop = true;
this.musicBonus.play();

            this.bruitBonus = this.game.add.audio('bonus', true);



            this.pp = this.game.add.tileSprite(0, h_window - 130, w_window, 130, 'pp');

        },



        ///////////////////////////////////////////////
        //
        //          UPDATE FONCTION
        //
        ///////////////////////////////////////////////

        update: function () {
            //            console.log(parseInt(this.music.durationMS));

            //            console.log(this.music.currentTime);
            if ((parseInt(this.music.durationMS) == this.music.currentTime) && this.music.durationMS != 0) {
                console.log("goMusicBonus");
            }
            //            var delay = Timer(game, autoDestroy)
            //             console.log(delay);
            //            for (var i = 0; i <= delay; i = i + 0.000000000000001) {
            //                this.musicBonus.play();
            //
            //            }
            game.physics.arcade.collide(this.dude, platforms);

            if (localStorage.getItem("highscore")) {
                highscore = localStorage.getItem("highscore");
            }

            // var rdmTime = Math.max(Math.random()*1000 + easy, 1000);
            // console.log(rdmTime);
            // this.timer = game.time.events.loop(rdmTime, this.addRowOfrocks, this);



            var rand = game.rnd.integerInRange(1, 3);
            //            console.log(rand);
            var dif = Math.random();
            var dif2 = Math.random() * 10;
            easy = 0.989;
            //var dif2 = Math.random(0,2);
            //console.log(dif2);


            if (dif > easy) {
                this.addRowOfrocks();
                //console.log('condition : ' + dif + ' > ' + easy)

                if (rand == 1) {
                    this.rocks.createMultiple(1, 'rock2');
                } else if (rand == 2) {
                    this.rocks.createMultiple(1, 'rock');
                } else {
                    this.rocks.createMultiple(1, 'rock3');

                }
            }

            if (total > 100) {
                if (dif2 < 0.01) {
                    this.addRowOfBonuss();
                };
            }

            if (this.speed < this.maxSpeed)
                this.speed += 0.0015;

            this.ground.tilePosition.x -= this.speed;
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


            if (bonus > 0) {

                //this.back_bonus.alpha = 1;
                //this.back.tint = 0xb5ff70;
                bonus -= 0.02;
                game.debug.text('INVISIBLE MODE : ' + parseInt(bonus), 32, 62 * 1.5);

                this.dude.alpha = 0.5;

            } else {
                //this.back.tint = 0x70cfff;
                //                this.collides(this.rocks, this.dude);
                this.dude.alpha = 1;
                this.music.volume = 1;
                this.musicBonus.volume = 0;
            }



            this.collidesBonus(this.bonuss, this.dude);

            // SCORE
            total += 0.1;
            game.debug.text('Score : ' + parseInt(total), 32, 32);
            game.debug.text('High Score : ' + parseInt(highscore), 32, 32 * 1.5);


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