var light
var cam

function createUserPlanet() {
    document.getElementById("userOption").style.visibility = "hidden"
    Planet(createVector(0, 0, 8), parseInt(document.getElementById("resolution").value), 2, 3, 0.5)
    update()
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    cam = new Camera()
    light = new Light()
        // Planet(createVector(0, 0, 8), 400, 2, 3, 0.5)
        // update()
}

function update() {
    background(130, 213, 213)
    render()
}

function draw() {
    keyDown()
}

function estimateRenderingTime() {
    var r = parseInt(document.getElementById("resolution").value)
    var start = new Date().getTime();
    for (i = 0; i < r; ++i) {
        var k = perlin.get(random(), random(), random())
        k = perlin.get(random(), random(), random())
    }
    var end = new Date().getTime();
    var time = end - start;
    alert('Calculate points position: ' + time * r / 100 + 's');
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