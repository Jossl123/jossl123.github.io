var worldX = 8
var worldY = 8
var maxDist = 8
var worldCellSize = 50
var world = [
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 1, 0, 0, 0, 0, 1,
    1, 0, 1, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 1, 0, 1,
    1, 0, 0, 1, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1,

]
var player = {
    x: 70,
    y: 100,
    a: 0,
    dx: Math.cos(0) * 5,
    dy: Math.sin(0) * 5,
    speed: 3
}

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    background(100);
    keyDown()
    drawWorld()
    drawPlayer()
    castRay()
}

function keyDown() {
    if (keyIsDown(LEFT_ARROW)) {
        player.a -= 0.1;
        if (player.a < 0) player.a += Math.PI * 2;
        player.dx = Math.cos(player.a) * player.speed;
        player.dy = Math.sin(player.a) * player.speed;
    } else if (keyIsDown(RIGHT_ARROW)) {
        player.a += 0.1;
        if (player.a > Math.PI * 2) player.a -= Math.PI * 2;
        player.dx = Math.cos(player.a) * player.speed;
        player.dy = Math.sin(player.a) * player.speed;
    }
    if (keyIsDown(UP_ARROW)) {
        player.y += player.dy;
        player.x += player.dx;
    } else if (keyIsDown(DOWN_ARROW)) {
        player.y -= player.dy;
        player.x -= player.dx;
    }
}

function drawPlayer() {
    fill(255, 0, 0)
    square(player.x - 5, player.y - 5, 10)
    beginShape();
    vertex(player.x, player.y);
    vertex(player.x, player.y);
    vertex(player.x + player.dx * 5, player.y + player.dy * 5);
    vertex(player.x + player.dx * 5, player.y + player.dy * 5);
    endShape(CLOSE);
}

function drawWorld() {
    for (let x = 0; x < worldX; x++) {
        for (let y = 0; y < worldY; y++) {
            fill(255)
            if (world[y * worldX + x] == 1) fill(0)
            square(x * 50, y * 50, 50)
        }
    }
}

function castRay() {
    for (let i = 0; i < 1; i++) {
        var d = 8
        if (player.a > Math.PI / 2 && player.a < 3 * Math.PI / 2) {
            var posInGrid = Math.floor(player.x / worldCellSize)
            d = Math.abs((player.x - posInGrid * worldCellSize) / Math.cos(player.a))

        } else if (player.a < Math.PI / 2 || player.a > 3 * Math.PI / 2) {
            var posInGrid = Math.floor(player.x / worldCellSize)
            d = Math.abs((player.x - (posInGrid + 1) * worldCellSize) / Math.cos(player.a))
        }

        // if (player.a > Math.PI) {
        //     var posInGrid = Math.floor(player.y / worldCellSize)
        //     d = Math.min(d, Math.abs((player.y - posInGrid * worldCellSize) / Math.cos(player.a)))

        // } else if (player.a < Math.PI) {
        //     var posInGrid = Math.floor(player.y / worldCellSize)
        //     d = Math.min(d, Math.abs((player.y - (posInGrid + 1) * worldCellSize) / Math.cos(player.a)))
        // }
        if (d > maxDist * worldCellSize) d = maxDist * worldCellSize
        beginShape();
        vertex(player.x, player.y);
        vertex(player.x, player.y);
        vertex(player.x + player.dx / player.speed * d, player.y + player.dy / player.speed * d);
        vertex(player.x + player.dx / player.speed * d, player.y + player.dy / player.speed * d);
        endShape(CLOSE);
    }
}