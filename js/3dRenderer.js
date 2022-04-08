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
        // cubes.push(new Cube(0, 0, 10, 5, 5, 5))
        // cubes.push(new Cube(5.1, 0, 10, 5, 5, 5))
        // cubes.push(new Cube(0, 5, 10, 5, 5, 5))
        // cubes.push(new Cube(5, 0, 15, 5, 5, 5))
    cplane(createVector(0, 1, 5), 2, 5, createVector(0, 1, 0))
    cplane(createVector(0, 1, 5), 2, 5, createVector(1, 0, 0))
    cplane(createVector(0, 1, 5), 2, 5, createVector(0, 0, 1))
    cplane(createVector(0, 1, 5), 2, 5, createVector(0, -1, 0))
    cplane(createVector(0, 1, 5), 2, 5, createVector(-1, 0, 0))
    cplane(createVector(0, 1, 5), 2, 5, createVector(0, 0, -1))
    render()
}

function toScreen(p) {
    var relativePoint = p.copy().sub(cam.Position())
    if (relativePoint.z > 0) {
        var x = relativePoint.x / relativePoint.z
        var y = relativePoint.y / relativePoint.z
        x *= windowWidth / 2
        x += windowWidth / 2
        y *= windowWidth / 2
        y += windowHeight / 2
        return [x, y]
    }
    return false
}

function pointToMatrix(p) {
    return [
        [p.x],
        [p.y],
        [p.z],
        [1]
    ]
}

function pointToMatrix4x4(p) {
    return [
        [1, 0, 0, p.x],
        [0, 1, 0, p.y],
        [0, 0, 1, p.z],
        [0, 0, 0, 1],
    ]
}

function worldToCamPos(p) {
    var MP = pointToMatrix(p)
    MP = mult4x2Matrix(cam.M, MP)
    return createVector(MP[0][0], MP[1][0], MP[2][0])
}

function render() {
    background(255)
    var zOrderToDraw = []
    var zOrderIndex = []
    for (let tri of verticies) {
        var relativeTri = [worldToCamPos(tri.firstPoint.pos), worldToCamPos(tri.secondPoint.pos), worldToCamPos(tri.thirdPoint.pos)]
        var v1 = relativeTri[0].copy().sub(relativeTri[1])
        var v2 = relativeTri[2].copy().sub(relativeTri[0])
        var crossProduct = v1.cross(v2)
        var toPoint = cam.Position().copy().sub(relativeTri[0])
        var scalaire1 = crossProduct.dot(toPoint)
        var centerPoint = relativeTri[0].copy().add(relativeTri[1].copy().add(relativeTri[2])).div(3)
        if (scalaire1 > 0) {
            var distToCam = centerPoint.copy().sub(cam.Position()).magSq();
            var p0 = toScreen(relativeTri[0])
            var p1 = toScreen(relativeTri[1])
            var p2 = toScreen(relativeTri[2])
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

function rotateMatrixY(a) {
    return [
        [Math.cos(a), 0, Math.sin(a), 0],
        [0, 1, 0, 0],
        [-Math.sin(a), 0, Math.cos(a), 0],
        [0, 0, 0, 1]
    ]
}

class Camera {
    constructor() {
        this.M = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ]
    }
    Position() {
        return createVector(-this.M[0][3], -this.M[1][3], -this.M[2][3])
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

class Light {
    constructor() {
        this.pos = createVector(0, 0, 0)
    }
}

function mult4x4Matrix(m1, m2) {
    var m00 = m1[0][0] * m2[0][0] + m1[0][1] * m2[1][0] + m1[0][2] * m2[2][0] + m1[0][3] * m2[3][0]
    var m01 = m1[0][0] * m2[0][1] + m1[0][1] * m2[1][1] + m1[0][2] * m2[2][1] + m1[0][3] * m2[3][1]
    var m02 = m1[0][0] * m2[0][2] + m1[0][1] * m2[1][2] + m1[0][2] * m2[2][2] + m1[0][3] * m2[3][2]
    var m03 = m1[0][0] * m2[0][3] + m1[0][1] * m2[1][3] + m1[0][2] * m2[2][3] + m1[0][3] * m2[3][3]

    var m10 = m1[1][0] * m2[0][0] + m1[1][1] * m2[1][0] + m1[1][2] * m2[2][0] + m1[1][3] * m2[3][0]
    var m11 = m1[1][0] * m2[0][1] + m1[1][1] * m2[1][1] + m1[1][2] * m2[2][1] + m1[1][3] * m2[3][1]
    var m12 = m1[1][0] * m2[0][2] + m1[1][1] * m2[1][2] + m1[1][2] * m2[2][2] + m1[1][3] * m2[3][2]
    var m13 = m1[1][0] * m2[0][3] + m1[1][1] * m2[1][3] + m1[1][2] * m2[2][3] + m1[1][3] * m2[3][3]

    var m20 = m1[2][0] * m2[0][0] + m1[2][1] * m2[1][0] + m1[2][2] * m2[2][0] + m1[2][3] * m2[3][0]
    var m21 = m1[2][0] * m2[0][1] + m1[2][1] * m2[1][1] + m1[2][2] * m2[2][1] + m1[2][3] * m2[3][1]
    var m22 = m1[2][0] * m2[0][2] + m1[2][1] * m2[1][2] + m1[2][2] * m2[2][2] + m1[2][3] * m2[3][2]
    var m23 = m1[2][0] * m2[0][3] + m1[2][1] * m2[1][3] + m1[2][2] * m2[2][3] + m1[2][3] * m2[3][3]

    var m30 = m1[3][0] * m2[0][0] + m1[3][1] * m2[1][0] + m1[3][2] * m2[2][0] + m1[3][3] * m2[3][0]
    var m31 = m1[3][0] * m2[0][1] + m1[3][1] * m2[1][1] + m1[3][2] * m2[2][1] + m1[3][3] * m2[3][1]
    var m32 = m1[3][0] * m2[0][2] + m1[3][1] * m2[1][2] + m1[3][2] * m2[2][2] + m1[3][3] * m2[3][2]
    var m33 = m1[3][0] * m2[0][3] + m1[3][1] * m2[1][3] + m1[3][2] * m2[2][3] + m1[3][3] * m2[3][3]
    var mf = [
        [m00, m01, m02, m03],
        [m10, m11, m12, m13],
        [m20, m21, m22, m23],
        [m30, m31, m32, m33]
    ]
    return mf
}

function mult4x2Matrix(m1, m2) {
    var m00 = m1[0][0] * m2[0][0] + m1[0][1] * m2[1][0] + m1[0][2] * m2[2][0] + m1[0][3] * m2[3][0]
    var m10 = m1[1][0] * m2[0][0] + m1[1][1] * m2[1][0] + m1[1][2] * m2[2][0] + m1[1][3] * m2[3][0]
    var m20 = m1[2][0] * m2[0][0] + m1[2][1] * m2[1][0] + m1[2][2] * m2[2][0] + m1[2][3] * m2[3][0]
    var m30 = m1[3][0] * m2[0][0] + m1[3][1] * m2[1][0] + m1[3][2] * m2[2][0] + m1[3][3] * m2[3][0]
    var mf = [
        [m00],
        [m10],
        [m20],
        [m30]
    ]
    return mf
}

function keyDown() {
    var haveToRender = false
    if (keyIsDown(81)) {
        cam.M[0][3] += speed
        haveToRender = true
    }
    if (keyIsDown(68)) {
        cam.M[0][3] -= speed
        haveToRender = true
    }
    if (keyIsDown(32) && !keyIsDown(16)) {
        cam.M[1][3] += speed / 2
        haveToRender = true
    }
    if (keyIsDown(32) && keyIsDown(16)) {
        cam.M[1][3] -= speed / 2
        haveToRender = true
    }
    if (keyIsDown(90)) {
        cam.M[2][3] -= speed
        haveToRender = true
    }
    if (keyIsDown(83)) {
        cam.M[2][3] += speed
        haveToRender = true
    }
    if (keyIsDown(65)) {
        cam.M = mult4x4Matrix(cam.M, rotateMatrixY(Math.PI / 20))
        haveToRender = true
    }
    if (haveToRender) render()
}