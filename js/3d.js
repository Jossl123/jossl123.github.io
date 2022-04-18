var cam
var light

function setup() {
    createCanvas(windowWidth, windowHeight);
    cam = new Camera()
    light = new Light()
    for (let i = 0; i < 20; i++) {
        Cube(createVector(Math.floor(Math.random() * 10), 2, Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)), 1, [0, 200, 0])
    }
    update()
}

function update() {
    background(130, 213, 213)
    render()
}

function draw() {
    keyDown()
}