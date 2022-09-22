var worldX = 8
var worldY = 8
var maxDist = 8
const worldCellSize = 50
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
    fov: 120,
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
    stroke(0)
    for (let x = 0; x < worldX; x++) {
        for (let y = 0; y < worldY; y++) {
            fill(255)
            if (world[y * worldX + x] == 1) fill(0)
            square(x * 50, y * 50, 50)
        }
    }
}

function castRay() {
    var ra = player.a - (player.fov / 2 * Math.PI / 180)
    mapX = Math.floor(player.x / worldCellSize)
    mapY = Math.floor(player.y / worldCellSize)
    var rx = player.x
    var ry = player.y
    for (let i = -player.fov / 2; i < player.fov / 2; i++) {
        mapX = Math.floor(player.x / worldCellSize)
        mapY = Math.floor(player.y / worldCellSize)
        var rayDirX = Math.cos(ra)
        var rayDirY = Math.sin(ra)
        deltaDistX = Math.sqrt(1 + (rayDirY * rayDirY) / (rayDirX * rayDirX))
        deltaDistY = Math.sqrt(1 + (rayDirX * rayDirX) / (rayDirY * rayDirY))
        var stepX, stepY, side
        var hit = 0
        var beginingSideX, beginingSideY, perpWallDist

        //calculate step and initial sideDist
        if (rayDirX < 0) {
            stepX = -1;
            sideDistX = (player.x / worldCellSize - mapX) * deltaDistX;
            beginingSideX = sideDistX
        } else {
            stepX = 1;
            sideDistX = (mapX + 1 - player.x / worldCellSize) * deltaDistX;
            beginingSideX = sideDistX
        }
        if (rayDirY < 0) {
            stepY = -1;
            sideDistY = (player.y / worldCellSize - mapY) * deltaDistY;
            beginingSideY = sideDistY
        } else {
            stepY = 1;
            sideDistY = (mapY + 1 - player.y / worldCellSize) * deltaDistY;
            beginingSideY = sideDistY
        }
        while (hit == 0) {
            //jump to next map square, either in x-direction, or in y-direction
            if (sideDistX < sideDistY) {
                sideDistX += deltaDistX;
                mapX += stepX;
                side = 0;
            } else {
                sideDistY += deltaDistY;
                mapY += stepY;
                side = 1;
            }
            //Check if ray has hit a wall
            if (world[mapY * worldX + mapX] > 0) hit = 1;
        }
        if (side == 0) perpWallDist = (sideDistX - deltaDistX);
        else perpWallDist = (sideDistY - deltaDistY);
        circle(player.x + rayDirX * perpWallDist * worldCellSize, player.y + rayDirY * perpWallDist * worldCellSize, 5)
            // beginShape();
            // vertex(player.x, player.y);
            // vertex(player.x, player.y);
            // vertex(player.x + rayDirX * perpWallDist * worldCellSize, player.y + rayDirY * perpWallDist * worldCellSize);
            // vertex(player.x + rayDirX * perpWallDist * worldCellSize, player.y + rayDirY * perpWallDist * worldCellSize);
            // endShape(CLOSE);
        ra += Math.PI * 2 / 360
        drawWallLine(i, Math.cos(player.a - ra) * perpWallDist)
    }
}

function drawWallLine(pos, dist) {
    noStroke()
    fill(255 - (dist * 255 / 5))
    var height = windowHeight / dist
    console.log(dist)
        //rect(windowWidth / 2 + pos * 10, (windowHeight - (8 - dist) * 100) / 2, 10, (8 - dist) * 100)
    rect(windowWidth / 2 + pos * 10, -height / 2 + windowHeight / 2, 10, height)
}