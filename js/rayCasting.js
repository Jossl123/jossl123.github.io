var worldX = 8
var worldY = 8
var maxDist = 8
const worldCellSize = 50
var world = [
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 1, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 0, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 0, 1, 0, 0, 1,
    1, 0, 1, 1, 1, 0, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1,

]
var player = {
    fov: 100,
    x: 70,
    y: 100,
    a: Math.PI / 2,
    dx: Math.cos(Math.PI / 2) * 5,
    dy: Math.sin(Math.PI / 2) * 5,
    speed: 1.2,
    rotateSpeed: 0.05
}

var lineWidth

function setup() {
    createCanvas(windowWidth, windowHeight);
    lineWidth = Math.floor(windowWidth / player.fov)

}

function draw() {
    background(100);
    keyDown()
    drawPlayer()
    castRay()
    drawWorld()
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
            square(x * 50, y * 50, 50)
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
    if (side == 0) perpWallDist = (sideDistX - deltaDistX);
    else perpWallDist = (sideDistY - deltaDistY);
    return [perpWallDist, side]
}

function castRay() {
    var ra = player.a - (player.fov / 2 * Math.PI / 180)
    fill(100, 50, 0)
    rect(0, 0, windowWidth, windowHeight / 2)
    fill(50, 100, 0)
    rect(0, windowHeight / 2, windowWidth, windowHeight / 2)

    for (let i = -player.fov * 2; i < player.fov * 2; i++) {
        res = getWallDist(ra)
        perpWallDist = Math.cos(player.a - ra) * res[0]
        ra += (Math.PI * 2 / 360) / 4
            //ra += player.fov / windowWidth * Math.PI / 180
        drawWallLine(i, perpWallDist, res[1])
    }

    //     for (let i = -player.fov / 2; i < player.fov / 2; i++) {
    //         res = getWallDist(ra)
    //         perpWallDist = Math.cos(player.a - ra) * res[0]
    //         ra += Math.PI * 2 / 360
    //             // perpWallDist2 = Math.cos(player.a - ra) * getWallDist(ra)
    //             //     //circle(player.x + rayDirX * perpWallDist * worldCellSize, player.y + rayDirY * perpWallDist * worldCellSize, 5)
    //             // ra += Math.PI * 2 / 360
    //             //draw2WallLine(i, perpWallDist1, perpWallDist2)

    //         drawWallLine(i, perpWallDist, res[1])
    //     }
}

function drawWallLine(pos, dist, facing) {
    lineWidth = Math.floor(windowWidth / player.fov * 4)
    noStroke()
    var height = windowHeight / dist
    if (facing) {
        fill(255, 200 - (dist * 200 / 5), 0)
    } else {
        fill(255, 200 - (dist * 200 / 5) + 55, 0)
    }
    rect(windowWidth / 2 + pos * lineWidth, -height / 2 + windowHeight / 2, lineWidth, height)
        //rect(windowWidth / 2 + pos * 10, (windowHeight - (8 - dist) * 100) / 2, 10, (8 - dist) * 100)
        //rect(pos, (windowHeight - (8 - dist) * 100) / 2, 1, (8 - dist) * 100)
}

function draw2WallLine(pos, dist1, dist2) {
    noStroke()
    var height1 = windowHeight / dist1
    var height2 = windowHeight / dist2
    var ratioHeight = (height2 - height1) / lineWidth
    var ratioDist = (dist2 - dist1) / lineWidth
    if (Math.abs(dist2 - dist1) < 0) {
        for (let i = 0; i < lineWidth * 2; i++) {
            var dist = dist1 + ratioDist * i
            var height = height1 + ratioHeight * i
            fill((dist * 255 / 5), (dist * 255 / 5), 255 - (dist * 255 / 5))
                //rect((windowWidth / 2 + pos * lineWidth) + i, -height / 2 + windowHeight / 2, (windowWidth / 2 + pos * lineWidth) + i, height / 2 + windowHeight / 2)
            rect(windowWidth / 2 + pos * lineWidth + i, -height / 2 + windowHeight / 2, 2, height)
        }

    } else {
        fill(255 - (dist1 * 255 / 5))
        rect(windowWidth / 2 + pos * lineWidth, -height1 / 2 + windowHeight / 2, lineWidth, height1)
        fill((dist2 * 255 / 5), (dist2 * 255 / 5), 255 - (dist2 * 255 / 5))
        rect(windowWidth / 2 + pos * lineWidth + lineWidth, -height2 / 2 + windowHeight / 2, lineWidth, height2)
    }
    //rect(windowWidth / 2 + pos * 10, (windowHeight - (8 - dist) * 100) / 2, 10, (8 - dist) * 100)
}