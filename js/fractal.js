var points = []
var verticiesLenght
var currentPoint
var verticiesNb = Math.floor(prompt("nb"))

function setup() {
    createCanvas(windowWidth, windowHeight)
    verticiesLenght = height / (verticiesNb / 3)
    currentPoint = new Point(width / 2, height / 2)
    points.push(new Point(width / 2 + verticiesLenght / 2, 5))
    var dir = createVector(-1, 0).setMag(verticiesLenght)
    for (let i = 0; i < verticiesNb - 1; i++) {
        var v = points[points.length - 1].pos.copy()
        v.add(dir)
        points.push(new Point(v.x, v.y))
        dir.rotate(-(Math.PI * 2 / verticiesNb))
    }

    for (let point of points) {
        point.render()
    }
}

function draw() {
    for (let i = 0; i < 1000; i++) {
        var v = random(points)
        currentPoint = new Point((currentPoint.pos.x + v.pos.x) / 2, (currentPoint.pos.y + v.pos.y) / 2)
        circle(currentPoint.pos.x, currentPoint.pos.y, 1)
    }
}

class Point {
    constructor(x, y) {
        this.pos = createVector(x, y)
    }
    render() {
        circle(this.pos.x, this.pos.y, 1)
    }
}