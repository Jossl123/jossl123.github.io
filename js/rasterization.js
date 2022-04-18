var cam
var points = []
var cubes = []
var verticies = []
var speed = 0.1

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

function worldToCamPos(p) {
    var MP = pointToMatrix(p)
    MP = mult4x2Matrix(cam.M, MP)
    return createVector(MP[0][0], MP[1][0], MP[2][0])
}

function render() {
    var zOrderToDraw = []
    var zOrderIndex = []
    for (let tri of verticies) {
        var relativeTri = [worldToCamPos(tri.firstPoint), worldToCamPos(tri.secondPoint), worldToCamPos(tri.thirdPoint)]
        var v1 = relativeTri[0].copy().sub(relativeTri[1])
        var v2 = relativeTri[2].copy().sub(relativeTri[0])
        var normalVector = v1.cross(v2)
        var toPoint = cam.Position().copy().sub(relativeTri[0])
        var scalaire = normalVector.dot(toPoint)
        var centerPoint = relativeTri[0].copy().add(relativeTri[1].copy().add(relativeTri[2])).div(3)
        var scalaireLight = ((worldToCamPos(light.pos).sub(relativeTri[0])).dot(normalVector) / light.pos.mag()) / normalVector.mag();
        if (scalaire > 0) {
            var distToCam = centerPoint.copy().sub(cam.Position()).magSq();
            var p0 = toScreen(relativeTri[0])
            var p1 = toScreen(relativeTri[1])
            var p2 = toScreen(relativeTri[2])
            var al = -clamp(scalaireLight, -1, 1)
                //var c = [-al * 50 + tri.color[0], -al * 50 + tri.color[1], -al * 50 + tri.color[2]]
            var c = mixColors([0, 0, 0], tri.color, (al + 1) / 2)
            zOrderIndex.push(distToCam)
            zOrderToDraw.push([p0, p1, p2, distToCam, c])
        }
    }
    zOrderToDraw.sort((a, b) => b[3] - a[3])
    for (let i = 0; i < zOrderToDraw.length; i++) {
        fill(zOrderToDraw[i][4][0], zOrderToDraw[i][4][1], zOrderToDraw[i][4][2])
        stroke(zOrderToDraw[i][4][0], zOrderToDraw[i][4][1], zOrderToDraw[i][4][2])
        triangle(zOrderToDraw[i][0][0], zOrderToDraw[i][0][1], zOrderToDraw[i][1][0], zOrderToDraw[i][1][1], zOrderToDraw[i][2][0], zOrderToDraw[i][2][1])
    }
}

class Camera {
    constructor() {
        this.M = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 6],
            [0, 0, 0, 1],
        ]
    }
    Position() {
        return createVector(-this.M[0][3], -this.M[1][3], -this.M[2][3])
    }
}

class Triangle {
    constructor(firstPoint, secondPoint, thirdPoint, c) {
        this.firstPoint = firstPoint
        this.secondPoint = secondPoint
        this.thirdPoint = thirdPoint
        this.color = c
    }
}

class Light {
    constructor(x, y, z) {
        this.pos = createVector(10, 4, -5)
    }
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
    if (keyIsDown(69)) {
        cam.M = mult4x4Matrix(cam.M, rotateMatrixY(-Math.PI / 20))
        haveToRender = true
    }
    if (haveToRender) {
        update()
    }
}