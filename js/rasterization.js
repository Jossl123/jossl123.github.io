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

function mixColors(c1, c2, percent) {
    return [c1[0] * percent + c2[0] * (1 - percent), c1[1] * percent + c2[1] * (1 - percent), c1[2] * percent + c2[2] * (1 - percent)]
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
    constructor(firstPoint, secondPoint, thirdPoint, c) {
        this.firstPoint = firstPoint
        this.secondPoint = secondPoint
        this.thirdPoint = thirdPoint
        this.color = c
    }
}

class Light {
    constructor(x, y, z) {
        this.pos = createVector(10, 0, 0)
    }
}

function planeFaceC(p, s, r, dir, c) {
    if (r <= 1) return
    var triIndex = points.length
    var vA = createVector(dir.y, dir.z, dir.x)
    var vB = vA.cross(dir)
    for (let y = 0; y < r; y++) {
        for (let x = 0; x < r; x++) {
            var percent = createVector(x, y).div(r - 1)
            var pointOnCube = dir.copy().add(vA.copy().mult((percent.x - 0.5) * 2)).add(vB.copy().mult((percent.y - 0.5) * 2)).mult(s / r)
            pointOnCube.setMag(s)
                //pointOnCube.setMag(s + Math.sin((pointOnCube.x * pointOnCube.y) * 5) / 10) // cool ball
                //pointOnCube.setMag(s + Math.sin((pointOnCube.x + pointOnCube.y) * 5) / 10) // cool ball
            var pn = 0
            for (let i = 0; i < 6; i++) {
                pn += perlin.get(pointOnCube.x * pointOnCube.z / 2 * 2 ** i + i * 10, pointOnCube.y * pointOnCube.z / 2 * 2 ** i + i * 15) / 2 ** i
            }
            var oceanLvl = 0.5
                // var n = (1 - Math.abs(Math.sin(pn))) ** 2
                // n = Math.max(s + oceanLvl, s + n / 1.9)
                // var nc = [(n - (s + oceanLvl)) * 255, 255, 0] // max value = 2/1.6*s
                // if (n == s + oceanLvl) nc = [0, 0, 200]
            n = (1 - Math.abs(Math.sin(pn))) ** 2
            n = Math.max(oceanLvl, n)
            var nc = [(1 - (n * 2 - 1)) * 255, 255, 0] // max value = 2/1.6*s
            if (n <= 0.5) nc = [0, 0, 200]
            pointOnCube.setMag(n + s)
            pointOnCube.add(p)
            points.push([createVector(pointOnCube.x, pointOnCube.y, pointOnCube.z), nc]) //add point
        }
    }
    for (let y = 0; y < r - 1; y++) {
        for (let x = 0; x < r - 1; x++) {
            var i = x + y * r
            verticies.push(new Triangle(points[triIndex + i][0], points[triIndex + i + 1][0], points[triIndex + i + r + 1][0], points[triIndex + i + 1][1]))
            verticies.push(new Triangle(points[triIndex + i][0], points[triIndex + r + i + 1][0], points[triIndex + i + r][0], points[triIndex + i][1]))
        }
    }
}

function planeFace(p, r, mins, maxs, oceanLvl, dir) {
    if (r <= 1) return
    var triIndex = points.length
    var vA = createVector(dir.y, dir.z, dir.x)
    var vB = vA.cross(dir)
    for (let y = 0; y < r; y++) {
        for (let x = 0; x < r; x++) {
            var percent = createVector(x, y).div(r - 1)
            var pointOnCube = dir.copy().add(vA.copy().mult((percent.x - 0.5) * 2)).add(vB.copy().mult((percent.y - 0.5) * 2)).mult(mins / r)
            pointOnCube.setMag(1)
                //pointOnCube.setMag(s + Math.sin((pointOnCube.x * pointOnCube.y) * 5) / 10) // cool ball
                //pointOnCube.setMag(s + Math.sin((pointOnCube.x + pointOnCube.y) * 5) / 10) // cool ball
            var n = HandleNoiseHeight(pointOnCube, 10)
                // n = Math.max(oceanLvl, n)
                //var nc = [(1 - (n * 2 - 1)) * 255, 255, 0] // max value = 2/1.6*s
            var mask = HandleNoiseHeight(pointOnCube, 2)
            mask *= 5
            mask = clamp(mask, 0.7, 1)
            n = (1 - Math.abs(Math.sin(n * mask))) ** 2
            n = clamp(n, oceanLvl, 1)
            pointOnCube.setMag(n * (maxs - mins) + mins)
            pointOnCube.add(p)
            var nc = [255 - (n - oceanLvl) / (1 - oceanLvl) * 255, 255, 0]
            if (n <= oceanLvl) nc = [0, 0, 200]
            points.push([createVector(pointOnCube.x, pointOnCube.y, pointOnCube.z), nc]) //add point
        }
    }
    for (let y = 0; y < r - 1; y++) {
        for (let x = 0; x < r - 1; x++) {
            var i = x + y * r
            verticies.push(new Triangle(points[triIndex + i][0], points[triIndex + i + 1][0], points[triIndex + i + r + 1][0], points[triIndex + i + 1][1]))
            verticies.push(new Triangle(points[triIndex + i][0], points[triIndex + r + i + 1][0], points[triIndex + i + r][0], points[triIndex + i][1]))
        }
    }
}

function HandleNoiseHeight(p, itt) {
    var pn = 0
    for (let i = 0; i < itt; i++) {
        pn += perlin.get(p.x * 2 ** i + (i * 10), p.y * 2 ** i + i * 15, p.z) / 2 ** i
    }
    return pn
}