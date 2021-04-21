var origin
var rotateAngle = 10
var numbers = 10

function setup() {
    createCanvas(windowWidth, windowHeight);
    origin = createVector(windowWidth / 2, windowHeight)
    background(0)
    for (let nb = 1; nb <= numbers; nb++) {
        var currentNb = nb
        var dir = createVector(0, -1)
        var pos = createVector(origin.x, origin.y)
        var prevPos = pos
        var iter = 0
        while (conjecture(currentNb) != 1) {
            if (currentNb % 2 == 0) {
                dir.x = Math.cos(rotateAngle) * dir.x - Math.sin(rotateAngle) * dir.y
                dir.y = Math.sin(rotateAngle) * dir.x + Math.cos(rotateAngle) * dir.y
                dir.setMag(10)
                pos.add(dir)
            } else {
                dir.x = Math.cos(-rotateAngle) * dir.x - Math.sin(-rotateAngle) * dir.y
                dir.y = Math.sin(-rotateAngle) * dir.x + Math.cos(-rotateAngle) * dir.y
                dir.setMag(10)
                pos.add(dir)
            }
            fill(1 / numbers * nb * 255)
            stroke(1 / numbers * nb * 255)
            strokeWeight(1)
            line(pos.x, pos.y, prevPos.x, prevPos.y)
            currentNb = conjecture(currentNb)
            prevPos = createVector(pos.x, pos.y)
        }
    }
}

function draw() {}

function conjecture(nb) {
    if (nb % 2 == 0) {
        return nb / 2
    } else {
        return nb * 3 + 1
    }
}