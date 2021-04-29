var grid = []
var next = []
var particules = []
var lostDepth = 0.01

function setup() {
    //createCanvas(320, 180, P2D)
    createCanvas(windowWidth, windowHeight, P2D)
    for (let x = 0; x < width; x++) {
        grid[x] = []
        next[x] = []
        for (let y = 0; y < height; y++) {
            grid[x][y] = 0
            next[x][y] = 0
        }
    }
    for (let x = 0; x < 50000; x++) {
        particules.push(new Particule(width / 2, height / 2))

    }
}

function draw() {
    for (let particule of particules) {
        particule.update()
    }
    loadPixels();
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[x].length; y++) {
            next[x][y] = getNeigthboorAverage(x, y)
            if (next[x][y] - lostDepth >= 0) {
                next[x][y] -= lostDepth
            } else {
                next[x][y] = 0
            }
            var index = (x + y * grid.length) * 4
            pixels[index] = Math.floor(grid[x][y] * 255)
            pixels[index + 1] = Math.floor(grid[x][y] * 255);
            pixels[index + 2] = Math.floor(grid[x][y] * 255);
            pixels[index + 3] = 255;
        }
    }
    updatePixels();
    var temp = grid
    grid = next
    next = temp
}

var itter = 0

class Particule {
    constructor(x, y) {
        this.pos = createVector(x, y)
        this.dir = p5.Vector.random2D();
        this.canTurn = true
    }
    update() {
        if (Math.floor(this.pos.x) <= 1) {
            this.pos.x++;
            this.dir.x = -this.dir.x
            this.canTurn = true
        } else if (Math.floor(this.pos.x) >= width - 1) {
            this.pos.x--;
            this.dir.x = -this.dir.x
            this.canTurn = true
        }
        if (Math.floor(this.pos.y) <= 1) {
            this.pos.y++;
            this.dir.y = -this.dir.y
            this.canTurn = true
        } else if (Math.floor(this.pos.y) >= height - 1) {
            this.pos.y--;
            this.dir.y = -this.dir.y
            this.canTurn = true
        }
        grid[Math.floor(this.pos.x)][Math.floor(this.pos.y)] = 1
        if (this.canTurn) {
            var angle = this.dir.angleBetween(createVector(0, -1)) + Math.PI * 4 / 5
            var senseForward
            var senseLeft
            var senseWrite
            if (angle < Math.PI * 2 / 4) {
                senseLeft = sense(createVector(this.pos.x, this.pos.y + 1))
                senseForward = sense(createVector(this.pos.x - 1, this.pos.y + 1))
                senseWrite = sense(createVector(this.pos.x - 1, this.pos.y))
            } else if (angle < Math.PI * 3 / 4) {
                senseLeft = sense(createVector(this.pos.x - 1, this.pos.y + 1))
                senseForward = sense(createVector(this.pos.x - 1, this.pos.y))
                senseWrite = sense(createVector(this.pos.x - 1, this.pos.y - 1))
            } else if (angle < Math.PI * 4 / 4) {
                senseLeft = sense(createVector(this.pos.x - 1, this.pos.y))
                senseForward = sense(createVector(this.pos.x - 1, this.pos.y - 1))
                senseWrite = sense(createVector(this.pos.x, this.pos.y - 1))
            } else if (angle < Math.PI * 5 / 4) {
                senseLeft = sense(createVector(this.pos.x - 1, this.pos.y - 1))
                senseForward = sense(createVector(this.pos.x, this.pos.y - 1))
                senseWrite = sense(createVector(this.pos.x + 1, this.pos.y - 1))
            } else if (angle < Math.PI * 6 / 4) {
                senseLeft = sense(createVector(this.pos.x, this.pos.y - 1))
                senseForward = sense(createVector(this.pos.x + 1, this.pos.y - 1))
                senseWrite = sense(createVector(this.pos.x + 1, this.pos.y))
            } else if (angle < Math.PI * 7 / 4) {
                senseLeft = sense(createVector(this.pos.x + 1, this.pos.y - 1))
                senseForward = sense(createVector(this.pos.x + 1, this.pos.y))
                senseWrite = sense(createVector(this.pos.x + 1, this.pos.y + 1))
            } else if (angle < Math.PI * 8 / 4) {
                senseLeft = sense(createVector(this.pos.x + 1, this.pos.y))
                senseForward = sense(createVector(this.pos.x + 1, this.pos.y + 1))
                senseWrite = sense(createVector(this.pos.x, this.pos.y + 1))
            } else {
                senseLeft = sense(createVector(this.pos.x + 1, this.pos.y + 1))
                senseForward = sense(createVector(this.pos.x, this.pos.y + 1))
                senseWrite = sense(createVector(this.pos.x - 1, this.pos.y + 1))
            }

            if (itter < 10) {
                console.log(senseLeft, senseForward, senseWrite)
                itter++
            }
            if (senseForward > senseLeft && senseForward > senseWrite) {} else if (senseForward < senseLeft && senseForward < senseWrite) {
                this.dir.rotate(random(-1, 1))
            }
            // Turn right
            else if (senseWrite > senseLeft) {
                this.dir.rotate(4)
                this.dir.rotate(random(-1, 1))
            }
            // Turn left
            else if (senseLeft > senseWrite) {
                this.dir.rotate(-4)
                this.dir.rotate(random(-1, 1))
            }
        }

        this.pos.add(this.dir.setMag(1))
    }
}

function getNeigthboorAverage(x, y) {
    var sum = 0
    for (let xoff = -1; xoff <= 1; xoff++) {
        for (let yoff = -1; yoff <= 1; yoff++) {
            if (xoff + x >= 0 && xoff + x < width && yoff + y >= 0 && yoff + y < height) {
                sum += grid[xoff + x][yoff + y]
            }
        }
    }
    return sum / 9
}

function sense(pos) {
    var sum = 0
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            if (Math.floor(pos.x) + x >= 0 && Math.floor(pos.x) + x < width && Math.floor(pos.y) + y >= 0 && Math.floor(pos.y) + y < height) {
                sum += grid[Math.floor(pos.x) + x][Math.floor(pos.y) + y]
            }
        }
    }
    return sum
}