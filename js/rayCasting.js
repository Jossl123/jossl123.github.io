var worldX = 32
var worldY = 32
var maxDist = 16
const worldCellSize = 50
var imgWall
var frameNb = 4
var music
var world = [
        1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1,
        1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1,
        1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1,
        1, 0, 0, 3, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1,
        4, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1,
        1, 0, 1, 0, 2, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1,
        1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1,
        1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1,
        1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
        1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1,
        1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1,
        1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1,
        1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1,
        1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1,
        1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1,
        1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1,
        1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1,
        1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1,
        1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1,
        1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1,
        1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1
    ]
    //world = []
var player = {
    fov: 90,
    x: 70,
    y: 100,
    a: Math.PI / 2,
    dx: Math.cos(Math.PI / 2),
    dy: Math.sin(Math.PI / 2),
    speed: 2,
    rotateSpeed: 0.04
}
var enemy = {
    x: 400,
    y: 100
}

var verticalCameraOffset = 0

var lineWidth
var time = 0

function generateMap() {
    for (let x = 0; x < worldX; x++) {
        for (let y = 0; y < worldY; y++) {
            if (x == 0 || x == worldX - 1 || y == 0 || y == worldY - 1) world.push(1)
            else world.push(0)
        }
    }
    for (let i = 0; i < (worldX * worldY) / 2; i++) {
        var index = Math.floor(Math.random() * worldX * worldY)
        if (index != Math.floor(player.y) * worldX + Math.floor(player.x)) world[index] = Math.floor(Math.random() * 3) + 1
    }
}
//generateMap()

function setup() {
    createCanvas(windowWidth, windowHeight);
    lineWidth = Math.floor(windowWidth / player.fov / 8)
    imgWall = [loadImage('./img/backroomWall.jpg'), loadImage('./img/sang.png'), loadImage('./img/test.png'), loadImage('./img/light.png')]
    imgSize = [236, 1446, 200, 350]
    music = new Audio('./music/The_backroom_dance_Waka_Waka.mp3');
    music.loop = true;
}

function draw() {
    background(100);
    keyDown()
        //drawPlayer()
    castRay()
        //drawWorld()
    if (frameCount % 10 == 0) time = (time + 1) % frameNb
        //drawEnemy()
}

function drawEnemy() {
    var vy = enemy.y - player.y
    var vx = enemy.x - player.x
    var s = Math.sqrt(vx ** 2 + vy ** 2)
    vy /= s
    vx /= s
    var s2 = Math.sqrt(player.dy ** 2 + player.dx ** 2)
    var vx2 = player.dx / s2
    var vy2 = player.dy / s2
    var angle = Math.atan2(vy - vy2, vx - vx2) * (180 / Math.PI)
    console.log(angle)
}

function keyDown() {
    if (keyIsDown(17)) {
        player.speed = 5
    } else {
        player.speed = 2
    }
    if (keyIsDown(LEFT_ARROW) || keyIsDown(81)) {
        player.a -= player.rotateSpeed;
        if (player.a < 0) player.a += Math.PI * 2;
        player.dx = Math.cos(player.a);
        player.dy = Math.sin(player.a);
    } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
        player.a += player.rotateSpeed;
        if (player.a > Math.PI * 2) player.a -= Math.PI * 2;
        player.dx = Math.cos(player.a);
        player.dy = Math.sin(player.a);
    }
    if (keyIsDown(UP_ARROW) || keyIsDown(90)) {
        if (!isColliding(player.a)) {
            player.y += player.dy * player.speed;
            player.x += player.dx * player.speed;
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
    if (getWallDist(a)[0] < player.speed / 10) return true
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
var bodyElement = document.querySelector("body");
bodyElement.addEventListener("mousemove", getMouseDirection, false);
var oldX = -1;
var oldY = -1;

function getMouseDirection(e) {
    if (oldX == -1) {
        oldX = windowWidth / 2;
        oldY = windowHeight / 2;
    }
    var xMove = e.pageX - oldX;
    var yMove = e.pageY - oldY;
    oldX = e.pageX
    oldY = e.pageY
    verticalCameraOffset += yMove
    player.a += xMove / 10 * Math.PI / 180
    if (player.a < 0) player.a += Math.PI * 2;
    player.dx = Math.cos(player.a);
    player.dy = Math.sin(player.a);
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
    return [perpWallDist, side, rayDirX, rayDirY, world[mapY * worldX + mapX]]
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
    rect(0, 0, windowWidth, windowHeight / 2 - verticalCameraOffset)
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
        drawWallLine(i, perpWallDist, res[1], ra, res[2], res[3], res[4])
    }
    fill(0)
    rect(windowWidth - (windowWidth / 2 + (-player.fov * 4) * lineWidth), 0, windowWidth / 2 + (-player.fov * 4) * lineWidth, windowHeight)
}

function drawWallLine(pos, dist, facing, a, rayx, rayy, wall) {
    noStroke()
    var height = (windowHeight / dist)
    var x = windowWidth / 2 + pos * lineWidth
    var y = -height / 2 + windowHeight / 2 - verticalCameraOffset
    var depth = clamp(1 - dist / maxDist - 0.1 * facing, 0, 1)
        //var offset = Math.floor((((player.y * !facing) + (player.x * facing) + (((rayy * !facing) || rayx * facing) * worldCellSize)) % worldCellSize) / (worldCellSize / Math.sqrt(wall.length)))
    var offset = (((player.y * !facing) + (player.x * facing) + (((rayy * !facing) || rayx * facing) * worldCellSize)) % worldCellSize)
    if (!facing && a > Math.PI / 2 && a < Math.PI * 3 / 2 || facing && a < Math.PI) offset = worldCellSize - offset
        //chooseColor(i, offset, depth)

    var wallPic = imgWall[0]
    var wallPicSize = imgSize[0]
    image(wallPic, x, y, lineWidth, height, wallPicSize * (offset / (worldCellSize + 1)) + 1, 0, lineWidth, wallPicSize)
    if (wall == 2) {
        var wallPic = imgWall[1]
        var wallPicSize = imgSize[1]
        image(wallPic, x, y, lineWidth, height, wallPicSize * (offset / (worldCellSize + 1)) + 1, 0, lineWidth, wallPicSize)
    } else if (wall == 3) {
        var wallPic = imgWall[2]
        var wallPicSize = imgSize[2]
        image(wallPic, x, y, lineWidth, height, (wallPicSize * (time % 2)) + wallPicSize * (offset / (worldCellSize + 1)) + 1, (wallPicSize * Math.floor(time / 2)), lineWidth, wallPicSize)
    } else if (wall == 4) {
        var wallPic = imgWall[3]
        var wallPicSize = imgSize[3]
        image(wallPic, x, y, lineWidth, height, (wallPicSize * (time % 2)) + wallPicSize * (offset / (worldCellSize + 1)) + 1, (wallPicSize * Math.floor(time / 2)), lineWidth, wallPicSize)
    }

    //  if (wall == 2) image(imgBlood, x, y, lineWidth, height, imgBloodSize * (offset / (worldCellSize + 1)) + 1, 0, lineWidth, imgBloodSize)
    //if (wall == 3) image(imgWall, x, y, lineWidth, height, (imgSize * (time % 2)) + imgSize * (offset / (worldCellSize + 1)) + 1, (imgSize * Math.floor(time / 2)), lineWidth, imgSize)

    fill(0, 0, 0, 255 - depth * 255)
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

function launchMusic() {
    music.play()
}