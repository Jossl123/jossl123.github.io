var rez = 30
var grid = []
var cols, rows
var zoff = 0

function setup() {
    createCanvas(windowWidth, windowHeight);
    cols = width / rez + 1
    rows = height / rez + 1
    for (let y = 0; y < rows; y++) {
        grid[y] = []
        for (let x = 0; x < cols; x++) {
            grid[y][x] = Math.floor(noise(x, y, zoff) * 2)
        }
    }
}

function draw() {
    background(255)
    for (let y = 0; y < rows; y++) {
        grid[y] = []
        for (let x = 0; x < cols; x++) {
            grid[y][x] = Math.floor(noise(x, y, zoff) * 2)
        }
    }
    for (let y = 0; y < rows - 1; y++) {
        for (let x = 0; x < cols - 1; x++) {
            var xpos = x * rez;
            var ypos = y * rez;
            // var up = grid[y][x] - grid[y][x + 1]
            // var up1 = grid[y][x] / up
            // var up2 = grid[y][x + 1] / up
            // console.log(up, up1, up2)
            var a = createVector(xpos + rez / 2, ypos)
            var b = createVector(xpos + rez, ypos + rez / 2)
            var c = createVector(xpos + rez / 2, ypos + rez)
            var d = createVector(xpos, ypos + rez / 2)
            var state = getState(grid[y][x], grid[y][x + 1], grid[y + 1][x + 1], grid[y + 1][x])
            switch (state) {
                case 1:
                    createline(d, c)
                    break;
                case 2:
                    createline(b, c)
                    break;
                case 3:
                    createline(d, b)
                    break;
                case 4:
                    createline(a, b)
                    break;
                case 5:
                    createline(d, a)
                    createline(b, c)
                    break;
                case 6:
                    createline(a, c)
                    break;
                case 7:
                    createline(a, d)
                    break;
                case 8:
                    createline(a, d)
                    break;
                case 9:
                    createline(a, c)
                    break;
                case 10:
                    createline(b, a)
                    createline(d, c)
                    break;
                case 11:
                    createline(a, b)
                    break;
                case 12:
                    createline(b, d)
                    break;
                case 13:
                    createline(c, b)
                    break;
                case 14:
                    createline(d, c)
                    break;
            }
        }
    }
    zoff += 0.005
}

function getState(a, b, c, d) {
    return a * 8 + b * 4 + c * 2 + d * 1
}

function createline(v1, v2) {
    strokeWeight(2)
        //stroke(noise(v1.x, v1.y) * 255, noise(v2.x, v2.y) * 255, noise(v1.x, v2.y) * 255)
    stroke(0, 0, 0)
    line(v1.x, v1.y, v2.x, v2.y)
}