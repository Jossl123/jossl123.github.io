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
    var ra = player.a //- (Math.PI / 4)
    mapX = Math.floor(player.x / worldCellSize)
    mapY = Math.floor(player.y / worldCellSize)
    var rx = player.x
    var ry = player.y
    for (let i = 0; i < 1; i++) {
        mapX = Math.floor(player.x / worldCellSize)
        mapY = Math.floor(player.y / worldCellSize)
        var rayDirX = Math.cos(ra)
        var rayDirY = Math.sin(ra)
        deltaDistX = Math.sqrt(1 + (rayDirY * rayDirY) / (rayDirX * rayDirX))
        deltaDistY = Math.sqrt(1 + (rayDirX * rayDirX) / (rayDirY * rayDirY))
        var stepX, stepY, side
        var hit = 0

        //calculate step and initial sideDist
        if (rayDirX < 0) {
            stepX = -1;
            sideDistX = (player.x / worldCellSize - mapX) * deltaDistX;
        } else {
            stepX = 1;
            sideDistX = (mapX + 1 - player.x / worldCellSize) * deltaDistX;
        }
        if (rayDirY < 0) {
            stepY = -1;
            sideDistY = (player.y / worldCellSize - mapY) * deltaDistY;
        } else {
            stepY = 1;
            sideDistY = (mapY + 1 - player.y / worldCellSize) * deltaDistY;
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
        console.log(sideDistX, sideDistY)
        var finalD = Math.min(sideDistX, sideDistY)
        circle(player.x + rayDirX * finalD * worldCellSize, player.y + rayDirY * finalD * worldCellSize, 5)
            //console.log(sideDistX, sideDistY)

        return

        var dist = 0
        var sideDistX = 2 * worldCellSize
        var sideDistY = 2 * worldCellSize
            // var deltaDistX = worldCellSize / Math.cos(ra)
            // var deltaDistY = worldCellSize / Math.cos(ra + Math.PI / 2)
        if (ra > Math.PI / 2 && ra < 3 * Math.PI / 2) {
            var posInGrid = Math.floor(player.x / worldCellSize)
            sideDistX = Math.abs((player.x - posInGrid * worldCellSize) / Math.cos(ra)) + 0.001

        } else if (ra < Math.PI / 2 || ra > 3 * Math.PI / 2) {
            var posInGrid = Math.floor(player.x / worldCellSize)
            sideDistX = Math.abs((player.x - (posInGrid + 1) * worldCellSize) / Math.cos(ra)) + 0.001
        }

        if (ra > Math.PI) {
            var posInGrid = Math.floor(player.y / worldCellSize)
            sideDistY = Math.abs((player.y - posInGrid * worldCellSize) / Math.cos(ra + Math.PI / 2)) + 0.001

        } else if (ra < Math.PI) {
            var posInGrid = Math.floor(player.y / worldCellSize)
            sideDistY = Math.abs((player.y - (posInGrid + 1) * worldCellSize) / Math.cos(ra + Math.PI / 2)) + 0.001
        }

        if (sideDistX > maxDist * worldCellSize) sideDistX = maxDist * worldCellSize
        if (sideDistY > maxDist * worldCellSize) sideDistY = maxDist * worldCellSize

        //check collisions

        var rayPosInWorldX = Math.floor(rx / worldCellSize)
        var rayPosInWorldY = Math.floor(ry / worldCellSize)
        var dist, res
        if (sideDistX < sideDistY) res = checkRay(sideDistX, rx, ry, ra)
        else res = checkRay(sideDistY, rx, ry, ra)
        stroke(255, 255, 255)
        fill(255, 255, 255)
        if (res[0] == 0) {
            if (sideDistX > sideDistY) var res = checkRay(sideDistX, rx, ry, ra)
            else res = checkRay(sideDistY, rx, ry, ra)
            if (res[0] == 0) {
                stroke(0, 0, 255)
                fill(0, 0, 255)
            } else {
                stroke(255, 0, 0)
                fill(255, 0, 0)
            }
        }
        dist = res[1]
        circle(player.x + Math.cos(ra) * (dist), player.y + Math.sin(ra) * (dist), 5);

        return





        stroke(0, 255, 0)
        beginShape();
        vertex(player.x, player.y);
        vertex(player.x, player.y);
        vertex(player.x + Math.cos(ra) * sideDistX, player.y + Math.sin(ra) * sideDistX);
        vertex(player.x + Math.cos(ra) * sideDistX, player.y + Math.sin(ra) * sideDistX);
        endShape(CLOSE);
        circle(player.x + Math.cos(ra) * sideDistX, player.y + Math.sin(ra) * sideDistX, 4);
        circle(player.x + Math.cos(ra) * (sideDistY), player.y + Math.sin(ra) * (sideDistY), 4);
        ra += Math.PI * 2 / 360
    }
}

function checkRay(sideDist, rx, ry, ra) {
    var rayPosInWorldX = Math.floor((rx + Math.cos(ra) * sideDist) / worldCellSize)
    var rayPosInWorldY = Math.floor((ry + Math.sin(ra) * sideDist) / worldCellSize)
    var content = world[rayPosInWorldY * worldX + rayPosInWorldX]
    return [content, sideDist]
}