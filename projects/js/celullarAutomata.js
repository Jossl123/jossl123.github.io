var grid = []
var next = []
var pixSize = 1
var viewSize = 2
var maxi = (viewSize + 2) * (viewSize + 2)

function setup() {
    createCanvas(windowWidth, windowHeight)
    pixelDensity(pixSize)
    for (let x = 0; x < Math.floor(width / pixSize); x++) {
        grid[x] = []
        next[x] = []
        for (let y = 0; y < Math.floor(height / pixSize); y++) {
            grid[x][y] = Math.floor(Math.random() * 2)
            next[x][y] = 0
        }
    }
    next = grid
}

function draw() {
    loadPixels();
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[x].length; y++) {
            var result = getNeigthboor(x, y)
            var color = [0, 0, 0]
            if (result >= maxi / 2) {
                next[x][y] = 0
                color = [255, 255, 255]
            } else if (result >= maxi / 3) {
                next[x][y] = 1
                color = [0, 0, 0]
            } else {
                next[x][y] = 0
                color = [255, 255, 255]
            }
            var index = (x + y * grid.length) * 4
            pixels[index] = color[0];
            pixels[index + 1] = color[1];
            pixels[index + 2] = color[2];
            pixels[index + 3] = 255;
        }
    }
    updatePixels();
    grid = next
}

function getNeigthboor(x, y) {
    var sum = 0
    for (let xoff = -viewSize; xoff <= viewSize; xoff++) {
        for (let yoff = -viewSize; yoff <= viewSize; yoff++) {
            if (xoff + x >= 0 && xoff + x < width && yoff + y >= 0 && yoff + y < height) {
                sum += grid[xoff + x][yoff + y]
            } else {
                sum += 0
            }
        }
    }
    return sum
}

// function getNeigthboorCircle(x, y, length) {
//     var sum = 0
//     var ray = createVector(length, 0)
//     var pointsCross = []
//     for (let angle = 0; angle < 180; angle += 2) {
//         if (!pointsCross.includes([Math.floor(ray.x), Math.floor(ray.y)])) {
//             if (Math.floor(ray.x) + x >= 0 && Math.floor(ray.x) + x < width && Math.floor(ray.y) + y >= 0 && Math.floor(ray.y) + y < height) {
//                 sum += grid[Math.floor(ray.x) + x][Math.floor(ray.y) + y]
//             } else {
//                 sum += 0
//             }
//             pointsCross.push([Math.floor(ray.x), Math.floor(ray.y)])
//         }
//         ray.rotate(angle * Math.PI / 180).setMag(len)
//     }
//     return sum
// }