var origin
var rotateAngle = Math.PI / 30;
var numbers = 10000
var lineLength = 4
var allResults = []

function setup() {
    createCanvas(windowWidth, windowHeight);
    origin = createVector(windowWidth / 2, windowHeight)
    background(0)
    for (let nb = 1; nb <= numbers; nb++) {
        var currentNb = nb
        var results = [currentNb]
        while (currentNb != 1) {
            currentNb = conjecture(currentNb)
            results.push(currentNb)
        }
        results.reverse()
        allResults.push(results)
    }
}
var itt = 0

function draw() {
    if (itt < allResults.length) {
        var results = allResults[itt]
        var dir = createVector(0, -1)
        var pos = createVector(origin.x, origin.y)
        var prevPos = pos
        for (let j = 0; j < results.length; j++) {
            if (results[j] % 2 == 0) {
                dir.x = Math.cos(rotateAngle) * dir.x - Math.sin(rotateAngle) * dir.y
                dir.y = Math.sin(rotateAngle) * dir.x + Math.cos(rotateAngle) * dir.y
                dir.setMag(lineLength)
                pos.add(dir)
            } else {
                dir.x = Math.cos(-rotateAngle) * dir.x - Math.sin(-rotateAngle) * dir.y
                dir.y = Math.sin(-rotateAngle) * dir.x + Math.cos(-rotateAngle) * dir.y
                dir.setMag(lineLength)
                pos.add(dir)
            }
            stroke((results.length - j + 1) * 1 / results.length * 255, (results.length - j + 1) * 1 / results.length * 100 + 155, 255 - (j * 1 / results.length * 255))
            strokeWeight(1)
            line(pos.x, pos.y, prevPos.x, prevPos.y)
            prevPos = createVector(pos.x, pos.y)
        }
        itt++
    }
}

function conjecture(nb) {
    if (nb % 2 == 0) {
        return nb / 2
    } else {
        return (nb * 3 + 1) / 2
    }
}