var light
var cam

function setup() {
    createCanvas(windowWidth, windowHeight);
    cam = new Camera()
    light = new Light()
    Planet(createVector(0, 0, 8), 30, 2, 3, 0.48)
    update()
}

function update() {
    background(130, 213, 213)
    render()
}

function draw() {
    keyDown()
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
    if (haveToRender) {
        update()
    }
}