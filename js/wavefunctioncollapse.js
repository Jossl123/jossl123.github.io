var refImg
var w = 10
var h = 10
    //0:rien, 1:bleu, 2:echelle, 3:brique, 4:rond, 5:caillou
var cells = [
    [
        [0, 3, 5, 1],
        [0, 3, 1],
        [0, 1, 3],
        [0, 3, 5, 1]
    ],
    [
        [1, 0, 3, 5],
        [2],
        [2],
        [2]
    ],
    [
        [2],
        [0],
        [2],
        [0]
    ],
    [
        [3, 4],
        [3],
        [3],
        [3]
    ],
    [
        [3, 4],
        [3],
        [3],
        [3]
    ],
    [
        [3, 4],
        [3],
        [3],
        [3]
    ]
]
var grid = []
for (let y = 0; y < h; y++) {
    grid.push([])
    for (let x = 0; x < w; x++) {
        grid[y].push([])
        for (let i = 0; i < cells.length; i++) {
            grid[y][x].push(i)
        }
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    refImg = new Image()
        //refImg.src = './img/collapse/test.jpg';
    showGrid()
}

function draw() {}

function validCells(cell, dir) {
    var valids = []
    for (let i = 0; i < cell.length; i++) {
        cells[cell[i]][dir].forEach(element => {
            valids.push(element)
        });
    }
    return valids
}

function collapse() {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (y != 0) {
                var r = validCells(grid[y][x], 0)
                if (r.length <= grid[y - 1][x].length) grid[y - 1][x] = validCells(grid[y][x], 0)
            }
            if (x != 0) {
                var r = validCells(grid[y][x], 3)
                if (r.length <= grid[y][x - 1].length) grid[y][x - 1] = validCells(grid[y][x], 3)
            }
            if (y < h - 1) {
                var r = validCells(grid[y][x], 2)
                if (r.length <= grid[y + 1][x].length) grid[y + 1][x] = validCells(grid[y][x], 2)
            }
            if (x < w - 1) {
                var r = validCells(grid[y][x], 1)
                if (r.length <= grid[y][x + 1].length) grid[y][x + 1] = validCells(grid[y][x], 1)
            }
        }
    }
    showGrid()
}

function showGrid() {
    background(255)
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            rect(x * 50, y * 50, 40, 40)
            textSize(10);
            for (let i = 0; i < grid[y][x].length; i++) {
                text(grid[y][x][i], x * 50 + i * 10, y * 50 + 10);
            }
        }
    }
}