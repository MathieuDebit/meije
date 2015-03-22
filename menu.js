// main.js

var h_window = window.innerHeight;
var w_window = window.innerWidth;

var game = new Phaser.Game(w_window, h_window, Phaser.AUTO, 'gameDiv');

// RESPONSIVE
$(window).resize(function () {
    display.resizer();
});

var image;
var n = 0;
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
    preload: function () {
        game.load.image('einstein', 'assets/dude.png');
    },
    create: function () {
        image = game.add.sprite(0, 0, 'einstein');
        image.inputEnabled = true;
        image.events.onInputDown.add(this.listener, this);
    },
    update: function () {},


    listener: function () {
                n++;
        console.log(n);
    }
};

game.state.add('main', mainState);
game.state.start('main');