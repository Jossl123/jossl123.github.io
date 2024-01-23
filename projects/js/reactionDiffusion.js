var grid = []
var next = []
var pixSize = 1

var dA = 1;
var dB = 0.5;
var feed = 0.055;
var k = 0.062
var dt = 1

function setup() {
    createCanvas(300, 300)
    slideDA = createSlider(0, 1, 1, 0.01)
    slideDB = createSlider(0, 1, 0.5, 0.01)
    slideFeed = createSlider(0, 1, 0.055, 0.001)
    slideK = createSlider(0, 1, 0.062, 0.001)
    pixelDensity(pixSize)
    for (let x = 0; x < Math.floor(width / pixSize); x++) {
        grid[x] = []
        next[x] = []
        for (let y = 0; y < Math.floor(height / pixSize); y++) {
            grid[x][y] = { a: 1, b: 0 }
            next[x][y] = { a: 1, b: 0 }
        }
    }
    for (let x = 90; x < 110; x++) {
        for (let y = 90; y < 110; y++) {
            grid[x][y].b = 1
        }
    }
}

function draw() {
    dA = slideDA.value();
    dB = slideDB.value();
    feed = slideFeed.value()
    k = slideK.value()
    background(51)
    for (let x = 1; x < grid.length - 1; x++) {
        for (let y = 1; y < grid[x].length - 1; y++) {
            next[x][y].a = grid[x][y].a + (dA * getNeigthboorA(x, y)) - (grid[x][y].a * grid[x][y].b * grid[x][y].b) + (feed * (1 - grid[x][y].a)) * dt
            next[x][y].b = grid[x][y].b + (dB * getNeigthboorB(x, y)) + (grid[x][y].a * grid[x][y].b * grid[x][y].b) - ((k + feed) * grid[x][y].b) * dt
        }
    }
    loadPixels();
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[x].length; y++) {
            var index = (x + y * grid.length) * 4
            pixels[index] = Math.floor(grid[x][y].a * 200) + Math.floor(grid[x][y].a * 155);
            pixels[index + 1] = Math.floor(grid[x][y].a * 255);
            pixels[index + 2] = Math.floor(grid[x][y].a * 255);
            pixels[index + 3] = 255;
        }
    }
    updatePixels();
    var temp = grid
    grid = next
    next = temp
}

function getNeigthboorA(x, y) {
    var sumA = 0
    sumA += grid[x][y].a * -1
    sumA += grid[x - 1][y].a * 0.2
    sumA += grid[x + 1][y].a * 0.2
    sumA += grid[x][y - 1].a * 0.2
    sumA += grid[x][y + 1].a * 0.2
    sumA += grid[x - 1][y - 1].a * 0.05
    sumA += grid[x + 1][y - 1].a * 0.05
    sumA += grid[x - 1][y + 1].a * 0.05
    sumA += grid[x + 1][y + 1].a * 0.05
    return sumA
}

function getNeigthboorB(x, y) {
    var sumB = 0
    sumB += grid[x][y].b * -1
    sumB += grid[x - 1][y].b * 0.2
    sumB += grid[x + 1][y].b * 0.2
    sumB += grid[x][y - 1].b * 0.2
    sumB += grid[x][y + 1].b * 0.2
    sumB += grid[x - 1][y - 1].b * 0.05
    sumB += grid[x + 1][y - 1].b * 0.05
    sumB += grid[x - 1][y + 1].b * 0.05
    sumB += grid[x + 1][y + 1].b * 0.05
    return sumB
}