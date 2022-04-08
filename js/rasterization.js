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
        var scalaireLight = ((light.pos.copy().sub(relativeTri[0])).dot(normalVector) / light.pos.mag()) / normalVector.mag();
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

function Sphere(p, s, r, c) {
    cplane(p, s, r, createVector(0, 1, 0), c)
    cplane(p, s, r, createVector(1, 0, 0), c)
    cplane(p, s, r, createVector(0, 0, 1), c)
    cplane(p, s, r, createVector(0, -1, 0), c)
    cplane(p, s, r, createVector(-1, 0, 0), c)
    cplane(p, s, r, createVector(0, 0, -1), c)
}

function clamp(n, min, max) {
    if (n > max) {
        return max;
    } else if (n < min) {
        return min
    } else {
        return n;
    }
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

function cplane(p, s, r, dir, c) {
    if (r <= 1) return
    var triIndex = points.length
    var vA = createVector(dir.y, dir.z, dir.x)
    var vB = vA.cross(dir)
    for (let y = 0; y < r; y++) {
        for (let x = 0; x < r; x++) {
            var percent = createVector(x, y).div(r - 1)
            var pointOnCube = dir.copy().add(vA.copy().mult((percent.x - 0.5) * 2)).add(vB.copy().mult((percent.y - 0.5) * 2)).mult(s / r)
            pointOnCube.setMag(s)
                //var n1 = 8 * noise(pointOnCube.x, pointOnCube.y, pointOnCube.z)
                //var n2 = 4 * noise(pointOnCube.x * 2, pointOnCube.y * 2, pointOnCube.z * 2)
                //var n3 = 2 * noise(pointOnCube.x * 4, pointOnCube.y * 4, pointOnCube.z * 4)
                //var n4 = noise(pointOnCube.x * 8, pointOnCube.y * 8, pointOnCube.z * 8)
                //pointOnCube.setMag(s + Math.sin((pointOnCube.x * pointOnCube.y) * 5) / 10) // cool ball
                //pointOnCube.setMag(s + Math.sin((pointOnCube.x + pointOnCube.y) * 5) / 10) // cool ball
                // var n = 0
                // for (let i = 1; i < 2; i++) {
                //     n += (1 - Math.sin(perlin.get((pointOnCube.x * pointOnCube.z + i * 100) / (4 / i), pointOnCube.y * pointOnCube.z / (4 / i)) / i)) ** 2
                // }
                //var n1 = perlin.get(pointOnCube.x * pointOnCube.z / 4, pointOnCube.y * pointOnCube.z / 4)
                //pointOnCube.setMag(s + (n1 + n2 + n3 + n4) / 4) // cool ball
            var pn = 0
            for (let i = 0; i < 6; i++) {
                pn += perlin.get(pointOnCube.x * pointOnCube.z / 2 * 2 ** i + i * 10, pointOnCube.y * pointOnCube.z / 2 * 2 ** i + i * 15) / 2 ** i
            }
            var oceanLvl = s / 6.5
            var n = (1 - Math.abs(Math.sin(pn))) ** 2
            n = Math.max(s + oceanLvl, s + n / 1.9)
            var nc = [(n - (s + oceanLvl)) * 255, 255, 0] // max value = 2/1.6*s
            if (n == s + oceanLvl) nc = [0, 0, 200]
            pointOnCube.setMag(n)
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

function rotateMatrixY(a) {
    return [
        [Math.cos(a), 0, Math.sin(a), 0],
        [0, 1, 0, 0],
        [-Math.sin(a), 0, Math.cos(a), 0],
        [0, 0, 0, 1]
    ]
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