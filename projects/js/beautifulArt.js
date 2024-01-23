var pointsNb = 100
var points = []
var circleRadius
var center
var rotateAngle = Math.PI * 2 / pointsNb

function setup() {
    createCanvas(windowWidth, windowHeight)
    background(0)
    circleRadius = windowWidth / 3
    if (circleRadius > windowHeight / 3) {
        circleRadius = windowHeight / 3
    }
    center = createVector(windowWidth / 2, windowHeight / 2)
    for (let i = 0; i <= pointsNb; i++) {
        for (let j = 0; j < 10; j++) {
            var angle = rotateAngle * i
            var vector = createVector(circleRadius, 0).rotate(angle)
            var finalPos = createVector(center.x, center.y).add(vector)
            points.push(new Point(finalPos, angle + j * Math.PI / 20, 200))
        }
    }
}

function draw() {
    background(0, 60)
    for (let point of points) {
        point.update()
    }
}

class Point {
    constructor(origin, angle, r) {
        this.origin = origin;
        this.rotateAngle = createVector(r, 0).rotate(angle)
        this.r = r
        this.color = createVector(250, 0, 0)
    }
    update() {
        this.color.x = this.rotateAngle.x / this.r * 255
        this.color.y = this.rotateAngle.y / this.r * 155 + 100
        this.color.z = (this.rotateAngle.x + this.rotateAngle.y) / this.r * 2 * 200 + 55
        this.pos = createVector(this.origin.x, this.origin.y).add(this.rotateAngle)
        fill(Math.abs(this.color.x), Math.abs(this.color.y), Math.abs(this.color.z))
        noStroke()
        circle(this.pos.x, this.pos.y, 4)
        this.rotateAngle.rotate(Math.PI / 200)
    }
}