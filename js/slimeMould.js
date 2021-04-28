var grid = []
var next = []
var particules = []
var lostDepth = 0.002

function setup() {
    createCanvas(windowWidth, windowHeight, P2D)
    for (let x = 0; x < width; x++) {
        grid[x] = []
        next[x] = []
        for (let y = 0; y < height; y++) {
            grid[x][y] = 0
            next[x][y] = 0
        }
    }
    for (let x = 0; x < 2000; x++) {
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

class Particule {
    constructor(x, y) {
        this.pos = createVector(x, y)
        this.dir = p5.Vector.random2D();
    }
    update() {
        if (Math.floor(this.pos.x) <= 1) {
            this.pos.x++;
            this.dir.x = -this.dir.x
        } else if (Math.floor(this.pos.x) >= width - 2) {
            this.pos.x--;
            this.dir.x = -this.dir.x
        }
        if (Math.floor(this.pos.y) <= 1) {
            this.pos.y++;
            this.dir.y = -this.dir.y
        } else if (Math.floor(this.pos.y) >= height - 2) {
            this.pos.y--;
            this.dir.y = -this.dir.y
        }
        grid[Math.floor(this.pos.x)][Math.floor(this.pos.y)] = 1
        this.dir.rotate(random(-0.2, 0.2))
        this.dir.rotate(this.dir.angleBetween(getHigherNeigthboors(Math.floor(this.pos.x), Math.floor(this.pos.y), this.dir)) / 100)
        this.pos.add(this.dir)
    }
}

function getNeigthboorAverage(x, y) {
    if (x <= 0) { x = 1 }
    if (x >= width - 1) { x = width - 2 }
    if (y <= 0) { y = 1 }
    if (y >= height - 1) { y = height - 2 }
    var sum = 0
    sum += grid[x][y]
    sum += grid[x - 1][y]
    sum += grid[x + 1][y]
    sum += grid[x][y - 1]
    sum += grid[x][y + 1]
    sum += grid[x - 1][y - 1]
    sum += grid[x + 1][y - 1]
    sum += grid[x - 1][y + 1]
    sum += grid[x + 1][y + 1]
    return sum / 9
}

function getHigherNeigthboors(x, y, dir) {
    if (x <= 0) { x = 1 }
    if (x >= width - 1) { x = width - 2 }
    if (y <= 0) { y = 1 }
    if (y >= height - 1) { y = height - 2 }
    var neightboor = []
    var angle = dir.angleBetween(createVector(0, 1)) + Math.PI / 4 * 5
    if (angle <= Math.PI * 2 / 4) {
        neightboor.push({ value: grid[x - 1][y], x: -1, y: 0 })
        neightboor.push({ value: grid[x][y + 1], x: 0, y: y })
        neightboor.push({ value: grid[x - 1][y + 1], x: -1, y: 1 })
    } else if (angle < Math.PI * 3 / 4) {
        neightboor.push({ value: grid[x - 1][y], x: -1, y: 0 })
        neightboor.push({ value: grid[x - 1][y - 1], x: -1, y: -1 })
        neightboor.push({ value: grid[x - 1][y + 1], x: -1, y: 1 })
    } else if (angle < Math.PI * 4 / 4) {
        neightboor.push({ value: grid[x - 1][y - 1], x: -1, y: -1 })
        neightboor.push({ value: grid[x][y - 1], x: 0, y: y })
        neightboor.push({ value: grid[x - 1][y], x: -1, y: 0 })
    } else if (angle < Math.PI * 5 / 4) {
        neightboor.push({ value: grid[x][y - 1], x: 0, y: -1 })
        neightboor.push({ value: grid[x - 1][y - 1], x: -1, y: -1 })
        neightboor.push({ value: grid[x + 1][y - 1], x: 1, y: -1 })
    } else if (angle < Math.PI * 6 / 4) {
        neightboor.push({ value: grid[x][y - 1], x: 0, y: -1 })
        neightboor.push({ value: grid[x + 1][y], dx: 1, dy: 0 })
        neightboor.push({ value: grid[x + 1][y - 1], dx: 1, dy: -1 })
    } else if (angle < Math.PI * 7 / 4) {
        neightboor.push({ value: grid[x + 1][y], dx: 1, dy: 0 })
        neightboor.push({ value: grid[x + 1][y - 1], dx: 1, dy: -1 })
        neightboor.push({ value: grid[x + 1][y + 1], dx: 1, dy: 1 })
    } else if (angle < Math.PI * 8 / 4) {
        neightboor.push({ value: grid[x + 1][y], dx: 1, dy: 0 })
        neightboor.push({ value: grid[x][y + 1], dx: 0, dy: 1 })
        neightboor.push({ value: grid[x + 1][y + 1], dx: 1, dy: 1 })
    } else {
        neightboor.push({ value: grid[x][y + 1], dx: 0, dy: 1 })
        neightboor.push({ value: grid[x - 1][y + 1], dx: -1, dy: 1 })
        neightboor.push({ value: grid[x + 1][y + 1], dx: 1, dy: 1 })
    }
    var maxValue = 0
    var maxElements = []
    for (let i = 0; i < neightboor.length; i++) {
        if (neightboor[i].value == maxValue) {
            maxElements.push(createVector(neightboor[i].dx, neightboor[i].dy))
        } else if (neightboor[i].value > maxValue) {
            maxValue = neightboor[i].value
            maxElements = [createVector(neightboor[i].dx, neightboor[i].dy)]
        }
    }
    var finalVector
    for (let i = 0; i < maxElements.length; i++) {
        if (!finalVector) {
            finalVector = createVector(maxElements[i].x, maxElements[i].y)
        } else {
            finalVector.add(maxElements[i])
        }
    }
    finalVector.div(maxElements.length).sub(dir).setMag(1)
    return finalVector
}