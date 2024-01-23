var refImg
var w = 10
var h = 10
    //0:rien, 1:bleu, 2:echelle, 3:brique, 4:rond, 5:caillou
var cells = [
    [
        [0, 3, 5, 1],
        [0, 3, 1, 2, 4],
        [0, 1, 3, 2, 4],
        [0, 3, 5, 1, 2, 4]
    ],
    [
        [1, 0, 3, 5],
        [0, 3, 1],
        [0, 3, 1],
        [0, 3, 1, 5]
    ],
    [
        [2, 0],
        [0, 3],
        [2, 3],
        [0]
    ],
    [
        [3, 2, 4, 0],
        [3, 1, 0],
        [3, 0, 1, 5],
        [3, 1, 0, 2]
    ],
    [
        [0],
        [0],
        [3],
        [0]
    ],
    [
        [0, 3, 5],
        [5, 0, 1],
        [5, 0, 1],
        [5, 0, 1]
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

function containsAll( /* pass all arrays here */ ) {
    var output = [];
    var cntObj = {};
    var array, item, cnt;
    //for each array passed as an argument to the function
    for (var i = 0; i < arguments.length; i++) {
        array = arguments[i];
        //for each element in the array
        for (var j = 0; j < array.length; j++) {
            item = "-" + array[j];
            cnt = cntObj[item] || 0;
            //if cnt is exactly the number of previous arrays, 
            //then increment by one so we count only one per array
            if (cnt == i) {
                cntObj[item] = cnt + 1;
            }
        }
    }
    //now collect all results that are in all arrays
    for (item in cntObj) {
        if (cntObj.hasOwnProperty(item) && cntObj[item] === arguments.length) {
            output.push(item.substring(1));
        }
    }
    return (output);
}
// function setup() {
//     createCanvas(windowWidth, windowHeight);
//     refImg = new Image()
//         //refImg.src = './img/collapse/test.jpg';
//     showGrid()
// }

// function draw() {}

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
                grid[y - 1][x] = containsAll(grid[y - 1][x], validCells(grid[y][x], 0))
            }
            if (x != 0) {
                grid[y][x - 1] = containsAll(grid[y][x - 1], validCells(grid[y][x], 3))
            }
            if (y < h - 1) {
                grid[y + 1][x] = containsAll(grid[y + 1][x], validCells(grid[y][x], 2))
            }
            if (x < w - 1) {
                grid[y][x + 1] = containsAll(grid[y][x + 1], validCells(grid[y][x], 1))
            }
        }
    }
}

function showGrid() {
    // // background(255)
    //         rect(x * 50, y * 50, 40, 40)
    //         textSize(10);
    document.getElementById("parent").innerHTML = ""
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            document.getElementById("parent").innerHTML += `<div id="${y}_${x}"></div>`
            for (let i = 0; i < grid[y][x].length; i++) {
                document.getElementById(`${y}_${x}`).innerHTML += `<button class="border-2 border-red-200" onclick="selectACollapse('${y}_${x}', ${grid[y][x][i]})">${grid[y][x][i]}</button>`
                    //text(grid[y][x][i], x * 50 + i * 10, y * 50 + 10);
            }
        }
    }
}

function selectACollapse(id, c) {
    grid[parseInt(id.split("_")[0])][parseInt(id.split("_")[1])] = [c]
    for (let i = 0; i < 6; i++) collapse()
    showGrid()
}
showGrid()