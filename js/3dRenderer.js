var cam
var points = []
var cubes = []
var triangles = []
var mat4x4Projection = []

function setup() {
    createCanvas(windowWidth, windowHeight);
    cam = new Camera()
    cubes.push(new Cube(0, 0, 300, 100, 100, 100))
    for (let y = 0; y < 4; y++) {
        mat4x4Projection[y] = [0, 0, 0, 0]
    }
    mat4x4Projection[0][0] = cam.aRatioWH * cam.fovRad
    mat4x4Projection[1][1] = cam.fovRad
    mat4x4Projection[2][2] = cam.zFar / (cam.zFar - cam.zNear)
    mat4x4Projection[2][3] = 1
    mat4x4Projection[3][2] = (-cam.zFar * cam.zNear) / (cam.zFar - cam.zNear)
}

function draw() {
    background(255)
    keyDown()
    var projectedPoints = []
    for (let point of points) {
        // point.pos = createVector(point.pos.x * Math.cos(0.01) - point.pos.y * Math.sin(0.01), point.pos.y * Math.cos(0.01) + point.pos.x * Math.sin(0.01), point.pos.z)
        // point.pos = createVector(point.pos.x, point.pos.y * Math.cos(0.02) - point.pos.z * Math.sin(0.02), point.pos.z * Math.cos(0.02) + point.pos.y * Math.sin(0.02))
        // point.pos.add(point.pos.x * Math.cos(0.02) - point.pos.z * Math.sin(0.02), point.pos.y, point.pos.z * Math.cos(0.02) + point.pos.x * Math.sin(0.02))
        var projected = multiplyProjectedMatrix(createVector(point.pos.x, point.pos.y, point.pos.z).sub(cam.pos))
        projected.add(1, 1, 1);
        projected.x *= 0.5 * windowWidth
        projected.y *= 0.5 * windowHeight
        projectedPoints.push(projected)
            // var dist = Math.sqrt((cam.pos.x - point.pos.x) * (cam.pos.x - point.pos.x) + (cam.pos.y - point.pos.y) * (cam.pos.y - point.pos.y) + (cam.pos.z - point.pos.z) * (cam.pos.z - point.pos.z))
            // var relativePoint = createVector(point.pos.x, point.pos.y, point.pos.z).sub(cam.pos)
            // if (dist > 0) {
            //     circle(relativePoint.x / relativePoint.z * cam.focal_length, relativePoint.y / relativePoint.z * cam.focal_length, 10)
            // }
    }
    new Triangle(projectedPoints[0], projectedPoints[1], projectedPoints[2]).update()
    new Triangle(projectedPoints[0], projectedPoints[3], projectedPoints[2]).update()
    new Triangle(projectedPoints[4], projectedPoints[5], projectedPoints[6]).update()
    new Triangle(projectedPoints[4], projectedPoints[7], projectedPoints[6]).update()
    new Triangle(projectedPoints[0], projectedPoints[4], projectedPoints[3]).update()
    new Triangle(projectedPoints[7], projectedPoints[4], projectedPoints[3]).update()
    new Triangle(projectedPoints[3], projectedPoints[2], projectedPoints[7]).update()
    new Triangle(projectedPoints[6], projectedPoints[2], projectedPoints[7]).update()
    new Triangle(projectedPoints[5], projectedPoints[2], projectedPoints[6]).update()
    new Triangle(projectedPoints[5], projectedPoints[2], projectedPoints[1]).update()
    new Triangle(projectedPoints[0], projectedPoints[1], projectedPoints[4]).update()
    new Triangle(projectedPoints[5], projectedPoints[1], projectedPoints[4]).update()
}

class Camera {
    constructor() {
        this.pos = createVector(0, 0, 0)
        this.focal_length = 100
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
    update() {
        this.render()
    }
    render() {
        noFill()
        stroke(this.color[0], this.color[1], this.color[2])
        triangle(this.firstPoint.x, this.firstPoint.y, this.secondPoint.x, this.secondPoint.y, this.thirdPoint.x, this.thirdPoint.y)
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
        var triIndex = triangles.length
        points.push(new Point(x - mw, y - mh, z + ml))
        points.push(new Point(x + mw, y - mh, z + ml))
        points.push(new Point(x + mw, y - mh, z - ml))
        points.push(new Point(x - mw, y - mh, z - ml))
        points.push(new Point(x - mw, y + mh, z + ml))
        points.push(new Point(x + mw, y + mh, z + ml))
        points.push(new Point(x + mw, y + mh, z - ml))
        points.push(new Point(x - mw, y + mh, z - ml))
        this.mesh.push(new Triangle(points[triIndex], points[triIndex + 1], points[triIndex + 2]))
    }
    show() {
        for (let tri of this.mesh) {
            tri.update()
        }
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

function multiplyProjectedMatrix(vector) {
    var finalVector = createVector(0, 0, 0)
    finalVector.x = mat4x4Projection[0][0] * vector.x + mat4x4Projection[1][0] * vector.y + mat4x4Projection[2][0] * vector.z + mat4x4Projection[3][0]
    finalVector.y = mat4x4Projection[0][1] * vector.x + mat4x4Projection[1][1] * vector.y + mat4x4Projection[2][1] * vector.z + mat4x4Projection[3][1]
    finalVector.z = mat4x4Projection[0][2] * vector.x + mat4x4Projection[1][2] * vector.y + mat4x4Projection[2][2] * vector.z + mat4x4Projection[3][2]
    var w = mat4x4Projection[0][3] * vector.x + mat4x4Projection[1][3] * vector.y + mat4x4Projection[2][3] * vector.z + mat4x4Projection[3][3]
    if (w != 0) finalVector.div(w)
    return finalVector
}