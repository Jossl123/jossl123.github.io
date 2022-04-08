var cam
var points = []
var cubes = []
var verticies = []
var speed = 0.1

function cplane(p, s, r, dir) {
    if (r <= 1) return
    var triIndex = points.length
    var vA = createVector(dir.y, dir.z, dir.x)
    var vB = vA.cross(dir)
    for (let y = 0; y < r; y++) {
        for (let x = 0; x < r; x++) {
            var percent = createVector(x, y).div(r - 1)
            var pointOnCube = dir.copy().add(vA.copy().mult((percent.x - 0.5) * 2)).add(vB.copy().mult((percent.y - 0.5) * 2)).mult(s / r)
            pointOnCube.setMag(s)
            pointOnCube.add(p)
            points.push(new Point(pointOnCube.x, pointOnCube.y, pointOnCube.z))
        }
    }
    for (let y = 0; y < r - 1; y++) {
        for (let x = 0; x < r - 1; x++) {
            var i = x + y * r
            verticies.push(new Triangle(points[triIndex + i], points[triIndex + i + 1], points[triIndex + i + r + 1]))
            verticies.push(new Triangle(points[triIndex + i], points[triIndex + r + i + 1], points[triIndex + i + r]))
        }
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    cam = new Camera()
        //cubes.push(new Cube(0, 0, 10, 5, 5, 5))
        //cubes.push(new Cube(5.1, 0, 10, 5, 5, 5))
        //cubes.push(new Cube(0, 5, 10, 5, 5, 5))
        //cubes.push(new Cube(5, 0, 15, 5, 5, 5))
    cplane(createVector(0, 1, 5), 2, 2, createVector(0, 1, 0))
    cplane(createVector(0, 1, 5), 2, 2, createVector(1, 0, 0))
    cplane(createVector(0, 1, 5), 2, 2, createVector(0, 0, 1))
    cplane(createVector(0, 1, 5), 2, 2, createVector(0, -1, 0))
    cplane(createVector(0, 1, 5), 2, 2, createVector(-1, 0, 0))
    cplane(createVector(0, 1, 5), 2, 2, createVector(0, 0, -1))
    render()
}

function toScreen(p) {
    var relativePoint = createVector(p.x, p.y, p.z).sub(cam.pos)
    if (relativePoint.z > 0) {
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

function render() {
    background(255)
    var zOrderToDraw = []
    var zOrderIndex = []
    for (let tri of verticies) {
        var v1 = tri.firstPoint.pos.copy().sub(tri.secondPoint.pos)
        var v2 = tri.thirdPoint.pos.copy().sub(tri.firstPoint.pos)
        var crossProduct = v1.cross(v2)
        var toPoint = cam.pos.copy().sub(tri.firstPoint.pos)
        var scalaire1 = crossProduct.dot(toPoint)
        var centerPoint = tri.firstPoint.pos.copy().add(tri.secondPoint.pos.copy().add(tri.thirdPoint.pos)).div(3)
        if (scalaire1 > 0) {
            var distToCam = centerPoint.copy().sub(cam.pos).magSq();
            var p0 = toScreen(tri.firstPoint.pos)
            var p1 = toScreen(tri.secondPoint.pos)
            var p2 = toScreen(tri.thirdPoint.pos)
            zOrderIndex.push(distToCam)
            zOrderToDraw.push([p0, p1, p2, distToCam, tri.color])
        }
    }
    zOrderToDraw.sort((a, b) => b[3] - a[3])
    for (let i = 0; i < zOrderToDraw.length; i++) {
        fill(zOrderToDraw[i][4][0], zOrderToDraw[i][4][1], zOrderToDraw[i][4][2])
        stroke(zOrderToDraw[i][4][0], zOrderToDraw[i][4][1], zOrderToDraw[i][4][2])
        triangle(zOrderToDraw[i][0][0], zOrderToDraw[i][0][1], zOrderToDraw[i][1][0], zOrderToDraw[i][1][1], zOrderToDraw[i][2][0], zOrderToDraw[i][2][1])
    }
}

function draw() {
    keyDown()
}

function VrotateY(v, a) {
    var x = v.x * Math.cos(a) + v.z * Math.sin(a)
    var z = -v.x * Math.sin(a) + v.z * Math.cos(a)
    return createVector(x, v.y, z)
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
        this.color = [100 + random(20), 100, 100]
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
    var haveToRender = false
    if (keyIsDown(LEFT_ARROW)) {
        cam.pos.add(-speed, 0, 0)
        haveToRender = true
    }
    if (keyIsDown(RIGHT_ARROW)) {
        cam.pos.add(speed, 0, 0)
        haveToRender = true
    }
    if (keyIsDown(UP_ARROW)) {
        cam.pos.add(0, -speed, 0)
        haveToRender = true
    }
    if (keyIsDown(DOWN_ARROW)) {
        cam.pos.add(0, speed, 0)
        haveToRender = true
    }
    if (keyIsDown(90)) {
        cam.pos.add(0, 0, speed)
        haveToRender = true
    }
    if (keyIsDown(83)) {
        cam.pos.add(0, 0, -speed)
        haveToRender = true
    }
    if (keyIsDown(65)) {
        cam.dir = VrotateY(cam.dir, 10)
        haveToRender = true
    }
    if (haveToRender) render()
}