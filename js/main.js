
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
var stars;
var bg;
var music;
var starCount = 3;
var droidCount = 15;
var droids;
var text;
var style;
var paused = false;

function create() {
    
    style = { font: "36px Arial", fill: "#fff", boundsAlignH: "right", boundsAlignV: "middle" };
    
    starCollisionGroup = game.add.physicsGroup();
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
    
    stars = game.add.physicsGroup();
    droids = game.add.group();
    droids.enableBody = true;
    droids.physicsBodyType = Phaser.Physics.ARCADE;

    player = game.add.sprite(32, 32, 'dude');
    player.scale.setTo(0.5, 0.5);
    
    game.physics.enable(player, Phaser.Physics.ARCADE);
    var star = stars.create(325, 975, 'starBig');
    star.body.colliderWorldBounds = true;
    star.body.immovable = true;
    star = stars.create(950, 750, 'starBig');
    star.body.colliderWorldBounds = true;
    star.body.immovable = true;
    star = stars.create(250, 950, 'starBig');
    star.body.colliderWorldBounds = true;
    star.body.immovable = true;
    
    for (var i = 0; i < droidCount; i++)
    {
        var droid = droids.create(game.rnd.between(50, 1024), game.rnd.between(300, 1024), 'droid');
        droid.body.collideWorldBounds = true;
        var j = game.rnd.between(0, 3);
        switch (j)
        {
            case 0:
                droid.body.velocity.y = 100;
                break;
            case 1:
                droid.body.velocity.y = -100;
                break;
            case 2:
                droid.body.velocity.x = 100;
                break;
            default:
                droid.body.velocity.x = -100;
                break;
        }
    }
    
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

    text = game.add.text(0, 0, "Stars left: " + starCount + "!", style);
    text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
    text.fixedToCamera = true;
}

function update() {

    if (!music.isPlaying) {
        music.play();
    }
    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(player, stars, collect, null, this);
    game.physics.arcade.collide(droids, layer);
    game.physics.arcade.collide(droids, player, AI, null, this);
    game.physics.arcade.collide(droids, droids);

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    
    if (!paused)
    {
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
    
    
    for (var i = 0; i < droidCount; i++)
    {
        //texts[i].text = droids.children[i].body.velocity;
        if (paused)
        {
            droids.children[i].body.velocity.x = 0;
            droids.children[i].body.velocity.y = 0;
            continue;
        }
        
        if (droids.children[i].body.velocity.x != 100 && droids.children[i].body.velocity.y != 100 && droids.children[i].body.velocity.x != -100 && droids.children[i].body.velocity.y != -100)
        {
            droids.children[i].body.velocity.x = 0;
            droids.children[i].body.velocity.y = 0;
            var j = game.rnd.between(0, 3);
            switch (j)
            {
                case 0:
                    droids.children[i].body.velocity.y = 100;
                    break;
                case 1:
                    droids.children[i].body.velocity.y = -100;
                    break;
                case 2:
                    droids.children[i].body.velocity.x = 100;
                    break;
                default:
                    droids.children[i].body.velocity.x = -100;
                    break;
            }
        }
    }
    
}

function AI(droid, layer)
{
    text.fontSize = 72;
    text.fontWeight = "bold";
    text.fixedToCamera = false;
    text.anchor.set(0.5);
    text.x = game.camera.x + game.camera.width / 2;
    text.y = game.camera.y + game.camera.height / 2;
    text.text = "YOU LOST!";
    paused = true;
}

function collect(player, star)
{
    star.destroy();
    starCount--;
    if (starCount == 0)
    {
        text.fontSize = 72;
        text.fontWeight = "bold";
        text.anchor.set(0.5);
        text.fixedToCamera = false;
        text.x = game.camera.x + game.camera.width / 2;
        text.y = game.camera.y + game.camera.height / 2;
        text.text = "YOU WON!";
        paused = true;
    }
    else
        text.text = "Stars left: " + starCount + "!";
}

function render () {

    //droids.forEachAlive(rendergroup, this);
    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);

}

/*function rendergroup (member)
{
    game.debug.body(member);
}*/