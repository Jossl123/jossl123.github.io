var worldX = 16
var worldY = 16
var maxDist = 16
const worldCellSize = 50
var imgWall
var imgSize = 236
var world = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1,
    1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
    1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1,
    1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1,
    1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1,
    1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
]
var player = {
    fov: 90,
    x: 70,
    y: 100,
    a: Math.PI / 2,
    dx: Math.cos(Math.PI / 2) * 5,
    dy: Math.sin(Math.PI / 2) * 5,
    speed: 1.4,
    rotateSpeed: 0.05
}

var lineWidth

function setup() {
    createCanvas(windowWidth, windowHeight);
    lineWidth = Math.floor(windowWidth / player.fov / 8)
    imgWall = loadImage('./img/backroomWall.jpg')
}

function draw() {
    background(100);
    keyDown()
        //drawPlayer()
    castRay()
        //drawWorld()
}

function keyDown() {
    if (keyIsDown(LEFT_ARROW) || keyIsDown(81)) {
        player.a -= player.rotateSpeed;
        if (player.a < 0) player.a += Math.PI * 2;
        player.dx = Math.cos(player.a) * player.speed;
        player.dy = Math.sin(player.a) * player.speed;
    } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
        player.a += player.rotateSpeed;
        if (player.a > Math.PI * 2) player.a -= Math.PI * 2;
        player.dx = Math.cos(player.a) * player.speed;
        player.dy = Math.sin(player.a) * player.speed;
    }
    if (keyIsDown(UP_ARROW) || keyIsDown(90)) {
        if (!isColliding(player.a)) {
            player.y += player.dy;
            player.x += player.dx;
        }
    }
    //else if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
    //     if (!isColliding(player.a + Math.PI / 2)) {
    //         player.y -= player.dy;
    //         player.x -= player.dx;
    //     }
    // }
}

function isColliding(a) {
    if (getWallDist(a)[0] < 0.1) return true
    return false
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
            square(x * worldCellSize, y * worldCellSize, worldCellSize)
        }
    }
}

function getWallDist(a) {
    mapX = Math.floor(player.x / worldCellSize)
    mapY = Math.floor(player.y / worldCellSize)
    var rayDirX = Math.cos(a)
    var rayDirY = Math.sin(a)
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
    if (side == 0) {
        perpWallDist = (sideDistX - deltaDistX);
    } else {
        perpWallDist = (sideDistY - deltaDistY)
    }
    return [perpWallDist, side, rayDirX, rayDirY]
}

function setGradient(c1, c2, height, width) {
    // noprotect
    noFill();
    for (var y = 0; y < height; y++) {
        var inter = map(y, 0, height, 0, 1);
        var c = lerpColor(c1, c2, inter);
        stroke(c);
        line(0, y, width, y);
    }
}

function castRay() {
    var ra = player.a - (player.fov / 2 * Math.PI / 180)
    fill(120, 108, 62)
    rect(0, 0, windowWidth, windowHeight / 2)
    setGradient(color(151, 136, 78), color(0, 0, 0))
        // fill(151, 136, 78)
        // rect(0, windowHeight / 2, windowWidth, windowHeight / 2)

    fill(0)
    rect(0, 0, windowWidth / 2 + (-player.fov * 4) * lineWidth, windowHeight)
    for (let i = -player.fov * 4; i < player.fov * 4; i++) {
        res = getWallDist(ra)
        res[2] *= res[0]
        res[3] *= res[0]
        perpWallDist = Math.cos(player.a - ra) * res[0]
        ra += (Math.PI * 2 / 360) / 8
        drawWallLine(i, perpWallDist, res[1], res[2], res[3])
    }
    fill(0)
    rect(windowWidth - (windowWidth / 2 + (-player.fov * 4) * lineWidth), 0, windowWidth / 2 + (-player.fov * 4) * lineWidth, windowHeight)

}
let wall = [
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 1, 1, 1, 0, 0,
    0, 0, 1, 1, 0, 0, 0, 0,
    0, 0, 1, 1, 1, 1, 0, 0,
    0, 0, 1, 1, 1, 1, 0, 0,
    0, 0, 0, 1, 0, 1, 0, 0
]
let wall2 = [
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 1, 1, 1, 1, 0, 0,
    0, 1, 1, 0, 0, 1, 1, 0,
    0, 1, 1, 0, 0, 1, 1, 0,
    0, 0, 0, 0, 0, 1, 1, 0,
    0, 0, 0, 0, 1, 1, 0, 0,
    0, 0, 0, 1, 1, 0, 0, 0,
    0, 0, 0, 1, 1, 0, 0, 0
]

function drawWallLine(pos, dist, facing, rayx, rayy) {
    noStroke()
    var height = (windowHeight / dist)
    var x = windowWidth / 2 + pos * lineWidth
    var y = -height / 2 + windowHeight / 2

    var offset
        // for (let i = 0; i < Math.sqrt(wall.length); i++) {
        //     var depth = clamp(1 - dist / maxDist - 0.1 * facing, 0, 1)
        //         //var offset = Math.floor((((player.y * !facing) + (player.x * facing) + (((rayy * !facing) || rayx * facing) * worldCellSize)) % worldCellSize) / (worldCellSize / Math.sqrt(wall.length)))
        //     var offset = (((player.y * !facing) + (player.x * facing) + (((rayy * !facing) || rayx * facing) * worldCellSize)) % worldCellSize)
        //         //chooseColor(i, offset, depth)
        //     image(imgWall, x, y, lineWidth, height, 236 * (offset / (worldCellSize + 1)) + 1, 0, lineWidth, 236)
        //     fill(0, 0, 0, 100 - depth * 100)
        //     rect(x, y + i * (height / Math.sqrt(wall.length)), lineWidth, height / Math.sqrt(wall.length) + 1)
        // }
    var depth = clamp(1 - dist / maxDist - 0.1 * facing, 0, 1)
        //var offset = Math.floor((((player.y * !facing) + (player.x * facing) + (((rayy * !facing) || rayx * facing) * worldCellSize)) % worldCellSize) / (worldCellSize / Math.sqrt(wall.length)))
    var offset = (((player.y * !facing) + (player.x * facing) + (((rayy * !facing) || rayx * facing) * worldCellSize)) % worldCellSize)
        //chooseColor(i, offset, depth)
    image(imgWall, x, y, lineWidth, height, imgSize * (offset / (worldCellSize + 1)) + 1, 0, lineWidth, imgSize)
    fill(0, 0, 0, 100 - depth * 100)
    rect(x, y, lineWidth, height)
}

function chooseColor(i, offset, depth) {
    var red = 181
    var green = 186
    var blue = 137
    if (wall[offset + i * Math.sqrt(wall.length)] == 0) fill(171 * depth, 150 * depth, 53 * depth)
    else fill(red * depth, green * depth, blue * depth)
}

const clamp = (number, min, max) =>
    Math.max(min, Math.min(number, max));