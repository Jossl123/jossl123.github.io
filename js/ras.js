var light
var cam

function setup() {
    createCanvas(windowWidth, windowHeight);
    cam = new Camera()
    light = new Light()
    Sphere(createVector(1, 0, 5), 2, 10)
    Sphere(createVector(0, -3, 5), 1, 2)
    update()
}

function update() {
    background(130, 213, 213)
        // c1 = color(255);
        // c2 = color(63, 191, 191);

    // for (let y = 0; y < height; y++) {
    //     n = map(y, 0, height, 0, 1);
    //     let newc = lerpColor(c1, c2, n);
    //     stroke(newc);
    //     line(0, y, width, y);
    // }
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