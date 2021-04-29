var grid = []
var next = []
var lostDepth = 0.05

function setup() {
    //createCanvas(windowWidth, windowHeight)
    createCanvas(320, 180)
    for (let x = 0; x < width; x++) {
        grid[x] = []
        next[x] = []
        for (let y = 0; y < height; y++) {
            grid[x][y] = { content: 0 }
            next[x][y] = { content: 0 }
        }
    }
    grid[10][10].content = new Ant(10, 10)
}
var itt = 0

function draw() {
    loadPixels();
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[x].length; y++) {
            var index = (x + y * grid.length) * 4
            if (grid[x][y].content == 0) {
                if (next[x][y].content - lostDepth >= 0) {
                    next[x][y].content -= lostDepth
                } else {
                    next[x][y].content = 0
                }
                pixels[index] = Math.floor(grid[x][y].content * 255)
                pixels[index + 1] = Math.floor(grid[x][y].content * 255);
                pixels[index + 2] = Math.floor(grid[x][y].content * 255);
                pixels[index + 3] = 255;
            } else if (grid[x][y].content instanceof Ant) {
                grid[x][y].content.update()
                next[x][y].content = grid[x][y].content
                pixels[index] = 10
                pixels[index + 1] = 200
                pixels[index + 2] = 100
                pixels[index + 3] = 255;
            }
        }
    }
    updatePixels();
    var temp = grid
    grid = next
    next = temp
}

class Ant {
    constructor(x, y) {
        this.pos = createVector(x, y)
        this.dir = p5.Vector.random2D()
        this.viewRange = 3
    }
    update() {
        this.dir.rotate(random(-10, 10))
        this.pos.add(this.dir)
    }
}

class Food {
    constructor(x, y) {
        this.pos = createVector(x, y)
    }
}

class HomePoint {
    constructor(x, y, dir) {
        this.pos = createVector(x, y)
        this.dir = -dir
    }
}

class FoodPoint {
    constructor(x, y, dir) {
        this.pos = createVector(x, y)
        this.dir = -dir
    }
}