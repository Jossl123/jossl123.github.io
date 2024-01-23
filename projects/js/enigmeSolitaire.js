var grid = new Array(10).fill(0).map(() => new Array(30).fill(0));
var steps = []
var currentPointCHoisingDir = false

window.onload = function() {
    drawGrid()
}

function addPoint(x, y, e) {
    if (currentPointCHoisingDir) {
        var t = e.srcElement.id.split("_")
        startX = t[1]
        startY = t[2]
        var cx = currentPointCHoisingDir[0]
        var cy = currentPointCHoisingDir[1]
        var sx = startX - cx
        var sy = startY - cy
        if (sx == 1 && sy == 0) {

        } else if (sx == -1 && sy == 0) {

        } else if (sx == 0 && sy == 1) {

        } else if (sx == 0 && sy == -1) {

        }
        document.getElementById(`point_${cx}_${cy}`).classList.add('bg-yellow-600');
        document.getElementById(`point_${cx}_${cy}`).classList.remove('bg-red-600');
        currentPointCHoisingDir = false
    } else if (grid[y][x] == 1) { //si il y a un pion
        var t = e.srcElement.id.split("_")
        startX = t[1]
        startY = t[2]
        currentPointCHoisingDir = [startX, startY]
        if (y > 0) {
            document.getElementById(`point_${x}_${y-1}`).classList.add('bg-green-600');
            document.getElementById(`point_${x}_${y-1}`).classList.remove('bg-indigo-600');
        }
        if (y < grid.length - 1) {
            document.getElementById(`point_${x}_${y+1}`).classList.add('bg-green-600');
            document.getElementById(`point_${x}_${y+1}`).classList.remove('bg-indigo-600');
        }
        if (x > 0) {
            document.getElementById(`point_${x-1}_${y}`).classList.add('bg-green-600');
            document.getElementById(`point_${x-1}_${y}`).classList.remove('bg-indigo-600');
        }
        if (x < grid[y].length) {
            document.getElementById(`point_${x+1}_${y}`).classList.add('bg-green-600');
            document.getElementById(`point_${x+1}_${y}`).classList.remove('bg-indigo-600');
        }
        document.getElementById(`point_${x}_${y}`).classList.add('bg-red-600');
        document.getElementById(`point_${x}_${y}`).classList.remove('bg-yellow-600');
        // grid[y][x] = 0
        // document.getElementById(`point_${x}_${y}`).classList.add('bg-indigo-600');
        // document.getElementById(`point_${x}_${y}`).classList.remove('bg-red-600');
    } else {
        grid[y][x] = 1
        document.getElementById(`point_${x}_${y}`).classList.add('bg-yellow-600');
        document.getElementById(`point_${x}_${y}`).classList.remove('bg-indigo-600');
    }
}

function drawGrid() {
    document.getElementById("grid").innerHTML = ``
    for (let y = 0; y < 6; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            document.getElementById("grid").innerHTML += `<div class="rounded-full bg-indigo-400 w-10 h-10"></div>`
        }
    }
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            document.getElementById("grid").innerHTML += `<button onclick="addPoint(${x}, ${y}, event)" id="point_${x}_${y}" class="rounded-full bg-indigo-600 w-10 h-10"></button>`
        }
    }
}

// let moved
// let srcElement
// let downListener = () => {
//     moved = false
// }
// document.addEventListener('mousedown', downListener)
// let moveListener = () => {
//     moved = true
// }
// document.addEventListener('mousemove', moveListener)
// let upListener = (event) => {
//     if (moved) {
//         var idStart = event.srcElement.id
//         var idTarget = event.target.id
//         if (!idStart.includes("point") || !idTarget.includes("point")) {
//             return console.log("no good points")
//         }
//         console.log(event)
//         idStart = idStart.split("_")
//         idTarget = idTarget.split("_")
//         startX = idStart[1]
//         startY = idStart[2]
//         targetX = idTarget[1]
//         targetY = idTarget[2]
//         console.log(idStart, idTarget, srcElement)
//     }
// }
// document.addEventListener('mouseup', upListener)

// function dragBegin(e) {
//     srcElement = e.srcElement.id
// }