var points = []
var verticiesNb = 20
var triangles = []
var verticiesLength = 100

function setup() {
    createCanvas(windowWidth, windowHeight);
    for (let y = 0; y < verticiesNb + 1; y++) {
        for (let x = 0; x < verticiesNb + 1; x++) {
            points.push(new Point(x * verticiesLength, y * verticiesLength))
        }
    }
    var triangleIndex = 0
    for (let y = 0; y < verticiesNb + 1; y++) {
        for (let x = 0; x < verticiesNb + 1; x++) {
            if (x != verticiesNb && y != verticiesNb) {
                triangles.push(new Triangle(points[triangleIndex], points[triangleIndex + verticiesNb + 2], points[triangleIndex + verticiesNb + 1]))
                triangles.push(new Triangle(points[triangleIndex], points[triangleIndex + verticiesNb + 2], points[triangleIndex + 1]))
            }
            triangleIndex++
        }
    }
}

function draw() {
    background(255)
    for (let i = 0; i < triangles.length; i++) {
        triangles[i].update()
    }
    for (let i = 0; i < points.length; i++) {
        points[i].update()
    }
}

class Triangle {
    constructor(firstPoint, secondPoint, thirdPoint) {
        this.firstPoint = firstPoint
        this.secondPoint = secondPoint
        this.thirdPoint = thirdPoint
        this.color = [(Math.abs(this.firstPoint.y) / 3 + 10) + random(0, 20), 100, 100]
    }
    update() {
        this.render()
    }
    render() {
        fill(this.color[0], this.color[1], this.color[2])
        stroke(this.color[0], this.color[1], this.color[2])
        triangle(this.firstPoint.x, this.firstPoint.y, this.secondPoint.x, this.secondPoint.y, this.thirdPoint.x, this.thirdPoint.y)
    }
}

class Point {
    constructor(x, y) {
        this.x = x - 100;
        this.y = y - 100;
        this.velocity = p5.Vector.random2D()
        this.acceleration = createVector(0, 0)
        this.rotateAngle = 0.04
        this.r = 5
    }
    update() {
        this.velocity.x = Math.cos(this.rotateAngle) * this.velocity.x - Math.sin(this.rotateAngle) * this.velocity.y
        this.velocity.y = Math.sin(this.rotateAngle) * this.velocity.x + Math.cos(this.rotateAngle) * this.velocity.y
        this.render()
        this.acceleration = this.velocity
        this.x += this.acceleration.x
        this.y += this.acceleration.y
        this.rotateAngle += random(0, 0.1)
    }
    render() {
        fill(200)
        circle(this.x, this.y, this.r)
    }
}