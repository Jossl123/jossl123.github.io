var h = 1000;
var w = 1000;
var tileSize = 10
var world = []
var blocks = []
var itt = true

function setup() {
    createCanvas(windowWidth, windowHeight)
        // if (windowWidth > windowHeight) {
        //     tileSize = windowHeight / h
        // } else {
        //     tileSize = windowWidth / w
        // }
    for (let y = 0; y < Math.floor(h / tileSize); y++) {
        world[y] = []
        for (let x = 0; x < Math.floor(w / tileSize); x++) {
            world[y][x] = 0
        }
    }
}

function draw() {
    background(255)
    if (world[world.length / 2][world[0].length / 2] == 0 && itt) {
        blocks.push(new Sand(world.length / 2 - 1, world[0].length / 2))
    }
    if (world[world.length / 2][world[0].length / 2] == 0 && itt) {
        blocks.push(new Water(world.length / 2, world[0].length / 2))
    }
    for (let block of blocks) {
        block.update()
    }
    itt = !itt
}

class Sand {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        world[this.y][this.x] = 1
    }
    update() {
        if (this.y != world.length - 1) {
            if (world[this.y + 1][this.x] == 0) {
                world[this.y][this.x] = 0
                this.y++;
                world[this.y][this.x] = 1
            } else if (world[this.y + 1][this.x - 1] == 0) {
                world[this.y][this.x] = 0
                this.y++;
                this.x--;
                world[this.y][this.x] = 1
            } else if (world[this.y + 1][this.x + 1] == 0) {
                world[this.y][this.x] = 0
                this.y++;
                this.x++;
                world[this.y][this.x] = 1
            }
        }
        this.render()
    }
    render() {
        fill(200, 200, 0)
        stroke(200, 200, 0)
        rect(this.x * tileSize, this.y * tileSize, tileSize, tileSize)
    }
}

class Water {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        world[this.y][this.x] = 2
    }
    update() {
        var moved = false
        if (this.y != world.length - 1) {
            if (world[this.y + 1][this.x] == 0) {
                world[this.y][this.x] = 0
                this.y++;
                world[this.y][this.x] = 1
                moved = true
            } else if (world[this.y + 1][this.x - 1] == 0) {
                world[this.y][this.x] = 0
                this.y++;
                this.x--;
                world[this.y][this.x] = 1
                moved = true
            } else if (world[this.y + 1][this.x + 1] == 0) {
                world[this.y][this.x] = 0
                this.y++;
                this.x++;
                world[this.y][this.x] = 1
                moved = true
            }
        }
        if (!moved) {
            if (world[this.y][this.x - 1] == 0) {
                world[this.y][this.x] = 0
                this.x--;
                world[this.y][this.x] = 2
                moved = true
            } else if (world[this.y][this.x + 1] == 0) {
                world[this.y][this.x] = 0
                this.x++;
                world[this.y][this.x] = 2
                moved = true
            }
        }
        this.render()
    }
    render() {
        fill(10, 10, 100)
        stroke(10, 10, 100)
        rect(this.x * tileSize, this.y * tileSize, tileSize, tileSize)
    }
}