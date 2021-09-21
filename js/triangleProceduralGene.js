var triMinSize = 50;

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 100);
    for (let y = 0; y < Math.floor(windowHeight / triMinSize + triMinSize); y++) {
        for (let x = 0; x < Math.floor(windowWidth / triMinSize + triMinSize); x++) {
            if (x % 2 == 0) {
                circle(x * triMinSize, y * triMinSize + triMinSize / 2, 5);
            } else {
                circle(x * triMinSize, y * triMinSize, 5);
            }
        }
    }
    randomTriangle()
}

function draw() {
    //randomTriangle()
}

function randomTriangle() {
    drawTriangle(
        random(triMinSize, width),
        random(triMinSize, height),
        Math.floor(1),
        Math.floor(1),
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
                // secondCorner = closestEdgeCoord(x, y)
                // thirdCorner = [secondCorner[0] + triMinSize / 2 * size, secondCorner[1] + triMinSize * size]
                // firstCorner = [secondCorner[0] - triMinSize / 2 * size, secondCorner[1] + triMinSize * size]
            break;

        case 3:
            thirdCorner = closestEdgeCoord(x, y)
            firstCorner = [thirdCorner[0] - triMinSize * size, thirdCorner[1]]
            secondCorner = [thirdCorner[0] - triMinSize / 2 * size, thirdCorner[1] - triMinSize * size]
            break;

        default:
            return "noCorner"
            break;
    }
    fill(color);
    noStroke();
    triangle(firstCorner[0], firstCorner[1], secondCorner[0], secondCorner[1], thirdCorner[0], thirdCorner[1])
}

function randomColor() {
    var rand = Math.floor(Math.random() * 10);
    //return color(215 - rand * 3, 185 - rand * 5, 185 - rand * 10)
    //return color(Math.floor(Math.random() * 360), 100, 80)
    //return color('#' + Math.floor(Math.random() * 16777215).toString(16))
    return color('#' + ((1 << 24) * (Math.random() + 1) | 0xc0c0c0).toString(16).substr(1))
        //return color(Math.floor((Math.random() * 127) + 127), Math.floor((Math.random() * 127) + 127), Math.floor((Math.random() * 127) + 127))
}

function closestEdgeCoord(x, y) {
    var newx = Math.floor(x / triMinSize) * triMinSize
    var newy = Math.floor(y / triMinSize) * triMinSize
    if (Math.floor(x / triMinSize) % 2 == 0) newy += triMinSize / 2
    return [newx, newy]
}