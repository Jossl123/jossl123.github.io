var curves = []
var dt = 0.01
var mat4x4Projection = [
    [],
    [],
    [],
    []
]

function setup() {
    createCanvas(windowWidth, windowHeight)
    background(255)
    curves.push(new Curve(10, 28, 8 / 3))
    fov = 90
    fovRad = 1 / (Math.tan(this.fov * 0.5 * Math.PI / 180))
    zNear = 0.1;
    zFar = 1000
    aRatioWH = windowHeight / windowWidth
    mat4x4Projection[0][0] = aRatioWH * fovRad
    mat4x4Projection[1][1] = fovRad
    mat4x4Projection[2][2] = zFar / (zFar - zNear)
    mat4x4Projection[2][3] = 1
    mat4x4Projection[3][2] = (-zFar * zNear) / (zFar - zNear)
}

function draw() {
    translate(windowWidth / 2, windowHeight / 2)
    for (let curve of curves) {
        curve.update()
    }
}

class Curve {
    constructor(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.pos = createVector(1, 1, 1)
    }
    update() {
        var dx = (this.pos.y - this.pos.x) * this.a * dt
        var dy = (this.b * this.pos.x - this.pos.y - this.pos.x * this.pos.z) * dt
        var dz = (this.pos.x * this.pos.y - this.c * this.pos.z) * dt
        this.pos.add(createVector(dx, dy, dz))
        fill(0)
        circle(this.pos.x * 10, this.pos.y * 10, 1)
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