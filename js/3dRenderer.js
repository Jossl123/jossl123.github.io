var cam
var points = []
var cubes = []
var verticies = []

function setup() {
    createCanvas(windowWidth, windowHeight);
    cam = new Camera()
    cubes.push(new Cube(0, 0, 10, 5, 5, 5))
    cubes.push(new Cube(5, 0, 10, 5, 5, 5))
    cubes.push(new Cube(0, 5, 10, 5, 5, 5))
    cubes.push(new Cube(5, 0, 15, 5, 5, 5))
}

function toScreen(p) {
    var relativePoint = createVector(p.pos.x, p.pos.y, p.pos.z).sub(cam.pos)
    if (relativePoint.z >= 1) {
        var x = relativePoint.x / relativePoint.z * cam.focal_length
        var y = relativePoint.y / relativePoint.z * cam.focal_length
        x *= windowWidth / 2
        x += windowWidth / 2
        y *= windowWidth / 2
        y += windowHeight / 2
        return [x, y]
    }
    return false
}

function draw() {
    background(255)
    keyDown()
    noFill()
    for (let tri of verticies) {
        var v1 = tri.firstPoint.pos.copy().sub(tri.secondPoint.pos)
        var v2 = tri.thirdPoint.pos.copy().sub(tri.firstPoint.pos)
        var crossProduct = v1.cross(v2)
        var scalaire1 = crossProduct.dot(cam.pos.copy().sub(tri.firstPoint.pos))
        var scalaire2 = crossProduct.dot(cam.pos.copy().sub(tri.secondPoint.pos))
        var scalaire3 = crossProduct.dot(cam.pos.copy().sub(tri.thirdPoint.pos))
        if (scalaire1 > 0 && scalaire2 > 0 && scalaire3 > 0) {
            var p0 = toScreen(tri.firstPoint)
            var p1 = toScreen(tri.secondPoint)
            var p2 = toScreen(tri.thirdPoint)
            triangle(p0[0], p0[1], p1[0], p1[1], p2[0], p2[1])
        }
    }
}

class Camera {
    constructor() {
        this.pos = createVector(0, 0, 0)
        this.focal_length = 1
        this.fov = 90
        this.fovRad = 1 / (Math.tan(this.fov * 0.5 * Math.PI / 180))
        this.zNear = 0.1;
        this.zFar = 1000
        this.aRatioWH = windowHeight / windowWidth
        this.dir = createVector(0, 0, 1)
    }
}

class Triangle {
    constructor(firstPoint, secondPoint, thirdPoint) {
        this.firstPoint = firstPoint
        this.secondPoint = secondPoint
        this.thirdPoint = thirdPoint
        this.color = [(Math.abs(this.firstPoint.y) / 3 + 10) + random(0, 20), 100, 100]
    }
}

class Point {
    constructor(x, y, z) {
        this.pos = createVector(x, y, z)
    }
}

class Cube {
    constructor(x, y, z, w, h, l) {
        this.pos = createVector(x, y, z)
        this.w = w;
        this.h = h;
        this.l = l
        this.mesh = []
        var x = this.pos.x
        var y = this.pos.y
        var z = this.pos.z
        var mw = this.w / 2
        var mh = this.h / 2
        var ml = this.l / 2
        var triIndex = points.length
        points.push(new Point(x - mw, y - mh, z + ml))
        points.push(new Point(x + mw, y - mh, z + ml))
        points.push(new Point(x + mw, y - mh, z - ml))
        points.push(new Point(x - mw, y - mh, z - ml))
        points.push(new Point(x - mw, y + mh, z + ml))
        points.push(new Point(x + mw, y + mh, z + ml))
        points.push(new Point(x + mw, y + mh, z - ml))
        points.push(new Point(x - mw, y + mh, z - ml))
        verticies.push(new Triangle(points[triIndex], points[triIndex + 1], points[triIndex + 2]))
        verticies.push(new Triangle(points[triIndex], points[triIndex + 2], points[triIndex + 3]))
        verticies.push(new Triangle(points[triIndex + 4], points[triIndex + 6], points[triIndex + 5]))
        verticies.push(new Triangle(points[triIndex + 4], points[triIndex + 7], points[triIndex + 6]))
        verticies.push(new Triangle(points[triIndex], points[triIndex + 4], points[triIndex + 5]))
        verticies.push(new Triangle(points[triIndex], points[triIndex + 5], points[triIndex + 1]))
        verticies.push(new Triangle(points[triIndex + 2], points[triIndex + 5], points[triIndex + 6]))
        verticies.push(new Triangle(points[triIndex + 2], points[triIndex + 1], points[triIndex + 5]))
        verticies.push(new Triangle(points[triIndex], points[triIndex + 3], points[triIndex + 4]))
        verticies.push(new Triangle(points[triIndex + 7], points[triIndex + 4], points[triIndex + 3]))
        verticies.push(new Triangle(points[triIndex + 7], points[triIndex + 3], points[triIndex + 6]))
        verticies.push(new Triangle(points[triIndex + 2], points[triIndex + 6], points[triIndex + 3]))
    }
}

class Light {
    constructor() {
        this.pos = createVector(0, 0, 0)
    }
}

function keyDown() {
    if (keyIsDown(LEFT_ARROW)) {
        cam.pos.add(-1, 0, 0)
    }
    if (keyIsDown(RIGHT_ARROW)) {
        cam.pos.add(1, 0, 0)
    }
    if (keyIsDown(UP_ARROW)) {
        cam.pos.add(0, -1, 0)
    }
    if (keyIsDown(DOWN_ARROW)) {
        cam.pos.add(0, 1, 0)
    }
    if (keyIsDown(90)) {
        cam.pos.add(0, 0, 1)
    }
    if (keyIsDown(83)) {
        cam.pos.add(0, 0, -1)
    }
}