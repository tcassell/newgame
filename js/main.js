
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('level1', 'assets/games/starstruck/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles-1', 'assets/games/starstruck/tiles-1.png');
    game.load.spritesheet('dude', 'assets/topdown-sheet3.png', 150, 117);
    game.load.spritesheet('droid', 'assets/games/starstruck/droid.png', 32, 32);
    game.load.image('starSmall', 'assets/games/starstruck/star.png');
    game.load.image('starBig', 'assets/games/starstruck/star2.png');
    game.load.image('background', 'assets/sand.png');
    game.load.audio('music', 'assets/music.wav')

}

var map;
var tileset;
var layer;
var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
//var jumpButton;
var bg;
var music;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#000000';

    bg = game.add.tileSprite(0, 0, 1200, 1200, 'background');
    //bg.fixedToCamera = true;

    map = game.add.tilemap('level1');

    map.addTilesetImage('tiles-1');

    map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);

    layer = map.createLayer('Tile Layer 1');

    //  Un-comment this on to see the collision tiles
    // layer.debug = true;

    layer.resizeWorld();

    player = game.add.sprite(32, 32, 'dude');
    player.scale.setTo(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    
    player.body.collideWorldBounds = true;
    player.body.setSize(56, 48, 20, 35);

    player.animations.add('down', [1, 2, 3, 4, 5, 6], 10, true);
    player.animations.add('up', [8, 9, 10, 11, 12, 13], 10, true);
    player.animations.add('left', [15, 16, 17, 18, 19, 20], 10, true);
    player.animations.add('right', [22, 23, 24, 25, 26, 27], 10, true);

    game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();
    
    //music = new Phaser.Sound(game, 'music', 1, true);
    music = game.add.audio('music');
    //music.loop = true;
    music.play();

}

function update() {

    if (!music.isPlaying) {
        music.play();
    }
    game.physics.arcade.collide(player, layer);

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;

        if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;

        if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else if (cursors.down.isDown)
    {
        player.body.velocity.y = 150;

        if (facing != 'down')
        {
            player.animations.play('down');
            facing = 'down';
        }
    }
    else if (cursors.up.isDown)
    {
        player.body.velocity.y = -150;

        if (facing != 'up')
        {
            player.animations.play('up');
            facing = 'up';
        }
    }
    else
    {
        if (facing != 'idle')
        {
            player.animations.stop();

            if (facing == 'left')
            {
                player.frame = 14;
            }
            else if (facing == 'right')
            {
                player.frame = 21;
            }
            else if (facing == 'down')
            {
                player.frame = 0;
            }
            else
            {
                player.frame = 7;
            }

            facing = 'idle';
        }
    }
}

function render () {

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);

}
