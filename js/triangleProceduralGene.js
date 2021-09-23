var triMinSize = 50;

window.onload = function() {
    window.addEventListener('mousedown', (event) => {
        drawPlatform(event.pageX, event.pageY, 20, 2, 20)
    })
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    // for (let y = 0; y < Math.floor(windowHeight / triMinSize + triMinSize); y++) {
    //     for (let x = 0; x < Math.floor(windowWidth / triMinSize + triMinSize); x++) {
    //         if (x % 2 == 0) {
    //             circle(x * triMinSize, y * triMinSize + triMinSize / 2, 5);
    //         } else {
    //             circle(x * triMinSize, y * triMinSize, 5);
    //         }
    //     }
    // }
    randomCube()
        //randomTriangle()
}

function draw() {
    randomCube()
        //randomTriangle()
}

function randomTriangle() {
    drawTriangle(
        random(triMinSize, width),
        random(triMinSize, height),
        6,
        1,
        randomColor())
}

function drawPlatform(x, y, sx, sy, sz, color = randomColor()) {
    var p = closestEdgeCoord(x, y)
    for (let Y = 0; Y < sy; Y++) {
        for (let Z = 0; Z < sz; Z++) {
            for (let X = 0; X < sx; X++) {
                var newx = p[0] + triMinSize * X - triMinSize * Z;
                var newy = p[1] - triMinSize * Y + X * triMinSize / 2 + Z * triMinSize / 2;
                drawCube(newx, newy, 1, color)
            }
        }
    }
}

function randomCube() {
    drawCube(
        random(triMinSize, width),
        random(triMinSize, height),
        Math.floor(random() * 4),
        randomColor())
}
//      2
//     / \
//    /   \
//   /     \
//  1-------3
//

// 
//     2   3
//   1   0   4
//     6   5
//  

function drawTriangle(x, y, corner, size, color) {
    //normalize the coord
    var firstCorner = [0, 0]
    var secondCorner = [0, 0]
    var thirdCorner = [0, 0]
    switch (corner) {
        case 1:
            firstCorner = closestEdgeCoord(x, y)
            secondCorner = [firstCorner[0] - triMinSize * size, firstCorner[1] + triMinSize / 2 * size]
            thirdCorner = [firstCorner[0] - triMinSize * size, firstCorner[1] - triMinSize / 2 * size]
            break;

        case 2:
            firstCorner = closestEdgeCoord(x, y)
            secondCorner = [firstCorner[0] - triMinSize * size, firstCorner[1] - triMinSize / 2 * size]
            thirdCorner = [firstCorner[0], firstCorner[1] - triMinSize * size]
            break;

        case 3:
            firstCorner = closestEdgeCoord(x, y)
            secondCorner = [firstCorner[0], firstCorner[1] - triMinSize * size]
            thirdCorner = [firstCorner[0] + triMinSize * size, firstCorner[1] - triMinSize / 2 * size]
            break;


        case 4:
            firstCorner = closestEdgeCoord(x, y)
            secondCorner = [firstCorner[0] + triMinSize * size, firstCorner[1] - triMinSize / 2 * size]
            thirdCorner = [firstCorner[0] + triMinSize * size, firstCorner[1] + triMinSize / 2 * size]
            break;

        case 5:
            firstCorner = closestEdgeCoord(x, y)
            secondCorner = [firstCorner[0] + triMinSize * size, firstCorner[1] + triMinSize / 2 * size]
            thirdCorner = [firstCorner[0], firstCorner[1] + triMinSize * size]
            break;

        case 6:
            firstCorner = closestEdgeCoord(x, y)
            secondCorner = [firstCorner[0], firstCorner[1] + triMinSize * size]
            thirdCorner = [firstCorner[0] - triMinSize * size, firstCorner[1] + triMinSize / 2 * size]
            break;

        default:
            return "noCorner";
    }
    fill(color);
    stroke(color);
    //noStroke()
    triangle(firstCorner[0], firstCorner[1], secondCorner[0], secondCorner[1], thirdCorner[0], thirdCorner[1])
}

function drawCube(x, y, size, color) {
    drawTriangle(x, y, 1, size, shadowColor(color, 2))
    drawTriangle(x, y, 2, size, color)
    drawTriangle(x, y, 3, size, color)
    drawTriangle(x, y, 4, size, shadowColor(color, 3))
    drawTriangle(x, y, 5, size, shadowColor(color, 3))
    drawTriangle(x, y, 6, size, shadowColor(color, 2))
}

function randomColor() {
    var rand = Math.floor(Math.random() * 10);
    //return color(215 - rand * 3, 185 - rand * 5, 185 - rand * 10)
    //return color(Math.floor(Math.random() * 360), 100, 80)
    //return color('#' + Math.floor(Math.random() * 16777215).toString(16))
    //return color('#' + ((1 << 24) * (Math.random() + 1) | 0xc0c0c0).toString(16).substr(1))
    return color(Math.floor((Math.random() * 127) + 127), Math.floor((Math.random() * 127) + 127), Math.floor((Math.random() * 127) + 127))
}

function shadowColor(col, amp) {
    return color(col.levels[0] / amp, col.levels[1] / amp, col.levels[2] / amp)
}

function closestEdgeCoord(x, y) {
    var newx = Math.floor(x / triMinSize) * triMinSize
    var newy = Math.floor(y / triMinSize) * triMinSize
    if (Math.floor(x / triMinSize) % 2 == 0) newy += triMinSize / 2
    return [newx, newy]
}